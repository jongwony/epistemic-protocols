// Tests for route-prompt.mjs — the UserPromptSubmit routing directive.
// Run with: node --test
// Repo precedent: anamnesis/scripts/hypomnesis-write.test.mjs (node:test + node:assert).

import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { DIRECTIVE, parsePayload, render } from "./route-prompt.mjs";
import { TABLE_HEADER } from "./route-protocols.mjs";

const SCRIPT = path.join(path.dirname(fileURLToPath(import.meta.url)), "route-prompt.mjs");

function runHook(input) {
  return spawnSync(process.execPath, [SCRIPT], { input, encoding: "utf8" });
}

test("directive carries the firing conditions and stays short", () => {
  // (a) both places a deficit can sit end in the same action: a request not
  //     fully explicit — intent or context only the user holds — and an
  //     accumulated context showing a deficit a loaded core protocol
  //     resolves. The table the second screens against arrives at session
  //     start, not here.
  assert.match(DIRECTIVE, /^\[route\] When the request is not fully explicit/);
  assert.match(DIRECTIVE, /intent or context only the user can supply/);
  assert.match(DIRECTIVE, /accumulated context shows an interaction deficit/);
  assert.match(DIRECTIVE, /loaded core epistemic protocol resolves, invoke \/route/);
  // (b) active-protocol exclusion, with "active" defined in place: invoked
  //     and not yet converged/deactivated — leftover skill prose is not active
  assert.match(DIRECTIVE, /Skip while an epistemic protocol is active: invoked this session and not yet converged or deactivated/);
  assert.match(DIRECTIVE, /converged protocol's prose still in context does not make it active/);
  // (c) no default of silence: what to do when nothing fits is /route's own
  //     silence branch, and a standing "otherwise stay silent" read as the
  //     burden of proof sitting on invocation
  assert.doesNotMatch(DIRECTIVE, /stay silent/i);
  assert.ok(DIRECTIVE.split("\n").length <= 3);
});

test("the directive names no protocol — the condition is stated, /route matches", () => {
  // A protocol named here would be the hand-kept routing table Rule #2
  // refuses. `/route` itself is the one command the directive may carry.
  const commands = DIRECTIVE.match(/\/[a-z-]+/g) ?? [];
  assert.deepEqual(commands.filter((c) => c !== "/route"), []);
});

test("the per-prompt payload is the directive alone — no table", () => {
  // The table is a once-per-epoch cost carried by the SessionStart hook;
  // carrying it here again would charge it on every prompt.
  const out = JSON.parse(render(JSON.stringify({ hook_event_name: "UserPromptSubmit", prompt: "x" })));
  assert.equal(out.hookSpecificOutput.additionalContext, DIRECTIVE);
  assert.doesNotMatch(out.hookSpecificOutput.additionalContext, new RegExp(TABLE_HEADER));
  assert.doesNotMatch(out.hookSpecificOutput.additionalContext, /^\/[a-z-]+ [A-Za-z]+$/m);
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
  assert.equal(out.hookSpecificOutput.additionalContext, DIRECTIVE);
});

test("hook process exits 0 with the directive on empty stdin", () => {
  const result = runHook("");
  assert.equal(result.status, 0);
  const out = JSON.parse(result.stdout);
  assert.equal(out.hookSpecificOutput.additionalContext, DIRECTIVE);
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
  assert.equal(out.hookSpecificOutput.additionalContext, DIRECTIVE);
});
