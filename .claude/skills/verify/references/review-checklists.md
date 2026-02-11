# Expert Review Checklists

Checklists for LLM-based expert review via Task subagents.

## Type Theory / Category Theory Perspective

### Prompt Template

```
You are a **Type Theory and Category Theory Expert**.

Analyze the protocol definitions for mathematical soundness.

**Files to examine**:
- prothesis/skills/mission/SKILL.md (Definition section)
- syneidesis/skills/gap/SKILL.md (Definition section)
- hermeneia/skills/clarify/SKILL.md (Definition section)
- katalepsis/skills/grasp/SKILL.md (Definition section)

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
- prothesis/skills/mission/SKILL.md (Mode Activation, Priority sections)
- syneidesis/skills/gap/SKILL.md (Mode Activation, Priority sections)
- hermeneia/skills/clarify/SKILL.md (Mode Activation, Priority sections)
- katalepsis/skills/grasp/SKILL.md (Mode Activation, Priority sections)
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

## Claude Code Ecosystem Perspective

### Prompt Template

```
You are a **Claude Code Ecosystem Expert**.

Validate protocol designs against Claude Code interaction patterns and epistemic principles.

**Files to examine**:
- prothesis/skills/mission/SKILL.md (Mode Activation, Rules sections)
- syneidesis/skills/gap/SKILL.md (Mode Activation, Rules sections)
- hermeneia/skills/clarify/SKILL.md (Mode Activation, Rules sections)
- katalepsis/skills/grasp/SKILL.md (Mode Activation, Rules sections)
- CLAUDE.md (Project Overview, Core Principles)

**Checklist**:

#### UX Pattern Validation
- [ ] AskUserQuestion mandates: protocols requiring user input use tool call, not text presentation
- [ ] User agency preserved: no automatic decisions that should be user choices
- [ ] Recognition over Recall: options presented, not open questions
- [ ] Session persistence: mode state managed correctly (active until deactivation trigger)

#### Epistemological Soundness
- [ ] Correct epistemic type signature declared:
  - Prothesis: FrameworkAbsent → FramedInquiry (AI-detected, SELECT)
  - Syneidesis: GapUnnoticed → AuditedDecision (AI-detected, SURFACE)
  - Hermeneia: IntentMisarticulated → ClarifiedIntent (User-initiated, EXTRACT)
  - Katalepsis: ResultUngrasped → VerifiedUnderstanding (User-initiated, VERIFY)
  - Reflexion: KnowledgeTacit → PersistedKnowledge (User-invoked, CRYSTALLIZE)
  - Write: InsightInternal → ExternalizedKnowledge (User-invoked, EXTERNALIZE)
- [ ] Initiator correctly specified (AI-detected vs User-initiated vs User-invoked)
- [ ] Gap taxonomy matches protocol purpose

#### False Positive Filtering
When other experts flag these as issues, they should be filtered (not actual issues in Claude Code context):
- [ ] "Automatic intensity reduction" — unnecessary; AskUserQuestion provides user control
- [ ] "Automatic deactivation" — unnecessary; user can interrupt/cancel natively (Esc)
- [ ] "Decay function" — unnecessary; explicit deactivation triggers sufficient
- [ ] "Topic boundary detection" — context-dependent; model judgment acceptable
- [ ] "Exhaustive deactivation triggers" — Claude Code native interruption handles edge cases

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
  "filtered": [
    {
      "original_finding": "description from other expert",
      "filter_reason": "why this is not an issue in Claude Code context"
    }
  ],
  "summary": "overall assessment"
}
```
```

### Known Issues to Check

| Pattern | Expected Behavior | Violation |
|---------|------------------|-----------|
| AskUserQuestion mandate | Tool call in Phase 1/2 | Text-only presentation |
| Epistemic transition | Match protocol definition | Misaligned transition type in CLAUDE.md |
| User-initiated protocol | Hermeneia activates on user signal only | AI auto-activation |
| Intent accessibility | Hermeneia uses Î (inferred), not I (actual) | Direct access to user intent |

## Synthesis Template

After all three perspectives complete, synthesize findings:

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

### Filtered (Claude Code context)
[Issues from Type/Instruction experts dismissed by Ecosystem expert]

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
    files: ['prothesis/skills/mission/SKILL.md', 'syneidesis/skills/gap/SKILL.md', 'hermeneia/skills/clarify/SKILL.md']
  },
  {
    name: 'instruction-design',
    prompt: INSTRUCTION_DESIGN_PROMPT,
    files: ['prothesis/skills/mission/SKILL.md', 'syneidesis/skills/gap/SKILL.md', 'hermeneia/skills/clarify/SKILL.md', 'CLAUDE.md']
  },
  {
    name: 'claude-code-ecosystem',
    prompt: CLAUDE_CODE_ECOSYSTEM_PROMPT,
    files: ['prothesis/skills/mission/SKILL.md', 'syneidesis/skills/gap/SKILL.md', 'hermeneia/skills/clarify/SKILL.md', 'CLAUDE.md']
  }
];

// Spawn all perspectives in parallel
const results = await Promise.all(
  perspectives.map(p => spawnSubagent(p))
);

// Apply Claude Code ecosystem filtering
const ecosystemResult = results.find(r => r.name === 'claude-code-ecosystem');
const filteredFindings = applyFilters(results, ecosystemResult.filtered);

// Synthesize findings
const synthesis = synthesize(filteredFindings);
```
