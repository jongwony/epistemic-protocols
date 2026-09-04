/**
 * Derive the installed-protocol deficit table — shared by the SessionStart
 * hook (which injects it) and by tests. Nothing here is maintained by hand:
 * installed_plugins.json supplies each enabled plugin's install path, and
 * each protocol's own SKILL.md supplies the deficit it resolves. A protocol
 * that is not installed cannot appear, and a protocol added to the suite
 * needs no edit here.
 *
 * Selection keys on the MORPHISM `deficit:` line rather than the frontmatter
 * `Type: (...)` clause, because that clause is not uniform across the suite
 * and keying on it drops a protocol silently.
 *
 * Every shortfall returns [] so the caller can fail open. Zero external
 * dependencies: Node.js standard library only.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TABLE_HEADER = "Loaded core epistemic protocols, each with the deficit it resolves:";

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
  // <pluginRoot>/scripts/<this file> — two levels up.
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
 * The selection predicate on its own: a plugin directory is a core protocol
 * when it holds exactly one skill and that skill declares a deficit. Takes
 * no install record, so the repo tree can be checked against the canonical
 * registry with the same rule the hook applies to installed plugins.
 */
function selectProtocol(pluginDir) {
  const skill = soleSkill(pluginDir);
  return skill ? readProtocol(skill) : null;
}

/**
 * Every enabled plugin of this marketplace that is a single-skill protocol
 * declaring a deficit — Route itself excluded, since it never routes to
 * itself. Returns [] on any shortfall.
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
    const protocol = selectProtocol(at);
    if (protocol) protocols.push(protocol);
  }
  return protocols;
}

/**
 * Command and deficit name only. The table's job is to trigger, not to
 * match — matching happens inside /route, which resolves each candidate's
 * full description there — so the prose each name abbreviates stays out.
 */
function renderTable(protocols) {
  if (!protocols || protocols.length === 0) return "";
  const rows = protocols.map((p) => `/${p.command} ${p.deficit}`).join("\n");
  return `${TABLE_HEADER}\n${rows}`;
}

function parsePayload(raw) {
  try {
    const parsed = JSON.parse(String(raw ?? "").trim());
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/** True when `moduleUrl` is the script node was asked to run. */
function isMain(moduleUrl) {
  try {
    return !!process.argv[1]
      && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(moduleUrl));
  } catch {
    return true;
  }
}

export { TABLE_HEADER, deriveProtocols, isMain, parsePayload, renderTable, selectProtocol };
