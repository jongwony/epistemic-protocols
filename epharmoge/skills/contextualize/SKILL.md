---
name: contextualize
description: "Detect application-context mismatch after execution. Fires when correct output may not fit the actual context. Type: (ApplicationDecontextualized, AI, CONTEXTUALIZE, Result) → ContextualizedExecution"
---

# Epharmoge Protocol

Detect application-context mismatch after execution through AI-guided applicability verification, where correct results that may not fit the actual context are surfaced for user judgment. Type: `(ApplicationDecontextualized, AI, CONTEXTUALIZE, Result) → ContextualizedExecution`.

## Definition

**Epharmoge** (ἐφαρμογή): A dialogical act of verifying that results fit the actual application context — from Aristotle's notion of practical application — resolving the gap between technical correctness and contextual appropriateness through structured mismatch surfacing and user-directed adaptation.

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
Epharmoge(R, X) → start(c) → contextualize(c, utterances), where c is the fused session context and
X, the application context, is c itself:
  pass(c): carry out what a person's resolution asked and the context does not yet show done — an
    adaptation, a withdrawal — and take in what the write returned; then judge afresh where the
    result as it now stands does not fit the context as it now stands, whose each mismatch is,
    and how each one stands → write the carrier
  [a withdrawal the person asked for has landed]              close: discarded
  [the person stops]                                          close: stopped
  [the person goes on to a protocol they name]                close: routed
  [nothing open ∧ the person has closed]                      close: done
  [otherwise] present the current list and what this turn changed, then one gate: the next open
    mismatch — one whose owner is unclear first — with concrete actions for it; with nothing
    open, the list and whether this is done → Stop
  next utterance u: c' := pass(fuse(c, u)) → the same reading, whatever u says
  no utterance: the gate holds; nothing is judged and nothing closes
-/

/-! ── MORPHISM ──
(R, X)
  → perform(requested)          -- carry out the adaptation or withdrawal a person asked for; what the write returned enters the context
  → judge(result, context)      -- where the result as it now stands does not fit the accumulated context; afresh on every pass
  → certify(mismatch)           -- whose it is: a fit problem here, another deficit's, or unclear (fail-closed)
  → surface(list, changes, one) -- the current list and this turn's changes, then concrete actions for one mismatch
  → resolve(person's turn)      -- adapt it, leave it as it is with their reason, stop using the result, hand it on; or close
  → ContextualizedExecution
requires: mismatch_detected(R, X)   -- the auto-activation condition only (Layer 2); a user-invoked run enters without it
deficit:  ApplicationDecontextualized
preserves: X                        -- the application context is the fused context; adapt and discard change the result alone
invariant: Applicability over Correctness
invariant: the person resolves and closes; evidence only withdraws the AI's own flag or shows what it found
invariant: transformative revalidation (NON-MONOTONE) -- an adaptation changes what the next pass judges, so a run can have more open after a resolution than before it
-/

namespace Epharmoge

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

/-- `R`, the result under review: any completed work product — an AI output, an analysis
    conclusion, a decision outcome. The morphism treats every kind alike. -/
abbrev Result := String

/-- **Your reading**: the result as the context now shows it, every adaptation whose write has
    landed applied — each write returns its result into the context. Correctness is presupposed
    at entry and never re-checked here. -/
axiom target : Context P → Result

/-- `significant` requires a demonstrable behavioral consequence — a downstream decision, a
    runtime divergence, a changed gate trajectory; structural extent alone is `minor`. -/
inductive Severity | critical | significant | minor

/-- One place the result does not fit: what does not fit, in plain words; where in the result;
    the turn of the context it does not fit, which is never the assistant's own (`Cite`), so the
    comparison stays non-circular; and how much it matters. -/
structure Mismatch (c : Context P) where
  what     : String
  inResult : String
  against  : Cite c
  severity : Severity

/-- **Your judgment**, made afresh on every pass: where the result as it now stands does not fit
    the context as it now stands — the context is the application context, the person's own
    account of their situation and every earlier answer included. One mismatch per claim is the
    direction; a claim standing on evidence in several places is one mismatch, since how far a
    repair reaches is the resolution's question. Something the person names as not fitting is
    judged here like anything else. A mismatch an adaptation aimed at and that is still here
    after the write landed is one that adaptation did not repair. -/
axiom mismatches : (c : Context P) → List (Mismatch c)

/-- A deficit label. A certificate assigns only the ones this contract inscribes; the person may
    name any. -/
inductive Deficit
  /-- this contract's own: a correct result that does not fit its application context -/
  | applicationDecontextualized
  /-- a missing pre-execution fact, with no observable value to adapt to (hint: /inquire) -/
  | contextInsufficient
  /-- undefined convention or dependency ownership for the decision (hint: /bound) -/
  | boundaryUndefined
  /-- a deficit the person names that no constructor above names; emitted bare -/
  | emergent (name : String)

/-- The deficits this contract inscribes. -/
def Inscribed : Deficit → Prop
  | .emergent _ => False
  | _           => True

/-- Every inscribed claim a mismatch's evidence supports, and the cited fit. It certifies this
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
  | [.applicationDecontextualized] => .here
  | [d]                            => .elsewhere d
  | _                              => .unclear

/-- **Your judgment**: fit the mismatch's claim against this contract's own claim and its route
    claims, reading nothing outside this contract. Evidence that supports no claim leaves it
    unclear, and an unclear mismatch is put to the person before anything else happens to it. -/
axiom certify : (c : Context P) → Mismatch c → Certificate

/-- What a person's turn settles for one mismatch. There is no verdict beside it: whether the
    mismatch "really" stands is not asked, and nothing here asserts it either way. -/
inductive Resolution
  /-- change the result this way; resolves the mismatch until the write lands, after which the
      next pass judges the new result -/
  | adapt (direction : String)
  /-- leave the result as it is here, with the reason the person gave where they gave one -/
  | keep (reason : Option String)
  /-- stop using the result; `none` when nothing takes its place -/
  | discard (replacement : Option Result)
  /-- another deficit's: handed to it -/
  | elsewhere (d : Deficit)

/-- **Your judgment**: the cited turn resolves `m`, as it now stands, this way. Read against the
    context that now stands, the order of its turns included. An adaptation that has landed no
    longer resolves a mismatch still found afterwards; a write that failed resolves nothing. -/
axiom ResolutionSupported : {c : Context P} → Mismatch c → Context P → Turn P → Resolution → Prop

/-- A mismatch is resolved only by the person's turn, whatever form that turn takes. -/
def resolutionCoord {c : Context P} (m : Mismatch c) : Coord P Resolution :=
  { admits := (·.val = .person), supports := ResolutionSupported m }

/-- **Your reading**: the person's resolution of `m`; `open_` until one reaches it. -/
axiom resolution : (c : Context P) → (m : Mismatch c) → Occ (resolutionCoord m) c

/-- What evidence alone settled about a mismatch. -/
inductive Shown
  /-- it fits after all: the AI withdraws its own flag -/
  | fits
  /-- it does not fit: shown before the gate, and the person still resolves it -/
  | fails

/-- **Your judgment**: the cited evidence, read against the result and the context as they now
    stand, admits this reading of `m` alone. Where it admits more than one, it settles nothing.
    A person's turn that disputes it leaves it unsettled: evidence settles only what nothing the
    person said contests. -/
axiom ShownSupported : {c : Context P} → Mismatch c → Context P → Turn P → Shown → Prop

/-- Evidence stands on what was observed or reported, never on the person's say-so, which is a
    resolution. -/
def evidenceCoord {c : Context P} (m : Mismatch c) : Coord P Shown :=
  { admits := (·.val ≠ .person), supports := ShownSupported m }

/-- **Your reading**: what evidence alone settled for `m`, with the evidence cited; `open_`
    where it settled nothing. -/
axiom byEvidence : (c : Context P) → (m : Mismatch c) → Occ (evidenceCoord m) c

def filledValue {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Option A
  | .open_ _     => none
  | .filled a .. => some a

/-- How a mismatch stands. -/
inductive Standing
  /-- waits on the person -/
  | open_
  /-- the person's turn resolved it -/
  | resolved (r : Resolution)
  /-- the certificate alone handed it to another deficit -/
  | handed (d : Deficit)
  /-- evidence showed it fits; the AI withdrew its own flag -/
  | withdrawn

/-- The person's resolution first, whatever evidence or the certificate read; then evidence
    that it fits; then the certificate's handoff; otherwise it waits. -/
def standing (c : Context P) (m : Mismatch c) : Standing :=
  match filledValue (resolution c m) with
  | some r => .resolved r
  | none =>
    match filledValue (byEvidence c m) with
    | some .fits => .withdrawn
    | _ =>
      match (certify c m).whose with
      | .elsewhere d => .handed d
      | _            => .open_

/-- One concrete action the gate offers for a mismatch: what it does, as the resolution it would
    record, and what then happens. -/
structure Action where
  resolution  : Resolution
  consequence : String

/-- **Your judgment**: the actions to offer for `m`, each concrete to this mismatch — the change
    that would make it fit where one is evident, leaving it as it is and what then happens, not
    using the result and what would take its place, and for an unclear owner the deficit each
    supported claim would hand it to. Never a category title; the person may answer in their own
    words instead. -/
axiom actions : (c : Context P) → Mismatch c → List Action

/-- **Your selection** of the open mismatch the gate presents next: one whose owner is unclear
    first, then by severity, critical first. -/
axiom selectNext : (c : Context P) → Option (Mismatch c)

/-- How the person ends the run. -/
inductive Closing
  /-- the run is finished; said while mismatches are still open, it reads as `stop` -/
  | done
  /-- stop here: the result stays as it is, and what is open stays unresolved -/
  | stop
  /-- go on to the protocol the person names -/
  | route (target : String)

/-- **Your judgment**: the cited turn closes the run this way. Only the person's latest turn is
    read here: a closing said before the latest round was presented was answered by that round. -/
axiom ClosingSupported : Context P → Turn P → Closing → Prop

/-- Only the person closes. -/
def closeCoord : Coord P Closing :=
  { admits := (·.val = .person), supports := ClosingSupported }

/-- **Your reading**: the person's closing; `open_` until one reaches it. -/
axiom closing : (c : Context P) → Occ (closeCoord (P := P)) c

/-- **Your reading**: the context shows a withdrawal a person's resolution asked for carried out —
    the write that removed or replaced the result returned. -/
axiom Withdrawn : Context P → Prop

/-- The replacement a person's withdrawal named, where one did. -/
def replacement (c : Context P) : Option Result :=
  ((mismatches c).findSome? fun m =>
    match standing c m with
    | .resolved (.discard r) => some r
    | _                      => none).getD none

/-- **Your record**, read from the context: the locator the carrier-creating write returned — the
    one durable record every mismatch and its standing is written into; `none` where nothing was
    ever written. -/
axiom carrier : Context P → Option String

/-- **Your record**: contrary grounds you showed before the person's resolutions — evidence that
    a mismatch does not fit, beside a resolution that left it as it is, among them — attached to
    the closure; empty when there were none. -/
axiom dissent : Context P → List String

/-- `ContextualizedExecution`: the context at closure, what the person is left with (`none` when a
    withdrawal left nothing), the carrier's locator, and the dissent attached to the closure. -/
structure ApplicabilityVerdict (P : Type) where
  context : Context P
  target  : Option Result
  carrier : Option String
  dissent : List String

inductive Outcome (P : Type)
  /-- nothing open and the person closed: by the resolution in their latest turn, or by saying
      the run is done -/
  | done (v : ApplicabilityVerdict P)
  /-- the person withdrew the result and the withdrawal landed; the replacement is carried with no
      claim of fit -/
  | discarded (v : ApplicabilityVerdict P)
  /-- the person stopped; the result stays as it is and what was open stays unresolved -/
  | stopped (v : ApplicabilityVerdict P)
  /-- the person went on to a protocol they named -/
  | routed (target : String) (v : ApplicabilityVerdict P)
  | holding (c : Context P)

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
A pass is the silent work. It first carries out what a person's resolution asked and the context
does not yet show done, and the write's result returns into the context. It then judges afresh:
the mismatches, whose each one is, what evidence alone settles, and how each stands. The pass's
record follows, then the carrier write. Either a closure fires, or `respond` presents the current
list and one gate. Each person utterance is fused, and the next pass reads it; after an adaptation
that pass judges the new result.
-/

/-- **Your action** for a pass, before anything is judged: where a person's resolution asks for an
    adaptation or a withdrawal the context does not yet show carried out, the artifact write that
    carries it out, returning what the write returned. -/
axiom perform : Context P → List (Evidence P)

/-- **Your record** of a pass, written once its writes have entered the context: what the pass
    judged — the mismatches, their certificates, what evidence settled, their standing — and what
    changed since the last pass. A record grounds nothing. -/
axiom passRecord : Context P → List (Response P)

/-- **Your action**: the carrier write — created the first time a mismatch is found, brought into
    line on every later pass — returning its locator. -/
axiom persist : Context P → List (Evidence P)

def pass (c : Context P) : Context P :=
  let c₁ := c ++ (perform c).map (·.val)
  let c₂ := c₁ ++ (passRecord c₁).map (·.val)
  c₂ ++ (persist c₂).map (·.val)

/-- The position of the latest turn the person sent. -/
def lastPerson (c : Context P) : Option Nat :=
  ((List.range c.length).filter fun i =>
    match c[i]? with
    | some t => decide (t.origin = .person)
    | none   => false).getLast?

/-- Where the person's resolution of `m` was said. -/
def resolvedAt {c : Context P} (m : Mismatch c) : Option Nat :=
  match resolution c m with
  | .filled _ src _ _ => some src.idx
  | .open_ _          => none

/-- The person has closed: they said the run is done, or their latest turn resolved a mismatch
    that is still found — left as it is, or handed on. Where nothing was found, where every
    mismatch was handed on or withdrawn without the person, and after an adaptation lands and
    takes its mismatch away, only the first holds, so the list and the changed result are seen
    before the run ends. -/
def PersonClosed (c : Context P) : Prop :=
  filledValue (closing c) = some .done ∨
  ∃ m ∈ mismatches c, (resolvedAt m).isSome ∧ resolvedAt m = lastPerson c

def NothingOpen (c : Context P) : Prop := ∀ m ∈ mismatches c, standing c m ≠ .open_

def Closable (c : Context P) : Prop :=
  Withdrawn c ∨
  filledValue (closing c) = some .stop ∨
  (∃ t, filledValue (closing c) = some (.route t)) ∨
  (NothingOpen c ∧ PersonClosed c)

open Classical in
def close (c : Context P) : Outcome P :=
  if Withdrawn c then .discarded ⟨c, replacement c, carrier c, dissent c⟩
  else
    match filledValue (closing c) with
    | some .stop      => .stopped ⟨c, some (target c), carrier c, dissent c⟩
    | some (.route t) => .routed t ⟨c, some (target c), carrier c, dissent c⟩
    | _               => .done ⟨c, some (target c), carrier c, dissent c⟩

open Classical in
/-- `respond` presents the round. First the current list: every mismatch found, each with what does
    not fit, where, and how it stands, in plain words. Then what this turn changed: what the
    person's turn resolved, what an adaptation changed in the result, what is newly found, what an
    adaptation aimed at and did not repair, a flag evidence withdrew with that evidence, and a
    handoff with its fit and the command only as a hint. Then one gate. For `selectNext`: what does
    not fit, where in the result, the turn of the context it does not fit, how much it matters, and
    evidence that it does not fit where evidence showed that; then `actions`, each with its
    consequence. With nothing open, the list, how far the judgment reached, and whether the run is
    done. -/
def contextualize (respond : Context P → Response P) :
    Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let c₁ := pass (fuse c u)
    if Closable c₁ then close c₁
    else contextualize respond (c₁ ++ [(respond c₁).val]) us

open Classical in
def start (respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  let c₁ := pass c
  if Closable c₁ then close c₁
  else contextualize respond (c₁ ++ [(respond c₁).val]) us

/-! ── LOOP ──
Transformative revalidation (NON-MONOTONE): an adaptation produces a new result, and the next pass
judges it, so an adaptation can breed mismatches that did not exist before, and can leave the one
it aimed at in place. Nothing counts down; every pass judges the whole result against the whole
context. The loop is dialogue: each round ends at a gate, and the person ends the run.
-/

/-!
Silence judges nothing and closes nothing.
theorem silence (respond : Context P → Response P) (c : Context P) :
    contextualize respond c [] = .holding c

While no closure fires, an utterance leads to the next gate and closes nothing.
theorem unclosed_holds_gate (respond : Context P → Response P) (c : Context P) (u : Utterance P)
    (us : List (Utterance P)) (h : ¬ Closable (pass (fuse c u))) :
    contextualize respond c (u :: us) =
      contextualize respond (pass (fuse c u) ++ [(respond (pass (fuse c u))).val]) us

A pass only adds to the context.
theorem pass_extends (c : Context P) : ∃ t, pass c = c ++ t
-/

/-! ── CONVERGENCE ──
Every closure is read where it fires and nowhere else. done: nothing open, and the person closed —
by resolving the last open mismatch in their latest turn, or by saying the run is done after seeing
the list, which is the only way a run closes where nothing was found, where nothing was the
person's to resolve, or after an adaptation that took its mismatch away. discarded: the withdrawal the person asked for landed; the replacement is carried with
no claim of fit. stopped: the result stays as it is and every open mismatch is recorded unresolved.
routed: the person named the next protocol. Fit is claimed only for the mismatches found, and fit
is not correctness, which was presupposed at entry and is not re-checked here. A mismatch left as
it is carries the person's reason and no claim that it does or does not stand.
Convergence evidence: one line per mismatch found — what did not fit, where, and how it stood at
the close: the person's resolution with the turn it came from, the certificate's handoff with its
fit, or evidence's withdrawal with that evidence — beside the adaptations made, any that did not
repair what they aimed at, and the dissent attached to the closure. Demonstrated, not asserted.
-/

/-!
The person's resolution stands over anything evidence or the certificate read.
theorem person_first (c : Context P) (m : Mismatch c) (r : Resolution)
    (h : filledValue (resolution c m) = some r) : standing c m = .resolved r

A resolution always rests on a turn the person sent.
theorem resolved_by_person (c : Context P) (m : Mismatch c) (r : Resolution)
    (h : standing c m = .resolved r) :
    ∃ s : Cite c, s.src.val = .person ∧ (c[s.idx]'s.lt).origin = .person

Evidence never rests on the person's say-so.
theorem evidence_not_person {c : Context P} {m : Mismatch c} {s : Cite c}
    (ok : (evidenceCoord m).admits s.src) : s.src.val ≠ .person

Only the person closes.
theorem closing_by_person {c : Context P} {s : Cite c}
    (ok : (closeCoord (P := P)).admits s.src) : s.src.val = .person

A done run has nothing open, and the person closed it.
theorem done_closed_by_person (c : Context P) (v : ApplicabilityVerdict P) (hc : Closable c)
    (h : close c = .done v) : NothingOpen c ∧ PersonClosed c

A mismatch never stands against the assistant's own turn.
theorem against_not_assistant {c : Context P} (m : Mismatch c) :
    (c[m.against.idx]'m.against.lt).origin ≠ .assistant
-/

/-! ── TOOL GROUNDING ── -/
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed

inductive Annot | sense | observe | track | transform | dispatch | constitution | extension

inductive Op | judge | certify | handoff | evidenceWithdraw | evidenceShow | gate | adapt
             | discard | persist | readTurn | converge | seam

def grounding : Op → Annot × String
  | .judge            => (.sense, "Internal analysis: the whole result as it now stands against the whole context as it now stands, afresh every pass; it re-executes nothing and reads the completed result and the observable context, never the assistant's own words, as what the result must fit")
  | .certify          => (.sense, "Internal analysis: each mismatch's claim fitted against this contract's own claim and its route claims, reading nothing outside this contract; fail-closed, so evidence that supports no claim leaves it unclear")
  | .handoff          => (.extension, "TextPresent+Proceed: a mismatch the certificate alone hands to another deficit, named with its fit and the command only as a hint — a missing pre-execution fact (/inquire), undefined convention or dependency ownership (/bound); nothing is dispatched")
  | .evidenceWithdraw => (.extension, "TextPresent+Proceed: where evidence alone shows a flagged place fits, withdraw the flag and say so with that evidence; a person's turn that disputes it puts it back")
  | .evidenceShow     => (.extension, "TextPresent+Proceed: where evidence alone shows a mismatch does not fit, show that evidence before the gate; the person still resolves it")
  | .gate             => (.constitution, "present: the current list and this turn's changes, then one mismatch — an unclear owner first — with concrete actions, each with its consequence and never a category title; with nothing open, whether the run is done")
  | .adapt            => (.transform, "artifact write: the person's adaptation applied to the result; the write's result returns into the context and the next pass judges it")
  | .discard          => (.transform, "artifact write: withdraw the result and put the replacement in its place, or remove it when nothing takes its place")
  | .persist          => (.track, "record, record update: the one carrier entry — created when a mismatch is first found, brought into line every pass, one line per mismatch with its standing and what it stood on; its locator is carried out on the verdict")
  | .readTurn         => (.sense, "Internal analysis: the latest turn read whole against the fused context — a resolution, a closing, something named as not fitting, a correction, a question — whatever form it takes")
  | .converge         => (.extension, "TextPresent+Proceed: the per-mismatch trace with who settled each line and what it stood on, the adaptations made and any that did not repair what they aimed at, the dissent attached to the closure, and what the verdict does not claim")
  | .seam             => (.extension, "TextPresent+Proceed: at a chain the person declared, naming the next protocol, proceed to it citing that turn; every Constitution gate inside Epharmoge and the next protocol fires unchanged")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Mismatch-domain resolution emergent via session context.
contextualize ∘ caller-loop: this protocol is built to run inside another loop. It keeps
collating the result against the accumulated context as the result changes; it does not
establish that the result is correct, and assigns no one else that duty — the verdict states
its own silence.
-/

end

end Epharmoge
```

## Core Principle

**Applicability over Correctness**: Surface evidence that a correct result does not fit its application context; contextual fitness is the question this protocol settles.

## Mode Activation

### Activation

Layer 1 activates whenever the user invokes `/contextualize`, including when nothing may turn out not to fit. Layer 2 may activate only after Aitesis operational evidence has established the recurring pattern “context gathered but application mismatched,” and only when the post-execution result satisfies the formal auto-activation guard. Prior-session recall indices may inform the judgment when available; they never settle the user's resolution.

## Protocol

The formal blocks define execution. This section fixes the user-facing rendering.

### The round

Open every round with the current list: each place the result does not fit, where it is, and how it stands now — waiting on you, what you decided, handed to another protocol, or withdrawn because evidence showed it fits. Follow it with what this turn changed: what your last answer settled, what an adaptation changed in the result, what is newly found, what an adaptation aimed at and did not repair, and any flag withdrawn with the evidence that withdrew it. Keep one carrier entry for the result, one line per mismatch with its standing and what it stood on.

Then ask about one mismatch. Before the question, show what does not fit, where in the result, the part of the context it does not fit (quoted with where it came from), how much it matters, and evidence that it does not fit where evidence showed that. Ask first about a mismatch whose owner is unclear.

The options are concrete actions for this mismatch, each with what then happens — never category titles. For a schedule that lands after working hours:

```
The report goes out at 18:00 Seoul time — after the team has left.
  result   `0 9 * * *` (server in UTC)
  context  "the team works in Seoul" (your message)

What should happen?
1. Send it at 09:00 Seoul time — `0 0 * * *`; this overlaps the 00:00–00:30 UTC backup window, so it is checked again
2. Leave the 18:00 arrival as it is — the report goes out unchanged
3. Stop using this cron — say what should replace it
```

The person may answer in their own words, and one answer may settle more than one mismatch. Leaving a mismatch as it is records the reason they gave and makes no claim that the mismatch does or does not stand. Where the owner is unclear, the options name the concrete split, for example "install mail in this image as part of this work" beside "hand it to whoever owns the image (/bound)".

With nothing open, show the list, how far the judgment reached, and ask whether the run is done; the person may also name something that does not fit. After an adaptation, say that the changed result was judged again and that no correctness claim is made for it. After a withdrawal, say that the replacement is carried with no claim of fit.

## Rules

- **Non-circularity**: What the result must fit is the context the person and the environment supplied — never the assistant's own words, which a mismatch cannot cite.
- **Round composition**: Compose each round so the reader can act on it without reassembling it — everyday language rather than this file's formal vocabulary, the judgment set beside the evidence it rests on together with the differential implication that matters for the next move, and analytical context laid out before a gate rather than inside it, so the gate carries the question and each option's differential implication. Read `references/round-composition.md` before composing when a term's rendering has to hold across the session or wording has to be carried through unchanged, when some of what is in view belongs to a later round or a trace rather than this one, or when this protocol's own phases bear on where a sentence sits relative to a gate.
- **Recognition over categories**: Offer actions concrete to the mismatch in front of the person, each with its consequence. The person's own words settle what a category would have asked them to choose.
- **Verdict scope**: Present the per-mismatch trace before the verdict. Fit is claimed only for the mismatches found, and an adapted result claims fit, not correctness; a withdrawal claims neither for its replacement.
- **The person resolves and closes**: A mismatch is resolved only by the person's turn, whatever its form, and the person's resolution stands over anything evidence or the certificate read. Evidence alone may withdraw the AI's own flag, reported with that evidence, or show that a mismatch does not fit before the gate; a person's turn that disputes a withdrawal puts it back. Where nothing was found, or nothing was the person's to resolve, the run ends only when the person says it is done after seeing the list.
- **Significant requires demonstrable behavioral impact**: Severity = Significant requires that the mismatch produces a demonstrable behavioral consequence — downstream-decision impact, runtime divergence, gate-trajectory change. Structural-change extent (line count, file count, scope size) alone is insufficient grounds — categorize as Minor when behavioral impact is undemonstrated. This guards against false-positive gating arising from conflation of structural-change extent with applicability impact
- **Unclear owners surface first**: A mismatch the certificate cannot place is put to the person before anything else happens to it, with the claims its evidence supports; the certificate never places a mismatch it could not place.
- **Judge afresh after every write**: An adaptation changes the result, so the next pass judges the whole result against the whole context again; the run can have more open after a resolution than before it. A mismatch an adaptation aimed at and that is still found is said to be unrepaired; a write that did not land resolves nothing.
- **Form feedback**: Silence about form is not evidence about form. Too dense fails quietly — the reader skims, answers past it, stops — while too plain fails out loud, so the complaints that arrive come from one side only. Density therefore does not carry over from the previous round: each round takes it from what this request asked for, while a statement about form does carry over until it is countermanded. Read an instruction about form for the parts of a round it reaches, not for what kind of reaction it is — a complaint, a request, a symptom report and a bare preference are one input here, and sorting them by kind yields nothing the reach reading does not already give while costing a clause per kind. Change the form rather than asking which form they want; naming one is the recall this discipline exists to remove. What such an instruction reaches is whatever the active protocol leaves open in how a round is composed — its density, its ordering, its length. What it does not reach is whatever is already fixed for this round elsewhere: content the protocol requires, wording carried verbatim, an order it presents in, a cadence it caps, a turn boundary it sets. Those stay in place, and the layer that fixed them is what states why. Say in one line what changed; where the instruction overlapped something that stays, say in one line that it stays and why — that second line is owed by the overlap, not by how the instruction was worded.
