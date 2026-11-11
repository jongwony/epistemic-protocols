---
name: rederive
description: "This skill should be used when a contributor names a skill whose Lean contract is to be re-derived — a core protocol, or a utility skill whose formal block is or becomes Lean — or invokes /rederive. Runs the per-skill flow: gather the pre-understanding, derive the skill's epistemic solution and fuse it with the contributor's horizon, then read the current contract against it, through sketch, edit and rehearsal, to the fusion of the contributor's horizon on the rehearsal result. Project-local contributor tooling."
allowed-tools: Bash, Read, Grep, Glob, Agent, Skill
---

# Re-derive a protocol contract

One skill per run, whose formal block is Lean or becomes Lean in the run: a core protocol in `scripts/load-protocols.js` `CANONICAL_PROTOCOL_SET`, or a utility skill in `LEAN_CONTRACT_UTILITIES` there, which a utility still carrying a text-DSL block enters in its run. Below, *the protocol* names that skill whichever kind it is. The object is the protocol itself — its `SKILL.md` on `origin/main`; an open PR whose branch carries the chart id, where one exists, is one more piece of material, never the anchor. Anchor chart: the protocol's own `ROO-*` chart, which for a utility may be one chart several skills' runs share; suite-wide ground: ROO-67.

**What a re-derivation answers to.** The target is the morphism that the `AGENTS.md` Northstar and the premise axiom Context and Utterance as First-Class Ground (`premise/recognition-and-authority.md`) admit, in the form `lean/EpistemicProtocols/Ground.lean` fixes: the fused context — turns bound to who sent them — and the person's utterance are the ground; the structure fixes only what the harness knows; everything else is the model's inference, declared as a documented judgment inside the types. The solution is derived from the gathered pre-understanding and taken at the fusion gate before the current contract is read; the pre-Lean DSL, the current block, any open PR and earlier decides are evidence read against that solution, never the target.

## Definition

The run as a contract: its gates, how a turn at a gate is read, how a run ends, and where a finding returns it. The Steps after the block say how each operation is carried out.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract.
The Steps after the block say how each operation is carried out and what each gate shows; they
add no gate, no end, and no return path this block does not have.
-/

/-! ── FLOW ──
Rederive(protocol) → start(c) → run(fusion, c, arrivals), where c is the fused session context:
  before a gate is shown, the work `before` lists for it runs and joins the context
    [a finding of that work moves the ground of a part already taken]  → the fusion gate instead
  fusion gate → sketch gate → rehearsal fusion: each is shown, and then holds for a turn
  next arrival a — the contributor's utterance, or their words as a record or a peer relays them:
    [it settles nothing]  answered; the gate holds
    [it stops the run]    what was gathered and derived is recorded; the run ends, nothing closed
    [it moves the pre-understanding, or the ground of a part already taken]  → the fusion gate
    [it corrects what the gate shows, the taken parts standing]  the work before this gate again
    [it takes what the gate showed]
      fusion:    recorded; the current contract is read against the solution
                 [nothing to change] the diagnosis is recorded; the run ends   [else] → sketch gate
      sketch:    recorded; the fork edits; the edit is rehearsed → the rehearsal fusion
      rehearsal: [the revision that stands was rehearsed]  → the hand-off; the run ends
                 [an edit came after the last rehearsal]   rehearsed again; this gate again
  no arrival: the gate holds; nothing is taken and nothing ends
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
    the sketch, and what the edited contract produced in rehearsal. -/
inductive Gate | fusion | sketch | rehearsal

/-- How a turn at a gate is read. Premise: one turn carries one of these or none. A turn that
    carries none settles nothing — a question, an appraisal, a request to look at something — and
    is answered with the gate left open. -/
inductive Reading
  /-- the contributor takes what the gate showed, all of it, with no second permission for any
      line -/
  | takes
  /-- the contributor corrects or replaces part of what the gate shows, and every part already
      taken keeps its ground: a redraw, or a fix -/
  | applies
  /-- the turn moves the pre-understanding, or the ground of a part already taken, naming the
      part it moves -/
  | movesGround
  /-- the contributor ends the run -/
  | stops

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

/-- **Your work** before a gate is shown — the operations `before` lists for it, carried out as
    the Steps state — each read and each delegated result returning as an evidence turn. A
    finding that applies a taken part is fixed inside this work. On a return to a gate, only what
    the latest turn or finding moved is done again. -/
axiom prepared : Gate → Context P → List (Evidence P)

/-- **Your record** on the protocol chart of what the latest turn settled or ended: a decide for
    each point a taking at the fusion or the sketch gate settled, its reason and its rejected
    alternative in the contributor's words — a slot their words leave empty is asked, never
    inferred; the diagnosis, where nothing is to change; what was gathered and derived, where the
    contributor stops. -/
axiom recorded : Context P → List (Evidence P)

/-- **Your judgment** (Re-entry): a finding of the work just done moves the ground of a part
    already taken. -/
axiom FindingMovesGround : Context P → Prop

/-- **Your diagnosis**, from reading the current contract against the taken solution: it is
    already a Lean block, lacks nothing the solution asks, and carries nothing the solution does
    not. -/
axiom NothingToChange : Context P → Prop

/-- **Your reading**: this turn reports a change to the contract under re-derivation — the fork's
    edit, a fix, or a change anyone else made on its branch. -/
axiom Edits : Turn P → Prop

/-- **Your reading**: this turn is the record of a rehearsal of the contract as it then stood. -/
axiom Rehearses : Turn P → Prop

/-- The revision that stands was rehearsed: the context holds a rehearsal record with no edit
    after it. -/
def Rehearsed (c : Context P) : Prop :=
  ∃ i, ∃ h : i < c.length, Rehearses (c[i]'h) ∧
    ∀ j, ∀ hj : j < c.length, i < j → ¬ Edits (c[j]'hj)

/-- **Your record**: scene by scene, what the rehearsal did not reach — the closures only the
    person makes among them — each with what reaching it needs. -/
axiom unreached : Context P → List String

/-- What a run hands off once the contributor has taken the rehearsal result. Verifying the
    contract in use lies past this hand-off, which names it and prescribes nothing about it. -/
structure HandOff (P : Type) where
  context   : Context P
  fusedAt   : Nat
  unreached : List String

/-- The end of a run whose reading found nothing to change, with the turn that took the solution
    it was read against. -/
structure Diagnosis (P : Type) where
  context : Context P
  takenAt : Nat

inductive Outcome (P : Type)
  /-- the run stands at a gate with nothing further taken: no arrival came, or the contributor
      stopped — a stop is no result, and it stays in the context. Work carried past a held gate
      is provisional, recorded apart from any decide, and is no arrival. -/
  | holding (g : Gate) (c : Context P)
  | noChange (d : Diagnosis P)
  | handedOff (h : HandOff P)

/-! ── MODE STATE ──
Λ is the fused context: what was taken, edited, and rehearsed is read from its turns, and no field
stores it. The gate argument of `run` is the gate last shown.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
The work before a gate appends what `prepared` returns [Tool]; `respond` presents the gate from the
context that work leaves, with its findings grouped by the part they bear on; `session` answers a
turn that settles nothing.
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
/-- The gate shown on the context a pass leaves, with its presentation appended: the gate the pass
    led up to, or — where a finding of the pass moves the ground of a part already taken — the
    fusion gate, after the work before it. -/
def shown (respond : Gate → Context P → Response P) (g : Gate) (c₁ : Context P) :
    Gate × Context P :=
  if FindingMovesGround c₁ then
    let c₂ := pass .fusion c₁
    (.fusion, c₂ ++ [(respond .fusion c₂).val])
  else (g, c₁ ++ [(respond g c₁).val])

open Classical in
def run (respond : Gate → Context P → Response P) (session : Context P → Response P) :
    Gate → Context P → List (Arrival P) → Outcome P
  | g, c, []      => .holding g c
  | g, c, a :: as =>
    let c' := arrive c a
    match latest c' with
    | none => run respond session g (c' ++ [(session c').val]) as
    | some (.stops, _) => .holding g (settle c')
    | some (.movesGround, _) =>
      let next := shown respond .fusion (pass .fusion c')
      run respond session next.1 next.2 as
    | some (.applies, _) =>
      let next := shown respond g (pass g c')
      run respond session next.1 next.2 as
    | some (.takes, n) =>
      match g with
      | .fusion =>
        let c₁ := pass .sketch (settle c')
        if NothingToChange c₁ then .noChange ⟨settle c₁, n⟩
        else
          let next := shown respond .sketch c₁
          run respond session next.1 next.2 as
      | .sketch =>
        let next := shown respond .rehearsal (pass .rehearsal (settle c'))
        run respond session next.1 next.2 as
      | .rehearsal =>
        if Rehearsed c' then .handedOff ⟨c', n, unreached c'⟩
        else
          let next := shown respond .rehearsal (pass .rehearsal c')
          run respond session next.1 next.2 as

def start (respond : Gate → Context P → Response P) (session : Context P → Response P)
    (c : Context P) (as : List (Arrival P)) : Outcome P :=
  let next := shown respond .fusion (pass .fusion c)
  run respond session next.1 next.2 as

/-! ── CONVERGENCE ──
handed off: the contributor's turn took the rehearsal result on a revision rehearsed since its last
edit; the HandOff is relayed as the rehearsal-fusion step states. Where that gate was not answered,
a hand-off prepared provisionally says the fusion was not taken, and no `handedOff` is claimed.
no change: the diagnosis is recorded and relayed; nothing is edited.
Convergence evidence: (pre-understanding → taken solution → reading → sketch → edit → rehearsal →
the contributor's turn on what the contract produced → HandOff). Demonstrated, not asserted.
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
  | fuse | gate | readTurn | converge | handOff

def grounding : Op → Annot × String
  | .gather   => (.observe, "artifact read, record read: the pre-understanding, as the gathering step lists it; read-only")
  | .search   => (.dispatch, "delegate: the literature search of the gathering step")
  | .derive   => (.sense, "Internal analysis: the protocol's epistemic solution, each part with what grounds it")
  | .consult  => (.dispatch, "delegate: the independent derivation before the fusion gate; the sketch consult before the sketch gate")
  | .read     => (.observe, "artifact read in a scratch tree: the current contract against the taken solution; failures recorded, nothing fixed")
  | .sketch   => (.sense, "Internal analysis: the sketch, with each lost obligation's disposition")
  | .record   => (.track, "record: on the protocol chart, as `recorded` states")
  | .edit     => (.dispatch, "delegate: the fork's edit, with the decides as its spec and the verification run")
  | .rehearse => (.dispatch, "delegate: the edited contract run in a fresh context on the gathered scenes, as the rehearsal step states")
  | .fuse     => (.interaction .constitution, "the fusion gate, as its step states")
  | .gate     => (.interaction .constitution, "the sketch gate, as the sketch step states")
  | .readTurn => (.sense, "Internal analysis: how the latest arrival reads at the gate that stands, as `ReadingSupported` states")
  | .converge => (.interaction .constitution, "the rehearsal fusion, as its step states")
  | .handOff  => (.interaction .extension, "HandOff, relayed as the rehearsal-fusion step states; where nothing is to change, the diagnosis")

/-- The work that leads up to each gate, in order: what `prepared` carries out for it. -/
def before : Gate → List Op
  | .fusion    => [.gather, .search, .derive, .consult]
  | .sketch    => [.read, .sketch, .consult]
  | .rehearsal => [.edit, .rehearse]

/-- The operation that shows each gate. -/
def shows : Gate → Op
  | .fusion    => .fuse
  | .sketch    => .gate
  | .rehearsal => .converge

end

end Rederive
```

## Steps

1. **Trigger** — a contributor names the protocol. Resolve its chart; where the protocol's earlier chart is Done, open a new chart linked to it and to ROO-67 (ROO-67 decide 5e64392d). The order across protocols is the contributor's and session-local; nothing here fixes it.
2. **Gather the pre-understanding** — afresh every run, since what it holds moves between runs:
   - Ground: the Northstar, the premise axiom above, `Ground.lean`, and the protocol's declared deficit and resolution type — its Type line and Definition only, not the formal block; the fusion gate may revise them.
   - Decide coordinates: both charts' decide comments, the protocol chart's Open questions and its related issues; a later decide that supersedes an earlier one says so (ROO-67 decide 78e615b4).
   - Literature: delegate to a subagent — primary sources on the cognitive deficit this protocol takes and the resolution it yields; where a source's setting differs from the one the protocol runs in, the claim names that transfer. Every claim carries its verification strength and names the weakest link (`AGENTS.md` §Settled Directions, Academic grounding).
   - Definition history: for each suite-level definition the protocol's contract leans on — the COMPOSITION operator, a GROUND term, a convention another surface states for it — the commit that introduced it and each later commit that narrowed or widened it, in the definition itself and at the places this contract uses it (`git log -L` on the definition, `git blame`, `git log -S` on its terms at each use site), read as the intent the current text carries forward.
   - Real use: `~/.claude/projects/*/*.jsonl` sessions where the skill ran — typed by the contributor or invoked through its delivery path (exclude `-private-tmp*`); what the deficit looked like there, and where the run went wrong or right. Where the skill runs rarely by nature, its sessions leave little; the commit history of the artifact its deficit is resolved in — each time that deficit came up and was resolved, by this skill or another route — is the real use read instead.
3. **Derive the solution** — the protocol's epistemic solution, from the gathered material, not from the current block: deficit → resolution, first stated as its solution sentence, one sentence of what the person can then say or recognize — the repair direction every later finding is read against; the coordinates only the person fills, the closure kinds, the domain boundary — what the transformation itself carries and what lies past its hand-off, which the contract names at its delegation point and does not prescribe (ROO-67 decide dad26302) —, and the conditions that hold only where a ground carries them — Northstar, premise, literature, the contributor's utterance, a decide, or observed use; any other morphism step is scaffolding, carried as guidance on a documented judgment (ROO-67 decide 0d3b1e3b). Each part names what grounds it. A shape carried from a sibling protocol's re-derivation is pre-understanding: each carried clause, constructor, or slot is tested against this protocol's deficit and governing surfaces before it enters the solution.
   - Independent derivation: `/codex-plus:codex` with an English prompt carrying the locations of the gathered material, the literature findings as a file, and the question this step answers — never this session's solution; it may read beyond the list. Compare the two derivations part by part.
4. **Fusion gate** — present the derived solution beside the ground of each part, its domain boundary among them, where the independent derivation agrees and splits, the real-use reading, the contrary grounds and live alternatives with their consequences, and the limits of what was searched. Branches:
   - the contributor takes it → write the solution decide on the protocol chart (`/unfold decide`) and go to the reading step;
   - the contributor corrects or replaces part of it → fuse the utterance and derive again;
   - the correction moves the pre-understanding (a source, a decide, a reading of use) → gather again where it moved, then derive;
   - the contributor stops → the run ends; what was gathered and derived is recorded on the protocol chart;
   - no utterance → nothing is taken as a decide; whether the run waits or goes on past the gate is judged from its context, and going on follows *Without the contributor* below.

   **Re-entry.** A later finding — in the reading, the sketch, the sketch consult, or the rehearsal — is triaged by what it does to a taken part: one that moves the ground of a taken part returns the run to the earliest step that part depends on and then to this gate, naming the part it moves; one that applies a taken part is a fix. Findings are presented grouped by the part they bear on, not as an item list. Parts whose ground did not move stand; a pass that moves no ground re-opens nothing.

   **Without the contributor.** Where the run proceeds unattended or goes on past a gate the contributor has not answered, each gate in it that holds the contributor's judgment is taken provisionally on the branch the settled decides and premise support, and the run goes on; where a repair can proceed only by choosing between provisional directions still in contention, that choice is a horizon-fusion point — the case that distinguishes them is kept for the contributor, that branch is refined no further until the contributor answers, and independent work goes on. The gates are recorded as one comment on the protocol chart headed as provisional gate records, never as a decide — per gate what was shown, the options, the provisional choice with its ground, and what would change it — and the PR marks what rests on them as provisional. When the contributor returns, the provisional gates are presented in the contributor's language, starting from the scenario the sketch replays, before and after; each gate's answer becomes a decide on the chart.
5. **Read the current contract against the solution** — in a scratch tree at `origin/main` (`git worktree add --detach <scratch> origin/main`), with the open PR branch merged into it where one exists. Run `node .claude/skills/verify/scripts/lean-contract.js generate . && lake build --wfail` and `node .claude/skills/verify/scripts/static-checks.js .`; record failures, fix nothing; remove any scratch tree. This and the walks below up to the termination graph, except each lost obligation's disposition, do not depend on the solution: another context may prepare them before the fusion gate, and this session opens them once the solution is taken, or taken provisionally under *Without the contributor*.
   - Pre-Lean diff: the block's last DSL version is the parent of the first commit that put a `lean` block in that `SKILL.md` (`git log <ref> --reverse --format=%h -S'```lean' -- <SKILL.md> | head -1`, then `<sha>^`); where the block is still the DSL, that version is the current block. Walk it clause by clause against the current block, and list every field read with no write or written with no read on either side. For each obligation the current Lean block no longer carries, `git log -S'<clause or field>'` and `git blame` find the commit that removed it; a decide or a commit message that states the removal marks it intended, anything else is a regression reported with its locator. Each lost obligation — those, and each obligation whose carrier the sketch or a later repair removes — carries a disposition, to the sketch gate or with the repair that removes its carrier — held elsewhere in the solution, naming the line that carries it, retired on a named ground, or a challenge to the solution that goes through re-entry; one held with no line to name is such a challenge.
   - Termination graph: every way a run ends, and who closes it (person · AI relay · evidence). An unanswered checkpoint closes nothing and auto-selects nothing; which steps need one is read under the checklist's **Gate earns its place**.
   - Replay the real-use scenario where the current contract bites.
   - Apply the checklist below with `file:line` evidence. The result is a diagnosis: what the current contract carries that the solution does not, and what it lacks. Where a Lean contract lacks nothing and carries nothing extra, the run ends with that diagnosis recorded on the chart; a still-DSL contract goes on to the sketch for its first Lean block.
6. **Sketch** — before/after flow, a table of what changes, what stays, and the scenario replayed on the new shape. Before it is shown, each clause the sketch would add to the contract is checked for a second wording as `premise/instruction-authoring.md` §No Duplication states it (ROO-67 decide 6b4385c0). For each outcome that hands off, show the payload it supplies and how any referenced material remains reachable. Present the lost obligations with their dispositions and the choices whose cost the reader bears as a gate. A sketch choice the gathered literature does not reach sends one targeted search back to the gathering step, fed into the gate, never as a verdict.
7. **Sketch consult** — `/codex-plus:codex` with an English prompt carrying the sketch's material and question, conclusions withheld; compare with this session's reading and report agreements and splits.
8. **Decides** — one per settled point: protocol-local → the protocol chart; suite-wide → ROO-67; a principle that holds beyond this repository → a proposal on the premise chart (ROO-77), never a `premise/` edit in this PR. Each via `/unfold decide`; wherever the run cites a decide — commit messages and the PR body among them — the citation names its chart beside its id.
9. **Edit in a fork** — a fork in a worktree, given the decide ids as its spec — with the provisional gate records where gates were taken provisionally —, on the open PR's branch rebased onto `origin/main`, or on a new branch from `origin/main` carrying the protocol chart id:
   - commit A, where the contract is a Lean block not yet in this shape: GROUND copied from `lean/EpistemicProtocols/Ground.lean`, model judgments as documented `axiom`, a `Nonempty` instance per axiom type and each guarantee proved at the boundary it claims in `lean/EpistemicProtocols/<Namespace>/Theorems.lean`. A guarantee that claims run behavior takes the run's provenance as premise, and its docstring claims no more than its statement. A person-origin guarantee identifies the filled occurrence and its own citation; a still-DSL block takes this shape in commit B, its first Lean block written from the taken solution;
   - commit B: the re-derivation, with the surfaces that describe the changed interface swept before the PR and again after each interface-changing repair (co-change) — where the protocol has `/realize` cases, they stay as main has them and the hand-off records that they still judge the earlier contract — their re-derivation (graders, scripted turns, oracle, observation window) is ROO-88's own unit (ROO-67 decide 41cc4259); another protocol's contract that names this one goes to a ROO-67 follow-up rather than this PR;
   - plugin version: one minor step over main's (ROO-67 decide db1de854);
   - verify: `lean-contract.js check` (generate, `lake build --wfail`, `lake lint`) and `lake test`, static checks, the `AGENTS.md` §Development test bundle, and `static-checks.test.mjs` in its own `node --test` run;
   - PR body keeps the record current and carries `Part of ROO-67`; where the protocol chart is shared, the body names it after `Part of` as well and the PR title leaves its id out, so the merge leaves the chart open for the other runs.
   Check the fork's report against the branch, CI and the decide texts before relaying it. A choice in it whose materially different alternatives remain compatible with those texts returns through step 4 before work that depends on it.
10. **Rehearsal** — rehearse the edited contract in a fresh context that carries it, on the scenes the gathering step read from real use — each as that use recorded it, in the person's words where it has them —, as far as the AI's own reach goes. Per scene, record what the edited contract produced there and what the rehearsal did not reach — the person-held closures among them — with what reaching each needs. A rehearsal runs in a copy with no push remote, and two wordings compared by rehearsal run interleaved in one window. A mismatch of uptake — the material was in context and not acted on — is read before any wording is added to answer it: the additions already made for it are traced to the first, and removing them is rehearsed against adding another on the scene that first failed.
11. **Rehearsal fusion** — present, scene by scene, what the edited contract produced, in the form that contract itself presents it, beside what the recorded use shows of the earlier contract there, and what was not reached with what reaching it needs. The contributor's utterance on it is fused as their horizon and read by step 4's branches and Re-entry; a fix goes back through the fork (step 9) and is rehearsed again before this gate is shown again. Where the contributor takes the result, the run ends at the hand-off: the branch carrying the chart id and its open PR; the decides by chart and id; per scene what the rehearsal reached, and what it did not reach with what each unreached thing needs; that any `/realize` cases still judge the earlier contract; and that verifying the contract in use lies outside this skill. A hand-off prepared under *Without the contributor* says the fusion was not taken.

## Checklist (reading step)

- **Translation or re-derivation** — does a stage machine (projected gate or phase state) return inside the fused context; do rule chains that guarded a changing Λ survive (premise "Cases in Place of a Judgment"); does each decomposition the contract carries — sub-judgments, filters, derived defs — take its disposition, slow-layer carrier or scaffolding, before any repair to its parts?
- **Gate earns its place** — a judgment gate stands where its answer is irreversible or is the held judgment the closure needs; a reversible step the person can interrupt through the harness takes no added gate.
- **Place of observation** — is evidence adoption needs observed before the presentation, not after closure?
- **Focus and decision** — is a value on the record made only by a person's turn: its standing read from what that turn did, its proposer judged apart, adoption only for a value shown on a map or sheet before that turn, and of everything the sheet showed when that turn takes it, with no second permission for any line (ROO-67 decide 4ad45b5f; a record rule, not a gate on the closing transition; per-value deciding evidence, contrary grounds and ownership marks are welcome, not required), and its reach re-read on the fused context as it now stands with no read-once layer? Does focus — the inventory, the read-back, the presentation, whether an utterance bears on the run — compute no record value and harden into no obligation?
- **Closure kinds** — where the person closes, is that closure a result constructor kept apart from the AI's relay; where completion is structural, does it ask for no closing turn; and does a person's ending — withdrawing, stopping — carry no result constructor, the ending and what was taken up to it staying in the context (ROO-67 decide b5de0e8b)? Turning to other work closes nothing; routing is not a closure kind.
- **Next move** — does the hand-off stop at the delegation point the domain boundary taken at the fusion gate sets, prescribing nothing past it; does it name only the next move the person declared, with its citation, claiming nothing about how the next protocol runs?
- **After closure** — is the AI's contrary ground shown before the gate and attached to the closure record when the person closes over it; is "accepted, evidentially disputed" representable?
- **No premature typing** — does the sketch, or a later repair, close a model judgment (item identity, per-item kind, turn form, iteration, ordering, scope) into a type or new Lean structure? Tell a failed judgment apart from a carrier that cannot preserve its obligation (`premise/specification-and-judgment.md`). Keep the answer a `supports` judgment, and type only an independently grounded constraint that a demonstrated contract gap requires. A reviewer repeating an assertion is not, by itself, a demonstrated failure.
- **Presentation** — for a protocol that revises a map or plan: the current sheet; a picture only where paths diverge.
- **One slot, two meanings** — does any field carry two orthogonal meanings at once?
