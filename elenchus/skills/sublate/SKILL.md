---
name: sublate
description: "Vet working context by dialectical antithesis before action. Type: (ContextSuspect, User, VET, WorkingContext) → VettedContext"
---

# Elenchus Protocol

Vet working context by dialectical antithesis before action: each suspect claim is met by a concrete challenge, and the user's own answer to it is what the context carries forward, resolving suspect context into vetted context. Type: `(ContextSuspect, User, VET, WorkingContext) → VettedContext`.

## Definition

**Elenchus** (ἔλεγχος): A dialogical act of cross-examination — from the Socratic refutation tradition meaning "testing by argument" — resolving suspect working context into vetted context through provenance challenge, counterfactual gap forecasting, cross-source consistency check, and inference-fallacy archetype scan before pre-execution sync. The protocol's lexical verb is `/sublate`. Each claim the pending action leans on is stated as it stands (thesis), met by what would shake it (antithesis), and then the person says what they make of it in light of that challenge (synthesis) — the Hegelian *Aufhebung*, preserve + negate + lift up, supplies the source vocabulary. The protocol exists to help that thinking reach its synthesis; the synthesis is the person's.

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
Elenchus(W) → start(c) → sublate(c, utterances), where c is the fused session context and W, the
working context, is c itself:
  pass(c): judge afresh, against the context as it now stands and from this run's invocation on,
    which claims the pending action leans on are suspect, whose each one is, and — for each claim
    still waiting on the person — a concrete antithesis with its basis → record
  [the person stops]                                           close: stopped
  [the person goes on to a protocol they name]                 close: routed
  [nothing open ∧ the person has answered in this run]         close: vetted
  [otherwise] present the current list and what this turn changed, then every open claim with its
    antithesis and concrete actions for it — with nothing open, what was searched and what was
    found, handed on or not — → Stop
  next utterance u: c' := pass(fuse(c, u)) → the same reading, whatever u says
  no utterance: the gate holds; nothing is judged and nothing closes
-/

/-! ── MORPHISM ──
WorkingContext
  → select(claims)               -- the claims the pending action leans on that warrant a challenge; afresh every pass, the person's words about what to vet included
  → certify(claim)               -- whose it is: a suspect claim here, another deficit's, or unclear (fail-closed)
  → posit(antithesis)            -- a concrete challenge to each claim waiting on the person, with its basis
  → surface(list, changes, open) -- the current list and this turn's changes, then each open claim with its challenge and concrete actions
  → sublate(person's turn)       -- what the person makes of each claim in light of its antithesis, in their words; or that it is another deficit's; or close
  → VettedContext
requires: working_context_pre_execution_committed   -- runtime checkpoint
deficit:  ContextSuspect                            -- activation precondition (Layer 1)
preserves: every turn of the context -- the context only grows (pass_extends); an answer annotates a claim and never rewrites its source
invariant: Dialectical Vetting over Silent Trust
invariant: antithesis before synthesis -- a claim's challenge is shown before the person is asked what they make of it
invariant: the person answers and closes; the certificate alone only hands on what it places elsewhere, and says so
-/

namespace Elenchus

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

/-- `W`, `WorkingContext`: the context the pending action was committed against. Every source a
    claim rests on is a turn of it — a statement, a document or tool read, an inference, a record
    of an earlier session, the assistant's own earlier output — and it is read, never rewritten. -/
abbrev WorkingContext (P : Type) := Context P

/-- The pending action: what is about to be done, and the turns it leans on. -/
structure Prospect where
  intent  : String
  leansOn : List Nat

/-- **Your reading** of the pending action the working context was committed against. -/
axiom prospect : Context P → Prospect

/-- A claim as it stands: what it is about, its category, how far it reaches, and its wording
    verbatim — the text a challenge must confront. -/
structure ClaimRef where
  referent  : String
  claimKind : String
  scope     : String
  text      : String

/-- An observable indicator in the context bearing on a claim, with the channel it came through. -/
structure Indicator where
  channel : String
  content : String

/-- A claim under vetting: the turn that carries its source — by index, since the assistant's own
    earlier output can be a source — the claim that source is read as authority for, what makes
    it suspect, and the evidence for that. -/
structure Claim where
  source    : Nat
  claim     : ClaimRef
  suspicion : String
  evidence  : List Indicator

/-- **Your judgment**, made afresh on every pass: the claims the pending action leans on that
    warrant a challenge, read from the context as it now stands and from this run's invocation on.
    A working order that serves it: identify the sources that warrant a look — unusually
    load-bearing, older than the horizon for their origin, reached through a long provenance chain,
    in tension with another source about the same referent, or an inference used as a premise — then
    bind each to the claim it is read as authority for, and split a binding that bundles several
    distinct claims, one claim each; where the suspicion cannot be factored per claim, it was one
    claim after all. One claim standing on evidence in several places is one claim. Binding is
    total: a source whose claim you cannot settle still yields a claim, whose owner the
    certificate then finds unclear, so nothing selected is dropped silently. The person's words
    about what to vet are part of the context: a correction of the target moves it on the next
    pass. Whether a claim is the same one an earlier pass selected is your judgment too — changed
    wording alone does not make it new, and a claim that continues after a split is still that
    claim for whatever it owes. The list is the run's: a claim once selected in this run stays in
    it with whatever answered it, and a correction of the target adds what it points at beside
    the claims already there. What an earlier run or session selected is not this run's. -/
axiom claims : Context P → List Claim

/-- A deficit label. A certificate assigns only the ones this contract inscribes; the person may
    name any. -/
inductive Deficit
  /-- this contract's own: a suspect claim in the working context -/
  | contextSuspect
  /-- a missing pre-execution fact — nothing to vet, something to acquire (hint: /inquire) -/
  | contextInsufficient
  /-- the claim is not open at all: a convention or ownership question settles it (hint: /bound) -/
  | boundaryUndefined
  /-- a deficit the person names that no constructor above names; emitted bare -/
  | emergent (name : String)

/-- The deficits this contract inscribes. -/
def Inscribed : Deficit → Prop
  | .emergent _ => False
  | _           => True

/-- Every inscribed claim a claim's evidence supports, and the cited fit. It certifies this
    contract's gate over its own activation and nothing about claims anywhere else. -/
structure Certificate where
  claimedBy : List Deficit
  distinct  : claimedBy.Nodup
  inscribed : ∀ d ∈ claimedBy, Inscribed d
  fit       : String

inductive Whose
  | here
  | elsewhere (d : Deficit)
  | unclear

/-- Read off `claimedBy`, so nothing stored beside it can disagree: the own claim alone is here; a
    single other claim is elsewhere; several claims, or none, leave it unclear. -/
def Certificate.whose (k : Certificate) : Whose :=
  match k.claimedBy with
  | [.contextSuspect] => .here
  | [d]               => .elsewhere d
  | _                 => .unclear

/-- **Your judgment**: fit the claim against this contract's own claim and its route claims,
    reading nothing outside this contract. The own claim holds only where the claim is suspect and
    vetting it here can carry it to a vetted context; a pass certifies admissibility here, not
    the absence of a claim anywhere else — where two protocols' scopes both reach, each one's own
    gate governs. Evidence that supports no claim, or several, leaves it unclear, and an unclear
    claim is put to the person like any other, never dropped. The person's words about whose a
    claim is are part of the context: one they say is to be vetted here is here. -/
axiom certify : Context P → Claim → Certificate

/-- What the person's turn settles for one claim. There is no verdict category beside it: what the
    claim IS stays theirs to say. -/
inductive Answer
  /-- what the person makes of the claim in light of its antithesis, in their words — the
      synthesis — with whatever they said alongside it carried in those words: an instruction to
      stop relying on the source for it, a condition under which to look again, an order to act -/
  | synthesis (words : String)
  /-- another deficit's: handed to it -/
  | elsewhere (d : Deficit)

/-- **Your judgment**: the cited turn answers claim `a`, as it now stands, this way — read against
    the context that now stands, the order of its turns included, and only from this run's
    invocation on. One turn may answer several claims, and may answer some and leave others. An
    answer reaches the claim it covers: changed wording alone does not void it, while a
    materially changed claim, or a fresh antithesis, is not covered by an answer given before it.
    A correction of the target answers the claims it sets aside, in the person's words. Where the
    person set a condition for looking at the claim again and the context now shows it met, the
    earlier answer no longer covers it, and the claim is challenged afresh. -/
axiom AnswerSupported : Claim → Context P → Turn P → Answer → Prop

/-- A claim is answered only by the person's turn, whatever form that turn takes. -/
def answerCoord (a : Claim) : Coord P Answer :=
  { admits := (·.val = .person), supports := AnswerSupported a }

/-- **Your reading**: the person's answer to `a` that still covers it; `open_` until one does. -/
axiom answer : (c : Context P) → (a : Claim) → Occ (answerCoord a) c

def filledValue {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Option A
  | .open_ _     => none
  | .filled a .. => some a

/-- How a claim stands. -/
inductive Standing
  /-- waits on the person -/
  | open_
  /-- the person's turn answered it -/
  | answered (a : Answer)
  /-- the certificate alone handed it to another deficit -/
  | handed (d : Deficit)

/-- The person's answer first, whatever the certificate read. Without one, a claim the
    certificate alone places elsewhere is handed on, and every other claim — its own, or one
    whose owner is unclear — waits on the person. -/
def standing (c : Context P) (a : Claim) : Standing :=
  match filledValue (answer c a) with
  | some w => .answered w
  | none =>
    match (certify c a).whose with
    | .elsewhere d => .handed d
    | _            => .open_

/-- What the pending action does with a claim, and what follows if the claim does not hold. -/
structure Stake where
  reads     : String
  ifItFails : String

/-- The narrowing an answer is made against: the claim, what makes it suspect, and its evidence
    off the claim, the stake off the pending action (`prospect`). It narrows the question and fixes
    no answer. -/
structure ValueSpace where
  claim     : ClaimRef
  suspicion : String
  evidence  : List Indicator
  stake     : Stake

/-- **Your reading** of an open claim's narrowing, presented whole. -/
axiom narrowing : Context P → Claim → ValueSpace

inductive VerificationPath | directObserved | inferredFromN | externalCited | provisionalAssumption

/-- Provenance, freshness, and leverage. Provenance is claim-relative: the source's authority
    for this claim, not in general. Freshness is currency only: a current source can still fail
    to track the behavior its claim asserts. -/
structure Tags where
  claim      : ClaimRef
  path       : VerificationPath
  confidence : String
  age        : String
  horizon    : String
  branches   : List String

/-- **Your reading** of an open claim's tags, from the verification reads (`tagReads`). -/
axiom tags : Context P → Claim → Tags

inductive Pattern
  | provenanceAudit
  | counterfactualGap
  | crossSourceConsistency
  | inferenceFallacy
  | emergent (name : String)

/-- A concrete counter-claim, counter-condition, counter-source, or counter-inference, put to the
    claim as it stood when it was put, with its cited basis. Where no concrete challenge could be
    constructed, that result with the attempted pattern and basis. -/
structure Antithesis where
  claim      : ClaimRef
  pattern    : Pattern
  antithesis : String
  basis      : String

/-- **Your record**, read from the context: every antithesis put to `a` in this run, in cycle
    order. A claim that waits on the person and has no antithesis its current state has not
    outrun gets one before it is presented — a claim whose owner is unclear included, its
    antithesis provisional and shown beside the other deficits its evidence also supports.
    Nothing is removed. -/
axiom antitheses : Context P → Claim → List Antithesis

/-- One concrete action the gate offers for a claim: what it does, and what then happens. -/
structure Action where
  does        : String
  consequence : String

/-- **Your judgment**: the actions to offer for `a`, each concrete to this claim — stop relying on
    this source for this claim, look again once a named condition holds, keep it as it stands,
    and for an unclear owner, hand it to the deficit each supported claim names — never a category
    title; the person may answer in their own words instead. -/
axiom actions : Context P → Claim → List Action

/-- How the person ends the run. -/
inductive Closing
  /-- the run is finished; said while claims are still open, it reads as `stop` -/
  | done
  /-- stop here: what is open stays unanswered -/
  | stop
  /-- go on to the protocol the person names -/
  | route (target : String)

/-- **Your judgment**: the cited turn closes the run this way, read against the context as it now
    stands, the order of its turns included: a closing said before a later round was presented was
    answered by that round. An ordinary reply to a round with nothing open — an acknowledgement, a
    go-ahead — reads as `done`. -/
axiom ClosingSupported : Context P → Turn P → Closing → Prop

/-- Only the person closes. -/
def closeCoord : Coord P Closing :=
  { admits := (·.val = .person), supports := ClosingSupported }

/-- **Your reading**: the person's closing; `open_` until one reaches it. -/
axiom closing : (c : Context P) → Occ (closeCoord (P := P)) c

/-- **Your reading**: conditions the person set in this run for looking at a claim again that the
    context does not show met — reported open at the close, and not watched after it. -/
axiom unmet : Context P → List String

/-- **Your record**: contrary grounds you showed before the person's answers, beyond the
    antithesis each claim already carries, still held where the person answered over them —
    attached to the closure; empty when there were none. -/
axiom dissent : Context P → List String

/-- `VettedContext`: the context at closure, every claim of this run with how it stood, the
    conditions left unmet, and the dissent attached to the closure. The trace — every antithesis
    put to each claim, and the answer that met it — is read from `context`; an answer a later one
    replaced stays there too. -/
structure VettedContext (P : Type) where
  context : Context P
  ledger  : List (Claim × Standing)
  unmet   : List String
  dissent : List String

def verdict (c : Context P) : VettedContext P :=
  ⟨c, (claims c).map (fun a => (a, standing c a)), unmet c, dissent c⟩

inductive Outcome (P : Type)
  /-- nothing open, and the person closed: by answers of theirs in this run, or by saying the run
      is done after seeing what was found -/
  | vetted (v : VettedContext P)
  /-- the person stopped; what was open stays unanswered -/
  | stopped (v : VettedContext P)
  /-- the person went on to a protocol they named -/
  | routed (target : String) (v : VettedContext P)
  | holding (c : Context P)

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
A pass is the silent work: it judges afresh which claims warrant a challenge, whose each one is,
and how each stands; it makes the verification reads, and posits an antithesis for each claim that
waits on the person and has none its state has not outrun. The reads enter the context, then the
pass's record. Either a closure fires, or `respond` presents the round. Each person utterance is
fused, and the next pass reads it.
-/

/-- **Your collection**: the verification reads provenance tagging makes for the claims that wait
    on the person — artifact reads and searches of a source's origin, the claim it authorizes, and
    its downstream references. -/
axiom tagReads : Context P → List (Evidence P)

/-- **Your record** of a pass, written once its reads have entered the context: the claims and
    their certificates, the narrowings, tags, and antitheses posited, how each claim stands, and
    what changed since the last pass. `claims`, `antitheses`, `narrowing`, and `tags` are read
    from these turns. A record grounds nothing. -/
axiom passRecord : Context P → List (Response P)

def pass (c : Context P) : Context P :=
  let c₁ := c ++ (tagReads c).map (·.val)
  c₁ ++ (passRecord c₁).map (·.val)

/-- The person has closed: they said the run is done, or some turn of theirs in this run answered
    a claim. No particular turn anchors this: which of their turns carries the answer is read from
    the context as it now stands. Where nothing was found, or every claim was handed on by the
    certificate alone, only the first holds, so what was found is seen before the run ends. -/
def PersonClosed (c : Context P) : Prop :=
  filledValue (closing c) = some .done ∨ ∃ a ∈ claims c, ∃ w, standing c a = .answered w

def NothingOpen (c : Context P) : Prop := ∀ a ∈ claims c, standing c a ≠ .open_

def Closable (c : Context P) : Prop :=
  filledValue (closing c) = some .stop ∨
  (∃ t, filledValue (closing c) = some (.route t)) ∨
  (NothingOpen c ∧ PersonClosed c)

def close (c : Context P) : Outcome P :=
  match filledValue (closing c) with
  | some .stop      => .stopped (verdict c)
  | some (.route t) => .routed t (verdict c)
  | _               => .vetted (verdict c)

open Classical in
/-- `respond` presents the round. First the current list: every claim of this run, each with its
    source and how it stands — waiting on the person, answered with what they said, or handed on
    by the certificate with its fit and the command only as a hint. Then what this turn changed:
    what the person's turn answered, what is newly found or re-targeted, a claim challenged afresh
    because a condition the person set is now met. Then every open claim: its source and the
    claim verbatim, what makes it suspect, the evidence with its channel, what the pending action
    stakes on it, its tags, the antithesis with its basis, and the certificate's fit — for an
    unclear owner, that the evidence also supports the other deficits it names — then `actions`,
    each with its consequence; a few at a time where there are many, around four, so each is read.
    Wherever a person's earlier turn is read as the answer to a claim,
    or as what lets the run close, say which turn was read and what was taken from it, quoting
    their words. With nothing open, what was searched and what was found, and whether the run is
    done. -/
def sublate (respond : Context P → Response P) :
    Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let c₁ := pass (fuse c u)
    if Closable c₁ then close c₁
    else sublate respond (c₁ ++ [(respond c₁).val]) us

/-- The invocation opens the run: the first pass is always presented, and nothing closes before
    the person has seen it. -/
def start (respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  let c₁ := pass c
  sublate respond (c₁ ++ [(respond c₁).val]) us

/-! ── LOOP ──
Every utterance opens a pass over the fused context: an answer, a correction of the target, a
question, a closing, read whole. Nothing counts rounds or batches; every pass judges the claims
against the whole context again, so what is open is whatever the context leaves open. A condition
the person set that the context now shows met leaves its claim open again, with a fresh
antithesis. The loop is dialogue: each round ends at a gate, and the person ends the run.
-/

/-!
Silence judges nothing and closes nothing.
theorem silence (respond : Context P → Response P) (c : Context P) :
    sublate respond c [] = .holding c

While no closure fires, an utterance leads to the next round and closes nothing.
theorem unclosed_holds_gate (respond : Context P → Response P) (c : Context P) (u : Utterance P)
    (us : List (Utterance P)) (h : ¬ Closable (pass (fuse c u))) :
    sublate respond c (u :: us) =
      sublate respond (pass (fuse c u) ++ [(respond (pass (fuse c u))).val]) us

The invocation alone closes nothing: without a person's utterance the run holds at its first round.
theorem start_holds (respond : Context P → Response P) (c : Context P) :
    start respond c [] = .holding (pass c ++ [(respond (pass c)).val])

A pass only adds to the context.
theorem pass_extends (c : Context P) : ∃ t, pass c = c ++ t
-/

/-! ── CONVERGENCE ──
Every closure is read where it fires and nowhere else. vetted: nothing open, and the person
closed — by answers of theirs in this run, read from any of their turns, or by saying the run is
done after seeing the list, which is the only way a run closes where nothing was found or every
claim was handed on by the certificate alone. stopped: what was open stays unanswered. routed: the
person named the next protocol. The vetted context claims no more than the claims this run
selected; an answer carries the person's words and no category the AI assigned to them.
Convergence evidence: for each claim an antithesis was put to, every antithesis in cycle order —
the claim it was put to → the antithesis with its basis → the answer that met it, quoted, with a
later answer that replaced it shown beside it — naming the source; apart from the trace, every
claim the certificate handed on, with its fit and hint; the conditions left unmet, reported open;
and the dissent attached to the closure. Demonstrated, not asserted.
-/

/-!
Every vetted closure follows a person's utterance, and its context is the pass that read it.
theorem closes_after_utterance (respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (v : VettedContext P) (h : sublate respond c us = .vetted v) :
    ∃ (c₀ : Context P) (u : Utterance P), v.context = pass (fuse c₀ u)

The person's answer stands over anything the certificate read.
theorem person_first (c : Context P) (a : Claim) (w : Answer)
    (h : filledValue (answer c a) = some w) : standing c a = .answered w

A claim whose owner is unclear waits on the person until they answer it.
theorem unclear_waits (c : Context P) (a : Claim) (hr : filledValue (answer c a) = none)
    (hu : (certify c a).whose = .unclear) : standing c a = .open_

An answer always rests on a turn the person sent.
theorem answered_by_person (c : Context P) (a : Claim) (w : Answer)
    (h : standing c a = .answered w) :
    ∃ s : Cite c, s.src.val = .person ∧ (c[s.idx]'s.lt).origin = .person

Only the person closes.
theorem closing_by_person {c : Context P} {s : Cite c}
    (ok : (closeCoord (P := P)).admits s.src) : s.src.val = .person

A vetted run has nothing open, and the person closed it.
theorem vetted_closed_by_person (c : Context P) (v : VettedContext P) (hc : Closable c)
    (h : close c = .vetted v) : NothingOpen c ∧ PersonClosed c
-/

/-! ── TOOL GROUNDING ── -/
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed

inductive Annot | sense | observe | track | transform | dispatch | constitution | extension

inductive Op | select | certify | handoff | narrow | tag | posit | gate | readTurn | converge | seam

def grounding : Op → Annot × String
  | .select   => (.sense, "Internal analysis: the claims the pending action leans on that warrant a challenge, afresh every pass against the context as it now stands and from this run's invocation on; the person's words about what to vet included, and a source whose claim cannot be settled still selected, its owner unclear")
  | .certify  => (.sense, "Internal analysis: each claim fitted against this contract's own claim and its route claims, reading nothing outside this contract; admissibility here only, and fail-closed, so evidence that supports no claim or several leaves it unclear")
  | .handoff  => (.extension, "TextPresent+Proceed: a claim the certificate alone hands to another deficit, named with its fit and the command only as a hint — a missing pre-execution fact (/inquire), a claim a convention or ownership question settles (/bound); nothing is dispatched, and no claim leaves the person's view silently")
  | .narrow   => (.sense, "Internal analysis: for each open claim, the narrowing its answer is made against — the claim, what makes it suspect, and its evidence, the stake off the pending action; the question, never an answer")
  | .tag      => (.observe, "artifact read, artifact search: verify each open claim's source origin, the claim it authorizes, and its downstream references; provenance, freshness, and leverage")
  | .posit    => (.sense, "Internal analysis: one concrete antithesis per open claim its state has not outrun — Pattern A, B, C, D, or emergent — against the claim as it now stands, with its cited basis; provisional where the owner is unclear")
  | .gate     => (.constitution, "present: the current list and this turn's changes, then every open claim with its narrowing, tags, antithesis and basis, and certificate fit, and concrete actions for it, each with its consequence and never a category title; the person answers in their own words; with nothing open, what was searched and found, and whether the run is done")
  | .readTurn => (.sense, "Internal analysis: the new turn, and every earlier turn of the person's in this run it bears on, read whole against the fused context as it now stands — an answer to one claim or several, a correction of the target, a question, a closing — whatever form it takes")
  | .converge => (.extension, "TextPresent+Proceed: the per-antithesis trace with each answer beside the antithesis it met, quoted, and a replaced answer beside it; the claims the certificate handed on with fit and hint; the conditions left unmet, reported open; the dissent attached to the closure")
  | .seam     => (.extension, "TextPresent+Proceed: at a chain the person declared, naming the next protocol, proceed to it citing that turn; this protocol declares no outbound edge, and every Constitution gate inside Elenchus and the next protocol fires unchanged")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Pattern resolution emergent via session context.
-/

end

end Elenchus
```

## Mode Activation

`/sublate` is user-invoked over an existing working context before an action that depends on it is externalized or committed. Elenchus has no AI-guided activation: a model may answer an explicit invocation, but it does not initiate vetting from its own suspicion. Loaded safety boundaries, capability restrictions, and explicit user instructions continue to bind. The run begins at the invocation: what an earlier run or session selected, answered, or set as a condition belongs to that run, and the context carries it only as material.

## Source Identification Criteria

A source is worth a look when it is unusually load-bearing, older than the horizon appropriate to its origin, supported through a long provenance chain, in tension with another source about the same referent, or itself an inference being used as a premise — the assistant's own earlier output included. Thresholds and origin horizons remain working hypotheses; an emergent criterion may be used when it directly identifies suspect context.

## Antithesis Rendering

Render the pattern that directly challenges the claim:

- **Provenance**: test whether the source's verification path authorizes this claim. Freshness does not settle support-integrity when nothing couples the source to the behavior it asserts.
- **Counterfactual**: use a condition the user has put in play to show where the current conclusion could fail.
- **Cross-source**: compare separate sources only after their referent and claim-kind are compatible. Claims split from one source are not a source pair.
- **Inference**: test the reasoning that produced a conclusion. Time-invariance from a present observation, over-generalization, surviving-sample reasoning, base-rate neglect, and correlation-as-cause are recognition seeds rather than a closed catalog; an emergent archetype remains available.

Counterfactual rendering begins with the user's changed condition. Inference rendering reverse-derives the condition that would expose a reasoning flaw. Every antithesis is a concrete counter-claim, counter-condition, counter-source, or counter-inference with a cited basis.

## Protocol

The formal block defines execution. This section fixes the user-facing rendering.

### The round

Open every round with the current list: each claim under vetting, its source, and how it stands now — waiting on you, what you said about it, or handed to another protocol with why. Follow it with what this turn changed: what your last answer settled, what is newly found, what moved because you corrected the target, and any claim challenged again because a condition you set is now met.

Then present every open claim, a few at a time where there are many. For each, before the question: the source and the claim verbatim, what makes it suspect, the evidence and where it came from, what the pending action stakes on it, the provenance and freshness reading, and the antithesis with its basis. Where the owner is unclear, say which other kinds of problem the evidence also supports; the antithesis is then provisional.

The question asks what you make of each claim in light of its challenge. The options are concrete actions for that claim, each with what then happens — never category titles:

```
"The staging DB mirrors prod schema" — from the runbook (edited 2025-11)
  suspect   the migration you plan assumes it; the runbook predates two prod migrations
  challenge prod ran migrations 0412 and 0419 after that edit; nothing shows staging received them

What do you make of it?
1. Stop relying on the runbook for this — check the staging schema before migrating
2. Look again once 0419 is confirmed on staging — the claim is re-challenged then
3. It holds — say why, and the migration proceeds on it
```

Answer in your own words; one answer may cover several claims, or only some of them — what it leaves stays open for the next round. An answer is recorded in your words, instructions included. Saying the claim is another protocol's matter hands it there — with the command as a hint where this protocol names one, and as you named it otherwise; nothing is dispatched. Saying the target itself is wrong moves what is vetted on the next pass.

With nothing open, show what was searched and what was found — including every claim handed elsewhere, with why — and ask whether the run is done; an ordinary reply closes it, and you may name something to vet instead. Wherever an earlier answer of yours is read as covering a claim, or as what lets the run close, say which turn was read and what was taken from it, quoting your words — this disclosure stands in place of asking again.

## Rules

- **User-initiated only**: Activate only on the user's pre-execution vetting invocation over existing working context.
- **Antithesis before synthesis**: Every open claim is met by a concrete challenge — a counter-claim, counter-condition, counter-source, or counter-inference with its cited basis — shown before the user is asked what they make of it. Where no concrete challenge can be constructed, say so with the attempted pattern and basis, so the claim stays visible in the closing account.
- **The answer is the user's, in their words**: A claim is answered only by the user's turn, whatever its form, and that answer stands over anything the certificate read. It is recorded as said, with no category assigned to it; instructions, conditions, and orders it carries are read from those words.
- **Recognition over categories**: Offer actions concrete to the claim in front of the user, each with its consequence. The user's own words settle what a category would have asked them to choose.
- **Round composition**: Compose each round so the reader can act on it without reassembling it — everyday language rather than this file's formal vocabulary, each judgment beside the evidence it rests on together with the differential implication that matters for the next move, and analytical context laid out before the question rather than inside it. Read `references/round-composition.md` before composing when a term's rendering has to hold across the session or wording has to be carried through unchanged, when some of what is in view belongs to a later round or a trace rather than this one, or when this protocol's own round bears on where a sentence sits relative to the question.
- **Judge afresh every pass**: Which claims are vetted, whose each one is, and which answer covers which claim are read from the whole context as it now stands. A correction of the target moves what is vetted; a condition the user set that is now met re-opens its claim with a fresh challenge; changed wording alone does not void an answer.
- **Source chain preservation**: The working context is read and never rewritten. An answer reaches its source only as authority for the claim it answered; other claims from the same source stand on their own answers.
- **Claim-relative provenance**: A provenance reading authorizes one claim. Same-referent comparison requires compatible claim kinds and separate sources; a source used for several claims yields separately answered claims.
- **Currency and support-integrity**: A current source still receives a provenance antithesis when no observable coupling ties it to the behavior its claim asserts.
- **Open inference archetypes**: The named reasoning flaws seed recognition without closing Pattern D to an emergent flaw condition.
- **Unclear owners are shown, never dropped**: A claim the certificate cannot place is presented with a provisional challenge and the other deficits its evidence supports; the user's answer places it. A claim the certificate alone places elsewhere is reported with its fit and the command only as a hint.
- **The user closes**: Nothing closes on the first pass. Where nothing was found, or every claim was handed elsewhere by the certificate alone, the run ends only when the user replies after seeing what was found. Contrary ground still held when the user answers over it is attached to the closure record.
- **Declared continuation relay**: A user-declared chain settles the protocol after Elenchus; this contract declares no outbound edge. Cite that source and preserve every Constitution gate inside both protocols.
- **Form feedback**: Derive each round's density from the current request and carry an explicit form instruction until countermanded. Change the form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
