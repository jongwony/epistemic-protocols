---
name: preview
description: "Divergent-discard instantiation. Fires when direction candidates cannot be recognized from descriptions. Type: (DirectionUnrecognizable, Hybrid, PREVIEW, DirectionProspect) → DirectionalContrast"
---

# Proplasma Protocol

Expose direction unknowns through divergent-discard instantiation before commitment. Type: `(DirectionUnrecognizable, Hybrid, PREVIEW, DirectionProspect) → DirectionalContrast`.

## Definition

**Proplasma** (πρόπλασμα): the preliminary clay model a sculptor shapes before committing to marble. A dialogical act for the moment right before a direction commitment when the candidate directions cannot be recognized from their descriptions: the AI derives the axes on which the candidates genuinely diverge, relays the drafted axes, placeholder policy, probe target set, and realization tier with the basis that chose each, instantiates cheap placeholder probes that commit different values on those axes, presents them probe-first with a per-axis contrast, and the user constitutes the direction decision on recognized futures — or asks to see something no probe has materialized yet, and the AI fans over that. Probes are discard-committed instruments — never evidence, never promoted.

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
Proplasma(X) → start(c) → preview(c, utterances), where c is the fused session context:
  start: Phase 0, first match wins: no imminent commitment or fewer than two candidates |
    futures recognizable from text | a routing row matches | a type guard fails → the relay with
    its basis → not activated
  fan(c): the spec relayed whole — axes, placeholder policy, probe target set, realization tier,
    each with its basis, and on every later fan the ledger of what changed — before anything is
    generated; it yields no turn → the probes, each entering c as written
  round: present probe-first → the per-axis contrast with common commitments → exposed unknowns →
    your readings with their basis (an insufficient contrast with the revision you propose, a
    sibling deficit, futures already recognizable or a collapsed premise, contrary grounds) →
    Qdir → Stop
  next utterance u: c' := fuse(c, u) →
    [the person constitutes d ∧ covered]       harvest → cleanup_verify → DirectionalContrast
    [the person dissolves the run]             cleanup_verify → DissolutionExit
    [the person stops]                         cleanup_verify → EarlyExit
    [the person names another protocol]        cleanup_verify → routed
    [the person asks to see what no probe materialized — a revised spec, a composition, a
      named candidate]                         fan(c') → round
    [otherwise]                                answered — a question about a probe within
                                               placeholder discipline, a composition whose
                                               intent is unclear asked about → round
  no utterance: the gate holds; nothing is constituted, generated, or discarded
-/

/-! ── MORPHISM ──
DirectionProspect
  → detect                  -- deficit predicate + 4-step routing (type guards: fake_data_sufficient, placeholder_fidelity)
  → derive_axes             -- divergence axis candidates (where the candidate directions must commit different values)
  → set_placeholder_policy  -- visible synthesis + non-evidence stamp + skeleton-faithful/data-fake split (draft)
  → relay_spec              -- the spec whole with the basis for each element, relayed BEFORE any generation; on a later fan, with the ledger of what changed
  → instantiate_probes      -- transform (∥ over the drafted target set, temp-isolated, artifact_ref registered)
  → contrast                -- per-axis juxtaposition → ContrastMap + ExposedUnknowns + CommonCommitments
  → present                 -- probe-first relay (probes one by one → contrast map → new unknowns → your readings)
  → constitute              -- the person constitutes the direction with its deciding evidence and your contrary grounds in view
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
invariant: after activation only the person closes; your readings settle none of the closings
The steps between detect and constitute are how you work toward recognizable futures; the contract
fixes the deficit and its resolution, the one coordinate only the person fills — the closing — the
closings themselves, and the orderings the premises ground: the spec relayed before any probe is
generated, and the harvest read before anything is discarded.
-/

namespace Proplasma

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

/-- `X`, `DirectionProspect`: a direction decision immediately before commitment, carrying its
    direction candidates — a design direction, an architecture fork, a UX shape, a plan branch,
    any pre-commit direction choice. Source-agnostic; read from the context. -/
abbrev DirectionProspect (P : Type) := Context P

abbrev Direction := String

/-- A declared divergence axis: a direction unknown on which the probes must commit different
    values. -/
abbrev DirectionAxis := String

/-- **Your judgment** at Phase 0: a direction commitment is imminent. A question about what one
    option means, or what doing it would involve, asks for a description; it is not a direction
    decision, and it is answered rather than previewed. -/
axiom PreCommit : Context P → Prop
/-- **Your judgment** at Phase 0: the candidate directions. -/
axiom candidates : Context P → List Direction

/-- **Your judgment**: the candidate futures are recognizable from their descriptions; a
    regular gate suffices. -/
axiom RecognizableFromText : Context P → Prop

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
  /-- ③ the coordinates live implicit in externalized substrate (hint: /elicit) -/
  | abstractAporia

/-- **Your judgment**: the routing row that matches, first match wins; `none` where no row
    takes the case — candidates ≥ 2, evidence-free, placeholder-carriable — which is this
    protocol's own. -/
axiom routeRow : Context P → Option Deficit

/-- **Your judgment**, the first type guard: the direction contrast holds with placeholder concreta
    alone — no real evidence required. -/
axiom FakeDataSufficient : Context P → Prop
/-- **Your judgment**, the second type guard: placeholder concretization carries the differential
    futures on the divergence axes without distortion — divergence lives in the skeleton, and
    fake data does not blur it. -/
axiom PlaceholderFidelity : Context P → Prop

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
def phase0 (c : Context P) : Option NotActivated :=
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

/-- The drafted spec: the divergence axes, the placeholder policy, the probe target set, and the
    realization tier. -/
structure Spec where
  axes   : List DirectionAxis
  policy : PlaceholderPolicy
  tgt    : List Direction
  tier   : RealizationTier

/-- **Your record**: the spec your latest relay presented; `none` before the first. Its target set
    is your judgment of what to materialize now: enough that at least two futures stand in view
    once the probes already made are counted — a candidate the person named, or a composition,
    can be probed alone against them — and few enough to take in at once, about four new probes a
    fan; where candidates wait, the draft names which and why, and each stays reachable at the
    gate. -/
axiom spec : Context P → Option Spec

/-- What a ledger line records. -/
inductive LedgerKind
  /-- the person's own send-back or edit -/
  | personEdit
  /-- a spec element you re-drew because an edit forces it -/
  | necessary
  /-- a spec element you re-drew because you propose it -/
  | proposal

/-- One change to the spec since the last relay. -/
structure LedgerLine where
  change : String
  cause  : Option String
  kind   : LedgerKind

/-- **Your record**: what changed in the spec since the previous relay, the person's edits first;
    empty on the first relay. -/
axiom ledger : Context P → List LedgerLine

/-- How a probe is realized, carried on the probe itself: a Vignette's narration, re-presented
    as instantiated and never regenerated; or a Mockup's temp-isolated path, registered at
    creation. -/
inductive Realized
  | narration (text : String)
  | artifact (path : String)

def Realized.location : Realized → Option String
  | .narration _ => none
  | .artifact p  => some p

structure Probe where
  direction    : Direction
  axesRealized : List (DirectionAxis × String)
  realized     : Realized

/-- **Your record**, read from the context: every probe instantiated so far, cumulative across
    fans; a discarded probe stays listed for the trace. -/
axiom probes : Context P → List Probe

def directions (c : Context P) : List Direction := (probes c).map (·.direction)

/-- A pre-commit check the person carries once the settled direction materializes into a
    committed action (`preCommit`), or a factual unknown needing real evidence now
    (`inquire`) — placeholders can never ground it. -/
inductive DownstreamRoute | preCommit | inquire

/-- A direction unknown exposed by the contrast, or recorded at a question about a probe, with the
    route it carries. -/
structure ExposedUnknown where
  text  : String
  route : DownstreamRoute

/-- Per axis in force, the futures each probe exposes on that axis. -/
abbrev ContrastMap := List (DirectionAxis × List (Direction × String))

/-- `common`: design decisions forced uniformly across all probes, reported so a shared premise
    is not mistaken for a divergence axis; recomputed over every probe at each contrast, since a
    later fan can break an earlier fan's shared premise. -/
structure Contrast where
  map     : ContrastMap
  exposed : List ExposedUnknown
  common  : List String

/-- **Your judgment**: the per-axis contrast over every probe so far. A new axis relayed on a
    later fan predates earlier probes: their positions on it are re-derived from their artifacts
    where those carry them, and the cell is declared undifferentiated where they do not. -/
axiom contrast : Context P → Contrast

/-- **Your record**: every exposed unknown with its route, each route read on the context as it now
    stands. -/
axiom unknowns : Context P → List ExposedUnknown

/-- **Your judgment**: the contrast in force does not make the candidate futures recognizable on
    the axes in force — an axis with no differentiated values across the probes. Shown with its
    basis and the spec revision you propose; you do not fan over it on your own. -/
axiom Insufficient : Context P → Prop

/-- **Your reading**: a sibling deficit a routing row now names — the candidates may simply not
    diverge, or another deficit fits — shown with its basis and the command as a hint; `none`
    where none does. It closes nothing. -/
axiom siblingReading : Context P → Option Deficit

/-- **Your reading**: the futures are already recognizable from the sharpened description, or the
    activation premise has collapsed, with its basis; `none` otherwise. It closes nothing. -/
axiom dissolutionReading : Context P → Option String

/-- **Your record**: the contrary grounds you showed before the person's answers — a direction
    whose future no probe materialized, a probe you read as not carrying its direction, a closing
    you would weigh otherwise — attached to the closing when the person closes over them; empty
    when there were none. -/
axiom dissent : Context P → List String

/-- How the person ends the run. -/
inductive Closing
  /-- settle this direction: a probed one, a composition of the probes, or a candidate no probe
      materialized -/
  | constitute (d : Direction)
  /-- the futures are recognizable without further probes, or the activation premise collapsed:
      no preview is owed -/
  | dissolve
  /-- stop here, no direction constituted -/
  | stop
  /-- go on to the protocol the person names -/
  | route (target : String)

/-- **Your judgment**: the cited turn closes the run this way, read against the context as it now
    stands, the order of its turns included: a closing said before a later round was presented
    was answered by that round. Whatever form the turn takes — an option number, a restated goal,
    a side remark — it constitutes only what its words settle. A composition that says to go with
    it constitutes it; one that asks to see it, or a candidate named to be seen, closes nothing;
    where the intent is unclear, nothing closes and the next round asks. -/
axiom ClosingSupported : Context P → Turn P → Closing → Prop

/-- Only the person closes. -/
def closeCoord : Coord P Closing :=
  { admits := (·.val = .person), supports := ClosingSupported }

/-- **Your reading**: the person's closing; `open_` until one reaches it. -/
axiom closing : (c : Context P) → Occ (closeCoord (P := P)) c

def filledValue {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Option A
  | .open_ _     => none
  | .filled a .. => some a

/-- **Your judgment**, the adoption condition: the direction a constitution takes was shown with
    what decides it — its probe and the contrast rows, or for a composition the probes it composes
    — together with your contrary grounds, on the round the closing answered. A direction no probe
    materialized is covered only once the ground that its future was never materialized was shown
    and the person settles it over that ground. Where anything would be taken unseen, the round is
    presented again with it. -/
axiom Covered : Context P → Prop

/-- **Your judgment**: the person's turns, read against the context as it now stands, ask to see
    something no probe has materialized — a spec element sent back (an axis, the policy, the tier,
    the target set, the probe material), a composition to be seen, a named candidate, or the
    revision you proposed taken up. -/
axiom FanRequested : Context P → Prop

/-- **Your reading** of the contrast rows that made `d`'s future recognizable. It is your reading,
    shown as such, unless the person's words name the rows; empty where no probe materialized
    `d`. -/
axiom decidingRows : Context P → Direction → ContrastMap

/-- **Your judgment**: the constituted direction has a mapping against a target account already in
    play whose intended inferences need an audit — a `/ground` next move to propose. -/
axiom groundTag : Context P → Option String

/-- Read before discard; it carries no discard trace. `probed` says whether a probe materialized
    the direction. -/
structure Harvest where
  direction    : Direction
  probed       : Bool
  decidingRows : ContrastMap
  unknowns     : List ExposedUnknown
  groundTag    : Option String

def harvestOf (c : Context P) (d : Direction) : Harvest :=
  ⟨d, (directions c).contains d, decidingRows c d, unknowns c, groundTag c⟩

/-- `fileDestroyed`: the path removed and verified absent (Mockup). `noFileArtifact`: a
    Vignette, nothing to destroy — discard is non-promotion, and the remnant text stays under the
    non-evidence stamp. `discardFailed`: attempted with one retry and still present, or never
    verified; declared, never silent. -/
inductive Disposition
  | fileDestroyed
  | noFileArtifact
  | discardFailed (reason : String)

/-- **Your reading** of the cleanup observations: the disposition observed for the probe at this
    index; `none` where no observation reached it. -/
axiom observed : Context P → Nat → Option Disposition

/-- Every probe's disposition: what cleanup observed, or a declared failure where nothing was
    observed. -/
def disposition (c : Context P) (i : Nat) : Disposition :=
  (observed c i).getD (.discardFailed "not verified")

/-- One probe's line in the discard trace: which probe, which direction, where it lived, and what
    became of it. -/
structure TraceEntry where
  index       : Nat
  direction   : Direction
  location    : Option String
  disposition : Disposition

def discardTrace (c : Context P) : List TraceEntry :=
  (probes c).zipIdx.map fun (p, i) => ⟨i, p.direction, p.realized.location, disposition c i⟩

/-- `DirectionalContrast`, assembled after cleanup from the harvest read before it. What persists
    is the harvest, the discard trace, and the dissent; `context` is what their readings point
    into, and probe detail stays session-local. -/
structure DirectionalContrast (P : Type) where
  context : Context P
  harvest : Harvest
  trace   : List TraceEntry
  dissent : List String

/-- What a run hands on when it ends without a direction: the unknowns with their routes, the
    discard trace, and the dissent. -/
structure Closed (P : Type) where
  context  : Context P
  unknowns : List ExposedUnknown
  trace    : List TraceEntry
  dissent  : List String

inductive Outcome (P : Type)
  | notActivated (c : Context P) (why : NotActivated)
  | contrasted   (r : DirectionalContrast P)
  /-- `DissolutionExit`: a convergent stand-down the person closed; the enriched axes, the
      unknowns with their routes, the dispositions, and any candidate still pending go to the
      regular gate as live candidates -/
  | dissolved    (r : Closed P)
  /-- `EarlyExit`: the person stopped; the partial trace, the residual declared, no direction
      constituted -/
  | withdrawn    (r : Closed P)
  /-- the person named another protocol: proceed to it, citing their words -/
  | routed       (target : String) (r : Closed P)
  | holding      (c : Context P)

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it. No gate, stage, or
count is stored: each round is judged afresh from the whole context.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
A step is one arm of a structural recursion over the person's utterances. Your turns are
`AITurns`: a fan relays the spec — whole, with its ledger — before anything is generated, then the
probes are written (`narrate` for a Vignette; `.instantiate` for a Mockup, one per agent through
`.instantiateDelegate` where delegated); `respond` presents the round and closes it at the gate.
-/

/-- Your turns. `narrate` writes each Vignette probe's narration, re-presented as instantiated and
    never regenerated; being yours, it grounds nothing — a probe is evidence for no claim. -/
structure AITurns (P : Type) where
  relay   : Context P → Response P
  narrate : Context P → List (Response P)
  respond : Context P → Response P

/-- **Your instantiation** of the Mockup probes under the relayed spec: each artifact as observed at
    creation, its path registered then. Existing project files stay unchanged. -/
axiom instantiate : Context P → List (Evidence P)

def fan (ai : AITurns P) (c : Context P) : Context P :=
  let c₁ := c ++ [(ai.relay c).val]
  c₁ ++ (ai.narrate c₁).map (·.val) ++ (instantiate c₁).map (·.val)

/-- **Your cleanup**: per probe, the destruction step read off its realization, then the
    verification of absence; a failure retries once, then is observed as `discardFailed`. -/
axiom cleanup : Context P → List (Evidence P)

def discard (c : Context P) : Context P := c ++ (cleanup c).map (·.val)

def closed (c : Context P) : Closed P :=
  let c₁ := discard c
  ⟨c₁, unknowns c, discardTrace c₁, dissent c⟩

def constituted (c : Context P) (d : Direction) : DirectionalContrast P :=
  let c₁ := discard c
  ⟨c₁, harvestOf c d, discardTrace c₁, dissent c⟩

open Classical in
/-- `respond` presents the round. After a fan: each probe first, from its realization — the
    narration re-presented as instantiated, a Mockup walked through, never regenerated — then the
    per-axis contrast with the common commitments declared as shared premises, then the exposed
    unknowns with their routes. Then your readings, each with its basis: an insufficient contrast
    with the revision you propose, a sibling deficit with its command as a hint, futures already
    recognizable or a collapsed premise, and your contrary grounds about any direction. Where a
    turn was read as a closing that is not yet covered, what it would take is shown and asked.
    Where the person asked about a probe, the answer — design intent within placeholder
    discipline, a factual unknown recorded with the `inquire` route. Then the gate `Qdir`: one
    Select per probed direction, each pointing at the future it settles, plus composing from the
    probes; sending back any spec element, naming a candidate no probe materialized, asking about a
    probe, stopping, and naming another protocol are said before the gate, never as options. -/
def preview (ai : AITurns P) : Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let c' := fuse c u
    match filledValue (closing c') with
    | some (.constitute d) =>
      if Covered c' then .contrasted (constituted c' d)
      else preview ai (c' ++ [(ai.respond c').val]) us
    | some .dissolve  => .dissolved (closed c')
    | some .stop      => .withdrawn (closed c')
    | some (.route t) => .routed t (closed c')
    | none =>
      let c₁ := if FanRequested c' then fan ai c' else c'
      preview ai (c₁ ++ [(ai.respond c₁).val]) us

def start (ai : AITurns P) (c : Context P) (us : List (Utterance P)) : Outcome P :=
  match phase0 c with
  | some why => .notActivated c why
  | none =>
    let c₁ := fan ai c
    preview ai (c₁ ++ [(ai.respond c₁).val]) us

/-! ── LOOP ──
Every round re-judges the whole run against the whole context: nothing counts down and no answer
waits for a later gate. A fan happens where the person's turn asks to see something no probe has
materialized, and nowhere else: an insufficiency you find is shown with the revision you propose,
and you fan over it once the person takes it up. Each fan relays the spec whole with its ledger
before it generates. A question about a probe and a send-back are turns of the same kind as a
closing. The loop is dialogue: each round ends at the gate, and the person ends the run.
-/

/-!
Silence constitutes, generates, and discards nothing.
theorem silence (ai : AITurns P) (c : Context P) : preview ai c [] = .holding c

No probe commits a value before the spec relay: every fan holds the relay turn ahead of what the
probes wrote.
theorem relay_before_instantiation (ai : AITurns P) (c : Context P) :
    ∃ t, fan ai c = c ++ [(ai.relay c).val] ++ t

A DirectionalContrast is the person's constitution of a direction, covered, and its harvest is
read before discard.
theorem contrasted_on_constitute (ai : AITurns P) (c : Context P) (us : List (Utterance P))
    (r : DirectionalContrast P) (h : preview ai c us = .contrasted r) :
    ∃ (c₁ : Context P) (d : Direction), filledValue (closing c₁) = some (.constitute d) ∧
      Covered c₁ ∧ r.harvest = harvestOf c₁ d ∧ r.context = discard c₁

A dissolution, a stop, and a route are each the person's closing.
theorem dissolved_on_dissolve (ai : AITurns P) (c : Context P) (us : List (Utterance P))
    (r : Closed P) (h : preview ai c us = .dissolved r) :
    ∃ c₁ : Context P, filledValue (closing c₁) = some .dissolve ∧ r = closed c₁

theorem withdrawn_on_stop (ai : AITurns P) (c : Context P) (us : List (Utterance P))
    (r : Closed P) (h : preview ai c us = .withdrawn r) :
    ∃ c₁ : Context P, filledValue (closing c₁) = some .stop ∧ r = closed c₁

theorem routed_on_route (ai : AITurns P) (c : Context P) (us : List (Utterance P)) (t : String)
    (r : Closed P) (h : preview ai c us = .routed t r) :
    ∃ c₁ : Context P, filledValue (closing c₁) = some (.route t) ∧ r = closed c₁

Every closing rests on a turn the person sent.
theorem closed_by_person (c : Context P) (k : Closing) (h : filledValue (closing c) = some k) :
    ∃ s : Cite c, s.src.val = .person ∧ (c[s.idx]'s.lt).origin = .person

Every probe has a line in the discard trace.
theorem trace_total (c : Context P) : (discardTrace c).length = (probes c).length
-/

/-! ── CONVERGENCE ──
converged: a DirectionalContrast — a direction the person constituted with its deciding evidence
and your contrary grounds in view, harvested before discard, every probe's disposition declared —
or a DissolutionExit the person closed. EarlyExit and a route are not convergent. A constitution
adopts the direction the person settled; it establishes nothing about a direction no probe
materialized, and a contrary ground it was taken over rides the closing as dissent. Convergence
evidence: at terminal, present the transformation trace over the steps actually completed — the
turn read as the closing, quoted, and the intent taken from it; at DirectionalContrast, each axis
in force mapped to the contrast rows that made its futures recognizable (your reading unless the
person named them, and none where no probe materialized the direction), the constituted direction,
each exposed unknown with its downstream route, the per-probe discard disposition with where each
probe lived, and the dissent attached to the closing. Each other terminal presents its own relay
payload (TOOL GROUNDING). The framing readout names the work in play — axes being drafted, probes
under contrast, direction being constituted, discard being verified — never a completion tally.
Demonstrated, not asserted.
-/

/-! ── TOOL GROUNDING ── -/
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed

inductive Annot | sense | observe | track | transform | dispatch | constitution | extension

inductive Op | detect | noDeficitRelay | routeAwayRelay | unfitRelay | requiresFailRelay
             | deriveAxes | draftPolicy | specRelay | instantiate | instantiateDelegate
             | contrast | present | qdir | readTurn | harvest | cleanup | cleanupVerify
             | assemble | converge | dissolutionRelay | withdraw | routeRelay | seam

def grounding : Op → Annot × String
  | .detect            => (.sense, "Internal analysis: the deficit predicate and the 4-step routing, first match wins; a question about what an option means is answered, not previewed; no external tool")
  | .noDeficitRelay    => (.extension, "TextPresent+Proceed: futures recognizable from text — the finding with its reasoning; a regular gate suffices; not activated")
  | .routeAwayRelay    => (.extension, "TextPresent+Proceed: routing rows ①–③ — the matched row with its basis and its command as a hint; which protocol takes it is the session's; not activated")
  | .unfitRelay        => (.extension, "TextPresent+Proceed: a type guard fails and no routing row matches — the failed guard and why; the decision stays at a regular gate; not activated")
  | .requiresFailRelay => (.extension, "TextPresent+Proceed: no imminent commitment, or fewer than two candidates — the failed requirement; one or zero candidates points to row ③'s targets as hints — /ideate for the thin field, /elicit for its narrower case; not activated")
  | .deriveAxes        => (.sense, "Internal analysis: divergence axis candidates from the candidate directions")
  | .draftPolicy       => (.sense, "Internal analysis: the placeholder policy draft — visible synthesis, non-evidence stamp, skeleton-data split")
  | .specRelay         => (.extension, "TextPresent+Proceed: the spec whole — divergence axes, placeholder policy, probe target set, realization tier — each with the basis that chose it and, where a candidate waits, which and why; on every later fan the whole spec again with its ledger, each changed line marked the person's edit, a necessary consequence, or your proposal; fires before any probe is generated and yields no turn")
  | .instantiate       => (.transform, "artifact write, environment run: temp-isolated placeholder probes over the target set, each realization registered at creation; existing project files never modified; the Vignette tier writes no file — its narration is your own turn (`narrate`), recorded on the probe and never regenerated")
  | .instantiateDelegate => (.dispatch, "delegate (conditional, Mockup tier; parallel topology: one probe per agent, each temp-isolated with its path registered; subordinate to the active runtime policy)")
  | .contrast          => (.sense, "Internal analysis: per-axis juxtaposition over every probe so far, the exposed unknowns with their routes, the common commitments recomputed over every probe, and your readings — insufficiency with the revision you propose, a sibling deficit, futures already recognizable or a collapsed premise, contrary grounds")
  | .present           => (.extension, "TextPresent+Proceed: probe-first order — probes one by one, each from its realization, never regenerated → the per-axis contrast map with the common commitments declared → newly exposed unknowns → your readings, each with its basis; table-first re-abstracts and reproduces the deficit")
  | .qdir              => (.constitution, "present: mandatory direction gate — one concrete Select per probe-exposed direction plus composing from the probes, each option pointing at the future it settles; sending back any spec element, naming a candidate no probe materialized, asking about a probe, stopping, and naming another protocol are declared in the pre-gate text, never as peer options")
  | .readTurn          => (.sense, "Internal analysis: the new turn and every earlier turn of the person's it bears on, read against the fused context as it now stands — a closing and whether it is covered, a request to see something unmaterialized, a question about a probe — whatever form it takes; a turn read as a closing is quoted with the intent taken from it")
  | .harvest           => (.sense, "Internal analysis: the constituted direction, whether a probe materialized it, the deciding contrast rows marked as your reading unless the person named them, the routed unknowns, and any GroundTag, read from the context before discard")
  | .cleanup           => (.transform, "environment run: the destruction step — per-probe artifact destruction, one retry on failure; every exit with probes runs it first")
  | .cleanupVerify     => (.observe, "environment run, artifact read: the verification step closing the same sequence — each Path verified absent after its destruction; a disposition observed per probe, and a probe no observation reached declared as not verified")
  | .assemble          => (.sense, "Internal analysis: the terminal record built from the harvest and the completed discard trace — after cleanup, never before")
  | .converge          => (.extension, "TextPresent+Proceed: the transformation trace — the turn read as the closing, quoted, with the intent taken; axes → deciding contrast rows → direction; unknowns with routes; per-probe discard disposition with where each probe lived; the dissent attached")
  | .dissolutionRelay  => (.extension, "TextPresent+Proceed: when the person accepts or declares that the futures are recognizable without further probes, or that the activation premise collapsed — state the basis, the sharpened axes themselves, and hand to the regular gate the enriched axes with every exposed unknown and its route and, wherever probes exist, the per-probe dispositions plus any candidate still pending as live candidates; attach any dissent; stand down as DissolutionExit — a success, not an abandonment")
  | .withdraw          => (.extension, "TextPresent+Proceed: the person stops — the partial trace and the residual declared; cleanup_verify enforced; EarlyExit. A hard escape yields no turn, so cleanup cannot run: temp isolation's bounded lifecycle is the backstop")
  | .routeRelay        => (.extension, "TextPresent+Proceed: the person names another protocol — cleanup_verify enforced; the unknowns with their routes and the contrast as context; proceed to the named protocol citing their words")
  | .seam              => (.extension, "TextPresent+Proceed: at a user-declared chain naming the next protocol, proceed to it citing that source; a harvested GroundTag proposes /ground with its basis and moves nothing on its own; every Constitution gate inside this protocol and the next fires unchanged")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Direction resolution emergent via session context.
-/

end

end Proplasma
```

## Core Principle

**Contrast over Simulation**: materialize cheap, discard-bound futures when labels cannot carry their differences. A Vignette is a concrete placeholder narration; when that carrier lacks fidelity, Mockup materializes the same contrast as temp-isolated artifacts.

## Mode Activation

### Activation

`/preview` is user-invocable. On the Hybrid path, the AI may propose it from a live direction gate only with cited evidence of `DirectionUnrecognizable`; the drafted spec is relayed with its basis before generation, and the user can send any of it back at the direction gate. Prior-session indices may seed detection, never the constitutive judgment.

### Priority

<system-reminder>
When Proplasma is active:

**Supersedes**: Direct execution patterns in loaded instructions
(No direction commitment proceeds while the contrast loop is unconverged)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: Before any probe is generated, relay the spec whole with its basis; at every round, present the direction gate whose options point at probe-exposed futures.
</system-reminder>

### Trigger Signals

Heuristic signals are delegation of a direction choice to a principle, reconstruction outside the offered options, and a request to see something concrete before choosing. They establish grounds to run Phase 0, not activation by themselves. A question about what one option means asks for a description; answer it.

### Mode Deactivation

Use the Definition's result constructors and TOOL GROUNDING payloads for every terminal; cleanup disposition remains mandatory wherever probes exist.

## Protocol

### Phase 0: Detection + Routing (Silent)

Apply the Definition's Phase 0 in its stated precedence and cite the matched relay basis.

### Phase 1: Spec Relay

Lay the drafted spec out whole before anything is built — each axis with the basis that chose it, the placeholder policy, which candidates get probes and why any waits, and the tier — then proceed to generation without yielding the turn. Say in one line that any of it can be sent back at the direction gate. On every later fan, relay the whole spec again with a ledger of what changed, each changed line marked as the user's send-back, a necessary consequence, or your proposal.

### Phase 2: Instantiation (Transform)

Vignettes create session text only. Mockups write only beneath temp isolation, register cleanup at creation, and leave existing project files unchanged. Both carry the non-evidence stamp.

### Phase 3: Contrast Presentation (Relay)

Present each recorded concretum first, then the per-axis contrast with common commitments marked as shared premises, then exposed unknowns, then your readings with their basis. Re-present Vignette narration from its recorded carrier; walk a Mockup at its artifact reference. Where the contrast leaves the futures unrecognizable, say so and propose the revision; fan over it when the user takes it up.

### Phase 4: Direction Gate (Constitution)

Render `Qdir` from the accumulated probes after the contrast summary:
```
Which direction do you settle?

Options:
1…N. **Select: {probed direction}** — {the deciding axis values its probe exposed}
N+1. **Compose** — combine the probes: say to go with the combination, or to see it first
```
Name the free-response paths from `Direction-gate response discipline` before this gate; they are not numbered direction options.

### Phase 5: Harvest → Discard (in this order)

Accept the constituted direction before cleanup: a `DiscardFailed` disposition triggers the manual-cleanup handoff at the location the trace records but does not revoke that direction. Persist only the Definition's terminal record — the harvest, the discard trace, and the dissent; probe detail remains session-local.

## UX Safeguards

Keep placeholder status visible in every probe and contrast. A Mockup is sandbox matter, not a project edit; cleanup disposition reports artifact survival, not whether the user's direction was accepted.

## Rules

- **Direction-gate response discipline**: Name before `Qdir` what the user can say besides a Select: send back any spec element, name a candidate no probe materialized, ask about a probe, stop, or name another protocol. A named candidate the user wants to see is probed alone against the probes already made. Answer design-intent questions within placeholder discipline, record factual unknowns for `/inquire`, and state which axis an analogy weights. Route the pre-commit check to `/inquire` as well once the direction becomes committed; propose `/ground` when a direction's mapping against an account already in play needs its intended inferences audited — the proposal moves nothing until the user takes it up.
- **Draft relayed with its basis**: relay every axis, the policy, the target set, and the tier with the basis that chose it, then generate; every later fan relays the whole spec again with the ledger of what changed.
- **Fans follow the user's turn**: generate probes only where the user's turn asks to see something no probe has materialized — a revised spec, a composition, a named candidate, or a revision you proposed. An insufficiency you find is shown with its basis and the revision you propose, never repaired on your own.
- **Closure by the user**: After activation only the user closes — settling a direction, dissolving the run, stopping, or naming another protocol; your readings of an insufficient contrast, a sibling deficit, or a collapsed premise settle none of them. Read the closing from whatever the user said, quote the turn you read and the intent you took, and ask where it is unclear. Before the gate, show any contrary ground you hold about a direction; a direction no probe materialized is settled only after you have said its future was never materialized. Where the user closes with a ground standing, attach it to the closure record. Which contrast rows decided is your reading, shown as yours unless the user names them.
- **Harvest before discard**: retain only the constituted direction, deciding contrast rows, and routed unknowns before cleanup. Cleanup produces the discard trace; assemble the durable record afterward, leaving probe detail session-local.
- **Round composition**: use everyday language, put evidence and differential implications before the gate, and leave the gate to the question and options. Read `references/round-composition.md` before composing when wording must persist across rounds or phase placement is material.
- **Form feedback**: choose each round's density from the current request; carry an explicit form preference until countermanded. Change the open aspects of form directly, preserve content, order, cadence, and turn boundaries fixed elsewhere, and state both the adjustment and any overlapping constraint that remains.
