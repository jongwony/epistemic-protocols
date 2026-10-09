---
name: grasp
description: "Something in play — code, a document, a result, quotable in context — needs to be actually understood; the user can't follow it yet or nods along unsure: verify understanding step by step."
---

# Katalepsis Protocol

Achieve certain comprehension of a target in play — code, a document, a result — through structured verification, enabling the user to grasp what stands ungrasped. Type: `(TargetUngrasped, User, VERIFY, Target) → VerifiedUnderstanding`.

## Definition

**Katalepsis** (κατάληψις): A dialogical act of achieving firm comprehension—from Stoic philosophy meaning "a grasping firmly"—resolving an ungrasped target into verified user understanding through intent-scented entry points and progressive verification.

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
  present(c): the next round, read afresh from the context → Stop
  next utterance u: c' := fuse(c, u) with what `consult` reads now appended, every reading below
    taken afresh on c' →
    [the utterance does not bear on this run]   the session answers it; that answer stays in the
                                                context; no gate of this run
    [the person withdraws]                      → Withdrawn
    [the person says the target is understood enough for their purpose] → VerifiedUnderstanding
    [otherwise]                                 → present(c')
  no utterance: the gate holds; nothing is taken
-/

/-! ── MORPHISM ──
Target
  → gather               -- the target's material and any source a turn cites, read now (focus)
  → scope                -- a person's turn says what they mean to understand and for what purpose (`ScopeSupported`)
  → present              -- the next round: a probe, a disclosure, an adjudication, with its material (focus)
  → fuse(answer)         -- the answer joins the context whole
  → show                 -- a person's turn shows an aspect against a measure, under the record rule (`ShownSupported`)
  → close                -- the person says the target is understood enough for their purpose
  → VerifiedUnderstanding
requires: target_exists(R)              -- the comprehension target is present in context and can be quoted verbatim; its provenance is unconstrained. An admission condition on the target, not a promise that every answer finds enough ground for adjudication
deficit:  TargetUngrasped               -- activation precondition (Layer 1)
preserves: R                            -- the target is read, never rewritten
invariant: Demonstrated, not asserted   -- only a person's turn shows an aspect, and only against material; assent, a self-rating, a bare pick or an echo shows nothing
invariant: Focus never records          -- the inventory and the presentation are re-read every turn and carry no authority; only the person's turns move a value into the record
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
    result — whatever produced it. Read from the context; never rewritten. -/
abbrev Target (P : Type) := Context P

/-- A scope entry or an aspect, named as the presentation shows it. -/
abbrev Entry := String

/-- **Your judgment**: the cited person turn says what they mean to understand of the target and
    for what purpose, read against the context as it now stands — in their own words, or by taking
    entries you showed; taking what was shown adopts it as it was shown. The invoking utterance
    fills it when it says it. Entries you offer while the scope is open are named by what the
    person will understand or be able to do, with artifact categories kept behind them as anchors;
    the person's own paths stand beside yours, and none of theirs is filtered. A later turn may
    change the scope; whether an earlier one still reaches what is now at issue is read on the
    current context. -/
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

/-- **Your judgment**, the live inventory: every aspect of the target the scope's purpose turns on
    that this run has raised and the person's words have not since retired or merged — a Horizon
    edge, a contradiction, an ordinary gap alike. An aspect raised once stays here whether or not
    the current round shows it; whether a reworded aspect is the same aspect is your judgment.
    Guidance for the reading, not types it fixes: a Horizon edge is an edge of what the target
    does that the person has not voiced and the purpose needs, grounded in the target's material —
    not a decision to make, a reframing, or a choice of route, though understanding it may change
    how the person frames their purpose. A contradiction needs two distinct sourced sides on the
    same scope and premises; a repeated claim, the target and your quotation of it, or your
    explanation drawn from it is one side, not corroboration. -/
axiom aspects : Context P → List Entry

/-- A located span of one turn. Location is distinct from eligibility as evidence: your own
    explanation can be a side. -/
structure Side (c : Context P) where
  idx  : Nat
  lt   : idx < c.length
  span : String

/-- **Your judgment**: the located turn carries the target itself, at the quoted span, rather than
    the reasoning that produced it. Target provenance is unrestricted; where the turn is your own,
    whether it carries the target or reasoning about it is read here from its content. -/
axiom IsTarget : (c : Context P) → Side c → Prop

/-- **Your judgment**: the observation reads that source now, and the span is the narrowest
    material supporting the judgment, quoted in place. A locator the person must go open is not
    the material; your own reasoning is never a measure. -/
axiom SourceRead : (c : Context P) → Cite c → String → Prop

/-- What an answer is measured against: the target's own material, or a source outside the
    context read now. -/
inductive Measure (c : Context P)
  | target (s : Side c) (object : IsTarget c s)
  | source (observed : Cite c) (readNow : observed.src.val = .external) (span : String)
      (linked : SourceRead c observed span)

/-- The help that came before this answer on this aspect: none, steps the person asked for, or a
    disclosure of its substance. -/
inductive Demonstration | independent | afterCue | afterDisclosure

/-- **Your judgment**, the record rule: the cited person turn shows the aspect — produces,
    applies, predicts, or explains its relations at the level the aspect asks — measured against
    the material, read against the context as it now stands. Assent, a self-rating, a bare pick
    among options you offered, or an echo of your own wording shows nothing; an explanatory
    paraphrase shows what it reaches. The help is read from what came before this turn on this
    aspect: a disclosure, or an excerpt that already supplied its substance, is `afterDisclosure`;
    steps the person asked for are `afterCue`; none is `independent`. A later disclosure never
    relabels an earlier answer, and an answer after one is never `independent`. A person's claim
    that they understand stands as their judgment and is recorded as claimed, not shown. -/
axiom ShownSupported : (c : Context P) → Turn P → Entry → Measure c → Demonstration → Prop

/-- One shown aspect: the aspect, the person's turn that showed it, the material it was measured
    against, and the help that came before it, with that turn's support. -/
structure Shown (c : Context P) where
  aspect    : Entry
  src       : Cite c
  byPerson  : src.src.val = .person
  measure   : Measure c
  help      : Demonstration
  supported : ShownSupported c (c[src.idx]'src.lt) aspect measure help

/-- **Your reading**: every aspect a person's turn has shown, read afresh on `c`. -/
axiom shown : (c : Context P) → List (Shown c)

/-- What is still unshown: every aspect of the live inventory with no shown row, whether it was
    asked and missed or never asked. None closes by default. -/
def residual (c : Context P) : List Entry :=
  (aspects c).filter fun a => !((shown c).any fun s => s.aspect == a)

/-- **Your record**: your contrary grounds bearing on the person's judgment — an aspect the purpose
    needs that stands unshown, an adjudication the person disputes, a doubt about the target — each
    with what it bears on and its basis. One you already hold is shown before the person's affected
    judgment; one that new evidence raises after it is attached without erasing their ending, so
    "accepted, evidentially disputed" stands. Empty when there are none. -/
axiom dissent : Context P → List String

/-- **Your judgment**: the latest utterance bears on this run — a scope, an answer, a request for
    steps, a correction of your reading, a question about the round, a closure, a withdrawal —
    judged on what the whole utterance does. A proposal to change something is not by that fact
    unrelated. An utterance about other work leaves the run as it stands: the session answers it,
    that answer stays in the context, and no gate of this run is raised. -/
axiom Reaches : Context P → Prop

/-- **Your judgment**: the cited turn says the target is understood enough for the person's
    purpose, read against the context as it now stands. It closes the run wherever it is said:
    aspects need not all be shown, and what is unshown is residual. Shown aspects, an empty
    residual, or your own reading close nothing. "Enough about that example" may close only part
    of the run — read what its words reach. -/
axiom ClosureSupported : Context P → Turn P → Unit → Prop

/-- Only the person closes the run. -/
def closureCoord : Coord P Unit :=
  { admits := (·.val = .person), supports := ClosureSupported }

/-- **Your reading**: the person's closure; `open_` until one reaches it. -/
axiom closure : (c : Context P) → Occ (closureCoord (P := P)) c

/-- **Your judgment**: the cited turn withdraws — the person stops here without saying the target
    is understood, and nothing open is delegated — read against the context as it now stands.
    Silence, or turning to other work, is not withdrawal. Whether an earlier withdrawal still
    reaches this run is read on the current context. Your own reading that the run should end
    closes nothing. -/
axiom WithdrawalSupported : Context P → Turn P → Unit → Prop

/-- Only the person withdraws. -/
def withdrawalCoord : Coord P Unit :=
  { admits := (·.val = .person), supports := WithdrawalSupported }

/-- **Your reading**: the person's withdrawal; `open_` until one reaches it. -/
axiom withdrawal : (c : Context P) → Occ (withdrawalCoord (P := P)) c

/-- The record every exit carries: the context, the scope as it stands, what was shown and how,
    what is still unshown, and the dissent attached. -/
structure Closed (P : Type) where
  context  : Context P
  scope    : Occ (scopeCoord (P := P)) context
  shown    : List (Shown context)
  residual : List Entry
  dissent  : List String

def closed (c : Context P) : Closed P :=
  { context := c, scope := scope c, shown := shown c, residual := residual c,
    dissent := dissent c }

/-- `VerifiedUnderstanding`: the person's closure over the record — what was shown and how, what
    stays unshown, and the dissent attached. It certifies what was demonstrated, not omniscient
    comprehension. -/
structure VerifiedUnderstanding (P : Type) where
  closure : Closed P

inductive Outcome (P : Type)
  | verified  (r : VerifiedUnderstanding P)
  /-- the partial record; what is unshown stays unshown -/
  | withdrawn (r : Closed P)
  | holding   (c : Context P)

/-- **Your read**, now, of what the next judgment needs: the target's material and any source the
    latest turn cites, gathered as far as relevant access reaches; what you say you read, you read
    to the end. Empty where nothing outside the context bears. -/
axiom consult : Context P → List (Evidence P)

/-- The context with what `consult` read now appended. -/
def consulted (c : Context P) : Context P := c ++ (consult c).map (·.val)

/-! ── A-BINDING ──
bind(R) = explicit_arg ∪ recent_target
Priority: explicit_arg > recent_target
  /grasp "target"   → R = the named target, with the context it lands in
  /grasp (alone)    → R = the target most recently in play
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
    let c' := consulted (fuse c u)
    if ¬ Reaches c' then grasp respond session (c' ++ [(session c').val]) us
    else if isFilled (withdrawal c') = true then .withdrawn (closed c')
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
record. Convergence evidence: at the closure, present each shown aspect → how it was shown
(unaided, after steps the person asked for, or after a disclosure) → against which material → in
the person's words; beside the residual, each marked as asked and missed or never asked, and the
dissent attached to the closure. Demonstrated, not asserted.
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

inductive Op | gather | assess | present | readAnswer | converge | withdraw

def grounding : Op → Annot × String
  | .gather     => (.observe, "artifact read, artifact search: read-only reads, now, of the target's material and of any source the latest turn cites; name what was reached and what was not, and any conflict among what was gathered")
  | .assess     => (.sense, "Internal analysis: the scope reading and the live inventory of aspects, over the whole fused context as it now stands")
  | .present    => (.interaction .constitution, "the round, every round the first included. While the scope is open, show entries named by what the person will understand or be able to do, accept the person's own path beside them, and ask nothing else. A contradiction that involves the person is taken first: ask how the two quoted sides fit before any verdict, then show what remains with both sources, the target's evidence and the reason, and check it by an application; a contradiction inside the target is a finding about it, judged for a side only with settling material outside it; your own earlier explanation against the target is yours to correct, quoting the target, as relay. Otherwise choose the next aspect, and say why when you depart from starting with a Horizon edge. A Horizon probe is an everyday scenario only — no label, edge, expected answer or reason before the answer — but concealment never withholds material the person needs to contest an adjudication or to settle a judgment they hold. A probe gives the target context and a concrete scenario and always leaves a free response; prefer an open question to a menu where the answer is the evidence. After a miss, first read whether the answer aims at another intent: say that reading as a candidate with its basis and where it moves, adding no question; if the person sets it aside, return to the missed answer with their correction. Within the intent, a Horizon miss is disclosed at once with the material it rests on, then checked by an application question; an ordinary miss first hears the person's reasoning, and an adjudication follows only where you have material to attach — it quotes the narrowest material, is scoped to what that material settles, keeps what the answer got right, and says any other reading beside it. The person may ask for steps instead of a disclosure at any time. An owed disclosure, reasoning question or correction completes before the next aspect. Where it bears on a judgment the person is about to make, show where the run stands — what was shown and how, what is unshown, and your contrary grounds — without naming an untested Horizon edge; when the person signals they are done and a doubt you hold has not been shown, show it then. An objection you raise yourself is relay: shown with its basis, and the run continues. The answer may take any form")
  | .readAnswer => (.sense, "Internal analysis: whether the latest utterance bears on this run, and what it does there — a scope, a shown aspect, a request for steps, a correction of your reading, a closure, a withdrawal — read whole against the fused context as it now stands, whatever form it takes")
  | .converge   => (.interaction .extension, "the convergence evidence CONVERGENCE names; proceed with VerifiedUnderstanding")
  | .withdraw   => (.interaction .extension, "at the person's word, at any gate: what you took as withdrawn, and the partial record — what was shown and how, the residual, and the dissent; the person's next words correct it")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
-/

end

end Katalepsis
```

## Mode Activation

`/grasp` is user-invoked only: activate when the user signals a wish to understand a target already present in context and available for verbatim quotation, whatever its provenance — AI-produced work, code or a document someone else wrote, or material the session has put on the table; a bare command refers to the current target. Do not activate for an unrelated general question, an accurate account that already demonstrates understanding, an explicit decline, or a trivial formatting-only result.

## Protocol

### Intent-scented entry rendering

Show entries only while the scope is open. Offer up to three, each labeled by what the person will understand, decide, explain, or change by taking it, with a description of what becomes clear and why it matters; keep the artifact bases — code, plan, document, analysis, model, or a mix — behind those labels as anchors. An entry never reveals a probe's answer or the reasoning it tests. A path the person names in their own words stays valid beside yours, and concerns they have already named fill the scope directly.

### Verification rendering and safeguards

Compose each round under TOOL GROUNDING's `present` entry. When grounding an explanation or correction, cite concrete locations in the target — file and line where it is code, the equivalent anchor where it is not. Read `references/round-composition.md` before composing when terminology must remain stable, wording must be carried unchanged, content belongs to another round or trace, or phase order determines whether text belongs before or inside a gate.

### Intensity

| Level | Realization |
|-------|-------------|
| Light | One Constitution probe of core understanding |
| Medium | One scenario probe of prediction or impact |
| Heavy | Decomposed probes of causal or sequential understanding |

## Rules

- **User-initiated only**: Activate only on the user's wish to understand a target present in context and quotable, whatever produced it; an explicit decline before activation withholds it; a withdrawal during a run ends it with what was shown on record.
- **Intent scent before artifact taxonomy**: First user-facing options name the user's likely comprehension outcome; artifact categories remain grounding material.
- **User authority**: The person's claim that they understand stands as their judgment on that ground: it is not probed again for that ending, it is recorded as claimed rather than shown, and a factual disagreement or new evidence is shown beside it.
- **Round composition**: Compose each round so the reader can act without reassembly — use everyday language, keep each judgment beside its evidence and next-move implication (your own adjudication included, its evidence being the excerpt attached with it), and place analytical context before its gate.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
- **Contract execution**: Read each utterance afresh on the fused context; present each round under TOOL GROUNDING's `present` entry; close only on the person's turn; show the convergence evidence at closure.
