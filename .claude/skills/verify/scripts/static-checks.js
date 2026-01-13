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

  // Extract flow formulas from CLAUDE.md
  const flowMatches = claudeMd.matchAll(/Flow:\s*`([^`]+)`/g);

  for (const match of flowMatches) {
    const formula = match[1];

    // Check if corresponding protocol file exists and contains matching formula
    if (formula.includes('Prothesis')) {
      const prothesisPath = path.join(projectRoot, 'prothesis/commands/prothesis.md');
      if (fs.existsSync(prothesisPath)) {
        const content = fs.readFileSync(prothesisPath, 'utf8');
        // Normalize whitespace for comparison
        const normalizedFormula = formula.replace(/\s+/g, ' ').trim();
        const normalizedContent = content.replace(/\s+/g, ' ');

        if (!normalizedContent.includes(normalizedFormula.substring(0, 30))) {
          results.warn.push({
            check: 'xref',
            file: 'CLAUDE.md',
            message: 'Prothesis flow formula may be out of sync with source'
          });
        }
      }
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
    'prothesis/skills/prothesis/SKILL.md',
    'syneidesis/skills/syneidesis/SKILL.md',
    'hermeneia/skills/hermeneia/SKILL.md',
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
// Run All Checks
// ============================================================
try {
  checkJsonSchema();
  checkNotation();
  checkDirectiveVerb();
  checkCrossReference();
  checkRequiredSections();

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
