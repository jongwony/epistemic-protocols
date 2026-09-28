---
name: elicit
description: "The user knows roughly what they want but not which decisions it turns on: trace those from their own material — codebase, rules, past sessions — and ask until the intent settles."
---

# Euporia Protocol

Resolve abstract aporia by surfacing the decisions an intent turns on until the person recognizes the intent as theirs. Type: `(AbstractAporia, Hybrid, REVERSE-INDUCE-CYCLE, IntentSeed) → ResolvedEndpoint`.

## Definition

**Euporia** (εὐπορία): A dialogical act of opening a way through abstract aporia — the person holds a direction but cannot recall or name up front the decisions it turns on. The AI traces those decision coordinates from the person's own material, from their words, and from the decision structure of the domain the intent sits in, and surfaces each with where it comes from and what leaving it open changes. The person's answers, taken whole into the fused context, shape the intent until they recognize it as what they want; each value in it carries who proposed it and how it came to stand, and what is still open is carried as residual. The resolution establishes the person's recognized intent, not the factual correctness of its parts.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract.
-/

/-! ── FLOW ──
Euporia(I) → start(c) → elicit(c, utterances), where c is the fused session context:
  [aporia fails: every coordinate the intent turns on is already settled by the person's words
    or by reachable evidence] the report — what settles each — → NothingToElicit
  surface(c): the read-back of the intent, each value with who proposed it and how it stands;
    each open coordinate with where it comes from and what leaving it open changes; your
    contrary grounds → Stop
  next utterance u: c' := fuse(c, u), every reading below taken afresh on c' →
    [the person withdraws]                                   → Withdrawn
    [the person names where the run goes next]               → Routed
    [the utterance settles the intent, and nothing it would take is unseen (Covered)]
                                                             → ResolvedEndpoint
    [otherwise — values, deferrals, questions, a new frame, or something you would add unseen,
      which the next surface shows as that gap alone]         → surface(c')
  no utterance: the gate holds; nothing is taken
-/

/-! ── MORPHISM ──
IntentSeed
  → detect(aporia)       -- the intent turns on decisions the person has not named (silent analysis)
  → trace(coordinates)   -- over the fused context: the person's material, their words, and the domain's decision structure
  → surface              -- the read-back with each value's proposer and standing; each open coordinate with its source and what leaving it open changes; contrary grounds
  → fuse(answer)         -- the answer joins the context whole; it adds determinations
  → cover                -- every value you proposed was shown as yours before the answer that takes it
  → resolve(intent)      -- the person's utterance settles the intent
  → ResolvedEndpoint
requires: aporia(I)                           -- runtime checkpoint (Phase 0); sole activation precondition
deficit:  AbstractAporia                      -- activation precondition (Layer 1/2)
preserves: utterance(I)                       -- the seed utterance is read-only; the context only grows
invariant: Reverse Induction over Axis-Fixed Extraction  -- coordinates emerge from the intent and its material; no fixed axis taxonomy
invariant: Coordinate Provenance              -- a value stands as the person's only where their turn set it; a value you proposed stands only where their answer took it shown as yours
invariant: Revision by Utterance              -- a value the person gave changes only by their words; evidence against it is shown, never substituted
-/

namespace Euporia

/-! ── GROUND ──
The session primitive this contract reads.
-/

inductive Origin | person | assistant | external | peer | injected | unknown
  deriving DecidableEq

/-- A turn is who sent it and what it says. What the turn does — a statement, a request, an
    instruction, a report of what was observed — is read from its content, never stored here. -/
structure Turn (P : Type) where
  origin  : Origin
  content : P

abbrev Context (P : Type) := List (Turn P)

/-- An origin that may ground: the harness says who sent a turn, and that is all this admits on.
    The assistant's own turns, injected text, and turns of unknown origin ground nothing. -/
def Grounding := {o : Origin // o ≠ .assistant ∧ o ≠ .injected ∧ o ≠ .unknown}

/-- Any turn a person sent, whatever it does. -/
def Utterance (P : Type) := {e : Turn P // e.origin = .person}
def Response (P : Type) := {e : Turn P // e.origin = .assistant}
/-- A turn from outside the conversation: what a tool or the environment returned, or a peer's
    report. A person's account of what they observed is an utterance, read as such. -/
def Evidence (P : Type) := {e : Turn P // e.origin = .external ∨ e.origin = .peer}

def fuse {P : Type} (c : Context P) (u : Utterance P) : Context P := c ++ [u.val]

/-- One turn of the context, with the origin it grounds on. -/
structure Cite {P : Type} (c : Context P) where
  idx : Nat
  lt  : idx < c.length
  src : Grounding
  ok  : (c[idx]'lt).origin = src.val

/-- `admits` reads only who sent the cited turn; `supports` is the model's reading of what that
    turn says, including what it does — a statement, a request, a report of an observation. -/
structure Coord (P A : Type) where
  admits   : Grounding → Prop
  supports : Context P → Turn P → A → Prop

/-- `open_` may carry a candidate citation whose support is still short. -/
inductive Occ {P A : Type} (q : Coord P A) (c : Context P)
  | open_  (candidate : Option (Cite c))
  | filled (a : A) (src : Cite c) (allowed : q.admits src.src)
      (supported : q.supports c (c[src.idx]'src.lt) a)

/-- The same turn, cited from a longer context; what it supports is judged again against the
    context that now stands. -/
def Cite.lift {P : Type} {c : Context P} (s : Cite c) (t : Context P) : Cite (c ++ t) :=
  { idx := s.idx
    lt := by have := s.lt; simp; omega
    src := s.src
    ok := by rw [List.getElem_append_left s.lt]; exact s.ok }

/-! ── TYPES ── -/

noncomputable section

variable {P : Type}

/-- `I`, the intent seed: the utterance that carries the intent and the context it lands in. The
    seed is a turn of the context and is never rewritten. Source-neutral; read from the context. -/
abbrev IntentSeed (P : Type) := Context P

/-- **Your judgment** at Phase 0: the intent turns on a decision the person has not named — a
    coordinate their material, their words, or the decision structure of the domain the intent
    sits in raises is still open. Where every such coordinate is already settled by the person's
    words or by reachable evidence, there is nothing to elicit. -/
axiom aporia : Context P → Prop

/-- A coordinate, a value, a rejected alternative, or a reason, named as the presentation shows
    it. -/
abbrev Entry := String

/-- **Your judgment**: the coordinates the intent turns on, read over the whole fused context —
    the seed, every answer since, what reads of the person's material returned, and the decision
    structure of the domain the intent sits in. Guidance for the reading, not steps it must take:
    read the person's material where the intent turns on it, and not from scratch each round; a
    coordinate the domain raises is yours to propose — show it as yours, as an open question
    rather than one filled with an example, after the ones the person's material and words raise;
    a coordinate whose basis is still thin can wait for a later round; a coordinate the person
    deferred returns in the same wording with the same basis. The person may add, merge, reword,
    or reject any coordinate, the axis itself included. -/
axiom coordinates : Context P → List Entry

/-- **Your judgment**: the cited turn gives coordinate `x` the value `v`, read against the context
    as it now stands, on the scope the turn's words reach. A value that turns on the person's
    preference, value, or trade-off is supported only by the person's turn; evidence supports
    only what it fixes; a grant the person gave supports your choice within its scope. A
    question, a request to look something up, an observation, or a deferral gives no value to
    the coordinate it mentions. -/
axiom ValueSupported : Entry → Context P → Turn P → Entry → Prop

/-- A coordinate is filled by a turn that may ground — the person's, or evidence — never by yours. -/
def valueCoord (x : Entry) : Coord P Entry :=
  { admits := fun _ => True, supports := ValueSupported x }

/-- **Your reading**: how coordinate `x` stands in `c` — filled by the latest turn that settles
    it; open where nothing settles it, carrying as candidate a value proposed but not yet taken. -/
axiom operative : (c : Context P) → (x : Entry) → Occ (valueCoord (P := P) x) c

def isFilled {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Bool
  | .open_ _   => false
  | .filled .. => true

def filledValue {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Option A
  | .open_ _     => none
  | .filled a .. => some a

/-- What is still open when the run closes: every coordinate nothing settles, whether it was
    deferred, left unanswered, or never reached. None closes by default. -/
def residual (c : Context P) : List Entry :=
  (coordinates c).filter (fun x => !isFilled (operative c x))

/-- **Your reading**: the values the intent holds as the context now stands — each coordinate
    with its value, and every rejected alternative and every reason recorded with the intent. -/
axiom entries : Context P → List Entry

/-- Who first put a value forward. Kept apart from how it came to stand. -/
inductive Proposer | draft | person

/-- **Your reading**: the position of the turn that first put forward what `e` holds now. The
    person's words carried over in other words were put forward by you. -/
axiom introducedAt : Context P → Entry → Nat

def proposer (c : Context P) (e : Entry) : Proposer :=
  match c[introducedAt c e]? with
  | some ⟨.person, _⟩ => .person
  | _                 => .draft

/-- How a value came to stand: the person's words set it, their answer adopted yours, or a grant
    they gave covers your choice. -/
inductive Standing | set | adopted | granted

/-- **Your reading**: `e` is a choice you made within a grant the person gave, on the scope the
    grant's words reach. -/
axiom withinGrant : Context P → Entry → Bool

/-- A value you proposed never stands as set by the person. -/
def standing (c : Context P) (e : Entry) : Standing :=
  match proposer c e with
  | .person => .set
  | .draft  => if withinGrant c e then .granted else .adopted

structure Provenance where
  entry    : Entry
  proposer : Proposer
  standing : Standing

def provenance (c : Context P) : List Provenance :=
  (entries c).map (fun e => ⟨e, proposer c e, standing c e⟩)

/-- **Your judgment**: the cited turn settles the intent — it answers what was still open, or says
    the intent is as read back — read against the context as it now stands. The last answer to
    an open coordinate can do this: no separate confirmation is owed. A question, a request to
    look something up, a new frame, or a deferral leaves it unsettled. -/
axiom ResolutionSupported : Context P → Turn P → Unit → Prop

/-- Only the person settles the intent. -/
def resolutionCoord : Coord P Unit :=
  { admits := (·.val = .person), supports := ResolutionSupported }

/-- **Your reading**: the person's resolution; `open_` until one reaches it. -/
axiom resolution : (c : Context P) → Occ (resolutionCoord (P := P)) c

/-- **Your judgment**, the adoption condition: every value the intent would hold that you proposed
    — a default, a value from the domain's practice, a value relayed from evidence, a merge of
    coordinates, a rejected alternative or a reason the person did not state, a question read as
    a decision, the person's words carried over in other words — was shown as yours, with what
    decides it and your contrary grounds, before the person's answer that takes it; and nothing is
    added after that answer. A value the person's own answer states counts as it was said. A
    choice within a grant needs the grant to reach it. Where anything would be taken unseen, the
    next surface shows that gap alone. -/
axiom Covered : Context P → Prop

/-- **Your record**: the contrary grounds you presented before the answer that closes — a value
    you doubt, a premise that may not hold, a sibling deficit you read — attached to the closure;
    empty when there were none. -/
axiom dissent : Context P → List String

/-- How the person ends the run without resolving it. -/
inductive Closing
  /-- stop here; nothing open is delegated -/
  | withdraw
  /-- go on to what the person names -/
  | route (target : String)

/-- **Your judgment**: the cited turn closes the run this way, read against the context as it now
    stands. Your own reading that the run should end, or go elsewhere, closes nothing: it is
    stated with its basis before the gate, and the person's answer closes. -/
axiom ClosingSupported : Context P → Turn P → Closing → Prop

/-- Only the person closes. -/
def closeCoord : Coord P Closing :=
  { admits := (·.val = .person), supports := ClosingSupported }

/-- **Your reading**: the person's closing; `open_` until one reaches it. -/
axiom closing : (c : Context P) → Occ (closeCoord (P := P)) c

/-- The record every exit carries: the context, the values with who proposed each and how it came
    to stand, what is still open, and the dissent attached to the closure. -/
structure Closed (P : Type) where
  context    : Context P
  provenance : List Provenance
  residual   : List Entry
  dissent    : List String

def closed (c : Context P) : Closed P :=
  { context := c, provenance := provenance c, residual := residual c, dissent := dissent c }

/-- `ResolvedEndpoint`: the intent the person recognized, as the record of the resolving turn. -/
structure ResolvedEndpoint (P : Type) where
  record : Closed P

def endpoint (c : Context P) : ResolvedEndpoint P := { record := closed c }

inductive Outcome (P : Type)
  /-- `NothingToElicit`: what settles each coordinate, reported; nothing surfaced -/
  | nothingToElicit (c : Context P)
  | resolved  (r : ResolvedEndpoint P)
  /-- the partial record; what is open stays open -/
  | withdrawn (r : Closed P)
  /-- the person named where the run goes next; that is the session's to take up -/
  | routed    (target : String) (r : Closed P)
  | holding   (c : Context P)

/-! ── A-BINDING ──
bind(I) = explicit_arg ∪ recent_intent_seed ∪ surfaced_aporia
Priority: explicit_arg > recent_intent_seed > surfaced_aporia
  /elicit "intent"   → I = the utterance, with the context it lands in
  /elicit (alone)    → I = the most recent intent seed in the session
  "I want to..."     → I = the utterance under discussion (AI-detected path: the first surface
                       confirms or declines the run; a decline is a withdrawal)
-/

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

/-! ── PHASE TRANSITIONS ──
A step is one arm of a structural recursion over the person's utterances. `respond` is the next
surface: the read-back with each value's proposer and standing, each open coordinate with where
it comes from and what leaving it open changes, the gap alone where closing would take something
unseen, and your contrary grounds; `report` is the nothing-to-elicit relay.
-/

open Classical in
def elicit (respond : Context P → Response P) : Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let c' := fuse c u
    match filledValue (closing c') with
    | some .withdraw  => .withdrawn (closed c')
    | some (.route t) => .routed t (closed c')
    | none =>
      if isFilled (resolution c') = true ∧ Covered c' then .resolved (endpoint c')
      else elicit respond (c' ++ [(respond c').val]) us

open Classical in
def start (report respond : Context P → Response P) (c : Context P) (us : List (Utterance P)) :
    Outcome P :=
  if ¬ aporia c then .nothingToElicit (c ++ [(report c).val])
  else elicit respond (c ++ [(respond c).val]) us

/-! ── LOOP ──
Every answer is read against the whole context as it now stands: nothing counts rounds, and no
earlier answer is held apart from what later ones say. A value the person gave stands on the scope
their words reach, and changes only by their words; evidence that breaks it is shown, and shown
before a dependent step that cannot be undone, never substituted. No fixed cap: each surface is
dialogue, and the person can withdraw or route at any gate. After the resolution, where the
person's request declared what follows, it proceeds without another turn.
-/

/-! ── CONVERGENCE ──
converged: a ResolvedEndpoint the person's utterance settled, with everything it takes in view
(`Covered`). Every other exit keeps its partial record. Convergence evidence: at the resolution,
present the read-back of the intent in the person's language and the trace — each coordinate →
where it came from → its value → who proposed it and how it came to stand — beside the residual
and the dissent attached to the closure. At NothingToElicit, show what settles each coordinate.
Demonstrated, not asserted.
-/

/-! ── TOOL GROUNDING ──
What each operation of this contract does. An interaction with the person is one of two kinds,
and its kind fixes how it continues once its text is presented.
-/

inductive Interaction | constitution | extension

inductive Continuation | stop | proceed

inductive Annot | sense | observe | track | transform | dispatch | interaction (kind : Interaction)

/-- Every interaction presents its text; a Constitution then stops for the person's turn, and an
    Extension proceeds. -/
def Interaction.realization : Interaction → Continuation
  | .constitution => .stop
  | .extension    => .proceed

inductive Op | detect | nothingRelay | read | trace | surface | readAnswer | converge | withdraw
             | routeRelay | seam

def grounding : Op → Annot × String
  | .detect       => (.sense, "Internal analysis: whether the intent turns on a decision the person has not named, read from the utterance, their material, and the domain's decision structure")
  | .nothingRelay => (.interaction .extension, "when every coordinate the intent turns on is already settled — what settles each, by the person's words or by evidence; a routing mention is a proposal; nothing is surfaced, and what follows is the session's")
  | .read         => (.observe, "artifact read, artifact search, record read: read-only reads of the person's material where the intent turns on it — their code, their rules, earlier sessions and decisions")
  | .trace        => (.sense, "Internal analysis: the coordinates the intent turns on, over the whole fused context and the domain's decision structure, each with where it comes from and what leaving it open changes")
  | .surface      => (.interaction .constitution, "the read-back of the intent with each value marked by who proposed it and how it stands; each open coordinate with its source — the person's material cited, their words quoted, or the domain's structure marked as yours — what leaving it open changes, and any default as your proposal; a deferred coordinate returning as itself; your contrary grounds; where closing would take something you added, that gap alone. The answer may give values, defer, say the intent is resolved as read back, withdraw, or name a route, in any form")
  | .readAnswer   => (.sense, "Internal analysis: the latest utterance, and every earlier turn of the person's it bears on, read whole against the fused context as it now stands — the values it gives, a resolution, a closing — whatever form it takes")
  | .converge     => (.interaction .extension, "the read-back of the resolved intent and the trace — each coordinate, where it came from, its value, who proposed it and how it came to stand — with the residual and the dissent attached to the closure; proceed with ResolvedEndpoint")
  | .withdraw     => (.interaction .extension, "explicit exit at any gate: the partial record declared — the values so far with their provenance, and what is still open; nothing open is delegated")
  | .routeRelay   => (.interaction .extension, "when the person names where the run goes next: relay the record so far with that target; taking it up is the session's")
  | .seam         => (.interaction .extension, "at a chain the person's request declared — the task the seed asked for, or a next protocol named — proceed to it citing that source once the intent is resolved; this protocol declares no wired outbound edge, and every Constitution gate fires unchanged")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Intent resolution emergent via session context.
-/

end

end Euporia
```

## Scope Boundary

Euporia surfaces the decision coordinates an intent turns on without adjudicating which sibling protocol owns them. A coordinate that exposes a missing fact, an undefined boundary, or an unrecognizable direction remains a coordinate with its basis; a fact claim you add from the domain's practice is shown as your unverified judgment. The user decides what to reach for next.

## Revision by Utterance

A value the user gave is changed only by their own words. An answer joins the context and adds determinations; a later trace, a read of their material, or a turn of yours is not ground for changing it. When you find evidence that breaks it, show that evidence and leave the value standing until the user's words change it — and show it before any step that depends on the value and cannot be undone.

## Mode Activation

`/elicit` remains directly invocable. AI-guided activation requires an intent that turns on decisions the user has not named, read from the utterance, their material, or the decision structure of the domain the intent sits in. On the AI-guided path the first surface confirms or declines the run; a decline is a withdrawal. Skip AI-guided activation when the user explicitly asks to proceed without surfacing, or when the same utterance was resolved or withdrawn in this session.

Where every coordinate is already settled by the user's words or by reachable evidence, report what settles each and end without surfacing; what follows is the session's.

## Protocol

### Phase 2 surfacing format

At Phase 2, render in every round, the first included, a plain one-sentence read-back of the current intent, with each value marked by who proposed it: the user's own words, or yours with its basis — relayed from evidence, a default, the domain's practice, a choice within a grant they gave. For each open coordinate, show the question, where it comes from — their material cited, their words quoted, or the domain's decision structure marked as yours — what leaving it open changes, and any default as your proposal. Coordinates the domain raises come after the ones their material and words raise, as open questions rather than filled examples. Mark each deferred coordinate as returning in the same wording and with the same basis. Show your contrary grounds before the answer slots. Then present per-coordinate provide-or-defer slots, a way to say the intent is resolved as read back, and a way to withdraw, and yield the turn. An answer beyond the slots — a value for an unlisted coordinate, a coordinate the surface did not raise, a rejected axis, a changed framing — joins the context whole, and the next trace reads it.

The answer that settles the intent resolves it when nothing it would take is unseen; add no separate confirmation. Where closing would take something you added — a default for an unanswered coordinate, a merge of coordinates, a rejected alternative or a reason the user did not state, a question read as a decision, their words carried in other words — surface that gap alone first. A coordinate left open at the close goes to the residual as open; none closes by default and none is delegated without a grant.

Utterance evidence quotes the user's actual fragment; it does not attribute an unstated mental model. Read `references/round-composition.md` before composing when a term must remain stable across the session, wording must travel unchanged, material belongs to another round or trace, or phase order determines whether text belongs before or inside the gate.

### Intensity

| Level | When | Format |
|-------|------|--------|
| Light | One open coordinate | Brief surface and per-coordinate slots |
| Medium | Several coordinates or partial evidence | Full surface at coordinate granularity |
| Heavy | Many coordinates, weak basis, several rounds in prospect | Full surface with per-coordinate evidence and explicit residuals |

## Rules

- **Recognition over Recall**: Present the coordinates an intent turns on with their anticipatable post-answer states, so the user recognizes what they would otherwise have to recall.
- **Round composition**: Use everyday language, keep each judgment beside its nearest evidence and next-move implication, and place analytical context before the answer slots.
- **Coverage before closure**: Present a single dominant coordinate value as your proposal with its basis; it enters the resolved intent only through the user's answer taken with it shown as yours. Keep the answer slot constitutive when different user value weightings sustain multiple values. A resolution with everything in view needs no further turn; where the user's request declared what follows, proceed to it.
- **Provenance**: Record for each value who proposed it and whether the user's words set it, their answer adopted yours, or a grant they gave covers your choice. A rejected alternative or a reason stands as the user's only where their words state it; the user's words carried over in other words are your proposal. Where the user closes with a contrary ground of yours standing, attach it to the closure record.
- **Parked-coordinate identity**: A deferred coordinate returns each round as the same question with the same basis, marked as returning; it stops being open only through a value the user gives it, and at the close it is residual.
- **Trace over the whole context**: Each trace reads the fused context — the seed, every answer, and every read of the user's material — and the decision structure of the domain, not a summary of the values given, so a coordinate the user named in their own words is traced like any other.
- **Form feedback**: Derive each round's density from the current request and carry an explicit form instruction until countermanded. Change the form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
