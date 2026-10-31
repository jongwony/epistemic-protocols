// Tests for route-prompt.mjs — the per-prompt routing cue.
// Run with: node --test

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { CUE, render } from "./route-prompt.mjs";
import { readFrame } from "./route-protocols.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = path.join(HERE, "route-prompt.mjs");

test("the cue is one short line that points and states no judgment", () => {
  assert.equal(CUE, "[route] Before acting on this prompt, read it against the session-start routing judgments (`catalog`, `FitSupported`, `route`) and Rules.");
  assert.ok(!CUE.includes("\n"));
  assert.ok(CUE.length <= 200, `cue is ${CUE.length} chars`);
  // It asks for no /route call: the judgment is made in the turn (ROO-205).
  assert.doesNotMatch(CUE, /invoke|\/route/);
});

test("every judgment the cue names is one the frame carries", () => {
  const frame = readFrame(path.join(HERE, ".."));
  for (const name of ["catalog", "FitSupported", "route"]) {
    assert.ok(frame.judgments.some(([n]) => n === name), `frame carries ${name}`);
  }
  assert.ok(frame.rules.length > 0);
});

test("render emits the cue under the payload's event name", () => {
  const out = JSON.parse(render(JSON.stringify({ hook_event_name: "UserPromptSubmit", prompt: "git pull" })));
  assert.equal(out.hookSpecificOutput.hookEventName, "UserPromptSubmit");
  assert.equal(out.hookSpecificOutput.additionalContext, CUE);
  const bare = JSON.parse(render(""));
  assert.equal(bare.hookSpecificOutput.hookEventName, "UserPromptSubmit");
});

test("the hook exits 0 on any input", () => {
  for (const input of ["", "not json", JSON.stringify({ prompt: "x" })]) {
    const r = spawnSync(process.execPath, [SCRIPT], { input, encoding: "utf8" });
    assert.equal(r.status, 0);
    assert.equal(JSON.parse(r.stdout).hookSpecificOutput.additionalContext, CUE);
  }
});

test("hooks.json registers the cue on UserPromptSubmit", () => {
  const hooks = JSON.parse(fs.readFileSync(path.join(HERE, "..", "hooks", "hooks.json"), "utf8"));
  const commands = (hooks.hooks.UserPromptSubmit || []).flatMap((e) => e.hooks.map((h) => h.command));
  assert.ok(commands.some((c) => c.includes("route-prompt.mjs")));
});
