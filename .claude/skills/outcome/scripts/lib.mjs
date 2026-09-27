// Pure parts of the outcome eval: argument checking, message composition, trace parsing, the
// notes' items, and the report. Node standard library only. Everything that spawns a process or
// owns a directory lives in outcome.mjs.

import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const RUNNERS = ['claude', 'codex'];
export const ARMS = ['bare', 'protocol'];
export const EFFORTS = ['minimal', 'low', 'medium', 'high', 'xhigh'];
export const CODEX_AUTH = ['api-key', 'login'];

// ------------------------------------------------------------------ arguments

const BOOLEAN_FLAGS = new Set(['dry-run', 'open', 'go']);

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

  // A spending cap per Claude turn, so a runaway turn stops; it is not a measure.
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

export const sha256 = (data) => createHash('sha256').update(data).digest('hex');

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

// /realize's tree digest: sha256 per file over sorted relative paths, dot-entries and
// __pycache__ excluded. A digest that differs from the scaffold's means the subject wrote code.
export function treeDigest(dir) {
  const out = [];
  const walk = (d, rel) => {
    for (const e of readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (e.name.startsWith('.') || e.name === '__pycache__') continue;
      const p = join(d, e.name);
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) walk(p, r);
      else if (e.isFile()) out.push(`${r}:${sha256(readFileSync(p))}`);
    }
  };
  if (existsSync(dir)) walk(dir, '');
  return out.join('\n');
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
  const texts = []; const skills = []; const commands = [];
  for (const e of jsonLines(text)) {
    sessionId = e.session_id || sessionId;
    if (e.type === 'system' && e.subtype === 'init') init = e;
    if (e.type === 'result') result = e;
    if (e.type !== 'assistant' || !Array.isArray(e.message?.content)) continue;
    for (const c of e.message.content) {
      if (c.type === 'text') texts.push(c.text);
      if (c.type !== 'tool_use') continue;
      if (c.name === 'Skill' && c.input?.skill) skills.push(String(c.input.skill));
      for (const k of ['command', 'file_path', 'path', 'notebook_path']) {
        if (typeof c.input?.[k] === 'string') commands.push(c.input[k]);
      }
    }
  }
  return {
    sessionId,
    completed: Boolean(init && result),
    initPlugins: (init?.plugins || []).map((p) => p.name),
    initSkillsMatching: (init?.skills || []).filter((s) => skillPattern.test(s)),
    skillInvocations: skills,
    commands,
    texts,
  };
}

export function parseCodexTurn(text) {
  let threadId = null; let completed = false; let failed = null;
  const texts = []; const commands = []; const fileChanges = [];
  for (const e of jsonLines(text)) {
    if (e.type === 'thread.started') threadId = e.thread_id;
    if (e.type === 'turn.completed') completed = true;
    if (e.type === 'turn.failed' || e.type === 'error') failed = e;
    if (e.type !== 'item.completed' || !e.item) continue;
    const it = e.item;
    if (it.type === 'agent_message') texts.push(it.text);
    if (it.type === 'command_execution') commands.push(it.command || '');
    if (it.type === 'file_change') fileChanges.push(...(it.changes || []).map((c) => `${c.kind} ${c.path}`));
  }
  return { threadId, completed: completed && Boolean(threadId), failed, texts, commands, fileChanges };
}

// ------------------------------------------------------------------ path audit

// Commands that name a path outside the cell's own directory: another cell, the run's records,
// the repository, or a climb to the parent. Flags are for reading, not an integrity verdict.
// `roots` are the directories a subject has no business reading; `allowed` carves out what a
// treatment legitimately reads.
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

// ------------------------------------------------------------------ items

// How a decision item reached the user: `asked` — put as a question, answered by recalling;
// `presented` — shown as an option or default, for the user to recognize, pick or correct.
export const VIA = ['asked', 'presented'];

const normText = (s) => String(s).replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
  .replace(/[*`]/g, '').replace(/\s+/g, ' ').trim();

// A cell's notes: `lastTurn` (the dialogue's last subject turn), and `items`, each
// { turn, via, item, span } — `item` a short name, `span` the verbatim text (a string, or a list
// of strings where the item is split) of the subject turn that raised it. `turnTexts[i]` is
// turn i+1's text. Whether a span is a decision item the opening request did not contain is the
// reader's attribution; what is checked here is that the reading can be checked: every span
// occurs in the turn it names.
export function validateNotes(notes, { turnTexts }) {
  if (!notes || typeof notes !== 'object') return ['notes.json is not an object'];
  const errors = [];
  if (notes.lastTurn !== turnTexts.length) errors.push(`lastTurn must be ${turnTexts.length}, the cell's last turn`);
  if (!Array.isArray(notes.items)) return [...errors, 'items must be a list (empty when the AI raised none)'];
  notes.items.forEach((e, i) => {
    const at = `items[${i}]`;
    if (!e || typeof e !== 'object') { errors.push(`${at} is not an object`); return; }
    if (!Number.isInteger(e.turn) || e.turn < 1 || e.turn > turnTexts.length) errors.push(`${at}.turn must be a turn 1..${turnTexts.length}`);
    if (!VIA.includes(e.via)) errors.push(`${at}.via must be one of ${VIA.join('|')}`);
    if (typeof e.item !== 'string' || !e.item.trim()) errors.push(`${at}.item must name the item`);
    const spans = typeof e.span === 'string' ? [e.span] : e.span;
    if (!Array.isArray(spans) || !spans.length || !spans.every((s) => typeof s === 'string' && normText(s))) {
      errors.push(`${at}.span must be the verbatim text that raised the item (a string or a list of strings)`);
    } else if (Number.isInteger(e.turn) && turnTexts[e.turn - 1] !== undefined) {
      const text = normText(turnTexts[e.turn - 1]);
      for (const s of spans) if (!text.includes(normText(s))) errors.push(`${at}.span not found in turn ${e.turn}: ${JSON.stringify(s.slice(0, 60))}`);
    }
  });
  return errors;
}

// ------------------------------------------------------------------ report

// One row per cell. `turns` are the per-turn metas in order.
export function buildRow({ cell, turns, notes, integrity, pathFlags = [] }) {
  const idx = turns.findIndex((t) => t.treeChangedSinceScaffold);
  const items = notes.items;
  return {
    run: cell.run, cell: cell.name, runner: cell.runner, model: cell.model, effort: cell.effort ?? null,
    variant: cell.variant, arm: cell.arm, rep: cell.rep,
    integrity: integrity.ok, integrity_reasons: integrity.reasons,
    turns: turns.length, implemented_at: idx === -1 ? null : idx + 1,
    count: items.length,
    asked: items.filter((x) => x.via === 'asked').length,
    presented: items.filter((x) => x.via === 'presented').length,
    items,
    path_flags: pathFlags.length,
  };
}

const groupKey = (r) => `${r.runner}\u0000${r.model}\u0000${r.effort ?? ''}`;

// Per (model, variant, arm), over the cells whose integrity held: each cell's count, and the
// arm's total. A failed cell is listed under Integrity and counted nowhere.
export function armCounts(rows) {
  const groups = new Map();
  for (const r of rows.filter((x) => x.integrity)) {
    const k = `${groupKey(r)}\u0000${r.variant}\u0000${r.arm}`;
    if (!groups.has(k)) groups.set(k, { runner: r.runner, model: r.model, effort: r.effort, variant: r.variant, arm: r.arm, cells: [] });
    groups.get(k).cells.push(r);
  }
  return [...groups.values()].map((g) => {
    const cells = g.cells.sort((a, b) => a.rep - b.rep);
    const total = (key) => cells.reduce((s, r) => s + r[key], 0);
    return {
      runner: g.runner, model: g.model, effort: g.effort, variant: g.variant, arm: g.arm,
      n: cells.length, perCell: cells.map((r) => r.count),
      total: total('count'), asked: total('asked'), presented: total('presented'),
    };
  });
}

const modelLabel = (x) => `${x.model}${x.effort ? ` (effort ${x.effort})` : ''} · ${x.runner}`;
const quote = (text) => text.split('\n').map((l) => `> ${l}`.trimEnd()).join('\n');
const spanText = (s) => [].concat(s).map((x) => `"${normText(x)}"`).join(' … ');

// `requests` maps each variant to its opening request, shown before its cells: the items listed
// under it are what that request did not contain, and so what the user would otherwise have had
// to write into it.
export function renderReport({ rows, arms, requests, scope }) {
  const out = ['# Outcome eval report', '', `Scope: ${scope}`, ''];
  out.push('Per cell: the decision items that entered the conversation through the AI — asked as a',
    'question, or presented for the user to recognize — that the opening request did not contain.',
    'Identifying an item is a reading of the transcript; each is listed with the span that raised it.',
    'These are observations of one model on one day, not a standing claim.', '');
  for (const variant of [...new Set(rows.map((r) => r.variant))]) {
    out.push(`## Variant \`${variant}\``, '', 'Opening request:', '', quote(requests[variant] ?? '(not found)'), '');
    for (const m of [...new Map(rows.filter((r) => r.variant === variant).map((r) => [groupKey(r), r])).values()]) {
      out.push(`### ${modelLabel(m)}`, '');
      out.push('| arm | cells | items per cell | items in the arm | asked / presented |', '|---|---|---|---|---|');
      for (const a of arms.filter((x) => x.variant === variant && groupKey(x) === groupKey(m))) {
        out.push(`| ${a.arm} | ${a.n} | ${a.perCell.join(', ')} | ${a.total} | ${a.asked} / ${a.presented} |`);
      }
      out.push('');
      for (const arm of ARMS) {
        for (const r of rows.filter((x) => x.variant === variant && groupKey(x) === groupKey(m) && x.arm === arm).sort((a, b) => a.rep - b.rep)) {
          const impl = r.implemented_at ? `first implementation at turn ${r.implemented_at}` : 'no implementation';
          const flags = [r.integrity ? null : 'INTEGRITY FAILED', r.path_flags ? `${r.path_flags} path flag(s)` : null].filter(Boolean);
          out.push(`**${r.run}/${r.cell}** — ${r.turns} turn(s), ${impl}, ${r.count} item(s)${flags.length ? `; ${flags.join('; ')}` : ''}`, '');
          for (const it of r.items) out.push(`- t${it.turn} ${it.via} — ${it.item}: ${spanText(it.span)}`);
          if (r.items.length) out.push('');
        }
      }
    }
  }
  const failed = rows.filter((r) => !r.integrity);
  out.push('## Integrity', '');
  if (!failed.length) out.push('Every cell passed its treatment-integrity check.');
  else {
    out.push('These cells are not evidence about the protocol and are counted in no arm:', '');
    for (const r of failed) out.push(`- ${r.run}/${r.cell}: ${r.integrity_reasons.join('; ')}`);
  }
  const flagged = rows.filter((r) => r.path_flags > 0);
  if (flagged.length) {
    out.push('', `Read each flagged cell's path-audit.json before quoting it: ${flagged.map((r) => `${r.run}/${r.cell}`).join(', ')}`);
  }
  out.push('');
  return out.join('\n');
}
