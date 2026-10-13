/**
 * The delivery arms of a premise cell, each built as its own copy of the
 * route plugin and checked against the shipped one before anything runs.
 *
 * An arm varies the premise delivery and nothing else. Every arm loads the
 * same route copy layout, the same protocol plugins, the same per-prompt
 * directive and the same tool matcher; what differs is what the copy's
 * `route-premise.mjs` renders:
 *
 *   none     — no premise index at session start, and no premise line at a
 *              tool call: the premise root resolves to nothing.
 *   paths    — the index with each document's path and moments, without the
 *              lead clause; tool lines name the document without quoting it.
 *              The header line is kept as shipped, so the lead is the one
 *              thing that differs.
 *   shipped  — the plugin as it ships.
 *   clause   — the shipped plugin, plus the governing documents' lead clauses
 *              handed in by the runner beside the graded prompt (see
 *              clauseBlock). Diagnostic: it separates a delivery that did not
 *              reach the moment from an application that failed once it did.
 *
 * The session-start context is not delivered by the copy's hook at run time.
 * A cell seeds it at the head of a stored conversation and resumes that
 * conversation, and the host fires SessionStart again on resume and attaches
 * what it returns just before the new prompt — the opposite end of the
 * context. So every copy drops its SessionStart registration, and the head is
 * rendered here, once per arm, by running that arm's own session hook script
 * against a render-only install record. SubagentStart, UserPromptSubmit and
 * PreToolUse stay registered as shipped.
 *
 * A variant that renders the same text as the one it is meant to differ from
 * would run one treatment under two names, so `checkVariants` refuses the run
 * unless each arm renders what its definition says.
 *
 * Zero external dependencies: Node.js standard library only.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { PREMISE_HEADER, PREMISE_INDEX, TOOL_HEADER, leadIn } from "../../scripts/route-premise.mjs";

const ARMS = {
  none: { patch: "no-premise", clause: false },
  paths: { patch: "no-lead", clause: false },
  shipped: { patch: "as-shipped", clause: false },
  clause: { patch: "as-shipped", clause: true, diagnostic: true },
};

// Each patch is one early return inserted at an anchor the source must hold
// exactly once; a source that has moved past the anchor fails the build
// rather than yielding an unpatched copy.
const PATCHES = {
  "as-shipped": [],
  "no-premise": [{ anchor: "function premiseRoot(env = {}) {", insert: "\n  return null; // premise eval arm: no premise index" }],
  "no-lead": [{ anchor: "function readLead(file, e) {", insert: "\n  return \"\"; // premise eval arm: no lead clause" }],
};

/** `text` with each patch applied; throws where an anchor is not found exactly once. */
function patchSource(text, patch) {
  let out = text;
  for (const { anchor, insert } of PATCHES[patch] ?? []) {
    const at = out.indexOf(anchor);
    if (at < 0 || out.indexOf(anchor, at + 1) >= 0) {
      throw new Error(`route-premise.mjs: anchor ${JSON.stringify(anchor)} not found exactly once; the ${patch} arm cannot be built`);
    }
    out = out.slice(0, at + anchor.length) + insert + out.slice(at + anchor.length);
  }
  if (!(patch in PATCHES)) throw new Error(`unknown patch ${JSON.stringify(patch)}`);
  return out;
}

/** hooks.json with its SessionStart registration removed; throws when it has none. */
function withoutSessionStart(hooksText) {
  const hooks = JSON.parse(hooksText);
  if (!hooks.hooks?.SessionStart) throw new Error("route hooks.json registers no SessionStart hook to remove");
  delete hooks.hooks.SessionStart;
  return JSON.stringify(hooks, null, 2) + "\n";
}

/** The environment a route script runs under in this harness: no evaluator key. */
function scrubbedEnv(base = process.env, keyEnvs = []) {
  const env = { ...base };
  for (const name of new Set(["TYPESAFE_API_KEY", ...keyEnvs])) delete env[name];
  delete env.CLAUDE_PLUGIN_ROOT;
  return env;
}

/** The variable the shipped evaluator binding arms on. */
function evaluatorKeyEnv(repo) {
  try {
    return JSON.parse(fs.readFileSync(path.join(repo, "route", "config", "evaluator.json"), "utf8")).apiKeyEnv || null;
  } catch {
    return null;
  }
}

/**
 * Builds one plugin copy per distinct patch the selected arms need, under
 * `workRoot`, each in a directory named by a digest so that no path the
 * agent can see names its arm. Returns `{ [patch]: plugin }`, where a plugin
 * is `{ root, routeDir, premiseDir, renderConfig, protocolDirs }`.
 */
function buildArmPlugins({ repo, workRoot, arms, protocolDirs, marketplace, salt = "" }) {
  const patches = [...new Set(arms.map((a) => {
    if (!ARMS[a]) throw new Error(`unknown arm ${JSON.stringify(a)}; arms: ${Object.keys(ARMS).join(", ")}`);
    return ARMS[a].patch;
  }))];
  const plugins = {};
  for (const patch of patches) {
    const root = path.join(workRoot, `p-${crypto.createHash("sha256").update(`${salt}:${patch}`).digest("hex").slice(0, 8)}`);
    fs.rmSync(root, { recursive: true, force: true });
    const routeDir = path.join(root, "route");
    const premiseDir = path.join(root, "premise");
    fs.cpSync(path.join(repo, "route"), routeDir, {
      recursive: true,
      filter: (src) => path.relative(path.join(repo, "route"), src).split(path.sep)[0] !== "evals",
    });
    fs.cpSync(path.join(repo, "premise"), premiseDir, { recursive: true });
    const premiseScript = path.join(routeDir, "scripts", "route-premise.mjs");
    fs.writeFileSync(premiseScript, patchSource(fs.readFileSync(premiseScript, "utf8"), patch));
    const hooksFile = path.join(routeDir, "hooks", "hooks.json");
    fs.writeFileSync(hooksFile, withoutSessionStart(fs.readFileSync(hooksFile, "utf8")));

    // The install record the session hook derives its table from: this copy
    // as the route plugin, beside the protocol plugins the cells load.
    const renderConfig = path.join(root, "render-config");
    fs.mkdirSync(path.join(renderConfig, "plugins"), { recursive: true });
    const records = { [`route@${marketplace}`]: [{ scope: "user", installPath: routeDir, version: "eval" }] };
    const enabledPlugins = { [`route@${marketplace}`]: true };
    for (const dir of protocolDirs) {
      const key = `${path.basename(dir)}@${marketplace}`;
      records[key] = [{ scope: "user", installPath: dir, version: "eval" }];
      enabledPlugins[key] = true;
    }
    fs.writeFileSync(path.join(renderConfig, "plugins", "installed_plugins.json"), JSON.stringify({ version: 2, plugins: records }, null, 2));
    fs.writeFileSync(path.join(renderConfig, "settings.json"), JSON.stringify({ enabledPlugins }, null, 2));
    plugins[patch] = { root, routeDir, premiseDir, renderConfig, protocolDirs };
  }
  return plugins;
}

/** Runs one of the copy's hook scripts on `payload`; returns its additionalContext or "". */
function runHook(plugin, script, payload, env) {
  const r = spawnSync(process.execPath, [path.join(plugin.routeDir, "scripts", script)], {
    input: JSON.stringify(payload),
    encoding: "utf8",
    env: { ...env, CLAUDE_CONFIG_DIR: plugin.renderConfig, CLAUDE_PLUGIN_ROOT: plugin.routeDir },
  });
  if (r.status !== 0) throw new Error(`${script} exited ${r.status}: ${r.stderr}`);
  const out = (r.stdout || "").trim();
  if (!out) return "";
  return JSON.parse(out).hookSpecificOutput?.additionalContext ?? "";
}

/**
 * What a plugin copy delivers: the session-start context, the tool-channel
 * lines at a delegation and at an instruction-surface edit, and the
 * subagent-start context.
 */
function renderPlugin(plugin, env) {
  return {
    session: runHook(plugin, "route-session.mjs", { hook_event_name: "SessionStart", source: "startup" }, env),
    tool: {
      delegation: runHook(plugin, "route-tool.mjs", { hook_event_name: "PreToolUse", tool_name: "Agent", tool_input: { prompt: "x" } }, env),
      instruction: runHook(plugin, "route-tool.mjs", { hook_event_name: "PreToolUse", tool_name: "Edit", tool_input: { file_path: "/x/skills/a/SKILL.md" } }, env),
    },
    subagent: runHook(plugin, "route-subagent.mjs", { hook_event_name: "SubagentStart", agent_type: "general-purpose" }, env),
  };
}

/** The collapsed leads of every indexed document, as `premiseDir` says them. */
function leadsIn(premiseDir) {
  return PREMISE_INDEX.map((e) => {
    let text = "";
    try { text = fs.readFileSync(path.join(premiseDir, e.file), "utf8"); } catch {}
    return { file: e.file, lead: leadIn(text, e.lead) };
  });
}

/** The deficit table: whatever a session context carries above the premise header. */
function tablePart(session) {
  const at = session.indexOf(PREMISE_HEADER);
  return (at < 0 ? session : session.slice(0, at)).trim();
}

/**
 * Checks each selected arm renders what its definition says, against the
 * shipped rendering. Returns the list of checks that held; throws with every
 * one that did not, so a run never starts on an arm that equals another.
 * `rendered` maps patch → renderPlugin output, `plugins` patch → plugin.
 */
function checkVariants({ arms, rendered, plugins, expectTable = true }) {
  const problems = [];
  const held = [];
  const check = (ok, what) => (ok ? held : problems).push(what);
  const shipped = rendered["as-shipped"];
  if (!shipped) throw new Error("the shipped rendering is required to check variants against");
  const leads = leadsIn(plugins["as-shipped"].premiseDir).filter((l) => l.lead);
  const hasLead = (text) => leads.some((l) => text.includes(l.lead));

  check(leads.length === PREMISE_INDEX.length, `shipped: every indexed document's lead is found in its premise copy (${leads.length} of ${PREMISE_INDEX.length})`);
  check(shipped.session.includes(PREMISE_HEADER), "shipped: session context carries the premise index");
  check(leads.every((l) => shipped.session.includes(l.lead)), "shipped: session context quotes every lead");
  check(shipped.tool.delegation.startsWith(TOOL_HEADER) && hasLead(shipped.tool.delegation), "shipped: a delegation call gets a tool line quoting its lead");
  check(shipped.tool.instruction.startsWith(TOOL_HEADER) && hasLead(shipped.tool.instruction), "shipped: an instruction-surface edit gets a tool line quoting its lead");
  check(shipped.subagent.includes(PREMISE_HEADER), "shipped: a subagent gets the premise index");
  if (expectTable) check(tablePart(shipped.session).length > 0, "shipped: session context carries the deficit table");

  for (const arm of arms) {
    const r = rendered[ARMS[arm].patch];
    if (arm === "none") {
      check(r.session !== shipped.session, "none: session context differs from shipped");
      check(!r.session.includes(PREMISE_HEADER) && !hasLead(r.session), "none: session context carries no premise index");
      check(r.session.trim() === tablePart(shipped.session), "none: session context is the shipped deficit table alone");
      check(r.tool.delegation === "" && r.tool.instruction === "", "none: no tool-channel premise line");
      check(r.subagent === "", "none: no subagent premise index");
    } else if (arm === "paths") {
      check(r.session !== shipped.session, "paths: session context differs from shipped");
      check(r.session.includes(PREMISE_HEADER), "paths: session context carries the premise index");
      check(PREMISE_INDEX.every((e) => r.session.includes(path.join(plugins["no-lead"].premiseDir, e.file))), "paths: every document's path is listed");
      check(PREMISE_INDEX.every((e) => r.session.includes(e.moments)), "paths: every document's moments are listed");
      check(!hasLead(r.session), "paths: session context quotes no lead");
      check(tablePart(r.session) === tablePart(shipped.session), "paths: deficit table identical to shipped");
      check(r.tool.delegation !== shipped.tool.delegation && r.tool.delegation.startsWith(TOOL_HEADER) && !hasLead(r.tool.delegation), "paths: delegation tool line names the document without its lead");
      check(r.tool.instruction !== shipped.tool.instruction && r.tool.instruction.startsWith(TOOL_HEADER) && !hasLead(r.tool.instruction), "paths: instruction-surface tool line names the document without its lead");
      check(r.subagent !== shipped.subagent && !hasLead(r.subagent), "paths: subagent index without leads");
    } else if (arm === "shipped" || arm === "clause") {
      check(r === shipped, `${arm}: renders as shipped`);
    }
  }
  if (problems.length) {
    throw new Error(`arm variants do not render as defined; refusing to run:\n- ${problems.join("\n- ")}`);
  }
  return held;
}

/**
 * The clause arm's hand-in: the lead clause of each document the case's
 * `governs` names, quoted from the premise copy, as a block appended after
 * the graded prompt. Appending to the prompt is the one route that reaches
 * the model at the moment with certainty — a hook would add a mechanism the
 * seed-check does not cover — and the block is shaped like the reminders
 * the host wraps hook context in, so it reads as delivered context rather
 * than as the person's words. The lead is the clause the index already
 * selects for the moment; where a case turns on a clause other than its
 * documents' leads, the arm hands in less than the deciding text, and a
 * result from it says so through the case's `governs`.
 */
function clauseBlock(caseObj, premiseDir) {
  const lines = [];
  for (const file of caseObj.governs ?? []) {
    const entry = PREMISE_INDEX.find((e) => e.file === file);
    let text = "";
    try { text = fs.readFileSync(path.join(premiseDir, file), "utf8"); } catch {}
    const lead = entry ? leadIn(text, entry.lead) : "";
    if (!lead) throw new Error(`${caseObj.id}: no lead found for ${file} under ${premiseDir}`);
    lines.push(`\`${path.join(premiseDir, file)}\` governs this moment: "${lead}"`);
  }
  if (!lines.length) throw new Error(`${caseObj.id}: governs names no document`);
  return `<system-reminder>\nCollaboration premises for this moment, each in its document's own words:\n${lines.join("\n")}\n</system-reminder>`;
}

export {
  ARMS,
  PATCHES,
  buildArmPlugins,
  checkVariants,
  clauseBlock,
  evaluatorKeyEnv,
  leadsIn,
  patchSource,
  renderPlugin,
  scrubbedEnv,
  tablePart,
  withoutSessionStart,
};
