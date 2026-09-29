---
name: elicit
description: "The user knows roughly what they want but not which decisions it turns on: trace them from their own material (code, rules, past sessions) and the domain's usual decisions; ask until it settles."
---

# Euporia Protocol

Resolve abstract aporia by surfacing the decisions an intent turns on until the person recognizes the intent as theirs. Type: `(AbstractAporia, Hybrid, REVERSE-INDUCE-CYCLE, IntentSeed) → ResolvedEndpoint`.

## Definition

**Euporia** (εὐπορία): A dialogical act of opening a way through abstract aporia — the person holds a direction but cannot name up front which decisions it turns on. The AI traces those decision coordinates from the person's own material, from their words, and from the decision structure of the domain the intent sits in, and surfaces each with where it comes from and what leaving it open changes. What is surfaced is focus: re-read every turn, it decides nothing. Only the person's words move a value from focus into the record, and each recorded value carries who proposed it and how it came to stand; what is still open is carried as residual. The run closes when the person says the intent is aligned enough — every coordinate need not be filled — or when they withdraw. The resolution establishes the person's recognized intent, not the factual correctness of its parts.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract.
-/

/-! ── FLOW ──
Euporia(I) → start(c) → elicit(c, utterances), where c is the fused session context:
  surface(c): the read-back of the intent as understood, with its sources → Stop
  next utterance u: c' := fuse(c, u), every reading below taken afresh on c' →
    [the utterance does not bear on this run]      the session answers it; no gate of this run
    [the person withdraws]                         → Withdrawn
    [the person says the intent is aligned enough] → ResolvedEndpoint
    [otherwise]                                    → surface(c')
  no utterance: the gate holds; nothing is taken
  after any closure: the next move the person declared is the session's to take up
-/

/-! ── MORPHISM ──
IntentSeed
  → inventory            -- the live coordinates, read over the fused context (focus)
  → surface              -- the read-back and the open coordinates, with sources and contrary grounds (focus)
  → fuse(answer)         -- the answer joins the context whole
  → stand                -- a person's turn makes a value stand in the intent, under the record rule (`StandingSupported`)
  → resolve(intent)      -- the person says the intent is aligned enough
  → ResolvedEndpoint
requires: aporia(I)                           -- declared by invoking /elicit; on the AI-guided path, your reading, and the first surface is a proposal
deficit:  AbstractAporia                      -- activation precondition (Layer 1/2)
preserves: I                                  -- the seed turn is never rewritten; the context only grows
invariant: Reverse Induction over Axis-Fixed Extraction  -- coordinates emerge from the intent; no fixed axis taxonomy
invariant: Focus never records                -- focus is re-read every turn and carries no authority; only the person's words move a value into the record
-/

namespace Euporia

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

/-- `I`, the intent seed: the utterance that carries the intent and the context it lands in. The
    seed is a turn of the context and is never rewritten. Source-neutral; read from the context. -/
abbrev IntentSeed (P : Type) := Context P

/-- The deficit: the person holds a direction but has not fixed which decisions it turns on — a
    coordinate that their material, their words, or the decision structure of the domain the intent
    sits in raises is still open. Invoking `/elicit` is the person's declaration of it, and you do
    not judge it away. On the AI-guided path it is **your judgment**: finding none means not
    starting, and finding it makes the first surface a proposal the person confirms or declines. -/
axiom aporia : Context P → Prop

/-- A coordinate or a value, named as the presentation shows it. -/
abbrev Entry := String

/-- **Your judgment**, the live inventory: every coordinate the intent turns on that this run has
    raised and the person's words have not since retired or merged — read over the whole fused
    context: the seed, every answer, what reads of the person's material returned, and the
    decision structure of the domain the intent sits in. A coordinate raised once stays here
    whether or not the current surface shows it; the person may add, merge, reword, or retire any
    coordinate, the axis itself included. Guidance for the reading, not steps it must take: read
    the person's material where the intent turns on it rather than from scratch each round, and a
    coordinate whose basis is still thin may wait before it is raised. -/
axiom coordinates : Context P → List Entry

/-- Who first put a value forward: you, or the person. -/
inductive Proposer | draft | person

/-- What the turn that made a value stand did: gave it in its own words, took a value put forward
    before, or gave a grant that reaches your choice. -/
inductive Standing | set | adopted | granted

/-- What stands on a coordinate: the value, who first put it forward, and how it came to stand. -/
structure Determination where
  value    : Entry
  proposer : Proposer
  standing : Standing

/-- **Your judgment**, the record rule: the cited turn makes coordinate `x` stand as `d`, read
    against the context as it now stands, on the scope the turn's words reach. Who proposed the
    value and how it stood are read separately. The proposer is whoever first put the value forward
    in the context, however the cited turn words it. The standing is what the cited turn itself
    did: gave the value in its own words (`set`); took a value put forward before (`adopted`) —
    where you put it forward, only if it was visible as yours, with what decides it and your
    contrary grounds, before this turn; or gave a grant whose words reach your choice (`granted`).
    An addition of yours the person did not see — a default for an unanswered coordinate, a merge,
    a rejected alternative or a reason they did not state, a question read as a decision — stands
    on nothing and stays your proposal, unless a grant whose words reach it covers it. A question, a request to look something up, an
    observation, a deferral, or a bare mention makes nothing stand. The value is in the words of
    the turn that set it, or of the proposal as it was shown; a read-back that paraphrases never
    replaces it, and never turns the person's value into an adoption. -/
axiom StandingSupported : Entry → Context P → Turn P → Determination → Prop

/-- Only a person's turn makes a value stand in the intent. Evidence fixes facts and informs the
    person; it fills no coordinate here. -/
def standingCoord (x : Entry) : Coord P Determination :=
  { admits := (·.val = .person), supports := StandingSupported x }

/-- **Your reading**: how coordinate `x` stands in `c` — filled by the person's latest turn that
    makes it stand; open where none does, carrying as candidate only a turn of the person's or
    evidence that points toward a value not yet taken. A value a person's turn made stand changes
    only by their later words: evidence against it is shown — before any step that depends on it
    and cannot be undone — and the value stands. -/
axiom operative : (c : Context P) → (x : Entry) → Occ (standingCoord (P := P) x) c

def isFilled {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Bool
  | .open_ _   => false
  | .filled .. => true

/-- One recorded value: the coordinate, what stands on it, and the person's turn it stands on,
    with that turn's support. -/
structure Recorded (c : Context P) where
  coord     : Entry
  det       : Determination
  src       : Cite c
  byPerson  : src.src.val = .person
  supported : StandingSupported coord c (c[src.idx]'src.lt) det

def recordOf {c : Context P} (x : Entry) : Occ (standingCoord (P := P) x) c → List (Recorded c)
  | .open_ _                      => []
  | .filled d s allowed supported => [⟨x, d, s, allowed, supported⟩]

/-- The record: every filled occurrence over the live inventory. An open one adds nothing; a
    proposal of yours the person has not taken lives only in the context and its presentation. -/
def record (c : Context P) : List (Recorded c) :=
  (coordinates c).flatMap (fun x => recordOf x (operative c x))

/-- What is still open: every coordinate of the live inventory whose occurrence is open, whether
    it was deferred, left unanswered, or never reached. None closes by default. -/
def residual (c : Context P) : List Entry :=
  (coordinates c).filter (fun x => !isFilled (operative c x))

/-- **Your judgment**: the latest utterance bears on this run — a value, a deferral, a question
    about the surface, a new frame, a withdrawal, a resolution. An utterance about other work
    leaves the run as it stands: the session answers it, that answer stays in the context, and no
    gate of this run is raised. -/
axiom Reaches : Context P → Prop

/-- **Your judgment**: the cited turn says the intent is aligned enough — the aporia is resolved —
    read against the context as it now stands. It closes the run: coordinates need not all be
    filled, and what is open is residual. Filled coordinates, or your own reading, close nothing.
    Whether an earlier resolution still reaches what is now at issue is read on the current
    context: a later question may reopen the alignment, ask only about a fact, or concern other
    work. -/
axiom ResolutionSupported : Context P → Turn P → Unit → Prop

/-- Only the person settles the intent. -/
def resolutionCoord : Coord P Unit :=
  { admits := (·.val = .person), supports := ResolutionSupported }

/-- **Your reading**: the person's resolution; `open_` until one reaches it. -/
axiom resolution : (c : Context P) → Occ (resolutionCoord (P := P)) c

/-- **Your record**: the contrary grounds you presented before the answer that closes — a value
    you doubt, a premise that may not hold, a sibling deficit you read — attached to the closure;
    empty when there were none. -/
axiom dissent : Context P → List String

/-- **Your judgment**: the cited turn withdraws — the person stops here without resolving the
    intent, and nothing open is delegated — read against the context as it now stands. Stopping
    needs nothing else; the values carried into the partial record stand under the record rule
    alone. Your own reading that the run should end closes nothing. -/
axiom WithdrawalSupported : Context P → Turn P → Unit → Prop

/-- Only the person withdraws. -/
def withdrawalCoord : Coord P Unit :=
  { admits := (·.val = .person), supports := WithdrawalSupported }

/-- **Your reading**: the person's withdrawal; `open_` until one reaches it. -/
axiom withdrawal : (c : Context P) → Occ (withdrawalCoord (P := P)) c

/-- The record every exit carries: the context, the recorded values with who proposed each and
    how it came to stand, what is still open, and the dissent attached to the closure. -/
structure Closed (P : Type) where
  context  : Context P
  record   : List (Recorded context)
  residual : List Entry
  dissent  : List String

def closed (c : Context P) : Closed P :=
  { context := c, record := record c, residual := residual c, dissent := dissent c }

/-- `ResolvedEndpoint`: the intent the person recognized, as the record of the resolving turn. -/
structure ResolvedEndpoint (P : Type) where
  closure : Closed P

def endpoint (c : Context P) : ResolvedEndpoint P := { closure := closed c }

inductive Outcome (P : Type)
  | resolved  (r : ResolvedEndpoint P)
  /-- the partial record; what is open stays open -/
  | withdrawn (r : Closed P)
  | holding   (c : Context P)

/-! ── A-BINDING ──
bind(I) = explicit_arg ∪ recent_intent_seed ∪ surfaced_aporia
Priority: explicit_arg > recent_intent_seed > surfaced_aporia
  /elicit "intent"   → I = the utterance, with the context it lands in
  /elicit (alone)    → I = the most recent intent seed in the session
  "I want to..."     → I = the utterance under discussion (AI-detected path: the first surface
                       confirms or declines the run; a decline is a withdrawal)
-/

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

/-! ── PHASE TRANSITIONS ──
A step is one arm of a structural recursion over the person's utterances. `respond` is the next
surface, as TOOL GROUNDING's `surface` entry names it; `session` is the session's own answer to an
utterance about other work, which stays in the context without being a gate of this run.
-/

open Classical in
def elicit (respond session : Context P → Response P) :
    Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let c' := fuse c u
    if ¬ Reaches c' then elicit respond session (c' ++ [(session c').val]) us
    else if isFilled (withdrawal c') = true then .withdrawn (closed c')
    else if isFilled (resolution c') = true then .resolved (endpoint c')
    else elicit respond session (c' ++ [(respond c').val]) us

/-- The run opens on its first surface. -/
def start (respond session : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  elicit respond session (c ++ [(respond c).val]) us

/-! ── LOOP ──
Every answer is read against the whole context as it now stands: nothing counts rounds, and no
earlier answer is held apart from what later ones say. No fixed cap: each surface is dialogue.
-/

/-! ── CONVERGENCE ──
converged: a ResolvedEndpoint the person's utterance closed. Withdrawal keeps its partial record.
Convergence evidence: at the resolution, present the read-back of the intent in the person's
language and the trace — each coordinate → where it came from → what stands on it, in the words of
the turn that set it → who proposed it and how it stood — beside the residual and the dissent
attached to the closure. Demonstrated, not asserted.
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

inductive Op | detect | read | trace | surface | readAnswer | converge | withdraw | seam

def grounding : Op → Annot × String
  | .detect       => (.sense, "Internal analysis, on the AI-guided path only: whether the person has fixed which decisions the intent turns on, read from the utterance, their material, and the domain's decision structure; an invocation of /elicit declares the deficit and is not judged")
  | .read         => (.observe, "artifact read, artifact search, record read: read-only reads of the person's own material where the intent turns on it")
  | .trace        => (.sense, "Internal analysis: the live inventory over the whole fused context and the domain's decision structure, each coordinate with where it comes from and what leaving it open changes")
  | .surface      => (.interaction .constitution, "a plain one-sentence read-back of the intent as understood, every round the first included, with its sources and each recorded value marked by who proposed it and how it stood; each open coordinate the round shows, with its question, where it comes from — the person's material cited, their words quoted as said without an unstated mental model, or the domain's decision structure marked as yours — what leaving it open changes, and any default as your proposal; your contrary grounds before the answer slots. Guidance for the showing: coordinates the domain raises come after the ones the person's material and words raise, as open questions rather than filled examples; a deferred coordinate returns in the same wording with the same basis, marked as returning. The answer may give values, defer, say the intent is aligned enough, or withdraw, in any form; an answer beyond the slots joins the context whole")
  | .readAnswer   => (.sense, "Internal analysis: whether the latest utterance bears on this run, and what it does there — the values it makes stand, a withdrawal, a resolution — read whole against the fused context as it now stands, whatever form it takes")
  | .converge     => (.interaction .extension, "the convergence evidence CONVERGENCE names; proceed with ResolvedEndpoint")
  | .withdraw     => (.interaction .extension, "at the person's word, at any gate: what you took as withdrawn, and the partial record — the recorded values with who proposed each and how it stood, and the residual; nothing open is delegated, and the person's next words correct it")
  | .seam         => (.interaction .extension, "after any closure — a resolution, or a withdrawal the person paired with where to go — proceed to the next move the person declared (the task the seed asked for, or other work they named), citing that source; this protocol declares no wired outbound edge, and every Constitution gate fires unchanged")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Intent resolution emergent via session context.
-/

end

end Euporia
```

## Scope Boundary

Euporia surfaces the decision coordinates an intent turns on without adjudicating which sibling protocol owns them. A coordinate that exposes a missing fact, an undefined boundary, or an unrecognizable direction remains a coordinate with its basis; a fact claim you add from the domain's practice is shown as your unverified judgment. The user decides what to reach for next.

## Mode Activation

`/elicit` remains directly invocable: the invocation declares the deficit the Definition's `aporia` names, and the first surface shows the intent as understood with its sources — the user may say at once that it is aligned enough. On the AI-guided path the first surface is a proposal the user confirms or declines; a decline is a withdrawal. Skip AI-guided activation when the user explicitly asks to proceed without surfacing, or when the same utterance was resolved or withdrawn in this session.

## Protocol

### Phase 2 surface

Present what TOOL GROUNDING's `surface` entry names and yield the turn. Read `references/round-composition.md` before composing when a term must remain stable across the session, wording must travel unchanged, material belongs to another round or trace, or phase order determines whether text belongs before or inside the gate.

### Intensity

| Level | When | Format |
|-------|------|--------|
| Light | One open coordinate | Brief surface and per-coordinate slots |
| Medium | Several coordinates or partial evidence | Full surface at coordinate granularity |
| Heavy | Many coordinates, weak basis, several rounds in prospect | Full surface with per-coordinate evidence and explicit residuals |

## Rules

- **Recognition over Recall**: Present the coordinates an intent turns on with their anticipatable post-answer states, so the user recognizes what they would otherwise have to recall.
- **Round composition**: Use everyday language, keep each judgment beside its nearest evidence and next-move implication, and place analytical context before the answer slots.
- **Focus and record**: As the Definition's MORPHISM invariant and `record` state.
- **Form feedback**: Derive each round's density from the current request and carry an explicit form instruction until countermanded. Change the form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
