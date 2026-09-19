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
  //     fully explicit — intent or context only the user holds — and a
  //     deficit a loaded core protocol resolves. The gloss on the first is
  //     load-bearing: the condition it replaced named the accumulated
  //     context alone and so excluded the request-held kind by construction,
  //     and /route went uninvoked across the turns where that kind sat
  //     (07830bd0). The table the second screens against arrives at session
  //     start, not here.
  assert.match(DIRECTIVE, /^\[route\] When a request is not fully explicit/);
  assert.match(DIRECTIVE, /intent or context only the user can supply/);
  assert.match(DIRECTIVE, /you recognize a deficit a loaded core protocol resolves/);
  // (a') the invocation is the skill call, each time, and prose already in
  //     context is not one — a reader once read the leftover prose as the
  //     invocation having happened.
  assert.match(DIRECTIVE, /invoke \/route, the skill call itself, each time/);
  assert.match(DIRECTIVE, /even when its prose is already in context/);
  // (a'') the same conditions bind at recognition, not only at the prompt:
  //     a deficit noticed while preparing a response or action is routed
  //     before that deficit is addressed (a9b47430).
  assert.match(DIRECTIVE, /at the prompt or mid-turn while preparing a response or action/);
  assert.match(DIRECTIVE, /before addressing that deficit/);
  // (b) monitor mode, with the one narrowing condition defined in place: a
  //     gate holds until its own contract takes an answer at it, closes it,
  //     or entrusts the prompt to the session; leftover skill prose holds no
  //     gate. "active" is not the directive's vocabulary: what narrows
  //     /route is a holding gate, read from the contract, not an invocation
  //     that has not yet converged.
  assert.match(DIRECTIVE, /A presented gate holds until its protocol's contract takes an answer at it, closes it, or entrusts the prompt to the session\./);
  // (b') the prompt is that protocol's to read first, by its own contract —
  //     a reader once invoked the protocol a new prompt asked for while a
  //     gate still stood, without that gate's contract having read it at
  //     all. Both branches of what the reading leaves stay named: a gate
  //     the reading closed or entrusted holds no longer and routing is
  //     ordinary, one still holding is monitored. "Invoked the same way"
  //     because a reader once wrote the finding line in /route's place
  //     without invoking it.
  assert.match(DIRECTIVE, /A holding protocol reads the prompt first; \/route, invoked the same way, routes what that reading leaves/);
  assert.match(DIRECTIVE, /monitoring where one still holds, routing as usual where none does/);
  assert.doesNotMatch(DIRECTIVE, /\bactive\b/);
  assert.doesNotMatch(DIRECTIVE, /leaves open|returns there|parked/);
  assert.doesNotMatch(DIRECTIVE, /checkpoint/);
  assert.doesNotMatch(DIRECTIVE, /\bSkip\b/);
  assert.match(DIRECTIVE, /Converged prose holds no gate/);
  // (b'') a converged protocol's residual is context /route reads next: the
  //     chain across protocols is composed here, not inside any protocol.
  assert.match(DIRECTIVE, /\/route reads a residual from convergence or deactivation at the next prompt/);
  // (c) no default of silence: what to do when nothing fits is /route's own
  //     silence branch, and a standing "otherwise stay silent" read as the
  //     burden of proof sitting on invocation
  assert.doesNotMatch(DIRECTIVE, /stay silent/i);
  assert.ok(DIRECTIVE.split("\n").length <= 3);
});

test("the directive carries the conditions, not what follows from them", () => {
  // The per-prompt payload is the one cost charged on every turn, so it
  // states when to call /route and stops there. The finding line's shape,
  // how many may be emitted, and what monitor mode may not do are the
  // skill's, loaded by the call this directive asks for. Keeping them here
  // charged every prompt for text that arrives with the skill anyway.
  assert.doesNotMatch(DIRECTIVE, /↗/);
  assert.doesNotMatch(DIRECTIVE, /at most one/);
  assert.doesNotMatch(DIRECTIVE, /no invocation/);
  // A budget, so the surface cannot drift back up without the cost being
  // seen. It was 1083 characters before the conditions and their
  // consequences were separated.
  assert.ok(
    DIRECTIVE.length <= 800,
    `directive is ${DIRECTIVE.length} chars; budget is 800`,
  );
});

test("the directive names no protocol — the condition is stated, /route matches", () => {
  // A protocol named here would be the hand-kept routing table Rule #2
  // refuses. `/route` is now the only command the directive carries: the
  // finding's shape left with the rest of the skill's own material, taking
  // its `/command` placeholder with it.
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
