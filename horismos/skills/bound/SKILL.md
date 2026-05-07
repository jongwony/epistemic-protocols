---
name: bound
description: "Define epistemic boundaries per decision. Produces BoundaryMap classifying domains as user-supplies, AI-proposes, or AI-autonomous when boundary ownership is undefined. Type: (BoundaryUndefined, AI, DEFINE, TaskScope) → DefinedBoundary. Alias: Horismos(ὁρισμός)."
---

# Horismos Protocol

Define epistemic boundaries per decision through AI-guided classification. Type: `(BoundaryUndefined, AI, DEFINE, TaskScope) → DefinedBoundary`.

## Definition

**Horismos** (ὁρισμός): A dialogical act of proactively defining epistemic boundary ownership per decision, where AI probes for boundary-undefined domains, collects contextual evidence to enrich classification quality, and presents each domain for user classification into a BoundaryMap consumed by all downstream protocols.

```
── FLOW ──
Horismos(T) → Probe(T) → Bᵢ? →
  |Bᵢ| = 0: skip → deactivate
  |Bᵢ| > 0: cycle_n=1, loop:
    Phase 1 Ctx(T, cycle_n) [per-cycle 재스캔] → Sub-D[cycle_n]
    Phase 2 Qc(Sub-D[k], Δessence[k-1], cycle_n) → Stop → A
    Phase 3 integrate(A, B, BoundaryEssence) → (B', BoundaryEssence', termination?) →
      termination_intent: → Phase 4
      Esc:                → ungraceful deactivate (final_gate skipped)
      else:               cycle_n += 1, loop
  Phase 4 Qf(residual, {UserRetains, AIAutonomous}) → Stop → bulk_classify → DefinedBoundary

── MORPHISM ──
TaskScope
  → probe(task, context)                  -- detect boundary-undefined domains
  → enrich(domains, codebase, cycle_n)    -- per-cycle context collection (re-scan)
  → classify(domain, as_inquiry)          -- per-cycle domain classification (4-value preserved)
  → crystallize(Δessence, BoundaryEssence) -- per-cycle essence delta integration (책임 경계 공간 crystallized 형태)
  → finalize(residual, FinalGateAnswer)   -- bulk classify residual at user-judged termination
  → DefinedBoundary
requires: boundary_undefined(T)            -- runtime checkpoint (Phase 0)
deficit:  BoundaryUndefined                -- activation precondition (Layer 1/2)
preserves: task_identity(T)                -- task scope invariant; BoundaryMap and BoundaryEssence mutated
invariant: Definition over Assumption

── TYPES ──
T              = TaskScope (task/project requiring boundary definition)
Probe          = T → Set(Domain)                              -- boundary-undefined domain detection (Phase 0; existence check, not exhaustive enumeration)
Domain         = { name: String, description: String, evidence: Set(Evidence) }
Evidence       = { source: String, content: String }
Bᵢ             = Set(Domain) from Probe(T)                    -- initial boundary-undefined domain signal (cycle 1 seed)
cycle_n        = Nat                                          -- current cycle counter (visible at Phase 2)
Ctx            = (T, cycle_n) → Sub-D                         -- per-cycle context collection (re-scan)
Sub-D[k]       = { domain: Domain, scan_summary: String, evidence: Set(Evidence) }  -- per-cycle dimension projection (one anchor domain per cycle)
Δessence       = String                                       -- per-cycle boundary-essence delta (incremental crystallization)
BoundaryEssence = String                                      -- accumulated boundary essence (책임 경계 공간 crystallized 형태)
Qc             = Per-cycle boundary classification interaction [Tool: Constitution interaction]
A              = User answer ∈ {UserSupplies(scope), AIPropose(scope), AIAutonomous(scope), Dismiss}
                 -- 4-value coproduct preserved (per-cycle Phase 2 answer; gate integrity Rule 17)
                 -- termination_intent surfaces via free-response affordance, NOT as 5th option
TerminationIntent = parsed natural-language signal of user satisfaction → Phase 4 진입
B              = BoundaryMap: Map(Domain, BoundaryClassification)
BoundaryClassification ∈ {UserSupplies(scope), AIPropose(scope), AIAutonomous(scope), Dismissed}
Qf             = Final gate bulk classification interaction [Tool: Constitution interaction]
FinalGateAnswer ∈ {UserRetains, AIAutonomous}                  -- Phase 4 잔여 일괄 분류 (per-cycle 4-value와 분리된 별도 coproduct)
                 -- UserRetains = bare-tag (사용자 결정권 보유; 다른 프로토콜 호출 포함; AI advisory routing 없음)
                 -- AIAutonomous = AI 위임 (per-cycle AIAutonomous(scope)와 의미 동치, scope=잔여 도메인 단위)
DefinedBoundary = B' where (residual = ∅ ∨ user_esc) ∧ BoundaryEssence finalized
Phase          ∈ {0, 1, 2, 3, 4}

── PHASE TRANSITIONS ──
Phase 0: T → Probe(T) → Bᵢ?                                                                 -- boundary existence checkpoint (silent)
Phase 1: T, cycle_n → Ctx(T, cycle_n) → Sub-D[cycle_n]                                      -- per-cycle context collection [Tool]
Phase 2: Sub-D[k], Δessence[k-1], cycle_n → Qc(Sub-D[k], Δessence[k-1], cycle_n) → Stop → A -- per-cycle classification [Tool]
Phase 3: A → integrate(A, B, BoundaryEssence) → (B', BoundaryEssence', termination?)        -- map + essence update (track)
Phase 4: residual, BoundaryEssence → Qf(residual, {UserRetains, AIAutonomous}) → Stop → bulk_classify → DefinedBoundary  -- final gate [Tool]

Phase 0 → Phase 1:  boundary_undefined(T) = true                                            -- domain signal present
Phase 0 → deactivate: boundary_undefined(T) = false                                         -- no undefined boundary signal
Phase 1 → Phase 2:  Sub-D[cycle_n] non-empty                                                -- per-cycle anchor domain surfaced
Phase 1 → Phase 4:  Sub-D[cycle_n] empty (all signals exhausted)                            -- proceed to bulk classify
Phase 2 → Phase 3:  A received                                                              -- per-cycle classification accepted
Phase 3 → Phase 1:  ¬termination_intent ∧ ¬Esc → cycle_n += 1                               -- continue loop
Phase 3 → Phase 4:  termination_intent                                                      -- user-judged satisfaction
Phase 3 → deactivate (ungraceful):  Esc                                                     -- final gate skipped, residual untreated
Phase 4 → converge: bulk_classify(residual) completed                                       -- BoundaryMap + BoundaryEssence finalized

── LOOP ──
J = {next, terminate, esc}
  next:      ¬termination_intent ∧ ¬Esc → cycle_n += 1, Phase 3 → Phase 1 (per-cycle re-scan)
  terminate: termination_intent (parsed from Phase 2 free response) → Phase 3 → Phase 4 (final gate)
  esc:       Esc → ungraceful deactivate (final gate skipped, residual untreated)

Per-cycle re-scan: Phase 1 substrate scan (Read/Grep/Glob) re-executes each cycle; Λ.D_history prevents duplicate domain surfacing.
Cycle 1 ordering: AI Impact ordering selects highest-impact domain.
Cycle k≥2 ordering: previous cycle's A[k-1] or free-response routes next cycle's domain selection frame.

Answer types (UserSupplies/AIPropose/AIAutonomous/Dismiss) determine BoundaryMap entry, not loop path.
FinalGateAnswer types (UserRetains/AIAutonomous) determine residual BoundaryMap entry at Phase 4.

Convergence evidence: At Phase 4 completion, present transformation trace — per-cycle (Sub-D[k], Δessence[k], BoundaryClassification[k]) ∀ k ∈ [1, cycle_n], plus final gate (∀ d ∈ residual, FinalGateAnswer(d)). BoundaryEssence is presented as separate session text artifact. Convergence is demonstrated, not asserted.

── CONVERGENCE ──
converge iff (termination_intent ∧ Phase 4 completed) ∨ user_esc
  termination_intent + Phase 4: per-cycle classified ∪ final_gate_classified ∪ dismissed = domains_touched (residual = ∅ post-Phase 4)
  user_esc:                     user exits via Esc key (ungraceful, residual untreated, BoundaryEssence finalized at current cycle_n)

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Probe (sense)        → Internal analysis (no external tool)
Phase 1 Ctx   (observe)      → Read, Grep, Glob (per-cycle re-scan: CLAUDE.md, boundaries.md, rules/, prior session context; Λ.D_history dedup)
Phase 2 Qc    (constitution) → present (mandatory; per-cycle classification + Δessence + cycle_n + free-response termination affordance; Esc → loop termination, not an Answer)
Phase 3       (track)        → Internal state update (BoundaryMap + BoundaryEssence accumulation; termination_intent parsing)
Phase 4 Qf    (constitution) → present (mandatory; residual bulk classification {UserRetains, AIAutonomous}; Esc → ungraceful exit at final gate)
converge      (extension)    → TextPresent+Proceed (per-cycle trace + final gate trace + BoundaryEssence artifact; proceed with defined boundary)

── MODE STATE ──
Λ = { phase: Phase, T: TaskScope,
      cycle_n: Nat,
      domains_touched: Set(Domain),                    -- accumulated across cycles (Phase 1 surfacing union)
      D_history: List<Sub-D>,                          -- per-cycle dimension projections (dedup source)
      essence_history: List<Δessence>,                 -- per-cycle delta accumulation
      boundary_essence: BoundaryEssence,               -- accumulated essence text
      context_resolved: Set(Domain),                   -- Phase 1 auto-resolved (Bᵣ-equivalent, per-cycle)
      user_responded: Set(Domain),                     -- Phase 2 4-value classification완료
      final_gate_classified: Set(Domain),              -- Phase 4 일괄 분류완료
      dismissed: Set(Domain),
      residual: Set(Domain),                           -- domains_touched 중 미분류 (Phase 4 입력)
      boundary_map: BoundaryMap,                       -- per-cycle 4-value entries ⊔ final-gate 2-value entries
      final_gate_answers: Map(Domain, FinalGateAnswer),
      history: List<(Domain, A)>,
      active: Bool, cause_tag: String }
-- Invariant: domains_touched = context_resolved ∪ user_responded ∪ final_gate_classified ∪ dismissed ∪ residual (pairwise disjoint)

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Dimension resolution emergent via session context.
```

## Core Principle

**Definition over Assumption**: When epistemic ownership is unclear, explicitly define boundaries rather than assuming defaults. Each decision point deserves its own boundary definition. The purpose of boundary probing is to produce a shared BoundaryMap — a Transactive Memory directory that makes explicit who knows what, who decides what, and where calibration is needed.

**Stigmergy signal principle**: BoundaryMap is a signal (TMS directory pointer), not a payload. It carries classification only — the signal exists in session context via Session Text Composition (Rule 9), and downstream behavior emerges from LLM reading the classification in conversation context. User-supplies signals standard context collection; AI-proposes signals ENRICH-AND-PRESENT (expanded context collection with candidate generation); AI-autonomous signals RESOLVE-OR-PRESENT (expanded context collection with resolution attempt). No explicit receiver implementation is needed in downstream protocol definitions — the session context is the environment, and behavioral adjustment is the emergent response.

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
| Euporia | Hybrid | AbstractAporia → ResolvedEndpoint | Extended-Mind reverse induction |
| **Prosoche** | User-initiated | ExecutionBlind → SituatedExecution | Risk-assessed execution |
| **Epharmoge** | AI-guided | ApplicationDecontextualized → ContextualizedExecution | Post-execution applicability |
| **Anamnesis** | AI-guided | RecallAmbiguous → RecalledContext | Vague recall recognition |
| **Katalepsis** | User-initiated | ResultUngrasped → VerifiedUnderstanding | Comprehension verification |

**Key differences**:

**Horismos vs Aitesis**: Both are pre-execution heterocognitive protocols. Aitesis probes factual gaps (context insufficiency — "do I have enough information to execute?"), Horismos probes constitutive boundaries (ownership classification — "who decides what?"). Both share an Akinator-style functor (probe → enrich → ask → integrate), but the ontology differs: Aitesis uncertainties have factual answers discoverable from the environment, while Horismos domains require constitutive decisions about responsibility allocation. The operational test: if the answer exists somewhere in the environment, it is Aitesis; if the answer must be constituted by the user, it is Horismos.

**Horismos vs Epitrope (deprecated)**: Epitrope produced a DelegationContract via scenario-based interview, accumulating an expertise profile across interactions. Horismos produces a BoundaryMap via direct per-decision classification. No scenario calibration, no accumulated profile, no team coordination (team coordination moved to Prosoche). Each invocation starts fresh for the current task scope.

**Horismos vs Telos**: Telos constructs the goal ("what are we doing?"), Horismos defines boundaries around it ("who decides what?"). Telos operates when intent is indeterminate; Horismos operates when intent is clear but ownership is not. In precedence, Telos precedes Horismos — goals must exist before boundaries can be drawn around them.

**Horismos vs Periagoge / Euporia (loop topology borrowing)**: Horismos's per-cycle-emergent loop borrows topology from Periagoge (in-process abstraction crystallization through dialectical iteration) and Euporia (cycle-emergent dimension surfacing with cycle counter visibility and user-judged termination). The borrowing is **topological only** — Horismos does NOT invoke `/induce` or `/elicit` at runtime. Coexistence over Mirroring: Horismos's deficit (BoundaryUndefined → DefinedBoundary) and identity remain distinct; Periagoge's `Confirm/Widen/Narrow/Fuse/Reorient` move set is not absorbed (Horismos uses 4-value `BoundaryClassification` per cycle plus 2-value `FinalGateAnswer` at Phase 4); Euporia's substrate-traced coordinate surfacing is not absorbed (Horismos surfaces evidence-cited domain anchors, not coordinate values). The shared structure is the **loop carrier** (per-cycle re-scan, cycle counter visibility, user-judged termination, essence-style cumulative artifact), not the dialectical content.

## Mode Activation

### Activation

AI probes for boundary-undefined domains before execution OR user calls `/bound`. Probing is silent (Phase 0); classification always requires user interaction via Cognitive Partnership Move (Constitution) (Phase 2).

**Activation layers**:
- **Layer 1 (User-invocable)**: `/bound` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: Boundary-undefined domains detected before execution via in-protocol heuristics. Detection is silent (Phase 0).

**Boundary undefined** = the task scope contains decision domains without clear ownership assignment between user and AI.

Gate predicate:
```
boundary_undefined(T) ≡ ∃ domain(d, T) : ¬assigned(d, owner) ∧ ¬trivially_defaultable(d)
```

### Priority

<system-reminder>
When Horismos is active:

**Supersedes**: Direct execution patterns in loaded instructions
(Boundary ownership must be defined before execution proceeds)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 2, present highest-impact boundary-undefined domain for user classification via Cognitive Partnership Move (Constitution).
</system-reminder>

- Horismos completes before execution proceeds
- Loaded instructions resume after all domains are bounded or dismissed

**Protocol precedence**: Activation order position 1/9 (graph.json is authoritative source for information flow). Cross-cutting: BoundaryMap is consumed by 5 downstream protocols.

**Advisory relationships**: Provides to Aitesis, Prothesis, Prosoche, Analogia, Syneidesis, Euporia (all advisory: BoundaryMap narrows scope). Receives from Euporia (advisory: resolved coordinates inform downstream boundary definition). Katalepsis is structurally last.

### Trigger Signals

Heuristic signals for boundary-undefined domain detection (not hard gates):

| Signal | Inference |
|--------|-----------|
| Multiple decision domains | Task scope involves distinct areas without clear ownership |
| Delegation uncertainty | User expresses uncertainty about who decides ("should I decide this or you?") |
| Prior protocol reference | Preceding protocol output references boundary-undefined domains |
| Stale BoundaryMap | Prior invocation's BoundaryMap may not apply (task scope changed) |

**Skip**:
- Boundary ownership is fully specified in current message or project rules
- User explicitly says "just do it" or "proceed"
- Same (domain, description) pair was dismissed in current session (session immunity)
- Phase 1 context collection resolves all identified domains
- Single-domain task with obvious ownership (no ambiguity)

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| User satisfaction (free-response termination_intent) → Phase 4 completed | Proceed with finalized BoundaryMap + BoundaryEssence as session text |
| User Esc key | Ungraceful exit — final gate skipped, residual untreated, BoundaryEssence finalized at current cycle_n |

## Domain Identification

Domains are identified dynamically per task — no fixed taxonomy. Each domain is characterized by:

- **name**: The decision area where boundary ownership is unclear (e.g., "error handling strategy", "API versioning approach", "test coverage scope")
- **description**: What specifically requires boundary definition
- **evidence**: Contextual evidence collected during Phase 1 that enriches classification quality

### Impact Ordering

Impact reflects how much defining this domain's boundary would narrow the remaining boundary-undefined space and affect downstream protocol operation.

| Level | Criterion | Action |
|-------|-----------|--------|
| **High** | Multiple downstream protocols depend on this boundary | Anchor first cycle |
| **Medium** | One downstream protocol affected or moderate scope impact | Anchor subsequent cycle |
| **Low** | Localized scope, minimal downstream effect | Defer to final gate (Phase 4) bulk classification |

Impact is relational, not intrinsic: the same domain may be High in one task scope and Low in another, depending on what other domains exist and which protocols are expected to activate downstream.

**Cycle 1 anchor selection**: AI Impact ordering selects the highest-impact domain as `Sub-D[1]` anchor.
**Cycle k≥2 anchor selection**: previous cycle's answer (`A[k-1]`) or free-response routes the next cycle's substrate scan frame, narrowing toward domains adjacent to the just-classified boundary or refocusing per user direction. AI re-applies Impact ordering within the routed frame.

Only one domain anchored per cycle. Remaining undischarged domains accumulate into `Λ.residual` and are bulk-classified at Phase 4 when the user signals satisfaction.

## Protocol

### Phase 0: Boundary Existence Checkpoint (Silent)

Verify task scope contains boundary-undefined signal. This phase is **silent** — no user interaction.

1. **Probe task scope** `T` for boundary-undefined signal: architecture choices, configuration preferences, quality standards, delegation scope, convention decisions, risk tolerance
2. **Check assignment**: assess whether ownership signal is present (existence check, not exhaustive enumeration — full domain set is **cycle-emergent** via Phase 1 per-cycle re-scan)
3. If no boundary-undefined signal: present finding per Rule 15 before proceeding (Horismos not activated)
4. If boundary-undefined signal present: initialize `cycle_n = 1`, `Λ.domains_touched = ∅`, `BoundaryEssence = ""` — proceed to Phase 1

**Probe scope**: Current task scope, conversation history, CLAUDE.md rules, boundaries.md, project conventions. Does NOT modify files or call external services.

**Departure from prior versions**: Phase 0 no longer requires upfront enumeration of every boundary-undefined domain. Per-cycle re-scan (Phase 1) discovers domains incrementally, enabling user-judged termination at any cycle without forcing exhaustive iteration.

### Phase 1: Per-Cycle Context Collection + Anchor Selection

Re-scan substrate for the current cycle and select one anchor domain (`Sub-D[cycle_n]`).

1. **Per-cycle re-scan** — Call Read/Grep/Glob for boundary signals in CLAUDE.md, rules/, boundaries.md, project configuration. Skip domains already in `Λ.D_history` (dedup) or `Λ.context_resolved ∪ Λ.user_responded ∪ Λ.dismissed`.
2. **Anchor selection** — From newly-surfaced domains:
   - Cycle 1: AI Impact ordering selects highest-impact domain as `Sub-D[1]`.
   - Cycle k≥2: previous answer `A[k-1]` or free-response routes the substrate scan frame; AI re-applies Impact ordering within the routed frame to select `Sub-D[k]`.
3. **Context enrichment** — For the anchor domain, collect evidence (file/line citations, rule references, conflicting signals).
4. **Auto-resolve check** — If anchor domain has definitive boundary assignment found: mark context-resolved, append to `Λ.context_resolved` and `Λ.boundary_map`, skip Phase 2 for this cycle, proceed to Phase 3.
5. **Append remaining surfaced-but-not-anchored domains** to `Λ.residual` for later Phase 4 bulk classification.
6. Append `Sub-D[cycle_n]` to `Λ.D_history` and `Λ.domains_touched`.
7. If anchor domain enriched (not auto-resolved): proceed to Phase 2.
8. If no new domains surface this cycle: signal Phase 1 → Phase 4 (substrate exhausted).

**Scope restriction**: Read-only investigation only. No file modifications.

### Phase 2: Per-Cycle Classification + Essence Surfacing (Constitution)

**Present** the cycle's anchor domain (`Sub-D[cycle_n]`), accumulated essence (`Δessence[k-1]`), and cycle counter via Cognitive Partnership Move (Constitution).

**Surfacing format**:

Present as text output:
- **Cycle**: `cycle_n` (always visible)
- **Anchor domain**: [Sub-D[cycle_n].domain.name] — [description]
- **Substrate evidence**: [evidence cited from Read/Grep/Glob with file:line]
- **Boundary essence so far** (`BoundaryEssence`): [accumulated 책임 경계 공간 crystallized 형태 — empty at cycle 1, refined cumulatively]
- **Δessence proposed for this cycle**: [how this domain's classification refines the abstract responsibility boundary essence]
- **Residual count**: [|Λ.residual| domains accumulated for Phase 4 bulk classification]

Then **present**:

```
How should boundary ownership be classified for this domain?

Options:
1. **User-supplies** — I already have the answer: [what user would provide]
2. **AI-proposes** — AI drafts options, I select/steer: [what AI would propose]
3. **AI-autonomous** — AI decides within scope: [what AI would determine]
4. **Dismiss** — Proceed with [stated default assumption]

If you feel the boundary essence is sufficiently aligned, express that in natural language
(e.g., "충분합니다", "satisfied", "good enough — let's wrap up the rest") and the loop
will proceed to Phase 4 final-gate classification of the remaining domains.
```

**Free-response termination affordance**: Phase 2 surfacing prose includes the satisfaction signal guidance. The 4-value answer coproduct is preserved — termination_intent is parsed from free response, never injected as a 5th option (Rule 17 gate integrity).

**Design principles**:
- **Cycle counter visibility**: `cycle_n` surfaced at every Phase 2 — user perceives signal density.
- **Essence visibility per cycle**: `Δessence` and accumulated `BoundaryEssence` shown — periagoge contribution makes the abstract responsibility boundary crystallization visible per cycle.
- **Substrate-cited evidence**: every surfaced datum carries file/line citation.
- **Residual transparency**: user sees how many domains will reach the final gate.
- **Free-response termination**: natural-language signal honored without option mutation.

### Phase 3: Per-Cycle Integration + Crystallization

After user response:

1. **Parse answer** — distinguish 4-value `BoundaryClassification` selection from free-response `TerminationIntent`. If both signals are present, the typed selection takes effect for the current anchor domain AND termination_intent advances to Phase 4.
2. **Update BoundaryMap**:
   - **UserSupplies(scope)**: Record anchor domain in `Λ.boundary_map` — downstream gates present open questions for user-provided values.
   - **AIPropose(scope)**: Record domain as AI-proposes — downstream protocols expand Phase 1 candidate generation (ENRICH-AND-PRESENT).
   - **AIAutonomous(scope)**: Record domain as AI-autonomous — downstream protocols may elide gates per RESOLVE-OR-PRESENT pattern.
   - **Dismiss**: Mark domain dismissed; record default assumption used.
3. **Crystallize Δessence** — append the cycle's `Δessence` to `Λ.essence_history`, then update `Λ.boundary_essence` by integrating the delta (textual refinement of the accumulated essence). The essence text is consumer-visible at Phase 4 and at convergence.
4. **Detect termination_intent** — if free response signals satisfaction (natural-language patterns like "충분", "satisfied", "good enough", "let's wrap up", "the rest is fine"): set `termination = true`. Otherwise `termination = false`.
5. **Append to history** — log `(Domain, A)` and append updated `BoundaryMap` snapshot to history.

**Routing**:
- If `termination = true` → proceed to Phase 4.
- If `Esc` → ungraceful deactivate (final gate skipped, `Λ.residual` untreated; BoundaryEssence finalized at current `cycle_n`).
- Else → `cycle_n += 1`, return to Phase 1.

### Phase 4: Final Gate — Residual Bulk Classification (Constitution)

**Present** accumulated residual domains for bulk classification via Cognitive Partnership Move (Constitution).

**Surfacing format**:

Present as text output:
- **BoundaryEssence (final synthesis)**: [accumulated 책임 경계 공간 crystallized 형태]
- **Per-cycle classified entries** (already in BoundaryMap): [Domain → BoundaryClassification per cycle]
- **Residual domains** (`Λ.residual`): [list of all surfaced-but-unclassified domains]

Then **present**:

```
How should the remaining domains be classified in bulk?

Options:
1. **UserRetains** — I retain decision authority for the residual; I may invoke other
   protocols (e.g., /attend, /grasp) at decision points. AI does not advisory-route.
2. **AIAutonomous** — AI decides autonomously within the residual scope. I delegate.
```

**Bulk classification semantics**:
- **UserRetains** — Each residual domain receives the `UserRetains` tag in `Λ.final_gate_answers`. BoundaryMap entries record the bare-tag classification; downstream protocols read this signal and surface decision questions to the user when activated. AI does NOT auto-route to specific protocols — user judges which protocol applies, preserving user decision authority over the residual.
- **AIAutonomous** — Each residual domain receives `AIAutonomous` (semantically equivalent to per-cycle `AIAutonomous(scope)` with scope = residual domain). Downstream protocols may elide gates per RESOLVE-OR-PRESENT pattern.

**Granularity option**: User may free-response per-domain mixed disposition (e.g., "domains A, B → UserRetains; domains C, D → AIAutonomous"). Free response is parsed as per-domain `FinalGateAnswer` map; default uniform option applies if free response is absent.

**Design principles**:
- **BoundaryEssence visible**: the crystallized abstract boundary essence is presented BEFORE residual classification — user judges bulk disposition with full essence context.
- **Residual transparency**: every accumulated residual domain is listed by name.
- **Bare-tag UserRetains**: no AI advisory routing baked in — user authority preserved at the residual disposition.
- **Mixed-disposition tolerated**: free response permits per-domain divergence from uniform option.

After Phase 4 user response:
1. Apply `FinalGateAnswer` to every residual domain (uniform or free-response-mixed).
2. Move residual entries from `Λ.residual` to `Λ.final_gate_classified` and `Λ.final_gate_answers`.
3. Append final-gate trace to history.
4. Output finalized `BoundaryMap` AND `BoundaryEssence` as session text artifacts.
5. Trigger `converge` extension transition.

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | 1-2 cycles, narrow task scope, residual minimal | Brief per-cycle anchor + Δessence + Phase 4 with small residual |
| Medium | 3-5 cycles, multi-domain task scope | Structured per-cycle surfacing + accumulated essence + Phase 4 bulk classification |
| Heavy | 6+ cycles, broad task scope, rich essence trajectory | Detailed evidence + per-cycle Δessence + Phase 4 with mixed-disposition residual |

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | `activate(Horismos) only if ∃ domain(d) : ¬assigned(d) ∧ ¬trivially_defaultable(d)` | Prevents false activation on clear tasks |
| Per-cycle re-scan | Phase 1 substrate scan runs each cycle; `Λ.D_history` deduplicates | Cycle-emergent domain surfacing without redundant queries |
| One anchor per cycle | One domain anchored per Phase 2 cycle | Prevents per-cycle classification overload; residual accumulates for Phase 4 |
| Cycle counter visibility | `cycle_n` surfaced at every Phase 2 | User perceives signal density and decides when to terminate |
| Essence visibility per cycle | `Δessence` and accumulated `BoundaryEssence` shown at Phase 2 | Periagoge crystallization made visible per cycle |
| Free-response termination affordance | Phase 2 prose includes natural-language satisfaction signal | User-judged termination without option mutation (Rule 17 preserved) |
| Residual transparency | Phase 2 shows `\|residual\|` count; Phase 4 lists every residual domain | User sees how many domains will reach the final gate |
| Session immunity | Dismissed (domain, description) → skip for session | Respects user's dismissal |
| Auto-resolve preferred | Context-resolved domains skip Phase 2 within their cycle | Minimizes user interaction |
| Recognition over recall | Present options (per-cycle: UserSupplies/AIPropose/AIAutonomous/Dismiss; Phase 4: UserRetains/AIAutonomous) | Never ask open-ended boundary questions |
| Esc semantics | Esc → ungraceful exit; final gate skipped, residual untreated | Distinguishes hard exit from satisfaction-driven termination |
| BoundaryEssence artifact | Output as separate session text alongside BoundaryMap at convergence | Periagoge contribution preserved as inspectable trace |

## Rules

1. **AI-guided, user-classified**: AI detects boundary-undefined signal and surfaces per-cycle anchors; classification requires user choice via Cognitive Partnership Move (Constitution) at Phase 2 (per-cycle 4-value) and Phase 4 (final gate 2-value). AI detection is implicitly confirmed when the user engages with classification.
2. **Recognition over Recall**: Present structured options via Cognitive Partnership Move (Constitution) — structured content reaches the user with response opportunity — Constitution interaction requires turn yield before proceeding. Phase 2 options are UserSupplies/AIPropose/AIAutonomous/Dismiss; Phase 4 options are UserRetains/AIAutonomous — never open-ended.
3. **Per-cycle context collection**: Each cycle's Phase 1 re-scans substrate (Read/Grep/Glob) for boundary signals in CLAUDE.md, rules/, boundaries.md, project configuration. `Λ.D_history` prevents duplicate domain surfacing.
4. **Definition over Assumption**: When boundary ownership is unclear, define explicitly rather than assume — silence is worse than a dismissed classification.
5. **No fixed taxonomy**: Domains emerge dynamically per cycle, not a predefined list. Do not impose categories.
6. **Context resolution preferred**: Auto-resolve from existing config, rules, and conventions where possible within the cycle's anchor. Minimize user interaction to what truly requires human judgment.
7. **One anchor per cycle**: Each Phase 2 cycle presents one anchor domain (`Sub-D[cycle_n]`). Surfaced-but-not-anchored domains accumulate into `Λ.residual` for Phase 4 bulk classification — never batched into one Phase 2 interaction.
8. **Impact ordering**: Cycle 1 selects anchor by AI Impact ordering. Cycle k≥2 routes anchor selection by previous answer or free-response, then re-applies Impact within the routed frame. Impact is relational — depends on downstream protocol dependencies.
9. **Session text output**: BoundaryMap and BoundaryEssence are output as separate session text artifacts. No structured data channel. Downstream protocols naturally read BoundaryMap from conversation context.
10. **Per-decision boundary**: Each invocation produces a fresh BoundaryMap and BoundaryEssence for the current task scope. Do not carry over classifications from prior sessions or invocations.
11. **Epistemic router**: BoundaryMap is a shared resource consumed by all downstream protocols — Aitesis uses it as gate threshold, Prothesis as framework filter, Syneidesis as gap relevance filter, Prosoche as risk evaluation threshold, Euporia as substrate scope narrowing. This shared consumption is why Horismos requires independent protocol status rather than absorption into any single consumer.
12. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via Cognitive Partnership Move (Constitution). The question contains only the essential question; options contain only option-specific differential implications. Embedding context in question fields = protocol violation.
13. **Convergence evidence**: At Phase 4 completion, present per-cycle trace (∀ k ∈ [1, cycle_n], (Sub-D[k], Δessence[k], BoundaryClassification[k])) plus final-gate trace (∀ d ∈ residual, FinalGateAnswer(d)). BoundaryEssence is presented as separate session text artifact. Convergence is demonstrated, not asserted.
14. **Zero-signal surfacing**: If Phase 0 probe detects no boundary-undefined signal, present this finding with reasoning for user confirmation.
15. **Option-set relay test (Extension classification)**: If AI analysis converges to a single dominant option (option-level entropy→0 — Extension mode of the Cognitive Partnership Move), present the finding directly. Each Constitution option must be genuinely viable under different user value weightings. Options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options.
16. **Gate integrity**: The defined option sets (per-cycle 4-value, Phase 4 2-value) are presented intact — injection, deletion, and substitution each violate this invariant. The free-response termination affordance is NOT a 5th option at Phase 2 — termination_intent is parsed from natural-language free response while the 4-value coproduct remains structurally intact. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation.
17. **Free-response termination affordance**: Phase 2 surfacing prose includes natural-language satisfaction signal guidance. Phase 3 parses `termination_intent` from free response and routes to Phase 4. This is `/elicit Rule 6` pattern (free response honored beyond surfaced options) without option mutation — the affordance lives in prose, not in the typed coproduct.
18. **Cycle counter visibility**: `cycle_n` surfaced at every Phase 2 (`/elicit Rule 8` pattern). User perceives signal density and judges termination timing.
19. **Essence visibility per cycle**: `Δessence` (per-cycle delta) and accumulated `BoundaryEssence` (책임 경계 공간 crystallized 형태) shown at every Phase 2 surfacing. The periagoge crystallization contribution is visible-by-cycle, not deferred to convergence.
20. **Final gate UserRetains semantics — bare tag**: Phase 4 `UserRetains` records only the disposition tag in `Λ.final_gate_answers`. Downstream protocol invocation is user-driven; AI does NOT auto-route to specific protocols (e.g., does NOT inject "→ /attend if execution-time" suggestions into BoundaryMap entries). User decision authority is preserved at the residual disposition — user judges which protocol applies when downstream activation occurs.
21. **Esc vs termination_intent distinction**: Esc at any Phase 2 → ungraceful exit (final gate skipped, residual untreated). Free-response termination_intent at Phase 2 → graceful Phase 4 entry (residual bulk-classified, BoundaryEssence finalized). Distinct semantic channels.
22. **Stage 1 conjecture disclosure**: Per-cycle-emergent loop + essence crystallization is a Stage 1 structural-fit conjecture (Deficit Empiricism). Stage 2 corroboration is N=1 dogfooding initially; variation-stable retention evidence accumulates over use before further refinement.

**Cross-session enrichment**: Accumulated boundary preferences from Anamnesis's hypomnesis store (session recall indices written by the SessionEnd/PreCompact hook) may serve as heuristic input for Phase 1 calibration proposals — but per-decision freshness (Rule 11) takes precedence. Prior preferences inform, they do not predetermine. In parallel, when **`/recollect`** has been invoked this session, the recalled context may surface prior BoundaryMap classifications for structurally similar domains, providing classification candidates for Phase 1 — but Rule 11 per-decision freshness remains authoritative, and recalled classifications are candidates to evaluate, not defaults to adopt. Constitution judgment remains with the user.
