#!/usr/bin/env node
/**
 * UserPromptSubmit hook — emit the per-prompt routing directive.
 *
 * The agent on the loop already holds every loaded protocol's description,
 * yet a passive description does not trigger invocation. This hook puts one
 * short directive beside each user prompt carrying the firing conditions:
 * invoke /route when the accumulated context shows a deficit a loaded core
 * protocol resolves, skip while a protocol is active, otherwise stay silent.
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
import { fileURLToPath } from "node:url";

// The firing conditions live here and nowhere else: SKILL.md loads only after
// the skill is invoked, so this directive is the surface present at decision
// time. It is injected every turn — keep it to a few short lines.
const DIRECTIVE = [
  "[route] When the accumulated context shows an interaction deficit that a loaded core epistemic protocol resolves, invoke /route.",
  "Skip while an epistemic protocol is already active.",
  "Otherwise stay silent.",
].join("\n");

function parsePayload(raw) {
  try {
    const parsed = JSON.parse(String(raw ?? "").trim());
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

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

let isMain = true;
try {
  isMain = !!process.argv[1]
    && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));
} catch { isMain = true; }

if (isMain) {
  let raw = "";
  try { raw = fs.readFileSync(0, "utf8"); } catch {}
  process.stdout.write(render(raw) + "\n");
  process.exit(0);
}
