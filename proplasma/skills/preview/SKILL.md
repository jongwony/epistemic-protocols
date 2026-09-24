---
name: preview
description: "Divergent-discard instantiation. Fires when direction candidates cannot be recognized from descriptions. Type: (DirectionUnrecognizable, Hybrid, PREVIEW, DirectionProspect) → DirectionalContrast"
---

# Proplasma Protocol

Expose direction unknowns through divergent-discard instantiation before commitment. Type: `(DirectionUnrecognizable, Hybrid, PREVIEW, DirectionProspect) → DirectionalContrast`.

## Definition

**Proplasma** (πρόπλασμα): the preliminary clay model a sculptor shapes before committing to marble. A dialogical act for the moment right before a direction commitment when the candidate directions cannot be recognized from their descriptions: the AI derives the axes on which the candidates genuinely diverge, relays the drafted axes, placeholder policy, probe target set, and realization tier with the basis that chose each, instantiates two to four cheap placeholder probes that commit different values on those axes, presents them probe-first with a per-axis contrast, and the user constitutes the direction decision on recognized futures — or sends the draft back, the first send-back costing no re-fan budget. Probes are discard-committed instruments — never evidence, never promoted.

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
Proplasma(X) → preview(c, utterances), where c is the fused session context:
  Phase 0, first match wins: no imminent commitment or fewer than two candidates |
    futures recognizable from text | a routing row matches | a type guard fails → the relay
    with its basis → not activated
  fan(c): the spec relay — axes, placeholder policy, probe target set, realization tier, each
    with its basis; it yields no turn → instantiate the probes (each enters c as written) →
    contrast → [insufficient: the insufficiency arms] → present probe-first → Qdir → Stop
  next utterance u: c' := fuse(c, u) → verdict(c') →
    constitute (a probed direction selected, or a synthesis confirmed at Qmicro):
      harvest → cleanup_verify → assemble → DirectionalContrast
    synthesize: Qmicro → Stop
    materialize: budget unspent → fan over the composition | spent → the exhaustion relayed,
      Qmicro presents {Confirm}
    sendBack: the draft unsettled → a free fan over the revision | settled → the
      insufficiency arms
    insufficient: the insufficiency arms
    unprobed (a named candidate no probe materialized): the draft unsettled or the budget
      unspent → a fan over it | settled and spent → stand-down → EarlyExit
    interrogate: answered within placeholder discipline → Qdir again
    dissolve: cleanup_verify → DissolutionExit
    withdraw: cleanup_verify → EarlyExit
  insufficiency arms: budget unspent → one budgeted gap fan, contrast again |
    spent on a materialization → relay once and re-present Qdir, then stand-down → EarlyExit |
    spent on a gap → the draft unsettled and not yet relayed: relay once and re-present Qdir,
      otherwise → MisdiagnosisExit
  no utterance: the gate holds; nothing is constituted and nothing is discarded
-/

/-! ── MORPHISM ──
DirectionProspect
  → detect                  -- deficit predicate + 4-step routing (type guards: fake_data_sufficient, placeholder_fidelity)
  → derive_axes             -- divergence axis candidates (where the candidate directions must commit different values)
  → set_placeholder_policy  -- visible synthesis + non-evidence stamp + skeleton-faithful/data-fake split (draft)
  → relay_spec              -- spec relay: axes + policy + probe target set + realization tier drafted with the basis for each, relayed BEFORE any generation, and open to send-back at the direction gate
  → instantiate_probes      -- transform (∥ over the drafted target set, temp-isolated, artifact_ref registered)
  → contrast                -- per-axis juxtaposition → ContrastMap + ExposedUnknowns + CommonCommitments
  → present                 -- probe-first relay (probes one by one → contrast map → new unknowns)
  → constitute              -- direction gate: options point at probe-exposed futures (Select | Synthesize); the person constitutes the direction
  → harvest                 -- direction + deciding contrast rows + routed unknowns read BEFORE discard
  → cleanup_verify          -- per-probe discard verification → the discard trace
  → assemble                -- terminal record built from the harvest + the completed discard trace
  → DirectionalContrast
  -- primary-path codomain: DissolutionExit — the convergent stand-down the person closes — emits the enriched axes
  --   with its cited basis instead of this record: the deficit dissolved, so no resolution object is owed
requires: pre_commit(direction) ∧ |direction_candidates(X)| ≥ 2   -- runtime checkpoint (Phase 0)
deficit:  DirectionUnrecognizable                                  -- activation precondition (Layer 1/2)
preserves: commit_target_identity(X)   -- the pending commitment itself is unchanged; probes never mutate it; the context only grows
invariant: Contrast over Simulation    -- direction judgment rests on recognized materialized futures, not mental simulation
-/

namespace Proplasma

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

/-- `X`, `DirectionProspect`: a direction decision immediately before commitment, carrying its
    direction candidates — a design direction, an architecture fork, a UX shape, a plan branch,
    any pre-commit direction choice. Source-agnostic; read from the context. -/
abbrev DirectionProspect (P : Type) := Context P

abbrev Direction := String

/-- A declared divergence axis: a direction unknown on which the probes must commit different
    values. -/
abbrev DirectionAxis := String

/-- **Your judgments** at Phase 0: a direction commitment is imminent; the candidate
    directions. -/
opaque PreCommit : Context P → Prop
opaque candidates : Context P → List Direction

/-- **Your judgment**: the candidate futures are recognizable from their descriptions; a
    regular gate suffices. -/
opaque RecognizableFromText : Context P → Prop

/-- The sibling deficits the routing rows name. Each is a binding with its command as the hint;
    which protocol takes it is the session's. -/
inductive Deficit
  /-- ① a mapping against a target account already in play leaves its intended inferences
      uncertain (hint: /ground) -/
  | mappingUncertain
  /-- ② real evidence is required before the directions can be judged (hint: /inquire) -/
  | contextInsufficient
  /-- ③ the candidate field is thin — one or none (hint: /ideate) -/
  | candidateFieldUnderexpanded
  /-- ③ the frame itself is absent (hint: /frame) -/
  | frameworkAbsent
  /-- ③ the coordinates live implicit in externalized substrate (hint: /elicit) -/
  | abstractAporia

/-- **Your judgment**: the routing row that matches, first match wins; `none` where no row
    takes the case — candidates ≥ 2, evidence-free, placeholder-carriable — which is this
    protocol's own. -/
opaque routeRow : Context P → Option Deficit

/-- **Your judgments**, the type guards, both required for activation: the direction contrast
    holds with placeholder concreta alone; placeholder concretization carries the differential
    futures on the divergence axes without distortion — divergence lives in the skeleton, and
    fake data does not blur it. -/
opaque FakeDataSufficient : Context P → Prop
opaque PlaceholderFidelity : Context P → Prop

/-- Why Phase 0 does not activate; each is relayed with its basis. -/
inductive NotActivated
  /-- no imminent commitment, or fewer than two candidates; one or zero candidates is handed to
      row ③'s targets as a hint -/
  | requiresFail
  | noDeficit
  | routeAway (d : Deficit)
  /-- a type guard fails and no row matches: the decision stays at a regular gate -/
  | unfit

open Classical in
noncomputable def phase0 (c : Context P) : Option NotActivated :=
  if ¬ (PreCommit c ∧ 2 ≤ (candidates c).length) then some .requiresFail
  else if RecognizableFromText c then some .noDeficit
  else match routeRow c with
    | some d => some (.routeAway d)
    | none   => if FakeDataSufficient c ∧ PlaceholderFidelity c then none else some .unfit

/-- Visible synthesis (artifacts are overtly placeholder), the non-evidence stamp (probes are
    evidence for no claim), and the skeleton/data split (structure faithful to each direction;
    data values fake). -/
structure PlaceholderPolicy where
  visibleSynthesis  : String
  nonEvidenceStamp  : String
  skeletonDataSplit : String

/-- `vignette`: text-vignette probes, concrete placeholder-filled narration in session text, no
    file artifacts. `mockup`: real artifacts in temp isolation, optionally instantiated by
    parallel agents. -/
inductive RealizationTier | vignette | mockup

/-- The drafted spec. `tgt` is the probe target set: when the candidates exceed four, the draft
    names which are probed and why, and an unprobed candidate stays reachable at the direction
    gate — the cap is a presentation bound, not a silent truncation. A `SpecRevision` — a
    change to any element, in whichever direction the correction runs — revises it; on a
    materialization the target set stays the composition. -/
structure Spec where
  axes   : List DirectionAxis
  policy : PlaceholderPolicy
  tgt    : List Direction
  tier   : RealizationTier

/-- **Your record**: the spec your latest relay presented; `none` before the first. -/
opaque spec : Context P → Option Spec

/-- The target-set bound a fan owes: a contrast fan — the initial one or a gap refan — probes two
    to four directions; a materialization probes the composition, contrasted against every
    probe so far. -/
def TargetBound (materializing : Bool) (tgt : List Direction) : Prop :=
  if materializing then tgt ≠ [] else 2 ≤ tgt.length ∧ tgt.length ≤ 4

/-- How a probe is realized, carried on the probe itself: a Vignette's narration, re-presented
    as instantiated and never regenerated; or a Mockup's temp-isolated path, registered at
    creation. -/
inductive Realized
  | narration (text : String)
  | artifact (path : String)

structure Probe where
  direction    : Direction
  axesRealized : List (DirectionAxis × String)
  realized     : Realized

/-- **Your record**, read from the context: every probe instantiated so far, cumulative across
    re-fans; a discarded probe stays listed for the trace. -/
opaque probes : Context P → List Probe

def directions (c : Context P) : List Direction := (probes c).map (·.direction)

/-- A pre-commit check the person carries once the settled direction materializes into a
    committed action (`preCommit`), or a factual unknown needing real evidence now
    (`inquire`) — placeholders can never ground it. -/
inductive DownstreamRoute | preCommit | inquire

/-- A direction unknown newly exposed by the contrast, or recorded at an interrogation, tagged
    with its route when it is recorded; the harvest inherits the tag. -/
structure ExposedUnknown where
  text  : String
  route : DownstreamRoute

/-- Per axis in force, the futures each probe exposes on that axis. -/
abbrev ContrastMap := List (DirectionAxis × List (Direction × String))

/-- `common`: design decisions forced uniformly across all probes, reported so a shared premise
    is not mistaken for a divergence axis; recomputed over every probe at each contrast, since a
    re-fan can break an earlier fan's shared premise. -/
structure Contrast where
  map     : ContrastMap
  exposed : List ExposedUnknown
  common  : List String
  deriving Inhabited  -- elab: lets `contrast` be declared `opaque`

/-- **Your judgment**: the per-axis contrast over every probe so far. -/
opaque contrast : Context P → Contrast

/-- **Your record**: every exposed unknown so far, with the route it was tagged with when it was
    recorded. -/
opaque unknowns : Context P → List ExposedUnknown

/-- **Your judgment**: the contrast in force does not make the candidate futures recognizable on
    the axes in force — detected at contrast (an axis with no differentiated values across the
    probes), surfaced, never silently self-repaired. -/
opaque Insufficient : Context P → Prop

/-- What the single shared re-fan budget was spent on; it decides the still-insufficient
    branch. -/
inductive RefanKind | gap | materialization

/-- **Your record**, read from the relays: what the one budgeted re-fan was spent on; `none`
    while it is unspent. The draft's own correction spends nothing. -/
opaque refanKind : Context P → Option RefanKind

def BudgetLeft (c : Context P) : Prop := refanKind c = none

/-- **Your reading**: the person has answered the direction gate — Select or Synthesize — or
    sent the draft back once. -/
opaque SpecSettled : Context P → Prop

/-- **Your record**: an insufficiency relay has already re-presented the direction gate
    over the accumulated probes; each fires once. -/
opaque InsufficiencyRelayed : Context P → Prop

/-- **Your judgment**: the cited utterance settles direction `d` — a Select of a probed
    direction, or a Confirm at Qmicro of the synthesis the person composed. A response naming
    an unprobed candidate is never read as Select. -/
opaque DirectionSupported : Context P → Turn P → Direction → Prop

/-- The direction is the person's to constitute. -/
def directionCoord : Coord P Direction :=
  { admits := (· = .utterance), supports := DirectionSupported }

-- elab: an open witness lets the occupancy reading below be declared `opaque`.
instance {A : Type} {q : Coord P A} {c : Context P} : Inhabited (Occ q c) := ⟨.open_ none⟩

/-- **Your judgment**: the direction the person's latest answer constituted; `open_`
    otherwise. -/
opaque direction : (c : Context P) → Occ (directionCoord (P := P)) c

def filledValue {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Option A
  | .open_ _     => none
  | .filled a .. => some a

/-- **Your reading** of the contrast rows that made the constituted direction's future
    recognizable. It is your reading, shown as such, unless the person's utterance names the
    rows. -/
opaque decidingRows : Context P → ContrastMap

/-- **Your judgment**: the constituted direction has a mapping against a target account already in
    play whose intended inferences need an audit — a `/ground` next move to propose. -/
opaque groundTag : Context P → Option String

/-- Read before discard; it carries no discard trace. -/
structure Harvest where
  direction    : Direction
  decidingRows : ContrastMap
  unknowns     : List ExposedUnknown
  groundTag    : Option String

def harvestOf (c : Context P) : Option Harvest :=
  match filledValue (direction c) with
  | some d => some ⟨d, decidingRows c, unknowns c, groundTag c⟩
  | none   => none

/-- `fileDestroyed`: the path removed and verified absent (Mockup). `noFileArtifact`: a
    Vignette, nothing to destroy — discard is non-promotion, and the remnant text stays under the
    non-evidence stamp. `discardFailed`: attempted with one retry and still present; declared,
    never silent. -/
inductive Disposition
  | fileDestroyed
  | noFileArtifact
  | discardFailed (reason : String)

/-- **Your reading** of the cleanup observations: the disposition of the probe at this index. -/
opaque disposition : Context P → Nat → Option Disposition

/-- Every probe has a declared disposition. -/
def DiscardDeclared (c : Context P) : Prop :=
  ∀ i, i < (probes c).length → (disposition c i).isSome

/-- **Your record**: the contrary grounds you presented before the gate the closing utterance
    answered; attached to the closure; empty when there were none. -/
opaque dissent : Context P → List String

/-- **Your judgment**, at a misdiagnosis: the sibling deficit a routing row now names; `none`
    where no row matches — the candidates may simply not diverge — and the decision returns to a
    regular gate with the residual declared. -/
opaque misdiagnosisRow : Context P → Option Deficit

/-- What the fused context says the person did at the gate. Premise: one utterance carries one
    disposition; silence is none of them. -/
inductive Verdict
  /-- a probed direction selected, or the synthesis confirmed at Qmicro -/
  | constitute
  /-- a composition of the presented probes; opens Qmicro -/
  | synthesize
  /-- at Qmicro: re-fan the synthesis into new probes -/
  | materialize
  /-- any drafted element sent back — an axis, the policy, the tier, the target set — carrying
      its `SpecRevision` -/
  | sendBack
  /-- the contrast declared insufficient -/
  | insufficient
  /-- a candidate named that no probe materialized, judged on the accumulated probes -/
  | unprobed
  /-- a question about a probe: design intent answered within placeholder discipline, a factual
      unknown recorded with the `inquire` route; the gate is presented again unchanged -/
  | interrogate
  /-- the person accepts or declares that the sharpened description made the futures
      recognizable without probes, or that the activation premise collapsed -/
  | dissolve
  | withdraw
  deriving Inhabited  -- elab: lets `verdict` be declared `opaque`

/-- **Your judgment** on the whole latest utterance read with the context. -/
opaque verdict : Context P → Verdict

/-- `DirectionalContrast`, assembled after cleanup from the harvest read before it; `context`
    carries the discard trace. -/
structure DirectionalContrast (P : Type) where
  context : Context P
  harvest : Harvest
  dissent : List String

inductive EarlyCause
  | explicit
  /-- the budget spent and an unprobed candidate named: the choice moved outside the materialized
      set -/
  | unprobedStanddown
  /-- insufficiency repeated at the re-presented gate with the budget spent on a
      materialization -/
  | insufficiencyStanddown

inductive Outcome (P : Type)
  | notActivated (c : Context P) (why : NotActivated)
  | contrasted   (r : DirectionalContrast P)
  /-- `DissolutionExit`: a convergent stand-down the person closed; the enriched axes, the
      unknowns with their routes, the per-probe dispositions, and the pending re-fan target set
      go to the regular gate as live candidates -/
  | dissolved    (c : Context P) (dissent : List String)
  /-- `MisdiagnosisExit`: no direction constituted; `route` is the row now matching, or none -/
  | misdiagnosis (c : Context P) (route : Option Deficit)
  /-- `EarlyExit`: the partial trace, the residual declared; no direction constituted -/
  | withdrawn    (c : Context P) (why : EarlyCause)
  | holding      (c : Context P)

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
One round is one step of a structural recursion over the person's utterances; between two of
them a fan and its insufficiency arms run without a turn. `relay` is the spec relay: it presents
`spec` — scoped to the `SpecRevision` a re-fan carries — before anything is generated, meets
`TargetBound`, and records what a re-fan spends. The probes are then instantiated
(`.instantiate`; one per agent through `.instantiateDelegate` on the Mockup tier). `respond` is
the presentation ending at Qdir, or at Qmicro after a synthesis, with any insufficiency relay due.
-/

/-- **Your instantiation** under the relayed spec: each probe as written, its realization
    registered at creation. Existing project files stay unchanged. -/
opaque instantiate : Context P → List (Evidence P)

def fan (relay : Context P → Response P) (c : Context P) : Context P :=
  let c₁ := c ++ [(relay c).val]
  c₁ ++ (instantiate c₁).map (·.val)

/-- **Your cleanup**: per probe, the destruction step read off its realization, then the
    verification of absence; a failure retries once, then is observed as `discardFailed`. What it
    leaves is `DiscardDeclared`. -/
opaque cleanup : Context P → List (Evidence P)

def discard (c : Context P) : Context P := c ++ (cleanup c).map (·.val)

/-- Where a step lands: the next presentation, or an exit. -/
inductive Next (P : Type)
  | gate (c : Context P)
  | done (o : Outcome P)

open Classical in
/-- The budget already spent: what it was spent on decides. -/
noncomputable def spentArms (c : Context P) : Next P :=
  match refanKind c with
  | some .materialization =>
    if InsufficiencyRelayed c then .done (.withdrawn (discard c) .insufficiencyStanddown)
    else .gate c
  | _ =>
    if ¬ SpecSettled c ∧ ¬ InsufficiencyRelayed c then .gate c
    else .done (.misdiagnosis (discard c) (misdiagnosisRow c))

open Classical in
/-- Entered with the contrast insufficient, whether detected at contrast or declared at the gate:
    one budgeted gap fan while the budget is unspent, and the spent arms otherwise. -/
noncomputable def insufficiencyArms (relay : Context P → Response P) (c : Context P) : Next P :=
  if BudgetLeft c then
    let c₂ := fan relay c
    if Insufficient c₂ then spentArms c₂ else .gate c₂
  else spentArms c

open Classical in
noncomputable def afterFan (relay : Context P → Response P) (c : Context P) : Next P :=
  if Insufficient c then insufficiencyArms relay c else .gate c

def constituted (c : Context P) (h : Harvest) : Outcome P :=
  .contrasted { context := discard c, harvest := h, dissent := dissent c }

open Classical in
/-- One person utterance, read against `c`, the context before it. -/
noncomputable def step (relay : Context P → Response P) (c c' : Context P) : Next P :=
  match verdict c' with
  | .constitute   =>
    match harvestOf c' with
    | some h => .done (constituted c' h)
    | none   => .gate c'
  | .synthesize   => .gate c'
  | .interrogate  => .gate c'
  | .materialize  => if BudgetLeft c' then afterFan relay (fan relay c') else .gate c'
  | .sendBack     => if SpecSettled c then insufficiencyArms relay c' else afterFan relay (fan relay c')
  | .insufficient => insufficiencyArms relay c'
  | .unprobed     =>
    if ¬ SpecSettled c ∨ BudgetLeft c' then afterFan relay (fan relay c')
    else .done (.withdrawn (discard c') .unprobedStanddown)
  | .dissolve     => .done (.dissolved (discard c') (dissent c'))
  | .withdraw     => .done (.withdrawn (discard c') .explicit)

noncomputable def preview (relay respond : Context P → Response P) :
    Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    match step relay c (fuse c u) with
    | .gate g => preview relay respond (g ++ [(respond g).val]) us
    | .done o => o

noncomputable def start (relay respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  match phase0 c with
  | some why => .notActivated c why
  | none =>
    match afterFan relay (fan relay c) with
    | .gate g => preview relay respond (g ++ [(respond g).val]) us
    | .done o => o

/-! ── LOOP ──
Probe target set 2–4 for a contrast fan (`TargetBound`). Re-fan bound: at most one budgeted
re-fan per activation — a contrast-insufficiency re-fan and a synthesis materialization share
it, and what it was spent on decides the still-insufficient branch. Interrogation and an
insufficiency declaration generate no probes; the first send-back of the relayed draft re-fans
without spending the budget, and a later one rides it. The person can withdraw at any gate:
cleanup_verify runs, the partial trace is presented, the residual declared.
-/

/-!
Silence constitutes and discards nothing.
theorem silence (relay respond : Context P → Response P) (c : Context P) :
    preview relay respond c [] = .holding c

No probe commits a value before the spec relay: every fan holds the relay turn ahead of what
instantiation wrote.
theorem relay_before_instantiation (relay : Context P → Response P) (c : Context P) :
    ∃ t, fan relay c = c ++ [(relay c).val] ++ t

With the budget spent, an insufficiency fans nothing further.
theorem spent_budget_no_refan (relay : Context P → Response P) (c : Context P)
    (h : ¬ BudgetLeft c) : insufficiencyArms relay c = spentArms c

A materialization asked for with the budget spent generates nothing: Qmicro is presented again,
with Confirm its option.
theorem materialize_unavailable (relay : Context P → Response P) (c c' : Context P)
    (hv : verdict c' = .materialize) (hb : ¬ BudgetLeft c') : step relay c c' = .gate c'
-/

/-! ── CONVERGENCE ──
converged: a DirectionalContrast — a direction the person constituted, harvested before
discard, with every probe's disposition declared — or a DissolutionExit the person closed.
EarlyExit and MisdiagnosisExit are not convergent. Convergence evidence: at terminal, present the
transformation trace over the steps actually completed — at DirectionalContrast, each axis in
force mapped to the contrast rows that made its futures recognizable (your reading unless the
person named them), the constituted direction, each exposed unknown with its downstream route,
the per-probe discard disposition (`DiscardDeclared`), and the dissent attached to the closure.
Each other terminal presents its own relay payload (TOOL GROUNDING). The framing readout names
the work in play — axes being drafted, probes under contrast, direction being constituted,
discard being verified — never a completion tally. Demonstrated, not asserted.
-/

/-!
The harvest is read before discard, and the record is assembled from it after cleanup.
theorem harvest_before_discard (relay respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (r : DirectionalContrast P)
    (h : preview relay respond c us = .contrasted r) :
    ∃ c₀, harvestOf c₀ = some r.harvest ∧ r.context = discard c₀

A dissolution is closed only by a person's utterance; the AI's reading of one closes nothing.
theorem dissolved_by_person (relay respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (c₁ : Context P) (d : List String)
    (h : preview relay respond c us = .dissolved c₁ d) :
    ∃ (c₀ : Context P) (u : Utterance P), verdict (fuse c₀ u) = .dissolve ∧ c₁ = discard (fuse c₀ u)

The direction is constituted only by a person's statement.
theorem direction_by_utterance {c : Context P} {s : Cite c}
    (ok : (directionCoord (P := P)).admits s.kind) : s.kind = .utterance
-/

/-! ── TOOL GROUNDING ── -/
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed

inductive Annot | sense | observe | track | transform | dispatch | constitution | extension

inductive Op | detect | noDeficitRelay | routeAwayRelay | unfitRelay | requiresFailRelay
             | deriveAxes | draftPolicy | specRelay | dissolutionRelay | instantiate
             | instantiateDelegate | contrast | present | qdir | qmicro | interrogateAnswer
             | materializeUnavailableRelay | insufficiencyAfterMaterializationRelay
             | insufficiencyBeforeSettlementRelay | insufficiencyStanddownRelay | harvest
             | cleanup | cleanupVerify | assemble | converge | withdraw | standDownRelay
             | misdiagnosis | seam

def grounding : Op → Annot × String
  | .detect            => (.sense, "Internal analysis: the deficit predicate and the 4-step routing, first match wins; no external tool")
  | .noDeficitRelay    => (.extension, "TextPresent+Proceed: futures recognizable from text — the finding with its reasoning; a regular gate suffices; not activated")
  | .routeAwayRelay    => (.extension, "TextPresent+Proceed: routing rows ①–③ — the matched row with its basis and its command as a hint; which protocol takes it is the session's; not activated")
  | .unfitRelay        => (.extension, "TextPresent+Proceed: a type guard fails and no routing row matches — the failed guard and why; the decision stays at a regular gate; not activated")
  | .requiresFailRelay => (.extension, "TextPresent+Proceed: no imminent commitment, or fewer than two candidates — the failed requirement; one or zero candidates points to row ③'s targets as hints — /ideate for the thin field, /frame and /elicit for their narrower cases; not activated")
  | .deriveAxes        => (.sense, "Internal analysis: divergence axis candidates from the candidate directions")
  | .draftPolicy       => (.sense, "Internal analysis: the placeholder policy draft — visible synthesis, non-evidence stamp, skeleton-data split")
  | .specRelay         => (.extension, "TextPresent+Proceed: the drafted spec whole — divergence axes, placeholder policy, probe target set, realization tier — each with the basis that chose it and, where the target set leaves a candidate unprobed, why; fires before any probe generation, so no axis commits a probe value before it was relayed with its basis; yields no turn and carries the standing affordance to send any of it back at the direction gate, the first send-back riding no budget; on a re-fan it is presented scoped to the SpecRevision that re-fan carries, before that re-fan generates anything, and it records what the re-fan spends; where you read the futures recognizable without probes, or the premise collapsed, it says so with its basis and closes nothing")
  | .dissolutionRelay  => (.extension, "TextPresent+Proceed: when the person accepts or declares that the sharpened description made the futures recognizable without probes, or that the activation premise collapsed — state the basis, the sharpened axes themselves, and hand to the regular gate the enriched axes with every exposed unknown and its route and, wherever probes exist, the per-probe dispositions from cleanup_verify plus the pending re-fan target set as live candidates (a person-constituted candidate never dies with the stand-down); attach any dissent; stand down as DissolutionExit — a success, not an abandonment")
  | .instantiate       => (.transform, "artifact write, environment run: temp-isolated placeholder probes over the target set, each realization registered at creation; existing project files never modified; the Vignette tier emits session text only, recorded on the probe as its narration")
  | .instantiateDelegate => (.dispatch, "delegate (conditional, Mockup tier; parallel topology: one probe per agent, each temp-isolated with its path registered; subordinate to the active runtime policy)")
  | .contrast          => (.sense, "Internal analysis: per-axis juxtaposition over every probe so far, the exposed unknowns tagged with their routes, and the common commitments recomputed over every probe; a new axis relayed on a re-fan predates earlier probes — their positions on it are re-derived from their artifacts where those carry them, and the cell is declared undifferentiated where they do not")
  | .present           => (.extension, "TextPresent+Proceed: probe-first order — probes one by one, each from its realization, the narration re-presented as instantiated and a Mockup walked through, never regenerated → the per-axis contrast map with the common commitments declared → newly exposed unknowns; any contrary ground held about a direction; table-first re-abstracts and reproduces the deficit")
  | .qdir              => (.constitution, "present: mandatory direction gate — one concrete Select per probe-exposed direction plus Synthesize, each option pointing at the future it settles; interrogating a probe, declaring the contrast insufficient or sending back any drafted element, naming an unprobed candidate, and withdrawing are declared in the pre-gate text, never as peer options")
  | .qmicro            => (.constitution, "present (conditional: fires on Synthesize): Confirm settles the synthesis now; Materialize re-fans it into new probes, spending the shared budget; only the person can judge whether the synthesis is already recognized; with the budget spent the option set is Confirm")
  | .interrogateAnswer => (.extension, "TextPresent+Proceed: free-response pathway, not a gate option — design-intent answers within placeholder discipline; a factual unknown recorded as an exposed unknown with the inquire route; the gate is presented again unchanged")
  | .materializeUnavailableRelay => (.extension, "TextPresent+Proceed: Materialize requested with the shared re-fan budget spent — state the exhaustion with its basis; Qmicro presents Confirm")
  | .insufficiencyAfterMaterializationRelay => (.extension, "TextPresent+Proceed: the budget spent on the person's own materialization and the contrast still insufficient — state it with its basis and present the direction gate again over the accumulated probes, where the synthesis's probe is Selectable beside the original directions; once")
  | .insufficiencyBeforeSettlementRelay => (.extension, "TextPresent+Proceed: your own contrast detections spent the budget before the person answered any gate — state the insufficiency with its basis and present the direction gate again over the accumulated probes, so the draft's free first send-back, a Select, or a Synthesize stays reachable; once; a repeated insufficiency after it takes the MisdiagnosisExit arm")
  | .insufficiencyStanddownRelay => (.extension, "TextPresent+Proceed: repeated insufficiency at the re-presented gate with the budget spent on a materialization — state that the accumulated contrast cannot make the futures recognizable and no re-fan remains; relay the contrast as context to the regular gate; cleanup_verify enforced; EarlyExit")
  | .harvest           => (.sense, "Internal analysis: the constituted direction, the deciding contrast rows marked as your reading unless the person named them, the routed unknowns, and any GroundTag, read from the context before discard")
  | .cleanup           => (.transform, "environment run: the destruction step — per-probe artifact destruction, one retry on failure; every exit with probes runs it first")
  | .cleanupVerify     => (.observe, "environment run, artifact read: the verification step closing the same sequence — each Path verified absent after its destruction; a disposition observed per probe")
  | .assemble          => (.sense, "Internal analysis: the terminal record built from the harvest and the completed discard trace — after cleanup, never before")
  | .converge          => (.extension, "TextPresent+Proceed: the transformation trace — axes → deciding contrast rows → direction; unknowns with routes; per-probe discard disposition; the dissent attached")
  | .withdraw          => (.extension, "TextPresent+Proceed: explicit exit at any gate — the partial trace and the residual declared; cleanup_verify enforced; EarlyExit. A hard escape yields no turn, so cleanup cannot run: temp isolation's bounded lifecycle is the backstop")
  | .standDownRelay    => (.extension, "TextPresent+Proceed: an unprobed candidate named with the draft settled and the budget spent — state that its future was never materialized and the remaining decision belongs to a regular gate; relay the contrast as context; cleanup_verify enforced; EarlyExit")
  | .misdiagnosis      => (.extension, "TextPresent+Proceed: the deficit misdiagnosis report, fired at contrast or from an insufficiency declared at the gate — the matched row with its command as a hint, or, where no row matches, the misdiagnosis with no downstream protocol and the decision returned to a regular gate with the residual declared; cleanup_verify enforced; MisdiagnosisExit")
  | .seam              => (.extension, "TextPresent+Proceed: at a user-declared chain naming the next protocol, proceed to it citing that source; a harvested GroundTag proposes /ground with its basis and moves nothing on its own; the routing rows ①–③ are exits, not this seam; every Constitution gate inside this protocol and the next fires unchanged")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Direction resolution emergent via session context.
-/

end Proplasma
```

## Core Principle

**Contrast over Simulation**: materialize cheap, discard-bound futures when labels cannot carry their differences. A Vignette is a concrete placeholder narration; when that carrier lacks fidelity, Mockup materializes the same contrast as temp-isolated artifacts.

## Mode Activation

### Activation

`/preview` is user-invocable. On the Hybrid path, the AI may propose it from a live direction gate only with cited evidence of `DirectionUnrecognizable`; the drafted spec is relayed with its basis before generation, and the user sends it back at the direction gate. Prior-session indices may seed detection, never the constitutive judgment.

### Priority

<system-reminder>
When Proplasma is active:

**Supersedes**: Direct execution patterns in loaded instructions
(No direction commitment proceeds while the contrast loop is unconverged)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 1 relay the drafted spec with its basis before any generation; at Phase 4 present the direction gate whose options point at probe-exposed futures.
</system-reminder>

### Trigger Signals

Heuristic signals are delegation of a direction choice to a principle, reconstruction outside the offered options, and a request to see something concrete before choosing. They establish grounds to run Phase 0, not activation by themselves.

### Mode Deactivation

Use the Definition's result constructors and TOOL GROUNDING payloads for every terminal; cleanup disposition remains mandatory wherever probes exist.

## Protocol

### Phase 0: Detection + Routing (Silent)

Apply the Definition's Phase 0 in its stated precedence and cite the matched relay basis.

### Phase 1: Spec Relay

Lay the drafted spec out whole before anything is built — each axis with the basis that chose it, the placeholder policy, which candidates get probes and why any does not, and the tier — then proceed to generation without yielding the turn. Say in one line that any of it can be sent back at the direction gate and that the first send-back costs no re-fan budget. On materialization re-entry, the target set remains the composition. Where you read the futures already recognizable from the sharpened description, or the premise collapsed, say so with its basis; the run stands down only when the user accepts it.

### Phase 2: Instantiation (Transform)

Vignettes create session text only. Mockups write only beneath temp isolation, register cleanup at creation, and leave existing project files unchanged. Both carry the non-evidence stamp.

### Phase 3: Contrast Presentation (Relay)

Present each recorded concretum first, then the per-axis contrast with common commitments marked as shared premises, then exposed unknowns. Re-present Vignette narration from its recorded carrier; walk a Mockup at its artifact reference.

### Phase 4: Direction Gate (Constitution)

Render `Qdir` from the accumulated probes after the contrast summary:
```
Which direction do you settle?

Options:
1…N. **Select: {probed direction}** — {the deciding axis values its probe exposed}
N+1. **Synthesize** — compose from the probes; then confirm, or materialize when the shared budget permits
```
Name the free-response paths from `Direction-gate response discipline` before this gate; they are not numbered direction options. When Materialize is asked for with the shared budget spent, state the exhaustion and present `Qmicro` with Confirm.

### Phase 5: Harvest → Discard (in this order)

Accept the constituted direction before cleanup: a `DiscardFailed` disposition triggers the manual-cleanup handoff but does not revoke that direction. Persist only the Definition's terminal record; probe detail remains session-local.

## UX Safeguards

Keep placeholder status visible in every probe and contrast. A Mockup is sandbox matter, not a project edit; cleanup disposition reports artifact survival, not whether the user's direction was accepted.

## Rules

- **Direction-gate response discipline**: `Select` accepts only an accumulated probe direction; an unprobed candidate follows the typed free-response branch. Name probe questions, insufficiency, a send-back of the drafted spec, withdrawal, and unprobed candidates before `Qdir`, not as peer options. Answer design-intent questions within placeholder discipline, record factual unknowns for `/inquire`, and state which axis an analogy weights. Route the pre-commit check to `/inquire` as well once the direction becomes committed; propose `/ground` when a direction's mapping against an account already in play needs its intended inferences audited — the proposal moves nothing until the user takes it up.
- **Draft relayed with its basis**: relay every axis, the policy, the target set, and the tier with the basis that chose it and the affordance to send it back, then generate; the first send-back of the draft re-fans without spending the shared budget, and a later one rides it.
- **One shared re-fan**: gap repair and synthesis materialization consume the same budget. What it was spent on determines the exhausted-budget ending exactly as the Definition specifies; a materialized synthesis remains among the accumulated selectable probes.
- **Closure by the user**: The direction and a dissolution are closed only by the user's utterance. Before `Qdir` and `Qmicro`, show any contrary ground you hold about a direction; where the user closes with that ground standing, attach it to the closure record. Which contrast rows decided is your reading, shown as yours unless the user names them.
- **Harvest before discard**: retain only the constituted direction, deciding contrast rows, and routed unknowns before cleanup. Cleanup produces the discard trace; assemble the durable record afterward, leaving probe detail session-local.
- **Round composition**: use everyday language, put evidence and differential implications before the gate, and leave the gate to the question and options. Read `references/round-composition.md` before composing when wording must persist across rounds or phase placement is material.
- **Form feedback**: choose each round's density from the current request; carry an explicit form preference until countermanded. Change the open aspects of form directly, preserve content, order, cadence, and turn boundaries fixed elsewhere, and state both the adjustment and any overlapping constraint that remains.
