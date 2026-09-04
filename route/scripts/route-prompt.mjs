#!/usr/bin/env node
/**
 * UserPromptSubmit hook — emit the per-prompt routing directive and the
 * deficit table it screens against.
 *
 * A host's loaded-skills listing may carry each skill's description, or it
 * may carry the command identifiers alone. Where it carries identifiers
 * alone, the agent on the loop holds no statement of what deficit any
 * protocol resolves, so a screen phrased as "does the context show a deficit
 * a loaded core protocol resolves" asks for a judgment against a catalog
 * that is not in context at prompt time, and never evaluates true.
 * Where a host rations that listing under a size budget, the descriptions it
 * drops first belong to the skills the user has not been invoking — the set
 * Route exists to reach — so the shortfall is worst exactly where it costs
 * most, and it is silent and partial rather than all-or-nothing.
 *
 * So the hook supplies the catalog itself, and the screen goes back to
 * naming the deficit. One line per installed protocol, command and deficit
 * name only: the table's job is to trigger, not to match. Matching happens
 * inside /route, which resolves each candidate's full description there.
 * That division is what keeps the table compressed — the deficit names are
 * self-describing, and the prose they abbreviate costs 4.5x for a job the
 * table does not have.
 *
 * The table is derived, never maintained: installed_plugins.json supplies
 * each enabled plugin's install path, and each protocol's own SKILL.md
 * supplies its deficit. A protocol that is not installed cannot appear, and
 * a protocol added to the suite needs no edit here. Selection keys on the
 * MORPHISM `deficit:` line rather than the frontmatter `Type: (...)` clause,
 * because that clause is not uniform across the suite and keying on it drops
 * a protocol silently.
 *
 * Per prompt and stateless. A once-per-session injection would need a
 * marker, which would cost the property this hook is approved on — no file
 * written — and would not survive compaction dropping the table from
 * context. Every failure path is open: the directive alone still goes out,
 * because a hook that blocks a prompt is worse than one that routes less.
 *
 * "Active" is defined in the directive itself: a protocol invoked this
 * session that has not yet converged or deactivated. A protocol's skill
 * prose stays in context after it converges, and without the definition the
 * agent reads that leftover prose as an active protocol and skips /route for
 * the rest of the session. /route carries no active-protocol detection of
 * its own, so the exclusion stays here rather than moving into the skill.
 * The hook decides when; the /route skill decides what.
 *
 * Output shape is the hook wire format both Claude Code and Codex accept for
 * UserPromptSubmit: hookSpecificOutput.additionalContext. The payload on
 * stdin is read but not required — an empty or malformed payload still
 * yields the directive, because the directive does not depend on it.
 *
 * Zero external dependencies: Node.js standard library only.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

// The firing conditions live here and nowhere else: SKILL.md loads only after
// the skill is invoked, so this directive is the surface present at decision
// time. It is injected every turn — keep it to a few short lines.
const DIRECTIVE = [
  "[route] When the accumulated context shows an interaction deficit that a loaded core epistemic protocol resolves, invoke /route.",
  "Skip while an epistemic protocol is active: invoked this session and not yet converged or deactivated.",
  "A converged protocol's prose still in context does not make it active.",
  "Otherwise stay silent.",
].join("\n");

const TABLE_HEADER = "Installed protocols, each with the deficit it resolves:";

function readJson(file) {
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function configDir() {
  return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude");
}

function pluginRoot() {
  if (process.env.CLAUDE_PLUGIN_ROOT) return process.env.CLAUDE_PLUGIN_ROOT;
  // <pluginRoot>/scripts/route-prompt.mjs — two levels up from this file.
  return path.dirname(path.dirname(fileURLToPath(import.meta.url)));
}

function samePath(a, b) {
  try {
    return fs.realpathSync(a) === fs.realpathSync(b);
  } catch {
    return path.resolve(a) === path.resolve(b);
  }
}

/**
 * The install record's own key tells us which marketplace this plugin came
 * from and what it is called there, so neither has to be inferred from the
 * directory layout — which differs between a marketplace checkout and a
 * versioned cache entry. Falls back to the layout only when the record has
 * no entry pointing at us.
 */
function identify(root, installed) {
  for (const [key, entries] of Object.entries(installed)) {
    if (!Array.isArray(entries)) continue;
    for (const entry of entries) {
      const at = entry && entry.installPath;
      if (typeof at === "string" && samePath(at, root)) {
        const [name, marketplace] = splitKey(key);
        if (marketplace) return { name, marketplace };
      }
    }
  }
  const marketplace = path.basename(path.dirname(root));
  return marketplace ? { name: path.basename(root), marketplace } : null;
}

function splitKey(key) {
  const at = key.lastIndexOf("@");
  return at > 0 ? [key.slice(0, at), key.slice(at + 1)] : [key, ""];
}

/** The single skill of a single-skill plugin, or null. */
function soleSkill(dir) {
  let names;
  try {
    names = fs.readdirSync(path.join(dir, "skills"), { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();
  } catch {
    return null;
  }
  const found = names
    .map((n) => path.join(dir, "skills", n, "SKILL.md"))
    .filter((f) => fs.existsSync(f));
  // More than one skill means a bundle of utilities, not a core protocol.
  return found.length === 1 ? found[0] : null;
}

/**
 * A core protocol declares its command in frontmatter `name:` and the deficit
 * it resolves in the MORPHISM block's `deficit:` line. A skill missing either
 * is not one, and is left out rather than guessed at.
 */
function readProtocol(skillFile) {
  let text;
  try {
    text = fs.readFileSync(skillFile, "utf8");
  } catch {
    return null;
  }
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  const command = frontmatter && /^name:[ \t]*(.+)$/m.exec(frontmatter[1]);
  const deficit = /^deficit:[ \t]+(\w+)/m.exec(text);
  if (!command || !deficit) return null;
  const name = command[1].trim().replace(/^["']|["']$/g, "");
  return name ? { command: name, deficit: deficit[1] } : null;
}

/**
 * Every enabled plugin of this marketplace that is a single-skill protocol
 * declaring a deficit — Route itself excluded, since it never routes to
 * itself. Returns [] on any shortfall; the caller sends the directive alone.
 */
function deriveProtocols(env = {}) {
  const dir = env.configDir || configDir();
  const root = env.pluginRoot || pluginRoot();
  const installed = readJson(path.join(dir, "plugins", "installed_plugins.json"));
  const settings = readJson(path.join(dir, "settings.json"));
  if (!installed || !settings) return [];
  const records = installed.plugins;
  const enabled = settings.enabledPlugins;
  if (!records || typeof records !== "object") return [];
  if (!enabled || typeof enabled !== "object") return [];

  const self = identify(root, records);
  if (!self) return [];

  const protocols = [];
  for (const key of Object.keys(enabled).sort()) {
    if (enabled[key] !== true) continue;
    const [name, marketplace] = splitKey(key);
    if (marketplace !== self.marketplace || name === self.name) continue;
    const entries = records[key];
    if (!Array.isArray(entries)) continue;
    const at = entries
      .map((e) => e && e.installPath)
      .find((p) => typeof p === "string" && fs.existsSync(path.join(p, "skills")));
    if (!at) continue;
    const skill = soleSkill(at);
    if (!skill) continue;
    const protocol = readProtocol(skill);
    if (protocol) protocols.push(protocol);
  }
  return protocols;
}

function buildContext(env) {
  const protocols = deriveProtocols(env);
  if (protocols.length === 0) return DIRECTIVE;
  const table = protocols.map((p) => `/${p.command} ${p.deficit}`).join("\n");
  return `${DIRECTIVE}\n${TABLE_HEADER}\n${table}`;
}

function parsePayload(raw) {
  try {
    const parsed = JSON.parse(String(raw ?? "").trim());
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function render(raw, env) {
  const payload = parsePayload(raw);
  const eventName = typeof payload.hook_event_name === "string"
    ? payload.hook_event_name
    : "UserPromptSubmit";
  let additionalContext = DIRECTIVE;
  try {
    additionalContext = buildContext(env);
  } catch {
    // Fail open: a derivation fault must not cost the directive.
  }
  return JSON.stringify({
    suppressOutput: true,
    hookSpecificOutput: {
      hookEventName: eventName,
      additionalContext,
    },
  });
}

export { DIRECTIVE, TABLE_HEADER, buildContext, deriveProtocols, parsePayload, render };

let isMain = true;
try {
  isMain = !!process.argv[1]
    && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));
} catch { isMain = true; }

if (isMain) {
  let raw = "";
  try { raw = fs.readFileSync(0, "utf8"); } catch {}
  process.stdout.write(render(raw) + "\n");
  process.exit(0);
}
