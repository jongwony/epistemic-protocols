#!/usr/bin/env node
/**
 * Stop hook — deliver the premise that governs a turn's close, at the close.
 *
 * The session-start index names each premise document and the moment that
 * calls for it, and leaves recognizing the moment to the reader. A turn
 * ending is a moment the host recognizes too — it is the host that ends the
 * turn — so the entry carrying an `atClose` clause goes out again here, and
 * the turn is returned for one reading before it closes.
 *
 * This hook decides nothing about the turn. Whether the final paragraph
 * announces work or carries it out, and whether what it waits on is real,
 * is a reading of the turn's own content; a hook that matched on wording
 * would put that reading in a regex, where it would be wrong in both
 * directions — the same sentence is owed work when nothing blocks it and
 * is a correct close when something does. So nothing is matched: the
 * premise line goes out at every close, and the judgment stays with the
 * reader it belongs to.
 *
 * The cost is one extra model pass per turn, which is what a reading at
 * every close costs. `stop_hook_active` bounds it to one: the runtime's own
 * guidance is to return success while it is true, and on that second pass
 * the close proceeds whatever the reading concluded.
 *
 * Output is the shape the runtime reads for a Stop decision: `decision` and
 * `reason` at the top level. `hookSpecificOutput` carries no decision for
 * this event. Where no premise document resolves, nothing is written and
 * the turn closes — a return with no document to read against would be cost
 * with no channel. Every failure path lets the turn close, which is the
 * direction a blocking hook has to fail in, and the exit is always 0.
 * Zero external dependencies: Node.js standard library only.
 */

import fs from "node:fs";
import { premiseRoot, renderClosePremise } from "./route-premise.mjs";
import { isMain, parsePayload } from "./route-protocols.mjs";

// The turn-closing events. A subagent's close is the same moment for the
// same reason; whether the host sends it is the host's registration, and
// accepting it here costs nothing where it does not.
const EVENTS = new Set(["Stop", "SubagentStop"]);

function render(raw, env) {
  const payload = parsePayload(raw);
  // Read the event rather than defaulting to one. The other hooks here can
  // default, because what they return only annotates; this one returns the
  // turn, and a payload it could not parse is also a payload whose
  // stop_hook_active it could not read — defaulting would block on garbage
  // with the loop guard gone.
  const event = payload.hook_event_name;
  if (typeof event !== "string" || !EVENTS.has(event)) return "";
  // The runtime asks for success while this is set; a second return would
  // be a loop, and the reading has already happened by then.
  if (payload.stop_hook_active === true) return "";

  let reason = "";
  try {
    reason = renderClosePremise(premiseRoot(env));
  } catch {
    // Fail open: an unresolved index costs a reading, never the turn.
  }
  if (!reason) return "";

  return JSON.stringify({ decision: "block", reason, suppressOutput: true });
}

export { EVENTS, render };

if (isMain(import.meta.url)) {
  let raw = "";
  try { raw = fs.readFileSync(0, "utf8"); } catch {}
  const out = render(raw);
  if (out) process.stdout.write(out + "\n");
  process.exit(0);
}
