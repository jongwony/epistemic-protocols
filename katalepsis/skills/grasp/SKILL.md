---
name: grasp
description: "Verify understanding of a target in play — code, a document, a result — present in context and quotable. Type: (TargetUngrasped, User, VERIFY, Target) → VerifiedUnderstanding"
---

# Katalepsis Protocol

Achieve certain comprehension of a target in play — code, a document, a result — through structured verification, enabling the user to grasp what stands ungrasped. Type: `(TargetUngrasped, User, VERIFY, Target) → VerifiedUnderstanding`.

## Definition

**Katalepsis** (κατάληψις): A dialogical act of achieving firm comprehension—from Stoic philosophy meaning "a grasping firmly"—resolving an ungrasped target into verified user understanding through intent-scented entry points and progressive verification.

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
Katalepsis(R, U) → grasp(c, utterances), where c is the fused session context:
  Phase 0 (silent): orient on R and U → derive intent-scented entries → assess the route map
  Phase 1: the entries with the route map → entry selection → Stop
  next utterance u: c' := fuse(c, u) → verdict(c') →
    propose: record the proposal → side-branch closure → the gate it came from again
      (a proposal at the Horizon probe resumes at that task's coverage)
    withdraw: what was shown stays on record → Withdrawn
    complete, at the zero-gap finding (Confirm) or at coverage (sufficient): record the task
      completed → the next task begins, or converge once every task is completed
    cont, by the gate it answers:
      entry selection: materialize the basis, register one task per selected entry point →
        the first task begins
      a task begins: record update naming it → the task's gate, in priority order:
        an admissible Horizon not yet asked: the Horizon probe (its scenario only)
        no gap at all: the zero-gap finding with its reasoning
        nothing probed and no Horizon asked: the start-aspect selector
        otherwise: coverage
      the Horizon probe: the answer reached the edge → closure → back to the task;
        it missed → read and quote the material the edge rests on → the disclosure: the edge,
        that material, and an application question (a cue first where the user asked for steps)
      the disclosure's application question, or a probe: an objection you have ground to raise
        → the reasoning inquiry; none → closure → back to the task
      the reasoning inquiry: an adjudication stands → read and quote the material it rests
        on → the correction with that material → the same aspect asked again;
        none stands → closure → back to the task
      the start-aspect selector or coverage: an aspect chosen → its probe; none → back to the
        task
      the zero-gap finding (Reopen): the named gap joins the task's gaps → the task's gate
    back to the task: an admissible Horizon not yet asked, read on the fused context, preempts
      the task's gate; otherwise that gate
  every task completed: the convergence trace → VerifiedUnderstanding
  no utterance: the gate holds; nothing is completed
-/

/-! ── MORPHISM ──
Target
  → orient(target, user_signal)        -- infer likely comprehension intents from the target and the user's wording
  → derive_entries(intent)             -- transform inferred intent into high-scent entry points
  → assess_route(intents, entries, context) -- annotate entry-point adequacy before user selection
  → select(intent_entry_point, route_map) -- user chooses the closest intent-scented entry point
  → materialize(artifact_basis)        -- derive concrete artifact anchors for the chosen intent
  → register(tasks)                    -- track selected entry points as tasks
  → verify(comprehension)              -- Socratic probing per gap type, each adjudication against an answer attaching the material it was drawn from; a Horizon the answer missed is disclosed with its material and applied
  → confirm(coverage)                  -- aspect coverage check per entry point
  → VerifiedUnderstanding
requires: target_exists(R)              -- the comprehension target is present in context and can be quoted verbatim; its provenance is unconstrained. An admission condition on the target, not a promise that every answer finds enough ground for adjudication
deficit:  TargetUngrasped               -- activation precondition (Layer 1)
preserves: R                            -- read-only throughout; morphism acts on user understanding only
invariant: Comprehension over Explanation
invariant: Completion by the user       -- a task is completed only by the user's Confirm or sufficient; no reading of yours closes one
-/

namespace Katalepsis

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

/-- `R` with `U`: the comprehension target — the code, document, result, or other material
    whose understanding is sought, present in the context and quotable, whatever produced it —
    and the user's signal about what feels ungrasped, which may be empty on a bare `/grasp`.
    Both are read from the context. -/
abbrev Target (P : Type) := Context P

/-- `I`: the comprehension intent an entry point serves. -/
inductive Intent
  | orientation | rationale | impact | approval | transfer
  | emergent (name : String)

/-- An entry point, phrased as what the user will understand, decide, explain, or change by
    taking it; `anchor` is the artifact basis kept behind it as a grounding hint. -/
structure EntryPoint where
  label  : String
  intent : Intent
  anchor : String

/-- A question whose answer could change which entry point the user selects. -/
structure RouteQuestion where
  route        : String
  reason       : String
  signalNeeded : String

/-- `Fᵣ`: annotations over the entries, filtering, creating, or suppressing none of them.
    `cheapestProbe` names, per entry, the aspect a probe would most usefully target — never its
    expected answer or reasoning path. `hiddenRoutes` are entries the target supports that the
    user's signal did not name. -/
structure RouteMap where
  entries       : List EntryPoint
  cheapestProbe : List (String × String)
  hiddenRoutes  : List String
  openQuestions : List RouteQuestion

-- elab: an empty witness lets `routeMap` be declared `opaque`; it adds no meaning.
instance : Inhabited RouteMap := ⟨⟨[], [], [], []⟩⟩

/-- **Your judgment** at Phase 0, from the target, the user's wording, and the context: the
    likely intents, the entries derived from them, and their route annotations. -/
opaque routeMap : Context P → RouteMap

/-- **Your judgment**: the cited utterance selects these entry points, in order — offered
    entries, or a path the user wrote that stays within TargetUngrasped → VerifiedUnderstanding.
    Distinct concerns the user already named become the ordered list directly. -/
opaque SelectionSupported : Context P → Turn P → List EntryPoint → Prop

/-- The selection is the user's: only their statement fills it. -/
def selectionCoord : Coord P (List EntryPoint) :=
  { admits := (· = .utterance), supports := SelectionSupported }

-- elab: an open witness lets the occupancy readings below be declared `opaque`.
instance {A : Type} {q : Coord P A} {c : Context P} : Inhabited (Occ q c) := ⟨.open_ none⟩

/-- **Your judgment**: the selection the user's latest answer at entry selection made; open
    where it made none. -/
opaque selection : (c : Context P) → Occ (selectionCoord (P := P)) c

def isFilled {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Bool
  | .open_ _   => false
  | .filled .. => true

def filledValue {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Option A
  | .open_ _     => none
  | .filled a .. => some a

/-- The identity a record-creating write returned; every later record update names it. -/
abbrev RecordId := String

/-- One task per selected entry point. -/
structure Task where
  id    : RecordId
  entry : EntryPoint

/-- **Your record**, read from the context: the registered tasks in selection order, each keyed
    by the identity its registration write returned. -/
opaque tasks : Context P → List Task

/-- **Your judgment**: the cited utterance closes task `t` — `Confirm` at its zero-gap finding,
    or `sufficient` at its coverage gate. -/
opaque CompletionSupported : RecordId → Context P → Turn P → Unit → Prop

/-- A task is completed only by the user's statement. -/
def completionCoord (t : RecordId) : Coord P Unit :=
  { admits := (· = .utterance), supports := CompletionSupported t }

/-- **Your judgment**: whether the user has closed task `t`. -/
opaque completion : (c : Context P) → (t : RecordId) → Occ (completionCoord (P := P) t) c

/-- The task verification is on: the first registered task the user has not closed. -/
def current (c : Context P) : Option Task :=
  (tasks c).find? (fun t => !isFilled (completion c t.id))

/-- A comprehension gap type. -/
inductive GapType
  | expectation | causality | scope | sequence | horizon
  | emergent (description : String)

/-- An aspect the user can be offered and choose: every gap type but the Horizon, which is
    never offered at the start-aspect selector or at coverage. -/
abbrev Selectable := {g : GapType // g ≠ .horizon}

inductive ProbeForm | qc | qs

/-- Qc for Expectation and Sequence (classificatory), Qs for Causality, Scope, and Emergent
    (open). The Horizon maps to no form: it is probed only by its own scenario. -/
def probeKind : GapType → Option ProbeForm
  | .expectation => some .qc
  | .sequence    => some .qc
  | .causality   => some .qs
  | .scope       => some .qs
  | .emergent _  => some .qs
  | .horizon     => none

/-- **Your reading** of the gap types relevant to task `t`'s entry point, the Horizon apart —
    an Emergent one included where a Reopen named it. -/
opaque gaps : Context P → RecordId → List Selectable

/-- **Your record**, read from the context: the aspects already probed for task `t`, the
    Horizon probe apart. -/
opaque probed : Context P → RecordId → List Selectable

/-- `HC`: a co-intended but unspoken edge inside the selected entry point. -/
structure HorizonCandidate where
  edge        : String
  anchors     : List String
  failureMode : String

/-- **Your judgment**, read again over the whole fused context after every utterance: the
    candidates that qualify for task `t` — each bound to evidence in the materialized basis,
    material (leaving the edge unprobed is predicted to keep the achievable understanding short
    of R), unspoken in the user's signal, the entry labels, and every answer so far, and neither
    a route-selection question nor a decision gap. An edge the user has since spoken no longer
    qualifies, and an answer can bring a new one into view. Whether two candidates are the same
    edge is read here. -/
opaque qualifying : Context P → RecordId → List HorizonCandidate

/-- A Horizon is admissible only where exactly one candidate qualifies; several weak ones
    competing detect none. -/
def admissible (c : Context P) (t : RecordId) : Option HorizonCandidate :=
  match qualifying c t with
  | [hc] => some hc
  | _    => none

/-- **Your judgment**, read from your own turns in the context: a Horizon probe for `hc`'s edge
    on task `t` has already been presented. The user saw only its scenario; your own turn is
    what tells you which edge it was for. -/
opaque Asked : Context P → RecordId → HorizonCandidate → Prop

/-- An admissible Horizon not yet asked. -/
def HorizonDue (c : Context P) (t : RecordId) : Prop :=
  ∃ hc, admissible c t = some hc ∧ ¬ Asked c t hc

/-- **Your judgment**, read at the answer to a Horizon probe: the answer reaches the edge. -/
opaque Reached : Context P → Prop

/-- How an aspect came to be shown: by the user on their own, through an application after you
    disclosed the edge, or through an application after a cue the user asked for. What follows a
    disclosure or a cue never reads as independent detection. -/
inductive Demonstration | independent | afterDisclosure | afterCue

/-- **Your record**, read from the context: for task `t`, each aspect shown and how. -/
opaque demonstrated : Context P → RecordId → List (GapType × Demonstration)

/-- **Your judgment**: turn `idx` carries the target itself — its text, or an observation of
    reading it — rather than reasoning about it. -/
opaque IsTarget : Context P → Nat → Prop

/-- What an adjudication against an answer is drawn from, quoted in place at the narrowest span
    that supports it: the target itself, in the turn that carries it — whoever produced it,
    since here it is the object being understood rather than a claim standing as evidence — or
    a source the user cited, read now. The reasoning that produced the target, and what the
    session said about it earlier, are neither. -/
inductive Measure (c : Context P)
  | target (idx : Nat) (lt : idx < c.length) (span : String) (isTarget : IsTarget c idx)
  | source (src : Cite c) (span : String) (read : src.kind = .observation)

/-- An adjudication that stands against an answer. `otherReading` is the other reading the
    material admits, said beside it; empty when there is none. -/
structure Adjudication (c : Context P) where
  correction   : String
  measure      : Measure c
  otherReading : String

/-- **Your judgment**, read at the answer and once: you have an objection to it, in whole or in
    part, with material you could attach, and have not settled it. It is not a verdict; the
    inquiry exists to hear the user's reasoning before anything is settled. -/
opaque Objection : Context P → Prop

/-- **Your judgment**, read at the user's reasoning at the inquiry: an adjudication against the
    answer still stands — the reasoning did not defeat the objection, and there is material to
    attach. -/
opaque Stands : Context P → Prop

/-- **Your judgment**, read once the material it rests on has been read: the adjudication that
    stands, with what it is drawn from. -/
opaque adjudication : (c : Context P) → Option (Adjudication c)

/-- **Your judgment**: the cited utterance chooses this aspect at the start-aspect selector or at
    coverage. -/
opaque AspectSupported : Context P → Turn P → Selectable → Prop

def aspectCoord : Coord P Selectable :=
  { admits := (· = .utterance), supports := AspectSupported }

/-- **Your judgment**: the aspect the latest answer chose; open where it chose none. -/
opaque aspectChoice : (c : Context P) → Occ (aspectCoord (P := P)) c

/-- The one shape every turn of an active run ends in. -/
inductive Gate
  /-- Phase 1: the entries, enriched by the route map where it has anything to add -/
  | entrySelection
  /-- no gap for the task: the finding with its reasoning; Confirm or Reopen(description) -/
  | zeroGap (t : RecordId)
  /-- the preempting Horizon probe: an everyday scenario and nothing else — no edge, no expected
      answer, no reason for asking -/
  | horizonProbe (t : RecordId)
  /-- the disclosure owed after a Horizon answer that missed the edge: the edge named, the
      material from the target it rests on quoted in place, and an application question; where
      the user's utterance asked to go step by step, a cue comes first -/
  | reveal (t : RecordId)
  /-- which aspect to start with, over the task's gaps -/
  | startAspect (t : RecordId)
  /-- the probe of one aspect, in the form `probeKind` gives it, with a free-response path -/
  | probe (t : RecordId) (g : Selectable)
  /-- the reasoning inquiry on an objection to the answer to a probe, or to the application
      question after a disclosure (`g` is then the Horizon) -/
  | inquiry (t : RecordId) (g : GapType)
  /-- coverage: probed and unprobed aspects; sufficient, another aspect, or a proposal -/
  | coverage (t : RecordId)
  deriving Inhabited  -- elab: lets `answered` be declared `opaque`

/-- The gate that asks aspect `g` again once an adjudication against its answer stands: the
    Horizon's application question, or the same aspect's probe. -/
def again (t : RecordId) : GapType → Gate
  | .horizon     => .reveal t
  | .expectation => .probe t ⟨.expectation, nofun⟩
  | .causality   => .probe t ⟨.causality, nofun⟩
  | .scope       => .probe t ⟨.scope, nofun⟩
  | .sequence    => .probe t ⟨.sequence, nofun⟩
  | .emergent d  => .probe t ⟨.emergent d, nofun⟩

/-- **Your record**, read from the context: the gate your latest presentation opened, a Horizon
    probe included — your own turn shows which it was, though the user saw only a scenario. -/
opaque answered : Context P → Gate

/-- Relay metadata emitted before a gate, never in place of one. `outcome` says how the round
    ended: nothing to object to, an objection the user's reasoning defeated, nothing to check
    the answer against — none of them a demonstrated aspect — a Horizon edge the user reached,
    or one disclosed and applied, or, for a side branch, that the answer was read as a proposal
    and recorded. -/
structure ContinuationClosure where
  outcome   : String
  branch    : Option RecordId
  nextMoves : List String

/-- What the fused context says the user did at the gate. Premise: one utterance carries one
    disposition; silence is none of them. -/
inductive Verdict
  /-- a selection, an answer, a reasoning, a chosen aspect, a Reopen, a question, or any
      reading not yet settled -/
  | cont
  /-- Confirm at the zero-gap finding, or sufficient at coverage: the user closes the task -/
  | complete
  /-- a system change that brings in matter outside the target or directs action at the
      system; explanation, navigation, and clarification requests are not proposals -/
  | propose
  /-- the user stops verifying: what the rounds so far showed stays on record, and no task the
      user did not close is completed -/
  | withdraw
  deriving Inhabited  -- elab: lets `verdict` be declared `opaque`

/-- **Your judgment** on the whole latest utterance read with the context. -/
opaque verdict : Context P → Verdict

/-- **Your record**: contrary grounds you presented before the gate a closing utterance answered —
    an aspect you hold undemonstrated, an adjudication still standing — attached to the
    closure; empty when there were none. -/
opaque dissent : Context P → List String

/-- `VerifiedUnderstanding`: the context once every task is completed, carrying exactly what the
    rounds established and no more — for each task, each aspect shown and how — with the dissent
    attached to the closures. -/
structure VerifiedUnderstanding (P : Type) where
  context : Context P
  shown   : List (RecordId × List (GapType × Demonstration))
  dissent : List String

inductive Outcome (P : Type)
  | verified  (v : VerifiedUnderstanding P)
  /-- the user stopped; the context carries what was shown, and the dissent is attached -/
  | withdrawn (c : Context P) (dissent : List String)
  /-- the gate holds -/
  | holding   (c : Context P)

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it, the Horizon
included — whether one is due, whether it was asked, and whether an answer reached it are read
again after every utterance.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
A round is one step of a structural recursion over the user's utterances. `respond` is your
presentation of a gate, read from the context: the closure the round owes before it — a
`ContinuationClosure` after an answer no adjudication stands against, or the side-branch one
after a proposal — or the correction with its attached material after an adjudication, or the
disclosure of a missed Horizon with its material, then the gate itself. Every turn of an active
run ends in one `Gate`; a withdrawal ends the run instead, with what was shown presented.
-/

/-- **Your registration** at Phase 2: the artifact basis materialized for every selected entry
    point, and one record written per entry point; each write's returned identity enters the
    context as observed. -/
opaque register : Context P → List (Evidence P)

/-- **Your record update** naming a task as its verification begins. -/
opaque touch : Context P → List (Evidence P)

/-- **Your record update** marking the closed task completed. -/
opaque update : Context P → List (Evidence P)

/-- **Your read**, once an adjudication stands or a missed Horizon is to be disclosed, of whatever
    it rests on — the target, or a source the user cited that can be read now — observed and
    quoted at the narrowest span. -/
opaque attach : Context P → List (Evidence P)

/-- **Your record** of a proposal, verbatim, outside the task set; the write's returned identity
    enters the context as observed. -/
opaque eject : Context P → List (Evidence P)

inductive Step (P : Type)
  | gate      (c : Context P) (g : Gate)
  | done      (c : Context P)
  | withdrawn (c : Context P)

open Classical in
/-- Where task `t`'s verification stands, in priority order: an admissible Horizon not yet asked
    preempts everything; no gap at all is the zero-gap finding; nothing probed and no Horizon
    asked opens the start-aspect selector; otherwise coverage. -/
noncomputable def gateFor (c : Context P) (t : RecordId) : Gate :=
  if HorizonDue c t then .horizonProbe t
  else if (gaps c t).isEmpty ∧ admissible c t = none then .zeroGap t
  else if (probed c t).isEmpty ∧ ¬ ∃ hc, Asked c t hc then .startAspect t
  else .coverage t

open Classical in
/-- A return to a task-level gate: an admissible Horizon not yet asked preempts it, read on the
    context the latest answer fused. An aspect the user just chose is probed as chosen. -/
noncomputable def settle (c : Context P) (t : RecordId) (g : Gate) : Gate :=
  if HorizonDue c t then .horizonProbe t else g

/-- A task begins: the record update naming it, then the task's gate. -/
noncomputable def beginTask (c : Context P) (t : Task) : Step P :=
  let c₁ := c ++ (touch c).map (·.val)
  .gate c₁ (gateFor c₁ t.id)

/-- The user closed the current task: its record updated, then the next task, or convergence. -/
noncomputable def completeStep (c : Context P) : Step P :=
  let c₁ := c ++ (update c).map (·.val)
  match current c₁ with
  | none   => .done c₁
  | some t => beginTask c₁ t

/-- The gate a proposal returns to: the one it came from, or coverage for a Horizon probe. -/
def resumeOf : Gate → Gate
  | .horizonProbe t => .coverage t
  | g               => g

noncomputable def aspectStep (c : Context P) (g : Gate) (t : RecordId) : Step P :=
  match filledValue (aspectChoice c) with
  | some a => .gate c (.probe t a)
  | none   => .gate c (settle c t g)

open Classical in
/-- One answer, read at the gate it answers. -/
noncomputable def advance (c : Context P) : Gate → Verdict → Step P
  | g, .propose => .gate (c ++ (eject c).map (·.val)) (resumeOf g)
  | _, .withdraw => .withdrawn c
  | .zeroGap _, .complete => completeStep c
  | .coverage _, .complete => completeStep c
  | .entrySelection, _ =>
    if isFilled (selection c) then
      let c₁ := c ++ (register c).map (·.val)
      match current c₁ with
      | some t => beginTask c₁ t
      | none   => .gate c₁ .entrySelection
    else .gate c .entrySelection
  | .zeroGap t, _ => .gate c (gateFor c t)
  | .horizonProbe t, _ =>
    if Reached c then .gate c (settle c t (.coverage t))
    else .gate (c ++ (attach c).map (·.val)) (.reveal t)
  | .reveal t, _ =>
    if Objection c then .gate c (.inquiry t .horizon) else .gate c (settle c t (.coverage t))
  | .probe t g, _ =>
    if Objection c then .gate c (.inquiry t g.val) else .gate c (settle c t (.coverage t))
  | .inquiry t g, _ =>
    if Stands c then .gate (c ++ (attach c).map (·.val)) (again t g)
    else .gate c (settle c t (.coverage t))
  | .startAspect t, _ => aspectStep c (.startAspect t) t
  | .coverage t, _ => aspectStep c (.coverage t) t

/-- Presenting a gate. -/
def present (respond : Context P → Gate → Response P) (c : Context P) (g : Gate) : Context P :=
  c ++ [(respond c g).val]

/-- Convergence: the trace presented, then the resolution; `trace` is your convergence
    presentation — each task with its status, the aspects detected for it, the Horizon among them
    where one was asked, and each aspect shown with how it was shown. -/
def understanding (trace : Context P → Response P) (c : Context P) : VerifiedUnderstanding P :=
  { context := c ++ [(trace c).val]
    shown   := (tasks c).map (fun t => (t.id, demonstrated c t.id))
    dissent := dissent c }

noncomputable def grasp (respond : Context P → Gate → Response P)
    (trace : Context P → Response P) : Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let c' := fuse c u
    match advance c' (answered c) (verdict c') with
    | .done c₁      => .verified (understanding trace c₁)
    | .withdrawn c₁ => .withdrawn c₁ (dissent c₁)
    | .gate c₁ g    => grasp respond trace (present respond c₁ g) us

/-- The run begins at entry selection, over the route map Phase 0 assessed in silence. -/
noncomputable def start (respond : Context P → Gate → Response P)
    (trace : Context P → Response P) (c : Context P) (us : List (Utterance P)) : Outcome P :=
  grasp respond trace (present respond c .entrySelection) us

/-! ── LOOP ──
Every answer is read with the whole context; nothing the user said is narrowed to the gate's
options. An answer that stays in the comprehension loop takes exactly one of adjudicated or
unadjudicated; a proposal is recorded and the loop resumes where it was. No gate holds a round
cap: re-entering a gate is dialogue. A user who stops says so, and the withdrawal ends the run
with what was shown on record; leaving without saying so is the host's to deliver.
Continue until every selected task is completed, or the user withdraws. The Horizon judgment is
read again after every utterance: an edge the user has since spoken is not asked, an answer can
bring a new one into view, and one already asked is not asked again. An answer that misses the
edge is followed by its disclosure, not by a second concealed scenario; a user who asks to go
step by step gets a cue first, because their utterance steers the next presentation. Convergence
evidence: for each task, TargetUngrasped(t) → its status, with the aspects detected for it — the
Horizon among them where one was asked — and each aspect shown with how it was shown; how each
probe ended was said in the closure of the round that ran it and does not travel here.
Demonstrated, not asserted.
-/

/-!
Silence completes nothing.
theorem silence (respond : Context P → Gate → Response P) (trace : Context P → Response P)
    (c : Context P) : grasp respond trace c [] = .holding c

An admissible Horizon not yet asked preempts every other gate of its task.
theorem horizon_preempts (c : Context P) (t : RecordId) (hd : HorizonDue c t) :
    gateFor c t = .horizonProbe t

It preempts a return to the task's gates the same way, read on the context the latest answer
fused.
theorem horizon_preempts_return (c : Context P) (t : RecordId) (g : Gate)
    (hd : HorizonDue c t) : settle c t g = .horizonProbe t

An edge already asked is not asked again.
theorem asked_not_reasked (c : Context P) (t : RecordId) (hc : HorizonCandidate)
    (ha : admissible c t = some hc) (hk : Asked c t hc) : gateFor c t ≠ .horizonProbe t

A Horizon answer that missed the edge is followed by its disclosure, with the material it rests
on read, and never by a second concealed scenario.
theorem miss_discloses (c : Context P) (t : RecordId) (hm : ¬ Reached c) :
    advance c (.horizonProbe t) .cont = .gate (c ++ (attach c).map (·.val)) (.reveal t)

A Horizon answer that reached the edge is taken; the loop returns to the task.
theorem reached_taken (c : Context P) (t : RecordId) (hr : Reached c) :
    advance c (.horizonProbe t) .cont = .gate c (settle c t (.coverage t))

No adjudication is reached at a probe's answer: nothing is read or attached there, and the next
gate is the inquiry or a return to the task.
theorem no_adjudication_at_probe (c : Context P) (t : RecordId) (g : Selectable) :
    advance c (.probe t g) .cont = .gate c (.inquiry t g.val) ∨
      advance c (.probe t g) .cont = .gate c (settle c t (.coverage t))

Every answer yields the next gate, convergence only on the user's completion, or the end only on
the user's withdrawal.
theorem advance_shape (c : Context P) (g : Gate) (v : Verdict) :
    (∃ c₁ g₁, advance c g v = .gate c₁ g₁) ∨
      (v = .complete ∧ ∃ t, advance c g v = .done (c ++ t)) ∨
      (v = .withdraw ∧ advance c g v = .withdrawn c)

A proposal is recorded and the loop resumes where it was.
theorem proposal_resumes (c : Context P) (g : Gate) :
    advance c g .propose = .gate (c ++ (eject c).map (·.val)) (resumeOf g)

Where the user's reasoning defeats the objection, nothing is read or attached.
theorem defeated_attaches_nothing (c : Context P) (t : RecordId) (g : GapType)
    (hs : ¬ Stands c) : advance c (.inquiry t g) .cont = .gate c (settle c t (.coverage t))
-/

/-! ── CONVERGENCE ──
converged: every selected task completed — each carried to where the user closed it. What
convergence establishes is that the loop ran out over the aspects in play: those the user
selected, and every admissible Horizon, which is asked before any selection and never offered at
one. It re-evaluates no round: an aspect closed with sufficient was closed on the user's judgment
rather than by a demonstration, an answer no adjudication reached was never demonstrated, and an
aspect shown after a disclosure or a cue is recorded as such, never as independent detection;
each round's closure said which. Where a round settled an aspect or disclosed an edge, it did so
against your reading of the target, quoted from the target itself, so the user weighed that
material rather than your account of it. A withdrawal is its own ending: what was shown stays on
record and nothing the user did not close is completed.
-/

/-!
Verified understanding follows only a user's utterance that closed the last task.
theorem verified_by_person (respond : Context P → Gate → Response P)
    (trace : Context P → Response P) (c : Context P) (us : List (Utterance P))
    (v : VerifiedUnderstanding P) (hv : grasp respond trace c us = .verified v) :
    ∃ (c₀ : Context P) (u : Utterance P), verdict (fuse c₀ u) = .complete ∧
      ∃ t, v.context = fuse c₀ u ++ t

A run ends withdrawn only on the user's own withdrawal.
theorem withdrawn_by_person (respond : Context P → Gate → Response P)
    (trace : Context P → Response P) (c : Context P) (us : List (Utterance P))
    (c₁ : Context P) (d : List String) (hw : grasp respond trace c us = .withdrawn c₁ d) :
    ∃ (c₀ : Context P) (u : Utterance P), c₁ = fuse c₀ u ∧ verdict c₁ = .withdraw

A task, a selection, and a chosen aspect are each filled only by the user's statement.
theorem completed_by_utterance {c : Context P} {t : RecordId} {s : Cite c}
    (ok : (completionCoord (P := P) t).admits s.kind) : s.kind = .utterance

theorem selected_by_utterance {c : Context P} {s : Cite c}
    (ok : (selectionCoord (P := P)).admits s.kind) : s.kind = .utterance

theorem aspect_by_utterance {c : Context P} {s : Cite c}
    (ok : (aspectCoord (P := P)).admits s.kind) : s.kind = .utterance

An offered or chosen aspect is never the Horizon.
theorem selectable_not_horizon (g : Selectable) : g.val ≠ .horizon
-/

/-! ── TOOL GROUNDING ── -/
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
-- Interpretive transparency (Basis:) intentionally absent: Socratic verification requires AI judgment opacity — surfacing reasoning would compromise probe authenticity. Attaching the material an adjudication was drawn from is a separate axis and is not suppressed by that declaration: it fires only after an answer, only where an adjudication stands against it or a Horizon answer missed the edge, and it carries the material adjudicated or disclosed from rather than the reasoning path that selected it. Stated cost, taken rather than solved: an excerpt attached at one aspect can contain what a later probe on another aspect would have asked for; the narrowest span reduces that and nothing removes it

inductive Annot | sense | observe | track | transform | dispatch | constitution | extension

inductive Op | orient | deriveEntries | assessRoute | routeRelay | entrySelection | materialize
             | register | touch | detect | horizon | horizonProbe | reveal | zeroGap | startAspect
             | probe | inquiry | attach | closure | coverage | update | eject | readAnswer
             | withdrawal | converge | seam

def grounding : Op → Annot × String
  | .orient         => (.observe, "artifact read (if needed): infer likely comprehension intents from the target and the user's wording")
  | .deriveEntries  => (.sense, "Internal analysis: intent-scented entry points derived from the intents and the target")
  | .assessRoute    => (.sense, "Internal analysis: entry-point adequacy annotations — the intent each serves, its anchor hint, the cheapest probe target, hidden routes, and bounded open questions; opacity-preserving, exposing selection scent and never a probe answer")
  | .routeRelay     => (.extension, "TextPresent+Proceed: entry-fit distinctions, hidden routes, and bounded open questions from the route map; omitted when empty")
  | .entrySelection => (.constitution, "present: entry selection enriched by the route map; single by default, an ordered list when the user names several concerns; a path the user writes stays valid")
  | .materialize    => (.sense, "Internal analysis: the artifact basis for every selected entry point, a path the user wrote included")
  | .register       => (.track, "record: one per selected entry point; each write returns the identity every later record update names")
  | .touch          => (.track, "record update: names the task as its verification begins")
  | .detect         => (.sense, "Internal analysis: the gap types relevant to the task's entry point, read on the fused context")
  | .horizon        => (.sense, "Internal analysis: the admissible-Horizon guard, read again after every utterance — exactly one qualifying candidate, evidence-bound, material, unspoken in the signal and every answer so far, neither a route-selection question nor a decision gap — and whether that edge was already asked, read from your own turns; never exposed before a miss")
  | .horizonProbe   => (.constitution, "present (conditional: an admissible Horizon not yet asked for the task): the preempting Horizon probe, before the start-aspect selector and before a return to the task's gates — an everyday scenario only, never a Horizon label, the edge, an expected answer, or the rationale; an answer that reaches the edge is taken, one that misses it is disclosed")
  | .reveal         => (.constitution, "present (conditional: the answer to a Horizon probe missed the edge): the disclosure — the edge named, the material from the target it rests on quoted in place at the narrowest span, and an application question; where the user asked to go step by step, a cue first; never a second concealed scenario")
  | .zeroGap        => (.constitution, "present (conditional: no gap for the task): the zero-gap finding with its reasoning; Confirm completes the task, Reopen(description) adds the named gap and resumes verification")
  | .startAspect    => (.constitution, "present (conditional: gaps to offer, nothing probed yet for the task): which aspect to start with, over the task's gaps")
  | .probe          => (.constitution, "present: the probe of the bound aspect in the form probeKind gives it — Qc for Expectation and Sequence, Qs for Causality, Scope, and Emergent — after the selected artifact context and a concrete scenario, with a free-response path")
  | .inquiry        => (.constitution, "present: the reasoning inquiry on an objection to the answer, whole or partial, opened before anything is settled")
  | .attach         => (.observe, "artifact read + excerpt attachment: read whatever the standing adjudication or the missed Horizon rests on — the target itself, or a source the user cited that can be read now, in any form — and quote in place the narrowest span it rests on — only once an adjudication stands after the user's reasoning, or a Horizon answer missed the edge; a locator the user must open is not an attachment")
  | .closure        => (.extension, "TextPresent+Proceed: the continuation closure — the round's outcome, any side branch with its record, the task's status, the return point, and the next moves — before coverage or the resumed gate, never in place of a gate")
  | .coverage       => (.constitution, "present: aspect coverage — probed and unprobed aspects, the Horizon never among the offers; sufficient, another aspect, or a proposal")
  | .update         => (.track, "record update: marks the closed task completed, naming the identity its registration returned")
  | .eject          => (.track, "record: a proposal verbatim, outside the task set; the closure says it was read as a proposal and the gate it came from opens again")
  | .readAnswer     => (.sense, "Internal analysis: the whole latest utterance read with the context — its verdict, the selection, the chosen aspect, whether a Horizon answer reached the edge, the objection, and whether an adjudication stands")
  | .withdrawal     => (.extension, "TextPresent+Proceed: on the user's withdrawal, what was shown so far — each aspect with how it was shown — and any dissent; no task the user did not close is completed")
  | .converge       => (.extension, "TextPresent+Proceed: the convergence trace, presented before VerifiedUnderstanding is returned — each task with its status, the aspects detected for it (the Horizon among them where one was asked), and each aspect shown with how it was shown: independently, or through an application after a disclosure or a cue; any dissent attached to a closure")
  | .seam           => (.extension, "TextPresent+Proceed: at a user-declared chain naming the next protocol, proceed to it citing that source; this protocol declares no wired outbound edge, and every Constitution gate inside this protocol and the next fires unchanged")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
-/

end Katalepsis
```

## Mode Activation

`/grasp` is user-invoked only: activate when the user signals a wish to understand a target already present in context and available for verbatim quotation, whatever its provenance — AI-produced work, code or a document someone else wrote, or material the session has put on the table; a bare command refers to the current target. Do not activate for an unrelated general question, an accurate account that already demonstrates understanding, an explicit decline, or a trivial formatting-only result.

Loaded safety boundaries, capability restrictions, and explicit user instructions continue to bind while Katalepsis is active.

## Protocol

### Intent-scented entry rendering

Derive up to three first-turn labels from the user's likely comprehension intent — Orientation, Rationale, Impact, Approval, Transfer, or an Emergent intent — and phrase each as what the user will understand, decide, explain, or change by taking that path. Keep Code, Plan, Document, Analysis, Model, or mixed artifact bases behind those labels as grounding anchors. Descriptions state what becomes clear and why it matters; route-map metadata may enrich a label but never reveal a probe answer or reasoning path. A user-authored path remains valid when it stays within `TargetUngrasped → VerifiedUnderstanding`; multiple concerns the user already named become the ordered task list directly.

### Verification rendering and safeguards

Present the selected artifact context and a concrete scenario before each probe. For non-Horizon classificatory probes, render recognizable correct, partial, and misconception trajectories with domain-specific consequences; constitutive probes invite the user's own reasoning, and every probe preserves a free-response path.

Read whether a Horizon is due again after every answer, over the whole context: an edge the user has since spoken is not asked, an answer can bring a new one into view, and one already asked is not asked again. Ask it through its everyday scenario only, never its label, suspected edge, expected answer, or rationale before the answer. An answer that reaches the edge is taken. An answer that misses it is followed at once by the disclosure: name the edge, quote the material from the target it rests on at the narrowest span, and ask an application question — no second concealed scenario. Where the user asks to go step by step, give a cue first; their utterance steers the next presentation. Record how each aspect was shown — on their own, or through an application after a disclosure or a cue — and never present what followed a disclosure as independent detection. An answer you have an objection to first opens a reasoning inquiry grounded in the user's actual answer. Where that reasoning defeats the objection, nothing is corrected and the round closes as any other unadjudicated one does. Where an adjudication stands after it, target the correction at what that adjudication actually reaches — the disclosed mental model where that is what is wrong, the part it bears on where the rest of the answer stood — and re-probe that aspect.

Treat a response as a proposal side branch only when it suggests a system change and either introduces matter outside `R` or directs action at the system; explanation, navigation, and clarification requests remain in the comprehension loop. Record a proposal verbatim, emit the side-branch closure saying the answer was read as a proposal, and open again the gate it came from — a proposal at the Horizon probe resumes at that task's coverage — without turning it into a comprehension task. The reading is yours and closes nothing: an answer the user meant as an answer is answered at that gate.

When you adjudicate against the user's answer, attach what you adjudicated from. Quote that material in place, at the narrowest span that actually supports the correction — enough that they can read it where they are and argue with it, and no wider, since a dump costs them the reading and buries what the verdict turned on. A pointer they have to go open is not an attachment. The accumulated context and what the user says steer which reading is in play; they are not what you adjudicate from. An ordinary assertion about the target does not license you to adjudicate that same assertion, and something the session said earlier does not stand as the measure against what the target says now. What does stand is the target itself, or a source they cited that you can read now. A ground you cannot attach is not a ground you can adjudicate from here — this instrument admits exactly what it can quote.

Where the attached material admits more than one reading, say which one you took and that it could go another way — beside the excerpt, so they weigh your reading against the same material rather than against your confidence in it. Where you have nothing to attach, do not adjudicate at all: take the answer, say you have no ground to check it against, and name what you would have needed. They may let the aspect stand on their own account, or move on to another; neither is a demonstrated aspect and the closure says so.

When grounding an explanation or correction, cite concrete locations in the target — file and line where it is code, the equivalent anchor where it is not. Read `references/round-composition.md` before composing when terminology must remain stable, wording must be carried unchanged, content belongs to another round or trace, or phase order determines whether text belongs before or inside a gate.

### Intensity

| Level | Realization |
|-------|-------------|
| Light | One Constitution probe of core understanding |
| Medium | One scenario probe of prediction or impact |
| Heavy | Decomposed probes of causal or sequential understanding |

## Rules

- **User-initiated only**: Activate only on the user's wish to understand a target present in context and quotable, whatever produced it; an explicit decline before activation withholds it; a withdrawal during a run ends it with what was shown on record, and leaving without saying so is the host's to deliver.
- **Intent scent before artifact taxonomy**: First user-facing options name the user's likely comprehension outcome; artifact categories remain grounding material.
- **User authority**: The user's account of what they understand stands for the ground it covers. Do not probe that ground again.
- **Rebuttable adjudication**: When you adjudicate against the user's answer, attach the material you adjudicated from — the target itself, or a source they cited that you can read now — quoted in place, at the narrowest span that supports the correction, never a locator they must open and never wider than the verdict. Where that material admits another reading, say which one you took, beside it. Where you have nothing to attach, do not adjudicate: take the answer, say you cannot check it, and name what you would have needed; what follows is attested or set aside, never demonstrated.
- **Proposal ejection and continuation**: Externalize a qualifying proposal without closing Katalepsis. Keep its record reference outside the task set, say in the closure that it was read as a proposal and where the loop resumes, then open again the gate it came from.
- **Round composition**: Compose each round so the reader can act without reassembly — use everyday language, keep each judgment beside its evidence and next-move implication (your own adjudication included, its evidence being the excerpt attached with it), and place analytical context before its gate.
9a. **Post-answer closure**: After an answer the comprehension loop kept and no adjudication stands against — an ejected proposal takes the continuation closure named above instead — emit the aspect's outcome as the closure records it, with current task status, the gate the loop returns to, and next available moves before coverage routing.
9b. **Active-turn fail-closed**: While a run is active, end every turn in one `Gate`; relay context and continuation metadata may precede it but never replace it.
- **Zero-gap surfacing**: The zero-gap finding carries its reasoning to its gate; only `Confirm` completes the entry, while `Reopen(description)` adds the named Emergent gap and resumes verification.
14a. **Horizon boundary**: Horizon is an evidence-bound comprehension edge inside the selected entry point, not route selection, a decision gap, reframing, or perspective fusion. Admit it only through `admissible`, read again on the fused context after every answer; ask each edge once, through its scenario only; disclose it with its material when the answer misses it; and demote or revise the instrumentation after repeated applicable opportunities if detections remain absent, speculative, or unhelpful.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
