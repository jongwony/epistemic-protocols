---
name: route
description: "The user meets the deficit their context shows as the protocol that resolves it and sees why, without recalling which exist — /route invokes what plain fits compose into, else points or stays silent."
---

# Route Skill

Route the accumulated session context to the core epistemic protocol whose deficit it shows, and bring that protocol in. Type: `(DeficitUnrouted, AI, ROUTE, AccumulatedContext) → ProtocolInvocation`.

## Definition

**Route**: An act of bringing a present deficit to the protocol that resolves it, so that the person meets that protocol without recalling which protocols exist or which one fits. At a recognition point — the prompt, or a moment in the turn where preparing a response or action shows a deficit — Route reads the loaded core protocols' own descriptions against the context as it stands and yields the one outcome `route` gives: an invocation with Route's reading shown, pointer lines, or silence. How the fits compose — with each other and with the work underway, another protocol's checkpoint that still holds the person's judgment included — is Route's judgment, shown in its reading before the call: one protocol comes in, the fits beside it are shown with how they follow or stand beside it, the checkpoint stays the person's, and the run it belongs to goes on with what the invoked protocol leaves. Route closes nothing: each protocol's own gates hold the person's judgment, and a pointer is taken up, if at all, in the person's next turn. The judgment is made in the turn itself, against the descriptions and the judgment text the session start delivers from this contract; `/route` is also a command the person may type, and nothing invokes it on its own. Where a pass belongs, and what receiving a delegated agent's report asks, `route` states.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract.
-/

/-! ── FLOW ──
Route(C) → routeAt(C) = route(catalog C, C), one judgment at the recognition point C:
  [a protocol is to come in now]                Route's reading shown, the fits beside it
                                                included → invoke that protocol
  [otherwise, where a pointer gives the person something]
                                                one pointer line per such fit
  [otherwise]                                   silence
One pass; no loop and no state. A checkpoint that still holds the person's judgment, and fits
for other protocols beside the one brought in, are no branches of their own: they are read
inside `route`.
-/

/-! ── MORPHISM ──
AccumulatedContext
  → read(catalog)               -- the loaded core protocols, each with its own declared description; this skill absent
  → match(fits)                 -- every surviving fit, one line per deficit and protocol, each resting on turns it cites
  → read(occasion)              -- `route`: the one outcome, read from the fits and the work underway
  → emit(ProtocolInvocation)    -- invoke one protocol with Route's reading shown, point, or silence
  → ProtocolInvocation
requires: a recognition point — the prompt, or a deficit recognized mid-turn
deficit:  DeficitUnrouted       -- the context shows a present deficit instance that no protocol in it serves
preserves: the context          -- read, never rewritten
invariant: Routing over Doing
-/

namespace Route

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

/-- `C`: the session at the recognition point where the routing judgment is made — the prompt, or a
    moment in the turn where preparing a response or action shows a deficit — with what the turn has recognized
    so far, read after any protocol whose checkpoint stood at the last prompt has read that prompt
    by its own contract. Route reads it and writes nothing into it. -/
abbrev AccumulatedContext (P : Type) := Context P

/-- One loaded core protocol as the session shows it: its skill identifier and its own declared
    description, the sole source of the deficit it resolves. -/
structure Entry where
  skill       : String
  description : String

/-- The candidates: `entries`, the loaded core protocols, each skill once, and `self`, this skill's
    own entry, whose skill no entry names. -/
structure Catalog where
  entries  : List Entry
  self     : Entry
  excludes : ∀ e ∈ entries, e.skill ≠ self.skill
  distinct : (entries.map (·.skill)).Nodup

/-- **Your reading** of the session: the core protocols it can invoke, each with its own declared
    description, read as an observation from the table the session start delivers or, where the
    session shows a protocol's identifier alone, from where the protocol states it; a description
    that can be read is read, never left out for being unread. A protocol the session cannot invoke,
    whatever a table lists, a candidate whose description cannot be resolved from either, a utility
    skill, and this skill are absent. Route reads no curated routing table and no session store. -/
axiom catalog : Context P → Catalog

/-- **Your reading** of a description: the end it declares — what the person can say or recognize
    once that protocol has run — or `none` where it declares none. -/
axiom declaredEnd : Entry → Option String

/-- **Your judgment**: the context, as it now stands, shows this present deficit instance —
    `reading` is your statement of it — and it is the situation the entry's description names, read
    against the object it concerns and the ground that can settle it, resting on the cited turns
    `grounds`: the next move of the work rests on ground not yet established, and the entry's
    declared end names what the person must then be able to recognize or settle about it. The fit
    is judged by what the resolution leaves the person: that you could establish the ground yourself
    does not defeat it, and having to read something does not by itself leave ground
    unestablished. What a request leaves unwritten is evidence of a deficit, not of its absence: the
    shorter the request against the work it opens, the more of what that work turns on is left for a
    protocol to surface, and only where the prompt or the accumulated context already carries it is
    none left. That the result would look alike with or without the protocol does not defeat the
    fit either; the difference is whether the person can recognize what was settled and from where.
    No protocol present in the context serves it: a protocol still running in the
    context serves the deficit instance it was brought in for and what its own contract takes up
    from the turns since, and not every deficit that comes up while it runs; one a next move the
    person declared is bringing in serves the instance that move names; an invocation that has
    ended without settling it is not service, and a protocol's text in context is not service. A
    proposed question, assumption, or repair is pending work on the deficit and does not supply its
    result. A deficit already recognized stays a fit until current evidence settles it or defeats
    it; where settling it needs the person's determination, evidence that is not the person's may
    defeat the fit and supplies nothing in its place, and it is read apart from the action the
    latest utterance requests. An end a description states defeats a fit only on current evidence
    that it is incompatible with what the context seeks, and an end a description does not state
    defeats nothing. -/
axiom FitSupported : (c : Context P) → Entry → String → List (Cite c) → Prop

/-- One fit: a catalog entry, Route's reading of the present deficit instance it resolves, and
    the turns that reading rests on — one at least. -/
structure Line (k : Catalog) (c : Context P) where
  entry    : Entry
  mem      : entry ∈ k.entries
  reading  : String
  grounds  : List (Cite c)
  grounded : grounds ≠ []
  fit      : FitSupported c entry reading grounds

/-- The end a line shows: its entry's declared end, and none where the description declares
    none. -/
def Line.ending {k : Catalog} {c : Context P} (l : Line k c) : Option String :=
  declaredEnd l.entry

/-- **Your reading**: every fit `FitSupported` admits on the context as it now stands, one line per
    deficit and protocol, not ranked or scored into a winner. A fit the person already turned away
    stays in this reading; whether it is brought up again, and how it stands against another fit,
    is read in `route`. -/
axiom fits : (k : Catalog) → (c : Context P) → List (Line k c)

/-- After a pass, the person meets the deficit the context shows as the protocol that resolves
    it, without recalling which protocols exist or which one fits, and can see why that protocol
    is brought in: a protocol whose fit is plain arrives with Route's reading shown, composed with
    the fits beside it and the work underway; otherwise each fit whose pointer adds something
    comes as one pointer line,
    with what in the context it rests on and the end its description declares; a checkpoint that
    holds the person's judgment stays theirs; where nothing is to be raised, nothing interrupts.
    What one pass of Route yields; no outcome carries a value of the person's. -/
inductive ProtocolInvocation (k : Catalog) (c : Context P)
  /-- one protocol, invoked with Route's reading of each deficit it is brought in for — `lines`,
      every one naming it — handed over as Route's; `beside`, the other fits raised with it, for
      other protocols, shown in that reading with how each stands to it -/
  | invoke (entry : Entry) (lines : List (Line k c)) (nonempty : lines ≠ [])
      (names : ∀ l ∈ lines, l.entry = entry) (beside : List (Line k c))
  /-- one pointer line per fit whose pointer adds something -/
  | point (lines : List (Line k c)) (nonempty : lines ≠ [])
  | silence

/-- The protocol a pass invokes: the one an invocation names; a pointer and silence invoke
    nothing. -/
def invokedBy {k : Catalog} {c : Context P} : ProtocolInvocation k c → Option Entry
  | .invoke e .. => some e
  | _            => none

/-! ── MODE STATE ──
Λ is the accumulated context, read at each recognition point; every reading above is taken from
it. No stack of protocols, resumption point, or record of earlier pointers is kept beside it.
-/

abbrev Mode (P : Type) := AccumulatedContext P

/-! ── PHASE TRANSITIONS ──
The catalog is read at the recognition point [Tool]; `fits` is read from the context; `route`
judges the one outcome; an invocation hands off through `.invoke` [Tool].
-/

/-- **Your judgment**: the one outcome of a pass at this recognition point — an invocation, pointer
    lines, or silence — read from the fits `fits` admits and from the work underway; every line it
    carries is one of those fits. What the person has said about routing, in their turns or in
    standing instructions of theirs the session carries, narrows it or withholds it, and a fit they
    turned away is not raised again, by an invocation or a pointer, with nothing new since. A
    checkpoint that still holds the person's judgment, by its own contract's reading of what they
    have said since it was presented, stays theirs, answered only by their own turn under its own
    contract; it does not stand against bringing a protocol in by being there, and neither Route
    nor what the invoked protocol leaves answers or closes it. The invoked protocol carries Route's
    reading as Route's, never as the person's words. The pass belongs to the main conversation: a
    delegated agent does not route, and the agent that receives its report reads it for what only
    the person holds before the work relies on it. Guidance for the judgment, not steps it must
    take: a protocol comes in where its fit is plain, and uncertainty about the very ground it exists
    to investigate is not uncertainty about its fit; bringing one in does not compose where it would
    decide something the person holds or move what they are working toward; a pointer is given where
    it gives the person something they do not already have; where nothing is to be raised, the pass
    is silent. -/
axiom route : (k : Catalog) → (c : Context P) → ProtocolInvocation k c

/-- The pass at a recognition point: `route` over the catalog the session shows. -/
def routeAt (c : AccumulatedContext P) : ProtocolInvocation (catalog c) c :=
  route (catalog c) c

/-! ── LOOP ──
None. Route runs once per recognition point, and the next recognition reads the context afresh;
a protocol's own loop is that protocol's.
-/

/-! ── CONVERGENCE ──
A pass ends structurally at its one outcome, shown as the Rules lay it out. It closes nothing —
neither the invoked protocol nor a checkpoint that holds.
-/

/-! ── TOOL GROUNDING ──
What each operation of this contract does. An interaction with the person is one of two kinds,
and its kind fixes how it continues once its text is presented. A Constitution settles a judgment
through the person's turn. An Extension settles none for the person: it passes on a result its
cited ground fixes, or carries reversible work forward on a judgment the AI states, which stays
the AI's proposal until the person takes it. Beyond the Constitution operations a contract
annotates, whether work goes forward this way or waits for the person's answer is the AI's
judgment in the situation, and work that cannot be undone waits for the authorization it needs.
Work carried forward, on a grant or a stated judgment or as clear work, returns with an account
of how the request was read, what was judged on what basis — naming an alternative set aside
where it may be preferred — and how far the work went.
-/

inductive Interaction | constitution | extension

inductive Continuation | stop | proceed

inductive Annot | sense | observe | track | transform | dispatch | interaction (kind : Interaction)

/-- Every interaction presents its text; a Constitution then stops for the person's turn, and an
    Extension proceeds. -/
def Interaction.realization : Interaction → Continuation
  | .constitution => .stop
  | .extension    => .proceed

inductive Op | catalog | match_ | occasion | converge | invoke

def grounding : Op → Annot × String
  | .catalog  => (.observe, "session read: the loaded core protocols as the session shows them, each with the declared description the session start delivers, or read where the protocol states it when the session shows its identifier alone; read-only")
  | .match_   => (.sense, "Internal analysis: every fit `FitSupported` admits, one line per deficit and protocol, each with Route's reading and the turns it rests on")
  | .occasion => (.sense, "Internal analysis: `route` — the one outcome of the pass, read from the fits and the work underway: which protocol comes in now, which fits get a pointer, or silence")
  | .converge => (.interaction .extension, "Route's reading of each deficit the invoked protocol is brought in for and of the fits beside it, or one pointer line for each fit whose pointer adds something, laid out as the Rules state; silence shows nothing")
  | .invoke   => (.dispatch, "invoke: the skill-invocation call for the entry `invokedBy` names, carrying what Rule 1 states; issuing the call ends the pass")

/-- The operation a pass hands off through: an invocation hands off by `.invoke`; a pointer and
    silence hand nothing off. -/
def handoff {k : Catalog} {c : Context P} (o : ProtocolInvocation k c) : Option Op :=
  (invokedBy o).map fun _ => .invoke

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Route's part in it is bringing one protocol in at a
recognition point, by how the fits raised there compose with each other and with the work
underway (`route`); the path and order between the participating protocols are judged from the
context there and shown in Route's reading, never fixed here. Route adds nothing to any
protocol's contract and arbitrates no checkpoint: each protocol keeps its own scope, checkpoints,
and completion, and its own gates govern what they hold. What the invoked protocol leaves enters
the context, and the work it was brought in to inform — a run whose checkpoint still holds
included — goes on with it under that work's own contract; the next recognition point reads it
like any other context.
-/

end

end Route
```

## Rules

1. **Bring it in, shown as your reading**: Where `route` brings a protocol in, show in one line what you read and what the protocol will leave the person — your reading, never the person's words — and one line for each fit raised beside it, saying how it stands to that protocol; then invoke it before the work that rests on that ground, carrying the same reading as its argument.
2. **Point, or add nothing**: Otherwise, one line `↗ /command — reading` for each fit `route` points at; with none, add nothing.
3. **A holding checkpoint reads first**: A protocol whose checkpoint holds the person's judgment reads their turn by its own contract before any routing does.
4. **Dependent work waits**: Work that rests on ground not yet established waits until a protocol or the person's own words take it up — a direction to go on included — and says what it waits on; independent work goes on, and a coordinate you name as the person's is stated, never filled by default.
