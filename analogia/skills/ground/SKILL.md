---
name: ground
description: "A framework, analogy, or earlier design is carried to a case, or an abstraction tested against its own cases, and what it supports is unclear: back each conclusion with cited evidence, not assent."
---

# Analogia Protocol

Audit what a mapping licenses: on the question the person's own words set, collect to the limit of your reach over what the mapping rests on, construct the correspondences between the source structure and the target, warrant each fit claim from evidence the protocol can cite, and report for each conclusion at stake whether it holds, is blocked, or stays undetermined. Type: `(MappingUncertain, AI, GROUND, R) → MappingAssessment`.

## Definition

**Analogia** (ἀναλογία): A dialogical act of auditing analogical inference. A mapping — a framework, an analogy, an earlier design, an abstraction — is being relied on, and what it licenses about the target is unclear: the feeling that it fits does not tell which conclusions it supports. The person's own words set the question: what the comparison is for, the conclusions at stake, and which source and which target where that choice is open; the AI may draft it, and only the person's turn makes it stand. The AI then collects to the limit of its own reach over what the mapping rests on — the source's relations and their counterparts in the target, reading any account it can reach itself — names the places it reached and those it could not, constructs the correspondences, warrants each fit claim against evidence with what would defeat it, and reports for each conclusion the source relation, or chain of relations, that carries it, what was checked and found, what difference would break it, and whether it holds and how far, is blocked, or stays undetermined with what is missing and who can reach it. What remains open is shown as the person's own unknown. The person's utterance supplies grounds and records what they adopt; it never promotes a claim to warranted, because assent is not evidence about the world. An assessment establishes no correctness beyond the evidence it cites, and a blocked conclusion is not thereby false.

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
    [the question does not stand on a person's turn]  the question gate (TOOL GROUNDING
        `questionGate`); wait; nothing more is collected, and what was collected stays
    [otherwise]  collect(c): to the limit of your reach over what the mapping rests on — the
        source's relations and their target counterparts, and the checks on the claims bearing
        on K; every place looked joins the context, a null result included →
      [the collected context leaves a choice of purpose, conclusions, or pair only the person
          settles]  the question gate, wait
      [otherwise]  assessment: each conclusion Licensed with its limits, Blocked, or Undetermined
        with what is missing and who can reach it; present it and proceed — no verdict is asked
  next requested move: as TOOL GROUNDING `seam` states
  next utterance u: c' := fuse(c, u), read whole against R and c' →
    [u bears on the audit]  pass(c')   (a changed purpose, conclusion, pair, or ground is read there)
    [otherwise — adopting or setting aside a conclusion, a question the current grounds answer
        entirely, other work, turning away from a waiting question]  the session answers it; no
        pass opens; the last outcome stands — a waiting question stays open
  no utterance: the last outcome stands — silence settles nothing
  mid-pass stop: the harness's interrupt — a delegation point, not an outcome
-/

/-! ── MORPHISM ──
R
  → question(R, context) → Q      -- purpose, conclusions at stake (K), and an open pair; drafted with the person, standing only on their turn
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

/-- A source component and its target counterpart, related by `relation`: the source relation the
    pair carries — one relation, or a composite of relations read as one from its first term to
    its last. -/
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

/-- Who first put the question forward: you, as a draft read from the context and shown with its
    grounds, or the person. -/
inductive Proposer | draft | person

/-- What the person's turn that made the question stand did: set it in its own words, or took a
    draft put forward before, as it was or corrected. -/
inductive Standing | set | adopted

/-- The question an audit answers: what the comparison is for, the conclusions at stake (`K`), and
    the source and target — carried only where `R` and the context leave a materially different
    choice of either open, `none` where they fix it — with who first put it forward and how it
    came to stand. A question concerns one source–target pair. -/
structure Question where
  purpose     : String
  conclusions : List Inference
  pair        : Option (String × String)
  proposer    : Proposer
  standing    : Standing

/-- **Your judgment**: the cited turn establishes question `q` in `c`, in the whole scope that turn
    asks — a turn asking about A and B supports no question narrowed to A — with conclusions to
    audit. Where the purpose is to carry a structure over — a port, a migration, a sibling's shape
    — and the turn asks nothing narrower, the conclusion is that the structure is preserved in the
    target; the relations under it are what collection finds, never a list fixed here. Where an
    abstraction is tested against its own cases, each case within the scope the turn asks is a
    conclusion — that it instantiates the abstraction — and a collective relation the turn asks of
    the cases together is a conclusion of its own, never replaced by the per-case ones. A narrower
    question the turn asks — whether the retries will match, say — is that turn's whole scope.
    Articulating what a stated purpose entails is reading it; choosing among materially different
    purposes, conclusions, or source–target pairs is not, and a pair `R` or a fact fixes is read,
    not asked. How the source reads is none of these choices: its materially different readings
    are yours to infer while constructing, and the question does not wait on them. Once a
    person's turn names which reading they mean, that turn fixes the sense of their question's
    conclusions; no other turn does. The question stands only on the person's turn that sets it in
    their own words (`set`) or takes a draft you put forward, as it was or corrected (`adopted`); a
    draft counts only where it was visible as yours, with its grounds, before that turn. A draft
    alone is a proposal, and an instruction to do the next task takes none. You never choose, drop,
    or conflate source–target pairs. -/
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

/-- **Your judgment**: the fit claims over the correspondences constructed from what collection
    found, each distinct claim once — each correspondence in exactly one cell, and every source
    component with no evidenced correspondent missing. They cover the composite of every chain of
    source relations a conclusion of `K` rests on; under the preservation conclusion, the chains the
    source itself runs as one or asserts equal to another path. A step whose endpoints have
    counterparts but whose relation has none is that step's correspondence placed `overextended`,
    reported as a step with no counterpart; a step whose component has no counterpart is that
    component `missing`. -/
axiom fitClaims : Context P → List FitClaim

/-- **Your judgment**: whether `x` bears on `k` — its verdict would change if `x` changed. A source
    feature the target lacks bears on `k` only where `k` needs that feature; under the preservation
    conclusion every source relation is needed, and a missing counterpart is reported as
    missing. Whether an absence was meant is the person's to say — their turn can narrow the
    conclusion — never yours to infer. Where `k` is that a case instantiates an abstraction, what
    bears is what the abstraction actually requires of that case — read per reading where its
    purpose leaves several: a feature it leaves optional, absent there, is no misfit. Direction:
    `references/judgments.md` §BearsOn. -/
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
    evidence as expected under either reading supports neither. A turn of any admitted origin bears
    only through what it reports observing or the source content it carries — a result run, a
    source read — read against the claim and scope; assent, agreement, or bare endorsement
    establishes nothing here, whatever its form or origin. -/
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
    label-to-verdict polarity. Where the verdict on `k` turns on which of the source's materially
    different readings holds, `k` is Undetermined, its `missing` naming which reading as the
    person's to say, with each reading's verdict and grounds shown side by side; where the
    readings reach the same verdict, judge it plainly. Direction: `references/judgments.md`
    §judge. -/
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

/-- **Your collection** from `c`, to the limit of your own reach, over what the mapping rests on:
    the source's relations and their counterparts in the target, the checks on the fit claims
    bearing on `K`, and every one collection exposes; where to look is yours to judge, and no list
    of sources bounds it. A source or target account you can reach, you read yourself, and what
    you say you read, you read whole. Each place you look returns an evidence turn, a null result
    included, so the places looked stay in the context by name. Where collected
    material conflicts, name what conflicts with what and show it, not only as a check's grounds.
    What the context already holds from a source is not fetched again unless an utterance,
    evidence, or your own work since says it changed. Read and run without changing existing state;
    what you create only to look you remove afterwards. An observation that needs to change
    existing state, someone's permission, or another's authority is not made and leaves no evidence
    turn: name it, with what it needs, in what you present, and leave it open. Where a claim turns
    on what an artifact does, exercise it over the case that separates the readings. Collection
    includes trying the construction it needs: a reachable check that constructing the
    correspondences over what was collected exposes is run within collection as well. What is
    still open once collection ends is shown as the person's own unknown. Direction:
    `references/judgments.md` §collection. -/
axiom observe : Context P → List (Evidence P)

def collect (c : Context P) : Context P := c ++ (observe c).map (·.val)

/-- **Your judgment**: the latest utterance, read whole against `R` and the fused context, bears on
    this audit — a purpose, a conclusion, a source or target, a fact, a source to read, a
    counterexample, a result from running something. One that bears on none of it leaves the audit
    as it stands: the session answers it, that answer stays in the context, and no pass opens.
    Adopting or setting aside a conclusion alone opens no pass: it moves no warrant or verdict,
    and the session acknowledges it — reading `preference` for that conclusion and showing the
    adoption apart from its verdict; an adoption over a Blocked or Undetermined verdict is shown as
    accepted and evidentially disputed, with those grounds visible. Taking a drafted question, or
    setting the question in the person's own words, makes it stand and opens a pass. A turn that
    brings this audit a relevant new ground — a fact, a source, a counterexample, a result — bears
    on it whatever its grammatical form, a question included; a question about this audit opens a
    pass unless the current grounds answer it entirely; a question about other work is the
    session's. -/
axiom BearsOnRun : Context P → Prop

/-- What an assessment carries, read off the contract's own readings over the collected context:
    each conclusion of `K` with its verdict, and every check. Adopting or setting aside a
    conclusion stays where `preference` reads it. -/
structure Assessed (c : Context P) where
  verdicts : List (Inference × Verdict c)
  checks   : List (Σ x : FitClaim, Check c x)

def assessed (c : Context P) : Assessed c :=
  { verdicts := (inferences c).map fun k => (k, judge c k)
    checks   := checks c }

/-- Where the audit stands. Each carries the context it was reached on and the relay that
    presents it. -/
inductive Outcome (P : Type)
  /-- the question gate is presented and waits for the person's turn — before collection, after
      collection surfaced a choice of purpose, conclusions, or pair only the person settles, or
      when a later turn reopens it after an assessment; nothing more is collected while it
      waits, and evidence already collected stays. A run status, not a closure. -/
  | holding    (c : Context P) (relay : Response P)
  /-- `MappingAssessment` over the collected context `c`, on which the question stands: every
      conclusion's verdict with its grounds and limits, every check with its warrant, scope,
      defeater and reach, the places reached and those not, and what is open as the person's own
      unknown. Not an endorsement of the mapping. -/
  | assessment (c : Context P) (stands : QuestionStands c) (record : Assessed c)
      (relay : Response P)

/-- The context once the outcome's relay is presented. -/
def Outcome.context : Outcome P → Context P
  | .holding c r        => c ++ [r.val]
  | .assessment c _ _ r => c ++ [r.val]

/-! ── R-BINDING ──
bind(R) = explicit_arg ∪ current_output ∪ most_recent_output
Priority: explicit_arg > current_output > most_recent_output
  /ground "text"    → R = "text"
  /ground (alone)   → R = the most recent relevant output in the session, the AI's or the user's
  "ground this..."  → R = the text currently under discussion
  "does this abstraction hold across its cases?" → R = a candidate abstraction and the
    instances it claims to subsume → self-grounding
With no relevant text, the first pass's question gate asks for the material to audit; it invents
no candidate.
-/

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

/-! ── PHASE TRANSITIONS ──
A step is one arm of a structural recursion over the person's utterances, carrying the context as
it stands and the last outcome. `respond` is your relay for what a pass presents — the question
or the assessment; `session` is the session's own answer to an utterance that does not bear on the audit, which stays in the context without
opening a pass.
-/

open Classical in
/-- One pass. While the question does not stand, it is presented and nothing more is collected.
    Once it stands, collection runs; where the collected context leaves the question open again — a
    choice of purpose, conclusions, or pair only the person settles surfaced — it is presented;
    otherwise the assessment is. -/
def pass (respond : Context P → Response P) (c : Context P) : Outcome P :=
  if ¬ QuestionStands c then .holding c (respond c)
  else
    let c₂ := collect c
    if h : QuestionStands c₂ then .assessment c₂ h (assessed c₂) (respond c₂)
    else .holding c₂ (respond c₂)

open Classical in
/-- One utterance, read whole, each answered once: a turn bearing on the audit opens a pass; any
    other turn — one turning away from a waiting question included — is the session's, kept in
    the context, and the last outcome stands. -/
def step (respond session : Context P → Response P) (c : Context P) (o : Outcome P)
    (u : Utterance P) : Context P × Outcome P :=
  let c' := fuse c u
  if BearsOnRun c' then
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
reported Undetermined. Convergence evidence: the question with the person's turn it stands on,
who first put it forward, and whether that turn set it or took a draft —
the purpose, K, and the source and target audited, with the turn or fact that fixed them or the
person's answer where the choice was open; for each k in K, one pair
(MappingUncertain(k) → verdict(k)) showing the source relation, or chain of relations, that
carries it, the correspondences it rode on, the likenesses, the differences in both directions,
and the unknowns;
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
conclusions answered. Demonstrated, not asserted.
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
             | warrantRead | judge | surface | converge | readAnswer | seam

def grounding : Op → Annot × String
  | .questionRead     => (.sense, "Internal analysis: how the question stands on the person's turns — the purpose, the conclusions at stake in the whole scope asked, and whether R and the context leave a materially different choice of source or target open")
  | .questionGate     => (.interaction .constitution, "when the question does not stand on a person's turn — before collection, after collection surfaced a choice of purpose, conclusions, or source–target pair only the person settles, or when a later turn reopens it: with material in the context to draft from, a question drafted from it — the purpose, the conclusions, and the source–target pair where open — with its grounds, one draft per materially divergent candidate, each with what it would audit, for the person to take, correct, or replace in their own words; with no referent to draft from, ask for the material to audit, inventing no candidate, and design the question with them once it is there; nothing more is collected while it waits, and evidence already collected stays")
  | .questionReadback => (.interaction .extension, "when the question stands, relay it — the purpose, the conclusions, and the source and target audited — with the person's turn it stands on, and what a revision added, removed, or reformulated; no approval required")
  | .collect          => (.observe, "artifact read, artifact search, record read, external fetch, environment run: collection as `observe` states")
  | .construct        => (.sense, "Internal analysis: the correspondences over what collection found and their fit claims")
  | .checkRead        => (.sense, "Internal analysis: one check per fit claim bearing on K, each with its scope, target-side defeater, and reach")
  | .warrantRead      => (.sense, "Internal analysis: each claim's warrant read off its check")
  | .judge            => (.sense, "Internal analysis: per conclusion, Licensed with limits, Blocked, or Undetermined with what is missing and who can reach it")
  | .surface          => (.interaction .extension, "the assessment with its trace, the places reached and not, what is open as the person's own unknown, and what a later turn would change; no verdict answer is required")
  | .converge         => (.interaction .extension, "the convergence evidence CONVERGENCE names; proceed with the assessment")
  | .readAnswer       => (.sense, "Internal analysis: the latest utterance read whole against R and the fused context as it now stands — whether it bears on the audit")
  | .seam             => (.interaction .extension, "the next move the person requests, an adopted policy, or a grant, citing that source: where the requested work rests on anything not licensed within limits — a Blocked or Undetermined conclusion, a Licensed one beyond its stated limits, or, while the question waits, the mapping itself, unaudited — show what it rests on and hold that work; the hold binds the work, not a turn, and only the person's later words directing that work, after its grounds or unaudited basis were shown, release it — 'go ahead' can suffice in context; a release neither adopts the conclusion nor changes its warrant, and an unrelated reply or silence directs nothing; this protocol declares no wired outbound edge and names no other protocol, and every Constitution gate fires unchanged")

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

Before assessing, read back the question — what the comparison is for, the conclusions at stake, and the source and target being audited — citing the person's turn it stands on — whether they set it or took your draft — and the turn or fact that fixed the source and target where R or the context did. Where their words leave any of it open, present the question gate (TOOL GROUNDING `questionGate`) rather than an open question, and collect nothing more until their turn takes or sets the question; what was already collected stays. An instruction to do the next task takes no draft. A source and target that R or a fact fixes are read, not asked. When the question changes, show what was added, removed or reformulated and why; a removed conclusion is outside the revised question, not resolved.

Present the whole assessment in everyday language: the question; for each conclusion, the source relation, or chain of relations, that carries it, every correspondence it rides on with its fit claim, one concrete scenario, and what actually warrants that claim, the likenesses and the differences in both directions, and what is still unknown; and whether each conclusion holds, is blocked, or is undetermined, with how far it reaches. A source feature the target lacks counts against a conclusion only where that conclusion needs it; under the preservation conclusion, a missing counterpart is reported as missing, and whether an absence was meant is the reader's to say. Where a conclusion's verdict turns on how the source reads, show each reading with its verdict and grounds side by side, and name which reading holds as the reader's to say.

Beside each claim that matters, state the scope its grounds were checked within, the target-side fact or observable result that would change it, any materially different explanation its evidence fits as well, and who can reach that evidence or why neither party currently can. Carry out the checks this session can reach before presenting, and name the places collection reached and those it could not; where collected material conflicts, name what conflicts with what. What is still open is shown as the person's own unknown, as the question it is. An unmet check is reported as unmet. A claim with nothing behind it is named as having nothing behind it rather than described as tentative.

Then state what a later turn would change, and proceed without asking for a verdict; next work the person requests follows TOOL GROUNDING `seam`. A later turn is read whole: one that bears on the audit — a changed purpose, conclusion, source or target, a fact, a source, a counterexample, a result from running something — is the context the next pass reads, and a question about this audit the current grounds answer entirely is answered without a new pass; evidence already gathered stays, and verdicts are judged again over the question that now stands. Saying the mapping looks right moves nothing, and saying so is not a failing on the reader's part — it is what this surface is built not to need. Adoption is the reader's own turn taking a conclusion into, or setting it aside from, what they carry over; it opens no pass, and an instruction to do the next task adopts nothing. Adopting and setting aside are recorded as the reader's, kept apart from what the evidence shows, and never given as a reason a verdict came out the way it did; a conclusion adopted over a blocked or undetermined verdict stands as accepted and evidentially disputed, with its grounds shown. While the question waits, a turn that turns to other work is simply answered; the question stays open.

Read `references/round-composition.md` before composing when terminology must remain stable, wording must be carried unchanged, material belongs to another round or trace, or composing the question requires placing evidence before its question and option-specific consequences inside the options.

### Intensity

| Level | When | Format |
|-------|------|--------|
| Light | One conclusion, one obvious correspondence | Compact rendering of the same required assessment trace |
| Medium | Several conclusions or partial correspondences | Required assessment trace grouped by conclusion and bearing claim |
| Heavy | Complex transfer or structural mismatch | Required assessment trace with expanded presentation of evidence and instantiations |

## Rules

- **Warrant tracks evidence, never assent**: Read each fit claim's warrant off the grounds actually cited for it. Agreement does not promote a claim and disagreement does not defeat one without a ground; what the user reports having observed is evidence like any other observation. Evidence that would fit a materially different explanation as well is read against that explanation too. Record what the reader adopts, report it apart from the evidence, and never offer it as a reason a verdict came out as it did.
- **The question stands on the person's turn**: Read the purpose, the conclusions at stake in the whole scope asked, and the source and target where that choice is open off the person's own words before collecting, constructing, or reassessing. The AI drafts the question with the person but never makes it stand: it does not settle the purpose, narrow the conclusions below what the cited turn asks, or pick between materially different sources or targets without their turn, because this audit closes on evidence and no later utterance of the user's would cover a question the AI made stand. A question the user's words settle is read back; otherwise the question gate (`questionGate`) is presented, and nothing more is collected while it waits. Constitution options remain viable under different user value weightings; shared trajectories collapse, while off-axis responses remain free-response pathways.
- **Collect to the limit of reach**: Collect over what the mapping rests on until nothing reachable is left; name the places reached and those that could not be; show what remains open as the person's own unknown, never as a stall. Where the purpose is to carry a structure over and the person's turn asks nothing narrower, audit whether the whole structure is preserved, with its relations found by collection.
- **Judgment is over conclusions, not correspondences**: Judge each conclusion on its own. A peripheral correspondence may stay open without holding the audit open, and no disposition of correspondences completes it. An undetermined conclusion completes the assessment; a reachable check left unrun does not.
- **A chain is checked as a chain**: A conclusion carried by a chain of source relations is licensed only with a met check on the composite; met checks on every step alone never license it. Evidence that defeats preservation through the composite blocks that route, never the conclusion's truth. A Licensed preservation verdict names in its limits the relations and composites checked.
- **Every bearing claim carries its own defeater**: For each fit claim a conclusion turns on, state what target-side fact or observable result, within that claim's own scope, would require it to change, and who can reach that evidence. The builder and the checker being the same process is not the defect; a claim with no stated way to be wrong is. A check nobody ran is reported unmet.
- **Round composition**: Keep each correspondence beside its nearest evidence, scenario, warrant, and next-move implication. Which turn opens a pass is `BearsOnRun`'s reading; the reader is never asked to classify their own turn.
- **Structural evidence**: Cite the specific source and target structures supporting each correspondence, and include a concrete target-domain instantiation. Where a claim turns on an artifact's behavior, exercise the artifact and cite what it did; its own account of that behavior evidences the claim made, not the behavior.
- **Bounded reach**: State the limits supported by the cited grounds and their checked scopes in the same breath as every Licensed verdict. A mapping presented without its breaking point produces confident wrong inference, which is the failure this protocol exists to catch.
- **Form feedback**: Derive each round's density from the current request and carry an explicit form instruction until countermanded. Change the form directly. Elements fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
