#!/usr/bin/env node
// .claude/hooks/gh-comments-convergence.mjs
//
// Cross-CLI PostToolUse hook (Claude Code, Codex CLI v0.124.0+, others).
// Fires when fetch_comments.py output contains numbered findings;
// injects guidance for the AI's upcoming Constitution-gate decision.
//
// Cross-CLI installation:
//   - Claude Code: wired via .claude/settings.json (this project)
//   - Codex CLI:   in ~/.codex/hooks.json or [hooks] block of config.toml,
//                  with [features] codex_hooks = true. Same script,
//                  same stdin/stdout JSON contract.
//   - Gemini CLI / others: same pattern; consult each CLI's hook docs.
//
// Extension point: append entries to GUIDANCES below as the trial expands.
// Each entry is self-contained — no external doc references in the message.
//
// Stage 2 trial: epistemic-protocols project. Inventory at .claude/steer-trials.md.

import { readFileSync } from 'node:fs';

const GUIDANCES = [
  {
    name: 'option-set-entropy',
    applies: (parsed) =>
      (parsed.review_threads?.length ?? 0) > 0 ||
      (parsed.conversation_comments?.length ?? 0) > 0,
    message:
      'Before presenting numbered items as Constitution options, evaluate ' +
      'option-set entropy. If your analysis converges to a single dominant ' +
      'option — no inter-item conflict, all items independently applicable, ' +
      'no contested approach orthogonal to mechanical fix — present as relay ' +
      'output (e.g., apply-all with a Basis line citing the convergence ' +
      'judgment) rather than wrapping a converged outcome in false options. ' +
      'If multiple genuinely viable choices remain (path/line collisions, ' +
      'architectural disagreement, divergent approaches), surface the gate. ' +
      'Override to gate when in doubt.',
  },
  // Append new entries here as the Stage 2 trial extends.
  // Pattern: { name: string, applies: (parsed) => boolean, message: string }.
];

let payload;
try {
  payload = JSON.parse(readFileSync(0, 'utf-8'));
} catch {
  process.exit(0);
}

const cmd = payload.tool_input?.command ?? payload.command ?? '';
if (!cmd.includes('fetch_comments.py')) process.exit(0);

const stdoutRaw =
  payload.tool_response?.stdout ??
  payload.output?.stdout ??
  payload.stdout ??
  '';

let parsed;
try {
  parsed = JSON.parse(stdoutRaw);
} catch {
  process.exit(0);
}

const matched = GUIDANCES.filter((g) => g.applies(parsed));
if (matched.length === 0) process.exit(0);

const message =
  '[gh-comments PostToolUse — Stage 2 trial guidance]\n\n' +
  matched.map((g) => `• ${g.message}`).join('\n\n');

console.log(
  JSON.stringify({
    systemMessage: message,
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext: message,
    },
  }),
);
