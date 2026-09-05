/**
 * The premise index, rendered for SessionStart injection.
 *
 * The premise documents are a reference surface that ships beside the plugins
 * in this marketplace, under `premise/` — the collaboration premises the
 * protocols rest on. This file carries their index: each document and the
 * moment that calls for it. The index lives here rather than in a file under
 * `premise/` because the hook is its one delivery channel — a file there
 * would be a second one, picked up by directory convention and delivered
 * twice — and because an entry's path is only useful absolute, which is
 * something the hook resolves at every epoch and a file cannot carry.
 *
 * The premise root is the marketplace checkout the host keeps for this
 * plugin's own marketplace: `known_marketplaces.json` records where that
 * checkout lives, and `installed_plugins.json` says which marketplace this
 * plugin came from. Where neither record resolves — a plugin root that sits
 * inside a checkout rather than a versioned cache entry — `premise/` beside
 * the plugin root is the same directory. An entry whose document is not
 * there is left out; a root holding none of them is no root.
 *
 * Two delivery channels, by the kind of moment an entry names. A moment
 * that arrives in conversation — deciding, presenting, declaring — is only
 * recognizable by the reader, so its entry goes out at session start and
 * the reader carries it. A moment that is a file operation is observable
 * by the host, so its entry goes out at that operation instead, through the
 * PreToolUse hook (route-edit.mjs): an `edit` field on the entry names the
 * surfaces whose change is the moment.
 *
 * The index is kept by hand, and the test beside this file is the channel
 * that re-runs it against the tree: every entry names a document that
 * exists, every document has an entry, and each entry has one channel.
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

// Heads the edit-channel injection: it names the moment the host observed,
// so the line beneath reads as arriving at that moment rather than as a
// standing instruction.
const EDIT_HEADER =
  "Premise — this change touches an instruction surface, the moment the entry below names. Read the document before writing the change:";

const PREMISE_INTRO =
  "The cognitive and collaboration premises behind structured human-AI dialogue — stated so they hold on their own, independent of any specific codebase, tool, or harness that happens to implement them.";

// One entry per document: the file under the premise root, and the moment
// that calls for it — the clause that follows "Read <file>".
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
  { file: "instruction-authoring.md", edit: "instruction-surface", when: "when writing or revising instructions and durable records, when judging whether a new rule earns its place, before settling what a change adds to a surface that already carries entries, when a defect has been found and the repair is about to be written, when two instructions turn out to conflict, and when deciding how much to inline for a reader versus leaving as a reference." },
  { file: "delegation-and-subagents.md", when: "when handing work to an agent that cannot see this conversation, and when deciding what a coordinator keeps for itself versus delegates outward." },
  { file: "session-and-handoff.md", when: "when deferring work or crossing a session boundary, when an input arrives that would pull focus off the task currently in progress, when someone interrupts the work mid-task, when attention has already moved off a commitment that is still open, and when the way the work is understood has been replaced since a commitment was written down." },
  { file: "boundaries-and-safety.md", when: "before replacing a file or taking any other hard-to-reverse action, when reading configuration text that could be executed, and when deciding when work needs to be made durable." },
];

function isFile(file) {
  try {
    return fs.statSync(file).isFile();
  } catch {
    return false;
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

// The edit channels an entry can name, each a predicate over a file path.
// "instruction-surface": a durable instruction file a host loads for an
// agent — the project instruction file, a rule, a principle, a skill, an
// agent definition. Matched on path shape alone, so it holds on any host and
// on a path that does not exist yet.
const EDIT_SURFACES = {
  "instruction-surface": (file) => {
    const p = String(file).replace(/\\/g, "/");
    if (!p.endsWith(".md")) return false;
    const base = path.posix.basename(p);
    if (["CLAUDE.md", "CLAUDE.local.md", "AGENTS.md", "SKILL.md"].includes(base)) return true;
    const dir = path.posix.dirname(p);
    if (/(^|\/)\.claude\/(rules|principles)(\/|$)/.test(dir)) return true;
    return /(^|\/)agents$/.test(dir);
  },
};

/** True when changing `file` is the moment `entry` names. */
function bindsOnEdit(entry, file) {
  const match = entry.edit && EDIT_SURFACES[entry.edit];
  return !!(match && file && match(file));
}

/** The indexed documents present under `root`. */
function present(root) {
  return PREMISE_INDEX.filter((e) => isFile(path.join(root, e.file)));
}

/** The entries delivered at session start: every present entry. */
function sessionEntries(root) {
  return present(root);
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

function line(root, e) {
  return `Read \`${path.join(root, e.file)}\` ${e.when}`;
}

/**
 * The header, the intro, and one line per session-channel document present
 * under `root`, each with its absolute path. Nothing when no document is
 * there.
 */
function renderPremise(root) {
  if (!root) return "";
  const entries = sessionEntries(root);
  if (entries.length === 0) return "";
  return [PREMISE_HEADER, PREMISE_INTRO, ...entries.map((e) => line(root, e))].join("\n");
}

/**
 * One line per edit-channel document present under `root` whose moment is
 * a change to any of `files`. Nothing when none binds.
 */
function renderEditPremise(root, files) {
  if (!root) return "";
  const entries = present(root).filter((e) => files.some((f) => bindsOnEdit(e, f)));
  if (entries.length === 0) return "";
  return [EDIT_HEADER, ...entries.map((e) => line(root, e))].join("\n");
}

export {
  EDIT_HEADER,
  EDIT_SURFACES,
  PREMISE_HEADER,
  PREMISE_INDEX,
  PREMISE_INTRO,
  bindsOnEdit,
  premiseRoot,
  renderEditPremise,
  renderPremise,
};
