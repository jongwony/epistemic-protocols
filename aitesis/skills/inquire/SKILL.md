---
name: inquire
description: "A task rests on missing context or unchecked assumptions: collect every piece of context the AI can reach on its own, then hand back what it cannot reach as the user's own unknown."
---

# Aitesis Protocol

Collect every piece of context the AI can reach on its own, then hand back what it cannot reach as the user's own unknown. Type: `(ContextInsufficient, AI, INQUIRE, Prospect) → SufficientContext`.

## Definition

**Aitesis** (αἴτησις): A dialogical act of collecting context to the limit of the AI's own reach before the person is asked for anything. The AI infers what the prospect leaves uncertain, pushes each uncertainty through every source it can read or run on its own until none is left, and writes down for each what that reached — a fact that settles it, a finding whose ground it declares short, or nothing — with the sources it tried and those it could not reach named, beside any finding that answers no uncertainty raised. Once everything reachable is reached, what remains open is handed back as the person's own unknown, shown so they can recognize it: where collected material conflicts, the AI names what conflicts with what; where a decision blocks further collection, it names which collection waits on it. Which open uncertainty is the person's is the AI's reading, shown for their recognition and correction; a decision the work rests on stays open until the person's own turn gives it, and the AI never makes it. The beneficiary is the person's epistemic state; the AI's collection is the instrument, and what it spares the person is recalling everything the work rests on. Only a cited source or the person's own words moves a value into the record. The run completes when collection ends: what is still open does not block completion and is not settled by it, and work that rests on an open item waits for the person's words. The run keeps reading later utterances — one that bears on it opens collection again and a new completion — and silence leaves the last completion standing. Stopping in the middle of a collection is the harness's interrupt, not an outcome of this contract. Completion establishes the collected context the work ahead reads, with what is still open named — not the factual correctness of its parts, and not the readiness of work that rests on what is open.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract.
-/

/-! ── FLOW ──
Aitesis(X) → start(c) → inquire(c, utterances), where c is the fused session context:
  collect(c): every source you can read or run on your own, to the limit of your reach, for every
    live uncertainty and every one collection exposes; what it returns joins the context
  after every collection: SufficientContext — the relay hands back what is open, naming what
    conflicts with what and which collection waits on which decision, and the turn is not held;
    what is open does not block completion
  next utterance u: c' := fuse(c, u), read whole against the prospect and c' →
    [the utterance does not bear on this run]  the session answers it; no collection of this
                                               run; the last completion stands
    [otherwise]                                → collect(c') → after every collection …
  no utterance: the last completion stands — silence settles nothing, what is open stays open,
    and work that rests on an open item waits for the person's words
  after completion: the next move the person declared — the prospect's own work, as far as it
    rests on nothing open —, an adopted policy, or a grant
  mid-collection stop: the harness's interrupt — a delegation point, not an outcome
-/

/-! ── MORPHISM ──
Prospect
  → scan(prospect, context)      -- the live inventory: what the prospect rests on that the context leaves uncertain; open dimensions, no fixed taxonomy (focus)
  → collect(uncertainties)       -- every source the AI can read or run on its own, to the limit of its reach; what it returns joins the context before anything is recorded
  → read(uncertainty)            -- how each stands: settled with a citation, ground short with its candidate, or unreached; the sources tried and those not reached, by name
  → relay(open)                  -- hand what is open back as the person's own unknown, each with its reach — naming what conflicts with what and which collection waits on which decision — and each settled value with its provenance; proceed
  → fuse(answer)                 -- an answer, when it comes, joins the context whole; if it bears on the run, collection runs again
  → SufficientContext
requires: insufficient(X)        -- declared by invoking /inquire, never judged; judged only on the AI-guided path, where not starting leaves no outcome
deficit:  ContextInsufficient    -- activation precondition (Layer 1/2)
preserves: task_identity(X)      -- the prospect is never rewritten; the context only grows, provided the session is not cleared, compacted, or rewound between invocation and convergence — a harness event this contract does not govern, named here as its delegation point
invariant: Evidence over Inference over Detection
invariant: Focus never records   -- the inventory, the relay, and whether an utterance bears on the run are re-read every turn; only a cited source or the person's turn moves a value into the record
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
    purposeful action requiring context. It is a turn of the context and is never rewritten. -/
abbrev Prospect (P : Type) := Context P

/-- The deficit: the work ahead rests on ground not yet checked — a reading presupposed, a missing
    value filled in, a search stopped early. Invoking `/inquire` is the person's declaration of it,
    and you do not judge it away. **Your judgment** on the AI-guided path only, as the entry
    judgment: finding none means not starting, which leaves no outcome of this protocol. -/
axiom insufficient : Context P → Prop

/-- An uncertainty, a value, or a finding, named as the presentation shows it. -/
abbrev Entry := String

/-- **Your judgment**, the inventory: every uncertainty the prospect rests on that this run has
    raised — a missing fact, a contradiction between the utterance and what was collected, a
    relevance gap; no fixed taxonomy — read over the whole fused context, what collection
    returned included. An uncertainty collection exposes joins in the collection that exposed it;
    one the person dismissed stays here, and `live` sets it apart. Whether a reworded uncertainty
    is the same one is your judgment. Guidance for the reading, not steps it must take: decisions
    already made about the prospect are part of what it rests on; show first what an answer would
    change most. -/
axiom uncertainties : Context P → List Entry

/-- **Your collection** from `c`, to the limit of your own reach: every live uncertainty, and every
    one collection exposes, pushed through every source you can read or run without changing
    existing state, until none is left; where to look is yours to judge, and no list of sources
    bounds it. What the context already holds from a source is not fetched again unless an
    utterance or evidence says it changed. What you create only to look — a scratch copy, a temp
    file — you remove afterwards. What you say you read, you read whole. An observation that needs
    to change existing state, someone's permission, or another's authority is not reached on your
    own: name it, with the judgment or capability it needs, in the uncertainty's `reach`, and hand
    it off. Each return is an evidence turn; a run that observed nothing returns its null result.
    Direction: `references/judgments.md` §Collection. -/
axiom collect : Context P → List (Evidence P)

/-- Who first put a held value forward: you, as a candidate shown beside what was collected, or
    the person. -/
inductive Proposer | draft | person

/-- What the person's turn that made a held value stand did: gave it in its own words, or took a
    candidate put forward before. -/
inductive Standing | set | adopted

/-- What settles an uncertainty: a fact, whose source is the citation; or a value the person
    holds, with who first put it forward and how it came to stand. -/
inductive Settled
  | fact (value : Entry)
  | held (value : Entry) (proposer : Proposer) (standing : Standing)

def Settled.isHeld : Settled → Bool
  | .fact _    => false
  | .held .. => true

/-- **Your judgment**, the record rule: the cited turn settles uncertainty `x` as `s`, read against
    the context as it now stands. Evidence — what a source returned, what the person reports they
    observed, or a decision of the person's that another source relays, such as a recorded
    decision, a commit, or a peer's report — settles a fact: that the decision exists is a fact. A
    decision the work rests on that the person holds — a value, a preference, a scope — stays open
    with its reach until the person's own turn gives it; you never choose it, and evidence informs
    it without settling it. It stands only on that turn: in their own words (`set`), or by taking a
    candidate put forward before (`adopted`) — where you put it forward, only if it was visible as
    yours, with what decides it and your contrary grounds, before that turn. A question, a request to look, a deferral, or a bare mention settles nothing.
    A held value changes only by the person's later words: evidence against it is shown before any
    step that depends on it and cannot be undone, and the value stands. A fact is read again
    against the evidence as it now stands; where it changes, the convergence trace shows the
    correction, citing both turns. -/
axiom Settles : Entry → Context P → Turn P → Settled → Prop

def settleCoord (x : Entry) : Coord P Settled :=
  { admits := fun _ => True, supports := Settles x }

/-- **Your reading**: how uncertainty `x` stands in `c` — filled by the latest turn that settles
    it; open with a candidate citation where a cited evidence or person turn points toward a value
    but its ground is short; open with none where nothing was reached. Your own inference is never
    a citation: it stays in your turns and in the presentation, marked as yours. -/
axiom operative : (c : Context P) → (x : Entry) → Occ (settleCoord (P := P) x) c

def isFilled {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Bool
  | .open_ _   => false
  | .filled .. => true

/-- An occurrence stands when it is filled and, for a held value, cites a person's turn; a held
    value on any other citation stands nowhere, and the uncertainty stays open. -/
def stands {c : Context P} {x : Entry} : Occ (settleCoord (P := P) x) c → Bool
  | .open_ _          => false
  | .filled s src _ _ => !s.isHeld || decide (src.src.val = .person)

/-- **Your record** of what collection reached for `x`, read from the context as it now stands:
    the sources tried and those not reached, by name — so the person can point at one you missed
    —, with what each unreached one needs; what was found and where its ground falls short; and
    what an answer would change. Where collected material conflicts, what conflicts with what,
    each quoted with its source; where a decision blocks further collection, which collection
    waits on it. Whether the uncertainty is the person's to settle is your reading, shown for their
    recognition and correction. What the person said they know or do not know is carried as said;
    while their words say nothing of it, whether they know is not established. -/
axiom reach : Context P → Entry → String

/-- **Your record**: findings collection turned up that answer no uncertainty raised, each with its
    source. They sit outside the inventory; they are shown, not handed back. -/
axiom detections : Context P → List String

/-- **Your judgment**: the cited turn dismisses uncertainty `x` — the person sets it aside, in
    whatever words, with whatever reason they give and none demanded — read against the context
    as it now stands. Whether an earlier dismissal still reaches `x` once new evidence bears on it
    is read on the current context: a dismissed uncertainty may be raised again on new evidence. -/
axiom DismissalSupported : Entry → Context P → Turn P → Unit → Prop

/-- Only the person dismisses. -/
def dismissalCoord (x : Entry) : Coord P Unit :=
  { admits := (·.val = .person), supports := DismissalSupported x }

/-- **Your reading**: the person's dismissal of `x`; `open_` until one reaches it. -/
axiom dismissal : (c : Context P) → (x : Entry) → Occ (dismissalCoord (P := P) x) c

/-- The uncertainties still in play: raised, and not dismissed. -/
def live (c : Context P) : List Entry :=
  (uncertainties c).filter (fun x => !isFilled (dismissal c x))

/-- One recorded value: the uncertainty, what settled it, and the turn it stands on, with that
    turn's support; a held value's turn is the person's. -/
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

/-- The record: every occurrence that stands over the live inventory. An open one adds nothing. -/
def record (c : Context P) : List (Recorded c) :=
  (live c).flatMap (fun x => recordOf x (operative c x))

/-- An uncertainty still open, with what collection reached for it. -/
structure Open where
  item  : Entry
  reach : String

/-- What is still open: every live uncertainty whose occurrence does not stand, each with its
    reach. Completion does not settle any of it. -/
def residual (c : Context P) : List Open :=
  ((live c).filter (fun x => !stands (operative c x))).map (fun x => ⟨x, reach c x⟩)

/-- One dismissal: the uncertainty, the person's turn that dismissed it, and how the uncertainty
    stood and what collection had reached for it as of that turn. -/
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

/-- Every dismissal over the inventory, with how each dismissed uncertainty stood at the time. -/
def dismissed (c : Context P) : List (Dismissed c) :=
  (uncertainties c).flatMap (fun x => dismissedOf x (dismissal c x))

/-- **Your judgment**: the latest utterance, read whole against the prospect and the fused context,
    bears on this run — an answer, a correction, a source to read, a dismissal, or anything that
    exposes a new uncertainty, changes the evidence, or revises who may settle what,
    even where it looks like other work. An utterance that bears on none of it leaves the run as it
    stands: the session answers it, that answer stays in the context, no collection of this run
    opens, and the last completion stands. -/
axiom Reaches : Context P → Prop

/-- **Your record**: the contrary grounds you presented with the relay — a value you doubt, a
    premise that may not hold, a source that disagrees — attached to the completion; empty when
    there were none. -/
axiom dissent : Context P → List String

/-- The record a completion carries: the context, what settled each uncertainty and on which
    turn, what is still open with its reach, what the person dismissed, the detections, and the
    dissent attached to the completion. -/
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

/-- `SufficientContext`: the collected context the work ahead reads — the facts settled with
    their sources, what is still open with its reach, shown with the person's recognition not yet
    established, the detections, and the dissent. What is open is not settled by it; work that
    rests on an open item waits. -/
structure SufficientContext (P : Type) where
  closure : Closed P

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

/-! ── PHASE TRANSITIONS ──
A step is one arm of a structural recursion over the person's utterances, carrying the context as
it stands and the last completion. `collected c` is the context once what collection from `c`
returned has joined it. `respond` is the relay, as TOOL GROUNDING's `surface` entry names it;
`session` is the session's own answer to an utterance about other work, which stays in the
context without opening collection.
-/

def collected (c : Context P) : Context P := c ++ (collect c).map (·.val)

/-- One collection and its completion, with the relay presented — what is open does not block
    it. -/
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

/-- The run opens on a collection. -/
def start (respond session : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : SufficientContext P :=
  let r := collectAndSettle respond c
  inquire respond session r.closure.context r us

/-! ── LOOP ──
Every utterance is read whole against the context as it now stands: nothing counts passes, and no
earlier reading is held apart from what later turns say. Silence takes nothing: the last
completion stands, an open uncertainty stays open, and only work that rests on none of them
proceeds. Stopping in the middle of a collection is the harness's interrupt. No fixed cap: each
relay is dialogue.
-/

/-! ── CONVERGENCE ──
completed: collection has reached everything it can. What is open does not block completion
and is not settled by it. A finding alone establishes nothing
about what is open. Convergence evidence, at each completion: for every uncertainty raised, one
pair (ContextInsufficient(u) → how it stands) — a settled one with its citation and, for a held
value, who proposed it and how it stood; a corrected fact citing both the earlier and the later
turn; an open one with its reach — naming what conflicts with what and which collection waits
on which decision — marked as shown to the person with their recognition not yet established
unless a later turn of theirs showed it; a dismissed one with the
person's words and how it stood then — beside the detections and the dissent attached to the
closure. Demonstrated, not asserted.
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

inductive Op | scan | collect | read | surface | readAnswer | converge | seam

/-- No Constitution entry: whether a turn halts is the harness's baseline. -/
def grounding : Op → Annot × String
  | .scan       => (.sense, "Internal analysis: the inventory — what the prospect rests on that the fused context leaves uncertain, what collection returned included; no fixed taxonomy")
  | .collect    => (.observe, "artifact read, artifact search, record read, external fetch, environment run: every read and run you can make on your own without changing existing state, to the limit of your reach, removing afterwards what you created only to look; what the context already holds from a source is not fetched again unless an utterance or evidence says it changed; what each returns enters the context as an evidence turn; an observation that needs to change existing state, a permission, or another's authority is named with what it needs and handed off, never run as collection")
  | .read       => (.sense, "Internal analysis: how each uncertainty stands — settled with its citation, ground short with its candidate, or unreached — and its reach, read on the context as it now stands")
  | .surface    => (.interaction .extension, "once everything reachable is reached, every open uncertainty handed back as the person's own unknown with its reach — the sources tried and those not reached, by name, with what each needs; what was found and where it falls short; where collected material conflicts, what conflicts with what; where a decision blocks further collection, which collection waits on it; what an answer would change; which of them is the person's to settle, as your reading for their correction — never a decision you made for them; each settled one with its provenance — the evidence and where it was read, or the person's words, with your earlier candidate marked as yours; the detections, each with its source; your contrary grounds; the turn is not held")
  | .readAnswer => (.sense, "Internal analysis: the latest utterance read whole against the prospect and the fused context as it now stands — whether it bears on this run, and what it does there: settles, corrects, points to a source, says the person does not know either, dismisses, or exposes a new uncertainty")
  | .converge   => (.interaction .extension, "the convergence evidence CONVERGENCE names; proceed with SufficientContext")
  | .seam       => (.interaction .extension, "after completion, proceed to the next move the person declared — the prospect's own work, as far as it rests on nothing open —, an adopted policy, or a grant, citing that source; work that rests on an open item waits for the person's words; this protocol declares no wired outbound edge, and every Constitution gate fires unchanged")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Dimension resolution emergent via session context.
-/

end

end Aitesis
```

## Mode Activation

`/inquire` remains directly invocable: the invocation declares the deficit the Definition's `insufficient` names, and collection starts at once. During AI-guided activation, loaded safety boundaries, capability restrictions, and explicit user instructions continue to bind. Skip AI-guided activation when the user explicitly asks to proceed without context verification or when no prospect exists to verify.

### Prior decisions

When a prospect touches architecture decisions, API or protocol design, persisted state schemas, or user-facing behavior commitments, the decisions already made about it are part of what it rests on: look for them with everything else, cite each as the fact that it was made, and let current evidence govern how each uncertainty stands.

## Protocol

### User-facing realization

Present what TOOL GROUNDING's `surface` entry names in everyday language and proceed. Where collected material conflicts, name what conflicts with what; where a decision blocks further collection, name which collection waits on it; say which open items read as the user's to settle, as a reading they can correct, and which items the AI found without full warrant; name each source it could not reach, with what it needs, so the user can point at one it missed; name a detection as one, on its own line. State what the protocol takes if an answer comes — a fact, a correction, a place to look, "I don't know either", a dismissal — without holding the turn for it and without a fixed menu. Keep every item open to free-response correction.

Frame the uncertainty currently in play rather than emitting a completion tally. Read `references/round-composition.md` before composing when terminology must remain stable across the session, wording must be carried unchanged, material belongs to another round or trace, or phase order determines whether text belongs before or inside a relay.

### Intensity

| Level | When | Format |
|-------|------|--------|
| Light | A few open uncertainties, little riding on them | Brief relay: each with its reach in one line |
| Medium | Several open uncertainties, or collection that settled some and fell short on others | Structured relay framing each beside its evidence and what an answer would change |
| Heavy | Much of the work ahead rests on what is open | Detailed evidence, the sources tried and not reached, findings with their shortfalls, conflicts and blocking decisions named, and the user's unknowns named as such |

## Rules

- **Recognition over Recall**: Present each open uncertainty with its reach and each settled one with its provenance, so the reader recognizes what the work rests on rather than reconstructing it.
- **Round composition**: Compose each round so the reader can act on it without reassembling it — use everyday language, keep the judgment beside its nearest evidence and next-move implication, and place analytical context before the relay.
- **Option-set relay test**: Handing back is a relay: it presents and proceeds. The user's answer, when it comes, is read whole; it is not a gate this protocol holds, and silence settles and dismisses nothing.
- **Focus and record**: As the Definition's MORPHISM invariant, `Settles`, and `record` state.
- **What is shown**: Where collected material conflicts, name what conflicts with what; where a decision blocks further collection, name which collection waits on it. Which open uncertainty is the user's is the AI's reading, shown for their recognition and correction; the AI never chooses a decision the user holds.
- **Collection yields evidence or nothing, never a disposition**: An observation that resolved nothing attaches its null result and collection moves on. Only the user's words settle what is theirs or dismiss an uncertainty.
- **Completion**: Completion is the end of collection. It settles nothing open, and work that rests on an open item waits for the user's words; the AI's own reading of what is open completes nothing and settles nothing.
- **Boundary named, not crossed**: For every open uncertainty, say what was tried, what was not reached and what it needs, what was found, and where it falls short; leave its disposition to the user.
- **Form feedback**: Derive each round's density from the current request; carry an explicit form instruction forward until countermanded. Change the form directly. Content, wording, order, cadence, and turn boundaries fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
