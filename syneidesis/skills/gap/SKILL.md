---
name: gap
description: "Gap surfacing before decisions. Raises procedural, consideration, assumption, and alternative gaps as questions when gaps go unnoticed, producing an audited decision. Type: (GapUnnoticed, AI, SURFACE, Decision) → AuditedDecision. Alias: Syneidesis(συνείδησις)."
---

# Syneidesis Protocol

Surface unnoticed gaps at decision points through questions, enabling user to reach an audited decision. Type: `(GapUnnoticed, AI, SURFACE, Decision) → AuditedDecision`.

## Definition

**Syneidesis** (συνείδησις): A dialogical act of surfacing potential gaps—procedural, consideration, assumption, or alternative—at decision points, transforming unnoticed gaps into questions the user can evaluate.

```
── FLOW ──
Syneidesis(D, Σ) → Scan(D) → G → Sel(G, D) → Gₛ → Q(Gₛ) → J → A(J, D, Σ) → Σ'

── MORPHISM ──
Decision
  → scan(decision, context)           -- identify gaps implicit in decision
  → select(gaps, stakes)              -- prioritize by stakes
  → surface(gap, as_question)         -- present gap as question
  → judge(user_response)              -- collect user judgment
  → AuditedDecision
requires: committed(Decision)           -- runtime checkpoint (Phase 0)
deficit:  GapUnnoticed                  -- activation precondition (Layer 1/2)
preserves: D                            -- read-only throughout; morphism acts on Σ only
invariant: Surfacing over Deciding

── TYPES ──
D      = Decision point ∈ Committed × Stakes × Context
Committed = committed(D) ≡ ∃ A : mutates_state(A) ∨ externally_visible(A) ∨ consumes_resource(A)
Stakes = {Low, Med, High}
G      = Gap ∈ {Procedural, Consideration, Assumption, Alternative} ∪ Emergent(G)
Scan   = Detection: D → Set(G)                      -- gap identification
Sel    = Selection: Set(G) × D → Gₛ                 -- prioritize by stakes
Gₛ     = Selected gaps (|Gₛ| ≤ 2)
Q      = Question formation (assertion-free)
J      = Judgment ∈ {Address(c), Dismiss, Probe}
c      = Clarification (user-provided response to Q)
A      = Adjustment: J × D × Σ → Σ'
Σ      = State { reviewed: Set(GapType), deferred: List(G), blocked: Bool }
AuditedDecision = Σ' where (∀ task ∈ registered: task.status = completed) ∨ user_esc

── PHASE TRANSITIONS ──
Phase 0: D → committed?(D) → Scan(D) → G              -- checkpoint + detection (silent)
Phase 1: G → TaskCreate[all gaps] → Gₛ → Qs(Gₛ[0]) → Stop → J  -- register all, surface first [Tool]
Phase 2: J → A(J, D, Σ) → TaskUpdate → Σ'           -- adjustment + task update [Tool]

── LOOP ──
After Phase 2: re-scan for newly surfaced gaps from user response.
If new gaps: TaskCreate → add to queue.
Continue until: all tasks completed OR user ESC.
Mode remains active until convergence.
Convergence evidence: At all-tasks-completed, present audit trace — for each g ∈ registered, show (GapUnnoticed(g) → user_judgment(g) → adjustment(g)). Convergence is demonstrated by the complete audit record, not asserted by task status.

── ADJUSTMENT RULES ──
A(Address(c), _, σ) = σ { incorporate(c) }           -- extern: modifies plan
A(Dismiss, _, σ)    = σ { reviewed ← reviewed ∪ {Gₛ.type} }
A(Probe, _, σ)      = σ { re-scan(expanded) }        -- additional verification round (depth varies by stakes)

── SELECTION RULE ──
Sel(G, d) = take(priority_sort(G, stakes(d)), min(|G|, stakes(d) = High ? 2 : 1))

── CONTINUATION ──
proceed(Σ) = ¬blocked(Σ)

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Qs (constitution)      → present (mandatory; Esc key → loop termination at LOOP level, not a Judgment)
Σ (track)      → TaskCreate/TaskUpdate (async gap tracking with dependencies)
Scan (observe) → Read, Grep (stored knowledge extraction: context for gap identification)
A (track)      → Internal state update (no external tool)
converge (extension)   → TextPresent+Proceed (convergence evidence trace; proceed with audited decision)

── ELIDABLE CHECKPOINTS ──
-- Axis: Extension/Constitution = interaction kind (operational synonyms: relay/gated); always_gated/elidable = regret profile
Phase 1 Qs (gap surface)   → always_gated (Constitution: user judgment on surfaced gap determines adjustment)
Phase 1 Qs option 3 (Probe) → always visible (rationale depth varies by stakes level)
                                regret: bounded (Address/Dismiss cover all judgment paths; Probe adds verification depth)

── MODE STATE ──
Λ = { phase: Phase, state: Σ, active: Bool }

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Dimension resolution emergent via session context.
```

## Core Principle

**Surfacing over Deciding**: AI makes visible; user judges.

## Distinction from Other Protocols

| Protocol | Initiator | Deficit → Resolution | Focus |
|----------|-----------|----------------------|-------|
| **Prothesis** | AI-guided | FrameworkAbsent → FramedInquiry | Perspective selection |
| **Syneidesis** | AI-guided | GapUnnoticed → AuditedDecision | Decision-point gaps |
| **Hermeneia** | Hybrid | IntentMisarticulated → ClarifiedIntent | Expression clarification |
| **Telos** | AI-guided | GoalIndeterminate → DefinedEndState | Goal co-construction |
| **Horismos** | AI-guided | BoundaryUndefined → DefinedBoundary | Epistemic boundary definition |
| **Aitesis** | AI-guided | ContextInsufficient → InformedExecution | Context sufficiency sensing |
| **Analogia** | AI-guided | MappingUncertain → ValidatedMapping | Abstract-concrete mapping validation |
| **Periagoge** | AI-guided | AbstractionInProcess → CrystallizedAbstraction | In-process abstraction crystallization |
| **Prosoche** | User-initiated | ExecutionBlind → SituatedExecution | Risk-assessed execution |
| **Epharmoge** | AI-guided | ApplicationDecontextualized → ContextualizedExecution | Post-execution applicability |
| **Anamnesis** | AI-guided | RecallAmbiguous → RecalledContext | Vague recall recognition |
| **Katalepsis** | User-initiated | ResultUngrasped → VerifiedUnderstanding | Comprehension verification |

**Key difference**: Syneidesis audits the user's decision quality at committed action points (metacognitive: "has the user considered all angles?"). This is distinct from Aitesis, which monitors AI's context sufficiency (heterocognitive: "do I have enough context to execute?"), and Epharmoge, which evaluates AI's execution quality post-hoc ("does the result fit the context?"). The operational test: if the gap would be filled by the user reconsidering their decision, it's Syneidesis; if by providing context, it's Aitesis; if by adapting the result, it's Epharmoge.

## Mode Activation

### Activation

Command invocation activates mode until session end.

**Activation layers**:
- **Layer 1 (User-invocable)**: `/gap` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: Committed action detected with observable, unaddressed gaps via in-protocol heuristics.

**On activation**: Check existing Tasks for deferred gaps (subject prefix `[Gap:`). Resume tracking if found.

### Priority

<system-reminder>
When Syneidesis is active:

**Supersedes**: Risk assessment and decision gating rules in loaded instructions
(e.g., verification tiers, reversibility checks, approval requirements)

**Retained**: Safety boundaries, secrets handling, deny-paths, user explicit instructions

**Action**: At decision points, present potential gaps via Cognitive Partnership Move (Constitution).
</system-reminder>

- Stakes Assessment replaces tier-based gating
- All decision points become candidates for interactive confirmation
- Loaded instructions resume after mode deactivation

**Protocol precedence**: Activation order position 8/10 (graph.json is authoritative source for information flow). Concern cluster: Decision.

**Advisory relationships**: Receives from Prothesis (advisory: perspective simulation provides gap detection context), Analogia (advisory: validated mapping improves gap detection accuracy), Horismos (advisory: BoundaryMap narrows gap detection scope). Provides to Aitesis (suppression: same scope suppression). Katalepsis is structurally last.

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Task completion | Auto-deactivate after final resolution |

### Plan Mode Integration

When combined with Plan mode, apply Syneidesis at **Phase boundaries**:

| Phase Transition | Gap Check Focus |
|------------------|-----------------|
| Planning → Implementation | Scope completeness, missing requirements |
| Phase N → Phase N+1 | Previous phase completion, dependency satisfaction |
| Implementation → Commit | Changed assumptions, deferred decisions |

**Cycle**: [Deliberation → Gap → Revision → Execution]
1. **Deliberation**: Plan mode analysis generates recommendations (Prothesis provides multi-perspective deliberation when active)
2. **Gap**: Syneidesis surfaces unconfirmed assumptions via Cognitive Partnership Move (Constitution)
3. **Revision**: Integrate user response, re-evaluate if needed
4. **Execution**: Only after explicit scope confirmation

**Sequencing with Prothesis**: Following the default ordering, Prothesis completes perspective selection before Syneidesis applies gap detection. The cycle becomes: [Perspective Selection → Deliberation → Syneidesis → Revision → Execution]. The user can override this ordering by explicitly requesting Syneidesis first.

This cycle repeats per planning phase or domain area.

### Conditions

#### Essential (all must hold)

| Condition | Predicate | Test |
|-----------|-----------|------|
| **Committed action** | `committed(D)` | `∃ A : mutates_state(A) ∨ externally_visible(A) ∨ consumes_resource(A)` |
| **Observable gap** | `∃ G : observable(G)` | Concrete indicator exists in context (not speculation) |
| **Unaddressed** | `¬mentioned(G, context)` | Gap not already raised or resolved in session |

**Scope limitation**: `committed(D)` captures *execution commitment* (actions with immediate effects). It does not capture *direction commitment* — decisions that constrain future work without immediate state change (e.g., "let's use PostgreSQL", "refactor auth to OAuth2"). Direction commitment is partially covered by Plan Mode Integration, which applies Gap at phase boundaries where such decisions materialize into execution plans.

#### Modulating Factors (adjust intensity, not applicability)

| Factor | Effect | Heuristic signals |
|--------|--------|-------------------|
| **Irreversibility** | stakes ↑ | "delete", "push", "deploy", "migrate" |
| **Impact scope** | stakes ↑ | "all", "every", "entire", production, security |
| **Time pressure** | stakes ↑ (gap miss probability increases) | "quickly", "just", "right now" |
| **Uncertainty** | scan range ↑ | "maybe", "probably", "I think" |

#### Skip

- `¬committed(D)`: read-only, informational, exploratory actions
- User explicitly confirmed in current session
- Mechanical task (no judgment involved)
- User already mentioned the gap category

## Gap Taxonomy

| Type | Detection | Question Form |
|------|-----------|---------------|
| **Procedural** | Expected step absent from user's stated plan | "Was [step] completed?" |
| **Consideration** | Relevant factor not mentioned in decision | "Was [factor] considered?" |
| **Assumption** | Unstated premise inferred from framing | "Are you assuming [X]?" |
| **Alternative** | Known option not referenced | "Was [alternative] considered?" |

**Emergent gap detection**: Named types are working hypotheses, not exhaustive categories. Detect Emergent gaps when:
- The unaddressed gap spans multiple named types (e.g., a procedural absence driven by an unstated assumption)
- User dismisses all named-type gaps but the committed action still exhibits observable risk
- The decision context involves domain-specific considerations that resist classification into four generic types

Emergent gaps must satisfy morphism `GapUnnoticed → AuditedDecision` and use adapted question forms.

## Protocol

### Detection (Silent)

Per Phase 0 formal block. **Stakes mapping** (from modulating factors):
- Irreversible + High impact → High stakes
- Irreversible + Low impact → Medium stakes
- Reversible + Any impact → Low stakes
- Time pressure → stakes ↑ one level

**Cross-session enrichment**: Repeated gap patterns accumulated in Anamnesis's hypomnesis store (session recall indices written by the SessionEnd/PreCompact hook) may adjust gap type weighting during scanning — frequently surfaced gap categories receive higher detection sensitivity. In parallel, when **`/recollect`** has been invoked this session, the recalled context surfaces prior gap categories the user has frequently overlooked in comparable decisions, further adjusting detection weights toward those blind spots. This is a heuristic input that may bias detection toward previously observed patterns; constitution judgment remains with the user.

**Revision threshold**: When accumulated Emergent gap detections across 3+ sessions cluster around a recognizable pattern that the named gap types fail to capture, the cost of maintaining the current taxonomy exceeds the cost of adding a named type — promote the Emergent cluster. Conversely, when a named type consistently yields zero detections across 3+ sessions, consider whether it remains a distinct gap category or has become observationally inert — consistently undetected despite applicable contexts.

### Surfacing

Present the gap as text output:
- **Gap**: [Specific gap description with evidence]
- (rationale: [1-line why this gap matters for this decision])

Then **present**:

```
How would you like to address this gap?

Options:
1. **Address** — [what resolving this gap enables or changes in the decision]
2. **Dismiss** — [what assumption holds if this gap is accepted as-is]
3. **Probe** — request additional verification before deciding (rationale depth varies by stakes)
```

Option 3 (Probe) is always visible. When `stakes(D) = High`, present with expanded verification rationale; otherwise, present with brief rationale. Recognition over Recall: hiding Probe forces the user to recall that deeper verification is available.

Other is always available — user can respond freely beyond the listed options.

One gap per decision point.
Exception: Multiple high-stakes gaps → surface up to 2, prioritized by irreversibility.

### Resolution

Per ADJUSTMENT RULES. Key operational detail: Probe triggers a re-scan with expanded scope, surfacing additional gaps the user wants verified before committing.

### Gap Tracking

**Task format**:
```
TaskCreate({
  subject: "[Gap:Type] Question",
  description: "Rationale and context for this gap",
  activeForm: "Surfacing [Type] gap"
})
```

**Dependencies**: Use `addBlockedBy` when gaps have logical dependencies (e.g., "backup location" blocked by "backup exists?").

### Interactive Surfacing (Constitution)

When Syneidesis is active, **present** via Cognitive Partnership Move (Constitution) for:

Constitution presentation yields turn for user response.

| Trigger | Action |
|---------|--------|
| Any confirmation needed | Present as structured options |
| High-stakes + multiple gaps | Present priority choices |
| Assumption gap | Always confirm (inference may be wrong) |
| Interpretive uncertainty | Ask whether gap exists before surfacing |
| Naming/structure decisions | Offer alternatives with rationale |

**UX rationale**: Task list renders persistently in UI with progress indicator. User sees total gap count upfront. Dependencies visible via blocking relationships.

**Re-scan trigger**: User response may reveal new gaps (e.g., "Yes, backed up" → "Where?" precision gap). Always re-scan after each response.

### UI Mapping

| Environment | Address | Dismiss | Probe |
|-------------|---------|---------|-------|
| Constitution interaction | Selection | Selection | Selection |

Note: Esc key → unconditional loop termination (LOOP level). Constitution interaction blocks until response or Esc.

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Reversible, low impact | Constitution interaction with Confirm as default option |
| Medium | Reversible + high impact, OR Irreversible + low impact | Constitution interaction with rationale context |
| Heavy | Irreversible + high impact | Detailed rationale + Constitution interaction with explicit options |

## Rules

1. **AI-guided, user-judged**: Question > Assertion — ask "was X considered?", never "you missed X"
2. **Observable evidence**: Surface only gaps with concrete indicators
3. **User authority**: Dismissal is final
4. **Minimal intrusion**: Lightest intervention that achieves awareness
5. **Stakes calibration**: Intensity follows stakes matrix above
6. **Gap dependencies**: Use task blocking when gaps have logical order
7. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via Cognitive Partnership Move (Constitution). The question contains only the essential question; options contain only option-specific differential implications. Embedding context in question fields = protocol violation
8. **Convergence evidence**: Present convergence audit trace before declaring all tasks completed; per-gap evidence is required
9. **Zero-gap surfacing**: If Scan(D) finds no gaps, present scan methodology and conclusion — committed decisions with stakes warrant explicit "no gaps found" confirmation
10. **No gap inflation**: Do not surface gaps that lack observable evidence merely to appear thorough. Each surfaced gap must cite specific context from D
11. **Option-set relay test (Extension classification)**: If AI analysis converges to a single dominant option (option-level entropy→0 — Extension mode of the Cognitive Partnership Move), present the finding directly. Each Constitution option must be genuinely viable under different user value weightings. Options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options
12. **Gate integrity**: The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation
