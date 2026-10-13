#!/usr/bin/env node
/**
 * Premise application harness — runs the cases in `cases/premise.json` as
 * agent cells and grades each cell's first dependent action.
 *
 *   node route/evals/premise-harness.mjs run        --dry-run | --model M --max-cost-usd X
 *   node route/evals/premise-harness.mjs seed-check --dry-run | --model M --max-cost-usd X
 *   node route/evals/premise-harness.mjs judge      --dry-run | --model M --max-cost-usd X [--run DIR]
 *   node route/evals/premise-harness.mjs report     [--run DIR]
 *
 * Selection: --cases a,b  --arms none,paths,shipped,clause  --lengths short,long
 *            --reps N  --long-tokens N  --max-turns N  --protocols all|none
 *            --timeout-seconds N
 *
 * A cell is one case under one arm at one length, once. It lays out the
 * case's scaffold repository, writes a stored session whose head carries the
 * arm's session-start context and whose turns are the case's conversation
 * (behind a synthetic prefix at `long`), and resumes that session with the
 * case's prompt under `claude -p`, with the arm's copy of the route plugin
 * and every core protocol plugin loaded, in an empty CLAUDE_CONFIG_DIR. The
 * first dependent action is read off the stream-json trace offline
 * (harness/first-action.mjs).
 *
 * Why its own harness rather than `claude plugin eval` or a /realize cell:
 * `plugin eval` compares with and without a plugin and nothing else, has no
 * code grader to read a first action with, and its history replay is
 * undocumented; /realize measures a protocol's own contract and does not
 * load route. This harness borrows /realize's isolation pattern — an empty
 * config dir, plugins by --plugin-dir, per-run plugin copies built and
 * checked before use — and adds the seeded session (harness/seed-transcript.mjs).
 *
 * Spend. Nothing here calls a model without --model and --max-cost-usd. The
 * ceiling is checked before every launch against the sum of each finished
 * child's own `total_cost_usd`, and each child is given the remainder as its
 * --max-budget-usd. A child that reports no cost stops the run, since the
 * ceiling can no longer be enforced. --dry-run calls nothing: it builds and
 * checks the arms, renders every cell, and prints the matrix with an input
 * estimate per cell.
 *
 * Every cell's environment drops TYPESAFE_API_KEY (and the variable the
 * shipped evaluator binding names), so route's advisory line stays silent in
 * every arm alike. Results and work trees are not committed: results land in
 * `route/evals/premise-results/`, work trees under the system temp dir.
 *
 * Zero external dependencies: Node.js standard library only.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import { ARMS, buildArmPlugins, checkVariants, clauseBlock, evaluatorKeyEnv, renderPlugin, scrubbedEnv } from "./harness/arms.mjs";
import { firstAction, parseStream } from "./harness/first-action.mjs";
import { judgePrompt, parseVerdict } from "./harness/judge.mjs";
import { estimateTokens, syntheticPrefix } from "./harness/prefix.mjs";
import { renderReport } from "./harness/report.mjs";
import { layOut } from "./harness/scaffolds.mjs";
import { PROMPT as SEED_PROMPT, VARIANTS as SEED_VARIANTS, headLine, seedCheckVerdict, seedTokens, seedTurns } from "./harness/seed-check.mjs";
import { auditResume, buildSeed, readTranscript, seededMessageIds, transcriptPath, writeSeed } from "./harness/seed-transcript.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
const RESULTS_ROOT = path.join(HERE, "premise-results");

// The lengths a cell can be placed at. Each turns a case into the turns
// seeded before its prompt. A compaction cell — the same long conversation
// compacted just before the prompt, separating length from the compaction
// boundary — would be one more entry here, seeding a compaction boundary and
// its summary through seed-transcript.mjs; it is not built.
const LENGTHS = {
  short: (c) => c.conversation ?? [],
  long: (c, prefix) => [...prefix, ...(c.conversation ?? [])],
};

const DEFAULTS = { reps: 3, longTokens: 40000, maxTurns: 10, protocols: "all", timeoutSeconds: 900 };

// The tools a cell may use without a prompt; identical in every arm.
const ALLOWED_TOOLS = ["Read", "Grep", "Glob", "Bash", "Edit", "Write", "MultiEdit", "NotebookEdit", "Agent", "Task", "Skill", "TodoWrite"];

// A delegation is the graded action of a case, and the brief is in the call;
// running the subagent would spend on work no case grades. So every arm's
// settings deny the agent tools at the call, after the brief is on record.
const DENY_DELEGATION = {
  hooks: {
    PreToolUse: [{
      matcher: "^(Agent|Task|SendMessage)$",
      hooks: [{
        type: "command",
        command: `node -e 'process.stdout.write(JSON.stringify({hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:"Delegation is unavailable in this environment; the call was not executed."}}))'`,
      }],
    }],
  },
};

const HOST_FACTS = [
  "Children run with an empty CLAUDE_CONFIG_DIR still receive the hosting cloud session's remote context (remote system prompt, user email, credential_org, remote_session_change attachments) when run inside one; it is not stripped. hostAttachments in each result lists what the host added on resume.",
];

// ---------------------------------------------------------------- options

function options(argv) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      "dry-run": { type: "boolean", default: false },
      model: { type: "string" },
      "max-cost-usd": { type: "string" },
      cases: { type: "string" },
      arms: { type: "string" },
      lengths: { type: "string" },
      reps: { type: "string" },
      "long-tokens": { type: "string" },
      "max-turns": { type: "string" },
      protocols: { type: "string" },
      "timeout-seconds": { type: "string" },
      run: { type: "string" },
      rejudge: { type: "boolean", default: false },
    },
  });
  const csv = (v) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : null);
  const positive = (name, raw, fallback) => {
    if (raw === undefined) return fallback;
    const n = Number(raw);
    if (!Number.isFinite(n) || n <= 0) throw new Error(`--${name}: expected a positive number, got ${JSON.stringify(raw)}`);
    return n;
  };
  const o = {
    command: positionals[0],
    dryRun: values["dry-run"],
    model: values.model ?? null,
    maxCostUsd: values["max-cost-usd"] === undefined ? null : positive("max-cost-usd", values["max-cost-usd"]),
    cases: csv(values.cases),
    arms: csv(values.arms) ?? Object.keys(ARMS),
    lengths: csv(values.lengths) ?? Object.keys(LENGTHS),
    reps: Math.floor(positive("reps", values.reps, DEFAULTS.reps)),
    longTokens: Math.floor(positive("long-tokens", values["long-tokens"], DEFAULTS.longTokens)),
    maxTurns: Math.floor(positive("max-turns", values["max-turns"], DEFAULTS.maxTurns)),
    protocols: values.protocols ?? DEFAULTS.protocols,
    timeoutSeconds: positive("timeout-seconds", values["timeout-seconds"], DEFAULTS.timeoutSeconds),
    run: values.run ?? null,
    rejudge: values.rejudge,
  };
  for (const a of o.arms) if (!ARMS[a]) throw new Error(`unknown arm ${JSON.stringify(a)}; arms: ${Object.keys(ARMS).join(", ")}`);
  for (const l of o.lengths) if (!LENGTHS[l]) throw new Error(`unknown length ${JSON.stringify(l)}; lengths: ${Object.keys(LENGTHS).join(", ")}`);
  if (!["all", "none"].includes(o.protocols)) throw new Error(`--protocols: expected all or none, got ${JSON.stringify(o.protocols)}`);
  return o;
}

/** A spending command needs both a model and a ceiling; a dry run needs neither. */
function requireSpendFlags(o) {
  if (o.dryRun) return;
  const missing = [!o.model && "--model", !o.maxCostUsd && "--max-cost-usd"].filter(Boolean);
  if (missing.length) throw new Error(`${missing.join(" and ")} required: this command calls a model. Use --dry-run to see what it would run.`);
}

// ---------------------------------------------------------------- inputs

function loadCases(selected) {
  const all = JSON.parse(fs.readFileSync(path.join(HERE, "cases", "premise.json"), "utf8"));
  if (!selected) return all;
  const unknown = selected.filter((id) => !all.some((c) => c.id === id));
  if (unknown.length) throw new Error(`unknown case(s): ${unknown.join(", ")}`);
  return all.filter((c) => selected.includes(c.id));
}

function protocolDirs(which) {
  if (which === "none") return [];
  const require = createRequire(import.meta.url);
  const { protocolOrder } = require(path.join(REPO, "scripts", "load-protocols.js"));
  return protocolOrder({ projectRoot: REPO }).map((d) => path.join(REPO, d));
}

function marketplaceName() {
  return JSON.parse(fs.readFileSync(path.join(REPO, ".claude-plugin", "marketplace.json"), "utf8")).name;
}

function cliVersion() {
  const r = spawnSync("claude", ["--version"], { encoding: "utf8" });
  const m = r.status === 0 && /(\d+\.\d+\.\d+)/.exec(r.stdout || "");
  return m ? m[1] : null;
}

function gitOut(args, cwd = REPO) {
  const r = spawnSync("git", args, { cwd, encoding: "utf8" });
  return r.status === 0 ? r.stdout.trim() : null;
}

const repoKey = crypto.createHash("sha256").update(REPO).digest("hex").slice(0, 8);
const workBase = () => path.join(os.tmpdir(), `pe-${repoKey}`);
const shortHash = (s, n = 10) => crypto.createHash("sha256").update(s).digest("hex").slice(0, n);

// ---------------------------------------------------------------- arms

/** Builds and checks the arm copies; returns everything a cell needs from them. */
function prepareArms({ arms, protocols, workRoot, salt }) {
  const dirs = protocolDirs(protocols);
  const patches = [...new Set([...arms, "shipped"])];
  const plugins = buildArmPlugins({ repo: REPO, workRoot, arms: patches, protocolDirs: dirs, marketplace: marketplaceName(), salt });
  const env = scrubbedEnv(process.env, [evaluatorKeyEnv(REPO)].filter(Boolean));
  const rendered = Object.fromEntries(Object.entries(plugins).map(([patch, p]) => [patch, renderPlugin(p, env)]));
  const checks = checkVariants({ arms, rendered, plugins, expectTable: dirs.length > 0 });
  return { plugins, rendered, checks, protocolDirs: dirs };
}

// ---------------------------------------------------------------- cells

/** Every cell the selection names, rendered but not run. Interleaved so a stop leaves arms even. */
function planCells({ cases, arms, lengths, reps, longTokens }, prepared) {
  const prefix = lengths.includes("long") ? syntheticPrefix({ tokens: longTokens }) : [];
  const cells = [];
  for (let rep = 1; rep <= reps; rep++) {
    for (const c of cases) {
      for (const length of lengths) {
        for (const arm of arms) {
          const def = ARMS[arm];
          const plugin = prepared.plugins[def.patch];
          const head = [prepared.rendered[def.patch].session].filter(Boolean);
          const turns = LENGTHS[length](c, prefix);
          const prompt = def.clause ? `${c.prompt}\n\n${clauseBlock(c, plugin.premiseDir)}` : c.prompt;
          const estTokens = estimateTokens(head.join("\n")) + turns.reduce((s, t) => s + estimateTokens(t.text), 0) + estimateTokens(prompt);
          if (!c.scaffold) throw new Error(`${c.id}: no scaffold`);
          cells.push({ key: `${c.id}__${arm}__${length}__r${rep}`, case: c, arm, length, rep, plugin, head, turns, prompt, estTokens });
        }
      }
    }
  }
  return cells;
}

function printMatrix(o, cells, prepared, extra = []) {
  console.log(`arms     : ${o.arms.join(", ")}   lengths: ${o.lengths.join(", ")}   reps: ${o.reps}   long prefix: ~${o.longTokens} tokens   max turns: ${o.maxTurns}`);
  console.log(`protocols: ${prepared.protocolDirs.length ? prepared.protocolDirs.map((d) => path.basename(d)).join(", ") : "(none)"}`);
  console.log(`arm check: ${prepared.checks.length} conditions held`);
  for (const c of prepared.checks) console.log(`  ok  ${c}`);
  for (const line of extra) console.log(line);
  console.log("");
  const groups = new Map();
  for (const cell of cells) {
    const k = `${cell.case.id}\u0000${cell.arm}\u0000${cell.length}`;
    if (!groups.has(k)) groups.set(k, { case: cell.case.id, arm: cell.arm, length: cell.length, reps: 0, est: cell.estTokens });
    groups.get(k).reps++;
  }
  const w = Math.max(4, ...[...groups.values()].map((g) => g.case.length));
  console.log(`${"case".padEnd(w)}  ${"arm".padEnd(7)}  ${"length".padEnd(9)}  reps  est. input tokens/cell`);
  for (const g of groups.values()) console.log(`${g.case.padEnd(w)}  ${g.arm.padEnd(7)}  ${g.length.padEnd(9)}  ${String(g.reps).padStart(4)}  ${String(g.est).padStart(8)}`);
  const total = cells.reduce((s, c) => s + c.estTokens, 0);
  console.log("");
  console.log(`cells: ${cells.length}   est. seeded input tokens, all cells: ${total}`);
  console.log("Estimate = seeded head + seeded turns + prompt, characters / 4. The host's system prompt, tool definitions and skill listing come on top, the same in every arm, and every agentic turn re-reads the context.");
}

/** Lays out a cell's working tree and config dir; returns their paths. */
function layOutCell(workRoot, runId, key, scaffold) {
  const cellDir = path.join(workRoot, "c", shortHash(`${runId}:${key}`));
  fs.rmSync(cellDir, { recursive: true, force: true });
  const repoDir = path.join(cellDir, "w");
  const configDir = path.join(cellDir, "h");
  fs.mkdirSync(repoDir, { recursive: true });
  fs.mkdirSync(configDir, { recursive: true });
  if (scaffold) {
    layOut(scaffold, repoDir);
    const env = { ...process.env, GIT_AUTHOR_DATE: "2026-01-05T09:00:00Z", GIT_COMMITTER_DATE: "2026-01-05T09:00:00Z" };
    spawnSync("git", ["init", "-q"], { cwd: repoDir, env });
    spawnSync("git", ["add", "-A"], { cwd: repoDir, env });
    spawnSync("git", ["-c", "user.name=dev", "-c", "user.email=dev@example.invalid", "commit", "-qm", "initial"], { cwd: repoDir, env });
  }
  const settings = path.join(cellDir, "settings.json");
  fs.writeFileSync(settings, JSON.stringify(DENY_DELEGATION, null, 2));
  return { cellDir, cwd: fs.realpathSync(repoDir), configDir, settings };
}

/** Launches one resumed session; returns the trace, the seed and what the resume left. */
function launch({ o, cell, cwd, configDir, settings, protocolDirs: dirs, remaining, version }) {
  const sessionId = crypto.randomUUID();
  const seed = buildSeed({
    cwd, sessionId, head: cell.head, turns: cell.turns, model: o.model, version,
    hookCommand: 'node "${CLAUDE_PLUGIN_ROOT}/scripts/route-session.mjs"',
  });
  writeSeed(configDir, cwd, sessionId, seed);
  const args = [
    "-p", "--verbose", "--output-format", "stream-json",
    "--model", o.model,
    "--max-turns", String(cell.maxTurns ?? o.maxTurns),
    "--max-budget-usd", remaining.toFixed(2),
    "--permission-mode", "acceptEdits",
    "--allowed-tools", ALLOWED_TOOLS.join(","),
    "--settings", settings,
    "--plugin-dir", cell.plugin.routeDir,
    ...dirs.flatMap((d) => ["--plugin-dir", d]),
    "--add-dir", cell.plugin.premiseDir,
    "--resume", sessionId,
    cell.prompt,
  ];
  const env = { ...scrubbedEnv(process.env, [evaluatorKeyEnv(REPO)].filter(Boolean)), CLAUDE_CONFIG_DIR: configDir };
  const r = spawnSync("claude", args, { cwd, env, encoding: "utf8", maxBuffer: 256 * 1024 * 1024, timeout: o.timeoutSeconds * 1000 });
  const after = readTranscript(transcriptPath(configDir, cwd, sessionId));
  return { r, sessionId, seed, after, audit: auditResume(after, seed) };
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

function newRun(o, kind) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+$/, "");
  const runId = `${stamp}-${kind}-${(o.model ?? "dry").replace(/[^\w.-]/g, "_")}`;
  return { runId, workRoot: path.join(workBase(), runId), resultsDir: path.join(RESULTS_ROOT, runId) };
}

function baseManifest(o, runId, prepared, version) {
  return {
    runId, model: o.model, cliVersion: version, commit: gitOut(["rev-parse", "HEAD"]),
    routeVersion: JSON.parse(fs.readFileSync(path.join(REPO, "route", ".claude-plugin", "plugin.json"), "utf8")).version,
    arms: o.arms, lengths: o.lengths, reps: o.reps, cases: o.cases, longTokens: o.longTokens, maxTurns: o.maxTurns,
    protocols: prepared.protocolDirs.map((d) => path.basename(d)), maxCostUsd: o.maxCostUsd, spentUsd: 0,
    armChecks: prepared.checks, allowedTools: ALLOWED_TOOLS, hostFacts: [...HOST_FACTS],
    clauseArm: "the lead clause of each document the case's governs names, appended after the prompt in a system-reminder block",
  };
}

// ---------------------------------------------------------------- run

function run(o) {
  requireSpendFlags(o);
  const cases = loadCases(o.cases);
  const { runId, workRoot, resultsDir } = newRun(o, "run");
  const prepared = prepareArms({ arms: o.arms, protocols: o.protocols, workRoot, salt: runId });
  const cells = planCells({ ...o, cases }, prepared);
  if (o.dryRun) {
    printMatrix(o, cells, prepared);
    fs.rmSync(workRoot, { recursive: true, force: true });
    return;
  }
  const version = cliVersion();
  if (!version) throw new Error("`claude --version` failed; is the CLI on PATH?");
  const manifest = baseManifest({ ...o, cases: cases.map((c) => c.id) }, runId, prepared, version);
  writeJson(path.join(resultsDir, "manifest.json"), manifest);
  console.log(`run ${runId}: ${cells.length} cells, ceiling $${o.maxCostUsd}`);
  for (const cell of cells) {
    const remaining = o.maxCostUsd - manifest.spentUsd;
    if (remaining < 0.01) {
      manifest.stopped = `ceiling reached before ${cell.key}`;
      console.log(`stopping: $${manifest.spentUsd.toFixed(4)} spent of $${o.maxCostUsd}`);
      break;
    }
    process.stdout.write(`${cell.key} ... `);
    const laid = layOutCell(workRoot, runId, cell.key, cell.case.scaffold);
    const { r, sessionId, seed, after, audit } = launch({ o, cell, ...laid, protocolDirs: prepared.protocolDirs, remaining, version });
    const base = path.join(resultsDir, "cells", cell.key);
    fs.mkdirSync(path.dirname(base), { recursive: true });
    fs.writeFileSync(`${base}.trace.jsonl`, r.stdout || "");
    if (r.stderr) fs.writeFileSync(`${base}.stderr.txt`, r.stderr);
    fs.writeFileSync(`${base}.transcript.jsonl`, after.map((e) => JSON.stringify(e)).join("\n") + "\n");
    const ext = firstAction(parseStream(r.stdout), { ignore: seededMessageIds(seed) });
    const cost = ext.result?.total_cost_usd;
    const result = {
      cell: cell.key, case: cell.case.id, arm: cell.arm, length: cell.length, rep: cell.rep, model: o.model, sessionId,
      launchFailed: !ext.result, exit: r.status,
      action: ext.action, before: ext.before,
      observations: ext.observations.map((ob) => ({ ...ob, premise: !!ob.target && ob.target.startsWith(cell.plugin.premiseDir) })),
      stop: ext.result ? { subtype: ext.result.subtype, numTurns: ext.result.num_turns, isError: ext.result.is_error } : null,
      costUsd: typeof cost === "number" ? cost : null,
      audit, integrity: audit.sessionStartInjected === 0 && audit.seededIntact ? [] : ["seeded head not alone: see audit"],
      plugins: ext.init?.plugins ?? null,
      redactions: [[laid.cwd, "<repo>"], [cell.plugin.root, "<plugins>"]],
      judge: null, human: null,
    };
    writeJson(`${base}.json`, result);
    for (const t of audit.hostAttachments) if (!manifest.hostAttachments?.includes(t)) (manifest.hostAttachments ??= []).push(t);
    if (typeof cost !== "number") {
      manifest.stopped = `${cell.key} reported no cost (exit ${r.status}); the ceiling cannot be enforced past it`;
      writeJson(path.join(resultsDir, "manifest.json"), manifest);
      console.log("NO COST REPORTED — stopping");
      process.exitCode = 1;
      return;
    }
    manifest.spentUsd += cost;
    writeJson(path.join(resultsDir, "manifest.json"), manifest);
    console.log(`${ext.action.kind}${ext.action.tool ? `:${ext.action.tool}` : ""} ($${cost.toFixed(4)}; total $${manifest.spentUsd.toFixed(4)})`);
  }
  writeJson(path.join(resultsDir, "manifest.json"), manifest);
  console.log(`results: ${resultsDir}`);
}

// ---------------------------------------------------------------- seed check

function seedCheck(o) {
  requireSpendFlags(o);
  const { runId, workRoot, resultsDir } = newRun(o, "seedcheck");
  const prepared = prepareArms({ arms: ["shipped"], protocols: o.protocols, workRoot, salt: runId });
  const plugin = prepared.plugins["as-shipped"];
  const prefix = syntheticPrefix({ tokens: o.longTokens });
  const tokens = seedTokens(runId);
  const cells = SEED_VARIANTS.map((variant) => {
    const head = [prepared.rendered["as-shipped"].session, headLine(tokens)].filter(Boolean);
    const turns = seedTurns(variant, tokens, prefix);
    return {
      key: `seed-check__${variant}`, variant, plugin, head, turns, prompt: SEED_PROMPT, maxTurns: 2,
      estTokens: estimateTokens(head.join("\n")) + turns.reduce((s, t) => s + estimateTokens(t.text), 0) + estimateTokens(SEED_PROMPT),
    };
  });
  if (o.dryRun) {
    console.log(`seed-check cells (shipped arm, max turns 2), long prefix ~${o.longTokens} tokens:`);
    for (const c of cells) console.log(`  ${c.key.padEnd(22)} turns ${String(c.turns.length).padStart(3)}  est. input tokens ${c.estTokens}`);
    console.log(`passes when: ${["head context read", "first seeded turn read", "last seeded turn read", "seeded entries intact after resume", "no session-start context injected at resume", "per-prompt route directive delivered"].join("; ")}`);
    fs.rmSync(workRoot, { recursive: true, force: true });
    return;
  }
  const version = cliVersion();
  if (!version) throw new Error("`claude --version` failed; is the CLI on PATH?");
  const manifest = { ...baseManifest(o, runId, prepared, version), kind: "seed-check", tokens };
  let pass = true;
  for (const cell of cells) {
    const remaining = o.maxCostUsd - manifest.spentUsd;
    if (remaining < 0.01) { manifest.stopped = `ceiling reached before ${cell.key}`; pass = false; break; }
    const laid = layOutCell(workRoot, runId, cell.key, null);
    const { r, seed, after, audit } = launch({ o, cell, ...laid, protocolDirs: prepared.protocolDirs, remaining, version });
    const events = parseStream(r.stdout);
    const result = [...events].reverse().find((e) => e.type === "result");
    const verdict = seedCheckVerdict({ variant: cell.variant, tokens, reply: result?.result ?? "", audit });
    const base = path.join(resultsDir, cell.key);
    fs.writeFileSync(`${base}.trace.jsonl`, r.stdout || "");
    fs.writeFileSync(`${base}.transcript.jsonl`, after.map((e) => JSON.stringify(e)).join("\n") + "\n");
    writeJson(`${base}.json`, { cell: cell.key, variant: cell.variant, seededEntries: seed.length, reply: result?.result ?? null, costUsd: result?.total_cost_usd ?? null, ...verdict });
    console.log(`${cell.key}: ${verdict.pass ? "PASS" : "FAIL"}`);
    for (const c of verdict.checks) console.log(`  ${c.ok ? "ok  " : "FAIL"} ${c.name}${c.ok ? "" : ` (got ${JSON.stringify(c.got)}, want ${JSON.stringify(c.want)})`}`);
    if (verdict.hostAttachments.length) console.log(`  host added: ${verdict.hostAttachments.join(", ")}`);
    pass &&= verdict.pass;
    if (typeof result?.total_cost_usd !== "number") { manifest.stopped = `${cell.key} reported no cost`; pass = false; break; }
    manifest.spentUsd += result.total_cost_usd;
  }
  manifest.pass = pass;
  writeJson(path.join(resultsDir, "manifest.json"), manifest);
  console.log(`seed-check ${pass ? "PASSED" : "FAILED"} — ${resultsDir}`);
  if (!pass) process.exitCode = 1;
}

// ---------------------------------------------------------------- judge and report

function runDir(o) {
  if (o.run) return path.resolve(o.run);
  const runs = fs.existsSync(RESULTS_ROOT) ? fs.readdirSync(RESULTS_ROOT).filter((d) => d.includes("-run-")).sort() : [];
  if (!runs.length) throw new Error(`no run under ${RESULTS_ROOT}; pass --run DIR`);
  return path.join(RESULTS_ROOT, runs[runs.length - 1]);
}

function readResults(dir) {
  const cellsDir = path.join(dir, "cells");
  if (!fs.existsSync(cellsDir)) return [];
  return fs.readdirSync(cellsDir).filter((f) => f.endsWith(".json")).sort()
    .map((f) => ({ file: path.join(cellsDir, f), ...JSON.parse(fs.readFileSync(path.join(cellsDir, f), "utf8")) }));
}

function judge(o) {
  requireSpendFlags(o);
  const dir = runDir(o);
  const cases = new Map(loadCases(null).map((c) => [c.id, c]));
  const todo = readResults(dir).filter((r) => !r.launchFailed && (o.rejudge || !r.judge?.verdict));
  if (o.dryRun) {
    console.log(`${todo.length} cell(s) in ${dir} would be judged.`);
    if (todo[0]) console.log(`\n--- judge prompt for one of them ---\n${judgePrompt(cases.get(todo[0].case), todo[0], todo[0].redactions)}`);
    return;
  }
  const manifestFile = path.join(dir, "manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
  let spent = 0;
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "pe-judge-"));
  try {
    for (const r of todo) {
      const remaining = o.maxCostUsd - spent;
      if (remaining < 0.01) { console.log(`stopping: $${spent.toFixed(4)} spent of $${o.maxCostUsd}`); break; }
      const prompt = judgePrompt(cases.get(r.case), r, r.redactions);
      const env = { ...scrubbedEnv(process.env, [evaluatorKeyEnv(REPO)].filter(Boolean)), CLAUDE_CONFIG_DIR: path.join(scratch, "h") };
      const out = spawnSync("claude", ["-p", "--output-format", "json", "--model", o.model, "--max-turns", "1", "--tools", "", "--no-session-persistence", "--max-budget-usd", remaining.toFixed(2), prompt],
        { cwd: scratch, env, encoding: "utf8", maxBuffer: 16 * 1024 * 1024, timeout: o.timeoutSeconds * 1000 });
      let parsed = null;
      try { parsed = JSON.parse(out.stdout); } catch {}
      if (typeof parsed?.total_cost_usd !== "number") { console.log(`${r.cell}: judge reported no cost — stopping`); process.exitCode = 1; break; }
      spent += parsed.total_cost_usd;
      const v = parseVerdict(parsed.result);
      const { file, ...rest } = r;
      writeJson(file, { ...rest, judge: { model: o.model, ...v, costUsd: parsed.total_cost_usd, promptDigest: shortHash(prompt, 16) } });
      console.log(`${r.cell}: ${v.verdict ?? "no verdict"}`);
    }
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }
  manifest.judgeSpentUsd = (manifest.judgeSpentUsd ?? 0) + spent;
  writeJson(manifestFile, manifest);
}

function report(o) {
  const dir = runDir(o);
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, "manifest.json"), "utf8"));
  const text = renderReport({ manifest, results: readResults(dir) });
  fs.writeFileSync(path.join(dir, "report.md"), text);
  process.stdout.write(text);
}

// ---------------------------------------------------------------- main

const COMMANDS = { run, "seed-check": seedCheck, judge, report };

function main(argv = process.argv.slice(2)) {
  let o;
  try {
    o = options(argv);
    const command = COMMANDS[o.command];
    if (!command) throw new Error(`usage: premise-harness.mjs <${Object.keys(COMMANDS).join("|")}> [--dry-run] [--model M --max-cost-usd X] ...`);
    command(o);
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  }
}

export { ALLOWED_TOOLS, DENY_DELEGATION, LENGTHS, options, planCells, prepareArms, requireSpendFlags };

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main();
