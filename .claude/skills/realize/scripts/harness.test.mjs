import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  chmodSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync,
  rmSync, symlinkSync, writeFileSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const HARNESS = join(HERE, 'harness.mjs');

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'realize-harness-test-'));
  const bin = join(root, 'bin');
  mkdirSync(bin);
  const fakeCodex = join(bin, 'codex');
  writeFileSync(fakeCodex, `#!/usr/bin/env node
const { appendFileSync, lstatSync, readlinkSync, readFileSync, unlinkSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const args = process.argv.slice(2);
const kind = args[0] === 'plugin' && args[1] === 'list'
  ? 'list' : (args[0] === 'plugin' ? 'plugin' : (args[0] === 'debug' ? 'debug'
    : (args.includes('exec') ? 'exec' : 'other')));
const config = (key) => {
  const arg = args.find((a, i) => args[i - 1] === '-c' && a.startsWith(key + '='));
  return arg ? JSON.parse(arg.slice(key.length + 1)) : null;
};
const auth = join(process.env.CODEX_HOME || '.', 'auth.json');
let authLink = null;
try {
  authLink = lstatSync(auth).isSymbolicLink() ? readlinkSync(auth) : 'file';
} catch { authLink = null; }
const resume = args.includes('resume');
if (process.env.FAKE_CODEX_LOG) appendFileSync(process.env.FAKE_CODEX_LOG, JSON.stringify({
  kind,
  codexKey: Boolean(process.env.CODEX_API_KEY),
  openaiKey: Boolean(process.env.OPENAI_API_KEY),
  accessToken: Boolean(process.env.CODEX_ACCESS_TOKEN),
  home: process.env.CODEX_HOME || null,
  authLink,
  resume,
  ephemeral: args.includes('--ephemeral'),
  session: resume ? args[args.length - 2] : null,
  catalog: config('model_catalog_json'),
  message: args[args.length - 1],
}) + '\\n');
if (kind === 'debug' && args[1] === 'models') {
  console.log(JSON.stringify({ models: [{ slug: 'gpt-6-luna', multi_agent_version: 'v2' }, { slug: 'gpt-5.5' }] }));
  process.exit(0);
}
if (kind === 'debug' && args[1] === 'prompt-input') {
  // The model's multi-agent role reaches its input unless the catalog it reads clears the version.
  const catalog = config('model_catalog_json');
  const entry = catalog && JSON.parse(readFileSync(catalog, 'utf8')).models.find((m) => m.slug === config('model'));
  const role = process.env.FAKE_CODEX_MODE === 'leaky-catalog' || !entry || entry.multi_agent_version !== null;
  console.log(JSON.stringify(role ? [{ type: 'message', content: '<multi_agent_role>' }] : []));
  process.exit(0);
}
if (kind === 'list') {
  console.log(JSON.stringify({ installed: [], available: [] }));
  process.exit(0);
}
if (kind === 'plugin') {
  console.log('{}');
  process.exit(0);
}
if (kind === 'exec') {
  console.log(JSON.stringify({ type: 'thread.started', thread_id: 'test-thread' }));
  if (process.env.FAKE_CODEX_MODE === 'incomplete') process.exit(9);
  if (process.env.FAKE_CODEX_MODE === 'mutate'
      || (process.env.FAKE_CODEX_MODE === 'mutate-on-resume' && resume)) {
    appendFileSync(process.cwd() + '/' + (process.env.FAKE_CODEX_MUTATE_FILE || 'app/main.py'), '\\nthis is not valid Python\\n');
  }
  if (process.env.FAKE_CODEX_MODE === 'replace-auth' && authLink) {
    // What a writer that renames over its target would leave: a regular file in the link's place.
    const body = readFileSync(auth, 'utf8');
    unlinkSync(auth);
    writeFileSync(auth, body);
  }
  if (process.env.FAKE_CODEX_MODE === 'file-change'
      || (process.env.FAKE_CODEX_MODE === 'file-change-on-resume' && resume)) {
    // A write the trace names, undone before the turn ends: the tree is the scaffold's again.
    console.log(JSON.stringify({
      type: 'item.completed',
      item: { type: 'file_change', changes: [{ path: process.env.FAKE_CODEX_CHANGE_PATH || 'exporters/csv_export.py', kind: 'update' }], status: 'completed' },
    }));
  }
  if (process.env.FAKE_CODEX_MODE === 'collab' && !resume) {
    console.log(JSON.stringify({
      type: 'item.completed',
      item: { type: 'collab_tool_call', tool: 'spawn_agent', status: 'completed' },
    }));
  }
  console.log(JSON.stringify({
    type: 'item.completed',
    item: { type: 'command_execution', command: process.env.FAKE_CODEX_COMMAND || 'pwd', status: 'completed' },
  }));
  console.log(JSON.stringify({
    type: 'item.completed',
    item: { type: 'agent_message', text: 'done' },
  }));
  console.log(JSON.stringify({
    type: 'turn.completed',
    usage: { input_tokens: 10, output_tokens: 2 },
  }));
  process.exit(0);
}
process.exit(0);
`);
  chmodSync(fakeCodex, 0o755);

  const env = {
    ...process.env,
    PATH: `${bin}:${process.env.PATH}`,
    REALIZE_RUNNER: 'codex',
    REALIZE_ARMS: 'bare',
    REALIZE_CASES: 'inquire-underspecified',
    REALIZE_RUNS: '1',
    REALIZE_CODEX_STATE_DIR: join(root, 'state'),
    REALIZE_RESULTS_DIR: join(root, 'results'),
    REALIZE_WORK_DIR: join(root, 'work'),
    FAKE_CODEX_LOG: join(root, 'codex.log'),
    // The login a login-mode run borrows. The harness reads CODEX_HOME for it, as codex does.
    CODEX_HOME: join(root, 'userhome'),
  };
  mkdirSync(env.CODEX_HOME);
  writeFileSync(join(env.CODEX_HOME, 'auth.json'), '{"fake":"login"}\n');
  delete env.CODEX_API_KEY;
  delete env.REALIZE_CODEX_AUTH;
  return { root, env };
}

function invoke(env, command, ...args) {
  return spawnSync(process.execPath, [HARNESS, command, ...args], {
    encoding: 'utf8',
    env,
  });
}

function filesNamed(root, name) {
  if (!existsSync(root)) return [];
  const found = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.name === name) found.push(path);
    }
  };
  walk(root);
  return found;
}

function logged(root) {
  const file = join(root, 'codex.log');
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
}

test('requires one registered skill target', () => {
  const { root, env } = fixture();
  try {
    const omitted = invoke(env, 'report');
    assert.notEqual(omitted.status, 0);
    assert.match(omitted.stderr, /target required/);

    const unknown = invoke(env, 'report', 'missing-skill');
    assert.notEqual(unknown.status, 0);
    assert.match(unknown.stderr, /unknown realize target/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('Codex setup neither receives nor stores credentials', () => {
  const { root, env } = fixture();
  env.REALIZE_ARMS = 'protocol';
  env.CODEX_API_KEY = 'codex-secret';
  env.OPENAI_API_KEY = 'openai-secret';
  env.CODEX_ACCESS_TOKEN = 'access-secret';
  try {
    const setup = invoke(env, 'setup', 'inquire');
    assert.equal(setup.status, 0, setup.stderr || setup.stdout);
    assert.deepEqual(logged(root).map(({ codexKey, openaiKey, accessToken }) => (
      { codexKey, openaiKey, accessToken }
    )), [
      { codexKey: false, openaiKey: false, accessToken: false },
      { codexKey: false, openaiKey: false, accessToken: false },
    ]);
    assert.deepEqual(filesNamed(join(root, 'state'), 'auth.json'), []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('run and report fail closed when a requested Codex cell does not complete', () => {
  const { root, env } = fixture();
  env.CODEX_API_KEY = 'codex-secret';
  env.OPENAI_API_KEY = 'openai-secret';
  env.CODEX_ACCESS_TOKEN = 'access-secret';
  env.FAKE_CODEX_MODE = 'incomplete';
  try {
    assert.equal(invoke(env, 'setup', 'inquire').status, 0);
    const run = invoke(env, 'run', 'inquire');
    assert.notEqual(run.status, 0);
    assert.match(run.stdout, /LAUNCH FAILED/);
    assert.match(run.stderr, /requested cell\(s\) did not produce a gradeable run/);

    const report = invoke(env, 'report', 'inquire', '--markdown');
    assert.notEqual(report.status, 0);
    assert.match(report.stdout, /No results for target inquire/);
    assert.match(report.stdout, /Missing requested cells/);

    const calls = logged(root);
    assert.deepEqual(calls.map(({ kind, codexKey, openaiKey, accessToken }) => (
      { kind, codexKey, openaiKey, accessToken }
    )), [
      { kind: 'list', codexKey: false, openaiKey: false, accessToken: false },
      { kind: 'exec', codexKey: true, openaiKey: false, accessToken: false },
    ]);
    assert.deepEqual(filesNamed(join(root, 'state'), 'auth.json'), []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a complete requested cell reports transition and manual scopes separately', () => {
  const { root, env } = fixture();
  env.CODEX_API_KEY = 'codex-secret';
  env.FAKE_CODEX_MODE = 'complete';
  try {
    assert.equal(invoke(env, 'setup', 'inquire').status, 0);
    const run = invoke(env, 'run', 'inquire');
    assert.equal(run.status, 0, run.stderr || run.stdout);

    const report = invoke(env, 'report', 'inquire', '--markdown');
    assert.equal(report.status, 0, report.stderr || report.stdout);
    assert.match(report.stdout, /\| manual \|/);
    assert.match(report.stdout, /pass_k.*deterministic transition predicates only/);
    assert.match(report.stdout, /answer-openings/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('Proceed is scored from its witness without grading artifact quality', () => {
  const { root, env } = fixture();
  env.CODEX_API_KEY = 'codex-secret';
  env.FAKE_CODEX_MODE = 'mutate';
  env.REALIZE_CASES = 'inquire-fully-specified';
  try {
    assert.equal(invoke(env, 'setup', 'inquire').status, 0);
    const run = invoke(env, 'run', 'inquire');
    assert.equal(run.status, 0, run.stderr || run.stdout);

    const report = invoke(env, 'report', 'inquire', '--markdown');
    assert.equal(report.status, 0, report.stderr || report.stdout);
    assert.match(
      report.stdout,
      /\| codex \| gpt-6-luna \| bare \| inquire-fully-specified \| 1 \| 1 \| 1\/1 \|/
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

function authEntries(root) {
  // Every auth.json anywhere in the disposable state, link or file.
  const found = [];
  const walk = (dir) => {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.name === 'auth.json') found.push(path);
      else if (entry.isDirectory()) walk(path);
    }
  };
  walk(join(root, 'state'));
  return found;
}

function loginLock(env) {
  const source = join(env.CODEX_HOME, 'auth.json');
  const key = createHash('sha256').update(source).digest('hex').slice(0, 12);
  return join(tmpdir(), `epistemic-realize-codex-login-${key}.lock`);
}

test('login mode links the existing login for each exec only, and never copies it', () => {
  const { root, env } = fixture();
  env.REALIZE_CASES = 'inquire-underspecified,inquire-fully-specified';
  env.REALIZE_CODEX_AUTH = 'login';
  env.CODEX_API_KEY = 'codex-secret';
  env.FAKE_CODEX_MODE = 'complete';
  const source = join(env.CODEX_HOME, 'auth.json');
  try {
    const setup = invoke(env, 'setup', 'inquire');
    assert.equal(setup.status, 0, setup.stderr || setup.stdout);
    const run = invoke(env, 'run', 'inquire');
    assert.equal(run.status, 0, run.stderr || run.stdout);

    const calls = logged(root);
    const execs = calls.filter((c) => c.kind === 'exec');
    assert.equal(execs.length, 2);
    for (const c of execs) {
      assert.equal(c.authLink, source, 'each exec sees a symlink to the real login');
      assert.equal(c.codexKey, false, 'no API key reaches a child in login mode');
    }
    for (const c of calls.filter((call) => call.kind !== 'exec')) {
      assert.equal(c.authLink, null, `${c.kind} runs with no credential in its home`);
    }
    assert.deepEqual(authEntries(root), [], 'no link survives the run');
    assert.equal(existsSync(loginLock(env)), false, 'the run releases its lock');
    assert.equal(readFileSync(source, 'utf8'), '{"fake":"login"}\n');
    assert.doesNotMatch(run.stdout + run.stderr, /fake/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('login mode stops the run and keeps a file codex left in place of the link', () => {
  const { root, env } = fixture();
  env.REALIZE_ARMS = 'bare,protocol';
  env.REALIZE_CODEX_AUTH = 'login';
  env.FAKE_CODEX_MODE = 'replace-auth';
  try {
    assert.equal(invoke(env, 'setup', 'inquire').status, 0);
    const run = invoke(env, 'run', 'inquire');
    assert.notEqual(run.status, 0);
    assert.match(run.stderr + run.stdout, /regular auth\.json sits in a disposable Codex home/);
    assert.equal(logged(root).filter((c) => c.kind === 'exec').length, 1, 'no child runs after the break');
    const left = authEntries(root);
    assert.equal(left.length, 1);
    assert.equal(lstatSync(left[0]).isSymbolicLink(), false);

    // Neither teardown, the exit-trap command, nor setup deletes it.
    assert.notEqual(invoke(env, 'teardown', 'inquire', '--all').status, 0);
    assert.notEqual(invoke(env, 'release-login', 'inquire').status, 0);
    assert.notEqual(invoke(env, 'setup', 'inquire').status, 0);
    assert.equal(existsSync(left[0]), true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('login-mode runs sharing one login do not overlap, and a stale lock is taken over', () => {
  const { root, env } = fixture();
  env.REALIZE_CODEX_AUTH = 'login';
  env.FAKE_CODEX_MODE = 'complete';
  const lock = loginLock(env);
  try {
    assert.equal(invoke(env, 'setup', 'inquire').status, 0);
    // Held by a live process -- this test runner.
    writeFileSync(lock, `${process.pid}\n`);
    const held = invoke(env, 'run', 'inquire');
    assert.notEqual(held.status, 0);
    assert.match(held.stderr, /another login-mode run holds/);
    assert.equal(logged(root).filter((c) => c.kind === 'exec').length, 0);

    // Held by a process that has exited.
    const gone = spawnSync(process.execPath, ['-e', '']).pid;
    writeFileSync(lock, `${gone}\n`);
    const run = invoke(env, 'run', 'inquire');
    assert.equal(run.status, 0, run.stderr);
    assert.equal(existsSync(lock), false);
  } finally {
    rmSync(lock, { force: true });
    rmSync(root, { recursive: true, force: true });
  }
});

test('teardown and the exit-trap command remove a leftover login link', () => {
  const { root, env } = fixture();
  env.REALIZE_ARMS = 'bare,protocol';
  try {
    assert.equal(invoke(env, 'setup', 'inquire').status, 0);
    const home = join(root, 'state', 'inquire', 'bare');
    mkdirSync(home, { recursive: true });
    symlinkSync(join(env.CODEX_HOME, 'auth.json'), join(home, 'auth.json'));
    const released = invoke(env, 'release-login', 'inquire');
    assert.equal(released.status, 0, released.stderr);
    assert.deepEqual(authEntries(root), []);

    symlinkSync(join(env.CODEX_HOME, 'auth.json'), join(home, 'auth.json'));
    const teardown = invoke(env, 'teardown', 'inquire');
    assert.equal(teardown.status, 0, teardown.stderr);
    assert.deepEqual(authEntries(root), []);
    assert.equal(readFileSync(join(env.CODEX_HOME, 'auth.json'), 'utf8'), '{"fake":"login"}\n');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a scripted multi-turn case resumes one session and reports every turn', () => {
  const { root, env } = fixture();
  env.CODEX_API_KEY = 'codex-secret';
  env.FAKE_CODEX_MODE = 'complete';
  env.REALIZE_CASES = 'grasp-adjudicable';
  try {
    assert.equal(invoke(env, 'setup', 'grasp').status, 0);
    const run = invoke(env, 'run', 'grasp');
    assert.equal(run.status, 0, run.stderr || run.stdout);

    const execs = logged(root).filter((c) => c.kind === 'exec');
    assert.equal(execs.length, 5, 'the prompt and four scripted replies');
    assert.equal(execs[0].resume, false);
    assert.equal(execs[0].ephemeral, false, 'a cell that resumes keeps its session on disk');
    for (const c of execs.slice(1)) {
      assert.equal(c.resume, true);
      assert.equal(c.session, 'test-thread');
    }
    assert.match(execs[4].message, /I'm done here/);

    const report = invoke(env, 'report', 'grasp', '--markdown');
    assert.equal(report.status, 0, report.stderr || report.stdout);
    assert.match(report.stdout,
      /target_read_first 1\/1, target_preserved 1\/1, completed 1\/1 \| 5\/5 \|/);
    assert.match(report.stdout, /correction-quotes-target/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a turn that changes the tree ends the script and fails preservation', () => {
  const { root, env } = fixture();
  env.CODEX_API_KEY = 'codex-secret';
  env.FAKE_CODEX_MODE = 'mutate-on-resume';
  env.REALIZE_CASES = 'grasp-unattachable';
  try {
    assert.equal(invoke(env, 'setup', 'grasp').status, 0);
    const run = invoke(env, 'run', 'grasp');
    assert.equal(run.status, 0, run.stderr || run.stdout);
    assert.match(run.stdout, /tree-changed-at-turn-2/);
    assert.equal(logged(root).filter((c) => c.kind === 'exec').length, 2);

    const report = invoke(env, 'report', 'grasp', '--markdown');
    assert.match(report.stdout,
      /\| 0 \| 0\/1 \| 1 \| n\/a \| target_read_first 1\/1, target_preserved 0\/1, completed 1\/1 \| 2\/5 \|/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

const CONDUCT_CASES = 'conduct-map-gate,conduct-taking-with-change,conduct-relay';

test('a conduct gate is read from writes that reach the work targets, on Codex', () => {
  const row = (name, cells) => new RegExp(`\\| bare \\| ${name} \\| 1 \\| ${cells}`);
  for (const [mode, file, expected] of [
    // Turn 1 leaves the targets alone and only the resumed turn writes one: the map stops, the
    // taking proceeds, and a single-turn relay that wrote nothing has not proceeded.
    ['mutate-on-resume', 'exporters/csv_export.py', [
      row('conduct-map-gate', '1 \\| 1/1 \\| 1 \\| n/a \\| stop_observed 1/1, completed 1/1 \\| - \\|'),
      row('conduct-taking-with-change', '1 \\| 1/1 \\| 1 \\| n/a \\| stop_then_proceed 1/1, completed 1/1 \\| 2/2 \\|'),
      row('conduct-relay', '0 \\| 0/1 \\| 1 \\| n/a \\| dispatch_observed 0/1, completed 1/1 \\| - \\|'),
    ]],
    // Turn 1 writes a target: the map did not stop, the script ends before the taking, and the
    // relay proceeded.
    ['mutate', 'exporters/csv_export.py', [
      row('conduct-map-gate', '0 \\| 0/1 \\| 1 \\| n/a \\| stop_observed 0/1, completed 1/1 \\| - \\|'),
      row('conduct-taking-with-change', '0 \\| 0/1 \\| 1 \\| n/a \\| stop_then_proceed 0/1, completed 1/1 \\| 1/2 \\|'),
      row('conduct-relay', '1 \\| 1/1 \\| 1 \\| n/a \\| dispatch_observed 1/1, completed 1/1 \\| - \\|'),
    ]],
    // Every turn saves a draft map beside the work, outside its targets: the map stops, the reply
    // still reaches the taking, whose turn 2 started nothing, and the relay did not proceed.
    ['mutate', 'MAP.md', [
      row('conduct-map-gate', '1 \\| 1/1 \\| 1 \\| n/a \\| stop_observed 1/1, completed 1/1 \\| - \\|'),
      row('conduct-taking-with-change', '0 \\| 0/1 \\| 1 \\| n/a \\| stop_then_proceed 0/1, completed 1/1 \\| 2/2 \\|'),
      row('conduct-relay', '0 \\| 0/1 \\| 1 \\| n/a \\| dispatch_observed 0/1, completed 1/1 \\| - \\|'),
    ]],
    // Every turn writes a target and puts it back: the relay started its work though its tree ends
    // as the scaffold's, and the map's and the taking's turn 1 wrote, so neither gate stopped.
    ['file-change', 'exporters/csv_export.py', [
      row('conduct-map-gate', '0 \\| 0/1 \\| 1 \\| n/a \\| stop_observed 0/1, completed 1/1 \\| - \\|'),
      row('conduct-taking-with-change', '0 \\| 0/1 \\| 1 \\| n/a \\| stop_then_proceed 0/1, completed 1/1 \\| 2/2 \\|'),
      row('conduct-relay', '1 \\| 1/1 \\| 1 \\| n/a \\| dispatch_observed 1/1, completed 1/1 \\| - \\|'),
    ]],
    // A named write outside the targets is no witness either.
    ['file-change', 'PLAN.md', [
      row('conduct-map-gate', '1 \\| 1/1 \\| 1 \\| n/a \\| stop_observed 1/1, completed 1/1 \\| - \\|'),
      row('conduct-taking-with-change', '0 \\| 0/1 \\| 1 \\| n/a \\| stop_then_proceed 0/1, completed 1/1 \\| 2/2 \\|'),
      row('conduct-relay', '0 \\| 0/1 \\| 1 \\| n/a \\| dispatch_observed 0/1, completed 1/1 \\| - \\|'),
    ]],
    // Only the resumed turn writes a target, and puts it back: the taking stopped at turn 1 and
    // proceeded at turn 2, though no turn leaves a changed tree.
    ['file-change-on-resume', 'exporters/csv_export.py', [
      row('conduct-map-gate', '1 \\| 1/1 \\| 1 \\| n/a \\| stop_observed 1/1, completed 1/1 \\| - \\|'),
      row('conduct-taking-with-change', '1 \\| 1/1 \\| 1 \\| n/a \\| stop_then_proceed 1/1, completed 1/1 \\| 2/2 \\|'),
      row('conduct-relay', '0 \\| 0/1 \\| 1 \\| n/a \\| dispatch_observed 0/1, completed 1/1 \\| - \\|'),
    ]],
  ]) {
    const { root, env } = fixture();
    env.CODEX_API_KEY = 'codex-secret';
    env.FAKE_CODEX_MODE = mode;
    env.FAKE_CODEX_MUTATE_FILE = file;
    env.FAKE_CODEX_CHANGE_PATH = file;
    env.REALIZE_CASES = CONDUCT_CASES;
    try {
      assert.equal(invoke(env, 'setup', 'conduct').status, 0);
      const run = invoke(env, 'run', 'conduct');
      assert.equal(run.status, 0, run.stderr || run.stdout);
      const report = invoke(env, 'report', 'conduct', '--markdown');
      assert.equal(report.status, 0, report.stderr || report.stdout);
      for (const pattern of expected) assert.match(report.stdout, pattern, `${mode} ${file}: ${pattern}`);
      assert.match(report.stdout, /map-relayed-before-dispatch, relayed-not-gated, conduct-map-gate\/turn-ends-at-gate/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
});

test('Codex conduct runs read a catalog with no multi-agent version on every turn, and only conduct does', () => {
  const { root, env } = fixture();
  env.CODEX_API_KEY = 'codex-secret';
  env.FAKE_CODEX_MODE = 'complete';
  env.REALIZE_CASES = CONDUCT_CASES;
  try {
    assert.equal(invoke(env, 'setup', 'conduct').status, 0);
    const catalog = join(root, 'state', 'conduct', 'model-catalog.json');
    assert.deepEqual(JSON.parse(readFileSync(catalog, 'utf8')).models.map((m) => m.multi_agent_version), [null, null]);
    assert.equal(invoke(env, 'run', 'conduct').status, 0);
    const execs = logged(root).filter((c) => c.kind === 'exec');
    assert.equal(execs.length, 4, 'two single-turn cases, and the taking resumed once');
    assert.ok(execs.some((c) => c.resume));
    for (const c of execs) assert.equal(c.catalog, catalog);
    const checks = logged(root).filter((c) => c.kind === 'debug');
    assert.ok(checks.length >= 4, 'the catalog is generated once and checked before every cell');

    const inquire = fixture();
    inquire.env.CODEX_API_KEY = 'codex-secret';
    inquire.env.FAKE_CODEX_MODE = 'complete';
    try {
      assert.equal(invoke(inquire.env, 'setup', 'inquire').status, 0);
      assert.equal(invoke(inquire.env, 'run', 'inquire').status, 0);
      for (const c of logged(inquire.root)) assert.equal(c.catalog, null);
      assert.equal(logged(inquire.root).some((c) => c.kind === 'debug'), false);
    } finally {
      rmSync(inquire.root, { recursive: true, force: true });
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a Codex conduct cell whose model is still offered agents, or that calls one, is not evidence', () => {
  const { root, env } = fixture();
  env.CODEX_API_KEY = 'codex-secret';
  env.REALIZE_CASES = CONDUCT_CASES;
  try {
    assert.equal(invoke(env, 'setup', 'conduct').status, 0);
    // Checked before the cell runs: nothing is spent on it.
    env.FAKE_CODEX_MODE = 'leaky-catalog';
    const leaky = invoke(env, 'run', 'conduct');
    assert.notEqual(leaky.status, 0);
    assert.match(leaky.stdout, /still carries the multi-agent role/);
    assert.equal(logged(root).filter((c) => c.kind === 'exec').length, 0);

    // Named in the trace anyway: integrity fails, and every work predicate reading that turn is unreadable.
    env.FAKE_CODEX_MODE = 'collab';
    assert.equal(invoke(env, 'run', 'conduct').status, 0);
    const report = invoke(env, 'report', 'conduct', '--markdown');
    assert.notEqual(report.status, 0);
    assert.match(report.stdout, /\| conduct-map-gate \| 1 \| - \| 0\/1 \| 0 \|[^\n]*stop_observed 0\/0 \(1 unreadable\)/);
    assert.match(report.stdout, /\| conduct-relay \| 1 \| - \| 0\/1 \| 0 \|[^\n]*dispatch_observed 0\/0 \(1 unreadable\)/);
    assert.match(report.stdout, /\| conduct-taking-with-change \| 1 \| - \| 0\/1 \| 0 \|[^\n]*stop_then_proceed 0\/0 \(1 unreadable\)/);
    assert.match(report.stdout, /conduct-relay\/1: turn 1 called spawn_agent/);
    assert.match(report.stdout, /conduct-taking-with-change: stop_then_proceed \(1 unreadable\) -- turn 1: conduct-map-gate\/turn-ends-at-gate; turn 2: relayed-not-gated/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('on Claude, delegation is disallowed on every turn; a target write decides, a draft beside it does not, an agent call is a leak', () => {
  // Columns from the case on: n | pass_k | rate | integrity | ... | predicates.
  const row = (name, passK, integrity, cells) =>
    new RegExp(`\\| bare \\| ${name} \\| 1 \\| ${passK} \\| [01]/1 \\| ${integrity} \\|[^\\n]*${cells}`);
  const unread = (predicate) => `${predicate} 0/0 \\(1 unreadable\\)`;
  // Per subject turn, what the fake runner's trace names: a Write to a work target, a Write of a
  // draft map beside the work, an Agent call, or nothing. The tree is never changed, so every
  // verdict here comes from the trace.
  // `failing`: the report lists a delegation leak and exits non-zero.
  for (const [turns, expected, { offered = false, failing = false } = {}] of [
    // A draft map saved before the gate, then a target written on the taking.
    ['draft,target', [
      row('conduct-map-gate', '1', '1', 'stop_observed 1/1'),
      row('conduct-relay', '0', '1', 'dispatch_observed 0/1'),
      row('conduct-taking-with-change', '1', '1', 'stop_then_proceed 1/1'),
    ]],
    ['target,target', [
      row('conduct-map-gate', '0', '1', 'stop_observed 0/1'),
      row('conduct-relay', '1', '1', 'dispatch_observed 1/1'),
      row('conduct-taking-with-change', '0', '1', 'stop_then_proceed 0/1'),
    ]],
    // A taking that writes only a draft map started nothing.
    ['none,draft', [
      row('conduct-map-gate', '1', '1', 'stop_observed 1/1'),
      row('conduct-relay', '0', '1', 'dispatch_observed 0/1'),
      row('conduct-taking-with-change', '0', '1', 'stop_then_proceed 0/1'),
    ]],
    // An agent call is a leak whatever it did: the turns it sits in decide nothing, a target
    // write beside it included, and the row fails integrity.
    ['agent+target,target', [
      row('conduct-map-gate', '-', '0', unread('stop_observed')),
      row('conduct-relay', '-', '0', unread('dispatch_observed')),
      row('conduct-taking-with-change', '-', '0', unread('stop_then_proceed')),
    ], { failing: true }],
    ['none,agent+target', [
      row('conduct-map-gate', '1', '1', 'stop_observed 1/1'),
      row('conduct-relay', '0', '1', 'dispatch_observed 0/1'),
      row('conduct-taking-with-change', '-', '0', unread('stop_then_proceed')),
    ], { failing: true }],
    // A runner that offers the disallowed tools anyway fails integrity though nothing called them.
    ['none,target', [
      row('conduct-map-gate', '1', '0', 'stop_observed 1/1'),
      row('conduct-relay', '0', '0', 'dispatch_observed 0/1'),
      row('conduct-taking-with-change', '1', '0', 'stop_then_proceed 1/1'),
    ], { offered: true, failing: true }],
  ]) {
    const { root, env } = fixture();
    const bin = join(root, 'bin', 'claude');
    writeFileSync(bin, `#!/usr/bin/env node
const { appendFileSync } = require('node:fs');
const args = process.argv.slice(2);
appendFileSync(process.env.FAKE_CLAUDE_LOG, JSON.stringify(args) + '\\n');
const turns = process.env.FAKE_CLAUDE_TURNS.split(',');
const shows = turns[args.includes('--resume') ? 1 : 0].split('+');
const at = args.indexOf('--disallowed-tools');
const disallowed = at < 0 || process.env.FAKE_CLAUDE_OFFERS ? [] : args[at + 1].split(',');
const tools = ['Read', 'Write', 'Edit', 'Bash', 'Task', 'SendMessage', 'Workflow'].filter((t) => !disallowed.includes(t));
const blocks = [];
if (shows.includes('agent')) blocks.push({ type: 'tool_use', name: 'Agent', input: { description: 'list the exporters', prompt: 'inventory' } });
if (shows.includes('target')) blocks.push({ type: 'tool_use', name: 'Write', input: { file_path: process.cwd() + '/exporters/csv_export.py', content: 'x' } });
if (shows.includes('draft')) blocks.push({ type: 'tool_use', name: 'Write', input: { file_path: process.cwd() + '/PLAN.md', content: 'x' } });
console.log(JSON.stringify({ type: 'system', subtype: 'init', session_id: 's', plugins: [], output_style: 'default', tools }));
if (blocks.length) console.log(JSON.stringify({ type: 'assistant', message: { content: blocks } }));
console.log(JSON.stringify({ type: 'result', is_error: false, total_cost_usd: 0.01, num_turns: 1 }));
`);
    chmodSync(bin, 0o755);
    env.REALIZE_RUNNER = 'claude';
    env.REALIZE_CASES = CONDUCT_CASES;
    env.HOME = root;
    env.FAKE_CLAUDE_TURNS = turns;
    env.FAKE_CLAUDE_LOG = join(root, 'claude.log');
    if (offered) env.FAKE_CLAUDE_OFFERS = '1';
    try {
      const run = invoke(env, 'run', 'conduct');
      assert.equal(run.status, 0, run.stderr || run.stdout);
      // Every call, first and resumed, disallows the same tools, and an option follows the list.
      const calls = readFileSync(env.FAKE_CLAUDE_LOG, 'utf8').trim().split('\n').map(JSON.parse);
      assert.equal(calls.length, 4);
      for (const args of calls) {
        const at = args.indexOf('--disallowed-tools');
        assert.equal(args[at + 1], 'Agent,Task,SendMessage,Workflow,RemoteTrigger');
        assert.match(args[at + 2], /^--/);
      }
      const report = invoke(env, 'report', 'conduct', '--markdown');
      for (const pattern of expected) assert.match(report.stdout, pattern, `${turns}: ${pattern}\n${report.stdout}`);
      assert.equal(report.status === 0, !failing, `${turns}: ${report.stdout}`);
      assert.equal(/Treatment integrity: delegation reached/.test(report.stdout), failing, turns);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
});

test('a multi-turn case whose oracle needs a reader is refused before anything runs', () => {
  const { root, env } = fixture();
  env.REALIZE_CASES = 'elicit-aporia';
  try {
    const setup = invoke(env, 'setup', 'inquire');
    assert.notEqual(setup.status, 0);
    assert.match(setup.stderr, /walk it by hand with turn\.sh/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('the Claude runner resumes a scripted case with the same flags on every turn', () => {
  const { root, env } = fixture();
  const fakeClaude = join(root, 'bin', 'claude');
  writeFileSync(fakeClaude, `#!/usr/bin/env node
const { appendFileSync } = require('node:fs');
const args = process.argv.slice(2);
appendFileSync(process.env.FAKE_CLAUDE_LOG, JSON.stringify(args) + '\\n');
console.log(JSON.stringify({ type: 'system', subtype: 'init', session_id: 'claude-session',
  plugins: [], output_style: 'default' }));
console.log(JSON.stringify({ type: 'assistant', message: { content: [
  { type: 'tool_use', name: 'Read', input: { file_path: 'app/limiter.py' } }] } }));
console.log(JSON.stringify({ type: 'result', is_error: false, total_cost_usd: 0.01, num_turns: 1 }));
`);
  chmodSync(fakeClaude, 0o755);
  env.REALIZE_RUNNER = 'claude';
  env.REALIZE_CASES = 'grasp-adjudicable';
  env.HOME = root;
  env.FAKE_CLAUDE_LOG = join(root, 'claude.log');
  try {
    const run = invoke(env, 'run', 'grasp');
    assert.equal(run.status, 0, run.stderr || run.stdout);
    const calls = readFileSync(env.FAKE_CLAUDE_LOG, 'utf8').trim().split('\n').map(JSON.parse);
    assert.equal(calls.length, 5);
    assert.equal(calls[0].includes('--resume'), false);
    for (const args of calls) assert.equal(args.includes('--no-session-persistence'), false);
    for (const args of calls.slice(1)) {
      assert.equal(args[args.indexOf('--resume') + 1], 'claude-session');
      // Identical flags apart from the resume pair and the message.
      assert.deepEqual(args.filter((a, i) => a !== '--resume' && a !== 'claude-session' && i !== args.length - 1),
        calls[0].slice(0, -1));
    }
    const report = invoke(env, 'report', 'grasp', '--markdown');
    assert.equal(report.status, 0, report.stderr || report.stdout);
    assert.match(report.stdout, /\| 5\/5 \|/);
    assert.match(report.stdout, /\| 0\.0500 \|/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a numbered listing of the target counts as reading it', () => {
  const { root, env } = fixture();
  env.CODEX_API_KEY = 'codex-secret';
  env.FAKE_CODEX_MODE = 'complete';
  env.REALIZE_CASES = 'grasp-adjudicable';
  env.FAKE_CODEX_COMMAND = "/bin/bash -lc 'nl -ba app/limiter.py'";
  try {
    assert.equal(invoke(env, 'setup', 'grasp').status, 0);
    assert.equal(invoke(env, 'run', 'grasp').status, 0);
    const report = invoke(env, 'report', 'grasp', '--markdown');
    assert.match(report.stdout, /target_read_first 1\/1/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

function fakeClaude(root, env) {
  const bin = join(root, 'bin', 'claude');
  writeFileSync(bin, `#!/usr/bin/env node
const { appendFileSync, statSync } = require('node:fs');
const args = process.argv.slice(2);
appendFileSync(process.env.FAKE_CLAUDE_LOG, JSON.stringify(args) + '\\n');
// claude refuses a --settings path that is not a regular file.
if (!statSync(args[args.indexOf('--settings') + 1], { throwIfNoEntry: false })?.isFile()) process.exit(1);
console.log(JSON.stringify({ type: 'system', subtype: 'init', session_id: 's', plugins: [], output_style: 'default' }));
console.log(JSON.stringify({ type: 'result', is_error: false, total_cost_usd: 0.01, num_turns: 1 }));
`);
  chmodSync(bin, 0o755);
  env.REALIZE_RUNNER = 'claude';
  env.HOME = root;
  env.FAKE_CLAUDE_LOG = join(root, 'claude.log');
  // The style arms read styleSource, which ships outside this repo under HOME.
  const { styleSource } = JSON.parse(readFileSync(join(HERE, '..', 'harness.config.json'), 'utf8'));
  const style = styleSource.replace(/^~/, root);
  mkdirSync(dirname(style), { recursive: true });
  writeFileSync(style, '---\nname: Epistemic Ink\n---\n');
  return () => readFileSync(env.FAKE_CLAUDE_LOG, 'utf8').trim().split('\n').map(JSON.parse);
}
const pluginDirOf = (args) => (args.includes('--plugin-dir') ? args[args.indexOf('--plugin-dir') + 1] : null);

test('the prose-only arm loads the plugin with every lean block removed, and only that', () => {
  const { root, env } = fixture();
  const calls = fakeClaude(root, env);
  try {
    // Setup as CI runs it, with no arms named; the run then names the opt-in arm.
    delete env.REALIZE_ARMS;
    const setup = invoke(env, 'setup', 'inquire');
    assert.equal(setup.status, 0, setup.stderr || setup.stdout);
    env.REALIZE_ARMS = 'protocol,protocol-prose';
    const run = invoke(env, 'run', 'inquire');
    assert.equal(run.status, 0, run.stderr || run.stdout);
    const dirs = calls().map(pluginDirOf);
    const shipped = join(HERE, '..', '..', '..', '..', 'aitesis');
    const prose = dirs.find((d) => d && !d.endsWith('aitesis'));
    assert.ok(dirs.some((d) => d && d.endsWith('aitesis')), 'the protocol arm loads the shipped plugin');
    assert.ok(prose, 'the prose-only arm loads a copy');
    const original = readFileSync(join(shipped, 'skills', 'inquire', 'SKILL.md'), 'utf8');
    const stripped = readFileSync(join(prose, 'skills', 'inquire', 'SKILL.md'), 'utf8');
    assert.match(original, /^```lean$/m);
    assert.doesNotMatch(stripped, /```lean|namespace /);
    assert.ok(stripped.includes('## Rules'), 'the prose contract stays');
    assert.ok(stripped.length < original.length);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('the prose-only arm runs only when named, and the Codex runner refuses it', () => {
  const { root, env } = fixture();
  const calls = fakeClaude(root, env);
  delete env.REALIZE_ARMS;
  try {
    assert.equal(invoke(env, 'setup', 'inquire').status, 0);
    const run = invoke(env, 'run', 'inquire');
    assert.equal(run.status, 0, run.stderr || run.stdout);
    assert.doesNotMatch(run.stdout, /protocol-prose/);
    assert.ok(calls().every((args) => !String(pluginDirOf(args)).includes('prose-plugin')));
    const codex = invoke({ ...env, REALIZE_RUNNER: 'codex', REALIZE_ARMS: 'protocol-prose' }, 'run', 'inquire');
    assert.equal(codex.status, 1);
    assert.match(codex.stderr, /unsupported arms: protocol-prose/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('the Claude runner counts a read made through the shell as a read', () => {
  const { root, env } = fixture();
  const bin = join(root, 'bin', 'claude');
  writeFileSync(bin, `#!/usr/bin/env node
console.log(JSON.stringify({ type: 'system', subtype: 'init', session_id: 's', plugins: [], output_style: 'default' }));
console.log(JSON.stringify({ type: 'assistant', message: { content: [
  { type: 'tool_use', name: 'Bash', input: { command: 'ls -la && cat app/main.py' } }] } }));
console.log(JSON.stringify({ type: 'result', is_error: false, total_cost_usd: 0.01, num_turns: 1 }));
`);
  chmodSync(bin, 0o755);
  env.REALIZE_RUNNER = 'claude';
  env.HOME = root;
  try {
    assert.equal(invoke(env, 'run', 'inquire').status, 0);
    const report = invoke(env, 'report', 'inquire', '--markdown');
    assert.match(report.stdout, /collection_observed 1\/1/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('the Claude runner mounts each case outside any .claude directory', () => {
  const { root, env } = fixture();
  const bin = join(root, 'bin', 'claude');
  writeFileSync(bin, `#!/usr/bin/env node
require('node:fs').appendFileSync(process.env.FAKE_CLAUDE_LOG, process.cwd() + '\\n');
console.log(JSON.stringify({ type: 'system', subtype: 'init', session_id: 's', plugins: [], output_style: 'default' }));
console.log(JSON.stringify({ type: 'result', is_error: false, total_cost_usd: 0.01, num_turns: 1 }));
`);
  chmodSync(bin, 0o755);
  env.REALIZE_RUNNER = 'claude';
  env.HOME = root;
  env.FAKE_CLAUDE_LOG = join(root, 'claude.log');
  // The default location, kept inside this fixture: tmpdir() follows TMPDIR.
  delete env.REALIZE_WORK_DIR;
  env.TMPDIR = join(root, 'tmp');
  mkdirSync(env.TMPDIR);
  try {
    assert.equal(invoke(env, 'run', 'inquire').status, 0);
    const cwds = readFileSync(env.FAKE_CLAUDE_LOG, 'utf8').trim().split('\n');
    assert.ok(cwds.length > 0);
    for (const cwd of cwds) {
      assert.ok(cwd.startsWith(env.TMPDIR), cwd);
      assert.doesNotMatch(cwd, /\/\.claude\//);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
