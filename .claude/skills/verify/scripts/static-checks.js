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
const { execSync } = require('child_process');

const projectRoot = process.argv[2] || process.cwd();

const results = { pass: [], fail: [], warn: [] };

// ============================================================
// Check 1: JSON Schema Validation
// ============================================================
function checkJsonSchema() {
  const pluginJsonPaths = [];

  // Find all plugin.json files
  function findPluginJson(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          findPluginJson(fullPath);
        } else if (entry.name === 'plugin.json') {
          pluginJsonPaths.push(fullPath);
        }
      }
    } catch (e) { /* ignore permission errors */ }
  }

  findPluginJson(projectRoot);

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

  const mdFiles = [];

  function findMdFiles(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          findMdFiles(fullPath);
        } else if (entry.name.endsWith('.md')) {
          mdFiles.push(fullPath);
        }
      }
    } catch (e) { /* ignore */ }
  }

  findMdFiles(projectRoot);

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
  const mdFiles = [];

  function findMdFiles(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          findMdFiles(fullPath);
        } else if (entry.name.endsWith('.md')) {
          mdFiles.push(fullPath);
        }
      }
    } catch (e) { /* ignore */ }
  }

  findMdFiles(projectRoot);

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

  // Map CLAUDE.md heading alias → SKILL.md path (canonical source of truth)
  const aliasToSkill = {
    'mission': 'prothesis/skills/mission/SKILL.md',
    'gap': 'syneidesis/skills/gap/SKILL.md',
    'clarify': 'hermeneia/skills/clarify/SKILL.md',
    'grasp': 'katalepsis/skills/grasp/SKILL.md',
    'goal': 'telos/skills/goal/SKILL.md',
  };

  // Extract CLAUDE.md sections: "### Alias (...) — ProtocolName" → "- **Flow**: `...`"
  const aliases = Object.keys(aliasToSkill).map(a => a[0].toUpperCase() + a.slice(1)).join('|');
  const sectionPattern = new RegExp(`###\\s+(${aliases})\\b[\\s\\S]*?-\\s*\\*\\*Flow\\*\\*:\\s*\`([^\`]+)\``, 'g');
  let sectionMatch;
  while ((sectionMatch = sectionPattern.exec(claudeMd)) !== null) {
    const alias = sectionMatch[1].toLowerCase();
    const formula = sectionMatch[2];
    const skillRelPath = aliasToSkill[alias];
    const skillPath = path.join(projectRoot, skillRelPath);

    if (!fs.existsSync(skillPath)) {
      results.fail.push({
        check: 'xref',
        file: 'CLAUDE.md',
        message: `${sectionMatch[1]} SKILL.md not found at ${skillRelPath}`
      });
      continue;
    }

    const content = fs.readFileSync(skillPath, 'utf8');

    // Extract flow formula from SKILL.md
    // Two formats: "── FLOW ──\n<formula>" or first line with → in first code block
    const flowSection = content.match(/── FLOW ──\n([^\n]+)/) ||
                        content.match(/```\n([^\n]*→[^\n]*)\n/);
    if (!flowSection) {
      results.warn.push({
        check: 'xref',
        file: skillRelPath,
        message: `${sectionMatch[1]} SKILL.md has no flow formula in first code block`
      });
      continue;
    }

    // Extract variable symbols from CLAUDE.md flow (e.g., "U → C → P" → ["U","C","P"])
    // Strip parenthesized expressions and loop annotations for symbol extraction
    const formulaSymbols = formula
      .replace(/\([^)]*\)/g, '')        // remove parenthesized parts
      .split(/\s*→\s*/)                 // split on arrows
      .map(s => s.trim())
      .filter(s => s && !s.includes('loop') && !s.includes('check'));

    const skillFlowLine = flowSection[1].replace(/\s+/g, ' ');

    // Check that key symbols from CLAUDE.md formula appear in SKILL.md flow
    const missingSymbols = formulaSymbols.filter(sym => !skillFlowLine.includes(sym));
    if (missingSymbols.length > formulaSymbols.length / 2) {
      results.warn.push({
        check: 'xref',
        file: 'CLAUDE.md',
        message: `${sectionMatch[1]} flow formula may be out of sync with SKILL.md (missing: ${missingSymbols.join(', ')})`
      });
    }
  }

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
  const protocolFiles = [
    'prothesis/skills/mission/SKILL.md',
    'syneidesis/skills/gap/SKILL.md',
    'hermeneia/skills/clarify/SKILL.md',
    'katalepsis/skills/grasp/SKILL.md',
    'telos/skills/goal/SKILL.md',
  ];

  const requiredSections = [
    '## Definition',
    '## Mode Activation',
    '## Protocol',
    '## Rules',
    '── PHASE TRANSITIONS ──',
    '── MODE STATE ──',
  ];

  for (const relPath of protocolFiles) {
    const fullPath = path.join(projectRoot, relPath);
    if (!fs.existsSync(fullPath)) continue;

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
  const protocolFiles = [
    'prothesis/skills/mission/SKILL.md',
    'syneidesis/skills/gap/SKILL.md',
    'hermeneia/skills/clarify/SKILL.md',
    'katalepsis/skills/grasp/SKILL.md',
    'telos/skills/goal/SKILL.md',
  ];

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

  for (const relPath of protocolFiles) {
    const fullPath = path.join(projectRoot, relPath);
    if (!fs.existsSync(fullPath)) continue;

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

    // Parse lines like: "S (extern)     → AskUserQuestion tool"
    // Capture: operation, classification, tool
    // Unicode support: [\w\u0370-\u03FF] matches Greek letters (Λ, Σ, Ω, etc.)
    const bindingPattern = /^([∥]?[\w\u0370-\u03FF]+)\s*\((\w+)\)\s*→\s*(\w+)/gm;
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
    execSync('git rev-parse --is-inside-work-tree', { cwd: projectRoot, stdio: 'pipe' });
  } catch {
    // Not a git repo — silent return
    return;
  }

  // Collect all uncommitted changes (staged + unstaged + untracked)
  let changedFiles;
  try {
    const diffOutput = execSync('git diff HEAD --name-only', { cwd: projectRoot, encoding: 'utf8' }).trim();
    const untrackedOutput = execSync('git ls-files --others --exclude-standard', { cwd: projectRoot, encoding: 'utf8' }).trim();
    changedFiles = [
      ...(diffOutput ? diffOutput.split('\n') : []),
      ...(untrackedOutput ? untrackedOutput.split('\n') : []),
    ];
  } catch {
    // git diff HEAD fails on initial commit (no HEAD) — fall back to staged + untracked only
    try {
      const stagedOutput = execSync('git diff --cached --name-only', { cwd: projectRoot, encoding: 'utf8' }).trim();
      const untrackedOutput = execSync('git ls-files --others --exclude-standard', { cwd: projectRoot, encoding: 'utf8' }).trim();
      changedFiles = [
        ...(stagedOutput ? stagedOutput.split('\n') : []),
        ...(untrackedOutput ? untrackedOutput.split('\n') : []),
      ];
    } catch {
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
    } catch { /* ignore */ }
  }
  findPluginDirs(projectRoot);

  // Group changed files by plugin directory
  for (const [pluginDir, pluginJsonRel] of pluginDirs) {
    const prefix = pluginDir === '.' ? '' : pluginDir + '/';
    const pluginMetaPrefix = prefix + '.claude-plugin/';

    // Content changes = files in this plugin dir, excluding .claude-plugin/ itself
    const contentChanges = changedFiles.filter(f => {
      if (prefix && !f.startsWith(prefix)) return false;
      if (!prefix && f.includes('/') && ![...pluginDirs.keys()].every(d => d === '.' || !f.startsWith(d + '/'))) return false;
      if (f.startsWith(pluginMetaPrefix)) return false;
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
        const diffResult = execSync(`git diff HEAD -- "${pluginJsonRel}"`, { cwd: projectRoot, encoding: 'utf8' });
        if (/^\+\s*"version":/m.test(diffResult)) {
          versionBumped = true;
        }
      } catch {
        // If diff fails (e.g., untracked file), check if file is untracked (new plugin)
        const untrackedOutput = execSync('git ls-files --others --exclude-standard', { cwd: projectRoot, encoding: 'utf8' }).trim();
        if (untrackedOutput.split('\n').includes(pluginJsonRel)) {
          versionBumped = true; // New plugin — initial version is set
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
    }
  }

  results.pass.push({
    check: 'version-staleness',
    file: 'all plugins',
    message: 'Version staleness check completed'
  });
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
