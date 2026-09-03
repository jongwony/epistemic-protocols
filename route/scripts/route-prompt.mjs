#!/usr/bin/env node
/**
 * UserPromptSubmit hook — emit the per-prompt routing directive.
 *
 * The agent on the loop already holds every loaded protocol's description,
 * yet a passive description does not trigger invocation. This hook puts one
 * short directive beside each user prompt so the agent checks the accumulated
 * context for a deficit and invokes /route when one protocol resolves it.
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

const DIRECTIVE = [
  "[route] If the accumulated context now shows an interaction deficit that one loaded epistemic protocol resolves, invoke /route.",
  "Stay silent otherwise. Skip while an epistemic protocol is already active.",
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
