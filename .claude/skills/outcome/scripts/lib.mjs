// Pure parts of the outcome eval: argument checking, message composition, checklist loading,
// trace parsing, tree diffing, aggregation and the falsifier evaluation. Node standard library
// only. Everything that spawns a process or owns a directory lives in outcome.mjs.

import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const RUNNERS = ['claude', 'codex'];
export const ARMS = ['bare', 'protocol'];
export const EFFORTS = ['minimal', 'low', 'medium', 'high', 'xhigh'];
export const CODEX_AUTH = ['api-key', 'login'];

// ------------------------------------------------------------------ arguments

const BOOLEAN_FLAGS = new Set(['dry-run', 'open', 'go', 'phase-b']);

export function parseArgs(argv) {
  const flags = {};
  const positionals = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { positionals.push(a); continue; }
    const eq = a.indexOf('=');
    const name = eq === -1 ? a.slice(2) : a.slice(2, eq);
    if (eq !== -1) flags[name] = a.slice(eq + 1);
    else if (BOOLEAN_FLAGS.has(name)) flags[name] = true;
    else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) flags[name] = argv[++i];
    else flags[name] = undefined;
  }
  return { flags, positionals };
}

const csv = (v) => String(v).split(',').map((s) => s.trim()).filter(Boolean);
const posInt = (v) => (/^[1-9]\d*$/.test(String(v)) ? Number(v) : null);
const posNum = (v) => (/^\d+(\.\d+)?$/.test(String(v)) && Number(v) > 0 ? Number(v) : null);

export const PLAN_FLAGS = ['runner', 'model', 'effort', 'case', 'variants', 'reps', 'arms', 'budget',
  'timeout', 'codex-auth', 'run', 'dry-run'];

// Checks a plan's arguments against what the design supports and what the case declares.
// Returns every error at once, so one invocation reports the whole argument set.
export function validatePlan(flags, { cases = [], variantsOf = () => [] } = {}) {
  const errors = [];
  for (const k of Object.keys(flags)) if (!PLAN_FLAGS.includes(k)) errors.push(`unknown flag --${k}`);
  const runner = flags.runner;
  if (!RUNNERS.includes(runner)) errors.push(`--runner must be one of ${RUNNERS.join('|')} (got ${JSON.stringify(runner)})`);
  const model = flags.model;
  if (!model || !/^[\w.:/-]+$/.test(model)) errors.push('--model is required (a model id such as claude-sonnet-5 or gpt-6-luna)');

  let effort = null;
  if (runner === 'codex') {
    effort = flags.effort;
    if (!EFFORTS.includes(effort)) errors.push(`--effort is required for codex, one of ${EFFORTS.join('|')}`);
  } else if (flags.effort !== undefined) {
    errors.push('--effort applies only to the codex runner');
  }

  let budgetUsd = null;
  if (runner === 'claude') {
    budgetUsd = flags.budget === undefined ? 3 : posNum(flags.budget);
    if (budgetUsd === null) errors.push('--budget must be a positive number of USD');
  } else if (runner === 'codex' && flags.budget !== undefined) {
    errors.push('--budget applies only to the claude runner: codex exec has no spend cap, bound a turn with --timeout');
  }

  let codexAuth = null;
  if (runner === 'codex') {
    codexAuth = flags['codex-auth'] ?? 'api-key';
    if (!CODEX_AUTH.includes(codexAuth)) errors.push(`--codex-auth must be one of ${CODEX_AUTH.join('|')}`);
  } else if (flags['codex-auth'] !== undefined) errors.push('--codex-auth applies only to the codex runner');

  const caseName = flags.case ?? 'inquire-rate-limiter';
  if (!cases.includes(caseName)) errors.push(`--case ${JSON.stringify(caseName)} not found; available: ${cases.join(', ') || '(none)'}`);
  const declared = cases.includes(caseName) ? variantsOf(caseName) : [];
  const variants = flags.variants === undefined ? declared : csv(flags.variants);
  for (const v of variants) if (!declared.includes(v)) errors.push(`variant ${JSON.stringify(v)} is not declared by case ${caseName}`);
  if (!variants.length) errors.push('no variants selected');

  const reps = flags.reps === undefined ? 2 : posInt(flags.reps);
  if (reps === null) errors.push('--reps must be a positive integer');

  const arms = flags.arms === undefined ? [...ARMS] : csv(flags.arms);
  for (const a of arms) if (!ARMS.includes(a)) errors.push(`arm ${JSON.stringify(a)} is not supported; arms are ${ARMS.join('|')}`);
  if (new Set(arms).size !== arms.length) errors.push('--arms lists an arm twice');
  if (!arms.length) errors.push('no arms selected');

  const timeoutS = flags.timeout === undefined ? (runner === 'codex' ? 1800 : 900) : posInt(flags.timeout);
  if (timeoutS === null) errors.push('--timeout must be a positive integer of seconds');

  const run = flags.run ?? (model ? `${model}${effort ? `-${effort}` : ''}-${caseName}` : null);
  if (run !== null && !/^[\w.-]+$/.test(run)) errors.push('--run may contain only letters, digits, ".", "_" and "-"');

  if (errors.length) return { plan: null, errors };
  return {
    errors,
    plan: { run, runner, model, effort, case: caseName, variants, reps, arms, budgetUsd, timeoutS, codexAuth },
  };
}

export function cellList(plan) {
  const cells = [];
  for (const variant of plan.variants) {
    for (let rep = 1; rep <= plan.reps; rep++) {
      for (const arm of plan.arms) cells.push({ name: `${variant}-r${rep}-${arm}`, variant, arm, rep });
    }
  }
  return cells;
}

// ------------------------------------------------------------------ messages

export function stripFrontmatter(raw) {
  return raw.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
}

// The line naming the protocol belongs to the treatment and reaches only the protocol arm.
export function composeOpen(taskBody, arm, invocation) {
  return arm === 'protocol' ? `${taskBody}\n\n${invocation}` : taskBody;
}

export function composePhaseB(lead, specificationBody) {
  return `${lead.trim()}\n\n${specificationBody}`;
}

export const sha256 = (data) => createHash('sha256').update(data).digest('hex');

// ------------------------------------------------------------------ checklist

// A checklist is a markdown table of `| id | requirement | how it is checked |` rows whose check
// cell opens with `functional:` or `static:`. Anything else in the file is prose.
export function loadChecklist(text) {
  const items = [];
  for (const line of text.split('\n')) {
    if (!/^\|\s*R\d+\s*\|/.test(line)) continue;
    const cells = line.split('|');
    if (cells.length !== 5 || cells[0].trim() || cells[4].trim()) {
      throw new Error(`checklist row does not have exactly three cells: ${line.slice(0, 60)}`);
    }
    const [id, requirement, check] = cells.slice(1, 4).map((c) => c.trim());
    const kind = /^(functional|static):/.exec(check)?.[1];
    if (!kind) throw new Error(`checklist ${id}: the check must open with "functional:" or "static:"`);
    if (!requirement) throw new Error(`checklist ${id}: empty requirement`);
    if (items.some((it) => it.id === id)) throw new Error(`checklist ${id}: duplicate id`);
    items.push({ id, requirement, check, kind });
  }
  if (!items.length) throw new Error('checklist has no rows');
  return items;
}

// ------------------------------------------------------------------ environment

// Credential-bearing and enclosing-session variables. A subject child and a plugin-integrity
// call receive none of them; the one credential a codex exec needs is added back explicitly.
const STRIPPED = [/^CLAUDE/, /^ANTHROPIC/, /^CCR_/, /^AWS_/, /^CLOUDSDK_AUTH/, /^GIT_CONFIG_/,
  /^GIT_ASKPASS$/, /^SESSION_INGRESS_URL$/, /^SBX_TELEMETRY_SOCKET$/, /^TRACEPARENT$/, /^CODEX_/,
  /^OPENAI_/, /^SLACK/, /^LINEAR/, /^GEMINI/, /^TAVILY/, /^TYPESAFE/, /^GH_TOKEN$/, /^GITHUB_TOKEN$/,
  /TOKEN/, /SECRET/, /API_KEY/, /_B64$/];

export function childEnv(env) {
  return Object.fromEntries(Object.entries(env).filter(([k]) => !STRIPPED.some((re) => re.test(k))));
}

// ------------------------------------------------------------------ trees

// What a snapshot keeps: everything but dot-entries, __pycache__ and a venv directory.
export const snapshotKeeps = (name) => !(name.startsWith('.') || name === '__pycache__' || name === 'venv');

export function listFiles(dir, keep = snapshotKeeps) {
  const out = new Map();
  const walk = (d, rel) => {
    for (const e of readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (!keep(e.name)) continue;
      const p = join(d, e.name);
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) walk(p, r);
      else if (e.isFile()) out.set(r, p);
    }
  };
  if (existsSync(dir)) walk(dir, '');
  return out;
}

// /realize's tree digest: sha256 per file over sorted relative paths, dot-entries and
// __pycache__ excluded. Equal digests before and after a turn mean the turn wrote nothing.
export function treeDigest(dir) {
  const files = listFiles(dir, (n) => !(n.startsWith('.') || n === '__pycache__'));
  return [...files].map(([r, p]) => `${r}:${sha256(readFileSync(p))}`).join('\n');
}

const lines = (text) => {
  if (text === null) return [];
  const ls = text.split('\n');
  if (ls[ls.length - 1] === '') ls.pop();
  return ls;
};

function lcsLength(a, b) {
  let prev = new Uint32Array(b.length + 1);
  let cur = new Uint32Array(b.length + 1);
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
    }
    [prev, cur] = [cur, prev];
  }
  return prev[b.length];
}

// Lines added and removed by a minimal line diff, as `diff -N` counts them; a missing file
// counts as empty.
export function diffCounts(before, after) {
  const a = lines(before);
  const b = lines(after);
  const common = lcsLength(a, b);
  return { plus: b.length - common, minus: a.length - common };
}

// Phase-B rework: every file that differs between the two snapshots, and its changed lines;
// files under testPrefix are counted apart, since rework is measured on the rest.
export function diffTrees(beforeDir, afterDir, { testPrefix = 'tests/' } = {}) {
  const a = listFiles(beforeDir);
  const b = listFiles(afterDir);
  const out = { files: 0, plus: 0, minus: 0, lines: 0, reworkFiles: 0, rework: 0, changed: [] };
  for (const rel of [...new Set([...a.keys(), ...b.keys()])].sort()) {
    const x = a.has(rel) ? readFileSync(a.get(rel)) : null;
    const y = b.has(rel) ? readFileSync(b.get(rel)) : null;
    if (x && y && x.equals(y)) continue;
    const { plus, minus } = diffCounts(x && x.toString('utf8'), y && y.toString('utf8'));
    out.files++; out.plus += plus; out.minus += minus; out.lines += plus + minus;
    out.changed.push(rel);
    if (!rel.startsWith(testPrefix)) { out.reworkFiles++; out.rework += plus + minus; }
  }
  return out;
}

// ------------------------------------------------------------------ traces

function jsonLines(text) {
  const out = [];
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    try { out.push(JSON.parse(line)); } catch { /* not an event */ }
  }
  return out;
}

export function parseClaudeTurn(text, { skillPattern = /inquire|aitesis/ } = {}) {
  let sessionId = null; let init = null; let result = null;
  const texts = []; const tools = []; const skills = []; const commands = [];
  for (const e of jsonLines(text)) {
    sessionId = e.session_id || sessionId;
    if (e.type === 'system' && e.subtype === 'init') init = e;
    if (e.type === 'result') result = e;
    if (e.type !== 'assistant' || !Array.isArray(e.message?.content)) continue;
    for (const c of e.message.content) {
      if (c.type === 'text') texts.push(c.text);
      if (c.type !== 'tool_use') continue;
      tools.push(c.name);
      if (c.name === 'Skill' && c.input?.skill) skills.push(String(c.input.skill));
      for (const k of ['command', 'file_path', 'path', 'notebook_path']) {
        if (typeof c.input?.[k] === 'string') commands.push(c.input[k]);
      }
    }
  }
  const usage = {};
  for (const m of Object.values(result?.modelUsage || {})) {
    for (const [k, v] of Object.entries(m)) if (typeof v === 'number' && /Tokens$/.test(k)) usage[k] = (usage[k] || 0) + v;
  }
  return {
    sessionId,
    completed: Boolean(init && result),
    initPlugins: (init?.plugins || []).map((p) => p.name),
    initSkillsMatching: (init?.skills || []).filter((s) => skillPattern.test(s)),
    model: init?.model ?? null,
    skillInvocations: skills,
    toolUses: tools,
    commands,
    resultSubtype: result?.subtype ?? null,
    isError: result?.is_error ?? null,
    costUsd: typeof result?.total_cost_usd === 'number' ? result.total_cost_usd : null,
    usage,
    texts,
  };
}

export function parseCodexTurn(text) {
  let threadId = null; let usage = null; let completed = false; let failed = null;
  const texts = []; const commands = []; const fileChanges = [];
  for (const e of jsonLines(text)) {
    if (e.type === 'thread.started') threadId = e.thread_id;
    if (e.type === 'turn.completed') { completed = true; usage = e.usage || null; }
    if (e.type === 'turn.failed' || e.type === 'error') failed = e;
    if (e.type !== 'item.completed' || !e.item) continue;
    const it = e.item;
    if (it.type === 'agent_message') texts.push(it.text);
    if (it.type === 'command_execution') commands.push(it.command || '');
    if (it.type === 'file_change') fileChanges.push(...(it.changes || []).map((c) => `${c.kind} ${c.path}`));
  }
  return { threadId, completed: completed && Boolean(threadId), failed, usage, texts, commands, fileChanges };
}

// ------------------------------------------------------------------ path audit

// Commands that name a path outside the cell's own directory: another cell, the run's records,
// the repository, or a climb to the parent. Flags are for reading, not an integrity verdict.
// `roots` are the directories a subject has no business reading: the run state holding other
// cells, the records, the repository. `allowed` carves out what a treatment legitimately reads.
export function auditPaths(commands, { ownDir, roots = [], allowed = [] }) {
  const flags = [];
  for (const cmd of commands) {
    const hits = new Set();
    for (const m of cmd.matchAll(/\/[^\s'"`;|)&<>]+/g)) {
      const p = m[0];
      const under = (dir) => p === dir || p.startsWith(`${dir}/`);
      if (under(ownDir) || allowed.some(under)) continue;
      if (roots.some(under)) hits.add(p);
    }
    if (/(^|[\s'"=(])\.\.(\/|\s|$|['"])/.test(cmd)) hits.add('[parent reference]');
    if (hits.size) flags.push({ command: cmd.slice(0, 240), paths: [...hits].slice(0, 6) });
  }
  return flags;
}

// ------------------------------------------------------------------ notes

export function validateNotes(notes, { turns, manualItems }) {
  const errors = [];
  if (!notes || typeof notes !== 'object') return ['notes.json is not an object'];
  const seq = (k) => Array.isArray(notes[k]) && notes[k].every((n) => Number.isInteger(n) && n > 0);
  if (!seq('phaseA_turns') || !notes.phaseA_turns.length) errors.push('phaseA_turns must list the phase-A turn numbers');
  if (!seq('phaseB_turns') || !notes.phaseB_turns.length) errors.push('phaseB_turns must list the phase-B turn numbers');
  if (!errors.length) {
    const all = [...notes.phaseA_turns, ...notes.phaseB_turns];
    const want = Array.from({ length: turns }, (_, i) => i + 1);
    if (all.join() !== want.join()) errors.push(`phaseA_turns then phaseB_turns must be exactly turns 1..${turns} in order`);
  }
  for (const k of ['q_explicit', 'q_items_total']) {
    if (!Number.isInteger(notes[k]) || notes[k] < 0) errors.push(`${k} must be a non-negative integer`);
  }
  if (Number.isInteger(notes.q_explicit) && Number.isInteger(notes.q_items_total) && notes.q_items_total < notes.q_explicit) {
    errors.push('q_items_total counts every handed-back item, so it cannot be below q_explicit');
  }
  if (!Array.isArray(notes.questions_phaseA)) errors.push('questions_phaseA must be a list (empty when none)');
  for (const label of ['A', 'final']) {
    const m = notes.manual?.[label];
    const keys = m && typeof m === 'object' ? Object.keys(m).sort() : [];
    if (keys.join() !== [...manualItems].sort().join()) errors.push(`manual.${label} must hold exactly ${manualItems.join(', ')}`);
    else if (!keys.every((k) => m[k] === 0 || m[k] === 1)) errors.push(`manual.${label} values must be 0 or 1`);
  }
  return errors;
}

// ------------------------------------------------------------------ answer forms

// What each phase-A user reply line asked of the user. The case fixture maps each oracle answer
// to a form, splits each table value into fields, and holds the tests for whether the subject's
// handed-back item carried a proposal and which fields it presented; this code only applies that
// mapping. The fixture's header defines every label and field status.
export const ANSWER_LABELS = ['recognized', 'composed', 'rejected', 'reframed', 'deferred', 'unknown', 'pointer',
  'permission', 'sufficient', 'repeated', 'unclassified'];
export const FIELD_STATUSES = ['presented', 'released', 'example', 'repeat', 'unverified'];

const normText = (s) => String(s).replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
  .replace(/[*`]/g, '').replace(/\s+/g, ' ').trim();
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const globalRe = (re) => new RegExp(re.source, re.flags.includes('g') ? re.flags : `${re.flags}g`);

export function replyLines(text) {
  return String(text).split('\n').map((l) => l.trim()).filter(Boolean);
}

// The oracle answers found in one reply line, in the order they appear. Literal answers are
// matched longest first and never overlap, so a shorter answer inside a longer one is not
// counted twice.
export function matchOracleAnswers(line, answers) {
  const s = normText(line);
  const taken = [];
  const hits = [];
  const ordered = [...answers].sort((a, b) => (b.text ? normText(b.text).length : 0) - (a.text ? normText(a.text).length : 0));
  for (const a of ordered) {
    const re = a.text ? new RegExp(escapeRe(normText(a.text)), 'g') : globalRe(a.pattern);
    for (const m of s.matchAll(re)) {
      const span = [m.index, m.index + m[0].length];
      if (taken.some(([x, y]) => span[0] < y && x < span[1])) continue;
      taken.push(span);
      hits.push({ at: m.index, answer: a });
    }
  }
  return hits.sort((x, y) => x.at - y.at).map((h) => h.answer);
}

// The start of the clause holding position `at`: just past the nearest boundary before it.
function clauseStart(text, at, boundary) {
  let start = 0;
  for (const m of text.matchAll(globalRe(boundary))) {
    if (m.index + m[0].length <= at) start = m.index + m[0].length;
    else break;
  }
  return start;
}

// The first value `re` finds in `text` that no negation earlier in its own clause names as
// absent ("there are no API keys"), or null.
function presentedIn(text, re, fixture, negationBlind) {
  for (const m of text.matchAll(globalRe(re))) {
    if (negationBlind || !fixture.negation) return m[0];
    const lead = text.slice(clauseStart(text, m.index, fixture.clauseBoundary), m.index);
    if (!fixture.negation.test(lead)) return m[0];
  }
  return null;
}

// One table answer against the item it answers. `disclosed` holds the fields earlier replies in
// the cell already released. Returns the field statuses and the rule-derived labels.
export function classifyTableAnswer(answer, item, disclosed, fixture) {
  const key = (f) => `${answer.rule}:${f.name}`;
  if (item === null) {
    const fields = answer.fields.map((f) => ({ field: key(f), status: disclosed.has(key(f)) ? 'repeat' : 'unverified' }));
    if (fields.every((f) => f.status === 'repeat')) return { rule: answer.rule, fields, labels: ['repeated'] };
    return { rule: answer.rule, fields, labels: ['unclassified'], reason: 'no verified item excerpt on record' };
  }
  const full = normText(item);
  const stripped = fixture.exampleClause ? full.replace(globalRe(fixture.exampleClause), ' ') : full;
  const fields = answer.fields.map((f) => {
    if (disclosed.has(key(f))) return { field: key(f), status: 'repeat' };
    const hit = presentedIn(stripped, f.value, fixture, f.negationBlind);
    if (hit) return { field: key(f), status: 'presented', evidence: hit };
    if (presentedIn(full, f.value, fixture, f.negationBlind)) return { field: key(f), status: 'example' };
    return { field: key(f), status: 'released' };
  });
  const st = (s) => fields.some((f) => f.status === s);
  const labels = [];
  let evidence; let reason;
  if (!fields.some((f) => f.status !== 'repeat')) labels.push('repeated');
  else if (st('presented')) {
    labels.push('recognized');
    if (st('released')) labels.push('composed');
  } else if (st('example')) { labels.push('unclassified'); reason = 'the answer\'s value sits only in an example clause'; } else {
    const proposal = presentedIn(stripped, answer.topic, fixture);
    if (proposal) { labels.push('rejected'); evidence = proposal; } else if (presentedIn(full, answer.topic, fixture)) {
      labels.push('unclassified'); reason = 'the only proposal on the topic sits in an example clause';
    } else labels.push('composed');
  }
  return { rule: answer.rule, fields, labels, ...(evidence ? { proposal: evidence } : {}), ...(reason ? { reason } : {}) };
}

// Every phase-A reply line of a cell, labelled. `replies` are the reply turns in order:
// { turn, text (what was sent), prevText (the subject turn it answers) }. `items` are the notes'
// reply_items: { turn, line, text, item, review? } — `item` the verbatim excerpt (a string, or a
// list of spans) of the handed-back item the line answers, which must occur in prevText; `review`
// labels a reader adds after the fact, [{ label, why }], kept apart from the rule-derived ones.
// An entry naming no sent line, or whose text is not that line, is an error: the notes and the
// records disagree.
export function classifyReplies({ replies, items = [], fixture }) {
  const errors = [];
  const out = [];
  const byKey = new Map();
  if (!Array.isArray(items)) errors.push('reply_items must be a list');
  else {
    for (const e of items) {
      const spansOk = e && (e.item === null || typeof e.item === 'string'
        || (Array.isArray(e.item) && e.item.every((s) => typeof s === 'string')));
      if (!e || !Number.isInteger(e.turn) || !Number.isInteger(e.line) || typeof e.text !== 'string' || !spansOk) {
        errors.push(`reply_items entry ${JSON.stringify(e).slice(0, 80)} needs integer turn and line, the line's text, and item (string, list of strings, or null)`);
        continue;
      }
      for (const r of e.review || []) {
        if (!ANSWER_LABELS.includes(r?.label) || typeof r?.why !== 'string' || !r.why.trim()) {
          errors.push(`reply_items ${e.turn}:${e.line}: a review label needs one of ${ANSWER_LABELS.join('|')} and a why`);
        }
      }
      if (byKey.has(`${e.turn}:${e.line}`)) errors.push(`reply_items ${e.turn}:${e.line} appears twice`);
      byKey.set(`${e.turn}:${e.line}`, e);
    }
  }
  const seen = new Set();
  const disclosed = new Set();
  for (const r of replies) {
    const prev = normText(r.prevText || '');
    replyLines(r.text).forEach((text, i) => {
      const line = i + 1;
      const key = `${r.turn}:${line}`;
      const entry = byKey.get(key);
      if (entry) {
        seen.add(key);
        if (normText(entry.text) !== normText(text)) errors.push(`reply_items ${key}: text does not match the sent line`);
      }
      const spans = entry?.item == null ? [] : [].concat(entry.item);
      const unfound = spans.filter((s) => !prev.includes(normText(s)));
      const item = spans.length && !unfound.length ? spans.join('\n') : null;
      const answers = matchOracleAnswers(text, fixture.answers);
      const results = answers.map((a) => (a.form === 'by-item'
        ? classifyTableAnswer(a, item, disclosed, fixture)
        : { rule: a.rule, fields: [], labels: [a.form] }));
      for (const res of results) for (const f of res.fields) disclosed.add(f.field);
      const labels = [];
      const add = (label, source, why) => { if (!labels.some((l) => l.label === label && l.source === source)) labels.push({ label, source, ...(why ? { why } : {}) }); };
      if (!answers.length) add('unclassified', 'rule', 'no oracle answer found in the line');
      for (const res of results) for (const l of res.labels) add(l, 'rule', res.reason);
      for (const rv of entry?.review || []) add(rv.label, 'review', rv.why);
      out.push({
        turn: r.turn, line, text, answers: results, labels,
        ...(unfound.length ? { itemNotFound: `excerpt not found in turn ${r.turn - 1}'s text` } : {}),
      });
    });
  }
  for (const k of byKey.keys()) if (!seen.has(k)) errors.push(`reply_items ${k}: no such phase-A reply line`);
  return { lines: out, errors };
}

// Per cell: how many lines carry each label (a line can carry several; review labels are counted
// apart as well), the field statuses, the unknown answers, and the recognized share — fields the
// subject presented before the user disclosed them, over those plus the fields the oracle released
// plus the unknown answers. Example and repeat fields are outside the share. The share is null when
// nothing was settled, and while any field is unverified: a line whose item excerpt is missing
// leaves the notes incomplete, and a share over the rest would read as a finished number.
export function summarizeForms(lines) {
  const labels = Object.fromEntries(ANSWER_LABELS.map((l) => [l, 0]));
  const review = Object.fromEntries(ANSWER_LABELS.map((l) => [l, 0]));
  const fields = Object.fromEntries(FIELD_STATUSES.map((s) => [s, 0]));
  let unknown = 0;
  for (const l of lines) {
    for (const lab of new Set(l.labels.map((x) => x.label))) labels[lab]++;
    for (const x of l.labels) if (x.source === 'review') review[x.label]++;
    for (const a of l.answers) {
      if (a.rule === 'Default') unknown++;
      for (const f of a.fields) fields[f.status]++;
    }
  }
  const n = fields.presented + fields.released + unknown;
  return { lines: lines.length, labels, review, fields, unknown, n, share: n && !fields.unverified ? fields.presented / n : null };
}

// The reply_items template: one entry per line that carries a table value, item left for the
// person filling the notes to quote from the turn the line answers.
export function replyItemsTemplate(replies, fixture) {
  const out = [];
  for (const r of replies) {
    replyLines(r.text).forEach((text, i) => {
      const answers = matchOracleAnswers(text, fixture.answers);
      if (answers.some((a) => a.form === 'by-item')) {
        out.push({ turn: r.turn, line: i + 1, text, rules: answers.map((a) => a.rule), item: null });
      }
    });
  }
  return out;
}

// ------------------------------------------------------------------ aggregation

// A resumed Claude session reports its running total in every result event, so a cell's cost
// is its last turn's figure. A total that ever falls means a turn did not resume that session;
// the per-turn figures are then summed and the basis says so.
export function claudeCellCost(costs) {
  if (!costs.length || costs.some((c) => typeof c !== 'number')) return { costUsd: null, basis: 'missing' };
  const monotonic = costs.every((c, i) => i === 0 || c >= costs[i - 1]);
  return monotonic
    ? { costUsd: costs[costs.length - 1], basis: 'cumulative' }
    : { costUsd: costs.reduce((s, c) => s + c, 0), basis: 'summed' };
}

const sum = (o) => Object.values(o || {}).reduce((s, v) => s + v, 0);

// One row per cell, from the facts outcome.mjs gathered. `turns` are the per-turn metas in
// order; `scores` the A and final score files; `diff` the A-to-final diffTrees result.
export function buildRow({ cell, turns, notes, scores, diff, integrity, pathFlags = [], answerForms = null }) {
  const first = sum(scores.A.auto) + sum(notes.manual.A);
  const final = sum(scores.final.auto) + sum(notes.manual.final);
  const row = {
    run: cell.run, cell: cell.name, runner: cell.runner, model: cell.model, effort: cell.effort ?? null,
    variant: cell.variant, arm: cell.arm, rep: cell.rep,
    integrity: integrity.ok, integrity_reasons: integrity.reasons,
    stopped_first_turn: turns[0]?.treeChanged === false,
    a_implemented: scores.A.implemented,
    q: notes.q_explicit, q_items: notes.q_items_total,
    a_turns: notes.phaseA_turns.length, b_turns: notes.phaseB_turns.length,
    first, first_detail: { ...scores.A.auto, ...notes.manual.A },
    final, final_detail: { ...scores.final.auto, ...notes.manual.final },
    b_files: diff.files, b_lines: diff.lines, b_plus: diff.plus, b_minus: diff.minus,
    rework_files: diff.reworkFiles, rework: diff.rework,
    wall: turns.reduce((s, t) => s + (t.wallS || 0), 0), subj_turns: turns.length,
    path_flags: pathFlags.length,
  };
  // Answer forms of the phase-A reply lines; null throughout when the case defines none.
  const af = answerForms ? summarizeForms(answerForms.lines) : null;
  Object.assign(row, {
    af_lines: af ? af.lines : null, af_labels: af ? af.labels : null, af_review: af ? af.review : null,
    af_fields: af ? af.fields : null,
    af_presented: af ? af.fields.presented : null, af_released: af ? af.fields.released : null,
    af_unknown: af ? af.unknown : null, af_n: af ? af.n : null, af_share: af ? af.share : null,
    af_detail: answerForms ? answerForms.lines : null,
  });
  if (cell.runner === 'claude') {
    const { costUsd, basis } = claudeCellCost(turns.map((t) => t.costUsd));
    const last = turns[turns.length - 1]?.usage || {};
    Object.assign(row, {
      skill_invoked: (turns[0]?.skillInvocations || []).some((s) => /(^|:)inquire$/.test(s)),
      cost_usd: costUsd, cost_basis: basis, cost_unit: 'usd', total_cost: costUsd,
      in_tok: last.inputTokens ?? null, out_tok: last.outputTokens ?? null,
      cache_read: last.cacheReadInputTokens ?? null, cache_create: last.cacheCreationInputTokens ?? null,
    });
  } else {
    // A resumed codex thread reports its running total; the last turn's figure is the cell's.
    const usages = turns.map((t) => t.usage || {});
    const u = usages[usages.length - 1] || {};
    Object.assign(row, {
      skill_invoked: 'trace-unavailable',
      cost_unit: 'input_tokens', total_cost: u.input_tokens ?? null,
      in_tok: u.input_tokens ?? null, cached_in_tok: u.cached_input_tokens ?? null,
      out_tok: u.output_tokens ?? null, reasoning_tok: u.reasoning_output_tokens ?? null,
      usage_monotonic: usages.every((x, i) => i === 0 || (x.input_tokens || 0) >= (usages[i - 1].input_tokens || 0)),
    });
  }
  return row;
}

export const MEAN_KEYS = ['q', 'q_items', 'a_turns', 'first', 'b_turns', 'b_lines', 'rework', 'final', 'total_cost', 'wall',
  'af_presented', 'af_released', 'af_unknown'];

const groupKey = (r) => `${r.runner}\u0000${r.model}\u0000${r.effort ?? ''}`;

// Means per (model, variant, arm) over rows whose integrity held; failed rows are never averaged.
export function groupMeans(rows) {
  const groups = new Map();
  for (const r of rows.filter((x) => x.integrity)) {
    const k = `${groupKey(r)}\u0000${r.variant}\u0000${r.arm}`;
    if (!groups.has(k)) groups.set(k, { runner: r.runner, model: r.model, effort: r.effort, variant: r.variant, arm: r.arm, rows: [] });
    groups.get(k).rows.push(r);
  }
  return [...groups.values()].map((g) => {
    const mean = {};
    for (const key of MEAN_KEYS) {
      const vals = g.rows.map((r) => r[key]).filter((v) => typeof v === 'number');
      mean[key] = vals.length === g.rows.length ? vals.reduce((s, v) => s + v, 0) / vals.length : null;
    }
    // The recognized share is a ratio per cell; it is averaged over the cells where something was
    // settled, and the number of those cells travels with it.
    const shares = g.rows.map((r) => r.af_share).filter((v) => typeof v === 'number');
    mean.af_share = shares.length ? shares.reduce((s, v) => s + v, 0) / shares.length : null;
    mean.af_share_cells = shares.length;
    mean.stopped = g.rows.filter((r) => r.stopped_first_turn).length;
    mean.unimplemented = g.rows.filter((r) => !r.a_implemented).length;
    return { runner: g.runner, model: g.model, effort: g.effort, variant: g.variant, arm: g.arm, n: g.rows.length, mean };
  });
}

// The falsifier clauses of references/report-format.md, evaluated in order on the variant where
// the protocol has something to find. The first clause that holds is the verdict.
export function evaluateFalsifiers(means, { variant }) {
  const out = [];
  const byModel = new Map();
  for (const m of means.filter((x) => x.variant === variant)) {
    const k = groupKey(m);
    if (!byModel.has(k)) byModel.set(k, {});
    byModel.get(k)[m.arm] = m;
  }
  for (const pair of byModel.values()) {
    const b = pair.bare; const p = pair.protocol;
    const who = b || p;
    const base = { runner: who.runner, model: who.model, effort: who.effort, variant };
    if (!b || !p) { out.push({ ...base, verdict: 'incomplete', reason: 'one arm has no cell whose integrity held' }); continue; }
    const need = ['rework', 'final', 'total_cost'];
    if (need.some((k) => b.mean[k] === null || p.mean[k] === null)) {
      out.push({ ...base, verdict: 'incomplete', reason: 'a mean the clauses read is missing' }); continue;
    }
    const facts = {
      n: { bare: b.n, protocol: p.n },
      rework: { bare: b.mean.rework, protocol: p.mean.rework },
      final: { bare: b.mean.final, protocol: p.mean.final },
      first: { bare: b.mean.first, protocol: p.mean.first },
      total_cost: { bare: b.mean.total_cost, protocol: p.mean.total_cost },
      protocol_unimplemented: p.mean.unimplemented,
    };
    let verdict = 'not-falsified';
    if (!(p.mean.rework < b.mean.rework)) verdict = 'no-reduction';
    else if (p.mean.final < b.mean.final || p.mean.unimplemented > 0) verdict = 'unfinished-work';
    else if (p.mean.total_cost > b.mean.total_cost) verdict = 'greater-total-cost';
    out.push({ ...base, verdict, facts });
  }
  return out;
}

// The fully specified variant: what the protocol arm costs where there is nothing to find.
export function guardrails(means, { variant }) {
  const byModel = new Map();
  for (const m of means.filter((x) => x.variant === variant)) {
    const k = groupKey(m);
    if (!byModel.has(k)) byModel.set(k, {});
    byModel.get(k)[m.arm] = m;
  }
  return [...byModel.values()].filter((p) => p.bare && p.protocol).map(({ bare, protocol }) => ({
    runner: bare.runner, model: bare.model, effort: bare.effort, variant,
    q: { bare: bare.mean.q, protocol: protocol.mean.q },
    first: { bare: bare.mean.first, protocol: protocol.mean.first },
    final: { bare: bare.mean.final, protocol: protocol.mean.final },
    total_cost: { bare: bare.mean.total_cost, protocol: protocol.mean.total_cost },
  }));
}

// ------------------------------------------------------------------ report

const fmt = (v, d = 1) => (v === null || v === undefined ? '-' : (Number.isInteger(v) ? String(v) : v.toFixed(d)));
const costCell = (r) => (r.runner === 'claude'
  ? fmt(r.cost_usd, 4)
  : `${fmt(r.in_tok)}/${fmt(r.cached_in_tok)}/${fmt(r.out_tok)}/${fmt(r.reasoning_tok)}`);
const pair = (o, d = 1) => `${fmt(o.bare, d)} → ${fmt(o.protocol, d)}`;
const LABEL_ABBR = { recognized: 'rec', composed: 'comp', rejected: 'rej', reframed: 'refr', deferred: 'def', unknown: 'unk',
  pointer: 'ptr', permission: 'perm', sufficient: 'suff', repeated: 'rep', unclassified: 'uncl' };
const labelsCell = (r) => {
  if (!r.af_labels) return '-';
  const parts = Object.entries(r.af_labels).filter(([, v]) => v > 0)
    .map(([k, v]) => `${LABEL_ABBR[k]} ${v}${r.af_review?.[k] ? ` (${r.af_review[k]} rev)` : ''}`);
  return parts.length ? parts.join(', ') : 'none';
};
const fieldsCell = (r) => (r.af_fields ? `${r.af_fields.presented}/${r.af_fields.released}/${r.af_unknown}` : '-');
const shareCell = (r) => {
  if (r.af_n === null || r.af_n === undefined) return '-';
  if (r.af_fields.unverified) return `items missing (${r.af_fields.unverified} fields)`;
  return r.af_n ? `${r.af_share.toFixed(2)} (n=${r.af_n})` : 'n=0';
};
const modelLabel = (x) => `${x.model}${x.effort ? ` (effort ${x.effort})` : ''} · ${x.runner}`;

export function renderReport({ rows, means, verdicts, guards, scope }) {
  const out = [];
  out.push('# Outcome eval report', '');
  out.push(`Scope: ${scope}`, '');
  out.push('Observations from these runs only: one task, a scripted user, n per group as shown,',
    'no significance test. Read references/report-format.md before quoting any number.', '');

  out.push('## Falsifier verdicts', '');
  out.push('| model | n bare/protocol | rework (non-test lines) | final | total cost | verdict |');
  out.push('|---|---|---|---|---|---|');
  for (const v of verdicts) {
    if (v.verdict === 'incomplete') { out.push(`| ${modelLabel(v)} | - | - | - | - | incomplete: ${v.reason} |`); continue; }
    const d = v.runner === 'claude' ? 3 : 0;
    out.push(`| ${modelLabel(v)} | ${v.facts.n.bare}/${v.facts.n.protocol} | ${pair(v.facts.rework)} | ${pair(v.facts.final)} | ${pair(v.facts.total_cost, d)} | ${v.verdict} |`);
  }
  out.push('');

  if (guards.length) {
    out.push('## Guardrail: fully specified variant', '');
    out.push('| model | questions | first | final | total cost |');
    out.push('|---|---|---|---|---|');
    for (const g of guards) {
      const d = g.runner === 'claude' ? 3 : 0;
      out.push(`| ${modelLabel(g)} | ${pair(g.q)} | ${pair(g.first)} | ${pair(g.final)} | ${pair(g.total_cost, d)} |`);
    }
    out.push('');
  }

  const models = [...new Map(rows.map((r) => [groupKey(r), r])).values()];
  for (const m of models) {
    const rs = rows.filter((r) => groupKey(r) === groupKey(m));
    const codex = m.runner === 'codex';
    out.push(`## ${modelLabel(m)}`, '');
    out.push(`| cell | integrity | stopped at turn 1 | Qs explicit/items | reply labels | fields presented/released/unknown | recognized share | A turns | first | B turns | B files/lines | rework files/lines | final | ${codex ? 'tokens in/cached/out/reasoning' : 'cost $'} | wall s | path flags |`);
    out.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
    for (const variant of [...new Set(rs.map((r) => r.variant))]) {
      for (const arm of ARMS) {
        const grp = rs.filter((r) => r.variant === variant && r.arm === arm).sort((a, b) => a.rep - b.rep);
        for (const r of grp) {
          out.push(`| ${r.cell} | ${r.integrity ? 'ok' : 'FAILED'} | ${r.stopped_first_turn ? 'yes' : 'no'} | ${r.q}/${r.q_items} | ${labelsCell(r)} | ${fieldsCell(r)} | ${shareCell(r)} | ${r.a_turns} | ${r.first} | ${r.b_turns} | ${r.b_files}/${r.b_lines} | ${r.rework_files}/${r.rework} | ${r.final} | ${costCell(r)} | ${r.wall} | ${r.path_flags} |`);
        }
        const g = means.find((x) => groupKey(x) === groupKey(m) && x.variant === variant && x.arm === arm);
        if (g) {
          const c = codex ? `${fmt(g.mean.total_cost, 0)} in` : fmt(g.mean.total_cost, 3);
          out.push(`| **mean ${variant}-${arm}** (n=${g.n}) | | ${g.mean.stopped}/${g.n} | ${fmt(g.mean.q)}/${fmt(g.mean.q_items)} | | ${fmt(g.mean.af_presented)}/${fmt(g.mean.af_released)}/${fmt(g.mean.af_unknown)} | ${g.mean.af_share === null ? `- (0/${g.n} cells)` : `${g.mean.af_share.toFixed(2)} (${g.mean.af_share_cells}/${g.n} cells)`} | ${fmt(g.mean.a_turns)} | ${fmt(g.mean.first)} | ${fmt(g.mean.b_turns)} | -/${fmt(g.mean.b_lines)} | -/${fmt(g.mean.rework)} | ${fmt(g.mean.final)} | ${c} | ${fmt(g.mean.wall, 0)} | |`);
        }
      }
    }
    out.push('');
  }

  const failed = rows.filter((r) => !r.integrity);
  out.push('## Integrity', '');
  if (!failed.length) out.push('Every cell passed its treatment-integrity check.');
  else {
    out.push('These cells are not evidence about the protocol and are left out of every mean:', '');
    for (const r of failed) out.push(`- ${r.run}/${r.cell}: ${r.integrity_reasons.join('; ')}`);
  }
  const flagged = rows.filter((r) => r.path_flags > 0);
  if (flagged.length) {
    out.push('', `Cells with path-audit flags to read before quoting (see each cell's path-audit.json): ${flagged.map((r) => `${r.run}/${r.cell}`).join(', ')}`);
  }
  out.push('');
  return out.join('\n');
}
