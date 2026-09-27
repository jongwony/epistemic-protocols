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
 *                    by `open Ground` (the canonical `EpistemicProtocols.Ground`)
 *                    and the vocabulary opening its TOOL GROUNDING section by
 *                    `open ToolGrounding` (the canonical
 *                    `EpistemicProtocols.ToolGrounding`).
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
const CANONICAL_TOOL_GROUNDING = path.join('lean', 'EpistemicProtocols', 'ToolGrounding.lean');
const TOOL_GROUNDING_THEOREMS = path.join('lean', 'EpistemicProtocols', 'ToolGrounding', 'Theorems.lean');
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

// The text a canonical shared section carries: between `namespace <ns>` and
// `end <ns>` of its file.
function canonicalText(source, ns) {
  const m = new RegExp(`^namespace ${ns}\\n\\n([\\s\\S]*?)^end ${ns}\\s*$`, 'm').exec(source);
  return m ? m[1] : null;
}

const canonicalGroundText = (source) => canonicalText(source, 'Ground');
const canonicalToolGroundingText = (source) => canonicalText(source, 'ToolGrounding');

// The vocabulary that opens a block's TOOL GROUNDING section: the canonical
// text's length from the section's `/-! ── TOOL GROUNDING ──` line. Null when
// the block has no such section — whether the contract then grounds its
// operations is the audit's to judge. `matches` says whether the copy is the
// canonical text.
function toolGroundingSpan(block, canonical) {
  const start = block.search(/^\/-! ── TOOL GROUNDING ──/m);
  if (start === -1) return null;
  const end = start + canonical.length;
  const text = block.slice(start, end);
  return { start, end, text, matches: text === canonical };
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

// `tool` is the block's TOOL GROUNDING span, already found to match the
// canonical text, or null when the block has no such section.
function contractModule(block, ns, tool) {
  const ground = groundSpan(block);
  const rest = tool
    ? `${block.slice(ground.end, tool.start)}open ToolGrounding\n\n${block.slice(tool.end)}`
    : block.slice(ground.end);
  return [
    'module',
    '',
    'public import EpistemicProtocols.Ground',
    'public import EpistemicProtocols.ToolGrounding',
    '',
    '@[expose] public section',
    '',
    `${block.slice(0, ground.start)}open Ground`,
    '',
    rest,
  ].join('\n');
}

function readCanonical(root, rel, extract) {
  const full = path.join(root, rel);
  return fs.existsSync(full) ? extract(fs.readFileSync(full, 'utf8')) : null;
}

// The generated contract modules, derived from the blocks. `blocks` is
// [{ relPath, block }]; `units` names each audited protocol. A block whose
// shared sections cannot be replaced by the canonical modules is left out;
// lean-definition reports why.
function planContracts(root, blocks) {
  const files = [];
  const units = [];
  const toolCanonical = readCanonical(root, CANONICAL_TOOL_GROUNDING, canonicalToolGroundingText);
  for (const { relPath, block } of blocks) {
    const ns = blockNamespace(block);
    const ground = groundSpan(block);
    if (!ns || !ground || block.indexOf(`namespace ${ns}`) > ground.start) continue;
    const tool = toolCanonical === null ? undefined : toolGroundingSpan(block, toolCanonical);
    if (tool === undefined || (tool && (!tool.matches || tool.start < ground.end))) continue;
    files.push({ path: path.join(GENERATED_DIR, 'Contract', `${ns}.lean`), text: contractModule(block, ns, tool) });
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
  CANONICAL_TOOL_GROUNDING,
  GENERATED_DIR,
  GROUND_THEOREMS,
  LEAN_TOOLING_DIRS,
  TOOL_GROUNDING_THEOREMS,
  blockNamespace,
  canonicalGroundText,
  canonicalToolGroundingText,
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
  toolGroundingSpan,
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
