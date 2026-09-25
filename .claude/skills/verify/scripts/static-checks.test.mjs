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
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
      const inlineAnchor = '→ Stop → X   -- store-expansion';
      assert.ok(anamnesis.includes(inlineAnchor), 'Anamnesis inline type anchor moved');
      writeFileSync(
        anamnesisPath,
        anamnesis
          .replaceAll('→ Stop → U ', '→ Stop → Zeta ')
          .replace(inlineAnchor, '→ Stop → X ∈ Zeta   -- store-expansion')
      );

      const katalepsisPath = path.join(root, 'katalepsis/skills/grasp/SKILL.md');
      const katalepsis = readFileSync(katalepsisPath, 'utf-8');
      assert.ok(katalepsis.includes('→ Stop → ZeroGapConfirmation '), 'Katalepsis mutation anchor moved');
      writeFileSync(
        katalepsisPath,
        katalepsis.replace('→ Stop → ZeroGapConfirmation ', '→ Stop → Λ.missing_gate_answers ')
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

describe('lean-definition', () => {
  const leanFiles = protocolFiles({ projectRoot }).filter(isLeanProtocol).sort();
  const target = leanFiles[0];
  const elaborated = clean.pass.some((r) => r.check === LEAN && r.file === target);

  // One copy of the tree per mutation group; `mutate` rewrites a file relative
  // to the copy and `failures` reruns the verifier there.
  function withCopy(body) {
    const root = copyWorkingTree();
    const originals = new Map();
    const file = (relative) => path.join(root, relative);
    const read = (relative) => readFileSync(file(relative), 'utf-8');
    const write = (relative, text) => {
      if (!originals.has(relative)) originals.set(relative, existsSync(file(relative)) ? read(relative) : null);
      mkdirSync(path.dirname(file(relative)), { recursive: true });
      writeFileSync(file(relative), text);
    };
    const restore = () => {
      for (const [relative, text] of originals) {
        if (text === null) rmSync(file(relative), { force: true });
        else writeFileSync(file(relative), text);
      }
      originals.clear();
    };
    const failures = () => run(root).fail.filter((r) => r.check === LEAN).map((r) => r.message);
    try {
      body({ read, write, restore, failures, verdict: () => run(root) });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }

  const skill = readFileSync(path.join(projectRoot, target), 'utf-8');
  const fence = skill.indexOf('```lean\n') + '```lean\n'.length;
  const close = skill.indexOf('\n```', fence);
  const block = skill.slice(fence, close);
  const withBlock = (body) => skill.slice(0, fence) + body + skill.slice(close);
  const ns = /^namespace (\w+)/m.exec(block)[1];
  const proofRelative = `lean/EpistemicProtocols/${ns}/Proofs.lean`;
  const proof = readFileSync(path.join(projectRoot, proofRelative), 'utf-8');
  const endNs = proof.lastIndexOf(`\nend ${ns}`);
  const beforeEnd = (text) => `${proof.slice(0, endNs)}\n${text}\n${proof.slice(endNs)}`;
  const firstTheorem = /^theorem\s+(\S+)[^\n]*$/m.exec(proof);
  const expectSome = (messages, needle) => assert.ok(messages.some((m) => m.includes(needle)), `expected "${needle}" in:\n${messages.join('\n')}`);

  it('reaches every protocol whose Definition block is Lean, with no failure', () => {
    assert.ok(leanFiles.length > 0, 'no Lean Definition block found — the check has nothing to reach');
    const verdictFiles = leanVerdicts.map((result) => result.file).filter((file) => file.endsWith('SKILL.md'));
    assert.deepEqual(verdictFiles.sort(), leanFiles);
    assert.deepEqual(leanFailures, []);
  });

  it('rejects proofs in the block, sorry, axioms, forks of GROUND, and forbidden escapes', () => {
    assert.ok(firstTheorem, 'no proved theorem found to mutate');
    withCopy(({ write, restore, failures, verdict }) => {
      write(target, withBlock(`${block}\n@[simp] theorem mutation_inline : True := trivial`));
      expectSome(failures(), 'proves `theorem mutation_inline` in place');
      restore();

      write(target, withBlock(`${block}\ntheorem mutation_open : 1 = 2 := sorry`));
      expectSome(failures(), '`sorry`');
      restore();

      write(target, withBlock(`${block}\naxiom mutation_assumed : 1 = 2`));
      expectSome(failures(), '`axiom mutation_assumed`');
      restore();

      write(target, skill.replace('── GROUND ──', '── GROUND ──\nA forked primitive.'));
      expectSome(failures(), 'GROUND section differs');
      restore();

      const annotated = /\(\.(observe|sense|extension),/.exec(block);
      assert.ok(annotated, 'no grounding arm found to mutate');
      write(target, withBlock(block.replace(annotated[0], '(.inspect,')));
      expectSome(verdict().fail.filter((r) => r.check === 'tool-grounding').map((r) => r.message), 'Non-standard annotation "(inspect)"');
      restore();

      // Codex review of #961: each of these elaborated cleanly or hid a proof gap.
      const escapes = [
        ['set_option warn.sorry false in\ntheorem mutation_cheat : 1 = 2 := by admit', '`set_option`'],
        ['theorem mutation_cheat : 1 = 2 := sorryAx _ true', '`sorryAx`'],
        ['@[simp] axiom mutation_false : False', '`axiom mutation_false`'],
        ['macro "mutation_axiom" : command => `(axiom mutationFalse : False)\nmutation_axiom', 'a metaprogramming command'],
        ['@[implemented_by id] def mutation_impl (n : Nat) : Nat := n\ntheorem mutation_native : False := by native_decide', '`native_decide`'],
        ['unsafe def mutation_unsafe : Nat := 0', '`unsafe`'],
        ['set_option debug.skipKernelTC true in\ntheorem mutation_skip : True := trivial', 'a `debug.` option'],
      ];
      for (const [text, needle] of escapes) {
        write(proofRelative, beforeEnd(text));
        expectSome(failures(), needle);
        restore();
      }

      write(proofRelative, proof.replace(/^(public import [^\n]*)$/m, '$1\nimport Lean'));
      expectSome(failures(), 'imports `Lean`');
      restore();
    });
  });

  it('accounts for every Lean file under lean/, at any depth', () => {
    withCopy(({ write, restore, failures }) => {
      for (const orphan of ['lean/Orphan.lean', `lean/EpistemicProtocols/${ns}/Nested/Orphan.lean`]) {
        write(orphan, 'theorem orphan : True := trivial\n');
        expectSome(failures(), 'neither the canonical GROUND nor the proofs module');
        restore();
      }
    });
  });

  it('reads theorems and axioms from elaboration, not from text', { skip: !elaborated && 'no Lean toolchain reachable' }, () => {
    withCopy(({ write, restore, failures }) => {
      // A hidden premise keeps the signature text intact but not its meaning —
      // the Codex counterexample, on a stated theorem with no hypothesis of its
      // own so that no unused-variable warning stops the build first.
      const { statedTheorems, groundSpan } = require(path.join(projectRoot, '.claude/skills/verify/scripts/lean-contract.js'));
      const host = leanFiles.map((file) => {
        const text = readFileSync(path.join(projectRoot, file), 'utf-8');
        const hostBlock = /^```lean\n([\s\S]*?)^```$/m.exec(text)[1];
        const hostNs = /^namespace (\w+)/m.exec(hostBlock)[1];
        const stated = statedTheorems(hostBlock.slice(groundSpan(hostBlock).end)).find((e) => e.name && !/\(h\w*\s*:/.test(e.signature));
        return stated && { hostNs, stated };
      }).find(Boolean);
      assert.ok(host, 'no hypothesis-free stated theorem found to carry a hidden premise');
      const hostProofRelative = `lean/EpistemicProtocols/${host.hostNs}/Proofs.lean`;
      const hostProof = readFileSync(path.join(projectRoot, hostProofRelative), 'utf-8');
      const hostOpened = hostProof.search(new RegExp(`^theorem ${host.stated.name}\\b`, 'm'));
      const hostClosed = Math.min(...['\n\n', '\nend '].map((mark) => hostProof.indexOf(mark, hostOpened)).filter((at) => at !== -1));
      write(hostProofRelative, `${hostProof.slice(0, hostOpened)}section\nvariable (mutationFalse : False)\ninclude mutationFalse\n${host.stated.signature} :=\n  False.elim mutationFalse\nend${hostProof.slice(hostClosed)}`);
      expectSome(failures(), 'does not follow from the proved theorem');
      restore();

      const name = firstTheorem[1];
      write(proofRelative, proof.replace(firstTheorem[0], firstTheorem[0].replace(name, `${name} (_mutationBinder : Nat)`)));
      expectSome(failures(), 'does not follow from the proved theorem');
      restore();

      // Proofs commented out: the text still reads as theorems; the environment does not.
      const opened = proof.indexOf(firstTheorem[0]);
      write(proofRelative, `${proof.slice(0, opened)}/-\n${proof.slice(opened, endNs)}\n-/${proof.slice(endNs)}`);
      expectSome(failures(), 'does not follow from the proved theorem');
      restore();

      write(proofRelative, beforeEnd('private theorem mutation_extra : True := trivial'));
      expectSome(failures(), `declares \`theorem ${ns}.mutation_extra\``);
      restore();

      // A judgment is a documented axiom of the block, and its type must be inhabited.
      write(target, withBlock(`${block}\n/-- **Your judgment**: nothing. -/\naxiom mutationEmpty : Empty`));
      expectSome(failures(), 'has no `Nonempty` instance');
      restore();

      // Two commands on one line escape a line-anchored axiom pattern; the
      // environment still holds the axiom.
      write(proofRelative, beforeEnd('example : True := trivial axiom mutationSneaky : False'));
      expectSome(failures(), `\`axiom ${ns}.mutationSneaky\` is declared`);
      restore();

      write(target, withBlock(`${block}\ndef mutation_dangling : Nat := undeclaredReference`));
      expectSome(failures(), 'does not elaborate');
      restore();
    });
  });
});
