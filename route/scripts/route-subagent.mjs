#!/usr/bin/env node
/**
 * SubagentStart hook — give a subagent the premise index at its start.
 *
 * The session-start index (route-session.mjs) reaches the main
 * conversation; a subagent that starts fresh holds none of it, since a
 * SessionStart hook does not run for it and its context is its own brief.
 * Both hosts add a SubagentStart hook's additionalContext to the
 * subagent's own context before its first prompt, so the same index goes
 * out here, rendered the same way (route-premise.mjs). The deficit table
 * does not: it is the catalog the per-prompt directive routes against,
 * which belongs to the conversation with the user.
 *
 * A fork inherits the parent conversation, index included, so a subagent
 * whose type is `fork` gets nothing here. Any other type is taken as
 * starting fresh; where a host's agent inherits the conversation under
 * another name, it holds the index twice — a cost in context, not a fault.
 *
 * Output is hookSpecificOutput.additionalContext and nothing else. On no
 * index nothing is written, and every failure path is silent and exits 0 —
 * a hook that stops a subagent is worse than one that delivers less. Zero
 * external dependencies: Node.js standard library only.
 */

import fs from "node:fs";
import { premiseRoot, renderPremise } from "./route-premise.mjs";
import { isMain, parsePayload } from "./route-protocols.mjs";

// The subagent types that inherit the parent conversation.
const INHERITING = new Set(["fork"]);

function render(raw, env) {
  const payload = parsePayload(raw);
  const event = typeof payload.hook_event_name === "string" ? payload.hook_event_name : "SubagentStart";
  if (event !== "SubagentStart") return "";
  if (INHERITING.has(payload.agent_type)) return "";
  let context = "";
  try {
    context = renderPremise(premiseRoot(env));
  } catch {
    // Fail open: an unresolved index costs the subagent a companion, never its start.
  }
  if (!context) return "";
  return JSON.stringify({
    hookSpecificOutput: {
      hookEventName: event,
      additionalContext: context,
    },
  });
}

export { INHERITING, render };

if (isMain(import.meta.url)) {
  let raw = "";
  try { raw = fs.readFileSync(0, "utf8"); } catch {}
  const out = render(raw);
  if (out) process.stdout.write(out + "\n");
  process.exit(0);
}
