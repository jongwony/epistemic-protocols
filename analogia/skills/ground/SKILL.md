---
name: ground
description: "A framework, analogy, or earlier design is carried to a case, or an abstraction tested against its own cases, and what it supports is unclear: back each conclusion with cited evidence, not assent."
---

# Analogia Protocol

Audit what a mapping licenses: on the question the person's own words set, collect to the limit of your reach over what the mapping rests on, construct the correspondences between the source structure and the target, warrant each fit claim from evidence the protocol can cite, and report for each conclusion at stake whether it holds, is blocked, or stays undetermined. Type: `(MappingUncertain, AI, GROUND, R) → MappingAssessment`.

## Definition

**Analogia** (ἀναλογία): A dialogical act of auditing analogical inference. A mapping — a framework, an analogy, an earlier design, an abstraction — is being relied on, and what it licenses about the target is unclear: the feeling that it fits does not tell which conclusions it supports. The person's own words set the question: what the comparison is for, the conclusions at stake, and which source and which target where that choice is open; the AI never supplies it. The AI then collects to the limit of its own reach over what the mapping rests on — the source's relations and their counterparts in the target, reading any account it can reach itself — names the places it reached and those it could not, constructs the correspondences, warrants each fit claim against evidence with what would defeat it, and reports for each conclusion the source relation that carries it, what was checked and found, what difference would break it, and whether it holds and how far, is blocked, or stays undetermined with what is missing and who can reach it. What remains open is shown as the person's own unknown. The person's utterance supplies grounds and records what they adopt; it never promotes a claim to warranted, because assent is not evidence about the world. An assessment establishes no correctness beyond the evidence it cites, and a blocked conclusion is not thereby false.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract.
-/

/-! ── FLOW ──
Analogia(R) → start(c) → ground(c, utterances), where c is the fused session context:
  pass(c):
    [the question does not stand on a person's turn]  present it — the purpose, the conclusions
        at stake, and the source–target pair where R and the context leave that choice open —
        and wait; nothing more is collected, and what was collected stays
    [otherwise]  collect(c): to the limit of your reach over what the mapping rests on — the
        source's relations and their target counterparts, and the checks on the claims bearing
        on K; every place looked joins the context, a null result included →
      [the collected context leaves a choice only the person settles]  present the question, wait
      [otherwise]  assessment: each conclusion Licensed with its limits, Blocked, or Undetermined
        with what is missing and who can reach it; present it and proceed — no verdict is asked
  after the assessment: the next move the person declared, an adopted policy, or a grant; work
    that rests on anything not licensed within limits — a Blocked or Undetermined conclusion, or a
    Licensed one beyond its stated limits — waits for the person's words
  next utterance u: c' := fuse(c, u), read whole against R and c' →
    [the question is waiting and u ends the audit]  withdrawn — the waiting question left
        unassessed and the deficit unresolved, said in its report; an earlier assessment stays in
        the context as it was presented, over its own question
    [the audit is withdrawn]  the session answers u; it stays in the context; no pass opens
    [u bears on the audit]  pass(c')   (a changed purpose, conclusion, pair, or ground is read there)
    [otherwise — an adoption alone, a question the current grounds answer entirely, other work]  the
        session answers it; no pass opens; the last outcome stands
  no utterance: the last outcome stands — silence settles nothing
  mid-pass stop: the harness's interrupt — a delegation point, not an outcome
-/

/-! ── MORPHISM ──
R
  → question(R, context) → Q      -- purpose, conclusions at stake (K), and an open pair; only from the person's turn
  → collect(Q, context)            -- to the limit of reach over what the mapping rests on, constructing the claims it needs and running their reachable checks; results join the context; reached and unreached named
  → construct(mapping, context)    -- correspondences and their fit claims; each placement is a claim
  → check(claims bearing on K)     -- per bearing claim, what target-side fact within its scope would change it, and who can reach it; the reachable ones run within collection
  → warrant(claims, checks)        -- read off evidence, never assent
  → judge(K)                       -- Licensed with limits, Blocked, or Undetermined with what is missing
  → surface(assessment)            -- present and proceed; what is open is the person's own unknown
  → MappingAssessment
requires: uncertain(licenses(mapping))  -- declared by invoking /ground; judged only on the AI-guided path
deficit:  MappingUncertain              -- activation precondition
preserves: content_identity(R)          -- output content invariant; the assessment is carried beside R
invariant: Warrant tracks cited evidence, never assent
invariant: The question stands only on the person's turn
-/

namespace Analogia

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

/-- `R`: text carrying a source structure — a framework, an analogy, an earlier design, an
    abstraction — and the target it is applied to: AI output, user analysis, or an external
    reference. The morphism processes it uniformly; it is bound by R-BINDING and read from the
    context, as the positions of its turns. -/
abbrev Text (c : Context P) := List (Fin c.length)

structure Component where
  name      : String
  structure_ : String

structure Correspondence where
  /-- the source side -/
  abstract : Component
  /-- the target side -/
  concrete : Component
  relation : String

/-- One conclusion the mapping is being asked to license about the target: a prediction, a
    permission, a limit, an expected behavior. -/
structure Inference where
  claim : String

/-- The question an audit answers: what the comparison is for, the conclusions at stake (`K`), and
    the source and target — carried only where `R` and the context leave a materially different
    choice of either open, `none` where they fix it. -/
structure Question where
  purpose     : String
  conclusions : List Inference
  pair        : Option (String × String)

/-- **Your judgment**: the cited turn establishes question `q` in `c`, in the whole scope that turn
    asks — a turn asking about A and B supports no question narrowed to A — with conclusions to
    audit. Where the purpose is to carry a structure over — a port, a migration, a sibling's shape
    — and the turn asks nothing narrower, the conclusion is that the structure is preserved in the
    target; the relations under it are what collection finds, never a list fixed here. A narrower
    question the turn asks — whether the retries will match, say — is that turn's whole scope.
    Articulating what a stated purpose entails is reading it; choosing among materially different
    purposes, conclusions, or source–target pairs is not, and a pair `R` or a fact fixes is read,
    not asked. -/
axiom QuestionSupported : Context P → Turn P → Question → Prop

/-- The question stands only on a person's turn: this audit closes on evidence, so no later turn of
    theirs would cover a question you chose. -/
def questionCoord : Coord P Question :=
  { admits := (·.val = .person), supports := QuestionSupported }

/-- **Your judgment**: how the question stands in `c`, read again against the context as it now
    stands. -/
axiom question : (c : Context P) → Occ (questionCoord (P := P)) c

/-- `K`: the conclusions of the question that stands; empty while it is open. -/
def inferences (c : Context P) : List Inference :=
  match question c with
  | .filled q .. => q.conclusions
  | .open_ _     => []

/-- The question stands on a person's turn, with conclusions to audit; an open question has
    none. -/
def QuestionStands (c : Context P) : Prop := inferences c ≠ []

inductive FitLabel
  /-- the target structure preserves the source relation -/
  | preserved
  /-- a correspondence exists, but some of its structural dimensions lack evidence -/
  | «partial»
  /-- the source relation adds constraints the target does not support -/
  | overextended

/-- What fit assessment asserts; every placement, `preserved` included, is a claim that can be
    warranted or defeated. -/
inductive FitClaim
  | fit     (c : Correspondence) (l : FitLabel)
  | missing (x : Component)

/-- **Your judgment**: the correspondences constructed over what collection found. -/
axiom mapping : Context P → List Correspondence

/-- **Your judgment**: the fit claims over the current mapping — each correspondence in exactly
    one cell, and every source component with no evidenced correspondent missing. -/
axiom fitClaims : Context P → List FitClaim

/-- **Your judgment**: whether `x` bears on `k` — its verdict would change if `x` changed. A source
    feature the target lacks bears on `k` only where `k` needs that feature; under the preservation
    conclusion every collected source relation is needed, and a missing counterpart is reported as
    missing. Whether an absence was meant is the person's to say — their turn can narrow the
    conclusion — never yours to infer. Direction: `references/judgments.md` §BearsOn. -/
axiom BearsOn : Context P → FitClaim → Inference → Prop

/-- A fit claim a conclusion of the standing question turns on. -/
def Relevant (c : Context P) (x : FitClaim) : Prop := ∃ k ∈ inferences c, BearsOn c x k

/-- Who can carry a check out. `userHeld` is context only the user holds; it is met by what the
    user reports observing, and otherwise it is shown as their own unknown. -/
inductive Reach
  | aiReachable (action : String)
  | userHeld (question : String)

inductive Bearing | supports | defeats

/-- **Your judgment**: the cited turn establishes, within `scope`, that it supports or defeats
    `x`. A citation's stated bearing is read against its source and scope. Where the evidence
    would fit a materially different explanation as well, read it against that explanation too:
    evidence as expected under either reading supports neither. A person's turn bears only where
    it reports what they observed — a result they ran, a source they read; their assent,
    agreement, or bare assertion establishes nothing here, whatever its form. -/
axiom CheckSupported : FitClaim → String → Context P → Turn P → Bearing → Prop

def checkCoord (x : FitClaim) (scope : String) : Coord P Bearing :=
  { admits := fun _ => True, supports := CheckSupported x scope }

/-- The check on fit claim `x`. -/
structure Check (c : Context P) (x : FitClaim) where
  scope        : String
  /-- a target-side fact or observable result that, within `scope`, would require the claim to
      change -/
  wouldChangeIt : String
  /-- `none`: reachable by neither party now; say what is missing -/
  reach        : Option Reach
  state        : Occ (checkCoord x scope) c
  /-- further cited grounds beside the one that fills the state -/
  more         : List (Cite c)

/-- **Your judgment**: the one check on a fit claim bearing on `K`, its state read off the grounds
    the context now holds; a claim that bears on nothing asked has none. Direction:
    `references/judgments.md` §checks. -/
axiom check : (c : Context P) → (x : FitClaim) → Relevant c x → Check c x

open Classical in
/-- Every check of a pass: exactly one per fit claim bearing on `K`, none for any other. -/
def checks (c : Context P) : List (Σ x : FitClaim, Check c x) :=
  (fitClaims c).filterMap fun x => if h : Relevant c x then some ⟨x, check c x h⟩ else none

inductive Warrant | open_ (missing : String) | supported | defeated

def Check.warrant {c : Context P} {x : FitClaim} (ch : Check c x) : Warrant :=
  match ch.state with
  | .open_ _                  => .open_ ch.wouldChangeIt
  | .filled .supports _ _ _   => .supported
  | .filled .defeats _ _ _    => .defeated

/-- The grounds a verdict cites, each read as evidence — a person's report of what they observed
    among them, never their assent (`CheckSupported`). -/
def Grounds (c : Context P) :=
  {g : List (Cite c) // g ≠ []}

inductive Verdict (c : Context P)
  /-- grounds support the whole conclusion at its asked scope, with a met check for every fit
      claim bearing on it; `limits` is that supported reach -/
  | licensed     (g : Grounds c) (limits : String)
  /-- a decisive ground against this route to the conclusion; it does not make the conclusion
      false -/
  | blocked      (g : Grounds c)
  /-- what is missing and who can reach it; never a check this session can reach and has not
      run -/
  | undetermined (missing : String)

/-- **Your judgment** per conclusion, reading the grounds' bearing on `k` rather than a
    label-to-verdict polarity. Direction: `references/judgments.md` §judge. -/
axiom judge : (c : Context P) → Inference → Verdict c

inductive Pref | adopted | setAside

/-- **Your judgment**: the cited turn of the person's adopts or sets aside conclusion `k` — takes it
    into, or leaves it out of, what they carry over. An instruction to do the next task adopts
    nothing; where their turns conflict, it stays open. -/
axiom PrefSupported : Inference → Context P → Turn P → Pref → Prop

/-- What the reader takes up. It never moves a warrant or a verdict; a conclusion adopted over a
    Blocked or Undetermined verdict stands as accepted and evidentially disputed. -/
def prefCoord (k : Inference) : Coord P Pref :=
  { admits := (·.val = .person), supports := PrefSupported k }

/-- **Your judgment**: how the person's adoption of `k` stands in `c`. -/
axiom preference : (c : Context P) → (k : Inference) → Occ (prefCoord k) c

/-- **Your judgment**: the source abstraction is located. -/
axiom Located : Context P → Prop
/-- **Your judgment**: the source abstraction's member instances are exactly the target. -/
axiom InstancesAreTarget : Context P → Prop

def selfGrounding (c : Context P) : Prop := Located c ∧ InstancesAreTarget c

/-- A supported allocation of the target's members, read only under self-grounding and only where
    the grounds establish the full allocation and each rival grouping. -/
structure PartitionReading (c : Context P) where
  misfits  : List String
  rivals   : List (List String)
  outliers : List String
  core     : List String
  grounds  : Grounds c

/-- **Your judgment**, only under self-grounding: the partition reading, or `none` where its basis
    is unresolved — the assessment then names what is missing and recommends no partition. Split,
    trim and hold are how you may summarize a reading, not a verdict this contract computes.
    Direction: `references/judgments.md` §partition. -/
axiom partition : (c : Context P) → selfGrounding c → Option (PartitionReading c)

/-- **Your collection** from `c`, to the limit of your own reach, over what the mapping rests on:
    the source's relations and their counterparts in the target, the checks on the fit claims
    bearing on `K`, and every one collection exposes; where to look is yours to judge, and no list
    of sources bounds it. A source or target account you can reach, you read yourself, and what
    you say you read, you read whole. Each place you look returns an evidence turn, a null result
    included, so the places reached and those not stay in the context by name. Where collected
    material conflicts, name what conflicts with what and show it, not only as a check's grounds.
    What the context already holds from a source is not fetched again unless an utterance,
    evidence, or your own work since says it changed. Read and run without changing existing state;
    what you create only to look you remove afterwards. An observation that needs to change
    existing state, someone's permission, or another's authority is not made and leaves no evidence
    turn: name it, with what it needs, in what you present, and leave it open. Where a claim turns on what an artifact does, exercise it over the case that
    separates the readings. What is still open once collection ends is shown as the person's own
    unknown. Direction: `references/judgments.md` §collection. -/
axiom observe : Context P → List (Evidence P)

def collect (c : Context P) : Context P := c ++ (observe c).map (·.val)

/-- **Your judgment**: the latest utterance, read whole against `R` and the fused context, bears on
    this audit — a purpose, a conclusion, a source or target, a fact, a source to read, a
    counterexample, a result from running something. One that bears on none of it leaves the audit
    as it stands: the session answers it, that answer stays in the context, and no pass opens. An
    adoption alone opens no pass: it moves no warrant or verdict, `preference` reads it from the
    context, and the session acknowledges it. A turn that brings a ground — a fact, a source, a
    counterexample, a result — bears on the audit whatever its grammatical form, a question
    included; only a question the current grounds answer entirely opens no pass. -/
axiom BearsOnRun : Context P → Prop

/-- **Your judgment**: the latest utterance, read whole, is the person ending this audit while its
    question waits for them. -/
axiom Ends : Context P → Prop

/-- What an assessment carries, read off the contract's own readings over the collected context:
    each conclusion of `K` with its verdict, every check, and, under self-grounding, the partition
    reading. Adoption stays where `preference` reads it. -/
structure Assessed (c : Context P) where
  verdicts  : List (Inference × Verdict c)
  checks    : List (Σ x : FitClaim, Check c x)
  partition : Option (PartitionReading c)

open Classical in
def assessed (c : Context P) : Assessed c :=
  { verdicts  := (inferences c).map fun k => (k, judge c k)
    checks    := checks c
    partition := if h : selfGrounding c then partition c h else none }

/-- Where the audit stands. Each carries the context it was reached on and the relay that
    presents it. -/
inductive Outcome (P : Type)
  /-- the question is presented and waits for the person's turn — before collection, after
      collection surfaced a choice only the person settles, or when a later turn reopens it after
      an assessment; nothing more is collected while it waits, and evidence already collected
      stays. A run status, not a closure. -/
  | holding    (c : Context P) (relay : Response P)
  /-- `MappingAssessment` over the collected context `c`, on which the question stands: every
      conclusion's verdict with its grounds and limits, every check with its warrant, scope,
      defeater and reach, the places reached and those not, and what is open as the person's own
      unknown; under self-grounding, the partition reading or what its basis is missing. Not an
      endorsement of the mapping. -/
  | assessment (c : Context P) (stands : QuestionStands c) (record : Assessed c)
      (relay : Response P)
  /-- the person ended the audit while its question waited: the waiting question was left
      unassessed and the deficit stays unresolved; an earlier assessment, if any, stays in the
      context as it was presented, over its own question -/
  | withdrawn  (c : Context P) (ending : Utterance P) (relay : Response P)

def Outcome.isHolding : Outcome P → Bool
  | .holding .. => true
  | _           => false

/-- The context once the outcome's relay is presented. -/
def Outcome.context : Outcome P → Context P
  | .holding c r        => c ++ [r.val]
  | .assessment c _ _ r => c ++ [r.val]
  | .withdrawn c _ r    => c ++ [r.val]

/-! ── R-BINDING ──
bind(R) = explicit_arg ∪ current_output ∪ most_recent_output
Priority: explicit_arg > current_output > most_recent_output
  /ground "text"    → R = "text"
  /ground (alone)   → R = the most recent relevant output in the session, the AI's or the user's
  "ground this..."  → R = the text currently under discussion
  "does this abstraction hold across its cases?" → R = a candidate abstraction and the
    instances it claims to subsume → self-grounding
With no relevant text, the source and target are open, and the first pass presents the question.
-/

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

/-! ── PHASE TRANSITIONS ──
A step is one arm of a structural recursion over the person's utterances, carrying the context as
it stands and the last outcome. `respond` is your relay for what a step presents — a pass's
question or assessment, a withdrawal's report; `session` is the session's
own answer to an utterance that does not bear on the audit, which stays in the context without
opening a pass.
-/

open Classical in
/-- One pass. While the question does not stand, it is presented and nothing more is collected.
    Once it stands, collection runs; where the collected context leaves the question open again — a
    choice only the person settles surfaced — it is presented; otherwise the assessment is. -/
def pass (respond : Context P → Response P) (c : Context P) : Outcome P :=
  if ¬ QuestionStands c then .holding c (respond c)
  else
    let c₂ := collect c
    if h : QuestionStands c₂ then .assessment c₂ h (assessed c₂) (respond c₂)
    else .holding c₂ (respond c₂)

open Classical in
/-- One utterance, read whole, each answered once: while the question waits, a turn ending the
    audit withdraws it, with its report; a turn bearing on the audit opens a pass; any other turn —
    and every turn once the audit is withdrawn — is the session's, kept in the context, and the
    last outcome stands. -/
def step (respond session : Context P → Response P) (c : Context P) (o : Outcome P)
    (u : Utterance P) : Context P × Outcome P :=
  let c' := fuse c u
  match o with
  | .withdrawn .. => (c' ++ [(session c').val], o)
  | _ =>
    if o.isHolding = true ∧ Ends c' then
      let o' : Outcome P := .withdrawn c' u (respond c')
      (o'.context, o')
    else if BearsOnRun c' then
      let o' := pass respond c'
      (o'.context, o')
    else (c' ++ [(session c').val], o)

def ground (respond session : Context P → Response P) :
    Context P → Outcome P → List (Utterance P) → Outcome P
  | _, o, []      => o
  | c, o, u :: us =>
    let r := step respond session c o u
    ground respond session r.1 r.2 us

/-- The audit opens on a pass. -/
def start (respond session : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  let o := pass respond c
  ground respond session o.context o us

/-! ── LOOP ──
Every utterance is read whole against the context as it now stands: nothing counts passes or
reconstructions, and no earlier reading is held apart from what later turns say. A changed
purpose, conclusion, source or target, or a new ground is simply the context the next pass reads;
evidence already gathered stays in the context, and every verdict is judged again over the
question that now stands. Silence takes nothing: the last outcome stands, and a waiting question
stays open. Adoption changes no warrant or verdict. Stopping in the middle of a pass is the
harness's interrupt.
-/

/-! ── CONVERGENCE ──
assessed: a pass in which the question stood on the person's turn, collection reached what it
could, and every conclusion in K carries a verdict — Licensed with its limits, Blocked, or
Undetermined naming what is missing and who can reach it. Undetermined does not block the
assessment and is not settled by it; a check this session can reach and has not run is run, not
reported Undetermined. Convergence evidence: the question with the person's turn it stands on —
the purpose, K, and the source and target audited, with the turn or fact that fixed them or the
person's answer where the choice was open; for each k in K, one pair
(MappingUncertain(k) → verdict(k)) showing the source relation that carries it, the
correspondences it rode on, the likenesses, the differences in both directions, and the unknowns;
for each checked fit claim, its label, warrant (`Check.warrant`), and scope beside the grounds,
the stated defeater, the reach or its absence, whether the check was unmet, survived, or
failed, and any materially different explanation the evidence fits as well; correspondences
outside the checked scope named as outside it; the places collection
reached and those it did not, by name; where collected material conflicts, what conflicts with
what; what is still open, as the person's own unknown. An unmet
check is reported as unmet, never as a pass; a claim whose warrant is open is named open rather
than weakly supported. Adoption is reported apart from warrant and never as a reason; a
conclusion adopted over a Blocked or Undetermined verdict is shown as accepted and evidentially
disputed. Carry any change to the question, distinguishing conclusions removed from scope from
conclusions answered. Under self-grounding, append the partition reading with its grounds, or
what its basis is missing. Demonstrated, not asserted.
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

inductive Op | questionRead | questionGate | questionReadback | collect | construct | checkRead
             | warrantRead | judge | partitionRead | surface | converge | readAnswer | withdraw
             | seam

def grounding : Op → Annot × String
  | .questionRead     => (.sense, "Internal analysis: how the question stands on the person's turns — the purpose, the conclusions at stake in the whole scope asked, and whether R and the context leave a materially different choice of source or target open")
  | .questionGate     => (.interaction .constitution, "when the question does not stand on a person's turn — before collection, after collection surfaced a choice only the person settles, or when a later turn reopens it: what is open, with what each reading would audit visible before choice; nothing more is collected while it waits, and evidence already collected stays")
  | .questionReadback => (.interaction .extension, "when the question stands, relay it — the purpose, the conclusions, and the source and target audited — with the person's turn it stands on, and what a revision added, removed, or reformulated; no approval required")
  | .collect          => (.observe, "artifact read, artifact search, record read, external fetch, environment run: collection as `observe` states")
  | .construct        => (.sense, "Internal analysis: the correspondences over what collection found and their fit claims")
  | .checkRead        => (.sense, "Internal analysis: one check per fit claim bearing on K, each with its scope, target-side defeater, and reach")
  | .warrantRead      => (.sense, "Internal analysis: each claim's warrant read off its check")
  | .judge            => (.sense, "Internal analysis: per conclusion, Licensed with limits, Blocked, or Undetermined with what is missing and who can reach it")
  | .partitionRead    => (.sense, "Internal analysis: under self-grounding, the member allocation and its grounds, or its missing basis; no separate gate")
  | .surface          => (.interaction .extension, "the assessment with its trace, the places reached and not, what is open as the person's own unknown, and what a later turn would change; no verdict answer is required")
  | .converge         => (.interaction .extension, "the convergence evidence CONVERGENCE names; proceed with the assessment")
  | .readAnswer       => (.sense, "Internal analysis: the latest utterance read whole against R and the fused context as it now stands — whether it bears on the audit, and, while the question waits, whether it ends the audit")
  | .withdraw         => (.interaction .extension, "when the person ends the audit while its question waits: say that the waiting question was left unassessed and the deficit unresolved; an earlier assessment, if any, stays in the context as it was presented, over its own question")
  | .seam             => (.interaction .extension, "after the assessment, proceed to the next move the person declared, an adopted policy, or a grant, citing that source; work that rests on anything not licensed within limits — a Blocked or Undetermined conclusion, or a Licensed one beyond its stated limits — waits for the person's words, with that conclusion's grounds shown; this protocol declares no wired outbound edge and names no other protocol, and every Constitution gate fires unchanged")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
-/

end

end Analogia
```

## Mode Activation

`/ground` remains directly invocable, and invoking it declares the deficit; it is not judged away. During AI-guided activation, loaded safety boundaries, capability restrictions, and explicit user instructions continue to bind.

### Activation heuristics and exceptions

Activate where a mapping is being relied on and what it licenses about a case is open: an abstract framework applied to a concrete case, a structure carried over from an earlier design or a sibling, a possible structural mismatch, or a located abstraction tested against its own members. Prior-session recall indices may seed where to look; they do not settle a constitutive judgment.

A source or target account this session can reach — code, documents, a repository, a published source — is read as evidence inside the audit, whether or not the reader already holds it; the audit never waits for the reader to bring an account first, and never asks them to judge a correspondence. Where what the reader wants is only to come to hold an account, with no mapping being relied on, that is explanation rather than this audit, and the AI-guided path does not activate. Absence of evidence that a mapping is being relied on establishes neither eligibility nor its lack; where the accumulated context does not settle it, say which reading is being used and continue.

Skip AI-guided activation when what the mapping licenses is already settled in context, or no mapping is being relied on. An essence merely sensed across accumulated instances, with no located abstraction yet, is a different deficit; a located abstraction tested against its own members is self-grounding. Framework selection, factual context insufficiency, and whether an already-produced result applies in its actual context remain their own primary deficits.

### Evidence loading

Collect to the limit of your own reach over what the mapping rests on: read code, configuration, documentation, and other available artifacts where either structure is recorded there, and where the source or target structure lives primarily in external APIs, standards, scholarship, or industry material, fetch it and keep its source address visible in the trace. Name the places reached and those that could not be.

Where a claim turns on what an artifact does rather than on what it says about itself, exercise it over the case that separates the readings and cite the result.

## Protocol

### User-facing realization

Before assessing, read back the question — what the comparison is for, the conclusions at stake, and the source and target being audited — citing the person's turn it stands on, and the turn or fact that fixed the source and target where R or the context did. Where their words leave any of it open, present the question and wait: show what is open and what each reading would audit, and collect nothing more until their turn answers; what was already collected stays. A source and target that R or a fact fixes are read, not asked. When the question changes, show what was added, removed or reformulated and why; a removed conclusion is outside the revised question, not resolved.

Present the whole assessment in everyday language: the question; for each conclusion, the source relation that carries it, every correspondence it rides on with its fit claim, one concrete scenario, and what actually warrants that claim, the likenesses and the differences in both directions, and what is still unknown; and whether each conclusion holds, is blocked, or is undetermined, with how far it reaches. A source feature the target lacks counts against a conclusion only where that conclusion needs it; under the preservation conclusion, a missing counterpart is reported as missing, and whether an absence was meant is the reader's to say.

Beside each claim that matters, state the scope its grounds were checked within, the target-side fact or observable result that would change it, any materially different explanation its evidence fits as well, and who can reach that evidence or why neither party currently can. Carry out the checks this session can reach before presenting, and name the places collection reached and those it could not; where collected material conflicts, name what conflicts with what. What is still open is shown as the person's own unknown, as the question it is. An unmet check is reported as unmet. A claim with nothing behind it is named as having nothing behind it rather than described as tentative.

For self-grounding, name the level of abstraction at which fit is claimed and allocate every member, rendering a partition only with the grounds supporting that allocation and grouping and with a contrast that makes the fit diagnostic. A split names every rival cell, the fitting core, and all unclustered outliers; a trim distinguishes scattered removal from one-cell reorientation; a hold reports supported fit of all members. Where that basis is unresolved, name what is missing and make no partition recommendation.

Then state what a later turn would change, and proceed without asking for a verdict; work that rests on anything not licensed within limits — a blocked or undetermined conclusion, or a licensed one beyond its stated limits — waits for the reader's words, with that conclusion's grounds shown. A later turn is read whole: one that bears on the audit — a changed purpose, conclusion, source or target, a fact, a source, a counterexample, a result from running something — is the context the next pass reads, and a question the current grounds answer entirely is answered without a new pass; evidence already gathered stays, and verdicts are judged again over the question that now stands. Saying the mapping looks right moves nothing, and saying so is not a failing on the reader's part — it is what this surface is built not to need. Adoption is the reader's own turn taking a conclusion into, or setting it aside from, what they carry over; it opens no pass, and an instruction to do the next task adopts nothing. Adopting and setting aside are recorded as the reader's, kept apart from what the evidence shows, and never given as a reason a verdict came out the way it did; a conclusion adopted over a blocked or undetermined verdict stands as accepted and evidentially disputed, with its grounds shown. While the question waits, a turn ending the audit withdraws it: say plainly that the waiting question was left unassessed and the deficit unresolved; an earlier assessment, if any, stays in the context as it was presented, over its own question. After that, a turn is simply answered.

Read `references/round-composition.md` before composing when terminology must remain stable, wording must be carried unchanged, material belongs to another round or trace, or composing the question requires placing evidence before its question and option-specific consequences inside the options.

### Intensity

| Level | When | Format |
|-------|------|--------|
| Light | One conclusion, one obvious correspondence | Compact rendering of the same required assessment trace |
| Medium | Several conclusions or partial correspondences | Required assessment trace grouped by conclusion and bearing claim |
| Heavy | Complex transfer or structural mismatch | Required assessment trace with expanded collection and instantiations |

## Rules

- **Warrant tracks evidence, never assent**: Read each fit claim's warrant off the grounds actually cited for it. Agreement does not promote a claim and disagreement does not defeat one without a ground; what the user reports having observed is evidence like any other observation. Evidence that would fit a materially different explanation as well is read against that explanation too. Record what the reader adopts, report it apart from the evidence, and never offer it as a reason a verdict came out as it did.
- **The question stands on the person's turn**: Read the purpose, the conclusions at stake in the whole scope asked, and the source and target where that choice is open off the person's own words before collecting, constructing, or reassessing. The AI never supplies the purpose, narrows the conclusions below what the cited turn asks, or picks between materially different sources or targets: this audit closes on evidence, so no later utterance of the user's would cover a question the AI chose. A question the user's words settle is read back; otherwise it is asked, and nothing more is collected while it waits. Constitution options remain viable under different user value weightings; shared trajectories collapse, while off-axis responses remain free-response pathways.
- **Collect to the limit of reach**: Collect over what the mapping rests on until nothing reachable is left; name the places reached and those that could not be; show what remains open as the person's own unknown, never as a stall. Where the purpose is to carry a structure over and the person's turn asks nothing narrower, audit whether the whole structure is preserved, with its relations found by collection.
- **Judgment is over conclusions, not correspondences**: Judge each conclusion on its own. A peripheral correspondence may stay open without holding the audit open, and no disposition of correspondences completes it. An undetermined conclusion completes the assessment; a reachable check left unrun does not.
- **Every bearing claim carries its own defeater**: For each fit claim a conclusion turns on, state what target-side fact or observable result, within that claim's own scope, would require it to change, and who can reach that evidence. The builder and the checker being the same process is not the defect; a claim with no stated way to be wrong is. A check nobody ran is reported unmet.
- **Recognition over Recall**: Present structured alternatives with anticipatable futures only for the question, where the person's words leave a genuine choice open. Read their turns whole, so the reader acts in their own language rather than selecting a meta-label.
- **Round composition**: Keep each correspondence beside its nearest evidence, scenario, warrant, and next-move implication. A question the current grounds answer entirely is answered; any other — one they do not settle, or one that brings a ground — opens the next pass; the reader is never asked to classify their own turn.
- **Structural evidence**: Cite the specific source and target structures supporting each correspondence, and include a concrete target-domain instantiation. Where a claim turns on an artifact's behavior, exercise the artifact and cite what it did; its own account of that behavior evidences the claim made, not the behavior.
- **Bounded reach**: State the limits supported by the cited grounds and their checked scopes in the same breath as every Licensed verdict. A mapping presented without its breaking point produces confident wrong inference, which is the failure this protocol exists to catch.
- **Self-grounding visibility**: Treat a case as self-grounding only where the source abstraction is located and its member instances are the target. Surface the full member allocation and the grounds supporting it; an unresolved basis carries no partition recommendation. Analogia supplies the partition evidence; what becomes of the cells is the reader's.
- **Form feedback**: Derive each round's density from the current request and carry an explicit form instruction until countermanded. Change the form directly. Elements fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
