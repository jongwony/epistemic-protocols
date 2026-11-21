---
name: fit
description: "Use when the user holds an intent they can judge a case against and wants a direction, a design or an implementation brought to it through concrete cases — its solution space cannot be settled from description alone, and its boundaries show only where they meet a case. The user can then see the space as it now stands — the cases they settled, what the target does on every case gathered so far, the boundaries still open — and judge when it is enough for their purpose."
---

# Harmoge Protocol

Bring a target — a direction, a design, an implementation — to what the person intends by interviewing them through concrete cases, carrying each answer into the target and replaying every case gathered so far, until the person takes the solution space shown. Type: `(SolutionSpaceUnfused, User, FUSE, Target) → FusedSolutionSpace`.

## Definition

**Harmoge** (ἁρμογή): a fitting together, a joining of parts into a whole. A dialogical act for the moment when the solution space a target opens for the person's purpose cannot be fused with what they intend from its description alone: its boundaries show only where they meet a concrete case. The roles are those of an interview turned around — the AI interviews, and the person holds the Northstar and the purpose, gives or corrects them, and judges the cases. Each round shows the solution space as it now stands, what the AI read from the last answer and on which turn each reading rests, what it carried into the target and what the target now does on every case gathered since the call, and then the next question: only what the person alone holds, as concrete cases. The person answers in their own words; an answer binds as far as those words reach, and a reason or an example of their own can open a further case or move the space. The run closes when the person takes the space a round showed, and its record is that space — the cases they settled, the trade-offs they took, the boundaries still open, the premises and the domain — with the target as its realization and what it did on each case. What the target does on a case is a result of the run only as far as a run of it returned; where nothing ran, it is the AI's reading of the target, said as one.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract.
-/

/-! ── FLOW ──
Harmoge(R) → start(c) → fit(c, utterances), where c is the fused session context:
  advance(c): what bears on the target is read; what `applied` carries goes into the target;
    where a run of the target is in reach (`RunInReach`), the run returns what `ran` records
  round(c): the space, the read-back, what was carried and what every case now shows, the next
    cases — read afresh from the context
  start: advance(c) → round
  next utterance u, read on fuse(c, u) →
    [the utterance does not bear on this run]  the session answers it; that answer stays in the
                                               context; nothing is carried; no round of this run
    [the person takes the space (`taken`)]     → FusedSolutionSpace, its record read on c, the
                                               context that turn met
    [otherwise]                                advance(fuse(c, u)) → round
  no utterance: nothing is taken; the run holds
-/

/-! ── MORPHISM ──
Target
  → gather               -- what bears on the target and its cases, read now (focus)
  → apply                -- what `applied` carries, into the target
  → replay               -- every case gathered since the call, on the target as it now stands
  → present              -- the space, the read-back, the replay, the next cases (focus)
  → fuse(u)              -- the person's turn joins the context whole
  → take                 -- the person's taking of the space the round showed (`ClosureSupported`)
  → FusedSolutionSpace
requires: target_named(R)               -- one target is in play: a direction, a design, or an existing implementation, whatever produced it
deficit:  SolutionSpaceUnfused          -- activation precondition, declared by the user's call
preserves: the person's turns           -- the target changes and the context only grows; no write and no replay reaches a purpose or a judgment, which only a later turn of the person's moves
invariant: Grounded, not asserted       -- every claim a round makes says the turn it rests on: the person's, a cited return, or marked as your inference
invariant: Run, not read                -- what the target did on a case stands as observed only on a cited return, as `replay` states
The steps between gather and take are how you work toward a space the person can take. The
contract fixes the deficit and its resolution, the coordinates only the person fills — the
purpose, each case's judgment, the taking — and one condition on the work: before a round, the
person's answers are carried and every case gathered so far is replayed.
-/

namespace Harmoge

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

/-- `R`, the target: the one thing this run fits — a direction, a design, or an existing
    implementation, whatever produced it, read from the context. Every kind is handled the same
    way, and the run changes it as the person's answers reach it. -/
abbrev Target (P : Type) := Context P

/-- A purpose, a case, or what the person made stand on a case, named as the round shows it. -/
abbrev Entry := String

/-- **Your judgment**: the cited person turn says what the target is for — the Northstar and the
    purpose it serves — in their own words, or by taking the reading of it a round showed, which
    adopts it as it was shown; read against the context as it now stands. A later turn of theirs
    may give more of it or correct it. -/
axiom PurposeSupported : Context P → Turn P → Entry → Prop

/-- Only a person's turn sets the purpose. -/
def purposeCoord : Coord P Entry :=
  { admits := (·.val = .person), supports := PurposeSupported }

/-- **Your reading**: the purpose as it stands in `c` — filled by the person's latest turn that
    sets it; `open_` until one does. While it is open the round shows your reading of it, marked as
    yours; it holds back neither a round nor the taking. -/
axiom purpose : (c : Context P) → Occ (purposeCoord (P := P)) c

def isFilled {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Bool
  | .open_ _   => false
  | .filled .. => true

/-- **Your judgment**, the live inventory: every case this run has taken up since the call — a
    concrete situation the target meets, one you put to the person, one they brought, one their
    reason opened, one where their answers lead to different outcomes, or one the call or the
    target already carried. A case taken up once stays,
    whether or not the current round shows it and whether or not the space still turns on it,
    marked so. Whether a reworded case is the same case is your judgment. -/
axiom cases : Context P → List Entry

/-- **Your judgment**, the record rule: the cited person turn says what should happen on case `k`
    — read whole, against the context as it now stands, as far as its words bind. How far they
    bind is read from them: that something is required, that it is permitted, that it is ruled
    out, that the case's premise is wrong, that they do not know are examples of what a turn can
    say, never a list it is sorted into. Taking the outcome a round showed for the case adopts it
    as it was shown, and the record says it was taken rather than said. A reason or an example of
    their own reaches as far as it reaches: it may settle this case, open a further one, or move
    the space; where it reaches a case it does not speak to, the target carries it and that case's
    judgment stays as it was. A question back, a bare
    mention, or your own reading of what they would say settles nothing. A later turn of theirs
    may change it. -/
axiom JudgmentSupported : Entry → Context P → Turn P → Entry → Prop

/-- Only a person's turn judges a case. -/
def judgmentCoord (k : Entry) : Coord P Entry :=
  { admits := (·.val = .person), supports := JudgmentSupported k }

/-- **Your reading**: the person's judgment of case `k` as it stands in `c` — filled by their
    latest turn that still reaches it; `open_` while none does, with a candidate where a turn of
    theirs points toward one and its support is short. -/
axiom judgment : (c : Context P) → (k : Entry) → Occ (judgmentCoord (P := P) k) c

/-- **Your judgment**: the cited turn carries what running the target, as it then stood, on case
    `k` returned, and the span is the narrowest returned material that shows the outcome, quoted in
    place. A run on a stand-in says what it stood for and what it left untested. -/
axiom ReturnSupports : (c : Context P) → Cite c → String → Entry → Prop

/-- An observation of what the target did on case `k`: a turn a tool, the environment or a peer
    returned, with the span that shows it. -/
structure Returned (c : Context P) (k : Entry) where
  src       : Cite c
  byRun     : src.src.val = .external ∨ src.src.val = .peer
  span      : String
  supported : ReturnSupports c src span k

/-- What the target does on case `k`: the account, and the returns it rests on. -/
structure Replay (c : Context P) (k : Entry) where
  account : String
  returns : List (Returned c k)

/-- **Your reading**, afresh on `c`: what the target, as it now stands, does on case `k`. Attach
    each return beside the outcome it showed and name the state of the target it ran on. Where no
    return shows the current outcome, the account is your reading of the target on the case — the
    wording of the target that decides it, quoted, or that the target does not reach the case —
    said as a reading, with what a run would need where a run could show more. Where a run and a
    reading both bear, both are there, and what stays unverified is named. -/
axiom replay : (c : Context P) → (k : Entry) → Replay c k

/-- A case's row, on two axes kept apart: what the target now does on it, and what the person has
    made stand on it. -/
structure Row (c : Context P) (k : Entry) where
  replay   : Replay c k
  judgment : Occ (judgmentCoord (P := P) k) c

/-- Every case of the inventory, with its row. -/
def rows (c : Context P) : List ((k : Entry) × Row c k) :=
  (cases c).map fun k => ⟨k, ⟨replay c k, judgment c k⟩⟩

/-- **Your reading**, afresh every round: the solution space as it now stands — what now fits the
    purpose best, the alternatives that part from it and where, the premises they turn on, its
    domain, the trade-offs the person has taken, and the boundaries still open. It is your reading
    and never a judgment of the person's. -/
axiom space : Context P → String

/-- **Your reading**: where the target now stands — its location, or the round whose text holds it
    where it lives only in the conversation — and what this run carried into it, as observed. -/
axiom realization : Context P → String

/-- **Your record**: your contrary grounds, each with what it bears on and what it rests on, shown
    before the person's turn it bears on. A taking over one carries it. Empty when there are
    none. -/
axiom dissent : Context P → List String

/-- **Your judgment**: the latest utterance bears on this run — a purpose, a judgment of a case, a
    reason, a case of their own, a correction of your reading, a question about the space, the
    taking — judged on what the whole utterance does, on the context with it. An utterance about
    other work leaves the run as it stands: the session answers it, that answer stays in the
    context, and no round is drawn. Words that end the run without taking the space do not bear on
    it, whatever else the turn says, and what else it says stands in its own words in the context:
    the session answers them, no round is drawn, the run holds, and later turns bear on it only
    where they come back to it; your own reading that the person is done ends nothing. Where a
    turn could be read either way, the session's answer says briefly how it took it. -/
axiom Reaches : Context P → Prop

/-- **Your judgment**: the cited person turn, read whole against the accumulated context, takes the
    space the latest round showed as enough for their intent and goal. A next move that uses that
    space can express the taking. Taking the space adopts what was shown as it stood. A turn that
    makes a change a condition of taking calls for that change to be carried, replayed and shown.
    Taking a case outcome settles that case. Where the evidence gives you reason to question the
    decision against the person's stated goal, you may put its consequence to them as the next
    case. -/
axiom ClosureSupported : Context P → Turn P → Unit → Prop

/-- Only the person takes the space. -/
def closureCoord : Coord P Unit :=
  { admits := (·.val = .person), supports := ClosureSupported }

/-- **Your reading**: the person's taking; `open_` until one reaches it. -/
axiom closure : (c : Context P) → Occ (closureCoord (P := P)) c

/-- The taking the run acts on: the closure filled on the latest turn of `f`. A turn before it
    takes nothing now. -/
def taken (f : Context P) : Bool :=
  match closure f with
  | .open_ _         => false
  | .filled _ s _ _  => decide (s.idx + 1 = f.length)

/-- The record a taking carries, as CONVERGENCE lists it: the readings of one context. -/
structure Closed (P : Type) where
  context     : Context P
  purpose     : Occ (purposeCoord (P := P)) context
  rows        : List ((k : Entry) × Row context k)
  space       : String
  realization : String
  dissent     : List String

def closed (c : Context P) : Closed P :=
  { context := c, purpose := purpose c, rows := rows c, space := space c,
    realization := realization c, dissent := dissent c }

/-- Once it has run, the person can say: this space is enough for my purpose. I can see what I
    accepted, what the target does on the cases we considered, and what I left open.
    `FusedSolutionSpace`: the person's taking of the space a round showed — `shown`, the record
    read on the context that turn met, and `taking`, the turn itself. What the turn adds beyond
    the taking stays in the context in its own words and is no part of the record. The record
    covers the cases on it and claims nothing about a case not on it; it records the person's
    taking, not that the target is right. -/
structure FusedSolutionSpace (P : Type) where
  shown  : Closed P
  taking : Utterance P

inductive Outcome (P : Type)
  | fused   (r : FusedSolutionSpace P)
  | holding (c : Context P)

/-- **Your read**, now, of what the next judgment needs: the target's material and the records and
    sources that bear on it — any a turn cites, and any you find — as far as access reaches without
    changing existing state. What a record already holds is read from the record before a case is put to the person.
    What you say you read, you read to the end. Empty where nothing outside the context bears. -/
axiom gathered : Context P → List (Evidence P)

/-- **Your carrying**, now, of what the person's answers and reasons, as they stand, say the target
    should do. Where replay shows the target has lost such an answer, carry it into the target
    again. Each write is observed, and what returns says what landed. Where the target lives only
    in the conversation nothing is written and the round holds the revised version; where the
    change needs a capability out of reach, the round holds the draft as a proposal and names the
    capability it needs to land. Empty where there is nothing to carry. -/
axiom applied : Context P → List (Evidence P)

/-- **Your judgment**: a run on some or all of the gathered cases is within reach now and would
    show what a reading of it cannot. Read on the context with what was gathered and carried. -/
axiom RunInReach : Context P → Prop

/-- **Your run**, now: what the run handed off at `.run` returned — the target as it now stands on
    the cases reached by that run, each return with what it ran on and what that leaves untested. -/
axiom ran : Context P → List (Evidence P)

/-- The context with what `gathered` read now appended. -/
def consulted (c : Context P) : Context P := c ++ (gathered c).map (·.val)

/-- The context with what `applied` carried now appended. -/
def carried (c : Context P) : Context P := c ++ (applied c).map (·.val)

open Classical in
/-- The work before a round, in order: what bears, gathered; the answer, carried; and, where
    `RunInReach` holds on the context that leaves, the cases run, as `advanceOps` hands it off. -/
def advance (c : Context P) : Context P :=
  let c₁ := carried (consulted c)
  if RunInReach c₁ then c₁ ++ (ran c₁).map (·.val) else c₁

/-! ── A-BINDING ──
bind(R) = the target the argument names, else the target most recently in play; words in the call
that say what it is for fill the purpose (`PurposeSupported`), and a case the call names enters the
inventory.
-/

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

/-! ── PHASE TRANSITIONS ──
A step is one arm of a structural recursion over the person's utterances. `respond` is the round,
as TOOL GROUNDING's `present` entry names it; `session` is the session's own answer to an utterance
that does not bear on the run, which stays in the context without being a round of this run. The
work before a round appends what `advance` returns [Tool].
-/

open Classical in
def fit (respond session : Context P → Response P) :
    Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let f := fuse c u
    if ¬ Reaches f then fit respond session (f ++ [(session f).val]) us
    else if taken f = true then .fused ⟨closed c, u⟩
    else
      let c' := advance f
      fit respond session (c' ++ [(respond c').val]) us

/-- The run opens on the work before a round, and its first round. -/
def start (respond session : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  fit respond session (advance c ++ [(respond (advance c)).val]) us

/-! ── LOOP ──
Every answer is read against the whole context as it now stands.
-/

/-! ── CONVERGENCE ──
converged: a FusedSolutionSpace a person's taking closed; holding is a run no turn of the person's
has taken. The convergence evidence: how you read the taking, with the person's words; the purpose
as it stood, marked as yours where you read it; every case on the record with what the target did
on it — each return with what it showed and what it left untested, or your reading said as one with
what a run would need — beside the person's judgment in their words, or as taken from a round, or
still open, and where the two part, that; the space as shown; where the target stands and what was
carried into it; what could not be reached; and the dissent. Grounded, not asserted.
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

inductive Op | gather | apply | applyDelegate | run | assess | present | readAnswer | converge
             | seam

def grounding : Op → Annot × String
  | .gather        => (.observe, "artifact read, artifact search, record read: what `gathered` reads, now, as its doc states; name what was reached and what was not")
  | .apply         => (.transform, "artifact write: what `applied` carries into the target, as its doc states")
  | .applyDelegate => (.dispatch, "delegate (conditional): the write `applied` carries handed to execution, its return observed as that doc states")
  | .run           => (.dispatch, "delegate: where `RunInReach` holds, the target as it now stands run as `ran` describes; what returns enters the context as evidence, before the round that shows it")
  | .assess        => (.sense, "Internal analysis: the purpose reading, the inventory, each case's row, the space and where the target stands, over the whole fused context as it now stands")
  | .present       => (.interaction .extension, "the round, every round the first included, in whatever form loads this person least. The space as `space` reads it. What you read from the last answer. What was carried into the target, and the replay: a summary over every case of the inventory, and each case whose outcome differs from the round before shown as that case — both outcomes, the person's judgment as it stands, and what you read as the cause. Where there is a case the person can judge, the next question: only what the person alone holds, as concrete cases, each rendered as the Protocol section says under \"Case rendering\" — the most consequential first. Where a reading was uncertain, say how you took it. Every round ends on an opening the person can take — judge a case, correct the space or the purpose, bring a case of their own, or take the space")
  | .readAnswer    => (.sense, "Internal analysis: whether the latest utterance bears on this run and what it does there, as `Reaches`, `PurposeSupported`, `JudgmentSupported` and `ClosureSupported` read it — read whole against the fused context as it now stands")
  | .converge      => (.interaction .extension, "the convergence evidence CONVERGENCE names; proceed with FusedSolutionSpace")
  | .seam          => (.interaction .extension, "after a taking, proceed to the next move the person declared, citing that turn")

open Classical in
/-- The operations whose returns `advance` appends, in order: what `.gather` reads; what `.apply`
    writes, through `.applyDelegate` where the write is handed to execution; and, where
    `RunInReach` holds once the answer is carried, what the run handed off at `.run` returns. -/
def advanceOps (c : Context P) : List Op :=
  if RunInReach (carried (consulted c)) then [.gather, .apply, .applyDelegate, .run]
  else [.gather, .apply, .applyDelegate]

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Space resolution emergent via session context.
-/

end

end Harmoge
```

## Mode Activation

`/fit` is user-invoked only: activate when the user calls it on a target — a direction, a design, or an existing implementation; a bare command refers to the target most recently in play. The call declares the deficit, so the run starts on its first round without asking whether to start. Where what the person wants this run to improve is unclear, say what you can read of it and on what ground. If they say they have yet to form that intent, leave the fit open and offer to help them find it.

## Protocol

### Case rendering

A case is a concrete situation as the person would meet it. Show its body — the message, the event, the input — so that the person judges the thing itself. Show an alternative design as the turn it would actually be, or the outcome the person would meet, in a situation they know; then the one thing that separates it from the others, and why. Take the alternatives one after another. Say where each case comes from: a record, the person's own example, or one you constructed, marked as constructed. Give each case a label that names it alone, and keep that label for the whole run.

### Space rendering

Show the space as the current sheet, and draw a picture only where alternatives part. Where the session has a surface that stays in view, the sheet can stay there as well.

## Rules

- **User-initiated only**: Activate only on the user's call; an explicit decline before activation withholds it.
- **Round composition**: Compose each round so the reader can act without reassembly — state who does what, in words the reader already uses or meets often, composed from the meaning in the language they are using; keep each judgment beside its evidence and next-move implication; and place analytical context before the round's opening. Read `references/round-composition.md` before composing when terminology must remain stable, wording must be carried unchanged, content belongs to another round or the convergence evidence, or whether text belongs before the round's opening or inside it is in question.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction until countermanded. Change form directly. Elements fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
- **Contract execution**: As FLOW, the judgments' doc comments, the `FusedSolutionSpace` doc, LOOP, TOOL GROUNDING's `present` entry, and CONVERGENCE state.
