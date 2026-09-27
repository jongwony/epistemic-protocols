// Tests for the outcome eval's pure parts: the case's frozen sources, plan arguments, isolation,
// trace parsing, the notes' items and the report. No model is called.
// Run: node --test .claude/skills/outcome/scripts/lib.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  armCounts, auditPaths, buildRow, childEnv, composeOpen, parseClaudeTurn, parseCodexTurn,
  renderReport, sha256, treeDigest, validateNotes, validatePlan,
} from './lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..', '..', '..', '..');
const CASE = join(HERE, '..', 'cases', 'inquire-rate-limiter');
const spec = JSON.parse(readFileSync(join(CASE, 'case.json'), 'utf8'));

// ------------------------------------------------------------------ case

test('the /realize files the case was frozen against are unchanged', () => {
  for (const [rel, digest] of Object.entries(spec.frozenAgainst)) {
    assert.equal(sha256(readFileSync(join(REPO, rel))), digest,
      `${rel} changed: make a new case directory rather than re-digesting this one`);
  }
  for (const v of Object.values(spec.variants)) {
    assert.ok(v.prompt in spec.frozenAgainst && v.oracle in spec.frozenAgainst, `${v.prompt} and its oracle are frozen`);
  }
  const realize = JSON.parse(readFileSync(join(REPO, spec.realizeConfig), 'utf8'));
  for (const [runner, digest] of Object.entries(spec.frozenInvocation)) {
    assert.equal(sha256(realize.targets[spec.realizeTarget].invocation[runner]), digest, `${runner} invocation line changed`);
  }
});

test('the invocation line reaches the protocol arm only', () => {
  assert.equal(composeOpen('task', 'bare', 'Use `/inquire` first.'), 'task');
  assert.equal(composeOpen('task', 'protocol', 'Use `/inquire` first.'), 'task\n\nUse `/inquire` first.');
});

// ------------------------------------------------------------------ plan arguments

const cases = { cases: ['inquire-rate-limiter'], variantsOf: () => ['under', 'full'] };

test('validatePlan fills the defaults a paired run uses', () => {
  const { plan, errors } = validatePlan({ runner: 'claude', model: 'claude-sonnet-5' }, cases);
  assert.deepEqual(errors, []);
  assert.deepEqual(
    [plan.arms, plan.variants, plan.reps, plan.budgetUsd, plan.effort, plan.codexAuth],
    [['bare', 'protocol'], ['under', 'full'], 2, 3, null, null]);
});

test('validatePlan reports every argument error at once and keeps runner-specific flags apart', () => {
  const { plan, errors } = validatePlan({ runner: 'codex', model: 'gpt-6-luna', budget: '2', arms: 'bare,style', reps: '0', variants: 'x' }, cases);
  assert.equal(plan, null);
  for (const re of [/--effort is required/, /--budget applies only to the claude runner/, /arm "style"/, /--reps/, /variant "x"/]) {
    assert.ok(errors.some((e) => re.test(e)), `${re} in ${errors.join(' | ')}`);
  }
  assert.ok(validatePlan({ runner: 'claude', model: 'm', effort: 'high' }, cases).errors.some((e) => /--effort applies only/.test(e)));
  assert.ok(validatePlan({ runner: 'claude', model: 'm', typo: '1' }, cases).errors.some((e) => /unknown flag --typo/.test(e)));
});

// ------------------------------------------------------------------ isolation and traces

test('childEnv removes credential-bearing and enclosing-session variables and keeps the rest', () => {
  const env = childEnv({ PATH: '/bin', HOME: '/h', HTTPS_PROXY: 'p', CLAUDE_CODE_SESSION_ID: 's', CODEX_API_KEY: 'k',
    CODEX_AUTH_JSON_B64: 'b', OPENAI_API_KEY: 'o', GH_TOKEN: 't', MY_SECRET: 'x', ANTHROPIC_BASE_URL: 'u' });
  assert.deepEqual(Object.keys(env).sort(), ['HOME', 'HTTPS_PROXY', 'PATH']);
});

test('trace parsers read session ids, plugin state, texts and commands', () => {
  const claude = [
    { type: 'system', subtype: 'init', session_id: 's1', plugins: [{ name: 'aitesis' }], skills: ['aitesis:inquire', 'init'] },
    { type: 'assistant', message: { content: [{ type: 'tool_use', name: 'Skill', input: { skill: 'aitesis:inquire' } }, { type: 'tool_use', name: 'Bash', input: { command: 'ls' } }, { type: 'text', text: 'hi' }] } },
    { type: 'result', subtype: 'success' },
  ].map((e) => JSON.stringify(e)).join('\n');
  const c = parseClaudeTurn(claude);
  assert.deepEqual([c.sessionId, c.completed, c.initPlugins, c.initSkillsMatching, c.skillInvocations, c.commands, c.texts],
    ['s1', true, ['aitesis'], ['aitesis:inquire'], ['aitesis:inquire'], ['ls'], ['hi']]);

  const codex = [
    { type: 'thread.started', thread_id: 't1' },
    { type: 'item.completed', item: { type: 'command_execution', command: 'cat x' } },
    { type: 'item.completed', item: { type: 'agent_message', text: 'done' } },
    { type: 'turn.completed' },
  ].map((e) => JSON.stringify(e)).join('\n');
  const x = parseCodexTurn(codex);
  assert.deepEqual([x.threadId, x.completed, x.commands, x.texts], ['t1', true, ['cat x'], ['done']]);
  assert.equal(parseCodexTurn('{"type":"thread.started","thread_id":"t"}').completed, false);
});

test('auditPaths flags other cells, the records and parent climbs, and leaves the own cell alone', () => {
  const flags = auditPaths(['cat /s/run/a/work/x', 'cat /s/run/b/work/x', 'ls ..', 'cat /repo/aitesis/skills/inquire/SKILL.md', 'cat /r/run/b/turn-1.txt'],
    { ownDir: '/s/run/a', roots: ['/s', '/r', '/repo'], allowed: ['/repo/aitesis'] });
  assert.deepEqual(flags.map((f) => f.paths[0]), ['/s/run/b/work/x', '[parent reference]', '/r/run/b/turn-1.txt']);
});

test('treeDigest changes with a written file and ignores dot-entries and __pycache__', () => {
  const d = mkdtempSync(join(tmpdir(), 'outcome-tree-'));
  try {
    writeFileSync(join(d, 'a.py'), 'x\n');
    const before = treeDigest(d);
    mkdirSync(join(d, '__pycache__'));
    writeFileSync(join(d, '__pycache__', 'a.pyc'), 'b');
    writeFileSync(join(d, '.env'), 'e');
    assert.equal(treeDigest(d), before);
    writeFileSync(join(d, 'b.py'), 'y\n');
    assert.notEqual(treeDigest(d), before);
  } finally {
    rmSync(d, { recursive: true, force: true });
  }
});

// ------------------------------------------------------------------ notes

const T1 = 'Before I wire it in, two things:\n1. **Limit?** How many requests per minute should each caller get?\n2. I would key on the client IP unless you want API keys.';
const T2 = 'Done. I kept the store in memory; say if you need Redis.';

test('validateNotes accepts items whose spans occur in the turn they name', () => {
  const notes = { lastTurn: 2, notes: '', items: [
    { turn: 1, via: 'asked', item: 'limit value', span: 'How many requests per minute should each caller get?' },
    { turn: 1, via: 'presented', item: 'what to count per', span: ['I would key on the client IP', 'unless you want API keys.'] },
    { turn: 2, via: 'presented', item: 'storage', span: 'I kept the store in memory;' },
  ] };
  assert.deepEqual(validateNotes(notes, { turnTexts: [T1, T2] }), []);
  assert.deepEqual(validateNotes({ lastTurn: 2, items: [] }, { turnTexts: [T1, T2] }), []);
});

test('validateNotes refuses an unfilled template, a span not in its turn, and a malformed item', () => {
  const check = (notes) => validateNotes(notes, { turnTexts: [T1, T2] }).join(' | ');
  assert.match(check({ lastTurn: 2, items: null }), /items must be a list/);
  assert.match(check({ lastTurn: 1, items: [] }), /lastTurn must be 2/);
  assert.match(check({ lastTurn: 2, items: [{ turn: 2, via: 'asked', item: 'limit', span: 'How many requests per minute' }] }), /not found in turn 2/);
  assert.match(check({ lastTurn: 2, items: [{ turn: 3, via: 'asked', item: 'x', span: 'Done.' }] }), /turn must be a turn 1\.\.2/);
  assert.match(check({ lastTurn: 2, items: [{ turn: 2, via: 'recalled', item: 'x', span: 'Done.' }] }), /via must be one of asked\|presented/);
  assert.match(check({ lastTurn: 2, items: [{ turn: 2, via: 'asked', item: '', span: '' }] }), /item must name.*span must be/);
});

// ------------------------------------------------------------------ report

function row({ model = 'm', variant = 'under', arm, rep = 1, items = [], ok = true, changedAt = 1 }) {
  const turns = [1, 2].map((t) => ({ turn: t, treeChangedSinceScaffold: t >= changedAt }));
  return buildRow({
    cell: { run: 'r', name: `${variant}-r${rep}-${arm}`, runner: 'claude', model, effort: null, variant, arm, rep },
    turns, notes: { lastTurn: 2, items }, integrity: { ok, reasons: ok ? [] : ['x'] },
  });
}
const item = (via, name) => ({ turn: 1, via, item: name, span: `${name}?` });

test('buildRow counts the items by how they reached the user and finds the first implementation', () => {
  const r = row({ arm: 'protocol', items: [item('asked', 'limit'), item('presented', 'storage'), item('asked', 'key')], changedAt: 2 });
  assert.deepEqual([r.count, r.asked, r.presented, r.implemented_at, r.turns], [3, 2, 1, 2, 2]);
  assert.equal(row({ arm: 'bare', changedAt: 3 }).implemented_at, null);
});

test('buildRow counts as before code only the items raised in a turn earlier than the first implementation', () => {
  const late = { turn: 2, via: 'presented', item: 'storage', span: 'storage?' };
  assert.equal(row({ arm: 'protocol', items: [item('asked', 'limit'), late], changedAt: 2 }).before_code, 1);
  assert.equal(row({ arm: 'protocol', items: [item('presented', 'limit'), late], changedAt: 1 }).before_code, 0);
  assert.equal(row({ arm: 'protocol', items: [item('asked', 'limit'), late], changedAt: 3 }).before_code, 2);
});

test('armCounts lists each cell\'s count and the arm\'s total, leaving out cells whose integrity failed', () => {
  const arms = armCounts([
    row({ arm: 'protocol', rep: 2, items: [item('asked', 'a')] }),
    row({ arm: 'protocol', rep: 1, items: [item('asked', 'a'), item('presented', 'b')] }),
    row({ arm: 'protocol', rep: 3, items: [item('asked', 'a')], ok: false }),
    row({ arm: 'bare', rep: 1 }),
  ]);
  const p = arms.find((a) => a.arm === 'protocol');
  assert.deepEqual([p.n, p.perCell, p.total, p.asked, p.presented, p.beforeCode], [2, [2, 1], 3, 2, 1, 0]);
  assert.deepEqual(arms.find((a) => a.arm === 'bare').perCell, [0]);
});

test('renderReport quotes the opening request and lists every item with its span', () => {
  const rows = [row({ arm: 'protocol', items: [item('asked', 'limit')] }), row({ arm: 'bare', ok: false })];
  const md = renderReport({ rows, arms: armCounts(rows), requests: { under: 'Add rate limiting.' }, scope: 's' });
  assert.match(md, /> Add rate limiting\./);
  assert.match(md, /\| protocol \| 1 \| 1 \| 1 \| 1 \/ 0 \| 0 \|/);
  assert.match(md, /- t1 asked — limit: "limit\?"/);
  assert.match(md, /r\/under-r1-bare: x/);
});
