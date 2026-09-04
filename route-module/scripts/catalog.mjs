#!/usr/bin/env node
/**
 * Print the installed-protocol table by running Route's own derivation.
 *
 * The hooks module (hooks/route.ts) runs this file on the host at session
 * start. The derivation itself — which installed plugins are core protocols,
 * and the deficit each resolves — lives in Route's scripts/route-protocols.mjs
 * and nowhere else; this file only finds that script and runs it, so the two
 * plugins keep one source for what the table says.
 *
 * Route is found the way the host records it: the install record names this
 * plugin's marketplace, and `route@<that marketplace>` gives Route's install
 * path. When this plugin runs from disk instead (`--plugin-dir`), a sibling
 * `../route` checkout stands in. Route's script is run with CLAUDE_PLUGIN_ROOT
 * set to Route's own root, so it identifies itself and not this plugin.
 *
 * Every shortfall is open: empty stdout, exit 0. A table that does not
 * arrive costs one catalog; a hook that fails would cost the session.
 * Zero external dependencies: Node.js standard library only.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROUTE = "route";
const SCRIPT = path.join("scripts", "route-protocols.mjs");

function configDir() {
  return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude");
}

function pluginRoot() {
  if (process.env.CLAUDE_PLUGIN_ROOT) return process.env.CLAUDE_PLUGIN_ROOT;
  return path.dirname(path.dirname(fileURLToPath(import.meta.url)));
}

function readJson(file) {
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function samePath(a, b) {
  try {
    return fs.realpathSync(a) === fs.realpathSync(b);
  } catch {
    return path.resolve(a) === path.resolve(b);
  }
}

/** This plugin's marketplace, read off the install record entry that points at it. */
function ownMarketplace(root, records) {
  for (const [key, entries] of Object.entries(records)) {
    if (!Array.isArray(entries)) continue;
    for (const entry of entries) {
      const at = entry && entry.installPath;
      if (typeof at === "string" && samePath(at, root)) {
        const i = key.lastIndexOf("@");
        return i > 0 ? key.slice(i + 1) : null;
      }
    }
  }
  return null;
}

/**
 * Route's root: the install record's path for `route@<own marketplace>`,
 * else a sibling checkout beside this plugin. Null when neither carries the
 * derivation script.
 */
function locateRoute(env = {}) {
  const dir = env.configDir || configDir();
  const root = env.pluginRoot || pluginRoot();
  const candidates = [];
  const installed = readJson(path.join(dir, "plugins", "installed_plugins.json"));
  const records = installed && installed.plugins;
  if (records && typeof records === "object") {
    const marketplace = ownMarketplace(root, records);
    const entries = marketplace ? records[`${ROUTE}@${marketplace}`] : null;
    if (Array.isArray(entries)) {
      for (const e of entries) if (e && typeof e.installPath === "string") candidates.push(e.installPath);
    }
  }
  candidates.push(path.join(path.dirname(root), ROUTE));
  return candidates.find((c) => fs.existsSync(path.join(c, SCRIPT))) || null;
}

/** The table as Route's script prints it, or "" on any shortfall. */
function catalog(env = {}) {
  const routeRoot = locateRoute(env);
  if (!routeRoot) return "";
  const r = spawnSync(process.execPath, [path.join(routeRoot, SCRIPT)], {
    encoding: "utf8",
    env: { ...(env.processEnv || process.env), CLAUDE_PLUGIN_ROOT: routeRoot },
    timeout: 8_000,
  });
  return r.status === 0 && typeof r.stdout === "string" ? r.stdout : "";
}

function isMain(moduleUrl) {
  try {
    return !!process.argv[1]
      && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(moduleUrl));
  } catch {
    return true;
  }
}

export { catalog, locateRoute };

if (isMain(import.meta.url)) {
  let out = "";
  try {
    out = catalog();
  } catch {
    // Open: nothing printed.
  }
  if (out) process.stdout.write(out.endsWith("\n") ? out : out + "\n");
  process.exit(0);
}
