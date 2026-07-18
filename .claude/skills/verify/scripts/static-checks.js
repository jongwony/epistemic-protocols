#!/usr/bin/env node
/**
 * Static checks for epistemic protocol consistency
 * Zero-context execution: outputs JSON, consumes no context window
 *
 * Usage: node static-checks.js [project-root]
 * Output: JSON { pass: [], fail: [], warn: [] }
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const { execFileSync } = require('child_process');
const { runArtifactSelfContainmentCheck } = require('./artifact-self-containment');
const { runLanguagePurityCheck } = require('./language-purity');
const {
  discoverPlugins,
  protocolFiles,
  CANONICAL_PRECEDENCE: CANONICAL_PRECEDENCE_ARR,
  CANONICAL_CLUSTERS,
} = require(path.resolve(__dirname, '../../../../scripts/load-protocols.js'));
// __dirname-anchored require (absolute regardless of the projectRoot arg) so the
// generator's own canonical-source reads stay driven by the passed projectRoot.
const {
  checkRoutingMap,
  ROUTING_MAP_REL,
} = require(path.resolve(__dirname, '../../../../scripts/generate-routing-map.js'));

const projectRoot = process.argv[2] || process.cwd();

const results = { pass: [], fail: [], warn: [] };

// Single discoverPlugins() call shared across every check. plugin.json reads
// are memoized inside the helper, so the verifier pays one read per
// plugin.json regardless of how many checks consume the records below.
const _records = discoverPlugins({ projectRoot });
const _protocolRecords = _records.filter(r => r.isProtocol);

const PROTOCOL_FILES = protocolFiles({ projectRoot });

const CANONICAL_PRECEDENCE = CANONICAL_PRECEDENCE_ARR.join(' → ');

// Authoritative edge type allowlist — used by both graph-integrity and cross-ref-scan checks
const VALID_EDGE_TYPES = new Set(['precondition', 'advisory', 'suppression']);

// Protocol display name → {deficit, resolution}. Derived from per-protocol
// SKILL.md description Type signature; capitalize(dir) for display name.
//
// Loud-fail: extractTypeSignature returns null when the Type pattern is
// absent or malformed. Null values would silently flow into spec-vs-impl
// comparisons as the literal string "null", masking the real parse failure
// (PR #351 review H2). Validate at construction.
const CANONICAL_PROTOCOLS = Object.fromEntries(
  _protocolRecords.map(r => [
    r.dir[0].toUpperCase() + r.dir.slice(1),
    { deficit: r.deficit, resolution: r.resolution },
  ])
);
{
  const incomplete = Object.entries(CANONICAL_PROTOCOLS)
    .filter(([, m]) => !m.deficit || !m.resolution)
    .map(([k]) => k);
  if (incomplete.length) {
    throw new Error(
      `[static-checks] CANONICAL_PROTOCOLS missing deficit/resolution for: ${incomplete.join(', ')}. ` +
      `Likely cause: SKILL.md description Type signature absent or malformed for these protocols.`
    );
  }
}

// Shared directory walker for file collection
function walkFiles(dir, predicate, checkName) {
  const collected = [];
  function walk(d) {
    try {
      const entries = fs.readdirSync(d, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(d, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          walk(fullPath);
        } else if (predicate(entry)) {
          collected.push(fullPath);
        }
      }
    } catch (e) {
      if (e.code !== 'EACCES' && e.code !== 'ENOENT') {
        results.warn.push({ check: checkName, file: path.relative(projectRoot, d), message: `Directory walk error: ${e.code || e.message}` });
      }
    }
  }
  walk(dir);
  return collected;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractFormalSection(content, sectionName) {
  const lines = content.split('\n');
  const header = `── ${sectionName} ──`;
  let collecting = false;
  const collected = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!collecting) {
      if (trimmed === header) collecting = true;
      continue;
    }
    if (trimmed === '```' || /^── [^\n]+ ──$/.test(trimmed)) break;
    collected.push(line);
  }

  return collected.join('\n').replace(/^\n+|\n+$/g, '');
}

function extractAllFormalSections(content, sectionSuffix) {
  const lines = content.split('\n');
  const sections = [];
  const headerPattern = new RegExp(`^── (?:\\w+ )*${escapeRegex(sectionSuffix)} ──$`);

  for (let i = 0; i < lines.length; i++) {
    if (!headerPattern.test(lines[i].trim())) continue;
    const collected = [];
    for (let j = i + 1; j < lines.length; j++) {
      const trimmed = lines[j].trim();
      if (trimmed === '```' || /^── [^\n]+ ──$/.test(trimmed)) break;
      collected.push(lines[j]);
    }
    sections.push(collected.join('\n').replace(/^\n+|\n+$/g, ''));
  }
  return sections;
}

// ============================================================
// Check 1: JSON Schema Validation
// ============================================================
function checkJsonSchema() {
  const pluginJsonPaths = walkFiles(projectRoot, e => e.name === 'plugin.json', 'json-schema');

  const requiredFields = ['name', 'version', 'description', 'author'];
  const versionPattern = /^\d+\.\d+\.\d+$/;

  for (const jsonPath of pluginJsonPaths) {
    try {
      const content = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      const relativePath = path.relative(projectRoot, jsonPath);

      // Check required fields
      for (const field of requiredFields) {
        if (!content[field]) {
          results.fail.push({
            check: 'json-schema',
            file: relativePath,
            message: `Missing required field: ${field}`
          });
        }
      }

      // Check version format
      if (content.version && !versionPattern.test(content.version)) {
        results.warn.push({
          check: 'json-schema',
          file: relativePath,
          message: `Version "${content.version}" not in semver format (x.y.z)`
        });
      }

      // Check name format (lowercase, hyphens only)
      if (content.name && !/^[a-z][a-z0-9-]*$/.test(content.name)) {
        results.warn.push({
          check: 'json-schema',
          file: relativePath,
          message: `Name "${content.name}" should be lowercase with hyphens only`
        });
      }

      results.pass.push({
        check: 'json-schema',
        file: relativePath,
        message: 'Valid plugin.json structure'
      });

    } catch (e) {
      results.fail.push({
        check: 'json-schema',
        file: path.relative(projectRoot, jsonPath),
        message: `Invalid JSON: ${e.message}`
      });
    }
  }
}

// ============================================================
// Check 2: Unicode Notation Consistency
// ============================================================
// Strip fenced code blocks and inline code spans from text
// Notation conventions apply to prose, not code
function stripCodeFromText(text) {
  // Remove fenced code blocks (```...```)
  let result = text.replace(/```[\s\S]*?```/g, '');
  // Remove inline code spans (`...`)
  result = result.replace(/`[^`\n]+`/g, '');
  return result;
}

function checkNotation() {
  const notationRules = [
    { pattern: /(?<!-)->(?![a-zA-Z])/g, replace: '→', name: 'arrow' },
    { pattern: /\|\|(?=\s*[A-Z])/g, replace: '∥', name: 'parallel' },
    { pattern: /\\cap\b/g, replace: '∩', name: 'intersection' },
    { pattern: /\\cup\b/g, replace: '∪', name: 'union' },
    { pattern: /\\subseteq\b/g, replace: '⊆', name: 'subset' },
    { pattern: /\\in\b/g, replace: '∈', name: 'element' },
    { pattern: /\\neq\b/g, replace: '≠', name: 'not-equal' },
  ];

  const mdFiles = walkFiles(projectRoot, e => e.name.endsWith('.md'), 'notation');

  for (const mdPath of mdFiles) {
    let content;
    try {
      content = fs.readFileSync(mdPath, 'utf8');
    } catch (e) {
      results.warn.push({ check: 'notation', file: path.relative(projectRoot, mdPath), message: `Read error: ${e.message}` });
      continue;
    }
    const relativePath = path.relative(projectRoot, mdPath);

    // Skip README files for notation check (they may have different conventions)
    if (relativePath.includes('README')) continue;

    // Strip code blocks and inline code spans — notation rules apply to prose only
    const proseContent = stripCodeFromText(content);

    for (const rule of notationRules) {
      const matches = proseContent.match(rule.pattern);
      if (matches) {
        results.warn.push({
          check: 'notation',
          file: relativePath,
          message: `ASCII fallback "${matches[0]}" found, consider "${rule.replace}" (${rule.name})`
        });
      }
    }
  }

  results.pass.push({
    check: 'notation',
    file: 'all .md files',
    message: 'Notation consistency check completed'
  });
}

// ============================================================
// Check 3: Directive Verb Consistency
// ============================================================
function checkDirectiveVerb() {
  const mdFiles = walkFiles(projectRoot, e => e.name.endsWith('.md'), 'directive-verb');

  // Pattern: "invoke/use the X tool" should be "call the X tool"
  const wrongPatterns = [
    { pattern: /\b(invoke|use)\s+(the\s+)?\w+\s+tool\b/gi, correct: 'call' },
    { pattern: /\b(Invoke|Use)\s+AskUserQuestion\b/g, correct: 'call AskUserQuestion' },
  ];

  for (const mdPath of mdFiles) {
    let content;
    try {
      content = fs.readFileSync(mdPath, 'utf8');
    } catch (e) {
      results.warn.push({ check: 'directive-verb', file: path.relative(projectRoot, mdPath), message: `Read error: ${e.message}` });
      continue;
    }
    const relativePath = path.relative(projectRoot, mdPath);
    const lines = content.split('\n');

    lines.forEach((line, idx) => {
      for (const rule of wrongPatterns) {
        const matches = line.match(rule.pattern);
        if (matches) {
          results.warn.push({
            check: 'directive-verb',
            file: `${relativePath}:${idx + 1}`,
            message: `"${matches[0]}" should use "${rule.correct}" for tool invocation`
          });
        }
      }
    });
  }
}

// ============================================================
// Check 4: Cross-Reference Integrity
// ============================================================
function checkCrossReference() {
  const claudeMdPath = path.join(projectRoot, 'CLAUDE.md');

  if (!fs.existsSync(claudeMdPath)) {
    results.warn.push({
      check: 'xref',
      file: 'CLAUDE.md',
      message: 'CLAUDE.md not found, skipping cross-reference check'
    });
    return;
  }

  const claudeMd = fs.readFileSync(claudeMdPath, 'utf8');

  // Check referenced files exist
  const fileRefs = claudeMd.matchAll(/`(references\/[^`]+)`/g);
  for (const ref of fileRefs) {
    const refPath = ref[1];
    // Check in likely locations
    // Single canonical location after reflexion removal and write consolidation
    // into epistemic-cooperative. Array form retained to accommodate future
    // references-hosting plugins without restructuring the resolver.
    const locations = [
      path.join(projectRoot, 'epistemic-cooperative/skills/write', refPath),
    ];

    let exists = locations.some(loc => fs.existsSync(loc));

    // Fallback: search project tree for matching filename
    if (!exists) {
      const basename = path.basename(refPath);
      const fallbackFiles = walkFiles(projectRoot, e => e.name === basename, null);
      exists = fallbackFiles.some(f => f.endsWith(refPath));
    }

    if (!exists && !refPath.includes('example')) {
      results.warn.push({
        check: 'xref',
        file: 'CLAUDE.md',
        message: `Referenced file "${refPath}" may not exist`
      });
    }
  }

  results.pass.push({
    check: 'xref',
    file: 'CLAUDE.md',
    message: 'Cross-reference check completed'
  });
}

// ============================================================
// Check: Routing Index Contract
// ============================================================
// CLAUDE.md/AGENTS.md indexes the protocol catalog rather than mirroring it: it
// must keep a "## Protocol Index" section that routes to the authoritative sources
// (/catalog, graph.json, per-protocol SKILL.md, README) instead of re-inscribing
// the catalog inline. This is the lightweight successor to the removed
// CLAUDE.md-content mirror checks (checkCrossRefScan) — it enforces the routing
// *contract* (structure + pointers), not mirrored content, so catalog drift is
// caught without re-creating the co-change chain the mirror checks imposed.
function checkRoutingIndexContract() {
  const check = 'routing-index-contract';
  const claudeMdPath = path.join(projectRoot, 'CLAUDE.md');

  if (!fs.existsSync(claudeMdPath)) {
    results.warn.push({
      check,
      file: 'CLAUDE.md',
      message: 'CLAUDE.md not found, skipping routing-index contract check'
    });
    return;
  }

  const claudeMd = fs.readFileSync(claudeMdPath, 'utf8');
  let failed = false;

  // Contract 1: an H2 "## Protocol Index" section must be present — matched
  // line-anchored and exactly at H2, so an inline mention in prose or an `###`
  // subheading cannot satisfy the contract. Its routing pointers are then checked
  // WITHIN that section (sliced to the next H2 or end of file), so an incidental
  // mention elsewhere in the file (e.g. `SKILL.md` in the Runtime Contract prose)
  // cannot satisfy the contract on its own.
  const headingMatch = claudeMd.match(/^##[ \t]+Protocol Index[ \t]*$/m);
  if (!headingMatch) {
    results.fail.push({
      check,
      file: 'CLAUDE.md',
      message: 'Missing "## Protocol Index" H2 section — the routing index is the successor to the removed inline protocol catalog'
    });
    failed = true;
  } else {
    const afterHeading = claudeMd.slice(headingMatch.index + headingMatch[0].length);
    const nextH2 = afterHeading.search(/\n##[ \t]/);
    const section = nextH2 === -1 ? afterHeading : afterHeading.slice(0, nextH2);
    const requiredPointers = [
      { label: '/catalog', pattern: /\/catalog/ },
      { label: 'graph.json', pattern: /graph\.json/ },
      { label: 'per-protocol SKILL.md', pattern: /SKILL\.md/ },
      { label: 'README', pattern: /README/ },
    ];
    for (const { label, pattern } of requiredPointers) {
      if (!pattern.test(section)) {
        results.fail.push({
          check,
          file: 'CLAUDE.md',
          message: `Protocol Index missing routing pointer to authoritative source: ${label}`
        });
        failed = true;
      }
    }
  }

  // Contract 2 (warn): the removed inline catalog must not be reintroduced —
  // re-inscribing it would restore the mirror/co-change cost the index removed.
  const catalogRegressions = [
    { label: '"## Protocol Reference" heading', pattern: /^##[ \t]+Protocol Reference[ \t]*$/m },
    { label: '"Concern | Protocols" cluster table', pattern: /\|\s*Concern\s*\|\s*Protocols\s*\|/ },
  ];
  for (const { label, pattern } of catalogRegressions) {
    if (pattern.test(claudeMd)) {
      results.warn.push({
        check,
        file: 'CLAUDE.md',
        message: `Inline protocol catalog reintroduced (${label}) — route to /catalog, graph.json, SKILL.md, README instead of mirroring the catalog`
      });
    }
  }

  if (!failed) {
    results.pass.push({
      check,
      file: 'CLAUDE.md',
      message: 'Routing index contract satisfied'
    });
  }
}

// ============================================================
// Check 5: Required Sections in Protocols
// ============================================================
function checkRequiredSections() {

  const requiredSections = [
    '## Definition',
    '## Mode Activation',
    '## Protocol',
    '## Rules',
    '── PHASE TRANSITIONS ──',
    '── MODE STATE ──',
  ];

  for (const relPath of PROTOCOL_FILES) {
    const fullPath = path.join(projectRoot, relPath);
    if (!fs.existsSync(fullPath)) {
      results.warn.push({
        check: 'structure',
        file: relPath,
        message: `Protocol file not found: ${relPath}`
      });
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');

    for (const section of requiredSections) {
      if (!content.includes(section)) {
        results.fail.push({
          check: 'structure',
          file: relPath,
          message: `Missing required section: "${section}"`
        });
      }
    }

    results.pass.push({
      check: 'structure',
      file: relPath,
      message: 'Required sections present'
    });
  }
}

// ============================================================
// Check 6: Tool Grounding Consistency
// ============================================================
function checkToolGrounding() {

  // Only mandatory classifications require [Tool] notation in PHASE TRANSITIONS
  const MANDATORY_CLASSIFICATIONS = new Set(['dispatch']);

  // Valid annotation vocabulary (7-label MECE set; Cognitive Partnership Move primary frame)
  const VALID_ANNOTATIONS = new Set(['sense', 'observe', 'track', 'transform', 'dispatch', 'constitution', 'extension']);

  // Find operation in PHASE TRANSITIONS with any valid pattern
  function findOperationInPhaseTransitions(phaseSection, operation) {
    const escapedOp = escapeRegex(operation);

    // Pattern 1: Direct notation - Q[AskUserQuestion]
    const directPattern = new RegExp(`${escapedOp}\\[`);
    if (directPattern.test(phaseSection)) return true;

    // Pattern 2: Alias notation - present[S] where S is the operation
    const aliasPattern = new RegExp(`\\w+\\[${escapedOp}\\]`);
    if (aliasPattern.test(phaseSection)) return true;

    // Pattern 3: Parallel notation - ∥I[Task]
    const parallelPattern = new RegExp(`∥${escapedOp}\\[`);
    if (parallelPattern.test(phaseSection)) return true;

    // Pattern 4: Comment notation - -- S: AskUserQuestion
    const commentPattern = new RegExp(`--\\s*${escapedOp}:`);
    if (commentPattern.test(phaseSection)) return true;

    // Pattern 5: Operation with parenthesized arguments - e.g., Qc(args), Qs(args), Sc(args)
    // Word boundary prevents substring matches (e.g., "S(" matching inside "Qs(")
    const gatePattern = new RegExp(`(?:^|\\s)${escapedOp}\\(`, 'm');
    if (gatePattern.test(phaseSection)) return true;

    // Pattern 6: Operation followed by arrow - handles compound gates without args (e.g., "TeamCoord Qc →")
    const compoundNoArgsPattern = new RegExp(`(?:^|\\s)${escapedOp}\\s*→`, 'm');
    if (compoundNoArgsPattern.test(phaseSection)) return true;

    return false;
  }

  for (const relPath of PROTOCOL_FILES) {
    const fullPath = path.join(projectRoot, relPath);
    if (!fs.existsSync(fullPath)) {
      results.warn.push({
        check: 'tool-grounding',
        file: relPath,
        message: `Protocol file not found: ${relPath}`
      });
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');

    // Check 6a: TOOL GROUNDING section exists
    if (!content.includes('── TOOL GROUNDING ──')) {
      results.fail.push({
        check: 'tool-grounding',
        file: relPath,
        message: 'Missing required section: "── TOOL GROUNDING ──"'
      });
      continue;
    }

    // Check 6b: Extract tool bindings from TOOL GROUNDING section
    const groundingSection = extractFormalSection(content, 'TOOL GROUNDING');
    if (!groundingSection) {
      results.warn.push({
        check: 'tool-grounding',
        file: relPath,
        message: 'TOOL GROUNDING section header found but regex extraction failed — possible encoding issue'
      });
      continue;
    }
    const toolBindings = [];

    // Parse lines like: "S (extern) → ..." or "Phase 4a Δ (detect) → ..."
    // Capture: operation, qualifier (optional), classification, tool
    // Supports: Phase prefix, qualifier word (e.g., "Qc", "Qᵣs"), Greek letters, ?'/
    const bindingPattern = /^(?:Phase\s+\S+\s+)?([∥]?[\w\u0370-\u03FF?'\/]+)(?:\s+([\w\u0370-\u03FFᵣ]+))?\s*\((\w+)\)\s*→\s*(\w+)/gm;
    let match;
    while ((match = bindingPattern.exec(groundingSection)) !== null) {
      toolBindings.push({
        operation: match[1],
        qualifier: match[2] || null,
        classification: match[3],
        tool: match[4]
      });
    }

    // Check 6g: Validate annotation vocabulary
    for (const binding of toolBindings) {
      if (!VALID_ANNOTATIONS.has(binding.classification)) {
        results.fail.push({
          check: 'tool-grounding',
          file: relPath,
          message: `Non-standard annotation "(${binding.classification})" on operation "${binding.operation}". Valid annotations: ${[...VALID_ANNOTATIONS].join(', ')}`
        });
      }
    }

    // Warn if grounding section has binding arrows but no bindings were parsed
    if (toolBindings.length === 0 && groundingSection.includes('→')) {
      results.warn.push({
        check: 'tool-grounding',
        file: relPath,
        message: 'TOOL GROUNDING section contains binding arrows (→) but no bindings were parsed — regex may not match current format'
      });
    }

    // Check 6c: Verify PHASE TRANSITIONS reference tool bindings
    const phaseSection = extractFormalSection(content, 'PHASE TRANSITIONS');
    if (!phaseSection) {
      results.warn.push({
        check: 'tool-grounding',
        file: relPath,
        message: 'PHASE TRANSITIONS section expected but regex extraction failed — possible encoding issue'
      });
      continue;
    }

    for (const binding of toolBindings) {
      // Skip internal operations
      if (binding.tool === 'Internal') continue;

      // Skip non-mandatory classifications (track, sense, observe, etc.)
      if (!MANDATORY_CLASSIFICATIONS.has(binding.classification)) continue;

      // Check if operation appears with [Tool] notation in PHASE TRANSITIONS
      // For compound operations (e.g., "PF Qc", "TeamCoord Qc"), search for both
      // the compound form and the base operation
      const compoundOp = binding.qualifier ? `${binding.operation} ${binding.qualifier}` : null;
      const found = findOperationInPhaseTransitions(phaseSection, binding.operation) ||
                    (compoundOp && findOperationInPhaseTransitions(phaseSection, compoundOp));
      if (!found) {
        const displayOp = compoundOp || binding.operation;
        results.fail.push({
          check: 'tool-grounding',
          file: relPath,
          message: `Mandatory binding "${displayOp} (${binding.classification}) → ${binding.tool}" not found in PHASE TRANSITIONS with [Tool] notation`
        });
      }
    }

    // Check 6d: Verify TOOL GROUNDING has realization preamble
    if (!groundingSection.includes('-- Realization:')) {
      results.warn.push({
        check: 'tool-grounding',
        file: relPath,
        message: 'TOOL GROUNDING section missing "-- Realization:" preamble'
      });
    }

    // Check 6e: Verify Realization header distinguishes Constitution and Extension
    const realizationLine = groundingSection.match(/-- Realization:.*$/m);
    if (realizationLine) {
      const header = realizationLine[0];
      if (!header.includes('Constitution') || !header.includes('Extension')) {
        results.warn.push({
          check: 'tool-grounding',
          file: relPath,
          message: 'Realization header should distinguish Constitution and Extension interaction kinds (e.g., "Constitution → TextPresent+Stop; Extension → TextPresent+Proceed")'
        });
      }
    }

    // Check 6f: Verify convergence behavior is explicitly classified with interaction kind
    if (!/\bconverge\s*\((extension|constitution)\)/i.test(groundingSection)) {
      results.warn.push({
        check: 'tool-grounding',
        file: relPath,
        message: 'Convergence behavior not explicitly classified in TOOL GROUNDING — add converge entry with (extension) or (constitution) annotation'
      });
    }

    results.pass.push({
      check: 'tool-grounding',
      file: relPath,
      message: 'Tool grounding consistency verified'
    });
  }
}

// ============================================================
// Check 7: Version Staleness Detection
// ============================================================
function checkVersionStaleness() {
  // Verify git repo
  try {
    execFileSync('git', ['rev-parse', '--is-inside-work-tree'], { cwd: projectRoot, stdio: 'pipe' });
  } catch {
    // Not a git repo — check not applicable
    results.pass.push({ check: 'version-staleness', file: 'working tree', message: 'Not a git repository — skipping' });
    return;
  }

  // Collect all uncommitted changes (staged + unstaged + untracked)
  // Union of diff HEAD (working tree vs HEAD) and diff --cached (index vs HEAD)
  // to cover staged-only changes (e.g., git add file then revert working tree)
  let changedFiles;
  try {
    const diffHeadOutput = execFileSync('git', ['diff', 'HEAD', '--name-only'], { cwd: projectRoot, encoding: 'utf8' }).trim();
    const diffCachedOutput = execFileSync('git', ['diff', '--cached', '--name-only'], { cwd: projectRoot, encoding: 'utf8' }).trim();
    const untrackedOutput = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { cwd: projectRoot, encoding: 'utf8' }).trim();
    const fileSet = new Set([
      ...(diffHeadOutput ? diffHeadOutput.split('\n') : []),
      ...(diffCachedOutput ? diffCachedOutput.split('\n') : []),
      ...(untrackedOutput ? untrackedOutput.split('\n') : []),
    ]);
    changedFiles = [...fileSet];
  } catch {
    // git diff HEAD fails on initial commit (no HEAD) — fall back to staged + untracked only
    try {
      const stagedOutput = execFileSync('git', ['diff', '--cached', '--name-only'], { cwd: projectRoot, encoding: 'utf8' }).trim();
      const untrackedOutput = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { cwd: projectRoot, encoding: 'utf8' }).trim();
      changedFiles = [
        ...(stagedOutput ? stagedOutput.split('\n') : []),
        ...(untrackedOutput ? untrackedOutput.split('\n') : []),
      ];
    } catch {
      results.warn.push({ check: 'version-staleness', file: 'working tree', message: 'Git commands failed — version staleness check skipped' });
      return;
    }
  }

  if (changedFiles.length === 0) {
    results.pass.push({
      check: 'version-staleness',
      file: 'working tree',
      message: 'No uncommitted changes'
    });
    return;
  }

  // Skip version staleness check during conflict states (diff output unreliable)
  const conflictHeads = ['MERGE_HEAD', 'REBASE_HEAD', 'CHERRY_PICK_HEAD'];
  const activeConflict = conflictHeads.find(h => fs.existsSync(path.join(projectRoot, '.git', h)));
  if (activeConflict) {
    results.pass.push({
      check: 'version-staleness',
      file: 'working tree',
      message: `${activeConflict} detected — skipping version staleness check`
    });
    return;
  }

  // Find all plugin directories (contain .claude-plugin/plugin.json)
  const pluginDirs = new Map(); // pluginDir → plugin.json relative path
  function findPluginDirs(dir, depth = 0) {
    if (depth > 3) return;
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory() || entry.name === 'node_modules') continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.name === '.claude-plugin') {
          const pjPath = path.join(fullPath, 'plugin.json');
          if (fs.existsSync(pjPath)) {
            const parentRel = path.relative(projectRoot, dir);
            const pjRel = path.relative(projectRoot, pjPath);
            pluginDirs.set(parentRel || '.', pjRel);
          }
        } else if (!entry.name.startsWith('.')) {
          findPluginDirs(fullPath, depth + 1);
        }
      }
    } catch (e) {
      if (e.code !== 'EACCES' && e.code !== 'ENOENT') {
        results.warn.push({ check: 'version-staleness', file: path.relative(projectRoot, dir), message: `Directory walk error: ${e.code || e.message}` });
      }
    }
  }
  findPluginDirs(projectRoot);

  // Track warn count to avoid pass+warn co-emission
  let stalenessWarns = 0;

  // Non-semantic files that don't warrant a version bump
  const STALENESS_IGNORE = new Set([
    'README.md', 'README_ko.md', 'LICENSE', '.gitignore', '.gitattributes',
  ]);

  // Group changed files by plugin directory
  for (const [pluginDir, pluginJsonRel] of pluginDirs) {
    const prefix = pluginDir === '.' ? '' : pluginDir + '/';
    const pluginMetaPrefix = prefix + '.claude-plugin/';

    // Content changes = files in this plugin dir, excluding .claude-plugin/ and non-semantic files
    const contentChanges = changedFiles.filter(f => {
      if (prefix && !f.startsWith(prefix)) return false;
      if (f.startsWith(pluginMetaPrefix)) return false;
      if (STALENESS_IGNORE.has(path.basename(f))) return false;
      // For root plugin, exclude files belonging to sub-plugin directories
      if (prefix === '') {
        for (const [otherDir] of pluginDirs) {
          if (otherDir !== '.' && f.startsWith(otherDir + '/')) return false;
        }
      }
      return true;
    });

    if (contentChanges.length === 0) continue;

    // Check if plugin.json has a version bump
    let versionBumped = false;

    // New untracked plugin.json counts as version set
    if (changedFiles.includes(pluginJsonRel)) {
      try {
        const diffResult = execFileSync('git', ['diff', 'HEAD', '--', pluginJsonRel], { cwd: projectRoot, encoding: 'utf8' });
        if (/^\+\s*"version":/m.test(diffResult)) {
          versionBumped = true;
        }
      } catch {
        // If diff fails (e.g., initial commit with no HEAD), check untracked and staged files
        try {
          const untrackedOutput = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { cwd: projectRoot, encoding: 'utf8' }).trim();
          if (untrackedOutput.split('\n').includes(pluginJsonRel)) {
            versionBumped = true; // New plugin — initial version is set
          }
          // Also check staged changes (file may be git-added but no HEAD exists yet)
          if (!versionBumped) {
            const stagedDiff = execFileSync('git', ['diff', '--cached', '--', pluginJsonRel], { cwd: projectRoot, encoding: 'utf8' });
            if (/^\+\s*"version":/m.test(stagedDiff)) {
              versionBumped = true;
            }
          }
        } catch (e) {
          // Git commands failed (e.g., index.lock, permissions) — conservative: assume no bump
          results.warn.push({ check: 'version-staleness', file: pluginJsonRel, message: `Git command failed: ${e.message}` });
          versionBumped = false;
        }
      }
    }

    if (!versionBumped) {
      const pluginName = pluginDir === '.' ? 'root' : pluginDir;
      results.warn.push({
        check: 'version-staleness',
        file: pluginJsonRel,
        message: `Plugin "${pluginName}" has content changes but no version bump in plugin.json (${contentChanges.length} file(s) changed)`
      });
      stalenessWarns++;
    }
  }

  if (stalenessWarns === 0) {
    results.pass.push({
      check: 'version-staleness',
      file: 'all plugins',
      message: 'Version staleness check completed'
    });
  }
}

// ============================================================
// Check 8: Graph Integrity
// ============================================================
function checkGraphIntegrity() {
  const graphPath = path.join(projectRoot, '.claude', 'skills', 'verify', 'graph.json');

  if (!fs.existsSync(graphPath)) {
    results.warn.push({
      check: 'graph-integrity',
      file: 'graph.json',
      message: 'graph.json not found, skipping graph integrity check'
    });
    return;
  }

  let graph;
  try {
    graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
  } catch (e) {
    results.fail.push({
      check: 'graph-integrity',
      file: 'graph.json',
      message: `Invalid JSON: ${e.message}`
    });
    return;
  }

  // Structural validation: nodes and edges must be arrays
  if (!Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) {
    results.fail.push({
      check: 'graph-integrity',
      file: 'graph.json',
      message: `graph.json requires "nodes" (array) and "edges" (array), got nodes=${typeof graph.nodes}, edges=${typeof graph.edges}`
    });
    return;
  }

  const { nodes, edges } = graph;
  const nodeSet = new Set(nodes);
  let subCheckFailed = false;

  // Sub-check 1: edge-type
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    if (!edge || typeof edge !== 'object') {
      results.fail.push({
        check: 'graph-integrity',
        file: 'graph.json',
        message: `edges[${i}] is not a valid object: ${JSON.stringify(edge)}`
      });
      subCheckFailed = true;
      continue;
    }
    if (!VALID_EDGE_TYPES.has(edge.type)) {
      results.fail.push({
        check: 'graph-integrity',
        file: 'graph.json',
        message: `Invalid edge type "${edge.type}" on ${edge.source}→${edge.target}. Valid: ${[...VALID_EDGE_TYPES].join(', ')}`
      });
      subCheckFailed = true;
    }
  }

  // Sub-check 2: edge-reference (wildcard "*" exempt from node lookup)
  for (const edge of edges) {
    if (!edge || typeof edge !== 'object') continue; // already reported in sub-check 1
    if (edge.source !== '*' && !nodeSet.has(edge.source)) {
      results.fail.push({
        check: 'graph-integrity',
        file: 'graph.json',
        message: `Edge source "${edge.source}" not in nodes array`
      });
      subCheckFailed = true;
    }
    if (edge.target !== '*' && !nodeSet.has(edge.target)) {
      results.fail.push({
        check: 'graph-integrity',
        file: 'graph.json',
        message: `Edge target "${edge.target}" not in nodes array`
      });
      subCheckFailed = true;
    }
  }

  // Sub-check 3: node-directory
  for (const node of nodes) {
    const dirPath = path.join(projectRoot, node);
    if (!fs.existsSync(dirPath)) {
      results.fail.push({
        check: 'graph-integrity',
        file: 'graph.json',
        message: `Node "${node}" has no corresponding directory at ${node}/`
      });
      subCheckFailed = true;
    }
  }

  // Sub-check 4: orphaned-node — nodes must have a valid SKILL.md (not just a directory)
  for (const node of nodes) {
    const skillPaths = [
      path.join(projectRoot, node, 'skills'),
    ];
    let hasSkill = false;
    for (const sp of skillPaths) {
      if (fs.existsSync(sp)) {
        try {
          const entries = fs.readdirSync(sp, { withFileTypes: true });
          for (const entry of entries) {
            if (entry.isDirectory()) {
              const skillMd = path.join(sp, entry.name, 'SKILL.md');
              if (fs.existsSync(skillMd)) {
                hasSkill = true;
                break;
              }
            }
          }
        } catch (e) {
          // Auxiliary check: filesystem errors mean "could not confirm SKILL.md exists" → hasSkill stays false
        }
      }
      if (hasSkill) break;
    }
    if (!hasSkill) {
      results.warn.push({
        check: 'graph-integrity',
        file: 'graph.json',
        message: `Node "${node}" has a directory but no SKILL.md — may be orphaned`
      });
    }
  }

  // Sub-check 5: isolated-node — every node should participate in at least one edge
  const connectedNodes = new Set();
  for (const edge of edges) {
    if (!edge || typeof edge !== 'object') continue;
    if (edge.source === '*') {
      // Wildcard connects all nodes except target
      for (const n of nodes) {
        if (n !== edge.target) connectedNodes.add(n);
      }
      connectedNodes.add(edge.target);
    } else {
      connectedNodes.add(edge.source);
      connectedNodes.add(edge.target);
    }
  }
  for (const node of nodes) {
    if (!connectedNodes.has(node)) {
      results.warn.push({
        check: 'graph-integrity',
        file: 'graph.json',
        message: `Node "${node}" is isolated — no edges connect to or from it`
      });
    }
  }

  // Sub-check 6: precondition-dag — verify precondition edges form a DAG (no cycles) via Kahn's topological sort
  // Expand "*" wildcard: source "*" means all nodes except target; target "*" is rejected
  const preconditionEdges = [];
  for (const edge of edges) {
    if (!edge || typeof edge !== 'object') continue;
    if (edge.type !== 'precondition') continue;
    if (edge.target === '*') {
      results.fail.push({
        check: 'graph-integrity',
        file: 'graph.json',
        message: `Precondition edge target cannot be "*" (source: "${edge.source}")`
      });
      subCheckFailed = true;
      continue;
    }
    if (edge.source === '*') {
      for (const node of nodes) {
        if (node !== edge.target) {
          preconditionEdges.push({ source: node, target: edge.target });
        }
      }
    } else {
      preconditionEdges.push({ source: edge.source, target: edge.target });
    }
  }

  // Adjacency: source → target (source is precondition for target; in-degree counts preconditions)
  const adj = new Map();
  const inDegree = new Map();
  for (const node of nodes) {
    adj.set(node, []);
    inDegree.set(node, 0);
  }
  for (const { source, target } of preconditionEdges) {
    adj.get(source).push(target);
    inDegree.set(target, inDegree.get(target) + 1);
  }

  // Kahn's algorithm
  const queue = [];
  for (const [node, deg] of inDegree) {
    if (deg === 0) queue.push(node);
  }

  let processed = 0;
  while (queue.length > 0) {
    const node = queue.shift();
    processed++;
    for (const neighbor of adj.get(node)) {
      const newDeg = inDegree.get(neighbor) - 1;
      inDegree.set(neighbor, newDeg);
      if (newDeg === 0) queue.push(neighbor);
    }
  }

  if (processed !== nodes.length) {
    const cycleNodes = [...inDegree.entries()]
      .filter(([, deg]) => deg > 0)
      .map(([node]) => node);
    results.fail.push({
      check: 'graph-integrity',
      file: 'graph.json',
      message: `Precondition edges form a cycle involving: ${cycleNodes.join(', ')}`
    });
    subCheckFailed = true;
  }

  if (!subCheckFailed) {
    results.pass.push({
      check: 'graph-integrity',
      file: 'graph.json',
      message: `Graph integrity verified (${nodes.length} nodes, ${edges.length} edges)`
    });
  }
}

// ============================================================
// Check 9: Spec vs Impl Drift Detection
// ============================================================
function checkSpecVsImpl() {
  // Extract type definitions from all TYPES sections of a formal block
  // Matches: ── TYPES ──, ── ENTRY TYPES ──, ── DELEGATION TYPES ──, etc.
  function extractTypeNames(content) {
    const typeNames = [];
    for (const typesSection of extractAllFormalSections(content, 'TYPES')) {
      const typePattern = /^([A-ZΑ-Ωa-z][A-Za-zΑ-Ωα-ω₀-₉ₐ-ₜ']*)\s+[=∈]/gm;
      let match;
      while ((match = typePattern.exec(typesSection)) !== null) {
        const name = match[1].trim();
        if (name.length >= 2 || /[Α-Ωα-ω]/.test(name)) {
          typeNames.push(name);
        }
      }
    }
    return typeNames;
  }

  // Extract type names from PHASE TRANSITIONS section
  function extractPhaseTypeRefs(content) {
    return extractFormalSection(content, 'PHASE TRANSITIONS');
  }

  for (const relPath of PROTOCOL_FILES) {
    const fullPath = path.join(projectRoot, relPath);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, 'utf8');

    const typeNames = extractTypeNames(content);
    if (typeNames.length === 0) {
      results.warn.push({
        check: 'spec-vs-impl',
        file: relPath,
        message: 'No type definitions found in ── TYPES ── section'
      });
      continue;
    }

    const phaseSection = extractPhaseTypeRefs(content);

    // Extract the formal block (inside ```) and prose sections (outside ```)
    const formalBlockMatch = content.match(/```[\s\S]*?```/);
    const formalBlock = formalBlockMatch ? formalBlockMatch[0] : '';
    const proseContent = content.replace(/```[\s\S]*?```/g, '');

    // Check: Type names defined in TYPES should appear in PHASE TRANSITIONS
    // Only check "important" types (skip pure enum values, comments, etc.)
    // Important = types that represent operations or data flows (appear as function calls or data references)
    const operationTypes = typeNames.filter(name => {
      // Skip common enum-like short names and status types
      if (['Phase', 'Mode', 'Stakes'].includes(name)) return false;
      return true;
    });

    for (const typeName of operationTypes) {
      // Escape special regex chars in type name
      const escaped = typeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // Check if type appears in PHASE TRANSITIONS
      const inPhase = new RegExp(escaped).test(phaseSection);
      // Check if type appears in prose
      const inProse = new RegExp(escaped).test(proseContent);
      // Check if type is cross-referenced elsewhere in formal block
      // (FLOW, LOOP, MODE STATE, other TYPES definitions, etc.)
      // Remove the type's own definition line(s) to avoid self-match
      const defLinePattern = new RegExp(`^${escaped}\\s+[=∈].*$`, 'gm');
      const formalWithoutOwnDef = formalBlock.replace(defLinePattern, '');
      const inFormalCrossRef = new RegExp(escaped).test(formalWithoutOwnDef);

      // A type defined in TYPES but absent from PHASE TRANSITIONS, prose,
      // AND all other formal block sections suggests rename drift or dead type
      if (!inPhase && !inProse && !inFormalCrossRef) {
        results.warn.push({
          check: 'spec-vs-impl',
          file: relPath,
          message: `Type "${typeName}" defined in TYPES but not referenced in PHASE TRANSITIONS, prose, or formal block cross-references — possible rename drift or dead type`
        });
      }
    }

    // Check: Resolution type (terminal type) should appear in the formal block
    // Extract the resolution type from the Type: line at the top
    const typeLineMatch = content.match(/Type:\s*`[^`]*→\s*(\w+)`/);
    if (typeLineMatch) {
      const resolutionType = typeLineMatch[1];
      if (!formalBlock.includes(resolutionType)) {
        results.warn.push({
          check: 'spec-vs-impl',
          file: relPath,
          message: `Resolution type "${resolutionType}" in Type signature but not defined in formal block — possible rename drift`
        });
      }
    }

    results.pass.push({
      check: 'spec-vs-impl',
      file: relPath,
      message: `Spec-vs-impl check completed (${typeNames.length} types analyzed)`
    });
  }
}

// ============================================================
// Check 10: Morphism Anatomy
// ============================================================
function checkMorphismAnatomy() {
  for (const relPath of PROTOCOL_FILES) {
    const fullPath = path.join(projectRoot, relPath);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, 'utf8');
    const dirName = relPath.split('/')[0];
    const protocolEntry = Object.entries(CANONICAL_PROTOCOLS).find(([name]) =>
      name.toLowerCase() === dirName
    );
    if (!protocolEntry) continue;

    const [protocolName, { deficit, resolution }] = protocolEntry;
    let subCheckFailed = false;

    const flowIndex = content.indexOf('── FLOW ──');
    const morphismIndex = content.indexOf('── MORPHISM ──');
    const typesIndex = content.indexOf('── TYPES ──');

    if (flowIndex === -1 || morphismIndex === -1 || typesIndex === -1) {
      results.fail.push({
        check: 'morphism-anatomy',
        file: relPath,
        message: `${protocolName} must define FLOW, MORPHISM, and TYPES sections in its Definition block`
      });
      continue;
    }

    if (!(flowIndex < morphismIndex && morphismIndex < typesIndex)) {
      results.fail.push({
        check: 'morphism-anatomy',
        file: relPath,
        message: `${protocolName} section order must be FLOW → MORPHISM → TYPES`
      });
      subCheckFailed = true;
    }

    const morphismSection = extractFormalSection(content, 'MORPHISM');
    if (!morphismSection) {
      results.fail.push({
        check: 'morphism-anatomy',
        file: relPath,
        message: `${protocolName} MORPHISM section is empty`
      });
      subCheckFailed = true;
      continue;
    }

    const morphismLines = morphismSection
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);
    const firstObject = morphismLines.find(line => !line.startsWith('→') && !/^(requires|deficit|preserves|invariant):/.test(line));

    if (!firstObject) {
      results.fail.push({
        check: 'morphism-anatomy',
        file: relPath,
        message: `${protocolName} MORPHISM must start from a source object`
      });
      subCheckFailed = true;
    } else if (firstObject === deficit) {
      results.fail.push({
        check: 'morphism-anatomy',
        file: relPath,
        message: `${protocolName} MORPHISM must not use deficit "${deficit}" as the source object; deficit belongs in the activation precondition`
      });
      subCheckFailed = true;
    }

    const requiredClauses = ['requires', 'deficit', 'preserves', 'invariant'];
    for (const clause of requiredClauses) {
      if (!new RegExp(`^${clause}:`, 'm').test(morphismSection)) {
        results.fail.push({
          check: 'morphism-anatomy',
          file: relPath,
          message: `${protocolName} MORPHISM missing required clause "${clause}:"`
        });
        subCheckFailed = true;
      }
    }

    if (!new RegExp(`^deficit:\\s+${deficit}\\b`, 'm').test(morphismSection)) {
      results.fail.push({
        check: 'morphism-anatomy',
        file: relPath,
        message: `${protocolName} MORPHISM deficit clause must name canonical deficit "${deficit}"`
      });
      subCheckFailed = true;
    }

    if (!new RegExp(`^\\s*→\\s*${resolution}\\b`, 'm').test(morphismSection)) {
      results.fail.push({
        check: 'morphism-anatomy',
        file: relPath,
        message: `${protocolName} MORPHISM chain must terminate in canonical resolution "${resolution}"`
      });
      subCheckFailed = true;
    }

    const typeLine = content.match(/Type:\s*`([^`]+)`/);
    if (!typeLine || !typeLine[1].includes(deficit) || !typeLine[1].includes(`→ ${resolution}`)) {
      results.fail.push({
        check: 'morphism-anatomy',
        file: relPath,
        message: `${protocolName} Type signature must expose "${deficit} → ${resolution}"`
      });
      subCheckFailed = true;
    }

    if (!subCheckFailed) {
      results.pass.push({
        check: 'morphism-anatomy',
        file: relPath,
        message: `${protocolName} morphism verified: deficit precondition "${deficit}" resolves to "${resolution}"`
      });
    }
  }
}

// ============================================================
// Check 11: Cross-Reference Scan (Protocol Name & Deficit Consistency)
// ============================================================
function checkCrossRefScan() {
  let subCheckFailed = false;

  // CLAUDE.md is a routing index, not a content mirror: its deficit → resolution
  // pairs, cluster table, and initiator taxonomy were replaced by pointers to the
  // authoritative sources (per-protocol SKILL.md, graph.json, /catalog, README), so
  // the scan enforces those sources directly and no longer reads CLAUDE.md content.

  // Sub-check 1: Verify each protocol SKILL.md contains its own correct deficit → resolution pair
  for (const relPath of PROTOCOL_FILES) {
    const fullPath = path.join(projectRoot, relPath);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, 'utf8');

    // Determine which protocol this SKILL.md belongs to
    const dirName = relPath.split('/')[0];
    const protocolEntry = Object.entries(CANONICAL_PROTOCOLS).find(([name]) =>
      name.toLowerCase() === dirName
    );

    if (!protocolEntry) continue;

    const [protocolName, { deficit, resolution }] = protocolEntry;

    // Check that the deficit type appears in the SKILL.md
    if (!content.includes(deficit)) {
      results.fail.push({
        check: 'cross-ref-scan',
        file: relPath,
        message: `Missing deficit type "${deficit}" in ${protocolName} SKILL.md`
      });
      subCheckFailed = true;
    }

    // Check that the resolution type appears in the SKILL.md
    if (!content.includes(resolution)) {
      results.fail.push({
        check: 'cross-ref-scan',
        file: relPath,
        message: `Missing resolution type "${resolution}" in ${protocolName} SKILL.md`
      });
      subCheckFailed = true;
    }
  }

  // Sub-check 2: Verify README workflow canonical-clusters invariant
  for (const relPath of ['README.md', 'README_ko.md']) {
    const fullPath = path.join(projectRoot, relPath);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes(CANONICAL_CLUSTERS)) {
      results.fail.push({
        check: 'cross-ref-scan',
        file: relPath,
        message: `Missing canonical workflow "${CANONICAL_CLUSTERS}"`
      });
      subCheckFailed = true;
    }
  }

  // Sub-check 3: Array completeness — cross-check PROTOCOL_FILES, CANONICAL_PROTOCOLS,
  // package.js PLUGINS, graph.json nodes, and marketplace.json plugins against filesystem ground truth
  {
    // Ground truth: directories containing .claude-plugin/plugin.json
    // Deprecated plugins (plugin.json carries "deprecated": true) are tracked
    // separately so cross-ref checks can exclude them from active-set diffs
    // without a hardcoded allowlist (Plugin Encapsulation: deprecation lives
    // in per-plugin self-description, not in the verifier).
    const allPluginDirs = new Set();
    const deprecatedPluginDirs = new Set();
    try {
      const entries = fs.readdirSync(projectRoot, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
        const pluginJsonPath = path.join(projectRoot, entry.name, '.claude-plugin', 'plugin.json');
        if (fs.existsSync(pluginJsonPath)) {
          allPluginDirs.add(entry.name);
          try {
            const pj = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
            if (pj.deprecated === true) deprecatedPluginDirs.add(entry.name);
          } catch (e) {
            // Surface parse errors as warnings so the real cause (bad JSON)
            // shows up in this check's output instead of cascading into a
            // misleading "missing from PROTOCOL_FILES" downstream warning
            // (PR #351 review M1). The json-schema check independently
            // reports the same error; co-reporting is intentional.
            results.warn.push({
              check: 'cross-ref-scan',
              file: path.relative(projectRoot, pluginJsonPath),
              message: `Could not parse plugin.json for deprecated lookup: ${e.message}`
            });
          }
        }
      }
    } catch (e) {
      // Stage 2 loud mode (upstream scope): this readdir is the ground-truth
      // source for cross-ref-scan Sources 1, 2, 3, and 4. If it fails,
      // allPluginDirs is empty, every downstream source sees an empty
      // filesystem view, every bidirectional diff collapses to zero findings,
      // and the entire cross-ref-scan check would silently pass with no
      // detection. This is the exact silent-failure CLASS Stage 2 closes in
      // Source 3, at an upstream scope that covers all four sources.
      // Escalate to fail + subCheckFailed per fail-closed policy —
      // review-ensemble cross-model agreement (Codex gpt-5.4 high +
      // silent-failure-hunter) flagged this during PR development.
      results.fail.push({
        check: 'cross-ref-scan',
        file: '.',
        message: `Could not scan plugin directories (upstream ground truth): ${e.message}`
      });
      subCheckFailed = true;
    }

    // Protocol-only subset (dirs listed in PROTOCOL_FILES)
    const protocolDirs = new Set(PROTOCOL_FILES.map(f => f.split('/')[0]));

    // Non-protocol plugin dirs (utility plugins not expected in protocol-only arrays)
    const utilityDirs = new Set([...allPluginDirs].filter(d => !protocolDirs.has(d)));

    // Source 1: PROTOCOL_FILES dirs
    for (const dir of allPluginDirs) {
      if (utilityDirs.has(dir)) continue; // utility plugins not expected in PROTOCOL_FILES
      if (deprecatedPluginDirs.has(dir)) continue; // deprecated plugins exit active enumeration
      if (!protocolDirs.has(dir)) {
        results.warn.push({
          check: 'cross-ref-scan',
          file: 'static-checks.js',
          message: `Protocol directory "${dir}" exists on filesystem but missing from PROTOCOL_FILES array`
        });
      }
    }

    // Source 2: CANONICAL_PROTOCOLS keys (title-cased protocol names)
    const canonicalDirs = new Set(
      Object.keys(CANONICAL_PROTOCOLS).map(name => name.toLowerCase())
    );
    for (const dir of allPluginDirs) {
      if (utilityDirs.has(dir)) continue;
      if (deprecatedPluginDirs.has(dir)) continue;
      if (!canonicalDirs.has(dir)) {
        results.warn.push({
          check: 'cross-ref-scan',
          file: 'static-checks.js',
          message: `Protocol directory "${dir}" exists on filesystem but missing from CANONICAL_PROTOCOLS`
        });
      }
    }

    // Source 3: package.js PLUGINS at (dir, skill) tuple granularity.
    // Publication-surface invariant: the set of (dir, skill) SKILL.md files on disk
    // must match PLUGINS exactly. This sub-check deliberately does NOT apply the
    // utilityDirs skip — utility plugin SKILL.md files must also be published.
    // Sources 1, 2, 4 remain protocol-only (utility-skip preserved) — that's the
    // core C7 separation between graph.json (10 protocols) and publication surface.
    //
    // IMPORTANT: path.resolve (not path.join) is load-bearing here. When invoked
    // as `node .claude/skills/verify/scripts/static-checks.js .`, projectRoot is
    // the relative string ".". path.join(".", "scripts", "package.js") yields
    // "scripts/package.js", which require() treats as a MODULE IDENTIFIER (not a
    // file path) and resolves against node_modules → Cannot find module. The
    // catch then silently swallows and the entire sub-check no-ops. path.resolve
    // forces cwd-absolute, which require() accepts as a file path. Surrounding
    // path.join calls (graphPath2, skillMdPath) feed fs.existsSync/fs.readdirSync
    // which DO accept cwd-relative paths; require() has stricter semantics. Do
    // NOT "normalize" to path.join for stylistic consistency.
    //
    // Meta-dependency note: this require() creates a structural coupling
    // static-checks.js → scripts/package.js. package.js's top-level code runs
    // inside the verifier process on require. The existing `require.main ===
    // module` guard in package.js keeps main() from firing, but any new
    // top-level side effect (console.log, fs write, network call) would leak
    // into verify output. package.js contributors must keep all effects behind
    // function boundaries or the main-module guard.
    const packageJsPath = path.resolve(projectRoot, 'scripts', 'package.js');
    if (!fs.existsSync(packageJsPath)) {
      // Loud failure: package.js is a required input for the publication-surface
      // check. Missing file is a detector-infrastructure problem, not a migration
      // signal — escalate to subCheckFailed per Stage 2 loud-mode policy.
      results.fail.push({
        check: 'cross-ref-scan',
        file: 'scripts/package.js',
        message: 'Required file not found — cross-ref-scan Source 3 cannot verify publication surface'
      });
      subCheckFailed = true;
    } else {
      let PLUGINS = null;
      let loadFailed = false;
      try {
        // Invalidate require cache so repeated static-check runs pick up edits.
        delete require.cache[require.resolve(packageJsPath)];
        ({ PLUGINS } = require(packageJsPath));
      } catch (e) {
        // Stage 2 loud mode: require() failure is a detector-infrastructure
        // failure (the detector itself cannot run), not a migration signal.
        // Escalate to subCheckFailed so the bug class that caused the PR #242
        // critical path.resolve incident cannot recur as a silent no-op.
        results.fail.push({
          check: 'cross-ref-scan',
          file: 'scripts/package.js',
          message: `Could not load package.js PLUGINS: ${e.message}`
        });
        subCheckFailed = true;
        loadFailed = true;
      }

      if (!loadFailed && !Array.isArray(PLUGINS)) {
        // Stage 2 loud mode: require() succeeded but the PLUGINS export is
        // absent or has a non-Array shape (e.g., hand-edit breakage, typo in
        // module.exports). Treat as detector-infrastructure failure — without a
        // valid PLUGINS array we cannot diff against the filesystem.
        // Shape description handles null specially — `typeof null === 'object'`
        // would produce the misleading "got object" for a null export.
        const shapeDesc =
          PLUGINS === undefined ? 'undefined'
            : PLUGINS === null ? 'null'
            : typeof PLUGINS;
        results.fail.push({
          check: 'cross-ref-scan',
          file: 'scripts/package.js',
          message: `PLUGINS export shape invalid — expected Array, got ${shapeDesc}`
        });
        subCheckFailed = true;
      } else if (!loadFailed && Array.isArray(PLUGINS)) {
        // Structural guard: every tuple must have { dir: string, skill: string }.
        // Loud-mode escalation per Stage 2 — bad shape blocks CI rather than
        // producing phantom downstream warnings.
        //
        // Note: PLUGINS is now derived from scripts/load-protocols.js
        // discoverPlugins() (filesystem walk). The prior bidirectional diff
        // (publication-gap, stale-plugins-entry) compared PLUGINS against a
        // separate filesystem walk — under the helper-derived model both
        // sides share the same walk, making the diff tautological. Drift
        // detection moves to graph.json nodes (Source 4) and marketplace.json
        // plugins (Source 5), which remain hand-curated relative to filesystem.
        for (const p of PLUGINS) {
          if (!p || typeof p.dir !== 'string' || typeof p.skill !== 'string') {
            const serialized = util.inspect(p, { depth: 2, breakLength: 80 });
            results.fail.push({
              check: 'cross-ref-scan',
              file: 'scripts/package.js',
              message: `malformed-plugins-entry: expected { dir: string, skill: string } tuple, got ${serialized}`
            });
            subCheckFailed = true;
          }
        }
      }
    }

    // Source 4: graph.json nodes (protocol-only)
    const graphPath2 = path.join(projectRoot, '.claude', 'skills', 'verify', 'graph.json');
    if (fs.existsSync(graphPath2)) {
      try {
        const graph2 = JSON.parse(fs.readFileSync(graphPath2, 'utf8'));
        if (Array.isArray(graph2.nodes)) {
          const graphNodeSet = new Set(graph2.nodes);
          // Every protocol dir should appear in graph.json nodes
          for (const dir of allPluginDirs) {
            if (utilityDirs.has(dir)) continue;
            if (deprecatedPluginDirs.has(dir)) continue;
            if (!graphNodeSet.has(dir)) {
              results.warn.push({
                check: 'cross-ref-scan',
                file: 'graph.json',
                message: `Protocol directory "${dir}" exists on filesystem but missing from graph.json nodes`
              });
            }
          }
          // Every graph.json node should have a corresponding directory
          for (const node of graph2.nodes) {
            if (!allPluginDirs.has(node)) {
              results.warn.push({
                check: 'cross-ref-scan',
                file: 'graph.json',
                message: `graph.json node "${node}" has no corresponding plugin directory on filesystem`
              });
            }
          }
        }
      } catch (e) {
        // JSON parse errors already reported by checkGraphIntegrity
      }
    }

    // Source 5: marketplace.json plugins
    const marketplacePath = path.join(projectRoot, '.claude-plugin', 'marketplace.json');
    if (fs.existsSync(marketplacePath)) {
      try {
        const marketplace = JSON.parse(fs.readFileSync(marketplacePath, 'utf8'));
        if (Array.isArray(marketplace.plugins)) {
          const marketplaceDirs = new Set(
            marketplace.plugins.map(p => {
              // source is like "./prothesis" — extract dir name
              const src = p.source || '';
              return src.replace(/^\.\//, '');
            }).filter(Boolean)
          );
          // Every filesystem plugin dir should appear in marketplace.json
          for (const dir of allPluginDirs) {
            if (deprecatedPluginDirs.has(dir)) continue;
            if (!marketplaceDirs.has(dir)) {
              results.warn.push({
                check: 'cross-ref-scan',
                file: '.claude-plugin/marketplace.json',
                message: `Plugin directory "${dir}" exists on filesystem but missing from marketplace.json plugins`
              });
            }
          }
          // Every marketplace.json plugin should have a corresponding directory
          for (const dir of marketplaceDirs) {
            if (!allPluginDirs.has(dir)) {
              results.warn.push({
                check: 'cross-ref-scan',
                file: '.claude-plugin/marketplace.json',
                message: `marketplace.json plugin "${dir}" has no corresponding plugin directory on filesystem`
              });
            }
          }
        }
      } catch (e) {
        results.warn.push({
          check: 'cross-ref-scan',
          file: '.claude-plugin/marketplace.json',
          message: `Could not parse marketplace.json: ${e.message}`
        });
      }
    }
  }

  // Sub-check 4: Verify edge types in graph.json match the valid edge-type allowlist
  const graphPath = path.join(projectRoot, '.claude', 'skills', 'verify', 'graph.json');
  if (fs.existsSync(graphPath)) {
    try {
      const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
      if (Array.isArray(graph.edges)) {
        const usedEdgeTypes = new Set(graph.edges.map(e => e.type).filter(Boolean));
        for (const edgeType of usedEdgeTypes) {
          if (!VALID_EDGE_TYPES.has(edgeType)) {
            results.fail.push({
              check: 'cross-ref-scan',
              file: 'graph.json',
              message: `Edge type "${edgeType}" not in valid edge-type allowlist: ${[...VALID_EDGE_TYPES].join(', ')}`
            });
            subCheckFailed = true;
          }
        }
      }
    } catch (e) {
      // Ordering dependency: checkGraphIntegrity runs first and reports JSON parse errors
    }
  }

  if (!subCheckFailed) {
    results.pass.push({
      check: 'cross-ref-scan',
      file: 'all protocols',
      message: 'Cross-reference scan completed — protocol names and deficit pairs consistent'
    });
  }
}

// ============================================================
// Check 11: Onboard Sync (Protocol coverage in onboard materials)
// ============================================================
function checkOnboardSync() {
  const onboardSkillPath = path.join(projectRoot, 'epistemic-cooperative/skills/onboard/SKILL.md');
  if (!fs.existsSync(onboardSkillPath)) {
    results.warn.push({
      check: 'onboard-sync',
      file: 'epistemic-cooperative/skills/onboard/SKILL.md',
      message: 'Onboard SKILL.md not found, skipping onboard sync check'
    });
    return;
  }

  const onboardContent = fs.readFileSync(onboardSkillPath, 'utf8');
  let subCheckFailed = false;

  // Build protocol metadata from PROTOCOL_FILES
  // e.g., 'prothesis/skills/frame/SKILL.md' → { name: 'Prothesis', command: 'frame' }
  const protocols = PROTOCOL_FILES.map(relPath => {
    const parts = relPath.split('/');
    return {
      name: parts[0].charAt(0).toUpperCase() + parts[0].slice(1),
      command: parts[2]
    };
  });

  // Sub-check 1: Data Sources table — every protocol must have a row
  for (const { name, command } of protocols) {
    const pattern = `${name} \`/${command}\``;
    if (!onboardContent.includes(pattern)) {
      results.fail.push({
        check: 'onboard-sync',
        file: 'epistemic-cooperative/skills/onboard/SKILL.md',
        message: `Data Sources table missing protocol row: ${pattern}`
      });
      subCheckFailed = true;
    }
  }

  // Sub-check 2: Phase 0 category groupings cover all slash commands
  // (assumes Pre-execution/Analysis/Execution on consecutive lines)
  const categoryLines = onboardContent.match(/Pre-execution[^\n]*\n[^\n]*Analysis[^\n]*\n[^\n]*Execution[^\n]*/);
  if (categoryLines) {
    const categoryText = categoryLines[0];
    for (const { command } of protocols) {
      if (!categoryText.includes(`/${command}`)) {
        results.warn.push({
          check: 'onboard-sync',
          file: 'epistemic-cooperative/skills/onboard/SKILL.md',
          message: `Phase 0 category groupings missing "/${command}"`
        });
      }
    }
  } else {
    results.warn.push({
      check: 'onboard-sync',
      file: 'epistemic-cooperative/skills/onboard/SKILL.md',
      message: 'Phase 0 category groupings pattern not found — structure may have changed'
    });
  }

  // Sub-check 3: scenarios.md — every protocol must have a scenario block
  const scenariosPath = path.join(projectRoot, 'epistemic-cooperative/skills/onboard/references/scenarios.md');
  if (fs.existsSync(scenariosPath)) {
    const scenariosContent = fs.readFileSync(scenariosPath, 'utf8');
    for (const { name, command } of protocols) {
      const heading = `## ${name} \`/${command}\``;
      if (!scenariosContent.includes(heading)) {
        results.fail.push({
          check: 'onboard-sync',
          file: 'epistemic-cooperative/skills/onboard/references/scenarios.md',
          message: `Missing scenario block: ${heading}`
        });
        subCheckFailed = true;
      }
    }
  } else {
    results.warn.push({
      check: 'onboard-sync',
      file: 'epistemic-cooperative/skills/onboard/references/scenarios.md',
      message: 'scenarios.md not found'
    });
  }

  // Sub-check 4: workflow.md — all slash commands present
  const workflowPath = path.join(projectRoot, 'epistemic-cooperative/skills/onboard/references/workflow.md');
  if (fs.existsSync(workflowPath)) {
    const workflowContent = fs.readFileSync(workflowPath, 'utf8');
    for (const { command } of protocols) {
      if (!workflowContent.includes(`/${command}`)) {
        results.fail.push({
          check: 'onboard-sync',
          file: 'epistemic-cooperative/skills/onboard/references/workflow.md',
          message: `Missing "/${command}" in workflow reference (references/workflow.md)`
        });
        subCheckFailed = true;
      }
    }
  } else {
    results.warn.push({
      check: 'onboard-sync',
      file: 'epistemic-cooperative/skills/onboard/references/workflow.md',
      message: 'workflow.md not found'
    });
  }

  if (!subCheckFailed) {
    results.pass.push({
      check: 'onboard-sync',
      file: 'epistemic-cooperative/',
      message: `Onboard sync — Data Sources, scenarios, and workflow verified for ${protocols.length} protocols`
    });
  }
}

// ============================================================
// Check 12: precedence-linear-extension
// Verify CANONICAL_PRECEDENCE total order is a valid linear extension
// of graph.json precondition partial order
// ============================================================
function checkPrecedenceLinearExtension() {
  const checkName = 'precedence-linear-extension';

  // Parse CANONICAL_PRECEDENCE → ordered array (lowercase)
  const precedenceOrder = CANONICAL_PRECEDENCE
    .split('→')
    .map(s => s.trim().toLowerCase());

  // Build index map for O(1) position lookup
  const positionOf = new Map();
  precedenceOrder.forEach((name, idx) => positionOf.set(name, idx));

  // Load graph.json
  const graphPath = path.join(projectRoot, '.claude', 'skills', 'verify', 'graph.json');
  if (!fs.existsSync(graphPath)) {
    results.warn.push({
      check: checkName,
      file: 'graph.json',
      message: 'graph.json not found, skipping linear extension check'
    });
    return;
  }

  let graph;
  try {
    graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
  } catch (e) {
    results.fail.push({
      check: checkName,
      file: 'graph.json',
      message: `Invalid JSON: ${e.message}`
    });
    return;
  }

  const { nodes, edges } = graph;
  if (!Array.isArray(nodes) || !Array.isArray(edges)) {
    results.fail.push({
      check: checkName,
      file: 'graph.json',
      message: 'graph.json requires "nodes" and "edges" arrays'
    });
    return;
  }

  // Expand precondition edges (mirrors checkGraphIntegrity wildcard logic)
  const preconditionEdges = [];
  for (const edge of edges) {
    if (!edge || typeof edge !== 'object') continue;
    if (edge.type !== 'precondition') continue;
    if (edge.target === '*') continue; // invalid — checkGraphIntegrity catches this
    if (edge.source === '*') {
      for (const node of nodes) {
        if (node !== edge.target) {
          preconditionEdges.push({ source: node, target: edge.target });
        }
      }
    } else {
      preconditionEdges.push({ source: edge.source, target: edge.target });
    }
  }

  let violated = false;
  let verifiedCount = 0;

  for (const { source, target } of preconditionEdges) {
    const srcPos = positionOf.get(source);
    const tgtPos = positionOf.get(target);

    // katalepsis is not in CANONICAL_PRECEDENCE (structurally last)
    // Edges involving katalepsis: verify * → katalepsis exists (all-last guarantee)
    if (target === 'katalepsis') {
      // katalepsis as target is valid — it's structurally constrained to be last
      verifiedCount++;
      continue;
    }
    if (source === 'katalepsis') {
      // katalepsis should not be a precondition source for non-katalepsis targets
      results.fail.push({
        check: checkName,
        file: 'graph.json',
        message: `katalepsis is precondition source for ${target} — violates structural last constraint`
      });
      violated = true;
      continue;
    }

    if (srcPos === undefined) {
      results.fail.push({
        check: checkName,
        file: 'graph.json',
        message: `Precondition source "${source}" not found in CANONICAL_PRECEDENCE`
      });
      violated = true;
      continue;
    }
    if (tgtPos === undefined) {
      results.fail.push({
        check: checkName,
        file: 'graph.json',
        message: `Precondition target "${target}" not found in CANONICAL_PRECEDENCE`
      });
      violated = true;
      continue;
    }

    if (srcPos >= tgtPos) {
      results.fail.push({
        check: checkName,
        file: 'graph.json',
        message: `Precondition edge ${source}→${target} violates CANONICAL_PRECEDENCE order (position ${srcPos} >= ${tgtPos})`
      });
      violated = true;
    } else {
      verifiedCount++;
    }
  }

  if (!violated) {
    results.pass.push({
      check: checkName,
      file: 'graph.json',
      message: `CANONICAL_PRECEDENCE is a valid linear extension of precondition partial order (${verifiedCount} edges verified)`
    });
  }
}

// ============================================================
// Check 13: partition-invariant
// Verify MODE STATE pairwise disjoint partition invariants —
// universe set and partition members exist as MODE STATE fields
// ============================================================
function checkPartitionInvariant() {
  const checkName = 'partition-invariant';
  const invariantPattern = /-- Invariant:\s*(\w+)\s*=\s*(.+?)\s*\(pairwise disjoint\)/;

  for (const relPath of PROTOCOL_FILES) {
    const filePath = path.join(projectRoot, relPath);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf8');
    const protocolName = relPath.split('/')[0];

    // Extract MODE STATE section (from marker to closing ```)
    const modeStateMatch = content.match(/── MODE STATE ──([\s\S]*?)```/);
    if (!modeStateMatch) continue;

    const modeStateSection = modeStateMatch[1];

    // Find invariant line (single-line only; multi-line invariants require regex update)
    const invMatch = modeStateSection.match(invariantPattern);
    if (!invMatch) {
      if (/-- Invariant:/.test(modeStateSection)) {
        results.warn.push({
          check: checkName,
          file: relPath,
          message: `${protocolName}: MODE STATE contains "-- Invariant:" but failed to parse — may be multi-line or non-standard format`
        });
      }
      continue;
    }

    const universeSet = invMatch[1];
    const rhsRaw = invMatch[2];
    const partitionMembers = rhsRaw.split('∪').map(s => s.trim());

    // Extract MODE STATE field names from Λ = { ... }
    const lambdaMatch = modeStateSection.match(/Λ\s*=\s*\{([^}]+)\}/);
    if (!lambdaMatch) {
      results.fail.push({
        check: checkName,
        file: relPath,
        message: `${protocolName}: MODE STATE has invariant but no Λ definition found`
      });
      continue;
    }

    const lambdaBody = lambdaMatch[1];
    // Extract field names: "fieldName:" pattern, handling multi-line with comments
    const fieldNames = new Set();
    const fieldPattern = /(\w+)\s*:/g;
    let fm;
    while ((fm = fieldPattern.exec(lambdaBody)) !== null) {
      fieldNames.add(fm[1]);
    }

    let subCheckFailed = false;

    // Verify universe set exists in MODE STATE fields
    if (!fieldNames.has(universeSet)) {
      results.fail.push({
        check: checkName,
        file: relPath,
        message: `${protocolName}: universe set "${universeSet}" not found in MODE STATE fields`
      });
      subCheckFailed = true;
    }

    // Verify each partition member exists in MODE STATE fields
    const missingMembers = partitionMembers.filter(m => !fieldNames.has(m));
    for (const member of missingMembers) {
      results.warn.push({
        check: checkName,
        file: relPath,
        message: `${protocolName}: partition member "${member}" not found in MODE STATE fields (may be implicit/derived)`
      });
    }

    if (!subCheckFailed) {
      if (missingMembers.length === 0) {
        results.pass.push({
          check: checkName,
          file: relPath,
          message: `${protocolName}: partition invariant verified — ${universeSet} = ${partitionMembers.join(' ∪ ')} (${partitionMembers.length}-way partition)`
        });
      } else {
        results.pass.push({
          check: checkName,
          file: relPath,
          message: `${protocolName}: partition invariant structurally valid — ${universeSet} = ${partitionMembers.join(' ∪ ')} (${partitionMembers.length}-way partition, ${missingMembers.length} implicit member(s): ${missingMembers.join(', ')})`
        });
      }
    }
  }
}

// ============================================================
// Check 14: Catalog Sync (Protocol coverage in catalog SKILL.md)
// ============================================================
function checkCatalogSync() {
  const catalogSkillPath = path.join(projectRoot, 'epistemic-cooperative/skills/catalog/SKILL.md');
  if (!fs.existsSync(catalogSkillPath)) {
    results.warn.push({
      check: 'catalog-sync',
      file: 'epistemic-cooperative/skills/catalog/SKILL.md',
      message: 'Catalog SKILL.md not found, skipping catalog sync check'
    });
    return;
  }

  const catalogContent = fs.readFileSync(catalogSkillPath, 'utf8');

  // Build protocol metadata from PROTOCOL_FILES
  const protocols = PROTOCOL_FILES.map(relPath => {
    const parts = relPath.split('/');
    return {
      name: parts[0].charAt(0).toUpperCase() + parts[0].slice(1),
      command: parts[2]
    };
  });

  // Sub-check 1: every /{command} present in catalog SKILL.md
  for (const { command } of protocols) {
    if (!catalogContent.includes(`/${command}`)) {
      results.fail.push({
        check: 'catalog-sync',
        file: 'epistemic-cooperative/skills/catalog/SKILL.md',
        message: `Missing protocol command: /${command}`
      });
    }
  }

  // Sub-check 2: every protocol name present in catalog SKILL.md
  for (const { name } of protocols) {
    if (!catalogContent.includes(name)) {
      results.fail.push({
        check: 'catalog-sync',
        file: 'epistemic-cooperative/skills/catalog/SKILL.md',
        message: `Missing protocol name: ${name}`
      });
    }
  }

  // Sub-check 3: command count matches PROTOCOL_FILES.length
  const commandMatches = catalogContent.match(/`\/[a-z]+`/g) || [];
  const uniqueCommands = new Set(commandMatches.map(m => m.replace(/`/g, '')));
  const expectedCount = protocols.length;
  if (uniqueCommands.size < expectedCount) {
    results.warn.push({
      check: 'catalog-sync',
      file: 'epistemic-cooperative/skills/catalog/SKILL.md',
      message: `Command count (${uniqueCommands.size}) less than protocol count (${expectedCount})`
    });
  }

  results.pass.push({
    check: 'catalog-sync',
    file: 'epistemic-cooperative/skills/catalog/SKILL.md',
    message: 'Catalog sync check completed'
  });
}

// ============================================================
// Check: Routing Map Sync (agent-facing SessionStart directive)
// ============================================================
// routing-map.md is generated 100% from canonical sources (the catalog
// When-to-Use triggers + load-protocols deficit → resolution spine). A stale
// committed map would inject a wrong routing directive at SessionStart, so this
// check re-generates in-memory and fails on any divergence — the same drift
// posture as cross-ref-scan/catalog-sync, using the shared {check, file,
// message} result shape. The generator FAILS LOUDLY (throws) when a protocol
// has no catalog row; that throw is surfaced here as a fail rather than
// crashing the verifier.
function checkRoutingMapSync() {
  const check = 'routing-map-sync';
  let result;
  try {
    result = checkRoutingMap({ projectRoot });
  } catch (e) {
    results.fail.push({
      check,
      file: ROUTING_MAP_REL,
      message: `Routing map generation failed (protocol/catalog drift or source error): ${e.message}`
    });
    return;
  }
  if (!result.inSync) {
    results.fail.push({
      check,
      file: ROUTING_MAP_REL,
      message: `${result.reason} — regenerate with: node scripts/generate-routing-map.js`
    });
    return;
  }
  results.pass.push({
    check,
    file: ROUTING_MAP_REL,
    message: 'Routing map is in sync with canonical sources (catalog triggers + load-protocols spine)'
  });
}

// Stem matching: handles Dismiss/Dismisses, Address/Addresses, UserSupplies/User-supplies
function stemMatch(a, b) {
  // Normalize: remove hyphens, case-insensitive
  const normA = a.replace(/-/g, '');
  const normB = b.replace(/-/g, '');
  if (normA === normB) return true;
  // Prefix match requires short side >= 70% of long side length
  const minRatio = 0.7;
  if (normA.startsWith(normB) && normB.length >= normA.length * minRatio) return true;
  if (normB.startsWith(normA) && normA.length >= normB.length * minRatio) return true;
  // Handle verb inflection: X/Xes, X/Xed
  const stemA = normA.replace(/(es|ed|s)$/, '');
  const stemB = normB.replace(/(es|ed|s)$/, '');
  if (stemA === stemB) return true;
  if (stemA.startsWith(stemB) && stemB.length >= stemA.length * minRatio) return true;
  if (stemB.startsWith(stemA) && stemA.length >= stemB.length * minRatio) return true;
  return false;
}

// ============================================================
// Check 15: Gate Type Soundness (Safeguard — warning only)
// Verifies TYPES answer coproducts match Phase prose option enumerations.
// Type-preserving materialization is permitted; gate mutation is flagged.
// ============================================================
function checkGateTypeSoundness() {
  for (const file of PROTOCOL_FILES) {
    const fullPath = path.join(projectRoot, file);
    let content;
    try {
      content = fs.readFileSync(fullPath, 'utf-8');
    } catch { continue; }

    // 1. Extract TYPES section from Definition code block
    const typesSection = extractFormalSection(content, 'TYPES');
    if (!typesSection) continue;

    // 2. Parse coproducts: lines with ∈ {X, Y, Z} pattern
    const coproducts = [];
    const coprodRegex = /^(\w+)\s.*?∈\s*\{([^}]+)\}/gm;
    let m;
    while ((m = coprodRegex.exec(typesSection)) !== null) {
      const typeName = m[1];
      const constructors = m[2].split(',').map(c => {
        const trimmed = c.trim();
        const name = trimmed.replace(/\([^)]*\)/g, '').trim();
        return { raw: trimmed, name };
      }).filter(c => c.name.length > 0);
      if (constructors.length >= 2) {
        coproducts.push({ typeName, constructors });
      }
    }

    // 3. Extract Options blocks from prose (outside Definition code block)
    const proseStart = content.indexOf('## Core Principle');
    if (proseStart === -1) {
      results.warn.push({
        check: 'gate-type-soundness',
        file,
        message: 'No "## Core Principle" header found — gate prose extraction skipped'
      });
      continue;
    }
    const prose = content.substring(proseStart);

    const optionsBlocks = [];
    // Match Options: followed by numbered bold items until block end
    const optBlockRegex = /Options:\n((?:\s*\d+\.\s+\*\*[^\n]+\n?)+)/g;
    while ((m = optBlockRegex.exec(prose)) !== null) {
      const block = m[1];
      const labels = [];
      const labelRegex = /^\s*\d+\.\s+\*\*\[?([^\]*\n]+?)\]?\*\*/gm;
      let lm;
      while ((lm = labelRegex.exec(block)) !== null) {
        const raw = lm[1].trim();
        // Extract first word as canonical label; skip pure template placeholders
        const firstWord = raw.split(/[\s,—]/)[0];
        if (firstWord && (!/^[A-Z][a-z]+\s/.test(raw) || /^[A-Z][a-z]+$/.test(firstWord))) {
          labels.push(firstWord);
        }
      }
      if (labels.length >= 2) {
        optionsBlocks.push(labels);
      }
    }

    // 4. Match coproducts to Options blocks and compare
    let analysed = 0;
    for (const cp of coproducts) {
      const cNames = cp.constructors.map(c => c.name.toLowerCase());

      // Find best matching Options block by stem overlap
      let bestBlock = null;
      let bestScore = 0;
      for (const labels of optionsBlocks) {
        const lLower = labels.map(l => l.toLowerCase());
        const score = cNames.filter(cn =>
          lLower.some(ln => stemMatch(cn, ln))
        ).length;
        if (score > bestScore) {
          bestScore = score;
          bestBlock = labels;
        }
      }

      // Require ≥40% constructor match to consider it a paired block
      if (!bestBlock || bestScore < Math.max(2, Math.ceil(cNames.length * 0.4))) continue;
      analysed++;

      const lLower = bestBlock.map(l => l.toLowerCase());

      // Check for constructors missing from prose options (potential deletion)
      const missing = cp.constructors.filter(c =>
        !lLower.some(ln => stemMatch(c.name.toLowerCase(), ln)) &&
        !new RegExp(escapeRegex(c.raw)).test(prose)
      );

      // Check for prose options missing from constructors (potential injection)
      const extra = bestBlock.filter(l =>
        !cNames.some(cn => stemMatch(cn, l.toLowerCase()))
      );

      if (missing.length > 0 || extra.length > 0) {
        const parts = [];
        if (missing.length > 0) parts.push(`TYPES constructors not in prose: ${missing.map(c => c.raw).join(', ')}`);
        if (extra.length > 0) parts.push(`prose options not in TYPES: ${extra.join(', ')}`);
        results.warn.push({
          check: 'gate-type-soundness',
          file,
          message: `${cp.typeName} ∈ {${cp.constructors.map(c => c.raw).join(', ')}} — ${parts.join('; ')}. Verify: type-preserving materialization or gate mutation?`
        });
      }
    }

    results.pass.push({
      check: 'gate-type-soundness',
      file,
      message: `Gate type soundness check completed (${coproducts.length} coproducts, ${analysed} matched to prose)`
    });
  }
}

function checkArtifactSelfContainment() {
  const artifactResults = runArtifactSelfContainmentCheck();
  results.pass.push(...artifactResults.pass);
  results.fail.push(...artifactResults.fail);
  results.warn.push(...artifactResults.warn);
}

function checkLanguagePurity() {
  const purityResults = runLanguagePurityCheck({ projectRoot });
  results.pass.push(...purityResults.pass);
  results.fail.push(...purityResults.fail);
  results.warn.push(...purityResults.warn);
}

// ============================================================
// Check 18: Emit Load Discipline
// ============================================================
// Enforces compiled-copy coverage for the user-facing cognitive-load
// disciplines that shape runtime protocol output. Context-Question Separation
// handles placement, Plain emit discipline handles vocabulary, and
// Round-local salience bundling handles per-round adjacency and context-switch
// cost. These must live in each core protocol SKILL.md because packaged
// runtime contracts cannot depend on contributor docs or Output Style alone.
function checkEmitLoadDiscipline() {
  const REQUIRED_RULES = [
    { label: 'Context-Question Separation', pattern: /\*\*Context-Question Separation\*\*/ },
    { label: 'Plain emit discipline', pattern: /\*\*Plain emit discipline\*\*/ },
    { label: 'Round-local salience bundling', pattern: /\*\*Round-local salience bundling\*\*/ },
  ];

  let checked = 0;
  for (const relPath of PROTOCOL_FILES) {
    const fullPath = path.join(projectRoot, relPath);
    if (!fs.existsSync(fullPath)) {
      results.warn.push({
        check: 'emit-load-discipline',
        file: relPath,
        message: `Protocol file not found: ${relPath}`
      });
      continue;
    }

    checked++;
    const content = fs.readFileSync(fullPath, 'utf8');
    for (const rule of REQUIRED_RULES) {
      if (!rule.pattern.test(content)) {
        results.fail.push({
          check: 'emit-load-discipline',
          file: relPath,
          message: `Missing user-facing emit load rule: ${rule.label}`,
        });
      }
    }
  }

  const stylePath = path.join(projectRoot, 'epistemic-cooperative/styles/epistemic-ink.md');
  if (!fs.existsSync(stylePath)) {
    results.fail.push({
      check: 'emit-load-discipline',
      file: 'epistemic-cooperative/styles/epistemic-ink.md',
      message: 'Missing Output Style source for runtime emit load discipline',
    });
    return;
  }

  const styleContent = fs.readFileSync(stylePath, 'utf8');
  for (const label of ['Vocabulary rendering', 'Round-local salience bundling', 'Drift tracking']) {
    if (!styleContent.includes(`**${label}**`)) {
      results.fail.push({
        check: 'emit-load-discipline',
        file: 'epistemic-cooperative/styles/epistemic-ink.md',
        message: `Missing Output Style section: ${label}`,
      });
    }
  }

  if (!results.fail.some(f => f.check === 'emit-load-discipline')) {
    results.pass.push({
      check: 'emit-load-discipline',
      file: 'all core protocol SKILL.md files',
      message: `Emit load discipline compiled-copy coverage verified for ${checked} protocols`,
    });
  }
}

// ============================================================
// Check: Framing-Readout Enforcement (progress-glyph ban)
// ============================================================
// Couples the Epistemic Ink invariant (user-facing protocol surfacing is a
// framing readout, never a scalar progress meter) to an enforcement channel:
//   (a) the unicode progress-bar glyphs ▓/░ must not appear in any core
//       protocol SKILL.md or the Output Style — they only ever rendered a
//       completion bar;
//   (b) the Output Style must retain the categorical-ban guard sentence so the
//       invariant cannot be silently deleted.
// Scope mirrors checkEmitLoadDiscipline (core protocols + Output Style). Utility
// skills (e.g. /dashboard) may legitimately render bars and are out of scope.
function checkFramingReadoutEnforcement() {
  const BAR_GLYPH = /[▓░]/;
  const CHECK = 'framing-readout-enforcement';
  let checked = 0;

  for (const relPath of PROTOCOL_FILES) {
    const fullPath = path.join(projectRoot, relPath);
    if (!fs.existsSync(fullPath)) {
      results.warn.push({ check: CHECK, file: relPath, message: `Protocol file not found: ${relPath}` });
      continue;
    }
    checked++;
    const content = fs.readFileSync(fullPath, 'utf8');
    content.split('\n').forEach((line, idx) => {
      if (BAR_GLYPH.test(line)) {
        results.fail.push({
          check: CHECK,
          file: relPath,
          message: `Progress-bar glyph (▓/░) at line ${idx + 1} — protocol surfacing is a framing readout, not a progress meter`,
        });
      }
    });
  }

  const stylePath = 'epistemic-cooperative/styles/epistemic-ink.md';
  const styleFull = path.join(projectRoot, stylePath);
  if (!fs.existsSync(styleFull)) {
    results.fail.push({ check: CHECK, file: stylePath, message: 'Missing Output Style source for framing-readout enforcement' });
    return;
  }
  const styleContent = fs.readFileSync(styleFull, 'utf8');
  styleContent.split('\n').forEach((line, idx) => {
    if (BAR_GLYPH.test(line)) {
      results.fail.push({
        check: CHECK,
        file: stylePath,
        message: `Progress-bar glyph (▓/░) at line ${idx + 1} — the realization layer must not re-introduce a progress bar`,
      });
    }
  });
  const GUARD = 'bar, percentage, or N-of-M tally';
  if (!styleContent.includes(GUARD)) {
    results.fail.push({
      check: CHECK,
      file: stylePath,
      message: `Missing categorical-ban guard ("${GUARD}") — the framing-readout invariant must remain inscribed`,
    });
  }

  if (!results.fail.some(f => f.check === CHECK)) {
    results.pass.push({
      check: CHECK,
      file: 'all core protocol SKILL.md files + Output Style',
      message: `Framing-readout enforcement verified for ${checked} protocols (no progress-bar glyph; guard sentence inscribed)`,
    });
  }
}

// ============================================================
// Check 19: Single-Axis Soundness
// ============================================================
// Enforces the unified Constitution/Extension annotation axis in TOOL GROUNDING.
// Live SKILL.md / rule / doc files must not contain the obsolete dual-axis vocabulary
// (`── ELIDABLE CHECKPOINTS ──` section header, `always_gated`, or `elidable` as annotation tokens).
// Historical analysis docs and audit reports keep their pre-unification references.
function checkSingleAxisSoundness() {
  const BANNED_PATTERNS = [
    { pattern: /── ELIDABLE CHECKPOINTS ──/i, label: '── ELIDABLE CHECKPOINTS ── section header' },
    { pattern: /\balways_gated\b/i, label: '`always_gated` annotation token' },
    { pattern: /\belidable\b/i, label: '`elidable` annotation token' }
  ];

  const SKIP_PATTERNS = [
    /^docs\/analysis\//,
    /^docs\/audit-/,
    /^\.claude\/skills\/audit-delta\//,
    /^\.claude\/worktrees\//,
    /^\.claude-pr\//,
    /^node_modules\//,
    /^dist\//,
    /^\.git\//
  ];

  function isWhitelisted(relPath) {
    return SKIP_PATTERNS.some((re) => re.test(relPath));
  }

  function* walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.relative(process.cwd(), fullPath);
      if (isWhitelisted(relPath)) continue;
      if (entry.isDirectory()) {
        if (entry.name.startsWith('.git') || entry.name === 'node_modules' || entry.name === 'dist') continue;
        yield* walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        yield relPath;
      }
    }
  }

  const violations = [];
  for (const relPath of walk(process.cwd())) {
    let content;
    try {
      content = fs.readFileSync(relPath, 'utf8');
    } catch {
      continue;
    }
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      for (const { pattern, label } of BANNED_PATTERNS) {
        if (pattern.test(lines[i])) {
          violations.push({ file: relPath, line: i + 1, label, snippet: lines[i].trim().slice(0, 200) });
        }
      }
    }
  }

  if (violations.length === 0) {
    results.pass.push({
      check: 'single-axis-soundness',
      file: 'all .md files (live)',
      message: `Single-axis soundness verified — no obsolete dual-axis vocabulary (${BANNED_PATTERNS.map(p => p.label).join(', ')})`
    });
  } else {
    for (const v of violations) {
      results.fail.push({
        check: 'single-axis-soundness',
        file: `${v.file}:${v.line}`,
        message: `Banned vocabulary: ${v.label} — "${v.snippet}"`
      });
    }
  }
}

// ============================================================
// Check 22: Codex Manifest Version Sync
// ============================================================
// Every plugin carries a canonical .claude-plugin/plugin.json (the one
// package.js builds from) and may carry a .codex-plugin/plugin.json variant.
// version-staleness only inspects the claude manifest, so a bump that touches
// the claude manifest leaves the codex manifest silently drifted — the
// recurring "version bump missed codex-plugin" pattern. walkFiles skips
// dot-directories, so the codex manifest is also outside json-schema's reach;
// this check is its only parse/version guard. Fail-level on purpose: the
// forcing function must block at the same /verify gate the claude bump passes
// through, not surface after the fact in a separate remediation PR.
function checkCodexManifestSync() {
  const seen = new Set();
  let inSync = 0;
  for (const record of _records) {
    if (seen.has(record.dir)) continue;
    seen.add(record.dir);

    const codexPath = path.join(projectRoot, record.dir, '.codex-plugin', 'plugin.json');
    if (!fs.existsSync(codexPath)) continue; // codex variant optional; equality enforced only when present

    const codexRel = path.relative(projectRoot, codexPath);
    let codexJson;
    try {
      codexJson = JSON.parse(fs.readFileSync(codexPath, 'utf8'));
    } catch (e) {
      results.fail.push({
        check: 'codex-manifest-sync',
        file: codexRel,
        message: `Unparseable codex manifest: ${e.message}`,
      });
      continue;
    }

    const claudeVer = record.pluginJson.version;
    const codexVer = codexJson.version;
    if (!codexVer) {
      results.fail.push({
        check: 'codex-manifest-sync',
        file: codexRel,
        message: `Missing "version" — set it to "${claudeVer}" to match .claude-plugin/plugin.json`,
      });
      continue;
    }
    if (codexVer !== claudeVer) {
      results.fail.push({
        check: 'codex-manifest-sync',
        file: codexRel,
        message: `Version drift — codex "${codexVer}" != claude "${claudeVer}"; bump this file to "${claudeVer}" in the same commit as the claude version bump`,
      });
      continue;
    }
    inSync++;
  }

  // Always leave a terminal result so a registered-but-clean check is
  // distinguishable from one that never ran. Pass is suppressed only when
  // this check itself pushed a fail (preserves pass/fail non-co-emission).
  const sawFail = results.fail.some(f => f.check === 'codex-manifest-sync');
  if (!sawFail) {
    results.pass.push({
      check: 'codex-manifest-sync',
      file: 'working tree',
      message: inSync > 0
        ? `All ${inSync} codex manifests match their .claude-plugin/plugin.json version`
        : 'No .codex-plugin manifests present — nothing to sync',
    });
  }
}

// ============================================================
// Check 23: Packaged Agent ↔ SKILL.md Contract Sync
// ============================================================
// A plugin may ship a packaged subagent (`<plugin>/agents/*.md`) that a SKILL.md
// phase dispatches and whose verdict the SKILL.md parses back into typed state.
// When both surfaces inscribe the same review contract — the verdict's
// realization value set, the advisory disposition vocabulary, and the reviewer's
// checklist categories — an edit to one surface silently drifts from the other
// (the diylisis zero-memory-refuter ↔ /distill F5 pattern, Issue #532). The
// agent file's own Maintenance Note states the sync obligation; this check makes
// it a forcing function at the /verify gate.
//
// Design (generic, not diylisis-pinned):
//  - Opt-in by STRUCTURAL ANCHOR: an agent is contract-bearing iff its body
//    carries a verdict `### Realization:` enumeration line. Utility scanner
//    agents (epistemic-cooperative) lack it and are skipped — no false sync.
//  - Pairing: the contract-bearing agent pairs with a SKILL.md in its OWN
//    plugin whose TYPES block carries the matching enumerations.
//  - Comparison is SYMMETRIC (drift = mismatch between the two surfaces), not
//    against hardcoded token constants:
//      (b) Realization values — agent `### Realization: a | b | c` must equal
//          some TYPES `… ∈ {a, b, c}` enumeration (set-equality).
//      (c) Advisory vocabulary — agent Advisory Disposition bold tags must
//          equal some TYPES `… ∈ {…}` enumeration (set-equality; parenthesized
//          constructor args stripped so `Resolve(ref)` normalizes to `Resolve`).
//      (a) Checklist categories — each agent `## Checklist` category key must
//          appear in the SKILL.md prose (CONTAINMENT — the SKILL side carries
//          the categories as prose, not a delimited list).
function checkPackagedAgentContractSync() {
  const CHECK = 'packaged-agent-contract-sync';

  // Parse every `LHS ∈ { … }` enumeration from a formal block into normalized
  // token sets. Constructor args are stripped: `Resolve(canonical_ref)` → `Resolve`
  // so `A` and `A_tag` lines both normalize to the same advisory vocabulary.
  function parseEnumerations(typesBlock) {
    const enums = [];
    const re = /([A-Za-z_][\w]*)\s*∈\s*\{([^}]*)\}/g;
    let m;
    while ((m = re.exec(typesBlock)) !== null) {
      const tokens = m[2]
        .split(',')
        .map(t => t.replace(/\(.*$/, '').trim())  // strip constructor args
        // keep only atomic tag tokens; drops parse artifacts from nested
        // type annotations (e.g. ZeroMemoryVerdict's `sweep: SweepTrace`) that
        // are never a tag-set comparison target
        .filter(t => /^[\w.-]+$/.test(t));
      if (tokens.length) enums.push({ lhs: m[1], set: new Set(tokens) });
    }
    return enums;
  }

  function setEqual(a, b) {
    if (a.size !== b.size) return false;
    for (const x of a) if (!b.has(x)) return false;
    return true;
  }

  // Extract the body of a `## Heading` markdown section up to the next `## `.
  function extractMdSection(content, headingRe) {
    const lines = content.split('\n');
    let collecting = false;
    const out = [];
    for (const line of lines) {
      if (!collecting) {
        if (headingRe.test(line)) collecting = true;
        continue;
      }
      if (/^##\s+/.test(line)) break;
      out.push(line);
    }
    return out.join('\n');
  }

  // Return the header column names of the first markdown table under a heading
  // matched by `headingRe`. Null when the heading or its table is absent. Used
  // to read the agent's verdict-table column schema (the columns the F5 caller
  // parses into typed state).
  function tableColumns(content, headingRe) {
    const lines = content.split('\n');
    let inSection = false;
    for (const line of lines) {
      if (!inSection) {
        if (headingRe.test(line)) inSection = true;
        continue;
      }
      if (/^#{1,3}\s+/.test(line)) break; // left the section before a table
      if (/^\s*\|.*\|\s*$/.test(line)) {
        return line.split('|').slice(1, -1).map(c => c.trim()).filter(Boolean);
      }
    }
    return null;
  }

  // Parse the field-name set of a record type `Name = { f1: T; f2: T }` (or a
  // wrapped form such as `Name = List({ f1: T, f2: T })`) from a formal block.
  // Null when the type is absent.
  function parseRecordFields(block, typeName) {
    const re = new RegExp(typeName + '\\s*=\\s*[^{]*\\{([^}]*)\\}');
    const m = block.match(re);
    if (!m) return null;
    return new Set(
      m[1].split(/[;,]/).map(s => s.split(':')[0].trim()).filter(Boolean)
    );
  }

  // The F5 checklist-category contract is not a `##` heading — it lives in the
  // F5 prose paragraph, Rule 9, and the EvidencedFinding TYPES line. Anchor the
  // category-presence search to that corpus so a category cannot pass by
  // matching unrelated prose elsewhere in the skill.
  function f5Corpus(content) {
    return content.split('\n')
      .filter(l =>
        /\*\*F5\b/.test(l) ||
        /zero-memory comprehension gate/i.test(l) ||
        /EvidencedFinding\s*=/.test(l)
      )
      .join('\n')
      .toLowerCase();
  }

  // Discover plugins carrying packaged agents. Dedup by plugin dir (a plugin
  // may surface multiple skill records).
  const pluginDirs = [...new Set(_records.map(r => r.dir))];
  let checkedPairs = 0;

  for (const dir of pluginDirs) {
    const agentsDir = path.join(projectRoot, dir, 'agents');
    if (!fs.existsSync(agentsDir)) continue;

    const agentFiles = fs.readdirSync(agentsDir, { withFileTypes: true })
      .filter(e => e.isFile() && e.name.endsWith('.md'))
      .map(e => path.join(agentsDir, e.name));

    for (const agentPath of agentFiles) {
      const agentRel = path.relative(projectRoot, agentPath);
      const agentContent = fs.readFileSync(agentPath, 'utf8');

      // Opt-in anchor: a verdict `### Realization:` enumeration line. The
      // heading itself is the opt-in — capture the whole value and split on
      // `|`, so a single-value realization (no pipe) still paints into a
      // one-element set instead of being silently excluded.
      const realizationLine = agentContent
        .split('\n')
        .map(l => l.match(/^###\s+Realization:\s*(.+)$/))
        .find(Boolean);
      if (!realizationLine) continue; // not a contract-bearing agent → skip

      const agentRealization = new Set(
        realizationLine[1].split('|').map(t => t.trim()).filter(Boolean)
      );

      // Advisory vocabulary from the agent's Advisory Disposition bold tags.
      // Allow hyphenated tags (e.g. `Re-Route`) so a future compound tag is
      // not silently dropped from the parsed set.
      const advisorySection = extractMdSection(agentContent, /^##\s+Advisory Disposition/i);
      const agentAdvisory = new Set(
        [...advisorySection.matchAll(/^\s*-\s*\*\*([A-Za-z-]+)\*\*/gm)].map(x => x[1].trim())
      );

      // Checklist category keys from the agent's numbered checklist.
      const checklistSection = extractMdSection(agentContent, /^##\s+Checklist/i);
      const agentCategories = [...checklistSection.matchAll(/^\s*\d+\.\s*\*\*([^*]+)\*\*/gm)]
        .map(x => x[1].trim());

      // Pair with a SKILL.md in the SAME plugin whose TYPES enumerations cover
      // the agent's realization values. _records carries every skill in the dir.
      const skillRecords = _records.filter(r => r.dir === dir);
      let paired = null;
      let pairedEnums = null;
      for (const rec of skillRecords) {
        const skillContent = fs.readFileSync(rec.skillMdPath, 'utf8');
        const typesBlock = extractFormalSection(skillContent, 'TYPES');
        const enums = parseEnumerations(typesBlock);
        if (enums.some(e => setEqual(e.set, agentRealization))) {
          paired = { rec, skillContent, typesBlock };
          pairedEnums = enums;
          break;
        }
      }

      if (!paired) {
        results.fail.push({
          check: CHECK,
          file: agentRel,
          message: `Contract-bearing agent (carries "### Realization: ${[...agentRealization].join(' | ')}") but no SKILL.md in ${dir}/ has a TYPES enumeration matching that realization value set — the verdict contract drifted from its paired skill, or the pairing broke. Sync the SKILL.md realization enumeration with the agent's Realization line.`,
        });
        continue;
      }

      const skillRel = path.relative(projectRoot, paired.rec.skillMdPath);
      const localFails = [];

      // F5 verdict-contract detection — the verdict-table schema (d) and the
      // F5-anchored checklist corpus (a) are specific to the F5 zero-memory
      // contract, so both are gated on this. A marker on either side opts the
      // pairing in: the agent's Findings/Category-sweep verdict tables, or the
      // SKILL.md EvidencedFinding/SweepTrace parse records. A future contract-
      // bearing agent with a different verdict shape (no F5 marker either side)
      // keeps the generic checks (realization/advisory/checklist) but is not held
      // to the F5-specific schema or corpus.
      const agentFindingsCols = tableColumns(agentContent, /^###\s+Findings/);
      const agentSweepCols = tableColumns(agentContent, /^###\s+Category sweep/i);
      const efFields = parseRecordFields(paired.typesBlock, 'EvidencedFinding');
      const stFields = parseRecordFields(paired.typesBlock, 'SweepTrace');
      const isF5VerdictContract = agentFindingsCols || agentSweepCols || efFields || stFields;

      // (c) Advisory vocabulary — set-equality against some TYPES enumeration.
      if (agentAdvisory.size === 0) {
        localFails.push('agent Advisory Disposition section has no bold tag list — cannot verify advisory vocabulary');
      } else if (!pairedEnums.some(e => setEqual(e.set, agentAdvisory))) {
        localFails.push(
          `advisory vocabulary drift — agent advisory tags {${[...agentAdvisory].sort().join(', ')}} match no TYPES enumeration in ${skillRel} ` +
          `(present sets: ${pairedEnums.map(e => `${e.lhs}{${[...e.set].sort().join(',')}}`).join(' ')}). Sync the advisory coproduct.`
        );
      }

      // (a) Checklist categories — containment in the paired SKILL.md, matched
      // on the full stripped key (no first-two-words fallback) so a removed or
      // renamed category cannot pass by coinciding with unrelated prose. For an
      // F5 contract the search is anchored to the F5 contract corpus (not the
      // whole document); a non-F5 pairing falls back to whole-document search so
      // a future non-F5 agent's categories are not all reported missing.
      if (agentCategories.length === 0) {
        localFails.push('agent ## Checklist section has no numbered bold categories — cannot verify category coverage');
      } else {
        const corpus = isF5VerdictContract
          ? f5Corpus(paired.skillContent)
          : paired.skillContent.toLowerCase();
        const missing = [];
        for (const phrase of agentCategories) {
          // Match the FULL category phrase (only a trailing parenthetical is
          // stripped) — splitting on "without" would drop the qualifier, letting
          // an agent-side rename of the qualifier pass against an unchanged corpus.
          const key = phrase.toLowerCase().replace(/\s*\(.*$/, '').trim();
          if (!corpus.includes(key)) {
            missing.push(phrase);
          }
        }
        if (missing.length) {
          localFails.push(
            `checklist category drift — ${missing.length} agent checklist categor${missing.length === 1 ? 'y' : 'ies'} ` +
            `absent from ${skillRel}: ${missing.map(c => `"${c}"`).join(', ')}. ` +
            `Reflect the category in the SKILL.md F5 contract (or remove it from the agent).`
          );
        }
      }

      // (d) Verdict-table column schema — the F5 zero-memory-verdict contract.
      // Gated on isF5VerdictContract (computed above): the columns are locked
      // bidirectionally against the SKILL.md records, so a rename/drop on either
      // surface — including one side dropping its half of the contract — fails.
      const FINDINGS_COLS = new Set(['Quoted token', 'Location', 'Category', 'Why unresolvable', 'Advisory disposition', 'Repair note']);
      const SWEEP_COLS = new Set(['Category', 'Status', 'What was checked']);
      const EF_EXPECTED = new Set(['item', 'quoted_token', 'location', 'category', 'why_unresolvable', 'advisory', 'repair_note']);
      const ST_EXPECTED = new Set(['category', 'status', 'checked']);

      if (isF5VerdictContract) {
        if (!agentFindingsCols) {
          localFails.push('agent declares an F5 verdict contract but has no `### Findings` table header — cannot verify the Findings column schema the caller parses');
        } else if (!setEqual(new Set(agentFindingsCols), FINDINGS_COLS)) {
          localFails.push(
            `Findings table column drift — agent columns {${agentFindingsCols.join(', ')}} ` +
            `do not match the locked F5 schema {${[...FINDINGS_COLS].join(', ')}}. ` +
            `The caller parses these columns into EvidencedFinding fields; sync the table header.`
          );
        }

        if (!agentSweepCols) {
          localFails.push('agent declares an F5 verdict contract but has no `### Category sweep` table header — cannot verify the sweep column schema');
        } else if (!setEqual(new Set(agentSweepCols), SWEEP_COLS)) {
          localFails.push(
            `Category sweep table column drift — agent columns {${agentSweepCols.join(', ')}} ` +
            `do not match the locked F5 schema {${[...SWEEP_COLS].join(', ')}}. Sync the table header.`
          );
        }

        // Lock the SKILL.md side too: the record types that define the parse
        // contract must still declare the fields these columns map onto. Catches
        // reverse drift (a TYPES field renamed/dropped while the agent table stays).
        if (!efFields) {
          localFails.push(`${skillRel} declares an F5 verdict contract but TYPES has no EvidencedFinding record — the Findings parse contract is undefined`);
        } else if (!setEqual(efFields, EF_EXPECTED)) {
          localFails.push(
            `EvidencedFinding field drift in ${skillRel} — fields {${[...efFields].sort().join(', ')}} ` +
            `do not match the locked set {${[...EF_EXPECTED].sort().join(', ')}}. The Findings columns parse into these fields; sync TYPES.`
          );
        }
        if (!stFields) {
          localFails.push(`${skillRel} declares an F5 verdict contract but TYPES has no SweepTrace record — the sweep parse contract is undefined`);
        } else if (!setEqual(stFields, ST_EXPECTED)) {
          localFails.push(
            `SweepTrace field drift in ${skillRel} — fields {${[...stFields].sort().join(', ')}} ` +
            `do not match the locked set {${[...ST_EXPECTED].sort().join(', ')}}. Sync TYPES.`
          );
        }
      }

      checkedPairs++;
      if (localFails.length) {
        for (const msg of localFails) {
          results.fail.push({ check: CHECK, file: `${agentRel} ↔ ${skillRel}`, message: msg });
        }
      } else {
        results.pass.push({
          check: CHECK,
          file: `${agentRel} ↔ ${skillRel}`,
          message: `Contract in sync — realization ${agentRealization.size}, advisory ${agentAdvisory.size}, checklist ${agentCategories.length} categories all reconciled`,
        });
      }
    }
  }

  if (checkedPairs === 0 && !results.fail.some(f => f.check === CHECK)) {
    results.pass.push({
      check: CHECK,
      file: 'working tree',
      message: 'No contract-bearing packaged agents found (no agent carries a "### Realization:" verdict anchor) — nothing to sync',
    });
  }
}

// ============================================================
// Check 25: Formal Blocks Rule
// ============================================================
// Compiled-copy coverage for the "Formal blocks are runtime-normative" Rules
// entry (docs/structural-specs.md is the contributor-facing anatomy doc;
// this rule is the runtime-normative compiled copy every packaged SKILL.md
// must carry, since a packaged runtime contract cannot depend on contributor
// docs alone — CLAUDE.md Runtime Contract). Verifies each core protocol
// SKILL.md carries both the Rules entry label and its kernel sentence
// (Formal blocks are LLM-facing and constitutive of protocol identity).
//
// Exemption list: all core protocols currently carry this rule (added
// in the compiled-copy enforcement family (checks 25–26)). Kept EMPTY on purpose: add a relPath
// only when a recorded decision exempts a protocol — never pre-populate.
const FORMAL_BLOCKS_EXEMPTIONS = [];

// Anchoring: the label must appear as a numbered Rules entry (not merely a
// cross-reference elsewhere in the file), and the kernel sentence must fall
// within that SAME entry's bounded body — not anywhere in the file. Bound
// calibrated against all core protocols (max observed entry ~560 chars);
// 900 leaves comfortable margin without reaching into unrelated content.
// The cut also stops at the next section heading or column-0 bold
// paragraph, so a terminal numbered entry's body does not extend into
// following unrelated content.
const NEXT_ENTRY_OR_SECTION = /^(?:\d+\.\s|#{1,6}\s|\*\*)/m;

function boundedEntryBody(content, labelMatch, bound, nextPattern = NEXT_ENTRY_OR_SECTION) {
  const bodyStart = labelMatch.index + labelMatch[0].length;
  const bounded = content.slice(bodyStart, bodyStart + bound);
  const next = nextPattern.exec(bounded);
  return next ? bounded.slice(0, next.index) : bounded;
}

function checkFormalBlocksRule() {
  const CHECK = 'formal-blocks-rule';
  const LABEL_PATTERN = /^\d+\.\s+\*\*Formal blocks are runtime-normative\*\*/m;
  const KERNEL = 'LLM-facing and constitutive of protocol identity';
  const ENTRY_BOUND = 900;

  let checked = 0;
  for (const relPath of PROTOCOL_FILES) {
    if (FORMAL_BLOCKS_EXEMPTIONS.includes(relPath)) continue;

    const fullPath = path.join(projectRoot, relPath);
    if (!fs.existsSync(fullPath)) {
      results.warn.push({
        check: CHECK,
        file: relPath,
        message: `Protocol file not found: ${relPath}`
      });
      continue;
    }

    checked++;
    const content = fs.readFileSync(fullPath, 'utf8');
    const labelMatch = LABEL_PATTERN.exec(content);
    if (!labelMatch) {
      results.fail.push({
        check: CHECK,
        file: relPath,
        message: 'Missing numbered Rules entry: "Formal blocks are runtime-normative"',
      });
      continue;
    }

    const entryBody = boundedEntryBody(content, labelMatch, ENTRY_BOUND);
    if (!entryBody.includes(KERNEL)) {
      results.fail.push({
        check: CHECK,
        file: relPath,
        message: `"Formal blocks are runtime-normative" rule present but missing kernel sentence within its own entry: "${KERNEL}"`,
      });
    }
  }

  if (!results.fail.some(f => f.check === CHECK)) {
    results.pass.push({
      check: CHECK,
      file: 'all core protocol SKILL.md files',
      message: `Formal blocks rule coverage verified for ${checked} protocols (${FORMAL_BLOCKS_EXEMPTIONS.length} exempted)`,
    });
  }
}

// ============================================================
// Check 26: Gate Integrity Rule
// ============================================================
// Compiled-copy coverage for the Gate Integrity Rules entry (axioms.md
// "Gate Integrity (Operational Guards, Safeguard-tier)" — reclassified from
// A7/Adversarial Anticipation per audit-2026-04-11 #241 resolution). Verifies
// each core protocol SKILL.md carries a Gate integrity rule tagged
// "(Safeguard tier)" whose body states the invariant kernel phrase
// ("type-preserving materialization"), so runtime enforcement of gate
// fidelity does not depend on contributor-only axioms.md alone. The mutation
// taxonomy itself (injection/deletion/substitution) is deliberately NOT
// word-anchored: copies specialize it in per-protocol vocabulary (e.g.
// euporia phrases mutations as partial omission of cycle coordinates), so
// the check anchors on the kernel phrase only.
//
// Exemption list: all core protocols currently carry this rule (added
// in the compiled-copy enforcement family (checks 25–26)). Kept EMPTY on purpose: add a relPath
// only when a recorded decision exempts a protocol — never pre-populate.
const GATE_INTEGRITY_EXEMPTIONS = [];

function checkGateIntegrityRule() {
  const CHECK = 'gate-integrity-rule';
  // Anchoring (same rationale as checkFormalBlocksRule above): the label
  // must be a numbered Rules entry, not a cross-reference. Bound calibrated
  // against all core protocols (max observed entry ~1180 chars, horismos);
  // 2000 leaves comfortable margin without reaching into unrelated content.
  const LABEL_PATTERN = /^\d+\.\s+\*\*Gate integrity\*\*/m;
  const KERNEL = 'type-preserving materialization';
  const ENTRY_BOUND = 2000;

  let checked = 0;
  for (const relPath of PROTOCOL_FILES) {
    if (GATE_INTEGRITY_EXEMPTIONS.includes(relPath)) continue;

    const fullPath = path.join(projectRoot, relPath);
    if (!fs.existsSync(fullPath)) {
      results.warn.push({
        check: CHECK,
        file: relPath,
        message: `Protocol file not found: ${relPath}`
      });
      continue;
    }

    checked++;
    const content = fs.readFileSync(fullPath, 'utf8');
    const labelMatch = LABEL_PATTERN.exec(content);
    if (!labelMatch) {
      results.fail.push({
        check: CHECK,
        file: relPath,
        message: 'Missing numbered Rules entry: "Gate integrity"',
      });
      continue;
    }

    const lineEnd = content.indexOf('\n', labelMatch.index);
    const titleLine = lineEnd === -1 ? content.slice(labelMatch.index) : content.slice(labelMatch.index, lineEnd);
    if (!titleLine.includes('(Safeguard tier)')) {
      results.fail.push({
        check: CHECK,
        file: relPath,
        message: '"Gate integrity" rule present but title line missing the "(Safeguard tier)" annotation',
      });
      continue;
    }

    const entryBody = boundedEntryBody(content, labelMatch, ENTRY_BOUND);
    if (!entryBody.toLowerCase().includes(KERNEL)) {
      results.fail.push({
        check: CHECK,
        file: relPath,
        message: `"Gate integrity" rule present but missing mutation-taxonomy kernel within its own entry: "${KERNEL}"`,
      });
    }
  }

  if (!results.fail.some(f => f.check === CHECK)) {
    results.pass.push({
      check: CHECK,
      file: 'all core protocol SKILL.md files',
      message: `Gate integrity rule coverage verified for ${checked} protocols (${GATE_INTEGRITY_EXEMPTIONS.length} exempted)`,
    });
  }
}

// ============================================================
// Check 27: Gate Firing Precondition Kernel Anchor
// ============================================================
// The Output Style source (epistemic-cooperative/styles/epistemic-ink.md)
// carries the "Gate firing precondition" element — the rendering-layer rule
// that decides WHETHER a gate exists before the divider block decides how
// one looks. This check pins the element's three load-bearing kernel
// phrases:
//   1. "fires as classified" — protocol classification controls by default;
//   2. "an uncited skip is not a relay but a silent gate omission" — a
//      relay collapse carries a citation obligation at the point of use;
//   3. "never overrides a protocol's TOOL GROUNDING classification" — the
//      outside-protocol reversibility test stays subordinate to protocol
//      classification.
// Kernel-anchored: the surrounding phrasing is free to evolve; only the
// kernel phrases are pinned. Each kernel must appear inside the element's
// own bounded body (label line to the next Ink element label or heading),
// not merely anywhere in the file, so a gutted element still fails even if
// a kernel survives elsewhere.
function checkGateFiringAnchor() {
  const CHECK = 'gate-firing-anchor';
  const REL_PATH = 'epistemic-cooperative/styles/epistemic-ink.md';
  const LABEL_PATTERN = /^\*\*Gate firing precondition\*\*/m;
  // Element boundary: a column-0 bold label opening the next capitalized
  // Ink element, or a Markdown heading. The element's own bullet lines
  // start with "- " and therefore do not terminate the body. Bound
  // calibrated against the current element body (~2.9k chars); 6000 leaves
  // comfortable margin while still cutting off a runaway scan if the
  // boundary pattern ever fails to match.
  const NEXT_INK_ELEMENT_OR_HEADING = /^(?:\*\*[A-Z]|#{1,6}\s)/m;
  const ELEMENT_BOUND = 6000;
  const KERNELS = [
    'fires as classified',
    'an uncited skip is not a relay but a silent gate omission',
    "never overrides a protocol's TOOL GROUNDING classification",
  ];

  const fullPath = path.join(projectRoot, REL_PATH);
  if (!fs.existsSync(fullPath)) {
    results.fail.push({
      check: CHECK,
      file: REL_PATH,
      message: `Output Style source not found: ${REL_PATH}`,
    });
    return;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const labelMatch = LABEL_PATTERN.exec(content);
  if (!labelMatch) {
    results.fail.push({
      check: CHECK,
      file: REL_PATH,
      message: 'Missing Ink element label: "**Gate firing precondition**"',
    });
    return;
  }

  const elementBody = boundedEntryBody(content, labelMatch, ELEMENT_BOUND, NEXT_INK_ELEMENT_OR_HEADING);
  const missing = KERNELS.filter(kernel => !elementBody.includes(kernel));
  for (const kernel of missing) {
    results.fail.push({
      check: CHECK,
      file: REL_PATH,
      message: `"Gate firing precondition" element present but missing kernel phrase within its bounded body: "${kernel}"`,
    });
  }

  if (missing.length === 0) {
    results.pass.push({
      check: CHECK,
      file: REL_PATH,
      message: `Gate firing precondition element verified — all ${KERNELS.length} kernel phrases anchored within the element body`,
    });
  }
}

// ============================================================
// Run All Checks
// ============================================================
try {
  checkJsonSchema();
  checkNotation();
  checkDirectiveVerb();
  checkCrossReference();
  checkRequiredSections();
  checkToolGrounding();
  checkVersionStaleness();
  checkCodexManifestSync();
  checkPackagedAgentContractSync();
  checkGraphIntegrity();
  checkSpecVsImpl();
  checkMorphismAnatomy();
  checkCrossRefScan();
  checkRoutingIndexContract();
  checkOnboardSync();
  checkCatalogSync();
  checkRoutingMapSync();
  checkPrecedenceLinearExtension();
  checkPartitionInvariant();
  checkGateTypeSoundness();
  checkArtifactSelfContainment();
  checkEmitLoadDiscipline();
  checkFramingReadoutEnforcement();
  checkSingleAxisSoundness();
  checkLanguagePurity();
  checkFormalBlocksRule();
  checkGateIntegrityRule();
  checkGateFiringAnchor();

  // Output results as JSON
  console.log(JSON.stringify(results, null, 2));

  // Exit code based on failures
  process.exit(results.fail.length > 0 ? 1 : 0);

} catch (e) {
  console.error(JSON.stringify({
    error: e.message,
    stack: e.stack
  }));
  process.exit(2);
}
