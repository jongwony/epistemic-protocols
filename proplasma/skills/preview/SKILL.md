---
name: preview
description: "Divergent-discard instantiation before direction commitment. When direction candidates cannot be recognized from descriptions alone, materialize 2-4 placeholder probes that diverge on user-settled axes, present the per-axis contrast, and constitute the direction decision on recognition rather than simulation — probes are discarded, never evidence. Type: (DirectionUnrecognizable, Hybrid, PREVIEW, DirectionProspect) → DirectionalContrast. Alias: Proplasma(πρόπλασμα)."
---

# Proplasma Protocol

Expose direction unknowns through divergent-discard instantiation before commitment. Type: `(DirectionUnrecognizable, Hybrid, PREVIEW, DirectionProspect) → DirectionalContrast`.

## Definition

**Proplasma** (πρόπλασμα): the preliminary clay model a sculptor shapes before committing to marble. A dialogical act for the moment right before a direction commitment when the candidate directions cannot be recognized from their descriptions: the AI derives the axes on which the candidates genuinely diverge, the user settles those axes and the placeholder policy at a spec gate, the AI instantiates two to four cheap placeholder probes that commit different values on the settled axes, presents them probe-first with a per-axis contrast, and the user constitutes the direction decision on recognized futures. Probes are discard-committed instruments — never evidence, never promoted.

```
── FLOW ──
Proplasma(X) → detect(X, route) →
  [¬pre_commit(X) ∨ |direction_candidates(X)| < 2] requires_fail_relay → exit (checkpoint failed: state which
    requirement; fewer than two candidates (one or none) is row ③ territory — /frame · /elicit generate the missing alternatives; not activated)
  [futures recognizable from text] no_deficit_relay → exit (regular gate suffices; not activated)
  [route ∈ {①, ②, ③}] route_away_relay(matched row) → exit (routed; not activated)
  [a type guard fails (¬fake_data_sufficient ∨ ¬placeholder_fidelity) ∧ no routing row matches] unfit_relay → exit
    (the deficit may be real but Proplasma cannot legitimately serve it: state the failed guard; the decision stays at a regular gate; not activated)
  derive_axes(X) → Axs → draft_policy → Qspec(Axs, policy, Tgt, tier) → S →
  [S = Adjust(revision)] revise → Qspec (re-present; still pre-generation)
  [at any Qspec circulation, either party: sharpened description makes the futures recognizable ∨ activation premise collapses]
    dissolution: [Λ.probes ≠ ∅ (refan re-entry) → cleanup_verify first] → dissolution_relay → exit (DissolutionExit: deficit dissolved;
      pre-generation circulation has Λ.probes = ∅ — the relay fires directly, nothing to clean;
      enriched axes handed to a regular gate; any probe already generated is discarded with its disposition declared;
      on a refan re-entry the pending re-fan target set — the user-authored composition, or the revised candidates —
      is relayed as live candidates, never silently dropped)
  [S = Approve] instantiate(∥ probes over Tgt, temp-isolated, cleanup-registered) →
  contrast(P, Axs) → (CM, EU, CC) → present(probe-first: probes → contrast map → unknowns) →
  Qdir → D →
  [D = Select(direction)] harvest → cleanup_verify → assemble → DirectionalContrast
  [D = Synthesize(composition)] Qmicro → Gs →
    [Gs = Confirm] harvest(synthesized direction) → cleanup_verify → assemble → DirectionalContrast
    [Gs = Materialize] spec_gate_if_spec_revision → refan(composition) → contrast → present → Qdir
  [contrast_insufficient ∧ refan_budget > 0] spec_gate_if_spec_revision → refan(gap) → contrast → present → Qdir
  [contrast_insufficient ∧ refan_budget = 0 ∧ refan_kind = Materialization ∧ ¬insufficiency_relayed] insufficiency_after_materialization_relay → Qdir (re-present over the accumulated probes; one-shot relay)
  [contrast_insufficient ∧ refan_budget = 0 ∧ refan_kind = Materialization ∧ insufficiency_relayed] insufficiency_standdown_relay → cleanup_verify → exit (EarlyExit via insufficiency_standdown: an unchanged gate re-presented cannot progress — the contrast harvest is relayed as context to a regular gate)
  [contrast_insufficient ∧ refan_budget = 0 ∧ refan_kind = Gap] misdiagnosis_exit → cleanup_verify → route_away(MisdiagnosisRoute)
-- Materialize is a BUDGET-GUARDED constructor: it belongs to Qmicro's option set only while refan_budget > 0. With the budget spent,
--   Qmicro's defined option set IS {Confirm} and materialize_unavailable_relay states the exhaustion with its basis — a guarded
--   constructor absent from the option set is not option deletion, and no path can re-enter Materialize (termination guaranteed)
-- interrogation is a FREE-RESPONSE pathway at Qdir, not a D constructor: it commits no downstream action on the decision axis
-- refan_budget = 1 (shared): contrast-insufficiency re-fan and synthesis materialization draw from the SAME single budget
-- spec_gate_if_spec_revision: a refan whose implication carries a spec revision — a NEW divergence axis, a realization-tier
--   escalation, or a revised probe target set — routes through Qspec BEFORE generation (breach condition 1; axes, tier,
--   and target set are spec-gate settings: none is revised past the gate)
-- dissolution is a SUCCESS stand-down (axis derivation itself sharpened the description until probes became unnecessary),
--   distinct from EarlyExit (user withdraws; residual) and MisdiagnosisExit (wrong deficit; rerouted)
-- cleanup_verify runs on EVERY protocol-controlled exit path: DirectionalContrast, EarlyExit (withdrawal),
--   MisdiagnosisExit, and a DissolutionExit reached on a refan re-entry (probes exist there); on the pre-generation
--   circulation nothing was generated, so the discard obligation is trivially declared

── MORPHISM ──
DirectionProspect
  → detect                  -- deficit predicate + 4-step routing (type guards: fake_data_sufficient, placeholder_fidelity)
  → derive_axes             -- divergence axis candidates (where the candidate directions must commit different values)
  → set_placeholder_policy  -- visible synthesis + non-evidence stamp + skeleton-faithful/data-fake split (draft)
  → gate_spec               -- Constitution spec gate: axes + policy + probe target set + realization tier settled BEFORE any generation
  → instantiate_probes      -- transform (∥ over the settled target set, temp-isolated, cleanup-registered)
  → contrast                -- per-axis juxtaposition → ContrastMap + ExposedUnknowns + CommonCommitments
  → present                 -- probe-first relay (probes one by one → contrast map → new unknowns)
  → constitute              -- direction gate: options point at probe-exposed futures (Select | Synthesize)
  → harvest                 -- direction + deciding contrast rows + routed unknowns recorded BEFORE discard (Λ.harvest)
  → cleanup_verify          -- per-probe discard verification → discard_trace
  → assemble                -- terminal record built from the harvest + the completed discard trace
  → DirectionalContrast
  -- primary-path codomain: the advertised result type is the primary path's. DissolutionExit — the convergent
  --   stand-down — emits the enriched axes with its cited basis INSTEAD of this record: the deficit dissolved,
  --   so no resolution object is owed (see CONVERGENCE)
requires: pre_commit(direction) ∧ |direction_candidates(X)| ≥ 2   -- runtime checkpoint (Phase 0)
deficit:  DirectionUnrecognizable                                  -- activation precondition (Layer 1/2)
preserves: commit_target_identity(X)   -- the pending commitment itself is unchanged; probes never mutate it
invariant: Contrast over Simulation    -- direction judgment rests on recognized materialized futures, not mental simulation

── TYPES ──
X   = DirectionProspect: a direction decision immediately before commitment (input; carries direction_candidates, |candidates| ≥ 2;
        source-agnostic: design direction, architecture fork, UX shape, plan branch — any pre-commit direction choice)
        -- Input type: morphism processes X uniformly; enumeration scopes the definition, not behavioral dispatch
DirectionAxis = a declared divergence axis — a direction unknown on which the probes must commit different values
Axs = Set(DirectionAxis) settled at the spec gate (AI derives candidates; user settles — no axis is AI-selected past the gate)
      -- extended ONLY via the inherited spec-gate duty: a refan carrying a new axis settles it at Qspec before generating
Tgt = List(direction) — the probe target set settled at the spec gate: which directions get probes on this fan
      -- contrast fan (initial, or gap refan): Tgt ⊆ X.direction_candidates with |Tgt| ∈ 2..4. When |candidates| > 4,
      --   Qspec settles WHICH candidates are probed (the cap is a presentation bound, not a silent truncation);
      --   candidates left unprobed are declared at present so none is silently dropped, and they stay reachable at the
      --   direction gate via free response: within the remaining re-fan budget, naming one triggers a gap refan over it
      --   (target-set revision through the spec gate); with the budget spent, settling an unprobed candidate happens at a
      --   regular gate — the protocol stands down as a withdrawal with the contrast harvest relayed as context (its future
      --   was never materialized, so the morphism cannot claim it)
      -- materialization refan: Tgt = [composition] — the user's own synthesis, materialized so they can see it;
      --   |Tgt| ≥ 1 here, because a materialization is a recognition step, not a contrast (the composition is
      --   contrasted against the ACCUMULATED probes, which already carry the differentiated axis values)
DetectGuards (type guards, both required for activation):
  fake_data_sufficient : the direction contrast holds with placeholder concreta alone — no real evidence required
  placeholder_fidelity : placeholder concretization carries the differential futures on the divergence axes without distortion
PlaceholderPolicy = { visible_synthesis: artifacts are overtly placeholder (never mistakable for real data),
                      non_evidence_stamp: probes are evidence for no claim (pierces harvest and session remnants),
                      skeleton_data_split: structure/skeleton is faithful to each direction; data values are fake
                        -- operating rule for placeholder_fidelity: divergence must live in the skeleton, fake data must not blur it }
RealizationTier ∈ {Vignette, Mockup}
  -- Vignette: text-vignette probes — concrete placeholder-filled scenario narration in session text; no file artifacts
  -- Mockup: real artifacts (files) in temp isolation, optionally instantiated by parallel agents
Probe = cleanup-bound instrument { direction: String, axes_realized: Map(DirectionAxis, Value),
                                   concretum: Concretum, artifact_ref: ArtifactRef, cleanup: CleanupAction }
Concretum = Narration(text)     -- Vignette tier: the instantiated narration itself, typed ON the probe — present
            --   re-presents this carrier (instantiate→present identity), never regenerates it at presentation
          | AtArtifact           -- Mockup tier: the concretum lives at artifact_ref; present walks the artifact through
ArtifactRef = None                      -- Vignette tier: session-text only, no file to destroy
            | Path(temp-isolated path)  -- Mockup tier: locatable file/dir under temp isolation; registered at creation
CleanupAction = the concrete destruction step for artifact_ref (no-op for None; file/dir removal for Path)
ContrastMap = per-axis juxtaposition: for each axis ∈ Axs, the futures each probe exposes on that axis
ExposedUnknown = a direction unknown newly exposed by the contrast (or recorded at an interrogation), tagged with its
                           DownstreamRoute at recording — the harvest inherits the tag, it does not attach it
DownstreamRoute = Gap      -- a pre-commit check. It applies once the settled direction MATERIALIZES INTO A COMMITTED
                           --   ACTION: /gap's activation predicate captures execution commitment, not direction
                           --   commitment, so the handoff is stated at that boundary, not at the direction decision
                | Inquire  -- a factual unknown needing real evidence (placeholders can never ground it)
GroundTag = optional annotation ON THE CONSTITUTED DIRECTION (not an ExposedUnknown route): when the surviving
                           --   direction maps onto a familiar domain, it is tagged at harvest for /ground
                           --   structural-mapping validation; the tag rides Harvest.direction into
                           --   DirectionalContrast.direction, so the proplasma→analogia handoff survives assembly
CommonCommitment = a design decision forced uniformly across ALL probes during instantiation (not on a divergence axis);
                   must be reported at present so the user does not mistake a shared premise for a divergence axis
S  = Spec gate answer ∈ {Approve, Adjust(revision)}       -- Adjust revises axes/policy/target set/tier and re-presents; pre-generation
       -- on a MATERIALIZATION re-entry, Adjust revises the new axis, policy, or tier only: Tgt = [composition] is fixed
       --   by the refan kind — a different target set is a different fan, which the spent budget does not cover
       --   (the user can instead Confirm the standing synthesis or withdraw at the direction gate)
D  = Direction gate answer ∈ {Select(direction), Synthesize(composition)}
       -- Select: settle one probe-exposed direction — CONSTRAINED constructor: direction ∈ directions(Λ.probes);
       --   a response naming an UNPROBED candidate is never parsed as Select — it enters the unprobed-candidate
       --   free-response pathway (probed first within budget, or stand-down), so no unmaterialized future can
       --   converge as a DirectionalContrast
       -- Synthesize: user composes/recombines the presented probes → opens micro-gate Gs
       -- INTERROGATION IS NOT A PEER OPTION: questioning a probe commits no downstream action on the decision axis
       --   (it answers or records, then returns to the same gate), so it carries no differential future and surfaces as a
       --   free-response pathway declared in the pre-gate text — design-intent questions answered within placeholder
       --   discipline, factual unknowns harvested as ExposedUnknown (route Inquire); the gate is re-presented unchanged
Gs = Synthesis micro-gate answer ∈ {Confirm} ∪ {Materialize | refan_budget > 0}
       -- Confirm: settle the synthesized direction as-is, now
       -- Materialize: re-fan the synthesis into new probes (consumes the shared re-fan budget)
       -- BUDGET-GUARDED CONSTRUCTOR: Materialize belongs to the option set only while refan_budget > 0. With the budget
       --   spent, Qmicro's defined option set IS {Confirm} and materialize_unavailable_relay states the exhaustion with
       --   its basis. The guard is part of the type, so a Materialize-free presentation is not option deletion — and no
       --   path can re-enter Materialize with a spent budget, which is what makes the synthesis loop terminate
       -- micro-gate exists because only the user can judge whether their synthesis is already recognized well enough
UserDecision = the constituted direction: Select's direction, or the synthesis settled via Confirm (either way user-constituted)
Disposition ∈ {FileDestroyed, NoFileArtifact, DiscardFailed(reason)}
  -- FileDestroyed: Path artifact removed and verified absent (satisfying condition for Mockup tier)
  -- NoFileArtifact: Vignette tier — nothing to destroy; discard = non-promotion, remnant text stays under the non-evidence stamp
  -- DiscardFailed: destruction attempted (with one retry) and still present; declared, never silent
ProbeRef = minimal identity carrier { index: ℕ (ordinal in Λ.probes — uniqueness key), direction: String, artifact_ref: ArtifactRef }
            -- what was destroyed and where it lived — axis values, probe content, and cleanup actions stay
            --   session-local (Rule 10): the trace records the discard, not what the probe contained
DiscardTrace = List<(ProbeRef, Disposition)>  -- one entry per instantiated probe (re-fanned probes included)
RefanKind ∈ {Gap, Materialization}   -- what the single shared budget was spent on; decides the still-insufficient branch
Harvest = { direction: UserDecision (⊕ optional GroundTag), deciding_rows: ContrastMap, unknowns: Set(ExposedUnknown) }
            -- recorded BEFORE discard; carries no discard_trace (the trace does not exist yet — cleanup produces it)
DirectionalContrast = single record {                          -- terminal; single-record codomain (no bare plural)
                        contrast_map:     ContrastMap,         --   restricted to the DECIDING rows at harvest (Rule 10)
                        exposed_unknowns: Set(ExposedUnknown), --   each tagged with its DownstreamRoute
                        direction:        UserDecision (⊕ optional GroundTag),
                        discard_trace:    DiscardTrace }
            -- ASSEMBLED after cleanup_verify: assemble(Harvest, DiscardTrace) → DirectionalContrast. Harvest precedes
            --   discard; the record that carries both is built once the discard trace exists (no circular ordering)
EarlyExit = user WITHDRAWAL at any gate — an explicit exit declared as a free response, a typed withdrawal the protocol
            acts on (side effects require explicit answer types, not tool-level escape): partial transformation trace
            over completed steps + cleanup_verify enforced + residual declared (direction NOT constituted)
            -- a hard esc (tool-level escape that yields the protocol no turn) is ungraceful by nature: cleanup cannot
            --   run there. Temp isolation's bounded scratch lifecycle is the backstop — part of why probes never live
            --   outside it (breach condition 2 is what makes an uncaught esc safe)
DissolutionExit = deficit dissolved during the Phase 1 circulation: deriving or settling the axes sharpened the description
            until the candidate futures became recognizable without probes, or the circulation collapsed the activation
            premise itself (the fork proves false). Declared by either party; relayed with cited basis — the sharpened
            axes ARE the evidence. The direction decision returns to a regular gate carrying the enriched axes. On the
            pre-generation circulation no probe exists (phase < 2 guard) and discard is trivially declared; on a refan
            re-entry probes already exist — cleanup_verify runs before the stand-down and their dispositions enter the
            trace, and any exposed unknowns already recorded are relayed with their DownstreamRoutes (never silently
            dropped), and the pending re-fan target set — the user-authored composition on a materialization re-entry,
            the revised candidate set on a gap re-fan — is relayed as live candidates for that gate (a user-constituted
            candidate never dies with the stand-down: it sits in Λ.tgt, not Λ.direction, so the relay must carry it).
            A success stand-down: no unresolved residual remains — recorded unknowns are relayed with their routes
            rather than lost, and the deficit itself needs no rerouting — description-sharpening resolved what
            the protocol was invoked to materialize
MisdiagnosisRoute = Row(① | ② | ③)   -- a sibling deficit matches: hand off to the cited protocol
                  | NoRow             -- NO row matches (the candidates may simply not genuinely diverge): declare the
                                      --   misdiagnosis with no downstream protocol and return the decision to a regular
                                      --   gate, residual declared. The exit is defined even when nothing downstream fits
MisdiagnosisExit = refan_budget = 0 ∧ refan_kind = Gap ∧ contrast still insufficient: deficit misdiagnosis report
            + cleanup_verify enforced + route_away(MisdiagnosisRoute); no DirectionalContrast is emitted
            -- scoped to a spent GAP refan. A budget spent on the user's own Materialization does NOT reach this exit:
            --   the user already recognized the contrast well enough to synthesize from it, so the deficit was not
            --   misdiagnosed — that branch relays back to Qdir over the accumulated probes instead
contrast_insufficient = the presented contrast does not make the candidate futures recognizable on the settled axes
            -- declared by the user (free response at the direction gate — not a D constructor) or detected at contrast
            --   (an axis with no differentiated values across probes); either way surfaced, never silently self-repaired
            -- an insufficiency rooted in realization fidelity (the tier could not carry the contrast — not a missing axis)
            --   signals a tier escalation through the spec gate, not more probes at the same tier
            -- the Materialization-exhaustion relay is ONE-SHOT (Λ.insufficiency_relayed): a repeated insufficiency at the
            --   re-presented gate stands down as EarlyExit via insufficiency_standdown — re-presenting an unchanged gate
            --   cannot progress, so the loop stays bounded; the contrast harvest is relayed as context to a regular gate

── PHASE TRANSITIONS ──
Phase 0: X → detect(X) → route?                                -- deficit predicate + 4-step routing (silent analysis)
       [¬pre_commit(X) ∨ |direction_candidates(X)| < 2] requires_fail_relay → exit  -- the MORPHISM requires-checkpoint,
                                                                 --   typed: state the failed requirement; one or zero
                                                                 --   candidates routes to row ③'s targets (/frame · /elicit)
                                                                 --   for candidate generation; not activated
       [futures recognizable from text] no_deficit_relay → exit  -- regular gate suffices; Proplasma not activated
       [route ∈ {①, ②, ③}] route_away_relay(matched row) → exit -- cite the matched routing row; not activated
       [a type guard fails ∧ no row matches] unfit_relay → exit  -- failed guard stated; decision stays at a regular
                                                                 --   gate; not activated (the flow is total: no path
                                                                 --   falls through to Phase 1 with a failed guard)
Phase 1: derive_axes(X) → Axs_candidates → draft_policy → Qspec(axes + policy + probe target set + tier) → Stop → S  -- spec gate [Tool]
       [S = Adjust(revision)] revise(Λ) → re-present Qspec       -- pre-generation loop; no probe exists yet
       [S = Approve] settle(Λ.axes, Λ.policy, Λ.tgt, Λ.tier) → Phase 2
       [at any circulation, either party: futures recognizable from the sharpened description ∨ activation premise collapsed]
         [Λ.probes ≠ ∅ (refan re-entry) → cleanup_verify first] → dissolution_relay → DissolutionExit
         -- pre-generation circulation (Λ.probes = ∅): the relay fires directly — the conditional guards only the cleanup step
         (enriched axes handed to the regular gate; any already-generated probe is discarded with its disposition declared;
          on a refan re-entry the pending re-fan target set — composition or revised candidates — is relayed as live candidates)
       -- free-response pathways at this gate, declared in the pre-gate text — none is an S constructor: a question is
       --   answered and the gate re-presented; a premise contest feeds the dissolution arm; a withdrawal runs
       --   cleanup_verify (when probes exist) and terminates as EarlyExit
       -- |X.direction_candidates| > 4: Qspec settles WHICH candidates are probed (Λ.tgt); unprobed candidates are declared at present
       -- ENTERED FROM A REFAN carrying a SPEC REVISION (Phase 3 or Phase 4) — a new divergence axis, a realization-tier
       --   escalation, or a revised probe target set: Qspec is re-presented SCOPED TO THAT REVISION before any generation —
       --   the inherited spec-gate duty, typed (axes, tier, and target set are spec-gate settings; none is revised past
       --   the gate). A refan that revises nothing in the spec skips this and enters Phase 2 directly. No probe is ever
       --   generated on an axis the user has not settled, nor at a tier the user has not settled
       --   On a materialization re-entry Adjust cannot replace Λ.tgt: the target stays [composition] (fixed by Λ.refan_kind);
       --   revising the target set into a new contrast fan is not covered by the spent budget
Phase 2: instantiate(∥ over Λ.tgt, temp-isolated, cleanup-registered) → P → Λ.probes := Λ.probes ++ P  -- transform [Tool]
       [Mockup tier, conditional] instantiate_delegate(∥ one probe per agent, temp-isolated) [Tool]
       -- contrast fan (initial | gap refan): |P| ∈ 2..4 — one probe per target direction
       -- materialization refan: |P| ≥ 1 — the composition itself; it is contrasted against Λ.probes (cumulative), which
       --   already carry the differentiated values on the PREVIOUSLY SETTLED axes, so a materialization needs no second
       --   probe of its own. A NEW axis settled on this refan predates the prior probes: contrast re-derives their
       --   positions on it analytically where their artifacts carry them, and declares the cell undifferentiated where
       --   they do not — surfaced, never fabricated (a declared-undifferentiated axis can then feed the insufficiency arms)
       -- each probe records its concretum at instantiation (Vignette: the narration text; Mockup: AtArtifact) —
       --   the typed carrier present re-presents; presentation never regenerates a probe
       -- forced common design decisions recorded → Λ.common_commitments
Phase 3: contrast(Λ.probes, Λ.axes) → (CM, EU, CC) → Λ.contrast_map := CM; Λ.exposed_unknowns ∪= EU;
         Λ.common_commitments := CC → present                       -- probe-first order: probes one by one → contrast map
         -- CC is RECOMPUTED over ALL accumulated probes at every contrast and REPLACES the set (:=, never ∪=):
         --   a re-fan can break an earlier fan's shared premise, and a stale entry silently presented as shared
         --   would corrupt the axis/premise distinction the declaration exists to protect
                                                                  --   (with CommonCommitments declared) → new unknowns [Tool]
       [contrast_insufficient ∧ Λ.refan_budget > 0] refan(gap) → Λ.refan_kind := Gap → decrement budget
         → [spec revision: new axis ∨ tier escalation ∨ revised target set] Phase 1 (Qspec scoped to the revision —
             insufficiency rooted in realization fidelity escalates the tier here, never silently; a revised target
             set is likewise user-settled before generation) | [no spec revision] Phase 2
       [contrast_insufficient ∧ Λ.refan_budget = 0 ∧ Λ.refan_kind = Materialization ∧ ¬Λ.insufficiency_relayed]
         insufficiency_after_materialization_relay → Λ.insufficiency_relayed := True → Phase 4 (re-present Qdir over Λ.probes; one-shot)
       [contrast_insufficient ∧ Λ.refan_budget = 0 ∧ Λ.refan_kind = Materialization ∧ Λ.insufficiency_relayed]
         insufficiency_standdown_relay → Phase 5 (EarlyExit arm via insufficiency_standdown — a withdrawal by consequence:
           an unchanged gate re-presented cannot progress; the contrast harvest is relayed as context to a regular gate)
       [contrast_insufficient ∧ Λ.refan_budget = 0 ∧ Λ.refan_kind = Gap] → Phase 5 (MisdiagnosisExit arm)
Phase 4: Qdir(probe-exposed futures) → Stop → D                   -- direction gate [Tool]
       -- pre-gate text declares the free-response pathways: interrogate a probe, declare the contrast insufficient, or withdraw
       [D = Select(direction) ∧ direction ∈ directions(Λ.probes)] Λ.direction := direction → Phase 5
         -- a named UNPROBED candidate never parses as Select: it enters the unprobed-candidate free response below
       [D = Synthesize(composition)] Qmicro(composition) → Stop → Gs  -- synthesis micro-gate [Tool]
         [Gs = Confirm] Λ.direction := composition → Phase 5
         [Gs = Materialize] refan(composition) → Λ.refan_kind := Materialization → Λ.tgt := [composition] → decrement budget
           → [spec revision: new axis ∨ tier escalation — a target-set revision cannot arise here: Tgt is fixed to
               [composition] by the refan kind] Phase 1 (Qspec scoped to the revision) | [no spec revision] Phase 2
         -- Λ.refan_budget = 0: Materialize is not in Qmicro's option set (budget-guarded constructor);
         --   materialize_unavailable_relay states the exhaustion and Qmicro presents {Confirm} → no path re-enters Materialize
       [free response: interrogation]                              -- not a D constructor; the gate is re-presented unchanged
         [design-intent] answer within placeholder discipline → re-present Qdir
         [factual unknown] record as ExposedUnknown (route: Inquire) → re-present Qdir
       [free response: contrast_insufficient] → Phase 3 insufficiency arms (same guards)
       [free response: unprobed candidate named (whenever ∃ c ∈ X.direction_candidates: c ∉ directions(Λ.probes) —
         judged on ACCUMULATED probe coverage, not on Λ.tgt, which a materialization overwrites)]
         [Λ.refan_budget > 0] refan(gap over the named candidate) → Λ.refan_kind := Gap → decrement budget
           → Phase 1 (Qspec scoped to the revised target set) — the named candidate is probed before it is settled
         [Λ.refan_budget = 0] stand_down_relay → unprobed_standdown → EarlyExit (a withdrawal by consequence: the choice
           moved outside the materialized set; cleanup_verify runs, the decision returns to a regular gate with the
           contrast harvest relayed as context — the morphism never claims an unmaterialized future)
Phase 5: three entry arms; cleanup_verify runs on all of them, harvest only where a direction was constituted [Tool]
       [from Phase 4 — direction constituted] harvest → cleanup_verify → assemble → DirectionalContrast  -- harvest BEFORE discard
         harvest = (direction, deciding contrast rows, inherited unknowns with DownstreamRoutes) → Λ.harvest
         assemble(Λ.harvest, Λ.discard_trace) → the terminal record -- built after the trace exists; harvest carries no trace
       [from Phase 3 misdiagnosis arm — no direction constituted; Harvest is unconstructible and is NOT attempted]
         misdiagnosis report (+ any exposed unknowns with their routes) → cleanup_verify → MisdiagnosisExit(route_away(MisdiagnosisRoute))
         [no row matches] route = NoRow → declare the misdiagnosis with no downstream protocol; the decision returns to a
           regular gate with the residual declared -- the exit is defined even when nothing downstream fits
       [user withdrawal at any gate, or a withdrawal by consequence (unprobed_standdown / insufficiency_standdown) —
         no direction constituted; Harvest is NOT attempted]
         partial transformation trace → cleanup_verify → EarlyExit (residual declared)
         -- withdrawal is an explicit free-response exit the protocol acts on; a hard esc yields no turn, so cleanup
         --   cannot run there — temp isolation's bounded scratch lifecycle is the backstop
       cleanup_verify (all arms): per probe, execute cleanup → verify absence → Disposition → Λ.discard_trace
         [DiscardFailed] retry once → still present → declare DiscardFailed(reason) in discard_trace (visible, never silent)

── LOOP ──
Probe target set 2–4 for a contrast fan (settled at the spec gate; when candidates exceed 4, the gate settles which are probed).
Re-fan bound: at most 1 re-fan per activation — contrast-insufficiency re-fan and synthesis materialization SHARE this
  single budget (no separate budgets). What the budget was spent on decides the still-insufficient branch:
  - spent on a GAP re-fan, contrast still insufficient → deficit misdiagnosis: report and hand off per the routing table
    (MisdiagnosisExit; NoRow when nothing downstream fits), never fan again.
  - spent on the user's own MATERIALIZATION, contrast still insufficient → NOT misdiagnosis: the user already recognized the
    contrast well enough to synthesize from it. Relay the exhaustion and re-present the direction gate over the accumulated
    probes — the standing synthesis is Selectable there (its probe now exists among the accumulated probes — a
    type-preserving materialization of Select) and the original directions stay Selectable. A direction the
    user has already recognized is never discarded by a budget rule. That re-presentation is ONE-SHOT: a repeated
    insufficiency at the re-presented gate stands down as EarlyExit via insufficiency_standdown (cleanup runs; the
    contrast harvest is relayed as context to a regular gate) — the loop never re-presents an unchanged gate twice.
Materialize is budget-guarded: with the budget spent it is not in the micro-gate's option set, so the synthesis loop terminates.
Interrogation, contrast-insufficiency declaration, and Adjust do not consume the re-fan budget (they generate no probes).
User can withdraw at any gate (an explicit exit, free response): EarlyExit — cleanup_verify runs; partial trace
  presented; residual declared. A hard esc (tool-level escape) gives the protocol no turn: cleanup cannot run there,
  and temp isolation's bounded scratch lifecycle is the backstop.
Continue until: DirectionalContrast (direction constituted + harvest recorded + discard declared) OR EarlyExit OR MisdiagnosisExit
  OR DissolutionExit (deficit dissolved in the spec-gate circulation — the cheapest success).
Convergence evidence: at terminal, present the transformation trace over the steps actually completed. At
  DirectionalContrast: each settled axis mapped to the contrast rows that made its futures recognizable, the constituted
  direction, each exposed unknown with its downstream route, and the per-probe discard disposition. At DissolutionExit:
  the sharpened axes and the dissolution basis (plus dispositions, any exposed unknowns with their routes, and the
  pending re-fan target set relayed as live candidates when a refan re-entry had generated probes). At
  EarlyExit / MisdiagnosisExit: the partial trace with the per-probe dispositions. Demonstrated, not asserted.

── CONVERGENCE ──
converged(Λ) = (Λ.direction ≠ None ∧ Λ.harvest ≠ None ∧ discard_declared(Λ))  -- primary success: DirectionalContrast
                                                                   --   (harvest recorded before discard — assemble needs it)
             ∨ (Λ.phase = 1 ∧ (futures_recognizable(sharpened description) ∨ premise_collapsed) ∧ discard_declared(Λ))
                                                                   -- success stand-down: DissolutionExit — dissolution is
                                                                   --   convergence (the deficit resolved), not abandonment;
                                                                   --   EarlyExit / MisdiagnosisExit are non-convergent exits.
                                                                   --   Dissolution emits the enriched axes, not a
                                                                   --   DirectionalContrast: the advertised codomain is the
                                                                   --   primary path's
discard_declared(Λ) = ∀ p ∈ Λ.probes: ∃ d: (ref(p), d) ∈ Λ.discard_trace   -- every probe has a declared Disposition,
                                                                   --   keyed by ref(p) = {index(p), p.direction,
                                                                   --   p.artifact_ref}; the ordinal makes each probe's
                                                                   --   entry distinct even when labels repeat
                                                                   --   (DiscardFailed is declared, not converged-silently)
result equations:
  DirectionalContrast ⇔ Λ.direction ≠ None ∧ Λ.harvest ≠ None ∧ discard_declared(Λ)
                        -- harvest is a convergence requirement: assemble(Λ.harvest, Λ.discard_trace) is undefined without
                        --   it — a direction with discard declared but nothing harvested cannot emit the terminal record
  EarlyExit           ⇔ (user_withdraw ∨ unprobed_standdown ∨ insufficiency_standdown) ∧ discard_declared(Λ)
                        -- non-convergent exit: withdrawal is the typed exit cleanup can act on; unprobed_standdown (budget-spent naming of an
                        --   unprobed candidate) and insufficiency_standdown (repeated insufficiency at the re-presented gate
                        --   with the budget spent on Materialization) are withdrawals by consequence — the user exits the
                        --   materialized decision space; a hard esc yields no turn — the bounded scratch lifecycle is the backstop
  MisdiagnosisExit    ⇔ Λ.refan_budget = 0 ∧ Λ.refan_kind = Gap ∧ contrast_insufficient ∧ discard_declared(Λ)
                        -- non-convergent exit; a budget spent on Materialization does NOT reach it: that branch relays back to Qdir
                        --   over the accumulated probes, where the direction is still constitutable
  DissolutionExit     ⇔ Λ.phase = 1 ∧ (futures_recognizable(sharpened description) ∨ premise_collapsed) ∧ discard_declared(Λ)
                        -- convergent success stand-down (see converged); pre-generation circulation: Λ.probes = ∅ and the obligation is trivially declared;
                        --   refan re-entry: probes exist and cleanup_verify produces their dispositions first
framing readout: the surfaced state names the work in play (axes being settled, probes under contrast, direction being
  constituted, discard being verified) — never a completion tally.

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 detect (sense)             → Internal analysis (deficit predicate + 4-step routing; no external tool)
Phase 0 no_deficit_relay (extension) → TextPresent+Proceed (futures recognizable from text: present the finding with reasoning; regular gate suffices; not activated)
Phase 0 route_away_relay (extension) → TextPresent+Proceed (routing rows ①–③: present the matched row with its basis; hand off to the cited protocol; not activated)
Phase 0 unfit_relay (extension)    → TextPresent+Proceed (a type guard fails and no routing row matches: state the failed guard and why; the decision stays at a regular gate; not activated)
Phase 0 requires_fail_relay (extension) → TextPresent+Proceed (no imminent commitment, or fewer than two candidates: state the failed requirement; one or zero candidates is handed to row ③'s targets for candidate generation; not activated)
Phase 1 derive_axes (sense)        → Internal analysis (divergence axis candidates from the candidate directions)
Phase 1 draft_policy (sense)       → Internal analysis (placeholder policy draft: visible synthesis, non-evidence stamp, skeleton-data split)
Phase 1 Qspec (constitution)       → present (mandatory spec gate: divergence axes + placeholder policy + probe target set + realization tier; fires BEFORE any probe generation — no divergence axis is AI-selected past this gate; Adjust re-presents without generation; RE-ENTERED from a refan carrying a spec revision — a new axis, a tier escalation, or a revised target set — scoped to that revision, before that refan generates anything; pre-gate text declares the free-response pathways — question an axis, contest the activation premise, withdraw)
Phase 1 dissolution_relay (extension) → TextPresent+Proceed (either party, at any circulation: the sharpened description made the futures recognizable without probes, or the activation premise collapsed; state the basis — the sharpened axes themselves — and hand to the regular gate the enriched axes together with any exposed unknowns already recorded (each with its route) and, on a refan re-entry, the per-probe dispositions from the preceding cleanup_verify plus the pending re-fan target set — the user-authored composition on a materialization re-entry, the revised candidate set on a gap re-fan — relayed as live candidates (a user-constituted candidate never dies with the stand-down); stand down as DissolutionExit — a success, not an abandonment)
Phase 1 revise (track)             → Internal state update (Adjust branch: Λ axes/policy/target-set/tier revision before re-presenting Qspec; on a materialization re-entry the target set is fixed to the composition and is not adjustable)
Phase 1 settle (track)             → Internal state update (Approve branch: the user-approved axes, policy, probe target set, and tier are committed to Λ before generation — the spec every downstream transform is bound to)
Phase 2 instantiate (transform)    → Write, Bash (temp-isolated placeholder artifacts, cleanup-registered at creation; existing project files never modified; Vignette tier emits session text only — no file artifact; each probe's concretum is recorded on the Probe at instantiation — Vignette: the narration text, Mockup: at its artifact_ref)
Phase 2 instantiate_delegate (dispatch) → Agent (conditional, Mockup tier; parallel topology: one probe per agent, each temp-isolated with cleanup registration; delegation subordinate to the active runtime/tool policy)
Phase 3 contrast (sense)           → Internal analysis (per-axis juxtaposition; CommonCommitment extraction)
Phase 3 present (extension)        → TextPresent+Proceed (probe-first order: probes one by one, each from its typed concretum — the Vignette narration re-presented as instantiated, the Mockup artifact walked through, never regenerated at presentation → per-axis contrast map with common commitments declared → newly exposed unknowns; table-first re-abstracts and reproduces the deficit)
Phase 4 Qdir (constitution)        → present (mandatory direction gate: each option points at the probe-exposed future it settles — recognition, not label simulation; presented as one concrete Select per probe-exposed direction (type-preserving materialization of the Select constructor) plus Synthesize. The free-response pathways — interrogate a probe, declare the contrast insufficient, withdraw — are declared in the pre-gate text, never as peer options: they commit no downstream action on the decision axis)
Phase 4 Qmicro (constitution)      → present (conditional: fires on Synthesize; Confirm settles the synthesis now, Materialize re-fans it into new probes consuming the shared budget; only the user can judge whether the synthesis is already recognized. Materialize is budget-guarded: with the budget spent the defined option set is {Confirm} — the guard is in the type, so this is not option deletion)
Phase 4 interrogate_answer (extension) → TextPresent+Proceed (free-response pathway, not a gate option: design-intent answers within placeholder discipline; factual unknowns recorded as ExposedUnknowns with the Inquire route; the gate is re-presented unchanged)
Phase 4 materialize_unavailable_relay (extension) → TextPresent+Proceed (Materialize requested with the shared re-fan budget spent: state the exhaustion with its basis; Qmicro presents {Confirm} — no option of the presented set is ever mutated, and no path re-enters Materialize)
Phase 3 insufficiency_after_materialization_relay (extension) → TextPresent+Proceed (budget spent on the user's own materialization and the contrast is still insufficient: state it with its basis and re-present the direction gate over the accumulated probes — the standing synthesis is Selectable there, since its probe now exists among the accumulated probes (type-preserving materialization of Select), and the original directions stay Selectable; this is NOT deficit misdiagnosis. ONE-SHOT: Λ.insufficiency_relayed marks the firing — a repeated insufficiency at the re-presented gate routes to insufficiency_standdown_relay, never to a second unchanged re-presentation)
Phase 3 insufficiency_standdown_relay (extension) → TextPresent+Proceed (repeated insufficiency at the re-presented gate with the budget spent on Materialization: state that the accumulated contrast cannot make the futures recognizable and no re-fan remains; relay the contrast harvest as context to the regular gate; cleanup_verify enforced; terminate as EarlyExit via insufficiency_standdown — a withdrawal by consequence, mirroring stand_down_relay)
Phase 5 harvest (track)            → Internal state update (direction, deciding contrast rows, routed unknowns recorded before discard; the discard trace does not exist yet)
Phase 5 cleanup (transform)        → Bash (the DESTRUCTION step inside cleanup_verify's typed sequence — per-probe artifact destruction, retry once on failure; every transition that names cleanup_verify runs this step first)
Phase 5 cleanup_verify (observe)   → Bash, Read (the VERIFICATION step closing the same sequence: verify absence of each Path artifact after its destruction step; Disposition recorded per probe — verification never runs without the destruction step preceding it)
Phase 5 assemble (track)           → Internal state update (terminal record built from the harvest and the completed discard trace — after cleanup, never before)
converge (extension)               → TextPresent+Proceed (transformation trace: axes → deciding contrast rows → direction; unknowns with routes; per-probe discard disposition)
withdraw (extension)               → TextPresent+Proceed (explicit free-response exit: partial transformation trace + residual declaration; cleanup_verify enforced; terminate as EarlyExit. A hard esc — tool-level escape — yields no turn, so cleanup cannot run: temp isolation's bounded scratch lifecycle is the backstop)
Phase 4 stand_down_relay (extension) → TextPresent+Proceed (budget-spent naming of an unprobed candidate: state that its future was never materialized and the remaining decision belongs to a regular gate; relay the contrast harvest as context; cleanup_verify enforced; terminate as EarlyExit via unprobed_standdown — a withdrawal by consequence)
misdiagnosis (extension)           → TextPresent+Proceed (deficit misdiagnosis report + route_away handoff per routing table; when no row matches, declare the misdiagnosis with no downstream protocol and return the decision to a regular gate with the residual declared; cleanup_verify enforced; terminate as MisdiagnosisExit)
seam (extension)                    → TextPresent+Proceed (fires at deactivation: a user-declared chain naming the next protocol, or a composition edge this SKILL.md declares — the routing-precedence table's ① `/ground`, ② `/inquire`, ③ `/frame` · `/elicit`, or a harvested GroundTag to `/ground` — settles the next move; proceed directly to it, citing that settling source; every Constitution gate inside this protocol and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = { phase: Phase, X: DirectionProspect,
      axes: Set(DirectionAxis),                -- settled at Qspec; extended only via inherited spec-gate duty on refan
      policy: PlaceholderPolicy, tier: RealizationTier,
      tgt: List(direction),                    -- probe target set settled at Qspec; := [composition] on a materialization refan
      probes: List(Probe),                     -- cumulative across refan (discarded probes remain listed for the trace)
      contrast_map: Option(ContrastMap),
      exposed_unknowns: Set(ExposedUnknown),   -- each carries a DownstreamRoute (Gap | Inquire)
      common_commitments: Set(CommonCommitment),
      refan_budget: ℕ,                         -- init 1; decremented by refan (insufficiency or materialization, shared)
      refan_kind: Option(RefanKind),           -- what the budget was spent on; None until the single refan is taken
      insufficiency_relayed: Bool,             -- init False; set when insufficiency_after_materialization_relay fires
                                               --   (one-shot relay: a repeated insufficiency stands down)
      direction: Option(UserDecision),
      harvest: Option(Harvest),                -- recorded before discard; carries no discard trace
      discard_trace: DiscardTrace,             -- one entry per probe by terminal (invariant: discard_declared)
      history: List<(Q, A)>,
      active: Bool, cause_tag: String }
-- Guard: no probe is generated before a Qspec approval covers its axes — on the initial pass, phase < 2 ⇒ probes = ∅;
--   a refan re-entry to Phase 1 HOLDS prior probes but generates nothing until its Qspec settles the revision
--   (new axis, tier escalation, or revised target set)
-- Guard: ∀ a ∈ axes: settled_at_Qspec(a) — a refan carrying a new axis re-enters Phase 1 before generating (breach condition 1)
-- Guard: Materialize ∉ presented(Qmicro) when refan_budget = 0 — budget-guarded constructor; no path re-enters it (termination)
-- Guard: ∀ p ∈ probes: p.artifact_ref = None ∨ temp_isolated(p.artifact_ref) (no permanent project file, ever)
-- Guard at terminal: discard_declared(Λ) — every probe carries a declared Disposition

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). registered dependency edges preserved. Direction resolution emergent via session context.
```

## Core Principle

**Contrast over Simulation**: When the differential futures of direction candidates cannot be carried by descriptions, a structurally perfect gate still forces the user to mentally simulate consequences instead of recognizing them. Proplasma replaces simulation with materialized contrast: cheap placeholder probes commit different values on user-settled divergence axes, and the direction judgment is constituted on futures the user has actually seen. Probe generation is a **transform operation**, legitimate only inside this survival chain: Constitution spec gate (axes + placeholder policy settled) → transform generation (temp-isolated, cleanup-registered, visibly synthetic, non-evidence) → relay contrast presentation (per-axis juxtaposition) → Constitution direction decision → cleanup verification (discard_trace). Three breach conditions dissolve the chain, and any one of them demotes the protocol to a stop-and-hand-off (no generation): (1) an AI-selected divergence axis without or after the spec gate, (2) a write to a permanent project file, (3) a probe treated as evidence for any claim — the demotion is the only permitted fallback, there is no ad-hoc bypass. The self-cannibalization objection ("resolving a description-failure with more description") is answered by the tier structure: a vignette is not a label-description but a placeholder-**concretum** narration — a different layer; when even vignette-level materialization cannot carry the contrast, the Mockup tier builds real temp-isolated artifacts, and the protocol's meaning stays independent of the realization tier.

## Mode Activation

### Activation

User calls `/preview` on a pending direction decision — **Layer 1 (User-invocable)**: the slash command or description-matching input ("I'd have to see it to decide"), always available — or the AI detects the deficit from the three signals below observed at a live direction gate and nudges — **Layer 2 (AI-guided)**: the AI surfaces the deficit with evidence and proposes activation, it never activates silently. Detection is silent (Phase 0); activation always passes through the Constitution spec gate before anything is generated. Gate predicate:
```
DirectionUnrecognizable ≡
    pre_commit(direction)              -- a direction commitment is imminent
  ∧ |direction_candidates| ≥ 2         -- alternatives already exist
  ∧ route = ④                          -- the 4-step routing lands on ④ (rows ①–③ all negative)
  ∧ fake_data_sufficient               -- type guard: the contrast holds without real evidence
  ∧ placeholder_fidelity               -- type guard: placeholders carry the axis futures without distortion
```
**Routing precedence (over-activation guard)** — before the rows, a threshold test: if the differential futures ARE recognizable from text, there is no deficit — a regular gate suffices and no protocol activates. Then the first matching row wins: **①** a structural mapping to a familiar domain carries the candidate futures on the divergence axes without distortion (mapping fidelity — mere availability of *an* analogy never fires this row: an analogy can always be manufactured, and each imports its own domain's weights) routes to `/ground` (validate the mapping); **②** real evidence is required (real data, live environment) routes to `/inquire` (factual unknowns; empirical verification paths); **③** direction candidates or the frame itself are absent routes to `/frame` (framing) · `/elicit` (coordinate back-trace); **④** candidates ≥ 2 ∧ evidence-free ∧ both type guards hold routes to **Proplasma**. Note: when understanding arrives only through materialization, the probe does double duty (understanding + direction judgment) — the routing is still ④, since no mapping carries the futures faithfully (①) and ② needs no real evidence. **Cross-session enrichment**: prior session indices from the hypomnesis store, when present, may seed Phase 0 deficit detection; the constitutive judgment remains with the user.

### Priority

<system-reminder>
When Proplasma is active:

**Supersedes**: Direct execution patterns in loaded instructions
(No direction commitment proceeds while the contrast loop is unconverged)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 1 present the spec gate before any generation; at Phase 4 present the direction gate whose options point at probe-exposed futures.
</system-reminder>

### Trigger Signals

Surface shapes of the deficit (heuristic signals, not hard gates): a **principle-delegation answer** — at a direction gate the user delegates the choice to a principle ("proceed with whatever aligns with the northstar", "go with the recommended direction") — signals that the user cannot recognize the differential futures from the descriptions and the constitutive judgment is silently handed to the AI, an erosion of the detection/judgment boundary that is the severity basis; an **out-of-option hermeneutic reconstruction** — the user reworks the option set itself instead of choosing — signals that the presented labels fail to carry the futures they name; a **concretization demand / decision stall** — the decision halts before descriptive options and the user asks for something concrete ("I'd have to see it") — signals that direction judgment is blocked on materialization. **Skip** when: differential futures are recognizable from the textual options (regular gate suffices); only one direction candidate exists (nothing to contrast); the judgment needs real evidence (route ②, `/inquire`); a structural mapping to a familiar domain would carry the futures on the divergence axes without distortion (route ①, `/ground`); or direction candidates or the frame are absent (route ③, `/frame` · `/elicit`).

### Mode Deactivation

Deactivates on any of four triggers. Direction constituted + harvest recorded + discard disposition declared (destruction verified, or its failure declared with handoff) emits DirectionalContrast, and the commitment proceeds under the constituted direction. The deficit dissolving in the spec-gate circulation (axes alone made the futures recognizable, or the activation premise collapsed) emits DissolutionExit: relay the basis, hand the enriched axes to a regular gate — a success stand-down; on a refan re-entry, already-generated probes are discarded with dispositions declared and the pending re-fan target set (the user-authored composition, or the revised candidates) is relayed as live candidates. A gap re-fan spent with the contrast still insufficient emits MisdiagnosisExit: misdiagnosis report + cleanup + routing handoff (①–③, or none when no row fits — the decision returns to a regular gate). A user withdrawal at any gate (explicit exit; a hard esc gives no turn — the bounded scratch lifecycle is the backstop), or a stand-down by consequence (an unprobed candidate named with the budget spent, or a repeated insufficiency at the re-presented gate), emits EarlyExit: partial trace + cleanup enforced + residual declared — with the contrast harvest relayed as context.

## Protocol

### Phase 0: Detection + Routing (Silent)

Verify the gate predicate and walk the routing precedence (PHASE TRANSITIONS Phase 0; TOOL GROUNDING relays above): confirm an imminent commitment with ≥2 candidates, test whether the futures are already recognizable from text, walk routing rows ①→③, then verify both type guards — a guard failure is usually explained by row ② (evidence needed) or row ③ (frame absent) rather than being a protocol defect. Any negative relays with its cited basis and stands down (not activated); all positive proceeds to Phase 1.

### Phase 1: Spec Gate

Derive the divergence axes (surface variation — color, naming, ordering — is not divergence), draft the placeholder policy, and propose the probe target set and realization tier (TYPES DirectionAxis, PlaceholderPolicy, Tgt, RealizationTier); the user settles all of it before anything is generated. Present the axes, policy, target set, and tier as pre-gate analysis text; then **present** the spec gate:
```
Settle the probe spec before I build anything.

Options:
1. **Approve** — generate the probes on these axes under this policy
2. **Adjust** — revise axes, policy, which directions get probed, or tier; I re-present the spec (nothing is generated meanwhile). On a materialization re-entry the target stays your composition — the spent budget covers no other fan
```
This gate is the enforcement point of breach condition (1): past it, no divergence axis is ever AI-selected; the spec-revision re-entry contract (new axis, tier escalation, or revised target set) is Rule 3. The pre-gate text also names what is open to you beyond the two options — **question an axis**, **contest whether this protocol is even needed**, or **step out** — none of these settles the spec, so none is an option, but contesting the premise can dissolve the deficit outright: deriving the axes is itself description-sharpening, and when that alone makes the futures recognizable or exposes the fork as false, the protocol **stands down as a success** (Rule 12) — the preliminary clay model is skipped when the sketch turns out precise enough. An analogy offered during this circulation is commentary that must declare which axis it weights — a borrowed domain imports its own weights — and never substitutes for the contrast itself.

### Phase 2: Instantiation (Transform)

Generate the probes without interaction, inside the survival chain: one probe per direction in the settled target set (2–4 for a contrast fan), each committing its own values on every settled axis. A **materialization** re-fan is the exception — it instantiates only the user's own composition and contrasts it against the probes already on the table, a recognition step rather than a fresh contrast. Temp isolation, common-commitment declaration, and the non-evidence stamp at creation follow Rules 4, 7, and 5.

### Phase 3: Contrast Presentation (Relay)

Fixed presentation order — **probes first** (Rule 6): each probe's concretum (the vignette narration, or the Mockup artifact walked through), then the per-axis contrast map with common commitments declared as shared premises, then newly exposed unknowns — a table placed first would re-abstract the concreta back into description, reproducing inside the presentation the very deficit the protocol resolves. If the contrast is insufficient (an axis with undifferentiated values, or the user says so): re-fan once within the shared budget, escalating the realization tier through the spec gate when the gap is fidelity rather than a missing axis. What happens when the budget is exhausted and the contrast is still insufficient depends on what it was spent on — misdiagnosis handoff for a spent gap re-fan, or a one-shot re-presentation of the direction gate over the accumulated probes for a spent materialization (Rule 9; LOOP).

### Phase 4: Direction Gate (Constitution)

Present the contrast summary as pre-gate text; then **present** the direction gate — each option points at a future a probe already exposed, recognition rather than label simulation (Rule 2). The pre-gate text names the free-response pathways — question a probe, declare the contrast insufficient, step out, or name an unprobed candidate — per Rule 8 and PHASE TRANSITIONS Phase 4; none of them settles a direction, so none is a peer option.
```
Which direction do you settle?

Options (one concrete Select per probe-exposed direction — type-preserving materialization of the Select constructor; the coproduct stays {Select, Synthesize}):
1. **Select: {direction A}** — the future probe A exposed: {its deciding axis values, as you saw them}
2. **Select: {direction B}** — the future probe B exposed: {its deciding axis values, as you saw them}
   (… one numbered Select option per probed direction …)
N. **Synthesize** — compose your own direction from the probes (recombine/adjust); opens a micro-choice: confirm it now, or materialize it as a new probe within the remaining re-fan budget
```
**Select(direction)** proceeds to Phase 5; **Synthesize(composition)** opens the micro-gate — **Confirm** settles it now, **Materialize** re-fans it into a new probe within the remaining budget (with the budget spent, Materialize drops out of the option set and only Confirm remains) — per TYPES Gs and Rule 8. Free responses (questioning a probe, declaring the contrast insufficient) route per Rule 8 and the Phase 3 insufficiency handling above, never as peer options.

### Phase 5: Harvest → Discard (in this order)

**Harvest precedes discard** (Rule 10): the constituted direction, the **deciding** contrast rows only (not the whole map), and inherited unknowns tagged with their downstream route — a pre-commit check to `/gap`, a factual unknown to `/inquire`, and the constituted direction itself to `/ground` when it maps onto a familiar domain worth validating (Rule 8; TYPES DownstreamRoute, GroundTag). The discard trace is not part of the harvest — cleanup produces it afterwards. Then **cleanup verification**, per probe: execute the registered cleanup, verify absence, record the Disposition (Rule 11; TYPES Disposition) — a failed destruction is retried once, then declared as DiscardFailed with a manual-cleanup handoff, visible, never silent. The durable record keeps the direction decision only; probes and their detail remain session-local and discarded. Present the convergence trace (LOOP) and emit the terminal record.

## UX Safeguards

Every safeguard here is enforced by a numbered Rule or a formal-block invariant, not restated structure: gate specificity (the gate predicate + routing precedence above), spec before generation (Rule 3), temp isolation (Rule 4), the non-evidence stamp (Rule 5), probe-first order (Rule 6), common-commitment declaration (Rule 7), the bounded shared re-fan with its ending matched to what it was spent on (Rule 9), cleanup and discard transparency on every exit (Rule 11), and the current-work framing readout in place of a completion tally (LOOP). No safeguard introduces a constraint beyond what the Rules already state.

## Rules

1. **Hybrid initiation, user-constituted direction** (Cognitive Partnership Move): the user's utterance ("I'd have to see it") dominates activation, and the AI may nudge from the three detection shapes with cited evidence; every constitutive step — divergence axes, placeholder policy, the direction itself — is settled by the user at a Constitution gate. The AI derives, instantiates, contrasts; it never selects the direction.
2. **Recognition over Recall, on materialized futures**: direction-gate options point at futures the probes already exposed — the user recognizes, never mentally simulates from labels. Presenting label-only implications at the direction gate reproduces the deficit inside the gate.
3. **Spec gate before generation** (breach condition 1): no probe exists before the spec gate settles axes and policy; no divergence axis is AI-selected past the gate. A re-fan whose implication carries a spec revision — a new axis, a realization-tier escalation (vignettes that could not carry the contrast escalate to Mockup through the gate), or a revised probe target set — **routes back through the spec gate** scoped to that revision before it generates anything; a re-fan that revises nothing in the spec goes straight to instantiation. This is a transition on the path, not an instruction to remember: there is no route from a spec revision to a probe that does not pass through the gate.
4. **Temp isolation** (breach condition 2): probes live under temp isolation with cleanup registered at creation; existing project files are never modified. Vignette-tier probes emit session text only. Where the harness provides a session-scoped scratch area with a bounded lifecycle, isolation is realized there — a leftover decays with the substrate, and a destruction failure becomes a bounded residual rather than a permanent one.
5. **Non-evidence stamp** (breach condition 3): a probe is evidence for no claim — the stamp attaches at creation and pierces the harvest record and any session-text remnant. Citing a placeholder concretum as grounds for any claim dissolves the protocol's legitimacy; if a breach becomes unavoidable by design, the only permitted fallback is demotion to stop-and-hand-off (no generation).
6. **Probe-first presentation**: probes one at a time, then the per-axis contrast map, then new unknowns. A table placed first re-abstracts the concreta and reproduces the deficit in the presentation order. Each probe is presented from the concretum recorded at instantiation — the vignette narration re-presented as generated, the Mockup artifact walked through — never re-narrated from memory.
7. **Common commitments declared**: design decisions forced uniformly across probes during instantiation are reported with the contrast map, so shared premises are never mistaken for divergence axes.
8. **Direction-gate response discipline**: the gate offers two options — Select settles a probe-exposed direction (a constrained constructor: naming an unprobed candidate parses into the unprobed-candidate pathway, never as a Select); Synthesize opens the micro-gate (Confirm now vs Materialize as re-fan) because only the user can judge whether their synthesis is already recognized. Questioning a probe, declaring the contrast insufficient, and stepping out are **free-response pathways named in the pre-gate text, never peer options**: none of them settles a direction, so none carries a differential future. A design-intent question is answered within placeholder discipline; a factual unknown is recorded and routed to `/inquire`; an analogy request is answered as commentary that declares which axis the borrowed domain weights, never as contrast material; the gate then returns unchanged. Downstream routes for harvested unknowns: a pre-commit check goes to `/gap` at the point the direction becomes a committed action (that is where `/gap` activates — it does not act on direction commitments), a factual unknown to `/inquire`, and the constituted direction to `/ground` when it maps onto a familiar domain worth validating — a tag on the harvested direction itself, not an unknown.
9. **One shared re-fan, and what it was spent on decides the ending**: contrast-insufficiency re-fan and synthesis materialization share a single re-fan. Materialize is offered only while the budget is live, so the synthesis path cannot loop. When the budget is spent and the contrast is still insufficient: if it went on a **gap** re-fan, the deficit was misdiagnosed — report it and hand off per the routing table (and when no row fits, say so plainly and return the decision to a regular gate). If it went on the user's **own materialization**, the deficit was not misdiagnosed — they recognized the contrast well enough to build on it — so re-present the direction gate over the probes already on the table. A direction the user has already recognized is never thrown away by a budget rule. That re-presentation is one-shot: a repeated insufficiency at the re-presented gate stands down as an early exit — cleanup runs and the decision returns to a regular gate with the contrast relayed as context — never a second unchanged re-presentation.
10. **Harvest before discard**: harvest the direction, the deciding contrast rows only, and the routed unknowns — then discard, then assemble the record from the harvest and the completed discard trace. The trace is not part of the harvest; cleanup is what produces it. The durable record keeps the direction decision only; probe detail stays session-local.
11. **Cleanup on every protocol-controlled exit path**: DirectionalContrast, EarlyExit (withdrawal), MisdiagnosisExit, and a DissolutionExit reached after generation all run cleanup verification; every probe carries a declared Disposition; a failed destruction is retried once and then declared with a manual-cleanup handoff, never silent. A hard esc — a tool-level escape that gives the protocol no turn — cannot run cleanup by nature; temp isolation's bounded scratch lifecycle is the backstop there, which is part of why probes never live outside it.
12. **Convergence persistence, with the cheapest success honored**: the mode stays active until the direction is constituted, the harvest recorded, and the discard declared, or the user exits, or misdiagnosis is declared — or the deficit dissolves in the spec-gate circulation: axis derivation is itself description-sharpening, and when the sharpened description alone makes the futures recognizable (or collapses the activation premise), the protocol stands down as a success with the basis stated and the enriched axes handed back (on a refan re-entry, together with the per-probe dispositions and the pending re-fan target set — a user-authored composition is never lost to the stand-down). Convergence is demonstrated via the transformation trace, not asserted. Actually removing a stuck artifact is the environment's job — the protocol's own duty ends at the declared disposition and the manual-cleanup handoff; a constituted direction is never held hostage to a janitorial failure.
13. **Context-Question Separation**: analysis, evidence, and the contrast presentation are text output before each gate; the gate contains the essential question and option-specific differential implications only.
14. **Option-set relay test (Extension classification)**: a single dominant option (entropy → 0) is presented as relay with cited basis. Each Constitution option must be genuinely viable under different user value weightings; shared-trajectory options collapse to one; off-axis prompts surface as free-response pathways rather than peer options.
15. **Plain emit discipline**: user-facing emit (probe narrations, contrast presentation, gate options, convergence traces) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. Formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, code-style backtick tokens — stays in the formal block. What the user reads is the probe, the contrast, or the question in their idiom.
16. **Round-local salience bundling**: each user-facing round bundles the current judgment, its nearest evidence (the relevant probe or contrast row), and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
17. **Gate integrity** (Safeguard tier): the defined option sets (S, D, Gs) are presented intact — option injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option into a concrete term while preserving the TYPES coproduct — e.g., naming the actual probe directions inside Select) is distinct from mutation.
18. **Formal blocks are runtime-normative**: this protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract, since each block is the type that constitutes the protocol — preserving the blocks keeps the protocol intact. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).
19. **Seam relay on declared continuation**: when a user-declared chain or a composition edge this SKILL.md declares (the routing-precedence table's ①–③ rows, or a harvested GroundTag) names the next protocol, the between-protocol seam after this protocol's terminal is relay (Extension) — proceed directly, citing the settling source (the chain declaration or the named edge). This governs only the seam BETWEEN protocols; every Constitution gate inside this protocol and the next fires unchanged, and the user can redirect at any turn.
