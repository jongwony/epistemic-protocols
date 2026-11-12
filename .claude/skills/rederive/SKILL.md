---
name: rederive
description: "This skill should be used when a contributor names a skill whose Lean contract is to be re-derived — a core protocol, a utility skill, or a contributor skill whose formal block is or becomes Lean — or invokes /rederive. Runs the per-skill flow: gather the pre-understanding, derive the skill's epistemic solution and fuse it with the contributor's horizon, then read the current contract against it, through sketch, edit and rehearsal, to the fusion of the contributor's horizon on the rehearsal result. Project-local contributor tooling."
allowed-tools: Bash, Read, Grep, Glob, Agent, Skill
---

# Re-derive a protocol contract

## Definition

**Re-derivation**: one skill per run, whose formal block is Lean or becomes Lean in the run — a core protocol in `scripts/load-protocols.js` `CANONICAL_PROTOCOL_SET`, a utility skill in `LEAN_CONTRACT_UTILITIES`, or a contributor skill in `LEAN_CONTRACT_CONTRIBUTOR_SKILLS` there, which a skill whose block is not yet Lean enters in its run. *The protocol* names that skill whichever kind it is. The object is the protocol itself — its `SKILL.md` on `origin/main`; an open PR whose branch carries the chart id is one more piece of material, never the anchor. The anchor chart is the protocol's own `ROO-*` chart, which may be one chart several skills' runs share; the suite-wide ground is ROO-67. The order across protocols is the contributor's.

The target is the morphism that the `AGENTS.md` Northstar and the premise axiom Context and Utterance as First-Class Ground (`premise/recognition-and-authority.md`) admit, in the form `lean/EpistemicProtocols/Ground.lean` fixes: the fused context — turns bound to who sent them — and the person's utterance are the ground; the structure fixes only what the harness knows; everything else is the model's inference, declared as a documented judgment inside the types. The pre-Lean DSL, the current block, any open PR and earlier decides are evidence read against the taken solution, never the target.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract.
How an operation is carried out is its description in `grounding`.
-/

/-! ── FLOW ──
Rederive(protocol) → start(c) → run(solution, c, arrivals), where c is the fused session context:
  before a gate is shown, the work `before` lists for it runs and joins the context
    [a finding of that work moves the ground of a part already taken]  → the solution gate instead
  solution gate → sketch gate → rehearsal gate: each is shown, and then holds for a turn
  while a gate holds:
    [a grant to proceed stands, or you judge that the run goes on]  the work before the gates after
      it is carried provisionally, and the gate it reaches is shown with the provisional gates;
      nothing is taken, no decide is written, nothing ends
    [else]  the run waits
  next arrival a — the contributor's utterance, or their words as a record or a peer relays them:
    [it settles nothing]    answered; the gate holds
    [it grants going on]    answered; nothing is taken, and the gate holds as above
    [it stops the run]      what was gathered and derived is recorded; the run ends, nothing closed
    [it moves the pre-understanding, or the ground of a part already taken]  → the solution gate
    [it corrects what the gate shows, the taken parts standing]  the work before this gate again
    [it takes what the gate showed]  by the gate that stands:
      solution:  recorded; the current contract is read against the solution
                 [nothing to change] the diagnosis is recorded; the run ends   [else] → sketch gate
      sketch:    recorded; the fork edits; the edit is rehearsed → the rehearsal gate
      rehearsal: [the revision that stands was rehearsed]  recorded → the hand-off; the run ends
                 [an edit came after the last rehearsal]   rehearsed again; this gate again
  no further arrival: the run holds at the gate that stands; nothing is taken and nothing ends
-/

namespace Rederive

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

/-- A turn that may settle a gate: the contributor's own utterance, or their words as a record or
    a peer session relays them — a decide on the chart, a hand-over from another session. -/
abbrev Arrival (P : Type) := Utterance P ⊕ Evidence P

def Arrival.turn : Arrival P → Turn P
  | .inl u => u.val
  | .inr e => e.val

def arrive (c : Context P) (a : Arrival P) : Context P := c ++ [a.turn]

/-- The gates of a run, each holding a judgment that is the contributor's: the derived solution,
    the sketch, and what the edited contract did in rehearsal. -/
inductive Gate | solution | sketch | rehearsal

/-- How a turn at a gate is read. Premise: one turn carries one of these or none. A turn that
    carries none settles nothing — a question, an appraisal, a request to look at something — and
    is answered with the gate left open. -/
inductive Reading
  /-- the contributor takes what the gate showed, all of it — the gates carried provisionally
      that it showed among them — with no second permission for any line -/
  | takes
  /-- the contributor corrects or replaces part of what the gate shows, and every part already
      taken keeps its ground: a redraw, or a fix -/
  | applies
  /-- the turn moves the pre-understanding — a source, a decide, a reading of use — or the ground
      of a part already taken, naming the part it moves -/
  | movesGround
  /-- the contributor ends the run -/
  | stops
  /-- the contributor grants going on without them, as far as the grant's words reach: "carry on
      to the rehearsal while I am away" reaches the rehearsal and the rehearsal gate made ready,
      and nothing past it. It takes nothing. -/
  | proceeds

/-- **Your judgment**: the cited turn reads this way, read whole against the context as it now
    stands. A finding of your own or of a consult is no turn of the contributor's: it is brought
    to the gate, and what is read is their turn on it. -/
axiom ReadingSupported : Context P → Turn P → Reading → Prop

/-- A gate is settled on any turn that may ground; which turn carries the contributor's reading
    is `ReadingSupported`'s. -/
def readingCoord : Coord P Reading :=
  { admits := fun _ => True, supports := ReadingSupported }

/-- **Your reading** of the latest arrival: `open_` where it settles nothing. -/
axiom reading : (c : Context P) → Occ (readingCoord (P := P)) c

/-- **Your work** before a gate is shown — the operations `before` lists for it, each as
    `grounding` describes it — each read and each delegated result returning as an evidence turn.
    A finding that applies a taken part is fixed inside this work; a fix to the edited contract
    goes back through the fork and is rehearsed again. On a return to a gate, only what the latest
    turn or finding moved is done again, from the earliest work that part depends on; parts whose
    ground did not move stand, and work already carried provisionally is not done twice. -/
axiom prepared : Gate → Context P → List (Evidence P)

/-- **Your record** on the protocol chart of what the latest turn settled or ended: a decide for
    each point a taking settled — at the solution gate, at the sketch gate, and for every gate
    carried provisionally that the taking's gate showed — its reason and its rejected alternative
    in the contributor's words, a slot their words leave empty asked and never inferred; the
    diagnosis, where nothing is to change; what was gathered and derived, where the contributor
    stops. -/
axiom recorded : Context P → List (Evidence P)

/-- **Your judgment**: a finding of the work just done moves the ground of a part already taken.
    One that bears on a provisional choice without settling it moves none: it is kept beside that
    provisional gate for the contributor. -/
axiom FindingMovesGround : Context P → Prop

/-- **Your diagnosis**, from reading the current contract against the taken solution: it is
    already a Lean block, lacks nothing the solution asks, and carries nothing the solution does
    not. A contract whose block is not yet Lean always goes on to the sketch. -/
axiom NothingToChange : Context P → Prop

/-- **Your reading**: this turn reports a change to the contract under re-derivation — its
    `SKILL.md` or what that loads when it runs — by the fork, by a fix, or by anyone else on its
    branch. A change to a surface that only describes the contract is none. -/
axiom Edits : Turn P → Prop

/-- **Your reading**: this turn is the record of a rehearsal of the contract as it then stood. -/
axiom Rehearses : Turn P → Prop

/-- **Your judgment**: the rehearsal's cases suffice. Every path of the edited contract's recorded
    procedure is accounted for — rehearsed by a named case, or blocked, with what blocked it: the
    contract's own Constitution waiting on the person, or the harness refusing; any other cause is
    said in its own words — and the cases together let the contributor judge the contract in the
    situations it meets. Until this holds the rehearsal takes another case. -/
axiom Sufficient : Context P → Prop

/-- The revision that stands was rehearsed: the context holds the record of a rehearsal judged
    sufficient, with no edit after it. -/
def Rehearsed (c : Context P) : Prop :=
  ∃ i, ∃ h : i < c.length, Rehearses (c[i]'h) ∧ Sufficient (c.take (i + 1)) ∧
    ∀ j, ∀ hj : j < c.length, i < j → ¬ Edits (c[j]'hj)

/-- **Your record** of the rehearsal, a narrative case by case: at each choice point of the edited
    contract's procedure, what was chosen, what came of it, and whether the run went on or was
    blocked there and by what. A constructed case is marked as constructed. What only the person's
    turn closes is named as not reached, with what reaching it needs. -/
axiom narrative : Context P → List String

/-- **Your work** past a gate that holds unanswered: under a grant to proceed, as far as its words
    reach; or with no arrival, where you judge from the context that the run goes on rather than
    waits. Empty where the run waits. Each gate passed is taken provisionally on the branch the
    settled decides and the premise support, and the work before the gate after it is done as
    `prepared` does it. A fix that can go on only by choosing between provisional directions still
    in contention is not made: the case that tells them apart is kept for the contributor, that
    branch is refined no further, and independent work goes on. The provisional gates are recorded
    as one comment on the protocol chart headed as provisional gate records, never as a decide —
    per gate what was shown, the options, the provisional choice with its ground, and what would
    change it — and the PR marks what rests on them as provisional. None of it is a taking, and it
    claims no diagnosis and no hand-off. -/
axiom carried : Gate → Context P → List (Evidence P)

/-- **Your record**: the gate that work reached, whose showing the contributor meets on their
    return. A reading that finds nothing to change is not passed. -/
axiom reached : Gate → Context P → Gate

/-- What a run hands off once the contributor has taken the rehearsal result. Verifying the
    contract in use lies past this hand-off, which names it and prescribes nothing about it. -/
structure HandOff (P : Type) where
  context   : Context P
  takenAt   : Nat
  narrative : List String

/-- The end of a run whose reading found nothing to change, with the turn that took the solution
    it was read against. -/
structure Diagnosis (P : Type) where
  context : Context P
  takenAt : Nat

inductive Outcome (P : Type)
  /-- the run stands at a gate with nothing further taken: no further arrival came, or the
      contributor stopped — a stop is no result, and it stays in the context. -/
  | holding (g : Gate) (c : Context P)
  | noChange (d : Diagnosis P)
  | handedOff (h : HandOff P)

/-! ── MODE STATE ──
Λ is the fused context: what was taken, carried provisionally, edited, and rehearsed is read from
its turns, and no field stores it. The gate argument of `run` is the gate that stands.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
The work before a gate appends what `prepared` returns [Tool]; `respond` shows a gate from the
context that work leaves, its findings grouped by the part they bear on and not as an item list;
`session` answers a turn that takes nothing.
-/

/-- The reading the run acts on: the latest turn's. A turn already read is not read into a second
    taking. -/
def latest (c : Context P) : Option (Reading × Nat) :=
  match reading c with
  | .open_ _ => none
  | .filled a s _ _ => if s.idx + 1 = c.length then some (a, s.idx) else none

def settle (c : Context P) : Context P := c ++ (recorded c).map (·.val)

def pass (g : Gate) (c : Context P) : Context P := c ++ (prepared g c).map (·.val)

open Classical in
/-- The gate shown on the context a pass leaves, with its showing appended: the gate the pass led
    up to, or — where a finding of the pass moves the ground of a part already taken — the
    solution gate, after the work before it. -/
def shown (respond : Gate → Context P → Response P) (g : Gate) (c₁ : Context P) :
    Gate × Context P :=
  if FindingMovesGround c₁ then
    let c₂ := pass .solution c₁
    (.solution, c₂ ++ [(respond .solution c₂).val])
  else (g, c₁ ++ [(respond g c₁).val])

/-- The run after work carried past a held gate: the gate that work reached, shown on the context
    it leaves; as it stood, where the run waits. -/
def carry (respond : Gate → Context P → Response P) (g : Gate) (c : Context P) :
    Gate × Context P :=
  match carried g c with
  | [] => (g, c)
  | e :: es =>
    let c₁ := c ++ (e :: es).map (·.val)
    (reached g c, c₁ ++ [(respond (reached g c) c₁).val])

open Classical in
def run (respond : Gate → Context P → Response P) (session : Context P → Response P) :
    Gate → Context P → List (Arrival P) → Outcome P
  | g, c, []      => .holding (carry respond g c).1 (carry respond g c).2
  | g, c, a :: as =>
    let s := carry respond g c
    let c' := arrive s.2 a
    match latest c' with
    | none => run respond session s.1 (c' ++ [(session c').val]) as
    | some (.proceeds, _) => run respond session s.1 (c' ++ [(session c').val]) as
    | some (.stops, _) => .holding s.1 (settle c')
    | some (.movesGround, _) =>
      let next := shown respond .solution (pass .solution c')
      run respond session next.1 next.2 as
    | some (.applies, _) =>
      let next := shown respond s.1 (pass s.1 c')
      run respond session next.1 next.2 as
    | some (.takes, n) =>
      match s.1 with
      | .solution =>
        let c₁ := pass .sketch (settle c')
        if NothingToChange c₁ then .noChange ⟨settle c₁, n⟩
        else
          let next := shown respond .sketch c₁
          run respond session next.1 next.2 as
      | .sketch =>
        let next := shown respond .rehearsal (pass .rehearsal (settle c'))
        run respond session next.1 next.2 as
      | .rehearsal =>
        if Rehearsed c' then .handedOff ⟨settle c', n, narrative c'⟩
        else
          let next := shown respond .rehearsal (pass .rehearsal c')
          run respond session next.1 next.2 as

def start (respond : Gate → Context P → Response P) (session : Context P → Response P)
    (c : Context P) (as : List (Arrival P)) : Outcome P :=
  let next := shown respond .solution (pass .solution c)
  run respond session next.1 next.2 as

/-! ── CONVERGENCE ──
handed off: the contributor's turn took the rehearsal result on a revision rehearsed since its last
edit. no change: the diagnosis is recorded and relayed; nothing is edited. A run that only carried
work past unanswered gates has converged on neither: it holds, and says which gates stand
provisional.
Convergence evidence: (pre-understanding → taken solution → reading → sketch → edit → rehearsal →
the contributor's turn on the rehearsal narrative → HandOff). Demonstrated, not asserted.
-/

/-! ── TOOL GROUNDING ──
What each operation of this contract does. An interaction with the person is one of two kinds,
and its kind fixes how it continues once its text is presented. A Constitution settles a judgment
through the person's turn. An Extension settles none for the person: it passes on a result its
cited ground fixes, or carries reversible work forward on a judgment the AI states, which stays
the AI's proposal until the person takes it. Beyond the Constitution operations a contract
annotates, whether work goes forward this way or waits for the person's answer is the AI's
judgment in the situation, and work that cannot be undone waits for the authorization it needs.
Work carried forward, on a grant or a stated judgment or as clear work, returns with an account
of how the request was read, what was judged on what basis — naming an alternative set aside
where it may be preferred — and how far the work went.
-/

inductive Interaction | constitution | extension

inductive Continuation | stop | proceed

inductive Annot | sense | observe | track | transform | dispatch | interaction (kind : Interaction)

/-- Every interaction presents its text; a Constitution then stops for the person's turn, and an
    Extension proceeds. -/
def Interaction.realization : Interaction → Continuation
  | .constitution => .stop
  | .extension    => .proceed

inductive Op
  | gather | search | derive | consult | read | sketch | record | edit | rehearse
  | solutionGate | sketchGate | readTurn | carryOn | converge | handOff

def grounding : Op → Annot × String
  | .gather       => (.observe, "artifact read, record read; read-only, and afresh every run. The protocol's chart first: where its earlier chart is Done, a new chart linked to it and to ROO-67 (ROO-67 decide 5e64392d). Then: (1) ground — the `AGENTS.md` Northstar, the premise axiom Context and Utterance as First-Class Ground, `lean/EpistemicProtocols/Ground.lean`, and the protocol's declared deficit and resolution type from its Type line and Definition paragraph only, not its formal block; (2) decides — the decide comments of the protocol chart and of ROO-67, the protocol chart's Open questions and related issues, a later decide that supersedes an earlier one read as saying so (ROO-67 decide 78e615b4); (3) definition history — for each suite-level definition the contract leans on, the commit that introduced it and each that narrowed or widened it, at the definition and at this contract's use sites (`git log -L`, `git blame`, `git log -S`), read as the intent the current text carries; (4) real use — `~/.claude/projects/*/*.jsonl` sessions where the skill ran, typed by the contributor or through its delivery path (exclude `-private-tmp*`): what the deficit looked like there and where the run went wrong or right; where the skill runs rarely, the commit history of the artifact its deficit is resolved in")
  | .search       => (.dispatch, "delegate to a subagent: primary sources on the cognitive deficit the protocol takes and the resolution it yields; a claim from a setting unlike the protocol's names that transfer; every claim carries its verification strength and names its weakest link (`AGENTS.md` §Settled Directions, Academic grounding). A sketch choice the gathered literature does not reach sends one targeted search here, fed into the sketch gate, never as a verdict")
  | .derive       => (.sense, "Internal analysis, from the gathered material and not from the current block: first the solution sentence — one sentence of what the person can then say or recognize, the repair direction every later finding is read against; then the coordinates only the person fills, the closure kinds, the domain boundary — what the transformation itself carries and what lies past its hand-off, named at the delegation point and not prescribed (ROO-67 decide dad26302) — and the conditions that hold only where a ground carries them: Northstar, premise, literature, the contributor's utterance, a decide, or observed use. Any other step is scaffolding, carried as guidance on a documented judgment (ROO-67 decide 0d3b1e3b). Each part names its ground. A shape carried from a sibling protocol's re-derivation is pre-understanding: each carried clause, constructor or slot is tested against this protocol's deficit and governing surfaces before it enters the solution")
  | .consult      => (.dispatch, "delegate (`/codex-plus:codex`, an English prompt): before the solution gate, an independent derivation — the locations of the gathered material, the literature findings as a file, and the question, never this session's solution; it may read beyond the list. Before the sketch gate, the sketch's material and question with conclusions withheld. The two readings are compared part by part")
  | .read         => (.observe, "artifact read in a scratch tree at `origin/main` (`git worktree add --detach <scratch> origin/main`), an open PR branch merged into it where one exists: run `node .claude/skills/verify/scripts/lean-contract.js generate . && lake build --wfail` and `node .claude/skills/verify/scripts/static-checks.js .`, record failures, fix nothing, remove the scratch tree. Pre-Lean diff: the block's last DSL version is the parent of the first commit that put a Lean block in that `SKILL.md` (`git log <ref> --reverse --format=%h -S` on the opening Lean fence, then `<sha>^`), or the current block where it is still the DSL; walk it clause by clause against the current block and list every field read with no write or written with no read. An obligation the current block no longer carries is traced to the commit that removed it (`git log -S`, `git blame`): a decide or a commit message that states the removal marks it intended, anything else is a regression reported with its locator. Termination graph: every way a run ends and who closes it — person, AI relay, evidence; an unanswered checkpoint closes nothing and selects nothing, and which steps need one is read under the checklist's Gate earns its place. Replay the real-use scene where the current contract bites. Apply `references/reading-checklist.md` with file:line evidence. The result is a diagnosis: what the current contract carries that the solution does not, and what it lacks. These walks, each lost obligation's disposition apart, do not depend on the solution; another context may prepare them before the solution gate")
  | .sketch       => (.sense, "Internal analysis: the before and after flow, a table of what changes and what stays, and the real-use scene replayed on the new shape; each clause the sketch would add checked for a second wording (`premise/instruction-authoring.md` §No Duplication, ROO-67 decide 6b4385c0); for each outcome that hands off, the payload it supplies and how referenced material stays reachable; every lost obligation — one the current block dropped, or one whose carrier the sketch or a later fix removes — with its disposition: held elsewhere in the solution with the line that carries it named, retired on a named ground, or a challenge to the solution; one held with no line to name is such a challenge")
  | .record       => (.track, "record on the protocol chart through its decide moment (`/unfold decide`), as `recorded` states: protocol-local points on the protocol chart, suite-wide ones on ROO-67, a principle that holds beyond this repository as a proposal on the premise chart (ROO-77) and never a `premise/` edit in this PR; wherever the run cites a decide, the citation names its chart beside its id")
  | .edit         => (.dispatch, "delegate: a fork in a worktree, given the decide ids as its spec — and the provisional gate records where gates stand provisionally — on the open PR's branch rebased onto `origin/main`, or on a new branch from `origin/main` carrying the chart id. Commit A, where the contract is a Lean block not yet in this shape: GROUND copied from `lean/EpistemicProtocols/Ground.lean`, judgments as documented `axiom`, a `Nonempty` instance per axiom type, and each guarantee proved at the boundary it claims in `lean/EpistemicProtocols/<Namespace>/Theorems.lean` — a guarantee that claims run behavior takes the run's provenance as premise, its docstring claims no more than its statement, and a person-origin guarantee identifies the filled occurrence and its own citation. Commit B: the re-derivation, a block that is not yet Lean taking that shape here from the taken solution, with the surfaces that describe the changed interface swept before the PR and again after each interface-changing fix; `/realize` cases stay as main has them, their re-derivation being ROO-88's unit (ROO-67 decide 41cc4259); another protocol's contract that names this one goes to a ROO-67 follow-up. Plugin version one minor step over main's (ROO-67 decide db1de854). Verify: `lean-contract.js check` (generate, `lake build --wfail`, `lake lint`), `lake test`, static checks, the `AGENTS.md` §Development test bundle, and `static-checks.test.mjs` in its own `node --test` run. The PR body keeps the record current and carries `Part of ROO-67`; where the protocol chart is shared it names that chart after `Part of` too and the PR title leaves its id out. This session checks the fork's report against the branch, CI and the decide texts before relaying it, and a choice in it whose materially different alternatives stay compatible with those texts is brought to the gate before work that depends on it")
  | .rehearse     => (.dispatch, "delegate: the edited contract run in a fresh context that carries it, in a copy with no push remote, case by case. A case is a scene the gathering read from real use, as that use recorded it and in the person's words where it has them — gathered again where that material is out of reach — or, for a path of the edited contract's procedure that no recorded scene takes, a constructed scene, marked as constructed wherever it is shown. A case reads the person's records — past sessions, repositories, mail and trackers as records, the work organization's among them — and touches no running operational system. Cases are added until `Sufficient` holds. Where recorded use alone cannot tell what the edit changed, the earlier wording is run beside the edited one on the same case, the two interleaved in one window. A mismatch of uptake — the material was in context and not acted on — is answered with wording only after the wording this run already added for that mismatch is listed back to its first addition, and removing it has been rehearsed against adding more on the case that first failed")
  | .solutionGate => (.interaction .constitution, "the derived solution beside the ground of each part, its domain boundary among them; where the independent derivation agrees and where it splits; the real-use reading; the contrary grounds and the live alternatives with their consequences; the limits of what was searched")
  | .sketchGate   => (.interaction .constitution, "the sketch as its operation composes it, the consult's agreements and splits, the lost obligations with their dispositions, and the choices whose cost the reader bears")
  | .readTurn     => (.sense, "Internal analysis: how the latest arrival reads at the gate that stands, as `ReadingSupported` states")
  | .carryOn      => (.interaction .extension, "work carried past a held gate, as `carried` states; on the contributor's return the gate `reached` names is shown with every provisional gate, in the contributor's language, from one scene before and after — the scene the sketch replays where there is one — each provisional gate with what was shown, the provisional choice and what would change it. No gate is said to be taken")
  | .converge     => (.interaction .constitution, "the rehearsal gate: `narrative`, with the edited contract's own output quoted at each choice point and the place of its full text, and beside it what recorded use shows of the earlier contract in that scene")
  | .handOff      => (.interaction .extension, "HandOff relayed: the branch carrying the chart id and its open PR; the decides by chart and id; the narrative, with what was not reached and what reaching it needs; that any `/realize` cases still judge the earlier contract; that verifying the contract in use lies outside this skill. Where nothing is to change, the diagnosis")

/-- The work that leads up to each gate, in order: what `prepared` carries out for it. -/
def before : Gate → List Op
  | .solution  => [.gather, .search, .derive, .consult]
  | .sketch    => [.read, .sketch, .consult]
  | .rehearsal => [.edit, .rehearse]

/-- The operation that shows each gate. -/
def shows : Gate → Op
  | .solution  => .solutionGate
  | .sketch    => .sketchGate
  | .rehearsal => .converge

end

end Rederive
```
