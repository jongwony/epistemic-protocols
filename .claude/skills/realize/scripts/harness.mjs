#!/usr/bin/env node
// Type-realization harness for epistemic protocol skills.
//
// Runs a selected agent CLI across (model x arm x case x repetition), captures
// its JSONL trace, and grades the protocol's DECLARED CONTRACT from behaviour.
//
// Why the CLI rather than `claude plugin eval`: that subcommand is gated behind
// early access. Everything it would have given us is reachable from the CLI —
// `--plugin-dir` for the treatment, `--output-format stream-json` for the trace,
// `--max-budget-usd` for the ceiling. What we lose is reporting, which is cheap
// to rebuild and lives in `report` below.
//
// Both runners isolate their plugin state. Claude uses an empty
// CLAUDE_CONFIG_DIR plus --plugin-dir on treatment arms. Codex uses one minimal
// CODEX_HOME per treatment, with the local marketplace installed only in the
// protocol home. Ambient plugins would turn a baseline into the treatment by a
// second path, making every comparison unreadable.
//
// Node stdlib only.

import { spawnSync } from 'node:child_process';
import {
  mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, rmSync,
  readdirSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir, tmpdir } from 'node:os';

const HERE = dirname(fileURLToPath(import.meta.url));
const SKILL = resolve(HERE, '..');
// .claude/skills/realize -> .claude/skills -> .claude -> repo root
const REPO = resolve(SKILL, '..', '..', '..');
const cmd = process.argv[2];
const TARGET = process.argv[3] || process.env.REALIZE_TARGET;
const ROOT_CFG = JSON.parse(readFileSync(join(SKILL, 'harness.config.json'), 'utf8'));
if (!TARGET || !/^[a-z0-9][a-z0-9-]*$/.test(TARGET)) {
  console.error('realize target required: node harness.mjs <setup|run|report|teardown> <skill>');
  process.exit(1);
}
if (!ROOT_CFG.targets?.[TARGET]) {
  console.error(`unknown realize target ${JSON.stringify(TARGET)}; registered targets: ${Object.keys(ROOT_CFG.targets || {}).join(', ') || '(none)'}`);
  process.exit(1);
}
const CFG = {
  ...ROOT_CFG,
  ...ROOT_CFG.targets[TARGET],
  codex: ROOT_CFG.codex ? { ...ROOT_CFG.codex } : null,
};
delete CFG.targets;
const RUNNER = process.env.REALIZE_RUNNER || CFG.runner || 'claude';
if (!['claude', 'codex'].includes(RUNNER)) {
  console.error(`REALIZE_RUNNER: expected "claude" or "codex", got ${JSON.stringify(RUNNER)}`);
  process.exit(1);
}
if (RUNNER === 'codex') {
  if (!CFG.codex) { console.error('missing codex configuration'); process.exit(1); }
  CFG.models = CFG.codex.models;
}

// Environment overrides exist for one caller: a workflow that is dispatched by hand
// with a narrower matrix than the file describes. Editing the committed config from
// CI would make the run unreproducible from the checkout it claims to test.
const csv = (v) => v.split(',').map((x) => x.trim()).filter(Boolean);
if (process.env.REALIZE_MODELS) CFG.models = csv(process.env.REALIZE_MODELS);
if (process.env.REALIZE_REASONING_EFFORT) {
  if (RUNNER !== 'codex') {
    console.error('REALIZE_REASONING_EFFORT applies only to the codex runner');
    process.exit(1);
  }
  CFG.codex.reasoningEffort = process.env.REALIZE_REASONING_EFFORT;
}
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
if (process.env.REALIZE_TIMEOUT_SECONDS) {
  if (RUNNER !== 'codex') {
    console.error('REALIZE_TIMEOUT_SECONDS applies only to the codex runner');
    process.exit(1);
  }
  CFG.codex.timeoutSeconds = num('REALIZE_TIMEOUT_SECONDS', process.env.REALIZE_TIMEOUT_SECONDS);
}
if (process.env.REALIZE_CASES) CFG.cases = csv(process.env.REALIZE_CASES);
const requestedArms = process.env.REALIZE_ARMS ? new Set(csv(process.env.REALIZE_ARMS)) : null;
if (process.env.REALIZE_ARMS) {
  CFG.arms = Object.fromEntries(Object.entries(CFG.arms).filter(([k]) => requestedArms.has(k)));
}
if (RUNNER === 'codex') {
  const styleArms = Object.entries(CFG.arms).filter(([, arm]) => arm.style).map(([name]) => name);
  if (requestedArms && styleArms.length) {
    console.error(`codex runner has no output-style treatment; unsupported arms: ${styleArms.join(', ')}`);
    process.exit(1);
  }
  CFG.arms = Object.fromEntries(Object.entries(CFG.arms).filter(([, arm]) => !arm.style));
}
for (const [key, list] of [['models', CFG.models], ['cases', CFG.cases]]) {
  if (!list.length) { console.error(`no ${key} selected`); process.exit(1); }
}
if (!Object.keys(CFG.arms).length) { console.error('no arms selected'); process.exit(1); }
const CONFIG_DIR = join(CFG.configDir.replace(/^~/, homedir()), TARGET);
const codexStateRaw = (process.env.REALIZE_CODEX_STATE_DIR
  || CFG.codex?.stateDir || join(SKILL, '.codex')).replace(/^~/, homedir());
const codexStateBase = codexStateRaw.startsWith('/')
  ? resolve(codexStateRaw)
  : resolve(REPO, codexStateRaw);
const CODEX_STATE_DIR = join(codexStateBase, TARGET);
// resetVolatile runs before every cell and `teardown --all` removes this tree entirely, so
// a configDir one character from the real one would delete the user's own history. The
// value is hand-edited JSON; refuse outright the paths where a typo is unrecoverable.
for (const forbidden of [homedir(), join(homedir(), '.claude'), '/']) {
  if (resolve(CONFIG_DIR) === resolve(forbidden)) {
    console.error(`configDir must not be ${forbidden} -- this harness deletes what it points at`);
    process.exit(1);
  }
}
for (const forbidden of [homedir(), join(homedir(), '.codex'), '/', REPO, SKILL]) {
  if (resolve(CODEX_STATE_DIR) === resolve(forbidden)) {
    console.error(`codex.stateDir must not be ${forbidden} -- this harness deletes what it points at`);
    process.exit(1);
  }
}
const EVALS = join(SKILL, 'evals');
const RESULTS = process.env.REALIZE_RESULTS_DIR
  ? resolve(process.env.REALIZE_RESULTS_DIR)
  : join(SKILL, 'results', RUNNER, TARGET);
const repoKey = createHash('sha256').update(REPO).digest('hex').slice(0, 12);
const WORK = process.env.REALIZE_WORK_DIR
  ? resolve(process.env.REALIZE_WORK_DIR)
  : (RUNNER === 'codex'
      ? join(tmpdir(), `epistemic-realize-${repoKey}`, TARGET)
      : join(SKILL, '.work', RUNNER, TARGET));
for (const [name, target] of [['REALIZE_RESULTS_DIR', RESULTS], ['REALIZE_WORK_DIR', WORK]]) {
  for (const forbidden of [homedir(), '/', REPO, SKILL, tmpdir()]) {
    if (resolve(target) === resolve(forbidden)) {
      console.error(`${name} must not be ${forbidden} -- teardown can delete what it points at`);
      process.exit(1);
    }
  }
}

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
const PLUGIN_MANIFEST = JSON.parse(readFileSync(
  join(expand(CFG.pluginDir), '.codex-plugin', 'plugin.json'), 'utf8'));
const PLUGIN_NAME = PLUGIN_MANIFEST.name;
const PLUGIN_VERSION = PLUGIN_MANIFEST.version;
const MARKETPLACE_NAME = JSON.parse(readFileSync(
  join(REPO, '.claude-plugin', 'marketplace.json'), 'utf8')).name;
const PROTOCOL_SKILL = join(expand(CFG.pluginDir), 'skills', CFG.protocolSkill, 'SKILL.md');
const INVOCATION = CFG.invocation?.[RUNNER];
if (!existsSync(PROTOCOL_SKILL)) {
  console.error(`target ${JSON.stringify(TARGET)} skill not found: ${PROTOCOL_SKILL}`);
  process.exit(1);
}
if (!INVOCATION) {
  console.error(`target ${JSON.stringify(TARGET)} has no ${RUNNER} invocation`);
  process.exit(1);
}

function treatmentId(arm) {
  const h = createHash('sha256').update(`${TARGET}\n${RUNNER}\n${JSON.stringify(arm)}\n`);
  h.update(`${INVOCATION || ''}\n`);
  h.update(RUNNER === 'codex'
    ? JSON.stringify({
        reasoningEffort: CFG.codex.reasoningEffort,
        timeoutSeconds: CFG.codex.timeoutSeconds,
      })
    : JSON.stringify({
        maxBudgetUsd: CFG.maxBudgetUsd,
        permissionMode: CFG.permissionMode,
        allowedTools: CFG.allowedTools,
      }));
  if (arm.protocol) h.update(readFileSync(PROTOCOL_SKILL));
  if (arm.style) h.update(readFileSync(expand(CFG.styleSource)));
  return h.digest('hex').slice(0, 12);
}

// ---------------------------------------------------------------- isolation

// Nothing in the config dir is irreplaceable: authentication arrives through
// CLAUDE_CODE_OAUTH_TOKEN in the environment, and the init event confirms it
// (`apiKeySource: "none"`), so there is no credential here to protect. What the
// directory does hold is per-run residue, and residue is the state-contamination
// path -- workdir names are stable across invocations, so a re-run lands on the
// same project slug and can read what the previous run left behind.
const VOLATILE = ['projects', 'sessions', 'session-env', 'shell-snapshots', 'backups'];

function resetVolatile() {
  if (RUNNER === 'codex') return; // --ephemeral plus a fresh workdir carries no session state across cells.
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

function setupClaude() {
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

function codexHome(arm) {
  return join(CODEX_STATE_DIR, arm.protocol ? 'protocol' : 'bare');
}

function codexEnv(home, { credential = false } = {}) {
  const env = { ...process.env, CODEX_HOME: home };
  delete env.OPENAI_API_KEY;
  delete env.CODEX_ACCESS_TOKEN;
  if (!credential) delete env.CODEX_API_KEY;
  return env;
}

function runSetupCommand(args, home) {
  const r = spawnSync('codex', args, {
    cwd: REPO,
    encoding: 'utf8',
    env: codexEnv(home),
  });
  if (r.status !== 0) {
    throw new Error(`codex ${args.join(' ')} failed: ${(r.stderr || r.stdout || '').trim()}`);
  }
}

function setupCodex() {
  rmSync(CODEX_STATE_DIR, { recursive: true, force: true });
  mkdirSync(CODEX_STATE_DIR, { recursive: true });

  const homes = new Map();
  for (const arm of Object.values(CFG.arms)) homes.set(codexHome(arm), arm);
  for (const home of homes.keys()) {
    mkdirSync(home, { recursive: true });
  }

  const protocolArm = Object.values(CFG.arms).find((arm) => arm.protocol);
  if (protocolArm) {
    const home = codexHome(protocolArm);
    runSetupCommand(['plugin', 'marketplace', 'add', REPO, '--json'], home);
    runSetupCommand(['plugin', 'add', `${PLUGIN_NAME}@${MARKETPLACE_NAME}`, '--json'], home);
  }

  console.log(`runner      : codex`);
  console.log(`target      : ${TARGET}`);
  console.log(`state homes : ${[...homes.keys()].join(', ')}`);
  console.log(`model       : ${CFG.models.join(', ')} (${CFG.codex.reasoningEffort})`);
  console.log('setup consumed and stored no credential; run requires process-scoped CODEX_API_KEY');
}

function setup() {
  if (RUNNER === 'codex') setupCodex();
  else setupClaude();
}

// ---------------------------------------------------------------- run

function promptBody(caseName, arm) {
  const raw = readFileSync(join(EVALS, caseName, 'prompt.md'), 'utf8');
  // Frontmatter is for the plugin-eval schema; the CLI takes the body only.
  const task = raw.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
  // Naming the protocol belongs to the treatment, not to the task. A prompt that
  // names the command hands an arm without the plugin a second problem -- the
  // command is missing -- and the arm then gates on the missing tool rather than
  // on the task, which is not the behaviour under comparison.
  return arm.protocol && INVOCATION ? `${task}\n\n${INVOCATION}` : task;
}

// A protocol whose obligation fires only AFTER the user answers is unreachable by a
// single-turn run: the observation ends at the first Stop, and there is nothing to
// adjudicate against until a turn arrives. `followup.md` supplies that turn as scripted
// text so the stretch past the gate becomes observable. It is a scripted answer, not a
// user: what it buys is reach, never the judgment of a real one.
function followupBodies(caseName) {
  const bodies = [];
  for (const name of ['followup.md', 'followup-2.md', 'followup-3.md']) {
    const file = join(EVALS, caseName, name);
    if (!existsSync(file)) break;   // contiguous from the first; a gap ends the sequence
    const raw = readFileSync(file, 'utf8');
    const body = raw.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
    if (!body) throw new Error(`${caseName}/${name} is empty; a scripted turn must carry text`);
    bodies.push(body);
  }
  return bodies;
}

function scaffoldScript(caseName) {
  const caseFile = join(EVALS, caseName, 'case.yaml');
  if (existsSync(caseFile)) {
    const declared = /^\s*scaffold_script:\s*(\S+)\s*$/m.exec(readFileSync(caseFile, 'utf8'));
    // join normalises the leading `../`, so the value stays written relative to the case
    // directory it is declared in -- which is where a reader of case.yaml expects it to be.
    if (declared) return join(EVALS, caseName, declared[1]);
  }
  return join(EVALS, 'scaffold.sh');
}

function scaffold(dir, caseName) {
  const script = scaffoldScript(caseName);
  if (!existsSync(script)) {
    throw new Error(`${caseName} declares a scaffold script that does not exist: ${script}`);
  }
  mkdirSync(dir, { recursive: true });
  const r = spawnSync('bash', [script], { cwd: dir, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`scaffold failed (${script}): ${r.stderr}`);
}

function codexTreatmentIntegrity(arm) {
  const r = spawnSync('codex', ['plugin', 'list', '--json'], {
    cwd: REPO,
    encoding: 'utf8',
    env: codexEnv(codexHome(arm)),
  });
  if (r.status !== 0) return null;
  try {
    const listed = JSON.parse(r.stdout);
    const present = (listed.installed || []).some(
      (plugin) => plugin.name === PLUGIN_NAME && plugin.enabled === true);
    if (present !== !!arm.protocol) return false;
    if (!arm.protocol) return true;
    const installedSkill = join(
      codexHome(arm), 'plugins', 'cache', MARKETPLACE_NAME, PLUGIN_NAME,
      PLUGIN_VERSION, 'skills', CFG.protocolSkill, 'SKILL.md');
    if (!existsSync(installedSkill)) return false;
    return createHash('sha256').update(readFileSync(installedSkill)).digest('hex')
      === createHash('sha256').update(readFileSync(PROTOCOL_SKILL)).digest('hex');
  } catch {
    return null;
  }
}

function runOne({ model, armName, arm, caseName, rep }) {
  const treatment = treatmentId(arm);
  const outDir = join(RESULTS, model, armName, caseName, treatment);
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, `run-${rep}.jsonl`);
  if (existsSync(outFile)) return { skipped: true, outFile };

  resetVolatile();
  const treatmentIntegrity = RUNNER === 'codex' ? codexTreatmentIntegrity(arm) : null;
  if (RUNNER === 'codex' && treatmentIntegrity !== true) {
    return { skipped: false, launchFailed: true, outFile, exit: null,
             reason: 'isolated CODEX_HOME does not match the declared plugin treatment; re-run setup' };
  }

  const wd = join(WORK, `${model}-${armName}-${caseName}-${treatment}-${rep}`.replace(/[^\w.-]/g, '_'));
  if (existsSync(wd)) rmSync(wd, { recursive: true, force: true });
  scaffold(wd, caseName);

  let command;
  let args;
  let env;
  let timeout;
  const followups = followupBodies(caseName);
  if (followups.length && RUNNER === 'codex') {
    return { skipped: false, launchFailed: true, outFile, exit: null,
             reason: `${caseName} scripts ${followups.length} follow-up turn(s); the Codex path has no resume wired, and running it single-turn would report a differently-scoped observation under the same cell` };
  }

  if (RUNNER === 'codex') {
    command = 'codex';
    args = [
      '-a', 'never', 'exec', '--ephemeral', '--strict-config',
      '--model', model,
      '-c', `model_reasoning_effort=${JSON.stringify(CFG.codex.reasoningEffort)}`,
      '--sandbox', 'workspace-write',
      '--cd', wd,
      '--skip-git-repo-check', '--json',
      promptBody(caseName, arm),
    ];
    env = codexEnv(codexHome(arm), { credential: true });
    timeout = CFG.codex.timeoutSeconds * 1000;
  } else {
    command = 'claude';
    args = [
      '-p', '--verbose',
      // Persistence is what --resume reaches. Kept off wherever nothing resumes, so a
      // single-turn cell leaves the same volatile state it always did.
      ...(followups.length ? [] : ['--no-session-persistence']),
      '--output-format', 'stream-json',
      '--model', model,
      '--max-budget-usd', String(CFG.maxBudgetUsd),
      '--permission-mode', CFG.permissionMode,
      '--allowed-tools', CFG.allowedTools.join(','),
      '--settings', join(SKILL, 'arms', `${armName.replace('+', '-')}.json`),
    ];
    if (arm.protocol) args.push('--plugin-dir', expand(CFG.pluginDir));
    args.push(promptBody(caseName, arm));
    env = { ...process.env, CLAUDE_CONFIG_DIR: CONFIG_DIR };
  }

  const r = spawnSync(command, args, {
    cwd: wd,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    env,
    timeout,
  });
  if (r.stderr) writeFileSync(outFile.replace(/\.jsonl$/, '.err'), r.stderr);

  // Existence of the transcript IS the cache, so an empty one written here would freeze
  // the cell: every later invocation reports `cached` and grading reads the emptiness as
  // the protocol failing. Require evidence that claude actually started (init) and
  // actually reported (result). A budget-exhausted or errored turn has both and is a real
  // observation; a missing binary, unusable authentication, timeout, or overrun buffer
  // has neither runner's complete start/end pair.
  const out = r.stdout || '';
  const ran = r.error == null && (RUNNER === 'codex'
    ? r.status === 0 && out.includes('"type":"thread.started"') && out.includes('"type":"turn.completed"')
    : out.includes('"subtype":"init"') && out.includes('"type":"result"'));
  if (!ran) {
    writeFileSync(outFile.replace(/\.jsonl$/, '.failed.jsonl'), out);
    return { skipped: false, launchFailed: true, outFile, exit: r.status,
             reason: r.error ? r.error.message : `no complete ${RUNNER} start/end event pair in the stream` };
  }

  let stream = out;
  if (followups.length) {
    const initLine = out.split('\n').find((l) => l.includes('"subtype":"init"'));
    let sessionId = null;
    try { sessionId = JSON.parse(initLine).session_id || null; } catch { sessionId = null; }
    if (!sessionId) {
      writeFileSync(outFile.replace(/\.jsonl$/, '.failed.jsonl'), stream);
      return { skipped: false, launchFailed: true, outFile, exit: r.status,
               reason: 'first turn carried no session_id on its init event, so no scripted turn can reach it' };
    }
    for (const [i, body] of followups.entries()) {
      const followArgs = args.slice(0, -1).concat(['--resume', sessionId, body]);
      const fr = spawnSync(command, followArgs, {
        cwd: wd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, env, timeout,
      });
      const fout = fr.stdout || '';
      if (fr.stderr) writeFileSync(outFile.replace(/\.jsonl$/, `.turn${i + 2}.err`), fr.stderr);
      const fran = fr.error == null
        && fout.includes('"subtype":"init"') && fout.includes('"type":"result"');
      if (!fran) {
        writeFileSync(outFile.replace(/\.jsonl$/, '.failed.jsonl'), stream + fout);
        return { skipped: false, launchFailed: true, outFile, exit: fr.status,
                 reason: fr.error ? fr.error.message
                   : `scripted turn ${i + 2} produced no complete claude start/end event pair` };
      }
      stream += fout;
    }
  }

  writeFileSync(outFile, stream);
  // Whether the run changed anything is read now, while the working directory still
  // exists. Deferring it to grading ties the verdict to a directory that is gitignored,
  // never uploaded by CI, and gone once teardown has run -- so a later re-read of the
  // table would score every tree predicate false and present that as an observation.
  writeFileSync(outFile.replace(/\.jsonl$/, '.meta.json'),
    JSON.stringify({
      runner: RUNNER, model, treatment, treatmentIntegrity,
      exit: r.status, mutated: treeMutated(wd, caseName),
    }, null, 2) + '\n');
  // The working directory is kept: a grader that wants to inspect what the run
  // actually wrote needs the files, and a failed run is worth reading by hand.
  return { skipped: false, outFile, exit: r.status };
}

function run() {
  if (RUNNER === 'codex' && !process.env.CODEX_API_KEY) {
    console.error('Codex run requires CODEX_API_KEY; setup never reads or stores a credential');
    process.exitCode = 1;
    return;
  }
  const failures = [];
  for (const model of CFG.models) {
    for (const [armName, arm] of Object.entries(CFG.arms)) {
      for (const caseName of CFG.cases) {
        for (let rep = 1; rep <= CFG.runs; rep++) {
          process.stdout.write(`${RUNNER} | ${model} | ${armName} | ${caseName} | ${rep}/${CFG.runs} ... `);
          try {
            const { skipped, exit, launchFailed, reason } = runOne({ model, armName, arm, caseName, rep });
            if (launchFailed) {
              failures.push(`${model}/${armName}/${caseName}/${rep}: ${reason}`);
              console.log(`LAUNCH FAILED (${reason}) -- not cached, not graded`);
            }
            else console.log(skipped ? 'cached' : `done (exit ${exit})`);
          } catch (e) {
            failures.push(`${model}/${armName}/${caseName}/${rep}: ${e.message}`);
            console.log(`FAILED: ${e.message}`);
          }
        }
      }
    }
  }
  if (failures.length) {
    console.error(`\n${failures.length} requested cell(s) did not produce a gradeable run:`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  }
}

// ---------------------------------------------------------------- grade

function readEvents(file) {
  if (!existsSync(file)) return null;
  return readFileSync(file, 'utf8').split('\n').filter(Boolean)
    .map((l) => { try { return JSON.parse(l); } catch { return null; } })
    .filter(Boolean);
}

function parseClaude(events) {
  const init = events.find((e) => e.type === 'system' && e.subtype === 'init');
  // LAST, not first: a multi-turn cell concatenates one result per turn, and the run's
  // outcome is the final one. Identical to `find` on a single-turn stream.
  const results = events.filter((e) => e.type === 'result');
  const result = results[results.length - 1];
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

function parseCodex(events) {
  const items = events.filter((e) => e.type === 'item.completed').map((e) => e.item).filter(Boolean);
  const commands = items.filter((item) => item.type === 'command_execution');
  const skillNeedle = `/skills/${CFG.protocolSkill}/SKILL.md`;
  const skillInvocations = commands
    .filter((item) => item.command?.includes('/plugins/cache/') && item.command.includes(skillNeedle))
    .map(() => CFG.protocolSkill);
  // Reading the skill contract is treatment integrity, not context collection for
  // the user's task. Require a separate read-like command against the fixture.
  const readLike = /\b(?:rg|sed|cat|head|tail|find|pwd)\b|\bgit\s+(?:status|log|show|diff)\b/;
  const toolUses = commands
    .filter((item) => !item.command?.includes('/plugins/cache/') && readLike.test(item.command || ''))
    .map(() => 'Read');
  const messages = items.filter((item) => item.type === 'agent_message').map((item) => item.text).filter(Boolean);
  const completed = events.find((e) => e.type === 'turn.completed');
  return {
    init: { plugins: skillInvocations.length ? [{ name: PLUGIN_NAME }] : [], output_style: 'default' },
    result: completed ? { is_error: false, total_cost_usd: null, num_turns: 1 } : null,
    usage: completed?.usage || null,
    toolUses,
    skillInvocations,
    lastMessage: messages[messages.length - 1] || '',
  };
}

function parse(file) {
  const events = readEvents(file);
  if (!events) return null;
  return RUNNER === 'codex' ? parseCodex(events) : parseClaude(events);
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

const REFERENCE = new Map();
function referenceDigest(caseName) {
  // Keyed by the script, not the case: two cases sharing one fixture -- which the pairing
  // discipline requires of every target -- share the reference and build it once.
  const script = scaffoldScript(caseName);
  if (REFERENCE.has(script)) return REFERENCE.get(script);
  const tmp = join(WORK, `reference-tree-${basename(script, '.sh')}`);
  rmSync(tmp, { recursive: true, force: true });
  scaffold(tmp, caseName);
  const digest = treeDigest(tmp);
  rmSync(tmp, { recursive: true, force: true });
  REFERENCE.set(script, digest);
  return digest;
}

// Whether the run changed the working tree at all, against the scaffold it started
// from. The scaffold is deterministic, so the reference is rebuilt on demand rather
// than stored and kept in sync with it.
function treeMutated(workdir, caseName) {
  if (!existsSync(workdir)) return null;
  return treeDigest(workdir) !== referenceDigest(caseName);
}

// Deterministic graders. Each returns true / false / null (not applicable).
// These read behaviour, not wording: the protocols are required to render in the
// user's everyday language, so a lexical check would be testing the renderer.
const GRADERS = {
  // Both dimensions, because either fails silently. The sham arm's entire treatment
  // arrives through --settings, which does nothing unless setup() copied the style file
  // into the config dir; run without setup and the sham quietly becomes a second
  // baseline, leaving the whole sham-control argument resting on two identical arms.
  treatment_integrity: ({ parsed, arm, treatmentIntegrity }) => {
    if (RUNNER === 'codex') return treatmentIntegrity;
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
  skill_fired: ({ parsed, arm, cfg }) => {
    if (!arm.protocol) return null;
    if (RUNNER === 'codex') return null; // Codex JSONL exposes no skill-invocation event.
    return parsed.skillInvocations.some(
      (s) => s === cfg.protocolSkill || s.endsWith(`:${cfg.protocolSkill}`));
  },
  // Phase 2 is declared present-and-stop; the unchanged tree is this case's witness
  // that Stop occurred. The bytes are not inspected for artifact quality.
  // Runs write through Bash as readily as through Write, so a predicate keyed on
  // tool identity misses the writes it exists to catch — and misses them in every
  // arm alike, which makes it look stable while measuring nothing.
  stop_observed: ({ mutated }) => mutated === false,
  // Phase 0 declares relay-and-proceed; mutation witnesses that this implementation
  // prospect crossed Proceed. Correctness and completeness of the change are out of scope.
  proceed_observed: ({ mutated }) => mutated === true,
  // A read occurred somewhere in the turn. This does not establish its order relative
  // to inquiry; that semantic ordering remains a transcript-review item.
  collection_observed: ({ parsed }) =>
    parsed.toolUses.some((t) => t === 'Read' || t === 'Grep' || t === 'Glob'),
  completed: ({ parsed }) => parsed.result?.is_error === false,
};

const CASE_PREDICATES = {
  'inquire-underspecified': ['collection_observed', 'stop_observed', 'completed'],
  'inquire-fully-specified': ['proceed_observed', 'completed'],
};

const CASE_MANUAL_REVIEWS = {
  'inquire-underspecified': [
    'collection-precedes-inquiry', 'cheap-evidence-not-asked',
    'classification-shown', 'option-coproduct',
  ],
  'inquire-fully-specified': [
    'no-fabricated-uncertainty', 'no-gate', 'sufficiency-stated',
  ],
};

// Checked before anything is spent. A case added under evals/ without a predicate set
// here would otherwise run the whole matrix and then throw during grading, after the
// model budget is gone and, in CI, after the run step has already reported success.
for (const c of CFG.cases) {
  if (!CASE_PREDICATES[c]) {
    console.error(`case "${c}" has no predicate set in CASE_PREDICATES -- add one before running it`);
    process.exit(1);
  }
  for (const predicate of CASE_PREDICATES[c].filter((name) => name !== 'completed')) {
    const grader = predicate.replaceAll('_', '-');
    const graderPath = join(EVALS, c, 'graders', `${grader}.md`);
    if (!existsSync(graderPath)) {
      console.error(`automatic grader for case "${c}" not found: ${graderPath}`);
      process.exit(1);
    }
  }
  if (!CASE_MANUAL_REVIEWS[c]) {
    console.error(`case "${c}" has no manual-review declaration in CASE_MANUAL_REVIEWS`);
    process.exit(1);
  }
  for (const grader of CASE_MANUAL_REVIEWS[c]) {
    const graderPath = join(EVALS, c, 'graders', `${grader}.md`);
    if (!existsSync(graderPath)) {
      console.error(`manual grader for case "${c}" not found: ${graderPath}`);
      process.exit(1);
    }
  }
}

function gradeRun(model, armName, arm, caseName, rep) {
  const treatment = treatmentId(arm);
  const base = join(RESULTS, model, armName, caseName, treatment, `run-${rep}`);
  const parsed = parse(`${base}.jsonl`);
  if (!parsed) return null;

  // The verdict recorded at run time is authoritative; the live working directory is only
  // a fallback, for transcripts written before the sidecar existed and for a local regrade.
  let mutated = null;
  let treatmentIntegrity = null;
  if (existsSync(`${base}.meta.json`)) {
    const meta = JSON.parse(readFileSync(`${base}.meta.json`, 'utf8'));
    mutated = meta.mutated ?? null;
    treatmentIntegrity = meta.treatmentIntegrity ?? null;
  } else {
    const wd = `${model}-${armName}-${caseName}-${treatment}-${rep}`.replace(/[^\w.-]/g, '_');
    mutated = treeMutated(join(WORK, wd));
  }

  const ctx = { parsed, arm, caseName, cfg: CFG, mutated, treatmentIntegrity };
  const scores = {};
  for (const [name, fn] of Object.entries(GRADERS)) scores[name] = fn(ctx);
  // A predicate with nothing to read is not a failing predicate but an unreadable one,
  // and scoring it false would present a missing observation as an observed negative.
  const required = CASE_PREDICATES[caseName].map((k) => scores[k]);
  const composite = required.some((v) => v === null || v === undefined)
    ? null : required.every((v) => v === true);
  const usage = parsed.usage;
  const tokens = usage
    ? (usage.input_tokens || 0) + (usage.output_tokens || 0)
    : null;
  return { scores, composite, cost: parsed.result?.total_cost_usd ?? null,
           tokens, turns: parsed.result?.num_turns ?? null };
}

function report() {
  const rows = [];
  const missing = [];
  for (const model of CFG.models) {
    for (const [armName, arm] of Object.entries(CFG.arms)) {
      for (const caseName of CFG.cases) {
        const graded = [];
        for (let rep = 1; rep <= CFG.runs; rep++) {
          const g = gradeRun(model, armName, arm, caseName, rep);
          if (g) graded.push(g);
          else missing.push(`${model}/${armName}/${caseName}/${rep}`);
        }
        if (!graded.length) continue;
        const passes = graded.filter((g) => g.composite === true).length;
        const unreadable = graded.filter((g) => g.composite === null).length;
        const skill = graded.filter((g) => g.scores.skill_fired === true).length;
        const costs = graded.map((g) => g.cost).filter((v) => typeof v === 'number');
        const tokens = graded.map((g) => g.tokens).filter((v) => typeof v === 'number');
        rows.push({
          runner: RUNNER, model, arm: armName, case: caseName,
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
          skill: arm.protocol
            ? (RUNNER === 'codex' ? 'trace-unavailable' : `${skill}/${graded.length}`)
            : 'n/a',
          manual: CASE_MANUAL_REVIEWS[caseName]?.length || 0,
          unreadable,
          tokens: tokens.length ? tokens.reduce((s, v) => s + v, 0) : '-',
          cost: costs.length ? costs.reduce((s, v) => s + v, 0).toFixed(4) : '-',
        });
      }
    }
  }
  if (!rows.length) {
    console.log(`No results for target ${TARGET}. Run \`node harness.mjs run ${TARGET}\` first.`);
    if (missing.length) {
      console.log('Missing requested cells:');
      for (const cell of missing) console.log(`- ${cell}`);
    }
    process.exitCode = 1;
    return;
  }

  const evidenceFailures = rows.filter((r) => r.integrity !== r.n || r.unreadable);
  const manualSummary = [...new Set(rows.map((r) => r.case))]
    .map((caseName) => `${caseName}: ${(CASE_MANUAL_REVIEWS[caseName] || []).join(', ') || 'none'}`);

  if (process.argv.includes('--markdown')) {
    const cols = ['runner', 'model', 'arm', 'case', 'n', 'pass_k', 'rate', 'integrity', 'skill', 'manual', 'unreadable', 'tokens', 'cost'];
    const line = (cells) => `| ${cells.join(' | ')} |`;
    console.log(line(cols));
    console.log(line(cols.map(() => '---')));
    for (const r of rows) console.log(line(cols.map((c) => String(r[c]))));
    const numericCosts = rows.map((r) => Number(r.cost)).filter(Number.isFinite);
    if (numericCosts.length) console.log(`\ntotal cost: $${numericCosts.reduce((s, v) => s + v, 0).toFixed(4)}`);
    console.log('\n`pass_k` contains deterministic transition predicates only. Manual transcript review is still required for:');
    for (const item of manualSummary) console.log(`- ${item}`);
    if (evidenceFailures.length) {
      console.log('\n**Not readable as evidence** \u2014 treatment integrity failed, or a predicate had nothing to read:');
      console.log(line(cols));
      console.log(line(cols.map(() => '---')));
      for (const r of evidenceFailures) console.log(line(cols.map((c) => String(r[c]))));
    }
    if (missing.length) {
      console.log('\n**Missing requested cells:**');
      for (const cell of missing) console.log(`- ${cell}`);
    }
    if (evidenceFailures.length || missing.length) process.exitCode = 1;
    return;
  }

  console.table(rows);
  const numericCosts = rows.map((r) => Number(r.cost)).filter(Number.isFinite);
  if (numericCosts.length) console.log(`\ntotal cost: $${numericCosts.reduce((s, v) => s + v, 0).toFixed(4)}`);
  console.log('\npass_k contains deterministic transition predicates only. Manual transcript review is still required for:');
  for (const item of manualSummary) console.log(`- ${item}`);
  if (evidenceFailures.length) {
    console.log('\nNOT READABLE AS EVIDENCE \u2014 treatment integrity failed, or a predicate had nothing to read:');
    console.table(evidenceFailures);
  }
  if (missing.length) {
    console.log('\nMISSING REQUESTED CELLS:');
    for (const cell of missing) console.log(`- ${cell}`);
  }
  if (evidenceFailures.length || missing.length) process.exitCode = 1;
}

// ---------------------------------------------------------------- main

function teardown() {
  const all = process.argv.includes('--all');
  const purge = process.argv.includes('--purge');
  resetVolatile();
  if (RUNNER === 'claude') console.log(`reset volatile state in ${CONFIG_DIR}`);
  else console.log('codex runs are ephemeral; no session rollout state to reset');
  if (all || purge) {
    if (RUNNER === 'codex') rmSync(CODEX_STATE_DIR, { recursive: true, force: true });
    else rmSync(CONFIG_DIR, { recursive: true, force: true });
    rmSync(WORK, { recursive: true, force: true });
    const state = RUNNER === 'codex' ? CODEX_STATE_DIR : CONFIG_DIR;
    console.log(`removed ${state} and ${WORK} -- re-run \`setup\` before \`run\``);
  }
  if (purge) {
    // Results are graded evidence, not regenerable state: re-running produces
    // different transcripts, so this discards observations rather than a cache.
    rmSync(RESULTS, { recursive: true, force: true });
    console.log(`removed ${RESULTS} -- the observations are gone, not just derived state`);
  }
}

if (cmd === 'setup') setup();
else if (cmd === 'run') run();
else if (cmd === 'report') report();
else if (cmd === 'teardown') teardown();
else {
  console.log('usage: node harness.mjs <setup|run|report|teardown> <skill> [--markdown|--all|--purge]');
  process.exit(1);
}
