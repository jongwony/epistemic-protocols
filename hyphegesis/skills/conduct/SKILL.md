---
name: conduct
description: "Conduct method before object-level work. Fires when the work needs several moves in non-trivial order. Type: (MethodUnderdetermined, Hybrid, CONDUCT, WorkProspect × MoveGround) → ConductedMethod"
---

# Hyphegesis Protocol

Conduct how a session's epistemic work will be carried out — the order, independence, reconciliation, termination, and routing of its cognitive moves — when that method is underdetermined before object-level cognition begins. The morphism is **design THEN hand off**: Hyphegesis designs a conduct topology over the moves it identifies and emits a method plan with in-session checkpoints, then stops; the substrate executes the moves. Type: `(MethodUnderdetermined, Hybrid, CONDUCT, WorkProspect × MoveGround) → ConductedMethod`.

## Definition

**Hyphegesis** (ὑφήγησις: a leading-the-way, guiding from just ahead): A dialogical act of conducting a session's epistemic work — deciding how its multiple cognitive moves relate in order, independence, reconciliation, termination, and routing — when the method is underdetermined while the goal is clear. The protocol's lexical verb is `/conduct`. It activates only when the work needs two or more moves whose conduct is non-trivial (single-move work relays to that one protocol), designs the conduct topology draft-first — filling every axis·region with a reasoned value shown beside the alternatives it displaces, and proposing the region cut itself with what it read to cut that way and the standing affordance to replace it, then opening a value gate only where the user points — and registers an in-session checkpoint when a constitutive decision's evidence does not yet exist (synthesis output shape generally; cell membership in the decompose-recovery instance), surfaces substrate feasibility as a handoff annotation, compiles a decision-typed Recognition brief into every checkpoint, assembles a cross-cutting trace contract (its disclosure overlay over the five axes — residuals, degradations, coverage caps, never silent), and hands off a method plan that the substrate — not Hyphegesis — executes.

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
Hyphegesis(WP) → conduct(c, utterances), where c is the fused session context:
  Phase 0: groundPointer(c) → [the pointer does not resolve, or the method needs a premise its
    record does not support: relay(handoff unreadable) → report]
    → brief(c) → guard(relay test, anti-self-application) → [not warranted: relay-route — the
    single protocol, or the brief's evident method, as a recommendation → report] → Qc → Stop
  Phase 1: MoveId → Sc → Stop
  Phase 2: draft the whole topology — a proposed cut, and every axis·region over it with its
    value, its ground, the other values by name, and the differential where the plan turns →
    DraftSurface → DraftGate → Stop; a slot the person points at → AxisGate → Stop
  next utterance u: c' := fuse(c, u) →
    no brief accepted yet: an amended prospect re-grounds the pointer and the warrant → the relays
      above, or Qc again
    no move set confirmed yet: Sc again
    the confirmed move set has fewer than two moves → the relay terminal → report
    verdict(c') = sufficient ∧ no slot changed since the presentation it answered → Phase 3:
      observe the inventory → feasibility per region → the conduct trace → handoff →
      ConductedMethod
    otherwise → the next presentation from c': the DraftSurface re-drafted around every value
      the person set, or the next AxisGate they opened
  no utterance: the gate holds; nothing is accepted, confirmed, or taken
-/

/-! ── MORPHISM ──
WorkProspect × MoveGround
  → brief(method, conduction_warrant)         -- infer the work prospect's method-brief; judge whether conduction is warranted
  → guard(relay_test, anti_self_application)  -- single-move work relays to that one protocol as a recommendation; Hyphegesis does not conduct Hyphegesis
  → identify(moves)                           -- candidate cognitive moves read off the move ground, presented for Recognition (`Recognition over Recall`)
  → select(moves)                             -- the person confirms the move set; a later utterance may revise it
  → draft(conduct_topology)                   -- fill every axis·region with a reasoned value shown beside the alternatives it displaces, and propose the region cut with what was read to cut that way and the affordance to replace it; the whole method is legible before any of it is answered
  → design(conduct_topology)                  -- the person points at the slots the draft got wrong; each pointed-at slot opens its own gate, highest-leverage first; every value the person sets is theirs, and the draft re-fills around it
  → assign(moves, topology) → move_assignment  -- place every selected move into a region of the resolved topology and into its slot under that topology's order
  → annotate(substrate_feasibility)           -- per region, realizability read from an observation of the loaded inventory, surfaced as a handoff annotation; a value the person took stays as taken
  → carry(work_pointer)                       -- carry the navigation block the work arrived under onto the emitted method, whole and unchanged
  → compile(checkpoint_briefs)                -- for every deferred decision, compile the decision-typed Recognition presentation contract the substrate executes there (structure, not content)
  → contract(trace_disclosure)                -- residuals + degradations + coverage caps + termination grounds; surfaced, never silent
  → handoff(conducted_method)                 -- emit the method plan + in-session checkpoints, then stop (substrate executes)
  → ConductedMethod
requires: method_underdetermined(WP)           -- runtime checkpoint (Phase 0)
deficit:  MethodUnderdetermined                -- activation precondition (Layer 1/2)
preserves: WP                                  -- the context only grows; the prospect is never rewritten
invariant: Conduction over Substrate
-/

namespace Hyphegesis


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

/-- `WP`, `WorkProspect`: the work or goal facing object-level cognition, its method not yet
    determined. Read from the context; an amendment the person makes at Qc is part of it. -/
abbrev WorkProspect (P : Type) := Context P

/-- `MethodBrief`: `span` runs from this invocation to the next planned `/compact` or `/clear`; a
    stop instruction bounds the current run without shortening it. -/
structure MethodBrief where
  workIntent      : String
  expectedHandoff : String
  span            : String
  deriving Inhabited  -- elab: lets `brief` be declared `opaque`

/-- **Your reading** of the prospect's method brief, from the whole context. -/
opaque brief : Context P → MethodBrief

/-- **Your judgment** (the relay test): conduction is warranted — two or more moves, and a real
    fork in their order, independence, reconciliation, termination, or routing. Single-move work
    and a self-evident method are not; scale and budget alone never are, and Hyphegesis never
    conducts itself. -/
opaque Warranted : Context P → Prop

structure HandoffLocator where
  record  : String
  session : String

/-- `N`, `NavigationBlock`: the fixed cross-session shape — a pointer, never a copied record. -/
structure NavigationBlock where
  purposeFrame           : String
  canonicalLocator       : HandoffLocator
  dereferenceInstruction : String
  snapshotAnchor         : Option String
  groundingInstruction   : String

/-- **Your reading**: the navigation block the context supplies over the record the work was
    parked in, a sibling protocol's emitted block included; `none` otherwise. It is carried
    unchanged, and nothing it names is copied into this protocol's output. -/
opaque pointer : Context P → Option NavigationBlock

/-- **Your reading** at Phase 0: follow the block's dereference instruction at its locator and
    run its grounding instruction; what the record returns enters the context as observation.
    Nothing when there is no pointer. -/
opaque groundPointer : Context P → List (Evidence P)

def bindPointer (c : Context P) : Context P := c ++ (groundPointer c).map (·.val)

/-- **Your judgment**: the pointer is unreachable or missing half its locator, or the method
    would need a premise its record does not support. An unresolved downstream item the method
    can leave open is not this: it is preserved and the design continues. False without a
    pointer. -/
opaque PointerUnreadable : Context P → Prop

/-- **Your judgment**: the cited utterance accepts the brief and warrant as presented at Qc. -/
opaque BriefAccepted : Context P → Turn P → Unit → Prop

def briefCoord : Coord P Unit := { admits := (· = .utterance), supports := BriefAccepted }

-- elab: an open witness lets the occupancy readings below be declared `opaque`.
instance {A : Type} {q : Coord P A} {c : Context P} : Inhabited (Occ q c) := ⟨.open_ none⟩

/-- **Your judgment**: the person accepted the brief now standing; an amendment opens it again
    over the corrected prospect. -/
opaque accepted : (c : Context P) → Occ (briefCoord (P := P)) c

def isFilled {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Bool
  | .open_ _   => false
  | .filled .. => true

def filledValue {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Option A
  | .open_ _     => none
  | .filled a .. => some a

inductive MoveStep
  | protocol (name : String)
  | analysis (name : String)
  | delegation (name : String)
  deriving DecidableEq

/-- `CognitiveMove`. -/
structure Move where
  step : MoveStep
  deriving DecidableEq

/-- `MS`. -/
abbrev MoveSet := List Move

/-- **Your reading** of the move ground — the context, each available protocol's own deficit and
    resolution, and the analysis passes and delegations the session affords: the candidate moves,
    presented at Sc for recognition. It settles nothing. -/
opaque candidates : Context P → MoveSet

/-- **Your judgment**: the cited utterance confirms or revises the move set to `ms`. -/
opaque MovesSupported : Context P → Turn P → MoveSet → Prop

/-- The move set is the person's: only their statement fills it. -/
def moveSetCoord : Coord P MoveSet := { admits := (· = .utterance), supports := MovesSupported }

/-- **Your judgment**: the move set the person's latest utterance confirmed or revised — at Sc,
    or later at any gate; open before Sc is answered. -/
opaque moveSet : (c : Context P) → Occ (moveSetCoord (P := P)) c

def moves (c : Context P) : MoveSet := (filledValue (moveSet c)).getD []

inductive Axis | order | independence | reconciliation | termination | routing

/-- The classes every downstream obligation dispatches on, never a value's name. -/
inductive ObligationClass | relaxesIsolation | needsStopGround | crossesSpan
  deriving DecidableEq

/-- A locator naming where the referenced content is recorded; the substrate dereferences it. -/
structure Reference where
  cites : String

/-- `Emergent(a)`: a value the presented set did not name, constituted at a gate — the person's
    affordance, since whoever presents cannot name it. It declares the obligation classes it
    falls under, and one declaring `needsStopGround` carries its stop reference. -/
structure Emergent where
  name    : String
  classes : List ObligationClass
  stopRef : Option Reference
  owed    : ObligationClass.needsStopGround ∈ classes → stopRef.isSome = true

def Emergent.declares (e : Emergent) (k : ObligationClass) : Bool := e.classes.contains k

/-- What makes "goal met" determinate: a condition the context makes available at the region,
    an assigned protocol's own convergence contract, or the party that owes the definition — an
    assigned move's protocol, `/apportion` for a delegation move, or the person at execution. -/
inductive GoalGround
  | protocolContract (r : Reference)
  | statedCondition (r : Reference)
  | resolutionRequired (resolver : String)

inductive Order | sequentialChain | parallelFan | dependencyDag | emergent (e : Emergent)

inductive Independence | isolated | shared | emergent (e : Emergent)

/-- `op`: extensible at operator level. -/
inductive ComposeOp | seq | par

/-- `RVᵣ`: a named value, an emergent one, or a composite whose operands are themselves resolved
    reconciliation values. -/
inductive Reconciliation
  | aggregate | dialectic | adversarialRefute | synthesis
  | emergent (e : Emergent)
  | compose (left right : Reconciliation) (op : ComposeOp)

/-- Every member that takes a stop parameter carries it inside the value. -/
inductive Termination
  | singlePass
  | boundedRounds (n : Nat)
  | untilDryCeiling (k : Nat)
  | untilGoalMet (g : GoalGround)
  | emergent (e : Emergent)

/-- `handoffToProtocol` carries the protocol it routes to; `handoffToSpan` sends the output across
    the span wall to a future span that does not share this session's context. -/
inductive Routing
  | returnToUser | chainToNext | handoffToProtocol (target : String) | deepenOnFinding
  | handoffToSpan
  | emergent (e : Emergent)

/-- `MoveRegion`: moves sharing one conduct treatment; its identity is its name. -/
structure Region where
  name    : String
  members : List Move
  deriving DecidableEq

/-- A cut partitions the move set: every move in exactly one region, and no region empty. -/
def IsPartition (ms : MoveSet) (rs : List Region) : Prop :=
  (∀ m ∈ ms, ∃ r ∈ rs, m ∈ r.members) ∧
  (∀ r ∈ rs, r.members ≠ [] ∧ ∀ m ∈ r.members, m ∈ ms) ∧
  (∀ r ∈ rs, ∀ r' ∈ rs, ∀ m, m ∈ r.members → m ∈ r'.members → r = r')

/-- **Your reading**: the cut now in force over `ms` — the one the person's latest utterance
    supplied where it partitions the move set, your proposal otherwise, citing the
    non-uniformity you read to cut that way. A supplied cut that does not partition the move set
    is answered with why, and the proposal stands; rejecting a cut never requires the person to
    author its replacement. -/
opaque cut : Context P → MoveSet → List Region

inductive EdgeAxis | independence | reconciliation | termination | routing

def EdgeAxis.all : List EdgeAxis := [.independence, .reconciliation, .termination, .routing]

/-- One place a conduct value goes. `order` resolves once, over the whole move set, however fine
    the cut; the other four axes resolve per region. -/
inductive Slot
  | order
  | edge (a : EdgeAxis) (r : Region)

def SlotVal : Slot → Type
  | .order                  => Order
  | .edge .independence _   => Independence
  | .edge .reconciliation _ => Reconciliation
  | .edge .termination _    => Termination
  | .edge .routing _        => Routing

def slotsOf (rs : List Region) : List Slot :=
  .order :: rs.flatMap (fun r => EdgeAxis.all.map (fun a => Slot.edge a r))

/-- `default(a)`: the value a slot carries when nothing preferred any value. -/
def defaultValue : (s : Slot) → SlotVal s
  | .order                  => Order.sequentialChain
  | .edge .independence _   => Independence.isolated
  | .edge .reconciliation _ => Reconciliation.synthesis
  | .edge .termination _    => Termination.singlePass
  | .edge .routing _        => Routing.returnToUser

/-- A draft slot: the value; the ground that picked it over the others, cited to what it read — the
    brief, the move set, a value the person set, a cut just revised, or the value the person set
    on a region the cut replaced, named with that region; and, for the alternatives that most
    change the plan, what changes if the slot goes that way. `ground = none`: nothing preferred
    any value, and the slot holds `defaultValue`. -/
structure DraftSlot (s : Slot) where
  value        : SlotVal s
  ground       : Option String
  differential : List (String × String)

-- elab: a witness lets `draft` be declared `opaque`; it adds no meaning.
instance {s : Slot} : Inhabited (DraftSlot s) := ⟨⟨defaultValue s, none, []⟩⟩

/-- **Your draft**: every slot over the cut now in force, filled before anything is asked, from
    the whole context — the brief, the move set, every value the person set, and everything else
    it holds. A value the person set on a region the cut replaced is carried here as a candidate
    naming that region, never as their setting; where several such values land on one slot, the
    ground names every one with its region. -/
opaque draft : Context P → (s : Slot) → DraftSlot s

/-- **Your judgment**: the cited utterance sets `v` on slot `s` — a named value selected, a
    composite composed, or a value no presented set named, with the classes it declares. -/
opaque SlotSupported : (s : Slot) → Context P → Turn P → SlotVal s → Prop

/-- A slot value is the person's only through their statement at a gate. -/
def slotCoord (s : Slot) : Coord P (SlotVal s) :=
  { admits := (· = .utterance), supports := SlotSupported s }

/-- **Your judgment**: the value the person's latest utterance set on `s`, under the cut now in
    force. Open where they never set one, where they re-opened it to the draft, and where the
    region it was set on is one the cut has replaced. -/
opaque slot : (c : Context P) → (s : Slot) → Occ (slotCoord (P := P) s) c

/-- `FinalizeTopology`, one slot: the person's value where they set one, the draft's otherwise. -/
def take (c : Context P) (s : Slot) : SlotVal s :=
  match filledValue (slot c s) with
  | some v => v
  | none   => (draft c s).value

/-- What the fused context says the person did at a gate. Premise: one utterance carries one
    disposition; silence is none of them. -/
inductive Verdict
  /-- anything that is not taking the method: an amendment, a confirmation, slots named to open,
      a value selected or composed, a slot re-opened, a cut supplied or rejected, or any other
      reading -/
  | cont
  /-- take the method as the latest presentation showed it -/
  | sufficient
  deriving Inhabited  -- elab: lets `verdict` be declared `opaque`

/-- **Your judgment** on the whole latest utterance read with the context. -/
opaque verdict : Context P → Verdict

/-- **Your judgment**: a slot's value changed since the presentation the latest utterance
    answered — the same utterance set or re-opened one. `sufficient` takes only what was shown. -/
opaque Unshown : Context P → Prop

/-- **Your record**: the contrary grounds you presented before the gate the closing utterance
    answered — a slot you would set otherwise, a cut you doubt, a region you expect the inventory
    cannot realize — attached to the method; empty when there were none. -/
opaque dissent : Context P → List String

/-- Where the run stands, read from the context. -/
inductive Stage | brief | moves | tooFew | design

def stage (c : Context P) : Stage :=
  if isFilled (accepted c) then
    match filledValue (moveSet c) with
    | none    => .moves
    | some ms => if ms.length < 2 then .tooFew else .design
  else .brief

/-- **Your judgment**: the observation cited shows whether the inventory can realize `r`'s
    resolved values. -/
opaque FeasibilitySupported : Region → Context P → Turn P → Bool → Prop

/-- Realizability is read from an observation of the loaded inventory — its agents, skills, MCP
    servers, and the tools each exposes. Text injected into the session, the system prompt among
    it, grounds no verdict. -/
def feasibilityCoord (r : Region) : Coord P Bool :=
  { admits := (· = .observation), supports := FeasibilitySupported r }

/-- **Your reading** for `r`: filled with whether the inventory realizes `r`'s resolved values,
    citing the observation; open where nothing observed it, and the trace says so. A region
    whose routing crosses the span wall needs a durable record surface its output can be
    externalized to. -/
opaque feasibility : (c : Context P) → (r : Region) → Occ (feasibilityCoord (P := P) r) c

/-- **Your observation** at Phase 3: the session's actually loaded inventory, read for the
    resolved topology — the inventory is the authority, never a fixed list. -/
opaque inventory : Context P → List (Evidence P)

def handoffContext (c : Context P) : Context P := c ++ (inventory c).map (·.val)

/-- **Your reading**: the durable record surface the observed inventory offers a region whose
    output crosses the span wall; `none` where none was observed. -/
opaque recordSurface : Context P → Region → Option String

/-- **Your placement**: the move's slot in the sequence the resolved order gives. -/
opaque position : Context P → Move → Nat

structure Placement where
  move     : Move
  position : Nat
  region   : Option Region

def regionOf (rs : List Region) (m : Move) : Option Region :=
  rs.find? (fun r => r.members.contains m)

def assignment (c : Context P) (ms : MoveSet) (rs : List Region) : List Placement :=
  ms.map (fun m => ⟨m, position c m, regionOf rs m⟩)

def relaxes : Independence → Bool
  | .shared     => true
  | .emergent e => e.declares .relaxesIsolation
  | _           => false

def containsSynthesis : Reconciliation → Bool
  | .synthesis      => true
  | .compose l r _  => containsSynthesis l || containsSynthesis r
  | _               => false

def crossesSpan : Routing → Bool
  | .handoffToSpan => true
  | .emergent e    => e.declares .crossesSpan
  | _              => false

def returnsOrCrosses : Routing → Bool
  | .returnToUser => true
  | r             => crossesSpan r

/-- The region's four resolved values, as the trace shows them. -/
def regionValues (c : Context P) (r : Region) : List ((s : Slot) × SlotVal s) :=
  EdgeAxis.all.map (fun a => ⟨.edge a r, take c (.edge a r)⟩)

inductive DegradationKind | independenceRelaxed | substrateInfeasible

/-- A surfaced acknowledgment that a resolved value relaxes an epistemic guarantee or cannot be
    realized. The value stays as taken. -/
structure Degradation where
  region   : Region
  kind     : DegradationKind
  resolved : List ((s : Slot) × SlotVal s)

def degradations (c c₁ : Context P) (rs : List Region) : List Degradation :=
  (rs.filter (fun r => relaxes (take c (.edge .independence r)))).map
      (fun r => ⟨r, .independenceRelaxed, [⟨.edge .independence r, take c (.edge .independence r)⟩]⟩) ++
    (rs.filter (fun r => filledValue (feasibility c₁ r) == some false)).map
      (fun r => ⟨r, .substrateInfeasible, regionValues c r⟩)

/-- `TerminationGround`, read off the termination value in every case. -/
inductive TerminationGround
  | roundBound (n : Nat)
  | dryCeiling (k : Nat)
  | goal (g : GoalGround)
  | emergentStop (ref : Reference)

def groundOf : Termination → Option TerminationGround
  | .singlePass        => none
  | .boundedRounds n   => some (.roundBound n)
  | .untilDryCeiling k => some (.dryCeiling k)
  | .untilGoalMet g    => some (.goal g)
  | .emergent e        => e.stopRef.map .emergentStop

def terminationGrounds (c : Context P) (rs : List Region) : List (Region × TerminationGround) :=
  rs.filterMap (fun r => (groundOf (take c (.edge .termination r))).map (r, ·))

inductive CoverageBound | topN | noRetry | sampling | emergent (name : String)

/-- What the method does not cover; `dropped` names the uncovered extent in prose. -/
structure CoverageLimit where
  region  : Region
  bound   : CoverageBound
  dropped : String

/-- **Your reading** of the caps the resolved topology imposes: `singlePass` → `noRetry`, a
    bounded or dry-ceiling termination → `topN`, an intra-region sampling → `sampling`, any
    other cap → `emergent`. -/
opaque coverageLimits : Context P → List CoverageLimit

/-- A slot the person did not set: `ground` is the draft's reason for the value taken, or `none`
    where nothing grounded one and it carries `defaultValue`. The trace keeps the two apart. -/
structure Residual where
  slot   : Slot
  ground : Option String

def residuals (c : Context P) (rs : List Region) : List Residual :=
  (slotsOf rs).filterMap (fun s => if isFilled (slot c s) then none else some ⟨s, (draft c s).ground⟩)

/-- The method's cross-cutting disclosure overlay; surfaced, never silent. -/
structure TraceContract where
  residuals          : List Residual
  degradations       : List Degradation
  coverageLimits     : List CoverageLimit
  terminationGrounds : List (Region × TerminationGround)

/-- A decision whose deciding evidence exists only at the checkpoint. -/
inductive DeferredDecision | synthesisOutputShape | emergent (name : String)

/-- `Slot(T)`: a typed placeholder compiled at design time and filled by the substrate at
    execution. -/
structure Placeholder where
  fills : String

/-- A limit category the assigned move's protocol contracts to report, filled or declined. -/
structure GapSlot where
  category : String
  content  : Placeholder

/-- The Recognition presentation contract for `synthesisOutputShape`: when both candidate sets
    are live, the output shape resolves first and the fusion candidates are expressed in it. -/
structure SynthesisBrief where
  findingsRef           : List (Move × Placeholder)
  convergences          : Placeholder
  divergences           : Placeholder
  decisionAxes          : Placeholder
  privateGapSlots       : List GapSlot
  fusionCandidates      : Placeholder
  outputShapeCandidates : Placeholder

inductive CheckpointBrief
  | synthesis (b : SynthesisBrief)
  | emergent (name : String)

-- elab: a witness lets `compileBrief` be declared `opaque`; it adds no meaning.
instance : Inhabited CheckpointBrief := ⟨.emergent ""⟩

structure Checkpoint where
  region   : Region
  decision : DeferredDecision
  brief    : CheckpointBrief

/-- A region owes the synthesis checkpoint when its reconciliation contains `synthesis` and its
    output returns to the person or crosses the span wall. -/
def owesSynthesis (c : Context P) (r : Region) : Bool :=
  containsSynthesis (take c (.edge .reconciliation r)) && returnsOrCrosses (take c (.edge .routing r))

/-- **Your reading**: the non-axis decisions for `r` whose deciding evidence does not exist at
    design time and does at the checkpoint — `synthesisOutputShape` whenever `owesSynthesis`,
    the cell membership of the decompose-recovery instance among the emergent ones. -/
opaque deferred : Context P → Region → List DeferredDecision

/-- **Your compilation** of the brief the decision calls for, from the current topology and move
    set: structure, never a copy of execution content. -/
opaque compileBrief : Context P → Region → DeferredDecision → CheckpointBrief

/-- **Your ordering**: topology order between regions, registration order breaking ties. -/
opaque orderCheckpoints : Context P → List Checkpoint → List Checkpoint

def checkpoints (c : Context P) (rs : List Region) : List Checkpoint :=
  orderCheckpoints c (rs.flatMap (fun r => (deferred c r).map (fun d => ⟨r, d, compileBrief c r d⟩)))

/-- The externalization obligation a region crossing the span wall declares: the substrate
    writes its output to a record and gives that record's navigation block. -/
structure SpanExternalization where
  region        : Region
  recordSurface : Option String

def spanAnnotations (c : Context P) (rs : List Region) : List SpanExternalization :=
  (rs.filter (fun r => crossesSpan (take c (.edge .routing r)))).map (fun r => ⟨r, recordSurface c r⟩)

/-- `ConductedMethod`: the plan handed off; the substrate executes it. -/
structure ConductedMethod (P : Type) where
  context     : Context P
  topology    : (s : Slot) → SlotVal s
  regions     : List Region
  assignment  : List Placement
  checkpoints : List Checkpoint
  feasibility : (r : Region) → Occ (feasibilityCoord (P := P) r) context
  spans       : List SpanExternalization
  trace       : TraceContract
  pointer     : Option NavigationBlock
  dissent     : List String

/-- The method the person took: every slot as the presentation they answered showed it, and
    Phase 3's readings beside it. -/
def method (c : Context P) : ConductedMethod P :=
  let ms := moves c
  let rs := cut c ms
  let c₁ := handoffContext c
  { context     := c₁
    topology    := take c
    regions     := rs
    assignment  := assignment c ms rs
    checkpoints := checkpoints c rs
    feasibility := feasibility c₁
    spans       := spanAnnotations c rs
    trace       := { residuals := residuals c rs
                     degradations := degradations c c₁ rs
                     coverageLimits := coverageLimits c
                     terminationGrounds := terminationGrounds c rs }
    pointer     := pointer c
    dissent     := dissent c }

/-- Why the run ends without a method. -/
inductive RelayKind
  /-- the pointer did not resolve, or the method needs a premise its record does not support -/
  | handoffUnreadable
  /-- your relay test: single-move work routes to that protocol, a self-evident method is
      stated through the protocols it runs; either as a recommendation -/
  | notWarranted
  /-- the move set the person confirmed has one move, routed to as a recommendation, or none -/
  | tooFewMoves

inductive Outcome (P : Type)
  | relayed   (kind : RelayKind) (c : Context P)
  | conducted (m : ConductedMethod P)
  | holding   (c : Context P)

/-! ── WP-BINDING ──
bind(WP) = explicit_arg ∪ colocated_expr ∪ prev_user_turn ∪ ai_identified_prospect
Priority: explicit_arg > colocated_expr > prev_user_turn > ai_identified_prospect
  /conduct "text"              → WP = "text"
  /conduct (alone)             → WP = the work prospect under discussion
  "how should I approach..."   → WP = the work named before the trigger
  AI-detected trigger          → WP = the multi-move prospect AI identified (Hybrid: the person
                                 confirms at Qc)
`pointer` is read alongside WP: a navigation block the context holds, a sibling protocol's
emitted block included. A prospect is what someone states; a pointer is what the session holds.
-/

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
A step is one arm of a structural recursion over the person's utterances. `respond` is the next
presentation: Qc with the brief and its warrant; Sc with the candidate moves; the DraftSurface
of the whole current topology over a cut that `IsPartition` the move set, followed by the
DraftGate; or the AxisGate of the next slot the person opened, most-constrained first. Phase 0 grounds the pointer (`.groundPointer`) and reads
the brief (`.brief`) at activation and again after each utterance while no brief is accepted.
Phase 3 observes the inventory (`.inventory`) into the context that `method` reads, surfaces the
conduct trace, and hands the method off (`.handoff`).
-/

open Classical in
noncomputable def relayAt (c : Context P) : Option RelayKind :=
  if PointerUnreadable c then some .handoffUnreadable
  else if Warranted c then none
  else some .notWarranted

open Classical in
noncomputable def conduct (respond : Context P → Response P) :
    Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let c' := fuse c u
    match stage c' with
    | .brief =>
      let c₁ := bindPointer c'
      match relayAt c₁ with
      | some k => .relayed k c₁
      | none   => conduct respond (c₁ ++ [(respond c₁).val]) us
    | .moves  => conduct respond (c' ++ [(respond c').val]) us
    | .tooFew => .relayed .tooFewMoves c'
    | .design =>
      if verdict c' = .sufficient ∧ ¬ Unshown c' then .conducted (method c')
      else conduct respond (c' ++ [(respond c').val]) us

noncomputable def start (respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  let c₁ := bindPointer c
  match relayAt c₁ with
  | some k => .relayed k c₁
  | none   => conduct respond (c₁ ++ [(respond c₁).val]) us

/-! ── LOOP ──
Each presentation re-reads the whole context. The DraftSurface shows the method whole — the
proposed cut with what was read to cut that way and the affordance to replace it; each slot the
person set, marked as theirs and not re-offered; every other slot with its draft value, its
ground, the other values of its axis by name, the affordance to propose a value no list names
(and, on reconciliation, to compose two), and the differential for the alternative that most
changes the plan — then asks only which slots are wrong. Pointed-at slots open one AxisGate
each, most-constrained first; a gate after the first says its basis predates what an earlier gate
of the same round set. A cut supplied or rejected ends the round alone, since every other
pointed-at slot names a region about to be replaced; the values the person set on replaced
regions come back as the draft's candidates, never as settled. No round cap: a round that
re-opens a slot is dialogue, and the person ends it with `sufficient`. A decision whose evidence
does not exist at design time is never drafted as an axis value; it registers as a checkpoint.
After handoff, the substrate conducts to the last checkpoint and executes; a checkpoint may
re-open Constitution mid-execution. The span ends at the next planned `/compact` or `/clear`,
which the person types.
-/

/-!
Silence accepts, confirms, and takes nothing.
theorem silence (respond : Context P → Response P) (c : Context P) :
    conduct respond c [] = .holding c

A method is handed off only on the person's `sufficient`, answering a presentation that showed
every value it takes.
theorem conducted_by_person (respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (m : ConductedMethod P)
    (h : conduct respond c us = .conducted m) :
    ∃ (c₀ : Context P) (u : Utterance P), stage (fuse c₀ u) = .design ∧
      verdict (fuse c₀ u) = .sufficient ∧ ¬ Unshown (fuse c₀ u) ∧ m = method (fuse c₀ u)

A `sufficient` riding an utterance that also changed a slot presents the method again.
theorem exit_only_shown (respond : Context P → Response P) (c : Context P) (u : Utterance P)
    (us : List (Utterance P)) (hs : stage (fuse c u) = .design) (hn : Unshown (fuse c u)) :
    conduct respond c (u :: us) = conduct respond (fuse c u ++ [(respond (fuse c u)).val]) us
-/

/-! ── CONVERGENCE ──
conducted(WP): the method handed off on the person's `sufficient`, after the conduct trace
reached them. Convergence evidence, before the dispatch: for each move, its region and its slot
under the resolved order; for each slot, either (slot → the value the person set), (slot → the
draft's value → its ground), or (slot → `defaultValue` → nothing grounded a preference) — three
different facts, never flattened; the feasibility of every region, an unobserved one said to be
unobserved; the span annotations, an empty set shown as empty; every checkpoint with its
compiled brief; and the trace contract — every residual, degradation, coverage cap, and
termination ground, a `resolutionRequired` ground shown with its resolver and marked unroutable
where that resolver cannot reach the region before its stop is wanted, the basis shown with it.
The dissent attached to the method is shown beside it. Any tally is read off the rows shown.
Demonstrated, not asserted.
-/

/-!
Every value the person set is the method's value; nothing Phase 3 reads replaces it.
theorem person_value_taken (c : Context P) (s : Slot) (v : SlotVal s)
    (h : filledValue (slot c s) = some v) : (method c).topology s = v

An emergent termination value declaring `needsStopGround` never leaves its region's ground silent.
theorem emergent_stop_never_silent (e : Emergent)
    (h : ObligationClass.needsStopGround ∈ e.classes) :
    (groundOf (.emergent e)).isSome = true

The pointer travels onto the method unchanged.
theorem pointer_carried (c : Context P) : (method c).pointer = pointer c

The brief's acceptance, the move set, and every slot value are each filled only by a person's
statement; a realizability verdict only by an observation.
theorem accepted_by_utterance {c : Context P} {s : Cite c}
    (ok : (briefCoord (P := P)).admits s.kind) : s.kind = .utterance

theorem moves_by_utterance {c : Context P} {s : Cite c}
    (ok : (moveSetCoord (P := P)).admits s.kind) : s.kind = .utterance

theorem slot_by_utterance {c : Context P} {x : Slot} {s : Cite c}
    (ok : (slotCoord (P := P) x).admits s.kind) : s.kind = .utterance

theorem feasibility_by_observation {c : Context P} {r : Region} {s : Cite c}
    (ok : (feasibilityCoord (P := P) r).admits s.kind) : s.kind = .observation

Text injected into the session grounds nothing, the system prompt included.
theorem injected_grounds_nothing (e : Turn P) (h : e.origin = .injected) : e.basis = none
-/

/-! ── TOOL GROUNDING ── -/
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed

inductive Annot | sense | observe | track | transform | dispatch | constitution | extension

inductive Op | groundPointer | unreadableRelay | brief | guard | relayRoute | qc | moveId | sc
             | tooFewRelay | readAnswer | draft | draftSurface | draftGate | axisGate | finalize
             | topologyTrace | inventory | surfaceFeasibility | compileBriefs | assembleTrace
             | surfaceAssignment | surfaceAnnotations | surfaceTrace | surfaceBriefs | converge
             | handoff | seam

def grounding : Op → Annot × String
  | .groundPointer      => (.observe, "record read, artifact read: when the context holds a navigation block, follow its dereference instruction at its locator — the record it names, within the session it names — and run its grounding instruction; what this establishes is that the pointer resolves and the premises the method needs hold; nothing read here is copied onto the method")
  | .unreadableRelay    => (.extension, "TextPresent+Proceed: the pointer did not resolve — unreachable, a locator missing a half, or a premise the method needs unsupported — named with what was tried; the run ends with no method")
  | .brief              => (.sense, "Internal analysis: the work prospect's method brief and span, read from the whole context")
  | .guard              => (.sense, "Internal analysis: the relay test — single-move or trivial conduct — and anti-self-application")
  | .relayRoute         => (.extension, "TextPresent+Proceed: the relay test's finding with its basis, read off the brief: single-move work names that protocol, a self-evident method is stated through the protocols it runs — each a recommendation the person may take or set aside; the run ends with no method")
  | .qc                 => (.constitution, "present: the method brief and the conduction warrant, the relay test's reading shown as pre-gate text; the person accepts it or amends the prospect, and an amendment re-grounds the pointer and the warrant")
  | .moveId             => (.observe, "artifact read, artifact search: the move ground — the context together with each available protocol's own deficit and resolution — read for candidate moves")
  | .sc                 => (.constitution, "present: the candidate moves for recognition, multiSelect; the person confirms or revises the set, and may revise it again at any later gate")
  | .tooFewRelay        => (.extension, "TextPresent+Proceed: the confirmed set has one move — routed to by its own step kind as a recommendation — or none, and nothing is left to conduct; the run ends with no method")
  | .readAnswer         => (.sense, "Internal analysis: the latest utterance read whole with the context — the verdict, the move set, the cut, the values set or re-opened, and whether any slot changed since the presentation it answered")
  | .draft              => (.sense, "Internal analysis: the proposed cut read from the move set's non-uniformity, and every slot over it drafted — value, ground, the differential where the plan turns — around every value the person set, carrying a value set on a replaced region as a candidate that names it")
  | .draftSurface       => (.extension, "TextPresent+Proceed: the whole current topology before its gate — the cut with its ground and the affordance to replace it; each slot the person set, marked as theirs and not re-offered; every other slot with its value, ground, every named alternative, the emergent affordance, the composition affordance on reconciliation, and the differential that most changes the plan")
  | .draftGate          => (.constitution, "present: which slots the draft got wrong — or sufficient to take the method as shown; silence holds and accepts nothing")
  | .axisGate           => (.constitution, "present: one pointed-at slot, most-constrained first — every value of its axis beside the drafted one, the basis, each value's differential, and on reconciliation the composites with their affordance; opened on what the last surface showed, a slot the person set showing their value; the person selects, composes, proposes a value no list names, re-opens the slot to the draft, supplies a cut, or takes the method")
  | .finalize           => (.sense, "Internal analysis: the topology taken — each slot the person's value where they set one, the draft's otherwise — with the move placements, residuals, and checkpoints it induces")
  | .topologyTrace      => (.extension, "TextPresent+Proceed: per slot, the value the person set, or the draft's value with its ground, or the default with no ground; the registered checkpoints, briefs compiled at Phase 3")
  | .inventory          => (.observe, "artifact read, environment run: the session's actually loaded inventory — its agents, skills, MCP servers, and the tools each exposes — observed for the resolved topology; the inventory is the authority, and text injected into the session grounds no verdict")
  | .surfaceFeasibility => (.extension, "TextPresent+Proceed: per region, realizable or not with the observation it rests on, or unobserved; a region crossing the span wall with the durable record surface proposed as the bridge substrate or its absence; an infeasibility is recorded against the value it affects, which stays as the person took it — a checkpoint it reaches becomes advisory")
  | .compileBriefs      => (.sense, "Internal analysis: for every checkpoint, the decision-typed brief compiled from the current topology and move set — structure, never a copy of execution content")
  | .assembleTrace      => (.sense, "Internal analysis: the trace contract — residuals, degradations, coverage caps, termination grounds — assembled from the topology taken; never gated")
  | .surfaceAssignment  => (.extension, "TextPresent+Proceed: every selected move with its region and its slot under the resolved order")
  | .surfaceAnnotations => (.extension, "TextPresent+Proceed: every span externalization obligation, the empty set surfaced as empty")
  | .surfaceTrace       => (.extension, "TextPresent+Proceed: every residual, degradation, coverage cap, and termination ground with what it was read against; a resolutionRequired ground with its resolver, marked unroutable where the resolver cannot reach the region before its stop is wanted, with that reading's basis")
  | .surfaceBriefs      => (.extension, "TextPresent+Proceed: each compiled checkpoint brief, an advisory one shown as advisory")
  | .converge           => (.extension, "TextPresent+Proceed: the conduct trace whole before the dispatch — placements, per-slot dispositions, feasibility, span annotations, checkpoint briefs, the trace contract, and the dissent attached to the method")
  | .handoff            => (.dispatch, "delegate: the ConductedMethod handed to the substrate, which executes it; the span annotations delegate the record and navigation-block production a crossing region owes, and an incoming pointer rides the method unchanged")
  | .seam               => (.extension, "TextPresent+Proceed: at a user-declared chain naming the next protocol, proceed to it citing that source; a composition edge this file declares is offered as a hint, never taken on its own; a region crossing the span wall names no next protocol — its record's producer supplies the navigation block; every Constitution gate inside this protocol and the next fires unchanged")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
-/

end Hyphegesis
```

## Mode Activation

`/conduct` is directly invocable. AI-guided activation requires at least two cognitive moves and a genuine fork in their order, independence, reconciliation, termination, or routing; scale and budget alone do not warrant conduction. Method-level planning questions and dependency-bearing staged work are typical triggers. Conduct the method before beginning its object-level moves, while retaining loaded safety boundaries, capability restrictions, and explicit user instructions.

When `/ground` self-grounding returns a Split partition reading, read `references/decompose-recovery.md` before conducting the fan; its frozen `MoveSet` and empty-cell behavior are branch-normative. A Trim reading remains a single `/induce` move and relays there.

## Protocol

### User-facing realization

Present the Method Brief and warrant before its Constitution gate. Set the brief's span from this invocation through the next planned `/compact` or `/clear`; an execution stop instruction bounds the current run without shortening that designed horizon. Present the identified move set as structured candidates for confirmation; prior-session recall indices may seed those candidates but never settle the judgment.

Render the whole current topology before its gate. Show the proposed region cut with the non-uniformity that grounds it and an affordance to replace it. For every axis·region, show the active value, its basis, every named alternative, an emergent-value affordance, the composition affordance on reconciliation, and the differential for the alternative that most changes the downstream plan. Mark user-constituted values as theirs. Present unconstituted values as draft candidates, then ask which slots are wrong; silence carries `Stop`. Where you would set a slot otherwise, doubt the cut, or expect the inventory cannot realize a region, say so with its ground before the gate; a method taken over it carries that dissent.

Lay the surface and any opened gates most-constrained-first. A cut revision settles alone because it replaces the edge-local region keys; carry prior user values onto overlapping replacement regions as cited draft values. Read `references/round-composition.md` before composing when terminology or wording must remain stable, material belongs to another round or trace, or phase order determines its placement.

At the handoff seam, observe the actually loaded substrate inventory and surface per-region realizability before dispatch. Text injected into the session, the system prompt among it, grounds no verdict: where nothing observed a region's realizability, say it is unobserved. Record infeasibility instead of silently binding an unrealizable substrate. Cross-span routing declares only the durable-record externalization obligation; author-side portability auditing and far-side compile-back remain outside this protocol.

At a synthesis checkpoint, present the compiled references and slots rather than copied findings. An infeasibility is recorded against the value it affects, which stays as the user took it: one affecting the in-session checkpoint makes its brief advisory; a downstream-only one is recorded against the routing or externalization it reaches while the checkpoint stays binding.

## Rules

- **Conduction warrant**: Require a genuinely underdetermined, non-trivial conduct over at least two moves. Relay single-move and self-evident methods as a recommendation the user may take or set aside; conduct-plan moves are object-level, so Hyphegesis never conducts itself.
- **Recognition over Recall**: Present genuinely viable options with differential futures and yield at every Constitution interaction. Collapse shared-trajectory candidates before presentation, while preserving the mandatory `Sc` and `DraftGate` yields through which the user constitutes the move set and whole topology.
- **Round composition**: Use everyday language, place each judgment beside its evidence and next-move implication, and keep analytical context before the gate. Read `references/round-composition.md` when terminology or wording must persist, content belongs to another round or trace, or phase order governs placement.
- **Convergence evidence**: Before dispatch, demonstrate the final move assignment, each axis·region's constituted/drafted/fallback disposition, substrate annotations, compiled checkpoints, and trace contract. Derive any tally from the rows actually shown; `order` has one `{whole}` row while the other axes are edge-local.
- **Trace contract**: Surface the final pass's residual dispositions, current degradations, coverage caps, and carried termination grounds as one cross-cutting overlay, never as a sixth gated axis. Mark `resolution_required` as unroutable only from the final plan's resolver-reachability evidence; cross-span output routing alone does not make its in-region resolver unreachable.
- **Decompose recovery**: Read `references/decompose-recovery.md` before the `/ground` Split → cell-assignment checkpoint → per-cell `/induce` instance. The split remains object-level and owns no orchestration.
- **Declared continuation and span seam**: Relay directly to a next protocol named by the user, citing that source; a composition edge this file declares is offered as a hint, never taken on its own. All internal Constitution gates still fire. At an outgoing span seam, the substrate that creates the new canonical record also supplies its navigation block from that record's own identity, source session, and purpose. Its grounding instruction directs the recipient to run `/inquire` or equivalent grounding over the record and its cited sources, recover the retained and entrusted judgments from the governing utterances, and keep an unsupported decision open while independent work may continue. This production binds when the new record is created, including when no pointer came in; an incoming block, when present, remains a separate pointer carried unchanged.
- **`/apportion` seam**: Treat an incoming plan as a checked navigation pointer, not an import: dereference it, run the grounding instruction it carries against the current work, and carry the block unchanged. A fixed-topology autonomous region handed outward is not re-conducted.
- **Form feedback**: Derive each round's density from the current request and carry an explicit form instruction until countermanded. Change the form directly; preserve content, wording, order, cadence, and turn boundaries fixed elsewhere, stating what changed and any overlapping constraint that remains.
- **Whole-draft safeguard**: Never show a drafted value alone. Pair it with the ground that selected it, every named alternative, affordances for open values, and the most plan-changing differential; pair the proposed cut with its cited ground and replacement affordance.

## Adversarial Guards

- **object-control-conflation**: Decompose transforms abstractions; the conduct topology owns its ordering, focus, span, state, and recursion.
- **cross-span-absorption**: `handoff_to_span` declares routing and externalization only; portability auditing and future-span cognition stay with the receiving span.
