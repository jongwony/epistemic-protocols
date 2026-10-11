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
  LEAD_CLOSE,
  LEAD_OPEN,
  MOMENTS,
  PREMISE_HEADER,
  PREMISE_INDEX,
  TOOL_HEADER,
  bindsAt,
  isInstructionSurface,
  leadOf,
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
const TOOL = PREMISE_INDEX.filter((e) => e.at);

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

test("renders the header and one line per document with its absolute path", () => {
  const host = makeHost();
  try {
    const root = premiseRoot(host.env);
    const lines = renderPremise(root).split("\n");
    assert.equal(lines[0], PREMISE_HEADER);
    assert.equal(lines.length, 1 + PREMISE_INDEX.length);
    // These fixture documents mark no lead, so each line goes out unquoted.
    PREMISE_INDEX.forEach((e, i) => {
      assert.equal(lines[1 + i], `\`${path.join(root, e.file)}\` — Moments: ${e.moments}`);
    });
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
    assert.equal(out.split("\n").length, 2);
    assert.match(out, new RegExp(`^\`[^\`]*${FIRST.replace(".", "\\.")}\` — `, "m"));
  } finally {
    cleanup(host);
  }
});

test("a null or empty root renders as nothing", () => {
  assert.equal(renderPremise(null), "");
  assert.equal(renderPremise("/nonexistent/premise"), "");
  const call = { event: "PreToolUse", tool: "Edit", files: ["/p/CLAUDE.md"] };
  assert.equal(renderToolPremise(null, call), "");
  assert.equal(renderToolPremise("/nonexistent/premise", call), "");
});

test("the tool channel renders the entries whose moment the call is, under its header", () => {
  const host = makeHost();
  try {
    const root = premiseRoot(host.env);
    const out = renderToolPremise(root, { event: "PreToolUse", tool: "Edit", files: ["/p/src/a.js", "/p/CLAUDE.md"] }).split("\n");
    assert.equal(out[0], TOOL_HEADER);
    const surface = TOOL.filter((e) => e.at.moment === "instruction-surface-change");
    assert.deepEqual(out.slice(1), surface.map((e) => `${e.at.call} \`${path.join(root, e.file)}\` governs this moment.`));
    assert.equal(renderToolPremise(root, { event: "PreToolUse", tool: "Edit", files: ["/p/src/a.js"] }), "");
    assert.equal(renderToolPremise(root, { event: "PostToolUse", tool: "Agent", files: [] }), "");
  } finally {
    cleanup(host);
  }
});

test("a marked lead is quoted on both channels in the document's own words", () => {
  const host = makeHost();
  try {
    const root = premiseRoot(host.env);
    const lead = "The first sentence holds.\n  The second sentence wraps.";
    for (const e of PREMISE_INDEX) {
      fs.writeFileSync(path.join(root, e.file), `# ${e.file}\n\n${LEAD_OPEN}\n${lead}${LEAD_CLOSE} What follows stays out.\n`);
    }
    const quoted = '"The first sentence holds. The second sentence wraps."';
    const lines = renderPremise(root).split("\n");
    PREMISE_INDEX.forEach((e, i) => {
      assert.equal(lines[1 + i], `\`${path.join(root, e.file)}\` — ${quoted} Moments: ${e.moments}`);
    });
    const out = renderToolPremise(root, { event: "PreToolUse", tool: "Agent", files: [] }).split("\n");
    const delegation = TOOL.filter((e) => e.at.moment === "delegation");
    assert.deepEqual(out.slice(1), delegation.map((e) => `${e.at.call} \`${path.join(root, e.file)}\` governs this moment: ${quoted}`));
  } finally {
    cleanup(host);
  }
});

test("a lead is read only from exactly one marker pair, in order", () => {
  assert.equal(leadOf(`a ${LEAD_OPEN} b  c\n d ${LEAD_CLOSE} e`), "b c d");
  assert.equal(leadOf("no markers"), "");
  assert.equal(leadOf(`${LEAD_CLOSE} b ${LEAD_OPEN}`), "", "reversed pair");
  assert.equal(leadOf(`${LEAD_OPEN} a ${LEAD_CLOSE} ${LEAD_OPEN} b ${LEAD_CLOSE}`), "", "two pairs");
  assert.equal(leadOf(`${LEAD_OPEN} unclosed`), "");
  assert.equal(leadOf(undefined), "");
});

test("an instruction surface is recognized by path shape, on any host", () => {
  for (const f of [
    "CLAUDE.md", "/h/.claude/CLAUDE.md", "/p/AGENTS.md", "/p/AGENTS.override.md", "/p/CLAUDE.local.md",
    "/p/.claude/rules/r.md", "/p/.claude/rules/deep/r.md", "/p/.claude/principles/p.md",
    "/p/plug/skills/x/SKILL.md", "/p/plug/agents/a.md", "/p/plug/agents/review/security.md",
    "C:\\p\\.claude\\rules\\r.md",
  ]) assert.ok(isInstructionSurface(f), f);
  for (const f of [
    "/p/README.md", "/p/docs/rules.md", "/p/src/agents/a.js", "/p/.claude/settings.json",
    "/p/premise/instruction-authoring.md", "/p/agents-notes.md",
    // A path that leaves the rules directory is judged where it resolves.
    "/p/.claude/rules/../../docs/notes.md",
  ]) assert.ok(!isInstructionSurface(f), f);
  const call = { event: "PreToolUse", tool: "Edit", files: ["/p/CLAUDE.md"] };
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
    assert.ok(typeof e.moments === "string" && e.moments.trim().endsWith("."), `${e.file}: an entry states the moments it is for`);
    if (e.at) {
      assert.ok(MOMENTS[e.at.moment], `${e.file}: names a moment the matcher can decide`);
      assert.ok(typeof e.at.call === "string" && e.at.call.trim().endsWith("."), `${e.file}: the tool line says what the call is`);
    }
  }
  assert.equal(new Set(indexed).size, indexed.length, "no document is indexed twice");
  assert.ok(TOOL.length > 0, "the tool channel carries at least one entry");
  // Every observable moment the hook defines is some document's moment.
  for (const m of Object.keys(MOMENTS)) {
    assert.ok(TOOL.some((e) => e.at.moment === m), `${m}: a moment no entry names is dead`);
  }
});

test("every indexed document marks exactly one lead, and extraction returns it unchanged", () => {
  // The lead is quoted into the index at runtime, so the document is its
  // one source. This re-runs that relation: one marker pair per document,
  // the span a complete stretch of sentences, and extraction returning the
  // marked text itself — whitespace runs collapsed, nothing else.
  const root = path.join(REPO, "premise");
  for (const e of PREMISE_INDEX) {
    const text = fs.readFileSync(path.join(root, e.file), "utf8");
    assert.equal(text.split(LEAD_OPEN).length - 1, 1, `${e.file}: one opening marker`);
    assert.equal(text.split(LEAD_CLOSE).length - 1, 1, `${e.file}: one closing marker`);
    const raw = text.slice(text.indexOf(LEAD_OPEN) + LEAD_OPEN.length, text.indexOf(LEAD_CLOSE));
    const lead = leadOf(text);
    assert.equal(lead, raw.replace(/\s+/g, " ").trim(), `${e.file}: extraction returns the marked span`);
    assert.ok(!raw.trim().includes("\n"), `${e.file}: the lead sits within one paragraph line`);
    assert.match(lead, /^[A-Z*`]/, `${e.file}: the lead opens a sentence`);
    assert.match(lead, /[.!?]$/, `${e.file}: the lead closes a sentence`);
    // With the markers lifted out, the document reads as it would unmarked,
    // and the lead is a verbatim stretch of it.
    const unmarked = text.replace(new RegExp(`${LEAD_OPEN}\\s*`), "").replace(LEAD_CLOSE, "");
    assert.ok(unmarked.includes(lead), `${e.file}: the lead is the document's own words`);
  }
});

test("the shipped index stays inside one injection with the table beside it", () => {
  // Claude Code caps each additionalContext string at 10,000 characters and
  // the deficit table rides the same string at session start; past the cap
  // the host substitutes a file path and a preview. 8,500 leaves the table
  // its room. The root here is longer than an install path usually is.
  const premise = path.join(REPO, "premise");
  const host = fs.mkdtempSync(path.join(os.tmpdir(), "route-premise-budget-"));
  const root = path.join(host, "x".repeat(Math.max(1, 100 - host.length)), "premise");
  try {
    fs.mkdirSync(root, { recursive: true });
    for (const e of PREMISE_INDEX) fs.copyFileSync(path.join(premise, e.file), path.join(root, e.file));
    const out = renderPremise(root);
    assert.equal(out.split("\n").length, 1 + PREMISE_INDEX.length);
    assert.ok(out.includes('"'), "the copied documents carry their leads");
    assert.ok(out.length <= 8500, `the index is ${out.length} characters`);
  } finally {
    fs.rmSync(host, { recursive: true, force: true });
  }
});
