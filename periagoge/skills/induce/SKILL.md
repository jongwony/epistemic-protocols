---
name: induce
description: "Crystallize a shared but unnamed concept from the concrete cases at hand. Type: (AbstractionInProcess, AI, INDUCE, A) → CrystallizedAbstraction"
---

# Periagoge Protocol

Crystallize in-process abstraction by aligning concrete cases first and naming last, with the live alternative readings held visible throughout. Type: `(AbstractionInProcess, AI, INDUCE, A) → CrystallizedAbstraction`.

## Definition

**Periagoge** (περιαγωγή): A dialogical act of turning an in-process abstraction toward its crystallized form, where AI detects when an instance set has converged toward an unnamed essence, puts the two most alignable cases side by side for the user to correspond, extracts the invariant relation that correspondence carries together with the readings it leaves open, probes those open readings apart against further cases and near-misses the user judges, and only then proposes a name and rule for what survived — so the abstraction is located by the correspondences the user built rather than steered from a candidate offered ahead of them (the Greek dialectical vocabulary supplies the source terms).

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
Periagoge(A) → induce(c, utterances), where c is the fused session context:
  Phase 0: inProcess fails → not activated
  Phase 1: gather the cases' own context → Pair → Align presented → Stop
  next utterance u: c' := fuse(c, u) → answer(c') →
    Align: AsShown → Extract → [unalignable: AlignmentSuspended]
                              [Draws: Probe presented | otherwise: Name presented] → Stop
           Correct | Repartner → Align presented again, reading the correction or the new partner
    Probe: Judged → [unalignable: AlignmentSuspended | Draws: Probe | otherwise: Name] → Stop
           AxisMissing → Extract over the extended language → the same fork
           Redraw → the probe drawn again, no probe spent
           Repartner → Align presented with the named partner
    Name:  Confirm → CrystallizedAbstraction
           Rename | RuleWrong → Name presented again with the change
           NotYet(gap): budget left → Probe seeded by the gap | budget spent → AlignmentSuspended
    Abandon, at any gate → AlignmentSuspended
    no constructor (free response) → the gate the latest presentation opened, presented again
      with the utterance read
  no utterance: the gate holds; nothing is committed, judged, named, or disposed
-/

/-! ── MORPHISM ──
A
  → detect(instances, essence, label)      -- verify in-process abstraction exists (silent)
  → pair(instances, essence)               -- select the two cases that align most readily
  → align(pair, slots)                     -- the person corrects the correspondence the AI filled from the cases; the answer keeps it, corrects it, repartners, or abandons
  → extract(correspondence)                -- invariant relation, plus the axes that correspondence leaves live, over the space already built
  → probe(space, instances)                -- select the case that separates live axes rather than confirming the leading one
  → narrow(space, answer)                  -- per axis: rule it out, bound it, or leave it undecided; or, for the run, redraw the case, extend the language, or repartner
  → name(space, relation, label, record)   -- AI proposes name + rule, reading the boundary off the probe record, after the space has narrowed and not before
  → declare(trace, open_trace)             -- terminal evidence trace + open-item disposition, presented at either terminal
  → CrystallizedAbstraction
requires: in_process(A)                     -- runtime checkpoint (Phase 0)
deficit:  AbstractionInProcess              -- activation precondition (Layer 1/2)
preserves: instance_set(A)                  -- the cases are read, never rewritten; an axis leaves the ruled-out record only when the person's own AxisMissing names it again, so the AI never re-proposes one
invariant: Correspondence Before Naming through Maintained Alternatives over Single-Candidate Steering
invariant: a crystallization, an abandonment, a ruling-out, and an open item's disposition are each a person's utterance; the AI's readings settle none of them
-/

namespace Periagoge

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

/-- `A`, `AbstractionSeed`: the in-process state — the instances, the essence intuition, and
    any provisional name the person gave. Read from the context. -/
abbrev AbstractionSeed (P : Type) := Context P

/-- A concrete case observed: what it is, and where it sits. -/
structure Instance where
  content : String
  context : String

/-- **Your judgment** at Phase 0: an essence is sensed whose name, scope, or position is still
    unsettled, and at least two concrete cases can correspond. -/
opaque inProcess : Context P → Prop

/-- **Your reading** of the context: the instance set `Iᵢ`. Read, never rewritten. -/
opaque instances : Context P → List Instance

/-- **Your reading** of the context: the essence intuition `E`, the variation-stable core the
    conversation signals. Where a routed colimit-shaped signal seeded it, it is that detection's
    reading, marked as the AI's, until the person's own words take it up. -/
opaque essence : Context P → String

/-- **Your reading**: the provisional name or concept the person gave, if any. It grounds the
    name and its provenance without fixing either. -/
opaque label : Context P → Option String

/-- `inSecond` is `none` exactly where the second case carries no counterpart; filling it reads
    off the cases rather than choosing between readings, which Probe separates. -/
structure Slot where
  role     : String
  inFirst  : String
  inSecond : Option String

/-- `M`: the correspondence between the two paired cases. -/
structure Correspondence where
  slots : List Slot

/-- What one case carries and the other does not: evidence, not failure. -/
def unmatched (m : Correspondence) : List String :=
  (m.slots.filter (fun s => s.inSecond.isNone)).map (·.role)

/-- **Your record**, read from the context since this activation bound its seed: every
    correspondence the person committed with AsShown, in order, each as the presentation they
    answered showed it. A correspondence left behind by a repartnering stays. -/
opaque correspondences : Context P → List Correspondence

/-- One reading of what the correspondence carries. Whether an axis a person names again is
    one already ruled out is read from their words. -/
abbrev Axis := String

/-- **Your judgment**: the cited turn refutes `axis` on this ground, the person's reason as
    they gave it. -/
opaque RefutesSupported : Axis → String → Context P → Turn P → Prop

/-- A ruled-out axis with the ground that ruled it out: the person's reason, verbatim, and the
    utterance that gave it. -/
structure RuledOut (c : Context P) where
  axis      : Axis
  ground    : String
  src       : Cite c
  byPerson  : src.kind = .utterance
  supported : RefutesSupported axis ground c (c[src.idx]'src.lt)

/-- `H`: what the correspondence has not yet decided between, and what was dropped and why. -/
structure Space (c : Context P) where
  live     : List Axis
  ruledOut : List (RuledOut c)

/-- **Your reading**, from your extraction records and the person's probe answers: the space as
    it stands; `none` before the first extraction. An axis leaves `live` only by a Refutes the
    person gave, and returns to it only by their AxisMissing naming it; an extraction on
    re-entry extends the language and keeps every live axis live. No axis is both live and
    ruled out. -/
opaque space : (c : Context P) → Option (Space c)

def liveAxes (c : Context P) : List Axis :=
  match space c with
  | some s => s.live
  | none   => []

/-- `R`: the invariant relation, citing the slots it reads off. -/
structure Relation where
  statement : String
  carriedBy : List Slot

/-- **Your reading** of your latest extraction record: the relation. It is your reading and
    grounds nothing; at AlignmentSuspended it is shown as such. -/
opaque relation : Context P → Option Relation

/-- **Your record** of an extraction from `c`: the relation and the live axes over the committed
    correspondence and the space already built. It enters the context as your turns. -/
opaque extract : Context P → List (Response P)

/-- A probe case and the live axes it tells apart; a probe separating none is not presented. -/
structure ProbeCase where
  content    : String
  separates  : List Axis

/-- One axis judged against one probe case. Refutes rules the axis out; Bounds places the case
    outside what that axis claims, and the axis survives; Undecided leaves it live. `ground` is
    the person's reason, carried verbatim. -/
inductive AxisVerdict
  | refutes (ground : String)
  | bounds (ground : String)
  | undecided

/-- `Aₐ`: the answer at the Align gate. -/
inductive AlignAnswer
  | asShown
  /-- a filling the person says is wrong, in their words — a counterpart the second case does
      not carry included; the next presentation reads it -/
  | correct (said : String)
  /-- another instance or a neighbouring abstraction to align against; Pair is skipped -/
  | repartner (ref : String)
  | abandon

/-- `W`: the answer at the Probe gate. `judged` carries exactly one verdict for each axis the
    probe separates and none for any other axis; the others are run-level. -/
inductive ProbeAnswer
  | judged (verdicts : List (Axis × AxisVerdict))
  /-- what the probe case actually is; the case is drawn again, no axis judged -/
  | redraw (correction : String)
  /-- a dimension the live set does not contain; extends the language -/
  | axisMissing (description : String)
  | repartner (ref : String)
  | abandon

/-- `Nₐ`: the answer at the Name gate. -/
inductive NameAnswer
  | confirm
  | rename (name : String)
  | ruleWrong (correction : String)
  /-- what the person says is still missing -/
  | notYet (gap : String)
  | abandon

inductive Answer
  | align (a : AlignAnswer)
  | probe (w : ProbeAnswer)
  | name (n : NameAnswer)

/-- **Your reading** of the person's latest utterance against the gate it answers; `none` when it
    answers no constructor — a free response the next presentation of that gate reads. Premise:
    one utterance carries one disposition; silence is none of them. -/
opaque answer : Context P → Option Answer

/-- One probe with the answer it received, citing the utterance that gave it. -/
structure ProbeRecord (c : Context P) where
  case     : ProbeCase
  answer   : ProbeAnswer
  src      : Cite c
  byPerson : src.kind = .utterance

/-- **Your record**, read from the context since this activation bound its seed: every probe
    answered, in order, with its answer — a Probe-gate Repartner, AxisMissing, or Abandon
    included. A Redraw appends none, since no axis was judged. The cap is per abstraction seed. -/
opaque probes : (c : Context P) → List (ProbeRecord c)

/-- A resource bound on the person's attention, not a sufficiency criterion: reaching it says
    the run stopped, never that the abstraction formed. -/
def maxProbes : Nat := 5

def BudgetSpent (c : Context P) : Prop := maxProbes ≤ (probes c).length

/-- The run carries a probe the person judged. -/
def Probed (c : Context P) : Prop := ∃ r ∈ probes c, ∃ vs, r.answer = .judged vs

/-- Exactly one distinct live reading. -/
def Settled (c : Context P) : Prop := (liveAxes c).eraseDups.length = 1

/-- Every axis ruled out and none supplied: the seed did not carry one. -/
def Unalignable (c : Context P) : Prop := ∃ s, space c = some s ∧ s.live = []

/-- The latest answer is a NotYet, whose gap seeds the next probe. -/
def GapSeeded (c : Context P) : Prop := ∃ g, answer c = some (.name (.notYet g))

/-- Phase 3 draws a probe; otherwise the run proceeds to naming, or suspends when unalignable. -/
def Draws (c : Context P) : Prop := ¬ BudgetSpent c ∧ (GapSeeded c ∨ ¬ (Settled c ∧ Probed c))

/-- Every case the person placed outside a surviving axis's claim, read back from the probe
    record where the case and its ground both survive. -/
def boundary (c : Context P) : List (ProbeCase × String) :=
  (probes c).foldr (fun r acc =>
    match r.answer with
    | .judged vs =>
      vs.filterMap (fun p =>
        match p.2 with
        | .bounds g => if p.1 ∈ liveAxes c then some (r.case, g) else none
        | _ => none) ++ acc
    | _ => acc) []

/-- `(N, Rule)`: the name and rule proposed, the live axis the rule was read off, and the label
    it was grounded on. Presented with `boundary`, so what the abstraction excludes is shown,
    not asserted. -/
structure Naming where
  name       : String
  rule       : String
  axis       : Axis
  labelBasis : Option String

/-- **Your record**: the naming your latest presentation put forward, with every Rename and
    RuleWrong the person made since. -/
opaque proposal : Context P → Option Naming

/-- What a run can still owe at its terminal, tagged by what it is. -/
inductive OpenItem
  | axis (a : Axis)
  | role (r : String)
  | gap (g : String)

/-- The live axes the rule did not take, every unmatched role across every committed
    correspondence, and the gap a NotYet at the spent budget named. -/
def openItems (c : Context P) (named : Option Axis) (gap : Option String) : List OpenItem :=
  ((liveAxes c).filter (fun a => decide (some a ≠ named))).map .axis ++
  ((correspondences c).flatMap unmatched).map .role ++
  (gap.map fun g => [OpenItem.gap g]).getD []

inductive OpenDisposition
  | nonblocking
  | deferred
  deriving DecidableEq  -- elab: lets `status` compare dispositions

/-- **Your judgment**: the cited utterance disposes of item `i` this way. -/
opaque DispositionSupported : OpenItem → Context P → Turn P → OpenDisposition → Prop

/-- An open item is disposed of only by a person's statement. -/
def dispositionCoord (i : OpenItem) : Coord P OpenDisposition :=
  { admits := (· = .utterance), supports := DispositionSupported i }

-- elab: an open witness lets the occupancy reading below be declared `opaque`.
instance {A : Type} {q : Coord P A} {c : Context P} : Inhabited (Occ q c) := ⟨.open_ none⟩

/-- **Your judgment**: how item `i` stands at the terminal. `free_response` is the context fused
    after the closing gate: filled `nonblocking` where the closing utterance takes the run with
    the item shown open before it, `deferred` where it routes the item to later work by name or
    unambiguous reference beside deferral words; the gap a NotYet at the spent budget named is
    `deferred`, citing that NotYet, since the gate said beforehand that NotYet there records it.
    Open where no person's utterance covers the item — one no gate showed, or a terminal no gate
    closed. Ambiguous deferral words defer nothing. -/
opaque disposition : (c : Context P) → (i : OpenItem) → Occ (dispositionCoord i) c

def filledValue {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Option A
  | .open_ _     => none
  | .filled a .. => some a

inductive TraceStatus | none_ | nonblocking | deferred | undisposed

def status (c : Context P) (items : List OpenItem) : TraceStatus :=
  if items.isEmpty then .none_
  else if items.any (fun i => decide (filledValue (disposition c i) = some .deferred)) then .deferred
  else if items.any (fun i => (filledValue (disposition c i)).isNone) then .undisposed
  else .nonblocking

/-- **Your record**: the contrary grounds you presented before the gate the closing utterance
    answered — a reading the probe record does not bear, a rule the boundary contradicts —
    attached to the closure; empty when there were none. -/
opaque dissent : Context P → List String

/-- `CrystallizedAbstraction`: closed by the person's Confirm. The naming, the boundary, and the
    alignment trace are read from `context`; `openTrace` is what the run still owes, each item
    disposed of by `disposition`. -/
structure CrystallizedAbstraction (P : Type) where
  context   : Context P
  naming    : Naming
  openTrace : List OpenItem
  dissent   : List String

/-- `AlignmentSuspended`: the non-crystallizing terminal, carrying what the run established so a
    later run resumes from it; `gap` is the NotYet at the spent budget, if that closed it. -/
structure AlignmentSuspended (P : Type) where
  context   : Context P
  gap       : Option String
  openTrace : List OpenItem
  dissent   : List String

inductive SuspendCause
  /-- the person's Abandon at a gate -/
  | abandoned
  /-- NotYet at the spent budget: the gap is recorded as deferred -/
  | capped
  /-- every axis ruled out and none supplied: a finding about the seed, reported as one -/
  | unalignable

inductive Outcome (P : Type)
  | notActivated (c : Context P)
  | crystallized (r : CrystallizedAbstraction P)
  | suspended    (why : SuspendCause) (r : AlignmentSuspended P)
  | holding      (c : Context P)

/-! ── A-BINDING ──
bind(A) = explicit_arg ∪ recent_instance_cluster ∪ surfaced_essence
Priority: explicit_arg > recent_instance_cluster > surfaced_essence
  /induce "theme"              → A = AbstractionSeed with theme label
  /induce (alone)              → A = most recent instance cluster in session
  "the pattern across..."      → A = instance cluster under discussion
If no essence signal is detectable (neither the person's sensing language nor an AI-inferrable
core pattern): pause activation and surface the scan result before Phase 0, inviting the person
to either name what feels in-process or withdraw. If fewer than two cases are in hand, scan the
accumulated session context and the person's artifacts for cases that could correspond with the
one in hand, and present what the scan found as candidates to recognize or replace before Phase
1. Where it finds nothing, say what was searched and invite a second case.
-/

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
A round is one step of a structural recursion over the person's utterances. `declare` is the
terminal declaration of the alignment trace and the open trace, at either terminal. `present` is
the presentation of the gate `nextGate` names — Align (the two cases side by side, every slot filled
from the cases themselves), Probe (the probe case with every live axis it separates, drawn from
the person's domain and seeded by a NotYet's gap where one opened it), or Name (name, rule,
boundary, whatever stayed live, and whether the budget is spent) — ending at that gate.
-/

inductive Gate | align | probe | name
  deriving Inhabited  -- elab: lets `openGate` be declared `opaque`

/-- **Your record**: the gate your latest presentation in this activation opened; Align when
    this activation has presented nothing yet, so the first presentation pairs the cases and
    opens Align. -/
opaque openGate : Context P → Gate

open Classical in
/-- The gate the next presentation opens. -/
noncomputable def nextGate (c : Context P) : Gate :=
  match answer c with
  | some (.align (.correct _)) | some (.align (.repartner _)) | some (.probe (.repartner _)) =>
    .align
  | some (.probe (.redraw _)) => .probe
  | some (.name (.rename _)) | some (.name (.ruleWrong _)) => .name
  | none => openGate c
  | _ => if Draws c then .probe else .name

/-- **Your collection** for the cases' own context: artifact read and search, and an external
    fetch where the cases' domain lies outside the person's artifacts. -/
opaque gather : Context P → List (Evidence P)

/-- At a suspension no rule was taken, so every live axis is open. The terminal's context ends in
    the declaration (`declare`) of the alignment trace and the open trace. -/
def suspend (declare : Context P → Response P) (c : Context P) (gap : Option String) :
    AlignmentSuspended P :=
  { context := c ++ [(declare c).val], gap := gap, openTrace := openItems c none gap,
    dissent := dissent c }

/-- At Confirm the naming stands as presented, and only the live axes its rule did not take stay
    open; the context ends in the declaration. -/
def crystallize (declare : Context P → Response P) (c : Context P) (n : Naming) :
    CrystallizedAbstraction P :=
  { context := c ++ [(declare c).val], naming := n, openTrace := openItems c (some n.axis) none,
    dissent := dissent c }

open Classical in
noncomputable def induce (present declare : Context P → Response P) :
    Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let c' := fuse c u
    match answer c' with
    | some (.align .abandon) | some (.probe .abandon) | some (.name .abandon) =>
      .suspended .abandoned (suspend declare c' none)
    | some (.name .confirm) =>
      match proposal c' with
      | some n => .crystallized (crystallize declare c' n)
      | none   => induce present declare (c' ++ [(present c').val]) us
    | some (.name (.notYet g)) =>
      if BudgetSpent c' then .suspended .capped (suspend declare c' (some g))
      else induce present declare (c' ++ [(present c').val]) us
    | some (.align .asShown) | some (.probe (.axisMissing _)) =>
      let c₁ := c' ++ (extract c').map (·.val)
      if Unalignable c₁ then .suspended .unalignable (suspend declare c₁ none)
      else induce present declare (c₁ ++ [(present c₁).val]) us
    | some (.probe (.judged _)) =>
      if Unalignable c' then .suspended .unalignable (suspend declare c' none)
      else induce present declare (c' ++ [(present c').val]) us
    | _ => induce present declare (c' ++ [(present c').val]) us

open Classical in
noncomputable def start (present declare : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  if ¬ inProcess c then .notActivated c
  else
    let c₁ := c ++ (gather c).map (·.val)
    induce present declare (c₁ ++ [(present c₁).val]) us

/-! ── LOOP ──
Correct and Repartner at the Align gate, Redraw, Rename, RuleWrong, and a free response each
present a gate again with the utterance read; none spends a probe. Every other probe answer —
Judged, AxisMissing, a Probe-gate Repartner, Abandon — is recorded and counts toward `maxProbes`. When a round rules no axis out, say so before the next probe, and
which axes were kept by scoping the case out of their claim and which were left undecided. When
the Name gate opens on the spent budget, say before the gate that NotYet there records the gap
and suspends rather than drawing another probe. An axis the person names again returns to live
with the ground that ruled it out shown beside it.
-/

/-!
Silence commits, judges, names, and disposes of nothing.
theorem silence (present declare : Context P → Response P) (c : Context P) :
    induce present declare c [] = .holding c

At the spent budget the draw guard is closed: an answer read against the space draws no further
probe. A Redraw re-presents the probe already drawn and spends none.
theorem no_draw_at_cap (c : Context P) (h : BudgetSpent c) : ¬ Draws c

A NotYet with budget left opens the draw guard; the probe drawn is seeded by its gap.
theorem notYet_draws (c : Context P) (g : String)
    (h : answer c = some (.name (.notYet g))) (hb : ¬ BudgetSpent c) : Draws c

A NotYet at the spent budget suspends the run with its gap on record.
theorem notYet_at_cap_suspends (present declare : Context P → Response P) (c : Context P)
    (u : Utterance P) (us : List (Utterance P)) (g : String)
    (h : answer (fuse c u) = some (.name (.notYet g))) (hb : BudgetSpent (fuse c u)) :
    induce present declare c (u :: us) = .suspended .capped (suspend declare (fuse c u) (some g))

With budget left, where an answer read against the space closes the draw guard, the space is
settled past a probe the person judged, and the answer was no NotYet. Rename, RuleWrong, and a
free response re-present the Name gate already open without consulting the guard.
theorem name_has_judged (c : Context P) (h : ¬ Draws c) (hb : ¬ BudgetSpent c) :
    ¬ GapSeeded c ∧ Settled c ∧ Probed c
-/

/-! ── CONVERGENCE ──
crystallized: the person's Confirm at the Name gate. Settled and probed is the Name gate's
opening, not a terminal on its own. Convergence evidence: at either terminal, declare the
alignment trace — the correspondence the person built slot by slot, each probe with the verdict
every separated axis received, and the naming it ended on — with the boundary (`boundary`), every
ruled-out axis beside the ground that ruled it out, so the surviving axis is seen to have won,
and the open trace: every item of `openItems` with its disposition, an item no utterance covered
shown as undisposed rather than as not blocking, and `status`. At AlignmentSuspended the relation
and the live axes are shown as the AI's extraction, not as established. The dissent rides the
closure. Demonstrated, not asserted.
-/

/-!
A crystallization is closed only by a person's Confirm.
theorem crystallized_by_person (present declare : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (r : CrystallizedAbstraction P)
    (h : induce present declare c us = .crystallized r) :
    ∃ (c₀ : Context P) (u : Utterance P),
      answer (fuse c₀ u) = some (.name .confirm) ∧ proposal (fuse c₀ u) = some r.naming ∧
        r = crystallize declare (fuse c₀ u) r.naming

An abandonment is the person's Abandon at a gate.
theorem abandoned_by_person (present declare : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (r : AlignmentSuspended P)
    (h : induce present declare c us = .suspended .abandoned r) :
    ∃ (c₀ : Context P) (u : Utterance P),
      (answer (fuse c₀ u) = some (.align .abandon) ∨ answer (fuse c₀ u) = some (.probe .abandon) ∨
        answer (fuse c₀ u) = some (.name .abandon)) ∧ r = suspend declare (fuse c₀ u) none

A ruled-out axis cites a person's statement the model reads as refuting it on that ground
(`RefutesSupported`); an open item's disposition likewise stands only on a person's statement.
theorem ruled_out_by_person {c : Context P} (r : RuledOut c) : r.src.kind = .utterance

theorem disposed_by_utterance {c : Context P} {i : OpenItem} {s : Cite c}
    (ok : (dispositionCoord (P := P) i).admits s.kind) : s.kind = .utterance
-/

/-! ── TOOL GROUNDING ── -/
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed

inductive Annot | sense | observe | track | transform | dispatch | constitution | extension

inductive Op | detect | scan | absorb | pairAlign | extract | probe | narrow | name | declare
             | converge | seam

def grounding : Op → Annot × String
  | .detect    => (.sense, "Internal analysis: the deficit predicate over the utterance and the context; no external tool")
  | .scan      => (.observe, "artifact read, artifact search (conditional: no essence signal, or fewer than two cases in hand): the session context and the person's artifacts scanned for cases that could correspond; what was found is presented as candidates to recognize or replace, what was searched is said where nothing was found")
  | .absorb    => (.extension, "TextPresent+Proceed: a routed colimit-shaped signal accepted as activation ground, its cited essence-and-locator basis shown before Phase 1 as the routing detection's reading")
  | .pairAlign => (.constitution, "present the two cases side by side with every slot filled from the cases themselves and unmatched roles marked as such, and the four ways the answer can go (mandatory); artifact read, artifact search for the cases' own context; external fetch (conditional: the cases' domain lies outside the person's artifacts)")
  | .extract   => (.sense, "Internal analysis: the relation and the live axes over the committed correspondence and the space already built, written as your record; it grounds nothing")
  | .probe     => (.constitution, "present the probe case with every live axis it separates on screen together, each axis's support and the case that breaks it beside that axis's own verdict slot with what each verdict does to that axis, and before the gate what the live set becomes on each way the round can close (mandatory); external fetch (conditional: a probe drawn from outside the person's domain)")
  | .narrow    => (.sense, "Internal analysis: the probe answer read against the space — each Refutes rules its axis out with the person's ground, each Bounds and Undecided leaves it live, an AxisMissing extends the language")
  | .name      => (.constitution, "present name, rule, boundary, whatever stayed live, whether the budget is spent, and any contrary ground held about the naming (mandatory)")
  | .declare   => (.extension, "TextPresent+Proceed: at AlignmentSuspended, the alignment trace and the open trace, with the relation and live axes as the AI's extraction, and the dissent; what the next activation resumes from")
  | .converge  => (.extension, "TextPresent+Proceed: at CrystallizedAbstraction, the alignment trace, the boundary, every ruled-out axis beside its ground, the open trace, and the dissent; proceed with the crystallized abstraction")
  | .seam      => (.extension, "TextPresent+Proceed: at a user-declared chain naming the next protocol, proceed to it citing that source; this protocol declares no wired outbound edge, and every Constitution gate inside it and the next fires unchanged")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
-/

end Periagoge
```

## Mode Activation

`/induce` remains directly invocable. AI-guided activation requires a sensed essence whose name, scope, or position is still unsettled, and at least two concrete cases to correspond; detection stays silent. Existing abstractions awaiting comparison or validation route elsewhere, and a crystallized or suspended `(instance set, essence)` pair stays inactive for the session.

If an explicit invocation has no detectable essence signal, surface that scan result and invite the user to name what feels in process or withdraw. Prior-session recall may seed probe cases or neighbouring abstractions but never settles crystallization.

## Protocol

### User-facing realization

At Phase 1, put the two cases side by side and render the correspondence with every slot filled from what the cases themselves carry, marking any role the second case has no counterpart for. The user corrects a filling that is wrong rather than supplying one that is missing — saying that the second case carries no counterpart there is such a correction; which reading the correspondence supports is separated at Phase 3, never by an unfilled slot here. Materialize the `Aₐ` constructors as everyday-language options with anticipatable differential futures: go on with the correspondence as shown, correct a slot, align against a different partner, or stop here with nothing committed. `AsShown` and `Abandon` remain constitutive even when analysis favours the pairing. Ground both cases in the user's actual domain by artifact read/search; when that domain requires external fetch, cite its URL at the point of use.

At Phase 3, put every live axis the probe separates on screen at once, each row carrying that axis, what supports it, the case that breaks it, and its own verdict slot — refutes it, bounds it, or settles neither. Say that the rows are answered against each other rather than top to bottom, since what one axis makes of the case turns on how the others take it. Beside each verdict slot, state what that verdict does: refuting drops the axis to the ruled-out record with the user's ground and it is not proposed again; bounding places the case outside the axis and the axis survives; undecided leaves it live. Before the gate, state what the live set becomes on each way the round can close — how many axes are live now, that leaving one live moves the run to naming, and that refuting all of them suspends it — so the post-selection state is anticipatable before the verdicts are given rather than shown after them. Materialize `V` and the run-level `W` constructors as everyday-language options with anticipatable differential futures. A probe that separates nothing is not presented — draw another. A correction to the probe case itself is `Redraw` — the case is drawn again with the correction taken up, which spends no probe from the cap and leaves H unchanged.

At Phase 5, present the name, the rule, the boundary the near-misses drew, and anything still live. Materialize the `Nₐ` constructors the same way. When Phase 5 opened on the spent budget, say so before the gate: the probe budget is spent, and `NotYet` here records the gap and suspends the run rather than drawing another probe. `Confirm` and `Abandon` remain constitutive even when analysis favours one reading. Any contrary ground held about the naming — a reading the probe record does not bear, a rule the boundary contradicts — goes before the gate, and rides the closure if the user closes past it.

At either terminal, declare the alignment trace and the open trace before proceeding. Each open item takes its disposition from the user's closing answer: not blocking where the answer takes the run with the item shown open, deferred where it names the item for later work beside deferral words. An item no answer covered — one no gate showed, or a terminal no gate closed — is shown as undisposed rather than as not blocking. At a suspension, show the relation and the live axes as the AI's extraction, not as established.

Frame the correspondence currently being built or the reading currently being separated, rather than a progress fraction. Read `references/round-composition.md` before composing when terminology must remain stable, wording must be carried unchanged, material belongs to another round or trace, or phase order determines placement relative to the gate.

## Rules

- **Recognition over Recall**: Present structured options with anticipatable post-selection states and yield for the user's judgment.
- **Correspondence before naming**: Build the correspondence between concrete cases before proposing any name or rule for what they share. A name offered ahead of the correspondence conditions every later judgment on its own vocabulary, so the ordering is the operation rather than a presentation preference.
- **Alternatives stay visible**: Show every live reading at each gate, alongside the one the analysis currently favours. A single reading handed over on its own is the condition under which a judgment bends toward it hardest, so the alternatives are what make the user's answer their own.
- **Ruling out is recorded, not repeated**: When a reading is ruled out, record it with the user's own ground and never propose it again within the activation. What was already shown to lead nowhere is not offered as a choice; a reading the user names again returns to the live set by their word, with the ground that ruled it out shown beside it.
- **Probes separate rather than confirm**: Choose the next case for how well it tells the live readings apart, not for how well it fits the leading one. A case that every live reading predicts alike costs a round and settles nothing.
- **The name is a locator, not a compression**: Deliver the name together with the relation, the correspondence it was read off, and the boundary the near-misses drew. The name is what returns the user to those cases; it does not stand in for them.
- **Label as ground, not verdict**: Read the user's tentative label as the naming ground Phase 5 works from. It grounds the name and its provenance without fixing either, so what the label survives as stays a judgment made in the run.
- **Personalized grounding**: Draw cases and probes from the user's own domain and keep external provenance visible.
- **Periagoge boundary**: Form an abstraction around a sensed but unlocated essence. Comparison or validation of an already located abstraction remains outside this operation.
- **Round composition**: Compose each round in everyday language, keep each judgment beside its evidence and next-move implication, and place analysis before the gate.
- **Upstream misfit absorption**: Accept a routed colimit-shaped signal as activation ground and show its cited essence-and-locator basis before Phase 1, as the routing detection's reading rather than the user's own intuition.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change the form directly. Elements fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
