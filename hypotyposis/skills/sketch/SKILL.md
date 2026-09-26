---
name: sketch
description: "Recognize and revise concrete sketches to discover a form when descriptions cannot settle intent. Type: (FitUnrecognized, Hybrid, SKETCH-RECOGNIZE-CYCLE, FormIntentSeed) → RecognizedForm"
---

# Hypotyposis Protocol

Discover what a form should be by encountering concrete sketches and marking what does not fit, until the user recognizes a specific version as the form for a stated purpose. Type: `(FitUnrecognized, Hybrid, SKETCH-RECOGNIZE-CYCLE, FormIntentSeed) → RecognizedForm`.

## Definition

**Hypotyposis** (ὑποτύπωσις): an outline or sketch — a first drawing of a position rather than its finished statement. A dialogical act for the moment when a form has to be made and the intent behind it cannot yet be settled from descriptions: the user can say what is wrong with a thing in front of them long before they can say what the thing should be, because good fit has no positive description of its own while each misfit is immediate and can be pointed at (Alexander, 1964). So the protocol runs the other way round from a specification: the AI drafts what the next sketches should try and relays that draft with the basis that chose each part, then produces the sketches; the user marks a specific version — what does not fit and what to keep — as first-class utterances, settling or sending back the readings shown beside it in the same answer; the AI revises the retained version under those marks; and the run ends when the user recognizes one version as the form for a stated purpose and names where it lives.

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
Hypotyposis(I) → start(c) → sketch(c, utterances), where c is the fused session context:
  [fitUnrecognized fails] the non-activation basis → not activated
  [a realization the run needs is shown unsuppliable] the boundary relay → account → BoundaryExit
  round(c): the spec relay — what the next sketches try, the perception the judgment needs, the
    variant briefs, and every provisional reading, each with its basis; it yields no turn →
    produce → present → Qfit → Stop
  next utterance u: c' := fuse(c, u), every reading below taken afresh on c' →
    [the person withdraws]                        account → EarlyExit
    [the person accepts that no form is owed]     account → DissolutionExit
    [the person names where the run goes next]    account → Routed
    [a realization the run needs is shown unsuppliable] the boundary relay → account → BoundaryExit
    [a recognition and a placement stand on c', taken with what they need in view]
      retain and verify → every placed reference resolves: release the rest → RecognizedForm
                        | a reference failed: Qplace again with the failure and every copy
                          already written shown; nothing released
    [a recognition stands, unplaced]              Qplace
    [the answer calls for new sketches]           round(c') → Qfit
    [otherwise — an interrogation, an answer with no marks and no acts]   the gate again
  no utterance: the gate holds; nothing is recognized, placed, or released
-/

/-! ── MORPHISM ──
FormIntentSeed
  → detect          -- deficit predicate over the utterance and the context (silent analysis)
  → bind            -- prior material read from the context: settled where a person's utterance in it settled it, a candidate otherwise, provenance kept
  → relay_round     -- what the next sketches try, the perception the judgment needs, and the variant briefs, drafted with the basis that chose each and relayed beside the provisional readings; nothing is settled here
  → produce         -- one sketch per brief: a brief naming parents revises those retained versions, a brief naming none generates from the material it names or from prior material; each declares what producing it determined that no settled value covered
  → present         -- each sketch from its concretum, what this realization cannot expose, whether an artifact was observed, what it was checked against, what it moved from a value the person settled, where the run stands, and any contrary ground held about it
  → recognize       -- the person's words on a specific version: what does not fit, what to keep, an aspect that is right, the version that is the form for a stated purpose — and, in the same answer, the readings they settle, replace, or retire
  → place           -- the person names where the recognized version lives and which passed-over versions are kept as revert points; no default for either
  → account         -- every placed reference retained and verified, every other sketch released and verified, every copy written accounted for where it was written
  → RecognizedForm
requires: form_purpose_in_scope(I)             -- runtime checkpoint (Phase 0): the work is about to make a form
deficit:  FitUnrecognized                       -- activation precondition (Layer 1/2)
preserves: utterance(I)                          -- the context only grows; the seed is never rewritten
invariant: Concretum Retention                   -- a brief that revises does so on retained parents; a sketch under judgment is never regenerated from settled values alone
invariant: Commitment Provenance Preservation    -- a value is settled only by a person's utterance, on the scope their words reach; a later one may replace what an earlier one settled; AI inference alone settles or replaces nothing
invariant: Recognition over Description          -- fit is the person's recognition of a specific version, as it was presented, for a stated purpose
invariant: the person recognizes, places, and closes; your judgments stand as proposals and contrary grounds
-/

namespace Hypotyposis

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

/-- `I`, `FormIntentSeed`: the utterance that asks for a form, and the prior material it names
    or the context already holds — a settled direction, a resolved intent, a candidate field,
    an existing artifact, a prior session's record. Source-neutral; read from the context. -/
abbrev FormIntentSeed (P : Type) := Context P

/-- **Your judgment** at Phase 0: a form-making purpose is in scope, decision-relevant intent
    remains underdetermined, encountering and revising a concrete proposal is what would
    constitute that intent, and the resolution sought is a recognized form with its
    commitments and residuals. -/
axiom fitUnrecognized : Context P → Prop

/-- An emergent label: "information unit", "reading order", "density", "tone". -/
abbrev Axis := String

/-- A determination on an axis, in the person's words or read off a sketch. -/
abbrev Value := String

/-- The identity of one version; every mark, placement, and disposition points at one. -/
structure SketchRef where
  id : Nat

/-- What prior material is and where it came from. -/
structure ReferencedMaterial where
  source  : String
  content : String

/-- One sketch to produce. With no parents, generate from the settled values and from the
    material `source` names, or from the bound prior material where it names none — the first
    sketches, and a fresh start the person names. With one parent, revise that retained version;
    with several, draw on each as the person's words or the brief say — how they combine is your
    judgment, stated in the brief, never a fixed merge. A spec revision that keeps a version
    names it as parent, so the re-drafted sketches revise it rather than regenerating it. A brief
    may name parents and a new source together: changing where the material comes from does not
    itself abandon a parent. -/
structure VariantBrief where
  parents : List SketchRef
  source  : Option ReferencedMaterial
  commits : List (Axis × Value)

/-- The draft a spec relay presents. What the next sketches try, what perception the judgment
    needs, and how many variants to produce are your judgment, drafted from the whole context:
    try what the person's latest words leave most open; where it opens an axis carrying a
    standard outside both parties' preference, name the referent each sketch is checked against
    — a referent this session cannot supply is `Unsuppliable`, never something to proceed
    without; a count the person stated holds on the scope their words reach. -/
structure RoundSpec where
  focus       : String
  realization : String
  briefs      : List VariantBrief
  nonempty    : briefs ≠ []

/-- `text`: narration carried in session text. `artifact`: a file under temp isolation,
    versioned at creation. -/
inductive Concretum
  | text (value : String)
  | artifact (versionedRef : String)

structure Sketch where
  ref       : SketchRef
  concretum : Concretum

/-- **Your record**, read from the context: every version produced so far, each retained for
    revision until account. -/
axiom sketches : Context P → List Sketch

/-- **Your record**: the round spec your latest relay presented; `none` before the first. -/
axiom spec : Context P → Option RoundSpec

/-- A reference the person judges to outlive the session. The durability is their judgment;
    account checks only that the reference resolves to that version's concretum when
    checked. -/
abbrev Location := String

inductive Disposition
  | retained (loc : Location)
  | released
  | releaseFailed (reason : String)
  | retainFailed (loc : Location) (reason : String)

/-- **Your reading** of the account observations: for each version, what became of it at each
    place it was written — one entry per version and location, the latest standing. `retained`
    is read only where the observation shows the reference resolving to that version's exact
    concretum. -/
axiom dispositions : Context P → List (SketchRef × Disposition)

/-- What every spec a relay presents owes (Concretum Retention): each parent a brief names is a
    version produced and not released. -/
def SpecOwes (c : Context P) (s : RoundSpec) : Prop :=
  ∀ b ∈ s.briefs, ∀ p ∈ b.parents,
    (∃ x ∈ sketches c, x.ref = p) ∧ (p, Disposition.released) ∉ dispositions c

/-- A mark: a person's utterance on a version, cited as said. What it points at, whether it
    names a misfit or something to keep, and which axis it reaches are your reading of it,
    carried with its basis; a keep is retained, never dropped, and a concern the version's
    focus did not ask about stays admissible. -/
structure Mark (c : Context P) where
  sketch   : SketchRef
  src      : Cite c
  byPerson : src.src.val = .person

/-- **Your reading** of every mark the person's utterances placed. -/
axiom marks : (c : Context P) → List (Mark c)

/-- **Your judgment**: the cited turn states or settles value `v` on axis `a` — a settlement of a
    reading shown beside a version, a replacement the person stated, a statement that a version is
    right on an aspect (the value as that version shows it), or a commitment they made earlier in
    this context — read against the context as it now stands, on the scope the person's words
    reach. -/
axiom AxisSupported : Axis → Context P → Turn P → Value → Prop

/-- A value is settled only by a person's turn. A record of a commitment made in an earlier
    session is a candidate for it, never its fill. -/
def axisCoord (a : Axis) : Coord P Value :=
  { admits := (·.val = .person), supports := AxisSupported a }

/-- **Your reading**: how axis `a` stands in `c` — filled by the person's latest turn that
    settles or replaces it; open where nothing settles it, and where the person retired it with
    nothing in its place. An open axis carries as candidate the material that proposes a value
    without settling it, a record of an earlier session's commitment included. A later version
    that moves a settled value does not unsettle it: the move is a ledger line shown before the
    next gate. -/
axiom operative : (c : Context P) → (a : Axis) → Occ (axisCoord (P := P) a) c

/-- A determination the AI puts forward: read from a mark, or rendered into a sketch that no
    settled value covered. It settles nothing; it is shown at the spec relay and again beside
    the version at Qfit. -/
structure Proposal (c : Context P) where
  axis   : Axis
  value  : Value
  /-- the mark it was read from; `none` for a production's own determination -/
  mark   : Option (Cite c)
  /-- the version it was rendered into; `none` for a reading of a mark -/
  sketch : Option SketchRef

/-- **Your record**, read from the context: the provisional readings — every proposal the person
    has neither settled, replaced, nor rejected. -/
axiom provisional : (c : Context P) → List (Proposal c)

/-- Recognition of the assembled form, not of one aspect. -/
structure Recognition where
  target       : SketchRef
  purposeScope : String
  residual     : List Axis

/-- **Your judgment**: the cited turn recognizes `r` — its target a version presented as it
    stands and still retained, for the purpose it states. Read against the context as it now
    stands: a later turn that marks the form again, or asks for a version not yet presented,
    leaves no recognition standing; words about where it lives or which versions are kept leave
    it standing. Where a turn could be a recognition or a statement that one aspect is right,
    show your reading before the next gate rather than acting on it. -/
axiom RecognitionSupported : Context P → Turn P → Recognition → Prop

def recognitionCoord : Coord P Recognition :=
  { admits := (·.val = .person), supports := RecognitionSupported }

/-- **Your reading**: the recognition that stands on the context as it now stands; `open_`
    before a finish, and again once a later turn of the person's reopens the form. -/
axiom recognition : (c : Context P) → Occ (recognitionCoord (P := P)) c

def isFilled {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Bool
  | .open_ _   => false
  | .filled .. => true

def filledValue {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Option A
  | .open_ _     => none
  | .filled a .. => some a

/-- Qplace is open: a recognition stands on the context. -/
def Placing (c : Context P) : Prop := isFilled (recognition c) = true

/-- Where the recognized version lives, and which passed-over versions are kept as revert
    points and where; `kept` may be empty. -/
structure Placement where
  location : Location
  kept     : List (SketchRef × Location)

/-- **Your judgment**: the cited turn names this placement for the recognition now standing. -/
axiom PlacementSupported : Context P → Turn P → Placement → Prop

/-- Placement has no default: only the person's turn fills it. -/
def placementCoord : Coord P Placement :=
  { admits := (·.val = .person), supports := PlacementSupported }

/-- **Your reading**: the placement the person's latest answer at Qplace named. -/
axiom placement : (c : Context P) → Occ (placementCoord (P := P)) c

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

/-- **Your judgment**, the adoption condition: the recognition and the placement the person's
    answers took were shown, on a gate the person answered, with what they take — what producing
    the recognized version determined, what it was checked against and how that came out, what
    it moved from a value the person settled, your contrary grounds, and, after a failed
    retention, every copy already written and where. A value the answer itself states counts
    where its consequences were in view. Where anything would be taken unseen, the gate is drawn
    again. -/
axiom Covered : Context P → Prop

/-- Every placed reference verified, and no version kept as a revert point is the recognized
    one: those are the versions the run passed over. -/
def Verified (c : Context P) (f : Fixture) : Prop :=
  (∀ k ∈ f.kept, k.1 ≠ f.target) ∧
  (f.target, Disposition.retained f.ref) ∈ dispositions c ∧
  ∀ k ∈ f.kept, (k.1, Disposition.retained k.2) ∈ dispositions c

/-- Every sketch has a declared disposition. -/
def Accounted (c : Context P) : Prop := ∀ s ∈ sketches c, ∃ d, (s.ref, d) ∈ dispositions c

/-- A value on the record, named as the presentation shows it — a settled axis, the recognition,
    the placement, a kept version. -/
abbrev Entry := String

/-- **Your reading**: the values the record holds as the context now stands. -/
axiom entries : Context P → List Entry

/-- Who first put a value forward. Kept apart from how it came to stand: a reading you proposed
    that the person settled was proposed by you and set by the person's taking. -/
inductive Proposer | draft | person

/-- **Your reading**: the position of the turn that first put forward what `e` holds now. -/
axiom introducedAt : Context P → Entry → Nat

def proposer (c : Context P) (e : Entry) : Proposer :=
  match c[introducedAt c e]? with
  | some ⟨.person, _⟩ => .person
  | _                 => .draft

/-- How a value came to stand: the person's words set it, or their answer adopted yours. -/
inductive Standing | set | adopted

/-- **Your reading**: the person's turn set what `e` holds now — named it or edited it — on the
    scope their words reach. -/
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
  /-- the person's own edit -/
  | personEdit
  /-- a change the person's words force -/
  | necessary
  /-- a change you propose, a later version moving a value the person settled included -/
  | proposal

/-- One change since the last gate: what changed, the value it touches, and its kind. -/
structure LedgerLine where
  change : String
  cause  : Option Entry
  kind   : LedgerKind

/-- **Your record**: what the latest turn and the sketches produced since changed, the person's
    edits first. -/
axiom ledger : Context P → List LedgerLine

/-- **Your record**: the contrary grounds you presented before the gate the closing answer
    answered — a version failing a referent it was checked against, a commitment it breaks, a
    defect found after the person judged it, a dissolution you doubt, a sibling deficit you
    read — attached to the closure; empty when there were none. -/
axiom dissent : Context P → List String

/-- How the person ends the run without a recognized form. -/
inductive Closing
  /-- stop here -/
  | withdraw
  /-- no form is owed: the sharpened description made it recognizable without a further
      encounter, or the activation premise collapsed -/
  | dissolve
  /-- go on to what the person names — a sibling deficit, another protocol -/
  | route (target : String)

/-- **Your judgment**: the cited turn closes the run this way, read against the context as it now
    stands. Your own reading that no further encounter is owed, or that a sibling deficit is what
    is going on, closes nothing: it is stated with its basis before the gate, and the person's
    answer closes. -/
axiom ClosingSupported : Context P → Turn P → Closing → Prop

/-- Only the person closes. -/
def closeCoord : Coord P Closing :=
  { admits := (·.val = .person), supports := ClosingSupported }

/-- **Your reading**: the person's closing; `open_` until one reaches it. -/
axiom closing : (c : Context P) → Occ (closeCoord (P := P)) c

/-- **Your judgment**, on reachable evidence only: a realization the next sketches or the
    placement need is one this session cannot supply — a capability the host lacks, a referent
    it cannot reach. A failed attempt alone is not this; where an alternative or a narrower scope
    would need a judgment, present it and hold. The boundary relay then takes the place of the
    next presentation. -/
axiom Unsuppliable : Context P → Prop

/-- **Your judgment**: the latest answer, read with the context, calls for new sketches — marks,
    an aspect found right with another to try, a fresh start, a spec revision. An interrogation
    answered within the sketch's placeholder status, and an answer with no marks and no acts,
    present the gate again with nothing produced. -/
axiom Redraws : Context P → Prop

/-- The record an exit that recognizes nothing carries: the context after account, the dissent
    attached to the closure, and how each value came to stand. -/
structure Closed (P : Type) where
  context    : Context P
  dissent    : List String
  provenance : List Provenance

/-- `RecognizedForm`, read from the context at the verified placement, before any release: the
    settled values (`operative`), the fixture, the recognition, the trace of every mark, the
    residual — axes left open and material the person entrusted to sketches that never came —
    the readings still `provisional`, every copy written with its disposition, the dissent, and
    how each value came to stand. -/
structure RecognizedForm (P : Type) where
  context    : Context P
  fixture    : Fixture
  dissent    : List String
  provenance : List Provenance

inductive Outcome (P : Type)
  /-- `NoActivationRelay`: the failed predicate with its evidence; nothing produced -/
  | notActivated (c : Context P)
  | recognized   (f : RecognizedForm P)
  /-- `DissolutionExit`: a convergent stand-down the person closed, no form owed; its basis stated -/
  | dissolved    (r : Closed P)
  /-- `Routed`: the person named where the run goes next; that is the session's to take up -/
  | routed       (target : String) (r : Closed P)
  /-- `EarlyExit`: the partial trace; any recognition stays in it -/
  | withdrawn    (r : Closed P)
  /-- `BoundaryExit`: a realization shown unsuppliable, the obligation named -/
  | boundary     (r : Closed P)
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
A step is one arm of a structural recursion over the person's utterances. `relay` is the spec
relay: it presents `spec`, a `RoundSpec` carrying `SpecOwes`, and yields no turn; where
`Unsuppliable` holds, the boundary relay takes its place. The sketches are then produced
(`.produce`; in parallel through `.produceDelegate` when a spec has more than one brief, one
sketch per executor, each temp-isolated).
-/

/-- **Your production** under the relayed spec: each Artifact sketch as observed at creation,
    its versioned reference registered then. A Text sketch is narration the presentation carries
    as recorded. Existing project files stay unchanged. -/
axiom produce : Context P → List (Evidence P)

def runRound (relay : Context P → Response P) (c : Context P) : Context P :=
  let c₁ := c ++ [(relay c).val]
  c₁ ++ (produce c₁).map (·.val)

/-- **Your account** at a placement: retain the recognized version and each kept one at its
    location, and verify that each reference resolves to that version's exact concretum — one
    retry, then the failure is observed. Nothing is retained before a recognition and a
    placement stand and were taken with what they need in view. -/
axiom retain : Context P → List (Evidence P)

/-- **Your account** at a terminal: release every sketch the context leaves unplaced — all of
    them on a withdrawal, a dissolution, a route, or a boundary — and verify each absence; a
    failure retries once, then is observed and declared with a handoff. A copy an earlier
    placement attempt wrote to a location the person has since moved from is released only where
    the person's words reach it; otherwise it is left where it is and declared. New evidence that
    breaks a recognition or a value the person settled is shown before any release. What it
    leaves is `Accounted`. -/
axiom release : Context P → List (Evidence P)

def settle (c : Context P) : Context P := c ++ (retain c).map (·.val)

def closed (c : Context P) : Closed P :=
  { context := c ++ (release c).map (·.val), dissent := dissent c, provenance := provenance c }

def recognize (c : Context P) (f : Fixture) : RecognizedForm P :=
  { context := c ++ (release c).map (·.val), fixture := f, dissent := dissent c,
    provenance := provenance c }

open Classical in
/-- `respond` presents the gate: Qplace while a recognition stands, Qfit otherwise. Before it:
    each sketch from its concretum — Text as recorded, an Artifact walked through at its
    reference, reporting what was observed there or that it was not observed and what was tried;
    what this realization cannot expose; what each sketch was checked against and how it came
    out; which content came from the person and which is your proposal; what each sketch's own
    production determined; the ledger, the person's edits first, a later version moving a value
    they settled included; where the run stands — what is settled, what is still open, what was
    entrusted to later sketches; and your contrary grounds, a reading that no further encounter
    is owed or that a sibling deficit is what is going on included. At Qplace, the versions the
    run passed over and, after a failed retention, the failure and every copy already written. -/
def sketch (relay respond : Context P → Response P) :
    Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let c' := fuse c u
    match filledValue (closing c') with
    | some .withdraw  => .withdrawn (closed c')
    | some .dissolve  => .dissolved (closed c')
    | some (.route t) => .routed t (closed c')
    | none =>
      if Unsuppliable c' then .boundary (closed (c' ++ [(relay c').val]))
      else
        match fixture c' with
        | some f =>
          if Covered c' then
            let c₁ := settle c'
            if Verified c₁ f then .recognized (recognize c₁ f)
            else sketch relay respond (c₁ ++ [(respond c₁).val]) us
          else sketch relay respond (c' ++ [(respond c').val]) us
        | none =>
          if Placing c' ∨ ¬ Redraws c' then sketch relay respond (c' ++ [(respond c').val]) us
          else
            let c₁ := runRound relay c'
            sketch relay respond (c₁ ++ [(respond c₁).val]) us

open Classical in
def start (relay respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  if ¬ fitUnrecognized c then .notActivated c
  else if Unsuppliable c then .boundary (closed (c ++ [(relay c).val]))
  else
    let c₁ := runRound relay c
    sketch relay respond (c₁ ++ [(respond c₁).val]) us

/-! ── LOOP ──
Every answer is read against the whole context as it now stands: nothing counts rounds, and no
earlier answer is held apart from what later ones say. A person's value stands on the scope their
words reach; a later sketch that moves it is a ledger line, never a silent change. No fixed cap:
each gate is dialogue, and the person can withdraw, dissolve, or route at any gate. At every spec
relay, re-present the material the person entrusted to later sketches; a later answer of theirs
takes it up or withdraws it.
-/

/-!
Silence recognizes, places, and releases nothing.
theorem silence (relay respond : Context P → Response P) (c : Context P) :
    sketch relay respond c [] = .holding c

No sketch is produced before the spec relay: every round holds the relay turn ahead of what
production wrote.
theorem relay_before_production (relay : Context P → Response P) (c : Context P) :
    ∃ t, runRound relay c = c ++ [(relay c).val] ++ t

While a recognition stands unplaced, or the answer calls for no new sketches, an answer that
closes nothing produces nothing: the gate is presented again.
theorem held_gate_produces_nothing (relay respond : Context P → Response P) (c : Context P)
    (u : Utterance P) (us : List (Utterance P)) (hk : filledValue (closing (fuse c u)) = none)
    (hb : ¬ Unsuppliable (fuse c u)) (hf : fixture (fuse c u) = none)
    (hh : Placing (fuse c u) ∨ ¬ Redraws (fuse c u)) :
    sketch relay respond c (u :: us) =
      sketch relay respond (fuse c u ++ [(respond (fuse c u)).val]) us

Nothing is retained on a placement taken without what it needs in view: the gate is drawn
again.
theorem uncovered_retains_nothing (relay respond : Context P → Response P) (c : Context P)
    (u : Utterance P) (us : List (Utterance P)) (f : Fixture)
    (hk : filledValue (closing (fuse c u)) = none) (hb : ¬ Unsuppliable (fuse c u))
    (hf : fixture (fuse c u) = some f) (hc : ¬ Covered (fuse c u)) :
    sketch relay respond c (u :: us) =
      sketch relay respond (fuse c u ++ [(respond (fuse c u)).val]) us

An answer either continues the run or closes it in one of these ways only: the person's
withdrawal, dissolution, or route; a realization shown unsuppliable; or a recognition and
placement taken with what they need in view, every placed reference verified.
theorem each_step_continues_or_closes (relay respond : Context P → Response P) (c : Context P)
    (u : Utterance P) (us : List (Utterance P)) (o : Outcome P)
    (h : sketch relay respond c (u :: us) = o) :
    (∃ c', sketch relay respond c' us = o) ∨
    (filledValue (closing (fuse c u)) = some .withdraw ∧ o = .withdrawn (closed (fuse c u))) ∨
    (filledValue (closing (fuse c u)) = some .dissolve ∧ o = .dissolved (closed (fuse c u))) ∨
    (∃ t, filledValue (closing (fuse c u)) = some (.route t) ∧
      o = .routed t (closed (fuse c u))) ∨
    (Unsuppliable (fuse c u) ∧ o = .boundary (closed (fuse c u ++ [(relay (fuse c u)).val]))) ∨
    (∃ f, fixture (fuse c u) = some f ∧ Covered (fuse c u) ∧ Verified (settle (fuse c u)) f ∧
      o = .recognized (recognize (settle (fuse c u)) f))

A reference that does not resolve returns the placement to the person, with nothing released.
theorem unverified_returns_to_placement (relay respond : Context P → Response P)
    (c : Context P) (u : Utterance P) (us : List (Utterance P)) (f : Fixture)
    (hk : filledValue (closing (fuse c u)) = none) (hb : ¬ Unsuppliable (fuse c u))
    (hf : fixture (fuse c u) = some f) (hc : Covered (fuse c u))
    (hn : ¬ Verified (settle (fuse c u)) f) :
    sketch relay respond c (u :: us) =
      sketch relay respond (settle (fuse c u) ++ [(respond (settle (fuse c u))).val]) us
-/

/-! ── CONVERGENCE ──
converged: a recognized form, its recognition and placement taken with what they need in view
(`Covered`) and every placed reference verified (`Verified`); or a dissolution the person closed,
with its basis. Every other exit is non-convergent and keeps its partial record. Convergence
evidence: at RecognizedForm, present the trace — each mark → its reading → the revision it drove
→ how it ended (recognized, replaced, or residual) — beside the recognized version, its placement,
the versions kept as revert points, the settled values with who proposed each and how it came to
stand, the readings still provisional, the residual — axes left open and material entrusted to
sketches that never came — every copy written with its disposition, and the dissent attached to
the closure. Every sketch's disposition is shown (`Accounted`); a failure is declared with its
handoff, never silent. Each other terminal presents its own payload (TOOL GROUNDING).
Demonstrated, not asserted.
-/

/-!
A recognized form is closed only on a recognition and a placement taken with what they need in
view, with every placed reference verified and no revert point the recognized version.
theorem recognized_verified (relay respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (r : RecognizedForm P)
    (h : sketch relay respond c us = .recognized r) :
    ∃ c₀, fixture c₀ = some r.fixture ∧ Covered c₀ ∧ Verified (settle c₀) r.fixture ∧
      r = recognize (settle c₀) r.fixture

A dissolution, a route, and a withdrawal each rest on the person's closing.
theorem dissolved_by_person (relay respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (r : Closed P) (h : sketch relay respond c us = .dissolved r) :
    ∃ c₀, filledValue (closing c₀) = some .dissolve ∧ r = closed c₀

theorem routed_by_person (relay respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (t : String) (r : Closed P)
    (h : sketch relay respond c us = .routed t r) :
    ∃ c₀, filledValue (closing c₀) = some (.route t) ∧ r = closed c₀

theorem withdrawn_by_person (relay respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (r : Closed P) (h : sketch relay respond c us = .withdrawn r) :
    ∃ c₀, filledValue (closing c₀) = some .withdraw ∧ r = closed c₀

The AI ends the run on its own only at a realization shown unsuppliable.
theorem boundary_on_evidence (relay respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (r : Closed P) (h : sketch relay respond c us = .boundary r) :
    ∃ c₀, Unsuppliable c₀ ∧ r = closed (c₀ ++ [(relay c₀).val])

A value, a recognition, a placement, and a closing are each filled only by a person's turn.
theorem settled_by_person {c : Context P} {a : Axis} {s : Cite c}
    (ok : (axisCoord (P := P) a).admits s.src) : s.src.val = .person

theorem recognized_by_person {c : Context P} {s : Cite c}
    (ok : (recognitionCoord (P := P)).admits s.src) : s.src.val = .person

theorem placed_by_person {c : Context P} {s : Cite c}
    (ok : (placementCoord (P := P)).admits s.src) : s.src.val = .person

theorem closed_by_person {c : Context P} {s : Cite c}
    (ok : (closeCoord (P := P)).admits s.src) : s.src.val = .person
-/

/-! ── TOOL GROUNDING ── -/
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed

inductive Annot | sense | observe | track | transform | dispatch | constitution | extension

inductive Op | detect | noActivationRelay | bind | draft | specRelay | produce | produceDelegate
             | present | acquire | qfit | interpret | readAnswer | qplace | account | assemble
             | dissolutionRelay | routeRelay | boundaryRelay | withdraw | converge | seam

def grounding : Op → Annot × String
  | .detect            => (.sense, "Internal analysis: the deficit predicate over the utterance and the context; no external tool")
  | .noActivationRelay => (.extension, "TextPresent+Proceed: the non-activation basis — the failed predicate with its evidence; a sibling deficit seen in the scan is named as a finding and left to the session; not activated")
  | .bind              => (.sense, "Internal analysis: prior material read from the context — settled where a person's utterance in this context settles it, a candidate otherwise, with where it came from; a record of a commitment made in an earlier session is a candidate")
  | .draft             => (.sense, "Internal analysis: what the next sketches try, the perception the judgment needs, the referent a standard outside both parties' preference is checked against, and the variant briefs, drafted from the whole context — the settled values, the provisional readings, the prior material, every mark, and any spec revision the person named — read together rather than from any one of them")
  | .specRelay         => (.extension, "TextPresent+Proceed: the draft whole — what the next sketches try, what the judgment needs, the variant briefs, each with the basis that chose it, and each provisional reading with where it came from — laid out so that any of it can be settled, sent back, or replaced at Qfit; fires before anything is produced and settles nothing; on the AI-detected path it cites the evidence of FitUnrecognized as the run's basis; after a spec revision it is re-presented scoped to that revision")
  | .produce           => (.transform, "artifact write, environment run: temp-isolated sketches, each with its concretum and a versioned reference registered at creation; a brief naming parents revises those retained versions, a brief naming none generates from the material its source names or from prior material; existing project files are never modified; Text concreta are session text only. Each sketch proposes as readings what it was rendered under that no settled value covered, so the person meets those determinations beside the sketch at Qfit")
  | .produceDelegate   => (.dispatch, "delegate (conditional: more than one brief; parallel topology: one sketch per executor, each temp-isolated with its reference registered; subordinate to the active runtime policy)")
  | .present           => (.extension, "TextPresent+Proceed: each sketch from its concretum — Text as recorded, an Artifact walked through at its reference, reporting what was observed there or that it was not observed and what was tried — then what this realization cannot expose, what each sketch was checked against and how it came out, which content came from the person and which is the AI's proposal, what each sketch's own production determined, the ledger, where the run stands, and any contrary ground held — a defect found after the person judged a version, a reading that no further encounter is owed, a sibling deficit read — each stated with its basis and closing nothing")
  | .acquire           => (.observe, "channel read: utterances anchored on a sketch; the marks arrive as the person's utterances. The channel is a capability the host supplies, named here and bound nowhere in this contract: the person can point at what they saw, and the pointing arrives with the utterance")
  | .qfit              => (.constitution, "present: mandatory recognition gate on a specific version — Mark, Fit on this focus, Finish for a stated purpose — and, riding the same answer, which readings shown beside it the person settles, replaces, or retires; an answer with no marks and no acts presents the gate again; the pre-gate text declares interrogating a sketch, sending back what the next sketches try, contesting the premise, naming where the run goes next, and withdrawing")
  | .interpret         => (.sense, "Internal analysis: marks read against the version they name, that version's brief, and how it was realized → provisional readings, each citing the mark it came from; whether a mark reaches the form or the realization is carried unresolved where the evidence does not settle it; never settled here")
  | .readAnswer        => (.sense, "Internal analysis: the latest utterance, and every earlier turn of the person's it bears on, read whole against the fused context as it now stands — its marks, the values it settles and their scope, a recognition or its reopening, a placement, a closing — whatever form it takes")
  | .qplace            => (.constitution, "present: mandatory placement gate — the recognized version and the capability it needs, a reference the person judges to outlive the session, beside the versions this run passed over; the person names the location and which of the others are kept and where; no default for either; after a retention failure the failure and every copy already written are shown before the gate, and the same location stays admissible")
  | .account           => (.transform, "artifact write, environment run: only on a recognition and placement taken with what they need in view, retain every placed version and verify each reference resolves to that exact concretum — one retry, then the failure is declared and Qplace presented again with nothing released; once every placed version is verified, release the sketches placement did not keep and verify each — one retry, then ReleaseFailed declared with a handoff; each copy is accounted for where it was written, and a copy at a location the person moved from is released only where their words reach it")
  | .assemble          => (.sense, "Internal analysis: RecognizedForm read from the context at the verified placement, before any release — the settled values with who proposed each and how it came to stand, the fixture, the recognition, the trace, the residual, the readings still provisional, every copy with its disposition, and the dissent attached to the closure")
  | .dissolutionRelay  => (.extension, "TextPresent+Proceed: when the person accepts or declares that no further encounter is owed — the sharpened description made the form recognizable without one, or the activation premise collapsed — state the basis, relay the settled values and every mark, attach any dissent, run account, stand down as DissolutionExit — a success, not an abandonment")
  | .routeRelay        => (.extension, "TextPresent+Proceed: when the person names where the run goes next — a sibling deficit, another protocol — relay the record so far with that target and its basis, attach any dissent, run account, exit as Routed; taking it up is the session's")
  | .boundaryRelay     => (.extension, "TextPresent+Proceed: where reachable evidence shows a realization the next sketches or the placement need cannot be supplied in this session — name the obligation and its basis, relay the record so far, run account, exit as BoundaryExit; the next protocol is the session's to choose")
  | .withdraw          => (.extension, "TextPresent+Proceed: explicit exit at any gate — the partial trace and residual declared, account enforced; EarlyExit. A hard interrupt yields no turn, so account cannot run: temp isolation's bounded lifecycle is the backstop")
  | .converge          => (.extension, "TextPresent+Proceed: the transformation trace — marks → readings → revisions → recognition — with the recognized version, its placement, the settled values and their provenance, the provisional readings, the residual, the dissent, and every copy's disposition")
  | .seam              => (.extension, "TextPresent+Proceed: at a user-declared chain naming the next protocol, proceed to it citing that source; the RecognizedForm enters it as prior material, its fixture a recognition witness and nothing more; this protocol declares no wired outbound edge, and every Constitution gate inside this protocol and the next fires unchanged")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Form resolution emergent via session context.
-/

end

end Hypotyposis
```

## Scope Boundary

The transformation the moment needs decides between neighbors; a sibling deficit seen in the scan or demonstrated in a round is named as a finding before the gate, and the user chooses whether the run goes there.

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

Lay out the draft TOOL GROUNDING's `specRelay` entry names — what the next sketches try, the perception it needs, the referent a standard is checked against where the focus carries one, each variant brief with the basis that chose it, and each provisional reading with the mark or production it came from — then produce without yielding the turn. Say in one line that any of it can be settled, sent back, or replaced at the recognition gate. Where reachable evidence shows a realization the sketches need cannot be supplied in this session, say so here and exit at the boundary before producing.

### Phase 3: Production (Transform)

Produce under the relayed spec as TOOL GROUNDING's `produce` entry states; every sketch carries its placeholder status visibly.

### Phase 4: Recognition Gate (Constitution)

Present as TOOL GROUNDING's `present` entry states — where the run stands, what a new version moved from a value the user settled, and any defect found in a version after the user judged it included — acquire the marks through the channel the host supplies, then render `Qfit`:
```
Which version are you marking, and what do you see?

Options:
1. **Mark** — point at what does not fit (and what to keep) on a named version; I revise from there
2. **Fit on this focus** — this version is right on this aspect; the next sketches try another
3. **Finish** — this version is the form, for the purpose you state, with the axes you leave open
```
With Mark, Fit, or Finish, name which of the readings shown beside the version you settle, reject, or replace; unnamed ones stay as they were. Name interrogating a sketch, sending back what the next sketches try, contesting the premise, naming where the run goes next, and withdrawing as free-response paths; they are not numbered options. An interrogation is answered within the sketch's placeholder status, and an answer with no marks and no acts presents the gate again; neither produces new sketches. Read each answer whole: where one answer could be a finish or a fit on one aspect, show your reading before the next gate rather than acting on it. Where you read that no further encounter is owed, or that a sibling deficit is what is going on, say so before the gate with its basis; the run ends there only when the user closes it.

### Phase 5: Placement Gate (Constitution)

Present the recognized version and the capability it needs — a reference that outlives the session — beside the versions the run passed over, and render `Qplace` with no default:
```
Where does the recognized version live from here?

Options:
1. **Place** — name the location; the version is retained there and verified. Name any other versions worth keeping as revert points and where they go; the rest are released
```
A version kept as a revert point is one the run passed over, never the recognized one. Nothing is written to a location before the user names it. When a retention failed, say so before re-presenting, together with every copy already written and where; the same location stays admissible, and a copy at a location the user moves away from stays where it is unless their words reach it. An answer here that marks the form again reopens the recognition, and the next sketches follow. Where reachable evidence shows the placement needs a capability this session cannot supply, say so with its basis and exit at the boundary.

## Rules

- **Utterance continuity**: Every gate answer joins the context as it was said, and the readings drawn from it are shown beside it as the AI's. Each answer is read against the context as it now stands; a value the user settled stands on the scope their words reach, and a later version that moves it is shown as a change before the next gate, never silently. At the spec relay, re-present outstanding material the user entrusted to later sketches; a subsequent act of theirs settles whether it is taken up or withdrawn. Whatever remains is declared in the terminal's residual.
- **Ground interpretations**: Read each mark against the version it names, that version's brief, and how it was realized. What the evidence supports about the form and about the realization is the judgment; carry it with its basis, and where the evidence does not settle which of the two a mark reaches, carry that unresolved into the provisional reading the spec relay presents. Where the focus carries a standard outside both parties' preference, check each sketch against its referent before presenting, and show how it came out.
- **Draft relayed with its basis**: relay what the next sketches try, the perception they need, and the variant briefs with the basis that chose each, the provisional readings beside them, and the affordance to send any of it back, then produce; the recognition gate is where the user settles a value or sends the draft back.
- **Closure by the user**: A recognition, a placement, a dissolution, and a route are closed only by the user's utterance, and taken only with what they need in view. Before each gate, show any contrary ground you hold about the version or the placement; where the user closes with that ground standing, attach it to the closure record. Evidence found later that breaks a recognition or a value the user settled is shown before the next gate, and always before any release; the closed value itself is never rewritten by you. Record for each settled value who proposed it and whether the user's words set it or their answer adopted yours.
- **Placement has no default**: The protocol names what the retained version needs — a reference the user judges to outlive the session — and the user names where, together with which other versions are kept and where. The fixture that results is a recognition witness and carries no implementation commitment.
- **Round composition**: Use everyday language, put evidence and differential implications before the gate, and leave the gate to the question and options. Read `references/round-composition.md` before composing when wording must persist across rounds or phase placement is material.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
