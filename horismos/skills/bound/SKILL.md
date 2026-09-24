---
name: bound
description: "Define epistemic boundaries from a provisional whole map, opening decisions to the depth needed for delegation. Type: (BoundaryUndefined, AI, DEFINE, TaskScope) → DefinedBoundary"
---

# Horismos Protocol

Define epistemic boundaries through a recognizable whole map and progressive examination. Type: `(BoundaryUndefined, AI, DEFINE, TaskScope) → DefinedBoundary`.

## Definition

- **Horismos** (ὁρισμός) takes a task whose boundary is undefined, including one whose decision structure or sufficient depth of examination is not yet recognizable, and produces a source-grounded boundary with its unresolved remainder.
- Before asking the user what to settle or entrust, construct the relevant whole provisional map of decisions, obligations, assumptions, and dependencies. A settled goal and a user-supplied inventory are not prerequisites. Bound this whole to the current context and show what remains unknown.
- Let the user open any axis, see the concrete content and consequences needed to judge it, correct the map, and entrust at the depth they find sufficient. The map remains the object of judgment; opening an axis does not require visiting every other one.
- Keep the boundary question distinct from its settlement disposition and from the content of the decision. For ownership, the disposition assigns the named decision directly; an allocation question is a separate domain only when the source makes allocation itself the subject.
- Every round ends with the closing offer. Accepting it stops the protocol at that depth and sets the boundary from the context as it then stands; every other response continues, withdraws, or names a different deficit.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written.
Every `opaque` declaration is a judgment that is yours to make from the material in front of
you; its doc comment says what you judge there, and nothing in this block decides it for you.
Every `def`, `inductive`, and `structure` is fixed by the contract. A `theorem` line inside a
doc comment states a consequence the contract already has; it is proved outside this block
and asks nothing further of you.
-/

/-! ── FLOW ──
Horismos(T) → bound(c, utterances), where c is the fused session context:
  round(c): readout(c) → present the whole map, the round question with its open choices,
    every irreversible AI-delegation proposal, and the closing offer → Stop
  next utterance u: c' := fuse(c, u) → verdict(c') →
    cont: round(c')                         (inspection, correction, a changed question)
    finish: DefinedBoundary(settled(c'))    (the closing offer accepted)
    withdraw: partial record(settled(c'))   (no DefinedBoundary)
    route(d): hand off the deficit d
  no utterance: the gate holds; nothing is selected and nothing settles
-/

/-! ── MORPHISM ──
TaskScope
  → probe_whole_map
  → present_round_with_closing_offer
  → fuse_utterance ↺ next_round
  → settle_what_the_acceptance_covers
  → DefinedBoundary
requires: boundary_undefined(T)
deficit: BoundaryUndefined
preserves: task_identity(T)       -- the purpose and limits actually supplied, including their open coordinates and authorized revisions
invariant: Definition over Assumption
invariant: proposal-and-settlement-separation   -- presence, inspection, silence, and work allocation settle nothing; a retained judgment is filled only by a person's utterance
-/

namespace Horismos

/-! ── GROUND ──
The session primitive this contract reads.
-/

inductive Origin | person | assistant | external | peer | injected | unknown
inductive Form | statement | observation | request | reasoning | summary | instruction
inductive Basis | utterance | testimony | observation | report
  deriving DecidableEq

structure Turn (P : Type) where
  origin  : Origin
  form    : Form
  content : P

abbrev Context (P : Type) := List (Turn P)

/-- What a turn may ground directly: eligibility, not truth or instruction priority. -/
def Turn.basis {P : Type} (e : Turn P) : Option Basis :=
  match e.origin, e.form with
  | .person, .statement     => some .utterance
  | .person, .observation   => some .testimony
  | .external, .observation => some .observation
  | .peer, .statement       => some .report
  | _, _                    => none

/-- Any turn a person sent, whatever its form; the form decides what it may ground
    (`Turn.basis`). -/
def Utterance (P : Type) := {e : Turn P // e.origin = .person}
def Response (P : Type) := {e : Turn P // e.origin = .assistant}
def Evidence (P : Type) := {e : Turn P //
  e.basis = some .observation ∨ e.basis = some .report ∨ e.basis = some .testimony}

def fuse {P : Type} (c : Context P) (u : Utterance P) : Context P := c ++ [u.val]

structure Cite {P : Type} (c : Context P) where
  idx  : Nat
  lt   : idx < c.length
  kind : Basis
  ok   : (c[idx]'lt).basis = some kind

/-- `supports` is the model's reading. -/
structure Coord (P A : Type) where
  admits   : Basis → Prop
  supports : Context P → Turn P → A → Prop

/-- `open_` may carry a candidate citation whose support is still short. -/
inductive Occ {P A : Type} (q : Coord P A) (c : Context P)
  | open_  (candidate : Option (Cite c))
  | filled (a : A) (src : Cite c) (allowed : q.admits src.kind)
      (supported : q.supports c (c[src.idx]'src.lt) a)

/-!
theorem fuse_extends {P : Type} (c : Context P) (u : Utterance P) :
    ∃ t, fuse c u = c ++ t

theorem ai_never_grounds {P : Type} (e : Turn P) (h : e.origin = .assistant) :
    e.basis = none
-/

/-- The same turn, cited from a longer context; what it supports is judged again against the
    context that now stands. -/
def Cite.lift {P : Type} {c : Context P} (s : Cite c) (t : Context P) : Cite (c ++ t) :=
  { idx := s.idx
    lt := by have := s.lt; simp; omega
    kind := s.kind
    ok := by rw [List.getElem_append_left s.lt]; exact s.ok }

/-! ── TYPES ── -/

variable {P : Type}

/-- `TaskScope`: the task or concern needing a boundary; its goal, structure, scope, and
    desired examination depth may remain open. -/
abbrev TaskScope (P : Type) := Context P

/-- Stable identity for a decision, obligation, premise, or unresolved question;
    runtime-grounded, not a fixed taxonomy. -/
abbrev Domain := String

/-- The settlement disposition of a named boundary question. For ownership it assigns that
    decision directly; for another question it assigns settlement of that boundary value. -/
inductive BoundaryClassification
  /-- the source's retained judgment holder supplies the value -/
  | userSupplies
  /-- AI develops candidates; selection remains with that holder -/
  | aiPropose
  /-- AI chooses within the source-defined limits, including among viable alternatives -/
  | aiAutonomous

/-- **Your judgment**: the cited turn establishes this disposition for domain `d` in `c` —
    an instruction, an informed acceptance, or an authorized choice that names it. -/
opaque DispositionSupported : Domain → Context P → Turn P → BoundaryClassification → Prop

/-- **Your judgment**: the cited turn sets this decision content for `d` in `c`. Under an
    `aiAutonomous` grant, the grant is the cited turn and the content must lie within its
    limits. -/
opaque ContentSupported : Domain → Context P → Turn P → String → Prop

def dispositionOf (d : Domain) : Coord P BoundaryClassification :=
  { admits := (· = .utterance), supports := DispositionSupported d }

/-- The content of `d`: filled by an utterance, by testimony or an observation that settles a
    fact, or by a choice made inside a cited grant. -/
def contentOf (d : Domain) : Coord P String :=
  { admits := fun _ => True, supports := ContentSupported d }

/-- One entry of the boundary map, read against the context `c`. -/
structure BoundaryEntry (c : Context P) where
  domain        : Domain
  question      : String
  /-- why the item bears on this boundary -/
  relevance     : String
  evidence      : List (Cite c)
  /-- entries whose change may alter this one; an unknown prerequisite is an entry, not a
      fabricated answer -/
  dependsOn     : List Domain
  /-- current or conditional reach -/
  applicability : String
  /-- an AI suggestion shown for recognition -/
  proposal      : Option BoundaryClassification
  disposition   : Occ (dispositionOf domain) c
  content       : Occ (contentOf domain) c
  /-- what is still open, why, and what must happen before dependent work relies on it;
      explicitly empty when none -/
  remainder     : String

abbrev BoundaryMap (c : Context P) := List (BoundaryEntry c)

/-- A readable account of the whole map. -/
structure BoundaryEssence (c : Context P) where
  map           : BoundaryMap c
  /-- the axes the user asked to open, shown beside their nearest evidence -/
  opened        : List Domain
  question      : String
  openChoices   : List String
  irreversible  : List Domain

-- elab: an empty witness lets `readout` be declared `opaque`; it adds no meaning.
instance {c : Context P} : Inhabited (BoundaryEssence c) := ⟨⟨[], [], "", [], []⟩⟩

/-- The fixed closing offer that ends every round, rendered in the user's language. -/
def closingOffer : String :=
  "Say \"as is\" and I will stop here and set the boundary."

/-- **Your judgment**: construct the relevant whole provisional structure from the task and
    everything reachable — decisions, obligations, assumptions, dependencies, and what is
    unknown. -/
opaque readout : (c : Context P) → BoundaryEssence c

/-- **Your judgment**: the proposal for `d` would entrust to AI a later act that cannot be
    undone. -/
opaque Irreversible : Context P → Domain → Prop

/-- **Your judgment**: `s` is a choice still open at this round. -/
opaque OpenChoice : Context P → String → Prop

/-- What every round presentation owes, with no extra turn. -/
def RoundOwes (c : Context P) (r : BoundaryEssence c) : Prop :=
  (∀ s, OpenChoice c s → s ∈ r.openChoices) ∧
  (∀ e ∈ r.map, e.proposal = some .aiAutonomous → Irreversible c e.domain →
      e.domain ∈ r.irreversible)

/-- A named deficit the request turns out to carry instead of this one. Evidence needed while
    defining a boundary does not by itself turn the request into one of these. -/
inductive Deficit
  /-- a missing pre-execution fact (hint: /inquire) -/
  | contextInsufficient
  /-- analytical lenses for an inquiry (hint: /frame) -/
  | frameworkAbsent
  /-- what a mapping licenses about a target account already in play (hint: /ground) -/
  | mappingUncertain
  /-- a contrast that must be instantiated before its direction is recognizable (hint: /preview) -/
  | directionUnrecognizable
  /-- a deficit the user names that no listed constructor names; emitted bare -/
  | emergent (name : String)

/-- What the fused context says the user did with the round. -/
inductive Verdict
  /-- inspection, correction, a changed question, or any reading not yet settled -/
  | cont
  /-- the closing offer accepted: stop at this depth -/
  | finish
  /-- exit without a boundary -/
  | withdraw
  /-- the request is a different deficit -/
  | route (d : Deficit)
  deriving Inhabited  -- elab: lets `verdict` be declared `opaque`

/-- **Your judgment** on the whole latest utterance read with the context; a request to inspect
    adopts nothing. -/
opaque verdict : Context P → Verdict

abbrev Residual := List (Domain × String)

/-- **Your judgment**, read at the moment the round closes: the map as the context now settles
    it. Where the latest utterance accepts the closing offer, that utterance is the citation
    that fills every disposition it covers, proposals shown in the last round included. What
    the acceptance does not cover stays open, with its remainder. -/
opaque settled : (c : Context P) → BoundaryMap c

def residualOf {c : Context P} (m : BoundaryMap c) : Residual :=
  (m.filter (fun e => e.remainder ≠ "")).map (fun e => (e.domain, e.remainder))

/-- The resolution; `context` is what its citations point into. -/
structure DefinedBoundary (P : Type) where
  context  : Context P
  map      : BoundaryMap context
  residual : Residual

inductive Outcome (P : Type)
  | defined   (b : DefinedBoundary P)
  /-- the partial record: what stood when the user withdrew; no DefinedBoundary -/
  | withdrawn (b : DefinedBoundary P)
  | routed    (d : Deficit)
  | holding   (c : Context P)

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
One round is one step of a structural recursion over the user's utterances. The run starts
from the context in which the first round — `probe` over the task and everything reachable,
then its readout with the closing offer — has been presented.
-/

def close (c : Context P) : DefinedBoundary P :=
  { context := c, map := settled c, residual := residualOf (settled c) }

/-- `respond` is your next round: the presentation turn for `readout c`, carrying what
    `RoundOwes` requires and ending with `closingOffer`. -/
def bound (respond : Context P → Response P) : Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let c' := fuse c u
    match verdict c' with
    | .cont     => bound respond (c' ++ [(respond c').val]) us
    | .finish   => .defined (close c')
    | .withdraw => .withdrawn (close c')
    | .route d  => .routed d

/-! ── LOOP ──
A correction reopens the affected dependency region in the next readout; an unchanged source
supplies no reason to re-ask a settled decision. Neither scan exhaustion nor a visit count
constitutes sufficiency. The user can finish without opening every axis; what is still open is
carried as residual. Interrupting or steering a run in progress is the host's to deliver; this
block names it only as the point where execution hands off, and without such a channel
`finish` still comes only from the closing offer being accepted.
-/

variable (respond : Context P → Response P)

def roundStep (c : Context P) (u : Utterance P) : Context P :=
  fuse c u ++ [(respond (fuse c u)).val]

def AllCont : Context P → List (Utterance P) → Prop
  | _, []      => True
  | c, u :: us => verdict (fuse c u) = .cont ∧ AllCont (roundStep respond c u) us

def foldRounds : Context P → List (Utterance P) → Context P
  | c, []      => c
  | c, u :: us => foldRounds (roundStep respond c u) us

/-!
Silence sets no boundary.
theorem silence (c : Context P) : bound respond c [] = .holding c

Continued rounds fold into the context: what follows depends on the context alone.
theorem continue_folds (c : Context P) (xs ys : List (Utterance P))
    (h : AllCont respond c xs) :
    bound respond c (xs ++ ys) = bound respond (foldRounds respond c xs) ys
-/

/-! ── CONVERGENCE ──
converge only on `finish`: the boundary is `close` of the context at the accepting utterance.
  final readout: read the current map and its cited sources; derive the residual from every
    nonempty remainder, explicitly empty when there is none.
  trace: map each recorded boundary item to its settlement or its explicitly carried
    remainder, with the source and effect of relevant corrections. Present the whole
    arrangement and what the next move may and may not settle under it.
  limits: closure defines a boundary at its constituted scope and depth; it supplies neither a
    fixed project goal nor proof of the user's comprehension or exhaustive discovery.
  non-convergent exits keep their finding or partial record.
-/

/-!
The boundary is set where the user accepted the closing offer, from the context at that
point; later utterances do not reach it.
theorem stop_here (c : Context P) (u : Utterance P) (us : List (Utterance P))
    (h : verdict (fuse c u) = .finish) :
    bound respond c (u :: us) = .defined (close (fuse c u))

A DefinedBoundary always follows a person's utterance: its context ends with one.
theorem defined_ends_in_utterance (c : Context P) (us : List (Utterance P))
    (b : DefinedBoundary P) (h : bound respond c us = .defined b) :
    ∃ (c₀ : Context P) (u : Utterance P), b.context = fuse c₀ u
-/

/-! ── TOOL GROUNDING ── -/
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed

inductive Annot | sense | observe | track | transform | dispatch | constitution | extension

inductive Op | probe | readout | round | verdict | finalReadout | converge | withdrawal
             | routeExit | seam

def grounding : Op → Annot × String
  | .probe        => (.observe, "record read, artifact read, artifact search: read the current context and reachable records; construct the relevant provisional whole with uncertain goals and dependencies exposed")
  | .readout      => (.observe, "record read, artifact read: derive the whole map and the opened detail beside their current sources at every round; classify content by its actual setting act")
  | .round        => (.constitution, "present: the whole map, the question with its open choices, every irreversible AI-delegation proposal, and the closing offer; yield for the whole response")
  | .verdict      => (.sense, "Internal analysis: read the whole latest utterance with the fused context; an unsettled reading continues")
  | .finalReadout => (.observe, "record read, artifact read: derive the settled map, residual, and setting sources from the context at the accepting utterance")
  | .converge     => (.extension, "TextPresent+Proceed: present DefinedBoundary with its limits, source-grounded trace, and required next treatment")
  | .withdrawal   => (.extension, "TextPresent+Proceed: present the partial record with its limits and required next treatment")
  | .routeExit    => (.extension, "TextPresent+Proceed: relay the deficit and its basis with the command hint where one exists")
  | .seam         => (.extension, "TextPresent+Proceed: at a user-declared continuation, cite that source and proceed to the named next protocol; every required checkpoint there still fires")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution remains context-bound.
A receiving protocol or delegate reads DefinedBoundary with its context. It resolves the
relevant entry's question, applicability, dependencies, limits, and cited sources before
relying on a disposition or content. Only a filled disposition is a grant; a proposal and open
content are read as such. UserSupplies leaves the retained holder to supply the value.
AIPropose permits proposal work while retaining that holder's selection. AIAutonomous permits
choice only inside the cited grant. A missing entry, an unreadable citation, or a changed
prerequisite leaves that judgment unresolved; continue independent authorized work and reopen
the affected boundary before dependent settlement. A grant to perform work preserves every
checkpoint whose own contract requires the user's response, and reassignment does not enlarge
authority. This protocol defines the boundary; it does not execute or enforce downstream work.
-/

end Horismos
```

## Mode Activation

- `/bound` remains directly invocable.
- When a decision boundary or the structure needed to judge it is undefined, invoke the protocol with the available task context. Keep goal, success criteria, and scope open where the user has left them open.
- During AI-guided activation, apply current safety boundaries, capability limits, and explicit instructions. Skip activation when source-defined direction already settles the requested boundary, when the user expressly requests proceeding without this interaction, or when the same unresolved finding was dismissed and its ground has not changed.
- On explicit invocation with no undefined boundary, the first round presents that finding with its reasoning and a path to reopen missed structure, and ends with the closing offer like any other round.

## Protocol

- At the first round, show the relevant whole draft before asking the user to choose its applicable parts or examination depth. Give every included item its decision-relevant reason and conditional connections. State the scope of discovery and what is unknown; do not require the user to invent an obligation inventory.
- When the goal is open, distinguish the work that can investigate it, the judgment that would select it, and obligations conditional on that selection. Propose a way to handle those questions without supplying an unchosen goal.
- In every round, make existing user decisions, exercised AI discretion, unaccepted proposals, and unresolved items recognizable through their source and setting status. Put the choices still open beside the round's question, and show every proposal that would entrust an irreversible later act to AI, so that accepting the displayed arrangement has a visible consequence at the moment it is offered. End the round with the closing offer, rendered in the user's language.
- When the user opens an axis, show the concrete content, assumptions, alternatives, and dependent consequences needed for that axis. Keep the whole overview in view and offer deeper examination or correction where it matters. Decision-rights detail and proposed-content detail can differ by axis; derive the depth from the response rather than a fixed menu of levels.
- At an opened settlement question, materialize UserSupplies, AIPropose, and AIAutonomous in the user's idiom: the named person supplies the decision, AI proposes for that person's selection, or AI chooses within stated limits. A displayed default is one of these proposals and binds only through its actual acceptance.
- When the user corrects an assumption, the scope, or the question the boundary answers, the next round reads the corrected context: revise affected content and obligations, show their changed implications, and preserve independent commitments. Keep excluded or conditional parts legible in the remainder where they matter to later reliance.
- When the user accepts the closing offer, stop at that depth. The acceptance settles what it covers, including the proposals shown in that round; what it does not cover stays open in the residual. Present the constituted whole and its remaining questions without asking for a second approval of the same arrangement.
- When a response is not yet readable as one of continuing, accepting, withdrawing, or a different deficit, continue: the next round shows the candidate readings with their consequences, and nothing is committed from the unsettled reading.
- When the request turns out to need a different resolution — a missing pre-execution fact, analytical lenses, what a mapping licenses, or a contrast that must be instantiated — relay that deficit with its basis and the command hint, and end here.
- Before handing off or using a resulting boundary, read the COMPOSITION contract with its cited sources. Preserve the holder of every retained judgment, the reach of each grant, and any condition that must be revisited.
- When composing a round whose terminology, quotation, neighboring material, or phase order needs attention, read `references/round-composition.md` before presenting it.

## Rules

- **Recognition over Recall**: Present structured options with anticipatable post-selection states.
- **Round composition**: Keep each judgment beside its nearest evidence and next-move implication, and place analytical context before the gate.
- **Whole before selection**: Construct and present the relevant provisional whole before asking what to settle, inspect, or entrust; the user's existing goal and map can remain incomplete.
- **Progressive examination**: Let the user's response open, deepen, replace, or close axes of that whole. Bind requested examination to the next round; a request to see content adopts none of it.
- **Dynamic rendering**: Keep boundary questions and examination dimensions runtime-grounded, with recognizable seeds and a path to extend or replace the framing.
- **Source-bound settlement**: A retained judgment is filled only by a person's utterance that supports it; a proposal, an AI turn, inspection, and silence fill nothing. Apply acceptance only within its actual referent and limits.
- **Relay under closure**: Fill a retained judgment's proposal by relay within a round only because closure requires the user's acceptance to cover it; what the acceptance does not cover stays open.
- **Dependency revision**: Reconcile changed ground and transitive dependents before the next round or the closing read, retaining supported decisions and recording unresolved consequences.
- **Prior-map provenance**: Read an earlier boundary through the turns it cites. Its citation still points at the same source; whether that source still supports the settlement is judged against the context that now stands, and an unreachable or unsupported setting is advisory.
- **Settlement across delegation**: Carry and read the source-defined question, judgment holder, limits, dependencies, and residual at downstream use; work reassignment and a summary supply no additional grant.
- **Closing offer**: End every round with the closing offer, and with every irreversible AI-delegation proposal in view. Set the boundary only when the offer is accepted; silence holds the gate, and scan exhaustion, a visit count, or an already-determined arrangement supplies no acceptance.
- **Zero-signal surfacing**: Present a zero-signal finding with its reasoning and a path to reopen missed structure.
- **Ambiguous response routing**: Read mixed responses whole; when materially different futures remain viable, continue and present those readings and their consequences. Commit nothing from an unresolved reading.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change the form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
