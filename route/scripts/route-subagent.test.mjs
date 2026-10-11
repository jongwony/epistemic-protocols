// Tests for route-subagent.mjs — the SubagentStart delivery of the premise
// index into a subagent's own context.
// Run with: node --test

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { PREMISE_INDEX, renderPremise } from "./route-premise.mjs";
import { render } from "./route-subagent.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = path.join(HERE, "route-subagent.mjs");
const HOOKS = path.join(HERE, "..", "hooks", "hooks.json");

// A host layout with premise/ beside the plugin root, holding every indexed
// document, so resolution takes the sibling path with no install record.
function makeHost() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "route-subagent-"));
  const pluginRoot = path.join(root, "route");
  const premise = path.join(root, "premise");
  fs.mkdirSync(pluginRoot, { recursive: true });
  fs.mkdirSync(premise, { recursive: true });
  for (const e of PREMISE_INDEX) fs.writeFileSync(path.join(premise, e.file), `# ${e.file}\n`);
  return { root, premise, env: { configDir: path.join(root, "nonexistent"), pluginRoot } };
}

function cleanup(host) {
  fs.rmSync(host.root, { recursive: true, force: true });
}

function payload(agent_type, hook_event_name = "SubagentStart") {
  return JSON.stringify({ hook_event_name, agent_id: "agent-1", agent_type });
}

test("a fresh subagent receives the session-start index, and only that", () => {
  const host = makeHost();
  try {
    for (const type of ["general-purpose", "Explore", "my-plugin:reviewer", "worker"]) {
      const out = JSON.parse(render(payload(type), host.env));
      assert.deepEqual(Object.keys(out), ["hookSpecificOutput"]);
      assert.equal(out.hookSpecificOutput.hookEventName, "SubagentStart");
      assert.equal(out.hookSpecificOutput.additionalContext, renderPremise(host.premise));
    }
  } finally {
    cleanup(host);
  }
});

test("a fork, which inherits the conversation, receives nothing", () => {
  const host = makeHost();
  try {
    assert.equal(render(payload("fork"), host.env), "");
  } finally {
    cleanup(host);
  }
});

test("another event, an unresolved root, or a malformed payload renders nothing", () => {
  const host = makeHost();
  try {
    assert.equal(render(payload("general-purpose", "SessionStart"), host.env), "");
    assert.equal(render(payload("general-purpose"), { configDir: "/nonexistent", pluginRoot: "/nonexistent" }), "");
    assert.equal(render("not json", { configDir: "/nonexistent", pluginRoot: "/nonexistent" }), "");
  } finally {
    cleanup(host);
  }
});

test("the script exits 0 on an empty stdin and delivers from a sibling premise/", () => {
  const empty = spawnSync(process.execPath, [SCRIPT], { input: "", encoding: "utf8", env: { ...process.env, CLAUDE_CONFIG_DIR: "/nonexistent", CLAUDE_PLUGIN_ROOT: "/nonexistent" } });
  assert.equal(empty.status, 0);
  assert.equal(empty.stdout, "");
  const host = makeHost();
  try {
    const r = spawnSync(process.execPath, [SCRIPT], {
      input: payload("general-purpose"),
      encoding: "utf8",
      env: { ...process.env, CLAUDE_PLUGIN_ROOT: host.env.pluginRoot, CLAUDE_CONFIG_DIR: host.env.configDir },
    });
    assert.equal(r.status, 0);
    assert.match(JSON.parse(r.stdout).hookSpecificOutput.additionalContext, /delegation-and-subagents\.md/);
  } finally {
    cleanup(host);
  }
});

test("hooks.json registers the script on SubagentStart", () => {
  const hooks = JSON.parse(fs.readFileSync(HOOKS, "utf8"));
  assert.deepEqual(Object.keys(hooks).sort(), ["description", "hooks"], "Codex rejects any other top-level key");
  const commands = (hooks.hooks.SubagentStart || []).flatMap((g) => g.hooks.map((h) => h.command));
  assert.ok(commands.some((c) => c.includes("scripts/route-subagent.mjs")));
});
