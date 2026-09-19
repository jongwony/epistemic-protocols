#!/usr/bin/env node
/**
 * UserPromptSubmit hook — emit the routing directive beside every prompt.
 * The directive applies whenever a deficit is recognized during the turn;
 * the skill chooses the routing outcome under the current gate conditions.
 * route-session.mjs supplies the installed-protocol catalog at session start.
 *
 * Output: hookSpecificOutput.additionalContext on valid, empty, or malformed
 * stdin. No transcript inspection or persistent state; Node.js stdlib only.
 */

import fs from "node:fs";
import { isMain, parsePayload } from "./route-protocols.mjs";

// The firing conditions live here and nowhere else: SKILL.md loads only after
// the skill is invoked, so this directive is the surface present at decision
// time. It is the one payload charged on every prompt, so it carries the
// conditions and nothing that follows from them: the shape of a finding line,
// how many may be emitted, and what monitor mode may not do are SKILL.md's,
// and the /route call this directive asks for is what loads them.
const DIRECTIVE = [
  "[route] When a request is not fully explicit — intent or context only the user can supply — or you recognize a deficit a loaded core protocol resolves, at the prompt or mid-turn while preparing a response or action, invoke /route, the skill call itself, each time, before addressing that deficit, even when its prose is already in context.",
  "A presented gate holds until its protocol's contract takes an answer at it, closes it, or entrusts the prompt to the session. A holding protocol reads the prompt first; /route, invoked the same way, routes what that reading leaves: monitoring where one still holds, routing as usual where none does.",
  "Converged prose holds no gate; /route reads a residual from convergence or deactivation at the next prompt.",
].join("\n");

function render(raw) {
  const payload = parsePayload(raw);
  const eventName = typeof payload.hook_event_name === "string"
    ? payload.hook_event_name
    : "UserPromptSubmit";
  return JSON.stringify({
    suppressOutput: true,
    hookSpecificOutput: {
      hookEventName: eventName,
      additionalContext: DIRECTIVE,
    },
  });
}

export { DIRECTIVE, parsePayload, render };

if (isMain(import.meta.url)) {
  let raw = "";
  try { raw = fs.readFileSync(0, "utf8"); } catch {}
  process.stdout.write(render(raw) + "\n");
  process.exit(0);
}
