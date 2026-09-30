---
name: bound
description: "The user cannot yet see what a task needs them to decide, or which decisions to keep or entrust: map the whole task first, then open each decision to the depth needed."
---

# Horismos Protocol

Define epistemic boundaries through a recognizable whole map and progressive examination. Type: `(BoundaryUndefined, AI, DEFINE, TaskScope) → DefinedBoundary`.

## Definition

- **Horismos** (ὁρισμός) takes a task whose boundary is undefined, including one whose decision structure or sufficient depth of examination is not yet recognizable, and produces a source-grounded boundary with its unresolved remainder.
- Before asking the user what to settle or entrust, construct the relevant whole provisional map of decisions, obligations, assumptions, and dependencies. A settled goal and a user-supplied inventory are not prerequisites. Bound this whole to the current context and show what remains unknown.
- Let the user open any axis, see the concrete content and consequences needed to judge it, correct the map, and entrust at the depth they find sufficient. The map remains the object of judgment; opening an axis does not require visiting every other one.
- Keep the boundary question distinct from its settlement disposition and from the content of the decision. For ownership, the disposition assigns the named decision directly; an allocation question is a separate domain only when the source makes allocation itself the subject.
- Every round keeps the way to accept the boundary recognizable. Accepting it stops the protocol at that depth and sets the boundary from the context as it then stands; every other response continues or withdraws. Where no decision on the map awaits the user's disposition, the boundary stands as shown, and the user's next words reopen it where they bear on it.

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
  first round(c): readout(c) → present the whole map →
    nothing awaits the person's disposition: the boundary stands, shown with its map and sources
    something awaits it: Stop — the gate holds
  next utterance u: c' := fuse(c, u) →
    it does not bear on the boundary: the session answers it; the run stands as it was
    a withdrawal: the partial record; this run ends
    otherwise: the next round → the boundary stands where the person accepts it or nothing awaits
      them, and the gate holds where something still does
  no further utterance: the run as it stands — a holding gate keeps holding, a boundary that
    stands keeps standing; nothing is selected and nothing settles
-/

/-! ── MORPHISM ──
TaskScope
  → probe_whole_map
  → present_round
  → fuse_utterance ↺ next_round
  → settle_what_the_person_disposed
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

/-- An arrangement you put forward for a decision: its form and, for an entrustment, its reach —
    the kind of choice, its target, and its limit, naming any later act that cannot be undone. It
    is shown for recognition and binds nothing until a person's turn takes it. -/
structure Proposal where
  form  : BoundaryClassification
  reach : String

/-- Who first put a value forward: you, or the person. -/
inductive Proposer | draft | person

/-- What the turn that made a value stand did: gave it in its own words, took a value put forward
    before, or — for a decision's content only — gave a grant whose words reach your choice. -/
inductive Standing | set | adopted | granted

/-- A person's disposition of a decision: its form and reach, who first put it forward, and how it
    came to stand. Only the person disposes, so a disposition is never granted. -/
structure Disposition where
  form       : BoundaryClassification
  reach      : String
  proposer   : Proposer
  standing   : Standing
  notGranted : standing ≠ .granted

/-- **Your judgment**, the record rule for dispositions: the cited turn disposes decision `d` as
    `v`, read against the context as it now stands, on the scope the turn's words reach — an
    instruction, or the taking of an arrangement shown before. The proposer is whoever first put
    the arrangement forward; the standing is what the cited turn itself did: gave it in its own
    words (`set`), or took one put forward before (`adopted`) — where you put it forward, only if
    it was visible as yours, with what decides it and your contrary grounds, before this turn. An
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

/-- What settles a decision's content: a fact, whose source is the citation; or a value held on the
    person's authority, with who first put it forward and how it came to stand. -/
inductive Settled
  | fact (value : String)
  | held (value : String) (proposer : Proposer) (standing : Standing)

def Settled.isHeld : Settled → Bool
  | .fact _  => false
  | .held .. => true

/-- **Your judgment**, the record rule for content: the cited turn settles the content of `d` as
    `s`, read against the context as it now stands. Evidence settles a fact — including that an
    earlier decision exists, which a recorded decision, a commit, or a peer's report relays; a
    relayed decision is cited as that fact and makes no disposition of this run. A held value
    stands only on a person's turn: in their own words (`set`), by taking a value put forward
    before (`adopted`, under the visibility the disposition record rule names), or as your choice
    inside a grant whose words reach it (`granted`, proposer `draft`) — the cited turn is the
    person's grant, and the value stays marked as yours. -/
axiom ContentSupported : Domain → Context P → Turn P → Settled → Prop

def contentOf (d : Domain) : Coord P Settled :=
  { admits := fun _ => True, supports := ContentSupported d }

def isFilled {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Bool
  | .open_ _   => false
  | .filled .. => true

/-- Content stands when it is filled and, for a held value, cites a person's turn; a held value on
    any other citation stands nowhere, and the content stays open. -/
def stands {d : Domain} {c : Context P} : Occ (contentOf (P := P) d) c → Bool
  | .open_ _          => false
  | .filled s src _ _ => !s.isHeld || decide (src.src.val = .person)

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
  proposal      : Option Proposal
  disposition   : Occ (dispositionOf domain) c
  content       : Occ (contentOf domain) c

abbrev BoundaryMap (c : Context P) := List (BoundaryEntry c)

/-- A readable account of the whole map. -/
structure BoundaryEssence (c : Context P) where
  map    : BoundaryMap c
  /-- what the map did not look at, and why -/
  limits : String

/-- **Your judgment**, read afresh at every round: the relevant whole provisional structure from
    the task and everything reachable — decisions, obligations, assumptions, dependencies, and what
    is unknown — each entry with its disposition and content as the context now settles them. What
    the person already named enters as theirs; what you add is marked as your proposal. An open
    item raised earlier that still bears on the task stays on the map even where this round's
    discovery omits it. Guidance for the reading, not steps it must take: observe the facts a
    consequence rests on before showing it, and carry the map as the current sheet with a ledger
    of what changed. -/
axiom readout : (c : Context P) → BoundaryEssence c

/-- A decision awaits the person while neither its disposition nor its content stands. One the
    person kept or asked proposals for is disposed while its value is still open; one an earlier
    decision fixes is settled as a fact. -/
def awaitsEntry {c : Context P} (e : BoundaryEntry c) : Bool :=
  !isFilled e.disposition && !stands e.content

def awaits (c : Context P) : Bool :=
  (readout c).map.any awaitsEntry

/-- **Your judgment**: the cited turn accepts the boundary as it stands, in whatever words, read
    against the context as it now stands. Whether an earlier acceptance still reaches what is now
    at issue is read on the current context: a later correction reopens what it bears on. -/
axiom AcceptanceSupported : Context P → Turn P → Unit → Prop

/-- Only the person accepts the boundary. -/
def acceptanceCoord : Coord P Unit :=
  { admits := (·.val = .person), supports := AcceptanceSupported }

/-- **Your reading**: the person's acceptance; `open_` until one reaches it. -/
axiom acceptance : (c : Context P) → Occ (acceptanceCoord (P := P)) c

/-- **Your judgment**: the cited turn withdraws — the person stops this run without setting the
    boundary — read against the context as it now stands. What the person already disposed stands
    as their words; no proposal of yours is taken by it. Your own reading that the run should end
    withdraws nothing. -/
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

/-- **Your record**: the contrary grounds you presented before the person's turn that set the
    boundary — a disposition you doubt, a premise that may not hold — attached to the boundary;
    empty when there were none. The person's dispositions stand over them: you never rewrite or
    veto one, and new evidence against one is shown before any step that depends on it and cannot
    be undone. -/
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

/-- The record: every disposition that stands over the map. A proposal of yours the person has not
    taken lives only in the context and its presentation. -/
def record (c : Context P) : List (Recorded c) :=
  (readout c).map.flatMap recordOf

/-- What is still open: every decision on the map whose content does not stand, disposed or not,
    by its question. Nothing closes by default. -/
abbrev Residual := List (Domain × String)

def residualOf {c : Context P} (m : BoundaryMap c) : Residual :=
  (m.filter (fun e => !stands e.content)).map (fun e => (e.domain, e.question))

/-- The resolution; `context` is what its citations point into. -/
structure DefinedBoundary (P : Type) where
  context  : Context P
  map      : BoundaryMap context
  record   : List (Recorded context)
  residual : Residual
  dissent  : List String

/-- What stood when the person withdrew: their dispositions and what is still open. It sets no
    boundary. -/
structure PartialRecord (P : Type) where
  context  : Context P
  record   : List (Recorded context)
  residual : Residual

inductive Outcome (P : Type)
  | defined   (b : DefinedBoundary P)
  | withdrawn (p : PartialRecord P)
  | holding   (c : Context P)

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
A step is one arm of a structural recursion over the person's utterances, carrying the context as
it stands and how the run stands. `respond` is your next round, as TOOL GROUNDING's `round` entry
names it, or the boundary shown as it stands where the round completes; `session` is the session's
own answer to an utterance that does not bear on the boundary, which stays in the context.
-/

def close (c : Context P) : DefinedBoundary P :=
  { context := c, map := (readout c).map, record := record c,
    residual := residualOf (readout c).map, dissent := dissent c }

def partialOf (c : Context P) : PartialRecord P :=
  { context := c, record := record c, residual := residualOf (readout c).map }

/-- How the run stands once a round has been presented in `c`: the boundary stands where the
    person's acceptance reaches it or nothing awaits them; otherwise the gate holds. -/
def status (c : Context P) : Outcome P :=
  if isFilled (acceptance c) || !awaits c then .defined (close c) else .holding c

open Classical in
def bound (respond session : Context P → Response P) :
    Context P → Outcome P → List (Utterance P) → Outcome P
  | _, o, []      => o
  | c, o, u :: us =>
    let c' := fuse c u
    if ¬ Reaches c' then bound respond session (c' ++ [(session c').val]) o us
    else if isFilled (withdrawal c') then .withdrawn (partialOf c')
    else
      let c'' := c' ++ [(respond c').val]
      bound respond session c'' (status c'') us

/-- The run opens on its first round. -/
def start (respond session : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  let c₀ := c ++ [(respond c).val]
  bound respond session c₀ (status c₀) us

/-! ── LOOP ──
A correction reopens the affected dependency region in the next readout; an unchanged source
supplies no reason to re-ask a settled decision. Neither scan exhaustion nor a visit count
constitutes sufficiency. The person can accept without opening every axis; what is still open is
carried as residual. Interrupting or steering a run in progress is the host's to deliver; this
block names it only as the point where execution hands off.
-/

/-! ── CONVERGENCE ──
converge on `defined`: the boundary is `close` of the context where the person's acceptance
reaches it or nothing awaits their disposition.
  final readout: read the current map and its cited sources; derive the residual from every
    decision whose content does not stand.
  trace: map each decision on the map to its disposition — who put it forward and how it stood —
    or to the residual, with facts and relayed earlier decisions shown as cited facts and the
    source and effect of relevant corrections. Present the whole arrangement, the dissent
    attached to it, and what the next move may and may not settle under it.
  limits: closure defines a boundary at its constituted scope and depth; it supplies neither a
    fixed project goal nor proof of the person's comprehension or exhaustive discovery.
  a withdrawal keeps its partial record.
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

inductive Op | probe | readout | round | readAnswer | converge | withdrawal | seam

def grounding : Op → Annot × String
  | .probe        => (.observe, "record read, artifact read, artifact search: read the current context and reachable records; construct the relevant provisional whole with uncertain goals and dependencies exposed")
  | .readout      => (.observe, "record read, artifact read: derive the whole map and the opened detail beside their current sources at every round; read each disposition and content by the turn that set it")
  | .round        => (.interaction .constitution, "the whole map — the person's own lines as theirs, your additions marked as proposals, each decision with its evidence, what depends on it and what getting it wrong costs, and any entrustment's reach, every later act that cannot be undone in view — what the map did not look at, the choices still open beside the round's question, your contrary grounds before the answer, and the way to accept the boundary as it stands kept recognizable; labels defined where they are used; yield for the whole response")
  | .readAnswer   => (.sense, "Internal analysis: whether the latest utterance bears on the boundary, and what it does there — dispositions, corrections, an opening, an acceptance, a withdrawal — read whole against the fused context, whatever form it takes; an unsettled reading continues and commits nothing")
  | .converge     => (.interaction .extension, "DefinedBoundary as it stands — its map, its record with who put each disposition forward and how it stood, cited facts, the residual, the dissent, and its limits — with the way to reopen it; where nothing awaited the person, say so")
  | .withdrawal   => (.interaction .extension, "at the person's word: what you took as withdrawn, and the partial record with its limits; nothing open is entrusted, and the person's next words correct it")
  | .seam         => (.interaction .extension, "after the boundary stands, proceed to the next move the person declared — a chain they named, an adopted policy, or a grant — citing that source; every checkpoint whose own contract requires the person's response still fires, and every later act that cannot be undone needs its own authorization")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution remains context-bound.
A receiving protocol or delegate reads DefinedBoundary with its context: the whole map, its record,
and its citations, never an uncited task list. It resolves the relevant entry's question,
applicability, dependencies, limits, and cited sources before relying on a disposition or content.
Only a recorded disposition is a grant, and it reaches only what was shown of it; a proposal and
open content are read as such, and a relayed earlier decision is a cited fact. UserSupplies leaves
the person to supply the value. AIPropose permits proposal work while the person keeps the
selection. AIAutonomous permits choice only inside the recorded reach, and that choice is recorded
as yours. A missing entry, an unreadable citation, or a changed prerequisite leaves that judgment
unresolved; where examination needs evidence or a capability this run lacks, name what is needed
and keep the judgment pending; continue independent authorized work and reopen the affected
boundary before dependent settlement. A grant to perform work preserves every checkpoint whose own
contract requires the person's response, and reassignment does not enlarge authority. This
protocol defines the boundary; it does not execute or enforce downstream work.
-/

end

end Horismos
```

## Mode Activation

- `/bound` remains directly invocable.
- When a decision boundary or the structure needed to judge it is undefined, invoke the protocol with the available task context. Keep goal, success criteria, and scope open where the user has left them open.
- During AI-guided activation, apply current safety boundaries, capability limits, and explicit instructions. Skip activation when source-defined direction already settles the requested boundary, when the user expressly requests proceeding without this interaction, or when the same unresolved finding was dismissed and its ground has not changed.
- On explicit invocation where nothing on the map awaits the user's disposition — every decision already set by their words or fixed by a cited earlier decision — the first round shows that map with its sources and a path to reopen missed structure, and the boundary stands as shown.

## Protocol

- At the first round, show the relevant whole draft before asking the user to choose its applicable parts or examination depth. Give every included item its decision-relevant reason, what getting it wrong would cost, and its conditional connections. State the scope of discovery and what is unknown; do not require the user to invent an obligation inventory. What the user already said enters the map as theirs; what you add is marked as your proposal.
- When the goal is open, distinguish the work that can investigate it, the judgment that would select it, and obligations conditional on that selection. Propose a way to handle those questions without supplying an unchosen goal.
- In every round, make existing user decisions, choices made inside a grant, unaccepted proposals, facts relayed from earlier decisions, and unresolved items recognizable through their source and setting status. Put the choices still open beside the round's question, show every proposal that would entrust an irreversible later act to AI with its reach, place your contrary grounds before the question, and keep the way to accept the boundary as it stands recognizable, in the user's language.
- When the user opens an axis, show the concrete content, assumptions, alternatives, and dependent consequences needed for that axis. Keep the whole overview in view and offer deeper examination or correction where it matters. Decision-rights detail and proposed-content detail can differ by axis; derive the depth from the response rather than a fixed menu of levels.
- At an opened settlement question, materialize UserSupplies, AIPropose, and AIAutonomous in the user's idiom: the user supplies the decision, AI proposes for the user's selection, or AI chooses within stated limits. A displayed default is one of these proposals and binds only through its actual acceptance.
- When the user corrects an assumption, the scope, or the question the boundary answers, the next round reads the corrected context: revise affected content and obligations, show their changed implications, and preserve independent commitments. Keep excluded or conditional parts legible in the residual where they matter to later reliance.
- When the user accepts the boundary as it stands, stop at that depth. The acceptance takes the proposals it covers only where each was shown as yours with its deciding evidence and your contrary grounds; what it does not cover stays open in the residual. Present the constituted whole and its remaining questions without asking for a second approval of the same arrangement.
- When no decision on the map awaits the user's disposition, show the map as it stands, say that the boundary stands, and stop; the user's next words reopen it where they bear on it.
- When a response is not yet readable as continuing, accepting, or withdrawing, continue: the next round shows the candidate readings with their consequences, and nothing is committed from the unsettled reading.
- When the user turns to other work, answer it; the boundary stays as it stood — a gate that holds keeps holding and a boundary that stands keeps standing — and nothing is closed on the user's behalf.
- Before handing off or using a resulting boundary, read the COMPOSITION contract with its cited sources. Preserve the holder of every retained judgment, the reach of each grant, and any condition that must be revisited.
- When composing a round whose terminology, quotation, neighboring material, or phase order needs attention, read `references/round-composition.md` before presenting it.

## Rules

- **Recognition over Recall**: Present structured options with anticipatable post-selection states.
- **Round composition**: Keep each judgment beside its nearest evidence and next-move implication, and place analytical context before the gate.
- **Whole before selection**: Construct and present the relevant provisional whole before asking what to settle, inspect, or entrust; the user's existing goal and map can remain incomplete.
- **Progressive examination**: Let the user's response open, deepen, replace, or close axes of that whole. Bind requested examination to the next round; a request to see content adopts none of it.
- **Dynamic rendering**: Keep boundary questions and examination dimensions runtime-grounded, with recognizable seeds and a path to extend or replace the framing.
- **Source-bound settlement**: A disposition is made only by a user's utterance that supports it; a proposal, an AI turn, inspection, and silence dispose nothing. Record who put each disposition forward and how it stood, apart from each other. An AI proposal is adopted only where it was shown as yours, with what decides it and your contrary grounds, before the user's turn; apply acceptance only within its actual referent and limits.
- **Entrustment reach**: An entrustment reaches what was shown of it. A later act that cannot be undone is entrusted only where its consequence was shown by kind, target, and limit; an earlier authorization of the same kind, target, and limit is not asked for again.
- **Dependency revision**: Reconcile changed ground and transitive dependents before the next round or the closing read, retaining supported decisions and recording unresolved consequences.
- **Prior-map provenance**: Read an earlier boundary through the turns it cites. Its citation still points at the same source; whether that source still supports the settlement is judged against the context that now stands, and an unreachable or unsupported setting is advisory. An earlier decision relayed from a record is a cited fact, not a disposition of this run.
- **After closure**: Never rewrite or veto a user's disposition. Attach your contrary grounds to the boundary where the user set it over them, raise a disposition again only on new evidence, and show that evidence before any dependent step that cannot be undone.
- **Settlement across delegation**: Carry and read the source-defined question, judgment holder, limits, dependencies, and residual at downstream use; work reassignment and a summary supply no additional grant.
- **Closing**: Keep the way to accept the boundary as it stands recognizable in every round, with every irreversible AI-delegation proposal in view. The boundary stands where the user accepts it or no decision awaits their disposition; silence and other work leave the run as it stood, and scan exhaustion or a visit count supplies no acceptance.
- **Ambiguous response routing**: Read mixed responses whole; when materially different futures remain viable, continue and present those readings and their consequences. Commit nothing from an unresolved reading. Never ask the user to classify their own words into the disposition forms.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change the form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
