---
name: sublate
description: "Vet working context by dialectical antithesis before action. Type: (ContextSuspect, User, VET, WorkingContext) → VettedContext"
---

# Elenchus Protocol

Vet working context by dialectical antithesis before action through structured per-claim disposition judgment, resolving suspect context into vetted context. Type: `(ContextSuspect, User, VET, WorkingContext) → VettedContext`.

## Definition

**Elenchus** (ἔλεγχος): A dialogical act of cross-examination — from the Socratic refutation tradition meaning "testing by argument" — resolving suspect working context into vetted context through provenance challenge, counterfactual gap forecasting, cross-source consistency check, and inference-fallacy archetype scan before pre-execution sync. The protocol's lexical verb is `/sublate`. Each audit — a source under one claim it is read as authority for — undergoes the motion of stating that claim, surfacing what would shake it, and then deciding what to make of it in light of that challenge (the Hegelian *Aufhebung* — preserve + negate + lift up — supplies the source vocabulary).

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
Elenchus(W) → pass(c) → sublate(c, utterances), where c is the fused session context:
  pass(c): identify the sources that warrant audit → bind each to the claim it is read as
    authority for → split a binding that bundles several claims → certify each claim against
    the claims this contract inscribes →
      pass:      narrow → tag → posit an antithesis
      route:     relay the handoff with its fit (the command only as a hint)
      ambiguous: owed to the person at Qa
    → record
  [nothing owed] close: no candidate | none claimed | vetted, with the trace
  [something owed] present the next gate — Qa for the earliest ambiguous candidate, otherwise Qs
    for a batch of admitted claims whose judgment is open — → Stop
  next utterance u: c' := pass(fuse(c, u)) → the same reading, whatever u said
    (an attribution, a judgment with its optional instruction, a correction, a question: each
     joins the context whole, and the next pass reads it)
  a met Revisit: the next pass re-binds and re-certifies that audit, posits again, and asks again
  no utterance: the gate holds; nothing is judged and nothing closes
-/

/-! ── MORPHISM ──
WorkingContext
  → identify(high_leverage_sources)            -- silent scan for sources warranting audit
  → bind_kind(source) → split_binding(binding, source) → certify(binding, local_claims) → bind_value_space(audit, prospect)   -- the admission backbone, in that order, before any tagging, antithesis, or surfacing
  → tag(provenance, freshness, leverage)       -- metadata triple per admitted audit
  → posit(antithesis per admitted audit)       -- Pattern A ∪ Pattern B ∪ Pattern C ∪ Pattern D ∪ Emergent(Pattern)
  → present(antitheses as text, then the reach of a judgment, then the question)
  → judge(disposition per audit)               -- the person's, at Qs: an open verdict and an optional instruction
  → emit(VettedContext with disposition ledger)
  → VettedContext
requires: working_context_pre_execution_committed   -- runtime checkpoint (Phase 0)
deficit:  ContextSuspect                            -- activation precondition (Layer 1)
preserves: source_chain                             -- the context is read and never rewritten; binding, antithesis, and disposition annotate it
invariant: Dialectical Vetting over Silent Trust
invariant: certificate-before-surfacing             -- only a passing certificate, or the person's Own attribution, lets a claim be tagged, challenged, or asked
-/

namespace Elenchus

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

/-- `W`, `WorkingContext`: the context the pending action was committed against. Every source
    it rests on is a turn of it — a statement, a document or tool read, an inference, a record
    of an earlier session — and its origin and form are that turn's own. Read, never rewritten. -/
abbrev WorkingContext (P : Type) := Context P

/-- The pending action: what is about to be done, and the turns it leans on. -/
structure Prospect where
  intent  : String
  leansOn : List Nat
  deriving Inhabited  -- elab: lets `prospect` be declared `opaque`

/-- **Your reading** of the pending action the working context was committed against. -/
opaque prospect : Context P → Prospect

/-- A source, named by the index of the turn that carries it; the context only grows, so the
    index names it permanently. -/
abbrev SourceRef := Nat

/-- **Your judgment**, silent: the sources that warrant audit — unusually load-bearing, older
    than the horizon for their origin, reached through a long provenance chain, in tension with
    another source about the same referent, or an inference used as a premise. -/
opaque identify : Context P → List SourceRef

/-- The claim a source is read as authority for: what it is about, its category, how far it
    reaches, and its wording verbatim — the text a provenance challenge must confront. -/
structure ClaimRef where
  referent  : String
  claimKind : String
  scope     : String
  text      : String

/-- An audit's identity: a source under the claim it was admitted for, fixed at formation. The
    claim under test is the binding's label, which a re-binding may move; where the two have come
    apart, both are shown. -/
structure AuditRef where
  source           : SourceRef
  claimAtAdmission : ClaimRef

/-- An observable indicator in the context supporting a binding. -/
structure Indicator where
  source  : String
  content : String

inductive Atomicity | atomic | nonAtomic

/-- The claim a candidate is read as authority for, what makes it suspect, and how many distinct
    claims the binding bundles. A binding that bundles several is split, reading the source
    again, before anything is certified; one claim standing on evidence in several places is one
    audit. -/
structure KindBinding where
  label             : ClaimRef
  positivePredicate : String
  evidence          : List Indicator
  atomicity         : Atomicity

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

/-- The admission-time fit of a binding against this contract's own claim and its route claims,
    reading nothing outside this contract: every inscribed claim the evidence supports, and the
    cited fit. -/
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

/-- Read off `claimedBy`, so nothing stored beside it can disagree: the own claim alone passes; a
    single route claim routes; several claims, or none, leave it ambiguous. -/
def Certificate.status (k : Certificate) : Status :=
  match k.claimedBy with
  | [.contextSuspect] => .pass
  | [d]               => .route d
  | _                 => .ambiguous

/-- A formed audit: its identity, and the binding and certificate its latest pass gave it. -/
structure Audit where
  ref         : AuditRef
  binding     : KindBinding
  certificate : Certificate

/-- **Your record**, read from the context: every audit formed so far, in formation order, each
    with the binding and certificate its latest pass gave it. Cumulative: an audit once formed
    stays; a split parent stays beside the children it produced; a source under a claim that
    already names an audit is that audit. A binding that bundles several claims forms no audit
    until it is split — only a loop-time split leaves a parent, which already carries its
    record. -/
opaque audits : Context P → List Audit

/-- The person's answer at Qa: whose the candidate is. -/
inductive Attribution
  /-- a suspect claim: vetted here -/
  | own
  /-- another deficit's: handed to it -/
  | route (d : Deficit)
  /-- none of these: several claims stand, or none does -/
  | unattributable

/-- **Your judgment**: the cited turn attributes audit `r`, as its claim now stands. -/
opaque AttributionSupported : AuditRef → Context P → Turn P → Attribution → Prop

/-- A candidate the certificate could not place is placed only by the person's statement. -/
def attributionCoord (r : AuditRef) : Coord P Attribution :=
  { admits := (· = .utterance), supports := AttributionSupported r }

-- elab: an open witness lets the occupancy readings below be declared `opaque`.
instance {A : Type} {q : Coord P A} {c : Context P} : Inhabited (Occ q c) := ⟨.open_ none⟩

/-- **Your reading**: the person's latest attribution of `r` that still reaches its claim as now
    bound; `open_` where none does. It may come at Qa or in any later utterance. -/
opaque attribution : (c : Context P) → (r : AuditRef) → Occ (attributionCoord r) c

def filledValue {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Option A
  | .open_ _     => none
  | .filled a .. => some a

/-- How an audit stands: the person's attribution settles it where one reaches it; otherwise
    the certificate's own reading does. -/
def status (c : Context P) (a : Audit) : Status :=
  match filledValue (attribution c a.ref) with
  | some .own            => .pass
  | some (.route d)      => .route d
  | some .unattributable => .unattributable
  | none                 => a.certificate.status

/-- Admitted: passing and atomic — what can be tagged, challenged, and asked. -/
def Admitted (c : Context P) (a : Audit) : Prop :=
  status c a = .pass ∧ a.binding.atomicity = .atomic

/-- What the pending action does with a claim, and what follows if the claim does not hold. -/
structure Stake where
  reads     : String
  ifItFails : String

/-- The narrowing a judgment is made against. It narrows the question and fixes no answer. -/
structure ValueSpace where
  claim             : ClaimRef
  positivePredicate : String
  evidence          : List Indicator
  stake             : Stake

-- elab: empty witnesses let the readings below be declared `opaque`; they add no meaning.
instance : Inhabited ClaimRef := ⟨⟨"", "", "", ""⟩⟩
instance : Inhabited ValueSpace := ⟨⟨default, "", [], ⟨"", ""⟩⟩⟩

/-- **Your reading** for an admitted audit: the claim, predicate, and evidence off its binding,
    the stake off the pending action (`prospect`). Presented whole, and held for the cycle as
    the presentation shows it. -/
opaque narrowing : Context P → AuditRef → ValueSpace

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

-- elab: an empty witness lets `tags` be declared `opaque`; it adds no meaning.
instance : Inhabited Tags := ⟨⟨default, .provisionalAssumption, "", "", "", []⟩⟩

/-- **Your reading** of an admitted audit's tags, from the verification reads (`tagReads`). -/
opaque tags : Context P → AuditRef → Tags

inductive Pattern
  | provenanceAudit
  | counterfactualGap
  | crossSourceConsistency
  | inferenceFallacy
  | emergent (name : String)

/-- A concrete counter-claim, counter-condition, counter-source, or counter-inference, posited
    against the claim as it stood when it was put, with its cited basis. Where no concrete
    challenge could be constructed, that result with the attempted pattern and basis. -/
structure Antithesis where
  claim      : ClaimRef
  pattern    : Pattern
  antithesis : String
  basis      : String

/-- **Your record**, read from the context: every antithesis put to `r`, in cycle order. Only an
    admitted audit is posited against; a met Revisit appends, and nothing is removed. -/
opaque antitheses : Context P → AuditRef → List Antithesis

/-- What the person instructs the run to do with an audit — only what this contract can itself
    discharge. No instruction: the source stands under the recorded verdict. -/
inductive Instruction
  /-- stop downstream reliance on this source for the claim judged; the verdict stays -/
  | withdraw
  /-- return the audit when the condition is met — watched only while the run is active; an
      unmet condition is reported open at convergence and not monitored afterwards -/
  | revisit (on : String)
  /-- report the named deficit at convergence, with its hint where this contract inscribes one -/
  | handOff (to : Deficit)

/-- The person's answer at Qs: what they make of the claim, in their words, and an optional
    instruction. -/
structure Judgment where
  verdict      : String
  continuation : Option Instruction

/-- **Your judgment**: the cited turn gives this judgment of audit `r`, answering the latest
    antithesis put to it. -/
opaque JudgmentSupported : AuditRef → Context P → Turn P → Judgment → Prop

/-- A claim's standing is judged only by the person's statement. -/
def judgmentCoord (r : AuditRef) : Coord P Judgment :=
  { admits := (· = .utterance), supports := JudgmentSupported r }

/-- **Your reading**: the person's judgment of `r` that answers its latest antithesis; `open_`
    until one does. A met Revisit's fresh antithesis leaves it open again. -/
opaque judgment : (c : Context P) → (r : AuditRef) → Occ (judgmentCoord r) c

/-- **Your judgment**: the Revisit condition is now satisfied in `c`. -/
opaque TriggerMet : Context P → String → Prop

/-- What an audit still owes the person: the attribution the certificate left to them, a
    judgment of the latest antithesis put to an admitted claim, or — for an admitted claim whose
    Revisit condition is now met — a fresh antithesis and question. A split parent is no longer
    admitted; what its condition set in motion is owed by its children. -/
def Owed (c : Context P) (a : Audit) : Prop :=
  status c a = .ambiguous ∨
  (Admitted c a ∧
    (filledValue (judgment c a.ref) = none ∨
     ∃ cond, ((filledValue (judgment c a.ref)).bind (·.continuation)) = some (.revisit cond) ∧
       TriggerMet c cond))

inductive Disposition
  /-- the person's, at Qs -/
  | judged (verdict : String) (continuation : Option Instruction)
  /-- handed to another deficit — at admission, before any work was done on it, or by a loop
      re-certification after it was judged -/
  | handed (d : Deficit)
  /-- the person found no claim that holds; the certificate never assigns this alone -/
  | unattributable

/-- Who wrote a record, and on what. -/
inductive Assignment
  /-- a relay on the certificate's cited fit -/
  | certificate (fit : String)
  /-- the person's attribution, cited in `attribution` -/
  | attribution
  /-- the person's answer at Qs; the verdict is where what they made of the claim is written -/
  | judgment

/-- One ledger entry: the disposition, the claim it was made against — the live claim then,
    which a re-binding may have moved from the one at admission — and who wrote it. -/
structure DispositionRecord where
  disposition : Disposition
  claimJudged : ClaimRef
  assignedBy  : Assignment

/-- The record an audit's standing gives it, read from the context; `none` while its attribution,
    or the judgment of its latest antithesis, is still open. A judgment's claim is the one its
    antithesis was put to, so a later re-binding does not move it. -/
def record (c : Context P) (a : Audit) : Option DispositionRecord :=
  match status c a with
  | .route d =>
    if (filledValue (attribution c a.ref)).isSome then
      some ⟨.handed d, a.binding.label, .attribution⟩
    else some ⟨.handed d, a.binding.label, .certificate a.certificate.fit⟩
  | .unattributable => some ⟨.unattributable, a.binding.label, .attribution⟩
  | .pass =>
    (filledValue (judgment c a.ref)).map
      (fun j => ⟨.judged j.verdict j.continuation,
        ((antitheses c a.ref).getLast?.map (·.claim)).getD a.binding.label, .judgment⟩)
  | .ambiguous => none

/-- Every formed audit carries a record, and none owes the person anything. -/
def Vetted (c : Context P) : Prop := ∀ a ∈ audits c, (record c a).isSome ∧ ¬ Owed c a

/-- **Your record**: contrary grounds you presented before the gate the closing answer answered,
    beyond the antithesis each claim already carries — attached to the closure; empty when there
    were none. -/
opaque dissent : Context P → List String

/-- `VettedContext`: the context at closure, its ledger — one record per formed audit — and the
    dissent attached to the closure. The trace is every antithesis put to each audit, read from
    `context` in cycle order, and each answer beside the antithesis it answered; an answer a
    later one replaced stays in the context. -/
structure VettedContext (P : Type) where
  context : Context P
  ledger  : List (AuditRef × DispositionRecord)
  dissent : List String

def ledgerOf (c : Context P) : List (AuditRef × DispositionRecord) :=
  (audits c).filterMap (fun a => (record c a).map (a.ref, ·))

inductive Outcome (P : Type)
  /-- no source met the criteria: nothing was formed, and the ledger is empty -/
  | noCandidate (c : Context P)
  /-- every formed candidate was handed elsewhere or left unattributable, and nothing was ever
      posited against: reported apart from `noCandidate`, the handoffs named -/
  | noneClaimed (v : VettedContext P)
  /-- every formed audit discharged, claims having been put to the person -/
  | vetted (v : VettedContext P)
  | holding (c : Context P)

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
A pass is the silent work: Phase 0 admission (identify, bind, split, certify, narrow), Phase 1
tagging and positing. Its verification reads enter the context as observation turns, then its
record. Then either nothing is owed and the run closes, or `respond` presents the next gate:
Phase 0 Qa for the earliest ambiguous candidate — one per turn — otherwise Phase 2 Qs for a batch
of at most four admitted audits whose judgment is open. Each person utterance is fused, and the
next pass reads it; that pass is Phase 3 and the loop scan together.
-/

/-- **Your collection**: the verification reads provenance tagging makes — artifact reads and
    searches of a source's origin, the claim it authorizes, and its downstream references. -/
opaque tagReads : Context P → List (Evidence P)

/-- **Your record** of a pass, written once its reads have entered the context: the sources
    identified, bindings and splits, certificates with their fits, route handoffs with their fit,
    narrowings, tags, and the antitheses posited — for admitted audits with no antithesis yet,
    and for those a met Revisit returns, re-bound and re-certified first. While any candidate
    is ambiguous, the pass records admission only: narrowing, tagging, and positing wait until
    every attribution is in, so `Qa` comes first. `audits`, `narrowing`,
    `tags`, and `antitheses` are read from these turns. A record grounds nothing. -/
opaque passRecord : Context P → List (Response P)

def pass (c : Context P) : Context P :=
  let c₁ := c ++ (tagReads c).map (·.val)
  c₁ ++ (passRecord c₁).map (·.val)

open Classical in
noncomputable def close (c : Context P) : Outcome P :=
  if (audits c).isEmpty then .noCandidate c
  else if ∀ a ∈ audits c, antitheses c a.ref = [] then .noneClaimed ⟨c, ledgerOf c, dissent c⟩
  else .vetted ⟨c, ledgerOf c, dissent c⟩

open Classical in
/-- `respond` presents the next gate. At Qa, before the question: the source, the bound claim,
    its evidence and channel, and the claims that evidence supports, or that none does. At Qs,
    before the question: per claim its narrowing whole, its tags, the antithesis with its basis,
    and the certificate fit that admitted it; then once for the batch, that a judgment reaches
    only the claim in its own slot. The pass's route handoffs are reported in the same turn. -/
noncomputable def sublate (respond : Context P → Response P) :
    Context P → List (Utterance P) → Outcome P
  | c, []      => .holding c
  | c, u :: us =>
    let c₁ := pass (fuse c u)
    if Vetted c₁ then close c₁
    else sublate respond (c₁ ++ [(respond c₁).val]) us

open Classical in
noncomputable def start (respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  let c₁ := pass c
  if Vetted c₁ then close c₁
  else sublate respond (c₁ ++ [(respond c₁).val]) us

/-! ── LOOP ──
Every utterance opens a pass over the fused context: an attribution, a judgment, a correction, or
a question, read whole. The next batch is whatever the context leaves owed; nothing else counts
batches. A met Revisit returns its audit: the pass re-binds it — the conditions that fired the
trigger may have moved the claim — re-certifies it, and posits again, so the claim is asked as
it now stands. A re-certification can split the audit, hand it elsewhere, or put it to Qa; the
earlier antithesis and answer stay in the context. Where the person attributes a candidate — at
Qa or in any later utterance, a handed one included — that attribution reaches it. The loop is
dialogue: each cycle re-enters a Constitution gate, and the person ends it.
-/

/-!
Silence judges nothing and closes nothing.
theorem silence (respond : Context P → Response P) (c : Context P) :
    sublate respond c [] = .holding c

While anything is owed, an utterance leads to the next gate and closes nothing.
theorem owed_holds_gate (respond : Context P → Response P) (c : Context P) (u : Utterance P)
    (us : List (Utterance P)) (h : ¬ Vetted (pass (fuse c u))) :
    sublate respond c (u :: us) =
      sublate respond (pass (fuse c u) ++ [(respond (pass (fuse c u))).val]) us

A pass only adds to the context.
theorem pass_extends (c : Context P) : ∃ t, pass c = c ++ t
-/

/-! ── CONVERGENCE ──
vetted: every formed audit carries a record — the person's judgment, a handoff the certificate
relayed on its fit or the person attributed, or the person's unattributable — and no admitted
audit owes a judgment or a met Revisit (`Vetted`). An unmet Revisit at closure is reported as an
instruction the run did not carry out. Every antithesis in the trace was put to an audit that was
admitted when it was put; the ledger also holds the Handed and Unattributable records — those
written at admission no antithesis reached, and one a loop re-certification wrote stands beside
the judgment it replaced.
Convergence evidence: for each audit an antithesis was put to, every antithesis in cycle order —
the claim it was put to → the antithesis → the answer that answered it, read from the context,
with a later answer that replaced it shown beside it — naming the source. One source that yielded
several audits shows one line per claim. Apart from the trace, every Handed and Unattributable
record, projected from the ledger: the deficit or what was left unresolved, who assigned it, the
claim judged where it moved from admission, and the cited basis. An audit the loop handed away
after it was judged appears in both. Demonstrated, not asserted.
-/

/-!
Every closure after the first pass follows a person's utterance, and its context is the pass that
read it.
theorem closes_after_utterance (respond : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) (v : VettedContext P) (h : sublate respond c us = .vetted v) :
    ∃ (c₀ : Context P) (u : Utterance P), v.context = pass (fuse c₀ u)

A person's route attribution reads as a route, whatever deficit they named.
theorem person_route_is_route (c : Context P) (a : Audit) (d : Deficit)
    (h : filledValue (attribution c a.ref) = some (.route d)) : status c a = .route d

A handoff is never recorded as the person's judgment at Qs.
theorem handed_not_judgment (c : Context P) (a : Audit) (r : DispositionRecord) (d : Deficit)
    (h : record c a = some r) (hd : r.disposition = .handed d) : r.assignedBy ≠ .judgment

An attribution and a judgment are each filled only by a person's statement.
theorem attributed_by_utterance {c : Context P} {r : AuditRef} {s : Cite c}
    (ok : (attributionCoord (P := P) r).admits s.kind) : s.kind = .utterance

theorem judged_by_utterance {c : Context P} {r : AuditRef} {s : Cite c}
    (ok : (judgmentCoord (P := P) r).admits s.kind) : s.kind = .utterance
-/

/-! ── TOOL GROUNDING ── -/
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed

inductive Annot | sense | observe | track | transform | dispatch | constitution | extension

inductive Op | identify | bindKind | split | certify | certifyRoute | qa | narrow | tag | posit
             | qs | readAnswer | trivialConverge | converge | seam

def grounding : Op → Annot × String
  | .identify        => (.sense, "Internal analysis: the silent scan for sources warranting audit — load-bearing, aged past their origin's horizon, reached through a long chain, in tension with another source about the same referent, or an inference used as a premise")
  | .bindKind        => (.sense, "Internal analysis: bind each candidate to the claim it is read as authority for — referent, claim kind, scope, and verbatim text — with what makes it suspect, its evidence, and how many distinct claims the binding bundles; re-run for an audit a met Revisit returns, reading the context as it now stands")
  | .split           => (.sense, "Internal analysis: a binding that bundles several distinct claims yields one atomic binding per claim, read from the source, each with the predicate and evidence bearing on its own claim; before any certificate, so no compound is admitted")
  | .certify         => (.sense, "Internal analysis: fit each atomic binding against this contract's own claim and its route claims, reading nothing outside this contract; the claims the evidence supports, and the cited fit")
  | .certifyRoute    => (.extension, "TextPresent+Proceed: where a route claim alone holds a candidate, report the deficit with the cited fit and the command only as a hint — a missing pre-execution fact (/inquire), a claim a convention or ownership question settles (/bound); nothing is dispatched, and no candidate leaves the person's view silently")
  | .qa              => (.constitution, "present: one ambiguous candidate per turn, in formation order — before the gate the source, the bound claim, the evidence with its channel, and the claims it supports or that none does; the gate asks whose it is — vet it here, hand it to a named deficit, or none of these — with each option's consequence; a deficit the person names outside the set is a route emitted bare")
  | .narrow          => (.sense, "Internal analysis: for each admitted audit, the narrowing its judgment is made against — the claim, predicate, and evidence off its binding, the stake off the pending action; the question, never an answer")
  | .tag             => (.observe, "artifact read, artifact search: verify each admitted audit's source origin, the claim it authorizes, and its downstream references; provenance, freshness, and leverage")
  | .posit           => (.sense, "Internal analysis: one concrete antithesis per admitted audit with no antithesis yet or a met Revisit — Pattern A, B, C, D, or emergent — against the claim its binding fixed, with its cited basis")
  | .qs              => (.constitution, "present: mandatory, per batch of at most four admitted audits whose judgment is open — before the gate each claim's narrowing whole, its tags, the antithesis with its basis, and the certificate fit that admitted it, then once for the batch that a judgment reaches only the claim in its own slot; the gate carries the free-text question and the instruction list — Withdraw, Revisit(condition), HandOff(deficit), or none — each with its consequence; no answer is offered and no free response is mapped onto one")
  | .readAnswer      => (.sense,"Internal analysis: the latest utterance read whole with the fused context — attributions, judgments with their instructions, and whatever else it says, for the next pass")
  | .trivialConverge => (.extension, "TextPresent+Proceed: nothing owed and nothing ever posited — no source met the criteria (empty ledger), or every formed candidate was handed elsewhere or left unattributable, by the certificate's fit or the user's attribution (each handoff named with its hint, each residual with what was left unresolved); the two causes reported apart")
  | .converge        => (.extension, "TextPresent+Proceed: the per-antithesis trace over every audit an antithesis was put to, each answer beside the antithesis it answered and a replaced answer beside it; the Handed and Unattributable records apart, with who assigned each; every handed deficit and HandOff emitted with its hint where this contract inscribes one, bare otherwise; unmet Revisits reported open; the dissent attached to the closure")
  | .seam            => (.extension, "TextPresent+Proceed: at a user-declared chain naming the next protocol, proceed to it citing that source; this protocol declares no wired outbound edge, and every Constitution gate inside Elenchus and the next protocol fires unchanged")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Pattern resolution emergent via session context.
-/

end Elenchus
```

## Mode Activation

`/sublate` is user-invoked over an existing working context before an action that depends on it is externalized or committed. Elenchus has no AI-guided activation: a model may answer an explicit invocation, but it does not initiate vetting from its own suspicion. Loaded safety boundaries, capability restrictions, and explicit user instructions continue to bind. Empty or freshly arrived context can converge through the Definition's trivial path.

## Source Identification Criteria

The silent scan selects a source when it is unusually load-bearing, older than the horizon appropriate to its origin, supported through a long provenance chain, in tension with another source about the same referent, or itself an inference being used as a premise. Thresholds and origin horizons remain working hypotheses; an emergent criterion may be used when it directly identifies suspect context.

## Antithesis Rendering

Render the pattern that directly challenges the bound claim:

- **Provenance**: test whether the source's verification path authorizes this claim. Freshness does not settle support-integrity when nothing couples the source to the behavior it asserts.
- **Counterfactual**: use a condition the user has put in play to show where the current conclusion could fail.
- **Cross-source**: compare separate sources only after their referent and claim-kind are compatible. Sibling audits split from one source are not a source pair.
- **Inference**: test the reasoning that produced a conclusion. Time-invariance from a present observation, over-generalization, surviving-sample reasoning, base-rate neglect, and correlation-as-cause are recognition seeds rather than a closed catalog; an emergent archetype remains available.

Counterfactual rendering begins with the user's changed condition. Inference rendering reverse-derives the condition that would expose a reasoning flaw. Every antithesis is a concrete counter-claim, counter-condition, counter-source, or counter-inference with a cited basis.

## Protocol

### User-facing realization

For each admitted audit, present the material before the Constitution gate in this order:

- the source and bound claim, including referent, claim kind, scope, and verbatim claim text;
- what makes the claim suspect, the evidence with its channel, and what the pending action stakes on it;
- the provenance, freshness, and leverage reading;
- the antithesis and its cited basis, plus the certificate basis that admitted the audit.

Then state once for the batch that a judgment reaches only the claim in its own slot. Open the gate with the free-text question asking what the user makes of that claim. The optional instructions are presented with their consequences:

- **Withdraw** stops downstream reliance on this source for this claim and keeps the judgment in the record.
- **Revisit(condition)** returns this audit only if the condition is met while the current run remains active; an unmet condition is reported open at convergence and is not monitored afterward.
- **HandOff(deficit)** reports the named deficit at convergence; Elenchus performs no downstream resolution for it.
- No instruction leaves the source in place under the recorded verdict.

A rejected claim binding is recorded in the verdict; a later invocation performs any re-binding. Process at most four audits per Constitution turn; the next batch is the admitted audits the context still leaves unjudged.

### Attribution of an ambiguous candidate

When the certificate cannot say whose a candidate is, put it to the user before it is admitted, handed off, or dropped. Before the question, show the source, the bound claim, the evidence, and which of the inscribed claims that evidence supports — or that none does. The gate renders the `Attribution` answer space in plain language, one option per supported claim:

```
This candidate could be more than one kind of problem, and the evidence doesn't settle which. Whose is it?

Options:
1. **A suspect claim — vet it here** — it is admitted and gets its own challenge in turn
2. **Belongs to [deficit] — hand it off** — recorded as handed to that protocol: [command hint where one exists]
3. **None of these** — recorded as unattributed; nothing is done with it here
```

Ask about one candidate per turn. An answer here says whose the candidate is and nothing about what the user makes of the claim; only the first option leads to the challenge and the judgment gate above. Do not drop an ambiguous candidate without this question — a candidate the certificate could not place is the user's to place. Where the user says whose a candidate is in a later answer, a candidate the certificate handed elsewhere included, that statement is its attribution. Read `references/round-composition.md` before composing when terminology or wording must remain stable, material belongs to another round or trace, or phase order determines whether text belongs before or inside the gate.

## Rules

- **User-initiated only**: Activate only on the user's pre-execution vetting invocation over existing working context.
- **Recognition over Recall**: Present each complete narrowing and antithesis before the gate, then the batch reach note; the gate carries the free-text judgment question and the typed instruction list with differential implications.
- **Round composition**: Use everyday language, keep each judgment beside its evidence and next-move implication, and place analytical context before the gate. Use the referenced round-composition guide at the moments named above.
- **Source chain preservation**: The working context is read and never rewritten. Withdraw reaches the audit's source only as authority for the record's `claimJudged`; sibling claims remain governed by their own audits, and after a loop re-binding `claimJudged`, not `claimAtAdmission`, is the operative scope.
- **Dialectical antithesis**: Posit a concrete challenge to the claim rather than a procedural verification question. If no concrete challenge can be constructed, record that result with the attempted pattern and basis so the audit remains visible in the closing account.
- **Narrowing identity**: Present the `ValueSpace` fields and the instruction list intact. Materialization fills this audit's concrete claim, evidence, and stake into those fields without changing their structure.
- **Claim-relative provenance**: A provenance reading (`Tags`) authorizes one bound `ClaimRef`. Same-referent comparison requires compatible claim kinds and separate sources; a source used for several claims yields separately judged audits.
- **Currency and support-integrity**: A current source still receives a provenance antithesis when no observable coupling ties it to the behavior its claim asserts.
- **Open inference archetypes**: The named reasoning flaws seed recognition without closing Pattern D to an emergent flaw condition.
- **Declared continuation relay**: A user-declared chain settles the protocol after Elenchus; this contract declares no outbound edge. Cite that source and preserve every Constitution gate inside both protocols. A handoff the certificate finds is reported with its fit and the command only as a hint; nothing is dispatched.
- **Form feedback**: Derive each round's density from the current request and carry an explicit form instruction until countermanded. Change the form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
- **Admission-time certificate**: For each atomic claim, run `KindBinding → Certificate → ValueSpace` in that order before tagging or antithesis generation, including on loop re-entry. Only `pass` is admitted; a route is recorded by the certificate, and an ambiguous fit is put to the user at `Qa`, whose attribution is recorded — every formed audit ref carries one record or the other.
- **Judgment stays the user's; the challenge stays on the record**: A claim's standing is settled only by the user's answer at `Qs`, and whose a candidate is only by the user's attribution or by the certificate's fit where that fit alone decides it — recorded as the certificate's, and replaced by the user's statement wherever one reaches it. The antithesis goes before the gate and stays in the trace beside the answer that met it; any further contrary ground still held at closure is attached to the closure record.
- **Ambiguity surfaces**: An ambiguous certificate is put to the user at `Qa` with the claims its evidence supports, one candidate per turn, before the candidate is admitted, handed off, or dropped. The user's attribution — vet it here, hand it to a named deficit, or none of these — is what settles pass, route, or `Unattributable`; the certificate never drops a candidate it could not place, and the AI takes no second look at ground that has not moved.
