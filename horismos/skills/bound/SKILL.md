---
name: bound
description: "Define epistemic boundaries per decision. Fires when a decision's direction, scope, type, or ownership is undefined. Type: (BoundaryUndefined, AI, DEFINE, TaskScope) → DefinedBoundary"
---

# Horismos Protocol

Define epistemic boundaries per decision through AI-guided classification. Type: `(BoundaryUndefined, AI, DEFINE, TaskScope) → DefinedBoundary`.

## Definition

**Horismos** (ὁρισμός): A dialogical act of proactively defining epistemic boundaries per decision, where AI probes for boundary-undefined domains, dispatches the boundary **kind** up-front (a KindRouteMap of recognition seeds — direction/priority, scope, type/concept, ownership — plus an emergent/naming path) through a fail-closed deficit-fit certificate, collects contextual evidence to enrich classification quality, and presents each domain for user classification by a **uniform settlement disposition** (user-supplies / AI-proposes / AI-autonomous / dismiss) into a BoundaryMap consumed by all downstream protocols. The disposition coproduct is the same for every kind — the captured kind sets WHAT boundary is being settled, the disposition sets HOW that boundary value is settled downstream. **Ownership** is one kind among the seeds (who decides), and it is the *degenerate* case where the boundary value being settled is itself the disposition — so for ownership, content and disposition coincide; for every other kind they separate cleanly.

```
── FLOW ──
Horismos(T, B_prior?) → Probe(T) → Bᵢ? →
  |Bᵢ| = 0: Qc(zero_signal_finding) → Stop → [Confirm: deactivate | Reopen(d): Bᵢ := {d}, proceed]      -- zero-signal gate (`Zero-signal surfacing`)
  |Bᵢ| > 0: Phase 0b sync_kind_route(T) → KindRouteMap →                                            -- up-front KIND dispatch (dispatch-first: kind settles before downstream consumers read it)
    [single_dominant_kind(KindRouteMap, T, context): relay(captured_kind + basis) (extension) → proceed (kind committed)   -- entropy→0 fast-path (option-set relay test): one kind dominates, foils route away → NO turn yield
     | else: Stop → captured_kind (constitution)]                                                   -- ≥2 viable hypotheses ∨ undecidable foil ∨ emergent gesture naming no single kind ∨ live ground leaves the emergent question undetermined → mandatory Constitution gate
    bind_kind(captured_kind) → KindBinding                                                           -- {label, positive_predicate, evidence, atomicity}; non-atomic → split/route, re-sync before continuing
    certify(KindBinding, local_claims) → DeficitFitCertificate                                         -- fail-closed: status(certificate) ≠ pass BLOCKS value-space binding (split / route claim / narrow-disambiguation first)
      status(certificate) = route:      → route_away(routed_deficit) → deactivate (a local route claim holds the kind; no DefinedBoundary)
      status(certificate) = ambiguous ∨ non-atomic: → re-sync Phase 0b (split / route / narrow-disambiguation) → re-certify
      status(certificate) = pass:       → bind_value_space → BoundaryClassification                                  -- the uniform settlement-disposition coproduct, generated ONLY after certificate passes (same codomain for every kind; captured kind sets each option's content, not the coproduct)
    init_loop_state: cycle_n=1, BoundaryEssence="", B = seed_if_kind_match(B_prior, captured_kind), B_seed = Bᵢ (seed only when kind(B_prior) = captured_kind; kind-mismatched prior map → advisory, NOT seeded — see seed_if_kind_match; B_seed carries the Phase 0 domain signal — incl. the zero-signal Reopen(d) seed {d} — as unclassified cycle-1 anchor candidates (non-anchored remainder residualizes at the Phase 1 residualize), never unioned into the classified map B), default=DefaultClassification(MixedTrend), EssenceTrend(history)=MixedTrend at init since cycle_n < 2 (kind-general — the per-cycle disposition-trend machinery runs for every kind), loop:
    Phase 1 Ctx(T, cycle_n) [per-cycle re-scan] → (Sub-D[cycle_n], auto_resolved?) →
      Sub-D empty ∧ residual ≠ ∅: → Phase 4 (substrate exhausted, residual remains)
      Sub-D empty ∧ residual = ∅: → TERMINAL CARRIERS (Phase 1 row) → DefinedBoundary → converge (substrate exhausted, all surfaced domains classified — no empty Phase 4 gate)
      auto_resolved: → Phase 3 (skip Phase 2 for this cycle; no user A — the substrate-settled classification is carried into Phase 3)
      else:          → Phase 2
    Phase 2 Qc(Sub-D[cycle_n], kind, BoundaryClassification, BoundaryEssence, cycle_n, B_snapshot, default) → Stop → A
    Phase 3 (user-response: conservative parse(A) → (typed_A?, TerminationIntent?) — a commitment is recognized only when the whole response's decision-relevant meaning supports that reading; otherwise Phase 2 re-presents from A with the map unmutated; auto-resolved: typed_A = substrate-settled classification, no TerminationIntent) →
      integrate(typed_A?, B, BoundaryEssence) → (B', Δessence)                                      -- total current-cycle fold: classification updates the anchor; termination-only residualizes it and returns B' = B with the empty delta
      crystallize(Δessence, BoundaryEssence) → BoundaryEssence'                                      -- sole producer of the accumulated essence; the empty delta is the identity
      refresh B'-snapshot with the current default_for_residual                                       -- BEFORE the branch below, on EVERY fold including a terminating one: a just-residualized anchor gets its provisional entry here, so every route below reads a complete map
      ImplicitTermination: → TERMINAL CARRIERS (Phase 3 row) → DefinedBoundary → converge
                            -- "default" is Λ.default_for_residual at entry to Phase 3 (the value Phase 2 surfaced); NOT re-derived
      ExplicitTermination: → Phase 4
      else:                → DefaultClassification(EssenceTrend(history')) → default' for NEXT cycle (kind-general; count-only over the uniform disposition) → re-snapshot with default' → cycle_n += 1, loop
  Phase 4 (optional path) Qf(residual, FinalGateDisposition) → Stop → TERMINAL CARRIERS (Phase 4 row) → DefinedBoundary

── MORPHISM ──
TaskScope, B_prior?
  → probe(task, context)                                           -- detect boundary-undefined domains
  → sync_kind_route(task, context) → KindRouteMap                  -- up-front dispatch: one hypothesis for every recognition seed (direction/priority, scope, type/concept, ownership) + emergent/naming path; each seed hypothesis carries positive_predicate, evidence, differential_future, route_away conditions
  → [single_dominant_kind: relay(captured_kind) (extension) | else: present(KindRouteMap) (constitution)]  -- option-set relay test over the kind hypotheses AND the live ground: one dominant kind (entropy→0) relays without a turn yield — either a seed (positive_predicate satisfied, foils' route_away hold, no emergent indicated) or an emergent kind the user's own wording already names unambiguously; ≥2 viable ∨ undecidable foil ∨ an emergent gesture naming no single kind ∨ an emergent question the live ground leaves undetermined gates. BOTH branches feed bind_kind → certify → bind_value_space (certificate fail-closed on both)
  → bind_kind(captured_kind) → KindBinding                         -- {label, positive_predicate, evidence, atomicity}; non-atomic kind → split or route before continuing
  → certify(KindBinding, local_claims) → DeficitFitCertificate         -- {own_claim, route_claims[], claimed_by, evidence}; fail-closed — status(certificate) ≠ pass BLOCKS bind_value_space; fits the captured kind's positive_predicate against the own claim and the route claims inscribed in THIS SKILL.md
  → bind_value_space → BoundaryClassification                     -- the uniform settlement disposition {UserSupplies, AIPropose, AIAutonomous, Dismiss}, generated ONLY after certificate passes; same codomain for every kind (kind sets each option's content); relay / dead-signal test applied; frozen for the activation
  → seed(B_prior, B)                                               -- hermeneutic carry-over at Phase 0b step 4 (AFTER bind_value_space + B init): optional prior BoundaryMap seeds the freshly-initialized B ONLY when kind(B_prior) = captured_kind (same-kind — its dispositions were settled over the SAME boundary question). Values are always type-compatible now (every kind shares BoundaryClassification), so the guard is SEMANTIC: a kind-mismatched prior answers a DIFFERENT boundary question (e.g. an ownership prior's "AIAutonomous" decided who-owns, not how-wide a scope is) and is surfaced as advisory context, NOT seeded. Seeded domains enter `context_resolved` partition with "prior classification" basis (entries mutable in subsequent cycles). Phase 0 only DETECTS B_prior (binds Λ.B_prior together with its kind); it does not seed B, which does not exist until loop-state init
  → enrich(domains, codebase, cycle_n)                             -- per-cycle context collection (re-scan)
  → classify(domain, as_inquiry) → typed_A ∈ BoundaryClassification               -- per-cycle object_ref(kind) classification by the uniform settlement disposition (the captured kind sets the content of each disposition option; the 4-value coproduct itself is kind-invariant)
  → integrate(typed_A?, B, BoundaryEssence) → (B', Δessence)       -- total current-cycle fold; does NOT update default_for_residual
  → crystallize(Δessence, BoundaryEssence) → BoundaryEssence'      -- sole producer of the accumulated essence; the empty delta is the identity
  → snapshot(B', residual, default_for_residual) → B_complete'     -- refreshed after EVERY fold, termination included, and BEFORE any terminal route below: this is what gives a just-residualized anchor its provisional entry — classified entries ∪ (residual ↦ default_for_residual), at the value Phase 2 surfaced
  → DefaultClassification(EssenceTrend(history')) → default'                      -- count-based EssenceTrend → DefaultClassification for NEXT cycle's residual (runs on loop continuation ONLY; count-only over the uniform disposition, so the derivation is kind-general — it reads disposition counts, never kind-specific content)
  → snapshot(B', residual, default') → B_complete''                -- continuation only: supersedes B_complete' for the cycle about to open
  → [finalize | bulk_classify | identity] → Λ.boundary_map         -- terminal operation selected by the reachable convergence path; source, write, and final value are defined once in TERMINAL CARRIERS
  → DefinedBoundary
requires: boundary_undefined(T)            -- runtime checkpoint (Phase 0); sole activation precondition. (status(certificate) = pass is the Phase-0b value-space-BINDING gate, NOT an activation precondition — it lives in the certificate-before-binding invariant below and the Phase 0b → Phase 1 transition; route/ambiguous status routes/re-syncs inside Phase 0b rather than blocking activation.)
deficit:  BoundaryUndefined                -- activation precondition (Layer 1/2); the certificate's own_claim deficit for in-scope kinds
preserves: task_identity(T)                -- task scope invariant; BoundaryMap and BoundaryEssence mutated; B_prior seed entries are mutable across cycles
invariant: Definition over Assumption
invariant: certificate-before-binding      -- status(certificate) = pass strictly precedes bind_value_space (shared meta-backbone order)

── TYPES ──
T              = TaskScope (task/project requiring boundary definition)
B_prior        = Optional(SeededPrior)                        -- optional invocation seed for hermeneutic carry-over (prior BoundaryMap detected in session context). Seeded into B at Phase 0b step 4 ONLY when the prior map's kind matches the captured kind (same-kind — same boundary question). The guard is SEMANTIC, not type-based: every kind shares BoundaryClassification, so a mismatched prior's values are type-valid but answer a DIFFERENT boundary question, so a kind-mismatched prior map is surfaced as advisory context, NOT seeded as a structural entry. Seed entries are mutable across cycles
SeededPrior    = { map: BoundaryMap, kind: Kind }             -- the prior BoundaryMap together with the boundary kind it was produced over (Phase 0 step 3 detection binds both). The carried kind is the typed carrier the same-kind guard tests: kind(B_prior) ≡ B_prior.kind
seed_if_kind_match : (Optional(SeededPrior), Kind) → BoundaryMap  -- seeds the prior map ONLY when B_prior.kind = captured_kind (returns B_prior.map); a kind-mismatched prior (B_prior.kind ≠ captured_kind) or B_prior = ⊥ returns ∅ (a mismatched prior is surfaced as advisory, not seeded)
Probe          = T → Set(Domain)                              -- boundary-undefined domain detection (Phase 0; existence check, not exhaustive enumeration)
Domain         = { name: String, description: String, evidence: Set(Evidence) }
Evidence       = { source: String, content: String }
Bᵢ             = Set(Domain) from Probe(T)                    -- initial boundary-undefined domain signal (cycle 1 seed: formally carried into Phase 0b loop-state init as Λ.B_seed = Bᵢ, kept separate from the classified map B until classification — on zero-signal Reopen(d), Bᵢ = {d} is the one entry the Phase 1 re-scan cannot be assumed to re-derive)
ZeroSignalConfirmation = user's answer to a zero-signal finding ∈ {Confirm, Reopen(Domain)}  -- Confirm accepts no boundary-undefined signal (`Zero-signal surfacing`); Reopen names a domain Probe(T) missed, seeding it into Bᵢ and proceeding

-- Shared meta-backbone (KIND dispatch). One canonical schema; bound-local instantiation ONLY for object_ref, local_value_space, the label field's type (Kind), the own claim, and the local route claims.
KindRouteMap   = sync_kind_route : (T, context) → { hypotheses: List<KindHypothesis>, emergent: NamingPath }
                                                              -- up-front dispatch sync surfaced at Phase 0b; hypotheses contains one carrier for every recognition seed (direction/priority, scope, type/concept, ownership), while the emergent/naming path keeps the kind open beyond those priors
KindHypothesis = { label: Kind, positive_predicate: String, evidence: Set(Evidence), differential_future: String, route_away_if: String }
                                                              -- each named kind is a PRIOR (recognition seed), NOT a closed coproduct member (`Dynamic rendering`: no fixed taxonomy)
NamingPath     = free-response affordance for a kind not among the seeds (emergent capture; user names the kind, or extends/replaces a seed)
single_dominant_kind : (KindRouteMap, T, context) → Bool      -- option-set relay test (entropy→0 predicate): true iff the live ground determines EXACTLY ONE kind, by either route — (a) SEED: exactly one hypothesis has its positive_predicate unambiguously satisfied by the framing, every other hypothesis' route_away_if holds, and (T, context) indicates no emergent capture; or (b) EMERGENT: (T, context) names exactly one emergent kind unambiguously, which IS the capture — the naming already happened in the user's own words, so gating it would ask for a value the live ground has settled. The seed conjuncts read KindRouteMap, which carries every recognition seed; the emergent conjunct turns on what the framing DENOTES, so it resolves against (T, context) — the user's own wording and the accumulated context — and the seed summary never stands in for it, because a summary cannot carry a branch whose decision rests on an unresolved denotation. An undecidable route_away_if, an emergent gesture resolving to no single naming, OR an emergent question (T, context) leaves undetermined makes the predicate false. true ⟹ the dispatch sync RELAYS the captured kind without a turn yield (Phase 0b sync_kind_route_relay, extension), citing its basis in the user's own wording — verbatim on route (b), where that wording IS the capture and a paraphrase would substitute the AI's reading for it; false ⟹ the mandatory Constitution gate fires (≥2 viable kind hypotheses, an undecidable foil, an emergent gesture naming no single kind, or an emergent question the live ground leaves undetermined). The captured kind still flows through bind_kind → fail-closed certify → bind_value_space on BOTH branches — the relay collapses only the kind-capture turn yield, NEVER the certificate (a non-pass certificate gets the full gated treatment — route → route_away/deactivate, ambiguous → re-sync the gate)
Kind           = captured boundary kind (seed ∈ {direction/priority, scope, type/concept, ownership} | emergent)
                 -- object_ref(kind) : the anchor the loop classifies (= Domain for bound, every kind; bound-local instantiation point — the kind sets WHAT the Domain's boundary is about, not the anchor type)
KindBinding    = { label: Kind, positive_predicate: String, evidence: Set(Evidence), atomicity ∈ {atomic, non-atomic} }
                 -- captures the kind; if atomicity = non-atomic → split or route BEFORE certify (no value-space binding on a compound kind)
Deficit        = a deficit label a kind may be claimed by — bound's own BoundaryUndefined, or one of the sibling deficits named in the route claims below. Every label this certificate can assign is inscribed in THIS SKILL.md; nothing outside this file supplies one
OwnClaim       = { deficit: BoundaryUndefined, resolution: DefinedBoundary, in_scope_if: String }
                 -- the claim bound makes, stated as the WHOLE local morphism: the deficit it takes AND the resolution it produces. A kind is claimed here when its positive_predicate instantiates BoundaryUndefined AND the local value-space can carry it to DefinedBoundary — the bare deficit label is a name, the morphism is the predicate
DeficitFitCertificate = { own_claim: OwnClaim, route_claims: List<RouteClaim>, claimed_by: Set(Deficit), evidence: Set(Evidence) }
                 -- fail-closed: status(c) ≠ pass BLOCKS bind_value_space. Generated by fitting KindBinding.positive_predicate against own_claim and every route_claim inscribed below — the certificate reads nothing outside this SKILL.md
                 -- claimed_by collects every claim the evidence supports; a SET, so "no claim holds" is the value ∅ rather than a hole in the type
status(c)      = pass if c.claimed_by = {BoundaryUndefined}; route if c.claimed_by = {d} with d a route_claim's routed_deficit; ambiguous otherwise
                 -- read off claimed_by rather than stored beside it, so no field can drift from the claim set it is determined by
                 -- pass: the own claim holds alone → bind_value_space
                 -- route: a single route_claim's routed_deficit d holds → emit d as the typed handoff, deactivate (kind is out-of-scope for bound)
                 -- ambiguous: |claimed_by| ≠ 1 — several claims hold, or none holds on the evidence at hand → split, route, or one-turn narrow disambiguation BEFORE binding values (never silently bind under ambiguity). Which of the three resolves it is read at that turn from the session's own context and the user's wording, never fixed here
                 -- what a pass certifies is LOCAL ADMISSIBILITY: bound's own gate governing bound's own activation, not the absence of a claim anywhere in the wider protocol set. Where two protocols' scopes both reach a situation, each protocol's own gate governs
RouteClaim     = (route_if_predicate: String, routed_deficit: Deficit)
                 -- bound-local route claims — the sibling deficits a boundary-misfit kind is handed to. routed_deficit is the BINDING field; the command in parentheses is a non-binding hint for the user, not the relation this guard composes on:
                 --   missing pre-execution fact            → ContextInsufficient       (hint: /inquire)
                 --   unnoticed decision gap (not a boundary-kind settlement) → GapUnnoticed             (hint: /gap)
                 --   framework absent for the decision      → FrameworkAbsent           (hint: /frame)
                 --   cross-domain mapping uncertain         → MappingUncertain          (hint: /ground)
                 --   direction candidates' futures unrecognizable from description → DirectionUnrecognizable  (hint: /preview)
local_claims   = (OwnClaim, the RouteClaim list above)      -- what certify reads beside the KindBinding; every claim it can fit is inscribed in THIS SKILL.md
V              = bind_value_space : Kind → ValueSpace         -- the kind is the DOMAIN (it selects each option's content), but the codomain is CONSTANT — bind_value_space returns the same coproduct for every kind; generated ONLY after status(certificate) = pass; frozen for the activation (relay / dead-signal test applied)
ValueSpace     = BoundaryClassification                       -- the uniform settlement disposition (local_value_space; bound-local instantiation point); the same coproduct for every boundary kind — see BoundaryClassification below
cycle_n        = Nat                                          -- current cycle counter (visible at Phase 2)
                                                              -- bound index `k` ranges over `Λ.D_history` (the cycles that produced a Sub-D) in the convergence trace — NOT [1, cycle_n], since a substrate-exhaustion terminal scan increments cycle_n without producing a Sub-D
Ctx            = (T, cycle_n) → Sub-D                         -- per-cycle context collection (re-scan)
Sub-D          = { domain: Domain, scan_summary: String, evidence: Set(Evidence) }  -- per-cycle dimension projection (one anchor domain per cycle)
                                                              -- Sub-D[k] = D_history[k] (k-th historical entry); current cycle = Sub-D[cycle_n]
Δessence       = String                                       -- per-cycle boundary-essence delta; produced by `integrate` at Phase 3 step 2 (integrate(typed_A?, B, BoundaryEssence) → (B', Δessence)); the termination-only fold produces the empty delta
BoundaryEssence = String                                      -- accumulated boundary essence (crystallized form of the responsibility boundary space); initialized "" at Phase 0b loop-state init; updated as BoundaryEssence' = BoundaryEssence ⊕ Δessence at Phase 3 by `crystallize` (crystallize(Δessence, BoundaryEssence) → BoundaryEssence'), the sole producer of BoundaryEssence'
EssenceTrend(history) ∈ {ExtensionTrend, ConstitutionTrend, MixedTrend}
                                                              -- kind-general: the disposition trend reads only the COUNT distribution of classified dispositions across Λ.history — never kind-specific content — so it runs identically for every captured kind
                                                              -- count-based ONLY; no textual-lean interpretation — keeps derivation deterministic and relay-eligible
                                                              -- ExtensionTrend: count(AIPropose ∪ AIAutonomous) strictly dominant
                                                              -- ConstitutionTrend: count(UserSupplies) strictly dominant
                                                              -- MixedTrend: no strict dominance OR cycle_n < 2 (explicit single-cycle initialization rule — insufficient classification history to commit a non-fallback trend)
DefaultClassification : {ExtensionTrend, ConstitutionTrend, MixedTrend} → {AIAutonomous, UserSupplies} ⊆ BoundaryClassification
                                                              -- kind-general per-cycle default re-derivation, applied to EssenceTrend(history') on loop continuation (reads disposition counts, kind-independent); DefaultClassification(MixedTrend) is the loop-state init value, since cycle_n < 2 there
                                                              -- codomain restricted to the 2-value reachable subset (AIPropose and Dismiss are unreachable from this function)
                                                              -- ExtensionTrend → AIAutonomous; ConstitutionTrend → UserSupplies; MixedTrend → AIAutonomous (Extension-default fallback)
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
                 -- value type is the uniform settlement disposition BoundaryClassification — the SAME value type for every kind (the BoundaryMap value does NOT follow the kind; the kind sets only what content each entry's disposition is about)
                 -- object_ref(kind) = Domain for bound, every kind (bound-local instantiation)
                 -- Always-complete after each Phase 2 round: classified entries (per-cycle answers + auto-resolved) ∪ residual entries provisionally mapped to current default_for_residual
                 -- Snapshot completeness makes ImplicitTermination AVAILABLE at any cycle; snapshots are recognition surfaces, while TERMINAL CARRIERS exclusively defines what convergence emits.
BoundaryClassification = {UserSupplies(boundary), AIPropose(boundary), AIAutonomous(boundary), Dismiss}
                 -- the UNIFORM settlement disposition (local_value_space): HOW the captured kind's boundary value is settled downstream — the SAME 4-value coproduct for every kind, used across Phase 2 (per-cycle) and Phase 4 (residual bulk)
                 -- the OWNERSHIP kind is the degenerate case: there the boundary value being settled (who decides) IS the disposition, so disposition and content coincide — which is why this coproduct historically read as ownership-specific. For every other kind the disposition says HOW the boundary value gets settled while the kind says WHAT that value is about (direction/priority, scope, type/concept)
                 -- UserSupplies semantic (kind-general): user retains settlement authority for this boundary; downstream gates present open questions; user supplies the boundary value (or invokes other protocols) at decision-point activation
                 -- Dismiss is a COMMITTED no-boundary signal (proceed with the stated default), an on-axis disposition — not a skip; its differential future is "residual settled by default," distinct from the three active-settlement members
Qf             = Final gate bulk classification interaction [Tool: Constitution interaction]
FinalGateDisposition = {UserSupplies, AIAutonomous} ⊆ BoundaryClassification    -- the uniform residual-disposition subset surfaced at Phase 4, the same for every kind (the two settlement dispositions a bulk residual can take)
                 -- Phase 4 UserSupplies (kind-general): bulk-classify residual domains as user-retained (each residual domain becomes its own boundary; lazy-binding — values or protocol invocation deferred to downstream activation)
                 -- Phase 4 AIAutonomous (kind-general): bulk-classify residual as AI-settled (semantically equivalent to per-cycle AIAutonomous(boundary))
DefinedBoundary = { map: Λ.boundary_map, kind: Λ.captured_kind } where one TERMINAL CARRIERS row completed ∧ BoundaryEssence finalized
                 -- TERMINAL CARRIERS is the exclusive provenance definition for the result map. The kind pairing makes the map's boundary question recoverable by a later /bound seed guard and by downstream advisory consumers because object_ref(kind) = Domain does not encode the kind.
Phase          ∈ {0, 0b, 1, 2, 3, 4}

── PHASE TRANSITIONS ──
Phase 0: T, B_prior? → Probe(T) → scan_B_prior(T) → Λ.B_prior → Bᵢ?                                           -- boundary existence checkpoint + optional hermeneutic-seed DETECTION (silent); detection binds Λ.B_prior but does NOT seed B — B does not exist yet (loop state, incl. boundary_map, is initialized at Phase 0b step 4 after the kind is captured and the certificate passes, since binding is gated on a passing certificate)
       [Bᵢ = ∅] Qc(zero_signal_finding) → Stop → ZeroSignalConfirmation   -- zero-signal (`Zero-signal surfacing`): Confirm → deactivate (Horismos not activated) | Reopen(d) → Bᵢ := {d}, proceed to Phase 0b [Tool]
Phase 0b: T → sync_kind_route(T) → KindRouteMap → [single_dominant_kind: relay(captured_kind + basis) → proceed (extension, kind committed, NO Stop) | else: Stop → captured_kind (constitution)]
       → bind_kind(captured_kind) → KindBinding
       → certify(KindBinding, local_claims) → DeficitFitCertificate
       → (status(certificate) = pass) bind_value_space → BoundaryClassification → init_loop_state(default_for_residual = DefaultClassification(MixedTrend), B = seed_if_kind_match(Λ.B_prior, captured_kind), B_seed = Bᵢ)
                                                                                                              -- up-front KIND dispatch + fail-closed certificate + uniform value-space, THEN loop-state init (cycle_n, BoundaryEssence, default_for_residual = DefaultClassification(MixedTrend), and the B_prior seed into B) — the seed folds into Phase 0b step 4, AFTER B is initialized, never before; seeded ONLY when kind(Λ.B_prior) = captured_kind (same boundary question), kind-mismatched prior map surfaced as advisory not seeded; Λ.B_seed := Bᵢ carries the domain signal as unclassified cycle-1 anchor candidates (non-anchored remainder residualizes at the Phase 1 residualize), separate from the classified map B (partition invariant preserved) — the formal carrier of the zero-signal Reopen(d) seed {d}, which the Phase 1 re-scan cannot be assumed to re-derive [Tool: Constitution gate | Extension relay (single-dominant-kind)]
Phase 1: T, cycle_n → Ctx(T, cycle_n) → candidates[cycle_n] → (cycle_n = 1: candidates[1] := candidates[1] ∪ (Λ.B_seed \ Λ.domains_touched)) → (Sub-D[cycle_n], auto_resolved?) → Sub-D[cycle_n].domain → Λ.domains_touched   -- per-cycle context collection; cycle-1 anchor selection runs over candidates[1] = newly-surfaced ∪ (Λ.B_seed \ Λ.domains_touched) (seed joins BEFORE Sub-D binds — the seed join; a Reopen(d) seed stays an anchor candidate even when the re-scan misses it; an already-touched seed domain — e.g. B_prior-seeded into context_resolved — is excluded here and re-enters ONLY via the Ctx re-scan's stale-seed re-surface, preserving the pairwise-disjoint partition), then auto-resolve check, then the domains_touched write (the anchor commits to Λ.domains_touched and to no partition member until Phase 3 files it) [Tool]
       → (cycle_n = 1) non-anchored B_seed remainder (deduped set) → Λ.residual ∪ Λ.domains_touched; Λ.B_seed := ∅   -- cycle-1 B_seed consumption (track): non-anchored remainder of the deduped seed residualizes (the residualize write), cleared after consumption (consumed once)
Phase 2: Sub-D[cycle_n], kind, BoundaryClassification, BoundaryEssence, cycle_n, B_snapshot, default
       → Qc(Sub-D[cycle_n], kind, BoundaryClassification, BoundaryEssence, cycle_n, B_snapshot, default) → Stop → A          -- per-cycle classification over BoundaryClassification with complete B_snapshot + default visibility [Tool]
Phase 3: (user-response: A → conservative parse(A) → (typed_A?, TerminationIntent?)) | (auto-resolved: typed_A = substrate-settled classification from the Phase 1 auto-resolve check, no TerminationIntent)
       → integrate(typed_A?, B, BoundaryEssence) → (B', Δessence)                                             -- total cycle fold: a classification updates the anchor; a termination-only reading residualizes it and returns B' = B with the empty delta
       → crystallize(Δessence, BoundaryEssence) → BoundaryEssence'                                            -- sole producer of the accumulated essence; the empty delta is the identity
       → snapshot(B', Λ.residual, default_for_residual) → B_complete'                                         -- ALWAYS, termination folds included, and BEFORE any route: the round-local completeness invariant holds after EVERY fold, so a just-residualized anchor carries its provisional entry before any terminal write reads it
       → (only on loop continuation) DefaultClassification(EssenceTrend(history')) → default' → snapshot(B', Λ.residual, default') → B_complete''
                                                                                                              -- next-cycle default (track + sense), then the snapshot that supersedes B_complete' for the cycle about to open; EssenceTrend re-derivation is kind-general (count-only over the uniform disposition)
Phase 4 (optional): residual, BoundaryEssence → Qf(residual, FinalGateDisposition) → Stop → Λ.final_gate_answers
                                                                                                              -- final gate [Tool], reached via ExplicitTermination or Phase 1 substrate exhaustion; FinalGateDisposition = {UserSupplies, AIAutonomous}, every kind

Phase 0 → Phase 0b: boundary_undefined(T) = true ∨ ZeroSignalConfirmation = Reopen(d)       -- domain signal present (probe-detected, or user-reopened seeding Bᵢ := {d}) → dispatch the kind before the loop
Phase 0 → deactivate: boundary_undefined(T) = false ∧ ZeroSignalConfirmation = Confirm      -- no undefined boundary signal, zero-signal finding confirmed (`Zero-signal surfacing`)
Phase 0b sync_kind_route relay branch: single_dominant_kind(KindRouteMap, T, context) = true → relay captured_kind + basis, proceed (extension, NO turn yield) → continue to bind_kind   -- entropy→0 (option-set relay test): one kind dominates, foils route away; the captured kind is committed for the activation (a rare mis-relay is corrected by re-invoking /bound, not an in-loop redirect); certify stays fail-closed
Phase 0b sync_kind_route gated branch: single_dominant_kind(KindRouteMap, T, context) = false → Stop → captured_kind (constitution)                                                                      -- ≥2 viable hypotheses ∨ undecidable foil ∨ emergent gesture naming no single kind ∨ live ground leaves the emergent question undetermined → mandatory Constitution gate
Phase 0b → Phase 1: status(certificate) = pass ∧ BoundaryClassification bound                               -- kind captured (via relay or gate), fit certified, value-space frozen → enter the per-cycle loop
Phase 0b → deactivate (route): status(certificate) = route                                   -- a local route claim holds the kind → route_away(RouteClaim.routed_deficit), residual untreated (kind out-of-scope for bound)
Phase 0b → Phase 0b (re-sync): status(certificate) = ambiguous ∨ KindBinding.atomicity = non-atomic
                                                                                            -- |claimed_by| ≠ 1 (several claims hold, or none does) OR compound kind → split / route / one-turn narrow disambiguation, then re-certify BEFORE binding values (fail-closed; never bind under ambiguity)
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
Phase 4 → converge: Λ.final_gate_answers covers Λ.residual → Phase 4 terminal carrier                              -- BoundaryMap + BoundaryEssence finalized

── TERMINAL CARRIERS ──
The table below is the sole definition of DefinedBoundary map provenance. Every graceful path starts from an initialized map source, completes its terminal write, and emits only the resulting Λ.boundary_map paired with Λ.captured_kind.

Path                              | Initialized source                                                   | Terminal write                                                                                                  | Final value
Phase 3 ImplicitTermination       | B' from the current cycle fold, which has ALREADY placed the anchor per the parse — a response carrying typed_A leaves the anchor classified in B', a termination-only response residualizes it; Λ.residual is read as the fold left it and is NEVER assumed to hold the anchor, so a classification the user just stated is never overwritten by the residual disposition; residual_disposition = user override when stated, otherwise default_at_surfacing | finalize(B', Λ.residual, residual_disposition) → B_final; Λ.boundary_map := B_final | { map: Λ.boundary_map, kind: Λ.captured_kind }
Phase 4 completed                 | Λ.boundary_map at Phase 4 entry + Λ.residual + Λ.final_gate_answers | bulk_classify overwrites every residual provisional entry, moves those domains to final_gate_classified, empties Λ.residual, and writes Λ.boundary_map | { map: Λ.boundary_map, kind: Λ.captured_kind }
Phase 1 substrate exhaustion      | Λ.boundary_map at the guarded edge where Λ.residual = ∅             | identity; Λ.boundary_map is unchanged                                                                           | { map: Λ.boundary_map, kind: Λ.captured_kind }

B_snapshot and B_complete' are recognition surfaces only. Neither is a result carrier, and pairing either with a kind does not constitute DefinedBoundary.

── LOOP ──
Pre-loop dispatch (Phase 0b, one-shot — runs once before the per-cycle loop opens):
  sync_kind_route(T) surfaces the KindRouteMap (every recognition seed + emergent/naming path); the user captures the kind (recognize a seed, name an emergent, or extend/replace a seed).
  Extension fast-path (single-dominant-kind relay): when single_dominant_kind(KindRouteMap, T, context) holds (per the single_dominant_kind predicate (TYPES) and `Option-set relay test`) — present the captured kind + its basis as relay text and proceed (the captured kind is committed for the activation), recording Λ.captured_kind with ZERO turn yields. The basis is the dominating predicate + the foils' route-away on the seed route, and the user's own naming quoted verbatim on the emergent route. The mandatory Constitution gate fires when single_dominant_kind is false — the default when in doubt; relay is the NARROW exception (`Option-set relay test`).
  bind_kind → certify (fail-closed) → bind_value_space. The captured kind FIXES BoundaryClassification for the whole activation; the per-cycle loop classifies object_ref(kind) over the frozen BoundaryClassification. BOTH branches (relay and gate) feed this same pipeline — the relay collapses only the kind-capture turn yield; a non-pass certificate still gets the full gated treatment. Re-sync on ambiguous/non-atomic; route_away (deactivate) when a local route claim holds the kind.

J = {next, terminate_implicit, terminate_explicit}
  (every value read below is the CONFIRMED one — a parse leaving ≥2 routing branches viable is resolved to a single branch via `Ambiguous response routing`'s one-turn confirmation gate at Phase 3 step 1 BEFORE J is evaluated, and a confirmed `next` is the absence of a TerminationIntent rather than a member of it; routing here is immediate only for an unambiguous parse)
  next:               ¬termination_intent → next-cycle default' (= DefaultClassification(EssenceTrend(history')), count-based, kind-general) → cycle_n += 1, Phase 3 → Phase 1 (per-cycle re-scan)
  terminate_implicit: TerminationIntent = ImplicitTermination (parsed from Phase 2 free response) → Phase 3 → converge with residual filled by default_at_surfacing (the Λ.default_for_residual value Phase 2 surfaced — NOT re-derived) or user-stated override; a termination-only response (no typed selection) first residualizes the current anchor (Phase 3 step 2), so it is included in that fill
  terminate_explicit: TerminationIntent = ExplicitTermination (parsed from Phase 2 free response) → Phase 3 → Phase 4 (final gate)

Per-cycle re-scan: Phase 1 substrate scan (artifact read/artifact search) re-executes each cycle; `Λ.domains_touched` (anchored ⊔ non-anchored ⊔ resolved/dismissed) is the dedup source — no domain surfaced twice.
Cycle 1 ordering: AI Impact ordering selects highest-impact domain.
Cycle k≥2 ordering: previous cycle's typed_A[cycle_n-1] or free-response routes next cycle's domain selection frame; AI re-applies Impact ordering within the routed frame.

Answer types (members of the uniform disposition BoundaryClassification: UserSupplies/AIPropose/AIAutonomous/Dismiss) determine BoundaryMap entry, not loop path.
FinalGateDisposition (the uniform subset {UserSupplies, AIAutonomous} ⊆ BoundaryClassification, every kind) determines residual BoundaryMap entries at Phase 4.

Round-local BoundaryMap invariant: after each Phase 3 integrate — termination folds included, since the snapshot refresh is NOT conditioned on loop continuation — `Λ.boundary_map` snapshot is always complete: classified entries ∪ (residual ↦ default_for_residual). Snapshot completeness makes ImplicitTermination available AND gives every residual domain the provisional entry the Phase 4 bulk_classify overwrite reads, so no domain reaches a terminal write without an entry; TERMINAL CARRIERS governs every emitted result.

Convergence evidence: At convergence (Phase 3 ImplicitTermination ∨ Phase 4 completed ∨ substrate-exhaustion empty-residual), present transformation trace — per-cycle (Sub-D[k], Δessence[k], disposition[k]) for each anchored cycle k (k ranges over Λ.D_history — the cycles that produced a Sub-D; a substrate-exhaustion terminal scan produces no Sub-D and contributes no entry; disposition[k] ∈ BoundaryClassification is READ FROM the finalized Λ.boundary_map entry for Sub-D[k].domain, never re-declared per terminal path — the trace evidences the emitted map, so it carries the map's own value for that domain whichever path assigned it; Δessence[k] is the delta integrate produced for cycle k, or the empty delta when the cycle produced no classification), plus residual disposition:
Cover: the parts together range over the domains of the EMITTED Λ.boundary_map, each domain reported exactly once. "non-anchored d" means d ∉ { s.domain | s ∈ Λ.D_history } — compared on DOMAIN IDENTITY, since D_history holds Sub-D projections while the partition sets hold Domains, and a raw membership test across the two types would fail to exclude an auto-resolved anchor. Anchored membership takes precedence, so a domain anchored in some cycle is reported only as a per-cycle entry even when it also sits in context_resolved (auto-resolved), residual (the termination-only anchor), or final_gate_classified. Every other map domain — a kind-matched B_prior seed left unchanged in context_resolved, a non-anchored domain accumulated into residual, a bulk-classified domain — is reported by the matching part below. A map domain in neither part is a gap in the evidence, not an omission the trace may make.
  • ImplicitTermination: ∀ non-anchored d ∈ residual: (d, default_at_surfacing_or_override) — basis follows which value committed: the EssenceTrend / count-distribution derivation when the surfaced default committed (kind-general), the user's stated override when one did
  • Phase 4 completion: ∀ non-anchored d ∈ final_gate_classified: (d, Λ.final_gate_answers[d])   -- the partition bulk_classify moved them into; Λ.residual is empty by then
  • Seeded-and-unchanged: ∀ non-anchored d ∈ context_resolved: (d, disposition(d)) — cites the substrate assignment or the prior-classification seed basis; these never anchored a cycle, so nothing else reports them
  • substrate-exhaustion empty-residual: residual = ∅ — no residual disposition (every surfaced domain classified per-cycle)
BoundaryEssence is presented as separate session text artifact. Convergence is demonstrated, not asserted.

── CONVERGENCE ──
converge iff (Phase 3 ImplicitTermination ∨ Phase 4 completed ∨ substrate_exhaustion_empty_residual) ∧ status(certificate) = pass
  certificate gate:            convergence presupposes a passing DeficitFitCertificate (Phase 0b); a route/ambiguous certificate never reaches the loop, so DefinedBoundary is unreachable without an in-scope, fit-certified kind. The pass certifies LOCAL admissibility — bound's own gate over bound's own activation — not the absence of a claim anywhere in the wider protocol set
  kind_dispatch_branch:        the captured kind reaches the loop via EITHER branch of Phase 0b sync_kind_route — the single_dominant_kind relay (extension, no turn yield) or the mandatory Constitution gate — and both flow through the fail-closed certificate, so convergence is branch-invariant: a relay-captured kind whose certificate is route (routes away/deactivates) or ambiguous (re-syncs the gate) never reaches the loop, exactly as the gated branch does
  Phase 3 ImplicitTermination: the Phase 3 ImplicitTermination row in TERMINAL CARRIERS completed
  Phase 4 completed:           the Phase 4 row in TERMINAL CARRIERS completed — reachable via Phase 3 ExplicitTermination OR Phase 1 substrate exhaustion with residual remaining
  substrate_exhaustion_empty_residual: the substrate-exhaustion row in TERMINAL CARRIERS completed under Sub-D empty ∧ Λ.residual = ∅
  route_deactivate:            Phase 0b status(certificate) = route → route_away(RouteClaim.routed_deficit), non-convergent exit (kind out-of-scope for bound; no DefinedBoundary emitted)

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Probe (sense)        → Internal analysis (silent — no user output; heuristic boundary-undefined detection + session-context scan for a prior BoundaryMap as Λ.B_prior (DETECTION only — Phase 0 seeds nothing; a kind-matched prior is seeded at Phase 0b step 4, a kind-mismatched prior stays advisory-only); notice visibility deferred to Phase 2 cycle 1 surfacing)
Phase 0 ZeroSignalConfirm (constitution) → present (conditional: Bᵢ = ∅; zero-signal finding + reasoning; Confirm/Reopen(Domain) — `Zero-signal surfacing`)
Phase 0b sync_kind_route (constitution) → present (GATED branch — fires when single_dominant_kind = false: ≥2 seeds stay viable under the framing, a seed's route-away is undecidable from the framing, an emergent gesture resolves to no single naming, OR the live ground (T, context) leaves the emergent question undetermined; up-front KindRouteMap — one hypothesis for every recognition seed, each with positive_predicate + evidence + differential_future + route-away conditions, plus an emergent/naming free-response path; named kinds are PRIORS not a closed set; user captures the kind by recognizing a seed, naming an emergent, or extending/replacing a seed)
Phase 0b sync_kind_route_relay (extension) → TextPresent+Proceed (RELAY branch — fires when single_dominant_kind = true, per the single_dominant_kind predicate (TYPES) and `Option-set relay test`. Present the captured kind + its basis as relay text — the basis quotes the user's own wording rather than paraphrasing it wherever the emergent conjunct carried the decision, and quotes it VERBATIM when the relay fires because the user already named the emergent kind, since there that wording IS the capture — and proceed, recording Λ.captured_kind WITHOUT a turn yield; the captured kind is committed for the activation (like the gated branch) — a rare mis-relay is corrected by re-invoking /bound, not an in-loop redirect transition. The fail-closed certify STILL runs on this branch — a non-pass DeficitFitCertificate gets the full gated treatment (route → route_away/deactivate, ambiguous → re-sync), so the relay never bypasses deficit-fit)
Phase 0b certify (sense)     → Internal analysis (extension — fail-closed DeficitFitCertificate; deterministic check of KindBinding.positive_predicate against the own claim and the route claims inscribed in this SKILL.md, reading nothing outside this file: claimed_by = {BoundaryUndefined} when the own claim holds alone; status(certificate) = pass | route | ambiguous; basis = the cited claim fit, shown at Phase 2 cycle 1's first surfacing)
Phase 0b bind_value_space (track) → Internal state update (extension — generate the uniform settlement disposition {UserSupplies, AIPropose, AIAutonomous, Dismiss} ONLY after status(certificate) = pass; same coproduct for every kind; relay / dead-signal test applied; freeze BoundaryClassification for the activation. On status(certificate) = route → route_away(routed_deficit), deactivate; on status(certificate) = ambiguous ∨ non-atomic → re-sync Phase 0b before binding)
Phase 1 Ctx   (observe)      → artifact read, artifact search (per-cycle re-scan: CLAUDE.md, project rule files, prior session context)
Phase 1       (track)        → Internal state update (cycle 1 only: Λ.B_seed candidates (minus Λ.domains_touched) enter anchor selection alongside newly-surfaced domains; non-anchored remainder of the deduped seed → Λ.residual ∪ Λ.domains_touched — partition invariant preserved; Λ.B_seed := ∅, consumed once)
Phase 2 Qc    (constitution) → present (mandatory; per-cycle classification over BoundaryClassification + captured-kind label + essence-refinement preview (NOT the committed Δessence, which integrate produces at Phase 3 step 2) + cycle_n + current B_snapshot + current default_for_residual with count-distribution basis cite + cycle-1 certificate-fit basis + cycle-1 notice when Λ.B_prior non-empty (seed notice when kind-matched, advisory-only notice when kind-mismatched) + free-response termination affordance with implicit/explicit sub-signals)
Phase 3 parse  (sense)       → Internal analysis (conservative whole-utterance recognition with no Λ mutation: return typed_A? + TerminationIntent only when the reading accounts for all decision-relevant meaning in A; otherwise return no commitment and let Phase 2 re-present directly from A)
Phase 3 confirm_intent (constitution) → present (conditional: a parse leaving ≥2 J routing branches viable — present the candidate readings that parse actually left open (ImplicitTermination committing residual at default_at_surfacing | next continuing to the following cycle | ExplicitTermination proceeding to Phase 4), each with its differential future, and Stop; the user's confirmation or correction routes the loop at J — `Ambiguous response routing`)
Phase 3       (track)        → Internal state update (integrate(typed_A?, B, BoundaryEssence) → B', Δessence as the total current-cycle fold; a termination-only commitment returns B' = B, residualizes the anchor, and supplies the empty delta; crystallize applies to every delta with the empty delta as identity; ImplicitTermination executes the Phase 3 TERMINAL CARRIERS write; on loop continuation only — DefaultClassification(EssenceTrend(history')) → default' (kind-general, count-only); the B-snapshot refresh runs on EVERY fold, termination included, taking default' on continuation and the current default_for_residual on termination, so the completeness invariant leaves no gap for a terminal write to read)
Phase 4 Qf    (constitution) → present (residual bulk classification over FinalGateDisposition = {UserSupplies, AIAutonomous}, every kind; reached via ExplicitTermination or substrate exhaustion)
Phase 4       (track)        → Internal state update (bind the complete final_gate_answers map, then execute the Phase 4 TERMINAL CARRIERS write)
converge      (extension)    → TextPresent+Proceed (captured-kind + DeficitFitCertificate basis + per-cycle trace + residual disposition trace + BoundaryEssence artifact; proceed with defined boundary)
Seam transition to declared next protocol (extension) → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol settles the next move — proceed directly to it, citing that settling source. This protocol declares no wired outbound continuation edge: a route claim fires when status(certificate) = route, a pre-loop out-of-scope route-away that deactivates before any DefinedBoundary, not a post-convergence handoff, so the second trigger is vacuously absent. Every Constitution gate inside this protocol and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = { phase: Phase, T: TaskScope,
      kind_route_map: Optional(KindRouteMap),          -- Phase 0b dispatch sync (every recognition seed + emergent path)
      captured_kind: Optional(Kind),                   -- the kind the dispatch settled on (recognize-seed | name-emergent | extend/replace-seed); set via the single_dominant_kind relay (extension, no turn yield) OR the mandatory Constitution gate
      kind_binding: Optional(KindBinding),             -- fields: label, positive_predicate, evidence, atomicity
      certificate: Optional(DeficitFitCertificate),    -- fields: own_claim, route_claims[], claimed_by, evidence; fail-closed gate — status(certificate) must = pass before value_space binds
      value_space: Optional(ValueSpace),               -- the uniform settlement disposition; frozen for the activation once status(certificate) = pass (UserSupplies / AIPropose / AIAutonomous / Dismiss, same for every kind)
      B_prior: Optional(SeededPrior),                  -- hermeneutic seed detected at Phase 0 (a SeededPrior — prior BoundaryMap plus the kind it was produced over); the carried kind (B_prior.kind) is what Phase 0b step 4 tests to gate seeding to same-kind only (kind-mismatched prior map → advisory, not seeded)
      B_seed: Set(Domain),                             -- = Bᵢ, the Phase 0 domain-signal seed (the singleton d on zero-signal Reopen(d)); carried across the Phase 0 → 0b transition (both Stops sit between production and consumption); kept separate from the classified map B — B_seed is a Set(Domain), B a Map — and consumed at Phase 1 cycle-1 anchor selection as unclassified candidates; the non-anchored remainder residualizes at the Phase 1 residualize (→ Λ.residual ∪ Λ.domains_touched) and B_seed clears after cycle 1
      cycle_n: Nat,
      domains_touched: Set(Domain),                    -- accumulated across cycles (Phase 1 surfacing union)
      D_history: List<Sub-D>,                          -- per-cycle dimension projections
      essence_history: List<Δessence>,                 -- per-cycle delta accumulation
      boundary_essence: BoundaryEssence,               -- accumulated essence text
      default_for_residual: BoundaryClassification member,            -- provisional residual disposition surfaced each Phase 2 (a member of the uniform disposition); DefaultClassification(EssenceTrend(history)) re-derived each cycle, every kind
      context_resolved: Set(Domain),                   -- Phase 1 auto-resolved (Bᵣ-equivalent, per-cycle) ∪ B_prior-seeded domains (Phase 0b step 4 init; basis: "prior classification" — entries mutable across cycles, may be re-surfaced by Phase 1 if a stale-prior signal is detected)
      user_responded: Set(Domain),                     -- Phase 2 BoundaryClassification classification completed (the uniform 4-value disposition)
      final_gate_classified: Set(Domain),              -- Phase 4 bulk classification completed
      dismissed: Set(Domain),
      residual: Set(Domain),                           -- unclassified subset of domains_touched (implicit-delegation candidates; provisionally mapped to default_for_residual in boundary_map snapshot)
      boundary_map: BoundaryMap,                       -- always-complete after each Phase 3: classified entries ∪ (residual ↦ default_for_residual)
      final_gate_answers: Map(Domain, FinalGateDisposition),
      history: List<(Domain, BoundaryClassification)>,
      active: Bool, cause_tag: String }
-- Invariant: domains_touched = context_resolved ∪ user_responded ∪ final_gate_classified ∪ dismissed ∪ residual (pairwise disjoint)
--   Scope: holds at every cycle boundary — after each Phase 3 and at every Phase 1 entry. The one transient exception is the cycle's own anchor between the Phase 1 domains_touched write (which commits it there) and Phase 3 step 2 (which files it into a partition member): across the Phase 2 Stop the anchor is in domains_touched and in no member, by construction, since the member it belongs to is what Phase 2 is asking. Every path out of Phase 2 — typed answer or termination-only — reaches a step that files it.
-- Invariant: boundary_map = classified_entries(context_resolved ∪ user_responded ∪ dismissed ∪ final_gate_classified) ∪ (residual ↦ default_for_residual) — round-local completeness

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
Dispatch-first rationale: BoundaryMap is a multi-consumer router. The captured kind must settle BEFORE the per-cycle loop opens — hence bound carries the up-front Phase 0b sync rather than emerging the kind cycle-by-cycle: downstream consumers reading a stable kind cannot tolerate a kind that shifts mid-loop. The DeficitFitCertificate (checked against the own claim and the route claims inscribed in this SKILL.md) keeps a misfit kind from entering the shared map — a kind a local route claim holds is routed away (deactivate) instead of polluting the multi-consumer signal. What a pass certifies is LOCAL admissibility, bound's own gate governing bound's own activation, not the absence of a claim anywhere in the wider protocol set: where two protocols' scopes both reach a situation, each protocol's own gate governs.
Hermeneutic carry-over (kind-aware): an optional B_prior input (prior BoundaryMap detected in session context, together with the kind it was produced over) seeds the new invocation ONLY when its kind matches the captured kind (same-kind — same boundary question). Every kind shares the uniform disposition, so a mismatched prior's values are type-compatible; the guard is SEMANTIC: a kind-mismatched prior answers a DIFFERENT boundary question, so it is surfaced as advisory context, NOT seeded into boundary_map (seeding it would commit a wrong-question disposition into the multi-consumer signal). Seed entries are mutable in subsequent cycles and BoundaryEssence is re-crystallized from the current task scope. The seed enables a feedback loop where a downstream observation refines a prior BoundaryMap through re-invocation.
Round-local BoundaryMap composition: each Phase 2 cycle produces a complete BoundaryMap (classified entries ∪ residual ↦ default_for_residual). The complete snapshot is citable as scope text for a realization-layer turn-condition primitive — the AIAutonomous and AIPropose entries delineate an Extension-progression scope whose exhaustion is a natural completion condition orthogonal to the in-protocol satisfaction signal that emits DefinedBoundary.
```

## Mode Activation

`/bound` remains directly invocable. During AI-guided activation, loaded safety boundaries, capability restrictions, and explicit user instructions continue to bind.

### Activation exceptions

Skip AI-guided activation when the current message or project rules already settle the boundary, when the user explicitly requests proceeding without boundary settlement, when the same domain and description were dismissed in this session, or when the task has one obvious boundary. A zero-signal probe still presents its finding and reasoning for correction.

Heuristic detection may use multiple unsettled decision areas, delegation uncertainty, a preceding protocol's boundary signal, or a possibly stale prior BoundaryMap. These are discovery cues rather than additional activation predicates.

## Protocol

### User-facing realization

At kind dispatch, render each viable seed as a positive hypothesis with its cited evidence, differential future, and route-away condition, while keeping an open naming path for an emergent kind. On the single-dominant relay, present the captured kind and basis without a turn yield; when the user's wording itself names an emergent kind, carry that wording verbatim. A non-passing deficit-fit certificate remains visible as the reason for routing or re-synchronizing.

At each classification round, use everyday language to place the anchor domain beside its evidence, the current BoundaryEssence, the complete BoundaryMap snapshot, and the residual default with its derivation. Materialize the uniform dispositions for the captured kind as:

- **I'll supply it** — the user supplies the boundary value.
- **Draft options for me** — AI proposes candidates for the user to choose or steer.
- **Decide within this scope** — AI resolves the boundary within the stated limits.
- **Use the stated default** — commit the displayed residual default.

Keep the satisfaction affordance outside that option set: the user may finish with the displayed default, finish with a stated override, continue to another cycle, or request the residual review. When one response supports several of those futures, present only the live readings and their consequences, then yield before routing.

A same-kind prior BoundaryMap is identified as a mutable seed with its basis. A kind-mismatched prior and cross-session recall are advisory evidence only; say so when they are surfaced. At the final residual review, render the two typed dispositions in the same domain-specific language and keep downstream value provision lazy.

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
- **Prior-map provenance**: Structural seeding requires a same-session Horismos result with the same captured kind. Other remembered classifications remain advisory and never silently populate the map.
- **Zero-signal surfacing**: Present a zero-signal finding with its reasoning and a path for the user to reopen a missed domain.
- **Free-response separation**: Keep satisfaction, default override, and residual-review signals outside the typed classification options; a termination-only response adds no classification constructor.
- **Default visibility**: Surface the residual default and its derivation before every classification gate. An implicit finish commits the value that was displayed in that round; an override remains reachable in the same response.
- **Ambiguous response routing**: When a response supports several termination or continuation futures, present only those live readings with their consequences and yield before routing.
- **Option-set relay test**: Present a single dominant kind as Extension. Constitution hypotheses remain viable under different readings of the live ground, and off-axis responses remain free-response pathways.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change the form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
