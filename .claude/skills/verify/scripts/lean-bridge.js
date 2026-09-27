/**
 * Lean bridge layer: the text that hands a protocol's Definition block to Lean,
 * and the check that runs Lean on it. Extraction of the block and its section
 * markers from Markdown, enrollment of each block as a `Contract.<NS>` module,
 * and `lean-definition`, which elaborates each block standalone, builds the
 * package with `lake build --wfail` and reads the checked-in audit's readout.
 */

const fs = require('fs');
const path = require('path');
const leanContract = require('./lean-contract');

// A Definition block is authored in one of two notations: the DSL (a bare
// ``` fence) or Lean 4 (a ```lean fence, see docs/structural-specs.md). Both
// carry the same section markers; in Lean the marker opens a module doc
// comment (`/-! ── NAME ──`), optionally closed on the same line (` -/`).
// A bare `-/` line only closes such a comment and is not section content.
const SECTION_HEADER = /^(?:\/-!\s*)?── ([^\n]+?) ──(?:\s*-\/)?$/;

function sectionHeaderName(trimmedLine) {
  const m = SECTION_HEADER.exec(trimmedLine);
  return m ? m[1] : null;
}

function collectSection(lines, start) {
  const collected = [];
  for (let j = start; j < lines.length; j++) {
    const trimmed = lines[j].trim();
    if (trimmed === '```' || sectionHeaderName(trimmed) !== null) break;
    if (trimmed === '-/') continue;
    collected.push(lines[j]);
  }
  return collected.join('\n').replace(/^\n+|\n+$/g, '');
}

function extractFormalSection(content, sectionName) {
  const lines = content.split('\n');
  const at = lines.findIndex(line => sectionHeaderName(line.trim()) === sectionName);
  return at === -1 ? '' : collectSection(lines, at + 1);
}

// True when the Definition block is authored in Lean 4 notation.
function isLeanDefinition(content) {
  return /^## Definition$(?:(?!^```)[\s\S])*?^```lean$/m.test(content);
}

// The Lean Definition block's source, without its fence.
function extractLeanDefinition(content) {
  const m = /^```lean\n([\s\S]*?)^```$/m.exec(content);
  return m ? m[1] : null;
}

// Lean source with comments removed, for token-level predicates that must not
// read doc prose (a doc comment may name `sorry` or `axiom` as words).
function stripLeanComments(source) {
  let out = '';
  let depth = 0;
  for (let i = 0; i < source.length; i++) {
    if (source.startsWith('/-', i)) { depth++; i++; continue; }
    if (depth > 0 && source.startsWith('-/', i)) { depth--; i++; continue; }
    if (depth > 0) { if (source[i] === '\n') out += '\n'; continue; }
    if (source.startsWith('--', i)) {
      const nl = source.indexOf('\n', i);
      if (nl === -1) break;
      i = nl - 1;
      continue;
    }
    if (source[i] === '"') {
      let end = i + 1;
      while (end < source.length && source[end] !== '"') end += source[end] === '\\' ? 2 : 1;
      out += '""';
      i = end;
      continue;
    }
    out += source[i];
  }
  return out;
}

// ============================================================
// Check: Lean Definition
// ============================================================
// A Definition block authored in Lean 4 is a contract only if it elaborates:
// a reference that does not resolve or a type that does not check is a defect
// the DSL could not surface. Elaboration runs with the core Lean toolchain (no
// Std, no Mathlib) when `lean` and `lake` are reachable — `$LEAN`/`$LAKE`,
// PATH, or `~/.elan/bin`. With no toolchain the elaboration verdict is
// reported as not obtained (warn), never as passed.
//
// A theorem is verification, not contract: the block states none, and each
// contract's guarantees are stated and proved together in
// `lean/EpistemicProtocols/<NS>/Theorems.lean`. The judgment is Lean's: the
// checked-in audit (`lean/Audit/`, run as `lake lint` through
// lean-contract.js's one driver) reads declaration ownership, kind, doc
// strings, guarantees, `Nonempty` witnesses and transitive axioms from the
// elaborated environment. This check orchestrates it and keeps what is text:
// extracting the block from Markdown, comparing GROUND against the canonical
// file, the repository inventory under `lean/`, and a token preflight over
// the Lean sources that a cheap scan catches before any build.


// Commands and options that can close a goal, add an assumption, or skip the
// kernel without a declaration the audit would see. A preflight: the audit's
// axiom and escape readout is the authority for what reaches the environment.
const LEAN_FORBIDDEN = [
  [/(?<![\w'.])sorry(?![\w'])/, '`sorry`'],
  [/(?<![\w'.])admit(?![\w'])/, '`admit`'],
  [/(?<![\w'.])sorryAx(?![\w'])/, '`sorryAx`'],
  [/(?<![\w'.])native_decide(?![\w'])/, '`native_decide`'],
  [/(?<![\w'.])implemented_by(?![\w'])/, '`implemented_by`'],
  [/(?<![\w'.])extern(?![\w'])/, '`extern`'],
  [/(?<![\w'.])unsafe(?![\w'])/, '`unsafe`'],
  [/(?<![\w'.])set_option(?![\w'])/, '`set_option`'],
  [/(?<![\w'.])debug\./, 'a `debug.` option'],
  [/#(?:exit|eval|print|reduce)\b/, 'a `#` command'],
  [/(?<![\w'.])(?:run_cmd|run_elab|run_meta|macro_rules|macro|elab_rules|elab|syntax|initialize|builtin_initialize)(?![\w'])/, 'a metaprogramming command'],
];

function leanLint(label, source) {
  const code = stripLeanComments(source);
  const problems = [];
  for (const [pattern, what] of LEAN_FORBIDDEN) {
    if (pattern.test(code)) problems.push(`${label} uses ${what} — a guarantee is proved in core Lean with nothing switched off`);
  }
  return problems;
}

// A Theorems module opens with `module` and imports only the contract it
// proves guarantees about and GROUND.
function leanTheoremsImports(label, source, ns) {
  const allowed = new Set(ns === 'Ground'
    ? ['EpistemicProtocols.Ground']
    : [`Contract.${ns}`, 'EpistemicProtocols.Ground', 'EpistemicProtocols.Ground.Theorems']);
  const problems = [];
  const code = stripLeanComments(source);
  if (!/^module\s*$/m.test(code.split('\n').find(line => line.trim() !== '') || '')) {
    problems.push(`${label} does not open with \`module\` — its proofs stay private only under the module system`);
  }
  for (const m of code.matchAll(/^\s*(?:public\s+|meta\s+)*import\s+(?:all\s+)?([\w.]+)/gm)) {
    if (!allowed.has(m[1])) problems.push(`${label} imports \`${m[1]}\` — a Theorems module imports only ${[...allowed].join(', ')}`);
  }
  return problems;
}

function leanFilesUnder(dir, rel = '') {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const relPath = path.join(rel, entry.name);
    if (entry.isDirectory()) {
      if (relPath === '.contract') continue;
      files.push(...leanFilesUnder(path.join(dir, entry.name), relPath));
    } else if (entry.name.endsWith('.lean')) {
      files.push(path.join('lean', relPath));
    }
  }
  return files;
}

function checkLeanDefinition(ctx) {
  const { projectRoot, results, PROTOCOL_FILES } = ctx;
  const CHECK = 'lean-definition';
  const fail = (file, message) => results.fail.push({ check: CHECK, file, message });
  const groundPath = path.join(projectRoot, leanContract.CANONICAL_GROUND);
  const groundSource = fs.existsSync(groundPath) ? fs.readFileSync(groundPath, 'utf8') : null;
  const canonicalGround = groundSource === null ? null : leanContract.canonicalGroundText(groundSource);
  const blocks = [];
  const failedFiles = new Set();
  const namespaces = new Map();
  const expectedLean = new Set([leanContract.CANONICAL_GROUND, leanContract.GROUND_THEOREMS]);

  for (const relPath of PROTOCOL_FILES) {
    const fullPath = path.join(projectRoot, relPath);
    if (!fs.existsSync(fullPath)) continue;
    const content = fs.readFileSync(fullPath, 'utf8');
    if (!isLeanDefinition(content)) continue;

    const source = extractLeanDefinition(content);
    if (source === null) {
      fail(relPath, 'Definition opens a ```lean fence that never closes');
      continue;
    }
    const problems = leanLint('Lean Definition block', source);
    const ns = leanContract.blockNamespace(source);
    const ground = leanContract.groundSpan(source);
    if (!ns) problems.push('Lean Definition block opens no `namespace`');
    else if (namespaces.has(ns)) problems.push(`Lean Definition block reuses namespace ${ns} of ${namespaces.get(ns)}`);
    if (!ground) problems.push('Lean Definition block has no `── GROUND ──` section followed by `── TYPES ──`');
    else if (ns && source.indexOf(`namespace ${ns}`) > ground.start) problems.push('Lean Definition block opens its namespace after GROUND');
    else if (canonicalGround === null) problems.push(`${leanContract.CANONICAL_GROUND} is missing or has no \`namespace Ground\` … \`end Ground\` text`);
    else if (ground.text !== canonicalGround) problems.push(`GROUND section differs from ${leanContract.CANONICAL_GROUND} — the session primitive is one text across Lean blocks`);
    // The block states no theorem, GROUND included: nothing reads a statement there.
    {
      const stated = leanContract.docTheoremNames(source);
      for (const name of stated) {
        problems.push(`Lean Definition block states \`theorem ${name}\` in a doc comment — no audit reads a statement there; state and prove it in ${ns ? leanContract.theoremsModulePath(ns) : 'the protocol\'s Theorems.lean'}`);
      }
    }

    let theoremsRel = null;
    if (ns) {
      namespaces.set(ns, relPath);
      theoremsRel = leanContract.theoremsModulePath(ns);
      expectedLean.add(theoremsRel);
      const theoremsFull = path.join(projectRoot, theoremsRel);
      if (fs.existsSync(theoremsFull)) {
        const text = fs.readFileSync(theoremsFull, 'utf8');
        const own = [...leanLint(theoremsRel, text), ...leanTheoremsImports(theoremsRel, text, ns)];
        for (const message of own) fail(theoremsRel, message);
        if (own.length > 0) problems.push(`${theoremsRel} does not pass the Lean preflight`);
      } else {
        problems.push(`${theoremsRel} does not exist — a contract's guarantees are stated and proved there, with a \`Nonempty\` witness for each judgment`);
      }
    }
    for (const message of problems) fail(relPath, message);
    if (problems.length > 0) failedFiles.add(relPath);
    blocks.push({ relPath, block: source, theoremsRel });
  }

  for (const rel of [leanContract.CANONICAL_GROUND, leanContract.GROUND_THEOREMS]) {
    const full = path.join(projectRoot, rel);
    if (!fs.existsSync(full)) {
      if (blocks.length > 0) { fail(rel, 'Canonical GROUND file is missing'); failedFiles.add(rel); }
      continue;
    }
    const text = fs.readFileSync(full, 'utf8');
    const problems = leanLint(rel, text);
    if (rel === leanContract.GROUND_THEOREMS) problems.push(...leanTheoremsImports(rel, text, 'Ground'));
    for (const message of problems) fail(rel, message);
    if (problems.length > 0) failedFiles.add(rel);
  }

  // A Lean file the package does not account for proves nothing the runtime
  // surface carries, and is elaborated by nothing here. The audit and its
  // fixtures are tooling, not contract.
  const tooling = (rel) => leanContract.LEAN_TOOLING_DIRS.some((dir) => rel.startsWith(dir + path.sep));
  for (const rel of leanFilesUnder(path.join(projectRoot, 'lean'))) {
    if (!expectedLean.has(rel) && !tooling(rel)) fail(rel, 'Lean file is neither the canonical GROUND, a Theorems module of a protocol Lean block, nor the audit tooling under lean/Audit or lean/Tests');
  }

  if (blocks.length === 0) return;
  const lean = leanContract.resolveLeanTool('lean', 'LEAN', projectRoot);
  const lake = lean && leanContract.resolveLeanTool('lake', 'LAKE', projectRoot);
  if (!lean || !lake) {
    for (const { relPath } of blocks) {
      if (!failedFiles.has(relPath)) {
        results.warn.push({ check: CHECK, file: relPath, message: 'No Lean toolchain reachable ($LEAN/$LAKE, PATH, ~/.elan/bin) — elaboration not run for this Lean Definition block' });
      }
    }
    return;
  }

  // The runtime surface: each block elaborates standalone, as a reader loads it.
  for (const { relPath, block } of blocks) {
    if (failedFiles.has(relPath)) continue;
    const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'lean-definition-'));
    const file = path.join(dir, 'Definition.lean');
    fs.writeFileSync(file, block);
    try {
      const run = leanContract.run(lean, [file], projectRoot);
      const diagnostics = leanContract.diagnostics(run.output);
      if (run.status !== 0 || diagnostics.length > 0) {
        fail(relPath, `Lean Definition block does not elaborate cleanly: ${diagnostics.slice(0, 3).join(' | ').replaceAll(dir, '') || `exit ${run.status}`}`);
        failedFiles.add(relPath);
      }
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }

  // The package, through the one driver: generated contracts, GROUND, and every
  // Theorems module built with warnings as errors, then the Lean audit.
  const ready = blocks.filter(b => !failedFiles.has(b.relPath));
  const result = leanContract.check(projectRoot, ready, lake);
  const units = [{ relPath: leanContract.CANONICAL_GROUND, ns: 'Ground' }, ...result.plan.units];
  if (result.build.status !== 0 || result.build.diagnostics.length > 0) {
    const attributed = new Set();
    for (const { relPath, ns } of units) {
      const own = result.build.diagnostics.filter(line => ns === 'Ground'
        ? /EpistemicProtocols\/Ground/.test(line)
        : line.includes(`Contract/${ns}.lean`) || line.includes(`EpistemicProtocols/${ns}/`));
      if (own.length === 0) continue;
      own.forEach(line => attributed.add(line));
      fail(relPath, `Lean package does not build cleanly: ${own.slice(0, 3).join(' | ')}`);
    }
    if (attributed.size === 0) {
      fail('lakefile.toml', `Lean package does not build cleanly: ${result.build.diagnostics.slice(0, 3).join(' | ') || `exit ${result.build.status}`}`);
    }
    return;
  }
  if (!result.audit) {
    fail('lakefile.toml', `The Lean audit (\`lake lint\`) printed no readout: ${leanContract.diagnostics(result.lint.output).slice(0, 3).join(' | ') || result.lint.output.trim().split('\n').slice(-3).join(' | ') || `exit ${result.lint.status}`}`);
    return;
  }

  const reports = new Map(result.audit.map(r => [r.ns, r]));
  for (const { relPath, ns } of units) {
    const report = reports.get(ns);
    if (!report) {
      fail(relPath, `The Lean audit returned no report for ${ns}`);
      continue;
    }
    const problems = [...report.problems];
    if (problems.length > 0) {
      for (const message of problems) fail(relPath, message);
      continue;
    }
    const block = blocks.find(b => b.relPath === relPath);
    results.pass.push({
      check: CHECK,
      file: relPath,
      message: ns === 'Ground'
        ? `Canonical GROUND elaborates, and ${leanContract.GROUND_THEOREMS} proves its ${report.guarantees.length} guarantee(s); the Lean audit finds no project axiom`
        : `Lean Definition block elaborates standalone, and ${block.theoremsRel} proves ${report.guarantees.length} guarantee(s)${report.helpers.length > 0 ? ` with ${report.helpers.length} private helper(s)` : ''}; the Lean audit admits only propext, Classical.choice, Quot.sound and ${report.judgments.length} documented judgment(s), each inhabited by a witness that assumes nothing`,
    });
  }
}

module.exports = {
  CHECKS: [checkLeanDefinition],
  checkLeanDefinition,
  extractFormalSection,
  extractLeanDefinition,
  isLeanDefinition,
  stripLeanComments,
};
