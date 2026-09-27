/**
 * Contract-structure layer (provisional): text checks over the structure of a
 * protocol's Definition block — its grounding entries and its morphism
 * anatomy. Contract structure belongs to Lean declarations, theorems and the
 * audit; a check here stays only until its replacement there rejects the same
 * counterexamples.
 */

const fs = require('fs');
const path = require('path');
const { escapeRegex } = require('./check-context');
const { extractFormalSection, isLeanDefinition } = require('./lean-bridge');

// ============================================================
// Check: Tool Grounding Consistency
// ============================================================
function checkToolGrounding(ctx) {
  const { projectRoot, results, PROTOCOL_FILES } = ctx;

  // Only mandatory classifications require [Tool] notation in PHASE TRANSITIONS
  const MANDATORY_CLASSIFICATIONS = new Set(['dispatch']);

  // Valid interaction and operation annotations (TOOL GROUNDING vocabulary)
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
    const lean = isLeanDefinition(content);

    // Lean notation: each entry is one arm of the grounding function,
    //   | .op => (.annotation, "Tool: description")
    // so operation, classification, and tool are read from that arm.
    const leanBindingPattern = /^\s*\|\s*\.([\w']+)\s*=>\s*\(\.(\w+),\s*"(\w+)/gm;

    // Parse lines like: "S (extern) → ..." or "Phase 4a Δ (detect) → ..."
    // Capture: operation, qualifier (optional), classification, tool
    // Supports: Phase prefix, qualifier word (e.g., "Qc", "Qᵣs"), Greek letters, ?'/
    const bindingPattern = /^(?:Phase\s+\S+\s+)?([∥]?[\w\u0370-\u03FF?'\/]+)(?:\s+([\w\u0370-\u03FFᵣ]+))?\s*\((\w+)\)\s*→\s*(\w+)/gm;
    let match;
    if (lean) {
      while ((match = leanBindingPattern.exec(groundingSection)) !== null) {
        toolBindings.push({
          operation: match[1],
          qualifier: null,
          classification: match[2],
          tool: match[3]
        });
      }
    }
    while (!lean && (match = bindingPattern.exec(groundingSection)) !== null) {
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

    // Lean notation carries no [Tool] suffix: a mandatory binding is wired when
    // PHASE TRANSITIONS names its operation constructor.
    if (lean) {
      for (const binding of toolBindings) {
        if (!MANDATORY_CLASSIFICATIONS.has(binding.classification)) continue;
        if (!new RegExp(`\\.${escapeRegex(binding.operation)}\\b`).test(phaseSection)) {
          results.fail.push({
            check: 'tool-grounding',
            file: relPath,
            message: `Mandatory binding ".${binding.operation} (${binding.classification})" not named in PHASE TRANSITIONS`
          });
        }
      }
    }

    for (const binding of toolBindings) {
      if (lean) break;
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
    const convergeClassified = lean
      ? toolBindings.some(b => b.operation === 'converge' && ['extension', 'constitution'].includes(b.classification))
      : /\bconverge\s*\((extension|constitution)\)/i.test(groundingSection);
    if (!convergeClassified) {
      results.warn.push({
        check: 'tool-grounding',
        file: relPath,
        message: 'Convergence behavior not explicitly classified in TOOL GROUNDING — add converge entry with (extension) or (constitution) annotation'
      });
    }

    // Check 6g: Verify each annotated entry's realization agrees with this file's
    // own Realization header. The header binds interaction kind → realization
    // (Constitution → TextPresent+Stop; Extension → TextPresent+Proceed); an entry
    // that states a realization contradicting that binding is a contradiction
    // internal to the artifact, so the verdict follows mechanically from the file.
    if (realizationLine) {
      const headerText = realizationLine[0];
      const axis = new Map();
      for (const m of headerText.matchAll(/(Constitution|Extension)\s*→\s*TextPresent\+(\w+)/gi)) {
        axis.set(m[1].toLowerCase(), m[2]);
      }
      if (axis.size > 0) {
        for (const rawLine of groundingSection.split('\n')) {
          if (rawLine.includes('-- Realization:')) continue;
          const entryPattern = lean
            ? /\(\.(constitution|extension),\s*"TextPresent\+(\w+)/gi
            : /\((constitution|extension)\)[^→]*→\s*TextPresent\+(\w+)/gi;
          for (const entry of rawLine.matchAll(entryPattern)) {
            const kind = entry[1].toLowerCase();
            const expected = axis.get(kind);
            if (expected && entry[2].toLowerCase() !== expected.toLowerCase()) {
              results.fail.push({
                check: 'tool-grounding',
                file: relPath,
                message: `Realization axis violation: an entry marked (${kind}) realizes as TextPresent+${entry[2]}, but this file's own Realization header binds ${kind} → TextPresent+${expected}`
              });
            }
          }
        }
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
  CHECKS: [checkToolGrounding, checkMorphismAnatomy],
  checkMorphismAnatomy,
  checkToolGrounding,
};
