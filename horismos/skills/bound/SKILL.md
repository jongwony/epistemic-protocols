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
Horismos(T, B_prior?) → Probe(T) → Bᵢ? →
  |Bᵢ| = 0: skip → deactivate
  |Bᵢ| > 0: cycle_n=1, BoundaryEssence="", B = seed(B_prior) ∪ ∅, EssenceTrend=MixedTrend, default=AIAutonomous (Extension-default initial), loop:
    Phase 1 Ctx(T, cycle_n) [per-cycle re-scan] → (Sub-D[cycle_n], auto_resolved?) →
      auto_resolved: → Phase 3 (skip Phase 2 for this cycle)
      else:          → Phase 2
    Phase 2 Qc(Sub-D[cycle_n], BoundaryEssence, cycle_n, B_snapshot, default) → Stop → A
    Phase 3 parse(A) → (typed_A, termination?, override?) →
      integrate(typed_A, B, BoundaryEssence) → (B', BoundaryEssence')                              -- classified-portion update only
      ImplicitTermination: → finalize(B', residual, default_or_override) → DefinedBoundary → converge
                            -- "default" is Λ.default_for_residual at entry to Phase 3 (the value Phase 2 surfaced); NOT re-derived
      ExplicitTermination: → Phase 4
      Esc:                 → ungraceful deactivate (residual untreated, BoundaryEssence finalized at current cycle_n)
      else:                → derive(EssenceTrend, history') → default' (for NEXT cycle) → refresh B'-snapshot → cycle_n += 1, loop
  Phase 4 (optional path) Qf(residual, {UserSupplies, AIAutonomous}) → Stop → bulk_classify → DefinedBoundary
                       Esc → ungraceful deactivate

── MORPHISM ──
TaskScope, B_prior?
  → probe(task, context)                                           -- detect boundary-undefined domains
  → seed(B_prior, B)                                               -- hermeneutic carry-over: optional prior BoundaryMap as starting B; seeded domains enter `context_resolved` partition with "prior classification" basis (entries mutable in subsequent cycles)
  → enrich(domains, codebase, cycle_n)                             -- per-cycle context collection (re-scan)
  → classify(domain, as_inquiry)                                   -- per-cycle domain classification (4-value preserved)
  → integrate(typed_A, B, BoundaryEssence) → (B', BoundaryEssence')-- classified-portion update for current anchor; does NOT update default_for_residual
  → crystallize(Δessence, BoundaryEssence) → BoundaryEssence'      -- per-cycle essence delta integration (crystallized form of the responsibility boundary space)
  → derive(EssenceTrend, history') → default'                      -- count-based EssenceTrend → DefaultClassification for NEXT cycle's residual (only runs on loop continuation)
  → snapshot(B', residual, default') → B_complete'                 -- round-local complete BoundaryMap view for next cycle's Phase 2: classified entries ∪ (residual ↦ default')
  → finalize(B', residual, default_at_surfacing | override | FinalGateAnswer)
                                                                   -- ImplicitTermination: residual ↦ (default_at_surfacing | override); Phase 4: residual ↦ FinalGateAnswer
                                                                   -- "default_at_surfacing" = Λ.default_for_residual visible in just-completed Phase 2 (NOT re-derived)
  → DefinedBoundary
requires: boundary_undefined(T)            -- runtime checkpoint (Phase 0)
deficit:  BoundaryUndefined                -- activation precondition (Layer 1/2)
preserves: task_identity(T)                -- task scope invariant; BoundaryMap and BoundaryEssence mutated; B_prior seed entries are mutable across cycles
invariant: Definition over Assumption

── TYPES ──
T              = TaskScope (task/project requiring boundary definition)
B_prior        = Optional(BoundaryMap)                        -- optional invocation seed for hermeneutic carry-over (prior BoundaryMap detected in session context); seed entries are mutable across cycles
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
EssenceTrend   ∈ {ExtensionTrend, ConstitutionTrend, MixedTrend}
                                                              -- derived from count distribution of classified entries across Λ.history (count-based ONLY; no textual-lean interpretation — keeps derivation deterministic and relay-eligible)
                                                              -- ExtensionTrend: count(AIPropose ∪ AIAutonomous) strictly dominant
                                                              -- ConstitutionTrend: count(UserSupplies) strictly dominant
                                                              -- MixedTrend: no strict dominance OR cycle_n < 2 (explicit single-cycle initialization rule — insufficient classification history to commit a non-fallback trend)
DefaultClassification : EssenceTrend → {AIAutonomous, UserSupplies} ⊆ BoundaryClassification
                                                              -- codomain restricted to the 2-value reachable subset (AIPropose and Dismissed are unreachable from this function)
                                                              -- ExtensionTrend → AIAutonomous; ConstitutionTrend → UserSupplies; MixedTrend → AIAutonomous (Extension-default fallback)
Qc             = Per-cycle boundary classification interaction [Tool: Constitution interaction]
A              = User answer ∈ {UserSupplies(scope), AIPropose(scope), AIAutonomous(scope), Dismiss}
                 -- 4-value coproduct (per-cycle Phase 2 answer; presented intact per gate integrity invariant)
                 -- termination_intent surfaces via free-response affordance, NOT as 5th option
TerminationIntent = parsed natural-language signal of user satisfaction
                  ∈ {ImplicitTermination(default_override?), ExplicitTermination}
                                                              -- ImplicitTermination: commit current B_snapshot — residual ↦ default_at_surfacing (the Λ.default_for_residual value visible in the just-completed Phase 2 surfacing; NOT re-derived in Phase 3) OR user-stated override — emit DefinedBoundary directly
                                                              -- ExplicitTermination: enter Phase 4 for bulk residual classification
                                                              -- default_override : BoundaryClassification — optional user-named alternative default overriding the surfaced default
B              = BoundaryMap: Map(Domain, BoundaryClassification)
                 -- Always-complete after each Phase 2 round: classified entries (per-cycle answers + auto-resolved) ∪ residual entries provisionally mapped to current default_for_residual
                 -- Round-local terminator: each cycle's snapshot is a valid DefinedBoundary upon ImplicitTermination
BoundaryClassification ∈ {UserSupplies(scope), AIPropose(scope), AIAutonomous(scope), Dismissed}
                 -- 4-value coproduct used uniformly across Phase 2 (per-cycle) and Phase 4 (residual bulk)
                 -- UserSupplies semantic: user retains decision authority for the scope; downstream gates present open questions; user provides values (or invokes other protocols) at decision-point activation
Qf             = Final gate bulk classification interaction [Tool: Constitution interaction]
FinalGateAnswer = {UserSupplies, AIAutonomous} ⊆ BoundaryClassification        -- Phase 4 surfacing subset
                 -- Phase 4 UserSupplies: bulk-classify residual domains as user-retained (each residual domain becomes its own scope; lazy-binding — values or protocol invocation deferred to downstream activation)
                 -- Phase 4 AIAutonomous: bulk-classify residual as AI-delegated (semantically equivalent to per-cycle AIAutonomous(scope))
DefinedBoundary = B' where (ImplicitTermination ∨ Phase 4 completed ∨ residual = ∅) ∧ BoundaryEssence finalized
                 -- B' = post-final-cycle BoundaryMap (prime denotes temporal succession of the in-loop B state)
                 -- Three graceful convergence paths: (i) Phase 3 ImplicitTermination (residual ↦ default_at_surfacing | override), (ii) Phase 4 completed (residual ↦ FinalGateAnswer), (iii) Phase 1 substrate exhaustion → Phase 4
Phase          ∈ {0, 1, 2, 3, 4}

── PHASE TRANSITIONS ──
Phase 0: T, B_prior? → Probe(T) → seed(B_prior, B) → Bᵢ?                                                      -- boundary existence checkpoint + optional hermeneutic seed (silent)
Phase 1: T, cycle_n → Ctx(T, cycle_n) → (Sub-D[cycle_n], auto_resolved?)                                      -- per-cycle context collection + auto-resolve check [Tool]
Phase 2: Sub-D[cycle_n], BoundaryEssence, cycle_n, B_snapshot, default
       → Qc(Sub-D[cycle_n], BoundaryEssence, cycle_n, B_snapshot, default) → Stop → A                         -- per-cycle classification with complete B_snapshot + default visibility [Tool]
Phase 3: A → parse(A) → (typed_A, termination?, override?)
       → integrate(typed_A, B, BoundaryEssence) → (B', BoundaryEssence')                                      -- classified-portion update only (does NOT modify Λ.default_for_residual)
       → (only on loop continuation) derive(EssenceTrend, history') → default' → snapshot(B', residual, default') → B_complete'
                                                                                                              -- next-cycle EssenceTrend + default + B_snapshot refresh (track + sense)
Phase 4 (optional): residual, BoundaryEssence → Qf(residual, {UserSupplies, AIAutonomous}) → Stop → bulk_classify → DefinedBoundary
                                                                                                              -- final gate [Tool], reached via ExplicitTermination or Phase 1 substrate exhaustion

Phase 0 → Phase 1:  boundary_undefined(T) = true                                            -- domain signal present
Phase 0 → deactivate: boundary_undefined(T) = false                                         -- no undefined boundary signal
Phase 1 → Phase 2:  Sub-D[cycle_n] non-empty ∧ ¬auto_resolved                               -- per-cycle anchor domain surfaced, requires user judgment
Phase 1 → Phase 3:  Sub-D[cycle_n] non-empty ∧ auto_resolved                                -- definitive assignment found in substrate, skip Phase 2
Phase 1 → Phase 4:  Sub-D[cycle_n] empty (all signals exhausted)                            -- substrate-exhaustion path to explicit bulk classify
Phase 2 → Phase 3:  A received                                                              -- per-cycle classification accepted
Phase 3 → Phase 1:  ¬termination_intent ∧ ¬Esc → derive default' → cycle_n += 1             -- continue loop with next-cycle default
Phase 3 → converge (implicit): TerminationIntent = ImplicitTermination → finalize(B', residual, default_at_surfacing | override) → emit DefinedBoundary
                                                                                            -- round-local terminator: Phase 2-surfaced default committed (NOT re-derived)
Phase 3 → Phase 4:  TerminationIntent = ExplicitTermination                                 -- user-judged satisfaction with explicit residual classification request
Phase 3 → deactivate (ungraceful):  Esc                                                     -- residual untreated, BoundaryEssence finalized at current cycle_n
Phase 4 → converge: bulk_classify(residual) completed                                       -- BoundaryMap + BoundaryEssence finalized
Phase 4 → deactivate (ungraceful):  Esc                                                     -- final gate aborted, residual untreated, BoundaryEssence finalized at current cycle_n

── LOOP ──
J = {next, terminate_implicit, terminate_explicit, esc}
  next:               ¬termination_intent ∧ ¬Esc → derive next-cycle default' (count-based) → cycle_n += 1, Phase 3 → Phase 1 (per-cycle re-scan)
  terminate_implicit: TerminationIntent = ImplicitTermination (parsed from Phase 2 free response) → Phase 3 → converge with residual filled by default_at_surfacing (the Λ.default_for_residual value Phase 2 surfaced — NOT re-derived) or user-stated override
  terminate_explicit: TerminationIntent = ExplicitTermination (parsed from Phase 2 free response) → Phase 3 → Phase 4 (final gate)
  esc:                Esc → ungraceful deactivate (residual untreated)

Per-cycle re-scan: Phase 1 substrate scan (Read/Grep/Glob) re-executes each cycle; `Λ.domains_touched` (anchored ⊔ non-anchored ⊔ resolved/dismissed) is the dedup source — no domain surfaced twice.
Cycle 1 ordering: AI Impact ordering selects highest-impact domain.
Cycle k≥2 ordering: previous cycle's A[cycle_n-1] or free-response routes next cycle's domain selection frame; AI re-applies Impact ordering within the routed frame.

Answer types (UserSupplies/AIPropose/AIAutonomous/Dismiss) determine BoundaryMap entry, not loop path.
FinalGateAnswer subset {UserSupplies, AIAutonomous} ⊆ BoundaryClassification determines residual BoundaryMap entries at Phase 4.

Round-local BoundaryMap invariant: after each Phase 3 integrate, `Λ.boundary_map` snapshot is always complete — classified entries ∪ (residual ↦ default_for_residual). The complete snapshot is the round-local terminator: ImplicitTermination at any cycle commits the current snapshot as DefinedBoundary.

Convergence evidence: At convergence (Phase 3 ImplicitTermination ∨ Phase 4 completed), present transformation trace — per-cycle (Sub-D[k], Δessence[k], BoundaryClassification[k]) ∀ k ∈ [1, cycle_n] (k bound by ∀ quantifier), plus residual disposition:
  • ImplicitTermination: ∀ d ∈ residual: (d, default_for_residual_or_override) with cited EssenceTrend basis
  • Phase 4 completion: ∀ d ∈ residual: (d, FinalGateAnswer(d))
BoundaryEssence is presented as separate session text artifact. Convergence is demonstrated, not asserted.

── CONVERGENCE ──
converge iff (Phase 3 ImplicitTermination ∨ Phase 4 completed) ∧ ¬user_esc
  Phase 3 ImplicitTermination: residual ↦ default_at_surfacing (the Phase 2-surfaced default — NOT the re-derived value) or user-stated override; emit DefinedBoundary directly from current B_snapshot
  Phase 4 completed:           bulk_classify(residual) finished — reachable via Phase 3 ExplicitTermination OR Phase 1 substrate exhaustion
  user_esc:                    user exits via Esc key at any Phase 2 or Phase 4 (ungraceful, residual untreated, BoundaryEssence finalized at current cycle_n)

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Probe (sense)        → Internal analysis (silent — no user output; heuristic boundary-undefined detection + session-context scan for prior BoundaryMap as B_prior seed; seed visibility deferred to Phase 2 cycle 1 surfacing)
Phase 1 Ctx   (observe)      → Read, Grep, Glob (per-cycle re-scan: CLAUDE.md, boundaries.md, rules/, prior session context; Λ.D_history dedup)
Phase 2 Qc    (constitution) → present (mandatory; per-cycle classification + Δessence + cycle_n + current B_snapshot + current default_for_residual with count-distribution basis cite + cycle-1 seed notice when Λ.B_prior non-empty + free-response termination affordance with implicit/explicit sub-signals + ambiguity-confirmation relay when parse is uncertain; Esc → loop termination, not an Answer)
Phase 3 parse  (sense)       → Internal analysis (TerminationIntent parsing into ImplicitTermination(override?) / ExplicitTermination / no-signal; ambiguous parse triggers one-turn relay confirmation before routing)
Phase 3       (track)        → Internal state update (integrate(typed_A, B, BoundaryEssence) → B', BoundaryEssence'; on loop continuation only: derive(EssenceTrend, history') → default'; refresh B-snapshot for next cycle)
Phase 4 Qf    (constitution) → present (residual bulk classification {UserSupplies, AIAutonomous}; reached via ExplicitTermination or substrate exhaustion; Esc → ungraceful exit at final gate)
converge      (extension)    → TextPresent+Proceed (per-cycle trace + residual disposition trace + BoundaryEssence artifact; proceed with defined boundary)

── MODE STATE ──
Λ = { phase: Phase, T: TaskScope,
      B_prior: Optional(BoundaryMap),                  -- hermeneutic seed detected at Phase 0 (prior BoundaryMap in session context)
      cycle_n: Nat,
      domains_touched: Set(Domain),                    -- accumulated across cycles (Phase 1 surfacing union)
      D_history: List<Sub-D>,                          -- per-cycle dimension projections (dedup source)
      essence_history: List<Δessence>,                 -- per-cycle delta accumulation
      boundary_essence: BoundaryEssence,               -- accumulated essence text
      essence_trend: EssenceTrend,                     -- ExtensionTrend | ConstitutionTrend | MixedTrend; updated each Phase 3
      default_for_residual: BoundaryClassification,    -- DefaultClassification derived from essence_trend; provisional residual disposition surfaced each Phase 2
      context_resolved: Set(Domain),                   -- Phase 1 auto-resolved (Bᵣ-equivalent, per-cycle) ∪ B_prior-seeded domains (Phase 0 init; basis: "prior classification" — entries mutable across cycles, may be re-surfaced by Phase 1 if a stale-prior signal is detected)
      user_responded: Set(Domain),                     -- Phase 2 4-value classification completed
      final_gate_classified: Set(Domain),              -- Phase 4 bulk classification completed
      dismissed: Set(Domain),
      residual: Set(Domain),                           -- unclassified subset of domains_touched (implicit-delegation candidates; provisionally mapped to default_for_residual in boundary_map snapshot)
      boundary_map: BoundaryMap,                       -- always-complete after each Phase 3: classified entries ∪ (residual ↦ default_for_residual)
      final_gate_answers: Map(Domain, FinalGateAnswer),
      history: List<(Domain, A)>,
      active: Bool, cause_tag: String }
-- Invariant: domains_touched = context_resolved ∪ user_responded ∪ final_gate_classified ∪ dismissed ∪ residual (pairwise disjoint)
-- Invariant: boundary_map = classified_entries(context_resolved ∪ user_responded ∪ dismissed ∪ final_gate_classified) ∪ (residual ↦ default_for_residual) — round-local completeness

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Dimension resolution emergent via session context.
Hermeneutic carry-over: an optional B_prior input (prior BoundaryMap detected in session context) seeds the new invocation; seed entries are mutable in subsequent cycles and BoundaryEssence is re-crystallized from the current task scope. The seed enables a feedback loop where a downstream observation refines a prior BoundaryMap through re-invocation.
Round-local BoundaryMap composition: each Phase 2 cycle produces a complete BoundaryMap (classified entries ∪ residual ↦ default_for_residual). The complete snapshot is citable as scope text for a realization-layer turn-condition primitive — the AIAutonomous and AIPropose entries delineate an Extension-progression scope whose exhaustion is a natural completion condition orthogonal to the in-protocol satisfaction signal that emits DefinedBoundary.
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

**Hermeneutic seed (B_prior)**: At Phase 0, AI scans the current session context for a prior BoundaryMap emitted by an earlier `/bound` invocation in this session. If detected, the prior BoundaryMap seeds `Λ.B_prior`; its entries are imported into the starting `boundary_map` but remain mutable across subsequent cycles. The seed enables a feedback loop where a downstream observation (e.g., post-`/goal` execution misalignment) refines the prior BoundaryMap through re-invocation. Cross-session recall via `/recollect` heuristics remains advisory input only and does not seed `B_prior`.

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

**Advisory relationships**: Provides to Aitesis, Prothesis, Prosoche, Analogia, Syneidesis, Euporia, Elenchus (all advisory: BoundaryMap narrows scope; for Elenchus, narrows high-leverage source range). Receives from Euporia (advisory: resolved coordinates inform downstream boundary definition), Elenchus (advisory: vetting findings inform downstream boundary definition). Katalepsis is structurally last.

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
| ImplicitTermination satisfaction signal (free-response: accept current snapshot, residual delegated to default) | Emit DefinedBoundary with classified entries + (residual ↦ default_for_residual or user-stated override), BoundaryEssence finalized at current cycle_n |
| ExplicitTermination satisfaction signal (free-response: proceed to Phase 4 for residual classification) → Phase 4 completed | Emit DefinedBoundary with classified entries + (residual ↦ FinalGateAnswer), BoundaryEssence finalized |
| Phase 1 substrate exhaustion → Phase 4 completed | Same as ExplicitTermination outcome; AI-detected via empty Sub-D rather than user-signaled |
| User Esc key | Ungraceful exit — residual untreated, BoundaryEssence finalized at current cycle_n |

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

Verify task scope contains boundary-undefined signal and optionally seed a prior BoundaryMap. This phase is **silent** — no user interaction and no user-visible output. Any user-facing notice about the seed is deferred to Phase 2 cycle 1.

1. **Probe task scope** `T` for boundary-undefined signal: architecture choices, configuration preferences, quality standards, delegation scope, convention decisions, risk tolerance
2. **Check assignment**: assess whether ownership signal is present (existence check, not exhaustive enumeration — full domain set is **cycle-emergent** via Phase 1 per-cycle re-scan)
3. **Scan for B_prior seed (scoped detection)**: inspect current session context for a prior BoundaryMap emitted by an earlier `/bound` invocation in this same session. The detection target is structurally a Horismos `DefinedBoundary` artifact (BoundaryMap structure: domain → BoundaryClassification entries with cited basis) emitted at a previous `/bound` convergence — NOT a `/recollect` recall artifact and NOT a hypomnesis store entry. `/recollect`-recalled classifications stay in the "Cross-session enrichment" advisory channel; they do not populate `Λ.B_prior`. If a `/bound` emit is detected AND the current task scope is a refinement or feedback iteration of the prior scope, bind `Λ.B_prior` to that BoundaryMap; otherwise leave `Λ.B_prior = ⊥`.
4. If no boundary-undefined signal: present finding with reasoning for user confirmation before proceeding (Horismos not activated)
5. If boundary-undefined signal present: initialize `cycle_n = 1`, `BoundaryEssence = ""`, `Λ.essence_trend = MixedTrend`, `Λ.default_for_residual = AIAutonomous` (Extension-default initial), `Λ.boundary_map = Λ.B_prior ∪ ∅` (seed if present, else empty). When `Λ.B_prior ≠ ⊥`, also initialize the partition: `Λ.context_resolved = domain(Λ.B_prior)`, `Λ.domains_touched = domain(Λ.B_prior)` — seeded domains enter the `context_resolved` partition with basis "prior classification" so the MODE STATE partition invariant holds from Phase 0 onwards. Proceed to Phase 1.

**Probe scope**: Current task scope, conversation history, CLAUDE.md rules, boundaries.md, project conventions, prior `/bound` convergence emit in session text. Does NOT modify files or call external services.

**Per-cycle-emergent semantics**: Phase 0 records the existence signal only. Per-cycle re-scan (Phase 1) discovers domains incrementally, enabling user-judged termination at any cycle as the loop progresses.

### Phase 1: Per-Cycle Context Collection + Anchor Selection

Re-scan substrate for the current cycle and select one anchor domain (`Sub-D[cycle_n]`).

1. **Per-cycle re-scan** — Call Read/Grep/Glob for boundary signals in CLAUDE.md, rules/, boundaries.md, project configuration. Skip domains already in `Λ.domains_touched` (single-source dedup — covers `Λ.D_history ∪ Λ.context_resolved ∪ Λ.user_responded ∪ Λ.dismissed ∪ Λ.residual` per the MODE STATE invariant). **Stale-seed re-surface**: when a re-scan signal contradicts an existing `B_prior`-seeded entry in `Λ.context_resolved` (e.g., the current substrate shows the seed's classification no longer fits — new convention, deleted file, shifted scope), remove that entry from `Λ.context_resolved` and append the domain to the newly-surfaced set so anchor selection (step 2) and non-anchored accumulation (step 5) can re-process it; the seed's mutability provision applies. This is the mechanism that closes the feedback loop claimed by COMPOSITION's hermeneutic carry-over — stale seeds become candidates for re-classification, not invisible holdovers.
2. **Anchor selection** — From newly-surfaced (not in `Λ.domains_touched`) domains:
   - **Cycle 1**: AI Impact ordering selects highest-impact domain as `Sub-D[1]`. When `Λ.B_prior` is non-empty, Impact ordering may prefer domains where a prior classification appears stale relative to the current task scope (refinement target — stale seeds re-surfaced via step 1's re-surface mechanism are candidate anchors).
   - **Cycle k≥2**: previous cycle's answer `A[cycle_n-1]` or free-response routes the substrate scan frame; the routed frame must narrow or refocus relative to the just-classified boundary's neighborhood (not duplicate the prior cycle's frame). Per-answer-type heuristics inform AI judgment but are not normative: `Dismiss` deprioritizes the topic cluster the dismissed domain belonged to; `UserSupplies`/`AIPropose`/`AIAutonomous` narrow toward adjacent unclassified domains in the same cluster. AI re-applies Impact ordering within the routed frame to select `Sub-D[cycle_n]`.
3. **Context enrichment** — For the anchor domain, collect evidence (file/line citations, rule references, conflicting signals).
4. **Auto-resolve check** — If anchor domain has definitive boundary assignment found in substrate: set `auto_resolved = true`, append to `Λ.context_resolved` and `Λ.boundary_map` (with cited basis), append anchor to `Λ.D_history` and `Λ.domains_touched`, signal `Phase 1 → Phase 3` (skip Phase 2 for this cycle).
5. **Non-anchored domain accumulation** — Append every other surfaced-but-not-anchored domain to BOTH `Λ.residual` AND `Λ.domains_touched` (preserves dedup invariant). Residual domains receive provisional classification `Λ.default_for_residual` in the current `boundary_map` snapshot view; the provisional classification is committed if the user signals ImplicitTermination, or overwritten by `FinalGateAnswer` if Phase 4 is entered.
6. **Anchor commit** — Append `Sub-D[cycle_n]` to `Λ.D_history` and `Λ.domains_touched`.
7. If anchor enriched and not auto-resolved: signal `Phase 1 → Phase 2`.
8. If no new domains surface this cycle (substrate exhausted): signal `Phase 1 → Phase 4` (substrate-exhaustion path to explicit bulk classify).

**Scope restriction**: Read-only investigation only. No file modifications.

### Phase 2: Per-Cycle Classification + Essence Surfacing + B Snapshot (Constitution)

**Present** the cycle's anchor domain (`Sub-D[cycle_n]`), accumulated essence (`Δessence[k-1]`), cycle counter, and the round-local complete BoundaryMap snapshot with current implicit-delegation default via Cognitive Partnership Move (Constitution).

**Surfacing format**:

Present as text output:
- **Cycle**: `cycle_n` (always visible)
- **Prior BoundaryMap seeded** (cycle 1 only, when `Λ.B_prior ≠ ⊥`): list the (Domain → BoundaryClassification) entries imported from B_prior with their prior-classification basis. This is the user's first user-visible notice of the seed (Phase 0 was silent); presented BEFORE the anchor so the seed context is established for cycle 1's anchor selection.
- **Anchor domain**: [Sub-D[cycle_n].domain.name] — [description]
- **Substrate evidence**: [evidence cited from Read/Grep/Glob with file:line]
- **Boundary essence so far** (`BoundaryEssence`): [accumulated crystallized form of the responsibility boundary space — empty at cycle 1, refined cumulatively. The B_prior seed seeds the boundary_map but does NOT pre-populate BoundaryEssence — essence is re-crystallized from the current task scope.]
- **Δessence proposed for this cycle**: [how this domain's classification refines the abstract responsibility boundary essence]
- **Current BoundaryMap snapshot** (round-local complete view):
  - Classified entries: [list of (Domain → BoundaryClassification) for context_resolved ∪ user_responded ∪ dismissed]
  - Residual entries (provisional, ↦ default): [list of (Domain → default_for_residual)]
- **Implicit-delegation default** (`default_for_residual`): [current BoundaryClassification] — derived from EssenceTrend = [ExtensionTrend | ConstitutionTrend | MixedTrend].
  - **Cycle 1 basis cite (mandatory format)**: when `cycle_n = 1`, the cite MUST read: "MixedTrend (cycle 1 initialization — no classification history; Extension-default fallback)". Do NOT fabricate a count distribution or essence-trajectory citation at cycle 1.
  - **Cycle k ≥ 2 basis cite**: count distribution of classified entries (e.g., "2 × UserSupplies, 3 × AIAutonomous, 0 × AIPropose, 1 × Dismissed → AIAutonomous count dominant → ExtensionTrend → AIAutonomous"). Count distribution is the sole derivation basis (count-based only; no textual-lean interpretation).

Then **present**:

```
How should boundary ownership be classified for this domain?

Options:
1. **User-supplies** — I already have the answer: [what user would provide]
2. **AI-proposes** — AI drafts options, I select/steer: [what AI would propose]
3. **AI-autonomous** — AI decides within scope: [what AI would determine]
4. **Dismiss** — Proceed with [stated default assumption]

If satisfied with the BoundaryMap snapshot above, you can end the loop now:
  • Accept the current snapshot — say so in natural language; remaining N residual
    domains will be committed as [default_for_residual]. DefinedBoundary emitted directly.
    You may override the default in the same utterance (e.g., "accept but default to UserSupplies").
  • Explicit classification — say you want to bulk-classify the residual yourself;
    Phase 4 will surface for residual classification with {UserSupplies, AIAutonomous}.
```

**Free-response termination affordance**: Phase 2 surfacing prose includes both satisfaction signal paths (ImplicitTermination — commit current snapshot with default; ExplicitTermination — proceed to Phase 4). Phase 3 parses the utterance into the corresponding TerminationIntent sub-type while the typed coproduct `A ∈ {UserSupplies, AIPropose, AIAutonomous, Dismiss}` stays intact (gate integrity invariant — option set presented intact).

**Design principles**:
- **Cycle counter visibility**: `cycle_n` surfaced at every Phase 2 — user perceives signal density.
- **Essence visibility per cycle**: `Δessence` and accumulated `BoundaryEssence` shown — periagoge contribution makes the abstract responsibility boundary crystallization visible per cycle.
- **Round-local snapshot visibility**: the complete BoundaryMap snapshot (classified ∪ residual ↦ default) is surfaced each cycle — user sees the exact state that ImplicitTermination would commit.
- **Default visibility with derivation cite**: `default_for_residual` is shown with its EssenceTrend basis — implicit-delegation becomes informed Constitution (the user recognizes what they would commit to before signaling termination).
- **Substrate-cited evidence**: every surfaced datum carries file/line citation.
- **Residual transparency**: user sees the explicit list of domains that would be implicitly delegated.
- **Free-response termination**: natural-language signal honored across both sub-types (Implicit / Explicit) while the typed coproduct is preserved.

### Phase 3: Per-Cycle Integration + Essence Crystallization + Default Derivation

After user response. Step ordering matters: termination parsing and the integrate step (classified-portion update) precede default re-derivation. ImplicitTermination commits with the default value that was visible in the just-completed Phase 2 surfacing (`default_at_surfacing`), NOT a re-derived value — the user's recognition must match the committed disposition.

0. **Snapshot the surfaced default** — `default_at_surfacing := Λ.default_for_residual` (the value Phase 2 just displayed). This is the value any ImplicitTermination will commit. Re-derivation in step 5 (if reached) writes a NEW `Λ.default_for_residual` intended for the NEXT cycle's Phase 2, never for this round's commit.
1. **Parse answer** — distinguish 4-value `BoundaryClassification` selection (for current anchor domain) from free-response `TerminationIntent` (with optional `default_override`). If both signals are present, the typed selection takes effect for the current anchor domain AND `TerminationIntent` routes the loop.
   - Parsing rule for `TerminationIntent`:
     - Free response signals satisfaction without an explicit residual-review request → `ImplicitTermination(default_override = none)`
     - Free response signals satisfaction plus a user-named `BoundaryClassification` as the alternative default → `ImplicitTermination(default_override = stated_classification)`
     - Free response signals satisfaction with an explicit request for residual bulk classification → `ExplicitTermination`
     - No satisfaction signal → no termination_intent
   - **Ambiguity-confirmation relay**: if the free response is plausibly interpretable as either ImplicitTermination (commit residual to default) OR ExplicitTermination/continue-loop (review remaining) — for example "looks good but can we check the rest?" — DO NOT silently route. Present a one-turn relay confirmation surfacing the parsed intent: "I read this as [ImplicitTermination — committing residual as {default_at_surfacing}] / [ExplicitTermination — proceeding to Phase 4 for residual classification]. Correct?" The user's confirmation (or correction) routes the loop. One extra turn vs an irreversible commit on the wrong reading.
2. **Update BoundaryMap (classified portion only)** — `integrate(typed_A, B, BoundaryEssence) → (B', BoundaryEssence')`. Apply the typed answer's classification to the current anchor domain in `Λ.boundary_map`. This step does NOT touch `Λ.default_for_residual` or `Λ.essence_trend`.
   - **UserSupplies(scope)**: Record anchor in `Λ.boundary_map`; downstream gates present open questions for user-provided values.
   - **AIPropose(scope)**: Record as AI-proposes; downstream protocols expand candidate generation (ENRICH-AND-PRESENT).
   - **AIAutonomous(scope)**: Record as AI-autonomous; downstream protocols may elide gates (RESOLVE-OR-PRESENT).
   - **Dismiss**: Mark dismissed; record default assumption.
3. **Crystallize Δessence** — append `Δessence` to `Λ.essence_history`; update `Λ.boundary_essence` by integrating the delta.
4. **Routing** (before any re-derivation):
   - If `TerminationIntent = ImplicitTermination(override?)` after step 1 confirmation: `finalize(B', Λ.residual, default_at_surfacing | override)` — every residual domain in `Λ.residual` is committed with `default_at_surfacing` (the Phase 2-visible value) or `override` if user stated one. Emit DefinedBoundary, converge directly. Steps 5–7 below are SKIPPED.
   - If `TerminationIntent = ExplicitTermination` after step 1 confirmation: proceed to Phase 4. Steps 5–7 below are SKIPPED (residual classification belongs to Phase 4, not to a next cycle's snapshot).
   - If `Esc`: ungraceful deactivate. Steps 5–7 SKIPPED.
   - Else (no termination signal): continue to step 5 (prepare next cycle's snapshot).
5. **Derive next-cycle EssenceTrend** (count-based ONLY — no textual-lean interpretation): analyze `Λ.history` count distribution across classified entries.
   - count(AIPropose ∪ AIAutonomous) strictly dominant → `ExtensionTrend`
   - count(UserSupplies) strictly dominant → `ConstitutionTrend`
   - No strict dominance OR `cycle_n < 2` (explicit single-cycle initialization rule — see Rule 11) → `MixedTrend`
   - Update `Λ.essence_trend`.
6. **Derive next-cycle DefaultClassification** — `Λ.default_for_residual ← DefaultClassification(Λ.essence_trend)`:
   - `ExtensionTrend → AIAutonomous`
   - `ConstitutionTrend → UserSupplies`
   - `MixedTrend → AIAutonomous` (Extension-default fallback)
   This new `Λ.default_for_residual` is the value the NEXT cycle's Phase 2 will surface, NOT the value that just-committed any termination (which used `default_at_surfacing`).
7. **Refresh next-cycle boundary_map snapshot** — `Λ.boundary_map = classified_entries ∪ (Λ.residual ↦ Λ.default_for_residual)`. Append `(Domain, A)` to `Λ.history`. `cycle_n += 1`, return to Phase 1.

### Phase 4 (Optional Path): Final Gate — Residual Bulk Classification (Constitution)

**Phase 4 is reached via** (a) Phase 3 `ExplicitTermination` satisfaction signal — user opts into explicit residual classification rather than implicit-delegation, or (b) Phase 1 substrate exhaustion when no further domains surface and at least one residual remains. ImplicitTermination bypasses Phase 4 entirely (residual committed with `default_for_residual` directly from Phase 3).

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
| Light | 1-2 cycles, narrow task scope, residual minimal | Brief per-cycle anchor + Δessence + B_snapshot; typical termination via ImplicitTermination |
| Medium | 3-5 cycles, multi-domain task scope | Structured per-cycle surfacing + accumulated essence + B_snapshot with default visibility; ImplicitTermination or Phase 4 per user judgment |
| Heavy | 6+ cycles, broad task scope, rich essence trajectory | Detailed evidence + per-cycle Δessence + B_snapshot; ExplicitTermination → Phase 4 with mixed-disposition residual common |

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | `activate(Horismos) only if ∃ domain(d) : ¬assigned(d) ∧ ¬trivially_defaultable(d)` | Prevents false activation on clear tasks |
| Per-cycle re-scan | Phase 1 substrate scan runs each cycle; `Λ.D_history` deduplicates | Cycle-emergent domain surfacing without redundant queries |
| One anchor per cycle | One domain anchored per Phase 2 cycle | Prevents per-cycle classification overload; residual provisionally maps to `default_for_residual` |
| Cycle counter visibility | `cycle_n` surfaced at every Phase 2 | User perceives signal density and decides when to terminate |
| Essence visibility per cycle | `Δessence` and accumulated `BoundaryEssence` shown at Phase 2 | Periagoge crystallization made visible per cycle |
| Round-local snapshot visibility | Complete `boundary_map` snapshot (classified ∪ residual ↦ default) surfaced each Phase 2 | User sees the exact state that ImplicitTermination would commit |
| Default visibility with derivation cite | `default_for_residual` shown with count-distribution basis at cycle k ≥ 2; at cycle 1 the cite explicitly states "MixedTrend (cycle 1 initialization)" | ImplicitTermination becomes informed Constitution — user recognizes default before signaling termination; cycle 1 fabrication blocked |
| Surfaced-default commit invariant | ImplicitTermination commits with the default value visible in the just-completed Phase 2 (`default_at_surfacing`), never the re-derived value | Phase 3 re-derivation does not silently change what the user just accepted |
| Free-response termination affordance (bifurcated) | Phase 2 prose includes both ImplicitTermination (commit snapshot with default) and ExplicitTermination (proceed to Phase 4) sub-signals | User-judged termination path while typed coproduct preserved (gate integrity invariant) |
| Ambiguity-confirmation relay | When the free response is plausibly readable as either ImplicitTermination or continue/Explicit, Phase 3 surfaces the parsed intent for one-turn confirmation before routing | One extra turn vs irreversible commit on misread intent |
| Default override affordance | User may state alternative default classification in the same satisfaction utterance | Override exercise preserves Recognition without expanding typed option set |
| Residual transparency | Phase 2 lists every residual domain with provisional default mapping; Phase 4 lists every residual for explicit classification | User sees both the count and the identity of domains under implicit delegation |
| Hermeneutic seed visibility (Phase 2 cycle 1) | When `Λ.B_prior` non-empty, the seed import is surfaced as a "Prior BoundaryMap seeded" notice at Phase 2 cycle 1 (Phase 0 stays silent); seeded domains enter `context_resolved`; Phase 1 stale-seed re-surface mechanism re-classifies entries whose prior fit no longer holds | Cross-invocation feedback loop visible at the first user-facing surfacing; partition invariant preserved; stale seeds become candidate anchors rather than invisible holdovers |
| Session immunity | Dismissed (domain, description) → skip for session | Respects user's dismissal |
| Auto-resolve preferred | Context-resolved domains skip Phase 2 within their cycle | Minimizes user interaction |
| Recognition over recall | Present options (per-cycle: UserSupplies/AIPropose/AIAutonomous/Dismiss; Phase 4: UserSupplies/AIAutonomous subset) | Bound by typed coproducts |
| Esc semantics | Esc → ungraceful exit; residual untreated | Distinguishes hard exit from satisfaction-driven termination |
| BoundaryEssence artifact | Output as separate session text alongside BoundaryMap at convergence | Periagoge contribution preserved as inspectable trace |

## Rules

1. **AI-guided, user-classified**: AI detects boundary-undefined signal and surfaces per-cycle anchors; classification requires user choice via Cognitive Partnership Move (Constitution) at Phase 2 (per-cycle 4-value) and at Phase 4 if entered (final gate 2-value). AI detection is implicitly confirmed when the user engages with classification.
2. **Recognition over Recall**: Present structured options with differential futures via Cognitive Partnership Move (Constitution); Constitution interactions yield turn for response. Phase 2 binds to `A ∈ {UserSupplies, AIPropose, AIAutonomous, Dismiss}` plus a complete BoundaryMap snapshot with provisional `default_for_residual` visible (so ImplicitTermination is informed); Phase 4 binds to `FinalGateAnswer = {UserSupplies, AIAutonomous} ⊆ BoundaryClassification` (per TYPES).
3. **Per-cycle context collection**: Each cycle's Phase 1 re-scans substrate (CLAUDE.md, rules/, boundaries.md, project configuration); `Λ.D_history` prevents duplicate domain surfacing. (Detailed step procedure in Phase 1 prose.)
4. **Definition over Assumption**: When boundary ownership is unclear, define explicitly rather than assume — silence is worse than a dismissed classification.
5. **No fixed taxonomy**: Domains emerge dynamically from each task probe; the `Domain = { name, description, evidence }` type carries no category constructor — taxonomy emerges from the task context.
6. **Context resolution preferred**: Auto-resolve from existing config, rules, and conventions where possible within the cycle's anchor. Minimize user interaction to what truly requires human judgment.
7. **One anchor per cycle**: Each Phase 2 cycle presents one anchor domain (`Sub-D[cycle_n]`); the PHASE TRANSITIONS edge `Phase 1 → Phase 2: Sub-D[cycle_n] non-empty ∧ ¬auto_resolved` binds the per-cycle cardinality. Surfaced-but-not-anchored domains accumulate into `Λ.residual` and are provisionally mapped to `Λ.default_for_residual` in the round-local snapshot; final disposition is committed by ImplicitTermination (default fill) or by Phase 4 explicit bulk classification.
8. **Impact ordering**: Per-cycle anchor selected by Impact — highest-impact at cycle 1; previous answer or free-response routes the substrate scan frame at cycle k≥2, with Impact re-applied within the routed frame. Impact is relational to downstream protocol dependencies. (Detailed per-answer-type heuristics in Phase 1 prose.)
9. **Per-decision boundary with hermeneutic carry-over**: Each invocation produces a fresh `BoundaryEssence` for the current task scope. A prior `BoundaryMap` detected in current session context as a Horismos `DefinedBoundary` emit (NOT a `/recollect` recall artifact, NOT a hypomnesis store entry) may seed `Λ.B_prior` (Phase 0 step 3); seeded entries are imported into the starting `boundary_map` AND into `Λ.context_resolved ∩ Λ.domains_touched` so the MODE STATE partition invariant holds from Phase 0. Seeded entries remain mutable across cycles; Phase 1's stale-seed re-surface mechanism (Phase 1 step 1) re-classifies entries whose prior fit no longer holds, closing the COMPOSITION feedback loop. Cross-session recall (hypomnesis or `/recollect`) remains advisory heuristic input on candidate classifications only and does not seed `B_prior`.
10. **Context-Question Separation**: Analysis, evidence, rationale, the BoundaryMap snapshot, and the `default_for_residual` with derivation cite all appear as text before the gate; the question contains only the essential question, options carry only option-specific differential implications. Embedding context in question fields = protocol violation.
11. **Convergence evidence**: At convergence (Phase 3 ImplicitTermination ∨ Phase 4 completed), present per-cycle trace (∀ k ∈ [1, cycle_n]: (Sub-D[k], Δessence[k], BoundaryClassification[k])) plus residual disposition trace — ImplicitTermination: (∀ d ∈ residual: (d, default_for_residual_or_override) with cited EssenceTrend basis); Phase 4 completion: (∀ d ∈ residual: (d, FinalGateAnswer(d))). BoundaryEssence as separate session text artifact. Convergence is demonstrated, not asserted.
12. **Zero-signal surfacing**: If Phase 0 probe detects no boundary-undefined signal, present this finding with reasoning for user confirmation.
13. **Option-set relay test (Extension classification)**: If AI analysis converges to a single dominant option (option-level entropy→0 — Extension mode of the Cognitive Partnership Move), present the finding directly. Each Constitution option must be genuinely viable under different user value weightings. Options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options.
14. **Gate integrity** (Safeguard tier — revisitable as model capability evolves; revision triggers: model upgrade with demonstrated instruction-following improvement, sustained low violation rate across sessions, or successful compression PR demonstrating guard reducibility without outcome loss): The defined option sets (per-cycle 4-value `A`, Phase 4 2-value `FinalGateAnswer`) are presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation. Horismos-specific: the free-response termination affordance and its bifurcation into ImplicitTermination / ExplicitTermination sub-signals is positioned in Phase 2 surfacing prose (natural-language satisfaction signal guidance), not in the typed coproduct; Phase 3 parses `termination_intent` from free response and routes to either converge (Implicit) or Phase 4 (Explicit) — the affordance lives in prose rather than in the typed coproduct, so option-set integrity is preserved. Default override is free-response parsing into `ImplicitTermination(default_override)`, not an option-set extension. Ambiguous parses (response readable as either Implicit or Explicit/continue) trigger a one-turn relay confirmation before routing — see Rule 20.
15. **Final gate UserSupplies — lazy-binding semantic**: Phase 4 `UserSupplies(domain)` records the disposition with the residual domain as scope. The `FinalGateAnswer` coproduct (subset of BoundaryClassification) contains no routing constructor — BoundaryMap entries carry only the typed disposition, and value provision or protocol invocation decisions occur when the user activates downstream protocols. User decision authority is preserved at the residual disposition.
16. **Conjecture disclosure**: Per-cycle-emergent loop + essence crystallization + always-complete BoundaryMap snapshot is a structural-fit conjecture under accumulating use. Loop topology revision waits on variation-stable retention evidence accumulating across invocations.
17. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
18. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
19. **Default visibility — informed Constitution**: The `default_for_residual` and its derivation (count-distribution basis at cycle k ≥ 2; explicit "MixedTrend (cycle 1 initialization)" cite at cycle 1) are surfaced at every Phase 2 round before the gate. ImplicitTermination is only legitimate Constitution when the user has recognized the default they are committing to. Silent default = uninformed delegation — AI exercises the residual disposition without the user recognizing what they are committing to, which collapses the Detection-with-Authority separation that distinguishes AI surfacing from user judgment. The commit invariant: ImplicitTermination commits with `default_at_surfacing` (the value visible in the just-completed Phase 2), NEVER a Phase-3-re-derived value — Phase 3 re-derivation produces the NEXT cycle's default only. Override paths must be reachable in the same prose, parsed as `ImplicitTermination(default_override : BoundaryClassification)`.
20. **Ambiguity-confirmation relay**: When Phase 3 step 1 parses a free response that is plausibly readable as either ImplicitTermination (commit residual to default) or ExplicitTermination/continue (review remaining or proceed to Phase 4), present a one-turn relay confirmation surfacing the parsed intent before routing: "I read this as [parsed intent]. Correct?" The user's confirmation or correction routes the loop. The cost is one turn; the avoided cost is an irreversible commit on misread intent. Does NOT apply when the parse is unambiguous.
21. **Single-cycle MixedTrend (explicit design choice)**: When `cycle_n < 2`, EssenceTrend is forced to `MixedTrend` and `default_for_residual` resolves to `AIAutonomous` (Extension-default fallback) regardless of any single prior answer — a single classification is insufficient to commit a count-dominance trend. Consequence: single-cycle ImplicitTermination always commits residual to `AIAutonomous` unless the user supplies a `default_override`. This is an inscribed design choice for Recognition reliability (one observation cannot signal a trend); cycle 1 basis cite makes it explicit, and override reachability provides the escape hatch.

**Cross-session enrichment**: Accumulated boundary preferences from Anamnesis's hypomnesis store (session recall indices written by the SessionEnd/PreCompact hook) serve as heuristic input for Phase 1 calibration proposals — per-decision freshness governs the actual classification. In parallel, when **`/recollect`** has been invoked this session, recalled context surfaces prior BoundaryMap classifications for structurally similar domains as classification candidates for Phase 1 — per-decision freshness governs evaluation. Constitution judgment remains with the user. **Distinction from hermeneutic carry-over (Rule 9)**: cross-session hypomnesis/recollect inputs are advisory heuristics on candidate classifications; `Λ.B_prior` is a within-session seed of an actual prior Horismos `DefinedBoundary` emit into the starting `boundary_map` (structurally scoped to `/bound` convergence artifacts in session text, not `/recollect` recall). The two operate at different layers (advisory vs structural seed).
