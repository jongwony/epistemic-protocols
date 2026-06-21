---
name: conduct
description: "Conduct the method of a session's epistemic work before object-level cognition begins. When a work prospect needs multiple cognitive moves whose order, independence, reconciliation, termination, and routing are non-trivial, design a conduct topology over the protocol graph and hand off a method plan with in-session checkpoints; single-move work relays to that one protocol instead of conducting. Type: (MethodUnderdetermined, AI, CONDUCT, WorkProspect × ProtocolGraph) → ConductedMethod. Alias: Hyphegesis(ὑφήγησις)."
---

# Hyphegesis Protocol

Conduct how a session's epistemic work will be carried out — the order, independence, reconciliation, termination, and routing of its cognitive moves — when that method is underdetermined before object-level cognition begins. The morphism is **design THEN hand off**: Hyphegesis designs a conduct topology over the protocol graph and emits a method plan with in-session checkpoints, then stops; the substrate executes the moves. Type: `(MethodUnderdetermined, AI, CONDUCT, WorkProspect × ProtocolGraph) → ConductedMethod`.

## Definition

**Hyphegesis** (ὑφήγησις: a leading-the-way, guiding from just ahead): A dialogical act of conducting a session's epistemic work — deciding how its multiple cognitive moves relate in order, independence, reconciliation, termination, and routing — when the method is underdetermined while the goal is clear. The protocol's lexical verb is `/conduct`. It activates only when the work needs two or more moves whose conduct is non-trivial (single-move work relays to that one protocol), designs the conduct topology impact-first (locking stable axes, deferring volatile ones to in-session checkpoints), surfaces substrate feasibility as a handoff annotation, compiles a Recognition brief into each synthesis checkpoint (the structured fusion presentation the substrate executes there), assembles a cross-cutting trace contract (its disclosure overlay over the five axes — residuals, degradations, coverage caps, never silent), and hands off a method plan that the substrate — not Hyphegesis — executes.

```
── FLOW ──
Hyphegesis(WP) → MethodBrief(WP) → guard[relay-test, anti-self-application] →
  [single-move ∨ trivial-conduct: relay-route(extension) → deactivate] |
  [multi-move ∧ non-trivial:
    Qc(brief, warrant) → continue →
    MoveId(WP × PG) → Sc(MoveSet) → MS →
    CT_default_relay → loop( AxisGate(impact-first axis·region) → VM → update(CT) → auto-advance ) until Sufficient → CT → RegisterSynthesisCheckpoint(CT → checkpoints) →
    SubstrateHandoff(CT) → SH → CompileCheckpointBrief(synthesis checkpoints) → RecordDegradation(degradations) → AssembleTraceContract(residuals, degradations, coverage) → TC → converge(conduct trace incl. trace contract + checkpoint briefs) → ConductedMethod ]

── MORPHISM ──
WorkProspect × ProtocolGraph
  → brief(method, conduction_warrant)         -- infer the work prospect's method-brief; judge whether conduction is warranted
  → guard(relay_test, anti_self_application)  -- single-move work relays to that one protocol; Hyphegesis does not conduct Hyphegesis
  → identify(moves)                           -- candidate cognitive moves over the protocol graph
  → select(moves)                             -- user confirms the move set via Cognitive Partnership Move (Constitution)
  → design(conduct_topology)                  -- impact/leverage-first: lock stable axes, defer volatile to in-session checkpoints; edge-local over move-regions; synthesis-checkpoint registration occurs here (Phase 2), pairing with compile(checkpoint_briefs) at Phase 3
  → annotate(substrate_feasibility)           -- per resolved topology, surface substrate realizability as a handoff annotation
  → compile(checkpoint_briefs)                -- per synthesis checkpoint, compile the Recognition presentation contract the substrate executes there (structure, not content)
  → contract(trace_disclosure)                -- assemble the cross-cutting disclosure overlay: residuals + degradations + coverage caps; surfaced, never silent (not a sixth axis — assembled, not gated)
  → handoff(conducted_method)                 -- emit the method plan + in-session checkpoints, then stop (substrate executes)
  → ConductedMethod
requires: method_underdetermined(WP)           -- runtime checkpoint (Phase 0)
deficit:  MethodUnderdetermined                -- activation precondition (Layer 1/2)
preserves: WP                                  -- work prospect read-only
invariant: Conduction over Substrate

── TYPES ──
WP     = WorkProspect: the work or goal facing object-level cognition, with its method (conduct plan) not yet determined
PG     = ProtocolGraph: available protocols and move-neighbors (the dependency graph plus ad-hoc moves)
Move   = CognitiveMove: a single cognitive step (protocol invocation | analysis pass | delegation) — the unit Hyphegesis arranges, always object-level (never another conduction)
MS     = MoveSet: (WP × PG) → {Move₁ … Moveₙ}, n ≥ 2  -- n < 2 → guard relay, deactivation
MethodBrief = AI-inferred summary of WP: { work_intent, expected_handoff, span }  -- span = invocation → next planned /compact or /clear (the design-time horizon; the user types the command)
Warrant = ConductionWarrant ∈ {warranted, relay}  -- warranted = (moves ≥ 2 ∧ conduct non-trivial: ≥ 2 conduct-plans with differential futures); relay = single-move ∨ trivial (conduction entropy → 0)
MoveRegion = a contiguous sub-graph of moves sharing one conduct treatment (e.g. an authoring region vs a verification region); the single region "whole" when order is not a dependency DAG
axis   ∈ {order, independence, reconciliation, termination, routing}  -- FINITE seed; surfaced impact/leverage-first (most-constrained axis·region first), NOT a fixed sequence
  Gen(order)          ∈ {single_move (relay-only: trips the guard; never selected in Phase 2), sequential_chain, parallel_fan, dependency_dag}
  Gen(independence)   ∈ {isolated, shared}                                          -- isolation before synthesis-contamination
  Gen(reconciliation) ∈ {aggregate, dialectic, adversarial_refute, synthesis}       -- the only composable axis (⨾/∥)
  Gen(termination)    ∈ {single_pass, bounded_rounds, until_dry_ceiling, until_goal_met}
  Gen(routing)        ∈ {return_to_user, chain_to_next, handoff_to_protocol, deepen_on_finding}
ResolvedValue⟨a⟩ = per-axis resolved value, axis-typed (composition is NOT axis-uniform):
   ResolvedValue⟨reconciliation⟩ = Gen(reconciliation) ⊕ Compose(RVᵣ, RVᵣ, op)  -- the sole composable axis (the reconciliation-stage algebra)
   ResolvedValue⟨order⟩ = Gen(order);  ResolvedValue⟨independence⟩ = Gen(independence);  ResolvedValue⟨termination⟩ = Gen(termination);  ResolvedValue⟨routing⟩ = Gen(routing)  -- SCALAR axes: Gen only (⨾/∥ have no meaning on an order shape, an isolation flag, a termination bound, or a routing flag)
op     ∈ {⨾ sequential, ∥ parallel}             -- reconciliation-stage operators; extensible at operator level
CT     = ConductTopology = Map(axis → Map(MoveRegion → ResolvedValue⟨axis⟩))  -- EDGE-LOCAL: when Gen(order) = dependency_dag, independence/reconciliation/routing/termination resolve per move-region (non-uniform); order defines the regions (global); uniform axes carry the single region "whole"
CT_default = ⟨order: sequential_chain, independence: isolated, reconciliation: synthesis, termination: bounded_rounds, routing: return_to_user⟩ over the single region "whole"  -- the assembled tuple of per-axis Gen defaults; relay fast-path. NORMALIZATION: the flat tuple is shorthand for Map(axis → {whole → value}) — every flat axis value normalizes to the nested single-region form, so CT is uniformly Map(axis → Map(MoveRegion → ResolvedValue⟨axis⟩))
AxisGate = { axis, region, options, default, basis }  -- one surfaced per elicitation cycle, impact/leverage-first; reconciliation gate additionally offers ⨾/∥ composites
Checkpoint = an in-session conductor re-entry point (plan | exec | verify, or a finer sub-topology point) where Constitution may re-fire, carrying region: MoveRegion and brief: Option(CheckpointBrief)  -- in-session ONLY; /compact and /clear are the span wall, never checkpoints. region defaults to "whole" for checkpoints not bound to a specific move-region (the single-region normalization) and is the BINDING KEY: it ties each compiled brief to its region and is what the degradation-precedence rule resolves against (a substrate_infeasible Degradation demotes the brief of the checkpoint sharing its region). brief populates at Phase 3 CompileCheckpointBrief and is interpreted and acted on BY THE SUBSTRATE only after the ConductedMethod handoff completes — the protocol's own pre-handoff surfacing of briefs in the convergence trace is relay presentation, not substrate interpretation; a registered synthesis checkpoint with brief = None before compile is a valid in-protocol interim state, not a contract for the substrate
CheckpointSet = ordered Set(Checkpoint)  -- ordered by EXECUTION POSITION: each checkpoint sits at its region's position in the resolved order topology (Gen(order) shape), a synthesis checkpoint at its region's reconciliation point (after that region's moves complete); ties break by registration order. Hyphegesis conducts to the LAST checkpoint — last in execution position — then downstream-delegates (multi-consumer-like)
SynthesisCheckpoint = the Checkpoint registered per region whose resolved reconciliation ∋ synthesis ∧ routing = return_to_user (Select, Compose, or default-binding alike; CT_default qualifies via the region "whole")  -- the fusion re-entry point; its deferred decision is the synthesis output's first-class unit (OutputShape), routed here by the defer-volatile kernel. A runtime-predicate subset of Checkpoint, not a constructor-defined coproduct variant — the only predicate-defined type in this block
CheckpointBrief = { findings_ref: Map(Move → Slot(output_ref)), convergences: Slot(Set(finding)), divergences: Slot(Set(finding)), decision_axes: Slot(Set(decision_axis)), private_gap_slots: Set(GapSlot), fusion_candidates: Slot(Set(fusion_candidate)), output_shape_candidates: Slot(Set(OutputShape)) }  -- the Recognition presentation CONTRACT compiled into the plan for a synthesis checkpoint: structure only — per-move outputs exist only at execution, so the brief fixes WHAT is presented through references and slots, never content. findings_ref points the substrate at the per-move outputs (re-read at the checkpoint); convergences/divergences/decision_axes hold ∩, D, and the axes on which the per-move outputs divide (pre-gate relay, basis cited from the move outputs); fusion_candidates = fusion-result candidates (e.g. converged conclusion vs preserved divergence) with differential implications; output_shape_candidates = OutputShape candidates (Constitution at the checkpoint). NORMATIVE dependency between the two candidate sets: output shape is the organizing unit, so when both are live the shape decision resolves FIRST and the fusion candidates are expressed in the selected unit (dependent narrowing); the concrete gate realization — one combined presentation or successive turn-yields — is substrate discretion at the realization layer; the option-set relay test applies to each candidate set independently (either set with a single dominant candidate relays out)
   Slot(T) = a typed placeholder compiled at design time and filled with T by the substrate at execution  -- the "structure only" semantics made explicit: the slot is the compiled structure, T is execution-time content
   GapSlot = { category: a limit category the assigned move's protocol contracts to report, content: Slot(filled ∨ declined) }  -- private-gap slots are typed at design time by the contracted limit categories (a structural derivation from the assigned contracts, never execution-time content), surfaced for the user to fill or decline. Slot assembly is extension only because the slot structure is uniquely determined from the assigned contracts at design time (entropy → 0); when limit categories prove context-dependent at execution, slot assembly escalates to Constitution at the checkpoint; the filling is the user's Constitution either way. Moves without a protocol contract (an analysis pass or delegation) contribute an empty design-time slot set; private gaps such moves surface at execution route through the same escalation (slot assembly escalates to Constitution at the checkpoint)
OutputShape = the first-class unit the synthesis output is organized around  -- determined by the mission's question form, NOT by the topology; narrowed from session context and user utterances, judged after the per-move outputs exist (the convergence/divergence pattern is the evidence). Anchor instances, not an enum (the candidate space is open): a lens-organized report — a report organized around each analytical lens's findings (the DEFAULT shape for understand-the-situation missions and for the trivial-default path) — and a claim-survival report (natural after adversarial_refute arrangements). FALLBACK: when the mission's question form is unidentifiable from session context and user utterances, the lens-organized report is the default candidate and the candidate set carries an emergent free-form option — the substrate never exercises constitutive shape judgment without a gate
SH     = SubstrateHandoff: CT → FeasibilityAnnotation  -- substrate realizability surfaced as a handoff annotation (matter; composed in TOOL GROUNDING, not in phase prose)
VM     = ConductMove ∈ {Select(value), Compose(via op), Reorient(axis), Sufficient}  -- per-cycle user move in the axis gate; Compose offered on the reconciliation axis only
         Sufficient = a MOVE in the axis gate (NOT a separate gate) → converge elicitation (user Constitution declaration)
ResidualAxis = { axis, region, status: ResidualDisposition, reason }  -- unresolved axis·region carries Gen default + a surfaced disposition; silent default-binding forbidden
ResidualDisposition ∈ {Declared, Deferred, Dismissed}
Degradation = { region: MoveRegion, kind ∈ {independence_relaxed, substrate_infeasible}, resolved_value, reason }  -- a surfaced acknowledgment that a resolved value relaxes an epistemic guarantee or cannot be realized; never silently bound
   kind ∈ {independence_relaxed, substrate_infeasible}  -- independence_relaxed: selecting independence=shared at Phase 2 relaxes region isolation (epistemic); substrate_infeasible: the substrate cannot realize the resolved topology at Phase 3 (matter). Both flow into degradations
CoverageLimit = { region: MoveRegion, bound ∈ {top_n, no_retry, sampling, emergent}, dropped: prose-scope, reason }  -- a coverage cap the resolved topology imposes (what the method does NOT cover); surfaced explicitly — the "no silent caps" discipline. dropped = the uncovered intra-region extent (prose); every cap is intra-region (top_n/sampling) or termination-derived (no_retry), so it is recoverable from the resolved topology at assembly — conduct assigns every selected Move to a region, so there is no whole-Move drop to preserve (a Phase 1 move exclusion is the user's explicit Constitution decision, already known, not a silent cap). Derived from the topology at assembly via the source→bound functor: termination=single_pass → no_retry (one pass, no retry); termination=bounded_rounds or until_dry_ceiling → top_n (a round/ceiling upper bound — what lies beyond the bound is uncovered); termination=until_goal_met → no cap (goal-complete coverage); an intra-region sampling → sampling; any runtime-determined cap outside the named four → emergent (the open catch-all, surfaced via free description — keeps the FINITE seed open). Never separately gated
TraceContract = { residuals: Set(ResidualAxis), degradations: Set(Degradation), coverage_limits: Set(CoverageLimit) }  -- CROSS-CUTTING OVERLAY over CT (spans all axes·regions): the method's disclosure contract, realizing disclosure ONE SEMANTIC LEVEL ABOVE the five axes. INVARIANT, not a sixth axis — never-silent admits no alternative value, so it carries no Gen set, no AxisGate, no per-region selection; ASSEMBLED (relay) at handoff from accumulated residuals/degradations + derived coverage caps, never constituted by user choice
ConductedMethod = { topology: CT, move_assignment: Map(Move → ⟨order_position, region⟩), checkpoints: CheckpointSet, substrate_handoff: SH, trace_contract: TraceContract }
         -- the method PLAN; handed off (the substrate executes), with a conduct trace surfaced (completion evidence). trace_contract is the cross-cutting disclosure overlay (residuals + degradations + coverage caps), assembled at handoff from the accumulated Λ state — Λ keeps residuals/degradations as flat working accumulators; the output names the overlay. checkpoints carries each synthesis checkpoint's compiled CheckpointBrief into the plan (the brief travels with its checkpoint)
         -- order_position = the move's slot in the order topology (Gen(order) shape); the per-region axis values (independence/reconciliation/termination/routing) are read from CT[axis][region] — so all five axis values per move are recoverable from ⟨order_position, region⟩ + CT: each is a settled ResolvedValue, or (for an unresolved axis·region) its Gen default tagged with a ResidualDisposition — recoverability returns ResolvedValue ⊕ ResidualDisposition, never an empty slot

── WP-BINDING ──
bind(WP) = explicit_arg ∪ colocated_expr ∪ prev_user_turn ∪ ai_identified_prospect
Priority: explicit_arg > colocated_expr > prev_user_turn > ai_identified_prospect

/conduct "text"              → WP = "text"
/conduct (alone)             → WP = the work prospect under discussion
"how should I approach..."   → WP = the work named before the trigger
AI-detected trigger          → WP = the multi-move prospect AI identified (Hybrid: user confirms at the Phase 0 guard gate)

── PHASE TRANSITIONS ──
Phase 0: WP → MethodBrief(WP) → guard[relay-test, anti-self-application] → Qc(brief, conduction-warrant) → Stop → [warrant=relay: relay-route, deactivate | warrant=warranted: continue]   -- brief + warrant; relay-test result shown as pre-gate text [Tool]
Phase 1: (WP, PG) → MoveId(WP × PG) → Sc(MoveSet) → Stop → [|MS| < 2: relay-route to the surviving move's protocol (reusing the Phase 0 relay emission), deactivate | MS]                                                                      [Tool]
Phase 2: MS → CT_default_relay(extension: present CT_default + basis as pre-gate text) → proceed-unless-redirected → loop( AxisGate(next axis·region, impact/leverage-first — most-constrained first: default + basis + per-value differential implications; [reconciliation axis ONLY: + ⨾/∥ composites + affordance]) → Stop → VM ∈ {Select | Compose(reconciliation only) | Reorient | Sufficient} → update(CT, surfaced_axes, checkpoints, elicitation_cycle, degradations) → [VM=Sufficient: exit | last axis·region surfaced ∧ ¬Sufficient: implicit-Sufficient(relay) | else: auto-advance(relay) to next axis·region] ) until Sufficient ∨ all-axes-resolved → unresolved axis·region → Gen default + ResidualAxis → CT → RegisterSynthesisCheckpoint(track: region with reconciliation ∋ synthesis ∧ routing = return_to_user → checkpoints) → converge(topology trace)   -- impact-first design, Extension fast-path on default [Tool]
Phase 3: CT → SubstrateFeasibility(extension) → SH → CompileCheckpointBrief(track) → RecordDegradation(track) → AssembleTraceContract(track) → TC → converge(conduct trace incl. trace contract + checkpoint briefs) → handoff(ConductedMethod) → deactivate   -- per-topology substrate realizability annotation, compile each synthesis checkpoint's Recognition brief, record substrate_infeasible degradations, assemble the cross-cutting disclosure overlay (residuals + degradations + coverage caps), surface the conduct trace, then hand off the plan (execution out of scope) [Tool]

── LOOP ──
After Phase 0 (Method Brief + Warrant):
  warrant = relay     → relay-route to the single resolving protocol, emit it as the routing, deactivate (conduction not needed)
  warrant = warranted → Phase 1 → Phase 2 → Phase 3
  -- Esc key → terminate (no plan emitted)

During Phase 2 (Conduct Design — topology elicitation):
  Extension fast-path (entry): present CT_default + basis as pre-gate relay text and proceed-unless-redirected. The immediate-sufficiency path costs ZERO new turn-yields — the default topology resolves without opening the axis gate. The gate opens only when the user engages refinement.
  When the user engages refinement, each cycle surfaces the single most decision-relevant UNSURFACED axis·region by impact/leverage — the most-constrained axis first (the one whose values most divide the downstream conduct-plans), NOT a fixed order. Stability is a separate lock/defer criterion: a high-impact axis that is stable is locked now; a high-impact axis that is volatile is routed to an in-session checkpoint for re-decision; a low-impact axis takes its Gen default. This defer-volatile rule is the design kernel. Each move integrates one ConductMove and updates MODE STATE:
    VM = Select(value)  → record axis·region → Gen(value) in CT; surfaced_axes ∪= {(axis, region)}; [if axis = independence ∧ value = shared: degradations ∪= {Degradation{region, kind: independence_relaxed, resolved_value: shared, reason}} — surfaced acknowledgment of relaxed isolation, not a failure]; elicitation_cycle += 1; auto-advance to next axis·region
    VM = Compose(op)    → [reconciliation axis ONLY] record reconciliation → Compose(RVᵣ, RVᵣ, op) in CT; surfaced_axes ∪= {(reconciliation, region)}; elicitation_cycle += 1; auto-advance
    VM = Reorient(axis) → [region-aware, mirrors Select/Compose] remove the (axis, region) pair from surfaced_axes and CT[axis][region], re-surface the reframed (axis, region); elicitation_cycle += 1 (does NOT auto-advance) — sibling-region resolutions of the same axis are preserved
    VM = Sufficient     → a move in the axis gate (NOT a separate gate): converge — unresolved axis·regions auto-resolve to Gen default + ResidualAxis → CT resolved → Phase 3
    EXHAUSTION (all axis·regions surfaced ∧ ¬Sufficient) → implicit Sufficient (relay): converge with the now-complete CT → Phase 3
  BOUND: the loop is bounded by user agency — the user's Sufficient move or Esc-Stop terminates it. The seed axis set is FINITE, so each unsurfaced axis·region auto-resolves to its Gen default, and the finite set guarantees a terminal. This is NOT loop-until-fixpoint.
  Synthesis-checkpoint registration (defer-volatile kernel instance, track — deterministic, never gated; adds no cycle): once CT resolves (Select, Compose, or default-binding alike), each region whose reconciliation contains synthesis ∧ routing = return_to_user registers a synthesis checkpoint in checkpoints, keyed by that region and ordered at the region's reconciliation point in the order topology (after the region's moves complete; ties break by registration order). The output-shape decision attaches there as the checkpoint's deferred decision: it is high-impact and volatile by construction — the convergence/divergence pattern that determines it exists only after the per-move outputs exist — so the kernel defers it rather than locking a shape at design time. The trivial-default topology qualifies (CT_default carries reconciliation: synthesis, routing: return_to_user over "whole").
  converge(topology trace) → Phase 3. Esc key → tool-level termination (no plan emitted).

After Phase 3 (Handoff):
  Hyphegesis conducts to the LAST checkpoint in CheckpointSet, then downstream-delegates (multi-consumer-like) — execution and anything past the last in-session checkpoint belong to the substrate or to the routed protocol. The span ends at the next planned /compact or /clear, which the user types; Hyphegesis does not detect or emit that wall.
  A checkpoint may re-open Constitution mid-execution (its conduct can change there), but the design goal is to settle the least-volatile axes first so re-decision is rare.
  At a synthesis checkpoint, the substrate executes the compiled CheckpointBrief: per-move outputs with their convergences, divergences, and decision axes as pre-gate relay text (basis cited from the move outputs; context separate from the question); private-gap slots typed by the contracted limit categories and filled from what each move actually reported, for the user to fill or decline; then the output-shape and fusion-result candidates with differential implications as the Constitution gate — re-opening Constitution exactly where the deferred decision lives. The two candidate sets carry a normative order: output shape is the organizing unit, so when both are live the shape decision resolves first and the fusion candidates are expressed in the selected unit (dependent narrowing); whether the substrate realizes this as one combined presentation or successive turn-yields is its discretion at the realization layer. The option-set relay test applies to each candidate set independently — either set converging to a single dominant candidate is presented as relay. On a region carrying a substrate_infeasible degradation, the degradation record takes precedence: the brief of the checkpoint keyed to that region is advisory rather than binding — the substrate realizes what it can and keeps the degradation surfaced. Hyphegesis compiles this contract; the substrate performs it — the handoff boundary is unchanged.

Continue until convergence: warrant=relay deactivation, ConductedMethod handed off, or user Esc key.

Convergence evidence: At handoff, present the per-move trace — for each Move, show (Move → its ⟨order_position, region⟩ in CT) — AND the per-axis topology trace — for each resolved axis·region, show (axis·region → ConductMove → value, unresolved → Gen default + disposition) — AND the SubstrateHandoff annotations and the CheckpointSet (with each synthesis checkpoint's compiled CheckpointBrief) — AND the trace contract: the cross-cutting disclosure overlay (every surfaced residual with its disposition, every degradation, and every coverage cap the topology imposes), never silent. Convergence is demonstrated, not asserted.

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 MethodBrief (sense)           → Internal analysis (infer the work prospect's method-brief + span from the session)
Phase 0 guard (sense)                 → Internal analysis (relay-test: single-move ∨ trivial-conduct → relay; anti-self-application; no Λ mutation)
Phase 0 relay_route (extension)       → TextPresent+Proceed (single-move resolution: route to that one protocol as the recommendation, deactivate)
Phase 0 Qc (constitution)             → present (work prospect confirmation + conduction-warrant; relay-test result as pre-gate text; Esc key → loop termination at LOOP level)
Phase 1 MoveId (observe)              → Read, Grep, Glob (the dependency graph + session context to identify candidate moves)
Phase 1 Sc (constitution)            → present (MoveSet confirmation; multiSelect: true; Esc key → loop termination at LOOP level)
Phase 2 CT_default_relay (extension)  → TextPresent+Proceed (entry fast-path: present CT_default + basis as pre-gate relay text; proceed-unless-redirected; mirrors Phase 0 relay)
Phase 2 AxisGate (constitution)       → present (single axis·region gate, impact/leverage-first: default + basis + per-value differential implications; reconciliation axis ONLY additionally surfaces ⨾/∥ composites + a one-line affordance; moves {Select | Compose(reconciliation) | Reorient | Sufficient}; Esc key → loop termination at LOOP level)
Phase 2 RegisterSynthesisCheckpoint (track) → internal Λ update (REGISTER a synthesis checkpoint per region whose resolved reconciliation contains synthesis ∧ routing = return_to_user — Select, Compose, or default-binding alike; the checkpoint's deferred decision is the synthesis output's first-class unit (OutputShape); a deterministic defer-volatile application, never gated)
Phase 2 converge (extension)          → TextPresent+Proceed (topology trace: per resolved axis·region → ConductMove → value, unresolved → Gen default + disposition; registered synthesis checkpoints appear in the trace brief-less here — briefs compiled at Phase 3)
Phase 3 SubstrateFeasibility (extension) → TextPresent+Proceed (per resolved topology value, SURFACE substrate realizability as a handoff annotation; an extension op surfaces only — it does NOT mutate Λ)
Phase 3 CompileCheckpointBrief (track)   → internal Λ update (COMPILE each registered synthesis checkpoint's CheckpointBrief from the resolved topology and attach it to its checkpoint: findings references, convergence/divergence/decision-axis slots, private-gap slots typed by the contracted limit categories, fusion-result candidates, OutputShape candidates — a presentation contract of structure only; content exists at execution, so the brief never copies move outputs. Briefs are topology-derived, not substrate-derived — which is why compile precedes RecordDegradation: a later substrate_infeasible record demotes the affected region's brief to advisory without re-compiling it)
Phase 3 RecordDegradation (track)        → TaskUpdate/internal Λ update (RECORD the degradation: when the substrate cannot realize the resolved topology, populate Λ.degradations with a Degradation{region, kind: substrate_infeasible, resolved_value, reason}; the independence_relaxed kind is recorded the same way from the Phase 2 shared selection)
Phase 3 AssembleTraceContract (track)    → internal Λ update (ASSEMBLE the cross-cutting disclosure overlay: populate Λ.trace_contract from Λ.residuals + Λ.degradations + coverage caps derived from the resolved topology via the source→bound functor (single_pass → no_retry, bounded_rounds/until_dry_ceiling → top_n, intra-region sampling → sampling, until_goal_met → no cap; see CoverageLimit) — all intra-region or termination-derived, so recoverable at assembly without preserving dropped candidate moves; an INVARIANT aggregation, never gated — never-silent has no alternative value to choose, so no AxisGate fires)
Phase 3 surface trace contract (extension) → TextPresent+Proceed (surface the trace contract in the convergence trace: every residual, degradation, and coverage cap; relay only — it does NOT mutate Λ)
Phase 3 surface checkpoint briefs (extension) → TextPresent+Proceed (surface each compiled CheckpointBrief in the convergence trace; follows degradation recording, so a brief demoted to advisory by a substrate_infeasible record on its region is surfaced with that demotion visible; relay only — it does NOT mutate Λ)
Phase 3 handoff (dispatch)            → Agent (hand the ConductedMethod plan to the substrate; the substrate executes — execution is out of scope)
Λ (track)                             → TaskCreate/TaskUpdate (work prospect + framing shifts durable; per-axis bookkeeping stays in session)
-- Substrate realization: at the Phase 3 seam, read the session's actually-loaded inventory — its agents, skills, MCP servers, and the tools/system-prompt each exposes — and propose realizable substrates from that live inventory rather than a fixed list; the conducted moves then run inline, as isolated subagents, an agent-team, a dynamic-workflow, or in plan-mode, as the read inventory affords (these are realization modes, not a closed set — the inventory is the authority). Topology→substrate feasibility (a non-epistemic substrate handoff — the protocol surfaces feasibility; the substrate enforces realizability): a dialectic reconciliation requires persistent addressable peers; a parallel_fan ⨾ adversarial_refute over a static aggregate is realizable by a stateless pipeline (e.g. a dynamic-workflow). Surface feasibility per resolved topology value as a delegated handoff annotation (extension: surface only); when the read inventory cannot realize the resolved topology, record a substrate_infeasible degradation (track: the Λ.degradations mutation) rather than silently binding an infeasible substrate. The (constitution)/(extension)/(track) markers above remain the authoritative axis.

── MODE STATE ──
Λ = { phase: Phase, work_prospect: Option(WP), protocol_graph: Option(PG), move_set: Option(MS), topology: Option(CT), surfaced_axes: Set(axis × MoveRegion), checkpoints: Option(CheckpointSet), elicitation_cycle: Nat, substrate_handoff: Option(SH), residuals: Set(ResidualAxis), degradations: Set(Degradation), trace_contract: Option(TraceContract), active: Bool, cause_tag: String }
   -- residuals/degradations are flat working accumulators during Phase 2/3; trace_contract is the named overlay, assembled (None until Phase 3 AssembleTraceContract); checkpoints accumulates during Phase 2 from two sources — defer-volatile axis deferral and synthesis-checkpoint registration (reconciliation ∋ synthesis regions) — and gains briefs at Phase 3 CompileCheckpointBrief
Phase ∈ {0, 1, 2, 3}

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Dimension resolution emergent via session context.
```

## Core Principle

**Conduction over Substrate**: When a session's epistemic work needs several cognitive moves whose order, independence, reconciliation, termination, and routing are non-trivial, the method of conducting them is underdetermined before object-level cognition begins — and that gap is substrate-invariant (it survives deleting every runtime noun: a wrong order, contamination before synthesis, no stopping criterion remain for any reasoner). Hyphegesis designs that method as a conduct topology over the protocol graph and hands off a plan; it does not execute the moves, and it never binds a substrate it cannot realize — when realizability fails it declares conduction-degradation rather than binding silently, surfacing every relaxed guarantee, infeasibility, and coverage cap in the method's cross-cutting trace contract: a disclosure overlay that spans all five axes, and is not a sixth axis — never-silent has no alternative value to choose, so it carries no gate. Its identity is the deficit plus the operand (the protocol graph) plus the purpose (lock the stable, defer the volatile): the topology algebra is shared with `/frame` (which supplies the perspectives the algebra arranges), and the impact-first interview loop is shared with `/bound`; Hyphegesis instantiates both over the session's whole move set.

## Mode Activation

### Activation

**Pre-activation routing**: Before accepting a `/conduct` invocation, check the work shape. When the work resolves through a single protocol or a single move — its order, independence, reconciliation, termination, and routing are self-evident — suggest that one protocol directly (relay) rather than conducting. Engage `/conduct` when two or more moves are needed AND their conduct is non-trivial: more than one conduct-plan exists with a genuinely different downstream future. This guard precedes activation — it decides whether to accept the invocation.

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

**Qualifying condition**: Activate only when the method is genuinely underdetermined and multi-move. Large work scope or budget is *auxiliary* evidence that reinforces a multi-move trigger; it never triggers conduction on its own (it is substrate-adjacent). Small scope or single-move work does not warrant conduction.

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Warrant = relay | Route to the single resolving protocol, deactivate (conduction not needed) |
| ConductedMethod handed off | Emit the plan + checkpoints, hand off to the substrate, deactivate |
| User Esc key | Return to normal operation; no plan emitted |

## Protocol

### Phase 0: Method Brief and Conduction Warrant

Construct a Method Brief from the work prospect and **present** it for confirmation, together with the conduction-warrant judgment, via Cognitive Partnership Move (Constitution).

The Method Brief infers, from the work prospect:
- **Work intent**: what is to be accomplished and why
- **Expected handoff**: what the conducted method should produce before the substrate takes over
- **Span**: from this invocation (session start *or* mid-session) to the next planned `/compact` or `/clear`. This span is a design-time horizon — the natural end of a work chunk — not a runtime-detected event; the user types the command, and Hyphegesis stays design-time only — the span horizon is user-controlled, with runtime monitoring left to the substrate.

**Guard (relay-test)** runs before the gate and is shown as pre-gate text:
- If the work resolves through a single move or a single protocol — conduction entropy → 0, the method is self-evident — present that one protocol as a relay route and **deactivate**. Conduction is not warranted.
- **Anti-self-application**: Hyphegesis does not conduct Hyphegesis. The moves in a conduct plan are object-level protocols or analyses, never another conduction. Conducting the *build of* a protocol is object-level work (file edits, verification) and does not trip this guard; conducting "the conduction" does.

Activation requires (a) two or more moves AND (b) their conduct (order, independence, reconciliation, termination, routing) is non-trivial — more than one conduct-plan with a different downstream future exists.

### Phase 1: Move Identification

Identify the candidate cognitive moves over the protocol graph, then **present** the move set via Cognitive Partnership Move (Constitution) with `multiSelect: true`.

Read the dependency graph and the session to surface candidate moves (protocol invocations, analysis passes, delegations). Each move is an object-level step. The user confirms or edits the set; the set must contain two or more moves, or the guard relays to that single surviving move's protocol (as in Phase 0).

**Cross-session enrichment**: Prior conduct experiences accumulated in the hypomnesis store, and any context surfaced when `/recollect` has been invoked this session, bias the candidate move set toward move sequences the user has found productive for similar work. This is a heuristic input; the constitutive judgment remains with the user.

### Phase 2: Conduct Design (Topology Elicitation)

Lens-of-method established *which* moves. Conduct Design establishes *how* they relate — the **conduct topology** across five axes: order, independence, reconciliation, termination, routing.

**Extension fast-path**: On entering Phase 2, first present `CT_default` and its basis as pre-gate relay text, then proceed unless the user redirects. A user who wants the default incurs **zero new turn-yields**. The axis gate (Constitution) opens only when the user engages refinement.

**Elicitation cycle (impact/leverage-first)**: When the user engages refinement, each cycle surfaces the single most decision-relevant **unsurfaced** axis·region — the most-constrained axis first (the one whose values most divide the downstream conduct-plans), not a fixed sequence. This mirrors the most-constrained-variable heuristic. Stability is a *separate* lock/defer criterion layered on top of impact:
- **high-impact ∧ stable** → lock the value now,
- **high-impact ∧ volatile** → route it to an in-session checkpoint for re-decision rather than guessing now (the **defer-volatile kernel**),
- **low-impact** → take the Gen default.

Each axis has a defined downstream effect — no orphan axes:
- **order** shapes the move sequence (`single_move`, `sequential_chain`, `parallel_fan`, `dependency_dag`),
- **independence** prevents synthesis-contamination (`isolated` before reconciliation; `shared` relaxes it and records an `independence_relaxed` degradation),
- **reconciliation** combines separately-produced results (`aggregate`, `dialectic`, `adversarial_refute`, `synthesis`) — the only composable axis (⨾/∥),
- **termination** sets the epistemic stop criterion (`single_pass`, `bounded_rounds`, `until_dry_ceiling`, `until_goal_met`),
- **routing** sends each move's output onward (`return_to_user`, `chain_to_next`, `handoff_to_protocol`, `deepen_on_finding`).

**Edge-local axes**: when `order` is `dependency_dag`, independence/reconciliation/routing/termination are non-uniform across the move set — each region may resolve these axes differently. The topology resolves them per **move-region** rather than as one flat value; `order` defines the regions (global), and uniform axes carry the single region `whole`.

**Pre-gate context, gate question** (Context-Question Separation): present each axis·region's default, its basis, and each value's epistemic trade-off as text *before* the gate. The gate carries only the question and per-option differential implications. For the **reconciliation axis only** (the sole composable axis), the gate additionally surfaces relevant ⨾/∥ composites as recognizable options plus a one-line composition affordance. Only well-formed composites are offered, so composite validity is settled at selection — an ill-formed composite is never an option, which is why the degradation taxonomy needs no Phase-2 composite-incoherence kind.

**The Phase 2 gate surfaces only the epistemic fork**: each axis·region gate asks the user only the epistemic decision that settles the region's independence and reconciliation. Settling it fixes the region's isolation and how its results reconcile; the user is not asked how the region will be hosted. Realization belongs to the Phase 3 handoff seam (see Phase 3 and TOOL GROUNDING), not to this gate.

The user's move is one of:
- **Select(value)** — adopt a value for the axis·region; auto-advance to the next unsurfaced axis·region
- **Compose(via op)** — combine reconciliation values via ⨾ or ∥ (reconciliation axis only); auto-advance
- **Reorient(axis)** — reframe or replace the surfaced axis; the reoriented axis re-surfaces (no auto-advance)
- **Sufficient** — declare the topology mission-sufficient; converge. A **move within the axis gate**, not a separate gate.

**Termination (honest bound)**: the loop is bounded by user agency — a **Sufficient** move or Esc-Stop ends it. The finite axis set guarantees a terminal: surfacing the last axis·region without Sufficient converges by implicit Sufficient. Unresolved axis·regions auto-resolve to their Gen default and always surface that residual disposition, so the default-binding is visible in the trace rather than silent.

**Checkpoints**: the conduct plan records a `CheckpointSet` — in-session re-entry points (plan → exec → verify, or finer points within that topology). Checkpoints are **in-session only**; `/compact` and `/clear` mark the span wall, which lies outside the checkpoint set. Hyphegesis conducts to the last checkpoint, then downstream-delegates.

**Synthesis checkpoint (defer-volatile instance)**: a region whose resolved reconciliation contains `synthesis` and whose routing is `return_to_user` registers a **synthesis checkpoint** — the fusion re-entry point. Its deferred decision is the synthesis output's **first-class unit** (its output shape: is the output organized around perspectives, claims, options, risks, or whatever else the mission's question form makes primary?). The mission's question form determines that unit — the topology does not — and it is best judged after the per-move outputs exist, because the convergence/divergence pattern they produce is its evidence. So the defer-volatile kernel routes the shape decision to this checkpoint instead of locking it at design time. The trivial-default topology qualifies (its reconciliation is `synthesis`, its routing `return_to_user`), so the default path carries a synthesis checkpoint too, with the lens-organized report as its default shape.

### Phase 3: Substrate Handoff

For the resolved topology, surface substrate feasibility as a handoff annotation, then hand off the `ConductedMethod` plan.

The conduct topology is substrate-invariant; this phase — the form/matter **seam** — composes it with the runtime. Here, and only here, the AI proposes the matter: for each resolved topology value it proposes which substrate could realize the region, matching the region's realizability requirements (peer persistence, addressability, statefulness) against the available substrates. This proposal is a handoff annotation surfaced at the seam, not a Phase 2 gate question. When the available substrate cannot realize the resolved topology, **declare conduction-degradation** — record a `Degradation{region, kind: substrate_infeasible, resolved_value, reason}` in `degradations` (a `(track)` Λ mutation; surfacing the annotation is the separate `(extension)` op) — rather than silently binding an infeasible substrate.

**Synthesis checkpoint brief**: for each registered synthesis checkpoint, compile a `CheckpointBrief` into the plan — a presentation contract the substrate executes at the checkpoint. The brief is structure, not content: the per-move outputs exist only at execution, so it carries references and slots, never copies. Briefs are topology-derived, not substrate-derived, which is why the compile precedes degradation recording: a later `substrate_infeasible` record demotes the affected region's brief to advisory rather than binding — the degradation record takes precedence, and the substrate realizes what it can while keeping the degradation surfaced. The brief instructs the substrate to present, at the checkpoint: (a) the per-move outputs with their convergences, divergences, and decision axes as pre-gate text — a relay of the move outputs with cited basis, keeping context separate from the question; (b) private-gap slots typed by the limit categories each assigned move's protocol contracts to report — a design-time structural derivation, filled at the checkpoint from what each move actually reported — surfaced for the user to fill or decline; slot assembly is relay while the slot structure is uniquely determined from the assigned contracts (entropy → 0; categories that prove context-dependent at execution escalate slot assembly to Constitution at the checkpoint), and the filling is the user's constitutive act either way; (c) fusion-result candidates with their differential implications, including the output-shape candidates — the Constitution gate where the deferred shape decision re-fires. Output shape is the synthesis output's first-class unit, determined by the mission's question form; the candidates are narrowed from session context and user utterances and judged against the convergence/divergence pattern the moves actually produced. Two anchor instances, not an enum (the candidate space stays open): a **lens-organized report** — organized around each analytical lens's findings, the default shape for understand-the-situation missions and for the trivial-default path — and a **claim-survival report**, natural after an `adversarial_refute` arrangement. When the mission's question form is unidentifiable, the lens-organized report is the default candidate and an emergent free-form option stays in the candidate set, so the substrate never exercises constitutive shape judgment without a gate. When candidate analysis converges to a single dominant candidate, the substrate presents the finding as relay (option-set relay test). On the `/frame` path the brief **supplements** the synthesis contract frame compiles — frame's contract remains the default shape; the brief adds the Recognition structure (convergences, divergences, gap slots, candidates) around it rather than replacing it, so shape authority stays single.

Before handing off, **assemble the trace contract** — the cross-cutting disclosure overlay that spans all five axes: every unresolved axis·region with its disposition, every degradation (relaxed isolation or substrate infeasibility), and every coverage cap the resolved topology imposes (a `until_dry_ceiling` ceiling, a `bounded_rounds` bound, any sampling or top-N cut). This is not a sixth axis and opens no gate — "never silent" has no alternative value to choose, so the contract is *assembled* (relay) from the accumulated state, not *selected*. It realizes the disclosure discipline one semantic level above the axes: the handoff carries an explicit account of what the method does not cover, never a silent cap.

Hyphegesis then hands off the plan and stops. It produces the method plan plus its checkpoints; the substrate — or the routed protocol — executes the moves. This is the completeness boundary: the protocol records the handoff and halts.

## Rules

1. **Conduction warrant (guard)**: Activate only when the method is genuinely underdetermined AND two or more moves are needed whose conduct is non-trivial. Single-move or self-evident work relays to that one protocol; conduction is not performed. Hyphegesis does not conduct Hyphegesis — conduct-plan moves are object-level, never another conduction.
2. **Recognition over Recall**: Present structured options via Cognitive Partnership Move (Constitution) — structured content reaches the user with a response opportunity; Constitution interaction requires turn yield before proceeding. Hyphegesis serves two recognition modes: externalizing the user's implicit method, and revealing context state the user structurally cannot see (the session's accumulated shape) — the latter is its irreplaceable value.
3. **Design-time only**: Hyphegesis produces a method plan plus in-session checkpoints, then hands off. It has no runtime monitoring surface — it does not watch execution or emit runtime advisories. The span horizon (`/compact`, `/clear`) is user-controlled. A compiled checkpoint brief is plan content — the presentation contract the substrate executes at its checkpoint — not a runtime monitoring surface: compiling the brief keeps Hyphegesis design-time; performing the presentation belongs to the substrate.
4. **Impact/leverage-first design order**: Surface the most-constrained axis·region first (the one whose values most divide the downstream plan), not a fixed sequence. Stability is a separate lock/defer criterion: lock high-impact stable axes now; route high-impact volatile axes to an in-session checkpoint; default the low-impact ones. Defer-volatile is the kernel.
5. **Independence before contamination (edge-local)**: The `isolated` value preserves each region's independence until reconciliation; `shared` relaxes it and records a `Degradation{kind: independence_relaxed}` into `degradations` — a surfaced acknowledgment of relaxed isolation (the epistemic kind of degradation), not a substrate failure. When `order = dependency_dag`, independence resolves per move-region, not as one flat value.
6. **Conduction over Substrate (invariant)**: Phase prose names only epistemic conduction UP TO the handoff seam; concrete substrate realizations (agent, context-window, scheduler, authentication) live only in TOOL GROUNDING. The Phase 3 handoff is the form/matter seam: it names the substrate boundary — the handoff target plus per-topology feasibility — mirroring the suite's handoff pattern (cf. frame Rule 3, Object supplier, not arranger or executor). The conduct form resolves substrate-independently, then composes feasibility at the seam; when the substrate cannot realize the resolved topology, declare conduction-degradation — never bind silently.
7. **Span and checkpoints**: The span runs from invocation (session start or mid-session) to the next planned `/compact` or `/clear` — a design-time horizon the user types, never a runtime-detected wall. Checkpoints are in-session only; Hyphegesis conducts to the last checkpoint, then downstream-delegates (multi-consumer-like). A region resolving reconciliation containing `synthesis` with routing `return_to_user` registers a synthesis checkpoint; its compiled `CheckpointBrief` travels in the plan, and the deferred output-shape decision re-fires there.
8. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via Cognitive Partnership Move (Constitution). The question contains only the essential question; options contain only option-specific differential implications. Scope includes the Phase 2 axis gate: each axis·region's default, basis, and per-value trade-offs are pre-gate text; the gate carries only the question and per-option (per-value and per-composite) differential implications.
9. **Convergence evidence**: Present the transformation trace before handoff — per-move assignment, per-axis·region topology trace (including defaulted axes with their disposition), substrate annotations, the checkpoint set with each synthesis checkpoint's compiled brief, and the trace contract (residuals, degradations, coverage caps) — as demonstrated evidence, not assertion.
10. **Matter AI-propose at the seam**: The Phase 2 axis gate fires only for the epistemic-relevant fork (a region's independence and reconciliation) and never asks the user about matter/substrate. Matter is proposed by the AI only at the Phase 3 handoff seam: it scans the loaded environment and proposes which substrate could realize each region as a handoff annotation. This keeps pre-seam phase prose substrate-free; substrate naming lives at the seam and in TOOL GROUNDING.
11. **Gate integrity**: The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation.
12. **Option-set relay test (Extension classification)**: If analysis converges to a single dominant option (option-level entropy → 0), present the finding directly as Extension. Each Constitution option must be genuinely viable under different user value weightings.
13. **Plain emit discipline**: User-facing emit (Phase 1 move surfacing, Phase 2 axis gates, convergence traces, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token carries decision-relevant meaning, not project-internal overhead. Formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
14. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
15. **Trace contract (cross-cutting disclosure overlay)**: The method's disclosure obligations — unresolved axis·regions with their dispositions, degradations, and coverage caps — assemble into a single named trace contract that spans all five axes, surfaced at handoff and never silent. It is an overlay, not a sixth axis: never-silent admits no alternative value, so the contract carries no Gen set, no gate, and no per-region selection — it is assembled (relay) from accumulated state, not constituted by user choice. Coverage caps the resolved topology imposes (a `until_dry_ceiling` ceiling, a `bounded_rounds` bound, an intra-region sampling or top-N cut) are surfaced explicitly — no silent caps.
16. **Synthesis checkpoint brief (Recognition at fusion)**: Fusion is recognized, not recalled. Every synthesis checkpoint carries a compiled `CheckpointBrief` instructing the substrate to present the per-move outputs with their convergences, divergences, and decision axes as pre-gate text, private-gap slots typed by the limit categories the assigned protocols contract to report for the user to fill or decline, and the fusion-result and output-shape candidates with differential implications as the Constitution gate. The brief is a contract of structure, not content — content exists only at execution, so the brief carries references and slots, never copies. Output shape — the synthesis output's first-class unit — is determined by the mission's question form, narrowed from context and user utterances, and judged against the convergence/divergence evidence; the defer-volatile kernel presents it as recognizable candidates at the checkpoint rather than locking it at design time, and it stays a brief field — never a sixth axis, never an enum. When the question form is unidentifiable, the lens-organized report is the default candidate and the candidate set carries an emergent free-form option — the substrate never exercises constitutive shape judgment without a gate. On a region carrying a `substrate_infeasible` degradation, the degradation record takes precedence and that region's brief is advisory rather than binding.
17. **Formal blocks are runtime-normative**: This protocol's formal blocks (FLOW, MORPHISM, TYPES, PHASE TRANSITIONS, LOOP, TOOL GROUNDING, MODE STATE, CONVERGENCE) are LLM-facing and constitutive of protocol identity — they type the prose and carry the operational contract executed at runtime, not contributor-only documentation. When producing a reduced or single-shot realization of this protocol, do not reclassify a formal block as contributor spec and drop or thin it: removing a block removes the type that constitutes the protocol. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).

## Adversarial Guards

- **universal-dispatcher**: Hyphegesis sprawls into conducting every task, including single-move work. Guard: the Phase 0 relay-test deactivates on single-move or trivial-conduct work; warrant requires ≥2 moves with a non-trivial, branch-dividing conduct.
- **meta-recursion**: Hyphegesis is asked to conduct its own conduction. Guard: anti-self-application — conduct-plan moves are object-level only; "conduct the conduction" is rejected.
- **premature-lock**: a volatile high-impact axis is locked at design time on a guess. Guard: defer-volatile — route it to an in-session checkpoint instead of binding it before its determining evidence exists.
- **silent-substrate-bind**: a resolved topology is bound to a substrate that cannot realize it. Guard: declare conduction-degradation at Phase 3 rather than binding silently.
- **disclosure-as-axis**: the trace contract is mistaken for a sixth conduct axis and given a Gen set + gate. Guard: never-silent admits no alternative value, so disclosure is a cross-cutting overlay assembled (relay) from accumulated state, never a gated axis — a Gen set here would be a false coproduct (one value forbidden, one mandatory) with no genuinely viable alternative under any value weighting, so it fails the option-set relay test (Rule 12).
