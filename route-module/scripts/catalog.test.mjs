// Tests for catalog.mjs — how the hooks module reaches Route's derivation.
// Run with: node --test

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { catalog, locateRoute } from "./catalog.mjs";
import { TABLE_HEADER } from "../../route/scripts/route-protocols.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MODULE_ROOT = path.resolve(HERE, "..");
const REPO = path.resolve(MODULE_ROOT, "..");
const ROUTE_ROOT = path.join(REPO, "route");
const SCRIPT = path.join(HERE, "catalog.mjs");

// An install record pointing route-module at `moduleRoot` and route at
// `routeRoot`, both under one marketplace.
function configFixture({ moduleRoot, routeRoot, marketplace = "fixture-market" }) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "route-module-catalog-"));
  fs.mkdirSync(path.join(dir, "plugins"));
  const plugins = {};
  if (moduleRoot) plugins[`route-module@${marketplace}`] = [{ installPath: moduleRoot, version: "0.1.0" }];
  if (routeRoot) plugins[`route@${marketplace}`] = [{ installPath: routeRoot, version: "0.2.0" }];
  fs.writeFileSync(path.join(dir, "plugins", "installed_plugins.json"), JSON.stringify({ version: 2, plugins }));
  fs.writeFileSync(path.join(dir, "settings.json"), JSON.stringify({ enabledPlugins: {} }));
  return dir;
}

test("locateRoute: the install record's route@<own marketplace> comes first", () => {
  const routeRoot = fs.mkdtempSync(path.join(os.tmpdir(), "route-installed-"));
  fs.mkdirSync(path.join(routeRoot, "scripts"));
  fs.copyFileSync(path.join(ROUTE_ROOT, "scripts", "route-protocols.mjs"), path.join(routeRoot, "scripts", "route-protocols.mjs"));
  const dir = configFixture({ moduleRoot: MODULE_ROOT, routeRoot });
  assert.equal(locateRoute({ configDir: dir, pluginRoot: MODULE_ROOT }), routeRoot);
});

test("locateRoute: without a record, the sibling checkout stands in", () => {
  const dir = configFixture({});
  assert.equal(locateRoute({ configDir: dir, pluginRoot: MODULE_ROOT }), ROUTE_ROOT);
});

test("locateRoute: a record for another marketplace's route is not this plugin's", () => {
  const other = fs.mkdtempSync(path.join(os.tmpdir(), "route-other-"));
  fs.mkdirSync(path.join(other, "scripts"));
  fs.writeFileSync(path.join(other, "scripts", "route-protocols.mjs"), "");
  const dir = configFixture({ moduleRoot: MODULE_ROOT, routeRoot: other, marketplace: "elsewhere" });
  // route-module is recorded under "elsewhere" here, so route@elsewhere is
  // the sibling by record and wins over the checkout.
  assert.equal(locateRoute({ configDir: dir, pluginRoot: MODULE_ROOT }), other);
  // With route-module recorded under one marketplace and route under
  // another, the record yields nothing and the checkout stands in.
  const split = configFixture({ moduleRoot: MODULE_ROOT, routeRoot: other });
  const rec = JSON.parse(fs.readFileSync(path.join(split, "plugins", "installed_plugins.json"), "utf8"));
  rec.plugins["route@elsewhere"] = rec.plugins["route@fixture-market"];
  delete rec.plugins["route@fixture-market"];
  fs.writeFileSync(path.join(split, "plugins", "installed_plugins.json"), JSON.stringify(rec));
  assert.equal(locateRoute({ configDir: split, pluginRoot: MODULE_ROOT }), ROUTE_ROOT);
});

test("locateRoute: nothing found is null, and catalog() is then empty", () => {
  const dir = configFixture({});
  const lone = fs.mkdtempSync(path.join(os.tmpdir(), "route-module-lone-"));
  assert.equal(locateRoute({ configDir: dir, pluginRoot: lone }), null);
  assert.equal(catalog({ configDir: dir, pluginRoot: lone }), "");
});

test("catalog(): runs Route's derivation with Route as CLAUDE_PLUGIN_ROOT and returns its table", () => {
  // Route's derivation reads the config dir it is given; here the record
  // lists no protocol plugins, so the table is empty — what is checked is
  // that the run happens against Route's root and comes back clean.
  const dir = configFixture({ moduleRoot: MODULE_ROOT, routeRoot: ROUTE_ROOT });
  const out = catalog({ configDir: dir, pluginRoot: MODULE_ROOT, processEnv: { ...process.env, CLAUDE_CONFIG_DIR: dir } });
  assert.equal(out, "");
});

test("hook process: exit 0 on every path, stdout is the table or nothing", () => {
  const dir = configFixture({});
  const r = spawnSync(process.execPath, [SCRIPT], {
    encoding: "utf8",
    env: { ...process.env, CLAUDE_CONFIG_DIR: dir, CLAUDE_PLUGIN_ROOT: MODULE_ROOT },
  });
  assert.equal(r.status, 0);
  assert.ok(r.stdout === "" || r.stdout.startsWith(TABLE_HEADER), r.stdout.slice(0, 80));
  const lone = fs.mkdtempSync(path.join(os.tmpdir(), "route-module-lone-"));
  const none = spawnSync(process.execPath, [SCRIPT], {
    encoding: "utf8",
    env: { ...process.env, CLAUDE_CONFIG_DIR: dir, CLAUDE_PLUGIN_ROOT: lone },
  });
  assert.equal(none.status, 0);
  assert.equal(none.stdout, "");
});
