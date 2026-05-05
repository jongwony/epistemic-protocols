// .claude/hooks/_guidances/gh-address-comments.mjs
//
// Skill-keyed guidance module for the gh-address-comments skill.
// Platform-agnostic: each entry declares matchesCommand + applies + message.
// Dispatchers (claude_dispatcher.mjs, codex_dispatcher.mjs) import this module
// and iterate guidances against the normalized payload.
//
// Extension point: append entries to `guidances` as the Stage 2 trial expands.
// Each entry is self-contained — no external doc references in the message.

export const skill = 'gh-address-comments';

export const guidances = [
  {
    name: 'option-set-entropy',
    matchesCommand: (cmd) => cmd.includes('fetch_comments.py'),
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
  // Pattern: { name: string, matchesCommand: (cmd) => boolean,
  //            applies: (parsed) => boolean, message: string }.
];
