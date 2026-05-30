---
name: frame
description: "Multi-perspective investigation. Recommends analytical lenses or assembles a team to analyze from selected viewpoints when the right framework is absent, then designs how those perspectives relate and reconcile (the deliberation topology); factual lookup or verification routes to fact-finding delegation, while contested design/value judgment routes to lens-conditioned evidence plus synthesis. Type: (FrameworkAbsent, AI, DESIGN, Inquiry) → FramedInquiry. Alias: Prothesis(πρόθεσις)."
---

# Prothesis Protocol

Resolve absent frameworks by placing available epistemic perspectives before the user, enabling lens selection prior to any perspective-requiring cognition, then — in Mode 2 (Inquire) only — designing how those perspectives relate and are reconciled (the deliberation topology) before inquiry proceeds. The morphism is **select THEN design**: Mode 1 (Recommend) terminates at the lens (its framed object is the lens alone, DT = ∅); Mode 2 continues to design the topology, so its framed object is a Method = ⟨Lens, DeliberationTopology⟩, not a lens alone. Type: `(FrameworkAbsent, AI, DESIGN, Inquiry) → FramedInquiry`.

## Definition

**Prothesis** (πρόθεσις): A dialogical act of presenting available epistemic perspectives as options when the appropriate framework is absent, enabling selection before any perspective-requiring cognition, and then designing the deliberation topology — how the selected perspectives relate and are reconciled — so the framed object is a complete Method ⟨Lens, DeliberationTopology⟩.

```
── FLOW ──
Prothesis(U) → Q(MB(U), M) → (MBᵥ, m) → G(MBᵥ) → C → {P₁...Pₙ}(C, MBᵥ) → S → Pₛ → LensEstablished →
  design(topology)[m=inquire] → DT →
  T₀(Pₛ) → Authorize(Pₛ) → Auth → T(T₀, Pₛ, MBᵥ, Auth) → ∥I(T) → Await(T_running) → R → Ω(T) → R' → P(R') → Δ(R') → Δₛ → D?(Δₛ, T, DT) → Dᵣ → Syn(R', Dᵣ) → L → O(L) → Q(routing) → J → FramedInquiry

── MORPHISM ──
Inquiry
  → confirm(mission_brief)              -- validate inquiry framing with user
  → gather(context)                     -- targeted context acquisition guided by MBᵥ
  → propose(perspectives)               -- generate distinct analytical lenses from context
  → select(perspectives)                -- user chooses lenses via Cognitive Partnership Move (Constitution)
  → LensEstablished                     -- compositional handoff object; Mode 1 terminalizes via characterize(Pₛ)
  → design(deliberation_topology)       -- elicit how perspectives relate/reconcile, fit to mission (m=inquire only; compositional algebra over a finite seed axis set, important-first, user-bounded)
  → create(team)                        -- TeamCreate → T₀ (empty team shell, no members yet)
  → authorize(tools)                    -- pass through user/orchestrator-supplied tool authorizations per perspective channel need ("None supplied" default)
  → spawn(team)                         -- spawn teammates into T₀ with MBᵥ + perspective + Auth → T
  → inquire(parallel)                   -- isolated perspective analysis per teammate
  → await(notifications)                -- passive wait for teammate completion signals (see TOOL GROUNDING)
  → collect(results)                    -- finalize inquiry outputs, retain team
  → preview(results)                    -- surface collected findings before synthesis
  → dialogue(triggers) → reports        -- peer negotiation → structured dialogue reports
  → synthesize(results)                 -- horizon integration into Lens L
  → present(lens)                       -- full synthesis output to user
  → route(selection)                    -- user routing decision
  → FramedInquiry
requires: framework_absent(U)             -- runtime checkpoint (Phase 0)
deficit:  FrameworkAbsent                  -- activation precondition (Layer 1/2)
preserves: U                               -- original request read-only
invariant: Placement over Prescription

── TYPES ──
U      = Underspecified request (purpose clear, approach unclear)
MB     = MissionBrief(U): { inquiry_intent, expected_deliverable, scope_constraint }  -- AI-inferred from U
Q(MB, M) = ConfirmAndSelect: (MB, ModeOptions) → (MBᵥ, m)  -- extern (combined Constitution interaction)
Q1(MB)   = Confirm: MB → MBᵥ                                -- Mission Brief confirmation component of Q
Q2(M)    = Select: ModeOptions → m                           -- Mode selection component of Q
           Q = Q1 × Q2 (composed in single Constitution interaction; Modify loop re-presents Q1 only)
MBᵥ    = Verified MissionBrief (user-confirmed)
m      = Mode ∈ {recommend, inquire}              -- lens recommendation vs. framed inquiry
G      = Gather: MBᵥ → C                       -- targeted context acquisition (guided by MBᵥ)
C      = Context (information for perspective formulation)
Pᵦ     = Pre-confirmed base perspectives (user-supplied in U; auto-included in Pₛ)
{P₁...Pₙ}(C, MBᵥ) = AI-proposed novel perspectives (Pᵢ ∉ Pᵦ; |Pᵦ| + n ≥ 2)
S      = Selection: {P₁...Pₙ} → Pₛ             -- extern (user choice; Pᵦ auto-included)
Pₛ     = Selected perspectives (Pₛ = Pᵦ ∪ sel({P₁...Pₙ}), |Pₛ| ≥ 2 when m=inquire; |Pₛ| ≥ 1 when m=recommend)
LensEstablished = Pₛ where lens selection complete  -- compositional handoff object; Mode 1 packages it into FramedInquiry, Mode 2 continues
-- framed object generalized: Pₛ → Method⟨Lens, DT⟩ (morphism = select THEN design: Mode 1 = lens-only terminus, Mode 2 only designs DT) --
Method = ⟨Lens, DT⟩                              -- Lens = Pₛ (existing); DT new
DT     = DeliberationTopology: ResolvedStrategy  -- INTRA-PROTOCOL: recorded in L provenance, NOT exported (inj₂ ships L); m=inquire only; m=recommend → ∅
ResolvedStrategy = Map(axis → ResolvedValue)     -- over a FINITE seed axis set (working set), user-bounded; unsurfaced seed axes → Gen default
axis   ∈ {interaction-mode, termination, independence, routing}   -- FINITE seed; interaction-mode & termination are TOP-PRIORITY (surfaced first); every axis has a defined downstream effect (no orphans — independence→Phase 4, interaction-mode+termination→Phase 5 dispatch, routing→Phase 5 routing)
SD     = StrategyDimension { axis, options, default, basis }   -- one surfaced per elicitation cycle (important-first); options rendered AT the gate with differential implications (incl. relevant pre-composed composites)
ResolvedValue = Gen(axis) ⊕ Compose(ResolvedValue, ResolvedValue, op)   -- composition algebra over finite generators
Gen(interaction-mode) ∈ {independent_aggregate, independent_first_then_dialogue, dialectical_debate, adversarial_refute}
Gen(termination)      ∈ {until_dry_ceiling, bounded_rounds, single_pass}
Gen(independence)     ∈ {isolated, shared}
Gen(routing)          ∈ {return_list, deepen_on_finding}
op     ∈ {⨾ sequential, ∥ parallel}              -- algebra operators; EXTENSIBLE at operator level (each new op carries its own dispatch rule), NOT runtime-new-primitives
ReconciliationBehavior = single-axis Phase 5 reconciliation primitive produced by an interaction-mode ResolvedValue: the Δ/D?/Dᵣ shape (which dialogue passes run; conditional vs unconditional; any adversarial stage), with its termination bound injected externally by dispatch_DT — single-value dispatch cannot see DT[termination]
DispatchedTopology     = ⟨ independence: Phase4_isolation, reconciliation: ReconciliationBehavior, routing: Phase5_presentation ⟩   -- whole-topology projection; the dispatch_DT codomain, structurally DISTINCT from single-axis ReconciliationBehavior (single-value dispatch and whole-Map dispatch_DT produce different types — this is what makes the totality claim mechanically checkable)
dispatch : ResolvedValue → ReconciliationBehavior   -- TOTAL homomorphism, defined for EVERY reachable ResolvedValue:
           dispatch(Gen)   = that generator's primitive reconciliation behavior (per Rule 7 wiring)
           dispatch(A ⨾ B) = run dispatch(A), then dispatch(B) over A's aggregate output (sequential)
           dispatch(A ∥ B) = run dispatch(A) and dispatch(B) in parallel over the same R'; each yields its own reconciliation track (Dᵣ-component). The two tracks are NOT merged by a new operator — both feed the single Synthesis step Syn, whose horizon fusion already integrates multiple reconciliation inputs into one (∩, D, A); Syn IS the join. Well-formedness: ∥ is valid only when both branches are Syn-composable (each contributes a fusible Dᵣ-track); branches that each demand exclusive ownership of the final aggregate (mutually-exclusive rewrites, e.g. two distinct adversarial rewrites of the same aggregate) are ill-formed → declare topology degradation per Rule 17
           dispatch(adversarial_refute) = adversarial pass over the current aggregate; the pass is INTRINSICALLY until-dry (stops when no new surviving refutation appears, ≥ K=1 empty pass, plus a hard ceiling), so its bound is self-contained and does NOT read DT[termination] (which single-value dispatch cannot see). dispatch_DT injects DT[termination] only for the dialogue (non-adversarial) stages; the adversarial stage always carries its own until_dry_ceiling. So X ⨾ adversarial_refute = dispatch(X) under DT[termination], then the until-dry adversarial pass
dispatch_DT : ResolvedStrategy → DispatchedTopology   -- whole-topology projection lifting single-value dispatch over the 4-axis Map (DT and DT_default are consumed through THIS, not through single-value dispatch); codomain is DispatchedTopology, NOT the single-axis ReconciliationBehavior:
           dispatch_DT(DT) = ⟨ independence: DT[independence] → Phase 4 isolation; reconciliation: dispatch(DT[interaction-mode]) with DT[termination] injected as the dialogue-stage bound → Phase 5; routing: DT[routing] → Phase 5 presentation ⟩
VM     = TopologyMove ∈ {Select(value), Fuse(compose via op), Reorient(axis), Sufficient}   -- per-cycle user move within the dimension gate
         Sufficient = a MOVE in the dimension gate (NOT a separate gate) → converge elicitation (user Constitution declaration)
DT_default = ⟨interaction-mode: independent_first_then_dialogue, termination: bounded_rounds(≤3/pair, conditional), independence: isolated, routing: return_list⟩
             -- whole-topology default = the tuple of per-axis Gen defaults (SD.default is per-axis; DT_default is the assembled tuple); dispatch_DT(DT_default) == the CURRENT Phase 4-5 pipeline exactly (backward-compatible OUTPUT)
T₀     = TeamCreate(Pₛ): empty team shell (no members yet)        -- created before authorize/spawn
T      = Spawn(T₀, Pₛ, MBᵥ, Auth): (∥ p∈Pₛ. Spawn(p, MBᵥ, Auth)) -- teammates spawned into T₀, each receives MBᵥ + perspective + Auth; shared task list
Auth   = Tool authorizations passed through to teammates per perspective channel need (user/orchestrator-supplied; "None supplied" default; core selects no provider)
T_running = Team with inquiries in flight             -- intermediate state between dispatch and completion
∥I     = Parallel inquiry dispatch: T → T_running    -- per-teammate Inquiry(p) launched
Await  = Passive completion barrier: T_running → R   -- see TOOL GROUNDING (Await entry) for realization
Ω      = Collection: R → R', retain(T)               -- finalize results; team lifecycle deferred to loop
R      = Set(Result)                                  -- raw inquiry outputs
R'     = Set(Result) post-collection                  -- after Phase 4 collection
P      = Preview: R' → UserVisible(R')               -- per-perspective summary output before synthesis (text, not Constitution interaction)
Δ      = Trigger detection: R' → Δₛ                  -- produces named trigger set
Δₛ     = Set(Trigger)                                 -- detected triggers per Trigger Detection Criteria; cite evidence per trigger
D?(Δₛ, T, DT) = Conditional dialogue: Δₛ ≠ ∅ → peer negotiation → structured report → conditional hub-spoke → Dᵣ; Δₛ = ∅ → skip dialogue (Dᵣ = ∅)   -- DT-parameterized via dispatch
Dᵣ     = Set(DialogueReport)                          -- peer negotiation outputs
Δ/D?/Dᵣ behavior = the reconciliation component of dispatch_DT(DT) — i.e. dispatch(DT[interaction-mode]) bounded by DT[termination]:
  dispatch(independent_aggregate)            → Δₛ ≡ ∅ (skip dialogue), Syn(R', ∅)
  dispatch(independent_first_then_dialogue)  → current behavior (Δ detect → conditional D? bounded ≤3/pair)   [DEFAULT]
  dispatch(dialectical_debate)               → unconditional D? (debate regardless of Δₛ)
  dispatch(X ⨾ adversarial_refute)           → run dispatch(X) under DT[termination], then the intrinsically until-dry adversarial pass (until_dry_ceiling — DT[termination] bounds stage X's dialogue only, not the adversarial pass)
DialogueReport = { perspective, final_position, agreement: AgreementStrength, divergence, rationale }  -- divergence gates hub-spoke conditional
AgreementStrength ∈ {strong, moderate, weak}  -- coordinator-assessed in Cross-Dialogue Outcomes (horizons fusion); strong: shared evidence + shared conclusion; moderate: shared conclusion, different evidence paths; weak: partial overlap, significant residual divergence
Syn    = Synthesis: (R', Dᵣ) → (∩, D, A)             -- dual-input: provenance-preserving (Dᵣ = ∅ when Δₛ = ∅)
L      = Lens { convergence: ∩, divergence: D, assessment: A, topology_provenance: DT }  -- Bottom-line is a presentation-layer projection of A (decision-relevant summary surfaced first), not a field of L; Syn(R', Dᵣ) → (∩, D, A) unchanged; topology_provenance records the resolved DT (intra-protocol provenance, surfaced in Synthesis Basis — NOT a coproduct discriminant: it rides inside inj₂(L) for provenance only, never branched on by consumers)
O      = Output: L → UserVisible(L)                   -- full synthesis presentation as text output before routing question
CountTier ∈ {single_modifier, domain_narrowing, escalation_candidate}  -- advisory metadata (does not branch LOOP); recorded in Lᵣ.tier for downstream reading
DownstreamUse ∈ {protocol_route, scope_directive, context_binding}  -- protocol_route: lens names a downstream protocol invocation; scope_directive: lens narrows downstream resolution domain; context_binding: lens enriches downstream protocol's pre-execution context
Lᵣ     = RecommendedLens { handoff: LensEstablished, tier: CountTier, downstream_use: DownstreamUse }
FramedInquiry = inj₁(Lᵣ where m = recommend ∧ LensEstablished) ⊕
                inj₂(L where (|Pₛ| ≥ 1 ∧ user_wrap_up) ∨ user_withdraw ∨ user_esc)
        -- coproduct discriminated by m: inj₁ Mode 1 → Lᵣ (selected lens handoff); inj₂ Mode 2 → L (synthesized inquiry lens). DT is NOT a coproduct discriminant: it DOES ride inside inj₂(L) as L.topology_provenance (intra-protocol provenance metadata, surfaced in Synthesis Basis), but it contributes no constructor (no inj₃(DT)) and consumers MUST NOT branch on its contents — they discriminate on the inj₁/inj₂ tag only.
user_wrap_up  = (J = wrap_up) at Phase 5   -- user selects wrap_up routing option
user_withdraw = J = withdraw at Phase 5    -- user selects graceful exit (team cleanup)
user_esc      = Esc key at any phase       -- tool-level termination (no cleanup)
J      = Routing ∈ {extend, add_input, wrap_up, withdraw}  -- Phase 5 USER routing gate (post-merge). The DT `routing`-axis value `deepen_on_finding` is NOT a J constructor — it is a Phase-3 design choice that CONDITIONS this gate's presentation (recommends J=extend(deepen existing) + surfaces an advisory aitesis handoff when a high-severity finding survives), preserving J's coproduct intact (Gate integrity, Rule 13)
J_mb   = MissionBriefRouting ∈ {confirm, modify(field)}  -- Phase 0 routing decision
PF     = preserve_findings: (T, L) → PF Qc(select categories)                       -- returns selected; TaskCreate is post-TeamDelete step

── U-BINDING ──
bind(U) = explicit_arg ∪ colocated_expr ∪ prev_user_turn ∪ ai_identified_request
Priority: explicit_arg > colocated_expr > prev_user_turn > ai_identified_request

/frame "text"                → U = "text"
/frame (alone)               → U = previous user message
"investigate... frame"       → U = text before trigger
AI-detected trigger           → U = request AI identified

Edge cases:
- Re-invoke: If Pₛ exists in context, offer as Pᵦ for new invocation

── PHASE TRANSITIONS ──
Phase 0:  U → MB(U) → Qc(MB, M) → Stop → (MBᵥ, m)              -- combined MB confirmation + mode selection [Tool]
Phase 1:  MBᵥ → G(MBᵥ) → C                                      -- targeted context acquisition
Phase 2:  (C, MBᵥ) → Sc({P₁...Pₙ}(C, MBᵥ)) → Stop → Pₛ → LensEstablished  -- perspective selection [Tool]
Phase 3:  LensEstablished → [m=recommend: skip] | [m=inquire: DT_default_relay(extension: present DT_default + basis as pre-gate text) → proceed-unless-redirected → loop( SDc(next unsurfaced seed axis, top-priority first: default + basis + per-value differential implications + relevant pre-composed composites + ⨾/∥ affordance) → Stop → VM ∈ {Select | Fuse | Reorient | Sufficient} → update(ResolvedStrategy, surfaced_dims, elicitation_cycle) → [VM=Sufficient: exit | last axis surfaced ∧ ¬Sufficient (no next unsurfaced axis): implicit-Sufficient(relay) exit | else: auto-advance(relay) to next unsurfaced axis] ) until VM=Sufficient ∨ all-axes-surfaced ] → unsurfaced seed axes → Gen default → DT → converge(topology trace)  -- deliberation design: topology elicitation, important-first, compositional, Extension fast-path on default [Tool]
Phase 4:  DT → AgentMap?(Pₛ) → [0/1: extension | 2+: Qc(map) → Stop] → T₀[TeamCreate](Pₛ) → Authorize(Pₛ) → Auth → ∥Spawn[Task](T₀, Pₛ, MBᵥ, Auth) → T → ∥I[TaskCreate](T) → Await[IdleNotification](T_running) → R → Ω[SendMessage](T) → R' → P(R')  -- agent mapping + tool-authorization passthrough + inquiry dispatch + wait + collection + preview [Tool]
Phase 5:  R' → Δ(R') → Δₛ → D?(Δₛ, T, DT)[SendMessage] → Dᵣ → Syn(R', Dᵣ) → L → O(L) → route(DT)[return_list: present L | deepen_on_finding: if surviving high-severity finding → recommend J=extend(deepen) + advisory aitesis handoff as pre-gate text, else present L] → Qc(routing) → Stop → J  -- triggers (DT dispatch), cross-dialogue, synthesis, DT-routing CONDITIONS the J gate (no new constructor), presentation & routing [Tool]
          J=wrap_up → PF Qc(select) → Stop → Ω → TeamDelete → TaskCreate(selected)  [Tool]

── LOOP ──
After Phase 0 (Mission Brief + Mode Selection):
  (MBᵥ, m) = Q result:
    m = recommend → Phase 1 → Phase 2 → LensEstablished → characterize(Pₛ) → FramedInquiry → terminate
    m = inquire   → Phase 1 → Phase 2 → LensEstablished → Phase 3 → Phase 4 → Phase 5
  J_mb = confirm       → proceed to Phase 1 with (MBᵥ, m)
  J_mb = modify(field) → re-present Q1(MB') → Stop → MBᵥ (m retained from initial selection)
  -- Esc key → terminate (no team exists)

After LensEstablished (mode branching):
  J = recommend → Mode 1 terminus. characterize(Pₛ) into Lᵣ, emit FramedInquiry, and terminate:
    characterize(Pₛ) = classify Pₛ by count tier (advisory metadata; all tiers terminate Mode 1, no LOOP branching):
      Pₛ.count = 1                                   → tier = single_modifier        (downstream_use = context_binding)
      Pₛ.count ≥ 2 with cohesive subdomain           → tier = domain_narrowing       (downstream_use = scope_directive)
      Pₛ.count ≥ 2 with heterogeneous tension        → tier = escalation_candidate   (downstream_use = scope_directive; user may re-invoke `/frame` with m=inquire if Mode 2 synthesis is wanted)
    Tier value is recorded in Lᵣ.tier; user re-invocation is the only path to Mode 2 from a Mode 1 terminus.
    m = recommend skips Phase 3 (Deliberation Design): DT = ∅, lens-only handoff.
  J = inquire → Continue to Phase 3 (Deliberation Design → team spawn → parallel inquiry → synthesis → FramedInquiry)

During Phase 3 (Deliberation Design — topology elicitation, m=inquire only):
  Extension fast-path (entry): present DT_default + basis as pre-gate relay text and proceed-unless-redirected (mirrors Phase 0 MB_from_arg). The immediate-sufficiency path costs ZERO new turn-yields — the default topology resolves without opening the dimension gate. The dimension gate opens only when the user engages topology refinement.
  When the user engages refinement, each cycle surfaces the most-decision-relevant UNSURFACED seed axis (top-priority first: interaction-mode, then termination, then independence/routing) with default + basis + per-value differential implications + relevant pre-composed composites + a one-line ⨾/∥ composition affordance via the single dimension gate (SDc). One gate type offering moves {Select, Fuse, Reorient, Sufficient}. After a value-setting move, AUTO-ADVANCE (relay) to the next unsurfaced axis. Each move integrates one TopologyMove and updates MODE STATE:
    VM = Select(value)  → record axis → Gen(value) in ResolvedStrategy; surfaced_dims ∪= {axis}; elicitation_cycle += 1; auto-advance to next unsurfaced axis
    VM = Fuse(compose)  → record axis → Compose(...,op) in ResolvedStrategy; surfaced_dims ∪= {axis}; elicitation_cycle += 1; auto-advance to next unsurfaced axis
    VM = Reorient(axis) → remove the replaced axis from surfaced_dims and from ResolvedStrategy, re-surface the reframed axis; elicitation_cycle += 1 (does NOT auto-advance — same gate re-opens on the reoriented axis)
    VM = Sufficient     → a move in the dimension gate (NOT a separate gate): converge elicitation — unsurfaced seed axes auto-resolve to their Gen default → DT resolved → Phase 4
    EXHAUSTION (all axes surfaced ∧ ¬Sufficient) → when a Select/Fuse move surfaces the LAST unsurfaced seed axis (surfaced_dims = {interaction-mode, termination, independence, routing}) and the user has not declared Sufficient, auto-advance has no next axis → treat as implicit Sufficient (relay): converge elicitation with the now-complete ResolvedStrategy → Phase 4. This is the relay completion of the auto-advance pattern (finite-set terminal), not a new gate.
  BOUND: the elicitation loop is bounded by the user's agency — the user's Sufficient declaration (a Constitution move in the dimension gate) or Esc-Stop terminates it. The seed axis set is FINITE, so each unsurfaced seed axis auto-resolves to its Gen default, AND the finite set guarantees a terminal: surfacing the last axis without Sufficient converges by implicit Sufficient (relay), since auto-advance then has no next axis. The loop is bounded by user agency (if the strategy diverges the user stops), not by claiming a residual default closes an open/unbounded axis set. This is NOT loop-until-fixpoint.
  The separate SATc satisfaction gate is ELIMINATED — Sufficient is now a move within the dimension gate, removing the redundant per-cycle gate and its meta-action "next dimension" peer branch.
  converge(topology trace) → Phase 4. Esc key → tool-level termination (no team exists yet).

During Phase 4 (Inquiry, including Await):
  Coordinator is passive during Await: no polling, no status checks, no passive observation per Rule 14 wait discipline
  Esc key → tool-level termination (no Constitution interaction tool open; team orphaned per user_esc)
  -- Recovery from indefinite wait is user-initiated; no timeout or polling fallback

After Phase 5 (routing):
  -- DT routing-axis conditioning (pre-gate, NO new J constructor): DT[routing] = deepen_on_finding + a surviving high-severity finding → Phase 5 surfaces an advisory deepen/aitesis-handoff as pre-gate text and recommends J=extend(deepen existing) as the first option; DT[routing] = return_list (or deepen_on_finding with no surviving high-severity finding) → present L with the standard gate. The user's J choice stays constitutive — deepen_on_finding biases presentation, never auto-routes.
  J = extend     → Qc(add perspective | deepen existing | review execution results) → Stop
                   → Phase 2 (new perspective) or Phase 4 (SendMessage to existing team)
  J = add_input  → user context → revise Syn(R' + input, Dᵣ) → L' → O(L') → Qc(routing) → Stop
  J = wrap_up    → PF Qc(select) → Stop → Ω(T, shutdown) → TeamDelete → TaskCreate(selected) → terminate with L
  J = withdraw   → Ω(T, shutdown) → TeamDelete → terminate with current L
                   (withdraw = graceful exit, preserve_findings skipped)

Continue until convergence: user satisfied OR user withdraw OR user Esc key.

Adversarial-refute termination bound: when the resolved DT contains an `X ⨾ adversarial_refute` stage, the adversarial pass over the aggregate terminates until-dry — it stops when a pass surfaces no new surviving refutation (≥ K=1 consecutive empty pass) AND a hard ceiling on passes is reached, whichever comes first. This is explicitly NOT a raw loop-until-fixpoint; the ceiling guarantees termination even if refutations never fully dry up.

Convergence evidence: At wrap_up (Mode 2), present transformation trace — for each p ∈ Pₛ, show (FrameworkAbsent → p.contribution to L), AND present the topology trace — for each resolved seed axis, show (axis → TopologyMove → value), including unsurfaced seed axes resolved to their Gen default. At recommend terminus (Mode 1), present transformation trace — for each p ∈ Pₛ, show (FrameworkAbsent → p.selected as lens); no topology trace (DT = ∅). Convergence is demonstrated, not asserted.

── BOUNDARY ──
Q(MB, M) (confirm+select) = extern: Mission Brief confirmation + mode selection boundary
G (observe)  = purpose: targeted context acquisition (guided by MBᵥ)
S (select)  = extern: user choice boundary
I (inquiry) = purpose: perspective-informed interpretation

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 MB_from_arg (extension)  → TextPresent+Proceed (when user_invoked ∧ explicit_arg(U); Q1=confirm + m=ai_recommended_mode defaults; Phase 2 Sc remains constitution as downstream correction opportunity)
Phase 0 Qc (constitution)        → present (combined: Q1=Mission Brief confirmation, Q2=mode selection; when no explicit_arg; Esc key → loop termination at LOOP level)
Sc (constitution)                → present (mandatory; multiSelect: true; lens selection is epistemic choice; Esc key → loop termination at LOOP level)
Phase 3 DT_default_relay (extension) → TextPresent+Proceed (entry fast-path: present DT_default + basis as pre-gate relay text; proceed-unless-redirected; immediate-sufficiency path costs ZERO new turn-yields — the minimum-gate-count invariant for the default topology; m=inquire only; mirrors Phase 0 MB_from_arg)
Phase 3 SDc (constitution)       → present (single topology dimension gate, opened only on user refinement: surface one seed axis — default + basis + per-value differential implications (incl. relevant pre-composed composites like independent_aggregate ⨾ adversarial_refute as recognizable options) + one-line ⨾/∥ composition affordance; per-cycle, top-priority axis first; moves {Select | Fuse | Reorient | Sufficient} — Sufficient is a move here, no separate satisfaction gate; m=inquire only; Esc key → loop termination at LOOP level)
Phase 3 converge (extension)     → TextPresent+Proceed (topology trace: per resolved seed axis → TopologyMove → value, unsurfaced → Gen default; proceed to Phase 4)
Phase 4 AgentMap_auto (extension)  → TextPresent+Proceed (when agent_count(perspective) ≤ 1; auto-assign for 1 match, AI-generated for 0 matches; execution assignment correctable by team restructuring)
Phase 4 AgentMap_select (constitution) → present (when agent_count(perspective) ≥ 2; user confirms agent-perspective mapping; option-set relay test applies)
Phase 4 T₀ (dispatch)    → TeamCreate tool (parallel topology: creates empty team shell T₀ with shared task list; fires after either AgentMap_auto or AgentMap_select resolves the perspective → agent mapping)
Phase 4 Authorize (extension) → TextPresent+Proceed (passthrough of user/orchestrator-supplied tool authorizations per perspective channel need into spawn prompts; "None supplied" default; core selects no provider — deterministic relay, bounded regret)
∥Spawn (dispatch)        → Task tool (parallel topology: team_name, name: spawn perspective teammates into T₀ → T — each receives MBᵥ + perspective + tool authorizations (Auth); no Phase 1 context G passed)
∥I (track)               → TaskCreate/TaskUpdate (parallel topology: shared task list for inquiry coordination — dispatch phase)
Await (sense)            → IdleNotification (passive wait: teammate SubagentStop events surface as coordinator idle notifications; teammate→coordinator message delivery occurs at coordinator turn boundary, not at teammate send time; async message-passing execution model; no coordinator poll per Rule 14)
Phase 4 P (extension)        → TextPresent+Proceed (per-perspective epistemic contribution + key finding summaries)
Phase 5 Δ (sense)        → Internal operation (trigger check per Trigger Detection Criteria, DT-parameterized; cite evidence per detected trigger)
Phase 5 D? (dispatch)    → SendMessage tool (DT dispatch: dispatch(independent_first_then_dialogue) → coordinator signals tension topic to peer pair → peer exchange → structured report → conditional hub-spoke, skip if Δₛ = ∅; dispatch(independent_aggregate) → skip; dispatch(dialectical_debate) → unconditional; dispatch(A ⨾ B) → run dispatch(A) then dispatch(B) over A's aggregate; dispatch(A ∥ B) → run both in parallel, the two tracks fused by Syn (valid only if Syn-composable, else topology degradation per Rule 17); X ⨾ adversarial_refute → adversarial pass over aggregate, intrinsically until_dry_ceiling)
Phase 5 route (extension)    → TextPresent+Proceed (routing axis dispatch CONDITIONS the J gate, adds no constructor: return_list → synthesize + present L with the standard J gate (current default); deepen_on_finding → on a surviving high-severity finding, surface an advisory deepen/handoff as pre-gate text and recommend J=extend(deepen existing) — prothesis→aitesis is an advisory+downstream edge per graph.json, surfaced as an advisory handoff, not a hard dependency; the constitutive J choice stays with the user)
Phase 5 O (extension)        → TextPresent+Proceed (full synthesis — Bottom-line, Integrated Assessment, Convergence, Divergence, Synthesis Basis incl. resolved-DT provenance)
Phase 5 Qc (constitution)        → present (routing only: extend/add_input/wrap_up/withdraw options; loop path + team lifecycle; Esc key → loop termination at LOOP level)
PF Qc (constitution)             → present (multiSelect: preservation scope; knowledge preservation scope; in LOOP wrap_up path only)
wrap_up TaskCreate (track) → TaskCreate (session-scoped: PF-selected findings, created after TeamDelete clears team context)
Ω (dispatch)             → SendMessage tool (type: "shutdown_request", graceful teammate termination)
Λ (track)                → TaskCreate/TaskUpdate (mandatory after Phase 4 spawn, per perspective; TaskUpdate for status tracking)
G (observe)              → Read, Glob, Grep (meta-scope context acquisition: guided by MBᵥ to identify relevant perspectives — not passed to teammates; teammates independently collect object-scope evidence through their own lens)
Phase 5 Syn (sense)      → Internal operation (no external tool; basis_cited in O(L) Synthesis Basis section)
characterize (sense)     → Internal operation (perspective count tier classification → Lᵣ { handoff, tier, downstream_use } packaging emitted as inj₁ FramedInquiry)
converge (extension)          → TextPresent+Proceed (convergence evidence trace; proceed with framed inquiry)
-- Substrate realization: agent-team (TeamCreate/Task) | dynamic-workflow | isolated-subagent | plan-mode are PEER substrates for Phase 4-5 inquiry/reconciliation. Topology→substrate feasibility (per Rule 17, a non-epistemic substrate handoff — the protocol surfaces feasibility; the substrate enforces realizability): dialectical_debate requires persistent addressable peers; independent_aggregate and X ⨾ adversarial_refute over a static aggregate are realizable by a stateless pipeline (e.g. a dynamic-workflow: parallel inquiry → single adversary pass, no cross-talk). Surface substrate feasibility per resolved DT value as a delegated handoff annotation; when the substrate cannot realize the elicited DT (e.g. plan-mode cannot host dialectical_debate), declare topology-degradation (tie to Rule 3 partial-Lens) rather than silently binding an infeasible substrate. The (constitution)/(extension) markers above remain the authoritative axis; substrate-as-(extension) migration is DEFERRED — current (constitution) annotations stay runtime-authoritative, no split-extension entries added.

── CATEGORICAL NOTE ──
∩ = graded meet (intersection with coordinator-assessed agreement strength) over comparison morphisms between perspective outputs
D = join (union of distinct findings) where perspectives diverge
A = synthesized assessment (additional computation)

── MODE STATE ──
Λ = { phase: Phase, mode: Mode, mission_brief: Option(MBᵥ), perspectives: Option(Pₛ), topology: Option(DT), surfaced_dims: Set(axis), elicitation_cycle: Nat, triggers: Option(Δₛ), dialogue_reports: Option(Dᵣ), lens: Option(L), active: Bool, team: Option(TeamState) }
Mode ∈ {recommend, inquire}                       -- Λ.mode resolved in Phase 0 Q
TeamState = { name: String, members: Set(AgentRef), tasks: Set(TaskId) }
AgentRef  = { name: String, type: String, perspective: Option(String) }

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Dimension resolution emergent via session context.
```

## Core Principle

**Placement over Prescription**: AI places available perspectives before the user without prescribing which to adopt. User selects.

## Mode Activation

### Activation

**Pre-activation routing**: Before accepting a `/frame` invocation, check the task shape. When the task is primarily finding or verifying facts, suggest fact-finding delegation instead; engage `/frame` when reasonable people could weigh contested design, value, interpretation, or scope differently and the work needs lens-conditioned evidence plus synthesis. This guard precedes activation — it decides whether to accept the invocation, not how the mode behaves once active.

Command invocation activates mode until session end.

**Activation layers**:
- **Layer 1 (User-invocable)**: `/frame` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: Purpose present but approach unspecified; multiple valid frameworks detected via in-protocol heuristics.

### Priority

<system-reminder>
When Prothesis is active:

**Supersedes**: Immediate analysis patterns in loaded instructions
(Perspective Selection must complete before analysis begins)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: Before analysis, present perspective options via Cognitive Partnership Move (Constitution).
</system-reminder>

- Prothesis completes before other workflows begin
- Loaded instructions resume after perspective is established

Consult `references/conceptual-foundations.md` for design rationale (Plan Mode Integration, Distinction from Socratic Method, Parametric Nature, Specialization) and activation edge cases (per-message application rules, mode deactivation triggers, trigger/skip heuristics).

## Protocol

### Phase 0: Intent Confirmation (Mission Brief)

Construct a Mission Brief from the user's request and **present** it for confirmation via Cognitive Partnership Move (Constitution).

**Phase 0 establishes the Mission Brief as primary context vehicle for teammate spawn prompts** — it structurally guarantees the agent-teams best practice ("give teammates enough context") rather than depending on coordinator inference. When `user_invoked ∧ explicit_arg(U)`, the Phase 0 MB_from_arg Extension entry takes the path: the MB is still constructed from U but proceeds without the Phase 0 Constitution interaction; AI uses `J_mb=confirm` and `m=ai_recommended_mode` as defaults. Phase 2 S (perspective selection) remains Constitution, providing a downstream correction opportunity. The Extension path does not apply to J=extend re-invocations within an active loop.

The coordinator infers the Mission Brief from U (the user's request):

- **Inquiry Intent**: What is being investigated and why
- **Expected Deliverable**: What form the output should take (e.g., code review, risk analysis, decision recommendation)
- **Scope Constraint**: What is included and excluded from analysis

Present the inferred Mission Brief as text output:
- **Intent**: [inferred inquiry intent]
- **Deliverable**: [inferred expected deliverable]
- **Scope**: [inferred scope constraint]

Then **present** the combined Q1+Q2:

```
Q1. Mission Brief:
1. **Confirm** — proceed with this Mission Brief
2. **Modify intent** — adjust what is being investigated
3. **Modify deliverable** — adjust the expected output form
4. **Modify scope** — adjust inclusions/exclusions

Q2. Mode:
1. **Recommend** (Recommended) — lightweight lens recommendation (no team assembly)
2. **Inquire** — full multi-perspective investigation with agent team
```

**Pre-fill from explicit text**: `/frame "text"` → pre-fill from provided text, still confirm.

**Combined question**: Mission Brief confirmation and Mode selection are combined into a single Cognitive Partnership Move (Constitution):
- Q1 (Mission Brief): MB confirmation/modification (4 options)
- Q2 (Mode): Recommend / Inquire (2 options)
AI places the recommended Mode as Q2's first option with "(Recommended)" suffix based on inquiry characteristics:
The recommendation matches mode to analytical demand — Recommend when the inquiry can be resolved from a single analytical direction, Inquire when multiple distinct perspectives are structurally necessary.

**Mode 1 (Recommend)**: Per LOOP — terminates after Phase 2 characterization. No team. `LensEstablished` remains the compositional handoff object; `Lᵣ` packages it as a minimal `FramedInquiry` (`inj₁` constructor) for downstream use. Mode 1 produces a partial resolution: the lens is established (`FrameworkAbsent` is structurally addressed at the framing layer) but downstream protocols apply the lens to complete domain-specific resolution. Advisory-edge consumers (Syneidesis, Aitesis, Analogia) branch ingest on the `FramedInquiry` coproduct tag — `inj₁(Lᵣ)` is treated as a context-binding handoff (no synthesis fields available), `inj₂(L)` as a fully synthesized lens with convergence/divergence/assessment.

**Mode 2 (Inquire)**: Per LOOP — full Phase 0 through Phase 5 cycle (including Phase 3 Deliberation Design).

**Distinction from other protocols**: Phase 0 operates at the operational layer (structuring context for agent-teams), not the epistemic layer. Phase 0 packages confirmed intent into a structured vehicle for teammate consumption — a prerequisite for quality spawn prompts, not a substitute for upstream intent resolution.

### Phase 1: Context Gathering

Gather context sufficient to formulate distinct perspectives, **guided by MBᵥ**.

MBᵥ.inquiry_intent and MBᵥ.scope_constraint direct which files, systems, and domains to investigate. Gathering intensity scales with MBᵥ complexity: narrow-scope inquiries with clear domain boundaries warrant targeted collection; broad or cross-domain inquiries warrant deeper investigation. Do not proceed to Phase 2 until context is established.

### Phase 2: Prothesis (Perspective Placement)

After context gathering (Phase 1), **present** perspectives via Cognitive Partnership Move (Constitution) with `multiSelect: true`.

**Cross-session enrichment**: Prior framing experiences accumulated in Anamnesis's hypomnesis store (session recall indices written by the SessionEnd/PreCompact hook) guide Phase 2 perspective formulation bidirectionally — previously effective analytical lenses for similar domains provide starting hypotheses (exploitation), while prior coverage gaps (unaddressed horizon limits) signal domains where novel perspectives should be prioritized (exploration). In parallel, when **`/recollect`** has been invoked this session, the recalled context surfaces prior framework or perspective preferences, biasing the Phase 2 framework candidate set toward lenses the user has already found productive in this line of work. This is a heuristic input that may bias detection toward previously observed patterns; constitutive judgment remains with the user.

**Revision threshold**: When accumulated Emergent trigger detections across 3+ sessions cluster around a recognizable pattern outside the named types {Contradiction, Horizon Intersection, Uncorroborated High-Stakes}, the Trigger Detection Criteria warrants promotion to a new named trigger type. When accumulated false positive triggers across 3+ sessions cluster around a specific named type, that type's detection heuristic warrants revision or demotion to Emergent.

Constitution presentation yields turn for user response.

Each perspective is an **individual option**. Do not pre-combine perspectives into composite options (e.g., "All three", "1+2 only"). The user selects one or more perspectives directly.

```
question: "Which lens(es) for this inquiry?"
multiSelect: true
options:
  - label: "[Perspective A]"
    description: "[distinctive analytical contribution - 1 line]"
  - label: "[Perspective B]"
    description: "[distinctive analytical contribution - 1 line]"
  - label: "[Perspective C]"
    description: "[distinctive analytical contribution - 1 line]"
```

**Perspective selection criteria**:
- Each offers a **distinct epistemic framework** (not variations of same view)
- **Productive tension**: Perspectives should enable meaningful disagreement—differing in interpretation, weighing, or application, even if sharing some evidence
- **Commensurability minimum**: At least one shared referent, standard, or vocabulary must exist between perspectives to enable Phase 5 synthesis
- **Deliverable-aligned**: Perspectives should produce assessments relevant to MBᵥ.expected_deliverable
- **Critical viewpoint** (when applicable): Include when genuine alternatives exist; omit when perspectives legitimately converge
- Specific enough to guide analysis (not "general expert")
- Named by **discipline or framework**, not persona

Optional dimension naming (apply when initial generation seems redundant):
- Identify epistemic axes relevant to this inquiry
- Dimensions remain revisable during perspective generation

During perspective formulation, note whether each candidate lens depends on evidence from code/workspace, canonical external sources, instrumentation, or user-tacit context. This is only a channel-level need signal for later authorization; it does not select or name a concrete provider.

**Pre-suggested perspective handling**: When the user supplies perspectives in U (e.g., naming specific agents, frameworks, or roles), treat these as **pre-confirmed base perspectives** (Pᵦ):

- Pᵦ are **auto-included** in Pₛ — do not re-present them as selectable options
- Constitution interaction presents only AI-proposed novel perspectives ({P₁...Pₙ} where Pᵢ ∉ Pᵦ)
- State Pᵦ in the question text as context (e.g., "Base: [Pᵦ names]. Which additional lens(es)?")
- AI must propose at least 1 novel perspective when Pᵦ ≠ ∅ — re-presenting known perspectives as options saturates the finite option space and structurally conceals unknown unknowns

**Mode 1 termination**: When Recommend was selected in Phase 0, Phase 2 is the terminal phase. After Pₛ selection:

1. Output selected perspectives with brief characterization per LOOP `characterize`
2. Note escalation path: "For deeper isolated analysis, re-invoke `/frame` — Pₛ will transfer as Pᵦ"

Per LOOP Pₛ count tiers for escalation recommendation.

### Phase 3: Deliberation Design (Topology Elicitation)

**Mode-gated**: Phase 3 runs only when Mode 2 (Inquire) was selected. Mode 1 (Recommend) skips this phase entirely — its framed object is the lens alone (DT = ∅), so the Mode 1 terminus in Phase 2 is unchanged.

Lens selection established *which* perspectives. Deliberation Design establishes *how* those perspectives relate and are reconciled — the **deliberation topology**. This is the reconciliation structure, not evidence acquisition: how lens-conditioned assessments combine (independently aggregated, debated, adversarially refuted, or independent-then-dialogue). The evidence each lens needs is acquired in-protocol by each teammate in Phase 4; acquisition strategy is an advisory handoff to Aitesis (`/inquire`) — the prothesis→aitesis edge is advisory, not a hard dependency — rather than designed here.

The topology is a small **compositional algebra**: a finite set of working axes, each with a finite set of generator values (`Gen`), composable via two operators (⨾ sequential, ∥ parallel). It is not an open or cycle-emergent space — the seed axes are fixed (interaction-mode, termination, independence, routing) and every reachable topology has a defined reconciliation behavior via a total dispatch. The whole-topology default `DT_default` assembles each axis's generator default; its dispatch reproduces today's exact Phase 4-5 pipeline (independent inquiry, then bounded peer dialogue only when reconciliation triggers fire).

**Extension fast-path (backward-compatible interaction sequence)**: On entering Phase 3, first present `DT_default` and its basis as pre-gate relay text, then proceed unless the user redirects (mirroring the Phase 0 `MB_from_arg` Extension precedent). A user who wants the default incurs **zero new turn-yields** — the immediate-sufficiency path opens no gate. "Backward-compatible" is therefore true for the interaction sequence, not only the reconciliation output. The dimension gate (Constitution) opens only when the user engages topology refinement. This aligns Phase 3 with the project Extension-default profile.

**Elicitation cycle** (important-first, compositional): When the user engages refinement, each cycle surfaces the single most decision-relevant **unsurfaced** seed axis (top-priority first: interaction-mode, then termination, then independence and routing) through one dimension gate. Each seed axis has a defined downstream effect — no orphan axes:
- **independence** wires Phase 4 inquiry execution (`isolated` enforces strict isolation per Rule 3 privileged default; `shared` relaxes it, declaring partial-Lens degradation),
- **interaction-mode** and **termination** wire Phase 5 reconciliation (the Δ/D?/Dᵣ behavior, via the homomorphic dispatch),
- **routing** wires Phase 5 presentation (`return_list` synthesizes and presents with the standard routing gate; `deepen_on_finding` *conditions* that gate — on a surviving high-severity finding it surfaces an advisory deepen/aitesis-handoff as pre-gate text and recommends the existing `extend → deepen existing` option, adding no new gate constructor (Gate integrity, Rule 13); the prothesis→aitesis edge is advisory and downstream, so this is an advisory handoff, not a hard dependency).

**Pre-gate context, gate question** (Context-Question Separation, Rule 8): present the analysis — each axis's default, its basis (why it is the sensible starting point for this mission), and each value's epistemic trade-off — as text *before* the gate. The gate carries only the question and per-option differential implications.

The dimension gate presents, for the surfaced axis, the generator values **enumerated with their differential implications** (e.g., `dialectical_debate` surfaces tensions earlier but costs cross-talk and needs persistent peers; `independent_aggregate` is cheaper and parallelizable but skips reconciliation), including **relevant pre-composed composites** as recognizable options (e.g., `independent_aggregate ⨾ adversarial_refute`) so the user recognizes composites rather than recalling how to build them. A one-line ⨾/∥ affordance signals that further composition is available. The user's move is one of:
- **Select(value)** — adopt a generator value for the axis; auto-advance (relay) to the next unsurfaced axis
- **Fuse(compose via op)** — combine values via ⨾ or ∥ into a composite topology; auto-advance to the next unsurfaced axis
- **Reorient(axis)** — reframe or replace the surfaced axis itself; the replaced axis is removed from the surfaced set and the topology, and the reoriented axis re-surfaces (no auto-advance)
- **Sufficient** — declare the topology mission-sufficient; converge elicitation. This is a **move within the dimension gate**, not a separate satisfaction gate.

**Termination (honest bound)**: the loop is bounded by the user's agency — their **Sufficient** move or Esc-Stop terminates it. If instead the user surfaces every seed axis without declaring Sufficient, the finite axis set is exhausted — the last surfacing converges by implicit **Sufficient** (relay), since auto-advance then has no next axis. The seed axis set is finite, so each unsurfaced seed axis auto-resolves to its generator default; the bound rests on user agency (if the strategy diverges the user stops), not on a claim that a residual default closes an open or unbounded axis set. There is no separate per-cycle satisfaction gate — Sufficient is one of the dimension-gate moves, which removes the prior redundant gate and its meta-action "next dimension" peer branch.

**Convergence**: When the user declares Sufficient (or accepts the Extension fast-path), resolve any unsurfaced seed axes to their generator default, assemble the `ResolvedStrategy` (DT), and present the **topology trace** (each resolved seed axis → the move that set it → its value; unsurfaced axes marked as default-resolved) as relay text before proceeding to Phase 4. The resolved DT parameterizes Phase 4-5 per Rule 7, and its substrate feasibility is surfaced per Rule 17.

**Borrowed patterns**: `Fuse`/`Reorient` reuse the Periagoge move vocabulary as borrowed *patterns* with locally-defined semantics here (Pattern over Tool) — the composition algebra and dispatch are defined locally in this protocol, not inherited.

### Phase 4: Inquiry (Through Selected Lens)

**Plan mode**: When active, Phase 4 uses available subagents (Plan, Explore) for per-perspective analysis with isolation preserved. Plan mode can run Phase 3 elicitation but cannot host a non-aggregate topology (no persistent addressable peers): if the user elicited `dialectical_debate` or any peer-negotiation topology, declare topology-degradation (Rule 3 / Rule 17) and realize the closest aggregate behavior. Phase 5 produces a partial Lens via internal operations: Δ(R') trigger detection and Syn(R', ∅) synthesis. See `references/conceptual-foundations.md` for quality trade-off.

**Agent-Perspective Mapping** (before team spawn)

For each selected perspective in Pₛ, check whether available agents match the perspective's analytical focus:

- **0 matches**: Proceed with AI-generated teammate (default behavior — no agent mapping step)
- **1 match**: Extension — auto-assign the agent to the perspective (entropy→0, single viable option)
- **2+ matches**: Constitution — present agent-perspective mapping for user confirmation. Each option must be genuinely viable under different value weightings (option-set relay test, Extension classification). If all options collapse to one dominant choice, present as Extension instead

Agent matching is heuristic: compare perspective focus description against agent `description` and `when to use` fields. Matching does not affect perspective selection (theoria) — it only determines execution assignment (praxis). "Placement over Prescription" invariant: /frame places perspectives; agent mapping realizes execution.

**Operational cost**: Independent context collection multiplies tool calls by |Pₛ| compared to shared-context distribution. This is the cost of epistemic independence — each perspective's unique evidence discovery justifies the amplification. Each perspective formulates any external research need through its own lens, so evidence differs by framework instead of collapsing into a shared fact list; that differentiated grounding raises cross-dialogue quality. For Tier 2 (|Pₛ| ≥ 4): direct each perspective's initial investigation toward MBᵥ-relevant subdomain — full-codebase sweep per perspective is unnecessary when scope_constraint narrows the evidence space. The coordinator's spawn prompt Orientation field directs each perspective's initial investigation target.

**Team Setup**

Create an agent team and spawn perspective teammates:

1. Call TeamCreate to create a team (e.g., `prothesis-inquiry`)
2. For each selected perspective, call Task with `team_name` and `name` to spawn a teammate (agent-mapped or AI-generated)

Teammates do not inherit the lead's conversation history. Each spawn prompt includes the Mission Brief, the perspective assignment, and any user- or orchestrator-supplied tool authorizations — teammates independently collect evidence through their own lens using available tools that serve the lens. Phase 1 context (G) is NOT passed to teammates: G serves meta-level perspective identification; each teammate's independent object-level investigation produces perspective-specific evidence that G's broad sweep would filter out.

Each teammate receives the perspective prompt template:

```
You are a **[Perspective] Expert**.

**Mission Brief**:
- Intent: {MBᵥ.inquiry_intent}
- Deliverable: {MBᵥ.expected_deliverable}
- Scope: {MBᵥ.scope_constraint} — constrain your analysis to this boundary
- Tool authorizations: {user/orchestrator-supplied tool authorizations, or "None supplied"}

Analyze from this epistemic standpoint:

**Your Task**: Independently investigate through your lens. Use any available tools, including utility skills, that serve your lens and respect the supplied authorizations. If your lens depends on external evidence, formulate the research need from that perspective rather than reusing a generic fact-finding query; differentiated evidence raises the quality of later cross-dialogue.
**Orientation** (from Mission Brief): {MBᵥ-derived key terms, relevant directories, or domain anchors — minimal orientation without full Phase 1 context}
**Question**: {original question verbatim}

Provide:
1. **Epistemic Contribution**: What this lens uniquely reveals (2-3 sentences)
2. **Framework Analysis**: Domain-specific concepts, terminology, reasoning
3. **Horizon Limits**: What this perspective cannot see or undervalues
4. **Assessment**: Direct answer from this viewpoint, aligned with the expected deliverable

**Output grounding**: Every table cell, list item, and comparison point must contain
substantive content — real data, file paths, specific scenarios, or quantified evidence.
Self-check: if a cell could be replaced by "TBD" without changing meaning, it lacks substance.
Exception: when the inquiry explicitly requires abstract/general patterns, prioritize breadth
over specificity.

Cross-dialogue: The coordinator may signal a tension topic and connect you
with another perspective for direct exchange (≤3 messages per pair).
The coordinator will provide the exact peer agent name — use it as-is for
the SendMessage `to` field. Do not infer or abbreviate agent names.
Exchange directly — present your position, engage with the other's reasoning.
The coordinator will provide the structured report format at dialogue time.
If divergence remains, the coordinator may ask one follow-up question —
respond with specific evidence or impact analysis.
Do not initiate cross-dialogue unprompted.
```

Multiple selections → parallel teammates (never sequential).

**TaskCreate per perspective** (mandatory): After spawning each perspective teammate, the coordinator MUST call TaskCreate for that perspective — one task per perspective. This enables progress tracking via TaskList/TaskUpdate during inquiry, and ensures team coordination is observable rather than implicit. The task subject should identify the perspective; the description should include the inquiry question and scope.

**Inquiry**

Teammates analyze independently. Coordinator awaits completion signals per Rule 14 wait discipline (passive wait, no polling, no status observation).

**Collection and Preview**

Collect inquiry results into R'. Team remains active — shutdown/retain decisions are deferred to the LOOP section after Phase 5 routing, where the user's sufficiency judgment determines team lifecycle.

**Preview P(R')**: After collecting R', output a per-perspective summary as text before proceeding to Phase 5. This is the user's first visibility into isolated inquiry results — enabling evaluation of subsequent synthesis fidelity.

```
## Perspective Reports

### [Perspective A]: [Epistemic Contribution title]
[2-3 sentence summary of key findings + assessment]
**Horizon Limits**: [What this lens missed]

### [Perspective B]: [Epistemic Contribution title]
[2-3 sentence summary of key findings + assessment]
**Horizon Limits**: [What this lens missed]
```

This is informational text output — not a Constitution interaction. The coordinator summarizes each perspective's output (not verbatim teammate content) to control rendering length while preserving epistemic contribution visibility.

#### Isolated Context Requirement

Each perspective MUST be analyzed in isolated teammate context. See `references/isolation-rationale.md` for the full rationale (cross-perspective contamination prevention, structural necessity, and isolation trade-offs).

### Phase 5: Reconciliation, Synthesis & Routing

After collecting all perspective results (R'), the coordinator reconciles and synthesizes findings. **The reconciliation behavior below is parameterized by the deliberation topology (DT) resolved in Phase 3** (Rule 7). The steps that follow describe the default `independent_first_then_dialogue` topology — for which the reconciliation **output** is unchanged from the prior version. The morphism contract itself changed (SELECT→DESIGN, framed object now ⟨Lens, DT⟩), which is the major version bump (6.0.0); only the default-topology output is preserved, not the contract. Non-default topologies adjust the reconciliation step: `independent_aggregate` skips cross-dialogue entirely (Δₛ ≡ ∅, synthesize directly over the aggregate); `dialectical_debate` runs peer negotiation unconditionally rather than only on detected triggers; `X ⨾ adversarial_refute` runs an adversarial pass over the aggregate after stage X, terminating until-dry (no new surviving refutation, ≥ K=1 empty pass) plus a hard ceiling. Synthesis and routing (steps 6-7) are topology-independent.

**Cross-Dialogue (Peer Negotiation)** — default topology

The coordinator explicitly checks R' for cross-dialogue triggers (per TYPES `Δ` and Trigger Detection Criteria) before proceeding to synthesis. For each detected trigger, cite evidence per Trigger Detection Criteria.

**If triggers detected**: Coordinator initiates peer negotiation with structured reporting:

1. **Topic signal**: Coordinator identifies the tension topic and sends it to each involved peer via SendMessage, including (a) the exact peer agent name, (b) a trigger-appropriate external label, and (c) the structured report format (4-field: Final position, Agreement points, Remaining divergence, Rationale). Report format is introduced at dialogue time, not at spawn — Phase 4 isolation preservation. The coordinator MUST use the peer's exact `name` from `Λ.team.members` for the SendMessage `to` field — do not paraphrase or abbreviate agent names.

   **External labels** (internal Δₛ trigger types are coordinator-only; peers receive neutral task framing):
   - Contradiction: "You reached materially different conclusions on [topic Z]. Exchange reasons and report agreement/divergence."
   - Uncorroborated high-stakes: "A consequential claim on [topic Z] needs independent validation. Assess support, uncertainty, and failure impact."
   - Horizon intersection: "Topic [topic Z] warrants additional scrutiny. State your current position, key uncertainty, and one question for the peer."
2. **Peer exchange**: Peers communicate directly (≤3 exchanges per pair; e.g., A→B, B→A, A→B). Each peer presents their position, responds to the other's reasoning, and works toward common ground. Peers may stop early if agreement is reached. The coordinator does not relay or frame — peers engage with each other's actual arguments.
3. **Structured report**: Each peer submits a 4-field report to the coordinator:
   - **Final position**: Peer's concluded stance after exchange
   - **Agreement points**: What the peers agreed on
   - **Remaining divergence**: Specific unresolved disagreements (empty if fully agreed)
   - **Rationale**: Why this position is held
4. **Conditional hub-spoke**: If any peer's `remaining_divergence` is non-empty, coordinator initiates hub-spoke reconciliation — one targeted question per divergent peer (e.g., "Peer B argues [X]. Explain the concrete impact of your position on [specific aspect]."). Each peer responds once. Coordinator does not re-engage after receiving responses — synthesis is independent. If `remaining_divergence` is empty for all peers, skip to step 5.
5. **Cross-dialogue outcomes** (text output, Dᵣ surfacing): After receiving all structured reports (and hub-spoke responses if applicable), output a summary of dialogue outcomes as text:

   ```
   ## Cross-Dialogue Outcomes

   ### Tension: [Topic Z]
   **Peers**: [Perspective A] vs [Perspective B]
   **Resolution**: [Agreed / Partial agreement / Persistent divergence]
   **Agreement Strength**: [strong / moderate / weak — coordinator assessment with one-line basis from Dᵣ]
   - Agreement: [key agreement points]
   - Divergence: [remaining unresolved points, if any]
   ```

   This is informational text — not a Constitution interaction. Skip this step if Δₛ = ∅ (no triggers detected).
6. **Synthesis**: Coordinator independently integrates all results — peer exchange outcomes, structured reports, and hub-spoke responses (if any) — into a unified assessment. The coordinator exercises synthesis constitution as Synthesizer: horizons fusion from peer inputs, not new analysis. Information collection from peers; the integration (Horizontverschmelzung — the fusion of distinct interpretive horizons into a single situated assessment) is the coordinator's own.
7. **User review**: Output the full synthesis as text (O(L)), then **present** routing options via Cognitive Partnership Move (Constitution). The user reads the complete synthesis with scrollback, then selects next action.

   **Step 1** — Text output O(L) (full synthesis, per Synthesis template below):
   Output the Framed Analysis as markdown text. No truncation risk — text output supports full rendering with scrollback.

   **Step 2** — Constitution interaction (routing only):

   ```
   question: "How would you like to proceed?"
   options:
     - label: "Extend"
       description: "[specific proposal grounded in L: which perspective to add or deepen, with rationale from Lens findings]"
     - label: "Add input"
       description: "[specific context gap identified from L that would change synthesis]"
     - label: "Wrap up"
       description: "[what the current Lens enables as concrete next steps]"
     - label: "Withdraw"
       description: "Exit with current Lens (team cleanup, no findings preservation)"
   ```

**Routing concreteness**: Each routing option must be grounded in the specific Lens output. Generic descriptions without session-specific rationale fail the concreteness requirement (analogical application of Full Taxonomy Confirmation) — the AI has analyzed the Lens but presents generic action labels instead of concrete proposals. Exception: "Withdraw" retains its fixed description (no session-specific content needed for exit).

**If no triggers**: Proceed to synthesis (step 6) with brief justification (e.g., "No contradictions, horizon intersections, or uncorroborated high-stakes findings detected"), then user review (step 7).

Cross-dialogue precedes synthesis so the coordinator evaluates all perspectives before integration. Trigger detection is an explicit checkpoint — not incidental discovery during synthesis.

**Synthesis (Horizon Integration)**

After cross-dialogue (R', Dᵣ), or directly from R' if no triggers (Dᵣ = ∅):

```markdown
## Framed Analysis

### Bottom-line
[The single decision-relevant takeaway in 1-2 sentences, surfaced first — the decisive answer, not the full reasoning]

### Integrated Assessment
[The full synthesized answer with attribution to contributing perspectives — the Bottom-line expanded with its supporting reasoning and detail]
[Distinguish findings from isolated inquiry (R') vs. cross-dialogue refinement (Dᵣ)]

### Convergence (Shared Horizon)
[Where perspectives agree—indicates robust finding]
[Per convergence point: coordinator-assessed agreement strength (strong/moderate/weak) with basis from Dᵣ; when Dᵣ = ∅, label as "independent convergence" — strength not assessable without cross-dialogue]

### Divergence (Horizon Conflicts)
[Where they disagree—different values, evidence standards, or scope]
[Cross-dialogue resolution status per tension topic, if applicable]
[If perspectives unexpectedly converged, note why distinct framing was nonetheless valuable]

### Synthesis Basis
[Per assessment claim: source perspective(s), evidence type (R' finding / Dᵣ agreement / Dᵣ divergence / synthesis constitution; omit Dᵣ types when Dᵣ = ∅), and whether claim combines multiple sources]
[Claims based on synthesis constitution (coordinator's horizons fusion beyond direct perspective output) explicitly marked as such]
```

Note: Perspective Summaries are surfaced earlier via P(R') preview (Phase 4 Collection). The synthesis template focuses on integration — convergence, divergence resolution, and assessment — rather than repeating individual perspective findings.

**Loop behavior**: Per LOOP. Key operational details:
- **Wrap up**: PF presents L categories (convergence, divergence, assessment highlights) via multiSelect Constitution interaction; selected items migrate to session TaskCreate after TeamDelete. When presenting convergence evidence, annotate each perspective's contribution with which Lens section(s) (∩, D, A) the perspective influenced, whether unique findings survived synthesis, and each perspective's horizon limits that remained unaddressed. Coverage gaps (union of unaddressed horizon limits across all perspectives) are recorded alongside survival signals — enabling cross-session enrichment that balances exploitation (proven perspectives) with exploration (perspectives addressing prior blind spots).

All other routing options (Extend, Add input, withdraw) and convergence behavior Per LOOP.

Consult `references/conceptual-foundations.md` for trigger/skip heuristics, Parametric Nature, and Specialization.

## Trigger Detection Criteria

Heuristic criteria for Phase 5 trigger detection (Δ). Coordinator cites evidence per detected trigger in Cross-Dialogue Outcomes.

| Trigger | Heuristic | Evidence Required |
|---------|-----------|-------------------|
| **Contradiction** | R'[pᵢ].assessment ≠ R'[pⱼ].assessment on shared referent | Which perspectives, which claims, on what topic |
| **Horizon Intersection** | R'[pᵢ].horizon_limits ∩ R'[pⱼ].epistemic_contribution ≠ ∅ | Which horizon limit overlaps which contribution |
| **Uncorroborated High-Stakes** | ∃ claim ∈ R'[p] : stakes(claim) = high ∧ ¬∃ q≠p confirming claim | The claim, the perspective, why high-stakes |
| **Emergent** | Coherence tension outside named trigger types (e.g., non-overlapping coverage masking disagreement) | The tension, involved perspectives, why named triggers do not capture it |

## Rules

1. **Mission Brief confirmation**: Always present Mission Brief for confirmation via Cognitive Partnership Move (Constitution) before context gathering (Phase 0 → Phase 1 Constitution interaction). Pre-filled text (`/frame "text"`) still requires confirmation.
2. **Recognition over Recall**: Present structured options via Cognitive Partnership Move (Constitution) — structured content reaches the user with response opportunity — Constitution interaction requires turn yield before proceeding
3. **Epistemic Integrity (independence-before-contamination)**: The privileged DEFAULT topology preserves perspective independence: when the resolved DeliberationTopology's independence axis is `isolated` (the DT_default), each perspective forms its assessment without seeing the others until the reconciliation stage; `shared` relaxes this and MUST declare partial-Lens degradation. The invariant is independence-before-contamination, not any specific substrate — an agent team is one substrate realization (see TOOL GROUNDING), so the invariant wording does not bind to it. Main-agent direct analysis substituting for an isolated perspective = protocol violation. When the chosen substrate cannot preserve independence for a perspective, or cannot realize the elicited DT (e.g. plan-mode cannot host dialectical_debate per Rule 17), declare partial-Lens / topology degradation rather than silently binding an infeasible substrate. Mode 1 (recommend) is exempt — no execution (Pₛ selection only). Topology behavior per Rule 7
4. **Synthesis Constraint**: Integration derives only from what perspectives provided; no new analysis. Synthesis constitution (horizons fusion) is integration, not analysis — explicitly marked in Synthesis Basis for verification
5. **Verbatim Transmission**: Pass original question unchanged to each perspective
6. **Sufficiency check**: After synthesis, output full Lens L as text O(L), then present routing options via Cognitive Partnership Move (Constitution) to confirm or extend analysis
7. **Elicited deliberation topology parameterizes reconciliation (via total dispatch)**: The DeliberationTopology resolved in Phase 3 (Deliberation Design) parameterizes Phase 4-5 behavior through the total homomorphic `dispatch` (lifted over the 4-axis topology by `dispatch_DT`) — every reachable ResolvedValue (generator or composite) has a defined behavior. Per-axis wiring: **independence** → Phase 4 (`isolated` strict isolation default; `shared` declares degradation per Rule 3); **interaction-mode + termination** → Phase 5 reconciliation; **routing** → Phase 5 presentation (`return_list` synthesize+present with the standard J gate; `deepen_on_finding` CONDITIONS that gate — recommends the existing `extend → deepen existing` option + advisory aitesis handoff on a surviving high-severity finding, adding no J constructor per Rule 13). Generator dispatch: `dispatch(independent_first_then_dialogue)` (DEFAULT) → conditional peer-to-peer negotiation (≤3 exchanges/pair) → structured report → conditional hub-spoke (Synthesizer) → user review via Cognitive Partnership Move (Constitution) — reproducing today's exact behavior; `dispatch(independent_aggregate)` → skip dialogue (Δₛ ≡ ∅, Syn over the static aggregate); `dispatch(dialectical_debate)` → unconditional peer negotiation (debate regardless of Δₛ); termination generators bound it (`bounded_rounds` ≤3/pair conditional; `single_pass`; `until_dry_ceiling`). Composite dispatch: `dispatch(A ⨾ B)` runs dispatch(A) then dispatch(B) over A's aggregate output; `dispatch(A ∥ B)` runs both in parallel and the two reconciliation tracks are fused by the existing Synthesis (Syn IS the join — no new merge operator), valid only when both branches are Syn-composable (else topology degradation per Rule 17) — e.g. `X ⨾ adversarial_refute` = stage X, then an adversarial pass over the aggregate, terminating until-dry (≥ K=1 empty pass) plus a hard ceiling. The operator set is extensible (each new op carries its own dispatch rule). Each non-default value carries a stated epistemic trade-off, surfaced at the Phase 3 design gate per Rule 8.
8. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via Cognitive Partnership Move (Constitution). The question contains only the essential question; options contain only option-specific differential implications. Embedding context in question fields = protocol violation. Scope includes the **Phase 3 dimension gate**: each axis's default, basis, and per-value epistemic trade-offs are pre-gate text; the gate carries only the question and per-option (per-generator and per-composite) differential implications.
9. **Convergence evidence**: Present transformation trace before declaring wrap_up (Mode 2) or recommend terminus (Mode 1); per-perspective contribution is the required evidence
10. **Zero-result surfacing**: If Phase 2 generation yields no candidate frameworks, present the finding with reasoning for user confirmation
11. **Concrete routing**: Phase 5 routing options must include session-specific rationale derived from L. Generic labels without Lens-grounded content = protocol violation (analogical application of Full Taxonomy Confirmation — session-grounded concreteness over generic labels)
12. **Option-set relay test (Extension classification)**: If AI analysis converges to a single dominant option (option-level entropy→0 — Extension mode of the Cognitive Partnership Move), present the finding directly. Each Constitution option must be genuinely viable under different user value weightings. Options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options
13. **Gate integrity**: The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation
14. **Wait discipline**: During Phase 4 Await, the coordinator MUST NOT (a) re-prompt teammates regardless of interval duration — any re-prompt risks interrupting teammate mid-composition and inducing content revision rather than resolving apparent silence; (b) observe teammate state passively (TaskList reads, agent memory inspection, filesystem reads under team directories) as a basis for behavioral decisions before the completion signal arrives — passive observation defeats passive-wait semantics and becomes a post-hoc rationalization path disguised as "task tracking, not polling"; (c) proceed with partial R — Await converges only when all teammates in T have signaled completion, and partial collection without `user_esc` violates convergence persistence. Scope: Phase 4 inquiry wait only; Phase 5 hub-spoke step 4 content-bearing follow-ups are sent after peers have idled and are out of scope. Platform-specific delivery mechanics are documented in TOOL GROUNDING (Await entry); epistemic prose depends only on the existence of a completion signal, not on its platform form. Recovery from indefinite wait is user-initiated via `user_esc` per LOOP; any of (a)/(b)/(c) = protocol violation
15. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
16. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
17. **Utility-agnostic tool authorization + topology→substrate feasibility**: The protocol core detects evidence-channel need at the perspective level; concrete tool or utility binding is supplied only by explicit user instruction or an orchestrating utility skill and passed through to teammates without provider names originating in the core. Persistent teammates keep Phase 5 cross-dialogue available because they stay addressable for peer negotiation; delegating execution to stateless one-shot workers (e.g. ephemeral research sessions) trades that away — such workers complete and exit, so when synthesis needs peer dialogue or contradiction resolution, route those perspectives through persistent teammates that remain reachable through Phase 5. Topology→substrate feasibility coupling: `dialectical_debate` (and any topology requiring peer negotiation) REQUIRES persistent addressable peers — peer negotiation needs reachable teammates. `independent_aggregate` and `X ⨾ adversarial_refute` over a static aggregate do NOT require persistent peers (no cross-talk) and are realizable by stateless pipeline workers (parallel inquiry → single adversary pass), e.g. a dynamic-workflow pipeline. Surface substrate feasibility per resolved topology value as a delegated handoff annotation (the same pattern as the SubagentStop counter-example in Known Limitations). When the active substrate cannot realize the elicited DT — notably plan mode, which can run elicitation but cannot host a non-aggregate topology (no persistent addressable peers for `dialectical_debate`) — declare topology-degradation (tie to Rule 3 partial-Lens) rather than silently downgrading the topology. This is a non-epistemic substrate handoff: the protocol surfaces feasibility and degradation; the substrate enforces realizability.

## Adversarial Guards

- **role-drift**: team members gradually drift toward lowest-common-denominator stances; fires when 2+ members' Phase 2 outputs converge on identical framing across 3+ iterations. Guard: surface divergence-collapse as an epistemic signal, not efficiency.
- **constitution-reduction-delay**: Phase 4 Constitution-interaction reduction proposals delayed past their warranted trigger, leaving the team in high-friction Constitution mode longer than needed. Guard: when reduction criteria met, propose explicitly rather than continuing status quo.
- **fixture-early-detection**: perspective fixture (shared unexamined assumption) detected via unanimous agreement on a contested claim in first 2 rounds. Guard: surface the fixture and request a dissenting frame.

## Known Limitations

**Subagent emit scope**: Rule 15 (Plain emit discipline) applies to coordinator-assembled user-facing emit (convergence trace, gate options). Subagent-to-coordinator intermediate reports operate in the contributor/formal layer and are not subject to Rule 15.

**SubagentStop signal semantics**: The Await completion signal (IdleNotification) is realized on top of the platform's SubagentStop event. Whether SubagentStop fires on all teammate exits (including crashes, errors, and silent failures) is platform-specific and not guaranteed by the protocol definition. If SubagentStop is unary (fires on all exits), a crashed teammate produces an IdleNotification with empty output — the coordinator observes failure indirectly via the Preview P(R') step. If SubagentStop does not fire on abnormal termination, a crashed teammate produces no signal, and Await must rely on `user_esc` recovery per LOOP.

**Teammate crash vs. composition indistinguishability**: The protocol defines no direct failure signal for teammates. A teammate still mid-composition and a teammate that has crashed are indistinguishable at the protocol layer until a completion signal (or `user_esc`) arrives. The coordinator cannot distinguish these states without violating Rule 14's passive-wait discipline. User experience of the wait is the primary failure-detection surface.

**TaskUpdate vs. IdleNotification release ordering**: Teammates use TaskUpdate to mark task status (observability track); IdleNotification is the Await-release signal (completion track). In the typical path, a teammate's final SendMessage and TaskUpdate precede its SubagentStop, so IdleNotification dominates TaskUpdate in release ordering. Abnormal paths (crash before TaskUpdate; idle without task completion) are not strictly ordered by the protocol and surface as empty or partial output at Preview P(R').
