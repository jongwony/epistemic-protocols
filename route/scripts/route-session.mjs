#!/usr/bin/env node
/**
 * SessionStart hook — inject the installed-protocol deficit table once per
 * context epoch, with the premise index beneath it.
 *
 * A host's loaded-skills listing may carry each skill's description, or it
 * may carry the command identifiers alone; where it rations that listing
 * under a size budget, the descriptions it drops first belong to the skills
 * the user has not been invoking — the set Route exists to reach. So the
 * table is supplied here rather than assumed, and it is derived, never
 * maintained (see route-protocols.mjs).
 *
 * SessionStart is the right place for it because the host fires this hook
 * at every context epoch — startup, resume, clear, compact — and so again
 * after compaction. The table re-enters context exactly when compaction
 * dropped it, without this hook reading the transcript or keeping a marker,
 * and the per-prompt hook stays at its directive alone. Injected here, the
 * table sits at the head of context, inside the cached prefix. The catalog
 * goes out on every source alike: on resume, whether the earlier injection
 * survived cannot be read off the payload, so re-emitting is the fail-safe
 * choice.
 *
 * This hook carries no firing condition of its own. Both kinds of deficit —
 * one the accumulated context shows, one held in the request itself — are
 * named by the per-prompt directive (route-prompt.mjs), which is present at
 * every turn where either can arrive. A session-start line for the second
 * kind went out once and then aged out of the decision; the per-prompt
 * directive is where that condition now lives. The table shares the
 * directive's own referent — loaded core epistemic protocols — so the two
 * injections read as one catalog.
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
 * Every failure path is open: an unreadable payload still yields whatever
 * can be derived, a derivation shortfall sends the index alone, and an
 * index that cannot be resolved is left out. A hook that blocks a session
 * is worse than one that routes less.
 * Zero external dependencies: Node.js standard library only.
 */

import fs from "node:fs";
import { premiseRoot, renderPremise } from "./route-premise.mjs";
import { deriveProtocols, isMain, parsePayload, renderTable } from "./route-protocols.mjs";

function buildContext(env) {
  let table = "";
  try {
    table = renderTable(deriveProtocols(env));
  } catch {
    // Fail open: a derivation fault must not cost the index.
  }
  let premise = "";
  try {
    premise = renderPremise(premiseRoot(env));
  } catch {
    // Fail open: the index is a companion to the routing, never a condition of it.
  }
  return [table, premise].filter(Boolean).join("\n");
}

function render(raw, env) {
  const payload = parsePayload(raw);
  const eventName = typeof payload.hook_event_name === "string"
    ? payload.hook_event_name
    : "SessionStart";
  return JSON.stringify({
    suppressOutput: true,
    hookSpecificOutput: {
      hookEventName: eventName,
      additionalContext: buildContext(env),
    },
  });
}

export { buildContext, render };

if (isMain(import.meta.url)) {
  let raw = "";
  try { raw = fs.readFileSync(0, "utf8"); } catch {}
  process.stdout.write(render(raw) + "\n");
  process.exit(0);
}
