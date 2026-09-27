#!/usr/bin/env node
// The outcome eval's runner: plan a paired matrix, set up isolation, drive one subject turn at a
// time, snapshot and score, and aggregate. The user side of each dialogue is played by a person
// (or an agent) applying the case's oracle; this script sends what they compose and records
// everything else. Node standard library only; see ../SKILL.md and ../references/runbook.md.
//
//   node outcome.mjs plan --runner claude|codex --model M [--effort E] [--case C] [--variants v,..]
//                         [--reps N] [--arms bare,protocol] [--budget USD] [--timeout S]
//                         [--codex-auth api-key|login] [--run NAME] [--dry-run]
//   node outcome.mjs setup <run>
//   node outcome.mjs turn <run> <cell> --open | --go | --phase-b | --reply <file>
//   node outcome.mjs snap <run> <cell> A|final
//   node outcome.mjs note <run> <cell>
//   node outcome.mjs status <run>
//   node outcome.mjs reset <run> <cell>
//   node outcome.mjs report <run> [<run> ...] [--out <dir>]
//   node outcome.mjs release-login <run>
//   node outcome.mjs teardown <run>

import { spawnSync } from 'node:child_process';
import {
  copyFileSync, cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readdirSync, readFileSync,
  readlinkSync, renameSync, rmSync, statSync, symlinkSync, unlinkSync, writeFileSync,
} from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  auditPaths, buildRow, cellList, childEnv, classifyReplies, composeOpen, composePhaseB, diffTrees,
  evaluateFalsifiers, groupMeans, guardrails, loadChecklist, parseArgs, parseClaudeTurn,
  parseCodexTurn, renderReport, replyItemsTemplate, sha256, snapshotKeeps, stripFrontmatter,
  summarizeForms, treeDigest, validateNotes, validatePlan,
} from './lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SKILL = resolve(HERE, '..');
const REPO = resolve(SKILL, '..', '..', '..');
const CASES = join(SKILL, 'cases');
const TURN_CLAUDE = join(HERE, 'turn-claude.sh');
const repoKey = sha256(REPO).slice(0, 12);
const RESULTS = resolve(process.env.OUTCOME_RESULTS_DIR || join(SKILL, 'results'));
const STATE = resolve(process.env.OUTCOME_STATE_DIR || join(tmpdir(), `epistemic-outcome-${repoKey}`));
const SCORER_VENV = join(STATE, 'scorer-venv');
const SCORER_PY = join(SCORER_VENV, 'bin', 'python');

// Teardown and reset delete under these roots; refuse the paths where a typo is unrecoverable.
for (const [name, dir] of [['OUTCOME_RESULTS_DIR', RESULTS], ['OUTCOME_STATE_DIR', STATE]]) {
  for (const forbidden of [homedir(), '/', REPO, SKILL, tmpdir()]) {
    if (dir === resolve(forbidden)) die(`${name} must not be ${forbidden}`);
  }
}

function die(msg, code = 1) {
  process.stderr.write(`outcome: ${msg}\n`);
  process.exit(code);
}
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const writeJson = (p, v) => writeFileSync(p, `${JSON.stringify(v, null, 1)}\n`);
const onPath = (bin) => spawnSync('sh', ['-c', `command -v ${bin}`], { encoding: 'utf8' }).status === 0;

// ------------------------------------------------------------------ case

function caseNames() {
  return existsSync(CASES) ? readdirSync(CASES).filter((d) => existsSync(join(CASES, d, 'case.json'))) : [];
}

function loadCase(name) {
  const dir = join(CASES, name);
  const spec = readJson(join(dir, 'case.json'));
  const realize = readJson(join(REPO, spec.realizeConfig));
  const target = realize.targets?.[spec.realizeTarget];
  if (!target) die(`case ${name}: /realize has no target ${spec.realizeTarget}`);
  const pluginDir = join(REPO, target.pluginDir);
  return {
    name, dir, spec, target, pluginDir,
    pluginName: readJson(join(pluginDir, '.claude-plugin', 'plugin.json')).name,
    protocolSkill: target.protocolSkill,
    skillSource: join(pluginDir, 'skills', target.protocolSkill, 'SKILL.md'),
    allowedTools: realize.allowedTools,
    permissionMode: realize.permissionMode,
    marketplace: readJson(join(REPO, '.claude-plugin', 'marketplace.json')).name,
    checklist: loadChecklist(readFileSync(join(dir, spec.checklist), 'utf8')),
  };
}

// The checklist and the phase-B message were derived from /realize's case files as they stood
// when the checklist was frozen. A later edit there changes the task under a frozen scorer, so
// every entry point that spends or scores refuses until the fixture is re-derived.
function frozenMismatches(c) {
  const out = [];
  for (const [rel, digest] of Object.entries(c.spec.frozenAgainst)) {
    const p = join(REPO, rel);
    if (!existsSync(p)) out.push(`${rel} is missing`);
    else if (sha256(readFileSync(p)) !== digest) out.push(`${rel} changed since the checklist was frozen`);
  }
  for (const [runner, digest] of Object.entries(c.spec.frozenInvocation || {})) {
    const line = c.target.invocation?.[runner];
    if (typeof line !== 'string' || sha256(line) !== digest) out.push(`the ${runner} invocation line of /realize target ${c.spec.realizeTarget} changed`);
  }
  return out;
}

function requireFrozen(c) {
  const bad = frozenMismatches(c);
  if (bad.length) {
    die(`case ${c.name} no longer matches what its checklist was frozen against:\n  - ${bad.join('\n  - ')}\n`
      + 're-derive the fixture (a new case directory with its own checklist) instead of scoring a changed task with a frozen checklist');
  }
}

const taskBody = (c, variant) => stripFrontmatter(readFileSync(join(REPO, c.spec.variants[variant].prompt), 'utf8'));

// ------------------------------------------------------------------ run / cell records

const runDir = (run) => join(RESULTS, run);
const stateDir = (run) => join(STATE, run);
const recDir = (run, cell) => join(runDir(run), cell);
const cellStateDir = (run, cell) => join(stateDir(run), cell);
const workDir = (run, cell) => join(cellStateDir(run, cell), 'work');

function loadRun(run) {
  const p = join(runDir(run), 'run.json');
  if (!existsSync(p)) die(`no run ${run} under ${RESULTS} (plan it first)`);
  return readJson(p);
}

function loadCell(plan, name) {
  const p = join(recDir(plan.run, name), 'cell.json');
  if (!existsSync(p)) die(`run ${plan.run} has no cell ${name}; cells: ${cellList(plan).map((c) => c.name).join(', ')}`);
  return readJson(p);
}

function turnCount(run, cell) {
  const d = recDir(run, cell);
  return existsSync(d) ? readdirSync(d).filter((f) => /^turn-\d+\.meta\.json$/.test(f)).length : 0;
}

const turnMeta = (run, cell, n) => readJson(join(recDir(run, cell), `turn-${n}.meta.json`));

function scaffoldInto(c, dir) {
  mkdirSync(dir, { recursive: true });
  const r = spawnSync('bash', [join(REPO, c.spec.scaffold)], { cwd: dir, encoding: 'utf8' });
  if (r.status !== 0) die(`scaffold failed in ${dir}: ${r.stderr}`);
}

function createCell(plan, c, cell) {
  const rec = recDir(plan.run, cell.name);
  mkdirSync(rec, { recursive: true });
  rmSync(cellStateDir(plan.run, cell.name), { recursive: true, force: true });
  scaffoldInto(c, workDir(plan.run, cell.name));
  writeJson(join(rec, 'cell.json'), {
    run: plan.run, name: cell.name, runner: plan.runner, model: plan.model, effort: plan.effort,
    case: plan.case, variant: cell.variant, arm: cell.arm, rep: cell.rep,
    work: workDir(plan.run, cell.name), scaffoldDigest: treeDigest(workDir(plan.run, cell.name)),
    sessionId: null, phaseBTurn: null, createdAt: new Date().toISOString(),
  });
}

// ------------------------------------------------------------------ plan

function cmdPlan(argv) {
  const { flags, positionals } = parseArgs(argv);
  if (positionals.length) die(`plan takes flags only (got ${positionals.join(' ')})`);
  const cases = caseNames();
  const { plan, errors } = validatePlan(flags, {
    cases, variantsOf: (n) => Object.keys(readJson(join(CASES, n, 'case.json')).variants),
  });
  if (errors.length) die(`invalid plan:\n  - ${errors.join('\n  - ')}`);
  const c = loadCase(plan.case);
  const frozen = frozenMismatches(c);
  if (frozen.length) die(`case ${c.name} does not match its frozen sources:\n  - ${frozen.join('\n  - ')}`);
  const cells = cellList(plan);
  const lines = [
    `run        : ${plan.run}`,
    `runner     : ${plan.runner}${plan.runner === 'codex' ? ` (auth ${plan.codexAuth})` : ''}`,
    `model      : ${plan.model}${plan.effort ? ` (effort ${plan.effort})` : ''}`,
    `case       : ${plan.case} — variants ${plan.variants.join(', ')}; checklist items ${c.checklist.map((i) => i.id).join(' ')}`,
    `arms × reps: ${plan.arms.join(', ')} × ${plan.reps}`,
    `per turn   : ${plan.runner === 'claude' ? `--max-budget-usd ${plan.budgetUsd}, ` : ''}timeout ${plan.timeoutS} s`,
    `records    : ${runDir(plan.run)}`,
    `work/state : ${stateDir(plan.run)}`,
    `cells (${cells.length}): ${cells.map((x) => x.name).join(', ')}`,
  ];
  console.log(lines.join('\n'));
  if (flags['dry-run']) {
    const tools = [plan.runner, 'python3'].map((b) => `${b} ${onPath(b) ? 'found' : 'NOT on PATH'}`);
    console.log(`prerequisites: ${tools.join(', ')}; scorer venv ${existsSync(SCORER_PY) ? 'present' : 'not built (setup builds it)'}`);
    console.log('dry run: arguments and frozen sources checked; nothing written, no model called');
    return;
  }
  if (existsSync(join(runDir(plan.run), 'run.json'))) die(`run ${plan.run} already exists; pick another --run or remove ${runDir(plan.run)}`);
  mkdirSync(stateDir(plan.run), { recursive: true });
  writeFileSync(join(stateDir(plan.run), 'arm-settings.json'), '{}\n');
  for (const cell of cells) createCell(plan, c, cell);
  writeJson(join(runDir(plan.run), 'run.json'), { ...plan, createdAt: new Date().toISOString() });
  console.log(`planned; next: node ${relative(process.cwd(), join(HERE, 'outcome.mjs'))} setup ${plan.run}`);
}

// ------------------------------------------------------------------ codex homes and login

const CODEX_KEEP = new Set(['config.toml', 'plugins', '.tmp', 'auth.json']);
const codexHome = (run, arm) => join(stateDir(run), 'codex-home', arm);
const ownerFile = (run, arm) => join(stateDir(run), 'codex-home', `${arm}.owner`);
const LOGIN_SOURCE = join((process.env.CODEX_HOME || join(homedir(), '.codex')).replace(/^~/, homedir()), 'auth.json');
// The same lock file /realize's harness takes, so the two never hold this login at once.
const LOGIN_LOCK = join(tmpdir(), `epistemic-realize-codex-login-${sha256(LOGIN_SOURCE).slice(0, 12)}.lock`);
const authPath = (home) => join(home, 'auth.json');

function authState(home) {
  let st;
  try { st = lstatSync(authPath(home)); } catch { return 'absent'; }
  if (!st.isSymbolicLink()) return 'file';
  return readlinkSync(authPath(home)) === LOGIN_SOURCE ? 'link' : 'foreign-link';
}

const strayMessage = (files) => `a regular auth.json sits in a disposable Codex home: ${files.join(', ')}. `
  + `It may hold a login newer than ${LOGIN_SOURCE}, so it was left in place; move it over the real `
  + 'one yourself if it is newer, or delete it, then re-run.';

function releaseLogins(run) {
  const stray = [];
  for (const arm of ['bare', 'protocol']) {
    const home = codexHome(run, arm);
    const s = authState(home);
    if (s === 'link' || s === 'foreign-link') unlinkSync(authPath(home));
    if (s === 'file') stray.push(authPath(home));
  }
  return stray;
}

function acquireLoginLock() {
  for (let attempt = 0; attempt < 2; attempt++) {
    try { writeFileSync(LOGIN_LOCK, `${process.pid}\n`, { flag: 'wx' }); return true; } catch (e) {
      if (e.code !== 'EEXIST') throw e;
      const holder = Number(readFileSync(LOGIN_LOCK, 'utf8').trim());
      let alive = false;
      try { process.kill(holder, 0); alive = true; } catch (err) { alive = err.code === 'EPERM'; }
      if (alive && holder !== process.pid) return false;
      rmSync(LOGIN_LOCK, { force: true });
    }
  }
  return false;
}

function releaseLoginLock() {
  try { if (Number(readFileSync(LOGIN_LOCK, 'utf8').trim()) === process.pid) rmSync(LOGIN_LOCK, { force: true }); } catch { /* gone */ }
}

// A plugin-list call and setup commands run with no credential in the child environment.
function codexQuiet(args, home) {
  return spawnSync('codex', args, { cwd: tmpdir(), encoding: 'utf8', env: { ...childEnv(process.env), CODEX_HOME: home } });
}

// The installed copy lives at plugins/cache/<marketplace>/<plugin>/<version>/skills/<skill>/SKILL.md.
function findInstalledSkill(home, c) {
  const root = join(home, 'plugins', 'cache');
  const want = new RegExp(`/${c.pluginName}/[^/]+/skills/${c.protocolSkill}/SKILL\\.md$`);
  const hits = [];
  const walk = (d, depth) => {
    if (depth > 7 || !existsSync(d)) return;
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p, depth + 1);
      else if (want.test(p)) hits.push(p);
    }
  };
  walk(root, 0);
  return hits[0] || null;
}

function codexPluginState(home, c) {
  const r = codexQuiet(['plugin', 'list', '--json'], home);
  let listed = null;
  try { listed = JSON.parse(r.stdout); } catch { /* unreadable */ }
  const installed = (listed?.installed || []).map((p) => ({ name: p.name, enabled: p.enabled, version: p.version }));
  const skill = findInstalledSkill(home, c);
  return {
    listed: listed !== null,
    installed,
    enabled: installed.some((p) => p.name === c.pluginName && p.enabled === true),
    installedSkillSha256: skill ? sha256(readFileSync(skill)) : null,
  };
}

// ------------------------------------------------------------------ setup

function buildScorer(c) {
  if (existsSync(SCORER_PY)) { console.log(`scorer venv : ${SCORER_VENV} (present)`); return; }
  if (!onPath('python3')) die('python3 is required to build the scorer venv (the case app must run to be probed)');
  mkdirSync(STATE, { recursive: true });
  let r = spawnSync('python3', ['-m', 'venv', SCORER_VENV], { stdio: 'inherit' });
  if (r.status !== 0) die('python3 -m venv failed (on Debian/Ubuntu install python3-venv)');
  r = spawnSync(join(SCORER_VENV, 'bin', 'pip'), ['install', '--quiet', '-r', join(c.dir, c.spec.scorerRequirements)], { stdio: 'inherit' });
  if (r.status !== 0) { rmSync(SCORER_VENV, { recursive: true, force: true }); die('installing the scorer pins failed'); }
  console.log(`scorer venv : ${SCORER_VENV} (built from ${c.spec.scorerRequirements})`);
}

function cmdSetup([run]) {
  if (!run) die('usage: setup <run>');
  const plan = loadRun(run);
  const c = loadCase(plan.case);
  requireFrozen(c);
  if (!onPath(plan.runner)) die(`${plan.runner} is not on PATH`);
  buildScorer(c);
  if (plan.runner !== 'codex') { console.log('claude: each cell gets an empty config directory at its first turn; nothing else to build'); return; }
  const stray = releaseLogins(run);
  if (stray.length) die(strayMessage(stray));
  for (const arm of plan.arms) {
    const home = codexHome(run, arm);
    rmSync(home, { recursive: true, force: true });
    mkdirSync(home, { recursive: true });
    rmSync(ownerFile(run, arm), { force: true });
    if (arm === 'protocol') {
      for (const args of [['plugin', 'marketplace', 'add', REPO, '--json'], ['plugin', 'add', `${c.pluginName}@${c.marketplace}`, '--json']]) {
        const r = codexQuiet(args, home);
        if (r.status !== 0) die(`codex ${args.join(' ')} failed: ${(r.stderr || r.stdout).trim()}`);
      }
    }
    const s = codexPluginState(home, c);
    const want = arm === 'protocol';
    const ok = s.listed && s.enabled === want
      && (want ? s.installedSkillSha256 === sha256(readFileSync(c.skillSource)) : s.installedSkillSha256 === null);
    if (!ok) die(`codex home ${home} does not hold the ${arm} treatment: ${JSON.stringify(s)}`);
    console.log(`codex home  : ${home} (${arm}: ${want ? `${c.pluginName} installed and enabled` : 'no plugin'})`);
  }
  console.log('setup read and stored no credential');
}

// ------------------------------------------------------------------ turn

function composeMessage(plan, c, cell, flags, n) {
  const kinds = ['open', 'go', 'phase-b', 'reply'].filter((k) => flags[k] !== undefined);
  if (kinds.length !== 1) die('turn takes exactly one of --open, --go, --phase-b, --reply <file>');
  const kind = kinds[0];
  const hasA = existsSync(join(recDir(plan.run, cell.name), 'A.score.json'));
  if (kind === 'open') {
    if (n !== 0) die(`${cell.name} already has ${n} turn(s); --open is the first turn only`);
    return { kind, text: composeOpen(taskBody(c, cell.variant), cell.arm, c.target.invocation[plan.runner]) };
  }
  if (n === 0) die(`${cell.name} has no turn yet; start it with --open`);
  if (existsSync(join(recDir(plan.run, cell.name), 'final.score.json'))) die(`${cell.name} is finished (final snapshot taken)`);
  if (kind === 'phase-b') {
    if (!hasA) die(`take the phase-A snapshot first: snap ${plan.run} ${cell.name} A`);
    if (cell.phaseBTurn) die(`${cell.name} already received the phase-B message at turn ${cell.phaseBTurn}`);
    const lead = readFileSync(join(c.dir, c.spec.phaseB.lead), 'utf8');
    return { kind, text: composePhaseB(lead, taskBody(c, c.spec.phaseB.specification)) };
  }
  if (hasA && !cell.phaseBTurn) die(`the phase-A snapshot is taken; the next turn is --phase-b (or reset the cell)`);
  if (kind === 'go') {
    if (cell.phaseBTurn) die('--go belongs to phase A');
    return { kind, text: c.spec.goLine };
  }
  const file = flags.reply;
  if (!file || !existsSync(file)) die(`--reply needs an existing file (got ${JSON.stringify(file)})`);
  const text = readFileSync(file, 'utf8').trim();
  if (!text) die(`${file} is empty`);
  return { kind, text };
}

function runClaudeTurn(plan, c, cell, msgFile, outPrefix) {
  const env = {
    ...process.env,
    OUTCOME_MODEL: plan.model,
    OUTCOME_BUDGET: String(plan.budgetUsd),
    OUTCOME_TIMEOUT: String(plan.timeoutS),
    OUTCOME_SETTINGS: join(stateDir(plan.run), 'arm-settings.json'),
    OUTCOME_ALLOWED_TOOLS: c.allowedTools.join(','),
    OUTCOME_PERMISSION_MODE: c.permissionMode,
  };
  const args = [TURN_CLAUDE, cell.work, join(cellStateDir(plan.run, cell.name), 'cfg'), outPrefix,
    cell.arm === 'protocol' ? c.pluginDir : '-', msgFile];
  if (cell.sessionId) args.push(cell.sessionId);
  const r = spawnSync('bash', args, { env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (r.status !== 0) die(`turn-claude.sh failed: ${r.stderr}`);
  const parsed = parseClaudeTurn(readFileSync(`${outPrefix}.jsonl`, 'utf8'));
  const want = cell.arm === 'protocol';
  const reasons = [];
  if (!parsed.completed) reasons.push('no complete init/result pair in the stream');
  if (parsed.initPlugins.includes(c.pluginName) !== want) reasons.push(`${c.pluginName} ${want ? 'absent from' : 'present in'} init plugins`);
  if (!cell.sessionId && (parsed.initSkillsMatching.length > 0) !== want) reasons.push(`protocol skill ${want ? 'absent from' : 'present in'} init skills`);
  return { parsed, id: parsed.sessionId, reasons, extra: { initPlugins: parsed.initPlugins, initSkillsMatching: parsed.initSkillsMatching } };
}

function runCodexTurn(plan, c, cell, message, outPrefix) {
  const home = codexHome(plan.run, cell.arm);
  if (!existsSync(home)) die(`no codex home for ${cell.arm}; run setup ${plan.run}`);
  if (authState(home) === 'file') die(strayMessage([authPath(home)]));
  if (!cell.sessionId) {
    // A fresh cell resets the home's volatile state, which would wipe another cell's session,
    // so a home serves one cell at a time from its first turn to its final snapshot.
    const owner = existsSync(ownerFile(plan.run, cell.arm)) ? readFileSync(ownerFile(plan.run, cell.arm), 'utf8').trim() : '';
    if (owner && owner !== cell.name) die(`the ${cell.arm} codex home is held by ${owner} until its final snapshot`);
    for (const e of readdirSync(home)) if (!CODEX_KEEP.has(e)) rmSync(join(home, e), { recursive: true, force: true });
    writeFileSync(ownerFile(plan.run, cell.arm), `${cell.name}\n`);
  }
  const plugins = codexPluginState(home, c);
  const effort = `model_reasoning_effort=${JSON.stringify(plan.effort)}`;
  // Network is on inside the workspace-write sandbox because the Claude cells have it for pip.
  const common = ['--strict-config', '--model', plan.model, '-c', effort, '-c', 'sandbox_workspace_write.network_access=true',
    '--skip-git-repo-check', '--json'];
  const args = cell.sessionId
    ? ['-a', 'never', 'exec', 'resume', ...common, '-c', 'sandbox_mode="workspace-write"', cell.sessionId, message]
    : ['-a', 'never', 'exec', ...common, '--sandbox', 'workspace-write', '--cd', cell.work, message];
  const env = { ...childEnv(process.env), CODEX_HOME: home };
  if (plan.codexAuth === 'api-key') {
    if (!process.env.CODEX_API_KEY) die('CODEX_API_KEY is not set; supply it to this process only, or plan with --codex-auth login');
    env.CODEX_API_KEY = process.env.CODEX_API_KEY;
  }
  const opts = { cwd: cell.work, env, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, timeout: plan.timeoutS * 1000 };
  let r; let link = 'n/a';
  if (plan.codexAuth === 'login') {
    // The login is linked into the home only for the span of this one exec — never copied, since
    // a ChatGPT login rotates its refresh token and a copy would strand the real one.
    let st;
    try { st = statSync(LOGIN_SOURCE); } catch { die(`login mode needs an existing codex login at ${LOGIN_SOURCE}`); }
    if (!st.isFile()) die(`${LOGIN_SOURCE} is not a regular file`);
    const rel = relative(STATE, LOGIN_SOURCE);
    if (!rel.startsWith('..') && !isAbsolute(rel)) die(`${LOGIN_SOURCE} lies inside the disposable state directory`);
    if (!acquireLoginLock()) die(`another run holds this codex login (${LOGIN_LOCK}); wait for it`);
    try {
      if (authState(home) !== 'absent') unlinkSync(authPath(home));
      symlinkSync(LOGIN_SOURCE, authPath(home));
      try { r = spawnSync('codex', args, opts); } finally {
        link = authState(home);
        if (link === 'link' || link === 'foreign-link') unlinkSync(authPath(home));
      }
    } finally { releaseLoginLock(); }
  } else {
    r = spawnSync('codex', args, opts);
  }
  writeFileSync(`${outPrefix}.jsonl`, r.stdout || '');
  writeFileSync(`${outPrefix}.err`, `${r.stderr || ''}${r.error ? `\n${r.error.message}` : ''}${r.status ? `\nexit=${r.status}` : ''}`);
  writeJson(`${outPrefix}.plugins.json`, plugins);
  const parsed = parseCodexTurn(r.stdout || '');

  // Keep the thread's session rollout: it holds any injected skill block, and the next fresh
  // cell's reset removes it from the home.
  let injections = null;
  if (parsed.threadId && existsSync(join(home, 'sessions'))) {
    const found = [];
    const walk = (d) => { for (const e of readdirSync(d, { withFileTypes: true })) { const p = join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name.includes(parsed.threadId)) found.push(p); } };
    walk(join(home, 'sessions'));
    if (found.length) {
      const dest = join(dirname(outPrefix), 'codex-sessions');
      mkdirSync(dest, { recursive: true });
      copyFileSync(found[0], join(dest, 'rollout.jsonl'));
      const needle = `<skill>\\n<name>${c.pluginName}:${c.protocolSkill}</name>`;
      injections = readFileSync(found[0], 'utf8').split(needle).length - 1;
    }
  }
  const want = cell.arm === 'protocol';
  const reasons = [];
  if (!parsed.completed || r.status !== 0) reasons.push('no complete thread.started/turn.completed pair, or a non-zero exit');
  if (!plugins.listed) reasons.push('codex plugin list was unreadable before the turn');
  if (plugins.enabled !== want) reasons.push(`${c.pluginName} ${want ? 'not enabled in' : 'enabled in'} the ${cell.arm} home`);
  const srcDigest = sha256(readFileSync(c.skillSource));
  if (want ? plugins.installedSkillSha256 !== srcDigest : plugins.installedSkillSha256 !== null) {
    reasons.push(want ? 'installed SKILL.md differs from the source (re-run setup)' : 'a protocol SKILL.md is installed in the bare home');
  }
  if (plan.codexAuth === 'login' && link !== 'link') reasons.push(`login link was ${link} after the exec`);
  const extra = { plugins: plugins.installed, installedSkillSha256: plugins.installedSkillSha256, rolloutSkillInjections: injections, loginLinkAfter: link, fileChanges: parsed.fileChanges };
  if (plan.codexAuth === 'login' && link !== 'link') {
    // Recorded first, then fatal: the next exec would run against whatever codex left there.
    return { parsed, id: parsed.threadId, reasons, extra, fatal: link === 'file' ? strayMessage([authPath(home)]) : `the login link in ${home} was ${link} after the exec` };
  }
  return { parsed, id: parsed.threadId, reasons, extra };
}

function cmdTurn(argv) {
  const { flags, positionals } = parseArgs(argv);
  const [run, name] = positionals;
  if (!run || !name) die('usage: turn <run> <cell> --open | --go | --phase-b | --reply <file>');
  const plan = loadRun(run);
  const c = loadCase(plan.case);
  requireFrozen(c);
  const cell = loadCell(plan, name);
  const n = turnCount(run, name);
  const msg = composeMessage(plan, c, cell, flags, n);
  const turn = n + 1;
  const rec = recDir(run, name);
  const outPrefix = join(rec, `turn-${turn}`);
  const msgFile = `${outPrefix}.msg`;
  writeFileSync(msgFile, `${msg.text}\n`);
  const before = treeDigest(cell.work);
  const t0 = Date.now();
  const res = plan.runner === 'claude'
    ? runClaudeTurn(plan, c, cell, msgFile, outPrefix)
    : runCodexTurn(plan, c, cell, msg.text, outPrefix);
  const wallS = Math.round((Date.now() - t0) / 1000);
  const after = treeDigest(cell.work);
  writeFileSync(`${outPrefix}.txt`, res.parsed.texts.join('\n\n----- [next assistant text] -----\n\n'));
  const meta = {
    turn, kind: msg.kind, phase: cell.phaseBTurn || msg.kind === 'phase-b' ? 'B' : 'A',
    runner: plan.runner, model: plan.model, effort: plan.effort, arm: cell.arm,
    id: res.id, wallS, completed: res.parsed.completed,
    integrity: { ok: res.reasons.length === 0, reasons: res.reasons },
    treeChanged: before !== after, treeChangedSinceScaffold: after !== cell.scaffoldDigest,
    commands: res.parsed.commands,
    ...(plan.runner === 'claude'
      ? { costUsd: res.parsed.costUsd, usage: res.parsed.usage, resultSubtype: res.parsed.resultSubtype, isError: res.parsed.isError, skillInvocations: res.parsed.skillInvocations, toolUses: res.parsed.toolUses }
      : { usage: res.parsed.usage, failed: res.parsed.failed }),
    ...res.extra,
  };
  writeJson(`${outPrefix}.meta.json`, meta);
  if (!cell.sessionId && res.id) cell.sessionId = res.id;
  if (msg.kind === 'phase-b') cell.phaseBTurn = turn;
  writeJson(join(rec, 'cell.json'), cell);
  console.log(`${name} turn ${turn} (${msg.kind}, phase ${meta.phase}): ${meta.completed ? 'completed' : 'INCOMPLETE'}, `
    + `tree ${meta.treeChanged ? 'changed' : 'unchanged'}, integrity ${meta.integrity.ok ? 'ok' : `FAILED (${meta.integrity.reasons.join('; ')})`}, ${wallS} s`);
  console.log(`read: ${relative(process.cwd(), `${outPrefix}.txt`)}`);
  if (res.fatal) die(res.fatal, 4);
  if (!meta.completed) process.exitCode = 2;
}

// ------------------------------------------------------------------ snapshot and score

function scoreSnapshot(c, snap) {
  if (!existsSync(SCORER_PY)) die(`no scorer venv at ${SCORER_VENV}; run setup`);
  const r = spawnSync(SCORER_PY, [join(c.dir, c.spec.probes), snap], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  if (r.status !== 0) die(`probes failed: ${r.stderr}`);
  return JSON.parse(r.stdout);
}

async function cmdSnap([run, name, label]) {
  if (!run || !name || !['A', 'final'].includes(label)) die('usage: snap <run> <cell> A|final');
  const plan = loadRun(run);
  const c = loadCase(plan.case);
  requireFrozen(c);
  const cell = loadCell(plan, name);
  const n = turnCount(run, name);
  const rec = recDir(run, name);
  if (label === 'A') {
    if (!n) die(`${name} has no turn yet`);
    if (cell.phaseBTurn) die(`${name} is already in phase B; the phase-A snapshot is fixed`);
  } else {
    if (!cell.phaseBTurn) die(`${name} has not received the phase-B message`);
  }
  const snap = join(rec, 'snapshots', label);
  rmSync(snap, { recursive: true, force: true });
  mkdirSync(snap, { recursive: true });
  cpSync(cell.work, snap, { recursive: true, filter: (src) => src === cell.work || snapshotKeeps(src.split('/').pop()) });
  const ref = mkdtempSync(join(tmpdir(), 'outcome-scaffold-'));
  try {
    scaffoldInto(c, ref);
    const evidence = scoreSnapshot(c, snap);
    const { score } = await import(pathToFileURL(join(c.dir, c.spec.rules)).href);
    const { auto, manualEvidence } = score({ evidence, snapshotDir: snap, scaffoldDir: ref });
    const fromScaffold = diffTrees(ref, snap, { testPrefix: c.spec.testPrefix });
    const out = { label, afterTurn: n, auto, manualEvidence, evidence, implemented: fromScaffold.rework > 0, changedFromScaffold: fromScaffold.changed };
    writeJson(join(rec, `${label}.score.json`), out);
    console.log(`${name} ${label} after turn ${n}: auto ${JSON.stringify(auto)} (sum ${Object.values(auto).reduce((s, v) => s + v, 0)})`);
    console.log(`manual items to confirm by reading the snapshot: ${JSON.stringify(manualEvidence)}`);
    if (label === 'final') {
      const d = diffTrees(join(rec, 'snapshots', 'A'), snap, { testPrefix: c.spec.testPrefix });
      writeJson(join(rec, 'phase-b.diff.json'), d);
      console.log(`phase B: ${d.files} files, ${d.lines} lines; rework (outside ${c.spec.testPrefix}) ${d.reworkFiles} files, ${d.rework} lines`);
      if (plan.runner === 'codex' && existsSync(ownerFile(run, cell.arm))
          && readFileSync(ownerFile(run, cell.arm), 'utf8').trim() === name) rmSync(ownerFile(run, cell.arm));
    }
  } finally {
    rmSync(ref, { recursive: true, force: true });
  }
}

// ------------------------------------------------------------------ notes, status, reset

function manualItems(c) {
  return import(pathToFileURL(join(c.dir, c.spec.rules)).href).then((m) => m.MANUAL);
}

async function cmdNote([run, name]) {
  if (!run || !name) die('usage: note <run> <cell>');
  const plan = loadRun(run);
  const c = loadCase(plan.case);
  const cell = loadCell(plan, name);
  const manual = await manualItems(c);
  const fx = await answerFixture(c);
  const p = join(recDir(run, name), 'notes.json');
  const n = turnCount(run, name);
  if (!existsSync(p)) {
    const aTurns = cell.phaseBTurn ? cell.phaseBTurn - 1 : n;
    const blank = Object.fromEntries(manual.map((k) => [k, null]));
    const phaseA = Array.from({ length: aTurns }, (_, i) => i + 1);
    writeJson(p, {
      phaseA_turns: phaseA,
      phaseB_turns: Array.from({ length: Math.max(0, n - aTurns) }, (_, i) => aTurns + i + 1),
      questions_phaseA: [], q_explicit: null, q_items_total: null,
      manual: { A: { ...blank }, final: { ...blank } },
      ...(fx ? { reply_items: replyItemsTemplate(phaseAReplies(run, name, phaseA), fx) } : {}),
      notes_phaseA: '', notes_phaseB: '',
    });
    console.log(`wrote a template: ${p}\nfill q_explicit, q_items_total, questions_phaseA and manual.{A,final} by reading the transcript and snapshots`
      + (fx ? ', and each reply_items entry\'s item with the verbatim text of the item that line answers' : ''));
    return;
  }
  const notes = readJson(p);
  const errors = validateNotes(notes, { turns: n, manualItems: manual });
  if (errors.length) die(`${p}:\n  - ${errors.join('\n  - ')}`);
  if (fx) {
    const forms = classifyReplies({ replies: phaseAReplies(run, name, notes.phaseA_turns), items: notes.reply_items || [], fixture: fx });
    if (forms.errors.length) die(`${p}:\n  - ${forms.errors.join('\n  - ')}`);
    const summary = summarizeForms(forms.lines);
    writeJson(join(recDir(run, name), 'answer-forms.json'), { summary, lines: forms.lines });
    const open = forms.lines.filter((l) => l.labels.some((x) => x.label === 'unclassified') || l.itemNotFound);
    console.log(`answer forms: fields presented/released/unknown ${summary.fields.presented}/${summary.fields.released}/${summary.unknown}, `
      + `recognized share ${summary.fields.unverified ? `none while ${summary.fields.unverified} field(s) lack an item excerpt`
        : summary.share === null ? 'n=0' : `${summary.share.toFixed(2)} (n=${summary.n})`}`);
    for (const l of open) console.log(`  unclassified turn ${l.turn} line ${l.line}: ${l.itemNotFound || l.labels.find((x) => x.label === 'unclassified').why || 'see answer-forms.json'}`);
  }
  console.log(`${p}: complete`);
}

// The case's answer-form fixture, or null when the case defines none.
async function answerFixture(c) {
  if (!c.spec.answerForms) return null;
  const m = await import(pathToFileURL(join(c.dir, c.spec.answerForms)).href);
  return { answers: m.ORACLE_ANSWERS, exampleClause: m.EXAMPLE_CLAUSE, clauseBoundary: m.CLAUSE_BOUNDARY, negation: m.NEGATION };
}

// The phase-A turns that carried an oracle reply, each with the subject turn it answers. A --go
// turn is the runner's rule, not an oracle reply, and is not among them.
function phaseAReplies(run, name, aTurns) {
  const rec = recDir(run, name);
  return aTurns.filter((t) => t > 1 && turnMeta(run, name, t).kind === 'reply').map((t) => ({
    turn: t,
    text: readFileSync(join(rec, `turn-${t}.msg`), 'utf8'),
    prevText: readFileSync(join(rec, `turn-${t - 1}.txt`), 'utf8'),
  }));
}

function cmdStatus([run]) {
  if (!run) die('usage: status <run>');
  const plan = loadRun(run);
  for (const { name } of cellList(plan)) {
    const rec = recDir(run, name);
    if (!existsSync(join(rec, 'cell.json'))) { console.log(`${name}: missing`); continue; }
    const cell = readJson(join(rec, 'cell.json'));
    const n = turnCount(run, name);
    const metas = Array.from({ length: n }, (_, i) => turnMeta(run, name, i + 1));
    const firstChange = metas.findIndex((m) => m.treeChangedSinceScaffold) + 1;
    const bits = [
      `${n} turn(s)`,
      n ? `turn 1 ${metas[0].treeChanged ? 'wrote code' : 'stopped before code'}` : null,
      firstChange ? `first change at turn ${firstChange}` : (n ? 'no change yet' : null),
      existsSync(join(rec, 'A.score.json')) ? 'A snapped' : null,
      cell.phaseBTurn ? `phase B from turn ${cell.phaseBTurn}` : null,
      existsSync(join(rec, 'final.score.json')) ? 'final snapped' : null,
      existsSync(join(rec, 'notes.json')) ? 'notes present' : null,
      metas.some((m) => !m.integrity.ok) ? 'INTEGRITY FAILED' : null,
    ].filter(Boolean);
    console.log(`${name}: ${bits.join(', ')}`);
  }
}

function cmdReset([run, name]) {
  if (!run || !name) die('usage: reset <run> <cell>');
  const plan = loadRun(run);
  const c = loadCase(plan.case);
  const cell = loadCell(plan, name);
  const rec = recDir(run, name);
  const kept = `${rec}.discarded-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  renameSync(rec, kept);
  if (plan.runner === 'codex' && existsSync(ownerFile(run, cell.arm))
      && readFileSync(ownerFile(run, cell.arm), 'utf8').trim() === name) rmSync(ownerFile(run, cell.arm));
  createCell(plan, c, { name, variant: cell.variant, arm: cell.arm, rep: cell.rep });
  console.log(`${name}: records moved to ${kept}; a fresh scaffold is in place`);
}

// ------------------------------------------------------------------ report

async function cellRow(plan, c, name, manual) {
  const rec = recDir(plan.run, name);
  const missing = ['cell.json', 'A.score.json', 'final.score.json', 'phase-b.diff.json', 'notes.json'].filter((f) => !existsSync(join(rec, f)));
  if (missing.length) return { skip: `missing ${missing.join(', ')}` };
  const cell = readJson(join(rec, 'cell.json'));
  const n = turnCount(plan.run, name);
  const turns = Array.from({ length: n }, (_, i) => turnMeta(plan.run, name, i + 1));
  const notes = readJson(join(rec, 'notes.json'));
  const errors = validateNotes(notes, { turns: n, manualItems: manual });
  if (errors.length) return { skip: `notes.json: ${errors.join('; ')}` };
  const scores = { A: readJson(join(rec, 'A.score.json')), final: readJson(join(rec, 'final.score.json')) };
  if (scores.A.afterTurn !== notes.phaseA_turns[notes.phaseA_turns.length - 1]) return { skip: 'the A snapshot was not taken after the last phase-A turn' };
  if (scores.final.afterTurn !== n) return { skip: 'the final snapshot was not taken after the last turn' };
  const fx = await answerFixture(c);
  let answerForms = null;
  if (fx) {
    answerForms = classifyReplies({ replies: phaseAReplies(plan.run, name, notes.phaseA_turns), items: notes.reply_items || [], fixture: fx });
    if (answerForms.errors.length) return { skip: `notes.json reply_items: ${answerForms.errors.join('; ')}` };
  }
  const reasons = turns.flatMap((t) => t.integrity.reasons.map((r) => `turn ${t.turn}: ${r}`));
  const cellDir = cellStateDir(plan.run, name);
  const allowed = [c.pluginDir, join(codexHome(plan.run, cell.arm), 'plugins', 'cache')];
  const pathFlags = auditPaths(turns.flatMap((t) => t.commands || []), { ownDir: cellDir, roots: [STATE, RESULTS, REPO], allowed });
  writeJson(join(rec, 'path-audit.json'), pathFlags);
  return {
    row: buildRow({
      cell, turns, notes, scores, diff: readJson(join(rec, 'phase-b.diff.json')),
      integrity: { ok: reasons.length === 0, reasons }, pathFlags, answerForms,
    }),
  };
}

async function cmdReport(argv) {
  const { flags, positionals } = parseArgs(argv);
  if (!positionals.length) die('usage: report <run> [<run> ...] [--out <dir>]');
  if (positionals.length > 1 && !flags.out) die('reporting several runs together needs --out <dir>');
  const out = resolve(flags.out || runDir(positionals[0]));
  const rows = []; const skipped = [];
  let caseSpec = null;
  for (const run of positionals) {
    const plan = loadRun(run);
    const c = loadCase(plan.case);
    if (caseSpec && caseSpec.name !== c.name) die('a report covers one case');
    caseSpec = c;
    const manual = await manualItems(c);
    for (const { name } of cellList(plan)) {
      const r = await cellRow(plan, c, name, manual);
      if (r.row) rows.push(r.row); else skipped.push(`${run}/${name}: ${r.skip}`);
    }
  }
  const means = groupMeans(rows);
  const verdicts = evaluateFalsifiers(means, { variant: caseSpec.spec.falsifierVariant });
  const guards = guardrails(means, { variant: caseSpec.spec.guardrailVariant });
  const scope = `case ${caseSpec.name}; runs ${positionals.join(', ')}; ${rows.length} cell(s) reported`;
  mkdirSync(out, { recursive: true });
  writeJson(join(out, 'results.json'), { rows, means, verdicts, guards, skipped });
  let md = renderReport({ rows, means, verdicts, guards, scope });
  if (skipped.length) md += `\n## Not reported\n\n${skipped.map((s) => `- ${s}`).join('\n')}\n`;
  writeFileSync(join(out, 'report.md'), md);
  console.log(md);
  console.log(`written: ${join(out, 'results.json')}, ${join(out, 'report.md')}`);
  if (skipped.length) process.exitCode = 1;
}

// ------------------------------------------------------------------ cleanup

function cmdReleaseLogin([run]) {
  if (!run) die('usage: release-login <run>');
  loadRun(run);
  const stray = releaseLogins(run);
  if (stray.length) die(strayMessage(stray), 3);
  console.log('no login link left in this run\'s codex homes');
}

function cmdTeardown([run]) {
  if (!run) die('usage: teardown <run>');
  loadRun(run);
  const stray = releaseLogins(run);
  if (stray.length) die(strayMessage(stray), 3);
  rmSync(stateDir(run), { recursive: true, force: true });
  console.log(`removed ${stateDir(run)} (work trees, config dirs, codex homes); records kept in ${runDir(run)}`);
}

// ------------------------------------------------------------------ main

const [cmd, ...rest] = process.argv.slice(2);
const commands = {
  plan: cmdPlan, setup: cmdSetup, turn: cmdTurn, snap: cmdSnap, note: cmdNote, status: cmdStatus,
  reset: cmdReset, report: cmdReport, 'release-login': cmdReleaseLogin, teardown: cmdTeardown,
};
if (!commands[cmd]) die(`usage: outcome.mjs <${Object.keys(commands).join('|')}> ...`);
await commands[cmd](rest);
