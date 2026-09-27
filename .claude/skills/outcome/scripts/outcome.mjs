#!/usr/bin/env node
// The outcome eval's runner: plan a paired matrix, set up isolation, drive one subject turn at a
// time up to the first implementation, check the notes' items, and list them. The user side of
// each dialogue is played by a person (or an agent) applying the case's oracle; this script sends
// what they compose and records everything else. Node standard library only; see ../SKILL.md and
// ../references/runbook.md.
//
//   node outcome.mjs plan --runner claude|codex --model M [--effort E] [--case C] [--variants v,..]
//                         [--reps N] [--arms bare,protocol] [--budget USD] [--timeout S]
//                         [--codex-auth api-key|login] [--run NAME] [--dry-run]
//   node outcome.mjs setup <run>
//   node outcome.mjs turn <run> <cell> --open | --go | --reply <file>
//   node outcome.mjs note <run> <cell>
//   node outcome.mjs status <run>
//   node outcome.mjs reset <run> <cell>
//   node outcome.mjs report <run> [<run> ...] [--out <dir>]
//   node outcome.mjs release-login <run>
//   node outcome.mjs teardown <run>

import { spawnSync } from 'node:child_process';
import {
  copyFileSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, readlinkSync,
  renameSync, rmSync, statSync, symlinkSync, unlinkSync, writeFileSync,
} from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  armCounts, auditPaths, buildRow, cellList, childEnv, composeOpen, parseArgs, parseClaudeTurn,
  parseCodexTurn, renderReport, sha256, stripFrontmatter, treeDigest, validateNotes, validatePlan,
} from './lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SKILL = resolve(HERE, '..');
const REPO = resolve(SKILL, '..', '..', '..');
const CASES = join(SKILL, 'cases');
const TURN_CLAUDE = join(HERE, 'turn-claude.sh');
const repoKey = sha256(REPO).slice(0, 12);
const RESULTS = resolve(process.env.OUTCOME_RESULTS_DIR || join(SKILL, 'results'));
const STATE = resolve(process.env.OUTCOME_STATE_DIR || join(tmpdir(), `epistemic-outcome-${repoKey}`));

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
  };
}

// Items are read against the opening request, and the user side answers from the oracle, as both
// stood when the case was frozen. A later edit there makes a different case whose counts do not
// compare with this one's, so every entry point that spends refuses until a new case is made.
function frozenMismatches(c) {
  const out = [];
  for (const [rel, digest] of Object.entries(c.spec.frozenAgainst)) {
    const p = join(REPO, rel);
    if (!existsSync(p)) out.push(`${rel} is missing`);
    else if (sha256(readFileSync(p)) !== digest) out.push(`${rel} changed since the case was frozen`);
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
    die(`case ${c.name} no longer matches what it was frozen against:\n  - ${bad.join('\n  - ')}\n`
      + 'make a new case directory for the changed request or oracle instead of re-digesting this one');
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
    sessionId: null, createdAt: new Date().toISOString(),
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
    `case       : ${plan.case} — variants ${plan.variants.join(', ')}`,
    `arms × reps: ${plan.arms.join(', ')} × ${plan.reps}`,
    `per turn   : ${plan.runner === 'claude' ? `--max-budget-usd ${plan.budgetUsd}, ` : ''}timeout ${plan.timeoutS} s`,
    `records    : ${runDir(plan.run)}`,
    `work/state : ${stateDir(plan.run)}`,
    `cells (${cells.length}): ${cells.map((x) => x.name).join(', ')}`,
  ];
  console.log(lines.join('\n'));
  if (flags['dry-run']) {
    console.log(`prerequisites: ${plan.runner} ${onPath(plan.runner) ? 'found' : 'NOT on PATH'}`);
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
// A Codex home serves one cell from its first turn until the cell is closed or reset.
function releaseHome(plan, arm, name) {
  if (plan.runner === 'codex' && existsSync(ownerFile(plan.run, arm))
      && readFileSync(ownerFile(plan.run, arm), 'utf8').trim() === name) rmSync(ownerFile(plan.run, arm));
}
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

function cmdSetup([run]) {
  if (!run) die('usage: setup <run>');
  const plan = loadRun(run);
  const c = loadCase(plan.case);
  requireFrozen(c);
  if (!onPath(plan.runner)) die(`${plan.runner} is not on PATH`);
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

function composeMessage(c, cell, flags, n, plan) {
  const kinds = ['open', 'go', 'reply'].filter((k) => flags[k] !== undefined);
  if (kinds.length !== 1) die('turn takes exactly one of --open, --go, --reply <file>');
  const kind = kinds[0];
  if (kind === 'open') {
    if (n !== 0) die(`${cell.name} already has ${n} turn(s); --open is the first turn only`);
    return { kind, text: composeOpen(taskBody(c, cell.variant), cell.arm, c.target.invocation[plan.runner]) };
  }
  if (n === 0) die(`${cell.name} has no turn yet; start it with --open`);
  if (kind === 'go') return { kind, text: c.spec.goLine };
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
    // so a home serves one cell at a time from its first turn until the cell is closed.
    const owner = existsSync(ownerFile(plan.run, cell.arm)) ? readFileSync(ownerFile(plan.run, cell.arm), 'utf8').trim() : '';
    if (owner && owner !== cell.name) die(`the ${cell.arm} codex home is held by ${owner} until that cell is closed (note) or reset`);
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
  if (!run || !name) die('usage: turn <run> <cell> --open | --go | --reply <file>');
  const plan = loadRun(run);
  const c = loadCase(plan.case);
  requireFrozen(c);
  const cell = loadCell(plan, name);
  const n = turnCount(run, name);
  if (existsSync(join(recDir(run, name), 'notes.json'))) die(`${name} is closed: its notes were started after turn ${n}`);
  const msg = composeMessage(c, cell, flags, n, plan);
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
    turn, kind: msg.kind,
    runner: plan.runner, model: plan.model, effort: plan.effort, arm: cell.arm,
    id: res.id, wallS, completed: res.parsed.completed,
    integrity: { ok: res.reasons.length === 0, reasons: res.reasons },
    treeChanged: before !== after, treeChangedSinceScaffold: after !== cell.scaffoldDigest,
    commands: res.parsed.commands,
    ...(plan.runner === 'claude' ? { skillInvocations: res.parsed.skillInvocations } : { failed: res.parsed.failed }),
    ...res.extra,
  };
  writeJson(`${outPrefix}.meta.json`, meta);
  if (!cell.sessionId && res.id) cell.sessionId = res.id;
  writeJson(join(rec, 'cell.json'), cell);
  console.log(`${name} turn ${turn} (${msg.kind}): ${meta.completed ? 'completed' : 'INCOMPLETE'}, `
    + `tree ${meta.treeChanged ? 'changed' : 'unchanged'}, integrity ${meta.integrity.ok ? 'ok' : `FAILED (${meta.integrity.reasons.join('; ')})`}, ${wallS} s`);
  console.log(`read: ${relative(process.cwd(), `${outPrefix}.txt`)}`);
  if (res.fatal) die(res.fatal, 4);
  if (!meta.completed) process.exitCode = 2;
}

// ------------------------------------------------------------------ notes, status, reset

const turnTexts = (run, name, n) => Array.from({ length: n }, (_, i) => readFileSync(join(recDir(run, name), `turn-${i + 1}.txt`), 'utf8'));

// The first call closes the dialogue and writes the template; later calls check it.
function cmdNote([run, name]) {
  if (!run || !name) die('usage: note <run> <cell>');
  const plan = loadRun(run);
  const cell = loadCell(plan, name);
  const p = join(recDir(run, name), 'notes.json');
  const n = turnCount(run, name);
  if (!existsSync(p)) {
    if (!n) die(`${name} has no turn yet`);
    writeJson(p, { lastTurn: n, items: null, notes: '' });
    releaseHome(plan, cell.arm, name);
    console.log(`${name} is closed after turn ${n}; wrote a template: ${p}\n`
      + 'fill items with every decision item the AI raised that the opening request did not contain: '
      + '{ "turn", "via": "asked"|"presented", "item", "span" } (see references/runbook.md §Notes)');
    return;
  }
  const notes = readJson(p);
  const errors = validateNotes(notes, { turnTexts: turnTexts(run, name, n) });
  if (errors.length) die(`${p}:\n  - ${errors.join('\n  - ')}`);
  const asked = notes.items.filter((x) => x.via === 'asked').length;
  console.log(`${p}: complete — ${notes.items.length} item(s), ${asked} asked, ${notes.items.length - asked} presented`);
}

function cmdStatus([run]) {
  if (!run) die('usage: status <run>');
  const plan = loadRun(run);
  for (const { name } of cellList(plan)) {
    const rec = recDir(run, name);
    if (!existsSync(join(rec, 'cell.json'))) { console.log(`${name}: missing`); continue; }
    const n = turnCount(run, name);
    const metas = Array.from({ length: n }, (_, i) => turnMeta(run, name, i + 1));
    const firstChange = metas.findIndex((m) => m.treeChangedSinceScaffold) + 1;
    const bits = [
      `${n} turn(s)`,
      n ? `turn 1 ${metas[0].treeChanged ? 'wrote code' : 'stopped before code'}` : null,
      firstChange ? `first implementation at turn ${firstChange}` : (n ? 'no implementation yet' : null),
      existsSync(join(rec, 'notes.json')) ? 'closed, notes present' : null,
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
  releaseHome(plan, cell.arm, name);
  createCell(plan, c, { name, variant: cell.variant, arm: cell.arm, rep: cell.rep });
  console.log(`${name}: records moved to ${kept}; a fresh scaffold is in place`);
}

// ------------------------------------------------------------------ report

function cellRow(plan, c, name) {
  const rec = recDir(plan.run, name);
  const missing = ['cell.json', 'notes.json'].filter((f) => !existsSync(join(rec, f)));
  if (missing.length) return { skip: `missing ${missing.join(', ')}` };
  const cell = readJson(join(rec, 'cell.json'));
  const n = turnCount(plan.run, name);
  const turns = Array.from({ length: n }, (_, i) => turnMeta(plan.run, name, i + 1));
  const notes = readJson(join(rec, 'notes.json'));
  const errors = validateNotes(notes, { turnTexts: turnTexts(plan.run, name, n) });
  if (errors.length) return { skip: `notes.json: ${errors.join('; ')}` };
  const reasons = turns.flatMap((t) => t.integrity.reasons.map((r) => `turn ${t.turn}: ${r}`));
  const allowed = [c.pluginDir, join(codexHome(plan.run, cell.arm), 'plugins', 'cache')];
  const pathFlags = auditPaths(turns.flatMap((t) => t.commands || []), { ownDir: cellStateDir(plan.run, name), roots: [STATE, RESULTS, REPO], allowed });
  writeJson(join(rec, 'path-audit.json'), pathFlags);
  return { row: buildRow({ cell, turns, notes, integrity: { ok: reasons.length === 0, reasons }, pathFlags }) };
}

function cmdReport(argv) {
  const { flags, positionals } = parseArgs(argv);
  if (!positionals.length) die('usage: report <run> [<run> ...] [--out <dir>]');
  if (positionals.length > 1 && !flags.out) die('reporting several runs together needs --out <dir>');
  const out = resolve(flags.out || runDir(positionals[0]));
  const rows = []; const skipped = [];
  let c = null;
  for (const run of positionals) {
    const plan = loadRun(run);
    const next = loadCase(plan.case);
    if (c && c.name !== next.name) die('a report covers one case');
    c = next;
    for (const { name } of cellList(plan)) {
      const r = cellRow(plan, c, name);
      if (r.row) rows.push(r.row); else skipped.push(`${run}/${name}: ${r.skip}`);
    }
  }
  const arms = armCounts(rows);
  const requests = Object.fromEntries(Object.keys(c.spec.variants).map((v) => [v, taskBody(c, v)]));
  const scope = `case ${c.name}; runs ${positionals.join(', ')}; ${rows.length} cell(s) reported`;
  mkdirSync(out, { recursive: true });
  writeJson(join(out, 'results.json'), { rows, arms, skipped });
  let md = renderReport({ rows, arms, requests, scope });
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
  plan: cmdPlan, setup: cmdSetup, turn: cmdTurn, note: cmdNote, status: cmdStatus,
  reset: cmdReset, report: cmdReport, 'release-login': cmdReleaseLogin, teardown: cmdTeardown,
};
if (!commands[cmd]) die(`usage: outcome.mjs <${Object.keys(commands).join('|')}> ...`);
await commands[cmd](rest);
