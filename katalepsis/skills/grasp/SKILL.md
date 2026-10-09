---
name: grasp
description: "Something in play — code, a document, a result, quotable in context — needs to be actually understood; the user can't follow it yet or nods along unsure: verify understanding step by step."
---

# Katalepsis Protocol

Achieve certain comprehension of a target in play — code, a document, a result — through structured verification, enabling the user to grasp what stands ungrasped. Type: `(TargetUngrasped, User, VERIFY, Target) → VerifiedUnderstanding`.

## Definition

**Katalepsis** (κατάληψις): A dialogical act of achieving firm comprehension—from Stoic philosophy meaning "a grasping firmly"—resolving an ungrasped target into verified user understanding through a map of understanding built with the person and checked against the target's material and the results they ask to see.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract.
-/

/-! ── FLOW ──
Katalepsis(R) → start(c) → grasp(c, utterances), where c is the fused session context:
  present(c): the map and the next round, read afresh from the context → Stop
  next utterance u, read on fuse(c, u) →
    [the utterance does not bear on this run]   the session answers it; that answer stays in the
                                                context; nothing is consulted; no gate of this run
    [otherwise] c' := fuse(c, u) with what `consult` reads now appended, a check's result
      included, every reading below taken afresh on c' →
      [the person withdraws (WithdrawalSupported)] → Withdrawn
      [the person closes (ClosureSupported)]       → VerifiedUnderstanding
      [otherwise]                                  → present(c')
  no utterance: the gate holds; nothing is taken
-/

/-! ── MORPHISM ──
Target
  → gather               -- the target's material and the sources that bear on it, read now (focus)
  → map                  -- the purpose the person said (`ScopeSupported`), else your reading of it marked as yours; the aspects it turns on, each with what it rests on (focus)
  → present              -- the map's changes and the next round, with its material (focus)
  → fuse(u)              -- the person's turn joins the context whole
  → check                -- a check handed to execution as `.check` says; its result returns through `consult`
  → close                -- the person's closure over the map (`ClosureSupported`)
  → VerifiedUnderstanding
requires: target_exists(R)              -- the comprehension target is present in context and can be quoted verbatim; its provenance is unconstrained. An admission condition on the target, not a promise that every answer finds enough ground for adjudication
deficit:  TargetUngrasped               -- activation precondition (Layer 1)
preserves: R                            -- this run reads the target and never rewrites it; a check changes no existing state; a change to the target is the session's other work
invariant: Grounded, not asserted       -- every aspect on the map says what it rests on; your explanation is never shown as the person's understanding
invariant: Focus never records          -- the map and the presentation are re-read every turn and carry no authority; only the person's turns move a value the person holds, and an observed result moves only what it observed
-/

namespace Katalepsis

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

/-- `R`, the target: material present in the context and quotable verbatim — code, a document, a
    result — whatever produced it. Read from the context; this run never rewrites it. -/
abbrev Target (P : Type) := Context P

/-- A purpose or an aspect, named as the map shows it. -/
abbrev Entry := String

/-- **Your judgment**: the cited person turn says what they mean to understand of the target —
    and, where they say it, for what purpose — read against the context as it now stands, in their
    own words, by taking the reading of their purpose the map showed, or by handing the choice to
    you. Taking what was shown adopts it as it was shown; handing the choice to you lets you set it
    within the target, and the map says what you set, as yours, open to their correction. The
    invoking utterance fills it when it says it. A later turn may change the scope; whether an
    earlier one still reaches what is now at issue is read on the current context. -/
axiom ScopeSupported : Context P → Turn P → Entry → Prop

/-- Only a person's turn sets the scope. -/
def scopeCoord : Coord P Entry :=
  { admits := (·.val = .person), supports := ScopeSupported }

/-- **Your reading**: the scope as it stands in `c` — filled by the person's latest turn that sets
    it; `open_` until one does. -/
axiom scope : (c : Context P) → Occ (scopeCoord (P := P)) c

def isFilled {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Bool
  | .open_ _   => false
  | .filled .. => true

/-- **Your judgment**, the live inventory: every aspect of the target this run has raised for the
    purpose — what the purpose turns on, a contradiction, an edge the person has not voiced alike.
    An aspect raised once stays here — whether or not the current round shows it, and even when a
    later scope no longer turns on it, marked so; a set-aside aspect stays too. The person may
    merge or reword aspects; whether a reworded aspect is the same aspect is your judgment.
    Guidance for the reading, not types it fixes: a Horizon edge is an edge of what the target
    does that the person has not voiced and the purpose needs, raised openly like any other aspect
    where the target's material grounds it — not a decision to make, a reframing, or a choice of
    route, though understanding it may change how the person frames their purpose. A contradiction
    needs two distinct sourced sides on the same scope and premises; a repeated claim, the target
    and your quotation of it, or your explanation drawn from it is one side, not corroboration. -/
axiom aspects : Context P → List Entry

/-- A located span of one turn. -/
structure Side (c : Context P) where
  idx  : Nat
  lt   : idx < c.length
  span : String

/-- **Your judgment**: the located turn carries the target itself, at the quoted span, rather than
    the reasoning that produced it. Target provenance is unrestricted; where the turn is your own,
    whether it carries the target or reasoning about it is read here from its content. -/
axiom IsTarget : (c : Context P) → Side c → Prop

/-- **Your judgment**: the observed turn read its source in this run, when it was made — a source
    outside the context, or the output a check returned — and the span is the narrowest material
    supporting the judgment, quoted in place. A locator the person must go open is not the
    material; your own reasoning is never a measure, nor another agent's — a peer turn measures
    only as what a source it read or a check it ran returned. -/
axiom SourceRead : (c : Context P) → Cite c → String → Prop

/-- What a person's reading is measured against: the target's own material, in the turn quoted
    even after the target changes, or material from outside the conversation read in this run — a
    source outside the context, or the output a check returned. -/
inductive Measure (c : Context P)
  | target (s : Side c) (object : IsTarget c s)
  | source (observed : Cite c)
      (readNow : observed.src.val = .external ∨ observed.src.val = .peer) (span : String)
      (linked : SourceRead c observed span)

/-- **Your judgment**, the record rule: the cited person turn handles the aspect — produces,
    applies, predicts, or explains its relations at the level the aspect asks, in a reading of
    their own — where the material it is measured against bears it out, read against the context
    as it now stands. A reading the material parts from handles nothing and stays the person's
    reading. Assent, a self-rating, a bare pick among options you offered, or an echo of your own
    wording handles nothing; an explanatory paraphrase handles what it reaches. -/
axiom ShownSupported : (c : Context P) → Cite c → Entry → Measure c → Prop

/-- How a person's turn handled aspect `a`: the turn, and the material it was measured against,
    with that turn's support. -/
structure Shown (c : Context P) (a : Entry) where
  src       : Cite c
  byPerson  : src.src.val = .person
  measure   : Measure c
  supported : ShownSupported c src a measure

/-- **Your judgment**: the cited turn is what a check on aspect `a`, handed off as `.check` says,
    returned — a run, an experiment, a source read to settle it; what it shows for the aspect is
    read on the context as it now stands, and may be that it settles nothing. -/
axiom CheckSupported : (c : Context P) → Cite c → Entry → Prop

/-- A check run on aspect `a`: the turn its result arrived in, from outside the conversation, with
    that turn's support. A check someone has named and no one has asked to run is not one; it is
    read on the map with who named it. -/
structure Check (c : Context P) (a : Entry) where
  result    : Cite c
  observed  : result.src.val = .external ∨ result.src.val = .peer
  supported : CheckSupported c result a

/-- An aspect's row on the map: the person's own handling of it, if any, and the checks run on it.
    How the row stands is your judgment from these and the context — resting on your explanation
    alone, checked together, handled by the person, waiting on a check named and not run, or
    misaligned where the person's reading and the material part — and no standing is stored. -/
structure Cell (c : Context P) (a : Entry) where
  handled : Option (Shown c a)
  checks  : List (Check c a)

/-- **Your reading**: aspect `a`'s row, read afresh on `c`; whether a turn bears on a reworded
    aspect is your judgment. Where several person turns handle it, which one stands is read on the
    current context, and a later turn that contradicts it may leave it unhandled. -/
axiom cell : (c : Context P) → (a : Entry) → Cell c a

/-- The map: every aspect of the live inventory, with its row. -/
def map (c : Context P) : List ((a : Entry) × Cell c a) :=
  (aspects c).map fun a => ⟨a, cell c a⟩

/-- **Your record**: your contrary grounds bearing on the person's judgment, each with what it
    bears on and what it rests on, shown as `present` and CONVERGENCE say; new evidence after the
    closure is shown in the session beside it, and the closure stands. Empty when there are
    none. -/
axiom dissent : Context P → List String

/-- **Your judgment**: the latest utterance bears on this run — a purpose, a reading of the target,
    an acknowledgment, a wish to see or try something, a request for more depth, a correction of
    your reading, a question about the map, a closure, a withdrawal — judged on what the whole
    utterance does, read on the context with it before anything is consulted. An utterance about
    other work leaves the run as it stands: the session answers it, that answer stays in the
    context, and no gate of this run is raised. -/
axiom Reaches : Context P → Prop

/-- **Your judgment**: the cited turn — the latest utterance; a turn before the latest round closes
    nothing — says that what they now understand of the target serves their purpose, read on the
    context as it now stands. An acknowledgment of an explanation is not that. The map's
    standings, or your own reading, close nothing, and no standing holds the closure back. Setting
    one aspect aside does not close the run; a set-aside aspect stays on the map as it stood. -/
axiom ClosureSupported : Context P → Turn P → Unit → Prop

/-- Only the person closes the run. -/
def closureCoord : Coord P Unit :=
  { admits := (·.val = .person), supports := ClosureSupported }

/-- **Your reading**: the person's closure; `open_` until one reaches it. -/
axiom closure : (c : Context P) → Occ (closureCoord (P := P)) c

/-- **Your judgment**: the cited turn — the latest utterance; a turn before the latest round
    withdraws nothing — ends the run without saying that what they understand serves their
    purpose, for whatever reason, given or not; nothing open is delegated. Silence, or turning to
    other work, ends nothing. Your own reading that the run should end ends nothing. -/
axiom WithdrawalSupported : Context P → Turn P → Unit → Prop

/-- Only the person withdraws. -/
def withdrawalCoord : Coord P Unit :=
  { admits := (·.val = .person), supports := WithdrawalSupported }

/-- **Your reading**: the person's withdrawal; `open_` until one reaches it. -/
axiom withdrawal : (c : Context P) → Occ (withdrawalCoord (P := P)) c

/-- The record every exit carries, as CONVERGENCE lists it. -/
structure Closed (P : Type) where
  context : Context P
  scope   : Occ (scopeCoord (P := P)) context
  map     : List ((a : Entry) × Cell context a)
  dissent : List String

def closed (c : Context P) : Closed P :=
  { context := c, scope := scope c, map := map c, dissent := dissent c }

/-- `VerifiedUnderstanding`: the person's closure over the map CONVERGENCE lists — what each
    aspect rests on, as they saw it when they closed, with what came in after the closing word
    marked as such. It records that closure, not a certificate of what was demonstrated, nor
    omniscient comprehension. -/
structure VerifiedUnderstanding (P : Type) where
  closure : Closed P

inductive Outcome (P : Type)
  | verified  (r : VerifiedUnderstanding P)
  /-- the partial record: the map as it stood -/
  | withdrawn (r : Closed P)
  | holding   (c : Context P)

/-- **Your judgment**: the latest utterance, bearing on this run, asks for a check — a wish to see
    or try something — or takes the one you offered, read on the context as it now stands. -/
axiom AsksCheck : Context P → Prop

/-- **Your read**, now, of what the next judgment needs: the target's material and the sources that
    bear on it — any a turn cites, and any you find — as far as relevant access reaches. What you
    say you read, you read to the end. Empty where nothing outside the context bears. -/
axiom gathered : Context P → List (Evidence P)

/-- **Your read**, now: what the check handed off at `.check` returned. -/
axiom checked : Context P → List (Evidence P)

open Classical in
/-- What is read now: what is gathered, and what the check returned where `AsksCheck` holds, as
    `consultOps` hands it off. -/
def consult (c : Context P) : List (Evidence P) :=
  gathered c ++ (if AsksCheck c then checked c else [])

/-- The context with what `consult` read now appended. -/
def consulted (c : Context P) : Context P := c ++ (consult c).map (·.val)

/-! ── A-BINDING ──
bind(R) = the target the argument names, else the target most recently in play; words in the
invocation that say what to understand of it fill the scope (`ScopeSupported`).
-/

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

/-! ── PHASE TRANSITIONS ──
A step is one arm of a structural recursion over the person's utterances. `respond` is the next
round, as TOOL GROUNDING's `present` entry names it; `session` is the session's own answer to an
utterance about other work, which stays in the context without being a gate of this run.
-/

open Classical in
def grasp (respond session : Context P → Response P) :
    Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let f := fuse c u
    if ¬ Reaches f then grasp respond session (f ++ [(session f).val]) us
    else
      let c' := consulted f
      if isFilled (withdrawal c') = true then .withdrawn (closed c')
      else if isFilled (closure c') = true then .verified ⟨closed c'⟩
      else grasp respond session (c' ++ [(respond c').val]) us

/-- The run opens on a gathering and its first round. -/
def start (respond session : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  grasp respond session (consulted c ++ [(respond (consulted c)).val]) us

/-! ── LOOP ──
Every answer is read against the whole context as it now stands: nothing counts rounds, and no
earlier answer is held apart from what later ones say. No fixed cap: each round is dialogue.
-/

/-! ── CONVERGENCE ──
converged: a VerifiedUnderstanding the person's utterance closed. Withdrawal keeps its partial
record. The convergence evidence — the map at closure: each aspect with its standing, what it rests
on (the person's own reading with the material it was measured against, in their words; each check
run, with what it showed and, where it ran on a stand-in, what it left untested; each check named
and not run, with who named it and what it would settle; the person's account with neither measure
nor check, attributed to them, with no verdict and what would settle it; acceptance of your
explanation where that is what it rests on), whether the scope as it stands still turns on it, and
whether what it rests on was measured against a version of the target that has since changed; the
purpose and scope as they stand, open included, and marked as yours where you read or set it; what
could not be reached that bears on an aspect; the dissent — a contrary ground not shown before the
closing turn is shown here, and the closure stands; what the closing or withdrawing turn's own
reading brought in after the person's last word — a check's result, a re-read of the target — is
shown here marked as come after it, set against your explanation and the person's words, and the
closure or withdrawal stands. Grounded, not asserted.
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

inductive Op | gather | assess | present | check | readAnswer | converge | withdraw

def grounding : Op → Annot × String
  | .gather     => (.observe, "artifact read, artifact search: read-only reads, now, of the target's material and of the sources that bear on it — any the latest turn cites, and any you find as far as relevant access reaches; name what was reached and what was not, and any conflict among what was gathered")
  | .assess     => (.sense, "Internal analysis: the purpose reading, the live inventory of aspects and each one's row on the map, over the whole fused context as it now stands")
  | .present    => (.interaction .constitution, "the round, every round the first included. The first round is the map: the purpose as the person said it, or else your reading of it, marked as yours — where nothing grounds a useful reading, the target's main aspects, with the purpose line saying so; the aspects the purpose turns on, in the order it turns on them with that basis on the purpose line, an edge the person has not voiced among them where the material grounds one, each with its essence, the material it rests on and its standing; and your contrary grounds with their basis. A correction of the purpose moves the map. Every later round shows what changed on the map, and the whole map when the person asks for it; where the session has a surface that stays in view, the map can stay there as well. A contrary ground you hold stays in view until it is settled — on the surface that stays in view where the session has one, otherwise briefly beside each round. Explain each aspect in the one representation — a picture, an example, a metaphor — that best carries its essence for this person; leave out what their words show they know, and go deeper when they ask. Read the person's turn whole. The round that shows a check's result sets it beside the aspect, against the claim your explanation made and against whatever the person has said that bears on it, saying where each agrees and where it parts; agreement and parting alike — their words revealing a contradiction or simply being wrong included — are what the map is filled from. Before reading their words as a misreading, read whether they aim at another purpose: say that reading as a candidate with its basis and move the map, adding no question; if the person sets it aside, their words are read again as a reading of the target. A reading or application of their own is measured against the material: an adjudication follows only where you have material to attach; where there is none, give no verdict: say you have nothing to check the account against and name what would settle it. Where what they said and a `Measure` part on the same scope and premises, or two of their own utterances do, show it with its working in one round: their words quoted; the narrowest `Measure` where one bears on it, never your own explanation — scoped to what that material settles; why the two part; what they got right; and another reading beside it where the material allows. A contradiction whose working was shown and that the person keeps is not worked again: it stays in view as a held contrary ground, is worked again only on new material, and the round ends on its opening. A contradiction inside the target is a finding about it, judged for a side only with settling material outside it; your own earlier explanation against a `Measure` is yours to correct, quoting it, as relay. An objection you raise yourself is relay: shown with its basis, and the run continues. Where what you could not reach, or a conflict among what you gathered, bears on an aspect or on a judgment the person is making, say it there. Where a judgment the person is about to make turns on an aspect resting on your explanation, offer to run the cheapest check that would show it and to show its result — an offer, never a question for them to answer; offer it again only on new evidence or a changed purpose. An aspect the person set aside is not explained or offered again unless they return to it. Other work in the utterance neither closes this run nor answers its judgments. A round that shows a contradiction's working ends on that working, with nothing after it; every other round ends on one opening the person can take — respond to the map, ask to see or try something, go on, or say it is enough.")
  | .check      => (.dispatch, "delegate: where `AsksCheck` holds, the check handed to execution with the aspect and what it is to show; it changes no existing state, and a result from a stand-in comes with what it stood for and what it left untested; what it returns enters the context through `consult` as evidence read now, before the round that shows it")
  | .readAnswer => (.sense, "Internal analysis: whether the latest utterance bears on this run and what it does there, as `Reaches` and the judgments above read it — read whole against the fused context as it now stands")
  | .converge   => (.interaction .extension, "the convergence evidence CONVERGENCE names; proceed with VerifiedUnderstanding")
  | .withdraw   => (.interaction .extension, "at the person's word, at any gate: what you took as withdrawn, and the partial record CONVERGENCE lists")

open Classical in
/-- The operations whose returns `consult` appends to the context: what `.gather` reads, and, where
    `AsksCheck` holds, what the check handed off at `.check` returns. -/
def consultOps (c : Context P) : List Op := if AsksCheck c then [.gather, .check] else [.gather]

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
-/

end

end Katalepsis
```

## Mode Activation

`/grasp` is user-invoked only: activate when the user signals a wish to understand a target already present in context and available for verbatim quotation, whatever its provenance — AI-produced work, code or a document someone else wrote, or material the session has put on the table; a bare command refers to the current target. Do not activate for an unrelated general question, an accurate account that already demonstrates understanding, an explicit decline, or a trivial formatting-only result.

## Protocol

### Map rendering

Label each row by what the person will understand or decide through it, and keep the target's anchors — code, plan, document, analysis, model, or a mix — behind the label; one line per row, its standing said in words.

### Verification rendering and safeguards

Compose each round under TOOL GROUNDING's `present` entry. When grounding an explanation or correction, cite concrete locations in the target — file and line where it is code, the equivalent anchor where it is not. Read `references/round-composition.md` before composing when terminology must remain stable, wording must be carried unchanged, content belongs to another round or the convergence evidence, or whether text belongs before or inside the gate is in question.

## Rules

- **User-initiated only**: Activate only on the user's wish to understand a target present in context and quotable, whatever produced it; an explicit decline before activation withholds it; a withdrawal during a run ends it with the map as it stood on record.
- **User authority**: An acknowledgment of your explanation stands as the person's judgment: it is not probed again, a factual disagreement or new evidence is shown beside it, and it is recorded as acceptance of your explanation, as CONVERGENCE lists.
- **Round composition**: Compose each round so the reader can act without reassembly — use everyday language, keep each judgment beside its evidence and next-move implication (your own adjudication included, its evidence being the excerpt attached with it), and place analytical context before its gate.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
- **Contract execution**: As FLOW, the judgments' doc comments, TOOL GROUNDING's `present` entry, and CONVERGENCE state.
