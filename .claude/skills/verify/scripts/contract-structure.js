/**
 * Contract-structure layer (provisional): text checks over the structure of a
 * protocol's Definition block — its grounding entries, its morphism anatomy,
 * its declared types and partitions. Contract structure belongs to Lean
 * declarations, theorems and the audit; a check here stays only until its
 * replacement there rejects the same counterexamples.
 */

const fs = require('fs');
const path = require('path');
const { escapeRegex } = require('./check-context');
const {
  extractAllFormalSections,
  extractFormalSection,
  isLeanDefinition,
  leanDeclarationNames,
} = require('./lean-bridge');

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
// Check: Spec vs Impl Drift Detection
// ============================================================
function checkSpecVsImpl(ctx) {
  const { projectRoot, results, PROTOCOL_FILES } = ctx;
  // Extract type definitions from all TYPES sections of a formal block
  // Matches: ── TYPES ──, and any other section ending in " TYPES ──"
  function extractTypeNames(content) {
    const typeNames = [];
    if (isLeanDefinition(content)) {
      for (const typesSection of extractAllFormalSections(content, 'TYPES')) {
        typeNames.push(...leanDeclarationNames(typesSection));
      }
      return typeNames;
    }
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
      const defLinePattern = isLeanDefinition(content)
        ? new RegExp(`^(?:noncomputable\\s+)?(?:inductive|structure|def|abbrev|opaque|class|theorem)\\s+${escaped}(?![\\w'.]).*$`, 'gm')
        : new RegExp(`^${escaped}\\s+[=∈].*$`, 'gm');
      const formalWithoutOwnDef = formalBlock.replace(defLinePattern, '');
      // Lean resolves `X.f` through dot notation as well (`x.f`, `.f`), so a
      // dotted declaration is also referenced by its last component.
      const dotted = isLeanDefinition(content) && typeName.includes('.')
        ? new RegExp(`\\.${escapeRegex(typeName.split('.').pop())}(?![\\w'])`)
        : null;
      const inFormalCrossRef = new RegExp(escaped, 'i').test(formalWithoutOwnDef)
        || (dotted !== null && dotted.test(formalWithoutOwnDef));

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

// ============================================================
// Check: partition-invariant
// Verify MODE STATE pairwise disjoint partition invariants —
// universe set and partition members exist as MODE STATE fields
// ============================================================
function checkPartitionInvariant(ctx) {
  const { projectRoot, results, PROTOCOL_FILES } = ctx;
  const checkName = 'partition-invariant';
  const invariantPattern = /-- Invariant:\s*(\w+)\s*=\s*(.+?)\s*\(pairwise disjoint\)/;

  for (const relPath of PROTOCOL_FILES) {
    const filePath = path.join(projectRoot, relPath);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf8');
    const protocolName = relPath.split('/')[0];

    // A Lean Definition block states a partition as a proposition the
    // elaborator checks; the `-- Invariant:` line format is the DSL's.
    if (isLeanDefinition(content)) continue;

    // Extract MODE STATE section (from marker to closing ```)
    const modeStateMatch = content.match(/── MODE STATE ──([\s\S]*?)```/);
    if (!modeStateMatch) continue;

    const modeStateSection = modeStateMatch[1];

    // Find invariant line (single-line only; multi-line invariants require regex update)
    const invMatch = modeStateSection.match(invariantPattern);
    if (!invMatch) {
      // A partition cue without a recognized invariant needs format review.
      if (/pairwise disjoint/.test(modeStateSection)) {
        results.warn.push({
          check: checkName,
          file: relPath,
          message: `${protocolName}: MODE STATE contains "pairwise disjoint" but its partition invariant failed to parse — may be multi-line or non-standard format`
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

module.exports = {
  CHECKS: [checkToolGrounding, checkSpecVsImpl, checkMorphismAnatomy, checkPartitionInvariant],
  checkMorphismAnatomy,
  checkPartitionInvariant,
  checkSpecVsImpl,
  checkToolGrounding,
};
