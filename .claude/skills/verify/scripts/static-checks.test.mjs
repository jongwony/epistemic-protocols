#!/usr/bin/env node
/**
 * Known-pass / known-fail proof for gate-answer-reference and lean-definition.
 *
 * The former gate-type-soundness check went inert when its prose anchor was
 * ablated. This test establishes that the replacement reaches every protocol
 * and rejects exact dangling references without asking a static parser to judge
 * context-dependent gate semantics. A protocol whose Definition block is Lean 4
 * resolves its references by elaboration instead, so lean-definition carries
 * that protocol, and the two checks together reach every protocol.
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
const LEAN = 'lean-definition';
const leanVerdicts = [...clean.pass, ...clean.warn].filter((result) => result.check === LEAN);
const leanFailures = clean.fail.filter((result) => result.check === LEAN);

function isLeanProtocol(file) {
  return /^## Definition$(?:(?!^```)[\s\S])*?^```lean$/m.test(readFileSync(path.join(projectRoot, file), 'utf-8'));
}

describe('gate-answer-reference', () => {
  it('reports a clean known-pass result for every canonical DSL protocol', () => {
    const expected = protocolFiles({ projectRoot }).filter((file) => !isLeanProtocol(file)).sort();
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
      const anamnesisPath = path.join(root, 'anamnesis/skills/recollect/SKILL.md');
      const anamnesis = readFileSync(anamnesisPath, 'utf-8');
      assert.ok(anamnesis.includes('→ Stop → U '), 'Anamnesis mutation anchor moved');
      writeFileSync(anamnesisPath, anamnesis.replaceAll('→ Stop → U ', '→ Stop → Zeta '));

      const katalepsisPath = path.join(root, 'katalepsis/skills/grasp/SKILL.md');
      const katalepsis = readFileSync(katalepsisPath, 'utf-8');
      assert.ok(katalepsis.includes('→ Stop → ZeroGapConfirmation '), 'Katalepsis mutation anchor moved');
      writeFileSync(
        katalepsisPath,
        katalepsis.replace('→ Stop → ZeroGapConfirmation ', '→ Stop → Λ.missing_gate_answers ')
      );

      const hyphegesisPath = path.join(root, 'hyphegesis/skills/conduct/SKILL.md');
      const hyphegesis = readFileSync(hyphegesisPath, 'utf-8');
      assert.ok(hyphegesis.includes('→ Stop → DM ∈ {'), 'Hyphegesis inline type anchor moved');
      writeFileSync(hyphegesisPath, hyphegesis.replace('→ Stop → DM ∈ {', '→ Stop → DM ∈ Zeta {'));

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

describe('lean-definition', () => {
  const leanFiles = protocolFiles({ projectRoot }).filter(isLeanProtocol).sort();

  it('reaches every protocol whose Definition block is Lean, with no failure', () => {
    assert.ok(leanFiles.length > 0, 'no Lean Definition block found — the check has nothing to reach');
    assert.deepEqual(leanVerdicts.map((result) => result.file).sort(), leanFiles);
    assert.deepEqual(leanFailures, []);
  });

  it('rejects sorry, a project axiom, an unelaborated reference, and a non-vocabulary annotation', () => {
    const root = copyWorkingTree();
    const target = leanFiles[0];
    try {
      const filePath = path.join(root, target);
      const original = readFileSync(filePath, 'utf-8');
      const fence = original.indexOf('```lean\n') + '```lean\n'.length;
      const close = original.indexOf('\n```', fence);
      const mutate = (body) => original.slice(0, fence) + body + original.slice(close);
      const block = original.slice(fence, close);

      writeFileSync(filePath, mutate(`${block}\ntheorem mutation_open : 1 = 2 := sorry`));
      let failures = run(root).fail.filter((r) => r.check === LEAN).map((r) => r.message);
      assert.ok(failures.some((m) => m.includes('`sorry`')), failures.join('\n'));

      writeFileSync(filePath, mutate(`${block}\naxiom mutation_assumed : 1 = 2`));
      failures = run(root).fail.filter((r) => r.check === LEAN).map((r) => r.message);
      assert.ok(failures.some((m) => m.includes('`axiom mutation_assumed`')), failures.join('\n'));

      const annotated = /\(\.(observe|sense|extension),/.exec(block);
      assert.ok(annotated, 'no grounding arm found to mutate');
      writeFileSync(filePath, mutate(block.replace(annotated[0], '(.inspect,')));
      const grounding = run(root);
      failures = grounding.fail.filter((r) => r.check === 'tool-grounding').map((r) => r.message);
      assert.ok(failures.some((m) => m.includes('Non-standard annotation "(inspect)"')), failures.join('\n'));

      writeFileSync(filePath, original.replace('── GROUND ──', '── GROUND ──\nA forked primitive.'));
      failures = run(root).fail.filter((r) => r.check === LEAN).map((r) => r.message);
      if (leanFiles.length > 1) {
        assert.ok(failures.some((m) => m.includes('GROUND section differs')), failures.join('\n'));
      }

      const elaborated = leanVerdicts.find((r) => r.file === target && clean.pass.includes(r));
      if (elaborated) {
        writeFileSync(filePath, mutate(`${block}\ndef mutation_dangling : Nat := undeclaredReference`));
        failures = run(root).fail.filter((r) => r.check === LEAN).map((r) => r.message);
        assert.ok(failures.some((m) => m.includes('does not elaborate')), failures.join('\n'));
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
