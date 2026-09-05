/**
 * Resolve the premise layer and render its index for SessionStart injection.
 *
 * The premise documents are a reference surface that ships beside the plugins
 * in this marketplace, under `premise/`. Their index (`premise/AGENTS.md`)
 * names each document and the moment that calls for it. Injected once per
 * context epoch, with every entry's path made absolute, the index reaches the
 * agent without a global rules file or an instruction-file pointer wired by
 * hand per host — installing Route is the whole setup.
 *
 * The premise root is the marketplace checkout the host keeps for this
 * plugin's own marketplace: `known_marketplaces.json` records where that
 * checkout lives, and `installed_plugins.json` says which marketplace this
 * plugin came from. Where neither record resolves — a plugin root that sits
 * inside a checkout rather than a versioned cache entry — `premise/` beside
 * the plugin root is the same directory. Nothing is copied and no path is
 * assumed: an index that cannot be found is left out.
 *
 * Every shortfall yields "" so the caller can fail open. Zero external
 * dependencies: Node.js standard library only.
 */

import fs from "node:fs";
import path from "node:path";
import { configDir, identify, pluginRoot, readJson } from "./route-protocols.mjs";

const PREMISE_INDEX = "AGENTS.md";

// Headed like the deficit table: the injection names its source and what to
// do with it, and the index itself carries the rest.
const PREMISE_HEADER =
  "Premise — the collaboration premises behind these protocols, indexed by the moment each document is for. Read a document at the moment its entry names:";

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

/**
 * The directory holding the premise index: `premise/` under the recorded
 * marketplace checkout, else `premise/` beside the plugin root. Null when
 * neither holds an index.
 */
function premiseRoot(env = {}) {
  const dir = env.configDir || configDir();
  const root = env.pluginRoot || pluginRoot();
  const candidates = [];
  const marketplace = marketplaceRoot(dir, root);
  if (marketplace) candidates.push(path.join(marketplace, "premise"));
  candidates.push(path.resolve(root, "..", "premise"));
  return candidates.find((c) => isFile(path.join(c, PREMISE_INDEX))) ?? null;
}

/**
 * The index with its heading dropped, each relative link replaced by the
 * absolute path it resolves to under `root`, and paragraphs packed one per
 * line. An index that cannot be read renders as "".
 */
function renderPremise(root) {
  if (!root) return "";
  let text;
  try {
    text = fs.readFileSync(path.join(root, PREMISE_INDEX), "utf8");
  } catch {
    return "";
  }
  const body = text
    .replace(/^#[^\n]*\n/, "")
    .replace(/\[[^\]]*\]\(([^)\s]+)\)/g, (link, target) =>
      /^(?:[a-z]+:|\/)/i.test(target) ? link : `\`${path.resolve(root, target)}\``)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
  return body ? `${PREMISE_HEADER}\n${body}` : "";
}

export { PREMISE_HEADER, PREMISE_INDEX, premiseRoot, renderPremise };
