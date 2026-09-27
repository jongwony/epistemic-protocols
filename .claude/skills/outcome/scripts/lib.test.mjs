// Tests for the outcome eval's pure parts: checklist loading, the case fixture's consistency,
// tree diffing, aggregation and the falsifier evaluation. No model is called and no case app is
// run. Run: node --test .claude/skills/outcome/scripts/lib.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  auditPaths, buildRow, childEnv, claudeCellCost, composeOpen, composePhaseB, diffCounts, diffTrees,
  evaluateFalsifiers, groupMeans, loadChecklist, parseClaudeTurn, parseCodexTurn, sha256,
  stripFrontmatter, validateNotes, validatePlan,
} from './lib.mjs';
import { AUTO, MANUAL, score } from '../cases/inquire-rate-limiter/rules.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..', '..', '..', '..');
const CASE = join(HERE, '..', 'cases', 'inquire-rate-limiter');
const spec = JSON.parse(readFileSync(join(CASE, 'case.json'), 'utf8'));

// ------------------------------------------------------------------ checklist and fixture

test('the frozen checklist loads, and its ids are exactly the rules module\'s AUTO and MANUAL', () => {
  const items = loadChecklist(readFileSync(join(CASE, spec.checklist), 'utf8'));
  const ids = items.map((i) => i.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual([...AUTO, ...MANUAL].sort(), [...ids].sort());
  assert.equal(AUTO.filter((id) => MANUAL.includes(id)).length, 0);
  for (const it of items) assert.ok(['functional', 'static'].includes(it.kind), it.id);
});

test('loadChecklist rejects a row it cannot read rather than skipping it', () => {
  assert.throws(() => loadChecklist('| R1 | x | y |\n'), /functional:|static:/);
  assert.throws(() => loadChecklist('| R1 | a | b | c |\n'), /exactly three cells/);
  assert.throws(() => loadChecklist('| R1 | a | static: b |\n| R1 | c | static: d |\n'), /duplicate/);
  assert.throws(() => loadChecklist('# no table\n'), /no rows/);
});

test('the /realize files the checklist was frozen against are unchanged', () => {
  for (const [rel, digest] of Object.entries(spec.frozenAgainst)) {
    assert.equal(sha256(readFileSync(join(REPO, rel))), digest,
      `${rel} changed: re-derive the fixture as a new case rather than editing the frozen checklist`);
  }
  const realize = JSON.parse(readFileSync(join(REPO, spec.realizeConfig), 'utf8'));
  for (const [runner, digest] of Object.entries(spec.frozenInvocation)) {
    assert.equal(sha256(realize.targets[spec.realizeTarget].invocation[runner]), digest, `${runner} invocation line changed`);
  }
});

test('the phase-B message is the lead line followed by the fully specified request', () => {
  const lead = readFileSync(join(CASE, spec.phaseB.lead), 'utf8');
  const body = stripFrontmatter(readFileSync(join(REPO, spec.variants.full.prompt), 'utf8'));
  const msg = composePhaseB(lead, body);
  assert.ok(msg.startsWith(`${lead.trim()}\n\nAdd the rate limiter.`));
  assert.ok(msg.endsWith(body));
});

test('the invocation line reaches the protocol arm only', () => {
  assert.equal(composeOpen('task', 'bare', 'Use `/inquire` first.'), 'task');
  assert.equal(composeOpen('task', 'protocol', 'Use `/inquire` first.'), 'task\n\nUse `/inquire` first.');
});

// ------------------------------------------------------------------ rules

function snapshot(files) {
  const d = mkdtempSync(join(tmpdir(), 'outcome-rules-'));
  for (const [rel, body] of Object.entries(files)) {
    mkdirSync(dirname(join(d, rel)), { recursive: true });
    writeFileSync(join(d, rel), body);
  }
  return d;
}

test('rules: the retry-after countdown, middleware placement and constants are read from evidence', () => {
  const main = 'from slowapi import Limiter\napp = X()\napp.add_middleware(SlowAPIMiddleware)\n# note\n\napp.add_middleware(\n  CORSMiddleware,\n)\n';
  const reqs = 'fastapi>=0.115,<0.116\nuvicorn[standard]>=0.32,<0.33\npydantic>=2.9,<3\nslowapi <0.2, >=0.1.9\n';
  const snap = snapshot({ 'app/main.py': main, 'requirements.txt': reqs, 'tests/test_health.py': 't' });
  const ref = snapshot({ 'tests/test_health.py': 't' });
  try {
    const evidence = {
      probe_key: { first100_non429: true, s101: 429, other_key: 200, same_key_other_ip: 429 },
      probe_ip: { first100_non429: true, s101: 429, other_ip: 200 },
      probe_retry: { s1: 429, ra1: '60', s2: 429, ra2: '57' },
      add_middleware_calls: [['SlowAPIMiddleware', 3, 3], ['CORSMiddleware', 6, 8]],
      config_assigns: { TIMEOUT_SECONDS: [3, 3, '30'], RATE_LIMIT_PER_MINUTE: [4, 4, '100'], RATE_LIMIT_WINDOW_SECONDS: [5, 5, '60'], RETRY_MAX: [6, 6, '3'] },
    };
    const { auto, manualEvidence } = score({ evidence, snapshotDir: snap, scaffoldDir: ref });
    assert.deepEqual(Object.keys(auto), AUTO);
    assert.ok(Object.values(auto).every((v) => v === 1), JSON.stringify(auto));
    assert.equal(manualEvidence.R6_auto, true);
    assert.equal(manualEvidence.R8_auto, true);

    const constant = { ...evidence, probe_retry: { s1: 429, ra1: '60', s2: 429, ra2: '60' } };
    assert.equal(score({ evidence: constant, snapshotDir: snap, scaffoldDir: ref }).auto.R5, 0);
    const between = { ...evidence, config_assigns: { ...evidence.config_assigns, OTHER: [4, 4, '1'], RATE_LIMIT_PER_MINUTE: [5, 5, '100'], RATE_LIMIT_WINDOW_SECONDS: [6, 6, '60'] } };
    assert.equal(score({ evidence: between, snapshotDir: snap, scaffoldDir: ref }).auto.R11, 0);
    const noImport = { ...evidence, probe_key: { import_error: 'x' }, probe_ip: { import_error: 'x' }, probe_retry: { import_error: 'x' } };
    const r = score({ evidence: noImport, snapshotDir: snap, scaffoldDir: ref }).auto;
    assert.deepEqual([r.R1, r.R2, r.R3, r.R4, r.R5], [0, 0, 0, 0, 0]);
  } finally {
    rmSync(snap, { recursive: true, force: true });
    rmSync(ref, { recursive: true, force: true });
  }
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
  assert.ok(validatePlan({ runner: 'x', model: 'm' }, cases).errors.some((e) => /--runner/.test(e)));
  assert.ok(validatePlan({ runner: 'claude', model: 'm', typo: '1' }, cases).errors.some((e) => /unknown flag --typo/.test(e)));
});

// ------------------------------------------------------------------ environment and traces

test('childEnv removes credential-bearing and enclosing-session variables and keeps the rest', () => {
  const env = childEnv({ PATH: '/bin', HOME: '/h', HTTPS_PROXY: 'p', CLAUDE_CODE_SESSION_ID: 's', CODEX_API_KEY: 'k',
    CODEX_AUTH_JSON_B64: 'b', OPENAI_API_KEY: 'o', GH_TOKEN: 't', MY_SECRET: 'x', ANTHROPIC_BASE_URL: 'u' });
  assert.deepEqual(Object.keys(env).sort(), ['HOME', 'HTTPS_PROXY', 'PATH']);
});

test('trace parsers read session ids, plugin state, cost and usage', () => {
  const claude = [
    { type: 'system', subtype: 'init', session_id: 's1', plugins: [{ name: 'aitesis' }], skills: ['aitesis:inquire', 'init'] },
    { type: 'assistant', message: { content: [{ type: 'tool_use', name: 'Skill', input: { skill: 'aitesis:inquire' } }, { type: 'tool_use', name: 'Bash', input: { command: 'ls' } }, { type: 'text', text: 'hi' }] } },
    { type: 'result', subtype: 'success', is_error: false, total_cost_usd: 0.5, modelUsage: { a: { inputTokens: 3, outputTokens: 2 }, b: { inputTokens: 1 } } },
  ].map((e) => JSON.stringify(e)).join('\n');
  const c = parseClaudeTurn(claude);
  assert.deepEqual([c.sessionId, c.completed, c.initPlugins, c.initSkillsMatching, c.skillInvocations, c.commands, c.costUsd, c.usage.inputTokens],
    ['s1', true, ['aitesis'], ['aitesis:inquire'], ['aitesis:inquire'], ['ls'], 0.5, 4]);

  const codex = [
    { type: 'thread.started', thread_id: 't1' },
    { type: 'item.completed', item: { type: 'command_execution', command: 'cat x' } },
    { type: 'turn.completed', usage: { input_tokens: 9 } },
  ].map((e) => JSON.stringify(e)).join('\n');
  const x = parseCodexTurn(codex);
  assert.deepEqual([x.threadId, x.completed, x.commands, x.usage.input_tokens], ['t1', true, ['cat x'], 9]);
  assert.equal(parseCodexTurn('{"type":"thread.started","thread_id":"t"}').completed, false);
});

test('auditPaths flags other cells, the records and parent climbs, and leaves the own cell alone', () => {
  const flags = auditPaths(['cat /s/run/a/work/x', 'cat /s/run/b/work/x', 'ls ..', 'cat /repo/aitesis/skills/inquire/SKILL.md', 'cat /r/run/b/turn-1.txt'],
    { ownDir: '/s/run/a', roots: ['/s', '/r', '/repo'], allowed: ['/repo/aitesis'] });
  assert.deepEqual(flags.map((f) => f.paths[0]), ['/s/run/b/work/x', '[parent reference]', '/r/run/b/turn-1.txt']);
});

// ------------------------------------------------------------------ diff

test('diffCounts is a minimal line diff and a missing file counts as empty', () => {
  assert.deepEqual(diffCounts('a\nb\nc\n', 'a\nx\nc\n'), { plus: 1, minus: 1 });
  assert.deepEqual(diffCounts(null, 'a\nb\n'), { plus: 2, minus: 0 });
  assert.deepEqual(diffCounts('a\nb\n', null), { plus: 0, minus: 2 });
  assert.deepEqual(diffCounts('a\nb\nc\nd\n', 'b\nc\nd\na\n'), { plus: 1, minus: 1 });
});

test('diffTrees counts rework outside the test prefix and skips what a snapshot drops', () => {
  const a = snapshot({ 'app/main.py': 'x\ny\n', 'tests/t.py': '1\n', 'keep.txt': 'same\n' });
  const b = snapshot({ 'app/main.py': 'x\nz\n', 'tests/t.py': '1\n2\n', 'keep.txt': 'same\n', 'app/__pycache__/m.pyc': 'bin', 'venv/lib.py': 'v\n' });
  try {
    const d = diffTrees(a, b, { testPrefix: 'tests/' });
    assert.deepEqual([d.files, d.lines, d.reworkFiles, d.rework, d.changed], [2, 3, 1, 2, ['app/main.py', 'tests/t.py']]);
  } finally {
    rmSync(a, { recursive: true, force: true });
    rmSync(b, { recursive: true, force: true });
  }
});

// ------------------------------------------------------------------ aggregation

test('claudeCellCost takes the running total and sums only when a total falls', () => {
  assert.deepEqual(claudeCellCost([0.2, 0.44, 0.87]), { costUsd: 0.87, basis: 'cumulative' });
  assert.deepEqual(claudeCellCost([0.2, 0.1]), { costUsd: 0.30000000000000004, basis: 'summed' });
  assert.deepEqual(claudeCellCost([0.2, null]), { costUsd: null, basis: 'missing' });
});

test('validateNotes holds the phase partition, the question counts and the manual items', () => {
  const good = { phaseA_turns: [1, 2], phaseB_turns: [3], questions_phaseA: [], q_explicit: 1, q_items_total: 2,
    manual: { A: { R6: 1, R8: 1, R12: 0 }, final: { R6: 1, R8: 1, R12: 1 } } };
  assert.deepEqual(validateNotes(good, { turns: 3, manualItems: MANUAL }), []);
  assert.ok(validateNotes({ ...good, phaseB_turns: [4] }, { turns: 3, manualItems: MANUAL }).some((e) => /exactly turns/.test(e)));
  assert.ok(validateNotes({ ...good, q_items_total: 0 }, { turns: 3, manualItems: MANUAL }).some((e) => /cannot be below/.test(e)));
  assert.ok(validateNotes({ ...good, manual: { A: { R6: 1 }, final: good.manual.final } }, { turns: 3, manualItems: MANUAL }).some((e) => /manual\.A/.test(e)));
});

function row({ model = 'm', runner = 'claude', variant = 'under', arm, rep = 1, rework, final = 12, first = 5, cost = 1, ok = true, implemented = true }) {
  const turns = [{ wallS: 10, costUsd: cost, treeChanged: arm === 'bare', usage: { input_tokens: cost } }];
  const half = Math.floor(final / 2);
  return buildRow({
    cell: { run: 'r', name: `${variant}-r${rep}-${arm}`, runner, model, effort: null, variant, arm, rep },
    turns,
    notes: { phaseA_turns: [1], phaseB_turns: [2], q_explicit: 0, q_items_total: 0, manual: { A: { R6: 0 }, final: { R6: 0 } } },
    scores: { A: { auto: { R1: first }, implemented }, final: { auto: { R1: half, R2: final - half } } },
    diff: { files: 1, lines: rework, plus: rework, minus: 0, reworkFiles: 1, rework },
    integrity: { ok, reasons: ok ? [] : ['x'] },
  });
}

test('buildRow sums automatic and manual verdicts and carries the runner\'s cost unit', () => {
  const r = row({ arm: 'protocol', rework: 7, final: 13, first: 9, cost: 0.8 });
  assert.deepEqual([r.first, r.final, r.rework, r.total_cost, r.cost_unit, r.stopped_first_turn], [9, 13, 7, 0.8, 'usd', true]);
  const c = row({ runner: 'codex', arm: 'bare', rework: 1, cost: 500 });
  assert.deepEqual([c.total_cost, c.cost_unit, c.skill_invoked], [500, 'input_tokens', 'trace-unavailable']);
});

test('groupMeans averages per model, variant and arm, leaving out cells whose integrity failed', () => {
  const means = groupMeans([
    row({ arm: 'bare', rep: 1, rework: 100 }), row({ arm: 'bare', rep: 2, rework: 80 }),
    row({ arm: 'bare', rep: 3, rework: 1, ok: false }),
  ]);
  assert.equal(means.length, 1);
  assert.deepEqual([means[0].n, means[0].mean.rework, means[0].mean.final], [2, 90, 12]);
});

const verdictOf = (rows) => evaluateFalsifiers(groupMeans(rows), { variant: 'under' })[0].verdict;

test('falsifier clause 1: no reduction in rework', () => {
  assert.equal(verdictOf([row({ arm: 'bare', rework: 100 }), row({ arm: 'protocol', rework: 100 })]), 'no-reduction');
  assert.equal(verdictOf([row({ arm: 'bare', rework: 100 }), row({ arm: 'protocol', rework: 150, final: 5 })]), 'no-reduction');
});

test('falsifier clause 2: a reduction that comes with a less finished tree', () => {
  assert.equal(verdictOf([row({ arm: 'bare', rework: 100, final: 12 }), row({ arm: 'protocol', rework: 10, final: 11 })]), 'unfinished-work');
  assert.equal(verdictOf([row({ arm: 'bare', rework: 100 }), row({ arm: 'protocol', rework: 10, implemented: false })]), 'unfinished-work');
});

test('falsifier clause 3: a finished reduction that cost more in total', () => {
  assert.equal(verdictOf([row({ arm: 'bare', rework: 100, cost: 0.9 }), row({ arm: 'protocol', rework: 10, cost: 1.05 })]), 'greater-total-cost');
});

test('no clause holds: a finished reduction at no greater total cost', () => {
  assert.equal(verdictOf([row({ arm: 'bare', rework: 100, cost: 1 }), row({ arm: 'protocol', rework: 10, cost: 1 })]), 'not-falsified');
});

test('the clauses are read in order: the first that holds is the verdict', () => {
  // Rework unchanged, tree less finished and cost higher: clause 1 is the verdict.
  assert.equal(verdictOf([row({ arm: 'bare', rework: 50, cost: 1 }), row({ arm: 'protocol', rework: 50, final: 3, cost: 9 })]), 'no-reduction');
  // Reduced, less finished and costlier: clause 2 is the verdict.
  assert.equal(verdictOf([row({ arm: 'bare', rework: 50, cost: 1 }), row({ arm: 'protocol', rework: 5, final: 3, cost: 9 })]), 'unfinished-work');
});

test('a model with one arm missing, or only failed cells in an arm, is incomplete rather than judged', () => {
  const v = evaluateFalsifiers(groupMeans([row({ arm: 'bare', rework: 50 }), row({ arm: 'protocol', rework: 5, ok: false })]), { variant: 'under' });
  assert.equal(v[0].verdict, 'incomplete');
});

test('models are judged separately', () => {
  const v = evaluateFalsifiers(groupMeans([
    row({ model: 'a', arm: 'bare', rework: 50 }), row({ model: 'a', arm: 'protocol', rework: 5 }),
    row({ model: 'b', arm: 'bare', rework: 50 }), row({ model: 'b', arm: 'protocol', rework: 60 }),
  ]), { variant: 'under' });
  assert.deepEqual(Object.fromEntries(v.map((x) => [x.model, x.verdict])), { a: 'not-falsified', b: 'no-reduction' });
});
