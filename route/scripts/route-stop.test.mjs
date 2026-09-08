// Tests for route-stop.mjs — the Stop-hook second pass over an option set
// the turn just presented.
// Run with: node --test

import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { REASON, presentsOptionSet, render } from "./route-stop.mjs";

const SCRIPT = path.join(path.dirname(fileURLToPath(import.meta.url)), "route-stop.mjs");

const MARKDOWN_GATE = [
  "Which format should the config use?",
  "1. **JSON** — no dependency, no comments",
  "2. **YAML** — expressive, needs a parser",
  "3. **TOML** — the middle ground",
].join("\n");

const INK_GATE = [
  "· Format ──────────────",
  "Which format should the config use?",
  "1. JSON — no dependency, no comments",
  "   → nothing to install, but no place for a note",
  "2. YAML — expressive, needs a parser",
  "──────────────────────",
].join("\n");

const STEPS = [
  "To reproduce:",
  "1. Run the build",
  "2. Open the report",
  "3. Compare the two columns",
].join("\n");

const FINDINGS = [
  "Two things stand out:",
  "1. The index and the tree disagree on one file.",
  "2. **Note**: the test only catches removal.",
].join("\n");

const CONVERGENCE = [
  "· Convergence ───────────",
  "✓ Scope: defined",
  "○ Owner: pending",
  "─────────────────────────",
].join("\n");

function payload(fields) {
  return JSON.stringify({ hook_event_name: "Stop", ...fields });
}

// ---------------------------------------------------------------------------
// Reading an option set off a message's shape
// ---------------------------------------------------------------------------

test("a numbered list of bold-led items presents an option set", () => {
  assert.ok(presentsOptionSet(MARKDOWN_GATE));
  assert.ok(presentsOptionSet("prose\n\n1) **A** — x\n2) **B** — y\n"));
});

test("a divider block with numbered items presents an option set, bold or not", () => {
  assert.ok(presentsOptionSet(INK_GATE));
});

test("plain steps, a single bold item, and a lone divider are not option sets", () => {
  assert.ok(!presentsOptionSet(STEPS));
  assert.ok(!presentsOptionSet(FINDINGS));
  assert.ok(!presentsOptionSet(CONVERGENCE));
  assert.ok(!presentsOptionSet(""));
  assert.ok(!presentsOptionSet(undefined));
});

test("plain numbered items count only inside the block that opens above them", () => {
  assert.ok(!presentsOptionSet(`${CONVERGENCE}\n\n${STEPS}`));
  assert.ok(!presentsOptionSet(`${STEPS}\n\n${CONVERGENCE}`));
  assert.ok(presentsOptionSet(`${CONVERGENCE}\n\n${INK_GATE}`));
});

test("a gate quoted inside a fenced code block is not presented", () => {
  assert.ok(!presentsOptionSet(`The shape of a gate:\n\`\`\`\n${MARKDOWN_GATE}\n\`\`\`\nThat is all.`));
  assert.ok(!presentsOptionSet(`~~~\n${INK_GATE}\n~~~`));
  assert.ok(presentsOptionSet(`\`\`\`\n${STEPS}\n\`\`\`\n${MARKDOWN_GATE}`));
});

test("a fence closes only on its own character and no shorter a run", () => {
  assert.ok(!presentsOptionSet(`\`\`\`\`md\n\`\`\`\n${MARKDOWN_GATE}\n\`\`\`\n\`\`\`\``));
  assert.ok(!presentsOptionSet(`\`\`\`\n~~~\n${MARKDOWN_GATE}\n~~~\n\`\`\``));
  assert.ok(presentsOptionSet(`\`\`\`\`\n\`\`\`\n${STEPS}\n\`\`\`\n\`\`\`\`\n${MARKDOWN_GATE}`));
  assert.ok(presentsOptionSet(`~~~\n\`\`\`\n~~~\n${INK_GATE}`));
});

test("a fence is read off its lines wherever it is indented, and an inline span opens none", () => {
  const nested = MARKDOWN_GATE.split("\n").map((l) => `    ${l}`).join("\n");
  assert.ok(!presentsOptionSet(`- An example:\n\n    \`\`\`md\n${nested}\n    \`\`\`\n`));
  assert.ok(presentsOptionSet(`\`\`\`code\`\`\` is an inline span, not a fence.\n\n${MARKDOWN_GATE}`));
  assert.ok(!presentsOptionSet(`~~~ \`x\`\n${MARKDOWN_GATE}\n~~~`));
});

// ---------------------------------------------------------------------------
// Holding the stop, once
// ---------------------------------------------------------------------------

test("a stop after a presented option set is held, with the test as the reason", () => {
  const out = JSON.parse(render(payload({ stop_hook_active: false, last_assistant_message: MARKDOWN_GATE })));
  assert.equal(out.decision, "block");
  assert.equal(out.reason, REASON);
  assert.equal(JSON.parse(render(payload({ last_assistant_message: INK_GATE }))).decision, "block");
});

test("a stop that follows a held continuation passes through", () => {
  assert.equal(render(payload({ stop_hook_active: true, last_assistant_message: MARKDOWN_GATE })), "");
});

test("a stop after a message with no option set passes through", () => {
  assert.equal(render(payload({ stop_hook_active: false, last_assistant_message: STEPS })), "");
  assert.equal(render(payload({ stop_hook_active: false, last_assistant_message: "Done." })), "");
});

test("a payload without last_assistant_message passes through rather than failing", () => {
  assert.equal(render(payload({ stop_hook_active: false })), "");
  assert.equal(render(payload({ stop_hook_active: false, last_assistant_message: 42 })), "");
  assert.equal(render("not json"), "");
  assert.equal(render(""), "");
});

test("the reason names both endings, exempts a set that verifies understanding, and keeps the answer the user's", () => {
  assert.match(REASON, /relay/);
  assert.match(REASON, /leave the set open/);
  assert.match(REASON, /verify understanding[^.]*leave it as it stands/);
  assert.match(REASON, /axis/);
  assert.match(REASON, /do not answer the question for the user/);
  assert.match(REASON, /do not re-present the set/);
});

// ---------------------------------------------------------------------------
// As the host runs it
// ---------------------------------------------------------------------------

test("the script holds the stop on an option set and exits 0", () => {
  const r = spawnSync(process.execPath, [SCRIPT], {
    input: payload({ stop_hook_active: false, last_assistant_message: MARKDOWN_GATE }),
    encoding: "utf8",
  });
  assert.equal(r.status, 0);
  assert.equal(JSON.parse(r.stdout).decision, "block");
});

test("the script exits 0 and writes nothing on a pass-through stop and on an empty stdin", () => {
  for (const input of [payload({ stop_hook_active: true, last_assistant_message: MARKDOWN_GATE }), payload({ last_assistant_message: STEPS }), ""]) {
    const r = spawnSync(process.execPath, [SCRIPT], { input, encoding: "utf8" });
    assert.equal(r.status, 0);
    assert.equal(r.stdout, "");
  }
});
