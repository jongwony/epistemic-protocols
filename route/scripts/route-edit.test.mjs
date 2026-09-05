// Tests for route-edit.mjs — the PreToolUse delivery of edit-channel
// premise entries at the moment a tool call changes the surface they name.
// Run with: node --test

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { EDIT_HEADER, PREMISE_INDEX } from "./route-premise.mjs";
import { changedPaths, render } from "./route-edit.mjs";

const SCRIPT = path.join(path.dirname(fileURLToPath(import.meta.url)), "route-edit.mjs");
const EDIT_ENTRY = PREMISE_INDEX.find((e) => e.edit);

// A host layout with premise/ beside the plugin root, holding every indexed
// document, so resolution takes the sibling path with no install record.
function makeHost() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "route-edit-"));
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

function payload(tool_name, tool_input) {
  return JSON.stringify({ hook_event_name: "PreToolUse", tool_name, tool_input });
}

// ---------------------------------------------------------------------------
// Reading the changed paths off a call
// ---------------------------------------------------------------------------

test("a file tool names its path outright", () => {
  assert.deepEqual(changedPaths({ tool_name: "Edit", tool_input: { file_path: "/p/CLAUDE.md" } }), ["/p/CLAUDE.md"]);
  assert.deepEqual(changedPaths({ tool_name: "Write", tool_input: { file_path: "/p/x/SKILL.md" } }), ["/p/x/SKILL.md"]);
  assert.deepEqual(changedPaths({ tool_name: "Edit", tool_input: {} }), []);
});

test("a shell command yields its .md tokens only when it carries a write marker", () => {
  const write = "sed -i 's/a/b/' AGENTS.md";
  assert.deepEqual(changedPaths({ tool_name: "Bash", tool_input: { command: write } }), ["AGENTS.md"]);
  const heredoc = "python3 - <<'PY'\np='.claude/rules/x.md'; open(p,'w').write(s)\nPY";
  assert.deepEqual(changedPaths({ tool_name: "Bash", tool_input: { command: heredoc } }), [".claude/rules/x.md"]);
  const read = "cat AGENTS.md | grep -n foo";
  assert.deepEqual(changedPaths({ tool_name: "Bash", tool_input: { command: read } }), []);
  const devnull = "cat AGENTS.md > /dev/null";
  assert.deepEqual(changedPaths({ tool_name: "Bash", tool_input: { command: devnull } }), []);
});

test("an apply_patch names every .md in the patch, marker or not", () => {
  const patch = "*** Begin Patch\n*** Update File: docs/a.md\n*** Update File: CLAUDE.md\n*** End Patch";
  assert.deepEqual(changedPaths({ tool_name: "apply_patch", tool_input: { command: patch } }), ["docs/a.md", "CLAUDE.md"]);
});

test("a tool that changes nothing yields nothing", () => {
  assert.deepEqual(changedPaths({ tool_name: "Read", tool_input: { file_path: "/p/CLAUDE.md" } }), []);
  assert.deepEqual(changedPaths({ tool_name: "Grep", tool_input: { pattern: "CLAUDE.md" } }), []);
  assert.deepEqual(changedPaths({}), []);
});

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

test("an edit to an instruction surface delivers the edit-channel entry, and only that", () => {
  const host = makeHost();
  try {
    const out = JSON.parse(render(payload("Edit", { file_path: "/p/.claude/rules/r.md" }), host.env));
    assert.equal(out.suppressOutput, true);
    assert.equal(out.hookSpecificOutput.hookEventName, "PreToolUse");
    const lines = out.hookSpecificOutput.additionalContext.split("\n");
    assert.equal(lines[0], EDIT_HEADER);
    assert.equal(lines.length, 2);
    assert.equal(lines[1], `Read \`${path.join(host.premise, EDIT_ENTRY.file)}\` ${EDIT_ENTRY.when}`);
  } finally {
    cleanup(host);
  }
});

test("an edit elsewhere renders nothing", () => {
  const host = makeHost();
  try {
    assert.equal(render(payload("Edit", { file_path: "/p/src/index.js" }), host.env), "");
    assert.equal(render(payload("Write", { file_path: "/p/docs/notes.md" }), host.env), "");
    assert.equal(render(payload("Bash", { command: "cat CLAUDE.md" }), host.env), "");
  } finally {
    cleanup(host);
  }
});

test("an unresolved premise root renders nothing rather than failing", () => {
  assert.equal(render(payload("Edit", { file_path: "/p/CLAUDE.md" }), { configDir: "/nonexistent", pluginRoot: "/nonexistent" }), "");
  assert.equal(render("not json", { configDir: "/nonexistent", pluginRoot: "/nonexistent" }), "");
});

// ---------------------------------------------------------------------------
// As the host runs it
// ---------------------------------------------------------------------------

test("the script exits 0 and writes nothing on a call that changes no surface", () => {
  const r = spawnSync(process.execPath, [SCRIPT], { input: payload("Edit", { file_path: "/p/src/a.js" }), encoding: "utf8" });
  assert.equal(r.status, 0);
  assert.equal(r.stdout, "");
});

test("the script exits 0 on an empty stdin", () => {
  const r = spawnSync(process.execPath, [SCRIPT], { input: "", encoding: "utf8" });
  assert.equal(r.status, 0);
  assert.equal(r.stdout, "");
});

test("the script delivers the entry when premise/ sits beside the plugin root", () => {
  const host = makeHost();
  try {
    const r = spawnSync(process.execPath, [SCRIPT], {
      input: payload("Write", { file_path: "/p/AGENTS.md" }),
      encoding: "utf8",
      env: { ...process.env, CLAUDE_PLUGIN_ROOT: host.env.pluginRoot, CLAUDE_CONFIG_DIR: host.env.configDir },
    });
    assert.equal(r.status, 0);
    const out = JSON.parse(r.stdout);
    assert.match(out.hookSpecificOutput.additionalContext, new RegExp(EDIT_ENTRY.file.replace(".", "\\.")));
  } finally {
    cleanup(host);
  }
});
