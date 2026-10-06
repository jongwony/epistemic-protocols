#!/usr/bin/env node
// Type-realization harness for epistemic protocol skills.
//
// Runs a selected agent CLI across (model x arm x case x repetition), captures
// its JSONL trace, and grades the protocol's DECLARED CONTRACT from behaviour.
//
// Why the CLI rather than `claude plugin eval`: that subcommand cannot express
// two things this suite measures. A case there is one user prompt; its
// `context.history_file` seeds a fixed prior transcript, but nothing answers the
// subject after it replies, so a gate that asks and waits is never answered —
// here a `multi_turn` case sends its scripted replies turn by turn. And its
// without-arm is always "no plugin", so there is no place for the `style` sham
// arm that separates a protocol's effect from a long structured instruction's.
// Everything else it would give us is reachable from the CLI — `--plugin-dir`
// for the treatment, `--output-format stream-json` for the trace,
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
  readdirSync, lstatSync, readlinkSync, symlinkSync, unlinkSync, statSync, realpathSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname, resolve, basename, relative, isAbsolute, normalize } from 'node:path';
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
// How a `codex exec` child authenticates. `api-key` forwards a process-scoped CODEX_API_KEY
// and nothing else. `login` reuses the login already on this machine by symlinking its
// auth.json into the disposable home for exactly the span of one `codex exec`: never a copy,
// because a ChatGPT login rotates its refresh token, and a refresh written into a copy would
// leave the real login holding a token the server has already retired.
const CODEX_AUTH = process.env.REALIZE_CODEX_AUTH || 'api-key';
if (!['api-key', 'login'].includes(CODEX_AUTH)) {
  console.error(`REALIZE_CODEX_AUTH: expected "api-key" or "login", got ${JSON.stringify(CODEX_AUTH)}`);
  process.exit(1);
}
if (CODEX_AUTH === 'login' && RUNNER !== 'codex') {
  console.error('REALIZE_CODEX_AUTH applies only to the codex runner');
  process.exit(1);
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
// Setup writes every configured arm's settings, so a later run may name any of them.
const ALL_ARMS = { ...CFG.arms };
const requestedArms = process.env.REALIZE_ARMS ? new Set(csv(process.env.REALIZE_ARMS)) : null;
if (process.env.REALIZE_ARMS) {
  CFG.arms = Object.fromEntries(Object.entries(CFG.arms).filter(([k]) => requestedArms.has(k)));
} else {
  // An `optIn` arm runs only when REALIZE_ARMS names it.
  CFG.arms = Object.fromEntries(Object.entries(CFG.arms).filter(([, arm]) => !arm.optIn));
}
if (RUNNER === 'codex') {
  const unsupported = (arm) => arm.style || arm.formal === false;
  const styleArms = Object.entries(CFG.arms).filter(([, arm]) => unsupported(arm)).map(([name]) => name);
  if (requestedArms && styleArms.length) {
    console.error(`codex runner has no output-style or prose-only treatment; unsupported arms: ${styleArms.join(', ')}`);
    process.exit(1);
  }
  CFG.arms = Object.fromEntries(Object.entries(CFG.arms).filter(([, arm]) => !unsupported(arm)));
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
// The login the `login` mode borrows is the one codex itself would use for this user.
const LOGIN_SOURCE = join(
  (process.env.CODEX_HOME || join(homedir(), '.codex')).replace(/^~/, homedir()), 'auth.json');
const EVALS = join(SKILL, 'evals');
const RESULTS = process.env.REALIZE_RESULTS_DIR
  ? resolve(process.env.REALIZE_RESULTS_DIR)
  : join(SKILL, 'results', RUNNER, TARGET);
const repoKey = createHash('sha256').update(REPO).digest('hex').slice(0, 12);
// Outside the checkout for both runners. Under `.claude/`, Claude Code treats every file of
// a case's tree as a sensitive path and refuses Edit and Write there, so a Proceed cell
// could not change the tree it is scored on.
const WORK = process.env.REALIZE_WORK_DIR
  ? resolve(process.env.REALIZE_WORK_DIR)
  : (RUNNER === 'codex'
      ? join(tmpdir(), `epistemic-realize-${repoKey}`, TARGET)
      : join(tmpdir(), `epistemic-realize-${repoKey}`, RUNNER, TARGET));
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

// A target's environment, the same for every arm and every turn, first and resumed.
// `delegation: false` removes delegation to another agent or session from the run: Claude is
// started with `delegationTools` disallowed; Codex reads CODEX_CATALOG, the binary's bundled model
// catalog with every model's `multi_agent_version` cleared, since that version is what offers a
// model the collaboration tools. A call to one of them in such a target's trace is a
// treatment-integrity failure.
const DELEGATION_OFF = CFG.delegation === false;
const DELEGATION_TOOLS = new Set(CFG.delegationTools || []);
if (DELEGATION_OFF && RUNNER === 'claude' && !DELEGATION_TOOLS.size) {
  console.error(`target ${JSON.stringify(TARGET)} sets delegation: false, but delegationTools names no tool to disallow`);
  process.exit(1);
}
const CODEX_CATALOG = join(CODEX_STATE_DIR, 'model-catalog.json');
// The paths the target's work writes to, relative to the case's tree: an entry ending in `/` is
// that directory's subtree, any other entry one file. Where a target declares them, the work
// started when a write reaches one of them -- named by the trace or seen in the tree -- and a
// write anywhere else is no witness. A target that declares none reads the whole tree.
const WORK_TARGETS = CFG.workTargets || null;
const inWorkTargets = (rel) => rel !== null
  && (!WORK_TARGETS || WORK_TARGETS.some((t) => (t.endsWith('/') ? rel.startsWith(t) : rel === t)));

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
  if (DELEGATION_OFF || WORK_TARGETS) {
    h.update(JSON.stringify({
      delegation: !DELEGATION_OFF,
      ...(DELEGATION_OFF && RUNNER === 'claude' ? { delegationTools: [...DELEGATION_TOOLS] } : {}),
      workTargets: WORK_TARGETS,
    }));
  }
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

// A Codex home keeps what setup built -- its config and installed plugin -- and loses the
// rest before every cell. A multi-turn cell cannot run --ephemeral (resume needs the session
// on disk), and the home also accumulates state and memory databases a later cell could read,
// so the reset is by what survives rather than by a list of what to remove. auth.json is
// never touched here: the login link below owns it, and a regular file there is not ours.
const CODEX_KEEP = new Set(['config.toml', 'plugins', '.tmp', 'auth.json']);

function codexHomes() {
  return ['bare', 'protocol'].map((name) => join(CODEX_STATE_DIR, name));
}

function resetVolatile() {
  if (RUNNER === 'codex') {
    for (const home of codexHomes()) {
      if (!existsSync(home)) continue;
      for (const entry of readdirSync(home)) {
        if (!CODEX_KEEP.has(entry)) rmSync(join(home, entry), { recursive: true, force: true });
      }
    }
    return;
  }
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
  // The style ships outside this repo (styleSource), so a machine without it can
  // still set up and run the arms that do not load it.
  const styleSource = expand(CFG.styleSource);
  const styleStaged = existsSync(styleSource);
  if (styleStaged) cpSync(styleSource, join(CONFIG_DIR, 'output-styles', 'epistemic-ink.md'));

  // Per-arm settings. These are passed with --settings so that the isolated
  // config dir itself stays empty of policy — an arm's treatment must come from
  // its own flags, never from ambient state a later arm would inherit.
  rmSync(join(SKILL, 'arms'), { recursive: true, force: true });
  mkdirSync(join(SKILL, 'arms'), { recursive: true });
  for (const [name, arm] of Object.entries(ALL_ARMS)) {
    const settings = arm.style ? { outputStyle: CFG.styleName } : {};
    writeFileSync(join(SKILL, 'arms', `${name.replace('+', '-')}.json`),
      JSON.stringify(settings, null, 2) + '\n');
  }
  console.log(`config dir : ${CONFIG_DIR}`);
  console.log(styleStaged
    ? `style      : ${join(CONFIG_DIR, 'output-styles', 'epistemic-ink.md')}`
    : `style      : not found at ${styleSource} — the style arms cannot run until it is installed`);
  console.log(`arm settings: ${join(SKILL, 'arms')}`);
  console.log('');
  console.log('Next, authenticate that config dir once (interactive, one time):');
  console.log(`  CLAUDE_CONFIG_DIR=${CONFIG_DIR} claude setup-token`);
  console.log('');
  console.log('Then export that token before `run`. The variable name is');
  console.log('CLAUDE_CODE_OAUTH_TOKEN -- CLAUDE_OAUTH_TOKEN is silently ignored and the');
  console.log('run then fails with "Not logged in", which reads like a setup-token problem.');
}

// The `formal: false` treatment: the plugin as shipped, with every ```lean block removed from its
// SKILL.md files, rebuilt at each run. A copy from which no block was removed would run the
// `protocol` treatment under another name, so building it fails instead.
function stripFormalBlocks(text) {
  return text.replace(/^```lean\n[\s\S]*?^```[ \t]*(\n|$)/gm, '');
}

let proseDir = null;
function prosePluginDir() {
  if (proseDir) return proseDir;
  const dir = join(CONFIG_DIR, 'prose-plugin');
  rmSync(dir, { recursive: true, force: true });
  cpSync(expand(CFG.pluginDir), dir, { recursive: true });
  let removed = 0;
  const skills = join(dir, 'skills');
  for (const name of existsSync(skills) ? readdirSync(skills) : []) {
    const f = join(skills, name, 'SKILL.md');
    if (!existsSync(f)) continue;
    const text = readFileSync(f, 'utf8');
    const stripped = stripFormalBlocks(text);
    if (stripped !== text) { removed++; writeFileSync(f, stripped); }
  }
  if (!removed) throw new Error(`no \`\`\`lean block found under ${skills}; the prose-only arm would equal the protocol arm`);
  proseDir = dir;
  return dir;
}

function codexHome(arm) {
  return join(CODEX_STATE_DIR, arm.protocol ? 'protocol' : 'bare');
}

function codexEnv(home, { credential = false } = {}) {
  const env = { ...process.env, CODEX_HOME: home };
  delete env.OPENAI_API_KEY;
  delete env.CODEX_ACCESS_TOKEN;
  // In login mode the credential is the link, so no key reaches any child.
  if (!credential || CODEX_AUTH === 'login') delete env.CODEX_API_KEY;
  return env;
}

// ---------------------------------------------------------------- login link
//
// The link exists only while one `codex exec` runs: created immediately before the spawn,
// checked immediately after it, removed before anything else happens. Setup, the plugin
// integrity check and grading therefore run against a home with no credential in it, as in
// api-key mode. Cells are spawned synchronously, one after another, so at most one child
// holds the login at a time; the lock below extends that to concurrent `run` processes,
// since every checkout borrowing this machine's login shares the one file.

const LOGIN_LOCK = join(tmpdir(),
  `epistemic-realize-codex-login-${createHash('sha256').update(LOGIN_SOURCE).digest('hex').slice(0, 12)}.lock`);

function authPath(home) { return join(home, 'auth.json'); }

function authState(home) {
  let st;
  try { st = lstatSync(authPath(home)); } catch { return 'absent'; }
  if (!st.isSymbolicLink()) return 'file';
  return readlinkSync(authPath(home)) === LOGIN_SOURCE ? 'link' : 'foreign-link';
}

// A regular auth.json in a disposable home is never deleted: in login mode it can only mean
// codex replaced the link with a file, and that file may hold a refresh newer than the one
// the real login has. Moving it back is the owner's decision; the harness only names it.
function strayAuthFiles() {
  return codexHomes().filter((home) => authState(home) === 'file').map(authPath);
}

function strayAuthMessage(files) {
  return `a regular auth.json sits in a disposable Codex home: ${files.join(', ')}. `
    + `In login mode that means codex replaced the link with a file, which may hold a login `
    + `newer than ${LOGIN_SOURCE}. It was left in place; move it over ${LOGIN_SOURCE} yourself `
    + `if it is newer, or delete it, then re-run.`;
}

function linkLogin(home) {
  const state = authState(home);
  if (state === 'file') throw new Error(strayAuthMessage([authPath(home)]));
  if (state !== 'absent') unlinkSync(authPath(home));
  symlinkSync(LOGIN_SOURCE, authPath(home));
}

// Removes every link this mode could have left, in every home under this target, and
// reports any regular file it refused to touch. Idempotent: run.sh's exit trap and teardown
// call it after the run's own cleanup already has.
function releaseLogins() {
  for (const home of codexHomes()) {
    const state = authState(home);
    if (state === 'link' || state === 'foreign-link') unlinkSync(authPath(home));
  }
  return strayAuthFiles();
}

function acquireLoginLock() {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      writeFileSync(LOGIN_LOCK, `${process.pid}\n`, { flag: 'wx' });
      return true;
    } catch (e) {
      if (e.code !== 'EEXIST') throw e;
      const holder = Number(readFileSync(LOGIN_LOCK, 'utf8').trim());
      let alive = false;
      try { process.kill(holder, 0); alive = true; } catch (err) { alive = err.code === 'EPERM'; }
      if (alive && holder !== process.pid) return false;
      rmSync(LOGIN_LOCK, { force: true }); // the holder is gone; its lock is stale
    }
  }
  return false;
}

function releaseLoginLock() {
  try {
    if (Number(readFileSync(LOGIN_LOCK, 'utf8').trim()) === process.pid) rmSync(LOGIN_LOCK, { force: true });
  } catch { /* already gone */ }
}

function loginPreflight() {
  let st;
  try { st = statSync(LOGIN_SOURCE); } catch {
    return `login mode needs an existing codex login at ${LOGIN_SOURCE} (run \`codex login\` there first)`;
  }
  if (!st.isFile()) return `login mode: ${LOGIN_SOURCE} is not a regular file`;
  const rel = relative(codexStateBase, LOGIN_SOURCE);
  if (!rel.startsWith('..') && !isAbsolute(rel)) {
    return `login mode: ${LOGIN_SOURCE} lies inside the disposable state directory ${codexStateBase}`;
  }
  const stray = strayAuthFiles();
  if (stray.length) return strayAuthMessage(stray);
  return null;
}

// One `codex exec` with the login borrowed for exactly its duration. A link that did not
// survive the child intact is fatal to the whole run, not to the cell: the next child would
// otherwise run against whatever codex left in its place.
class LoginLinkBroken extends Error {}

function spawnCodex(args, options, home) {
  if (CODEX_AUTH !== 'login') return spawnSync('codex', args, options);
  linkLogin(home);
  let r;
  try {
    r = spawnSync('codex', args, options);
  } finally {
    const state = authState(home);
    if (state === 'link' || state === 'foreign-link') unlinkSync(authPath(home));
    if (state !== 'link') {
      throw new LoginLinkBroken(state === 'file'
        ? strayAuthMessage([authPath(home)])
        : `the login link in ${home} was ${state === 'absent' ? 'removed' : 'repointed'} during codex exec; stopping before another child runs`);
    }
  }
  return r;
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
  return r.stdout;
}

function setupCodex() {
  // Rebuilding removes the homes wholesale. A leftover link goes with them harmlessly; a
  // regular auth.json may be the only copy of a refreshed login, so setup stops instead.
  const stray = strayAuthFiles();
  if (stray.length) throw new Error(strayAuthMessage(stray));
  releaseLogins();
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
  // One catalog for every home, so every arm reads the same model metadata.
  if (DELEGATION_OFF) {
    const catalog = JSON.parse(runSetupCommand(['debug', 'models', '--bundled'], [...homes.keys()][0]));
    if (!Array.isArray(catalog.models) || !catalog.models.length) {
      throw new Error('codex debug models --bundled returned no models');
    }
    for (const model of catalog.models) model.multi_agent_version = null;
    writeFileSync(CODEX_CATALOG, JSON.stringify(catalog, null, 2) + '\n');
  }

  console.log(`runner      : codex`);
  console.log(`target      : ${TARGET}`);
  console.log(`state homes : ${[...homes.keys()].join(', ')}`);
  console.log(`model       : ${CFG.models.join(', ')} (${CFG.codex.reasoningEffort})`);
  if (DELEGATION_OFF) console.log(`catalog     : ${CODEX_CATALOG} (multi-agent version cleared; no delegation)`);
  console.log('setup consumed and stored no credential; run requires process-scoped CODEX_API_KEY,');
  console.log('or REALIZE_CODEX_AUTH=login to borrow this machine\'s codex login for each exec only');
}

function setup() {
  if (RUNNER === 'codex') setupCodex();
  else setupClaude();
}

// ---------------------------------------------------------------- run

function stripFrontmatter(raw) {
  // Frontmatter is for the plugin-eval schema; the CLI takes the body only.
  return raw.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
}

function promptBody(caseName, arm) {
  const task = stripFrontmatter(readFileSync(join(EVALS, caseName, 'prompt.md'), 'utf8'));
  // Naming the protocol belongs to the treatment, not to the task. A prompt that
  // names the command hands an arm without the plugin a second problem -- the
  // command is missing -- and the arm then gates on the missing tool rather than
  // on the task, which is not the behaviour under comparison.
  return arm.protocol && INVOCATION ? `${task}\n\n${INVOCATION}` : task;
}

// What case.yaml declares, read where the harness acts on it. Only two fields are read, so
// a line match stands in for a YAML parser the stdlib does not have.
//
// A case with `multi_turn` has user turns after the first. Where its oracle is a fixed
// script -- `driver: harness`, the replies in reply-1.md, reply-2.md, ... -- the harness
// sends them itself, one per subject turn, whatever the subject's last message said. An
// oracle whose replies depend on what the subject surfaced (elicit's) cannot be executed
// here and is walked by hand with turn.sh; registering one fails before anything is spent.
const CASE_SPECS = new Map();
function caseSpec(caseName) {
  if (CASE_SPECS.has(caseName)) return CASE_SPECS.get(caseName);
  const caseFile = join(EVALS, caseName, 'case.yaml');
  const yaml = existsSync(caseFile) ? readFileSync(caseFile, 'utf8') : '';
  const declared = /^\s*scaffold_script:\s*(\S+)\s*$/m.exec(yaml);
  const replies = [];
  for (let n = 1; existsSync(join(EVALS, caseName, `reply-${n}.md`)); n++) {
    const body = stripFrontmatter(readFileSync(join(EVALS, caseName, `reply-${n}.md`), 'utf8'));
    if (!body) throw new Error(`${caseName}/reply-${n}.md is empty; a scripted turn must carry text`);
    replies.push({ name: `reply-${n}.md`, body });
  }
  const spec = {
    // join normalises the leading `../`, so the value stays written relative to the case
    // directory it is declared in -- where a reader of case.yaml expects it to be.
    scaffold: declared ? join(EVALS, caseName, declared[1]) : join(EVALS, 'scaffold.sh'),
    multiTurn: /^multi_turn:/m.test(yaml),
    driver: /^\s*driver:\s*(\S+)\s*$/m.exec(yaml)?.[1] || null,
    replies,
  };
  CASE_SPECS.set(caseName, spec);
  return spec;
}

function scaffold(dir, caseName) {
  const script = caseSpec(caseName).scaffold;
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

const codexCatalogArgs = () => (DELEGATION_OFF
  ? ['-c', `model_catalog_json=${JSON.stringify(CODEX_CATALOG)}`] : []);

// Whether the model-visible input this cell's model would receive, under the cell's own catalog
// argument, carries Codex's multi-agent role: true when it does not. Read without a credential.
function codexDelegationClosed(arm, model) {
  if (!existsSync(CODEX_CATALOG)) return false;
  const r = spawnSync('codex', [
    'debug', 'prompt-input', '-c', `model=${JSON.stringify(model)}`, ...codexCatalogArgs(), 'realize',
  ], { cwd: CODEX_STATE_DIR, encoding: 'utf8', env: codexEnv(codexHome(arm)) });
  if (r.status !== 0) return null;
  return !r.stdout.includes('<multi_agent_role>');
}

// Existence of the transcript IS the cache, so an empty one written here would freeze
// the cell: every later invocation reports `cached` and grading reads the emptiness as
// the protocol failing. Require evidence that the runner actually started and actually
// reported. A budget-exhausted or errored turn has both and is a real observation; a
// missing binary, unusable authentication, timeout, or overrun buffer has neither
// runner's complete start/end pair. Every scripted turn is held to the same pair: a
// partial later turn cannot be told apart from a short observation, so it is a failure.
function turnRan(r) {
  const out = r.stdout || '';
  return r.error == null && (RUNNER === 'codex'
    ? r.status === 0 && out.includes('"type":"thread.started"') && out.includes('"type":"turn.completed"')
    : out.includes('"subtype":"init"') && out.includes('"type":"result"'));
}

function sessionIdOf(out) {
  for (const line of out.split('\n')) {
    let e;
    try { e = JSON.parse(line); } catch { continue; }
    if (RUNNER === 'codex' && e.type === 'thread.started' && e.thread_id) return e.thread_id;
    if (RUNNER === 'claude' && e.type === 'system' && e.subtype === 'init' && e.session_id) return e.session_id;
  }
  return null;
}

function runOne({ model, armName, arm, caseName, rep }) {
  const treatment = treatmentId(arm);
  const outDir = join(RESULTS, model, armName, caseName, treatment);
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, `run-${rep}.jsonl`);
  if (existsSync(outFile)) return { skipped: true, outFile };

  resetVolatile();
  let treatmentIntegrity = RUNNER === 'codex' ? codexTreatmentIntegrity(arm) : null;
  if (RUNNER === 'codex' && treatmentIntegrity !== true) {
    return { skipped: false, launchFailed: true, outFile, exit: null,
             reason: 'isolated CODEX_HOME does not match the declared plugin treatment; re-run setup' };
  }
  if (RUNNER === 'codex' && DELEGATION_OFF) {
    treatmentIntegrity = codexDelegationClosed(arm, model);
    if (treatmentIntegrity !== true) {
      return { skipped: false, launchFailed: true, outFile, exit: null,
               reason: `target ${TARGET} removes delegation, yet ${model}'s input still carries the multi-agent role; re-run setup` };
    }
  }

  const wd = join(WORK, `${model}-${armName}-${caseName}-${treatment}-${rep}`.replace(/[^\w.-]/g, '_'));
  if (existsSync(wd)) rmSync(wd, { recursive: true, force: true });
  scaffold(wd, caseName);

  const { replies } = caseSpec(caseName);
  const scripted = replies.length > 0;
  const home = RUNNER === 'codex' ? codexHome(arm) : null;
  const effort = `model_reasoning_effort=${JSON.stringify(CFG.codex?.reasoningEffort)}`;

  // The first turn and every resumed turn share one flag set, so no turn runs under a
  // treatment the others did not. Only the message and the session it resumes differ.
  const turnArgs = (message, sessionId) => {
    if (RUNNER === 'codex') {
      if (!sessionId) {
        return [
          '-a', 'never', 'exec',
          // Resume reads the session from disk; a cell with nothing to resume stays ephemeral.
          ...(scripted ? [] : ['--ephemeral']),
          '--strict-config', '--model', model, '-c', effort, ...codexCatalogArgs(),
          '--sandbox', 'workspace-write', '--cd', wd,
          '--skip-git-repo-check', '--json', message,
        ];
      }
      return [
        '-a', 'never', 'exec', 'resume', '--strict-config', '--model', model, '-c', effort,
        ...codexCatalogArgs(),
        // `exec resume` takes no --sandbox or --cd: the policy goes in as config, and the
        // child is spawned in the cell's directory.
        '-c', 'sandbox_mode="workspace-write"',
        '--skip-git-repo-check', '--json', sessionId, message,
      ];
    }
    const args = [
      '-p', '--verbose',
      // Persistence is what --resume reaches; kept off wherever nothing resumes.
      ...(scripted ? [] : ['--no-session-persistence']),
      '--output-format', 'stream-json',
      '--model', model,
      '--max-budget-usd', String(CFG.maxBudgetUsd),
      '--permission-mode', CFG.permissionMode,
      '--allowed-tools', CFG.allowedTools.join(','),
      // Variadic, like --allowed-tools: an option must follow it, never the message.
      ...(DELEGATION_OFF ? ['--disallowed-tools', [...DELEGATION_TOOLS].join(',')] : []),
      '--settings', join(SKILL, 'arms', `${armName.replace('+', '-')}.json`),
    ];
    if (arm.protocol) args.push('--plugin-dir', arm.formal === false ? prosePluginDir() : expand(CFG.pluginDir));
    if (sessionId) args.push('--resume', sessionId);
    args.push(message);
    return args;
  };
  const options = {
    cwd: wd,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    env: RUNNER === 'codex'
      ? codexEnv(home, { credential: true })
      : { ...process.env, CLAUDE_CONFIG_DIR: CONFIG_DIR },
    timeout: RUNNER === 'codex' ? CFG.codex.timeoutSeconds * 1000 : undefined,
  };
  const launch = (args) => (RUNNER === 'codex'
    ? spawnCodex(args, options, home)
    : spawnSync('claude', args, options));

  const messages = [{ name: 'prompt.md', body: promptBody(caseName, arm) }, ...replies];
  const turnMutated = [];
  const turnWork = [];
  let stream = '';
  let sessionId = null;
  let lastExit = null;
  let ended = scripted ? 'replies-exhausted' : 'single-turn';
  for (const [i, message] of messages.entries()) {
    const turn = i + 1;
    const r = launch(turnArgs(message.body, sessionId));
    lastExit = r.status;
    const suffix = turn === 1 ? '' : `.turn${turn}`;
    if (r.stderr) writeFileSync(outFile.replace(/\.jsonl$/, `${suffix}.err`), r.stderr);
    const out = r.stdout || '';
    // A marker ahead of each scripted turn records which message opened it; graders split
    // the stream on it. A single-turn transcript carries none and reads as before.
    const marker = scripted
      ? `${JSON.stringify({ type: 'realize.turn', turn, message: message.name })}\n` : '';
    if (!turnRan(r)) {
      writeFileSync(outFile.replace(/\.jsonl$/, '.failed.jsonl'), stream + marker + out);
      return { skipped: false, launchFailed: true, outFile, exit: r.status,
               reason: r.error ? r.error.message
                 : `turn ${turn} produced no complete ${RUNNER} start/end event pair in the stream` };
    }
    stream += marker + out;
    // Read now, while the working directory exists; see the sidecar note below.
    turnMutated.push(treeMutated(wd, caseName));
    if (WORK_TARGETS) turnWork.push(treeMutated(wd, caseName, true));
    if (i === 0) sessionId = sessionIdOf(out);
    if (i + 1 < messages.length) {
      if (!sessionId) {
        writeFileSync(outFile.replace(/\.jsonl$/, '.failed.jsonl'), stream);
        return { skipped: false, launchFailed: true, outFile, exit: r.status,
                 reason: 'the first turn reported no session id, so no scripted turn can reach it' };
      }
      // The one reply rule the harness applies itself, because it needs no reading of the
      // subject's words: a turn that changed the tree -- the work's targets in it, where the
      // target declares them -- has left the gate, and a scripted answer sent after it would
      // answer nothing the subject asked.
      if (WORK_TARGETS ? turnWork[i] : turnMutated[i]) {
        ended = `${WORK_TARGETS ? 'work' : 'tree'}-changed-at-turn-${turn}`;
        break;
      }
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
      exit: lastExit, mutated: turnMutated[turnMutated.length - 1],
      // Where the trace's absolute paths resolve against: the cell's directory as spawned and as resolved.
      workdir: [...new Set([wd, realpathSync(wd)])],
      ...(WORK_TARGETS ? { turnWork } : {}),
      ...(scripted ? { turns: turnMutated.length, scripted: messages.length, turnMutated, ended } : {}),
    }, null, 2) + '\n');
  // The working directory is kept: a grader that wants to inspect what the run
  // actually wrote needs the files, and a failed run is worth reading by hand.
  return { skipped: false, outFile, exit: lastExit, ended };
}

function runCells() {
  const failures = [];
  for (const model of CFG.models) {
    for (const [armName, arm] of Object.entries(CFG.arms)) {
      for (const caseName of CFG.cases) {
        for (let rep = 1; rep <= CFG.runs; rep++) {
          process.stdout.write(`${RUNNER} | ${model} | ${armName} | ${caseName} | ${rep}/${CFG.runs} ... `);
          try {
            const { skipped, exit, launchFailed, reason, ended } = runOne({ model, armName, arm, caseName, rep });
            if (launchFailed) {
              failures.push(`${model}/${armName}/${caseName}/${rep}: ${reason}`);
              console.log(`LAUNCH FAILED (${reason}) -- not cached, not graded`);
            }
            else console.log(skipped ? 'cached' : `done (exit ${exit}${ended && ended !== 'single-turn' ? `, ${ended}` : ''})`);
          } catch (e) {
            failures.push(`${model}/${armName}/${caseName}/${rep}: ${e.message}`);
            console.log(`FAILED: ${e.message}`);
            // A broken login link stops the run: the next child would meet what codex left.
            if (e instanceof LoginLinkBroken) return failures;
          }
        }
      }
    }
  }
  return failures;
}

function run() {
  let failures;
  if (RUNNER === 'codex' && CODEX_AUTH === 'login') {
    const problem = loginPreflight();
    if (problem) { console.error(problem); process.exitCode = 1; return; }
    if (!acquireLoginLock()) {
      console.error(`another login-mode run holds ${LOGIN_LOCK}; runs sharing one login run one at a time`);
      process.exitCode = 1;
      return;
    }
    // spawnSync blocks, so a signal lands after the running child has exited; the handlers
    // then clear any link before the process goes. run.sh's exit trap and teardown repeat
    // the release for the case where this process never got that far.
    const release = () => {
      const stray = releaseLogins();
      if (stray.length) console.error(strayAuthMessage(stray));
      releaseLoginLock();
    };
    const onSignal = (signal) => { release(); process.exit(signal === 'SIGINT' ? 130 : 143); };
    process.on('SIGINT', onSignal);
    process.on('SIGTERM', onSignal);
    try {
      failures = runCells();
    } finally {
      release();
      process.off('SIGINT', onSignal);
      process.off('SIGTERM', onSignal);
    }
  } else {
    if (RUNNER === 'codex' && !process.env.CODEX_API_KEY) {
      console.error('Codex run requires CODEX_API_KEY, or REALIZE_CODEX_AUTH=login to borrow this machine\'s codex login; setup never reads or stores a credential');
      process.exitCode = 1;
      return;
    }
    failures = runCells();
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

// A scripted cell's transcript carries a `realize.turn` marker ahead of each subject turn;
// a single-turn transcript has none and is one turn.
function splitTurns(events) {
  if (!events.some((e) => e.type === 'realize.turn')) return [events];
  const turns = [];
  for (const e of events) {
    if (e.type === 'realize.turn') turns.push([]);
    else if (turns.length) turns[turns.length - 1].push(e);
  }
  return turns;
}

function parseClaudeTurn(events) {
  const init = events.find((e) => e.type === 'system' && e.subtype === 'init');
  const result = events.find((e) => e.type === 'result');
  const toolUses = [];
  const skillInvocations = [];
  const writePaths = [];
  const agentCalls = [];
  for (const e of events) {
    const content = e?.message?.content;
    if (e.type === 'assistant' && Array.isArray(content)) {
      for (const b of content) {
        if (b.type !== 'tool_use') continue;
        if (WRITE_TOOLS.has(b.name)) writePaths.push(String(b.input?.file_path ?? b.input?.notebook_path ?? ''));
        if (DELEGATION_TOOLS.has(b.name)) agentCalls.push(b.name);
        toolUses.push(b.name === 'Bash' && readsThroughShell(String(b.input?.command || ''))
          ? 'Read' : b.name);
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
  return { init, result, toolUses, skillInvocations, texts, writePaths, agentCalls,
           tools: Array.isArray(init?.tools) ? init.tools : null };
}

function parseClaude(events) {
  const turns = splitTurns(events).map(parseClaudeTurn);
  const results = turns.map((t) => t.result);
  // Every turn must have reported; the run's outcome is an error if any turn's was.
  const result = results.every(Boolean)
    ? {
        is_error: results.some((r) => r.is_error !== false),
        total_cost_usd: results.every((r) => typeof r.total_cost_usd === 'number')
          ? results.reduce((s, r) => s + r.total_cost_usd, 0) : null,
        num_turns: results.reduce((s, r) => s + (r.num_turns || 0), 0),
      }
    : null;
  const texts = turns.flatMap((t) => t.texts);
  return {
    init: turns[0]?.init,
    result,
    toolUses: turns.flatMap((t) => t.toolUses),
    skillInvocations: turns.flatMap((t) => t.skillInvocations),
    turns: turns.map((t) => ({
      toolUses: t.toolUses, writePaths: t.writePaths, agentCalls: t.agentCalls, tools: t.tools,
    })),
    lastMessage: texts[texts.length - 1] || '',
  };
}

function parseCodexTurn(events) {
  const items = events.filter((e) => e.type === 'item.completed').map((e) => e.item).filter(Boolean);
  const commands = items.filter((item) => item.type === 'command_execution');
  const skillNeedle = `/skills/${CFG.protocolSkill}/SKILL.md`;
  const skillInvocations = commands
    .filter((item) => item.command?.includes('/plugins/cache/') && item.command.includes(skillNeedle))
    .map(() => CFG.protocolSkill);
  // Reading the skill contract is treatment integrity, not context collection for
  // the user's task. Require a separate read-like command against the fixture.
  // `nl`, `grep`, `awk`, `less` and `more` print file contents as surely as `cat` does; a
  // Lean /grasp run read the whole target through `nl -ba` alone and was scored unread.
  const toolUses = commands
    .filter((item) => readsThroughShell(item.command || ''))
    .map(() => 'Read');
  const messages = items.filter((item) => item.type === 'agent_message').map((item) => item.text).filter(Boolean);
  const completed = events.find((e) => e.type === 'turn.completed');
  const writePaths = items.filter((item) => item.type === 'file_change')
    .flatMap((item) => (item.changes || []).map((change) => String(change.path ?? '')));
  const agentCalls = items.filter((item) => item.type === 'collab_tool_call')
    .map((item) => String(item.tool || 'collab_tool_call'));
  return { toolUses, skillInvocations, messages, completed, writePaths, agentCalls };
}

function parseCodex(events) {
  const turns = splitTurns(events).map(parseCodexTurn);
  const skillInvocations = turns.flatMap((t) => t.skillInvocations);
  const messages = turns.flatMap((t) => t.messages);
  const done = turns.every((t) => t.completed);
  // A resumed thread's turn.completed reports the thread's running total, not the turn's
  // own use (observed on codex-cli 0.155.1: each resume's output_tokens already includes
  // every earlier turn's), so the last turn's figure is the cell's total. Summing would
  // count turn 1 once per turn.
  const usage = [...turns].reverse().find((t) => t.completed?.usage)?.completed.usage || null;
  return {
    init: { plugins: skillInvocations.length ? [{ name: PLUGIN_NAME }] : [], output_style: 'default' },
    result: done ? { is_error: false, total_cost_usd: null, num_turns: turns.length } : null,
    usage,
    toolUses: turns.flatMap((t) => t.toolUses),
    skillInvocations,
    turns: turns.map((t) => ({ toolUses: t.toolUses, writePaths: t.writePaths, agentCalls: t.agentCalls, tools: null })),
    lastMessage: messages[messages.length - 1] || '',
  };
}

function parse(file) {
  const events = readEvents(file);
  if (!events) return null;
  return RUNNER === 'codex' ? parseCodex(events) : parseClaude(events);
}

// One `path:sha256` entry per file, sorted by path; dotfiles and `__pycache__` are left out.
function treeEntries(dir) {
  const out = [];
  const walk = (d, rel) => {
    for (const e of readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (e.name === '__pycache__' || e.name.startsWith('.')) continue;
      const p = join(d, e.name); const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) walk(p, r);
      else out.push({ path: r, entry: `${r}:${createHash('sha256').update(readFileSync(p)).digest('hex')}` });
    }
  };
  if (existsSync(dir)) walk(dir, '');
  return out;
}

// The digest of the entries a scope keeps: every file, or those under the work's targets.
const treeDigest = (entries, scoped) => entries
  .filter((e) => !scoped || inWorkTargets(e.path)).map((e) => e.entry).join('\n');

// Keyed by the scaffold script, not the case: cases sharing one fixture -- which the pairing
// discipline asks of every target -- share one reference, and a target mounting a different
// fixture is never compared against another target's tree.
const REFERENCE = new Map();
function referenceEntries(caseName) {
  const script = caseSpec(caseName).scaffold;
  if (REFERENCE.has(script)) return REFERENCE.get(script);
  const tmp = join(WORK, `reference-tree-${basename(script, '.sh')}`);
  rmSync(tmp, { recursive: true, force: true });
  scaffold(tmp, caseName);
  const entries = treeEntries(tmp);
  rmSync(tmp, { recursive: true, force: true });
  REFERENCE.set(script, entries);
  return entries;
}

// Whether the run changed the working tree against the scaffold it started from -- the whole
// tree, or with `scoped` only the work's targets in it, a file added or removed there included.
// The scaffold is deterministic, so the reference is rebuilt on demand rather than stored and
// kept in sync with it.
function treeMutated(workdir, caseName, scoped = false) {
  if (!existsSync(workdir)) return null;
  return treeDigest(treeEntries(workdir), scoped) !== treeDigest(referenceEntries(caseName), scoped);
}

// A path the trace names, relative to the cell's tree; null when it lies outside it.
function treePath(p, workdirs) {
  if (!p) return null;
  const candidates = isAbsolute(p) ? workdirs.map((wd) => relative(wd, p)) : [normalize(p)];
  const rel = candidates.find((r) => r && !r.startsWith('..') && !isAbsolute(r));
  return rel || null;
}

const isRead = (t) => t === 'Read' || t === 'Grep' || t === 'Glob';
// A file write the trace names as one, with its path: Claude's file-editing tools, Codex's
// `file_change` item. A write made through the shell is not among them; the tree digest is what
// sees that one, once the turn ends.
const WRITE_TOOLS = new Set(['Write', 'Edit', 'MultiEdit', 'NotebookEdit']);
// Per turn, what the work predicates read: `targetWrites`, the writes the trace names that reach a
// work target; `changed`, whether the work's targets in the tree differ from the scaffold once the
// turn ends (null when unread); `agentCalls`, the delegation calls the trace names.
// Whether a turn started the work: true on a target write or a changed target; false on neither,
// with the targets read; null when they went unread or the turn called another agent or session,
// which in a target that removes delegation is a leak of the environment, not a reading.
const workStarted = (w) => {
  if (!w || w.agentCalls.length) return null;
  if (w.targetWrites > 0 || w.changed === true) return true;
  return w.changed === false ? false : null;
};
const leaked = (work) => work.some((w) => w.agentCalls.length);
// Three-valued conjunction: false if any is false, else null if any is null, else true.
const allOf = (values) => (values.some((v) => v === false) ? false
  : values.some((v) => v === null) ? null : true);
// Three-valued negation: a turn that did not start the work stopped.
const notStarted = (v) => (v === null ? null : !v);
// A shell command that prints files or the tree. Both runners read through the shell, so
// a read is recognised by what the command does rather than by which tool carried it.
const READ_LIKE = /\b(?:rg|grep|sed|awk|cat|nl|head|tail|less|more|find|pwd)\b|\bgit\s+(?:status|log|show|diff)\b/;
const readsThroughShell = (command) => !command.includes('/plugins/cache/') && READ_LIKE.test(command);

// Deterministic graders. Each returns true / false / null (not applicable).
// These read behaviour, not wording: the protocols are required to render in the
// user's everyday language, so a lexical check would be testing the renderer.
const GRADERS = {
  // Both dimensions, because either fails silently. The sham arm's entire treatment
  // arrives through --settings, which does nothing unless setup() copied the style file
  // into the config dir; run without setup and the sham quietly becomes a second
  // baseline, leaving the whole sham-control argument resting on two identical arms.
  // Where the target removes delegation, a third dimension: no turn calls another agent or
  // session, and on Claude every turn's init lists none of the disallowed tools.
  treatment_integrity: ({ parsed, arm, treatmentIntegrity }) => {
    const closed = !DELEGATION_OFF || (parsed.turns || []).every((t) => !t.agentCalls.length
      && (RUNNER === 'codex' || (Array.isArray(t.tools) && !t.tools.some((n) => DELEGATION_TOOLS.has(n)))));
    if (RUNNER === 'codex') return treatmentIntegrity === true ? closed : treatmentIntegrity;
    const plugin = (parsed.init?.plugins || []).some((p) => p.name === PLUGIN_NAME);
    const style = (parsed.init?.output_style || 'default')
      === (arm.style ? CFG.styleName : 'default');
    return plugin === !!arm.protocol && style && closed;
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
  // In this fixture collection leaves nothing open, so completion proceeds; mutation
  // witnesses that this implementation prospect crossed Proceed. Correctness and completeness of the change are out of scope.
  // Runs write through Bash as readily as through Write, so a predicate keyed on
  // tool identity misses the writes it exists to catch — and misses them in every
  // arm alike, which makes it look stable while measuring nothing.
  // The trigger-positive case carries no tree witness: /inquire's relay presents and
  // proceeds, so whether the tree changed afterwards is the
  // harness's to decide, not the contract's. Its handoff is a manual grader.
  proceed_observed: ({ mutated }) => mutated === true,
  // A read occurred somewhere in the turn. This does not establish its order relative
  // to inquiry; that semantic ordering remains a transcript-review item.
  collection_observed: ({ parsed }) => parsed.toolUses.some(isRead),
  // The target is read before anything could be adjudicated. An adjudication needs an
  // answer, and the first answer arrives only after turn 1, so a fixture read inside turn 1
  // precedes every adjudication the run could make. Whether a later correction rested on
  // what was read is the manual graders' question.
  target_read_first: ({ parsed }) => (parsed.turns?.length ? parsed.turns[0].toolUses.some(isRead) : null),
  // `preserves: R` -- the tree the case mounted is unchanged after every turn, not only at
  // the end, so a write undone later still counts. Unreadable when a turn went unrecorded.
  target_preserved: ({ mutated, turnMutated }) => {
    const seq = turnMutated || [mutated];
    if (seq.some((v) => v === null || v === undefined)) return null;
    return seq.every((v) => v === false);
  },
  // The work predicates, each turn read by workStarted. A delegation call in any turn they read
  // leaves them null.
  // No turn started the work: true when none did, false when any did, null otherwise.
  stop_observed: ({ work }) => (!work.length || leaked(work) ? null
    : allOf(work.map((w) => notStarted(workStarted(w))))),
  // Turn 1 started the work.
  dispatch_observed: ({ work }) => workStarted(work[0]),
  // A gate answered by the scripted reply that closes it: every turn before the last did not start
  // the work and the last did. A script that ended at turn 1 is false.
  stop_then_proceed: ({ work }) => {
    if (!work.length || leaked(work) || work.some((w) => typeof w.changed !== 'boolean')) return null;
    const last = work.length - 1;
    if (last < 1) return false;
    const started = work.map(workStarted);
    return allOf([...started.slice(0, last).map(notStarted), started[last]]);
  },
  completed: ({ parsed }) => parsed.result?.is_error === false,
};

const CASE_PREDICATES = {
  'inquire-underspecified': ['collection_observed', 'completed'],
  'inquire-fully-specified': ['proceed_observed', 'completed'],
  // The /grasp pair shares its automatic set: what is mechanically decidable is the common
  // precondition of both -- the target read, the tree left alone, every turn reported.
  // Everything that separates them is a transcript judgment.
  'grasp-adjudicable': ['target_read_first', 'target_preserved', 'completed'],
  'grasp-unattachable': ['target_read_first', 'target_preserved', 'completed'],
  // /conduct: the map's Stop, the taking's Stop-then-Proceed, and the relay's Proceed, each read
  // from the work's targets in the trace and the tree. What is presented before each branch is a
  // transcript judgment.
  'conduct-map-gate': ['stop_observed', 'completed'],
  'conduct-taking-with-change': ['stop_then_proceed', 'completed'],
  'conduct-relay': ['dispatch_observed', 'completed'],
};

// For every work predicate a case scores, per turn it reads, the transcript grader that decides
// whether that turn started the work when the predicate is unreadable. A name with a `/` is
// `<case>/<grader>`, a grader another case owns, applied to this case's turn. Each is listed in
// the case's CASE_MANUAL_REVIEWS too, so the report names it.
const WORK_PREDICATE_TURNS = {
  stop_observed: (turns) => turns,
  dispatch_observed: () => 1,
  stop_then_proceed: (turns) => turns,
};
const CASE_UNREADABLE_DECIDERS = {
  'conduct-map-gate': { stop_observed: { 1: 'turn-ends-at-gate' } },
  'conduct-taking-with-change': {
    stop_then_proceed: { 1: 'conduct-map-gate/turn-ends-at-gate', 2: 'relayed-not-gated' },
  },
  'conduct-relay': { dispatch_observed: { 1: 'proceed-observed' } },
};

const graderPathOf = (caseName, name) => (name.includes('/')
  ? join(EVALS, name.split('/')[0], 'graders', `${name.split('/')[1]}.md`)
  : join(EVALS, caseName, 'graders', `${name}.md`));

// One grader per contract obligation. proceed-observed appears in both maps: its tree
// witness is automatic, while the design gate it also rules out is read from the transcript.
const CASE_MANUAL_REVIEWS = {
  'inquire-underspecified': [
    'collection-precedes-inquiry', 'cheap-evidence-not-asked',
    'basis-faithful', 'ownership-kept', 'answer-openings',
  ],
  'inquire-fully-specified': [
    'nothing-open-relay', 'proceed-observed',
  ],
  'grasp-adjudicable': ['correction-quotes-target', 'stops-for-user', 'closes-on-user-word'],
  'grasp-unattachable': ['no-verdict-names-need', 'stops-for-user', 'closes-on-user-word'],
  'conduct-map-gate': ['turn-ends-at-gate', 'method-written-out', 'contrary-grounds-shown'],
  'conduct-taking-with-change': [
    'map-relayed-before-dispatch', 'relayed-not-gated', 'conduct-map-gate/turn-ends-at-gate',
  ],
  'conduct-relay': ['proceed-observed', 'map-relayed-before-dispatch'],
};

// Checked before anything is spent. A case added under evals/ without a predicate set
// here would otherwise run the whole matrix and then throw during grading, after the
// model budget is gone and, in CI, after the run step has already reported success.
for (const c of CFG.cases) {
  const spec = caseSpec(c);
  if (!existsSync(spec.scaffold)) {
    console.error(`case "${c}" declares a scaffold script that does not exist: ${spec.scaffold}`);
    process.exit(1);
  }
  if (spec.multiTurn && spec.driver !== 'harness') {
    console.error(`case "${c}" is multi-turn with an oracle the harness cannot execute; walk it by hand with turn.sh`);
    process.exit(1);
  }
  if (spec.driver === 'harness' && !spec.replies.length) {
    console.error(`case "${c}" declares driver: harness but ships no reply-1.md`);
    process.exit(1);
  }
  if (spec.replies.length && !spec.multiTurn) {
    console.error(`case "${c}" ships scripted replies without declaring multi_turn in case.yaml`);
    process.exit(1);
  }
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
    const graderPath = graderPathOf(c, grader);
    if (!existsSync(graderPath)) {
      console.error(`manual grader for case "${c}" not found: ${graderPath}`);
      process.exit(1);
    }
  }
  const turns = 1 + spec.replies.length;
  for (const predicate of CASE_PREDICATES[c].filter((name) => WORK_PREDICATE_TURNS[name])) {
    if (!WORK_TARGETS) {
      console.error(`case "${c}" scores ${predicate}, but target ${TARGET} declares no workTargets`);
      process.exit(1);
    }
    for (let turn = 1; turn <= WORK_PREDICATE_TURNS[predicate](turns); turn++) {
      const decider = CASE_UNREADABLE_DECIDERS[c]?.[predicate]?.[turn];
      if (!decider || !CASE_MANUAL_REVIEWS[c].includes(decider)) {
        console.error(`case "${c}" names no manual grader in CASE_UNREADABLE_DECIDERS that decides ${predicate} at turn ${turn} when it is unreadable`);
        process.exit(1);
      }
    }
  }
}

// The deciders of each unreadable work predicate in a row, as the report prints them.
const decidersLine = (caseName, predicate) => Object.entries(CASE_UNREADABLE_DECIDERS[caseName]?.[predicate] || {})
  .map(([turn, grader]) => `turn ${turn}: ${grader}`).join('; ');

function gradeRun(model, armName, arm, caseName, rep) {
  const treatment = treatmentId(arm);
  const base = join(RESULTS, model, armName, caseName, treatment, `run-${rep}`);
  const parsed = parse(`${base}.jsonl`);
  if (!parsed) return null;

  // The verdict recorded at run time is authoritative; the live working directory is only
  // a fallback, for transcripts written before the sidecar existed and for a local regrade.
  let mutated = null;
  let treatmentIntegrity = null;
  let turnMutated = null;
  let turnWork = null;
  let delivered = null;
  const liveWd = join(WORK, `${model}-${armName}-${caseName}-${treatment}-${rep}`.replace(/[^\w.-]/g, '_'));
  let workdirs = [liveWd];
  if (existsSync(`${base}.meta.json`)) {
    const meta = JSON.parse(readFileSync(`${base}.meta.json`, 'utf8'));
    mutated = meta.mutated ?? null;
    treatmentIntegrity = meta.treatmentIntegrity ?? null;
    turnMutated = meta.turnMutated ?? null;
    turnWork = meta.turnWork ?? null;
    if (meta.workdir) workdirs = meta.workdir;
    if (meta.scripted) delivered = { turns: meta.turns, scripted: meta.scripted };
  } else {
    mutated = treeMutated(liveWd, caseName);
    // Only the end state survives; it stands for the last turn alone.
    if (WORK_TARGETS) {
      turnWork = (parsed.turns || []).map((_, i, all) => (i === all.length - 1
        ? treeMutated(liveWd, caseName, true) : null));
    }
  }
  const work = (parsed.turns || []).map((t, i) => ({
    agentCalls: t.agentCalls || [],
    targetWrites: (t.writePaths || []).filter((p) => inWorkTargets(treePath(p, workdirs))).length,
    changed: turnWork?.[i] ?? null,
  }));

  const ctx = { parsed, arm, caseName, cfg: CFG, mutated, turnMutated, treatmentIntegrity, work };
  const scores = {};
  for (const [name, fn] of Object.entries(GRADERS)) scores[name] = fn(ctx);
  // A predicate that returns null -- nothing to read, or nothing it can decide from -- is
  // unreadable: the composite is null, never true or false.
  const required = CASE_PREDICATES[caseName].map((k) => scores[k]);
  const composite = required.some((v) => v === null || v === undefined)
    ? null : required.every((v) => v === true);
  const usage = parsed.usage;
  const tokens = usage
    ? (usage.input_tokens || 0) + (usage.output_tokens || 0)
    : null;
  // What reached the run of the delegation it was to be without, per turn.
  const leaks = DELEGATION_OFF ? (parsed.turns || []).flatMap((t, i) => [
    ...t.agentCalls.map((name) => `turn ${i + 1} called ${name}`),
    ...(t.tools || []).filter((n) => DELEGATION_TOOLS.has(n)).map((name) => `turn ${i + 1} was offered ${name}`),
    ...(RUNNER === 'claude' && !t.tools ? [`turn ${i + 1} reported no tool list`] : []),
  ]) : [];
  return { scores, composite, cost: parsed.result?.total_cost_usd ?? null,
           tokens, turns: parsed.result?.num_turns ?? null, delivered, leaks };
}

function report() {
  const rows = [];
  const missing = [];
  const leaks = [];
  const deciders = [];
  for (const model of CFG.models) {
    for (const [armName, arm] of Object.entries(CFG.arms)) {
      for (const caseName of CFG.cases) {
        const graded = [];
        for (let rep = 1; rep <= CFG.runs; rep++) {
          const g = gradeRun(model, armName, arm, caseName, rep);
          if (g) graded.push(g);
          else missing.push(`${model}/${armName}/${caseName}/${rep}`);
          for (const leak of g?.leaks || []) leaks.push(`${model}/${armName}/${caseName}/${rep}: ${leak}`);
        }
        if (!graded.length) continue;
        for (const k of CASE_PREDICATES[caseName]) {
          const undecided = graded.filter((g) => g.scores[k] === null || g.scores[k] === undefined).length;
          if (undecided && CASE_UNREADABLE_DECIDERS[caseName]?.[k]) {
            deciders.push(`${model}/${armName}/${caseName}: ${k} (${undecided} unreadable) -- ${decidersLine(caseName, k)}`);
          }
        }
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
          // Per predicate, so a composite zero says which transition failed.
          predicates: CASE_PREDICATES[caseName].map((k) => {
            const read = graded.filter((g) => g.scores[k] !== null && g.scores[k] !== undefined);
            const undecided = graded.length - read.length;
            return `${k} ${read.filter((g) => g.scores[k] === true).length}/${read.length}`
              + (undecided ? ` (${undecided} unreadable)` : '');
          }).join(', '),
          // Subject turns reached out of those the script holds. Short of it means a turn
          // changed the tree -- its work targets, where the target declares them -- and the
          // harness stopped answering.
          turns: graded.every((g) => g.delivered)
            ? `${graded.reduce((s, g) => s + g.delivered.turns, 0)}/${graded.reduce((s, g) => s + g.delivered.scripted, 0)}`
            : '-',
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
    const cols = ['runner', 'model', 'arm', 'case', 'n', 'pass_k', 'rate', 'integrity', 'skill', 'predicates', 'turns', 'manual', 'unreadable', 'tokens', 'cost'];
    const line = (cells) => `| ${cells.join(' | ')} |`;
    console.log(line(cols));
    console.log(line(cols.map(() => '---')));
    for (const r of rows) console.log(line(cols.map((c) => String(r[c]))));
    const numericCosts = rows.map((r) => Number(r.cost)).filter(Number.isFinite);
    if (numericCosts.length) console.log(`\ntotal cost: $${numericCosts.reduce((s, v) => s + v, 0).toFixed(4)}`);
    console.log('\n`pass_k` contains deterministic transition predicates only. Manual transcript review is still required for:');
    for (const item of manualSummary) console.log(`- ${item}`);
    if (evidenceFailures.length) {
      console.log('\n**Not readable as evidence** — treatment integrity failed, or a predicate had nothing to read, or it could not decide and leaves the cell to the transcript graders:');
      console.log(line(cols));
      console.log(line(cols.map(() => '---')));
      for (const r of evidenceFailures) console.log(line(cols.map((c) => String(r[c]))));
    }
    if (leaks.length) {
      console.log(`\n**Treatment integrity: delegation reached a run of ${TARGET}, whose environment removes it:**`);
      for (const leak of leaks) console.log(`- ${leak}`);
    }
    if (deciders.length) {
      console.log('\n**Unreadable work predicates, and the transcript grader that decides each turn:**');
      for (const item of deciders) console.log(`- ${item}`);
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
    console.log('\nNOT READABLE AS EVIDENCE — treatment integrity failed, or a predicate had nothing to read, or it could not decide and leaves the cell to the transcript graders:');
    console.table(evidenceFailures);
  }
  if (leaks.length) {
    console.log(`\nTREATMENT INTEGRITY: DELEGATION REACHED A RUN OF ${TARGET}, WHOSE ENVIRONMENT REMOVES IT:`);
    for (const leak of leaks) console.log(`- ${leak}`);
  }
  if (deciders.length) {
    console.log('\nUNREADABLE WORK PREDICATES, AND THE TRANSCRIPT GRADER THAT DECIDES EACH TURN:');
    for (const item of deciders) console.log(`- ${item}`);
  }
  if (missing.length) {
    console.log('\nMISSING REQUESTED CELLS:');
    for (const cell of missing) console.log(`- ${cell}`);
  }
  if (evidenceFailures.length || missing.length) process.exitCode = 1;
}

// ---------------------------------------------------------------- main

function releaseLoginCommand() {
  // run.sh's exit trap. Removes any login link the run left and reports a regular file
  // left in a link's place; never prints or reads the login itself.
  if (RUNNER !== 'codex') return;
  const stray = releaseLogins();
  if (stray.length) { console.error(strayAuthMessage(stray)); process.exitCode = 1; }
}

function teardown() {
  const all = process.argv.includes('--all');
  const purge = process.argv.includes('--purge');
  let stray = [];
  if (RUNNER === 'codex') {
    // Whatever mode the last run used, no link survives a teardown.
    stray = releaseLogins();
    if (stray.length) { console.error(strayAuthMessage(stray)); process.exitCode = 1; }
  }
  resetVolatile();
  if (RUNNER === 'claude') console.log(`reset volatile state in ${CONFIG_DIR}`);
  else console.log(`reset per-cell state in ${CODEX_STATE_DIR}; no login link left in it`);
  if (all || purge) {
    if (stray.length) {
      console.error(`kept ${CODEX_STATE_DIR}: it holds the auth.json named above`);
      return;
    }
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
else if (cmd === 'release-login') releaseLoginCommand();
else {
  console.log('usage: node harness.mjs <setup|run|report|teardown|release-login> <skill> [--markdown|--all|--purge]');
  process.exit(1);
}
