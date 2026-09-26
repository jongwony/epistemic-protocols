---
name: induce
description: "Crystallize a shared but unnamed concept from the concrete cases at hand. Type: (AbstractionInProcess, AI, INDUCE, A) → CrystallizedAbstraction"
---

# Periagoge Protocol

Crystallize in-process abstraction by reading the goal it serves across the live readings of the cases, through examples, with a working candidate moved until it fits the user's intent. Type: `(AbstractionInProcess, AI, INDUCE, A) → CrystallizedAbstraction`.

## Definition

**Periagoge** (περιαγωγή): A dialogical act of turning an in-process abstraction toward its crystallized form: AI states the goal the abstraction serves and a working candidate, crosses every live reading of what the cases share with that goal through examples, and moves goal and candidate with the user until the abstraction matches the user's intent. The user reaches the abstraction by reading goal and readings against each other, with every alternative in view (the Greek dialectical vocabulary supplies the source terms).

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract. A
`theorem` line inside a doc comment states a consequence the contract already has; it is proved
outside this block and asks nothing further of you.
-/

/-! ── FLOW ──
Periagoge(A) → start(c) → induce(c, utterances), where c is the fused session context:
  start: scan where fewer than two cases or no essence → [not in process: not activated] → pass → sheet → Stop
  each utterance: [bears on nothing in the run: the sheet holds] pass → [stop: withdrawn | route: routed |
    confirm ∧ candidate live ∧ covered: crystallized | otherwise: the sheet again → Stop]
  no utterance: the sheet holds
-/

/-! ── MORPHISM ──
A
  → CrystallizedAbstraction
requires: in_process(A)                     -- judged at activation
deficit:  AbstractionInProcess              -- activation precondition
preserves: instance_set(A)                  -- the cases are read, never rewritten; a case you found is shown as yours
invariant: Goal Crossed with Readings through Examples, with Alternatives Maintained, over Single-Candidate Steering
invariant: setting a reading aside, an open item's disposition, and every closing are the person's; your readings settle none of them
-/

namespace Periagoge

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

/-!
theorem fuse_extends {P : Type} (c : Context P) (u : Utterance P) :
    ∃ t, fuse c u = c ++ t

theorem cited_not_assistant {P : Type} {c : Context P} (s : Cite c) :
    (c[s.idx]'s.lt).origin ≠ .assistant

theorem cited_not_injected {P : Type} {c : Context P} (s : Cite c) :
    (c[s.idx]'s.lt).origin ≠ .injected
-/

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

/-- `A`, `AbstractionSeed`: the in-process state, read from the context — the cases, read and never
    rewritten; the essence intuition, which a routed colimit-shaped signal seeds only as that
    detection's reading; and any provisional name the person gave, which grounds the candidate's
    name without fixing it. -/
abbrev AbstractionSeed (P : Type) := Context P

/-- A concrete case: what it is, and where it sits. -/
structure Instance where
  content : String
  context : String
  deriving DecidableEq  -- elab: lets the sheet gather each case once

/-- **Your judgment**: an essence is sensed whose name, scope, or position is still unsettled, and
    at least two concrete cases can be read together. An abstraction already located — one awaiting
    comparison or validation — is not in process, and a set of cases and essence this session
    already crystallized or withdrew stays inactive. -/
axiom inProcess : Context P → Prop

/-- **Your record**: the cases you found that the person's words have not yet taken up. The next
    sheet opens with them, marked as found by you, so the person sees them before their next turn;
    they never join the cases silently. -/
axiom found : Context P → List Instance

/-- **Your judgment**, made afresh on every pass: the goal — what the abstraction is for — as it now
    stands. Where the person's words state it, it is their words, quoted; otherwise it is your
    reading, marked as yours. It moves: a turn that narrows or widens it moves it, on the scope its
    words reach. -/
axiom goal : Context P → String

/-- One reading of what the cases share. -/
abbrev Reading := String

/-- `(N, Rule)`: the working candidate — a name and a rule, the reading the rule is read off, and
    the label it was grounded on. The name is delivered with the goal, the rule, and the examples
    the rows drew: it locates the abstraction and returns the person to those cases. -/
structure Candidate where
  name       : String
  rule       : String
  reading    : Reading
  labelBasis : Option String

/-- **Your proposal**, from the first sheet on: the working candidate, with every move the person
    made since — a rename, a rule correction, a move to another reading, a merge. -/
axiom candidate : Context P → Candidate

/-- **Your judgment**, made afresh on every pass: every reading of what the cases share drawn in this
    activation, the readings the person added included. A reading you would no longer hold stays
    here: dropping it is your proposal, shown in the ledger and among your contrary grounds, until
    the person sets it aside. A merge the person makes is a reading; a reading you judge the same
    across passes keeps its name. A reading the person set aside comes back within the activation
    only through their own words (`Reopened`), never as your proposal. -/
axiom readings : Context P → List Reading

/-- **Your judgment**: the cited turn sets reading `r` aside, on this ground — their reason, carried
    verbatim — whatever form the turn takes. -/
axiom SetAsideSupported : Reading → Context P → Turn P → String → Prop

/-- A reading is set aside only by the person's turn. -/
def setAsideCoord (r : Reading) : Coord P String :=
  { admits := (·.val = .person), supports := SetAsideSupported r }

/-- **Your reading**: the person's setting-aside of `r`; `open_` until one reaches it. -/
axiom setAside : (c : Context P) → (r : Reading) → Occ (setAsideCoord (P := P) r) c

def filledValue {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Option A
  | .open_ _     => none
  | .filled a .. => some a

/-- **Your judgment**: the person's later words name reading `r` again after setting it aside; it
    returns with their ground shown beside it. -/
axiom Reopened : Context P → Reading → Bool

/-- The readings still in play: a reading leaves only by the person's setting-aside, and returns
    only by their words. -/
def live (c : Context P) : List Reading :=
  (readings c).filter (fun r => (filledValue (setAside c r)).isNone || Reopened c r)

/-- Every reading the person set aside, with their ground. -/
def setAsideReadings (c : Context P) : List (Reading × String) :=
  (readings c).filterMap (fun r => (filledValue (setAside c r)).map (r, ·))

/-- An example named by a phrase that carries the feature being judged, never by a bare number. -/
structure Example where
  phrase : String
  source : Instance

/-- One row of the cross view: what the reading becomes against the goal — the check it yields —
    an example it catches and one it misses, and where the working candidate sits on it. -/
structure Row where
  againstGoal   : String
  catches       : Example
  misses        : Example
  candidateHere : String

/-- **Your judgment**: the row for reading `r`. Choose examples that separate the goal and the
    readings rather than ones every reading treats alike, drawn from the person's own domain: pair
    the cases that align most readily, not the most distant, since distance is what a separating
    example is for; align what they carry slot by slot from the cases themselves; and draw a case
    that tells readings apart. A row's examples stay as the last sheet showed them until a move of
    the person's reaches them — a swap, a move of the goal, the candidate, or the reading they cross,
    a correction, a case they brought; an example you would change otherwise is your proposal in the
    ledger, not a swap. -/
axiom row : Context P → Reading → Row

/-- The cross view: every live reading with its row. -/
def crossView (c : Context P) : List (Reading × Row) := (live c).map (fun r => (r, row c r))

/-- A case unfolded on the sheet, a few lines: what happened, what was seen and what was not, how
    it surfaced, and who brought it. -/
structure CaseUnfolding where
  happened  : String
  seen      : String
  unseen    : String
  surfaced  : String
  broughtBy : String

/-- **Your reading** of case `i`, unfolded. -/
axiom unfoldCase : Context P → Instance → CaseUnfolding

/-- Every case the cross view uses, once each. -/
def rowCases (c : Context P) : List Instance :=
  ((crossView c).flatMap (fun x => [x.2.catches.source, x.2.misses.source])).eraseDups

/-- The cases section of the sheet: every case the cross view uses, unfolded, so the person never
    leaves the sheet to see one. -/
def casesSection (c : Context P) : List (Instance × CaseUnfolding) :=
  (rowCases c).map (fun i => (i, unfoldCase c i))

/-- The candidate is read off a reading still in play. -/
def CandidateLive (c : Context P) : Prop := (candidate c).reading ∈ live c

open Classical in
/-- The candidate the sheet shows: only while its reading is in play. Where the person set that
    reading aside, you propose a candidate on a live reading; where none is live, the sheet shows
    none. -/
def shownCandidate (c : Context P) : Option Candidate :=
  if CandidateLive c then some (candidate c) else none

/-- **Your reading**: what the person said is still missing, each point in their words. -/
axiom missing : Context P → List String

/-- What a run can still owe at its end, tagged by what it is. -/
inductive OpenItem
  | reading (r : Reading)
  | question (q : String)

/-- The live readings the candidate does not take, and what the person said is still missing. -/
def openItems (c : Context P) (taken : Option Reading) : List OpenItem :=
  ((live c).filter (fun r => decide (some r ≠ taken))).map .reading ++ (missing c).map .question

inductive OpenDisposition
  | nonblocking
  | deferred

/-- **Your judgment**: the cited turn disposes of item `i` this way — not blocking where the closing
    turn takes the run with the item shown open, deferred where it routes the item to later work
    by name or unambiguous reference beside deferral words. Ambiguous deferral words defer
    nothing. -/
axiom DispositionSupported : OpenItem → Context P → Turn P → OpenDisposition → Prop

/-- An open item is disposed of only by the person's turn. -/
def dispositionCoord (i : OpenItem) : Coord P OpenDisposition :=
  { admits := (·.val = .person), supports := DispositionSupported i }

/-- **Your reading**: how item `i` stands; `open_` where no turn of the person's covers it. -/
axiom disposition : (c : Context P) → (i : OpenItem) → Occ (dispositionCoord (P := P) i) c

/-- A line of the sheet, named as the sheet shows it. -/
abbrev Entry := String

/-- **Your reading**: the lines the sheet shows as the context now stands. -/
axiom entries : Context P → List Entry

/-- Who first put a value forward, kept apart from how it came to stand. -/
inductive Proposer | ai | person

/-- **Your reading**: the position of the turn that first put forward what `e` holds now. -/
axiom introducedAt : Context P → Entry → Nat

def proposer (c : Context P) (e : Entry) : Proposer :=
  match c[introducedAt c e]? with
  | some ⟨.person, _⟩ => .person
  | _                 => .ai

/-- How a value came to stand: the person's turn set it; it is yours and still proposed; or a
    confirm adopted yours. -/
inductive Standing | set | proposed | adopted

/-- **Your reading**: the person's turn set what `e` holds now, on the scope their words reach. -/
axiom setByPerson : Context P → Entry → Bool

def standing (c : Context P) (e : Entry) : Standing := if setByPerson c e then .set else .proposed

structure Provenance where
  entry    : Entry
  proposer : Proposer
  standing : Standing

def provenance (c : Context P) : List Provenance :=
  (entries c).map (fun e => ⟨e, proposer c e, standing c e⟩)

/-- A confirm adopts what was still proposed. -/
def adopt (p : Provenance) : Provenance :=
  match p.standing with
  | .proposed => { p with standing := .adopted }
  | _         => p

/-- What a ledger line records. -/
inductive LedgerKind
  /-- the person's own move -/
  | personEdit
  /-- a value you re-drew because a move forces it -/
  | necessary
  /-- a value you re-drew, a case you found, or a reading you dropped, because you propose it -/
  | proposal

/-- One change since the last sheet. -/
structure LedgerLine where
  change : String
  cause  : Option Entry
  kind   : LedgerKind

/-- **Your record**: what the latest turn changed, the person's moves first. -/
axiom ledger : Context P → List LedgerLine

/-- The one move a sheet asks about; stopping and going elsewhere stay open on every sheet. -/
inductive Move
  | narrowGoal
  | widenGoal
  /-- move the candidate onto another reading -/
  | moveCandidate (to : Reading)
  /-- merge two readings into one -/
  | merge (a b : Reading)
  /-- swap an example on a reading's row for one that separates better -/
  | swapExample (r : Reading)
  | confirm
  /-- every reading drawn so far was set aside: name a distinction the readings missed, read
      another set of cases, or move the goal -/
  | exhausted

/-- **Your selection** of the move to ask about: the one whose answer would most change how goal and
    readings cross. Ask for a confirm only where the candidate fits the goal on every example shown;
    where an example could still separate it, that example comes first. -/
axiom selectMove : Context P → Move

open Classical in
/-- The move the sheet asks about. -/
def focus (c : Context P) : Move := if live c = [] then .exhausted else selectMove c

/-- **Your record**: the contrary grounds you showed before the person's answers — a reading the
    examples back better than the candidate's, a goal the candidate misses on an example shown, a
    case you would weigh otherwise — attached to the closing when the person closes over them;
    empty when there were none. Your reading never refuses a confirm: a confirm over it carries it
    as dissent. -/
axiom dissent : Context P → List String

/-- How the person ends the run. -/
inductive Closing
  /-- confirm the goal and the candidate as the sheet shows them -/
  | confirm
  /-- stop here -/
  | stop
  /-- go on to the protocol the person names -/
  | route (target : String)

/-- **Your judgment**: the cited turn closes the run this way, read against the context as it now
    stands, the order of its turns included: a closing said before a later sheet was presented was
    answered by that sheet, so a confirm reaches only the sheet it followed. Whatever form the turn
    takes, a move, a correction, or a rename closes nothing; "not yet" keeps the run open. -/
axiom ClosingSupported : Context P → Turn P → Closing → Prop

/-- Only the person closes. -/
def closeCoord : Coord P Closing :=
  { admits := (·.val = .person), supports := ClosingSupported }

/-- **Your reading**: the person's closing; `open_` until one reaches it. -/
axiom closing : (c : Context P) → Occ (closeCoord (P := P)) c

/-- **Your judgment**, the adoption condition: everything a confirm would take was shown on the sheet
    the confirm answered — the goal with who set it, the candidate, every live reading's row, every
    case the rows use unfolded, the readings set aside with their grounds, every case with who
    brought it — together with your
    contrary grounds. A confirm adopts the goal as shown. Where anything would be taken unseen, the
    sheet is drawn again with the whole basis. -/
axiom Covered : Context P → Prop

/-- **Your judgment**: the latest utterance bears on this run — a move, a correction, a case, a
    rename, a closing, a question about the sheet. An utterance about other work leaves the run as
    it stands. -/
axiom Reaches : Context P → Prop

/-- `CrystallizedAbstraction`: the person's confirm over a covered sheet whose candidate is read off
    a live reading. -/
structure CrystallizedAbstraction (P : Type) where
  context    : Context P
  goal       : String
  candidate  : Candidate
  crossView  : List (Reading × Row)
  cases      : List (Instance × CaseUnfolding)
  setAside   : List (Reading × String)
  openTrace  : List OpenItem
  dissent    : List String
  provenance : List Provenance

/-- What a run established when the person stops it or goes elsewhere, so a later run resumes from
    it; the goal, the candidate, and the readings stand as your reading. -/
structure Withdrawn (P : Type) where
  context   : Context P
  goal      : String
  candidate : Candidate
  setAside  : List (Reading × String)
  openTrace : List OpenItem
  dissent   : List String

inductive Outcome (P : Type)
  | notActivated (c : Context P)
  | crystallized (r : CrystallizedAbstraction P)
  /-- the person stopped -/
  | withdrawn    (r : Withdrawn P)
  /-- the person named another protocol: proceed to it, citing their words -/
  | routed       (target : String) (r : Withdrawn P)
  | holding      (c : Context P)

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it. No gate, stage, or
count is stored: each sheet is judged afresh from the whole context.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
A step is one arm of a structural recursion over the person's utterances. A pass is the silent
work: the reads the run needs enter the context, then the pass's record — the run judged afresh.
`respond` presents the sheet; `declare` is the closing declaration of the trace.
-/

/-- **Your reads** at activation: where fewer than two cases are in hand or no essence is sensed,
    the session context and the person's artifacts scanned for cases that could be read
    together. -/
axiom scan : Context P → List (Evidence P)

/-- **Your reads** for a pass: the cases' own context by artifact read and search, examples from the
    person's domain, and an external fetch where that domain lies outside their artifacts. -/
axiom collect : Context P → List (Evidence P)

/-- **Your record** of a pass, once its reads have entered the context: the run as judged — the goal,
    the candidate, the readings and their rows, the readings set aside, provenance, the ledger, your
    contrary grounds, and the move. A record grounds nothing. -/
axiom passRecord : Context P → List (Response P)

def pass (c : Context P) : Context P :=
  let c₁ := c ++ (collect c).map (·.val)
  c₁ ++ (passRecord c₁).map (·.val)

/-- The crystallized abstraction; the context ends in the declaration. -/
def crystallize (declare : Context P → Response P) (c : Context P) : CrystallizedAbstraction P :=
  { context := c ++ [(declare c).val], goal := goal c, candidate := candidate c,
    crossView := crossView c, cases := casesSection c, setAside := setAsideReadings c,
    openTrace := openItems c (some (candidate c).reading), dissent := dissent c,
    provenance := (provenance c).map adopt }

/-- What the run established; no candidate was taken, so every live reading stays open. -/
def withdraw (declare : Context P → Response P) (c : Context P) : Withdrawn P :=
  { context := c ++ [(declare c).val], goal := goal c, candidate := candidate c,
    setAside := setAsideReadings c, openTrace := openItems c none, dissent := dissent c }

open Classical in
/-- `respond` presents the sheet the Protocol section describes under "The sheet": the
    candidate as `shownCandidate` gives it, the cross view (`crossView`), the cases as `casesSection`
    unfolds them, ending at the one move (`focus`). -/
def induce (respond declare : Context P → Response P) :
    Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let c' := fuse c u
    if ¬ Reaches c' then induce respond declare c' us
    else
      let c₁ := pass c'
      match filledValue (closing c₁) with
      | some .stop      => .withdrawn (withdraw declare c₁)
      | some (.route t) => .routed t (withdraw declare c₁)
      | some .confirm   =>
        if CandidateLive c₁ ∧ Covered c₁ then .crystallized (crystallize declare c₁)
        else induce respond declare (c₁ ++ [(respond c₁).val]) us
      | none => induce respond declare (c₁ ++ [(respond c₁).val]) us

open Classical in
def start (respond declare : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  let c₁ := c ++ (scan c).map (·.val)
  if ¬ inProcess c₁ then .notActivated c₁
  else
    let c₂ := pass c₁
    induce respond declare (c₂ ++ [(respond c₂).val]) us

/-! ── CONVERGENCE ──
crystallized, withdrawn, routed — the three closings of `Outcome`, each the person's; the trace each
carries is its structure's fields, and at a withdrawal they stand as your reading.
-/

/-! ── TOOL GROUNDING ── -/
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed

inductive Annot | sense | observe | track | transform | dispatch | constitution | extension

inductive Op | detect | scan | absorb | collect | judge | record | sheet | readTurn | declare
             | converge | seam

def grounding : Op → Annot × String
  | .detect   => (.sense, "Internal analysis: the deficit over the utterance and the context")
  | .scan     => (.observe, "artifact read, artifact search (conditional: fewer than two cases, or no essence)")
  | .absorb   => (.extension, "TextPresent+Proceed: a routed colimit-shaped signal as activation ground, its cited essence and locator shown as the detection's reading")
  | .collect  => (.observe, "artifact read, artifact search; external fetch (conditional: the domain lies outside the person's artifacts), its URL cited where used")
  | .judge    => (.sense, "Internal analysis: the whole run afresh against the whole context")
  | .record   => (.track, "record: the pass's record")
  | .sheet    => (.constitution, "present: the sheet, then one move (mandatory)")
  | .readTurn => (.sense, "Internal analysis: the new turn read against the fused context as it now stands")
  | .declare  => (.extension, "TextPresent+Proceed: at a withdrawal or a route, the trace as your reading")
  | .converge => (.extension, "TextPresent+Proceed: at a crystallization, the trace and the dissent")
  | .seam     => (.extension, "TextPresent+Proceed: at a chain the person declared, proceed to the named protocol citing that turn")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
-/

end

end Periagoge
```

## Mode Activation

`/induce` remains directly invocable; AI-guided activation stays silent and follows `inProcess`. An abstraction already located — one awaiting comparison or validation — belongs to other work.

Bind the seed from an explicit argument first, then the most recent cluster of cases, then a surfaced essence. Where no essence is sensed, show the scan result and invite the user to name what feels in process; where the scan finds no second case, say what was searched and invite one. Prior-session recall may seed examples or neighbouring abstractions but never settles crystallization.

## Protocol

### The sheet

Every turn shows one sheet, in everyday language. It opens with any case you found since the last sheet, marked as found by you, so the user meets it before their next turn; a found case stays yours until the user's words take it up, and a confirm that covers it adopts it as yours.

Then the goal: what the abstraction is for. Where the user has said it, quote their words; otherwise give your reading and mark it as yours. Under it, the working candidate — a name and a rule — from the first sheet on, always on a reading still in play: where the user sets that reading aside, propose a candidate on a live one. Both move: the run's work is moving the goal and the candidate until the abstraction matches what the user means.

Then the cross view, one row per live reading. Each row says what the reading becomes against the goal — the check it would give you — an example it catches and an example it misses, and where the candidate sits on that reading. Name every case by a short phrase that carries the feature being judged. Then a cases section: every case the rows use, unfolded in a few lines — what happened, what was seen and what was not, how it surfaced, who brought it — so every case is read on the sheet itself. Unfold a new or changed case again; an unchanged one may be folded as the same as the last sheet; unfold them all on the sheet a confirm would answer. The full list of cases with who brought each, and the readings the user set aside beside the user's own words, appear when they change, when reconsidering needs them, and on the sheet a confirm would answer. Mark every value as the user's or yours. Label each field with the question it answers, in the user's words, and say each term this file uses as the concrete question it stands for in the user's material. Draw the fields with the structure the host renders — headings, tables, lists.

Under the sheet, the ledger of what the last turn changed: the user's moves first, then what you re-drew because of them, each marked as forced by that move or as your proposal. A reading you would no longer hold stays in the cross view until the user sets it aside; dropping it is your proposal, shown in the ledger. A row's examples stay as the last sheet showed them until a move of the user's reaches them; an example you would change otherwise is likewise a proposal in the ledger. Then your contrary grounds, each beside the value it bears on.

Then one move to ask about: narrow or widen the goal, move the candidate onto another reading or merge two readings, swap an example for one that separates better, or confirm. Say what each way of answering does to the goal and the candidate. Where every reading was set aside, say that every reading drawn so far was set aside on the grounds shown, and ask whether to name a distinction the readings missed, read another set of cases, or move the goal. Stopping, and going on to a protocol the user names, stay open on every sheet.

The user may answer in their own words, and one answer may reach several parts of the sheet. A move reaches what its words reach. An utterance about other work leaves the sheet as it stands; the sheet returns when the user comes back to the run. A reading leaves the cross view only by the user's words setting it aside, and returns when the user names it again, with their earlier ground shown beside it. Only the user closes the run: confirming, stopping, or going on to a protocol they name. A confirm takes the goal and the candidate as the sheet it followed showed them, with the whole basis in view, and only while the candidate's reading is still in play; where something it would take was never shown, draw the sheet again with the whole basis, and a confirm said before that later sheet does not reach it.

At the close, declare the trace before proceeding: the goal and who set it, the candidate, the cross view with its cases unfolded, the readings set aside with their grounds, every case with who brought it, and the open trace. The open items are the live readings the candidate does not take and what the user said is still missing. Each open item takes its disposition from the user's closing turn: not blocking where the turn takes the run with the item shown open, deferred where it names the item for later work beside deferral words. An item no turn covered is shown as undisposed. At a withdrawal, show the goal, the candidate, and the readings as your reading, not as established.

Read `references/round-composition.md` before composing when terminology must remain stable, wording must be carried unchanged, material belongs to another round or trace, or the order of the sheet bears on where a sentence sits.

## Rules

- **Recognition over Recall**: Present the sheet and one move with anticipatable consequences, and yield for the user's judgment.
- **Goal and candidate first, tested against each other**: Open every sheet with the goal and a working candidate, and test the candidate against the goal through examples on every row. The goal and the alternatives beside the candidate are what keep the user's judgment their own.
- **Round composition**: Compose each round in everyday language, keep each judgment beside its evidence and next-move implication, and place analysis before the move.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change the form directly. Elements fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
