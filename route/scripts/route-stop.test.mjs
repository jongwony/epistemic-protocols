// Tests for route-stop.mjs — returning a turn for one reading at its close,
// and the conditions under which it must let the close through instead.
// Run with: node --test

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { CLOSE_HEADER, PREMISE_INDEX } from "./route-premise.mjs";
import { EVENTS, render } from "./route-stop.mjs";

// A host whose recorded marketplace checkout holds the premise documents.
function makeHost({ files = PREMISE_INDEX.map((e) => e.file) } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "route-stop-"));
  const configDir = path.join(root, "config");
  const checkout = path.join(root, "checkout");
  const pluginRoot = path.join(root, "cache", "mp", "route", "1.0.0");
  fs.mkdirSync(path.join(configDir, "plugins"), { recursive: true });
  fs.mkdirSync(pluginRoot, { recursive: true });
  fs.writeFileSync(
    path.join(configDir, "plugins", "installed_plugins.json"),
    JSON.stringify({ version: 2, plugins: { "route@mp": [{ scope: "user", installPath: pluginRoot }] } }),
  );
  fs.writeFileSync(
    path.join(configDir, "plugins", "known_marketplaces.json"),
    JSON.stringify({ mp: { source: { source: "git" }, installLocation: checkout } }),
  );
  if (files.length) {
    fs.mkdirSync(path.join(checkout, "premise"), { recursive: true });
    for (const f of files) fs.writeFileSync(path.join(checkout, "premise", f), `# ${f}\n`);
  }
  return { root, checkout, env: { configDir, pluginRoot } };
}

const cleanup = (h) => fs.rmSync(h.root, { recursive: true, force: true });
const payload = (o) => JSON.stringify(o);
const CLOSING = PREMISE_INDEX.filter((e) => e.atClose);

test("a turn's first close is returned for the reading, under the close header", () => {
  const host = makeHost();
  try {
    const out = JSON.parse(render(payload({ hook_event_name: "Stop", stop_hook_active: false }), host.env));
    assert.equal(out.decision, "block");
    const lines = out.reason.split("\n");
    assert.deepEqual(lines.slice(0, CLOSE_HEADER.split("\n").length), CLOSE_HEADER.split("\n"));
    assert.deepEqual(
      lines.slice(CLOSE_HEADER.split("\n").length),
      CLOSING.map((e) => `Read \`${path.join(host.checkout, "premise", e.file)}\` ${e.atClose.when}`),
    );
    // The reading has a document to be read against, by absolute path.
    for (const m of out.reason.matchAll(/`([^`]+)`/g)) assert.ok(path.isAbsolute(m[1]), m[1]);
  } finally {
    cleanup(host);
  }
});

test("the decision sits at the top level, which is where the runtime reads it", () => {
  const host = makeHost();
  try {
    const out = JSON.parse(render(payload({ hook_event_name: "Stop", stop_hook_active: false }), host.env));
    // hookSpecificOutput carries no decision for this event; a decision nested
    // there is read by nothing and the turn closes as though the hook were absent.
    assert.equal(out.hookSpecificOutput, undefined);
    assert.equal(typeof out.reason, "string");
    assert.ok(out.reason.length > 0);
  } finally {
    cleanup(host);
  }
});

test("a subagent's close is the same moment", () => {
  const host = makeHost();
  try {
    const out = JSON.parse(render(payload({ hook_event_name: "SubagentStop", stop_hook_active: false }), host.env));
    assert.equal(out.decision, "block");
    assert.ok(EVENTS.has("SubagentStop"));
  } finally {
    cleanup(host);
  }
});

test("the second pass lets the close through, so a reading is never a loop", () => {
  const host = makeHost();
  try {
    assert.equal(render(payload({ hook_event_name: "Stop", stop_hook_active: true }), host.env), "");
    assert.equal(render(payload({ hook_event_name: "SubagentStop", stop_hook_active: true }), host.env), "");
  } finally {
    cleanup(host);
  }
});

test("a payload it cannot read lets the close through rather than defaulting to one", () => {
  const host = makeHost();
  try {
    // Malformed, empty, and event-less input each also hide stop_hook_active,
    // so blocking on them would block with the loop guard unreadable.
    for (const raw of ["not json", "", "{}", payload({ stop_hook_active: false })]) {
      assert.equal(render(raw, host.env), "", JSON.stringify(raw));
    }
    assert.equal(render(payload({ hook_event_name: "PreToolUse" }), host.env), "");
    assert.equal(render(payload({ hook_event_name: "SessionStart" }), host.env), "");
  } finally {
    cleanup(host);
  }
});

test("no premise document resolves to no reading, never a bare block", () => {
  const host = makeHost({ files: [] });
  try {
    assert.equal(render(payload({ hook_event_name: "Stop", stop_hook_active: false }), host.env), "");
  } finally {
    cleanup(host);
  }
});
