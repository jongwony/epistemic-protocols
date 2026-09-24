---
name: sketch
description: "Recognize and revise concrete sketches to discover a form when descriptions cannot settle intent. Type: (FitUnrecognized, Hybrid, SKETCH-RECOGNIZE-CYCLE, FormIntentSeed) → RecognizedForm"
---

# Hypotyposis Protocol

Discover what a form should be by encountering concrete sketches and marking what does not fit, until the user recognizes a specific version as the form for a stated purpose. Type: `(FitUnrecognized, Hybrid, SKETCH-RECOGNIZE-CYCLE, FormIntentSeed) → RecognizedForm`.

## Definition

**Hypotyposis** (ὑποτύπωσις): an outline or sketch — a first drawing of a position rather than its finished statement. A dialogical act for the moment when a form has to be made and the intent behind it cannot yet be settled from descriptions: the user can say what is wrong with a thing in front of them long before they can say what the thing should be, because good fit has no positive description of its own while each misfit is immediate and can be pointed at (Alexander, 1964). So the protocol runs the other way round from a specification: the AI drafts each round's focus, the perception it needs, and its variants, relays the draft with the basis that chose each, and produces the sketches; the user marks a specific version — what does not fit and what to keep — as first-class utterances, settling or sending back the round's readings in the same answer; the AI revises the retained version under those marks; and the loop ends when the user recognizes one version as the form for a stated purpose and names where it lives.

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
Hypotyposis(I) → sketch(c, utterances), where c is the fused session context:
  Phase 0: fitUnrecognized fails → the non-activation basis → not activated
  round(c): the spec relay — this round's focus, the perception it needs, the variant briefs,
    and every provisional coordinate, each with its basis; it yields no turn →
    produce (an Artifact sketch enters c as observed at creation; a Text sketch is carried
    in the presentation) → present → Qfit → Stop
  while a recognition stands unplaced: Qplace → Stop
  next utterance u: c' := fuse(c, u) → verdict(c') →
    cont: where the AI finds a realization the round or the placement needs unavailable, or
      a sibling deficit demonstrated: the boundary relay → account → BoundaryExit, before
      anything further is produced or presented
    cont, a recognition standing: Qplace again
    cont, no new round called for (no marks and no acts, an interrogation): the gate again
    cont: the next round from c' — marks, a fit on this focus, a finish (which starts the
      recognition), a spec revision, or any reading not yet settled; the draft reads them all
    place: retain and verify → every reference resolves: release the rest → RecognizedForm
      | a reference failed: Qplace again with the failure declared; nothing released
    dissolve: account → DissolutionExit
    boundary: account → BoundaryExit
    withdraw: account → EarlyExit
  no utterance: the gate holds; nothing is recognized, placed, or released
-/

/-! ── MORPHISM ──
FormIntentSeed
  → detect          -- deficit predicate over the utterance and the context (silent analysis)
  → bind            -- prior material read from the context: settled where a person's utterance in it settled it, a candidate otherwise, provenance kept
  → relay_round     -- focus, realization, and variant briefs drafted with the basis that chose each, relayed beside the provisional coordinates; nothing is settled here
  → produce         -- one sketch per brief: a brief naming a parent revises that retained version, a parentless brief generates from the material it names or from prior material; each declares what producing it determined that no settled coordinate covered
  → present         -- each sketch from its concretum, what this round can and cannot expose, whether an artifact was observed, and any contrary ground held about it
  → recognize       -- the person's marks on a specific version — misfits, keeps, a fit on this focus, a finish for a stated purpose — and, in the same answer, the readings they settle, replace, or retire
  → place           -- the person names where the recognized version lives and which passed-over versions are kept as revert points; no default for either
  → account         -- every placed reference retained and verified, every other sketch released and verified
  → RecognizedForm
requires: form_purpose_in_scope(I)             -- runtime checkpoint (Phase 0): the work is about to make a form
deficit:  FitUnrecognized                       -- activation precondition (Layer 1/2)
preserves: utterance(I)                          -- the context only grows; the seed is never rewritten
invariant: Concretum Retention                   -- a brief that revises does so on a retained parent; a sketch under judgment is never regenerated from coordinates alone
invariant: Commitment Provenance Preservation    -- a coordinate is settled only by a person's utterance; a later one may replace what an earlier one settled; AI inference alone settles or replaces nothing
invariant: Recognition over Description          -- fit is the person's recognition of a specific version for a stated purpose
-/

namespace Hypotyposis

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

/-- `I`, `FormIntentSeed`: the utterance that asks for a form, and the prior material it names
    or the context already holds — a settled direction, a resolved intent, a candidate field,
    an existing artifact, a prior session's record. Source-neutral; read from the context. -/
abbrev FormIntentSeed (P : Type) := Context P

/-- **Your judgment** at Phase 0: a form-making purpose is in scope, decision-relevant intent
    remains underdetermined, encountering and revising a concrete proposal is what would
    constitute that intent, and the resolution sought is a recognized form with its
    commitments and residuals. -/
opaque fitUnrecognized : Context P → Prop

/-- An emergent label: "information unit", "reading order", "density", "tone". -/
abbrev Axis := String

/-- A determination on an axis, in the person's words or read off a sketch. -/
abbrev Value := String

/-- What a round filters attention toward; an unexpected misfit on any other axis stays
    admissible. -/
inductive Focus
  | axis (a : Axis)
  | question (q : String)

/-- What this round's judgment needs in order to be possible: the perception it rests on —
    narration, spatial layout, interaction, sound — and, where the focus opens an axis
    carrying a standard outside both parties' preference, the referent it is checked against.
    Open, named per round. -/
abbrev Realization := String

/-- The identity of one version; every mark, placement, and disposition points at one. -/
structure SketchRef where
  id    : Nat
  round : Nat

/-- What prior material is and where it came from. -/
structure ReferencedMaterial where
  source  : String
  content : String

/-- One sketch to produce. `some parent`: revise that retained version. `none`: generate from
    the operative coordinates and from the material `source` names, or from the bound prior
    material where it names none — every brief of round 1's first pass, and a fresh start the
    person names at Qfit. A brief may name a parent and a new source together: changing where
    the material comes from does not itself abandon the parent. -/
structure VariantBrief where
  parent  : Option SketchRef
  source  : Option ReferencedMaterial
  commits : List (Axis × Value)

/-- A round's draft. How many variants it produces is drafted here; a count the person stated
    holds until they revise it. -/
structure RoundSpec where
  focus       : Focus
  realization : Realization
  targets     : List VariantBrief
  nonempty    : targets ≠ []

/-- `text`: narration carried in session text. `artifact`: a file under temp isolation,
    versioned at creation. -/
inductive Concretum
  | text (value : String)
  | artifact (versionedRef : String)

structure Sketch where
  ref       : SketchRef
  parents   : List SketchRef
  concretum : Concretum
  focus     : Focus

/-- **Your record**, read from the context: every version produced so far, each retained for
    revision until account. -/
opaque sketches : Context P → List Sketch

/-- **Your record**: the round spec your latest relay presented; `none` before the first. -/
opaque spec : Context P → Option RoundSpec

/-- Where on a sketch a mark points. `whole` admits "something is missing here" with nothing to
    point at, and a property recurring across the sketch, carried in the mark's own words. -/
inductive Anchor
  | element (locator : String)
  | region (bounds : String)
  | whole
  | span (text : String)

/-- A person's utterance anchored on a version; a keep is the positive half of mixed feedback
    and is retained, never dropped. -/
inductive Mark
  | misfit (sketch : SketchRef) (anchor : Anchor) (utterance : String) (axis : Option Axis)
  | keep   (sketch : SketchRef) (anchor : Anchor) (utterance : String)

/-- **Your reading** of every mark the person's utterances placed, each with the utterance it
    came from, carried as said. -/
opaque marks : (c : Context P) → List (Mark × Cite c)

/-- **Your judgment**: the cited turn states or settles value `v` on axis `a` — a settlement of
    a reading shown beside a version, a replacement the person stated, or a commitment they
    made earlier in this context. -/
opaque AxisSupported : Axis → Context P → Turn P → Value → Prop

/-- A coordinate is settled only by a person's statement. A record of a commitment made in an
    earlier session is a candidate for it, never its fill. -/
def axisCoord (a : Axis) : Coord P Value :=
  { admits := (· = .utterance), supports := AxisSupported a }

-- elab: an open witness lets the occupancy readings below be declared `opaque`.
instance {A : Type} {q : Coord P A} {c : Context P} : Inhabited (Occ q c) := ⟨.open_ none⟩

/-- **Your judgment**: how axis `a` stands in `c` — filled by the person's latest utterance that
    settles or replaces it; open where nothing settles it, and where the person retired it with
    nothing in its place. An open axis carries as candidate the material that proposes a value
    without settling it, a record of an earlier session's commitment included. -/
opaque operative : (c : Context P) → (a : Axis) → Occ (axisCoord a) c

/-- A determination the AI puts forward: read from a mark, or rendered into a sketch that no
    settled coordinate covered. It settles nothing; it is shown at the spec relay and again
    beside the version at Qfit. -/
structure Proposal (c : Context P) where
  axis   : Axis
  value  : Value
  /-- the mark it was read from; `none` for a production's own determination -/
  mark   : Option (Cite c)
  /-- the version it was rendered into; `none` for a reading of a mark -/
  sketch : Option SketchRef

/-- **Your record**, read from the context: the provisional coordinates — every proposal the
    person has neither settled, replaced, nor rejected. -/
opaque provisional : (c : Context P) → List (Proposal c)

/-- Adequacy on one focus for one version, as the person said it. -/
structure FitWitness (c : Context P) where
  sketch   : SketchRef
  scope    : Focus
  src      : Cite c
  byPerson : src.kind = .utterance

/-- **Your reading** of every fit the person gave on a focus. -/
opaque witnesses : (c : Context P) → List (FitWitness c)

/-- **Your judgment**: the witness no longer holds as given — the version it names was
    superseded, or the context has moved on it since. A stale witness is shown as stale and
    never reused silently; what supersedes a version is read here. -/
opaque Stale : (c : Context P) → FitWitness c → Prop

/-- Finish is recognition of the assembled form, not of one focus. -/
structure Recognition where
  target       : SketchRef
  purposeScope : String
  residual     : List Axis

/-- **Your judgment**: the cited utterance recognizes `r` — its target a version presented and
    still retained, for the purpose it states. A response carrying marks and a finish is
    marks: recognition names an unmarked version, and a version that was not presented is
    answered, never recognized. -/
opaque RecognitionSupported : Context P → Turn P → Recognition → Prop

def recognitionCoord : Coord P Recognition :=
  { admits := (· = .utterance), supports := RecognitionSupported }

/-- **Your judgment**: the recognition the person's finish gave, standing until the run ends;
    `open_` before a finish. -/
opaque recognition : (c : Context P) → Occ (recognitionCoord (P := P)) c

def isFilled {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Bool
  | .open_ _   => false
  | .filled .. => true

def filledValue {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Option A
  | .open_ _     => none
  | .filled a .. => some a

/-- Qplace is open: a recognition stands, not yet placed. -/
def Placing (c : Context P) : Prop := isFilled (recognition c) = true

/-- A reference the person judges to outlive the session. The durability is their judgment;
    account checks only that the reference resolves to that version's concretum when
    checked. -/
abbrev Location := String

/-- Where the recognized version lives, and which passed-over versions are kept as revert
    points and where; `kept` may be empty. -/
structure Placement where
  location : Location
  kept     : List (SketchRef × Location)

/-- **Your judgment**: the cited utterance names this placement. -/
opaque PlacementSupported : Context P → Turn P → Placement → Prop

/-- Placement has no default: only the person's statement fills it. -/
def placementCoord : Coord P Placement :=
  { admits := (· = .utterance), supports := PlacementSupported }

/-- **Your judgment**: the placement the person's latest answer at Qplace named. -/
opaque placement : (c : Context P) → Occ (placementCoord (P := P)) c

/-- `Fixture`: a recognition witness. It carries no implementation commitment and is not an
    executable specification. -/
structure Fixture where
  ref      : Location
  target   : SketchRef
  scope    : String
  residual : List Axis
  kept     : List (SketchRef × Location)

def fixture (c : Context P) : Option Fixture :=
  match filledValue (recognition c), filledValue (placement c) with
  | some r, some p => some ⟨p.location, r.target, r.purposeScope, r.residual, p.kept⟩
  | _, _           => none

inductive Disposition
  | retained (loc : Location)
  | released
  | releaseFailed (reason : String)
  | retainFailed (reason : String)

/-- **Your reading** of the account observations: a sketch's latest disposition. `retained` is
    read only where the observation shows the reference resolving to that version's exact
    concretum. -/
opaque disposition : Context P → SketchRef → Option Disposition

/-- Every sketch has a declared disposition. -/
def Accounted (c : Context P) : Prop := ∀ s ∈ sketches c, (disposition c s.ref).isSome

/-- Every placed reference verified, and no version kept as a revert point is the recognized
    one: those are the versions the run passed over. -/
def Verified (c : Context P) (f : Fixture) : Prop :=
  (∀ k ∈ f.kept, k.1 ≠ f.target) ∧
  disposition c f.target = some (.retained f.ref) ∧
  ∀ k ∈ f.kept, disposition c k.1 = some (.retained k.2)

/-- What every spec a relay presents owes (Concretum Retention): a revising brief names a
    version produced and not yet disposed of. -/
def SpecOwes (c : Context P) (s : RoundSpec) : Prop :=
  ∀ b ∈ s.targets, ∀ p, b.parent = some p →
    (∃ x ∈ sketches c, x.ref = p) ∧ disposition c p = none

/-- What the fused context says the person did at the gate. Premise: one utterance carries one
    disposition; silence is none of them. -/
inductive Verdict
  /-- marks, a fit on this focus, a finish, a spec revision, an interrogation, a correction, or
      any reading not yet settled — an answer with no marks and no acts included -/
  | cont
  /-- where the standing recognition lives, and which others are kept -/
  | place
  /-- the person accepts or declares that no further encounter is owed: the sharpened
      description made the form recognizable without one, or the activation premise
      collapsed -/
  | dissolve
  /-- the person names a sibling deficit, or a realization this session cannot supply -/
  | boundary
  | withdraw
  deriving Inhabited  -- elab: lets `verdict` be declared `opaque`

/-- **Your judgment** on the whole latest utterance read with the context. -/
opaque verdict : Context P → Verdict

/-- **Your judgment**, before anything further is produced or presented: a realization this
    round requires, or one the placement needs, is one this session cannot supply, or a sibling
    deficit is demonstrated. The boundary relay then takes the place of the next presentation. -/
opaque AIBoundary : Context P → Prop

/-- **Your judgment**: the latest answer calls for a new round — marks, a fit on this focus, a
    fresh start, or a spec revision. An answer with no marks and no acts, and an interrogation
    answered within the sketch's placeholder status, present the gate again with nothing
    produced. -/
opaque Redraws : Context P → Prop

/-- **Your record**: the contrary grounds you presented before the gate the closing utterance
    answered — a version failing a referent it was checked against, a commitment it breaks, a
    dissolution you doubt — attached to the closure; empty when there were none. -/
opaque dissent : Context P → List String

/-- **Your count**, read from the record: which round this is. A marks or fit answer opens the
    next round; a spec revision re-drafts the same one. -/
opaque roundOf : Context P → Nat

/-- The record an exit that recognizes nothing carries: the context after account, and the
    dissent attached to the closure. -/
structure Closing (P : Type) where
  context : Context P
  dissent : List String

/-- `RecognizedForm`, read from `context` as it stood before any release: the settled commitments (`operative`), the fixture,
    the recognition, the trace of every mark, the residual — axes left open and material the
    person entrusted to a round that never came — and the coordinates still `provisional`. -/
structure RecognizedForm (P : Type) where
  context : Context P
  fixture : Fixture
  dissent : List String

inductive Outcome (P : Type)
  /-- `NoActivationRelay`: the failed predicate with its evidence; nothing produced -/
  | notActivated (c : Context P)
  | recognized   (f : RecognizedForm P)
  /-- `DissolutionExit`: a convergent stand-down, no form owed; its basis stated -/
  | dissolved    (r : Closing P)
  /-- `BoundaryExit`: the obligation named; which protocol takes it is the session's -/
  | boundary     (r : Closing P)
  /-- `EarlyExit`: the partial trace over completed rounds; any recognition stays in it -/
  | withdrawn    (r : Closing P)
  | holding      (c : Context P)

/-! ── A-BINDING ──
bind(I) = explicit_arg ∪ recent_form_intent ∪ surfaced_fit_gap
Priority: explicit_arg > recent_form_intent > surfaced_fit_gap
  /sketch "what to make"       → I = the utterance, with the material it names or the context holds
  /sketch (alone)              → I = the most recent form-making intent in session
  "I'd know it when I see it"  → I = the utterance under discussion (AI-detected path: the spec
                                 relay cites the evidence of FitUnrecognized as the run's basis;
                                 a decline of the run is a withdrawal at the first Qfit)
-/

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
A round is one step of a structural recursion over the person's utterances. `relay` is the
spec relay: it presents `spec`, a `RoundSpec` carrying `SpecOwes`, and yields no turn; where
`AIBoundary` holds, the boundary relay takes its place. The
sketches are then produced (`.produce`; in parallel through `.produceDelegate` when a spec has
more than one target, one sketch per executor, each temp-isolated). `respond` is the
presentation ending at Qfit, or at Qplace while a recognition stands.
-/

/-- **Your production** under the relayed spec: each Artifact sketch as observed at creation,
    its versioned reference registered then. A Text sketch is narration the presentation
    (`respond`) carries as recorded. Existing project files stay unchanged. -/
opaque produce : Context P → List (Evidence P)

def runRound (relay : Context P → Response P) (c : Context P) : Context P :=
  let c₁ := c ++ [(relay c).val]
  c₁ ++ (produce c₁).map (·.val)

/-- **Your account** at a placement: retain the recognized version and each kept one at its
    location, and verify that each reference resolves to that version's exact concretum — one
    retry, then the failure is observed. -/
opaque retain : Context P → List (Evidence P)

/-- **Your account** at a terminal: release every sketch the context leaves unplaced — all of
    them on a withdrawal, a dissolution, or a boundary — and verify each absence; a failure
    retries once, then is observed and declared with a handoff. What it leaves is `Accounted`:
    every sketch with a declared disposition. -/
opaque release : Context P → List (Evidence P)

def settle (c : Context P) : Context P := c ++ (retain c).map (·.val)

def closing (c : Context P) : Closing P :=
  { context := c ++ (release c).map (·.val), dissent := dissent c }

def recognize (c : Context P) (f : Fixture) : RecognizedForm P :=
  { context := c ++ (release c).map (·.val), fixture := f, dissent := dissent c }

open Classical in
noncomputable def sketch (relay respond : Context P → Response P) :
    Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let c' := fuse c u
    match verdict c' with
    | .withdraw => .withdrawn (closing c')
    | .dissolve => .dissolved (closing c')
    | .boundary => .boundary (closing c')
    | .place =>
      let c₁ := settle c'
      match fixture c₁ with
      | some f =>
        if Verified c₁ f then .recognized (recognize c₁ f)
        else sketch relay respond (c₁ ++ [(respond c₁).val]) us
      | none => sketch relay respond (c₁ ++ [(respond c₁).val]) us
    | .cont =>
      if AIBoundary c' then .boundary (closing (c' ++ [(relay c').val]))
      else if Placing c' ∨ ¬ Redraws c' then sketch relay respond (c' ++ [(respond c').val]) us
      else
        let c₁ := runRound relay c'
        sketch relay respond (c₁ ++ [(respond c₁).val]) us

open Classical in
noncomputable def start (relay respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  if ¬ fitUnrecognized c then .notActivated c
  else if AIBoundary c then .boundary (closing (c ++ [(relay c).val]))
  else
    let c₁ := runRound relay c
    sketch relay respond (c₁ ++ [(respond c₁).val]) us

/-! ── LOOP ──
Each round re-reads the whole context; the round counter (`roundOf`) is visible at every spec
relay and Qfit. No fixed round cap: a round that re-enters a Constitution gate is dialogue, and
the person can withdraw at any gate. The variant count is drafted per round; a count the person
stated holds until they revise it. At every spec relay, re-present the material the person
entrusted to a later round; a later answer of theirs takes it up or withdraws it.
-/

/-!
Silence recognizes, places, and releases nothing.
theorem silence (relay respond : Context P → Response P) (c : Context P) :
    sketch relay respond c [] = .holding c

No sketch is produced before the spec relay: every round holds the relay turn ahead of what
production wrote.
theorem relay_before_production (relay : Context P → Response P) (c : Context P) :
    ∃ t, runRound relay c = c ++ [(relay c).val] ++ t

While a recognition stands unplaced, or the answer calls for no new round, an answer that
continues produces nothing: the gate is presented again.
theorem held_gate_produces_nothing (relay respond : Context P → Response P) (c : Context P)
    (u : Utterance P) (us : List (Utterance P)) (hv : verdict (fuse c u) = .cont)
    (hb : ¬ AIBoundary (fuse c u)) (hh : Placing (fuse c u) ∨ ¬ Redraws (fuse c u)) :
    sketch relay respond c (u :: us) =
      sketch relay respond (fuse c u ++ [(respond (fuse c u)).val]) us

A reference that does not resolve returns the placement to the person, with nothing released.
theorem unverified_returns_to_placement (relay respond : Context P → Response P)
    (c : Context P) (u : Utterance P) (us : List (Utterance P)) (f : Fixture)
    (hv : verdict (fuse c u) = .place) (hf : fixture (settle (fuse c u)) = some f)
    (hn : ¬ Verified (settle (fuse c u)) f) :
    sketch relay respond c (u :: us) =
      sketch relay respond (settle (fuse c u) ++ [(respond (settle (fuse c u))).val]) us
-/

/-! ── CONVERGENCE ──
converged: a recognized form whose every placed reference verified (`Verified`), or a
dissolution the person closed, with its basis. Every other exit is non-convergent and keeps
its partial record. Convergence evidence: at RecognizedForm, present the trace — each mark →
its interpretation → the revision it drove → how it ended (recognized, replaced, or residual) —
beside the recognized version, its placement, the versions kept as revert points, the settled
commitments, the coordinates still provisional, the residual — axes left open and material
entrusted to a round that never came — and the dissent attached to the closure. Every sketch's
disposition is shown (`Accounted`); a failure is declared with its handoff, never silent. Each
other terminal presents its own payload (TOOL GROUNDING). Demonstrated, not asserted.
-/

/-!
A recognized form is closed only on a verified placement, which keeps no revert point that is
the recognized version.
theorem recognized_verified (relay respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (r : RecognizedForm P)
    (h : sketch relay respond c us = .recognized r) :
    ∃ c₁, Verified c₁ r.fixture ∧ r = recognize c₁ r.fixture

A dissolution is closed only by a person's utterance; the AI's reading of one closes nothing.
theorem dissolved_by_person (relay respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (r : Closing P) (h : sketch relay respond c us = .dissolved r) :
    ∃ (c₀ : Context P) (u : Utterance P), verdict (fuse c₀ u) = .dissolve ∧ r = closing (fuse c₀ u)

A coordinate, a recognition, and a placement are each filled only by a person's statement.
theorem settled_by_utterance {c : Context P} {a : Axis} {s : Cite c}
    (ok : (axisCoord (P := P) a).admits s.kind) : s.kind = .utterance

theorem recognized_by_utterance {c : Context P} {s : Cite c}
    (ok : (recognitionCoord (P := P)).admits s.kind) : s.kind = .utterance

theorem placed_by_utterance {c : Context P} {s : Cite c}
    (ok : (placementCoord (P := P)).admits s.kind) : s.kind = .utterance
-/

/-! ── TOOL GROUNDING ── -/
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed

inductive Annot | sense | observe | track | transform | dispatch | constitution | extension

inductive Op | detect | noActivationRelay | bind | draft | specRelay | produce | produceDelegate
             | present | acquire | qfit | interpret | readAnswer | qplace | account | assemble
             | dissolutionRelay | boundaryRelay | withdraw | converge | seam

def grounding : Op → Annot × String
  | .detect            => (.sense, "Internal analysis: the deficit predicate over the utterance and the context; no external tool")
  | .noActivationRelay => (.extension, "TextPresent+Proceed: the non-activation basis — the failed predicate with its evidence; a sibling deficit seen in the scan is named as a finding and left to the session; not activated")
  | .bind              => (.sense, "Internal analysis: prior material read from the context — settled where a person's utterance in this context settles it, a candidate otherwise, with where it came from; a record of a commitment made in an earlier session is a candidate")
  | .draft             => (.sense, "Internal analysis: focus, realization, and variant briefs drafted from the whole context — the operative coordinates, the provisional readings, the prior material, every mark, and any spec revision the person named — read together rather than from any one of them")
  | .specRelay         => (.extension, "TextPresent+Proceed: the round's draft whole — this round's focus, what the judgment needs, the variant briefs, each with the basis that chose it, and each provisional coordinate with where it came from — laid out so that any of it can be settled, sent back, or replaced at Qfit; fires before anything is produced and settles nothing; on the AI-detected path it cites the evidence of FitUnrecognized as the run's basis; after a spec revision it is re-presented scoped to that revision without counting a round")
  | .produce           => (.transform, "artifact write, environment run: temp-isolated sketches, each with its concretum and a versioned reference registered at creation; a brief naming a parent revises that retained version, a parentless brief generates from the material its source names or from prior material; existing project files are never modified; Text concreta are session text only. Each sketch proposes as coordinates what it was rendered under that no settled coordinate covered, so the person meets those determinations beside the sketch at Qfit")
  | .produceDelegate   => (.dispatch, "delegate (conditional: more than one target; parallel topology: one sketch per executor, each temp-isolated with its reference registered; subordinate to the active runtime policy)")
  | .present           => (.extension, "TextPresent+Proceed: each sketch from its concretum — Text as recorded, an Artifact walked through at its reference, reporting what was observed there or that it was not observed and what was tried — then this round's focus, what this realization cannot expose, which content came from the person and which is the AI's proposal, what this sketch's own production determined, every fit witness (`witnesses`) now stale, and any contrary ground held about a version; a reading that no further encounter is owed is stated with its basis and closes nothing")
  | .acquire           => (.observe, "channel read: utterances anchored on a sketch; the marks arrive as the person's utterances. The channel is a capability the host supplies, named here and bound nowhere in this contract: the person can point at what they saw, and the pointing arrives with the utterance")
  | .qfit              => (.constitution, "present: mandatory recognition gate on a specific version — Mark, Fit on this focus, Finish for a stated purpose — and, riding the same answer, which readings shown beside it the person settles, replaces, or retires; an answer with no marks and no acts presents the gate again; the pre-gate text declares interrogating a sketch, sending back this round's focus, perception, or variants, contesting the premise, naming a boundary, and withdrawing")
  | .interpret         => (.sense, "Internal analysis: marks read against the version they name, that version's brief, and how the round realized it → provisional readings, each citing the mark it came from; never settled here")
  | .readAnswer        => (.sense, "Internal analysis: the latest utterance read whole with the context — the verdict, the marks, a fit, a finish, and the acts on the coordinates in view")
  | .qplace            => (.constitution, "present: mandatory placement gate — the recognized version and the capability it needs, a reference the person judges to outlive the session, beside the versions this run passed over; the person names the location and which of the others are kept and where; no default for either; after a retention failure the failure is declared before the gate, and the same location stays admissible")
  | .account           => (.transform, "artifact write, environment run: retain every placed version and verify each reference resolves to that exact concretum — one retry, then the failure is declared and Qplace presented again with nothing released; once every placed version is verified, release the sketches placement did not keep and verify each — one retry, then ReleaseFailed declared with a handoff")
  | .assemble          => (.sense, "Internal analysis: RecognizedForm read from the context at the verified placement, before any release — the settled commitments, the fixture, the recognition, the trace, the residual, the coordinates still provisional, and the dissent attached to the closure")
  | .dissolutionRelay  => (.extension, "TextPresent+Proceed: when the person accepts or declares that no further encounter is owed — the sharpened description made the form recognizable without one, or the activation premise collapsed — state the basis, relay the settled commitments and every mark, attach any dissent, run account, stand down as DissolutionExit — a success, not an abandonment")
  | .boundaryRelay     => (.extension, "TextPresent+Proceed: named by the person at any gate, or by the AI at the spec relay before anything is produced — a sibling deficit demonstrated, or a realization this round requires that this session cannot supply; name the obligation and its basis, relay the record so far, run account, exit as BoundaryExit; the next protocol is the session's to choose")
  | .withdraw          => (.extension, "TextPresent+Proceed: explicit exit at any gate — the partial trace and residual declared, account enforced; EarlyExit. A hard interrupt yields no turn, so account cannot run: temp isolation's bounded lifecycle is the backstop")
  | .converge          => (.extension, "TextPresent+Proceed: the transformation trace — marks → interpretations → revisions → recognition — with the recognized version, its placement, the settled commitments, the provisional coordinates, the residual, the dissent, and every disposition")
  | .seam              => (.extension, "TextPresent+Proceed: at a user-declared chain naming the next protocol, proceed to it citing that source; the RecognizedForm enters it as prior material, its fixture a recognition witness and nothing more; this protocol declares no wired outbound edge, and every Constitution gate inside this protocol and the next fires unchanged")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Form resolution emergent via session context.
-/

end Hypotyposis
```

## Scope Boundary

The transformation the moment needs decides between neighbors; a sibling deficit seen in the scan or demonstrated in a round is named as a finding at the boundary, and the session chooses what takes it.

- `/preview` — recognize and settle a direction among named alternatives; its probes are discarded. Here the resolution sought is a form, and the recognized version is kept; a direction settled by `/preview` can enter as prior material.
- `/elicit` — resolve intent by reverse-tracing decision coordinates from externalized cognition. Here encountering and revising sketches constitutes the remaining form intent; readable prior material may already exist.
- `/contextualize` — adjudicate a result's fit against application context held fixed within the run, with adaptation directed by the user. Here encountering sketches develops the form intent itself.
- `/ideate` — a thin field of ideas widened, nothing selected. Here a form is recognized.

## Mode Activation

`/sketch` is directly invocable. On the AI-detected path — the session routing the utterance here — cite the evidence of `FitUnrecognized` at the spec relay; a decline of the run is a withdrawal at the first `Qfit`. Loaded safety boundaries, capability restrictions, and explicit user instructions continue to bind while Hypotyposis is active.

Heuristic discovery cues are a plan that cannot reach its first draft, a description rewritten instead of made, a request to see something before saying more, and an explicit "I'd know it when I see it". They establish grounds to run Phase 0 rather than activation predicates.

## Protocol

### Phase 0: Detection (Silent)

Apply the deficit predicate in the Definition and cite the basis.

### Phase 1: Bind

Read each prior item from the context as settled only where a person's utterance in this context settled it, and as a candidate otherwise — a record of a commitment made in an earlier session included — with where it came from.

### Phase 2: Round Spec Relay

Lay out the draft TOOL GROUNDING's `specRelay` entry names — the focus, the perception it needs, each variant brief with the basis that chose it, and each provisional coordinate with the mark or production it came from — then produce without yielding the turn. Say in one line that any of it can be settled, sent back, or replaced at the recognition gate. Where the draft finds a realization the round needs that this session cannot supply, or a sibling deficit demonstrated, say so here and exit at the boundary before producing.

### Phase 3: Production (Transform)

Produce under the relayed spec as TOOL GROUNDING's `produce` entry states; every sketch carries its placeholder status visibly.

### Phase 4: Recognition Gate (Constitution)

Present as TOOL GROUNDING's `present` entry states, acquire the marks through the channel the host supplies, then render `Qfit`:
```
Which version are you marking, and what do you see?

Options:
1. **Mark** — point at what does not fit (and what to keep) on a named version; I revise from there
2. **Fit on this focus** — this version is adequate on this round's focus; the next round takes another focus
3. **Finish** — this version is the form, for the purpose you state, with the axes you leave open
```
With Mark, Fit, or Finish, name which of the readings shown beside the version you settle, reject, or replace; unnamed ones stay as they were. Name interrogating a sketch, sending back this round's focus, perception, or variants, contesting the premise, naming a boundary, and withdrawing as free-response paths; they are not numbered options. An interrogation is answered within the sketch's placeholder status, and an answer with no marks and no acts presents the gate again; neither produces a new round. Where you read that no further encounter is owed, say so before the gate with its basis; the run stands down there only when the user accepts it.

### Phase 5: Placement Gate (Constitution)

Present the recognized version and the capability it needs — a reference that outlives the session — beside the versions the run passed over, and render `Qplace` with no default:
```
Where does the recognized version live from here?

Options:
1. **Place** — name the location; the version is retained there and verified. Name any other versions worth keeping as revert points and where they go; the rest are released
```
A version kept as a revert point is one the run passed over, never the recognized one. When a retention failed, say so before re-presenting; the same location stays admissible. Where the placement needs a capability this session cannot supply, say so with its basis and exit at the boundary.

## Rules

- **Utterance continuity**: Every gate answer joins the context as it was said, and the readings drawn from it are shown beside it as the AI's. At the spec relay, re-present outstanding material the user entrusted to a later round; a subsequent act of theirs settles whether it is taken up or withdrawn. Whatever remains is declared in the terminal's residual.
- **Ground interpretations**: Read each mark against the version it names, that version's brief, and how the round realized it. What the evidence supports about the form and about the realization is the judgment; carry it with its basis, and where the evidence does not settle which of the two a mark reaches, carry that unresolved into the provisional reading the spec relay presents.
- **Draft relayed with its basis**: relay the round's focus, realization, and variant briefs with the basis that chose each, the provisional coordinates beside them, and the affordance to send any of it back, then produce; the recognition gate is where the user settles a coordinate or sends the draft back.
- **Closure by the user**: A recognition, a placement, and a dissolution are closed only by the user's utterance. Before each gate, show any contrary ground you hold about the version or the placement; where the user closes with that ground standing, attach it to the closure record. A reading of your own that no further encounter is owed is stated with its basis and closes nothing until the user accepts it.
- **Placement has no default**: The protocol names what the retained version needs — a reference the user judges to outlive the session — and the user names where, together with which other versions are kept and where. The fixture that results is a recognition witness and carries no implementation commitment.
- **Round composition**: Use everyday language, put evidence and differential implications before the gate, and leave the gate to the question and options. Read `references/round-composition.md` before composing when wording must persist across rounds or phase placement is material.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
