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
Every `axiom` declaration is a judgment that is yours to make from the material in front of
you; its doc comment says what you judge there, and nothing in this block decides it for you.
Every `def`, `inductive`, and `structure` is fixed by the contract. A `theorem` line inside a
doc comment states a consequence the contract already has; it is proved outside this block
and asks nothing further of you.
-/

/-! ── FLOW ──
Orient silently → present intent-scented entries and route adequacy → Stop.
Fuse the next utterance → read it once at that context → advance → present the resulting Round.
Task priority and answer handling are defined below, in settle and advance respectively.
A final person's closure → certified task trace → VerifiedUnderstanding.
Withdrawal → the trace so far. Silence → the existing gate holds.
-/

/-! ── MORPHISM ──
Target
  → orient(target, user_signal)        -- infer likely comprehension intents from the target and the user's wording
  → derive_entries(intent)             -- transform inferred intent into high-scent entry points
  → assess_route(intents, entries, context) -- annotate entry-point adequacy before user selection
  → select(intent_entry_point, route_map) -- user chooses the closest intent-scented entry point
  → materialize(artifact_basis)        -- derive concrete artifact anchors for the chosen intent
  → register(tasks)                    -- identify selected tasks by their selection turn and position
  → verify(comprehension)              -- Socratic probing per gap type, each adjudication against an answer attaching the material it was drawn from; a Horizon the answer missed is disclosed with its material and applied; a contradiction in the context is taken up by whose it is
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
open Classical
variable {P : Type}

/-- The target is material present and quotable, regardless of its producer. -/
abbrev Target (P : Type) := Context P

inductive Intent
  | orientation | rationale | impact | approval | transfer | emergent (name : String)
  deriving DecidableEq

structure EntryPoint where
  label : String
  intent : Intent
  anchor : String

structure RouteQuestion where
  route : String
  reason : String
  signalNeeded : String

structure RouteMap where
  entries : List EntryPoint
  cheapestProbe : List (String × String)
  hiddenRoutes : List String
  openQuestions : List RouteQuestion

/-- Judge likely comprehension intents from target and user signal, deriving high-scent entries
    and adequacy annotations. Preserve the user's paths and distinguish entry fit without
    exposing expected probe answers. Materialize anchors when an entry is selected. -/
axiom routeMap : Context P → RouteMap

/-- Selection turn and position within its ordered entries; identity is local to this run. -/
abbrev RecordId := Nat × Nat

structure Task where
  id : RecordId
  entry : EntryPoint

inductive GapType
  | expectation | causality | scope | sequence | horizon | contradiction
  | emergent (description : String)
  deriving DecidableEq

def offered : GapType → Bool
  | .horizon | .contradiction => false
  | _ => true

abbrev Selectable := {g : GapType // offered g = true}
inductive ProbeForm | qc | qs

def probeKind (g : Selectable) : ProbeForm :=
  match g.val with
  | .expectation | .sequence => .qc
  | _ => .qs

/-- `edge` is a stable name for the same edge across its contextual re-descriptions. -/
structure HorizonCandidate where
  edge : String
  anchors : List String
  failureMode : String

/-- Location is distinct from eligibility as evidence: an AI explanation can be a side. -/
structure Side (c : Context P) where
  idx : Nat
  lt : idx < c.length
  span : String

structure Contradiction (c : Context P) where
  one : Side c
  other : Side c

/-- Judge that the located turn carries the target itself, with the quoted span, rather than
    the reasoning that produced it. Target provenance is unrestricted; where the turn is your own,
    whether it carries the target or reasoning about it is read here from its content. -/
axiom IsTarget : (c : Context P) → Side c → Prop

/-- Judge that the person's cited turn identifies this source and that the observation reads
    that source now. The span is the narrowest material supporting the judgment, quoted in place. -/
axiom SourceRead : (c : Context P) → Cite c → Cite c → String → Prop

inductive Measure (c : Context P)
  | target (s : Side c) (object : IsTarget c s)
  | source (citation : Cite c) (user : citation.src.val = .person)
      (observed : Cite c) (readNow : observed.src.val = .external)
      (span : String) (linked : SourceRead c citation observed span)

/-- The actual material consumed by disclosure or correction, including the reading it supports.
    Any alternative reading of the material is said beside it. -/
structure Adjudication (c : Context P) where
  correction : String
  measure : Measure c
  otherReading : String

/-- The ownership distinction determines the obligation; your correction already carries its
    measure, while a finding about the target may leave both sides unsettled. -/
inductive ConflictReading (c : Context P)
  | user (conflict : Contradiction c)
  | target (conflict : Contradiction c) (settled : Option (Adjudication c))
  | yours (conflict : Contradiction c) (correction : Adjudication c)

inductive Demonstration | independent | afterCue | afterDisclosure
  deriving DecidableEq

/-- Horizon edges have separate identities even when both belong to the Horizon gap type.
    Ordinary gap types use the empty key. -/
abbrev Aspect := GapType × String

/-- Gate names identify obligations, not the wording or material of their presentation. -/
inductive Gate
  | entrySelection
  | zeroGap (t : RecordId)
  | startAspect (t : RecordId)
  | coverage (t : RecordId)
  | horizonProbe (t : RecordId) (edge : String)
  | cue (t : RecordId) (edge : String)
  | reveal (t : RecordId) (edge : String)
  | conflict (t : RecordId)
  | resolve (t : RecordId)
  | probe (t : RecordId) (g : Selectable)
  | inquiry (t : RecordId) (g : Aspect)

def Gate.task : Gate → Option RecordId
  | .entrySelection => none
  | .zeroGap t | .startAspect t | .coverage t | .horizonProbe t _ | .cue t _
  | .reveal t _ | .conflict t | .resolve t | .probe t _ | .inquiry t _ => some t

def Gate.aspect : Gate → Option Aspect
  | .horizonProbe _ edge | .cue _ edge | .reveal _ edge => some (.horizon, edge)
  | .conflict .. | .resolve .. => some (.contradiction, "")
  | .probe _ g => some (g.val, "")
  | .inquiry _ g => some g
  | _ => none

def Gate.closable : Gate → Bool
  | .zeroGap _ | .coverage _ => true
  | _ => false

inductive Choice
  | entries (es : List EntryPoint)
  | aspect (g : Selectable)
  | close

/-- The mutually exclusive handling forms of one utterance. A compound or unsettled utterance
    stays `pending` with its full content in context; the person is never asked to classify it.
    `met` carries the measure of what was shown. `accepted` carries what remains unattested.
    `correct` carries a standing adjudication after reasoning, or the material of an in-intent
    Horizon miss or standing contradiction. With unavailable material use `accepted`, naming
    what is missing and carrying the unverified edge to coverage. -/
inductive Answer (c : Context P)
  | pending
  | choose (value : Choice)
  | reopen (description : String)
  | steps
  | other (entry : EntryPoint) (basis : String)
  | met (measure : Measure c)
  | accepted (reason : String)
  | dissolved
  | object (reason : String)
  | correct (judgment : Adjudication c)
  | propose (verbatim : String)
  | withdraw

structure Reading (c : Context P) where
  gate : Gate
  answer : Answer c

/-- **Your read**, before judging person turn `u`, of any source it cites, now — observed. Empty
    where the answer rests on nothing outside the context. -/
axiom consult : Context P → Utterance P → List (Evidence P)

/-- The context an answer is judged against: the turn fused, then what `consult` observed. -/
def consulted (c : Context P) (u : Utterance P) : Context P :=
  fuse c u ++ (consult c u).map (·.val)

/-- Read the whole person turn, whatever its form, once against the context that stood when it
    was sent and what `consult` observed for it. Selecting entries, choosing an aspect, and
    closing the task (Confirm at zero-gap, sufficient at coverage) are `choose`. `gate` is
    the presentation it answered; if it sets aside your preceding candidate intent reading,
    restore the original gate and read the original missed answer with this correction.
    At a Horizon answer: reached → met; request for steps → steps; otherwise read intent before
    disclosure. At any missed answer, including reasoning, another intent → other, offered as
    a candidate with its basis, destination, and invitation to correct it. Within intent:
    Horizon miss → correct; contradiction explanation → dissolved, correct if material settles
    it, accepted otherwise; probe/application → object before any adjudication, met only with
    material verifying it, accepted otherwise; inquiry → correct only if the objection stands.
    No knowledge is inferred from completion. A proposal changes the system outside the target;
    explanation, navigation and clarification stay within this loop. -/
axiom read : (c : Context P) → (u : Utterance P) → Reading (consulted c u)

/-- A projection for the trace, never a second state store. Ground remains at the original turn. -/
inductive Act
  | hold | select (entries : List EntryPoint) | close | reopen (description : String)
  | steps | other (entry : EntryPoint) (basis : String) | met | accepted (reason : String)
  | dissolved | object (reason : String) | correct | propose (verbatim : String) | withdraw

structure Record where
  gate : Gate
  act : Act

def recorded {c : Context P} (r : Reading c) : Record :=
  ⟨r.gate, match r.answer with
    | .pending => .hold
    | .choose v => match r.gate, v with
      | .entrySelection, .entries es => .select es
      | .zeroGap _, .close | .coverage _, .close => .close
      | _, _ => .hold
    | .reopen d => .reopen d
    | .steps => match r.gate with
      | .horizonProbe .. | .cue .. => .steps
      | _ => .hold
    | .other e b => .other e b
    | .met _ => .met
    | .accepted s => .accepted s
    | .dissolved => .dissolved
    | .object s => .object s
    | .correct _ => match r.gate with
      | .horizonProbe .. | .cue .. | .conflict .. | .inquiry .. => .correct
      | _ => .hold
    | .propose s => .propose s
    | .withdraw => .withdraw⟩

def readRecord (c : Context P) (u : Utterance P) : Record := recorded (read c u)

def asUtterance (e : Turn P) : Option (Utterance P) :=
  match e with
  | ⟨.person, p⟩ => some ⟨⟨.person, p⟩, rfl⟩
  | _ => none

/-- Historical choices and outcomes are read at their original prefix; fresh task assessment
    below still uses the entire fused context. These are two different temporal obligations. -/
def said (c : Context P) : List (Nat × Record) :=
  (List.range c.length).filterMap fun i =>
    (c[i]?.bind asUtterance).map fun u => (i, readRecord (c.take i) u)

def tasks (c : Context P) : List Task :=
  (said c).flatMap fun (i, r) => match r.act with
    | .select es => es.zipIdx.map fun (e, j) => ⟨(i, j), e⟩
    | _ => []

def completed (c : Context P) (t : RecordId) : Prop :=
  ∃ i r, (i, r) ∈ said c ∧ r.gate.task = some t ∧ r.act = .close

def current (c : Context P) : Option Task :=
  (tasks c).find? fun t => decide (¬ completed c t.id)

/-- Judge whether the registered entry serves the candidate intent, including emergent intents
    with different wording. Identity of labels alone does not decide this. -/
axiom Serves : EntryPoint → EntryPoint → Prop

def taskFor (c : Context P) (e : EntryPoint) : Option Task :=
  (tasks c).find? fun t => decide (Serves t.entry e ∧ ¬ completed c t.id)

/-- Entry selection opens its own first selected task, even after an intent redirect. -/
def selectedTask (c : Context P) : Option Task :=
  (tasks c).find? fun t => t.id.1 + 1 == c.length && decide (¬ completed c t.id)

def Asked (c : Context P) (t : RecordId) (edge : String) : Prop :=
  ∃ i r, (i, r) ∈ said c ∧ r.gate = .horizonProbe t edge

def probed (c : Context P) (t : RecordId) : Bool :=
  (said c).any fun (_, r) => match r.gate with
    | .probe task _ => task == t
    | _ => false

def reopenedGaps (c : Context P) (t : RecordId) : List Selectable :=
  (said c).filterMap fun (_, r) => match r.gate, r.act with
    | .zeroGap task, .reopen d => if task = t then some ⟨.emergent d, rfl⟩ else none
    | _, _ => none

/-- Judge the gaps, qualifying Horizon candidates and due contradiction afresh over the whole
    context. Candidates are evidence-bound, material, unspoken across signal, labels and answers,
    and belong to comprehension of this entry; exactly one will be admitted by `admissible`.
    Keep stable names for identical edges. A Reopen adds its emergent gap. Contradictions require
    distinct sourced sides, the same scope and premises, and readiness to be understood; a
    repeated claim is one side. A contradiction already taken up is absent from `conflict`.
    Explicit Reopen gaps and prior probes are derived separately from history. -/
structure Assessment (c : Context P) where
  gaps : List Selectable
  candidates : List HorizonCandidate
  conflict : Option (ConflictReading c)

/-- Assess task `t` under the constraints of `Assessment`, from the fused context. -/
axiom assess : (c : Context P) → RecordId → Assessment c

def admissible (a : Assessment (P := P) c) : Option HorizonCandidate :=
  match a.candidates with
  | [h] => some h
  | _ => none

def dueHorizon (c : Context P) (t : RecordId) : Option HorizonCandidate :=
  (admissible (assess c t)).filter fun h => decide (¬ Asked c t h.edge)

def userConflict (c : Context P) (t : RecordId) : Option (Contradiction c) :=
  match (assess c t).conflict with
  | some (.user k) => some k
  | _ => none

/-- The history fixes assistance provenance; a later answer cannot turn assisted performance
    into independent detection. -/
def assistance (c : Context P) (t : RecordId) (g : Aspect) : Demonstration :=
  if (said c).any (fun (_, r) => r.gate.task == some t && r.gate.aspect == some g &&
      match r.act with | .correct => true | _ => false) then .afterDisclosure
  else if (said c).any (fun (_, r) => r.gate.task == some t && r.gate.aspect == some g &&
      match r.act with | .steps => true | _ => false) then .afterCue
  else .independent

/-- Trace rows retain source-turn positions: material and the full reading are recoverable there.
    Only `met` demonstrates an aspect; accepting, closing and failing to refute do not. -/
def shown (c : Context P) : List (RecordId × Aspect × Demonstration) :=
  (said c).filterMap fun (i, r) => match r.act, r.gate.task, r.gate.aspect with
    | .met, some t, some g => some (t, g, assistance (c.take i) t g)
    | _, _, _ => none

def AllClosed (c : Context P) : Prop :=
  tasks c ≠ [] ∧ ∀ t ∈ tasks c, completed c t.id

/-! ── MODE STATE ──
The state is the fused context alone. `said`, `tasks`, `shown` and the live assessment are
projections of it. Records identify the selection that created a task, not an external writer.
-/

/-! ── PHASE TRANSITIONS ── -/

/-- Relay carried with the next gate. Render evidence beside its judgment and implication.
    `intent` includes the invitation to correct the candidate reading, adding no question.
    `finding` is the target's contradiction; `correction` is your own explanation's correction.
    `order` is said with its basis when a user contradiction preempts. For a Horizon ahead of a
    chosen aspect, say only that the chosen aspect comes next; explain precedence after the answer. -/
inductive Notice (c : Context P)
  | routes (map : RouteMap)
  | closure (outcome : String)
  | intent (entry : EntryPoint) (basis : String)
  | material (judgment : Adjudication c)
  | demonstration (measure : Measure c)
  | sides (conflict : Contradiction c)
  | scenario (candidate : HorizonCandidate)
  | finding (conflict : Contradiction c)
  | correction (conflict : Contradiction c)
  | order
  | proposal (verbatim : String)

structure Round (c : Context P) where
  gate : Gate
  notices : List (Notice c) := []

def entryRound (c : Context P) : Round c := ⟨.entrySelection, [.routes (routeMap c)]⟩

/-- Centralized task priority. Non-user contradictions ride the next presentation as relay.
    A Horizon presentation is an everyday scenario only: conceal its edge and rationale until
    the answer. A chosen aspect remains in context and is offered at subsequent coverage. -/
def settle (c : Context P) (t : RecordId) (fallback : Gate) : Round c :=
  let relay := match (assess c t).conflict with
    | some (.target k a) => .finding k :: (a.toList.map Notice.material)
    | some (.yours k a) => [.correction k, .material a]
    | _ => []
  match userConflict c t with
  | some k => ⟨.conflict t, [.sides k, .order]⟩
  | none => match dueHorizon c t with
    | some h => ⟨.horizonProbe t h.edge, .scenario h :: relay⟩
    | none => ⟨fallback, relay⟩

def gateFor (c : Context P) (t : RecordId) : Round c :=
  let a := assess c t
  settle c t (if (a.gaps ++ reopenedGaps c t).isEmpty ∧ admissible a = none then .zeroGap t
    else if probed c t = false ∧ ¬ ∃ edge, Asked c t edge then .startAspect t
    else .coverage t)

def redirect (c : Context P) (e : EntryPoint) (basis : String) : Round c :=
  let r := match taskFor c e with
    | some t => gateFor c t.id
    | none => entryRound c
  { r with notices := .intent e basis :: r.notices }

def resumeOf : Gate → Gate
  | .horizonProbe t _ => .coverage t
  | g => g

def again (t : RecordId) (a : Aspect) : Gate :=
  match a.1 with
  | .horizon => .reveal t a.2
  | .contradiction => .resolve t
  | .expectation => .probe t ⟨.expectation, rfl⟩
  | .causality => .probe t ⟨.causality, rfl⟩
  | .scope => .probe t ⟨.scope, rfl⟩
  | .sequence => .probe t ⟨.sequence, rfl⟩
  | .emergent d => .probe t ⟨.emergent d, rfl⟩

def returning (c : Context P) (g : Gate) (outcome : String) : Round c :=
  let r := match g.task with
    | some t => settle c t (.coverage t)
    | none => entryRound c
  { r with notices := .closure outcome :: r.notices }

inductive Step (c : Context P)
  | gate (round : Round c)
  | done (closed : AllClosed c)
  | withdrawn

/-- The single source of transition policy. Only an actual latest-person choice at a closure
    gate enters completion; material-bearing correction consumes its adjudication directly.
    A question re-entered after insufficient ground stays open and explains what is missing. -/
def advance (c : Context P) (r : Reading c) : Step c :=
  match r.answer with
  | .withdraw => .withdrawn
  | .propose s => .gate ⟨resumeOf r.gate, [.proposal s]⟩
  | .other e b => .gate (redirect c e b)
  | .choose v => match r.gate, v with
    | .entrySelection, .entries _ =>
      .gate (match selectedTask c with | some t => gateFor c t.id | none => entryRound c)
    | .zeroGap _, .close | .coverage _, .close =>
      if h : AllClosed c then .done h
      else .gate (match current c with | some t => gateFor c t.id | none => ⟨r.gate, []⟩)
    | .startAspect t, .aspect g | .coverage t, .aspect g =>
      .gate (settle c t (.probe t g))
    | _, _ => .gate ⟨r.gate, []⟩
  | .steps => match r.gate with
    | .horizonProbe t e | .cue t e => .gate ⟨.cue t e, []⟩
    | _ => .gate ⟨r.gate, []⟩
  | .correct a => match r.gate with
    | .horizonProbe t edge | .cue t edge => .gate ⟨.reveal t edge, [.material a]⟩
    | .conflict t => .gate ⟨.resolve t, [.material a]⟩
    | .inquiry t g => .gate ⟨again t g, [.material a]⟩
    | _ => .gate ⟨r.gate, []⟩
  | .object reason => match r.gate with
    | .probe t g => .gate ⟨.inquiry t (g.val, ""), [.closure reason]⟩
    | .reveal t edge => .gate ⟨.inquiry t (.horizon, edge), [.closure reason]⟩
    | .resolve t => .gate ⟨.inquiry t (.contradiction, ""), [.closure reason]⟩
    | _ => .gate ⟨r.gate, []⟩
  | .met m =>
    let next := returning c r.gate "Shown against this measure; record assistance."
    .gate { next with notices := .demonstration m :: next.notices }
  | .dissolved => .gate (returning c r.gate "The user's explanation dissolved the contradiction.")
  | .accepted reason => .gate (returning c r.gate reason)
  | .reopen _ => .gate (match r.gate.task with
    | some t => gateFor c t | none => ⟨r.gate, []⟩)
  | .pending => .gate ⟨r.gate, []⟩

/-- Present the whole packet: its closure/evidence/intent relay followed by its single gate.
    At zero-gap give reasoning and Confirm/Reopen; at coverage show probed/unprobed aspects and
    sufficient/another aspect/proposal; at an ordinary probe give artifact context and a concrete
    scenario, Qc/Qs from probeKind, and free response. Inquiry hears reasoning before judgment;
    disclosure names the edge and asks for application. A closure includes task status, the
    return gate and available next moves. Conflict asks how both quoted sides fit
    before a verdict. A target finding judges a side only with settling material outside it;
    your own correction quotes the target. Relay never replaces an active gate. -/
def present (respond : (c : Context P) → Round c → Response P)
    (c : Context P) (r : Round c) : Context P :=
  c ++ [(respond c r).val]

/-- What the trace renderer receives, computed from the same context it narrates. -/
structure Trace where
  selected : List Task
  records : List (Nat × Record)
  demonstrated : List (RecordId × Aspect × Demonstration)

def traceOf (c : Context P) : Trace := ⟨tasks c, said c, shown c⟩

/-- The closure certificate applies before the trace's assistant presentation. The trace shows
    each selected task, its closure, every aspect shown with assistance, contradictions and their
    ownership/outcomes, candidate intent readings and subsequent corrections, and any dissent
    that stood before the person's closure. It certifies traversal, not omniscient comprehension. -/
structure VerifiedUnderstanding (P : Type) where
  basis : Context P
  closed : AllClosed basis
  presentation : Response P

inductive Outcome (P : Type)
  | verified (value : VerifiedUnderstanding P)
  | withdrawn (basis : Context P) (presentation : Response P)
  | holding (context : Context P)

def grasp (respond : (c : Context P) → Round c → Response P)
    (trace : Context P → Trace → Response P) :
    Context P → List (Utterance P) → Outcome P
  | c, [] => .holding c
  | c, u :: us =>
    let c' := consulted c u
    match advance c' (read c u) with
    | .done h => .verified ⟨c', h, trace c' (traceOf c')⟩
    | .withdrawn => .withdrawn c' (trace c' (traceOf c'))
    | .gate r => grasp respond trace (present respond c' r) us

def start (respond : (c : Context P) → Round c → Response P)
    (trace : Context P → Trace → Response P)
    (c : Context P) (us : List (Utterance P)) : Outcome P :=
  grasp respond trace (present respond c (entryRound c)) us

/-! ── LOOP ──
Recursion consumes only actual utterances. An unanswered gate holds. A round returns a gate,
certified completion, or withdrawal with the trace. Live priority is centralized in `settle`;
an owed cue, disclosure or reasoning question completes the current answer's handling before
returning to that priority. A task's closure respects the person's sufficient/Confirm judgment.
-/

/-! ── CONVERGENCE ──
`VerifiedUnderstanding.closed` requires a nonempty selected roster and a person's closure for
every task. The trace derives from historical readings: accepting an answer, accepting a task,
and demonstrating an aspect remain different. None substitutes for another.
-/

/-!
The transition, history, grounding and convergence laws.
theorem earlier_turns_never_reread (c t : Context P) : ∃ more, said (c ++ t) = said c ++ more

theorem responses_say_nothing (c : Context P) (r : Response P) : said (c ++ [r.val]) = said c

theorem said_by_person (c : Context P) (i : Nat) (x : Record) (h : (i, x) ∈ said c) :
    ∃ u : Utterance P, c[i]? = some u.val

theorem silence (respond : (c : Context P) → Round c → Response P)
    (trace : Context P → Trace → Response P) (c : Context P) :
    grasp respond trace c [] = .holding c

theorem user_conflict_first (c : Context P) (t : RecordId) (g : Gate)
    (k : Contradiction c) (h : userConflict c t = some k) :
    (settle c t g).gate = .conflict t

theorem horizon_preempts (c : Context P) (t : RecordId) (g : Gate)
    (hu : userConflict c t = none) (h : HorizonCandidate)
    (hd : dueHorizon c t = some h) :
    (settle c t g).gate = .horizonProbe t h.edge

theorem asked_not_due (c : Context P) (t : RecordId) (h : HorizonCandidate)
    (ha : admissible (assess c t) = some h) (hk : Asked c t h.edge) :
    dueHorizon c t = none

theorem singleton_admission (a : Assessment (P := P) c) (h : HorizonCandidate)
    (ha : admissible a = some h) : a.candidates = [h]

theorem miss_discloses_material (c : Context P) (t : RecordId) (edge : String)
    (a : Adjudication c) :
    advance c ⟨.horizonProbe t edge, .correct a⟩ = .gate ⟨.reveal t edge, [.material a]⟩

theorem conflict_resolves_material (c : Context P) (t : RecordId) (a : Adjudication c) :
    advance c ⟨.conflict t, .correct a⟩ = .gate ⟨.resolve t, [.material a]⟩

theorem inquiry_corrects_material (c : Context P) (t : RecordId) (g : Aspect)
    (a : Adjudication c) :
    advance c ⟨.inquiry t g, .correct a⟩ = .gate ⟨again t g, [.material a]⟩

theorem other_intent_redirects (c : Context P) (g : Gate) (e : EntryPoint) (basis : String) :
    advance c ⟨g, .other e basis⟩ = .gate (redirect c e basis)

theorem steps_cue (c : Context P) (t : RecordId) (edge : String) :
    advance c ⟨.horizonProbe t edge, .steps⟩ = .gate ⟨.cue t edge, []⟩

theorem proposal_recorded (c : Context P) (g : Gate) (s : String) :
    advance c ⟨g, .propose s⟩ = .gate ⟨resumeOf g, [.proposal s]⟩

theorem no_verdict_without_measure (c : Context P) (g : Gate) (why : String) :
    advance c ⟨g, .accepted why⟩ = .gate (returning c g why)

theorem no_adjudication_at_probe (c : Context P) (t : RecordId) (g : Selectable)
    (a : Adjudication c) :
    advance c ⟨.probe t g, .correct a⟩ = .gate ⟨.probe t g, []⟩

theorem completed_persists (c more : Context P) (t : RecordId) (h : completed c t) :
    completed (c ++ more) t

theorem tasks_persist (c more : Context P) : ∃ ts, tasks (c ++ more) = tasks c ++ ts

theorem certified_nonempty (v : VerifiedUnderstanding P) : tasks v.basis ≠ []

theorem certified_all_closed (v : VerifiedUnderstanding P) :
    ∀ t ∈ tasks v.basis, completed v.basis t.id

theorem completed_by_person (c : Context P) (t : RecordId) (h : completed c t) :
    ∃ i r, ∃ u : Utterance P, c[i]? = some u.val ∧ (i, r) ∈ said c ∧
      r.gate.task = some t ∧ r.act = .close

theorem advance_done_closed (c : Context P) (r : Reading c) (h : AllClosed c)
    (hd : advance c r = .done h) : (recorded r).act = .close

theorem advance_withdrawn (c : Context P) (r : Reading c)
    (h : advance c r = .withdrawn) : r.answer = .withdraw

theorem verified_by_person (respond : (c : Context P) → Round c → Response P)
    (trace : Context P → Trace → Response P) (c : Context P) (us : List (Utterance P))
    (v : VerifiedUnderstanding P) (hv : grasp respond trace c us = .verified v) :
    ∃ (c₀ : Context P) (u : Utterance P), v.basis = consulted c₀ u ∧
      (recorded (read c₀ u)).act = .close ∧ AllClosed v.basis

theorem withdrawn_by_person (respond : (c : Context P) → Round c → Response P)
    (trace : Context P → Trace → Response P) (c : Context P) (us : List (Utterance P))
    (basis : Context P) (presentation : Response P)
    (hw : grasp respond trace c us = .withdrawn basis presentation) :
    ∃ (c₀ : Context P) (u : Utterance P), basis = consulted c₀ u ∧ (read c₀ u).answer = .withdraw

theorem selection_never_horizon (g : Selectable) : g.val ≠ .horizon

theorem selection_never_conflict (g : Selectable) : g.val ≠ .contradiction

theorem close_at_closing_gate (c : Context P) (r : Reading c)
    (h : (recorded r).act = .close) : r.gate.closable = true ∧ r.answer = .choose .close

theorem shown_requires_measure (c : Context P) (r : Reading c)
    (h : (recorded r).act = .met) : ∃ m, r.answer = .met m

theorem disclosure_stays_assisted (c : Context P) (t : RecordId) (g : Aspect)
    (h : (said c).any (fun (_, r) => r.gate.task == some t && r.gate.aspect == some g &&
      match r.act with | .correct => true | _ => false) = true) :
    assistance c t g = .afterDisclosure

theorem other_intent_no_disclosure (c : Context P) (e : EntryPoint) (basis : String)
    (t : RecordId) (edge : String) :
    (redirect c e basis).gate ≠ .reveal t edge ∧ (redirect c e basis).gate ≠ .resolve t
-/

/-! ── TOOL GROUNDING ── -/
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
inductive Annot | sense | observe | track | constitution | extension
inductive Op | route | read | assess | record | present | material | converge | seam

def grounding : Op → Annot × String
  | .route => (.observe, "Read target if needed, then routeMap: silent intent-scented orientation and route adequacy")
  | .read => (.observe, "consult: read any source the answer cites, now; then read the whole answer once against that context")
  | .assess => (.sense, "Assess the fused context afresh, under Assessment")
  | .record => (.track, "Context records selections, answers and presentations; said projects their history")
  | .present => (.constitution, "present the Round under present's contract, then Stop")
  | .material => (.sense, "Quote in place the Measure carried by the adjudication, at the narrowest span")
  | .converge => (.extension, "TextPresent+Proceed: show the completed or withdrawn trace under VerifiedUnderstanding")
  | .seam => (.extension, "Proceed to a next protocol only on a user-declared chain, citing that declaration; this contract declares no wired outbound edge")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
-/

end
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

Apply `read` and `advance` for answer handling, `settle` for priority, and `present` for the round's obligations. Scope a correction to the part the material actually settles, preserving what the answer already got right.

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
- **Round composition**: Compose each round so the reader can act without reassembly — use everyday language, keep each judgment beside its evidence and next-move implication (your own adjudication included, its evidence being the excerpt attached with it), and place analytical context before its gate.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
- **Contract execution**: Read each utterance under `read`; apply `advance`, with task priority from `settle`. Present the entire `Round` under `present`, and the terminal trace under `VerifiedUnderstanding`. These definitions carry the intent correction, ownership, grounding, closure, and continuation obligations.
- **Horizon calibration**: Demote or revise the instrumentation after repeated applicable opportunities if detections remain absent, speculative, or unhelpful.
