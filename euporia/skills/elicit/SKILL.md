---
name: elicit
description: "Reverse-trace decision coordinates for axis-undetermined intent. Type: (AbstractAporia, Hybrid, REVERSE-INDUCE-CYCLE, IntentSeed × ExternalizedSubstrate) → ResolvedEndpoint"
---

# Euporia Protocol

Resolve abstract aporia through Extended-Mind reverse induction. Type: `(AbstractAporia, Hybrid, REVERSE-INDUCE-CYCLE, IntentSeed × ExternalizedSubstrate) → ResolvedEndpoint`.

## Definition

**Euporia** (εὐπορία): A dialogical act of opening a way through abstract aporia, where AI reverse-traces decision coordinates from the user's externalized cognitive substrate (codebase, rules, past sessions, user environment), surfaces them as cycle-emergent dimension projections, and shapes the converging intent through user answers until the endpoint resolves.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written.
Every `opaque` declaration is a judgment that is yours to make from the material in front of
you; its doc comment says what you judge there, and nothing in this block decides it for you.
Every `def`, `inductive`, and `structure` is fixed by the contract. A `theorem` line inside a
doc comment states a consequence the contract already has; it is proved outside this block
and asks nothing further of you.
-/

/-! ── FLOW ──
Euporia(I) → Detect(I, S) → aporia with an external substrate signal? →
  true:  elicit(c, utterances), where c is the fused session context:
    cycle(c): Substrate access → ReverseTrace(c) → D[] → filter_confidence → (D_surfaced, deferred)
      → resurface(parked) → Qs(D_surfaced, parked, cycle_n) → Stop
    next utterance u: c' := fuse(c, u) → answer(c') →
      Resolved: ResolvedEndpoint(c')             (the user's resolution covers the values relayed)
      Dismiss: ResolvedEndpoint(c') with unresolved axes delegated in its residual
      Provide or Defer: cycle(c')                 (the re-trace reads the whole fused context)
    no utterance: the gate holds
  false: surface the scan result; route to an axis-specific protocol (axis-determined) or invite
    the user to articulate or withdraw (no external substrate signal)
-/

/-! ── MORPHISM ──
IntentSeed
  → detect(aporia, axis_undetermined)        -- verify abstract aporia exists
  → access(externalized_substrate)            -- read external substrate channels (codebase / rules / sessions / environment)
  → observe(utterance_ambiguity)              -- analyze the utterance for in-text semantic ambiguity (internal)
  → reverse_trace(coordinates)                -- over the fused context: the user's externalized decision coordinates
  → filter_confidence(D[]) → D_surfaced       -- concrete substrate basis surfaces; thin basis is held back
  → resurface(parked_coordinates)             -- deferred coordinates come back as themselves
  → surface(D_surfaced, parked, cycle_emergent)
  → fuse(answer)                              -- the answer joins the context; it adds determinations
  → resolve(intent)                           -- convergence when the user judges it resolved
  → ResolvedEndpoint
requires: aporia(I)                           -- runtime checkpoint (Phase 0); sole activation precondition
deficit:  AbstractAporia                      -- activation precondition (Layer 1/2)
preserves: utterance(I)                       -- the seed utterance is read-only; the context only grows
invariant: Reverse Induction over Axis-Fixed Extraction
invariant: Coordinate Monotonicity            -- an accepted coordinate is revised only by a person's utterance
-/

namespace Euporia

/-! ── GROUND ──
The session primitive this contract reads.
-/

inductive Origin | person | assistant | external | peer | injected | unknown
inductive Form | statement | observation | request | reasoning | summary | instruction
inductive Basis | utterance | testimony | observation | report
  deriving DecidableEq

structure Turn (P : Type) where
  origin  : Origin
  form    : Form
  content : P

abbrev Context (P : Type) := List (Turn P)

/-- What a turn may ground directly: eligibility, not truth or instruction priority. -/
def Turn.basis {P : Type} (e : Turn P) : Option Basis :=
  match e.origin, e.form with
  | .person, .statement     => some .utterance
  | .person, .observation   => some .testimony
  | .external, .observation => some .observation
  | .peer, .statement       => some .report
  | _, _                    => none

def Utterance (P : Type) := {e : Turn P // e.basis = some .utterance}
def Response (P : Type) := {e : Turn P // e.origin = .assistant}
def Evidence (P : Type) := {e : Turn P //
  e.basis = some .observation ∨ e.basis = some .report ∨ e.basis = some .testimony}

def fuse {P : Type} (c : Context P) (u : Utterance P) : Context P := c ++ [u.val]

structure Cite {P : Type} (c : Context P) where
  idx  : Nat
  lt   : idx < c.length
  kind : Basis
  ok   : (c[idx]'lt).basis = some kind

/-- `supports` is the model's reading. -/
structure Coord (P A : Type) where
  admits   : Basis → Prop
  supports : Context P → Turn P → A → Prop

/-- `open_` may carry a candidate citation whose support is still short. -/
inductive Occ {P A : Type} (q : Coord P A) (c : Context P)
  | open_  (candidate : Option (Cite c))
  | filled (a : A) (src : Cite c) (allowed : q.admits src.kind)
      (supported : q.supports c (c[src.idx]'src.lt) a)

/-!
theorem fuse_extends {P : Type} (c : Context P) (u : Utterance P) :
    ∃ t, fuse c u = c ++ t

theorem ai_never_grounds {P : Type} (e : Turn P) (h : e.origin = .assistant) :
    e.basis = none
-/

/-- The same turn, cited from a longer context; what it supports is judged again against the
    context that now stands. -/
def Cite.lift {P : Type} {c : Context P} (s : Cite c) (t : Context P) : Cite (c ++ t) :=
  { idx := s.idx
    lt := by have := s.lt; simp; omega
    kind := s.kind
    ok := by rw [List.getElem_append_left s.lt]; exact s.ok }

/-! ── TYPES ── -/

variable {P : Type}

/-- `I`: the user's intent seed. The seed utterance is a turn of the context and is never
    rewritten; `axis` is set when the seed already names one. -/
structure IntentSeed where
  utterance : String
  axis      : Option String

/-- The channels a coordinate's basis is read from. Codebase, Rules, Session, and Environment
    are the externalized substrate `S` — a read-only view of the user's externalized cognition;
    Environment is machine-setup metadata only (uname, pwd, tool versions, public git config
    fields). Utterance is the seed utterance itself: its citation quotes the actual fragment and
    attributes no unstated mental model. -/
inductive SubstrateChannel | codebase | rules | session | environment | utterance

structure SubstrateBasis where
  source  : SubstrateChannel
  content : String

abbrev Value := String

structure Coordinate where
  name     : String
  default  : Option Value
  question : String
  basis    : SubstrateBasis

/-- Cycle-emergent; no fixed taxonomy. -/
structure DimensionProjection where
  axisInferred : String
  coordinates  : List Coordinate

/-- **Your judgment**: the decision coordinates the user's externalized substrate implies for
    the intent, read from the whole fused context — the seed, every answer since, and what
    the substrate reads returned. -/
opaque reverseTrace : Context P → List DimensionProjection

/-- **Your judgment**: the projection's substrate basis is concrete enough to surface. -/
opaque concreteBasis : DimensionProjection → Bool

/-- `filter_confidence`; what is held back is tried again on a later re-trace. -/
def surfaced (c : Context P) : List DimensionProjection := (reverseTrace c).filter concreteBasis
def deferred (c : Context P) : List DimensionProjection :=
  (reverseTrace c).filter (fun d => !concreteBasis d)

/-- `A`, the reading of the user's latest utterance. Coordinate values and deferrals are read
    from every utterance in the context (`provided`, `parked`). -/
inductive Answer
  /-- values for surfaced or parked coordinates -/
  | provide (values : List (Coordinate × Value))
  /-- coordinates parked for a later cycle: ambiguous, partial, or not yet answerable -/
  | defer (coords : List Coordinate)
  /-- stop here, delegating the unresolved axes; on an AI-detected first surface, a decline -/
  | dismiss
  /-- the user judges the endpoint resolved; this utterance is the closing citation -/
  | resolved
  deriving Inhabited  -- elab: lets `answer` be declared `opaque`

/-- **Your judgment** on the latest utterance read with the context. -/
opaque answer : Context P → Answer

/-- **Your judgment**: the value this person's utterance gives coordinate `x`, read with the
    context before it; `none` when it gives none. -/
opaque provided : Context P → Turn P → Coordinate → Option Value

/-- The accepted value of `x`: the latest value a person's utterance gave it. -/
def acceptedAux (x : Coordinate) : Context P → Context P → Option Value → Option Value
  | _,   [],      acc => acc
  | pre, t :: ts, acc =>
    acceptedAux x (pre ++ [t]) ts
      (if t.basis = some .utterance then
        match provided pre t x with
        | some v => some v
        | none   => acc
      else acc)

def accepted (c : Context P) (x : Coordinate) : Option Value := acceptedAux x [] c none

/-- **Your judgment**: the coordinates the user deferred and has not since given a value
    (`Leftover`), each returning as itself — the same question with the same basis. -/
opaque parked : Context P → List Coordinate

def Leftover (c : Context P) : Prop := ∀ x ∈ parked c, accepted c x = none

/-- **Your judgment**: the axes still unresolved when the user dismisses. -/
opaque unresolvedAxes : Context P → List String

/-- **Your count**, read from the record: which cycle this is. -/
opaque cycleOf : Context P → Nat

inductive Initiator | userInvoked | aiDetected
  deriving Inhabited  -- elab: lets `initiatorOf` be declared `opaque`

/-- **Your reading** of how this activation began. On an AI-detected activation the first
    surface is an implicit confirm-or-decline. -/
opaque initiatorOf : Context P → Initiator

/-- None is reduced to a bare axis label. -/
inductive ResidualItem
  /-- an unresolved axis delegated downstream -/
  | axis (label : String)
  /-- a projection the confidence filter still held back -/
  | projection (d : DimensionProjection)
  /-- a coordinate the user deferred -/
  | coordinate (x : Coordinate)

/-- **Your judgment**: the intent as resolved — every coordinate with its accepted value, and
    every value relayed as the single dominant one, which the resolving utterance covers. -/
opaque resolvedIntent : Context P → List (Coordinate × Value)

structure ResolvedEndpoint (P : Type) where
  context  : Context P
  intent   : List (Coordinate × Value)
  residual : List ResidualItem

def residualAt (c : Context P) (dismissed : Bool) : List ResidualItem :=
  (deferred c).map .projection ++ (parked c).map .coordinate ++
    (if dismissed then (unresolvedAxes c).map .axis else [])

def endpoint (c : Context P) (dismissed : Bool) : ResolvedEndpoint P :=
  { context := c, intent := resolvedIntent c, residual := residualAt c dismissed }

inductive Outcome (P : Type)
  | resolved (r : ResolvedEndpoint P)
  | holding  (c : Context P)

/-- **Your judgments** at Phase 0: the intent's axis is undetermined; the signal comes from
    the external substrate — the utterance alone cannot activate. -/
opaque Aporia : Context P → Prop
opaque ExternalSignal : Context P → Prop

def activates (c : Context P) : Prop := Aporia c ∧ ExternalSignal c

/-! ── A-BINDING ──
bind(I) = explicit_arg ∪ recent_intent_seed ∪ surfaced_aporia
Priority: explicit_arg > recent_intent_seed > surfaced_aporia
  /elicit "intent"   → I = IntentSeed with that utterance
  /elicit (alone)    → I = the most recent intent seed in the session
  "I want to..."     → I = the utterance under discussion
When `activates` fails, Phase 0 surfaces the scan result instead of opening a cycle: a fully
axis-determined intent routes to the matching axis-specific protocol; with no external
substrate signal it invites the user to articulate further or withdraw.
-/

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
Each cycle is one step of a structural recursion over the user's utterances. The run starts
from the context in which Phase 0 found `activates` and the first cycle surfaced. After each
utterance that continues, `respond` is the next cycle's surface: `surfaced` and `parked`
beside the cycle count (`cycleOf`) and, from the second cycle, a one-sentence readback of the
intent. Where `initiatorOf` reads an AI-detected activation, the first surface is an implicit
confirm-or-decline, and a decline reads as `dismiss`.
-/

def elicit (respond : Context P → Response P) : Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let c' := fuse c u
    match answer c' with
    | .resolved => .resolved (endpoint c' false)
    | .dismiss  => .resolved (endpoint c' true)
    | _         => elicit respond (c' ++ [(respond c').val]) us

/-! ── LOOP ──
No fixed cycle cap. Convergence presentation, relayed at termination: (a) a plain one-sentence
readback of the resolved intent, in the user's language; (b) the per-cycle trace (surfaced →
answer → intent). The readback also appears in Phase 2 from the second cycle, as the
recognizable target a resolving answer points at; the trace is termination-only. Convergence
is demonstrated, not asserted.
-/

/-!
theorem acceptedAux_skip (x : Coordinate) (pre ts : Context P) (acc : Option Value)
    (h : ∀ t ∈ ts, t.basis ≠ some .utterance) :
    acceptedAux x pre ts acc = acc

theorem acceptedAux_append (x : Coordinate) (pre c e : Context P) (acc : Option Value) :
    acceptedAux x pre (c ++ e) acc = acceptedAux x (pre ++ c) e (acceptedAux x pre c acc)

Coordinate Monotonicity: turns that are not a person's utterance — a re-trace, a substrate
read, an AI response — leave every accepted value as it was.
theorem accepted_revised_only_by_utterance (c e : Context P) (x : Coordinate)
    (h : ∀ t ∈ e, t.basis ≠ some .utterance) : accepted (c ++ e) x = accepted c x

theorem silence (respond : Context P → Response P) (c : Context P) :
    elicit respond c [] = .holding c
-/

/-! ── CONVERGENCE ──
resolved(c) = the user's latest utterance judges the endpoint resolved; the residual is
`residualAt`.
-/

/-!
theorem resolved_here (respond : Context P → Response P) (c : Context P) (u : Utterance P)
    (us : List (Utterance P)) (h : answer (fuse c u) = .resolved) :
    elicit respond c (u :: us) = .resolved (endpoint (fuse c u) false)

Nothing parked is dropped at termination.
theorem parked_in_residual (c : Context P) (d : Bool) (x : Coordinate) (hx : x ∈ parked c) :
    ResidualItem.coordinate x ∈ residualAt c d

An endpoint always follows a person's utterance.
theorem endpoint_ends_in_utterance (respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (r : ResolvedEndpoint P) (h : elicit respond c us = .resolved r) :
    ∃ (c₀ : Context P) (u : Utterance P), r.context = fuse c₀ u
-/

/-! ── TOOL GROUNDING ── -/
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed

inductive Annot | sense | observe | track | transform | dispatch | constitution | extension

inductive Op | detect | scanSurface | substrate | utteranceRead | reverseTrace
             | filterConfidence | resurface | qs | readAnswer | converge | seam

def grounding : Op → Annot × String
  | .detect           => (.sense, "Internal analysis: axis-undetermined intent with an external substrate signal")
  | .scanSurface      => (.extension, "TextPresent+Proceed: when Phase 0 does not activate, the scan result with a routing recommendation, or an invitation to articulate or withdraw; no constitutive gate")
  | .substrate        => (.observe, "artifact read, artifact search, environment run: read-only substrate access — codebase, rules, session history, and machine-setup metadata only; the substrate is never mutated")
  | .utteranceRead    => (.sense, "Internal analysis of the seed utterance for in-text semantic ambiguity; citations quote actual fragments")
  | .reverseTrace     => (.sense, "Internal analysis: axis inference and coordinate construction over the fused context")
  | .filterConfidence => (.sense, "Internal analysis: concrete substrate basis surfaces, thin basis is held back; a relay grounded in whether a citable basis exists, never a user gate")
  | .resurface        => (.sense, "Internal analysis: each parked coordinate returns as itself, with the question and basis it was parked with")
  | .qs               => (.constitution, "present: this cycle's projections with their cited basis and defaults, the returning parked coordinates, the cycle count, and per-coordinate provide-or-defer slots beside Dismiss and Resolved")
  | .readAnswer       => (.sense, "Internal analysis: the handling the latest utterance carries and the values it gives")
  | .converge         => (.extension, "TextPresent+Proceed: intent readback and per-cycle coordinate trace; proceed with ResolvedEndpoint")
  | .seam             => (.extension, "TextPresent+Proceed: at a user-declared chain naming the next protocol, proceed directly to it citing that source; this protocol declares no wired outbound edge, and every Constitution gate fires unchanged")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Substrate channel resolution emergent via session context.
-/

end Euporia
```

## Scope Boundary

Euporia surfaces grounded decision coordinates without adjudicating which sibling protocol owns them. A coordinate that exposes a missing fact, undefined boundary, or unrecognizable direction remains a coordinate with its substrate basis; the user decides what to reach for next.

## Coordinate Monotonicity Invariant

An accepted coordinate is revised only by a person's utterance. An answer joins the context and adds determinations; a later re-trace, a substrate read, or an AI turn is not ground for revising a value the user gave. When the re-trace finds a contradiction with an accepted value, surface it as such and leave the value standing until the user's own words change it.

## Mode Activation

`/elicit` remains directly invocable. AI-guided activation requires an axis-undetermined intent backed by an external substrate signal from Codebase, Rules, Session, or Environment. Utterance evidence may ground a projection after activation, but cannot activate Euporia by itself.

On the AI-guided path, the immutable Phase 1 scan may precede confirmation; the first Phase 2 response confirms or declines the run. Skip AI-guided activation when the user explicitly asks to proceed without surfacing, or when the same utterance and substrate slice was resolved or dismissed in this session.

## Protocol

### Phase 2 surfacing format

At Phase 2, render the cycle counter and, from cycle 2 onward, a plain one-sentence readback of current `I'`. For each surfaced projection, show its inferred axis, coordinate questions, cited substrate basis, and any substrate-derived default. Mark each parked coordinate as returning in the same wording and with the same basis. Let the listed coordinates establish what is currently in play without a derived count or resolved/total tally, then present per-coordinate provide-or-defer slots, a way to say the intent is resolved as read back, and Dismiss-with-residual, and yield the turn. An answer beyond the slots — a value for an unlisted coordinate, a dimension the surface excluded, a changed framing — joins the context whole, and the next re-trace reads it.

Utterance evidence quotes the user's actual fragment; it does not attribute an unstated mental model. Only projections with concrete substrate basis reach the surface. Read `references/round-composition.md` before composing when a term must remain stable across the session, wording must travel unchanged, material belongs to another round or trace, or phase order determines whether text belongs before or inside the gate.

### Intensity

| Level | When | Format |
|-------|------|--------|
| Light | One grounded dimension | Brief surface and per-coordinate slots |
| Medium | Several dimensions or partial evidence | Full surface at coordinate granularity |
| Heavy | Multi-axis, weak-basis, multi-cycle prospect | Full surface with per-coordinate evidence and explicit residuals |

## Rules

- **Recognition over Recall**: Present structured dimension projections with anticipatable post-answer states.
- **Round composition**: Use everyday language, keep each judgment beside its nearest evidence and next-move implication, and place analytical context before the answer slots.
- **Option-set relay test**: Present a single dominant coordinate value as Extension; it becomes part of the resolved intent only through the user's resolving answer, which covers it. Keep the answer slot constitutive when different user value weightings sustain multiple values.
- **Parked-coordinate identity**: A deferred coordinate returns each cycle as the same question with the same basis, marked as returning; it stops being parked only through a value the user gives it or termination residual folding.
- **Re-trace over the whole context**: Each re-trace reads the fused context — the seed, every answer, and every substrate read — not a summary of the values provided, so a dimension the user named in their own words is traced like any other.
- **Form feedback**: Derive each round's density from the current request and carry an explicit form instruction until countermanded. Change the form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
