/**
 * The premise index, rendered for injection at session start and again at
 * the tool calls the matcher can see are its moments.
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
 * Two delivery channels. The session-start index carries every document's
 * moments under `when`: recognizing a moment as it arrives is the reader's,
 * and the index is what the reader recognizes it against. A moment the
 * host's tool matcher can also see — a named file tool touching a path of
 * a given shape, a named agent tool being called — is delivered a second
 * time at that call, through the PreToolUse hook (route-tool.mjs): an `at`
 * field on the entry names the matcher-decided moment and the clause for
 * the line delivered there. The second delivery is a reinforcement, not a
 * replacement: a hook's context reaches the model on the request after the
 * call, so the call has run by the time the line is read, and the line
 * asks for the document before the result is built on. The session line
 * therefore stays for every moment, including the ones the matcher sees.
 *
 * What qualifies for the tool channel is what the matcher decides without
 * reading the call's content: a tool name, a path shape. A moment that
 * needs the content read — whether a command's intent is to write, whether
 * a set of options genuinely diverges, whether an action can be undone,
 * whether an agent's return is a report or a launch notice — stays on the
 * session channel alone, because that reading is the reader's own
 * reasoning; a hook that did it would couple the premise to one harness's
 * tool set and move the judgment out of the reasoning it belongs to. The
 * tool channel is therefore the fast layer here: bound to a harness, and
 * expected to shrink as readers follow the session index unaided.
 *
 * The index is kept by hand, and the test beside this file is the channel
 * that re-runs it against the tree: every entry names a document that
 * exists, every document has an entry, every entry has a `when`, and every
 * `at` names a moment the matcher can decide.
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
// standing instruction. The call has run by the time this is read, so the
// header asks for the document before the result is built on.
const TOOL_HEADER =
  "Premise — the tool call this arrived with is the moment the entry below names. Read the document before building on its result:";

const PREMISE_INTRO =
  "The cognitive and collaboration premises behind structured human-AI dialogue — stated so they hold on their own, independent of any specific codebase, tool, or harness that happens to implement them.";

// One entry per document. `when` is the clause for the session-start line
// and carries every moment. `at` names a matcher-decided moment (a key of
// MOMENTS) and the clause for the line delivered again at that call.
const PREMISE_INDEX = [
  { file: "recognition-and-authority.md", when: "when deciding whether to settle something yourself or put it to the person you are working with, when presenting a set of options for someone to choose from, and when deciding whether a specification may fix a criterion's answer in advance at all." },
  { file: "interaction-factorization.md", when: "when designing the options offered at a checkpoint, and when judging whether those options genuinely diverge or collapse to one dominant answer dressed up as several." },
  { file: "gate-design.md", when: "when designing or defending a checkpoint, when deciding what that checkpoint should present, when setting a convergence condition or a termination condition, and when checking whether a process can shortcut or skip past itself." },
  { file: "tiering-and-scope.md", when: "when deciding which surface a principle belongs on, and when classifying whether a principle should matter more or less as the underlying model improves." },
  { file: "specification-and-judgment.md", when: "when a criterion has to stay open to the run and the question is what the specification carries in place of the answer, and when cases keep accumulating around one coordinate a specification has already tried to settle." },
  { file: "calibration-methodology.md", when: "when setting or changing how much a project resolves on its own versus routes to its user for judgment." },
  { file: "approach-verification.md", when: "before deciding what to do with a request, when an utterance's grammatical form may differ from the action it actually wants, and when an instruction reaches only part of what it lands on." },
  { file: "matching-the-request.md", when: "when unsure whether the conversation is at design level or implementation level, when deciding how far a fix should reach, when deciding how detailed a question back to the person should be, and when a time or date arrives without a stated zone." },
  { file: "verification-discipline.md", when: "before declaring something done, when a delegated agent reports that its work is complete, when weighing advice that arrived from outside the work, and when deciding whether something warrants an independent second look." },
  { file: "instruction-authoring.md",
    when: "when writing or revising instructions and durable records, when judging whether a new rule earns its place, before settling what a change adds to a surface that already carries entries, when a defect has been found and the repair is about to be written, when two instructions turn out to conflict, and when deciding how much to inline for a reader versus leaving as a reference.",
    at: { moment: "instruction-surface-change", when: "when writing or revising instructions and durable records, and before settling what a change adds to a surface that already carries entries." } },
  { file: "delegation-and-subagents.md",
    when: "when handing work to an agent that cannot see this conversation, and when deciding what a coordinator keeps for itself versus delegates outward.",
    at: { moment: "delegation", when: "when handing work to another agent — the document says what changes with whether it can see this conversation." } },
  { file: "session-and-handoff.md", when: "when deferring work or crossing a session boundary, when an input arrives that would pull focus off the task currently in progress, when someone interrupts the work mid-task, when attention has already moved off a commitment that is still open, and when the way the work is understood has been replaced since a commitment was written down." },
  { file: "boundaries-and-safety.md", when: "before replacing a file or taking any other hard-to-reverse action, when reading configuration text that could be executed, and when deciding when work needs to be made durable." },
];

// ---------------------------------------------------------------------------
// Observable moments: what a tool call has to look like to be one. Each is
// decided from the tool name and, for a file tool, the shape of the path —
// never from reading the call's content.
// ---------------------------------------------------------------------------

// A durable instruction file a host loads for an agent — the project
// instruction file and its override, a rule, a principle, a skill, an agent
// definition (hosts scan `agents/` recursively). Matched on the normalized
// path's shape alone, so it holds on any host and on a path that does not
// exist yet.
function isInstructionSurface(file) {
  const p = path.posix.normalize(String(file).replace(/\\/g, "/"));
  if (!p.endsWith(".md")) return false;
  const base = path.posix.basename(p);
  if (["CLAUDE.md", "CLAUDE.local.md", "AGENTS.md", "AGENTS.override.md", "SKILL.md"].includes(base)) return true;
  const dir = path.posix.dirname(p);
  if (/(^|\/)\.claude\/(rules|principles)(\/|$)/.test(dir)) return true;
  return /(^|\/)agents(\/|$)/.test(dir);
}

// The tools that hand work to another agent, as the hosts name them (Codex
// reports its own under the same canonical name). An unmatched name costs
// nothing, so a host's rename shows as a missed delivery rather than a
// fault.
const AGENT_TOOLS = new Set(["Agent", "Task"]);

/**
 * Each observable moment, as a predicate over the call: the hook event, the
 * tool name, and the paths the call names (read off the input by
 * route-tool.mjs).
 */
const MOMENTS = {
  "instruction-surface-change": ({ event, files }) =>
    event === "PreToolUse" && files.some(isInstructionSurface),
  "delegation": ({ event, tool }) =>
    event === "PreToolUse" && AGENT_TOOLS.has(tool),
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
 * The header, the intro, and one line per document present under `root`,
 * each with its absolute path. Nothing when no document is there.
 */
function renderPremise(root) {
  if (!root) return "";
  const entries = present(root);
  if (entries.length === 0) return "";
  return [PREMISE_HEADER, PREMISE_INTRO, ...entries.map((e) => line(root, e, e.when))].join("\n");
}

/**
 * One line per document present under `root` whose matcher-decided moment
 * the call is. Nothing when none binds.
 */
function renderToolPremise(root, call) {
  if (!root) return "";
  const entries = present(root).filter((e) => bindsAt(e, call));
  if (entries.length === 0) return "";
  return [TOOL_HEADER, ...entries.map((e) => line(root, e, e.at.when))].join("\n");
}

export {
  AGENT_TOOLS,
  MOMENTS,
  PREMISE_HEADER,
  PREMISE_INDEX,
  PREMISE_INTRO,
  TOOL_HEADER,
  bindsAt,
  isInstructionSurface,
  premiseRoot,
  renderPremise,
  renderToolPremise,
};
