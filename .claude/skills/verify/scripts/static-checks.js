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
const {
  discoverPlugins,
  protocolFiles,
  sourcePluginDirs,
  CANONICAL_PRECEDENCE: CANONICAL_PRECEDENCE_ARR,
} = require(path.resolve(__dirname, '../../../../scripts/load-protocols.js'));

const projectRoot = process.argv[2] || process.cwd();

const results = { pass: [], fail: [], warn: [] };

// Single discoverPlugins() call shared across every check. plugin.json reads
// are memoized inside the helper, so the verifier pays one read per
// plugin.json regardless of how many checks consume the records below.
const _records = discoverPlugins({ projectRoot });
const _protocolRecords = _records.filter(r => r.isProtocol);

const PROTOCOL_FILES = protocolFiles({ projectRoot });

const CANONICAL_PRECEDENCE = CANONICAL_PRECEDENCE_ARR.join(' → ');
const CANONICAL_CLUSTERS = 'Planning (`/inquire`, `/elicit`) · Analysis (`/frame`, `/ground`, `/induce`) · Decision (`/gap`) · Execution (`/attend`) · Verification (`/contextualize`) · Cross-cutting (`/bound`, `/recollect`, `/grasp`)';

// PRECEDENCE_FILES = protocols listed in CANONICAL_PRECEDENCE (linear order)
// + Katalepsis appended (structurally last). Anamnesis is excluded — recall
// stands outside the precedence partial order. Order matches the canonical
// presentation used by checkPrecedenceLinearExtension.
const PRECEDENCE_FILES = [
  ...CANONICAL_PRECEDENCE_ARR.map(name => `${name.toLowerCase()}/skills/${
    _protocolRecords.find(r => r.dir === name.toLowerCase())?.skill
  }/SKILL.md`),
  `katalepsis/skills/${_protocolRecords.find(r => r.dir === 'katalepsis')?.skill}/SKILL.md`,
];

// Authoritative edge type allowlist — used by both graph-integrity and cross-ref-scan checks
const VALID_EDGE_TYPES = new Set(['precondition', 'advisory', 'suppression']);

// Protocol display name → {deficit, resolution}. Derived from per-protocol
// SKILL.md description Type signature; capitalize(dir) for display name.
const CANONICAL_PROTOCOLS = Object.fromEntries(
  _protocolRecords.map(r => [
    r.dir[0].toUpperCase() + r.dir.slice(1),
    { deficit: r.deficit, resolution: r.resolution },
  ])
);

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
// Check 5: Required Sections in Protocols
// ============================================================
function checkRequiredSections() {

  const requiredSections = [
    '## Definition',
    '## Distinction from Other Protocols',
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
  const claudeMdPath = path.join(projectRoot, 'CLAUDE.md');
  if (!fs.existsSync(claudeMdPath)) {
    results.warn.push({
      check: 'cross-ref-scan',
      file: 'CLAUDE.md',
      message: 'CLAUDE.md not found, skipping cross-reference scan'
    });
    return;
  }

  const claudeMd = fs.readFileSync(claudeMdPath, 'utf8');
  let subCheckFailed = false;

  // Sub-check 1: Verify each canonical deficit → resolution pair appears in CLAUDE.md
  for (const [name, { deficit, resolution }] of Object.entries(CANONICAL_PROTOCOLS)) {
    const deficitPattern = `${deficit} → ${resolution}`;
    if (!claudeMd.includes(deficitPattern)) {
      results.fail.push({
        check: 'cross-ref-scan',
        file: 'CLAUDE.md',
        message: `Missing canonical deficit pair "${deficitPattern}" for ${name}`
      });
      subCheckFailed = true;
    }
  }

  // Sub-check 2: Verify each protocol SKILL.md contains its own correct deficit → resolution pair
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

  // Sub-check 3: Verify precedence template in **Protocol precedence** line
  const precedenceList = CANONICAL_PRECEDENCE.split(' → ');
  const precedenceCount = precedenceList.length;
  for (const relPath of PRECEDENCE_FILES) {
    const fullPath = path.join(projectRoot, relPath);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, 'utf8');
    const precedenceMatch = content.match(/\*\*Protocol precedence\*\*:(.+)/);
    if (!precedenceMatch) {
      results.fail.push({
        check: 'cross-ref-scan',
        file: relPath,
        message: 'Missing **Protocol precedence** line in SKILL.md'
      });
      subCheckFailed = true;
      continue;
    }
    const pLine = precedenceMatch[1];

    // Derive expected position from CANONICAL_PRECEDENCE index
    const dirName = relPath.split('/')[0];
    const expectedIndex = precedenceList.findIndex(
      name => name.toLowerCase() === dirName
    );

    if (expectedIndex >= 0) {
      const expectedPosition = `position ${expectedIndex + 1}/${precedenceCount}`;
      if (!pLine.includes(expectedPosition)) {
        results.fail.push({
          check: 'cross-ref-scan',
          file: relPath,
          message: `Wrong precedence position (expected: "${expectedPosition}")`
        });
        subCheckFailed = true;
      }
    } else {
      // Cross-cutting protocol (not in CANONICAL_PRECEDENCE)
      const hasCrossCutting = pLine.includes('Cross-cutting:') || pLine.includes('Structural constraint');
      if (!hasCrossCutting) {
        results.fail.push({
          check: 'cross-ref-scan',
          file: relPath,
          message: 'Protocol not in CANONICAL_PRECEDENCE and missing Cross-cutting/Structural constraint marker'
        });
        subCheckFailed = true;
      }
    }

    if (!pLine.includes('graph.json')) {
      results.fail.push({
        check: 'cross-ref-scan',
        file: relPath,
        message: 'Missing graph.json reference in **Protocol precedence** line'
      });
      subCheckFailed = true;
    }
  }

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

  const claudeRequirements = [
    {
      pattern: /ordered by activation sequence within each cluster/,
      message: 'CLAUDE.md missing cluster activation sequence description'
    },
    {
      pattern: /\| Concern \| Protocols \|/,
      message: 'CLAUDE.md missing Epistemic Concern Clusters table'
    },
    {
      pattern: /\*\*AI-guided\*\*: AI evaluates condition and guides the process \(Prothesis, Syneidesis, Horismos, Aitesis, Analogia, Periagoge, Epharmoge, Anamnesis\)/,
      message: 'CLAUDE.md initiator taxonomy missing protocol in the AI-guided set'
    },
  ];

  for (const requirement of claudeRequirements) {
    if (!requirement.pattern.test(claudeMd)) {
      results.fail.push({
        check: 'cross-ref-scan',
        file: 'CLAUDE.md',
        message: requirement.message
      });
      subCheckFailed = true;
    }
  }

  // Sub-check 4: Verify distinction table consistency across SKILL.md files
  // Each protocol SKILL.md should reference all canonical protocol names in its distinction table
  for (const relPath of PROTOCOL_FILES) {
    const fullPath = path.join(projectRoot, relPath);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, 'utf8');

    // Check if file has a distinction table (look for the section)
    if (!content.includes('Distinction from Other Protocols')) continue;

    // Extract the table section
    const tableMatch = content.match(/\| Protocol.*\|[\s\S]*?(?=\n\n|\n\*\*Key|\n##)/);
    if (!tableMatch) continue;

    const tableSection = tableMatch[0];

    for (const protocolName of Object.keys(CANONICAL_PROTOCOLS)) {
      if (!tableSection.includes(protocolName)) {
        results.warn.push({
          check: 'cross-ref-scan',
          file: relPath,
          message: `Distinction table missing protocol "${protocolName}"`
        });
      }
    }
  }

  // Sub-check 5: Array completeness — cross-check PROTOCOL_FILES, CANONICAL_PROTOCOLS,
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
          } catch (_) { /* json-schema check reports parse errors */ }
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

  // Sub-check 6: Verify edge types in graph.json match CLAUDE.md allowlist
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
              message: `Edge type "${edgeType}" not in CLAUDE.md allowlist: ${[...VALID_EDGE_TYPES].join(', ')}`
            });
            subCheckFailed = true;
          }
        }

        // Also check CLAUDE.md documents all edge types actually used
        for (const edgeType of usedEdgeTypes) {
          if (!claudeMd.includes(edgeType)) {
            results.warn.push({
              check: 'cross-ref-scan',
              file: 'CLAUDE.md',
              message: `Edge type "${edgeType}" used in graph.json but not documented in CLAUDE.md`
            });
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

  // Sub-check 2: Protocol count reference matches actual count
  const expectedCount = protocols.length;
  if (!onboardContent.includes(`the ${expectedCount} protocols`)) {
    results.warn.push({
      check: 'onboard-sync',
      file: 'epistemic-cooperative/skills/onboard/SKILL.md',
      message: `Protocol count may be stale — expected "the ${expectedCount} protocols"`
    });
  }

  // Sub-check 3: Phase 0 category groupings cover all slash commands
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

  // Sub-check 4: scenarios.md — every protocol must have a scenario block
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

  // Sub-check 5: workflow.md — all slash commands present
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
      message: `Onboard sync — Data Sources, scenarios, and workflow verified for ${expectedCount} protocols`
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

// ============================================================
// Check 17: Single-Axis Soundness
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
// Check 18: Agents Symlinks Sync (Agent Skills cross-tool standard)
// ============================================================
// .agents/skills/ exposes plugin skills under the Agent Skills specification
// path (agentskills.io) used by Cursor, GitHub Copilot, Devin, OpenCode,
// Codex CLI, Gemini CLI, and other compliant tools. Single source of truth is
// each <plugin>/skills/<name>/ directory; the .agents/skills/ entries are
// relative symlinks materialized by scripts/sync-agents-symlinks.sh. This
// check enforces parity between the two views — fails on missing, extra,
// non-symlink, or mis-targeted entries.
function checkAgentsSymlinksSync() {
  // Source plugin dirs derived from filesystem walk (excludes deprecated).
  const SOURCE_PLUGINS = sourcePluginDirs({ projectRoot });
  const agentsDir = path.join(projectRoot, '.agents', 'skills');

  const expected = new Map(); // name -> absolute target dir
  for (const plugin of SOURCE_PLUGINS) {
    const skillsRoot = path.join(projectRoot, plugin, 'skills');
    if (!fs.existsSync(skillsRoot)) continue;
    for (const entry of fs.readdirSync(skillsRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      expected.set(entry.name, path.join(skillsRoot, entry.name));
    }
  }

  if (!fs.existsSync(agentsDir)) {
    results.fail.push({
      check: 'agents-symlinks-sync',
      file: '.agents/skills/',
      message: `Missing — run scripts/sync-agents-symlinks.sh to materialize ${expected.size} skill symlinks for Devin compatibility`,
    });
    return;
  }

  const actual = new Map(); // name -> { isSymlink, target }
  for (const entry of fs.readdirSync(agentsDir, { withFileTypes: true })) {
    const full = path.join(agentsDir, entry.name);
    let resolved = null;
    try { resolved = fs.realpathSync(full); } catch { /* dangling */ }
    actual.set(entry.name, { isSymlink: entry.isSymbolicLink(), target: resolved });
  }

  const violations = [];
  for (const [name, expectedTarget] of expected) {
    const got = actual.get(name);
    if (!got) {
      violations.push({ name, reason: `missing symlink (expected → ${path.relative(projectRoot, expectedTarget)})` });
      continue;
    }
    if (!got.isSymlink) {
      violations.push({ name, reason: 'not a symlink (must be a relative symlink, not a regular directory or copy)' });
      continue;
    }
    if (!got.target || path.resolve(got.target) !== path.resolve(expectedTarget)) {
      const gotRel = got.target ? path.relative(projectRoot, got.target) : '<dangling>';
      violations.push({ name, reason: `target mismatch — points to ${gotRel}, expected ${path.relative(projectRoot, expectedTarget)}` });
    }
  }
  for (const name of actual.keys()) {
    if (!expected.has(name)) {
      violations.push({ name, reason: 'extra entry — no matching <plugin>/skills/ source' });
    }
  }

  if (violations.length === 0) {
    results.pass.push({
      check: 'agents-symlinks-sync',
      file: '.agents/skills/',
      message: `Devin skill view in sync — ${expected.size} symlinks match plugin sources`,
    });
  } else {
    for (const v of violations) {
      results.fail.push({
        check: 'agents-symlinks-sync',
        file: `.agents/skills/${v.name}`,
        message: `${v.reason} — run scripts/sync-agents-symlinks.sh to repair`,
      });
    }
  }
}

// ============================================================
// Check 19: Workflow Paths Sync
// ============================================================
// Verifies .github/workflows/claude-epistemic-review.yml `paths` includes
// every protocol plugin directory. Prevents new protocols from silently
// missing the multi-perspective epistemic review trigger (Issue #258 pattern:
// anamnesis + periagoge omitted at workflow inception). Utility plugins
// (epistemic-cooperative) are intentionally out of scope.
//
// KNOWN EXCLUSION: .github/workflows/claude-style-audit.yml is NOT validated
// by this check. Its `paths:` trigger and inline grep regex constitute a
// separate scope set (LLM-facing prose: SKILL.md, agents, output-styles)
// that does not align with protocol-plugin enumeration. Drift between its
// `paths:` and inline regex is currently surfaced via in-file comment only.
// Tracked as a follow-up: extend this check to cover claude-style-audit.yml.
function checkWorkflowPathsSync() {
  const relPath = '.github/workflows/claude-epistemic-review.yml';
  const workflowFile = path.join(projectRoot, relPath);

  if (!fs.existsSync(workflowFile)) {
    results.fail.push({
      check: 'workflow-paths-sync',
      file: relPath,
      message: 'Missing — claude-epistemic-review.yml not found',
    });
    return;
  }

  const content = fs.readFileSync(workflowFile, 'utf8');
  const pathsBlockMatch = content.match(/^\s+paths:\s*\n((?:\s+-\s+'[^']+'\s*\n)+)/m);
  if (!pathsBlockMatch) {
    results.fail.push({
      check: 'workflow-paths-sync',
      file: relPath,
      message: 'on.pull_request.paths block not found or unparseable',
    });
    return;
  }

  const declaredPaths = new Set();
  const pathLineRe = /-\s+'([^']+)'/g;
  let m;
  while ((m = pathLineRe.exec(pathsBlockMatch[1])) !== null) {
    declaredPaths.add(m[1]);
  }

  const expected = PROTOCOL_FILES.map(p => p.split('/')[0]);
  const missing = expected.filter(name => !declaredPaths.has(`${name}/**`));

  if (missing.length === 0) {
    results.pass.push({
      check: 'workflow-paths-sync',
      file: relPath,
      message: `All ${expected.length} protocol paths declared in epistemic-review trigger`,
    });
  } else {
    for (const name of missing) {
      results.fail.push({
        check: 'workflow-paths-sync',
        file: relPath,
        message: `Missing protocol path — add "- '${name}/**'" under on.pull_request.paths so ${name} PRs trigger epistemic review`,
      });
    }
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
  checkGraphIntegrity();
  checkSpecVsImpl();
  checkMorphismAnatomy();
  checkCrossRefScan();
  checkOnboardSync();
  checkCatalogSync();
  checkPrecedenceLinearExtension();
  checkPartitionInvariant();
  checkGateTypeSoundness();
  checkArtifactSelfContainment();
  checkSingleAxisSoundness();
  checkAgentsSymlinksSync();
  checkWorkflowPathsSync();

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
