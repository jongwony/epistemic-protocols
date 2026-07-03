# Expert Review Checklists

Checklists for LLM-based expert review via Task subagents.

## Type Theory / Category Theory Perspective

### Prompt Template

```
You are a **Type Theory and Category Theory Expert**.

Analyze the protocol definitions for mathematical soundness.

**Files to examine**: the protocols changed in the current diff (fall back to a representative sample when the diff is not protocol-scoped), Definition section of each

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

## Instruction Design Perspective

### Prompt Template

```
You are an **Instruction Design Expert**.

Analyze the protocol instructions for consistency and completeness.

**Files to examine**: the protocols changed in the current diff (fall back to a representative sample when the diff is not protocol-scoped), Mode Activation and Priority sections of each, plus `.claude/rules/axioms.md`

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

## Claude Code Ecosystem Perspective

### Prompt Template

```
You are a **Claude Code Ecosystem Expert**.

Validate protocol designs against Claude Code interaction patterns and epistemic principles.

**Files to examine**: the protocols changed in the current diff (fall back to a representative sample when the diff is not protocol-scoped), Mode Activation and Rules sections of each, plus CLAUDE.md (Northstar) and `.claude/rules/axioms.md`

**Checklist**:

#### UX Pattern Validation
- [ ] Gate mandates: protocols requiring user input use structured interaction (Qc/Qs + turn yield), not unstructured text bypass
- [ ] User agency preserved: no automatic decisions that should be user choices
- [ ] Recognition over Recall: options presented, not open questions
- [ ] Session persistence: mode state managed correctly (active until deactivation trigger)

#### Epistemological Soundness
- [ ] Correct epistemic type signature declared:
  - Prothesis: FrameworkAbsent → FramedInquiry (AI-guided, DESIGN)
  - Syneidesis: GapUnnoticed → AuditedDecision (AI-guided, SURFACE)
  - Horismos: (BoundaryUndefined, AI, DEFINE, TaskScope) → DefinedBoundary
  - Aitesis: ContextInsufficient → InformedExecution (AI-guided, INFER)
  - Analogia: MappingUncertain → ValidatedMapping (AI-guided, VALIDATE)
  - Periagoge: AbstractionInProcess → CrystallizedAbstraction (AI-guided, CRYSTALLIZE)
  - Euporia: AbstractAporia → ResolvedEndpoint (Hybrid, REVERSE-INDUCE)
  - Epharmoge: ApplicationDecontextualized → ContextualizedExecution (AI-guided, CONTEXTUALIZE)
  - Elenchus: ContextSuspect → VettedContext (User-initiated, VET)
  - Diylisis: ContextTethered → PortableHandoff (AI-guided, DISTILL)
  - Prosoche: ExecutionBlind → SituatedExecution (User-initiated, EVALUATE)
  - Anamnesis: RecallAmbiguous → RecalledContext (AI-guided, RECOGNIZE)
  - Katalepsis: ResultUngrasped → VerifiedUnderstanding (User-initiated, VERIFY)
  - Write: InsightInternal → ExternalizedKnowledge (User-invoked, EXTERNALIZE)
- [ ] Initiator correctly specified (AI-guided vs Hybrid vs User-initiated vs User-invoked)
- [ ] Gap taxonomy matches protocol purpose

#### False Positive Filtering
When other experts flag these as issues, they should be filtered (not actual issues in Claude Code context):
- [ ] "Automatic intensity reduction" — unnecessary; gate interaction provides user control
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
| Gate mandate | Structured presentation + turn yield in Phase 1/2 | Unstructured text bypass |
| Epistemic transition | Match protocol definition | Misaligned transition type in CLAUDE.md |
| Hybrid protocol | Euporia activates on user signal or with confirmation when AI-detected | Unconfirmed AI auto-activation |

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
    files: ['prothesis/skills/frame/SKILL.md', 'syneidesis/skills/gap/SKILL.md', 'horismos/skills/bound/SKILL.md']
  },
  {
    name: 'instruction-design',
    prompt: INSTRUCTION_DESIGN_PROMPT,
    files: ['prothesis/skills/frame/SKILL.md', 'syneidesis/skills/gap/SKILL.md', 'horismos/skills/bound/SKILL.md', 'CLAUDE.md']
  },
  {
    name: 'claude-code-ecosystem',
    prompt: CLAUDE_CODE_ECOSYSTEM_PROMPT,
    files: ['prothesis/skills/frame/SKILL.md', 'syneidesis/skills/gap/SKILL.md', 'horismos/skills/bound/SKILL.md', 'CLAUDE.md']
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
