---
name: conduct
description: "Conduct the method of a session's epistemic work before object-level cognition begins. When a work prospect needs multiple cognitive moves whose order, independence, reconciliation, termination, and routing are non-trivial, design a conduct topology over the protocol graph and hand off a method plan with in-session checkpoints; single-move work relays to that one protocol instead of conducting. Type: (MethodUnderdetermined, Hybrid, CONDUCT, WorkProspect × ProtocolGraph) → ConductedMethod. Alias: Hyphegesis(ὑφήγησις)."
---

# Hyphegesis Protocol

Conduct how a session's epistemic work will be carried out — the order, independence, reconciliation, termination, and routing of its cognitive moves — when that method is underdetermined before object-level cognition begins. The morphism is **design THEN hand off**: Hyphegesis designs a conduct topology over the protocol graph and emits a method plan with in-session checkpoints, then stops; the substrate executes the moves. Type: `(MethodUnderdetermined, Hybrid, CONDUCT, WorkProspect × ProtocolGraph) → ConductedMethod`.

## Definition

**Hyphegesis** (ὑφήγησις: a leading-the-way, guiding from just ahead): A dialogical act of conducting a session's epistemic work — deciding how its multiple cognitive moves relate in order, independence, reconciliation, termination, and routing — when the method is underdetermined while the goal is clear. The protocol's lexical verb is `/conduct`. It activates only when the work needs two or more moves whose conduct is non-trivial (single-move work relays to that one protocol), designs the conduct topology impact-first — settling the highest-leverage axis·region first, each at its own gate — and registers an in-session checkpoint when a constitutive decision's evidence does not yet exist (synthesis output shape generally; cell membership in the decompose-recovery instance), surfaces substrate feasibility as a handoff annotation, compiles a decision-typed Recognition brief into every checkpoint, assembles a cross-cutting trace contract (its disclosure overlay over the five axes — residuals, degradations, coverage caps, never silent), and hands off a method plan that the substrate — not Hyphegesis — executes.

```
── FLOW ──
Hyphegesis(WP) → BindPlanInput(WP) → PI →
  [PI = LivePlan(plan, loc): bind_I(Some(plan)) ∧ Λ.carried_locator := loc |
   PI = Navigation(N): DereferencePlan(N) → (unreachable ∨ support-integrity failure: relay(handoff unreadable) (extension) → deactivate | E → ReadPlan(E) → plan → bind_I(Some(plan)) ∧ Λ.carried_locator := Some(N.canonical_locator)) |
   PI = NoPlan: bind_I(None)] → MethodBrief(WP) → guard[relay-test, anti-self-application] →
  [single-move ∨ trivial-conduct: relay-route(extension) → deactivate] |
  [multi-move ∧ non-trivial:
    Qc(brief, warrant) → continue →
    MoveId(WP × PG) → Sc(MoveSet) → MS →
    CT_default_surface → loop( AxisGate(impact-first axis·region) → Stop → VM → update(CT) → auto-advance ) until Sufficient → FinalizeTopology(CT, surfaced_axes) → (CT, residuals, topology_degradations) → AssignMoves(MS, CT) → move_assignment → RegisterCheckpoints(WP, CT) → checkpoints →
    [I ≠ None: BindUnitConditions(I, MS, move_assignment, CT) → BindPlanConditions(I, CT, move_assignment) → (divergent sound frontiers: InvalidateTopologyProducts → re-open the deciding axis·region → back to the AxisGate loop | proceed)] →
    SubstrateFeasibility(CT) → SH → AnnotateWithdrawals(withdrawn_units) → CarryPlan(I) → CompileCheckpointBrief(checkpoints, WP, CT, MS) → RecordDegradation(SH, CT) → degradations → AssembleTraceContract(residuals, degradations, coverage, termination grounds) → TC → converge(conduct trace incl. trace contract + checkpoint briefs + condition bindings) → ConductedMethod ]

── MORPHISM ──
WorkProspect × ProtocolGraph
  → resolve(plan_input)                      -- live /apportion plan binds directly; a navigation block is dereferenced and its emitted record read back into all five plan fields, its locator retained for the handoff; an unreadable or support-unsound handoff stops
  → brief(method, conduction_warrant)         -- infer the work prospect's method-brief; judge whether conduction is warranted
  → guard(relay_test, anti_self_application)  -- single-move work relays to that one protocol; Hyphegesis does not conduct Hyphegesis
  → identify(moves)                           -- candidate cognitive moves over the protocol graph, presented for Recognition (Rule 2)
  → select(moves)                             -- user confirms the move set via Cognitive Partnership Move (Constitution)
  → design(conduct_topology)                  -- impact/leverage-first: settle the highest-leverage axis·region first, each at its own gate; edge-local over move-regions; FinalizeTopology replaces the current pass's residual/degradation products, then checkpoint registration replaces the checkpoint set from the current CT + WP. Deferred decisions whose evidence does not exist yet register here
  → annotate(substrate_feasibility)           -- per resolved topology, surface substrate realizability as a handoff annotation
  → compile(checkpoint_briefs)                -- for every registered deferred decision, compile the decision-typed Recognition presentation contract the substrate executes there (structure, not content)
  → contract(trace_disclosure)                -- assemble the cross-cutting disclosure overlay: residuals + degradations + coverage caps + termination grounds (per until_goal_met region); surfaced, never silent
  → handoff(conducted_method)                 -- emit the method plan + in-session checkpoints, then stop (substrate executes)
  → ConductedMethod
requires: method_underdetermined(WP)           -- runtime checkpoint (Phase 0)
deficit:  MethodUnderdetermined                -- activation precondition (Layer 1/2)
preserves: WP                                  -- work prospect read-only
invariant: Conduction over Substrate

── TYPES ──
WP     = WorkProspect: the work or goal facing object-level cognition, with its method (conduct plan) not yet determined
PG     = ProtocolGraph: available protocols and move-neighbors (the dependency graph plus ad-hoc moves)
Move   = CognitiveMove { step: protocol invocation | analysis pass | delegation, unit_ref: Option(UnitRef) }
MS     = MoveSet: (WP × PG) → {Move₁ … Moveₙ}, n ≥ 2
A_s    = SelectionJudgment ∈ {Confirm(MS'), Withdraw(Set(UnitEntry)), Esc}
MethodBrief = AI-inferred summary of WP: { work_intent, expected_handoff, span }  -- span = invocation → the next planned /compact or /clear
Warrant = ConductionWarrant ∈ {warranted, relay}  -- warranted = moves ≥ 2 ∧ conduct non-trivial; relay = single-move ∨ trivial
MoveRegion = a contiguous sub-graph of moves sharing one conduct treatment; the partition over MS is an optional input carried into the topology and revised at the axis gate by Reorient, never derived here
axis   ∈ {order, independence, reconciliation, termination, routing}
  Gen(order)          ∈ {single_move (relay-only: trips the guard; never selected in Phase 2), sequential_chain, parallel_fan, dependency_dag}
  Gen(independence)   ∈ {isolated, shared}
  Gen(reconciliation) ∈ {aggregate, dialectic, adversarial_refute, synthesis}
  Gen(termination)    ∈ {single_pass, bounded_rounds, until_dry_ceiling, until_goal_met}
  Gen(routing)        ∈ {return_to_user, chain_to_next, handoff_to_protocol, deepen_on_finding, handoff_to_span}  -- handoff_to_span: the move/region output crosses the span wall to a future span that does not share this session's context
ResolvedValue⟨a⟩ = per-axis resolved value, axis-typed:
   ResolvedValue⟨reconciliation⟩ = Gen(reconciliation) ⊕ Compose(RVᵣ, RVᵣ, op)
   ResolvedValue⟨order⟩ = Gen(order);  ResolvedValue⟨independence⟩ = Gen(independence);  ResolvedValue⟨termination⟩ = Gen(termination);  ResolvedValue⟨routing⟩ = Gen(routing)
op     ∈ {⨾ sequential, ∥ parallel}             -- extensible at operator level
CT     = ConductTopology = Map(axis → Map(MoveRegion → ResolvedValue⟨axis⟩))
CT_default = ⟨order: sequential_chain, independence: isolated, reconciliation: synthesis, termination: bounded_rounds, routing: return_to_user⟩ over the single region "whole"  -- the per-axis Gen defaults. NORMALIZATION: the flat tuple is shorthand for Map(axis → {whole → value})
AxisGate = { axis, region, options, default, basis }
Checkpoint = { region: MoveRegion, decision: DeferredDecision, brief: Option(CheckpointBrief) }
DeferredDecision ∈ {SynthesisOutputShape} ∪ Emergent(DeferredDecision)  -- a non-axis decision whose deciding evidence exists only at the checkpoint
CheckpointSet = ordered Set(Checkpoint)  -- ordered by topology order between regions, with registration order breaking ties
CheckpointBrief = SynthesisBrief  -- open coproduct (one realization today); every realization presents pre-gate evidence refs, private-gap slots, and candidates with differential implications, each as Slot(T)
SynthesisBrief = { findings_ref: Map(Move → Slot(output_ref)), convergences: Slot(Set(finding)), divergences: Slot(Set(finding)), decision_axes: Slot(Set(decision_axis)), private_gap_slots: Set(GapSlot), fusion_candidates: Slot(Set(fusion_candidate)), output_shape_candidates: Slot(Set(OutputShape)) }  -- the Recognition presentation contract for SynthesisOutputShape
   Slot(T) = a typed placeholder compiled at design time and filled with T by the substrate at execution
   GapSlot = { category: a limit category the assigned move's protocol contracts to report, content: Slot(filled ∨ declined) }
OutputShape = the first-class unit the synthesis output is organized around  -- an open organizing unit, not an enum: the candidate space is never fixed in advance
checkpoint_set(WP, CT) = { Checkpoint(r, d, None) | r ∈ dom(CT[reconciliation]), d ∈ deferred_decisions(WP, CT, r) }
deferred_decisions(WP, CT, r) = the non-axis decisions this pass identifies for region r whose deciding evidence does not exist at design time and does exist at the checkpoint; SynthesisOutputShape ∈ it when CT[reconciliation][r] contains synthesis ∧ CT[routing][r] ∈ {return_to_user, handoff_to_span}
compile_checkpoint_brief(c, WP, CT, MS) = the CheckpointBrief realization c.decision calls for, compiled from current CT + MS; SynthesisOutputShape → SynthesisBrief
SH     = SubstrateHandoff = { feasibility: Map(MoveRegion → FeasibilityAnnotation), annotations: Set(HandoffAnnotation) }
FeasibilityAnnotation = { realizable: Bool, basis: String }  -- the per-region substrate-realizability verdict; basis cites the inventory evidence it rests on
HandoffAnnotation = OwedReapportionment(unit: UnitEntry, resolver: Resolver)   -- open coproduct (one constructor today)
owed_reapportionment(w) = HandoffAnnotation.OwedReapportionment(w, /apportion)
VM     = ConductMove ∈ {Select(value), Compose(via op), Reorient(axis), Sufficient}
         Sufficient = a MOVE in the axis gate → converge elicitation (user Constitution declaration)
ResidualAxis = { axis, region, status: DefaultBound, reason }
Degradation = { region: MoveRegion, kind ∈ {independence_relaxed, substrate_infeasible}, resolved_value, reason }  -- a surfaced acknowledgment that a resolved value relaxes an epistemic guarantee or cannot be realized
   kind ∈ {independence_relaxed, substrate_infeasible}
FinalizeTopology(CT_partial, surfaced_axes) = (CT, default_bound_residuals(CT, surfaced_axes), topology_degradations(CT)) where CT = { a ↦ { r ↦ (CT_partial[a][r] if (a,r) ∈ surfaced_axes else Gen(a)'s default) | r ∈ regions } | a ∈ {order, independence, reconciliation, termination, routing} }, regions = ⋃_{a∈dom(CT_partial)} dom(CT_partial[a]), or {whole} when that union is ∅
default_bound_residuals(CT, surfaced_axes) = { ResidualAxis{axis: a, region: r, status: DefaultBound, reason: "Sufficient bound the unsurfaced value to its Gen default"} | a ∈ dom(CT) ∧ r ∈ dom(CT[a]) ∧ (a, r) ∉ surfaced_axes }
topology_degradations(CT) = { Degradation{region: r, kind: independence_relaxed, resolved_value: shared, reason: current shared resolution} | CT[independence][r] = shared }
substrate_degradations(SH, CT) = { Degradation{region: r, kind: substrate_infeasible, resolved_value: CT-value, reason: SH.feasibility[r].basis} | r ∈ dom(SH.feasibility) ∧ SH.feasibility[r].realizable = False }
CoverageLimit = { region: MoveRegion, bound ∈ {top_n, no_retry, sampling, emergent}, dropped: prose-scope, reason }  -- a coverage cap the resolved topology imposes (what the method does NOT cover); dropped = the uncovered intra-region extent (prose)
Reference = { cites: String }   -- a locator naming WHERE the referenced content is recorded, resolvable by the executing substrate at runtime
ref(x) = Reference { cites: the locator naming x }   -- a CITATION of x — a pointer the executing substrate later dereferences and verifies at runtime — never a copy of x's compiled form
TerminationGround = { region: MoveRegion, ground ∈ {protocol_contract(ref), stated_condition(ref), resolution_required(resolver)} }  -- recorded per region whose termination resolved until_goal_met: the referenceable ground that makes "goal met" determinate. The constructors carry a fixed precedence (relay, never separately gated), resolved at assembly: the ground the incoming plan's own UnitConditionBinding CARRIED for this region; then the assigned protocols' own convergence contracts; else resolution_required as the fallback when no reference exists at all. Both resolution_required payloads follow `Resolver`'s own per-move rule, conjoined across the region's moves
TC     = TraceContract = { residuals: Set(ResidualAxis), degradations: Set(Degradation), coverage_limits: Set(CoverageLimit), termination_grounds: Set(TerminationGround) }  -- the method's cross-cutting disclosure overlay over CT
derived_coverage_limits(CT, unit_condition_bindings) = every CoverageLimit required by CoverageLimit's source→bound functor over CT (single_pass → no_retry; bounded_rounds or until_dry_ceiling → top_n; an intra-region sampling → sampling; any other imposed cap → emergent) ∪ {cl | ∃b∈unit_condition_bindings: b.disposition = executor_enforced(cl)}
derived_termination_grounds(CT, MS, move_assignment, I, unit_condition_bindings) = exactly one TerminationGround for each region in {r | (_, r) ∈ range(move_assignment)} whose resolved termination is until_goal_met, with ground selected by TerminationGround's deterministic precedence from the ground some b ∈ unit_condition_bindings with b.region = r carried as b.disposition = grounds_termination(g, _), the assigned protocols' convergence contracts, or the per-move resolution_required resolver payload. No other region contributes a ground
ConductedMethod = { topology: CT, move_assignment: Map(Move → ⟨order_position, region⟩), checkpoints: CheckpointSet, substrate_handoff: SH, trace_contract: TraceContract, unit_condition_bindings: Set(UnitConditionBinding), plan_condition_bindings: Set(PlanConditionBinding), carried_plan: Option(ConditionBearingUnitPlan), carried_locator: Option(HandoffLocator) }  -- the method PLAN; handed off (the substrate executes)  -- order_position = the move's slot in the order topology (Gen(order) shape); the per-region axis values (independence/reconciliation/termination/routing) are read from CT[axis][region]; carried_locator is what lets the executing substrate re-reach the canonical record a resolution_required ground points at

-- Consumed from merismos (see merismos/skills/apportion/SKILL.md TYPES for the canonical producer definition):
UnitRef        = a stable identity carried by an emitted unit, assigned at merismos integration; opaque to this protocol — never re-derived, only compared for equality
PredicateKind  ∈ {completion, invariant}
VerifiablePredicate = an executable check with a determinate pass/fail outcome. Opaque here: this protocol never evaluates one — it places WHERE it is evaluated (see satisfies)
Evidence       = { source: String, content: String }   -- where merismos observed what it cites; opaque here
Resolver       = the party, or conjunction of per-move parties, that owes an unresolved definition — an assigned move's own protocol, /apportion for a delegation move, or the user at execution for an in-session analysis pass
LeafConjunct   = { condition: VerifiablePredicate, kind: PredicateKind }
NonEmptySet(T) = { S: Set(T) | S ≠ ∅ }
CapabilityRequirement = a functional description of what realizing a unit requires — never a concrete executor, model, runtime or tool token; opaque here, read by the consuming runtime
FeasibilityNote = a free-text feasibility concern merismos read from the goal; opaque here
UnitResolution = DeterminateResolution { predicate: VerifiablePredicate, conjuncts: Set(LeafConjunct) } ⊎ AcceptedUncoveredResolution { accepted_completion_residuals: NonEmptySet(Obligation), conjuncts: Set(LeafConjunct) }  -- merismos's CROSS-SEAM TERMINATION CERTIFICATE, restated exactly. This protocol reads the constructor and predicate (see determinate_leaves) but never re-derives completion kind, acceptance evidence, or conjunct provenance
UnitEntry      = { unit_ref: UnitRef, subject: String, obligations: Set(Obligation), resolution: UnitResolution, capability_requirements: Set(CapabilityRequirement), feasibility_notes: Set(FeasibilityNote) }  -- restated with EVERY producer field
Obligation     = the coverage unit merismos apportioned; opaque here, carried for the consumer past this one
OOSDeclaration = { obligation: Obligation, substrate: String, basis: Evidence }
AcceptedResidualEntry = { obligation: Obligation, unit_ref: Option(UnitRef), kind: PredicateKind }
PlanStateRequirement = { predicate: VerifiablePredicate, basis: Set(Evidence) }  -- topology-free: contains no UnitRef, Move, MoveRegion, or order-position reference
PlanScope      ∈ {FinalIntegration, GlobalNonRegression, WholeGoalAcceptance} ∪ Emergent(PlanScope)
PlanEntry      = { scope: PlanScope, kind: PredicateKind, condition: VerifiablePredicate, dischargeable_when: PlanStateRequirement }
ConditionBearingUnitPlan = { units: Set(UnitEntry), plan_conditions: Set(PlanEntry), accepted_residuals: Set(AcceptedResidualEntry), oos: Set(OOSDeclaration), unbounded_approved: Bool }  -- the incoming artifact when WP originates from /apportion
PlanEnvelopeEntry = { accepted_residuals: Set(AcceptedResidualEntry), oos: Set(OOSDeclaration), unbounded_approved: Bool }
GoalEntry      = UnitEntry ⊎ PlanEntry ⊎ PlanEnvelopeEntry
E              = Set(GoalEntry)  -- the durable /apportion record set reached through a navigation block
N              = NavigationBlock { purpose_frame: String, canonical_locator: HandoffLocator, dereference_instruction: DereferenceInstruction, snapshot_anchor: Option(String), grounding_instruction: GroundingInstruction }  -- the fixed cross-session shape; a pointer, never a copied plan
HandoffLocator = { record: the durable identity of E, session: the id of the session that emitted E }
DereferenceInstruction = an instruction to read E at the canonical locator's record identity within the session that locator names
GroundingInstruction = the fixed instruction to run /inquire where available, or the recipient's equivalent grounding pass, and stop when a source is unreachable or a needed premise lacks support-integrity
PI             = PlanInput ∈ LivePlan(ConditionBearingUnitPlan × Option(HandoffLocator)) ⊎ Navigation(N) ⊎ NoPlan
ReadPlan(E)    = ConditionBearingUnitPlan { units: {e∈E | e is UnitEntry}, plan_conditions: {e∈E | e is PlanEntry}, accepted_residuals: envelope(E).accepted_residuals, oos: envelope(E).oos, unbounded_approved: envelope(E).unbounded_approved }  -- envelope(E) is E's unique PlanEnvelopeEntry
I              = Option(ConditionBearingUnitPlan)

determinate_leaves(r) = { d | v ∈ I.units, move_assignment placed UnitMoveBinding(v.unit_ref) in region r, DeterminateResolution { predicate: d, ... } = v.resolution }
UnitMoveBinding = total Map(UnitRef → Move)  -- DERIVED: { (m.unit_ref, m) | m ∈ MS, m.unit_ref ≠ None }
UnitConditionBinding = { unit_ref: UnitRef, move: Move, region: MoveRegion, disposition: UnitGroundDisposition }
UnitGroundDisposition =
    grounds_termination(g, uncited_conjuncts: Set(LeafConjunct))
      where g = stated_condition(ref(⋀ determinate_leaves(region)))   when determinate_leaves(region) ≠ ∅
              = resolution_required(/apportion)                       when determinate_leaves(region) = ∅
        and, for the unit v this binding names (v.unit_ref = the binding's unit_ref):
            uncited_conjuncts = v.resolution.conjuncts   when v.resolution is AcceptedUncoveredResolution
                              = ∅                          when v.resolution is DeterminateResolution
      -- the disposition when the region's resolved termination is until_goal_met
  ⊎ executor_enforced(CoverageLimit)
      -- the disposition when that region resolved to any other termination value
FiringSite     = TopologyFrontier(Set(MoveRegion)) ⊎ terminal ⊎ resolution_required(Resolver, Set(MoveRegion))  -- WHERE a plan condition becomes authoritative, expressed over the RESOLVED topology's regions  -- resolution_required(resolver, affected): no sound frontier exists for this condition's dischargeable_when
PlanConditionBinding = { plan_entry: PlanEntry, site: FiringSite }
completes(region, CT) ≡ every move CT assigns to region has reached the stop its region's resolved termination axis value defines — an until_goal_met region at its recorded TerminationGround
satisfies(site, req, CT) ≡ (site = resolution_required(_, _) ⟹ FALSE) ∧ (site = terminal            ⟹ ∀ region ∈ {r | (_, r) ∈ range(move_assignment)} : completes(region, CT) ∧ terminal is past every region, hence past every invalidator of req.predicate under CT) ∧ (site = TopologyFrontier(F) ⟹ F ⊆ {region | (_, region) ∈ range(move_assignment)} ∧ ∀ region ∈ F : completes(region, CT) ∧ ∀ region ∉ F reachable after F completes under CT's resolved order/dependency shape : ¬can_invalidate(region, req))
can_invalidate(region, req) ≡ some move CT assigns to region acts on what req.predicate reads, judged against req.basis. An AI judgment over the topology, surfaced with its basis at the binding, not a decidable structural test
resolution_resolver(affected) = the Resolver derived for the moves assigned to affected by TerminationGround's per-move precedence; multiple owners form the conjunction that must discharge the binding

── WP-BINDING ──
bind(WP) = explicit_arg ∪ colocated_expr ∪ prev_user_turn ∪ ai_identified_prospect
Priority: explicit_arg > colocated_expr > prev_user_turn > ai_identified_prospect

/conduct "text"              → WP = "text"
/conduct (alone)             → WP = the work prospect under discussion
"how should I approach..."   → WP = the work named before the trigger
AI-detected trigger          → WP = the multi-move prospect AI identified (Hybrid: user confirms at the Phase 0 guard gate)

PI (bound alongside WP) = LivePlan(plan, loc) when the /apportion plan is still a live value, loc being the
                          locator /apportion emitted beside it; Navigation(N) when the explicit argument,
                          colocated expression, or prior user turn carries Merismos's navigation block;
                          NoPlan only when neither carrier is present
I = LivePlan(plan, _) → Some(plan) | Navigation(N) → DereferencePlan(N) → ReadPlan(E) → Some(plan) |
    NoPlan → None. Either plan-bearing arm retains its locator as Λ.carried_locator — the live carrier's loc,
    or the one DereferencePlan read. DereferencePlan reads N.canonical_locator's record identity within the
    session that locator names; a locator missing either half is not dereferenceable. A failed dereference or
    support-integrity check stops and deactivates; it never selects None

── PHASE TRANSITIONS ──
Phase 0: WP → BindPlanInput(WP) → PI → [LivePlan(plan, loc): bind_I(Some(plan)) → retain_locator(track: Λ.carried_locator := loc) | Navigation(N): DereferencePlan(N) → (unreachable ∨ support-integrity failure: relay(handoff unreadable) → deactivate | E → ReadPlan(E) → plan → bind_I(Some(plan)) → retain_locator(track: Λ.carried_locator := Some(N.canonical_locator))) | NoPlan: bind_I(None)] → MethodBrief(WP) → guard[relay-test, anti-self-application] → warrant? → [warrant=relay: relay_route(extension) → deactivate | warrant=warranted: Qc(brief, conduction-warrant) → Stop → continue]   [Tool]
Phase 1: (WP, PG) → MoveId(WP × PG) → Sc(MoveSet) → Stop → A_s →                                                                      [Tool]
           A_s = Confirm(MS')      → [I ≠ None ∧ ¬(every unit_ref stamped anywhere in MS' is stamped by exactly one move of MS' ∧ every u ∈ I.units has its unit_ref stamped in MS' or already recorded in withdrawn_units): re-present Sc naming the units with more than one stamped move, and the units with none — NOT accepted | MS := MS' →
                                       [|MS| = 1 ∧ withdrawn_units = ∅: relay-route to the surviving move's protocol, deactivate
                                       | |MS| = 1 ∧ withdrawn_units ≠ ∅: PresentOwedReapportionment(withdrawn_units) → relay-route to the surviving move's protocol AND present {owed_reapportionment(w) | (w, r) ∈ withdrawn_units} directly in that same relay text
                                       | |MS| = 0 ∧ withdrawn_units = ∅: relay(no move survives — nothing to conduct or route to), deactivate
                                       | |MS| = 0 ∧ withdrawn_units ≠ ∅: PresentOwedReapportionment(withdrawn_units) → present {owed_reapportionment(w) | (w, r) ∈ withdrawn_units} as the relay text, deactivate
                                       | Phase 2]]
           A_s = Withdraw(units)   → Λ.withdrawn_units ∪= { (u, u.unit_ref) | u ∈ units }
                                     ; I := I with those units removed from I.units, every accepted_residual whose unit_ref is now dangling re-pointed to None, and every plan condition retained
                                     → re-present Sc over the reduced plan
           A_s = Esc               → deactivate (loop termination at LOOP level)
Phase 2: MS → CT_default_surface(extension: present CT_default + basis as pre-gate text) → loop( AxisGate(next axis·region, impact/leverage-first — most-constrained first: default + basis + per-value differential implications; [reconciliation axis ONLY: + ⨾/∥ composites + affordance]) → Stop → VM ∈ {Select | Compose(reconciliation only) | Reorient | Sufficient} → update(CT, surfaced_axes) → [VM=Sufficient: exit | last axis·region surfaced ∧ ¬Sufficient: implicit-Sufficient(relay) | else: auto-advance(relay) to next axis·region] ) until Sufficient ∨ all-axes-resolved → FinalizeTopology(track: replace CT + residuals + topology-derived degradations) → AssignMoves(track: replace move_assignment) → RegisterCheckpoints(track: replace checkpoints from checkpoint_set(WP, CT)) → [I ≠ None: BindUnitConditions(track: replace) → BindPlanConditions(track: replace) → (materially-divergent sound frontiers for some plan condition p: InvalidateTopologyProducts(track) → record (p, deciding pair) in reopened_divergences → re-open that axis·region → back into the axis loop above, bounded by the same Sufficient/Esc agency | else proceed)] → converge(topology trace)   -- the first AxisGate always yields the turn; silence carries Stop and selects no topology [Tool]
Phase 3: CT → SubstrateFeasibility(extension) → SH → AnnotateWithdrawals(track) → CarryPlan(track) → CompileCheckpointBrief(track) → RecordDegradation(track) → AssembleTraceContract(track) → TC → converge(conduct trace incl. trace contract + checkpoint briefs + condition bindings) → handoff(ConductedMethod) → deactivate   [Tool]

── LOOP ──
After Phase 0 (Method Brief + Warrant):
  warrant = relay     → relay-route to the single resolving protocol, emit it as the routing, deactivate (conduction not needed)
  warrant = warranted → Phase 1 → Phase 2 → Phase 3
  -- Esc key → terminate (no plan emitted)

During Phase 2 (Conduct Design — topology elicitation):
  Entry surface: present CT_default + basis as pre-gate relay text, then open the first AxisGate and yield. The default is a surfaced candidate, not an Extension-selected method; silence carries Stop. Selecting Sufficient at this first gate is the explicit user path that binds the remaining axes to their Gen defaults.
  Each cycle surfaces the single most decision-relevant UNSURFACED axis·region by impact/leverage — the most-constrained axis first (the one whose values most divide the downstream conduct-plans), NOT a fixed order. Every surfaced axis·region is settled at its own gate this cycle — Select, Compose, or Reorient — or left to its Gen default when the loop ends by Sufficient. A decision defers past design time only when its deciding evidence does not yet exist; such a decision never enters this loop as a Gen-typed axis, and registers through the generic Checkpoint record after topology finalization. Each move integrates one ConductMove and updates MODE STATE:
    VM = Select(value)  → record axis·region → Gen(value) in CT; surfaced_axes ∪= {(axis, region)}; auto-advance to next axis·region
    VM = Compose(op)    → [reconciliation axis ONLY] record reconciliation → Compose(RVᵣ, RVᵣ, op) in CT; surfaced_axes ∪= {(reconciliation, region)}; auto-advance
    VM = Reorient(axis) → remove the (axis, region) pair from surfaced_axes and CT[axis][region], re-surface the reframed (axis, region) (does NOT auto-advance)
    VM = Sufficient     → exit elicitation → FinalizeTopology fills every unresolved axis·region with its Gen default and REPLACES Λ.residuals with exactly one DefaultBound ResidualAxis per final-CT value that remains unconstituted
    EXHAUSTION (all axis·regions surfaced ∧ ¬Sufficient) → implicit Sufficient (relay): exit with the now-complete CT → FinalizeTopology replaces Λ.residuals with ∅
  BOUND: the loop is bounded by user agency — the user's Sufficient move or Esc-Stop terminates it. The seed axis set is FINITE, so each unsurfaced axis·region auto-resolves to its Gen default, and the finite set guarantees a terminal.
  Checkpoint registration (track — deterministic, never gated): RegisterCheckpoints REPLACES Λ.checkpoints with checkpoint_set(WP, CT) after every FinalizeTopology pass.
  Condition binding (only when I ≠ None — an incoming /apportion plan; track, deterministic except for the one back-edge below). Once CT resolves, UnitMoveBinding is read off MS directly and BindUnitConditions REPLACES its set with one current binding per unit. BindPlanConditions likewise computes one complete replacement set over the current plan and topology. BACK-EDGE: when several sound frontiers carry materially different downstream futures, InvalidateTopologyProducts first clears every topology-derived output (residuals, topology-derived degradations, assignment, checkpoints, and both binding sets); only then is the deciding axis·region removed from surfaced_axes/CT, recorded in reopened_divergences AS THE TRIGGERING PLAN CONDITION PAIRED WITH THAT PAIR — (p, axis, region), never the pair alone — and re-surfaced. The loop re-enters at that gate, bounded by the same Sufficient/Esc agency. On exit, FinalizeTopology, AssignMoves, RegisterCheckpoints, BindUnitConditions, and BindPlanConditions all REPLACE their products from the revised CT before Phase 3 is reachable.
  converge(topology trace) → Phase 3. Esc key → tool-level termination (no plan emitted).

After Phase 3 (Handoff):
  Hyphegesis conducts to the LAST checkpoint in CheckpointSet, then downstream-delegates — execution and anything past the last in-session checkpoint belong to the substrate or to the routed protocol. The span ends at the next planned /compact or /clear, which the user types; Hyphegesis does not detect or emit that wall.
  A checkpoint may re-open Constitution mid-execution.
  At a checkpoint, the substrate executes the compiled CheckpointBrief. At a synthesis checkpoint the two candidate sets carry a normative order: when both are live the output-shape decision resolves first and the fusion candidates are expressed in the selected unit. Hyphegesis compiles this contract; the substrate performs it.
Continue until convergence: warrant=relay deactivation, ConductedMethod handed off, or user Esc key.

Convergence evidence: At handoff, present every withdrawn incoming unit with the resolver that owes its re-apportionment (∅ when none were withdrawn), and — when the carried plan carries a WholeGoalAcceptance condition — a visible note that its count-based discharge is permanently blocked for THIS plan — and, for every OTHER retained plan condition (non-count-scoped), a caveat that its /apportion-compiled basis predates this withdrawal and this protocol's binding of it here is not a re-validation of that basis — AND the per-move trace — for each Move, show (Move → its ⟨order_position, region⟩ in CT) — AND the per-axis topology trace — for each resolved axis·region, show (axis·region → ConductMove → value, default-bound → Gen default + DefaultBound) — AND the SubstrateHandoff annotations and the exact current-pass CheckpointSet (with every checkpoint's decision-typed compiled CheckpointBrief) — AND, when I ≠ None, the condition-binding trace: each incoming unit's UnitConditionBinding (unit_ref → move/region → the termination ground it now grounds, plus any uncited invariant conjuncts that ground carries) and each incoming plan condition's PlanConditionBinding (plan_entry → its resolved FiringSite, or resolution_required when no sound frontier exists) — AND the trace contract: the cross-cutting disclosure overlay (every final-pass residual, every degradation, every coverage cap the topology imposes, and every until_goal_met region's termination ground — a resolution_required ground shown with its owed resolver), never silent. Convergence is demonstrated, not asserted.

── CONVERGENCE ──
conducted(WP) = dom(move_assignment) = MS
              ∧ [ (c.region, c.decision) | c ∈ checkpoints in CheckpointSet's declared order ]
                  = [ (c.region, c.decision) | c ∈ checkpoint_set(WP, CT) in that same order ]
              ∧ (∀c∈checkpoints:
                   c.brief = Some(compile_checkpoint_brief(c, WP, CT, MS)))
              ∧ substrate_handoff ≠ None
              ∧ residuals = default_bound_residuals(CT, surfaced_axes)
              ∧ degradations = topology_degradations(CT)
                                   ∪ substrate_degradations(substrate_handoff, CT)
              ∧ trace_contract ≠ None
              ∧ trace_contract.residuals = residuals
              ∧ trace_contract.degradations = degradations
              ∧ trace_contract.coverage_limits = derived_coverage_limits(CT, unit_condition_bindings)
              ∧ trace_contract.termination_grounds = derived_termination_grounds(CT, MS, move_assignment, I, unit_condition_bindings)
              ∧ (∀b ∈ unit_condition_bindings: b.disposition = grounds_termination(g, _) →
                   ∃! tg ∈ trace_contract.termination_grounds : tg.region = b.region ∧ tg.ground = g)   -- the overlay and the per-unit bindings report the SAME ground for a region, never two
              ∧ carried_plan = I
              ∧ carried_locator = Λ.carried_locator
              ∧ (I ≠ None → ∀(w, r) ∈ withdrawn_units: r ∉ {u.unit_ref | u ∈ I.units}
                                       ∧ owed_reapportionment(w) ∈ substrate_handoff.annotations)
              ∧ (I = None → withdrawn_units = ∅)
              ∧ (I ≠ None →
                   (∀u ∈ I.units: ∃! b ∈ unit_condition_bindings :
                        b.unit_ref = u.unit_ref
                      ∧ b.move = UnitMoveBinding(u.unit_ref)
                      ∧ (_, b.region) = move_assignment(b.move)
                      ∧ (b.disposition = grounds_termination(g, uc)
                           ⟺ CT[termination][b.region] = until_goal_met)
                      ∧ (b.disposition = grounds_termination(g, uc) →
                           (determinate_leaves(b.region) ≠ ∅ → g = stated_condition(ref(⋀ determinate_leaves(b.region))))
                         ∧ (determinate_leaves(b.region) = ∅ → g = resolution_required(/apportion))
                         ∧ (u.resolution is AcceptedUncoveredResolution → uc = u.resolution.conjuncts)
                         ∧ (u.resolution is DeterminateResolution → uc = ∅))
                      ∧ (b.disposition = executor_enforced(cl) → cl ∈ trace_contract.coverage_limits))
                 ∧ (∀p ∈ I.plan_conditions: ∃! b ∈ plan_condition_bindings :
                        b.plan_entry = p ∧ ((b.site = resolution_required(resolution_resolver(affected), affected)
                                             ∧ affected = {r | (_, r) ∈ range(move_assignment) ∧ can_invalidate(r, p.dischargeable_when)}
                                             ∧ affected ≠ ∅
                                             ∧ (¬∃ S : satisfies(S, p.dischargeable_when, CT)
                                                ∨ (∃ (a, r) : (p, (a, r)) ∈ reopened_divergences ∧ the resolved CT value at
                                                     (a, r) is what makes p's OWN sound sites {S | satisfies(S,
                                                     p.dischargeable_when, CT)} hold ≥2 members with materially different
                                                     downstream futures — an AI judgment over the topology, as can_invalidate is))
                                             ∨ (satisfies(b.site, p.dischargeable_when, CT)
                                                ∧ ¬∃ S₂ : satisfies(S₂, p.dischargeable_when, CT) ∧ S₂ ≠ b.site
                                                          ∧ S₂ is no later than b.site over FiringSite, not over region sets
                                                            alone — both frontiers: every region of S₂ completes no later than
                                                            every region of b.site under CT's resolved order; S₂ a frontier and
                                                            b.site terminal: TRUE; S₂ terminal: TRUE only when b.site is
                                                            terminal; either side resolution_required: FALSE))))
              ∧ (I ≠ None → ∀b ∈ unit_condition_bindings: ∃u ∈ I.units: b.unit_ref = u.unit_ref)
              ∧ (I ≠ None → ∀b ∈ plan_condition_bindings: b.plan_entry ∈ I.plan_conditions)
              ∧ (I = None → unit_condition_bindings = ∅ ∧ plan_condition_bindings = ∅)
-- The ConductedMethod value this invocation constructs and, on convergence, hands off is well-formed exactly when conducted(WP) holds.

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 BindPlanInput (sense)        → Internal analysis (classify the incoming carrier as LivePlan, Navigation, or NoPlan; on the LivePlan arm also read the locator the carrier supplies beside the plan, None when it supplies none)
Phase 0 DereferencePlan (observe)    → TaskGet, Read (when PI = Navigation(N): follow N.dereference_instruction at N.canonical_locator — reading its record identity within the session that locator names — honor its snapshot anchor when present, and run the grounding instruction; an unreachable source, an absent session half, or an unsupported load-bearing premise surfaces handoff unreadable and deactivates)
Phase 0 ReadPlan (sense)             → Internal analysis (read E exactly as ReadPlan(E) defines; no field comes from session memory)
Phase 0 bind_I (track)               → Internal state update (write Λ.incoming_plan from the resolved carrier: Some(live plan), Some(ReadPlan(E)), or None only for explicit NoPlan)
Phase 0 retain_locator (track)       → Internal state update (write Λ.carried_locator on either plan-bearing arm: the locator the live carrier supplied beside the plan, or Some(N.canonical_locator) after a successful dereference)
Phase 0 MethodBrief (sense)           → Internal analysis (infer the work prospect's method-brief + span from the session)
Phase 0 guard (sense)                 → Internal analysis (relay-test: single-move ∨ trivial-conduct → relay; anti-self-application; no Λ mutation)
Phase 0 relay_route (extension)       → TextPresent+Proceed (single-move resolution: route to that one protocol as the recommendation, deactivate)
Phase 0 Qc (constitution)             → present (conditional: warrant=warranted only — the guard decides warrant before this gate opens; work prospect confirmation + conduction-warrant; relay-test result as pre-gate text; Esc key → loop termination at LOOP level)
Phase 1 MoveId (observe)              → Read, Grep, Glob (the dependency graph + session context to identify candidate moves; when I ≠ None, every move derived from an incoming UnitEntry is STAMPED with that unit's unit_ref, and a unit for which no move is identified is surfaced here)
Phase 1 Sc (constitution)            → present (MoveSet confirmation; multiSelect: true; Esc key → loop termination at LOOP level. When I ≠ None, a deselection that would leave some I.units entry with no stamped move is surfaced BEFORE the selection is accepted, naming the units it would strand. The user resolves it in the same gate via A_s: Confirm(MS') restores the move set, Withdraw(units) removes those units from I and records them in Λ.withdrawn_units as an owed re-apportionment, then re-presents over the reduced plan)
Phase 1 no-survivor relay (extension) → TextPresent+Proceed (|MS| = 0 ∧ withdrawn_units = ∅ sub-case of A_s = Confirm: no move — and no protocol — survives to route to; present that finding directly and deactivate)
Phase 1 PresentOwedReapportionment (extension) → TextPresent+Proceed (fires on the |MS| < 2 ∧ withdrawn_units ≠ ∅ relay exit at A_s = Confirm: present {owed_reapportionment(w) | (w, r) ∈ Λ.withdrawn_units}. At |MS| = 1 this rides in the SAME relay text that routes to the surviving move's protocol; at |MS| = 0 this presentation IS the relay text on its own)
Phase 2 CT_default_surface (extension) → TextPresent+Proceed (present CT_default + basis as pre-gate relay context, then proceed only to AxisGate; it selects no topology value)
Phase 2 AxisGate (constitution)       → present (always opens on Phase 2 entry for warranted work; single axis·region gate, impact/leverage-first: default + basis + per-value differential implications; reconciliation axis ONLY additionally surfaces ⨾/∥ composites + a one-line affordance; moves {Select | Compose(reconciliation) | Reorient | Sufficient}; Stop holds on silence; Esc key → loop termination at LOOP level)
Phase 2 FinalizeTopology (track)      → internal Λ replacement (fill every unresolved axis·region with its Gen default; replace Λ.topology with the complete CT, Λ.residuals with exactly default_bound_residuals(CT, surfaced_axes), and Λ.degradations with topology_degradations(CT))
Phase 2 RegisterCheckpoints (track)   → internal Λ replacement (write Λ.checkpoints := checkpoint_set(WP, CT) on every finalized topology pass: one checkpoint per deferred decision the pass identifies for a region)
Phase 2 converge (extension)          → TextPresent+Proceed (topology trace: per resolved axis·region → ConductMove → value, default-bound → Gen default + DefaultBound disposition; every registered checkpoint appears brief-less here — briefs compile at Phase 3)
Phase 3 SubstrateFeasibility (extension) → TextPresent+Proceed (per resolved MoveRegion, compute and SURFACE a FeasibilityAnnotation{realizable, basis} as pre-gate relay text; for a routing=handoff_to_span region, realizable/basis is exactly the proposed durable record surface or its absence; an extension op surfaces only — it does NOT mutate Λ)
Phase 2 AssignMoves  (track)             → internal Λ replacement (PLACE every selected move from the current CT's order and region shape and REPLACE Λ.move_assignment with that exact map. This produces dom(move_assignment) = MS)
Phase 2 BindUnitConditions (track)       → internal Λ replacement (when I ≠ None: derive UnitMoveBinding directly from MS — { (m.unit_ref, m) | m ∈ MS, m.unit_ref ≠ None } — then REPLACE Λ.unit_condition_bindings with one entry per current unit. Read the MoveRegion move_assignment placed that move in and set the disposition by that region's RESOLVED termination value: until_goal_met → grounds_termination(g, uncited_conjuncts), where g = stated_condition(ref(⋀ determinate_leaves(b.region))) when determinate_leaves(b.region) ≠ ∅ — one ground per region, never one unit's predicate standing for the region — or g = resolution_required(/apportion) when determinate_leaves(b.region) = ∅; AND, on the SAME binding, uncited_conjuncts := this unit's own resolution.conjuncts when its resolution is AcceptedUncoveredResolution (∅ when Determinate, since determinate_leaves(b.region) already folded those into g). The executing substrate enforces every unit's uncited_conjuncts inside that unit's own interval. Any other termination value → executor_enforced carrying the CoverageLimit that records the uncovered extent. When I = None, this step does not run and unit_condition_bindings stays ∅)
Phase 2 BindPlanConditions (track)       → internal Λ replacement (when I ≠ None: compute one complete replacement set with exactly one binding per incoming PlanEntry, using the EARLIEST satisfying frontier and terminal only when no earlier frontier does. On materially divergent sound frontiers, run InvalidateTopologyProducts BEFORE recording/re-opening the deciding axis·region; no partial replacement is committed. If that p-specific pair was already reopened, or no sound site exists, record the typed resolution_required fallback under its convergence guards. When I = None, this step does not run and plan_condition_bindings stays ∅)
Phase 2 InvalidateTopologyProducts (track) → internal Λ reset (before the only back-edge: clear residuals, topology-derived degradations, move_assignment, checkpoints, unit_condition_bindings, and plan_condition_bindings; preserve historical/bounding state)
Phase 3 AnnotateWithdrawals (track)      → internal Λ update (the FIRST write to Λ.substrate_handoff: MATERIALIZE Λ.substrate_handoff := Some(SH), folding SubstrateFeasibility's same-turn per-region verdicts into SH.feasibility and, for every (w, r) ∈ Λ.withdrawn_units, attaching owed_reapportionment(w) into SH.annotations (∅ when no unit was withdrawn))
Phase 3 CarryPlan (track)                → internal Λ update (when I ≠ None: copy I AS IT STANDS AT THIS POINT into Λ.carried_plan UNREAD and UNCHANGED, field-by-field. A withdrawn unit is not copied here — it already left I at Phase 1 Sc — and rides separately as an owed_reapportionment annotation on substrate_handoff. When I = None, carried_plan stays None. Λ.carried_locator is carried onto the handoff artifact beside carried_plan, unread and unchanged)
Phase 3 CompileCheckpointBrief (track)   → internal Λ update (for every c in the current registry, write c.brief := Some(compile_checkpoint_brief(c, WP, CT, MS)). SynthesisOutputShape receives SynthesisBrief's findings/convergence/divergence/private-gap/fusion/output-shape slots — a presentation contract of structure only, never a copy of execution content)
Phase 3 RecordDegradation (track)        → TaskUpdate/internal Λ update (write the current substrate_degradations(substrate_handoff, CT) beside the topology_degradations(CT) FinalizeTopology produced, yielding their exact union)
Phase 3 AssembleTraceContract (track)    → internal Λ update (ASSEMBLE the cross-cutting disclosure overlay: populate Λ.trace_contract from Λ.residuals + Λ.degradations + derived_coverage_limits(CT, unit_condition_bindings) + derived_termination_grounds(CT, MS, move_assignment, I, unit_condition_bindings); an INVARIANT aggregation, never gated)
Phase 3 surface trace contract (extension) → TextPresent+Proceed (surface the trace contract in the convergence trace: every residual, degradation, coverage cap, and termination ground (a resolution_required ground names its owed resolver); relay only — it does NOT mutate Λ)
Phase 3 surface checkpoint briefs (extension) → TextPresent+Proceed (surface each compiled CheckpointBrief in the convergence trace; follows degradation recording, so a brief demoted to advisory is surfaced with that demotion visible; relay only — it does NOT mutate Λ)
Phase 3 handoff (dispatch)            → Agent (hand the ConductedMethod plan to the substrate; the substrate executes — execution is out of scope; this dispatch is the plan's own handoff witness)
Λ (track)                             → TaskCreate/TaskUpdate (work prospect + framing shifts durable; per-axis bookkeeping stays in session)
Seam transition to declared next protocol (extension) → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol, or a composition edge this SKILL.md declares, settles the next move; proceed directly to it, citing that settling source; every Constitution gate inside this protocol and inside the next protocol fires unchanged. A routing=handoff_to_span region names no next protocol: its seam declares an externalization obligation the executing substrate discharges by writing the output to a substrate-owned record, and the future span receives a navigation block over that record in the fixed shape Rule 19 declares)
-- Substrate realization: at the Phase 3 seam, read the session's actually-loaded inventory — its agents, skills, MCP servers, and the tools/system-prompt each exposes — and propose realizable substrates from that live inventory rather than a fixed list; the inventory is the authority. Topology→substrate feasibility is a non-epistemic substrate handoff: the protocol surfaces feasibility, the substrate enforces realizability. A routing = handoff_to_span region requires a durable record surface its output can be externalized to across the span wall, proposed as the bridge substrate at this seam. Surface feasibility per resolved topology value as a delegated handoff annotation (extension: surface only); when the read inventory cannot realize the resolved topology — including no realizable durable record surface for a handoff_to_span region — record a substrate_infeasible degradation (track: the Λ.degradations mutation). The (constitution)/(extension)/(track) markers above remain the authoritative axis.

── MODE STATE ──
Λ = { phase: Phase, work_prospect: Option(WP), incoming_plan: I, protocol_graph: Option(PG), move_set: Option(MS), topology: Option(CT), surfaced_axes: Set(axis × MoveRegion), checkpoints: CheckpointSet, substrate_handoff: Option(SH), residuals: Set(ResidualAxis), degradations: Set(Degradation), move_assignment: Map(Move → ⟨order_position, region⟩), withdrawn_units: Set(UnitEntry × UnitRef), reopened_divergences: Set(PlanEntry × (axis × MoveRegion)), unit_condition_bindings: Set(UnitConditionBinding), plan_condition_bindings: Set(PlanConditionBinding), carried_plan: Option(ConditionBearingUnitPlan), carried_locator: Option(HandoffLocator), trace_contract: Option(TraceContract), active: Bool, cause_tag: String }
   -- residuals, the Phase-2 independence degradations, move_assignment, checkpoints, and both binding sets are
   --   PRODUCTS OF ONE TOPOLOGY MATERIALIZATION PASS, never cross-pass accumulators; only
   --   reopened_divergences and withdrawn_units are historical across a full pass. surfaced_axes is edited at
   --   single (axis, region) granularity by Select/Compose/Reorient and by the back-edge.
   -- trace_contract stays None until Phase 3 assembles it.
   -- incoming_plan (I) is bound alongside work_prospect at Phase 0 (see WP-BINDING).
   -- substrate_handoff is written ONCE, by Phase 3 AnnotateWithdrawals; it stays None on any path that
   --   deactivates before Phase 3.
Phase ∈ {0, 1, 2, 3}

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). registered dependency edges preserved. Dimension resolution emergent via session context.
```

## Core Principle

**Conduction over Substrate**: When a session's epistemic work needs several cognitive moves whose order, independence, reconciliation, termination, and routing are non-trivial, the method of conducting them is underdetermined before object-level cognition begins — and that gap is substrate-invariant. Hyphegesis designs that method as a conduct topology over the protocol graph and hands off a plan; it does not execute the moves, and it never binds a substrate it cannot realize — when realizability fails it declares conduction-degradation, surfacing every relaxed guarantee, infeasibility, and coverage cap in the method's cross-cutting trace contract.

## Mode Activation

### Activation

**Pre-activation routing**: The Phase 0 relay-test guard precedes activation, deciding whether to accept a `/conduct` invocation at all.

Command invocation activates mode until the conduct plan is handed off.

**Activation layers**:
- **Layer 1 (User-invocable)**: `/conduct` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: A multi-move work prospect detected via in-protocol heuristics, where the conduct (order, independence, reconciliation, termination, routing) is non-trivial. The AI-detected path requires user confirmation at the Phase 0 guard gate (Hybrid initiator).

### Priority

<system-reminder>
When Hyphegesis is active:

**Supersedes**: Direct execution patterns that begin object-level work before the method is conducted
(Conduct design must complete before the conducted moves begin)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: Before the conducted work begins, present the conduct topology — impact-first, one axis·region at a time — via Cognitive Partnership Move (Constitution).
</system-reminder>

- Hyphegesis completes (hands off the plan) before the conducted moves begin
- Loaded instructions resume after the method is conducted

### Triggers

| Signal | Detection |
|--------|-----------|
| Multi-move, non-trivial conduct | A work prospect needs two or more moves whose order, independence, reconciliation, termination, or routing genuinely divides the downstream plan — more than one conduct-plan with a materially different downstream future exists |
| Method-level meta-question | The user asks "how should I approach this whole thing?" rather than asking a single object-level question |
| Migration / multi-stage investigation | Staged work where stages depend on each other and the dependency structure is itself a decision |
| Decompose recovery (wrong-fusion repair) | `/ground` self-grounding returns a **Split** partition reading (≥2 non-empty cells) — the repair is multi-move and its conduct is the decompose-recovery recipe. A **Trim** reading (≤1 non-empty cell) is single-move (`/induce` Narrow or Reorient) and does not warrant conduction |

**Qualifying condition**: Activate only when the method is genuinely underdetermined and multi-move. Large work scope or budget is *auxiliary* evidence that reinforces a multi-move trigger; it never triggers conduction on its own.

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Warrant = relay | Route to the single resolving protocol, deactivate (conduction not needed) |
| Phase 1 selection leaves exactly one move | Route to that surviving move's protocol, surface any owed withdrawal, deactivate |
| Phase 1 selection leaves zero moves | Surface that no move survives plus any owed withdrawal; name no protocol route, deactivate |
| ConductedMethod handed off | Emit the plan + checkpoints, hand off to the substrate, deactivate |
| User Esc key | Return to normal operation; no plan emitted |

## Protocol

### Phase 0: Method Brief and Conduction Warrant

First bind the optional incoming `/apportion` plan. A live plan binds directly; a supplied navigation block is dereferenced at its canonical locator and the durable record is read back into all five plan fields before `I` is bound. If the source is unreachable or a load-bearing premise lacks support-integrity, surface that failure and stop. Dereferencing keeps the locator rather than spending it: this is the only phase where it is in scope, and the handoff carries it so the executing substrate can re-reach the same record the plan came from.

Construct a Method Brief from the work prospect and run the relay-test guard first. Only when the guard finds the work warranted (two or more moves, non-trivial conduct) does Phase 0 **present** the Method Brief for confirmation, together with the conduction-warrant judgment, via Cognitive Partnership Move (Constitution); a relay-test verdict of relay routes to the single resolving protocol and deactivates without opening this gate.

The Method Brief infers, from the work prospect:
- **Work intent**: what is to be accomplished and why
- **Expected handoff**: what the conducted method should produce before the substrate takes over
- **Span**: from this invocation (session start *or* mid-session) to the next planned `/compact` or `/clear`.

**Guard (relay-test)** runs before the gate and is shown as pre-gate text:
- If the work resolves through a single move or a single protocol — conduction entropy → 0, the method is self-evident — present that one protocol as a relay route and **deactivate**. Conduction is not warranted.
- **Anti-self-application**: Hyphegesis does not conduct Hyphegesis. The moves in a conduct plan are object-level protocols or analyses, never another conduction.

### Phase 1: Move Identification

Identify the candidate cognitive moves over the protocol graph, then **present** the move set via Cognitive Partnership Move (Constitution) as a multi-select confirmation.

Read the dependency graph and the session to surface candidate moves (protocol invocations, analysis passes, delegations). Each move is an object-level step. The user confirms or edits the set. Two or more surviving moves proceed to conduct design; exactly one relay-routes to that move's protocol; zero relays that nothing survives and names no route. Any recorded withdrawal is surfaced on either sub-two exit.

**Cross-session enrichment**: Prior session indices from the hypomnesis store (prior-session recall indices), when present, may seed Phase 1's candidate move set; the constitutive judgment remains with the user.

### Phase 2: Conduct Design (Topology Elicitation)

Conduct Design establishes *how* the selected moves relate — the **conduct topology** across five axes: order, independence, reconciliation, termination, routing.

**Default surface**: On entering Phase 2, first present `CT_default` and its basis as pre-gate relay text, then always open the first axis gate (Constitution) and yield. The relay surface may recommend the default but cannot select it; silence carries `Stop`. A user accepts the remaining defaults by choosing **Sufficient** at that gate.

**Elicitation cycle (impact/leverage-first)**: When the user engages refinement, each cycle surfaces the single most decision-relevant **unsurfaced** axis·region — the most-constrained axis first (the one whose values most divide the downstream conduct-plans), not a fixed sequence. Every surfaced axis·region is settled at its own gate this cycle (Select, Compose, or Reorient), or left to its Gen default once the loop ends by Sufficient.

Each axis has a defined downstream effect:
- **order** shapes the move sequence (`single_move`, `sequential_chain`, `parallel_fan`, `dependency_dag`),
- **independence** prevents synthesis-contamination (`isolated` before reconciliation; `shared` relaxes it and records an `independence_relaxed` degradation),
- **reconciliation** combines separately-produced results (`aggregate`, `dialectic`, `adversarial_refute`, `synthesis`) — the only composable axis (⨾/∥),
- **termination** sets the epistemic stop criterion (`single_pass`, `bounded_rounds`, `until_dry_ceiling`, `until_goal_met`) — an `until_goal_met` region additionally records a topology-level termination ground (see `TerminationGround`): a reference to what makes "goal met" determinate, or `resolution_required` naming the downstream resolver; `/conduct` records the ground, never compiles the predicate,
- **routing** sends each move's output onward (`return_to_user`, `chain_to_next`, `handoff_to_protocol`, `deepen_on_finding`, `handoff_to_span`).

**Cross-span routing (`handoff_to_span`)**: `handoff_to_span` is the one routing value whose output crosses the **span wall** to a future span (post `/compact`, `/clear`, or a new session) that does not share this session's context. It carries an **externalization obligation** that `/conduct` does not discharge itself: it **declares that obligation in the handoff annotation** at the Phase 3 seam. The executing substrate externalizes the output to a substrate-owned record at execution time, and the future span receives a navigation block over that record in the fixed shape Rule 19 declares, rather than a re-authored copy of its contents. This is a **design-time** routing judgment, selected when the method brief's expected handoff names a future-span consumer, never a runtime detection of the wall. The far-side compile-back is outside `/conduct`'s scope.

**Edge-local axes**: when `order` is `dependency_dag`, independence/reconciliation/routing/termination are non-uniform across the move set — each region may resolve these axes differently. The topology resolves them per **move-region** rather than as one flat value; `order` defines the regions (global), and uniform axes carry the single region `whole`.

**Pre-gate context, gate question** (Context-Question Separation): present each axis·region's default, its basis, and each value's epistemic trade-off as text *before* the gate. The gate carries only the question and per-option differential implications. For the **reconciliation axis only** (the sole composable axis), the gate additionally surfaces relevant ⨾/∥ composites as recognizable options plus a one-line composition affordance. Only well-formed composites are offered.

The user's move is one of:
- **Select(value)** — adopt a value for the axis·region; auto-advance to the next unsurfaced axis·region
- **Compose(via op)** — combine reconciliation values via ⨾ or ∥ (reconciliation axis only); auto-advance
- **Reorient(axis)** — reframe or replace the surfaced axis; the reoriented axis re-surfaces (no auto-advance)
- **Sufficient** — declare the topology mission-sufficient; converge. A **move within the axis gate**, not a separate gate.

**Termination (honest bound)**: the loop is bounded by user agency — a **Sufficient** move or Esc-Stop ends it. The finite axis set guarantees a terminal: surfacing the last axis·region without Sufficient converges by implicit Sufficient. On Sufficient, `FinalizeTopology` default-binds every unresolved axis·region and replaces `Λ.residuals` with one `DefaultBound` record per binding; on exhaustion it replaces the set with empty.

**Checkpoints**: the conduct plan records a `CheckpointSet` — in-session re-entry points, all represented by the same `Checkpoint{region, decision, brief}` record. `RegisterCheckpoints` replaces the set after each finalized topology pass and `CompileCheckpointBrief` fills every registered brief before handoff.

**Synthesis checkpoint (defer-volatile instance)**: a region whose resolved reconciliation contains `synthesis` and whose routing is `return_to_user` or `handoff_to_span` registers a **synthesis checkpoint** — the fusion re-entry point, where the fusion is constituted in-session rather than left to the consumer. Its deferred decision is the synthesis output's **first-class unit**, its output shape, which the defer-volatile kernel routes to this checkpoint instead of locking at design time.

### Phase 3: Substrate Handoff

For the resolved topology, surface substrate feasibility as a handoff annotation, then hand off the `ConductedMethod` plan.

Here, and only here, the AI proposes the matter: for each resolved topology value it proposes which substrate could realize the region, matching the region's realizability requirements (peer persistence, addressability, statefulness) against the available substrates. When the available substrate cannot realize the resolved topology, **declare conduction-degradation** — record a `Degradation{region, kind: substrate_infeasible, resolved_value, reason}` in `degradations` (a `(track)` Λ mutation; surfacing the annotation is the separate `(extension)` op).

**Cross-span seam (`handoff_to_span` → substrate record)**: a region resolved to `routing = handoff_to_span` carries an externalization obligation to a context-less future span. At this same seam the AI proposes the durable record surface that discharges it, and the plan declares here that at execution the output is externalized to a substrate-owned record the future span is pointed at. When no durable record surface is realizable in the read inventory, the same `substrate_infeasible` degradation is recorded. What crosses the wall is a navigation block over the canonical record in the fixed shape Rule 19 declares; the far-side compile-back lies outside `/conduct`'s scope.

**Synthesis checkpoint brief**: for each registered synthesis checkpoint, compile a `CheckpointBrief` into the plan — a presentation contract the substrate executes at the checkpoint. The brief is structure, not content: it carries references and slots, never copies. The brief instructs the substrate to present, at the checkpoint: (a) the per-move outputs with their convergences, divergences, and decision axes as pre-gate text; (b) private-gap slots typed by the limit categories each assigned move's protocol contracts to report, surfaced for the user to fill or decline — slot assembly is relay while the slot structure is uniquely determined from the assigned contracts, and categories that prove context-dependent at execution escalate slot assembly to Constitution at the checkpoint; (c) fusion-result candidates with their differential implications, including the output-shape candidates — the Constitution gate where the deferred shape decision re-fires, its candidates narrowed from session context and user utterances and judged against the convergence/divergence pattern the moves actually produced.

Before handing off, **assemble the trace contract** — the cross-cutting disclosure overlay that spans all five axes: every final-pass default-bound axis·region with its disposition, every current degradation (relaxed isolation derived from the final CT or substrate infeasibility recorded in Phase 3), every coverage cap the resolved topology imposes, and every `until_goal_met` region's termination ground — the reference that makes "goal met" determinate, or `resolution_required` with its owed resolver named.

Hyphegesis then hands off the plan and stops. It produces the method plan plus its checkpoints; the substrate — or the routed protocol — executes the moves.

## Rules

1. **Conduction warrant (guard)**: Activate only when the method is genuinely underdetermined AND two or more moves are needed whose conduct is non-trivial. Single-move or self-evident work relays to that one protocol; conduction is not performed. Hyphegesis does not conduct Hyphegesis — conduct-plan moves are object-level, never another conduction.
2. **Recognition over Recall**: Present structured options via Cognitive Partnership Move (Constitution) — structured content reaches the user with a response opportunity; Constitution interaction requires turn yield before proceeding. Phase 1 presents the move set as structured candidates for recognition; the option-set relay test (Rule 12) applies when a settled direction already determines the selection.
3. **Design-time only**: Hyphegesis produces a method plan plus in-session checkpoints, then hands off. It has no runtime monitoring surface — it does not watch execution or emit runtime advisories. The span horizon (`/compact`, `/clear`) is user-controlled. Compiling a checkpoint brief keeps Hyphegesis design-time; performing the presentation belongs to the substrate.
4. **Impact/leverage-first design order**: Surface the most-constrained axis·region first (the one whose values most divide the downstream plan), not a fixed sequence. Every surfaced axis·region is settled at its own gate (Select, Compose, or Reorient) or defaulted at Sufficient; no axis is held open past its own gate on a "volatility" judgment. Only non-axis decisions whose evidence does not yet exist register checkpoints: synthesis output shape generally (Rule 16), and membership refinement for the decompose-recovery recipe (Rule 18).
5. **Independence before contamination (edge-local)**: The `isolated` value preserves each region's independence until reconciliation; `shared` relaxes it, and `FinalizeTopology` derives the final CT's `Degradation{kind: independence_relaxed}` into the replace-only `degradations` set. When `order = dependency_dag`, independence resolves per move-region, not as one flat value.
6. **Conduction over Substrate (invariant)**: Phase prose names only epistemic conduction UP TO the handoff seam; concrete substrate realizations (agent, context-window, scheduler, authentication) live only in TOOL GROUNDING. The Phase 3 handoff is the form/matter seam: it names the substrate boundary — the handoff target plus per-topology feasibility. The conduct form resolves substrate-independently, then composes feasibility at the seam; when the substrate cannot realize the resolved topology, declare conduction-degradation — never bind silently.
7. **Span and checkpoints**: The span runs from invocation (session start or mid-session) to the next planned `/compact` or `/clear` — a design-time horizon the user types, never a runtime-detected wall. Checkpoints are in-session only; Hyphegesis conducts to the last checkpoint, then downstream-delegates. `RegisterCheckpoints` produces the exact current set: one checkpoint per deferred decision at its region; `CompileCheckpointBrief` fills every one before handoff. A region resolving routing `handoff_to_span` additionally routes its output *across* the span wall by **externalizing it to a substrate-owned record the future span is pointed at** — the obligation declared at the Phase 3 seam and discharged by the executing substrate. What crosses is a locator into the canonical record, never a re-authored copy of it.
8. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via Cognitive Partnership Move (Constitution). The question contains only the essential question; options contain only option-specific differential implications. Scope includes the Phase 2 axis gate: each axis·region's default, basis, and per-value trade-offs are pre-gate text; the gate carries only the question and per-option (per-value and per-composite) differential implications.
9. **Convergence evidence**: Present the transformation trace before handoff — final-pass per-move assignment, per-axis·region topology trace (including every DefaultBound residual), substrate annotations, the exact current checkpoint set with every checkpoint's decision-typed compiled brief, and the trace contract (residuals, degradations, coverage caps, termination grounds) — as demonstrated evidence, not assertion.
10. **Matter AI-propose at the seam**: The Phase 2 axis gate fires for the epistemic-relevant fork over any of the five axes (order, independence, reconciliation, termination, routing) and never asks the user about matter/substrate. Matter is proposed by the AI only at the Phase 3 handoff seam: it scans the loaded environment and proposes which substrate could realize each region as a handoff annotation. This keeps pre-seam phase prose substrate-free; substrate naming lives at the seam and in TOOL GROUNDING.
11. **Gate integrity** (Safeguard tier): The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation.
12. **Option-set relay test (Extension classification)**: If analysis converges to a single dominant option (option-level entropy → 0), present the finding directly as Extension. Each Constitution option must be genuinely viable under different user value weightings. Options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options.
13. **Plain emit discipline**: User-facing emit (Phase 1 move surfacing, Phase 2 axis gates, convergence traces, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
14. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
15. **Trace contract (cross-cutting disclosure overlay)**: The method's disclosure obligations — final-pass DefaultBound axes, current degradations, and coverage caps — assemble into a single named trace contract that spans all five axes, surfaced at handoff and never silent. It is an overlay, not a sixth axis: it carries no Gen set, no gate, and no per-region selection — assembled (relay) from the replace-only products of the current topology plus Phase 3 substrate findings, never accumulated across superseded passes and never constituted by user choice. Coverage caps the resolved topology imposes are surfaced explicitly. Each `until_goal_met` region additionally carries its termination ground in the contract — a reference to what makes "goal met" determinate, or `resolution_required` naming the downstream resolver; an absent ground is unresolved and surfaced as such, never treated as an accepted-unbounded run.
16. **Synthesis checkpoint brief (Recognition at fusion)**: Fusion is recognized, not recalled. Every synthesis checkpoint carries a compiled `CheckpointBrief` instructing the substrate to present the per-move outputs with their convergences, divergences, and decision axes as pre-gate text, private-gap slots typed by the limit categories the assigned protocols contract to report for the user to fill or decline, and the fusion-result and output-shape candidates with differential implications as the Constitution gate. The brief is a contract of structure, not content — references and slots, never copies. Output shape is narrowed from context and user utterances and judged against the convergence/divergence evidence; the defer-volatile kernel presents it as recognizable candidates at the checkpoint rather than locking it at design time, and it stays a brief field. On a region carrying a `substrate_infeasible` degradation that affects the checkpoint's own in-session realization, the degradation record takes precedence and that region's brief is advisory rather than binding; a downstream-only infeasibility demotes routing/externalization instead, leaving the in-session fusion checkpoint binding.
17. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).
18. **Decompose recovery recipe (object-level instance)**: The decompose-recovery recipe (see `references/decompose-recovery.md` — `/ground` self-grounding detect → an in-session Constitution cell-assignment checkpoint → `/induce` per cell) is a worked instance of the existing topology algebra, not a separate orchestrator. Its cell-assignment checkpoint is an ordinary constitutive checkpoint, registered because the membership refinement's evidence does not exist at design time and does exist at the checkpoint. Decompose stays object-level and never acquires control-level governance.
19. **Seam relay on declared continuation**: when a user-declared chain or a composition edge this SKILL.md declares names the next protocol, the between-protocol seam after this protocol's handoff (ConductedMethod) is relay (Extension) — proceed directly, citing the settling source. Relay settles WHICH protocol follows; each edge's own fire condition sets WHEN. A `handoff_to_span` region names no next protocol: its seam declares an externalization obligation that travels in the handoff annotation, and the executing substrate discharges it at execution by writing the output to a substrate-owned record, after which the future span receives a navigation block over that record — its purpose and frame, the record's canonical locator, a dereference instruction, a snapshot anchor where exact-state determinacy is needed, and a grounding instruction that verifies load-bearing premises against current state and stops when a source is unreachable or a needed premise lacks support-integrity — never a re-authored copy of the record's contents. This governs only the seam BETWEEN protocols; every Constitution gate inside this protocol and the next fires unchanged, and the user can redirect at any turn.
20. **No-reentry across the `/apportion` seam, bound not re-derived**: The relationship is two-way and advisory, never a precondition. For `I ≠ None`, consume each `UnitEntry.resolution` exactly as Merismos emitted it: `DeterminateResolution` carries a predicate plus all typed completion/invariant conjuncts; `AcceptedUncoveredResolution` carries a non-empty accepted-completion witness plus any invariant conjuncts, so the accepted constructor is not limited to residual-only units and its invariant provenance must not be dropped. Either plan-bearing carrier retains its locator at Phase 0 and carries it onto the handoff, so a `resolution_required` ground names a resolver the substrate can actually re-reach. `MoveId` stamps `unit_ref`, `UnitMoveBinding` is read from the move set, and `BindUnitConditions` replaces one binding per current unit. An `until_goal_met` region grounds termination by reference to the conjunction of its determinate resolution predicates; when none exist, it records `resolution_required(/apportion)` instead of conjoining an empty set, and the trace contract discloses that carried ground itself — a `resolution_required` the binding carried is a reference to a named owed resolver, so it outranks the assigned protocols' convergence contracts and one region never leaves with two different grounds — and, on a MIXED region, the binding additionally carries `uncited_conjuncts`: the AcceptedUncovered unit's own compiled invariant conjuncts, which the shared ground never cites, so the substrate still enforces them inside that unit's own interval. Other termination values use `executor_enforced` with a `CoverageLimit`. Bind each incoming `PlanEntry.dischargeable_when` to the earliest sound topology frontier or terminal. Merismos's `plan_terminal(n)` is an aggregate, topology-free projection over unit resolutions, the expected aggregate resolution count, and the envelope's accepted-completion record, with no unit identities; its accepted arm still requires every carried invariant conjunct to hold, so accepting missing completion never waives an invariant. Its conservative terminal binding is sound while the carried plan's unit count still matches what merismos fixed at emission; a downstream `Withdraw` that reduces that count makes the count conjunct — and so `plan_terminal` itself — permanently false for THIS plan, by design: no step here or in `/apportion` merges a later apportionment pass's output back into this carried plan or this fixed count. `Withdraw` retains every OTHER `PlanEntry` unchanged, but does not itself revalidate what `/apportion` compiled it against: this protocol only places a sound firing site over the CURRENT topology and plan, it never recompiles a condition's predicate or basis, so that revalidation is the resolver's to make on the next `/apportion` pass that receives the withdrawn units' owed obligations back — the caveat travels in the convergence trace. Do not reconstruct per-unit basis. When sound frontiers diverge materially, invalidate the current topology products before re-opening the deciding axis·region. Use `resolution_required(resolution_resolver(affected), affected)` only when no site satisfies or that plan condition's own deciding divergence has already had its one re-opening; every plan condition still gets exactly one final-pass binding. Neither binding routes back to `/apportion`. In the other direction, an unresolved autonomous region handed to `/apportion` carries fixed topology and is not re-conducted; trivial unit sets bypass this protocol under the warrant.

## Adversarial Guards

- **universal-dispatcher**: Hyphegesis sprawls into conducting every task, including single-move work. Guard: the Phase 0 relay-test deactivates on single-move or trivial-conduct work; warrant requires ≥2 moves with a non-trivial, branch-dividing conduct.
- **meta-recursion**: Hyphegesis is asked to conduct its own conduction. Guard: anti-self-application — conduct-plan moves are object-level only; "conduct the conduction" is rejected.
- **premature-lock**: a decision that structurally cannot be judged before the per-move outputs exist (the synthesis output's shape, a decompose-recovery cell's membership) gets guessed at Phase 2 design time instead of deferred. Guard: that decision never enters the Phase 2 axis loop as a Gen-typed axis at all — it registers as an in-session checkpoint (Rule 16; Rule 18) whose Constitution gate re-fires once the deciding evidence (the per-move outputs, `/ground`'s candidate partition) exists.
- **silent-substrate-bind**: a resolved topology is bound to a substrate that cannot realize it. Guard: declare conduction-degradation at Phase 3 rather than binding silently.
- **disclosure-as-axis**: the trace contract is mistaken for a sixth conduct axis and given a Gen set + gate. Guard: never-silent admits no alternative value, so disclosure is a cross-cutting overlay assembled (relay) from the final topology pass's replace-only products plus current substrate findings, never a gated axis.
- **object-control-conflation**: the decompose-recovery recipe (or any object-level split) acquires control-level governance — queue order, focus, span across nodes, child-state, recursion — turning the object-level split into a mini-orchestrator. Guard: decompose is object-level (it transforms abstractions); the conduct topology arranges the moves, and the split itself never owns orchestration.
- **cross-span-absorption**: the `handoff_to_span` routing value pulls author-side portability machinery (deictic closure, self-containment audit, a comprehension gate) or the far-side compile-back into `/conduct`, making it conduct a different span's cognition. Guard: `handoff_to_span` is routing-and-externalization only — `/conduct` names the cross-span destination at design time and declares the externalization obligation in the handoff annotation; the executing substrate externalizes its output to a substrate-owned record at execution time, and the future span receives that record's locator (Rule 19). Auditing the record on the author's side is out of scope in the same way the compile-back is; both belong to the receiving span. `/conduct`'s cognition stays single-span; only its output bridges.
