// Tests for route-prompt.mjs — the UserPromptSubmit routing directive.
// Run with: node --test
// Repo precedent: anamnesis/scripts/hypomnesis-write.test.mjs (node:test + node:assert).

import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { DIRECTIVE, parsePayload, render } from "./route-prompt.mjs";

const SCRIPT = path.join(path.dirname(fileURLToPath(import.meta.url)), "route-prompt.mjs");

function runHook(input) {
  return spawnSync(process.execPath, [SCRIPT], { input, encoding: "utf8" });
}

test("directive carries the firing conditions and stays short", () => {
  // (a) the screen is catalog-free: symptoms of the interaction falling
  //     short, readable off the turn without any protocol's deficit in hand
  assert.match(DIRECTIVE, /Invoke \/route when this turn shows the interaction itself falling short/);
  assert.match(DIRECTIVE, /neither side has defined/);
  assert.match(DIRECTIVE, /not yet partitioned/);
  // (b) matching by protocol is /route's, not the screen's — a screen that
  //     asks which protocol resolves it needs a catalog the agent may lack
  assert.match(DIRECTIVE, /Which protocol resolves it is \/route's to decide; do not screen by protocol yourself/);
  // (c) active-protocol exclusion, with "active" defined in place: invoked
  //     and not yet converged/deactivated — leftover skill prose is not active
  assert.match(DIRECTIVE, /Skip while an epistemic protocol is active: invoked this session and not yet converged or deactivated/);
  assert.match(DIRECTIVE, /converged protocol's prose still in context does not make it active/);
  // (d) silence otherwise
  assert.match(DIRECTIVE, /Otherwise stay silent/);
  assert.ok(DIRECTIVE.split("\n").length <= 5);
});

test("directive does not screen on a catalog the agent may not hold", () => {
  // The falsified premise: a host's listing may carry bare identifiers, so a
  // condition phrased over "a deficit a loaded protocol resolves" asks for a
  // match against a catalog absent at prompt time. Guard the old phrasing out.
  assert.doesNotMatch(DIRECTIVE, /accumulated context shows an interaction deficit/);
  assert.doesNotMatch(DIRECTIVE, /loaded core epistemic protocol resolves, invoke/);
});

test("parsePayload tolerates empty and malformed stdin", () => {
  assert.deepEqual(parsePayload(""), {});
  assert.deepEqual(parsePayload("not json"), {});
  assert.deepEqual(parsePayload(undefined), {});
  assert.deepEqual(parsePayload("[1,2]"), [1, 2]);
});

test("render carries the directive as UserPromptSubmit additionalContext", () => {
  const out = JSON.parse(render(JSON.stringify({
    hook_event_name: "UserPromptSubmit",
    prompt: "hello",
  })));
  assert.equal(out.hookSpecificOutput.hookEventName, "UserPromptSubmit");
  assert.equal(out.hookSpecificOutput.additionalContext, DIRECTIVE);
  assert.equal(out.suppressOutput, true);
});

test("render on empty stdin still yields the directive", () => {
  const out = JSON.parse(render(""));
  assert.equal(out.hookSpecificOutput.hookEventName, "UserPromptSubmit");
  assert.ok(out.hookSpecificOutput.additionalContext.includes("/route"));
});

test("hook process exits 0 with the directive on empty stdin", () => {
  const result = runHook("");
  assert.equal(result.status, 0);
  const out = JSON.parse(result.stdout);
  assert.ok(out.hookSpecificOutput.additionalContext.includes("/route"));
});

test("hook process exits 0 with the directive on a valid payload", () => {
  const result = runHook(JSON.stringify({
    session_id: "s",
    transcript_path: "/tmp/t.jsonl",
    hook_event_name: "UserPromptSubmit",
    prompt: "what next?",
  }));
  assert.equal(result.status, 0);
  const out = JSON.parse(result.stdout);
  assert.equal(out.hookSpecificOutput.hookEventName, "UserPromptSubmit");
  assert.ok(out.hookSpecificOutput.additionalContext.includes("/route"));
});
