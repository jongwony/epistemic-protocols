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
 * The second line names the one thing that narrows /route: a gate that
 * holds the user's judgment — a checkpoint a protocol presented this
 * session that its own contract has not yet taken an answer at, closed, or
 * entrusted to the session. A protocol's skill prose stays in context after
 * it converges, and without that definition the agent reads the leftover
 * prose as a gate and holds /route in monitor mode for the rest of the
 * session. While a gate holds, the directive does not exclude /route; it
 * narrows it to monitoring. Detecting a deficit and acting on it are
 * separate flows: detection may run at every turn, but a switch away from
 * a gate is a control act the user makes where that gate next stops for
 * them. So while gates hold /route invokes nothing and ends nothing:
 * exactly one holding gate permits at most one finding line about a
 * different single dominant match, otherwise /route is silent, and the
 * holding gates govern the turn under their own contracts, which end at
 * their own boundary and carry nothing of /route's. A runtime trace shaped
 * two phrases of that line.
 * "Invoked the same way", because the model once wrote the finding line in
 * /route's place without invoking it. And the protocol reading the prompt
 * first, because the model once invoked the protocol a new prompt asked
 * for while a gate still stood, without that gate's contract having read
 * the prompt at all. The contract reads it at its stop — an answer, a
 * decline, a withdrawal, a handoff to the session under a continuation it
 * holds — and /route routes what that reading leaves: a gate the reading
 * closed or entrusted to the session holds no longer, and the ordinary
 * branches apply; a gate still holding is monitored. The third line
 * also says what a converged protocol left unresolved is context /route
 * reads at the next prompt: /route composes from residual, with no pointer
 * from the protocol that left it. The hook decides when; the /route skill
 * decides what, including how a holding gate is recognized.
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
  "[route] When the request is not fully explicit — intent or context only the user can supply — or the accumulated context shows an interaction deficit that a loaded core epistemic protocol resolves, invoke /route — the skill call itself, each time, even when its prose is already in context.",
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
