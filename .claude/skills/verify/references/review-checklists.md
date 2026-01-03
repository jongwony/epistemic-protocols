# Expert Review Checklists

Checklists for LLM-based expert review via Task subagents.

## Type Theory / Category Theory Perspective

### Prompt Template

```
You are a **Type Theory and Category Theory Expert**.

Analyze the protocol definitions for mathematical soundness.

**Files to examine**:
- prothesis/commands/prothesis.md (Definition section)
- syneidesis/commands/syneidesis.md (Definition section)

**Checklist**:

#### Type-Level Checks
- [ ] All functions have explicit domain/codomain
- [ ] Dependent types are clearly marked
- [ ] Refinement constraints are enforceable
- [ ] Product/sum types are correctly distinguished

#### Categorical Checks
- [ ] Limit/colimit applied to correct diagram shapes
- [ ] Stated semantics match categorical interpretation
- [ ] Morphism structure specified where needed

#### State Machine Checks
- [ ] All transitions are total (no undefined inputs)
- [ ] Blocking states are explicitly marked
- [ ] Terminal states are defined

**Output format**:
```json
{
  "findings": [
    {
      "severity": "critical|concern|note",
      "location": "file:line",
      "issue": "description",
      "recommendation": "suggested fix"
    }
  ],
  "summary": "overall assessment"
}
```
```

### Known Issues to Check

| Issue | Location | Expected Fix |
|-------|----------|--------------|
| limit/colimit semantics | prothesis.md:35-37 | Replace with lattice meet/join |
| Undefined failure case | prothesis.md:10 | Add `\|perspectives(C)\| < 2` fallback |
| Empty scan undefined | syneidesis.md | Add empty result handling |

## Instruction Design Perspective

### Prompt Template

```
You are an **Instruction Design Expert**.

Analyze the protocol instructions for consistency and completeness.

**Files to examine**:
- prothesis/commands/prothesis.md (Mode Activation, Priority sections)
- syneidesis/commands/syneidesis.md (Mode Activation, Priority sections)
- CLAUDE.md (Core Principles)

**Checklist**:

#### Priority Conflict Detection
- [ ] Supersession declarations target different domains
- [ ] Retained sets are consistent across protocols
- [ ] No circular dependencies in priority rules

#### Mode Interaction Coherence
- [ ] Dual-mode activation has defined precedence
- [ ] Deactivation triggers are exhaustive
- [ ] No race conditions in mode transitions

#### Rule Completeness
- [ ] All decision branches specified
- [ ] Edge cases have explicit handling
- [ ] Per-message evaluation rules are deterministic

#### Cross-Reference Validity
- [ ] Plan Mode Integration sections reference each other consistently
- [ ] Core principles have implementations in both protocols
- [ ] Tool call mandates are enforced

**Output format**:
```json
{
  "findings": [
    {
      "severity": "critical|concern|note",
      "location": "file:section",
      "issue": "description",
      "recommendation": "suggested fix"
    }
  ],
  "summary": "overall assessment"
}
```
```

### Known Issues to Check

| Issue | Location | Expected Fix |
|-------|----------|--------------|
| Retained set asymmetry | Both Priority sections | Unify safety baseline |
| Dual-mode precedence | prothesis.md:60 | Add explicit ordering clause |
| Follow-up perspective shift | prothesis.md:70-71 | Add handling for related-but-different |

## Synthesis Template

After both perspectives complete, synthesize findings:

```markdown
## Verification Summary

### Critical Findings
[Issues that should be addressed before commit]

### Concerns
[Issues worth reviewing, user discretion]

### Notes
[Informational observations]

### Convergence
[Where both perspectives agree - high confidence]

### Divergence
[Where perspectives differ - needs judgment]

### Recommendation
[Synthesized assessment with options]
```

## Subagent Spawn Pattern

```javascript
// Parallel spawn pattern for LLM review
const perspectives = [
  {
    name: 'type-category-theory',
    prompt: TYPE_THEORY_PROMPT,
    files: ['prothesis/commands/prothesis.md', 'syneidesis/commands/syneidesis.md']
  },
  {
    name: 'instruction-design',
    prompt: INSTRUCTION_DESIGN_PROMPT,
    files: ['prothesis/commands/prothesis.md', 'syneidesis/commands/syneidesis.md', 'CLAUDE.md']
  }
];

// Spawn all perspectives in parallel
const results = await Promise.all(
  perspectives.map(p => spawnSubagent(p))
);

// Synthesize findings
const synthesis = synthesize(results);
```
