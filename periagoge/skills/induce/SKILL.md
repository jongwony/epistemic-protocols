---
name: induce
description: "Crystallize a shared but unnamed concept from the concrete cases at hand. Type: (AbstractionInProcess, AI, INDUCE, A) → CrystallizedAbstraction"
---

# Periagoge Protocol

Crystallize in-process abstraction by aligning concrete cases first and naming last, with the live alternative readings held visible throughout. Type: `(AbstractionInProcess, AI, INDUCE, A) → CrystallizedAbstraction`.

## Definition

**Periagoge** (περιαγωγή): A dialogical act of turning an in-process abstraction toward its crystallized form, where AI detects when an instance set has converged toward an unnamed essence, puts the two most alignable cases side by side with the correspondence they carry, extracts the invariant relation that correspondence carries together with the readings it leaves open, probes those open readings apart against further cases and near-misses the user judges, and only then proposes a name and rule for what survived — so the abstraction is located by the correspondences the user recognized and the verdicts the user gave rather than steered from a candidate offered ahead of them (the Greek dialectical vocabulary supplies the source terms).

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
  start: bind the seed — an explicit argument, else the most recent cluster of cases, else a
    surfaced essence; where fewer than two cases are in hand or no essence is sensed, scan the
    session and the person's artifacts → [no in-process abstraction: relay → not activated]
  pass(c): read what the run needs — the cases' own context, probe material from the person's
    domain — then judge the whole run afresh against the context as it now stands: the cases and
    who brought each, the correspondence and who set each slot, the relation, the live readings,
    the readings the person ruled out with their words, the probe record and the boundary, the
    naming where it may be shown, the ledger, your contrary grounds, and one focus → record
  present the sheet, with any case you found at its head → Stop
  next utterance u: c' := fuse(c, u) →
    [u bears on nothing in this run]                 the sheet holds, not presented again
    otherwise c₁ := pass(c') →
    [the person stops]                               withdrawn
    [the person goes on to a protocol they name]     routed
    [the person confirms the naming ∧ it may be shown ∧ covered]   crystallized
    [otherwise] the sheet again, with the ledger of what u changed → Stop
  no utterance: the sheet holds; nothing is judged, named, disposed, or closed
-/

/-! ── MORPHISM ──
A
  → detect(instances, essence, label)      -- an essence sensed whose name, scope, or position is unsettled, and two cases to correspond
  → pair(instances, essence)               -- the two cases that align most readily
  → align(pair, slots)                     -- the correspondence filled from the cases; the person corrects what is wrong
  → extract(correspondence)                -- the invariant relation, plus the readings the correspondence leaves live
  → probe(readings, instances)             -- a case that separates live readings rather than confirming the leading one
  → judge(probe, reading)                  -- per reading, the person's verdict: ruled out, bounded, or undecided
  → name(readings, relation, label, record) -- name + rule, read off the surviving reading and the probe record, once it may be shown
  → confirm(person)                        -- the person confirms the naming with everything it rests on in view
  → CrystallizedAbstraction
requires: in_process(A)                     -- judged at activation
deficit:  AbstractionInProcess              -- activation precondition
preserves: instance_set(A)                  -- the cases are read, never rewritten; a case you found is shown as yours
invariant: Correspondence Before Naming through Maintained Alternatives over Single-Candidate Steering
invariant: a ruling-out, an open item's disposition, and every closing are the person's; your readings settle none of them
The steps between detect and confirm are how you work toward the essence; the contract fixes the
deficit and its resolution, the coordinates only the person fills, the closings, and the one
ordering the anti-anchoring guard needs: no name is shown before a correspondence and a probe the
person judged.
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

/-- `A`, `AbstractionSeed`: the in-process state — the instances, the essence intuition, and any
    provisional name the person gave. Read from the context. -/
abbrev AbstractionSeed (P : Type) := Context P

/-- A concrete case: what it is, and where it sits. -/
structure Instance where
  content : String
  context : String

/-- **Your judgment**: an essence is sensed whose name, scope, or position is still unsettled, and
    at least two concrete cases can correspond. An abstraction already located — one awaiting
    comparison or validation — is not in process, and a pair of cases and essence this session
    already crystallized or withdrew stays inactive. -/
axiom inProcess : Context P → Prop

/-- **Your reading** of the context: the cases the run works from, as it now stands — those the
    person brought and those you found. Read, never rewritten. -/
axiom instances : Context P → List Instance

/-- **Your record**: the cases you found that the person's words have not yet taken up. The next
    sheet opens with them, marked as found by you, so the person sees them before their next turn;
    they never join the cases silently. -/
axiom found : Context P → List Instance

/-- **Your reading**: the essence intuition `E`, the variation-stable core the conversation
    signals. Where a routed colimit-shaped signal seeded it, it is that detection's reading, shown
    as yours until the person's own words take it up. -/
axiom essence : Context P → String

/-- **Your reading**: the provisional name or concept the person gave, if any. It grounds the name
    and its provenance without fixing either. -/
axiom label : Context P → Option String

/-- `inSecond` is `none` exactly where the second case carries no counterpart; filling it reads off
    the cases rather than choosing between readings, which probing separates. -/
structure Slot where
  role     : String
  inFirst  : String
  inSecond : Option String

/-- `M`: the correspondence between the two paired cases. -/
structure Correspondence where
  slots : List Slot

/-- What one case carries and the other does not: evidence, not failure. -/
def unmatched (m : Correspondence) : List String :=
  (m.slots.filter (fun s => s.inSecond.isNone)).map (·.role)

/-- **Your judgment**: every correspondence drawn in this activation, in order, the one that now
    stands last — the pair, the readiest alignment and not the most distant, since distance is what
    probing is for; or the partner the person named; every slot filled from what the cases
    themselves carry, with the person's corrections in place, a correction that a case carries no
    counterpart included. A correction reaches the slot its words reach. A correspondence left
    behind by a new partner stays in the list. -/
axiom correspondences : Context P → List Correspondence

/-- The correspondence that now stands; `none` before one is drawn. -/
def correspondence (c : Context P) : Option Correspondence := (correspondences c).getLast?

/-- One reading of what the correspondence carries. -/
abbrev Reading := String

/-- `R`: the invariant relation, citing the slots it reads off. -/
structure Relation where
  statement : String
  carriedBy : List Slot

/-- **Your reading**: the relation over the correspondence as it stands; your extraction, grounding
    nothing. -/
axiom relation : Context P → Option Relation

/-- A probe case and the live readings it tells apart. -/
structure ProbeCase where
  content   : String
  separates : List Reading

/-- **Your record**: every probe case you presented in this activation, in order, each separating at
    least one reading live when it was drawn. A case the person corrected is drawn again with the
    correction taken up. -/
axiom probes : Context P → List ProbeCase

/-- One reading judged against one probe case. `ground` is the person's reason, carried verbatim. -/
inductive Verdict
  /-- the case breaks the reading: it leaves the live set, with this ground -/
  | refutes (ground : String)
  /-- the case lies outside what the reading claims: the reading survives, bounded -/
  | bounds (ground : String)
  | undecided

/-- **Your judgment**: the cited turn gives reading `r` this verdict against probe `p`, whatever form
    the turn takes. The readings a probe separates are answered against each other. -/
axiom VerdictSupported : ProbeCase → Reading → Context P → Turn P → Verdict → Prop

/-- A verdict is given only by the person's turn. -/
def verdictCoord (p : ProbeCase) (r : Reading) : Coord P Verdict :=
  { admits := (·.val = .person), supports := VerdictSupported p r }

/-- **Your reading**: the person's verdict on reading `r` against probe `p`; `open_` until one
    reaches it. -/
axiom verdict : (c : Context P) → (p : ProbeCase) → (r : Reading) → Occ (verdictCoord (P := P) p r) c

def isFilled {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Bool
  | .open_ _   => false
  | .filled .. => true

def filledValue {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Option A
  | .open_ _     => none
  | .filled a .. => some a

/-- The probes the person judged: every reading the probe separates carries the person's verdict,
    an explicit undecided included. -/
def judged (c : Context P) : List ProbeCase :=
  (probes c).filter (fun p => !p.separates.isEmpty && p.separates.all (fun r => isFilled (verdict c p r)))

/-- Every reading the person ruled out, with the probe and their ground. -/
def ruledOut (c : Context P) : List (Reading × ProbeCase × String) :=
  (probes c).flatMap (fun p => p.separates.filterMap (fun r =>
    match filledValue (verdict c p r) with
    | some (.refutes g) => some (r, p, g)
    | _ => none))

/-- **Your judgment**, made afresh on every pass: every reading of what the correspondence carries
    drawn in this activation, the readings the person added included. A reading you would no longer
    hold stays here: dropping it is your proposal, shown in the ledger and among your contrary
    grounds, until the person rules it out. A reading you judge the same across passes keeps its
    name. -/
axiom readings : Context P → List Reading

/-- **Your judgment**: the person's later words name reading `r` again after ruling it out; it
    returns with the ground that ruled it out shown beside it. -/
axiom Reopened : Context P → Reading → Bool

/-- The person ruled `r` out. -/
def refuted (c : Context P) (r : Reading) : Bool := (ruledOut c).any (fun x => decide (x.1 = r))

/-- The readings not yet decided between: a reading leaves only by the person's refuting verdict,
    and returns only by their words. -/
def live (c : Context P) : List Reading :=
  (readings c).filter (fun r => !refuted c r || Reopened c r)

/-- Every case the person placed outside a surviving reading's claim, with their ground. -/
def boundary (c : Context P) : List (ProbeCase × String) :=
  (probes c).flatMap (fun p => p.separates.filterMap (fun r =>
    match filledValue (verdict c p r) with
    | some (.bounds g) => if r ∈ live c then some (p, g) else none
    | _ => none))

/-- A resource bound on the person's attention, not a sufficiency criterion: it limits the probes
    you draw on your own, never the run. -/
def maxProbes : Nat := 5

/-- The probes the person judged have reached the bound. -/
def CapReached (c : Context P) : Prop := maxProbes ≤ (judged c).length

/-- One distinct live reading. -/
def Settled (c : Context P) : Prop := (live c).eraseDups.length = 1

/-- A name may be shown: a correspondence stands, the person judged a probe, and one reading is
    left or your bound is reached with readings still live. A name shown earlier would condition
    every later judgment on its own vocabulary. -/
def Showable (c : Context P) : Prop :=
  (correspondence c).isSome ∧ judged c ≠ [] ∧ (Settled c ∨ (CapReached c ∧ live c ≠ []))

/-- `(N, Rule)`: the name and rule, the live reading the rule was read off, and the label it was
    grounded on. -/
structure Naming where
  name       : String
  rule       : String
  reading    : Reading
  labelBasis : Option String

/-- **Your proposal**: the naming, with every rename and rule correction the person made since. -/
axiom proposal : Context P → Option Naming

open Classical in
/-- The naming the sheet shows: the proposal, once a name may be shown and its rule is read off a
    reading still live. -/
def shownNaming (c : Context P) : Option Naming :=
  if Showable c then (proposal c).filter (fun n => decide (n.reading ∈ live c)) else none

/-- **Your reading**: what the person said is still missing, each point in their words. -/
axiom missing : Context P → List String

/-- What a run can still owe at its end, tagged by what it is. -/
inductive OpenItem
  | reading (r : Reading)
  | role (r : String)
  | question (q : String)

/-- The live readings the rule did not take, the unmatched roles, and what the person said is still
    missing. -/
def openItems (c : Context P) (named : Option Reading) : List OpenItem :=
  ((live c).filter (fun r => decide (some r ≠ named))).map .reading ++
  ((correspondences c).flatMap unmatched).eraseDups.map .role ++
  (missing c).map .question

inductive OpenDisposition
  | nonblocking
  | deferred
  deriving DecidableEq  -- elab: lets `status` compare dispositions

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

inductive TraceStatus | none_ | nonblocking | deferred | undisposed

def status (c : Context P) (items : List OpenItem) : TraceStatus :=
  if items.isEmpty then .none_
  else if items.any (fun i => decide (filledValue (disposition c i) = some .deferred)) then .deferred
  else if items.any (fun i => (filledValue (disposition c i)).isNone) then .undisposed
  else .nonblocking

/-- A line of the sheet, named as the sheet shows it — a case, a slot, a reading, the name, the
    rule. -/
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

/-- How a value came to stand: the person's turn set it, or a confirm adopted yours. -/
inductive Standing | set | adopted

/-- **Your reading**: the person's turn set what `e` holds now — brought it, corrected it, or named
    it — on the scope their words reach. -/
axiom setByPerson : Context P → Entry → Bool

def standing (c : Context P) (e : Entry) : Standing := if setByPerson c e then .set else .adopted

structure Provenance where
  entry    : Entry
  proposer : Proposer
  standing : Standing

def provenance (c : Context P) : List Provenance :=
  (entries c).map (fun e => ⟨e, proposer c e, standing c e⟩)

/-- What a ledger line records. -/
inductive LedgerKind
  /-- the person's own edit or verdict -/
  | personEdit
  /-- a value you re-drew because an edit forces it -/
  | necessary
  /-- a value you re-drew, a case you found, or a reading you dropped, because you propose it -/
  | proposal

/-- One change since the last sheet. -/
structure LedgerLine where
  change : String
  cause  : Option Entry
  kind   : LedgerKind

/-- **Your record**: what the latest turn changed, the person's edits and verdicts first; a round
    that ruled no reading out says so, and which readings were bounded and which left
    undecided. -/
axiom ledger : Context P → List LedgerLine

/-- The one question a sheet asks. -/
inductive Focus
  /-- the correspondence, where it is new or corrected -/
  | correspondence
  /-- a probe case, with every reading it separates -/
  | probe (p : ProbeCase)
  /-- the naming to confirm -/
  | naming
  /-- every reading drawn so far was ruled out: name a missing distinction, align another pair, or
      stop -/
  | exhausted

/-- **Your selection** of the focus. For a probe, the case that best tells the live readings apart
    rather than the one that fits the leading reading, drawn from the person's own domain and seeded
    by what the person said is still missing; a case that separates nothing is not a probe. -/
axiom selectFocus : Context P → Focus

/-- **Your judgment**: the person's words ask for another probe. -/
axiom ProbeRequested : Context P → Prop

open Classical in
/-- The focus the sheet shows. Once your bound is reached, you draw no further probe on your own:
    the focus turns to the naming, or to the exhausted readings where none is live, unless the
    person asked for another probe. -/
def focus (c : Context P) : Focus :=
  match selectFocus c with
  | .probe p =>
    if CapReached c ∧ ¬ ProbeRequested c then (if live c = [] then .exhausted else .naming)
    else .probe p
  | f => f

/-- **Your record**: the contrary grounds you showed before the person's answers — a reading the
    probe record does not bear, a rule the boundary contradicts, a case you would weigh otherwise —
    attached to the closing when the person closes over them; empty when there were none. -/
axiom dissent : Context P → List String

/-- How the person ends the run. -/
inductive Closing
  /-- confirm the naming as the sheet shows it -/
  | confirm
  /-- stop here -/
  | stop
  /-- go on to the protocol the person names -/
  | route (target : String)

/-- **Your judgment**: the cited turn closes the run this way, read against the context as it now
    stands, the order of its turns included: a closing said before a later sheet was presented was
    answered by that sheet, so a confirm reaches only the sheet it followed. Whatever form the turn
    takes, a verdict, a correction, or a rename closes nothing; "not yet" keeps the run open. -/
axiom ClosingSupported : Context P → Turn P → Closing → Prop

/-- Only the person closes. -/
def closeCoord : Coord P Closing :=
  { admits := (·.val = .person), supports := ClosingSupported }

/-- **Your reading**: the person's closing; `open_` until one reaches it. -/
axiom closing : (c : Context P) → Occ (closeCoord (P := P)) c

/-- **Your judgment**, the adoption condition: everything a confirm would take was shown on a sheet
    the person answered — the name and rule, the boundary, the readings the rule does not take,
    every case with who brought it, every slot with who set it — together with your contrary
    grounds. Where anything would be taken unseen, the sheet is drawn again. -/
axiom Covered : Context P → Prop

/-- **Your judgment**: the latest utterance bears on this run — a verdict, a correction, a case, a
    rename, a closing, a question about the sheet. An utterance about other work leaves the run as
    it stands. -/
axiom Reaches : Context P → Prop

/-- `CrystallizedAbstraction`: the person's confirm over a naming that may be shown, covered. -/
structure CrystallizedAbstraction (P : Type) where
  context    : Context P
  naming     : Naming
  boundary   : List (ProbeCase × String)
  ruledOut   : List (Reading × ProbeCase × String)
  openTrace  : List OpenItem
  dissent    : List String
  provenance : List Provenance

/-- What a run established when the person stops it or goes elsewhere, so a later run resumes from
    it; the relation and live readings stand as your extraction. -/
structure Withdrawn (P : Type) where
  context   : Context P
  ruledOut  : List (Reading × ProbeCase × String)
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
    the session context and the person's artifacts scanned for cases that could correspond. -/
axiom scan : Context P → List (Evidence P)

/-- **Your reads** for a pass: the cases' own context by artifact read and search, probe material
    from the person's domain, and an external fetch where that domain lies outside their
    artifacts. -/
axiom collect : Context P → List (Evidence P)

/-- **Your record** of a pass, once its reads have entered the context: the run as judged — the
    cases, the correspondence, the relation, the live and ruled-out readings, the probe record and
    the boundary, the naming where it may be shown, provenance, the ledger, your contrary grounds,
    and the focus. A record grounds nothing. -/
axiom passRecord : Context P → List (Response P)

def pass (c : Context P) : Context P :=
  let c₁ := c ++ (collect c).map (·.val)
  c₁ ++ (passRecord c₁).map (·.val)

/-- The crystallized abstraction; the context ends in the declaration. -/
def crystallize (declare : Context P → Response P) (c : Context P) (n : Naming) :
    CrystallizedAbstraction P :=
  { context := c ++ [(declare c).val], naming := n, boundary := boundary c,
    ruledOut := ruledOut c, openTrace := openItems c (some n.reading), dissent := dissent c,
    provenance := provenance c }

/-- What the run established; no rule was taken, so every live reading stays open. -/
def withdraw (declare : Context P → Response P) (c : Context P) : Withdrawn P :=
  { context := c ++ [(declare c).val], ruledOut := ruledOut c, openTrace := openItems c none,
    dissent := dissent c }

open Classical in
/-- `respond` presents the sheet: first any case you found, marked as yours; then the cases with
    who brought each, the correspondence with every slot and who set it and every unmatched role,
    the relation, the live readings each with what supports it and the case that breaks it, the
    ruled-out readings each beside the person's ground, the probe record and the boundary, and the
    naming where it may be shown — each value marked the person's or yours, each field labelled by
    the question it answers in the person's everyday words. Then the ledger, the person's edits
    first. Then your contrary grounds. Then the focus (`focus`): for a probe, every reading it separates on
    screen together with its own verdict slot and what each verdict does, and what the live set
    becomes on each way the round can close; once your bound is reached, that you draw no further
    probe on your own. -/
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
        match shownNaming c₁ with
        | some n =>
          if Covered c₁ then .crystallized (crystallize declare c₁ n)
          else induce respond declare (c₁ ++ [(respond c₁).val]) us
        | none => induce respond declare (c₁ ++ [(respond c₁).val]) us
      | none => induce respond declare (c₁ ++ [(respond c₁).val]) us

open Classical in
def start (respond declare : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  let c₁ := c ++ (scan c).map (·.val)
  if ¬ inProcess c₁ then .notActivated c₁
  else
    let c₂ := pass c₁
    induce respond declare (c₂ ++ [(respond c₂).val]) us

/-! ── LOOP ──
Every sheet re-judges the whole run against the whole context: nothing counts down, no gate is
entered, and no answer waits for a later gate. A correction reaches what its words reach — one
slot, one probe case, the rule — and you re-draw what depends on it, the ledger saying which
re-draws are forced and which you propose. A verdict on a reading, a correction, a rename, and a
new case are all turns of the same kind. The loop is dialogue: each sheet ends at the focus, and
the person ends the run.
-/

/-!
Silence judges, names, disposes of, and closes nothing.
theorem silence (respond declare : Context P → Response P) (c : Context P) :
    induce respond declare c [] = .holding c

A pass only adds to the context.
theorem pass_extends (c : Context P) : ∃ t, pass c = c ++ t

A crystallization is the person's confirm over a naming that may be shown, with everything it
takes in view.
theorem crystallized_on_confirm (respond declare : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (r : CrystallizedAbstraction P)
    (h : induce respond declare c us = .crystallized r) :
    ∃ c₁ : Context P, filledValue (closing c₁) = some .confirm ∧ shownNaming c₁ = some r.naming ∧
      Showable c₁ ∧ Covered c₁ ∧ r = crystallize declare c₁ r.naming

A withdrawal is the person's stop, and a route the protocol the person named.
theorem withdrawn_on_stop (respond declare : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (r : Withdrawn P) (h : induce respond declare c us = .withdrawn r) :
    ∃ c₁ : Context P, filledValue (closing c₁) = some .stop ∧ r = withdraw declare c₁

theorem routed_on_route (respond declare : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (t : String) (r : Withdrawn P)
    (h : induce respond declare c us = .routed t r) :
    ∃ c₁ : Context P, filledValue (closing c₁) = some (.route t) ∧ r = withdraw declare c₁

Every closing rests on a turn the person sent.
theorem closed_by_person (c : Context P) (k : Closing) (h : filledValue (closing c) = some k) :
    ∃ s : Cite c, s.src.val = .person ∧ (c[s.idx]'s.lt).origin = .person

A name is shown only once a correspondence stands and the person judged a probe.
theorem proposal_only_when_showable (c : Context P) (n : Naming) (h : shownNaming c = some n) :
    Showable c

Once the person judged as many probes as the bound, the sheet asks about no further probe unless
the person asked for one.
theorem cap_bounds_probes (c : Context P) (h : CapReached c) (hr : ¬ ProbeRequested c)
    (p : ProbeCase) : focus c ≠ .probe p

A reading leaves the live set only by the person's refuting verdict.
theorem live_leaves_only_by_refutes (c : Context P) (r : Reading) (hr : r ∈ readings c)
    (hn : r ∉ live c) : refuted c r = true

A verdict and an open item's disposition each rest on the person's turn.
theorem verdict_by_person {c : Context P} {p : ProbeCase} {r : Reading} {s : Cite c}
    (ok : (verdictCoord (P := P) p r).admits s.src) : s.src.val = .person

theorem disposed_by_person {c : Context P} {i : OpenItem} {s : Cite c}
    (ok : (dispositionCoord (P := P) i).admits s.src) : s.src.val = .person
-/

/-! ── CONVERGENCE ──
crystallized: the person confirmed a naming that may be shown, with everything it takes in view.
The confirm adopted what you proposed and the sheet showed; it established nothing about whether a
reading you never drew was the right one, and a contrary ground it was taken over rides the
closing as dissent. withdrawn: the person stopped. routed: the person named the next protocol.
Convergence evidence, at either end: the correspondence slot by slot with who set each slot, each
probe with the verdict every separated reading received, the naming the run ended on if any, the
boundary, every ruled-out reading beside the person's ground so the surviving reading is seen to
have won, every case with who brought it, and the open trace — each item of `openItems` with its
disposition, an item no turn covered shown as undisposed — with `status`. At a withdrawal the
relation and the live readings stand as your extraction. Demonstrated, not asserted.
-/

/-! ── TOOL GROUNDING ── -/
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed

inductive Annot | sense | observe | track | transform | dispatch | constitution | extension

inductive Op | detect | scan | absorb | collect | judge | record | sheet | readTurn | declare
             | converge | seam

def grounding : Op → Annot × String
  | .detect   => (.sense, "Internal analysis: the deficit judged over the utterance and the context; no external tool")
  | .scan     => (.observe, "artifact read, artifact search (conditional: fewer than two cases in hand, or no essence sensed): the session context and the person's artifacts scanned for cases that could correspond; what was searched is said where nothing was found")
  | .absorb   => (.extension, "TextPresent+Proceed: a routed colimit-shaped signal accepted as activation ground, its cited essence-and-locator basis shown as the routing detection's reading")
  | .collect  => (.observe, "artifact read, artifact search: the cases' own context and probe material from the person's domain; external fetch (conditional: that domain lies outside the person's artifacts), its URL cited where it is used")
  | .judge    => (.sense, "Internal analysis: the whole run afresh against the whole context — the cases and who brought each, the correspondence, the relation, the live readings, the probe to draw, the naming where it may be shown, and your contrary grounds; a person's correction stands on the scope their words reach")
  | .record   => (.track, "record: the pass's record of the run as judged, the ledger, and the focus")
  | .sheet    => (.constitution, "present: any case you found, first and marked as yours; the whole run on one sheet, each value marked the person's or yours; the ledger; your contrary grounds; then one focus — the correspondence, a probe with every reading it separates and each reading's verdict slot, or the naming (mandatory)")
  | .readTurn => (.sense, "Internal analysis: the new turn and every earlier turn of the person's it bears on, read against the fused context as it now stands — whether it bears on the run at all, a verdict, a correction and its scope, a case, a rename, a closing — whatever form it takes")
  | .declare  => (.extension, "TextPresent+Proceed: at a withdrawal or a route, the trace and the open trace, with the relation and live readings as your extraction, and the dissent; what a later run resumes from")
  | .converge => (.extension, "TextPresent+Proceed: at a crystallization, the trace, the boundary, every ruled-out reading beside its ground, every case with who brought it, the open trace, and the dissent; proceed with the crystallized abstraction")
  | .seam     => (.extension, "TextPresent+Proceed: at a chain the person declared, naming the next protocol, proceed to it citing that turn; this protocol declares no outbound edge, and every Constitution gate inside it and the next fires unchanged")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
-/

end

end Periagoge
```

## Mode Activation

`/induce` remains directly invocable. AI-guided activation requires a sensed essence whose name, scope, or position is still unsettled, and at least two concrete cases to correspond; detection stays silent. An abstraction already located — one awaiting comparison or validation — belongs to other work, and a pair of cases and essence this session already crystallized or withdrew stays inactive for the session.

Bind the seed from an explicit argument first, then the most recent cluster of cases, then a surfaced essence. Where fewer than two cases are in hand, scan the accumulated session context and the user's artifacts for cases that could correspond with the one in hand, and open the first sheet with what the scan found; where it finds nothing, say what was searched and invite a second case. Where no essence is sensed, show the scan result and invite the user to name what feels in process. A routed colimit-shaped signal may ground activation; show its cited essence and locator as the routing detection's reading rather than the user's own intuition. Prior-session recall may seed probe cases or neighbouring abstractions but never settles crystallization.

## Protocol

### The sheet

Every turn shows the whole run on one sheet, in everyday language. It opens with any case you found since the last sheet, marked as found by you, so the user meets it before their next turn; a found case stays yours until the user's words take it up, and a confirm that covers it adopts it as yours. Then the cases with who brought each; the two paired cases side by side with the correspondence filled slot by slot from what the cases themselves carry, each slot marked as filled by you or set by the user, and each role the second case has no counterpart for marked as such; the relation the correspondence carries; the live readings, each with what supports it and the case that breaks it; the readings the user ruled out, each beside the user's own words; the probes so far with the verdicts they received; the boundary those verdicts drew; and the name and rule once a name may be shown. Label each field with the question it answers, in the user's words, and draw the fields with the structure the host renders — headings, tables, lists.

Under the sheet, the ledger of what the last turn changed: the user's verdicts and corrections first, then what you re-drew because of them, each marked as forced by that turn or as your proposal. A round that ruled no reading out says so, and which readings the case was placed outside of and which were left undecided. A reading you would no longer hold stays live until the user rules it out; dropping it is your proposal, shown in the ledger. Then your contrary grounds, each beside the value it bears on.

Then one focus. Where the correspondence is new or corrected, the focus is the correspondence: the user corrects a filling that is wrong rather than supplying one that is missing, and saying the second case carries no counterpart there is such a correction. Where a probe is drawn, put every reading it separates on screen at once, each row carrying the reading, what supports it, the case that breaks it, and its own verdict slot — rules it out, places the case outside it, or settles neither — with what that verdict does beside it; say that the rows are answered against each other; and before the question, say what the live set becomes on each way the round can close. Where a name may be shown, the focus is the naming: the name, the rule, the boundary the near-misses drew, and what stays live. Where every reading was ruled out, say that every reading drawn so far was ruled out on the grounds shown, and ask whether to name a distinction the readings missed, align another pair, or stop.

A probe counts as judged once every reading it separates carries the user's verdict, undecided included. A name may be shown once a correspondence stands, the user has judged a probe, and one reading is left or the user has judged as many probes as your bound with readings still live; the rule is read off a reading that is still live. Draw at most five probes on your own; at the bound, the focus turns to the naming and says that you draw no further probe unless the user asks for one. The user may keep going past it.

The user may answer in their own words, and one answer may reach several parts of the sheet. A correction reaches what its words reach. An utterance about other work leaves the sheet as it stands; the sheet returns when the user comes back to the run. Only the user closes the run: confirming the naming, stopping, or going on to a protocol they name. A confirm takes the naming as the sheet it followed showed it, with everything it rests on in view; where something it would take was never shown, draw the sheet again instead, and a confirm said before that later sheet does not reach it.

At the close, declare the trace before proceeding: the correspondence with who set each slot, each probe with its verdicts, the naming if any, the boundary, the ruled-out readings with their grounds, every case with who brought it, and the open trace. The open items are the live readings the rule did not take, every role left unmatched in any correspondence drawn, and what the user said is still missing. Each open item takes its disposition from the user's closing turn: not blocking where the turn takes the run with the item shown open, deferred where it names the item for later work beside deferral words. An item no turn covered is shown as undisposed. At a withdrawal, show the relation and the live readings as your extraction, not as established.

Read `references/round-composition.md` before composing when terminology must remain stable, wording must be carried unchanged, material belongs to another round or trace, or the order of the sheet bears on where a sentence sits.

## Rules

- **Recognition over Recall**: Present the sheet and one focus with anticipatable consequences, and yield for the user's judgment.
- **Correspondence before naming**: Show a name only after a correspondence stands and the user has judged a probe. A name offered ahead of the correspondence conditions every later judgment on its own vocabulary.
- **Alternatives stay visible**: Show every live reading on every sheet, alongside the one the analysis currently favours. A single reading handed over on its own is the condition under which a judgment bends toward it hardest.
- **Ruling out is recorded, not repeated**: A reading leaves the live set only by the user's verdict, recorded with the user's own words, and is not proposed again within the activation; a reading the user names again returns by their word, with the ground that ruled it out shown beside it.
- **Probes separate rather than confirm**: Choose the next case for how well it tells the live readings apart, not for how well it fits the leading one.
- **Found cases are shown as found**: A case you found opens the next sheet, marked as yours, and joins the cases only as yours until the user's words take it up.
- **The name is a locator, not a compression**: Deliver the name together with the relation, the correspondence it was read off, and the boundary the near-misses drew.
- **Label as ground, not verdict**: Read the user's tentative label as the naming ground the naming works from. It grounds the name and its provenance without fixing either.
- **Personalized grounding**: Draw cases and probes from the user's own domain and keep external provenance visible.
- **The user closes**: The run is crystallized, stopped, or routed only by the user's turn, whatever its form. A confirm adopts what the sheet showed; a value you proposed and the user took is recorded as yours and adopted, apart from values the user set.
- **Contrary grounds ride the closing**: Show your contrary grounds before the focus. A reading of yours never refuses a confirm; a naming confirmed over it carries it as dissent.
- **Periagoge boundary**: Form an abstraction around a sensed but unlocated essence. Comparison or validation of an already located abstraction remains outside this operation.
- **Round composition**: Compose each round in everyday language, keep each judgment beside its evidence and next-move implication, and place analysis before the focus.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change the form directly. Elements fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
