---
name: route
description: "The user meets the deficit their context shows as the protocol that resolves it and sees why, without recalling which exist — /route invokes what plain fits compose into, else points or stays silent."
---

# Route Skill

Route the accumulated session context to the core epistemic protocol whose deficit it shows, and bring that protocol in. Type: `(DeficitUnrouted, AI, ROUTE, AccumulatedContext) → ProtocolInvocation`.

## Definition

**Route**: An act of bringing a present deficit to the protocol that resolves it, so that the person meets that protocol without recalling which protocols exist or which one fits. At a recognition point — the prompt, or a moment in the turn where preparing a response or action shows a deficit — Route reads the loaded core protocols' own descriptions against the context as it stands and yields the one outcome `route` gives: an invocation with Route's reading shown, pointer lines, or silence. How the fits raised now compose — with each other and with the work underway, another protocol's checkpoint that still holds the person's judgment included — is Route's judgment, shown in its reading before the call: one protocol comes in, the fits beside it are shown with how they follow or stand beside it, the checkpoint stays the person's, and the run it belongs to goes on with what the invoked protocol leaves. The person, seeing that reading, can interrupt or rewind. Route closes nothing: each protocol's own gates hold the person's judgment, and a pointer is taken up, if at all, in the person's next turn.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract.
-/

/-! ── FLOW ──
Route(C) → routeAt(C) = route(catalog C, C), one pass at the recognition point C:
  [`lead` brings a protocol in, its fits raised now are each plain, and the policy covers
   invoking it]                                 Route's reading shown, the fits beside it
                                                included → invoke that protocol
  [otherwise, where a pointer to a fit raised now gives the person something]
                                                one pointer line per such fit
  [otherwise]                                   silence
One pass; no loop and no state. A checkpoint that still holds the person's judgment, and fits
for other protocols raised beside the one brought in, are no branches of their own: they are
read inside `lead`.
-/

/-! ── MORPHISM ──
AccumulatedContext
  → read(catalog)               -- the loaded core protocols, each with its own declared description; this skill absent
  → match(fits)                 -- every surviving fit, one line per deficit and protocol, each resting on turns it cites
  → read(occasion)              -- Raise and Fresh for each fit, Plain, lead, PolicyApplies, each read from the context
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

/-- `C`: the session at the recognition point Route is invoked at — the prompt, or a moment in the
    turn where preparing a response or action shows a deficit — with what the turn has recognized
    so far, read after any protocol whose checkpoint stood at the last prompt has read that prompt
    by its own contract. Route reads it and writes nothing into it. -/
abbrev AccumulatedContext (P : Type) := Context P

/-- One loaded core protocol as the session shows it: its skill identifier and its own declared
    description, the sole source of the deficit it resolves. -/
structure Entry where
  skill       : String
  description : String

/-- The candidates: `entries`, the loaded core protocols, and `self`, this skill's own entry, whose
    skill no entry names. -/
structure Catalog where
  entries  : List Entry
  self     : Entry
  excludes : ∀ e ∈ entries, e.skill ≠ self.skill

/-- **Your reading** of the session: the core protocols it can invoke, each with its own declared
    description, read where the protocol states it when the session shows its identifier alone.
    A protocol the session cannot invoke, whatever a table lists, a candidate whose description
    cannot be resolved, a utility skill, and this skill are absent. Route reads no curated routing
    table and no session store. -/
axiom catalog : Context P → Catalog

/-- **Your reading** of a description: the end it declares — what the person can say or recognize
    once that protocol has run — or `none` where it declares none. -/
axiom declaredEnd : Entry → Option String

/-- **Your judgment**: the context, as it now stands, shows this present deficit instance —
    `reading` is your statement of it — and it is the situation the entry's description names,
    read against the object it concerns and the ground that can settle it, resting on the cited
    turns `grounds`. No protocol present in the context serves it: a protocol still running in
    the context serves the deficit instance it was brought in for, and not every deficit that
    comes up while it runs; one a next move the person declared is bringing in serves the
    instance that move names; an invocation that has ended without settling it is not service,
    and a protocol's text in context is not service. A proposed question, assumption, or repair
    is pending work on the deficit and does not supply its result. A deficit already recognized
    stays a fit until current evidence settles it or defeats it; where settling it needs the
    person's determination, evidence that is not the person's may defeat the fit and supplies
    nothing in its place, and it is read apart from the action the latest utterance requests.
    Where several fit, an end a description states is further evidence of fit; it defeats a fit
    only on current evidence that it is incompatible with what the context seeks, and an end a
    description does not state defeats nothing. -/
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
    stays in this reading; whether it is brought up again is `Raise`'s, and whether it counts
    against another fit is `Plain`'s. -/
axiom fits : (k : Catalog) → (c : Context P) → List (Line k c)

/-- **Your judgment**: the context leaves this one fit plain — nothing in it counts against the
    fit, a rival fit for the same deficit among them, one the person turned away included, and
    nothing more is needed to see it. Uncertainty makes it not plain. It is not a score. -/
axiom Plain {k : Catalog} (c : Context P) : Line k c → Prop

/-- **Your reading**: invoking this protocol now falls within the routing policy as this person
    now holds it — adopted as Rule 1 declares, a skill in their own session read as theirs unless
    the context shows otherwise, and within what they have since narrowed it to or short of a
    revocation, in their turns or in standing instructions of theirs the session carries. -/
axiom PolicyApplies (c : Context P) : Entry → Prop

/-- **Your judgment**: the protocol to bring in now, by how the fits raised now compose — with
    each other, which comes first, which follows on what another leaves, which stands beside it,
    and with the work already underway — or `none` where none is to come in now. A checkpoint that
    still holds the person's judgment, by its own contract's reading of what they have said since
    it was presented, does not stand against bringing one in by being there: the invoked protocol
    runs beside that work or inside it, the checkpoint stays theirs, answered only by their own
    turn under its own contract, and neither Route nor what the invoked protocol leaves answers or
    closes it. Bringing a protocol in does not compose where it would decide something the person
    holds, move what they are working toward, or take them off work in hand more than it helps. -/
axiom lead : (k : Catalog) → (c : Context P) → Option Entry

/-- **Your judgment**: bringing this fit in now — by invocation or by a pointer — goes against
    nothing the person has said about it: they have not turned it away with nothing new since, and
    they have not asked Route to leave it. -/
axiom Raise {k : Catalog} (c : Context P) : Line k c → Prop

/-- **Your judgment**: a pointer line for this fit now gives the person something they do not
    already have: no pointer to it stands before them unanswered with nothing new since, and the
    line does not take them off work in hand more than it helps. It bears on a pointer alone; a
    pointer already shown makes a second one redundant, never an invocation. -/
axiom Fresh {k : Catalog} (c : Context P) : Line k c → Prop

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
      every one naming it — handed over as Route's; `beside`, the fits raised now for other
      protocols, shown in that reading with how they compose with it -/
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
The catalog is read at the recognition point [Tool]; `fits` and the occasion are read from the
context; `route` yields one outcome; an invocation hands off through `.invoke` [Tool].
-/

open Classical in
/-- The fits to be raised now, in the order `fits` reads them. -/
def raised (k : Catalog) (c : Context P) : List (Line k c) :=
  (fits k c).filter (fun l => decide (Raise c l))

open Classical in
/-- The fits raised now whose pointer line gives the person something. -/
def pointed (k : Catalog) (c : Context P) : List (Line k c) :=
  (raised k c).filter (fun l => decide (Fresh c l))

open Classical in
/-- The fits raised now that name `e`. -/
def raisedFor (k : Catalog) (c : Context P) (e : Entry) : List (Line k c) :=
  (raised k c).filter (fun l => decide (l.entry = e))

open Classical in
/-- The fits raised now for protocols other than `e`. -/
def raisedBeside (k : Catalog) (c : Context P) (e : Entry) : List (Line k c) :=
  (raised k c).filter (fun l => decide (l.entry ≠ e))

/-- One pointer line for each fit `pointed` keeps, or silence where it keeps none. -/
def pointers (k : Catalog) (c : Context P) : ProtocolInvocation k c :=
  match pointed k c with
  | [] => .silence
  | p :: ps => .point (p :: ps) (List.cons_ne_nil p ps)

open Classical in
/-- One pass over a catalog and a context, its branches as FLOW lays them out. -/
def route (k : Catalog) (c : Context P) : ProtocolInvocation k c :=
  match lead k c with
  | some e =>
    if h : raisedFor k c e ≠ [] ∧ (∀ m ∈ raisedFor k c e, Plain c m) ∧ PolicyApplies c e then
      .invoke e (raisedFor k c e) h.1
        (fun l hl => by simpa using (List.mem_filter.mp hl).2) (raisedBeside k c e)
    else pointers k c
  | none => pointers k c

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

inductive Op | catalog | match_ | occasion | converge | invoke

def grounding : Op → Annot × String
  | .catalog  => (.observe, "session read: the loaded core protocols as the session shows them, each with its own declared description, read where the protocol states it when the session shows its identifier alone; read-only")
  | .match_   => (.sense, "Internal analysis: every fit `FitSupported` admits, one line per deficit and protocol, each with Route's reading and the turns it rests on")
  | .occasion => (.sense, "Internal analysis: whether each fit is to be raised now and whether its pointer adds something, whether each fit is plain, which protocol the fits raised now and the work underway bring in by how they compose, and whether the routing policy covers invoking it, each read from the context")
  | .converge => (.interaction .extension, "Route's reading of each deficit the invoked protocol is brought in for and of the fits beside it, or one pointer line for each fit whose pointer adds something, laid out as the Rules state; silence shows nothing")
  | .invoke   => (.dispatch, "invoke: the skill-invocation call for the entry `invokedBy` names, carrying what Rule 3 states; issuing the call ends the pass")

/-- The operation a pass hands off through: an invocation hands off by `.invoke`; a pointer and
    silence hand nothing off. -/
def handoff {k : Catalog} {c : Context P} (o : ProtocolInvocation k c) : Option Op :=
  (invokedBy o).map fun _ => .invoke

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Route's part in it is bringing one protocol in at a
recognition point, by how the fits raised there compose with each other and with the work
underway (`lead`); the path and order between the participating protocols are judged from the
context there and shown in Route's reading, never fixed here. Each participating
protocol keeps its own scope, checkpoints, and completion; Route places nothing inside one and
answers or closes none. What the invoked protocol leaves enters the context, and the work it was
brought in to inform — a run whose checkpoint still holds included — goes on with it under that
work's own contract; the next recognition point reads it like any other context.
-/

end

end Route
```

## Rules

1. **A declared routing policy**: A person who makes this skill available to their own session — enabling its plugin, or installing it where their host loads it — adopts the policy this contract declares, and it reaches only this: invoking one core protocol the session can invoke, whose fits raised now are plain, chosen by how the fits raised now compose with each other and with the work underway — fits for other protocols raised beside it, and a run whose checkpoint still holds the person's judgment, included, the checkpoint staying theirs. Where someone else made it available, the policy stands once the person's own words take it up. The person narrows or revokes it, as `PolicyApplies` reads. Within it the choice of protocol is Route's, attributed to Route and never to the person.
2. **Showing**: Every line gives what in the context it rests on and the protocol's declared end where its description declares one (`Line.ending`); lines give reasons, never scores or ranks. Before the invocation call, Route's reading is shown: one line for each deficit the protocol is brought in for; one line for each fit raised beside it, saying when it comes in — after the invoked protocol, on what it leaves, or beside it; and, where work is underway, how the protocol composes with it and which work its result goes back to. The call follows. A pointer is one line for each fit whose pointer adds something, `↗ /command — reading`.
3. **What the invocation carries**: Its argument is Route's reading, labelled as Route's and never presented as the person's words; the person's own turns stay in the context for the invoked protocol to read.
4. **Routing before the work that turns on the deficit**: At a recognition point, the prompt or mid-turn, the routing decision comes before the work that turns on the deficit, and work already done stands. Work that depends on the deficit waits until it is taken up — by the invoked protocol, or by the person's own words — and independent work goes on; no outcome of Route, silence included, lifts that wait, and where work waits, the response says what it waits on.
5. **Core protocols only, no gate, no state**: As `catalog`, `ProtocolInvocation`, and `Mode` state.
