#!/usr/bin/env node
/**
 * Language purity check: surfaces Korean characters in project text files.
 *
 * Whitelist preserves intentional Korean regions:
 *   - **\/README_ko.md            Korean README localizations
 *   - .claude/skills/release/**   Release notes skill (Korean by purpose)
 *   - src/**                      Landing page i18n
 *   - docs/**                     Repo documentation reports
 *   - .claude/rules/editing-conventions.md  Korean commit convention text
 *
 * Severity: warn (Stage 1 surface posture; fail promotion gated on Stage 2
 * retention evidence). One warn record per file with Korean lines listed.
 *
 * Detection uses charCode range comparison rather than a literal regex pattern
 * so this verifier file remains self-pure under its own check.
 */

const fs = require('fs');
const path = require('path');

// Unicode block U+AC00 through U+D7A3: precomposed Hangul syllables
const HANGUL_START = 0xAC00;
const HANGUL_END = 0xD7A3;

function lineHasHangul(line) {
  for (let i = 0; i < line.length; i++) {
    const c = line.charCodeAt(i);
    if (c >= HANGUL_START && c <= HANGUL_END) return true;
  }
  return false;
}

const WHITELIST_PATTERNS = [
  /(^|\/)README_ko\.md$/,
  /(^|\/)README\.md$/,                    // English README + Korean localization link
  /^\.claude\/skills\/release(\/|$)/,
  /^src(\/|$)/,
  /(^|\/)docs(\/|$)/,                     // repo and per-plugin docs
  /(^|\/)references(\/|$)/,               // plugin contributor references
  /(^|\/)graph\.json$/,                   // satisfies field is Korean by project convention
  /^design(\/|$)/,                        // root design docs
  /^examples(\/|$)/,                      // root examples
  /^\.claude\/rules\/editing-conventions\.md$/,
];

const TEXT_EXTENSIONS = new Set([
  '.md', '.js', '.mjs', '.cjs', '.ts', '.tsx', '.json',
  '.html', '.css', '.sh', '.yml', '.yaml', '.txt',
]);

const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', '.husky']);

function isWhitelisted(relPath) {
  return WHITELIST_PATTERNS.some(p => p.test(relPath));
}

function runLanguagePurityCheck({ projectRoot }) {
  const check = 'language-purity';
  const results = { pass: [], fail: [], warn: [] };
  let scanned = 0;
  let flagged = 0;

  function walk(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        walk(full);
        continue;
      }
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (!TEXT_EXTENSIONS.has(ext)) continue;
      const rel = path.relative(projectRoot, full).replace(/\\/g, '/');
      if (isWhitelisted(rel)) continue;
      scanned++;
      let content;
      try {
        content = fs.readFileSync(full, 'utf8');
      } catch (e) {
        continue;
      }
      const lines = content.split('\n');
      const koreanLines = [];
      for (let i = 0; i < lines.length; i++) {
        if (lineHasHangul(lines[i])) koreanLines.push(i + 1);
      }
      if (koreanLines.length > 0) {
        flagged++;
        const preview = koreanLines.slice(0, 5).join(', ');
        const suffix = koreanLines.length > 5 ? `, ... (${koreanLines.length} total)` : '';
        results.warn.push({
          check,
          file: rel,
          message: `Korean characters at line(s): ${preview}${suffix}`,
        });
      }
    }
  }

  walk(projectRoot);

  if (flagged === 0) {
    results.pass.push({
      check,
      file: '.',
      message: `${scanned} text files scanned; no Korean characters outside whitelist`,
    });
  }

  return results;
}

if (require.main === module) {
  const projectRoot = process.argv[2] || process.cwd();
  console.log(JSON.stringify(runLanguagePurityCheck({ projectRoot }), null, 2));
}

module.exports = { runLanguagePurityCheck };
