#!/usr/bin/env node
/**
 * UserPromptSubmit hook — emit the per-prompt routing directive.
 *
 * The catalog the directive screens against — one line per installed
 * protocol, its command and the deficit it resolves — arrives at session
 * start through route-session.mjs, which the host re-runs after compaction.
 * So this hook supplies only the moment: a passive catalog does not make the
 * agent stop and check whether the context has drifted into one of those
 * deficits, and this directive beside each prompt is what does. It is
 * injected every turn — keep it to a few short lines.
 *
 * The condition covers both places a deficit can sit. One is the accumulated
 * context — what the session has settled, drifted from, or lost from view —
 * which the directive reads off as it stands. The other is the request
 * itself: intent or context only the user holds, which accumulated context
 * cannot show and which surfaces by asking rather than by observing. That
 * kind arrives at any turn, not only the first, so the directive carries it
 * here rather than leaving it to a session-start line that goes out once.
 * Both halves end in the same action, invoke /route; the match and the relay
 * test that decides invoke, nudge or silence live inside the skill.
 *
 * "Active" is defined in the directive itself: a protocol invoked this
 * session that has not yet converged or deactivated. A protocol's skill
 * prose stays in context after it converges, and without the definition the
 * agent reads that leftover prose as an active protocol and holds /route in
 * monitor mode for the rest of the session. While a protocol is active the
 * directive does not exclude /route; it narrows it to monitoring. Detecting
 * a deficit and acting on it are separate flows: detection may run at every
 * turn, but a switch away from a running protocol is a control act that
 * the user makes where that protocol next stops for them. So in active mode
 * /route neither invokes nor ends the turn — it places one finding line in
 * the transcript, and the loop continues; the active protocol's contract
 * ends at its own boundary and carries nothing of /route's. The third line
 * also says what a converged protocol left unresolved is context /route
 * reads at the next prompt: connecting protocols is /route's doing, and no
 * protocol names its successor. The hook decides when; the /route skill
 * decides what, including how the active protocol is recognized.
 *
 * Output shape is the hook wire format both Claude Code and Codex accept for
 * UserPromptSubmit: hookSpecificOutput.additionalContext. The payload on
 * stdin is read but not required — an empty or malformed payload still
 * yields the directive, because the directive does not depend on it.
 *
 * Zero external dependencies: Node.js standard library only.
 */

import fs from "node:fs";
import { isMain, parsePayload } from "./route-protocols.mjs";

// The firing conditions live here and nowhere else: SKILL.md loads only after
// the skill is invoked, so this directive is the surface present at decision
// time.
const DIRECTIVE = [
  "[route] When the request is not fully explicit — intent or context only the user can supply — or the accumulated context shows an interaction deficit that a loaded core epistemic protocol resolves, invoke /route.",
  "While an epistemic protocol is active — invoked this session and not yet converged or deactivated — /route monitors only: it may place one `↗ /command — reason` finding line and invokes nothing; the turn continues.",
  "A converged protocol's prose still in context does not make it active; what it left unresolved is context /route reads at the next prompt.",
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
