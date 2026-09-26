#!/usr/bin/env node
/**
 * Known-pass / known-fail proof for lean-definition: it reaches every protocol
 * whose Definition block is Lean 4 — every protocol, now that none keeps the
 * DSL — and each rule it holds is shown rejecting a mutated copy of the tree.
 * artifact-self-containment's path rules are shown firing on a backticked path.
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

function copyWorkingTree() {
  const root = mkdtempSync(path.join(tmpdir(), 'lean-definition-'));
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
const LEAN = 'lean-definition';
const leanVerdicts = [...clean.pass, ...clean.warn].filter((result) => result.check === LEAN);
const leanFailures = clean.fail.filter((result) => result.check === LEAN);

function isLeanProtocol(file) {
  return /^## Definition$(?:(?!^```)[\s\S])*?^```lean$/m.test(readFileSync(path.join(projectRoot, file), 'utf-8'));
}

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
    const remove = (relative) => {
      if (!originals.has(relative)) originals.set(relative, read(relative));
      rmSync(file(relative), { force: true });
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
      body({ read, write, remove, restore, failures, verdict: () => run(root) });
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
  const theoremsRelative = `lean/EpistemicProtocols/${ns}/Theorems.lean`;
  const theorems = readFileSync(path.join(projectRoot, theoremsRelative), 'utf-8');
  const endNs = theorems.lastIndexOf(`\nend ${ns}`);
  const beforeEnd = (text) => `${theorems.slice(0, endNs)}\n${text}\n${theorems.slice(endNs)}`;
  const expectSome = (messages, needle) => assert.ok(messages.some((m) => m.includes(needle)), `expected "${needle}" in:\n${messages.join('\n')}`);

  it('reaches every protocol whose Definition block is Lean, with no failure', () => {
    assert.ok(leanFiles.length > 0, 'no Lean Definition block found — the check has nothing to reach');
    const verdictFiles = leanVerdicts.map((result) => result.file).filter((file) => file.endsWith('SKILL.md'));
    assert.deepEqual(verdictFiles.sort(), leanFiles);
    assert.deepEqual(leanFailures, []);
  });

  it('rejects sorry, forks of GROUND, forbidden escapes, and foreign imports before any build', () => {
    withCopy(({ write, restore, failures, verdict }) => {
      write(target, withBlock(`${block}\ntheorem mutation_open : 1 = 2 := sorry`));
      expectSome(failures(), '`sorry`');
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
        ['macro "mutation_axiom" : command => `(axiom mutationFalse : False)\nmutation_axiom', 'a metaprogramming command'],
        ['@[implemented_by id] def mutation_impl (n : Nat) : Nat := n\ntheorem mutation_native : False := by native_decide', '`native_decide`'],
        ['unsafe def mutation_unsafe : Nat := 0', '`unsafe`'],
        ['set_option debug.skipKernelTC true in\ntheorem mutation_skip : True := trivial', 'a `debug.` option'],
      ];
      for (const [text, needle] of escapes) {
        write(theoremsRelative, beforeEnd(text));
        expectSome(failures(), needle);
        restore();
      }

      write(theoremsRelative, theorems.replace(/^(public import [^\n]*)$/m, '$1\nimport Lean'));
      expectSome(failures(), 'imports `Lean`');
      restore();
    });
  });

  it('keeps theorem statements out of the block, and requires the Theorems module', () => {
    const closing = skill.indexOf('\n/-! ── CONVERGENCE ──');
    const grounded = skill.indexOf('/-! ── GROUND ──');
    assert.ok(closing !== -1 && grounded !== -1, 'no GROUND or CONVERGENCE section found to place a statement near');
    withCopy(({ write, remove, restore, failures }) => {
      write(target, `${skill.slice(0, closing)}\n/-!\ntheorem mutation_stated : True\n-/\n${skill.slice(closing)}`);
      expectSome(failures(), 'states `theorem mutation_stated` in a doc comment');
      restore();

      write(target, `${skill.slice(0, grounded)}/-!\ntheorem mutation_early : True\n-/\n\n${skill.slice(grounded)}`);
      expectSome(failures(), 'states `theorem mutation_early` in a doc comment');
      restore();

      remove(theoremsRelative);
      expectSome(failures(), `${theoremsRelative} does not exist`);
      restore();
    });
  });

  it('accounts for every Lean file under lean/, at any depth', () => {
    withCopy(({ write, restore, failures }) => {
      for (const orphan of ['lean/Orphan.lean', `lean/EpistemicProtocols/${ns}/Nested/Orphan.lean`]) {
        write(orphan, 'theorem orphan : True := trivial\n');
        expectSome(failures(), 'neither the canonical GROUND, a Theorems module');
        restore();
      }
    });
  });

  it('reads guarantees, judgments, and axioms from elaboration, not from text', { skip: !elaborated && 'no Lean toolchain reachable' }, () => {
    withCopy(({ write, restore, failures, verdict }) => {
      write(target, withBlock(`${block}\n@[simp] theorem mutation_inline : True := trivial`));
      expectSome(failures(), `\`theorem mutation_inline\` is proved in \`Contract.${ns}\``);
      restore();

      write(target, withBlock(`${block}\naxiom mutation_assumed : 1 = 2`));
      expectSome(failures(), "`axiom mutation_assumed` has no doc comment");
      restore();

      // A judgment is a documented axiom of the block, and its type must be inhabited.
      write(target, withBlock(`${block}\n/-- **Your judgment**: nothing. -/\naxiom mutationEmpty : Empty`));
      expectSome(failures(), 'has no `Nonempty` instance');
      restore();

      // Two commands on one line escape any line-anchored pattern; the
      // environment still holds the axiom.
      write(theoremsRelative, beforeEnd('example : True := trivial axiom mutationSneaky : False'));
      expectSome(failures(), `\`axiom ${ns}.mutationSneaky\` is declared in \`EpistemicProtocols.${ns}.Theorems\``);
      restore();

      // An underscore-prefixed name hides nothing (codex review of this change).
      write(theoremsRelative, beforeEnd('axiom _mutationCheat : False\ntheorem _mutation_unchecked : False := _mutationCheat'));
      expectSome(failures(), `\`axiom ${ns}._mutationCheat\` is declared in \`EpistemicProtocols.${ns}.Theorems\``);
      restore();

      write(theoremsRelative, beforeEnd('theorem mutation_unrelated : 1 + 1 = 2 := rfl'));
      expectSome(failures(), `guarantee \`${ns}.mutation_unrelated\` states nothing about the contract`);
      restore();

      write(theoremsRelative, beforeEnd('def mutation_def : Nat := 0'));
      expectSome(failures(), `\`${ns}.mutation_def\` is a public definition`);
      restore();

      // A private theorem is a helper, not a guarantee, and is admitted.
      write(theoremsRelative, beforeEnd('private theorem mutation_helper : True := trivial'));
      const helped = verdict();
      assert.deepEqual(helped.fail.filter((r) => r.check === LEAN), []);
      expectSome(helped.pass.filter((r) => r.check === LEAN && r.file === target).map((r) => r.message), '1 private helper(s)');
      restore();

      // With every theorem private, the contract guarantees nothing.
      write(theoremsRelative, theorems.replace(/^theorem /gm, 'private theorem '));
      expectSome(failures(), 'states no public theorem');
      restore();

      write(target, withBlock(`${block}\ndef mutation_dangling : Nat := undeclaredReference`));
      expectSome(failures(), 'does not elaborate');
      restore();
    });
  });
});

describe('artifact-self-containment path rules', () => {
  const { checkSurfaceLeaks } = require(path.join(projectRoot, '.claude/skills/verify/scripts/artifact-self-containment.js'));
  const leaks = (text) => {
    const bucket = { pass: [], fail: [], warn: [] };
    checkSurfaceLeaks(text, 'fixture:SKILL.md', 'artifact-self-containment', bucket);
    return bucket;
  };

  it('fails a backticked docs/ or .claude/ path and warns on a backticked principles/ path', () => {
    assert.match(leaks('Read `docs/guide.md` first.').fail.map((r) => r.message).join('\n'), /repo docs path/);
    assert.match(leaks('See `.claude/rules/x.md`.').fail.map((r) => r.message).join('\n'), /\.claude contributor path/);
    assert.match(leaks('See `principles/x.md`.').warn.map((r) => r.message).join('\n'), /principles directory/);
  });

  it('still ignores inline code for non-path rules and fenced examples for path rules', () => {
    const bucket = leaks('Name `mission-bridge.md` as a literal.\n\n```\ndocs/example.md\n```\n');
    assert.deepEqual(bucket.fail, []);
    assert.deepEqual(bucket.warn, []);
  });
});
