---
name: induce
description: "Several concrete cases at hand seem to share something no one has named yet: the user can then name it, say which cases it takes in and leaves out, and recognize it as serving their goal."
---

# Periagoge Protocol

Name what several concrete cases share by crossing a working candidate with the goal it serves and with every live reading of the cases, until the user recognizes the abstraction as serving their goal. Type: `(AbstractionInProcess, AI, INDUCE, A) → CrystallizedAbstraction`.

## Definition

**Periagoge** (περιαγωγή): a turning-around — a dialogical act for the moment when several concrete cases seem to share something no one has named yet, or that a name in use no longer says. From the first sheet the AI states the goal the abstraction serves and a working candidate — a name and a rule, with the ground it stands on and, where that ground is short, what is short beside it —, and crosses every live reading of what the cases share with that goal: which cases each reading takes in and which it leaves out. The user answers in their own words: they move the goal or the candidate, take what the AI showed, set a reading aside, or recognize the abstraction; they can stop at any time, and the run stays as it stood. Once it has run, the user can name what their cases share, say which cases it takes in and which it leaves out, and recognize it as serving their goal — their settlement for that goal, not proof that the reading is correct (the Greek dialectical vocabulary supplies the source terms).

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract.
-/

/-! ── FLOW ──
Periagoge(A) → start(c) → induce(c, utterances), where c is the fused session context:
  start: what bears on the cases is collected into c; then your reading, on it, that this is not
    this protocol's case (`notActivated`) → not activated — on an invocation, your reading with its
    basis; AI-guided activation stays silent; otherwise → sheet → Stop
  next utterance u, read on fuse(c, u):
    [does not bear on this run]                                the session answers it; that answer
                                                               stays in c; the sheet holds
    [the person recognizes the goal and the candidate]         what is collected now enters c; where
                                                               c holds a case no sheet has shown
                                                               and no turn of the person's brought
                                                               that would decide against that
                                                               candidate (`Overturned`)
                                                               → the sheet again → Stop; otherwise
                                                               → crystallized
    [otherwise]                                                what is collected now enters c → the sheet again → Stop
  no utterance: the sheet holds
-/

/-! ── MORPHISM ──
A
  → CrystallizedAbstraction
requires: in_process(A)                     -- read before activation (`notActivated`)
deficit:  AbstractionInProcess              -- activation precondition
preserves: instance_set(A)                  -- the cases are read, never rewritten; a case you found is yours
invariant: Goal Crossed with Readings through Examples, with Alternatives Maintained, over Single-Candidate Steering
invariant: setting a reading aside, taking a value you showed, an open item's words, and every closing are the person's; your readings settle none of them
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
    rewritten; the essence intuition; and any provisional name the person gave, which grounds the
    candidate's name without fixing it. What earlier work produced is context like any other; an
    essence it suggests is your reading. -/
abbrev AbstractionSeed (P : Type) := Context P

/-- A concrete case: what it is, and where it sits. -/
structure Instance where
  content : String
  context : String
  deriving DecidableEq  -- elab: lets `casesSection` hold each case once

/-- **Your reading**, before any sheet: why this is not this protocol's case, with its basis. The
    case is this protocol's where an essence is sensed whose name, rule, or reach is still
    unsettled for the person and at least two concrete cases can be read together: a named
    abstraction whose meaning is being reconsidered from its cases is in process; applying a fixed
    meaning to a disputed case is not; a set of cases this session already crystallized, or whose
    run the person's words ended, stays inactive unless the person's words reopen it, a correction
    of its record among them. Where no essence is sensed or no second case was found, say what was
    searched and what would settle it. `none` where the case is this protocol's.
    During a run, a reading that the case is no longer this protocol's is one of your doubts, with
    its basis, and closes nothing. -/
axiom notActivated : Context P → Option String

/-- **Your record**: the cases you found and bring to the sheet — the rest of what collection
    turned up stays in the context it was read into — that the person's words have neither taken
    up nor turned down. A case that would decide against the candidate is among the cases you
    bring. -/
axiom found : Context P → List Instance

/-- **Your reading**: the cases the person brought — named in their turns, or singled out by them
    from what they pointed you to — and the cases you found that their words took up, read and
    never rewritten. A collection they point you to without singling out cases is material you
    collect from. A case their later words withdraw is no longer brought; those words stand in the
    context. -/
axiom brought : Context P → List Instance

/-- **Your judgment**, made afresh on every pass: the goal — what the abstraction is for — as it now
    stands. Where the person's words state it, it is their words, quoted; otherwise it is your
    reading. It moves: a turn that narrows or widens it moves it, on the scope its words reach. At
    a recognition it is the goal as the recognizing turn took it — the sheet's, with the person's
    changes since; a re-draw of yours is not that value. -/
axiom goal : Context P → String

/-- One reading of what the cases share. -/
abbrev Reading := String

/-- `(N, Rule)`: the working candidate — a name and a rule, the reading the rule is read off, the
    readings that reading merges, and those any merge among them merges in turn (empty when it is
    not a merge), and the label it was grounded on. The name is delivered with the goal, the rule,
    and the examples the rows drew: it locates the abstraction and returns the person to those
    cases. -/
structure Candidate where
  name       : String
  rule       : String
  reading    : Reading
  merges     : List Reading
  labelBasis : Option String

/-- **Your proposal**, from the first sheet: the working candidate, with every move the person made
    since — a rename, a rule correction, a move to another reading, a merge —, and the ground it
    stands on; where that ground is short, what is short is a point still open (`missing`), yours —
    a row of its own that leaves no case out is such a shortfall: what case would have to be left
    out for the name to say something. Where the person set its reading aside, or every reading is
    set aside, you put forward a candidate on a live reading or on a new reading of your own. Where
    you set the candidate across readings, their merge is a reading of its own, with its row; a
    merge the person makes is already a reading. At a recognition it is the candidate as the
    recognizing turn took it — the sheet's, with the person's changes since; a re-draw of yours is
    not that value. -/
axiom candidate : Context P → Candidate

/-- **Your judgment**, made afresh on every pass: every reading of what the cases share drawn in this
    activation, the readings the person added included. A reading you would no longer hold stays
    here: dropping it is your proposal until the person sets it aside. A merge the person makes is
    a reading; a reading you judge the same across passes keeps its name. A reading the person set
    aside stays here too, out of play. -/
axiom readings : Context P → List Reading

/-- **Your judgment**: the cited turn sets reading `r` aside, on this ground — their reason, carried
    verbatim — whatever form the turn takes. -/
axiom SetAsideSupported : Reading → Context P → Turn P → String → Prop

/-- A reading is set aside only by the person's turn. -/
def setAsideCoord (r : Reading) : Coord P String :=
  { admits := (·.val = .person), supports := SetAsideSupported r }

/-- **Your reading**, on the context as it now stands: the person's setting-aside of `r`; `open_`
    until one reaches it, and again once their later words bring `r` back, never on your proposal
    alone. Their earlier ground stays in the context. -/
axiom setAside : (c : Context P) → (r : Reading) → Occ (setAsideCoord (P := P) r) c

def filledValue {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Option A
  | .open_ _     => none
  | .filled a .. => some a

/-- The readings still in play: a reading leaves only by the person's setting-aside. -/
def live (c : Context P) : List Reading :=
  (readings c).filter (fun r => (filledValue (setAside c r)).isNone)

/-- Every reading the person set aside, with their ground. -/
def setAsideReadings (c : Context P) : List (Reading × String) :=
  (readings c).filterMap (fun r => (filledValue (setAside c r)).map (r, ·))

/-- An example named by a phrase that carries the feature being judged, never by a bare number. -/
structure Example where
  phrase : String
  source : Instance

/-- One row of the cross view: what the reading becomes against the goal — the check it yields —,
    the cases it takes in and those it leaves out, and where the working candidate sits on it. The
    row of the reading the candidate stands on sorts every case of the cases section into taken in
    or left out, except a case the person's words place on the boundary, which it leaves in neither
    list; the other readings' rows carry the cases that separate them, and either of their lists
    may then be empty. -/
structure Row where
  againstGoal   : String
  catches       : List Example
  misses        : List Example
  candidateHere : String

/-- **Your judgment**: the row for reading `r`. Choose examples that separate the goal and the
    readings rather than ones every reading treats alike, drawn from the person's own domain: pair
    the cases that align most readily, not the most distant, since distance is what a separating
    example is for; align what they carry from the cases themselves; and draw a case that tells
    readings apart. A case you draw into a row from the person's domain enters as found by you
    (`found`); a case the person withdrew, or a found case they turned down, is not drawn into a
    row. The examples the last sheet showed stay as it showed them until a move of the person's
    reaches them — a swap, a move of the goal, the candidate, or the reading they cross, a
    correction, a case they brought; an example you would change otherwise is your proposal, not a
    swap. -/
axiom row : Context P → Reading → Row

/-- The cross view: every live reading with its row. -/
def crossView (c : Context P) : List (Reading × Row) := (live c).map (fun r => (r, row c r))

/-- **Your reading** of case `i`: what happened, what in it bears on the goal and the readings, how
    it surfaced, and who brought it. -/
axiom unfoldCase : Context P → Instance → String

/-- Every case the cross view uses. -/
def rowCases (c : Context P) : List Instance :=
  (crossView c).flatMap (fun x => (x.2.catches ++ x.2.misses).map (·.source))

/-- The cases section of the sheet: every case the person brought, every case the cross view uses,
    and every case you found, each once, with its unfolding. -/
def casesSection (c : Context P) : List (Instance × String) :=
  (brought c ++ rowCases c ++ found c).eraseDups.map (fun i => (i, unfoldCase c i))

/-- **Your reading**: the points still open, each in the words of whoever raised it — the person's
    quoted, or yours. -/
axiom missing : Context P → List String

/-- What a run can still owe at its end, tagged by what it is. -/
inductive OpenItem
  | reading (r : Reading)
  | question (q : String)

/-- The live readings the candidate does not take — it takes its own reading and the readings that
    reading merges (`taken`) —, and the points still open. -/
def openItems (c : Context P) (taken : List Reading) : List OpenItem :=
  ((live c).filter (fun r => decide (r ∉ taken))).map .reading ++ (missing c).map .question

/-- **Your judgment**: the cited turn says how open item `i` stands for the person — for later work,
    not blocking, still to settle, whatever it says — and these are its words about it, carried
    verbatim; read against the context as it now stands, whatever form the turn takes. A turn
    that says nothing of the item says nothing here. -/
axiom OpenSupported : OpenItem → Context P → Turn P → String → Prop

/-- Only the person's turn speaks for an open item. -/
def openCoord (i : OpenItem) : Coord P String :=
  { admits := (·.val = .person), supports := OpenSupported i }

/-- **Your reading**: the person's words about item `i` from a turn of theirs that still reaches it;
    `open_` where none does: the item is open — undisposed. -/
axiom openWords : (c : Context P) → (i : OpenItem) → Occ (openCoord (P := P) i) c

/-- The open trace: every open item as `c` stands, with the person's words about it, or `none`
    where no turn of theirs reaches it. -/
def openTrace (c : Context P) (taken : List Reading) : List (OpenItem × Option String) :=
  (openItems c taken).map (fun i => (i, filledValue (openWords c i)))

/-- A line: a value the sheet or the record carries, however it is shown; a value that changes
    makes a new line. -/
abbrev Entry := String

/-- **Your reading**: the lines of the sheet, or at a recognition of the record as you read it, as
    the context now stands — their values; your doubts and the points still open are not among them,
    `dissent` and the open trace carry them. -/
axiom entries : Context P → List Entry

/-- Who first put a value forward — you, the person, or any other source — kept apart from how
    it came to stand. -/
inductive Proposer | ai | person | source

/-- **Your reading**: the position of the turn that first put forward line `e`. A value whose
    content a turn of the person's or of another source put forward, and which you then drew up,
    was put forward by that turn; a case the person singled out from what they pointed you to was
    put forward by the turn of theirs that singled it out. `none` where no turn has put it
    forward. -/
axiom introducedAt : Context P → Entry → Option Nat

def proposer (c : Context P) (e : Entry) : Proposer :=
  match introducedAt c e with
  | none   => .ai
  | some i =>
    match c[i]? with
    | some ⟨.person, _⟩    => .person
    | some ⟨.assistant, _⟩ => .ai
    | some _               => .source
    | none                 => .ai

/-- How a line came to stand on a person's turn: the turn gave it in its own words, or took it as
    a sheet showed it. -/
inductive Standing | set | adopted

/-- **Your judgment**, the record rule: the cited turn makes line `e` stand, read against the
    context as it now stands, on the scope its words reach — the turn gave it in its own words
    (`set`), or took it as a sheet showed it before that turn (`adopted`). A narrow answer stays
    narrow: taking one case's place in a row takes that placement, not the sheet around it. A turn
    that recognizes the abstraction takes every line the sheet it followed showed, with no second
    permission; a line it holds back stays as it stood, and the person's changes since that sheet
    stand in their own words. A turn whose recognition is `Overturned` takes nothing by recognizing.
    A question, a request to see something, or a bare mention makes nothing stand; a value no turn
    of the person's reached stays a proposal, however long it has gone unchallenged. -/
axiom StandingSupported : Entry → Context P → Turn P → Standing → Prop

/-- Only the person's turn makes a value stand. -/
def standingCoord (e : Entry) : Coord P Standing :=
  { admits := (·.val = .person), supports := StandingSupported e }

/-- **Your reading**: the person's turn that first makes line `e` stand and still reaches it; a
    later turn that takes it again leaves how it stood; `open_` while none reaches it. -/
axiom standingOcc : (c : Context P) → (e : Entry) → Occ (standingCoord (P := P) e) c

def standing (c : Context P) (e : Entry) : Option Standing := filledValue (standingOcc c e)

/-- A line with who first put it forward and how it stood; `none` where no turn of the person's
    reached it — still a proposal, by whoever put it forward. -/
structure Provenance where
  entry    : Entry
  proposer : Proposer
  standing : Option Standing

/-- Every line, with who first put it forward and how it stands. -/
def provenanceOf (c : Context P) : List Provenance :=
  (entries c).map (fun e => ⟨e, proposer c e, standing c e⟩)

/-- **Your record**: your doubts, each with what it touches and what it rests on. One raised before
    is raised again only on new evidence. A doubt never refuses a closing: a close carries the
    doubts shown before it — accepted, evidentially disputed. A doubt formed at the recognition is
    recorded as formed then, not among those the close carries. Empty when there were none. -/
axiom dissent : Context P → List String

/-- **Your judgment**: the cited turn — the latest utterance — closes the run: read whole against
    the context as it now stands, whatever form it takes, it recognizes the goal and the candidate,
    as the sheet it followed showed them together with every change the person made since — the
    turn's own included —, as what the person means, with no second permission; such changes do
    not stop the recognition. Holding a line back is not taking it, without saying it is wrong. A
    recognition stands whatever else the turn does — holds back another line, a case's placement
    among them, says something about an open item or raises one, answers a doubt —; holding back
    the goal, the candidate's name or its rule recognizes nothing, nor does the turn with the
    reading the candidate stands on set aside, by it or by a change the person made since that
    sheet. "Not yet" or a question closes nothing; silence, other work, and your own reading that
    the candidate fits close nothing. Where the turn's intent is unclear, it closes nothing. -/
axiom ClosingSupported : Context P → Turn P → Unit → Prop

/-- Only the person closes. -/
def closeCoord : Coord P Unit :=
  { admits := (·.val = .person), supports := ClosingSupported }

/-- **Your reading**: the person's closing; `open_` until one reaches it. -/
axiom closing : (c : Context P) → Occ (closeCoord (P := P)) c

/-- **Your judgment**: the latest utterance bears on this run — a move, a correction, a case, a
    rename, a value taken, words about an open item, an answer to a doubt, a closing, a question
    about the sheet. An utterance about other work leaves the run as it stands. Words that end the
    run without recognizing the abstraction do not bear on it, whatever else the turn says, and
    what else it says stands in its own words in the context: the session answers them, no sheet
    is drawn, the run holds, and later turns bear on it only where they come back to it. Where
    reading a turn as other work or as ending the run was unclear, the session's answer says
    briefly that the run was left as it stands. -/
axiom Reaches : Context P → Prop

/-- Once it has run, the person can name what their cases share, say which cases it takes in and
    which it leaves out, and recognize it as serving their goal.
    `CrystallizedAbstraction`: your reading of the context with the recognizing turn — its goal and
    candidate, its cross view, where the row of the candidate's reading is what the candidate takes
    in and leaves out, its cases, the readings set aside with the person's grounds, the open trace,
    and the doubts — with every line, who proposed it and, where a person's turn reached it, how it
    stood. Whatever you produce at a recognition that the person has not seen — a line re-drawn or
    re-phrased, the goal and the candidate included, a doubt formed on their changes, what you make
    of what collection returns for what their turn brought — stays a proposal, and the recognition
    takes none of it. Where it is read wrong, the person's later words correct it; the context as
    it then stands is what is read. It records the person's settlement for their goal, not proof
    that the reading is correct. -/
structure CrystallizedAbstraction (P : Type) where
  context    : Context P
  goal       : String
  candidate  : Candidate
  crossView  : List (Reading × Row)
  cases      : List (Instance × String)
  setAside   : List (Reading × String)
  openTrace  : List (OpenItem × Option String)
  dissent    : List String
  provenance : List Provenance

inductive Outcome (P : Type)
  | notActivated (c : Context P) (why : String)
  | crystallized (r : CrystallizedAbstraction P)
  | holding      (c : Context P)

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it. No gate, stage, or
count is stored: each sheet is judged afresh from the whole context.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
A step is one arm of a structural recursion over the person's utterances. A pass is the silent
work: what is collected enters the context. A closing is read from the person's turn before
anything is collected. `respond` presents the sheet; `session` is the session's own answer to an
utterance that does not bear on the run, which stays in the context without opening collection;
`converge` is the closing declaration of the trace, as TOOL GROUNDING's `converge` entry names it.
-/

/-- **Your reads**, as far as the session can reach without changing existing state. One collection
    at the start reads what the admission reading needs — where fewer than two cases or no essence
    are in hand, the session and the person's artifacts searched for cases — and, where the case
    reads as this protocol's, what the first sheet needs; later ones run on each turn that bears on
    the run. A sheet needs cases and examples in the person's own material — the cases' own
    context by artifact read and search, examples from the person's domain, and an external fetch
    where that domain lies outside their artifacts. What you say you read, you read whole. What
    was reached and what was not, with what each unreached source would need, are named; where
    collected material conflicts, what conflicts with what; what stays open is the person's
    unknown. A case collection turns up that you bring to the sheet enters as found by you
    (`found`). -/
axiom collect : Context P → List (Evidence P)

def pass (c : Context P) : Context P := c ++ (collect c).map (·.val)

/-- **Your judgment**: what collection has put anywhere in the context holds a case no sheet has
    shown and no turn of the person's brought that would decide against the candidate the
    recognizing turn recognized; where it does, the turn recognizes nothing. -/
axiom Overturned : Context P → Prop

/-- The crystallized abstraction: every view read on `c`, the context with the recognizing turn and
    what collection returned for it. The context ends in the declaration. -/
def crystallize (converge : Context P → Response P) (c : Context P) :
    CrystallizedAbstraction P :=
  { context := c ++ [(converge c).val], goal := goal c, candidate := candidate c,
    crossView := crossView c, cases := casesSection c, setAside := setAsideReadings c,
    openTrace := openTrace c ((candidate c).reading :: (candidate c).merges),
    dissent := dissent c,
    provenance := provenanceOf c }

open Classical in
/-- `respond` presents the sheet the Protocol section describes under "The sheet": the candidate
    as `candidate` gives it, the cross view (`crossView`), and the cases of `casesSection`. A
    recognition is the person's closing, filled, citing the latest utterance; it crystallizes
    unless the context, with what collection returns for it, is `Overturned`. -/
def induce (respond session converge : Context P → Response P) :
    Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let c' := fuse c u
    if ¬ Reaches c' then induce respond session converge (c' ++ [(session c').val]) us
    else
      let latest : Bool := match closing c' with
        | .filled _ src _ _ => decide (src.idx + 1 = c'.length)
        | .open_ _          => false
      let c₁ := pass c'
      if latest ∧ ¬ Overturned c₁ then .crystallized (crystallize converge c₁)
      else induce respond session converge (c₁ ++ [(respond c₁).val]) us

def start (respond session converge : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  let c₁ := pass c
  match notActivated c₁ with
  | some why => .notActivated c₁ why
  | none     => induce respond session converge (c₁ ++ [(respond c₁).val]) us

/-! ── CONVERGENCE ──
crystallized — the one closing of `Outcome`, the person's; the trace it carries is its structure's
fields. notActivated and holding are not closings: the first is your reading before any sheet, the
second a sheet no turn of the person's that bears on the run has answered. The convergence
evidence: the turn read as the closing, in its own words, with the goal and the candidate it
recognized.
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

inductive Op | detect | collect | judge | sheet | readTurn | declare | converge | seam

def grounding : Op → Annot × String
  | .detect   => (.sense, "Internal analysis: whether this is the protocol's case, as `notActivated` reads it, over the utterance and the context")
  | .collect  => (.observe, "artifact read, artifact search; external fetch (conditional: the domain lies outside the person's artifacts), its URL cited where used: what `collect` reads, as its doc states")
  | .judge    => (.sense, "Internal analysis: the whole run afresh against the whole context")
  | .sheet    => (.interaction .constitution, "the sheet the Protocol section describes under \"The sheet\", every turn that bears on the run and does not close it, the first included")
  | .readTurn => (.sense, "Internal analysis: whether the latest utterance bears on this run and what it does there — a move, a value taken, a reading set aside or brought back, words about an open item, a closing — read whole against the fused context as it now stands, as `Reaches`, `ClosingSupported`, `Overturned`, `SetAsideSupported`, `StandingSupported`, and `OpenSupported` read it")
  | .declare  => (.interaction .extension, "before activation, on an invocation only — AI-guided activation stays silent —, your `notActivated` reading in plain words with its basis, and what was searched")
  | .converge => (.interaction .extension, "at a crystallization, the convergence evidence CONVERGENCE names: the closing turn quoted beside the trace and the dissent")
  | .seam     => (.interaction .extension, "after a crystallization or not activating, the next move only from a chain the person declared, a routing policy they adopted, or their grant, citing that source; every Constitution gate inside this protocol and the next fires unchanged")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
-/

end

end Periagoge
```

## Mode Activation

`/induce` remains directly invocable, and an invocation is read through `notActivated` before any sheet, and a reading that it is not this protocol's case is said in plain words with its basis; AI-guided activation stays silent and follows the same reading. A named abstraction whose meaning is being reconsidered from its cases is in process; applying a fixed meaning to a disputed case is not.

Bind the seed from an explicit argument first, then the most recent cluster of cases, then a surfaced essence. On an invocation, where no essence is sensed, show what was searched and invite the user to name what feels in process; where no second case is found, say what was searched and invite one. Prior-session recall may seed examples or neighbouring abstractions but never settles crystallization.

## Protocol

### The sheet

Every sheet is in everyday language. Mark each value on the sheet as set by the user's words, taken by them from what you showed, or still a proposal, marked with who put it forward. Each sheet opens with any case you found since the last sheet, marked as found by you, so the user meets it before their next turn; a found case stays yours until the user's words take it up.

Then the goal: what the abstraction is for. Where the user has said it, quote their words; otherwise give your reading. Under it, the working candidate — a name and a rule — from the first sheet, with the ground it stands on and, where that ground is short, what is short beside it as a point still open — a row of its own that leaves no case out is such a shortfall, shown with what case would have to be left out for the name to say something —, always on a reading still in play: where the user sets that reading aside, or every reading is set aside, put forward one on a live reading or on a new reading of your own, its weak ground shown. Both move: the run's work is moving the goal and the candidate until the abstraction matches what the user means.

Then the cross view, one row per live reading, a merge you drew beside the readings it merges. Each row says what the reading becomes against the goal — the check it would give you — which of the cases shown it takes in and which it leaves out, and where the candidate sits on that reading; the candidate's own row places every case on the sheet, except one the user's words put on the boundary, which it neither takes in nor leaves out, and the sheet shows that case with their words. Name every case by a short phrase that carries the feature being judged, and mark a case new to the sheet as new. Then a cases section: every case the user brought, every case the rows use, and every case you found, unfolded in a few lines — what happened, what in it bears on the goal and the readings, how it surfaced, who brought it — so every case is read on the sheet itself. A sheet whose move invites recognition unfolds every case on it; elsewhere, unfold a new or changed case again, and an unchanged one may be folded as the same as the last sheet. Collect as widely as the judgment needs, and show what stays open after it as the user's unknown; the sheet carries what the current judgment needs, and a case that would decide it against the candidate is never left off. The readings the user set aside appear beside their own words when they change and when reconsidering needs them. Label each field with the question it answers, in the user's words, and say each term this file uses as the concrete question it stands for in the user's material. Draw the fields with the structure the host renders — headings, tables, lists.

Under the sheet, where the user asked about the sheet, answer it there first; then what changed since the sheet the user last answered: the user's moves first, then what you re-drew because of them and anything else that moved, each marked as forced by a move of theirs or as your proposal. A reading you would no longer hold stays in the cross view until the user sets it aside; dropping it is your proposal, shown here and among your doubts. The examples the last sheet showed stay as it showed them until a move of the user's reaches them; an example you would change otherwise is likewise a proposal here. Then your doubts, each beside what it bears on, with what it rests on and the user's answer where they gave one; a doubt is raised again only on new evidence. A reading that the cases are no longer this protocol's to settle is shown the same way, with its basis, and closes nothing. Then the points still open, each in the words of whoever raised it — the user's quoted, yours marked as yours.

Then one move to ask about, in words — the one whose answer would most change how goal and readings cross — and what each way of answering does to the goal and the candidate. Where every reading drawn so far was set aside, say so with the grounds shown, beside the candidate you put forward on a new reading, and ask whether to name a distinction the readings missed, read another set of cases, or move the goal. Invite recognition only where the candidate fits the goal on every case shown, as the concrete question whether the goal and the candidate, as this sheet shows them, are what the user means, never by naming the act; where a case could still separate it, ask about that case first. Recognizing the abstraction and stopping stay open on every sheet.

The user may answer in their own words, and one answer may reach several parts of the sheet: read it whole, apply it as far as its words reach, leave what it does not reach as it stood, and show what a correction disturbs. A turn that takes something you showed — a case's place, the goal, the rule — makes it theirs then, on the scope its words reach; a narrow answer stays narrow. An utterance about other work leaves the run as it stands, and words that end the run without recognizing the abstraction leave it holding, whatever else the turn says; neither draws a sheet, and the sheet returns when the user comes back to it. A reading leaves the cross view only by the user's words setting it aside, and comes back when their words bring it back, with their earlier ground shown beside it. Only the user closes the run, by recognizing the goal and the candidate as the sheet they answered showed them and as they changed them since, with no second permission and your doubts riding along without refusing it; where a turn that bears on the run recognizes nothing by the closing judgment in the block above (`ClosingSupported`), or what you have collected holds a case no sheet has shown and no turn of the user's brought that would decide against the candidate it recognized (`Overturned`), draw the sheet again with every change no sheet has shown yet, that case among them.

At a recognition, before proceeding, quote the recognizing turn and declare beside it the trace as you read it on the context with that turn, said to be your reading — first what changed since the sheet the recognition answered: the user's moves, and what you produced at the recognition that they have not seen, marked as yours; then the goal and who set it; the candidate, with what its reading's row takes in and leaves out, and a case on the boundary with the user's words; the cross view; every case unfolded, folded on that sheet or not, with who brought it; the readings set aside with the user's grounds; every line with who proposed it and, where a turn of the user's reached it, how it stood; the doubts, the user's answers to them standing in their own turns, quoted; and the open trace. The open items are the live readings the candidate does not take and the points still open, those the recognizing turn raised included; each carries the user's own words about it from a turn of theirs that still reaches it, and an item no such turn reaches is shown as open — undisposed. After a recognition, go on only to a next move the user declared, a routing policy they adopted, or their grant, citing it.

Read `references/round-composition.md` before composing when terminology must remain stable, wording must be carried unchanged, material belongs to another round or trace, or the order of the sheet bears on where a sentence sits.

## Rules

- **Recognition over Recall**: Present the sheet and one move with anticipatable consequences, and yield for the user's judgment.
- **Goal and candidate first, tested against each other**: Lead every sheet, after any case you found, with the goal and the working candidate, any shortfall in its ground shown beside it, and test the candidate against the goal through the cases each row takes in and leaves out. The goal and the alternatives beside the candidate are what keep the user's judgment their own.
- **Only the user closes**: The run closes only on the user's recognition of the sheet they followed, with the changes they made since. Words that end the run without recognizing the abstraction leave it holding.
- **Round composition**: Compose each round in everyday language, keep each judgment beside its evidence and next-move implication, and place analysis before the move.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change the form directly. Elements fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
