---
name: bound
description: "The user cannot yet see what a task needs them to decide, or which decisions to keep or entrust: map the whole task first, then open each decision to the depth needed."
---

# Horismos Protocol

Define epistemic boundaries through a recognizable whole map and progressive examination. Type: `(BoundaryUndefined, AI, DEFINE, TaskScope) → DefinedBoundary`.

## Definition

- **Horismos** (ὁρισμός) takes a task whose boundary is undefined, including one whose decision structure or sufficient depth of examination is not yet recognizable, and produces a source-grounded boundary with its residual — what is still open.
- Before asking the user what to settle or entrust, construct the relevant whole provisional map of decisions, obligations, assumptions, and dependencies. A settled goal and a user-supplied inventory are not prerequisites. Bound this whole to the current context and show what remains unknown.
- Let the user open any axis, see the concrete content and consequences needed to judge it, correct the map, and entrust at the depth they find sufficient. The map remains the object of judgment; opening an axis does not require visiting every other one.
- Keep the boundary question distinct from its settlement disposition and from the content of the decision. For ownership, the disposition assigns the named decision directly; an allocation question is a separate domain only when the source makes allocation itself the subject.
- The boundary stands in one of two ways — the user accepts it as it stands, at that depth, from the context as it then stands, or no item on the map awaits the user's disposition and it stands as shown — and in either case only where no turn of the user's is still owed (an unclear reply, a request to see something not yet shown, contrary grounds of the AI they have not closed over); an owed turn holds a round that serves it. Every round keeps the way to accept recognizable. Any other response that bears on the boundary continues it — standing it where it leaves nothing awaiting — or withdraws; words that do not bear on it leave it as it stood. Once it stands, the user's later words reopen it where they bear on it.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract.
-/

/-! ── FLOW ──
Horismos(T) → bound(c, o, utterances), where c is the fused session context and o is how the run
stands:
  first round(c): c₀ := observed(c) [Tool] → readout(c₀) → present the whole map →
    nothing awaits the person's disposition and no turn of theirs is owed: the boundary stands,
      shown with its map and sources (an acceptance in the invoking context accepts nothing before
      a map was shown)
    otherwise: Stop — the gate holds
  next utterance u: c' := fuse(c, u) →
    it does not bear on the boundary: the session answers it; the run stands as it was, a
      holding gate holding the context as it now stands
    a withdrawal at the person's word, or once observation settles its reading: the snapshot at
      c' and the boundary that last stood, if any; nothing is observed after a settled withdrawal;
      it sets no boundary from there; this run ends
    otherwise c'' := observed(c') [Tool] → read at c'', before your turn: the boundary stands where
      no turn of the person's is owed and their acceptance reaches it or nothing awaits them; else
      the gate holds → the next round, or the boundary shown
  no further utterance: the run as it stands — a holding gate keeps holding, a boundary that
    stands keeps standing; nothing is selected and nothing settles
-/

/-! ── MORPHISM ──
TaskScope
  → observe_and_read_whole_map
  → present_round
  → fuse_utterance → observe ↺ next_round
  → stand_where_accepted_or_nothing_awaits
  → DefinedBoundary
requires: boundary_undefined(T)
deficit: BoundaryUndefined
preserves: task_identity(T)       -- the purpose and limits actually supplied, including their open coordinates and authorized revisions
invariant: Definition over Assumption
invariant: proposal-and-settlement-separation   -- presence, inspection, silence, and work allocation settle nothing; a disposition is made only by a person's turn
-/

namespace Horismos

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

/-- `TaskScope`: the task or concern needing a boundary; its goal, structure, scope, and
    desired examination depth may remain open. -/
abbrev TaskScope (P : Type) := Context P

/-- Stable identity for a decision, obligation, premise, or unresolved question;
    runtime-grounded, not a fixed taxonomy. -/
abbrev Domain := String

/-- The form a person's disposition of a named decision takes. For ownership it assigns that
    decision directly; for another question it assigns settlement of that boundary value. A
    decision left open has no disposition. -/
inductive BoundaryClassification
  /-- the person keeps the judgment and supplies the value -/
  | userSupplies
  /-- AI develops candidates; selection stays with the person -/
  | aiPropose
  /-- AI chooses within the limits the person states, including among viable alternatives -/
  | aiAutonomous
  deriving DecidableEq

/-- An arrangement for a decision: its form and, for an entrustment, its reach — the kind of
    choice, its target, and its limit, naming any later act that cannot be undone. One you put
    forward is shown for recognition and binds nothing until a person's turn takes it. -/
structure Arrangement where
  form  : BoundaryClassification
  reach : String

/-- Who first put a value forward: you, or the person. -/
inductive Proposer | draft | person

/-- What the turn that made a value stand did: gave it in its own words, or took a value put
    forward before. -/
inductive Standing | set | adopted

/-- A person's disposition of a decision: its form and reach, who first put it forward, and how it
    came to stand. -/
structure Disposition where
  arrangement : Arrangement
  proposer    : Proposer
  standing    : Standing

/-- **Your judgment**, the record rule for dispositions: the cited turn disposes decision `d` as
    `v`, read against the context as it now stands, on the scope the turn's words reach — an
    instruction, or the taking of an arrangement shown before. The proposer is whoever first put
    the arrangement forward; the standing is what the cited turn itself did: gave it in its own
    words (`set`), or took one put forward before (`adopted`) — where you put it forward, only if
    it was visible as yours, with what decides it and your contrary grounds, where you hold any,
    before this turn. An
    acceptance of the boundary as it stands takes exactly the arrangements it covers under that
    condition; one it does not cover stays your proposal, and its decision stays open. An
    entrustment reaches what was shown of it: a later act that cannot be undone is entrusted only
    where its consequence was shown by kind, target, and limit, and an earlier authorization of
    the same kind, target, and limit is not asked for again. A question, a request to look, a
    deferral, or a bare mention disposes nothing. Read the form from what the person said; never
    ask them to classify their own words into these forms. -/
axiom DispositionSupported : Domain → Context P → Turn P → Disposition → Prop

/-- Only a person's turn disposes a decision. -/
def dispositionOf (d : Domain) : Coord P Disposition :=
  { admits := (·.val = .person), supports := DispositionSupported d }

/-- What settles a decision's content: a fact, whose source is the citation; a value held on the
    person's authority, with who first put it forward and how it came to stand; or your choice
    inside a grant, which stays yours. -/
inductive Settled
  | fact    (value : String)
  | held    (value : String) (proposer : Proposer) (standing : Standing)
  | granted (value : String)

/-- **Your judgment**, the record rule for content: the cited turn settles the content of `d` as
    `s`, read against the context as it now stands. Evidence settles a fact — including that an
    earlier decision exists, which a recorded decision, a commit, or a peer's report relays; a
    relayed decision is cited as that fact and makes no disposition of this run. A held value
    stands only on a person's turn: in their own words (`held … set`), or by taking a value put
    forward before (`held … adopted`, under the visibility the disposition record rule names).
    Your choice inside a grant whose words reach it is `granted` — the cited turn is the one the
    arrangement governing the item stands on: the person's turn that disposed it to you, or, where
    no disposition of this run governs, the record of the earlier decision that entrusts it to
    you; the value stays yours. A decision the work rests on that
    the person holds — a value, a preference, a scope — stays open until the person's own turn
    gives it or a relayed decision of theirs fixes it; other evidence informs it without settling
    it. -/
axiom ContentSupported : Domain → Context P → Turn P → Settled → Prop

def contentOf (d : Domain) : Coord P Settled :=
  { admits := fun _ => True, supports := ContentSupported d }

/-- **Your judgment**: the cited turn — a record from outside the person's turns in this context: a
    recorded decision, a commit, a peer's relay — shows that an earlier decision of the person who
    holds `d` already fixes who settles `d`, in the form and reach `a` it states, read against the
    context as it now stands as the fact that that decision exists. A recorded decision of another
    party is a fact about them, not a disposition of this item. It is not a disposition of this run: a person's own turn in
    this context fills the disposition, never this, and where it disposes the same decision
    differently, the person's current words supersede the earlier decision. -/
axiom PriorDispositionSupported : Domain → Context P → Turn P → Arrangement → Prop

/-- A person's turn in this context never fills it: that turn fills the disposition. -/
def priorDispositionOf (d : Domain) : Coord P Arrangement :=
  { admits := (·.val ≠ .person), supports := PriorDispositionSupported d }

def isFilled {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Bool
  | .open_ _   => false
  | .filled .. => true

/-- One entry of the boundary map, read against the context `c`. -/
structure BoundaryEntry (c : Context P) where
  domain        : Domain
  question      : String
  /-- why the item bears on this boundary: what depends on it, and what getting it wrong would
      cost, naming any later act that cannot be undone -/
  relevance     : String
  evidence      : List (Cite c)
  /-- entries whose change may alter this one; an unknown prerequisite is an entry, not a
      fabricated answer -/
  dependsOn     : List Domain
  /-- current or conditional reach -/
  applicability : String
  /-- your arrangement, shown for recognition -/
  proposal      : Option Arrangement
  disposition   : Occ (dispositionOf domain) c
  /-- an earlier decision of the person who holds this decision, fixing who settles it, cited as
      a fact -/
  priorDisposition : Occ (priorDispositionOf domain) c
  content       : Occ (contentOf domain) c

/-- The arrangement that governs an item, with the turn it stands on: the person's disposition in
    this run where one is filled — their current words — else the earlier decision's. -/
def governing {c : Context P} (e : BoundaryEntry c) : Option (Arrangement × Cite c) :=
  match e.disposition, e.priorDisposition with
  | .filled d s _ _, _               => some (d.arrangement, s)
  | .open_ _,        .filled a s _ _ => some (a, s)
  | .open_ _,        .open_ _        => none

/-- An item's content stands when it is filled and, for a held value, cites a person's turn; your
    choice inside a grant stands only where the arrangement governing the item entrusts it to you,
    citing the turn that arrangement stands on. A held value on any other citation stands nowhere,
    and the content stays open. -/
def stands {c : Context P} (e : BoundaryEntry c) : Bool :=
  match e.content with
  | .open_ _                     => false
  | .filled (.fact _) _ _ _      => true
  | .filled (.held ..) src _ _   => decide (src.src.val = .person)
  | .filled (.granted _) src _ _ =>
    match governing e with
    | some (a, g) => decide (a.form = .aiAutonomous) && decide (src.idx = g.idx)
    | none        => false

abbrev BoundaryMap (c : Context P) := List (BoundaryEntry c)

/-- A readable account of the whole map. -/
structure BoundaryEssence (c : Context P) where
  map    : BoundaryMap c
  /-- what the map did not look at, and why — the sources observation did not reach, as the context
      records them: a failure a source returned, or your earlier round naming them; a source left
      unreached at the step where the boundary stands is named in the turn that shows it -/
  limits : String

/-- **Your judgment**, read afresh at every round: the relevant whole provisional structure from
    the task and everything reachable — decisions, obligations, assumptions, dependencies, and what
    is unknown — each entry with its disposition and content as the context now settles them. What
    the person already named enters as theirs; what you add is marked as your proposal. An item
    raised earlier that is still open, or that the person disposed, stays on the map while it still
    bears on the task, even where this round's discovery omits it: a person's disposition never
    drops out of the record unnoticed. You read it from the context as observation left it; a
    source it needs that observation did not return is not read here — it is named in what the
    map did not look at. Guidance for the reading, not a step it must take: carry the map as the
    current sheet with a ledger of what changed. -/
axiom readout : (c : Context P) → BoundaryEssence c

/-- **Your judgment**: what reading the reachable sources returns for the map at `c` — a fact a
    consequence rests on, a record an opened axis needs, a file the person asked you to read.
    Observe what a consequence the map shows rests on before showing it. Collect as far as the
    reachable sources go within what the map turns on; what you say you read, read whole. Where
    what returns conflicts, name what conflicts with what. A source not reached is named, by name,
    in your turn that shows the map, and so enters what the map did not look at; what still
    remains open is the person's own unknown, carried in the residual. Observation changes no existing state; what needs a change of state, a
    permission, or another's authority is named and handed over, not observed. -/
axiom observe : Context P → List (Evidence P)

/-- The context with what observation returned joined to it; the map is read there. -/
def observed (c : Context P) : Context P := c ++ (observe c).map (·.val)

/-- An item of the map — a decision, obligation, assumption, or dependency, each a boundary
    question someone must own — awaits the person while neither its disposition, nor an earlier
    decision fixing who settles it, nor its content stands. One the person kept or asked proposals
    for is disposed while its value is still open; one whose disposition an earlier decision fixes
    is shown with that citation and not asked again; one whose content an earlier decision or an
    observation fixes is settled as a fact. -/
def awaitsEntry {c : Context P} (e : BoundaryEntry c) : Bool :=
  (governing e).isNone && !stands e

def awaits {c : Context P} (r : BoundaryEssence c) : Bool :=
  r.map.any awaitsEntry

/-- **Your judgment**: the cited turn accepts the boundary as it stands, in whatever words, read
    against the context as it now stands. An acceptance reaches the boundary only as it stood when
    the person accepted it: once a later correction opens an item, the earlier acceptance no longer
    reaches the boundary as it now stands, the opened item awaits the person, and what they already
    disposed stands on their own turns. An acceptance from an earlier run does not set this one,
    and one given before any map was shown accepts nothing. -/
axiom AcceptanceSupported : Context P → Turn P → Unit → Prop

/-- Only the person accepts the boundary. -/
def acceptanceCoord : Coord P Unit :=
  { admits := (·.val = .person), supports := AcceptanceSupported }

/-- **Your reading**: the person's acceptance; `open_` until one reaches it. -/
axiom acceptance : (c : Context P) → Occ (acceptanceCoord (P := P)) c

/-- **Your judgment**: the cited turn withdraws — the person stops this run without setting the
    boundary — read against the context as it now stands. It is read at the person's word; nothing
    more is observed after a settled withdrawal. Where only what observation returns settles its
    reading, it is read once more after observation, and its record is still at the word. What the
    person already disposed stands as their words; no proposal of yours is taken by it. A withdrawal
    from an earlier run does not end this one, and a reply whose reading is unsettled withdraws
    nothing. A withdrawal after the
    boundary stood stops the run from there: what already relied on the boundary stays as done, and
    the record keeps the boundary that last stood beside what the person's words now make. Your own
    reading that the run should end withdraws nothing. -/
axiom WithdrawalSupported : Context P → Turn P → Unit → Prop

/-- Only the person withdraws. -/
def withdrawalCoord : Coord P Unit :=
  { admits := (·.val = .person), supports := WithdrawalSupported }

/-- **Your reading**: the person's withdrawal; `open_` until one reaches it. -/
axiom withdrawal : (c : Context P) → Occ (withdrawalCoord (P := P)) c

/-- **Your judgment**: the latest utterance, read whole against the fused context, bears on this
    boundary — a disposition, a correction, an opening, an acceptance, a withdrawal, or anything
    that changes what the map turns on — even where it also asks for other work. An utterance that
    bears on none of it leaves the run as it stands: the session answers it, that answer stays in
    the context, a gate that holds keeps holding, and a boundary that stands keeps standing. -/
axiom Reaches : Context P → Prop

/-- **Your reading**: a turn of the person's is still owed before the boundary stands — read on the
    context as observation left it, including what this round will show. Guidance for the reading,
    not cases it must check: the latest reply's reading is not settled (materially different
    futures remain viable — the round shows the candidate readings, and nothing is committed from
    it); the reply asks to see or open something not yet shown (seeing it adopts nothing); you hold
    contrary grounds the person has not closed over; an acceptance does not reach what is now at
    issue. Where a turn is owed, the gate holds for the round that serves it. -/
axiom owed : Context P → Bool

/-- **Your record**: the contrary grounds you presented — a disposition you doubt, a premise that
    may not hold — attached to the boundary; empty when there were none. The person's dispositions
    stand over them: you never rewrite or veto one, and new evidence against one is shown before
    any step that depends on it and cannot be undone. -/
axiom dissent : Context P → List String

/-- One disposition on the record: the decision, the disposition, and the person's turn it stands
    on, with that turn's support. -/
structure Recorded (c : Context P) where
  domain    : Domain
  value     : Disposition
  src       : Cite c
  byPerson  : src.src.val = .person
  supported : DispositionSupported domain c (c[src.idx]'src.lt) value

def recordOf {c : Context P} (e : BoundaryEntry c) : List (Recorded c) :=
  match e.disposition with
  | .open_ _                      => []
  | .filled v s allowed supported => [⟨e.domain, v, s, allowed, supported⟩]

/-- One item still open: the item, its question, why it bears on the boundary, and the arrangement
    governing it — `none` where no disposition governs it yet. -/
structure OpenItem where
  domain    : Domain
  question  : String
  relevance : String
  governing : Option Arrangement

def openItemOf {c : Context P} (e : BoundaryEntry c) : OpenItem :=
  ⟨e.domain, e.question, e.relevance, (governing e).map (·.1)⟩

/-- What is still open: every item on the map whose content does not stand, disposed or not, with
    why it bears and who settles it. Nothing closes by default. -/
abbrev Residual := List OpenItem

def residualOf {c : Context P} (m : BoundaryMap c) : Residual :=
  (m.filter (fun e => !stands e)).map openItemOf

/-- What the run holds where it is read: the map with each decision's disposition and content, the
    record, what is still open, what the map did not look at, and the dissent; `context` is what
    its citations point into. -/
structure Snapshot (P : Type) where
  context  : Context P
  map      : BoundaryMap context
  /-- every disposition that stands over the map; a proposal of yours the person has not taken
      lives only in the context and its presentation -/
  record   : List (Recorded context)
  residual : Residual
  limits   : String
  dissent  : List String

/-- The resolution: the snapshot where the boundary stands. -/
structure DefinedBoundary (P : Type) where
  snapshot : Snapshot P

/-- What a withdrawal leaves: the snapshot at the person's word — what their words now make — and,
    where the boundary stood at any point in this run, the last boundary that stood, which work may
    already have relied on. It sets no boundary from there. -/
structure Withdrawal (P : Type) where
  atWord : Snapshot P
  stood  : Option (DefinedBoundary P)

/-- The run as it stands: a boundary that stands; a withdrawal's record; or a gate that holds, in
    the context as it now stands, with the boundary that last stood in this run, if any. -/
inductive Outcome (P : Type)
  | defined   (b : DefinedBoundary P)
  | withdrawn (w : Withdrawal P)
  | holding   (c : Context P) (stood : Option (DefinedBoundary P))

/-- The last boundary that stood in the run, if any. -/
def Outcome.stood : Outcome P → Option (DefinedBoundary P)
  | .defined b   => some b
  | .withdrawn w => w.stood
  | .holding _ s => s

/-- How the run stands, carried to a longer context: a holding gate holds it as it now stands. -/
def Outcome.carry : Outcome P → Context P → Outcome P
  | .holding _ s, c => .holding c s
  | o,            _ => o

/-! ── MODE STATE ──
Λ is the fused context; every reading above is taken from it. The recursion also carries how the
run stands — the outcome so far, with the boundary that last stood — which PHASE TRANSITIONS
threads beside it.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
A step is one arm of a structural recursion over the person's utterances, carrying the context as
it stands and how the run stands. A withdrawal is read at the person's word, before any
observation, and ends the run there; where only what observation returns settles its reading, it
is read once more after observation, its record still at the word. Otherwise how the run stands
is read at the person's utterance, with what observation returned joined to it as evidence turns
[Tool], before your turn answers it; whether a turn of the person's is still owed is read there.
`respond` is then that turn: a
round (`round`, a Constitution that stops for the person) where the gate holds — and the gate that
holds holds with that round in its context — or the boundary shown as it stands (`converge`, an
Extension) where it stands; where the utterance also asks for other work, the same turn serves
that part too. A withdrawal ends the run; where it also asks for other work, the session serves
that part after the run. `session` is the session's own answer to an utterance that does not bear
on the boundary, which stays in the context; the run's status is carried to it unchanged, a gate
that holds holding the context as it now stands.
-/

def snapshotFrom (c : Context P) (r : BoundaryEssence c) : Snapshot P :=
  { context := c, map := r.map, record := r.map.flatMap recordOf, residual := residualOf r.map,
    limits := r.limits, dissent := dissent c }

def snapshotOf (c : Context P) : Snapshot P := snapshotFrom c (readout c)

def closeFrom (c : Context P) (r : BoundaryEssence c) : DefinedBoundary P := ⟨snapshotFrom c r⟩

def close (c : Context P) : DefinedBoundary P := closeFrom c (readout c)

/-- How the run stands in `c` — the context at the person's utterance, or at the start the context
    the first round is presented from: the boundary stands where no turn of the person's is owed and
    their acceptance reaches it or nothing awaits them; otherwise the gate holds, in `shown` — `c`
    with the round that presents it — and with `stood`, the boundary that last stood in the run. -/
def status (c shown : Context P) (stood : Option (DefinedBoundary P)) : Outcome P :=
  let r := readout c
  if !owed c && (isFilled (acceptance c) || !awaits r) then .defined (closeFrom c r)
  else .holding shown stood

open Classical in
def bound (respond session : Context P → Response P) :
    Context P → Outcome P → List (Utterance P) → Outcome P
  | _, o, []      => o
  | c, o, u :: us =>
    let c' := fuse c u
    if ¬ Reaches c' then
      let cs := c' ++ [(session c').val]
      bound respond session cs (o.carry cs) us
    else if isFilled (withdrawal c') then .withdrawn ⟨snapshotOf c', o.stood⟩
    else
      let c'' := observed c'
      if isFilled (withdrawal c'') then .withdrawn ⟨snapshotOf c', o.stood⟩
      else
        let shown := c'' ++ [(respond c'').val]
        bound respond session shown (status c'' shown o.stood) us

/-- The run opens on its first round, read from the invoking context with what observation
    returned. -/
def start (respond session : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  let c₀ := observed c
  let shown := c₀ ++ [(respond c₀).val]
  bound respond session shown (status c₀ shown none) us

/-! ── LOOP ──
A correction reopens the affected dependency region in the next readout; an unchanged source
supplies no reason to re-ask a settled decision. Neither scan exhaustion nor a visit count
constitutes the person's acceptance; where nothing awaits the person and no turn of theirs is
owed, the boundary stands with what the map did not look at shown, and stays open to their next
words. The person can accept without opening every axis; what is still open is carried as
residual. Interrupting or steering a run in progress is the host's to deliver; this block names it
only as the point where execution hands off.
-/

/-! ── CONVERGENCE ──
converge on `defined`: the boundary is `close` of the context where no turn of the person's is
owed and their acceptance reaches it or nothing awaits their disposition.
  snapshot: read the current map and its cited sources; derive the residual from every item
    whose content does not stand, each with why it bears and the arrangement governing it,
    declared empty where nothing is open.
  trace: map each item on the map to its disposition — who put it forward and how it stood — and,
    where its content is still open, to the residual, with facts, relayed earlier decisions, and
    earlier decisions fixing who settles an item shown as cited facts, and the source and effect
    of relevant corrections. Present the whole arrangement, the dissent attached to it, and what
    the next move may and may not settle under it.
  limits: closure defines a boundary at its constituted scope and depth; it supplies neither a
    fixed project goal nor proof of the person's comprehension or exhaustive discovery.
  a withdrawal keeps the snapshot at the person's word and, apart from it, the boundary that last
    stood in the run, if any; it sets no boundary from there.
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

inductive Op | observe | readout | round | readAnswer | converge | withdrawal | seam

def grounding : Op → Annot × String
  | .observe      => (.observe, "record read, artifact read, artifact search: at the start and at every reply that bears on the boundary except a settled withdrawal, read what the map needs from the reachable sources — a fact a consequence rests on, a record an opened axis needs, a file the person asked you to read — without changing existing state, collecting as far as reach allows and reading whole what you say you read; what each returns enters the context as an evidence turn; name what conflicts with what, and name what was not reached in your turn that shows the map, so it enters the map's limits; an observation that needs a change of state, a permission, or another's authority is named with what it needs and handed over, never run as observation")
  | .readout      => (.sense, "Internal analysis: derive the whole map and the opened detail from the context as observation left it, at every round; read each disposition and content by the turn that set it, and an earlier decision fixing who settles one as a cited fact")
  | .round        => (.interaction .constitution, "the whole map — the person's own lines as theirs, your additions marked as proposals, each decision with its evidence, what depends on it and what getting it wrong costs, and any entrustment's reach, every later act that cannot be undone in view — what the map did not look at — every source observation did not reach, by name — the choices still open beside the round's question, your contrary grounds, where you hold any, before the answer, and the way to accept the boundary as it stands kept recognizable; labels defined where they are used; yield for the whole response")
  | .readAnswer   => (.sense, "Internal analysis: whether the latest utterance bears on the boundary, and what it does there — dispositions, corrections, an opening, an acceptance, a withdrawal — read whole against the fused context, whatever form it takes; a reading not yet settled, or a request to see something not yet shown, makes the person's turn owed and holds a round that serves it, committing nothing")
  | .converge     => (.interaction .extension, "DefinedBoundary as it stands — its map, its record with who put each disposition forward and how it stood, cited facts, the residual — declared empty where nothing is open — with why each open item bears and who settles it, the dissent, and its limits — every source observation did not reach, by name — with the way to reopen it; where nothing awaited the person, say so")
  | .withdrawal   => (.interaction .extension, "at the person's word: what you took as withdrawn, the snapshot there with its limits and its residual, declared empty where nothing is open, and the boundary that last stood, if any; nothing open is entrusted, and a correction reopens the boundary through a new run that reads this record")
  | .seam         => (.interaction .extension, "after the boundary stands, proceed to the next move the person declared — a chain they named, an adopted policy, or an explicit grant of that next move — and after a withdrawal, only to a next move the person declared with it; cite that source; every checkpoint whose own contract requires the person's response still fires, and every later act that cannot be undone needs an authorization reaching it — an entrustment shown by kind, target, and limit is one, and is not asked for again")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution remains context-bound.
A receiving protocol or delegate reads DefinedBoundary with its context: the whole map, its record,
and its citations, never an uncited task list. It resolves the relevant entry's question,
applicability, dependencies, limits, and cited sources before relying on a disposition or content. A
grant is the arrangement governing a decision (`governing`): the disposition recorded in this run,
reaching only what was shown of it, or, where none is, a disposition fixed by a cited earlier
decision of the person who holds it, read through that source and reaching only what the source states — a cited fact, not a
disposition of this run. Where both bear on one decision and differ, the disposition recorded in
this run governs: it is the person's current words. A proposal and open content are read as such.
UserSupplies leaves the person to supply the value. AIPropose permits proposal work while the person
keeps the selection. AIAutonomous permits choice only inside the governing arrangement's reach, and
that choice is recorded as yours. A missing entry, an unreadable citation, or a changed prerequisite
leaves that judgment unresolved; where examination needs evidence or a capability this run lacks,
name what is needed and keep the judgment pending; continue independent authorized work and reopen
the affected boundary before dependent settlement. A grant to perform work preserves every
checkpoint whose own contract requires the person's response, and reassignment does not enlarge
authority. This protocol defines the boundary; it does not execute or enforce downstream work.
-/

end

end Horismos
```

## Mode Activation

- `/bound` remains directly invocable.
- When a decision boundary or the structure needed to judge it is undefined, invoke the protocol with the available task context. Keep goal, success criteria, and scope open where the user has left them open.
- During AI-guided activation, apply current safety boundaries, capability limits, and explicit instructions. Skip activation when source-defined direction already settles the requested boundary, when nothing on the map would await the user and no turn of theirs would be owed, when the user expressly requests proceeding without this interaction, or when the same unresolved finding was dismissed and its ground has not changed.
- On explicit invocation where nothing on the map awaits the user's disposition — every item disposed by their words, fixed by a cited earlier decision of theirs, or settled as a fact observation returned, or the map is empty — and no turn of theirs is owed, the first round shows that map with its sources, what it did not look at, and a path to reopen missed structure, and the boundary stands as shown.

## Protocol

- At the first round, show the relevant whole draft before asking the user to choose its applicable parts or examination depth. Give every included item its decision-relevant reason, what getting it wrong would cost, and its conditional connections. State the scope of discovery and what is unknown; do not require the user to invent an obligation inventory. What the user already said enters the map as theirs; what you add is marked as your proposal.
- When the goal is open, distinguish the work that can investigate it, the judgment that would select it, and obligations conditional on that selection. Propose a way to handle those questions without supplying an unchosen goal.
- In every round, make existing user decisions, choices made inside a grant, unaccepted proposals, facts relayed from earlier decisions, and unresolved items recognizable through their source and setting status. Put the choices still open beside the round's question, show every proposal that would entrust an irreversible later act to AI with its reach, place your contrary grounds, where you hold any, before the question, and keep the way to accept the boundary as it stands recognizable, in the user's language.
- When the user opens an axis, show the concrete content, assumptions, alternatives, and dependent consequences needed for that axis; the user's turn is owed for that round even where nothing awaits. Keep the whole overview in view and offer deeper examination or correction where it matters. Decision-rights detail and proposed-content detail can differ by axis; derive the depth from the response rather than a fixed menu of levels.
- At an opened settlement question, materialize UserSupplies, AIPropose, and AIAutonomous in the user's idiom: the user supplies the decision, AI proposes for the user's selection, or AI chooses within stated limits. A displayed default is one of these proposals and binds only through its actual acceptance.
- When the user corrects an assumption, the scope, or the question the boundary answers, the next round reads the corrected context: revise affected content and obligations, show their changed implications, and preserve independent commitments. Keep excluded or conditional parts legible in the map where they matter to later reliance; the residual lists what is still open.
- When the user accepts the boundary as it stands, stop at that depth. The acceptance takes the proposals it covers only where each was shown as yours with its deciding evidence and your contrary grounds, where you hold any; what it does not cover stays open in the residual. Present the constituted whole and its remaining questions without asking for a second approval of the same arrangement.
- When no item on the map awaits the user's disposition — each disposed by their words, fixed by a cited earlier decision of theirs (shown with that citation and not asked again), or settled as a fact observation returned, or the map is empty — and no turn of the user's is owed, show the map as it stands with what it did not look at, and say that the boundary stands; the user's next words reopen it where they bear on it.
- When a response is not yet readable as continuing, accepting, or withdrawing, the user's turn is owed even where nothing awaits: the next round shows the candidate readings with their consequences, and nothing is committed from the unsettled reading.
- When the user turns to other work, answer it; the boundary stays as it stood — a gate that holds keeps holding and a boundary that stands keeps standing — and nothing is closed on the user's behalf.
- Before handing off or using a resulting boundary, read the COMPOSITION contract with its cited sources. Preserve the holder of every retained judgment, the reach of each grant, and any condition that must be revisited.
- When composing a round whose terminology, quotation, neighboring material, or phase order needs attention, read `references/round-composition.md` before presenting it.

## Rules

- **Recognition over Recall**: Present structured options with anticipatable post-selection states.
- **Round composition**: Keep each judgment beside its nearest evidence and next-move implication, and place analytical context before the gate.
- **Observation before showing**: At the start and at every reply that bears on the boundary — except a settled withdrawal, read at the user's word — observe what the map needs from the reachable sources before showing it, without changing existing state; name and hand over what needs a change of state, a permission, or another's authority. Collect as far as reach allows, read whole what you say you read, name what conflicts with what, name what was not reached in the turn that shows the map, and leave what remains as the person's own unknown in the residual.
- **Whole before selection**: Construct and present the relevant provisional whole before asking what to settle, inspect, or entrust; the user's existing goal and map can remain incomplete.
- **Progressive examination**: Let the user's response open, deepen, replace, or close axes of that whole. Bind requested examination to the next round — the gate holds for it — and a request to see content adopts none of it.
- **Dynamic rendering**: Keep boundary questions and examination dimensions runtime-grounded, with recognizable seeds and a path to extend or replace the framing.
- **Source-bound settlement**: A disposition is made only by a user's utterance that supports it; a proposal, an AI turn, inspection, and silence dispose nothing. Record who put each disposition forward and how it stood, apart from each other. An AI proposal is adopted only where it was shown as yours, with what decides it and your contrary grounds, where you hold any, before the user's turn; apply acceptance only within its actual referent and limits.
- **Entrustment reach**: An entrustment reaches what was shown of it. A later act that cannot be undone is entrusted only where its consequence was shown by kind, target, and limit; an earlier authorization of the same kind, target, and limit is not asked for again.
- **Dependency revision**: Reconcile changed ground and transitive dependents before the next round or the reading where the boundary stands, retaining supported decisions and recording unresolved consequences.
- **Prior-map provenance**: Read an earlier boundary through the turns it cites. Its citation still points at the same source; whether that source still supports the settlement is judged against the context that now stands, and an unreachable or unsupported setting is advisory. An earlier decision relayed from a record is a cited fact, not a disposition of this run — whether it fixes a decision's content or who settles it.
- **After closure**: Never rewrite or veto a user's disposition. Attach your contrary grounds to the boundary where the user set it over them, raise a disposition again only on new evidence, and show that evidence before any dependent step that cannot be undone.
- **Settlement across delegation**: Carry and read the source-defined question, judgment holder, limits, dependencies, and residual at downstream use; work reassignment and a summary supply no additional grant.
- **Closing**: Keep the way to accept the boundary as it stands recognizable in every round, with every irreversible AI-delegation proposal in view. The boundary stands where no turn of the user's is owed — an unclear reply, a request to see something not yet shown, contrary grounds of yours they have not closed over — and they accept it or no item awaits their disposition; silence and other work leave the run as it stood, and scan exhaustion or a visit count supplies no acceptance.
- **Ambiguous response routing**: Read mixed responses whole; when materially different futures remain viable, continue and present those readings and their consequences. Commit nothing from an unresolved reading. Never ask the user to classify their own words into the disposition forms.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change the form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
