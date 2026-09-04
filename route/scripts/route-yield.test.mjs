// Tests for hooksModuleCarries() — the condition under which route's command
// hooks yield to the route-module plugin's hooks module. Both branches are
// spawned as real hook processes against a fixture config directory, so what
// is checked is the exit and the output the host would see.
// Run with: node --test

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { MODULE_PLUGIN, hooksModuleCarries } from "./route-protocols.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROUTE_ROOT = path.resolve(HERE, "..");
const MARKETPLACE = "fixture-market";

// A config directory whose install record points route@<marketplace> at this
// checkout, with route-module enabled or not.
function configFixture({ moduleEnabled }) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "route-yield-"));
  fs.mkdirSync(path.join(dir, "plugins"));
  fs.writeFileSync(path.join(dir, "plugins", "installed_plugins.json"), JSON.stringify({
    version: 2,
    plugins: {
      [`route@${MARKETPLACE}`]: [{ scope: "user", installPath: ROUTE_ROOT, version: "0.2.0" }],
      [`${MODULE_PLUGIN}@${MARKETPLACE}`]: [{ scope: "user", installPath: path.join(dir, "route-module"), version: "0.1.0" }],
    },
  }));
  const enabledPlugins = { [`route@${MARKETPLACE}`]: true };
  if (moduleEnabled) enabledPlugins[`${MODULE_PLUGIN}@${MARKETPLACE}`] = true;
  fs.writeFileSync(path.join(dir, "settings.json"), JSON.stringify({ enabledPlugins }));
  return dir;
}

function runHook(script, input, env) {
  return spawnSync(process.execPath, [path.join(HERE, script)], {
    input,
    encoding: "utf8",
    env: { ...process.env, CLAUDE_CODE_ENABLE_FUNCTION_HOOKS: "", CLAUDE_PLUGIN_ROOT: ROUTE_ROOT, ...env },
  });
}

test("flag off: the hooks run whatever route-module's state is", () => {
  const dir = configFixture({ moduleEnabled: true });
  assert.equal(hooksModuleCarries({ CLAUDE_CODE_ENABLE_FUNCTION_HOOKS: "" }, { configDir: dir, pluginRoot: ROUTE_ROOT }), false);
  assert.equal(hooksModuleCarries({ CLAUDE_CODE_ENABLE_FUNCTION_HOOKS: "0" }, { configDir: dir, pluginRoot: ROUTE_ROOT }), false);
  const r = runHook("route-prompt.mjs", "{}", { CLAUDE_CONFIG_DIR: dir });
  assert.equal(r.status, 0);
  assert.ok(JSON.parse(r.stdout).hookSpecificOutput.additionalContext.length > 0);
});

test("flag on, route-module absent: the hooks keep running — the flag alone leaves nothing else to carry them", () => {
  const dir = configFixture({ moduleEnabled: false });
  const env = { CLAUDE_CODE_ENABLE_FUNCTION_HOOKS: "1" };
  assert.equal(hooksModuleCarries(env, { configDir: dir, pluginRoot: ROUTE_ROOT }), false);
  for (const script of ["route-prompt.mjs", "route-session.mjs"]) {
    const r = runHook(script, JSON.stringify({ source: "startup" }), { ...env, CLAUDE_CONFIG_DIR: dir });
    assert.equal(r.status, 0, script);
    assert.ok(r.stdout.length > 0, `${script} emitted nothing`);
    assert.ok(JSON.parse(r.stdout).hookSpecificOutput.additionalContext.includes("/route"), script);
  }
});

test("flag on, route-module enabled from the same marketplace: both hooks yield — exit 0, empty stdout", () => {
  const dir = configFixture({ moduleEnabled: true });
  const env = { CLAUDE_CODE_ENABLE_FUNCTION_HOOKS: "1" };
  assert.equal(hooksModuleCarries(env, { configDir: dir, pluginRoot: ROUTE_ROOT }), true);
  for (const script of ["route-prompt.mjs", "route-session.mjs"]) {
    const r = runHook(script, JSON.stringify({ source: "startup" }), { ...env, CLAUDE_CONFIG_DIR: dir });
    assert.equal(r.status, 0, script);
    assert.equal(r.stdout, "", script);
  }
});

test("route-module enabled from another marketplace does not count", () => {
  const dir = configFixture({ moduleEnabled: false });
  const settings = JSON.parse(fs.readFileSync(path.join(dir, "settings.json"), "utf8"));
  settings.enabledPlugins[`${MODULE_PLUGIN}@elsewhere`] = true;
  fs.writeFileSync(path.join(dir, "settings.json"), JSON.stringify(settings));
  assert.equal(hooksModuleCarries({ CLAUDE_CODE_ENABLE_FUNCTION_HOOKS: "1" }, { configDir: dir, pluginRoot: ROUTE_ROOT }), false);
});

test("an unreadable config directory reads as not carried", () => {
  assert.equal(hooksModuleCarries({ CLAUDE_CODE_ENABLE_FUNCTION_HOOKS: "1" }, { configDir: "/nonexistent/config", pluginRoot: ROUTE_ROOT }), false);
});
