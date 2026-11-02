/**
 * The routing cases' shape: the fields evals/README.md describes for
 * cases/cases.json.
 */

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CASES = path.join(path.dirname(fileURLToPath(import.meta.url)), "cases.json");
const OUTCOMES = ["silence", "singleton", "several", "monitor"];

function readCases() {
  return JSON.parse(fs.readFileSync(CASES, "utf8"));
}

test("the shipped fixtures cover every outcome and carry a typed adjudication flag", () => {
  const cases = readCases();
  assert.ok(Array.isArray(cases) && cases.length > 0, "cases.json is a non-empty array");
  const outcomes = new Set(cases.map((c) => c.outcome));
  for (const o of OUTCOMES) assert.ok(outcomes.has(o), `no fixture for ${o}`);
  const ids = new Set();
  for (const c of cases) {
    assert.ok(typeof c.id === "string" && c.id && !ids.has(c.id), `${c.id} is missing or repeated`);
    ids.add(c.id);
    assert.ok(OUTCOMES.includes(c.outcome), `${c.id} has outcome ${c.outcome}`);
    assert.ok(typeof c.prompt === "string" && c.prompt.length > 0, `${c.id} has no prompt`);
    // Whether a `true` reflects a review that happened is not readable here;
    // that the field exists and is typed is.
    assert.equal(typeof c.adjudicated, "boolean", `${c.id} has no adjudicated flag`);
    assert.ok(typeof c.note === "string" && c.note.length > 0, `${c.id} has no note`);
    assert.ok(Array.isArray(c.expected), `${c.id} has no expected`);
    if (c.conversation !== undefined) {
      assert.ok(Array.isArray(c.conversation), `${c.id} conversation is not a list`);
      for (const t of c.conversation) {
        assert.ok(["user", "assistant"].includes(t.role) && typeof t.text === "string", `${c.id} has a malformed turn`);
      }
    }
  }
  // Silence and monitor name no protocol to bring in.
  for (const c of cases.filter((c) => c.outcome === "silence" || c.outcome === "monitor")) {
    assert.deepEqual(c.expected, [], `${c.id} expects names`);
  }
  for (const c of cases.filter((c) => c.outcome === "singleton")) {
    assert.equal(c.expected.length, 1, `${c.id} is a singleton with ${c.expected.length} names`);
  }
});
