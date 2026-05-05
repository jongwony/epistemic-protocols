#!/usr/bin/env node
// .claude/hooks/claude_dispatcher.mjs
//
// Claude Code PostToolUse dispatcher.
// Parses Claude payload shape, normalizes, iterates skill-keyed guidances,
// emits hookSpecificOutput.additionalContext when guidance entries match.
//
// Wiring: .claude/settings.json
//   PostToolUse, matcher: "Bash", command: node ${CLAUDE_PROJECT_DIR}/.claude/hooks/claude_dispatcher.mjs
//
// See ./README.md for cross-platform overview and Codex dispatcher.

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

const cmd = payload.tool_input?.command ?? '';

const stdoutRaw = payload.tool_response?.stdout ?? '';

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
