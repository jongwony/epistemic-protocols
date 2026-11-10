---
name: inquire
description: "Use before gathering context — opening a link or issue, reading records, threads, documents, files or state to establish what is the case, a status check or a claim the user makes in passing included — even where the agent could gather it itself; not for a command whose targets are named or already in context and that claims nothing beyond them. The user can then recognize what was settled and from where, what rests on weak or unreached ground, and what only they decide."
---

# Aitesis Protocol

Collect every piece of context the AI can reach on its own, then hand back what it cannot reach as the user's own unknown. Type: `(ContextInsufficient, AI, INQUIRE, Prospect) → SufficientContext`.

## Definition

**Aitesis** (αἴτησις): A dialogical act of collecting context to the limit of the AI's own reach before the person is asked for anything. The AI infers what the prospect leaves uncertain, pushes each uncertainty through every source it can read or run on its own, and writes down for each what that reached — a fact that settles it, a finding on ground it declares short, or nothing. What remains open is handed back as the person's own unknown, shown so they can recognize it. The beneficiary is the person's epistemic state: collection spares them recalling everything the work rests on. Completion establishes the collected context the work ahead reads — not the factual correctness of its parts, nor the readiness of work resting on what is open.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract.
-/

/-! ── FLOW ──
Aitesis(X) → start(c) → inquire(c, utterances), c the fused session context. Every collection ends
in a completion whose relay proceeds; an utterance that bears on the run reopens collection. A
mid-collection stop is the harness's interrupt — a delegation point.
-/

/-! ── MORPHISM ──
Prospect
  → scan(prospect, context)  -- live inventory of what the context leaves uncertain (focus)
  → collect(uncertainties)   -- every source within the AI's own reach; returns join the context first
  → read(uncertainty)        -- settled with a citation, ground short with its candidate, or unreached
  → relay(open)              -- what is open handed back as the person's own unknown, each with its reach; proceed
  → fuse(answer)             -- an answer joins the context whole
  → SufficientContext
requires:  insufficient(X)       -- declared by invoking /inquire
deficit:   ContextInsufficient   -- activation precondition
preserves: task_identity(X)      -- the prospect is never rewritten; the context only grows (session clear, compact, or rewind is the harness's)
invariant: Evidence over Inference over Detection
invariant: Focus never records   -- inventory, relay, and bearing are re-read every turn; only a cited source or the person's turn moves a value into the record
-/

namespace Aitesis

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

/-- `X`: the prospect for action — planning, task execution, analysis, investigation, or any
purposeful action requiring context — read as the context it lands in. -/
abbrev Prospect (P : Type) := Context P

/-- The deficit: the work ahead rests on ground not yet checked — a reading presupposed, a missing
value filled in, a search stopped early. Invoking `/inquire` declares it. **Your judgment** only on
the AI-guided path: finding none means not starting, which leaves no outcome of this protocol. -/
axiom insufficient : Context P → Prop

abbrev Entry := String

/-- **Your judgment**, the inventory: every uncertainty the prospect rests on that this run has
raised — a missing fact, a contradiction between the utterance and what was collected, a relevance
gap; no fixed taxonomy — read over the whole fused context. An uncertainty collection exposes joins
in the collection that exposed it; one the person dismissed stays here, and `live` sets it apart.
Whether a reworded uncertainty is the same one is your judgment. Guidance for the reading, not a
step it must take: show first what an answer would change most. -/
axiom uncertainties : Context P → List Entry

/-- **Your collection**, to the limit of your own reach: every live uncertainty, and every one
collection exposes, pushed through every source you can read or run without changing existing state,
until none is left; where to look is yours to judge, and no list of sources bounds it. What the
context holds from a source is not fetched again unless an utterance or evidence says it changed.
What you say you read, you read whole. An observation that needs to change existing state, someone's
permission, or another's authority is beyond your reach: name it, with what it needs, in `reach`,
and hand it off. Each return is an evidence turn; a run that observed nothing returns its null
result. Direction: `references/judgments.md` §Collection. -/
axiom collect : Context P → List (Evidence P)

inductive Proposer | draft | person

inductive Standing | set | adopted

/-- What settles an uncertainty: a fact, sourced by the citation; or a value the person holds, with
who first put it forward (`draft` is your visible candidate) and how it came to stand. -/
inductive Settled
  | fact (value : Entry)
  | held (value : Entry) (proposer : Proposer) (standing : Standing)

def Settled.isHeld : Settled → Bool
  | .fact _    => false
  | .held .. => true

/-- **Your judgment**, the record rule: the cited turn settles `x` as `s` on the context as it now
stands. Evidence — what a source returned, what the person reports they observed, or a decision of
theirs that another source relays — settles a fact: that the decision exists is a fact. A decision
the work rests on that the person holds — a value, a preference, a scope — stays open until their
own turn gives it: in their own words (`set`), or by taking a candidate (`adopted`) — yours only if
it was visible as yours, with what decides it and your contrary grounds, before that turn. Evidence
informs it without settling it. A question, a request to look, a deferral, or a bare mention settles
nothing. A held value changes only by the person's later words; evidence against it is shown. A fact
is re-read against current evidence; a correction is shown in the convergence trace, citing both
turns. -/
axiom Settles : Entry → Context P → Turn P → Settled → Prop

def settleCoord (x : Entry) : Coord P Settled :=
  { admits := fun _ => True, supports := Settles x }

/-- **Your reading**: how `x` stands in `c` — filled by the latest turn that settles it; open with a
candidate citation where a cited evidence or person turn points toward a value but its ground is
short; open with none where nothing was reached. Your own inference is never a citation: it stays
marked as yours. -/
axiom operative : (c : Context P) → (x : Entry) → Occ (settleCoord (P := P) x) c

def isFilled {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Bool
  | .open_ _   => false
  | .filled .. => true

def stands {c : Context P} {x : Entry} : Occ (settleCoord (P := P) x) c → Bool
  | .open_ _          => false
  | .filled s src _ _ => !s.isHeld || decide (src.src.val = .person)

/-- **Your record** of what collection reached for `x`: the sources tried and those not reached, by
name, with what each unreached one needs; what was found and where its ground falls short; what an
answer would change; where collected material conflicts, what conflicts with what, each quoted with
its source; where a decision blocks collection, which collection waits on it. Whether `x` is the
person's to settle is your reading, shown for their correction. What they said they know or do not
know is carried as said; beyond that, whether they know is not established. -/
axiom reach : Context P → Entry → String

/-- **Your record**: findings collection turned up that answer no uncertainty raised, each with its
source. They are shown, not handed back. -/
axiom detections : Context P → List String

/-- **Your judgment**: the cited turn dismisses `x` — in whatever words, no reason demanded. Whether
an earlier dismissal still holds once new evidence bears on `x` is read on the current context. -/
axiom DismissalSupported : Entry → Context P → Turn P → Unit → Prop

/-- Only the person dismisses. -/
def dismissalCoord (x : Entry) : Coord P Unit :=
  { admits := (·.val = .person), supports := DismissalSupported x }

/-- **Your reading**: the person's dismissal of `x`; `open_` until one reaches it. -/
axiom dismissal : (c : Context P) → (x : Entry) → Occ (dismissalCoord (P := P) x) c

def live (c : Context P) : List Entry :=
  (uncertainties c).filter (fun x => !isFilled (dismissal c x))

structure Recorded (c : Context P) where
  item         : Entry
  settled      : Settled
  src          : Cite c
  supported    : Settles item c (c[src.idx]'src.lt) settled
  heldByPerson : settled.isHeld = true → src.src.val = .person

def recordOf {c : Context P} (x : Entry) : Occ (settleCoord (P := P) x) c → List (Recorded c)
  | .open_ _                  => []
  | .filled s src _ supported =>
    if h : s.isHeld = true → src.src.val = .person then [⟨x, s, src, supported, h⟩] else []

def record (c : Context P) : List (Recorded c) :=
  (live c).flatMap (fun x => recordOf x (operative c x))

structure Open where
  item  : Entry
  reach : String

def residual (c : Context P) : List Open :=
  ((live c).filter (fun x => !stands (operative c x))).map (fun x => ⟨x, reach c x⟩)

structure Dismissed (c : Context P) where
  item     : Entry
  src      : Cite c
  byPerson : src.src.val = .person
  stood    : Occ (settleCoord (P := P) item) (c.take (src.idx + 1))
  reached  : String

def dismissedOf {c : Context P} (x : Entry) : Occ (dismissalCoord (P := P) x) c → List (Dismissed c)
  | .open_ _                 => []
  | .filled _ src allowed _  =>
    [⟨x, src, allowed, operative (c.take (src.idx + 1)) x, reach (c.take (src.idx + 1)) x⟩]

def dismissed (c : Context P) : List (Dismissed c) :=
  (uncertainties c).flatMap (fun x => dismissedOf x (dismissal c x))

/-- **Your judgment**: the latest utterance, read whole against the prospect and the fused context,
bears on this run — an answer, a correction, a source to read, a dismissal, or anything that exposes
a new uncertainty, changes the evidence, or revises who may settle what, even where it looks like
other work. An utterance that bears on none of it leaves the run as it stands: the session answers
it, that answer stays in the context, no collection of this run opens, and the last completion
stands. -/
axiom Reaches : Context P → Prop

/-- **Your record**: the contrary grounds presented with the relay — a value you doubt, a premise
that may not hold, a source that disagrees; empty when there were none. -/
axiom dissent : Context P → List String

structure Closed (P : Type) where
  context    : Context P
  record     : List (Recorded context)
  residual   : List Open
  dismissed  : List (Dismissed context)
  detections : List String
  dissent    : List String

def closed (c : Context P) : Closed P :=
  { context := c, record := record c, residual := residual c, dismissed := dismissed c,
    detections := detections c, dissent := dissent c }

/-- Once it has run, the person can recognize, for each thing the work ahead rests on, what was
settled and from which source, what the AI found only on ground it declares short or could not
reach, what it put forward as its own candidate, and what is theirs alone to decide — and can answer
their share or correct that reading. -/
structure SufficientContext (P : Type) where
  closure : Closed P

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

/-! ── PHASE TRANSITIONS ──
`respond` is the relay (`surface`); `session` is the session's own answer to an utterance about
other work.
-/

def collected (c : Context P) : Context P := c ++ (collect c).map (·.val)

def collectAndSettle (respond : Context P → Response P) (c : Context P) : SufficientContext P :=
  ⟨closed (collected c ++ [(respond (collected c)).val])⟩

open Classical in
def inquire (respond session : Context P → Response P) :
    Context P → SufficientContext P → List (Utterance P) → SufficientContext P
  | _, r, []      => r
  | c, r, u :: us =>
    let c' := fuse c u
    if ¬ Reaches c' then inquire respond session (c' ++ [(session c').val]) r us
    else
      let r' := collectAndSettle respond c'
      inquire respond session r'.closure.context r' us

def start (respond session : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : SufficientContext P :=
  let r := collectAndSettle respond c
  inquire respond session r.closure.context r us

/-! ── CONVERGENCE ──
completed: collection has reached everything it can. What is open neither blocks completion nor is
settled by it. A finding alone establishes nothing about what is open. Evidence demonstrated at each
completion: for every uncertainty raised, how it stands — settled, with its citation and, for a held
value, who proposed it and how it stood; a corrected fact, citing both turns; open, with its reach,
marked as shown, the person's recognition not yet established unless a later turn of theirs showed
it; dismissed, with the person's words and how it stood then — beside the detections and the
dissent.
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

inductive Op | scan | collect | read | surface | readAnswer | converge | seam

def grounding : Op → Annot × String
  | .scan       => (.sense, "Internal analysis: the inventory, as `uncertainties` states")
  | .collect    => (.observe, "record read, artifact read, artifact search, external fetch, environment run: collection as `collect` states")
  | .read       => (.sense, "Internal analysis: how each uncertainty stands and its reach, as `operative` and `reach` state")
  | .surface    => (.interaction .extension, "once everything reachable is reached: every open uncertainty handed back as the person's own unknown with its `reach`, marking which is theirs to settle as your reading; each settled one with its provenance — the evidence and where it was read, or the person's words, your earlier candidate marked as yours; the detections with sources; your contrary grounds")
  | .readAnswer => (.sense, "Internal analysis: whether the latest utterance bears on this run, and what it does there: settles, corrects, points to a source, says the person does not know either, dismisses, or exposes a new uncertainty")
  | .converge   => (.interaction .extension, "the convergence evidence CONVERGENCE names; proceed with SufficientContext")
  | .seam       => (.interaction .extension, "after completion, proceed to the next move the person declared, citing that turn")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
-/

end

end Aitesis
```

## Mode Activation

`/inquire` remains directly invocable: the invocation declares the deficit the Definition's `insufficient` names, and collection starts at once. Skip AI-guided activation when the user explicitly asks to proceed without context verification or when no prospect exists to verify.

### Prior decisions

When a prospect touches architecture decisions, API or protocol design, persisted state schemas, or user-facing behavior commitments, the decisions already made about it are part of what it rests on: look for them with everything else, cite each as the fact that it was made, and let current evidence govern how each uncertainty stands.

## Protocol

### User-facing realization

Present what `surface` names and proceed; name a detection as one, on its own line. State what the protocol takes if an answer comes — a fact, a correction, a place to look, "I don't know either", a dismissal — without a fixed menu. Every item stays open to free-response correction.

Frame each round around the uncertainty currently in play. Read `references/round-composition.md` before composing when terminology must remain stable across the session, wording must be carried unchanged, material belongs to another round or trace, or phase order determines whether text belongs before or inside a relay.

## Rules

- **Round composition**: Compose each round so the reader can act on it without reassembling it — state who does what, in words the reader already uses or meets often, composed from the meaning in the language they are using; keep the judgment beside its nearest evidence and next-move implication; and place analytical context before the relay.
- **Option-set relay test**: Handing back is a relay: it presents and proceeds. The user's answer, when it comes, is read whole; silence settles and dismisses nothing.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction forward until countermanded. Change the form directly. Elements fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
