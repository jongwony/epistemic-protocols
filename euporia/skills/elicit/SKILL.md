---
name: elicit
description: "Use when the request itself does not say what result the user wants — it names an area or a wish, such as 'fix this up' or 'make it better', but not what should change; judged from the request, before files or context are looked at to guess it, even where they would suggest a plausible reading. Not where the user's words already settle it. The user can then say 'this is my intent, aligned enough', each value in their own words, what they left open carried."
---

# Euporia Protocol

Resolve abstract aporia by surfacing the decisions an intent turns on, so that the person can recognize the intent as theirs. Type: `(AbstractAporia, Hybrid, REVERSE-INDUCE-CYCLE, IntentSeed) → ResolvedEndpoint`.

## Definition

**Euporia** (εὐπορία): A dialogical act of opening a way through abstract aporia — the person holds a direction but cannot name up front which decisions it turns on. The AI traces those decision coordinates from the person's own material, from their words, and from the decision structure of the domain the intent sits in, and surfaces each with where it comes from and what leaving it open changes. Each round returns the intent as it stands — what the person's words made stand, what is the AI's proposal, what is still open — and owes no answer. That the intent is aligned enough is the person's to say, at any point, with coordinates still open. What stands is the person's intent, not the factual correctness of its parts.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract.
-/

/-! ── FLOW ──
Euporia(I) → start(c) → elicit(c, r, utterances), where c is the fused session context and r is
the last return:
  first round(c): the return (`surface`, an Extension) — the read-back of the intent as
    understood, with its sources, what stands and what is open; no answer is owed
  next utterance u: c' := fuse(c, u), every reading below taken afresh on c' →
    [the utterance does not bear on this run]  the session answers it; the last return stands
    [otherwise]                                → the return again, read at c'
  no further utterance: the last return stands; nothing is taken
-/

/-! ── MORPHISM ──
IntentSeed
  → inventory            -- the live coordinates, read over the fused context (focus)
  → surface              -- the read-back and the open coordinates, with sources and contrary grounds (focus)
  → fuse(answer)         -- the answer joins the context whole
  → stand                -- a person's turn makes a value stand in the intent, under the record rule (`StandingSupported`)
  → return ↺             -- every round returns the intent as it stands; none owes an answer
  → ResolvedEndpoint
requires: aporia(I)
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

/-- `I`, the intent seed: the utterance that carries the intent and the context it lands in.
    Source-neutral; read from the context. -/
abbrev IntentSeed (P : Type) := Context P

/-- The deficit: the person holds a direction but has not fixed which decisions it turns on — a
    coordinate that their material, their words, or the decision structure of the domain the intent
    sits in raises is still open. Invoking `/elicit` is the person's declaration of it, and you do
    not judge it away. **Your judgment** on the AI-guided path only, as the entry judgment: finding
    none means not starting, which leaves no outcome of this protocol; finding it makes the first
    surface a proposal the person confirms or declines. -/
axiom aporia : Context P → Prop

/-- A coordinate or a value, named as the presentation shows it. -/
abbrev Entry := String

/-- **Your judgment**, the live inventory: every coordinate the intent turns on that this run has
    raised and the person's words have not since merged into another — read over the whole fused
    context: the seed, every answer, what reads of the person's material returned, and the
    decision structure of the domain the intent sits in. A coordinate raised once stays here
    whether or not the current surface shows it; one the person's words retired stays too, marked
    as retired in their words, and is not raised again unless they return to it. The person may
    add, merge, reword, or retire any coordinate, the axis itself included. The person's own word on
    the intent as a whole — that it is aligned enough — is carried as an entry here once they give
    it. Whether a reworded coordinate is the same coordinate is
    your judgment; rewording it does not drop the value that stands on it. Guidance for the reading, not steps it must take: read
    the person's material where the intent turns on it rather than from scratch each round, and a
    coordinate whose basis is still thin may wait before it is raised. -/
axiom coordinates : Context P → List Entry

/-- Who first put a value forward: you, or the person. -/
inductive Proposer | draft | person

inductive Standing | set | adopted | granted

structure Determination where
  value    : Entry
  proposer : Proposer
  standing : Standing

/-- **Your judgment**, the record rule: the cited turn makes coordinate `x` stand as `d`, read
    against the context as it now stands, on the scope the turn's words reach. Who proposed the
    value and how it stood are read separately. The proposer is whoever first put the value forward
    in the context, however the cited turn words it; a value you drew from evidence or from the
    person's material and put to them was put forward by you. The standing is what the cited turn
    itself did: gave the value in its own words (`set`) — a person repeating their own earlier
    value keeps it `set`; took a value put forward before (`adopted`) —
    where you put it forward, only if it was visible as yours before this turn; or gave a grant
    whose words reach your choice (`granted`).
    An addition of yours the person did not see — a default for an unanswered coordinate, a merge,
    a rejected alternative or a reason they did not state, a question read as a decision — stands
    on nothing and stays your proposal, unless a grant whose words reach it covers it. A question, a request to look
    something up, an observation, a deferral, or a bare mention makes nothing stand. The value is in the words of
    the turn that set it, or of the proposal as it was shown; a read-back that paraphrases never
    replaces it, and never turns the person's value into an adoption. That the intent is aligned
    enough stands only where a turn of the person's says it, read against the context as it now
    stands: filled coordinates, or your own reading, say nothing of it, and a turn whose intent is
    unclear does not make it stand. -/
axiom StandingSupported : Entry → Context P → Turn P → Determination → Prop

/-- Only a person's turn makes a value stand in the intent. Evidence fixes facts and informs the
    person; it fills no coordinate here. -/
def standingCoord (x : Entry) : Coord P Determination :=
  { admits := (·.val = .person), supports := StandingSupported x }

/-- **Your reading**: how coordinate `x` stands in `c` — filled by the person's latest turn that
    makes it stand; open where none does, carrying as candidate only a turn of the person's or
    evidence that points toward a value not yet taken. A value a person's turn made stand changes
    only by their later words: evidence against it is shown, and the value stands. A coordinate
    the person retired is open from the turn that retired it, and nothing stands on it until their
    later words make a value stand on it again. -/
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
    it was deferred, left unanswered, never reached, or retired by the person — a deferred or
    retired one shown as deferred or retired, in their words. None closes by default. -/
def residual (c : Context P) : List Entry :=
  (coordinates c).filter (fun x => !isFilled (operative c x))

/-- **Your judgment**: the latest utterance bears on this run — a value, a deferral, a question
    about the return, a new frame, that the intent is aligned enough — read whole against the
    context as it now stands. An utterance that does not bear on it leaves the last return
    standing: the session answers it, that answer stays in the context, and no return of this run
    is drawn. Where a turn could be read either way, the answer says briefly how it took it. An
    AI-guided run the person has not confirmed has not started: nothing they say is recorded into
    it. -/
axiom Reaches : Context P → Prop

/-- **Your record**: the contrary grounds you presented before the person's turn and still hold —
    a value you doubt, a premise that may not hold, a sibling deficit you read — attached to the
    return; empty when there were none. -/
axiom dissent : Context P → List String

/-- Once it has run, the person can say: this is my intent, aligned enough — the decisions it
    turns on were surfaced to me, each value in the record stands on my own words or on a proposal
    shown as yours that I took, with who proposed it and how it came to stand, and what I left
    open is carried as residual. `ResolvedEndpoint`: the intent as it stands at the latest return
    — the context it was read at, the recorded values, what is still open, and the dissent
    attached to the return. -/
structure ResolvedEndpoint (P : Type) where
  context  : Context P
  record   : List (Recorded context)
  residual : List Entry
  dissent  : List String

/-- The return read at `c`: the record and the residual as read there, where its citations point,
    with the dissent the turn that shows it at `shown` attaches. -/
def endpoint (c shown : Context P) : ResolvedEndpoint P :=
  { context := c, record := record c, residual := residual c, dissent := dissent shown }

/-! ── A-BINDING ──
bind(I) = explicit_arg ∪ recent_intent_seed ∪ surfaced_aporia
Priority: explicit_arg > recent_intent_seed > surfaced_aporia
  /elicit "intent"   → I = the utterance, with the context it lands in
  /elicit (alone)    → I = the most recent intent seed in the session
  "I want to..."     → I = the utterance under discussion (AI-detected path: the first surface
                       confirms or declines the run; a decline leaves it unstarted)
-/

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it. The recursion also
carries the last return, which PHASE TRANSITIONS threads beside it.
-/

/-! ── PHASE TRANSITIONS ──
A step is one arm of a structural recursion over the person's utterances, carrying the context as
it stands and the last return. `respond` is the next return's turn, as TOOL GROUNDING's `surface`
entry names it; `session` is the session's own answer to an utterance that does not bear on the
run, which stays in the context without being a return of this run, and the last return is
carried past it unchanged.
-/

open Classical in
def elicit (respond session : Context P → Response P) :
    Context P → ResolvedEndpoint P → List (Utterance P) → ResolvedEndpoint P
  | _, r, []      => r
  | c, r, u :: us =>
    let c' := fuse c u
    if ¬ Reaches c' then elicit respond session (c' ++ [(session c').val]) r us
    else
      let shown := c' ++ [(respond c').val]
      elicit respond session shown (endpoint c' shown) us

/-- The run opens on its first return. -/
def start (respond session : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : ResolvedEndpoint P :=
  let shown := c ++ [(respond c).val]
  elicit respond session shown (endpoint c shown) us

/-! ── CONVERGENCE ──
returned: every round's turn is a return, whether or not the person answered anything; none owes
an answer, and no closing turn is asked. Convergence evidence: each return, as `surface` states
it. Demonstrated, not asserted.
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

inductive Op | detect | read | trace | surface | readAnswer | converge | seam

def grounding : Op → Annot × String
  | .detect       => (.sense, "Internal analysis, on the AI-guided path only: whether the person has fixed which decisions the intent turns on, read from the utterance, their material, and the domain's decision structure; an invocation of /elicit declares the deficit and is not judged")
  | .read         => (.observe, "artifact read, artifact search, record read: read-only reads of the person's own material where the intent turns on it")
  | .trace        => (.sense, "Internal analysis: the live inventory over the whole fused context and the domain's decision structure, each coordinate with where it comes from and what leaving it open changes")
  | .surface      => (.interaction .extension, "a read-back of the intent as understood, every round the first included, with its sources and each recorded value in the words that made it stand, marked by who proposed it and how it stood; where the read-back, or your reading of the person's turn, settles something their words left open — a referent, a sense — it is shown as your reading; each open coordinate the round shows, with its question, where it comes from — the person's material cited, their words quoted as said without an unstated mental model, or the domain's decision structure marked as yours — what leaving it open changes, and any default as your proposal; your contrary grounds before the questions. Guidance for the showing: coordinates the domain raises come after the ones the person's material and words raise, as open questions rather than filled examples; a deferred coordinate returns in the same wording with the same basis, marked as returning. The answer may give values, defer, or say the intent is aligned enough, in any form; an answer beyond the open coordinates joins the context whole")
  | .readAnswer   => (.sense, "Internal analysis: whether the latest utterance bears on this run, and what it does there — the values it makes stand — read whole against the fused context as it now stands, whatever form it takes")
  | .converge     => (.interaction .extension, "the convergence evidence CONVERGENCE names, which each return carries")
  | .seam         => (.interaction .extension, "after a return, proceed to the next move the person declared, citing that turn")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Intent resolution emergent via session context.
-/

end

end Euporia
```

## Scope Boundary

Euporia surfaces the decision coordinates an intent turns on without adjudicating which sibling protocol owns them. A coordinate that exposes a missing fact, an undefined boundary, or an unrecognizable direction remains a coordinate with its basis; a fact claim you add from the domain's practice is shown as your unverified judgment. What it carries: the read-back of the request, the reads of the person's material that read-back needs, the decisions the intent turns on with their sources, your proposals marked as yours, and what the person's turns make stand, returned with what is open. Past the hand-off, named here and supplied elsewhere: carrying out the seed's task, verifying a fact you added, mapping who decides and what is entrusted, writing the intent into a record outside the session, and how another skill composes this one.

## Mode Activation

`/elicit` remains directly invocable: the invocation declares the deficit the Definition's `aporia` names, and the first surface shows the intent as understood with its sources — the user may say at once that it is aligned enough. On the AI-guided path the first surface is a proposal the user confirms or declines; until the user confirms, the run has not started, and a decline leaves it unstarted. Skip AI-guided activation when the user explicitly asks to proceed without surfacing, or when a run on the same utterance already returned in this session, or the user declined or ended a run on it.

## Protocol

### Surface

Present what TOOL GROUNDING's `surface` entry names. Read `references/round-composition.md` before composing when a term must remain stable across the session, wording must travel unchanged, or material belongs to another round.

## Rules

- **Recognition over Recall**: Present the coordinates an intent turns on with their anticipatable post-answer states, so the user recognizes what they would otherwise have to recall.
- **Round composition**: State who does what, in words the reader already uses or meets often, composed from the meaning in the language they are using; keep each judgment beside its nearest evidence and next-move implication; and place analytical context before the questions.
- **Focus and record**: As the Definition's MORPHISM invariant and `record` state.
- **Form feedback**: Derive each round's density from the current request and carry an explicit form instruction until countermanded. Change the form directly. Elements fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
