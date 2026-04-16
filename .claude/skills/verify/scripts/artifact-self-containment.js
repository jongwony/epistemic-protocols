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

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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

const BANNED_RUNTIME_DEPENDENCIES = [
  { pattern: /\bmission-bridge\.md\b/i, message: 'references mission bridge from runtime contract surface' },
  { pattern: /\baxioms?\.md\b/i, message: 'references axioms doc from runtime contract surface' },
  { pattern: /\bA[1-7]\b/, message: 'references contributor-only axiom identifier from runtime contract surface' },
  { pattern: /(?:^|[\s`(])\.claude\//m, message: 'references .claude contributor path from runtime contract surface' },
  { pattern: /(?:^|[\s`(])docs\//m, message: 'references repo docs path from runtime contract surface' },
];

function checkSurfaceLeaks(text, fileLabel, checkName, bucket) {
  const prose = stripFencedCode(text);
  for (const rule of BANNED_RUNTIME_DEPENDENCIES) {
    const match = prose.match(rule.pattern);
    if (match) {
      bucket.fail.push({
        check: checkName,
        file: fileLabel,
        message: `${rule.message}: "${match[0].trim()}"`
      });
    }
  }
}

function runArtifactSelfContainmentCheck() {
  const check = 'artifact-self-containment';
  const results = { pass: [], fail: [], warn: [] };
  const views = buildRuntimeContractViews();

  for (const view of views) {
    const surfaceLabel = `${view.plugin}:${view.skill}`;
    const entrySet = new Set(view.packagedEntries.map(normalizePosix));

    if (view.skillEntryCount !== 1 || !view.transformedSkillMd || !entrySet.has(view.skillPath)) {
      results.fail.push({
        check,
        file: surfaceLabel,
        message: `runtime contract malformed: expected exactly one packaged Skill.md at ${view.skillPath}`
      });
      continue;
    }

    checkSurfaceLeaks(view.transformedSkillMd, `${surfaceLabel}:Skill.md`, check, results);
    checkSurfaceLeaks(view.pluginDescription, `${surfaceLabel}:plugin-description`, check, results);

    for (const relativeTarget of parseRelativeLinks(view.transformedSkillMd)) {
      const resolved = resolvePackagedTarget(view.skillPath, relativeTarget);
      if (!entrySet.has(resolved)) {
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

    results.pass.push({
      check,
      file: surfaceLabel,
      message: 'runtime contract surface verified'
    });
  }

  return results;
}

if (require.main === module) {
  console.log(JSON.stringify(runArtifactSelfContainmentCheck(), null, 2));
}

module.exports = { runArtifactSelfContainmentCheck };
