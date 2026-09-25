---
name: recollect
description: "Resolve vague recall into recognized context through AI-guided contextual scan and user-validated recognition — one session, or the line of work, topic, or settled concept spread across several."
---

# Anamnesis Protocol

Resolve vague recall into recognized context through AI-guided contextual scan and user-validated recognition. Type: `(RecallAmbiguous, AI, RECOGNIZE, VagueRecall) → RecalledContext`.

## Definition

**Anamnesis** (ἀνάμνησις): A dialogical act of resolving vague recall into recognized context. The person holds an empty intention toward a past they cannot name — a conversation, or a line of work, a topic, or a settled concept spread across several. AI reads what they reach for out of their words and the accumulated context, searches the records the past work left along the axes the cue offers, opens each candidate's own record at the span the cue reaches, and tells what those records carry with their sources, so the person can recognize it. An index's gist wakes recall; the opened record is the evidence; the act that makes a RecalledContext is the person's identification. Recognition over retrieval, grounded in the record rather than in the index.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract. A
`theorem` line inside a doc comment states a consequence the contract already has; it is proved
outside this block and asks nothing further of you.
-/

/-! ── FLOW ──
Anamnesis(V) → start(c) → recollect(c, utterances), where c is the fused session context:
  [no empty intention, and the person did not invoke this]  relay the finding → proceed, not activated
  pass(c): read the cue — the past the person reaches for, the whole they mean, the axes it can be
    reached along; run every search still worth running within the boundary the context has
    established; open each member of the leading recognizable at the span the cue reaches; what
    each read returned enters the context → record the pass
  [a recognizable whose story rests on opened records]         present it → Stop
  [nothing to present ∧ nothing yet added to the cue]          one open question → Stop
  [nothing to present ∧ a search past the boundary is worth offering]  the expansion question → Stop
  [nothing to present ∧ nothing further worth reaching for]    close: unresolved within the scope searched
  next utterance u: c' := fuse(c, u) →
    [u takes the presented recognizable as the past they meant]  close: identified
    [u ends the recall]                                          close: stopped
    [otherwise] u is more cue, a correction, a place to look, or a wider boundary → pass(c') → the same reading
  no utterance: the round holds; nothing is identified and nothing closes
-/

/-! ── MORPHISM ──
VagueRecall
  → detect(empty_intention)        -- the person points at a past they cannot name; an invocation of their own activates on its own
  → cue(meant, whole, axes)        -- what past, at which whole, along which axes: read from the utterance and the fused context, afresh on every utterance
  → find(records, cue)             -- the records the past work left that may bear the cue, within the boundary the context has established
  → ground(recognizable)           -- open each member's own record at the span the cue reaches; the story is composed from what those records carry
  → present(recognizable)          -- the story, each excerpt beside where it is and how to reopen it, the qualifications; the turn yields
  → identify(recognizable, person) -- synthesis of identification (Husserl CM §18) fulfilling the empty horizon (CM §19): the person's observable act, never inferred from silence
  → emit(RecalledContext)          -- the identified recognizable with its story, excerpts, locators, qualifications, and the scope searched, as session text
  → RecalledContext
requires: empty_intention(V) ∨ invoked(V)   -- runtime checkpoint (Phase 0)
deficit:  RecallAmbiguous                    -- activation precondition (Layer 1/2)
preserves: the records searched              -- recall reads them and writes none; the context only grows
invariant: Recognition over Retrieval
invariant: the person identifies; opened records support what is presented; an index's gist is a cue and supports nothing
-/

namespace Anamnesis

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

/-!
theorem fuse_extends {P : Type} (c : Context P) (u : Utterance P) :
    ∃ t, fuse c u = c ++ t

theorem cited_not_assistant {P : Type} {c : Context P} (s : Cite c) :
    (c[s.idx]'s.lt).origin ≠ .assistant

theorem cited_not_injected {P : Type} {c : Context P} (s : Cite c) :
    (c[s.idx]'s.lt).origin ≠ .injected
-/

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

/-- `V`: a vague recall — the person's utterance and the context it stands in, pointing at a past
    they cannot name. What they mean is read from it, never stored beside it. -/
abbrev VagueRecall (P : Type) := Context P

/-- The whole the person means; its shape is the shape the story takes. A single record may be a
    whole, and several may be one. A recall matching none of the named shapes is named as it
    comes. -/
inductive Whole
  /-- one conversation: origin → direction → outcome -/
  | session
  /-- a line of work: where it began → how it developed → where it arrived -/
  | line
  /-- a topic worked out in pieces: the fragments → where the records say it last stood -/
  | topic
  /-- a settled concept: where it was forged → where it was settled; recognized only where a
      record carries it as settled -/
  | concept
  | emergent (name : String)

/-- What the person reaches for. -/
structure Cue where
  /-- the past they mean, in their words -/
  meant : String
  whole : Whole
  /-- the axes it can be reached along — a time, a person, an artifact, an identifier, a coined
      term — named from the cue; there is no fixed set -/
  axes  : List String

/-- **Your reading** of the cue from the whole context: the latest utterance and every earlier
    turn of the person's in this recall, a correction included. A correction that names a
    different whole re-reads the whole. -/
axiom cue : Context P → Cue

/-- A record the past work left and a search reached: a conversation, an artifact with its change
    history, a decision record. Named by where it is — the root it was found under included — and
    never by what kind of store holds it. -/
structure Member where
  /-- where the record is, its root included -/
  locator : String
  /-- what an index or the record's head says of it: a cue for ordering, never evidence -/
  gist    : String
  /-- how to reopen or resume it, as its realization reference validates; `none` where there is
      none -/
  handle  : Option String

/-- A candidate for what the person means: one shape at every scope. -/
structure Recognizable where
  whole    : Whole
  members  : List Member
  nonempty : members ≠ []
  /-- what joins the members, as judged, and what the records support of it; empty for one
      member -/
  joins    : String

/-- **Your judgment**: the recognizables the searches in the context found, best first — records
    joined into the cue's whole where several make one, by relations the records support. A method
    that computes groups may propose them; the judgment decides. The order decides only which one
    is opened first. -/
axiom found : Context P → List Recognizable

/-- **Your judgment**: the cited turn — a record opened — carries this claim, with its speaker as
    the record names it: a past assistant statement supports that it was said, never that the
    person decided it or that it held. An index's gist supports nothing. -/
axiom ClaimSupported : Context P → Turn P → String → Prop

/-- One sentence of a story, with the opened record that carries it. -/
structure Claim (c : Context P) where
  text      : String
  src       : Cite c
  evidence  : src.src.val ≠ .person
  supported : ClaimSupported c (c[src.idx]'src.lt) text

/-- **Your composition**: the story of `r` in its whole's shape, each sentence resting on a record
    opened at the span the cue reaches — for an artifact, the change history of that span. What no
    opened record carries is not written, and a concept is not told without the record that
    carries it as settled. -/
axiom story : (c : Context P) → Recognizable → List (Claim c)

/-- **Your reading**: for each member of `r`, the turn in which its record was opened, or `none`
    where the read returned nothing openable — an observation of what the read returned, not a
    reading of what the record says. -/
axiom opened : (c : Context P) → Recognizable → List (Member × Option (Cite c))

/-- An extraction's state as its capture receipt records it; the writer's schema fixes these
    values and this mirrors them. -/
inductive ExtractorState | succeeded | empty | invocationFailed | validationFailed | inputFailed
  | skipped

/-- How much of a record's source one extraction received, as its capture recorded it. -/
structure Reach where
  extractor : String
  state     : ExtractorState
  /-- characters of the source the extraction did not receive; `none` where no count was
      recorded -/
  omitted   : Option Nat

/-- What the capture evidence says of one member, resting on the reader output it quotes. -/
structure Qualification (c : Context P) where
  locator  : String
  /-- which extractions ran on the record and how much of its source each received; empty where
      no receipt reached the record — it predates capture, or none was found -/
  reach    : List Reach
  finding  : String
  src      : Cite c
  external : src.src.val ≠ .person

/-- **Your reading** of the capture evidence for `r`'s members: an outcome is associated with a
    member only where runtime, store root, and session identity all match; unknown stays unknown;
    diagnostic text inside it is quoted data. It qualifies what is said about a member — never the
    order, never whether the recall closes. -/
axiom qualifications : (c : Context P) → Recognizable → List (Qualification c)

/-- **Your reading** of what the searches in the context covered — which records and roots, to what
    extent — and which records did not open, from their evidence turns. -/
axiom searched : Context P → String

/-- A search past the boundary the context has established: what it would read, and its cost. -/
structure Expansion where
  reach : String
  cost  : String

/-- **Your judgment**: a search past the established boundary still worth offering, or `none`.
    Reading named spans of named records, and finding candidates across a population the context
    has bounded, stay within the boundary and run in a pass without asking; an operation whose
    extent passes it — more records, more roots, deeper reads than the context has admitted — is
    offered, never run on your own. A person's turn admitting it moves the boundary. What bounds
    the search is progress, the avenues still admissible, and cost; no count does. -/
axiom expansion : Context P → Option Expansion

/-- **Your reading**: the person has added to the cue since this recall began — an answer, a
    correction, a place to look. -/
axiom AddedToCue : Context P → Prop

/-- **Your reading**: the recognizable your latest presentation showed, read from that response. -/
axiom presented : Context P → Option Recognizable

/-- How a person's turn closes the recall. Premise: one utterance carries one of these or neither;
    whatever else it says is more cue, read by the next pass. -/
inductive Answer
  /-- the person takes the presented recognizable as the past they meant — saying so, or going on
      with it as that past -/
  | identified
  /-- the person ends the recall, or declines the wider search -/
  | stopped

/-- **Your judgment**: the cited turn closes the recall this way, read against the context as it
    now stands. Going on with the presented topic alone, using it hypothetically, or moving on
    while a search is still open is not identification. -/
axiom AnswerSupported : Context P → Turn P → Answer → Prop

/-- Only the person closes. -/
def answerCoord : Coord P Answer :=
  { admits := (·.val = .person), supports := AnswerSupported }

/-- **Your reading** of the latest utterance: `open_` where it closes nothing. -/
axiom answer : (c : Context P) → Occ (answerCoord (P := P)) c

/-- **Your reading**: the person invoked this recall themselves. -/
axiom Invoked : Context P → Prop

/-- **Your judgment**: the context carries an empty intention — a past pointed at without a name:
    a vague time, an existence claim without a locator, uncertain self-reference, visible recall
    effort. -/
axiom EmptyIntention : Context P → Prop

def Activated (c : Context P) : Prop := Invoked c ∨ EmptyIntention c

/-- `RecalledContext`, emitted as session text: the identified recognizable, its story, the
    qualifications that bear on its members, the scope searched, and the turn that identified it.
    It establishes that the past took place, not that it still holds. -/
structure RecalledContext (P : Type) where
  context        : Context P
  recognizable   : Recognizable
  story          : List String
  qualifications : List String
  searched       : String
  identifiedAt   : Nat

inductive Outcome (P : Type)
  | notActivated (c : Context P)
  /-- the person identified the presented recognizable -/
  | identified (v : RecalledContext P)
  /-- the person ended the recall; what was searched is reported -/
  | stopped (c : Context P) (searched : String)
  /-- nothing further was worth reaching for on your own after the person had added to the cue;
      what was searched is reported, and no absence is claimed -/
  | unresolved (c : Context P) (searched : String)
  | holding (c : Context P)

/-! ── V-BINDING ──
bind(V) = explicit_arg ∪ colocated_expr ∪ prev_user_turn   -- priority: explicit_arg > colocated_expr > prev_user_turn
  /recollect "text"   → the cue is read from "text" and the context
  "recall … topic"    → the cue is read from the text before the trigger
  /recollect (alone)  → the cue is read from the previous person turn; with none recoverable, the open question comes first
Several vague references: bind the first and note the others. An invocation after a close starts a fresh recall.
-/

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
A pass reads the cue, runs the searches within the boundary, opens the leading recognizable's
members, and records what it found; the reads enter the context as evidence turns [Tool]. Then the
AI's own close fires, or `respond` presents one round. Each utterance is fused; a closing answer
closes, and anything else is read by the next pass.
-/

/-- **Your collection** for one pass: every search within the established boundary still worth
    running toward the cue, along its axes, and the opening of each member of the leading
    recognizable at the span the cue reaches — the change history of that span, for an artifact —
    and the capture outcome for each member. Each read returns as an evidence turn; nothing is
    written to the records. -/
axiom search : Context P → List (Evidence P)

/-- **Your record** of a pass: what was found, opened, and qualified, and the scope searched. A
    record grounds nothing. -/
axiom passRecord : Context P → List (Response P)

def pass (c : Context P) : Context P :=
  let c₁ := c ++ (search c).map (·.val)
  c₁ ++ (passRecord c₁).map (·.val)

/-- The recognizable a pass leads with: the first found whose story rests on at least one opened
    record. -/
def leading (c : Context P) : Option Recognizable :=
  (found c).find? (fun r => !(story c r).isEmpty)

/-- The person's close, read from the latest utterance. -/
def closing (c : Context P) : Option (Outcome P) :=
  match answer c, presented c with
  | .filled .identified s _ _, some r =>
    some (.identified ⟨c, r, (story c r).map (·.text), (qualifications c r).map (·.finding),
      searched c, s.idx⟩)
  | .filled .stopped _ _ _, _ => some (.stopped c (searched c))
  | _, _ => none

open Classical in
/-- The AI's own close after a pass: nothing to present, the person has already added to the cue,
    and no search past the boundary is worth offering. -/
def settle (c : Context P) : Option (Outcome P) :=
  if (leading c).isNone ∧ AddedToCue c ∧ (expansion c).isNone then
    some (.unresolved c (searched c))
  else none

/-- `respond` presents the round the pass leaves. With a leading recognizable: its story in the
    whole's shape, each excerpt beside its locator and handle, the adjacent candidates named in a
    phrase each, the members' qualifications, and that recall establishes that the past took place
    and not that it still holds — then the turn yields, with no option list. With nothing to
    present and nothing yet added to the cue: what was searched, then one open question — what
    else do you remember? Otherwise: what was searched so far and which records did not open, then
    the wider search with what it would read and its cost, against stopping here. -/
def recollect (respond : Context P → Response P) :
    Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let c' := fuse c u
    match closing c' with
    | some o => o
    | none =>
      let c₁ := pass c'
      match settle c₁ with
      | some o => o
      | none => recollect respond (c₁ ++ [(respond c₁).val]) us

open Classical in
def start (respond : Context P → Response P) (c : Context P) (us : List (Utterance P)) :
    Outcome P :=
  if Activated c then
    let c₁ := pass c
    match settle c₁ with
    | some o => o
    | none => recollect respond (c₁ ++ [(respond c₁).val]) us
  else .notActivated c

/-! ── LOOP ──
The loop is dialogue: each round ends where the turn yields, and nothing counts down. Every
utterance that closes nothing is read whole by the next pass — more cue, a correction naming an
earlier, a narrower, or a wider past, a place to look, an admission of the wider search — and the
pass re-reads the cue and searches again on the context as it now stands. A correction is new
ground, so no number of them ends the recall; the person does, or the evidence leaves nothing
further worth reaching for.
-/

/-!
Silence identifies nothing and closes nothing.
theorem silence (respond : Context P → Response P) (c : Context P) :
    recollect respond c [] = .holding c

A pass only adds to the context.
theorem pass_extends (c : Context P) : ∃ t, pass c = c ++ t

An invocation of the person's own is never refused.
theorem invocation_activates (respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (h : Invoked c) : start respond c us ≠ .notActivated c
-/

/-! ── CONVERGENCE ──
Every close is read where it fires. identified: the person's turn took the presented recognizable
as the past they meant; the RecalledContext carries the story, each sentence resting on an opened
record, the qualifications, the scope searched, and which turn identified it — quoted in the trace
with the intent taken from it. stopped: the person ended the recall; what was searched is
reported, and nothing is claimed about what lies outside it. unresolved: after the person had added
to the cue, nothing was left worth reaching for on your own; the scope searched and the records
that did not open are reported, with the causes the evidence supports, and no absence is claimed.
Convergence evidence: (VagueRecall → [cues] → Recognizable(story on opened records) →
identification → RecalledContext), or the scope searched and what did not open. Demonstrated, not
asserted.
-/

/-!
The turn a RecalledContext names as identifying it is the person's, and it supports the
identification.
theorem identified_by_person (c : Context P) (v : RecalledContext P)
    (h : closing c = some (.identified v)) :
    ∃ s : Cite c, s.idx = v.identifiedAt ∧ (c[s.idx]'s.lt).origin = .person ∧
      AnswerSupported c (c[s.idx]'s.lt) .identified

Only the person closes the recall by an answer.
theorem answer_by_person {c : Context P} {s : Cite c}
    (ok : (answerCoord (P := P)).admits s.src) : s.src.val = .person

A story sentence never rests on the assistant's own turn or on the person's say-so.
theorem claim_is_evidence {c : Context P} (k : Claim c) :
    (c[k.src.idx]'k.src.lt).origin ≠ .assistant ∧ k.src.src.val ≠ .person

The recall closes unresolved only after the person has added to the cue.
theorem unresolved_after_cue (c c' : Context P) (s : String)
    (h : settle c = some (.unresolved c' s)) : AddedToCue c
-/

/-! ── TOOL GROUNDING ── -/
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed

inductive Annot | sense | observe | track | transform | dispatch | constitution | extension

inductive Op | detect | relayNotActivated | cue | search | group | ground | qualify | ask | expand
             | present | readTurn | resolve | unresolved | converge

def grounding : Op → Annot × String
  | .detect            => (.sense, "Internal analysis: whether the context carries an empty intention; an invocation of the person's own activates without one")
  | .relayNotActivated => (.extension, "TextPresent+Proceed: with no empty intention and no invocation, the finding with its reasoning; proceed without activation")
  | .cue               => (.sense, "Internal analysis: the past meant, the whole, and the axes it can be reached along, read from the utterance and the fused context afresh every pass")
  | .search            => (.observe, "artifact read, artifact search: the records the past work left that may bear the cue, along its axes, within the boundary the context has established, and each member of the leading recognizable opened at the span the cue reaches — for an artifact, the change history of that span; where each runtime keeps its conversations is bound by its realization reference; read-only")
  | .group             => (.sense, "Internal analysis: found records joined into the cue's whole by relations the records support, and ordered; a method that computes groups may propose, and the judgment decides")
  | .ground            => (.sense, "Internal analysis: the story composed from the opened records, one supported claim per sentence, each speaker kept as the record names it")
  | .qualify           => (.observe, "artifact read, environment run: the capture outcome for each member, associated by runtime, store root, and session identity, per the capture-outcome reference; read-only")
  | .ask               => (.constitution, "present: with nothing to present and nothing yet added to the cue, what was searched, then one open question in everyday words — what else do you remember?")
  | .expand            => (.constitution, "present: what was searched so far and which records did not open, then the wider search with what it would read and its cost, against stopping here")
  | .present           => (.constitution, "present: the story in the whole's shape, each excerpt beside its locator and handle, the adjacent candidates named, the members' qualifications, and the currency caveat; no option list")
  | .readTurn          => (.sense, "Internal analysis: the latest utterance read against the fused context — an identification, a stop, or more cue: a correction, a place to look, an admission of the wider search")
  | .resolve           => (.extension, "TextPresent+Proceed: on identification, RecalledContext — the story, the excerpts with locators and handles, the qualifications, the scope searched, the identifying turn quoted, and the currency caveat")
  | .unresolved        => (.extension, "TextPresent+Proceed: on a stop or an unresolved close, the scope searched per root, the records that did not open, and the causes the evidence supports; no absence claimed")
  | .converge          => (.extension, "TextPresent+Proceed: the convergence trace from the first cue through each correction to the close")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Recall resolution emergent via session context.
-/

end

end Anamnesis
```

## Mode Activation

`/recollect` remains directly invocable, and an invocation of the person's own always activates. When it supplies no recoverable target in current or recent context, the first round is the open question. During AI-guided activation, loaded safety boundaries, capability restrictions, and explicit user instructions continue to bind.

### Activation heuristics and exceptions

Treat vague temporal references, existence claims without a locator, uncertain self-reference, failed recall, and visible recall effort as evidence of empty intention rather than hard gates. A recall that names a whole line of work, topic, or settled concept across sessions is empty intention at a higher granularity, not a different deficit. Prior recall indices may seed the search but never constitute recognition.

Skip AI-guided activation when the person gives an exact reference, the same target is already resolved in this session, the request seeks new information, or the person declines recall assistance.

## Protocol

### Reference loading

Before searching a runtime's conversation records, read its realization reference (`references/claude.md` or `references/codex.md`): where the records live, how a record identifies its session and its speakers, and how to reopen or resume it. Before qualifying members with their capture outcomes, read `references/capture-outcome.md`. When the whole the person means stands above one record — a line of work, a topic, or a settled concept spread across several — read `references/supra-session.md` before joining records into it. When a member is a fork, lacks a recorded working directory, or names a directory no longer on disk, read `references/fork-resume.md` before emitting its handle. When a known failure mode is suspected, read `references/failure-modes.md` before acting on it.

### Where to look

The records the past work left are wherever it left them: its conversations, the artifacts it changed and their change history, the decisions it recorded. Read from the cue the axes it can be reached along — a time, a person, an artifact, an identifier, a coined term — and follow them. Start from the current configuration's records; when the recall points at another root — a record names it, the records here begin after the time the cue names, or the person says so — search there too, and say which roots were searched. Reading named spans of named records and finding candidates across a population the context has bounded run without asking; a search whose extent passes that boundary is offered with its cost and run only on the person's word.

### User-facing realization

Present a recognizable as the story of the past in the records' own words, not a result-only hit and not an index's paraphrase:

- locate it in time and source, preserving the realization label and the root;
- tell it in the whole's shape — one conversation: origin, direction, outcome; a line: where it began, how it developed, where it arrived; a topic: the fragments and where the records say it last stood; a concept: where it was forged and where it settled — every sentence resting on an opened record, each speaker as the record names it;
- put each member's excerpt beside its locator and emit only the resume handle the realization reference validates; where a record could not be opened, say so rather than filling the gap from an index;
- when more than one candidate was found, name the adjacent ones in a phrase each, so a correction has something to point at;
- qualify the members' capture availability from the capture outcomes read for them;
- then yield the turn without an option list.

Read the next utterance as identification, a stop, or more cue. Identification is what the person says or does — "that's it", or going on with it as the past they meant; going on with its topic alone, using it hypothetically, or moving on while a search is still open is not identification, and silence never is. Name the turn read as identification and the intent taken from it. Anything else is more cue and is searched as given: an earlier one, a narrower one, the whole line rather than one conversation, a place to look.

Emit `RecalledContext` with the story, each member's excerpt, locator, validated resume handle, the capture qualifications that bear on the members, and the scope searched. State that recognition establishes historical identity rather than current truth. When a member's capture reports that an extraction received less than its whole source, name what was left out so downstream readers can weigh the record accordingly.

When nothing can be presented and the person has not yet added to the cue, say what was searched and ask one open question in everyday words — what else they remember — and take the answer as the next cue. After the person has added to the cue, offer a search past the boundary where one is still worth running, stating what has been searched so far — above one record including which relations led nowhere — and what the wider search would read and cost, against stopping here. When nothing further is worth reaching for, close unresolved: report the scope actually searched per root, the records that did not open, and the causes the evidence supports; claim no absence.

## Known failure modes

The names and their triggers are here so a mode is recognizable without a read. Once one is suspected, read `references/failure-modes.md` before acting: it carries each mode's cause, detection, and recovery. Emergent modes are admitted.

- **FalseAnchor** — an identifier matched, and its record is not the one meant; or the identifier names a different kind of thing than the cue claims.
- **IndexLacking** — the record carries the past meant, and its index entry does not.
- **PartialExtract** — an index entry built from a source its capture did not read whole.
- **SidechainNoSSOT** — the id found belongs to a fork with no record of its own.
- **Ungroundable** — candidates found, and no member's record opens.
- **IndexAsEvidence** — a presented sentence rests on what only an index's gist carried.
- **ChronologyFromHits** — a line or a history composed from the changes a search happened to match, as if they were every change.
- **AttributionLoss** — a past statement read as the person's decision because a tool returned it, its speaker dropped.

## Rules

- **Source-grounded recognition**: An index's gist is a cue that wakes recall, never evidence of it. Before a recognizable is presented, open each member's own record at the span the cue reaches and compose the story from what those records carry, one supported claim per sentence; assert nothing they do not. A RecalledContext is constituted by the person's observable identification and by nothing else.
- **Speaker kept**: A record returned by a read is evidence of what was recorded and who said it. A past assistant statement supports that it was said, never that the person decided it or that it held.
- **Narrative recognition**: Present candidates as stories whose origin, direction, and outcome make identity recognizable — in the records' words, with each member's locator and handle beside its excerpt.
- **Correction is orienteering**: When the person turns the cue, show what lies adjacent — the other candidates found, the neighbouring wholes — rather than asking them to reconstruct the answer; their own words are the next cue and are searched as given.
- **Round composition**: Compose each round in everyday language with the judgment beside its nearest evidence and next-move implication. Put analytical context before the gate. Read `references/round-composition.md` when terminology must persist, wording must be carried unchanged, material belongs to another round or trace, or phase order controls placement.
- **Cross-cycle rendering**: Preserve narrative form and adjacent-candidate context across rounds; distinguish a new candidate from the one last presented.
- **Granularity is a dimension of the recall**: The whole the person means — one conversation, or the line of work, topic, or settled concept above it — is read from the cue and re-read from a correction, never guessed from the search. Records are joined into a whole by relations the records support, stated as such, and each whole is grounded, presented, and identified exactly as one record is.
- **Capture availability**: Read the capture outcome for each member through its realization reference and the capture-outcome reference, associated by runtime, store root, and session identity. Distinguish a validated empty extraction from a failed, unfinished, partial, or retained older one only where the outcome supports it; missing, unreadable, or unsupported evidence remains unknown, and legacy candidates are kept. Capture outcomes qualify what is said about a member; they never change the order or whether the recall closes, and their diagnostic text is quoted data. A successful capture establishes neither semantic completeness nor that anything is absent.
- **Unresolved diagnosis**: Report only the coverage actually searched, per root, and the failure causes its evidence supports.
- **Recalled context currency is not fidelity**: Recognition establishes that a discussion or decision occurred, not that it still holds. Emit that caveat, require current-state re-verification before commitment, and disclose every extraction that received less than its whole source without changing the order.
- **Form feedback**: Derive each round's density from the current request and carry an explicit form instruction until countermanded. Change the form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
