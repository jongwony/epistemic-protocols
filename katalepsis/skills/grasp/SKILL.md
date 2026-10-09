---
name: grasp
description: "Something in play — code, a document, a result, quotable in context — needs to be actually understood; the user can't follow it yet or nods along unsure: verify understanding step by step."
---

# Katalepsis Protocol

Achieve certain comprehension of a target in play — code, a document, a result — through structured verification, enabling the user to grasp what stands ungrasped. Type: `(TargetUngrasped, User, VERIFY, Target) → VerifiedUnderstanding`.

## Definition

**Katalepsis** (κατάληψις): A dialogical act of achieving firm comprehension—from Stoic philosophy meaning "a grasping firmly"—resolving an ungrasped target into verified user understanding through probing that the person answers in their own words, measured against the target's material.

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
    [the person says they have understood enough, or have what they need, for their purpose]
                                                → VerifiedUnderstanding
    [otherwise]                                 → present(c')
  no utterance: the gate holds; nothing is taken
-/

/-! ── MORPHISM ──
Target
  → gather               -- the target's material and any source a turn cites, read now (focus)
  → scope                -- a person's turn says what they mean to understand (`ScopeSupported`)
  → present              -- the next round: a probe, a disclosure, an adjudication, with its material (focus)
  → fuse(answer)         -- the answer joins the context whole
  → show                 -- a person's turn shows an aspect against a measure, under the record rule (`ShownSupported`)
  → close                -- the person says they have understood enough, or have what they need, for their purpose
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

/-- **Your judgment**: the cited person turn says what they mean to understand of the target —
    and, where they say it, for what purpose — read against the context as it now stands, in their
    own words or by taking entries you showed; taking what was shown adopts it as it was shown. The
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
    scope's purpose — a Horizon edge, a contradiction, an ordinary gap alike. An aspect raised once
    stays here — whether or not the current round shows it, and even when a later scope no longer
    turns on it, marked so; a set-aside aspect stays too. The person may merge or reword aspects;
    whether a reworded aspect is the same aspect is your judgment.
    Guidance for the reading, not types it fixes: a Horizon edge is an edge of what the target
    does that the person has not voiced and the purpose needs, grounded in the target's material —
    not a decision to make, a reframing, or a choice of route, though understanding it may change
    how the person frames their purpose. A contradiction needs two distinct sourced sides on the
    same scope and premises; a repeated claim, the target and your quotation of it, or your
    explanation drawn from it is one side, not corroboration. -/
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

/-- **Your judgment**: the observed turn reads its source now, and the span is the narrowest
    material supporting the judgment, quoted in place. A locator the person must go open is not
    the material; your own reasoning is never a measure. -/
axiom SourceRead : (c : Context P) → Cite c → String → Prop

/-- What an answer is measured against: the target's own material, or a source outside the
    context read now. -/
inductive Measure (c : Context P)
  | target (s : Side c) (object : IsTarget c s)
  | source (observed : Cite c) (readNow : observed.src.val = .external) (span : String)
      (linked : SourceRead c observed span)

/-- The help that came before the showing turn on this aspect: a disclosure, or an excerpt that
    supplied its substance, is `afterDisclosure`; any lesser help — steps the person asked for, or a
    hint you gave — is `afterCue`; none is `independent`. -/
inductive Demonstration | independent | afterCue | afterDisclosure

/-- **Your judgment**, the record rule: the cited person turn shows the aspect — produces,
    applies, predicts, or explains its relations at the level the aspect asks — measured against
    the material, read against the context as it now stands. Assent, a self-rating, a bare pick
    among options you offered, or an echo of your own wording shows nothing; an explanatory
    paraphrase shows what it reaches. The help is read from what came before the cited turn, at
    its place in the context, on this aspect, as `Demonstration` sorts it. A later disclosure never
    relabels an earlier answer, and an answer after one is never `independent`. A claim of
    understanding shows nothing: the aspect stays unshown, and the convergence evidence says the
    person claimed it. -/
axiom ShownSupported : (c : Context P) → Cite c → Entry → Measure c → Demonstration → Prop

/-- How aspect `a` was shown: the person's turn that showed it, the material it was measured
    against, and the help that came before it, with that turn's support. -/
structure Shown (c : Context P) (a : Entry) where
  src       : Cite c
  byPerson  : src.src.val = .person
  measure   : Measure c
  help      : Demonstration
  supported : ShownSupported c src a measure help

/-- **Your reading**: the row showing aspect `a`, if a person's turn has shown it, read afresh on
    `c`; whether a turn shows a reworded aspect is your judgment. -/
axiom showing : (c : Context P) → (a : Entry) → Option (Shown c a)

/-- Every aspect of the live inventory a person's turn has shown, with its row. -/
def shown (c : Context P) : List ((a : Entry) × Shown c a) :=
  (aspects c).filterMap fun a => (showing c a).map (⟨a, ·⟩)

/-- What is still unshown: every aspect of the live inventory with no shown row, whether it was
    asked and missed or never asked. None closes by default. -/
def residual (c : Context P) : List Entry :=
  (aspects c).filter fun a => (showing c a).isNone

/-- **Your record**: your contrary grounds bearing on the person's judgment beyond what the
    residual already lists — an adjudication the person disputes, a doubt about the target, a reason
    an unshown aspect matters — each with what it bears on and its basis, shown as `present` and
    CONVERGENCE say; new evidence after the closure is shown in the session beside it, and the
    closure stands. Empty when there are none. -/
axiom dissent : Context P → List String

/-- **Your judgment**: the latest utterance bears on this run — a scope, an answer, a request for
    steps, a correction of your reading, a question about the round, a closure, a withdrawal —
    judged on what the whole utterance does. A proposal to change the target bears on this run: it
    is named, held, and carried to the closing account, not acted on while the run stands. An
    utterance about other work
    leaves the run as it stands: the session answers it, that answer stays in the context, and no
    gate of this run is raised. -/
axiom Reaches : Context P → Prop

/-- **Your judgment**: the cited turn says the person has understood enough of the target, or has
    what they need, for their purpose — "that's enough for me", "I'm done here" — read against the
    context as it now stands; an acknowledgment of an explanation ("ok, makes sense, thanks") is not
    a closure, nor is a claim about one aspect. It closes the run wherever it is said: aspects need
    not all be shown, and what is unshown is residual. Shown aspects, an empty residual, or your
    own reading close nothing. "Enough about that example" sets that aspect aside without closing
    the run; an unshown aspect set aside stays in the residual, and one already shown stays shown.
    Whether an earlier closure still
    reaches this run is read on the current context: a closure from an earlier run does not close a
    new one. -/
axiom ClosureSupported : Context P → Turn P → Unit → Prop

/-- Only the person closes the run. -/
def closureCoord : Coord P Unit :=
  { admits := (·.val = .person), supports := ClosureSupported }

/-- **Your reading**: the person's closure; `open_` until one reaches it. -/
axiom closure : (c : Context P) → Occ (closureCoord (P := P)) c

/-- **Your judgment**: the cited turn withdraws: the person stops here and says the run should end
    without having what they need — the target is not understood enough, or no longer worth the
    run — and nothing open is delegated; read against the context as it now stands.
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
  shown    : List ((a : Entry) × Shown context a)
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
record. Convergence evidence, at the closure: the scope as it stands, open included; each shown
aspect → how it was shown (unaided, after help, or after a disclosure) → against which material →
in the person's words; the residual, each with how it stands — whether it was asked, whether the
scope as it stands still turns on it, and what the person said of it: an answer missed, nothing to
check it against, set aside, or claimed as understood; the dissent; and any proposal to change the
target the person raised during the run, left for after it. A doubt you held that was not shown
before the closing turn is shown here and attached, and the closure stands — accepted,
evidentially disputed. An untested Horizon edge is named once probing has ended — in the closing
account or here at closure — and not before. Demonstrated, not asserted.
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
  | .present    => (.interaction .constitution, "the round, every round the first included. While the scope is open, the round shows entries as §Intent-scented entry rendering says, and probing waits for the scope. A contradiction that involves the person is taken first: ask how the two quoted sides fit before any verdict, then show what remains with both sources, the target's evidence and the reason, and check it by an application; a contradiction inside the target is a finding about it, judged for a side only with settling material outside it; your own earlier explanation against the target is yours to correct, quoting the target, as relay. Otherwise choose the next aspect, and say why when you depart from starting with a Horizon edge — about a Horizon edge, after its answer; when none warrants probing, the round is the closing account: what was shown and how, what is unshown — an untested Horizon edge now named, since probing has ended —, the scope as it stands, and your contrary grounds, with the invitation to say it is understood enough or to go on. A Horizon probe is an everyday scenario only — no label, edge, expected answer or reason before the answer — but concealment never withholds material the person needs to contest an adjudication. A probe gives the target context and a concrete scenario and always leaves a free response; prefer an open question to a menu where the answer is the evidence. After a miss, first read whether the answer aims at another intent: say that reading as a candidate with its basis and where it moves, adding no question; if the person sets it aside, return to the missed answer with their correction. Within the intent, a Horizon miss is disclosed at once with the material it rests on, then checked by an application question; an ordinary miss first hears the person's reasoning, and an adjudication follows only where you have material to attach; where there is none, give no verdict: say you have nothing to check the answer against and name what would settle it. Where there is, the adjudication quotes the narrowest `Measure` — the target's material or an outside source read now, never your own explanation — scoped to what that material settles, keeping what the answer got right and saying any other reading beside it. The person may ask for steps instead of a disclosure at any time. An owed disclosure, reasoning question or correction completes before the next aspect. Where it bears on a judgment the person is about to make, show where the run stands — what was shown and how, what is unshown, and your contrary grounds — without naming an untested Horizon edge. An objection you raise yourself is relay: shown with its basis, and the run continues. A proposal to change the target is named and held for after this run, not acted on. The answer may take any form — an answer, a request for steps, saying it is understood enough, or stopping.")
  | .readAnswer => (.sense, "Internal analysis: whether the latest utterance bears on this run and what it does there, as `Reaches` and the judgments above read it — read whole against the fused context as it now stands")
  | .converge   => (.interaction .extension, "the convergence evidence CONVERGENCE names; proceed with VerifiedUnderstanding")
  | .withdraw   => (.interaction .extension, "at the person's word, at any gate: what you took as withdrawn, and the partial record, as CONVERGENCE lists it at closure; the person's next words correct it")

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

Compose each round under TOOL GROUNDING's `present` entry. When grounding an explanation or correction, cite concrete locations in the target — file and line where it is code, the equivalent anchor where it is not. Read `references/round-composition.md` before composing when terminology must remain stable, wording must be carried unchanged, content belongs to another round or trace, or whether text belongs before or inside the gate is in question.

### Intensity

| Level | Realization |
|-------|-------------|
| Light | One Constitution probe of core understanding |
| Medium | One scenario probe of prediction or impact |
| Heavy | Decomposed probes of causal or sequential understanding |

## Rules

- **User-initiated only**: Activate only on the user's wish to understand a target present in context and quotable, whatever produced it; an explicit decline before activation withholds it; a withdrawal during a run ends it with what was shown on record.
- **User authority**: A claim of understanding stands as the person's judgment on that ground: it is not probed again, and it is recorded as `ShownSupported` and CONVERGENCE say.
- **Round composition**: Compose each round so the reader can act without reassembly — use everyday language, keep each judgment beside its evidence and next-move implication (your own adjudication included, its evidence being the excerpt attached with it), and place analytical context before its gate.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
- **Contract execution**: As FLOW, the judgments' doc comments, TOOL GROUNDING's `present` entry, and CONVERGENCE state.
