---
name: elicit
description: "Resolve via Extended-Mind reverse induction. Reverse-traces decision coordinates from externalized substrate (codebase, rules, past sessions, user environment) and surfaces them as cycle-emergent dimension projections; user answers explicate the coordinates until intent crystallizes. The read-only re-projection loop is monotone — accepted coordinates are immutable. Type: (AbstractAporia, Hybrid, REVERSE-INDUCE-CYCLE, IntentSeed × ExternalizedSubstrate) → ResolvedEndpoint. Alias: Euporia(εὐπορία)."
---

# Euporia Protocol

Resolve abstract aporia through Extended-Mind reverse induction. Type: `(AbstractAporia, Hybrid, REVERSE-INDUCE-CYCLE, IntentSeed × ExternalizedSubstrate) → ResolvedEndpoint`.

## Definition

**Euporia** (εὐπορία): A dialogical act of opening a way through abstract aporia, where AI reverse-traces decision coordinates from the user's externalized cognitive substrate (codebase, rules, past sessions, user environment), surfaces them as cycle-emergent dimension projections, and shapes the converging intent through user answers until the endpoint resolves.[^1]

[^1]: Greek εὐπορία (literally "good passage" — εὖ "well" + πόρος "way") names the resourcefulness toward resolution that emerges from aporia (ἀπορία, "no way through"). Plato's later dialectic threads aporia and euporia as paired moments of inquiry; the protocol borrows the resolving-passage structure.

```
── FLOW ──
Euporia(I) → Detect(I, S) → aporia? →
  true:  (I, S, ctx) → Substrate access → ReverseTrace(I, S, ctx) → (D[], context) →
         filter_confidence(D[]) → (D_surfaced, Λ.deferred)                              -- concrete substrate basis retained; thin-basis projections parked
         resurface(Λ.parked)                                                            -- coordinates the user could not answer yet come back as themselves
         [D_surfaced = ∅ ∧ Λ.parked = ∅: deactivate — fold Λ.deferred into residual when non-empty]  -- nothing answerable this cycle; no re-trace at a fixed I'-state
         Qs(D_surfaced, Λ.parked, cycle_n) → Stop → A → integrate(A, I) → I' →
         loop until resolved(I') ∨ user_dismiss ∨ no_advance(A)                          -- no_advance: every surfaced coordinate was deferred, so I' is unchanged and a re-trace would repeat this cycle
  false: surface scan result; route to axis-specific protocol (axis-determined) or invite user to articulate or withdraw (substrate empty)

── MORPHISM ──
IntentSeed
  → detect(aporia, axis_undetermined)        -- verify abstract aporia exists
  → access(externalized_substrate)            -- read external substrate channels (codebase / rules / sessions / environment)
  → observe(utterance_ambiguity)              -- analyze I.utterance for in-text semantic ambiguity (Utterance channel; internal)
  → reverse_trace(coordinates)                -- infer user's externalized decision coordinates → candidate DimensionProjections
  → filter_confidence(D[]) → D_surfaced       -- retain projections whose substrate basis is concrete; park thin-basis projections in Λ.deferred
  → resurface(parked_coordinates)             -- bring back coordinates the user deferred in an earlier cycle, as themselves rather than re-derived
  → surface(D_surfaced, parked, cycle_emergent) -- present this cycle's projections with substrate-cited basis, alongside anything brought back
  → integrate(answer, I)                       -- update intent per user answer; ADDS determination, never revises an accepted coordinate
  → resolve(intent)                            -- convergence when user judges resolved
  → ResolvedEndpoint
requires: aporia(I)                            -- runtime checkpoint (Phase 0); sole activation precondition
deficit:  AbstractAporia                       -- activation precondition (Layer 1/2)
preserves: utterance(I)                        -- I.utterance read-only; I' accumulates substrate trace
invariant: Reverse Induction over Axis-Fixed Extraction
invariant: Coordinate Monotonicity             -- accepted coordinates are immutable (full statement: §Coordinate Monotonicity Invariant)

── TYPES ──
I              = IntentSeed { utterance: String, axis: Optional(Axis) }
I'             = Updated intent (substrate-traced + user-answered)
S              = ExternalizedSubstrate { codebase, rules, sessions, environment }
                 -- read-only view of user's externalized cognition
                 -- environment: machine-setup metadata (uname, pwd, tool versions, git config public fields)
D[]            = List(DimensionProjection)     -- cycle-emergent; no fixed taxonomy
DimensionProjection = { axis_inferred: String, coordinates: List(Coordinate), confidence: Float }
Coordinate     = { name: String, default: Optional(Value), question: String, basis: Evidence }
Evidence       = { source: SubstrateChannel, content: String }
SubstrateChannel ∈ {Codebase, Rules, Session, Environment, Utterance}
                 -- Codebase / Rules / Session / Environment: sourced from S (ExternalizedSubstrate fields)
                 -- Utterance: sourced from I.utterance (not a field of S; in-text semantic ambiguity of the IntentSeed itself);
                 --   citation MUST quote the actual utterance fragment, not paraphrase or attribute unstated mental models
filter_confidence = D[] → (D_surfaced, deferred)  -- partition on substrate-basis concreteness; deferred projections are re-tried once a surfaced answer advances I'
D_surfaced     = List(DimensionProjection)     -- this cycle's surfaceable projections (the ones Phase 2 presents)
A              = UserAnswer ∈ {Provide(values), Defer(coords), Dismiss}   -- per-coordinate answer
                 values         = Map(Coordinate, Value)
                 coords         = Set(Coordinate) -- parked for a later cycle (covers ambiguous/partial/not-yet-answerable)
no_advance(A)  ≡ A = Defer(coords) ∧ coords ⊇ surfaced_coordinates(cycle)  -- every coordinate surfaced this cycle was deferred, so integrate added nothing and I' is unchanged; a re-trace at this fixed I'-state is deterministic-identical, so the cycle would repeat
R              = ResolvedEndpoint { intent_resolved: I', residual: Set(Axis ⊎ DeferredResidual ⊎ ParkedCoordinate) }
                 -- residual members are tagged: Axis = an unresolved axis delegated to a downstream protocol; DeferredResidual = a projection the confidence filter parked; ParkedCoordinate = a coordinate the user deferred. None is reduced to a bare axis label or silently dropped
DeferredResidual = { projection: DimensionProjection, basis: Evidence }
                 -- a projection still in Λ.deferred at convergence, surfaced as residual with its substrate basis
ParkedCoordinate = { coordinate: Coordinate, parked_at: cycle_n }
                 -- a coordinate the user answered Defer on: held in Λ.parked and re-surfaced as itself in later cycles, folded into residual if still unanswered at any termination.
                 -- Distinct from DeferredResidual by BOTH reason and return path: that one parks a PROJECTION the AI could not ground in the substrate and re-tries it only when I' advances; this one parks a COORDINATE the user could not answer yet and brings it back unchanged
resolved(I')   = ∂(intent) ≈ 0 (user constitutive judgment)
cycle_n        = Nat                            -- current cycle counter; surfaced at every Phase 2
Phase          ∈ {0, 1, 2, 3}
Axis           = String                         -- emergent label; examples: "intent", "goal", "form", "scope", "framework"
Initiator      ∈ {UserInvoked, AIDetected}      -- bound at activation; informs Hybrid Phase 2 first-surface semantics
Qs             = Cycle-emergent surfacing interaction with D_surfaced + Λ.parked + cycle counter [Tool: Constitution interaction]
ResolvedEndpoint = I' where user_judges_resolved(I') ∨ user_dismiss(I') ∨ no_advance(A) ∨ no_surfaceable_projection(D_surfaced = ∅ ∧ Λ.parked = ∅ ∧ Λ.deferred ≠ ∅); residual folds, at EVERY one of these terminations, each projection still in Λ.deferred (as a DeferredResidual) and each coordinate still in Λ.parked (as a ParkedCoordinate) — surfaced with its basis, never silently dropped

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
       → filter_confidence(D[]) → (D_surfaced, Λ.deferred)
       → resurface(Λ.parked)                                         -- coordinates the user deferred earlier are brought back as themselves, not re-derived
       → (D_surfaced, Λ.parked, context)
Phase 2: (D_surfaced, Λ.parked, cycle_n, initiator) → Qs(D_surfaced, Λ.parked, cycle_n) → Stop → A   -- Constitution; cycle counter visible
                                                                       -- Hybrid contract: cycle_n=1 ∧ initiator=AIDetected → first surfacing = implicit confirm-or-decline
Phase 3: A → integrate(A, I) → I'                                    -- track, residual identification; integrate ADDS only

Phase 0 → Phase 1: aporia(I) = true                                                          -- aporia confirmed → silent re-projection loop opens
Phase 0 → deactivate: aporia(I) = false                                                      -- no aporia signal → surface scan result (axis-determined routing recommendation OR articulate-or-withdraw), no activation
Phase 1 → Phase 2: D_surfaced ≠ ∅ ∨ Λ.parked ≠ ∅                                             -- something is answerable this cycle: a projection with concrete substrate basis, or a coordinate the user asked to come back to
Phase 1 → deactivate (nothing answerable): D_surfaced = ∅ ∧ Λ.parked = ∅ (ReverseTrace produced nothing, or every projection was parked by the confidence filter, and no user-deferred coordinate is waiting)  -- nothing can surface for an answer this cycle. If Λ.deferred ≠ ∅, converge to a ResolvedEndpoint whose residual folds each parked projection as a DeferredResidual (surfaced, never silently dropped — the same fold as the Phase 3 → converge residual paths); if Λ.deferred = ∅ (ReverseTrace found nothing at all), deactivate WITHOUT a ResolvedEndpoint (pure no-signal exit, the in-loop analogue of Phase 0's no-signal exit). TERMINATION GUARANTEE: at a fixed I'-state the immutable substrate makes a re-trace deterministic-identical, so re-tracing cannot change any projection's confidence — there is NO cycle-local re-trace path. I' advances ONLY via a surfaced Provide answer, and that re-projection is the Phase 3 → Phase 1 path, which no_advance(A) closes off when a cycle produced no Provide. Hence neither a nothing-answerable cycle nor a defer-everything cycle can loop; a confidence-parked projection is re-tried only when a later answer has advanced I'.
Phase 2 → Phase 3: A received                                                                -- per-coordinate answer accepted
Phase 3 → Phase 1: ¬user_judges_resolved(I') ∧ ¬user_dismiss ∧ ¬no_advance(A) → cycle_n += 1 -- re-projection: re-trace immutable substrate with accumulated I'; requires that this cycle advanced I' by at least one Provide, else the re-trace would repeat the cycle
Phase 3 → converge: user_judges_resolved(I')                                                 -- user constitutive judgment → ResolvedEndpoint + per-cycle coordinate trace; every remaining Λ.deferred projection and Λ.parked coordinate is folded into ResolvedEndpoint.residual and surfaced, never silently dropped
Phase 3 → converge (residual): A = Dismiss ∧ residual ≠ ∅                                     -- ResolvedEndpoint with residual annotated for downstream delegation: unresolved axes, remaining Λ.deferred projections (as DeferredResidual), and remaining Λ.parked coordinates (as ParkedCoordinate) folded in and surfaced
Phase 3 → converge (no advance): no_advance(A)                                               -- the cycle surfaced coordinates and the user deferred every one of them, so I' is unchanged and the next cycle would be identical → ResolvedEndpoint whose residual folds the parked coordinates and any remaining Λ.deferred projections. The deferral is honored as an answer, not discarded as a non-answer

── LOOP ──
After Phase 3: re-detect remaining aporia in I'.
Every termination below folds the same two leftovers into residual before returning: each projection still in Λ.deferred (as a DeferredResidual) and each coordinate still in Λ.parked (as a ParkedCoordinate). Neither is ever silently dropped.
If user_judges_resolved(I'): terminate, return ResolvedEndpoint.
If A = Dismiss + residual ≠ ∅: terminate with ResolvedEndpoint(residual annotated).
If no_advance(A) — the user deferred every coordinate surfaced this cycle: terminate with ResolvedEndpoint. I' is unchanged, so a re-trace would repeat the cycle; the deferral is carried out as residual rather than looped on.
Else: cycle_n += 1, return to Phase 1 (re-project: re-trace immutable substrate with accumulated I'; accepted coordinates carried forward unchanged; parked coordinates re-surfaced as themselves).
No fixed cycle cap.
Convergence presentation (relay, extension-classified; at termination):
  (a) Intent readback — plain single-sentence form of resolved I' assembled from coordinate values, in user-facing language;
  (b) Per-cycle coordinate trace — for each recorded step, show (D[step] → A[step] → I'[step]).
Convergence is demonstrated, not asserted; the readback materializes I' as a recognizable target without adding a separate constitutive gate.
Mid-cycle scope: Intent readback (a) also surfaces in Phase 2 from cycle_n ≥ 2 (see Phase 2 surfacing format); the per-cycle coordinate trace (b) is termination-only.

── CONVERGENCE ──
resolved(I') = ∃ step ∈ history : user_judges_resolved(I'[step])  -- at this convergence, every remaining Λ.deferred projection (as DeferredResidual) and every remaining Λ.parked coordinate (as ParkedCoordinate) is folded into ResolvedEndpoint.residual and surfaced (never silently dropped — Surfacing over Deciding)
early_exit = user_dismiss   -- the user's own answer ending the run. The harness interrupt is NOT an early exit and is not a member here: it arrives on a different channel and settles nothing (see §Harness Interrupt)
progress(Λ) = cycle_n (running counter; not bounded by a target)

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Detect       (sense)        → Internal analysis (no external tool)
Phase 0 Surface      (extension)    → TextPresent+Proceed (aporia=false: surface scan result; routing recommendation when axis-determined, or invite articulate-or-withdraw when substrate empty; no activation, no constitutive gate)
Phase 1 Substrate    (observe)      → Read, Grep, Bash (read-only substrate access — codebase / rules / session history / Environment queries: machine-setup metadata only — uname, pwd, version probes, git config public fields). Immutable read: substrate is never mutated
Phase 1 Utterance    (observe)      → Internal analysis of I.utterance for in-text semantic ambiguity (citation quotes actual utterance fragments only)
Phase 1 ReverseTrace (observe)      → Internal analysis (axis inference + coordinate construction → candidate DimensionProjections)
Phase 1 filter_confidence (track)   → Internal state update (extension — retain projections whose substrate basis is concrete in Λ.D_surfaced; park thin-basis projections in Λ.deferred for a later cycle. Relay: the partition is grounded in whether a citable substrate basis exists, never a user gate)
Phase 1 resurface    (track)        → Internal state update (extension — bring each coordinate in Λ.parked back into this cycle's surfacing as itself, carrying the question and basis it was parked with. Relay: the user already asked for it to come back, so there is nothing to gate)
Phase 2 Qs           (constitution) → present (mandatory; cycle-emergent dimension options from D_surfaced + any re-surfaced parked coordinates + substrate-cited basis + cycle counter)
Phase 3              (track)        → Internal state update (integrate ADDS coordinate determination to I'; accepted coordinates never revised; Defer moves coordinates into Λ.parked, Provide removes them)
Harness interrupt    (channel fact) → Not a tool call, not a phase transition, not an A, and not a result. It stops the turn and yields the floor; the protocol's state is untouched and its outcome undetermined. What the protocol becomes is settled by the user's next utterance, read like any other input (see §Harness Interrupt)
converge             (extension)    → TextPresent+Proceed (intent readback + per-cycle coordinate trace; proceed with ResolvedEndpoint)
Seam transition to declared next protocol (extension) → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol settles the next move — proceed directly to it, citing that settling source. This protocol declares no wired outbound continuation edge, so the second trigger is vacuously absent. Every Constitution gate inside this protocol and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = { phase: Phase, I: IntentSeed, I': IntentSeed, S: ExternalizedSubstrate,
      cycle_n: Nat,
      D_surfaced: List<DimensionProjection>,           -- this cycle's surfaceable projections (the only ones presented at Phase 2)
      deferred: Set(DimensionProjection),              -- projections parked by the confidence filter for lack of a concrete substrate basis; re-tried on a later cycle's Phase 3 → Phase 1 re-projection once a surfaced Provide answer has advanced I' (NOT re-traced at a fixed I'-state — deterministic-identical); surfaced as residual at every termination
      parked: Set(Coordinate),                         -- coordinates the user answered Defer on. Entered by Defer(coords), left only when that coordinate is later answered with Provide. Re-surfaced as itself at every subsequent Phase 2 — not re-derived, because the user already saw the question and said not yet. Folded into residual as a ParkedCoordinate at every termination. Kept apart from deferred above: different reason (the user could not answer vs. the substrate could not ground it) and different return path (comes back every cycle vs. only once I' advances)
      accepted_coords: Set(Coordinate),                -- monotone accumulator — once a coordinate is answered (Provide), it enters here and is NEVER removed or revised
      D_history: List<DimensionProjection[]>,
      A_history: List<UserAnswer>,
      I_history: List<IntentSeed>,
      initiator: Initiator,
      residual: Set(Axis ⊎ DeferredResidual ⊎ ParkedCoordinate),   -- Axis members = delegated unresolved axes; DeferredResidual members = confidence-parked projections; ParkedCoordinate members = user-deferred coordinates. All three folded in at every termination
      resolved: Bool, active: Bool, cause_tag: String }
-- Monotonicity invariant: accepted_coords is accumulate-only across cycles — integrate(A, I) may ADD to accepted_coords, never remove or overwrite an entry (full statement in §Coordinate Monotonicity Invariant)
-- Leftover invariant: parked ∩ accepted_coords = ∅ — a coordinate is either still waiting on the user or already answered, never both. Provide moves it across; nothing moves it back
-- Λ carries no field for the harness interrupt, by construction: it changes no state (see §Harness Interrupt)

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). registered dependency edges preserved. Substrate channel resolution emergent via session context.
```

## Core Principle

**Reverse Induction over Axis-Fixed Extraction**: When intent is articulated but its decision coordinates are implicit in the user's externalized substrate (codebase, rules, past sessions, user environment), neither AI alone nor user alone can resolve the endpoint. AI reverse-traces from the substrate to surface candidate dimension projections; the user's answers explicate which coordinates were already implicit in their externalized cognition. The resolution emerges through cycle iteration, not through axis-fixed extraction along a single pre-committed dimension. The dimension options surface per cycle from that cycle's substrate trace.

## Scope Boundary

This protocol does one thing: it makes implicit decision coordinates explicit so that intent crystallizes.

**It does not adjudicate which protocol a question belongs to.** When a surfaced coordinate turns out to want a missing fact, an undefined boundary, or a direction whose future cannot be recognized from a description, the protocol does not classify it, gate on it, or route it away — it surfaces the coordinate with its substrate basis and lets the user decide what to reach for next. Composition across protocols is the user's act, not this protocol's.

The omission is deliberate. Filtering candidate coordinates by which sibling protocol owns them adds a judgment the user did not ask for and spends attention on protocol boundaries rather than on the intent being clarified.

## Harness Interrupt

The harness interrupt can fire at any point. It stops the turn and yields the floor; it changes no protocol state and determines no outcome. What was accumulated stands. What the protocol becomes is settled by the user's next utterance, read the same way any other input is read.

Three consequences follow, and they are why this is stated once here rather than compiled into the phases:

- **It is not a phase transition.** It arrives mid-action as readily as at a surfacing, so no phase owns it and none may name it as an exit.
- **It is not an answer.** It reaches the protocol on the harness channel, not as an `A`, so it is not a member of the answer coproduct and not a peer of `Dismiss`.
- **It is not a result.** It settles nothing, so no result type may be predicated on it.

Ending, redirecting, and arriving at a changed understanding are therefore not three exits to be typed. They are three ways the *following utterance* can read, and reading utterances is what the protocol already does.

## Coordinate Monotonicity Invariant

**Invariant (Coordinate Monotonicity)**: An accepted coordinate is immutable. Once a coordinate is answered with `Provide(value)` and enters `Λ.accepted_coords`, no subsequent cycle — and no subsequent answer — may remove or overwrite it. A later answer ADDS determination to `I'`; it never REVISES an accepted coordinate. A `Defer(coords)`-ed coordinate, when later answered in a subsequent cycle, may only ADD determination — it cannot overturn a coordinate already accepted in an earlier cycle.

**Why this holds structurally**: substrate reads are immutable (Phase 1 uses read-only tools and never mutates the user's externalized cognition), and `I'` is accumulate-only (`integrate` adds coordinate values, never deletes them). Re-projection re-reads the same unchanged substrate with a more-determined `I'`; it cannot manufacture a new value for an already-accepted coordinate because the source it reads has not changed.

**Rationale / documented falsifier (the `Defer` retroactive-invalidation case)**: the risk the invariant forecloses is a `Defer`-then-answer sequence in which a deferred coordinate's later answer would imply a *different* value for a coordinate already accepted in an earlier cycle — retroactively invalidating it and breaking monotonicity. The invariant rules this out by construction: deferral parks a coordinate as still-pending (it was never accepted, so nothing about it is yet immutable), and when it is later answered the result is an ADD to `I'`, scoped to that coordinate. If a later answer genuinely contradicts an accepted coordinate, that is a **frame change**, not a within-loop revision: the user must re-open the resolved coordinate explicitly (a fresh constitutive act — equivalently a new `/elicit` pass over the changed intent), and the protocol surfaces the conflict rather than silently overwriting. The invariant is falsified if a re-projection cycle is ever observed to silently overwrite an accepted coordinate without such an explicit user re-opening.

## Mode Activation

### Activation

AI detects abstract aporia OR user calls `/elicit`. Detection is silent on the aporia-confirmed path (Phase 0); dimension surfacing always requires user interaction via Cognitive Partnership Move (Constitution) (Phase 2).

**Hybrid confirmation contract**: For AI-detected activation paths, the first Phase 2 surfacing (cycle_n=1) serves as the user-confirmation moment — the user's response to that first surface is the acknowledge-or-decline, satisfying the Hybrid initiator's "AI-detected trigger path requires user confirmation" contract. A decline is something the user says, not an absence: `Dismiss`, or any utterance that reads as declining. Phase 1 substrate scan precedes this confirmation under the substrate read-only constraint; no externalized state is mutated before user judgment.

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

**Action**: At Phase 2, present the cycle-emergent dimension projections with substrate-cited basis and cycle counter via Cognitive Partnership Move (Constitution).
</system-reminder>

- Euporia completes before action dependent on the resolved endpoint proceeds
- Loaded instructions resume once the protocol terminates

### Trigger Signals

| Signal | Detection |
|--------|-----------|
| Axis-undetermined intent | utterance carries action verb without specifying *which* axis (intent / goal / form / scope / framework / ...) is the relevant decision dimension |
| Substrate implicit coordinates | user's codebase / rules / past sessions / environment contain decision values that the intent does not surface |
| Multi-axis dependency | intent's resolution depends on coordinates spanning multiple axes that no single axis-specific protocol covers |
| Aporia language | utterance such as "I want to ... but I'm not sure how to ..." or open-ended action statements without endpoint constraint |

**Cross-session enrichment**: Prior session indices from the hypomnesis store (prior-session recall indices), when present, may seed the substrate scan; the constitutive judgment remains with the user.

**Skip**:
- Intent is fully axis-determined (a single axis-specific protocol covers it)
- Substrate is empty (no externalized coordinates available — fall back to direct execution or Aitesis)
- User explicitly requests proceed without surfacing
- Same (utterance, substrate slice) was resolved or dismissed in current session (session immunity)
- Wants generated candidates from a topic or fragments, not coordinates reverse-traced from externalized substrate → Heuresis (`/ideate`)

### Activation Conditions

Euporia activates when (a) the user's intent is articulated as an utterance, (b) the utterance does not commit to a single axis-specific protocol, (c) the user's externalized substrate carries implicit decision coordinates relevant to the intent's resolution, and (d) the substrate is reachable through read-only tools. The gate is the conjunction of axis-undetermined intent and substrate-implicit coordinates, not instance count or scenario template.

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| user_judges_resolved(I') | Return ResolvedEndpoint with per-cycle coordinate trace; every remaining `Λ.deferred` projection and `Λ.parked` coordinate folded into residual and surfaced |
| Dismiss + residual | Return ResolvedEndpoint with residual annotated for downstream delegation — unresolved axes, remaining `Λ.deferred` projections, and remaining `Λ.parked` coordinates folded in and surfaced, never silently dropped |
| Every surfaced coordinate deferred (`no_advance`) | `I'` is unchanged, so a further cycle would repeat this one. Return ResolvedEndpoint folding the parked coordinates and any remaining `Λ.deferred` projections into residual — the deferral is carried out, not looped on |
| No aporia signal at Phase 0 (axis-determined or substrate empty) | Surface scan result without activating — routing recommendation when axis-determined, articulate-or-withdraw invitation when substrate empty |
| Nothing answerable this cycle | No projection has a concrete substrate basis and no coordinate is waiting (`D_surfaced = ∅ ∧ Λ.parked = ∅`). If any projection sits in `Λ.deferred`, converge to a ResolvedEndpoint folding each as a DeferredResidual (surfaced, never silently dropped); if `Λ.deferred = ∅` (the trace found nothing at all), deactivate without a ResolvedEndpoint — the in-loop analogue of Phase 0's no-signal exit |

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

**Scope restriction**: Detection does not modify the substrate. The no-signal surface is a relay presentation — no constitutive gate.

### Phase 1: Substrate Access + Reverse Trace

Read substrate channels (immutable), reverse-trace candidate dimension projections, and retain the ones with a concrete substrate basis for surfacing.

1. **Substrate scan** (external channels): Read/Grep over the user's codebase, rules, recent sessions; Bash for read-only Environment queries (machine-setup metadata only: uname, pwd, tool versions, git config public fields). Tag each evidence record with its substrate channel (Codebase / Rules / Session / Environment). Reads are immutable — the substrate is never mutated, which is what makes re-trace a read-only re-projection rather than a revalidation.
2. **Utterance analysis** (Utterance channel): Internal analysis of `I.utterance` for in-text semantic ambiguity. Citations quote the actual utterance fragment only; paraphrase and attribution of unstated mental models are outside the channel. Utterance evidence supplements external substrate evidence within Phase 1 dimension projections — it does not by itself trigger activation (see Gate predicate).
3. **ReverseTrace**: From the intent and the substrate evidence, infer candidate dimensions whose coordinates are likely implicit in the substrate. Each `Coordinate` within the projection carries (name, default, question, basis: Evidence); each `DimensionProjection` carries (axis_inferred, coordinates, confidence).
4. **Filter by confidence**: Retain in `Λ.D_surfaced` only the projections whose substrate basis is concrete; move thin-basis projections into `Λ.deferred` (re-traced when more of `I'` is determined). Only the retained projections reach Phase 2. Do not filter by which sibling protocol a coordinate might belong to — see **Scope Boundary**.
5. **Bring back what the user parked**: every coordinate in `Λ.parked` re-enters this cycle's surfacing as itself, carrying the question and basis it was parked with. Do not re-derive it from the substrate and do not reword it — the user already read that question and answered "not yet", so what comes back has to be recognizable as the same question.
6. Package `(D_surfaced, Λ.parked, context)`. If either is non-empty, proceed to Phase 2. If both are empty, take the **`Phase 1 → deactivate (nothing answerable)`** path: if `Λ.deferred ≠ ∅`, converge to a ResolvedEndpoint folding each parked projection as a DeferredResidual (surfaced, never silently dropped — the same fold as convergence); if `Λ.deferred = ∅`, deactivate without a ResolvedEndpoint. Do NOT re-trace at the current `I'`-state — the termination guarantee in PHASE TRANSITIONS covers why.

**Scope restriction**: The substrate is read, never written. This is the protocol's own property, not a rule about which tools may run: the accumulate-without-overwrite guarantee holds because the source a re-trace re-reads has not changed under it. Substrate evidence must cite a specific source.

### Phase 2: Cycle-Emergent Dimension Surfacing (Constitution)

**Present** dimension projections with substrate-cited basis and cycle counter via Cognitive Partnership Move (Constitution).

**Surfacing format**:

Present dimension projections as text output:
- **Cycle**: `cycle_n` (always visible)
- **Intent readback** (cycle_n ≥ 2): plain single-sentence form of current I' assembled from resolved coordinates; provides the user a recognizable target for `user_judges_resolved` judgment without adding a separate gate
- For each `DimensionProjection` in `Λ.D_surfaced`:
  - **Axis**: [axis_inferred]
  - **Coordinates**: [coordinate names + question per coordinate]
  - **Substrate basis**: [evidence cited from substrate channels, including Utterance fragments when applicable]
  - **Default** (when substrate-derivable): [default value with citation]
- **Brought back** (when `Λ.parked ≠ ∅`): each coordinate the user deferred earlier, in its original wording, marked as returning rather than new
- **In play this cycle**: [the coordinates still pending in the current cycle] — a framing readout of what remains open this cycle, not a resolved/total tally

Then present per-coordinate answer slots (cycle-emergent — no fixed dialect; the slots reflect the actual coordinates of the current cycle):

```
For each surfaced coordinate, provide an answer or defer.
Or:
- Defer specific coordinates — they come back next cycle as themselves
- Dismiss + delegate residual to downstream protocols
```

Design principles for this surfacing (substrate-cited basis, cycle counter visibility, coordinate-level granularity, free response) are recorded in **UX Safeguards** below.

### Phase 3: Integration

After user response. `integrate(A, I)` is **monotone**: it ADDS coordinate determination to `I'` and never revises a previously accepted coordinate (see §Coordinate Monotonicity Invariant).

1. **Provide(values)**: Update I' with provided coordinate values; enter the answered coordinates into `Λ.accepted_coords` and remove each from `Λ.parked` if it was waiting there. Append snapshot of I' to `I_history`.
2. **Defer(coords)**: Put each deferred coordinate into `Λ.parked` (covers ambiguous/partial/not-yet-answerable). It stays there, re-surfaced as itself every cycle, until answered with `Provide` or folded into residual at termination — it is never dropped for having gone unanswered. Append current I' snapshot (unchanged in a Defer cycle) to `I_history` to preserve pairwise alignment with `D_history` and `A_history`. If `coords` covers every coordinate surfaced this cycle, `no_advance(A)` holds and the run terminates rather than re-tracing an unchanged `I'`.
3. **Dismiss**: Mark intent as dismissed-with-residual; collect unresolved axes, any remaining `Λ.deferred` projections, and any remaining `Λ.parked` coordinates (each with its basis) into `residual`. Terminate.

**Conflict handling**: a later answer contradicting an accepted coordinate is a frame change requiring explicit user re-opening, never a silent overwrite — see §Coordinate Monotonicity Invariant.

After integration:
- Re-detect remaining aporia in I'
- If `user_judges_resolved(I')` or `no_advance(A)`: terminate with ResolvedEndpoint + per-cycle trace; fold every remaining `Λ.deferred` projection and `Λ.parked` coordinate into `residual` and surface them (never silently dropped)
- Else: increment `cycle_n`, return to Phase 1 to re-project (see LOOP)

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
| Substrate evidence required | Phase 1 dimension projections must cite specific substrate evidence (file:line, rule reference, session id) | Prevents speculation; reverse-trace must be grounded |
| Confidence filter | Only projections with a concrete substrate basis reach Phase 2; thin-basis projections park in `Λ.deferred` and surface as residual if never retried | Prevents asking a coordinate the substrate cannot ground, without dropping it |
| Composition left to the user | No filtering by which sibling protocol owns a coordinate; surfaced coordinates carry their basis and the user decides what to reach for next | Keeps attention on the intent rather than on protocol boundaries (see **Scope Boundary**) |
| Coordinate monotonicity | Accepted coordinates are immutable; integrate ADDS, never revises; Phase 1 reads never mutate the substrate | Re-projection cannot invalidate an already-accepted coordinate; resolution reached by accumulation, never regression |
| Cycle counter visibility | Phase 2 surfacing always shows `cycle_n` | User perceives cycle signal density and decides when to terminate |
| Cycle-emergent option set | Phase 2 options reflect current cycle's coordinates; no fixed dialect | Adapts to actual coordinates surfaced; respects axis-emergence |
| Coordinate-level granularity | User answers per-coordinate; deferral per-coordinate | Permits partial progress within a cycle |
| Deferred coordinates come back | `Defer` parks the coordinate in `Λ.parked` and every later cycle re-surfaces it in its original wording; if still unanswered at termination it is folded into residual | "Not yet" is held rather than lost, and comes back recognizable as the same question |
| Free response honored | User may answer beyond, redirect, name an excluded dimension, or terminate at any Phase 2 | Full constitutive control |
| Session immunity | Resolved or dismissed (utterance, substrate slice) → skip for session | Respects user's resolution or release |
| Substrate read-only | Phase 1 substrate access uses read-only tools only | No mutation of user's externalized cognition during scan |
| Utterance channel discipline | Utterance evidence quotes the actual utterance fragment only; paraphrase and attribution of unstated mental models are outside the channel | Prevents AI from projecting unspoken user mental models as substrate evidence |
| Utterance-only activation guard | Utterance evidence supplements external substrate evidence; utterance-only signals do not satisfy the activation predicate | Prevents false-positive activation when no external substrate carries implicit coordinates |
| Convergence readback (Phase 2, cycle_n ≥ 2) | At every Phase 2 from cycle_n ≥ 2, present I' as plain single-sentence readback (readback alone, no trace) | Provides recognizable target for `user_judges_resolved`; prevents implicit resolution assertion mid-cycle |
| Convergence readback (termination) | At termination, present I' as readback alongside the per-cycle coordinate trace | Demonstrates convergence with full history; readback materializes the resolved endpoint as a recognizable sentence |
| Harness interrupt is not an exit | The interrupt stops the turn and yields the floor; it changes no state and settles nothing, and the next utterance decides what follows (see **Harness Interrupt**) | No phase, answer type, or result is predicated on it, so the protocol cannot mistake a mention of it for a use of it |

## Rules

1. **AI-guided substrate access, user-resolved**: AI reverse-traces dimension projections from substrate; resolution requires user answer via Cognitive Partnership Move (Constitution) (Phase 2).
2. **Recognition over Recall**: Present structured dimension surfacing via Cognitive Partnership Move (Constitution) — structured content reaches the user with response opportunity; Constitution interaction requires turn yield.
3. **User constitutive interaction**: User answers operate at three layers — coordinate-level (per-coordinate provide/defer/dismiss), endpoint-level (`resolved(I')` is user judgment, not AI assertion), and frame-level (user may redirect to an unsurfaced dimension or terminate; free response routes the next cycle's substrate scan).
4. **Convergence persistence**: Mode active until the user judges resolved, dismisses, defers everything a cycle surfaced (`no_advance`), or a cycle finds nothing answerable. Each of these is something the run reaches; none of them is the harness interrupt, which ends no run — see Rule 14.
5. **Context-Question Separation**: Output substrate evidence and rationale as text before presenting via Cognitive Partnership Move (Constitution). The question contains only the per-coordinate answer slot; the dimension surface is pre-gate context.
6. **Option-set relay test (Extension classification)**: If AI analysis converges to a single dominant coordinate value (option-level entropy → 0), present the value directly as relay. The user answer slot remains constitutive when multiple valid coordinate values exist under different user value weightings.
7. **Gate integrity** (Safeguard tier): The cycle-emergent option set is presented as a coherent dimension cluster per cycle; partial omission of surfaced coordinates without user dismissal violates this invariant. Type-preserving materialization (specializing a generic axis into a concrete coordinate while preserving the surfacing structure) is distinct from mutation.
8. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
9. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
10. **Composition is the user's**: This protocol surfaces implicit decision coordinates; it does not adjudicate which protocol a coordinate belongs to. A coordinate that turns out to want a missing fact, an undefined boundary, or an unrecognizable direction is surfaced with its substrate basis like any other — not classified, not gated on, not routed away. The only Phase 1 filter is whether a projection has a concrete substrate basis (thin-basis projections park in `Λ.deferred` and surface as residual rather than being dropped). Leaving composition open is deliberate: classifying coordinates by sibling-protocol ownership spends the user's attention on protocol boundaries instead of on the intent being clarified. See **Scope Boundary**.
11. **Coordinate monotonicity**: An accepted coordinate is immutable — once answered with `Provide` and entered into `Λ.accepted_coords`, no subsequent cycle or answer removes or overwrites it. `integrate(A, I)` ADDS determination to `I'`; it never REVISES an accepted coordinate. A `Defer`-ed coordinate, when later answered, may only add determination. Re-trace is read-only re-projection over the same unchanged substrate with a more-determined `I'`. A later answer that genuinely contradicts an accepted coordinate is a **frame change**, surfaced for explicit user re-opening (a fresh constitutive act), never a silent within-loop overwrite. See §Coordinate Monotonicity Invariant.
12. **Formal blocks are runtime-normative**: This protocol's formal blocks — those defined in its Definition code block above — are LLM-facing and constitutive of protocol identity: they type the prose and carry the operational contract executed at runtime. A reduced or single-shot realization carries every one of them through as runtime contract, since each block is the type that constitutes the protocol — preserving the blocks keeps the protocol intact. How its symbols render to the user is a separate emit-layer concern (see Plain emit discipline).
13. **Seam relay on declared continuation**: when a user-declared chain names the next protocol, the between-protocol seam after this protocol's convergence (ResolvedEndpoint) is relay (Extension) — proceed directly, citing the settling source (the chain declaration). This protocol declares no wired outbound continuation edge, so the second trigger is vacuously absent. This governs only the seam BETWEEN protocols; every Constitution gate inside this protocol and the next fires unchanged, and the user can redirect at any turn.
14. **The harness interrupt settles nothing**: it can fire at any point, stops the turn, and yields the floor. It changes no protocol state and determines no outcome; what was accumulated stands, and what the protocol becomes is settled by the user's next utterance, read like any other input. It is therefore not a phase transition, not a member of the answer coproduct, and not a result type, and nothing in this protocol may be predicated on it. Ending, redirecting, and arriving at a changed understanding are readings of the following utterance, not exits to be typed — the protocol already reads utterances, so none of them needs its own type. One consequence worth naming: because the interrupt cannot be invoked in words, a user *mentioning* it is never a use of it. See §Harness Interrupt.
15. **A deferred coordinate is parked, not dropped**: `Defer(coords)` puts each coordinate into `Λ.parked`, and every later cycle re-surfaces it as itself — same question, same basis — because the user already read that question and answered "not yet"; re-deriving or rewording it would present a different question and lose the answer they gave. It leaves `Λ.parked` only when answered with `Provide`, and at every termination whatever remains folds into `residual` as a `ParkedCoordinate` and is surfaced. This is kept distinct from `Λ.deferred`, which holds projections the confidence filter could not ground in the substrate: different reason, different return path. When a single answer defers every coordinate the cycle surfaced, `I'` is unchanged and a re-trace would repeat the cycle, so the run terminates and carries the parked coordinates out as residual rather than looping on them.
