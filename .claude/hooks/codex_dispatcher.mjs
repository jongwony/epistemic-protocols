#!/usr/bin/env node
// .claude/hooks/codex_dispatcher.mjs
//
// Codex CLI PostToolUse dispatcher (v0.124.0+).
// Parses Codex payload shape (tool_response is a string per Codex shell handler),
// normalizes, iterates skill-keyed guidances, emits hookSpecificOutput.additionalContext.
//
// Wiring: ~/.codex/hooks.json or [hooks] block in config.toml
//   event: PostToolUse, matcher: "Bash"
//   command: node /path/to/.claude/hooks/codex_dispatcher.mjs
//   Requires: [features] codex_hooks = true in config.toml
//
// See ./README.md for cross-platform overview and Claude dispatcher.

import { readFileSync } from 'node:fs';
import { guidances as ghAddressComments } from './_guidances/gh-address-comments.mjs';

const ALL_GUIDANCES = [...ghAddressComments];

let payload;
try {
  payload = JSON.parse(readFileSync(0, 'utf-8'));
} catch {
  process.exit(0);
}

if (payload.tool_name && payload.tool_name !== 'Bash') process.exit(0);

const cmd = payload.tool_input?.command ?? payload.command ?? '';

const stdoutRaw =
  typeof payload.tool_response === 'string'
    ? payload.tool_response
    : payload.tool_response?.stdout ??
      payload.output?.stdout ??
      payload.stdout ??
      '';

let parsed;
try {
  parsed = JSON.parse(stdoutRaw);
} catch {
  process.exit(0);
}

const matched = ALL_GUIDANCES.filter(
  (g) => g.matchesCommand(cmd) && g.applies(parsed),
);
if (matched.length === 0) process.exit(0);

const message =
  '[gh-comments PostToolUse — Stage 2 trial guidance]\n\n' +
  matched.map((g) => `• [${g.name}] ${g.message}`).join('\n\n');

console.log(
  JSON.stringify({
    systemMessage: message,
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext: message,
    },
  }),
);
