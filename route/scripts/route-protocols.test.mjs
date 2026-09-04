// Tests for route-protocols.mjs — the selection predicate behind the table.
// Run with: node --test
//
// deriveProtocols() asserts, without saying so, that every core protocol in
// this suite is a single-skill plugin whose SKILL.md carries a `deficit:`
// line. Nothing else re-runs that assertion: a protocol that gains a second
// skill, or whose deficit line changes shape, would leave the table without
// a word — the class of miss the anamnesis `Type:`-clause case showed. This
// file is the enforcement channel: the same predicate the hook applies to
// installed plugins is run over the repo tree and compared, by identity and
// never by count, against the canonical registry.

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { selectProtocol } from "./route-protocols.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
const require = createRequire(import.meta.url);
// The registry carries plugin names (lowercased), not commands, so the
// comparison is over plugin names; the command each protocol declares is
// checked for shape, not against a second list.
const { CANONICAL_PROTOCOL_SET } = require(path.join(REPO, "scripts", "load-protocols.js"));

function pluginDirs(root) {
  return fs.readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((name) => fs.existsSync(path.join(root, name, ".claude-plugin", "plugin.json")))
    .sort();
}

test("the selection rule over the repo tree matches the canonical registry exactly", () => {
  const selected = new Map();
  for (const name of pluginDirs(REPO)) {
    if (name === "route") continue; // never routes to itself
    const protocol = selectProtocol(path.join(REPO, name));
    if (protocol) selected.set(name, protocol);
  }
  const canonical = new Set(CANONICAL_PROTOCOL_SET);
  const missing = [...canonical].filter((n) => !selected.has(n)).sort();
  const extra = [...selected.keys()].filter((n) => !canonical.has(n)).sort();
  assert.deepEqual(
    { missing, extra },
    { missing: [], extra: [] },
    `selection drifted from the registry — missing (in registry, not selected): [${missing}]; extra (selected, not in registry): [${extra}]`,
  );
  for (const [name, protocol] of selected) {
    assert.match(protocol.command, /^[a-z][a-z-]*$/, `${name}: command shape`);
    assert.match(protocol.deficit, /^[A-Z]\w+$/, `${name}: deficit shape`);
  }
});

// What the assertion above would fail on, shown on fixtures rather than on
// the tree: the two silent-drop vectors.

function copyProtocol(name) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "route-protocols-"));
  const dst = path.join(tmp, name);
  fs.cpSync(path.join(REPO, name), dst, { recursive: true });
  return dst;
}

test("a core protocol that gains a second skill stops being selected", () => {
  const dir = copyProtocol(CANONICAL_PROTOCOL_SET[0]);
  assert.ok(selectProtocol(dir), "the copy selects before the change");
  const extra = path.join(dir, "skills", "x");
  fs.mkdirSync(extra, { recursive: true });
  fs.writeFileSync(path.join(extra, "SKILL.md"), "---\nname: x\ndescription: helper\n---\n");
  assert.equal(selectProtocol(dir), null);
});

test("a deficit line that changes shape stops being selected", () => {
  const dir = copyProtocol(CANONICAL_PROTOCOL_SET[0]);
  const skillDir = fs.readdirSync(path.join(dir, "skills"))[0];
  const file = path.join(dir, "skills", skillDir, "SKILL.md");
  const text = fs.readFileSync(file, "utf8");
  assert.match(text, /^deficit:[ \t]+\w+/m, "the copy carries a deficit line before the change");
  fs.writeFileSync(file, text.replace(/^deficit:[ \t]+/m, "deficit : "));
  assert.equal(selectProtocol(dir), null);
});
