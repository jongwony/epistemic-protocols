---
name: apportion
description: "Apportion an autonomous goal into coarse execution units and derive each unit's completion conditions before the run begins. Cuts the goal at its evidenced seams so each unit fits one execution horizon and every goal obligation lands in some unit, derives per-unit completion and invariant predicates plus the cross-unit plan conditions, and emits one resolution certificate per unit: a conjoined predicate when completion compiles, otherwise an accepted-uncovered witness that retains any invariant conjuncts; risks needing pre-action interception are declared out of scope. Pre-conduct: unit boundaries and conditions only — order, independence, reconciliation and routing stay /conduct's. Type: (GoalPlanUncompiled, User, APPORTION, AutonomousGoal × ExecutionHorizon) → ConditionBearingUnitPlan. Alias: Merismos(μερισμός)."
---

# Merismos Protocol

Apportion an autonomous goal into coarse execution units and derive each unit's completion conditions before the run begins: cut the goal at its evidenced seams so each unit fits one execution horizon and no obligation is orphaned, derive per-unit completion and invariant predicates plus the cross-unit plan conditions, and emit one goal entry per unit. Type: `(GoalPlanUncompiled, User, APPORTION, AutonomousGoal × ExecutionHorizon) → ConditionBearingUnitPlan`.

## Definition

**Merismos** (μερισμός: a dividing into parts, an apportionment): A dialogical act of apportioning an autonomous goal — deciding **which units the goal is carried out in** and **what each unit's done means** — when the goal is stated but its plan is uncompiled. The protocol's lexical verb is `/apportion`. It reads the goal's obligations, cuts them into coarse units at seams it can cite, judges each unit against one execution horizon, derives a completion predicate and any invariant predicates per unit, separates the conditions whose subject is the whole goal rather than any one unit, and emits one goal entry per unit whose conditions are conjoined into a single leaf predicate — or, for a unit whose completion condition remains residual, an explicit accepted-uncovered certificate that still carries any compiled invariant conjuncts. Two invariants bind the result: every goal obligation belongs to some unit, and every unit fits one horizon or carries a recorded override. Merismos apportions and conditions; it does **not** order — sequence, independence, reconciliation, termination topology and routing are `/conduct`'s work, so the emitted plan is a **pre-conduct** artifact. The protocol holds no state during execution.

```
── FLOW ──
Merismos(G) → Probe(G) → goal_plan_uncompiled? →
  ¬autonomous_intent(G):  → relay(no autonomous interval in scope) (extension) → deactivate
  navigation block in scope ∧ (¬dereferenceable ∨ support-integrity failure): → relay(handoff unreadable — locator unreachable, missing its session half, or a load-bearing premise the grounding pass could not support) (extension) → deactivate
  condition_bearing(G):   → relay(units and conditions already present) (extension) → deactivate
  uncompiled: ReadObligations(G) → O_G → VelocityFilter(O_G) → oos → init_loop_state: U=∅, residual=O_G \ {d.obligation | d∈oos}, K=∅, R=∅, P=∅,
                              plan_conditions_derived=⊥, plan_conditions_stale=⊥, fit_overrides=∅, invariant_status=⊥, accepted=∅, unbounded_approved=⊥, loop:   -- init_loop_state runs EXACTLY ONCE, on this Phase 0 → Phase 1 edge; Phase 2's Reopen re-enters "loop:" directly without re-executing it
    Phase 1 Scan(G, residual) [per-cycle re-scan] → seams(residual) → Pack(seams, horizon) → (Anchor, proposed_unit, SpanFit) → qualify(that cut) → Seam →
      Anchor empty ∧ residual = ∅ ∧ U = ∅ ∧ oos = ∅:  → relay(goal's scope too thin to read any obligation — route to /inquire) (extension) → deactivate
      Anchor empty ∧ residual = ∅ ∧ (U ≠ ∅ ∨ oos ≠ ∅):  → Phase 2
      Anchor empty ∧ residual ≠ ∅:  → autonomous_pack(residual) (track) → [any packed unit with SpanFit ≠ Fits, or residual ≠ ∅ after packing: it re-enters as the next cycle's Anchor (reason surfaced as relay) → loop] | (U'' Fits-worthy) → ∀u∈U'': integrate_unit(u) → u' → U := U ∪ {u'}, residual := ∅ → surface (extension) → Phase 2
      SpanFit = Fits ∧ Pack's search finds no second Fits-worthy cut for Anchor: → relay(AcceptUnit) (extension) → integrate_unit → loop  -- option-set relay test
      else:                         → Qu(Anchor, proposed_unit, SpanFit, Seam, U_snapshot) → Stop → Aᵤ →
        Esc:                → ungraceful deactivate (EarlyExit — no emission, no handoff recorded)
        Aᵤ = AcceptUnit     → integrate_unit(proposed_unit) → loop                -- in Aᵤ's defined set iff SpanFit = Fits
        Aᵤ = Recut(d)       → re-derive the Anchor frame under d → loop           -- same residual, different cut
        Aᵤ = OverrideFit    → integrate_unit(proposed_unit) → u' → Λ.fit_overrides ∪= {u'.unit_ref} → loop  -- in Aᵤ's defined set iff SpanFit ≠ Fits
        Aᵤ = Sufficient     → autonomous_pack(residual) (track) → [any packed unit with SpanFit ≠ Fits, or residual ≠ ∅ after packing: next cycle's Anchor → loop] | (U'' Fits-worthy) → ∀u∈U'': integrate_unit(u) → u' → U := U ∪ {u'}, residual := ∅ → surface (extension) → Phase 2
    Phase 2 ∀u∈U, ¬derived_already(u,K,R): Derive(u) → (Set(κ), Set(ρ)) → K:=K∪κs, R:=R∪ρs ∥ [¬Λ.plan_conditions_derived: DerivePlan(G, U) → P; Λ.plan_conditions_derived := ⊤] →
      oos ≠ ∅ → OOS(oos) (extension)                                            -- obligations needing pre-action interception: out of scope, substrate named
      ¬acceptance_present(P) → Qt(K, P) → Stop → Vₜ →
        Vₜ = DefineNow(d)     → P := P ∪ {plan_condition(d)}; [Λ.unbounded_approved: Λ.unbounded_approved := ⊥]
        Vₜ = RouteBound       → deactivate                                       -- Rerouted
        Vₜ = ApproveUnbounded → Λ.unbounded_approved := ⊤
      BindPlanRequirements(P, U) → P := Pᵦ → check(U, K, R, Pᵦ, oos) → Λ.invariant_status := InvariantStatus   -- coverage_complete ∧ span_fit ∧ termination_covered ∧ obligations_derived ∧ oos_substrate_named ∧ plan_conditions_topology_free
      Λ.plan_conditions_stale → StaleNotice(P) (extension)                       -- pre-gate text before Qc: Adjust to update, or Confirm to keep as recorded
      Qc(U, K, R, P, InvariantStatus, oos) → Stop → V →
        V = Adjust(d)  → rederive(K, R, P, d) → (K, R, P) := (K', R', P') → Λ.plan_conditions_stale := ⊥ → [¬acceptance_present(P') → Qt(K', P') → Stop → Vₜ → P' updated as at Phase 2 entry] → [acceptance_present(P') ∧ Λ.unbounded_approved: Λ.unbounded_approved := ⊥] → BindPlanRequirements(P', U) → P' := Pᵦ' → check(U, K', R', Pᵦ', oos) → InvariantStatus → Qc(...)   -- over the SAME U: K' ∪ R' spans every obligation of every unit; no removal — a withdrawn condition becomes a residual
        V = Reopen(u)  → residual := residual ∪ u.obligations; U := U \ {u}; K := K \ {κ∈K:κ.unit=u}; R := R \ {ρ∈R:ρ.unit=Some(u)}; Λ.fit_overrides := Λ.fit_overrides \ {u.unit_ref}; Λ.plan_conditions_stale := ⊤ → Phase 1   -- residual is NOT reseeded from O_G \ oos; every other unit's obligations carry forward untouched; plan-level P is NOT re-derived (Rule 25)
        V = Confirm ∧ ¬hard_invariants_hold(Λ): → re-present Qc with the violated invariant named
        V = Confirm ∧ hard_invariants_hold(Λ):  → AcceptResiduals(R) → Λ.accepted := Λ.accepted ∪ {ρ.obligation | ρ∈R}; ∀ρ∈R: ρ.disposition := AcceptUncovered → Phase 3   -- P is read-only on this edge; AcceptResiduals supplies the non-empty accepted-completion witness resolve_unit reads at Phase 3
    Phase 3 Emit(U, K, R, P, oos, unbounded_approved) → E [TaskCreate] → package(E) → plan → park_carrier(plan) → C [TaskCreate] → record_handoff(C) → N → converge(apportionment trace) → ConditionBearingUnitPlan

── MORPHISM ──
AutonomousGoal × ExecutionHorizon
  → probe(goal)                        -- detect a stated autonomous goal whose unit plan and conditions are uncompiled
  → read_obligations(goal) → O_G       -- construct the invocation-local obligation set, including an owed /conduct unit when present; G itself remains read-only
  → filter(velocity) → oos             -- an obligation guardable only by pre-action interception is declared out of scope with the delegated substrate recorded on the declaration; computed once over O_G before packing begins, so it never enters a unit
  → scan(seams)                        -- read the REMAINING obligations (O_G minus the out-of-scope ones) for cuttable seams: dependency, deliverable, verification, ownership. Ordered after the filter, as FLOW and PHASE TRANSITIONS run it: a pre-action-only obligation is delegated out before any cut is shaped around it
  → pack(seams, horizon) → ProposedUnit -- THE IRREDUCIBLE CORE, part one: apportion the obligations into coarse units such that each unit fits one execution horizon and every obligation lands in some unit; also reads each unit's capability requirements and feasibility notes from the goal's stated needs — functional descriptions only, never a concrete executor/model/runtime/tool token (Substrate Boundary)
  → fit(unit, horizon) → SpanFit       -- per-unit horizon-fit predicate; Indeterminate is surfaced, never silently read as Fits
  → qualify(cut) → Seam                -- Grounded when a seam is cited: a dependency, deliverable, verification or ownership seam, or another the goal evidences — the four are the scanning taxonomy, not the admissible set; Heuristic when the goal carries no such evidence — declared, not asserted as a natural joint
  → [SpanFit = Fits ∧ no second Fits-worthy cut exists for Anchor: relay(AcceptUnit) (extension) | else: present(anchor, proposed_unit, SpanFit, Seam) (constitution)]  -- option-set relay test
  → integrate(unit_judgment, U, residual) → (U', residual')   -- monotone in coverage: an obligation leaves residual only when it enters some unit; integrate_unit(ProposedUnit) → Unit is the only constructor Unit has, and assigns the accepted unit its fresh UnitRef in that same step
  → derive(unit) → (Set(κ), Set(ρ))    -- THE IRREDUCIBLE CORE, part two: per obligation of the unit, a verifiable predicate (completion or invariant) or a residual; every obligation of the unit lands in exactly one of the two sets
  → derive_plan(goal, U) → P           -- conditions whose subject is the whole goal, not any one unit; NOT distributed across units to fit the leaf type
  → confirm(unit_plan)                 -- user judges the apportionment together with its conditions
  → emit(goal_entries)                 -- one entry per unit; resolve_unit's single certificate — DeterminateResolution when a compiled COMPLETION condition exists, otherwise AcceptedUncoveredResolution with a non-empty accepted-completion witness and any compiled invariant conjuncts
  → package(E)                         -- constructs the whole returned plan from E's own coproduct partition, envelope included — a read-back of what was emitted, never a second derivation beside it
  → park_carrier(plan) → C             -- parks the packaged plan in ONE durable carrier record
  → record_handoff(C) → N              -- emits the fixed-shape navigation block a later session dereferences to read that carrier back
  → ConditionBearingUnitPlan
requires: user_initiated(G)            -- user declares autonomous execution intent via /apportion
deficit:  GoalPlanUncompiled           -- activation precondition (Layer 1)
preserves: G                           -- compile-time only; ReadObligations constructs O_G without mutating the goal; no execution-state mutation
invariant: Apportion over Order        -- Merismos cuts the units and conditions them; it does not sequence them (order, independence, reconciliation, termination topology and routing are /conduct's)
invariant: Coverage over Convenience   -- every goal obligation belongs to some unit or is visibly delegated; a plan that omits one converges locally and lies globally
invariant: Fit over Ambition           -- every unit fits one execution horizon, or carries an explicitly recorded override
invariant: Declared Seam over Asserted Joint  -- a cut cites its seam evidence or declares itself heuristic; it never claims a natural joint it cannot evidence

── TYPES ──
G              = AutonomousGoal { utterance: String, obligations: Set(Obligation), prior: ProtocolOutput?, session: Context }
O_G            = ReadObligations(G) = G.obligations ∪ (owed_unit(G) ? owed_obligations(G) : ∅)
ProtocolOutput = prior protocol's converged output in current session
owed_unit(G)   ≡ G.prior names a /conduct owed-reapportionment entry for a unit it could not place a move for
owed_obligations(G) = (the named entry's unit).obligations
Obligation     = a stated or inferred requirement the goal must satisfy — the unit of coverage; each cites its evidence in G
H              = ExecutionHorizon      -- the budget one autonomous run is expected to fit; read from context, cue cited
U              = Set(Unit)             -- the apportionment
Anchor         = Set(Obligation) -- Pack's per-cycle focus region: the (possibly proper) subset of `residual` Scan's seam evidence gives Pack something to prioritize a cut around this cycle
ProposedUnit   = { subject: String, obligations: Set(Obligation), fit: SpanFit, seam: Seam, capability_requirements: Set(CapabilityRequirement), feasibility_notes: Set(FeasibilityNote) }
Unit           = { unit_ref: UnitRef, subject: String, obligations: Set(Obligation), fit: SpanFit, seam: Seam, capability_requirements: Set(CapabilityRequirement), feasibility_notes: Set(FeasibilityNote) }
SpanFit        ∈ {Fits, Overflows, Indeterminate}
Seam           = Grounded(Evidence) ⊎ Heuristic
Evidence       = { source: String, content: String }
CapabilityRequirement = a functional description of what carrying out the unit's work requires — descriptive only
FeasibilityNote = a free-text observation flagging a feasibility concern read from the goal — descriptive, not enforced; the empty set is valid when the unit carries no such concern
Derive         = Unit → (Set(κ), Set(ρ))
κ              = CompiledCondition { unit: Unit, obligation: Obligation, kind: PredicateKind, condition: VerifiablePredicate }
PredicateKind  ∈ {completion, invariant}
VerifiablePredicate = an executable check with a determinate pass/fail outcome
ρ              = Residual { obligation: Obligation, unit: Option(Unit), kind: PredicateKind, disposition: Option(ResidualDisposition) }
ResidualDisposition ∈ {AcceptUncovered} ∪ Emergent(ResidualDisposition)   -- written only by Phase 2 AcceptResiduals; a residual carries None until that step runs, which is what the AcceptUncovered filters distinguish
K              = Set(CompiledCondition)          -- unit-local conditions
P              = Set(PlanCondition)              -- cross-unit conditions
PlanCondition  = { scope: PlanScope, kind: PredicateKind, condition: VerifiablePredicate, dischargeable_when: PlanStateRequirement }
PlanScope      ∈ {FinalIntegration, GlobalNonRegression, WholeGoalAcceptance} ∪ Emergent(PlanScope)
UnitRef        = a stable identity carried by an emitted unit, assigned at integration and never reused
PlanStateRequirement = { predicate: VerifiablePredicate, basis: NonEmptySet(Evidence) }   -- /conduct judges which regions can invalidate this requirement against basis, so it cites the evidence the requirement rests on and is never empty; whether that evidence still tracks what it asserts is the receiving side's support-integrity judgment, not something this protocol can certify at compile time
topology_free(req) ≡ req contains no UnitRef, Move, MoveRegion, or order-position reference
LeafConjunct   = { condition: VerifiablePredicate, kind: PredicateKind }
NonEmptySet(T) = { S: Set(T) | S ≠ ∅ }
conjuncts(u)   = { { condition: κ.condition, kind: κ.kind } | κ ∈ K, κ.unit = u }
accepted_completion_residuals(u, R) = { ρ.obligation | ρ ∈ R, ρ.unit = Some(u), ρ.kind = completion, ρ.disposition = AcceptUncovered }
UnitResolution = DeterminateResolution { predicate: VerifiablePredicate, conjuncts: Set(LeafConjunct) } ⊎ AcceptedUncoveredResolution { accepted_completion_residuals: NonEmptySet(Obligation), conjuncts: Set(LeafConjunct) } -- THE CROSS-SEAM TERMINATION CERTIFICATE
resolve_unit(u, K, R) : UnitResolution = DeterminateResolution { predicate: ⋀ { κ.condition | κ ∈ K, κ.unit = u }, conjuncts: conjuncts(u) } when ∃ κ ∈ K : κ.unit = u ∧ κ.kind = completion = AcceptedUncoveredResolution { accepted_completion_residuals: accepted_completion_residuals(u, R), conjuncts: conjuncts(u) } when ∄ κ ∈ K : κ.unit = u ∧ κ.kind = completion ∧ accepted_completion_residuals(u, R) ≠ ∅
E              = Set(GoalEntry)        -- emission
GoalEntry      = UnitEntry { unit_ref: UnitRef, subject: String, obligations: Set(Obligation), resolution: UnitResolution, capability_requirements: Set(CapabilityRequirement), feasibility_notes: Set(FeasibilityNote) } ⊎ PlanEntry { scope: PlanScope, kind: PredicateKind, condition: VerifiablePredicate, dischargeable_when: PlanStateRequirement } ⊎ PlanEnvelopeEntry { accepted_residuals: Set(AcceptedResidualEntry), oos: Set(OOSDeclaration), unbounded_approved: Bool }
oos            = Set(OOSDeclaration)   -- obligations guardable only by pre-action interception
OOSDeclaration = { obligation: Obligation, substrate: String, basis: Evidence }
ReadObligations = G → O_G
VelocityFilter = O_G → oos
InvariantStatus = { coverage_complete: Bool, span_fit: Bool, termination_covered: Bool, obligations_derived: Bool, oos_substrate_named: Bool, plan_conditions_topology_free: Bool }
hard_invariants_hold(Λ) ≡ Λ.invariant_status.coverage_complete ∧ Λ.invariant_status.span_fit ∧ Λ.invariant_status.termination_covered ∧ Λ.invariant_status.obligations_derived ∧ Λ.invariant_status.oos_substrate_named ∧ Λ.invariant_status.plan_conditions_topology_free
coverage_complete(U, O_G) ≡ ∀ o ∈ O_G : (∃ u ∈ U : o ∈ u.obligations) ∨ (∃ d ∈ oos : d.obligation = o ∧ d.substrate ≠ "") ∨ o ∈ Λ.accepted
span_fit(U)    ≡ ∀ u ∈ U : u.fit = Fits ∨ u.unit_ref ∈ Λ.fit_overrides
obligation_derived(u, K, R) ≡ ∀ o ∈ u.obligations : (∃ κ ∈ K : κ.unit = u ∧ κ.obligation = o) ∨ (∃ ρ ∈ R : ρ.unit = Some(u) ∧ ρ.obligation = o)
derived_already(u, K, R) ≡ (∃ κ ∈ K : κ.unit = u) ∨ (∃ ρ ∈ R : ρ.unit = Some(u))
acceptance_present(P) ≡ ∃ p ∈ P : p.scope = WholeGoalAcceptance ∧ p.kind = completion   -- BOTH fields: a whole-goal INVARIANT is a boundary the run preserves, not a statement of when the goal is accepted, so it neither suppresses Qt nor stands in for the waiver at emission
Aᵤ             = UnitJudgment ∈ {AcceptUnit, Recut(direction), Sufficient} when SpanFit = Fits; {OverrideFit, Recut(direction), Sufficient} otherwise   -- the accept/override pair is INDEXED by the fit verdict rather than deleted at presentation: the defined set for a firing IS what that firing presents, so Rule 18's intact-presentation invariant holds and an unfitting unit has no unguarded accept
V              = Judgment ∈ {Confirm, Adjust(direction), Reopen(unit)}
Vₜ             = TerminationJudgment ∈ {DefineNow(direction), RouteBound, ApproveUnbounded}
plan_condition(d) = PlanCondition { scope: WholeGoalAcceptance, kind: completion, condition: [the predicate direction d states], dischargeable_when: PlanStateRequirement { predicate: λ candidate_plan. False, basis: {Evidence { source: "the DefineNow answer at the whole-goal acceptance gate", content: d }} } }   -- the placeholder predicate is False until BindPlanRequirements normalizes it against |U|; the basis is the user's own definition, which is what makes it inhabit NonEmptySet from construction rather than after a repair
BindPlanRequirements(P, U) = { p with dischargeable_when := plan_terminal(|U|) when p.scope = WholeGoalAcceptance; p unchanged otherwise | p ∈ P }   -- scope alone, deliberately unlike acceptance_present: a whole-goal invariant is still discharged at plan-terminal — it just does not answer the acceptance question
plan_terminal(n) = PlanStateRequirement { predicate: λ candidate_plan. |candidate_plan.units| = n ∧ ∀ r ∈ { e.resolution | e ∈ candidate_plan.units } : (r = DeterminateResolution { predicate: d, ... } ⟹ d holds) ∧ (r = AcceptedUncoveredResolution { accepted_completion_residuals: A, conjuncts: C } ⟹ A ≠ ∅ ∧ A ⊆ { a.obligation | a ∈ candidate_plan.accepted_residuals, a.kind = completion } ∧ ∀ c ∈ C : c.condition holds), basis: {Evidence { source: "the current plan's UnitResolution and accepted-residual projections", content: "expected aggregate resolution count = " + String(n) + "; all executable resolution conditions; aggregate accepted-completion record" }} }
Rerouted       = routed_to_bound
EarlyExit      = user_esc
Emit           = (U, K, R, P, oos, unbounded_approved) → E [Tool: TaskCreate]   -- R feeds resolve_unit's accepted arm; oos and unbounded_approved feed the envelope
Phase          ∈ {0, 1, 2, 3}
Qu             = Per-cycle apportionment interaction with (Anchor, proposed_unit: ProposedUnit, SpanFit, Seam, cut-set snapshot) [Tool: Constitution interaction]
Qt             = Whole-goal acceptance interaction, conditional on ¬acceptance_present(P) [Tool: Constitution interaction]
Qc             = Unit-plan confirmation interaction with (U, K, R, P, InvariantStatus, oos) [Tool: Constitution interaction]
ConditionBearingUnitPlan = { units: Set(UnitEntry), plan_conditions: Set(PlanEntry), accepted_residuals: Set(AcceptedResidualEntry), oos: Set(OOSDeclaration), unbounded_approved: Bool }
AcceptedResidualEntry = { obligation: Obligation, unit_ref: Option(UnitRef), kind: PredicateKind }
plan           = the ConditionBearingUnitPlan value returned by this invocation
HandoffLocator = { record: the durable identity of the carrier record C, session: the id of the session that parked it }
C              = PlanCarrier: the ONE durable record record_handoff parks the packaged plan in — a single dereferenceable entry, distinct from E's per-unit entries, which exist for the downstream completion-predicate enforcer and carry no aggregate identity of their own
locator(C)     = HandoffLocator { record: C's record identity as the carrier-creating call returned it; session: the id of the session running record_handoff }   -- tool-neutral by construction: which call creates the carrier is named in TOOL GROUNDING, so a host without that tool still types this
N              = NavigationBlock { purpose_frame: String, canonical_locator: HandoffLocator, dereference_instruction: DereferenceInstruction, snapshot_anchor: Option(String), grounding_instruction: GroundingInstruction }
DereferenceInstruction = an instruction to read the carrier record at the canonical locator's record identity, within the session that locator names — one read yields the whole plan
GroundingInstruction = the fixed instruction to run /inquire where available, or the recipient's equivalent grounding pass, and stop when a source is unreachable or a needed premise lacks support-integrity
handoff_recorded(N, C) ≡ park_carrier wrote the packaged plan into C ∧ record_handoff presented N in the handoff output ∧ N.purpose_frame ≠ "" ∧ N.canonical_locator = locator(C) ∧ N.canonical_locator.session ≠ ""   -- the emission IS the text
── PHASE TRANSITIONS ──
Phase 0: G → Probe(G) [Tool] → goal_plan_uncompiled?                   -- activation checkpoint (observe): dereferences a prior navigation block when one is in scope, else internal analysis
           ¬autonomous_intent(G) → relay → deactivate                  -- no autonomous interval in scope (extension)
           navigation block in scope ∧ (¬dereferenceable ∨ support-integrity failure) → relay → deactivate   -- handoff unreadable, whether the carrier would not resolve or the grounding pass could not support a load-bearing premise; the uncompiled arm is NOT taken (extension)
           condition_bearing(G)  → relay → deactivate                  -- units and conditions already present (extension)
           uncompiled            → ReadObligations(G) → O_G → VelocityFilter(O_G) → oos; residual := O_G \ {d.obligation | d∈oos} → Phase 1   -- ONE-TIME init, fired only on this edge; Phase 2's Reopen re-enters Phase 1 without re-running it. ReadObligations is this edge's formal producer for an owed unit's obligations entering the LOCAL compilation set; G remains unchanged
Phase 1: (G, residual) → Scan [Tool] → seams → Pack(seams, H) → (Anchor, proposed_unit, SpanFit) → qualify(that cut) → Seam   -- Pack searches; qualify is the step that produces the Seam disposition, so the four-tuple the gate receives has a named producer for each component. apportionment loop (sense); residual/oos enter this phase either freshly seeded or as Reopen left them — never re-seeded on entry
           Anchor empty ∧ residual = ∅ ∧ U = ∅ ∧ oos = ∅ → relay(goal's scope too thin to read any obligation — route to /inquire) (extension) → deactivate
           Anchor empty ∧ residual = ∅ ∧ (U ≠ ∅ ∨ oos ≠ ∅) → Phase 2
           Anchor empty ∧ residual ≠ ∅ → autonomous_pack(residual) (track) → ∀u∈U'' (Fits-worthy packed units): integrate(u) → u' → U := U ∪ {u'} → surface (extension) → Phase 2 | re-anchor → Phase 1
           SpanFit = Fits ∧ no second Fits-worthy cut exists for Anchor → relay(AcceptUnit) (extension) → integrate → Phase 1  -- option-set relay test
           else → Qu → Stop → Aᵤ (constitution) [Tool]
             Aᵤ = AcceptUnit   → integrate(U, residual) → Phase 1        -- in Aᵤ's defined set iff SpanFit = Fits
             Aᵤ = Recut(d)     → re-derive Anchor frame under d → Phase 1
             Aᵤ = OverrideFit  → integrate(U, residual) → u' → Λ.fit_overrides := Λ.fit_overrides ∪ {u'.unit_ref} → Phase 1   -- in Aᵤ's defined set iff SpanFit ≠ Fits
             Aᵤ = Sufficient   → autonomous_pack(residual) (track) → ∀u∈U'' (Fits-worthy packed units): integrate(u) → u' → U := U ∪ {u'} → surface (extension) → Phase 2 | re-anchor → Phase 1
             Esc               → deactivate (EarlyExit)
Phase 2: U → ∀u∈U, ¬derived_already(u,K,R): Derive(u) → (Set(κ), Set(ρ)) → K:=K∪κs, R:=R∪ρs ∥ [¬Λ.plan_conditions_derived: DerivePlan(G, U) → P; Λ.plan_conditions_derived := ⊤]   -- condition derivation (sense), scoped to units and plan conditions not yet derived this apportionment
           oos ≠ ∅ → OOS(oos) (extension)                              -- out-of-scope declaration, substrate recorded on each OOSDeclaration
           ¬acceptance_present(P) → Qt(K, P) → Stop → Vₜ (constitution) [Tool]   -- fires at pass entry, and again after any Adjust that clears acceptance
             Vₜ = DefineNow(d)     → P := P ∪ {plan_condition(d)}; [Λ.unbounded_approved: Λ.unbounded_approved := ⊥]
             Vₜ = RouteBound       → deactivate (Rerouted)
             Vₜ = ApproveUnbounded → Λ.unbounded_approved := ⊤
           BindPlanRequirements(P, U) → P := Pᵦ → check(U, K, R, Pᵦ, oos) → Λ.invariant_status := InvariantStatus (track)   -- the ONLY writer of Λ.invariant_status, which Confirm's hard_invariants_hold guard reads; normalize every WholeGoalAcceptance requirement against the current |U| BEFORE topology_free is checked; coverage_complete ∧ span_fit ∧ termination_covered ∧ obligations_derived ∧ oos_substrate_named ∧ plan_conditions_topology_free (track)
           Λ.plan_conditions_stale → StaleNotice(P) (extension)        -- pre-Qc surfacing: review, Adjust, or Confirm as recorded
           Qc(U, K, R, P, InvariantStatus, oos) → Stop → V (constitution) [Tool]
             V = Adjust(d) → rederive over the SAME U → (K, R, P) := (K', R', P') → Λ.plan_conditions_stale := ⊥ → [¬acceptance_present(P') → Qt] → [acceptance_present(P') ∧ Λ.unbounded_approved: Λ.unbounded_approved := ⊥] → BindPlanRequirements(P', U) → P' := Pᵦ' → check(U, K', R', Pᵦ', oos) → InvariantStatus → re-present Qc   -- obligation_derived(u, K', R') holds for every u ∈ U; check is RE-RUN against the normalized adjusted state before Qc re-presents
             V = Reopen(u) → residual := residual ∪ u.obligations; U := U \ {u}; K := K \ {κ∈K:κ.unit=u}; R := R \ {ρ∈R:ρ.unit=Some(u)}; Λ.fit_overrides := Λ.fit_overrides \ {u.unit_ref}; Λ.plan_conditions_stale := ⊤ → Phase 1   -- the reopened unit's derived conditions and fit-override record leave with it; P itself is not re-derived (Rule 25)
             V = Confirm ∧ ¬hard_invariants_hold(Λ) → re-present Qc naming the violated invariant
             V = Confirm ∧ hard_invariants_hold(Λ) → AcceptResiduals(R) → Λ.accepted := Λ.accepted ∪ {ρ.obligation | ρ ∈ R}; ∀ρ∈R: ρ.disposition := AcceptUncovered (track) → Phase 3   -- AcceptResiduals produces the accepted-completion witnesses resolve_unit reads during Emit
Phase 3: (U, K, R, P, oos, unbounded_approved) → Emit → E [Tool: TaskCreate] → package(E) → plan → park_carrier(plan) → C [Tool: TaskCreate] (track) → record_handoff(C) → N (extension) → converge(apportionment trace) (extension) → ConditionBearingUnitPlan

Phase 0 → Phase 1: goal_plan_uncompiled(G)                             -- this edge alone performs the one-time VelocityFilter/residual init
Phase 0 → deactivate: ¬autonomous_intent(G) ∨ condition_bearing(G) ∨ (navigation block in scope ∧ (¬dereferenceable ∨ support-integrity failure))   -- relay the scan result; no activation
Phase 1 → deactivate: residual = ∅ ∧ U = ∅ ∧ oos = ∅                   -- nothing could be read from the goal's scope; relays to /inquire rather than emitting an empty plan
Phase 1 → Phase 1: next anchor                                         -- bounded by coverage (residual strictly shrinks on AcceptUnit/OverrideFit) and by user agency (Recut/Sufficient/Esc)
Phase 1 → Phase 2: residual = ∅ ∧ (U ≠ ∅ ∨ oos ≠ ∅)                    -- every obligation apportioned or visibly delegated
Phase 2 → Phase 1: V = Reopen(u)                                       -- that unit's obligations return to residual; bounded by user agency exactly as Adjust is
Phase 2 → Phase 2: V = Adjust(d)                                       -- rederive over the same apportionment; U unchanged
Phase 2 → Phase 2: V = Confirm ∧ ¬hard_invariants_hold(Λ)              -- Qc re-presents with the violated invariant named; no state advances
Phase 2 → deactivate: Vₜ = RouteBound                                  -- Rerouted; /bound → /apportion re-entry recompiles fresh
Phase 2 → Phase 3: V = Confirm ∧ hard_invariants_hold(Λ)               -- residuals accepted on record; every clause of apportioned(G) that Qc can violate holds AT THE TRANSITION
Phase 3 → converge: emitted(E) ∧ handoff_recorded(N, C)                -- ConditionBearingUnitPlan + apportionment trace + navigation block
Phase 1 → deactivate (ungraceful): user_esc                            -- EarlyExit: no emission, no handoff recorded
Phase 2 → deactivate (ungraceful): user_esc                            -- EarlyExit: no emission, no handoff recorded

── LOOP ──
Two bounded loops, one per irreducible part.

Apportionment loop (Phase 1): one anchor per cycle.
  AcceptUnit and OverrideFit strictly shrink residual, so the loop cannot cycle on coverage. Recut leaves
  residual unchanged — it re-frames the SAME anchor under a user direction — and is bounded by user agency, as
  are Sufficient (which packs the remainder) and Esc. A cycle entered via Reopen (the one back-edge from
  Phase 2) carries the reopened unit's restored obligations in residual and every other already-packed unit's
  obligations untouched.

Condition loop (Phase 2): Qt fires whenever the whole goal carries no acceptance criterion — at pass entry, and
  again after an Adjust that clears one. An Adjust that instead INTRODUCES whole-goal acceptance while an
  earlier ApproveUnbounded waiver is still on record retracts Λ.unbounded_approved in that same transition, and
  does not re-fire Qt; the SAME retraction fires unconditionally on Qt's own DefineNow arm, on every firing.
  Qc's Adjust rederives over the SAME apportionment — K' ∪ R' still spans every obligation of every unit
  (obligation_derived, no removal; a withdrawn or weakened condition becomes a residual). BindPlanRequirements
  runs idempotently on every pass immediately before check, so every WholeGoalAcceptance condition carries
  plan_terminal(|U|) before the guard reads it; check is RE-RUN in full against that normalized state before Qc
  re-presents, so Confirm's hard_invariants_hold guard always consults an InvariantStatus computed against the
  current K/R/P/U. Confirm performs no later P mutation and does not waive a hard invariant: a coverage or fit
  violation re-presents Qc with the violation named rather than advancing to emission. Reopen is the one
  back-edge to Phase 1: it returns exactly that unit's obligations to residual, clears that unit's own K/R
  entries, and re-enters the apportionment loop. The back-edge is SCOPED: residual is never re-seeded from the
  goal's full obligation set, and Derive/DerivePlan run only over what is not yet derived, so a unit's
  Adjust-shaped conditions and any whole-goal conditions already on record survive the detour. Reopen also sets
  Λ.plan_conditions_stale, and the next Qc surfaces that as a notice — Adjust or Confirm as recorded — clearing
  once the user Adjusts. AcceptResiduals then accepts R and supplies the non-empty completion-residual witness
  any AcceptedUncoveredResolution needs at Emit. Confirm or Esc terminates.

Stateless: Merismos terminates at emission. No invocation-local state survives into the execution interval —
no session approvals, no per-action classification, no mid-execution checkpoint. The emitted navigation
block is the cross-session route to the carrier, not surviving Λ state.

Convergence evidence (relay, at emission): present the apportionment trace —
  (a) Plan readback — the goal restated as its units in plain single-sentence form;
  (b) Per-unit: (obligations covered, seam quality with its citation or heuristic declaration, horizon fit or
      the recorded override) → the unit resolution certificate — the conjoined predicate plus typed conjuncts
      when the unit has ≥1 compiled completion condition, or an accepted-completion witness plus any invariant
      conjuncts when it has none — and the unit's capability requirements and feasibility notes;
  (c) Plan-level conditions with the plan-state requirement that makes each safe to discharge;
  (d) Each accepted-uncovered residual with its obligation, and each out-of-scope obligation with its substrate;
  (e) When unbounded_approved: the recorded whole-goal acceptance waiver with its gate site.
(d) and (e) are additionally emitted as a plan-envelope entry alongside the unit and plan-condition entries.
Convergence is demonstrated, not asserted.

── CONVERGENCE ──
-- plan denotes the returned ConditionBearingUnitPlan (see TYPES); E is the TaskCreate-emitted goal-entry set
apportioned(G) = emitted(E) ∧ handoff_recorded(N, C)
                 ∧ coverage_complete(U, O_G) ∧ span_fit(U)
                 ∧ (U ≠ ∅ ∨ oos ≠ ∅)                                                -- a goal with nothing read from it never claims apportionment occurred
                 ∧ (∀u∈U: (∃ κ ∈ K : κ.unit = u ∧ κ.kind = completion) ∨ (∃ ρ ∈ R : ρ.unit = Some(u) ∧ ρ.kind = completion))
                 ∧ (∀u∈U: obligation_derived(u, K, R))
                 ∧ (∀u∈U: |{e ∈ E : e is UnitEntry ∧ e.unit_ref = u.unit_ref}| = 1)   -- the join rule holds: one unit entry per unit, keyed on unit_ref — subject is not unique across units
                 ∧ (∀u∈U: ∀e∈E: (e is UnitEntry ∧ e.unit_ref = u.unit_ref) → (e.obligations = u.obligations ∧ e.resolution = resolve_unit(u, K, R) ∧ e.capability_requirements = u.capability_requirements ∧ e.feasibility_notes = u.feasibility_notes))   -- the join rule's durable certificate: resolve_unit jointly supplies the completion disposition, its accepted-completion witness when needed, and every typed conjunct; the emitted obligations/capability/feasibility fields are exact reads from the owning unit
                 ∧ (∀p∈P: ∃! e ∈ E : e is PlanEntry ∧ e.scope = p.scope ∧ e.kind = p.kind ∧ e.condition = p.condition ∧ e.dischargeable_when = p.dischargeable_when)
                 ∧ (∀e∈E: e is UnitEntry → ∃! u∈U: e.unit_ref = u.unit_ref)          -- reverse correspondence: no unapproved UnitEntry can ride in E
                 ∧ (∀e∈E: e is PlanEntry → ∃ p∈P: e.scope = p.scope ∧ e.kind = p.kind ∧ e.condition = p.condition ∧ e.dischargeable_when = p.dischargeable_when)   -- reverse correspondence: no unapproved PlanEntry can ride in E
                 ∧ (∀p∈P: topology_free(p.dischargeable_when))
                 ∧ (∀p∈P: p.scope = WholeGoalAcceptance → p.dischargeable_when = plan_terminal(|U|))   -- produced by BindPlanRequirements before the final check; the captured aggregate count prevents a dropped-unit projection from satisfying the terminal universal vacuously
                 ∧ plan.units = {e ∈ E : e is UnitEntry}                             -- the RETURNED plan's units are exactly E's UnitEntry partition — produced by Phase 3 package from E
                 ∧ plan.plan_conditions = {e ∈ E : e is PlanEntry}                   -- the RETURNED plan's plan conditions are exactly E's PlanEntry partition — produced by Phase 3 package from E
                 ∧ (acceptance_present(P) ∨ Λ.unbounded_approved)
                 ∧ ¬(acceptance_present(P) ∧ Λ.unbounded_approved)                  -- a real acceptance condition and an unbounded waiver never both hold at emission
                 ∧ (∀d∈oos: d.substrate ≠ "")
                 ∧ (∃! e ∈ E : e is PlanEnvelopeEntry)                               -- exactly one envelope per emission
                 ∧ (∀e∈E: e is PlanEnvelopeEntry → e.accepted_residuals = { AcceptedResidualEntry(ρ.obligation, ρ.unit.map(u ↦ u.unit_ref), ρ.kind) | ρ ∈ R : ρ.disposition = AcceptUncovered } ∧ e.oos = oos ∧ e.unbounded_approved = Λ.unbounded_approved)   -- exact correspondence in BOTH directions, keyed by unit_ref rather than by obligation+kind
                 ∧ plan.accepted_residuals = (the PlanEnvelopeEntry of E).accepted_residuals
                 ∧ plan.oos = (the PlanEnvelopeEntry of E).oos
                 ∧ plan.unbounded_approved = (the PlanEnvelopeEntry of E).unbounded_approved   -- the returned value READS BACK the emitted envelope rather than being re-derived beside it; produced by Phase 3 package from E
-- Rerouted (Qt RouteBound) is a deliberate non-emission exit and EarlyExit a user abort — neither claims
-- ConditionBearingUnitPlan (see TYPES): the emitted result is well-formed exactly when apportioned(G) holds.
-- The guarantee is compile-time and pre-conduct. Order, independence, reconciliation, termination topology
-- and routing are NOT claimed — they remain /conduct's.

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Probe        (observe)      → TaskGet, Read (autonomous intent + uncompiled-plan detection over the goal; cue cited. When the scan finds a prior /apportion navigation block, this step DEREFERENCES it — reading the ONE carrier record at the locator's record identity within the session that locator names, then running the grounding instruction — and decides condition_bearing against the plan read back from that carrier, whose accepted_residuals field is what closes its accepted-uncovered units. An unreachable source, a locator missing either half, or a load-bearing premise the grounding pass cannot support STOPS: this step surfaces the handoff as unreadable and deactivates, and the goal never falls through to the uncompiled path — GroundingInstruction's own clause requires the stop, and /conduct's DereferencePlan does the same on the mirror path. With no navigation block in scope at all the step is internal analysis over the goal alone, and the uncompiled path is correct)
Phase 0 relay        (extension)    → TextPresent+Proceed (no autonomous interval in scope, or the plan already carries units and conditions: surface the scan result; deactivate without activating)
Phase 0 ReadObligations (sense)     → Internal analysis (construct O_G once as G.obligations plus the exact obligations field of a /conduct owed-reapportionment entry when owed_unit(G); a local read, never a G mutation. Produces the set VelocityFilter, residual seeding, and coverage_complete consume)
Phase 0→1 VelocityFilter (sense)    → Internal analysis (obligations guardable only by pre-action interception; computed from O_G on the Phase 0 → Phase 1 edge alongside init_loop_state and only there, before residual is seeded, so an out-of-scope obligation never enters the packing loop and Phase 2's Reopen back-edge re-enters the packing loop without recomputing this partition; empty scope with no obligation and no delegation relays to /inquire rather than proceeding)
Phase 1 Scan         (observe)      → Read, Grep (optional seam evidence gathering over the goal's cited substrate; read-only)
Phase 1 Pack         (sense)        → Internal analysis (apportionment search: units fitting one horizon, coverage over obligations; produces a ProposedUnit; reads each proposed unit's capability requirements and feasibility notes from the goal's stated needs — functional descriptions only, never a concrete executor/model/runtime/tool token (Substrate Boundary); the same search determines whether any alternative Fits-worthy cut of this Anchor exists beside proposed_unit, feeding the option-set relay test)
Phase 1 fit          (sense)        → Internal analysis (per-unit horizon-fit verdict; Indeterminate surfaced, never read as Fits)
Phase 1 qualify      (sense)        → Internal analysis (seam quality: Grounded with its citation — the four named seam kinds are what this scan looks for, and any other seam the goal actually evidences qualifies the same way — or Heuristic declared when no evidence is there)
Phase 1 relay        (extension)    → TextPresent+Proceed (no alternative Fits-worthy cut exists for this Anchor: accept the unit without a turn yield — the option-set relay test)
Phase 1 autonomous_pack (track)     → Internal state update (extension — pack the remainder at Heuristic seams when seam evidence is exhausted or the user declares the apportionment sufficient; produces ProposedUnit values exactly as Pack does, capability requirements and feasibility notes included; each packed unit re-checks fit and is surfaced as relay with its heuristic declaration; a packed unit whose fit is not Fits does NOT enter U — it re-enters as the next cycle's anchor for Qu, where the override is the user's to record; a still-non-empty residual likewise re-anchors; every Fits-worthy packed unit is routed through integrate before entering U)
Phase 1 Qu           (constitution) → present (the anchor's proposed unit [ProposedUnit] + horizon-fit verdict + seam quality with its basis + current cut-set; the accept option is fit-complementary — AcceptUnit when the span fits, OverrideFit when it does not; Esc → EarlyExit) [Tool]
Phase 1 integrate    (track)        → Internal state update (consumes a ProposedUnit and produces a Unit — the only constructor Unit has: the accepted unit enters the apportionment and its obligations leave the residual; a fresh UnitRef is assigned to the unit in that same step, stable for the remainder of the apportionment; OverrideFit records THAT fresh UnitRef into Λ.fit_overrides after assignment, never before)
Phase 2 Derive       (sense)        → Internal analysis (per-unit completion and invariant predicates; an obligation with no verifiable predicate becomes a residual; scoped to units where ¬derived_already(u,K,R))
Phase 2 DerivePlan   (sense)        → Internal analysis (conditions whose subject is the whole goal; never distributed across units; fires once per apportionment, guarded by ¬Λ.plan_conditions_derived)
Phase 2 OOS          (extension)    → TextPresent+Proceed (out-of-scope declaration per obligation, with the delegated substrate named)
Phase 2 Qt           (constitution) → present (conditional: the whole goal has no acceptance criterion — define it now / route its definition to /bound / proceed unbounded on record; fires at pass entry and again after any Adjust that clears acceptance, always before Qc re-presents; DefineNow additionally retracts Λ.unbounded_approved when it still reads ⊤ from an earlier Qt firing on this same invocation) [Tool]
Phase 2 ApproveUnbounded (track)    → Internal state update (record Λ.unbounded_approved, materializing the informed acceptance for the convergence predicate; does NOT touch P, so a later Qt re-fire can still reach DefineNow while this reads ⊤)
Phase 2 BindPlanRequirements (track) → Internal state replacement (immediately before every check, replace P with the same conditions except that every WholeGoalAcceptance entry carries dischargeable_when = plan_terminal(|U|); runs after DerivePlan/Qt and after every Adjust/Qt re-fire. The sole producer of the scope-owned convergence clause and its identity-free expected count)
Phase 2 check        (track)        → Internal state update (WRITE Λ.invariant_status — invariant status: coverage, horizon fit, termination coverage, obligation derivation, oos substrate-naming, and each plan condition's topology-freedom — an AI semantic judgment over the plan condition's predicate content, not a structural proof — over the current apportionment; RE-RUN every time Qc is about to (re-)present, at pass entry and again after every Adjust plus any Qt re-fire it triggers)
Phase 2 StaleNotice   (extension)   → TextPresent+Proceed (conditional: Λ.plan_conditions_stale = ⊤ — surface, as pre-gate text before Qc, that plan-level conditions were derived or last user-adjusted against a unit set a subsequent Reopen has since changed; relay only, mutates no Λ field)
Phase 2 Qc           (constitution) → present (apportionment + derived conditions + residual dispositions + invariant status + the staleness notice when present: Confirm / Adjust / Reopen) [Tool]
Phase 2 AcceptResiduals (track)     → Internal state update (on Confirm: record each remaining residual's obligation into Λ.accepted and write ρ.disposition := AcceptUncovered for each ρ ∈ R. This supplies accepted_completion_residuals(u,R), the non-empty witness resolve_unit's accepted constructor requires at Emit. P is untouched)
Phase 3 Emit         (track)        → TaskCreate (one goal entry per unit: unit_ref + subject + obligations + resolve_unit's single UnitResolution certificate — DeterminateResolution carries the conjoined predicate and every typed conjunct when a completion κ exists; AcceptedUncoveredResolution carries a non-empty accepted-completion witness plus any invariant conjuncts when no completion κ exists — + capability requirements and feasibility notes carried verbatim; plan-level conditions as their own entries carrying scope + kind + condition + the already-checked dischargeable_when; AND exactly one plan-envelope entry carrying the Λ-accepted residuals, the computed oos set, and Λ.unbounded_approved. TodoWrite is the harness-equivalent realization; sets Λ.emitted on completion — these entries serve the enforcer; the cross-session carrier is record_handoff's own, outside Λ) [Tool]
Phase 3 package      (track)        → Internal state update (constructs the returned ConditionBearingUnitPlan as a VIEW of E, partitioned by constructor: units from the UnitEntry members, plan_conditions from the PlanEntry members, and accepted_residuals/oos/unbounded_approved read back off the emitted PlanEnvelopeEntry — never re-derived from Λ)
Phase 3 park_carrier   (track)      → TaskCreate (write package's plan value into ONE new record C — the whole plan in one entry, so a single dereference reconstructs it; C's own TaskCreate returns the record identity locator(C) reads) [Tool]
Phase 3 record_handoff (extension)  → TextPresent+Proceed (emit N in the fixed navigation-block shape with canonical_locator = locator(C) — record half from C's TaskCreate, session half this session's own id — plus a dereference instruction, the optional snapshot anchor only when exact-state determinacy is needed, and the grounding instruction. N is entry points only, never a re-authored plan; C and this emitted block are what handoff_recorded(N, C) reads)
converge             (extension)    → TextPresent+Proceed (apportionment trace after the navigation block has been emitted; deactivate)
esc                  (extension)    → TextPresent+Proceed (no emission; deactivate as EarlyExit, not ConditionBearingUnitPlan)
seam                 (extension)    → TextPresent+Proceed (two seams, scoped separately. INBOUND activation seam (before this protocol activates): the `/bound → /apportion` and `/conduct → /apportion` legs of the `## Composition` chain relay when a user-declared chain names `/apportion` next, or an invocation follows that declared composition edge — proceed directly, citing the settling source. OUTBOUND emission seam (after this protocol emits): the `/apportion → enforcer` edge is EXCLUDED — Rule 8 (Separate activation) governs it; the `/apportion → /conduct` edge relays only under a user-declared chain naming /conduct next, never automatically, and carries the no-reentry guard of Rule 9. Every Constitution gate inside this protocol and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = { phase: Phase, G: AutonomousGoal, H: ExecutionHorizon,
      O_G: Set(Obligation),              -- written once by Phase 0 ReadObligations; local augmented read, never a mutation of G; read by VelocityFilter, residual seeding, coverage_complete, and the coverage partition
      U: Set(Unit), residual: Set(Obligation),
      fit_overrides: Set(UnitRef),       -- seeded ∅ by init_loop_state; written by OverrideFit AFTER integrate_unit assigns the ref; fit_override_recorded(u) ≡ u.unit_ref ∈ Λ.fit_overrides; cleared of a reopened unit's ref by Reopen, mirroring K/R
      K: Set(CompiledCondition), R: Set(Residual), P: Set(PlanCondition), oos: Set(OOSDeclaration),
      plan_conditions_derived: Bool,     -- seeded ⊥ by init_loop_state; written ⊤ the one time Phase 2's DerivePlan runs; read by Phase 2's entry guard
      plan_conditions_stale: Bool,       -- seeded ⊥ by init_loop_state; written ⊤ by Reopen; read by the pre-Qc StaleNotice surfacing; written ⊥ by Adjust — never auto-cleared by re-running check, and never forces a re-derivation itself
      accepted: Set(Obligation),         -- written by AcceptResiduals on Confirm; accepted_uncovered(o) ≡ o ∈ Λ.accepted
      unbounded_approved: Bool,          -- written by Qt on ApproveUnbounded; RETRACTED (:= ⊥) by EITHER Adjust (when it introduces whole-goal acceptance while this still reads ⊤) OR DefineNow (on any Qt firing, unconditionally)
      invariant_status: InvariantStatus,
      emitted: Bool,                     -- written by Phase 3 Emit; emitted(E) ≡ Λ.emitted
      active: Bool, cause_tag: String }
-- Coverage partition invariant: residual, (⋃ᵤ u.obligations) and {d.obligation | d ∈ oos} are pairwise
--   disjoint and together equal O_G at every cycle boundary — an obligation is always exactly one of: still
--   residual, apportioned to a unit, or visibly delegated out of scope. Λ.accepted is NOT a fourth cell: it is
--   a MARKING over obligations that already sit in a unit, recording that the unit carries no verifiable
--   predicate for them — ρ.unit is what ties them
-- Compile-time only: Λ exists from invocation to emission; nothing persists into the execution interval

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). registered dependency edges preserved. Dimension resolution emergent via session context.
Two-way advisory with /conduct, neither direction a precondition, both guarded against reentry (Rule 9). A unit
/conduct could not place a move for travels back separately, as an owed re-apportionment — a third, distinct edge.
```

## Core Principle

**Apportion over Order**: When an autonomous goal is stated but its plan is uncompiled — you know *what* the goal is, but not *which units it runs in* nor *what each unit's done means* — the act is to cut the units and condition them, not to sequence them. Sequencing those units — their order, independence, reconciliation, termination topology and routing — is `/conduct`'s work. The emitted plan is deliberately **pre-conduct**: it carries unit boundaries and conditions, and nothing that would make it a conducted method.

**Coverage over Convenience**: Every goal obligation belongs to some unit, is visibly delegated out of scope, or is accepted as uncovered on record. Coverage is a hard invariant, not a quality target.

**Fit over Ambition**: Every unit fits one execution horizon, or carries an override the user recorded. An unjudgeable fit is surfaced as such; it is never quietly read as fitting.

**Declared Seam over Asserted Joint**: A cut cites the seam it sits on — a dependency edge, a deliverable boundary, a verification point, an ownership change, or another the goal evidences — or declares itself heuristic. Seam quality is a declared disposition rather than an invariant: the plan is honest about which cuts are grounded and which are judgment calls, and the user judges the heuristic ones with that fact visible.

Priority ordering: coverage > fit > autonomy > transparency > noise-minimization > speed > simplicity.

## Substrate Boundary

Merismos operates within the epistemic substrate — its protocol scope covers obligation reading, apportionment search, horizon-fit and seam-quality judgment, condition derivation, and the compile-time gates. The Phase 1 and Phase 2 gates transmit user judgment into the apportionment and its conditions.

Everything past emission belongs to non-epistemic substrates. Enforcement of the emitted leaf predicates inside each execution interval is the downstream completion-predicate enforcer's contract; pre-action interception of the obligations declared out of scope (destructive command blocking, permission prompts, prompt-injection defense) is the harness permission system's contract; step-by-step approval, resumable state, and timeout/escalation belong to a workflow/HITL substrate. Concrete executor selection — which agent, model, runtime or tool token carries a unit — is likewise outside: units carry capability requirements and feasibility notes, never a binding. Merismos classifies and surfaces these boundary crossings, records the handoff, and stops — it neither discharges nor enforces external substrate semantics.

## Mode Activation

### Activation

User calls `/apportion` to declare autonomous execution intent for a goal whose unit plan and conditions are uncompiled.

**Goal plan uncompiled** = an autonomous run is intended for a stated goal, but the goal is not yet carried by units each bearing a compiled condition — a determinate completion predicate, or a recorded acceptance closing it.

Gate predicate:
```
goal_plan_uncompiled(G) ≡ autonomous_intent(G) ∧ ¬condition_bearing(G)
  autonomous_intent(G)  ≡ an autonomous or long-running execution interval is intended for G (cue cited from context)
  condition_bearing(G)  ≡ (G already carries units whose conditions are compiled — each closed by a determinate completion
                          predicate OR by a recorded acceptance, read back by DEREFERENCING a prior /apportion plan at its
                          navigation block, or supplied by the user as an explicit
                          unit-and-condition set) ∧ ¬owed_unit(G). A goal with units but no conditions, or conditions but
                          no units, is uncompiled: both halves are this protocol's product — except a plan whose
                          obligations are ALL out-of-scope delegations, which carries no units by construction
                          and is condition-bearing, so a re-invocation over it relays rather than re-emitting
```

**Activation layer**:
- **Layer 1 (User-invocable)**: `/apportion` slash command or description-matching input. Always available.
- **Layer 2**: Not applicable (user-initiated — no AI-guided activation heuristics). The deficit exists only once an autonomous execution intention is in scope.

### Priority

<system-reminder>
When Merismos is active:

**Supersedes**: Default execution patterns that enter an autonomous interval without apportioned units and derived completion conditions

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 1, present the highest-leverage unapportioned region's proposed unit — with its horizon-fit verdict, its seam quality and citation, and the current cut-set — for the user to settle. At Phase 2, present the apportionment together with its derived conditions and invariant status. Both via Cognitive Partnership Move (Constitution).
</system-reminder>

- Merismos completes (emits the plan) before the autonomous interval begins
- Loaded instructions and other protocol behaviors are retained
- Merismos apportions and conditions; it does not order the units, and it does not drive the execution that follows

### Trigger Signals

Heuristic signals for goal-plan-uncompiled detection (not hard gates):

| Signal | Detection |
|--------|-----------|
| Goal exceeds one interval | The stated goal plainly exceeds one execution horizon, so it must run as several intervals and how to cut them is unsettled |
| "What should each run finish?" | The user asks what the pieces are and when each is done — not what order they go in, which is `/conduct` |

**Skip**:
- No autonomous intent — the request is for an ordinary explanatory plan, not execution preparation
- The goal already carries units whose completion conditions are settled — closed by a determinate predicate or by a recorded acceptance (a prior `/apportion` plan covers this goal and the goal is unchanged)
- One self-evident leaf: the goal fits one execution horizon as a single unit and its done-criterion is already determinate
- The user asks for ordering, independence, reconciliation, routing, or how the run stops as a topology — how many rounds or passes a region runs, as distinct from what one unit's done means → `/conduct` (the units already exist)
- The goal's own scope is too thin to read obligations from → `/inquire` (gather the missing pre-plan fact first)

### Cross-Session Enrichment

Repeated apportionment patterns and recurring failure modes accumulated in Anamnesis's hypomnesis store (prior-session recall indices), and any context surfaced when `/recollect` has been invoked this session, enrich Phase 1 seam scanning and Phase 2 condition derivation. This is a heuristic input; constitutive judgment remains with the user at the gates.

**Revision threshold**: When Emergent plan-condition scopes across 3+ sessions cluster around a recognizable pattern outside the named scopes, the plan-scope set warrants a new named member. Named scopes are working hypotheses, not exhaustive categories.

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| User Esc key | Deactivate for the remainder of the session (EarlyExit — no emission, no handoff recorded) |
| No autonomous intent, or already condition-bearing | Relay the scan result and deactivate without activating |
| Prior handoff present but unreadable | Relay that the canonical record is unreachable and deactivate — the goal does not fall through to the uncompiled path |
| Route-to-`/bound` at the whole-goal acceptance gate | Deliberate reroute (no emission): the acceptance boundary goes to `/bound`; a later `/apportion` invocation recompiles fresh |
| Plan emitted | Terminal: apportionment trace presented, handoff recorded, deactivate |

## Protocol

### Phase 0: Uncompiled-Plan Checkpoint

Read the goal for autonomous intent and for whether it is already condition-bearing. Detection is silent on the uncompiled path; on either relay path, surface the scan result and deactivate without activating.

Scan, in priority order: prior protocol output in this session (a boundary map, or a conducted method's unresolved autonomous region, is the richest input), `/apportion` arguments, then conversation context. Cite the cue for autonomous intent. When the scan turns up a prior `/apportion` navigation block, dereference it at its locator — the one carrier record, read at the record identity within the session that locator names — and decide `condition_bearing` against the plan read back from that carrier, not against the goal's wording; a unit the record closes by recorded acceptance is carried, the same as one closed by a predicate. A block that is present but will not dereference — the locator unreachable, missing its session half, or a load-bearing premise the grounding pass cannot support — stops the protocol: surface that the canonical record is unreadable and deactivate. Recompiling instead would rebuild a second plan from heuristic context, blind to the first plan's accepted residuals and owed obligations. Only the absence of any block leaves the uncompiled path correct.

### Phase 1: Apportionment

Read the goal's obligations, then loop: each cycle proposes one unit for the highest-leverage unapportioned region.

1. **Scan for seams** over the current residual. A seam is a place the goal's own structure already divides: a dependency edge, a deliverable boundary, a verification point, an ownership change. Read-only; cite where each seam was observed.
2. **Pack** the residual against the execution horizon into a proposed unit, and judge its fit — fits, overflows, or indeterminate. An unjudgeable fit is surfaced as indeterminate at the gate; it is never quietly recorded as fitting. Pack also reads the proposed unit's capability requirements and feasibility notes from the goal's stated needs — a functional description of what the work needs, never a concrete executor, model, runtime, or tool token.
3. **Qualify the cut**. When the proposed unit sits on a seam found in step 1, the cut is grounded and carries that citation. When the goal supplies no such evidence, the cut is heuristic — declared, not dressed up as a natural joint.
4. **Present** the proposed unit with its fit verdict, its seam quality and basis, and the current cut-set, via Cognitive Partnership Move (Constitution) — unless a single dominant unit fits, in which case accept it as relay.

The accept option is fit-complementary: on a unit that fits, the user simply accepts it; on one that overflows or cannot be judged, the only way in is an override recorded on that unit. The user may instead direct a recut of the same region or declare the apportionment sufficient. On sufficiency — or when seam evidence runs out — the remaining obligations are packed at heuristic seams and surfaced as relay, with each packed unit's fit re-checked and its heuristic quality declared; a packed unit that does not fit comes back as the next proposal so the override stays the user's to record. A packed unit that does fit is integrated through the same identity-assigning step as an accepted unit.

The loop ends when every obligation is apportioned to a unit or visibly delegated out of scope.

### Phase 2: Condition Derivation and Confirmation

For each unit, derive its conditions; for the goal as a whole, derive the conditions no single unit owns.

- **Per-unit** — a completion predicate (the unit achieved its result) and any invariant predicates (the run preserved a boundary while achieving it). Both kinds are verifiable predicates: executable checks with determinate pass/fail outcomes. A condition expressible only as prose judgment is not derivable — surface it as a residual for the user to sharpen into a predicate or accept as uncovered. A unit with no completion predicate is not an executable interval; it closes as a predicate or as a recorded acceptance, never silently.
- **Plan-level** — conditions whose subject is the whole goal rather than any one unit: final integration, global non-regression, whole-goal acceptance. These stay plan-level and carry a plan-state requirement — a self-contained property of when the condition becomes safe to discharge, never a named unit or order-position: naming an order fact belongs to `/conduct`, not this protocol. Do not distribute a global condition across every unit to make it fit the leaf type.
- **Out of scope** — an obligation whose violation must be caught *before* an action executes cannot be a stop-time predicate. Declare it out of scope as relay text with the delegated substrate named.

**Whole-goal acceptance check** (before the confirmation gate): per-unit completion predicates make each interval determinate, but they do not say when the *goal* is accepted. When no plan-level acceptance condition exists, present the gap and its consequence as pre-gate text, then **present** via Cognitive Partnership Move (Constitution): define it now, hand its definition to `/bound`, or proceed without one on record. This fires on entering the confirmation step, and again if an adjustment clears an acceptance criterion the user had already stated.

Then present the apportionment together with its conditions as pre-gate text — per unit: obligations covered, seam quality and citation, fit verdict, each derived predicate with its kind; per plan condition: scope, kind, and the plan-state requirement that makes it safe to discharge; each residual with its uncovered-obligation note; each out-of-scope obligation with its substrate; and the invariant status for coverage and fit — then **present** via Cognitive Partnership Move (Constitution): Confirm, Adjust the conditions over the same units, or Reopen a unit.

An Adjust direction reshapes what each condition ASSERTS. When a whole-goal acceptance criterion becomes safe to discharge is a plan-state fact this protocol computes at Confirm, not a value the user authors, so a direction phrased as timing lands on the criterion rather than on its firing point.

Adjust rederives over the same apportionment and re-presents. Reopen returns exactly that unit's obligations to the residual and re-enters Phase 1. Both are bounded by user agency: Confirm or Esc terminates.

### Phase 3: Emission and Handoff

On Confirm:

1. **Emit** one goal entry per unit via TaskCreate — the unit's identity, subject and obligations, plus one unit-resolution certificate. When it carries a compiled completion condition, the determinate certificate holds the conjoined predicate and every typed conjunct; otherwise the accepted-uncovered certificate holds a non-empty accepted-completion witness and any compiled invariant conjuncts. Carry the unit's capability requirements and feasibility notes verbatim. One unit is one execution interval is one entry; plan-level conditions are emitted as their own entries carrying the already-checked plan-state requirement under which each becomes safe to discharge.
2. **Package the result**: carry over E's own unit and plan-condition entries as the plan's units and plan conditions, and fold in every qualifying fact Λ already holds — each accepted-uncovered residual keyed to its owning unit, the out-of-scope declarations, and the unbounded-acceptance waiver — as fields on the returned plan itself, not only as trace text.
3. **Park the plan and emit the handoff navigation block**: first write the packaged plan into ONE new carrier record so a single dereference reconstructs it, then emit purpose/frame, that carrier's canonical locator, the dereference instruction, a snapshot anchor only when exact-state determinacy is needed, and the grounding instruction to run `/inquire` where available (or equivalent grounding) and stop on an unreachable source or unsupported load-bearing premise. The block is a pointer to the carrier, never a re-authored plan; the per-unit entries stay where the enforcer reads them.
4. **Present the apportionment trace**, then deactivate: the plan readback, then per unit its covered obligations, seam quality, fit verdict, unit-resolution certificate (determinate predicate or accepted-completion witness) with each conjunct's kind, and its capability requirements and feasibility notes; the plan-level conditions; each accepted-uncovered residual; each out-of-scope obligation with its substrate; and any recorded acceptance waiver. The handoff witness is established before the trace describes it, as FLOW, PHASE TRANSITIONS and TOOL GROUNDING all order it.

Emission is Merismos's epistemic endpoint. Merismos does not invoke the downstream enforcer, and it does not order the units — the user activates the enforcer separately, and `/conduct` arranges the units if their arrangement is non-trivial. Nothing of Merismos survives into the execution interval.

## Composition

Merismos is the apportion-and-condition step ahead of an autonomous run. The composition, in prose with standard notation:

- **Two-way with `/conduct`, guarded**: a multi-unit plan flows from `/apportion` into `/conduct` as its work prospect when the units' order, independence, reconciliation, termination topology or routing is non-trivial. In the other direction, a `/conduct` activation that reaches an unresolved autonomous region hands that region to `/apportion` for apportionment and conditioning. Both edges are advisory, never preconditions, and both carry the no-reentry guard of Rule 9. When `/apportion` receives an already-conducted region, that region's topology is fixed input and this protocol does not re-conduct it. A single unit, or a unit set whose order, independence, reconciliation, termination and routing are all trivial, bypasses `/conduct` entirely.
- **Owed reapportionment from `/conduct`'s withdrawal**: a third, distinct edge from the two above. When `/conduct` cannot arrange a move for one of this protocol's incoming units, it withdraws that unit and hands it back naming `/apportion` as the resolver, carrying the WHOLE unit entry rather than its identity alone. A later `/apportion` invocation whose prior protocol output names that owed unit entry reads its `obligations` field into the invocation-local `O_G` set (`ReadObligations` at the Phase 0 → Phase 1 edge), returning them to `residual` for a fresh apportionment pass without mutating the supplied goal — never a resumption of the withdrawn unit's dissolved cut: its former fit and seam judgments do not travel and are not reused.
- **`/bound` upstream**: a boundary map narrows both halves — which seams are candidate cuts, and which conditions the units are subject to. Advisory: absence narrows the read, it does not block apportionment.
- **The enforcer is a leaf executor**: on Claude Code, `/goal` installs a session-scoped stop-hook that re-prompts the model until its condition is met. It enforces a completion predicate *inside* one bounded interval; it exposes no external step injection and no mid-loop gating. The enforcer consumes a leaf, not a workflow; the workflow role belongs to `/conduct` and, for step-approval/resume/timeout semantics, to a workflow/HITL substrate outside this protocol suite.
- **Separate activation**: emitting the plan is `/apportion`'s epistemic endpoint. The user invokes the enforcer separately, so the constitutive act of starting the autonomous interval stays with the user.
- **Executor binding is outside**: units carry capability requirements and feasibility notes, never a concrete executor, model, runtime or tool token. Which substrate realizes a unit is bound at the consuming runtime's seam, not inside the plan.
- **After the interval**: `/contextualize` checks post-execution applicability and `/grasp` verifies understanding of the result, both downstream of the enforced run.

## Known Limitations

**Bounded platform claim**: The leaf-executor characterization of `/goal` (stop-hook predicate enforcer, no external step injection) is verified against Claude Code v2.1.140 only. A harness version change requires re-verification before relying on the composition guidance above.

**Obligation reading is heuristic**: The goal's obligations are read from its utterance, prior protocol output, and session context. An obligation the user holds but never uttered, and that no upstream protocol captured, will not be read — and therefore will not be covered, even though coverage is a hard invariant over what *was* read. The Phase 2 gate is where such an omission becomes visible: the apportionment is presented with its covered obligations precisely so a missing one shows up as absent. Recognizing it there does not correct it in place — `O_G` is fixed on the Phase 0 → Phase 1 edge and no Phase 2 judgment writes to it (`Adjust` rewrites conditions over the same units; `Reopen` returns an existing unit's obligations). The correction is to state the missing obligation and re-invoke, so `ReadObligations` reads it into a fresh pass. One case is not heuristic: when the prior protocol output is `/conduct`'s owed-reapportionment entry for a unit it could not place a move for, `ReadObligations` reads that unit's obligations directly off the entry's `obligations` field into local `O_G` — a FORMAL step (`ReadObligations`, `owed_unit`, `owed_obligations`; see TYPES), not inferred from prose and not written back into G. A different `/conduct`-origin case has no analogous formal reader and needs none: a `TerminationGround` recorded as `resolution_required(/apportion)` names this protocol as the owed resolver for a WHOLE region rather than one unit's obligations, and it travels as an ordinary navigation handoff — the locator naming both the record and the session that emitted it, plus the grounding instruction to run `/inquire`. Re-invoking this protocol on that already-condition-bearing plan relays (Rule 12); the region's discharge happens in the session that takes the handoff up.

**Seam evidence is often absent**: An abstract goal frequently supplies no dependency, deliverable, verification or ownership seam. Those cuts are declared heuristic rather than certified, and the resulting units may carry duplicated setup, cross-unit state leakage, or awkward predicates. The declaration makes the risk visible; it does not remove it.

**Horizon fit is an estimate**: Whether a unit's work completes within one execution horizon is judged before the run, from the goal's description. An unjudgeable fit is surfaced rather than guessed, but a fitting verdict can still be wrong — hence the override path.

**Predicate coverage**: Subjective quality bars and moving targets do not derive into verifiable predicates. Merismos surfaces them as residuals rather than emitting prose conditions; an uncovered residual the user accepts remains genuinely unguarded during the interval.

**Granularity is not re-cut**: A work body that already carries units with compiled conditions — closed by a determinate predicate or by a recorded acceptance — is `condition_bearing`, so this protocol relays and deactivates — even when those units are at an unsuitable granularity. Re-cutting an existing unit set is deliberately out of scope: this protocol cuts at the coarse framing units an autonomous run is carried out in, and finer task-level subdivision carries no meaning at the enforcer's leaf. A plan whose units are wrongly sized is corrected by restating the goal and recompiling, not by a granularity pass. The retired `/delimit` protocol held that pass over external work-breakdown structures; its removal leaves this gap open by decision rather than by oversight.

**No execution-time protection**: Merismos is compile-time only. A risk that emerges mid-interval — one not present in the goal's obligations at compile time — is outside the emitted conditions; pre-action risks are entirely the harness substrate's responsibility.

## Rules

1. **User-initiated, AI-apportioned**: User declares autonomous execution intent via `/apportion`; AI reads the obligations, searches the apportionment, and derives the conditions; the user settles each unit at Phase 1 and the conditioned plan at Phase 2 via Cognitive Partnership Move (Constitution).
2. **Apportion, do not order**: Merismos cuts the units and conditions them. Order, independence, reconciliation, termination topology and routing are `/conduct`'s. The emitted artifact is pre-conduct by construction.
3. **Coverage is a hard invariant**: Every obligation read from the goal belongs to some unit, is visibly declared out of scope, or is accepted as uncovered on record. A plan that leaves an obligation silently unowned is not emitted — the gap is surfaced at the confirmation gate for the user to close by recutting, by accepting it as an uncovered residual, or by delegating it out of scope. A goal from which nothing could be read at all (no unit, no delegation) does not emit an empty plan — it relays to `/inquire` instead.
4. **Fit is a hard invariant with an override path**: Every unit fits one execution horizon, or carries an override the user recorded on that unit. An unjudgeable fit surfaces as indeterminate at the gate; it is never quietly read as fitting, and an overflowing unit is never committed without the recorded override. The gate enforces this by offering the accept options fit-complementarily — plain acceptance only on a fitting unit, the recorded override as the only way an unfitting one enters — and neither the autonomous packing pass nor a confirmation may carry an unfitting unit past it.
5. **Seam quality is declared, not asserted**: Each cut cites the dependency, deliverable, verification or ownership seam it sits on — or another the goal evidences, the four being what the scan looks for rather than the only admissible kinds — or declares itself heuristic. Seam quality is a disposition rather than an invariant — an abstract goal may carry no evidenced joint, and claiming one anyway would be false precision.
6. **The join rule — one unit, one interval, one resolution certificate**: A unit's completion and invariant predicates are conjoined into a single leaf predicate and emitted in one certificate. The certificate retains each conjunct's kind so provenance stays readable. A compiled completion predicate selects `DeterminateResolution`; without one, Confirm must have produced at least one accepted completion residual, and `AcceptedUncoveredResolution` carries that non-empty witness plus any compiled invariant conjuncts.
7. **Plan conditions stay plan-level**: A condition whose subject is the whole goal carries a plan-state requirement — a topology-free property of when it becomes safe to discharge, never a named unit or order-position, which is `/conduct`'s axis to resolve. It is never distributed across every unit to fit the leaf type.
8. **Separate activation**: Emitting the plan is the epistemic endpoint. Merismos does not invoke the downstream enforcer; starting the autonomous interval is the user's separate constitutive act.
9. **No-reentry across the `/conduct` seam**: Both directions of the `/conduct` edge are advisory and guarded. A condition-bearing unit plan consumed by `/conduct` supplies stated termination grounds only for the regions whose resolved termination is `until_goal_met` — conjoining that region's `DeterminateResolution` predicates, or naming `/apportion` as the owed resolver when none exist — that naming travels with the plan's own locator, so it reaches this protocol's durable record rather than standing as a bare absence, and `/conduct` discloses it as the region's ground instead of substituting a convergence contract; on a MIXED such region (some units `DeterminateResolution`, some `AcceptedUncoveredResolution`), the accepted units' own compiled invariant conjuncts sit outside that conjunction and `/conduct` carries them on the same per-unit binding for the executing substrate to enforce inside each unit's own interval (see hyphegesis SKILL.md TYPES, `UnitGroundDisposition`). Every other region enforces the executable conditions its unit resolutions actually carry inside their own intervals and records a coverage limit; an accepted completion residual remains an acceptance record rather than a fabricated leaf. None of it routes back to `/apportion`. An already-conducted autonomous region consumed by `/apportion` has fixed topology and is not re-conducted. A single unit, or a unit set whose order, independence, reconciliation, termination and routing are all trivial, bypasses `/conduct`. Neither edge is a precondition. A unit `/conduct` withdraws because it could arrange no move for it is a separate, third edge — an owed re-apportionment back to `/apportion` (see Composition, "Owed reapportionment from `/conduct`'s withdrawal").
10. **Verifiable predicate or witnessed acceptance required**: Every emitted unit resolution is either a `DeterminateResolution` carrying an executable check with a determinate pass/fail outcome, or an `AcceptedUncoveredResolution` carrying a non-empty accepted-completion witness — never a vacuous always-true check and never an unwitnessed tag. Every emitted plan condition is an executable check with a determinate pass/fail outcome. A condition expressible only as prose judgment is surfaced as a residual — sharpened into a predicate or accepted as uncovered — and is never emitted as prose.
11. **Stop-time only**: Only conditions evaluable when an interval stops are derived. An obligation requiring pre-action interception is declared out of scope with its delegated substrate named; deriving it into a stop-time leaf simulates protection while providing none.
12. **Stateless compile, but never blind**: Emission is terminal. No session approvals, no per-action classification, no mid-execution checkpoint; a re-invocation carries no invocation-local state forward and recompiles rather than resuming. A prior plan reached through its navigation block is already condition-bearing and relays; a navigation block that is present but will not dereference — locator unreachable, missing its session half, or a load-bearing premise the grounding pass cannot support — stops the protocol instead of falling through to the uncompiled path.
13. **Transparency-grounded**: Every obligation cites its evidence; every seam quality, fit verdict, residual disposition, override and out-of-scope delegation is visible in pre-gate text or the apportionment trace — surfaced and relay paths satisfy the same transparency invariant.
14. **Recognition over Recall**: Present structured options with differential implications via Cognitive Partnership Move (Constitution); Constitution interactions yield turn before proceeding.
15. **Context-Question Separation**: All analysis, evidence, and rationale appear as text output preceding the Constitution interaction; the question contains only the essential choice and option-specific differential implications.
16. **Convergence evidence**: Present the apportionment trace before deactivating — the plan readback plus per-unit evidence (obligations covered, seam quality with its citation or heuristic declaration, fit verdict or recorded override, unit-resolution certificate with conjunct kinds, capability requirements and feasibility notes), the plan-level conditions, each accepted-uncovered residual, and each out-of-scope delegation — required, not asserted. The units, plan conditions, accepted-uncovered residuals, out-of-scope delegations, and any acceptance waiver are additionally carried as fields on the emitted plan itself, in exact correspondence with what was emitted. Park the packaged plan in its own carrier record and emit the fixed-shape navigation block beside the trace, so a later session dereferences that one carrier to get the whole plan; its locator names both that record and the session that owns it, and no locator remains solely in invocation-local state.
17. **Option-set relay test (Extension classification)**: When AI analysis converges to a single dominant option (option-level entropy → 0), present the finding directly as Extension — a single dominant unit that fits its horizon is accepted as relay rather than wrapped in a false choice. Each Constitution option must be genuinely viable under different user value weightings; options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options.
18. **Gate integrity** (Safeguard tier): The defined option set is presented intact — option injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option into a concrete unit or condition while preserving the coproduct structure) is distinct from mutation.
19. **Substrate boundary**: Merismos scope is the epistemic substrate — obligation reading, apportionment search, fit and seam judgment, condition derivation, compile-time confirmation. Enforcement inside each interval, pre-action interception, workflow/HITL semantics, and concrete executor binding belong to native harnesses or specialized substrates, delegated by handoff at emission.
20. **Plain emit discipline**: User-facing emit (unit proposals, gate options, apportionment traces, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the unit, the condition, or the question in their idiom.
21. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background and distant context to pre-gate text or the apportionment trace.
22. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract, since each block is the type that constitutes the protocol — preserving the blocks keeps the protocol intact. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).
23. **Seam relay on declared continuation, enforcer edge excepted**: this protocol's seam splits into two, each scoped to its own lifecycle point. INBOUND activation seam (before this protocol activates): when a user-declared chain names `/apportion` next, or an invocation follows the `## Composition` chain's declared `/bound → /apportion` or `/conduct → /apportion` edge, the transition into `/apportion` is relay (Extension) — proceed directly, citing the settling source. OUTBOUND emission seam (after this protocol emits): the `/apportion → enforcer` edge is EXCLUDED — Rule 8 (Separate activation) governs it more specifically; the `/apportion → /conduct` edge relays only under a user-declared chain naming `/conduct` next, and carries Rule 9's no-reentry guard. Both seams govern only the transition BETWEEN protocols; every Constitution gate inside this protocol and the next fires unchanged, and the user can redirect at any turn.
24. **Whole-goal acceptance before an unaccepted plan**: A plan whose conditions carry no whole-goal acceptance criterion fires one conditional confirmation before the confirmation gate — define it now, route its definition to `/bound`, or proceed without one on record. The approval is recorded state, never an inference. Per-unit completion predicates do not satisfy this: they make each interval determinate without saying when the goal itself is accepted. Neither does a whole-goal *invariant* — right scope, wrong kind: it names a boundary the run preserves, not the point at which the goal is accepted, so only a completion-kind whole-goal condition closes this gate. Every `DefineNow` retracts a stale `ApproveUnbounded` waiver still on record — not only when reached through `Adjust`, but on ANY firing of this gate, since `ApproveUnbounded` never writes to the plan conditions and a `Reopen` can leave `acceptance_present(P)` false and let this gate fire again later. A plan never emits both a real acceptance condition and a stale unbounded waiver.
25. **Back-edge state preservation**: `Reopen` is the one path back into the apportionment loop from Phase 2. Only the reopened unit's own state resets — its obligations return to `residual`, its compiled conditions and residuals leave `K`/`R` with it, and its fit-override record (if any) leaves `Λ.fit_overrides` with it too: a fresh repack of its returned obligations gets a fresh `UnitRef` and, if it again overflows, needs its own `OverrideFit` recorded anew. Every other unit's already-derived conditions, and any whole-goal plan conditions already derived or user-adjusted, are carried forward UNCHANGED — never silently re-derived: `residual` is never re-seeded from the goal's full obligation set (that seeding is a one-time action on the Phase 0 → Phase 1 edge, never repeated), and `Derive`/`DerivePlan` never re-run over content a prior Phase 2 pass or a user's `Adjust` already produced. `Reopen` also marks the whole-goal conditions stale for surfacing (`Λ.plan_conditions_stale`), because the unit set they were derived or adjusted against just changed under them — the next confirmation gate surfaces that as a notice, and the user's own next `Adjust` clears it.
