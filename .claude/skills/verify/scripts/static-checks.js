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
const { execFileSync } = require('child_process');

const projectRoot = process.argv[2] || process.cwd();

const results = { pass: [], fail: [], warn: [] };

const PROTOCOL_FILES = [
  'prothesis/skills/frame/SKILL.md',
  'syneidesis/skills/gap/SKILL.md',
  'hermeneia/skills/clarify/SKILL.md',
  'katalepsis/skills/grasp/SKILL.md',
  'telos/skills/goal/SKILL.md',
  'aitesis/skills/inquire/SKILL.md',
  'analogia/skills/ground/SKILL.md',
  'epharmoge/skills/contextualize/SKILL.md',
  'prosoche/skills/attend/SKILL.md',
];

const CANONICAL_PRECEDENCE = 'Hermeneia → Telos → Aitesis → Prothesis → Analogia → Syneidesis → Prosoche → Epharmoge';
const CANONICAL_WORKFLOW = 'Clarify → Goal → Inquire → Frame → Ground → Gap → Attend → Contextualize → Grasp';
const PRECEDENCE_FILES = [
  'hermeneia/skills/clarify/SKILL.md',
  'telos/skills/goal/SKILL.md',
  'aitesis/skills/inquire/SKILL.md',
  'prothesis/skills/frame/SKILL.md',
  'analogia/skills/ground/SKILL.md',
  'syneidesis/skills/gap/SKILL.md',
  'katalepsis/skills/grasp/SKILL.md',
];

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
function checkNotation() {
  const notationRules = [
    { pattern: /->(?![a-zA-Z])/g, replace: '→', name: 'arrow' },
    { pattern: /\|\|(?=\s*[A-Z])/g, replace: '∥', name: 'parallel' },
    { pattern: /\\cap\b/g, replace: '∩', name: 'intersection' },
    { pattern: /\\cup\b/g, replace: '∪', name: 'union' },
    { pattern: /\\subseteq\b/g, replace: '⊆', name: 'subset' },
    { pattern: /\\in\b/g, replace: '∈', name: 'element' },
    { pattern: /\\neq\b/g, replace: '≠', name: 'not-equal' },
  ];

  const mdFiles = walkFiles(projectRoot, e => e.name.endsWith('.md'), 'notation');

  for (const mdPath of mdFiles) {
    const content = fs.readFileSync(mdPath, 'utf8');
    const relativePath = path.relative(projectRoot, mdPath);

    // Skip README files for notation check (they may have different conventions)
    if (relativePath.includes('README')) continue;

    for (const rule of notationRules) {
      const matches = content.match(rule.pattern);
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
    const content = fs.readFileSync(mdPath, 'utf8');
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
    const locations = [
      path.join(projectRoot, 'reflexion/skills/reflexion', refPath),
      path.join(projectRoot, 'write/skills/write', refPath),
    ];

    const exists = locations.some(loc => fs.existsSync(loc));
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
  const MANDATORY_CLASSIFICATIONS = new Set(['extern', 'parallel']);

  // Escape special regex characters
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

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
    const groundingMatch = content.match(/── TOOL GROUNDING ──([\s\S]*?)(?=──|$)/);
    if (!groundingMatch) continue;

    const groundingSection = groundingMatch[1];
    const toolBindings = [];

    // Parse lines like: "S (extern) → ..." or "Phase 4a Δ (detect) → ..."
    // Capture: operation, classification, tool
    // Supports: Phase prefix, qualifier word (e.g., "praxis"), Greek letters, ?'/
    const bindingPattern = /^(?:Phase\s+\S+\s+)?([∥]?[\w\u0370-\u03FF?'\/]+)(?:\s+\w+)?\s*\((\w+)\)\s*→\s*(\w+)/gm;
    let match;
    while ((match = bindingPattern.exec(groundingSection)) !== null) {
      toolBindings.push({
        operation: match[1],
        classification: match[2],
        tool: match[3]
      });
    }

    // Check 6c: Verify PHASE TRANSITIONS reference tool bindings
    const phaseMatch = content.match(/── PHASE TRANSITIONS ──([\s\S]*?)(?=──|$)/);
    if (!phaseMatch) continue;

    const phaseSection = phaseMatch[1];

    for (const binding of toolBindings) {
      // Skip internal operations
      if (binding.tool === 'Internal') continue;

      // Skip non-mandatory classifications (state, gather, detect, etc.)
      if (!MANDATORY_CLASSIFICATIONS.has(binding.classification)) continue;

      // Check if operation appears with [Tool] notation in PHASE TRANSITIONS
      if (!findOperationInPhaseTransitions(phaseSection, binding.operation)) {
        results.fail.push({
          check: 'tool-grounding',
          file: relPath,
          message: `Mandatory binding "${binding.operation} (${binding.classification}) → ${binding.tool}" not found in PHASE TRANSITIONS with [Tool] notation`
        });
      }
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
        } catch {
          // Git commands failed (e.g., index.lock, permissions) — conservative: assume no bump
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
  const VALID_EDGE_TYPES = new Set(['precondition', 'advisory', 'suppression', 'transition']);
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
          // ignore read errors
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
    const sectionPattern = /── (?:\w+ )*TYPES ──([\s\S]*?)(?=──|```)/g;
    let sectionMatch;
    while ((sectionMatch = sectionPattern.exec(content)) !== null) {
      const typesSection = sectionMatch[1];
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
    const phaseMatch = content.match(/── PHASE TRANSITIONS ──([\s\S]*?)(?=──|```)/);
    if (!phaseMatch) return '';
    return phaseMatch[1];
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
// Check 10: Cross-Reference Scan (Protocol Name & Deficit Consistency)
// ============================================================
function checkCrossRefScan() {
  // Canonical protocol names and their deficit → resolution pairs (from CLAUDE.md)
  const CANONICAL_PROTOCOLS = {
    'Prothesis':  { deficit: 'FrameworkAbsent', resolution: 'FramedInquiry' },
    'Syneidesis': { deficit: 'GapUnnoticed', resolution: 'AuditedDecision' },
    'Hermeneia':  { deficit: 'IntentMisarticulated', resolution: 'ClarifiedIntent' },
    'Katalepsis': { deficit: 'ResultUngrasped', resolution: 'VerifiedUnderstanding' },
    'Telos':      { deficit: 'GoalIndeterminate', resolution: 'DefinedEndState' },
    'Aitesis':    { deficit: 'ContextInsufficient', resolution: 'InformedExecution' },
    'Analogia':   { deficit: 'MappingUncertain', resolution: 'ValidatedMapping' },
    'Prosoche':   { deficit: 'ExecutionBlind', resolution: 'SituatedExecution' },
    'Epharmoge':  { deficit: 'ApplicationDecontextualized', resolution: 'ContextualizedExecution' },
  };

  // Edge type allowlist from CLAUDE.md graph.json documentation
  const EDGE_TYPE_ALLOWLIST = new Set(['precondition', 'advisory', 'transition', 'suppression']);

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

  // Sub-check 3: Verify canonical precedence/workflow surfaces include Analogia
  for (const relPath of PRECEDENCE_FILES) {
    const fullPath = path.join(projectRoot, relPath);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes(CANONICAL_PRECEDENCE)) {
      results.fail.push({
        check: 'cross-ref-scan',
        file: relPath,
        message: `Missing canonical precedence chain "${CANONICAL_PRECEDENCE}"`
      });
      subCheckFailed = true;
    }
  }

  for (const relPath of ['README.md', 'README_ko.md']) {
    const fullPath = path.join(projectRoot, relPath);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes(CANONICAL_WORKFLOW)) {
      results.fail.push({
        check: 'cross-ref-scan',
        file: relPath,
        message: `Missing canonical workflow "${CANONICAL_WORKFLOW}"`
      });
      subCheckFailed = true;
    }
  }

  const claudeRequirements = [
    {
      pattern: /Multi-activation order: \*\*Clarify → Goal → Inquire → Frame → Ground → Gap → Attend → Contextualize → Grasp\*\*/,
      message: 'CLAUDE.md missing canonical workflow ordering with Ground'
    },
    {
      pattern: /Prothesis\s+Analogia\s+Syneidesis/,
      message: 'CLAUDE.md workflow diagram missing Prothesis → Analogia → Syneidesis sequence'
    },
    {
      pattern: /\*\*AI-guided\*\*: AI evaluates condition and guides the process \(Prothesis, Syneidesis, Telos, Aitesis, Analogia, Epharmoge\)/,
      message: 'CLAUDE.md initiator taxonomy missing Analogia in the AI-guided set'
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
    const allPluginDirs = new Set();
    try {
      const entries = fs.readdirSync(projectRoot, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
        const pluginJsonPath = path.join(projectRoot, entry.name, '.claude-plugin', 'plugin.json');
        if (fs.existsSync(pluginJsonPath)) {
          allPluginDirs.add(entry.name);
        }
      }
    } catch (e) {
      results.warn.push({
        check: 'cross-ref-scan',
        file: projectRoot,
        message: `Could not scan plugin directories: ${e.message}`
      });
    }

    // Protocol-only subset (dirs listed in PROTOCOL_FILES)
    const protocolDirs = new Set(PROTOCOL_FILES.map(f => f.split('/')[0]));

    // Non-protocol plugin dirs (utility plugins not expected in protocol-only arrays)
    const utilityDirs = new Set([...allPluginDirs].filter(d => !protocolDirs.has(d)));

    // Source 1: PROTOCOL_FILES dirs
    for (const dir of allPluginDirs) {
      if (utilityDirs.has(dir)) continue; // utility plugins not expected in PROTOCOL_FILES
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
      if (!canonicalDirs.has(dir)) {
        results.warn.push({
          check: 'cross-ref-scan',
          file: 'static-checks.js',
          message: `Protocol directory "${dir}" exists on filesystem but missing from CANONICAL_PROTOCOLS`
        });
      }
    }

    // Source 3: package.js PLUGINS (extract dir names by parsing the file)
    const packageJsPath = path.join(projectRoot, 'scripts', 'package.js');
    let packagePluginDirs = new Set();
    if (fs.existsSync(packageJsPath)) {
      try {
        const packageContent = fs.readFileSync(packageJsPath, 'utf8');
        // Extract dir values from PLUGINS array: { dir: 'name', ... }
        const dirMatches = packageContent.matchAll(/dir:\s*'([^']+)'/g);
        for (const m of dirMatches) {
          packagePluginDirs.add(m[1]);
        }
      } catch (e) {
        results.warn.push({
          check: 'cross-ref-scan',
          file: 'scripts/package.js',
          message: `Could not parse package.js PLUGINS: ${e.message}`
        });
      }

      // Every filesystem plugin dir should appear in package.js PLUGINS
      for (const dir of allPluginDirs) {
        if (!packagePluginDirs.has(dir)) {
          results.warn.push({
            check: 'cross-ref-scan',
            file: 'scripts/package.js',
            message: `Plugin directory "${dir}" exists on filesystem but missing from PLUGINS array`
          });
        }
      }
      // Every package.js PLUGINS dir should exist on filesystem
      for (const dir of packagePluginDirs) {
        if (!allPluginDirs.has(dir)) {
          results.warn.push({
            check: 'cross-ref-scan',
            file: 'scripts/package.js',
            message: `PLUGINS entry "${dir}" has no corresponding plugin directory on filesystem`
          });
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
          if (!EDGE_TYPE_ALLOWLIST.has(edgeType)) {
            results.fail.push({
              check: 'cross-ref-scan',
              file: 'graph.json',
              message: `Edge type "${edgeType}" not in CLAUDE.md allowlist: ${[...EDGE_TYPE_ALLOWLIST].join(', ')}`
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
      // JSON parse errors already reported by checkGraphIntegrity
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
          message: `Missing "/${command}" in workflow diagram`
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
  checkCrossRefScan();
  checkOnboardSync();

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
