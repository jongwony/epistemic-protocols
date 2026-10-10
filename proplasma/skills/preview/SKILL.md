---
name: preview
description: "The user is about to commit to one of several directions that cannot be judged from their descriptions: build throwaway probes showing where they diverge, and decide on what is seen."
---

# Proplasma Protocol

Expose direction unknowns through divergent-discard instantiation before commitment. Type: `(DirectionUnrecognizable, Hybrid, PREVIEW, DirectionProspect) → DirectionalContrast`.

## Definition

**Proplasma** (πρόπλασμα): the preliminary clay model a sculptor shapes before committing to marble. A dialogical act for the moment right before a direction commitment when the candidate directions cannot be recognized from their descriptions: the AI relays what it is about to build — its reading of the purpose, the axes the purpose turns on, the placeholder policy, which candidates get probes, and the tier — each with its basis, builds cheap placeholder probes that commit different values on those axes, and shows a map of the directions: each probe first, then, per axis, what each direction's future looks like and what that rests on — a probe the person saw, a description alone, their own account, or evidence read in this run. The person's words are laid beside what was shown, and the person settles a direction, says the preview is no longer needed, or ends it. Probes are discard-committed instruments — evidence for no claim, never promoted.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract.
-/

/-! ── FLOW ──
Proplasma(X) → start(c) → preview(c, utterances), where c is the fused session context:
  start: what bears on the decision is gathered; then your reading, on it, that this is not this
    protocol's case (`notActivated`), in plain words with its basis → not activated; otherwise
    → fan → round
  fan(c): the spec relayed whole — your reading of the purpose, marked as yours unless they said
    it; the axes the purpose turns on; the placeholder policy; which candidates get probes and why
    any waits; the tier — each with its basis, and on every later fan what changed since the last;
    it yields no turn → the probes, each entering c as written
  round: after a fan, each new probe first, from its realization; then the map — whole on the first
    round, what changed on a later one, whole when asked: per axis, what each direction's future
    looks like there and what that rests on; the premises every probe shares; the open unknowns
    with what would settle each; your readings and contrary grounds, each with what it bears on
    and rests on → one opening, or a contradiction's working with nothing after it → Stop
  next utterance u, read on fuse(c, u):
    [does not bear on this run]   the session answers it; that answer stays in c; no gate of this run
    [the person constitutes d]    harvest → cleanup → DirectionalContrast
    [the person dissolves]        cleanup → DissolutionExit
    [the person withdraws]        cleanup → Withdrawn
    [otherwise]                   what is gathered now enters c, anything they asked to see
                                  observed for real among it; a fan where they ask to see what no
                                  probe materialized → round
  no utterance: the gate holds; nothing is constituted, generated, gathered, or discarded
-/

/-! ── MORPHISM ──
DirectionProspect
  → gather          -- what bears on the decision, read or run now — what they asked to see observed included (focus)
  → relay_spec      -- the spec whole with its basis, BEFORE any generation; on a later fan, with what changed
  → instantiate     -- placeholder probes over the candidates the relay named for probes, temp-isolated, each realization registered
  → present         -- the map: probes first, then per axis what each future shows and what it rests on (focus)
  → fuse(u)         -- the person's turn joins the context whole
  → constitute      -- the person's closing over the map (`ClosingSupported`)
  → harvest         -- direction + deciding cells + open unknowns, read BEFORE discard
  → cleanup         -- per-probe discard, each disposition observed → the discard trace
  → assemble        -- the record, built from the harvest and the completed discard trace
  → DirectionalContrast
  -- DissolutionExit — the person says no preview is owed — carries the map and the unknowns in
  --   place of this record: the deficit dissolved, so no resolution object is owed
requires: pre_commit(direction) ∧ |direction_candidates(X)| ≥ 2   -- read before activation (`notActivated`)
deficit:  DirectionUnrecognizable                                  -- activation precondition (Layer 1/2)
preserves: commit_target_identity(X)   -- the pending commitment is unchanged; probes and gathering change no existing state; the context only grows
invariant: Contrast over Simulation    -- direction judgment rests on recognized materialized futures, not mental simulation
invariant: Grounded, not asserted      -- every cell says what it rests on; a probe is evidence for no claim
invariant: after activation only the person closes; your readings settle none of the closings
The steps between gather and constitute are how you work toward recognizable futures; the
contract fixes the deficit and its resolution, the coordinates only the person fills — the closing,
and the purpose where they say it — the closings themselves, and the orderings the premises
ground: the spec relayed before any probe is generated, and the harvest read before anything is
discarded.
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

/-- A divergence axis, named as the map shows it: a direction unknown on which the probes commit
    different values. -/
abbrev DirectionAxis := String

/-- **Your reading**, before activation: why this is not this protocol's case, in plain words
    with its basis — no direction commitment is imminent, or fewer than two candidates stand to
    compare; the futures are already recognizable from their descriptions; the turn asks what one
    option means or what doing it would involve, which is answered as asked rather than previewed;
    what the choice turns on is whether an analogy or an account already in play licenses its
    inferences, not how each future would look; the directions can be judged only on real
    evidence, not on a depiction; or placeholders could
    not carry the difference without blurring it. An unmet need is said as what would settle it.
    `none` where the case is this protocol's. -/
axiom notActivated : Context P → Option String

/-- **Your judgment**: the cited person turn says what the decision is for, or what matters in it,
    read against the context as it now stands — in their own words, or by taking the reading of
    the purpose the map showed, which adopts it as shown. A later turn may change it. -/
axiom PurposeSupported : Context P → Turn P → String → Prop

/-- Only a person's turn sets the purpose. -/
def purposeCoord : Coord P String :=
  { admits := (·.val = .person), supports := PurposeSupported }

/-- **Your reading**: the purpose as it stands; `open_` until a person's turn says it. It holds back
    neither a round nor a closing: while it is open, the map shows your reading of it, marked as
    yours. -/
axiom purpose : (c : Context P) → Occ (purposeCoord (P := P)) c

/-- `vignette`: concrete placeholder narration in session text, no file artifacts. `mockup`: real
    artifacts in temp isolation. Which one the spec names is your judgment, relayed with it. -/
inductive RealizationTier | vignette | mockup

/-- How a probe is realized, carried on the probe itself: a Vignette's narration, re-presented
    as written and never regenerated; or a Mockup's temp-isolated path, registered at creation. -/
inductive Realized
  | narration (text : String)
  | artifact (path : String)

def Realized.location : Realized → Option String
  | .narration _ => none
  | .artifact p  => some p

structure Probe where
  direction : Direction
  realized  : Realized

/-- **Your record**, read from the context: every probe instantiated so far, cumulative across
    fans; a discarded probe stays listed for the trace. -/
axiom probes : Context P → List Probe

def directions (c : Context P) : List Direction := (probes c).map (·.direction)

/-- Per axis, each direction's cell: what that direction's future shows on the axis and what it
    rests on, read from where it came from — a depiction you built (a probe, whatever it is called,
    and anything read, run or measured on it; evidence for no claim), your description alone, the
    person's own account, attributed to them as what they said, or evidence read in this run: what
    gathering read or ran on something other than a probe, which never builds a direction to
    measure it — that would be a probe. -/
abbrev ContrastMap := List (DirectionAxis × List (Direction × String))

/-- **Your reading**, afresh on the context: the map's rows — the axes the purpose turns on, in the
    order it turns on them; a vivid difference that does not bear on the purpose is not made
    deciding unsaid. Premises every probe shares are shown as shared, not as axes, and re-read
    whenever the comparison changes. On an axis introduced after earlier probes, their cells are
    re-read from what the artifact carries, and otherwise say the difference is unshown there. -/
axiom contrastMap : Context P → ContrastMap

/-- **Your reading**: the unknowns open — a factual question a probe cannot answer included — on
    the context as it now stands, each with what would settle it, re-read every round. -/
axiom unknowns : Context P → List String

/-- **Your record**: your contrary grounds, each with what it bears on and what it rests on — a
    direction whose future no probe materialized, or a probe you read as not carrying its
    direction, among them — shown and attached as `present` and CONVERGENCE say, and raised again
    only on new evidence; empty when there were none. -/
axiom dissent : Context P → List String

/-- **Your judgment**: the latest utterance bears on this run — a closing, a purpose, a reading or
    an expectation of a future, a question about a probe, a send-back, a wish to see something
    depicted or observed — judged on what the whole utterance does, on the context with it. An
    utterance about other work leaves the run as it stands: the session answers it, saying briefly,
    where reading it as other work was unclear, that the run was left as it stands; that answer
    stays in the context, and no gate of this run is raised. -/
axiom Reaches : Context P → Prop

/-- How the person ends the run. -/
inductive Closing
  /-- settle this direction: a probed one, a composition of the probes, or a candidate no probe
      materialized -/
  | constitute (d : Direction)
  /-- no preview is owed — a case `notActivated` names now holds, the futures recognizable without
      further probes or the commitment the run was for no longer standing among them -/
  | dissolve
  /-- end here with neither -/
  | withdraw

/-- **Your judgment**: the cited turn — the latest utterance; a turn before the latest round closes
    nothing — closes the run this way, read whole on the context as it now stands. Its words
    decide what it settles, whatever form it takes — an option number, a restated goal, a side
    remark; a mere lean or a comparison closes nothing. A
    composition of probes already shown that says to go with it constitutes at once; one asking
    to see it, or a candidate named to be seen, closes nothing. Taking what the map showed adopts
    it as shown, with no second permission. A direction no probe materialized — read from the
    accumulated context — and not a composition of probes already shown constitutes as the turn
    names it, and the closing says its future was never materialized. Where its intent is unclear,
    your reading of the turn decides, with no question asked back: the next round says briefly how
    you took it, and a closing says it in the convergence evidence. Your readings, the map's cells,
    and the open unknowns close nothing and hold no closing back. -/
axiom ClosingSupported : Context P → Turn P → Closing → Prop

/-- Only the person closes. -/
def closeCoord : Coord P Closing :=
  { admits := (·.val = .person), supports := ClosingSupported }

/-- **Your reading**: the person's closing; `open_` until one reaches it. -/
axiom closing : (c : Context P) → Occ (closeCoord (P := P)) c

def filledValue {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Option A
  | .open_ _     => none
  | .filled a .. => some a

/-- **Your judgment**: the latest utterance asks to see something no probe has materialized — a
    spec element sent back (an axis, the policy, the tier, which candidates get probes, the probe
    material), a composition to be seen, a named candidate, or the revision you proposed taken
    up. A reading of the purpose sent back opens a fan only where they ask to see probes on what
    the new purpose turns on. A wish to see something that exists observed for real is
    `gathered`'s, not a fan. -/
axiom FanRequested : Context P → Prop

/-- **Your read**, now, of what the next judgment needs, as far as relevant access reaches: the
    candidates' material and the sources that bear on the decision — any a turn cites, and any you
    find — and whatever exists now other than a probe that bears on it — a running system, a
    scratch copy of something that exists; read or run without changing existing state: what you
    create only to look goes to a scratch space outside the project tree and is removed afterwards.
    What the context already holds from a read or a run is not read or run again unless the person
    asks for it again, or an utterance, evidence, or a change made in the session since says it
    moved. What you say you read, you read to the end. A run's result comes with what it ran on and
    what that leaves untested. What was reached and what was not, with what each unreached one
    would need — a change to existing state, a permission — and any conflict among what was
    gathered, are named. Empty where nothing outside the context bears. -/
axiom gathered : Context P → List (Evidence P)

/-- The context with what `gathered` read now appended. -/
def consulted (c : Context P) : Context P := c ++ (gathered c).map (·.val)

/-- **Your reading** of the cells that made `d`'s future recognizable — for a composition, those of
    the probes it composes; a cell resting on evidence read carries that evidence. It is your
    reading, shown as such, unless the person's words name them; empty only where nothing shown
    bears on `d`. -/
axiom decidingRows : Context P → Direction → ContrastMap

/-- Read before discard. `probed` says whether a probe materialized the direction; the deciding
    cells are as `decidingRows` reads them. A probe stays evidence for no claim here and in every
    remnant: a cell resting on a probe records what made a future recognizable, never a finding
    about the world. -/
structure Harvest where
  direction    : Direction
  probed       : Bool
  decidingRows : ContrastMap
  unknowns     : List String

def harvestOf (c : Context P) (d : Direction) : Harvest :=
  ⟨d, (directions c).contains d, decidingRows c d, unknowns c⟩

/-- `fileDestroyed`: the path removed and verified absent (Mockup). `noFileArtifact`: a
    Vignette, nothing to destroy — discard is non-promotion. `discardFailed`: still present, or
    never verified; declared, never silent. -/
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

/-- `DirectionalContrast`, assembled after cleanup from the harvest read before it: the purpose as
    it stood, the harvest, the discard trace, and the dissent; `context` is what their readings
    point into, and probe detail stays session-local. -/
structure DirectionalContrast (P : Type) where
  context : Context P
  purpose : Occ (purposeCoord (P := P)) context
  harvest : Harvest
  trace   : List TraceEntry
  dissent : List String

/-- What a run hands on when it ends without a direction: the purpose and the map as they stood,
    the open unknowns, the discard trace, and the dissent. -/
structure Closed (P : Type) where
  context  : Context P
  purpose  : Occ (purposeCoord (P := P)) context
  map      : ContrastMap
  unknowns : List String
  trace    : List TraceEntry
  dissent  : List String

inductive Outcome (P : Type)
  | notActivated (c : Context P) (why : String)
  | contrasted   (r : DirectionalContrast P)
  /-- `DissolutionExit`: no preview is owed; the map, the open unknowns, every probe's
      disposition, and any candidate still pending stay with the decision as live candidates -/
  | dissolved    (r : Closed P)
  /-- `Withdrawn`: the person ended the run with neither; the partial record, with every
      disposition of the probes this run wrote -/
  | withdrawn    (r : Closed P)
  | holding      (c : Context P)

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it. No gate, stage, or
count is stored: each round is judged afresh from the whole context.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
A step is one arm of a structural recursion over the person's utterances. Your turns are
`AITurns`: a fan relays the spec — whole, with what changed — before anything is generated, then
the probes are written (`narrate` for a Vignette; for a Mockup, the operations `instantiatedBy`
names); `respond` is the round, as TOOL GROUNDING's `present` entry names it; `session` is the
session's own answer to an utterance about other work, which stays in the context without being a
gate of this run.
-/

/-- Your turns. `narrate` writes each Vignette probe's narration; being yours, it grounds
    nothing. -/
structure AITurns (P : Type) where
  relay   : Context P → Response P
  narrate : Context P → List (Response P)
  respond : Context P → Response P
  session : Context P → Response P

/-- **Your instantiation** of the Mockup probes under the relayed spec, beneath temp isolation:
    each artifact as observed at creation, its path registered then. The observation evidences
    that the artifact exists at its path, and nothing it depicts. -/
axiom instantiate : Context P → List (Evidence P)

def fan (ai : AITurns P) (c : Context P) : Context P :=
  let c₁ := c ++ [(ai.relay c).val]
  c₁ ++ (ai.narrate c₁).map (·.val) ++ (instantiate c₁).map (·.val)

/-- **Your cleanup**: per probe, the destruction step read off its realization, then the
    verification of absence; a probe whose absence was not verified is observed as
    `discardFailed`. -/
axiom cleanup : Context P → List (Evidence P)

def discard (c : Context P) : Context P := c ++ (cleanup c).map (·.val)

def closed (c : Context P) : Closed P :=
  let c₁ := discard c
  ⟨c₁, purpose c₁, contrastMap c, unknowns c, discardTrace c₁, dissent c⟩

def constituted (c : Context P) (d : Direction) : DirectionalContrast P :=
  let c₁ := discard c
  ⟨c₁, purpose c₁, harvestOf c d, discardTrace c₁, dissent c⟩

open Classical in
/-- A turn about other work is answered by the session and leaves the run as it stands; a closing
    is read from the person's turn before anything is gathered; otherwise what is gathered now
    enters the context, a fan runs where the turn asks to see what no probe materialized, and the
    round follows. -/
def preview (ai : AITurns P) : Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let f := fuse c u
    if ¬ Reaches f then preview ai (f ++ [(ai.session f).val]) us
    else match filledValue (closing f) with
    | some (.constitute d) => .contrasted (constituted f d)
    | some .dissolve       => .dissolved (closed f)
    | some .withdraw       => .withdrawn (closed f)
    | none =>
      let c₁ := consulted f
      let c₂ := if FanRequested f then fan ai c₁ else c₁
      preview ai (c₂ ++ [(ai.respond c₂).val]) us

def start (ai : AITurns P) (c : Context P) (us : List (Utterance P)) : Outcome P :=
  let c₀ := consulted c
  match notActivated c₀ with
  | some why => .notActivated c₀ why
  | none =>
    let c₁ := fan ai c₀
    preview ai (c₁ ++ [(ai.respond c₁).val]) us

/-! ── LOOP ──
Every round re-judges the whole run against the whole context: nothing counts down and no answer
waits for a later gate. A fan happens where the person's turn asks to see something no probe has
materialized, and nowhere else: an insufficiency you find is
shown with its basis and the revision you propose, and you fan over it once the person takes it
up. Each fan relays the spec whole, with what changed, before it generates. The loop is dialogue:
each round ends at the gate, and the person ends the run.
-/

/-! ── CONVERGENCE ──
converged: a DirectionalContrast — a direction the person constituted over the map, harvested
before discard, every probe's disposition declared — or a DissolutionExit the person closed.
Withdrawal keeps its partial record. A constitution adopts the direction as the map showed it; it
establishes nothing about a direction no probe materialized, and a contrary ground it was taken
over rides it as dissent. The convergence evidence: the turn read as the closing, quoted, and the
intent taken from it; the purpose as it stands, marked as yours where you read it; at
DirectionalContrast, the constituted direction and the deciding cells, as `decidingRows` reads
them, each with what it rests on; at any other exit, the map as it stood; at every exit, the open
unknowns with what would settle each, every probe's disposition with where it lived, and the
dissent — a contrary ground first visible at the closing turn, a criterion they stated against the
pick that turn makes included, is shown here and attached, and the closure stands. The framing
readout names the work in play — the spec being drafted, probes under contrast, a direction being
constituted, discard being verified — never a completion tally. Grounded, not asserted.
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

inductive Op | detect | notActivatedRelay | gather | specRelay | instantiate | instantiateDelegate
             | assess | present | readTurn | harvest | cleanup | cleanupVerify | assemble
             | converge | dissolutionRelay | withdraw | seam

def grounding : Op → Annot × String
  | .detect            => (.sense, "Internal analysis: whether this is the protocol's case, as `notActivated` reads it")
  | .notActivatedRelay => (.interaction .extension, "before activation only: your `notActivated` reading, in plain words with its basis; not activated")
  | .gather            => (.observe, "artifact read, artifact search, environment run: what `gathered` reads or runs, now, as its doc states; what it returns enters the context as evidence before the round that shows it")
  | .specRelay         => (.interaction .extension, "the spec whole before any probe is generated — your reading of the purpose, marked as yours unless they said it; the axes the purpose turns on; the placeholder policy: each probe overtly synthetic, its structure faithful to its direction and its data values fake, evidence for no claim, and where a placeholder may blur a difference; which candidates get probes — enough that at least two futures stand in view once the probes already made are counted, a candidate the person named being probed alone against them, and few enough to take in at once, about four new probes a fan — and, where candidates wait, which and why; and the tier — each with the basis that chose it. On every later fan the whole spec again with what changed since the last relay; marking a change by its cause is welcome, not required. It yields no turn")
  | .instantiate       => (.transform, "artifact write, environment run: temp-isolated placeholder probes over the candidates the relay named for probes, each realization registered at creation; existing project files never modified; the Vignette tier writes no file — its narration is your own turn (`narrate`), recorded on the probe")
  | .instantiateDelegate => (.dispatch, "delegate (conditional, Mockup tier): a probe's write handed to execution, temp-isolated, its path registered at creation")
  | .assess            => (.sense, "Internal analysis: the purpose reading, the axes, each cell and what it rests on, the shared premises, the open unknowns, and your readings, over the whole fused context as it now stands")
  | .present           => (.interaction .constitution, "the round, every round the first included. After a fan, each new probe first, from its realization — a Mockup walked through at its path. Then the map: the purpose as the person said it, or else your reading of it, marked as yours; per axis the purpose turns on, what each direction's future looks like there and what that rests on, as `ContrastMap` defines it; the premises every probe shares, as shared; the open unknowns, each with what would settle it; your readings with their basis — an insufficient contrast with the revision you propose, or a reading that the run has reached a case `notActivated` names — the futures already recognizable or the commitment no longer standing among them —, each closing nothing; and your contrary grounds, each with what it bears on and what it rests on, a direction whose future no probe materialized among them. Every later round shows what changed on the map, and the whole map when the person asks for it, and answers what they asked — a question about a probe within placeholder discipline, saying what the probe was built to show and never a claim about the world, and where they ask to see a probe run or measured, showing what that shows on the probe, a depiction as `ContrastMap` says; an analogy you offer says which axis it weights. A correction of the purpose moves the map. Read the person's turn whole. The round that shows evidence read in this run sets it in its cell against the claim your description made and against whatever the person has said that bears on it, saying where each agrees and where it parts. Where they voice a reading or an expectation of a future, or check their understanding against what was shown, lay it beside what the probes show, saying where the two agree and where they part; before reading it as at odds with a probe, read whether it speaks to another purpose, a preference, or an assumption a placeholder cannot reach, and say which, moving the map — a placeholder never settles how a future will be lived. Where their words and evidence read in this run — the candidates' material, a source, a result gathered — part on the same axis and premises, or two of their own utterances do — a criterion they stated and a pick they made — show it with its working in one round: their words quoted, the narrowest such material that bears on it, why the two part, and what they got right; a probe is never that material, and where their words part from one, the laying-beside above governs; a contradiction they keep after its working stays in view as a held contrary ground until it is settled — on a surface that stays in view where the session has one, otherwise briefly beside each round — and is worked again only on new material. Where what could not be reached, or a conflict among what was gathered, bears on a direction, say it there. A round that shows a contradiction's working ends on that working, with nothing after it; every other round ends on one opening the person can take — settle a direction, a composition, or one no probe showed; send back any part of the spec; name a candidate to see; ask about a probe, or to see something real observed; say the preview is no longer needed; or end here")
  | .readTurn          => (.sense, "Internal analysis: whether the latest utterance bears on this run and what it does there — a closing, a purpose, a reading or expectation, a request to see something depicted or observed, a question — read whole against the fused context as it now stands, as `Reaches` and the judgments above read it")
  | .harvest           => (.sense, "Internal analysis: the constituted direction, whether a probe materialized it, the deciding cells as `decidingRows` reads them, and the open unknowns, read from the context before discard")
  | .cleanup           => (.transform, "environment run: the destruction step — per-probe artifact destruction; every exit with probes runs it first")
  | .cleanupVerify     => (.observe, "environment run, artifact read: the verification step closing the same sequence — each path verified absent after its destruction; a disposition observed per probe, and a probe no observation reached declared as not verified; a probe still present is declared with the path to remove by hand, and the direction the person settled stands")
  | .assemble          => (.sense, "Internal analysis: the terminal record built from the harvest and the completed discard trace — after cleanup, never before")
  | .converge          => (.interaction .extension, "the convergence evidence CONVERGENCE names; proceed with DirectionalContrast")
  | .dissolutionRelay  => (.interaction .extension, "the person says no preview is owed: the convergence evidence CONVERGENCE lists, with any candidate still waiting named as live; DissolutionExit — a success, not an abandonment")
  | .withdraw          => (.interaction .extension, "at the person's word, at any gate: what you took as withdrawn, and the partial record CONVERGENCE lists with every probe's disposition")
  | .seam              => (.interaction .extension, "after a terminal, the next move only from a chain the person declared, a routing policy they adopted, or their grant, citing that source; after a withdrawal, only to a next move the person declared with it; otherwise the record is handed on as session text, the dissent travelling in it; every Constitution gate inside this protocol and the next fires unchanged")

/-- The operations that write a fan's probes, by tier: a Mockup through `.instantiate`, and
    `.instantiateDelegate` where delegated; a Vignette writes no file. -/
def instantiatedBy : RealizationTier → List Op
  | .vignette => []
  | .mockup   => [.instantiate, .instantiateDelegate]

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Direction resolution emergent via session context.
-/

end

end Proplasma
```

## Core Principle

**Contrast over Simulation**: materialize cheap, discard-bound futures when labels cannot carry their differences. A Vignette is a concrete placeholder narration; where that carrier would blur the difference, a Mockup materializes the same contrast as temp-isolated artifacts. **Grounded, not asserted**: the person can tell, cell by cell, whether a future was seen in a probe, only told, said by them, or read as evidence.

## Mode Activation

`/preview` is user-invocable, and an invocation is read through `notActivated` before anything is built. On the Hybrid path, the AI may propose it at a live direction choice only with cited evidence that the candidates' futures cannot be recognized from their descriptions — a choice delegated to a principle, the option set reworked instead of chosen, or "I'd have to see it"; prior-session indices may seed that reading, never the person's judgment.

## Protocol

### Map rendering

Label each row by what the person decides through it, and say each cell's footing in words beside its content. Where the session has a surface that stays in view, the map can stay there as well.

## Rules

- **Placeholder discipline**: Keep placeholder status visible in every probe and on the map.
- **Round composition**: Compose each round so the reader can act without reassembly — use everyday language, keep each judgment beside its evidence and next-move implication, and place analytical context before its gate. Read `references/round-composition.md` before composing when terminology must remain stable, wording must be carried unchanged, content belongs to another round or the convergence evidence, or whether text belongs before or inside the gate is in question.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
- **Contract execution**: As FLOW, the judgments' doc comments, LOOP, TOOL GROUNDING's `specRelay` and `present` entries, and CONVERGENCE state.
