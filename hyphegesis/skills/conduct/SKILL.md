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
  [PI = LivePlan(plan): bind_I(Some(plan)) |
   PI = Navigation(N): DereferencePlan(N) → (unreachable ∨ support-integrity failure: relay(handoff unreadable) (extension) → deactivate | E → ReadPlan(E) → plan → bind_I(Some(plan))) |
   PI = NoPlan: bind_I(None)] → MethodBrief(WP) → guard[relay-test, anti-self-application] →
  [single-move ∨ trivial-conduct: relay-route(extension) → deactivate] |
  [multi-move ∧ non-trivial:
    Qc(brief, warrant) → continue →
    MoveId(WP × PG) → [set exceeds a recognition bundle ∨ cross-graph: SalienceRank(MoveSet, brief.work_intent)·relay] → Sc(MoveSet) → MS →
    CT_default_surface → loop( AxisGate(impact-first axis·region) → Stop → VM → update(CT) → auto-advance ) until Sufficient → FinalizeTopology(CT, surfaced_axes) → (CT, residuals, topology_degradations) → AssignMoves(MS, CT) → move_assignment → RegisterCheckpoints(WP, CT) → checkpoints →
    [I ≠ None: BindUnitConditions(I, MS, move_assignment, CT) → BindPlanConditions(I, CT, move_assignment) → (divergent sound frontiers: InvalidateTopologyProducts → re-open the deciding axis·region → back to the AxisGate loop | proceed)] →
    SubstrateFeasibility(CT) → SH → AnnotateWithdrawals(withdrawn_units) → CarryPlan(I) → CompileCheckpointBrief(checkpoints, WP, CT, MS) → RecordDegradation(SH, CT) → degradations → AssembleTraceContract(residuals, degradations, coverage, termination grounds) → TC → converge(conduct trace incl. trace contract + checkpoint briefs + condition bindings) → ConductedMethod ]

── MORPHISM ──
WorkProspect × ProtocolGraph
  → resolve(plan_input)                      -- live /apportion plan binds directly; a navigation block is dereferenced and its emitted record read back into all five plan fields; an unreadable or support-unsound handoff stops rather than falling through to I=None
  → brief(method, conduction_warrant)         -- infer the work prospect's method-brief; judge whether conduction is warranted
  → guard(relay_test, anti_self_application)  -- single-move work relays to that one protocol; Hyphegesis does not conduct Hyphegesis
  → identify(moves)                           -- candidate cognitive moves over the protocol graph; a set overflowing a round-local recognition bundle or drawn cross-graph is presented salience-ranked against the brief's work intent (relay), surfacing the accumulated shape so the selection is Recognition not recall
  → select(moves)                             -- user confirms the move set via Cognitive Partnership Move (Constitution)
  → design(conduct_topology)                  -- impact/leverage-first: settle the highest-leverage axis·region first, each at its own gate; edge-local over move-regions; FinalizeTopology replaces the current pass's residual/degradation products, then checkpoint registration replaces the checkpoint set from the current CT + WP. Deferred decisions whose evidence does not exist yet register here (synthesis output shape, or the decompose recipe's membership refinement), pairing with compile(checkpoint_briefs) at Phase 3
  → annotate(substrate_feasibility)           -- per resolved topology, surface substrate realizability as a handoff annotation
  → compile(checkpoint_briefs)                -- for every registered deferred decision, compile the decision-typed Recognition presentation contract the substrate executes there (structure, not content)
  → contract(trace_disclosure)                -- assemble the cross-cutting disclosure overlay: residuals + degradations + coverage caps + termination grounds (per until_goal_met region); surfaced, never silent (not a sixth axis — assembled, not gated)
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
         -- a single cognitive step, the unit Hyphegesis arranges, always object-level (never another conduction).
         -- unit_ref is stamped at Phase 1 MoveId on every move derived from an incoming /apportion UnitEntry,
         --   and is None on a self-identified move. It is what makes UnitMoveBinding derivable rather than
         --   asserted: without an identity ON the move, no map from UnitRef to Move can be read off anything
MS     = MoveSet: (WP × PG) → {Move₁ … Moveₙ}, n ≥ 2  -- after Phase 1 Sc, n=1 relay-routes to that surviving
               --   move's protocol and deactivates; n=0 relays that no move survives and deactivates without
               --   naming a route. Withdrawals are surfaced on either exit. These are distinct typed outcomes,
               --   not one blanket n<2 route (see PHASE TRANSITIONS Phase 1)
SalienceRank = MS ordered by each Move's relevance to MethodBrief.work_intent, each Move annotated with a one-line aim-tied rationale  -- a relay (Extension) presentation of MS, surfaced as pre-gate text when the trigger holds: the flat set would overflow a single round-local recognition bundle (too many candidates to recognize at once — Rule 14) ∨ the candidates are drawn from the accumulated graph (prior moves, deposits, threads) the user may not hold in view. Otherwise the flat MS presentation is the default. NOT a new gate, NOT a new coproduct, NOT durable state (a presentation-time derivation, re-derivable from MS + the brief, stays in session per the externalization boundary) — the constitutive selection remains the single Sc gate. Basis: aim + accumulated shape
stamp_functional(MS') ≡ ∀ r ∈ {m.unit_ref | m ∈ MS', m.unit_ref ≠ None} : |{m ∈ MS' | m.unit_ref = r}| = 1
                      ∧ ∀ u ∈ I.units : u.unit_ref ∈ {m.unit_ref | m ∈ MS'} ∨ u.unit_ref ∈ {r | (_, r) ∈ withdrawn_units}
         -- BOTH halves: at most one move per incoming unit (else UnitMoveBinding is not a map), and no
         --   incoming unit left with neither a move nor a recorded withdrawal (else its totality is
         --   unreachable). Evaluated by Confirm(MS'), not asserted in a comment
A_s    = SelectionJudgment ∈ {Confirm(MS'), Withdraw(Set(UnitEntry)), Esc}
         -- Withdraw is offered ONLY when I ≠ None and the confirmed selection would leave an incoming unit
         --   with no stamped move; it is the repair path for a totality that would otherwise be unreachable
MethodBrief = AI-inferred summary of WP: { work_intent, expected_handoff, span }  -- span = invocation → next planned /compact or /clear (the design-time horizon; the user types the command)
Warrant = ConductionWarrant ∈ {warranted, relay}  -- warranted = (moves ≥ 2 ∧ conduct non-trivial: ≥ 2 conduct-plans with differential futures); relay = single-move ∨ trivial (conduction entropy → 0)
MoveRegion = a contiguous sub-graph of moves sharing one conduct treatment (e.g. an authoring region vs a verification region); the single region "whole" when order is not a dependency DAG
axis   ∈ {order, independence, reconciliation, termination, routing}  -- FINITE seed; surfaced impact/leverage-first (most-constrained axis·region first), NOT a fixed sequence
  Gen(order)          ∈ {single_move (relay-only: trips the guard; never selected in Phase 2), sequential_chain, parallel_fan, dependency_dag}
  Gen(independence)   ∈ {isolated, shared}                                          -- isolation before synthesis-contamination
  Gen(reconciliation) ∈ {aggregate, dialectic, adversarial_refute, synthesis}       -- the only composable axis (⨾/∥)
  Gen(termination)    ∈ {single_pass, bounded_rounds, until_dry_ceiling, until_goal_met}
  Gen(routing)        ∈ {return_to_user, chain_to_next, handoff_to_protocol, deepen_on_finding, handoff_to_span}  -- handoff_to_span: the move/region output is routed ACROSS the span wall to a future span (post /compact, /clear, or a new session — a consumer that does not share this session's context); /conduct declares the EXTERNALIZATION obligation in the handoff annotation and the executing substrate externalizes the output to a substrate-owned record at execution, so the future span reads the canonical record itself rather than a session-local restatement of it. Distinct from handoff_to_protocol (output → another protocol as the next in-span move, output stays live in-context, no externalization obligation) and return_to_user (in-span terminal): handoff_to_span carries an externalization obligation to a context-less consumer, so its distinct downstream trajectory is the substrate-record bridge + a Phase 3 substrate_infeasible degradation when no durable record surface is realizable. Design-time routing (expected_handoff names a future-span consumer), NOT runtime detection of the wall
ResolvedValue⟨a⟩ = per-axis resolved value, axis-typed (composition is NOT axis-uniform):
   ResolvedValue⟨reconciliation⟩ = Gen(reconciliation) ⊕ Compose(RVᵣ, RVᵣ, op)  -- the sole composable axis (the reconciliation-stage algebra)
   ResolvedValue⟨order⟩ = Gen(order);  ResolvedValue⟨independence⟩ = Gen(independence);  ResolvedValue⟨termination⟩ = Gen(termination);  ResolvedValue⟨routing⟩ = Gen(routing)  -- SCALAR axes: Gen only (⨾/∥ have no meaning on an order shape, an isolation flag, a termination bound, or a routing flag)
op     ∈ {⨾ sequential, ∥ parallel}             -- reconciliation-stage operators; extensible at operator level
CT     = ConductTopology = Map(axis → Map(MoveRegion → ResolvedValue⟨axis⟩))  -- EDGE-LOCAL: when Gen(order) = dependency_dag, independence/reconciliation/routing/termination resolve per move-region (non-uniform); order defines the regions (global); uniform axes carry the single region "whole"
CT_default = ⟨order: sequential_chain, independence: isolated, reconciliation: synthesis, termination: bounded_rounds, routing: return_to_user⟩ over the single region "whole"  -- the assembled tuple of per-axis Gen defaults; surfaced as relay context but selected only through AxisGate (Sufficient accepts the remaining defaults). NORMALIZATION: the flat tuple is shorthand for Map(axis → {whole → value}) — every flat axis value normalizes to the nested single-region form, so CT is uniformly Map(axis → Map(MoveRegion → ResolvedValue⟨axis⟩))
AxisGate = { axis, region, options, default, basis, cycle: Nat }  -- one surfaced per elicitation cycle, impact/leverage-first; reconciliation gate additionally offers ⨾/∥ composites. cycle = the current Λ.elicitation_cycle value at presentation time — the READER that makes elicitation_cycle's Select/Compose/Reorient increments visible, mirroring apportion's cycle_n surfaced at every Qu (see merismos SKILL.md TYPES); without it, elicitation_cycle would be incremented state nothing consumes
Checkpoint = { region: MoveRegion, position: CheckpointPosition,
               decision: DeferredDecision, brief: Option(CheckpointBrief) }
               -- one generic in-session conductor re-entry record. /compact and /clear are the span wall,
               --   never checkpoints. region defaults to "whole" under single-region normalization and is the
               --   degradation binding key. position states where execution stops; decision states WHAT
               --   Constitution re-opens over. brief populates at Phase 3 CompileCheckpointBrief and is
               --   interpreted by the substrate only after handoff. A registered brief=None value is a valid
               --   in-protocol interim state, never a handed-off contract
CheckpointPosition ∈ {BeforeRegion, ReconciliationPoint}
DeferredDecision = SynthesisOutputShape ⊎ CellAssignment(partition_ref: Reference)
               -- payload variants of the SAME Checkpoint record, not separate checkpoint machinery.
               --   SynthesisOutputShape waits for move outputs; CellAssignment waits for the user's membership
               --   judgment over /ground's already-evidenced candidate partition
CheckpointSet = ordered Set(Checkpoint)
               -- ordered by EXECUTION POSITION: BeforeRegion precedes its region's moves;
               --   ReconciliationPoint follows them; topology order resolves between regions and registration
               --   order breaks ties. Hyphegesis conducts to the LAST checkpoint, then delegates downstream
SynthesisCheckpoint = the Checkpoint c with c.decision = SynthesisOutputShape, registered per region whose
               --   resolved reconciliation ∋ synthesis ∧ routing ∈ {return_to_user, handoff_to_span} (Select,
               --   Compose, or default-binding alike; CT_default qualifies via "whole"). It sits at
               --   ReconciliationPoint. Both admitted consumers cannot re-derive fusion shape, so OutputShape
               --   is constituted in-session; for handoff_to_span the result is then externalized
CellAssignmentCheckpoint = the Checkpoint c with c.decision = CellAssignment(partition_ref), registered when
               --   decompose_recovery(WP). It sits at BeforeRegion("whole") and refines membership of the
               --   already-existing per-cell moves; it neither creates moves after handoff nor introduces a
               --   new checkpoint structure
CheckpointBrief = SynthesisBrief ⊎ CellAssignmentBrief
SynthesisBrief = { findings_ref: Map(Move → Slot(output_ref)), convergences: Slot(Set(finding)), divergences: Slot(Set(finding)), decision_axes: Slot(Set(decision_axis)), private_gap_slots: Set(GapSlot), fusion_candidates: Slot(Set(fusion_candidate)), output_shape_candidates: Slot(Set(OutputShape)) }
               -- the Recognition presentation contract for SynthesisOutputShape: structure only, never move
               --   content. Output shape resolves first when both candidate sets are live; fusion candidates
               --   are then expressed in that selected unit. The option-set relay test applies independently
CellAssignmentBrief = { partition_ref: Reference, candidate_cells_ref: Reference,
                        judgment: Slot(Set(CellAssignmentJudgment)) }
PartitionMemberRef = Reference naming one member in /ground's partition reading
CandidateCellRef = Reference naming one non-empty candidate cell in that reading
OutlierRef = PartitionMemberRef restricted to a trim_outlier
CellAssignmentJudgment = Assign(PartitionMemberRef, CandidateCellRef) ⊎ NarrowOut(OutlierRef)
               -- the Recognition contract for CellAssignment. partition_ref and candidate_cells_ref point
               --   back to /ground's Split reading; they never copy it. At execution the substrate presents
               --   that evidence, then the user assigns every fitting member to exactly one existing candidate
               --   cell and resolves each trim_outlier by Assign(cell) or NarrowOut. Either branch updates the
               --   partition membership the per-cell moves read; silence carries Stop and updates nothing
   Slot(T) = a typed placeholder compiled at design time and filled with T by the substrate at execution  -- the "structure only" semantics made explicit: the slot is the compiled structure, T is execution-time content
   GapSlot = { category: a limit category the assigned move's protocol contracts to report, content: Slot(filled ∨ declined) }  -- private-gap slots are typed at design time by the contracted limit categories (a structural derivation from the assigned contracts, never execution-time content), surfaced for the user to fill or decline. Slot assembly is extension only because the slot structure is uniquely determined from the assigned contracts at design time (entropy → 0); when limit categories prove context-dependent at execution, slot assembly escalates to Constitution at the checkpoint; the filling is the user's Constitution either way. Moves without a protocol contract (an analysis pass or delegation) contribute an empty design-time slot set; private gaps such moves surface at execution route through the same escalation (slot assembly escalates to Constitution at the checkpoint)
OutputShape = the first-class unit the synthesis output is organized around  -- determined by the mission's question form, NOT by the topology; narrowed from session context and user utterances, judged after the per-move outputs exist (the convergence/divergence pattern is the evidence). Anchor instances, not an enum (the candidate space is open): a lens-organized report — a report organized around each analytical lens's findings (the DEFAULT shape for understand-the-situation missions and for the trivial-default path) — and a claim-survival report (natural after adversarial_refute arrangements). FALLBACK: when the mission's question form is unidentifiable from session context and user utterances, the lens-organized report is the default candidate and the candidate set carries an emergent free-form option — the substrate never exercises constitutive shape judgment without a gate
decompose_recovery(WP) ≡ WP carries /ground's self-grounding Split reading and its ≥2 non-empty candidate-cell partition
partition_reading(WP) = the /ground Split reading carried by WP when decompose_recovery(WP)
candidate_cells(WP) = partition_reading(WP)'s non-empty core/rival candidate cells
checkpoint_set(WP, CT) =
               { Checkpoint(r, ReconciliationPoint, SynthesisOutputShape, None) |
                   CT[reconciliation][r] contains synthesis ∧
                   CT[routing][r] ∈ {return_to_user, handoff_to_span} }
               ∪ { Checkpoint("whole", BeforeRegion, CellAssignment(ref(partition_reading(WP))), None) |
                   decompose_recovery(WP) }
               -- exact replace-value RegisterCheckpoints writes on EVERY topology materialization pass. The
               --   first comprehension produces the synthesis checkpoints; the conditional singleton is the
               --   formal producer the decompose-recovery recipe previously lacked
checkpoint_registry_projection(CP) = [ (c.region, c.position, c.decision) | c ∈ CP in CP order ]
               -- CP order = CheckpointSet's own declared EXECUTION POSITION order (BeforeRegion precedes its
               --   region's moves; ReconciliationPoint follows them; topology order resolves between regions;
               --   registration order breaks ties — see CheckpointSet). checkpoint_set's comprehension union is
               --   set-valued at construction; every value it produces is read only through a Λ.checkpoints
               --   field typed CheckpointSet, so this is the order the projection compares, not a separate
               --   ordering checkpoint_set itself must construct
               -- ordered projection: compilation may change only brief, not checkpoint identity OR execution
               --   position. A set projection would let a stale ordering satisfy the handoff equation
compile_checkpoint_brief(c, WP, CT, MS) =
               SynthesisBrief compiled from current CT + MS when c.decision = SynthesisOutputShape
               | CellAssignmentBrief { partition_ref: ref(partition_reading(WP)),
                                       candidate_cells_ref: ref(candidate_cells(WP)),
                                       judgment: Slot(Set(CellAssignmentJudgment)) }
                   when c.decision = CellAssignment(ref(partition_reading(WP)))
               -- total over checkpoint_set(WP,CT), and only over that registry. Phase 3 writes
               --   Some(compile_checkpoint_brief(...)) into each matching checkpoint; the result equation
               --   checks exact equality, so a wrong-kind, pre-back-edge, or uncompiled brief cannot hand off
SH     = SubstrateHandoff = { feasibility: CT → FeasibilityAnnotation, annotations: Set(HandoffAnnotation) }
               --   feasibility: substrate realizability per resolved topology value (matter; composed in
               --   TOOL GROUNDING, not in phase prose) — the same per-value surfacing Phase 3
               --   SubstrateFeasibility always did, now a named field rather than the whole of SH.
               --   annotations: the record carrier for obligations that travel WITH the handoff regardless
               --   of when they were incurred — currently the withdrawal obligation only (see
               --   HandoffAnnotation). A bare function type had no field for this to sit on, which is what
               --   left `owed_reapportionment(w) ∈ substrate_handoff.annotations` unreadable: a field
               --   access on a function type
HandoffAnnotation = OwedReapportionment(unit: UnitEntry, resolver: Resolver)   -- open coproduct (one
               --   constructor today): an incoming unit withdrawn at Phase 1 Sc — this protocol could
               --   arrange no move for it — travels here as an owed obligation, the WHOLE UnitEntry rather
               --   than its ref alone, because /apportion cannot re-apportion a unit whose obligations,
               --   subject, conditions and capability requirements were discarded
owed_reapportionment(w) = HandoffAnnotation.OwedReapportionment(w, /apportion)   -- the constructor both
               --   producer steps (Phase 1's sub-two-move relay-route exit, Phase 3's AnnotateWithdrawals
               --   annotation of withdrawals) write and CONVERGENCE reads; resolver pinned at /apportion,
               --   mirroring TerminationGround's own per-move delegation-move resolver rule — a withdrawn
               --   unit already left this protocol's arrangement, so it is owed to the same party a
               --   delegation move's stop already is
VM     = ConductMove ∈ {Select(value), Compose(via op), Reorient(axis), Sufficient}  -- per-cycle user move in the axis gate; Compose offered on the reconciliation axis only
         Sufficient = a MOVE in the axis gate (NOT a separate gate) → converge elicitation (user Constitution declaration)
ResidualAxis = { axis, region, status: ResidualDisposition, reason }  -- an axis·region the current topology
               --   pass default-bound because Sufficient ended elicitation before it was settled; the trace
               --   surfaces this record, so default-binding is never silent
ResidualDisposition = DefaultBound
               -- one reachable state, not a false coproduct: the current protocol neither defers a Gen axis
               --   past design time nor dismisses one without a value. Deferred decisions use Checkpoint;
               --   every unresolved Gen axis receives its default here
Degradation = { region: MoveRegion, kind ∈ {independence_relaxed, substrate_infeasible}, resolved_value, reason }  -- a surfaced acknowledgment that a resolved value relaxes an epistemic guarantee or cannot be realized; never silently bound
   kind ∈ {independence_relaxed, substrate_infeasible}  -- independence_relaxed: selecting independence=shared at Phase 2 relaxes region isolation (epistemic); substrate_infeasible: the substrate cannot realize the resolved topology at Phase 3 (matter). Both flow into degradations
FinalizeTopology(CT_partial, surfaced_axes) =
               (CT, default_bound_residuals(CT, surfaced_axes), topology_degradations(CT))
               where CT = { a ↦ { r ↦ (CT_partial[a][r] if (a,r) ∈ surfaced_axes else Gen(a)'s default) |
                                  r ∈ regions } | a ∈ {order, independence, reconciliation, termination, routing} },
                     regions = ⋃_{a∈dom(CT_partial)} dom(CT_partial[a]), or {whole} when that union is ∅
               -- fill every unresolved axis·region with its Gen default; the residual projection is EXACTLY
               --   one ResidualAxis{status: DefaultBound} per value that remains default-bound in the final
               --   current CT (∅ on exhaustion, where every axis·region was settled). A later materialization
               --   pass may retain an unchanged default value already present in CT_partial; surfaced_axes,
               --   not write timing, still identifies it as default-bound. The step REPLACES
               --   Λ.topology, Λ.residuals, and the Phase-2 portion of Λ.degradations, never unions with a
               --   prior pass. It is the producer for TraceContract.residuals and current-CT degradations
default_bound_residuals(CT, surfaced_axes) =
               { ResidualAxis{axis: a, region: r, status: DefaultBound,
                              reason: "Sufficient bound the unsurfaced value to its Gen default"} |
                   a ∈ dom(CT) ∧ r ∈ dom(CT[a]) ∧ (a, r) ∉ surfaced_axes }
               -- the exact residual set FinalizeTopology writes; exhaustion puts every nested-map
               --   axis·region pair in surfaced_axes and yields ∅
topology_degradations(CT) = { Degradation{region: r, kind: independence_relaxed,
                                          resolved_value: shared, reason: current shared resolution} |
                                CT[independence][r] = shared }
               -- derived wholly from current CT; changing a reopened independence value removes the old
               --   degradation on the next FinalizeTopology pass
substrate_degradations(SH, CT) = { Degradation{region: r, kind: substrate_infeasible,
                                                resolved_value: CT-value, reason: SH feasibility basis} |
                                      SH.feasibility reports that CT-value infeasible in r }
               -- the exact Phase-3 addition RecordDegradation writes; together with topology_degradations it
               --   makes degradations an equality over current inputs, not an accumulator open to stale values
CoverageLimit = { region: MoveRegion, bound ∈ {top_n, no_retry, sampling, emergent}, dropped: prose-scope, reason }  -- a coverage cap the resolved topology imposes (what the method does NOT cover); surfaced explicitly — the "no silent caps" discipline. dropped = the uncovered intra-region extent (prose); every cap is intra-region (top_n/sampling) or termination-derived (no_retry), so it is recoverable from the resolved topology at assembly — conduct assigns every selected Move to a region, so there is no whole-Move drop to preserve (a Phase 1 move exclusion is the user's explicit Constitution decision, already known, not a silent cap). Derived from the topology at assembly via the source→bound functor: termination=single_pass → no_retry (one pass, no retry); termination=bounded_rounds or until_dry_ceiling → top_n (a round/ceiling upper bound — what lies beyond the bound is uncovered); termination=until_goal_met → no cap (uncapped conditional on the region's recorded termination ground — see TerminationGround; the topology value alone does not claim goal-complete coverage); an intra-region sampling → sampling; any runtime-determined cap outside the named four → emergent (the open catch-all, surfaced via free description — keeps the FINITE seed open). Never separately gated
Reference = { cites: String }   -- a locator naming WHERE the referenced content is recorded — the incoming
               --   UnitEntry's leaf, the assigned protocol's convergence contract, or the plan condition —
               --   resolvable by the executing substrate at runtime. It holds no compiled predicate of its
               --   own: this protocol records what grounds a stop, the assigned protocol or /apportion
               --   compiles the executable form, and the substrate verifies it
ref(x) = Reference { cites: the locator naming x }   -- a CITATION of x — a pointer the executing substrate later dereferences and verifies
               --   at runtime — never a copy of x's compiled form. Constructs the arguments TerminationGround's
               --   protocol_contract(ref) / stated_condition(ref) arms and UnitGroundDisposition's
               --   grounds_termination(g) carry: applying ref to a conjunction, e.g. ref(⋀
               --   determinate_leaves(region)), names "the conjunction over these units' compiled leaves" AS A
               --   REFERENCE, never the compiled Boolean value itself. This is what makes TerminationGround's
               --   own claim — "A REFERENCE, never a compiled predicate" — checkable rather than merely
               --   asserted: /conduct never evaluates ref(x), it only records it; the assigned protocol,
               --   /apportion, or the executing substrate is what later dereferences and evaluates the citation
TerminationGround = { region: MoveRegion, ground ∈ {protocol_contract(ref), stated_condition(ref), resolution_required(resolver)} }  -- recorded per region whose termination resolved until_goal_met: the referenceable ground that makes "goal met" determinate — the assigned move protocol's own convergence contract (protocol_contract), an already user-stated or /apportion-compiled condition (stated_condition), or resolution_required naming the downstream resolver that owns the definition. A REFERENCE, never a compiled predicate: /conduct records what grounds the stop, the assigned protocol or /apportion compiles executable predicates, the executing substrate verifies and enforces — no overlap. An absent ground records resolution_required — unresolved, NEVER an accepted-unbounded run: only an actual Constitution interaction (the assigned protocol's own gate, or /apportion's termination gate) may record unbounded acceptance. Resolved at assembly by deterministic precedence (relay, never separately gated): a condition already user-stated in session or /apportion-compiled for the region → stated_condition(ref) — for an incoming /apportion unit, this is exactly the `g` that `UnitConditionBinding`'s `grounds_termination(g)` disposition arm records — `UnitConditionBinding` itself has no `ground` field; `ground` names TerminationGround's own field, and the binding's disposition is what carries the g-value into it (see TYPES, *Consumed from merismos*, and Rule 20); else, every conducted move in the region assigned a protocol with its own convergence contract → protocol_contract(ref) per move — the region completes when EVERY conducted move reaches its cited convergence (all, never any); else → resolution_required — the fallback whenever neither reference exists or the reference is ambiguous, never an arbitrary pick among candidates. Its resolver payload derives deterministically PER MOVE (no undeclared choice, no single arbitrary pick among candidates): a protocol-assigned move → that move's protocol (its own gate constitutes its stop); a delegation move (an autonomous substrate run) → /apportion; an analysis pass (in-session, no protocol) → the user at execution. The payload is the per-move resolver set, and the region's owed resolution is the conjunction — the obligation discharges when every listed move-stop is resolved, mirroring protocol_contract's all-never-any. A resolution_required ground travels in the trace contract as an owed-resolution OBLIGATION to its named resolver — TraceContract.termination_grounds, assembled by AssembleTraceContract and surfaced at Phase 3 (see TraceContract): /conduct records the ground, discharge belongs to the resolver (Epistemic Completeness Boundary)
TraceContract = { residuals: Set(ResidualAxis), degradations: Set(Degradation), coverage_limits: Set(CoverageLimit), termination_grounds: Set(TerminationGround) }  -- CROSS-CUTTING OVERLAY over CT (spans all axes·regions): the method's disclosure contract, realizing disclosure ONE SEMANTIC LEVEL ABOVE the five axes. INVARIANT, not a sixth axis — never-silent admits no alternative value, so it carries no Gen set, no AxisGate, no per-region selection; ASSEMBLED (relay) at handoff from the final topology pass's replace-only residual/current degradation state + derived coverage caps, never constituted by user choice and never unioned across superseded CTs
derived_coverage_limits(CT, unit_condition_bindings) = every CoverageLimit required by CoverageLimit's
               --   source→bound functor over CT (single_pass → no_retry; bounded_rounds or
               --   until_dry_ceiling → top_n; an intra-region sampling → sampling; any other imposed cap →
               --   emergent) ∪ {cl | ∃b∈unit_condition_bindings: b.disposition = executor_enforced(cl)}
derived_termination_grounds(CT, MS, move_assignment, I) = exactly one TerminationGround for each region
               --   in {r | (_, r) ∈ range(move_assignment)} whose resolved termination is until_goal_met,
               --   with ground selected by TerminationGround's deterministic precedence from the stated or
               --   /apportion-compiled condition, the assigned protocols' convergence contracts, or the
               --   per-move resolution_required resolver payload. No other region contributes a ground
ConductedMethod = { topology: CT, move_assignment: Map(Move → ⟨order_position, region⟩), checkpoints: CheckpointSet, substrate_handoff: SH, trace_contract: TraceContract, unit_condition_bindings: Set(UnitConditionBinding), plan_condition_bindings: Set(PlanConditionBinding), carried_plan: Option(ConditionBearingUnitPlan) }
               -- I AS IT STANDS AT PHASE 3, carried through UNREAD and UNCHANGED, field-by-field, for every
               --   unit still in it — never a PROJECTION of those units (R11: this is NOT a promise that
               --   nothing was ever removed from the ORIGINAL incoming plan bound at Phase 0). A unit
               --   Phase 1 Withdraw already removed from I is not in carried_plan either — Withdraw runs
               --   strictly before CarryPlan, so there is nothing left to copy for it — but its full content
               --   is not lost: it travels separately as an owed_reapportionment annotation (see
               --   HandoffAnnotation) naming the whole withdrawn UnitEntry. The bindings this protocol
               --   produces are positional (which move, which region, which firing site); they carry no unit
               --   subject, leaf conjuncts, capability requirements or feasibility notes. An executor
               --   receiving only ConductedMethod would therefore know WHERE each carried unit runs and
               --   nothing about WHAT it is — an unexecutable plan that still satisfies conducted(WP).
               --   Carrying I whole (as of Phase 3) is what makes the seam lossless for the units it still
               --   holds; carrying a chosen subset of THOSE units is how the previous two revisions each
               --   lost a different field
         -- the method PLAN; handed off (the substrate executes), with a conduct trace surfaced (completion evidence). trace_contract is the cross-cutting disclosure overlay (residuals + degradations + coverage caps + termination grounds), assembled at handoff from the FINAL topology pass's replace-only residual/degradation state plus Phase 3 feasibility records. checkpoints carries every registered decision's compiled CheckpointBrief into the plan
         -- order_position = the move's slot in the order topology (Gen(order) shape); the per-region axis values (independence/reconciliation/termination/routing) are read from CT[axis][region] — so all five axis values per move are recoverable from ⟨order_position, region⟩ + CT: each is a settled ResolvedValue, or (for an unresolved axis·region) its Gen default tagged with a ResidualDisposition — recoverability returns ResolvedValue ⊕ ResidualDisposition, never an empty slot
         -- unit_condition_bindings/plan_condition_bindings populate ONLY when I ≠ None (WP arrived as a
         --   ConditionBearingUnitPlan from /apportion); both stay ∅ on the self-identified-move-set path —
         --   this protocol never fabricates a binding for a move it identified itself
handoff_plan = the ConductedMethod value this invocation constructs and, on convergence, hands off —
               --   referenced in CONVERGENCE, mirroring Merismos's own `plan` binding (see merismos SKILL.md
               --   TYPES). Named `handoff_plan`, not the bare `plan` merismos uses, because this protocol
               --   ALSO binds `plan` locally as the incoming-plan pattern variable inside LivePlan(plan) (see
               --   WP-BINDING, PHASE TRANSITIONS Phase 0) — reusing the bare name for the outgoing value here
               --   would recreate the exact kind of ambiguity this batch closes elsewhere
handed_off(handoff_plan) ≡ Λ.handed_off = ⊤   -- Λ.handed_off is written ⊤ by Phase 3's handoff (dispatch)
               --   step ALONE — the sole producer, run exactly once, after TC is assembled and the conduct
               --   trace is presented. Mirrors Merismos's emitted(N) ≡ record_handoff presented N (see
               --   merismos SKILL.md TYPES): dispatching the plan to the substrate IS the evidence a plan was
               --   handed off, not a separately asserted flag beside the dispatch. Exactly one ConductedMethod
               --   value exists per invocation — the one Phase 3 builds via TC → converge(...) →
               --   ConductedMethod — so Λ.handed_off = ⊤ unambiguously witnesses THAT value having been
               --   dispatched

-- Consumed from merismos (see merismos/skills/apportion/SKILL.md TYPES for the canonical producer
--   definition; restated here in full so a conduct-only reader is self-contained, per Rule 20):
UnitRef        = a stable identity carried by an emitted unit, assigned at merismos integration; opaque to
               --   this protocol — never re-derived, only compared for equality
PredicateKind  ∈ {completion, invariant}
VerifiablePredicate = an executable check with a determinate pass/fail outcome (command exit status,
               --   test result, countable threshold, file-state assertion). Opaque here: this protocol
               --   never evaluates one — it places WHERE it is evaluated (see satisfies)
Evidence       = { source: String, content: String }   -- where merismos observed what it cites; opaque here
Resolver       = the party, or conjunction of per-move parties, that owes an unresolved definition — an
               --   assigned move's own protocol, /apportion for a delegation move, or the user at execution
               --   for an in-session analysis pass.
               --   Shared by TerminationGround and FiringSite's resolution_required arm
LeafConjunct   = { condition: VerifiablePredicate, kind: PredicateKind }
NonEmptySet(T) = { S: Set(T) | S ≠ ∅ }
CapabilityRequirement = a functional description of what realizing a unit requires — never a concrete
               --   executor, model, runtime or tool token; opaque here, read by the consuming runtime
FeasibilityNote = a free-text feasibility concern merismos read from the goal; opaque here
UnitResolution = DeterminateResolution { predicate: VerifiablePredicate,
                                         conjuncts: Set(LeafConjunct) }
               ⊎ AcceptedUncoveredResolution { accepted_completion_residuals: NonEmptySet(Obligation),
                                                conjuncts: Set(LeafConjunct) }
               -- merismos's CROSS-SEAM TERMINATION CERTIFICATE, restated exactly. Determinate requires at
               --   least one compiled COMPLETION condition and carries the conjoined completion+invariant
               --   predicate plus every typed conjunct. AcceptedUncovered requires no compiled completion
               --   condition and carries the NON-EMPTY completion-residual witness AcceptResiduals recorded,
               --   plus every compiled invariant conjunct. It may therefore have non-empty conjuncts. This
               --   protocol reads the constructor and predicate (see determinate_leaves) but never re-derives
               --   completion kind, acceptance evidence, or conjunct provenance
UnitEntry      = { unit_ref: UnitRef, subject: String, obligations: Set(Obligation),
                   resolution: UnitResolution,
                   capability_requirements: Set(CapabilityRequirement),
                   feasibility_notes: Set(FeasibilityNote) }
               -- restated with EVERY producer field. capability_requirements and feasibility_notes are what
               --   let the consuming runtime bind an executor without re-deriving what merismos already read;
               --   this protocol neither reads nor binds them (Conduction over Substrate), and a consumer view
               --   that omits them makes this seam the place executor-binding information dies
               -- resolution carries each leaf conjunct's provenance (completion vs invariant) in the SAME
               --   certificate as the completion disposition and any accepted-completion witness. This
               --   protocol never re-derives it and CarryPlan must not project it: the typed conjuncts let a
               --   stop-time failure be read as unfinished completion vs violated invariant. An accepted unit
               --   has conjuncts = ∅ only in the residual-only case; when an invariant compiled while
               --   completion remained residual, AcceptedUncoveredResolution carries that invariant conjunct
               -- obligations: opaque here exactly like the rest of this restatement — this protocol's own
               --   topology work never reads or derives from it. Carried because a withdrawn unit's owed
               --   re-apportionment (see HandoffAnnotation, OwedReapportionment) hands the WHOLE UnitEntry
               --   back to /apportion, and /apportion's Pack and Derive operate over Set(Obligation): an entry
               --   with no obligations would name a unit /apportion could accept but not re-apportion — the
               --   consumer this field exists for is that /apportion re-entry, not this protocol
Obligation     = the coverage unit merismos apportioned; opaque here, carried for the consumer past this one
OOSDeclaration = { obligation: Obligation, substrate: String, basis: Evidence }
AcceptedResidualEntry = { obligation: Obligation, unit_ref: Option(UnitRef), kind: PredicateKind }
PlanStateRequirement = { predicate: VerifiablePredicate, basis: Set(Evidence) }
               -- topology-free: contains no UnitRef, Move, MoveRegion, or order-position reference — merismos
               --   states WHEN a plan condition is safe to discharge as a property of plan state alone,
               --   deliberately never as an order fact; binding that requirement to a topology position is
               --   this protocol's job (see PlanConditionBinding)
PlanScope      ∈ {FinalIntegration, GlobalNonRegression, WholeGoalAcceptance} ∪ Emergent(PlanScope)
PlanEntry      = { scope: PlanScope, kind: PredicateKind, condition: VerifiablePredicate,
                   dischargeable_when: PlanStateRequirement }
ConditionBearingUnitPlan = { units: Set(UnitEntry), plan_conditions: Set(PlanEntry),
                             accepted_residuals: Set(AcceptedResidualEntry), oos: Set(OOSDeclaration),
                             unbounded_approved: Bool }
               -- the incoming artifact when WP originates from /apportion. ALL FIVE fields are restated
               --   because the producer emits all five: the last three are the qualifying facts —
               --   obligations accepted as uncovered, obligations delegated out of scope with their
               --   substrate, and the whole-goal acceptance waiver — that merismos emits as a plan-envelope
               --   entry rather than leaving to its trace, precisely so they survive the session
               --   discontinuity that neither its trace nor its in-memory return does.
               --   A consumer view that restates only units and plan_conditions ERASES them at the seam,
               --   which is the one loss this handoff was designed to prevent. This protocol does not read
PlanEnvelopeEntry = { accepted_residuals: Set(AcceptedResidualEntry), oos: Set(OOSDeclaration),
                      unbounded_approved: Bool }
GoalEntry      = UnitEntry ⊎ PlanEntry ⊎ PlanEnvelopeEntry
E              = Set(GoalEntry)  -- the durable /apportion record set reached through a navigation block
N              = NavigationBlock { purpose_frame: String, canonical_locator: HandoffLocator,
                                    dereference_instruction: DereferenceInstruction, snapshot_anchor: Option(String),
                                    grounding_instruction: GroundingInstruction }
               -- the fixed cross-session shape: purpose/frame, canonical locator, dereference instruction,
               --   optional snapshot anchor only when exact-state determinacy is needed, and the instruction
               --   to run /inquire where available (or equivalent grounding) and stop on an unreachable
               --   source or unsupported load-bearing premise. It is a pointer, never a copied plan
HandoffLocator = the durable identity of E
DereferenceInstruction = an instruction to read E at the canonical locator
GroundingInstruction = the fixed instruction to run /inquire where available, or the recipient's equivalent
               --   grounding pass, and stop when a source is unreachable or a needed premise lacks
               --   support-integrity
PI             = PlanInput ∈ LivePlan(ConditionBearingUnitPlan) ⊎ Navigation(N) ⊎ NoPlan
ReadPlan(E)    = ConditionBearingUnitPlan {
                   units: {e∈E | e is UnitEntry}, plan_conditions: {e∈E | e is PlanEntry},
                   accepted_residuals: envelope(E).accepted_residuals, oos: envelope(E).oos,
                   unbounded_approved: envelope(E).unbounded_approved }
               -- envelope(E) is E's unique PlanEnvelopeEntry. ReadPlan is the five-field readback operation;
               --   it derives no field from session memory and cannot project away the qualifying facts
I              = Option(ConditionBearingUnitPlan)  -- written by bind_I after PI resolves at Phase 0;
               --   None only for the explicit NoPlan constructor. A supplied Navigation that cannot be
               --   dereferenced or grounded deactivates instead of silently becoming None

region_of(v)   = the MoveRegion move_assignment placed UnitMoveBinding(v.unit_ref) in
units_of(r)    = { v ∈ I.units | region_of(v) = r }   -- the incoming units whose moves landed in r
               -- both are DERIVED projections of move_assignment ∘ UnitMoveBinding, defined here rather
               --   than used bare: a region-keyed clause that names no way to compute its region is the
               --   same unproduced assertion this contract has been closing
determinate_leaves(r) = { d | v ∈ units_of(r),
                             DeterminateResolution { predicate: d, ... } = v.resolution }
               -- the subset of units_of(r) merismos compiled a real predicate for; what grounds_termination
               --   conjoins (see UnitGroundDisposition). An AcceptedUncovered unit contributes nothing here —
               --   there is no predicate to conjoin — but it still receives grounds_termination(g) for the
               --   region's shared g: the disposition names WHICH ground the region resolves under, not a
               --   claim that this unit's own resolution predicate feeds it
UnitMoveBinding = total Map(UnitRef → Move)   -- ties each incoming unit to the Move this protocol arranges
               --   for it; total over I.units so no incoming unit is silently dropped from the topology.
               --   FUNCTIONAL by the Phase 1 Sc guard stamp_functional, which Confirm(MS') evaluates before
               --   accepting a selection. Without it the derivation below is a relation, not a map, and
               --   region_of(v) has no single value to return.
               --   DERIVED, not asserted: { (m.unit_ref, m) | m ∈ MS, m.unit_ref ≠ None } — Phase 1 MoveId
               --   stamps the ref onto the move, so this map is read off MS itself. Totality over I.units is
               --   the Phase 1 guard: a unit with no stamped move is a dropped unit, surfaced there
UnitConditionBinding = {
  unit_ref: UnitRef, move: Move, region: MoveRegion, disposition: UnitGroundDisposition
}              -- per incoming unit: where its move landed, and what its already-compiled predicate does there
UnitGroundDisposition =
    grounds_termination(g)
      where g = stated_condition(ref(⋀ determinate_leaves(region)))   when determinate_leaves(region) ≠ ∅
              = resolution_required(/apportion)                       when determinate_leaves(region) = ∅
      -- the region's resolved termination is until_goal_met, so its DeterminateResolution predicates
      --   are what make "goal met" determinate for it — recorded BY REFERENCE, never re-derived (see
      --   TerminationGround). The reference is the CONJUNCTION over determinate_leaves(region), not one
      --   unit's predicate and not the whole units_of(region): TerminationGround carries exactly ONE ground per
      --   region, so a multi-unit region whose units each claimed to ground it would emit contradictory
      --   bindings against a single-valued trace. All-never-any, mirroring protocol_contract's own rule
      --   that a region completes when EVERY conducted move reaches its cited convergence
      -- WHEN EVERY unit of the region carries AcceptedUncoveredResolution (determinate_leaves(region) = ∅), no compiled
      --   completion predicate exists anywhere in the region to conjoin — conjoining the empty set would reproduce, one
      --   layer downstream, the exact vacuous-TRUE defect merismos's UnitResolution exists to close.
      --   TerminationGround's own precedence falls through stated_condition to resolution_required in
      --   exactly this circumstance; the resolver is /apportion, per TerminationGround's established
      --   per-move rule for a delegation move — the acceptance is already on record there, and /conduct has
      --   nothing determinate left to cite. Every unit the region holds still receives grounds_termination(g)
      --   for this shared g: the disposition names which ground the region resolves under, not a claim that
      --   every named unit's own resolution feeds it
  ⊎ executor_enforced(CoverageLimit)
      -- the region's termination resolved to single_pass, bounded_rounds or until_dry_ceiling, so the region
      --   stops on its own axis value and the unit's resolution is NOT its stop criterion. The executing
      --   substrate still enforces the executable conditions that resolution actually carries inside the
      --   unit's interval; an accepted completion residual stays accepted rather than becoming a predicate.
      --   Conduct's region can therefore complete without determinate unit completion, an uncovered extent,
      --   so this arm CARRIES the CoverageLimit that
      --   records it. Recording the limit is what keeps the mismatch from being silent; TerminationGround
      --   exists only for until_goal_met regions, so an unconditional stated_condition ground would be a
      --   claim the type system cannot honour
FiringSite     = TopologyFrontier(Set(MoveRegion)) ⊎ terminal ⊎ resolution_required(Resolver, Set(MoveRegion))
               -- WHERE a plan condition becomes authoritative, expressed over the RESOLVED topology's regions
               --   — never over merismos's pre-conduct units or order-positions. A FRONTIER (a set of
               --   regions), not a single region: parallel_fan and dependency_dag topologies can make a plan
               --   condition depend on several incomparable branches at once, and a single named region would
               --   recreate the same order-coupling defect merismos's dischargeable_when was built to avoid.
               --   resolution_required(resolver, affected): no sound frontier exists in the resolved topology
               --   for this condition's dischargeable_when — RECORDED rather than fabricated, mirroring
               --   TerminationGround's own resolution_required, and carrying its OWN payload rather than
               --   pointing at one: the resolver that owes the resolution, and the regions the unresolved
               --   condition bears on. It cannot borrow the affected regions' termination grounds, because
               --   those exist only for until_goal_met regions — an unresolved binding with nothing typed to
               --   follow is an unactionable record, not a disclosure
PlanConditionBinding = { plan_entry: PlanEntry, site: FiringSite }
               -- binds an incoming plan-level condition to the topology position where its
               --   dischargeable_when requirement is satisfied, OR to resolution_required when no such
               --   position exists — every incoming plan condition gets exactly one binding, never a silent
               --   drop, but a recorded binding is not always a grounding one
completes(region, CT) ≡ every move CT assigns to region has reached the stop its region's resolved
               --   termination axis value defines — until_goal_met at its recorded TerminationGround,
               --   single_pass after one pass, bounded_rounds at its bound, until_dry_ceiling at its ceiling.
               --   Defined over ALL FOUR termination values on purpose: a completion test that only held for
               --   until_goal_met regions would leave every ordinary topology unable to carry a firing site
satisfies(site, req, CT) ≡
     (site = resolution_required(_, _) ⟹ FALSE)
               -- explicit, not omitted: a missing case would make this predicate vacuously TRUE for the
               --   fallback constructor, so the convergence disjunction could be satisfied by BOTH arms
               --   and an unresolved binding would read as a sound one. resolution_required is the
               --   admission that satisfies() found nothing; it can never itself satisfy
   ∧ (site = terminal            ⟹ ∀ region ∈ {r | (_, r) ∈ range(move_assignment)} : completes(region, CT)   -- NOT automatic: range(move_assignment) contains ⟨order_position, region⟩ pairs, so the region projection is explicit; a region whose termination is until_goal_met with a resolution_required ground has no determinate stop, so it does not complete, and terminal then fails too
        ∧ terminal is past every region, hence past every invalidator of req.predicate under CT —
          the ONLY site for which the past-every-invalidator obligation discharges structurally rather
          than by inspecting req; a terminal binding is always sound and always the latest possible)
   ∧ (site = TopologyFrontier(F) ⟹ F ⊆ {region | (_, region) ∈ range(move_assignment)}
        ∧ ∀ region ∈ F : completes(region, CT)
        ∧ ∀ region ∉ F reachable after F completes under CT's resolved order/dependency shape :
            ¬can_invalidate(region, req)  — F sits at or past every possible INVALIDATOR of req, not past
            every region: a frontier is rejected only by regions that could actually falsify req.predicate)
can_invalidate(region, req) ≡ some move CT assigns to region acts on what req.predicate reads, judged
               --   against req.basis — the evidence merismos cited for the requirement is what says which
               --   work bears on it. An AI judgment over the topology, surfaced with its basis at the
               --   binding, not a decidable structural test; stated as such rather than implied
affected_regions(req) ≡ {r | (_, r) ∈ range(move_assignment) ∧ can_invalidate(r, req)}
               -- the exact region payload BindPlanConditions writes on resolution_required; derived from
               --   the same basis-bearing invalidation judgment satisfies uses, never supplied ad hoc
resolution_resolver(affected) = the Resolver derived for the moves assigned to affected by TerminationGround's
               --   per-move precedence; multiple owners form the conjunction that must discharge the binding
earliest(S₁, S₂, CT) ≡ defined over FiringSite, not over region sets alone: the minimality clause compares a
               --   candidate against a BOUND site, and the bound site is terminal on the most ordinary path
               --   (plan_terminal), so a region-set-only definition would leave exactly that case undefined
               --   S₁, S₂ both TopologyFrontier: every region of S₁ completes no later than every region of
               --     S₂ under CT's resolved order
               --   S₂ = terminal, S₁ a frontier: TRUE — terminal sits past every region, so every frontier is
               --     at or before it. This is what makes minimality BITE on the terminal fallback: any
               --     satisfying frontier now beats terminal, rather than terminal being incomparable and safe
               --   S₁ = terminal: TRUE only when S₂ = terminal
               --   either side resolution_required: FALSE — satisfies() already rejects it, and a site that
               --     cannot satisfy cannot compete for minimality
               -- "first evaluable" (req.predicate can be checked) and "safe to discharge" (the site sits past
               --   every possible invalidator) are different tests; satisfies() checks the latter — a
               --   frontier where req merely becomes computable, while a later region could still invalidate
               --   it, does NOT satisfy this predicate
               -- SCOPE, stated rather than implied: this is a DESIGN-TIME predicate over the resolved
               --   topology. It establishes that the site is a POSITION at which req.predicate is
               --   authoritative; whether req.predicate actually HOLDS there is a runtime fact the executing
               --   substrate evaluates. Conduct fixes the where, never the whether — asserting the latter
               --   here would claim an evaluation this protocol never performs
deciding_divergence(p, CT) : Option(axis × MoveRegion) = TOTAL — a genuinely partial judgment restated as a
               --   total function into an explicit Option so every reader of it (CONVERGENCE included) stays
               --   Boolean rather than inheriting an undefined case (R8):
               --   = Some((axis, region))   when (axis, region) is the pair whose resolved CT value is what
               --       makes p's OWN candidate sound sites diverge: {S | satisfies(S, p.dischargeable_when,
               --       CT)} contains ≥2 members with materially different downstream futures (an AI judgment
               --       over the topology, in the same sense can_invalidate and earliest already are)
               --   = None                    when at most one sound site exists for p under the CURRENT CT,
               --       or when several sound sites exist but agree on downstream future
               --   This is the SAME axis·region BindPlanConditions re-opens when it finds
               --   materially-divergent sound frontiers for p (see LOOP, During Phase 2, Condition binding)
               --   — the pair is p-SPECIFIC by construction, never a wildcard over any past reopening: an
               --   axis reopened for a DIFFERENT plan condition's divergence, or one whose value has SINCE
               --   resolved p's own sound sites down to a single survivor, is not p's deciding_divergence and
               --   cannot license resolution_required for p. Rule 20's narrow ground ("the divergence that
               --   would choose between sound sites") is this predicate, formalized; Λ.reopened_divergences
               --   stays the flat, never-pruned, axis-loop-bounding set it always was — a DIFFERENT job (see
               --   LOOP, During Phase 2, and MODE STATE) — deciding_divergence is what ties that global
               --   record back to one p at a time, re-evaluated against the CURRENT CT rather than the CT at
               --   the moment of reopening
InvalidateTopologyProducts =
                 Λ.residuals := ∅;
                 Λ.degradations := ∅;
                 Λ.move_assignment := ∅;
                 Λ.checkpoints := ∅;
                 Λ.unit_condition_bindings := ∅;
                 Λ.plan_condition_bindings := ∅
               -- fires BEFORE a deciding-divergence back-edge mutates CT. These are exactly the values whose
               --   meaning is derived from one complete topology pass; historical/bounding state
               --   (reopened_divergences, withdrawn_units, elicitation_cycle) is deliberately preserved.
               --   surfaced_axes is neither one of these six cleared fields nor left untouched here: the SAME
               --   back-edge removes exactly the deciding (axis, region) pair from it immediately after this
               --   step, before re-surfacing that pair (see LOOP, During Phase 2) — its fate is bound to the
               --   axis reopening, not to this clearing step.
               --   FinalizeTopology, AssignMoves, RegisterCheckpoints, BindUnitConditions, and
               --   BindPlanConditions then replace every cleared value from the revised CT before Phase 3 is
               --   reachable. Thus no partially old product is a representable handoff state

── WP-BINDING ──
bind(WP) = explicit_arg ∪ colocated_expr ∪ prev_user_turn ∪ ai_identified_prospect
Priority: explicit_arg > colocated_expr > prev_user_turn > ai_identified_prospect

/conduct "text"              → WP = "text"
/conduct (alone)             → WP = the work prospect under discussion
"how should I approach..."   → WP = the work named before the trigger
AI-detected trigger          → WP = the multi-move prospect AI identified (Hybrid: user confirms at the Phase 0 guard gate)

PI (bound alongside WP) = LivePlan(plan) when the /apportion plan is still a live value;
                          Navigation(N) when the explicit argument, colocated expression, or prior user turn
                          carries Merismos's navigation block; NoPlan only when neither carrier is present
I = LivePlan(plan) → Some(plan) | Navigation(N) → DereferencePlan(N) → ReadPlan(E) → Some(plan) |
    NoPlan → None. A failed dereference or support-integrity check stops and deactivates; it never selects None

── PHASE TRANSITIONS ──
Phase 0: WP → BindPlanInput(WP) → PI → [LivePlan(plan): bind_I(Some(plan)) | Navigation(N): DereferencePlan(N) → (unreachable ∨ support-integrity failure: relay(handoff unreadable) → deactivate | E → ReadPlan(E) → plan → bind_I(Some(plan))) | NoPlan: bind_I(None)] → MethodBrief(WP) → guard[relay-test, anti-self-application] → warrant? → [warrant=relay: relay_route(extension) → deactivate | warrant=warranted: Qc(brief, conduction-warrant) → Stop → continue]   -- a supplied locator has an explicit dereference/readback path and cannot silently fall through to I=None; the guard decides warrant BEFORE the gate opens; only a warranted (multi-move, non-trivial) brief presents Qc [Tool]
Phase 1: (WP, PG) → MoveId(WP × PG) → [|MS| exceeds a recognition bundle ∨ cross-graph: SalienceRank(MoveSet, brief.work_intent) (extension: salience-ranked relay presentation, basis = aim + accumulated shape) | flat] → Sc(MoveSet) → Stop → A_s →                                                                      [Tool]
           A_s = Confirm(MS')      → [I ≠ None ∧ ¬stamp_functional(MS'): re-present Sc naming the units with more than one stamped move, and the units with none — NOT accepted | MS := MS' →
                                       [|MS| = 1 ∧ withdrawn_units = ∅: relay-route to the surviving move's protocol (reusing the Phase 0 relay emission), deactivate
                                       | |MS| = 1 ∧ withdrawn_units ≠ ∅: PresentOwedReapportionment(withdrawn_units) → relay-route to the surviving move's protocol AND present {owed_reapportionment(w) | (w, r) ∈ withdrawn_units} directly in that same relay text — a withdrawal already incurred travels even on the relay exit
                                       | |MS| = 0 ∧ withdrawn_units = ∅: relay(no move survives — every candidate was deselected, nothing to conduct or route to), deactivate  -- R9: |MS| < 2 is NOT one outcome — |MS| = 1 has a surviving protocol to route to, |MS| = 0 has none, so this sub-case names its own outcome rather than a false "surviving move's protocol"
                                       | |MS| = 0 ∧ withdrawn_units ≠ ∅: PresentOwedReapportionment(withdrawn_units) → present {owed_reapportionment(w) | (w, r) ∈ withdrawn_units} as the relay text (no surviving protocol exists to route to), deactivate  -- R9: the owed obligation still travels even though nothing survives to relay-route to
                                       | Phase 2]]
                                     -- stamp_functional is CHECKED HERE, not merely described in TYPES: it is what makes UnitMoveBinding a map
                                     -- PresentOwedReapportionment is this exit's OWN producer (both the |MS|=1 and |MS|=0 withdrawn_units≠∅ sub-cases): this branch deactivates before Phase 3's AnnotateWithdrawals
                                     --   ever runs, so no SH value is ever constructed on this path and Λ.substrate_handoff stays None — the annotation
                                     --   cannot ride substrate_handoff.annotations here. The relay presentation IS the read: producing and surfacing happen
                                     --   in the same TextPresent+Proceed step, satisfying A2 visibility (basis_cited, timing immaterial) without a
                                     --   ConductedMethod to hold the record. This path never yields conducted(WP) (no ConductedMethod is ever built), so
                                     --   CONVERGENCE's owed_reapportionment clause does not — and need not — cover it; see TOOL GROUNDING
           A_s = Withdraw(units)   → Λ.withdrawn_units ∪= { (u, u.unit_ref) | u ∈ units }  -- the WHOLE UnitEntry is kept, not just its ref: /apportion cannot re-apportion a unit whose obligations, subject, conditions and capability requirements were discarded
                                     ; I := I with those units removed from I.units, every accepted_residual whose unit_ref is now dangling re-pointed to None (the obligation stays accepted-uncovered, it just no longer names a unit that left), and every plan condition retained
                                     → re-present Sc over the reduced plan
                                     -- offered only when I ≠ None and the confirmed selection would strand a unit. The withdrawal is RECORDED, not a silent drop:
                                     --   the stranded units travel in the handoff annotation as an owed re-apportionment to /apportion, the same owed-resolution shape
                                     --   TerminationGround uses. Removing them from I is what makes UnitMoveBinding's totality reachable again — without this arm the
                                     --   gate could offer withdrawal while no state update implemented it, and convergence stayed unreachable with no repair path
           A_s = Esc               → deactivate (loop termination at LOOP level)
Phase 2: MS → CT_default_surface(extension: present CT_default + basis as pre-gate text) → loop( AxisGate(next axis·region, impact/leverage-first — most-constrained first: default + basis + per-value differential implications; [reconciliation axis ONLY: + ⨾/∥ composites + affordance]) → Stop → VM ∈ {Select | Compose(reconciliation only) | Reorient | Sufficient} → update(CT, surfaced_axes, elicitation_cycle) → [VM=Sufficient: exit | last axis·region surfaced ∧ ¬Sufficient: implicit-Sufficient(relay) | else: auto-advance(relay) to next axis·region] ) until Sufficient ∨ all-axes-resolved → FinalizeTopology(track: replace CT + residuals + topology-derived degradations) → AssignMoves(track: replace move_assignment) → RegisterCheckpoints(track: replace checkpoints from checkpoint_set(WP, CT)) → [I ≠ None: BindUnitConditions(track: replace) → BindPlanConditions(track: replace) → (materially-divergent sound frontiers for some plan condition: InvalidateTopologyProducts(track) → record deciding pair in reopened_divergences → re-open that axis·region → back into the axis loop above, bounded by the same Sufficient/Esc agency | else proceed)] → converge(topology trace)   -- warranted means differential topology futures exist: CT_default is surfaced as the default, but the first AxisGate always yields the turn; silence carries Stop and selects no topology. Every exit from the loop materializes one complete replace-only topology pass before Phase 3; a back-edge invalidates its products before revising CT, so no earlier checkpoint, binding, residual, assignment, or topology-derived degradation can survive into the handoff [Tool]
Phase 3: CT → SubstrateFeasibility(extension) → SH → AnnotateWithdrawals(track) → CarryPlan(track) → CompileCheckpointBrief(track) → RecordDegradation(track) → AssembleTraceContract(track) → TC → converge(conduct trace incl. trace contract + checkpoint briefs + condition bindings) → handoff(ConductedMethod) → deactivate   -- per-topology substrate realizability annotation, attach every owed re-apportionment (∅ when no unit was withdrawn) to SH.annotations, compile EVERY registered checkpoint's decision-typed Recognition brief, record substrate_infeasible degradations, assemble the cross-cutting disclosure overlay (residuals + degradations + coverage caps + termination grounds, including every executor_enforced unit disposition's CoverageLimit), surface the conduct trace, then hand off the plan (execution out of scope). SubstrateFeasibility computes and surfaces the feasibility verdicts as relay text but, per its own (extension) classification, mutates no Λ field; AnnotateWithdrawals is the (track) step immediately after that folds that computed feasibility together with the withdrawal annotations into the FIRST write of Λ.substrate_handoff := Some(SH). The condition bindings and checkpoints arrive from the final Phase 2 materialization pass only [Tool]

── LOOP ──
After Phase 0 (Method Brief + Warrant):
  warrant = relay     → relay-route to the single resolving protocol, emit it as the routing, deactivate (conduction not needed)
  warrant = warranted → Phase 1 → Phase 2 → Phase 3
  -- Esc key → terminate (no plan emitted)

During Phase 2 (Conduct Design — topology elicitation):
  Entry surface: present CT_default + basis as pre-gate relay text, then open the first AxisGate and yield. Because warrant=warranted means multiple topology futures exist, the default is a surfaced candidate, not an Extension-selected method; silence carries Stop. Selecting Sufficient at this first gate is the explicit user path that binds the remaining axes to their Gen defaults.
  Each cycle surfaces the single most decision-relevant UNSURFACED axis·region by impact/leverage — the most-constrained axis first (the one whose values most divide the downstream conduct-plans), NOT a fixed order — together with the running elicitation-cycle count (Λ.elicitation_cycle, read into AxisGate.cycle), mirroring apportion's cycle_n at every Qu. Impact/leverage-first ordering IS the design kernel: every surfaced axis·region is settled at its own gate this cycle — Select, Compose, or Reorient — or left to its Gen default when the loop ends by Sufficient. A decision defers past design time only when its deciding evidence does not yet exist: synthesis output shape generally, and decompose-recovery membership refinement when WP carries `/ground`'s candidate partition. Neither enters this loop as a Gen-typed axis; each registers through the same generic Checkpoint record after topology finalization. Each move integrates one ConductMove and updates MODE STATE:
    VM = Select(value)  → record axis·region → Gen(value) in CT; surfaced_axes ∪= {(axis, region)}; elicitation_cycle += 1; auto-advance to next axis·region  -- no degradation accumulator write here: FinalizeTopology derives and REPLACES independence_relaxed records from the complete current CT
    VM = Compose(op)    → [reconciliation axis ONLY] record reconciliation → Compose(RVᵣ, RVᵣ, op) in CT; surfaced_axes ∪= {(reconciliation, region)}; elicitation_cycle += 1; auto-advance
    VM = Reorient(axis) → [region-aware, mirrors Select/Compose] remove the (axis, region) pair from surfaced_axes and CT[axis][region], re-surface the reframed (axis, region); elicitation_cycle += 1 (does NOT auto-advance) — sibling-region resolutions of the same axis are preserved
    VM = Sufficient     → a move in the axis gate (NOT a separate gate): exit elicitation → FinalizeTopology fills every unresolved axis·region with its Gen default and REPLACES Λ.residuals with exactly one DefaultBound ResidualAxis per final-CT value that remains unconstituted (including an unchanged default retained across a condition-binding re-entry)
    EXHAUSTION (all axis·regions surfaced ∧ ¬Sufficient) → implicit Sufficient (relay): exit with the now-complete CT → FinalizeTopology replaces Λ.residuals with ∅
  BOUND: the loop is bounded by user agency — the user's Sufficient move or Esc-Stop terminates it. The seed axis set is FINITE, so each unsurfaced axis·region auto-resolves to its Gen default, and the finite set guarantees a terminal. This is NOT loop-until-fixpoint.
  Checkpoint registration (defer-volatile kernel, track — deterministic, never gated; adds no cycle): RegisterCheckpoints REPLACES Λ.checkpoints with checkpoint_set(WP, CT) after every FinalizeTopology pass. The synthesis comprehension registers each qualifying region at its reconciliation point, including the trivial-default topology; the decompose-recovery singleton registers its cell-assignment decision before the whole induce-fan. No checkpoint from an earlier CT can survive a later pass, and every registered checkpoint reaches Phase 3's compiler.
  Condition binding (only when I ≠ None — an incoming /apportion plan; track, deterministic except for the one back-edge below). Once CT resolves, each incoming unit's move is already stamped with its unit_ref from Phase 1, so UnitMoveBinding is read off MS directly and BindUnitConditions REPLACES its set with one current binding per unit. BindPlanConditions likewise computes one complete replacement set over the current plan and topology. BACK-EDGE: when several sound frontiers carry materially different downstream futures, InvalidateTopologyProducts first clears every topology-derived output (residuals, topology-derived degradations, assignment, checkpoints, and both binding sets); only then is the deciding axis·region removed from surfaced_axes/CT, recorded in reopened_divergences, and re-surfaced. The loop re-enters at that gate, bounded by the same Sufficient/Esc agency. On exit, FinalizeTopology, AssignMoves, RegisterCheckpoints, BindUnitConditions, and BindPlanConditions all REPLACE their products from the revised CT before Phase 3 is reachable. Historical reopened_divergences stays monotone solely to bound re-opening; deciding_divergence(p, CT) re-evaluates p against current CT so an unrelated or resolved historical pair cannot license fallback. This replace-only pass is the lifecycle contract: exact-one binding clauses and the handoff read only the final pass, never a union of passes.
  converge(topology trace) → Phase 3. Esc key → tool-level termination (no plan emitted).

After Phase 3 (Handoff):
  Hyphegesis conducts to the LAST checkpoint in CheckpointSet, then downstream-delegates (multi-consumer-like) — execution and anything past the last in-session checkpoint belong to the substrate or to the routed protocol. The span ends at the next planned /compact or /clear, which the user types; Hyphegesis does not detect or emit that wall.
  A checkpoint may re-open Constitution mid-execution (its conduct can change there), but the design goal is to settle the highest-impact axis·region first (Rule 4's impact/leverage-first order) so re-decision is rare.
  At a synthesis checkpoint, the substrate executes the compiled CheckpointBrief: per-move outputs with their convergences, divergences, and decision axes as pre-gate relay text (basis cited from the move outputs; context separate from the question); private-gap slots typed by the contracted limit categories and filled from what each move actually reported, for the user to fill or decline; then the output-shape and fusion-result candidates with differential implications as the Constitution gate — re-opening Constitution exactly where the deferred decision lives. The two candidate sets carry a normative order: output shape is the organizing unit, so when both are live the shape decision resolves first and the fusion candidates are expressed in the selected unit (dependent narrowing); whether the substrate realizes this as one combined presentation or successive turn-yields is its discretion at the realization layer. The option-set relay test applies to each candidate set independently — either set converging to a single dominant candidate is presented as relay. On a region carrying a substrate_infeasible degradation that affects the checkpoint's own in-session realization, the degradation record takes precedence: the brief of the checkpoint keyed to that region is advisory rather than binding — the substrate realizes what it can and keeps the degradation surfaced. An infeasibility affecting only a post-checkpoint downstream concern (e.g. no durable record surface for a handoff_to_span region's externalization bridge) leaves the in-session fusion checkpoint binding — the fusion is constituted in-session regardless — and surfaces as an externalization/routing degradation (the constituted output cannot bridge), not a demoted fusion gate. Hyphegesis compiles this contract; the substrate performs it — the handoff boundary is unchanged.
  At a cell-assignment checkpoint, the substrate executes CellAssignmentBrief before the induce-fan: re-read `/ground`'s partition and candidate cells through their references as pre-gate evidence, then present the typed membership judgments. Assign places a fitting member or outlier in exactly one existing cell; NarrowOut removes a trim_outlier from the re-forming seed. Silence carries Stop and changes no membership. The refined membership is what the already-registered per-cell moves read; the checkpoint never creates a late move.

Continue until convergence: warrant=relay deactivation, ConductedMethod handed off, or user Esc key.

Convergence evidence: At handoff, present every withdrawn incoming unit with the resolver that owes its re-apportionment (∅ when none were withdrawn) — a withdrawal is a recorded owed obligation, never a silent reduction of the incoming plan, and — when the carried plan carries a WholeGoalAcceptance condition — a visible note that its count-based discharge is blocked until the resolver's re-apportionment restores unit parity, by design — AND the per-move trace — for each Move, show (Move → its ⟨order_position, region⟩ in CT) — AND the per-axis topology trace — for each resolved axis·region, show (axis·region → ConductMove → value, default-bound → Gen default + DefaultBound) — AND the SubstrateHandoff annotations and the exact current-pass CheckpointSet (with every checkpoint's decision-typed compiled CheckpointBrief) — AND, when I ≠ None, the condition-binding trace: each incoming unit's UnitConditionBinding (unit_ref → move/region → the termination ground it now grounds) and each incoming plan condition's PlanConditionBinding (plan_entry → its resolved FiringSite, or resolution_required when no sound frontier exists) — AND the trace contract: the cross-cutting disclosure overlay (every final-pass residual, every degradation, every coverage cap the topology imposes, and every until_goal_met region's termination ground — a resolution_required ground shown with its owed resolver), never silent. Convergence is demonstrated, not asserted.

── CONVERGENCE ──
conducted(WP) = handed_off(handoff_plan)
              ∧ dom(move_assignment) = MS                                             -- exactly the selected moves are placed: no assignment from a superseded topology pass survives
              ∧ checkpoint_registry_projection(checkpoints)
                  = checkpoint_registry_projection(checkpoint_set(WP, CT))                 -- exact current-pass registry: compilation changes only brief, so compare the identity-bearing fields
              ∧ (∀c∈checkpoints:
                   c.brief = Some(compile_checkpoint_brief(c, WP, CT, MS)))                 -- every and only current registered decision carries its exact decision-typed compiled brief
              ∧ substrate_handoff ≠ None                                            -- AnnotateWithdrawals materialized the current topology's feasibility carrier before handoff
              ∧ residuals = default_bound_residuals(CT, surfaced_axes)                 -- exact final-pass default disposition set, including retained default values after re-entry
              ∧ degradations = topology_degradations(CT)
                                   ∪ substrate_degradations(substrate_handoff, CT)       -- exactly current-topology relaxations and current substrate infeasibilities; no stale pass survives
              ∧ trace_contract ≠ None                                               -- the disclosure overlay is assembled, never omitted
              ∧ trace_contract.residuals = residuals                                -- exact readback of every surfaced residual, with no omission or extra
              ∧ trace_contract.degradations = degradations                          -- exact readback of every recorded degradation
              ∧ trace_contract.coverage_limits = derived_coverage_limits(CT, unit_condition_bindings)
              ∧ trace_contract.termination_grounds = derived_termination_grounds(CT, MS, move_assignment, I)
              ∧ (I ≠ None → carried_plan = Some(I))                                -- the seam carries I through unchanged AS OF PHASE 3 — field-by-field equality against I's value THEN, never a projection of it; a unit Withdraw already removed from I at Phase 1 (R11) is not a case of this clause being violated, since I itself no longer holds it by the time this is checked — that unit's content travels instead via owed_reapportionment (see below)
              ∧ (I = None → carried_plan = None)
              ∧ (I ≠ None → ∀(w, r) ∈ withdrawn_units: r ∉ {u.unit_ref | u ∈ I.units}                -- a withdrawn unit is out of the carried plan…
                                       ∧ owed_reapportionment(w) ∈ substrate_handoff.annotations)  -- …and its re-apportionment is an annotation carrying the WHOLE withdrawn UnitEntry, the same payload the Phase 3 annotation step writes: an annotation holding only the ref would name a unit /apportion can no longer read, which is a silent reduction wearing a record's shape
              ∧ (I = None → withdrawn_units = ∅)                                   -- Withdraw is offered only when I ≠ None (Phase 1 Sc), so no unit is ever withdrawn on the self-identified-move-set path; guarded locally like its two neighbours above, rather than through the distant I=None-implies-no-withdrawals invariant
              ∧ (I ≠ None →
                   (∀u ∈ I.units: ∃! b ∈ unit_condition_bindings :
                        b.unit_ref = u.unit_ref
                      ∧ b.move = UnitMoveBinding(u.unit_ref)                        -- the binding names the move actually arranged for it
                      ∧ (_, b.region) = move_assignment(b.move)                     -- and the region that move was actually placed in
                      ∧ (b.disposition = grounds_termination(g)
                           ⟺ CT[termination][b.region] = until_goal_met)                -- the ground arm holds exactly when the region can carry it; CT[axis][region] is the SAME indexing TYPES already establishes (see ConductedMethod, "all five axis values per move are recoverable from ⟨order_position, region⟩ + CT") — termination(b.region) was never a defined operator
                      ∧ (b.disposition = grounds_termination(g) →
                           (determinate_leaves(b.region) ≠ ∅ → g = stated_condition(ref(⋀ determinate_leaves(b.region))))
                         ∧ (determinate_leaves(b.region) = ∅ → g = resolution_required(/apportion)))
                                                                                    -- every unit of one region names the SAME ground: the conjunction over that region's DETERMINATE units, or — when none are — the resolution_required fallback TerminationGround's own precedence names, matching TerminationGround's one-ground-per-region shape either way
                      ∧ (b.disposition = executor_enforced(cl) → cl ∈ trace_contract.coverage_limits))
                 ∧ (∀p ∈ I.plan_conditions: ∃! b ∈ plan_condition_bindings :
                        b.plan_entry = p ∧ ((b.site = resolution_required(resolution_resolver(affected), affected)
                                             ∧ affected = affected_regions(p.dischargeable_when)
                                             ∧ affected ≠ ∅
                                             ∧ (¬∃ S : satisfies(S, p.dischargeable_when, CT)          -- …licensed ONLY on its two documented grounds:
                                                ∨ (∃ dd : deciding_divergence(p, CT) = Some(dd) ∧ dd ∈ reopened_divergences))  -- no site satisfies at all, or
                                                                                                          --   p's OWN deciding divergence was
                                                                                                          --   already re-opened once and still stands
                                             ∨ (satisfies(b.site, p.dischargeable_when, CT)
                                                ∧ ¬∃ S₂ : satisfies(S₂, p.dischargeable_when, CT)
                                                          ∧ earliest(S₂, b.site, CT) ∧ S₂ ≠ b.site))))
                                                                                    -- the fallback arm carries its OWN precondition: unguarded, it would let any plan condition be discharged into resolution_required and still converge, which turns the honest-disclosure constructor into a universal escape. The prose in BindPlanConditions and Rule 20 already names both grounds; this is where they become checkable. deciding_divergence(p, CT) is what ties the second ground to p SPECIFICALLY — a wildcard over ANY reopened (axis, region) intersecting affected would let an unrelated plan condition's reopening, or one since resolved to a single sound survivor, wrongly discard a p with a sound unique binding
                                                                                    -- earliest-minimality is a CONVERGENCE clause, not a prose preference in BindPlanConditions: without it, terminal satisfies everything and the resolve could always take it
              ∧ (I ≠ None → ∀b ∈ unit_condition_bindings: ∃u ∈ I.units: b.unit_ref = u.unit_ref)
              ∧ (I ≠ None → ∀b ∈ plan_condition_bindings: b.plan_entry ∈ I.plan_conditions)
                                                                                    -- reverse correspondence closes replacement exactness: no binding from a superseded CT or withdrawn unit/condition can survive as an extra while every current entry still has one
              ∧ (I = None → unit_condition_bindings = ∅ ∧ plan_condition_bindings = ∅)
-- the two apportion-origin conjuncts are vacuously true when I = None: this protocol also arranges
--   self-identified move sets that carry no incoming unit or plan-condition set to bind.
-- a resolution_required binding is a RECORDED disclosure, not a convergence failure — every incoming plan
--   condition still gets exactly one binding; the disjunction is what lets Rule 20's "surface unresolved
--   rather than fabricate" hold without ever leaving a plan condition unbound and unaccounted for. Its own
--   precondition is what keeps it a disclosure rather than an exit: an unresolved binding is honest exactly
--   when nothing could have satisfied the requirement, or when THIS p's OWN deciding divergence — the
--   axis·region that would have chosen between ITS sound sites — has already had its one re-opening.
-- handoff_plan (the ConductedMethod value — see TYPES) is well-formed exactly when conducted(WP) holds.

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 BindPlanInput (sense)        → Internal analysis (classify the incoming carrier as LivePlan, Navigation, or NoPlan; a supplied navigation block is never collapsed to NoPlan)
Phase 0 DereferencePlan (observe)    → TaskGet, Read (when PI = Navigation(N): follow N.dereference_instruction at N.canonical_locator, honor its snapshot anchor when present, and run the grounding instruction; an unreachable source or unsupported load-bearing premise surfaces handoff unreadable and deactivates rather than binding I=None)
Phase 0 ReadPlan (sense)             → Internal analysis (read E's UnitEntry and PlanEntry partitions plus its unique PlanEnvelopeEntry into the five fields of ConditionBearingUnitPlan exactly as ReadPlan(E) defines; no field comes from session memory)
Phase 0 bind_I (track)               → Internal state update (write Λ.incoming_plan from the resolved carrier: Some(live plan), Some(ReadPlan(E)), or None only for explicit NoPlan)
Phase 0 MethodBrief (sense)           → Internal analysis (infer the work prospect's method-brief + span from the session)
Phase 0 guard (sense)                 → Internal analysis (relay-test: single-move ∨ trivial-conduct → relay; anti-self-application; no Λ mutation)
Phase 0 relay_route (extension)       → TextPresent+Proceed (single-move resolution: route to that one protocol as the recommendation, deactivate)
Phase 0 Qc (constitution)             → present (conditional: warrant=warranted only — the guard decides warrant before this gate opens; work prospect confirmation + conduction-warrant; relay-test result as pre-gate text; Esc key → loop termination at LOOP level)
Phase 1 MoveId (observe)              → Read, Grep, Glob (the dependency graph + session context to identify candidate moves; when I ≠ None, every move derived from an incoming UnitEntry is STAMPED with that unit's unit_ref, and a unit for which no move is identified is surfaced here rather than discovered missing at binding time — the stamp is what makes UnitMoveBinding total and derivable instead of asserted)
Phase 1 SalienceRank (extension)      → TextPresent+Proceed (CONDITIONAL — only when the flat |MS| would overflow a single round-local recognition bundle (Rule 14) ∨ its candidates are cross-graph (drawn from prior moves/deposits/threads the user may not hold in view): present MS salience-ranked against MethodBrief.work_intent, each candidate with a one-line aim-tied rationale, as pre-gate relay text before Sc; basis = aim + accumulated shape; a small/self-evident set takes the flat MoveId presentation, no ranking. Relay only — it does NOT mutate Λ and adds no turn-yield; the constitutive selection remains Sc)
Phase 1 Sc (constitution)            → present (MoveSet confirmation; multiSelect: true; Esc key → loop termination at LOOP level. When I ≠ None, a deselection that would leave some I.units entry with no stamped move is surfaced BEFORE the selection is accepted, naming the units it would strand: the totality UnitMoveBinding needs is a Phase 1 fact, and a unit dropped here makes convergence unreachable with no later repair. The user resolves it in the same gate via A_s: Confirm(MS') restores the move set, Withdraw(units) removes those units from I and records them in Λ.withdrawn_units as an owed re-apportionment realized by one of two producers depending on where Confirm(MS') lands (see Phase 1 PresentOwedReapportionment and Phase 3 AnnotateWithdrawals), then re-presents over the reduced plan)
Phase 1 no-survivor relay (extension) → TextPresent+Proceed (|MS| = 0 ∧ withdrawn_units = ∅ sub-case of A_s = Confirm: the user deselected every candidate move, so no move — and no protocol — survives to route to (R9); present that finding directly and deactivate. Distinct from Phase 0's relay_route, which always names a surviving protocol to route to; this sub-case names none because none exists)
Phase 1 PresentOwedReapportionment (extension) → TextPresent+Proceed (fires on the |MS| < 2 ∧ withdrawn_units ≠ ∅ relay exit at A_s = Confirm: present {owed_reapportionment(w) | (w, r) ∈ Λ.withdrawn_units}. At |MS| = 1 this rides in the SAME relay text that routes to the surviving move's protocol; at |MS| = 0 there is no surviving protocol to route to (R9), so this presentation IS the relay text on its own. This exit deactivates before Phase 3 ever runs, so no ConductedMethod and no SH value is ever constructed on this path — this presentation is the sole producer AND the sole reader of the annotation here, not a write into substrate_handoff.annotations; relay only, it mutates no Λ field beyond what Withdraw already wrote. This path never yields conducted(WP), so CONVERGENCE's owed_reapportionment clause does not need to, and does not, cover it — see PHASE TRANSITIONS Phase 1)
Phase 2 CT_default_surface (extension) → TextPresent+Proceed (present CT_default + basis as pre-gate relay context, then proceed only to AxisGate; it selects no topology value)
Phase 2 AxisGate (constitution)       → present (always opens on Phase 2 entry for warranted work; single axis·region gate, impact/leverage-first: default + basis + per-value differential implications + the current elicitation-cycle count (Λ.elicitation_cycle, read into AxisGate.cycle — surfaced exactly as apportion surfaces cycle_n at every Qu); reconciliation axis ONLY additionally surfaces ⨾/∥ composites + a one-line affordance; moves {Select | Compose(reconciliation) | Reorient | Sufficient}; Stop holds on silence; Esc key → loop termination at LOOP level)
Phase 2 FinalizeTopology (track)      → internal Λ replacement (fill every unresolved axis·region with its Gen default; replace Λ.topology with the complete CT, Λ.residuals with exactly default_bound_residuals(CT, surfaced_axes), and Λ.degradations with topology_degradations(CT). A default retained unchanged across re-entry remains in the residual projection because surfaced_axes still records that it was never constituted; on exhaustion residuals is ∅. This is the formal producer for the default dispositions TraceContract later reads, and replacement removes any residual or independence degradation derived from a superseded CT)
Phase 2 RegisterCheckpoints (track)   → internal Λ replacement (write Λ.checkpoints := checkpoint_set(WP, CT) on every finalized topology pass: SynthesisCheckpoint values at their qualifying reconciliation points and, when decompose_recovery(WP), the CellAssignmentCheckpoint before the whole induce-fan. This single producer makes both prose checkpoint paths formal and prevents obsolete checkpoints surviving a condition-binding back-edge)
Phase 2 converge (extension)          → TextPresent+Proceed (topology trace: per resolved axis·region → ConductMove → value, default-bound → Gen default + DefaultBound disposition; every registered checkpoint appears brief-less here — briefs compile at Phase 3)
Phase 3 SubstrateFeasibility (extension) → TextPresent+Proceed (per resolved topology value, SURFACE substrate realizability as a handoff annotation; an extension op surfaces only — it does NOT mutate Λ)
Phase 2 AssignMoves  (track)             → internal Λ replacement (PLACE every selected move from the current CT's order and region shape and REPLACE Λ.move_assignment with that exact map. This produces dom(move_assignment) = MS; replacement on every finalized pass ensures no move placement from a pre-reopening CT survives)
Phase 2 BindUnitConditions (track)       → internal Λ replacement (when I ≠ None: derive UnitMoveBinding directly from MS — { (m.unit_ref, m) | m ∈ MS, m.unit_ref ≠ None }, total over I.units because Phase 1 MoveId stamped the ref onto every move it derived from an incoming unit — then REPLACE Λ.unit_condition_bindings with one entry per current unit. Read the MoveRegion move_assignment placed that move in and set the disposition by that region's RESOLVED termination value: until_goal_met → grounds_termination(g), where g = stated_condition(ref(⋀ determinate_leaves(b.region))) when determinate_leaves(b.region) ≠ ∅ — the CONJUNCTION over that region's units whose merismos-side resolution is DeterminateResolution becomes its termination ground by reference — one ground per region, matching TerminationGround's single-valued shape, never one unit's predicate standing for the region — or g = resolution_required(/apportion) when determinate_leaves(b.region) = ∅ (every unit of the region carries AcceptedUncoveredResolution; no compiled completion predicate exists to conjoin, so TerminationGround's own precedence falls through to its named-resolver fallback rather than conjoining an empty set); any other termination value → executor_enforced carrying the CoverageLimit that records the uncovered extent, since the region stops on its own axis value while each unit's actually-carried executable conditions (a determinate predicate, or an accepted certificate's invariant conjuncts when present) remain the executing substrate's obligation inside that interval; an accepted completion residual remains an acceptance record, not a fabricated leaf. Runs in Phase 2 because it reads the resolved topology; when I = None, this step does not run at all — FLOW gates the whole condition-binding bracket on I ≠ None — so unit_condition_bindings simply stays at its never-written ∅ default)
Phase 2 BindPlanConditions (track)       → internal Λ replacement (when I ≠ None: compute one complete replacement set with exactly one binding per incoming PlanEntry, using the EARLIEST satisfying frontier and terminal only when no earlier frontier does. On materially divergent sound frontiers, run InvalidateTopologyProducts BEFORE recording/re-opening the deciding axis·region; no partial replacement is committed. If that p-specific pair was already reopened, or no sound site exists, record the typed resolution_required fallback under its convergence guards. When I = None, this step does not run at all — the same I ≠ None FLOW gate applies — so plan_condition_bindings simply stays at its never-written ∅ default)
Phase 2 InvalidateTopologyProducts (track) → internal Λ reset (before the only back-edge: clear residuals, topology-derived degradations, move_assignment, checkpoints, unit_condition_bindings, and plan_condition_bindings; preserve historical/bounding state. Phase 3 is unreachable until the revised axis loop exits and every producer replaces its cleared value)
Phase 3 AnnotateWithdrawals (track)      → internal Λ update (the FLOW/PHASE TRANSITIONS step between SubstrateFeasibility and CarryPlan, and the FIRST write to Λ.substrate_handoff: SubstrateFeasibility (extension) computes and surfaces the per-region feasibility verdicts as relay text but, per its own classification, mutates no Λ field, so this step is what actually MATERIALIZES Λ.substrate_handoff := Some(SH) — folding that same-turn feasibility computation into SH.feasibility and, for every (w, r) ∈ Λ.withdrawn_units, attaching owed_reapportionment(w) — carrying the whole withdrawn UnitEntry, naming /apportion as its resolver — into SH.annotations, the same owed-resolution shape TerminationGround's resolution_required uses (∅ when no unit was withdrawn). A unit withdrawn at Sc left the plan because this protocol could not arrange a move for it, which is an obligation owed outward, not a decision this protocol may absorb. This is the Phase-3 producer CONVERGENCE's owed_reapportionment clause reads; the sub-two-move Phase 1 exit has its own separate producer — see Phase 1 PresentOwedReapportionment)
Phase 3 CarryPlan (track)                → internal Λ update (when I ≠ None: copy I AS IT STANDS AT THIS POINT — every unit still in I after any Phase 1 Withdraw reduction, plus every plan condition and qualifying fact — into Λ.carried_plan UNREAD and UNCHANGED, field-by-field. Not a projection OF THOSE UNITS: this protocol's own bindings are positional and carry no unit content, so an executor reading only ConductedMethod would learn where each carried unit runs and nothing about what it is. A withdrawn unit is not copied here — it already left I at Phase 1 Sc, before this step runs — but it is not lost: it rides separately as an owed_reapportionment annotation on substrate_handoff (R11). Copying a chosen subset of the units I DOES hold is what lost a different field at each of the previous two revisions; when I = None, carried_plan stays None)
Phase 3 CompileCheckpointBrief (track)   → internal Λ update (for every c in the current registry, write c.brief := Some(compile_checkpoint_brief(c, WP, CT, MS)). SynthesisOutputShape receives SynthesisBrief's findings/convergence/divergence/private-gap/fusion/output-shape slots. CellAssignment receives CellAssignmentBrief pointing to /ground's partition and candidate cells plus the assignment/narrow-out judgment slot. Both are presentation contracts of structure only and neither copies execution content. This is the producer for CONVERGENCE's exact per-checkpoint brief equation)
Phase 3 RecordDegradation (track)        → TaskUpdate/internal Λ update (write the current substrate_degradations(substrate_handoff, CT) beside the topology_degradations(CT) FinalizeTopology produced, yielding their exact union. No pre-back-edge or earlier-substrate degradation can remain)
Phase 3 AssembleTraceContract (track)    → internal Λ update (ASSEMBLE the cross-cutting disclosure overlay: populate Λ.trace_contract from Λ.residuals + Λ.degradations + coverage caps derived from the resolved topology via the source→bound functor (single_pass → no_retry, bounded_rounds/until_dry_ceiling → top_n, intra-region sampling → sampling, until_goal_met → no cap; see CoverageLimit) plus termination grounds derived per until_goal_met region from the resolved topology and move assignment (the assigned protocol's convergence contract, an already-stated or /apportion-compiled condition, or resolution_required naming the downstream resolver; see TerminationGround) — all intra-region or termination-derived, so recoverable at assembly without preserving dropped candidate moves — AND, when I ≠ None, the CoverageLimit carried by every executor_enforced UnitConditionBinding disposition, folded in here rather than re-derived: a unit whose leaf is not its region's stop criterion is an uncovered extent this overlay must carry, and the binding that discovered it in Phase 2 is what holds it; an INVARIANT aggregation, never gated — never-silent has no alternative value to choose, so no AxisGate fires)
Phase 3 surface trace contract (extension) → TextPresent+Proceed (surface the trace contract in the convergence trace: every residual, degradation, coverage cap, and termination ground (a resolution_required ground names its owed resolver); relay only — it does NOT mutate Λ)
Phase 3 surface checkpoint briefs (extension) → TextPresent+Proceed (surface each compiled CheckpointBrief in the convergence trace; follows degradation recording, so a brief demoted to advisory under the scoped degradation-precedence rule — a substrate_infeasible record affecting the checkpoint's own in-session realization — is surfaced with that demotion visible; a downstream-only infeasibility demotes routing/externalization, not the fusion brief; relay only — it does NOT mutate Λ)
Phase 3 handoff (dispatch)            → Agent (hand the ConductedMethod plan to the substrate; the substrate executes — execution is out of scope; writes Λ.handed_off := ⊤ in the same step — the sole producer of handed_off(handoff_plan) ≡ Λ.handed_off = ⊤, see TYPES)
Λ (track)                             → TaskCreate/TaskUpdate (work prospect + framing shifts durable; per-axis bookkeeping stays in session)
Seam transition to declared next protocol (extension) → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol, or a composition edge this SKILL.md declares — e.g. the /ground Split → decompose-recovery recipe (/ground → /conduct → /induce) — settles the next move; proceed directly to it, citing that settling source; every Constitution gate inside this protocol and inside the next protocol fires unchanged. A routing=handoff_to_span region names no next protocol: its seam declares an externalization obligation the executing substrate discharges by writing the output to a substrate-owned record, and the future span receives a navigation block over that record in the fixed shape Rule 19 declares)
-- Substrate realization: at the Phase 3 seam, read the session's actually-loaded inventory — its agents, skills, MCP servers, and the tools/system-prompt each exposes — and propose realizable substrates from that live inventory rather than a fixed list; the conducted moves then run inline, as isolated subagents, an agent-team, a dynamic-workflow, or in plan-mode, as the read inventory affords (these are realization modes, not a closed set — the inventory is the authority). Topology→substrate feasibility (a non-epistemic substrate handoff — the protocol surfaces feasibility; the substrate enforces realizability): a dialectic reconciliation requires persistent addressable peers; a parallel_fan ⨾ adversarial_refute over a static aggregate is realizable by a stateless pipeline (e.g. a dynamic-workflow); a routing = handoff_to_span region requires a durable record surface its output can be externalized to across the span wall, proposed as the bridge substrate at this seam (/conduct routes and declares the externalization obligation; the executing substrate externalizes at execution). Surface feasibility per resolved topology value as a delegated handoff annotation (extension: surface only); when the read inventory cannot realize the resolved topology — including no realizable durable record surface for a handoff_to_span region — record a substrate_infeasible degradation (track: the Λ.degradations mutation) rather than silently binding an infeasible substrate. The (constitution)/(extension)/(track) markers above remain the authoritative axis.

── MODE STATE ──
Λ = { phase: Phase, work_prospect: Option(WP), incoming_plan: I, protocol_graph: Option(PG), move_set: Option(MS), topology: Option(CT), surfaced_axes: Set(axis × MoveRegion), checkpoints: CheckpointSet, elicitation_cycle: Nat, substrate_handoff: Option(SH), residuals: Set(ResidualAxis), degradations: Set(Degradation), move_assignment: Map(Move → ⟨order_position, region⟩), withdrawn_units: Set(UnitEntry × UnitRef), reopened_divergences: Set(axis × MoveRegion), unit_condition_bindings: Set(UnitConditionBinding), plan_condition_bindings: Set(PlanConditionBinding), carried_plan: Option(ConditionBearingUnitPlan), trace_contract: Option(TraceContract), handed_off: Bool, active: Bool, cause_tag: String }
   --   move_assignment is written by Phase 2 AssignMoves, not implied by CT: the convergence clause
   --     requires it total over MS and the Phase 2 bindings read it, so it needs a step that builds it.
   --   carried_plan is written by Phase 3 CarryPlan.
   -- residuals, the Phase-2 independence degradations, move_assignment, checkpoints, and both binding sets are
   --   PRODUCTS OF ONE TOPOLOGY MATERIALIZATION PASS, never cross-pass accumulators. A deciding-divergence
   --   back-edge clears all six via InvalidateTopologyProducts; FinalizeTopology replaces residuals and the
   --   topology-derived degradation portion, AssignMoves replaces move_assignment, RegisterCheckpoints
   --   replaces checkpoints with checkpoint_set(WP,CT), and the two Bind steps replace their sets. Only
   --   reopened_divergences/withdrawn_units/elicitation_cycle are historical across a full pass; surfaced_axes
   --   is neither one of the six nor historical in that sense — Select/Compose/Reorient edit it at single
   --   (axis, region) granularity, and the back-edge additionally removes one deciding pair from it (see
   --   InvalidateTopologyProducts). Phase 3 may add current substrate
   --   degradations, compiles every checkpoint brief, and assembles trace_contract (None until then)
   -- incoming_plan (I) is bound alongside work_prospect at Phase 0 (see WP-BINDING); unit_condition_bindings
   --   and plan_condition_bindings are replace-only sets populated at Phase 2 BindUnitConditions/
   --   BindPlanConditions, both replaced with ∅ when I = None, and travel into ConductedMethod unchanged (no
   --   further assembly step, unlike trace_contract)
   -- substrate_handoff is written ONCE, by Phase 3 AnnotateWithdrawals — the (track) step that folds the
   --   feasibility map SubstrateFeasibility (extension) computed together with every owed_reapportionment
   --   annotation into the first Some(SH) value (see TYPES SH, HandoffAnnotation); stays None on any path
   --   that deactivates before Phase 3 (e.g. the Phase 1 sub-two-move relay-route exit)
   -- elicitation_cycle is incremented by Select/Compose/Reorient (During Phase 2) and read at every AxisGate
   --   presentation (see TYPES AxisGate.cycle, TOOL GROUNDING Phase 2 AxisGate) — mirroring apportion's
   --   cycle_n, surfaced at every Qu, so the counter is read, never write-only
   -- handed_off is written ⊤ by Phase 3's handoff (dispatch) step ALONE, once, on the sole path that reaches
   --   it; handed_off(handoff_plan) ≡ Λ.handed_off = ⊤ (see TYPES)
Phase ∈ {0, 1, 2, 3}

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). registered dependency edges preserved. Dimension resolution emergent via session context.
```

## Core Principle

**Conduction over Substrate**: When a session's epistemic work needs several cognitive moves whose order, independence, reconciliation, termination, and routing are non-trivial, the method of conducting them is underdetermined before object-level cognition begins — and that gap is substrate-invariant (it survives deleting every runtime noun: a wrong order, contamination before synthesis, no stopping criterion remain for any reasoner). Hyphegesis designs that method as a conduct topology over the protocol graph and hands off a plan; it does not execute the moves, and it never binds a substrate it cannot realize — when realizability fails it declares conduction-degradation rather than binding silently, surfacing every relaxed guarantee, infeasibility, and coverage cap in the method's cross-cutting trace contract: a disclosure overlay that spans all five axes, and is not a sixth axis — never-silent has no alternative value to choose, so it carries no gate. Its identity is the deficit plus the operand (the protocol graph) plus the purpose: settle the highest-leverage fork first, and defer only decisions whose evidence structurally does not exist at design time. Synthesis output shape is the general instance; decompose-recovery membership is the object-level recipe instance. The topology algebra is shared with `/frame` (which supplies the perspectives the algebra arranges), and the impact-first interview loop is shared with `/bound`; Hyphegesis instantiates both over the session's whole move set.

## Mode Activation

### Activation

**Pre-activation routing**: This guard precedes activation, deciding whether to accept a `/conduct` invocation at all — per Rule 1's warrant: single-move or self-evident work relays to that one protocol directly instead of conducting.

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
| Decompose recovery (wrong-fusion repair) | `/ground` self-grounding returns a **Split** partition reading (≥2 non-empty cells — the instances carry coherent rival essence(s) beside the core) — the repair is multi-move (detect → constitute cells → re-form per cell) and its conduct is the decompose-recovery recipe. A **Trim** reading (≤1 non-empty cell) is single-move (`/induce` Narrow or Reorient) and does not warrant conduction |

**Qualifying condition**: Activate only when the method is genuinely underdetermined and multi-move. Large work scope or budget is *auxiliary* evidence that reinforces a multi-move trigger; it never triggers conduction on its own (it is substrate-adjacent). Small scope or single-move work does not warrant conduction.

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

First bind the optional incoming `/apportion` plan. A live plan binds directly; a supplied navigation block is dereferenced at its canonical locator and the durable record is read back into all five plan fields before `I` is bound. If the source is unreachable or a load-bearing premise lacks support-integrity, surface that failure and stop — never continue as though no plan had been supplied.

Construct a Method Brief from the work prospect and run the relay-test guard first. Only when the guard finds the work warranted (two or more moves, non-trivial conduct) does Phase 0 **present** the Method Brief for confirmation, together with the conduction-warrant judgment, via Cognitive Partnership Move (Constitution); a relay-test verdict of relay routes to the single resolving protocol and deactivates without opening this gate.

The Method Brief infers, from the work prospect:
- **Work intent**: what is to be accomplished and why
- **Expected handoff**: what the conducted method should produce before the substrate takes over
- **Span**: from this invocation (session start *or* mid-session) to the next planned `/compact` or `/clear` — the natural end of a work chunk (a design-time horizon, never runtime-detected; Rules 3, 7).

**Guard (relay-test)** runs before the gate and is shown as pre-gate text:
- If the work resolves through a single move or a single protocol — conduction entropy → 0, the method is self-evident — present that one protocol as a relay route and **deactivate**. Conduction is not warranted.
- **Anti-self-application**: Hyphegesis does not conduct Hyphegesis. The moves in a conduct plan are object-level protocols or analyses, never another conduction. Conducting the *build of* a protocol is object-level work (file edits, verification) and does not trip this guard; conducting "the conduction" does.

Activation requires (a) two or more moves AND (b) their conduct (order, independence, reconciliation, termination, routing) is non-trivial — more than one conduct-plan with a different downstream future exists.

### Phase 1: Move Identification

Identify the candidate cognitive moves over the protocol graph, then **present** the move set via Cognitive Partnership Move (Constitution) as a multi-select confirmation.

Read the dependency graph and the session to surface candidate moves (protocol invocations, analysis passes, delegations). Each move is an object-level step. The user confirms or edits the set. Two or more surviving moves proceed to conduct design; exactly one relay-routes to that move's protocol; zero relays that nothing survives and names no route. Any recorded withdrawal is surfaced on either sub-two exit.

**Salience-ranked presentation (overflowing or cross-graph sets)**: when the candidate set is small and self-evident, present it flat — the default. But when the flat set would **overflow a single round-local recognition bundle** (too many candidates to recognize at once — the bundling discipline of Rule 14), or when its candidates are **drawn from the accumulated graph** (the session's prior moves, deposits, and threads the user may no longer hold in view), present it **salience-ranked against the session aim** — ordered by each candidate's relevance to the method brief's work intent, each carrying a one-line rationale tying it to that aim — as pre-gate relay text *before* the multi-select confirmation. Ranking surfaces the accumulated shape so binding the move set is a Recognition rather than a recall from an unheld graph — Hyphegesis serves two recognition modes, externalizing the user's implicit method and revealing context state the user structurally cannot see (the session's accumulated shape), and the ranking operationalizes the second, its irreplaceable value. The ranking is **relay** (an AI analysis with cited basis: the aim plus the accumulated shape), adding zero new turn-yields; the constitutive selection stays the single multi-select gate. It fires only on the overflow/cross-graph regime — on a small in-view set a ranked list is overhead, so the flat default holds.

**Cross-session enrichment**: Prior session indices from the hypomnesis store (prior-session recall indices), when present, may seed Phase 1's candidate move set; the constitutive judgment remains with the user.

### Phase 2: Conduct Design (Topology Elicitation)

Lens-of-method established *which* moves. Conduct Design establishes *how* they relate — the **conduct topology** across five axes: order, independence, reconciliation, termination, routing.

**Default surface**: On entering Phase 2, first present `CT_default` and its basis as pre-gate relay text, then always open the first axis gate (Constitution) and yield. `warranted` means materially different topology futures exist, so the relay surface may recommend the default but cannot select it; silence carries `Stop`. A user accepts the remaining defaults by choosing **Sufficient** at that gate.

**Elicitation cycle (impact/leverage-first)**: When the user engages refinement, each cycle surfaces the single most decision-relevant **unsurfaced** axis·region — the most-constrained axis first (the one whose values most divide the downstream conduct-plans), not a fixed sequence. This mirrors the most-constrained-variable heuristic — impact/leverage-first ordering is itself the design kernel: every surfaced axis·region is settled at its own gate this cycle (Select, Compose, or Reorient), or left to its Gen default once the loop ends by Sufficient. There is no separate axis-level "volatility" branch that holds a surfaced axis open past its own gate for later re-decision — a decision only defers past design time when it structurally cannot be judged before the per-move outputs exist, which is the synthesis checkpoint's output-shape decision (see *Synthesis checkpoint*, below), never one of the five Gen-typed axes.

Each axis has a defined downstream effect — no orphan axes:
- **order** shapes the move sequence (`single_move`, `sequential_chain`, `parallel_fan`, `dependency_dag`),
- **independence** prevents synthesis-contamination (`isolated` before reconciliation; `shared` relaxes it and records an `independence_relaxed` degradation),
- **reconciliation** combines separately-produced results (`aggregate`, `dialectic`, `adversarial_refute`, `synthesis`) — the only composable axis (⨾/∥),
- **termination** sets the epistemic stop criterion (`single_pass`, `bounded_rounds`, `until_dry_ceiling`, `until_goal_met`) — an `until_goal_met` region additionally records a topology-level termination ground (see `TerminationGround`): a reference to what makes "goal met" determinate, or `resolution_required` naming the downstream resolver; `/conduct` records the ground, never compiles the predicate — compilation belongs to the assigned move protocol or `/apportion`, and verification/enforcement to the executing substrate,
- **routing** sends each move's output onward (`return_to_user`, `chain_to_next`, `handoff_to_protocol`, `deepen_on_finding`, `handoff_to_span`).

**Cross-span routing (`handoff_to_span`)**: the other four routing values keep a move's output within the span — returned to the user, chained to the next move, handed to an in-span protocol, or deepened in place. `handoff_to_span` is the one value whose output crosses the **span wall** to a future span (post `/compact`, `/clear`, or a new session) that does not share this session's context. Because the consumer is context-less, the output cannot ride on the author session's silent familiarity — it carries an **externalization obligation**, which `/conduct` does not discharge itself: it **declares that obligation in the handoff annotation** at the Phase 3 seam. No result record exists at plan handoff — the executing substrate externalizes the output to a substrate-owned record at execution time, and the future span receives a navigation block over that record in the fixed shape Rule 19 declares, rather than a re-authored copy of its contents. `/conduct`'s cognition stays single-span; only its *output* bridges. This is a **design-time** routing judgment — selected when the method brief's expected handoff names a future-span consumer — never a runtime detection of the wall (the wall stays user-typed and undetected, per the span discipline). The far-side compile-back is outside `/conduct`'s scope. When such a region's reconciliation is `synthesis`, it **does** register a synthesis checkpoint (a context-less future span, like the user, cannot re-derive the fusion shape, so the fusion's `OutputShape` is constituted in-session at the checkpoint); the constituted result carries the same declared obligation — the executing substrate externalizes it to a substrate-owned record at execution, and that record is what the future span dereferences.

**Edge-local axes**: when `order` is `dependency_dag`, independence/reconciliation/routing/termination are non-uniform across the move set — each region may resolve these axes differently. The topology resolves them per **move-region** rather than as one flat value; `order` defines the regions (global), and uniform axes carry the single region `whole`.

**Pre-gate context, gate question** (Context-Question Separation): present each axis·region's default, its basis, and each value's epistemic trade-off as text *before* the gate. The gate carries only the question and per-option differential implications. For the **reconciliation axis only** (the sole composable axis), the gate additionally surfaces relevant ⨾/∥ composites as recognizable options plus a one-line composition affordance. Only well-formed composites are offered, so composite validity is settled at selection — an ill-formed composite is never an option, which is why the degradation taxonomy needs no Phase-2 composite-incoherence kind.

**The Phase 2 gate surfaces only the epistemic fork**: each axis·region gate asks the user only the epistemic decision over that surfaced axis — order, independence, reconciliation, termination, or routing (the full five-axis set in TYPES) — never how the region will be hosted. Settling an axis fixes its epistemic shape (sequencing, isolation, how results reconcile, the stop criterion, or where output goes); the only question excluded from Phase 2 is substrate/matter — which concrete substrate realizes the region. Realization belongs to the Phase 3 handoff seam (see Phase 3 and TOOL GROUNDING), not to this gate.

The user's move is one of:
- **Select(value)** — adopt a value for the axis·region; auto-advance to the next unsurfaced axis·region
- **Compose(via op)** — combine reconciliation values via ⨾ or ∥ (reconciliation axis only); auto-advance
- **Reorient(axis)** — reframe or replace the surfaced axis; the reoriented axis re-surfaces (no auto-advance)
- **Sufficient** — declare the topology mission-sufficient; converge. A **move within the axis gate**, not a separate gate.

**Termination (honest bound)**: the loop is bounded by user agency — a **Sufficient** move or Esc-Stop ends it. The finite axis set guarantees a terminal: surfacing the last axis·region without Sufficient converges by implicit Sufficient. On Sufficient, `FinalizeTopology` default-binds every unresolved axis·region and replaces `Λ.residuals` with one `DefaultBound` record per binding; on exhaustion it replaces the set with empty. The trace therefore reads a produced current-pass disposition rather than a silent or stale default.

**Checkpoints**: the conduct plan records a `CheckpointSet` — in-session re-entry points, all represented by the same `Checkpoint{region, position, decision, brief}` record. `RegisterCheckpoints` replaces the set after each finalized topology pass and `CompileCheckpointBrief` fills every registered brief before handoff. A **cell-assignment checkpoint** — the decompose-recovery recipe's constitutive split point — uses the `CellAssignment` decision payload at `BeforeRegion`; it is not a synthesis checkpoint (its reconciliation is aggregate), but it is now produced and compiled by the same formal machinery rather than prose alone.

**Synthesis checkpoint (defer-volatile instance)**: a region whose resolved reconciliation contains `synthesis` and whose routing is `return_to_user` or `handoff_to_span` registers a **synthesis checkpoint** — the fusion re-entry point. Both routings deliver the fused result to a consumer that cannot re-derive the fusion shape (the user, or a context-less future span), so the fusion is constituted in-session at the checkpoint rather than left to the consumer; the remaining routings feed an in-context consumer that re-shapes downstream, so they register none. Its deferred decision is the synthesis output's **first-class unit** (its output shape: is the output organized around perspectives, claims, options, risks, or whatever else the mission's question form makes primary?). The mission's question form determines that unit — the topology does not — and it is best judged after the per-move outputs exist, because the convergence/divergence pattern they produce is its evidence. So the defer-volatile kernel routes the shape decision to this checkpoint instead of locking it at design time. For a `handoff_to_span` region the checkpoint constitutes the fused result and its `OutputShape` in-session, and that constituted result is then externalized to a substrate-owned record along the cross-span seam Phase 3 declares — an execution-time step, since the checkpoint fires only after the per-move outputs exist — which the receiving span dereferences at its locator (the checkpoint constitutes, the executor externalizes along the declared seam). The trivial-default topology qualifies (its reconciliation is `synthesis`, its routing `return_to_user`), so the default path carries a synthesis checkpoint too, with the lens-organized report as its default shape.

### Phase 3: Substrate Handoff

For the resolved topology, surface substrate feasibility as a handoff annotation, then hand off the `ConductedMethod` plan.

The conduct topology is substrate-invariant; this phase — the form/matter **seam** — composes it with the runtime. Here, and only here, the AI proposes the matter: for each resolved topology value it proposes which substrate could realize the region, matching the region's realizability requirements (peer persistence, addressability, statefulness) against the available substrates. This proposal is a handoff annotation surfaced at the seam, not a Phase 2 gate question. When the available substrate cannot realize the resolved topology, **declare conduction-degradation** — record a `Degradation{region, kind: substrate_infeasible, resolved_value, reason}` in `degradations` (a `(track)` Λ mutation; surfacing the annotation is the separate `(extension)` op) — rather than silently binding an infeasible substrate.

**Cross-span seam (`handoff_to_span` → substrate record)**: a region resolved to `routing = handoff_to_span` carries an externalization obligation to a context-less future span. At this same seam the AI proposes the durable record surface that discharges it — `/conduct` routes the output across the wall, and the plan declares here that at execution the output is externalized to a substrate-owned record the future span is pointed at. This reuses the existing machinery: the proposal is the ordinary substrate-feasibility annotation, and when no durable record surface is realizable in the read inventory the same `substrate_infeasible` degradation is recorded — no new degradation kind. The handoff stops at the routing-and-externalization boundary: what crosses the wall is a navigation block over the canonical record in the fixed shape Rule 19 declares, not a second copy authored beside it, and the far-side compile-back is a separate downstream concern outside `/conduct`'s scope. When the region's reconciliation is `synthesis`, its synthesis checkpoint has already constituted the fused result and `OutputShape` in-session (see Phase 2); the externalized record holds that constituted result.

**Synthesis checkpoint brief**: for each registered synthesis checkpoint, compile a `CheckpointBrief` into the plan — a presentation contract the substrate executes at the checkpoint. The brief is structure, not content: the per-move outputs exist only at execution, so it carries references and slots, never copies. Briefs are topology-derived, not substrate-derived, which is why the compile precedes degradation recording: a later `substrate_infeasible` record demotes the affected region's brief to advisory rather than binding — the degradation record takes precedence, and the substrate realizes what it can while keeping the degradation surfaced. The demotion is scoped to infeasibilities affecting the checkpoint's own in-session realization: a downstream-only infeasibility (e.g. no durable record surface for a `handoff_to_span` region's externalization bridge) demotes that routing/externalization — the constituted output cannot bridge — while the in-session fusion checkpoint stays binding (the fusion is constituted in-session regardless). The brief instructs the substrate to present, at the checkpoint: (a) the per-move outputs with their convergences, divergences, and decision axes as pre-gate text — a relay of the move outputs with cited basis, keeping context separate from the question; (b) private-gap slots typed by the limit categories each assigned move's protocol contracts to report — a design-time structural derivation, filled at the checkpoint from what each move actually reported — surfaced for the user to fill or decline; slot assembly is relay while the slot structure is uniquely determined from the assigned contracts (entropy → 0; categories that prove context-dependent at execution escalate slot assembly to Constitution at the checkpoint), and the filling is the user's constitutive act either way; (c) fusion-result candidates with their differential implications, including the output-shape candidates — the Constitution gate where the deferred shape decision re-fires. Output shape is the synthesis output's first-class unit, determined by the mission's question form; the candidates are narrowed from session context and user utterances and judged against the convergence/divergence pattern the moves actually produced. Two anchor instances, not an enum (the candidate space stays open): a **lens-organized report** — organized around each analytical lens's findings, the default shape for understand-the-situation missions and for the trivial-default path — and a **claim-survival report**, natural after an `adversarial_refute` arrangement. When the mission's question form is unidentifiable, the lens-organized report is the default candidate and an emergent free-form option stays in the candidate set, so the substrate never exercises constitutive shape judgment without a gate. When candidate analysis converges to a single dominant candidate, the substrate presents the finding as relay (option-set relay test). On the `/frame` path, the per-move findings this brief arranges are the findings produced by executing the lenses `/frame` forms (handed off via its `LensReturn`/`SubstrateCorrespondence`); `/frame` never compiles a synthesis contract or output shape — the lens-organized report default and every `OutputShape` candidate belong to this checkpoint alone, so shape authority stays single.

Before handing off, **assemble the trace contract** — the cross-cutting disclosure overlay that spans all five axes: every final-pass default-bound axis·region with its disposition, every current degradation (relaxed isolation derived from the final CT or substrate infeasibility recorded in Phase 3), every coverage cap the resolved topology imposes, and every `until_goal_met` region's termination ground — the reference that makes "goal met" determinate, or `resolution_required` with its owed resolver named. This is not a sixth axis and opens no gate — "never silent" has no alternative value to choose, so the contract is *assembled* (relay) from the current materialized products, not *selected* and not accumulated across superseded topology passes. It realizes the disclosure discipline one semantic level above the axes: the handoff carries an explicit account of what the method does not cover, never a silent cap.

Hyphegesis then hands off the plan and stops. It produces the method plan plus its checkpoints; the substrate — or the routed protocol — executes the moves. This is the completeness boundary: the protocol records the handoff and halts.

## Recipe: Decompose Recovery (object-level)

A worked **instance** of the conduct topology, not a separate orchestrator. The existing generic checkpoint machinery now carries this recipe formally through the `CellAssignment` decision payload and `CellAssignmentBrief`; the five-axis topology algebra itself is unchanged. Decompose recovery repairs a **wrong fusion**: an abstraction formed over dissimilar instances forced under one form. The repair goes backward to the instances and re-forms, often into *multiple* abstractions. It factors into three object-level moves the existing algebra already arranges:

1. **Detect / evidence the split boundary** → `/ground` (Analogia) in its self-grounding case: ground the abstraction against its own instances, producing the **split-vs-trim partition reading**. Only a **Split** reading (the partition yields **≥2 non-empty cells** — the core cell plus rival cell(s), or ≥2 rivals) warrants decompose, and that ≥2-cell count satisfies the conduct warrant. A **Trim** reading (≤1 non-empty cell — scattered misfits around a core, or a single coherent cell with empty core) is a single-move `/induce` (Narrow or Reorient), so the relay-test deactivates conduction (a single move does not warrant conducting).
2. **Constitute the cell assignment** → an in-session **Constitution checkpoint** (a defer-volatile application, *not* a new checkpoint kind and *not* a synthesis checkpoint — its reconciliation is aggregate, not synthesis): the candidate cells (core + rivals) come from `/ground`'s reading and **are the conducted moves at design time**; what the checkpoint defers and constitutes is the **membership refinement** — which instances land in which cell, and where each `trim_outlier` goes — high-impact and volatile because it rests on the user's judgment over `/ground`'s candidates, so the defer-volatile kernel routes it to the in-session checkpoint. Its pre-gate evidence is `/ground`'s partition reading — the three pairwise-disjoint groups that exhaust Sₜ: the rival-essence clusters, the `core_remainder` (members the original abstraction genuinely fits), and the `trim_outliers` (scattered misfits in no rival) — re-read from the upstream `/ground` output at the checkpoint (reference, not copy) and carried through session text. The checkpoint settles the membership of the cells = the core cell **plus** the rival cells (covering every fitting member, so no preserved/core case is dropped), and decides each outlier (narrow it out, or place it in a cell). Analogia *evidences* the candidate partition; this checkpoint *constitutes* the final membership.
3. **Re-form each cell** → a normal `/induce` (Periagoge) activation per cell, across the **whole** partition (each rival cell *and* the core cell). Periagoge's seed accepts an instance subset of any cardinality, so a cell is just a smaller seed — `/induce` needs no change. The core cell typically re-forms into a narrowed version of the original abstraction; each rival cell crystallizes its own abstraction.

**Topology instantiation** (the five axes, all existing Gen values). The three protocols are sequenced through session text (`/ground` detect → `/conduct` → `/induce` per cell); `/conduct` conducts the **induce-fan** — `/ground` is the upstream detection stage, *not* a conduct move-region. The conducted **`MoveSet` is concrete at design time**: it is `{ induce(cell) | cell ∈ the non-empty candidate cells }` over `/ground`'s **candidate partition** — `induce(core_cell)` when the core is non-empty, plus `induce(rival_cell₁), …, induce(rival_cellₖ)` (an empty-core Split contributes only rival moves) — the cells the partition reading already supplies. A Split reading yields ≥2 non-empty candidate cells, so `|MoveSet| ≥ 2` satisfies the Phase 1 guard — there is no late, post-handoff move creation. The entry **cell-assignment checkpoint refines membership** of moves that already exist — which instances land in which cell, and where each `trim_outlier` goes — an in-session Constitution refinement, *not* a creation of new moves after handoff; so `MoveSet` is a concrete set of `Move`s, `move_assignment: Map(Move → ⟨order_position, region⟩)` maps each per-cell move, and the per-Move convergence trace is available before handoff. The axes resolve over the fan (uniform across its per-cell branches):
- **order** = `parallel_fan` over the per-cell `/induce` moves: independent, no ordering dependency among the cells. The fan is **uniform** (every branch carries the same per-axis values), so the topology needs no `dependency_dag`/edge-local resolution — the single region `whole` covers all moves. The cell-assignment checkpoint is the entry in-session checkpoint that gates the fan and refines `/ground`'s candidate partition (membership + outlier placement); the cell *count* comes from the candidate partition, the checkpoint settles the membership.
- **independence** = `isolated`: each cell branch re-forms independently — no cross-cell contamination before its abstraction crystallizes.
- **reconciliation** = `aggregate` over the branch outputs: the cells yield a **multiplicity** of `CrystallizedAbstraction`s — they are **not fused**. `CrystallizedAbstraction` stays the only convergence object; per-cell recovery produces several of them, never a new terminal type.
- **termination** = `until_goal_met` per branch (each cell crystallizes); termination ground = `protocol_contract`: `/induce`'s own convergence contract (`CrystallizedAbstraction`) per branch — the region completes when every conducted branch reaches its cited convergence.
- **routing** = `return_to_user`: each crystallized abstraction returns.

**Object / control boundary (guard)**: Decompose is **object-level** — it transforms abstractions (instances, essences, candidates). It must **not** acquire control-level governance — queue order, focus, span across a growing graph of nodes, child-state, recursion — which is a different stratum (governing what the session attends to) and a separate inquiry, not a tail of decompose. Giving an object-level split that machinery turns it into a mini-orchestrator; here the conduct topology arranges the moves, and the split itself never owns orchestration. The cell-assignment checkpoint settles the cells' membership and stops; the induce-fan is plain moves under the topology.

## Rules

1. **Conduction warrant (guard)**: Activate only when the method is genuinely underdetermined AND two or more moves are needed whose conduct is non-trivial. Single-move or self-evident work relays to that one protocol; conduction is not performed. Hyphegesis does not conduct Hyphegesis — conduct-plan moves are object-level, never another conduction.
2. **Recognition over Recall**: Present structured options via Cognitive Partnership Move (Constitution) — structured content reaches the user with a response opportunity; Constitution interaction requires turn yield before proceeding. Phase 1 presents the move set **salience-ranked** (relay, pre-gate) when the flat set would overflow a single round-local recognition bundle (Rule 14) or its candidates are drawn from the accumulated graph — ranked against the session aim with a per-candidate rationale; the constitutive selection stays the single multi-select gate (per TYPES SalienceRank).
3. **Design-time only**: Hyphegesis produces a method plan plus in-session checkpoints, then hands off. It has no runtime monitoring surface — it does not watch execution or emit runtime advisories. The span horizon (`/compact`, `/clear`) is user-controlled. A compiled checkpoint brief is plan content — the presentation contract the substrate executes at its checkpoint — not a runtime monitoring surface: compiling the brief keeps Hyphegesis design-time; performing the presentation belongs to the substrate.
4. **Impact/leverage-first design order**: Surface the most-constrained axis·region first (the one whose values most divide the downstream plan), not a fixed sequence — this ordering is the design kernel: the highest-stakes shape of the plan is fixed first. Every surfaced axis·region is settled at its own gate (Select, Compose, or Reorient) or defaulted at Sufficient; no axis is held open past its own gate on a "volatility" judgment. Only non-axis decisions whose evidence does not yet exist register checkpoints: synthesis output shape generally (Rule 16), and membership refinement for the decompose-recovery recipe (Rule 18).
5. **Independence before contamination (edge-local)**: The `isolated` value preserves each region's independence until reconciliation; `shared` relaxes it, and `FinalizeTopology` derives the final CT's `Degradation{kind: independence_relaxed}` into the replace-only `degradations` set — a surfaced acknowledgment of relaxed isolation (the epistemic kind of degradation), not a substrate failure. When `order = dependency_dag`, independence resolves per move-region, not as one flat value.
6. **Conduction over Substrate (invariant)**: Phase prose names only epistemic conduction UP TO the handoff seam; concrete substrate realizations (agent, context-window, scheduler, authentication) live only in TOOL GROUNDING. The Phase 3 handoff is the form/matter seam: it names the substrate boundary — the handoff target plus per-topology feasibility — mirroring the suite's handoff pattern (cf. frame Rule 3, Object supplier, not arranger or executor). The conduct form resolves substrate-independently, then composes feasibility at the seam; when the substrate cannot realize the resolved topology, declare conduction-degradation — never bind silently.
7. **Span and checkpoints**: The span runs from invocation (session start or mid-session) to the next planned `/compact` or `/clear` — a design-time horizon the user types, never a runtime-detected wall. Checkpoints are in-session only; Hyphegesis conducts to the last checkpoint, then downstream-delegates. `RegisterCheckpoints` produces the exact current set: qualifying synthesis decisions at `ReconciliationPoint`, plus the decompose-recovery cell-assignment decision at `BeforeRegion` when that work prospect is present; `CompileCheckpointBrief` fills every one before handoff. A region resolving routing `handoff_to_span` additionally routes its output *across* the span wall by **externalizing it to a substrate-owned record the future span is pointed at** — the obligation declared at the Phase 3 seam and discharged by the executing substrate — a design-time routing of the output, not a runtime detection of the wall; `/conduct` stays single-span in its cognition and only its constituted output bridges, the far-side compile-back lying outside `/conduct`'s scope. What crosses is a locator into the canonical record, never a re-authored copy of it.
8. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via Cognitive Partnership Move (Constitution). The question contains only the essential question; options contain only option-specific differential implications. Scope includes the Phase 2 axis gate: each axis·region's default, basis, and per-value trade-offs are pre-gate text; the gate carries only the question and per-option (per-value and per-composite) differential implications.
9. **Convergence evidence**: Present the transformation trace before handoff — final-pass per-move assignment, per-axis·region topology trace (including every DefaultBound residual), substrate annotations, the exact current checkpoint set with every checkpoint's decision-typed compiled brief, and the trace contract (residuals, degradations, coverage caps, termination grounds) — as demonstrated evidence, not assertion.
10. **Matter AI-propose at the seam**: The Phase 2 axis gate fires for the epistemic-relevant fork over any of the five axes (order, independence, reconciliation, termination, routing) and never asks the user about matter/substrate. Matter is proposed by the AI only at the Phase 3 handoff seam: it scans the loaded environment and proposes which substrate could realize each region as a handoff annotation. This keeps pre-seam phase prose substrate-free; substrate naming lives at the seam and in TOOL GROUNDING.
11. **Gate integrity** (Safeguard tier): The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation.
12. **Option-set relay test (Extension classification)**: If analysis converges to a single dominant option (option-level entropy → 0), present the finding directly as Extension. Each Constitution option must be genuinely viable under different user value weightings. Options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options.
13. **Plain emit discipline**: User-facing emit (Phase 1 move surfacing, Phase 2 axis gates, convergence traces, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
14. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
15. **Trace contract (cross-cutting disclosure overlay)**: The method's disclosure obligations — final-pass DefaultBound axes, current degradations, and coverage caps — assemble into a single named trace contract that spans all five axes, surfaced at handoff and never silent. It is an overlay, not a sixth axis: never-silent admits no alternative value, so the contract carries no Gen set, no gate, and no per-region selection — it is assembled (relay) from the replace-only products of the current topology plus Phase 3 substrate findings, never accumulated across superseded passes and never constituted by user choice. Coverage caps the resolved topology imposes are surfaced explicitly. Each `until_goal_met` region additionally carries its termination ground in the contract — a reference to what makes "goal met" determinate, or `resolution_required` naming the downstream resolver; an absent ground is unresolved and surfaced as such, never treated as an accepted-unbounded run.
16. **Synthesis checkpoint brief (Recognition at fusion)**: Fusion is recognized, not recalled. Every synthesis checkpoint carries a compiled `CheckpointBrief` instructing the substrate to present the per-move outputs with their convergences, divergences, and decision axes as pre-gate text, private-gap slots typed by the limit categories the assigned protocols contract to report for the user to fill or decline, and the fusion-result and output-shape candidates with differential implications as the Constitution gate. The brief is a contract of structure, not content — content exists only at execution, so the brief carries references and slots, never copies. Output shape — the synthesis output's first-class unit — is determined by the mission's question form, narrowed from context and user utterances, and judged against the convergence/divergence evidence; the defer-volatile kernel presents it as recognizable candidates at the checkpoint rather than locking it at design time, and it stays a brief field — never a sixth axis, never an enum. When the question form is unidentifiable, the lens-organized report is the default candidate and the candidate set carries an emergent free-form option — the substrate never exercises constitutive shape judgment without a gate. On a region carrying a `substrate_infeasible` degradation that affects the checkpoint's own in-session realization, the degradation record takes precedence and that region's brief is advisory rather than binding; a downstream-only infeasibility (e.g. no durable record surface for a `handoff_to_span` region) demotes routing/externalization instead, leaving the in-session fusion checkpoint binding.
17. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract, since each block is the type that constitutes the protocol — preserving the blocks keeps the protocol intact. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).
18. **Decompose recovery recipe (object-level instance)**: The decompose-recovery recipe (*Recipe: Decompose Recovery* above — `/ground` self-grounding detect → an in-session Constitution cell-assignment checkpoint → `/induce` per cell) is a worked instance of the existing topology algebra, not a separate orchestrator. Its constitutive checkpoint is formally carried by the generic `Checkpoint` record's `CellAssignment` payload, produced by `checkpoint_set`/`RegisterCheckpoints`, compiled into `CellAssignmentBrief`, and required non-empty by CONVERGENCE. Decompose stays object-level and never acquires control-level governance.
19. **Seam relay on declared continuation**: when a user-declared chain or a composition edge this SKILL.md declares (e.g. the `/ground` Split → decompose-recovery recipe) names the next protocol, the between-protocol seam after this protocol's handoff (ConductedMethod) is relay (Extension) — proceed directly, citing the settling source (the chain declaration or the named edge). Relay settles WHICH protocol follows; each edge's own fire condition sets WHEN. A `handoff_to_span` region names no next protocol: its seam declares an externalization obligation that travels in the handoff annotation, and the executing substrate discharges it at execution by writing the output to a substrate-owned record, after which the future span receives a navigation block over that record — its purpose and frame, the record's canonical locator, a dereference instruction, a snapshot anchor where exact-state determinacy is needed, and a grounding instruction that verifies load-bearing premises against current state and stops when a source is unreachable or a needed premise lacks support-integrity — never a re-authored copy of the record's contents. This fixed shape is the navigation block every cross-span handoff below carries. This governs only the seam BETWEEN protocols; every Constitution gate inside this protocol and the next fires unchanged, and the user can redirect at any turn.
20. **No-reentry across the `/apportion` seam, bound not re-derived**: The relationship is two-way and advisory, never a precondition. For `I ≠ None`, consume each `UnitEntry.resolution` exactly as Merismos emitted it: `DeterminateResolution` carries a predicate plus all typed completion/invariant conjuncts; `AcceptedUncoveredResolution` carries a non-empty accepted-completion witness plus any invariant conjuncts. The accepted constructor is therefore not limited to residual-only units and its invariant provenance must not be dropped. `MoveId` stamps `unit_ref`, `UnitMoveBinding` is read from the move set, and `BindUnitConditions` replaces one binding per current unit. An `until_goal_met` region grounds termination by reference to the conjunction of its determinate resolution predicates; when none exist, it records `resolution_required(/apportion)` instead of conjoining an empty set. Other termination values use `executor_enforced` with a `CoverageLimit`. Bind each incoming `PlanEntry.dischargeable_when` to the earliest sound topology frontier or terminal. Merismos's `plan_terminal(n)` is an aggregate, topology-free projection over unit resolutions, the expected aggregate resolution count, and the envelope's accepted-completion record, with no unit identities; the count prevents unit omission from emptying the universal, and its accepted arm still requires every carried invariant conjunct to hold, so accepting missing completion never waives an invariant. Its conservative terminal binding is therefore sound while the carried plan's unit count still matches what merismos fixed at emission; a downstream `Withdraw` that reduces that count makes the count conjunct — and so `plan_terminal` itself — permanently false until `/apportion` re-apportions, which is the intended block on whole-goal acceptance, not a defect in the binding rule. Do not reconstruct per-unit basis. When sound frontiers diverge materially, invalidate the current topology products before re-opening the deciding axis·region. Use `resolution_required(resolution_resolver(affected), affected)` only when no site satisfies or that plan condition's own deciding divergence has already had its one re-opening; every plan condition still gets exactly one final-pass binding. Neither binding routes back to `/apportion`. In the other direction, an unresolved autonomous region handed to `/apportion` carries fixed topology and is not re-conducted; trivial unit sets bypass this protocol under the warrant.

## Adversarial Guards

- **universal-dispatcher**: Hyphegesis sprawls into conducting every task, including single-move work. Guard: the Phase 0 relay-test deactivates on single-move or trivial-conduct work; warrant requires ≥2 moves with a non-trivial, branch-dividing conduct.
- **meta-recursion**: Hyphegesis is asked to conduct its own conduction. Guard: anti-self-application — conduct-plan moves are object-level only; "conduct the conduction" is rejected.
- **premature-lock**: a decision that structurally cannot be judged before the per-move outputs exist (the synthesis output's shape, a decompose-recovery cell's membership) gets guessed at Phase 2 design time instead of deferred. Guard: that decision never enters the Phase 2 axis loop as a Gen-typed axis at all — it registers as an in-session checkpoint (Rule 16; Rule 18) whose Constitution gate re-fires once the deciding evidence (the per-move outputs, `/ground`'s candidate partition) exists.
- **silent-substrate-bind**: a resolved topology is bound to a substrate that cannot realize it. Guard: declare conduction-degradation at Phase 3 rather than binding silently.
- **disclosure-as-axis**: the trace contract is mistaken for a sixth conduct axis and given a Gen set + gate. Guard: never-silent admits no alternative value, so disclosure is a cross-cutting overlay assembled (relay) from the final topology pass's replace-only products plus current substrate findings, never a gated axis — a Gen set here would be a false coproduct with no genuinely viable alternative under any value weighting.
- **object-control-conflation**: the decompose-recovery recipe (or any object-level split) acquires control-level governance — queue order, focus, span across nodes, child-state, recursion — turning the object-level split into a mini-orchestrator. Guard: decompose is object-level (it transforms abstractions); the conduct topology arranges the moves, and the split itself never owns orchestration. Governing what the session attends to across many nodes is a separate, control-level stratum, not a tail of decompose.
- **cross-span-absorption**: the `handoff_to_span` routing value pulls author-side portability machinery (deictic closure, self-containment audit, a comprehension gate) or the far-side compile-back (re-find, reconstruct) into `/conduct`, making it conduct a different span's cognition. Guard: `handoff_to_span` is routing-and-externalization only — `/conduct` names the cross-span destination at design time and declares the externalization obligation in the handoff annotation; the executing substrate externalizes its output to a substrate-owned record at execution time, and the future span receives that record's locator (Rule 19). Auditing the record on the author's side is out of scope in the same way the compile-back is: what the author cannot observe from inside its own span, it does not certify — the far-side compile-back belongs to the receiving span, which dereferences the record with its own tools. `/conduct`'s cognition stays single-span (the span wall is its horizon by definition); only its output bridges. Conducting the *next span's* moves trips the span discipline (Rule 7) — the wall is user-typed and undetected, and `/conduct` conducts up to it, not past it.
