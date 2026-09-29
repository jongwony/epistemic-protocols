#!/usr/bin/env node
/**
 * Known-pass / known-fail proof for the static checks, grouped by the layer
 * file each check lives in. Each rule is shown rejecting a mutated copy of the
 * tree (or a throwaway fixture), never the live tree.
 *
 *   lean-bridge.js         lean-definition reaches every canonical protocol,
 *                          whose Definition block is Lean 4, and each rule it
 *                          holds rejects its counterexample
 *   artifact-sync.js       version-staleness measures a change from its base;
 *                          structure holds the section schema and MORPHISM
 *                          anatomy; cross-ref-scan holds the Type signature
 *                          against the MORPHISM
 *   prose-surface.js       artifact-self-containment's path rules fire on a
 *                          backticked path
 *
 * A missing required input fails under every check that requires it; that
 * group mutates the tree once and reads every layer's verdict.
 *
 * Run: node --test .claude/skills/verify/scripts/static-checks.test.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
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

// Runs the verifier at `checker` (the one inside `root` by default) over `root`.
function run(root, { checker = path.join(root, checkerRelative), env = process.env } = {}) {
  try {
    return JSON.parse(execFileSync('node', [checker, root], {
      encoding: 'utf-8',
      maxBuffer: 1 << 28,
      env
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

describe('lean bridge: lean-definition', () => {
  it('reaches every protocol whose Definition block is Lean, with no failure', () => {
    assert.ok(leanFiles.length > 0, 'no Lean Definition block found — the check has nothing to reach');
    const verdictFiles = leanVerdicts.map((result) => result.file).filter((file) => file.endsWith('SKILL.md'));
    assert.deepEqual(verdictFiles.sort(), leanFiles);
    assert.deepEqual(leanFailures, []);
  });

  it('rejects sorry, forks of GROUND, forbidden escapes, and foreign imports before any build', () => {
    withCopy(({ write, restore, failures }) => {
      write(target, withBlock(`${block}\ntheorem mutation_open : 1 = 2 := sorry`));
      expectSome(failures(), '`sorry`');
      restore();

      write(target, skill.replace('── GROUND ──', '── GROUND ──\nA forked primitive.'));
      expectSome(failures(), 'GROUND section differs');
      restore();

      // An annotation added to the block's copy of the vocabulary is a fork of
      // the canonical text, whatever it would elaborate to.
      const vocabulary = '| dispatch | interaction (kind : Interaction)';
      assert.ok(skill.includes(vocabulary), 'precondition: the block carries the TOOL GROUNDING vocabulary');
      write(target, skill.replace(vocabulary, '| dispatch | inspect | interaction (kind : Interaction)'));
      expectSome(failures(), 'TOOL GROUNDING section does not open with the text of');
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
        expectSome(failures(), 'is neither a canonical shared section');
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
      const helpersBefore = (theorems.match(/^private theorem /gm) || []).length;
      write(theoremsRelative, beforeEnd('private theorem mutation_helper : True := trivial'));
      const helped = verdict();
      assert.deepEqual(helped.fail.filter((r) => r.check === LEAN), []);
      expectSome(helped.pass.filter((r) => r.check === LEAN && r.file === target).map((r) => r.message), `${helpersBefore + 1} private helper(s)`);
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

  // TOOL GROUNDING is judged from the elaborated `grounding`: each mutation
  // below still elaborates, and the audit rejects it (lake test runs the same
  // rules over lean/Tests fixtures).
  it('reads TOOL GROUNDING from elaboration: convergence, realization, and dispatch wiring', { skip: !elaborated && 'no Lean toolchain reachable' }, () => {
    const arm = (op) => new RegExp(`^(  \\| \\.${op}\\s+=> \\()([^,]+), "`, 'm');
    const converge = arm('converge').exec(block);
    const other = [...block.matchAll(/^  \| \.(\w+)\s+=> \(\.(?:sense|observe|transform), "/gm)].find((m) => m[1] !== 'converge');
    assert.ok(converge && other, 'precondition: the block grounds .converge and an operation that is neither an interaction nor a dispatch');
    const mutated = block
      .replace(arm('converge'), '$1.sense, "TextPresent+Proceed: ')
      .replace(arm(other[1]), '$1.dispatch, "');
    withCopy(({ write, failures }) => {
      write(target, withBlock(mutated));
      const messages = failures();
      expectSome(messages, `\`${ns}.grounding .converge\` is annotated \`ToolGrounding.Annot.sense\``);
      expectSome(messages, `the description of \`${ns}.Op.converge\` opens with \`TextPresent\``);
      expectSome(messages, `\`${ns}.Op.${other[1]}\` is a \`dispatch\` operation no contract declaration other than \`grounding\` names`);
    });
  });
});

describe('fail closed: a missing required input fails under each check that requires it', () => {
  it('fails a missing or non-Lean protocol, a missing index or onboard source, and a Rules label outside Rules', () => {
    const [missing, nonLean, displaced] = leanFiles.filter((file) => file !== target);
    const missingId = missing.split('/')[0];
    withCopy(({ read, write, remove, verdict }) => {
      remove(missing);
      write(nonLean, read(nonLean).replace('```lean\n', '```\n'));
      remove('CLAUDE.md');
      remove('epistemic-cooperative/skills/onboard/references/scenarios.md');
      remove('epistemic-cooperative/skills/onboard/references/workflow.md');

      // The label moves out of Rules rather than vanishing: a whole-file search
      // still finds it, and only a search confined to Rules does not.
      const text = read(displaced);
      const rules = text.indexOf('\n## Rules\n');
      const after = text.indexOf('\n## ', rules + 1);
      const end = after === -1 ? text.length : after;
      assert.ok(rules !== -1 && text.slice(rules, end).includes('**Round composition**'), `precondition: ${displaced} carries the label in Rules`);
      write(displaced, `${text.slice(0, rules)}${text.slice(rules, end).replaceAll('**Round composition**', 'Round composition')}${text.slice(end)}\n## Appendix\n\n**Round composition** stated outside Rules.\n`);

      const result = verdict();
      const failed = (check) => result.fail.filter((r) => r.check === check).map((r) => r.message);
      const registryGap = `Canonical protocol "${missingId}"`;
      for (const check of [LEAN, 'structure', 'emit-load-discipline', 'framing-readout-enforcement']) {
        expectSome(failed(check), registryGap);
      }
      assert.ok(result.fail.some((r) => r.check === LEAN && r.file === nonLean && r.message.includes('is not a ```lean fence')), `expected a non-Lean failure for ${nonLean}`);
      expectSome(failed('routing-index-contract'), 'CLAUDE.md not found');
      expectSome(failed('onboard-sync'), 'scenarios.md not found');
      expectSome(failed('onboard-sync'), 'workflow.md not found');
      assert.ok(result.fail.some((r) => r.check === 'emit-load-discipline' && r.file === displaced && r.message.includes('in ## Rules: Round composition')), `expected the displaced label to fail for ${displaced}`);
    });
  });

  // The audit's verdict is its exit status as well as its readout. The
  // counterexample needs the package to build, so it runs on its own tree.
  it('fails an audit whose exit status its readout does not account for', { skip: !elaborated && 'no Lean toolchain reachable' }, () => {
    withCopy(({ read, write, verdict }) => {
      const main = read('lean/Audit/Main.lean');
      const verdictLine = 'return if reports.any (fun r => !r.problems.isEmpty) then 1 else 0';
      assert.ok(main.includes(verdictLine), 'precondition: the audit driver returns its verdict on one line');
      write('lean/Audit/Main.lean', main.replace(verdictLine, 'return 1'));
      const result = verdict();
      expectSome(result.fail.filter((r) => r.check === LEAN).map((r) => r.message), 'exited with status 1 though its readout lists no problem');
      assert.deepEqual(result.pass.filter((r) => r.check === LEAN), [], 'no unit passes on a readout its audit exit contradicts');
    });
  });
});

describe('artifact sync: structure and the Type signature against the MORPHISM', () => {
  const failed = (result, check) => result.fail.filter((r) => r.check === check && r.file === target).map((r) => r.message);
  const { deficit, resolution } = /Type:\s*`\(([A-Za-z]+),[^)]*\)\s*→\s*([A-Za-z]+)`/.exec(skill).slice(1).reduce((acc, v, i) => ({ ...acc, [i ? 'resolution' : 'deficit']: v }), {});

  it('requires the TOOL GROUNDING section, the FLOW → MORPHISM → TYPES order, and every MORPHISM clause', () => {
    const flow = skill.indexOf('── FLOW ──');
    const morphism = skill.indexOf('── MORPHISM ──');
    assert.ok(flow !== -1 && morphism > flow && /^preserves:/m.test(skill), 'precondition: FLOW precedes MORPHISM, which carries a preserves: line');
    withCopy(({ write, verdict }) => {
      write(target, skill
        .replace('── TOOL GROUNDING ──', '── TOOLING ──')
        .replace('── FLOW ──', '── WOLF ──').replace('── MORPHISM ──', '── FLOW ──').replace('── WOLF ──', '── MORPHISM ──')
        .replace(/^preserves:/m, 'keeps:'));
      const messages = failed(verdict(), 'structure');
      expectSome(messages, 'Missing required section: "── TOOL GROUNDING ──"');
      expectSome(messages, 'must run FLOW → MORPHISM → TYPES');
      expectSome(messages, 'MORPHISM missing required clause "preserves:"');
    });
  });

  it('fails a MORPHISM whose deficit, source, or terminal disagrees with the Type signature', () => {
    const section = skill.slice(skill.indexOf('── MORPHISM ──'), skill.indexOf('── TYPES ──'));
    const terminal = new RegExp(`^(\\s*→\\s*)${resolution}\\b`, 'm');
    const source = section.split('\n').slice(1).find((line) => line.trim() && !line.trim().startsWith('→'));
    assert.ok(terminal.test(section) && new RegExp(`^deficit:\\s+${deficit}\\b`, 'm').test(section) && source, 'precondition: the MORPHISM names the signature\'s deficit and resolution');
    const mutated = section
      .replace(new RegExp(`^(deficit:\\s+)${deficit}\\b`, 'm'), '$1SomeOtherDeficit')
      .replace(terminal, '$1SomeOtherResolution')
      .replace(source, deficit);
    withCopy(({ write, verdict }) => {
      write(target, skill.replace(section, mutated));
      const messages = failed(verdict(), 'cross-ref-scan');
      expectSome(messages, `does not name the Type signature's deficit "${deficit}"`);
      expectSome(messages, `does not terminate in the Type signature's resolution "${resolution}"`);
      expectSome(messages, `MORPHISM starts from the deficit "${deficit}"`);
    });
  });
});

describe('artifact sync: version-staleness', () => {
  // A throwaway repository, verified by the live checker: one plugin, a trunk
  // that origin/main points at, and a branch whose change is committed — the
  // clean tree a CI checkout sees.
  const gitEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_') && key !== 'GITHUB_BASE_REF'));
  const git = (cwd, args) => execFileSync('git', args, { cwd, encoding: 'utf-8', stdio: 'pipe', env: gitEnv });
  const staleness = (root, env = gitEnv) => {
    const result = run(root, { checker: path.join(projectRoot, checkerRelative), env });
    return {
      fail: result.fail.filter((r) => r.check === 'version-staleness').map((r) => r.message),
      pass: result.pass.filter((r) => r.check === 'version-staleness').map((r) => r.message),
    };
  };
  const manifest = (version) => `${JSON.stringify({ name: 'plug', version }, null, 2)}\n`;

  it('measures a committed change from the merge-base with origin/main and requires a higher version', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'version-staleness-'));
    const put = (relative, text) => {
      mkdirSync(path.dirname(path.join(root, relative)), { recursive: true });
      writeFileSync(path.join(root, relative), text);
    };
    try {
      git(root, ['init', '-q', '-b', 'main', '.']);
      git(root, ['config', 'user.email', 'fixture@example.invalid']);
      git(root, ['config', 'user.name', 'fixture']);
      put('plug/.claude-plugin/plugin.json', manifest('1.0.0'));
      put('plug/skills/x/SKILL.md', 'base\n');
      git(root, ['add', '-A']);
      git(root, ['commit', '-qm', 'base']);
      git(root, ['update-ref', 'refs/remotes/origin/main', 'HEAD']);
      git(root, ['checkout', '-q', '-b', 'feature']);
      put('plug/skills/x/SKILL.md', 'changed\n');
      git(root, ['commit', '-qam', 'change without a bump']);
      assert.equal(git(root, ['status', '--porcelain']), '', 'precondition: a clean tree');

      expectSome(staleness(root).fail, 'no version bump');

      put('plug/.claude-plugin/plugin.json', manifest('0.9.0'));
      git(root, ['commit', '-qam', 'a lower version']);
      expectSome(staleness(root).fail, 'is not greater than 1.0.0');

      put('plug/.claude-plugin/plugin.json', manifest('1.0.1'));
      git(root, ['commit', '-qam', 'a higher version']);
      const bumped = staleness(root);
      assert.deepEqual(bumped.fail, []);
      expectSome(bumped.pass, 'the merge-base with origin/main');

      // A pull request whose base branch was never fetched has nothing to
      // measure from, and says so rather than comparing HEAD with itself.
      expectSome(staleness(root, { ...gitEnv, GITHUB_BASE_REF: 'unfetched' }).fail, 'is not fetched');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('fails when the base version is not x.y.z or absent, rather than accepting any change', () => {
    for (const [baseManifest, label] of [
      [manifest('1.2'), 'non-semver base'],
      [`${JSON.stringify({ name: 'plug' }, null, 2)}\n`, 'base without a version'],
    ]) {
      const root = mkdtempSync(path.join(tmpdir(), 'version-staleness-base-'));
      const put = (relative, text) => {
        mkdirSync(path.dirname(path.join(root, relative)), { recursive: true });
        writeFileSync(path.join(root, relative), text);
      };
      try {
        git(root, ['init', '-q', '-b', 'main', '.']);
        git(root, ['config', 'user.email', 'fixture@example.invalid']);
        git(root, ['config', 'user.name', 'fixture']);
        put('plug/.claude-plugin/plugin.json', baseManifest);
        put('plug/skills/x/SKILL.md', 'base\n');
        git(root, ['add', '-A']);
        git(root, ['commit', '-qm', 'base']);
        git(root, ['update-ref', 'refs/remotes/origin/main', 'HEAD']);
        git(root, ['checkout', '-q', '-b', 'feature']);
        put('plug/skills/x/SKILL.md', 'changed\n');
        put('plug/.claude-plugin/plugin.json', manifest('0.0.1'));
        git(root, ['commit', '-qam', 'change with a lower-looking version']);
        expectSome(staleness(root).fail, 'not x.y.z, so no bump can be established');
      } catch (e) {
        e.message = `${label}: ${e.message}`;
        throw e;
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    }
  });
});

describe('lean bridge: the standalone lean-contract.js command enrolls every protocol', () => {
  it('fails generate when a block is left out of the plan, naming the block and why', () => {
    const target = protocolFiles({ projectRoot })[0];
    const root = mkdtempSync(path.join(tmpdir(), 'lean-contract-cli-'));
    try {
      // A copy of the tree the command reads: the registry, the canonical
      // shared modules, and every protocol SKILL.md.
      for (const relative of ['scripts', 'lean/EpistemicProtocols', ...new Set(protocolFiles({ projectRoot }).map((p) => p.split('/')[0]))]) {
        cpSync(path.join(projectRoot, relative), path.join(root, relative), { recursive: true });
      }
      for (const file of ['.claude-plugin']) {
        if (existsSync(path.join(projectRoot, file))) cpSync(path.join(projectRoot, file), path.join(root, file), { recursive: true });
      }
      const cli = path.join(projectRoot, '.claude/skills/verify/scripts/lean-contract.js');
      const generate = () => spawnSync(process.execPath, [cli, 'generate', root], { encoding: 'utf-8' });
      assert.equal(generate().status, 0, 'precondition: the copied tree enrolls every protocol');

      const full = path.join(root, target);
      writeFileSync(full, readFileSync(full, 'utf-8').replace('inductive Continuation | stop | proceed', 'inductive Continuation | stop | proceed | pause'));
      const drifted = generate();
      assert.equal(drifted.status, 1);
      assert.match(drifted.stderr, new RegExp(`not enrolled: ${target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} — TOOL GROUNDING vocabulary differs`));

      rmSync(path.join(root, 'lean/EpistemicProtocols/ToolGrounding.lean'));
      const missing = generate();
      assert.equal(missing.status, 1);
      assert.match(missing.stderr, /ToolGrounding\.lean is missing/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe('prose surface: artifact-self-containment path rules', () => {
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
