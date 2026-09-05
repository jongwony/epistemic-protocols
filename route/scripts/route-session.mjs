#!/usr/bin/env node
/**
 * SessionStart hook — inject the installed-protocol deficit table once per
 * context epoch, under an opener on the sources where context is thin, and
 * the premise index beneath it.
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
 * One opener, and only on thin sources. The two hooks divide by where the
 * instability sits. Most deficits show in accumulated context — the context
 * or the utterance already carries them, and the per-prompt directive reads
 * them off. The other kind sits in the request itself: intent or context
 * only the user holds, which accumulated context cannot yet show, so it
 * surfaces by asking rather than by observing. That kind is what session
 * start is for — the per-prompt hook would have to detect thin context,
 * while this one already knows it from `source`. So at startup or after
 * /clear the opener points at that locus. After resume or compaction there
 * is no opener: the deficits that follow trimming — what the session had
 * settled and no longer holds in view — show in the utterance, and the
 * per-prompt directive already routes them. Those sources carry the catalog
 * alone.
 *
 * The opener ends in the same action as the per-prompt directive: invoke
 * /route. Two triggers, one router. The directive's condition — the
 * accumulated context shows a deficit — excludes request-held deficits by
 * construction, so the opener is the trigger for that kind; but the match
 * itself, and the relay test that decides invoke, nudge or silence, live
 * inside /route (Rule #1: routing is the whole turn). An opener that told
 * the model to match against the table itself would skip that, and naming
 * which protocol fits the condition would be the hand-kept routing table
 * Rule #2 refuses. The table shares the directive's own referent — loaded
 * core epistemic protocols — so the two injections read as one catalog.
 *
 * The premise index rides the same epoch. The premise documents are the
 * collaboration premises the protocols rest on, a reference surface that
 * ships beside them in this marketplace; their index names each document
 * and the moment that calls for it. Before this hook carried it, reaching
 * that index took a global rules file or an instruction-file pointer wired
 * by hand per host, resolved to an absolute path the host had to be asked
 * for. Here it is resolved from the host's own install records at every
 * epoch (see route-premise.mjs) and injected with every path absolute, so
 * installing Route is the whole setup, and it goes out on every source for
 * the same reason the table does: compaction dropped it.
 *
 * Every failure path is open: an unreadable payload reads as startup, a
 * derivation shortfall on a thin source sends the opener alone, and on a
 * trimmed source it sends nothing; an index that cannot be resolved is left
 * out. A hook that blocks a session is worse than one that routes less.
 * Zero external dependencies: Node.js standard library only.
 */

import fs from "node:fs";
import { premiseRoot, renderPremise } from "./route-premise.mjs";
import { deriveProtocols, isMain, parsePayload, renderTable } from "./route-protocols.mjs";

// Sources on which prior context is not in view: the session is new, or it
// was reset. The deficit this opener points at sits in the request, not in
// the context — there is no accumulated context yet to read one off of —
// and the action is to invoke /route, not to match here.
// Anything else — including a missing or unknown source — reads as thin,
// because a wrong "thin" costs one unneeded check and a wrong "trimmed"
// hides a fresh start behind silence.
const THIN_OPENER = [
  "[route] Context is thin at this point in the session.",
  "The deficit to check first sits in the request itself — intent or context only the user can supply, which accumulated context cannot yet show. When a request is not fully explicit, invoke /route before object-level work.",
].join("\n");

// Sources on which the session already holds settled context that this
// epoch does not carry: a resumed session, or one whose context was
// compacted. No opener here — the deficits that follow trimming show in the
// utterance, and the per-prompt directive routes them. The catalog still
// goes out: compaction has dropped the earlier injection, and on resume
// whether it survived cannot be read off the payload, so re-emitting is the
// fail-safe choice.
const TRIMMED_SOURCES = new Set(["resume", "compact"]);

function opener(source) {
  return TRIMMED_SOURCES.has(source) ? "" : THIN_OPENER;
}

function buildContext(source, env) {
  const head = opener(source);
  let table = "";
  try {
    table = renderTable(deriveProtocols(env));
  } catch {
    // Fail open: a derivation fault must not cost the opener.
  }
  let premise = "";
  try {
    premise = renderPremise(premiseRoot(env));
  } catch {
    // Fail open: the index is a companion to the routing, never a condition of it.
  }
  return [head, table, premise].filter(Boolean).join("\n");
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

export { THIN_OPENER, TRIMMED_SOURCES, buildContext, opener, render };

if (isMain(import.meta.url)) {
  let raw = "";
  try { raw = fs.readFileSync(0, "utf8"); } catch {}
  process.stdout.write(render(raw) + "\n");
  process.exit(0);
}
