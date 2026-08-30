---
name: induce
description: "Crystallize a shared but unnamed concept from the concrete cases at hand. Type: (AbstractionInProcess, AI, INDUCE, A) → CrystallizedAbstraction"
---

# Periagoge Protocol

Calibrate and crystallize in-process abstraction through AI-proposed candidate plus user dialectical triangulation. Type: `(AbstractionInProcess, AI, INDUCE, A) → CrystallizedAbstraction`.

## Definition

**Periagoge** (περιαγωγή): A dialogical act of turning an in-process abstraction toward its crystallized form, where AI detects when an instance set has converged toward an unnamed essence, calibrates the user's in-process concept against that instance set, proposes a calibrated candidate abstraction paired with a personalized grounding example drawn from the user's own domain, and shapes the candidate through the user's response — accept the candidate, broaden its scope, narrow it along a specific dimension, fuse it with an adjacent abstraction, or redirect onto an orthogonal axis — until the abstraction locates itself (the Greek dialectical vocabulary supplies the source terms).

```
── FLOW ──
Periagoge(A) → Detect(A) →
  InProcess(Iᵢ, E, L?): Calibrate(Iᵢ, E, L?, ctx) → K →
         Propose(Iᵢ, E, K, ctx) → (P, G) →
         Qs(P, G, K, framing) → Stop → V → integrate(V, candidate) → candidate' →
         loop until crystallized(Λ) → declare(completion_trace, open_trace) → CrystallizedAbstraction
         or attempts_exhausted(Λ) → deactivate
  NotInProcess: deactivate

── MORPHISM ──
A
  → detect(instances, essence, locator)   -- verify in-process abstraction exists
  → calibrate(E, L?, Iᵢ, ctx)             -- surface what instances preserve, sharpen, prune, and leave open
  → propose(candidate, grounding, calibration)  -- AI generates candidate + personalized example + calibration map
  → triangulate(candidate, user_move)     -- user shapes via type-preserving materialized moves
  → integrate(V, candidate)               -- update candidate per user response
  → crystallize(abstraction)              -- convergence when confirmed
  → declare(trace, open_trace)             -- terminal evidence trace + open-item disposition
  → CrystallizedAbstraction
requires: in_process(A)                    -- runtime checkpoint (Phase 0)
deficit:  AbstractionInProcess              -- activation precondition (Layer 1/2)
preserves: instance_set(A)                  -- Iᵢ read-only; K computed per Phase 1 entry and recomputed on Phase 1 re-entry; candidate mutates per user move
invariant: Calibrative Induction through Dialectical Triangulation over Unilateral Correction

── TYPES ──
A              = AbstractionSeed (in-process state: instances + essence intuition + optional user concept label)
Detect         = A → DetectResult
DetectResult   ∈ {InProcess(Iᵢ, E, L?), NotInProcess}
                 -- closed: Phase 0's two exits; the payload rides the InProcess branch, so no verdict and payload
                 -- can disagree, and InProcess is what witnesses requires: in_process(A)
Iᵢ             = Set(Instance)                             -- instance set observed; cardinality unconstrained (any N ≥ 1 qualifies when essence is sensed; richer sets provide stronger triangulation material)
Instance       = { content: String, context: String }       -- concrete case observed
E              = EssenceIntuition                           -- variation-stable core signal from conversation
L              = Option(TentativeLabel)                     -- user-provided provisional name or concept, if any
ctx            = DomainContext                              -- user's domain context gathered via artifact read, artifact search, and a conditional external fetch in Phase 1
Calibrate      = (Iᵢ, E, L?, ctx) → K
K              = CalibrationMap { keeps, sharpens, prunes, open, label_basis }
                 keeps       = supported core to preserve
                 sharpens    = under-specified decision-relevant structure
                 prunes      = overextended or unsupported scope to release
                 open        = residual uncertainty that does not block crystallization
                 label_basis = Option(L) as the user gave it, carried with its provenance
OpenDisposition ∈ {None, Nonblocking, Deferred}
                 None        = no open calibration pressure remains; explicitly declared
                 Nonblocking = open item remains visible but does not block Confirm
                 Deferred    = user routes an open item to later work via free response
OpenItemDisposition = OpenDisposition \ {None}             -- per-item value space; None is a whole-trace verdict only
OpenTrace      = { status: OpenDisposition, items: Map(String, OpenItemDisposition) }
                 -- terminal disposition for K.open; empty open sets declare status None
                 -- invariant: dom(items) = K.open — every open item carries exactly one disposition, which is what makes status(O) total
status(O)      = None if K.open = ∅; Deferred if ∃ i ∈ dom(O.items) : O.items(i) = Deferred; otherwise Nonblocking
                 -- O is the OpenTrace value (Λ.open_trace); K is the CalibrationMap this trace terminates (Λ.calibration)
P              = CandidateAbstraction { name, structure, instance_map, provenance }
G              = GroundingExample { scenario: String, domain: String, mapping: String }
                                                             -- personalized to user's own domain context
Propose        = (Iᵢ, E, K, ctx) → (P, G)
V              = UserMove ∈ {Confirm, Widen(direction), Narrow(specializer), Fuse(adjacent), Reorient(axis), Dismiss}
                 direction    ∈ {upward, lateral}           -- Synagoge family; AI-proposed broadening (user Recognition mode)
                 specializer  = dimension to constrain      -- Diairesis family (user-directed specialization)
                 adjacent     = neighboring abstraction ref  -- lateral Synagoge with user-named reference (user Production mode)
                 axis         = orthogonal dimension         -- full redirection
Qs             = Shaping interaction with candidate + grounding [Tool: Constitution interaction]
crystallized(Λ) = ∃ step ∈ Λ.history : V(step) = Confirm
max_attempts   = the triangulation cap LOOP fixes per abstraction seed
attempts_exhausted(Λ) = |Λ.history| ≥ max_attempts ∧ ¬crystallized(Λ)
                 -- Λ.history appends exactly one step per triangulation attempt, so |Λ.history| is the attempt count
                 -- and the cap is read after Phase 3's append; a Confirm on the capped attempt crystallizes rather
                 -- than exhausting, which is what keeps the two LOOP exits mutually exclusive
CompletionTrace = List<(A, K, P, V, candidate')>
                 -- derived from Λ.history with A sourced from Λ.A and candidate' computed from each step's post-move candidate state
CrystallizedAbstraction = P where confirmed(P) via Confirm move ∧ completion_trace_declared(CompletionTrace) ∧ open_disposition_declared(OpenTrace)

── A-BINDING ──
bind(A) = explicit_arg ∪ recent_instance_cluster ∪ surfaced_essence
Priority: explicit_arg > recent_instance_cluster > surfaced_essence

/induce "theme"              → A = AbstractionSeed with theme label
/induce (alone)              → A = most recent instance cluster in session (any cardinality)
"the pattern across..."      → A = instance cluster under discussion

If no essence signal is detectable (neither user sensing language nor AI-inferrable core pattern): pause activation and surface the scan result before Phase 0, inviting the user to either name what feels in-process or withdraw.

── PHASE TRANSITIONS ──
Phase 0: A → Detect(A) → InProcess(Iᵢ, E, L?) | NotInProcess               -- detection checkpoint (silent)
Phase 1: (Iᵢ, E, L?) → Calibrate(Iᵢ, E, L?, ctx) → K → Propose(Iᵢ, E, K, ctx) → (P, G); carry (P, G, K)  -- calibration + candidate + grounding construction [Tool]
Phase 2: (P, G, K) → Qs(P, G, K, framing) → Stop → V                      -- triangulation Constitution interaction [Tool]
Phase 3: V → integrate(V, candidate) → candidate' ; Λ.history := Λ.history ++ [(P, G, K, V)]   -- candidate update + round record (track)

── LOOP ──
After Phase 3: evaluate user move.
If V = Confirm: crystallize(candidate), Λ.completion_trace := derive(Λ.history, Λ.A, candidate'), Λ.open_trace := derive(K.open, V, free_response), declare(Λ.completion_trace, Λ.open_trace), terminate.
If V = Widen(direction): return to Phase 2.
If V = Narrow(specializer): return to Phase 2.
If V = Fuse(adjacent): return to Phase 1 (grounding recomputed).
If V = Reorient(axis): return to Phase 1 (full recompute).
If V = Dismiss: abandon candidate; if essence still sensed, return to Phase 1 with fresh candidate; else deactivate.
Cap: max_attempts = 5 triangulation attempts per abstraction seed.
Continue until: crystallized(Λ) ∨ attempts_exhausted(Λ).
Convergence evidence: At crystallized(Λ), present transformation trace — for each step ∈ history, show (calibration → candidate → user_move → candidate') — plus OpenTrace for K.open. OpenTrace status is None when K.open is empty, Deferred when any open item is routed to later work, and Nonblocking otherwise. Convergence is demonstrated, not asserted.

── CONVERGENCE ──
crystallized(Λ): see TYPES (V = Confirm in Λ.history)
progress(Λ) = |Λ.history| / max_attempts                    -- both terms per TYPES; LOOP fixes the max_attempts value
early_exit = attempts_exhausted(Λ)

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Detect     (sense)   → Internal analysis (no external tool)
Phase 1 Calibrate+Propose (observe) → artifact read, artifact search (user's domain context for personalized grounding); external fetch (conditional: cross-domain adjacent abstractions)
Phase 2 Qs         (constitution)    → present calibration map + candidate + grounding (mandatory)
Phase 3            (track)   → Internal state update
converge           (extension)   → TextPresent+Proceed (convergence evidence trace + open disposition; proceed with crystallized abstraction)
seam               (extension)   → TextPresent+Proceed (fires at deactivation/handoff: a user-declared chain naming the next protocol settles the next move — proceed directly to it, citing that settling source. This protocol declares no wired outbound continuation edge: its only cross-protocol link is an inbound misfit absorption (`Upstream misfit absorption`), not a post-crystallization handoff, so the second trigger is vacuously absent. Every Constitution gate inside this protocol and inside the next protocol fires unchanged)

── MODE STATE ──
Λ = { phase: Phase, A: AbstractionSeed, Iᵢ: Set(Instance), E: EssenceIntuition,
      calibration: Option(K), candidate: Option(P), grounding: Option(G),
      history: List<(P, G, K, V)>, crystallized: Option(P),
      completion_trace: Option(CompletionTrace),
      open_trace: Option(OpenTrace),
      active: Bool, cause_tag: String }

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
```

## Mode Activation

`/induce` remains directly invocable. AI-guided activation requires a sensed essence whose name, scope, or position is still unsettled; detection stays silent. Existing abstractions awaiting comparison or validation route elsewhere, and a crystallized or dismissed `(instance set, essence)` pair stays inactive for the session.

If an explicit invocation has no detectable essence signal, surface that scan result and invite the user to name what feels in process or withdraw. Prior-session recall may seed neighboring abstractions but never settles crystallization.

## Protocol

### User-facing realization

At Phase 2, render `K` as Keeps / Sharpens / Prunes / Open, then present the candidate, instance map, personalized grounding, surfaced neighbors, and remaining refinement budget in prose. Ground the example in the user's actual domain by artifact read/search; when that domain requires external fetch, cite its URL at the point of use.

Materialize the `V` constructors as everyday-language options with anticipatable differential futures. Omit Fuse when no adjacent candidate surfaced, while keeping free response available for user-supplied fusion, calibration correction, or an unlisted shape. Confirm and Dismiss remain constitutive even when analysis favors one shaping trajectory.

Frame the abstraction currently being shaped rather than a progress fraction. Read `references/round-composition.md` before composing when terminology must remain stable, wording must be carried unchanged, material belongs to another round or trace, or phase order determines placement relative to the gate.

## Rules

- **Recognition over Recall**: Present structured options with anticipatable post-selection states and yield for the user's shaping move.
- **Calibration authority**: Treat the candidate as a working hypothesis. The instance-grounded calibration remains open to correction through the same free-response path as candidate shaping.
- **Label as ground, not verdict**: Read the user's tentative label as the naming ground the proposal works from. It grounds the candidate's name and its provenance without fixing either, so what the label survives as stays a judgment made in the run.
- **Personalized grounding**: Pair every candidate with evidence from the user's own domain and keep external provenance visible.
- **Periagoge boundary**: Form an abstraction around a sensed but unlocated essence. Comparison or validation of an already located abstraction remains outside this operation.
- **Round composition**: Compose each round in everyday language, keep each judgment beside its evidence and next-move implication, and place analysis before the gate.
- **Upstream misfit absorption**: Accept a routed colimit-shaped signal as activation ground and show its cited essence-and-locator basis before Phase 1.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change the form directly. Elements fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
