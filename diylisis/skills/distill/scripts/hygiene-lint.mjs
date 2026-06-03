#!/usr/bin/env node
/**
 * hygiene-lint — deterministic context-hygiene checker for /distill (Diylisis F1).
 *
 * Scans a working-context text for session-tethered surface tokens and emits a
 * substitution table plus a residual list. Deterministic: no model calls, no
 * network, stdlib only. This is the F1 deictic-closure scrub that runs as an
 * Extension; tokens it cannot resolve become residual-ledger entries for the
 * Gate.
 *
 * Three detector families:
 *   - deictic anchors  — "as above", "as mentioned", "the earlier", "see above",
 *                        "that file", "this approach", "the former/latter"
 *   - bare task ids    — "Task #3", "#172", "FD-1435" referenced with no inline
 *                        restoration data on the same line
 *   - undefined tokens — short coined labels / metric shorthand matching a
 *                        version-or-metric shape (e.g. "v4", "max-combine",
 *                        "queryValue 40") with no inline definition
 *
 * Each detected token becomes a substitution row:
 *   { surface_token, canonical_ref, confidence, unresolved }
 * canonical_ref is null and unresolved=true until a human (the Gate) supplies a
 * canonical reference — the linter detects, it does not resolve. Rows with
 * unresolved=true are also emitted in the residual list.
 *
 * Usage:
 *   node hygiene-lint.mjs <file>      # lint a file, print JSON report
 *   node hygiene-lint.mjs --test      # run the embedded unit test
 *   echo "text" | node hygiene-lint.mjs   # lint stdin
 */

import { readFileSync } from 'node:fs';

// ── Detectors ────────────────────────────────────────────────────────────────

// Deictic anchors: phrases that resolve only by session position.
const DEICTIC_PATTERNS = [
  /\bas (?:above|mentioned|noted|described|stated)\b/gi,
  /\bsee above\b/gi,
  /\bthe (?:earlier|previous|former|latter|aforementioned) (?:one|file|step|approach|message)?\b/gi,
  /\b(?:this|that) (?:file|approach|step|one|thing|config)(?: (?:above|earlier|from before))?\b/gi,
  /\bnew session first message\b/gi,
];

// Bare task ids: a task/issue reference with no restoration data inline.
// "Task #3", "#172", "FD-1435", "PR #171".
const TASK_ID_PATTERN = /(?:\bTask\s*#?\d+|\bPR\s*#?\d+|#\d+|\b[A-Z]{2,}-\d+)\b/g;

// Restoration-data cue: if a line carries a path, a json filename, or an
// explicit "restore"/"rehydrate"/"description" cue, a task id on that line is
// considered to carry its own restoration data and is not flagged.
const RESTORE_CUE = /\.(?:json|md)\b|\/[\w.-]+\/|\brestore\b|\brehydrate\b|\bdescription\b|\bsubject\b/i;

// Undefined coined tokens / metric shorthand: a version-or-metric-shaped label
// (vN, kebab-coined-name, metric token followed by a number) with no inline
// definition on the same line. Definition cue = a colon, an em dash gloss, or
// "= ", "means", "defined". A parenthetical alone is NOT treated as a
// definition — a parenthetical gloss beside a token (e.g. "v4 (7-day median)")
// still leaves the token's referent session-tethered.
const COINED_PATTERNS = [
  /\bv\d+\b/g,                          // v4, v12
  /\b[a-z]+-[a-z]+(?:-[a-z]+)*\b/g,     // max-combine, cold-start-chain
  /\b(?:queryValue|threshold|lead|timeshift)\s+\d+\b/gi, // metric token + number
];
const DEFINITION_CUE = /[:=]|—|\bmeans\b|\bdefined\b|\bi\.e\./i;

// Common kebab tokens that are ordinary English compounds, not coined jargon.
const KEBAB_ALLOWLIST = new Set([
  'cold-start', 'go-live', 'read-only', 'self-contained', 'zero-memory',
  'pre-execution', 'post-execution', 'fresh-context', 'work-unit', 'on-disk',
  'append-only', 'fixed-point', 'cross-source', 'per-source', 'per-item',
]);

// ── Core scan ────────────────────────────────────────────────────────────────

function uniquePush(map, token, kind, lineText) {
  if (map.has(token)) return;
  map.set(token, { surface_token: token, kind, canonical_ref: null, confidence: 0, unresolved: true, line: lineText.trim() });
}

export function scan(text) {
  const lines = text.split('\n');
  const table = new Map();

  for (const line of lines) {
    // Deictic anchors
    for (const re of DEICTIC_PATTERNS) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(line)) !== null) {
        uniquePush(table, m[0].toLowerCase().replace(/\s+/g, ' '), 'deictic', line);
      }
    }

    // Bare task ids (skip when the line carries restoration data)
    if (!RESTORE_CUE.test(line)) {
      let m;
      TASK_ID_PATTERN.lastIndex = 0;
      while ((m = TASK_ID_PATTERN.exec(line)) !== null) {
        uniquePush(table, m[0].replace(/\s+/g, ' '), 'bare-task-id', line);
      }
    }

    // Coined / metric tokens (skip when the same line defines them)
    if (!DEFINITION_CUE.test(line)) {
      for (const re of COINED_PATTERNS) {
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(line)) !== null) {
          const tok = m[0];
          if (KEBAB_ALLOWLIST.has(tok.toLowerCase())) continue;
          uniquePush(table, tok, 'coined-or-metric', line);
        }
      }
    }
  }

  const substitution_table = [...table.values()].map(({ line, ...row }) => row);
  const residual_list = substitution_table
    .filter((r) => r.unresolved)
    .map((r) => ({ item: r.surface_token, reason: 'unresolved', surfaced: false }));

  return { substitution_table, residual_list };
}

// ── Embedded unit test ───────────────────────────────────────────────────────

const TEST_INPUT = [
  'Use v4 (7-day median) but verify the max-combine path first.',
  'Apply the approach as above; see the earlier one for context.',
  'NEXT: paste this as the new session first message.',
  'Task #3 must be rehydrated before resume.',
  '4.json — PR B: 4-week re-observation dashboard',
  'queryValue 40 in the shadow dashboard.',
  'lead = cold-start masking, reduced to 3min.',
  'Close #172 after merge.',
  'Open that file and reuse this approach.',
].join('\n');

// Expected: v4 and max-combine are coined (line 1 has no definition cue);
// "as above" and "the earlier one" are deictic; "this as the new session first
// message" → deictic anchor; "Task #3" on a line with no restore cue is a bare
// task id; "4.json" line carries a restore cue so any id there is NOT flagged;
// "queryValue 40" is a metric token with no definition on its line;
// the "lead = ..." line has a definition cue (=) so "lead 3min" is not flagged,
// and "cold-start" is allowlisted; a bare "#172" with no restore cue is a bare
// task id; "that file" and "this approach" are deictic anchors even without a
// trailing "above/earlier" qualifier.
const EXPECTED_TOKENS = [
  'v4',
  'max-combine',
  'as above',
  'the earlier one',
  'new session first message',
  'Task #3',
  'queryValue 40',
  '#172',
  'that file',
  'this approach',
];

function runTest() {
  const { substitution_table, residual_list } = scan(TEST_INPUT);
  const got = substitution_table.map((r) => r.surface_token).sort();
  const want = [...EXPECTED_TOKENS].sort();

  const sameTable = got.length === want.length && got.every((t, i) => t === want[i]);
  // Every detected token is unresolved → residual list mirrors the table 1:1.
  const sameResidual = residual_list.length === substitution_table.length &&
    residual_list.every((r) => r.reason === 'unresolved' && r.surfaced === false);

  const pass = sameTable && sameResidual;

  console.log(JSON.stringify({
    test: 'hygiene-lint',
    pass,
    expected_tokens: want,
    got_tokens: got,
    residual_count: residual_list.length,
    substitution_table,
    residual_list,
  }, null, 2));

  return pass;
}

// ── CLI ──────────────────────────────────────────────────────────────────────

function main() {
  const arg = process.argv[2];
  if (arg === '--test') {
    process.exit(runTest() ? 0 : 1);
  }
  let text;
  if (arg && arg !== '-') {
    text = readFileSync(arg, 'utf8');
  } else {
    text = readFileSync(0, 'utf8');
  }
  console.log(JSON.stringify(scan(text), null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
