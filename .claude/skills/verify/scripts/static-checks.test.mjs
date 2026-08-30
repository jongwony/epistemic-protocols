#!/usr/bin/env node
/**
 * Known-pass / known-fail proof for gate-answer-reference.
 *
 * The former gate-type-soundness check went inert when its prose anchor was
 * ablated. This test establishes that the replacement reaches every protocol
 * and rejects exact dangling references without asking a static parser to judge
 * context-dependent gate semantics.
 *
 * Run: node --test .claude/skills/verify/scripts/static-checks.test.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, '../../../..');
const checkerRelative = '.claude/skills/verify/scripts/static-checks.js';
const require = createRequire(import.meta.url);
const { protocolFiles } = require(path.join(projectRoot, 'scripts/load-protocols.js'));
const CHECK = 'gate-answer-reference';

function run(root) {
  try {
    return JSON.parse(execFileSync('node', [path.join(root, checkerRelative), root], {
      encoding: 'utf-8',
      maxBuffer: 1 << 28
    }));
  } catch (error) {
    assert.equal(error.status, 1, `verifier failed without a check verdict: ${error.stderr}`);
    return JSON.parse(error.stdout);
  }
}

function counts(message) {
  const read = (label) => {
    const match = new RegExp(`(\\d+) ${label}`).exec(message);
    assert.ok(match, `pass message lost its "${label}" count: ${message}`);
    return Number(match[1]);
  };
  return {
    resolved: read('resolved formal answers'),
    unresolved: read('unresolved formal answers')
  };
}

function copyWorkingTree() {
  const root = mkdtempSync(path.join(tmpdir(), 'gate-answer-reference-'));
  cpSync(projectRoot, root, {
    recursive: true,
    filter: (source) => {
      const relative = path.relative(projectRoot, source);
      return relative !== '.git'
        && !relative.startsWith(`.git${path.sep}`)
        && relative !== 'node_modules'
        && !relative.startsWith(`node_modules${path.sep}`)
        && relative !== '.claude/worktrees'
        && !relative.startsWith(`.claude${path.sep}worktrees${path.sep}`);
    }
  });
  return root;
}

const clean = run(projectRoot);
const cleanPasses = clean.pass.filter((result) => result.check === CHECK);
const cleanFailures = clean.fail.filter((result) => result.check === CHECK);

describe('gate-answer-reference', () => {
  it('reports a clean known-pass result for every canonical protocol', () => {
    const expected = protocolFiles({ projectRoot }).sort();
    const actual = cleanPasses.map((result) => result.file).sort();
    assert.deepEqual(actual, expected);
    assert.deepEqual(cleanFailures, []);
    assert.ok(
      cleanPasses.some((result) => counts(result.message).resolved > 0),
      'no formal gate answer was resolved — extraction is inert'
    );
  });

  it('rejects dangling TYPES, MODE STATE, and inline type references', () => {
    const root = copyWorkingTree();
    try {
      const aitesisPath = path.join(root, 'aitesis/skills/inquire/SKILL.md');
      const aitesis = readFileSync(aitesisPath, 'utf-8');
      assert.ok(aitesis.includes('→ Stop → A '), 'Aitesis mutation anchor moved');
      writeFileSync(aitesisPath, aitesis.replace('→ Stop → A ', '→ Stop → Zeta '));

      const horismosPath = path.join(root, 'horismos/skills/bound/SKILL.md');
      const horismos = readFileSync(horismosPath, 'utf-8');
      assert.ok(horismos.includes('→ Stop → Λ.final_gate_answers'), 'Horismos mutation anchor moved');
      assert.ok(horismos.includes('→ Stop → confirmed_intent ∈ J'), 'Horismos inline type anchor moved');
      writeFileSync(
        horismosPath,
        horismos
          .replace('→ Stop → Λ.final_gate_answers', '→ Stop → Λ.missing_gate_answers')
          .replace('→ Stop → confirmed_intent ∈ J', '→ Stop → confirmed_intent ∈ Zeta')
      );

      const mutated = run(root);
      const failures = mutated.fail
        .filter((result) => result.check === CHECK)
        .map((result) => `${result.file}: ${result.message}`);
      assert.ok(failures.some((message) => message.includes('`Zeta`')), failures.join('\n'));
      assert.ok(failures.some((message) => message.includes('`Λ.missing_gate_answers`')), failures.join('\n'));
      assert.ok(failures.some((message) => message.includes('inline gate answer type `Zeta`')), failures.join('\n'));
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
