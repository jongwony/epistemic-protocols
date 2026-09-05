/**
 * The premise index, rendered for injection at session start and at the
 * tool calls that are its moments.
 *
 * The premise documents are a reference surface that ships beside the plugins
 * in this marketplace, under `premise/` — the collaboration premises the
 * protocols rest on. This file carries their index: each document and the
 * moment that calls for it. The index lives here rather than in a file under
 * `premise/` because the hooks are its one delivery channel — a file there
 * would be a second one, picked up by directory convention and delivered
 * twice — and because an entry's path is only useful absolute, which is
 * something a hook resolves at every epoch and a file cannot carry.
 *
 * The premise root is the marketplace checkout the host keeps for this
 * plugin's own marketplace: `known_marketplaces.json` records where that
 * checkout lives, and `installed_plugins.json` says which marketplace this
 * plugin came from. Where neither record resolves — a plugin root that sits
 * inside a checkout rather than a versioned cache entry — `premise/` beside
 * the plugin root is the same directory. An entry whose document is not
 * there is left out; a root holding none of them is no root.
 *
 * Two delivery channels, by the kind of moment. A moment that arrives in
 * conversation — deciding, presenting, declaring — is only recognizable by
 * the reader, so it goes out at session start under `when`, and the reader
 * carries it. A moment that is a tool call — a file about to change, a
 * question about to be put, work about to be handed off, an action that
 * cannot be undone — is observable by the host, so it goes out at that call
 * instead, through the PreToolUse and PostToolUse hooks (route-tool.mjs):
 * an `at` field on the entry names the observable moment and the clause
 * that describes it. Each moment is delivered on one channel: a document's
 * `when` carries only the moments no tool call shows, and an entry whose
 * moments are all observable has no `when` and leaves the session-start
 * index — a pointer delivered many turns before its moment was found not
 * to be followed at the moment.
 *
 * The index is kept by hand, and the test beside this file is the channel
 * that re-runs it against the tree: every entry names a document that
 * exists, every document has an entry, and every `at` names a moment the
 * hook can observe.
 *
 * Every shortfall yields "" so the caller can fail open. Zero external
 * dependencies: Node.js standard library only.
 */

import fs from "node:fs";
import path from "node:path";
import { configDir, identify, pluginRoot, readJson } from "./route-protocols.mjs";

// Headed like the deficit table: the injection names its source and what to
// do with it, and the entries carry the rest.
const PREMISE_HEADER =
  "Premise — the collaboration premises behind these protocols, indexed by the moment each document is for. Read a document at the moment its entry names:";

// Heads a tool-channel injection: it names the moment the host observed, so
// the line beneath reads as arriving at that moment rather than as a
// standing instruction. One phrasing before the call, one after.
const TOOL_HEADER_BEFORE =
  "Premise — this tool call is the moment the entry below names. Read the document before it runs:";
const TOOL_HEADER_AFTER =
  "Premise — this tool result is the moment the entry below names. Read the document before acting on it:";

const PREMISE_INTRO =
  "The cognitive and collaboration premises behind structured human-AI dialogue — stated so they hold on their own, independent of any specific codebase, tool, or harness that happens to implement them.";

// One entry per document. `when` is the clause for the session-start line —
// the moments only the reader can recognize. `at` names an observable
// moment (a key of MOMENTS) and the clause for the line delivered at it.
// A document has `when`, `at`, or both; the two never describe the same
// moment.
const PREMISE_INDEX = [
  { file: "recognition-and-authority.md",
    when: "when deciding whether to settle something yourself or put it to the person you are working with, and when deciding whether a specification may fix a criterion's answer in advance at all.",
    at: { moment: "option-presentation", when: "before presenting a set of options for someone to choose from." } },
  { file: "interaction-factorization.md",
    at: { moment: "option-presentation", when: "when designing the options offered at a checkpoint, and when judging whether those options genuinely diverge or collapse to one dominant answer dressed up as several." } },
  { file: "gate-design.md", when: "when designing or defending a checkpoint, when deciding what that checkpoint should present, when setting a convergence condition or a termination condition, and when checking whether a process can shortcut or skip past itself." },
  { file: "tiering-and-scope.md", when: "when deciding which surface a principle belongs on, and when classifying whether a principle should matter more or less as the underlying model improves." },
  { file: "specification-and-judgment.md", when: "when a criterion has to stay open to the run and the question is what the specification carries in place of the answer, and when cases keep accumulating around one coordinate a specification has already tried to settle." },
  { file: "calibration-methodology.md", when: "when setting or changing how much a project resolves on its own versus routes to its user for judgment." },
  { file: "approach-verification.md", when: "before deciding what to do with a request, when an utterance's grammatical form may differ from the action it actually wants, and when an instruction reaches only part of what it lands on." },
  { file: "matching-the-request.md", when: "when unsure whether the conversation is at design level or implementation level, when deciding how far a fix should reach, when deciding how detailed a question back to the person should be, and when a time or date arrives without a stated zone." },
  { file: "verification-discipline.md",
    when: "before declaring something done, when weighing advice that arrived from outside the work, and when deciding whether something warrants an independent second look.",
    at: { moment: "delegate-report", when: "when a delegated agent reports that its work is complete." } },
  { file: "instruction-authoring.md",
    at: { moment: "instruction-surface-change", when: "when writing or revising instructions and durable records, when judging whether a new rule earns its place, before settling what a change adds to a surface that already carries entries, when a defect has been found and the repair is about to be written, when two instructions turn out to conflict, and when deciding how much to inline for a reader versus leaving as a reference." } },
  { file: "delegation-and-subagents.md",
    when: "when deciding what a coordinator keeps for itself versus delegates outward.",
    at: { moment: "delegation", when: "when handing work to an agent that cannot see this conversation." } },
  { file: "session-and-handoff.md",
    when: "when an input arrives that would pull focus off the task currently in progress, when someone interrupts the work mid-task, when attention has already moved off a commitment that is still open, and when the way the work is understood has been replaced since a commitment was written down.",
    at: { moment: "deferral", when: "when deferring work or crossing a session boundary." } },
  { file: "boundaries-and-safety.md",
    when: "when reading configuration text that could be executed, and when deciding when work needs to be made durable.",
    at: { moment: "irreversible-action", when: "before replacing a file or taking any other hard-to-reverse action." } },
];

// ---------------------------------------------------------------------------
// Observable moments: what a tool call has to look like to be one.
// ---------------------------------------------------------------------------

// A durable instruction file a host loads for an agent — the project
// instruction file, a rule, a principle, a skill, an agent definition.
// Matched on path shape alone, so it holds on any host and on a path that
// does not exist yet.
function isInstructionSurface(file) {
  const p = String(file).replace(/\\/g, "/");
  if (!p.endsWith(".md")) return false;
  const base = path.posix.basename(p);
  if (["CLAUDE.md", "CLAUDE.local.md", "AGENTS.md", "SKILL.md"].includes(base)) return true;
  const dir = path.posix.dirname(p);
  if (/(^|\/)\.claude\/(rules|principles)(\/|$)/.test(dir)) return true;
  return /(^|\/)agents$/.test(dir);
}

// A shell command that discards work in a way no later command restores:
// a recursive forced delete, a forced push, a hard reset, a forced clean,
// a forced branch delete, a table or database dropped or truncated.
const DESTRUCTIVE_SHELL = /\brm\s+(-[a-zA-Z]*r[a-zA-Z]*f|-[a-zA-Z]*f[a-zA-Z]*r)\b|\bgit\s+push\b[^|;&]*(--force\b|\s-f\b)|\bgit\s+reset\s+--hard\b|\bgit\s+clean\b[^|;&]*\s-[a-zA-Z]*f|\bgit\s+branch\s+-D\b/;
const DESTRUCTIVE_SQL = /\bDROP\s+(TABLE|DATABASE|SCHEMA)\b|\bTRUNCATE\s+TABLE\b/i;
const isDestructive = (command) => DESTRUCTIVE_SHELL.test(command) || DESTRUCTIVE_SQL.test(command);

// Tool names as the hosts this plugin ships for currently give them. An
// unmatched name costs nothing, so a host's rename shows as a missed
// delivery rather than a fault.
const OPTION_TOOLS = new Set(["AskUserQuestion", "request_user_input"]);
const AGENT_TOOLS = new Set(["Agent", "Task", "spawn_agent"]);
const DEFERRAL_TOOL = /send_later|create_trigger|CronCreate|ScheduleWakeup/;

/**
 * Each observable moment, as a predicate over the call: the hook event
 * ("PreToolUse" or "PostToolUse"), the tool name, its input, and the paths
 * the call is about to change (read off the input by route-tool.mjs).
 */
const MOMENTS = {
  "instruction-surface-change": ({ event, files }) =>
    event === "PreToolUse" && files.some(isInstructionSurface),
  "option-presentation": ({ event, tool }) =>
    event === "PreToolUse" && OPTION_TOOLS.has(tool),
  "delegation": ({ event, tool }) =>
    event === "PreToolUse" && AGENT_TOOLS.has(tool),
  "delegate-report": ({ event, tool }) =>
    event === "PostToolUse" && AGENT_TOOLS.has(tool),
  "deferral": ({ event, tool }) =>
    event === "PreToolUse" && DEFERRAL_TOOL.test(String(tool)),
  "irreversible-action": ({ event, tool, input, files }) => {
    if (event !== "PreToolUse") return false;
    if (tool === "Write") return files.some((f) => isFile(f));
    if (tool === "Bash") return isDestructive(String(input.command ?? ""));
    return false;
  },
};

function isFile(file) {
  try {
    return fs.statSync(file).isFile();
  } catch {
    return false;
  }
}

/** True when the call described by `call` is the moment `entry.at` names. */
function bindsAt(entry, call) {
  const moment = entry.at && MOMENTS[entry.at.moment];
  return !!(moment && moment(call));
}

/**
 * The marketplace checkout this plugin was installed from, as the host
 * records it — or null where the records do not reach it.
 */
function marketplaceRoot(dir, root) {
  const installed = readJson(path.join(dir, "plugins", "installed_plugins.json"));
  const records = installed && installed.plugins;
  if (!records || typeof records !== "object") return null;
  const self = identify(root, records);
  if (!self) return null;
  const known = readJson(path.join(dir, "plugins", "known_marketplaces.json"));
  const entry = known && known[self.marketplace];
  const at = entry && entry.installLocation;
  return typeof at === "string" ? at : null;
}

/** The indexed documents present under `root`. */
function present(root) {
  return PREMISE_INDEX.filter((e) => isFile(path.join(root, e.file)));
}

/**
 * The directory holding the premise documents: `premise/` under the recorded
 * marketplace checkout, else `premise/` beside the plugin root. Null when
 * neither holds any indexed document.
 */
function premiseRoot(env = {}) {
  const dir = env.configDir || configDir();
  const root = env.pluginRoot || pluginRoot();
  const candidates = [];
  const marketplace = marketplaceRoot(dir, root);
  if (marketplace) candidates.push(path.join(marketplace, "premise"));
  candidates.push(path.resolve(root, "..", "premise"));
  return candidates.find((c) => present(c).length > 0) ?? null;
}

function line(root, e, when) {
  return `Read \`${path.join(root, e.file)}\` ${when}`;
}

/**
 * The header, the intro, and one line per document present under `root`
 * that has a session-channel clause, each with its absolute path. Nothing
 * when no document is there.
 */
function renderPremise(root) {
  if (!root) return "";
  const entries = present(root).filter((e) => e.when);
  if (entries.length === 0) return "";
  return [PREMISE_HEADER, PREMISE_INTRO, ...entries.map((e) => line(root, e, e.when))].join("\n");
}

/**
 * One line per document present under `root` whose observable moment the
 * call is, under the header for the call's event. Nothing when none binds.
 */
function renderToolPremise(root, call) {
  if (!root) return "";
  const entries = present(root).filter((e) => bindsAt(e, call));
  if (entries.length === 0) return "";
  const header = call.event === "PostToolUse" ? TOOL_HEADER_AFTER : TOOL_HEADER_BEFORE;
  return [header, ...entries.map((e) => line(root, e, e.at.when))].join("\n");
}

export {
  MOMENTS,
  PREMISE_HEADER,
  PREMISE_INDEX,
  PREMISE_INTRO,
  TOOL_HEADER_AFTER,
  TOOL_HEADER_BEFORE,
  bindsAt,
  isDestructive,
  isInstructionSurface,
  premiseRoot,
  renderPremise,
  renderToolPremise,
};
