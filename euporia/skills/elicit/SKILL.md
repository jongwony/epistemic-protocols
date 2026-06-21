---
name: elicit
description: "Resolve via Extended-Mind reverse induction. Reverse-traces decision coordinates from externalized substrate (codebase, rules, past sessions, user environment) and surfaces them through cycle-emergent dimension projections, each gated by a fail-closed deficit-fit certificate before its coordinates are surfaced for answer; user answers explicate the coordinates until intent crystallizes. The read-only re-projection loop is monotone — accepted coordinates are immutable. Type: (AbstractAporia, Hybrid, REVERSE-INDUCE-CYCLE, IntentSeed × ExternalizedSubstrate) → ResolvedEndpoint. Directional dual to Periagoge. Alias: Euporia(εὐπορία)."
---

# Euporia Protocol

Resolve abstract aporia through Extended-Mind reverse induction. Type: `(AbstractAporia, Hybrid, REVERSE-INDUCE-CYCLE, IntentSeed × ExternalizedSubstrate) → ResolvedEndpoint`.

## Definition

**Euporia** (εὐπορία): A dialogical act of opening a way through abstract aporia, where AI reverse-traces decision coordinates from the user's externalized cognitive substrate (codebase, rules, past sessions, user environment), surfaces them as cycle-emergent dimension projections — each projection bound as a kind and certified for deficit fit (fail-closed) before its coordinates are surfaced for answer — and shapes the converging intent through user answers until the endpoint resolves. The loop is a **read-only re-projection**: substrate reads are immutable, `I'` accumulates monotonically, and accepted coordinates are never invalidated.[^1]

[^1]: Greek εὐπορία (literally "good passage" — εὖ "well" + πόρος "way") names the resourcefulness toward resolution that emerges from aporia (ἀπορία, "no way through"). Plato's later dialectic threads aporia and euporia as paired moments of inquiry. The protocol borrows the resolving-passage structure and stands in directional dual relation to Periagoge (περιαγωγή, turning-around) — Periagoge ascends from instances to abstraction (bottom-up direction; given {Iᵢ}, emergent abstraction), Euporia traces from intent through substrate to coordinates (top-down direction; given I, surface (D[], coordinates)).

```
── FLOW ──
Euporia(I) → Detect(I, S) → aporia? →
  true:  (I, S, ctx) → Substrate access → ReverseTrace(I, S, ctx) → (D[], context) →
         ∀ projection ∈ D[]: bind_kind(projection) → KindBinding                                  -- {label, positive_predicate, evidence, origin ∈ {seed, emergent}, atomicity}; non-atomic projection → split before certify
                            certify(KindBinding, graph.json) → DeficitFitCertificate              -- fail-closed: status ≠ pass BLOCKS surfacing this projection's coordinates for answer (generated at projection time, BEFORE Phase 2)
                              status = route:     → route_away(target) → drop projection from this cycle's surfaced D[] (forward under-determination belongs to a sibling deficit)
                              status = ambiguous: → defer projection to a later cycle (re-tried once a surfaced answer advances I') — never surface coordinates under ambiguous fit
                              status = pass:      → bind_value_space(projection) → V (per-coordinate answer constructors {Provide, Defer, Dismiss})  -- generated ONLY after certificate passes; frozen for this cycle
         Qs(D_passed, cycle_n) → Stop → A → integrate(A, I) → I' →                              -- only certificate-passing projections reach Phase 2
         loop until resolved(I') ∨ user_esc ∨ user_dismiss                                         -- MONOTONE re-projection: re-trace reads immutable substrate; I' accumulates; accepted coordinates never invalidated
  false: surface scan result; route to axis-specific protocol (axis-determined) or invite user to articulate or withdraw (substrate empty)

── MORPHISM ──
IntentSeed
  → detect(aporia, axis_undetermined)        -- verify abstract aporia exists
  → access(externalized_substrate)            -- read external substrate channels (codebase / rules / sessions / environment)
  → observe(utterance_ambiguity)              -- analyze I.utterance for in-text semantic ambiguity (Utterance channel; internal)
  → reverse_trace(coordinates)                -- infer user's externalized decision coordinates → candidate DimensionProjections
  → bind_kind(projection) → KindBinding       -- {label, positive_predicate, evidence, seed|emergent, atomicity}; non-atomic projection → split before continuing (no certify on a compound projection)
  → certify(KindBinding, registry) → DeficitFitCertificate
                                              -- {owner, in_scope_if, route_if[], evidence, status}; fail-closed — status ≠ pass BLOCKS bind_value_space + surfacing; fits projection's positive_predicate against the documented sibling-deficit scopes (deficit inventory + edge topology in graph.json, read with each sibling protocol's deficit: declaration). Generated at projection time (Phase 1), BEFORE the coordinate is surfaced for answer (Phase 2) — cycle-emergent, NOT an up-front sync
  → bind_value_space(projection) → V          -- per-coordinate answer constructors {Provide, Defer, Dismiss}; generated ONLY after certificate.status = pass; relay / dead-signal test applied; frozen for the cycle
  → surface(D_passed, cycle_emergent)       -- present cycle-emergent dimension projections that passed the certificate
  → integrate(answer, I)                       -- update intent per user answer; ADDS determination, never revises an accepted coordinate (monotone)
  → resolve(intent)                            -- convergence when user judges resolved
  → ResolvedEndpoint
requires: aporia(I)                            -- runtime checkpoint (Phase 0); sole activation precondition. (certificate.status = pass is a per-projection Phase-1 SURFACING gate, NOT an activation precondition — it lives in the certificate-before-binding invariant below and the Phase 1 → Phase 2 transition, not in requires.)
deficit:  AbstractAporia                       -- activation precondition (Layer 1/2); certificate.owner for in-scope projections
preserves: utterance(I)                        -- I.utterance read-only; I' accumulates substrate trace
invariant: Reverse Induction over Axis-Fixed Extraction
invariant: certificate-before-binding          -- DeficitFitCertificate.status = pass strictly precedes bind_value_space (shared meta-backbone order)
invariant: Coordinate Monotonicity             -- substrate reads are immutable; I' is accumulate-only; an accepted coordinate value is never invalidated by a later answer — a later answer ADDS determination, and a deferred coordinate, when later answered, may only add determination, never overturn an accepted one (see §Coordinate Monotonicity Invariant)

── TYPES ──
I              = IntentSeed { utterance: String, axis: Optional(Axis) }
I'             = Updated intent (substrate-traced + user-answered)
S              = ExternalizedSubstrate { codebase, rules, sessions, environment }
                 -- read-only view of user's externalized cognition
                 -- environment: machine-setup metadata (uname, pwd, tool versions, git config public fields)
                 --   excludes shell environment variables (env/printenv), .env files, secrets management tools
D[]            = List(DimensionProjection)     -- cycle-emergent; no fixed taxonomy
DimensionProjection = { axis_inferred: String, coordinates: List(Coordinate), confidence: Float }
                 -- object_ref: the per-projection anchor the certificate evaluates and the value-space binds over (euporia-local instantiation of the shared backbone's object_ref)
Coordinate     = { name: String, default: Optional(Value), question: String, basis: Evidence }
Evidence       = { source: SubstrateChannel, content: String }
SubstrateChannel ∈ {Codebase, Rules, Session, Environment, Utterance}
                 -- Codebase / Rules / Session / Environment: sourced from S (ExternalizedSubstrate fields)
                 -- Utterance: sourced from I.utterance (not a field of S; in-text semantic ambiguity of the IntentSeed itself);
                 --   citation MUST quote the actual utterance fragment, not paraphrase or attribute unstated mental models

-- Shared meta-backbone (KIND dispatch, cycle-emergent). One canonical schema; euporia-local instantiation ONLY for object_ref (= DimensionProjection), local_value_space (= the per-coordinate answer coproduct), and guard routing targets.
KindBinding    = { label: Axis, positive_predicate: String, evidence: Set(Evidence), origin ∈ {seed, emergent}, atomicity ∈ {atomic, non-atomic} }
                 -- captures the projection as a kind; if atomicity = non-atomic (the projection bundles two distinct axes) → split BEFORE certify (no value-space binding, no surfacing on a compound projection)
DeficitFitCertificate = { owner: Deficit, in_scope_if: String, route_if: List<RoutePair>, evidence: Set(Evidence), status ∈ {pass, route, ambiguous} }
                 -- fail-closed: status ≠ pass BLOCKS bind_value_space AND surfacing this projection's coordinates for answer. Generated at projection time (Phase 1) by fitting KindBinding.positive_predicate against the documented sibling-deficit scopes — the deficit inventory + edge topology in .claude/skills/verify/graph.json (which sibling deficits exist and how they relate) read together with each sibling protocol's deficit: declaration (its SKILL.md deficit: line + the CLAUDE.md protocol-pair table).
                 -- owner = AbstractAporia when the projection is in-scope; status = pass iff the projection's positive_predicate fits AbstractAporia and no sibling deficit claims it
                 -- status = route: a sibling deficit owns the projection (forward under-determination) → emit RoutePair target, drop the projection from this cycle's surfaced D[]
                 -- status = ambiguous: overlapping deficit fit → defer the projection to a later cycle (re-tried once a surfaced answer advances I'); never surface coordinates under ambiguous fit
RoutePair      = (route_if_predicate: String, target: Protocol)
                 -- euporia-local guard routing targets — FORWARD under-determination the loop routes away rather than reverse-tracing (BACKWARD misfit — an unnoticed decision gap → /gap, or portability to an absent recipient → /distill — is contextualize's domain, not elicit's, so /gap and /distill are intentionally absent from this forward-routing list):
                 --   missing pre-execution fact (no substrate value, requires fact supply) → /inquire   (ContextInsufficient)
                 --   undefined ownership/scope boundary for the decision                  → /bound     (BoundaryUndefined)
                 --   intent is axis-determined (a single axis-specific protocol covers it) → the axis-specific protocol for that axis
V              = bind_value_space : DimensionProjection → ValueSpace  -- per-coordinate answer constructors; generated ONLY after certificate.status = pass; frozen for the cycle (relay / dead-signal test applied)
ValueSpace     = the projection's per-coordinate answer coproduct (local_value_space; euporia-local instantiation point) = {Provide, Defer, Dismiss}
A              = UserAnswer ∈ {Provide(values), Defer(coords), Dismiss}   -- A ∈ V; per-coordinate answer drawn from the projection's value-space
                 values         = Map(Coordinate, Value)
                 coords         = Set(Coordinate) -- defer to next cycle (covers ambiguous/partial answers)
R              = ResolvedEndpoint { intent_resolved: I', residual: Set(Axis ⊎ DeferredResidual) }
                 -- residual members are tagged: Axis = an unresolved axis delegated to a downstream protocol; DeferredResidual = a deferred projection surfaced as residual at convergence (never reduced to a bare axis label or silently dropped)
DeferredResidual = { projection: DimensionProjection, reason ∈ {ambiguous, low_confidence}, basis: Evidence }
                 -- a projection still in Λ.deferred at convergence, surfaced as residual. reason is DERIVED from the deferred projection's certificate.status GIVEN its membership in Λ.deferred: a deferred projection with status = ambiguous → reason = ambiguous; a deferred projection with status = pass → reason = low_confidence (the ONLY way a certificate-passing projection sits in Λ.deferred is the Phase-1 step-7 confidence filter, so within Λ.deferred status = pass uniquely implies confidence-filtered). basis = the projection's substrate Evidence (its coordinates' basis). No Λ.deferred type change is needed — the reason is recoverable from the deferred entry's certificate.status plus its Λ.deferred membership
resolved(I')   = ∂(intent) ≈ 0 (user constitutive judgment)
cycle_n        = Nat                            -- current cycle counter; surfaced at every Phase 2
Phase          ∈ {0, 1, 2, 3}                   -- certify runs WITHIN Phase 1 (at projection time), not as a separate phase — cycle-emergent, no up-front sync gate
Deficit        = the sibling-deficit label a projection may belong to (sourced from each protocol's documented deficit: declaration; the protocol that OWNS the deficit is a node in graph.json and the deficit/edge relations are its edges — the deficit label itself is NOT a graph.json node); owner = AbstractAporia for in-scope projections
Protocol       = downstream protocol slash target a routed projection is handed to (e.g., /inquire, /bound, axis-specific)
Axis           = String                         -- emergent label; examples: "intent", "goal", "form", "scope", "framework"
Initiator      ∈ {UserInvoked, AIDetected}      -- bound at activation; informs Hybrid Phase 2 first-surface semantics
Qs             = Cycle-emergent surfacing interaction with D_passed (certificate-passing projections only) + cycle counter [Tool: Constitution interaction]
ResolvedEndpoint = I' where user_judges_resolved(I') ∨ user_dismiss(I') ∨ no_surfaceable_projection(D_passed = ∅ ∧ Λ.deferred ≠ ∅); residual includes any projection still in Λ.deferred at convergence — including the no-surfaceable-projection termination (Phase 1 → deactivate) — each wrapped as a DeferredResidual (reason derived from its certificate.status + substrate basis) — surfaced, never silently dropped

── A-BINDING ──
bind(I) = explicit_arg ∪ recent_intent_seed ∪ surfaced_aporia
Priority: explicit_arg > recent_intent_seed > surfaced_aporia

/elicit "intent"           → I = IntentSeed with utterance
/elicit (alone)            → I = most recent intent seed in session
"I want to..."             → I = utterance under discussion

If no aporia signal is detectable, Phase 0 detection surfaces the scan result instead of
proceeding to Phase 1: when the intent is fully axis-determined it routes to the matching
axis-specific protocol; when the substrate is empty it invites the user to articulate
further or withdraw.

── PHASE TRANSITIONS ──
Phase 0: I → Detect(I, S) → aporia?                                  -- detection checkpoint; aporia=true → silent proceed to Phase 1; aporia=false → surface scan result (axis-determined → routing recommendation; substrate empty → invite articulate-or-withdraw), no activation
Phase 1: (I, S, ctx) → Substrate access [Tool] → ReverseTrace [Internal] → D[] (candidate projections)
       → ∀ projection ∈ D[]: bind_kind(projection) → KindBinding → certify(KindBinding, registry) → DeficitFitCertificate
                                                                       -- per-projection KIND dispatch at projection time (fail-closed, cycle-emergent — no up-front sync); certify is Extension/relay (deficit-fit against the cited deficit-scope declarations; ambiguous fit → defer)
       → (status = pass) bind_value_space(projection) → V → keep projection in D_passed
       → (D_passed, context)
Phase 2: (D_passed, cycle_n, initiator) → Qs(D_passed, cycle_n) → Stop → A   -- Constitution; only certificate-passing projections surfaced; cycle counter visible
                                                                       -- Hybrid contract: cycle_n=1 ∧ initiator=AIDetected → first surfacing = implicit confirm-or-decline
Phase 3: A → integrate(A, I) → I'                                    -- track, residual identification; monotone — accepted coordinates immutable, integrate ADDS only

Phase 0 → Phase 1: aporia(I) = true                                                          -- aporia confirmed → silent re-projection loop opens
Phase 0 → deactivate: aporia(I) = false                                                      -- no aporia signal → surface scan result (axis-determined routing recommendation OR articulate-or-withdraw), no activation
Phase 1 → Phase 2: D_passed ≠ ∅ (∃ projection that passed the certificate AND survived the confidence filter, Phase 1 step 7)  -- at least one surfaceable projection remains → surface D_passed
Phase 1 → route_away (projection-local): certificate.status = route                          -- a sibling deficit owns the projection (forward under-determination) → emit RoutePair.target, drop the projection from this cycle's D_passed (loop continues with remaining passed projections)
Phase 1 → split (pre-certify): KindBinding.atomicity = non-atomic                            -- a compound projection bundles two distinct axes → split into atomic sub-projections and re-run bind_kind + certify on each WITHIN THE SAME CYCLE (before any pass/route/defer decision); recursive until atomic (well-founded: each split strictly decreases the number of bundled axes — atomic = exactly one axis — so the recursion terminates). A non-atomic projection is NEVER deferred or certified as a compound (cf. Phase 1 step 4)
Phase 1 → defer (projection-local): certificate.status = ambiguous                           -- overlapping deficit fit on an ATOMIC projection → defer to a later cycle (re-tried once a surfaced answer advances I'); never surface coordinates under ambiguous fit
Phase 1 → deactivate (no surfaceable projection): D_passed = ∅ (every projection this cycle is routed, certificate-deferred/ambiguous, or passed-but-confidence-filtered into Λ.deferred — nothing surfaceable remains)  -- no projection can surface for an answer this cycle → emit the routing recommendations (/inquire, /bound, axis-specific) for the routed projections; then, if Λ.deferred ≠ ∅, converge to a ResolvedEndpoint whose residual folds each remaining Λ.deferred projection (ambiguous AND certificate-passing-but-confidence-filtered) as a DeferredResidual (reason from certificate.status — ambiguous→ambiguous, pass→low_confidence), surfaced and never silently dropped — the same fold as the Phase 3 → converge residual paths, so an in-scope confidence-filtered projection always gets a typed result equation; if Λ.deferred = ∅ (every leftover projection is routed), deactivate WITHOUT a ResolvedEndpoint (pure no-signal exit, the per-projection-certificate analogue of Phase 0's no-signal exit; encodes the Deactivation Triggers "all projections routed/deferred ... no further substrate signal" row). TERMINATION GUARANTEE (no spurious cycle-local re-trace): at a fixed I'-state the immutable substrate makes a re-trace deterministic-identical, so re-tracing a no-surface cycle cannot change any projection's status — there is NO cycle-local re-trace path. I' advances ONLY via a surfaced Phase-2 Provide answer (which requires D_passed ≠ ∅), and that re-projection is the Phase 3 → Phase 1 path. Hence a no-surface cycle (D_passed = ∅) deactivates immediately rather than looping; a deferred projection is re-tried only when a later surfaced answer has advanced I'.
Phase 2 → Phase 3: A received                                                                -- per-coordinate answer accepted
Phase 3 → Phase 1: ¬user_judges_resolved(I') ∧ ¬user_dismiss ∧ ¬user_esc → cycle_n += 1      -- re-projection: re-trace immutable substrate with accumulated I' (monotone)
Phase 3 → converge: user_judges_resolved(I')                                                 -- user constitutive judgment → ResolvedEndpoint + per-cycle coordinate trace; any projection still in Λ.deferred (unsurfaced ambiguous / low-confidence) is folded into ResolvedEndpoint.residual and surfaced, never silently dropped
Phase 3 → converge (residual): A = Dismiss ∧ residual ≠ ∅                                     -- ResolvedEndpoint with residual annotated for downstream delegation: unresolved axes AND any remaining Λ.deferred projections (each wrapped as a DeferredResidual) folded in and surfaced
Phase 2 → deactivate (ungraceful): user_esc                                                  -- D_passed surfaced but Esc before any A → intent remains in-process; partial-cycle entry discarded and cycle_n decremented by 1 per §Cycle State Invariant

── LOOP ──
Per-cycle KIND dispatch (Phase 1, cycle-emergent — runs each cycle, NOT an up-front sync):
  Each candidate projection from ReverseTrace is bound (bind_kind → KindBinding) and certified (certify → DeficitFitCertificate, fail-closed) at projection time, BEFORE its coordinates are surfaced for answer. Only certificate-passing projections enter D_passed and reach Phase 2. status = route drops the projection (routed forward to a sibling deficit); status = ambiguous defers it to a later cycle; a non-atomic (compound) projection is split into atomic sub-projections before certify (same cycle), never deferred as a compound. This is distinct from bound's dispatch-first up-front sync: euporia's projection IS the dynamic capture, so the certificate attaches per projection per cycle rather than once before the loop.

MONOTONE re-projection (the read-only side of the dual axis): the loop does NOT transform the object its own detector evaluates. Substrate reads are immutable (read-only tools, no mutation of the user's externalized cognition); `I'` accumulates across cycles (accumulate-only); an accepted coordinate value is never invalidated by re-trace or by a later answer. Re-trace is read-only RE-PROJECTION over the same immutable substrate with an updated `I'` — NOT "no re-scan" and NOT a revalidation that can breed new deficits. Because the source is never mutated, re-projection cannot create new deficit instances in already-accepted coordinates (contrast: a transformative-revalidation loop mutates its evaluated object and can regress).

After Phase 3: re-detect remaining aporia in I'.
If user_judges_resolved(I'): terminate, return ResolvedEndpoint — first fold any remaining Λ.deferred projections (unsurfaced ambiguous / low-confidence) into residual and surface them (never silently dropped).
If A = Dismiss + residual ≠ ∅: terminate with ResolvedEndpoint(residual annotated, including any remaining Λ.deferred projections).
Else: cycle_n += 1, return to Phase 1 (re-project: re-trace immutable substrate with accumulated I'; accepted coordinates carried forward unchanged).
No fixed cycle cap; user esc available at every Phase 2.
Convergence presentation (relay, extension-classified; at termination):
  (a) Intent readback — plain single-sentence form of resolved I' assembled from coordinate values, in user-facing language;
  (b) Per-cycle coordinate trace — for each step ∈ history, show (D[step] → A[step] → I'[step]).
Convergence is demonstrated, not asserted; the readback materializes I' as a recognizable target without adding a separate constitutive gate.
Mid-cycle scope: Intent readback (a) also surfaces in Phase 2 from cycle_n ≥ 2 (see Phase 2 surfacing format); the per-cycle coordinate trace (b) is termination-only.

── CONVERGENCE ──
resolved(I') = ∃ step ∈ history : user_judges_resolved(I'[step])  -- at this convergence, any remaining Λ.deferred projection is folded into ResolvedEndpoint.residual as a DeferredResidual (reason + basis) and surfaced (never silently dropped — Surfacing over Deciding)
early_exit = user_esc | user_dismiss
progress(Λ) = cycle_n (running counter; not bounded by a target)
certificate gate: every surfaced coordinate was drawn from a projection with certificate.status = pass (Phase 1, fail-closed) — coordinates from routed/deferred projections never reached Phase 2, so a resolved I' is assembled only from in-scope (AbstractAporia-owned), fit-certified coordinates
monotonicity: progress(Λ) is non-decreasing in accepted coordinates — each cycle's integrate ADDS determination to I'; no cycle invalidates a previously accepted coordinate (Coordinate Monotonicity invariant). resolved(I') is therefore reached by accumulation, never by regression.

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Detect       (sense)        → Internal analysis (no external tool)
Phase 0 Surface      (extension)    → TextPresent+Proceed (aporia=false: surface scan result; routing recommendation when axis-determined, or invite articulate-or-withdraw when substrate empty; no activation, no constitutive gate)
Phase 1 Substrate    (observe)      → Read, Grep, Bash (read-only substrate access — codebase / rules / session history / Environment queries: machine-setup metadata only — uname, pwd, version probes, git config public fields; MUST NOT execute env/printenv/set/echo $VAR or read .env* files). Immutable read: substrate is never mutated (monotone re-projection)
Phase 1 Utterance    (observe)      → Internal analysis of I.utterance for in-text semantic ambiguity (citation quotes actual utterance fragments only)
Phase 1 ReverseTrace (observe)      → Internal analysis (axis inference + coordinate construction → candidate DimensionProjections)
Phase 1 bind_kind    (sense)        → Internal analysis (capture each candidate projection as a KindBinding {label, positive_predicate, evidence, origin ∈ {seed, emergent}, atomicity}; non-atomic projection → split before certify)
Phase 1 certify      (extension)    → Internal analysis (fail-closed DeficitFitCertificate; fit of KindBinding.positive_predicate against the documented sibling-deficit scopes — the deficit inventory + edge topology in .claude/skills/verify/graph.json plus each sibling protocol's deficit: declaration: owner = AbstractAporia when in-scope; status = pass | route | ambiguous; basis = the cited deficit-scope fit, shown at the projection's Phase 2 surfacing. Relay (Extension) because the fit is grounded in a citable source and an unclear fit returns status = ambiguous → defer, never a user gate. Runs at projection time, BEFORE surfacing — cycle-emergent, no up-front sync)
Phase 1 bind_value_space (track)    → Internal state update (extension — generate the per-coordinate answer constructors {Provide, Defer, Dismiss} ONLY after certificate.status = pass; relay / dead-signal test applied; freeze V for this cycle's projection. On status = route → route_away(target), drop projection from D_passed; on status = ambiguous → defer projection to a later cycle before binding; a non-atomic projection was split into atomic sub-projections before certify (step 4), so it never reaches binding as a compound)
Phase 2 Qs           (constitution) → present (mandatory; cycle-emergent dimension options from D_passed + certificate-fit basis cite + cycle counter; Esc → loop termination)
Phase 3              (track)        → Internal state update (monotone — integrate ADDS coordinate determination to I'; accepted coordinates never revised)
converge             (extension)    → TextPresent+Proceed (intent readback + per-cycle coordinate trace; proceed with ResolvedEndpoint)

── MODE STATE ──
Λ = { phase: Phase, I: IntentSeed, I': IntentSeed, S: ExternalizedSubstrate,
      cycle_n: Nat,
      kind_bindings: Map(DimensionProjection, KindBinding),  -- per-projection captures for the current cycle ({label, positive_predicate, evidence, origin, atomicity}); indexed by projection (Λ.kind_bindings[projection])
      certificates: Map(DimensionProjection, DeficitFitCertificate),  -- per-projection fail-closed certificates, indexed by projection (Λ.certificates[projection]); status must = pass before a projection's value-space binds and its coordinates surface; DeferredResidual.reason is derived from certificates[projection].status
      value_spaces: Map(DimensionProjection, ValueSpace), -- V per passing projection; frozen for the cycle ({Provide, Defer, Dismiss})
      D_passed: List<DimensionProjection>,             -- this cycle's certificate-passing projections (the only ones surfaced at Phase 2)
      routed: List<(DimensionProjection, Protocol)>,   -- projections with status = route, handed to a sibling deficit's protocol (forward under-determination)
      deferred: Set(DimensionProjection),              -- projections parked for a later cycle, of two kinds: (a) ATOMIC projections with certificate.status = ambiguous (a non-atomic projection is split pre-certify, never parked here), and (b) certificate-PASSING projections filtered out at Phase 1 step 7 for low-confidence substrate basis. Both are re-tried on a later cycle's Phase 3 → Phase 1 re-projection once a surfaced Provide answer has advanced I' (NOT re-traced at a fixed I'-state — deterministic-identical); surfaced as residual if the cycle deactivates with D_passed = ∅
      accepted_coords: Set(Coordinate),                -- monotone accumulator — once a coordinate is answered (Provide), it enters here and is NEVER removed or revised
      D_history: List<DimensionProjection[]>,
      A_history: List<UserAnswer>,
      I_history: List<IntentSeed>,
      initiator: Initiator,
      residual: Set(Axis ⊎ DeferredResidual),   -- Axis members = delegated unresolved axes; DeferredResidual members = unsurfaced deferred projections folded in at convergence (wrapping projection + reason derived from certificate.status + substrate basis)
      resolved: Bool, active: Bool, cause_tag: String }
-- Cycle constraint: |D_history| = |A_history| = |I_history| = cycle_n (full statement in §Cycle State Invariant)
-- Monotonicity invariant: accepted_coords is accumulate-only across cycles — integrate(A, I) may ADD to accepted_coords, never remove or overwrite an entry (full statement in §Coordinate Monotonicity Invariant)
-- Certificate invariant: ∀ projection ∈ D_passed : certificates[projection].status = pass (fail-closed — routed/deferred projections never enter D_passed)

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Substrate channel resolution emergent via session context.
Read-only re-projection rationale: euporia sits on the read-only / monotone side of the dual axis — its detector evaluates the user's externalized substrate, which the loop never mutates (read-only tools). Re-trace is therefore RE-PROJECTION over an immutable source with an accumulated I', not a revalidation that can breed new deficits. The DeficitFitCertificate is cycle-emergent: it attaches to each projection at projection time (Phase 1), BEFORE the coordinate is surfaced — distinct from bound's dispatch-first up-front sync, which exists only because BoundaryMap is a multi-consumer router whose kind must settle once before any consumer reads it. euporia has no such multi-consumer constraint, so the certificate fires per projection per cycle. Forward under-determination (a projection a sibling deficit owns) is routed away (/inquire for a missing fact, /bound for an undefined boundary, the axis-specific protocol for an axis-determined projection) rather than reverse-traced, keeping a misfit coordinate out of the resolved endpoint.
Monotonicity ∘ shared-backbone: the certificate-before-binding order and the Coordinate Monotonicity invariant compose — a coordinate only enters I' after (a) its projection passed the fail-closed certificate AND (b) the user answered Provide; once entered it is immutable, so re-projection accumulates determination without ever revalidating (and thus without ever invalidating) an accepted coordinate.
```

## Core Principle

**Reverse Induction over Axis-Fixed Extraction**: When intent is articulated but its decision coordinates are implicit in the user's externalized substrate (codebase, rules, past sessions, user environment), neither AI alone nor user alone can resolve the endpoint. AI reverse-traces from the substrate to surface candidate dimension projections; the user's answers explicate which coordinates were already implicit in their externalized cognition. The resolution emerges through cycle iteration, not through axis-fixed extraction along a single pre-committed dimension. The dimension options surface per cycle from that cycle's substrate trace; fixed dialect families (widen/narrow/fuse/reorient) do not apply — that structure belongs to Periagoge's dual.

## Cycle State Invariant

Per cycle, the trio `(D[step], A[step], I'[step])` is recorded pairwise into `D_history`, `A_history`, and `I_history` ONLY when the cycle surfaces (reaches Phase 2) — `cycle_n` counts surfaced cycles. Two partial-cycle terminations record no triple and are restored to the invariant by decrementing `cycle_n` by 1 at the termination boundary: (a) user Esc at the Phase 2 surface (`Phase 2 → deactivate (ungraceful)`: `D_passed` was surfaced but the user pressed Esc before any `A` is recorded), and (b) the no-surface deactivation (`Phase 1 → deactivate (no surfaceable projection)`, when `D_passed = ∅`, before any surface). In both, the entered cycle recorded no `(D, A, I')` triple, so the invariant `|D_history| = |A_history| = |I_history| = cycle_n` is preserved — including the first-cycle no-surface case, where `cycle_n` returns to 0 (`0 = 0 = 0 = 0`).

## Coordinate Monotonicity Invariant

Euporia's loop is the **read-only re-projection** side of the dual axis: it reverse-traces an *immutable* substrate and never transforms the object its own detector evaluates. The monotonicity invariant makes this concrete and resolves the `Defer(coords)` interaction with re-projection:

**Invariant (Coordinate Monotonicity)**: An accepted coordinate is immutable. Once a coordinate is answered with `Provide(value)` and enters `Λ.accepted_coords`, no subsequent cycle — and no subsequent answer — may remove or overwrite it. A later answer ADDS determination to `I'`; it never REVISES an accepted coordinate. A `Defer(coords)`-ed coordinate, when later answered in a subsequent cycle, may only ADD determination — it cannot overturn a coordinate already accepted in an earlier cycle.

**Why this holds structurally**: substrate reads are immutable (Phase 1 uses read-only tools and never mutates the user's externalized cognition), and `I'` is accumulate-only (`integrate` adds coordinate values, never deletes them). Re-projection re-reads the same unchanged substrate with a more-determined `I'`; it cannot manufacture a new value for an already-accepted coordinate because the source it reads has not changed. This is the property that distinguishes a read-only re-projection loop from a transformative-revalidation loop (which mutates its evaluated object and may therefore regress).

**Rationale / documented falsifier (the `Defer` retroactive-invalidation case)**: the risk the invariant forecloses is a `Defer`-then-answer sequence in which a deferred coordinate's later answer would imply a *different* value for a coordinate already accepted in an earlier cycle — retroactively invalidating it and breaking monotonicity. The invariant rules this out by construction: deferral parks a coordinate as still-pending (it was never accepted, so nothing about it is yet immutable), and when it is later answered the result is an ADD to `I'`, scoped to that coordinate. If a later answer genuinely contradicts an accepted coordinate, that is a **frame change**, not a within-loop revision: the user must re-open the resolved coordinate explicitly (a fresh constitutive act — equivalently a new `/elicit` pass over the changed intent), and the protocol surfaces the conflict rather than silently overwriting. The invariant is falsified if a re-projection cycle is ever observed to silently overwrite an accepted coordinate without such an explicit user re-opening; that observation would reclassify euporia's loop off the read-only/monotone side of the dual axis.

## Mode Activation

### Activation

AI detects abstract aporia OR user calls `/elicit`. Detection is silent on the aporia-confirmed path (Phase 0); each candidate dimension projection is then bound as a kind and certified for deficit fit (fail-closed, cycle-emergent — at projection time in Phase 1) before its coordinates are surfaced; dimension surfacing always requires user interaction via Cognitive Partnership Move (Constitution) (Phase 2).

**Hybrid confirmation contract**: For AI-detected activation paths, the first Phase 2 surfacing (cycle_n=1) serves as the user-confirmation moment — Esc at the first surface deactivates without coordinate state change, satisfying the Hybrid initiator's "AI-detected trigger path requires user confirmation" contract via implicit-acknowledge-or-decline at the first dimension surface. Phase 1 substrate scan precedes this confirmation under the substrate read-only constraint; no externalized state is mutated before user judgment.

**Activation layers**:
- **Layer 1 (User-invocable)**: `/elicit` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: Abstract aporia detected via in-protocol heuristics (axis-undetermined intent + substrate-implicit coordinates). Detection is silent on the aporia-confirmed path.

**Abstract aporia** = intent is articulated as utterance but its decision coordinates are not axis-determined; the substrate carries implicit values that can be reverse-traced into surfaceable dimensions.

Gate predicate:
```
aporia(I) ≡ ∃ requirement(r, I) : axis_undetermined(r) ∧ substrate_implicit(r)
            -- substrate_implicit ranges over external SubstrateChannels
            --   {Codebase, Rules, Session, Environment} for activation purposes.
            -- Utterance is admissible as Evidence basis within Phase 1 dimension projections
            --   once activated, but does not by itself satisfy substrate_implicit;
            --   utterance-only aporia (axis-undetermined intent without external substrate signal)
            --   routes to Aitesis (fact-supply layer), not Euporia.
```

### Priority

<system-reminder>
When Euporia is active:

**Supersedes**: Direct execution patterns that proceed without surfacing implicit coordinates
(Coordinates must be reverse-traced and explicated through Cognitive Partnership Move (Constitution), not assumed silently)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 1, dispatch each candidate projection through the fail-closed deficit-fit certificate before surfacing (route forward under-determination to `/inquire`, `/bound`, or the axis-specific protocol). At Phase 2, present the certificate-passing cycle-emergent dimension projections with substrate-cited basis and cycle counter via Cognitive Partnership Move (Constitution). Accepted coordinates are immutable — re-trace is read-only re-projection, never revision.
</system-reminder>

- Euporia completes before action dependent on the resolved endpoint proceeds
- Loaded instructions resume after resolution or Esc

### Trigger Signals

| Signal | Detection |
|--------|-----------|
| Axis-undetermined intent | utterance carries action verb without specifying *which* axis (intent / goal / form / scope / framework / ...) is the relevant decision dimension |
| Substrate implicit coordinates | user's codebase / rules / past sessions / environment contain decision values that the intent does not surface |
| Multi-axis dependency | intent's resolution depends on coordinates spanning multiple axes that no single axis-specific protocol covers |
| Aporia language | utterance such as "I want to ... but I'm not sure how to ..." or open-ended action statements without endpoint constraint |

**Cross-session enrichment**: Anamnesis hypomnesis store provides recalled coordinate patterns when invoked via `/recollect`; recalled coordinates seed the substrate scan but constitutive judgment remains with the user.

**Skip**:
- Intent is fully axis-determined (a single axis-specific protocol covers it)
- Substrate is empty (no externalized coordinates available — fall back to direct execution or Aitesis)
- User explicitly requests proceed without surfacing
- Same (utterance, substrate slice) was resolved or dismissed in current session (session immunity)

### Activation Conditions

Euporia activates when (a) the user's intent is articulated as an utterance, (b) the utterance does not commit to a single axis-specific protocol, (c) the user's externalized substrate carries implicit decision coordinates relevant to the intent's resolution, and (d) the substrate is reachable through read-only tools. The gate is the conjunction of axis-undetermined intent and substrate-implicit coordinates, not instance count or scenario template.

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| user_judges_resolved(I') | Return ResolvedEndpoint with per-cycle coordinate trace; any remaining Λ.deferred projection is folded into residual and surfaced |
| User Esc | Return to normal operation; intent remains in-process |
| Dismiss + residual | Return ResolvedEndpoint with residual annotated for downstream delegation — unresolved axes AND any remaining Λ.deferred projections (unsurfaced ambiguous / low-confidence) folded in and surfaced, never silently dropped |
| No aporia signal at Phase 0 (axis-determined or substrate empty) | Surface scan result without activating — routing recommendation when axis-determined, articulate-or-withdraw invitation when substrate empty |
| All projections routed/deferred for every cycle with no further substrate signal | The loop yields no surfaceable aporia coordinate (every projection belongs to a sibling deficit or stays deferred) — surface the routing recommendations (`/inquire`, `/bound`, axis-specific); if any projection remains in `Λ.deferred` (ambiguous, or certificate-passing-but-confidence-filtered), converge to a ResolvedEndpoint folding each as a DeferredResidual (surfaced, never silently dropped); only when `Λ.deferred = ∅` (every leftover is routed) deactivate without a ResolvedEndpoint — the per-projection-certificate analogue of Phase 0's no-signal exit |

## Protocol

### Phase 0: Aporia Detection Checkpoint

Analyze the intent seed for abstract aporia. Detection is silent on the aporia-confirmed path — it proceeds to Phase 1 with no user interaction; on no signal it surfaces the scan result before deactivating.

1. Bind seed `I` per A-BINDING priority
2. Check axis determination: scan utterance for axis-specific markers (intent verbs / goal nouns / abstraction signals / boundary phrases)
3. Check substrate availability: confirm read-only access to codebase / rules / session history / environment
4. If `aporia(I)` predicate satisfied: proceed to Phase 1 with `(I, S, ctx)` — silent, no user interaction
5. If no aporia signal (predicate unsatisfied), surface the scan result and deactivate without proceeding to Phase 1:
   - **Intent is axis-determined**: surface a routing recommendation to the matching axis-specific protocol
   - **Substrate is empty**: surface the empty-substrate result and invite the user to articulate further or withdraw (fall back to direct execution or Aitesis)

**Scope restriction**: Detection does NOT modify files or call external services beyond read-only substrate scan. The no-signal surface is a relay presentation — no constitutive gate.

### Phase 1: Substrate Access + Reverse Trace + Per-Projection Kind Dispatch

Read substrate channels (immutable — monotone re-projection), reverse-trace candidate dimension projections, and pass each through the shared meta-backbone pipeline (KindBinding → fail-closed DeficitFitCertificate → per-coordinate value-space) BEFORE its coordinates are surfaced for answer. The certificate is **cycle-emergent**: it attaches to each projection at projection time, not as an up-front sync — euporia's projection IS the dynamic capture (contrast bound's dispatch-first up-front sync, which exists only because BoundaryMap is a multi-consumer router).

1. **Substrate scan** (external channels): Read/Grep over the user's codebase, rules, recent sessions; Bash for read-only Environment queries (machine-setup metadata only: uname, pwd, tool versions, git config public fields). MUST NOT execute `env`, `printenv`, `set`, `echo $VAR`, or read `.env*` files. Tag each evidence record with its substrate channel (Codebase / Rules / Session / Environment). Reads are immutable — the substrate is never mutated, which is what makes re-trace a read-only re-projection rather than a revalidation.
2. **Utterance analysis** (Utterance channel): Internal analysis of `I.utterance` for in-text semantic ambiguity. Citations quote the actual utterance fragment only; paraphrase and attribution of unstated mental models are outside the channel. Utterance evidence supplements external substrate evidence within Phase 1 dimension projections — it does not by itself trigger activation (see Gate predicate).
3. **ReverseTrace**: From the intent and the substrate evidence, infer candidate dimensions whose coordinates are likely implicit in the substrate. Each `Coordinate` within the projection carries (name, default, question, basis: Evidence); each `DimensionProjection` carries (axis_inferred, coordinates, confidence).
4. **Bind the kind** (per projection): For each candidate projection, set `Λ.kind_bindings[projection] = { label: axis_inferred, positive_predicate, evidence, origin ∈ {seed, emergent}, atomicity }`. If `atomicity = non-atomic` (the projection bundles two distinct axes), **split before certify** — re-trace the split projections; do NOT certify or bind a value-space to a compound projection.
5. **Certify deficit fit (fail-closed)** (per projection): `Λ.certificates[projection] = certify(kind_binding, registry)` where the registry is the documented sibling-deficit scope set — the deficit inventory + edge topology in `.claude/skills/verify/graph.json` (which sibling deficits exist and how they relate) read together with each sibling protocol's `deficit:` declaration (its SKILL.md `deficit:` line + the CLAUDE.md protocol-pair table). Fit the projection's positive predicate against those documented deficit scopes:
   - **`status = pass`** — the projection's positive predicate fits `AbstractAporia` (certificate `owner = AbstractAporia`) and no sibling deficit claims it. Proceed to step 6 for this projection.
   - **`status = route`** — a sibling deficit owns the projection (it is forward under-determination, not abstract aporia). Emit the matching `RoutePair.target` and **drop the projection from this cycle's `D_passed`** (record it in `Λ.routed`); the loop continues with the remaining passing projections. Route targets: a missing pre-execution fact (no substrate value, requires fact supply) → `/inquire` (ContextInsufficient); an undefined ownership/scope boundary for the decision → `/bound` (BoundaryUndefined); an axis-determined projection (a single axis-specific protocol covers it) → that axis-specific protocol.
   - **`status = ambiguous`** — overlapping deficit fit (the predicate plausibly fits AbstractAporia AND a sibling deficit). **Do NOT bind values, do NOT surface.** Defer the projection to a later cycle (record it in `Λ.deferred`); it is re-tried on a later cycle's Phase 3 → Phase 1 re-projection once a surfaced Provide answer has advanced `I'` (the added determination can narrow the previously-ambiguous fit). Re-tracing at a fixed `I'`-state is deterministic-identical, so it is not attempted. Fail-closed: surfacing never proceeds under ambiguous fit.
6. **Bind the per-coordinate value-space** (per passing projection): ONLY after `certificate.status = pass`, generate the projection's per-coordinate answer constructors `Λ.value_spaces[projection] = {Provide, Defer, Dismiss}`, apply the option-set relay / dead-signal test, and freeze the set for this cycle. Add the projection to `Λ.D_passed`.
7. **Filter by confidence**: Among the passing projections, retain in `Λ.D_passed` only those whose substrate basis is concrete; move low-confidence projections out of `Λ.D_passed` into `Λ.deferred` (re-traced when more of `I'` is determined). Only the retained projections reach Phase 2.
8. Package `(D_passed, context)`. If `D_passed ≠ ∅`, proceed to Phase 2 (surface). If `D_passed = ∅` (every projection this cycle is routed, certificate-deferred/ambiguous, or passed-but-confidence-filtered into `Λ.deferred`), do NOT surface and do NOT re-trace at the current `I'`-state — a re-trace over the immutable substrate with unchanged `I'` is deterministic-identical, so it cannot change any status. Take the **`Phase 1 → deactivate (no surfaceable projection)`** path: emit the routing recommendations for the routed projections; if `Λ.deferred ≠ ∅`, converge to a ResolvedEndpoint folding each remaining deferred/confidence-filtered projection as a DeferredResidual (surfaced, never silently dropped — the same fold as convergence); only when `Λ.deferred = ∅` (every leftover is routed) deactivate without a ResolvedEndpoint. A deferred (ambiguous) projection is re-tried only when a later **surfaced** Phase-2 Provide answer has advanced `I'` (the Phase 3 → Phase 1 re-projection, which advances `cycle_n` with a recorded `(D, A, I')` triple). Termination is therefore guaranteed: `I'` advances only via a surfaced answer, and a no-surface cycle deactivates immediately.

**Certificate basis visibility**: the certificate's deficit-fit basis (which sibling-deficit scope the projection matched, and the graph.json edge that relates it) is cited at the projection's Phase 2 surfacing — relay (Extension), grounded in the cited deficit-scope declarations (an unclear fit returns ambiguous → defer, never a user gate). ReverseTrace and the per-projection kind capture are AI inference; the user constitutes the coordinate values at Phase 2.

**Backbone discipline**: the schema (KindBinding / DeficitFitCertificate / value-space binding) is ONE canonical definition shared across protocols; euporia instantiates only `object_ref` (= DimensionProjection), `local_value_space` (= the per-coordinate `{Provide, Defer, Dismiss}` coproduct), and the guard routing targets (the RoutePairs above). Same field names, same fail-closed statuses, same certificate-before-binding order.

**Scope restriction**: Read-only investigation. No test execution or file modifications. Substrate evidence must cite a specific source.

### Phase 2: Cycle-Emergent Dimension Surfacing (Constitution)

**Present** dimension projections with substrate-cited basis and cycle counter via Cognitive Partnership Move (Constitution).

**Surfacing format**:

Present dimension projections as text output (only certificate-passing projections from `Λ.D_passed` are surfaced — routed and deferred projections never reach this point):
- **Cycle**: `cycle_n` (always visible)
- **Intent readback** (cycle_n ≥ 2): plain single-sentence form of current I' assembled from resolved coordinates; provides the user a recognizable target for `user_judges_resolved` judgment without adding a separate gate
- For each `DimensionProjection` in `Λ.D_passed`:
  - **Axis**: [axis_inferred]
  - **Coordinates**: [coordinate names + question per coordinate]
  - **Substrate basis**: [evidence cited from substrate channels, including Utterance fragments when applicable] + the deficit-fit basis (which sibling-deficit scope confirmed this projection belongs to abstract aporia rather than to a sibling deficit) — relay cite, grounded in the cited deficit-scope declarations
  - **Default** (when substrate-derivable): [default value with citation]
- **In play this cycle**: [the coordinates still pending in the current cycle] — a framing readout of what remains open this cycle, not a resolved/total tally
- **Routed away** (when any projection was routed this cycle): a brief note that under-determination belonging to a sibling deficit was handed forward (e.g., "missing fact → /inquire", "undefined boundary → /bound") rather than reverse-traced here

Then present per-coordinate answer slots (cycle-emergent — no fixed dialect; the slots reflect the actual coordinates of the current cycle):

```
For each surfaced coordinate, provide an answer or defer.
Or:
- Defer specific coordinates to next cycle
- Dismiss + delegate residual to downstream protocols
- Esc — terminate review
```

**Design principles**:
- **Substrate-cited basis**: Every dimension's basis cites specific substrate evidence (file:line, rule reference, session id). No speculation.
- **Cycle counter visibility**: `cycle_n` surfaced at every Phase 2; user perceives signal density and decides when to terminate.
- **Coordinate-level granularity**: User answers per-coordinate; deferral is per-coordinate.
- **Free response honored**: User may answer beyond surfaced coordinates, redirect axis, name an excluded dimension, or terminate.

### Phase 3: Integration

After user response. `integrate(A, I)` is **monotone**: it ADDS coordinate determination to `I'` and never revises a previously accepted coordinate (see §Coordinate Monotonicity Invariant).

1. **Provide(values)**: Update I' with provided coordinate values; mark answered coordinates and enter them into `Λ.accepted_coords` (accumulate-only — an accepted coordinate is immutable and is never removed or overwritten by a later cycle). Append snapshot of I' to `I_history`.
2. **Defer(coords)**: Mark deferred coordinates (covers ambiguous/partial/unknown answers) as still-pending — they were never accepted, so nothing about them is yet immutable. They re-enter Phase 1's re-projection in the next cycle; when later answered, the result is an ADD scoped to that coordinate, never an overturning of a coordinate already in `Λ.accepted_coords`. Append current I' snapshot (unchanged in a Defer cycle) to `I_history` to preserve pairwise alignment with `D_history` and `A_history`.
3. **Dismiss**: Mark intent as dismissed-with-residual; collect unresolved axes AND any remaining `Λ.deferred` projections (with their reason + basis) into `residual`. Terminate.

**Conflict handling (monotonicity boundary)**: if a later answer genuinely contradicts a coordinate already in `Λ.accepted_coords`, this is a **frame change**, not a within-loop revision. Surface the conflict rather than silently overwriting; the user must explicitly re-open the resolved coordinate (a fresh constitutive act — equivalently a new `/elicit` pass over the changed intent). The integrate step alone never overturns an accepted coordinate.

After integration:
- Re-detect remaining aporia in I'
- If `user_judges_resolved(I')`: terminate with ResolvedEndpoint + per-cycle trace; fold any remaining `Λ.deferred` projections into `residual` and surface them (never silently dropped)
- Else: increment `cycle_n`, return to Phase 1 to re-project (re-trace the immutable substrate with the accumulated I'; accepted coordinates carried forward unchanged)

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Single dimension, substrate evidence concrete | Brief surface + per-coordinate answer slot |
| Medium | Multiple dimensions per cycle, partial substrate evidence | Full dimension surface + coordinate-level granularity |
| Heavy | Multi-axis intent, weak substrate basis, multiple cycles expected | Full surface + substrate evidence per coordinate + explicit residual axes |

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | `activate(Euporia) only if axis_undetermined(I) ∧ substrate_implicit(I)` | Prevents false activation on axis-determined intent or empty substrate |
| Substrate evidence required | Phase 1 dimension projections must cite specific substrate evidence | Prevents speculation; reverse-trace must be grounded |
| Fail-closed deficit-fit certificate | Each projection's `certificate.status = pass` strictly precedes value-space binding and surfacing; route → drop projection (forward to sibling deficit), ambiguous → defer to a later cycle, non-atomic → split into atomic sub-projections before certify | A projection a sibling deficit owns never surfaces as an aporia coordinate; forward under-determination is routed (`/inquire`, `/bound`, axis-specific) rather than reverse-traced |
| Cycle-emergent certificate (no up-front sync) | The certificate attaches per projection at projection time (Phase 1), not once before the loop | euporia's projection IS the dynamic capture; distinct from bound's dispatch-first up-front sync (which exists only for a multi-consumer router) |
| Coordinate monotonicity | Accepted coordinates are immutable; integrate ADDS, never revises; a deferred coordinate, when later answered, only adds determination | Read-only re-projection cannot invalidate an already-accepted coordinate; resolution reached by accumulation, never regression |
| Immutable substrate read | Phase 1 reads never mutate the substrate | Keeps re-trace a read-only re-projection (monotone), not a revalidation that can breed new deficits |
| Cycle counter visibility | Phase 2 surfacing always shows `cycle_n` | User perceives cycle signal density and decides when to terminate |
| Cycle-emergent option set | Phase 2 options reflect current cycle's coordinates; no fixed dialect | Adapts to actual coordinates surfaced; respects axis-emergence |
| Coordinate-level granularity | User answers per-coordinate; deferral per-coordinate | Permits partial progress within a cycle |
| Free response honored | User may answer beyond, redirect, or terminate at any Phase 2 | Full constitutive control |
| Session immunity | Resolved or dismissed (utterance, substrate slice) → skip for session | Respects user's resolution or release |
| Substrate read-only | Phase 1 substrate access uses read-only tools only | No mutation of user's externalized cognition during scan |
| Utterance channel discipline | Utterance evidence quotes the actual utterance fragment only; paraphrase and attribution of unstated mental models are outside the channel | Prevents AI from projecting unspoken user mental models as substrate evidence |
| Utterance-only activation guard | Utterance evidence supplements external substrate evidence; utterance-only signals do not satisfy the activation predicate | Prevents false-positive activation when no external substrate carries implicit coordinates |
| Convergence readback (Phase 2, cycle_n ≥ 2) | At every Phase 2 from cycle_n ≥ 2, present I' as plain single-sentence readback (readback alone, no trace) | Provides recognizable target for `user_judges_resolved`; prevents implicit resolution assertion mid-cycle |
| Convergence readback (termination) | At termination, present I' as readback alongside the per-cycle coordinate trace | Demonstrates convergence with full history; readback materializes the resolved endpoint as a recognizable sentence |
| User esc anytime | Esc available at every Phase 2 | No fixed cycle cap |

## Rules

1. **AI-guided substrate access, user-resolved**: AI reverse-traces dimension projections from substrate; resolution requires user answer via Cognitive Partnership Move (Constitution) (Phase 2).
2. **Recognition over Recall**: Present structured dimension surfacing via Cognitive Partnership Move (Constitution) — structured content reaches the user with response opportunity; Constitution interaction requires turn yield.
3. **User constitutive interaction**: User answers operate at three layers — coordinate-level (per-coordinate provide/defer/dismiss), endpoint-level (`resolved(I')` is user judgment, not AI assertion), and frame-level (user may redirect to an unsurfaced dimension or terminate; free response routes the next cycle's substrate scan).
4. **Convergence persistence**: Mode active until user judges resolved, dismisses, or Esc.
5. **Context-Question Separation**: Output substrate evidence and rationale as text before presenting via Cognitive Partnership Move (Constitution). The question contains only the per-coordinate answer slot; the dimension surface is pre-gate context.
6. **Option-set relay test (Extension classification)**: If AI analysis converges to a single dominant coordinate value (option-level entropy → 0), present the value directly as relay. The user answer slot remains constitutive when multiple valid coordinate values exist under different user value weightings.
7. **Gate integrity**: The cycle-emergent option set is presented as a coherent dimension cluster per cycle; partial omission of surfaced coordinates without user dismissal violates this invariant. Type-preserving materialization (specializing a generic axis into a concrete coordinate while preserving the surfacing structure) is distinct from mutation.
8. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
9. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
10. **Per-projection kind dispatch with fail-closed deficit-fit certificate (Phase 1, cycle-emergent)**: Before a projection's coordinates are surfaced for answer, the projection is dispatched through the shared meta-backbone pipeline — KindBinding → fail-closed DeficitFitCertificate → per-coordinate value-space, in that strict order. (a) **Cycle-emergent, NOT dispatch-first**: the certificate attaches to each projection at projection time (Phase 1), per cycle — euporia's projection IS the dynamic capture, so there is no up-front sync gate. This is the read-only re-projection counterpart to bound's dispatch-first up-front sync, which exists only because BoundaryMap is a multi-consumer router whose kind must settle once before any consumer reads it; euporia has no multi-consumer constraint. (b) **Fail-closed certificate**: `certificate.status = pass` strictly precedes value-space binding and surfacing; `status = route` drops the projection (routed forward to the sibling deficit's protocol — a missing pre-execution fact → `/inquire`, an undefined ownership/scope boundary → `/bound`, an axis-determined projection → the axis-specific protocol) and the loop continues with the remaining passing projections; `status = ambiguous` defers the projection to a later cycle (re-tried once a surfaced answer advances I'), and a non-atomic projection is split into atomic sub-projections before certify (step 4) rather than deferred — surfacing never proceeds under ambiguity. The certificate is generated by fitting the projection's positive predicate against the documented sibling-deficit scopes — the deficit inventory + edge topology in `.claude/skills/verify/graph.json` plus each sibling protocol's `deficit:` declaration. (c) **Forward under-determination is routed, not reverse-traced**: a projection a sibling deficit owns represents forward under-determination (a missing fact, an undefined boundary, an axis already determined), not abstract aporia — euporia hands it forward rather than absorbing it. (d) **Value-space follows the projection**: the per-coordinate answer coproduct `{Provide, Defer, Dismiss}` is generated only after the certificate passes. (e) **Backbone discipline**: the schema is ONE canonical definition shared across protocols; euporia instantiates only `object_ref` (= DimensionProjection), `local_value_space` (= the `{Provide, Defer, Dismiss}` coproduct), and the guard routing targets — same field names, same fail-closed statuses, same certificate-before-binding order. The certify step is relay (Extension — the deficit-fit is grounded in the cited deficit-scope declarations, and an unclear fit returns `status = ambiguous` → defer rather than a user gate; basis cited at the projection's Phase 2 surfacing).
11. **Coordinate monotonicity (read-only re-projection)**: The loop is the read-only / monotone side of the dual axis — it reverse-traces an immutable substrate and never transforms the object its own detector evaluates. An accepted coordinate is immutable: once answered with `Provide` and entered into `Λ.accepted_coords`, no subsequent cycle or answer removes or overwrites it. `integrate(A, I)` ADDS determination to `I'`; it never REVISES an accepted coordinate. A `Defer`-ed coordinate, when later answered, may only add determination — it cannot overturn a coordinate already accepted (the documented falsifier is the `Defer`-then-answer retroactive-invalidation case; the invariant forecloses it because deferral parks a coordinate as still-pending, never accepted). Re-trace is read-only RE-PROJECTION over the same unchanged substrate with a more-determined `I'` — NOT "no re-scan" and NOT a revalidation that can breed new deficits. A later answer that genuinely contradicts an accepted coordinate is a **frame change**, surfaced for explicit user re-opening (a fresh constitutive act), never a silent within-loop overwrite. See §Coordinate Monotonicity Invariant.
12. **Formal blocks are runtime-normative**: This protocol's formal blocks (FLOW, MORPHISM, TYPES, PHASE TRANSITIONS, LOOP, TOOL GROUNDING, MODE STATE, CONVERGENCE) are LLM-facing and constitutive of protocol identity — they type the prose and carry the operational contract executed at runtime, not contributor-only documentation. When producing a reduced or single-shot realization of this protocol, do not reclassify a formal block as contributor spec and drop or thin it: removing a block removes the type that constitutes the protocol. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).
