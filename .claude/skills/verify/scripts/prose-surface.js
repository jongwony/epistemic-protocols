/**
 * Prose-surface layer: lexical checks over Markdown prose and the packaged
 * runtime view — notation, directive verbs, language purity, retired-vocabulary
 * guards, runtime self-containment, and the literal coverage of the emit-load
 * and framing-readout disciplines. Whether the prose says the right thing is
 * review's; these checks hold only the literal obligations they name.
 */

const fs = require('fs');
const path = require('path');
const { runArtifactSelfContainmentCheck } = require('./artifact-self-containment');
const { runLanguagePurityCheck } = require('./language-purity');

// ============================================================
// Check: Unicode Notation Consistency
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

function checkNotation(ctx) {
  const { projectRoot, results, walkFiles } = ctx;
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

  // Track this check's own warnings against the shared array so `pass` can't
  // assert a clean result while violations were actually found below.
  const warnCountBefore = results.warn.length;

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

  if (results.warn.length === warnCountBefore) {
    results.pass.push({
      check: 'notation',
      file: 'all .md files',
      message: 'Notation is consistent across all scanned .md files'
    });
  }
}

// ============================================================
// Check: Directive Verb Consistency
// ============================================================
function checkDirectiveVerb(ctx) {
  const { projectRoot, results, walkFiles } = ctx;
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

function checkArtifactSelfContainment(ctx) {
  const { results } = ctx;
  const artifactResults = runArtifactSelfContainmentCheck();
  results.pass.push(...artifactResults.pass);
  results.fail.push(...artifactResults.fail);
  results.warn.push(...artifactResults.warn);
}

function checkLanguagePurity(ctx) {
  const { projectRoot, results } = ctx;
  const purityResults = runLanguagePurityCheck({ projectRoot });
  results.pass.push(...purityResults.pass);
  results.fail.push(...purityResults.fail);
  results.warn.push(...purityResults.warn);
}

// ============================================================
// Check: Emit Load Discipline
// ============================================================
// Enforces the presence of the user-facing disciplines that shape
// runtime protocol output. Round composition folds placement (context before
// the gate, not inside it), vocabulary (plain rendering held across the
// session), and per-round adjacency/context-switch cost into one inline rule,
// with the occasion-bound detail moved to each skill's own
// references/round-composition.md; Form feedback handles how a round's
// density is set and stays a separate rule. These must live in each core
// protocol SKILL.md's Rules section because packaged runtime contracts cannot
// depend on contributor docs or an output style, so the labels are searched
// there and nowhere else in the file.

// The body of the `## Rules` section: from its heading to the next H2, with
// fenced code skipped so a `## ` line inside a fence neither ends the section
// nor opens one. Null when the file has no such section.
function rulesSection(content) {
  const lines = content.split('\n');
  let inFence = false;
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*```/.test(lines[i])) inFence = !inFence;
    if (inFence) continue;
    if (start === -1) {
      if (/^## Rules[ \t]*$/.test(lines[i])) start = i + 1;
    } else if (/^## /.test(lines[i])) {
      return lines.slice(start, i).join('\n');
    }
  }
  return start === -1 ? null : lines.slice(start).join('\n');
}

function checkEmitLoadDiscipline(ctx) {
  const { projectRoot, results, protocolInputs } = ctx;
  const REQUIRED_RULES = [
    { label: 'Round composition', pattern: /\*\*Round composition\*\*/ },
    { label: 'Form feedback', pattern: /\*\*Form feedback\*\*/ },
  ];

  let checked = 0;
  for (const relPath of protocolInputs('emit-load-discipline')) {
    checked++;
    const rules = rulesSection(fs.readFileSync(path.join(projectRoot, relPath), 'utf8'));
    if (rules === null) {
      results.fail.push({
        check: 'emit-load-discipline',
        file: relPath,
        message: 'Missing "## Rules" section — the user-facing emit load rules have no section to live in',
      });
      continue;
    }
    for (const rule of REQUIRED_RULES) {
      if (!rule.pattern.test(rules)) {
        results.fail.push({
          check: 'emit-load-discipline',
          file: relPath,
          message: `Missing user-facing emit load rule in ## Rules: ${rule.label}`,
        });
      }
    }
  }

  if (!results.fail.some(f => f.check === 'emit-load-discipline')) {
    results.pass.push({
      check: 'emit-load-discipline',
      file: 'all core protocol SKILL.md files',
      message: `Emit load discipline rule coverage verified for ${checked} protocols`,
    });
  }
}

// ============================================================
// Check: Framing-Readout Enforcement (progress-glyph ban)
// ============================================================
// Couples the invariant that user-facing protocol surfacing is a framing
// readout of the work in play, not a progress meter, to an enforcement
// channel over the core protocol SKILL.md files. The glyph denylist is scoped
// by decision, not by what a file category could establish about a glyph's
// meaning: utility skills may legitimately render bars and are out of it, and
// the scope otherwise mirrors checkEmitLoadDiscipline. Why a guard exists here
// at all: references/verification.md, framing-readout-enforcement.
function checkFramingReadoutEnforcement(ctx) {
  const { projectRoot, results, protocolInputs } = ctx;
  const BAR_GLYPH = /[▓░]/;
  const CHECK = 'framing-readout-enforcement';
  let checked = 0;

  for (const relPath of protocolInputs(CHECK)) {
    const fullPath = path.join(projectRoot, relPath);
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

  if (!results.fail.some(f => f.check === CHECK)) {
    results.pass.push({
      check: CHECK,
      file: 'all core protocol SKILL.md files',
      message: `Framing-readout enforcement verified for ${checked} protocols (no progress-bar glyph)`,
    });
  }
}

// ============================================================
// Check: Single-Axis Soundness
// ============================================================
// Enforces the unified Constitution/Extension annotation axis in TOOL GROUNDING.
// Live SKILL.md / rule / doc files must not contain the obsolete dual-axis vocabulary
// (`── ELIDABLE CHECKPOINTS ──` section header, `always_gated`, or `elidable` as annotation tokens).
// Historical analysis docs and audit reports keep their pre-unification references.
function checkSingleAxisSoundness(ctx) {
  const { results } = ctx;
  const BANNED_PATTERNS = [
    { pattern: /── ELIDABLE CHECKPOINTS ──/i, label: '── ELIDABLE CHECKPOINTS ── section header' },
    { pattern: /\balways_gated\b/i, label: '`always_gated` annotation token' },
    { pattern: /\belidable\b/i, label: '`elidable` annotation token' }
  ];

  const SKIP_PATTERNS = [
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

module.exports = {
  CHECKS: [checkNotation, checkDirectiveVerb, checkArtifactSelfContainment, checkLanguagePurity, checkEmitLoadDiscipline, checkFramingReadoutEnforcement, checkSingleAxisSoundness],
  checkArtifactSelfContainment,
  checkDirectiveVerb,
  checkEmitLoadDiscipline,
  checkFramingReadoutEnforcement,
  checkLanguagePurity,
  checkNotation,
  checkSingleAxisSoundness,
};
