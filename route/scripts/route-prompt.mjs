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
 * "Active" is defined in the directive itself: a protocol invoked this
 * session that has not yet converged or deactivated. A protocol's skill
 * prose stays in context after it converges, and without the definition the
 * agent reads that leftover prose as an active protocol and skips /route for
 * the rest of the session. /route carries no active-protocol detection of
 * its own, so the exclusion stays here rather than moving into the skill.
 * The hook decides when; the /route skill decides what.
 *
 * Output shape is the hook wire format both Claude Code and Codex accept for
 * UserPromptSubmit: hookSpecificOutput.additionalContext. The payload on
 * stdin is read but not required — an empty or malformed payload still
 * yields the directive, because the directive does not depend on it.
 *
 * Zero external dependencies: Node.js standard library only.
 */

import fs from "node:fs";
import { hooksModuleCarries, isMain, parsePayload } from "./route-protocols.mjs";

// The firing conditions live here and nowhere else: SKILL.md loads only after
// the skill is invoked, so this directive is the surface present at decision
// time.
const DIRECTIVE = [
  "[route] When the accumulated context shows an interaction deficit that a loaded core epistemic protocol resolves, invoke /route.",
  "Skip while an epistemic protocol is active: invoked this session and not yet converged or deactivated.",
  "A converged protocol's prose still in context does not make it active.",
  "Otherwise stay silent.",
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
  // The route-module plugin's hooks module carries this where the host runs
  // it and that plugin is enabled; emitting here too would inject the same
  // text twice.
  if (hooksModuleCarries()) process.exit(0);
  let raw = "";
  try { raw = fs.readFileSync(0, "utf8"); } catch {}
  process.stdout.write(render(raw) + "\n");
  process.exit(0);
}
