/**
 * Contract-structure layer (provisional): text checks over the structure of a
 * protocol's Definition block — its morphism anatomy. Contract structure
 * belongs to Lean declarations, theorems and the audit; a check here stays
 * only until its replacement there rejects the same counterexamples.
 */

const fs = require('fs');
const path = require('path');
const { extractFormalSection } = require('./lean-bridge');

// ============================================================
// Check: Morphism Anatomy
// ============================================================
function checkMorphismAnatomy(ctx) {
  const { projectRoot, results, PROTOCOL_FILES, CANONICAL_PROTOCOLS } = ctx;
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

module.exports = {
  CHECKS: [checkMorphismAnatomy],
  checkMorphismAnatomy,
};
