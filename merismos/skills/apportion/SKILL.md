---
name: apportion
description: "Apportion an autonomous goal into execution units carrying their own completion conditions. Type: (GoalPlanUncompiled, User, APPORTION, AutonomousGoal × ExecutionHorizon) → ConditionBearingUnitPlan"
---

# Merismos Protocol

Apportion an autonomous goal into coarse execution units and derive each unit's completion conditions before the run begins: cut the goal at its evidenced seams so each unit fits one execution horizon and no obligation is orphaned, derive per-unit completion and invariant predicates plus the cross-unit plan conditions, and emit one goal entry per unit. Type: `(GoalPlanUncompiled, User, APPORTION, AutonomousGoal × ExecutionHorizon) → ConditionBearingUnitPlan`.

## Definition

**Merismos** (μερισμός: a dividing into parts, an apportionment): A dialogical act of apportioning one stated autonomous goal — deciding **which units the goal is carried out in** and **what each unit's done means** — when the goal is stated but its plan is uncompiled. The protocol's lexical verb is `/apportion`. It reads the goal's obligations — the host's own standing procedural contract subtracted, since that attaches to every change the host accepts whatever the goal is — cuts them into coarse units at seams it can cite, judges each unit against one execution horizon, derives a completion predicate and any invariant predicates per unit, separates the conditions whose subject is the whole goal rather than any one unit, and emits one goal entry per unit whose conditions are conjoined into a single leaf predicate — or, for a unit whose completion condition remains residual, an explicit accepted-uncovered certificate that still carries any compiled invariant conjuncts. An item no check could settle because what settles it is a judgment made against the context accumulated by then and what the user has actually said by then is reserved rather than compiled — recorded with the ground that settles it, at the unit level and for the whole-goal acceptance criterion alike, and kept apart from the waiver that records an acceptance criterion the plan simply lacks. Activation takes one goal: a request bundling several stated outcomes whose only common bond is that standing contract relays at the checkpoint instead, one apportionment per goal. Every goal obligation belongs to some unit or is visibly accounted for, and every unit fits one horizon or carries a recorded override; the MORPHISM block names these and the protocol's other invariants. Merismos apportions and conditions; it does **not** order — sequence, independence, reconciliation, termination topology and routing are outside its own scope, so the emitted plan is a **pre-conduct** artifact. The protocol holds no state during execution.

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
Merismos(G) → apportion(c, utterances), where c is the fused session context:
  Phase 0: Probe(c) — ground the goal's navigation block where one is in scope →
    [no autonomous interval | a composite goal | the handoff unreadable | the plan already
     condition-bearing: relay → report]
  pass(c): ReadObligations — the host's standing contract subtracted, and shown — →
    VelocityFilter → oos → draft the residual whole → surface_draft → the whole-draft relay →
    once the residual is empty: Derive each unit not yet derived ∥ DerivePlan once
  [residual, units, and oos all empty: relay(scope too thin) → report]
  respond: Qu over the draft's first unsettled cut, with the rest of the draft beside it →
    Stop; once the residual is empty: OOS · Reserved notices → Qt while the whole goal carries
    no defined acceptance criterion at pass entry, or none at all → Stop; then StaleNotice →
    Qc with the invariant status and your dissent → Stop
  next utterance u: c' := fuse(c, u) →
    RouteBound at Qt → relay the route to /bound → Rerouted
    Confirm at Qc ∧ the structural invariants hold ∧ acceptance closed → AcceptResiduals →
      Emit → package → park_carrier → record_handoff → converge → ConditionBearingUnitPlan
    Confirm with an invariant violated → Qc again, the violation named
    otherwise → pass(c') → the next presentation: an answer at Qu integrates or recuts; an
      Adjust rederives over the same units; a Reopen returns one unit's obligations to the
      residual and marks the plan conditions stale
  no utterance: the gate holds; nothing is integrated, confirmed, or emitted
-/

/-! ── MORPHISM ──
AutonomousGoal × ExecutionHorizon
  → probe(goal)                        -- detect ONE stated autonomous goal whose unit plan and conditions are uncompiled; a request bundling several stated outcomes bound only by the host's standing procedural contract is composite and relays here rather than activating
  → read_obligations(goal) → O_G       -- the goal's obligations with the host's standing procedural contract subtracted — an ambient invariant every emitted unit inherits — and what was subtracted shown, never silent; G itself remains read-only
  → filter(velocity) → oos             -- an obligation guardable only by pre-action interception is declared out of scope with the delegated substrate recorded on the declaration, before any cut is shaped
  → draft(goal, residual) → D          -- the whole-draft operator: a partition of the residual as it now stands, each cut carrying its own fit and seam verdict; it owns nothing and settles nothing
  → scan(seams)                        -- read the remaining obligations for cuttable seams: dependency, deliverable, verification, ownership, or another the goal evidences
  → pack(seams, horizon) → DraftUnit   -- the irreducible core, part one: apportion the obligations into coarse units that each fit one execution horizon, every obligation landing in some unit; capability requirements and feasibility notes are functional descriptions only
  → fit(unit, horizon) → SpanFit       -- Indeterminate is surfaced, never read as Fits
  → qualify(cut) → Seam                -- Grounded with its citation, or Heuristic declared — never a natural joint asserted
  → complete_unit(draft, fit, seam) → ProposedUnit   -- the sole constructor of a ProposedUnit, run once both judgments exist
  → surface_draft(D)                   -- the whole draft before any cut is settled, with the standing affordance to send any cut back
  → [every cut grounded, a cut that fits and that no second reading contests: relay(AcceptUnit) | else: present(proposed_unit, the draft's still-unsettled cuts)]
  → integrate(unit_judgment, U, residual) → (U', residual')   -- monotone in coverage: an obligation leaves the residual only by entering a unit, which receives its fresh UnitRef
  → derive(unit) → (Set(κ), Set(ρ), Set(σ))    -- the irreducible core, part two: per obligation a verifiable predicate, a residual, or a reservation naming the ground that settles it
  → derive_plan(goal, U) → P           -- conditions whose subject is the whole goal, never distributed across units
  → confirm(unit_plan)                 -- the person judges the apportionment with its conditions; your contrary grounds stand before the gate and ride the plan
  → emit(goal_entries)                 -- one entry per unit carrying resolve_unit's single certificate, one per plan condition, and exactly one envelope
  → package(E)                         -- the returned plan read back from E, never derived beside it
  → park_carrier(plan) → C             -- the packaged plan parked in ONE durable carrier record
  → record_handoff(C) → N              -- the fixed-shape navigation block over that carrier
  → ConditionBearingUnitPlan
requires: user_initiated(G)            -- the person declares autonomous execution intent via /apportion
requires: single_goal(G)               -- ONE stated outcome; shared procedure is not a shared goal
deficit:  GoalPlanUncompiled           -- activation precondition (Layer 1)
preserves: G                           -- compile-time only; the context only grows, and no execution state is touched
invariant: Apportion over Order        -- Merismos cuts the units and conditions them; it does not sequence them
invariant: Whole Draft over Serial Cut -- no cut is settled before the draft it belongs to has been surfaced whole
invariant: Coverage over Convenience   -- every goal obligation belongs to some unit or is visibly delegated out of scope
invariant: Fit over Ambition           -- every unit fits one execution horizon, or entered through the person's OverrideFit over its verdict
invariant: Declared Seam over Asserted Joint  -- every cut declares its seam quality: the evidence it cites, or heuristic
-/

namespace Merismos

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

/-- `G`, `AutonomousGoal`: the one stated outcome and everything the context carries about it —
    the utterance, a prior protocol's output, the session. Nothing here rewrites it. -/
abbrev AutonomousGoal (P : Type) := Context P

/-- **Your reading** of `H`, the `ExecutionHorizon`: the budget one autonomous run is expected to
    fit, read from the context with its cue cited. -/
opaque horizon : Context P → String

/-- A cited piece of material: where it is and what it says. -/
structure Cited where
  source  : String
  content : String

/-- `Obligation`: a stated or inferred requirement the goal must satisfy — the unit of coverage —
    citing its evidence in the goal. -/
structure Obligation where
  statement : String
  evidence  : String
  deriving DecidableEq  -- elab: membership over obligation lists

/-- **Your reading** of the requirements the goal states or implies, before the subtraction. -/
opaque candidates : Context P → List Obligation

/-- **Your judgment** (`host_standing_contract(G, o)`): `o` is goal-independent in the host the
    work is carried out in — the host's standing procedural contract attaches it to every change
    it accepts (its version or manifest discipline, its verification command, its branch,
    worktree, or review path, its merge authority) — and `o` is not itself the outcome the goal
    states. -/
opaque HostStanding : Context P → Obligation → Bool

/-- `O_G`, `ReadObligations`: the candidates with the host's standing contract subtracted. What
    is subtracted is never packed, derived, or counted by coverage: every emitted unit inherits
    it. -/
def obligations (c : Context P) : List Obligation :=
  (candidates c).filter (fun o => !HostStanding c o)

/-- What the subtraction removed. It is shown at Qc and in the trace, so a misjudged subtraction
    is correctable there. -/
def subtracted (c : Context P) : List Obligation := (candidates c).filter (HostStanding c)

/-- `OOSDeclaration`: an obligation whose violation must be caught before an action runs, and the
    substrate that must catch it. A reserved item names no substrate and is never written here. -/
structure OOSDeclaration where
  obligation : Obligation
  substrate  : String
  basis      : Cited

/-- **Your judgment** (`VelocityFilter`): the obligations of `O_G` guardable only by pre-action
    interception, each with its substrate — made before anything is drafted, so none enters a
    unit, and read back from the pass record that made it; a Reopen does not remake it. -/
opaque oos : Context P → List OOSDeclaration

/-- `SpanFit`. -/
inductive SpanFit | fits | overflows | indeterminate
  deriving DecidableEq  -- elab: the fit-indexed answer set compares verdicts

/-- `Seam`: `grounded` cites the seam the goal evidences — a dependency, deliverable,
    verification, or ownership seam, or another the goal actually evidences; `heuristic` is
    declared where the goal carries none. -/
inductive Seam
  | grounded (evidence : Cited)
  | heuristic

/-- `DraftUnit`: what Pack yields before fit and seam are judged. Its obligations are never
    empty — an empty Anchor is Pack's no-cut verdict and carries no draft. Capability requirements
    and feasibility notes are functional descriptions read from the goal's stated needs, never a
    concrete executor, model, runtime, or tool. -/
structure DraftUnit where
  subject      : String
  obligations  : List Obligation
  nonempty     : obligations ≠ []
  capabilities : List String
  feasibility  : List String

/-- `ProposedUnit`: a cut carrying its fit and seam verdicts. -/
structure ProposedUnit extends DraftUnit where
  fit  : SpanFit
  seam : Seam

/-- `complete_unit`: the only constructor of a `ProposedUnit`, run once both judgments exist. -/
def DraftUnit.complete (d : DraftUnit) (f : SpanFit) (s : Seam) : ProposedUnit :=
  { toDraftUnit := d, fit := f, seam := s }

/-- `UnitRef`: assigned at integration and never reused. -/
abbrev UnitRef := Nat

/-- `Unit`: an integrated cut with its `UnitRef`. -/
structure PlanUnit extends ProposedUnit where
  ref : UnitRef

/-- **Your record**, read from the context: the units integrated so far. A cut enters through the
    whole-draft relay, through AcceptUnit or OverrideFit on the cut Qu presented, or through
    Sufficient over the fitting cuts of the draft Qu displayed; each is a cut of a draft the
    context shows surfaced whole, and a unit whose fit is not `fits` entered only through
    OverrideFit. A Reopen takes its unit out. The units hold pairwise disjoint obligations. -/
opaque units : Context P → List PlanUnit

/-- An obligation some unit holds or some out-of-scope declaration names. -/
def covered (c : Context P) (o : Obligation) : Bool :=
  (units c).any (fun u => u.obligations.contains o) || (oos c).any (fun d => d.obligation == o)

/-- The residual: what of `O_G` is still to be cut. Integration is the only way an obligation
    leaves it and Reopen the only way one returns. -/
def residual (c : Context P) : List Obligation := (obligations c).filter (fun o => !covered c o)

/-- `coverage_complete`: every obligation belongs to some unit or is visibly delegated. -/
def coverageComplete (c : Context P) : Bool := (obligations c).all (covered c)

/-- `D` is a partition of the residual: every obligation of it sits in exactly one cut, and no cut
    reaches outside it. -/
def IsPartition (res : List Obligation) (d : List ProposedUnit) : Prop :=
  (∀ o ∈ res, ∃ x ∈ d, o ∈ x.obligations) ∧ (∀ x ∈ d, ∀ o ∈ x.obligations, o ∈ res) ∧
  (d.flatMap (·.obligations)).Nodup

/-- **Your draft** (`draft(G, residual)`): Scan, Pack, fit, qualify, and complete_unit iterated over
    a copy of the residual as it now stands until every obligation sits in a completed cut,
    `autonomous_pack` placing at heuristic seams whatever no seam evidence reached — so
    `IsPartition (residual c) (draft c)`. A recut direction the context holds is drafted under.
    Where a region admits more than one workable cut, draw one and record nothing about the other.
    It owns nothing and settles nothing; the next pass drafts what is left afresh. -/
opaque draft : Context P → List ProposedUnit

/-- **Your judgment** (the option-set relay test, read live at dispatch): no alternative cut of the
    cut's obligations stands up to the same evidence. What it weighs is never a member of the
    draft. -/
opaque Uncontested : Context P → ProposedUnit → Bool

def Seam.isHeuristic : Seam → Bool
  | .heuristic  => true
  | .grounded _ => false

/-- The whole-draft relay test: the relay opens only over a draft whose every cut is grounded, and
    inside it takes a fitting cut no second reading contests. -/
def relays (c : Context P) (x : ProposedUnit) : Bool :=
  !(draft c).any (fun y => y.seam.isHeuristic) && x.fit == .fits && Uncontested c x

/-- The forms `Aᵤ` offers at Qu. -/
inductive UnitForm | acceptUnit | overrideFit | recut | sufficient
  deriving DecidableEq  -- elab: the answer-set theorems compare forms

/-- `Aᵤ`, indexed by the presented cut's fit: AcceptUnit exactly when it fits, OverrideFit
    otherwise; Recut, whose target is any still-unsettled cut of the surfaced draft and whose
    direction the next draft is drawn under; and Sufficient, which integrates every unsettled
    fitting cut of the displayed draft, standing while one remains. -/
def unitOptions (fit : SpanFit) (fittingLeft : Bool) : List UnitForm :=
  (if fit == .fits then [.acceptUnit] else [.overrideFit]) ++ [.recut] ++
    (if fittingLeft then [.sufficient] else [])

inductive PredicateKind | completion | invariant
  deriving DecidableEq  -- elab: the certificate filters on kind

/-- `κ`, `CompiledCondition`: a verifiable predicate — an executable check with a determinate
    pass/fail outcome — for one obligation of its unit. -/
structure Compiled where
  obligation : Obligation
  kind       : PredicateKind
  condition  : String

inductive ResidualDisposition | acceptUncovered | emergent (name : String)
  deriving DecidableEq  -- elab: the certificate filters on disposition

/-- `ρ`, `Residual`: an obligation of its unit with no verifiable predicate, left unguarded;
    `disposition` is none until Confirm accepts it. Where `unit` names a unit, the obligation is
    one of that unit's own. -/
structure Residual where
  obligation  : Obligation
  unit        : Option UnitRef
  kind        : PredicateKind
  disposition : Option ResidualDisposition

/-- `σ` over an obligation of its unit: `judgment_settled` — what settles it is a judgment made
    against the context accumulated by the moment the question comes live and what the person has
    actually said by then, so no compile-time artifact stands in for it. Leaving it open is the
    correct disposition, not a shortfall; `ground` names what settles it. It is neither a residual
    nor an out-of-scope delegation. -/
structure Reservation where
  obligation : Obligation
  kind       : PredicateKind
  ground     : String
  basis      : Cited

/-- What `Derive` yields for one unit. -/
structure Derivation where
  compiled  : List Compiled
  residuals : List Residual
  reserved  : List Reservation
  deriving Inhabited  -- elab: lets `derivation` be declared `opaque`

/-- Every record of `d` names an obligation of `u`: κ and σ bound as ρ is. -/
def Derivation.Bound (u : PlanUnit) (d : Derivation) : Prop :=
  (∀ k ∈ d.compiled, k.obligation ∈ u.obligations) ∧
  (∀ r ∈ d.residuals, r.unit = some u.ref → r.obligation ∈ u.obligations) ∧
  (∀ s ∈ d.reserved, s.obligation ∈ u.obligations)

/-- **Your derivation** for `u` (`Derive`): per obligation a verifiable predicate — completion or
    invariant — a residual, or a reservation; every obligation of `u` lands in at least one, and
    `Derivation.Bound u`. Written once to the pass record and read back from it; an Adjust
    direction rewrites it over the same units — a withdrawn condition becoming a residual, a
    residual re-read as judgment-settled a reservation; a Reopen takes it out with its unit. The
    read is fallible and lands at Qc, where an Adjust can move an item either way. -/
opaque derivation : Context P → PlanUnit → Derivation

def Derivation.derives (d : Derivation) (o : Obligation) : Bool :=
  d.compiled.any (·.obligation == o) || d.residuals.any (·.obligation == o) ||
    d.reserved.any (·.obligation == o)

/-- `obligations_derived`. -/
def obligationsDerived (c : Context P) : Bool :=
  (units c).all (fun u => u.obligations.all (derivation c u).derives)

def hasCompletion (u : PlanUnit) (d : Derivation) : Bool :=
  d.compiled.any (·.kind == .completion) ||
    d.residuals.any (fun r => r.unit == some u.ref && r.kind == .completion) ||
    d.reserved.any (·.kind == .completion)

/-- `termination_covered`: every unit has a completion predicate, a completion residual, or a
    completion reservation. -/
def terminationCovered (c : Context P) : Bool :=
  (units c).all (fun u => hasCompletion u (derivation c u))

abbrev NonEmpty (α : Type) := {l : List α // l ≠ []}

structure LeafConjunct where
  condition : String
  kind      : PredicateKind

/-- `UnitResolution`, the cross-seam termination certificate. `determinate` conjoins every
    compiled condition of the unit. The reserved certificate does not say the unit runs guarded:
    it names the ground that settles the unit's done, and that nobody accepted the gap. -/
inductive UnitResolution
  | determinate       (predicate : List String) (conjuncts : List LeafConjunct)
  | acceptedUncovered (residuals : NonEmpty Obligation) (conjuncts : List LeafConjunct)
  | reservedJudgment  (obligations : NonEmpty Obligation) (conjuncts : List LeafConjunct)

def Derivation.conjuncts (d : Derivation) : List LeafConjunct :=
  d.compiled.map (fun k => ⟨k.condition, k.kind⟩)

def acceptedCompletion (u : PlanUnit) (d : Derivation) : List Obligation :=
  (d.residuals.filter (fun r => r.unit == some u.ref && r.kind == .completion &&
    r.disposition == some .acceptUncovered)).map (·.obligation)

def reservedCompletion (d : Derivation) : List Obligation :=
  (d.reserved.filter (·.kind == .completion)).map (·.obligation)

/-- `resolve_unit`: the arms are tried in this order. A unit with both an accepted completion
    residual and a reserved completion obligation takes the accepted arm, its reservation staying
    visible in the envelope. -/
def resolveUnit (u : PlanUnit) (d : Derivation) : Option UnitResolution :=
  if d.compiled.any (·.kind == .completion) then
    some (.determinate (d.compiled.map (·.condition)) d.conjuncts)
  else match acceptedCompletion u d with
    | o :: os => some (.acceptedUncovered ⟨o :: os, List.cons_ne_nil o os⟩ d.conjuncts)
    | [] => match reservedCompletion d with
      | o :: os => some (.reservedJudgment ⟨o :: os, List.cons_ne_nil o os⟩ d.conjuncts)
      | []      => none

/-- `AcceptResiduals`, on Confirm: every residual accepted as uncovered. The reservations are
    untouched — a reservation is not a residual awaiting acceptance. -/
def Derivation.accept (d : Derivation) : Derivation :=
  { d with residuals := d.residuals.map (fun r => { r with disposition := some .acceptUncovered }) }

inductive PlanScope | finalIntegration | globalNonRegression | wholeGoalAcceptance
  | emergent (name : String)
  deriving DecidableEq  -- elab: binding reads the scope

/-- The predicate of a `PlanStateRequirement`. -/
inductive Requirement
  /-- a condition over a candidate plan, as derived -/
  | stated (check : String)
  /-- `plan_terminal(n)`: the candidate plan has exactly `n` unit resolutions and each holds — a
      determinate predicate holds; an accepted-uncovered witness is non-empty and inside the plan's
      accepted completion residuals, its conjuncts holding; a reserved witness is non-empty and
      inside the plan's reserved completion obligations, its conjuncts holding -/
  | planTerminal (units : Nat)

/-- `PlanStateRequirement`: never without the evidence it rests on. Whether that evidence still
    tracks what it asserts is the receiving side's judgment, not certified here. -/
structure PlanStateRequirement where
  predicate : Requirement
  basis     : NonEmpty Cited

/-- `PlanCondition`: a condition whose subject is the whole goal. -/
structure PlanCondition where
  scope             : PlanScope
  kind              : PredicateKind
  condition         : String
  dischargeableWhen : PlanStateRequirement

/-- **Your derivation** (`DerivePlan`) of the conditions whose subject is the whole goal — final
    integration, global non-regression, a whole-goal invariant, or another scope the goal carries —
    run once and read back from the pass record, rewritten by an Adjust direction, and not
    re-derived on Reopen. A completion criterion for the whole goal is not among them: the goal's
    own statement of one closes `acceptance`. -/
opaque planConditions : Context P → List PlanCondition

/-- The whole-goal acceptance question, closed one of three ways. -/
inductive Acceptance
  /-- a completion criterion for the whole goal: the goal states it, DefineNow defined it, or an
      Adjust direction introduced it -/
  | defined (criterion : String)
  /-- ReserveJudgment: constitutively open — its right answer varies with the context accumulated
      by the moment the goal is judged accepted and with what the person has said by then -/
  | reserved
  /-- ApproveUnbounded: a criterion the plan should have carried is waived -/
  | unbounded

/-- **Your judgment**: the cited statement closes the acceptance question this way. -/
opaque AcceptanceSupported : Context P → Turn P → Acceptance → Prop

/-- Only a person's statement closes the acceptance question: the goal's own statement of a
    criterion, or their answer at Qt or in an Adjust. -/
def acceptanceCoord : Coord P Acceptance :=
  { admits := (· = .utterance), supports := AcceptanceSupported }

-- elab: an open witness lets the occupancy reading below be declared `opaque`.
instance {A : Type} {q : Coord P A} {c : Context P} : Inhabited (Occ q c) := ⟨.open_ none⟩

/-- **Your judgment**: how the latest statement that reached the question closed it; open where
    none has, and where an Adjust withdrew the defined criterion. Each answer revises the one
    before it, so one value stands. -/
opaque acceptance : (c : Context P) → Occ (acceptanceCoord (P := P)) c

def isFilled {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Bool
  | .open_ _   => false
  | .filled .. => true

def filledValue {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Option A
  | .open_ _     => none
  | .filled a .. => some a

def Acceptance.isDefined : Acceptance → Bool
  | .defined _ => true
  | _          => false

def Acceptance.isReserved : Acceptance → Bool
  | .reserved => true
  | _         => false

def Acceptance.isUnbounded : Acceptance → Bool
  | .unbounded => true
  | _          => false

/-- Every whole-goal acceptance requirement is bound to plan-terminal over the current unit
    count: `BindPlanRequirements`, run before every check. -/
def bindPlan (c : Context P) (p : PlanCondition) : PlanCondition :=
  if p.scope == .wholeGoalAcceptance then
    { p with dischargeableWhen := { p.dischargeableWhen with predicate := .planTerminal (units c).length } }
  else p

/-- `plan_condition(d)`: the defined criterion as a completion condition over the whole goal. -/
def acceptanceCondition (c : Context P) : Option PlanCondition :=
  match filledValue (acceptance c) with
  | some (.defined d) =>
    let src : Cited := ⟨"the statement that defined the whole-goal acceptance criterion", d⟩
    some ⟨.wholeGoalAcceptance, .completion, d,
      ⟨.planTerminal (units c).length, ⟨[src], List.cons_ne_nil src []⟩⟩⟩
  | _ => none

/-- `P`, bound. -/
def planOf (c : Context P) : List PlanCondition :=
  ((planConditions c) ++ (acceptanceCondition c).toList).map (bindPlan c)

/-- **Your judgment** (`topology_free`) over a requirement's content: it names no UnitRef, move,
    move region, or order position. A reading over content, not a structural proof. -/
opaque TopologyFree : Context P → PlanStateRequirement → Bool

/-- `InvariantStatus`, computed over the current apportionment and shown at Qc. -/
structure InvariantStatus where
  coverageComplete           : Bool
  terminationCovered         : Bool
  obligationsDerived         : Bool
  oosSubstrateNamed          : Bool
  reservationGroundNamed     : Bool
  planConditionsTopologyFree : Bool

def status (c : Context P) : InvariantStatus :=
  { coverageComplete := coverageComplete c
    terminationCovered := terminationCovered c
    obligationsDerived := obligationsDerived c
    oosSubstrateNamed := (oos c).all (fun d => d.substrate != "")
    reservationGroundNamed := (units c).all (fun u => (derivation c u).reserved.all (·.ground != ""))
    planConditionsTopologyFree := (planOf c).all (fun p => TopologyFree c p.dischargeableWhen) }

/-- The plan may be emitted: the five structural invariants hold and the acceptance question is
    closed. Topology-freedom is your reading over content: shown at Qc, and where you read a
    condition as naming topology and the person confirms, your reading rides the plan as dissent
    rather than refusing the Confirm. -/
def closable (c : Context P) : Bool :=
  let s := status c
  s.coverageComplete && s.terminationCovered && s.obligationsDerived && s.oosSubstrateNamed &&
    s.reservationGroundNamed && isFilled (acceptance c)

/-- **Your reading**: a Reopen in the context postdates the plan conditions' derivation or their
    last Adjust. Surfaced before Qc; only an Adjust clears it, and it forces no re-derivation. -/
opaque Stale : Context P → Bool

/-- **Your reading**: the latest pass entered the condition phase — the apportionment loop just
    emptied the residual, or the latest utterance was an Adjust at Qc. -/
opaque EnteredConditions : Context P → Bool

/-- The gate the next presentation opens. -/
inductive Gate | qu | qt | qc

/-- Qu while the residual holds an unsettled cut; Qt while the acceptance question is open, and at
    every pass entry while no defined criterion stands — a later answer revising an earlier one;
    Qc otherwise. -/
def gate (c : Context P) : Gate :=
  if !(residual c).isEmpty then .qu
  else match filledValue (acceptance c) with
    | none => .qt
    | some a => if EnteredConditions c && !a.isDefined then .qt else .qc

/-- What the fused latest utterance did. Premise: one utterance carries one disposition; silence
    is none of them. -/
inductive Verdict
  /-- anything else: an answer at Qu, another answer at Qt, an Adjust or a Reopen at Qc, or any
      other reading — the next pass reads it whole -/
  | cont
  /-- RouteBound at Qt: the whole-goal acceptance criterion's definition routed to /bound -/
  | routeBound
  /-- Confirm at Qc, taking the plan as Qc showed it -/
  | confirm
  deriving Inhabited  -- elab: lets `verdict` be declared `opaque`

/-- **Your judgment** on the whole latest utterance read with the context. -/
opaque verdict : Context P → Verdict

/-- **Your record**: the contrary grounds you presented before the Qc the Confirm answered — a
    plan condition you read as naming topology, a cut you doubt, a subtraction or a classification
    you would make otherwise — attached to the plan; empty when there were none. -/
opaque dissent : Context P → List String

/-- `ReservedSubject`. -/
inductive ReservedSubject
  | obligation (o : Obligation)
  /-- the whole-goal acceptance criterion itself, which names no obligation -/
  | acceptance

def ReservedSubject.isAcceptance : ReservedSubject → Bool
  | .acceptance   => true
  | .obligation _ => false

/-- `JudgmentReservation` as emitted. -/
structure JudgmentReservation where
  subject : ReservedSubject
  unit    : Option UnitRef
  kind    : PredicateKind
  ground  : String
  basis   : Cited

/-- `acceptance_reservation()`: its ground is fixed by the constructor, the same in every plan that
    reserves the criterion. -/
def acceptanceReservation : JudgmentReservation :=
  { subject := .acceptance, unit := none, kind := .completion,
    ground := "the context accumulated by the moment the goal is judged accepted, together with what the person has actually said by then",
    basis := ⟨"the ReserveJudgment answer at the whole-goal acceptance gate",
      "the criterion's right answer varies with that ground, so fixing it now would settle a live question where the person is not present"⟩ }

structure UnitEntry where
  ref          : UnitRef
  subject      : String
  obligations  : List Obligation
  resolution   : UnitResolution
  capabilities : List String
  feasibility  : List String

structure AcceptedResidualEntry where
  obligation : Obligation
  unit       : Option UnitRef
  kind       : PredicateKind

/-- `PlanEnvelopeEntry`: the reservation set and the waiver flag stay apart, so a reader of the
    emitted plan alone tells a waived criterion from one correctly left open. -/
structure Envelope where
  acceptedResiduals : List AcceptedResidualEntry
  reserved          : List JudgmentReservation
  oos               : List OOSDeclaration
  unboundedApproved : Bool

/-- `E`: one entry per unit, one per plan condition, and exactly one envelope. -/
structure Emission where
  units          : List UnitEntry
  planConditions : List PlanCondition
  envelope       : Envelope

def entry (u : PlanUnit) (r : UnitResolution) : UnitEntry :=
  ⟨u.ref, u.subject, u.obligations, r, u.capabilities, u.feasibility⟩

def envelope (c : Context P) : Envelope :=
  let a := filledValue (acceptance c)
  { acceptedResiduals := (units c).flatMap (fun u =>
      (derivation c u).accept.residuals.map (fun r => ⟨r.obligation, r.unit, r.kind⟩))
    reserved := (units c).flatMap (fun u => (derivation c u).reserved.map (fun s =>
        ⟨.obligation s.obligation, some u.ref, s.kind, s.ground, s.basis⟩)) ++
      (if (a.map Acceptance.isReserved).getD false then [acceptanceReservation] else [])
    oos := oos c
    unboundedApproved := (a.map Acceptance.isUnbounded).getD false }

/-- `Emit`: every unit's entry carries `resolve_unit` over its accepted derivation. -/
def emit (c : Context P) : Emission :=
  { units := (units c).filterMap (fun u => (resolveUnit u (derivation c u).accept).map (entry u))
    planConditions := planOf c
    envelope := envelope c }

/-- `ConditionBearingUnitPlan`, with the dissent the Confirm carried. -/
structure ConditionBearingUnitPlan where
  units             : List UnitEntry
  planConditions    : List PlanCondition
  acceptedResiduals : List AcceptedResidualEntry
  reserved          : List JudgmentReservation
  oos               : List OOSDeclaration
  unboundedApproved : Bool
  dissent           : List String

/-- `package`: the returned plan read back from what was emitted, never derived beside it. -/
def package (e : Emission) (ds : List String) : ConditionBearingUnitPlan :=
  { units := e.units, planConditions := e.planConditions,
    acceptedResiduals := e.envelope.acceptedResiduals, reserved := e.envelope.reserved,
    oos := e.envelope.oos, unboundedApproved := e.envelope.unboundedApproved, dissent := ds }

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

/-- **Your reading**: the navigation block the context supplies — a prior `/apportion` block over
    the goal, or another protocol's; `none` otherwise. -/
opaque pointer : Context P → Option NavigationBlock

/-- **Your reading** at Phase 0: follow the block's dereference instruction at its locator and run
    its grounding instruction; what the carrier returns enters the context as observation.
    Nothing when there is no pointer. -/
opaque groundPointer : Context P → List (Evidence P)

def bindPointer (c : Context P) : Context P := c ++ (groundPointer c).map (·.val)

/-- **Your judgment**: the pointer is unreachable or missing half its locator, or compiling this
    goal needs a premise its record does not support. An unsupported downstream judgment the
    compilation can leave open is not this: it stays reserved. False without a pointer. -/
opaque PointerUnreadable : Context P → Prop

/-- **Your judgment**: an autonomous interval is in scope. -/
opaque AutonomousIntent : Context P → Prop

/-- **Your judgment**, read off what the goal states: one outcome. Several stated outcomes bound
    only by the host's standing procedural contract are a bundle. -/
opaque SingleGoal : Context P → Prop

/-- **Your judgment**, against the plan read back from the carrier the pointer names: its units
    and conditions are already present, every unit closed by a predicate, an accepted residual, or
    a reservation. -/
opaque ConditionBearing : Context P → Prop

/-- **Your record**: the identity the carrier-creating write returned for `C`. -/
opaque carrierRecord : Context P → String

/-- **Your record**: this session's id. -/
opaque sessionId : Context P → String

/-- **Your reading**: what a receiving session needs to know the plan is for. -/
opaque purposeFrame : Context P → String

/-- **Your reading**: a snapshot anchor, only where exact-state determinacy is needed. -/
opaque snapshotAnchor : Context P → Option String

/-- `GroundingInstruction`: the receiving procedure the block carries. -/
def receivingProcedure : String :=
  "Using /inquire where available or an equivalent grounding pass, dereference the carrier and its source session, follow the goal's cited evidence, and recover the current scope and judgment authority from the governing utterances and authorized revisions; preserve those limits through reassignment. Interpret each reservation under the recovered ground, following any further source its subject requires. Stop dependent work when a decision-bearing source is unreachable or a needed premise lacks support-integrity; a coordinator's summary does not substitute for source wording that settles authority. Surface the plan's reservations with their settling grounds. Resolve a live item within an applicable grant, or put its open question to the person retaining that judgment; where its question is still future, keep it open and continue independent work. A reservation supplies no answer, actor assignment, or blanket stop; a coordinator's response or a completed predicate supplies no act reserved to someone else."

/-- `record_handoff`: the block over the carrier `C` — entry points only, never a re-authored plan. -/
def navigation (c : Context P) : NavigationBlock :=
  { purposeFrame := purposeFrame c
    canonicalLocator := ⟨carrierRecord c, sessionId c⟩
    dereferenceInstruction := "read the carrier record at the canonical locator's record identity, within the session it names; one read yields the whole plan"
    snapshotAnchor := snapshotAnchor c
    groundingInstruction := receivingProcedure }

/-- `handoff_recorded`, its structural half: the block locates the carrier, both halves present,
    and states its purpose. That it was presented in the handoff output is the text itself. -/
def HandoffRecorded (n : NavigationBlock) (c : Context P) : Prop :=
  n.purposeFrame ≠ "" ∧ n.canonicalLocator = ⟨carrierRecord c, sessionId c⟩ ∧
    n.canonicalLocator.session ≠ ""

/-- Why the run ends without a plan. -/
inductive RelayKind
  | noAutonomousInterval
  /-- the relay names each stated outcome and the shared-procedure bond; one apportionment per
      goal -/
  | compositeGoal
  | handoffUnreadable
  | conditionBearing
  /-- nothing could be read from the goal's scope -/
  | tooThin

/-- The emitted result: the context after the Phase 3 writes, what was emitted, the plan read
    back from it, and the navigation block over its carrier. -/
structure Apportioned (P : Type) where
  context    : Context P
  emission   : Emission
  plan       : ConditionBearingUnitPlan
  navigation : NavigationBlock

inductive Outcome (P : Type)
  | relayed     (kind : RelayKind) (c : Context P)
  /-- `Rerouted`: the route to /bound is emitted; nothing is claimed as a plan -/
  | rerouted    (c : Context P)
  | apportioned (a : Apportioned P)
  | holding     (c : Context P)

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it. Coverage
partition: the residual, the units' obligations, and the out-of-scope obligations together are
`O_G` at every pass — the residual by construction, the units disjoint as integration keeps them.
The host's standing contract is subtracted before `O_G` exists, and a reservation stays in the
unit it was packed into, so neither is a fourth cell; the draft is phase-local and never one.
Nothing persists into the execution interval.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
A step is one arm of a structural recursion over the person's utterances. A pass is the silent
work: at activation ReadObligations and VelocityFilter; while the residual holds obligations,
the draft of it — each cut through `DraftUnit.complete` — surfaced whole, the whole-draft
relay, and the integrations an answer at Qu made — AcceptUnit or OverrideFit on the presented
cut, Sufficient over the displayed draft's fitting cuts, a Recut drafted under — each
integrated cut with its fresh `UnitRef`; once the residual is empty, Derive for every unit not
yet derived and DerivePlan once, an Adjust's rederivation over the same units, and a Reopen's
return of one unit. `respond` presents `gate c`: Qu with the first
unsettled cut, the cut set, and the draft's still-unsettled cuts beside it, offering
`unitOptions`; Qt; or Qc, after the out-of-scope and reservation notices and the stale notice,
with the apportionment, derived conditions, residuals, reservations with their grounds, the
subtracted obligations, the invariant status with any violation named, and your dissent.
-/

/-- **Your reads** for a pass: ReadObligations' record and artifact reads at activation, Scan's
    seam evidence over the goal's cited substrate while drafting. -/
opaque collect : Context P → List (Evidence P)

/-- **Your record** of a pass, once its reads have entered the context: what the pass above
    read, drafted, relayed, integrated, and derived. `units`, `oos`, `derivation`,
    `planConditions`, and `Stale` are read from these turns. A record grounds nothing. -/
opaque passRecord : Context P → List (Response P)

def pass (c : Context P) : Context P :=
  let c₁ := c ++ (collect c).map (·.val)
  c₁ ++ (passRecord c₁).map (·.val)

/-- **Your action** at Phase 3: the Emit record write of `emit c`, then park_carrier's write of the
    packaged plan into one new carrier record; each returns what it wrote and its identity. -/
opaque persist : Context P → List (Evidence P)

def close (c : Context P) : Apportioned P :=
  let c₃ := c ++ (persist c).map (·.val)
  { context := c₃, emission := emit c, plan := package (emit c) (dissent c),
    navigation := navigation c₃ }

def tooThin (c : Context P) : Bool :=
  (residual c).isEmpty && (units c).isEmpty && (oos c).isEmpty

open Classical in
noncomputable def relayAt (c : Context P) : Option RelayKind :=
  if ¬ AutonomousIntent c then some .noAutonomousInterval
  else if ¬ SingleGoal c then some .compositeGoal
  else if PointerUnreadable c then some .handoffUnreadable
  else if ConditionBearing c then some .conditionBearing
  else none

noncomputable def apportion (respond : Context P → Response P) :
    Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let c' := fuse c u
    match verdict c' with
    | .routeBound => .rerouted c'
    | .confirm =>
      if closable c' then .apportioned (close c')
      else apportion respond (c' ++ [(respond c').val]) us
    | .cont =>
      let c₁ := pass c'
      if tooThin c₁ then .relayed .tooThin c₁
      else apportion respond (c₁ ++ [(respond c₁).val]) us

noncomputable def start (respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  let c₁ := bindPointer c
  match relayAt c₁ with
  | some k => .relayed k c₁
  | none =>
    let c₂ := pass c₁
    if tooThin c₂ then .relayed .tooThin c₂
    else apportion respond (c₂ ++ [(respond c₂).val]) us

/-! ── LOOP ──
Two bounded loops, one per irreducible part. Apportionment (Phase 1): each pass drafts the
residual to closure, surfaces that draft entire, then settles out of it — the relay path opening
only over a draft whose every cut cites a seam the goal evidences, the gate taking the rest one
cut at a time and the draft entire where any cut is heuristic. Inside a pass drafting terminates:
its workset strictly shrinks as each obligation lands in a completed cut. Across passes the
residual strictly shrinks on every AcceptUnit, OverrideFit, relayed cut, and Sufficient; Recut
leaves it unchanged and is bounded by the person, and so is Reopen, the one back-edge from the
condition phase, which returns exactly one unit's obligations. No draft crosses a pass.
Conditions (Phase 2): Qt re-fires at every pass entry while no defined criterion stands, a later
answer revising an earlier one. An Adjust rederives over the same units — every obligation still
lands somewhere — and the plan conditions are re-bound and the status recomputed before Qc
presents again. A Confirm with a structural invariant violated presents Qc again with the
violation named. The run holds no state into the execution interval.
-/

/-!
Silence integrates, confirms, and emits nothing.
theorem silence (respond : Context P → Response P) (c : Context P) :
    apportion respond c [] = .holding c

The plan is emitted only on the person's Confirm, over a closable plan, with your dissent
attached.
theorem apportioned_by_person (respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (a : Apportioned P) (h : apportion respond c us = .apportioned a) :
    ∃ (c₀ : Context P) (u : Utterance P), verdict (fuse c₀ u) = .confirm ∧
      closable (fuse c₀ u) = true ∧ a = close (fuse c₀ u)

The route to /bound is the person's RouteBound.
theorem rerouted_by_person (respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (c₁ : Context P) (h : apportion respond c us = .rerouted c₁) :
    ∃ (c₀ : Context P) (u : Utterance P), c₁ = fuse c₀ u ∧ verdict c₁ = .routeBound

Only a person's statement closes the acceptance question.
theorem acceptance_by_utterance {c : Context P} {s : Cite c}
    (ok : (acceptanceCoord (P := P)).admits s.kind) : s.kind = .utterance

An unfitting cut is never offered AcceptUnit, and a fitting one never OverrideFit.
theorem unfit_offers_no_accept (f : SpanFit) (b : Bool) (h : f ≠ .fits) :
    UnitForm.acceptUnit ∉ unitOptions f b

theorem fit_offers_no_override (b : Bool) : UnitForm.overrideFit ∉ unitOptions .fits b

One heuristic cut sends the whole draft to the gate.
theorem heuristic_sends_whole_draft (c : Context P) (y x : ProposedUnit) (hy : y ∈ draft c)
    (hh : y.seam.isHeuristic = true) : relays c x = false
-/

/-! ── CONVERGENCE ──
apportioned(G): the plan emitted on the person's Confirm, the navigation block over its carrier
presented and `HandoffRecorded` over it. Convergence evidence, at emission: (a) the goal
restated as its units, one plain sentence each; (b) per unit, the obligations covered, the seam with its citation or heuristic
declaration, the fit or the recorded override, the certificate — the conjoined predicate with its
typed conjuncts, an accepted-completion witness, or a reserved-completion witness, each with any
invariant conjuncts — the capability requirements and feasibility notes, and how it settled:
relayed, accepted at the gate, overridden, or under a Sufficient over the displayed draft; (c) the
plan conditions with the requirement that makes each safe to discharge; (d) every accepted
residual, every reservation with the ground that settles it, every out-of-scope obligation with
its substrate, and the obligations subtracted as the host's standing contract; (e) the waiver
with its gate, or the reserved criterion stated as left open on purpose — never both; and the
dissent the plan carries. Demonstrated, not asserted.
-/

/-!
Coverage is complete exactly when the residual is empty.
theorem residual_empty_iff_covered (c : Context P) :
    residual c = [] ↔ coverageComplete c = true

After AcceptResiduals a unit with a completion arm always has its certificate.
theorem resolve_total (u : PlanUnit) (d : Derivation) (h : hasCompletion u d = true) :
    (resolveUnit u d.accept).isSome = true

On a closable plan every unit is certified.
theorem every_unit_certified (c : Context P) (h : closable c = true) (u : PlanUnit)
    (hu : u ∈ units c) : (resolveUnit u (derivation c u).accept).isSome = true

Every unit entry joins exactly one unit's fields and its certificate; no other rides in `E`.
theorem emitted_units_join (c : Context P) (e : UnitEntry) (he : e ∈ (emit c).units) :
    ∃ u ∈ units c, ∃ r, resolveUnit u (derivation c u).accept = some r ∧ e = entry u r

Every whole-goal acceptance requirement is plan-terminal over the current unit count.
theorem acceptance_bound_to_units (c : Context P) (p : PlanCondition) (hp : p ∈ planOf c)
    (hs : p.scope = .wholeGoalAcceptance) :
    p.dischargeableWhen.predicate = .planTerminal (units c).length

The waiver and the reserved criterion never stand together in what is emitted.
theorem waiver_reservation_exclusive (c : Context P) :
    ¬ ((envelope c).unboundedApproved = true ∧
      (envelope c).reserved.any (·.subject.isAcceptance) = true)

The returned plan reads back what was emitted.
theorem plan_reads_back (e : Emission) (ds : List String) :
    (package e ds).units = e.units ∧ (package e ds).planConditions = e.planConditions ∧
      (package e ds).reserved = e.envelope.reserved ∧
      (package e ds).unboundedApproved = e.envelope.unboundedApproved

The navigation block locates the carrier the write returned.
theorem navigation_locates_carrier (c : Context P) :
    (navigation c).canonicalLocator = ⟨carrierRecord c, sessionId c⟩
-/

/-! ── TOOL GROUNDING ── -/
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed

inductive Annot | sense | observe | track | transform | dispatch | constitution | extension

inductive Op | probe | phase0Relay | readObligations | velocityFilter | scan | pack | fit | qualify
             | completeUnit | draft | autonomousPack | surfaceDraft | relay | qu | readAnswer
             | integrate | derive | derivePlan | oosNotice | reservedNotice | qt | routeBound
             | bindPlan | check | staleNotice | qc | acceptResiduals | emit | package
             | parkCarrier | recordHandoff | tooThinRelay | converge | seam

def grounding : Op → Annot × String
  | .probe           => (.observe, "record read, artifact read: autonomous intent, goal singleness, and uncompiled-plan detection over the goal, cue cited. A navigation block in scope is dereferenced — the one carrier at its locator, within the session it names — and its grounding instruction run once; condition-bearing is decided against the plan read back from that carrier. With no block in scope, internal analysis over the goal alone")
  | .phase0Relay     => (.extension, "TextPresent+Proceed: no autonomous interval; a composite goal, naming each stated outcome and the shared-procedure bond; an unreadable handoff — an unreachable carrier, a locator missing a half, or unsupported ground this compilation needs — which never falls through to fresh compilation; or a plan already condition-bearing. No activation")
  | .readObligations => (.observe, "record read, artifact read: O_G read from the goal, the host's standing procedural contract subtracted at the read — never a goal mutation, never an out-of-scope delegation — and what was subtracted kept for Qc and the trace")
  | .velocityFilter  => (.sense, "Internal analysis: the obligations guardable only by pre-action interception, each with its substrate, before any draft")
  | .scan            => (.observe, "artifact read, artifact search: optional seam evidence over the goal's cited substrate; read-only")
  | .pack            => (.sense, "Internal analysis: coarse units fitting one horizon, coverage over the obligations; an empty Anchor is the no-cut verdict; capability requirements and feasibility notes as functional descriptions; one cut drawn where several would do, the other unrecorded")
  | .fit             => (.sense, "Internal analysis: per-cut horizon fit; Indeterminate surfaced, never read as Fits")
  | .qualify         => (.sense, "Internal analysis: the seam's quality — Grounded with its citation, or Heuristic declared")
  | .completeUnit    => (.sense, "Internal analysis: fit and seam written onto the draft unit — the only constructor of a ProposedUnit")
  | .draft           => (.observe, "artifact read, artifact search: the whole-draft pass over a copy of the residual — Scan, Pack, fit, qualify, complete_unit — until every obligation sits in a completed cut; a partition; it owns and settles nothing")
  | .autonomousPack  => (.sense, "Internal analysis: inside a draft pass, what no seam evidence reached packed at Heuristic seams, fit judged and complete_unit run on each; it integrates nothing")
  | .surfaceDraft    => (.extension, "TextPresent+Proceed: the whole draft before any cut is settled — each cut's obligations, fit, and seam with its citation or heuristic declaration — and the standing affordance to send any cut back: Recut for an unsettled one at Qu, Reopen for an integrated one at Qc")
  | .relay           => (.extension, "TextPresent+Proceed: over a draft whose every cut is grounded, each fitting cut no second reading contests accepted without a turn, and reported; Qc still stands before anything is emitted")
  | .qu              => (.constitution, "present: the first unsettled cut with its fit and seam and their basis, the cut set, and the draft's still-unsettled cuts beside it; the answer set indexed by fit — AcceptUnit or OverrideFit, Recut of any unsettled cut under a direction, and Sufficient while a fitting unsettled cut remains")
  | .readAnswer      => (.sense, "Internal analysis: the latest utterance read whole with the context — the verdict, an answer at Qu, Qt, or Qc, a direction, and anything else it says the next pass reads")
  | .integrate       => (.sense, "Internal analysis: an accepted cut entered as a unit with a fresh UnitRef; its obligations leave the residual. How it was settled is reported in the trace, read from the context")
  | .derive          => (.sense, "Internal analysis: per unit not yet derived, per obligation a completion or invariant predicate, a residual, or — where a live judgment settles it — a reservation with its ground; an Adjust rederives over the same units")
  | .derivePlan      => (.sense, "Internal analysis: the conditions whose subject is the whole goal, once per apportionment; a completion criterion the goal states closes the acceptance question citing that statement")
  | .oosNotice       => (.extension, "TextPresent+Proceed: each out-of-scope obligation with its delegated substrate")
  | .reservedNotice  => (.extension, "TextPresent+Proceed: each reservation with the ground that settles it, stated as correctly left open rather than as a shortfall")
  | .qt              => (.constitution, "present: the whole goal has no defined acceptance criterion — define it now, route its definition to /bound, reserve it as constitutively open, or proceed unbounded on record; reserving and proceeding unbounded assert opposite things, and each later answer revises the one before")
  | .routeBound      => (.extension, "TextPresent+Proceed: the route to /bound emitted, naming the whole-goal acceptance criterion as what it is to define; no plan is claimed")
  | .bindPlan        => (.sense, "Internal analysis: every whole-goal acceptance requirement bound to plan-terminal over the current unit count, before every check")
  | .check           => (.sense, "Internal analysis: the invariant status over the current apportionment — coverage, termination, derivation, substrates named, grounds named — and your reading of each plan condition's topology-freedom")
  | .staleNotice     => (.extension, "TextPresent+Proceed: plan conditions derived or last adjusted against a unit set a later Reopen changed; Adjust to update, or Confirm as recorded")
  | .qc              => (.constitution, "present: the apportionment, derived conditions, residuals, reservations with their grounds, out-of-scope obligations, the subtracted obligations, the invariant status with any violation named, and your dissent — a condition you read as naming topology among it — before the question: Confirm, Adjust, or Reopen")
  | .acceptResiduals => (.sense, "Internal analysis: on Confirm, every residual accepted as uncovered — the witness the accepted certificate reads; reservations untouched")
  | .emit            => (.track, "record: one entry per unit with its single certificate and its capability requirements and feasibility notes, one per plan condition, and exactly one envelope — the accepted residuals, the reservation set, the out-of-scope set, and the waiver flag kept apart")
  | .package         => (.sense, "Internal analysis: the returned plan read back from the emitted entries, with the dissent the Confirm carried")
  | .parkCarrier     => (.track, "record: the packaged plan written into one new carrier record, whose write returns its identity")
  | .recordHandoff   => (.extension, "TextPresent+Proceed: the navigation block over the carrier — purpose, locator with both halves, dereference instruction, snapshot anchor only where needed, and the receiving procedure; entry points only")
  | .tooThinRelay    => (.extension, "TextPresent+Proceed: nothing could be read from the goal's scope — no unit, no out-of-scope declaration; no plan is emitted")
  | .converge        => (.extension, "TextPresent+Proceed: the apportionment trace after the navigation block")
  | .seam            => (.extension, "TextPresent+Proceed: at a user-declared chain naming the next protocol, proceed to it citing that source; a composition edge this file declares — /bound or /conduct into /apportion, /apportion into /conduct — is offered as a hint, never taken on its own; the edge to predicate enforcement needs its own activation; every Constitution gate here and in the next protocol fires unchanged")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
Two-way advisory with /conduct, neither direction a precondition, both guarded against reentry.
The receiving session runs the block's grounding instruction against the work at hand; the
emission supplies no answer to a reserved judgment.
-/

end Merismos
```

## Core Principle

Merismos compiles one autonomous goal into coarse, horizon-fit units and the conditions by which each unit is done. It apportions and conditions; order, independence, reconciliation, termination topology, routing, and execution belong downstream. The current residual is drafted and shown as one whole before any cut is settled, so coverage, fit, and seam quality remain inspectable together.

## Substrate Boundary

Merismos stops after emitting and parking the condition-bearing plan. Units carry functional capability requirements and feasibility notes; predicate enforcement, pre-action interception, workflow control, and concrete executor binding belong to the consuming substrate.

## Mode Activation

### Activation

`/apportion` is user-initiated. Activate only for one stated autonomous goal with no condition-bearing unit plan. A host requirement that applies to every accepted change is inherited by every unit and is excluded from the goal's obligation set unless the goal itself states it as an outcome.

Read prior protocol output first, then explicit arguments, then conversation context. A boundary map or an unresolved autonomous region may ground a fresh apportionment; an existing `/apportion` result is condition-bearing when its carrier closes every unit by predicate, accepted residual, or reservation.

### Activation exceptions

Relay and deactivate when there is no autonomous interval, the request bundles several outcomes held together only by the host's standing procedure, the goal is already condition-bearing, or its scope yields neither a unit nor an out-of-scope declaration. A present navigation block that cannot be dereferenced, lacks its session half, or leaves a premise required for current compilation unsupported is an unreadable handoff and never falls through to fresh compilation. Unsupported downstream judgments remain open under the incoming grounding instruction while independent compilation can continue.

## Protocol

### User-facing realization

In Phase 1, render the whole current draft in everyday language: each cut beside its obligations, horizon-fit verdict, seam citation or heuristic disposition, and the affordance to send any unsettled cut back. Keep every contested cut beside the still-unsettled draft it was cut against. In Phase 2, render each unit beside its conditions, residuals, reservations, out-of-scope declarations, the obligations subtracted as the host's standing contract, and current invariant status before opening the confirmation gate. Where you read a plan condition as naming topology, doubt a cut, or would classify or subtract an obligation otherwise, say so with its ground before that gate; a plan confirmed over it carries that dissent.

A completion condition is an executable stop-time predicate; an invariant condition is a boundary the interval preserves while completing. An obligation that could become a predicate after sharpening is a residual. An item only live judgment can settle is a reservation carrying the ground that will settle it. An obligation requiring interception before action is out of scope and names the substrate that must intercept it.

On emission, show the unit's single resolution certificate with its typed conjuncts: determinate predicate, accepted-uncovered witness, or reserved-judgment witness. Keep reservations and the whole-goal acceptance waiver visibly separate. Park the packaged plan in one durable carrier and emit a navigation block that points to it; a receiving session dereferences that carrier, runs `/inquire` where available or an equivalent grounding pass, and reads the governing utterances to recover each reservation's retained or entrusted judgment. A live question is resolved within its applicable grant or surfaced to the person retaining it; a future question stays open while independent work proceeds.

Read `references/round-composition.md` before composing when terminology must remain stable, wording must travel unchanged, material belongs to another round or trace, or phase order determines placement.

## Composition

A non-trivial multi-unit plan may pass to `/conduct` as a navigation block over its parked carrier; an unresolved autonomous region from `/conduct` may pass here for apportionment. Both directions are advisory and guarded against re-entry: a user-declared chain moves along them, while an edge this file declares is offered only as a hint. `/bound` may supply an upstream boundary map. Predicate enforcement begins only through a separate user activation after Merismos emits.

## Known Limitations

Goal singleness, the host-contract subtraction, seam quality, horizon fit, the residual-versus-reservation classification, and a plan condition's topology-freedom are contextual judgments rather than proofs. They remain correctable at their gates; the formal invariants certify the resulting plan structure, not the infallibility of those readings.

## Rules

- **Separate activation**: Emission completes the epistemic work. Starting the autonomous interval is a separate constitutive act by the user.
- **No-reentry across the `/conduct` seam**: Carry the parked plan by navigation block rather than copying it. Fixed topology is not re-conducted, and a trivial unit arrangement bypasses `/conduct`.
- **Round composition**: Compose each round so the reader can act on it without reassembling it — everyday language rather than this file's formal vocabulary, the judgment set beside the evidence it rests on together with the differential implication that matters for the next move, and analytical context laid out before a gate rather than inside it. Read `references/round-composition.md` before composing when a term's rendering has to hold across the session or wording has to be carried through unchanged, when some of what is in view belongs to a later round or a trace rather than this one, or when this protocol's own phases bear on where a sentence sits relative to a gate.
- **Convergence evidence**: Before deactivation, present the plan readback; each unit's obligations, seam, fit, settlement, certificate, capabilities, and feasibility; plan conditions; accepted residuals; reservations with their settling grounds; out-of-scope declarations with substrates; the obligations subtracted as the host's standing contract; acceptance disposition; the dissent the plan carries; and the navigation block over the parked carrier.
- **Whole-draft relay test**: Relay settling opens only when every cut cites a seam the goal evidences. Inside it, accept a fitting cut only when no alternative cut of that region stands on equally live evidence; otherwise preserve the constitutive gate.
- **Fit-indexed answer set**: Present the `Aᵤ` coproduct instantiated by the cut's fit verdict. `Sufficient` remains available only while it can integrate a displayed, still-unsettled fitting cut.
- **Whole-goal acceptance**: When the plan lacks a completion-kind whole-goal acceptance condition, surface the gap before `Qc` and obtain one typed `Vₜ` answer. A defined condition, a reservation, and an unbounded waiver are mutually exclusive recorded states.
- **Back-edge state preservation**: `Reopen(u)` resets only `u`'s obligations and derived unit state. Other units and plan-level state survive; the plan conditions are marked stale and surfaced before confirmation.
- **Host contract subtraction**: Exclude goal-independent host procedure from `O_G`; it is inherited process, not an out-of-scope obligation. A requirement the goal states as its own outcome remains in scope. Show what was subtracted at the confirmation gate and in the trace, so a misjudged subtraction stays correctable.
- **One goal per apportionment**: A composite request relays its constituent outcomes and their shared-procedure bond; each outcome requires its own apportionment.
- **Reservation disposition**: Reserve an item only live judgment can settle, record the ground that settles it, and surface the classification for correction. A reservation is neither an accepted residual nor a delegated pre-action obligation.
- **Reservation is not waiver**: Reserved acceptance records a deliberately open criterion; unbounded approval records an accepted shortfall. Emission carries at most one, and defining a real acceptance criterion retracts either.
- **Form feedback**: Silence about form is not evidence about form. Too dense fails quietly — the reader skims, answers past it, stops — while too plain fails out loud, so the complaints that arrive come from one side only. Density therefore does not carry over from the previous round: each round takes it from what this request asked for, while a statement about form does carry over until it is countermanded. Read an instruction about form for the parts of a round it reaches, not for what kind of reaction it is — a complaint, a request, a symptom report and a bare preference are one input here, and sorting them by kind yields nothing the reach reading does not already give while costing a clause per kind. Change the form rather than asking which form they want; naming one is the recall this discipline exists to remove. What such an instruction reaches is whatever the active protocol leaves open in how a round is composed — its density, its ordering, its length. What it does not reach is whatever is already fixed for this round elsewhere: content the protocol requires, wording carried verbatim, an order it presents in, a cadence it caps, a turn boundary it sets. Those stay in place, and the layer that fixed them is what states why. Say in one line what changed; where the instruction overlapped something that stays, say in one line that it stays and why — that second line is owed by the overlap, not by how the instruction was worded.
- **Whole draft before settlement**: Surface one complete partition of the current residual, with one cut per obligation and the standing affordance to return any cut, before relay or Constitution settles a cut. `Sufficient` accepts only the fitting remainder of that displayed draft.
