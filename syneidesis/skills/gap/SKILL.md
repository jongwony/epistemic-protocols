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
Syneidesis(D, Σ) → Scan(D) → G → AssessGapPressure(D, G) → P → Sel(P, D) → Gₛ → Q(Gₛ) → J → A(J, D, Σ) → Σ'

── MORPHISM ──
Decision
  → scan(decision, context)           -- identify gaps implicit in decision
  → assess_pressure(decision, gaps, context) -- classify why each detected gap deserves attention now
  → select(gaps, pressure, stakes)    -- prioritize by pressure and stakes
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
Context = Observable decision context from session, codebase, and cited evidence
AssessGapPressure = Gap pressure classification: D × Set(G) → P  -- Context is projected from D
P      = GapPressureMap { load_bearing, cheap_to_settle, hidden_high_impact, nonblocking, queued }
partition(P, G) = G = P.load_bearing ⊔ P.cheap_to_settle ⊔ P.hidden_high_impact ⊔ P.nonblocking ⊔ P.queued
load_bearing = Set(G) whose resolution materially changes the decision
cheap_to_settle = Set(G) settleable with one low-cost confirmation
hidden_high_impact = Set(G) ⊆ G that Scan flagged low-confidence but decision-changing if real -- tightly capped (|hidden_high_impact| ≤ 1); admitted only when it could materially change the user's next judgment
nonblocking = Set(G) compatible with proceed(Σ) this cycle
queued = Set(G) routed to Σ.deferred for later review
Sel    = Selection: P × D → Gₛ                     -- prioritize by pressure and stakes
Gₛ     = Selected gaps (|Gₛ| ≤ 2)
Q      = Question formation (assertion-free)
J      = Judgment ∈ {Address(c), Dismiss, Probe}
c      = Clarification (user-provided response to Q)
A      = Adjustment: J × D × Σ → Σ'
Σ      = State { reviewed: Set(GapType), deferred: List(G), blocked: Bool }
AuditedDecision = Σ' where (∀ task ∈ registered: task.status = completed) ∨ user_esc

── PHASE TRANSITIONS ──
Phase 0: D → committed?(D) → Scan(D) → G → AssessGapPressure(D, G) → P  -- checkpoint + detection + pressure map (silent)
Phase 1: (G, P) → TaskCreate[all gaps] + Σ.deferred ← P.queued → Sel(P, D) → Gₛ → Qs(Gₛ[0]) → Stop → J  -- register all, pressure-select, surface first [Tool]
Phase 2: J → A(J, D, Σ) → TaskUpdate → Σ'           -- adjustment + task update [Tool]

── LOOP ──
After Phase 2: re-scan for newly surfaced gaps from user response.
If new gaps: TaskCreate → add to queue.
Pending gaps are active registered gaps ∪ Σ.deferred; each cycle reclassifies pending gaps through AssessGapPressure(D, pending) before Sel.
P.queued updates Σ.deferred at TaskCreate/TaskUpdate; later cycles may reclassify any Σ.deferred gap into a higher-pressure bucket when context changes.
Continue until: all tasks completed OR user ESC.
Mode remains active until convergence.
Convergence evidence: At all-tasks-completed, present audit trace — for each g ∈ registered, show (GapUnnoticed(g) → user_judgment(g) → adjustment(g)). Convergence is demonstrated by the complete audit record, not asserted by task status.

── ADJUSTMENT RULES ──
A(Address(c), _, σ) = σ { incorporate(c) }           -- extern: modifies plan
A(Dismiss, _, σ)    = σ { reviewed ← reviewed ∪ {Gₛ.type} }
A(Probe, _, σ)      = σ { re-scan(expanded) }        -- additional verification round (depth varies by stakes)

── SELECTION RULE ──
Sel(P, d) = take(priority_sort(P.load_bearing ∪ P.cheap_to_settle ∪ P.hidden_high_impact, d), min(|P.load_bearing ∪ P.cheap_to_settle ∪ P.hidden_high_impact|, stakes(d) = High ? 2 : 1))
priority_sort(S, d) = bucket order load_bearing → cheap_to_settle → hidden_high_impact; intra-bucket order follows evidence salience in d, then original Scan order
-- pressure-ordered: load_bearing and cheap_to_settle lead; hidden_high_impact only within its tight cap; nonblocking and queued are carried outside this cycle's surfaced set

── CONTINUATION ──
proceed(Σ) = ¬blocked(Σ)

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Qs (constitution)      → present (mandatory; Esc key → loop termination at LOOP level, not a Judgment)
Σ (track)      → TaskCreate/TaskUpdate (async gap tracking with dependencies)
Scan (observe) → Read, Grep (stored knowledge extraction: context for gap identification)
AssessGapPressure (observe) → Internal analysis (selection-only classification over Scan output; surfaces why a gap is load-bearing while gap resolution remains the user's constitutive act)
A (track)      → Internal state update (no external tool)
converge (extension)   → TextPresent+Proceed (convergence evidence trace; proceed with audited decision)

── MODE STATE ──
Λ = { phase: Phase, state: Σ, pressureMapSnapshot: P, active: Bool }  -- snapshot supports audit trace only; recompute before every Sel

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Dimension resolution emergent via session context.
```

## Core Principle

**Surfacing over Deciding**: AI makes visible; user judges.

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
1. **Deliberation**: Plan mode analysis generates recommendations (Prothesis supplies multi-perspective lenses when active)
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

**Cross-session enrichment**: Repeated gap patterns accumulated in Anamnesis's hypomnesis store (session recall indices written by the SessionEnd/PreCompact hook) may adjust gap type weighting during scanning — frequently surfaced gap categories receive higher detection sensitivity. In parallel, when **`/recollect`** has been invoked this session, the recalled context surfaces prior gap categories the user has frequently overlooked in comparable decisions, further adjusting detection weights toward those blind spots. This is a heuristic input that may bias detection toward previously observed patterns; constitutive judgment remains with the user.

**Revision threshold**: When accumulated Emergent gap detections across 3+ sessions cluster around a recognizable pattern that the named gap types fail to capture, the cost of maintaining the current taxonomy exceeds the cost of adding a named type — promote the Emergent cluster. Conversely, when a named type consistently yields zero detections across 3+ sessions, consider whether it remains a distinct gap category or has become observationally inert — consistently undetected despite applicable contexts.

### Pressure Assessment (Silent)

Per Phase 0 formal block, after Scan and before selection, classify the already-detected gaps `G` into a GapPressureMap `P`. This map is a selection-only classification over Scan output; it sorts the gaps Scan already found by why each deserves attention now:

- **load_bearing**: resolving the gap materially changes the decision
- **cheap_to_settle**: one low-cost confirmation settles it
- **hidden_high_impact**: Scan flagged it low-confidence but it is decision-changing if real — admit at most one, and only when it could materially change the user's next judgment
- **nonblocking** / **queued**: safe to carry through this cycle, or routed to the persistent deferred list for later review

`hidden_high_impact` is the unknown-unknown surface and the highest over-application risk: cap it tightly so Syneidesis narrows the question set rather than making the user inspect every speculative gap. Each detected gap belongs to exactly one pressure bucket for the current cycle. The pressure map supports gap selection and question formation only; the endpoint `AuditedDecision` is unchanged.

### Surfacing

Present the gap as text output:
- **Gap**: [Specific gap description with evidence]
- **Pressure**: [load-bearing / cheap-to-settle / hidden high-impact, in plain language — why this gap deserves attention now]
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

1. **AI-guided, user-judged** (Detection with Authority): AI surfaces gaps as questions ("was X considered?", never "you missed X"); user authority is final — dismissal terminates a gap.
2. **Observable evidence regulation**: Surface only gaps with concrete indicators cited from D; no gap inflation merely to appear thorough — each surfaced gap cites specific context from D.
3. **Minimal intrusion** (Surfacing over Deciding): Lightest intervention that achieves awareness; intensity follows the stakes matrix in `## Intensity`.
4. **Gap dependencies**: Task blocking enforces logical ordering when gaps have prerequisite relationships.
5. **Context-Question Separation**: Output analysis, evidence, and rationale as text before presenting the gate; the gate contains the essential question and option-specific differential implications only. Embedding context in question fields = protocol violation.
6. **Convergence evidence**: Present convergence audit trace before declaring all tasks completed; per-gap evidence is required.
7. **Zero-gap surfacing**: If Scan(D) finds no gaps, present scan methodology and conclusion — committed decisions with stakes warrant explicit "no gaps found" confirmation.
8. **Option-set relay test**: Single dominant option (entropy → 0) presented as relay. Each Constitution option genuinely viable under different user value weightings; shared-trajectory options collapse to one; off-axis prompts surface as free-response pathways rather than peer options.
9. **Gate integrity** (Safeguard tier): The defined option set is presented intact — option injection/deletion/substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation.
10. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
11. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
12. **Protocol-native pressure map**: Phase 0 produces a GapPressureMap before gap selection. The map is a pre-gate support object for gap selection and question formation, with no terminal-status or generic-calibration authority. It classifies already-detected gaps into exactly one current-cycle pressure bucket; gap tasks are sourced exclusively from Scan output, and `AuditedDecision` is unchanged. Surfacing over Deciding — the map justifies why a gap deserves attention now while gap resolution remains the user's constitutive act. `hidden_high_impact` is tightly capped (|hidden_high_impact| ≤ 1) and admitted only when the unknown could materially change the user's next judgment; the map must narrow the question set, never make the user inspect every possible gap.
13. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract, since each block is the type that constitutes the protocol — preserving the blocks keeps the protocol intact. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).
