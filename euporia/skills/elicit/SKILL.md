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
         filter_confidence(D[]) → (D_surfaced, Λ.deferred)                              -- concrete substrate basis retained; thin-basis projections held back
         resurface(Λ.parked)                                                            -- coordinates the user could not answer yet come back as themselves
         Qs(D_surfaced, Λ.parked, cycle_n) → Stop → A → integrate(A, I) → I' →
         loop until resolved(I') ∨ user_dismiss
  false: surface scan result; route to axis-specific protocol (axis-determined) or invite user to articulate or withdraw (substrate empty)

── MORPHISM ──
IntentSeed
  → detect(aporia, axis_undetermined)        -- verify abstract aporia exists
  → access(externalized_substrate)            -- read external substrate channels (codebase / rules / sessions / environment)
  → observe(utterance_ambiguity)              -- analyze I.utterance for in-text semantic ambiguity (Utterance channel; internal)
  → reverse_trace(coordinates)                -- infer user's externalized decision coordinates → candidate DimensionProjections
  → filter_confidence(D[]) → D_surfaced       -- retain projections whose substrate basis is concrete; hold thin-basis projections back in Λ.deferred
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
filter_confidence = D[] → (D_surfaced, deferred)  -- partition on substrate-basis concreteness; deferred projections are re-tried on a later cycle's re-projection
D_surfaced     = List(DimensionProjection)     -- this cycle's surfaceable projections (the ones Phase 2 presents)
A              = UserAnswer ∈ {Provide(values), Defer(coords), Dismiss}   -- per-coordinate answer
                 values         = Map(Coordinate, Value)
                 coords         = Set(Coordinate) -- parked for a later cycle (covers ambiguous/partial/not-yet-answerable)
R              = ResolvedEndpoint { intent_resolved: I', residual: Set(Axis ⊎ DeferredResidual ⊎ Coordinate) }
                 -- residual members are tagged: Axis = an unresolved axis delegated to a downstream protocol; DeferredResidual = a projection the confidence filter held back; Coordinate = a coordinate the user deferred. None is reduced to a bare axis label or silently dropped
DeferredResidual = { projection: DimensionProjection, basis: Evidence }
                 -- a projection still in Λ.deferred at convergence, surfaced as residual with its substrate basis
resolved(I')   = ∂(intent) ≈ 0 (user constitutive judgment)
cycle_n        = Nat                            -- current cycle counter; surfaced at every Phase 2
Phase          ∈ {0, 1, 2, 3}
Axis           = String                         -- emergent label; examples: "intent", "goal", "form", "scope", "framework"
Initiator      ∈ {UserInvoked, AIDetected}      -- bound at activation; informs Hybrid Phase 2 first-surface semantics
Qs             = Cycle-emergent surfacing interaction with D_surfaced + Λ.parked + cycle counter [Tool: Constitution interaction]
ResolvedEndpoint = I' where user_judges_resolved(I') ∨ user_dismiss(I'); residual folds, at EITHER termination, each projection still in Λ.deferred (as a DeferredResidual) and each coordinate still in Λ.parked (as itself) — surfaced with its basis, never silently dropped

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
Phase 1 → Phase 2: always                                                                    -- every cycle hands the turn to the user, including one whose trace surfaced nothing new
Phase 2 → Phase 3: A received                                                                -- per-coordinate answer accepted
Phase 3 → Phase 1: ¬user_judges_resolved(I') ∧ ¬user_dismiss → cycle_n += 1                  -- re-projection: re-trace the substrate with accumulated I'; accepted coordinates carried forward unchanged, parked coordinates re-surfaced as themselves
Phase 3 → converge: user_judges_resolved(I')                                                 -- user constitutive judgment → ResolvedEndpoint + per-cycle coordinate trace; every remaining Λ.deferred projection and Λ.parked coordinate is folded into ResolvedEndpoint.residual and surfaced, never silently dropped
Phase 3 → converge (residual): A = Dismiss                                     -- ResolvedEndpoint with residual annotated for downstream delegation: unresolved axes, remaining Λ.deferred projections (as DeferredResidual), and remaining Λ.parked coordinates (as themselves) folded in and surfaced; the residual may be empty

── LOOP ──
After Phase 3: re-detect remaining aporia in I'.
Every termination below folds the same two leftovers into residual before returning: each projection still in Λ.deferred (as a DeferredResidual) and each coordinate still in Λ.parked (as itself). Neither is ever silently dropped.
If user_judges_resolved(I'): terminate, return ResolvedEndpoint.
If A = Dismiss: terminate with ResolvedEndpoint (residual annotated; it may be empty).
Else: cycle_n += 1, return to Phase 1 (re-project: re-trace the substrate with accumulated I'; accepted coordinates carried forward unchanged; parked coordinates re-surfaced as themselves).
No fixed cycle cap.
Convergence presentation (relay, extension-classified; at termination):
  (a) Intent readback — plain single-sentence form of resolved I' assembled from coordinate values, in user-facing language;
  (b) Per-cycle coordinate trace — for each cycle, show (D_surfaced → A → I').
Convergence is demonstrated, not asserted; the readback materializes I' as a recognizable target without adding a separate constitutive gate.
Mid-cycle scope: Intent readback (a) also surfaces in Phase 2 from cycle_n ≥ 2 (see Phase 2 surfacing format); the per-cycle coordinate trace (b) is termination-only.

── CONVERGENCE ──
resolved(I') = user_judges_resolved(I')  -- at this convergence, every remaining Λ.deferred projection (as DeferredResidual) and every remaining Λ.parked coordinate (as itself) is folded into ResolvedEndpoint.residual and surfaced (never silently dropped — Surfacing over Deciding)
early_exit = user_dismiss   -- the user's own answer ending the run
progress(Λ) = cycle_n (running counter; not bounded by a target)

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Detect       (sense)        → Internal analysis (no external tool)
Phase 0 Surface      (extension)    → TextPresent+Proceed (aporia=false: surface scan result; routing recommendation when axis-determined, or invite articulate-or-withdraw when substrate empty; no activation, no constitutive gate)
Phase 1 Substrate    (observe)      → artifact read, artifact search, environment run (read-only substrate access — codebase / rules / session history / Environment queries: machine-setup metadata only — uname, pwd, version probes, git config public fields). Immutable read: substrate is never mutated
Phase 1 Utterance    (sense)        → Internal analysis of I.utterance for in-text semantic ambiguity (citation quotes actual utterance fragments only)
Phase 1 ReverseTrace (sense)        → Internal analysis (axis inference + coordinate construction → candidate DimensionProjections)
Phase 1 filter_confidence (track)   → Internal state update (extension — retain projections whose substrate basis is concrete in Λ.D_surfaced; hold thin-basis projections back in Λ.deferred for a later cycle. Relay: the partition is grounded in whether a citable substrate basis exists, never a user gate)
Phase 1 resurface    (track)        → Internal state update (extension — bring each coordinate in Λ.parked back into this cycle's surfacing as itself, carrying the question and basis it was parked with. Relay: the user already asked for it to come back, so there is nothing to gate)
Phase 2 Qs           (constitution) → present (mandatory; cycle-emergent dimension options from D_surfaced + any re-surfaced parked coordinates + substrate-cited basis + cycle counter)
Phase 3              (track)        → Internal state update (integrate ADDS coordinate determination to I'; accepted coordinates never revised; Defer moves coordinates into Λ.parked, Provide removes them)
converge             (extension)    → TextPresent+Proceed (intent readback + per-cycle coordinate trace; proceed with ResolvedEndpoint)
Seam transition to declared next protocol (extension) → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol settles the next move — proceed directly to it, citing that settling source. This protocol declares no wired outbound continuation edge, so the second trigger is vacuously absent. Every Constitution gate inside this protocol and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = { phase: Phase, I: IntentSeed, I': IntentSeed, S: ExternalizedSubstrate,
      cycle_n: Nat,
      D_surfaced: List<DimensionProjection>,           -- this cycle's surfaceable projections (the only ones presented at Phase 2)
      deferred: Set(DimensionProjection),              -- projections held back by the confidence filter for lack of a concrete substrate basis; re-tried on a later cycle's Phase 3 → Phase 1 re-projection; surfaced as residual at every termination
      parked: Set(Coordinate),                         -- coordinates the user answered Defer on. Entered by Defer(coords), left only when that coordinate is later answered with Provide. Re-surfaced as itself at every subsequent Phase 2 — not re-derived, because the user already saw the question and said not yet. Folded into residual as itself at every termination. Kept apart from deferred above: different reason (the user could not answer vs. the substrate could not ground it) and different return path (comes back every cycle as itself vs. re-derived on a later re-projection)
      accepted_coords: Set(Coordinate),                -- monotone accumulator — once a coordinate is answered (Provide), it enters here and is NEVER removed or revised
      initiator: Initiator,
      residual: Set(Axis ⊎ DeferredResidual ⊎ Coordinate),   -- Axis members = delegated unresolved axes; DeferredResidual members = projections the confidence filter held back; Coordinate members = user-deferred coordinates. All three folded in at every termination
      resolved: Bool, active: Bool, cause_tag: String }
-- Monotonicity invariant: accepted_coords is accumulate-only across cycles — integrate(A, I) may ADD to accepted_coords, never remove or overwrite an entry (full statement in §Coordinate Monotonicity Invariant)
-- Leftover invariant: parked ∩ accepted_coords = ∅ — a coordinate is either still waiting on the user or already answered, never both. Provide moves it across; nothing moves it back

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Substrate channel resolution emergent via session context.
```

## Scope Boundary

Euporia surfaces grounded decision coordinates without adjudicating which sibling protocol owns them. A coordinate that exposes a missing fact, undefined boundary, or unrecognizable direction remains a coordinate with its substrate basis; the user decides what to reach for next.

## Coordinate Monotonicity Invariant

An accepted coordinate is immutable. `integrate` only adds determinations to `I'`; a later contradiction is surfaced as a frame change requiring the user to reopen that coordinate through a fresh constitutive act.

## Mode Activation

`/elicit` remains directly invocable. AI-guided activation requires an axis-undetermined intent backed by an external substrate signal from Codebase, Rules, Session, or Environment. Utterance evidence may ground a projection after activation, but cannot activate Euporia by itself.

On the AI-guided path, the immutable Phase 1 scan may precede confirmation; the first Phase 2 response confirms or declines the run. Skip AI-guided activation when the user explicitly asks to proceed without surfacing, or when the same utterance and substrate slice was resolved or dismissed in this session.

## Protocol

### Phase 2 surfacing format

At Phase 2, render the cycle counter and, from cycle 2 onward, a plain one-sentence readback of current `I'`. For each surfaced projection, show its inferred axis, coordinate questions, cited substrate basis, and any substrate-derived default. Mark each parked coordinate as returning in the same wording and with the same basis. Let the listed coordinates establish what is currently in play without a derived count or resolved/total tally, then present per-coordinate provide-or-defer slots plus Dismiss-with-residual and yield the turn.

Utterance evidence quotes the user's actual fragment; it does not attribute an unstated mental model. Only projections with concrete substrate basis reach the surface. Read `references/round-composition.md` before composing when a term must remain stable across the session, wording must travel unchanged, material belongs to another round or trace, or phase order determines whether text belongs before or inside the gate.

### Intensity

| Level | When | Format |
|-------|------|--------|
| Light | One grounded dimension | Brief surface and per-coordinate slots |
| Medium | Several dimensions or partial evidence | Full surface at coordinate granularity |
| Heavy | Multi-axis, weak-basis, multi-cycle prospect | Full surface with per-coordinate evidence and explicit residuals |

## Rules

1. **Recognition over Recall**: Present structured dimension projections with anticipatable post-answer states.
2. **Round composition**: Use everyday language, keep each judgment beside its nearest evidence and next-move implication, and place analytical context before the answer slots.
3. **Option-set relay test**: Present a single dominant coordinate value as Extension. Keep the answer slot constitutive when different user value weightings sustain multiple values.
4. **Parked-coordinate identity**: A deferred coordinate returns each cycle as the same question with the same basis, marked as returning; it leaves `Λ.parked` only through Provide or termination residual folding.
5. **Form feedback**: Derive each round's density from the current request and carry an explicit form instruction until countermanded. Change the form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
