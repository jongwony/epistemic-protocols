---
name: apportion
description: "Apportion an autonomous goal into coarse execution units and derive each unit's completion conditions before the run begins. Cuts the goal at its evidenced seams so each unit fits one execution horizon and every goal obligation lands in some unit, derives per-unit completion and invariant predicates plus the cross-unit plan conditions, and emits one goal entry per unit whose conditions are conjoined into a single leaf predicate; risks needing pre-action interception are declared out of scope. Pre-conduct: unit boundaries and conditions only — order, independence, reconciliation and routing stay /conduct's. Type: (GoalPlanUncompiled, User, APPORTION, AutonomousGoal × ExecutionHorizon) → ConditionBearingUnitPlan. Alias: Merismos(μερισμός)."
---

# Merismos Protocol

Apportion an autonomous goal into coarse execution units and derive each unit's completion conditions before the run begins: cut the goal at its evidenced seams so each unit fits one execution horizon and no obligation is orphaned, derive per-unit completion and invariant predicates plus the cross-unit plan conditions, and emit one goal entry per unit. Type: `(GoalPlanUncompiled, User, APPORTION, AutonomousGoal × ExecutionHorizon) → ConditionBearingUnitPlan`.

## Definition

**Merismos** (μερισμός: a dividing into parts, an apportionment): A dialogical act of apportioning an autonomous goal — deciding **which units the goal is carried out in** and **what each unit's done means** — when the goal is stated but its plan is uncompiled. The protocol's lexical verb is `/apportion`. It reads the goal's obligations, cuts them into coarse units at seams it can cite, judges each unit against one execution horizon, derives a completion predicate and any invariant predicates per unit, separates the conditions whose subject is the whole goal rather than any one unit, and emits one goal entry per unit whose conditions are conjoined into a single leaf predicate. Two invariants bind the result: every goal obligation belongs to some unit, and every unit fits one horizon or carries a recorded override. Merismos apportions and conditions; it does **not** order — sequence, independence, reconciliation, termination topology and routing are `/conduct`'s work, so the emitted plan is a **pre-conduct** artifact. The protocol holds no state during execution.

```
── FLOW ──
Merismos(G) → Probe(G) → goal_plan_uncompiled? →
  ¬autonomous_intent(G):  → relay(no autonomous interval in scope) (extension) → deactivate   -- an ordinary explanatory plan is not this deficit
  condition_bearing(G):   → relay(units and conditions already present) (extension) → deactivate
  uncompiled: VelocityFilter(G) → oos → init_loop_state: cycle_n=1, U=∅, residual=obligations(G) \ {d.obligation | d∈oos}, K=∅, R=∅, P=∅,
                              invariant_status=⊥, accepted=∅, unbounded_approved=⊥, history=∅, loop:   -- oos is computed once, before residual is seeded, so a pre-action obligation never enters the packing loop
    Phase 1 Scan(G, residual, cycle_n) [per-cycle re-scan] → seams(residual) → Pack(seams, horizon) → (Anchor[cycle_n], proposed_unit, SpanFit, Seam) →
      Anchor empty ∧ residual = ∅ ∧ U = ∅ ∧ oos = ∅:  → relay(goal's scope too thin to read any obligation — route to /inquire) (extension) → deactivate  -- nothing was ever apportioned; emitting an empty plan would misreport that apportionment occurred
      Anchor empty ∧ residual = ∅ ∧ (U ≠ ∅ ∨ oos ≠ ∅):  → Phase 2                -- every obligation apportioned or visibly delegated, and something was actually read
      Anchor empty ∧ residual ≠ ∅:  → autonomous_pack(residual) (track) → [any packed unit with SpanFit ≠ Fits, or residual ≠ ∅ after packing: it re-enters as the next cycle's Anchor (reason surfaced as relay) → cycle_n += 1, loop] | (U'', residual := ∅) → surface (extension) → Phase 2  -- seam evidence exhausted; AI packs the remainder at Heuristic seams, surfaced as relay; a packed unit never enters U on an unfitting span
      SingleDominantUnit(Anchor, proposed_unit) ∧ SpanFit = Fits: → relay(AcceptUnit) (extension) → integrate_unit → cycle_n += 1, loop  -- no genuine alternative apportionment exists for this Anchor
      else:                         → Qu(Anchor[cycle_n], proposed_unit, SpanFit, Seam, U_snapshot, cycle_n) → Stop → Aᵤ →
        Esc:                → ungraceful deactivate (EarlyExit — no emission, no handoff recorded)
        Aᵤ = AcceptUnit     → integrate_unit(proposed_unit) → cycle_n += 1, loop                -- offered iff SpanFit = Fits; assigns the accepted unit a fresh UnitRef
        Aᵤ = Recut(d)       → re-derive the Anchor frame under d → cycle_n += 1, loop           -- same residual, different cut
        Aᵤ = OverrideFit    → Λ.fit_overrides ∪= {proposed_unit} → integrate_unit → cycle_n += 1, loop  -- offered iff SpanFit ≠ Fits: an Overflows/Indeterminate unit committed on record
        Aᵤ = Sufficient     → autonomous_pack(residual) (track) → [any packed unit with SpanFit ≠ Fits, or residual ≠ ∅ after packing: next cycle's Anchor → cycle_n += 1, loop] | (U'', residual := ∅) → surface (extension) → Phase 2
    Phase 2 ∀u∈U: Derive(u) → κ ∨ ρ → (K, R) ∥ DerivePlan(G, U) → P →
      oos ≠ ∅ → OOS(oos) (extension)                                            -- obligations needing pre-action interception: out of scope, substrate named; oos was computed at Phase 1 entry, not re-computed here
      ¬acceptance_present(P) → Qt(K, P) → Stop → Vₜ →                            -- the whole goal has no acceptance criterion yet
        Vₜ = DefineNow(d)     → P := P ∪ {plan_condition(d)}                     -- acceptance_present(P) now holds by construction
        Vₜ = RouteBound       → deactivate                                       -- Rerouted: the acceptance boundary goes to /bound; a later /apportion recompiles fresh
        Vₜ = ApproveUnbounded → Λ.unbounded_approved := ⊤                        -- recorded acceptance, visible in the trace
      check(U, K, R, P, oos) → InvariantStatus                                   -- coverage_complete ∧ span_fit ∧ termination_covered ∧ obligations_derived ∧ oos_substrate_named
      Qc(U, K, R, P, InvariantStatus, oos) → Stop → V →
        V = Adjust(d)  → rederive(K, R, P, d) → (K, R, P) := (K', R', P') → [¬acceptance_present(P') → Qt(K', P') → Stop → Vₜ] → Qc(...)   -- over the SAME U: K' ∪ R' spans every obligation of every unit (no removal; a withdrawn condition becomes a residual); an Adjust that clears whole-goal acceptance re-fires Qt before re-presenting
        V = Reopen(u)  → residual := residual ∪ u.obligations; U := U \ {u} → cycle_n += 1 → Phase 1   -- the conditions revealed a bad cut; that unit returns to the apportionment loop
        V = Confirm ∧ ¬hard_invariants_hold(Λ): → re-present Qc with the violated invariant named   -- a hard invariant is never waived by confirming past it
        V = Confirm ∧ hard_invariants_hold(Λ):  → AcceptResiduals(R) → ∀ρ∈R: ρ.disposition := AcceptUncovered → Phase 3
    Phase 3 Emit(U, K, P) → E [TaskCreate] → converge(apportionment trace) → ConditionBearingUnitPlan

── MORPHISM ──
AutonomousGoal × ExecutionHorizon
  → probe(goal)                        -- detect a stated autonomous goal whose unit plan and conditions are uncompiled
  → scan(seams)                        -- read the goal's obligations for cuttable seams: dependency, deliverable, verification, ownership
  → filter(velocity) → oos             -- an obligation guardable only by pre-action interception is declared out of scope with the delegated substrate recorded on the declaration; computed once before packing begins, so it never enters a unit
  → pack(seams, horizon) → Unit        -- THE IRREDUCIBLE CORE, part one: apportion the obligations into coarse units such that each unit fits one execution horizon and every obligation lands in some unit
  → fit(unit, horizon) → SpanFit       -- per-unit horizon-fit predicate; Indeterminate is surfaced, never silently read as Fits
  → qualify(cut) → Seam                -- Grounded when a dependency / deliverable / verification / ownership seam is cited; Heuristic when the goal carries no such evidence — declared, not asserted as a natural joint
  → [SingleDominantUnit(Anchor, proposed_unit) ∧ SpanFit = Fits: relay(AcceptUnit) (extension) | else: present(anchor, proposed_unit, SpanFit, Seam) (constitution)]
  → integrate(unit_judgment, U, residual) → (U', residual')   -- monotone in coverage: an obligation leaves residual only when it enters some unit; a fresh UnitRef is assigned to the accepted unit
  → derive(unit) → (Set(κ), Set(ρ))    -- THE IRREDUCIBLE CORE, part two: per obligation of the unit, a verifiable predicate (completion or invariant) or a residual; every obligation of the unit lands in exactly one of the two sets
  → derive_plan(goal, U) → P           -- conditions whose subject is the whole goal, not any one unit; NOT distributed across units to fit the leaf type
  → confirm(unit_plan)                 -- user judges the apportionment together with its conditions
  → emit(goal_entries)                 -- one entry per unit; that unit's conditions conjoined into one leaf predicate; handoff recorded
  → ConditionBearingUnitPlan
requires: user_initiated(G)            -- user declares autonomous execution intent via /apportion
deficit:  GoalPlanUncompiled           -- activation precondition (Layer 1)
preserves: G                           -- compile-time only; the goal is read, never mutated; no execution-state mutation
invariant: Apportion over Order        -- Merismos cuts the units and conditions them; it does not sequence them (order, independence, reconciliation, termination topology and routing are /conduct's)
invariant: Coverage over Convenience   -- every goal obligation belongs to some unit or is visibly delegated; a plan that omits one converges locally and lies globally
invariant: Fit over Ambition           -- every unit fits one execution horizon, or carries an explicitly recorded override
invariant: Declared Seam over Asserted Joint  -- a cut cites its seam evidence or declares itself heuristic; it never claims a natural joint it cannot evidence

── TYPES ──
G              = AutonomousGoal { utterance: String, obligations: Set(Obligation), prior: ProtocolOutput?, session: Context }
ProtocolOutput = prior protocol's converged output in current session (e.g., a boundary map, a conducted method's autonomous region)
Obligation     = a stated or inferred requirement the goal must satisfy — the unit of coverage; each cites its evidence in G
H              = ExecutionHorizon      -- the budget one autonomous run is expected to fit (turns, time, context lifecycle); read from context, cue cited
U              = Set(Unit)             -- the apportionment
Unit           = { unit_ref: UnitRef, subject: String, obligations: Set(Obligation), fit: SpanFit, seam: Seam }
               -- subject: a coarse framing of the work the unit carries, not a procedural step decomposition
               -- unit_ref: a stable identity assigned at integration, independent of subject — see UnitRef.
               --   Structural equality over Unit is therefore sound: two units are never equal by accident
               --   of sharing a subject, because unit_ref differs
SpanFit        ∈ {Fits, Overflows, Indeterminate}
               -- Fits: the unit's work completes within one execution horizon
               -- Overflows: exceeds it — recut, or commit under an explicit user override recorded on fit
               -- Indeterminate: not judgeable from available evidence; surfaced at the gate, never silently read as Fits
fit_override_recorded(u) ≡ u ∈ Λ.fit_overrides   -- written by OverrideFit, not inferred
Seam           = Grounded(Evidence) ⊎ Heuristic
               -- a coproduct, not a record with an optional field: Grounded CARRIES its citation by
               --   construction — there is no representable state where the quality reads Grounded and no
               --   evidence exists. Heuristic carries nothing because it declares an absence, not a missing
               --   field. This enforces Declared Seam over Asserted Joint at the type level rather than by
               --   an unenforced side condition
               -- Grounded(e): the cut sits on a cited seam — a dependency edge, a deliverable boundary, a
               --   verification point, or an ownership change; e is that citation
               -- Heuristic: the goal carries no such seam evidence; the cut is an emergent judgment,
               --   declared as such. Not a violation — an abstract goal may simply have no evidenced joint,
               --   and claiming one would be false precision
Evidence       = { source: String, content: String }   -- where the seam was observed in G or its cited substrate
Derive         = Unit → (Set(κ), Set(ρ))   -- per obligation of the unit: κ when a verifiable predicate exists, ρ otherwise.
               -- Set-valued because a unit carries one completion predicate plus any number of invariant
               --   predicates, and because coverage is checked per obligation, not per unit
κ              = CompiledCondition { unit: Unit, obligation: Obligation, kind: PredicateKind, condition: VerifiablePredicate }
               -- obligation is the coverage key: without it, "K ∪ R spans every obligation of every unit" is
               --   an unverifiable claim, and a hard coverage invariant that cannot be checked is not one
PredicateKind  ∈ {completion, invariant}
               -- completion: the unit achieved its result
               -- invariant: the run preserved a boundary while achieving it
               -- kept distinct so provenance stays readable even though the leaf conjoins them
VerifiablePredicate = an executable check with a determinate pass/fail outcome
               -- (command exit status, test result, countable threshold, file-state assertion)
               -- natural-language prose is not a predicate: it invites self-evaluation drift and false completion
ρ              = Residual { obligation: Obligation, unit: Option(Unit), kind: PredicateKind,
                            disposition: ResidualDisposition }
               -- kind records WHICH predicate the residual stands in for, so an accepted completion residual
               --   is distinguishable from an accepted invariant one
ResidualDisposition ∈ {Sharpen, AcceptUncovered}
               -- Sharpen: user supplies direction at Qc → rederive toward κ (an Adjust direction)
               -- AcceptUncovered: Confirm over a remaining residual constitutes acceptance — that obligation
               --   is unguarded during the interval, recorded in the trace, never emitted as prose
K              = Set(CompiledCondition)          -- unit-local conditions
P              = Set(PlanCondition)              -- cross-unit conditions
PlanCondition  = { scope: PlanScope, kind: PredicateKind, condition: VerifiablePredicate,
                   dischargeable_when: PlanStateRequirement }
PlanScope      ∈ {FinalIntegration, GlobalNonRegression, WholeGoalAcceptance} ∪ Emergent(PlanScope)
               -- a condition whose subject is the whole goal rather than any one unit. dischargeable_when
               --   states WHEN the plan state makes it safe to discharge the condition — a property of plan
               --   state alone, never a named unit or order-position: naming an order fact is /conduct's
               --   axis (Apportion over Order), not this protocol's. It is NOT distributed across every unit
               --   to fit the leaf type, which would multiply false failures and hide which unit owns it
UnitRef        = a stable identity carried by an emitted unit, assigned at integration and never reused —
               --   what a downstream consumer (a plan condition's basis, or /conduct's binding) keys on
               --   instead of subject, which is not unique across units
PlanStateRequirement = { predicate: VerifiablePredicate, basis: Set(Evidence) }
               -- a self-contained property of PLAN STATE: contains no UnitRef, Move, MoveRegion, or
               --   order-position reference. This is what makes Apportion over Order CONSTRUCTIVE rather
               --   than merely asserted — the type itself cannot carry an ordering fact, so a plan
               --   condition's firing criterion can never smuggle one in. "First evaluable" (when the
               --   predicate can first be checked) and "safe to discharge" (when its result is authoritative)
               --   are different predicates: dischargeable_when states the latter — e.g. a coverage
               --   predicate over K ∪ R, or a completion-count threshold — never a turn count or a named unit
topology_free(req) ≡ req contains no UnitRef, Move, MoveRegion, or order-position reference
               -- holds by construction for any well-typed PlanStateRequirement; stated as a checkable
               --   convergence conjunct rather than left as an unstated assumption about the type's shape
leaf(u)        = ⋀ { κ.condition | κ ∈ K, κ.unit = u }
               -- THE JOIN RULE: one unit = one execution interval = one conjoined leaf predicate. A unit's
               --   conditions are an all-of, not several entries: per-condition entries would duplicate the
               --   unit's execution identity, and a cartesian product does the same more explicitly
E              = Set(GoalEntry)        -- emission
GoalEntry      = UnitEntry { unit_ref: UnitRef, subject: String, condition: VerifiablePredicate }
               ⊎ PlanEntry { scope: PlanScope, kind: PredicateKind, condition: VerifiablePredicate,
                             dischargeable_when: PlanStateRequirement }
               -- a coproduct, not one record with an optional field: a unit entry has no firing point at all
               --   (its interval IS when it fires), while a plan entry carries dischargeable_when as a
               --   topology-free property of plan state — WHEN it becomes safe to discharge, never WHICH
               --   unit or order-position it follows; naming an order fact is /conduct's, not this
               --   protocol's, and scope+kind are retained (not reduced to a framing string) because a
               --   context-less consumer cannot recover them from prose
               -- per unit: UnitEntry(u.unit_ref, u.subject, leaf(u)); per plan condition:
               --   PlanEntry(p.scope, p.kind, p.condition, p.dischargeable_when)
oos            = Set(OOSDeclaration)   -- obligations guardable only by pre-action interception
OOSDeclaration = { obligation: Obligation, substrate: String, basis: Evidence }
               -- substrate names the delegated enforcement channel. It is a field rather than prose because
               --   the recorded handoff is what the substrate boundary requires; an out-of-scope declaration
               --   whose delegate is unnamed delegates to nothing
declared_oos(o) ≡ ∃ d ∈ oos : d.obligation = o ∧ d.substrate ≠ ""
VelocityFilter = G → oos               -- an obligation whose violation must be caught BEFORE an action executes
               --   (destructive command blocking, permission escalation, prompt-injection defense) cannot be a
               --   stop-time predicate: a completion check evaluates after the harm. Declared out of scope with
               --   its substrate named; deriving it into a leaf would simulate protection while providing none
InvariantStatus = { coverage_complete: Bool, span_fit: Bool, termination_covered: Bool,
                    obligations_derived: Bool, oos_substrate_named: Bool }
hard_invariants_hold(Λ) ≡ Λ.invariant_status.coverage_complete ∧ Λ.invariant_status.span_fit
                        ∧ Λ.invariant_status.termination_covered ∧ Λ.invariant_status.obligations_derived
                        ∧ Λ.invariant_status.oos_substrate_named
               -- every clause of apportioned(G) that a Qc judgment can still violate. The transition to
               --   emission is guarded by this conjunction, so no clause of the result equation is left
               --   asserted-but-unenforced — oos_substrate_named closes the fifth clause: a delegated
               --   obligation with no substrate named is as unenforceable as an uncovered one
coverage_complete(U, G) ≡ ∀ o ∈ G.obligations : (∃ u ∈ U : o ∈ u.obligations) ∨ declared_oos(o) ∨ accepted_uncovered(o)
               -- HARD invariant. Every goal obligation is apportioned to some unit, visibly delegated, or
               --   accepted as uncovered on record — never silently absent
span_fit(U)    ≡ ∀ u ∈ U : u.fit = Fits ∨ fit_override_recorded(u)
               -- HARD invariant, with an explicit user-override path
obligation_derived(u, K, R) ≡ ∀ o ∈ u.obligations : (∃ κ ∈ K : κ.unit = u ∧ κ.obligation = o)
                                                  ∨ (∃ ρ ∈ R : ρ.unit = Some(u) ∧ ρ.obligation = o)
               -- what the Adjust no-loss constraint checks: every obligation of every unit is carried by a
               --   predicate or by a residual. Checkable only because κ carries its obligation
unit_termination_covered(u, K, R) ≡ (∃ κ ∈ K : κ.unit = u ∧ κ.kind = completion)
                                 ∨ (∃ ρ ∈ R : ρ.unit = Some(u) ∧ ρ.kind = completion)
               -- a unit with no completion predicate is not an executable interval; it closes as a predicate
               --   or as an acceptance OF ITS TERMINATION, never on an unrelated residual that happens to
               --   sit in the same unit — ρ.unit = Some(u) ∧ ρ.kind = completion pins BOTH the unit and the
               --   predicate kind, so a residual for a different unit, or an invariant-kind residual for the
               --   same unit, cannot satisfy this clause
               -- evaluated PRE-Confirm as the guard on entering Confirm: tests whether the unit WILL be
               --   covered once AcceptResiduals commits, not whether ρ.disposition already reads
               --   AcceptUncovered. AcceptResiduals(R) accepts every residual in R unconditionally, so a
               --   scoped completion-kind residual already guarantees the disposition Confirm is about to
               --   set; checking the disposition field here would ask the guard to observe a transition
               --   that has not yet run — the deadlock this formulation avoids. AcceptResiduals additionally
               --   writes ρ.disposition := AcceptUncovered for each ρ ∈ R so the field reads correctly in
               --   the Phase 3 trace, but this guard does not depend on that write having happened yet
acceptance_present(P) ≡ ∃ p ∈ P : p.scope = WholeGoalAcceptance
               -- whether the GOAL as a whole has an acceptance criterion — distinct from per-unit completion.
               --   Its absence is what the Qt gate makes a decision instead of a default
accepted_uncovered(o) ≡ o ∈ Λ.accepted   -- recorded by AcceptResiduals on Confirm, not inferred
unbounded_approved ≡ Λ.unbounded_approved -- recorded by Qt on ApproveUnbounded, not inferred
Aᵤ             = UnitJudgment ∈ {AcceptUnit, Recut(direction), OverrideFit, Sufficient}
               -- AcceptUnit  offered iff SpanFit = Fits   -- accepting a fitting unit needs no override
               -- OverrideFit offered iff SpanFit ≠ Fits   -- the only way an unfitting unit enters U
               -- The two are fit-complementary, never both offered: presenting them together on one unit
               --   would make them share a trajectory apart from whether the override is recorded, and an
               --   unrecorded accept is exactly what breaks span_fit. Recut and Sufficient always offered
V              = Judgment ∈ {Confirm, Adjust(direction), Reopen(unit)}
Vₜ             = TerminationJudgment ∈ {DefineNow(direction), RouteBound, ApproveUnbounded}
               -- DefineNow: the user states the whole-goal acceptance criterion now; it enters P
               -- RouteBound: the acceptance boundary goes to /bound; this pass ends (Rerouted) and a later
               --   /apportion recompiles fresh
               -- ApproveUnbounded: informed acceptance of a goal with no whole-goal acceptance criterion
plan_condition(d) = PlanCondition materialized from a DefineNow direction
               -- scope = WholeGoalAcceptance, kind = completion, dischargeable_when = plan_terminal
plan_terminal  = a distinguished PlanStateRequirement whose predicate holds once every unit's leaf predicate
               --   has resolved (κ-covered or accepted-uncovered) — the ordinary terminal case, expressed
               --   as a property of plan state rather than as an order fact (after unit U / at terminal)
Rerouted       = routed_to_bound       -- deliberate non-emission exit at Qt; distinct from EarlyExit (abort)
EarlyExit      = user_esc              -- non-convergent abort: no emission, no handoff recorded
Emit           = (U, K, P) → E [Tool: TaskCreate]
cycle_n        = Nat                   -- apportionment cycle counter; surfaced at every Qu
Phase          ∈ {0, 1, 2, 3}
Qu             = Per-cycle apportionment interaction with (Anchor, proposed_unit, SpanFit, Seam, cut-set snapshot, cycle counter) [Tool: Constitution interaction]
Qt             = Whole-goal acceptance interaction, conditional on ¬acceptance_present(P) [Tool: Constitution interaction]
Qc             = Unit-plan confirmation interaction with (U, K, R, P, InvariantStatus, oos) [Tool: Constitution interaction]
ConditionBearingUnitPlan = { units: Set(UnitEntry), plan_conditions: Set(PlanEntry) }
               -- the emitted result: E partitioned by its coproduct constructor. Well-formed exactly when
               --   apportioned(G) holds (see CONVERGENCE) — the predicate is checked over E, not embedded
               --   in the type

── PHASE TRANSITIONS ──
Phase 0: G → Probe(G) → goal_plan_uncompiled?                          -- activation checkpoint (sense)
           ¬autonomous_intent(G) → relay → deactivate                  -- no autonomous interval in scope (extension)
           condition_bearing(G)  → relay → deactivate                  -- units and conditions already present (extension)
           uncompiled            → Phase 1
Phase 1: entry → VelocityFilter(G) → oos; residual := obligations(G) \ {d.obligation | d∈oos}   -- computed once, before packing begins
         (G, residual, cycle_n) → Scan [Tool] → seams → Pack(seams, H) → (Anchor, proposed_unit, SpanFit, Seam)   -- apportionment loop (sense)
           Anchor empty ∧ residual = ∅ ∧ U = ∅ ∧ oos = ∅ → relay(goal's scope too thin to read any obligation — route to /inquire) (extension) → deactivate   -- scope too thin to read any obligation; an empty plan would misreport apportionment as having occurred
           Anchor empty ∧ residual = ∅ ∧ (U ≠ ∅ ∨ oos ≠ ∅) → Phase 2
           Anchor empty ∧ residual ≠ ∅ → autonomous_pack(residual) (track) → surface (extension) → Phase 2 | re-anchor → cycle_n += 1, Phase 1
           SingleDominantUnit ∧ SpanFit = Fits → relay(AcceptUnit) (extension) → integrate → cycle_n += 1, Phase 1
           else → Qu → Stop → Aᵤ (constitution) [Tool]
             Aᵤ = AcceptUnit   → integrate(U, residual) → cycle_n += 1, Phase 1        -- offered iff SpanFit = Fits; assigns the accepted unit a fresh UnitRef
             Aᵤ = Recut(d)     → re-derive Anchor frame under d → cycle_n += 1, Phase 1
             Aᵤ = OverrideFit  → Λ.fit_overrides := Λ.fit_overrides ∪ {proposed_unit} → integrate → cycle_n += 1, Phase 1   -- offered iff SpanFit ≠ Fits
             Aᵤ = Sufficient   → autonomous_pack(residual) (track) → surface (extension) → Phase 2 | re-anchor → cycle_n += 1, Phase 1
             Esc               → deactivate (EarlyExit)
Phase 2: U → ∀u∈U: Derive(u) → (Set(κ), Set(ρ)) → (K, R) ∥ DerivePlan(G, U) → P   -- condition derivation (sense); oos already computed at Phase 1 entry
           oos ≠ ∅ → OOS(oos) (extension)                              -- out-of-scope declaration, substrate recorded on each OOSDeclaration
           ¬acceptance_present(P) → Qt(K, P) → Stop → Vₜ (constitution) [Tool]   -- fires at pass entry, and again after any Adjust that clears acceptance
             Vₜ = DefineNow(d)     → P := P ∪ {plan_condition(d)}
             Vₜ = RouteBound       → deactivate (Rerouted)
             Vₜ = ApproveUnbounded → Λ.unbounded_approved := ⊤
           check(U, K, R, P, oos) → InvariantStatus                    -- coverage_complete ∧ span_fit ∧ termination_covered ∧ obligations_derived ∧ oos_substrate_named (track)
           Qc(U, K, R, P, InvariantStatus, oos) → Stop → V (constitution) [Tool]
             V = Adjust(d) → rederive over the SAME U → (K, R, P) := (K', R', P') → [¬acceptance_present(P') → Qt] → re-present Qc   -- obligation_derived(u, K', R') holds for every u ∈ U
             V = Reopen(u) → residual := residual ∪ u.obligations; U := U \ {u} → cycle_n += 1 → Phase 1
             V = Confirm ∧ ¬hard_invariants_hold(Λ) → re-present Qc naming the violated invariant   -- a hard invariant is not waivable by confirming past it
             V = Confirm ∧ hard_invariants_hold(Λ) → AcceptResiduals(R) → Λ.accepted := Λ.accepted ∪ {ρ.obligation | ρ ∈ R}; ∀ρ∈R: ρ.disposition := AcceptUncovered (track) → Phase 3
Phase 3: (U, K, P) → Emit → E [Tool: TaskCreate] → converge(apportionment trace) (extension) → ConditionBearingUnitPlan

Phase 0 → Phase 1: goal_plan_uncompiled(G)                             -- an autonomous goal whose unit plan and conditions are uncompiled
Phase 0 → deactivate: ¬autonomous_intent(G) ∨ condition_bearing(G)     -- relay the scan result; no activation
Phase 1 → deactivate: residual = ∅ ∧ U = ∅ ∧ oos = ∅                   -- nothing could be read from the goal's scope; relays to /inquire rather than emitting an empty plan
Phase 1 → Phase 1: cycle_n += 1                                        -- next anchor; bounded by coverage (residual strictly shrinks on AcceptUnit/OverrideFit) and by user agency (Recut/Sufficient/Esc)
Phase 1 → Phase 2: residual = ∅ ∧ (U ≠ ∅ ∨ oos ≠ ∅)                    -- every obligation apportioned or visibly delegated, and something was actually read
Phase 2 → Phase 1: V = Reopen(u)                                       -- the derived conditions revealed a bad cut; that unit's obligations return to residual. User-driven, so bounded by user agency exactly as Adjust is
Phase 2 → Phase 2: V = Adjust(d)                                       -- rederive over the same apportionment; U unchanged
Phase 2 → Phase 2: V = Confirm ∧ ¬hard_invariants_hold(Λ)              -- Qc re-presents with the violated invariant named; no state advances
Phase 2 → deactivate: Vₜ = RouteBound                                  -- Rerouted; /bound → /apportion re-entry recompiles fresh
Phase 2 → Phase 3: V = Confirm ∧ hard_invariants_hold(Λ)               -- residuals accepted on record; every clause of apportioned(G) that Qc can violate holds AT THE TRANSITION, not merely in the equation
Phase 3 → converge: emitted(E) ∧ handoff_recorded                      -- ConditionBearingUnitPlan + apportionment trace
Phase 1 → deactivate (ungraceful): user_esc                            -- EarlyExit: no emission, no handoff recorded
Phase 2 → deactivate (ungraceful): user_esc                            -- EarlyExit: no emission, no handoff recorded

── LOOP ──
Two bounded loops, one per irreducible part.

Apportionment loop (Phase 1): one anchor per cycle; cycle_n visible at every Qu.
  AcceptUnit and OverrideFit strictly shrink residual (the accepted unit's obligations leave it), so the loop
  cannot cycle on coverage. Recut leaves residual unchanged by design — it re-frames the SAME anchor under a
  user direction — and is therefore bounded by user agency, as are Sufficient (which packs the remainder) and
  Esc. A single dominant unit that fits relays without a turn yield: no genuine alternative apportionment
  exists for that anchor, so presenting one would be a false choice.

Condition loop (Phase 2): Qt fires whenever the whole goal carries no acceptance criterion — at pass entry,
  and again after an Adjust that clears one, since Adjust replaces P wholesale and an acceptance the user
  already stated must not vanish into an emission. Qc's Adjust rederives over the SAME apportionment —
  K' ∪ R' still spans every obligation of every unit (obligation_derived, no removal; a withdrawn or weakened
  condition becomes a residual), so an obligation never leaves the derived set silently. Confirm does not
  waive a hard invariant: a coverage or fit violation re-presents Qc with the violation named rather than
  advancing to emission. Reopen is the one back-edge to Phase 1: it fires when the
  derived conditions expose a cut that cannot be conditioned, returns exactly that unit's obligations to
  residual, and re-enters the apportionment loop. Confirm or Esc terminates.

Stateless: Merismos terminates at emission. No state survives into the execution interval — no session
approvals, no per-action classification, no mid-execution checkpoint.

Convergence evidence (relay, at emission): present the apportionment trace —
  (a) Plan readback — the goal restated as its units in plain single-sentence form;
  (b) Per-unit: (obligations covered, seam quality with its citation or heuristic declaration, horizon fit or
      the recorded override) → the conjoined leaf predicate, with each conjunct's kind;
  (c) Plan-level conditions with the plan-state requirement that makes each safe to discharge;
  (d) Each accepted-uncovered residual with its obligation, and each out-of-scope obligation with its substrate;
  (e) When unbounded_approved: the recorded whole-goal acceptance waiver with its gate site.
Convergence is demonstrated, not asserted.

── CONVERGENCE ──
apportioned(G) = emitted(E) ∧ handoff_recorded
                 ∧ coverage_complete(U, G) ∧ span_fit(U)
                 ∧ (U ≠ ∅ ∨ oos ≠ ∅)                                                -- a goal with nothing read from it never claims apportionment occurred
                 ∧ (∀u∈U: unit_termination_covered(u, K, R))
                 ∧ (∀u∈U: obligation_derived(u, K, R))
                 ∧ (∀u∈U: |{e ∈ E : e is UnitEntry ∧ e.unit_ref = u.unit_ref}| = 1)   -- the join rule holds: one unit entry per unit, keyed on unit_ref — subject is not unique across units
                 ∧ (∀p∈P: ∃! e ∈ E : e is PlanEntry ∧ e.scope = p.scope ∧ e.kind = p.kind
                                     ∧ e.condition = p.condition ∧ e.dischargeable_when = p.dischargeable_when)
                 ∧ (∀p∈P: topology_free(p.dischargeable_when))
                 ∧ (acceptance_present(P) ∨ unbounded_approved)
                 ∧ (∀d∈oos: d.substrate ≠ "")
-- Rerouted (Qt RouteBound) is a deliberate non-emission exit and EarlyExit a user abort — neither claims
-- ConditionBearingUnitPlan (see TYPES): the emitted result is well-formed exactly when apportioned(G) holds.
-- The guarantee is compile-time and pre-conduct: every goal obligation is apportioned to a unit that fits one
-- horizon (or carries a recorded override), each unit's done is a determinate predicate (or a recorded
-- acceptance), each cut declares whether its seam is evidenced or heuristic, whole-goal acceptance is a
-- decision on record rather than a default, and every pre-action risk is visibly delegated, and every plan
-- condition's firing criterion is a topology-free property of plan state, never an order fact. Order,
-- independence, reconciliation, termination topology and routing are NOT claimed — they remain /conduct's.

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Probe        (sense)        → Internal analysis (autonomous intent + uncompiled-plan detection over the goal; cue cited)
Phase 0 relay        (extension)    → TextPresent+Proceed (no autonomous interval in scope, or the plan already carries units and conditions: surface the scan result; deactivate without activating)
Phase 1 VelocityFilter (sense)      → Internal analysis (obligations guardable only by pre-action interception; computed once at Phase 1 entry directly from G — before residual is seeded — so an out-of-scope obligation never enters the packing loop; empty scope with no obligation and no delegation relays to /inquire rather than proceeding)
Phase 1 Scan         (observe)      → Read, Grep (optional seam evidence gathering over the goal's cited substrate; read-only)
Phase 1 Pack         (sense)        → Internal analysis (apportionment search: units fitting one horizon, coverage over obligations)
Phase 1 fit          (sense)        → Internal analysis (per-unit horizon-fit verdict; Indeterminate surfaced, never read as Fits)
Phase 1 qualify      (sense)        → Internal analysis (seam quality: Grounded with citation, or Heuristic declared)
Phase 1 relay        (extension)    → TextPresent+Proceed (SingleDominantUnit with a fitting horizon: accept the unit without a turn yield — no genuine alternative apportionment exists for this anchor)
Phase 1 autonomous_pack (track)     → Internal state update (extension — pack the remainder at Heuristic seams when seam evidence is exhausted or the user declares the apportionment sufficient; each packed unit re-checks fit and is surfaced as relay with its heuristic declaration; a packed unit whose fit is not Fits does NOT enter U — it re-enters as the next cycle's anchor for Qu, where the override is the user's to record; a still-non-empty residual likewise re-anchors)
Phase 1 Qu           (constitution) → present (the anchor's proposed unit + horizon-fit verdict + seam quality with its basis + current cut-set + cycle counter; the accept option is fit-complementary — AcceptUnit when the span fits, OverrideFit when it does not; Esc → EarlyExit) [Tool]
Phase 1 integrate    (track)        → Internal state update (the accepted unit enters the apportionment and its obligations leave the residual; a fresh UnitRef is assigned to the unit, stable for the remainder of the apportionment; OverrideFit additionally records the unit in Λ.fit_overrides)
Phase 2 Derive       (sense)        → Internal analysis (per-unit completion and invariant predicates; an obligation with no verifiable predicate becomes a residual)
Phase 2 DerivePlan   (sense)        → Internal analysis (conditions whose subject is the whole goal; never distributed across units)
Phase 2 OOS          (extension)    → TextPresent+Proceed (out-of-scope declaration per obligation, with the delegated substrate named)
Phase 2 Qt           (constitution) → present (conditional: the whole goal has no acceptance criterion — define it now / route its definition to /bound / proceed unbounded on record; fires at pass entry and again after any Adjust that clears acceptance, always before Qc re-presents) [Tool]
Phase 2 ApproveUnbounded (track)    → Internal state update (record Λ.unbounded_approved, materializing the informed acceptance for the convergence predicate)
Phase 2 check        (track)        → Internal state update (invariant status: coverage, horizon fit, termination coverage, obligation derivation, and oos substrate-naming over the current apportionment)
Phase 2 Qc           (constitution) → present (apportionment + derived conditions + residual dispositions + invariant status: Confirm / Adjust / Reopen) [Tool]
Phase 2 AcceptResiduals (track)     → Internal state update (on Confirm: record each remaining residual's obligation into Λ.accepted, materializing accepted_uncovered for the convergence predicate; also writes ρ.disposition := AcceptUncovered for each ρ ∈ R so the field reads correctly in the Phase 3 trace — the pre-Confirm guard does not depend on this write, see unit_termination_covered)
Phase 3 Emit         (track)        → TaskCreate (one goal entry per unit: unit_ref + subject + the conjoined leaf predicate; plan-level conditions as their own entries carrying scope + kind + condition + dischargeable_when; TodoWrite is the harness-equivalent realization) [Tool]
converge             (extension)    → TextPresent+Proceed (apportionment trace; handoff recorded; deactivate)
esc                  (extension)    → TextPresent+Proceed (no emission; deactivate as EarlyExit, not ConditionBearingUnitPlan)
seam                 (extension)    → TextPresent+Proceed (two seams, scoped separately. INBOUND activation seam (before this protocol activates): the `/bound → /apportion` and `/conduct → /apportion` legs of the `## Composition` chain relay when a user-declared chain names `/apportion` next, or an invocation follows that declared composition edge — proceed directly, citing the settling source; this seam fires at the upstream handoff, not after this protocol's emission. OUTBOUND emission seam (after this protocol emits): the `/apportion → enforcer` edge is EXCLUDED — Rule 8 (Separate activation) governs it, keeping the enforcer's start the user's own constitutive act; the `/apportion → /conduct` edge relays only under a user-declared chain naming /conduct next, never automatically, and carries the no-reentry guard of Rule 9. Every Constitution gate inside this protocol and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = { phase: Phase, G: AutonomousGoal, H: ExecutionHorizon, cycle_n: Nat,
      U: Set(Unit), residual: Set(Obligation),
      fit_overrides: Set(Unit),          -- written by OverrideFit; fit_override_recorded(u) ≡ u ∈ Λ.fit_overrides
      K: Set(CompiledCondition), R: Set(Residual), P: Set(PlanCondition), oos: Set(OOSDeclaration),
      accepted: Set(Obligation),         -- written by AcceptResiduals on Confirm; accepted_uncovered(o) ≡ o ∈ Λ.accepted
      unbounded_approved: Bool,          -- written by Qt on ApproveUnbounded
      invariant_status: InvariantStatus,
      U_history: List(Set(Unit)), A_history: List(UnitJudgment),
      active: Bool, cause_tag: String }
-- Coverage partition invariant: residual, (⋃ᵤ u.obligations) and {d.obligation | d ∈ oos} are pairwise
--   disjoint and together equal G.obligations at every cycle boundary — an obligation is always exactly one
--   of: still residual, apportioned to a unit, or visibly delegated out of scope. Holds from cycle 1: oos is
--   computed once at Phase 1 entry, before residual is seeded, so an out-of-scope obligation never transits
--   through a unit on its way into oos.
--   Λ.accepted is NOT a fourth cell: it is a MARKING over obligations that already sit in a unit, recording
--   that the unit carries no verifiable predicate for them. An accepted obligation is therefore in a unit AND
--   in Λ.accepted, by construction — ρ.unit is what ties them
-- Compile-time only: Λ exists from invocation to emission; nothing persists into the execution interval

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). registered dependency edges preserved. Dimension resolution emergent via session context.
Two-way advisory with /conduct, guarded against reentry: the /apportion → /conduct edge carries a multi-unit
plan into conduct's work prospect; the /conduct → /apportion edge hands an already-conducted method's
unresolved autonomous region back for apportionment. Neither is a precondition. The no-reentry guards (Rule 9)
make the pair non-recursive: a conducted plan's unit predicates become conduct's stated termination grounds and
do not route back here, and an already-conducted region's topology is fixed input that this protocol does not
re-conduct.
```

## Core Principle

**Apportion over Order**: When an autonomous goal is stated but its plan is uncompiled — you know *what* the goal is, but not *which units it runs in* nor *what each unit's done means* — the act is to cut the units and condition them, not to sequence them. Merismos searches for an apportionment whose every unit fits one execution horizon and whose units together cover every goal obligation, derives each unit's completion and invariant predicates, and separates the conditions whose subject is the whole goal. Sequencing those units — their order, independence, reconciliation, termination topology and routing — is `/conduct`'s work. The emitted plan is deliberately **pre-conduct**: it carries unit boundaries and conditions, and nothing that would make it a conducted method.

**Coverage over Convenience**: Every goal obligation belongs to some unit, is visibly delegated out of scope, or is accepted as uncovered on record. Without this, every emitted leaf can pass while an original obligation belongs to no unit at all — the plan converges locally and lies globally. Coverage is a hard invariant, not a quality target.

**Fit over Ambition**: Every unit fits one execution horizon, or carries an override the user recorded. Without this, a unit overflows the very interval that is supposed to enforce it, recreating the false-completion and context-compaction failures the unit boundary exists to prevent. An unjudgeable fit is surfaced as such; it is never quietly read as fitting.

**Declared Seam over Asserted Joint**: A cut cites the seam it sits on — a dependency edge, a deliverable boundary, a verification point, an ownership change — or declares itself heuristic. An abstract goal may carry no evidenced joint at all, and asserting one anyway would be false precision. Seam quality is therefore a declared disposition rather than an invariant: the plan is honest about which cuts are grounded and which are judgment calls, and the user judges the heuristic ones with that fact visible.

Priority ordering: coverage > fit > autonomy > transparency > noise-minimization > speed > simplicity.

## Substrate Boundary

Merismos operates within the epistemic substrate — its protocol scope covers obligation reading, apportionment search, horizon-fit and seam-quality judgment, condition derivation, and the compile-time gates. The Phase 1 and Phase 2 gates transmit user judgment into the apportionment and its conditions.

Everything past emission belongs to non-epistemic substrates. Enforcement of the emitted leaf predicates inside each execution interval is the downstream completion-predicate enforcer's contract; pre-action interception of the obligations declared out of scope (destructive command blocking, permission prompts, prompt-injection defense) is the harness permission system's contract; step-by-step approval, resumable state, and timeout/escalation belong to a workflow/HITL substrate. Concrete executor selection — which agent, model, runtime or tool token carries a unit — is likewise outside: units carry capability requirements and feasibility notes, never a binding. Merismos classifies and surfaces these boundary crossings, records the handoff, and stops — it neither discharges nor enforces external substrate semantics.

## Mode Activation

### Activation

User calls `/apportion` to declare autonomous execution intent for a goal whose unit plan and conditions are uncompiled. Merismos reads the goal's obligations, apportions them into units at seams it can cite, derives each unit's conditions, confirms the plan with the user, and emits it.

**Goal plan uncompiled** = an autonomous run is intended for a stated goal, but the goal is not yet carried by units each bearing a determinate completion condition — the run would decide for itself both what its pieces are and what "done" means for each.

Gate predicate:
```
goal_plan_uncompiled(G) ≡ autonomous_intent(G) ∧ ¬condition_bearing(G)
  autonomous_intent(G)  ≡ an autonomous or long-running execution interval is intended for G (cue cited from context)
  condition_bearing(G)  ≡ G already carries units whose completion conditions are determinate predicates —
                          a prior /apportion plan covering this goal, or an explicit unit-and-condition set the
                          user supplied. A goal with units but no conditions, or conditions but no units, is
                          uncompiled: both halves are this protocol's product
```

**Activation layer**:
- **Layer 1 (User-invocable)**: `/apportion` slash command or description-matching input. Always available.
- **Layer 2**: Not applicable (user-initiated — no AI-guided activation heuristics). The deficit exists only once an autonomous execution intention is in scope; a generic observation that some work could be partitioned is not this deficit, and many such cases warrant no autonomous plan at all.

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
| Autonomous interval intended, no unit plan | The user is about to hand a goal to an autonomous or long-running run, and the goal is not yet carried by units each bearing a completion condition |
| Goal exceeds one interval | The stated goal plainly exceeds one execution horizon, so it must run as several intervals and how to cut them is unsettled |
| Units without conditions | A unit list exists (a plan, an issue set, a conducted method's autonomous region) but no unit carries a determinate done-predicate |
| Conditions without units | Done-criteria exist for the goal as a whole, but nothing says which interval owns which |
| "What should each run finish?" | The user asks what the pieces are and when each is done — not what order they go in, which is `/conduct` |

**Skip**:
- No autonomous intent — the request is for an ordinary explanatory plan, not execution preparation
- The goal already carries units whose completion conditions are determinate predicates (a prior `/apportion` plan covers this goal and the goal is unchanged)
- One self-evident leaf: the goal fits one execution horizon as a single unit and its done-criterion is already determinate
- The user asks for ordering, independence, reconciliation or routing → `/conduct` (the units already exist)
- The goal's own scope is too thin to read obligations from → `/inquire` (gather the missing pre-plan fact first)

### Cross-Session Enrichment

Repeated apportionment patterns and recurring failure modes accumulated in Anamnesis's hypomnesis store (prior-session recall indices), and any context surfaced when `/recollect` has been invoked this session, enrich Phase 1 seam scanning and Phase 2 condition derivation — past overflows and past false completions specific to this user and codebase bias which seams are proposed and which predicates are derived. This is a heuristic input; constitutive judgment remains with the user at the gates.

**Revision threshold**: When Emergent plan-condition scopes across 3+ sessions cluster around a recognizable pattern outside the named scopes, the plan-scope set warrants a new named member. Named scopes are working hypotheses, not exhaustive categories.

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| User Esc key | Deactivate for the remainder of the session (EarlyExit — no emission, no handoff recorded) |
| No autonomous intent, or already condition-bearing | Relay the scan result and deactivate without activating |
| Route-to-`/bound` at the whole-goal acceptance gate | Deliberate reroute (no emission): the acceptance boundary goes to `/bound`; a later `/apportion` invocation recompiles fresh |
| Plan emitted | Terminal: apportionment trace presented, handoff recorded, deactivate |

## Protocol

### Phase 0: Uncompiled-Plan Checkpoint

Read the goal for autonomous intent and for whether it is already condition-bearing. Detection is silent on the uncompiled path; on either relay path, surface the scan result and deactivate without activating.

Scan, in priority order: prior protocol output in this session (a boundary map, or a conducted method's unresolved autonomous region, is the richest input), `/apportion` arguments, then conversation context. Cite the cue for autonomous intent — it is a heuristic read, and a goal the context never cues as autonomous does not activate this protocol.

### Phase 1: Apportionment

Read the goal's obligations, then loop: each cycle proposes one unit for the highest-leverage unapportioned region.

1. **Scan for seams** over the current residual. A seam is a place the goal's own structure already divides: a dependency edge, a deliverable boundary, a verification point, an ownership change. Read-only; cite where each seam was observed.
2. **Pack** the residual against the execution horizon into a proposed unit, and judge its fit — fits, overflows, or indeterminate. An unjudgeable fit is surfaced as indeterminate at the gate; it is never quietly recorded as fitting.
3. **Qualify the cut**. When the proposed unit sits on a seam found in step 1, the cut is grounded and carries that citation. When the goal supplies no such evidence, the cut is heuristic — declared, not dressed up as a natural joint. An abstract goal frequently has no evidenced joints, and that is a fact about the goal, not a defect in the cut.
4. **Present** the proposed unit with its fit verdict, its seam quality and basis, the current cut-set, and the cycle counter, via Cognitive Partnership Move (Constitution) — unless a single dominant unit fits, in which case accept it as relay: no genuine alternative apportionment exists for that anchor, so presenting one would be a false choice.

The accept option is fit-complementary: on a unit that fits, the user simply accepts it; on one that overflows or cannot be judged, the only way in is an override recorded on that unit. The user may instead direct a recut of the same region or declare the apportionment sufficient. On sufficiency — or when seam evidence runs out — the remaining obligations are packed at heuristic seams and surfaced as relay, with each packed unit's fit re-checked and its heuristic quality declared; a packed unit that does not fit is not slipped in, it comes back as the next proposal so the override stays the user's to record.

The loop ends when every obligation is apportioned to a unit or visibly delegated out of scope.

### Phase 2: Condition Derivation and Confirmation

For each unit, derive its conditions; for the goal as a whole, derive the conditions no single unit owns.

- **Per-unit** — a completion predicate (the unit achieved its result) and any invariant predicates (the run preserved a boundary while achieving it). Both kinds are verifiable predicates: executable checks with determinate pass/fail outcomes. A condition expressible only as prose judgment ("the code is clean enough") is not derivable — surface it as a residual for the user to sharpen into a predicate or accept as uncovered. A unit with no completion predicate is not an executable interval; it closes as a predicate or as a recorded acceptance, never silently.
- **Plan-level** — conditions whose subject is the whole goal rather than any one unit: final integration, global non-regression, whole-goal acceptance. These stay plan-level and carry a plan-state requirement — a self-contained property of when the condition becomes safe to discharge, never a named unit or order-position: naming an order fact belongs to `/conduct`, not this protocol. Do not distribute a global condition across every unit to make it fit the leaf type — that multiplies false failures and hides which unit actually owns the obligation.
- **Out of scope** — an obligation whose violation must be caught *before* an action executes cannot be a stop-time predicate: a completion check evaluates after the harm. Declare it out of scope as relay text with the delegated substrate named. Deriving it into a leaf would simulate protection while providing none.

**Whole-goal acceptance check** (before the confirmation gate): per-unit completion predicates make each interval determinate, but they do not say when the *goal* is accepted. When no plan-level acceptance condition exists, present the gap and its consequence, then **present** via Cognitive Partnership Move (Constitution). This fires on entering the confirmation step, and again if an adjustment clears an acceptance criterion the user had already stated — adjusting the conditions replaces the plan-level set wholesale, and an acceptance must not disappear into an emission:

```
The units each know when they're done. The goal doesn't yet. How should it get an acceptance criterion?

Options:
1. **Define it now** — state what makes the whole goal accepted; it enters the plan conditions
2. **Define it with /bound first** — hand the acceptance question to the boundary-definition step; this pass ends and a later /apportion recompiles with its output
3. **Proceed without one, on record** — the units run to their own conditions and nothing checks the whole; the acceptance is recorded and visible in the trace
```

Then present the apportionment together with its conditions as pre-gate text — per unit: obligations covered, seam quality and citation, fit verdict, each derived predicate with its kind; per plan condition: scope, kind, and the plan-state requirement that makes it safe to discharge; each residual with its uncovered-obligation note; each out-of-scope obligation with its substrate; and the invariant status for coverage and fit — then **present** via Cognitive Partnership Move (Constitution):

```
Unit plan ready. How should it land?

Options:
1. **Confirm** — emit one goal entry per unit, that unit's conditions conjoined; any remaining residuals are accepted as uncovered (unguarded during the interval, recorded in the trace). If coverage or fit is still violated, this returns here with the violation named rather than emitting
2. **Adjust** — change the conditions over the same units: [prompt for direction]
3. **Reopen a unit** — the conditions exposed a bad cut; return that unit's obligations to the apportionment loop: [prompt for which unit]
```

Adjust rederives over the same apportionment and re-presents. Reopen returns exactly that unit's obligations to the residual and re-enters Phase 1. Both are bounded by user agency: Confirm or Esc terminates.

### Phase 3: Emission and Handoff

On Confirm:

1. **Emit** one goal entry per unit via TaskCreate — the unit's identity and subject, and its conditions conjoined into a single leaf predicate carried as the entry's verifiable completion criterion. One unit is one execution interval is one entry; plan-level conditions are emitted as their own entries carrying the plan-state requirement under which each becomes safe to discharge.
2. **Present the apportionment trace**: the plan readback, then per unit its covered obligations, seam quality, fit verdict and leaf predicate with each conjunct's kind; the plan-level conditions; each accepted-uncovered residual; each out-of-scope obligation with its substrate; and any recorded acceptance waiver.
3. **Record the handoff** and deactivate.

Emission is Merismos's epistemic endpoint. Merismos does not invoke the downstream enforcer, and it does not order the units — the user activates the enforcer separately, and `/conduct` arranges the units if their arrangement is non-trivial. Nothing of Merismos survives into the execution interval.

## Composition

Merismos is the apportion-and-condition step ahead of an autonomous run. The composition, in prose with standard notation:

- **Two-way with `/conduct`, guarded**: a multi-unit plan flows from `/apportion` into `/conduct` as its work prospect when the units' order, independence, reconciliation, termination topology or routing is non-trivial. In the other direction, a `/conduct` activation that reaches an unresolved autonomous region hands that region to `/apportion` for apportionment and conditioning. Both edges are advisory, never preconditions, and both carry a no-reentry guard: when `/conduct` consumes a condition-bearing unit plan, the unit predicates become its stated termination grounds and it does not route back here; when `/apportion` receives an already-conducted region, that region's topology is fixed input and this protocol does not re-conduct it. A single unit, or a unit set whose order is trivial, bypasses `/conduct` entirely.
- **`/bound` upstream**: a boundary map narrows both halves — which seams are candidate cuts, and which conditions the units are subject to. Advisory: absence narrows the read, it does not block apportionment.
- **The enforcer is a leaf executor**: on Claude Code (verified against v2.1.140; bounded claim — re-verify on harness version change), `/goal` installs a session-scoped stop-hook that re-prompts the model until its condition is met. It enforces a completion predicate *inside* one bounded interval; it exposes no external step injection and no mid-loop gating. This is exactly why one unit maps to one entry with one conjoined predicate: the enforcer consumes a leaf, not a workflow. Driving it as a progressive workflow engine fails structurally — that role belongs to `/conduct` and, for step-approval/resume/timeout semantics, to a workflow/HITL substrate outside this protocol suite.
- **Guard role**: the apportionment defends the enforcer's characteristic failure modes — a goal too large for one interval silently truncating, which unit fit prevents; an obligation nobody owns passing unnoticed, which coverage prevents; early or false termination, which the per-unit completion predicate makes determinate; and boundary erosion across a long interval, which the invariant predicates make detectable at stop time. When the goal carries no whole-goal acceptance criterion, the acceptance check makes that absence a recorded decision rather than a silent default.
- **Separate activation**: emitting the plan is `/apportion`'s epistemic endpoint. The user invokes the enforcer separately — automatic coupling to a harness built-in is avoided by design, so the constitutive act of starting the autonomous interval stays with the user.
- **Executor binding is outside**: units carry capability requirements and feasibility notes, never a concrete executor, model, runtime or tool token. Which substrate realizes a unit is bound at the consuming runtime's seam, not inside the plan.
- **After the interval**: `/contextualize` checks post-execution applicability and `/grasp` verifies understanding of the result, both downstream of the enforced run.

## Known Limitations

**Bounded platform claim**: The leaf-executor characterization of `/goal` (stop-hook predicate enforcer, no external step injection) is verified against Claude Code v2.1.140 only. A harness version change requires re-verification before relying on the composition guidance above.

**Obligation reading is heuristic**: The goal's obligations are read from its utterance, prior protocol output, and session context. An obligation the user holds but never uttered, and that no upstream protocol captured, will not be read — and therefore will not be covered, even though coverage is a hard invariant over what *was* read. The Phase 2 gate is the correction point: the apportionment is presented with its covered obligations precisely so a missing one becomes visible.

**Seam evidence is often absent**: An abstract goal frequently supplies no dependency, deliverable, verification or ownership seam. Those cuts are declared heuristic rather than certified, and the resulting units may carry duplicated setup, cross-unit state leakage, or awkward predicates. The declaration makes the risk visible; it does not remove it.

**Horizon fit is an estimate**: Whether a unit's work completes within one execution horizon is judged before the run, from the goal's description. An unjudgeable fit is surfaced rather than guessed, but a fitting verdict can still be wrong — the override path exists because the user often knows better than the estimate.

**Predicate coverage**: Subjective quality bars and moving targets do not derive into verifiable predicates. Merismos surfaces them as residuals rather than emitting prose conditions; an uncovered residual the user accepts remains genuinely unguarded during the interval.

**No execution-time protection**: Merismos is compile-time only. A risk that emerges mid-interval — one not present in the goal's obligations at compile time — is outside the emitted conditions; pre-action risks are entirely the harness substrate's responsibility.

## Rules

1. **User-initiated, AI-apportioned**: User declares autonomous execution intent via `/apportion`; AI reads the obligations, searches the apportionment, and derives the conditions; the user settles each unit at Phase 1 and the conditioned plan at Phase 2 via Cognitive Partnership Move (Constitution).
2. **Apportion, do not order**: Merismos cuts the units and conditions them. Order, independence, reconciliation, termination topology and routing are `/conduct`'s; an emitted plan that carries them has absorbed `/conduct` and violates this protocol's identity. The emitted artifact is pre-conduct by construction.
3. **Coverage is a hard invariant**: Every obligation read from the goal belongs to some unit, is visibly declared out of scope, or is accepted as uncovered on record. A plan that leaves an obligation silently unowned is not emitted — the gap is surfaced at the confirmation gate for the user to close by recutting, by accepting it as an uncovered residual, or by delegating it out of scope. A goal from which nothing could be read at all (no unit, no delegation) does not emit an empty plan — it relays to `/inquire` instead, matching the Skip condition for a goal whose scope is too thin to read obligations from.
4. **Fit is a hard invariant with an override path**: Every unit fits one execution horizon, or carries an override the user recorded on that unit. An unjudgeable fit surfaces as indeterminate at the gate; it is never quietly read as fitting, and an overflowing unit is never committed without the recorded override. The gate enforces this by offering the accept options fit-complementarily — plain acceptance only on a fitting unit, the recorded override as the only way an unfitting one enters — and neither the autonomous packing pass nor a confirmation may carry an unfitting unit past it.
5. **Seam quality is declared, not asserted**: Each cut cites the dependency, deliverable, verification or ownership seam it sits on, or declares itself heuristic. Seam quality is a disposition rather than an invariant — an abstract goal may carry no evidenced joint, and claiming one anyway would be false precision.
6. **The join rule — one unit, one interval, one conjoined leaf**: A unit's completion and invariant predicates are conjoined into a single leaf predicate and emitted as one entry. Per-condition entries duplicate the unit's execution identity; a cartesian product does the same more explicitly. Predicate kind is retained on each conjunct so provenance stays readable even though enforcement conjoins them.
7. **Plan conditions stay plan-level**: A condition whose subject is the whole goal carries a plan-state requirement — a topology-free property of when it becomes safe to discharge, never a named unit or order-position, which is `/conduct`'s axis to resolve. It is never distributed across every unit to fit the leaf type — that multiplies false failures and hides which unit owns the obligation.
8. **Separate activation**: Emitting the plan is the epistemic endpoint. Merismos does not invoke the downstream enforcer; starting the autonomous interval is the user's separate constitutive act.
9. **No-reentry across the `/conduct` seam**: Both directions of the `/conduct` edge are advisory and guarded. A condition-bearing unit plan consumed by `/conduct` supplies stated termination grounds and does not route back to `/apportion`; an already-conducted autonomous region consumed by `/apportion` has fixed topology and is not re-conducted. A single unit or a trivially ordered unit set bypasses `/conduct`. Neither edge is a precondition, so neither activation depends on the other having run.
10. **Verifiable predicate required**: Every emitted condition is an executable check with a determinate pass/fail outcome. A condition expressible only as prose judgment is surfaced as a residual — sharpened into a predicate or accepted as uncovered — and is never emitted as prose.
11. **Stop-time only**: Only conditions evaluable when an interval stops are derived. An obligation requiring pre-action interception is declared out of scope with its delegated substrate named; deriving it into a stop-time leaf simulates protection while providing none.
12. **Stateless compile**: Emission is terminal. No session approvals, no per-action classification, no mid-execution checkpoint; re-invocation recompiles from current context rather than resuming prior state.
13. **Transparency-grounded**: Every obligation cites its evidence; every seam quality, fit verdict, residual disposition, override and out-of-scope delegation is visible in pre-gate text or the apportionment trace — surfaced and relay paths satisfy the same transparency invariant.
14. **Recognition over Recall**: Present structured options with differential implications via Cognitive Partnership Move (Constitution); Constitution interactions yield turn before proceeding.
15. **Context-Question Separation**: All analysis, evidence, and rationale appear as text output preceding the Constitution interaction; the question contains only the essential choice and option-specific differential implications.
16. **Convergence evidence**: Present the apportionment trace before deactivating — the plan readback plus per-unit evidence (obligations covered, seam quality with its citation or heuristic declaration, fit verdict or recorded override, leaf predicate with conjunct kinds), the plan-level conditions, each accepted-uncovered residual, and each out-of-scope delegation — required, not asserted.
17. **Option-set relay test (Extension classification)**: When AI analysis converges to a single dominant option (option-level entropy → 0), present the finding directly as Extension — a single dominant unit that fits its horizon is accepted as relay rather than wrapped in a false choice. Each Constitution option must be genuinely viable under different user value weightings; options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options.
18. **Gate integrity** (Safeguard tier): The defined option set is presented intact — option injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option into a concrete unit or condition while preserving the coproduct structure) is distinct from mutation.
19. **Substrate boundary**: Merismos scope is the epistemic substrate — obligation reading, apportionment search, fit and seam judgment, condition derivation, compile-time confirmation. Enforcement inside each interval, pre-action interception, workflow/HITL semantics, and concrete executor binding belong to native harnesses or specialized substrates, delegated by handoff at emission.
20. **Plain emit discipline**: User-facing emit (unit proposals, gate options, apportionment traces, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the unit, the condition, or the question in their idiom.
21. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background and distant context to pre-gate text or the apportionment trace.
22. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract, since each block is the type that constitutes the protocol — preserving the blocks keeps the protocol intact. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).
23. **Seam relay on declared continuation, enforcer edge excepted**: this protocol's seam splits into two, each scoped to its own lifecycle point. INBOUND activation seam (before this protocol activates): when a user-declared chain names `/apportion` next, or an invocation follows the `## Composition` chain's declared `/bound → /apportion` or `/conduct → /apportion` edge, the transition into `/apportion` is relay (Extension) — proceed directly, citing the settling source; this seam fires at the upstream handoff, before `/apportion` activates. OUTBOUND emission seam (after this protocol emits): the `/apportion → enforcer` edge is EXCLUDED — Rule 8 (Separate activation) governs it more specifically, since starting the autonomous interval is the user's separate constitutive act, deliberately kept outside automatic coupling; the `/apportion → /conduct` edge relays only under a user-declared chain naming `/conduct` next, and carries Rule 9's no-reentry guard. Both seams govern only the transition BETWEEN protocols; every Constitution gate inside this protocol and the next fires unchanged, and the user can redirect at any turn.
24. **Whole-goal acceptance before an unaccepted plan**: A plan whose conditions carry no whole-goal acceptance criterion fires one conditional confirmation before the confirmation gate — define it now, route its definition to `/bound`, or proceed without one on record. The approval is recorded state, never an inference. Per-unit completion predicates do not satisfy this: they make each interval determinate without saying when the goal itself is accepted. A plan that already carries an acceptance condition adds zero gate load — the confirmation exists precisely where a goal would otherwise finish with nothing checking the whole.
