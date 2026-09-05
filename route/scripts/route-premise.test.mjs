// Tests for route-premise.mjs — resolving the premise layer from the host's
// install records and rendering its index for injection.
// Run with: node --test

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PREMISE_HEADER, PREMISE_INDEX, premiseRoot, renderPremise } from "./route-premise.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");

const INDEX = [
  "# Premise",
  "",
  "The premises behind the dialogue.",
  "",
  "Read [`alpha.md`](alpha.md) when the first moment comes.",
  "",
  "Read [`beta.md`](beta.md) when the second moment comes, and [the site](https://example.test/) for more.",
  "",
].join("\n");

// A host layout: the plugin installed as a versioned cache entry, the
// marketplace checkout recorded elsewhere, premise/ under the checkout.
function makeHost({ record = true, checkoutPremise = true, siblingPremise = false } = {}) {
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
  if (checkoutPremise) {
    fs.mkdirSync(path.join(checkout, "premise"), { recursive: true });
    fs.writeFileSync(path.join(checkout, "premise", PREMISE_INDEX), INDEX);
  }
  if (siblingPremise) {
    const sibling = path.join(pluginRoot, "..", "premise");
    fs.mkdirSync(sibling, { recursive: true });
    fs.writeFileSync(path.join(sibling, PREMISE_INDEX), INDEX);
  }
  return { root, checkout, pluginRoot, env: { configDir, pluginRoot } };
}

function cleanup(host) {
  fs.rmSync(host.root, { recursive: true, force: true });
}

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
  const host = makeHost({ record: false, checkoutPremise: false, siblingPremise: true });
  try {
    assert.equal(premiseRoot(host.env), path.resolve(host.pluginRoot, "..", "premise"));
  } finally {
    cleanup(host);
  }
});

test("the recorded checkout wins over a sibling when both hold an index", () => {
  const host = makeHost({ siblingPremise: true });
  try {
    assert.equal(premiseRoot(host.env), path.join(host.checkout, "premise"));
  } finally {
    cleanup(host);
  }
});

test("a checkout without an index is passed over rather than assumed", () => {
  const host = makeHost({ checkoutPremise: false, siblingPremise: true });
  try {
    assert.equal(premiseRoot(host.env), path.resolve(host.pluginRoot, "..", "premise"));
  } finally {
    cleanup(host);
  }
});

test("no index anywhere resolves to null, never an error", () => {
  const host = makeHost({ checkoutPremise: false });
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

test("renders the index under its header with every relative link made absolute", () => {
  const host = makeHost();
  try {
    const root = premiseRoot(host.env);
    const out = renderPremise(root);
    const lines = out.split("\n");
    assert.equal(lines[0], PREMISE_HEADER);
    assert.equal(lines[1], "The premises behind the dialogue.");
    assert.equal(lines[2], `Read \`${path.join(root, "alpha.md")}\` when the first moment comes.`);
    assert.match(lines[3], new RegExp(`^Read \`${path.join(root, "beta.md").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\` when`));
    // The heading is dropped, paragraphs are packed, no relative link survives.
    assert.doesNotMatch(out, /^# /m);
    assert.doesNotMatch(out, /\n\n/);
    assert.doesNotMatch(out, /\]\((?!https?:)[^)]*\)/);
  } finally {
    cleanup(host);
  }
});

test("an absolute link is left as it is", () => {
  const host = makeHost();
  try {
    const out = renderPremise(premiseRoot(host.env));
    assert.match(out, /\[the site\]\(https:\/\/example\.test\/\)/);
  } finally {
    cleanup(host);
  }
});

test("a null or unreadable root renders as nothing", () => {
  assert.equal(renderPremise(null), "");
  assert.equal(renderPremise("/nonexistent/premise"), "");
});

// ---------------------------------------------------------------------------
// The shipped index
// ---------------------------------------------------------------------------

test("every entry of the shipped index resolves to a document that exists", () => {
  // The index is what the hook injects; an entry pointing at a document that
  // is not there would send the agent to read nothing. This is the channel
  // that re-runs that claim.
  const root = path.join(REPO, "premise");
  const out = renderPremise(root);
  assert.ok(out.startsWith(PREMISE_HEADER));
  const paths = [...out.matchAll(/`(\/[^`]+\.md)`/g)].map((m) => m[1]);
  assert.ok(paths.length > 0, "the shipped index names at least one document");
  for (const p of paths) {
    assert.ok(fs.existsSync(p), `index entry points at a missing document: ${p}`);
    assert.ok(p.startsWith(root + path.sep), `index entry leaves the premise root: ${p}`);
  }
  assert.doesNotMatch(out, /\]\([^)]*\)/, "no link survives unresolved");
});
