---
name: apportion
description: "One goal is about to be handed to an autonomous run: cut it into units that each fit one stretch of the run and carry their own conditions for when they are done."
---

# Merismos Protocol

Apportion an autonomous goal into coarse execution units and derive each unit's completion conditions before the run begins: cut the goal at its evidenced seams so each unit fits one execution horizon and no obligation is orphaned, derive per-unit completion and invariant predicates plus the cross-unit plan conditions, show the authority the unattended run will need, and on the person's taking emit one goal entry per unit and hand the plan to the run with its obligations. Type: `(GoalPlanUncompiled, User, APPORTION, AutonomousGoal × ExecutionHorizon) → ConditionBearingUnitPlan`.

## Definition

**Merismos** (μερισμός: a dividing into parts, an apportionment): A dialogical act of apportioning one stated autonomous goal — deciding **which units the goal is carried out in** and **what each unit's done means** — when the goal is stated but its plan is uncompiled. The protocol's lexical verb is `/apportion`. It reads the goal's obligations — the host's own standing procedural contract subtracted, since that attaches to every change the host accepts whatever the goal is — cuts them into coarse units at seams it can cite, judges each unit against one execution horizon, derives a completion predicate and any invariant predicates per unit, separates the conditions whose subject is the whole goal rather than any one unit, and shows the whole plan on one sheet every turn, beside what the person's last turn changed. An item no check could settle because what settles it is a judgment made against the context accumulated by then and what the person has actually said by then is reserved rather than compiled — recorded with the ground that settles it, at the unit level and for the whole-goal acceptance criterion alike, and kept apart from the waiver that records an acceptance criterion the plan simply lacks. Each unit's certificate carries every compiled check, every accepted gap, and every reservation of its done together, so no one of them hides another. Because the run proceeds without the person, the sheet also shows the authority it will reach — each by kind, target, and limit — so the person grants it before they leave, and what stays unclear comes back at the end. One apportionment takes one goal: where a request bundles several stated outcomes whose only common bond is that standing contract, the sheet names each and asks which goal this apportionment takes. Once it has run, the person can say: this goal runs in these units, each done when these checks pass; what no check settles, what only I decide, and what the run may not do without me, I saw on one sheet; I settled before leaving what had to be settled, and the rest comes back to me once at the end with what did not proceed because of it; I took this plan as mine. Your contrary grounds — each with what it bears on and what it rests on — stand before the person and ride the plan when they take it over them; only the person's taking closes the run, and a person who stops or turns to other work leaves it holding. On the taking, the plan is handed to the autonomous run with the obligations its Rule "Handoff carries its obligations" names. Merismos apportions and conditions; it does **not** arrange — sequence, independence, reconciliation, and termination topology stay outside its own scope. The protocol holds no state during execution.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract.
-/

/-! ── FLOW ──
Merismos(G) → start(c) → apportion(c, utterances), where c is the fused session context:
  start: ground the goal's navigation block where one is in scope →
    [the handoff unreadable | the plan already condition-bearing: relay → report]
  pass(c): read what the goal needs — its obligations, the host's standing contract subtracted,
    the out-of-scope ones set apart, seam evidence, the authority the run will reach — then judge
    the whole plan afresh against the context as it now stands: the units, each unit's fit and
    seam, each unit's conditions, the whole-goal conditions, the acceptance question, the grant,
    and how each value came to stand → record
  [nothing could be read from the goal's scope: relay(too thin) → report]
  present the whole plan on one sheet, the ledger of what changed since the sheet the person
    answered, your doubts beside what each bears on, and one focus with concrete actions → Stop
  next utterance u: c₁ := pass(fuse(c, u)) →
    [the person takes the plan ∧ it is closable]         emit → park the carrier → record the
      block → [the block records the carrier: hand off to the run → apportioned | the write came
       back incomplete: the sheet again, the failure shown, nothing closed]
    [the person takes the plan ∧ it is not closable]     the sheet again, saying the taking did
      not close and what stands in the way → Stop
    [otherwise] the sheet again, with the ledger → Stop
  no utterance, or the person stops or turns to other work: the sheet holds; nothing is taken,
    and nothing is emitted
  after the handoff: the run executes the plan as the Rule "Handoff carries its obligations"
    names; this protocol holds nothing of it.
-/

/-! ── MORPHISM ──
AutonomousGoal × ExecutionHorizon
  → probe(goal)                        -- the stated autonomous goal whose unit plan is uncompiled; a bundle bound only by the host's standing procedural contract is a scope question on the first sheet
  → read_obligations(goal) → O_G       -- the goal's obligations with the host's standing contract subtracted — an ambient invariant every unit inherits — and what was subtracted shown on the sheet
  → filter(velocity) → oos             -- an obligation guardable only by pre-action interception is set out of scope with the substrate that must catch it
  → cut(O_G \ oos, horizon) → units    -- the irreducible core, part one: coarse units, each fitting one execution horizon, together a partition of what is in scope; each cut declares its seam and its fit
  → derive(unit) → certificate         -- the irreducible core, part two: per obligation a verifiable predicate, a residual left unguarded, or a reservation naming the ground that settles it
  → derive_plan(goal, units) → P       -- conditions whose subject is the whole goal, never distributed across units, none naming an order
  → authority(goal, units)             -- what the unattended run will reach that needs the person's authority, by kind, target, and limit
  → sheet(plan, ledger, dissent, focus)  -- the whole plan every turn, every change since the sheet the person answered, your doubts, and one focus
  → take(person)                       -- the person takes the plan with everything it holds in view; that taking adopts what the draft proposed, the authority shown included, and accepts the residuals shown
  → emit(goal_entries) → package → park_carrier → record_handoff → handoff(run)
  → ConditionBearingUnitPlan
requires: user_initiated(G)            -- the person declares autonomous execution intent via /apportion
requires: single_goal(G)               -- ONE stated outcome; shared procedure is not a shared goal, and a bundle is settled on the sheet
deficit:  GoalPlanUncompiled           -- activation precondition (Layer 1)
preserves: G                           -- compile-time only; the context only grows (pass_extends), and no execution state is touched
invariant: Apportion over Order        -- Merismos cuts the units and conditions them; it does not sequence or arrange them
invariant: Whole Plan over Serial Cut  -- nothing is taken before the plan it belongs to has been shown whole
invariant: Coverage over Convenience   -- every goal obligation belongs to some unit or is visibly set out of scope
invariant: Fit over Ambition           -- every unit fits one execution horizon, or the person took it over its verdict (unfit_needs_person)
invariant: Declared Seam over Asserted Joint  -- every cut declares its seam: the evidence it cites, or heuristic
invariant: the person takes and closes; your judgments stand as proposals and contrary grounds
invariant: Handoff carries its obligations  -- what rests on the person comes back once at the end, never decided for them
-/

namespace Merismos

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

/-- `G`, `AutonomousGoal`: the one stated outcome and everything the context carries about it —
    the utterance, a prior protocol's output, the session. Nothing here rewrites it. -/
abbrev AutonomousGoal (P : Type) := Context P

/-- **Your reading** of `H`, the `ExecutionHorizon`: the budget one autonomous run is expected to
    fit, read from the context as it now stands, with its cue cited. -/
axiom horizon : Context P → String

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

/-- **Your reading** of the requirements the goal states or implies, before the subtraction, read
    afresh on every pass: a later turn can add one, narrow one, or take one back. -/
axiom candidates : Context P → List Obligation

/-- **Your judgment** (`host_standing_contract(G, o)`): `o` is goal-independent in the host the
    work is carried out in — the host's standing procedural contract attaches it to every change
    it accepts (its version or manifest discipline, its verification command, its branch,
    worktree, or review path, its merge authority) — and `o` is not itself the outcome the goal
    states. Read against the context as it now stands; a person's turn that says otherwise moves
    it. -/
axiom HostStanding : Context P → Obligation → Bool

/-- `O_G`: the candidates with the host's standing contract subtracted. What is subtracted is never
    cut, derived, or counted by coverage: every emitted unit inherits it. -/
def obligations (c : Context P) : List Obligation :=
  (candidates c).filter (fun o => !HostStanding c o)

/-- What the subtraction removed. It stands on the sheet and in the plan, so a misjudged
    subtraction is correctable. -/
def subtracted (c : Context P) : List Obligation := (candidates c).filter (HostStanding c)

/-- `OOSDeclaration`: an obligation whose violation must be caught before an action runs, and the
    substrate that must catch it. A reserved item names no substrate and is never written here. -/
structure OOSDeclaration where
  obligation : Obligation
  substrate  : String
  basis      : Cited

/-- **Your judgment** (`VelocityFilter`): the obligations of `O_G` guardable only by pre-action
    interception, each with its substrate — judged afresh on every pass, since a changed context
    can change what only interception can guard. -/
axiom oos : Context P → List OOSDeclaration

inductive SpanFit | fits | overflows | indeterminate
  deriving DecidableEq  -- elab: the fit check compares verdicts

/-- `Seam`: `grounded` cites the seam the goal evidences — a dependency, deliverable,
    verification, or ownership seam, or another the goal actually evidences; `heuristic` is
    declared where the goal carries none. -/
inductive Seam
  | grounded (evidence : Cited)
  | heuristic

/-- A unit of the plan: what it is about, the obligations it owns — never none — its horizon fit,
    its declared seam, and what carrying it out requires. Capability requirements and feasibility
    notes are functional descriptions read from the goal's stated needs, never a concrete
    executor, model, runtime, or tool. A unit carries no identity across turns: whether a unit on
    this sheet is one on an earlier sheet is your reading of the context, and the ledger says what
    became of each. -/
structure PlanUnit where
  subject      : String
  obligations  : List Obligation
  nonempty     : obligations ≠ []
  fit          : SpanFit
  seam         : Seam
  capabilities : List String
  feasibility  : List String

/-- **Your judgment**, made afresh on every pass: the units the plan holds as the context now
    stands — what a person's turn set, on the scope their words reach, and your draft for the rest.
    Together they partition `O_G` less the out-of-scope obligations: each obligation in exactly one
    unit. Where a region admits more than one workable cut, draw one; a second cut that the goal's
    evidence backs as well is a contrary ground you show, never a second unit. -/
axiom units : Context P → List PlanUnit

/-- An obligation some unit holds or some out-of-scope declaration names. -/
def covered (c : Context P) (o : Obligation) : Bool :=
  (units c).any (fun u => u.obligations.contains o) || (oos c).any (fun d => d.obligation == o)

/-- What of `O_G` no unit holds and nothing sets out of scope: a hole in the plan, shown on the
    sheet, and a plan with one is not taken. -/
def residual (c : Context P) : List Obligation := (obligations c).filter (fun o => !covered c o)

/-- `coverage_complete`. -/
def coverageComplete (c : Context P) : Bool := (obligations c).all (covered c)

/-- The units and the out-of-scope declarations partition what they hold: no obligation sits in two
    units, or in a unit and out of scope, and nothing they hold lies outside `O_G`. -/
def partitioned (c : Context P) : Bool :=
  decide (((units c).flatMap (·.obligations) ++ (oos c).map (·.obligation)).Nodup) &&
    (units c).all (fun u => u.obligations.all (obligations c).contains) &&
    (oos c).all (fun d => (obligations c).contains d.obligation)

/-- What the person's turn took a unit with, over a fit verdict that is not `fits`: the reason, and
    for an `indeterminate` verdict the uncertainty named. -/
abbrev Override := String

/-- **Your judgment**: the cited turn takes `u` over its fit verdict. A turn that takes the whole
    plan covers it where the verdict and your contrary ground were in view on the sheet it
    answered; an `indeterminate` verdict is covered only by words that name the uncertainty. -/
axiom OverrideSupported : PlanUnit → Context P → Turn P → Override → Prop

/-- A unit that does not fit is taken only by the person's turn. -/
def overrideCoord (u : PlanUnit) : Coord P Override :=
  { admits := (·.val = .person), supports := OverrideSupported u }

/-- **Your reading**: the person's taking of `u` over its fit; `open_` until one reaches it. -/
axiom override : (c : Context P) → (u : PlanUnit) → Occ (overrideCoord (P := P) u) c

def isFilled {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Bool
  | .open_ _   => false
  | .filled .. => true

def filledValue {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Option A
  | .open_ _     => none
  | .filled a .. => some a

/-- Every unit fits, or the person took it over its verdict. -/
def fitSettled (c : Context P) : Bool :=
  (units c).all (fun u => u.fit == .fits || isFilled (override c u))

inductive PredicateKind | completion | invariant
  deriving DecidableEq  -- elab: the certificate filters on kind

/-- `κ`: a verifiable predicate — an executable check with a determinate pass/fail outcome — for
    one obligation of its unit; a completion predicate says when the unit is done, an invariant a
    boundary the interval preserves while completing. A check the run itself could change so that
    it passes is said so on the sheet. -/
structure Compiled where
  obligation : Obligation
  kind       : PredicateKind
  condition  : String

/-- `ρ`: an obligation of its unit with no verifiable predicate, left unguarded. A taking of the
    plan with it shown accepts it as uncovered. -/
structure Residual where
  obligation : Obligation
  kind       : PredicateKind

/-- `σ`: an obligation of its unit that a judgment settles — made against the context accumulated
    by the moment the question comes live and what the person has actually said by then, so no
    compile-time artifact stands in for it. Leaving it open is the correct disposition, not a
    shortfall; `ground` names what settles it. It is neither a residual nor an out-of-scope
    delegation. -/
structure Reservation where
  obligation : Obligation
  kind       : PredicateKind
  ground     : String
  basis      : Cited

/-- What one unit's derivation holds. -/
structure Derivation where
  compiled  : List Compiled
  residuals : List Residual
  reserved  : List Reservation

/-- Every record names an obligation of its own unit. -/
def Derivation.Bound (u : PlanUnit) (d : Derivation) : Prop :=
  (∀ k ∈ d.compiled, k.obligation ∈ u.obligations) ∧
  (∀ r ∈ d.residuals, r.obligation ∈ u.obligations) ∧
  (∀ s ∈ d.reserved, s.obligation ∈ u.obligations)

/-- **Your judgment** for `u`, made afresh on every pass: per obligation a verifiable predicate — a
    completion or an invariant — a residual, or a reservation; every obligation of `u` lands in at
    least one, and `Derivation.Bound u`. A check that covers only part of an obligation leaves the
    rest as a residual or a reservation beside it. Where an obligation could become a check once
    sharpened, the sharpened check is your proposal, shown beside the obligation it would replace:
    a taking adopts it, and otherwise the residual stands. A condition a person's turn set stands
    on the scope their words reach; where a change upstream leaves that scope unclear, the sheet
    names it and it stays open. -/
axiom derivation : Context P → PlanUnit → Derivation

def Derivation.derives (d : Derivation) (o : Obligation) : Bool :=
  d.compiled.any (·.obligation == o) || d.residuals.any (·.obligation == o) ||
    d.reserved.any (·.obligation == o)

/-- `obligations_derived`. -/
def obligationsDerived (c : Context P) : Bool :=
  (units c).all (fun u => u.obligations.all ((derivation c u).derives))

/-- Every record of every unit's derivation names an obligation of that unit — `Derivation.Bound`,
    read over the plan. -/
def derivationsBound (c : Context P) : Bool :=
  (units c).all (fun u =>
    let d := derivation c u
    d.compiled.all (fun k => u.obligations.contains k.obligation) &&
      d.residuals.all (fun r => u.obligations.contains r.obligation) &&
      d.reserved.all (fun s => u.obligations.contains s.obligation))

structure LeafConjunct where
  condition : String
  kind      : PredicateKind

/-- The unit's certificate: every compiled check, every gap accepted as uncovered, and every
    reservation with the ground that settles it, completion and invariant alike, together. A
    passing check never stands for the unit's done while a reserved judgment is still open, and a
    reservation never hides an accepted gap. -/
structure Certificate where
  checks   : List LeafConjunct
  accepted : List Residual
  reserved : List Reservation

def certificate (d : Derivation) : Certificate :=
  { checks := d.compiled.map (fun k => ⟨k.condition, k.kind⟩)
    accepted := d.residuals
    reserved := d.reserved }

/-- The certificate says when the unit is done: some completion check, accepted completion gap, or
    completion reservation stands. -/
def Certificate.terminates (k : Certificate) : Bool :=
  k.checks.any (·.kind == .completion) || k.accepted.any (·.kind == .completion) ||
    k.reserved.any (·.kind == .completion)

/-- `termination_covered`. -/
def terminationCovered (c : Context P) : Bool :=
  (units c).all (fun u => (certificate (derivation c u)).terminates)

inductive PlanScope | finalIntegration | globalNonRegression | wholeGoalAcceptance
  | emergent (name : String)
  deriving DecidableEq  -- elab: binding reads the scope

/-- The predicate of a `PlanStateRequirement`. -/
inductive Requirement
  /-- a condition over a candidate plan, as derived -/
  | stated (check : String)
  /-- `plan_terminal(n)`: the candidate plan has exactly `n` unit certificates and each holds —
      every check passes, and every accepted gap and reservation is carried in the plan -/
  | planTerminal (units : Nat)

/-- `PlanStateRequirement`: never without the evidence it rests on. Whether that evidence still
    tracks what it asserts is the receiving side's judgment, not certified here. -/
structure PlanStateRequirement where
  predicate : Requirement
  basis     : {l : List Cited // l ≠ []}

/-- `PlanCondition`: a condition whose subject is the whole goal. -/
structure PlanCondition where
  scope             : PlanScope
  kind              : PredicateKind
  condition         : String
  dischargeableWhen : PlanStateRequirement

/-- **Your judgment**, made afresh on every pass: the conditions whose subject is the whole goal —
    final integration, global non-regression, a whole-goal invariant, or another scope the goal
    carries — never distributed across units, and none naming a unit identity, a move, a region,
    or an order position; a condition you read as naming one is a contrary ground on the sheet.
    The whole-goal acceptance criterion is not among them: it is the acceptance question below. -/
axiom planConditions : Context P → List PlanCondition

/-- How the whole-goal acceptance question is settled. -/
inductive Acceptance
  /-- a completion criterion for the whole goal -/
  | defined (criterion : String)
  /-- constitutively open: its right answer varies with the context accumulated by the moment the
      goal is judged accepted and with what the person has said by then -/
  | reserved
  /-- a criterion the plan should have carried is waived -/
  | waived

/-- **Your judgment**: the cited turn settles the acceptance question this way — a criterion the
    person stated, in the goal itself or later; the draft's criterion taken, which a taking of the
    whole plan with it shown does; a reservation; or a waiver. Read against the context as it now
    stands: a later settling replaces an earlier one, so one value stands. -/
axiom AcceptanceSupported : Context P → Turn P → Acceptance → Prop

/-- Only a person's turn settles the acceptance question. -/
def acceptanceCoord : Coord P Acceptance :=
  { admits := (·.val = .person), supports := AcceptanceSupported }

/-- **Your reading**: the person's settling of the acceptance question; `open_` until one reaches
    it. -/
axiom acceptance : (c : Context P) → Occ (acceptanceCoord (P := P)) c

/-- **Your draft** of a whole-goal acceptance criterion, shown on the sheet as the draft's until
    the person settles the question; `none` where the goal gives you none to propose. -/
axiom draftCriterion : Context P → Option String

/-- `plan_terminal(n)`, whole: its predicate and the evidence it rests on, both over `n`. -/
def planTerminal (n : Nat) : PlanStateRequirement :=
  let src : Cited := ⟨"the current plan's unit certificates",
    "expected unit certificate count = " ++ toString n⟩
  ⟨.planTerminal n, ⟨[src], List.cons_ne_nil src []⟩⟩

/-- Every whole-goal acceptance requirement is bound to plan-terminal over the current unit
    count, so a plan that drops a unit cannot satisfy it vacuously. -/
def bindPlan (c : Context P) (p : PlanCondition) : PlanCondition :=
  if p.scope == .wholeGoalAcceptance then { p with dischargeableWhen := planTerminal (units c).length }
  else p

/-- The defined criterion as a completion condition over the whole goal. -/
def acceptanceCondition (c : Context P) : Option PlanCondition :=
  match filledValue (acceptance c) with
  | some (.defined d) =>
    let src : Cited := ⟨"the turn that settled the whole-goal acceptance criterion", d⟩
    some ⟨.wholeGoalAcceptance, .completion, d, ⟨.stated d, ⟨[src], List.cons_ne_nil src []⟩⟩⟩
  | _ => none

/-- `P`, bound. -/
def planOf (c : Context P) : List PlanCondition :=
  ((planConditions c) ++ (acceptanceCondition c).toList).map (bindPlan c)

/-- **Your reading**: what the run will reach, while the person is away, that needs their
    authority — each named by its kind, its target, and its limit, read from the goal, the units,
    and the context as it now stands, an act whose place inside what the person has granted is
    unclear marked so. It is shown on the sheet before the person leaves, since what it will meet
    forms only at runtime; the exact act is the run's to meet. -/
axiom authority : Context P → List String

/-- **Your judgment**: the cited turn grants the run this authority, with its limits, read against
    the context as it now stands — given in the person's own words, or adopted by a taking of the
    plan with the authority shown. Your own reading of what the run will need grants nothing. -/
axiom GrantSupported : Context P → Turn P → String → Prop

/-- Only the person grants. -/
def grantCoord : Coord P String :=
  { admits := (·.val = .person), supports := GrantSupported }

/-- **Your reading**: the authority the person granted the run; `open_` until a turn grants it. An
    act outside it, or whose place inside it is unclear, rests on the person. -/
axiom grant : (c : Context P) → Occ (grantCoord (P := P)) c

/-- What the sheet shows about the plan's shape. -/
structure Status where
  coverageComplete       : Bool
  partitioned            : Bool
  fitSettled             : Bool
  obligationsDerived     : Bool
  derivationsBound       : Bool
  terminationCovered     : Bool
  oosSubstrateNamed      : Bool
  reservationGroundNamed : Bool
  acceptanceSettled      : Bool
  planNonempty           : Bool

def status (c : Context P) : Status :=
  { coverageComplete := coverageComplete c
    partitioned := partitioned c
    fitSettled := fitSettled c
    obligationsDerived := obligationsDerived c
    derivationsBound := derivationsBound c
    terminationCovered := terminationCovered c
    oosSubstrateNamed := (oos c).all (fun d => d.substrate != "")
    reservationGroundNamed := (units c).all (fun u => (derivation c u).reserved.all (·.ground != ""))
    acceptanceSettled := isFilled (acceptance c)
    planNonempty := !(units c).isEmpty || !(oos c).isEmpty }

/-- What a taking needs from the plan's structure; a plan with nothing in it is never taken. A
    reading of yours over content — that a condition names an order, that a unit will not fit —
    is not among them: it stands as a contrary ground. -/
def Structural (c : Context P) : Bool :=
  let s := status c
  s.coverageComplete && s.partitioned && s.fitSettled && s.obligationsDerived &&
    s.derivationsBound && s.terminationCovered && s.oosSubstrateNamed &&
    s.reservationGroundNamed && s.acceptanceSettled && s.planNonempty

/-- **Your judgment**, the adoption condition: every value the taking would take was shown on a
    sheet the person answered — who proposed it and how it came to stand, its ground, and your
    contrary grounds; a value the taking turn itself sets counts where its consequences were in
    view. Where anything would be taken unseen, the sheet is drawn again. -/
axiom Covered : Context P → Prop

/-- A line of the sheet, named as the sheet shows it — the goal, a unit, a condition, a plan
    condition, the acceptance criterion, a subtraction, an out-of-scope declaration. -/
abbrev Entry := String

/-- **Your reading**: the lines the sheet shows as the context now stands — every line on every
    sheet, unchanged ones included. -/
axiom entries : Context P → List Entry

/-- Who first put a value forward. Kept apart from how the value came to stand: a unit the draft
    proposed and the person kept while moving another was proposed by the draft and set by the
    person. -/
inductive Proposer | draft | person

/-- **Your reading**: the position of the turn that first put forward what `e` holds now. -/
axiom introducedAt : Context P → Entry → Nat

def proposer (c : Context P) (e : Entry) : Proposer :=
  match c[introducedAt c e]? with
  | some ⟨.person, _⟩ => .person
  | _                 => .draft

/-- How a value came to stand: a person's turn set it, or the taking adopted the draft's. -/
inductive Standing | set | adopted

/-- **Your reading**: a person's turn set what `e` holds now — named it, edited it, or chose it —
    on the scope their words reach. -/
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
  /-- a value the draft re-filled because an edit forces it -/
  | necessary
  /-- a value the draft re-filled because you propose it -/
  | proposal
  /-- a change for any other reason — a new observation, your own re-draft -/
  | other

/-- One change since the last sheet: what changed, the edit that caused it, and its kind. A
    removed unit and a replaced value stay in the ledger with what they were. -/
structure LedgerLine where
  change : String
  cause  : Option Entry
  kind   : LedgerKind

/-- **Your record**: every change since the sheet the person answered — their edits first, then
    each value re-filled because of them, then anything else that moved. Pointing a line to its
    cause and marking its kind is welcome, not required. -/
axiom ledger : Context P → List LedgerLine

/-- One concrete action for the focus: what it would change, and what then happens. -/
structure Action where
  edit        : String
  consequence : String

/-- The one open point the sheet asks about. -/
structure Focus where
  item    : String
  actions : List Action

/-- **Your selection** of the focus: a hole in coverage first, then a unit that does not fit, then
    the acceptance question, then the point whose change would most change the plan; `none` where
    nothing is open and the question is whether to take the plan. -/
axiom focus : Context P → Option Focus

/-- **Your judgment**: the ground clearly separates action `i` of `f` from the others — not that it
    is somewhat better. -/
axiom Separates : Context P → Focus → Nat → Prop

/-- **Your recommendation** for `f`: an action the ground clearly separates, carried with that
    judgment; `none` where the actions are comparable, and then each stands beside its consequence
    alone. -/
axiom recommend : (c : Context P) → (f : Focus) → Option {i : Nat // Separates c f i}

/-- **Your record**: the doubts you hold about the plan, each naming what it bears on — a unit, a
    condition, the authority, the whole plan — and what it rests on, read from the context as it
    now stands; empty when you hold none. Each is shown beside what it bears on, before the
    person's turn it bears on, and holds nothing back. A taking over one keeps it
    attached to the plan — taken, and evidentially disputed — and it is raised again only on new
    evidence. The run reads them at the handoff. -/
axiom dissent : Context P → List String

/-- **Your judgment**: the cited turn takes the plan as the latest sheet showed it, read against
    the context as it now stands; whatever the same turn changes is read with it. A turn before
    the latest sheet takes nothing on it, an answer to the focus takes nothing, and your own
    reading that the plan is ready takes nothing. -/
axiom ResolutionSupported : Context P → Turn P → Unit → Prop

/-- Only the person takes the plan. -/
def resolutionCoord : Coord P Unit :=
  { admits := (·.val = .person), supports := ResolutionSupported }

/-- **Your reading**: the person's taking of the plan; `open_` until one reaches it. -/
axiom resolution : (c : Context P) → Occ (resolutionCoord (P := P)) c

/-- The plan may be taken: its structure holds and everything it takes was shown. -/
def Closable (c : Context P) : Prop := Structural c = true ∧ Covered c

/-- `UnitRef`: assigned at emission, one per unit, never shared. -/
abbrev UnitRef := Nat

/-- `JudgmentReservation` as emitted. -/
inductive ReservedSubject
  | obligation (o : Obligation)
  /-- the whole-goal acceptance criterion itself, which names no obligation -/
  | acceptance

def ReservedSubject.isAcceptance : ReservedSubject → Bool
  | .acceptance   => true
  | .obligation _ => false

structure JudgmentReservation where
  subject : ReservedSubject
  unit    : Option UnitRef
  kind    : PredicateKind
  ground  : String
  basis   : Cited

/-- The reserved acceptance criterion: its ground is the same in every plan that reserves it. -/
def acceptanceReservation : JudgmentReservation :=
  { subject := .acceptance, unit := none, kind := .completion,
    ground := "the context accumulated by the moment the goal is judged accepted, together with what the person has actually said by then",
    basis := ⟨"the person's reservation of the whole-goal acceptance criterion",
      "the criterion's right answer varies with that ground, so fixing it now would settle a live question where the person is not present"⟩ }

structure UnitEntry where
  ref          : UnitRef
  subject      : String
  obligations  : List Obligation
  fit          : SpanFit
  seam         : Seam
  certificate  : Certificate
  capabilities : List String
  feasibility  : List String

structure AcceptedResidualEntry where
  obligation : Obligation
  unit       : UnitRef
  kind       : PredicateKind

/-- The envelope: the accepted gaps, the reservations, the out-of-scope set, the subtraction, and
    the waiver kept apart from the reserved criterion, so a reader of the plan alone tells a
    waived criterion from one correctly left open. -/
structure Envelope where
  acceptedResiduals : List AcceptedResidualEntry
  reserved          : List JudgmentReservation
  oos               : List OOSDeclaration
  subtracted        : List Obligation
  waived            : Bool

/-- `E`: one entry per unit, one per plan condition, and exactly one envelope. -/
structure Emission where
  units          : List UnitEntry
  planConditions : List PlanCondition
  envelope       : Envelope

def numbered {α : Type} (l : List α) : List (Nat × α) := (List.range l.length).zip l

def entry (i : UnitRef) (u : PlanUnit) (k : Certificate) : UnitEntry :=
  ⟨i, u.subject, u.obligations, u.fit, u.seam, k, u.capabilities, u.feasibility⟩

def envelope (c : Context P) : Envelope :=
  let a := filledValue (acceptance c)
  { acceptedResiduals := (numbered (units c)).flatMap (fun (i, u) =>
      (derivation c u).residuals.map (fun r => ⟨r.obligation, i, r.kind⟩))
    reserved := (numbered (units c)).flatMap (fun (i, u) => (derivation c u).reserved.map (fun s =>
        ⟨.obligation s.obligation, some i, s.kind, s.ground, s.basis⟩)) ++
      (match a with | some .reserved => [acceptanceReservation] | _ => [])
    oos := oos c
    subtracted := subtracted c
    waived := match a with | some .waived => true | _ => false }

/-- `Emit`. -/
def emit (c : Context P) : Emission :=
  { units := (numbered (units c)).map (fun (i, u) => entry i u (certificate (derivation c u)))
    planConditions := planOf c
    envelope := envelope c }

/-- `ConditionBearingUnitPlan`, with the authority the run will reach and the grant the person
    gave, the doubts the taking carried, and how each value came to stand. -/
structure ConditionBearingUnitPlan where
  units             : List UnitEntry
  planConditions    : List PlanCondition
  acceptedResiduals : List AcceptedResidualEntry
  reserved          : List JudgmentReservation
  oos               : List OOSDeclaration
  subtracted        : List Obligation
  waived            : Bool
  authority         : List String
  grant             : Option String
  dissent           : List String
  provenance        : List Provenance

/-- `package`: the returned plan read back from what was emitted, never derived beside it. -/
def package (e : Emission) (au : List String) (g : Option String) (ds : List String)
    (pv : List Provenance) : ConditionBearingUnitPlan :=
  { units := e.units, planConditions := e.planConditions,
    acceptedResiduals := e.envelope.acceptedResiduals, reserved := e.envelope.reserved,
    oos := e.envelope.oos, subtracted := e.envelope.subtracted, waived := e.envelope.waived,
    authority := au, grant := g, dissent := ds, provenance := pv }

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
axiom pointer : Context P → Option NavigationBlock

/-- **Your reading** at activation: follow the block's dereference instruction at its locator and
    run its grounding instruction; what the carrier returns enters the context. Nothing when there
    is no pointer. -/
axiom groundPointer : Context P → List (Evidence P)

def bindPointer (c : Context P) : Context P := c ++ (groundPointer c).map (·.val)

/-- **Your judgment**: the pointer is unreachable or missing half its locator, or compiling this
    goal needs a premise its record does not support. An unsupported downstream judgment the
    compilation can leave open is not this: it stays reserved. False without a pointer. -/
axiom PointerUnreadable : Context P → Prop

/-- **Your judgment**, against the plan read back from the carrier the pointer names: its units and
    conditions are already present, every unit's certificate saying when it is done. -/
axiom ConditionBearing : Context P → Prop

/-- **Your record**: the identity the carrier-creating write returned; empty where none returned. -/
axiom carrierRecord : Context P → String

/-- **Your reading** of what the writes returned: the emission was recorded and the carrier holds
    the whole packaged plan — not only an identity allocated for it. -/
axiom CarrierComplete : Context P → Prop

/-- **Your record**: this session's id. -/
axiom sessionId : Context P → String

/-- **Your reading**: what a receiving session needs to know the plan is for. -/
axiom purposeFrame : Context P → String

/-- **Your reading**: a snapshot anchor, only where exact-state determinacy is needed. -/
axiom snapshotAnchor : Context P → Option String

/-- `GroundingInstruction`: the receiving procedure the block carries. -/
def receivingProcedure : String :=
  "Using /inquire where available or an equivalent grounding pass, dereference the carrier and its source session, follow the goal's cited evidence, and recover the current scope and the authority granted from the governing utterances and authorized revisions; preserve those limits through reassignment. Interpret each reservation under the recovered ground, following any further source its subject requires. Run what does not rest on the person without waiting for them, unit by unit, each closed by its own checks. What rests on the person — a unit that cannot be undone where a doubt the plan carries, or one execution brings evidence for, bears on it; an act outside the granted authority or whose place inside it is unclear; a reservation; work whose decision-bearing source is unreachable or whose needed premise lacks support-integrity — does not proceed, and nothing is decided for them. When the plan has run, return to the person once with every unit's result and what came back unconfirmed, each skipped item with what did not proceed because of it. A coordinator's summary does not substitute for source wording that settles authority; a reservation supplies no answer or actor assignment, and a completed predicate supplies no act reserved to someone else."

/-- `record_handoff`: the block over the carrier — entry points only, never a re-authored plan. -/
def navigation (c : Context P) : NavigationBlock :=
  { purposeFrame := purposeFrame c
    canonicalLocator := ⟨carrierRecord c, sessionId c⟩
    dereferenceInstruction := "read the carrier record at the canonical locator's record identity, within the session it names; one read yields the whole plan"
    snapshotAnchor := snapshotAnchor c
    groundingInstruction := receivingProcedure }

/-- `handoff_recorded`, its structural half: the block locates the carrier the write returned, both
    halves present, and states its purpose. That it was presented is the text itself. -/
def HandoffRecorded (n : NavigationBlock) (c : Context P) : Prop :=
  n.purposeFrame ≠ "" ∧ n.canonicalLocator = ⟨carrierRecord c, sessionId c⟩ ∧
    n.canonicalLocator.record ≠ "" ∧ n.canonicalLocator.session ≠ ""

/-- The writes landed: the carrier holds the plan, and the block locates it. -/
def Recorded (n : NavigationBlock) (c : Context P) : Prop := CarrierComplete c ∧ HandoffRecorded n c

/-- Why the run ends without a plan, on evidence rather than the person's turn: the incoming
    handoff could not be read, a plan already carries its conditions, or nothing could be read
    from the goal's scope. Your reading that the work has no autonomous interval, or that the
    request bundles several goals, ends nothing: the first is a contrary ground on the sheet, the
    second a question of scope there. -/
inductive RelayKind
  | handoffUnreadable
  | conditionBearing
  /-- nothing could be read from the goal's scope -/
  | tooThin

/-- The emitted result: the context after the writes, what was emitted, the plan read back from
    it, and the navigation block over its carrier. It is handed to the autonomous run by
    `.handoff` in the same turn, and the run executes it as the Rule "Handoff carries its
    obligations" names. -/
structure Apportioned (P : Type) where
  context    : Context P
  emission   : Emission
  plan       : ConditionBearingUnitPlan
  navigation : NavigationBlock

inductive Outcome (P : Type)
  | relayed     (kind : RelayKind) (c : Context P)
  /-- the person took the plan, the navigation block records its carrier, and the plan is handed
      to the run -/
  | apportioned (a : Apportioned P)
  /-- no taking: the sheet holds, whether the person is silent, stopped, or turned to other work;
      nothing is emitted -/
  | holding     (c : Context P)

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it. Coverage
partition: the units' obligations, the out-of-scope obligations, and the holes together are
`O_G` — the holes by construction, and no obligation in two cells nor outside `O_G` wherever a
taking is read, as `partitioned` checks. The host's standing contract is subtracted before `O_G`
exists, and a reservation stays in the unit it belongs to, so neither is a fourth cell. Nothing persists
into the execution interval.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
A step is one arm of a structural recursion over the person's utterances. A pass is the silent
work: the reads the plan needs enter the context, then the pass's record — the plan judged afresh,
each value with how it came to stand. `respond` presents the sheet; a taking over a closable plan
writes the emission and the carrier instead.
-/

/-- **Your reads** for a pass: the goal's cited material, and seam evidence over its substrate. -/
axiom collect : Context P → List (Evidence P)

/-- **Your record** of a pass, once its reads have entered the context: the plan as judged —
    units, conditions, plan conditions, the acceptance question, the authority and the grant,
    subtraction and out-of-scope classification, provenance, the ledger, your doubts, and the
    focus. A record grounds nothing. -/
axiom passRecord : Context P → List (Response P)

def pass (c : Context P) : Context P :=
  let c₁ := c ++ (collect c).map (·.val)
  c₁ ++ (passRecord c₁).map (·.val)

/-- **Your action** on a taking: the Emit record write of `emit c`, then the write of the packaged
    plan into one new carrier record; each returns what it wrote and its identity. -/
axiom persist : Context P → List (Evidence P)

def close (c : Context P) : Apportioned P :=
  let c₃ := c ++ (persist c).map (·.val)
  { context := c₃, emission := emit c,
    plan := package (emit c) (authority c) (filledValue (grant c)) (dissent c) (provenance c),
    navigation := navigation c₃ }

def tooThin (c : Context P) : Bool := (obligations c).isEmpty

open Classical in
def relayAt (c : Context P) : Option RelayKind :=
  if PointerUnreadable c then some .handoffUnreadable
  else if ConditionBearing c then some .conditionBearing
  else none

open Classical in
/-- `respond` presents the sheet. First the whole plan: every unit with its obligations, fit, seam
    with its citation or heuristic declaration, capabilities and feasibility, and its certificate —
    checks, residuals, reservations with their grounds — a unit whose done rests only on accepted
    residuals shown as one the run cannot tell is done; the plan conditions with the requirement
    that makes each safe to discharge; the acceptance question — the person's settling, or the
    draft's criterion marked as the draft's; the authority the run will reach, by kind, target, and
    limit, beside the grant as it stands; the out-of-scope obligations with their substrates; what
    was subtracted as the host's standing contract; any hole; where the request bundles several
    goals, each stated outcome and the shared-procedure bond, as the question of which goal this
    apportionment takes; each field labelled by the question it answers, in the person's everyday
    words; each value marked the person's or the draft's. Then the ledger of every change since the
    sheet the person answered. Then your doubts, each beside what it bears on. Then the focus with
    its actions, each with its consequence, an action marked recommended only as `recommend`
    carries it; with nothing open, whether to take the plan, and what a taking would not yet
    satisfy. After a taking the plan's structure did not allow, the sheet says the taking did not
    close and what stands in the way. After a carrier write that came back incomplete, the sheet
    says what is missing and that nothing was closed. Wherever a person's earlier turn is read as
    setting a value, the sheet says which turn and what was taken from it, quoting their words. -/
def apportion (respond : Context P → Response P) :
    Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let c₁ := pass (fuse c u)
    if isFilled (resolution c₁) = true then
      if Closable c₁ then
        if Recorded (close c₁).navigation (close c₁).context then .apportioned (close c₁)
        else apportion respond ((close c₁).context ++ [(respond (close c₁).context).val]) us
      else apportion respond (c₁ ++ [(respond c₁).val]) us
    else apportion respond (c₁ ++ [(respond c₁).val]) us

def start (respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  let c₁ := bindPointer c
  match relayAt c₁ with
  | some k => .relayed k c₁
  | none =>
    let c₂ := pass c₁
    if tooThin c₂ then .relayed .tooThin c₂
    else apportion respond (c₂ ++ [(respond c₂).val]) us

/-! ── LOOP ──
Every sheet re-judges the whole plan against the whole context: nothing counts down, no stage is
entered, and no answer is held for a later gate. A person's edit reaches what their words reach —
one unit, a region, a condition, the acceptance question — and the draft re-fills what depends on
it, and the ledger carries every change since the sheet the person answered. A cut sent back, a
unit reopened, a condition adjusted are all edits of the same kind; re-reading rewrites no value a
person's turn made stand beyond the reach their later words give. The loop is dialogue: each
sheet ends at the focus, and only the person's taking closes the run. The run holds no state into
the execution interval.
-/

/-! ── CONVERGENCE ──
apportioned(G): the person took the plan with everything it holds in view, its structure held —
never an empty plan — the carrier holding the whole plan, the navigation block over it presented
(`Recorded`), and the plan handed to the run in the same turn.
The taking adopted what the draft proposed, the authority shown included, and accepted every
residual shown; it established nothing about whether a check is the right one, and a doubt it was
taken over rides the plan attached to what it bears on.
Convergence evidence, at emission: (a) the goal restated as its units, one plain sentence each;
(b) per unit, the obligations, the seam with its citation or heuristic declaration, the fit or the
person's taking over it with their words, the certificate — every check, every accepted gap, every
reservation with its ground — and the capability requirements and feasibility notes; (c) the plan
conditions with the requirement that makes each safe to discharge; (d) every out-of-scope
obligation with its substrate, and what was subtracted as the host's standing contract; (e) the
acceptance question as settled — the criterion and whose it was, the reservation stated as left
open on purpose, or the waiver — never two of these; (f) the authority the run will reach and the
grant as given; (g) how each value came to stand — who proposed it, set or adopted — and the turns
read as setting values, quoted; (h) the doubts the plan carries, each with what it bears on.
Demonstrated, not asserted.
-/

/-! ── TOOL GROUNDING ──
What each operation of this contract does. An interaction with the person is one of two kinds,
and its kind fixes how it continues once its text is presented.
-/

inductive Interaction | constitution | extension

inductive Continuation | stop | proceed

inductive Annot | sense | observe | track | transform | dispatch | interaction (kind : Interaction)

/-- Every interaction presents its text; a Constitution then stops for the person's turn, and an
    Extension proceeds. -/
def Interaction.realization : Interaction → Continuation
  | .constitution => .stop
  | .extension    => .proceed

inductive Op | probe | relay | collect | judge | record | sheet | readTurn | emit | package
             | parkCarrier | recordHandoff | converge | handoff

def grounding : Op → Annot × String
  | .probe         => (.observe, "record read, artifact read: the goal and whether its plan is uncompiled, cue cited. A navigation block in scope is dereferenced — the one carrier at its locator, within the session it names — and its grounding instruction run once; condition-bearing is decided against the plan read back from that carrier")
  | .relay         => (.interaction .extension, "an unreadable handoff, which never falls through to fresh compilation; a plan already condition-bearing; or nothing read from the goal's scope. No activation")
  | .collect       => (.observe, "record read, artifact read, artifact search: the goal's cited material and seam evidence over its substrate; read-only")
  | .judge         => (.sense, "Internal analysis: the whole plan afresh against the whole context — obligations with the host's standing contract subtracted, the out-of-scope set, the units as a partition with each fit and seam, each unit's conditions, the plan conditions, the acceptance question, the authority the run will reach and the grant, how each value came to stand, and your doubts with what each bears on; a person's value stands on the scope their words reach")
  | .record        => (.track, "record: the pass's record of the plan as judged, the ledger, and the focus")
  | .sheet         => (.interaction .constitution, "the whole plan on one sheet, each value marked the person's or the draft's, the authority the run will reach beside the grant as it stands; the ledger of every change since the sheet the person answered; your doubts, each beside what it bears on; then one focus with concrete actions, each with its consequence, a recommendation only where the ground clearly separates it; with nothing open, whether to take the plan. Silence holds and takes nothing")
  | .readTurn      => (.sense, "Internal analysis: the new turn, and every earlier turn of the person's it bears on, read whole against the fused context as it now stands — an edit and its scope, an answer to the focus, a settling of the acceptance question, a grant, a taking over a fit, a taking of the plan — whatever form it takes")
  | .emit          => (.track, "record: on a taking over a closable plan, one entry per unit with its ref and its whole certificate, one per plan condition, and exactly one envelope — accepted gaps, reservations, the out-of-scope set, the subtraction, and the waiver apart from the reserved criterion")
  | .package       => (.sense, "Internal analysis: the returned plan read back from the emitted entries, with the authority and the grant, the doubts the taking carried, and each value's provenance")
  | .parkCarrier   => (.track, "record: the packaged plan written into one new carrier record, whose write returns its identity")
  | .recordHandoff => (.interaction .extension, "the navigation block over the carrier — purpose, locator with both halves, dereference instruction, snapshot anchor only where needed, and the receiving procedure; entry points only. A write that returned no identity or left the plan incomplete in the carrier, or a block missing a half, closes nothing: the sheet shows what is missing")
  | .converge      => (.interaction .extension, "the apportionment trace after the navigation block — per unit its obligations, seam, fit or the person's taking over it, whole certificate, capabilities and feasibility; the plan conditions; out-of-scope and subtracted obligations; the acceptance question as settled; the authority and the grant; each value's provenance with the turns read, quoted; and the doubts the plan carries")
  | .handoff       => (.dispatch, "delegate: after the trace, in the same turn, the plan handed to the autonomous run through the navigation block — a substrate that runs one unit per stretch and closes each by its own checks; where the session can start none, the block is the handoff and the person starts the run. The run executes as the Rule \"Handoff carries its obligations\" names; then this run ends")

/-- The operation an outcome hands off through: a taken plan goes to the run by `.handoff`, after
    the trace; a relay or a holding hands nothing off. -/
def handedOffBy : Outcome P → Option Op
  | .apportioned _ => some .handoff
  | _              => none

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
The plan leaves as session text and a navigation block over its carrier; what reads it next is the
person's and the session's to settle. The receiving side runs the block's grounding instruction
against the work at hand; the emission supplies no answer to a reserved judgment.
-/

end

end Merismos
```

## Core Principle

Merismos compiles one autonomous goal into coarse, horizon-fit units and the conditions by which each unit is done, and shows what the run will need from the person before they leave. It apportions and conditions; order, independence, reconciliation, and termination topology stay outside it, and execution belongs to the run it hands off to. The whole plan is shown on one sheet every turn, so coverage, fit, seam quality, conditions, and authority stay inspectable together, and nothing is taken before it has been seen whole.

## Substrate Boundary

Merismos hands the taken plan to the autonomous run and stops: the handoff is its delegation point, and it needs a substrate that runs one unit per stretch and closes each by its own checks. Where the session can start none, the navigation block over the parked carrier is the handoff and the person starts the run. Units carry functional capability requirements and feasibility notes; predicate enforcement, pre-action interception, workflow control, and concrete executor binding belong to that substrate.

## Mode Activation

### Activation

`/apportion` is user-initiated: the invocation declares autonomous execution intent for a stated goal with no condition-bearing unit plan. A host requirement that applies to every accepted change is inherited by every unit and is excluded from the goal's obligation set unless the goal itself states it as an outcome.

Read prior material first — a boundary already drawn, an earlier plan — then explicit arguments, then conversation context. An existing `/apportion` result is condition-bearing when its carrier gives every unit a certificate that says when it is done.

### Activation exceptions

Relay and deactivate when the goal is already condition-bearing or its scope yields no obligation. Your reading that the work has no autonomous interval is a contrary ground on the first sheet, and a request bundling several outcomes held together only by the host's standing procedure is a question of scope there; neither ends the run. A present navigation block that cannot be dereferenced, lacks its session half, or leaves a premise required for current compilation unsupported is an unreadable handoff and never falls through to fresh compilation. Unsupported downstream judgments remain open under the incoming grounding instruction while independent compilation can continue.

## Protocol

### The sheet

Every turn shows the whole plan on one sheet, in everyday language, opening with the goal in one plain sentence and carrying what `respond` names: each unit with its obligations stated by what they require, its fit and why, its seam with its citation or its declaration that the goal evidences none, what carrying it out needs, and its certificate; then the whole-goal conditions, the acceptance question, the authority the run will reach while the person is away — each by kind, target, and limit — beside what the person has granted, the out-of-scope obligations with who must catch them, and what was subtracted as the host's own standing procedure. Every line is drawn on every sheet, unchanged ones included. The sheet separates its fields with the structure the host renders — headings, tables, lists — so each field reads on its own under a label that is the question it answers, worded in the person's everyday language, and each value shows whether it is the person's or the draft's. A decision, an issue, or an earlier option is named by what it holds; an identifier only the session can decode stands at most beside those words. A host that can fold the sheet may; the contract shows it whole.

Under the sheet, the ledger of every change since the sheet the person answered: their edits first, then each value re-filled because of them, then anything else that moved. A removed unit and a replaced value stay in the ledger with what they were. Then your doubts, each beside what it bears on, with what it rests on.

Then one focus, with concrete actions and what each would do. Mark one action as recommended only where the ground clearly separates it from the others; where the actions are comparable, leave them side by side with their consequences.

The person may answer in their own words, and one answer may edit several units. An answer to the focus settles that point only; a taking is said of the plan and takes everything the sheet shows, adopting what the draft proposed — the authority shown included — and accepting the gaps shown. Where the plan's structure does not yet allow a taking, the next sheet says so and what stands in the way. A unit that does not fit is taken only by words that take it over its fit; for a fit that could not be judged, those words name the uncertainty. With nothing open, the focus asks whether to take the plan and says what a taking would not yet satisfy. Wherever you read one of the person's earlier turns as setting a value, say which turn and what you took from it, quoting their words.

A completion condition is an executable stop-time predicate; an invariant condition is a boundary the interval preserves while completing. A check the run itself could change so that it passes is said so. Where an obligation could become a predicate once sharpened, the draft proposes the sharpened check beside it as its own; a taking adopts it, and otherwise the gap stands. A check that covers only part of an obligation leaves the rest beside it as a gap or a held-open item. A unit whose done rests only on accepted gaps is shown as one the run cannot tell is done. An item only live judgment can settle is held open with the ground that will settle it. An obligation requiring interception before action is out of scope and names what must intercept it.

On a taking, emit one entry per unit with its whole certificate — every check, every accepted gap, every held-open item — and keep a reserved acceptance criterion visibly apart from a waived one. Park the packaged plan in one durable carrier and emit a navigation block that points to it; the run dereferences that carrier, runs `/inquire` where available or an equivalent grounding pass, and reads the governing utterances to recover the authority granted and each reservation's retained or entrusted judgment. Where the carrier write comes back incomplete, nothing closes: the sheet shows what is missing. Once the block records the carrier, hand the plan to the run in the same turn.

Read `references/round-composition.md` before composing when terminology must remain stable, wording must travel unchanged, material belongs to another round or trace, or phase order determines placement.

## Composition

The taken plan leaves as session text and a navigation block over its parked carrier. What reads it next — the run it is handed to, or another line of work the person declares — is the person's and the session's to settle; nothing here names it.

## Known Limitations

Goal singleness, the host-contract subtraction, the out-of-scope classification, seam quality, horizon fit, the residual-versus-reservation classification, a whole-goal condition's freedom from order, and the authority the run will reach are contextual judgments rather than proofs. They stay on the sheet, correctable by the person's next turn; the formal invariants certify the resulting plan structure, not the infallibility of those readings. That every obligation was read is itself a judgment: coverage checks the plan against the obligations read, not the reading against the goal. Whether the run keeps its handoff obligations is the run's; this protocol has ended by then.

## Rules

- **Handoff carries its obligations**: The run does what does not rest on the person without waiting for them and, when the plan has run, returns to them once with every unit's result; what rests on the person — a unit that cannot be undone, where a doubt the plan carries, or one execution brings evidence for, bears on it; an act outside the authority they granted, or whose place inside it is unclear; a reservation — comes back in that return with what did not proceed because of it, and nothing is decided for them. The plan travels by its navigation block, never copied.
- **Round composition**: Compose each round so the reader can act on it without reassembling it — everyday language rather than this file's formal vocabulary, the judgment set beside the evidence it rests on together with the differential implication that matters for the next move, and analytical context laid out before a gate rather than inside it. Read `references/round-composition.md` before composing when a term's rendering has to hold across the session or wording has to be carried through unchanged, when some of what is in view belongs to a later round or a trace rather than this one, or when this protocol's own phases bear on where a sentence sits relative to a gate.
- **One sheet, every turn**: Show the whole plan every turn — the goal, units, conditions, whole-goal conditions, the acceptance question, the authority and the grant, out-of-scope and subtracted obligations — every line drawn on every sheet, with the ledger of every change since the sheet the person answered. The plan and every question about it share that one sheet.
- **Recommendation only where the ground separates**: Mark an action as recommended only where the ground clearly separates it from the others; comparable actions stand side by side with their consequences.
- **The person takes and closes**: Only the person's taking closes the run, whatever its form; silence, a stop, or a turn to other work leaves the sheet holding. A taking adopts what the sheet showed and accepts the gaps shown; a value the draft proposed and the person took is recorded as the draft's and adopted, apart from values the person set. An answer to the focus closes nothing.
- **Authority before departure**: Show on the sheet the authority the run will reach while the person is away — by kind, target, and limit — so it is granted before they leave. Only the person grants; what stays outside the grant or unclear in it is left for the run's return.
- **Contrary grounds ride the plan**: Show each doubt beside what it bears on, with what it rests on, before the person's turn it bears on. A doubt holds nothing back and never refuses a taking; a plan taken over it carries it, and it is raised again only on new evidence.
- **Whole certificate**: A unit's certificate carries every check, every accepted gap, and every held-open item of its done together; a passing check never stands for a done that a held-open judgment still awaits.
- **Whole-goal acceptance**: The acceptance question is settled once, by the person: a criterion (theirs or the draft's, taken), a reservation, or a waiver. One value stands; a later settling replaces an earlier one, and emission never carries two.
- **Host contract subtraction**: Exclude goal-independent host procedure from `O_G`; it is inherited process, not an out-of-scope obligation. A requirement the goal states as its own outcome remains in scope. Show what was subtracted on every sheet and in the trace, so a misjudged subtraction stays correctable.
- **One goal per apportionment**: Where a request bundles outcomes held together only by shared procedure, the sheet names each outcome and the bond and asks which goal this apportionment takes; each outcome takes its own apportionment.
- **Reservation disposition**: Hold open an item only live judgment can settle, record the ground that settles it, and keep the classification on the sheet for correction. A reservation is neither an accepted gap nor a delegated pre-action obligation.
- **Convergence evidence**: Before the handoff, present the plan readback; each unit's obligations, seam, fit or the person's taking over it, whole certificate, capabilities, and feasibility; plan conditions; out-of-scope and subtracted obligations; the acceptance question as settled; the authority and the grant; each value's provenance with the turns read, quoted; the doubts the plan carries; and the navigation block over the parked carrier.
- **Form feedback**: Silence about form is not evidence about form. Too dense fails quietly — the reader skims, answers past it, stops — while too plain fails out loud, so the complaints that arrive come from one side only. Density therefore does not carry over from the previous round: each round takes it from what this request asked for, while a statement about form does carry over until it is countermanded. Read an instruction about form for the parts of a round it reaches, not for what kind of reaction it is — a complaint, a request, a symptom report and a bare preference are one input here, and sorting them by kind yields nothing the reach reading does not already give while costing a clause per kind. Change the form rather than asking which form they want; naming one is the recall this discipline exists to remove. What such an instruction reaches is whatever the active protocol leaves open in how a round is composed — its density, its ordering, its length. What it does not reach is whatever is already fixed for this round elsewhere: content the protocol requires, wording carried verbatim, an order it presents in, a cadence it caps, a turn boundary it sets. Those stay in place, and the layer that fixed them is what states why. Say in one line what changed; where the instruction overlapped something that stays, say in one line that it stays and why — that second line is owed by the overlap, not by how the instruction was worded.
