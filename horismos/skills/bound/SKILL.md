---
name: bound
description: "Define epistemic boundaries per decision. Dispatches the boundary kind up-front (direction/priority, scope, type/concept, ownership, or emergent) through a fail-closed deficit-fit certificate, then classifies each boundary by a uniform settlement disposition — user-supplies, AI-proposes, AI-autonomous, or dismiss — into a BoundaryMap. The captured kind sets WHAT is bounded; the disposition sets HOW it is settled downstream (ownership is the degenerate kind where the two coincide). Type: (BoundaryUndefined, AI, DEFINE, TaskScope) → DefinedBoundary. Alias: Horismos(ὁρισμός)."
---

# Horismos Protocol

Define epistemic boundaries per decision through AI-guided classification. Type: `(BoundaryUndefined, AI, DEFINE, TaskScope) → DefinedBoundary`.

## Definition

**Horismos** (ὁρισμός): A dialogical act of proactively defining epistemic boundaries per decision, where AI probes for boundary-undefined domains, dispatches the boundary **kind** up-front (a KindRouteMap of recognition seeds — direction/priority, scope, type/concept, ownership — plus an emergent/naming path) through a fail-closed deficit-fit certificate, collects contextual evidence to enrich classification quality, and presents each domain for user classification by a **uniform settlement disposition** (user-supplies / AI-proposes / AI-autonomous / dismiss) into a BoundaryMap consumed by all downstream protocols. The disposition coproduct is the same for every kind — the captured kind sets WHAT boundary is being settled, the disposition sets HOW that boundary value is settled downstream. **Ownership** is one kind among the seeds (who decides), and it is the *degenerate* case where the boundary value being settled is itself the disposition — so for ownership, content and disposition coincide; for every other kind they separate cleanly.

```
── FLOW ──
Horismos(T, B_prior?) → Probe(T) → Bᵢ? →
  |Bᵢ| = 0: skip → deactivate
  |Bᵢ| > 0: Phase 0b sync_kind_route(T) → KindRouteMap →                                            -- up-front KIND dispatch (dispatch-first: kind settles before downstream consumers read it)
    [single_dominant_kind(KindRouteMap): relay(captured_kind + basis) (extension) → proceed (kind committed)   -- entropy→0 fast-path (option-set relay test): one kind dominates, foils route away → NO turn yield
     | else: Stop → captured_kind (constitution)]                                                   -- ≥2 viable hypotheses ∨ emergent/naming → mandatory Constitution gate
    bind_kind(captured_kind) → KindBinding                                                           -- {label, positive_predicate, evidence, origin ∈ {seed, emergent}, atomicity}; non-atomic → split/route, re-sync before continuing
    certify(KindBinding, registry) → DeficitFitCertificate                                         -- fail-closed: status ≠ pass BLOCKS value-space binding (split / route_if / narrow-disambiguation first)
      status = route:      → route_away(target) → deactivate (kind belongs to sibling deficit; no DefinedBoundary)
      status = ambiguous ∨ non-atomic: → re-sync Phase 0b (split / route / narrow-disambiguation) → re-certify
      status = pass:       → bind_value_space → BoundaryClassification                                  -- the uniform settlement-disposition coproduct, generated ONLY after certificate passes (same codomain for every kind; captured kind sets each option's content, not the coproduct)
    init_loop_state: cycle_n=1, BoundaryEssence="", B = seed_if_kind_match(B_prior, captured_kind) ∪ ∅ (seed only when kind(B_prior) = captured_kind; kind-mismatched prior map → advisory, NOT seeded — see seed_if_kind_match), default=AIAutonomous (Extension-default initial, every kind), EssenceTrend=MixedTrend (kind-general — the per-cycle disposition-trend machinery runs for every kind), loop:
    Phase 1 Ctx(T, cycle_n) [per-cycle re-scan] → (Sub-D[cycle_n], auto_resolved?) →
      Sub-D empty ∧ residual ≠ ∅: → Phase 4 (substrate exhausted, residual remains)
      Sub-D empty ∧ residual = ∅: → DefinedBoundary → converge (substrate exhausted, all surfaced domains classified — no empty Phase 4 gate)
      auto_resolved: → Phase 3 (skip Phase 2 for this cycle; no user A — the substrate-settled classification is carried into Phase 3)
      else:          → Phase 2
    Phase 2 Qc(Sub-D[cycle_n], kind, BoundaryClassification, BoundaryEssence, cycle_n, B_snapshot, default) → Stop → A
    Phase 3 (user-response: parse(A) → (typed_A, termination?, override?); auto-resolved: typed_A = substrate-settled classification, no termination/override) →
      integrate(typed_A, B, BoundaryEssence) → (B', BoundaryEssence')                              -- classified-portion update only
      ImplicitTermination: → finalize(B', residual, default_or_override) → DefinedBoundary → converge
                            -- "default" is Λ.default_for_residual at entry to Phase 3 (the value Phase 2 surfaced); NOT re-derived
      ExplicitTermination: → Phase 4
      Esc:                 → ungraceful deactivate (residual untreated, BoundaryEssence finalized at current cycle_n)
      else:                → derive(EssenceTrend, history') → default' for NEXT cycle (kind-general; count-only over the uniform disposition) → refresh B'-snapshot → cycle_n += 1, loop
  Phase 4 (optional path) Qf(residual, FinalGateDisposition) → Stop → bulk_classify → DefinedBoundary
                       Esc → ungraceful deactivate

── MORPHISM ──
TaskScope, B_prior?
  → probe(task, context)                                           -- detect boundary-undefined domains
  → sync_kind_route(task, context) → KindRouteMap                  -- up-front dispatch: ≤3 recognizable kind hypotheses (seeds: direction/priority, scope, type/concept, ownership) + emergent/naming path; each carries positive_predicate, evidence, differential_future, route_away conditions
  → [single_dominant_kind: relay(captured_kind) (extension) | else: present(KindRouteMap) (constitution)]  -- option-set relay test over the kind hypotheses: one dominant kind (entropy→0; its positive_predicate satisfied, foils' route_away hold, no emergent) relays without a turn yield; ≥2 viable ∨ emergent/naming gates. BOTH branches feed bind_kind → certify → bind_value_space (certificate fail-closed on both)
  → bind_kind(captured_kind) → KindBinding                         -- {label, positive_predicate, evidence, seed|emergent, atomicity}; non-atomic kind → split or route before continuing
  → certify(KindBinding, registry) → DeficitFitCertificate         -- {owner, in_scope_if, route_if[], evidence, status}; fail-closed — status ≠ pass BLOCKS bind_value_space; checks captured kind's positive_predicate against the sibling-deficit registry (the registered deficit/edge graph)
  → bind_value_space → BoundaryClassification                     -- the uniform settlement disposition {UserSupplies, AIPropose, AIAutonomous, Dismiss}, generated ONLY after certificate passes; same codomain for every kind (kind sets each option's content); relay / dead-signal test applied; frozen for the activation
  → seed(B_prior, B)                                               -- hermeneutic carry-over at Phase 0b step 4 (AFTER bind_value_space + B init): optional prior BoundaryMap seeds the freshly-initialized B ONLY when kind(B_prior) = captured_kind (same-kind — its dispositions were settled over the SAME boundary question). Values are always type-compatible now (every kind shares BoundaryClassification), so the guard is SEMANTIC: a kind-mismatched prior answers a DIFFERENT boundary question (e.g. an ownership prior's "AIAutonomous" decided who-owns, not how-wide a scope is) and is surfaced as advisory context, NOT seeded. Seeded domains enter `context_resolved` partition with "prior classification" basis (entries mutable in subsequent cycles). Phase 0 only DETECTS B_prior (binds Λ.B_prior together with its kind); it does not seed B, which does not exist until loop-state init
  → enrich(domains, codebase, cycle_n)                             -- per-cycle context collection (re-scan)
  → classify(domain, as_inquiry) → typed_A ∈ BoundaryClassification               -- per-cycle object_ref(kind) classification by the uniform settlement disposition (the captured kind sets the content of each disposition option; the 4-value coproduct itself is kind-invariant)
  → integrate(typed_A, B, BoundaryEssence) → (B', BoundaryEssence')-- classified-portion update for current anchor over BoundaryClassification; does NOT update default_for_residual
  → crystallize(Δessence, BoundaryEssence) → BoundaryEssence'      -- per-cycle essence delta integration (crystallized form of the responsibility boundary space)
  → derive(EssenceTrend, history') → default'                      -- count-based EssenceTrend → DefaultClassification for NEXT cycle's residual (runs on loop continuation; count-only over the uniform disposition, so the derivation is kind-general — it reads disposition counts, never kind-specific content)
  → snapshot(B', residual, default') → B_complete'                 -- round-local complete BoundaryMap view for next cycle's Phase 2: classified entries ∪ (residual ↦ residual_default), where residual_default = default' (re-derived per cycle from the disposition trend)
  → finalize(B', residual, residual_disposition)                   -- residual_disposition ∈ BoundaryClassification: ImplicitTermination → (default_at_surfacing | override); Phase 4 → FinalGateAnswer
                                                                   -- "default_at_surfacing" = Λ.default_for_residual visible in just-completed Phase 2 (NOT re-derived)
  → DefinedBoundary
requires: boundary_undefined(T)            -- runtime checkpoint (Phase 0); sole activation precondition. (certificate.status = pass is the Phase-0b value-space-BINDING gate, NOT an activation precondition — it lives in the certificate-before-binding invariant below and the Phase 0b → Phase 1 transition; route/ambiguous status routes/re-syncs inside Phase 0b rather than blocking activation.)
deficit:  BoundaryUndefined                -- activation precondition (Layer 1/2); certificate.owner for in-scope kinds
preserves: task_identity(T)                -- task scope invariant; BoundaryMap and BoundaryEssence mutated; B_prior seed entries are mutable across cycles
invariant: Definition over Assumption
invariant: certificate-before-binding      -- DeficitFitCertificate.status = pass strictly precedes bind_value_space (shared meta-backbone order)

── TYPES ──
T              = TaskScope (task/project requiring boundary definition)
B_prior        = Optional(SeededPrior)                        -- optional invocation seed for hermeneutic carry-over (prior BoundaryMap detected in session context). Seeded into B at Phase 0b step 4 ONLY when the prior map's kind matches the captured kind (same-kind — same boundary question). The guard is SEMANTIC, not type-based: every kind shares BoundaryClassification, so a mismatched prior's values are type-valid but answer a DIFFERENT boundary question, so a kind-mismatched prior map is surfaced as advisory context, NOT seeded as a structural entry. Seed entries are mutable across cycles
SeededPrior    = { map: BoundaryMap, kind: Kind }             -- the prior BoundaryMap together with the boundary kind it was produced over (Phase 0 step 3 detection binds both). The carried kind is the typed carrier the same-kind guard tests: kind(B_prior) ≡ B_prior.kind
seed_if_kind_match : (Optional(SeededPrior), Kind) → BoundaryMap  -- seeds the prior map ONLY when B_prior.kind = captured_kind (returns B_prior.map); a kind-mismatched prior (B_prior.kind ≠ captured_kind) or B_prior = ⊥ returns ∅ (a mismatched prior is surfaced as advisory, not seeded)
Probe          = T → Set(Domain)                              -- boundary-undefined domain detection (Phase 0; existence check, not exhaustive enumeration)
Domain         = { name: String, description: String, evidence: Set(Evidence) }
Evidence       = { source: String, content: String }
Bᵢ             = Set(Domain) from Probe(T)                    -- initial boundary-undefined domain signal (cycle 1 seed)
ZeroSignalConfirmation = user's answer to a zero-signal finding ∈ {Confirm, Reopen(Domain)}  -- Confirm accepts no boundary-undefined signal (Rule 12); Reopen names a domain Probe(T) missed, seeding it into Bᵢ and proceeding

-- Shared meta-backbone (KIND dispatch). One canonical schema; bound-local instantiation ONLY for object_ref, local_value_space, guard routing targets.
KindRouteMap   = sync_kind_route : (T, context) → { hypotheses: List<KindHypothesis>, emergent: NamingPath }
                                                              -- up-front dispatch sync surfaced at Phase 0b; surfaces ≤3 most-relevant kind hypotheses (a per-presentation Recognition cap over the four-seed prior pool — direction/priority, scope, type/concept, ownership — NOT a claim that only three seeds exist; any seed may surface) + an emergent/naming path
KindHypothesis = { label: Kind, positive_predicate: String, evidence: Set(Evidence), differential_future: String, route_away_if: String }
                                                              -- each named kind is a PRIOR (recognition seed), NOT a closed coproduct member (Rule 5: no fixed taxonomy)
NamingPath     = free-response affordance for a kind not among the seeds (emergent capture; user names the kind, or extends/replaces a seed)
single_dominant_kind : KindRouteMap → Bool                    -- option-set relay test over the kind hypotheses (entropy→0 predicate): true iff EXACTLY ONE KindHypothesis has its positive_predicate unambiguously satisfied by the framing AND every other hypothesis' route_away_if holds (the foils route away) AND no emergent/naming capture is indicated (NamingPath not taken). true ⟹ the dispatch sync RELAYS the captured kind without a turn yield (Phase 0b sync_kind_route_relay, extension); false ⟹ the mandatory Constitution gate fires (≥2 viable kind hypotheses, or an emergent/naming capture). The captured kind still flows through bind_kind → fail-closed certify → bind_value_space on BOTH branches — the relay collapses only the kind-capture turn yield, NEVER the certificate (a non-pass certificate gets the full gated treatment — route → route_away/deactivate, ambiguous → re-sync the gate)
Kind           = captured boundary kind (seed ∈ {direction/priority, scope, type/concept, ownership} | emergent)
                 -- seeds ordered by recognition salience (a design prior, not an empirical usage claim): direction/priority (most salient), scope, type/concept, ownership (trailing seed). membership is NOT a first-class kind.
                 -- object_ref(kind) : the anchor the loop classifies (= Domain for bound, every kind; bound-local instantiation point — the kind sets WHAT the Domain's boundary is about, not the anchor type)
KindBinding    = { label: Kind, positive_predicate: String, evidence: Set(Evidence), origin ∈ {seed, emergent}, atomicity ∈ {atomic, non-atomic} }
                 -- captures the kind; if atomicity = non-atomic → split or route BEFORE certify (no value-space binding on a compound kind)
Deficit        = the sibling-deficit label a kind may belong to (sourced from each protocol's documented deficit: declaration; the protocol that OWNS the deficit is a node in the registered dependency graph and the deficit/edge relations are its edges — the deficit label itself is NOT a node of that graph); owner = BoundaryUndefined for in-scope kinds
DeficitFitCertificate = { owner: Deficit, in_scope_if: String, route_if: List<RoutePair>, evidence: Set(Evidence), status ∈ {pass, route, ambiguous} }
                 -- fail-closed: status ≠ pass BLOCKS bind_value_space. Generated by fitting KindBinding.positive_predicate against the documented sibling-deficit scopes — the registered deficit inventory + edge topology read together with each sibling protocol's deficit: declaration (its SKILL.md deficit: line).
                 -- owner = BoundaryUndefined when the kind is in-scope; status = pass iff the kind's positive_predicate fits BoundaryUndefined and no sibling deficit claims it
                 -- status = route: a sibling deficit owns the kind → emit RoutePair target, deactivate (kind is out-of-scope for bound)
                 -- status = ambiguous: overlapping deficit fit → split, route, or one-turn narrow disambiguation BEFORE binding values (never silently bind under ambiguity)
RoutePair      = (route_if_predicate: String, target: Protocol)
                 -- bound-local guard routing targets (the sibling deficits a boundary-misfit kind belongs to):
                 --   missing pre-execution fact            → /inquire   (ContextInsufficient)
                 --   unnoticed decision gap (not a boundary-kind settlement) → /gap       (GapUnnoticed)
                 --   framework absent for the decision      → /frame     (FrameworkAbsent)
                 --   cross-domain mapping uncertain         → /ground    (MappingUncertain)
V              = bind_value_space : Kind → ValueSpace         -- the kind is the DOMAIN (it selects each option's content), but the codomain is CONSTANT — bind_value_space returns the same coproduct for every kind; generated ONLY after certificate.status = pass; frozen for the activation (relay / dead-signal test applied)
ValueSpace     = BoundaryClassification                       -- the uniform settlement disposition (local_value_space; bound-local instantiation point); the same coproduct for every boundary kind — see BoundaryClassification below
cycle_n        = Nat                                          -- current cycle counter (visible at Phase 2)
                                                              -- bound index `k` ranges over `Λ.D_history` (the cycles that produced a Sub-D) in the convergence trace — NOT [1, cycle_n], since a substrate-exhaustion terminal scan increments cycle_n without producing a Sub-D
Ctx            = (T, cycle_n) → Sub-D                         -- per-cycle context collection (re-scan)
Sub-D          = { domain: Domain, scan_summary: String, evidence: Set(Evidence) }  -- per-cycle dimension projection (one anchor domain per cycle)
                                                              -- Sub-D[k] = D_history[k] (k-th historical entry); current cycle = Sub-D[cycle_n]
Δessence       = String                                       -- per-cycle boundary-essence delta produced at Phase 3 integration
BoundaryEssence = String                                      -- accumulated boundary essence (crystallized form of the responsibility boundary space); initialized "" at Phase 0; updated as BoundaryEssence' = BoundaryEssence ⊕ Δessence at Phase 3
EssenceTrend   ∈ {ExtensionTrend, ConstitutionTrend, MixedTrend}
                                                              -- kind-general: the disposition trend reads only the COUNT distribution of classified dispositions across Λ.history — never kind-specific content — so it runs identically for every captured kind
                                                              -- count-based ONLY; no textual-lean interpretation — keeps derivation deterministic and relay-eligible
                                                              -- ExtensionTrend: count(AIPropose ∪ AIAutonomous) strictly dominant
                                                              -- ConstitutionTrend: count(UserSupplies) strictly dominant
                                                              -- MixedTrend: no strict dominance OR cycle_n < 2 (explicit single-cycle initialization rule — insufficient classification history to commit a non-fallback trend)
default_for   : Kind → BoundaryClassification member          -- INITIAL default selector, applied once at Phase 0b loop-state init; → AIAutonomous (Extension-default initial) for every kind (a constant selector). Distinct from DefaultClassification, which re-derives the default per cycle from EssenceTrend.
DefaultClassification : EssenceTrend → {AIAutonomous, UserSupplies} ⊆ BoundaryClassification
                                                              -- kind-general per-cycle default re-derivation (reads disposition counts, kind-independent)
                                                              -- codomain restricted to the 2-value reachable subset (AIPropose and Dismiss are unreachable from this function)
                                                              -- ExtensionTrend → AIAutonomous; ConstitutionTrend → UserSupplies; MixedTrend → AIAutonomous (Extension-default fallback)
Qc             = Per-cycle boundary classification interaction [Tool: Constitution interaction]
A              = User answer ∈ BoundaryClassification                        -- per-cycle Phase 2 answer drawn from the uniform settlement disposition; presented intact per gate integrity invariant
                 -- A ∈ {UserSupplies(boundary), AIPropose(boundary), AIAutonomous(boundary), Dismiss} — the 4-value coproduct is kind-invariant; the captured kind sets what `boundary` refers to (who-decides for ownership, which-way for direction/priority, how-wide for scope, which-category for type/concept)
                 -- termination_intent surfaces via free-response affordance, NOT as an extra option in BoundaryClassification
TerminationIntent = parsed natural-language signal of user satisfaction
                  ∈ {ImplicitTermination(default_override?), ExplicitTermination}
                                                              -- ImplicitTermination: commit current B_snapshot — residual ↦ default_at_surfacing (the Λ.default_for_residual value visible in the just-completed Phase 2 surfacing; NOT re-derived in Phase 3) OR user-stated override — emit DefinedBoundary directly
                                                              -- ExplicitTermination: enter Phase 4 for bulk residual classification
                                                              -- default_override : BoundaryClassification — optional user-named alternative default (a member of the uniform settlement disposition) overriding the surfaced default
B              = BoundaryMap: Map(object_ref(kind), BoundaryClassification)
                 -- value type is the uniform settlement disposition BoundaryClassification — the SAME value type for every kind (the BoundaryMap value does NOT follow the kind; the kind sets only what content each entry's disposition is about)
                 -- object_ref(kind) = Domain for bound, every kind (bound-local instantiation)
                 -- Always-complete after each Phase 2 round: classified entries (per-cycle answers + auto-resolved) ∪ residual entries provisionally mapped to current default_for_residual
                 -- Round-local terminator: each cycle's snapshot is a valid DefinedBoundary upon ImplicitTermination
BoundaryClassification = {UserSupplies(boundary), AIPropose(boundary), AIAutonomous(boundary), Dismiss}
                 -- the UNIFORM settlement disposition (local_value_space): HOW the captured kind's boundary value is settled downstream — the SAME 4-value coproduct for every kind, used across Phase 2 (per-cycle) and Phase 4 (residual bulk)
                 -- the OWNERSHIP kind is the degenerate case: there the boundary value being settled (who decides) IS the disposition, so disposition and content coincide — which is why this coproduct historically read as ownership-specific. For every other kind the disposition says HOW the boundary value gets settled while the kind says WHAT that value is about (direction/priority, scope, type/concept)
                 -- UserSupplies semantic (kind-general): user retains settlement authority for this boundary; downstream gates present open questions; user supplies the boundary value (or invokes other protocols) at decision-point activation
                 -- Dismiss is a COMMITTED no-boundary signal (proceed with the stated default), an on-axis disposition — not a skip; its differential future is "residual settled by default," distinct from the three active-settlement members
Qf             = Final gate bulk classification interaction [Tool: Constitution interaction]
FinalGateDisposition = {UserSupplies, AIAutonomous} ⊆ BoundaryClassification    -- the uniform residual-disposition subset surfaced at Phase 4, the same for every kind (the two settlement dispositions a bulk residual can take)
FinalGateAnswer = FinalGateDisposition                                                                          -- Phase 4 surfacing subset (the uniform residual-disposition subset of BoundaryClassification)
                 -- Phase 4 UserSupplies (kind-general): bulk-classify residual domains as user-retained (each residual domain becomes its own boundary; lazy-binding — values or protocol invocation deferred to downstream activation)
                 -- Phase 4 AIAutonomous (kind-general): bulk-classify residual as AI-settled (semantically equivalent to per-cycle AIAutonomous(boundary))
DefinedBoundary = { map: B', kind: Kind } where (ImplicitTermination ∨ Phase 4 completed ∨ residual = ∅) ∧ BoundaryEssence finalized
                 -- B' = post-final-cycle BoundaryMap (prime denotes temporal succession of the in-loop B state); kind = Λ.captured_kind, the boundary kind this map was produced over (constant across the loop)
                 -- the emitted artifact carries the captured kind alongside B', NOT B' alone: object_ref(kind) = Domain does NOT encode the kind, so without this pairing the kind is unrecoverable from the map. The pairing (i) lets a later /bound invocation detecting this emit recover SeededPrior = { map: B', kind } so the kind-aware seed guard (kind(B_prior) = captured_kind) has a typed carrier to read, and (ii) lets its downstream advisory consumers distinguish what a non-ownership map's dispositions settle rather than reading every map as ownership. A round-local snapshot paired with Λ.captured_kind is itself a valid DefinedBoundary.
                 -- Graceful convergence paths: (i) Phase 3 ImplicitTermination (residual ↦ default_at_surfacing | override), (ii) Phase 4 completed (residual ↦ FinalGateAnswer) — via ExplicitTermination or substrate exhaustion with residual remaining, (iii) substrate exhaustion with `residual = ∅` → DefinedBoundary directly (nothing for Phase 4 to classify)
Phase          ∈ {0, 0b, 1, 2, 3, 4}

── PHASE TRANSITIONS ──
Phase 0: T, B_prior? → Probe(T) → scan_B_prior(T) → Λ.B_prior → Bᵢ?                                           -- boundary existence checkpoint + optional hermeneutic-seed DETECTION (silent); detection binds Λ.B_prior but does NOT seed B — B does not exist yet (loop state, incl. boundary_map, is initialized at Phase 0b step 4 after the kind is captured and the certificate passes, since binding is gated on a passing certificate)
       [Bᵢ = ∅] Qc(zero_signal_finding) → Stop → ZeroSignalConfirmation   -- zero-signal (Rule 12): Confirm → deactivate (Horismos not activated) | Reopen(d) → Bᵢ := {d}, proceed [Tool]
Phase 0b: T → sync_kind_route(T) → KindRouteMap → [single_dominant_kind: relay(captured_kind + basis) → proceed (extension, kind committed, NO Stop) | else: Stop → captured_kind (constitution)]
       → bind_kind(captured_kind) → KindBinding
       → certify(KindBinding, registry) → DeficitFitCertificate
       → (status = pass) bind_value_space → BoundaryClassification → init_loop_state(default_for(kind), B = seed_if_kind_match(Λ.B_prior, captured_kind) ∪ ∅)
                                                                                                              -- up-front KIND dispatch + fail-closed certificate + uniform value-space, THEN loop-state init (cycle_n, BoundaryEssence, default_for_residual = default_for(kind) = AIAutonomous, and the B_prior seed into B) — the seed folds into Phase 0b step 4, AFTER B is initialized, never before; seeded ONLY when kind(Λ.B_prior) = captured_kind (same boundary question), kind-mismatched prior map surfaced as advisory not seeded [Tool: Constitution gate | Extension relay (single-dominant-kind)]
Phase 1: T, cycle_n → Ctx(T, cycle_n) → (Sub-D[cycle_n], auto_resolved?)                                      -- per-cycle context collection + auto-resolve check [Tool]
Phase 2: Sub-D[cycle_n], kind, BoundaryClassification, BoundaryEssence, cycle_n, B_snapshot, default
       → Qc(Sub-D[cycle_n], kind, BoundaryClassification, BoundaryEssence, cycle_n, B_snapshot, default) → Stop → A          -- per-cycle classification over BoundaryClassification with complete B_snapshot + default visibility [Tool]
Phase 3: (user-response: A → parse(A) → (typed_A, termination?, override?)) | (auto-resolved: typed_A = substrate-settled classification from Phase 1 step 4, no termination/override)
       → integrate(typed_A, B, BoundaryEssence) → (B', BoundaryEssence')                                      -- classified-portion update only (does NOT modify Λ.default_for_residual)
       → (only on loop continuation) derive(EssenceTrend, history') → default' → snapshot(B', residual, default') → B_complete'
                                                                                                              -- next-cycle default + B_snapshot refresh (track + sense); EssenceTrend re-derivation is kind-general (count-only over the uniform disposition)
Phase 4 (optional): residual, BoundaryEssence → Qf(residual, FinalGateDisposition) → Stop → bulk_classify → DefinedBoundary
                                                                                                              -- final gate [Tool], reached via ExplicitTermination or Phase 1 substrate exhaustion; FinalGateDisposition = {UserSupplies, AIAutonomous}, every kind

Phase 0 → Phase 0b: boundary_undefined(T) = true                                            -- domain signal present → dispatch the kind before the loop
Phase 0 → deactivate: boundary_undefined(T) = false                                         -- no undefined boundary signal
Phase 0b sync_kind_route relay branch: single_dominant_kind(KindRouteMap) = true → relay captured_kind + basis, proceed (extension, NO turn yield) → continue to bind_kind   -- entropy→0 (option-set relay test): one kind dominates, foils route away; the captured kind is committed for the activation (a rare mis-relay is corrected by re-invoking /bound, not an in-loop redirect); certify stays fail-closed
Phase 0b sync_kind_route gated branch: single_dominant_kind(KindRouteMap) = false → Stop → captured_kind (constitution)                                                                      -- ≥2 viable hypotheses ∨ emergent/naming → mandatory Constitution gate
Phase 0b → Phase 1: certificate.status = pass ∧ BoundaryClassification bound                               -- kind captured (via relay or gate), fit certified, value-space frozen → enter the per-cycle loop
Phase 0b → deactivate (route): certificate.status = route                                   -- a sibling deficit owns the kind → route_away(RoutePair.target), residual untreated (kind out-of-scope for bound)
Phase 0b → deactivate (clean pre-loop abort): Esc                                           -- user exits at the kind-dispatch sync before loop-state init; no boundary_map / residual / cycle_n exists yet, so nothing to finalize and no DefinedBoundary is emitted (distinct from Phase 2/4 Esc, which finalizes BoundaryEssence at the current cycle_n)
Phase 0b → Phase 0b (re-sync): certificate.status = ambiguous ∨ KindBinding.atomicity = non-atomic
                                                                                            -- overlapping deficit fit OR compound kind → split / route / one-turn narrow disambiguation, then re-certify BEFORE binding values (fail-closed; never bind under ambiguity)
Phase 1 → Phase 2:  Sub-D[cycle_n] non-empty ∧ ¬auto_resolved                               -- per-cycle anchor domain surfaced, requires user judgment
Phase 1 → Phase 3:  Sub-D[cycle_n] non-empty ∧ auto_resolved                                -- definitive assignment found in substrate, skip Phase 2
Phase 1 → Phase 4:  Sub-D[cycle_n] empty ∧ Λ.residual ≠ ∅                                   -- substrate-exhaustion path to explicit bulk classify (residual remains)
Phase 1 → converge: Sub-D[cycle_n] empty ∧ Λ.residual = ∅ → DefinedBoundary = { map: Λ.boundary_map, kind: Λ.captured_kind }  (no fresh B' is integrated in this branch — emit the current complete boundary_map snapshot, complete by the round-local invariant, paired with the captured kind)                                    -- substrate exhausted, every surfaced domain already classified → DefinedBoundary directly (no empty Phase 4 gate)
Phase 2 → Phase 3:  A received                                                              -- per-cycle classification accepted
Phase 3 → Phase 1:  ¬termination_intent ∧ ¬Esc → derive default' → cycle_n += 1             -- continue loop with next-cycle default
Phase 3 → converge (implicit): TerminationIntent = ImplicitTermination → finalize(B', residual, default_at_surfacing | override) → emit DefinedBoundary
                                                                                            -- round-local terminator: Phase 2-surfaced default committed (NOT re-derived)
Phase 3 → Phase 4:  TerminationIntent = ExplicitTermination                                 -- user-judged satisfaction with explicit residual classification request
Phase 3 → deactivate (ungraceful):  Esc                                                     -- residual untreated, BoundaryEssence finalized at current cycle_n
Phase 4 → converge: bulk_classify(residual) completed → DefinedBoundary = { map: Λ.boundary_map, kind: Λ.captured_kind } (bulk_classify commits each FinalGateAnswer into Λ.boundary_map's final_gate_classified partition — the emitted map is complete by the round-local invariant, paired with the captured kind)                                       -- BoundaryMap + BoundaryEssence finalized
Phase 4 → deactivate (ungraceful):  Esc                                                     -- final gate aborted, residual untreated, BoundaryEssence finalized at current cycle_n

── LOOP ──
Pre-loop dispatch (Phase 0b, one-shot — runs once before the per-cycle loop opens):
  sync_kind_route(T) surfaces the KindRouteMap (≤3 seed hypotheses + emergent/naming path); the user captures the kind (recognize a seed, name an emergent, or extend/replace a seed).
  Extension fast-path (single-dominant-kind relay): when single_dominant_kind(KindRouteMap) holds (per the single_dominant_kind predicate (TYPES) and Rule 24) — present the captured kind + its basis (the dominating predicate + the foils' route-away) as relay text and proceed (the captured kind is committed for the activation), recording Λ.captured_kind with ZERO turn yields (mirrors /conduct's CT_default relay). The mandatory Constitution gate fires when single_dominant_kind is false — the default when in doubt; relay is the NARROW exception (Rule 24).
  bind_kind → certify (fail-closed) → bind_value_space. The captured kind FIXES BoundaryClassification for the whole activation; the per-cycle loop classifies object_ref(kind) over the frozen BoundaryClassification. BOTH branches (relay and gate) feed this same pipeline — the relay collapses only the kind-capture turn yield; a non-pass certificate still gets the full gated treatment. Re-sync on ambiguous/non-atomic; route_away (deactivate) when a sibling deficit owns the kind.

J = {next, terminate_implicit, terminate_explicit, esc}
  next:               ¬termination_intent ∧ ¬Esc → next-cycle default' (re-derive count-based from EssenceTrend, kind-general) → cycle_n += 1, Phase 3 → Phase 1 (per-cycle re-scan)
  terminate_implicit: TerminationIntent = ImplicitTermination (parsed from Phase 2 free response) → Phase 3 → converge with residual filled by default_at_surfacing (the Λ.default_for_residual value Phase 2 surfaced — NOT re-derived) or user-stated override
  terminate_explicit: TerminationIntent = ExplicitTermination (parsed from Phase 2 free response) → Phase 3 → Phase 4 (final gate)
  esc:                Esc → ungraceful deactivate (residual untreated)

Per-cycle re-scan: Phase 1 substrate scan (Read/Grep/Glob) re-executes each cycle; `Λ.domains_touched` (anchored ⊔ non-anchored ⊔ resolved/dismissed) is the dedup source — no domain surfaced twice.
Cycle 1 ordering: AI Impact ordering selects highest-impact domain.
Cycle k≥2 ordering: previous cycle's A[cycle_n-1] or free-response routes next cycle's domain selection frame; AI re-applies Impact ordering within the routed frame.

Answer types (members of the uniform disposition BoundaryClassification: UserSupplies/AIPropose/AIAutonomous/Dismiss) determine BoundaryMap entry, not loop path.
FinalGateAnswer (the uniform subset {UserSupplies, AIAutonomous} ⊆ BoundaryClassification, every kind) determines residual BoundaryMap entries at Phase 4.

Round-local BoundaryMap invariant: after each Phase 3 integrate, `Λ.boundary_map` snapshot is always complete — classified entries ∪ (residual ↦ default_for_residual). The complete snapshot is the round-local terminator: ImplicitTermination at any cycle commits the current snapshot as DefinedBoundary.

Convergence evidence: At convergence (Phase 3 ImplicitTermination ∨ Phase 4 completed ∨ substrate-exhaustion empty-residual), present transformation trace — per-cycle (Sub-D[k], Δessence[k], disposition[k]) for each anchored cycle k (k ranges over Λ.D_history — the cycles that produced a Sub-D; a substrate-exhaustion terminal scan produces no Sub-D and contributes no entry; disposition[k] ∈ BoundaryClassification), plus residual disposition:
  • ImplicitTermination: ∀ d ∈ residual: (d, default_for_residual_or_override) — cites the EssenceTrend / count-distribution basis (kind-general)
  • Phase 4 completion: ∀ d ∈ residual: (d, FinalGateAnswer(d))
  • substrate-exhaustion empty-residual: residual = ∅ — no residual disposition (every surfaced domain classified per-cycle)
BoundaryEssence is presented as separate session text artifact. Convergence is demonstrated, not asserted.

── CONVERGENCE ──
converge iff (Phase 3 ImplicitTermination ∨ Phase 4 completed ∨ substrate_exhaustion_empty_residual) ∧ ¬user_esc ∧ certificate.status = pass
  certificate gate:            convergence presupposes a passing DeficitFitCertificate (Phase 0b); a route/ambiguous certificate never reaches the loop, so DefinedBoundary is unreachable without an in-scope, fit-certified kind
  kind_dispatch_branch:        the captured kind reaches the loop via EITHER branch of Phase 0b sync_kind_route — the single_dominant_kind relay (extension, no turn yield) or the mandatory Constitution gate — and both flow through the fail-closed certificate, so convergence is branch-invariant: a relay-captured kind whose certificate is route (routes away/deactivates) or ambiguous (re-syncs the gate) never reaches the loop, exactly as the gated branch does
  Phase 3 ImplicitTermination: residual ↦ default_at_surfacing (the Phase 2-surfaced default — NOT the re-derived value) or user-stated override; emit DefinedBoundary directly from current B_snapshot
  Phase 4 completed:           bulk_classify(residual) finished — reachable via Phase 3 ExplicitTermination OR Phase 1 substrate exhaustion with residual remaining
  substrate_exhaustion_empty_residual: Phase 1 substrate exhausted (Sub-D empty) ∧ Λ.residual = ∅ — every surfaced domain already classified per-cycle, nothing remains for Phase 4 → emit DefinedBoundary directly (the `residual = ∅` terminal of the DefinedBoundary type)
  user_esc:                    user exits via Esc key at any Phase 2 or Phase 4 (ungraceful, residual untreated, BoundaryEssence finalized at current cycle_n)
  route_deactivate:            Phase 0b certificate.status = route → route_away(RoutePair.target), non-convergent exit (kind out-of-scope for bound; no DefinedBoundary emitted)
  phase0b_esc:                 Phase 0b sync_kind_route Esc → clean pre-loop deactivate before loop-state init; no boundary_map / residual / cycle_n exists, nothing to finalize, no DefinedBoundary emitted — a non-convergent pre-loop exit (cf. route_deactivate; distinct from user_esc, the in-loop Phase 2/4 exit that finalizes BoundaryEssence)

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Probe (sense)        → Internal analysis (silent — no user output; heuristic boundary-undefined detection + session-context scan for a prior BoundaryMap as Λ.B_prior (DETECTION only — Phase 0 seeds nothing; a kind-matched prior is seeded at Phase 0b step 4, a kind-mismatched prior stays advisory-only); notice visibility deferred to Phase 2 cycle 1 surfacing)
Phase 0 ZeroSignalConfirm (constitution) → present (conditional: Bᵢ = ∅; zero-signal finding + reasoning; Confirm/Reopen(Domain) — Rule 12)
Phase 0b sync_kind_route (constitution) → present (GATED branch — fires when single_dominant_kind = false: ≥2 kind hypotheses stay viable OR an emergent/naming capture is needed; up-front KindRouteMap — ≤3 recognizable kind hypotheses each with positive_predicate + evidence + differential_future + route-away conditions, plus an emergent/naming free-response path; named kinds are PRIORS not a closed set; user captures the kind by recognizing a seed, naming an emergent, or extending/replacing a seed; Esc → deactivate)
Phase 0b sync_kind_route_relay (extension) → TextPresent+Proceed (RELAY branch — fires when single_dominant_kind = true, per the single_dominant_kind predicate (TYPES) and Rule 24. Present the captured kind + its basis as relay text and proceed, recording Λ.captured_kind WITHOUT a turn yield; the captured kind is committed for the activation (like the gated branch) — a rare mis-relay is corrected by re-invoking /bound, not an in-loop redirect transition. Mirrors /conduct's Phase 2 CT_default_relay. The fail-closed certify STILL runs on this branch — a non-pass DeficitFitCertificate gets the full gated treatment (route → route_away/deactivate, ambiguous → re-sync), so the relay never bypasses deficit-fit)
Phase 0b certify (sense)     → Internal analysis (extension — fail-closed DeficitFitCertificate; deterministic check of KindBinding.positive_predicate against the documented sibling-deficit scopes (the registered deficit inventory + edge topology read together with each sibling protocol's deficit: declaration): owner = BoundaryUndefined when in-scope; status = pass | route | ambiguous; basis = the registry deficit/edge fit, cited at Phase 2 cycle 1's first surfacing)
Phase 0b bind_value_space (track) → Internal state update (extension — generate the uniform settlement disposition {UserSupplies, AIPropose, AIAutonomous, Dismiss} ONLY after certificate.status = pass; same coproduct for every kind; relay / dead-signal test applied; freeze BoundaryClassification for the activation. On status = route → route_away(target), deactivate; on status = ambiguous ∨ non-atomic → re-sync Phase 0b before binding)
Phase 1 Ctx   (observe)      → Read, Grep, Glob (per-cycle re-scan: CLAUDE.md, project rule files, prior session context; Λ.D_history dedup)
Phase 2 Qc    (constitution) → present (mandatory; per-cycle classification over BoundaryClassification + captured-kind label + Δessence + cycle_n + current B_snapshot + current default_for_residual with count-distribution basis cite + cycle-1 certificate-fit basis + cycle-1 notice when Λ.B_prior non-empty (seed notice when kind-matched, advisory-only notice when kind-mismatched) + free-response termination affordance with implicit/explicit sub-signals + ambiguity-confirmation relay when parse is uncertain; Esc → loop termination, not an Answer)
Phase 3 parse  (sense)       → Internal analysis (TerminationIntent parsing into ImplicitTermination(override?) / ExplicitTermination / no-signal; ambiguous parse triggers one-turn relay confirmation before routing)
Phase 3       (track)        → Internal state update (integrate(typed_A, B, BoundaryEssence) → B', BoundaryEssence'; on loop continuation only — derive(EssenceTrend, history') → default' (kind-general, count-only); refresh B-snapshot for next cycle)
Phase 4 Qf    (constitution) → present (residual bulk classification over FinalGateDisposition = {UserSupplies, AIAutonomous}, every kind; reached via ExplicitTermination or substrate exhaustion; Esc → ungraceful exit at final gate)
converge      (extension)    → TextPresent+Proceed (captured-kind + DeficitFitCertificate basis + per-cycle trace + residual disposition trace + BoundaryEssence artifact; proceed with defined boundary)

── MODE STATE ──
Λ = { phase: Phase, T: TaskScope,
      kind_route_map: Optional(KindRouteMap),          -- Phase 0b dispatch sync (≤3 seed hypotheses + emergent path)
      captured_kind: Optional(Kind),                   -- the kind the dispatch settled on (recognize-seed | name-emergent | extend/replace-seed); set via the single_dominant_kind relay (extension, no turn yield) OR the mandatory Constitution gate
      kind_binding: Optional(KindBinding),             -- fields: label, positive_predicate, evidence, origin, atomicity
      certificate: Optional(DeficitFitCertificate),    -- fields: owner, in_scope_if, route_if[], evidence, status; fail-closed gate — status must = pass before value_space binds
      value_space: Optional(ValueSpace),               -- the uniform settlement disposition; frozen for the activation once certificate.status = pass (UserSupplies / AIPropose / AIAutonomous / Dismiss, same for every kind)
      B_prior: Optional(SeededPrior),                  -- hermeneutic seed detected at Phase 0 (a SeededPrior — prior BoundaryMap plus the kind it was produced over); the carried kind (B_prior.kind) is what Phase 0b step 4 tests to gate seeding to same-kind only (kind-mismatched prior map → advisory, not seeded)
      cycle_n: Nat,
      domains_touched: Set(Domain),                    -- accumulated across cycles (Phase 1 surfacing union)
      D_history: List<Sub-D>,                          -- per-cycle dimension projections (dedup source)
      essence_history: List<Δessence>,                 -- per-cycle delta accumulation
      boundary_essence: BoundaryEssence,               -- accumulated essence text
      essence_trend: EssenceTrend,                     -- ExtensionTrend | ConstitutionTrend | MixedTrend; updated each Phase 3, kind-general (count-only over the uniform disposition)
      default_for_residual: BoundaryClassification member,            -- provisional residual disposition surfaced each Phase 2 (a member of the uniform disposition); DefaultClassification re-derived from essence_trend each cycle, every kind
      context_resolved: Set(Domain),                   -- Phase 1 auto-resolved (Bᵣ-equivalent, per-cycle) ∪ B_prior-seeded domains (Phase 0b step 4 init; basis: "prior classification" — entries mutable across cycles, may be re-surfaced by Phase 1 if a stale-prior signal is detected)
      user_responded: Set(Domain),                     -- Phase 2 BoundaryClassification classification completed (the uniform 4-value disposition)
      final_gate_classified: Set(Domain),              -- Phase 4 bulk classification completed
      dismissed: Set(Domain),
      residual: Set(Domain),                           -- unclassified subset of domains_touched (implicit-delegation candidates; provisionally mapped to default_for_residual in boundary_map snapshot)
      boundary_map: BoundaryMap,                       -- always-complete after each Phase 3: classified entries ∪ (residual ↦ default_for_residual)
      final_gate_answers: Map(Domain, FinalGateAnswer),
      history: List<(Domain, A)>,
      active: Bool, cause_tag: String }
-- Invariant: domains_touched = context_resolved ∪ user_responded ∪ final_gate_classified ∪ dismissed ∪ residual (pairwise disjoint)
-- Invariant: boundary_map = classified_entries(context_resolved ∪ user_responded ∪ dismissed ∪ final_gate_classified) ∪ (residual ↦ default_for_residual) — round-local completeness

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). registered dependency edges preserved. Dimension resolution emergent via session context.
Dispatch-first rationale: BoundaryMap is a multi-consumer router (its downstream advisory consumers read it, per the registered advisory edges). The captured kind must settle BEFORE the per-cycle loop opens — hence bound carries the up-front Phase 0b sync rather than emerging the kind cycle-by-cycle: downstream consumers reading a stable kind cannot tolerate a kind that shifts mid-loop. The DeficitFitCertificate (checked against the registered deficit/edge graph) keeps a misfit kind from entering the shared map — a kind a sibling deficit owns is routed away (deactivate) instead of polluting the multi-consumer signal.
Hermeneutic carry-over (kind-aware): an optional B_prior input (prior BoundaryMap detected in session context, together with the kind it was produced over) seeds the new invocation ONLY when its kind matches the captured kind (same-kind — same boundary question). Every kind shares the uniform disposition, so a mismatched prior's values are type-compatible; the guard is SEMANTIC: a kind-mismatched prior answers a DIFFERENT boundary question, so it is surfaced as advisory context, NOT seeded into boundary_map (seeding it would commit a wrong-question disposition into the multi-consumer signal). Seed entries are mutable in subsequent cycles and BoundaryEssence is re-crystallized from the current task scope. The seed enables a feedback loop where a downstream observation refines a prior BoundaryMap through re-invocation.
Round-local BoundaryMap composition: each Phase 2 cycle produces a complete BoundaryMap (classified entries ∪ residual ↦ default_for_residual). The complete snapshot is citable as scope text for a realization-layer turn-condition primitive — the AIAutonomous and AIPropose entries delineate an Extension-progression scope whose exhaustion is a natural completion condition orthogonal to the in-protocol satisfaction signal that emits DefinedBoundary.
```

## Core Principle

**Definition over Assumption**: When a decision's boundary — who decides, which way it should go, how wide it reaches, or which category frames it — is unsettled, explicitly define it rather than assuming a default. Each decision point deserves its own boundary definition. The purpose of boundary probing is to produce a shared BoundaryMap — a Transactive Memory directory that makes explicit who knows what, how each boundary is settled, and where calibration is needed.

**Stigmergy signal principle**: BoundaryMap is a signal (TMS directory pointer), not a payload. It carries a settlement disposition per boundary — the signal exists in session context via Session Text Composition, and downstream behavior emerges from LLM reading the disposition in conversation context. The disposition records HOW each boundary value gets settled downstream (not who authored this `/bound` answer — Phase 2 is always user-classified), and its behavioral signal is the SAME for every boundary kind: **User-supplies** signals standard context collection (downstream gates present open questions); **AI-proposes** signals ENRICH-AND-PRESENT (expanded context collection with candidate generation); **AI-autonomous** signals RESOLVE-OR-PRESENT (expanded context collection with resolution attempt); **Dismiss** signals settle-by-default (proceed with the stated default — a committed disposition, not a skip). The BoundaryMap (paired with its captured kind, per the DefinedBoundary = { map, kind } contract) and BoundaryEssence are output as separate session text artifacts; no structured data channel is required. No explicit receiver implementation is needed in downstream protocol definitions — the session context is the environment, and behavioral adjustment is the emergent response.

**Multi-consumer architectural independence**: BoundaryMap is consumed by its downstream advisory consumers (per the registered advisory edges) — Aitesis as gate threshold, Prothesis as framework filter, Syneidesis as gap relevance filter, Prosoche as risk evaluation threshold, Euporia as substrate scope narrowing, Analogia as mapping-domain narrowing, Elenchus as high-leverage source narrowing, Diylisis as recipient-relevance narrowing, Hyphegesis (`/conduct`) as conduct scope narrowing, Diairesis as joint-candidate narrowing — which moves are in-scope. This shared consumption is why Horismos requires independent protocol status rather than absorption into any single consumer; the boundary is a multi-consumer signal, not a private operation of a specific downstream. Independent invocation preserves the symmetric advisory relationship across all its consumers.

## Mode Activation

### Activation

AI probes for boundary-undefined domains before execution OR user calls `/bound`. Probing is silent (Phase 0); the boundary **kind** is then dispatched up-front (Phase 0b) — **relayed as Extension** when one kind hypothesis dominates (entropy→0, the single-dominant-kind fast-path), otherwise settled via Cognitive Partnership Move (Constitution) — through a fail-closed deficit-fit certificate that runs on both branches; per-domain classification by the uniform settlement disposition requires user interaction (Phase 2) unless the domain is auto-resolved from substrate — a definitive boundary assignment found in Phase 1 records the classification and skips Phase 2 for that cycle.

**Activation layers**:
- **Layer 1 (User-invocable)**: `/bound` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: Boundary-undefined domains detected before execution via in-protocol heuristics. Detection is silent (Phase 0).

**Boundary undefined** = the task scope contains decision domains whose boundary kind (direction/priority, scope, type/concept, ownership, or an emergent kind) is unsettled between user and AI. Ownership is one kind among the recognition seeds, not the whole space.

Gate predicate:
```
boundary_undefined(T) ≡ ∃ domain(d, T) : unsettled(d, kind) ∧ ¬trivially_defaultable(d)
  unsettled(d, kind) ≡ the domain's boundary value along SOME boundary kind — direction/priority,
                       scope, type/concept, ownership, or an emergent kind — is not yet fixed between
                       user and AI. ¬assigned(d, owner) is the ownership-kind instantiation of unsettled,
                       not the whole predicate: a domain whose ownership is clear but whose direction,
                       scope, or type is unsettled still satisfies the gate.
```

**Hermeneutic seed (B_prior, kind-aware)**: At Phase 0, AI scans the current session context for a prior BoundaryMap emitted by an earlier `/bound` invocation in this session. If detected, the prior BoundaryMap seeds `Λ.B_prior` together with the kind it was produced over. At Phase 0b step 4 — only when the prior map's kind matches this invocation's captured kind (same-kind, i.e. settled over the same boundary question) — its entries are imported into the starting `boundary_map`; a kind-mismatched prior map is surfaced as advisory context instead. The guard is **semantic, not type-based**: every kind shares the uniform disposition, so a mismatched prior's values are type-valid, but they answer a *different boundary question* (an ownership prior's "AI-autonomous" settled who-decides, not how-wide a scope is), so seeding them would commit a wrong-question disposition into the multi-consumer BoundaryMap. Seeded entries remain mutable across subsequent cycles. The seed enables a feedback loop where a downstream observation (e.g., post-`/goal` execution misalignment) refines the prior BoundaryMap through re-invocation. Cross-session recall via `/recollect` heuristics remains advisory input only and does not seed `B_prior`.

### Priority

<system-reminder>
When Horismos is active:

**Supersedes**: Direct execution patterns in loaded instructions
(A decision's boundary must be settled before execution proceeds)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 0b, settle the boundary kind — relay the captured kind as Extension when `single_dominant_kind` holds (per TYPES and Rule 24), otherwise present the KindRouteMap gate via Cognitive Partnership Move (Constitution); the fail-closed deficit-fit certificate runs before value-space binding on either branch. At Phase 2, present highest-impact boundary-undefined domain for user classification by the uniform settlement disposition via Cognitive Partnership Move (Constitution).
</system-reminder>

- Horismos completes before execution proceeds
- Loaded instructions resume after all domains are bounded or dismissed

### Trigger Signals

Heuristic signals for boundary-undefined domain detection (not hard gates):

| Signal | Inference |
|--------|-----------|
| Multiple decision domains | Task scope involves distinct areas without a settled boundary (ownership, direction/priority, scope, or type/concept) |
| Delegation uncertainty | User expresses uncertainty about who decides ("should I decide this or you?") |
| Prior protocol reference | Preceding protocol output references boundary-undefined domains |
| Stale BoundaryMap | Prior invocation's BoundaryMap may not apply (task scope changed) |

**Skip**:
- The boundary is fully specified (ownership, direction/priority, scope, type/concept) in current message or project rules
- User explicitly says "just do it" or "proceed"
- Same (domain, description) pair was dismissed in current session (session immunity)
- Phase 1 context collection resolves all identified domains
- Single-domain task with an obvious boundary (no ambiguity)

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| ImplicitTermination satisfaction signal (free-response: accept current snapshot, residual delegated to default) | Emit DefinedBoundary with classified entries + (residual ↦ default_for_residual or user-stated override), BoundaryEssence finalized at current cycle_n |
| ExplicitTermination satisfaction signal (free-response: proceed to Phase 4 for residual classification) → Phase 4 completed | Emit DefinedBoundary with classified entries + (residual ↦ FinalGateAnswer), BoundaryEssence finalized |
| Phase 1 substrate exhaustion with residual remaining → Phase 4 completed | Same as ExplicitTermination outcome; AI-detected via empty Sub-D rather than user-signaled |
| Phase 1 substrate exhaustion with `residual = ∅` | Emit DefinedBoundary directly — every surfaced domain already classified per-cycle, nothing for Phase 4; BoundaryEssence finalized at current cycle_n |
| Phase 0b certificate `status = route` | Route-away exit — a sibling deficit owns the captured kind; emit the `RoutePair.target` (e.g., `/inquire`, `/gap`, `/frame`, `/ground`), no DefinedBoundary; the loop never opens |
| User Esc key (Phase 2 / Phase 4, in-loop) | Ungraceful exit — residual untreated, BoundaryEssence finalized at current cycle_n |
| User Esc key (Phase 0b, pre-loop) | Clean deactivate before the loop opens — no boundary_map / residual / cycle_n initialized yet, so nothing to finalize and no DefinedBoundary emitted (distinct from the in-loop Esc above) |

## Domain Identification

Domains are identified dynamically per task — taxonomy emerges from the task context. Each domain is characterized by:

- **name**: The decision area where the boundary is unsettled along some kind (direction/priority, scope, type/concept, ownership, or emergent)
- **description**: What specifically requires boundary definition
- **evidence**: Contextual evidence collected during Phase 1 that enriches classification quality

### Impact Ordering

Impact reflects how much defining this domain's boundary would narrow the remaining boundary-undefined space and affect downstream protocol operation.

| Level | Criterion | Action |
|-------|-----------|--------|
| **High** | Multiple downstream protocols depend on this boundary | Anchor first cycle |
| **Medium** | One downstream protocol affected or moderate scope impact | Anchor subsequent cycle |
| **Low** | Localized scope, minimal downstream effect | Defer to final gate (Phase 4) bulk classification |

Impact is relational, not intrinsic: the same domain may be High in one task scope and Low in another, depending on what other domains exist and which protocols are expected to activate downstream.

**Cycle 1 anchor selection**: AI Impact ordering selects the highest-impact domain as `Sub-D[1]` anchor.
**Cycle k≥2 anchor selection**: previous cycle's answer (`A[cycle_n-1]`) or free-response routes the next cycle's substrate scan frame, narrowing toward domains adjacent to the just-classified boundary or refocusing per user direction. AI re-applies Impact ordering within the routed frame. (Detailed per-answer-type heuristics in Phase 1 prose below.)

Only one domain anchored per cycle. Remaining undischarged domains accumulate into `Λ.residual` and are bulk-classified at Phase 4 when the user signals satisfaction.

## Protocol

### Phase 0: Boundary Existence Checkpoint (Silent)

Verify task scope contains boundary-undefined signal and optionally seed a prior BoundaryMap. This phase is **silent** — no user interaction and no user-visible output. Any user-facing notice about the seed is deferred to Phase 2 cycle 1.

1. **Probe task scope** `T` for boundary-undefined signal: architecture choices, configuration preferences, quality standards, delegation scope, convention decisions, risk tolerance
2. **Check boundary-kind signal**: assess whether ANY boundary-kind signal is unsettled (`unsettled(d, kind)`) — direction/priority, scope, type/concept, ownership, or an emergent kind. Ownership is one kind among the seeds, not the whole check (existence check, not exhaustive enumeration — full domain set is **cycle-emergent** via Phase 1 per-cycle re-scan)
3. **Scan for B_prior seed (scoped detection, kind-aware)**: inspect current session context for a prior BoundaryMap emitted by an earlier `/bound` invocation in this same session. The detection target is structurally a Horismos `DefinedBoundary` artifact (BoundaryMap structure: `object_ref(kind) → BoundaryClassification` entries with cited basis — always `domain → disposition`) emitted at a previous `/bound` convergence — NOT a `/recollect` recall artifact and NOT a hypomnesis store (prior-session recall indices) entry. `/recollect`-recalled classifications stay in the "Cross-session enrichment" advisory channel; they do not populate `Λ.B_prior`. If a `/bound` emit is detected AND the current task scope is a refinement or feedback iteration of the prior scope, bind `Λ.B_prior` to that BoundaryMap **together with the prior map's KIND** (the boundary kind it was produced over); otherwise leave `Λ.B_prior = ⊥`. Capturing the prior map's kind here is what lets Phase 0b step 4 decide whether the seed answers the SAME boundary question as this invocation's captured kind — same-kind is checked at seed time (step 4), not at detection time, because the captured kind is not yet settled at Phase 0.
4. If no boundary-undefined signal: present finding with reasoning for user confirmation before proceeding (Horismos not activated)
5. If boundary-undefined signal present: proceed to Phase 0b (KIND dispatch). Loop-state initialization (`cycle_n`, `BoundaryEssence`, `essence_trend`, `default_for_residual`, `boundary_map`, the `B_prior` partition seed) is deferred to Phase 0b step 4, after the kind is captured and the certificate passes — the value-space is the uniform disposition (kind-independent), captured here only so the certificate gate precedes binding.

**Probe scope**: Current task scope, conversation history, CLAUDE.md rules, project rule files, project conventions, prior `/bound` convergence emit in session text. Does NOT modify files or call external services.

**Per-cycle-emergent semantics**: Phase 0 records the existence signal only. Per-cycle re-scan (Phase 1) discovers domains incrementally, enabling user-judged termination at any cycle as the loop progresses.

### Phase 0b: Kind Dispatch + Deficit-Fit Certificate (Constitution gate with single-dominant-kind relay + fail-closed certificate)

Before the per-cycle loop opens, **dispatch the boundary kind** through the shared meta-backbone pipeline (KindBinding → fail-closed DeficitFitCertificate → uniform settlement disposition). bound is **dispatch-first**: BoundaryMap is a multi-consumer router (its downstream advisory consumers), so the kind must settle before any downstream consumer reads it — bound therefore carries an up-front sync rather than emerging the kind cycle-by-cycle.

1. **Dispatch the boundary kind (Constitution gate, with single-dominant-kind relay)** — Surface up to three recognizable kind hypotheses plus an emergent/naming free-response path. Each hypothesis carries a positive predicate, cited evidence, a differential future (what the loop classifies and how downstream consumers read it under this kind), and route-away conditions. The named kinds are **priors (recognition seeds), NOT a closed coproduct** (Rule 5: no fixed taxonomy) — the user may recognize a seed, name an emergent kind, or extend/replace a seed.
   - **Seeds, ordered by recognition salience** (recognition priors only; the order is a design prior, not an empirical usage claim): **direction/priority** (the most salient prior — which way a decision should go, what takes precedence), **scope** (how wide the decision reaches), **type/concept** (which category or concept frames the decision), **ownership** (who decides — user / AI / autonomous; the least salient, a trailing seed). *membership is NOT a first-class kind.*
   - **Single-dominant-kind relay (Extension fast-path)**: Before opening the gate, test the kind hypotheses against the `single_dominant_kind` predicate (TYPES; Rule 24). When it holds, do NOT open the gate: present the captured kind + its basis (the dominating predicate and the foils' route-away) as **relay text** and **proceed**, recording `Λ.captured_kind` without a turn yield (mirrors `/conduct`'s `CT_default` relay). The captured kind is **committed for the activation** (like the gated branch's captured kind); a rare mis-relay is corrected by re-invoking `/bound`, not an in-loop transition. When the test fails, **default to the mandatory Constitution gate** — the relay is the NARROW exception (Rule 24).
   - Capture the user's response (gated branch) or the relayed dominating hypothesis (relay branch) as `Λ.captured_kind`.
2. **Bind the kind** — `Λ.kind_binding = { label: captured_kind, positive_predicate, evidence, origin ∈ {seed, emergent}, atomicity }`. If `atomicity = non-atomic` (the captured kind bundles two distinct boundary concerns), **split or route before continuing** — re-surface the KindRouteMap with the split hypotheses; bind a value-space only to an atomic kind.
3. **Certify deficit fit (fail-closed)** — `Λ.certificate = certify(kind_binding, registry)` where the registry is the documented sibling-deficit scopes — the registered deficit inventory + edge topology read together with each sibling protocol's `deficit:` declaration (its SKILL.md `deficit:` line). Check the captured kind's positive predicate against those sibling-deficit scopes:
   - **`status = pass`** — the kind's positive predicate fits `BoundaryUndefined` (certificate `owner = BoundaryUndefined`) and no sibling deficit claims it. Proceed to step 4.
   - **`status = route`** — a sibling deficit owns the kind. Emit the matching `RoutePair.target` and deactivate (the kind is out-of-scope for bound). Route targets: missing pre-execution fact → `/inquire` (ContextInsufficient); an unnoticed decision gap rather than a boundary-kind settlement → `/gap` (GapUnnoticed); framework absent for the decision → `/frame` (FrameworkAbsent); cross-domain mapping uncertain → `/ground` (MappingUncertain).
   - **`status = ambiguous`** — overlapping deficit fit (the predicate plausibly fits BoundaryUndefined AND a sibling deficit). **Do NOT bind values.** Split, route, or ask one narrow disambiguation question, then re-certify (re-enter Phase 0b). Fail-closed: binding never proceeds under ambiguity.
4. **Bind the uniform value-space + initialize loop state** — ONLY after `certificate.status = pass`: bind `Λ.value_space = BoundaryClassification = {UserSupplies, AIPropose, AIAutonomous, Dismiss}` — the **same settlement disposition for every kind** (the captured kind set the content each option is about, not the coproduct); apply the option-set relay / dead-signal test and freeze the set for the activation. Then initialize loop state: `cycle_n = 1`, `BoundaryEssence = ""`, `Λ.default_for_residual = default_for(captured_kind) = AIAutonomous` (Extension-default initial, every kind), `Λ.essence_trend = MixedTrend` (the per-cycle EssenceTrend → DefaultClassification derivation machinery of Phase 3 is **kind-general** — it reads disposition counts, never kind-specific content). Seed the prior BoundaryMap **only when its kind matches the captured kind** (same-kind — settled over the same boundary question): if `Λ.B_prior ≠ ⊥ ∧ kind(Λ.B_prior) = captured_kind`, set `Λ.boundary_map = Λ.B_prior.map ∪ ∅` and initialize the partition: `Λ.context_resolved = domain(Λ.B_prior.map)`, `Λ.domains_touched = domain(Λ.B_prior.map)` — seeded domains enter the `context_resolved` partition with basis "prior classification" so the MODE STATE partition invariant holds from Phase 0b onwards. If `Λ.B_prior ≠ ⊥ ∧ kind(Λ.B_prior) ≠ captured_kind` (kind-mismatched prior map), do NOT seed — the guard is semantic: the prior's dispositions are type-valid (same coproduct) but answer a *different boundary question*, so seeding them would commit a wrong-question disposition into the multi-consumer map; instead set `Λ.boundary_map = ∅` and surface the prior map as **advisory context** at Phase 2 cycle 1 (a non-structural note that a prior boundary exists under a different kind), not as a structural seed. When no prior map is present (`Λ.B_prior = ⊥`), `Λ.boundary_map = ∅`. Proceed to Phase 1.

**Certificate basis visibility**: the certificate's deficit-fit basis (which registry deficit/edge the kind matched) is cited at Phase 2 cycle 1's first surfacing — relay (Extension), deterministic against the registry. The dispatch sync (step 1) is **Constitution in the gated branch** — the user constitutes which kind the boundary work is about — and **Extension (relay) in the single-dominant-kind branch**, where the kind hypotheses reduce to one analytically-correct kind (entropy→0) and the captured kind is surfaced as relay text rather than gated. The fail-closed `certify` (step 3) runs identically on **both** branches — a relay-captured kind whose certificate is `route` (routes away/deactivates) or `ambiguous` (re-syncs the gate) is handled exactly as on the gated branch, so the relay never bypasses deficit-fit.

**Backbone discipline**: the schema (KindBinding / DeficitFitCertificate / value-space binding) is ONE canonical definition shared across protocols; bound instantiates only `object_ref(kind)` (= Domain, every kind), `local_value_space` (= BoundaryClassification, the uniform settlement disposition), and the guard routing targets (the RoutePairs above). Same field names, same fail-closed statuses, same certificate-before-binding order — matching the euporia / epharmoge twins, whose value-spaces are likewise uniform coproducts over an emergent object_ref.

### Phase 1: Per-Cycle Context Collection + Anchor Selection

Re-scan substrate for the current cycle and select one anchor domain (`Sub-D[cycle_n]`).

1. **Per-cycle re-scan** — Call Read/Grep/Glob for boundary signals in CLAUDE.md, project rule files, project configuration. Skip domains already in `Λ.domains_touched` (single-source dedup — covers `Λ.D_history ∪ Λ.context_resolved ∪ Λ.user_responded ∪ Λ.dismissed ∪ Λ.residual` per the MODE STATE invariant). **Stale-seed re-surface**: when a re-scan signal contradicts an existing `B_prior`-seeded entry in `Λ.context_resolved` (e.g., the current substrate shows the seed's classification no longer fits — new convention, deleted file, shifted scope), remove that entry from `Λ.context_resolved` AND from `Λ.domains_touched` (the dedup source — otherwise steps 2/5 would mask the domain as already-touched and block re-processing) AND remove its stale classification from `Λ.boundary_map` (so the round-local `boundary_map` invariant holds — the re-surfaced domain is unclassified until re-anchored or re-accumulated, when it re-enters `boundary_map` with a fresh classification or the residual default) and append the domain to the newly-surfaced set so anchor selection (step 2) and non-anchored accumulation (step 5) can re-process it; it re-enters `Λ.domains_touched` when re-anchored (step 6) or accumulated into residual (step 5), so the partition invariant holds after the cycle; the seed's mutability provision applies. This is the mechanism that closes the feedback loop claimed by COMPOSITION's hermeneutic carry-over — stale seeds become candidates for re-classification, not invisible holdovers.
2. **Anchor selection** — From newly-surfaced (not in `Λ.domains_touched`) domains:
   - **Cycle 1**: AI Impact ordering selects highest-impact domain as `Sub-D[1]`. When `Λ.B_prior` is non-empty AND kind-matched (`B_prior.kind = captured_kind` — only a kind-matched prior was seeded, so only it has entries that can be stale; a kind-mismatched advisory prior seeds nothing and does not steer anchor preference), Impact ordering may prefer domains where a prior classification appears stale relative to the current task scope (refinement target — stale seeds re-surfaced via step 1's re-surface mechanism are candidate anchors).
   - **Cycle k≥2**: previous cycle's answer `A[cycle_n-1]` or free-response routes the substrate scan frame; the routed frame must narrow or refocus relative to the just-classified boundary's neighborhood (not duplicate the prior cycle's frame). Per-answer-type heuristics inform AI judgment but are not normative: `Dismiss` deprioritizes the topic cluster the dismissed domain belonged to; `UserSupplies`/`AIPropose`/`AIAutonomous` narrow toward adjacent unclassified domains in the same cluster. AI re-applies Impact ordering within the routed frame to select `Sub-D[cycle_n]`.
3. **Context enrichment** — For the anchor domain, collect evidence (file/line citations, rule references, conflicting signals).
4. **Auto-resolve check** — If anchor domain has definitive boundary assignment found in substrate: set `auto_resolved = true` and append the anchor to `Λ.context_resolved` and `Λ.boundary_map` (with cited basis). This records ONLY the classification — steps 5–6 (non-anchored residual accumulation and the anchor `Λ.D_history` / `Λ.domains_touched` commit) still run this cycle; auto-resolve skips ONLY the Phase 2 user gate, not the per-cycle accumulation/commit. The exit signal (`Phase 1 → Phase 3` vs `Phase 1 → Phase 2`) is emitted at step 7, so the anchor's `Λ.D_history` / `Λ.domains_touched` commit happens exactly once (step 6) and surfaced non-anchored domains are never lost.
5. **Non-anchored domain accumulation** — Append every other surfaced-but-not-anchored domain to BOTH `Λ.residual` AND `Λ.domains_touched` (preserves dedup invariant). Residual domains receive provisional classification `Λ.default_for_residual` in the current `boundary_map` snapshot view; the provisional classification is committed if the user signals ImplicitTermination, or overwritten by `FinalGateAnswer` if Phase 4 is entered.
6. **Anchor commit** — Append `Sub-D[cycle_n]` to `Λ.D_history` and `Λ.domains_touched`.
7. **Emit the cycle's anchor-exit signal**: if `auto_resolved`, signal `Phase 1 → Phase 3` (anchor classified from substrate — skip the Phase 2 user gate, carry the substrate-settled classification into Phase 3); else (anchor enriched, not auto-resolved), signal `Phase 1 → Phase 2`.
8. If no new domains surface this cycle (substrate exhausted): if `Λ.residual ≠ ∅`, signal `Phase 1 → Phase 4` (substrate-exhaustion path to explicit bulk classify); if `Λ.residual = ∅` (every surfaced domain already classified per-cycle), signal `Phase 1 → converge` directly — there is nothing for Phase 4 to classify, so emit DefinedBoundary without an empty final gate.

**Scope restriction**: Read-only investigation only. No file modifications.

### Phase 2: Per-Cycle Classification + Essence Surfacing + B Snapshot (Constitution)

**Present** the cycle's anchor domain (`Sub-D[cycle_n]`), accumulated essence (`Δessence[k-1]`), cycle counter, and the round-local complete BoundaryMap snapshot with current implicit-delegation default via Cognitive Partnership Move (Constitution).

**Surfacing format** (kind-general: the four settlement-disposition options below are the SAME for every captured kind; the captured kind sets the question phrasing and each option's content — the ownership wording is shown as the illustrative instance):

Present as text output:
- **Cycle**: `cycle_n` (always visible)
- **Prior BoundaryMap seeded** (cycle 1 only, when `Λ.B_prior ≠ ⊥ ∧ kind(Λ.B_prior) = captured_kind`): list the `Domain → disposition` entries imported from B_prior with their prior-classification basis. This is the user's first user-visible notice of the seed (Phase 0 was silent); presented BEFORE the anchor so the seed context is established for cycle 1's anchor selection. When `Λ.B_prior ≠ ⊥ ∧ kind(Λ.B_prior) ≠ captured_kind` (kind-mismatched prior map), surface it instead as an **advisory note** ("a prior boundary exists under a different kind, not seeded") — NOT a structural seed entry.
- **Anchor domain**: [Sub-D[cycle_n].domain.name] — [description]
- **Substrate evidence**: [evidence cited from Read/Grep/Glob with file:line]
- **Boundary essence so far** (`BoundaryEssence`): [accumulated crystallized form of the responsibility boundary space — empty at cycle 1, refined cumulatively. A kind-matched B_prior seed seeds the boundary_map but does NOT pre-populate BoundaryEssence — essence is re-crystallized from the current task scope (a kind-mismatched prior is advisory-only and seeds neither).]
- **Δessence proposed for this cycle**: [how this domain's classification refines the abstract responsibility boundary essence]
- **Current BoundaryMap snapshot** (round-local complete view; entries are `Domain → disposition`):
  - Classified entries: [list of (Domain → disposition) for context_resolved ∪ user_responded ∪ dismissed]
  - Residual entries (provisional, ↦ default): [list of (Domain → default_for_residual)]
- **Implicit-delegation default** (`default_for_residual`, a member of `BoundaryClassification`): [current default_for_residual value]. The value is derived from EssenceTrend = [ExtensionTrend | ConstitutionTrend | MixedTrend] (kind-general — count-only over the dispositions classified so far):
  - **Cycle 1 basis cite (mandatory format)**: when `cycle_n = 1`, the cite MUST read: "MixedTrend (cycle 1 initialization — no classification history; Extension-default fallback)". Do NOT fabricate a count distribution or essence-trajectory citation at cycle 1.
  - **Cycle k ≥ 2 basis cite**: count distribution of classified entries (e.g., "2 × UserSupplies, 3 × AIAutonomous, 0 × AIPropose, 1 × Dismiss → AIAutonomous count dominant → ExtensionTrend → AIAutonomous"). Count distribution is the sole derivation basis (count-based only; no textual-lean interpretation).

Then **present** (the question is phrased for the captured kind; the four disposition options are the same for every kind — bracketed text fills each option with this kind's content):

```
How should this domain's [captured-kind] boundary be settled?

Options:
1. **User-supplies** — I already have the boundary value: [what the user would supply]
2. **AI-proposes** — AI drafts candidates, I select/steer: [what AI would propose]
3. **AI-autonomous** — AI settles it within scope: [what AI would determine]
4. **Dismiss** — Proceed with [stated default for this boundary]

If satisfied with the BoundaryMap snapshot above, you can end the loop now:
  • Accept the current snapshot — say so in natural language; remaining N residual
    domains will be committed as [default_for_residual]. DefinedBoundary emitted directly.
    You may override the default in the same utterance (e.g., "accept but default to UserSupplies").
  • Explicit classification — say you want to bulk-classify the residual yourself;
    Phase 4 will surface for residual classification with {UserSupplies, AIAutonomous}.
```

**Free-response termination affordance**: Phase 2 surfacing prose includes both satisfaction signal paths (ImplicitTermination — commit current snapshot with default; ExplicitTermination — proceed to Phase 4). Phase 3 parses the utterance into the corresponding TerminationIntent sub-type while the typed coproduct `A ∈ BoundaryClassification = {UserSupplies, AIPropose, AIAutonomous, Dismiss}` (uniform, every kind) stays intact (gate integrity invariant — option set presented intact).

**Design principles**:
- **Cycle counter visibility**: `cycle_n` surfaced at every Phase 2 — user perceives signal density.
- **Essence visibility per cycle**: `Δessence` and accumulated `BoundaryEssence` shown — periagoge contribution makes the abstract responsibility boundary crystallization visible per cycle.
- **Round-local snapshot visibility**: the complete BoundaryMap snapshot (classified ∪ residual ↦ default) is surfaced each cycle — user sees the exact state that ImplicitTermination would commit.
- **Default visibility with derivation cite**: `default_for_residual` (a member of `BoundaryClassification`) is shown with its EssenceTrend derivation basis (kind-general — count-only over the dispositions classified so far) — so implicit-delegation becomes informed Constitution (the user recognizes what they would commit to before signaling termination).
- **Substrate-cited evidence**: every surfaced datum carries file/line citation.
- **Residual transparency**: user sees the explicit list of domains that would be implicitly delegated.
- **Free-response termination**: natural-language signal honored across both sub-types (Implicit / Explicit) while the typed coproduct is preserved.

### Phase 3: Per-Cycle Integration + Essence Crystallization + Default Derivation

Entered two ways: **after a user response** (Phase 2 → Phase 3) carrying a typed answer `A`, or **on an auto-resolved cycle** (Phase 1 → Phase 3, `auto_resolved = true`) where the anchor's boundary was settled from substrate and already recorded in `Λ.boundary_map` (Phase 1 step 4) — no user `A` and no `TerminationIntent`. Step ordering matters: termination parsing and the integrate step (classified-portion update) precede default re-derivation. ImplicitTermination commits with the default value that was visible in the just-completed Phase 2 surfacing (`default_at_surfacing`), NOT a re-derived value — the user's recognition must match the committed disposition.

0. **Snapshot the surfaced default** (user-response cycles only — an auto-resolved cycle has no Phase 2 surfacing and produces no TerminationIntent, so `default_at_surfacing` is unused on that branch) — `default_at_surfacing := Λ.default_for_residual` (the value the just-completed Phase 2 displayed). This is the value any ImplicitTermination will commit. Re-derivation in step 5 (if reached) writes a NEW `Λ.default_for_residual` intended for the NEXT cycle's Phase 2, never for this round's commit.
1. **Parse answer** (user-response cycle only — an auto-resolved cycle has no user `A`: `typed_A` is the substrate-derived classification already recorded in Phase 1 step 4, no `TerminationIntent` is produced, and routing in step 4 continues straight to step 5) — distinguish the typed `BoundaryClassification` selection (for current anchor domain; the uniform 4-value disposition) from free-response `TerminationIntent` (with optional `default_override`). If both signals are present, the typed selection takes effect for the current anchor domain AND `TerminationIntent` routes the loop.
   - Parsing rule for `TerminationIntent`:
     - Free response signals satisfaction without an explicit residual-review request → `ImplicitTermination(default_override = none)`
     - Free response signals satisfaction plus a user-named `BoundaryClassification` value as the alternative default → `ImplicitTermination(default_override = stated_value)`
     - Free response signals satisfaction with an explicit request for residual bulk classification → `ExplicitTermination`
     - No satisfaction signal → no termination_intent
   - **Ambiguity-confirmation relay**: if the free response is plausibly interpretable as either ImplicitTermination (commit residual to default) OR ExplicitTermination/continue-loop (review remaining) — for example "looks good but can we check the rest?" — DO NOT silently route. Present a one-turn relay confirmation surfacing the parsed intent: "I read this as [ImplicitTermination — committing residual as {default_at_surfacing}] / [ExplicitTermination — proceeding to Phase 4 for residual classification]. Correct?" The user's confirmation (or correction) routes the loop. One extra turn vs an irreversible commit on the wrong reading.
2. **Update BoundaryMap (classified portion only)** — `integrate(typed_A, B, BoundaryEssence) → (B', BoundaryEssence')`. Apply the typed answer's classification to the current anchor domain in `Λ.boundary_map`, and append `(Sub-D[cycle_n].domain, typed_A)` to `Λ.history` — so the count-distribution derivation in step 5 reads the post-integration `Λ.history` (= `history'`, the current cycle's classification included), matching the `history'` argument used in FLOW / MORPHISM / TOOL GROUNDING, and so an ImplicitTermination commit (step 4, which skips steps 5–7) still carries the final cycle's classification in the convergence trace. On a user-response cycle, move the anchor into its MODE STATE partition — `Λ.user_responded` for `UserSupplies` / `AIPropose` / `AIAutonomous`, `Λ.dismissed` for `Dismiss` (on an auto-resolved cycle the anchor is already in `Λ.context_resolved` from Phase 1 step 4 — no further partition move), so the partition invariant `domains_touched = context_resolved ∪ user_responded ∪ final_gate_classified ∪ dismissed ∪ residual` holds after Phase 3. This step does NOT touch `Λ.default_for_residual` or `Λ.essence_trend`.
   - **UserSupplies(boundary)** (kind-general): Record anchor in `Λ.boundary_map`; downstream gates present open questions for the user-supplied boundary value.
   - **AIPropose(boundary)**: Record as AI-proposes; downstream protocols expand candidate generation (ENRICH-AND-PRESENT).
   - **AIAutonomous(boundary)**: Record as AI-autonomous; downstream protocols may elide gates (RESOLVE-OR-PRESENT).
   - **Dismiss**: Mark dismissed; record the committed settle-by-default disposition.
3. **Crystallize Δessence** — append `Δessence` to `Λ.essence_history`; update `Λ.boundary_essence` by integrating the delta.
4. **Routing** (before any re-derivation):
   - If `TerminationIntent = ImplicitTermination(override?)` after step 1 confirmation: `finalize(B', Λ.residual, default_at_surfacing | override)` — every residual domain in `Λ.residual` is committed with `default_at_surfacing` (the Phase 2-visible value) or `override` if user stated one. Emit DefinedBoundary, converge directly. Steps 5–7 below are SKIPPED.
   - If `TerminationIntent = ExplicitTermination` after step 1 confirmation: proceed to Phase 4. Steps 5–7 below are SKIPPED (residual classification belongs to Phase 4, not to a next cycle's snapshot).
   - If `Esc`: ungraceful deactivate. Steps 5–7 SKIPPED.
   - Else (no termination signal): continue to step 5 (prepare next cycle's snapshot).
5. **Derive next-cycle EssenceTrend** (kind-general — runs for every captured kind): count-based ONLY — no textual-lean interpretation; analyze `Λ.history` count distribution across classified dispositions.
   - count(AIPropose ∪ AIAutonomous) strictly dominant → `ExtensionTrend`
   - count(UserSupplies) strictly dominant → `ConstitutionTrend`
   - No strict dominance OR `cycle_n < 2` (explicit single-cycle initialization rule — see Rule 21) → `MixedTrend`
   - Update `Λ.essence_trend`.
6. **Derive next-cycle DefaultClassification** (kind-general) — `Λ.default_for_residual ← DefaultClassification(Λ.essence_trend)`:
   - `ExtensionTrend → AIAutonomous`
   - `ConstitutionTrend → UserSupplies`
   - `MixedTrend → AIAutonomous` (Extension-default fallback)
   This new `Λ.default_for_residual` is the value the NEXT cycle's Phase 2 will surface, NOT the value that just-committed any termination (which used `default_at_surfacing`).
7. **Refresh next-cycle boundary_map snapshot** — `Λ.boundary_map = classified_entries ∪ (Λ.residual ↦ Λ.default_for_residual)`. `cycle_n += 1`, return to Phase 1. (The current cycle's `(domain, typed_A)` was already appended to `Λ.history` in step 2.)

### Phase 4 (Optional Path): Final Gate — Residual Bulk Classification (Constitution)

**Phase 4 is reached via** (a) Phase 3 `ExplicitTermination` satisfaction signal — user opts into explicit residual classification rather than implicit-delegation, or (b) Phase 1 substrate exhaustion when no further domains surface and at least one residual remains. ImplicitTermination bypasses Phase 4 entirely (residual committed with `default_for_residual` directly from Phase 3).

**Present** accumulated residual domains for bulk classification via Cognitive Partnership Move (Constitution).

**Surfacing format**:

Present as text output:
- **BoundaryEssence (final synthesis)**: [accumulated crystallized form of the responsibility boundary space]
- **Per-cycle classified entries** (already in BoundaryMap): [Domain → disposition per cycle]
- **Residual domains** (`Λ.residual`): [list of all surfaced-but-unclassified domains]

Then **present** (the `FinalGateDisposition` subset `{UserSupplies, AIAutonomous}` is the same for every kind; the bracketed content is phrased for the captured kind):

```
How should the remaining domains be settled in bulk?

Options:
1. **UserSupplies** — I retain settlement authority for each residual domain (lazy-binding);
   I supply the boundary value or invoke downstream protocols at decision-point activation.
2. **AIAutonomous** — AI settles each residual domain autonomously within scope. I delegate.
```

**Bulk classification semantics**:
- **UserSupplies** — Each residual domain receives `UserSupplies(domain)` in `Λ.final_gate_answers` (the residual domain itself becomes the boundary; lazy-binding). BoundaryMap entries record the disposition; downstream protocols read this signal and surface decision questions to the user when activated. User judges which protocol applies, preserving user settlement authority over the residual.
- **AIAutonomous** — Each residual domain receives `AIAutonomous(domain)` (semantically equivalent to per-cycle `AIAutonomous(boundary)` with boundary = residual domain). Downstream protocols may elide gates per RESOLVE-OR-PRESENT pattern.

**Granularity option**: User may free-response per-domain mixed disposition. Free response is parsed as a `Map(Domain, FinalGateAnswer)`; the uniform option (1 or 2) applies as default when free response is absent.

**Mixed-disposition parsing — error handling**:
- **Unknown-domain reference**: If the user names a domain absent from `Λ.residual` (typo or hallucinated reference), AI surfaces the discrepancy, re-presents the residual list, and re-prompts.
- **Ambiguous disposition**: If a domain's disposition is ambiguous or unparseable, AI re-prompts with the ambiguous portion isolated and the `FinalGateAnswer` coproduct re-presented.
- **Partial coverage**: Domains in `Λ.residual` not addressed in the mixed-disposition free response default to whichever uniform option (1 or 2) the user selected, OR — if no uniform option was selected — AI re-prompts for the unaddressed remainder.
- **Disposition conflict**: If a domain receives multiple conflicting dispositions in the same response, AI re-prompts with the conflicting portion isolated.

**Design principles**:
- **BoundaryEssence visible**: the crystallized abstract boundary essence is presented BEFORE residual classification — user judges bulk disposition with full essence context.
- **Residual transparency**: every accumulated residual domain is listed by name.
- **Lazy-binding UserSupplies**: Phase 4 UserSupplies records the disposition with the residual domain as scope; values and protocol invocation occur at downstream activation rather than at Phase 4 surfacing.
- **Mixed-disposition tolerated**: free response permits per-domain divergence from uniform option.

After Phase 4 user response:
1. Apply `FinalGateAnswer` to every residual domain (uniform or free-response-mixed).
2. Move residual entries from `Λ.residual` to `Λ.final_gate_classified` and `Λ.final_gate_answers`.
3. Append final-gate trace to history.
4. Output the finalized DefinedBoundary — the `BoundaryMap` paired with its captured kind (`{ map, kind }`) — AND `BoundaryEssence` as session text artifacts, so a later `B_prior` detection and the downstream consumers can recover which kind the map settles.
5. Trigger `converge` extension transition.

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | 1-2 cycles, narrow task scope, residual minimal | Brief per-cycle anchor + Δessence + B_snapshot; typical termination via ImplicitTermination |
| Medium | 3-5 cycles, multi-domain task scope | Structured per-cycle surfacing + accumulated essence + B_snapshot with default visibility; ImplicitTermination or Phase 4 per user judgment |
| Heavy | 6+ cycles, broad task scope, rich essence trajectory | Detailed evidence + per-cycle Δessence + B_snapshot; ExplicitTermination → Phase 4 with mixed-disposition residual common |

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | `activate(Horismos) only if ∃ domain(d) : unsettled(d, kind) ∧ ¬trivially_defaultable(d)` — `unsettled` fires on ANY unsettled boundary kind (direction/priority, scope, type/concept, ownership, emergent), with `¬assigned(d, owner)` the ownership-kind instantiation | Prevents false activation on clear tasks; activation no longer requires ownership specifically to be unclear |
| Up-front kind dispatch | Phase 0b presents the KindRouteMap (≤3 seed hypotheses + emergent/naming path) before the loop opens | Multi-consumer router needs a settled kind before downstream consumers read it; seeds are recognition priors, not a closed taxonomy |
| Single-dominant-kind relay | Phase 0b relays the captured kind (Extension, no turn yield) when one hypothesis dominates (entropy→0, option-set relay test); the mandatory gate fires when ≥2 stay viable or an emergent/naming capture is needed | Over-gating avoided when the framing settles the kind; the fail-closed certificate still runs on the relay branch, so deficit-fit is never bypassed |
| Fail-closed deficit-fit certificate | `certificate.status = pass` strictly precedes value-space binding; route → deactivate, ambiguous/non-atomic → re-sync | A kind a sibling deficit owns never pollutes the shared BoundaryMap; binding never proceeds under ambiguity |
| Uniform settlement disposition | `BoundaryClassification` generated only after the certificate passes; the SAME 4-value disposition for every kind | The answer constructors are kind-invariant (the kind sets each option's content, not the coproduct); EssenceTrend / default machinery is kind-general (count-only over the disposition) |
| Per-cycle re-scan | Phase 1 substrate scan runs each cycle; `Λ.D_history` deduplicates | Cycle-emergent domain surfacing without redundant queries |
| One anchor per cycle | One domain anchored per Phase 2 cycle | Prevents per-cycle classification overload; residual provisionally maps to `default_for_residual` |
| Cycle counter visibility | `cycle_n` surfaced at every Phase 2 | User perceives signal density and decides when to terminate |
| Essence visibility per cycle | `Δessence` and accumulated `BoundaryEssence` shown at Phase 2 | Periagoge crystallization made visible per cycle |
| Round-local snapshot visibility | Complete `boundary_map` snapshot (classified ∪ residual ↦ default) surfaced each Phase 2 | User sees the exact state that ImplicitTermination would commit |
| Default visibility with derivation cite | `default_for_residual` (a BoundaryClassification member) shown with its basis (kind-general): count-distribution basis at cycle k ≥ 2 and "MixedTrend (cycle 1 initialization)" at cycle 1 | ImplicitTermination becomes informed Constitution — user recognizes default before signaling termination; cycle 1 fabrication blocked |
| Surfaced-default commit invariant | ImplicitTermination commits with the default value visible in the just-completed Phase 2 (`default_at_surfacing`), never the re-derived value | Phase 3 re-derivation does not silently change what the user just accepted |
| Free-response termination affordance (bifurcated) | Phase 2 prose includes both ImplicitTermination (commit snapshot with default) and ExplicitTermination (proceed to Phase 4) sub-signals | User-judged termination path while typed coproduct preserved (gate integrity invariant) |
| Ambiguity-confirmation relay | When the free response is plausibly readable as either ImplicitTermination or continue/Explicit, Phase 3 surfaces the parsed intent for one-turn confirmation before routing | One extra turn vs irreversible commit on misread intent |
| Default override affordance | User may state alternative default classification in the same satisfaction utterance | Override exercise preserves Recognition without expanding typed option set |
| Residual transparency | Phase 2 lists every residual domain with provisional default mapping; Phase 4 lists every residual for explicit classification | User sees both the count and the identity of domains under implicit delegation |
| Hermeneutic seed visibility (Phase 2 cycle 1) | When `Λ.B_prior` non-empty AND kind-matched (`B_prior.kind = captured_kind`), the seed import is surfaced as a "Prior BoundaryMap seeded" notice at Phase 2 cycle 1 (Phase 0 stays silent); seeded domains enter `context_resolved`; Phase 1 stale-seed re-surface mechanism re-classifies entries whose prior fit no longer holds. A kind-mismatched non-empty `Λ.B_prior` surfaces instead as an advisory-only note (a prior boundary under a different kind), NOT a seed | Cross-invocation feedback loop visible at the first user-facing surfacing; partition invariant preserved; stale seeds become candidate anchors rather than invisible holdovers |
| Session immunity | Dismissed (domain, description) → skip for session | Respects user's dismissal |
| Auto-resolve preferred | Context-resolved domains skip Phase 2 within their cycle | Minimizes user interaction |
| Recognition over recall | Present options over BoundaryClassification (uniform, every kind — per-cycle: UserSupplies/AIPropose/AIAutonomous/Dismiss; Phase 4: UserSupplies/AIAutonomous subset) | Bound by the uniform settlement-disposition coproduct |
| Esc semantics | Esc → ungraceful exit; residual untreated | Distinguishes hard exit from satisfaction-driven termination |
| BoundaryEssence artifact | Output as separate session text alongside BoundaryMap at convergence | Periagoge contribution preserved as inspectable trace |

## Rules

1. **AI-guided, user-classified**: AI detects boundary-undefined signal and surfaces per-cycle anchors; classification requires user choice via Cognitive Partnership Move (Constitution) at Phase 2 (per-cycle over BoundaryClassification — the uniform 4-value disposition) and at Phase 4 if entered (final gate over FinalGateDisposition — the uniform 2-value subset). AI detection is implicitly confirmed when the user engages with classification.
2. **Recognition over Recall**: Present structured options with differential futures via Cognitive Partnership Move (Constitution); Constitution interactions yield turn for response. Phase 2 binds to `A ∈ BoundaryClassification` plus the complete BoundaryMap snapshot with provisional `default_for_residual` visible (Rule 19); Phase 4 binds to `FinalGateAnswer = FinalGateDisposition` (per TYPES).
3. **Per-cycle context collection**: Each cycle's Phase 1 re-scans substrate (CLAUDE.md, project rule files, project configuration); `Λ.D_history` prevents duplicate domain surfacing. (Detailed step procedure in Phase 1 prose.)
4. **Definition over Assumption**: When a decision's boundary (its ownership, direction/priority, scope, or type/concept) is unsettled, define explicitly rather than assume — silence is worse than a dismissed classification.
5. **No fixed taxonomy**: Domains emerge dynamically from each task probe; the `Domain = { name, description, evidence }` type carries no category constructor — taxonomy emerges from the task context. This extends to the **boundary kind**: the Phase 0b seeds (direction/priority, scope, type/concept, ownership) are recognition PRIORS, NOT a closed coproduct — the user may name an emergent kind or extend/replace a seed via the KindRouteMap's naming path. `Kind` carries no category constructor either.
6. **Context resolution preferred**: Auto-resolve from existing config, rules, and conventions where possible within the cycle's anchor. Minimize user interaction to what truly requires human judgment.
7. **One anchor per cycle**: Each Phase 2 cycle presents one anchor domain (`Sub-D[cycle_n]`); the PHASE TRANSITIONS edge `Phase 1 → Phase 2: Sub-D[cycle_n] non-empty ∧ ¬auto_resolved` binds the per-cycle cardinality. Surfaced-but-not-anchored domains accumulate into `Λ.residual` and are provisionally mapped to `Λ.default_for_residual` in the round-local snapshot; final disposition is committed by ImplicitTermination (default fill) or by Phase 4 explicit bulk classification.
8. **Impact ordering**: Per-cycle anchor selected by Impact — highest-impact at cycle 1; previous answer or free-response routes the substrate scan frame at cycle k≥2, with Impact re-applied within the routed frame. Impact is relational to downstream protocol dependencies. (Detailed per-answer-type heuristics in Phase 1 prose.)
9. **Per-decision boundary with hermeneutic carry-over (kind-aware seed)**: Each invocation produces a fresh `BoundaryEssence` for the current task scope. A prior `BoundaryMap` detected in current session context as a Horismos `DefinedBoundary` emit (NOT a `/recollect` recall artifact, NOT a hypomnesis store entry) is DETECTED at Phase 0 step 3 **together with the kind it was produced over** (binds `Λ.B_prior` and its kind only — Phase 0 does not seed `boundary_map`, which does not exist until loop-state init). The seed into the starting `boundary_map` AND the partition init into `Λ.context_resolved ∩ Λ.domains_touched` both occur at **Phase 0b step 4**, after the kind is captured and the certificate passes, **and only when the prior map's kind matches the captured kind** (`kind(Λ.B_prior) = captured_kind` — same-kind, i.e. settled over the same boundary question). The guard is **semantic, not type-based**: every kind shares the uniform disposition `BoundaryClassification`, so a mismatched prior's values are type-valid, but they answer a *different boundary question* (an ownership prior's `AIAutonomous` settled who-decides, not how-wide a scope is). A **kind-mismatched** prior map (`kind(Λ.B_prior) ≠ captured_kind`) is therefore NOT seeded — seeding it would commit a wrong-question disposition into the multi-consumer BoundaryMap; it is surfaced as advisory context at Phase 2 cycle 1 instead of a structural seed, and `boundary_map` starts empty. The MODE STATE partition invariant therefore holds from **Phase 0b onward**, not from Phase 0. Seeded entries remain mutable across cycles; Phase 1's stale-seed re-surface mechanism (Phase 1 step 1) re-classifies entries whose prior fit no longer holds, closing the COMPOSITION feedback loop. Cross-session recall (hypomnesis or `/recollect`) remains advisory heuristic input on candidate classifications only and does not seed `B_prior`.
10. **Context-Question Separation**: Analysis, evidence, rationale, the BoundaryMap snapshot, and the `default_for_residual` with derivation cite all appear as text before the gate; the question contains only the essential question, options carry only option-specific differential implications. Embedding context in question fields = protocol violation.
11. **Convergence evidence**: At convergence (Phase 3 ImplicitTermination ∨ Phase 4 completed ∨ substrate-exhaustion empty-residual), present per-cycle trace (for each anchored cycle k — k ranges over Λ.D_history, the cycles that produced a Sub-D; a substrate-exhaustion terminal scan contributes no entry: (Sub-D[k], Δessence[k], disposition[k]); disposition[k] ∈ BoundaryClassification) plus residual disposition trace — ImplicitTermination: (∀ d ∈ residual: (d, default_for_residual_or_override) — cites the EssenceTrend / count-distribution basis, kind-general); Phase 4 completion: (∀ d ∈ residual: (d, FinalGateAnswer(d))); substrate-exhaustion empty-residual: residual = ∅, no residual disposition. BoundaryEssence as separate session text artifact. Convergence is demonstrated, not asserted.
12. **Zero-signal surfacing**: If Phase 0 probe detects no boundary-undefined signal, present this finding with reasoning for user confirmation.
13. **Option-set relay test (Extension classification)**: If AI analysis converges to a single dominant option (option-level entropy→0 — Extension mode of the Cognitive Partnership Move), present the finding directly. Each Constitution option must be genuinely viable under different user value weightings. Options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options.
14. **Gate integrity** (Safeguard tier): The defined option sets (per-cycle `A ∈ BoundaryClassification` — the uniform 4-value disposition; Phase 4 `FinalGateAnswer = FinalGateDisposition` — the uniform 2-value subset) are presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation. Horismos-specific: the free-response termination affordance and its bifurcation into ImplicitTermination / ExplicitTermination sub-signals is positioned in Phase 2 surfacing prose (natural-language satisfaction signal guidance), not in the typed coproduct; Phase 3 parses `termination_intent` from free response and routes to either converge (Implicit) or Phase 4 (Explicit) — the affordance lives in prose rather than in the typed coproduct, so option-set integrity is preserved. Default override is free-response parsing into `ImplicitTermination(default_override)`, not an option-set extension. Ambiguous parses (response readable as either Implicit or Explicit/continue) trigger a one-turn relay confirmation before routing — see Rule 20.
15. **Final gate residual disposition — lazy-binding semantic**: Phase 4 binds `FinalGateAnswer = FinalGateDisposition = {UserSupplies, AIAutonomous} ⊆ BoundaryClassification` (the uniform residual-disposition subset, same for every kind). The `FinalGateAnswer` coproduct contains no routing constructor — BoundaryMap entries carry only the typed disposition, and value provision or protocol invocation decisions occur when the user activates downstream protocols. `UserSupplies(domain)` records the disposition with the residual domain as the boundary (lazy-binding — user retains settlement authority, downstream gates present open questions at activation). User settlement authority is preserved at the residual disposition for every kind.
16. **Conjecture disclosure**: Per-cycle-emergent loop + essence crystallization + always-complete BoundaryMap snapshot is a structural-fit conjecture under accumulating use. Loop topology revision waits on variation-stable retention evidence accumulating across invocations.
17. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
18. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
19. **Default visibility — informed Constitution**: The `default_for_residual` (a member of BoundaryClassification) and its derivation are surfaced at every Phase 2 round before the gate. The derivation basis is kind-general: the count-distribution / EssenceTrend basis at cycle k ≥ 2 and the explicit "MixedTrend (cycle 1 initialization)" cite at cycle 1 (count-only over the dispositions classified so far, identical for every kind). ImplicitTermination is only legitimate Constitution when the user has recognized the default they are committing to. Silent default = uninformed delegation — AI exercises the residual disposition without the user recognizing what they are committing to, which collapses the Detection-with-Authority separation that distinguishes AI surfacing from user judgment. The commit invariant: ImplicitTermination commits with `default_at_surfacing` (the value visible in the just-completed Phase 2), NEVER a Phase-3-re-derived value — Phase 3 re-derivation produces the NEXT cycle's default only. Override paths must be reachable in the same prose, parsed as `ImplicitTermination(default_override : BoundaryClassification)`.
20. **Ambiguity-confirmation relay**: When Phase 3 step 1 parses a free response that is plausibly readable as either ImplicitTermination (commit residual to default) or ExplicitTermination/continue (review remaining or proceed to Phase 4), present a one-turn relay confirmation surfacing the parsed intent before routing: "I read this as [parsed intent]. Correct?" The user's confirmation or correction routes the loop. The cost is one turn; the avoided cost is an irreversible commit on misread intent. Does NOT apply when the parse is unambiguous.
21. **Single-cycle MixedTrend (explicit design choice — kind-general)**: This derivation applies for **every captured kind** — the EssenceTrend → DefaultClassification machinery is kind-general, and `AIAutonomous` is always a member of `BoundaryClassification` (the uniform disposition). When `cycle_n < 2`, EssenceTrend is forced to `MixedTrend` and `default_for_residual` resolves to `AIAutonomous` (Extension-default fallback) regardless of any single prior answer — a single classification is insufficient to commit a count-dominance trend. Consequence: single-cycle ImplicitTermination always commits residual to `AIAutonomous` unless the user supplies a `default_override`. This is an inscribed design choice for Recognition reliability (one observation cannot signal a trend); cycle 1 basis cite makes it explicit, and override reachability provides the escape hatch.
22. **Kind dispatch with fail-closed deficit-fit certificate (Phase 0b)**: Before the per-cycle loop opens, the boundary **kind** is dispatched through the shared meta-backbone pipeline — KindBinding → fail-closed DeficitFitCertificate → uniform settlement disposition, in that strict order. (a) **Dispatch-first** because BoundaryMap is a multi-consumer router (its downstream advisory consumers, per the registered advisory edges): the kind must settle before any downstream consumer reads it, so bound presents an up-front KindRouteMap rather than emerging the kind cycle-by-cycle. The up-front dispatch is **gated** when ≥2 kind hypotheses stay viable and **relayed** (Extension, no turn yield) when one kind dominates (entropy→0) — see Rule 24; either way the kind settles before the loop opens. (b) **Seeds are priors, not a coproduct**: the recognition seeds (direction/priority, scope, type/concept, ownership; membership is NOT a first-class kind) are working hypotheses honoring Rule 5 — the user may name an emergent kind or extend/replace a seed. (c) **Fail-closed certificate**: `certificate.status = pass` strictly precedes value-space binding; `status = route` deactivates (routing to the sibling deficit's protocol — `/inquire`, `/gap`, `/frame`, `/ground`); `status = ambiguous` or `atomicity = non-atomic` re-syncs Phase 0b (split / route / one-turn narrow disambiguation) before binding — binding never proceeds under ambiguity. The certificate is generated by fitting the captured kind's positive predicate against the documented sibling-deficit scopes — the registered deficit inventory + edge topology read together with each sibling protocol's `deficit:` declaration (its SKILL.md `deficit:` line). (d) **Uniform value-space, kind sets content**: the BoundaryMap value type, the per-cycle answer `A`, the residual disposition, and the initial default `default_for(kind)` all range over `BoundaryClassification = {UserSupplies, AIPropose, AIAutonomous, Dismiss}` — the **same coproduct for every kind**, generated only after the certificate passes (the captured kind is the DOMAIN of `bind_value_space`, selecting each option's content, but the codomain is constant). The **ownership kind is the degenerate case** where the boundary value being settled IS the disposition (who decides); for every other kind the disposition says HOW the boundary value gets settled while the kind says WHAT it is about. The per-cycle EssenceTrend → DefaultClassification re-derivation machinery (Rules 19, 21) is **kind-general** — it reads disposition counts, never kind-specific content, so it runs identically for every kind. This matches the euporia / epharmoge twins, whose value-spaces (`{Provide, Defer, Dismiss}` / `{Confirm, Adapt, Dismiss}`) are likewise uniform coproducts over an emergent object_ref. The certify step is relay (Extension — deterministic registry check, basis cited at Phase 2 cycle 1); the dispatch sync (KindRouteMap presentation) is Constitution in the gated branch — the user constitutes which kind the boundary work is about — and Extension (relay) when one kind dominates (single-dominant-kind fast-path, Rule 24). (e) **Backbone discipline**: the schema is ONE canonical definition shared across protocols; bound instantiates only `object_ref(kind)`, `local_value_space`, and the guard routing targets — same field names, same fail-closed statuses, same certificate-before-binding order.
23. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract, since each block is the type that constitutes the protocol — preserving the blocks keeps the protocol intact. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).
24. **Single-dominant-kind relay (Phase 0b Extension fast-path)**: The Phase 0b kind dispatch is NOT unconditionally gated. Apply the option-set relay test (Rule 13) to the KindRouteMap hypotheses: when exactly one kind hypothesis dominates — its positive predicate unambiguously satisfied, every other hypothesis' `route_away_if` holding, and no emergent/naming capture indicated (option-set entropy → 0: one analytically-correct kind, the others foils) — present the captured kind + its basis as **relay text** and **proceed**, recording `Λ.captured_kind` without a turn yield (`sync_kind_route_relay`, Extension; mirrors `/conduct`'s `CT_default` relay). The mandatory Constitution gate (`sync_kind_route`, Rule 22) fires whenever the test fails — **≥2 kind hypotheses stay viable under different readings, or an emergent/naming capture is needed** — which is the default when in doubt: the kind seeds a frozen multi-consumer signal (its downstream advisory consumers), so the relay is the NARROW exception, not the norm. **The fail-closed DeficitFitCertificate still applies on the relay branch**: a relay-captured kind flows through the same `bind_kind → certify → bind_value_space` pipeline, and a `status = route` certificate routes away/deactivates and a `status = ambiguous` certificate re-syncs the full Constitution gate (Rule 22c) — the relay collapses only the kind-capture turn yield, never the deficit-fit gate. The relay does NOT open an in-loop kind-redirect: the captured kind is committed for the activation (like the gated branch). Its Extension-legitimacy rests on the single_dominant_kind dominance test (entropy → 0 ⟹ near-zero regret — the bounded-regret case) plus the fail-closed certify — NOT on a correction path. The certificate guards deficit-fit (it routes a kind a sibling deficit owns), NOT which bound-kind is correct among the seeds; kind correctness on the relay branch is carried by single_dominant_kind, not by certify. A rare mis-relay is corrected by re-invoking /bound (a fresh activation), which preserves the frozen multi-consumer kind invariant rather than mutating a kind mid-activation; the user's inherent conversational freedom remains but is not a defined in-loop redirect edge.

**Cross-session enrichment**: Prior session indices from the hypomnesis store, when present, may seed Phase 1 calibration proposals; the constitutive judgment remains with the user.
