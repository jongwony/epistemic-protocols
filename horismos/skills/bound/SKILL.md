---
name: bound
description: "Define epistemic boundaries per decision. Fires when a decision's direction, scope, type, or ownership is undefined. Type: (BoundaryUndefined, AI, DEFINE, TaskScope) → DefinedBoundary"
---

# Horismos Protocol

Define epistemic boundaries per decision through AI-guided classification. Type: `(BoundaryUndefined, AI, DEFINE, TaskScope) → DefinedBoundary`.

## Definition

**Horismos** (ὁρισμός): A dialogical act of proactively defining epistemic boundaries per decision, where AI probes for boundary-undefined domains, dispatches the boundary **kind** up-front (a KindRouteMap of recognition seeds — direction/priority, scope, type/concept, ownership — plus an emergent/naming path) through a fail-closed deficit-fit certificate, collects contextual evidence to enrich classification quality, and presents each domain for user classification by a **uniform settlement disposition** (user-supplies / AI-proposes / AI-autonomous / dismiss) into a BoundaryMap consumed by all downstream protocols. The disposition coproduct is the same for every kind — the captured kind sets WHAT boundary is being settled, the disposition sets HOW that boundary value is settled downstream. **Ownership** assigns the named domain decision: the user keeps it, asks for proposals while retaining selection, or entrusts it to AI within stated limits. Other kinds assign settlement of their boundary value downstream. When the source instead asks who should allocate a decision, that allocation is its own domain; the underlying decision follows the allocation actually settled.

```
── FLOW ──
Horismos(T, B_prior?) → Probe(T) → Bᵢ? →
  |Bᵢ| = 0: Qc(zero_signal_finding) → Stop → [Confirm: deactivate | Reopen(d): Bᵢ := {d}, proceed]      -- zero-signal gate (`Zero-signal surfacing`)
  |Bᵢ| > 0: Phase 0b sync_kind_route(T) → KindRouteMap →                                            -- up-front KIND dispatch (dispatch-first: kind settles before downstream consumers read it)
    [single_dominant_kind(KindRouteMap, T, context): relay(captured_kind + basis) (extension) → proceed (kind committed)   -- entropy→0 fast-path (option-set relay test): one kind dominates, foils route away → NO turn yield
     | else: Stop → captured_kind (constitution)]                                                   -- ≥2 viable hypotheses ∨ undecidable foil ∨ emergent gesture naming no single kind ∨ live ground leaves the emergent question undetermined → mandatory Constitution gate
    bind_kind(captured_kind) → KindBinding                                                           -- {label, positive_predicate, evidence, atomicity}; non-atomic → split/route, re-sync before continuing
    certify(KindBinding, local_claims) → DeficitFitCertificate                                         -- fail-closed: status(certificate) ≠ pass BLOCKS classification-loop entry (split / route claim / narrow-disambiguation first)
      status(certificate) = route:      → route_away(routed_deficit(certificate)) → deactivate (a local route claim holds the kind; no DefinedBoundary)
      KindBinding.atomicity = non-atomic: → split → re-sync Phase 0b → re-certify
      status(certificate) = ambiguous ∧ certificate.attribution = certificate(S): → Qa(captured_kind, claims_supported) → Stop → Attribution → attribute — Own: status re-reads as pass → init_loop_state; Route(d): route_away(d) → deactivate; Unattributable: deactivate (unattributable) with a relay of the finding; no DefinedBoundary
      status(certificate) = pass:       → init_loop_state                                                         -- enter classification only after the captured kind fits the local morphism
    init_loop_state uses seed_prior and the initial proposal as defined in PHASE TRANSITIONS, then loop:
    Phase 1 Ctx(T, cycle_n) [per-cycle re-scan] → candidates (cycle 1 joins B_seed) → reconcile_candidates → Sub-D[cycle_n] → auto_resolved? →
      Sub-D empty ∧ residual ≠ ∅: → Phase 4 (substrate exhausted, residual remains)
      Sub-D empty ∧ residual = ∅: → TERMINAL CARRIERS (Phase 1 row) → DefinedBoundary → converge (substrate exhausted, all surfaced domains classified — no empty Phase 4 gate)
      auto_resolved: → Phase 3 (skip Phase 2 for this cycle; no user A — the substrate-settled classification is carried into Phase 3)
      else:          → Phase 2
    Phase 2 boundary_readout(B, residual ∪ {Sub-D.domain}, captured_kind, context) → BoundaryEssence → snapshot(B, Λ.residual, default) → B_snapshot → Qc(Sub-D[cycle_n], kind, BoundaryClassification, BoundaryEssence, cycle_n, B_snapshot, default) → Stop → A
    Phase 3 (user-response: conservative parse(A) → (typed_A?, TerminationIntent?) — a commitment is recognized only when the whole response's decision-relevant meaning supports that reading; otherwise Phase 2 re-presents from A with the map unmutated; auto-resolved: typed_A = substrate-settled classification, no TerminationIntent) →
      integrate(typed_A?, B) → B'                                      -- total current-cycle fold: classification updates the anchor; termination-only residualizes it and returns B' = B
      ImplicitTermination: → TERMINAL CARRIERS (Phase 3 row) → DefinedBoundary → converge
                            -- "default" is Λ.default_for_residual at entry to Phase 3 (the value Phase 2 surfaced); NOT re-derived
      ExplicitTermination: → Phase 4
      else:                → propose_default(T, captured_kind, context) → default' for NEXT cycle (a contextual proposal with its cited basis) → cycle_n += 1, loop
  Phase 4 (optional path) boundary_readout(B, residual, captured_kind, context) → BoundaryEssence → Qf(residual, FinalGateDisposition) → Stop → TERMINAL CARRIERS (Phase 4 row) → DefinedBoundary
  Every graceful exit presents boundary_readout(B_final, ∅, captured_kind, context) with the convergence trace.

── MORPHISM ──
TaskScope, B_prior?
  → probe(task, context)                                           -- detect boundary-undefined domains
  → sync_kind_route(task, context) → KindRouteMap                  -- up-front dispatch: one hypothesis for every recognition seed (direction/priority, scope, type/concept, ownership) + emergent/naming path; each seed hypothesis carries positive_predicate, evidence, differential_future, route_away conditions
  → [single_dominant_kind: relay(captured_kind) (extension) | else: present(KindRouteMap) (constitution)]  -- option-set relay test over the kind hypotheses AND the live ground: one dominant kind (entropy→0) relays without a turn yield — either a seed (positive_predicate satisfied, foils' route_away hold, no emergent indicated) or an emergent kind the user's own wording already names unambiguously; ≥2 viable ∨ undecidable foil ∨ an emergent gesture naming no single kind ∨ an emergent question the live ground leaves undetermined gates. BOTH branches feed bind_kind → certify → init_loop_state (certificate fail-closed on both)
  → bind_kind(captured_kind) → KindBinding                         -- {label, positive_predicate, evidence, atomicity}; non-atomic kind → split or route before continuing
  → certify(KindBinding, local_claims) → DeficitFitCertificate         -- {own_claim, route_claims[], evidence, attribution}; fail-closed — status(certificate) ≠ pass BLOCKS classification-loop entry; fits the captured kind's positive_predicate against the own claim and the route claims inscribed in THIS SKILL.md
  → seed_prior(B_prior, captured_kind, Bᵢ, context) → (B₀, seed₀) → init_loop_state  -- source-backed classifications and known unresolved candidates, read before initialization
  → enrich(domains, codebase, cycle_n)                             -- per-cycle context collection (re-scan)
  → boundary_readout(B, pending domains, captured_kind, context) → BoundaryEssence  -- current arrangement made recognizable before the gate
  → classify(domain, as_inquiry) → typed_A ∈ BoundaryClassification               -- per-cycle object_ref(kind) classification by the uniform settlement disposition (the captured kind sets the content of each disposition option; the 4-value coproduct itself is kind-invariant)
  → integrate(typed_A?, B) → B'       -- total current-cycle fold; does NOT update default_for_residual
  → propose_default(T, captured_kind, context) → default'         -- continuation only: next round's proposal; the current answer commits only what its own round surfaced
  → [finalize | bulk_classify | identity] → B_final              -- TERMINAL CARRIERS derives the complete result from classified state and the actual terminal answer
  → boundary_readout(B_final, ∅, captured_kind, context) → BoundaryEssence  -- final readout accompanies the attributable trace on every graceful exit
  → DefinedBoundary
requires: boundary_undefined(T)            -- runtime checkpoint (Phase 0); sole activation precondition. (status(certificate) = pass is the Phase-0b classification-loop entry guard, NOT an activation precondition — it lives in the certificate-before-loop invariant below and the Phase 0b → Phase 1 transition; route/ambiguous status routes away or opens Qa inside Phase 0b rather than blocking activation.)
deficit:  BoundaryUndefined                -- activation precondition (Layer 1/2); the certificate's own_claim deficit for in-scope kinds
preserves: task_identity(T)                -- task scope invariant; BoundaryMap mutated; B_prior seed entries are mutable across cycles
invariant: Definition over Assumption
invariant: certificate-before-loop      -- status(certificate) = pass guards entry to the classification loop (shared meta-backbone order)

── TYPES ──
T              = TaskScope (task/project requiring boundary definition)
B_prior        = Optional(SeededPrior)                        -- optional invocation seed for hermeneutic carry-over (prior BoundaryMap detected in session context). Seeded into B at Phase 0b loop-state initialization ONLY when the prior map's kind matches the captured kind (same-kind — same boundary question). The guard is SEMANTIC, not type-based: every kind shares BoundaryClassification, so a mismatched prior's values are type-valid but answer a DIFFERENT boundary question, so a kind-mismatched prior map is surfaced as advisory context, NOT seeded as a structural entry. Seed entries are mutable across cycles
SeededPrior    = { map: BoundaryMap, kind: Kind }             -- the prior BoundaryMap together with the boundary kind it was produced over (Phase 0 step 3 detection binds both). The carried kind is the typed carrier the same-kind guard tests: kind(B_prior) ≡ B_prior.kind
seed_prior : (Optional(SeededPrior), Kind, Set(Domain), context) → (BoundaryMap, Set(Domain))
                 -- read the same-kind prior's setting record and later authorized revisions against the current task. B contains only current, source-supported dispositions, including a revised disposition when the current source settles it; retain that source as each entry's basis. B_seed contains Bᵢ plus each still-relevant same-kind prior domain whose current disposition remains unresolved, deduplicated by domain and excluding dom(B). A revoked or unreadable disposition supplies no classification, but its still-relevant domain stays a candidate; a domain the current source excludes from this task is omitted. A kind-mismatched prior is advisory and supplies neither classifications nor candidates. The prior record is unchanged.

Probe          = T → Set(Domain)                              -- boundary-undefined domain detection (Phase 0; existence check, not exhaustive enumeration)
Domain         = { name: String, description: String, evidence: Set(Evidence) }
Evidence       = { source: String, content: String }
Bᵢ             = Set(Domain) from Probe(T)                    -- initial boundary-undefined domain signal (cycle 1 seed: carried into Phase 0b seed_prior and retained in Λ.B_seed unless its current disposition entered B, kept separate from the classified map B until classification — on zero-signal Reopen(d), Bᵢ = {d} is the one entry the Phase 1 re-scan cannot be assumed to re-derive)
ZeroSignalConfirmation = user's answer to a zero-signal finding ∈ {Confirm, Reopen(Domain)}  -- Confirm accepts no boundary-undefined signal (`Zero-signal surfacing`); Reopen names a domain for renewed investigation, including the challenge in current source assessment; a currently supported disposition can settle it without a fresh classification gate

-- Shared meta-backbone (KIND dispatch). One canonical schema; bound-local instantiation ONLY for object_ref, BoundaryClassification, the label field's type (Kind), the own claim, and the local route claims.
KindRouteMap   = sync_kind_route : (T, context) → { hypotheses: List<KindHypothesis>, emergent: NamingPath }
                                                              -- up-front dispatch sync surfaced at Phase 0b; hypotheses contains one carrier for every recognition seed (direction/priority, scope, type/concept, ownership), while the emergent/naming path keeps the kind open beyond those priors
KindHypothesis = { label: Kind, positive_predicate: String, evidence: Set(Evidence), differential_future: String, route_away_if: String }
                                                              -- each named kind is a PRIOR (recognition seed), NOT a closed coproduct member (`Dynamic rendering`: no fixed taxonomy)
NamingPath     = free-response affordance for a kind not among the seeds (emergent capture; user names the kind, or extends/replaces a seed)
single_dominant_kind : (KindRouteMap, T, context) → Bool      -- option-set relay test (entropy→0 predicate): true iff the live ground determines EXACTLY ONE kind, by either route — (a) SEED: exactly one hypothesis has its positive_predicate unambiguously satisfied by the framing, every other hypothesis' route_away_if holds, and (T, context) indicates no emergent capture; or (b) EMERGENT: (T, context) names exactly one emergent kind unambiguously, which IS the capture — the naming already happened in the user's own words, so gating it would ask for a value the live ground has settled. The seed conjuncts read KindRouteMap, which carries every recognition seed; the emergent conjunct turns on what the framing DENOTES, so it resolves against (T, context) — the user's own wording and the accumulated context — and the seed summary never stands in for it, because a summary cannot carry a branch whose decision rests on an unresolved denotation. An undecidable route_away_if, an emergent gesture resolving to no single naming, OR an emergent question (T, context) leaves undetermined makes the predicate false. true ⟹ the dispatch sync RELAYS the captured kind without a turn yield (Phase 0b sync_kind_route_relay, extension), citing its basis in the user's own wording — verbatim on route (b), where that wording IS the capture and a paraphrase would substitute the AI's reading for it; false ⟹ the mandatory Constitution gate fires (≥2 viable kind hypotheses, an undecidable foil, an emergent gesture naming no single kind, or an emergent question the live ground leaves undetermined). The captured kind still flows through bind_kind → fail-closed certify → init_loop_state on BOTH branches — the relay collapses only the kind-capture turn yield, NEVER the certificate (a non-pass certificate gets the full gated treatment — route → route_away/deactivate, ambiguous → Qa)
Kind           = captured boundary kind (seed ∈ {direction/priority, scope, type/concept, ownership} | emergent)
                 -- object_ref(kind) : the anchor the loop classifies (= Domain for bound, every kind; bound-local instantiation point — the kind sets WHAT the Domain's boundary is about, not the anchor type)
KindBinding    = { label: Kind, positive_predicate: String, evidence: Set(Evidence), atomicity ∈ {atomic, non-atomic} }
                 -- captures the kind; if atomicity = non-atomic → split or route BEFORE certify (no classification-loop entry on a compound kind)
Deficit        = a deficit label named by the local claims or by the user's Route(d) answer. Automatic certification ranges only over own_claim and the route_claims inscribed below; the user's route payload remains open beyond that finite evidence test
OwnClaim       = { deficit: BoundaryUndefined, resolution: DefinedBoundary, in_scope_if: String }
                 -- the claim bound makes, stated as the WHOLE local morphism: the deficit it takes AND the resolution it produces. A kind is claimed here when its positive_predicate instantiates BoundaryUndefined AND the settlement dispositions can carry it to DefinedBoundary — the bare deficit label is a name, the morphism is the predicate
DeficitFitCertificate = { own_claim: OwnClaim, route_claims: List<RouteClaim>, evidence: Set(Evidence), attribution: certificate(Set(Deficit)) | user(Attribution) }
                 -- certify stores certificate(S), where S contains exactly the locally supported claims. After Qa, attribute replaces that one attribution with user(a). The actual judgment and its origin share one carrier; the projections below are pure reads.
claimed_by(c)  = S when c.attribution = certificate(S); {BoundaryUndefined} when c.attribution = user(Own); {d} when c.attribution = user(Route(d)); ∅ when c.attribution = user(Unattributable)
status(c)      = when c.attribution = certificate(S): pass if S = {BoundaryUndefined}; route if S = {d} for an inscribed route claim; ambiguous otherwise
                 = when c.attribution = user(a): pass for Own; route for Route(d); ambiguous for Unattributable
routed_deficit(c) = the sole d in S when c.attribution = certificate(S) ∧ status(c) = route; d when c.attribution = user(Route(d))
                 -- defined only on route status. A user-named label remains a route even when absent from the local catalog or equal to BoundaryUndefined; the answer's control form determines its handling.
                 -- status ≠ pass blocks loop entry. An ambiguous certificate(S) opens Qa; user(Unattributable) exits. A pass establishes local admissibility to this morphism, not exclusion of every claim in the wider protocol set.
RouteClaim     = (route_if_predicate: String, routed_deficit: Deficit)
                 -- bound-local route claims — the sibling deficits a boundary-misfit kind is handed to. routed_deficit is the BINDING field; the command in parentheses is a non-binding hint for the user, not the relation this guard composes on:
                 --   missing pre-execution fact            → ContextInsufficient       (hint: /inquire)
                 --   framework absent for the decision      → FrameworkAbsent           (hint: /frame)
                 --   cross-domain mapping uncertain         → MappingUncertain          (hint: /ground)
                 --   direction candidates' futures unrecognizable from description → DirectionUnrecognizable  (hint: /preview)
claims_supported(k) = { d ∈ {BoundaryUndefined} ∪ { rc.routed_deficit : rc ∈ route_claims } : the evidence supports d's predicate }   -- what Qa presents: the inscribed claims the captured kind's evidence supports, each with what attributing the kind to it would mean. Equal to claimed_by(certificate) at the moment Qa fires; named separately because Qa also presents the case none of them holds
Attribution    = Own | Route(routed_deficit: Deficit) | Unattributable   -- the user's answer at Qa. A CLOSED coproduct because each constructor is a distinct processing path: Own opens the classification loop like any kind the fit passed; Route(d) takes the route_away deactivation; Unattributable deactivates with a relay of the finding. Route's payload is the deficit the user named — one of the claims Qa presented, or one they name themselves, emitted bare where this file inscribes no hint for it
attribute(k, a) = Λ.certificate.attribution := user(a)   -- the sole post-construction attribution write, after Qa's Stop. Projections retain Own, Route(d), and Unattributable as distinct control forms; evidence and local claims remain available for the trace.
local_claims   = (OwnClaim, the RouteClaim list above)      -- what certify reads beside the KindBinding; every claim it can fit is inscribed in THIS SKILL.md
cycle_n        = Nat                                          -- current cycle counter (visible at Phase 2)
                                                              -- bound index `k` ranges over `Λ.D_history` (the cycles that produced a Sub-D) in the convergence trace — NOT [1, cycle_n], since a substrate-exhaustion terminal scan increments cycle_n without producing a Sub-D
Ctx            = (T, cycle_n, context) → Set(Domain)           -- per-cycle candidate discovery and current-ground review. A domain is eligible when not in domains_touched, or when current evidence changes the ground of its recorded disposition or unresolved assessment. Read the defining source and relevant later utterances; being recorded or previously anchored does not settle current validity. Identical ground supplies no new eligibility. The scan carries the evidence for each candidate.
candidates     = Ctx(T, cycle_n, context) ∪ (Λ.B_seed when cycle_n = 1, otherwise ∅)   -- identity-deduplicated phase-local set, before reconciliation and anchor selection. Known unresolved seeds enter independently of rediscovery.
Sub-D          = { domain: Domain, scan_summary: String, evidence: Set(Evidence) }  -- per-cycle dimension projection (one anchor domain per cycle)
                                                              -- Sub-D[k] = D_history[k] (k-th historical entry); current cycle = Sub-D[cycle_n]
BoundaryEssence = a readable account of the current boundary arrangement for the captured kind, distinguishing settled dispositions from pending domains and citing the ground that gives those dispositions their meaning
boundary_readout : (BoundaryMap, Set(Domain), Kind, context) → BoundaryEssence
                 -- read the supplied classified or final map, the separate pending set, and their reachable setting sources and authorized revisions. Describe only what that map settles; pending domains remain open, and a displayed residual default remains a proposal. Dismiss is explained through the default accepted at its setting source. This is a presentation read, with no Λ write or independently retained authority.
propose_default : (TaskScope, Kind, context) → {UserSupplies, AIPropose, AIAutonomous} ⊆ BoundaryClassification
                 -- propose a residual disposition from the current boundary question, its stated limits and the accumulated context; cite the ground beside the proposal. This is a judgment, not an inference of authority from classifications of other domains. The proposal becomes binding only through the user's informed response; the displayed value is held through that response's fold.
Qc             = Per-cycle boundary classification interaction [Tool: Constitution interaction]
A              = the Phase 2 user response — an OPEN utterance, never a classification.
                 -- parse(A) → (typed_A?, TerminationIntent?) is conservative whole-utterance recognition. A commitment may be returned only when every decision-relevant part of A is coherent with and represented by that reading. If any part reframes the anchor, names an emergent concern, shifts the axis, or undercuts the apparent commitment, parse returns no commitment and Phase 2 re-presents with that material drawn directly from A in the conversation record. No separate framing carrier is needed, and no decision-relevant material can disappear down a terminal path.
                 -- Recognizing NO commitment (neither typed_A nor termination) is legitimate, not malformed: no map commitment exists yet. The map remains unchanged and the deliberative self-edge may stutter without an exhaustion bound; committing a disposition would exercise authority the user did not delegate.
typed_A        = the cycle's classification ∈ BoundaryClassification         -- recognized within the user's response on a Phase 2 cycle, or read from the substrate assignment on an auto-resolved cycle (Phase 1 auto-resolve check); its origin is recoverable from which MODE STATE partition the anchor landed in (Λ.user_responded / Λ.dismissed vs Λ.context_resolved), so the convergence trace can cite it. Drawn from the uniform settlement disposition; the presented option set is exactly this 4-value coproduct, intact per gate integrity invariant (a termination-only response carries no typed_A and is NOT an option-set extension — `Free-response separation`)
                 -- typed_A ∈ {UserSupplies(boundary), AIPropose(boundary), AIAutonomous(boundary), Dismiss} — the 4-value coproduct is kind-invariant; the captured kind sets what `boundary` refers to (who-decides for ownership, which-way for direction/priority, how-wide for scope, which-category for type/concept)
                 -- termination_intent surfaces via free-response affordance, NOT as an extra option in BoundaryClassification
TerminationIntent = parsed natural-language signal of user satisfaction
                  ∈ {ImplicitTermination(default_override?), ExplicitTermination}
                                                              -- ImplicitTermination: residual ↦ default_at_surfacing (the Λ.default_for_residual value visible in the just-completed Phase 2 surfacing; NOT re-derived in Phase 3) OR user-stated override; terminal provenance is defined in TERMINAL CARRIERS
                                                              -- ExplicitTermination: enter Phase 4 for bulk residual classification
                                                              -- default_override : BoundaryClassification — optional user-named alternative default (a member of the uniform settlement disposition) overriding the surfaced default
B              = BoundaryMap: Map(object_ref(kind), BoundaryClassification)
                 -- alias for Λ.boundary_map, the current classified entries only. B' denotes its successor after integrate; neither name is a second store. The kind fixes what each Domain's disposition concerns.
snapshot(B, R, default) = B ∪ { d ↦ default | d ∈ R }    -- pure recognition view; dom(B) ∩ R = ∅. R's entries are proposals until a terminal answer settles them.
B_snapshot     = snapshot(B, Λ.residual, default_for_residual)   -- computed at Phase 2; the unclassified anchor is the question beside this view. The view writes no Λ field.
BoundaryClassification = {UserSupplies(boundary), AIPropose(boundary), AIAutonomous(boundary), Dismiss}
                 -- the UNIFORM settlement disposition (BoundaryClassification): HOW the captured kind's boundary value is settled downstream — the SAME 4-value coproduct for every kind, used across Phase 2 (per-cycle) and Phase 4 (residual bulk)
                 -- read the captured question at the decision level its source names. For ownership, the disposition directly assigns the named domain decision. An explicitly requested allocation decision is a domain in its own right, whose resolution may later assign another decision; ordinary ownership classification adds no such intervening decision.
                 -- UserSupplies: the person retaining this judgment in its setting record supplies the value. AIPropose: AI develops candidates; that person selects or steers. AIAutonomous: AI chooses within the grant's stated limits, including among several acceptable alternatives. A receiving or coordinating agent reads these roles from that record and later authorized revisions, rather than rebinding them to its immediate interlocutor. The grant applies to that named question, including an allocation question when the source explicitly makes one the subject.
                 -- Dismiss is a COMMITTED no-boundary signal (proceed with the stated default), an on-axis disposition — not a skip; its differential future is "residual settled by default," distinct from the three active-settlement members
Qf             = Final gate bulk classification interaction [Tool: Constitution interaction]
FinalGateDisposition = {UserSupplies, AIPropose, AIAutonomous} ⊆ BoundaryClassification    -- the uniform residual-disposition subset surfaced at Phase 4, the same for every kind (the active settlement dispositions available to a bulk residual)
                 -- Phase 4 UserSupplies (kind-general): bulk-classify residual domains as user-retained (each residual domain becomes its own boundary; lazy-binding — values or protocol invocation deferred to downstream activation)
                 -- Phase 4 AIPropose (kind-general): bulk-classify residual as AI-proposed with selection retained, equivalent to per-cycle AIPropose(boundary)
                 -- Phase 4 AIAutonomous (kind-general): bulk-classify residual as AI-settled (semantically equivalent to per-cycle AIAutonomous(boundary))
DefinedBoundary = { map: B_final, kind: Λ.captured_kind } where one TERMINAL CARRIERS row produced B_final
                 -- TERMINAL CARRIERS is the exclusive provenance definition for the result map. The kind pairing makes the map's boundary question recoverable by a later /bound seed guard and by downstream advisory consumers because object_ref(kind) = Domain does not encode the kind.
Phase          ∈ {0, 0b, 1, 2, 3, 4}

── PHASE TRANSITIONS ──
Phase 0: T, B_prior? → Probe(T) → scan_B_prior(T) → Λ.B_prior → Bᵢ?                                           -- boundary existence checkpoint + optional hermeneutic-seed DETECTION (silent); detection binds Λ.B_prior but does NOT seed B — B does not exist yet (loop state, incl. boundary_map, is initialized at Phase 0b loop-state initialization after the kind is captured and the certificate passes)
       [Bᵢ = ∅] Qc(zero_signal_finding) → Stop → ZeroSignalConfirmation   -- zero-signal (`Zero-signal surfacing`): Confirm → deactivate (Horismos not activated) | Reopen(d) → Bᵢ := {d}, proceed to Phase 0b [Tool]
Phase 0b: T → sync_kind_route(T) → KindRouteMap → [single_dominant_kind: relay(captured_kind + basis) → proceed (extension, kind committed, NO Stop) | else: Stop → captured_kind (constitution)]
       → bind_kind(captured_kind) → KindBinding
       → certify(KindBinding, local_claims) → DeficitFitCertificate (track: store the local fit as Λ.certificate.attribution = certificate(S))
       → (status(certificate) = pass) seed_prior(Λ.B_prior, captured_kind, Bᵢ, context) → (B₀, seed₀); propose_default(T, captured_kind, context) → default₀
       → init_loop_state: Λ.boundary_map := B₀; Λ.B_seed := seed₀; context_resolved := domains_touched := dom(B₀); user_responded := dismissed := residual := ∅; cycle_n := 1; D_history := []; final_gate_answers := ∅; default_for_residual := default₀ [Tool]
Phase 1: Ctx(T, cycle_n, context) → candidates → reconcile_candidates → Sub-D[cycle_n]
       reconcile_candidates (track): withdraw every candidate's old B entry and partition membership; add all candidates to residual and domains_touched; clear B_seed after the cycle-1 join. Select one anchor by the LOOP ordering, remove that anchor from residual, and append its evidence-bearing Sub-D to D_history. If candidates is empty, Sub-D is empty. Previously recorded identities stay in domains_touched; every non-anchored candidate remains residual without needing rediscovery.
       → auto-resolve check on the anchor's current evidence → auto_resolved?   -- a supported disposition skips Phase 2; otherwise the unclassified anchor reaches its gate. PHASE TRANSITIONS owns the withdrawal and filing order [Tool]
Phase 2: Sub-D[cycle_n], kind, BoundaryClassification, cycle_n, B, Λ.residual, default
       → boundary_readout(B, Λ.residual ∪ {Sub-D[cycle_n].domain}, captured_kind, context) → BoundaryEssence
       → snapshot(B, Λ.residual, default) → B_snapshot
       → Qc(Sub-D[cycle_n], kind, BoundaryClassification, BoundaryEssence, cycle_n, B_snapshot, default) → Stop → A          -- per-cycle classification over BoundaryClassification with complete B_snapshot + default visibility [Tool]
Phase 3: (user-response: A → conservative parse(A) → (typed_A?, TerminationIntent?)) | (auto-resolved: typed_A = substrate-settled classification from the Phase 1 auto-resolve check, no TerminationIntent)
       → integrate(typed_A?, B) → B'                                             -- total cycle fold: a classification adds the anchor's entry and files it in context_resolved for auto-resolution, dismissed for Dismiss, or user_responded otherwise; termination-only files the anchor in residual and returns B' = B. Dismiss records the displayed default as its settlement basis
       → Λ.boundary_map := B'
       → (only on loop continuation) propose_default(T, captured_kind, context) → default' → Λ.default_for_residual := default'
Phase 4 (optional): B, residual → boundary_readout(B, residual, captured_kind, context) → BoundaryEssence → Qf(residual, FinalGateDisposition) → Stop → Λ.final_gate_answers
                                                                                                              -- final gate [Tool], reached via ExplicitTermination or Phase 1 substrate exhaustion; FinalGateDisposition = {UserSupplies, AIPropose, AIAutonomous}, every kind

Phase 0 → Phase 0b: boundary_undefined(T) = true ∨ ZeroSignalConfirmation = Reopen(d)       -- domain signal present (probe-detected, or user-reopened seeding Bᵢ := {d}) → dispatch the kind before the loop
Phase 0 → deactivate: boundary_undefined(T) = false ∧ ZeroSignalConfirmation = Confirm      -- no undefined boundary signal, zero-signal finding confirmed (`Zero-signal surfacing`)
Phase 0b sync_kind_route relay branch: single_dominant_kind(KindRouteMap, T, context) = true → relay captured_kind + basis, proceed (extension, NO turn yield) → continue to bind_kind   -- entropy→0 (option-set relay test): one kind dominates, foils route away; the captured kind is committed for the activation (a rare mis-relay is corrected by re-invoking /bound, not an in-loop redirect); certify stays fail-closed
Phase 0b sync_kind_route gated branch: single_dominant_kind(KindRouteMap, T, context) = false → Stop → captured_kind (constitution)                                                                      -- ≥2 viable hypotheses ∨ undecidable foil ∨ emergent gesture naming no single kind ∨ live ground leaves the emergent question undetermined → mandatory Constitution gate
Phase 0b → Phase 1: status(certificate) = pass ∧ loop state initialized                               -- kind captured (via relay or gate), fit certified, kind fixed → enter the per-cycle loop
Phase 0b → deactivate (route): status(certificate) = route                                   -- emit routed_deficit(certificate) through route_away, with local-fit or user-attribution basis; no classification loop or DefinedBoundary
Phase 0b → Phase 0b (re-sync): KindBinding.atomicity = non-atomic                          -- compound kind → split, re-sync, re-certify BEFORE entering classification (fail-closed); terminates because each split strictly decreases the bundled kinds
Phase 0b → attribute (CONSTITUTION): status(certificate) = ambiguous ∧ certificate.attribution = certificate(S)   -- Qa(captured_kind, claims_supported) → Stop → Attribution → attribute(k, a). Own opens initialization, Route(d) emits the route and deactivates, Unattributable takes the exit below. Status and route payload read the recorded answer; unchanged evidence is not re-certified [Tool]
Phase 0b → deactivate (unattributable): certificate.attribution = user(Unattributable)   -- relay the captured kind, supported claims, and unresolved finding; no loop-state initialization, DefinedBoundary, or return to Qa
Phase 1 → Phase 2:  Sub-D[cycle_n] non-empty ∧ ¬auto_resolved                               -- per-cycle anchor domain surfaced, requires user judgment
Phase 1 → Phase 3:  Sub-D[cycle_n] non-empty ∧ auto_resolved                                -- definitive assignment found in substrate, skip Phase 2
Phase 1 → Phase 4:  Sub-D[cycle_n] empty ∧ Λ.residual ≠ ∅                                   -- substrate-exhaustion path to explicit bulk classify (residual remains)
Phase 1 → converge: Sub-D[cycle_n] empty ∧ Λ.residual = ∅ → substrate-exhaustion terminal carrier             -- every surfaced domain already classified; no empty Phase 4 gate
Phase 2 → Phase 3:  A received ∧ commitment recognized (typed_A ∨ termination)               -- parse recognized a commitment in the response: typed classification, termination signal, or both
Phase 2 → Phase 2:  A received ∧ no commitment recognized                                    -- re-present from A with every decision-relevant reframing made visible; the map is unchanged. This deliberative self-edge carries no monotone progress claim and no exhaustion bound: it may stutter until the user constitutes a commitment [Tool]
Phase 3 → Phase 3 (confirm): parse leaves ≥2 J routing branches viable → Qc(candidate readings) → Stop → confirmed_intent ∈ J   -- `Ambiguous response routing`; routing resumes at J with the confirmed branch, which is a TerminationIntent member on the terminating branches and the absence of one on `next` [Tool]
Phase 3 → Phase 1:  ¬termination_intent → derive default' → cycle_n += 1             -- continue loop with next-cycle default
Phase 3 → converge (implicit): TerminationIntent = ImplicitTermination → implicit terminal carrier             -- Phase 2-surfaced default committed (NOT re-derived)
Phase 3 → Phase 4:  TerminationIntent = ExplicitTermination                                 -- user-judged satisfaction with explicit residual classification request
Phase 4 → converge: Λ.final_gate_answers covers Λ.residual → Phase 4 terminal carrier                              -- complete final map; convergence reads it for the final BoundaryEssence and trace

── TERMINAL CARRIERS ──
Every graceful path produces B_final from the classified B and its terminal answer. These operations return the complete result; they do not replace B with a rendered view or rewrite the cycle partitions.

Path                         | Source and accepting ground                                      | Result
Phase 3 ImplicitTermination  | B after the current fold + residual; disposition is the user's override when stated, otherwise the proposal displayed in that round | finalize(B, residual, disposition) = B ∪ { d ↦ disposition | d ∈ residual } → B_final
Phase 4 completed            | B + residual + final_gate_answers covering exactly residual        | bulk_classify(B, residual, final_gate_answers) = B ∪ final_gate_answers → B_final
Phase 1 substrate exhaustion | B at the guarded edge where residual = ∅                         | identity(B) → B_final

Each row preserves every classified entry and fills only the residual. A typed answer in the terminating round is already in B; a termination-only anchor is in residual. Emit DefinedBoundary = { map: B_final, kind: captured_kind }; snapshot is never a terminal source.

── LOOP ──
Pre-loop dispatch (Phase 0b, one-shot — runs once before the per-cycle loop opens):
  sync_kind_route(T) surfaces the KindRouteMap (every recognition seed + emergent/naming path); the user captures the kind (recognize a seed, name an emergent, or extend/replace a seed).
  Extension fast-path (single-dominant-kind relay): when single_dominant_kind(KindRouteMap, T, context) holds (per the single_dominant_kind predicate (TYPES) and `Option-set relay test`) — present the captured kind + its basis as relay text and proceed (the captured kind is committed for the activation), recording Λ.captured_kind with ZERO turn yields. The basis is the dominating predicate + the foils' route-away on the seed route, and the user's own naming quoted verbatim on the emergent route. The mandatory Constitution gate fires when single_dominant_kind is false — the default when in doubt; relay is the NARROW exception (`Option-set relay test`).
  bind_kind → certify (fail-closed) → init_loop_state. The captured kind fixes the boundary question for this activation; every cycle uses the same BoundaryClassification answer forms. BOTH branches (relay and gate) feed this same pipeline — the relay collapses only the kind-capture turn yield; a non-pass certificate still gets the full gated treatment. Re-sync on a non-atomic kind; put an unattributed ambiguous certificate to Qa; route_away (deactivate) on local route fit or the user's Route(d).

J = {next, terminate_implicit, terminate_explicit}
  (every value read below is the CONFIRMED one — a parse leaving ≥2 routing branches viable is resolved to a single branch via `Ambiguous response routing`'s one-turn confirmation gate at Phase 3 step 1 BEFORE J is evaluated, and a confirmed `next` is the absence of a TerminationIntent rather than a member of it; routing here is immediate only for an unambiguous parse)
  next:               ¬termination_intent → next-cycle default' (= propose_default(T, captured_kind, context), with the current contextual basis) → cycle_n += 1, Phase 3 → Phase 1 (per-cycle re-scan)
  terminate_implicit: TerminationIntent = ImplicitTermination (parsed from Phase 2 free response) → Phase 3 → converge with residual filled by default_at_surfacing (the Λ.default_for_residual value Phase 2 surfaced — NOT re-derived) or user-stated override; a termination-only response (no typed selection) first residualizes the current anchor (Phase 3 step 2), so it is included in that fill
  terminate_explicit: TerminationIntent = ExplicitTermination (parsed from Phase 2 free response) → Phase 3 → Phase 4 (final gate)

Per-cycle re-scan: Phase 1 re-executes Ctx under its current-ground eligibility rule (TYPES), then reconciles its candidates before checking exhaustion. domains_touched records identity; D_history records visits. Neither excludes a domain whose ground has changed, and unchanged ground alone earns no repeat.
Cycle 1 ordering: AI Impact ordering selects highest-impact domain.
Cycle k≥2 ordering: previous cycle's typed_A[cycle_n-1] or free-response routes next cycle's domain selection frame; AI re-applies Impact ordering within the routed frame.

Answer types (members of the uniform disposition BoundaryClassification: UserSupplies/AIPropose/AIAutonomous/Dismiss) determine BoundaryMap entry, not loop path.
FinalGateDisposition (the uniform subset {UserSupplies, AIPropose, AIAutonomous} ⊆ BoundaryClassification, every kind) determines residual BoundaryMap entries at Phase 4.

The classified map and residual remain disjoint throughout the loop. Each gate's snapshot shows what its current default would settle; each terminal row supplies the accepting act and the complete result. No intermediate display constitutes a DefinedBoundary.

Convergence evidence: report every domain in B_final exactly once, with its final disposition and settling basis.
  • For a domain with anchored visits, group its evidence-bearing D_history entries in cycle order and show the final disposition from B_final with its setting source or terminal accepting answer. Repeated visits expose the changed ground and any superseded judgment; they do not create duplicate final entries.
  • For an unanchored domain still in context_resolved, cite its current source-backed seed basis.
  • For every other unanchored domain, read its disposition from the terminal answer: the displayed proposal and accepting response or explicit override on implicit finish, or final_gate_answers on Phase 4 completion.
The domains in these parts equal dom(B_final). A substrate-exhaustion scan contributes no D_history entry. On every graceful exit, compute boundary_readout(B_final, ∅, captured_kind, context) and present it as the separate BoundaryEssence artifact alongside the trace. This includes exhaustion without an anchored cycle. Convergence is demonstrated, not asserted.

── CONVERGENCE ──
converge iff (Phase 3 ImplicitTermination ∨ Phase 4 completed ∨ substrate_exhaustion_empty_residual) ∧ status(certificate) = pass
  certificate gate:            convergence presupposes a passing DeficitFitCertificate (Phase 0b); a route certificate, or an ambiguous one the user left unattributable, never reaches the loop, and an ambiguous one reaches it only on the user's Own attribution — so DefinedBoundary is unreachable without an in-scope, fit-certified kind, certified on the evidence or on the user's word. The pass certifies LOCAL admissibility — bound's own gate over bound's own activation — not the absence of a claim anywhere in the wider protocol set
  kind_dispatch_branch:        the captured kind reaches the loop via EITHER branch of Phase 0b sync_kind_route — the single_dominant_kind relay (extension, no turn yield) or the mandatory Constitution gate — and both flow through the fail-closed certificate, so convergence is branch-invariant: a relay-captured kind whose certificate is route (routes away/deactivates) or ambiguous (goes to Qa, and reaches the loop only on an Own attribution) is handled exactly as the gated branch's is
  unattributable_deactivate:   Phase 0b Attribution = Unattributable → relay the finding, non-convergent exit (no DefinedBoundary emitted; the evidence did not settle the certificate and the user did not settle it either — reported, never silently bound or silently dropped)
  Phase 3 ImplicitTermination: the Phase 3 ImplicitTermination row in TERMINAL CARRIERS completed
  Phase 4 completed:           the Phase 4 row in TERMINAL CARRIERS completed — reachable via Phase 3 ExplicitTermination OR Phase 1 substrate exhaustion with residual remaining
  substrate_exhaustion_empty_residual: the substrate-exhaustion row in TERMINAL CARRIERS completed under Sub-D empty ∧ Λ.residual = ∅
  route_deactivate:            Phase 0b status(certificate) = route → route_away(routed_deficit(certificate)); non-convergent exit on local route fit or the user's Route(d), no DefinedBoundary emitted

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Probe (sense)        → Internal analysis (silent — no user output; heuristic boundary-undefined detection + session-context scan for a prior BoundaryMap as Λ.B_prior (DETECTION only — Phase 0 seeds nothing; seed_prior reads applicability at Phase 0b loop-state initialization); notice visibility deferred to Phase 2 cycle 1 surfacing)
Phase 0 ZeroSignalConfirm (constitution) → present (conditional: Bᵢ = ∅; zero-signal finding + reasoning; Confirm/Reopen(Domain) — `Zero-signal surfacing`)
Phase 0b sync_kind_route (constitution) → present (GATED branch — fires when single_dominant_kind = false: ≥2 seeds stay viable under the framing, a seed's route-away is undecidable from the framing, an emergent gesture resolves to no single naming, OR the live ground (T, context) leaves the emergent question undetermined; up-front KindRouteMap — one hypothesis for every recognition seed, each with positive_predicate + evidence + differential_future + route-away conditions, plus an emergent/naming free-response path; named kinds are PRIORS not a closed set; user captures the kind by recognizing a seed, naming an emergent, or extending/replacing a seed)
Phase 0b sync_kind_route_relay (extension) → TextPresent+Proceed (RELAY branch — fires when single_dominant_kind = true, per the single_dominant_kind predicate (TYPES) and `Option-set relay test`. Present the captured kind + its basis as relay text — the basis quotes the user's own wording rather than paraphrasing it wherever the emergent conjunct carried the decision, and quotes it VERBATIM when the relay fires because the user already named the emergent kind, since there that wording IS the capture — and proceed, recording Λ.captured_kind WITHOUT a turn yield; the captured kind is committed for the activation (like the gated branch) — a rare mis-relay is corrected by re-invoking /bound, not an in-loop redirect transition. The fail-closed certify STILL runs on this branch — route → route_away/deactivate, ambiguous → Qa — so the relay never bypasses deficit-fit)
Phase 0b certify (track)     → Internal state update (fit KindBinding.positive_predicate against own_claim and the inscribed route_claims only, construct the complete DeficitFitCertificate with attribution := certificate(S), where S is the locally supported claim set, and store it in Λ.certificate before any status read. The cited fit is shown at Phase 2 cycle 1 on pass, at route_away on route, or at Qa on ambiguous)
Phase 0b Qa (constitution)   → present (conditional: status(certificate) = ambiguous ∧ certificate.attribution = certificate(S). Presents, as text before the gate, the captured kind, its evidence with its channel, and what the certificate found — the claims that evidence supports, or that none does; the gate itself carries the question "whose is this?" and the Attribution options with their differential implications: the own claim → the boundary is defined here, the classification loop opens; each supported route claim → handed to that deficit, with the command hint this file inscribes for it, and this activation ends; none of these → the finding is relayed and this activation ends with no boundary defined. A deficit the user names outside the presented set is a Route(d) answer emitted bare. One turn, once: the user's attribution is written by attribute and read by every downstream reader of status(certificate). Constitution because the certificate has already said what the evidence settles, and what it does not settle is not the AI's to decide — `Ambiguity surfaces`)
Phase 0b attribute (track)   → Internal state update (apply attribute from TYPES after Qa's Stop; every status, claim projection, and route payload reads that one recorded attribution)
Phase 0b unattributable_deactivate (extension) → TextPresent+Proceed (conditional: Attribution = Unattributable → relay the finding — the captured kind, the claims its evidence supported, what the user saw as unresolved — and deactivate; no DefinedBoundary, no classification loop opened)
Phase 0b seed_prior (observe) → record read, artifact read (after status(certificate) = pass: read the detected prior's setting record and authorized revisions; derive the classified B and unclassified B_seed by seed_prior. An unavailable source supplies no classification; preserve its still-relevant domain for grounding and classification. No Λ mutation occurs until init_loop_state)
Phase 0b init_loop_state (track) → Internal state update (execute the initialization assignments in PHASE TRANSITIONS from the seed_prior pair and initial propose_default judgment)
Phase 0b route_away (extension) → TextPresent+Proceed (on a route certificate or Attribution = Route(d), emit the routed deficit and its cited fit or user-attribution basis, with the command hint inscribed here when available; then deactivate without DefinedBoundary. A user-named deficit with no inscribed hint is emitted bare)
Phase 0b/3 propose_default (sense) → Internal analysis (propose a residual disposition from the current boundary, its limits and the accumulated context; cite the basis at the next Phase 2 surfacing. Initialization supplies the first proposal; continuation supplies the next. The accepting response commits the already-displayed proposal, never a later re-derivation)
Phase 1 Ctx   (observe)      → artifact read, artifact search (per-cycle re-scan: CLAUDE.md, project rule files, prior session context)
Phase 1 reconcile_candidates (track) → Internal state update (execute PHASE TRANSITIONS' candidate withdrawal, residual retention, seed consumption, and anchor selection before the auto-resolve check and any gate view)
Phase 2/4/convergence boundary_readout (observe) → record read, artifact read (read the current map and pending set at Phase 2 and Phase 4, or B_final and an empty pending set at convergence, with their setting sources; when those sources are already in context, read them there. Produce the current BoundaryEssence before the associated gate or final presentation; no state mutation)
Phase 2 Qc    (constitution) → present (mandatory; per-cycle classification over BoundaryClassification + captured-kind label + current BoundaryEssence from boundary_readout + cycle_n + B_snapshot computed by snapshot(B, Λ.residual, default_for_residual) for this presentation, including the first gate, without Λ mutation + current default_for_residual with contextual basis cite + cycle-1 certificate-fit basis + cycle-1 notice of the dispositions seed_prior admitted with their current cited basis, unresolved prior domains retained as candidates, and excluded remembered dispositions as advisory + free-response termination affordance with implicit/explicit sub-signals)
Phase 3 parse  (sense)       → Internal analysis (conservative whole-utterance recognition with no Λ mutation: return typed_A? + TerminationIntent only when the reading accounts for all decision-relevant meaning in A; otherwise return no commitment and let Phase 2 re-present directly from A)
Phase 3 confirm_intent (constitution) → present (conditional: a parse leaving ≥2 J routing branches viable — present the candidate readings that parse actually left open (ImplicitTermination committing residual at default_at_surfacing | next continuing to the following cycle | ExplicitTermination proceeding to Phase 4), each with its differential future, and Stop; the user's confirmation or correction routes the loop at J — `Ambiguous response routing`)
Phase 3       (track)        → Internal state update (execute PHASE TRANSITIONS' integrate, partition filing, and classified-map write. On continuation store the next propose_default result; a terminal response retains the displayed proposal)
Phase 4 Qf    (constitution) → present (current BoundaryEssence followed by residual bulk classification over FinalGateDisposition = {UserSupplies, AIPropose, AIAutonomous}, every kind; reached via ExplicitTermination or substrate exhaustion)
Phase 4       (track)        → Internal state update (bind the complete final_gate_answers map)
terminal_map  (sense)        → Internal analysis (apply the guarded TERMINAL CARRIERS row to derive B_final from B, residual, and the actual accepting answer; no gate view or cycle-state mutation)
converge      (extension)    → TextPresent+Proceed (captured-kind + DeficitFitCertificate basis + domain-grouped transformation trace + boundary_readout of B_final as the BoundaryEssence artifact; proceed with defined boundary)
Seam transition to declared next protocol (extension) → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol settles the next move — proceed directly to it, citing that settling source. This protocol declares no wired outbound continuation edge: status(certificate) = route is a pre-loop route-away, selected by a local claim or the user's Route(d), that deactivates before any DefinedBoundary, not a post-convergence handoff, so the second trigger is vacuously absent. Every Constitution gate inside this protocol and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = { phase: Phase, T: TaskScope,
      kind_route_map: Optional(KindRouteMap),          -- Phase 0b dispatch sync (every recognition seed + emergent path)
      captured_kind: Optional(Kind),                   -- the kind the dispatch settled on (recognize-seed | name-emergent | extend/replace-seed); set via the single_dominant_kind relay (extension, no turn yield) OR the mandatory Constitution gate
      kind_binding: Optional(KindBinding),             -- fields: label, positive_predicate, evidence, atomicity
      certificate: Optional(DeficitFitCertificate),    -- local evidence or user Attribution; TYPES defines its pure projections
      B_prior: Optional(SeededPrior),                  -- prior map and kind detected before dispatch
      B_seed: Set(Domain),                            -- known unresolved candidates awaiting the first scan
      cycle_n: Nat,
      domains_touched: Set(Domain),                   -- all recorded domain identities, including unanchored candidates
      D_history: List<Sub-D>,                         -- anchored visits, with the evidence read at each visit
      default_for_residual: BoundaryClassification member,  -- the current unaccepted proposal
      context_resolved: Set(Domain),                  -- classified from current source evidence
      user_responded: Set(Domain),                    -- classified by a Phase 2 answer other than Dismiss
      dismissed: Set(Domain),                         -- committed Dismiss answers, with their displayed-default basis
      residual: Set(Domain),                          -- recorded domains awaiting settlement
      boundary_map: BoundaryMap,                      -- canonical classified state; B aliases this field
      final_gate_answers: Map(Domain, FinalGateDisposition),
      active: Bool, cause_tag: String }
-- Invariant: domains_touched = context_resolved ∪ user_responded ∪ dismissed ∪ residual (pairwise disjoint)
--   Holds at each Phase 1 entry and after each Phase 3 fold. The selected anchor is the sole transient exception:
--   after reconcile_candidates and across Phase 2's Stop, it belongs to domains_touched and no partition;
--   integrate files it before any continuation or terminal. With no anchor there is no exception.
-- Invariant: dom(B) = context_resolved ∪ user_responded ∪ dismissed; dom(B) ∩ residual = ∅.
--   snapshot(B, residual, default) covers domains_touched except the current unclassified anchor, without mutation.
--   Every terminal produces dom(B_final) = domains_touched and preserves B's classified entries.

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
Dispatch-first rationale: BoundaryMap is a multi-consumer router. The captured kind must settle BEFORE the per-cycle loop opens — hence bound carries the up-front Phase 0b sync rather than emerging the kind cycle-by-cycle: downstream consumers reading a stable kind cannot tolerate a kind that shifts mid-loop. The DeficitFitCertificate (checked against the own claim and the route claims inscribed in this SKILL.md) keeps a misfit kind from entering the shared map — a kind a local route claim holds is routed away (deactivate) instead of polluting the multi-consumer signal. What a pass certifies is LOCAL admissibility, bound's own gate governing bound's own activation, not the absence of a claim anywhere in the wider protocol set: where two protocols' scopes both reach a situation, each protocol's own gate governs.
Hermeneutic carry-over (kind-aware): an optional B_prior input (prior BoundaryMap detected in session context, together with the kind it was produced over) seeds the new invocation ONLY when its kind matches the captured kind (same-kind — same boundary question). Every kind shares the uniform disposition, so a mismatched prior's values are type-compatible; the guard is SEMANTIC: a kind-mismatched prior answers a DIFFERENT boundary question, so it is surfaced as advisory context, NOT seeded into boundary_map (seeding it would commit a wrong-question disposition into the multi-consumer signal). Seed entries are mutable in subsequent cycles; each BoundaryEssence reads the current arrangement. Read every candidate seed against its boundary-setting source and later authorized revisions through seed_prior; remembered entries alone establish no current authority.
Round-local BoundaryMap composition: each Phase 2 snapshot exposes classified entries and proposed residual dispositions for recognition; downstream consumers read the finalized DefinedBoundary with its setting record. AIPropose permits proposal work and leaves selection with the retained judgment; AIAutonomous permits the scoped choice. Neither the snapshot nor completion of delegated work supplies a missing boundary-setting act.
```

## Mode Activation

`/bound` remains directly invocable. During AI-guided activation, loaded safety boundaries, capability restrictions, and explicit user instructions continue to bind.

### Activation exceptions

Skip AI-guided activation when the current message or project rules already settle the boundary, when the user explicitly requests proceeding without boundary settlement, when the same domain and description were dismissed in this session, or when the task has one obvious boundary. A zero-signal probe still presents its finding and reasoning for correction.

Heuristic detection may use multiple unsettled decision areas, delegation uncertainty, a preceding protocol's boundary signal, or a possibly stale prior BoundaryMap. These are discovery cues rather than additional activation predicates.

## Protocol

### User-facing realization

At kind dispatch, render each viable seed as a positive hypothesis with its cited evidence, differential future, and route-away condition, while keeping an open naming path for an emergent kind. On the single-dominant relay, present the captured kind and basis without a turn yield; when the user's wording itself names an emergent kind, carry that wording verbatim. A route certificate surfaces its deficit and basis before deactivation. A compound kind splits and re-synchronizes before certification. When the certificate cannot say whose the kind is, put it to the user before anything binds: show the kind, its evidence, and which of the inscribed claims that evidence supports — or that none does — then ask whose it is, one option per supported claim (define the boundary here / hand it to that protocol, with its command hint where one exists / none of these, recorded and this activation ends). An answer here says whose the kind is and nothing about how its domains classify. Do not re-synchronize on ambiguity alone and do not drop an ambiguous kind without this question — a kind the certificate could not place is the user's to place.

At each classification round, use everyday language to place the anchor domain beside its evidence, a BoundaryEssence read from the current classified map and pending domains, the complete BoundaryMap snapshot, and the residual default with its derivation. Materialize the uniform dispositions for the captured kind as below. For ownership, name the domain decision directly; use allocation language only when the source made allocation itself the question:

- **I'll supply it** — the user supplies the boundary value.
- **Draft options for me** — AI proposes candidates for the user to choose or steer.
- **Decide within this scope** — AI resolves the boundary within the stated limits.
- **Use the stated default** — commit the displayed residual default.

Keep the satisfaction affordance outside that option set: the user may finish with the displayed default, finish with a stated override, continue to another cycle, or request the residual review. When one response supports several of those futures, present only the live readings and their consequences, then yield before routing.

Identify the current source-backed dispositions seed_prior admitted as mutable map entries, citing any authorized revision that changed them. Distinguish unresolved prior domains retained in B_seed from remembered dispositions kept only as advisory; no revised domain depends on rediscovery. At the final residual review, render the active typed dispositions in the same domain-specific language and keep downstream value provision lazy.

Read `references/round-composition.md` before composing when terminology must remain stable across the session, wording must be carried unchanged, material belongs to another round or trace, or phase order determines whether text belongs before or inside a gate.

### Intensity

| Level | When | Format |
|-------|------|--------|
| Light | One localized boundary | Concise evidence, current default, and materialized dispositions |
| Medium | Several related boundaries | Current map, essence, evidence, and one anchored classification |
| Heavy | High-impact or conflicting boundaries | Detailed cited evidence, route-away distinctions, and residual consequences |

## Rules

- **Recognition over Recall**: Present structured options with anticipatable post-selection states.
- **Round composition**: Keep each judgment beside its nearest evidence and next-move implication, and place analytical context before the gate.
- **Dynamic rendering**: Treat named kinds as recognition priors rather than a closed taxonomy; keep the emergent naming path visible wherever no single kind dominates.
- **Prior-map provenance**: Read a same-session Horismos result against its setting record and later authorized revisions before seeding. Seed current supported dispositions in B; keep still-relevant same-kind domains without a settled disposition in B_seed, even when Ctx does not rediscover them. Reconcile current-ground candidates in Phase 1 before any gate or exhaustion check. A remembered disposition with unreadable decision-bearing source remains advisory; current source exclusions and the captured kind bound what enters either carrier.
- **Settlement across delegation**: Read the map with the reachable record that settled its boundary question, limits, and retained or entrusted judgment. Cite that source when passing or consuming the map; use the source wording where its meaning determines authority. Reassignment of work preserves those limits. A source that cannot be recovered leaves the affected decision unresolved, while independent work can continue.
- **Zero-signal surfacing**: Present a zero-signal finding with its reasoning and a path for the user to reopen a missed domain.
- **Free-response separation**: Keep satisfaction, default override, and residual-review signals outside the typed classification options; a termination-only response adds no classification constructor.
- **Default visibility**: Propose the residual default from the current boundary and context, and surface its basis before every classification gate. An implicit finish commits the value displayed in that round only when the whole response supports that commitment; an override remains reachable in the same response. A provisional snapshot carries a proposal until that acceptance occurs.
- **Ambiguous response routing**: When a response supports several termination or continuation futures, present only those live readings with their consequences and yield before routing.
- **Option-set relay test**: Present a single dominant kind as Extension. Constitution hypotheses remain viable under different readings of the live ground, and off-axis responses remain free-response pathways.
- **Ambiguity surfaces**: A certificate whose locally computed fit is ambiguous is put to the user at `Qa` with the claims its evidence supports, before any classification loop opens. The user's Attribution control form — Own, Route(d), or Unattributable — determines pass, route, or the unattributable exit; retain that form even when a route label matches the own claim; the certificate never binds or drops a kind it could not place, the AI takes no second look at ground that has not moved, and ambiguity alone never re-synchronizes the dispatch.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change the form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
