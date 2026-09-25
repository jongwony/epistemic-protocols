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
  ? 'list' : (args[0] === 'plugin' ? 'plugin' : (args.includes('exec') ? 'exec' : 'other'));
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
  message: args[args.length - 1],
}) + '\\n');
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
    appendFileSync(process.cwd() + '/app/main.py', '\\nthis is not valid Python\\n');
  }
  if (process.env.FAKE_CODEX_MODE === 'replace-auth' && authLink) {
    // What a writer that renames over its target would leave: a regular file in the link's place.
    const body = readFileSync(auth, 'utf8');
    unlinkSync(auth);
    writeFileSync(auth, body);
  }
  console.log(JSON.stringify({
    type: 'item.completed',
    item: { type: 'command_execution', command: 'pwd', status: 'completed' },
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
    assert.match(report.stdout, /option-coproduct/);
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
      /\| codex \| gpt-5\.6-luna \| bare \| inquire-fully-specified \| 1 \| 1 \| 1\/1 \|/
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
