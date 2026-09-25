/**
 * Test support: the child environment a subprocess test has to be given for
 * "no key, on this checkout's shipped binding" to actually hold.
 *
 * Not part of the runtime contract. Nothing under `skills/` or `hooks/` reaches
 * this file; it exists so the two test files that spawn a route script state
 * the same condition from one place.
 *
 * Two halves, and giving only the first leaves the condition unestablished:
 *
 *   - the credential, so no inherited export can arm the child;
 *   - the config selection, since `pluginRoot()` honours CLAUDE_PLUGIN_ROOT and
 *     an inherited one sends the child to another checkout's binding, whose
 *     `apiKeyEnv` names a variable this file did not clear — and a guard that
 *     reads the selected binding's variable then passes.
 *
 * CLAUDE_PLUGIN_ROOT is pinned rather than deleted: the assertions are about the
 * binding this repository ships, so the condition names it instead of relying on
 * the path-derived fallback to land there.
 *
 * Zero external dependencies: Node.js standard library only.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));

/** This checkout's plugin root — what the pinned CLAUDE_PLUGIN_ROOT points at. */
const PLUGIN_ROOT = path.join(HERE, "..");

const SHIPPED_CONFIG = path.join(PLUGIN_ROOT, "config", "evaluator.json");

/**
 * The variable the shipped binding arms on, read from the file so a test cannot
 * drift from what actually ships.
 */
function shippedKeyEnv() {
  return JSON.parse(fs.readFileSync(SHIPPED_CONFIG, "utf8")).apiKeyEnv;
}

/** The environment above, over `base` (the current process by default). */
function envWithoutKeys(base = process.env) {
  const env = { ...base };
  // The shipped name is read rather than written down; the vendor name is
  // listed too, so a rename of the shipped one still clears the old export.
  for (const name of new Set([shippedKeyEnv(), "TYPESAFE_API_KEY"])) delete env[name];
  env.CLAUDE_PLUGIN_ROOT = PLUGIN_ROOT;
  return env;
}

export { PLUGIN_ROOT, SHIPPED_CONFIG, envWithoutKeys, shippedKeyEnv };
