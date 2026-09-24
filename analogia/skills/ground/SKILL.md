---
name: ground
description: "Audit what an analogical mapping licenses about an account already in play: warrants each fit claim from cited evidence, not assent. Type: (MappingUncertain, AI, GROUND, R) → MappingAssessment"
---

# Analogia Protocol

Audit what a mapping licenses: construct the correspondences between an abstract structure and the target account in play, warrant each fit claim from evidence the protocol can cite, and report which of the intended inferences the mapping supports, which it blocks, and which stay undetermined. Type: `(MappingUncertain, AI, GROUND, R) → MappingAssessment`.

## Definition

**Analogia** (ἀναλογία): A dialogical act of auditing analogical inference, where AI detects that what a mapping licenses is uncertain, settles the comparison focus and the inferences at stake, constructs the correspondences, warrants each fit claim against evidence it can reach and states what would defeat it, and reports the resulting verdicts with their limits. The user's utterance supplies grounds and records what they adopt; it never promotes a claim to warranted, because assent is not evidence about the world.

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

def Utterance (P : Type) := {e : Turn P // e.basis = some .utterance}
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

/-- One axis the protocol would otherwise pick among viable alternatives fires the focus
    gate. -/
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
    Direction: `references/judgments.md` §BearsOn. -/
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

def checkCoord (x : FitClaim) (scope : String) : Coord P Bearing :=
  { admits := (· ≠ .utterance), supports := CheckSupported x scope }

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
    state read off the grounds the context now holds. Direction: `references/judgments.md`
    §checks. -/
opaque checks : (c : Context P) → List (Check c)

def ChecksExact (c : Context P) : Prop :=
  (∀ x ∈ fitClaims c, (∃ k ∈ inferences c, BearsOn c x k) → ∃ ch ∈ checks c, ch.claim = x) ∧
  (∀ ch ∈ checks c, ch.claim ∈ fitClaims c)

inductive Warrant | open_ (missing : String) | supported | defeated

def Check.warrant {c : Context P} (ch : Check c) : Warrant :=
  match ch.state with
  | .open_ _                  => .open_ ch.wouldChangeIt
  | .filled .supports _ _ _   => .supported
  | .filled .defeats _ _ _    => .defeated

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

def converged (c : Context P) : Prop := ∀ k ∈ inferences c, (judge c k).decisive = true

inductive Pref | adopted | withdrawn

/-- **Your judgment**: the cited utterance adopts or withdraws `x`. -/
opaque PrefSupported : Correspondence → Context P → Turn P → Pref → Prop

/-- What the reader takes up. -/
def prefCoord (x : Correspondence) : Coord P Pref :=
  { admits := (· = .utterance), supports := PrefSupported x }

/-- **Your judgment**: how the user's adoption of `x` stands in `c`. -/
opaque preference : (c : Context P) → (x : Correspondence) → Occ (prefCoord x) c

/-- **Your judgments**: the source abstraction is located; its member instances are exactly
    the target. -/
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
Λ is the fused context and nothing else; every reading above is taken from it.
-/

abbrev Mode (P : Type) := Context P

def PassHolds (c : Context P) : Prop := ChecksExact c ∧ PartitionScoped c

/-! ── PHASE TRANSITIONS ──
A pass surfaces from a context in which `PassHolds`; the focus gate alone holds the turn.
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
/-- `respond` is your surface for the pass. -/
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
A change to the intended inferences alone leaves the mapping as it was. Within a pass,
re-entering an earlier step needs evidence progress: a ground in the context that the affected
step has not yet read, or a still-untried reachable evidence move expected to change its
assessment. No construction or fit pass under `maxReconstructions` is refunded; focus
settlement, read-back, and reassessment over an unchanged mapping spend none. An empty mapping
is assessed like any other. Preference changes no warrant or verdict.
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
```

## Mode Activation

`/ground` remains directly invocable. During AI-guided activation, loaded safety boundaries, capability restrictions, and explicit user instructions continue to bind.

### Activation heuristics and exceptions

Activate where a target account is already in play and what the mapping licenses about it is open: an abstract framework being applied to a concrete case, a possible structural mismatch, or a located abstraction tested against its own members. Prior-session recall indices may seed domain decomposition; they do not settle a constitutive judgment.

The reader's first encounter with either domain is a different deficit. Where the target account is not yet in play — where what is wanted is to come to hold an account rather than to audit one — that is explanation, and it hands off to a capability that explains the unfamiliar domain; this protocol stops there rather than teaching the domain it was invoked to audit. Absence of evidence that an account is in play establishes neither eligibility nor its lack; where the accumulated context does not settle it, say which reading is being used and continue.

Skip AI-guided activation when what the mapping licenses is already settled in context, the output is purely concrete, or no abstract framework is being applied. Route an unlocated, merely sensed essence over accumulated instances to `/induce`; retain a located abstraction tested against its own members as self-grounding. Framework selection and factual context insufficiency remain their own primary deficits.

### Evidence loading

Read code, configuration, documentation, and other available artifacts when the target domain is recorded there. When the relevant source or target structure exists primarily in external APIs, standards, scholarship, or industry material, fetch that evidence and keep its source address visible in the trace.

Where a claim turns on what an artifact does rather than on what it says about itself, exercise it over the case that separates the readings and cite the result.

## Protocol

### User-facing realization

Before assessing, read back the intended conclusions beside the comparison focus and cite the request or settled purpose they come from. When that question changes, show what was added, removed or reformulated and why; a removed unanswered question is outside the revised scope, not resolved. At the focus gate, show each option's consequence before asking: a reframe within the committed pair revises that comparison, while replacing a committed domain ends this audit and starts a new question.

Present the whole assessment in everyday language: the comparison focus; what the mapping is being asked to license; every correspondence with its fit claim, one concrete scenario, and what actually warrants that claim; and for each intended inference, whether it holds, is blocked, or is undetermined, with how far it reaches.

Beside each claim that matters, state the scope its grounds were checked within, what would change it, and who can reach that evidence or why neither party currently can. Carry out the ones this session can reach before presenting, and put the ones only the user holds as the questions they are. An unmet check is reported as unmet. A claim with nothing behind it is named as having nothing behind it rather than described as tentative.

For self-grounding, render a partition only with the grounds supporting its full member allocation and grouping. A split names every rival cell, the fitting core, and all unclustered outliers; a trim distinguishes scattered removal from one-cell reorientation; a hold reports supported fit of all members. Where that basis is unresolved, name what is missing and make no partition recommendation.

Then state what a later turn would change, and proceed without asking for a verdict. When a revision of the intended conclusions narrows them with no basis in the request or the settled purpose, do not re-read the same context: put the comparison focus to the user at the focus gate. Read all its determinate acts together; a changed purpose or intended conclusion reopens settlement and readback, retaining the mapping when only the intended conclusions changed, while evidence reopens the earliest affected assessment step. Evidence moves the assessment: a fact, a source, a counterexample, a result from running something. Saying the mapping looks right moves nothing, and saying so is not a failing on the reader's part — it is what this surface is built not to need. Adoption and withdrawal are recorded as the reader's, kept apart from what the evidence shows, and never given as a reason a verdict came out the way it did. If the turn says one of the two domains is the wrong one, say plainly that this ends the current question rather than adjusting it, and start the new one from what was just said, carrying the evidence but none of the verdicts.

Read `references/round-composition.md` before composing when terminology must remain stable, wording must be carried unchanged, material belongs to another round or trace, or composing a focus gate requires placing evidence before its question and option-specific consequences inside the options.

### Intensity

| Level | When | Format |
|-------|------|--------|
| Light | One inference, one obvious correspondence | Compact rendering of the same required assessment trace |
| Medium | Several inferences or partial correspondences | Required assessment trace grouped by inference and bearing claim |
| Heavy | Complex transfer or structural mismatch | Required assessment trace with expanded domain decomposition and instantiations |

## Rules

- **Warrant tracks evidence, never assent**: Read each fit claim's warrant off the grounds actually cited for it. Agreement does not promote a claim and disagreement does not defeat one without a ground; what the user reports having observed is evidence like any other observation. Record what the reader adopts, report it apart from the evidence, and never offer it as a reason a verdict came out as it did.
- **Convergence is over inferences, not correspondences**: Derive and read back what the mapping is being asked to license from the request and settled purpose before constructing or reassessing it, and read completion over those inferences. A peripheral correspondence may stay open without holding the audit open, and no disposition of correspondences completes it.
- **Every bearing claim carries its own defeater**: For each fit claim an intended inference turns on, state what evidence, within that claim's own scope, would require it to change, and who can reach that evidence. The builder and the checker being the same process is not the defect; a claim with no stated way to be wrong is. A check nobody ran is reported unmet.
- **Audit, not instruction**: This protocol takes a target account already in play. Where the reader does not yet hold one, the deficit is explanation and routes there; do not teach the domain under audit.
- **Recognition over Recall**: Present structured alternatives with anticipatable futures only for a genuine domain decision. Keep the turn-reading constructors internal, so the reader acts in their own language rather than selecting a meta-label.
- **Round composition**: Keep each correspondence beside its nearest evidence, scenario, warrant, and next-move implication. A question about the assessment is exploration; answer it without asking the reader to classify their own turn.
- **Option-set relay test**: Relay a focus axis only where the user's words, a citable standing rule, or a source turn of the text under audit showing that one value is admissible settles it; the decomposition's own output settles nothing. The comparison purpose is never relayed: this audit closes on evidence, so no later utterance of the user's would cover a purpose the AI chose. Constitution options remain viable under different user value weightings; shared trajectories collapse, while off-axis responses remain free-response pathways.
- **Structural evidence**: Cite the specific source and target structures supporting each correspondence, and include a concrete target-domain instantiation. Where a claim turns on an artifact's behavior, exercise the artifact and cite what it did; its own account of that behavior evidences the claim made, not the behavior.
- **Bounded reach**: State the limits supported by the cited grounds and their checked scopes in the same breath as every Licensed verdict. A mapping presented without its breaking point produces confident wrong inference, which is the failure this protocol exists to catch.
- **Self-grounding visibility**: Treat a case as self-grounding only where the source abstraction is located and its member instances are the target. Surface the full member partition and the grounds supporting it before routing split to the `/conduct` decompose-recovery recipe or trim to `/induce`. An unresolved basis carries no partition recommendation. Analogia supplies the partition evidence while the downstream checkpoint constitutes cell membership.
- **Form feedback**: Derive each round's density from the current request and carry an explicit form instruction until countermanded. Change the form directly. Elements fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
- **Zero-gap surfacing**: Present a zero-gap finding with its reasoning before deactivation.
