import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync,
  rmSync, writeFileSync,
} from 'node:fs';
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
const { appendFileSync } = require('node:fs');
const args = process.argv.slice(2);
const kind = args[0] === 'plugin' && args[1] === 'list'
  ? 'list' : (args[0] === 'plugin' ? 'plugin' : (args.includes('exec') ? 'exec' : 'other'));
if (process.env.FAKE_CODEX_LOG) appendFileSync(process.env.FAKE_CODEX_LOG, JSON.stringify({
  kind,
  codexKey: Boolean(process.env.CODEX_API_KEY),
  openaiKey: Boolean(process.env.OPENAI_API_KEY),
  accessToken: Boolean(process.env.CODEX_ACCESS_TOKEN),
  home: process.env.CODEX_HOME || null,
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
  if (process.env.FAKE_CODEX_MODE === 'mutate') {
    const cd = args.indexOf('--cd');
    appendFileSync(args[cd + 1] + '/app/main.py', '\\nthis is not valid Python\\n');
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
  };
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
