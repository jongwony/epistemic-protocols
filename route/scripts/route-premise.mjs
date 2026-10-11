/**
 * The premise index, rendered for injection at session start, at a
 * subagent's start, and again at the tool calls the matcher can see are its
 * moments.
 *
 * The premise documents are a reference surface that ships beside the plugins
 * in this marketplace, under `premise/` — the collaboration premises the
 * protocols rest on. This file carries their index: each document, the
 * moments that call for it, and — read from the document itself — its lead
 * clause. The index lives here rather than in a file under `premise/`
 * because the hooks are its one delivery channel — a file there would be a
 * second one, picked up by directory convention and delivered twice — and
 * because an entry's path is only useful absolute, which is something a
 * hook resolves at every epoch and a file cannot carry.
 *
 * The lead clause is the document's own words: each document marks one span
 * with `<!-- lead -->` … `<!-- /lead -->`, which renders as nothing, and the
 * line quotes that span with its whitespace runs collapsed and nothing else
 * changed. A document without exactly one marked span still gets its line,
 * without a quote.
 *
 * The premise root is the marketplace checkout the host keeps for this
 * plugin's own marketplace: `known_marketplaces.json` records where that
 * checkout lives, and `installed_plugins.json` says which marketplace this
 * plugin came from. Where neither record resolves — a plugin root that sits
 * inside a checkout rather than a versioned cache entry — `premise/` beside
 * the plugin root is the same directory. An entry whose document is not
 * there is left out; a root holding none of them is no root.
 *
 * Two delivery channels. The session-start index (and the same index at a
 * subagent's start) carries every document's moments under `moments`:
 * recognizing a moment as it arrives is the reader's, and the index is what
 * the reader recognizes it against. A moment the host's tool matcher can
 * also see — a named file tool touching a path of a given shape, a named
 * agent tool being called — is delivered a second time at that call,
 * through the PreToolUse hook (route-tool.mjs): an `at` field on the entry
 * names the matcher-decided moment and the sentence saying what the call
 * is. The second delivery is a reinforcement, not a replacement: a hook's
 * context reaches the model on the request after the call, so the call has
 * run by the time the line is read, and the line carries the lead clause
 * for the result that is built on next. The session line therefore stays
 * for every moment, including the ones the matcher sees.
 *
 * What qualifies for the tool channel is what the matcher decides without
 * reading the call's content: a tool name, a path shape. A moment that
 * needs the content read — whether a command's intent is to write, whether
 * a set of options genuinely diverges, whether an action can be undone,
 * whether an agent's return is a report or a launch notice — is past what
 * a matcher reaches: deciding it there means a regex over a command or a
 * roster of host-specific tool names, which varies by configuration and
 * resists testing. Those moments stay on the session channel. The tool
 * channel is therefore the fast layer here: bound to a harness, and
 * expected to shrink as readers follow the session index unaided.
 *
 * That a matcher cannot reach a moment does not settle that nothing can.
 * A detector that reads assembled state and answers from a declared set
 * is neither a matcher nor the reader's own reasoning; no channel here is
 * built on one, and these are the conditions one would answer to. It
 * reinforces and never replaces: the session index carries every moment
 * whatever the detector says, because a hook's context reaches the model
 * only on the request after the call, so anything withheld would arrive
 * too late to inform the call it was about. It assembles the state it
 * reads — a detector answers about what it is given, and the call alone
 * is not the accumulated context that reversibility or divergence is
 * judged from. And fail-open covers less of it: "" covers a shortfall
 * that fails loudly, not a well-formed wrong answer, whose cost is a
 * reader anchored on a document the moment did not call for.
 *
 * The index is kept by hand, and the test beside this file is the channel
 * that re-runs it against the tree: every entry names a document that
 * exists, every document has an entry, every entry has its moments, every
 * document marks exactly one lead that extraction returns unchanged, and
 * every `at` names a moment the matcher can decide.
 *
 * Every shortfall yields "" so the caller can fail open. Zero external
 * dependencies: Node.js standard library only.
 */

import fs from "node:fs";
import path from "node:path";
import { configDir, identify, pluginRoot, readJson } from "./route-protocols.mjs";

// Headed like the deficit table, and stated as fact: what each line holds,
// and that the document holds the rest. Nothing here describes how the
// lines arrived — the reader needs that neither to recognize a moment nor
// to reach a document.
const PREMISE_HEADER =
  "Collaboration premises — each line gives a document, its lead clause in the document's own words, and the moments it governs; the document holds the rest of what applies at those moments:";

// Heads a tool-channel injection. The call has run by the time this is
// read, so the line says what the call was and quotes the clause that
// governs what is built on it.
const TOOL_HEADER =
  "Collaboration premise for the tool call just made:";

// The marker pair a document puts around its lead clause.
const LEAD_OPEN = "<!-- lead -->";
const LEAD_CLOSE = "<!-- /lead -->";

// One entry per document. `moments` is the session-start line's list of the
// moments the document governs, each one the reader can observe in its own
// work. `at` names a matcher-decided moment (a key of MOMENTS) and `call`,
// the sentence the line delivered at that call opens with.
const PREMISE_INDEX = [
  { file: "recognition-and-authority.md", moments: "about to settle something the person may hold a judgment on, or to ask them about it; about to present options for someone to choose from; handing off work that will continue without the person present; a rule would fix an answer before the situation it applies to is known." },
  { file: "interaction-factorization.md", moments: "about to offer options at a checkpoint; the options may collapse to one answer that a fact, prior decision, or convention already fixes." },
  { file: "gate-design.md", moments: "about to design, present, or defend a checkpoint; deciding what counts as done and when to stop; a required step looks skippable." },
  { file: "tiering-and-scope.md", moments: "deciding a principle's role, scope, or revision basis; a model change is offered as the reason to retire or keep a rule." },
  { file: "specification-and-judgment.md", moments: "deciding which steps a procedure can settle in advance and which must be judged in the situation; each added exception to a rule calls for the next one." },
  { file: "calibration-methodology.md", moments: "setting or changing how much may be decided without asking the person." },
  { file: "approach-verification.md", moments: "about to act on a request; a question or statement may want an action its grammar does not show; the person's words admit more than one reading; an instruction changes part of something and leaves the rest." },
  { file: "matching-the-request.md", moments: "unclear whether the conversation is at design level or implementation level; deciding how far a fix reaches; about to ask the person something and choosing its level of detail; a time or date arrives without a zone." },
  { file: "verification-discipline.md", moments: "about to state a claim about a system's or artifact's state, including that work is done; about to start a change; a delegated agent reports its work complete; advice arrives from outside the work; deciding whether something needs an independent second look." },
  { file: "instruction-authoring.md",
    moments: "about to write or revise instructions or a durable record — a rule, a skill, a recorded decision; a new rule or principle is proposed, including one the person states to adopt; about to add to standing instructions that already carry entries; a defect is found and its repair is about to be written; two instructions conflict; deciding where a principle loads or how much to inline versus reference; reading the text back once it is written.",
    at: { moment: "instruction-surface-change", call: "This call changes an instruction surface." } },
  { file: "delegation-and-subagents.md",
    moments: "about to hand work to another agent or reasoning context, including deciding what its brief carries; its result arrives; deciding what a coordinator keeps and what it delegates.",
    at: { moment: "delegation", call: "This call hands work to another agent." } },
  { file: "session-and-handoff.md", moments: "about to defer work or cross a session boundary; an input arrives that would pull focus off the task in progress; the work is interrupted mid-task; a commitment is still open after attention moved off it; the understanding of the work has changed since a commitment was written down." },
  { file: "boundaries-and-safety.md", moments: "about to replace or overwrite a file or other state, or take another hard-to-reverse action; reading configuration text that could be executed; deciding when work needs to be made durable." },
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
 * The span a document marks as its lead, with whitespace runs collapsed —
 * or "" unless the document carries exactly one marker pair, in order.
 */
function leadOf(text) {
  if (typeof text !== "string") return "";
  const open = text.split(LEAD_OPEN).length - 1;
  const close = text.split(LEAD_CLOSE).length - 1;
  if (open !== 1 || close !== 1) return "";
  const start = text.indexOf(LEAD_OPEN) + LEAD_OPEN.length;
  const end = text.indexOf(LEAD_CLOSE);
  if (end < start) return "";
  return text.slice(start, end).replace(/\s+/g, " ").trim();
}

/** The lead of the document at `file`, or "" where it cannot be read. */
function readLead(file) {
  try {
    return leadOf(fs.readFileSync(file, "utf8"));
  } catch {
    return "";
  }
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

/** The quoted lead, with the space after it, or nothing where there is none. */
function quoted(file) {
  const lead = readLead(file);
  return lead ? `"${lead}" ` : "";
}

/** A session-start line: the path, the quoted lead, the moments. */
function line(root, e) {
  const file = path.join(root, e.file);
  return `\`${file}\` — ${quoted(file)}Moments: ${e.moments}`;
}

/** A tool-channel line: what the call is, the path, the quoted lead. */
function toolLine(root, e) {
  const file = path.join(root, e.file);
  const lead = readLead(file);
  return `${e.at.call} \`${file}\` governs this moment${lead ? `: "${lead}"` : "."}`;
}

/**
 * The header and one line per document present under `root`, each with its
 * absolute path. Nothing when no document is there.
 */
function renderPremise(root) {
  if (!root) return "";
  const entries = present(root);
  if (entries.length === 0) return "";
  return [PREMISE_HEADER, ...entries.map((e) => line(root, e))].join("\n");
}

/**
 * One line per document present under `root` whose matcher-decided moment
 * the call is. Nothing when none binds.
 */
function renderToolPremise(root, call) {
  if (!root) return "";
  const entries = present(root).filter((e) => bindsAt(e, call));
  if (entries.length === 0) return "";
  return [TOOL_HEADER, ...entries.map((e) => toolLine(root, e))].join("\n");
}

export {
  AGENT_TOOLS,
  LEAD_CLOSE,
  LEAD_OPEN,
  MOMENTS,
  PREMISE_HEADER,
  PREMISE_INDEX,
  TOOL_HEADER,
  bindsAt,
  isInstructionSurface,
  leadOf,
  premiseRoot,
  renderPremise,
  renderToolPremise,
};
