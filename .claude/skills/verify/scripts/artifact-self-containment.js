#!/usr/bin/env node
/**
 * Runtime-contract self-containment verification.
 *
 * Checks the actual user-facing contract surface:
 * - transformed Skill.md (packaged runtime contract)
 * - plugin description metadata (discovery/routing layer)
 * - packaged support entry list (relative-link closure)
 */

const path = require('path');
const { buildRuntimeContractViews } = require(path.resolve(__dirname, '../../../../scripts/package.js'));

function stripFencedCode(text) {
  return text.replace(/```[\s\S]*?```/g, '');
}

function stripCodeFromText(text) {
  let result = stripFencedCode(text);
  result = result.replace(/`[^`\n]+`/g, '');
  return result;
}

function isExternalTarget(target) {
  return (
    target.startsWith('#') ||
    target.startsWith('/') ||
    target.startsWith('http://') ||
    target.startsWith('https://') ||
    target.startsWith('mailto:')
  );
}

function stripFragmentAndQuery(target) {
  return target.split('#')[0].split('?')[0];
}

function parseRelativeLinks(markdown) {
  const links = [];
  const prose = stripCodeFromText(markdown);
  const regex = /!?\[[^\]]*\]\(([^)]+)\)/g;
  let match;
  while ((match = regex.exec(prose)) !== null) {
    let target = match[1].trim();
    if (target.includes(' ')) {
      target = target.split(/\s+/)[0];
    }
    target = target.replace(/^<|>$/g, '');
    if (!target || isExternalTarget(target)) continue;
    links.push(target);
  }
  return links;
}

function normalizePosix(p) {
  return p.replace(/\\/g, '/');
}

function resolvePackagedTarget(skillPath, relativeTarget) {
  const baseDir = path.posix.dirname(skillPath);
  return normalizePosix(path.posix.normalize(path.posix.join(baseDir, relativeTarget)));
}

function hasInvocationCue(skillMd, skill) {
  return skillMd.includes(`/${skill}`) || skillMd.includes('Layer 1 (User-invocable)');
}

function hasRoutingCue(description, skill) {
  return description.includes(`/${skill}`) || description.toLowerCase().includes(skill.toLowerCase());
}

// severity defaults to 'fail' for the original strict patterns (already-clean
// invariant). Patterns added during the encapsulation expansion start at 'warn'
// (Stage 1 surface posture); promotion to 'fail' is gated on accumulated
// cleanup of pre-existing leaks.
const BANNED_RUNTIME_DEPENDENCIES = [
  { pattern: /\bmission-bridge\.md\b/gi, message: 'references mission bridge from runtime contract surface', severity: 'fail' },
  { pattern: /\baxioms?\.md\b/gi, message: 'references axioms doc from runtime contract surface', severity: 'fail' },
  { pattern: /\bderived-principles\.md\b/gi, message: 'references derived-principles doc from runtime contract surface', severity: 'fail' },
  { pattern: /\barchitectural-principles\.md\b/gi, message: 'references architectural-principles doc from runtime contract surface', severity: 'fail' },
  { pattern: /\bmeta-principle\.md\b/gi, message: 'references meta-principle doc from runtime contract surface', severity: 'fail' },
  { pattern: /\bsafeguards\.md\b/gi, message: 'references safeguards doc from runtime contract surface', severity: 'fail' },
  { pattern: /\bproject-profile(?:-calibration)?\.md\b/gi, message: 'references project-profile rule from runtime contract surface', severity: 'warn' },
  { pattern: /\bediting-conventions\.md\b/gi, message: 'references editing-conventions rule from runtime contract surface', severity: 'warn' },
  { pattern: /(?<![\w/-])principles\//gm, message: 'references principles directory from runtime contract surface', severity: 'warn' },
  { pattern: /\bA[1-7]\b(?!\.\d)/g, message: 'references contributor-only axiom identifier from runtime contract surface', severity: 'fail' },
  { pattern: /(?<![\w/-])\.claude\//gm, message: 'references .claude contributor path from runtime contract surface', severity: 'fail' },
  { pattern: /(?<![\w/-])docs\//gm, message: 'references repo docs path from runtime contract surface', severity: 'fail' },
  { pattern: /\bStage [12]\b/g, message: 'references Stage 1/2 contributor concept from runtime contract surface', severity: 'warn' },
  { pattern: /\bTier Factorization\b/gi, message: 'references Tier Factorization contributor concept from runtime contract surface', severity: 'warn' },
  { pattern: /\bDeficit Empiricism\b/gi, message: 'references Deficit Empiricism contributor concept from runtime contract surface', severity: 'warn' },
  { pattern: /\bWirkungsgeschichte\b/gi, message: 'references Wirkungsgeschichte contributor concept from runtime contract surface', severity: 'warn' },
  { pattern: /\bHorizontverschmelzung\b/gi, message: 'references Horizontverschmelzung contributor concept from runtime contract surface', severity: 'warn' },
  { pattern: /\bZuhandenheit\b/gi, message: 'references Zuhandenheit contributor concept from runtime contract surface', severity: 'warn' },
];

function checkSurfaceLeaks(text, fileLabel, checkName, bucket) {
  const prose = stripCodeFromText(text);
  let anyFailMatch = false;
  for (const rule of BANNED_RUNTIME_DEPENDENCIES) {
    rule.pattern.lastIndex = 0;
    const matches = [...prose.matchAll(rule.pattern)];
    if (matches.length > 0) {
      const severity = rule.severity || 'fail';
      if (!bucket[severity]) {
        throw new Error(`[artifact-self-containment] unknown severity "${severity}" on rule: ${rule.message}`);
      }
      if (severity === 'fail') anyFailMatch = true;
      bucket[severity].push({
        check: checkName,
        file: fileLabel,
        message: `${rule.message}: ${matches.map(m => `"${m[0].trim()}"`).join(', ')} (${matches.length} occurrence${matches.length > 1 ? 's' : ''})`
      });
    }
  }
  return anyFailMatch;
}

function runArtifactSelfContainmentCheck() {
  const check = 'artifact-self-containment';
  const results = { pass: [], fail: [], warn: [] };
  const views = buildRuntimeContractViews();

  for (const view of views) {
    const surfaceLabel = `${view.plugin}:${view.skill}`;
    const entrySet = new Set(view.packagedEntries.map(normalizePosix));
    let hadFailure = false;

    if (view.skillEntryCount !== 1 || !view.transformedSkillMd || !entrySet.has(view.skillPath)) {
      results.fail.push({
        check,
        file: surfaceLabel,
        message: `runtime contract malformed: expected exactly one packaged Skill.md at ${view.skillPath}`
      });
      continue;
    }

    if (checkSurfaceLeaks(view.transformedSkillMd, `${surfaceLabel}:Skill.md`, check, results)) {
      hadFailure = true;
    }
    if (checkSurfaceLeaks(view.pluginDescription, `${surfaceLabel}:plugin-description`, check, results)) {
      hadFailure = true;
    }

    for (const relativeTarget of parseRelativeLinks(view.transformedSkillMd)) {
      const pathOnly = stripFragmentAndQuery(relativeTarget);
      if (!pathOnly) continue;
      const resolved = resolvePackagedTarget(view.skillPath, pathOnly);
      if (!entrySet.has(resolved)) {
        hadFailure = true;
        results.fail.push({
          check,
          file: `${surfaceLabel}:Skill.md`,
          message: `relative link escapes packaged runtime surface: "${relativeTarget}" → "${resolved}"`
        });
      }
    }

    if (!hasInvocationCue(view.transformedSkillMd, view.skill)) {
      results.warn.push({
        check,
        file: `${surfaceLabel}:Skill.md`,
        message: 'runtime Skill.md lacks an explicit Layer 1 invocation cue (/command or Layer 1 user-invocable wording)'
      });
    }

    if (!hasRoutingCue(view.pluginDescription, view.skill)) {
      results.warn.push({
        check,
        file: `${surfaceLabel}:plugin-description`,
        message: 'plugin description metadata lacks a clear routing cue for this skill'
      });
    }

    if (!hadFailure) {
      results.pass.push({
        check,
        file: surfaceLabel,
        message: 'runtime contract surface verified'
      });
    }
  }

  return results;
}

if (require.main === module) {
  console.log(JSON.stringify(runArtifactSelfContainmentCheck(), null, 2));
}

module.exports = { runArtifactSelfContainmentCheck };
