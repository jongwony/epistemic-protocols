#!/usr/bin/env node
/**
 * SessionStart hook — inject the purpose paragraph and the installed-protocol
 * table once per context epoch, and the premise index beside them.
 *
 * Whether a protocol comes in is judged in the turn itself. What the session
 * start gives that judgment is why the protocols exist — the `## Purpose`
 * section of Route's own SKILL.md, carried as written — and one row per
 * installed core protocol with the description it declares. A host's
 * loaded-skills listing may drop those descriptions under a size budget,
 * so the table is supplied here rather than assumed, and it is derived,
 * never maintained (see route-protocols.mjs).
 *
 * SessionStart is the right place for it because the host fires this hook
 * at every context epoch — startup, resume, clear, compact — and so again
 * after compaction. The routing part re-enters context exactly when compaction
 * dropped it, without this hook reading the transcript or keeping a marker.
 * Injected here, it sits at the head of context, inside the cached prefix.
 * It goes out on every source alike: on resume, whether the earlier
 * injection survived cannot be read off the payload, so re-emitting is the
 * fail-safe choice.
 *
 * The premise index rides the same epoch. The premise documents are the
 * collaboration premises the protocols rest on, a reference surface that
 * ships beside them in this marketplace; their index names each document
 * and the moment that calls for it. It is resolved from the host's own
 * install records at every epoch (see route-premise.mjs) and injected with
 * every path absolute, so installing Route is the whole setup.
 *
 * The routing part and the index go out as two parts, each registered as
 * its own SessionStart entry (`routing`, `premise` as the first argument):
 * the host caps each additionalContext string at 10,000 characters, and past
 * the cap it substitutes a file path and a preview. With no argument both
 * parts are joined, routing first, for a caller that reads the context
 * directly.
 *
 * Every failure path is open: an unreadable payload still yields whatever
 * can be derived, a purpose that cannot be read leaves the table alone, a
 * derivation shortfall sends the index alone, and an index that cannot be
 * resolved is left out. A hook that blocks a session is worse than one that
 * routes less.
 * Zero external dependencies: Node.js standard library only.
 */

import fs from "node:fs";
import { premiseRoot, renderPremise } from "./route-premise.mjs";
import { deriveProtocols, isMain, parsePayload, readPurpose, renderRouting } from "./route-protocols.mjs";

const PARTS = ["routing", "premise"];

function buildRouting(env) {
  try {
    return renderRouting(deriveProtocols(env), readPurpose(env && env.pluginRoot));
  } catch {
    // Fail open: a derivation fault must not cost the index.
    return "";
  }
}

function buildPremise(env) {
  try {
    return renderPremise(premiseRoot(env));
  } catch {
    // Fail open: the index is a companion to the routing, never a condition of it.
    return "";
  }
}

/** One part (`routing` or `premise`), or both joined where `part` names neither. */
function buildContext(env, part) {
  if (part === "routing") return buildRouting(env);
  if (part === "premise") return buildPremise(env);
  return [buildRouting(env), buildPremise(env)].filter(Boolean).join("\n");
}

function render(raw, env, part) {
  const payload = parsePayload(raw);
  const eventName = typeof payload.hook_event_name === "string"
    ? payload.hook_event_name
    : "SessionStart";
  return JSON.stringify({
    suppressOutput: true,
    hookSpecificOutput: {
      hookEventName: eventName,
      additionalContext: buildContext(env, part),
    },
  });
}

export { PARTS, buildContext, render };

if (isMain(import.meta.url)) {
  let raw = "";
  try { raw = fs.readFileSync(0, "utf8"); } catch {}
  process.stdout.write(render(raw, undefined, process.argv[2]) + "\n");
  process.exit(0);
}
