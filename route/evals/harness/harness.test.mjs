// Tests for the premise application harness — everything that can be checked
// without calling a model: the seeded session's shape, the arm copies and
// their check, first-action extraction over hand-written traces, the blind
// judge prompt and verdict reading, the seed-check verdict, the report, the
// prefix generator, the scaffolds, and the spend guards.
// Run with: node --test

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { ARMS, checkVariants, evaluatorKeyEnv, patchSource, scrubbedEnv, withoutSessionStart } from "./arms.mjs";
import { DEPENDENT_TOOLS, describeAction, dirtyAfter, firstAction, parseStream } from "./first-action.mjs";
import { finalVerdict, judgePrompt, parseVerdict } from "./judge.mjs";
import { estimateTokens, syntheticPrefix } from "./prefix.mjs";
import { renderReport, tally } from "./report.mjs";
import { SCAFFOLDS, layOut } from "./scaffolds.mjs";
import { readAnswer, seedCheckVerdict, seedTokens, seedTurns } from "./seed-check.mjs";
import { auditResume, buildSeed, projectSlug, readTranscript, seededMessageIds, transcriptPath, writeSeed } from "./seed-transcript.mjs";
import { DENY_DELEGATION, LENGTHS, options, planCells, prepareArms, requireSpendFlags } from "../premise-harness.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CASES = JSON.parse(fs.readFileSync(path.join(HERE, "..", "cases", "premise.json"), "utf8"));
const tmp = (p) => fs.mkdtempSync(path.join(os.tmpdir(), p));

// ---------------------------------------------------------------- seeded session

test("a seed puts the session-start context at the head, then the turns, chained", () => {
  const entries = buildSeed({
    cwd: "/w/repo", sessionId: "s1", head: ["TABLE\nINDEX"], hookCommand: "node hook.mjs",
    turns: [{ role: "user", text: "hi" }, { role: "assistant", text: "hello" }], model: "m", now: Date.parse("2026-01-01T00:10:00Z"),
  });
  assert.deepEqual(entries.map((e) => e.type), ["attachment", "attachment", "user", "assistant"]);
  assert.equal(entries[0].parentUuid, null);
  for (let i = 1; i < entries.length; i++) assert.equal(entries[i].parentUuid, entries[i - 1].uuid);
  assert.equal(entries[0].attachment.type, "hook_success");
  assert.equal(entries[1].attachment.type, "hook_additional_context");
  assert.equal(entries[1].attachment.hookEvent, "SessionStart");
  assert.deepEqual(entries[1].attachment.content, ["TABLE\nINDEX"]);
  assert.equal(entries[2].message.content, "hi");
  assert.deepEqual(entries[3].message.content, [{ type: "text", text: "hello" }]);
  assert.equal(entries[3].message.model, "m");
  assert.ok(entries.every((e) => e.sessionId === "s1" && e.cwd === "/w/repo" && e.isSidechain === false));
  assert.ok(Date.parse(entries.at(-1).timestamp) < Date.parse("2026-01-01T00:10:00Z"));
  assert.deepEqual([...seededMessageIds(entries)], [entries[3].message.id]);
});

test("an empty head seeds no hook entries", () => {
  const entries = buildSeed({ cwd: "/w", sessionId: "s", head: [""], turns: [{ role: "user", text: "x" }], model: "m" });
  assert.deepEqual(entries.map((e) => e.type), ["user"]);
  assert.throws(() => buildSeed({ cwd: "/w", sessionId: "s", turns: [{ role: "system", text: "x" }], model: "m" }));
});

test("a seed is written where the host looks for the session", () => {
  const dir = tmp("pe-seed-");
  try {
    assert.equal(projectSlug("/tmp/pe-1/c/ab.cd/w"), "-tmp-pe-1-c-ab-cd-w");
    const entries = buildSeed({ cwd: "/tmp/x_y", sessionId: "abc", head: ["H"], model: "m" });
    const file = writeSeed(dir, "/tmp/x_y", "abc", entries);
    assert.equal(file, path.join(dir, "projects", "-tmp-x-y", "abc.jsonl"));
    assert.equal(transcriptPath(dir, "/tmp/x_y", "abc"), file);
    assert.deepEqual(readTranscript(file), entries);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("the resume audit counts a second session-start injection and records what the host added", () => {
  const seed = buildSeed({ cwd: "/w", sessionId: "s", head: ["H"], turns: [{ role: "user", text: "q" }, { role: "assistant", text: "a" }], model: "m" });
  const ctx = (event, content) => ({ type: "attachment", uuid: `u-${event}-${content}`, attachment: { type: "hook_additional_context", hookEvent: event, content: [content] } });
  const clean = [...seed, ctx("UserPromptSubmit", "[route] directive"), { type: "attachment", uuid: "e1", attachment: { type: "credential_org" } }, { type: "user", uuid: "p" }];
  const a = auditResume(clean, seed);
  assert.equal(a.seededIntact, true);
  assert.equal(a.sessionStartInjected, 0);
  assert.deepEqual(a.promptContexts, ["[route] directive"]);
  assert.deepEqual(a.hostAttachments, ["credential_org"]);
  const injected = auditResume([...seed, ctx("SessionStart", "H again")], seed);
  assert.equal(injected.sessionStartInjected, 1);
  assert.equal(auditResume(seed.slice(1), seed).seededIntact, false);
});

// ---------------------------------------------------------------- first action

const asst = (id, ...content) => ({ type: "assistant", message: { id, content } });
const toolUse = (name, input = {}) => ({ type: "tool_use", id: `t-${name}`, name, input });
const text = (t) => ({ type: "text", text: t });
const init = { type: "system", subtype: "init", plugins: [{ name: "route" }] };
const result = (extra = {}) => ({ type: "result", subtype: "success", total_cost_usd: 0.01, num_turns: 3, is_error: false, ...extra });

test("reads before a write are observations; the write is the action", () => {
  const events = [init, asst("m1", toolUse("Read", { file_path: "/w/config/limits.json" })), { type: "user", message: { content: [{ type: "tool_result" }] } },
    asst("m2", text("Updating the copy."), toolUse("Edit", { file_path: "/w/site/pricing.md", old_string: "3", new_string: "TBD" })), result()];
  const r = firstAction(events);
  assert.deepEqual(r.action, { kind: "tool", tool: "Edit", input: { file_path: "/w/site/pricing.md", old_string: "3", new_string: "TBD" } });
  assert.deepEqual(r.observations, [{ tool: "Read", target: "/w/config/limits.json" }]);
  assert.deepEqual(r.before, ["Updating the copy."]);
  assert.equal(r.result.total_cost_usd, 0.01);
  assert.equal(r.init.plugins[0].name, "route");
});

test("a text-only message stands in for the action when no write comes first", () => {
  const events = [asst("m1", text("Let me check the release script."), toolUse("Bash", { command: "node scripts/release.js --dry-run" })),
    asst("m2", text("Not yet: the dry run writes dist/manifest.json.")), asst("m3", toolUse("Edit", { file_path: "x" })), result()];
  const r = firstAction(events);
  assert.equal(r.action.kind, "text");
  assert.match(r.action.text, /writes dist/);
  assert.deepEqual(r.observations, [{ tool: "Bash", target: "node scripts/release.js --dry-run" }]);
  assert.deepEqual(r.before, ["Let me check the release script."]);
});

test("a delegation is the action, with its brief", () => {
  const r = firstAction([asst("m1", toolUse("Skill", { skill: "route" })), asst("m2", toolUse("Agent", { description: "split tokenizer", prompt: "brief" })), result()]);
  assert.deepEqual(r.action, { kind: "tool", tool: "Agent", input: { description: "split tokenizer", prompt: "brief" } });
  assert.deepEqual(r.observations, [{ tool: "Skill", target: "route" }]);
  assert.ok(["Edit", "Write", "MultiEdit", "NotebookEdit", "Agent", "Task", "SendMessage"].every((t) => DEPENDENT_TOOLS.has(t)));
});

test("blocks of one message split across events are read as one message", () => {
  const r = firstAction([asst("m1", text("Recording the decision.")), asst("m1", toolUse("Write", { file_path: "docs/decisions/0002.md", content: "c" })), result()]);
  assert.equal(r.action.tool, "Write");
  assert.deepEqual(r.before, ["Recording the decision."]);
});

test("a subagent's events, seeded turns, and a shell call the tree probe did not mark are not the agent's action", () => {
  const events = [
    asst("msg_seed_1", text("seeded reply")),
    { type: "assistant", parent_tool_use_id: "t-Agent", message: { id: "sub", content: [toolUse("Edit", { file_path: "y" })] } },
    asst("m1", toolUse("Bash", { command: "echo 1 > config/limits.json" })),
    result({ subtype: "error_max_turns" }),
  ];
  const r = firstAction(events, { ignore: new Set(["msg_seed_1"]) });
  assert.deepEqual(r.action, { kind: "none" });
  assert.deepEqual(r.observations, [{ tool: "Bash", target: "echo 1 > config/limits.json" }]);
  assert.equal(r.result.subtype, "error_max_turns");
});

test("the first shell call after which the tree was dirty is the action; reads naming the same file stay observations", () => {
  const read = { ...toolUse("Bash", { command: "cat config/limits.json" }), id: "t-read" };
  const write = { ...toolUse("Bash", { command: "sed -i 's/3/1/' config/limits.json" }), id: "t-write" };
  const log = [JSON.stringify({ toolUseId: "t-read", dirty: false }), "not json", JSON.stringify({ toolUseId: "t-write", dirty: true })].join("\n");
  const dirty = dirtyAfter(log);
  assert.deepEqual([...dirty], ["t-write"]);
  const r = firstAction([asst("m1", read), asst("m2", write), asst("m3", text("Drafted at 1.")), result()], { dirtyAfter: dirty });
  assert.deepEqual(r.action, { kind: "tool", tool: "Bash", input: { command: "sed -i 's/3/1/' config/limits.json" } });
  assert.deepEqual(r.observations, [{ tool: "Bash", target: "cat config/limits.json" }]);
  assert.deepEqual([...dirtyAfter("")], []);
});

test("the tree probe logs whether the cell's tree differs from its commit after a call", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "probe-"));
  try {
    const git = (...a) => spawnSync("git", a, { cwd: dir, encoding: "utf8" });
    git("init", "-q");
    fs.writeFileSync(path.join(dir, "a.txt"), "3\n");
    git("add", "-A");
    git("-c", "user.name=t", "-c", "user.email=t@example.invalid", "commit", "-qm", "i");
    const log = path.join(dir, "..", `${path.basename(dir)}.tree.jsonl`);
    const probe = (id) => spawnSync(process.execPath, [path.join(HERE, "tree-probe.mjs"), log], { input: JSON.stringify({ tool_use_id: id, cwd: dir }), encoding: "utf8" });
    assert.equal(probe("t1").stdout, "");
    fs.writeFileSync(path.join(dir, "a.txt"), "1\n");
    probe("t2");
    assert.deepEqual([...dirtyAfter(fs.readFileSync(log, "utf8"))], ["t2"]);
    fs.rmSync(log, { force: true });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("a stream is parsed line by line, skipping what does not parse", () => {
  assert.deepEqual(parseStream('{"a":1}\nnot json\n\n{"b":2}\n'), [{ a: 1 }, { b: 2 }]);
  assert.match(describeAction({ kind: "tool", tool: "Agent", input: { prompt: "do x" } }), /Tool call: Agent\nprompt:\ndo x/);
  assert.match(describeAction({ kind: "none" }), /no dependent action/);
});

// ---------------------------------------------------------------- judge

test("the judge prompt is blind to the cell and to what was read", () => {
  const c = CASES.find((x) => x.id === "accept-done-with-unmet-criterion");
  const r = {
    cell: "SENTINEL-CELL", arm: "SENTINEL-ARM", length: "SENTINEL-LENGTH",
    action: { kind: "text", text: "Ready to merge; see /tmp/pe-1/c/abc/w/scripts/release.js" },
    before: [], observations: [{ tool: "Read", target: "/tmp/pe-1/p-123/premise/verification-discipline.md", premise: true }],
  };
  const prompt = judgePrompt(c, r, [["/tmp/pe-1/c/abc/w", "<repo>"], ["/tmp/pe-1/p-123", "<plugins>"]]);
  for (const s of ["SENTINEL", "verification-discipline.md", "/tmp/pe-1"]) assert.ok(!prompt.includes(s), `prompt leaks ${s}`);
  assert.ok(prompt.includes("<repo>/scripts/release.js"));
  for (const k of ["moment", "prompt", "firstAction", "pass", "fail"]) assert.ok(prompt.includes(c[k]), `prompt carries ${k}`);
  for (const t of c.conversation) assert.ok(prompt.includes(t.text));
});

test("a verdict is read from the judge's reply, and a person's verdict stands over it", () => {
  assert.deepEqual(parseVerdict('Sure.\n{"verdict": "fail", "reason": "relayed on the agent\'s word"}'), { verdict: "fail", reason: "relayed on the agent's word" });
  assert.deepEqual(parseVerdict('```json\n{"verdict":"pass","reason":"x {y}"}\n```'), { verdict: "pass", reason: "x {y}" });
  assert.equal(parseVerdict('{"verdict": "maybe"}').verdict, null);
  assert.equal(parseVerdict("no json").verdict, null);
  assert.deepEqual(finalVerdict({ judge: { verdict: "pass" }, human: { verdict: "fail" } }), { verdict: "fail", by: "human" });
  assert.deepEqual(finalVerdict({ judge: { verdict: "pass" }, human: null }), { verdict: "pass", by: "judge" });
  assert.deepEqual(finalVerdict({ judge: null, human: null }), { verdict: null, by: null });
});

// ---------------------------------------------------------------- seed check

test("the seed check passes only when every seeded end was read and nothing was re-injected", () => {
  const tokens = seedTokens("t");
  const audit = { seededIntact: true, sessionStartInjected: 0, promptContexts: ["[route] When a request"], hostAttachments: ["credential_org"] };
  const reply = `HEAD=${tokens.head}\nFIRST=${tokens.first}\nLAST=${tokens.last}`;
  const ok = seedCheckVerdict({ variant: "short", tokens, reply, audit });
  assert.equal(ok.pass, true);
  assert.deepEqual(ok.hostAttachments, ["credential_org"]);
  assert.equal(seedCheckVerdict({ variant: "short", tokens, reply, audit: { ...audit, sessionStartInjected: 1 } }).pass, false);
  assert.equal(seedCheckVerdict({ variant: "short", tokens, reply: reply.replace(tokens.head, "NONE"), audit }).pass, false);
  assert.equal(seedCheckVerdict({ variant: "short", tokens, reply, audit: { ...audit, promptContexts: [] } }).pass, false);
  assert.equal(seedCheckVerdict({ variant: "head-only", tokens, reply: `HEAD=${tokens.head}\nFIRST=NONE\nLAST=NONE`, audit }).pass, true);
  assert.deepEqual(readAnswer("**HEAD=abc**\n FIRST = `x`.\n"), { HEAD: "abc", FIRST: "x" });
});

test("the long seed-check variant puts the tokens at both ends of the prefix", () => {
  const tokens = seedTokens("t");
  const prefix = [{ role: "user", text: "p" }, { role: "assistant", text: "q" }];
  const turns = seedTurns("long", tokens, prefix);
  assert.match(turns[0].text, new RegExp(tokens.first));
  assert.match(turns.at(-1).text, new RegExp(tokens.last));
  assert.deepEqual(turns.slice(2, 4), prefix);
  assert.deepEqual(seedTurns("head-only", tokens, prefix), []);
});

// ---------------------------------------------------------------- report

test("the report counts per cell, keeps the control apart, and lists disagreements", () => {
  const results = [
    { cell: "a1", case: "delegate-without-shared-context", arm: "none", length: "short", action: { kind: "tool" }, judge: { verdict: "fail" }, human: null, observations: [] },
    { cell: "a2", case: "delegate-without-shared-context", arm: "shipped", length: "short", action: { kind: "tool" }, judge: { verdict: "fail" }, human: { verdict: "pass", reason: "brief carries all three" }, observations: [{ premise: true }] },
    { cell: "a3", case: "delegate-without-shared-context", arm: "shipped", length: "short", action: { kind: "none" }, judge: null, human: null, observations: [] },
    { cell: "c1", case: "control-reading-relay", arm: "shipped", length: "short", action: { kind: "text" }, judge: { verdict: "pass" }, human: null, observations: [] },
    { cell: "x", case: "control-reading-relay", arm: "none", length: "long", launchFailed: true },
  ];
  const rows = tally(results);
  const shipped = rows.find((r) => r.arm === "shipped" && r.case === "delegate-without-shared-context");
  assert.deepEqual({ n: shipped.n, pass: shipped.pass, pending: shipped.pending, noAction: shipped.noAction, premiseReadFirst: shipped.premiseReadFirst, judgeOnly: shipped.judgeOnly },
    { n: 2, pass: 1, pending: 1, noAction: 1, premiseReadFirst: 1, judgeOnly: 0 });
  assert.equal(rows.find((r) => r.length === "long").failed, 1);
  const text = renderReport({ manifest: { runId: "r", spentUsd: 0.5, hostFacts: ["fact"] }, results });
  const [cases, control] = text.split("## Control, counted apart");
  assert.ok(!cases.includes("control-reading-relay"));
  assert.ok(control.includes("control-reading-relay"));
  assert.match(text, /a2: judge fail, person pass/);
  assert.match(text, /## Host facts\n\n- fact/);
  assert.ok(!/net|delta/i.test(text.replace(/nothing is summed across cases or netted between arms/, "")));
});

// ---------------------------------------------------------------- prefix and scaffolds

test("the prefix is deterministic, about the size asked, and names no scaffold file", () => {
  const a = syntheticPrefix({ tokens: 5000 });
  assert.deepEqual(a, syntheticPrefix({ tokens: 5000 }));
  assert.notDeepEqual(a, syntheticPrefix({ tokens: 5000, seed: 7 }));
  const size = a.reduce((s, t) => s + estimateTokens(t.text), 0);
  assert.ok(size >= 5000 && size < 7000, `size ${size}`);
  assert.equal(a[0].role, "user");
  assert.equal(a.at(-1).role, "assistant");
  assert.ok(a.every((t, i) => t.role === (i % 2 ? "assistant" : "user")));
  const files = Object.values(SCAFFOLDS).flatMap((s) => Object.keys(s)).filter((f) => f.includes("/"));
  for (const t of syntheticPrefix({ tokens: 40000 })) for (const f of files) assert.ok(!t.text.includes(f), `prefix names ${f}`);
  assert.deepEqual(syntheticPrefix({ tokens: 0 }), []);
});

test("scaffolds lay out, and the release scaffold writes dist/ before its dry-run return", () => {
  const dir = tmp("pe-scaffold-");
  try {
    layOut("release", dir);
    const src = fs.readFileSync(path.join(dir, "scripts", "release.js"), "utf8");
    const main = src.slice(src.indexOf("export function main"));
    assert.ok(main.indexOf("writeManifest(p)") < main.indexOf("if (dryRun)"), "the write precedes the early return");
    assert.throws(() => layOut("nope", dir), /unknown scaffold/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// ---------------------------------------------------------------- arms

test("an arm patch fails closed when its anchor has moved", () => {
  assert.throws(() => patchSource("function other() {}", "no-lead"), /anchor/);
  assert.equal(patchSource("x", "as-shipped"), "x");
  assert.match(patchSource("a\nfunction readLead(file, e) {\n  try {", "no-lead"), /readLead\(file, e\) \{\n {2}return "";/);
  assert.match(patchSource("function line(root, e) {\n  const file", "lead-only"), /line\(root, e\) \{\n {2}return quoted\(path\.join\(root, e\.file\), e\)\.trim\(\);/);
  assert.throws(() => withoutSessionStart(JSON.stringify({ hooks: {} })), /no SessionStart/);
  const h = JSON.parse(withoutSessionStart(JSON.stringify({ description: "d", hooks: { SessionStart: [], PreToolUse: [] } })));
  assert.deepEqual(Object.keys(h.hooks), ["PreToolUse"]);
});

test("every arm builds from this checkout and renders what it is defined to", () => {
  const work = tmp("pe-arms-");
  try {
    const prepared = prepareArms({ arms: Object.keys(ARMS), protocols: "all", workRoot: work, salt: "test" });
    assert.ok(prepared.checks.length > 0);
    for (const p of Object.values(prepared.plugins)) {
      const hooks = JSON.parse(fs.readFileSync(path.join(p.routeDir, "hooks", "hooks.json"), "utf8"));
      assert.ok(!hooks.hooks.SessionStart && hooks.hooks.UserPromptSubmit && hooks.hooks.PreToolUse && hooks.hooks.SubagentStart);
      assert.ok(!fs.existsSync(path.join(p.routeDir, "evals")));
      assert.ok(!/none|paths|shipped|clause/.test(path.basename(p.root)), "no arm name in a visible path");
    }
    // A variant rendering what shipped renders is refused.
    const same = { ...prepared.rendered, "no-lead": prepared.rendered["as-shipped"] };
    assert.throws(() => checkVariants({ arms: ["paths"], rendered: same, plugins: prepared.plugins }), /refusing to run/);
    const cells = planCells({ cases: CASES, arms: Object.keys(ARMS), lengths: Object.keys(LENGTHS), reps: 2, longTokens: 2000 }, prepared);
    assert.equal(cells.length, CASES.length * Object.keys(ARMS).length * Object.keys(LENGTHS).length * 2);
    const clause = cells.find((c) => c.arm === "clause");
    assert.ok(clause.prompt.startsWith(clause.case.prompt) && clause.prompt.includes("<system-reminder>"));
    assert.ok(cells.filter((c) => c.arm !== "clause").every((c) => c.prompt === c.case.prompt));
    const none = cells.find((c) => c.arm === "none" && c.length === "short");
    assert.ok(!none.head.join("").includes("Collaboration premises"));
    const long = cells.find((c) => c.length === "long" && c.case.conversation);
    assert.deepEqual(long.turns.slice(-long.case.conversation.length), long.case.conversation);
  } finally {
    fs.rmSync(work, { recursive: true, force: true });
  }
});

// ---------------------------------------------------------------- spend guards

test("nothing that spends runs without a model and a ceiling", () => {
  assert.throws(() => requireSpendFlags(options(["run"])), /--model and --max-cost-usd required/);
  assert.throws(() => requireSpendFlags(options(["judge", "--model", "m"])), /--max-cost-usd required/);
  assert.doesNotThrow(() => requireSpendFlags(options(["run", "--dry-run"])));
  assert.doesNotThrow(() => requireSpendFlags(options(["seed-check", "--model", "m", "--max-cost-usd", "1"])));
  assert.throws(() => options(["run", "--max-cost-usd", "0"]), /positive/);
  assert.throws(() => options(["run", "--arms", "bogus"]), /unknown arm/);
  assert.throws(() => options(["run", "--lengths", "medium"]), /unknown length/);
});

test("every cell runs without the evaluator key, and denies delegation at the call", () => {
  const keyEnv = evaluatorKeyEnv(path.join(HERE, "..", "..", ".."));
  assert.ok(keyEnv, "the shipped evaluator binding names its variable");
  const env = scrubbedEnv({ TYPESAFE_API_KEY: "k", [keyEnv]: "k", CLAUDE_PLUGIN_ROOT: "/elsewhere", PATH: "/bin" }, [keyEnv]);
  assert.deepEqual(env, { PATH: "/bin" });
  const [entry] = DENY_DELEGATION.hooks.PreToolUse;
  const matcher = new RegExp(entry.matcher);
  for (const t of ["Agent", "Task", "SendMessage"]) assert.ok(matcher.test(t), t);
  for (const t of ["Edit", "Write", "Read", "AgentX"]) assert.ok(!matcher.test(t), t);
  assert.match(entry.hooks[0].command, /permissionDecision:"deny"/);
});
