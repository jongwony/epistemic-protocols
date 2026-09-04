#!/usr/bin/env node
/**
 * SessionStart hook — inject the installed-protocol deficit table once per
 * context epoch, with an opener conditioned on how the epoch began.
 *
 * A host's loaded-skills listing may carry each skill's description, or it
 * may carry the command identifiers alone; where it rations that listing
 * under a size budget, the descriptions it drops first belong to the skills
 * the user has not been invoking — the set Route exists to reach. So the
 * table is supplied here rather than assumed, and it is derived, never
 * maintained (see route-protocols.mjs).
 *
 * SessionStart is the right place for it because the host reports why the
 * epoch began through the documented `source` field — startup, resume,
 * clear, compact — and fires again after compaction. So the table re-enters
 * context exactly when compaction dropped it, without this hook reading the
 * transcript or keeping a marker, and the per-prompt hook goes back to its
 * directive alone. Injected here, the table sits at the head of context,
 * inside the cached prefix.
 *
 * The opener states a condition, never a protocol. At startup or after
 * /clear, context is thin and an inexplicit request usually shows a deficit
 * before it shows a task; after resume or compaction, what the session had
 * settled may be out of view. Naming which protocol fits each condition
 * would be the hand-kept routing table Rule #2 refuses; the model matches
 * the condition against the derived table in the same injection.
 *
 * Every failure path is open: an unreadable payload reads as startup, and a
 * derivation shortfall sends the opener alone. A hook that blocks a session
 * is worse than one that routes less. Zero external dependencies: Node.js
 * standard library only.
 */

import fs from "node:fs";
import { deriveProtocols, isMain, parsePayload, renderTable } from "./route-protocols.mjs";

// Sources on which prior context is not in view: the session is new, or it
// was reset. Anything else — including a missing or unknown source — reads
// as thin, because a wrong "thin" costs one unneeded check and a wrong
// "trimmed" hides a fresh start behind a recall prompt.
const THIN_OPENER = [
  "[route] Context is thin at this point in the session.",
  "A request that is not fully explicit usually shows an interaction deficit before it shows a task — match it against the installed protocols below before object-level work.",
].join("\n");

// Sources on which the session already holds settled context that this
// epoch does not carry: a resumed session, or one whose context was compacted.
const TRIMMED_OPENER = [
  "[route] Prior context was trimmed at this point in the session.",
  "What the session had already settled may no longer be in view — recall-shaped deficits are the usual first thing to check against the installed protocols below.",
].join("\n");

const TRIMMED_SOURCES = new Set(["resume", "compact"]);

function opener(source) {
  return TRIMMED_SOURCES.has(source) ? TRIMMED_OPENER : THIN_OPENER;
}

function buildContext(source, env) {
  const head = opener(source);
  let table = "";
  try {
    table = renderTable(deriveProtocols(env));
  } catch {
    // Fail open: a derivation fault must not cost the opener.
  }
  return table ? `${head}\n${table}` : head;
}

function render(raw, env) {
  const payload = parsePayload(raw);
  const source = typeof payload.source === "string" ? payload.source : "startup";
  const eventName = typeof payload.hook_event_name === "string"
    ? payload.hook_event_name
    : "SessionStart";
  return JSON.stringify({
    suppressOutput: true,
    hookSpecificOutput: {
      hookEventName: eventName,
      additionalContext: buildContext(source, env),
    },
  });
}

export { THIN_OPENER, TRIMMED_OPENER, buildContext, opener, render };

if (isMain(import.meta.url)) {
  let raw = "";
  try { raw = fs.readFileSync(0, "utf8"); } catch {}
  process.stdout.write(render(raw) + "\n");
  process.exit(0);
}
