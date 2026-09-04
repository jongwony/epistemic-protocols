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

// The flag is pinned off unless a test sets it: a shell that runs the
// function-hooks module would otherwise make every spawned hook yield.
function runHook(input, env = {}) {
  return spawnSync(process.execPath, [SCRIPT], {
    input,
    encoding: "utf8",
    env: { ...process.env, CLAUDE_CODE_ENABLE_FUNCTION_HOOKS: "", ...env },
  });
}

// Whether the hook yields to the route-module plugin's hooks module is
// covered in route-yield.test.mjs, against a fixture config directory.

test("directive carries the three firing conditions and stays short", () => {
  // (a) deficit a loaded core protocol resolves → invoke /route; the table
  //     this screens against arrives at session start, not here
  assert.match(DIRECTIVE, /accumulated context shows an interaction deficit/);
  assert.match(DIRECTIVE, /loaded core epistemic protocol resolves, invoke \/route/);
  // (b) active-protocol exclusion, with "active" defined in place: invoked
  //     and not yet converged/deactivated — leftover skill prose is not active
  assert.match(DIRECTIVE, /Skip while an epistemic protocol is active: invoked this session and not yet converged or deactivated/);
  assert.match(DIRECTIVE, /converged protocol's prose still in context does not make it active/);
  // (c) silence otherwise
  assert.match(DIRECTIVE, /Otherwise stay silent/);
  assert.ok(DIRECTIVE.split("\n").length <= 4);
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
