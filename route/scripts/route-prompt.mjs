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
// time.
const DIRECTIVE = [
  "[route] When the request is not fully explicit — intent or context only the user can supply — or the accumulated context shows an interaction deficit that a loaded core epistemic protocol resolves, invoke /route — the skill call itself, each time, even when its prose is already in context. Apply this at recognition, including while preparing a response or action during the turn; complete the routing decision before addressing that deficit.",
  "While a gate holds the user's judgment — a protocol presented one this session and its own contract has not yet taken an answer at it, closed it, or entrusted the prompt to the session — that protocol reads the prompt first, as its contract reads any free response there; /route, invoked the same way, routes what that reading leaves: a gate still holding, at most one `↗ /command — reason` finding line as /route's own output and no invocation; none holding, routing as usual.",
  "A converged protocol's prose still in context holds no gate; what it left unresolved when it converged or deactivated is context /route reads at the next prompt.",
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
