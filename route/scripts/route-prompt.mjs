#!/usr/bin/env node
/**
 * UserPromptSubmit hook — one line beside each prompt that points the agent
 * at the routing judgments the session start delivered (route-session.mjs).
 *
 * The line is a cue, not a carrier: it names where the judgments are and
 * when to read them, and states none of their meaning, which stays in the
 * /route contract and the frame rendered from it. It asks for no /route
 * call; the judgment is the agent's, in this turn.
 *
 * Output is hookSpecificOutput.additionalContext and nothing else. It
 * touches no network, writes nothing, and exits 0 on every path. Zero
 * external dependencies: Node.js standard library only.
 */

import fs from "node:fs";
import { isMain, parsePayload } from "./route-protocols.mjs";

const CUE = "[route] Before acting on this prompt, read it against the session-start routing judgments (`catalog`, `FitSupported`, `route`) and Rules.";

function render(raw) {
  const payload = parsePayload(raw);
  const eventName = typeof payload.hook_event_name === "string"
    ? payload.hook_event_name
    : "UserPromptSubmit";
  return JSON.stringify({
    suppressOutput: true,
    hookSpecificOutput: {
      hookEventName: eventName,
      additionalContext: CUE,
    },
  });
}

export { CUE, render };

if (isMain(import.meta.url)) {
  let raw = "";
  try { raw = fs.readFileSync(0, "utf8"); } catch {}
  let out = "";
  try { out = render(raw); } catch {}
  if (out) process.stdout.write(out + "\n");
  process.exit(0);
}
