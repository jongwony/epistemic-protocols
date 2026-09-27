#!/usr/bin/env node
/**
 * Lean contract build: turns each protocol SKILL.md Lean block into the Lake
 * package's `Contract.<NS>` module under `lean/.contract/`, which is
 * gitignored — the SKILL.md block stays the single source, and a generated
 * file is never edited by hand. Each contract's guarantees are stated and
 * proved together in `lean/EpistemicProtocols/<NS>/Theorems.lean`; the audit
 * that judges them is checked in (`lean/Audit/`) and runs as `lake lint`.
 *
 *   Contract.<NS>  = module header + the block, with its GROUND section replaced
 *                    by `open Ground` (the canonical `EpistemicProtocols.Ground`).
 *
 * One driver runs the whole path, locally, in the static checks, and in CI:
 *   generate → `lake build --wfail` → `lake lint` (prints `AUDIT {json}`).
 *
 * Run: node .claude/skills/verify/scripts/lean-contract.js generate [root]
 *      node .claude/skills/verify/scripts/lean-contract.js check [root]
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const GENERATED_DIR = path.join('lean', '.contract');
const CANONICAL_GROUND = path.join('lean', 'EpistemicProtocols', 'Ground.lean');
const GROUND_THEOREMS = path.join('lean', 'EpistemicProtocols', 'Ground', 'Theorems.lean');
// The checked-in Lean tooling: the audit and its fixtures. Not part of any contract.
const LEAN_TOOLING_DIRS = Object.freeze([path.join('lean', 'Audit'), path.join('lean', 'Tests')]);

// The Lean Definition block's source, without its fence.
function extractLeanBlock(content) {
  const m = /^```lean\n([\s\S]*?)^```$/m.exec(content);
  return m ? m[1] : null;
}

function blockNamespace(block) {
  const m = /^namespace ([\w.]+)\s*$/m.exec(block);
  return m ? m[1] : null;
}

// The GROUND section of a block: from its `/-! ── GROUND ──` line up to the
// `/-! ── TYPES ──` line. Offsets are character indices into the block.
function groundSpan(block) {
  const start = block.search(/^\/-! ── GROUND ──/m);
  const end = block.search(/^\/-! ── TYPES ──/m);
  if (start === -1 || end === -1 || end < start) return null;
  return { start, end, text: block.slice(start, end) };
}

// The canonical GROUND text: between `namespace Ground` and `end Ground`.
function canonicalGroundText(source) {
  const m = /^namespace Ground\n\n([\s\S]*?)^end Ground\s*$/m.exec(source);
  return m ? m[1] : null;
}

// Names of the `theorem` lines inside `/-! … -/` doc comments of `text`: a
// statement there is read by nothing, so neither a block nor GROUND carries one.
function docTheoremNames(text) {
  const names = [];
  for (const doc of text.matchAll(/\/-!([\s\S]*?)-\//g)) {
    for (const m of doc[1].matchAll(/^theorem\s+([^\s:({[]+)/gm)) names.push(m[1]);
  }
  return names;
}

// Where a protocol's guarantees are stated and proved.
function theoremsModulePath(ns) {
  return path.join('lean', 'EpistemicProtocols', ...ns.split('.'), 'Theorems.lean');
}

function contractModule(block, ns) {
  const ground = groundSpan(block);
  return [
    'module',
    '',
    'public import EpistemicProtocols.Ground',
    '',
    '@[expose] public section',
    '',
    `${block.slice(0, ground.start)}open Ground`,
    '',
    block.slice(ground.end),
  ].join('\n');
}

// The generated contract modules, derived from the blocks. `blocks` is
// [{ relPath, block }]; `units` names each audited protocol.
function planContracts(root, blocks) {
  const files = [];
  const units = [];
  for (const { relPath, block } of blocks) {
    const ns = blockNamespace(block);
    const ground = groundSpan(block);
    if (!ns || !ground || block.indexOf(`namespace ${ns}`) > ground.start) continue;
    files.push({ path: path.join(GENERATED_DIR, 'Contract', `${ns}.lean`), text: contractModule(block, ns) });
    units.push({ relPath, ns });
  }
  return { files, units };
}

function writeContracts(root, plan) {
  fs.rmSync(path.join(root, GENERATED_DIR), { recursive: true, force: true });
  for (const file of plan.files) {
    const full = path.join(root, file.path);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, file.text);
  }
}

function leanBlocksFrom(root, relPaths) {
  const blocks = [];
  for (const relPath of relPaths) {
    const full = path.join(root, relPath);
    if (!fs.existsSync(full)) continue;
    const block = extractLeanBlock(fs.readFileSync(full, 'utf8'));
    if (block !== null) blocks.push({ relPath, block });
  }
  return blocks;
}

// `lean` or `lake`: `$LEAN`/`$LAKE`, then PATH, then `~/.elan/bin`.
function resolveLeanTool(name, envVar, root) {
  const candidates = [process.env[envVar], name, path.join(os.homedir(), '.elan/bin', name)].filter(Boolean);
  for (const bin of candidates) {
    try {
      execFileSync(bin, ['--version'], { stdio: 'pipe', timeout: 30000, cwd: root });
      return bin;
    } catch { /* try the next candidate */ }
  }
  return null;
}

function run(bin, args, root) {
  try {
    const output = execFileSync(bin, args, { encoding: 'utf8', stdio: 'pipe', timeout: 900000, cwd: root, maxBuffer: 64 * 1024 * 1024 });
    return { status: 0, output };
  } catch (e) {
    return { status: e.status ?? 1, output: `${e.stdout || ''}${e.stderr || ''}` || e.message };
  }
}

const diagnostics = (output) => output.split('\n').filter((line) => /(?:^|\s)(error|warning):/.test(line));

// The driver: generate the contracts, build the package with warnings as
// errors, and run the audit. Returns what each stage produced; the caller
// judges it. `audit` is the list of per-unit reports, or null when the audit
// did not run or printed no readout; `auditError` says why a printed readout
// did not parse.
function check(root, blocks, lake) {
  const plan = planContracts(root, blocks);
  writeContracts(root, plan);
  const build = run(lake, ['build', '--wfail'], root);
  const result = { plan, build: { status: build.status, diagnostics: diagnostics(build.output), output: build.output }, lint: null, audit: null };
  if (build.status !== 0) return result;
  const lint = run(lake, ['lint', '--', ...plan.units.map((u) => u.ns)], root);
  result.lint = { status: lint.status, output: lint.output };
  const line = /^AUDIT (\[.*\])$/m.exec(lint.output);
  if (line) {
    try {
      result.audit = JSON.parse(line[1]);
    } catch (e) {
      result.auditError = e.message;
    }
  }
  return result;
}

module.exports = {
  CANONICAL_GROUND,
  GENERATED_DIR,
  GROUND_THEOREMS,
  LEAN_TOOLING_DIRS,
  blockNamespace,
  canonicalGroundText,
  check,
  diagnostics,
  docTheoremNames,
  extractLeanBlock,
  groundSpan,
  leanBlocksFrom,
  planContracts,
  resolveLeanTool,
  run,
  theoremsModulePath,
  writeContracts,
};

if (require.main === module) {
  const [command, rootArg] = process.argv.slice(2);
  if (command !== 'generate' && command !== 'check') {
    console.error('usage: lean-contract.js generate|check [root]');
    process.exit(2);
  }
  const root = path.resolve(rootArg || '.');
  const { protocolFiles } = require(path.join(root, 'scripts/load-protocols.js'));
  const blocks = leanBlocksFrom(root, protocolFiles({ projectRoot: root }));
  if (command === 'generate') {
    const plan = planContracts(root, blocks);
    writeContracts(root, plan);
    for (const file of plan.files) console.log(file.path);
  } else {
    const lake = resolveLeanTool('lake', 'LAKE', root);
    if (!lake) {
      console.error('No Lean toolchain reachable ($LAKE, PATH, ~/.elan/bin)');
      process.exit(2);
    }
    const result = check(root, blocks, lake);
    if (result.build.status !== 0) {
      process.stdout.write(result.build.output);
      process.exit(1);
    }
    process.stdout.write(result.lint.output);
    process.exit(result.lint.status === 0 && result.audit ? 0 : 1);
  }
}
