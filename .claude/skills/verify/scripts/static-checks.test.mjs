#!/usr/bin/env node
/**
 * Non-inertness guard for gate-type-soundness.
 *
 * The check this guards was previously anchored on prose `Options:` blocks. When the
 * prose ablation removed those blocks the check kept reporting pass while matching
 * nothing — a green result asserting an invariant it had stopped testing. These tests
 * assert the two rules reach real sites, so the same silence fails loudly next time.
 *
 * Run: node --test .claude/skills/verify/scripts/static-checks.test.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, '../../../..');
const checker = path.join(here, 'static-checks.js');

const results = JSON.parse(
  execFileSync('node', [checker, projectRoot], { encoding: 'utf-8', maxBuffer: 1 << 28 })
);

const CHECK = 'gate-type-soundness';
const passes = results.pass.filter((r) => r.check === CHECK);
const warns = results.warn.filter((r) => r.check === CHECK);

// "(12 coproducts, 4 Constitution gates, 2 typed gate answers, 0 option runs matched to TYPES, 0 untyped gate answers)"
function counts(message) {
  const read = (label) => {
    const m = new RegExp(`(\\d+) ${label}`).exec(message);
    assert.ok(m, `pass message lost its "${label}" count: ${message}`);
    return Number(m[1]);
  };
  return {
    coproducts: read('coproducts'),
    gates: read('Constitution gates'),
    typedAnswers: read('typed gate answers'),
    optionRuns: read('option runs matched to TYPES'),
    untypedAnswers: read('untyped gate answers')
  };
}

describe('gate-type-soundness', () => {
  it('reports on every protocol', () => {
    assert.ok(passes.length > 0, 'check produced no results at all');
  });

  it('reads a typed vocabulary and at least one Constitution gate out of every protocol', () => {
    for (const p of passes) {
      const c = counts(p.message);
      assert.ok(c.coproducts > 0, `${p.file}: no TYPES coproduct parsed — extraction is inert here`);
      assert.ok(c.gates > 0, `${p.file}: no Constitution gate parsed — extraction is inert here`);
    }
  });

  it('exercises both rules somewhere in the repo', () => {
    const total = passes.reduce(
      (acc, p) => {
        const c = counts(p.message);
        acc.typedAnswers += c.typedAnswers;
        acc.optionRuns += c.optionRuns;
        return acc;
      },
      { typedAnswers: 0, optionRuns: 0 }
    );
    assert.ok(total.typedAnswers > 0, 'no gate answer was resolved against TYPES — the answer-typing rule matches nothing');
    assert.ok(total.optionRuns > 0, 'no gate option run was paired to TYPES — the option-soundness rule matches nothing');
  });

  it('holds clean on the committed protocols', () => {
    assert.deepEqual(warns.map((w) => `${w.file}: ${w.message}`), []);
  });
});
