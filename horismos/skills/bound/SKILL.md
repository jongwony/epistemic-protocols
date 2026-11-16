---
name: bound
description: "Use when what a task rests on is not yet visible — which decisions it turns on, which are settled and by whose judgment, what to keep or entrust — before work proceeds on that undrawn boundary; not where the direction a source gives already settles it. The user can then see what the work treats as settled, on what ground and by whose judgment, with each open item filled in as the AI's choice or marked proposal, and tell what to keep, take or ask again."
---

# Horismos Protocol

Define epistemic boundaries through a recognizable whole map and progressive examination. Type: `(BoundaryUndefined, AI, DEFINE, TaskScope) → DefinedBoundary`.

## Definition

- **Horismos** (ὁρισμός) takes a task whose boundary is undefined, including one whose decision structure or sufficient depth of examination is not yet recognizable, and returns a source-grounded map of it: what the work treats as settled, and what is still open, each open item filled in.
- Let the user open any axis, correct the map, and entrust at the depth they find sufficient. The map remains the object of judgment; opening an axis does not require visiting every other one.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract.
-/

/-! ── FLOW ──
Horismos(T) → bound(c, b, utterances), where c is the fused session context and b is the last
return:
  first round(c): c₀ := observed(c) [Tool] → readout(c₀) → the return (`round`, an Extension): the
    whole map, every item still open filled in; no answer is owed
  next utterance u: c' := fuse(c, u) →
    it does not bear on the boundary: the session answers it; the last return stands
    otherwise c'' := observed(c') [Tool] → readout(c''), before your turn → the return again
  no further utterance: the last return stands; nothing is taken and nothing settles
-/

/-! ── MORPHISM ──
TaskScope
  → observe_and_read_whole_map   -- every item still open filled in, as `readout` states
  → return_map ↺ fuse_utterance → observe   -- every round returns the map; none owes an answer
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

/-- Stable identity for a map entry — a decision, obligation, premise, or unresolved question whose
    settlement or arrangement the task rests on, whether already fixed or still open;
    runtime-grounded, not a fixed taxonomy. Who settles an entry is read as that entry's
    arrangement; it is a separate entry only where the source makes that allocation itself the
    subject. -/
abbrev Domain := String

/-- The form a person's disposition of a named decision takes. A decision left open has no
    disposition. -/
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
    before this turn. One turn may take several arrangements shown before: it takes exactly those
    its words cover, each under that condition; one it does not cover stays your proposal, and its
    decision stays open. An entrustment reaches what was shown of it: a later act that cannot be
    undone is entrusted only where its consequence was shown by kind, target, and limit, and an
    earlier authorization of the same kind, target, and limit is not asked for again. A question,
    a request to look, a deferral, or a bare mention disposes nothing. Read the form from what the
    person said; never ask them to classify their own words into these forms. -/
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
    forward before (`held … adopted`, under the visibility and coverage the disposition record rule
    names). Your choice inside a grant whose words reach it is `granted` — the cited turn is the
    one the arrangement governing the item stands on: the person's turn that disposed it to you,
    or, where no disposition of this run governs, the record of the earlier decision that entrusts
    it to you; the value stays yours. A decision the work rests on that the person holds — a value, a
    preference, a scope — stays open until the person's own turn gives it or a relayed decision of
    theirs fixes it; other evidence informs it without settling it. -/
axiom ContentSupported : Domain → Context P → Turn P → Settled → Prop

def contentOf (d : Domain) : Coord P Settled :=
  { admits := fun _ => True, supports := ContentSupported d }

/-- **Your judgment**: the cited turn — a record from outside the person's turns in this context: a
    recorded decision, a commit, a peer's relay — shows that an earlier decision of the person who
    holds `d` already fixes who settles `d`, in the form and reach `a` it states, read against the
    context as it now stands as the fact that that decision exists. A recorded decision of another
    party is a fact about them, not a disposition of this item. It is not a disposition of this
    run: a person's own turn in this context fills the disposition, never this, and where it
    disposes the same decision differently, the person's current words supersede the earlier
    decision. An item whose disposition an earlier decision fixes is shown with that citation and
    not asked again. -/
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
      records them: a failure a source returned, or your earlier turn naming them; a source left
      unreached is named in the turn that shows the return, and the return's limits are read with
      that turn -/
  limits : String

/-- **Your judgment**, read afresh at every round: the relevant whole provisional structure from
    the task and everything reachable — every entry the task rests on, its goal and direction among
    them, and what is unknown — each entry with its disposition and content as the context now
    settles them. What the person already named enters as theirs. Every item still open you fill
    in: where a grant's words reach it, with your choice inside that grant, recorded as `granted`;
    everywhere else with your proposal — the value, direction, or arrangement you would take, with
    what decides it — marked as yours, also where its ground is thin, the thinness then marked on
    that item. Every entry raised earlier that still bears on the work remains represented, with its
    grounds read against the current context, whether its content is settled or open, even where
    this round's discovery omits it: a person's disposition never drops out of the record
    unnoticed. You read it from the context as observation left it; a source it needs that
    observation did not return is not read here — it is named in what the map did not look at. -/
axiom readout : (c : Context P) → BoundaryEssence c

/-- **Your judgment**: what reading the reachable sources returns for the map at `c`, at the start
    and at every reply that bears on the boundary — a fact a consequence rests on, a record an
    opened axis needs, a file the person asked you to read. Observe what a consequence the map shows
    rests on before showing it. Collect as far as the reachable sources go within what the map turns
    on, what matters most first, through what you can read or run without changing existing state.
    What the context already holds from a source is not fetched again unless a later turn — an
    utterance, evidence, or a write of your own — says it changed. What you create only to look — a
    scratch copy, a temp file — you remove afterwards. What you say you read, read whole. Where what
    returns conflicts, name what conflicts with what. A source not reached is named, by name, in
    your turn that shows the map, and so enters what the map did not look at; what still remains
    open is the person's own unknown, carried in the residual. An observation that needs to change
    existing state, someone's permission, or another's authority is named with what it needs and
    handed off, not observed. Each return is an evidence turn. -/
axiom observe : Context P → List (Evidence P)

/-- The context with what observation returned joined to it; the map is read there. -/
def observed (c : Context P) : Context P := c ++ (observe c).map (·.val)

/-- **Your judgment**: the latest utterance, read whole against the fused context, bears on this
    boundary — a disposition, a correction, an opening, the taking of proposals shown before, or
    anything that changes what the map turns on — even where it also asks for other work. An
    utterance that bears on none of it leaves the run as it stands: the session answers it, that
    answer stays in the context, and the last return stands. Words saying the person is done are
    read like any other turn, and the turn that answers them says how it took them; your own
    reading that the person is done ends nothing. -/
axiom Reaches : Context P → Prop

/-- **Your record**: the contrary grounds shown with the map, each naming what it bears on and
    what supports it, retained with an entry the person took over those grounds; empty where there
    were none. Which choice to make inside an entrustment is yours to weigh where you make that
    choice. The person's dispositions stand over them: you never rewrite or veto one. -/
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
    governing it with the origin of the turn it stands on — a person's turn for a disposition of
    this run, another origin for an earlier decision of theirs relayed through it — `none` where no
    disposition governs it yet. -/
structure OpenItem where
  domain    : Domain
  question  : String
  relevance : String
  governing : Option (Arrangement × Origin)

def openItemOf {c : Context P} (e : BoundaryEntry c) : OpenItem :=
  ⟨e.domain, e.question, e.relevance, (governing e).map (fun g => (g.1, g.2.src.val))⟩

/-- What is still open: every item on the map whose content does not stand, disposed or not, with
    why it bears and who settles it. Nothing closes by default. -/
abbrev Residual := List OpenItem

def residualOf {c : Context P} (m : BoundaryMap c) : Residual :=
  (m.filter (fun e => !stands e)).map openItemOf

/-- What a return holds: the map with each decision's disposition and content, the record, what
    is still open, what the map did not look at, and the dissent; `context` is what its citations
    point into. -/
structure Snapshot (P : Type) where
  context  : Context P
  map      : BoundaryMap context
  /-- every disposition that stands over the map -/
  record   : List (Recorded context)
  residual : Residual
  limits   : String
  dissent  : List String

/-- Once it has run, the person can see what the work is treating as settled about its goal,
    direction and boundaries — each with the ground it rests on and whose judgment it was. What was
    still open has been filled in by you: as your choice where a grant reaches it, as your
    proposal, marked as such, everywhere else. From that the person can tell what to keep, what to
    take and what to ask again. The map is drawn from the context as it stands and drawn again as
    the context changes. The resolution: the snapshot the latest return holds. -/
structure DefinedBoundary (P : Type) where
  snapshot : Snapshot P

/-! ── MODE STATE ──
Λ is the fused context; every reading above is taken from it. The recursion also carries the last
return, which PHASE TRANSITIONS threads beside it.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
A step is one arm of a structural recursion over the person's utterances, carrying the context as it
stands and the last return. At a person's utterance that bears on the boundary, what observation
returned is joined to it as evidence turns [Tool] and the map is read there, before your turn;
`respond` is then that turn — the return (`round`, an Extension) — and the return's limits and
dissent are read with it. `session` is the session's own answer to an utterance that does not bear
on the boundary, which stays in the context; the last return is carried to it unchanged.
-/

/-- The return at `c`: the map, record, and residual as read at `c`, where its citations point, and
    what the turn that shows it at `shown` adds — what it names as not reached, and the dissent it
    shows. -/
def closeAt (c shown : Context P) (r : BoundaryEssence c) : DefinedBoundary P :=
  ⟨{ context := c, map := r.map, record := r.map.flatMap recordOf, residual := residualOf r.map,
     limits := (readout shown).limits, dissent := dissent shown }⟩

open Classical in
def bound (respond session : Context P → Response P) :
    Context P → DefinedBoundary P → List (Utterance P) → DefinedBoundary P
  | _, b, []      => b
  | c, b, u :: us =>
    let c' := fuse c u
    if ¬ Reaches c' then
      bound respond session (c' ++ [(session c').val]) b us
    else
      let c'' := observed c'
      let shown := c'' ++ [(respond c'').val]
      bound respond session shown (closeAt c'' shown (readout c'')) us

/-- The run opens on its first return, read from the invoking context with what observation
    returned. -/
def start (respond session : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : DefinedBoundary P :=
  let c₀ := observed c
  let shown := c₀ ++ [(respond c₀).val]
  bound respond session shown (closeAt c₀ shown (readout c₀)) us

/-! ── LOOP ──
A correction reopens the affected dependency region in the next readout; an unchanged source
supplies no reason to re-ask a settled decision. Interrupting or steering a run in progress is the
host's to deliver; this block names it only as the point where execution hands off.
-/

/-! ── CONVERGENCE ──
returned: every round's turn is a return, whether or not the person answered anything; none owes
an answer, and no closing turn is asked. A return is `closeAt` of the context it was read at, its
limits and dissent read with the turn that shows it.
  snapshot: read the current map and its cited sources; derive the residual from every item
    whose content does not stand, each with why it bears and the arrangement governing it and
    where that arrangement comes from, declared empty where nothing is open.
  trace: map each item on the map to its disposition — who put it forward and how it stood — and,
    where its content is still open, to your filling and the residual, with facts, relayed
    earlier decisions, and earlier decisions fixing who settles an item shown as cited facts, and
    the source and effect of relevant corrections. Present the whole map and the dissent attached
    to the return.
  limits: a return draws the boundary at the scope and depth the context reached; it supplies
    neither a fixed project goal nor proof of the person's comprehension, acceptance, or
    authorization, nor of the correctness of its proposals or of exhaustive discovery.
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

inductive Op | observe | readout | round | readAnswer | converge | seam

def grounding : Op → Annot × String
  | .observe      => (.observe, "record read, artifact read, artifact search, external fetch, environment run: observation as `observe` states")
  | .readout      => (.sense, "Internal analysis: derive the whole map and the opened detail from the context as observation left it, at every round; read each disposition and content by the turn that set it, and an earlier decision fixing who settles one as a cited fact")
  | .round        => (.interaction .extension, "the whole map — the person's own lines as theirs, each item still open with your filling and its marks as `readout` states them, each decision with its evidence, what depends on it and what getting it wrong costs, and any entrustment's reach, every later act that cannot be undone in view — what the map did not look at — every source observation did not reach, by name — your contrary grounds, where you hold any, beside what they bear on, and the way to take your proposals kept recognizable; labels defined where they are used")
  | .readAnswer   => (.sense, "Internal analysis: whether the latest utterance bears on the boundary, and what it does there — dispositions, corrections, an opening, the taking of proposals shown before — read whole against the fused context, whatever form it takes; a reading not yet settled — by this reply or a later one — commits nothing")
  | .converge     => (.interaction .extension, "the convergence evidence CONVERGENCE names, which each return carries")
  | .seam         => (.interaction .extension, "after a return, proceed to the next move the person declared, citing that turn")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution remains context-bound.
This protocol defines the boundary: the reversible work it does for the boundary is the observation
the boundary needs (`observe`); checking further a proposal it filled in, and past the seam the work
the boundary is for, belong to what follows, and this protocol does not execute or enforce them.
Handing either to another agent does not enlarge what an entrustment reaches.
-/

end

end Horismos
```

## Mode Activation

- `/bound` remains directly invocable.
- When a decision boundary or the structure needed to judge it is undefined, invoke the protocol with the available task context.
- Skip AI-guided activation when source-defined direction already settles the requested boundary, when the user expressly requests proceeding without this interaction, or when the same unresolved finding was dismissed and its ground has not changed.

## Protocol

- In every round, keep the way to take your proposals recognizable in the user's language, as the `round` grounding entry names it.
- When the user opens an axis, show the concrete content, assumptions, and dependent consequences needed for that axis, and offer deeper examination or correction where it matters. Decision-rights detail and proposed-content detail can differ by axis; derive the depth from the response rather than a fixed menu of levels.
- When the user opens who settles an item, materialize the `BoundaryClassification` forms in the user's idiom.
- Keep excluded or conditional parts legible in the map where they matter to later reliance.
- When composing a round whose terminology, quotation, neighboring material, or phase order needs attention, read `references/round-composition.md` before presenting it.

## Rules

- **Recognition over Recall**: Present decision-relevant alternatives with their different post-selection states visible before choice: in the map each round returns, beside your filling.
- **Round composition**: Keep each judgment beside its nearest evidence and next-move implication, and place analytical context before the way to take your proposals.
- **Observation before showing**: Observe what the map needs, as `observe` states, before showing it.
- **Whole before selection**: As `readout` and `round` state.
- **Progressive examination**: Let the user's response open, deepen, replace, or close axes of that whole.
- **Dynamic rendering**: Keep boundary questions and examination dimensions runtime-grounded, with a path to extend or replace the framing.
- **Source-bound settlement**: A disposition is made, and a proposal adopted, only as the MORPHISM invariant `proposal-and-settlement-separation` and `DispositionSupported` state.
- **Entrustment reach**: How far an entrustment reaches is as `DispositionSupported` states.
- **Dependency revision**: Reconcile changed ground and transitive dependents before the next return, retaining supported decisions and recording unresolved consequences.
- **Prior-map provenance**: Read an earlier boundary through the turns it cites, as `Cite.lift` states; an unreachable or unsupported setting is advisory. An earlier decision relayed from a record is read as `ContentSupported` and `PriorDispositionSupported` state.
- **After the return**: `dissent` states how your contrary grounds attach.
- **Ambiguous response routing**: Where a response leaves materially different futures viable, present the readings that lead to them and their consequences; how a response is read, and that an unresolved reading commits nothing, are as `readAnswer` states.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change the form directly. Elements fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
