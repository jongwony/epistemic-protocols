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

def Utterance (P : Type) := {e : Turn P // e.basis = some .utterance}
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

/-! Proofs of the theorems the block above states. The block above is the SKILL.md Lean
    block verbatim; lean-definition checks that prefix and matches every stated signature. -/

namespace Horismos

variable {P : Type}
variable (respond : Context P → Response P)

theorem fuse_extends {P : Type} (c : Context P) (u : Utterance P) :
    ∃ t, fuse c u = c ++ t := ⟨[u.val], rfl⟩

theorem ai_never_grounds {P : Type} (e : Turn P) (h : e.origin = .assistant) :
    e.basis = none := by simp [Turn.basis, h]

theorem silence (c : Context P) : bound respond c [] = .holding c := rfl

theorem continue_folds (c : Context P) (xs ys : List (Utterance P))
    (h : AllCont respond c xs) :
    bound respond c (xs ++ ys) = bound respond (foldRounds respond c xs) ys := by
  induction xs generalizing c with
  | nil => rfl
  | cons u us ih =>
    simp only [AllCont] at h
    simp only [List.cons_append, bound, h.1, foldRounds]
    exact ih _ h.2

theorem stop_here (c : Context P) (u : Utterance P) (us : List (Utterance P))
    (h : verdict (fuse c u) = .finish) :
    bound respond c (u :: us) = .defined (close (fuse c u)) := by
  simp [bound, h]

theorem defined_ends_in_utterance (c : Context P) (us : List (Utterance P))
    (b : DefinedBoundary P) (h : bound respond c us = .defined b) :
    ∃ (c₀ : Context P) (u : Utterance P), b.context = fuse c₀ u := by
  induction us generalizing c with
  | nil => simp [bound] at h
  | cons u us ih =>
    simp only [bound] at h
    split at h
    · exact ih _ h
    · cases h; exact ⟨c, u, rfl⟩
    · cases h
    · cases h

end Horismos
