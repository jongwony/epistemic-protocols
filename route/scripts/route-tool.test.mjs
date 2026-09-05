// Tests for route-tool.mjs — the PreToolUse / PostToolUse delivery of
// premise entries at the tool calls the matcher decides are their moments.
// Run with: node --test

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { PREMISE_INDEX, TOOL_HEADER_AFTER, TOOL_HEADER_BEFORE } from "./route-premise.mjs";
import { changedPaths, describeCall, render } from "./route-tool.mjs";

const SCRIPT = path.join(path.dirname(fileURLToPath(import.meta.url)), "route-tool.mjs");
const byMoment = (m) => PREMISE_INDEX.filter((e) => e.at && e.at.moment === m);

// A host layout with premise/ beside the plugin root, holding every indexed
// document, so resolution takes the sibling path with no install record.
function makeHost() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "route-tool-"));
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

function payload(tool_name, tool_input, hook_event_name = "PreToolUse") {
  return JSON.stringify({ hook_event_name, tool_name, tool_input });
}

function lines(out) {
  return JSON.parse(out).hookSpecificOutput.additionalContext.split("\n");
}

function expectLines(host, entries) {
  return entries.map((e) => `Read \`${path.join(host.premise, e.file)}\` ${e.at.when}`);
}

// ---------------------------------------------------------------------------
// Reading the named paths off a call
// ---------------------------------------------------------------------------

test("a file tool names its path in its input", () => {
  assert.deepEqual(changedPaths({ tool_name: "Edit", tool_input: { file_path: "/p/CLAUDE.md" } }), ["/p/CLAUDE.md"]);
  assert.deepEqual(changedPaths({ tool_name: "Write", tool_input: { file_path: "/p/x/SKILL.md" } }), ["/p/x/SKILL.md"]);
  assert.deepEqual(changedPaths({ tool_name: "NotebookEdit", tool_input: { notebook_path: "/p/n.ipynb" } }), ["/p/n.ipynb"]);
  assert.deepEqual(changedPaths({ tool_name: "Edit", tool_input: {} }), []);
});

test("an apply_patch names each file on a header line, and nothing else in the patch", () => {
  const patch = [
    "*** Begin Patch",
    "*** Update File: docs/a.md",
    "@@",
    "-see CLAUDE.md for the rules",
    "+see AGENTS.md for the rules",
    "*** Add File: .claude/rules/new.md",
    "+# new",
    "*** Delete File: old/SKILL.md",
    "*** Update File: src/x.js",
    "*** Move to: src/y.js",
    "*** End Patch",
  ].join("\n");
  assert.deepEqual(
    changedPaths({ tool_name: "apply_patch", tool_input: { command: patch } }),
    ["docs/a.md", ".claude/rules/new.md", "old/SKILL.md", "src/x.js", "src/y.js"],
  );
  assert.deepEqual(changedPaths({ tool_name: "apply_patch", tool_input: {} }), []);
});

test("a shell command is not read for paths", () => {
  assert.deepEqual(changedPaths({ tool_name: "Bash", tool_input: { command: "sed -i 's/a/b/' AGENTS.md" } }), []);
  assert.deepEqual(changedPaths({ tool_name: "Bash", tool_input: { command: "cat CLAUDE.md > /dev/null" } }), []);
});

test("a tool that names no file yields nothing", () => {
  assert.deepEqual(changedPaths({ tool_name: "Read", tool_input: { file_path: "/p/CLAUDE.md" } }), []);
  assert.deepEqual(changedPaths({ tool_name: "Grep", tool_input: { pattern: "CLAUDE.md" } }), []);
  assert.deepEqual(changedPaths({}), []);
});

test("a call is described by its event, tool, and named paths; other events are not calls", () => {
  const c = describeCall({ hook_event_name: "PreToolUse", tool_name: "Edit", tool_input: { file_path: "/p/a.md" } });
  assert.deepEqual(c, { event: "PreToolUse", tool: "Edit", files: ["/p/a.md"] });
  assert.equal(describeCall({ hook_event_name: "SessionStart", tool_name: "Edit" }), null);
  assert.equal(describeCall({ hook_event_name: "PreToolUse" }), null);
});

// ---------------------------------------------------------------------------
// Each matcher-decided moment, rendered
// ---------------------------------------------------------------------------

test("changing an instruction surface delivers the instruction-surface entry, and only that", () => {
  const host = makeHost();
  try {
    const out = lines(render(payload("Edit", { file_path: "/p/.claude/rules/r.md" }), host.env));
    assert.equal(out[0], TOOL_HEADER_BEFORE);
    assert.deepEqual(out.slice(1), expectLines(host, byMoment("instruction-surface-change")));
    assert.equal(JSON.parse(render(payload("Write", { file_path: "/p/CLAUDE.md" }), host.env)).hookSpecificOutput.hookEventName, "PreToolUse");
    const patch = "*** Begin Patch\n*** Update File: CLAUDE.md\n*** End Patch";
    assert.deepEqual(lines(render(payload("apply_patch", { command: patch }), host.env)).slice(1), expectLines(host, byMoment("instruction-surface-change")));
  } finally {
    cleanup(host);
  }
});

test("handing work to an agent delivers the delegation entry before, and the report entry after", () => {
  const host = makeHost();
  try {
    const before = lines(render(payload("Agent", { prompt: "..." }), host.env));
    assert.equal(before[0], TOOL_HEADER_BEFORE);
    assert.deepEqual(before.slice(1), expectLines(host, byMoment("delegation")));
    const after = lines(render(payload("Agent", { prompt: "..." }, "PostToolUse"), host.env));
    assert.equal(after[0], TOOL_HEADER_AFTER);
    assert.deepEqual(after.slice(1), expectLines(host, byMoment("delegate-report")));
    assert.equal(JSON.parse(render(payload("Task", {}, "PostToolUse"), host.env)).hookSpecificOutput.hookEventName, "PostToolUse");
  } finally {
    cleanup(host);
  }
});

test("a call that is no document's moment renders nothing", () => {
  const host = makeHost();
  try {
    assert.equal(render(payload("Edit", { file_path: "/p/src/index.js" }), host.env), "");
    assert.equal(render(payload("Write", { file_path: "/p/docs/notes.md" }), host.env), "");
    assert.equal(render(payload("Bash", { command: "sed -i 's/a/b/' CLAUDE.md" }), host.env), "");
    assert.equal(render(payload("Read", { file_path: "/p/CLAUDE.md" }), host.env), "");
    assert.equal(render(payload("AskUserQuestion", {}), host.env), "");
    assert.equal(render(payload("Edit", { file_path: "/p/CLAUDE.md" }, "PostToolUse"), host.env), "");
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

test("the script exits 0 and writes nothing on a call that is no moment", () => {
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
    assert.match(JSON.parse(r.stdout).hookSpecificOutput.additionalContext, /instruction-authoring\.md/);
  } finally {
    cleanup(host);
  }
});
