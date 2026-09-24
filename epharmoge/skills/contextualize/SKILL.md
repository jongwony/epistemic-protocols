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
How to read this block. It is core Lean 4 and elaborates as written.
Every `opaque` declaration is a judgment that is yours to make from the material in front of
you; its doc comment says what you judge there, and nothing in this block decides it for you.
Every `def`, `inductive`, and `structure` is fixed by the contract. A `theorem` line inside a
doc comment states a consequence the contract already has; it is proved outside this block
and asks nothing further of you.
-/

/-! ── FLOW ──
Epharmoge(R, X) → start(c) → contextualize(c, utterances), where c is the fused session context:
  pass(c): perform what an answer asked and the context does not yet show done — an adaptation,
    a withdrawal — then scan the evaluated target against the application context as the context
    now states it → bind each detection as a kind → split a binding that bundles several claims →
    fold the detections into what the run already carries (same claim → merge, new → open an
    occurrence) → certify every occurrence the fold touched against the claims this contract
    inscribes →
      pass:      registered and pending, once no occurrence waits on the person
      route:     relay the handoff with its fit (the command only as a hint)
      ambiguous: owed to the person at Qa
    → assess fit over pending → settle what cited evidence alone settles → write the carrier
  [a withdrawal landed] close: withdrawn — every other pending occurrence Moot
  [nothing flagged ∧ the person accepted the finding] close: confirmed
  [something flagged ∧ nothing owed ∧ adjudicated] close: disposed at registration | adjudicated
  [otherwise] present the next gate — Qa for the earliest ambiguous occurrence, otherwise Qc for
    the selected pending one, otherwise Qz on a finding that nothing was flagged — → Stop
  next utterance u: c' := pass(fuse(c, u)) → the same reading, whatever u said
    (an attribution, an answer, a Reopen, a correction, a question: each joins the context whole)
  no utterance: the gate holds; nothing is judged and nothing closes
-/

/-! ── MORPHISM ──
(R, X)
  → evaluate(result, context)          -- detect applicability mismatch
  → bind_kind(mismatch) [split where non-atomic] → absorb(detections, carried) → certify(element, local_claims) -- shared meta-backbone: bind each mismatch as a kind, fold the detections into what is already carried (same claim → merge, none → open one), then certify deficit fit (fail-closed) per element against the claims inscribed in this contract, before it enters the pending/disposition flow
  → assess_fit(result, context, mismatches) -- sort applicability fit before user judgment
  → surface(fit_scoped_mismatch) -- present mismatch with fit basis and evidence
  → judge(mismatch) → dispose(result, judgment, disposition) -- TWO AXES: whether the flagged aspect stands, then what becomes of the result (adapt / keep / discard)
  → ContextualizedExecution
requires: mismatch_detected(R, X)       -- runtime checkpoint (Phase 0), and the auto-activation condition only (Layer 2); a user-invoked run enters without it and may owe the zero-mismatch confirmation (Qz)
deficit:  ApplicationDecontextualized    -- the deficit this morphism takes, and the certificate's own claim for in-scope mismatches
preserves: X                             -- the application context is read from the fused context and never rewritten; adapt and discard change the result alone
invariant: Applicability over Correctness
invariant: certificate-before-registration  -- nothing is pending on a certificate that does not currently pass, the person's Own attribution included
invariant: transformative revalidation (NON-MONOTONE) -- an Adapt mutates the target the scan reads, so a run can have more left to settle after a disposition than before it
invariant: judgment-disposition separation -- whether the aspect stands and what becomes of the result are separate answers; only the first is relay-eligible, on cited evidence
invariant: relay closes only what leaves the artifact unchanged
-/

namespace Epharmoge

/-! ── GROUND ──
The session primitive this contract reads.
-/

inductive Origin | person | assistant | external | peer | injected | unknown
inductive Form | statement | observation | request | reasoning | summary | instruction
inductive Basis | utterance | testimony | observation | report
  deriving DecidableEq

structure Turn (P : Type) where
  origin  : Origin
  form    : Form
  content : P

abbrev Context (P : Type) := List (Turn P)

/-- What a turn may ground directly: eligibility, not truth or instruction priority. -/
def Turn.basis {P : Type} (e : Turn P) : Option Basis :=
  match e.origin, e.form with
  | .person, .statement     => some .utterance
  | .person, .observation   => some .testimony
  | .external, .observation => some .observation
  | .peer, .statement       => some .report
  | _, _                    => none

/-- Any turn a person sent, whatever its form; the form decides what it may ground
    (`Turn.basis`). -/
def Utterance (P : Type) := {e : Turn P // e.origin = .person}
def Response (P : Type) := {e : Turn P // e.origin = .assistant}
def Evidence (P : Type) := {e : Turn P //
  e.basis = some .observation ∨ e.basis = some .report ∨ e.basis = some .testimony}

def fuse {P : Type} (c : Context P) (u : Utterance P) : Context P := c ++ [u.val]

structure Cite {P : Type} (c : Context P) where
  idx  : Nat
  lt   : idx < c.length
  kind : Basis
  ok   : (c[idx]'lt).basis = some kind

/-- `supports` is the model's reading. -/
structure Coord (P A : Type) where
  admits   : Basis → Prop
  supports : Context P → Turn P → A → Prop

/-- `open_` may carry a candidate citation whose support is still short. -/
inductive Occ {P A : Type} (q : Coord P A) (c : Context P)
  | open_  (candidate : Option (Cite c))
  | filled (a : A) (src : Cite c) (allowed : q.admits src.kind)
      (supported : q.supports c (c[src.idx]'src.lt) a)

/-!
theorem fuse_extends {P : Type} (c : Context P) (u : Utterance P) :
    ∃ t, fuse c u = c ++ t

theorem ai_never_grounds {P : Type} (e : Turn P) (h : e.origin = .assistant) :
    e.basis = none
-/

/-- The same turn, cited from a longer context; what it supports is judged again against the
    context that now stands. -/
def Cite.lift {P : Type} {c : Context P} (s : Cite c) (t : Context P) : Cite (c ++ t) :=
  { idx := s.idx
    lt := by have := s.lt; simp; omega
    kind := s.kind
    ok := by rw [List.getElem_append_left s.lt]; exact s.ok }

/-! ── TYPES ── -/

variable {P : Type}

/-- `R`, the result under review: any completed work product — an AI output, an analysis
    conclusion, a decision outcome. The morphism treats every kind alike. -/
abbrev Result := String

/-- **Your reading**: the evaluated target — the result under review as the context now shows
    it, every adaptation that has landed applied, since each one's artifact write returns its
    result into the context (target succession). Correctness is presupposed at entry and never
    re-checked here. -/
opaque target : Context P → Result

/-- `significant` requires a demonstrable behavioral consequence — a downstream decision, a
    runtime divergence, a changed gate trajectory; structural extent alone is `minor`. -/
inductive Severity | critical | significant | minor

/-- The observable source an indicator was read from: the result itself or the observable
    context. -/
inductive ContextChannel | result | context | convention | environment | session

structure Indicator where
  source  : ContextChannel
  content : String

inductive Atomicity | atomic | nonAtomic

/-- A detection captured as a kind: a label that is shown and decides nothing, the claim
    (`positivePredicate`), what it stands on, and how many distinct claims the binding bundles.
    A binding that bundles several is split before anything is certified; one claim standing on
    evidence in several places is one mismatch, since how far a repair reaches is the
    disposition's question and never registration's. -/
structure KindBinding where
  label             : String
  positivePredicate : String
  evidence          : List Indicator
  atomicity         : Atomicity

/-- A deficit label. A certificate assigns only the ones this contract inscribes; the person may
    name any. -/
inductive Deficit
  /-- this contract's own: a correct result that does not fit its application context, where the
      two-axis answer space can carry it to `ContextualizedExecution` -/
  | applicationDecontextualized
  /-- a missing pre-execution fact, with no observable value to adapt to (hint: /inquire) -/
  | contextInsufficient
  /-- undefined convention or dependency ownership for the decision (hint: /bound) -/
  | boundaryUndefined
  /-- a deficit the person names that no constructor above names; emitted bare -/
  | emergent (name : String)
  deriving DecidableEq

/-- The deficits this contract inscribes. -/
def Inscribed : Deficit → Prop
  | .emergent _ => False
  | _           => True

/-- The registration-time fit of a binding against this contract's own claim and its route
    claims: every inscribed claim the evidence supports, and the cited fit. It certifies local
    admissibility — this contract's gate over its own activation — and nothing about claims
    anywhere else. -/
structure Certificate where
  claimedBy : List Deficit
  distinct  : claimedBy.Nodup
  inscribed : ∀ d ∈ claimedBy, Inscribed d
  fit       : String

inductive Status
  | pass
  | route (d : Deficit)
  | ambiguous
  | unattributable
  deriving DecidableEq

/-- Read off `claimedBy`, so nothing stored beside it can disagree: the own claim alone passes; a
    single route claim routes; several claims, or none, leave it ambiguous. -/
def Certificate.status (k : Certificate) : Status :=
  match k.claimedBy with
  | [.applicationDecontextualized] => .pass
  | [d]                            => .route d
  | _                              => .ambiguous

-- elab: an empty witness lets `certify` be declared `opaque`; it adds no meaning.
instance : Inhabited Certificate := ⟨⟨[], List.nodup_nil, by simp, ""⟩⟩

/-- **Your judgment**: fit the binding's claim against this contract's own claim and its route
    claims, reading nothing outside this contract. A function of the binding alone: ground that
    has not moved yields the same certificate, so there is no second look — the person's
    attribution is the one new ground that can arrive. An empty evidence list supports no
    claim, which lands the certificate ambiguous and puts it to the person. -/
opaque certify : KindBinding → Certificate

/-- A run-local handle naming one occurrence, assigned in ascending order when the fold opens it
    and never reused. Nothing dispatches on it; it is for pointing. -/
abbrev MismatchId := Nat

/-- One occurrence the run carries. `aspect`, `description`, `evidence`, and `severity` are its
    current reading, combined when a same-claim detection merges in; `binding` is its identity,
    whose claim stays as the opening detection stated it while its evidence takes in every later
    one's; `id` is the handle. `unrepaired` is a set-only stamp: it marks an occurrence that
    reads as the claim the latest Adapt closed — an adaptation that did not land — and gates
    nothing; it changes what the person is told. -/
structure Mismatch where
  id          : MismatchId
  aspect      : String
  description : String
  evidence    : String
  severity    : Severity
  unrepaired  : Bool
  binding     : KindBinding

/-- What judging whether two readings state one claim looks at: the claim together with what it
    stands on — never the label, a display name written afresh at every detection. -/
def identity (m : Mismatch) : String × List Indicator :=
  (m.binding.positivePredicate, m.binding.evidence)

/-- **Your judgment** (match identity): `m` and `n` state the same claim, read off `identity` on
    the accumulated context. Semantic sameness is not decidable, so nothing here settles it for
    you; it need not be transitive, and a different arrival order can partition detections
    differently. -/
opaque SameClaim : Context P → Mismatch → Mismatch → Prop

/-- **Your record**, read from the context: every occurrence the fold has carried, in id order.
    Each scan's detections are bound, split, then folded in one at a time: where one states the
    claim of an occurrence already carried (`SameClaim`), it merges into it, which keeps its id
    and statement of the claim, takes in the detection's evidence, and combines the reading;
    otherwise it opens an occurrence with the next id. The stamp is decided before either arm,
    against the occurrence the latest Adapt closed and no other. An occurrence already closed is
    not excluded: a return that opens its own occurrence is a new registration, owed its own
    close. Cumulative: an occurrence once carried stays. -/
opaque mismatches : Context P → List Mismatch

/-- The person's answer at Qa: whose the mismatch is — never whether it stands. -/
inductive Attribution
  /-- a fit problem, handled here -/
  | own
  /-- another deficit's: handed to it -/
  | route (d : Deficit)
  /-- none of these: several claims stand, or none does -/
  | unattributable

/-- **Your judgment**: the cited turn attributes occurrence `i`. -/
opaque AttributionSupported : MismatchId → Context P → Turn P → Attribution → Prop

/-- A mismatch the certificate could not place is placed only by the person's statement. -/
def attributionCoord (i : MismatchId) : Coord P Attribution :=
  { admits := (· = .utterance), supports := AttributionSupported i }

-- elab: an open witness lets the occupancy readings below be declared `opaque`.
instance {A : Type} {q : Coord P A} {c : Context P} : Inhabited (Occ q c) := ⟨.open_ none⟩

/-- **Your reading**: the person's attribution of `i`, at Qa or in any later utterance; `open_`
    where none reaches it. -/
opaque attribution : (c : Context P) → (i : MismatchId) → Occ (attributionCoord i) c

def filledValue {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Option A
  | .open_ _     => none
  | .filled a .. => some a

/-- How an occurrence stands: the person's attribution settles it where one reaches it;
    otherwise the certificate's own reading does. -/
def status (c : Context P) (m : Mismatch) : Status :=
  match filledValue (attribution c m.id) with
  | some .own            => .pass
  | some (.route d)      => .route d
  | some .unattributable => .unattributable
  | none                 => (certify m.binding).status

/-- The epistemic axis: does the flagged aspect genuinely fail to fit the application context? -/
inductive Verdict | upheld | overruled
  deriving DecidableEq

/-- The repair axis the person answers at Qc: what becomes of the result. -/
inductive Repair
  | adapt (direction : String)
  | keep
  /-- withdraw the result; `none` when nothing takes its place -/
  | discard (replacement : Option Result)

/-- `A`, the person's answer at Qc, drawn from the value space every passing occurrence is judged
    in: a verdict and a repair, well formed — an overruled aspect leaves the result untouched.
    Upheld with Keep is reachable and distinct: the mismatch stands and the result is accepted
    anyway. Premise: one answer carries one disposition for the mismatch the gate presented. -/
structure Answer where
  verdict    : Verdict
  repair     : Repair
  wellFormed : verdict = .overruled → repair = .keep

/-- **Your judgment**: the cited turn gives this answer for occurrence `i`. -/
opaque AnswerSupported : MismatchId → Context P → Turn P → Answer → Prop

/-- What becomes of the result is answered only by the person's statement. -/
def answerCoord (i : MismatchId) : Coord P Answer :=
  { admits := (· = .utterance), supports := AnswerSupported i }

/-- **Your reading**: the person's answer for `i` at Qc; `open_` until one reaches it. -/
opaque answer : (c : Context P) → (i : MismatchId) → Occ (answerCoord i) c

/-- **Your judgment** (judgment settled): the cited evidence, read against the evaluated target
    and the application context, admits this verdict alone — Upheld where no reading lets the
    aspect stand warranted, Overruled where no reading lets it fail, located through the
    occurrence's own fit justification. Where the evidence admits more than one reading the
    verdict is the person's. -/
opaque RelaySupported : MismatchId → Context P → Turn P → Verdict → Prop

/-- A relayed verdict stands on evidence, never on the person's statement, which is an answer. -/
def relayCoord (i : MismatchId) : Coord P Verdict :=
  { admits := (· ≠ .utterance), supports := RelaySupported i }

/-- **Your reading**: the verdict cited evidence alone settles for `i`, with that evidence cited;
    `open_` where it admits more than one reading. Read against the target and fit map the
    selection is made on. A relayed Overruled closes the occurrence once, and within the run the
    aspect returns to judgment only where a later Adapt re-registers it. -/
opaque relay : (c : Context P) → (i : MismatchId) → Occ (relayCoord i) c

/-- How an occurrence was closed. -/
inductive Disposition
  /-- the person's repair at Qc, or the Keep a relayed Overruled leaves -/
  | answered (r : Repair)
  /-- handed to another deficit at registration: on the certificate's fit, or the person's
      attribution -/
  | route (d : Deficit)
  /-- the person found no claim that holds; the certificate never assigns this alone -/
  | residual
  /-- still pending when a Discard withdrew the target; never judged -/
  | moot

inductive JudgedBy | user | relay | unjudged
  deriving DecidableEq

/-- Who assigned a disposition, and the turn or fit it stands on. -/
inductive AssignedBy
  | certificate (fit : String)
  | attribution (turn : Nat)
  | relay
  | loop
  | user (turn : Nat)

/-- One ledger entry: the verdict, who settled it and the turn it stands on — the person's answer,
    or the evidence a relay cites — and the disposition with who assigned it. A close at
    registration is unjudged: an attribution says whose the mismatch is, not whether it
    stands. -/
structure DispositionRecord where
  verdict     : Option Verdict
  judgedBy    : JudgedBy
  judgedOn    : Option Nat
  disposition : Disposition
  assignedBy  : AssignedBy

/-- A close at registration: the person's Route or Unattributable attribution, or a route the
    certificate's fit alone settled. -/
def closedAtRegistration (c : Context P) (m : Mismatch) : Option DispositionRecord :=
  match attribution c m.id with
  | .filled (.route d) src _ _      => some ⟨none, .unjudged, none, .route d, .attribution src.idx⟩
  | .filled .unattributable src _ _ => some ⟨none, .unjudged, none, .residual, .attribution src.idx⟩
  | .filled .own _ _ _              => none
  | .open_ _ =>
    match (certify m.binding).status with
    | .route d => some ⟨none, .unjudged, none, .route d, .certificate (certify m.binding).fit⟩
    | _        => none

/-- A close of a registered occurrence: the person's answer — the verdict relayed where the
    evidence had settled it and the answer agrees, the person's where it goes against it — or,
    with no answer, the Keep a relayed Overruled leaves. An Adapt or Discard is recorded as what
    happened: the pass performs its write before anything reads the ledger. -/
def closedAtJudgment (c : Context P) (m : Mismatch) : Option DispositionRecord :=
  match answer c m.id with
  | .filled a src _ _ =>
    match relay c m.id with
    | .filled v rs _ _ =>
      if v = a.verdict then
        some ⟨some a.verdict, .relay, some rs.idx, .answered a.repair, .user src.idx⟩
      else some ⟨some a.verdict, .user, some src.idx, .answered a.repair, .user src.idx⟩
    | .open_ _ => some ⟨some a.verdict, .user, some src.idx, .answered a.repair, .user src.idx⟩
  | .open_ _ =>
    match relay c m.id with
    | .filled .overruled rs _ _ => some ⟨some .overruled, .relay, some rs.idx, .answered .keep, .relay⟩
    | _ => none

/-- The record an occurrence's standing gives it, read from the context; `none` while it waits on
    the person — at Qa, or at Qc once registered. -/
def record (c : Context P) (m : Mismatch) : Option DispositionRecord :=
  match status c m with
  | .pass => closedAtJudgment c m
  | _     => closedAtRegistration c m

/-- Registered and open: passing — on the fit, or on the person's Own attribution — and not yet
    closed. -/
def pending (c : Context P) : List Mismatch :=
  (mismatches c).filter (fun m => decide (status c m = .pass) && (record c m).isNone)

/-- Occurrences the certificate could not place, waiting on the person at Qa. -/
def awaiting (c : Context P) : List Mismatch :=
  (mismatches c).filter (fun m => decide (status c m = .ambiguous))

/-- An answer's withdrawal: the occurrence whose Discard the person answered, and what takes the
    result's place. -/
def withdrawal (c : Context P) : Option (Mismatch × Option Result) :=
  (mismatches c).findSome? fun m =>
    match status c m, filledValue (answer c m.id) with
    | .pass, some ⟨_, .discard r, _⟩ => some (m, r)
    | _, _                           => none

/-- The person's answer at Qz. -/
inductive ZeroAnswer
  /-- no aspect is unwarranted; the execution stands as it is -/
  | accept
  /-- the scan missed this aspect; look again, focused on it -/
  | reopen (aspect : String)

/-- **Your judgment**: the cited turn answers the latest zero-mismatch finding this way. -/
opaque ZeroSupported : Context P → Turn P → ZeroAnswer → Prop

/-- That nothing was flagged is accepted only by the person's statement. -/
def zeroCoord : Coord P ZeroAnswer := { admits := (· = .utterance), supports := ZeroSupported }

/-- **Your reading**: the person's answer to the latest zero-mismatch finding; `open_` until one
    reaches it. A Reopen answers the finding it was given on, so the focused scan's finding is
    the next one to answer. -/
opaque zeroAnswer : (c : Context P) → Occ (zeroCoord (P := P)) c

def Accepted (c : Context P) : Prop := filledValue (zeroAnswer c) = some .accept

/-- **Your judgment** (warranted, negated): aspect `a` of the evaluated target does not fit the
    application context as the fused context states it. The per-aspect fit judgment and nothing
    else: correctness is not part of it. -/
opaque Unwarranted : Context P → String → Prop

/-- An aspect is disposed when a record closes an occurrence of it and none of its occurrences is
    pending: re-registration un-disposes it. Keyed on the aspect label, which names what is
    quantified over and decides nothing about identity. -/
def Disposed (c : Context P) (a : String) : Prop :=
  (∃ m ∈ mismatches c, m.aspect = a ∧ (record c m).isSome) ∧ ∀ m ∈ pending c, m.aspect ≠ a

/-- Every unwarranted aspect of the evaluated target is disposed. -/
def Adjudicated (c : Context P) : Prop := ∀ a, Unwarranted c a → Disposed c a

/-- The fit sorting over pending, before the person judges: what warrants a flagged aspect after
    all, what conflicts, what hinges on an unverified condition, adaptation options tied to a
    conflict or condition, and questions whose answer could change the next judgment. Each entry
    names the occurrence it answers for by id, never by aspect label. -/
structure FitMap where
  justifications : List (MismatchId × String)
  conflicts      : List MismatchId
  depends        : List (MismatchId × String)
  options        : List (MismatchId × String)
  questions      : List (MismatchId × String)

inductive FitCategory | conflict | dependent | open_ | supported

def fitCategory (f : FitMap) (i : MismatchId) : FitCategory :=
  if i ∈ f.conflicts then .conflict
  else if f.depends.any (·.1 == i) then .dependent
  else if f.questions.any (·.1 == i) then .open_
  else .supported

-- elab: an empty witness lets `fitMap` be declared `opaque`; it adds no meaning.
instance : Inhabited FitMap := ⟨⟨[], [], [], [], []⟩⟩

/-- **Your judgment** (assess fit): the fit map over `pending c` against the evaluated target and
    the application context, recomputed on every pass, so every reader takes the one the context
    now supports. It classifies and never suppresses. -/
opaque fitMap : Context P → FitMap

/-- **Your selection** of the pending occurrence Qc presents next: by severity (critical first),
    then fit category (conflict, dependent, open, supported), then the oldest registration, read
    off the carrier's line order rather than off the id. -/
opaque selectNext : Context P → Option Mismatch

/-- **Your record**, read from the context: the locator the carrier-creating write returned — the
    one durable record every registration and close is written into; `none` where nothing ever
    registered. -/
opaque carrier : Context P → Option String

/-- **Your record**: contrary grounds you presented before the gates the closing answers
    answered — a relayed verdict an answer went against, with its cited evidence, among them —
    attached to the closure; empty when there were none. -/
opaque dissent : Context P → List String

/-- `ApplicabilityVerdict`: the context at closure, what the person is left with (`none` when a
    withdrawal left nothing), the ledger — one record per closed occurrence — the carrier's
    locator, and the dissent attached to the closure. The re-scan count is read off the ledger:
    one per Adapt. -/
structure ApplicabilityVerdict (P : Type) where
  context : Context P
  target  : Option Result
  ledger  : List (MismatchId × DispositionRecord)
  carrier : Option String
  dissent : List String

def ledgerOf (c : Context P) : List (MismatchId × DispositionRecord) :=
  (mismatches c).filterMap (fun m => (record c m).map (m.id, ·))

def scanCount (v : ApplicabilityVerdict P) : Nat :=
  (v.ledger.filter fun e => match e.2.disposition with
    | .answered (.adapt _) => true
    | _                    => false).length

/-- `ContextualizedExecution` is the verdict under the closure that emitted it. -/
inductive Outcome (P : Type)
  /-- nothing was flagged and the person accepted that finding -/
  | confirmed (v : ApplicabilityVerdict P)
  /-- mismatches were flagged and every one closed at registration — handed elsewhere or left
      unattributable — so nothing reached the disposition loop and the target is unadapted -/
  | disposedAtRegistration (v : ApplicabilityVerdict P)
  /-- every unwarranted aspect disposed, the last close answered at Qc or relayed -/
  | adjudicated (v : ApplicabilityVerdict P)
  /-- the person withdrew the evaluated result; the replacement is carried, not adjudicated -/
  | withdrawn (v : ApplicabilityVerdict P)
  | holding (c : Context P)

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
A pass is the silent work. It first performs what an answer asked and the context does not yet
show done — the adaptation or withdrawal, whose result returns into the context. Phase 0 then
scans, binds, splits, folds, and certifies what the fold touched; Qa takes the ambiguous ones one
per turn, and registration, the fit map, and selection wait until every attribution is in. Phase 1
settles what cited evidence alone settles. The pass's record follows, and then the carrier writes.
Either a closure fires, or `respond` presents the next gate. Each person utterance is fused, and
the next pass reads it; after an Adapt that pass is the Phase 2 re-scan.
-/

/-- **Your action** for a pass, before anything is read: where an answer in the context calls for
    an adaptation or a withdrawal the context does not yet show performed, the artifact write that
    performs it, returning the adapted result or the withdrawal. -/
opaque perform : Context P → List (Evidence P)

/-- **Your record** of a pass, written once its writes have entered the context: the scan and what
    it reached — on the first pass, after an Adapt, after a Reopen (focused on the aspect it
    named), and after an utterance that states something new about the result or its application;
    on ground this run already scanned, the scan yields the claims already carried — then
    bindings, splits, the fold with its ids and stamps, certificates with their fits, route
    handoffs, the fit map, and relayed verdicts with their cited evidence. While any occurrence is
    ambiguous the pass records certification only, so Qa comes first. `mismatches`, `fitMap`,
    and `relay` are read from these turns. A record grounds nothing. -/
opaque passRecord : Context P → List (Response P)

/-- **Your action**: the carrier writes — created at the first registration, amended at every
    later registration and close, and bringing into line the entry of every registered
    occurrence the fold grew — each returning its locator. -/
opaque persist : Context P → List (Evidence P)

def pass (c : Context P) : Context P :=
  let c₁ := c ++ (perform c).map (·.val)
  let c₂ := c₁ ++ (passRecord c₁).map (·.val)
  c₂ ++ (persist c₂).map (·.val)

/-- A closure fires: a withdrawal landed; or nothing was flagged and the person accepted it; or
    something was flagged, nothing waits on the person, and every unwarranted aspect is
    disposed. -/
def Closable (c : Context P) : Prop :=
  (withdrawal c).isSome ∨
  ((mismatches c).isEmpty ∧ Accepted c) ∨
  (¬ (mismatches c).isEmpty ∧ awaiting c = [] ∧ pending c = [] ∧ Adjudicated c)

open Classical in
noncomputable def close (c : Context P) : Outcome P :=
  match withdrawal c with
  | some (_, r) =>
    .withdrawn ⟨c, r, ledgerOf c ++ (pending c).map (fun m => (m.id,
      ⟨none, .unjudged, none, .moot, .loop⟩)), carrier c, dissent c⟩
  | none =>
    if (mismatches c).isEmpty then .confirmed ⟨c, some (target c), [], carrier c, dissent c⟩
    else if ∀ m ∈ mismatches c, status c m ≠ .pass then
      .disposedAtRegistration ⟨c, some (target c), ledgerOf c, carrier c, dissent c⟩
    else .adjudicated ⟨c, some (target c), ledgerOf c, carrier c, dissent c⟩

open Classical in
/-- `respond` presents the next gate. Qa, for the earliest ambiguous occurrence: before the
    question its aspect, description, and evidence with its channel, and the claims that evidence
    supports, or that none does. Qc, for the pending occurrence `selectNext` picks: before the question its
    description, the evidence, the fit basis and adaptation options from the fit map as it now
    stands, the certificate fit, its severity, whether it is stamped unrepaired, and a relayed
    verdict with its cited evidence where one settled; the gate keeps all four answers. Qz, when
    nothing was flagged: the finding and how far the scan reached, the focused scan's included
    after a Reopen. A relayed Overruled is reported with its cited evidence in the same turn, and
    route handoffs with their fit. -/
noncomputable def contextualize (respond : Context P → Response P) :
    Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let c₁ := pass (fuse c u)
    if Closable c₁ then close c₁
    else contextualize respond (c₁ ++ [(respond c₁).val]) us

open Classical in
noncomputable def start (respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  let c₁ := pass c
  if Closable c₁ then close c₁
  else contextualize respond (c₁ ++ [(respond c₁).val]) us

/-! ── LOOP ──
Transformative revalidation (NON-MONOTONE): an Adapt produces a new target, and the next pass
scans it, so an adaptation can breed mismatches that did not exist before. Re-scanning is
disposition-keyed: Adapt → the new target is scanned for remaining and newly emerged mismatches;
Keep → nothing mutated, nothing new; Discard → the target is gone and the run closes withdrawn;
Route and Residual → assigned at registration. The Adapt's close precedes the re-scan's fold, so a
detection that reads as the claim it closed cannot merge into it: it merges into whichever pending
occurrence states that claim, or opens its own carrying the stamp — either way the adaptation that
did not land shows as a claim that came back. A re-scan certifies every occurrence the fold
touched — the ones it opened and the ones whose evidence it grew — and a certificate that stops
passing takes a registered occurrence out of pending as readily as it keeps a new one from
entering. A re-registration reaches Qc like any other: the target has moved, so the question is
new. One occurrence per claim is what every scan is directed to reach, not a property the contract
can guarantee. The loop does not only shrink, which is why nothing counts down. The loop is
dialogue: each cycle re-enters a Constitution gate, and the person ends it.
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
Every closure is read where it fires and nowhere else. confirmed: nothing was flagged and the
person accepted the finding — a Reopen whose focused scan still finds nothing is put back to them
with what that scan reached. disposedAtRegistration: every flagged mismatch closed at
registration. adjudicated: every unwarranted aspect of the evaluated target disposed, nothing
waiting on the person. withdrawn: the result withdrawn, every other pending occurrence Moot, and no
claim made about the replacement. Fit is claimed for the evaluated target only: an adapted verdict
claims fit and not correctness, which was presupposed at entry and is not re-checked anywhere in
this protocol. Where nothing waits on the person and an unwarranted aspect is still undisposed —
the scan missed it — no closure fires.
Convergence evidence: one row per record in the ledger, grouped under its aspect and headed by the
occurrence's id — `(id → aspect → verdict → disposition)` with who settled each axis and what it
stood on, a registration-time close included, and the re-scan count (`scanCount`). The certificate's handoffs are printed apart from
the person's attributions, and relayed retractions apart from the person's. Each row notes
whether the occurrence was stamped unrepaired. RETURNED names the most recently closed occurrence
of the same claim; CIRCLING states once how many occurrences one claim has accumulated, a framing
signal and not a score. The dissent attached to the closure is shown. Demonstrated, not asserted.
-/

/-!
Nothing is pending on a certificate that does not currently pass.
theorem pending_passes {c : Context P} {m : Mismatch} (h : m ∈ pending c) :
    status c m = .pass

A person's route attribution reads as a route, whatever deficit they named.
theorem person_route_is_route (c : Context P) (m : Mismatch) (d : Deficit)
    (h : filledValue (attribution c m.id) = some (.route d)) : status c m = .route d

A handoff is never a verdict on fit.
theorem route_unjudged (c : Context P) (m : Mismatch) (r : DispositionRecord) (d : Deficit)
    (h : record c m = some r) (hd : r.disposition = .route d) : r.judgedBy = .unjudged

An overruled aspect leaves the result untouched.
theorem overruled_keeps (c : Context P) (m : Mismatch) (r : DispositionRecord)
    (h : record c m = some r) (hv : r.verdict = some .overruled) : r.disposition = .answered .keep

A close no one answered edits nothing.
theorem relay_close_keeps (c : Context P) (m : Mismatch) (r : DispositionRecord)
    (h : record c m = some r) (ha : r.assignedBy = .relay) : r.disposition = .answered .keep

A zero-mismatch closure follows a person's utterance accepting it.
theorem confirmed_by_person (respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (v : ApplicabilityVerdict P)
    (h : contextualize respond c us = .confirmed v) :
    ∃ (c₀ : Context P) (u : Utterance P), v.context = pass (fuse c₀ u) ∧ Accepted v.context

An attribution, an answer, and an acceptance are each filled only by a person's statement.
theorem attributed_by_utterance {c : Context P} {i : MismatchId} {s : Cite c}
    (ok : (attributionCoord (P := P) i).admits s.kind) : s.kind = .utterance

theorem answered_by_utterance {c : Context P} {i : MismatchId} {s : Cite c}
    (ok : (answerCoord (P := P) i).admits s.kind) : s.kind = .utterance

theorem accepted_by_utterance {c : Context P} {s : Cite c}
    (ok : (zeroCoord (P := P)).admits s.kind) : s.kind = .utterance
-/

/-! ── TOOL GROUNDING ── -/
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed

inductive Annot | sense | observe | track | transform | dispatch | constitution | extension

inductive Op | scan | bindKind | split | matchIdentity | absorb | certify | certifyRoute | qa
             | qz | assessFit | relayUpheld | relayOverruled | qc | adapt | discard | persist
             | readAnswer | trivialConverge | converge | seam

def grounding : Op → Annot × String
  | .scan            => (.sense, "Internal analysis: the scan re-executes nothing and writes nothing — it reads the completed result and the observable context, which keeps the information source non-circular; focused on the named aspect after a Reopen")
  | .bindKind        => (.sense, "Internal analysis: capture each detection as a kind — label, claim, evidence, and how many distinct claims it bundles; never how far a repair would reach")
  | .split           => (.sense, "Internal analysis: a binding that bundles several distinct claims yields one atomic binding per claim before the fold, so no compound is registered")
  | .matchIdentity   => (.sense, "Internal analysis: which carried occurrence, if any, states this detection's claim — off identity, never the label — and whether it reads as the claim the latest Adapt closed, which is the one turn the unrepaired stamp is decided")
  | .absorb          => (.sense, "Internal analysis: fold the detections one at a time into what the run carries — merge into the occurrence named, or open one with the next id — after the split and before the certificate")
  | .certify         => (.sense, "Internal analysis: fit each touched occurrence's claim against this contract's own claim and its route claims, reading nothing outside this contract; the claims the evidence supports, and the cited fit")
  | .certifyRoute    => (.extension, "TextPresent+Proceed: where a route claim alone holds an occurrence, report the deficit with the cited fit and the command only as a hint — a missing pre-execution fact (/inquire), undefined convention or dependency ownership (/bound); nothing is dispatched")
  | .qa              => (.constitution, "present: one ambiguous occurrence per turn in id order — before the gate its aspect, description, evidence with its channel, and the claims the evidence supports or that none does; the gate asks whose it is — a fit problem handled here, handed to a named deficit, or none of these — with each option's consequence; a deficit the person names outside the set is a route emitted bare")
  | .qz              => (.constitution, "present: nothing was flagged — the finding with how far the scan reached, the focused scan's after a Reopen; the answer accepts it or names an aspect to look at again")
  | .assessFit       => (.sense, "Internal analysis: the fit map over pending against the target and context as they now stand, recomputed every pass")
  | .relayUpheld     => (.extension, "TextPresent+Proceed: where cited evidence admits no reading under which the aspect stands warranted, report the verdict with that evidence before Qc; the gate still carries all four answers, and an answer that goes against it is the person's, the relayed evidence attached")
  | .relayOverruled  => (.extension, "TextPresent+Proceed: where cited evidence admits no reading under which the aspect fails to stand, report the aspect, its retraction, and the evidence before writing anything, then close it as Overruled with Keep and proceed without yielding the turn; the result is untouched")
  | .qc              => (.constitution, "present: the selected occurrence scoped by the fit map as it now stands, a relayed verdict with its evidence where one settled; the answers — does not apply; real but fine as is; adapt it; withdraw it — each with its consequence")
  | .adapt           => (.transform, "artifact write: the Adapt direction applied to the evaluated target; the adapted result returns into the context and the next pass re-scans it")
  | .discard         => (.transform, "artifact write: withdraw the result and put the replacement in its place, or remove it when nothing takes its place")
  | .persist         => (.track, "record, record update: the one carrier entry — created at the first registration, amended at every later registration and close, one line per registration keyed by id; its locator is carried out on the verdict")
  | .readAnswer      => (.sense, "Internal analysis: the latest utterance read whole with the fused context — an attribution, an answer, a Reopen, and whatever else it says, for the next pass")
  | .trivialConverge => (.extension, "TextPresent+Proceed: every flagged mismatch closed at registration — each handoff named with its hint, each residual with what was left unresolved; the target unadapted")
  | .converge        => (.extension, "TextPresent+Proceed: the per-record trace, the handoffs the certificate made apart from those the person attributed and relayed retractions apart from the person's, unrepaired stamps, RETURNED and CIRCLING readings, the dissent attached to the closure, and what the verdict does not claim")
  | .seam            => (.extension, "TextPresent+Proceed: at a user-declared chain naming the next protocol, proceed to it citing that source; every Constitution gate inside Epharmoge and the next protocol fires unchanged")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Mismatch-domain resolution emergent via session context.
contextualize ∘ caller-loop: this protocol is built to run inside another loop. It keeps
collating the artifact against the accumulated context as the artifact changes; it does not
establish that the artifact is correct, and assigns no one else that duty — the verdict states
its own silence.
-/

end Epharmoge
```

## Core Principle

**Applicability over Correctness**: Surface evidence that a correct result does not fit its application context; contextual fitness is the question this protocol settles.

## Mode Activation

### Activation

Layer 1 activates whenever the user invokes `/contextualize`, including when the scan may find no mismatch. Layer 2 may activate only after Aitesis operational evidence has established the recurring pattern “context gathered but application mismatched,” and only when the post-execution result satisfies the formal auto-activation guard. Prior-session recall indices may seed the silent scan when available; they never settle the user's judgment.

## Protocol

The formal blocks define execution. This section fixes the user-facing rendering.

### Mismatch judgment and disposition

Surface one selected mismatch at a time. Before its question, show its description, result-and-context evidence, fit basis, deficit-fit basis, and severity. When `unrepaired` is set, say that the prior requested adaptation did not resolve this claim. Keep one carrier entry for the evaluated result, one line per registration keyed by `id`; each line projects the mismatch, status, and completed disposition record, including who settled each axis and both grounds.

The gate renders the `Judgment × Disposition` value space in plain language:

```
How would you like to handle this applicability mismatch?

Options:
1. **Doesn't actually apply** — the flagged aspect fits after all; the result stands unchanged
2. **Real, but fine as-is** — the mismatch stands and the result is accepted anyway: [stated assumption about context fit]
3. **Adapt it** — the mismatch stands; change the result: [brief direction prompt]
4. **Withdraw it** — the mismatch stands and the result should not be used: [what takes its place, if anything]
```

Options 1 and 2 remain visibly distinct: one retracts the mismatch; the other accepts a mismatch that stands. Materialize an evident adaptation direction or replacement without changing its formal constructor. If the judgment is relayed `Upheld`, cite its basis before the gate and still present all four options: an answer that goes against the relayed verdict is the user's, and the relayed evidence stays attached to the verdict. If it is relayed `Overruled`, report the retracted aspect and cited fit evidence before closing it as `(Overruled, Keep)` without a gate. A relay never authorizes an edit.

After `Adapt`, report that the changed result is re-scanned for fit and that Epharmoge establishes no correctness claim for it. After `Discard`, report that the replacement is carried without a fit claim. The convergence trace distinguishes user and relay retractions, accepted mismatches, adaptations, withdrawals, returns, unresolved adaptations, and — among the handoffs — those the certificate made from those the user attributed.

### Attribution of an ambiguous mismatch

When the certificate cannot say whose a mismatch is, put it to the user before anything else happens to it. Before the question, show the mismatch, its evidence, and which of the inscribed claims that evidence supports — or that none does. The gate renders the `Attribution` answer space in plain language, one option per supported claim:

```
This mismatch could be more than one kind of problem, and the evidence doesn't settle which. Whose is it?

Options:
1. **A fit problem — handle it here** — it stays in this review and gets its own judgment later
2. **Belongs to [deficit] — hand it off** — recorded as handed to that protocol: [command hint where one exists]
3. **None of these** — recorded as unattributed; nothing is done with it here
```

Ask about one mismatch per turn. An answer here says whose the mismatch is and nothing about whether it stands; only the first option leads to the judgment gate above. Do not close an ambiguous mismatch without this question — a mismatch the certificate could not place is the user's to place.

## Rules

- **Non-circularity**: Information source is the result itself compared against context, not pre-execution context scans
- **Round composition**: Compose each round so the reader can act on it without reassembling it — everyday language rather than this file's formal vocabulary, the judgment set beside the evidence it rests on together with the differential implication that matters for the next move, and analytical context laid out before a gate rather than inside it, so the gate carries the question and each option's differential implication. Read `references/round-composition.md` before composing when a term's rendering has to hold across the session or wording has to be carried through unchanged, when some of what is in view belongs to a later round or a trace rather than this one, or when this protocol's own phases bear on where a sentence sits relative to a gate.
- **Verdict scope**: Present the per-mismatch transformation trace before the verdict. An adapted verdict claims fit, not correctness; a withdrawal verdict claims neither fit nor correctness for its replacement.
- **Zero-mismatch surfacing**: If the scan detects no context mismatches, present this finding with reasoning and how far the scan reached for user confirmation. A `Reopen` whose focused re-scan still finds nothing is presented again with what that focused scan reached; only the user's acceptance closes it.
- **Judgment-only relay**: A verdict may be relayed as `Upheld` or `Overruled` only from the current target's cited fit evidence, and the citation names the evidence turn it stands on. `Upheld` is presented with that evidence before the full disposition gate, where the user may still answer against it; `Overruled` reaches `(Overruled, Keep)` only because an overruled aspect leaves nothing to repair. `Qz` and every value-bearing disposition remain constitutive.
- **Significant requires demonstrable behavioral impact**: Severity = Significant requires that the mismatch produces a demonstrable behavioral consequence — downstream-decision impact, runtime divergence, gate-trajectory change. Structural-change extent (line count, file count, scope size) alone is insufficient grounds — categorize as Minor when behavioral impact is undemonstrated. This guards against false-positive gating arising from conflation of structural-change extent with applicability impact
- **Ambiguity surfaces**: An ambiguous certificate is put to the user at `Qa` with the claims its evidence supports, one mismatch per turn, before the mismatch registers or closes. The user's attribution — handle it here, hand it to a named deficit, or none of these — is what settles pass, route, or `Residual`; the certificate never closes a mismatch it could not place, and the AI takes no second look at ground that has not moved.
- **Certificate before registration; revalidate after adaptation**: On both scans, run KindBinding → fail-closed certificate → value space over every element the fold touched before it enters or remains in `pending`. Route a matched sibling deficit; put an ambiguous claim to the user at `Qa`. `Adapt` mutates the evaluation target, so re-scan it, re-derive every touched element's certificate and value space, remove any element that no longer passes, and register newly passing elements. The loop may therefore gain mismatches after a disposition.
- **Form feedback**: Silence about form is not evidence about form. Too dense fails quietly — the reader skims, answers past it, stops — while too plain fails out loud, so the complaints that arrive come from one side only. Density therefore does not carry over from the previous round: each round takes it from what this request asked for, while a statement about form does carry over until it is countermanded. Read an instruction about form for the parts of a round it reaches, not for what kind of reaction it is — a complaint, a request, a symptom report and a bare preference are one input here, and sorting them by kind yields nothing the reach reading does not already give while costing a clause per kind. Change the form rather than asking which form they want; naming one is the recall this discipline exists to remove. What such an instruction reaches is whatever the active protocol leaves open in how a round is composed — its density, its ordering, its length. What it does not reach is whatever is already fixed for this round elsewhere: content the protocol requires, wording carried verbatim, an order it presents in, a cadence it caps, a turn boundary it sets. Those stay in place, and the layer that fixed them is what states why. Say in one line what changed; where the instruction overlapped something that stays, say in one line that it stays and why — that second line is owed by the overlap, not by how the instruction was worded.
- **Kind → resolution form → repair locus**: Bind the mismatch kind first, settle its resolution form second, and let the repair locus appear only as the edit `Adapt` or `Discard` makes. Repair extent never determines `atomicity`, mismatch identity, registration, or convergence; a partial repair remains visible through the re-scan.
- **Identity, occurrence, and reading stay distinct**: `identity(m)` names the claim and its supporting evidence, `id` names one run-local occurrence, and `aspect` is its current display reading. Match returns by identity, give every re-registration its own occurrence, surface `unrepaired` when an adaptation did not land, and merge a same-claim detection into the carried element without replacing its identity or handle.
