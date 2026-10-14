---
name: route
description: "Route the accumulated session context to the loaded core protocol whose deficit it shows — /route. Invokes one plain fit with its reading shown, points if several fit or a gate holds, else silent."
---

# Route Skill

Route the accumulated session context to the core epistemic protocol whose deficit it shows, and bring that protocol in. Type: `(DeficitUnrouted, AI, ROUTE, AccumulatedContext) → ProtocolInvocation`.

## Definition

**Route**: An act of bringing a present deficit to the protocol that resolves it, so that the person meets that protocol without recalling which protocols exist or which one fits. At a recognition point — the prompt, or a moment in the turn where preparing a response or action shows a deficit — Route reads the loaded core protocols' own descriptions against the context as it stands and yields one of three outcomes. Where one fit is plain, the routing policy this contract declares covers the occasion, and no presented checkpoint holds the person's judgment, Route shows its reading and invokes that protocol. Where several fit, the one fit is not plain, the policy does not cover the occasion, or a checkpoint holds, it shows one pointer line per fit. Where nothing fits, or the fits are not to be raised now, it says nothing. Route closes nothing: the invoked protocol's own gates hold the person's judgment, and a pointer is taken up, if at all, in the person's next turn.

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
  [fits = []]                                   silence
  [the fits are not to be raised now]           silence
  [one fit, plain, the policy covers the occasion, no checkpoint holds]
                                                Route's reading shown → invoke that protocol
  [otherwise — several fits, a fit not plain, the policy not covering it, or a checkpoint
   holding]                                     one pointer line per fit
One pass; no loop and no state. What was done before the recognition stands; work that turns on
the deficit waits for the invoked protocol or the person's next turn; independent work goes on.
-/

/-! ── MORPHISM ──
AccumulatedContext
  → read(catalog)               -- the loaded core protocols, each with its own declared description; this skill absent
  → match(fits)                 -- every surviving fit, one line per protocol, each resting on turns it cites
  → read(occasion)              -- Plain, PolicyApplies, Holding, Raise, each read from the context
  → emit(ProtocolInvocation)    -- invoke one plain fit with Route's reading shown, point, or silence
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

/-- **Your reading** of the session: the loaded core protocols as it shows them, each with its own
    declared description, read where the protocol states it when the session shows its identifier
    alone. A candidate whose description cannot be resolved, a utility skill, and this skill are
    absent. Route reads no curated routing table and no session store. -/
axiom catalog : Context P → Catalog

/-- **Your reading** of a description: the end it declares — what the person can say or recognize
    once that protocol has run — or `none` where it declares none. -/
axiom declaredEnd : Entry → Option String

/-- **Your judgment**: the context, as it now stands, shows this present deficit instance —
    `reading` is your statement of it — and it is the situation the entry's description names,
    read against the object it concerns and the ground that can settle it. No protocol present in
    the context serves it: an earlier invocation is not service, and a protocol's text in context
    is not service. A proposed question, assumption, or repair is pending work on the deficit and
    does not supply its result. A deficit already recognized stays a fit until current evidence
    settles it or defeats it; where settling it needs the person's determination, evidence that is
    not the person's may defeat the fit and supplies nothing in its place, and it is read apart
    from the action the latest utterance requests. Where several fit, an end a description states
    is further evidence of fit; it defeats a fit only on current evidence that it is incompatible
    with what the context seeks, and an end a description does not state defeats nothing. -/
axiom FitSupported : Context P → Entry → String → Prop

/-- One fit: a catalog entry, Route's reading of the present deficit instance it resolves, and
    the turns that reading rests on — one at least. -/
structure Line (k : Catalog) (c : Context P) where
  entry    : Entry
  mem      : entry ∈ k.entries
  reading  : String
  grounds  : List (Cite c)
  grounded : grounds ≠ []
  fit      : FitSupported c entry reading

/-- The end a line shows: its entry's declared end, and none where the description declares
    none. -/
def Line.ending {k : Catalog} {c : Context P} (l : Line k c) : Option String :=
  declaredEnd l.entry

/-- **Your reading**: every fit `FitSupported` admits on the context as it now stands, one line per
    protocol, not ranked or scored into a winner. A pointer the person passed over stays in this
    reading; whether it is raised again is `Raise`'s. -/
axiom fits : (k : Catalog) → (c : Context P) → List (Line k c)

/-- **Your judgment**: the context leaves this one fit plain — nothing in it counts against the
    fit, and nothing more is needed to see it. Uncertainty makes it not plain. It is not a
    score. -/
axiom Plain {k : Catalog} (c : Context P) : Line k c → Prop

/-- **Your reading**: the routing policy Rule 1 declares covers this occasion, read after the
    person's own turns that narrow or revoke it; injected text, or a skill being available,
    establishes no act of the person's. -/
axiom PolicyApplies : Context P → Prop

/-- **Your reading**: some presented checkpoint still holds the person's judgment, by its own
    contract's reading of what the person has said since it was presented. One presented during
    the current turn holds until its contract takes an answer at it. A protocol's prose in context
    holds nothing. Read from the context, never from a store. -/
axiom Holding : Context P → Prop

/-- **Your judgment**: this is an occasion to raise these fits — they are not an unchanged pointer
    the person already passed over with no new evidence, changed stakes, or their own reopening of
    it since; and, while a checkpoint holds, raising them now does not pull the person off that
    checkpoint more than it helps. -/
axiom Raise {k : Catalog} (c : Context P) : List (Line k c) → Prop

/-- What one pass of Route yields. No outcome carries a value of the person's. -/
inductive ProtocolInvocation (k : Catalog) (c : Context P)
  /-- the one plain fit, invoked with Route's reading handed over as Route's -/
  | invoke (line : Line k c)
  /-- one pointer line per fit -/
  | point (lines : List (Line k c)) (nonempty : lines ≠ [])
  | silence

/-- The protocol a pass invokes: the entry of an invocation's line; a pointer and silence invoke
    nothing. -/
def invokedBy {k : Catalog} {c : Context P} : ProtocolInvocation k c → Option Entry
  | .invoke l => some l.entry
  | _         => none

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
/-- One pass over a catalog and a context: silence where nothing fits or the fits are not to be
    raised; the invocation of the one fit where it is plain, the policy covers the occasion, and no
    checkpoint holds; otherwise one pointer line for each fit `fits` reads. -/
def route (k : Catalog) (c : Context P) : ProtocolInvocation k c :=
  match h : fits k c with
  | [] => .silence
  | l :: ls =>
    if ¬ Raise c (fits k c) then .silence
    else if ls = [] ∧ Plain c l ∧ PolicyApplies c ∧ ¬ Holding c then .invoke l
    else .point (fits k c) (by rw [h]; exact List.cons_ne_nil l ls)

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
  | .match_   => (.sense, "Internal analysis: every fit `FitSupported` admits, one line per protocol, each with Route's reading and the turns it rests on")
  | .occasion => (.sense, "Internal analysis: whether the one fit is plain, whether the routing policy covers the occasion, whether a checkpoint holds the person's judgment, and whether the fits are to be raised now, each read from the context")
  | .converge => (.interaction .extension, "Route's reading of the invoked fit, or one pointer line per fit, laid out as the Rules state; silence shows nothing")
  | .invoke   => (.dispatch, "invoke: the skill-invocation call for the entry `invokedBy` names, with Route's reading as its argument, labelled as Route's; issuing the call ends the pass")

/-- The operation a pass hands off through: an invocation hands off by `.invoke`; a pointer and
    silence hand nothing off. -/
def handoff {k : Catalog} {c : Context P} (o : ProtocolInvocation k c) : Option Op :=
  (invokedBy o).map fun _ => .invoke

/-! ── COMPOSITION ──
Route places nothing inside a protocol. Each protocol ends at its own boundary, and what it leaves
is context the next recognition point reads like any other.
-/

end

end Route
```

## Rules

1. **A declared routing policy**: Enabling this plugin adopts the policy this contract declares, and it reaches only this — invoking one loaded core protocol whose fit is plain, where no presented checkpoint holds the person's judgment. The person's own turns narrow or revoke it, as `PolicyApplies` reads. Within it the choice of protocol is Route's, attributed to Route and never to the person.
2. **Showing**: Before the invocation call, one line gives Route's reading — what in the context it rests on, and the protocol's declared end where its description declares one (`Line.ending`) — and the call follows; issuing the call discharges the branch. A pointer is one line per fit, `↗ /command — reading`, with the same content. Lines give reasons, never scores or ranks.
3. **What the invocation carries**: Its argument is Route's reading, labelled as Route's and never presented as the person's words; the person's own turns stay in the context for the invoked protocol to read.
4. **Routing before the work that turns on the deficit**: At a recognition point, the prompt or mid-turn, work already done stands; work that depends on the deficit waits for the invoked protocol or for the person's next turn; independent work goes on.
5. **Core protocols only, no gate, no state**: As `Catalog`, `ProtocolInvocation`, and `Mode` state.
