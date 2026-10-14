// Tests for route/evals/cases/premise.json — the premise application cases
// hold to the index they measure: each names indexed documents and the
// action it grades, and the scaffold repository its cell is laid out in.
// Run with: node --test

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PREMISE_INDEX } from "./route-premise.mjs";
import { SCAFFOLDS } from "../evals/harness/scaffolds.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

test("each premise application case names indexed documents and the action it grades", () => {
  const cases = JSON.parse(fs.readFileSync(path.join(REPO, "route", "evals", "cases", "premise.json"), "utf8"));
  const indexed = new Set(PREMISE_INDEX.map((e) => e.file));
  assert.ok(cases.length > 0);
  assert.equal(new Set(cases.map((c) => c.id)).size, cases.length, "case ids are unique");
  for (const c of cases) {
    assert.ok(Array.isArray(c.governs) && c.governs.length > 0, `${c.id}: names what governs it`);
    for (const f of c.governs) assert.ok(indexed.has(f), `${c.id}: ${f} is an indexed document`);
    for (const k of ["moment", "prompt", "firstAction", "pass", "fail", "note"]) {
      assert.ok(typeof c[k] === "string" && c[k].trim(), `${c.id}: ${k}`);
    }
    assert.equal(typeof c.adjudicated, "boolean", `${c.id}: adjudicated`);
  }
});

// A path the case's text names (`dir/file.ext`) is one the agent is told
// exists, so the scaffold a cell lays out must hold it.
const NAMED_PATH = /\b[\w.-]+(?:\/[\w.-]+)+\.(?:js|json|md)\b/g;

test("each premise application case names a scaffold that holds the files its text names", () => {
  const cases = JSON.parse(fs.readFileSync(path.join(REPO, "route", "evals", "cases", "premise.json"), "utf8"));
  for (const c of cases) {
    assert.ok(typeof c.scaffold === "string" && SCAFFOLDS[c.scaffold], `${c.id}: scaffold ${JSON.stringify(c.scaffold)} resolves`);
    const files = Object.keys(SCAFFOLDS[c.scaffold]);
    const text = [c.prompt, ...(c.conversation ?? []).map((t) => t.text)].join("\n");
    for (const named of new Set(text.match(NAMED_PATH) ?? [])) {
      assert.ok(files.includes(named), `${c.id}: ${named} is in scaffold ${c.scaffold}`);
    }
    for (const bare of new Set(text.match(/\b[\w-]+\.(?:js|json)\b/g) ?? [])) {
      assert.ok(files.some((f) => path.posix.basename(f) === bare), `${c.id}: a file named ${bare} is in scaffold ${c.scaffold}`);
    }
  }
});
