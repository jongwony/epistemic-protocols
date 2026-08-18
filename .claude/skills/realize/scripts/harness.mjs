#!/usr/bin/env node
// Type-realization harness for epistemic protocol skills.
//
// Runs `claude -p` across (model x arm x case x repetition), captures the
// stream-json trace, and grades the protocol's DECLARED CONTRACT from it.
//
// Why the CLI rather than `claude plugin eval`: that subcommand is gated behind
// early access. Everything it would have given us is reachable from the CLI —
// `--plugin-dir` for the treatment, `--output-format stream-json` for the trace,
// `--max-budget-usd` for the ceiling. What we lose is reporting, which is cheap
// to rebuild and lives in `report` below.
//
// Why an isolated CLAUDE_CONFIG_DIR: a normal config loads every installed
// plugin (measured: 40 of them), so an arm without --plugin-dir still has the
// protocol under test present via the marketplace. That is not a baseline, it is
// the same treatment reached by another path. A config dir with nothing in it is
// the only arrangement observed to yield an empty plugin set.
//
// Node stdlib only.

import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, rmSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const HERE = dirname(fileURLToPath(import.meta.url));
const SKILL = resolve(HERE, '..');
// .claude/skills/realize -> .claude/skills -> .claude -> repo root
const REPO = resolve(SKILL, '..', '..', '..');
const CFG = JSON.parse(readFileSync(join(SKILL, 'harness.config.json'), 'utf8'));

// Environment overrides exist for one caller: a workflow that is dispatched by hand
// with a narrower matrix than the file describes. Editing the committed config from
// CI would make the run unreproducible from the checkout it claims to test.
const csv = (v) => v.split(',').map((x) => x.trim()).filter(Boolean);
if (process.env.REALIZE_MODELS) CFG.models = csv(process.env.REALIZE_MODELS);
// A malformed number becomes NaN, and NaN empties the repetition loop rather than
// erroring: no cell runs, the report says there are no results, and the job still exits
// green. A run that measured nothing must not be reportable as a run that measured a null.
const num = (name, raw) => {
  const v = Number(raw);
  if (!Number.isFinite(v) || v <= 0) {
    console.error(`${name}: expected a positive number, got ${JSON.stringify(raw)}`);
    process.exit(1);
  }
  return v;
};
if (process.env.REALIZE_RUNS) CFG.runs = num('REALIZE_RUNS', process.env.REALIZE_RUNS);
if (process.env.REALIZE_MAX_BUDGET_USD) CFG.maxBudgetUsd = num('REALIZE_MAX_BUDGET_USD', process.env.REALIZE_MAX_BUDGET_USD);
if (process.env.REALIZE_CASES) CFG.cases = csv(process.env.REALIZE_CASES);
if (process.env.REALIZE_ARMS) {
  const keep = new Set(csv(process.env.REALIZE_ARMS));
  CFG.arms = Object.fromEntries(Object.entries(CFG.arms).filter(([k]) => keep.has(k)));
}
for (const [key, list] of [['models', CFG.models], ['cases', CFG.cases]]) {
  if (!list.length) { console.error(`no ${key} selected`); process.exit(1); }
}
if (!Object.keys(CFG.arms).length) { console.error('no arms selected'); process.exit(1); }
const CONFIG_DIR = CFG.configDir.replace(/^~/, homedir());
// resetVolatile runs before every cell and `teardown --all` removes this tree entirely, so
// a configDir one character from the real one would delete the user's own history. The
// value is hand-edited JSON; refuse outright the paths where a typo is unrecoverable.
for (const forbidden of [homedir(), join(homedir(), '.claude'), '/']) {
  if (resolve(CONFIG_DIR) === resolve(forbidden)) {
    console.error(`configDir must not be ${forbidden} -- this harness deletes what it points at`);
    process.exit(1);
  }
}
const EVALS = join(SKILL, 'evals');
const RESULTS = join(SKILL, 'results');
const WORK = join(SKILL, '.work');

// Config paths are written relative to the repo root so the suite moves with the
// checkout. An absolute path is honoured as-is, which is what a one-off run
// against a plugin outside this repo needs.
const expand = (p) => {
  const e = p.replace(/^~/, homedir());
  return e.startsWith('/') ? e : resolve(REPO, e);
};

// The plugin names itself in its manifest. Hardcoding the name here would make integrity
// report a total failure the moment pluginDir is pointed at a different protocol -- the
// measurement declared unreadable while the run itself was fine.
const PLUGIN_NAME = JSON.parse(readFileSync(
  join(expand(CFG.pluginDir), '.claude-plugin', 'plugin.json'), 'utf8')).name;

// ---------------------------------------------------------------- isolation

// Nothing in the config dir is irreplaceable: authentication arrives through
// CLAUDE_CODE_OAUTH_TOKEN in the environment, and the init event confirms it
// (`apiKeySource: "none"`), so there is no credential here to protect. What the
// directory does hold is per-run residue, and residue is the state-contamination
// path -- workdir names are stable across invocations, so a re-run lands on the
// same project slug and can read what the previous run left behind.
const VOLATILE = ['projects', 'sessions', 'session-env', 'shell-snapshots', 'backups'];

function resetVolatile() {
  for (const d of VOLATILE) rmSync(join(CONFIG_DIR, d), { recursive: true, force: true });
  // .claude.json carries per-run state too. Cached feature flags are left alone:
  // refetching them every run costs a network round trip and buys nothing, since
  // they are identical across arms either way.
  const f = join(CONFIG_DIR, '.claude.json');
  if (existsSync(f)) {
    const j = JSON.parse(readFileSync(f, 'utf8'));
    delete j.projects; delete j.pluginUsage; delete j.skillUsage;
    writeFileSync(f, JSON.stringify(j, null, 2));
  }
}

// ---------------------------------------------------------------- setup

function setup() {
  mkdirSync(join(CONFIG_DIR, 'output-styles'), { recursive: true });
  cpSync(expand(CFG.styleSource), join(CONFIG_DIR, 'output-styles', 'epistemic-ink.md'));

  // Per-arm settings. These are passed with --settings so that the isolated
  // config dir itself stays empty of policy — an arm's treatment must come from
  // its own flags, never from ambient state a later arm would inherit.
  mkdirSync(join(SKILL, 'arms'), { recursive: true });
  for (const [name, arm] of Object.entries(CFG.arms)) {
    const settings = arm.style ? { outputStyle: CFG.styleName } : {};
    writeFileSync(join(SKILL, 'arms', `${name.replace('+', '-')}.json`),
      JSON.stringify(settings, null, 2) + '\n');
  }
  console.log(`config dir : ${CONFIG_DIR}`);
  console.log(`style      : ${join(CONFIG_DIR, 'output-styles', 'epistemic-ink.md')}`);
  console.log(`arm settings: ${join(SKILL, 'arms')}`);
  console.log('');
  console.log('Next, authenticate that config dir once (interactive, one time):');
  console.log(`  CLAUDE_CONFIG_DIR=${CONFIG_DIR} claude setup-token`);
  console.log('');
  console.log('Then export that token before `run`. The variable name is');
  console.log('CLAUDE_CODE_OAUTH_TOKEN -- CLAUDE_OAUTH_TOKEN is silently ignored and the');
  console.log('run then fails with "Not logged in", which reads like a setup-token problem.');
}

// ---------------------------------------------------------------- run

function promptBody(caseName, arm) {
  const raw = readFileSync(join(EVALS, caseName, 'prompt.md'), 'utf8');
  // Frontmatter is for the plugin-eval schema; the CLI takes the body only.
  const task = raw.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
  // Naming the protocol belongs to the treatment, not to the task. A prompt that
  // says "use /inquire" hands an arm without the plugin a second problem -- the
  // command is missing -- and the arm then gates on the missing tool rather than
  // on the task, which is not the behaviour under comparison.
  return arm.protocol && CFG.invocation ? `${task}\n\n${CFG.invocation}` : task;
}

function scaffold(dir) {
  mkdirSync(dir, { recursive: true });
  const r = spawnSync('bash', [join(EVALS, 'scaffold.sh')], { cwd: dir, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`scaffold failed: ${r.stderr}`);
}

function runOne({ model, armName, arm, caseName, rep }) {
  const outDir = join(RESULTS, model, armName, caseName);
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, `run-${rep}.jsonl`);
  if (existsSync(outFile)) return { skipped: true, outFile };

  resetVolatile();

  const wd = join(WORK, `${model}-${armName}-${caseName}-${rep}`.replace(/[^\w.-]/g, '_'));
  if (existsSync(wd)) rmSync(wd, { recursive: true, force: true });
  scaffold(wd);

  const args = [
    '-p', '--verbose', '--no-session-persistence',
    '--output-format', 'stream-json',
    '--model', model,
    '--max-budget-usd', String(CFG.maxBudgetUsd),
    '--permission-mode', CFG.permissionMode,
    '--allowed-tools', CFG.allowedTools.join(','),
    '--settings', join(SKILL, 'arms', `${armName.replace('+', '-')}.json`),
  ];
  if (arm.protocol) args.push('--plugin-dir', expand(CFG.pluginDir));
  args.push(promptBody(caseName, arm));

  const r = spawnSync('claude', args, {
    cwd: wd,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, CLAUDE_CONFIG_DIR: CONFIG_DIR },
  });
  if (r.stderr) writeFileSync(outFile.replace(/\.jsonl$/, '.err'), r.stderr);

  // Existence of the transcript IS the cache, so an empty one written here would freeze
  // the cell: every later invocation reports `cached` and grading reads the emptiness as
  // the protocol failing. Require evidence that claude actually started (init) and
  // actually reported (result). A budget-exhausted or errored turn has both and is a real
  // observation; a missing binary, an unusable token, or an overrun buffer has neither.
  const out = r.stdout || '';
  const ran = r.error == null && out.includes('"subtype":"init"') && out.includes('"type":"result"');
  if (!ran) {
    writeFileSync(outFile.replace(/\.jsonl$/, '.failed.jsonl'), out);
    return { skipped: false, launchFailed: true, outFile, exit: r.status,
             reason: r.error ? r.error.message : 'no init/result event in the stream' };
  }

  writeFileSync(outFile, out);
  // Whether the run changed anything is read now, while the working directory still
  // exists. Deferring it to grading ties the verdict to a directory that is gitignored,
  // never uploaded by CI, and gone once teardown has run -- so a later re-read of the
  // table would score every tree predicate false and present that as an observation.
  writeFileSync(outFile.replace(/\.jsonl$/, '.meta.json'),
    JSON.stringify({ exit: r.status, mutated: treeMutated(wd) }, null, 2) + '\n');
  // The working directory is kept: a grader that wants to inspect what the run
  // actually wrote needs the files, and a failed run is worth reading by hand.
  return { skipped: false, outFile, exit: r.status };
}

function run() {
  for (const model of CFG.models) {
    for (const [armName, arm] of Object.entries(CFG.arms)) {
      for (const caseName of CFG.cases) {
        for (let rep = 1; rep <= CFG.runs; rep++) {
          process.stdout.write(`${model} | ${armName} | ${caseName} | ${rep}/${CFG.runs} ... `);
          try {
            const { skipped, exit, launchFailed, reason } = runOne({ model, armName, arm, caseName, rep });
            if (launchFailed) console.log(`LAUNCH FAILED (${reason}) -- not cached, not graded`);
            else console.log(skipped ? 'cached' : `done (exit ${exit})`);
          } catch (e) {
            console.log(`FAILED: ${e.message}`);
          }
        }
      }
    }
  }
}

// ---------------------------------------------------------------- grade

function parse(file) {
  if (!existsSync(file)) return null;
  const events = readFileSync(file, 'utf8').split('\n').filter(Boolean)
    .map((l) => { try { return JSON.parse(l); } catch { return null; } })
    .filter(Boolean);
  const init = events.find((e) => e.type === 'system' && e.subtype === 'init');
  const result = events.find((e) => e.type === 'result');
  const toolUses = [];
  const skillInvocations = [];
  for (const e of events) {
    const content = e?.message?.content;
    if (e.type === 'assistant' && Array.isArray(content)) {
      for (const b of content) {
        if (b.type !== 'tool_use') continue;
        toolUses.push(b.name);
        // The identifier only. Matching against the serialized input would also match a
        // different skill invoked with args that happen to echo the protocol's name --
        // which the injected invocation line puts into the prompt on every protocol arm.
        if (b.name === 'Skill' && b.input?.skill) skillInvocations.push(String(b.input.skill));
      }
    }
  }
  const texts = events.filter((e) => e.type === 'assistant' && Array.isArray(e?.message?.content))
    .map((e) => e.message.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n'))
    .filter(Boolean);
  return { init, result, toolUses, skillInvocations, lastMessage: texts[texts.length - 1] || '' };
}

function treeDigest(dir) {
  const out = [];
  const walk = (d, rel) => {
    for (const e of readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (e.name === '__pycache__' || e.name.startsWith('.')) continue;
      const p = join(d, e.name); const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) walk(p, r);
      else out.push(`${r}:${createHash('sha256').update(readFileSync(p)).digest('hex')}`);
    }
  };
  if (existsSync(dir)) walk(dir, '');
  return out.join('\n');
}

let REFERENCE = null;
function referenceDigest() {
  if (REFERENCE !== null) return REFERENCE;
  const tmp = join(WORK, 'reference-tree');
  rmSync(tmp, { recursive: true, force: true });
  scaffold(tmp);
  REFERENCE = treeDigest(tmp);
  rmSync(tmp, { recursive: true, force: true });
  return REFERENCE;
}

// Whether the run changed the working tree at all, against the scaffold it started
// from. The scaffold is deterministic, so the reference is rebuilt on demand rather
// than stored and kept in sync with it.
function treeMutated(workdir) {
  if (!existsSync(workdir)) return null;
  return treeDigest(workdir) !== referenceDigest();
}

// Deterministic graders. Each returns true / false / null (not applicable).
// These read behaviour, not wording: the protocols are required to render in the
// user's everyday language, so a lexical check would be testing the renderer.
const GRADERS = {
  // Both dimensions, because either fails silently. The sham arm's entire treatment
  // arrives through --settings, which does nothing unless setup() copied the style file
  // into the config dir; run without setup and the sham quietly becomes a second
  // baseline, leaving the whole sham-control argument resting on two identical arms.
  treatment_integrity: ({ parsed, arm }) => {
    const plugin = (parsed.init?.plugins || []).some((p) => p.name === PLUGIN_NAME);
    const style = (parsed.init?.output_style || 'default')
      === (arm.style ? CFG.styleName : 'default');
    return plugin === !!arm.protocol && style;
  },
  // Only readable where the plugin is present. An attempt is not a run: the baseline was
  // observed calling Skill with this protocol's own name and getting nothing back, which
  // is the plugin's absence rather than its use, and absence is already what
  // treatment_integrity asserts for that arm. Where the plugin IS present this is the one
  // predicate separating "the protocol ran and behaved" from "the protocol never ran and
  // the model happened to produce the same shape".
  skill_fired: ({ parsed, arm, cfg }) =>
    arm.protocol
      ? parsed.skillInvocations.some(
          (s) => s === cfg.protocolSkill || s.endsWith(`:${cfg.protocolSkill}`))
      : null,
  // Naming the Skill tool is not enough: built-in skills exist even in an arm with
  // no plugins, so the tool alone fires in the baseline too. What indicates the
  // treatment is which skill was invoked.
  skill_fired: ({ parsed, arm, cfg }) => {
    const fired = parsed.skillInvocations.some((s) => s.includes(cfg.protocolSkill));
    return arm.protocol ? fired : !fired;
  },
  // Phase 2 is declared present-and-stop; the observable consequence is that the
  // working tree is unchanged. This reads the tree rather than the tool names.
  // Runs write through Bash as readily as through Write, so a predicate keyed on
  // tool identity misses the writes it exists to catch — and misses them in every
  // arm alike, which makes it look stable while measuring nothing.
  no_implementation: ({ mutated }) => mutated === false,
  implementation_happened: ({ mutated }) => mutated === true,
  // Rule 5: collection precedes inquiry. A floor, not a ceiling — one read
  // satisfies it. It catches the run that asks without looking.
  collection_first: ({ parsed }) =>
    parsed.toolUses.some((t) => t === 'Read' || t === 'Grep' || t === 'Glob'),
  completed: ({ parsed }) => parsed.result?.is_error === false,
};

const CASE_PREDICATES = {
  'inquire-underspecified': ['collection_first', 'no_implementation', 'completed'],
  'inquire-fully-specified': ['implementation_happened', 'completed'],
};

// Checked before anything is spent. A case added under evals/ without a predicate set
// here would otherwise run the whole matrix and then throw during grading, after the
// model budget is gone and, in CI, after the run step has already reported success.
for (const c of CFG.cases) {
  if (!CASE_PREDICATES[c]) {
    console.error(`case "${c}" has no predicate set in CASE_PREDICATES -- add one before running it`);
    process.exit(1);
  }
}

function gradeRun(model, armName, arm, caseName, rep) {
  const base = join(RESULTS, model, armName, caseName, `run-${rep}`);
  const parsed = parse(`${base}.jsonl`);
  if (!parsed) return null;

  // The verdict recorded at run time is authoritative; the live working directory is only
  // a fallback, for transcripts written before the sidecar existed and for a local regrade.
  let mutated = null;
  if (existsSync(`${base}.meta.json`)) {
    mutated = JSON.parse(readFileSync(`${base}.meta.json`, 'utf8')).mutated ?? null;
  } else {
    const wd = `${model}-${armName}-${caseName}-${rep}`.replace(/[^\w.-]/g, '_');
    mutated = treeMutated(join(WORK, wd));
  }

  const ctx = { parsed, arm, caseName, cfg: CFG, mutated };
  const scores = {};
  for (const [name, fn] of Object.entries(GRADERS)) scores[name] = fn(ctx);
  // A predicate with nothing to read is not a failing predicate but an unreadable one,
  // and scoring it false would present a missing observation as an observed negative.
  const required = CASE_PREDICATES[caseName].map((k) => scores[k]);
  const composite = required.some((v) => v === null || v === undefined)
    ? null : required.every((v) => v === true);
  return { scores, composite, cost: parsed.result?.total_cost_usd ?? null,
           turns: parsed.result?.num_turns ?? null };
}

function report() {
  const rows = [];
  for (const model of CFG.models) {
    for (const [armName, arm] of Object.entries(CFG.arms)) {
      for (const caseName of CFG.cases) {
        const graded = [];
        for (let rep = 1; rep <= CFG.runs; rep++) {
          const g = gradeRun(model, armName, arm, caseName, rep);
          if (g) graded.push(g);
        }
        if (!graded.length) continue;
        const passes = graded.filter((g) => g.composite === true).length;
        const unreadable = graded.filter((g) => g.composite === null).length;
        const skill = graded.filter((g) => g.scores.skill_fired === true).length;
        rows.push({
          model, arm: armName, case: caseName,
          n: graded.length,
          // pass^k: every repetition passed. tau-bench's reliability reading, where a
          // mean hides the run that failed and one failure out of k is the fact a user
          // meets. An unreadable cell suppresses it rather than scoring zero: there is
          // no k-th observation to require.
          pass_k: unreadable ? '-' : (passes === graded.length ? 1 : 0),
          rate: `${passes}/${graded.length}`,
          integrity: graded.filter((g) => g.scores.treatment_integrity).length,
          // Whether the protocol itself fired where it was available. Without this a
          // protocol arm that loaded the plugin, never invoked it, and produced
          // right-looking behaviour anyway scores a clean pass.
          skill: arm.protocol ? `${skill}/${graded.length}` : 'n/a',
          unreadable,
          cost: graded.reduce((s, g) => s + (g.cost || 0), 0).toFixed(4),
        });
      }
    }
  }
  if (!rows.length) { console.log('No results yet. Run `node harness.mjs run` first.'); return; }

  if (process.argv.includes('--markdown')) {
    const cols = ['model', 'arm', 'case', 'n', 'pass_k', 'rate', 'integrity', 'skill', 'unreadable', 'cost'];
    const line = (cells) => `| ${cells.join(' | ')} |`;
    console.log(line(cols));
    console.log(line(cols.map(() => '---')));
    for (const r of rows) console.log(line(cols.map((c) => String(r[c]))));
    const total = rows.reduce((s, r) => s + Number(r.cost), 0).toFixed(4);
    console.log(`\ntotal cost: $${total}`);
    const failed = rows.filter((r) => r.integrity !== r.n || r.unreadable);
    if (failed.length) {
      console.log('\n**Not readable as evidence** \u2014 treatment integrity failed, or a predicate had nothing to read:');
      console.log(line(cols));
      console.log(line(cols.map(() => '---')));
      for (const r of failed) console.log(line(cols.map((c) => String(r[c]))));
    }
    return;
  }

  console.table(rows);
  const totalCost = rows.reduce((s, r) => s + Number(r.cost), 0);
  console.log(`\ntotal cost: $${totalCost.toFixed(4)}`);
  const bad = rows.filter((r) => r.integrity !== r.n || r.unreadable);
  if (bad.length) {
    console.log('\nNOT READABLE AS EVIDENCE \u2014 treatment integrity failed, or a predicate had nothing to read:');
    console.table(bad);
  }
}

// ---------------------------------------------------------------- main

function teardown() {
  const all = process.argv.includes('--all');
  const purge = process.argv.includes('--purge');
  resetVolatile();
  console.log(`reset volatile state in ${CONFIG_DIR}`);
  if (all || purge) {
    rmSync(CONFIG_DIR, { recursive: true, force: true });
    rmSync(WORK, { recursive: true, force: true });
    console.log(`removed ${CONFIG_DIR} and ${WORK} -- re-run \`setup\` before \`run\``);
  }
  if (purge) {
    // Results are graded evidence, not regenerable state: re-running produces
    // different transcripts, so this discards observations rather than a cache.
    rmSync(RESULTS, { recursive: true, force: true });
    console.log(`removed ${RESULTS} -- the observations are gone, not just derived state`);
  }
}

const cmd = process.argv[2];
if (cmd === 'setup') setup();
else if (cmd === 'run') run();
else if (cmd === 'report') report();
else if (cmd === 'teardown') teardown();
else {
  console.log('usage: node harness.mjs <setup|run|report [--markdown]|teardown [--all|--purge]>');
  process.exit(1);
}
