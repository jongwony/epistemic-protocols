// Tests for route-premise.mjs — resolving the premise layer from the host's
// install records, rendering its index for injection, and holding the index
// against the shipped tree.
// Run with: node --test

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  MOMENTS,
  PREMISE_HEADER,
  PREMISE_INDEX,
  PREMISE_INTRO,
  TOOL_HEADER_AFTER,
  TOOL_HEADER_BEFORE,
  bindsAt,
  isInstructionSurface,
  premiseRoot,
  renderPremise,
  renderToolPremise,
} from "./route-premise.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");

// A host layout: the plugin installed as a versioned cache entry, the
// marketplace checkout recorded elsewhere, premise/ under the checkout
// holding the indexed documents (or the subset a test asks for).
function writePremise(dir, files) {
  fs.mkdirSync(dir, { recursive: true });
  for (const f of files) fs.writeFileSync(path.join(dir, f), `# ${f}\n`);
}

function makeHost({ record = true, checkoutFiles = PREMISE_INDEX.map((e) => e.file), siblingFiles = [] } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "route-premise-"));
  const configDir = path.join(root, "config");
  const checkout = path.join(root, "checkout");
  const pluginRoot = path.join(root, "cache", "mp", "route", "1.0.0");
  fs.mkdirSync(path.join(configDir, "plugins"), { recursive: true });
  fs.mkdirSync(pluginRoot, { recursive: true });
  if (record) {
    fs.writeFileSync(
      path.join(configDir, "plugins", "installed_plugins.json"),
      JSON.stringify({ version: 2, plugins: { "route@mp": [{ scope: "user", installPath: pluginRoot }] } }),
    );
    fs.writeFileSync(
      path.join(configDir, "plugins", "known_marketplaces.json"),
      JSON.stringify({ mp: { source: { source: "git" }, installLocation: checkout } }),
    );
  }
  if (checkoutFiles.length) writePremise(path.join(checkout, "premise"), checkoutFiles);
  if (siblingFiles.length) writePremise(path.join(pluginRoot, "..", "premise"), siblingFiles);
  return { root, checkout, pluginRoot, env: { configDir, pluginRoot } };
}

function cleanup(host) {
  fs.rmSync(host.root, { recursive: true, force: true });
}

const FIRST = PREMISE_INDEX[0].file;
const SESSION = PREMISE_INDEX.filter((e) => e.when);
const TOOL = PREMISE_INDEX.filter((e) => e.at);
const TOOL_ONLY = TOOL.filter((e) => !e.when);

// ---------------------------------------------------------------------------
// Resolution
// ---------------------------------------------------------------------------

test("resolves premise/ under the marketplace checkout the host records", () => {
  const host = makeHost();
  try {
    assert.equal(premiseRoot(host.env), path.join(host.checkout, "premise"));
  } finally {
    cleanup(host);
  }
});

test("falls back to premise/ beside the plugin root when no record reaches a checkout", () => {
  const host = makeHost({ record: false, checkoutFiles: [], siblingFiles: [FIRST] });
  try {
    assert.equal(premiseRoot(host.env), path.resolve(host.pluginRoot, "..", "premise"));
  } finally {
    cleanup(host);
  }
});

test("the recorded checkout wins over a sibling when both hold documents", () => {
  const host = makeHost({ siblingFiles: [FIRST] });
  try {
    assert.equal(premiseRoot(host.env), path.join(host.checkout, "premise"));
  } finally {
    cleanup(host);
  }
});

test("a checkout holding no indexed document is passed over rather than assumed", () => {
  const host = makeHost({ checkoutFiles: ["unrelated.md"], siblingFiles: [FIRST] });
  try {
    assert.equal(premiseRoot(host.env), path.resolve(host.pluginRoot, "..", "premise"));
  } finally {
    cleanup(host);
  }
});

test("no document anywhere resolves to null, never an error", () => {
  const host = makeHost({ checkoutFiles: [] });
  try {
    assert.equal(premiseRoot(host.env), null);
    assert.equal(premiseRoot({ configDir: "/nonexistent", pluginRoot: "/nonexistent" }), null);
  } finally {
    cleanup(host);
  }
});

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

test("renders header, intro, and one line per session-channel document with its absolute path", () => {
  const host = makeHost();
  try {
    const root = premiseRoot(host.env);
    const lines = renderPremise(root).split("\n");
    assert.equal(lines[0], PREMISE_HEADER);
    assert.equal(lines[1], PREMISE_INTRO);
    assert.equal(lines.length, 2 + SESSION.length);
    SESSION.forEach((e, i) => {
      assert.equal(lines[2 + i], `Read \`${path.join(root, e.file)}\` ${e.when}`);
    });
    // An entry whose moments are all observable is delivered at them, not here.
    for (const e of TOOL_ONLY) assert.doesNotMatch(lines.join("\n"), new RegExp(e.file.replace(".", "\\.")));
    // Every path is absolute and under the root; no relative link survives.
    for (const m of lines.join("\n").matchAll(/`([^`]+)`/g)) {
      assert.ok(path.isAbsolute(m[1]) && m[1].startsWith(root + path.sep), m[1]);
    }
  } finally {
    cleanup(host);
  }
});

test("an entry whose document is absent is left out; the rest go out", () => {
  const host = makeHost({ checkoutFiles: [FIRST] });
  try {
    const out = renderPremise(premiseRoot(host.env));
    assert.equal(out.split("\n").length, 3);
    assert.match(out, new RegExp(`Read \`[^\`]*${FIRST.replace(".", "\\.")}\``));
  } finally {
    cleanup(host);
  }
});

test("a null or empty root renders as nothing", () => {
  assert.equal(renderPremise(null), "");
  assert.equal(renderPremise("/nonexistent/premise"), "");
  const call = { event: "PreToolUse", tool: "Edit", input: {}, files: ["/p/CLAUDE.md"] };
  assert.equal(renderToolPremise(null, call), "");
  assert.equal(renderToolPremise("/nonexistent/premise", call), "");
});

test("the tool channel renders the entries whose moment the call is, under the event's header", () => {
  const host = makeHost();
  try {
    const root = premiseRoot(host.env);
    const before = renderToolPremise(root, { event: "PreToolUse", tool: "Edit", input: {}, files: ["/p/src/a.js", "/p/CLAUDE.md"] }).split("\n");
    assert.equal(before[0], TOOL_HEADER_BEFORE);
    const surface = TOOL.filter((e) => e.at.moment === "instruction-surface-change");
    assert.deepEqual(before.slice(1), surface.map((e) => `Read \`${path.join(root, e.file)}\` ${e.at.when}`));
    const after = renderToolPremise(root, { event: "PostToolUse", tool: "Agent", input: {}, files: [] }).split("\n");
    assert.equal(after[0], TOOL_HEADER_AFTER);
    assert.equal(renderToolPremise(root, { event: "PreToolUse", tool: "Edit", input: {}, files: ["/p/src/a.js"] }), "");
  } finally {
    cleanup(host);
  }
});

test("an instruction surface is recognized by path shape, on any host", () => {
  for (const f of [
    "CLAUDE.md", "/h/.claude/CLAUDE.md", "/p/AGENTS.md", "/p/CLAUDE.local.md",
    "/p/.claude/rules/r.md", "/p/.claude/rules/deep/r.md", "/p/.claude/principles/p.md",
    "/p/plug/skills/x/SKILL.md", "/p/plug/agents/a.md", "C:\\p\\.claude\\rules\\r.md",
  ]) assert.ok(isInstructionSurface(f), f);
  for (const f of [
    "/p/README.md", "/p/docs/rules.md", "/p/src/agents/a.js", "/p/.claude/settings.json",
    "/p/premise/instruction-authoring.md", "/p/agents-notes.md",
  ]) assert.ok(!isInstructionSurface(f), f);
  const call = { event: "PreToolUse", tool: "Edit", input: {}, files: ["/p/CLAUDE.md"] };
  assert.ok(bindsAt(TOOL.find((e) => e.at.moment === "instruction-surface-change"), call));
  assert.ok(!bindsAt(PREMISE_INDEX.find((e) => !e.at), call));
});

// ---------------------------------------------------------------------------
// The shipped tree
// ---------------------------------------------------------------------------

test("the index and the premise directory name the same documents", () => {
  // The index is kept by hand; this is the channel that re-runs it. An entry
  // for a document that is not there would send the agent to read nothing,
  // and a document with no entry would never be reached at its moment.
  const root = path.join(REPO, "premise");
  const indexed = PREMISE_INDEX.map((e) => e.file).sort();
  const shipped = fs.readdirSync(root)
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .sort();
  assert.deepEqual(indexed, shipped);
  for (const e of PREMISE_INDEX) {
    assert.ok(e.when || e.at, `${e.file}: an entry has a channel`);
    if (e.when) assert.match(e.when, /^(when|before) /, `${e.file}: the session clause states the moment it is for`);
    if (e.at) {
      assert.ok(MOMENTS[e.at.moment], `${e.file}: names a moment the hook can observe`);
      assert.match(e.at.when, /^(when|before) /, `${e.file}: the tool clause states the moment it is for`);
    }
  }
  assert.equal(new Set(indexed).size, indexed.length, "no document is indexed twice");
  assert.ok(TOOL.length > 0, "the tool channel carries at least one entry");
  assert.ok(TOOL_ONLY.length > 0, "some entry is delivered only at its moment");
  // Every observable moment the hook defines is some document's moment.
  for (const m of Object.keys(MOMENTS)) {
    assert.ok(TOOL.some((e) => e.at.moment === m), `${m}: a moment no entry names is dead`);
  }
});
