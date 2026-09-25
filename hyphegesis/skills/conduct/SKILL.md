---
name: conduct
description: "Conduct method before object-level work. Fires when the work needs several moves in non-trivial order. Type: (MethodUnderdetermined, Hybrid, CONDUCT, WorkProspect × MoveGround) → ConductedMethod"
---

# Hyphegesis Protocol

Conduct how a session's epistemic work will be carried out — the order, independence, reconciliation, termination, and routing of its cognitive moves — when that method is underdetermined before object-level cognition begins. The morphism is **design THEN hand off**: Hyphegesis designs a conduct topology over the moves it identifies and emits a method plan with in-session checkpoints, then stops; the substrate executes the moves. Type: `(MethodUnderdetermined, Hybrid, CONDUCT, WorkProspect × MoveGround) → ConductedMethod`.

## Definition

**Hyphegesis** (ὑφήγησις: a leading-the-way, guiding from just ahead): A dialogical act of conducting a session's epistemic work — deciding how its multiple cognitive moves relate in order, independence, reconciliation, termination, and routing — when the method is underdetermined while the goal is clear. The protocol's lexical verb is `/conduct`. It activates only when the work needs two or more moves whose conduct is non-trivial (single-move work relays to that one protocol). It lays out one map of the whole method before anything is asked — the work prospect's brief, the move set, a proposed region cut with what it read to cut that way, and every axis·region filled with a reasoned value shown beside the alternatives it displaces — drawn as a graph, and draws it again after every answer with what changed shown before and after, so a correction upstream re-fills what depends on it while every value the user set stays theirs. It takes the method on the user's word once everything taken was shown with its evidence, registers an in-session checkpoint when a constitutive decision's evidence does not yet exist (synthesis output shape generally; cell membership in the decompose-recovery instance), surfaces substrate feasibility on the map before the method is taken, compiles a decision-typed Recognition brief into every checkpoint, assembles a cross-cutting trace contract (its disclosure overlay over the five axes — adoptions, degradations, coverage caps, never silent), and hands off a method plan that the substrate — not Hyphegesis — executes.

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
  activation: observe(c) — what the pointer's record returns and the loaded inventory enter the
    context → [the pointer does not resolve, or the method needs a premise its record does not
    support: relay(handoff unreadable) → report | not warranted: relay-route — the single
    protocol, or the evident method, as a recommendation → report] → the map → Stop
  next utterance u: c' := observe(fuse(c, u)) →
    verdict(c') = withdraw → what stood, reported; no method
    verdict(c') = route(target) → proceed to the protocol the person named, citing their words
    the pointer does not resolve, or conduction is no longer warranted → relay → report
    verdict(c') = sufficient ∧ Covered(c') → the conduct trace → handoff → ConductedMethod
    otherwise → the map again, drawn from c', with what the answer changed shown before → after
  no utterance: the map holds; nothing is taken
The map is one graph of the whole method: the brief, the move set, the region cut, and every
axis·region slot — each value with its ground, the other values by name, and the differential
where the plan turns; each value the person set marked as theirs.
-/

/-! ── MORPHISM ──
WorkProspect × MoveGround
  → brief(method, conduction_warrant)         -- infer the work prospect's method-brief; judge whether conduction is warranted, at activation and after every utterance
  → guard(relay_test, anti_self_application)  -- work that does not need conducting relays as a recommendation; Hyphegesis does not conduct Hyphegesis
  → identify(moves)                           -- candidate cognitive moves read off the move ground; they enter the map as the draft's move set, for Recognition (`Recognition over Recall`)
  → draft(map)                                -- one map of the whole method — brief, moves, cut, every axis·region — each value beside the alternatives it displaces, drawn as a graph before anything is answered
  → design(map)                               -- the person points at what the map got wrong, in any layer, or sets values directly; every value they set is theirs, and the map is drawn again around it with what changed shown before → after
  → settle(map)                               -- on the person's sufficient, each value the method takes is recorded as set, adopted on closure with its ground, or adopted as the default — only once every one of them was shown with its evidence
  → assign(moves, topology) → move_assignment  -- place every move into its region and into its slot under the resolved order
  → annotate(substrate_feasibility)           -- realizability read from an observation of the loaded inventory, shown on the map before the method is taken
  → carry(work_pointer)                       -- carry the navigation block the work arrived under onto the emitted method, whole and unchanged
  → compile(checkpoint_briefs)                -- for every deferred decision, compile the decision-typed Recognition presentation contract the substrate executes there (structure, not content)
  → contract(trace_disclosure)                -- adoptions + degradations + coverage caps + termination grounds; surfaced, never silent
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
    determined. Read from the context; an amendment the person makes is part of it. -/
abbrev WorkProspect (P : Type) := Context P

/-- `MethodBrief`: `span` runs from this invocation to the next planned `/compact` or `/clear`; a
    stop instruction bounds the current run without shortening it. -/
structure MethodBrief where
  workIntent      : String
  expectedHandoff : String
  span            : String
  deriving Inhabited  -- elab: lets `brief` be declared `opaque`

/-- **Your reading** of the prospect's method brief, from the whole context, again after every
    utterance. -/
opaque brief : Context P → MethodBrief

/-- **Your judgment** (the relay test), after every utterance, on the map now standing:
    conduction is warranted — two or more moves in the move set the map holds, the person's
    revision included, and a real fork in their order, independence, reconciliation,
    termination, or routing. Single-move work and a self-evident method are not; scale and budget
    alone never are, and Hyphegesis never conducts itself. -/
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

/-- **Your reading** while a pointer is held: follow the block's dereference instruction at its
    locator and run its grounding instruction; what the record returns enters the context as
    observation. Nothing when there is no pointer. -/
opaque groundPointer : Context P → List (Evidence P)

/-- **Your observation**: the session's actually loaded inventory — its agents, skills, MCP
    servers, and the tools each exposes — read for the method the map now holds, before the map
    that shows it. The inventory is the authority, never a fixed list. -/
opaque inventory : Context P → List (Evidence P)

/-- What is observed enters the context before the presentation it informs. -/
def observe (c : Context P) : Context P :=
  let c₁ := c ++ (groundPointer c).map (·.val)
  c₁ ++ (inventory c₁).map (·.val)

/-- **Your judgment**: the pointer is unreachable or missing half its locator, or the method
    would need a premise its record does not support. An unresolved downstream item the method
    can leave open is not this: it is preserved and the design continues. False without a
    pointer. -/
opaque PointerUnreadable : Context P → Prop

-- elab: an open witness lets the occupancy readings below be declared `opaque`.
instance {A : Type} {q : Coord P A} {c : Context P} : Inhabited (Occ q c) := ⟨.open_ none⟩

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

/-- `CognitiveMove`: one invocation. `id` is its short name on the map (`M1`, `M2`); two
    invocations of one protocol — `/induce` on two cells — are two moves. -/
structure Move where
  id   : String
  step : MoveStep
  deriving DecidableEq

/-- `MS`. -/
abbrev MoveSet := List Move

/-- **Your reading** of the move ground — the context, each available protocol's own deficit and
    resolution, and the analysis passes and delegations the session affords: the move set the
    draft proposes. It settles nothing. -/
opaque candidates : Context P → MoveSet

/-- **Your judgment**: the cited utterance confirms or revises the move set to `ms`. -/
opaque MovesSupported : Context P → Turn P → MoveSet → Prop

/-- The move set is the person's where they set it: only their statement fills it. -/
def moveSetCoord : Coord P MoveSet := { admits := (· = .utterance), supports := MovesSupported }

/-- **Your judgment**: the move set the person's utterances set — confirming, adding, or removing
    moves; open where they have not touched it. -/
opaque moveSet : (c : Context P) → Occ (moveSetCoord (P := P)) c

/-- The moves the map holds: the person's set where they set one, the draft's otherwise; a move
    named twice is one move. -/
def moves (c : Context P) : MoveSet := ((filledValue (moveSet c)).getD (candidates c)).eraseDups

inductive Axis | order | independence | reconciliation | termination | routing

/-- The classes every downstream obligation dispatches on, never a value's name. -/
inductive ObligationClass | relaxesIsolation | needsStopGround | crossesSpan
  deriving DecidableEq

/-- A locator naming where the referenced content is recorded; the substrate dereferences it. -/
structure Reference where
  cites : String

/-- `Emergent(a)`: a value the presented set did not name, set at the map — the person's
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

/-- `MoveRegion`: moves sharing one conduct treatment. Whether a decision the person made on one
    region covers another — a region renamed, split, or merged — is read from what their
    utterance denoted (`SlotSupported`, `CutSupported`), never from equality of this structure. -/
structure Region where
  name    : String
  members : List Move

/-- A cut partitions the move set: every move in exactly one region, and no region empty. -/
def IsPartition (ms : MoveSet) (rs : List Region) : Prop :=
  (∀ m ∈ ms, ∃ r ∈ rs, m ∈ r.members) ∧
  (∀ r ∈ rs, r.members ≠ [] ∧ ∀ m ∈ r.members, m ∈ ms) ∧
  (∀ r ∈ rs, ∀ r' ∈ rs, ∀ m, m ∈ r.members → m ∈ r'.members → r = r')

/-- **Your proposal**: a cut that partitions `ms`, citing the non-uniformity you read to cut that
    way. -/
opaque proposedCut : Context P → MoveSet → List Region

/-- **Your judgment**: the cited utterance supplies `rs` as the cut, and `rs` partitions the move
    set the map holds. A supplied cut that does not is answered with why and fills nothing;
    rejecting a cut never requires the person to author its replacement. -/
opaque CutSupported : Context P → Turn P → List Region → Prop

def cutCoord : Coord P (List Region) := { admits := (· = .utterance), supports := CutSupported }

/-- **Your judgment**: the cut the person's utterances set; open where they have not set one, or
    where a later change to the moves leaves it no partition — the proposal then stands and names
    the cut they had set. -/
opaque cutSet : (c : Context P) → Occ (cutCoord (P := P)) c

/-- The cut in force: the person's where they set one, your proposal otherwise. -/
def cut (c : Context P) : List Region := (filledValue (cutSet c)).getD (proposedCut c (moves c))

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
    brief, the moves, the cut, a value the person set, or a decision the person made on a region
    the cut no longer has, named with that region; and, for the alternatives that most change the
    plan, what changes if the slot goes that way. `ground = none`: nothing preferred any value,
    and the slot holds `defaultValue`. -/
structure DraftSlot (s : Slot) where
  value        : SlotVal s
  ground       : Option String
  differential : List (String × String)
  fallback     : ground = none → value = defaultValue s

-- elab: a witness lets `draft` be declared `opaque`; it adds no meaning.
instance {s : Slot} : Inhabited (DraftSlot s) := ⟨⟨defaultValue s, none, [], fun _ => rfl⟩⟩

/-- **Your draft**: every slot over the cut in force, filled from the whole context — the brief,
    the moves, the cut, every value the person set — laid out most-constrained first, and drawn
    again after every utterance, so a change upstream re-fills what depends on it. Where a decision the person made may bear on a
    slot it no longer plainly covers, the ground names that decision and the region it was made
    on; where several land on one slot, it names each. A termination filled with
    `resolutionRequired` says in its ground whether that resolver can reach the region before its
    stop is wanted. -/
opaque draft : Context P → (s : Slot) → DraftSlot s

/-- **Your judgment**: the cited utterance sets `v` on `s` — a named value selected, a composite
    composed, or a value no presented set named, with the classes it declares — and what it
    denoted covers `s`. A decision made on a region the cut has since renamed, split, or merged
    covers `s` where that is what the person meant, and does not where their words leave it
    open. -/
opaque SlotSupported : (s : Slot) → Context P → Turn P → SlotVal s → Prop

/-- A slot value is the person's only through their statement. -/
def slotCoord (s : Slot) : Coord P (SlotVal s) :=
  { admits := (· = .utterance), supports := SlotSupported s }

/-- **Your judgment**: the value the person set on `s`. It stays theirs when a later utterance
    changes something upstream, on the scope they set it for; open where they never set one,
    where they returned it to the draft, and where an upstream change leaves unclear whether
    their decision reaches `s`. -/
opaque slot : (c : Context P) → (s : Slot) → Occ (slotCoord (P := P) s) c

/-- One slot of the method: the person's value where they set one, the draft's otherwise. -/
def take (c : Context P) (s : Slot) : SlotVal s :=
  match filledValue (slot c s) with
  | some v => v
  | none   => (draft c s).value

/-- What the fused context says the person did with the map. Premise: one utterance carries one
    of these; the edits it also makes are read by the coordinates above. -/
inductive Verdict
  /-- a correction, a value set, a slot opened for a fuller look, a question, or any other
      reading that does not end the run -/
  | cont
  /-- take the method as the map showed it, with whatever the same utterance settles -/
  | sufficient
  /-- stop without a method -/
  | withdraw
  /-- go to the protocol the person names instead -/
  | route (target : String)
  deriving Inhabited  -- elab: lets `verdict` be declared `opaque`

/-- **Your judgment** on the whole latest utterance read with the context. -/
opaque verdict : Context P → Verdict

/-- **Your judgment**, the adoption condition: every value the method would take was shown on a
    map the person answered, with its ground, the observed realizability of its region, and your
    contrary grounds; a value the closing utterance itself sets counts where its consequences
    were in view. Where anything would be taken unseen, the map is drawn again. -/
opaque Covered : Context P → Prop

/-- **Your record**: the contrary grounds you presented before the utterance that closes — a slot
    you would set otherwise, a cut you doubt, a region you expect the inventory cannot realize —
    attached to the method; empty when there were none. -/
opaque dissent : Context P → List String

/-- **Your judgment**: the observation cited shows whether the inventory can realize `r`'s
    values. -/
opaque FeasibilitySupported : Region → Context P → Turn P → Bool → Prop

/-- Realizability is read from an observation of the loaded inventory. Text injected into the
    session, the system prompt among it, grounds no verdict. -/
def feasibilityCoord (r : Region) : Coord P Bool :=
  { admits := (· = .observation), supports := FeasibilitySupported r }

/-- **Your reading** for `r`: filled with whether the inventory realizes `r`'s values, citing the
    observation; open where nothing observed it, and the map and trace say so. A region whose
    routing crosses the span wall needs a durable record surface its output can be externalized
    to. -/
opaque feasibility : (c : Context P) → (r : Region) → Occ (feasibilityCoord (P := P) r) c

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

/-- The region's four values, as the trace shows them. -/
def regionValues (c : Context P) (r : Region) : List ((s : Slot) × SlotVal s) :=
  EdgeAxis.all.map (fun a => ⟨.edge a r, take c (.edge a r)⟩)

/-- `substrateUnobserved`: nothing observed the region's realizability, so the method carries it
    unverified rather than silent. -/
inductive DegradationKind | independenceRelaxed | substrateInfeasible | substrateUnobserved

/-- A surfaced acknowledgment that a value relaxes an epistemic guarantee, cannot be realized, or
    was not observed to be realizable. The value stays as taken. -/
structure Degradation where
  region   : Region
  kind     : DegradationKind
  resolved : List ((s : Slot) × SlotVal s)

def degradations (c : Context P) (rs : List Region) : List Degradation :=
  (rs.filter (fun r => relaxes (take c (.edge .independence r)))).map
      (fun r => ⟨r, .independenceRelaxed, [⟨.edge .independence r, take c (.edge .independence r)⟩]⟩) ++
    (rs.filter (fun r => filledValue (feasibility c r) == some false)).map
      (fun r => ⟨r, .substrateInfeasible, regionValues c r⟩) ++
    (rs.filter (fun r => (filledValue (feasibility c r)).isNone)).map
      (fun r => ⟨r, .substrateUnobserved, regionValues c r⟩)

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

/-- **Your reading** of the caps the topology imposes: `singlePass` → `noRetry`, a bounded or
    dry-ceiling termination → `topN`, an intra-region sampling → `sampling`, any other cap →
    `emergent`. -/
opaque coverageLimits : Context P → List CoverageLimit

/-- Who put a layer of the map in force: the person, or the draft the closing utterance took. -/
inductive Source | person | draft

def sourceOf {A : Type} {q : Coord P A} {c : Context P} (o : Occ q c) : Source :=
  if isFilled o then .person else .draft

/-- How a slot's value became the method's. The proposal's origin is kept apart from its
    adoption: a drafted value the closing utterance took is adopted, never unconstituted. -/
inductive Adoption
  /-- the person set it -/
  | set
  /-- the draft proposed it on this ground and the closing utterance took it -/
  | adopted (ground : String)
  /-- nothing grounded a preference; the default was shown and the closing utterance took it -/
  | defaulted

def adoption (c : Context P) (s : Slot) : Adoption :=
  if isFilled (slot c s) then .set
  else match (draft c s).ground with
    | some g => .adopted g
    | none   => .defaulted

/-- The method's cross-cutting disclosure overlay; surfaced, never silent. -/
structure TraceContract where
  moves              : Source
  cut                : Source
  slots              : List (Slot × Adoption)
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

/-- What every brief realization presents: pre-gate evidence references, private-gap slots, and
    candidates with their differential implications, each a placeholder. -/
structure EmergentBrief where
  name            : String
  evidenceRefs    : List Placeholder
  privateGapSlots : List GapSlot
  candidates      : Placeholder

inductive CheckpointBrief
  | synthesis (b : SynthesisBrief)
  | emergent (b : EmergentBrief)

-- elab: a witness lets `compileBrief` be declared `opaque`; it adds no meaning.
instance : Inhabited CheckpointBrief := ⟨.emergent ⟨"", [], [], ⟨""⟩⟩⟩

/-- `advisory`: an infeasibility the inventory observation shows reaching this in-session
    checkpoint; a downstream-only one leaves it binding. -/
structure Checkpoint where
  region   : Region
  decision : DeferredDecision
  brief    : CheckpointBrief
  advisory : Bool

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

/-- **Your judgment**, from the inventory observation: an infeasibility reaches the checkpoint for
    `d` on `r` itself, rather than only the routing or externalization downstream of it. -/
opaque CheckpointUnrealizable : Context P → Region → DeferredDecision → Bool

/-- **Your reading**: `r`'s place in the sequence the resolved order gives; regions the order
    leaves unranked against each other share a place. -/
opaque regionRank : Context P → Region → Nat

/-- Topology order between regions, registration order breaking ties: a stable sort by place over
    the checkpoints in the order they were registered. -/
def orderCheckpoints (c : Context P) (xs : List Checkpoint) : List Checkpoint :=
  xs.mergeSort (fun a b => decide (regionRank c a.region ≤ regionRank c b.region))

def checkpoints (c : Context P) (rs : List Region) : List Checkpoint :=
  orderCheckpoints c (rs.flatMap (fun r =>
    (deferred c r).map (fun d => ⟨r, d, compileBrief c r d, CheckpointUnrealizable c r d⟩)))

/-- The externalization obligation a region crossing the span wall declares: the substrate
    writes its output to a record and gives that record's navigation block. -/
structure SpanExternalization where
  region        : Region
  recordSurface : Option String

def spanAnnotations (c : Context P) (rs : List Region) : List SpanExternalization :=
  (rs.filter (fun r => crossesSpan (take c (.edge .routing r)))).map (fun r => ⟨r, recordSurface c r⟩)

/-- `ConductedMethod`: the plan handed off; the substrate executes it. `c` is the session context
    its citations resolve in, and is not part of what the handoff dispatches: a record the pointer
    names stays where its locator names. -/
structure ConductedMethod (P : Type) (c : Context P) where
  topology    : (s : Slot) → SlotVal s
  moves       : MoveSet
  regions     : List Region
  assignment  : List Placement
  checkpoints : List Checkpoint
  feasibility : (r : Region) → Occ (feasibilityCoord (P := P) r) c
  spans       : List SpanExternalization
  trace       : TraceContract
  pointer     : Option NavigationBlock
  dissent     : List String

/-- The method the closing utterance took: every slot as the map showed it, each with how it
    became the method's, and the realizability read from the observation made before that map. -/
def method (c : Context P) : ConductedMethod P c :=
  let ms := moves c
  let rs := cut c
  { topology    := take c
    moves       := ms
    regions     := rs
    assignment  := assignment c ms rs
    checkpoints := checkpoints c rs
    feasibility := feasibility c
    spans       := spanAnnotations c rs
    trace       := { moves := sourceOf (moveSet c)
                     cut := sourceOf (cutSet c)
                     slots := (slotsOf rs).map (fun s => (s, adoption c s))
                     degradations := degradations c rs
                     coverageLimits := coverageLimits c
                     terminationGrounds := terminationGrounds c rs }
    pointer     := pointer c
    dissent     := dissent c }

/-- Why the run ends without a method, on your judgment rather than the person's. -/
inductive RelayKind
  /-- the pointer did not resolve, or the method needs a premise its record does not support -/
  | handoffUnreadable
  /-- your relay test: single-move work routes to that protocol, a self-evident method is
      stated through the protocols it runs; either as a recommendation -/
  | notWarranted

/-- `conducted c trace`: the person's `sufficient` closed `c` with every value covered; `trace` is
    the conduct trace presented before the dispatch, and the method handed off is `method c`. -/
inductive Outcome (P : Type)
  | conducted (c : Context P) (trace : Response P)
  /-- the person stopped: the context holds what stood, and nothing is handed off -/
  | withdrawn (c : Context P)
  /-- the person named another protocol: proceed to it, citing their words -/
  | routed    (target : String) (c : Context P)
  | relayed   (kind : RelayKind) (c : Context P)
  | holding   (c : Context P)

/-! ── WP-BINDING ──
bind(WP) = explicit_arg ∪ colocated_expr ∪ prev_user_turn ∪ ai_identified_prospect
Priority: explicit_arg > colocated_expr > prev_user_turn > ai_identified_prospect
  /conduct "text"              → WP = "text"
  /conduct (alone)             → WP = the work prospect under discussion
  "how should I approach..."   → WP = the work named before the trigger
  AI-detected trigger          → WP = the multi-move prospect AI identified (Hybrid: the person
                                 reads it as the map's first line and corrects it there)
`pointer` is read alongside WP: a navigation block the context holds, a sibling protocol's
emitted block included. A prospect is what someone states; a pointer is what the session holds.
-/

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
A step is one arm of a structural recursion over the person's utterances. Each utterance is
fused, then observed (`.groundPointer`, `.inventory`): what the pointer's record returns and the
loaded inventory enter the context before the presentation they inform. `respond` is the next map
(`.map`, then `.mapGate`), or, when the person's `sufficient` is covered, the conduct trace
presented before `method` is handed off (`.converge`, then `.handoff`). A person's closure is
read before your relay test. A method is taken only over a cut that `IsPartition` the moves it
holds, so every move lands in a region; a cut the person supplies is in force only where it
does.
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
    let c₁ := observe (fuse c u)
    match verdict c₁ with
    | .withdraw => .withdrawn c₁
    | .route t  => .routed t c₁
    | v =>
      match relayAt c₁ with
      | some k => .relayed k c₁
      | none   =>
        if v = .sufficient ∧ Covered c₁ ∧ IsPartition (moves c₁) (cut c₁) then
          .conducted c₁ (respond c₁)
        else conduct respond (c₁ ++ [(respond c₁).val]) us

noncomputable def start (respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  let c₁ := observe c
  match relayAt c₁ with
  | some k => .relayed k c₁
  | none   => conduct respond (c₁ ++ [(respond c₁).val]) us

/-! ── LOOP ──
Every map re-reads the whole context. It shows the method whole, as a graph: the brief and its
warrant, the moves, the cut with what was read to cut that way and the affordance to replace it,
and every slot — each value the person set marked as theirs and not re-offered; every other value
with its ground, the other values of its axis by name, the affordance to propose a value no list
names (and, on reconciliation, to compose two), and the differential for the alternative that
most changes the plan; each region's observed realizability, or that it is unobserved. After an
answer, the part of the graph it moved is shown as it stood and as it stands. A slot the person
opens for a fuller look is expanded in the next map with every value of its axis. No round cap:
the person ends the run with `sufficient`, `withdraw`, or a named protocol. A decision whose
evidence does not exist at design time is never drafted as an axis value; it registers as a
checkpoint. After handoff, the substrate conducts to the last checkpoint and executes; a
checkpoint may re-open Constitution mid-execution. The span ends at the next planned `/compact`
or `/clear`, which the person types.
-/

/-!
Silence takes nothing.
theorem silence (respond : Context P → Response P) (c : Context P) :
    conduct respond c [] = .holding c

The run reaches `conducted` only on the person's `sufficient`, judged covered, over a cut that
partitions the moves, with your relay test passed; its trace is your response over that context.
That the response is the conduct trace, and that the handoff follows it, are the obligations
`.converge` and `.handoff` carry — this theorem does not prove them.
theorem conducted_by_person (respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (c₁ : Context P) (t : Response P)
    (h : conduct respond c us = .conducted c₁ t) :
    ∃ (c₀ : Context P) (u : Utterance P), c₁ = observe (fuse c₀ u) ∧
      verdict c₁ = .sufficient ∧ Covered c₁ ∧ IsPartition (moves c₁) (cut c₁) ∧
      relayAt c₁ = none ∧ t = respond c₁

The run ends without a method on the person's word only through their `withdraw`.
theorem withdrawn_by_person (respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (c₁ : Context P) (h : conduct respond c us = .withdrawn c₁) :
    ∃ (c₀ : Context P) (u : Utterance P), c₁ = observe (fuse c₀ u) ∧ verdict c₁ = .withdraw

Another protocol is taken up only where the person named it.
theorem routed_by_person (respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (t : String) (c₁ : Context P)
    (h : conduct respond c us = .routed t c₁) :
    ∃ (c₀ : Context P) (u : Utterance P), c₁ = observe (fuse c₀ u) ∧ verdict c₁ = .route t

A person's `withdraw` is read before your relay test.
theorem withdraw_precedes_relay (respond : Context P → Response P) (c : Context P)
    (u : Utterance P) (us : List (Utterance P)) (h : verdict (observe (fuse c u)) = .withdraw) :
    conduct respond c (u :: us) = .withdrawn (observe (fuse c u))

A `sufficient` judged not covered does not close: the run continues with your next response
appended, which `.map` requires to be the map drawn again.
theorem uncovered_redraws (respond : Context P → Response P) (c : Context P) (u : Utterance P)
    (us : List (Utterance P)) (hs : verdict (observe (fuse c u)) = .sufficient)
    (hr : relayAt (observe (fuse c u)) = none) (hn : ¬ Covered (observe (fuse c u))) :
    conduct respond c (u :: us) =
      conduct respond (observe (fuse c u) ++ [(respond (observe (fuse c u))).val]) us
-/

/-! ── CONVERGENCE ──
conducted(WP): the method handed off on the person's covered `sufficient`, after the conduct
trace reached them. Convergence evidence, before the dispatch: the move set and the cut, each
with whether the person set it or took the draft's; for each move, its region and its slot under
the resolved order; for each slot, (slot → the value the person set), (slot → the draft's value →
its ground → adopted on closure), or (slot → `defaultValue` → nothing grounded a preference →
adopted on closure) — three different facts, never flattened; the feasibility of every region, an
unobserved one said to be unobserved; the span annotations, an empty set shown as empty; every
checkpoint with its compiled brief; and the trace contract — every adoption, degradation,
coverage cap, and termination ground, a `resolutionRequired` ground shown with its resolver and
marked unroutable where that resolver cannot reach the region before its stop is wanted, the
basis shown with it. The dissent attached to the method is shown beside it. Any tally is read
off the rows shown. What the closing utterance itself changed is shown first, before → after on
the graph, as every other answer's change is. Demonstrated, not asserted.
-/

/-!
What `slot` reads as the person's is the method's value and is recorded as theirs; the contract
proves no more than this about a value set before an upstream change — whether that decision
still reaches the slot is the judgment `slot` makes.
theorem person_value_taken (c : Context P) (s : Slot) (v : SlotVal s)
    (h : filledValue (slot c s) = some v) : (method c).topology s = v

theorem person_value_recorded (c : Context P) (s : Slot) (h : isFilled (slot c s) = true) :
    adoption c s = .set

Over a cut that partitions the moves, every move of the method lands in a region.
theorem every_move_placed (c : Context P) (h : IsPartition (moves c) (cut c)) :
    ∀ p ∈ (method c).assignment, p.region.isSome = true

A slot nothing grounded carries the default, whatever else the draft holds.
theorem ungrounded_is_default (c : Context P) (s : Slot) (hs : isFilled (slot c s) = false)
    (hg : (draft c s).ground = none) : take c s = defaultValue s

An emergent termination value declaring `needsStopGround` never leaves its region's ground silent.
theorem emergent_stop_never_silent (e : Emergent)
    (h : ObligationClass.needsStopGround ∈ e.classes) :
    (groundOf (.emergent e)).isSome = true

The pointer travels onto the method unchanged.
theorem pointer_carried (c : Context P) : (method c).pointer = pointer c

The move set, the cut, and every slot value are each filled only by a person's statement; a
realizability verdict only by an observation.
theorem moves_by_utterance {c : Context P} {s : Cite c}
    (ok : (moveSetCoord (P := P)).admits s.kind) : s.kind = .utterance

theorem cut_by_utterance {c : Context P} {s : Cite c}
    (ok : (cutCoord (P := P)).admits s.kind) : s.kind = .utterance

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

inductive Op | groundPointer | inventory | unreadableRelay | brief | guard | relayRoute | moveId
             | readAnswer | draft | map | mapGate | withdrawal | routeExit | settle
             | compileBriefs | assembleTrace | surfaceAssignment | surfaceAnnotations
             | surfaceTrace | surfaceBriefs | converge | handoff | seam

def grounding : Op → Annot × String
  | .groundPointer      => (.observe, "record read, artifact read: while the context holds a navigation block, follow its dereference instruction at its locator — the record it names, within the session it names — and run its grounding instruction; what the record returns enters the context before the map it informs, and nothing read here is copied onto the method")
  | .inventory          => (.observe, "artifact read, environment run: the session's actually loaded inventory — its agents, skills, MCP servers, and the tools each exposes — observed for the method the map now holds, before the map that shows it; the inventory is the authority, and text injected into the session grounds no verdict")
  | .unreadableRelay    => (.extension, "TextPresent+Proceed: the pointer did not resolve — unreachable, a locator missing a half, or a premise the method needs unsupported — named with what was tried; the run ends with no method")
  | .brief              => (.sense, "Internal analysis: the work prospect's method brief and span, read from the whole context after every utterance")
  | .guard              => (.sense, "Internal analysis: the relay test — work that needs fewer than two moves or no real fork — and anti-self-application, on the map now standing")
  | .relayRoute         => (.extension, "TextPresent+Proceed: the relay test's finding with its basis: single-move work names that protocol, a self-evident method is stated through the protocols it runs — each a recommendation the person may take or set aside; the run ends with no method")
  | .moveId             => (.observe, "artifact read, artifact search: the move ground — the context together with each available protocol's own deficit and resolution — read for the draft's move set")
  | .readAnswer         => (.sense, "Internal analysis: the latest utterance read whole with the context — the verdict, and every edit it makes to the brief, the moves, the cut, or a slot, with the scope each denotes")
  | .draft              => (.sense, "Internal analysis: the whole method drafted from the context — the proposed cut read from the moves' non-uniformity, every slot with its value, ground, and the differential where the plan turns — around every value the person set, naming a decision whose reach an upstream change left unclear")
  | .map                => (.extension, "TextPresent+Proceed: the whole map as a graph — moves as nodes with short ids, order as edges, regions as groups, slot values as annotations, everyday names in a legend beside the drawing; each value the person set marked as theirs, every other value with its ground, every named alternative, the emergent affordance, the composition affordance on reconciliation, and the differential that most changes the plan; each region's observed realizability or that it is unobserved; your contrary grounds; after an answer, the part of the graph it moved shown before → after")
  | .mapGate            => (.constitution, "present: what the map got wrong, anywhere on it — or sufficient to take the method as shown, withdraw, or another protocol by name; silence holds and takes nothing")
  | .withdrawal         => (.extension, "TextPresent+Proceed: on the person's withdraw, what stood — the map as last shown — reported with nothing handed off")
  | .routeExit          => (.extension, "TextPresent+Proceed: on the person's named protocol, proceed to it citing their words; its Constitution gates fire unchanged")
  | .settle             => (.sense, "Internal analysis: on a covered sufficient, each value the method takes with how it became the method's — set by the person, adopted on closure with the draft's ground, or adopted as the default — and the move placements and checkpoints it induces")
  | .compileBriefs      => (.sense, "Internal analysis: for every checkpoint, the decision-typed brief compiled from the topology and move set taken — structure, never a copy of execution content — marked advisory where an observed infeasibility reaches the checkpoint itself")
  | .assembleTrace      => (.sense, "Internal analysis: the trace contract — the moves' and cut's source, every slot's adoption, degradations, coverage caps, termination grounds — assembled from the method taken; never gated")
  | .surfaceAssignment  => (.extension, "TextPresent+Proceed: every move with its region and its slot under the resolved order")
  | .surfaceAnnotations => (.extension, "TextPresent+Proceed: every span externalization obligation, the empty set surfaced as empty")
  | .surfaceTrace       => (.extension, "TextPresent+Proceed: every adoption, degradation, coverage cap, and termination ground with what it was read against; a resolutionRequired ground with its resolver, marked unroutable where the resolver cannot reach the region before its stop is wanted, with that reading's basis")
  | .surfaceBriefs      => (.extension, "TextPresent+Proceed: each compiled checkpoint brief, an advisory one shown as advisory")
  | .converge           => (.extension, "TextPresent+Proceed: the conduct trace whole before the dispatch — what the closing utterance itself changed, before → after on the graph; placements, per-slot adoptions, feasibility, span annotations, checkpoint briefs, the trace contract, and the dissent attached to the method")
  | .handoff            => (.dispatch, "delegate: after the conduct trace, the ConductedMethod handed to the substrate, which executes it — its fields, never the session context its citations resolve in; the span annotations delegate the record and navigation-block production a crossing region owes, and an incoming pointer rides the method unchanged while the record it names stays where its locator names")
  | .seam               => (.extension, "TextPresent+Proceed: at a chain the person declared naming the next protocol, proceed to it citing that source; a composition edge this file declares is offered as a hint, never taken on its own; a region crossing the span wall names no next protocol — its record's producer supplies the navigation block; every Constitution gate inside this protocol and the next fires unchanged")

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

Present one map of the whole method at activation and again after every answer. Its first line is the work prospect's brief — what the work is for, what it hands off, and its span, from this invocation through the next planned `/compact` or `/clear` (an execution stop instruction bounds the current run without shortening that horizon) — with whether conduction is warranted. Below it are the move set, the region cut with the non-uniformity that grounds it and an affordance to replace it, and every axis·region slot. Prior-session recall indices may seed the moves but never settle them.

Order the candidate moves by salience against the session aim, so confirming them is recognizing the accumulated shape rather than recalling a graph the user no longer holds in view. Lay the slots out most-constrained first — the axis·region whose values most divide the downstream plans leads — and expand opened slots in that same order.

Draw the map as a graph: moves as nodes with short ASCII ids (`M1`, `M2`), order as edges, regions as labelled groups (`R1`), and each slot's value as an annotation on its region. Put everyday-language names in a legend beside the drawing rather than inside it: display width is not character count, and a label padded by counting characters breaks the drawing. For every slot, show its value, its ground, every named alternative, an emergent-value affordance, the composition affordance on reconciliation, and the differential for the alternative that most changes the plan. Mark each value the person set as theirs. Show each region's observed realizability, or say it is unobserved. Where you would set a slot otherwise, doubt the cut, or expect the inventory cannot realize a region, say so with its ground before the gate; a method taken over it carries that dissent. Then ask what is wrong, anywhere on the map, or whether to take it; silence holds and takes nothing.

After an answer, draw the map again from the whole context and show what the answer changed, before → after: the part of the graph it moved, first as it stood and then as it stands, so the person checks the change instead of re-reading the map. A change upstream re-fills what depends on it. A value the person set stays theirs on the scope they set it for; where the change leaves that scope unclear, name the decision and the slots it may reach, and leave them open. A slot the person opens for a fuller look is expanded in the next map with every value of its axis and each value's differential.

Take the method only when every value it takes was shown with its ground, its region's realizability, and your contrary grounds; otherwise draw the map again. On a withdrawal, report what stood and hand nothing off. On a protocol the person names, go to it citing their words. Read `references/round-composition.md` before composing when terminology or wording must remain stable, material belongs to another turn or the trace, or where a sentence sits relative to the gate is in question.

Text injected into the session, the system prompt among it, grounds no realizability verdict: where nothing observed a region's realizability, say it is unobserved. Record infeasibility instead of silently binding an unrealizable substrate. Cross-span routing declares only the durable-record externalization obligation; author-side portability auditing and far-side compile-back remain outside this protocol.

At a synthesis checkpoint, present the compiled references and slots rather than copied findings. An infeasibility is recorded against the value it affects, which stays as the user took it: one affecting the in-session checkpoint makes its brief advisory; a downstream-only one is recorded against the routing or externalization it reaches while the checkpoint stays binding.

## Rules

- **Conduction warrant**: Require a genuinely underdetermined, non-trivial conduct over at least two moves, judged again after every answer. Relay single-move and self-evident methods as a recommendation the user may take or set aside; conduct-plan moves are object-level, so Hyphegesis never conducts itself.
- **Recognition over Recall**: Present genuinely viable options with differential futures and yield at every Constitution interaction. Collapse shared-trajectory candidates before presentation, while preserving the map's yield through which the user constitutes the whole method — brief, moves, cut, and slots together.
- **Round composition**: Use everyday language, place each judgment beside its evidence and next-move implication, and keep analytical context before the gate. Read `references/round-composition.md` when terminology or wording must persist, content belongs to another turn or trace, or placement relative to the gate is in question.
- **Map change shown**: After every answer, show what it changed as the moved part of the graph before and after. A value the user set stays theirs on its scope; an upstream change that leaves its reach unclear is named and left open, never silently re-drafted.
- **Adoption covered**: Take the method only on the user's `sufficient` over a map that showed every value taken with its ground, its region's observed realizability, and your contrary grounds. Record each drafted value it takes as adopted on closure, apart from the values the user set.
- **Convergence evidence**: Before dispatch, demonstrate the final move assignment, the moves' and cut's source, each axis·region's set / adopted / default disposition, substrate annotations, compiled checkpoints, and trace contract. Derive any tally from the rows actually shown; `order` has one `{whole}` row while the other axes are edge-local.
- **Trace contract**: Surface the adoption dispositions, current degradations, coverage caps, and carried termination grounds as one cross-cutting overlay, never as a sixth gated axis. Mark `resolution_required` as unroutable only from the final plan's resolver-reachability evidence; cross-span output routing alone does not make its in-region resolver unreachable.
- **Decompose recovery**: Read `references/decompose-recovery.md` before the `/ground` Split → cell-assignment checkpoint → per-cell `/induce` instance. The split remains object-level and owns no orchestration.
- **Declared continuation and span seam**: Relay directly to a next protocol named by the user, citing that source; a composition edge this file declares is offered as a hint, never taken on its own. All internal Constitution gates still fire. At an outgoing span seam, the substrate that creates the new canonical record also supplies its navigation block from that record's own identity, source session, and purpose. Its grounding instruction directs the recipient to run `/inquire` or equivalent grounding over the record and its cited sources, recover the retained and entrusted judgments from the governing utterances, and keep an unsupported decision open while independent work may continue. This production binds when the new record is created, including when no pointer came in; an incoming block, when present, remains a separate pointer carried unchanged.
- **`/apportion` seam**: Treat an incoming plan as a checked navigation pointer, not an import: dereference it, run the grounding instruction it carries against the current work, and carry the block unchanged. A fixed-topology autonomous region handed outward is not re-conducted.
- **Form feedback**: Derive each round's density from the current request and carry an explicit form instruction until countermanded. Change the form directly; preserve content, wording, order, cadence, and turn boundaries fixed elsewhere, stating what changed and any overlapping constraint that remains.
- **Whole-draft safeguard**: Never show a drafted value alone. Pair it with the ground that selected it, every named alternative, affordances for open values, and the most plan-changing differential; pair the proposed cut with its cited ground and replacement affordance.

## Adversarial Guards

- **object-control-conflation**: Decompose transforms abstractions; the conduct topology owns its ordering, focus, span, state, and recursion.
- **cross-span-absorption**: `handoff_to_span` declares routing and externalization only; portability auditing and future-span cognition stay with the receiving span.
