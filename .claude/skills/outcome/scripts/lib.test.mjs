// Tests for the outcome eval's pure parts: checklist loading, the case fixture's consistency,
// tree diffing, aggregation and the per-model findings. No model is called and no case app is
// run. Run: node --test .claude/skills/outcome/scripts/lib.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  auditPaths, buildRow, childEnv, claudeCellCost, classifyReplies, classifyTableAnswer, composeOpen,
  composePhaseB, diffCounts, diffTrees, evaluateFindings, groupMeans, loadChecklist, matchOracleAnswers,
  parseClaudeTurn, parseCodexTurn, replyItemsTemplate, sha256, stripFrontmatter, summarizeForms,
  validateNotes, validatePlan,
} from './lib.mjs';
import { AUTO, MANUAL, score } from '../cases/inquire-rate-limiter/rules.mjs';
import * as forms from '../cases/inquire-rate-limiter/answer-forms.mjs';

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

const judged = (rows) => evaluateFindings(groupMeans(rows), { variant: 'under' })[0];
const claimOf = (rows) => judged(rows).claim;

test('the rework claim fails when rework did not fall', () => {
  assert.equal(claimOf([row({ arm: 'bare', rework: 100 }), row({ arm: 'protocol', rework: 100 })]), 'no-reduction');
  assert.equal(claimOf([row({ arm: 'bare', rework: 100 }), row({ arm: 'protocol', rework: 150, final: 5 })]), 'no-reduction');
});

test('the rework claim fails when the reduction left the work less finished', () => {
  assert.equal(claimOf([row({ arm: 'bare', rework: 100, final: 12 }), row({ arm: 'protocol', rework: 10, final: 11 })]), 'unfinished-work');
  assert.equal(claimOf([row({ arm: 'bare', rework: 100 }), row({ arm: 'protocol', rework: 10, implemented: false })]), 'unfinished-work');
});

test('a higher total cost is its own finding and does not falsify the reduction', () => {
  const costlier = judged([row({ arm: 'bare', rework: 100, cost: 0.9 }), row({ arm: 'protocol', rework: 10, cost: 1.05 })]);
  assert.deepEqual([costlier.claim, costlier.findings], ['not-falsified', { rework: 'reduced', completion: 'finished', cost: 'higher' }]);
  const cheaper = judged([row({ arm: 'bare', rework: 100, cost: 1 }), row({ arm: 'protocol', rework: 10, cost: 1 })]);
  assert.deepEqual([cheaper.claim, cheaper.findings.cost], ['not-falsified', 'not-higher']);
});

test('the three findings are reported separately even when the claim already failed', () => {
  // Rework unchanged, tree less finished and cost higher: the claim fails on rework, and the
  // completion and cost findings still say what they found.
  const a = judged([row({ arm: 'bare', rework: 50, cost: 1 }), row({ arm: 'protocol', rework: 50, final: 3, cost: 9 })]);
  assert.deepEqual([a.claim, a.findings], ['no-reduction', { rework: 'no-reduction', completion: 'unfinished-work', cost: 'higher' }]);
  const b = judged([row({ arm: 'bare', rework: 50, cost: 1 }), row({ arm: 'protocol', rework: 5, final: 3, cost: 9 })]);
  assert.deepEqual([b.claim, b.findings.rework, b.findings.cost], ['unfinished-work', 'reduced', 'higher']);
});

test('a model with one arm missing, or only failed cells in an arm, is incomplete rather than judged', () => {
  const v = evaluateFindings(groupMeans([row({ arm: 'bare', rework: 50 }), row({ arm: 'protocol', rework: 5, ok: false })]), { variant: 'under' });
  assert.equal(v[0].claim, 'incomplete');
});

test('models are judged separately', () => {
  const v = evaluateFindings(groupMeans([
    row({ model: 'a', arm: 'bare', rework: 50 }), row({ model: 'a', arm: 'protocol', rework: 5 }),
    row({ model: 'b', arm: 'bare', rework: 50 }), row({ model: 'b', arm: 'protocol', rework: 60 }),
  ]), { variant: 'under' });
  assert.deepEqual(Object.fromEntries(v.map((x) => [x.model, x.claim])), { a: 'not-falsified', b: 'no-reduction' });
});

// ------------------------------------------------------------------ answer forms

const FX = { answers: forms.ORACLE_ANSWERS, exampleClause: forms.EXAMPLE_CLAUSE, clauseBoundary: forms.CLAUSE_BOUNDARY, negation: forms.NEGATION };
const Q = (rule) => forms.ORACLE_ANSWERS.find((a) => a.rule === rule);
const unfence = (t) => t.replace(/`/g, '');

test('answer-form fixture: every fixed answer is the oracle\'s own wording, and every Table Q row has an entry', () => {
  const oracle = {
    under: unfence(readFileSync(join(REPO, spec.variants.under.oracle), 'utf8')),
    full: unfence(readFileSync(join(REPO, spec.variants.full.oracle), 'utf8')),
  };
  for (const a of forms.ORACLE_ANSWERS) {
    for (const o of a.oracle.split(',')) {
      if (a.text) assert.ok(oracle[o].includes(a.text), `${a.rule}: ${JSON.stringify(a.text)} is not in the ${o} oracle`);
    }
    if (a.form === 'by-item') {
      assert.ok(a.topic instanceof RegExp && a.fields.length, `${a.rule} needs a topic test and fields`);
      for (const f of a.fields) assert.ok(f.value instanceof RegExp, `${a.rule}:${f.name}`);
    }
  }
  const rows = [...readFileSync(join(REPO, spec.variants.under.oracle), 'utf8').matchAll(/^\| (Q\d+) \|[^|]*\| `([^`]+)` \|/gm)];
  assert.ok(rows.length >= 10);
  for (const [, rule, answer] of rows) assert.equal(Q(rule)?.text, answer, `${rule} in the fixture differs from the oracle's Table Q`);
  assert.ok(Q('P').pattern.test("It's in the repo — look at pyproject.toml."));
  assert.equal("It's in the repo — look at requirements.txt and app/main.py.".match(Q('P').pattern)[0].endsWith('main.py.'), true);
});

test('matchOracleAnswers reads every oracle answer on a line, in order, without double counting', () => {
  const rules = (l) => matchOracleAnswers(l, FX.answers).map((a) => a.rule);
  assert.deepEqual(rules("2. Who: Per API key, taken from the X-API-Key header. Proxy: I don't know."), ['Q2', 'Default']);
  assert.deepEqual(rules("That's enough — go ahead."), ['S']);
  assert.deepEqual(rules('Yes, go ahead.'), ['G']);
  assert.deepEqual(rules('6. Python: It’s in the repo — look at pyproject.toml.'), ['P']);
  assert.deepEqual(rules("It's all in my message — go with what I wrote."), ['F']);
  assert.deepEqual(rules('Sure, whatever you think.'), []);
});

test('classifyTableAnswer: presented, released, example and repeat fields, and the labels they give', () => {
  const none = new Set();
  const q5 = classifyTableAnswer(Q('Q5'), 'Library? The options are `slowapi` or a small built-in middleware.', none, FX);
  assert.deepEqual(q5.fields.map((f) => f.status), ['presented', 'released']);
  assert.deepEqual(q5.labels, ['recognized', 'composed']);

  const q4 = classifyTableAnswer(Q('Q4'), 'I would return 429 with Retry-After, counting down until the window resets.', none, FX);
  assert.deepEqual([q4.fields.map((f) => f.status), q4.labels], [['presented', 'presented', 'presented'], ['recognized']]);

  const q1open = classifyTableAnswer(Q('Q1'), 'How many requests per time window?', none, FX);
  assert.deepEqual([q1open.fields[0].status, q1open.labels], ['released', ['composed']]);
  const q1declined = classifyTableAnswer(Q('Q1'), 'A starting point is 60 requests/minute per IP.', none, FX);
  assert.deepEqual([q1declined.fields[0].status, q1declined.labels, q1declined.proposal], ['released', ['rejected'], '60 requests/minute']);
  const q1example = classifyTableAnswer(Q('Q1'), 'I need a number (e.g. "100 req/min per IP").', none, FX);
  assert.deepEqual([q1example.fields[0].status, q1example.labels], ['example', ['unclassified']]);
  const q1exampleOther = classifyTableAnswer(Q('Q1'), 'The rate (for example 60/min) is your call.', none, FX);
  assert.deepEqual([q1exampleOther.fields[0].status, q1exampleOther.labels], ['released', ['unclassified']]);

  const q1repeat = classifyTableAnswer(Q('Q1'), 'Limit?', new Set(['Q1:rate']), FX);
  assert.deepEqual([q1repeat.fields[0].status, q1repeat.labels], ['repeat', ['repeated']]);
  const noItem = classifyTableAnswer(Q('Q1'), null, none, FX);
  assert.deepEqual([noItem.fields[0].status, noItem.labels], ['unverified', ['unclassified']]);
});

test('classifyTableAnswer: a value named as absent is not presented, and a later negation does not reach back', () => {
  const absent = classifyTableAnswer(Q('Q2'), 'There is no auth, so there are no users or API keys to count against. The only option is the client IP.', new Set(), FX);
  assert.deepEqual([absent.fields.map((f) => f.status), absent.labels, absent.proposal], [['released', 'released'], ['rejected'], 'client IP']);
  const offered = classifyTableAnswer(Q('Q2'), 'Key on source IP (or you want to add an API-key scheme first)?', new Set(), FX);
  assert.deepEqual(offered.fields.map((f) => f.status), ['presented', 'released']);
  const later = classifyTableAnswer(Q('Q8'), 'With one process, an in-memory limiter works and adds no new infrastructure.', new Set(), FX);
  assert.deepEqual([later.fields[0].status, later.labels], ['presented', ['recognized']]);
});

test('classifyReplies: items are verified against the turn they answer, fields disclosed once, review labels kept apart', () => {
  const prev1 = '1. **Limit?** How many requests per minute?\n2. **Library?** `slowapi` or hand-written middleware.';
  const prev2 = 'Missing key: reject with 401, or an anonymous bucket?';
  const replies = [
    { turn: 2, text: '1. Limit: 100 requests per minute.\n2. Library: Use slowapi; add it to requirements.txt pinned >=0.1.9,<0.2.\n', prevText: prev1 },
    { turn: 3, text: 'Missing key: If the X-API-Key header is absent, count per client IP.\nLimit again: 100 requests per minute.\nThat\'s enough — go ahead.\n', prevText: prev2 },
  ];
  const tpl = replyItemsTemplate(replies, FX);
  assert.deepEqual(tpl.map((e) => [e.turn, e.line, e.rules]), [[2, 1, ['Q1']], [2, 2, ['Q5']], [3, 1, ['Q3']], [3, 2, ['Q1']]]);
  const items = [
    { ...tpl[0], item: '1. **Limit?** How many requests per minute?' },
    { ...tpl[1], item: '2. **Library?** `slowapi` or hand-written middleware.' },
    { ...tpl[2], item: 'reject with 401, or an anonymous bucket?', review: [{ label: 'reframed', why: 'IP fallback replaces the reject/anonymous framing' }] },
    { ...tpl[3], item: 'not in the turn' },
  ];
  const { lines, errors } = classifyReplies({ replies, items, fixture: FX });
  assert.deepEqual(errors, []);
  const labels = (l) => l.labels.map((x) => `${x.label}/${x.source}`);
  assert.deepEqual(lines.map(labels), [
    ['composed/rule'], ['recognized/rule', 'composed/rule'], ['rejected/rule', 'reframed/review'], ['repeated/rule'], ['sufficient/rule'],
  ]);
  assert.match(lines[3].itemNotFound, /not found in turn 2/);
  const sum = summarizeForms(lines);
  assert.deepEqual([sum.fields.presented, sum.fields.released, sum.fields.repeat, sum.unknown, sum.n], [1, 3, 1, 0, 4]);
  assert.equal(sum.share, 0.25);
  assert.equal(sum.review.reframed, 1);
  assert.equal(sum.labels.sufficient, 1);
});

test('classifyReplies: notes that disagree with the records are errors, not silent misreadings', () => {
  const replies = [{ turn: 2, text: 'Limit: 100 requests per minute.', prevText: 'Limit?' }];
  const errorsFor = (items) => classifyReplies({ replies, fixture: FX, items }).errors.join(' | ');
  assert.match(errorsFor([{ turn: 2, line: 1, text: 'something else', item: null }]), /2:1: text does not match/);
  assert.match(errorsFor([{ turn: 5, line: 1, text: 'x', item: null }]), /5:1: no such phase-A reply line/);
  assert.match(errorsFor([{ turn: 2, line: 1, text: 'Limit: 100 requests per minute.', item: null, review: [{ label: 'tired', why: 'x' }] }]), /review label needs one of/);
  assert.match(errorsFor([{ turn: 2, line: 1, text: 'Limit: 100 requests per minute.', item: null }, { turn: 2, line: 1, text: 'Limit: 100 requests per minute.', item: null }]), /appears twice/);
  const unmatched = classifyReplies({ replies: [{ turn: 2, text: 'Do whatever.', prevText: '' }], fixture: FX });
  assert.deepEqual(unmatched.lines[0].labels.map((x) => x.label), ['unclassified']);
  assert.equal(summarizeForms(unmatched.lines).share, null);
});

test('buildRow carries the answer forms, and the per-arm mean share is taken over cells where something was settled', () => {
  const lines = (presented, released, unknown) => [{
    labels: [{ label: 'recognized', source: 'rule' }],
    answers: [
      { rule: 'Q1', fields: [...Array(presented).fill({ status: 'presented' }), ...Array(released).fill({ status: 'released' })] },
      ...Array(unknown).fill({ rule: 'Default', fields: [] }),
    ],
  }];
  const mk = (arm, rep, af) => {
    const r = row({ arm, rep, rework: 10 });
    const withForms = buildRow({
      cell: { run: 'r', name: `under-r${rep}-${arm}`, runner: 'claude', model: 'm', effort: null, variant: 'under', arm, rep },
      turns: [{ wallS: 1, costUsd: 1, treeChanged: false }],
      notes: { phaseA_turns: [1], phaseB_turns: [2], q_explicit: 0, q_items_total: 0, manual: { A: {}, final: {} } },
      scores: { A: { auto: {}, implemented: true }, final: { auto: {} } },
      diff: { files: 0, lines: 0, plus: 0, minus: 0, reworkFiles: 0, rework: 10 },
      integrity: { ok: true, reasons: [] },
      answerForms: af === null ? { lines: [], errors: [] } : { lines: af, errors: [] },
    });
    return { ...r, ...Object.fromEntries(Object.entries(withForms).filter(([k]) => k.startsWith('af_'))) };
  };
  const a = mk('protocol', 1, lines(1, 1, 0));
  assert.deepEqual([a.af_presented, a.af_released, a.af_unknown, a.af_n, a.af_share], [1, 1, 0, 2, 0.5]);
  const none = mk('protocol', 2, null);
  assert.deepEqual([none.af_n, none.af_share], [0, null]);
  const b = mk('protocol', 3, lines(3, 0, 1));
  const [g] = groupMeans([a, none, b]);
  assert.equal(g.mean.af_share_cells, 2);
  assert.equal(g.mean.af_share, (0.5 + 0.75) / 2);
  assert.equal(g.mean.af_presented, 4 / 3);
  assert.equal(row({ arm: 'bare', rework: 1 }).af_share, null);
});

test('a missing item excerpt withholds the share rather than reporting one over the rest', () => {
  const replies = [{ turn: 2, text: "Limit: 100 requests per minute.\nBursts: I don't know.", prevText: 'Limit? Bursts?' }];
  const s = summarizeForms(classifyReplies({ replies, fixture: FX }).lines);
  assert.deepEqual([s.fields.unverified, s.unknown, s.share], [1, 1, null]);
});
