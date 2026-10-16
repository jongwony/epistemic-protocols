---
name: recollect
description: "The user vaguely recalls a past discussion, line of work, topic, or settled concept but cannot name it: find it in past records to recognize in a story, knowing it took place, not that it still holds."
---

# Anamnesis Protocol

Find the past the user is reaching for in the records it left and tell it as a story on records they can reopen, until they recognize it — knowing it took place, not that it still holds. Type: `(RecallAmbiguous, AI, RECOGNIZE, VagueRecall) → RecalledContext`.

## Definition

**Anamnesis** (ἀνάμνησις): A dialogical act of resolving vague recall into recognized context. The person holds an empty intention toward a past they cannot name — a conversation, or a line of work, a topic, or a settled concept spread across several. AI reads what they reach for out of their words and the accumulated context, searches the records the past work left along the axes the cue offers, opens each candidate's own record at the span the cue reaches, and tells what those records carry with their sources, so the person can recognize it. An index's gist wakes recall; the opened record is the evidence; the act that makes a RecalledContext is the person's identification. Recognition over retrieval, grounded in the record rather than in the index.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract.
-/

/-! ── FLOW ──
Anamnesis(V) → start(c) → recollect(c, utterances), where c is the fused session context:
  [no empty intention, and the person did not invoke this]  relay the finding → proceed, not activated
  [the latest utterance identifies what a carried-over recall presented]  close: identified
  pass(c): read the cue — the past the person reaches for, the whole they mean, the axes it can be
    reached along; run every search still worth running — past the boundary the context has
    established too, never into an extension the person declined; open each member of the leading
    recognizable at the span the cue reaches; what each read returned enters the context → record
    the pass
  [a recognizable whose story rests on opened records]         present it
  [nothing to present ∧ nothing yet added to the cue]          one open question
  [nothing to present ∧ a search past the boundary is worth offering]  the expansion question
  [nothing to present ∧ nothing further worth reaching for]    close: unresolved within the scope searched
  next utterance u: c' := fuse(c, u) →
    [u takes the presented recognizable as the past they meant]  close: identified
    [u reaches a recall other than this one (Elsewhere)]          hold, the turn kept — holdReply
    [u bears on this recall (Reaches)]                            pass(c') → round → the same reading
    [otherwise — other work, or words that end the recall]       the session answers it; no pass runs; the recall stays as it stood
  no utterance: the round holds; nothing is identified and nothing closes
-/

/-! ── MORPHISM ──
VagueRecall
  → detect(empty_intention)        -- the person points at a past they cannot name; an invocation of their own activates on its own
  → cue(meant, whole, axes)        -- what past, at which whole, along which axes: read from the utterance and the fused context, afresh on every utterance
  → find(records, cue)             -- the records the past work left that may bear the cue, within the boundary the context has established, or past it, never into an extension the person declined
  → ground(recognizable)           -- open each member's own record at the span the cue reaches; the story is composed from what those records carry
  → present(recognizable)          -- as The presentation lays it out
  → identify(recognizable, person) -- synthesis of identification (Husserl CM §18) fulfilling the empty horizon (CM §19): the person's observable act, never inferred from silence
  → emit(RecalledContext)          -- the identified recognizable with its story, excerpts, locators, qualifications, the scope searched, and the doubts that stood, as session text
  → RecalledContext
requires: empty_intention(V) ∨ invoked(V)   -- runtime checkpoint, read by `start` before the first pass
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

/-- The whole the person means. A single record may be a whole, and several may be one. A recall
    matching none of the named wholes is named as it comes. -/
inductive Whole
  /-- one conversation -/
  | session
  /-- a succession of work across records -/
  | line
  /-- pieces worked out on one subject -/
  | topic
  /-- a settled idea; recognized only where a record carries it as settled -/
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

/-- **Your judgment**: this recall's recognizables, best first — records joined into the cue's
    whole where several make one, by relations the records support. A method that computes groups
    may propose them; the judgment decides. The order decides only which one is opened first.
    A candidate the person rejected for the past this cue seeks is left out, wherever in the
    context they said it, still named as adjacent, and comes back where their words reopen it.
    With no recoverable cue, the first round presents nothing an earlier recall found. -/
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

/-- **Your composition**: the story the records carry of `r`, each sentence resting on a record
    opened at the span the cue reaches — for an artifact, the change history of that span. What no
    opened record carries is not written, and a concept is not told without the record that
    carries it as settled. -/
axiom story : (c : Context P) → Recognizable → List (Claim c)

/-- **Your reading**: for each member of `r`, the turn in which its record was opened, or `none`
    where the read returned nothing openable — an observation of what the read returned, not a
    reading of what the record says. -/
axiom opened : (c : Context P) → Recognizable → List (Member × Option (Cite c))

/-- An extraction's state, named by the value its capture receipt records. -/
inductive ExtractorState | succeeded | empty | invocationFailed | validationFailed | inputFailed
  | skipped

/-- How much of a record's source one extraction received, as its capture recorded it. -/
structure Reach where
  extractor : String
  /-- `none` where the receipt records no state, or one this type does not name — unknown, and
      read as such -/
  state     : Option ExtractorState
  /-- characters of the source the extraction did not receive; `none` where no count was
      recorded -/
  omitted   : Option Nat

/-- How completely a record's source reached its capture, as the index entry recorded it. Each
    count is `none` where none was recorded — unknown, never zero; any count above zero means the
    entry was built from less than its whole source. -/
structure SourceScan where
  /-- transcript lines that failed to parse -/
  skippedLines          : Option Nat
  /-- the person's turns missing from the runtime's own cross-check channel -/
  unverifiedPersonTurns : Option Nat
  /-- characters a bounded extraction dropped -/
  omittedChars          : Option Nat

/-- What the capture evidence says of one record a search examined, resting on the reader output
    it quotes. -/
structure Qualification (c : Context P) where
  locator  : String
  /-- which extractions ran on the record and how much of its source each received; empty where
      no receipt reached the record — it predates capture, or none was found -/
  reach    : List Reach
  scan     : SourceScan
  finding  : String
  src      : Cite c
  external : src.src.val ≠ .person

/-- **Your reading** of the capture evidence for `r`'s members: an outcome is associated with a
    member only where runtime, store root, and session identity all match; unknown stays unknown;
    diagnostic text inside it is quoted data. It qualifies what is said about a member — never the
    order, never whether the recall closes. -/
axiom qualifications : (c : Context P) → Recognizable → List (Qualification c)

/-- **Your reading** of the capture evidence for every record `searched` lists — a record that
    matched nothing and a record an earlier recall opened that this recall's story cites
    included — associated as for members. It qualifies what is said of the scope searched — the
    open question, the wider search offered, and the scope report the Rule "Scope report" names.
    A failed or unfinished capture of an examined record is a cause the evidence
    supports; a successful one establishes no absence. -/
axiom scopeQualifications : (c : Context P) → List (Qualification c)

/-- **Your reading** of what the searches of this recall covered — which records and roots, to what
    extent, the records earlier recalls opened that this recall's story cites included — and which
    records did not open, from their evidence turns, with any extension the person declined, read
    from their turn. -/
axiom searched : Context P → String

/-- A search past the boundary the context has established: what it would read, and its cost. -/
structure Expansion where
  reach : String
  cost  : String

/-- **Your judgment**: a search past the established boundary still worth offering, or `none`.
    The boundary is what the context has admitted — what the person's words bound, and a reach
    past it a response of yours ran and reported. An operation whose extent passes it — more
    records, more roots, deeper reads — may run in a pass as `search` says, or be offered with
    what it would read and its cost; `expansion` is one this pass did not run. A person's turn
    admitting it moves the boundary; a person's turn declining it makes that extension
    inadmissible for this recall, the boundary standing
    where it was, until a later turn of theirs admits it — in a recall that continues this one
    too, as V-BINDING says; continuing a recall that closed unresolved is itself the renewed effort,
    so its declined extension is offered again. A decline does not by itself end the recall; where nothing is left to present or
    offer after it, `settle`'s close follows — your non-convergence report. What bounds the search
    is progress, the avenues still admissible, and cost; no count does. -/
axiom expansion : Context P → Option Expansion

/-- **Your reading**: the person has added to the cue since this recall began — an answer, a
    correction, a place to look. Which recall this is, and what it carries over, is as V-BINDING
    says. -/
axiom AddedToCue : Context P → Prop

/-- **Your reading**: the recognizable the latest presenting round (`.present`) of this recall
    led with, read from that response — what it carries over included, as V-BINDING says; `none`
    before any, and where the person has rejected it since it was shown; one they corrected away
    from stays, and whether a later turn takes it is `AnswerSupported`'s judgment. An open question, a wider-search round, or a `session` answer leaves
    it unchanged. -/
axiom presented : Context P → Option Recognizable

/-- **Your judgment**: the cited turn takes the presented recognizable itself as the past the
    person meant — saying so, or going on with it as that past — read against the context as it
    now stands; after an ending, such a turn reopens the recall and closes it. Going on with the
    topic alone, using it hypothetically, moving on while a search is still open, and remarking
    on the presentation each take up something other than the recognizable itself. Where the
    turn's intent is unclear, it identifies nothing. Identification establishes the past meant,
    not every claim shown. -/
axiom AnswerSupported : Context P → Turn P → Unit → Prop

/-- Only the person identifies. -/
def answerCoord : Coord P Unit :=
  { admits := (·.val = .person), supports := AnswerSupported }

/-- **Your reading** of the latest utterance: `open_` where it identifies nothing. -/
axiom answer : (c : Context P) → Occ (answerCoord (P := P)) c

/-- **Your judgment**: the latest utterance bears on this recall — more cue, a correction naming an
    earlier, a narrower, or a wider past, a place to look, an admission or a decline of the wider
    search, a question about what was shown, which may give reason to read more as `search` says, a
    remark or a form instruction on what was shown, which re-renders it and adds no search, an
    invocation V-BINDING reads as continuing this recall, a bare one included. Other work bears
    where the turn also carries one of these. A turn that points at another past — a different
    matter from this recall's — bears on this recall where it also carries one of these: the pass
    takes what it carries for this recall, and the other past is left for the person to take up, as
    The presentation says; otherwise it does not bear. Words that end this recall without
    identifying anything do not bear on it, whatever else the turn says — a decline or a correction
    said with them included — and what else it says stands in its own words in the context: they are
    answered as the step `recollect` takes the turn — by the session, or within the reply
    `holdReply` names where the turn reaches another recall (`Elsewhere`) — with the scope report
    the Rule "Scope report" names; no round is drawn, the recall holds, and later turns bear on it
    only where they come back to it — a renewed cue for its past, a renewed effort to recall it, or
    an identification as `AnswerSupported` says — not where they merely mention it; your own reading
    that the person is done ends nothing. A turn that does not bear runs no search, and the recall
    stays as it stood; where the turn goes is as the step `recollect` takes it. Where a turn taken
    as other work or as ending the recall could also be read as the other, as identifying what was
    shown, or as bearing on the recall otherwise, how it was taken is shown as The presentation
    says. -/
axiom Reaches : Context P → Prop

/-- **Your reading**: the latest utterance is the person's own invocation of this protocol. -/
axiom Invoked : Context P → Prop

/-- **Your judgment**: the latest utterance carries an empty intention — a past pointed at without
    a name: a vague time, an existence claim without a locator, uncertain self-reference, visible
    recall effort — read through the skip conditions in
    Mode Activation: toward a target already resolved in this session, or one those conditions
    leave out, it is none. -/
axiom EmptyIntention : Context P → Prop

def Activated (c : Context P) : Prop := Invoked c ∨ EmptyIntention c

/-- **Your reading**, as V-BINDING reads it: the latest utterance reaches a recall other than this
    one — a fresh recall, or another held or closed one — rather than this recall. Words that bear
    on this recall and only point at another past reach this recall, the other past named as The
    presentation says. -/
axiom Elsewhere : Context P → Prop

/-- **Your record**: your doubts that `r` is the past meant, each naming what it rests on; one the
    person has answered is raised again only on new evidence. -/
axiom dissent : (c : Context P) → Recognizable → List String

/-- Once it has run, the person recognizes the past they were reaching for — a conversation, or a
    line of work, topic, or settled concept across several — in a story whose every sentence rests
    on a record they can reopen, knowing it took place, not that it still holds.
    `RecalledContext`, emitted as session text: the identified recognizable, its story, the
    qualifications that bear on its members, the scope searched, the doubts about it that stood
    before the identifying turn, and that turn. -/
structure RecalledContext (P : Type) where
  context        : Context P
  recognizable   : Recognizable
  story          : List String
  qualifications : List String
  searched       : String
  dissent        : List String
  identifiedAt   : Nat

inductive Outcome (P : Type)
  | notActivated (c : Context P)
  /-- the person identified the presented recognizable -/
  | identified (v : RecalledContext P)
  /-- nothing further was worth reaching for on your own after the person had added to the cue;
      the scope report goes with it, and no absence is claimed -/
  | unresolved (c : Context P) (searched : String) (qualifications : List String)
  /-- the recall waits: on silence, it stands as its last round left it; on a turn that reaches
      another recall (`Elsewhere`), fresh or held, it was left where it stood for that one -/
  | holding (c : Context P)

/-! ── V-BINDING ──
bind(V) = explicit_arg ∪ colocated_expr ∪ prev_user_turn   -- priority: explicit_arg > colocated_expr > prev_user_turn
  /recollect "text"   → the cue is read from "text" and the context
  "recall … topic"    → the cue is read from the text before the trigger
  /recollect (alone)  → the cue is read from the previous person turn where it points at a past; otherwise see `search`
Several vague references: bind the first and note the others.
Which recall: every invocation, bare or worded, and every word that continues an earlier recall is read from the accumulated
context for what it reaches — an earlier recall the words or the context point to, held or closed unresolved, which it
continues, or a fresh recall. Words that continue an earlier recall return to it; new cue text reads as fresh; among several
held recalls, the one the words or the context point to. A continuing recall
carries the earlier one's cue, what was added to it, what it presented, its findings, its rejections, and its declines. A
fresh recall begins at that invocation or at the empty intention that started it, and leaves the earlier one holding where it
stood — its question superseded, nothing it showed identified by it — with what the earlier one found still in the context
the new cue is read from. An invocation that identifies what was presented closes it first (`closing`) — at `start` too,
where a continuing recall carries a presentation. Inside a running recall, a turn that reaches another recall is `Elsewhere`;
an invocation read as continuing the running recall, a bare one included, is a turn of it that bears on it (`Reaches`). The
first response, a round or a close, shows the reading as The presentation says.
-/

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
A continuing start first reads whether the latest utterance identifies what the carried-over recall
presented (`closing`). A pass reads the cue, runs the searches `search` names, opens the leading recognizable's
members, and records what it found; the reads enter the context as evidence turns [Tool]. Then the
AI's own close fires, or `respond` presents one round. Each utterance is fused and read as
`recollect` takes it: it leaves the recall holding, closes it, or gets an answer — `session` or
a round — that stays in the context.
-/

/-- **Your collection** for one pass: what the cue as it now stands gives reason to read and the
    context does not already hold, or holds only from before a change the person's words or
    evidence report — a capture outcome read as unfinished is not held, so each pass reads it
    again — the searches toward the cue along its axes, within the established boundary and past it
    where a search there is worth running now — never an extension the person declined, as
    `expansion` reads a decline, the opening of each member of the leading recognizable at the span the cue reaches (for
    an artifact, the change history of that span) and, where its records do not open, of the
    candidates `found` lists in turn until one's records open or none is left, and the capture outcome of every record a search examined, one that matched
    nothing included. A remark, a form instruction, or a decline adds nothing new to read. Each
    read returns as an evidence turn; nothing is written to the records. With no recoverable cue
    nothing is worth reading, and the first round is the open question. -/
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

/-- No turn the person sent comes after the cited one. -/
def NoPersonAfter (c : Context P) (i : Nat) : Bool :=
  (c.drop (i + 1)).all (fun t => t.origin != .person)

/-- The person's close: an identification of `presented`, as `presented` reads it, by a turn no
    later person turn follows. -/
def closing (c : Context P) : Option (Outcome P) :=
  match answer c, presented c with
  | .filled _ s _ _, some r =>
    if NoPersonAfter c s.idx then
      some (.identified ⟨c, r, (story c r).map (·.text), (qualifications c r).map (·.finding),
        searched c, dissent (c.take s.idx) r, s.idx⟩)
    else none
  | _, _ => none

open Classical in
/-- The AI's own close after a pass: nothing to present, the person has already added to the cue,
    and no search past the boundary is worth offering. -/
def settle (c : Context P) : Option (Outcome P) :=
  if (leading c).isNone ∧ AddedToCue c ∧ (expansion c).isNone then
    some (.unresolved c (searched c) ((scopeQualifications c).map (·.finding)))
  else none

open Classical in
/-- After a pass: your own close where it fires; otherwise `respond` presents the round the pass
    leaves — with a leading recognizable, the presentation (`.present`); with nothing to present
    and nothing yet added to the cue, the open question (`.ask`); otherwise the wider search
    (`.expand`) — and `k` reads on. -/
def round (respond : Context P → Response P) (k : Context P → Outcome P) (c₁ : Context P) :
    Outcome P :=
  match settle c₁ with
  | some o => o
  | none => k (c₁ ++ [(respond c₁).val])

open Classical in
/-- One step per utterance: the person's identification first; a turn that reaches another recall
    leaves this one holding with the turn kept, its reply as `holdReply` names; a turn that bears on
    this recall runs a pass and a round; `session` answers the rest, words that end it included. -/
def recollect (respond session : Context P → Response P) :
    Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let c' := fuse c u
    match closing c' with
    | some o => o
    | none =>
      if Elsewhere c' then .holding c'
      else if Reaches c' then round respond (fun d => recollect respond session d us) (pass c')
      else recollect respond session (c' ++ [(session c').val]) us

open Classical in
def start (respond session : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  if Activated c then
    match closing c with
    | some o => o
    | none => round respond (fun d => recollect respond session d us) (pass c)
  else .notActivated c

/-! ── LOOP ──
The loop is dialogue, and nothing counts down. Each utterance is read as the step `recollect`
reads it; where that reading reaches a pass, the pass reads what the cue as it then stands gives
reason to read. A correction is new ground, so no number of them ends the recall. The recall
closes on the person's identification, or where the evidence leaves nothing further worth reaching
for; it is left holding where it stood on a turn that reaches another recall (`Elsewhere`), fresh
or held, with the reply `holdReply` names.
-/

/-! ── CONVERGENCE ──
Every close is read where it fires. identified: the person's turn took the presented recognizable
as the past they meant; the RecalledContext carries the story, each sentence resting on an opened
record, the qualifications, the scope searched, the doubts that stood, and which turn identified
it — quoted in the trace with the intent taken from it. unresolved: after the person had added to
the cue, nothing was left worth reaching for on your own; the scope report the Rule "Scope
report" names goes with it. An ending is not a close: the recall holds (`Reaches`); nor is the
hold on a turn that reaches another recall, fresh or held, which leaves this recall where it stood.
Convergence evidence: (VagueRecall → [cues] → Recognizable(story on opened records) →
identification → RecalledContext), or the scope searched and what did not open. Demonstrated, not
asserted.
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

inductive Op | detect | relayNotActivated | cue | search | group | ground | qualify | ask | expand
             | present | readTurn | resolve | unresolved | holdReply | converge

def grounding : Op → Annot × String
  | .detect            => (.sense, "Internal analysis: whether the latest utterance carries an empty intention; an invocation of the person's own activates without one")
  | .relayNotActivated => (.interaction .extension, "with no empty intention and no invocation, the finding with its reasoning; proceed without activation")
  | .cue               => (.sense, "Internal analysis: the past meant, the whole, and the axes it can be reached along, read from the utterance and the fused context afresh every pass")
  | .search            => (.observe, "artifact read, artifact search: the records the past work left that may bear the cue, along its axes, within the boundary the context has established and past it as `search` says, and each member of the leading recognizable opened at the span the cue reaches — for an artifact, the change history of that span; where each runtime keeps its conversations is bound by its realization reference; read-only")
  | .group             => (.sense, "Internal analysis: found records joined into the cue's whole by relations the records support, and ordered; a method that computes groups may propose, and the judgment decides")
  | .ground            => (.sense, "Internal analysis: the story composed from the opened records, one supported claim per sentence, each speaker kept as the record names it")
  | .qualify           => (.observe, "artifact read, environment run: the capture outcome for every record the searches examined, one that matched nothing included, associated by runtime, store root, and session identity, per the capture-outcome reference; read-only")
  | .ask               => (.interaction .extension, "with nothing to present and nothing yet added to the cue, what was searched with the capture evidence of the records examined, then one open question asking for more of what the person remembers")
  | .expand            => (.interaction .extension, "what was searched so far, which records did not open, and the capture evidence of the records examined, then the wider search with what it would read and its cost, against declining it as `expansion` reads a decline, apart from ending the recall")
  | .present           => (.interaction .extension, "the round with a leading recognizable, as The presentation in the Protocol section lays it out")
  | .readTurn          => (.sense, "Internal analysis: the latest utterance read whole against the fused context, as `recollect` reads it")
  | .resolve           => (.interaction .extension, "on identification, RecalledContext — the story, the excerpts with locators and handles, the qualifications, the scope searched, the doubts that stood, the identifying turn quoted, and the currency caveat")
  | .unresolved        => (.interaction .extension, "on an unresolved close, and in the session's answer to words that end this recall (`Reaches`), the scope report the Rule \"Scope report\" names")
  | .holdReply         => (.interaction .extension, "on the step's hold branch only (`Elsewhere`): that this recall was left where it stood, and which recall the turn was read as reaching, as The presentation says; where the turn also ended this recall, the scope report the Rule \"Scope report\" names")
  | .converge          => (.interaction .extension, "the convergence trace from the first cue through each correction to the close")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Recall resolution emergent via session context.
-/

end

end Anamnesis
```

## Mode Activation

`/recollect` remains directly invocable, and an invocation of the person's own always activates; with no recoverable target, see `search`. During AI-guided activation, loaded safety boundaries, capability restrictions, and explicit user instructions continue to bind.

### Activation heuristics and exceptions

Treat vague temporal references, existence claims without a locator, uncertain self-reference, failed recall, and visible recall effort as evidence of empty intention rather than hard gates. A recall that names a whole line of work, topic, or settled concept across sessions is empty intention at a higher granularity, not a different deficit. Prior recall indices may seed the search but never constitute recognition.

Skip AI-guided activation when the person gives an exact reference, the same target is already resolved in this session, the request seeks new information, or the person declines recall assistance. AI-guided activation reads the latest utterance; while a recall holds, whether a turn starts another is as the step `recollect` takes it, and a turn that closes this recall may also start another in the same reply.

## Protocol

### Reference loading

Before searching a runtime's conversation records, read its realization reference (`references/claude.md` or `references/codex.md`): where the records live, how a record identifies its session and its speakers, and how to reopen or resume it. Before reading capture outcomes — for the members presented and for every record a search examined, one that matched nothing included — read `references/capture-outcome.md`. When the whole the person means stands above one record — a line of work, a topic, or a settled concept spread across several — read `references/supra-session.md` before joining records into it. When a member is a fork, lacks a recorded working directory, or names a directory no longer on disk, read `references/fork-resume.md` before emitting its handle. When a known failure mode is suspected, read `references/failure-modes.md` before acting on it.

### Where to look

The records the past work left are wherever it left them: its conversations, the artifacts it changed and their change history, the decisions it recorded. Read from the cue the axes it can be reached along — a time, a person, an artifact, an identifier, a coined term — and follow them. Start from the current configuration's records; when the recall points at another root — a record names it, the records here begin after the time the cue names, or the person says so — search there too, and say which roots were searched.

### The presentation

With a leading recognizable, the round carries its story, each claim with the record it rests on and that record's handle; the particulars from the opened records that tell this past apart, and your doubts that it is the past meant (`dissent` of it); each member located in time from what its record says of when the work took place, leaving the time unknown where nothing says it, and named by its root and, for a conversation, the runtime that keeps it; the members whose records did not open; the adjacent candidates named so a correction can point at them; the members' qualifications; and that recall establishes that the past took place and not that it still holds — with no option list.

In the wider-search round, for a whole above one record, what was searched includes the relations that led nowhere.

In every response to a turn of this recall or one that leaves it — a round of any kind, a close, the session's answer, or the hold reply — where the intent of that turn was unclear, say in one line how you took it. The first response to an invocation, or to words that continue an earlier recall — a round or a close — says which recall it read them as reaching, continuing which or fresh, with the basis, as your reading the person can correct. In any round, a question the person asked about what was shown is answered in the round from the records opened, reading more where the question needs it as `search` says, without re-presenting what is unchanged. Other work the same turn asks for is carried out in the same reply, whatever closes or answers the turn. Where a turn that bears on this recall also points at another past, the round names that past for the person to take up. Where the step `recollect` holds this recall on a turn, the reply carries what `holdReply` names.

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
- **Narrative recognition**: Present a candidate as a story that makes its identity recognizable, in the records' words — not a result list and not an index's paraphrase — carrying what The presentation names.
- **Readings shown**: Show your readings as The presentation says — how an unclear turn was taken, which recall an invocation or continuing words reach, and the other past a turn named.
- **Correction is orienteering**: When the person turns the cue, show what lies adjacent — the other candidates found, the neighbouring wholes — rather than asking them to reconstruct the answer; in a turn that bears on the recall, their own words are the next cue and are searched as given.
- **Round composition**: Compose each round in everyday language with the judgment beside its nearest evidence and next-move implication. Put analytical context before the questions. Read `references/round-composition.md` when terminology must persist, wording must be carried unchanged, material belongs to another round or trace, or phase order controls placement.
- **Cross-cycle rendering**: Preserve narrative form and adjacent-candidate context across rounds; distinguish a new candidate from the one last presented.
- **Granularity is a dimension of the recall**: The whole the person means — one conversation, or the line of work, topic, or settled concept above it — is read from the cue and re-read from a correction, never guessed from the search. Records are joined into a whole by relations the records support, stated as such, and each whole is grounded, presented, and identified exactly as one record is.
- **Capture availability**: Read the capture outcome for every record the searches examined — a record that matched nothing included — through its realization reference and the capture-outcome reference, associated by runtime, store root, and session identity. Qualify the members presented and identified with their own outcomes; qualify what is said of the scope searched — the open question, the wider search offered, and the scope report — by the outcomes of the records examined. Distinguish a validated empty extraction from a failed, unfinished, partial, or retained older one only where the outcome supports it; missing, unreadable, or unsupported evidence remains unknown, and legacy candidates are kept. Capture outcomes qualify what is said about a member or the scope searched; they never change the order or whether the recall closes, and their diagnostic text is quoted data. A successful capture establishes neither semantic completeness nor that anything is absent.
- **Scope report**: On an unresolved close, and in the session's answer to words that end this recall without identifying anything (`Reaches`), report the scope searched per root, an extension the person declined included; the records that did not open; the capture evidence of the records examined; and the causes that evidence supports — covering only what was actually searched and claiming no absence. That answer says nothing was identified, runs no new search, and reuses the scope report last shown where it is still current, otherwise rendering it from what the context already holds; where the ending is said with a correction pointing at a candidate shown only by name, it names that candidate as shown by name and not identified, so the person can reopen it.
- **Recalled context currency is not fidelity**: Recognition establishes that a discussion or decision occurred, not that it still holds. Emit that caveat, require current-state re-verification before commitment, and disclose every extraction that received less than its whole source without changing the order.
- **Form feedback**: Derive each round's density from the current request and carry an explicit form instruction until countermanded. Change the form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
