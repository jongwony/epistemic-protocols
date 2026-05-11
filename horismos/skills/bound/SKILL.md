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
  |Bᵢ| > 0: cycle_n=1, BoundaryEssence="", loop:
    Phase 1 Ctx(T, cycle_n) [per-cycle re-scan] → (Sub-D[cycle_n], auto_resolved?) →
      auto_resolved: → Phase 3 (skip Phase 2 for this cycle)
      else:          → Phase 2
    Phase 2 Qc(Sub-D[cycle_n], BoundaryEssence, cycle_n) → Stop → A
    Phase 3 integrate(A, B, BoundaryEssence) → (B', BoundaryEssence', termination?) →
      termination_intent: → Phase 4
      Esc:                → ungraceful deactivate (final_gate skipped)
      else:               cycle_n += 1, loop
  Phase 4 Qf(residual, {UserSupplies, AIAutonomous}) → Stop → bulk_classify → DefinedBoundary
                       Esc → ungraceful deactivate

── MORPHISM ──
TaskScope
  → probe(task, context)                                           -- detect boundary-undefined domains
  → enrich(domains, codebase, cycle_n)                             -- per-cycle context collection (re-scan)
  → classify(domain, as_inquiry)                                   -- per-cycle domain classification (4-value preserved)
  → crystallize(Δessence, BoundaryEssence) → BoundaryEssence'      -- per-cycle essence delta integration (crystallized form of the responsibility boundary space)
  → finalize(residual, FinalGateAnswer)                            -- bulk classify residual at user-judged termination
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
                                                              -- bound index `k ∈ [1, cycle_n]` ranges over cycle history in convergence trace
Ctx            = (T, cycle_n) → Sub-D                         -- per-cycle context collection (re-scan)
Sub-D          = { domain: Domain, scan_summary: String, evidence: Set(Evidence) }  -- per-cycle dimension projection (one anchor domain per cycle)
                                                              -- Sub-D[k] = D_history[k] (k-th historical entry); current cycle = Sub-D[cycle_n]
Δessence       = String                                       -- per-cycle boundary-essence delta produced at Phase 3 integration
BoundaryEssence = String                                      -- accumulated boundary essence (crystallized form of the responsibility boundary space); initialized "" at Phase 0; updated as BoundaryEssence' = BoundaryEssence ⊕ Δessence at Phase 3
Qc             = Per-cycle boundary classification interaction [Tool: Constitution interaction]
A              = User answer ∈ {UserSupplies(scope), AIPropose(scope), AIAutonomous(scope), Dismiss}
                 -- 4-value coproduct (per-cycle Phase 2 answer; presented intact per gate integrity invariant)
                 -- termination_intent surfaces via free-response affordance, NOT as 5th option
TerminationIntent = parsed natural-language signal of user satisfaction → enters Phase 4
B              = BoundaryMap: Map(Domain, BoundaryClassification)
BoundaryClassification ∈ {UserSupplies(scope), AIPropose(scope), AIAutonomous(scope), Dismissed}
                 -- 4-value coproduct used uniformly across Phase 2 (per-cycle) and Phase 4 (residual bulk)
                 -- UserSupplies semantic: user retains decision authority for the scope; downstream gates present open questions; user provides values (or invokes other protocols) at decision-point activation
Qf             = Final gate bulk classification interaction [Tool: Constitution interaction]
FinalGateAnswer = {UserSupplies, AIAutonomous} ⊆ BoundaryClassification        -- Phase 4 surfacing subset
                 -- Phase 4 UserSupplies: bulk-classify residual domains as user-retained (each residual domain becomes its own scope; lazy-binding — values or protocol invocation deferred to downstream activation)
                 -- Phase 4 AIAutonomous: bulk-classify residual as AI-delegated (semantically equivalent to per-cycle AIAutonomous(scope))
DefinedBoundary = B' where (residual = ∅ ∨ user_esc) ∧ BoundaryEssence finalized
Phase          ∈ {0, 1, 2, 3, 4}

── PHASE TRANSITIONS ──
Phase 0: T → Probe(T) → Bᵢ?                                                                                  -- boundary existence checkpoint (silent)
Phase 1: T, cycle_n → Ctx(T, cycle_n) → (Sub-D[cycle_n], auto_resolved?)                                     -- per-cycle context collection + auto-resolve check [Tool]
Phase 2: Sub-D[cycle_n], BoundaryEssence, cycle_n → Qc(Sub-D[cycle_n], BoundaryEssence, cycle_n) → Stop → A  -- per-cycle classification [Tool]
Phase 3: A → integrate(A, B, BoundaryEssence) → (B', BoundaryEssence', termination?)                         -- map + essence update via Δessence (track)
Phase 4: residual, BoundaryEssence → Qf(residual, {UserSupplies, AIAutonomous}) → Stop → bulk_classify → DefinedBoundary  -- final gate [Tool]

Phase 0 → Phase 1:  boundary_undefined(T) = true                                            -- domain signal present
Phase 0 → deactivate: boundary_undefined(T) = false                                         -- no undefined boundary signal
Phase 1 → Phase 2:  Sub-D[cycle_n] non-empty ∧ ¬auto_resolved                               -- per-cycle anchor domain surfaced, requires user judgment
Phase 1 → Phase 3:  Sub-D[cycle_n] non-empty ∧ auto_resolved                                -- definitive assignment found in substrate, skip Phase 2
Phase 1 → Phase 4:  Sub-D[cycle_n] empty (all signals exhausted)                            -- proceed to bulk classify
Phase 2 → Phase 3:  A received                                                              -- per-cycle classification accepted
Phase 3 → Phase 1:  ¬termination_intent ∧ ¬Esc → cycle_n += 1                               -- continue loop
Phase 3 → Phase 4:  termination_intent                                                      -- user-judged satisfaction
Phase 3 → deactivate (ungraceful):  Esc                                                     -- final gate skipped, residual untreated
Phase 4 → converge: bulk_classify(residual) completed                                       -- BoundaryMap + BoundaryEssence finalized
Phase 4 → deactivate (ungraceful):  Esc                                                     -- final gate aborted, residual untreated, BoundaryEssence finalized at current cycle_n

── LOOP ──
J = {next, terminate, esc}
  next:      ¬termination_intent ∧ ¬Esc → cycle_n += 1, Phase 3 → Phase 1 (per-cycle re-scan)
  terminate: termination_intent (parsed from Phase 2 free response) → Phase 3 → Phase 4 (final gate)
  esc:       Esc → ungraceful deactivate (final gate skipped, residual untreated)

Per-cycle re-scan: Phase 1 substrate scan (Read/Grep/Glob) re-executes each cycle; `Λ.domains_touched` (anchored ⊔ non-anchored ⊔ resolved/dismissed) is the dedup source — no domain surfaced twice.
Cycle 1 ordering: AI Impact ordering selects highest-impact domain.
Cycle k≥2 ordering: previous cycle's A[cycle_n-1] or free-response routes next cycle's domain selection frame; AI re-applies Impact ordering within the routed frame.

Answer types (UserSupplies/AIPropose/AIAutonomous/Dismiss) determine BoundaryMap entry, not loop path.
FinalGateAnswer subset {UserSupplies, AIAutonomous} ⊆ BoundaryClassification determines residual BoundaryMap entries at Phase 4.

Convergence evidence: At Phase 4 completion, present transformation trace — per-cycle (Sub-D[k], Δessence[k], BoundaryClassification[k]) ∀ k ∈ [1, cycle_n] (k bound by ∀ quantifier), plus final gate (∀ d ∈ residual, FinalGateAnswer(d)). BoundaryEssence is presented as separate session text artifact. Convergence is demonstrated, not asserted.

── CONVERGENCE ──
converge iff Phase 4 completed ∨ user_esc
  Phase 4 completed: bulk_classify(residual) finished — reachable via Phase 3 termination_intent OR Phase 1 substrate exhaustion
  user_esc:          user exits via Esc key at any Phase 2 or Phase 4 (ungraceful, residual untreated, BoundaryEssence finalized at current cycle_n)

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Probe (sense)        → Internal analysis (no external tool)
Phase 1 Ctx   (observe)      → Read, Grep, Glob (per-cycle re-scan: CLAUDE.md, boundaries.md, rules/, prior session context; Λ.D_history dedup)
Phase 2 Qc    (constitution) → present (mandatory; per-cycle classification + Δessence + cycle_n + free-response termination affordance; Esc → loop termination, not an Answer)
Phase 3       (track)        → Internal state update (BoundaryMap + BoundaryEssence accumulation; termination_intent parsing)
Phase 4 Qf    (constitution) → present (mandatory; residual bulk classification {UserSupplies, AIAutonomous}; Esc → ungraceful exit at final gate)
converge      (extension)    → TextPresent+Proceed (per-cycle trace + final gate trace + BoundaryEssence artifact; proceed with defined boundary)

── MODE STATE ──
Λ = { phase: Phase, T: TaskScope,
      cycle_n: Nat,
      domains_touched: Set(Domain),                    -- accumulated across cycles (Phase 1 surfacing union)
      D_history: List<Sub-D>,                          -- per-cycle dimension projections (dedup source)
      essence_history: List<Δessence>,                 -- per-cycle delta accumulation
      boundary_essence: BoundaryEssence,               -- accumulated essence text
      context_resolved: Set(Domain),                   -- Phase 1 auto-resolved (Bᵣ-equivalent, per-cycle)
      user_responded: Set(Domain),                     -- Phase 2 4-value classification completed
      final_gate_classified: Set(Domain),              -- Phase 4 bulk classification completed
      dismissed: Set(Domain),
      residual: Set(Domain),                           -- unclassified subset of domains_touched (Phase 4 input)
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

**Stigmergy signal principle**: BoundaryMap is a signal (TMS directory pointer), not a payload. It carries classification only — the signal exists in session context via Session Text Composition, and downstream behavior emerges from LLM reading the classification in conversation context. BoundaryMap and BoundaryEssence are output as separate session text artifacts; no structured data channel is required. User-supplies signals standard context collection; AI-proposes signals ENRICH-AND-PRESENT (expanded context collection with candidate generation); AI-autonomous signals RESOLVE-OR-PRESENT (expanded context collection with resolution attempt). No explicit receiver implementation is needed in downstream protocol definitions — the session context is the environment, and behavioral adjustment is the emergent response.

**Multi-consumer architectural independence**: BoundaryMap is consumed by 5 downstream protocols — Aitesis as gate threshold, Prothesis as framework filter, Syneidesis as gap relevance filter, Prosoche as risk evaluation threshold, Euporia as substrate scope narrowing. This shared consumption is why Horismos requires independent protocol status rather than absorption into any single consumer; the boundary is a multi-consumer signal, not a private operation of a specific downstream. Independent invocation preserves the symmetric advisory relationship across all 5 consumers.

## Distinction from Other Protocols

| Protocol | Initiator | Deficit → Resolution | Focus |
|----------|-----------|----------------------|-------|
| **Prothesis** | AI-guided | FrameworkAbsent → FramedInquiry | Perspective selection |
| **Syneidesis** | AI-guided | GapUnnoticed → AuditedDecision | Decision-point gaps |
| **Horismos** | AI-guided | BoundaryUndefined → DefinedBoundary | Epistemic boundary definition |
| **Aitesis** | AI-guided | ContextInsufficient → InformedExecution | Context sufficiency sensing |
| **Analogia** | AI-guided | MappingUncertain → ValidatedMapping | Abstract-concrete mapping validation |
| **Periagoge** | AI-guided | AbstractionInProcess → CrystallizedAbstraction | In-process abstraction crystallization |
| Euporia | Hybrid | AbstractAporia → ResolvedEndpoint | Extended-Mind reverse induction |
| **Prosoche** | User-initiated | ExecutionBlind → SituatedExecution | Risk-assessed execution |
| **Epharmoge** | AI-guided | ApplicationDecontextualized → ContextualizedExecution | Post-execution applicability |
| **Elenchus** | User-initiated | ContextSuspect → VettedContext | Dialectical context vetting (pre-execution) |
| **Anamnesis** | AI-guided | RecallAmbiguous → RecalledContext | Vague recall recognition |
| **Katalepsis** | User-initiated | ResultUngrasped → VerifiedUnderstanding | Comprehension verification |

**Key differences**:

**Horismos vs Aitesis**: Both are pre-execution heterocognitive protocols. Aitesis probes factual gaps (context insufficiency — "do I have enough information to execute?"), Horismos probes constitutive boundaries (ownership classification — "who decides what?"). Both share an Akinator-style functor (probe → enrich → ask → integrate), but the ontology differs: Aitesis uncertainties have factual answers discoverable from the environment, while Horismos domains require constitutive decisions about responsibility allocation. The operational test: if the answer exists somewhere in the environment, it is Aitesis; if the answer must be constituted by the user, it is Horismos.

**Horismos vs Epitrope (deprecated)**: Epitrope produced a DelegationContract via scenario-based interview, accumulating an expertise profile across interactions. Horismos produces a BoundaryMap via direct per-decision classification. No scenario calibration, no accumulated profile, no team coordination (team coordination moved to Prosoche). Each invocation starts fresh for the current task scope.

**Horismos vs Periagoge / Euporia (loop topology borrowing)**: Horismos's per-cycle-emergent loop borrows topology from Periagoge (in-process abstraction crystallization through dialectical iteration) and Euporia (cycle-emergent dimension surfacing with cycle counter visibility and user-judged termination). The borrowing is **topological only** — Horismos's runtime is independent of `/induce`/`/elicit` invocations, and identity is preserved through the formal block: deficit `BoundaryUndefined → DefinedBoundary`, 4-value `BoundaryClassification` per cycle plus 2-value `FinalGateAnswer` at Phase 4 (vs Periagoge's `Confirm/Widen/Narrow/Fuse/Reorient` move set), evidence-cited domain anchors (vs Euporia's substrate-traced coordinate values). The shared structure is the **loop carrier** (per-cycle re-scan, cycle counter visibility, user-judged termination, essence-style cumulative artifact); dialectical content remains specific to each source protocol.

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

**Protocol precedence**: Activation order position 1/10 (graph.json is authoritative source for information flow). Cross-cutting: BoundaryMap is consumed by 5 downstream protocols.

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

Domains are identified dynamically per task — taxonomy emerges from the task context. Each domain is characterized by:

- **name**: The decision area where boundary ownership is unclear
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
**Cycle k≥2 anchor selection**: previous cycle's answer (`A[cycle_n-1]`) or free-response routes the next cycle's substrate scan frame, narrowing toward domains adjacent to the just-classified boundary or refocusing per user direction. AI re-applies Impact ordering within the routed frame. (Detailed per-answer-type heuristics in Phase 1 prose below.)

Only one domain anchored per cycle. Remaining undischarged domains accumulate into `Λ.residual` and are bulk-classified at Phase 4 when the user signals satisfaction.

## Protocol

### Phase 0: Boundary Existence Checkpoint (Silent)

Verify task scope contains boundary-undefined signal. This phase is **silent** — no user interaction.

1. **Probe task scope** `T` for boundary-undefined signal: architecture choices, configuration preferences, quality standards, delegation scope, convention decisions, risk tolerance
2. **Check assignment**: assess whether ownership signal is present (existence check, not exhaustive enumeration — full domain set is **cycle-emergent** via Phase 1 per-cycle re-scan)
3. If no boundary-undefined signal: present finding with reasoning for user confirmation before proceeding (Horismos not activated)
4. If boundary-undefined signal present: initialize `cycle_n = 1`, `Λ.domains_touched = ∅`, `BoundaryEssence = ""` — proceed to Phase 1

**Probe scope**: Current task scope, conversation history, CLAUDE.md rules, boundaries.md, project conventions. Does NOT modify files or call external services.

**Per-cycle-emergent semantics**: Phase 0 records the existence signal only. Per-cycle re-scan (Phase 1) discovers domains incrementally, enabling user-judged termination at any cycle as the loop progresses.

### Phase 1: Per-Cycle Context Collection + Anchor Selection

Re-scan substrate for the current cycle and select one anchor domain (`Sub-D[cycle_n]`).

1. **Per-cycle re-scan** — Call Read/Grep/Glob for boundary signals in CLAUDE.md, rules/, boundaries.md, project configuration. Skip domains already in `Λ.domains_touched` (single-source dedup — covers `Λ.D_history ∪ Λ.context_resolved ∪ Λ.user_responded ∪ Λ.dismissed ∪ Λ.residual` per the MODE STATE invariant).
2. **Anchor selection** — From newly-surfaced (not in `Λ.domains_touched`) domains:
   - **Cycle 1**: AI Impact ordering selects highest-impact domain as `Sub-D[1]`.
   - **Cycle k≥2**: previous cycle's answer `A[cycle_n-1]` or free-response routes the substrate scan frame; the routed frame must narrow or refocus relative to the just-classified boundary's neighborhood (not duplicate the prior cycle's frame). Per-answer-type heuristics inform AI judgment but are not normative: `Dismiss` deprioritizes the topic cluster the dismissed domain belonged to; `UserSupplies`/`AIPropose`/`AIAutonomous` narrow toward adjacent unclassified domains in the same cluster. AI re-applies Impact ordering within the routed frame to select `Sub-D[cycle_n]`.
3. **Context enrichment** — For the anchor domain, collect evidence (file/line citations, rule references, conflicting signals).
4. **Auto-resolve check** — If anchor domain has definitive boundary assignment found in substrate: set `auto_resolved = true`, append to `Λ.context_resolved` and `Λ.boundary_map` (with cited basis), append anchor to `Λ.D_history` and `Λ.domains_touched`, signal `Phase 1 → Phase 3` (skip Phase 2 for this cycle).
5. **Non-anchored domain accumulation** — Append every other surfaced-but-not-anchored domain to BOTH `Λ.residual` AND `Λ.domains_touched` (preserves dedup invariant; Phase 4 will bulk-classify).
6. **Anchor commit** — Append `Sub-D[cycle_n]` to `Λ.D_history` and `Λ.domains_touched`.
7. If anchor enriched and not auto-resolved: signal `Phase 1 → Phase 2`.
8. If no new domains surface this cycle (substrate exhausted): signal `Phase 1 → Phase 4`.

**Scope restriction**: Read-only investigation only. No file modifications.

### Phase 2: Per-Cycle Classification + Essence Surfacing (Constitution)

**Present** the cycle's anchor domain (`Sub-D[cycle_n]`), accumulated essence (`Δessence[k-1]`), and cycle counter via Cognitive Partnership Move (Constitution).

**Surfacing format**:

Present as text output:
- **Cycle**: `cycle_n` (always visible)
- **Anchor domain**: [Sub-D[cycle_n].domain.name] — [description]
- **Substrate evidence**: [evidence cited from Read/Grep/Glob with file:line]
- **Boundary essence so far** (`BoundaryEssence`): [accumulated crystallized form of the responsibility boundary space — empty at cycle 1, refined cumulatively]
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
and the loop will proceed to Phase 4 final-gate classification of the remaining domains.
```

**Free-response termination affordance**: Phase 2 surfacing prose includes the satisfaction signal guidance. termination_intent is parsed from free response while the typed coproduct `A ∈ {UserSupplies, AIPropose, AIAutonomous, Dismiss}` stays intact (gate integrity invariant — option set presented intact).

**Design principles**:
- **Cycle counter visibility**: `cycle_n` surfaced at every Phase 2 — user perceives signal density.
- **Essence visibility per cycle**: `Δessence` and accumulated `BoundaryEssence` shown — periagoge contribution makes the abstract responsibility boundary crystallization visible per cycle.
- **Substrate-cited evidence**: every surfaced datum carries file/line citation.
- **Residual transparency**: user sees how many domains will reach the final gate.
- **Free-response termination**: natural-language signal honored while the typed coproduct is preserved.

### Phase 3: Per-Cycle Integration + Crystallization

After user response:

1. **Parse answer** — distinguish 4-value `BoundaryClassification` selection from free-response `TerminationIntent`. If both signals are present, the typed selection takes effect for the current anchor domain AND termination_intent advances to Phase 4.
2. **Update BoundaryMap**:
   - **UserSupplies(scope)**: Record anchor domain in `Λ.boundary_map` — downstream gates present open questions for user-provided values.
   - **AIPropose(scope)**: Record domain as AI-proposes — downstream protocols expand Phase 1 candidate generation (ENRICH-AND-PRESENT).
   - **AIAutonomous(scope)**: Record domain as AI-autonomous — downstream protocols may elide gates per RESOLVE-OR-PRESENT pattern.
   - **Dismiss**: Mark domain dismissed; record default assumption used.
3. **Crystallize Δessence** — append the cycle's `Δessence` to `Λ.essence_history`, then update `Λ.boundary_essence` by integrating the delta (textual refinement of the accumulated essence). The essence text is consumer-visible at Phase 4 and at convergence.
4. **Detect termination_intent** — if free response signals user satisfaction with the boundary essence as currently aligned: set `termination = true`. Otherwise `termination = false`.
5. **Append to history** — log `(Domain, A)` and append updated `BoundaryMap` snapshot to history.

**Routing**:
- If `termination = true` → proceed to Phase 4.
- If `Esc` → ungraceful deactivate (final gate skipped, `Λ.residual` untreated; BoundaryEssence finalized at current `cycle_n`).
- Else → `cycle_n += 1`, return to Phase 1.

### Phase 4: Final Gate — Residual Bulk Classification (Constitution)

**Present** accumulated residual domains for bulk classification via Cognitive Partnership Move (Constitution).

**Surfacing format**:

Present as text output:
- **BoundaryEssence (final synthesis)**: [accumulated crystallized form of the responsibility boundary space]
- **Per-cycle classified entries** (already in BoundaryMap): [Domain → BoundaryClassification per cycle]
- **Residual domains** (`Λ.residual`): [list of all surfaced-but-unclassified domains]

Then **present**:

```
How should the remaining domains be classified in bulk?

Options:
1. **UserSupplies** — I retain decision authority for each residual domain (lazy-binding);
   I provide values or invoke downstream protocols at decision-point activation.
2. **AIAutonomous** — AI decides autonomously within the residual scope. I delegate.
```

**Bulk classification semantics**:
- **UserSupplies** — Each residual domain receives `UserSupplies(domain)` in `Λ.final_gate_answers` (the residual domain itself becomes the scope; lazy-binding). BoundaryMap entries record the disposition; downstream protocols read this signal and surface decision questions to the user when activated. User judges which protocol applies, preserving user decision authority over the residual.
- **AIAutonomous** — Each residual domain receives `AIAutonomous(domain)` (semantically equivalent to per-cycle `AIAutonomous(scope)` with scope = residual domain). Downstream protocols may elide gates per RESOLVE-OR-PRESENT pattern.

**Granularity option**: User may free-response per-domain mixed disposition. Free response is parsed as a `Map(Domain, FinalGateAnswer)`; the uniform option (1 or 2) applies as default when free response is absent.

**Mixed-disposition parsing — error handling**:
- **Unknown-domain reference**: If the user names a domain absent from `Λ.residual` (typo or hallucinated reference), AI surfaces the discrepancy, re-presents the residual list, and re-prompts.
- **Ambiguous disposition**: If a domain's disposition is ambiguous or unparseable, AI re-prompts with the ambiguous portion isolated and the `FinalGateAnswer` coproduct re-presented.
- **Partial coverage**: Domains in `Λ.residual` not addressed in the mixed-disposition free response default to whichever uniform option (1 or 2) the user selected, OR — if no uniform option was selected — AI re-prompts for the unaddressed remainder.
- **Disposition conflict**: If a domain receives multiple conflicting dispositions in the same response, AI re-prompts with the conflicting portion isolated.

**Design principles**:
- **BoundaryEssence visible**: the crystallized abstract boundary essence is presented BEFORE residual classification — user judges bulk disposition with full essence context.
- **Residual transparency**: every accumulated residual domain is listed by name.
- **Lazy-binding UserSupplies**: Phase 4 UserSupplies records the disposition with the residual domain as scope; values and protocol invocation occur at downstream activation rather than at Phase 4 surfacing.
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
| Free-response termination affordance | Phase 2 prose includes natural-language satisfaction signal | User-judged termination while typed coproduct preserved (gate integrity invariant) |
| Residual transparency | Phase 2 shows `\|residual\|` count; Phase 4 lists every residual domain | User sees how many domains will reach the final gate |
| Session immunity | Dismissed (domain, description) → skip for session | Respects user's dismissal |
| Auto-resolve preferred | Context-resolved domains skip Phase 2 within their cycle | Minimizes user interaction |
| Recognition over recall | Present options (per-cycle: UserSupplies/AIPropose/AIAutonomous/Dismiss; Phase 4: UserSupplies/AIAutonomous subset) | Bound by typed coproducts |
| Esc semantics | Esc → ungraceful exit; final gate skipped, residual untreated | Distinguishes hard exit from satisfaction-driven termination |
| BoundaryEssence artifact | Output as separate session text alongside BoundaryMap at convergence | Periagoge contribution preserved as inspectable trace |

## Rules

1. **AI-guided, user-classified**: AI detects boundary-undefined signal and surfaces per-cycle anchors; classification requires user choice via Cognitive Partnership Move (Constitution) at Phase 2 (per-cycle 4-value) and Phase 4 (final gate 2-value). AI detection is implicitly confirmed when the user engages with classification.
2. **Recognition over Recall**: Present structured options with differential futures via Cognitive Partnership Move (Constitution); Constitution interactions yield turn for response. Phase 2 binds to `A ∈ {UserSupplies, AIPropose, AIAutonomous, Dismiss}`; Phase 4 binds to `FinalGateAnswer = {UserSupplies, AIAutonomous} ⊆ BoundaryClassification` (per TYPES).
3. **Per-cycle context collection**: Each cycle's Phase 1 re-scans substrate (CLAUDE.md, rules/, boundaries.md, project configuration); `Λ.D_history` prevents duplicate domain surfacing. (Detailed step procedure in Phase 1 prose.)
4. **Definition over Assumption**: When boundary ownership is unclear, define explicitly rather than assume — silence is worse than a dismissed classification.
5. **No fixed taxonomy**: Domains emerge dynamically from each task probe; the `Domain = { name, description, evidence }` type carries no category constructor — taxonomy emerges from the task context.
6. **Context resolution preferred**: Auto-resolve from existing config, rules, and conventions where possible within the cycle's anchor. Minimize user interaction to what truly requires human judgment.
7. **One anchor per cycle**: Each Phase 2 cycle presents one anchor domain (`Sub-D[cycle_n]`); the PHASE TRANSITIONS edge `Phase 1 → Phase 2: Sub-D[cycle_n] non-empty ∧ ¬auto_resolved` binds the per-cycle cardinality. Surfaced-but-not-anchored domains accumulate into `Λ.residual` for Phase 4 bulk classification.
8. **Impact ordering**: Per-cycle anchor selected by Impact — highest-impact at cycle 1; previous answer or free-response routes the substrate scan frame at cycle k≥2, with Impact re-applied within the routed frame. Impact is relational to downstream protocol dependencies. (Detailed per-answer-type heuristics in Phase 1 prose.)
9. **Per-decision boundary**: Each invocation produces a fresh BoundaryMap and BoundaryEssence for the current task scope. Do not carry over classifications from prior sessions or invocations.
10. **Context-Question Separation**: Analysis, evidence, and rationale appear as text before the gate; the question contains only the essential question, options carry only option-specific differential implications. Embedding context in question fields = protocol violation.
11. **Convergence evidence**: At Phase 4 completion, present per-cycle trace (∀ k ∈ [1, cycle_n]: (Sub-D[k], Δessence[k], BoundaryClassification[k])) and final-gate trace (∀ d ∈ residual: FinalGateAnswer(d)); BoundaryEssence as separate session text artifact. Convergence is demonstrated, not asserted.
12. **Zero-signal surfacing**: If Phase 0 probe detects no boundary-undefined signal, present this finding with reasoning for user confirmation.
13. **Option-set relay test (Extension classification)**: If AI analysis converges to a single dominant option (option-level entropy→0 — Extension mode of the Cognitive Partnership Move), present the finding directly. Each Constitution option must be genuinely viable under different user value weightings. Options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options.
14. **Gate integrity** (Safeguard tier — revisitable as model capability evolves; revision triggers: model upgrade with demonstrated instruction-following improvement, sustained low violation rate across sessions, or successful compression PR demonstrating guard reducibility without outcome loss): The defined option sets (per-cycle 4-value `A`, Phase 4 2-value `FinalGateAnswer`) are presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation. Horismos-specific: the free-response termination affordance is positioned in Phase 2 surfacing prose (natural-language satisfaction signal guidance), not in the typed coproduct; Phase 3 parses `termination_intent` from free response and routes to Phase 4 — the affordance lives in prose rather than in the typed coproduct, so option-set integrity is preserved.
15. **Final gate UserSupplies — lazy-binding semantic**: Phase 4 `UserSupplies(domain)` records the disposition with the residual domain as scope. The `FinalGateAnswer` coproduct (subset of BoundaryClassification) contains no routing constructor — BoundaryMap entries carry only the typed disposition, and value provision or protocol invocation decisions occur when the user activates downstream protocols. User decision authority is preserved at the residual disposition.
16. **Conjecture disclosure**: Per-cycle-emergent loop + essence crystallization is a structural-fit conjecture under accumulating use. Loop topology revision waits on variation-stable retention evidence accumulating across invocations.

**Cross-session enrichment**: Accumulated boundary preferences from Anamnesis's hypomnesis store (session recall indices written by the SessionEnd/PreCompact hook) serve as heuristic input for Phase 1 calibration proposals — per-decision freshness (each invocation produces a fresh BoundaryMap) governs the actual classification. In parallel, when **`/recollect`** has been invoked this session, recalled context surfaces prior BoundaryMap classifications for structurally similar domains as classification candidates for Phase 1 — per-decision freshness governs evaluation. Constitution judgment remains with the user.
