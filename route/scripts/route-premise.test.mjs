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
  PREMISE_HEADER,
  PREMISE_INDEX,
  PREMISE_INTRO,
  premiseRoot,
  renderPremise,
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

test("renders header, intro, and one line per document with its absolute path", () => {
  const host = makeHost();
  try {
    const root = premiseRoot(host.env);
    const lines = renderPremise(root).split("\n");
    assert.equal(lines[0], PREMISE_HEADER);
    assert.equal(lines[1], PREMISE_INTRO);
    assert.equal(lines.length, 2 + PREMISE_INDEX.length);
    PREMISE_INDEX.forEach((e, i) => {
      assert.equal(lines[2 + i], `Read \`${path.join(root, e.file)}\` ${e.when}`);
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
    assert.equal(out.split("\n").length, 3);
    assert.match(out, new RegExp(`Read \`[^\`]*${FIRST.replace(".", "\\.")}\``));
  } finally {
    cleanup(host);
  }
});

test("a null or empty root renders as nothing", () => {
  assert.equal(renderPremise(null), "");
  assert.equal(renderPremise("/nonexistent/premise"), "");
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
    assert.match(e.when, /^(when|before) /, `${e.file}: an entry states the moment it is for`);
  }
  assert.equal(new Set(indexed).size, indexed.length, "no document is indexed twice");
});
