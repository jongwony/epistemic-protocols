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
  ¬autonomous_intent(G):  → relay(no autonomous interval in scope) (extension) → deactivate   -- an ordinary explanatory plan is not this deficit
  condition_bearing(G):   → relay(units and conditions already present) (extension) → deactivate
  uncompiled: ReadObligations(G) → O_G → VelocityFilter(O_G) → oos → init_loop_state: cycle_n=1, U=∅, residual=O_G \ {d.obligation | d∈oos}, K=∅, R=∅, P=∅,
                              plan_conditions_derived=⊥, plan_conditions_stale=⊥, fit_overrides=∅, invariant_status=⊥, accepted=∅, unbounded_approved=⊥, U_history=[], A_history=[], loop:   -- init_loop_state runs EXACTLY ONCE, on this Phase 0 → Phase 1 edge; O_G, oos and residual are seeded here and nowhere else — Phase 2's Reopen re-enters "loop:" directly without ever re-executing this line, so a partial apportionment's residual is never overwritten by a fresh O_G \ oos reseed (D3); fit_overrides seeded ∅ so OverrideFit's first Λ.fit_overrides ∪= write, and span_fit's first fit_override_recorded read, never touch an uninitialized set (closes F2). ReadObligations produces a LOCAL obligation set: when owed_unit(G), it unions the owed entry's obligations into O_G BEFORE VelocityFilter and residual seeding, without mutating G. The returned obligations therefore enter the SAME screening and seed assignment as every other obligation while MORPHISM's preserves: G remains true
    Phase 1 Scan(G, residual, cycle_n) [per-cycle re-scan] → seams(residual) → Pack(seams, horizon) → (Anchor[cycle_n], proposed_unit, SpanFit, Seam) →
      Anchor empty ∧ residual = ∅ ∧ U = ∅ ∧ oos = ∅:  → relay(goal's scope too thin to read any obligation — route to /inquire) (extension) → deactivate  -- nothing was ever apportioned; emitting an empty plan would misreport that apportionment occurred
      Anchor empty ∧ residual = ∅ ∧ (U ≠ ∅ ∨ oos ≠ ∅):  → Phase 2                -- every obligation apportioned or visibly delegated, and something was actually read
      Anchor empty ∧ residual ≠ ∅:  → autonomous_pack(residual) (track) → [any packed unit with SpanFit ≠ Fits, or residual ≠ ∅ after packing: it re-enters as the next cycle's Anchor (reason surfaced as relay) → cycle_n += 1, loop] | (U'' Fits-worthy) → ∀u∈U'': integrate_unit(u) → u' → U := U ∪ {u'}, residual := ∅ → surface (extension) → Phase 2  -- seam evidence exhausted; AI packs the remainder at Heuristic seams, surfaced as relay; a packed unit never enters U on an unfitting span; every Fits-worthy packed unit is routed through integrate_unit — the SAME operation Qu's AcceptUnit uses — so it receives a fresh UnitRef before entering U, never entering unrefed
      SingleDominantUnit(Anchor, proposed_unit) ∧ SpanFit = Fits: → relay(AcceptUnit) (extension) → integrate_unit → cycle_n += 1, loop  -- no genuine alternative apportionment exists for this Anchor
      else:                         → Qu(Anchor[cycle_n], proposed_unit, SpanFit, Seam, U_snapshot, cycle_n) → Stop → Aᵤ →
        Esc:                → ungraceful deactivate (EarlyExit — no emission, no handoff recorded)
        Aᵤ = AcceptUnit     → integrate_unit(proposed_unit) → cycle_n += 1, loop                -- offered iff SpanFit = Fits; assigns the accepted unit a fresh UnitRef
        Aᵤ = Recut(d)       → re-derive the Anchor frame under d → cycle_n += 1, loop           -- same residual, different cut
        Aᵤ = OverrideFit    → integrate_unit(proposed_unit) → u' → Λ.fit_overrides ∪= {u'.unit_ref} → cycle_n += 1, loop  -- offered iff SpanFit ≠ Fits: integrate_unit assigns proposed_unit's fresh UnitRef FIRST, producing u'; fit_overrides then records THAT ref, so the recorded identity and the integrated identity are the same unit
        Aᵤ = Sufficient     → autonomous_pack(residual) (track) → [any packed unit with SpanFit ≠ Fits, or residual ≠ ∅ after packing: next cycle's Anchor → cycle_n += 1, loop] | (U'' Fits-worthy) → ∀u∈U'': integrate_unit(u) → u' → U := U ∪ {u'}, residual := ∅ → surface (extension) → Phase 2  -- same integrate_unit routing as the seam-exhausted branch: no packed unit enters U without a fresh UnitRef
    Phase 2 ∀u∈U, ¬derived_already(u,K,R): Derive(u) → (Set(κ), Set(ρ)) → K:=K∪κs, R:=R∪ρs ∥ [¬Λ.plan_conditions_derived: DerivePlan(G, U) → P; Λ.plan_conditions_derived := ⊤] →   -- scoped to units and plan conditions not yet derived this apportionment: a Reopen-driven re-entry does not silently re-derive over a unit's or P's existing (possibly Adjust-shaped) content (D4)
      oos ≠ ∅ → OOS(oos) (extension)                                            -- obligations needing pre-action interception: out of scope, substrate named; oos was computed once at the Phase 0 → Phase 1 edge, not re-computed here
      ¬acceptance_present(P) → Qt(K, P) → Stop → Vₜ →                            -- the whole goal has no acceptance criterion yet
        Vₜ = DefineNow(d)     → P := P ∪ {plan_condition(d)}; [Λ.unbounded_approved: Λ.unbounded_approved := ⊥]   -- acceptance_present(P) now holds by construction; retracts a stale unbounded waiver left by an EARLIER Qt firing's ApproveUnbounded — reachable via ApproveUnbounded → Reopen → (Qt refires, since ApproveUnbounded never touched P) → this DefineNow — mirroring Adjust's own retraction below (R5/D5)
        Vₜ = RouteBound       → deactivate                                       -- Rerouted: the acceptance boundary goes to /bound; a later /apportion recompiles fresh
        Vₜ = ApproveUnbounded → Λ.unbounded_approved := ⊤                        -- recorded acceptance, visible in the trace
      BindPlanRequirements(P, U) → P := Pᵦ → check(U, K, R, Pᵦ, oos) → InvariantStatus   -- scope-owned discharge requirements are normalized against the current unit cardinality BEFORE the check; coverage_complete ∧ span_fit ∧ termination_covered ∧ obligations_derived ∧ oos_substrate_named ∧ plan_conditions_topology_free
      Λ.plan_conditions_stale → StaleNotice(P) (extension)                       -- surfaced as pre-gate text before Qc when a Reopen changed U since P's whole-goal conditions were last derived or adjusted (R4): review for staleness, Adjust to update or Confirm to keep as recorded — never silently re-derived and never silently stranded
      Qc(U, K, R, P, InvariantStatus, oos) → Stop → V →
        V = Adjust(d)  → rederive(K, R, P, d) → (K, R, P) := (K', R', P') → Λ.plan_conditions_stale := ⊥ → [¬acceptance_present(P') → Qt(K', P') → Stop → Vₜ → P' updated as at Phase 2 entry] → [acceptance_present(P') ∧ Λ.unbounded_approved: Λ.unbounded_approved := ⊥] → BindPlanRequirements(P', U) → P' := Pᵦ' → check(U, K', R', Pᵦ', oos) → InvariantStatus → Qc(...)   -- over the SAME U: K' ∪ R' spans every obligation of every unit (no removal; a withdrawn condition becomes a residual); an Adjust that clears whole-goal acceptance re-fires Qt before re-presenting; an Adjust that INTRODUCES whole-goal acceptance while Λ.unbounded_approved still reads ⊤ retracts that stale waiver instead of emitting both (D5); BindPlanRequirements then normalizes the adjusted/Qt-updated P against this U BEFORE check, and check is RE-RUN against that exact state, so Qc's hard_invariants_hold guard never reads either a pre-Adjust InvariantStatus or a pre-normalization PlanCondition; Adjust is the user's engagement point with P, so it clears the staleness notice (R4) regardless of which axis the direction d touched
        V = Reopen(u)  → residual := residual ∪ u.obligations; U := U \ {u}; K := K \ {κ∈K:κ.unit=u}; R := R \ {ρ∈R:ρ.unit=Some(u)}; Λ.fit_overrides := Λ.fit_overrides \ {u.unit_ref}; Λ.plan_conditions_stale := ⊤ → cycle_n += 1 → Phase 1   -- the conditions revealed a bad cut; that unit's obligations return to residual and its derived K/R entries leave with it, so a later repack does not collide with stale derivations (D4) — residual is NOT reseeded from obligations(G) \ oos (D3), it carries forward every other unit's obligations untouched; u's fit-override record leaves with it too, mirroring K/R — a fresh repack gets a fresh UnitRef and, if it again overflows, needs its own OverrideFit recorded anew; plan-level P is intentionally NOT re-derived here (Rule 25: a user's Adjust-shaped P survives a Reopen detour) but the unit set it was derived against just changed, so Λ.plan_conditions_stale marks that for surfacing rather than leaving it silently possibly-stale (R4)
        V = Confirm ∧ ¬hard_invariants_hold(Λ): → re-present Qc with the violated invariant named   -- a hard invariant is never waived by confirming past it
        V = Confirm ∧ hard_invariants_hold(Λ):  → AcceptResiduals(R) → Λ.accepted := Λ.accepted ∪ {ρ.obligation | ρ∈R}; ∀ρ∈R: ρ.disposition := AcceptUncovered → Phase 3   -- P is read-only on this edge: BindPlanRequirements already normalized every scope-owned requirement before the check hard_invariants_hold reads. AcceptResiduals supplies the non-empty accepted-completion witness resolve_unit's AcceptedUncoveredResolution constructor reads at Phase 3; it does not perform a post-check rewrite
    Phase 3 Emit(U, K, P) → E [TaskCreate] → package(E) → record_handoff(E) → N → converge(apportionment trace) → ConditionBearingUnitPlan

── MORPHISM ──
AutonomousGoal × ExecutionHorizon
  → probe(goal)                        -- detect a stated autonomous goal whose unit plan and conditions are uncompiled
  → scan(seams)                        -- read the goal's obligations for cuttable seams: dependency, deliverable, verification, ownership
  → read_obligations(goal) → O_G       -- construct the invocation-local obligation set, including an owed /conduct unit when present; G itself remains read-only
  → filter(velocity) → oos             -- an obligation guardable only by pre-action interception is declared out of scope with the delegated substrate recorded on the declaration; computed once over O_G before packing begins, so it never enters a unit
  → pack(seams, horizon) → ProposedUnit -- THE IRREDUCIBLE CORE, part one: apportion the obligations into coarse units such that each unit fits one execution horizon and every obligation lands in some unit; produces a ProposedUnit — no unit_ref yet, see ProposedUnit; also reads each unit's capability requirements and feasibility notes from the goal's stated needs — functional descriptions only, never a concrete executor/model/runtime/tool token (Substrate Boundary)
  → fit(unit, horizon) → SpanFit       -- per-unit horizon-fit predicate; Indeterminate is surfaced, never silently read as Fits
  → qualify(cut) → Seam                -- Grounded when a dependency / deliverable / verification / ownership seam is cited; Heuristic when the goal carries no such evidence — declared, not asserted as a natural joint
  → [SingleDominantUnit(Anchor, proposed_unit) ∧ SpanFit = Fits: relay(AcceptUnit) (extension) | else: present(anchor, proposed_unit, SpanFit, Seam) (constitution)]
  → integrate(unit_judgment, U, residual) → (U', residual')   -- monotone in coverage: an obligation leaves residual only when it enters some unit; integrate_unit(ProposedUnit) → Unit is the only constructor Unit has, and assigns the accepted unit its fresh UnitRef in that same step
  → derive(unit) → (Set(κ), Set(ρ))    -- THE IRREDUCIBLE CORE, part two: per obligation of the unit, a verifiable predicate (completion or invariant) or a residual; every obligation of the unit lands in exactly one of the two sets
  → derive_plan(goal, U) → P           -- conditions whose subject is the whole goal, not any one unit; NOT distributed across units to fit the leaf type
  → confirm(unit_plan)                 -- user judges the apportionment together with its conditions
  → emit(goal_entries)                 -- one entry per unit; resolve_unit's single certificate — DeterminateResolution when a compiled COMPLETION condition exists, otherwise AcceptedUncoveredResolution with a non-empty accepted-completion witness and any compiled invariant conjuncts
  → package(E)                         -- constructs the whole returned plan from E's own coproduct partition, envelope included — a read-back of what was emitted, never a second derivation beside it
  → record_handoff(E) → N              -- emits the fixed-shape navigation block a later session dereferences to read E back; the locator leaves invocation-local state instead of dying with it
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
               -- invocation-local Set(Obligation), produced once at Phase 0 and used by VelocityFilter,
               --   residual seeding, and coverage_complete. It is an augmented READ of G, not a write into
               --   G.obligations; this is the carrier that lets MORPHISM preserve G while still accepting an
               --   owed /conduct unit into a fresh apportionment pass
ProtocolOutput = prior protocol's converged output in current session (e.g., a boundary map, a conducted method's autonomous region — read via the general heuristic scan below, no dedicated reader (see Known Limitations, "Obligation reading is heuristic") — or /conduct's owed-reapportionment entry for a unit it could not place a move for — see Composition, "Owed reapportionment from /conduct's withdrawal", which DOES have one: ReadObligations/owed_unit/owed_obligations, below)
owed_unit(G)   ≡ G.prior names a /conduct owed-reapportionment entry for a unit it could not place a move for
               -- the OwedReapportionment(unit, resolver) HandoffAnnotation hyphegesis's SubstrateHandoff
               --   carries (see hyphegesis SKILL.md TYPES, HandoffAnnotation); opaque here beyond its unit
               --   field — merismos does not read resolver (it is already the recipient) or any other field
owed_obligations(G) = (the named entry's unit).obligations   -- defined when owed_unit(G); the exact
               --   Set(Obligation) that unit was emitted with in ITS original UnitEntry (see merismos TYPES,
               --   GoalEntry), carried through /conduct unread — not re-derived, not inferred from prose
               --   (R6, closing the producer gap Composition's "Owed reapportionment from /conduct's
               --   withdrawal" and Known Limitations' "Obligation reading is heuristic" previously asserted
               --   without a step that performed it)
Obligation     = a stated or inferred requirement the goal must satisfy — the unit of coverage; each cites its evidence in G
H              = ExecutionHorizon      -- the budget one autonomous run is expected to fit (turns, time, context lifecycle); read from context, cue cited
U              = Set(Unit)             -- the apportionment
Anchor         = Set(Obligation)
               -- Pack's per-cycle focus region: the (possibly proper) subset of `residual` Scan's seam
               --   evidence gives Pack something to prioritize a cut around this cycle — "the
               --   highest-leverage unapportioned region" of the Rules' Phase 1 framing. Pack's INPUT frame,
               --   chosen BEFORE the specific cut (see ProposedUnit, next)
               -- Anchor empty ≡ Pack found no region to prioritize THIS cycle — independent of residual = ∅:
               --   residual may still hold obligations no evidenced seam currently distinguishes (FLOW's
               --   "Anchor empty ∧ residual ≠ ∅" branch, resolved by autonomous_pack's Heuristic fallback
               --   over the whole remainder), or residual may itself already be exhausted (the two
               --   "residual = ∅" branches) — the three FLOW branches on this predicate stay distinct
               -- STABLE under Recut: Recut re-derives proposed_unit from the SAME Anchor under a new
               --   direction, never re-scoping it (LOOP: "re-frames the SAME anchor"); cycle-indexed
               --   (Anchor[cycle_n]) because Scan may select a DIFFERENT region once this one is packed
               -- re-seeded when a cycle closes via autonomous_pack: the next cycle's Anchor becomes
               --   whichever of a packed leftover unit's obligations (fit ≠ Fits) or the post-pack residual
               --   is non-empty ("a still-non-empty residual likewise re-anchors")
ProposedUnit   = { subject: String, obligations: Set(Obligation), fit: SpanFit, seam: Seam,
                    capability_requirements: Set(CapabilityRequirement), feasibility_notes: Set(FeasibilityNote) }
               -- Pack's and autonomous_pack's output shape — everything a cut carries BEFORE integration
               --   assigns it an identity. Same fields as Unit, minus unit_ref: a ProposedUnit is
               --   structurally incapable of carrying a UnitRef, not a Unit with a blank field, so a
               --   proposed cut can never be mistaken for an integrated one at the type level (closes F1:
               --   Unit's unit_ref stays a REQUIRED field with no pre-integration value ever satisfying it).
               --   Presented at Qu, re-derived by Recut, and carried across cycles without ever entering U
               --   (see integrate)
Unit           = { unit_ref: UnitRef, subject: String, obligations: Set(Obligation), fit: SpanFit, seam: Seam,
                    capability_requirements: Set(CapabilityRequirement), feasibility_notes: Set(FeasibilityNote) }
               -- subject: a coarse framing of the work the unit carries, not a procedural step decomposition
               -- unit_ref: a stable identity assigned at integration, independent of subject — see UnitRef.
               --   Structural equality over Unit is therefore sound: two units are never equal by accident
               --   of sharing a subject, because unit_ref differs. integrate_unit(ProposedUnit) → Unit is the
               --   ONLY constructor Unit has, so no Unit value is ever missing unit_ref — a proposed cut
               --   becomes a Unit exactly when, and because, it receives one
               -- capability_requirements / feasibility_notes: the carrier for what Substrate Boundary already
               --   promises — "units carry capability requirements and feasibility notes, never a binding."
               --   Both empty is valid (many units need nothing beyond the ambient substrate); never populated
               --   with a concrete executor, model, runtime, or tool token — that binding belongs to the
               --   downstream runtime's consuming seam, not to this protocol (see Substrate Boundary)
SpanFit        ∈ {Fits, Overflows, Indeterminate}
               -- Fits: the unit's work completes within one execution horizon
               -- Overflows: exceeds it — recut, or commit under an explicit user override recorded on fit
               -- Indeterminate: not judgeable from available evidence; surfaced at the gate, never silently read as Fits
fit_override_recorded(u) ≡ u.unit_ref ∈ Λ.fit_overrides   -- written by OverrideFit, AFTER integrate_unit assigns
               --   u.unit_ref — comparing by unit_ref (not by the Unit value) is what makes this sound: the
               --   recorded identity and the integrated identity are provably the same unit (see integrate)
SingleDominantUnit(Anchor, proposed_unit) ≡ Pack's search over Anchor's residual obligations, under the seam
                                             evidence gathered in Scan and the horizon H, admits no second cut
                                             whose obligation set differs from proposed_unit's and whose fit
                                             is also Fits
               -- proposed_unit: ProposedUnit — Pack's own output, pre-integration; this predicate is decided
               --   before any UnitRef exists, so it is never keyed on unit_ref
               -- decided AT Pack time, from the same search that already produces proposed_unit and SpanFit —
               --   not a separately invented judgment. Analogous to fit and qualify: an internal-analysis
               --   sense predicate the AI computes and can cite, not a value Λ stores. False (and Qu
               --   presented) whenever Pack's search finds ≥2 differently-scoped Fits-worthy cuts for the
               --   Anchor, or cannot establish singularity from the evidence available — an unjudgeable case
               --   falls through to Qu like any other non-dominant anchor; it never defaults to relay
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
CapabilityRequirement = a functional description of what carrying out the unit's work requires (e.g. shell
               access, network read/write to a named path, an external API) — descriptive only. Naming a
               concrete executor, model, runtime, or tool token here would perform the binding Substrate
               Boundary declares out of scope, so a requirement stays functional even where the AI could guess
               a fitting tool
FeasibilityNote = a free-text observation flagging a feasibility concern read from the goal (an access
               constraint, a timing dependency, a resource limit) — descriptive, not enforced; the empty set
               is valid when the unit carries no such concern
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
               --   what /conduct's UNIT binding keys on instead of subject, which is not unique across units.
               --   PlanStateRequirement deliberately never keys on it: topology_free forbids UnitRef in both
               --   predicate and basis, including for plan_terminal
PlanStateRequirement = { predicate: VerifiablePredicate, basis: Set(Evidence) }
               -- a self-contained property of PLAN STATE: contains no UnitRef, Move, MoveRegion, or
               --   order-position reference. This is what makes Apportion over Order CONSTRUCTIVE rather
               --   than merely asserted — the type itself cannot carry an ordering fact, so a plan
               --   condition's firing criterion can never smuggle one in. "First evaluable" (when the
               --   predicate can first be checked) and "safe to discharge" (when its result is authoritative)
               --   are different predicates: dischargeable_when states the latter — e.g. a coverage
               --   predicate over K ∪ R, or a completion-count threshold — never a turn count or a named unit
               -- SCOPE-OWNED at WholeGoalAcceptance: those open alternatives are for the OTHER plan scopes
               --   (FinalIntegration, GlobalNonRegression), whose discharge points genuinely vary with what
               --   the condition asserts. At WholeGoalAcceptance, dischargeable_when is protocol-owned and
               --   IS plan_terminal(|U|), whichever step produced the condition. BindPlanRequirements normalizes
               --   that field BEFORE every check that can gate emission — after DerivePlan/Qt and after every
               --   Adjust — so the emitted value is exactly the value hard_invariants_hold inspected; Confirm
               --   never mutates P after the check
               -- the claim is SUFFICIENCY, not uniqueness: plan_terminal is always SAFE for this scope. It
               --   reads the current plan's aggregate UnitResolution projection and carries aggregate evidence
               --   with no UnitRef or order position, so it cannot smuggle topology into the pre-conduct plan.
               --   A narrower safe point may exist; this scope takes the conservative terminal requirement
               --   rather than ranking candidates, accepting non-minimality as the price of one uniform rule
               -- authorship division, restated at the Adjust gate: a user's Adjust changes the acceptance
               --   CRITERION (p.condition). WHEN it is safe to discharge that criterion is a plan-state fact
               --   this protocol computes, not a value the user authors — a direction phrased as timing
               --   ("check acceptance once A and B pass") is read as a change to the criterion, never as an
               --   authored dischargeable_when, because BindPlanRequirements normalizes that field before the
               --   adjusted plan is checked and re-presented
topology_free(req) ≡ req contains no UnitRef, Move, MoveRegion, or order-position reference
               -- an AI-judged semantic check over req.predicate and req.basis, not a structural guarantee:
               --   PlanStateRequirement's fields (VerifiablePredicate, Set(Evidence)) are generic and do not
               --   themselves forbid an order-position or UnitRef reference from being written into a
               --   predicate's free-form content. check(...) evaluates this per plan condition and its result
               --   feeds InvariantStatus.plan_conditions_topology_free, which gates the Confirm transition via
               --   hard_invariants_hold — a violation is caught before emission, not merely asserted
               --   afterward, but the guarantee is only as strong as this per-instance judgment call
leaf(u)        = ⋀ { κ.condition | κ ∈ K, κ.unit = u }
               -- THE JOIN RULE: one unit = one execution interval = one conjoined leaf predicate. A unit's
               --   conditions are an all-of, not several entries: per-condition entries would duplicate the
               --   unit's execution identity, and a cartesian product does the same more explicitly
               -- defined for every u, but read into a DeterminateResolution only when u has at least one
               --   completion-kind κ. The completion-kind guard belongs to resolve_unit, below; it prevents
               --   both an empty conjunction and an invariant-only conjunction from being emitted as done
LeafConjunct   = { condition: VerifiablePredicate, kind: PredicateKind }
NonEmptySet(T) = { S: Set(T) | S ≠ ∅ }
conjuncts(u)   = { { condition: κ.condition, kind: κ.kind } | κ ∈ K, κ.unit = u }
               -- the same κ set leaf(u) conjoins, kept unconjoined so a reader can distinguish completion
               --   from invariant provenance after enforcement joins them
accepted_completion_residuals(u, R) = { ρ.obligation | ρ ∈ R, ρ.unit = Some(u),
                                                        ρ.kind = completion,
                                                        ρ.disposition = AcceptUncovered }
UnitResolution = DeterminateResolution { predicate: VerifiablePredicate,
                                         conjuncts: Set(LeafConjunct) }
               ⊎ AcceptedUncoveredResolution { accepted_completion_residuals: NonEmptySet(Obligation),
                                                conjuncts: Set(LeafConjunct) }
               -- THE CROSS-SEAM TERMINATION CERTIFICATE. One constructor owns all facts the previous
               --   leaf/resolve/emission chain split across sites: which predicate kind can ground unit
               --   termination, which completion residual was accepted when no such predicate exists, and
               --   every completion/invariant conjunct whose provenance must cross to /conduct. The accepted
               --   arm carries a NON-EMPTY witness, so its satisfied result is constituted by AcceptResiduals,
               --   never inferred from the mere absence of a completion κ. Its conjunct set may be non-empty:
               --   an invariant can compile even when completion remains an accepted residual
resolve_unit(u, K, R) : UnitResolution
               = DeterminateResolution { predicate: leaf(u), conjuncts: conjuncts(u) }
                   when ∃ κ ∈ K : κ.unit = u ∧ κ.kind = completion
               = AcceptedUncoveredResolution {
                   accepted_completion_residuals: accepted_completion_residuals(u, R),
                   conjuncts: conjuncts(u) }
                   when ∄ κ ∈ K : κ.unit = u ∧ κ.kind = completion
                    ∧ accepted_completion_residuals(u, R) ≠ ∅
               -- constructed only in Phase 3, after AcceptResiduals. unit_termination_covered guarantees
               --   pre-Confirm that one of the two sources exists; AcceptResiduals supplies the accepted arm's
               --   disposition, making resolve_unit total on every emitted unit without introducing a default
accepted_completion_projection(candidate_plan) =
               { a.obligation | a ∈ candidate_plan.accepted_residuals, a.kind = completion }
resolution_holds(r, candidate_plan) ≡
               (r = DeterminateResolution { predicate: d, ... } ⟹ d holds)
               ∧ (r = AcceptedUncoveredResolution { accepted_completion_residuals: A, conjuncts: C } ⟹
                    A ≠ ∅ ∧ A ⊆ accepted_completion_projection(candidate_plan)
                    ∧ ∀ c ∈ C : c.condition holds)
               -- AcceptedUncoveredResolution satisfies termination because its non-empty accepted witness is
               --   part of the constructor AND the same obligations appear in the plan envelope's accepted
               --   completion projection, while every compiled invariant conjunct it carries must still hold.
               --   Completion is accepted uncovered; invariants are not silently waived. This is not
               --   total-function or empty-conjunction truth: removing the witness, its durable acceptance
               --   record, or a passing invariant makes the predicate false
resolution_basis(n) = Evidence { source: "the current plan's UnitResolution and accepted-residual projections",
                                 content: "expected aggregate resolution count = " + String(n) +
                                          "; all executable resolution conditions; aggregate accepted-completion record" }
               -- aggregate evidence for plan_terminal. It cites the resolution projection AS A WHOLE and
               --   contains no UnitRef, Move, MoveRegion, or order position. That deliberate loss of per-unit
               --   topology makes terminal conservative: /conduct may treat every region as a possible
               --   invalidator and bind the requirement no earlier than terminal, which is safe for this scope
E              = Set(GoalEntry)        -- emission
GoalEntry      = UnitEntry { unit_ref: UnitRef, subject: String, obligations: Set(Obligation),
                             resolution: UnitResolution,
                             capability_requirements: Set(CapabilityRequirement),
                             feasibility_notes: Set(FeasibilityNote) }
               ⊎ PlanEntry { scope: PlanScope, kind: PredicateKind, condition: VerifiablePredicate,
                             dischargeable_when: PlanStateRequirement }
               ⊎ PlanEnvelopeEntry { accepted_residuals: Set(AcceptedResidualEntry), oos: Set(OOSDeclaration),
                             unbounded_approved: Bool }
               -- exactly one per emission (see CONVERGENCE), carrying the three plan-level facts that belong
               --   to no single unit or plan condition. It exists because E is the DURABLE channel and the
               --   returned plan value is not: the returned structure dies with the session, while /conduct
               --   reads its input after a compact or clear. A plan whose every leaf passes can still be
               --   globally unguarded, and a consumer that cannot see the waivers, the out-of-scope
               --   declarations, or the unbounded approval cannot tell — so these travel as an EMITTED entry,
               --   not only as fields of the value
               -- a coproduct, not one record with an optional field: a unit entry has no firing point at all
               --   (its interval IS when it fires), while a plan entry carries dischargeable_when as a
               --   topology-free property of plan state — WHEN it becomes safe to discharge, never WHICH
               --   unit or order-position it follows; naming an order fact is /conduct's, not this
               --   protocol's, and scope+kind are retained (not reduced to a framing string) because a
               --   context-less consumer cannot recover them from prose
               -- resolution is resolve_unit's single certificate: its constructor names the completion
               --   outcome, and its conjuncts retain completion/invariant provenance. A residual-only unit has
               --   an accepted certificate with conjuncts = ∅; a unit with accepted completion and a compiled
               --   invariant has an accepted certificate with NON-EMPTY conjuncts. Neither field can drift
               --   because they no longer travel as sibling values assembled by separate expressions
               -- capability_requirements / feasibility_notes: copied verbatim from the owning Unit at
               --   emission, so the substrate-boundary promise crosses the session boundary on the entry
               --   itself, not only in Unit or in prose
               -- obligations: copied verbatim from the owning Unit — the same coverage set integrate_unit
               --   assigned it. Carried because a unit /conduct cannot arrange a move for travels back to
               --   /apportion as an owed re-apportionment (HandoffAnnotation.OwedReapportionment, see
               --   hyphegesis SKILL.md TYPES) naming the WHOLE UnitEntry, not merely its ref; without
               --   obligations on the entry, a returned owed unit would name nothing this protocol could fold
               --   back into residual for a fresh apportionment pass (see Composition, "Owed reapportionment
               --   from /conduct's withdrawal"). fit and seam are deliberately NOT carried on the entry: no
               --   consumer reads either past emission — a returned obligation is apportioned anew under a
               --   fresh cut, never resumed under its dissolved unit's stale fit or seam judgment (Apportion
               --   over Order; the granularity boundary in Known Limitations)
               -- per unit: UnitEntry(u.unit_ref, u.subject, u.obligations, resolve_unit(u, K, R),
               --   u.capability_requirements, u.feasibility_notes); per plan condition: PlanEntry(p.scope, p.kind, p.condition,
               --   p.dischargeable_when); once per emission: PlanEnvelopeEntry(the Λ-accepted residuals as
               --   AcceptedResidualEntry values, Λ.oos, Λ.unbounded_approved)
oos            = Set(OOSDeclaration)   -- obligations guardable only by pre-action interception
OOSDeclaration = { obligation: Obligation, substrate: String, basis: Evidence }
               -- substrate names the delegated enforcement channel. It is a field rather than prose because
               --   the recorded handoff is what the substrate boundary requires; an out-of-scope declaration
               --   whose delegate is unnamed delegates to nothing
declared_oos(o) ≡ ∃ d ∈ oos : d.obligation = o ∧ d.substrate ≠ ""
ReadObligations = G → O_G              -- exact producer of the local obligation set; reads an owed UnitEntry's
               --   obligations field when owed_unit(G), otherwise contributes only G.obligations
VelocityFilter = O_G → oos             -- an obligation whose violation must be caught BEFORE an action executes
               --   (destructive command blocking, permission escalation, prompt-injection defense) cannot be a
               --   stop-time predicate: a completion check evaluates after the harm. Declared out of scope with
               --   its substrate named; deriving it into a leaf would simulate protection while providing none
InvariantStatus = { coverage_complete: Bool, span_fit: Bool, termination_covered: Bool,
                    obligations_derived: Bool, oos_substrate_named: Bool,
                    plan_conditions_topology_free: Bool }
hard_invariants_hold(Λ) ≡ Λ.invariant_status.coverage_complete ∧ Λ.invariant_status.span_fit
                        ∧ Λ.invariant_status.termination_covered ∧ Λ.invariant_status.obligations_derived
                        ∧ Λ.invariant_status.oos_substrate_named ∧ Λ.invariant_status.plan_conditions_topology_free
               -- every clause of apportioned(G) that a Qc judgment can still violate. The transition to
               --   emission is guarded by this conjunction, so no clause of the result equation is left
               --   asserted-but-unenforced — oos_substrate_named closes the fifth clause: a delegated
               --   obligation with no substrate named is as unenforceable as an uncovered one;
               --   plan_conditions_topology_free closes the sixth: an order-position or UnitRef reference
               --   smuggled into a plan condition's predicate content is caught here — as check(...)'s AI
               --   semantic judgment over free-form predicate content (see topology_free), not a type-level
               --   proof, but evaluated and gated rather than left as a bare CONVERGENCE assertion
coverage_complete(U, O_G) ≡ ∀ o ∈ O_G : (∃ u ∈ U : o ∈ u.obligations) ∨ declared_oos(o) ∨ accepted_uncovered(o)
               -- HARD invariant. Every goal obligation is apportioned to some unit, visibly delegated, or
               --   accepted as uncovered on record — never silently absent
span_fit(U)    ≡ ∀ u ∈ U : u.fit = Fits ∨ fit_override_recorded(u)
               -- HARD invariant, with an explicit user-override path
obligation_derived(u, K, R) ≡ ∀ o ∈ u.obligations : (∃ κ ∈ K : κ.unit = u ∧ κ.obligation = o)
                                                  ∨ (∃ ρ ∈ R : ρ.unit = Some(u) ∧ ρ.obligation = o)
               -- what the Adjust no-loss constraint checks: every obligation of every unit is carried by a
               --   predicate or by a residual. Checkable only because κ carries its obligation
derived_already(u, K, R) ≡ (∃ κ ∈ K : κ.unit = u) ∨ (∃ ρ ∈ R : ρ.unit = Some(u))
               -- what Phase 2's Derive step skips over on re-entry: a unit already carrying ANY K or R
               --   entry — whether from a prior Phase 2 pass's Derive or from a user's Adjust — is not
               --   re-derived. V = Reopen clears a unit's K/R entries when it leaves U, so this reads
               --   correctly for whatever unit(s) later repack that unit's obligations (D4)
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
plan_condition(d) = PlanCondition { scope: WholeGoalAcceptance, kind: completion,
                     condition: [the predicate direction d states],
                     dischargeable_when: PlanStateRequirement { predicate: λ candidate_plan. False, basis: ∅ } }
               -- materialized from a DefineNow direction: scope = WholeGoalAcceptance, kind = completion, and
               --   condition is exactly what d states. dischargeable_when is seeded with an inert,
               --   permanently-false placeholder only to keep this mandatory field populated at construction —
               --   BindPlanRequirements is the authoritative producer of its real value and runs before any
               --   check or read ever consults it, so no constructor-specific provisional value survives to
               --   the check
BindPlanRequirements(P, U) = { p with dischargeable_when := plan_terminal(|U|) when p.scope = WholeGoalAcceptance;
                               p unchanged otherwise | p ∈ P }
               -- REPLACEMENT, not an after-the-fact patch: runs after DerivePlan plus any Qt result, and after
               --   every Adjust plus any Qt re-fire, immediately BEFORE check. It is idempotent on Reopen
               --   re-entry and is the sole producer of the WholeGoalAcceptance scope invariant. Confirm and
               --   AcceptResiduals never mutate P, so the exact normalized value the guard inspects is the
               --   value Phase 3 emits
unit_resolution_projection(candidate_plan) = { e.resolution | e ∈ candidate_plan.units }
               -- projects away unit_ref, subject, obligations, and topology-adjacent identity. The result is
               --   the certificate set plan_terminal evaluates; UnitEntry correspondence in CONVERGENCE makes
               --   it complete for every emitted unit
plan_terminal(n) = PlanStateRequirement {
                   predicate: λ candidate_plan.
                     |candidate_plan.units| = n
                     ∧ ∀ r ∈ unit_resolution_projection(candidate_plan) : resolution_holds(r, candidate_plan),
                   basis: {resolution_basis(n)} }
               -- the ordinary conservative terminal requirement, defined over the plan presented to the
               --   executing substrate at evaluation time rather than over invocation-local U/K/R. Its
               --   Determinate arm reads each compiled predicate; its accepted arm cross-checks the non-empty
               --   witness carried by AcceptedUncoveredResolution against the plan envelope's aggregate
               --   accepted-completion projection and still requires every carried invariant conjunct to hold.
               --   The predicate therefore cannot inherit vacuity from
               --   resolve_unit's constructor choice: an accepted arm exists only when AcceptResiduals produced
               --   evidence, and a determinate arm must actually hold. For U=∅/oos≠∅ the empty projection is
               --   intentional — there is no unit interval to await, so whole-goal acceptance itself may be
               --   evaluated immediately
               -- topology freedom is constructive at this boundary: the predicate projects only resolution
               --   certificates, and resolution_basis cites that aggregate projection without any UnitRef,
               --   Move, MoveRegion, or order position. The expected count prevents a dropped-unit projection
               --   from making the universal vacuously true while adding no identity or order fact. A consumer
               --   may consequently bind it conservatively at
               --   terminal, and check can establish topology_free before Confirm instead of rejecting every
               --   WholeGoalAcceptance condition or guarding a different value than the one emitted
               -- n is fixed at BindPlanRequirements time to |U| of THIS apportionment pass and never re-derived
               --   from a later plan: when a downstream /conduct Withdraw reduces the carried plan's unit
               --   count below n, |candidate_plan.units| = n reads false and stays false — by design, not
               --   oversight. A withdrawn unit's obligations are owed back to /apportion (see hyphegesis
               --   SKILL.md HandoffAnnotation); accepting whole-goal completion while that obligation stands
               --   would accept a goal whose plan no longer covers it. THIS SPECIFIC requirement instance never
               --   discharges again: no step merges a later /apportion pass's output back into the carried plan
               --   this n was fixed against, or rebinds this p.dischargeable_when to a new n — a fresh
               --   apportionment over the returned obligations is a SEPARATE emission (Phase 3 Emit constructs
               --   a new E, package a new plan), and granularity is deliberately not re-cut (see Known
               --   Limitations), so nothing obligates that fresh cut to reproduce the withdrawn count. Whole-goal
               --   acceptance for the goal, if reached at all, is reached through that fresh plan's own
               --   freshly-derived WholeGoalAcceptance condition and its own plan_terminal(n') over its own
               --   units — a distinct requirement instance, not a restoration of this one
Rerouted       = routed_to_bound       -- deliberate non-emission exit at Qt; distinct from EarlyExit (abort)
EarlyExit      = user_esc              -- non-convergent abort: no emission, no handoff recorded
Emit           = (U, K, P) → E [Tool: TaskCreate]
cycle_n        = Nat                   -- apportionment cycle counter; surfaced at every Qu
Phase          ∈ {0, 1, 2, 3}
Qu             = Per-cycle apportionment interaction with (Anchor, proposed_unit: ProposedUnit, SpanFit, Seam, cut-set snapshot, cycle counter) [Tool: Constitution interaction]
Qt             = Whole-goal acceptance interaction, conditional on ¬acceptance_present(P) [Tool: Constitution interaction]
Qc             = Unit-plan confirmation interaction with (U, K, R, P, InvariantStatus, oos) [Tool: Constitution interaction]
ConditionBearingUnitPlan = { units: Set(UnitEntry), plan_conditions: Set(PlanEntry),
                              accepted_residuals: Set(AcceptedResidualEntry), oos: Set(OOSDeclaration),
                              unbounded_approved: Bool }
               -- every field is E partitioned by its coproduct constructor: units from UnitEntry,
               --   plan_conditions from PlanEntry, and accepted_residuals/oos/unbounded_approved from the one
               --   PlanEnvelopeEntry. The value is a VIEW of the emitted record, never a parallel copy — so
               --   the three plan-level facts (accepted-uncovered obligations, delegated substrates, the
               --   whole-goal acceptance waiver) reach a consumer through the durable channel and not only
               --   through an in-memory return the session boundary destroys. Neither the returned value nor
               --   the convergence trace crosses that boundary; E persists and N points the recipient to it. Well-formed exactly when
               --   apportioned(G) holds (see CONVERGENCE)
AcceptedResidualEntry = { obligation: Obligation, unit_ref: Option(UnitRef), kind: PredicateKind }
               -- one entry per residual whose disposition is AcceptUncovered at Confirm; unit_ref threads
               --   back to the owning UnitEntry (mirrors Residual's own Option(Unit) field) so a consumer can
               --   see WHICH unit's completion or invariant predicate is missing, not merely THAT one is
plan           = the ConditionBearingUnitPlan value returned by this invocation -- referenced in CONVERGENCE
HandoffLocator = the durable identity of the emitted record set E — what a later session dereferences to
               --   read this plan back. Written into N by record_handoff, required by apportioned(G)
               -- the handoff is a POINTER to the emitted record, never a re-authored copy of it: this
               --   protocol supplies the entry point, and the consumer derives from its own purpose what to
               --   carry over. A handoff step that recorded only "handed off" would leave the successor
               --   session with a claim and no address
locator        = E → HandoffLocator   -- read by record_handoff from the durable identities TaskCreate returned
N              = NavigationBlock { purpose_frame: String, canonical_locator: HandoffLocator,
                                    dereference_instruction: DereferenceInstruction, snapshot_anchor: Option(String),
                                    grounding_instruction: GroundingInstruction }
               -- emitted in the settled fixed shape: Purpose / frame; Canonical locator; Dereference
               --   instruction; optional Snapshot anchor only when exact-state determinacy is needed; and
               --   Grounding instruction. The grounding instruction directs the recipient to run /inquire
               --   where available (or its equivalent grounding pass) and stop when a source is unreachable
               --   or a needed premise lacks support-integrity. It carries entry points, never a copy of E
DereferenceInstruction = an instruction to read E at the canonical locator
GroundingInstruction = the fixed instruction to run /inquire where available, or the recipient's equivalent
               --   grounding pass, and stop when a source is unreachable or a needed premise lacks
               --   support-integrity
emitted(N)     ≡ record_handoff presented N in the handoff output — the emission IS the text, since N
               --   crosses the session boundary as presented text and not as Λ state. Defined separately
               --   from emitted(E) ≡ Λ.emitted: the two travel on different channels, and reusing one
               --   symbol across both without saying so leaves the reader unable to discharge either
handoff_recorded(N, E) ≡ emitted(N) ∧ N.purpose_frame ≠ ""
                          ∧ N.canonical_locator = locator(E)

── PHASE TRANSITIONS ──
Phase 0: G → Probe(G) → goal_plan_uncompiled?                          -- activation checkpoint (sense)
           ¬autonomous_intent(G) → relay → deactivate                  -- no autonomous interval in scope (extension)
           condition_bearing(G)  → relay → deactivate                  -- units and conditions already present (extension)
           uncompiled            → ReadObligations(G) → O_G → VelocityFilter(O_G) → oos; residual := O_G \ {d.obligation | d∈oos} → Phase 1   -- ONE-TIME init, fired only on this Phase 0 → Phase 1 edge; Phase 2's Reopen re-enters Phase 1 directly (see Phase 2 → Phase 1 below) without re-running it, so O_G/residual/oos are never re-seeded over a partial apportionment (D3). ReadObligations is this edge's formal producer for an owed unit's obligations entering the LOCAL compilation set (R6); G remains unchanged
Phase 1: (G, residual, cycle_n) → Scan [Tool] → seams → Pack(seams, H) → (Anchor, proposed_unit, SpanFit, Seam)   -- apportionment loop (sense); residual/oos enter this phase either freshly seeded (Phase 0's one-time init, above) or as Reopen left them (the reopened unit's obligations restored, every other packed unit's obligations untouched) — never re-seeded on entry
           Anchor empty ∧ residual = ∅ ∧ U = ∅ ∧ oos = ∅ → relay(goal's scope too thin to read any obligation — route to /inquire) (extension) → deactivate   -- scope too thin to read any obligation; an empty plan would misreport apportionment as having occurred
           Anchor empty ∧ residual = ∅ ∧ (U ≠ ∅ ∨ oos ≠ ∅) → Phase 2
           Anchor empty ∧ residual ≠ ∅ → autonomous_pack(residual) (track) → ∀u∈U'' (Fits-worthy packed units): integrate(u) → u' → U := U ∪ {u'} → surface (extension) → Phase 2 | re-anchor → cycle_n += 1, Phase 1
           SingleDominantUnit ∧ SpanFit = Fits → relay(AcceptUnit) (extension) → integrate → cycle_n += 1, Phase 1
           else → Qu → Stop → Aᵤ (constitution) [Tool]
             Aᵤ = AcceptUnit   → integrate(U, residual) → cycle_n += 1, Phase 1        -- offered iff SpanFit = Fits; assigns the accepted unit a fresh UnitRef
             Aᵤ = Recut(d)     → re-derive Anchor frame under d → cycle_n += 1, Phase 1
             Aᵤ = OverrideFit  → integrate(U, residual) → u' → Λ.fit_overrides := Λ.fit_overrides ∪ {u'.unit_ref} → cycle_n += 1, Phase 1   -- offered iff SpanFit ≠ Fits; integrate assigns u' its fresh UnitRef first, so the override is recorded against the integrated identity
             Aᵤ = Sufficient   → autonomous_pack(residual) (track) → ∀u∈U'' (Fits-worthy packed units): integrate(u) → u' → U := U ∪ {u'} → surface (extension) → Phase 2 | re-anchor → cycle_n += 1, Phase 1
             Esc               → deactivate (EarlyExit)
Phase 2: U → ∀u∈U, ¬derived_already(u,K,R): Derive(u) → (Set(κ), Set(ρ)) → K:=K∪κs, R:=R∪ρs ∥ [¬Λ.plan_conditions_derived: DerivePlan(G, U) → P; Λ.plan_conditions_derived := ⊤]   -- condition derivation (sense), scoped to units and plan conditions not yet derived this apportionment: a unit or plan-condition set that already carries K/R/P content — from a prior Phase 2 pass's Derive/DerivePlan or from a user's Adjust — is preserved across Reopen's back-edge into Phase 1 and back, never silently re-derived over it (D4); oos already computed once at the Phase 0 → Phase 1 edge, not re-computed here
           oos ≠ ∅ → OOS(oos) (extension)                              -- out-of-scope declaration, substrate recorded on each OOSDeclaration
           ¬acceptance_present(P) → Qt(K, P) → Stop → Vₜ (constitution) [Tool]   -- fires at pass entry, and again after any Adjust that clears acceptance
             Vₜ = DefineNow(d)     → P := P ∪ {plan_condition(d)}; [Λ.unbounded_approved: Λ.unbounded_approved := ⊥]   -- retracts a stale unbounded waiver from an earlier Qt firing's ApproveUnbounded (reachable via ApproveUnbounded → Reopen → this DefineNow), mirroring Adjust's retraction below (R5/D5)
             Vₜ = RouteBound       → deactivate (Rerouted)
             Vₜ = ApproveUnbounded → Λ.unbounded_approved := ⊤
           BindPlanRequirements(P, U) → P := Pᵦ → check(U, K, R, Pᵦ, oos) → InvariantStatus   -- normalize every WholeGoalAcceptance requirement against the current |U| BEFORE topology_free is checked; coverage_complete ∧ span_fit ∧ termination_covered ∧ obligations_derived ∧ oos_substrate_named ∧ plan_conditions_topology_free (track)
           Λ.plan_conditions_stale → StaleNotice(P) (extension)        -- pre-Qc surfacing when Reopen changed U since P's whole-goal conditions were last touched (R4): review, Adjust, or Confirm as recorded
           Qc(U, K, R, P, InvariantStatus, oos) → Stop → V (constitution) [Tool]
             V = Adjust(d) → rederive over the SAME U → (K, R, P) := (K', R', P') → Λ.plan_conditions_stale := ⊥ → [¬acceptance_present(P') → Qt] → [acceptance_present(P') ∧ Λ.unbounded_approved: Λ.unbounded_approved := ⊥] → BindPlanRequirements(P', U) → P' := Pᵦ' → check(U, K', R', Pᵦ', oos) → InvariantStatus → re-present Qc   -- obligation_derived(u, K', R') holds for every u ∈ U; a P' that now carries whole-goal acceptance retracts a stale unbounded waiver rather than emitting both (D5); scope-owned requirements are normalized against the current |U| before check, which is RE-RUN against that exact adjusted state so the hard_invariants_hold guard Confirm consults never reads a pre-Adjust or pre-normalization value; Adjust clears the staleness notice (R4) — it is the user's engagement point with P
             V = Reopen(u) → residual := residual ∪ u.obligations; U := U \ {u}; K := K \ {κ∈K:κ.unit=u}; R := R \ {ρ∈R:ρ.unit=Some(u)}; Λ.fit_overrides := Λ.fit_overrides \ {u.unit_ref}; Λ.plan_conditions_stale := ⊤ → cycle_n += 1 → Phase 1   -- the reopened unit's derived conditions leave with it (D4), and so does its fit-override record, mirroring K/R; P itself is not re-derived (Rule 25) but the unit set it was derived against just changed, so the staleness flag marks that for surfacing (R4)
             V = Confirm ∧ ¬hard_invariants_hold(Λ) → re-present Qc naming the violated invariant   -- a hard invariant is not waivable by confirming past it
             V = Confirm ∧ hard_invariants_hold(Λ) → AcceptResiduals(R) → Λ.accepted := Λ.accepted ∪ {ρ.obligation | ρ ∈ R}; ∀ρ∈R: ρ.disposition := AcceptUncovered (track) → Phase 3   -- P is unchanged after the guarded check; AcceptResiduals produces the accepted-completion witnesses resolve_unit reads during Emit
Phase 3: (U, K, P) → Emit → E [Tool: TaskCreate] → package(E) → record_handoff(E) → N (extension) → converge(apportionment trace) (extension) → ConditionBearingUnitPlan

Phase 0 → Phase 1: goal_plan_uncompiled(G)                             -- an autonomous goal whose unit plan and conditions are uncompiled; this edge alone performs the one-time VelocityFilter/residual init (see Phase 0 body) — Phase 2 → Phase 1 (Reopen, below) does not repeat it
Phase 0 → deactivate: ¬autonomous_intent(G) ∨ condition_bearing(G)     -- relay the scan result; no activation
Phase 1 → deactivate: residual = ∅ ∧ U = ∅ ∧ oos = ∅                   -- nothing could be read from the goal's scope; relays to /inquire rather than emitting an empty plan
Phase 1 → Phase 1: cycle_n += 1                                        -- next anchor; bounded by coverage (residual strictly shrinks on AcceptUnit/OverrideFit) and by user agency (Recut/Sufficient/Esc)
Phase 1 → Phase 2: residual = ∅ ∧ (U ≠ ∅ ∨ oos ≠ ∅)                    -- every obligation apportioned or visibly delegated, and something was actually read
Phase 2 → Phase 1: V = Reopen(u)                                       -- the derived conditions revealed a bad cut; that unit's obligations return to residual. User-driven, so bounded by user agency exactly as Adjust is
Phase 2 → Phase 2: V = Adjust(d)                                       -- rederive over the same apportionment; U unchanged
Phase 2 → Phase 2: V = Confirm ∧ ¬hard_invariants_hold(Λ)              -- Qc re-presents with the violated invariant named; no state advances
Phase 2 → deactivate: Vₜ = RouteBound                                  -- Rerouted; /bound → /apportion re-entry recompiles fresh
Phase 2 → Phase 3: V = Confirm ∧ hard_invariants_hold(Λ)               -- residuals accepted on record; every clause of apportioned(G) that Qc can violate holds AT THE TRANSITION, not merely in the equation
Phase 3 → converge: emitted(E) ∧ handoff_recorded(N, E)                -- ConditionBearingUnitPlan + apportionment trace + navigation block
Phase 1 → deactivate (ungraceful): user_esc                            -- EarlyExit: no emission, no handoff recorded
Phase 2 → deactivate (ungraceful): user_esc                            -- EarlyExit: no emission, no handoff recorded

── LOOP ──
Two bounded loops, one per irreducible part.

Apportionment loop (Phase 1): one anchor per cycle; cycle_n visible at every Qu.
  AcceptUnit and OverrideFit strictly shrink residual (the accepted unit's obligations leave it), so the loop
  cannot cycle on coverage. Recut leaves residual unchanged by design — it re-frames the SAME anchor under a
  user direction — and is therefore bounded by user agency, as are Sufficient (which packs the remainder) and
  Esc. A single dominant unit that fits relays without a turn yield: no genuine alternative apportionment
  exists for that anchor, so presenting one would be a false choice. A cycle entered via Reopen (the one
  back-edge from Phase 2, below) carries the reopened unit's restored obligations in residual and every other
  already-packed unit's obligations untouched — the loop resumes exactly where that unit's apportionment was
  undone, never from a freshly re-seeded residual (D3).

Condition loop (Phase 2): Qt fires whenever the whole goal carries no acceptance criterion — at pass entry,
  and again after an Adjust that clears one, since Adjust replaces P wholesale and an acceptance the user
  already stated must not vanish into an emission. The reverse direction is symmetric but does not re-fire
  Qt: when an Adjust instead INTRODUCES whole-goal acceptance while an earlier ApproveUnbounded waiver is
  still on record, Λ.unbounded_approved is retracted in that same transition, so the emission never carries
  both a real acceptance condition and a stale unbounded waiver (D5). The SAME retraction fires on the
  DefineNow arm of Qt itself (R5), because Adjust is not the only path back to an acceptance-introducing
  state: ApproveUnbounded never writes to P, so a LATER Qt firing — reached via Reopen, since
  acceptance_present(P) is still false after ApproveUnbounded — can resolve to DefineNow while
  Λ.unbounded_approved still reads ⊤ from the earlier firing, with no Adjust anywhere on that path to catch
  it. DefineNow retracting unconditionally on every firing, not only the Adjust-triggered one, is what closes
  that route rather than leaving it a special case. Qc's Adjust rederives over the SAME apportionment — K' ∪
  R' still spans every obligation of every unit (obligation_derived, no removal; a withdrawn or weakened
  condition becomes a residual), so an obligation never leaves the derived set silently. check is RE-RUN
  after BindPlanRequirements has normalized the adjusted state (K', R', P', and P'' if the Qt re-fire further
  mutated it) before Qc re-presents, so Confirm's hard_invariants_hold guard always consults an InvariantStatus
  computed against the CURRENT, SCOPE-NORMALIZED state — never one computed before the Adjust or before the
  normalization that just ran. Confirm does not waive a hard invariant: a
  coverage or fit violation re-presents Qc with the violation named rather than advancing to emission. Reopen
  is the one back-edge to Phase 1: it fires when the derived conditions expose a cut that cannot be
  conditioned, returns exactly that unit's obligations to residual, clears that unit's own K/R entries, and
  re-enters the apportionment loop. This back-edge is SCOPED, not a fresh start: residual is never re-seeded
  from the goal's full obligation set (that seeding is the one-time Phase 0 → Phase 1 action, D3), and when
  Phase 1 → Phase 2 fires again, Derive and DerivePlan run only over what is not yet derived — the reopened
  unit's replacement(s), and P only if this apportionment never derived it — so a unit's Adjust-shaped
  conditions, and any whole-goal conditions already on record, survive a detour through the apportionment
  loop rather than being silently re-derived over (D4). Surviving unre-derived is not the same as surviving
  UNCHECKED, though: Reopen also sets Λ.plan_conditions_stale (R4), because the unit set P's whole-goal
  conditions were derived or last adjusted against just changed under them, and DerivePlan's own
  once-only guard (plan_conditions_derived) will never revisit that on its own — re-deriving unconditionally
  would discard the user's Adjust-shaped P (the exact defect the guard was added to prevent), so instead the
  next Qc surfaces the staleness as a notice and leaves the choice — Adjust or Confirm as recorded — with the
  user, clearing once they Adjust. check itself still re-runs in full every time, since InvariantStatus must
  reflect the current K/R/P/U regardless of what changed. BindPlanRequirements runs idempotently on every pass
  immediately before that check, so every WholeGoalAcceptance condition carries plan_terminal(|U|) before the guard
  reads it; Confirm performs no later P mutation. AcceptResiduals then accepts R and supplies the non-empty
  completion-residual witness any AcceptedUncoveredResolution needs at Emit. Confirm or Esc terminates.

Stateless: Merismos terminates at emission. No invocation-local state survives into the execution interval —
no session approvals, no per-action classification, no mid-execution checkpoint. The emitted navigation
block is the cross-session route to E, not surviving Λ state.

Convergence evidence (relay, at emission): present the apportionment trace —
  (a) Plan readback — the goal restated as its units in plain single-sentence form;
  (b) Per-unit: (obligations covered, seam quality with its citation or heuristic declaration, horizon fit or
      the recorded override) → the unit resolution certificate — the conjoined predicate plus typed conjuncts
      when the unit has ≥1 compiled completion condition, or an accepted-completion witness plus any invariant
      conjuncts when it has none — and the unit's capability requirements and feasibility notes;
  (c) Plan-level conditions with the plan-state requirement that makes each safe to discharge;
  (d) Each accepted-uncovered residual with its obligation, and each out-of-scope obligation with its substrate;
  (e) When unbounded_approved: the recorded whole-goal acceptance waiver with its gate site.
These qualifying facts are not only presented in this trace — (d) and (e) are emitted as a plan-envelope
entry alongside the unit and plan-condition entries, so a consumer reading the emitted record in a later
session, without this trace and without the returned value, can still tell a fully guarded plan from one with
waived obligations. Every field of the returned plan is, by construction, E's own coproduct partition read
back — not a re-derived or independently asserted copy — so the returned structure
cannot go stale or empty relative to what Phase 3 actually emitted.
Convergence is demonstrated, not asserted.

── CONVERGENCE ──
-- plan denotes the returned ConditionBearingUnitPlan (see TYPES); E is the TaskCreate-emitted goal-entry set
apportioned(G) = emitted(E) ∧ handoff_recorded(N, E)
                 ∧ coverage_complete(U, O_G) ∧ span_fit(U)
                 ∧ (U ≠ ∅ ∨ oos ≠ ∅)                                                -- a goal with nothing read from it never claims apportionment occurred
                 ∧ (∀u∈U: unit_termination_covered(u, K, R))
                 ∧ (∀u∈U: obligation_derived(u, K, R))
                 ∧ (∀u∈U: |{e ∈ E : e is UnitEntry ∧ e.unit_ref = u.unit_ref}| = 1)   -- the join rule holds: one unit entry per unit, keyed on unit_ref — subject is not unique across units
                 ∧ (∀u∈U: ∀e∈E: (e is UnitEntry ∧ e.unit_ref = u.unit_ref) → (e.obligations = u.obligations ∧ e.resolution = resolve_unit(u, K, R)
                                     ∧ e.capability_requirements = u.capability_requirements ∧ e.feasibility_notes = u.feasibility_notes))   -- the join rule's durable certificate: resolve_unit jointly supplies the completion disposition, its accepted-completion witness when needed, and every typed conjunct, while the emitted obligations/capability/feasibility fields remain exact reads from the owning unit. No sibling leaf/conjunct assembly can drift, and no accepted arm can be constructed from absence alone
                 ∧ (∀p∈P: ∃! e ∈ E : e is PlanEntry ∧ e.scope = p.scope ∧ e.kind = p.kind
                                     ∧ e.condition = p.condition ∧ e.dischargeable_when = p.dischargeable_when)
                 ∧ (∀e∈E: e is UnitEntry → ∃! u∈U: e.unit_ref = u.unit_ref)          -- reverse correspondence: no unapproved UnitEntry can ride in E
                 ∧ (∀e∈E: e is PlanEntry → ∃ p∈P: e.scope = p.scope ∧ e.kind = p.kind
                                     ∧ e.condition = p.condition ∧ e.dischargeable_when = p.dischargeable_when)   -- reverse correspondence: no unapproved PlanEntry can ride in E
                 ∧ (∀p∈P: topology_free(p.dischargeable_when))
                 ∧ (∀p∈P: p.scope = WholeGoalAcceptance → p.dischargeable_when = plan_terminal(|U|))   -- produced by BindPlanRequirements before the final check; the captured aggregate count prevents a dropped-unit projection from satisfying the terminal universal vacuously
                 ∧ plan.units = {e ∈ E : e is UnitEntry}                             -- the RETURNED plan's units are exactly E's UnitEntry partition — produced by Phase 3 package from E, not asserted separately; closes F2: an empty or stale returned plan cannot satisfy this equation
                 ∧ plan.plan_conditions = {e ∈ E : e is PlanEntry}                   -- the RETURNED plan's plan conditions are exactly E's PlanEntry partition — produced by Phase 3 package from E
                 ∧ (acceptance_present(P) ∨ unbounded_approved)
                 ∧ ¬(acceptance_present(P) ∧ unbounded_approved)                    -- D5: a real acceptance condition and an unbounded waiver never both hold at emission — Adjust retracts Λ.unbounded_approved the moment it introduces the former while the latter still reads ⊤ (see V = Adjust); DefineNow and ApproveUnbounded are alternative answers to the same Qt firing, so they cannot both be set from one Qt call either
                 ∧ (∀d∈oos: d.substrate ≠ "")
                 ∧ (∃! e ∈ E : e is PlanEnvelopeEntry)                               -- exactly one envelope per emission: none leaves the plan-level facts off the durable channel, several leaves a consumer no way to pick
                 ∧ (∀e∈E: e is PlanEnvelopeEntry →
                        e.accepted_residuals = { AcceptedResidualEntry(ρ.obligation, ρ.unit.map(u ↦ u.unit_ref), ρ.kind) | ρ ∈ R : ρ.disposition = AcceptUncovered }
                      ∧ e.oos = oos ∧ e.unbounded_approved = Λ.unbounded_approved)   -- exact correspondence in BOTH directions, keyed by unit_ref (not merely obligation+kind, per Residual's Option(Unit) field mapped through .unit_ref) — a waiver attributed to the wrong unit, or an extra waiver no residual justifies, fails this equality
                 ∧ plan.accepted_residuals = (the PlanEnvelopeEntry of E).accepted_residuals
                 ∧ plan.oos = (the PlanEnvelopeEntry of E).oos
                 ∧ plan.unbounded_approved = (the PlanEnvelopeEntry of E).unbounded_approved   -- the returned value READS BACK the emitted envelope rather than being re-derived beside it, so value and durable record cannot disagree; produced by Phase 3 package from E
-- The PlanEnvelopeEntry clauses close A1 at the boundary that actually exists: a plan whose every leaf passes
-- can still be globally unguarded, and neither the convergence trace nor the returned value survives a
-- compact or clear — E does. Putting the waivers, the out-of-scope declarations and the acceptance waiver on
-- an EMITTED entry is what lets the consumer that reads this plan in a later session tell the difference; the
-- plan.* clauses then make the returned value a read-back of that entry rather than a second derivation that
-- could drift from it. plan.units and plan.plan_conditions close the adjacent gap: without them, an empty or
-- stale returned plan structurally satisfies every other clause, because nothing equated the RESULT with E.
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
Phase 0 ReadObligations (sense)     → Internal analysis (construct O_G once as G.obligations plus the exact obligations field of a /conduct owed-reapportionment entry when owed_unit(G); a local read, never a G mutation. Produces the set VelocityFilter, residual seeding, and coverage_complete consume; this is the formal carrier for Composition's owed-unit path and Known Limitations' one non-heuristic obligation read; R6)
Phase 1 VelocityFilter (sense)      → Internal analysis (obligations guardable only by pre-action interception; computed once at Phase 1 entry from O_G, before residual is seeded, so an out-of-scope obligation never enters the packing loop and a re-apportioned owed unit's obligations are screened exactly like any other; empty scope with no obligation and no delegation relays to /inquire rather than proceeding)
Phase 1 Scan         (observe)      → Read, Grep (optional seam evidence gathering over the goal's cited substrate; read-only)
Phase 1 Pack         (sense)        → Internal analysis (apportionment search: units fitting one horizon, coverage over obligations; produces a ProposedUnit, not a Unit — no unit_ref exists until integrate_unit assigns one; reads each proposed unit's capability requirements and feasibility notes from the goal's stated needs — functional descriptions only, never a concrete executor/model/runtime/tool token (Substrate Boundary); the same search evaluates SingleDominantUnit — whether any alternative Fits-worthy cut of this Anchor exists beside proposed_unit)
Phase 1 fit          (sense)        → Internal analysis (per-unit horizon-fit verdict; Indeterminate surfaced, never read as Fits)
Phase 1 qualify      (sense)        → Internal analysis (seam quality: Grounded with citation, or Heuristic declared)
Phase 1 relay        (extension)    → TextPresent+Proceed (SingleDominantUnit with a fitting horizon: accept the unit without a turn yield — no genuine alternative apportionment exists for this anchor)
Phase 1 autonomous_pack (track)     → Internal state update (extension — pack the remainder at Heuristic seams when seam evidence is exhausted or the user declares the apportionment sufficient; produces ProposedUnit values exactly as Pack does — no unit_ref until integrate assigns one; reads capability requirements and feasibility notes for each packed unit exactly as Pack does — functional descriptions only, never a concrete executor/model/runtime/tool token; each packed unit re-checks fit and is surfaced as relay with its heuristic declaration; a packed unit whose fit is not Fits does NOT enter U — it re-enters as the next cycle's anchor for Qu, where the override is the user's to record; a still-non-empty residual likewise re-anchors; every Fits-worthy packed unit is routed through integrate — the SAME UnitRef-assigning operation Qu's AcceptUnit uses — before entering U, so no unit ever enters U, or is later emitted, without a UnitRef)
Phase 1 Qu           (constitution) → present (the anchor's proposed unit [ProposedUnit] + horizon-fit verdict + seam quality with its basis + current cut-set + cycle counter; the accept option is fit-complementary — AcceptUnit when the span fits, OverrideFit when it does not; Esc → EarlyExit) [Tool]
Phase 1 integrate    (track)        → Internal state update (consumes a ProposedUnit and produces a Unit — the only constructor Unit has: the accepted unit enters the apportionment and its obligations leave the residual; a fresh UnitRef is assigned to the unit in that same step, stable for the remainder of the apportionment; OverrideFit records THAT fresh UnitRef into Λ.fit_overrides after assignment, never before, so fit_override_recorded compares the same identity that was integrated)
Phase 2 Derive       (sense)        → Internal analysis (per-unit completion and invariant predicates; an obligation with no verifiable predicate becomes a residual; scoped to units where ¬derived_already(u,K,R) — a unit already carrying K/R content from a prior Phase 2 pass or a user Adjust is not re-derived on a Reopen-driven re-entry, D4)
Phase 2 DerivePlan   (sense)        → Internal analysis (conditions whose subject is the whole goal; never distributed across units; fires once per apportionment, guarded by ¬Λ.plan_conditions_derived, so a Reopen-driven re-entry does not silently discard a user's prior Adjust to P, D4)
Phase 2 OOS          (extension)    → TextPresent+Proceed (out-of-scope declaration per obligation, with the delegated substrate named)
Phase 2 Qt           (constitution) → present (conditional: the whole goal has no acceptance criterion — define it now / route its definition to /bound / proceed unbounded on record; fires at pass entry and again after any Adjust that clears acceptance, always before Qc re-presents; DefineNow additionally retracts Λ.unbounded_approved when it still reads ⊤ from an earlier Qt firing on this same invocation — R5, mirroring Adjust's own retraction, see D5) [Tool]
Phase 2 ApproveUnbounded (track)    → Internal state update (record Λ.unbounded_approved, materializing the informed acceptance for the convergence predicate; does NOT touch P, so a LATER Qt re-fire — after a Reopen, since acceptance_present(P) is still false — can still reach DefineNow while this reads ⊤, which is exactly what DefineNow's own retraction (R5) exists to catch)
Phase 2 BindPlanRequirements (track) → Internal state replacement (immediately before every check, replace P with the same conditions except that every WholeGoalAcceptance entry carries dischargeable_when = plan_terminal(|U|); runs after DerivePlan/Qt and after every Adjust/Qt re-fire. This is the sole producer of the scope-owned convergence clause and its identity-free expected count; because Confirm never mutates P, check inspects exactly what Emit later reads)
Phase 2 check        (track)        → Internal state update (invariant status: coverage, horizon fit, termination coverage, obligation derivation, oos substrate-naming, and each plan condition's topology-freedom — an AI semantic judgment over the plan condition's predicate content, not a structural proof — over the current apportionment; RE-RUN every time Qc is about to (re-)present — at pass entry, and again after every Adjust plus any Qt re-fire it triggers — so Λ.invariant_status is never read stale against a state check has not yet seen)
Phase 2 StaleNotice   (extension)   → TextPresent+Proceed (conditional: Λ.plan_conditions_stale = ⊤ — surface, as pre-gate text before Qc, that plan-level conditions were derived or last user-adjusted against a unit set a subsequent Reopen has since changed (R4); relay only, mutates no Λ field beyond what Reopen/Adjust already write)
Phase 2 Qc           (constitution) → present (apportionment + derived conditions + residual dispositions + invariant status + the staleness notice when present: Confirm / Adjust / Reopen) [Tool]
Phase 2 AcceptResiduals (track)     → Internal state update (on Confirm: record each remaining residual's obligation into Λ.accepted and write ρ.disposition := AcceptUncovered for each ρ ∈ R. This supplies accepted_completion_residuals(u,R), the non-empty witness resolve_unit's accepted constructor requires at Emit; the pre-Confirm guard depends on the completion-kind residual's presence, not on this later disposition write. P is untouched — BindPlanRequirements already produced and check already inspected its final scope-owned requirements)
Phase 3 Emit         (track)        → TaskCreate (one goal entry per unit: unit_ref + subject + obligations + resolve_unit's single UnitResolution certificate — DeterminateResolution carries the conjoined predicate and every typed conjunct when a completion κ exists; AcceptedUncoveredResolution carries a non-empty accepted-completion witness plus any invariant conjuncts when no completion κ exists — + capability requirements and feasibility notes carried verbatim; plan-level conditions as their own entries carrying scope + kind + condition + the already-checked dischargeable_when; AND exactly one plan-envelope entry carrying the Λ-accepted residuals, the computed oos set, and Λ.unbounded_approved. The durable certificate is the only producer surface /conduct mirrors, so completion kind, invariant provenance, and acceptance evidence cross together; TodoWrite is the harness-equivalent realization; sets Λ.emitted on completion — record_handoff then emits N with locator(E), outside Λ) [Tool]
Phase 3 package      (track)        → Internal state update (constructs the returned ConditionBearingUnitPlan as a VIEW of E, partitioned by constructor: units from the UnitEntry members, plan_conditions from the PlanEntry members, and accepted_residuals/oos/unbounded_approved read back off the emitted PlanEnvelopeEntry — never re-derived from Λ in parallel with what was emitted, so the value and the durable record cannot disagree)
Phase 3 record_handoff (extension)  → TextPresent+Proceed (emit N in the fixed navigation-block shape with canonical_locator = locator(E), a dereference instruction, the optional snapshot anchor only when exact-state determinacy is needed, and the grounding instruction; entry points only, never a re-authored plan. This emitted block is what handoff_recorded(N, E) reads)
converge             (extension)    → TextPresent+Proceed (apportionment trace after the navigation block has been emitted; deactivate)
esc                  (extension)    → TextPresent+Proceed (no emission; deactivate as EarlyExit, not ConditionBearingUnitPlan)
seam                 (extension)    → TextPresent+Proceed (two seams, scoped separately. INBOUND activation seam (before this protocol activates): the `/bound → /apportion` and `/conduct → /apportion` legs of the `## Composition` chain relay when a user-declared chain names `/apportion` next, or an invocation follows that declared composition edge — proceed directly, citing the settling source; this seam fires at the upstream handoff, not after this protocol's emission. OUTBOUND emission seam (after this protocol emits): the `/apportion → enforcer` edge is EXCLUDED — Rule 8 (Separate activation) governs it, keeping the enforcer's start the user's own constitutive act; the `/apportion → /conduct` edge relays only under a user-declared chain naming /conduct next, never automatically, and carries the no-reentry guard of Rule 9. Every Constitution gate inside this protocol and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = { phase: Phase, G: AutonomousGoal, H: ExecutionHorizon, cycle_n: Nat,
      O_G: Set(Obligation),              -- written once by Phase 0 ReadObligations; local augmented read, never a mutation of G; read by VelocityFilter, residual seeding, coverage_complete, and the coverage partition
      U: Set(Unit), residual: Set(Obligation),
      fit_overrides: Set(UnitRef),       -- seeded ∅ by init_loop_state; written by OverrideFit AFTER integrate_unit assigns the ref; fit_override_recorded(u) ≡ u.unit_ref ∈ Λ.fit_overrides; cleared of a reopened unit's ref by Reopen, mirroring K/R
      K: Set(CompiledCondition), R: Set(Residual), P: Set(PlanCondition), oos: Set(OOSDeclaration),
      plan_conditions_derived: Bool,     -- seeded ⊥ by init_loop_state; written ⊤ the one time Phase 2's DerivePlan runs; read by Phase 2's entry guard so a Reopen-driven re-entry does not silently re-run DerivePlan over a P a user may already have Adjusted (D4/D5)
      plan_conditions_stale: Bool,       -- seeded ⊥ by init_loop_state; written ⊤ by Reopen (P's whole-goal conditions were derived or adjusted against a unit set Reopen just changed); read by the pre-Qc StaleNotice surfacing; written ⊥ by Adjust (the user's engagement point with P) — never auto-cleared by re-running check, and never forces a re-derivation itself (R4)
      accepted: Set(Obligation),         -- written by AcceptResiduals on Confirm; accepted_uncovered(o) ≡ o ∈ Λ.accepted
      unbounded_approved: Bool,          -- written by Qt on ApproveUnbounded; RETRACTED (:= ⊥) by EITHER Adjust (when it introduces whole-goal acceptance while this still reads ⊤) OR DefineNow (on any Qt firing, unconditionally — R5, since ApproveUnbounded never touches P and a later Qt refire can reach DefineNow with no intervening Adjust) — never left stale beside a real acceptance condition (D5)
      invariant_status: InvariantStatus,
      U_history: List(Set(Unit)), A_history: List(UnitJudgment),  -- seeded [] by init_loop_state; declared for
      --   a per-cycle audit trail, but no FLOW operation appends to or reads either list — see Known
      --   Limitations §Cycle history is declared but not wired
      emitted: Bool,                     -- written by Phase 3 Emit; emitted(E) ≡ Λ.emitted
      active: Bool, cause_tag: String }
-- Coverage partition invariant: residual, (⋃ᵤ u.obligations) and {d.obligation | d ∈ oos} are pairwise
--   disjoint and together equal O_G at every cycle boundary — an obligation is always exactly one
--   of: still residual, apportioned to a unit, or visibly delegated out of scope. Holds from cycle 1: oos is
--   computed once at the Phase 0 → Phase 1 edge, before residual is seeded, so an out-of-scope obligation
--   never transits through a unit on its way into oos. Holds across Reopen's back-edge too (D3): Reopen moves
--   exactly the reopened unit's obligations from "in a unit" to residual and touches nothing else, so the
--   partition's disjointness is preserved rather than an obligation briefly sitting in both cells.
--   Λ.accepted is NOT a fourth cell: it is a MARKING over obligations that already sit in a unit, recording
--   that the unit carries no verifiable predicate for them. An accepted obligation is therefore in a unit AND
--   in Λ.accepted, by construction — ρ.unit is what ties them
-- Compile-time only: Λ exists from invocation to emission; nothing persists into the execution interval

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). registered dependency edges preserved. Dimension resolution emergent via session context.
Two-way advisory with /conduct, guarded against reentry: the /apportion → /conduct edge carries a multi-unit
plan into conduct's work prospect; the /conduct → /apportion edge hands an already-conducted method's
unresolved autonomous region back for apportionment. Neither is a precondition. The no-reentry guards (Rule 9)
make the pair non-recursive: a conducted region's until_goal_met termination binds that region's
DeterminateResolution predicates, conjoined, as its stated termination ground — or, when the region has none,
the ground is owed back to /apportion instead of conjoining nothing; a region resolved to any other termination
value enforces the executable conditions each UnitResolution actually carries inside its own interval (while
an accepted completion residual stays an acceptance record), with the region's completion recorded as a coverage limit; neither
case routes back here, and an already-conducted region's topology is fixed input that this protocol does not
re-conduct. A unit /conduct could not place a move for travels back separately, as an owed re-apportionment (see
"Owed reapportionment from /conduct's withdrawal" below) — a distinct edge from either of the above.
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
  condition_bearing(G)  ≡ (G already carries units whose completion conditions are determinate predicates —
                          a prior /apportion plan covering this goal, or an explicit unit-and-condition set the
                          user supplied) ∧ ¬owed_unit(G). A goal with units but no conditions, or conditions but
                          no units, is uncompiled: both halves are this protocol's product. The exclusion is
                          load-bearing, not decorative: when owed_unit(G) holds, G.prior names a /conduct
                          owed-reapportionment entry — a UnitEntry that structurally LOOKS like a prior unit
                          with a determinate completion condition, but exists BECAUSE /conduct could arrange no
                          move for it and returned it for a fresh cut. Without this exclusion, a scan could read
                          that returned UnitEntry as evidence of condition_bearing(G) and relay-deactivate before
                          the uncompiled branch's ReadObligations ever runs — starving owed_obligations(G) of the
                          one read that exists to serve it (see TYPES O_G, ReadObligations; R6)
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
2. **Pack** the residual against the execution horizon into a proposed unit, and judge its fit — fits, overflows, or indeterminate. An unjudgeable fit is surfaced as indeterminate at the gate; it is never quietly recorded as fitting. Pack also reads the proposed unit's capability requirements and feasibility notes from the goal's stated needs — a functional description of what the work needs, never a concrete executor, model, runtime, or tool token; that binding belongs to the downstream runtime, not to this protocol.
3. **Qualify the cut**. When the proposed unit sits on a seam found in step 1, the cut is grounded and carries that citation. When the goal supplies no such evidence, the cut is heuristic — declared, not dressed up as a natural joint. An abstract goal frequently has no evidenced joints, and that is a fact about the goal, not a defect in the cut.
4. **Present** the proposed unit with its fit verdict, its seam quality and basis, the current cut-set, and the cycle counter, via Cognitive Partnership Move (Constitution) — unless a single dominant unit fits, in which case accept it as relay: no genuine alternative apportionment exists for that anchor, so presenting one would be a false choice.

The accept option is fit-complementary: on a unit that fits, the user simply accepts it; on one that overflows or cannot be judged, the only way in is an override recorded on that unit. The user may instead direct a recut of the same region or declare the apportionment sufficient. On sufficiency — or when seam evidence runs out — the remaining obligations are packed at heuristic seams and surfaced as relay, with each packed unit's fit re-checked and its heuristic quality declared; a packed unit that does not fit is not slipped in, it comes back as the next proposal so the override stays the user's to record. A packed unit that does fit is integrated through the same identity-assigning step as an accepted unit, so it never enters the apportionment — or a later emission — without a UnitRef.

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

An Adjust direction reshapes what each condition ASSERTS. When a whole-goal acceptance criterion becomes safe to discharge is a plan-state fact this protocol computes at Confirm, not a value the user authors, so a direction phrased as timing ("check acceptance once A and B pass") lands on the criterion rather than on its firing point — see `PlanStateRequirement`'s SCOPE-OWNED note for why that field is protocol-owned at this one scope.

Adjust rederives over the same apportionment and re-presents. Reopen returns exactly that unit's obligations to the residual and re-enters Phase 1. Both are bounded by user agency: Confirm or Esc terminates.

### Phase 3: Emission and Handoff

On Confirm:

1. **Emit** one goal entry per unit via TaskCreate — the unit's identity, subject and obligations, plus one unit-resolution certificate. When it carries a compiled completion condition, the determinate certificate holds the conjoined predicate and every typed conjunct; otherwise the accepted-uncovered certificate holds a non-empty accepted-completion witness and any compiled invariant conjuncts. This is a legitimate accepted outcome, never a vacuous always-true stand-in, and invariant provenance cannot split from the completion disposition because both travel in the same certificate. Carry the unit's capability requirements and feasibility notes verbatim so the downstream runtime can bind an executor without re-deriving what the handoff dropped. Carrying the obligations too is what lets a unit `/conduct` later withdraws travel back as a re-apportionable owed unit rather than a bare, unreadable identity. One unit is one execution interval is one entry; plan-level conditions are emitted as their own entries carrying the already-checked plan-state requirement under which each becomes safe to discharge.
2. **Package the result**: carry over E's own unit and plan-condition entries as the plan's units and plan conditions, and fold in every qualifying fact Λ already holds — each accepted-uncovered residual keyed to its owning unit, the out-of-scope declarations, and the unbounded-acceptance waiver — as fields on the returned plan itself, not only as trace text.
3. **Present the apportionment trace**: the plan readback, then per unit its covered obligations, seam quality, fit verdict, unit-resolution certificate (determinate predicate or accepted-completion witness) with each conjunct's kind, and its capability requirements and feasibility notes; the plan-level conditions; each accepted-uncovered residual; each out-of-scope obligation with its substrate; and any recorded acceptance waiver.
4. **Emit the handoff navigation block** and deactivate: purpose/frame, E's canonical locator, the dereference instruction, a snapshot anchor only when exact-state determinacy is needed, and the grounding instruction to run `/inquire` where available (or equivalent grounding) and stop on an unreachable source or unsupported load-bearing premise. This is a pointer to E, never a re-authored plan.

Emission is Merismos's epistemic endpoint. Merismos does not invoke the downstream enforcer, and it does not order the units — the user activates the enforcer separately, and `/conduct` arranges the units if their arrangement is non-trivial. Nothing of Merismos survives into the execution interval.

## Composition

Merismos is the apportion-and-condition step ahead of an autonomous run. The composition, in prose with standard notation:

- **Two-way with `/conduct`, guarded**: a multi-unit plan flows from `/apportion` into `/conduct` as its work prospect when the units' order, independence, reconciliation, termination topology or routing is non-trivial. In the other direction, a `/conduct` activation that reaches an unresolved autonomous region hands that region to `/apportion` for apportionment and conditioning. Both edges are advisory, never preconditions, and both carry a no-reentry guard: when `/conduct` consumes a condition-bearing unit plan, a region resolved to `until_goal_met` termination binds that region's `DeterminateResolution` predicates, conjoined, as its stated termination ground — or, when the region has no determinate predicate, records the ground as owed back to `/apportion` instead of conjoining nothing. A region resolved to any other termination value enforces the executable conditions each `UnitResolution` actually carries inside that unit's interval (the determinate predicate, or an accepted certificate's invariant conjuncts when present) and records the region's completion as a coverage limit; the accepted completion residual remains an acceptance record and is never reconstructed as a leaf. Either way, the binding does not route back here. When `/apportion` receives an already-conducted region, that region's topology is fixed input and this protocol does not re-conduct it. A single unit, or a unit set whose order, independence, reconciliation, termination and routing are all trivial, bypasses `/conduct` entirely.
- **Owed reapportionment from `/conduct`'s withdrawal**: a third, distinct edge from the two above. When `/conduct` cannot arrange a move for one of this protocol's incoming units, it withdraws that unit and hands it back naming `/apportion` as the resolver — carrying the WHOLE unit entry, not merely its identity, because a bare identity names nothing this protocol could re-derive obligations from. A later `/apportion` invocation whose prior protocol output names that owed unit entry reads its `obligations` field into the invocation-local `O_G` set (`ReadObligations` at the Phase 0 → Phase 1 edge — see FLOW, PHASE TRANSITIONS, and TOOL GROUNDING; R6), returning them to `residual` for a fresh apportionment pass without mutating the supplied goal — never a resumption of the withdrawn unit's dissolved cut: its former fit and seam judgments do not travel and are not reused, per Apportion over Order and the granularity boundary (a returned obligation is apportioned anew, not re-cut from its prior shape).
- **`/bound` upstream**: a boundary map narrows both halves — which seams are candidate cuts, and which conditions the units are subject to. Advisory: absence narrows the read, it does not block apportionment.
- **The enforcer is a leaf executor**: on Claude Code (verified against v2.1.140; bounded claim — re-verify on harness version change), `/goal` installs a session-scoped stop-hook that re-prompts the model until its condition is met. It enforces a completion predicate *inside* one bounded interval; it exposes no external step injection and no mid-loop gating. This is exactly why one unit maps to one entry with one conjoined predicate: the enforcer consumes a leaf, not a workflow. Driving it as a progressive workflow engine fails structurally — that role belongs to `/conduct` and, for step-approval/resume/timeout semantics, to a workflow/HITL substrate outside this protocol suite.
- **Guard role**: the apportionment defends the enforcer's characteristic failure modes — a goal too large for one interval silently truncating, which unit fit prevents; an obligation nobody owns passing unnoticed, which coverage prevents; early or false termination, which the per-unit completion predicate makes determinate; and boundary erosion across a long interval, which the invariant predicates make detectable at stop time. When the goal carries no whole-goal acceptance criterion, the acceptance check makes that absence a recorded decision rather than a silent default.
- **Separate activation**: emitting the plan is `/apportion`'s epistemic endpoint. The user invokes the enforcer separately — automatic coupling to a harness built-in is avoided by design, so the constitutive act of starting the autonomous interval stays with the user.
- **Executor binding is outside**: units carry capability requirements and feasibility notes, never a concrete executor, model, runtime or tool token. Which substrate realizes a unit is bound at the consuming runtime's seam, not inside the plan.
- **After the interval**: `/contextualize` checks post-execution applicability and `/grasp` verifies understanding of the result, both downstream of the enforced run.

## Known Limitations

**Bounded platform claim**: The leaf-executor characterization of `/goal` (stop-hook predicate enforcer, no external step injection) is verified against Claude Code v2.1.140 only. A harness version change requires re-verification before relying on the composition guidance above.

**Obligation reading is heuristic**: The goal's obligations are read from its utterance, prior protocol output, and session context. An obligation the user holds but never uttered, and that no upstream protocol captured, will not be read — and therefore will not be covered, even though coverage is a hard invariant over what *was* read. The Phase 2 gate is the correction point: the apportionment is presented with its covered obligations precisely so a missing one becomes visible. One case is not heuristic: when the prior protocol output is `/conduct`'s owed-reapportionment entry for a unit it could not place a move for, `ReadObligations` reads that unit's obligations directly off the entry's `obligations` field into local `O_G` — the same set this protocol emitted and `/conduct` carried through unread — not inferred from prose and not written back into G. This is a FORMAL step (`ReadObligations`, `owed_unit`, and `owed_obligations`; see TYPES and Phase 0's FLOW/PHASE TRANSITIONS/TOOL GROUNDING), not only a claim about how the surrounding heuristic reading happens to behave in that one case (R6). A DIFFERENT `/conduct`-origin case stays heuristic and is not a second formal reader: a `TerminationGround` recorded as `resolution_required(/apportion)` (hyphegesis SKILL.md TYPES) names this protocol as the owed resolver for a WHOLE region, not one unit's obligations, and no `ReadObligations`-analogous step exists for it — per the Epistemic Completeness Boundary, `/conduct` records that ground and stops, and discharge happens through this protocol's own ordinary activation on a later invocation, reading whatever the operator supplies from that region through the SAME heuristic prior-protocol-output scan `ProtocolOutput`'s "conducted method's autonomous region" example names (see TYPES), never through a dedicated ingress function.

**Seam evidence is often absent**: An abstract goal frequently supplies no dependency, deliverable, verification or ownership seam. Those cuts are declared heuristic rather than certified, and the resulting units may carry duplicated setup, cross-unit state leakage, or awkward predicates. The declaration makes the risk visible; it does not remove it.

**Horizon fit is an estimate**: Whether a unit's work completes within one execution horizon is judged before the run, from the goal's description. An unjudgeable fit is surfaced rather than guessed, but a fitting verdict can still be wrong — the override path exists because the user often knows better than the estimate.

**Predicate coverage**: Subjective quality bars and moving targets do not derive into verifiable predicates. Merismos surfaces them as residuals rather than emitting prose conditions; an uncovered residual the user accepts remains genuinely unguarded during the interval.

**Granularity is not re-cut**: A work body that already carries units with determinate completion conditions is `condition_bearing`, so this protocol relays and deactivates — even when those units are at an unsuitable granularity. Re-cutting an existing unit set is deliberately out of scope: this protocol cuts at the coarse framing units an autonomous run is carried out in, and finer task-level subdivision carries no meaning at the enforcer's leaf, where one unit is one interval is one conjoined predicate. A plan whose units are wrongly sized is corrected by restating the goal and recompiling, not by a granularity pass. The retired `/delimit` protocol held that pass over external work-breakdown structures; its removal leaves this gap open by decision rather than by oversight.

**Cycle history is declared but not wired**: `Λ.U_history` and `Λ.A_history` are declared in MODE STATE and seeded empty at Phase 1 entry, but no operation in this FLOW appends a cycle's apportionment or judgment to either list, and nothing reads them — not the LOOP section, not Qu, not CONVERGENCE. They currently carry no operational meaning; a reader must not infer an audit trail, replay capability, or Recut-time history lookup from their presence. Wiring them in (recording (U, Aᵤ) at the close of each Phase 1 cycle) or removing them from MODE STATE is an open follow-up, not resolved here.

**No execution-time protection**: Merismos is compile-time only. A risk that emerges mid-interval — one not present in the goal's obligations at compile time — is outside the emitted conditions; pre-action risks are entirely the harness substrate's responsibility.

## Rules

1. **User-initiated, AI-apportioned**: User declares autonomous execution intent via `/apportion`; AI reads the obligations, searches the apportionment, and derives the conditions; the user settles each unit at Phase 1 and the conditioned plan at Phase 2 via Cognitive Partnership Move (Constitution).
2. **Apportion, do not order**: Merismos cuts the units and conditions them. Order, independence, reconciliation, termination topology and routing are `/conduct`'s; an emitted plan that carries them has absorbed `/conduct` and violates this protocol's identity. The emitted artifact is pre-conduct by construction.
3. **Coverage is a hard invariant**: Every obligation read from the goal belongs to some unit, is visibly declared out of scope, or is accepted as uncovered on record. A plan that leaves an obligation silently unowned is not emitted — the gap is surfaced at the confirmation gate for the user to close by recutting, by accepting it as an uncovered residual, or by delegating it out of scope. A goal from which nothing could be read at all (no unit, no delegation) does not emit an empty plan — it relays to `/inquire` instead, matching the Skip condition for a goal whose scope is too thin to read obligations from.
4. **Fit is a hard invariant with an override path**: Every unit fits one execution horizon, or carries an override the user recorded on that unit. An unjudgeable fit surfaces as indeterminate at the gate; it is never quietly read as fitting, and an overflowing unit is never committed without the recorded override. The gate enforces this by offering the accept options fit-complementarily — plain acceptance only on a fitting unit, the recorded override as the only way an unfitting one enters — and neither the autonomous packing pass nor a confirmation may carry an unfitting unit past it.
5. **Seam quality is declared, not asserted**: Each cut cites the dependency, deliverable, verification or ownership seam it sits on, or declares itself heuristic. Seam quality is a disposition rather than an invariant — an abstract goal may carry no evidenced joint, and claiming one anyway would be false precision.
6. **The join rule — one unit, one interval, one resolution certificate**: A unit's completion and invariant predicates are conjoined into a single leaf predicate and emitted in one certificate. Per-condition entries duplicate the unit's execution identity; a cartesian product does the same more explicitly. The certificate retains each conjunct's kind so provenance stays readable. A compiled completion predicate selects `DeterminateResolution`; without one, Confirm must have produced at least one accepted completion residual, and `AcceptedUncoveredResolution` carries that non-empty witness plus any compiled invariant conjuncts. Thus a residual-only unit has an accepted certificate with no conjuncts, while an invariant-bearing/completion-uncovered unit has an accepted certificate with invariant conjuncts; neither becomes a vacuous TRUE and neither loses provenance at the seam.
7. **Plan conditions stay plan-level**: A condition whose subject is the whole goal carries a plan-state requirement — a topology-free property of when it becomes safe to discharge, never a named unit or order-position, which is `/conduct`'s axis to resolve. It is never distributed across every unit to fit the leaf type — that multiplies false failures and hides which unit owns the obligation.
8. **Separate activation**: Emitting the plan is the epistemic endpoint. Merismos does not invoke the downstream enforcer; starting the autonomous interval is the user's separate constitutive act.
9. **No-reentry across the `/conduct` seam**: Both directions of the `/conduct` edge are advisory and guarded. A condition-bearing unit plan consumed by `/conduct` supplies stated termination grounds only for the regions whose resolved termination is `until_goal_met` — conjoining that region's `DeterminateResolution` predicates, or naming `/apportion` as the owed resolver when none exist; on a MIXED such region (some units `DeterminateResolution`, some `AcceptedUncoveredResolution`), the accepted units' own compiled invariant conjuncts sit outside that conjunction, so `/conduct` carries them on the same per-unit binding for the executing substrate to still enforce inside each unit's own interval — a region never terminates "goal met" over an invariant this protocol compiled but `/conduct` left unenforced (see hyphegesis SKILL.md TYPES, `UnitGroundDisposition`). Every other region enforces the executable conditions its unit resolutions actually carry inside their own intervals and records a coverage limit; an accepted completion residual remains an acceptance record rather than a fabricated leaf. None of it routes back to `/apportion`. An already-conducted autonomous region consumed by `/apportion` has fixed topology and is not re-conducted. A single unit, or a unit set whose order, independence, reconciliation, termination and routing are all trivial, bypasses `/conduct`. Neither edge is a precondition, so neither activation depends on the other having run. A unit `/conduct` withdraws because it could arrange no move for it is a separate, third edge — an owed re-apportionment back to `/apportion` (see Composition, "Owed reapportionment from `/conduct`'s withdrawal") — not a case of either guarded edge above.
10. **Verifiable predicate or witnessed acceptance required**: Every emitted unit resolution is either a `DeterminateResolution` carrying an executable check with a determinate pass/fail outcome, or an `AcceptedUncoveredResolution` carrying a non-empty accepted-completion witness — never a vacuous always-true check and never an unwitnessed tag. Every emitted plan condition is an executable check with a determinate pass/fail outcome. A condition expressible only as prose judgment is surfaced as a residual — sharpened into a predicate or accepted as uncovered — and is never emitted as prose.
11. **Stop-time only**: Only conditions evaluable when an interval stops are derived. An obligation requiring pre-action interception is declared out of scope with its delegated substrate named; deriving it into a stop-time leaf simulates protection while providing none.
12. **Stateless compile**: Emission is terminal. No session approvals, no per-action classification, no mid-execution checkpoint; re-invocation recompiles from current context rather than resuming prior state.
13. **Transparency-grounded**: Every obligation cites its evidence; every seam quality, fit verdict, residual disposition, override and out-of-scope delegation is visible in pre-gate text or the apportionment trace — surfaced and relay paths satisfy the same transparency invariant.
14. **Recognition over Recall**: Present structured options with differential implications via Cognitive Partnership Move (Constitution); Constitution interactions yield turn before proceeding.
15. **Context-Question Separation**: All analysis, evidence, and rationale appear as text output preceding the Constitution interaction; the question contains only the essential choice and option-specific differential implications.
16. **Convergence evidence**: Present the apportionment trace before deactivating — the plan readback plus per-unit evidence (obligations covered, seam quality with its citation or heuristic declaration, fit verdict or recorded override, unit-resolution certificate with conjunct kinds, capability requirements and feasibility notes), the plan-level conditions, each accepted-uncovered residual, and each out-of-scope delegation — required, not asserted. The units, plan conditions, accepted-uncovered residuals, out-of-scope delegations, and any acceptance waiver are additionally carried as fields on the emitted plan itself, in exact correspondence with what was emitted — a consumer reading only the returned structure, without this trace, can still see them. Emit the fixed-shape navigation block beside the trace so a later session can dereference that durable plan; no locator remains solely in invocation-local state.
17. **Option-set relay test (Extension classification)**: When AI analysis converges to a single dominant option (option-level entropy → 0), present the finding directly as Extension — a single dominant unit that fits its horizon is accepted as relay rather than wrapped in a false choice. Each Constitution option must be genuinely viable under different user value weightings; options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options.
18. **Gate integrity** (Safeguard tier): The defined option set is presented intact — option injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option into a concrete unit or condition while preserving the coproduct structure) is distinct from mutation.
19. **Substrate boundary**: Merismos scope is the epistemic substrate — obligation reading, apportionment search, fit and seam judgment, condition derivation, compile-time confirmation. Enforcement inside each interval, pre-action interception, workflow/HITL semantics, and concrete executor binding belong to native harnesses or specialized substrates, delegated by handoff at emission.
20. **Plain emit discipline**: User-facing emit (unit proposals, gate options, apportionment traces, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the unit, the condition, or the question in their idiom.
21. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background and distant context to pre-gate text or the apportionment trace.
22. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract, since each block is the type that constitutes the protocol — preserving the blocks keeps the protocol intact. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).
23. **Seam relay on declared continuation, enforcer edge excepted**: this protocol's seam splits into two, each scoped to its own lifecycle point. INBOUND activation seam (before this protocol activates): when a user-declared chain names `/apportion` next, or an invocation follows the `## Composition` chain's declared `/bound → /apportion` or `/conduct → /apportion` edge, the transition into `/apportion` is relay (Extension) — proceed directly, citing the settling source; this seam fires at the upstream handoff, before `/apportion` activates. OUTBOUND emission seam (after this protocol emits): the `/apportion → enforcer` edge is EXCLUDED — Rule 8 (Separate activation) governs it more specifically, since starting the autonomous interval is the user's separate constitutive act, deliberately kept outside automatic coupling; the `/apportion → /conduct` edge relays only under a user-declared chain naming `/conduct` next, and carries Rule 9's no-reentry guard. Both seams govern only the transition BETWEEN protocols; every Constitution gate inside this protocol and the next fires unchanged, and the user can redirect at any turn.
24. **Whole-goal acceptance before an unaccepted plan**: A plan whose conditions carry no whole-goal acceptance criterion fires one conditional confirmation before the confirmation gate — define it now, route its definition to `/bound`, or proceed without one on record. The approval is recorded state, never an inference. Per-unit completion predicates do not satisfy this: they make each interval determinate without saying when the goal itself is accepted. A plan that already carries an acceptance condition adds zero gate load — the confirmation exists precisely where a goal would otherwise finish with nothing checking the whole. Every `DefineNow` retracts a stale `ApproveUnbounded` waiver still on record — not only when reached through `Adjust`, but on ANY firing of this gate: `ApproveUnbounded` never writes to the plan conditions, so a `Reopen` can leave `acceptance_present(P)` false and let this gate fire again later, reaching `DefineNow` with no `Adjust` on the path at all. Retracting unconditionally on `DefineNow` itself, rather than only inside `Adjust`'s branch, is what closes that second route — a plan never emits both a real acceptance condition and a stale unbounded waiver.
25. **Back-edge state preservation**: `Reopen` is the one path back into the apportionment loop from Phase 2. Only the reopened unit's own state resets — its obligations return to `residual`, its compiled conditions and residuals leave `K`/`R` with it, and its fit-override record (if any) leaves `Λ.fit_overrides` with it too: a fresh repack of its returned obligations gets a fresh `UnitRef` and, if it again overflows, needs its own `OverrideFit` recorded anew, exactly as any first-time cut would. Every other unit's already-derived conditions, and any whole-goal plan conditions already derived or user-adjusted, are carried forward UNCHANGED — never silently re-derived: `residual` is never re-seeded from the goal's full obligation set (that seeding is a one-time action on the Phase 0 → Phase 1 edge, never repeated), and `Derive`/`DerivePlan` never re-run over content a prior Phase 2 pass or a user's `Adjust` already produced. Carried forward unchanged is not the same as carried forward unexamined, though: `Reopen` also marks the whole-goal conditions stale for surfacing (`Λ.plan_conditions_stale`), because the unit set they were derived or adjusted against just changed under them — the next confirmation gate surfaces that as a notice rather than leaving it silently possibly wrong, and the user's own next `Adjust` clears it. A user's judgment, once recorded, survives a detour through the apportionment loop, and the plan-level conditions that outlive that detour are flagged for a look rather than assumed still correct.
