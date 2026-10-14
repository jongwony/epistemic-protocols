---
name: probe
description: "Something feels off and the user cannot name what is stuck: the user can then say what it is — a shown candidate, their own words, or none shown — having seen what each rests on and what rules it out."
user_invocable: true
---

# Probe Skill

Resolve a sense that something is off, before the person can name what is stuck, into a situation they recognize, through grounded candidates shown side by side. Type: `(DeficitUnrecognized, AI, RECOGNIZE, UserSituation) → RecognizedSituation`.

## Definition

**Probe** (ἐπίγνωσις, *epígnōsis*: knowing-upon, recognition of what was already there): A dialogical act of turning a person's sense that something is off into a situation they recognize. AI reads the present situation and the descriptions of the other installed skills, and shows the candidates the ground carries for what is stuck, at least two where it carries them — each a description of the situation resting on turns of it that it cites, with the condition that would rule it out, the installed skill that takes it where one does, and that skill's declared end where its description declares one. The person takes one shown candidate, puts the situation in their own words, or says none shown is theirs; that recognition is what the run yields, and no score, ranking, or reading of the AI's makes it. Where the ground carries only one, AI shows that one and says it carries no second rather than inventing one; where it carries none, AI says so. Taking a shown candidate whose line showed a skill takes that skill's invocation with it, unless the person declines the run.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract.
-/

/-! ── FLOW ──
Probe(U) → start(catalog, c) → probe(catalog, c, utterances), where c is the fused session
context and catalog is as `Catalog` states, read once when the run starts:
  [no unrecognized deficit, and the person did not invoke this]  nothing is shown; not activated
  pass(c): what `gathered` reads enters the context; the situation is read against the catalog
  [the ground carries two or more candidates]  present them → Stop
  [it carries fewer]                           say so, with the one line it carries, if any,
                                               and what more of the situation would help → Stop
  next utterance u: c' := fuse(c, u) →
    [u does not bear on this run]  as `Reaches` states; the session answers it
    [a turn of the person's is still owed]  no answer closes → pass(c') → a round that serves it
    [u takes a shown candidate, puts the situation in their own words, or says none shown is
     theirs]  close: recognized → the hand-off `invokedBy` names
    [otherwise] u is more of the situation — a narrower slice, a correction, a candidate set
      aside, a question, a read beyond the session admitted → pass(c') → the same reading
  no utterance: the round holds; nothing is recognized and nothing closes
-/

/-! ── MORPHISM ──
UserSituation
  → detect(deficit_unrecognized)   -- something is off and what is stuck goes unnamed; an invocation of the person's own activates on its own
  → read(catalog)                  -- as `Catalog` states, once at the start; the contract names no skill and no deficit
  → draw(candidates, situation)    -- descriptions of the situation, each resting on turns it cites, each with what would rule it out
  → present(candidates)            -- grounds, then the rules-out condition, then the skill and its declared end; contrary grounds; the turn yields
  → recognize(situation, person)   -- a shown candidate, the person's own words, or none shown: the person's observable act
  → emit(RecognizedSituation)      -- the answer, what the round showed, the contrary grounds closed over, and the recognizing turn, as session text
  → RecognizedSituation
requires: deficit_unrecognized(U) ∨ invoked(U)   -- runtime checkpoint, read by `start` before the first pass
deficit:  DeficitUnrecognized                    -- activation precondition
preserves: the catalog                           -- read, never written; the context only grows
invariant: Recognition over Resolution
-/

namespace Probe

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

/-- `U`: the person's present situation — their utterances and the context they stand in. What is
    stuck is read from it, never stored beside it. -/
abbrev UserSituation (P : Type) := Context P

/-- One installed skill as the session lists it: its name and its description. -/
structure CatalogEntry where
  skill       : String
  description : String

/-- The installed skills' descriptions other than this probe's own, read as they stand when the
    run starts and never written. Whatever else is installed is the catalog; this contract lists no
    skill and no deficit of its own. -/
abbrev Catalog := List CatalogEntry

/-- **Your reading** of a description: the end it declares — what the person can say or recognize
    once that skill has run — or `none` where it declares none. Nothing is written in where a
    description is silent, and a skill whose description declares no end keeps its candidacy. -/
axiom declaredEnd : CatalogEntry → Option String

/-- A candidate for what is stuck: one description of the situation, and the installed skill that
    takes it where one does. -/
structure Candidate where
  situation : String
  skill     : Option CatalogEntry

/-- The end a candidate's line shows: its skill's declared end, and none where it has no skill or
    the skill's description declares none. -/
def Candidate.ending (k : Candidate) : Option String := k.skill.bind declaredEnd

/-- **Your judgment**: the cited turn carries this about the situation, read against the context as
    it now stands — what the person said, or what a read returned. -/
axiom ClaimSupported : Context P → Turn P → String → Prop

/-- One thing the situation shows, with the turn that carries it. -/
structure Claim (c : Context P) where
  text      : String
  src       : Cite c
  supported : ClaimSupported c (c[src.idx]'src.lt) text

/-- One line of a presentation: a candidate whose skill, if any, is one the catalog holds, what in
    the situation it rests on — one cited turn at least — and the condition that would rule it
    out, which may be one not yet observed. -/
structure Line (catalog : Catalog) (c : Context P) where
  candidate : Candidate
  inCatalog : ∀ e, candidate.skill = some e → e ∈ catalog
  grounds   : List (Claim c)
  grounded  : grounds ≠ []
  rulesOut  : String

/-- What a round showed. -/
inductive Presentation (catalog : Catalog) (c : Context P)
  /-- two or more candidates side by side, no two lines with the same situation text, each line
      with its grounds, its rules-out condition, and its `ending` -/
  | alternatives (lines : List (Line catalog c)) (two : 2 ≤ lines.length)
      (distinct : (lines.map (·.candidate.situation)).Nodup)
  /-- the ground carried fewer than two: said as such, with the one line it carries where it
      carries one, laid out like any other line, and what more of the situation would help -/
  | short (line : Option (Line catalog c))

/-- The lines a round showed: one or none in a short round. -/
def Presentation.lines {catalog : Catalog} {c : Context P} :
    Presentation catalog c → List (Line catalog c)
  | .alternatives ls _ _ => ls
  | .short l             => l.toList

/-- The candidates a round offered to take. -/
def Presentation.shown {catalog : Catalog} {c : Context P} (p : Presentation catalog c) :
    List Candidate :=
  p.lines.map (·.candidate)

/-- **Your reading**: this run's latest presentation as it was shown, read from that response, on
    the context it was shown on — the first `n` turns of `c`, a strict prefix; a round another run
    showed is not this run's; what was shown, not what you meant to show; `none` before any. -/
axiom presented : (catalog : Catalog) → (c : Context P) →
    Option (Σ n : Fin c.length, Presentation catalog (c.take n))

/-- The candidates the latest round offered to take. -/
def shownIn (catalog : Catalog) (c : Context P) : List Candidate :=
  ((presented catalog c).map (·.2.shown)).getD []

/-- **Your record**: your contrary grounds bearing on what the latest utterance recognizes — the
    candidate it takes, or the person's own wording — each with what it bears on and what it rests
    on, attached where the person recognizes over them; raised again only on new evidence. Empty
    when there are none. -/
axiom dissent : Context P → List String

/-- How a person's turn recognizes what is stuck. Premise: one utterance carries one of these or
    none; whatever else it says is more of the situation — read by the next pass where the turn
    closes nothing, and left in the context where it closes. -/
inductive Answer
  /-- the person takes a shown candidate as their situation; `run` is whether the turn also takes
      the run of the skill its line showed — true where it does not decline it, since the line
      said that taking the candidate runs that skill, and false only where it declines the run -/
  | shown (k : Candidate) (run : Bool)
  /-- the person says what is stuck in their own words -/
  | reworded (situation : String)
  /-- the person says none of the shown candidates is theirs -/
  | noneShown

/-- **Your judgment**: the cited turn recognizes the situation this way, read whole against the
    context as it now stands. A candidate is taken where the turn says it is theirs or goes on
    with it as theirs, and its `run` is read from whether the turn declines the skill's run; a
    rewording stands as they said it, beside any contrary ground and never replaced by yours, and
    "none of these" together with what is stuck in their own words is a rewording. Uncertainty, a
    hypothetical use, a question about a candidate, the invocation of this probe alone, and
    silence recognize nothing, and your readings, scores, and rankings fill nothing. -/
axiom AnswerSupported : Context P → Turn P → Answer → Prop

/-- Only the person recognizes. -/
def answerCoord : Coord P Answer :=
  { admits := (·.val = .person), supports := AnswerSupported }

/-- **Your reading** of the latest utterance: `open_` where it recognizes nothing. -/
axiom answer : (c : Context P) → Occ (answerCoord (P := P)) c

/-- **Your reading**, on the present turn: the person invoked this probe themselves; an earlier
    invocation does not keep it on. -/
axiom Invoked : Context P → Prop

/-- **Your judgment**, on the present turn: the person senses something is off and does not name
    what is stuck — symptoms described in place of it, hesitation between skills, "which one fits
    this?". An earlier probe does not keep this on; each occasion is read afresh, and a round the
    person just passed over or ended is not raised again unbidden — it is read as received. -/
axiom DeficitUnrecognized : Context P → Prop

def Activated (c : Context P) : Prop := Invoked c ∨ DeficitUnrecognized c

/-- **Your judgment**: the latest utterance bears on this run — a recognition, more of the
    situation, a question about a candidate, a correction, a read beyond the session admitted —
    judged on what the whole utterance does, read on the context with it. An utterance that ends
    the probe or turns to other work leaves the run as it stands: the session answers it, that
    answer stays in the context, no round of this run is raised, and nothing closes. Once the
    person has ended the probe, or passed over a round they did not ask for, a later utterance
    bears on this run only where it reopens it. The person's own invocation of this probe starts
    a new run and does not bear on an earlier one. -/
axiom Reaches : Context P → Prop

/-- **Your reading**: a turn of the person's is still owed before a recognition closes — read on the
    context as it now stands, the latest utterance included. Guidance for the reading, not cases it
    must check: contrary grounds of yours the person has not closed over, any the latest utterance
    itself raises against what it takes among them — a fact it states that meets the taken
    candidate's rules-out condition, or a remedy it says was already tried; a reply whose reading
    their words have not settled — after a short round, whether it takes the line shown, gives more
    of the situation, or is their own wording of what is stuck. Where a turn is owed, no answer
    closes, and the next round serves it. -/
axiom Owed : Context P → Prop

/-- Once it has run, the person can say what is stuck right now — one shown candidate, their own
    rewording, or none of those shown — having seen what in the situation each candidate rests on,
    what would rule it out, and what taking it would let them say.
    `RecognizedSituation`, emitted as session text: the person's answer, the candidates the round
    it answered offered — one or none after a short round, where no comparison is claimed — your
    contrary grounds it closed over, and the turn that recognized it. -/
structure RecognizedSituation (P : Type) where
  context      : Context P
  answer       : Answer
  shown        : List Candidate
  dissent      : List String
  recognizedAt : Nat

/-- The move a recognition takes with it: taking a shown candidate whose line showed a skill, with
    its run, takes that skill's invocation; a declined run, a rewording, and `noneShown` carry
    none. It claims no fit beyond the person's recognition. -/
def nextMove : Answer → Option CatalogEntry
  | .shown k true => k.skill
  | _             => none

inductive Outcome (P : Type)
  | notActivated (c : Context P)
  /-- the person recognized their situation — a shown candidate, their own words, or none of
      those shown -/
  | recognized (r : RecognizedSituation P)
  | holding (c : Context P)

/-! ── MODE STATE ──
Λ is the fused context, and the catalog is the run's parameter, read once at start; every reading
above is taken from these. No phase, count, or set of candidates set aside is stored.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
The catalog is read once at start [Tool]. A pass appends what `gathered` reads [Tool]; `respond`
presents one round from the context it leaves; `session` answers an utterance `Reaches` does not
hold of. Each utterance is fused; where `Reaches` holds and no turn of the person's is owed, a
recognition closes, and anything else `Reaches` holds of is read by the next pass.
-/

/-- **Your collection** for one pass. The situation is the current session, and the files and
    records the person pointed at in it are read in the pass; a read beyond them — earlier
    sessions, or files and records they have not pointed at — is offered in a round with what it
    would read, and runs only once a person's turn admits it. What the context already holds from
    a read is not read again unless an utterance or evidence says it changed. Each read returns as
    an evidence turn; nothing is written. -/
axiom gathered : Context P → List (Evidence P)

def pass (c : Context P) : Context P := c ++ (gathered c).map (·.val)

open Classical in
/-- The person's recognition, read from the latest utterance against the round before it: a
    shown candidate only where that round offered it, `noneShown` only where a round offered
    candidates, and the person's own words in any case. -/
def closing (catalog : Catalog) (c : Context P) : Option (RecognizedSituation P) :=
  let shown := shownIn catalog c
  match answer c with
  | .open_ _ => none
  | .filled a s _ _ =>
    if s.idx + 1 = c.length then
      match a with
      | .shown k b =>
        if k ∈ shown then
          some ⟨c, .shown k b, shown, dissent c, s.idx⟩
        else none
      | .noneShown =>
        if shown = [] then none
        else some ⟨c, .noneShown, shown, dissent c, s.idx⟩
      | .reworded t => some ⟨c, .reworded t, shown, dissent c, s.idx⟩
    else none

open Classical in
/-- `respond` presents the round a pass leaves, as a horizon the person may take, reword, or set
    aside, never as the answer. Where the ground carries two or more candidates, drawn from
    different readings of the situation: each line its candidate's description of the situation,
    then what it rests on, each ground with the turn it cites, then the condition that would rule it
    out, then the skill that takes it, saying that taking the candidate runs that skill, and that
    skill's declared end where its description declares one — after the evidence, never as evidence
    of fit, and reading "as above" on a later line with the same skill. Each line's grounds are
    given with the same care and specificity, and nothing in the layout favors one line. Where it
    carries one: that line, laid out as any line is, saying the ground carries no second; where it
    carries none: say so; either way, what more of the situation would help. Every round shows the
    contrary grounds you hold, what a turn of the person's is owed for where one is owed, and,
    wherever one would help, the read beyond the session `gathered` would offer, with what it would
    read; then the turn yields to a free answer — a candidate, their own words, none of these, or
    more of the situation — with no option list. A question about the shown candidates, and a round
    serving an owed turn, keep that round's candidates as they were shown beside what is answered or
    owed; they are redrawn only where the ground moved for another reason, and a candidate the
    person said is not theirs is drawn again only on new ground. Throughout, the wording is
    tentative and speaks of fit. -/
def probe (catalog : Catalog) (respond : Catalog → Context P → Response P)
    (session : Context P → Response P) : Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let c' := fuse c u
    if ¬ Reaches c' then probe catalog respond session (c' ++ [(session c').val]) us
    else
      match (if Owed c' then none else closing catalog c') with
      | some r => .recognized r
      | none =>
        let c₁ := pass c'
        probe catalog respond session (c₁ ++ [(respond catalog c₁).val]) us

open Classical in
def start (catalog : Catalog) (respond : Catalog → Context P → Response P)
    (session : Context P → Response P) (c : Context P) (us : List (Utterance P)) : Outcome P :=
  if Activated c then
    let c₁ := pass c
    probe catalog respond session (c₁ ++ [(respond catalog c₁).val]) us
  else .notActivated c

/-! ── LOOP ──
The loop is dialogue: each round ends where the turn yields, and nothing counts down. Every
utterance `Reaches` holds of that closes nothing is read whole by the next pass — a narrower
slice of the situation, a correction, a candidate set aside, a question, a read beyond the session
admitted, a turn that was owed — and the pass reads the situation again on the context as it now
stands. No number of rounds ends the probe; the person's recognition does, and without it the
round holds.
-/

/-! ── CONVERGENCE ──
recognized: the person's turn took a shown candidate, put the situation in their own words, or
said none shown is theirs; the RecognizedSituation carries the answer, what the round it answered
offered, the contrary grounds it closed over, and which turn recognized it — quoted in the trace
with the intent taken from it. What it hands off is `invokedBy`'s.
Convergence evidence: (UserSituation → [rounds] → Candidates(grounds, rules-out, ends) →
recognition → RecognizedSituation). Demonstrated, not asserted.
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

inductive Op | detect | catalog | gather | draw | present | short | readTurn | converge | invoke

def grounding : Op → Annot × String
  | .detect   => (.sense, "Internal analysis: whether the person senses something is off without naming what is stuck; an invocation of their own activates without it")
  | .catalog  => (.observe, "artifact read, once at start: the descriptions of the installed skills other than this probe's own, as the session lists them, read where they are installed when the listing does not carry one; read-only")
  | .gather   => (.observe, "artifact read, record read: what the person pointed at in the session, and reads beyond it a person's turn admitted; read-only")
  | .draw     => (.sense, "Internal analysis: candidates drawn from different readings of the situation, each grounded in turns it cites, with the condition that would rule it out and the skill from the catalog that takes it")
  | .present  => (.interaction .constitution, "two or more candidates, each line with its description, cited grounds, rules-out condition, and skill with its declared end, as `respond` lays them out; your contrary grounds; a free answer, with no option list and no ranking")
  | .short    => (.interaction .constitution, "the ground carries fewer than two candidates: said as such, with the one line it carries, if any, as `respond` lays it out, and what more of the situation would help")
  | .readTurn => (.sense, "Internal analysis: whether the latest utterance bears on this run, as `Reaches` reads it, whether a turn of the person's is still owed, as `Owed` reads it, and what it does there — a shown candidate taken, with or without its run, the person's own words, none shown, or more of the situation — read whole against the fused context")
  | .converge => (.interaction .extension, "RecognizedSituation: the answer with the turn that gave it quoted, what the round it answered offered, and the contrary grounds it closed over")
  | .invoke   => (.dispatch, "invoke: after the trace, in the same turn, the skill nextMove names, unless the person's turn already invoked it, with the recognized situation in the session; then this run ends")

/-- The operation a run hands off through: a recognition whose `nextMove` names a skill invokes it
    by `.invoke`; any other outcome hands nothing off. -/
def invokedBy : Outcome P → Option Op
  | .recognized r => (nextMove r.answer).map fun _ => .invoke
  | _             => none

/-! ── COMPOSITION ──
The recognized situation stays in the session as text for whatever runs next to read. The one
hand-off is `invokedBy`'s, to a skill the catalog held and the person's taking carried; no other
contract is named here.
-/

end

end Probe
```

## Mode Activation

`/probe` is directly invocable, and an invocation of the person's own always activates; how it stands to an earlier run is as `Reaches` states. With no situation recoverable from the context, the first round is the short one, asking for more of it. Unsolicited, it surfaces only on what `DeficitUnrecognized` reads. Skip unsolicited surfacing when the person wants a recommendation drawn from their session history with a trial run (`/onboard`).

## Distinction from /onboard

| Skill | Stance | Input | Output |
|-------|--------|-------|--------|
| `/onboard` | Pattern-based recommendation + optional trial | Session history patterns | Recommended protocol + scenario + trial |
| `/probe` | Grounded candidates for what is stuck, recognized by the user | Current user situation | The situation the user recognizes — a shown candidate, their own words, or none shown |

The two coexist; neither replaces the other.

## Rules

- **The person recognizes**: As `closing`, `AnswerSupported`, and `Owed` state.
- **Contrary grounds before the close**: As `Owed` and `respond` state.
- **Symmetric, unranked candidates**: As `Line`, `Presentation`, and `respond` state.
- **A taken candidate takes its shown skill**: As `nextMove` and the `invoke` grounding state.
- **Reads beyond the session**: As `gathered` states.
- **The running probe is no candidate**: As `Catalog` and the `catalog` grounding state.
- **Each probe stands alone**: Nothing of a probe — a fit rate, a tally, a candidate set aside — is kept to score, rank, or filter a later one, and no round counts its progress. What a later probe knows of an earlier one is what the session's context holds.
