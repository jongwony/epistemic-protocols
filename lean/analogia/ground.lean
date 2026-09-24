/-!
How to read this block. It is core Lean 4 and elaborates as written.
Every `opaque` declaration is a judgment that is yours to make from the material in front of
you; its doc comment says what you judge there, and nothing in this block decides it for you.
Every `def`, `inductive`, and `structure` is fixed by the contract. A `theorem` line inside a
doc comment states a consequence the contract already has; it is proved outside this block
and asks nothing further of you.
-/

/-! ── FLOW ──
Analogia(R) → ground(c, utterances), where c is the fused session context:
  pass(c): Detect →
    ¬uncertain: ZeroGapRelay(finding) → proceed with R unchanged
    uncertain: focus settlement per axis →
      every axis settled: FocusReadback | an axis unsettled, or K narrowed without basis:
        FocusSelector → Stop
      → K := settle_inferences → InferenceReadback → construct and assess fit (a counted
        reconstruction) → checks → run the reachable ones (observations enter c) → warrant →
        judge → [self-grounding: partition reading] → Surface → proceed
      → converged(K): MappingAssessment | an earlier dependency still pending with no evidence
        progress, or the reconstruction cap reached: Inconclusive | otherwise Inconclusive
  later utterance u: c' := fuse(c, u) →
    it replaces a committed domain: DomainSuperseded
    otherwise: pass(c')   (the purpose, K, mapping, or evidence it changes is read there)
-/

/-! ── MORPHISM ──
R
  → detect(R, context)                     -- what the mapping licenses is uncertain, with a target account in play
  → settle_focus(R, context) → φ           -- per axis; the purpose only from the user's words
  → settle_inferences(R, φ, context) → K   -- read back before construction
  → construct(mapping, Sₐ → Sₜ, φ, context)
  → assess_fit(mapping, Sₐ, Sₜ, context)   -- each cell placement is a claim
  → check(fit_claims, K, context)          -- per bearing claim, what within its scope would change it
  → run_checks(checks, context)            -- reachable evidence moves; results enter the context
  → warrant(fit_claims, checks)            -- read off evidence, never assent
  → judge(K, mapping, warrant)             -- Licensed with limits, Blocked, or Undetermined with what is missing
  → surface(assessment)                    -- present and proceed
  → MappingAssessment
requires: uncertain(licenses(mapping(Sₐ, Sₜ)))  -- runtime checkpoint (Phase 0)
deficit:  MappingUncertain                       -- activation precondition
preserves: content_identity(R)                   -- output content invariant; the assessment is carried in R'
invariant: Warrant tracks cited evidence, never assent
invariant: Judgment is the model's, the product is a field
-/

namespace Analogia

/-! ── GROUND ──
The session primitive this contract reads. A context is the list of turns the session has
accumulated; a turn carries where it came from and what form it takes. Only a person's
statement is an utterance; an AI turn, an injected turn, and a summary ground nothing.
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

def Utterance (P : Type) := {e : Turn P // e.basis = some .utterance}
def Response (P : Type) := {e : Turn P // e.origin = .assistant}
def Evidence (P : Type) := {e : Turn P //
  e.basis = some .observation ∨ e.basis = some .report ∨ e.basis = some .testimony}

/-- Fusion appends one turn; the record only grows. -/
def fuse {P : Type} (c : Context P) (u : Utterance P) : Context P := c ++ [u.val]

/-- A citation of one turn of `c`, with the basis that turn is eligible for. -/
structure Cite {P : Type} (c : Context P) where
  idx  : Nat
  lt   : idx < c.length
  kind : Basis
  ok   : (c[idx]'lt).basis = some kind

/-- An open coordinate: which bases it admits, and whether a cited turn supports a value
    (the support reading is the model's). -/
structure Coord (P A : Type) where
  admits   : Basis → Prop
  supports : Context P → Turn P → A → Prop

/-- A coordinate is filled only by a citation it admits and that supports the value; `open_`
    may carry a candidate citation whose support is still short. -/
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

/-- A citation into an earlier context still points at the same turn after later fusion;
    what it supported there is judged again against the context that now stands. -/
def Cite.lift {P : Type} {c : Context P} (s : Cite c) (t : Context P) : Cite (c ++ t) :=
  { idx := s.idx
    lt := by have := s.lt; simp; omega
    kind := s.kind
    ok := by rw [List.getElem_append_left s.lt]; exact s.ok }

/-! ── TYPES ── -/

variable {P : Type}

/-- `R`: text carrying an abstract structure and a target account already in play —
    AI output, user analysis, or an external reference. The morphism processes it uniformly;
    it is bound by R-BINDING and read from the context, as the positions of its turns. -/
abbrev Text (c : Context P) := List (Fin c.length)

structure Component where
  name      : String
  structure_ : String

structure Correspondence where
  abstract : Component
  concrete : Component
  relation : String

/-- The four axes of the comparison focus that conditions construction. -/
inductive Axis | sourceScope | targetScope | relation | purpose

/-- **Your judgment**: the cited turn establishes value `v` for axis `a` in `c`. For `purpose`
    only the user's own words do. For another axis the value is established when it is
    `determined` — fixed by the user's words or a citable standing rule — or `forced` — the
    decomposition admits exactly one value, and the citation is a source turn of `R` showing
    that uniqueness, never the decomposition's own output. -/
opaque AxisSupported : Axis → Context P → Turn P → String → Prop

/-- The comparison purpose is a retained judgment, filled only by a person's utterance; the
    other axes admit any grounding basis. -/
def axisCoord : Axis → Coord P String
  | .purpose => { admits := (· = .utterance), supports := AxisSupported .purpose }
  | a        => { admits := fun _ => True,     supports := AxisSupported a }

def Occ.isFilled {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Bool
  | .open_ _ => false
  | .filled .. => true

-- elab: an open witness lets the occupancy readings below be declared `opaque`.
instance {A : Type} {q : Coord P A} {c : Context P} : Inhabited (Occ q c) := ⟨.open_ none⟩

/-- **Your judgment**: how axis `a` of the comparison focus stands in `c`. -/
opaque focusAxis : (c : Context P) → (a : Axis) → Occ (axisCoord a) c

/-- Checked per axis, never object-wide: one axis the protocol would pick among viable
    alternatives fires the focus gate. -/
def focusSettled (c : Context P) : Prop := ∀ a, (focusAxis c a).isFilled = true

/-- One thing the mapping is being asked to license about the target: a prediction, a
    permission, a limit, an expected behavior. -/
structure Inference where
  claim : String

/-- **Your judgment**: `K`, what this activation audits, derived from the request and the
    settled purpose before construction; non-empty once activated. -/
opaque inferences : Context P → List Inference

/-- **Your judgment**: the latest settlement narrows `K` with no basis in the request or the
    settled purpose. -/
opaque UnsupportedNarrowing : Context P → Prop

inductive FitLabel | preserved | «partial» | overextended

/-- What fit assessment asserts; every placement, `preserved` included, is a claim that can be
    warranted or defeated. -/
inductive FitClaim
  | fit     (c : Correspondence) (l : FitLabel)
  | missing (x : Component)

/-- **Your judgment**: the correspondences constructed along the settled focus. -/
opaque mapping : Context P → List Correspondence

/-- **Your judgment**: the fit claims over the current mapping — each correspondence in
    exactly one cell, and every source component with no evidenced correspondent missing. -/
opaque fitClaims : Context P → List FitClaim

/-- **Your judgment**: whether `x` bears on `k` — its verdict would change if `x` changed.
    This keeps the check set finite without letting the protocol choose its own exam. -/
opaque BearsOn : Context P → FitClaim → Inference → Prop

/-- Who can carry a check out. `userHeld` is context only the user holds; it is met by what
    the user reports observing, and otherwise it is `/inquire`'s deficit. -/
inductive Reach
  | aiReachable (action : String)
  | userHeld (question : String)

inductive Bearing | supports | defeats

/-- **Your judgment**: the cited turn establishes, within `scope`, that it supports or defeats
    `x`. A citation's stated bearing is read against its source and scope. -/
opaque CheckSupported : FitClaim → String → Context P → Turn P → Bearing → Prop

/-- A check is met only by evidence: an observation, a peer report, or what a person reports
    observing. A person's statement of agreement or disagreement is not admitted. -/
def checkCoord (x : FitClaim) (scope : String) : Coord P Bearing :=
  { admits := (· ≠ .utterance), supports := CheckSupported x scope }

/-- One check per current fit claim bearing on `K`. Open is unmet — the honest default,
    never a pass; filled with `supports` survived; filled with `defeats` failed. -/
structure Check (c : Context P) where
  claim        : FitClaim
  scope        : String
  /-- evidence that, within `scope`, would require the claim to change -/
  wouldChangeIt : String
  /-- `none`: reachable by neither party now; say what is missing -/
  reach        : Option Reach
  state        : Occ (checkCoord claim scope) c
  /-- further cited grounds beside the one that fills the state -/
  more         : List (Cite c)

/-- **Your judgment**: the checks for the current fit claims bearing on `K`, each with its
    state read off the grounds the context now holds. -/
opaque checks : (c : Context P) → List (Check c)

/-- The check set is exact: a fit claim that some intended inference turns on has a check,
    and a check names a current fit claim. Questions guide the derivation without adding
    claimless checks. -/
def ChecksExact (c : Context P) : Prop :=
  (∀ x ∈ fitClaims c, (∃ k ∈ inferences c, BearsOn c x k) → ∃ ch ∈ checks c, ch.claim = x) ∧
  (∀ ch ∈ checks c, ch.claim ∈ fitClaims c)

/-- A warrant is read off the check and nothing else. -/
inductive Warrant | open_ (missing : String) | supported | defeated

def Check.warrant {c : Context P} (ch : Check c) : Warrant :=
  match ch.state with
  | .open_ _                  => .open_ ch.wouldChangeIt
  | .filled .supports _ _ _   => .supported
  | .filled .defeats _ _ _    => .defeated

/-- Grounds: a non-empty list of citations, none of them a statement of assent. -/
def Grounds (c : Context P) :=
  {g : List (Cite c) // g ≠ [] ∧ ∀ s ∈ g, s.kind ≠ .utterance}

inductive Verdict (c : Context P)
  /-- grounds support the whole requested inference at its requested scope, with a met check
      for every fit claim bearing on it; `limits` is that supported reach -/
  | licensed     (g : Grounds c) (limits : String)
  /-- a decisive ground against the inference -/
  | blocked      (g : Grounds c)
  | undetermined (missing : String)

instance {c : Context P} : Inhabited (Verdict c) := ⟨.undetermined ""⟩  -- elab: for `opaque judge`

/-- **Your judgment** per inference, reading the grounds' bearing on `k` rather than a
    label-to-verdict polarity. -/
opaque judge : (c : Context P) → Inference → Verdict c

def Verdict.decisive {c : Context P} : Verdict c → Bool
  | .undetermined _ => false
  | _               => true

/-- Convergence is read over the intended inferences, never over the correspondences. -/
def converged (c : Context P) : Prop := ∀ k ∈ inferences c, (judge c k).decisive = true

inductive Pref | adopted | withdrawn

/-- **Your judgment**: the cited utterance adopts or withdraws `x`. -/
opaque PrefSupported : Correspondence → Context P → Turn P → Pref → Prop

/-- What the reader takes up: recorded, reported apart from warrant, and read by no terminal
    predicate. Unstated is open. -/
def prefCoord (x : Correspondence) : Coord P Pref :=
  { admits := (· = .utterance), supports := PrefSupported x }

/-- **Your judgment**: how the user's adoption of `x` stands in `c`. -/
opaque preference : (c : Context P) → (x : Correspondence) → Occ (prefCoord x) c

/-- **Your judgments**: the source abstraction is located; its member instances are exactly
    the target. An unlocated, merely sensed essence is `/induce`'s instead. -/
opaque Located : Context P → Prop
opaque InstancesAreTarget : Context P → Prop

def selfGrounding (c : Context P) : Prop := Located c ∧ InstancesAreTarget c

inductive PartitionVerdict | split | trim | hold

/-- A supported partition of the target's members, read only under self-grounding and only
    where the grounds establish the full allocation and each rival grouping. -/
structure PartitionReading (c : Context P) where
  misfits  : List String
  rivals   : List (List String)
  outliers : List String
  core     : List String
  grounds  : Grounds c

def PartitionReading.verdict {c : Context P} (r : PartitionReading c) : PartitionVerdict :=
  if r.misfits = [] then .hold
  else if (if r.core = [] then 0 else 1) + r.rivals.length ≥ 2 then .split
  else .trim

/-- Where a partition verdict routes. `trim` names `/induce` Narrow as written; whether that
    move still exists there is an open question of this contract. -/
def PartitionVerdict.route : PartitionVerdict → Option String
  | .split => some "/conduct decompose-recovery recipe"
  | .trim  => some "/induce Narrow"
  | .hold  => none

/-- **Your judgment**: the partition reading, or `none` with its missing basis reported. -/
opaque partition : (c : Context P) → Option (PartitionReading c)

/-- A partition is read only under self-grounding. -/
def PartitionScoped (c : Context P) : Prop := (partition c).isSome → selfGrounding c

def partitionRoute {c : Context P} (r : PartitionReading c) : Option String := r.verdict.route

/-- **Your judgment**: the latest utterance replaces a committed domain — a different question,
    not an advance of this one. -/
opaque Supersedes : Context P → Prop

/-- **Your judgment**: an earlier dependency still needs revision and no evidence move this
    activation can make remains to bring it up to date. -/
opaque PendingRevision : Context P → Prop

/-- **Your judgment**: what mapping licenses is uncertain here, with a target account in play. -/
opaque Uncertain : Context P → Prop

/-- **Your count**, read from the record: construction or fit passes run in this activation. -/
opaque reconstructions : Context P → Nat

/-- **Your judgment**: the pending request needs another construction or fit pass. -/
opaque NeedsReconstruction : Context P → Prop

def maxReconstructions : Nat := 3

inductive InconclusiveReason | cap | openEvidence | emergent (why : String)

/-- Where an activation stands after a pass. Every close but `zeroGap` and `focusGate` carries
    `R'`: the verdicts over `K` with their grounds and limits, every fit claim's warrant, and
    every unmet check with its scope and reach or the absence of one — under self-grounding,
    also the partition reading and its routing. -/
inductive Report (c : Context P)
  /-- nothing uncertain: the finding with its reasoning; `R` proceeds unchanged -/
  | zeroGap
  /-- the focus gate is presented and held -/
  | focusGate
  /-- `MappingAssessment`: every intended inference Licensed or Blocked with its grounds;
      not an endorsement of the mapping -/
  | assessment
  | inconclusive (why : InconclusiveReason)
  /-- the question changed; evidence crosses as context, verdicts do not -/
  | superseded

/-! ── R-BINDING ──
bind(R) = explicit_arg ∪ current_output ∪ most_recent_output
Priority: explicit_arg > current_output > most_recent_output
  /ground "text"    → R = "text"
  /ground (alone)   → R = the most recent relevant output in the session, the AI's or the user's
  "ground this..."  → R = the text currently under discussion
  "does this abstraction hold across its cases?" → R = a candidate abstraction and the
    instances it claims to subsume → self-grounding
With no relevant text, ask for a grounding target before the first pass.
-/

/-! ── MODE STATE ──
Λ is the fused context and nothing else. The domains, focus, intended inferences, mapping, fit
claims, checks, warrants, verdicts, cited grounds, preference, partition reading, and the
reconstruction count are read from it when needed; none is stored beside it.
-/

abbrev Mode (P : Type) := Context P

/-- What every pass leaves standing in the context it surfaces from. -/
def PassHolds (c : Context P) : Prop := ChecksExact c ∧ PartitionScoped c

/-! ── PHASE TRANSITIONS ──
A pass reads the fused context: detection, then focus settlement and read-back, then the
intended inferences and their read-back, then construction and fit, checks, warrants,
verdicts, and, under self-grounding, the partition reading. Evidence the pass collects enters
the context as observation turns before the surface, and the pass surfaces from a context in
which `PassHolds`. The surface proceeds; the focus gate alone holds the turn.
-/

open Classical in
noncomputable def report (c : Context P) : Report c :=
  if ¬ Uncertain c then .zeroGap
  else if ¬ focusSettled c ∨ UnsupportedNarrowing c then .focusGate
  else if reconstructions c ≥ maxReconstructions ∧ NeedsReconstruction c then .inconclusive .cap
  else if PendingRevision c then .inconclusive .openEvidence
  else if converged c then .assessment
  else .inconclusive .openEvidence

/-- **Your evidence moves** for a pass: what the reachable checks returned — artifact reads,
    searches, fetches, and runs — each an observation turn. -/
opaque observe : Context P → List (Evidence P)

def collect (c : Context P) : Context P := c ++ (observe c).map (·.val)

open Classical in
/-- A later utterance is fused; unless it replaces a committed domain, the next pass reads the
    whole fused context and its surface is `respond`. -/
noncomputable def ground (respond : Context P → Response P) :
    (c : Context P) → List (Utterance P) → (c' : Context P) × Report c'
  | c, []      => ⟨c, report c⟩
  | c, u :: us =>
    let c₁ := fuse c u
    if Supersedes c₁ then ⟨c₁, .superseded⟩
    else
      let c₂ := collect c₁
      ground respond (c₂ ++ [(respond c₂).val]) us

/-! ── LOOP ──
The pass is the unit, and every later utterance opens one over the fused context: whatever it
changes — the purpose, the intended inferences, the mapping, the evidence — the next pass reads
it there, and a change to the intended inferences alone leaves the mapping as it was. Within a
pass, re-entering an earlier step needs evidence progress: a ground in the context that the
affected step has not yet read, or a still-untried reachable evidence move expected to change
its assessment. Reading unchanged evidence again changes nothing. At most three construction
or fit passes run per activation, and none is refunded; focus settlement, read-back, and
reassessment over an unchanged mapping spend none. An empty mapping is assessed like any
other. Preference changes no warrant or verdict.
-/

/-!
With no new evidence, collection leaves the context, and so every reading, unchanged.
theorem no_evidence_no_change (c : Context P) (h : observe c = []) : collect c = c

A settlement that narrows `K` without basis holds at the focus gate rather than reading the
unchanged context again.
theorem narrowing_holds_at_gate (c : Context P) (hu : Uncertain c)
    (hn : UnsupportedNarrowing c) : report c = .focusGate
-/

/-! ── CONVERGENCE ──
converged(K): every intended inference carries a Licensed or a Blocked verdict with its grounds.
Convergence evidence: for each k in K, one pair (MappingUncertain(k) → verdict(k)) showing the
correspondences it rode on, the warrant each carried (`Check.warrant`), and, for Licensed, the
limits. For each
checked fit claim, its label, warrant, and scope beside the grounds, the stated defeater, the
reach or its absence, and whether the check was unmet, survived, or failed. An unmet check is
reported as unmet, never as a pass; a claim whose warrant is open is named open rather than
weakly supported. Preference is reported apart from warrant and never as a reason. State the
committed domain pair, the comparison focus, and K with its basis, carrying any read-back
change to K and distinguishing questions removed from scope from questions answered. Under
self-grounding, append the supported partition reading with its grounds and routing, or why
its basis remains unresolved. An Inconclusive close keeps the same trace with every
Undetermined verdict naming what is missing; at the cap, the requested revision is named as
unassessed and any retained assessment is labelled by its earlier focus and K. Convergence is
demonstrated, not asserted.
-/

/-!
theorem assessment_converged (c : Context P) (h : report c = .assessment) :
    focusSettled c ∧ converged c

Assent never meets a check: what fills a check state is evidence, never an utterance.
theorem check_never_assent {c : Context P} {x : FitClaim} {scope : String} (s : Cite c)
    (ok : (checkCoord (P := P) x scope).admits s.kind) : s.kind ≠ .utterance

The comparison purpose is filled only by the user's own words.
theorem purpose_by_utterance {c : Context P} {s : Cite c}
    (ok : (axisCoord (P := P) .purpose).admits s.kind) : s.kind = .utterance

A replacement of a committed domain closes the activation at once.
theorem superseded_first (respond : Context P → Response P) (c : Context P)
    (u : Utterance P) (us : List (Utterance P)) (h : Supersedes (fuse c u)) :
    ground respond c (u :: us) = ⟨fuse c u, .superseded⟩
-/

/-! ── TOOL GROUNDING ── -/
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed

inductive Annot | sense | observe | track | transform | dispatch | constitution | extension

inductive Op | detect | zeroGapRelay | focusDerive | focusReadback | focusSelector
             | inferenceSettle | inferenceReadback | mapAssessFit | checkRead | runChecks
             | warrantRead | judge | partitionRead | surface | converge | inconclusive
             | superseded | seam

def grounding : Op → Annot × String
  | .detect            => (.sense, "Internal analysis: licensing uncertainty and whether self-grounding holds")
  | .zeroGapRelay      => (.extension, "TextPresent+Proceed: when nothing is uncertain, the finding with its reasoning; proceed with R unchanged")
  | .focusDerive       => (.sense, "Internal analysis: MappingFocus candidates and each axis's standing, before any correspondence is constructed")
  | .focusReadback     => (.extension, "TextPresent+Proceed: when every axis is settled, relay the focus with the citation that settles each axis")
  | .focusSelector     => (.constitution, "present: when an axis is unsettled or K was narrowed without basis, the candidate foci with their consequences visible before choice, including the committed-domain replacement exit")
  | .inferenceSettle   => (.sense, "Internal analysis: K from R, the settled purpose, and the context")
  | .inferenceReadback => (.extension, "TextPresent+Proceed: K and its basis beside the settled focus, with what a revision added, removed, or reformulated; no approval required")
  | .mapAssessFit      => (.observe, "artifact read, artifact search, external fetch (conditional): construct correspondences along the focus and assert their fit")
  | .checkRead         => (.sense, "Internal analysis: one check per fit claim bearing on K, each with its scope, defeater, and reach")
  | .runChecks         => (.observe, "artifact read, artifact search, external fetch, environment run: the reachable checks, including exercising an artifact whose behavior the claim turns on; results enter the context as observations")
  | .warrantRead       => (.sense, "Internal analysis: each claim's warrant read off its check")
  | .judge             => (.sense, "Internal analysis: per inference, Licensed with limits, Blocked, or Undetermined with what is missing")
  | .partitionRead     => (.sense, "Internal analysis: under self-grounding, a supported partition or its missing basis; no separate gate")
  | .surface           => (.extension, "TextPresent+Proceed: the assessment with its trace and what a later turn would change; no verdict answer is required")
  | .converge          => (.extension, "TextPresent+Proceed: when converged, the convergence evidence trace; proceed with the assessment")
  | .inconclusive      => (.extension, "TextPresent+Proceed: the same trace with every Undetermined verdict naming what is missing, every unmet check with its reach, and why the run closed")
  | .superseded        => (.extension, "TextPresent+Proceed: report what was assessed, declare the question superseded, and seed a fresh activation; evidence crosses as context, verdicts do not")
  | .seam              => (.extension, "TextPresent+Proceed: at a user-declared chain or a declared edge (the partition route partitionRoute names, or remaining checks all user-held to /inquire), proceed citing the settling source")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
-/

end Analogia

/-! Proofs of the theorems the block above states. The block above is the SKILL.md Lean
    block verbatim; lean-definition checks that prefix and matches every stated signature. -/

namespace Analogia

variable {P : Type}

theorem fuse_extends {P : Type} (c : Context P) (u : Utterance P) :
    ∃ t, fuse c u = c ++ t := ⟨[u.val], rfl⟩

theorem ai_never_grounds {P : Type} (e : Turn P) (h : e.origin = .assistant) :
    e.basis = none := by simp [Turn.basis, h]

theorem no_evidence_no_change (c : Context P) (h : observe c = []) : collect c = c := by
  simp [collect, h]

theorem narrowing_holds_at_gate (c : Context P) (hu : Uncertain c)
    (hn : UnsupportedNarrowing c) : report c = .focusGate := by
  simp [report, hu, hn]

theorem assessment_converged (c : Context P) (h : report c = .assessment) :
    focusSettled c ∧ converged c := by
  unfold report at h
  split at h
  · cases h
  · split at h
    · cases h
    · rename_i h2
      split at h
      · cases h
      · split at h
        · cases h
        · split at h
          · rename_i h5
            refine ⟨?_, h5⟩
            apply Classical.byContradiction
            intro hn
            exact h2 (.inl hn)
          · cases h

theorem check_never_assent {c : Context P} {x : FitClaim} {scope : String} (s : Cite c)
    (ok : (checkCoord (P := P) x scope).admits s.kind) : s.kind ≠ .utterance := ok

theorem purpose_by_utterance {c : Context P} {s : Cite c}
    (ok : (axisCoord (P := P) .purpose).admits s.kind) : s.kind = .utterance := ok

theorem superseded_first (respond : Context P → Response P) (c : Context P)
    (u : Utterance P) (us : List (Utterance P)) (h : Supersedes (fuse c u)) :
    ground respond c (u :: us) = ⟨fuse c u, .superseded⟩ := by
  simp [ground, h]

end Analogia
