---
name: conduct
description: "Conduct method before object-level work. Fires when the work needs several moves in non-trivial order. Type: (MethodUnderdetermined, Hybrid, CONDUCT, WorkProspect × MoveGround) → ConductedMethod"
---

# Hyphegesis Protocol

Conduct how a session's epistemic work will be carried out — the order, independence, reconciliation, termination, and routing of its cognitive moves — when that method is underdetermined before object-level cognition begins. The morphism is **design THEN hand off**: Hyphegesis designs a conduct topology over the moves it identifies and emits a method plan with in-session checkpoints, then stops; the substrate executes the moves. Type: `(MethodUnderdetermined, Hybrid, CONDUCT, WorkProspect × MoveGround) → ConductedMethod`.

## Definition

**Hyphegesis** (ὑφήγησις: a leading-the-way, guiding from just ahead): A dialogical act of conducting a session's epistemic work — deciding how its multiple cognitive moves relate in order, independence, reconciliation, termination, and routing — when the method is underdetermined while the goal is clear. The protocol's lexical verb is `/conduct`. It activates only when the work needs two or more moves whose conduct is non-trivial (single-move work relays to that one protocol). It lays out one map of the whole method before anything is asked — the work prospect's brief, the move set, a proposed region cut with what it read to cut that way, and every axis·region filled with a reasoned value shown beside the alternatives it displaces — on one sheet, and draws it again after every answer with a ledger of what changed, so a correction upstream re-fills what depends on it while every value the user set stays theirs. It takes the method on the user's word once everything taken was shown with its evidence, registers an in-session checkpoint when a constitutive decision's evidence does not yet exist (synthesis output shape generally; cell membership in the decompose-recovery instance), surfaces substrate feasibility on the map before the method is taken, compiles a decision-typed Recognition brief into every checkpoint, assembles a cross-cutting trace contract (its disclosure overlay over the five axes — adoptions, degradations, coverage caps, never silent), and hands off a method plan that the substrate — not Hyphegesis — executes.

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
Hyphegesis(WP) → conduct(c, utterances), where c is the fused session context:
  activation: observe(c) — what the pointer's record returns and the loaded inventory enter the
    context → [the pointer does not resolve, or the method needs a premise its record does not
    support: relay(handoff unreadable) → report | not warranted: relay-route — the single
    protocol, or the evident method, as a recommendation → report] → the map → Stop
  next utterance u: c' := observe(fuse(c, u)) →
    read(u).verdict = withdraw → what stood, reported; no method
    read(u).verdict = route(target) → proceed to the protocol the person named, citing their words
    the pointer does not resolve, or conduction is no longer warranted → relay → report
    read(u).verdict = sufficient ∧ Covered(c') → the conduct trace → handoff → ConductedMethod
    otherwise → the map again, drawn from c', with a ledger of what the answer changed
  no utterance: the map holds; nothing is taken
  after handoff: the substrate runs the method and returns one consolidated summary of every
    region's results; it returns mid-run only at a registered checkpoint, or where execution needs
    what only the person can supply
The map is one sheet of the whole method: the brief; the moves as an outline under their regions,
links drawn only where a move joins more than one predecessor; the region cut; and every
axis·region slot in a table — each value with its ground, the other values by name, and the
differential where the plan turns; each value marked as the person's or the draft's.
-/

/-! ── MORPHISM ──
WorkProspect × MoveGround
  → brief(method, conduction_warrant)         -- infer the work prospect's method-brief; judge whether conduction is warranted, at activation and after every utterance
  → guard(relay_test, anti_self_application)  -- work that does not need conducting relays as a recommendation; Hyphegesis does not conduct Hyphegesis
  → identify(moves)                           -- candidate cognitive moves read off the move ground; they enter the map as the draft's move set, for Recognition (`Recognition over Recall`)
  → draft(map)                                -- one map of the whole method — brief, moves, cut, every axis·region — each value beside the alternatives it displaces, laid out on one sheet before anything is answered
  → design(map)                               -- the person points at what the map got wrong, in any layer, or sets values directly; every value they set is theirs, and the map is drawn again around it with a ledger of what changed and why
  → settle(map)                               -- on the person's sufficient, each value the method takes is recorded as set, adopted on closure with its ground, or adopted as the default — only once every one of them was shown with its evidence
  → assign(moves, topology) → move_assignment  -- place every move into its region and into its slot under the resolved order
  → annotate(substrate_feasibility)           -- realizability read from an observation of the loaded inventory, shown on the map before the method is taken
  → carry(work_pointer)                       -- carry the navigation block the work arrived under onto the emitted method, whole and unchanged
  → compile(checkpoint_briefs)                -- for every deferred decision, compile the decision-typed Recognition presentation contract the substrate executes there (structure, not content)
  → contract(trace_disclosure)                -- adoptions + degradations + coverage caps + termination grounds; surfaced, never silent
  → handoff(conducted_method)                 -- emit the method plan + in-session checkpoints, then stop (substrate executes, and returns one consolidated summary when the method has run)
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

noncomputable section

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

/-- **Your reading** of the prospect's method brief, from the whole context, again after every
    utterance. -/
axiom brief : Context P → MethodBrief

/-- **Your judgment** (the relay test), after every utterance, on the map now standing:
    conduction is warranted — two or more moves in the move set the map holds, the person's
    revision included, and a real fork in their order, independence, reconciliation,
    termination, or routing. Single-move work and a self-evident method are not; scale and budget
    alone never are, and Hyphegesis never conducts itself. -/
axiom Warranted : Context P → Prop

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
axiom pointer : Context P → Option NavigationBlock

/-- **Your reading** while a pointer is held: follow the block's dereference instruction at its
    locator and run its grounding instruction; what the record returns enters the context as
    observation. Nothing when there is no pointer. -/
axiom groundPointer : Context P → List (Evidence P)

/-- **Your observation**: the session's actually loaded inventory — its agents, skills, MCP
    servers, and the tools each exposes — read for the method the map now holds, before the map
    that shows it. The inventory is the authority, never a fixed list. -/
axiom inventory : Context P → List (Evidence P)

/-- What is observed enters the context before the presentation it informs. -/
def observe (c : Context P) : Context P :=
  let c₁ := c ++ (groundPointer c).map (·.val)
  c₁ ++ (inventory c₁).map (·.val)

/-- **Your judgment**: the pointer is unreachable or missing half its locator, or the method
    would need a premise its record does not support. An unresolved downstream item the method
    can leave open is not this: it is preserved and the design continues. False without a
    pointer. -/
axiom PointerUnreadable : Context P → Prop

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
axiom candidates : Context P → MoveSet

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

/-- Where a region's output goes. `handoffToProtocol` carries the protocol it routes to;
    `handoffToSpan` sends the output across the span wall to a future span that does not share
    this session's context. -/
inductive Routing
  /-- the region's result is included in the one consolidated summary returned to the person
      after the whole method has run; it does not pause execution -/
  | returnToUser
  | chainToNext | handoffToProtocol (target : String) | deepenOnFinding
  | handoffToSpan
  | emergent (e : Emergent)

/-- `MoveRegion`: moves sharing one conduct treatment. Whether a decision the person made on one
    region covers another — a region renamed, split, or merged — is read from what their
    utterance denoted (`read`, `reach`), never from equality of this structure. -/
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
axiom proposedCut : Context P → MoveSet → List Region

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

/-- **Your draft**: every slot over the cut in force, filled from the whole context — the brief,
    the moves, the cut, every value the person set — laid out most-constrained first, and drawn
    again after every utterance, so a change upstream re-fills what depends on it. Where a decision the person made may bear on a
    slot it no longer plainly covers, the ground names that decision and the region it was made
    on; where several land on one slot, it names each. A termination filled with
    `resolutionRequired` says in its ground whether that resolver can reach the region before its
    stop is wanted. -/
axiom draft : Context P → (s : Slot) → DraftSlot s

/-! What the person said. Each person turn is read once, against the context that stood when they
    sent it; everything the person constitutes — the verdict, the move set, the cut, a slot's value —
    is read off those readings and nothing else. -/

/-- Whether a decision made on slot `s₀` carries to slot `s`: the same axis, and then a value of
    one is a value of the other. -/
def transfer : (s₀ s : Slot) → SlotVal s₀ → Option (SlotVal s)
  | .order, .order, v                                         => some v
  | .edge .independence _, .edge .independence _, v           => some v
  | .edge .reconciliation _, .edge .reconciliation _, v       => some v
  | .edge .termination _, .edge .termination _, v             => some v
  | .edge .routing _, .edge .routing _, v                     => some v
  | _, _, _                                                   => none

/-- One edit a person turn makes, with the slot or scope it was made on. -/
inductive Edit
  /-- the move set as the turn leaves it — confirmed, added to, or removed from -/
  | moves (ms : MoveSet)
  /-- a cut the person supplies -/
  | cut (rs : List Region)
  /-- a value set on `s` — a named value selected, a composite composed, or a value no presented
      set named, with the classes it declares -/
  | set (s : Slot) (v : SlotVal s)
  /-- a value returned to the draft -/
  | release (s : Slot)

/-- What the person did with the map. Premise: one utterance carries one of these. -/
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

structure Reading where
  verdict : Verdict
  edits   : List Edit

/-- **Your reading** of the person's turn `u`, against the context `h` that stood when they sent it,
    `u` last: what they did with the map, and every edit it makes with the slot or scope each
    denotes. Whatever the turn's form — a request or an instruction constitutes as a statement does.
    A later turn never reads it again. -/
axiom read : Context P → Utterance P → Reading

def asUtterance : Turn P → Option (Utterance P)
  | ⟨.person, f, x⟩ => some ⟨⟨.person, f, x⟩, rfl⟩
  | _               => none

/-- Every person turn of `c`, by position, each read against the context up to and including it. -/
def said (c : Context P) : List (Nat × Reading) :=
  (List.range c.length).filterMap (fun i =>
    (c[i]?.bind asUtterance).map (fun u => (i, read (c.take (i + 1)) u)))

/-- Every edit the person made, oldest first, with the position of the turn that made it. -/
def edits (c : Context P) : List (Nat × Edit) :=
  (said c).flatMap (fun p => p.2.edits.map (p.1, ·))

def lastMoves (c : Context P) : Option MoveSet :=
  (edits c).foldl (fun acc e => match e.2 with | .moves ms => some ms | _ => acc) none

def lastCut (c : Context P) : Option (List Region) :=
  (edits c).foldl (fun acc e => match e.2 with | .cut rs => some rs | _ => acc) none

/-- The moves the map holds: the person's set where they set one, the draft's otherwise; a move
    named twice is one move. -/
def moves (c : Context P) : MoveSet := ((lastMoves c).getD (candidates c)).eraseDups

open Classical in
/-- The cut the person set, while it still partitions the moves the map holds; where a later change
    to the moves leaves it no partition, the proposal stands and names the cut they had set. -/
noncomputable def cutSet (c : Context P) : Option (List Region) :=
  (lastCut c).filter (fun rs => decide (IsPartition (moves c) rs))

/-- The cut in force: the person's where they set one, your proposal otherwise. -/
noncomputable def cut (c : Context P) : List Region := (cutSet c).getD (proposedCut c (moves c))

inductive Reach | reaches | unclear | lapses
  deriving DecidableEq

/-- **Your judgment**, on the context now standing: whether a decision the person made on slot `s₀`
    reaches slot `s`. `reaches` where it is the same slot or what they meant covers it — a region
    renamed, split, or merged; `unclear` where their words leave it open; `lapses` where it plainly
    does not, the ledger showing what lapsed. -/
axiom reach : Context P → Slot → Slot → Reach

/-- Where a slot's value comes from. `unclear`: a decision the person made may reach the slot and
    their words leave it open; the slot is open, and the map names that decision. -/
inductive SlotState (s : Slot)
  | draft
  | set (v : SlotVal s) (turn : Nat)
  | unclear (turn : Nat)

def SlotState.isSet {s : Slot} : SlotState s → Bool
  | .set .. => true
  | _       => false

/-- The latest decision the person made that reaches `s`, or leaves open whether it does; a
    decision that lapses is passed over. -/
noncomputable def slotState (c : Context P) (s : Slot) : SlotState s :=
  go (edits c).reverse
where
  go : List (Nat × Edit) → SlotState s
    | [] => .draft
    | (i, .set s₀ v) :: rest =>
      match transfer s₀ s v, reach c s₀ s with
      | some w, .reaches => .set w i
      | some _, .unclear => .unclear i
      | _, _             => go rest
    | (_, .release s₀) :: rest => if reach c s₀ s = .reaches then .draft else go rest
    | _ :: rest => go rest

/-- One slot of the method: the person's value where they set one, the draft's otherwise. -/
noncomputable def take (c : Context P) (s : Slot) : SlotVal s :=
  match slotState c s with
  | .set v _ => v
  | _        => (draft c s).value

/-- **Your judgment**, the adoption condition: every value the method would take was shown on a
    map the person answered, with who proposed it and whether the person set it, its ground, the
    observed realizability of its region, and your contrary grounds; a value the closing utterance
    itself sets counts where its consequences were in view. Where anything would be taken unseen,
    the map is drawn again. -/
axiom Covered : Context P → Prop

/-- **Your record**: the contrary grounds you presented before the utterance that closes — a slot
    you would set otherwise, a cut you doubt, a region you expect the inventory cannot realize —
    attached to the method; empty when there were none. -/
axiom dissent : Context P → List String

/-- **Your judgment**: the observation cited shows whether the inventory can realize `r`'s
    values. -/
axiom FeasibilitySupported : Region → Context P → Turn P → Bool → Prop

/-- Realizability is read from an observation of the loaded inventory. Text injected into the
    session, the system prompt among it, grounds no verdict. -/
def feasibilityCoord (r : Region) : Coord P Bool :=
  { admits := (· = .observation), supports := FeasibilitySupported r }

/-- **Your reading** for `r`: filled with whether the inventory realizes `r`'s values, citing the
    observation; open where nothing observed it, and the map and trace say so. A region whose
    routing crosses the span wall needs a durable record surface its output can be externalized
    to. -/
axiom feasibility : (c : Context P) → (r : Region) → Occ (feasibilityCoord (P := P) r) c

/-- **Your reading**: the durable record surface the observed inventory offers a region whose
    output crosses the span wall; `none` where none was observed. -/
axiom recordSurface : Context P → Region → Option String

/-- **Your placement**: the move's slot in the sequence the resolved order gives. -/
axiom position : Context P → Move → Nat

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
axiom coverageLimits : Context P → List CoverageLimit

/-- Who first put a value forward: the draft, or the person naming one the draft did not offer.
    Kept apart from how the value came into force — a move the draft proposed and the person kept
    while removing another was proposed by the draft and set by the person. -/
inductive Proposer | draft | person

/-- What the closing record names a proposer for. -/
inductive Entry
  | move (m : Move)
  | cut
  | slot (s : Slot)

/-- **Your reading** from the context: the position of the turn that first put forward what `e`
    holds now. -/
axiom introducedAt : Context P → Entry → Nat

/-- Who first put `e` forward is the origin of that turn: the person's, or the draft's. -/
def proposer (c : Context P) (e : Entry) : Proposer :=
  match c[introducedAt c e]? with
  | some ⟨.person, _, _⟩ => .person
  | _                    => .draft

/-- How the move set or the cut came into force: the person's statement set it — named or
    edited — or the closing utterance adopted the draft's. -/
inductive Standing | set | adopted

def standingOf {A : Type} (o : Option A) : Standing :=
  if o.isSome then .set else .adopted

/-- How a slot's value came into force. Kept apart from who proposed it: a drafted value the
    closing utterance took is adopted, never unconstituted. -/
inductive Adoption
  /-- the person set it -/
  | set
  /-- the draft proposed it on this ground and the closing utterance took it -/
  | adopted (ground : String)
  /-- nothing grounded a preference; the default was shown and the closing utterance took it -/
  | defaulted

def adoption (c : Context P) (s : Slot) : Adoption :=
  if (slotState c s).isSet then .set
  else match (draft c s).ground with
    | some g => .adopted g
    | none   => .defaulted

/-- The method's cross-cutting disclosure overlay; surfaced, never silent. Every entry carries who
    proposed it apart from how it came into force. -/
structure TraceContract where
  moves              : Standing × List (Move × Proposer)
  cut                : Standing × Proposer
  slots              : List (Slot × Proposer × Adoption)
  degradations       : List Degradation
  coverageLimits     : List CoverageLimit
  terminationGrounds : List (Region × TerminationGround)

/-- A decision, or a supply, whose deciding evidence exists only at the checkpoint. The run pauses
    for the person only here or where execution needs what only the person can supply. -/
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

/-- `advisory`: an infeasibility the inventory observation shows reaching this in-session
    checkpoint; a downstream-only one leaves it binding. -/
structure Checkpoint where
  region   : Region
  decision : DeferredDecision
  brief    : CheckpointBrief
  advisory : Bool

/-- A region owes the synthesis checkpoint when its reconciliation contains `synthesis` and its
    output goes to the person's end-of-run summary or crosses the span wall. -/
def owesSynthesis (c : Context P) (r : Region) : Bool :=
  containsSynthesis (take c (.edge .reconciliation r)) && returnsOrCrosses (take c (.edge .routing r))

/-- **Your reading**: the other non-axis decisions for `r` whose deciding evidence does not exist at
    design time and does at the checkpoint — the cell membership of the decompose-recovery
    instance, and a need the plan anticipates that only the person can supply before `r` can run —
    a secret or credential to set, a deployment handed to runtime — registered before the move that
    needs it. -/
axiom emergentDeferred : Context P → Region → List String

/-- The decisions `r` defers: `synthesisOutputShape` whenever `owesSynthesis`, then the emergent
    ones. -/
noncomputable def deferred (c : Context P) (r : Region) : List DeferredDecision :=
  (if owesSynthesis c r then [.synthesisOutputShape] else []) ++
    (emergentDeferred c r).map .emergent

/-- **Your compilation** of the brief the decision calls for, from the current topology and move
    set: structure, never a copy of execution content. -/
axiom compileBrief : Context P → Region → DeferredDecision → CheckpointBrief

/-- **Your judgment**, from the inventory observation: an infeasibility reaches the checkpoint for
    `d` on `r` itself, rather than only the routing or externalization downstream of it. -/
axiom CheckpointUnrealizable : Context P → Region → DeferredDecision → Bool

/-- **Your reading**: `r`'s place in the sequence the resolved order gives; regions the order
    leaves unranked against each other share a place. -/
axiom regionRank : Context P → Region → Nat

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

/-- `ConductedMethod`: the plan handed off; the substrate executes it and, when the method has
    run, returns one consolidated summary of every region's results to the person. Mid-run it
    returns to the person only at a registered checkpoint, or where execution needs what only the
    person can supply and no checkpoint anticipated it — a secret or credential, a runtime error
    it cannot resolve, a deployment handed to runtime. `c` is the session context its citations
    resolve in, and is not part of what the handoff dispatches: a record the pointer names stays
    where its locator names. -/
structure ConductedMethod (P : Type) (c : Context P) where
  brief       : MethodBrief
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
  { brief       := brief c
    topology    := take c
    moves       := ms
    regions     := rs
    assignment  := assignment c ms rs
    checkpoints := checkpoints c rs
    feasibility := feasibility c
    spans       := spanAnnotations c rs
    trace       := { moves := (standingOf (lastMoves c), ms.map (fun m => (m, proposer c (.move m))))
                     cut := (standingOf (cutSet c), proposer c .cut)
                     slots := (slotsOf rs).map (fun s => (s, proposer c (.slot s), adoption c s))
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
    match (read (fuse c u) u).verdict with
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
Every map re-reads the whole context. It shows the method whole, on one sheet: the brief and its
warrant; the moves as an outline under their regions, links drawn only where a move joins more
than one predecessor, placed as they were last turn; the cut with what was read to cut that way
and the affordance to replace it; and every slot in a table — each value the person set marked as
theirs and not re-offered; every other value marked as the draft's, with its ground, the other
values of its axis by name, the affordance to propose a value no list names (and, on
reconciliation, to compose two), and the differential for the alternative that most changes the
plan; each region's observed realizability, or that it is unobserved. After an answer, a ledger
says what it changed: the person's edits first, then each value the draft re-filled because of
them, pointing to the edit that caused it, each marked a necessary consequence or a proposal. A
slot the person opens for a fuller look is expanded in the next map with every value of its axis.
No round cap: the person ends the run with `sufficient`, `withdraw`, or a named protocol. A
decision whose evidence does not exist at design time is never drafted as an axis value; it
registers as a checkpoint, as does a need the plan anticipates that only the person can supply.
After handoff, the substrate conducts to the last checkpoint and executes; a checkpoint may
re-open Constitution mid-execution; when the method has run, the substrate returns one
consolidated summary. The span ends at the next planned `/compact` or `/clear`, which the person
types.
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
      (read (fuse c₀ u) u).verdict = .sufficient ∧ Covered c₁ ∧ IsPartition (moves c₁) (cut c₁) ∧
      relayAt c₁ = none ∧ t = respond c₁

The run ends without a method on the person's word only through their `withdraw`.
theorem withdrawn_by_person (respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (c₁ : Context P) (h : conduct respond c us = .withdrawn c₁) :
    ∃ (c₀ : Context P) (u : Utterance P), c₁ = observe (fuse c₀ u) ∧
      (read (fuse c₀ u) u).verdict = .withdraw

Another protocol is taken up only where the person named it.
theorem routed_by_person (respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (t : String) (c₁ : Context P)
    (h : conduct respond c us = .routed t c₁) :
    ∃ (c₀ : Context P) (u : Utterance P), c₁ = observe (fuse c₀ u) ∧
      (read (fuse c₀ u) u).verdict = .route t

A person's `withdraw` is read before your relay test.
theorem withdraw_precedes_relay (respond : Context P → Response P) (c : Context P)
    (u : Utterance P) (us : List (Utterance P)) (h : (read (fuse c u) u).verdict = .withdraw) :
    conduct respond c (u :: us) = .withdrawn (observe (fuse c u))

A `sufficient` judged not covered does not close: the run continues with your next response
appended, which `.map` requires to be the map drawn again.
theorem uncovered_redraws (respond : Context P → Response P) (c : Context P) (u : Utterance P)
    (us : List (Utterance P)) (hs : (read (fuse c u) u).verdict = .sufficient)
    (hr : relayAt (observe (fuse c u)) = none) (hn : ¬ Covered (observe (fuse c u))) :
    conduct respond c (u :: us) =
      conduct respond (observe (fuse c u) ++ [(respond (observe (fuse c u))).val]) us
-/

/-! ── CONVERGENCE ──
conducted(WP): the method handed off on the person's covered `sufficient`, after the conduct
trace reached them. Convergence evidence, before the dispatch: the full state to be taken, every
entry with who proposed it — the draft or the person — recorded apart from how it came into
force; the move set and the cut, each set by the person's statement (named or edited) or adopted
from the draft; for each move, who proposed it, its region, and its slot under the resolved
order; for each slot, (slot → the value the person set), (slot → the draft's value → its ground
→ adopted on closure), or (slot → `defaultValue` → nothing grounded a preference → adopted on
closure) — three different facts, never flattened; the feasibility of every region, an
unobserved one said to be unobserved; the span annotations, an empty set shown as empty; every
checkpoint with its compiled brief; and the trace contract — every adoption, degradation,
coverage cap, and termination ground, a `resolutionRequired` ground shown with its resolver and
marked unroutable where that resolver cannot reach the region before its stop is wanted, the
basis shown with it. The dissent attached to the method is shown beside it. Any tally is read
off the rows shown. What the closing utterance itself changed is shown first, as a ledger, as
every other answer's change is. Demonstrated, not asserted.
-/

/-!
What the person set is the method's value and is recorded as theirs; whether a decision made
before an upstream change still reaches the slot is the judgment `reach` makes, and a decision it
leaves unclear keeps the slot open and named rather than handing it to the draft.
theorem person_value_taken (c : Context P) (s : Slot) (v : SlotVal s) (i : Nat)
    (h : slotState c s = .set v i) : (method c).topology s = v

theorem person_value_recorded (c : Context P) (s : Slot) (h : (slotState c s).isSet = true) :
    adoption c s = .set

What the person said is read once: whatever follows — your maps, observations, their later turns
— never reads an earlier turn again, and your own turns say nothing.
theorem earlier_turns_never_reread (c t : Context P) : ∃ more, said (c ++ t) = said c ++ more

theorem responses_say_nothing (c : Context P) (r : Response P) : said (c ++ [r.val]) = said c

Every reading is of a turn the person sent.
theorem said_by_person (c : Context P) (i : Nat) (x : Reading) (h : (i, x) ∈ said c) :
    ∃ u : Utterance P, c[i]? = some u.val

Who first put an entry forward is read off that turn's origin.
theorem proposer_by_origin (c : Context P) (e : Entry) (t : Turn P)
    (h : c[introducedAt c e]? = some t) (ho : t.origin = .person) : proposer c e = .person

Over a cut that partitions the moves, every move of the method lands in a region.
theorem every_move_placed (c : Context P) (h : IsPartition (moves c) (cut c)) :
    ∀ p ∈ (method c).assignment, p.region.isSome = true

A slot nothing grounded carries the default, whatever else the draft holds.
theorem ungrounded_is_default (c : Context P) (s : Slot) (hs : (slotState c s).isSet = false)
    (hg : (draft c s).ground = none) : take c s = defaultValue s

An emergent termination value declaring `needsStopGround` never leaves its region's ground silent.
theorem emergent_stop_never_silent (e : Emergent)
    (h : ObligationClass.needsStopGround ∈ e.classes) :
    (groundOf (.emergent e)).isSome = true

The pointer travels onto the method unchanged.
theorem pointer_carried (c : Context P) : (method c).pointer = pointer c

The brief travels onto the method: what the work is for, what it hands off, and its span.
theorem brief_carried (c : Context P) : (method c).brief = brief c

A region that owes the synthesis checkpoint has one.
theorem synthesis_checkpoint_registered (c : Context P) (rs : List Region) (r : Region)
    (hr : r ∈ rs) (h : owesSynthesis c r = true) :
    ∃ k ∈ checkpoints c rs, k.region = r ∧ k.decision = .synthesisOutputShape

A realizability verdict is filled only by an observation.
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
  | .map                => (.extension, "TextPresent+Proceed: the whole map on one sheet, which is the full state taking it as is would take — the brief first; the moves as a named, indented outline under their regions, each line an id with its short everyday name in place, `after` naming what it follows, and whether the draft or the person put it there; ASCII links drawn only where a move joins more than one predecessor, placement held from turn to turn; the slot values as a table, region by axis, each cell marked you or draft and a changed cell written old → new; each value the person set marked as theirs, every other value with its ground, every named alternative, the emergent affordance, the composition affordance on reconciliation, and the differential that most changes the plan; each region's observed realizability or that it is unobserved; your contrary grounds; after an answer, the change ledger — the person's edits first, then each value the draft re-filled because of them, pointing to the edit that caused it, written changed input → affected slot → consequence and marked a necessary consequence or your proposal; a removed move and a replaced value stay in the ledger")
  | .mapGate            => (.constitution, "present: what the map got wrong, anywhere on it — or sufficient to take the method as shown, withdraw, or another protocol by name; silence holds and takes nothing")
  | .withdrawal         => (.extension, "TextPresent+Proceed: on the person's withdraw, what stood — the map as last shown — reported with nothing handed off")
  | .routeExit          => (.extension, "TextPresent+Proceed: on the person's named protocol, proceed to it citing their words; its Constitution gates fire unchanged")
  | .settle             => (.sense, "Internal analysis: on a covered sufficient, each value the method takes with who proposed it and, apart from that, how it came into force — set by the person, adopted on closure with the draft's ground, or adopted as the default — and the move placements and checkpoints it induces")
  | .compileBriefs      => (.sense, "Internal analysis: for every checkpoint, the decision-typed brief compiled from the topology and move set taken — structure, never a copy of execution content — marked advisory where an observed infeasibility reaches the checkpoint itself")
  | .assembleTrace      => (.sense, "Internal analysis: the trace contract — the moves' and cut's proposer and standing, every slot's proposer and adoption, degradations, coverage caps, termination grounds — assembled from the method taken; never gated")
  | .surfaceAssignment  => (.extension, "TextPresent+Proceed: every move with its region and its slot under the resolved order")
  | .surfaceAnnotations => (.extension, "TextPresent+Proceed: every span externalization obligation, the empty set surfaced as empty")
  | .surfaceTrace       => (.extension, "TextPresent+Proceed: every adoption, degradation, coverage cap, and termination ground with what it was read against; a resolutionRequired ground with its resolver, marked unroutable where the resolver cannot reach the region before its stop is wanted, with that reading's basis")
  | .surfaceBriefs      => (.extension, "TextPresent+Proceed: each compiled checkpoint brief, an advisory one shown as advisory")
  | .converge           => (.extension, "TextPresent+Proceed: the conduct trace whole before the dispatch — what the closing utterance itself changed, as a ledger; the full state to be taken, each entry with who proposed it apart from how it came into force; placements, per-slot adoptions, feasibility, span annotations, checkpoint briefs, the trace contract, and the dissent attached to the method")
  | .handoff            => (.dispatch, "delegate: after the conduct trace, the ConductedMethod handed to the substrate, which executes it — its fields, never the session context its citations resolve in; when the method has run, the substrate returns one consolidated summary of every region's results to the person; mid-run it returns to the person only at a registered checkpoint, or where execution needs what only the person can supply and no checkpoint anticipated it — a secret or credential, a runtime error it cannot resolve, a deployment handed to runtime — naming what it needs; the span annotations delegate the record and navigation-block production a crossing region owes, and an incoming pointer rides the method unchanged while the record it names stays where its locator names")
  | .seam               => (.extension, "TextPresent+Proceed: at a chain the person declared naming the next protocol, proceed to it citing that source; a composition edge this file declares is offered as a hint, never taken on its own; a region crossing the span wall names no next protocol — its record's producer supplies the navigation block; every Constitution gate inside this protocol and the next fires unchanged")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
-/

end

end Hyphegesis
```

## Mode Activation

`/conduct` is directly invocable. AI-guided activation requires at least two cognitive moves and a genuine fork in their order, independence, reconciliation, termination, or routing; scale and budget alone do not warrant conduction. Method-level planning questions and dependency-bearing staged work are typical triggers. Conduct the method before beginning its object-level moves, while retaining loaded safety boundaries, capability restrictions, and explicit user instructions.

When `/ground` self-grounding returns a Split partition reading, read `references/decompose-recovery.md` before conducting the fan; its frozen `MoveSet` and empty-cell behavior are branch-normative. A Trim reading remains a single `/induce` move and relays there.

## Protocol

### User-facing realization

Present one map of the whole method at activation and again after every answer. Its first line is the work prospect's brief — what the work is for, what it hands off, and its span, from this invocation through the next planned `/compact` or `/clear` (an execution stop instruction bounds the current run without shortening that horizon) — with whether conduction is warranted. Below it are the move set, the region cut with the non-uniformity that grounds it and an affordance to replace it, and every axis·region slot. Prior-session recall indices may seed the moves but never settle them.

Order the candidate moves by salience against the session aim, so confirming them is recognizing the accumulated shape rather than recalling a graph the user no longer holds in view. Lay the slots out most-constrained first — the axis·region whose values most divide the downstream plans leads — and expand opened slots in that same order.

Lay the map out on one sheet. Write the moves as a named, indented outline nested under their regions — each line an id with its short everyday name in place (`M1 audit each PR`) and `after M1` naming what it follows — so no legend has to be looked up. Draw ASCII links only where a move joins more than one predecessor, where a list would have to repeat it; keep every move where it stood last turn. Put the slot values in a table, region by axis, each cell marked `you` or `draft`, with a changed cell written `old → new`; keep labels short, since display width is not character count and a column padded by counting characters breaks. For every slot, show its value, its ground, every named alternative, an emergent-value affordance, the composition affordance on reconciliation, and the differential for the alternative that most changes the plan. Show each region's observed realizability, or say it is unobserved. Where you would set a slot otherwise, doubt the cut, or expect the inventory cannot realize a region, say so with its ground before the gate; a method taken over it carries that dissent. Then ask what is wrong, anywhere on the map, or whether to take it; silence holds and takes nothing.

After an answer, draw the map again from the whole context and put a change ledger under it, so the person checks the change instead of re-reading the map. List the person's own edits first, then each value the draft re-filled because of them, each line pointing to the edit that caused it and written as changed input → affected slot → consequence, marked as a necessary consequence of that edit or as your proposal. A removed move and a replaced value stay in the ledger with what they were. A value the person set stays theirs on the scope they set it for; where the change leaves that scope unclear, name the decision and the slots it may reach, and leave them open. A slot the person opens for a fuller look is expanded in the next map with every value of its axis and each value's differential.

The map is itself the full state that "take it as is" would take: every move, the cut, and every slot carries who proposed it — the draft or the person — and whether the person set it, so a `draft` mark reads as "adopted if you take the map now". Take the method only when every value it takes was shown that way, with its ground, its region's realizability, and your contrary grounds; otherwise draw the map again. The closing record keeps who proposed each entry apart from how it came into force — set by the person, or adopted on closure. On a withdrawal, report what stood and hand nothing off.

A region routed back to the person does not pause the run: its result goes into the one consolidated summary returned when the whole method has run. The run returns to the person mid-way only at a checkpoint or where execution needs what only the person can supply — a secret or credential to set, a runtime error it cannot resolve, a deployment handed to runtime. Register such a need as a checkpoint before the move that needs it when the plan can see it coming; one it cannot is the substrate's to bring back, naming what it needs. On a protocol the person names, go to it citing their words. Read `references/round-composition.md` before composing when terminology or wording must remain stable, material belongs to another turn or the trace, or where a sentence sits relative to the gate is in question.

Text injected into the session, the system prompt among it, grounds no realizability verdict: where nothing observed a region's realizability, say it is unobserved. Record infeasibility instead of silently binding an unrealizable substrate. Cross-span routing declares only the durable-record externalization obligation; author-side portability auditing and far-side compile-back remain outside this protocol.

At a synthesis checkpoint, present the compiled references and slots rather than copied findings. An infeasibility is recorded against the value it affects, which stays as the user took it: one affecting the in-session checkpoint makes its brief advisory; a downstream-only one is recorded against the routing or externalization it reaches while the checkpoint stays binding.

## Rules

- **Conduction warrant**: Require a genuinely underdetermined, non-trivial conduct over at least two moves, judged again after every answer. Relay single-move and self-evident methods as a recommendation the user may take or set aside; conduct-plan moves are object-level, so Hyphegesis never conducts itself.
- **Recognition over Recall**: Present genuinely viable options with differential futures and yield at every Constitution interaction. Collapse shared-trajectory candidates before presentation, while preserving the map's yield through which the user constitutes the whole method — brief, moves, cut, and slots together.
- **Round composition**: Use everyday language, place each judgment beside its evidence and next-move implication, and keep analytical context before the gate. Read `references/round-composition.md` when terminology or wording must persist, content belongs to another turn or trace, or placement relative to the gate is in question.
- **Map change shown**: After every answer, show what it changed as a ledger under the current map — the user's edits first, then each re-drafted value pointing to the edit that caused it, marked necessary consequence or proposal. A value the user set stays theirs on its scope; an upstream change that leaves its reach unclear is named and left open, never silently re-drafted.
- **Adoption covered**: Take the method only on the user's `sufficient` over a map that showed every value taken with who proposed it and whether the user set it, its ground, its region's observed realizability, and your contrary grounds. Record who proposed each value apart from how it came into force: set by the user, or adopted on closure.
- **Return at the end**: A region routed back to the user adds its result to the one consolidated summary returned after the method has run; it does not pause execution. The run returns mid-way only at a checkpoint or where execution needs what only the user can supply.
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
