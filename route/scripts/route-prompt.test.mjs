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
  assert.match(DIRECTIVE, /loaded core epistemic protocol resolves, invoke \/route — the skill call itself, each time, even when its prose is already in context/);
  // (b) monitor mode, with the one narrowing condition defined in place: a
  //     gate that holds the user's judgment — presented, and not yet answered,
  //     closed, or entrusted to the session by its own contract; leftover
  //     skill prose holds no gate. Monitoring places a finding line in the
  //     transcript; it never invokes and never ends the turn — a switch is the
  //     user's, where that gate next stops for them.
  assert.match(DIRECTIVE, /While a gate holds the user's judgment — a protocol presented one this session and its own contract has not yet taken an answer at it, closed it, or entrusted the prompt to the session — /);
  // (b'') the prompt is that protocol's to read first, by its own contract;
  //     /route routes the context that reading leaves — a gate closed or
  //     entrusted to the session holds no longer, one still holding is
  //     monitored — and keeps no record of its own of what the user turned
  //     away from. "active" is not the directive's vocabulary: what narrows
  //     /route is a holding gate, read from the contract, not an invocation
  //     that has not yet converged.
  assert.match(DIRECTIVE, /that protocol reads the prompt first, as its contract reads any free response there; \/route, invoked the same way, routes what that reading leaves/);
  assert.match(DIRECTIVE, /a gate still holding, at most one `↗ \/command — reason` finding line as \/route's own output and no invocation; none holding, routing as usual/);
  assert.doesNotMatch(DIRECTIVE, /\bactive\b/);
  assert.doesNotMatch(DIRECTIVE, /leaves open|returns there|parked/);
  assert.doesNotMatch(DIRECTIVE, /checkpoint/);
  assert.doesNotMatch(DIRECTIVE, /\bSkip\b/);
  assert.match(DIRECTIVE, /converged protocol's prose still in context holds no gate/);
  // (b') a converged protocol's residual is context /route reads next: the
  //     chain across protocols is composed here, not inside any protocol.
  assert.match(DIRECTIVE, /what it left unresolved when it converged or deactivated is context \/route reads at the next prompt/);
  // (c) no default of silence: what to do when nothing fits is /route's own
  //     silence branch, and a standing "otherwise stay silent" read as the
  //     burden of proof sitting on invocation
  assert.doesNotMatch(DIRECTIVE, /stay silent/i);
  assert.ok(DIRECTIVE.split("\n").length <= 3);
});

test("the directive names no protocol — the condition is stated, /route matches", () => {
  // A protocol named here would be the hand-kept routing table Rule #2
  // refuses. `/route` itself and the `/command` placeholder in the finding's
  // shape are the only commands the directive may carry.
  const commands = DIRECTIVE.match(/\/[a-z-]+/g) ?? [];
  assert.deepEqual(commands.filter((c) => c !== "/route" && c !== "/command"), []);
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
