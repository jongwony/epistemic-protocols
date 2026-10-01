---
name: contextualize
description: "A result may not fit where it lands: check every place it reaches and every intent it was meant to carry, show every misfit and omission on one sheet, and carry out the fixes the user settles."
---

# Epharmoge Protocol

Check a result against every place it lands and every intent it was meant to carry, show every place it does not fit on one sheet, and carry out the fixes the person settles. Type: `(ApplicationDecontextualized, AI, CONTEXTUALIZE, Result) → ContextualizedExecution`.

## Definition

**Epharmoge** (ἐφαρμογή): A dialogical act of checking that a result fits the situation it is applied in — from Aristotle's notion of practical application — resolving the gap between technical correctness and contextual appropriateness. The result is any work product: this session's output, an analysis, a decision, a document, or an artifact another session or person produced. Two things run side by side. The person holds one coordinate per place the result does not fit: fix it this way, leave it for this reason, stop using it, or it is not this result's to fix — given in their own words, by taking a proposed action, or by entrusting the choice; only that coordinate waits on them. Orthogonal to it, the AI relays: it follows the result to every place it lands — what reads it, its copies and neighbours, the people who read it, the environment it runs in — and to every intent in the accumulated context it was meant to carry, observing without changing existing state; it carries out every settled resolution inside what this run may write, and evidence that fixes a resolution alone settles it as the AI's, shown with that evidence; then it reads again. Every place the result does not fit, an intent it was meant to carry and does not included, goes on one sheet with its concrete consequence in the person's own situation, beside what was checked and fits and what was not reached, and the person answers the sheet in one turn. The run completes when a pass leaves nothing open, with no closing turn asked of the person; a later utterance that bears on the run opens it again. Completion establishes fit for what was found within what was reached — not the correctness of the result, and nothing about places the check could not reach.

```lean
/-!
How to read this block. It is core Lean 4 and elaborates as written, and you are the model it is
written for: you read it, and by inference over the context you settle each element it leaves
open. Every `axiom` is one of those judgments — a black box to the contract, yours to make from
the material in front of you; its doc comment says what you judge there, and nothing in this
block decides it for you. Every `def`, `inductive`, and `structure` is fixed by the contract.
-/

/-! ── FLOW ──
Epharmoge(X) → start(c) → contextualize(c, utterances), where c is the fused session context and
X, the result under review, is whatever the invocation names — this session's output or an
artifact from elsewhere:
  pass(c): the relay (PHASE TRANSITIONS) — observe, carry out what is settled, observe again
  [nothing open]   completed — the closing sheet
  [otherwise]      present the sheet, then one gate over every open mismatch → Stop
  next utterance u: c' := fuse(c, u), read whole →
    [u does not bear on this run]   the session answers it; the run stands as it was
    [otherwise]                     pass(c') → the same reading
  no utterance: the last outcome stands; nothing is judged and nothing closes
  after completion: a later utterance that bears on the run opens a pass again; the next move the
    person declared runs only after completion
-/

/-! ── MORPHISM ──
(X, context)
  → observe(reach)             -- every place X lands and every intent it answers to, without changing existing state; what could not be reached, named
  → judge(result, context)     -- where X as it now stands does not fit the context as it now stands; afresh on every pass
  → perform(settled)           -- every settled resolution inside what this run may write; what the writes returned enters the context; observe again
  → surface(sheet, changes)    -- every mismatch at once, with concrete actions, what fits, what was not reached, and what changed
  → resolve(person's turn)     -- adapt, keep with their reason, stop using, not this result's — their words, a proposal they took, a grant of theirs
  → ContextualizedExecution
requires: mismatch_detected(X)   -- the AI-opened path only (Layer 2); an invocation declares the deficit and enters without it
deficit:  ApplicationDecontextualized
preserves: every turn of the context -- the context only grows (pass_extends); a write changes only what this run may write (perform)
invariant: Applicability over Correctness
invariant: the person holds each resolution; evidence settles only what it fixes alone and what nothing the person said contests
invariant: transformative revalidation (NON-MONOTONE) -- a write changes what the next observation reads, so a run can have more open after a resolution than before it
invariant: Focus never records -- the sheet, its order, and whether an utterance bears on the run are re-read every turn; only the person's turn, a grant of theirs, or evidence that fixes it moves a resolution onto the record
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

/-- `X`, the result under review: any work product — this session's output, an analysis, a
    decision, a document, or an artifact another session or person produced. The morphism treats
    every kind alike. -/
abbrev Result := String

/-- **Your reading**: X as the context now shows it, every write that has landed applied — each
    write returns its result into the context; `none` once a removal has landed with nothing in
    its place. Correctness is presupposed at entry and never re-checked here. -/
axiom target : Context P → Option Result

/-- **Your observation** of the reach, to the limit of what you can read or run without changing
    existing state: every place X lands — what reads or consumes it, its copies and neighbours,
    the people who will read it, the environment it runs in — and every intent in the context it
    was meant to carry. Where to look is yours to judge, and no list of places bounds it. What you
    say you read, you read whole; what the context already holds is read again where a write, an
    utterance, or evidence says it moved; what you create only to look — a scratch copy, a temp
    file — you remove afterwards. A place that needs a change to existing state, someone's
    permission, or another's authority is not reached on your own: it goes into `reach` with what
    it needs. Each return is an evidence turn. -/
axiom observe : Context P → List (Evidence P)

/-- One place X does not fit: what does not fit, in plain words; where in X, or where it lands;
    the turn of the context it does not fit, which is never the assistant's own (`Cite`), so the
    comparison stays non-circular. -/
structure Mismatch (c : Context P) where
  what     : String
  inResult : String
  against  : Cite c

/-- **Your judgment**, made afresh on every pass: where X as it now stands does not fit the context
    as it now stands. The context is the application context — the person's account of their
    situation and the intents they stated along the way, every earlier answer, the conventions
    and environment X meets, and what observation returned from every place X lands. An intent X
    was meant to carry and does not is a mismatch, an omission. One mismatch per claim is the
    direction; a claim standing on evidence in several places is one mismatch, since how far a
    repair reaches is the resolution's question. Something the person names as not fitting is
    judged here like anything else. -/
axiom mismatches : (c : Context P) → List (Mismatch c)

/-- What settles one mismatch, read the same way wherever it stands — by the person's turn or by
    evidence. There is no verdict beside it: whether the mismatch "really" stands is not asked,
    and nothing here asserts it either way. A resolution that asks for a write — `adapt`,
    `discard` — does not close its mismatch: before the write lands it is still to be carried
    out, and a mismatch still found after its write landed is unrepaired. A write that repairs it
    removes it from what is found, and the sheet says it was repaired. `keep` and `elsewhere` close
    it as they stand. -/
inductive Resolution
  /-- change X this way -/
  | adapt (direction : String)
  /-- leave X as it is here, with the reason given where one was given -/
  | keep (reason : Option String)
  /-- stop using X; `none` when nothing takes its place -/
  | discard (replacement : Option Result)
  /-- not this result's to fix: whose it is — a system, a team, a scope — as named; nothing is
      dispatched -/
  | elsewhere (owner : String)

/-- How a resolution the person's turn carries came to stand: in their own words; by taking an
    action you proposed; or by your choice inside a grant of theirs. -/
inductive How | set | adopted | granted

/-- **Your judgment**: the cited turn of the person resolves `m`, as it now stands, this way — read
    against the context that now stands, the order of its turns included; the `Resolution` reads
    as its constructor says. `set`: their own words. `adopted`: they took an action you proposed,
    and only where that action was visible as yours, with its consequence and your contrary
    grounds, before that turn. `granted`: the cited turn entrusts the choice to you, and only
    inside what it covers; the resolution is then your choice under it, recorded as yours. A
    question, a request to look, a deferral, or a bare mention settles nothing. Their answer is
    read whole: one turn may resolve several mismatches, or settle a class of them by a
    criterion; where it asks for dispositions of one result that conflict — a discard beside an
    adaptation of the same result — it resolves neither until the combined consequence has been
    shown. -/
axiom ResolutionSupported : {c : Context P} → Mismatch c → Context P → Turn P → Resolution × How → Prop

/-- A mismatch is resolved on the person's record only by the person's turn, whatever form that
    turn takes. -/
def resolutionCoord {c : Context P} (m : Mismatch c) : Coord P (Resolution × How) :=
  { admits := (·.val = .person), supports := ResolutionSupported m }

/-- **Your reading**: the person's resolution of `m`; `open_` until one reaches it. -/
axiom resolution : (c : Context P) → (m : Mismatch c) → Occ (resolutionCoord m) c

/-- What evidence alone settles about a mismatch. -/
inductive Settled
  /-- it fits after all: you withdraw your own flag, reported with that evidence -/
  | withdraw
  /-- the evidence fixes the whole resolution: relayed, recorded as yours with that ground -/
  | resolves (r : Resolution)

/-- **Your judgment**: the cited evidence — what a tool or the environment returned, a convention
    the context holds, a decision already recorded, a peer's report — read against X and the whole
    context as they now stand, admits this reading of `m` alone and fixes all of it: for
    `resolves`, the direction, its scope, and nothing left for the person to choose; the
    `Resolution` reads as its constructor says. Where it admits more than one reading, it settles
    nothing; where several sources fix it together, the sheet shows them together. A person's
    turn that disputes it leaves it unsettled: evidence settles only what nothing the person said
    contests. -/
axiom SettledSupported : {c : Context P} → Mismatch c → Context P → Turn P → Settled → Prop

/-- Evidence stands on what was observed or recorded, never on the person's say-so, which is a
    resolution. -/
def evidenceCoord {c : Context P} (m : Mismatch c) : Coord P Settled :=
  { admits := (·.val ≠ .person), supports := SettledSupported m }

/-- **Your reading**: what evidence alone settled for `m`, with the evidence cited; `open_` where
    it settled nothing. -/
axiom byEvidence : (c : Context P) → (m : Mismatch c) → Occ (evidenceCoord m) c

def filledValue {A : Type} {q : Coord P A} {c : Context P} : Occ q c → Option A
  | .open_ _     => none
  | .filled a .. => some a

/-- How a mismatch stands. -/
inductive Standing
  /-- waits on the person -/
  | open_
  /-- the person's turn resolved it, and how that resolution came to stand -/
  | resolved (r : Resolution) (how : How)
  /-- evidence alone fixed its resolution: yours, with that evidence -/
  | relayed (r : Resolution)
  /-- evidence showed it fits; you withdrew your own flag -/
  | withdrawn

/-- The person's resolution first, whatever evidence read; otherwise what evidence alone settled;
    otherwise it waits on the person. -/
def standing (c : Context P) (m : Mismatch c) : Standing :=
  match filledValue (resolution c m) with
  | some (r, h) => .resolved r h
  | none =>
    match filledValue (byEvidence c m) with
    | some .withdraw     => .withdrawn
    | some (.resolves r) => .relayed r
    | none               => .open_

/-- One concrete action the sheet offers for a mismatch: what it does, as the resolution it would
    record, and what then happens. -/
structure Action where
  resolution  : Resolution
  consequence : String

/-- **Your judgment**: the actions to offer for `m`, each concrete to this mismatch — the change
    that would make it fit where one is evident, leaving it as it is and what then happens, not
    using X and what would take its place, and where it reads as another owner's, handing it
    there beside fixing it here. Never a category title; the person may answer in their own words
    instead. -/
axiom actions : (c : Context P) → Mismatch c → List Action

/-- **Your record** of the reach, read from the context as it now stands: where the judgment looked
    and what it found fits; each place it could not reach, and each write it did not carry out,
    with what it needs — a change to existing state or outside what this run may write, a
    permission, another's authority — named so the person can point at one you missed. -/
axiom reach : Context P → String

/-- **Your judgment**: the latest utterance, read whole against the context as it now stands,
    bears on this run — it resolves, corrects, disputes, grants, names something that does not
    fit, points at a place to look, asks about the sheet, or changes X or the evidence — even
    where it looks like other work. An utterance that bears on none of it leaves the run as it
    stands: the session answers it, that answer stays in the context, no pass runs, and the last
    outcome stands. An utterance asking for a step that rests on X while something is open bears
    on the run: the open places are shown before that step, and a step that cannot be undone
    waits on them. -/
axiom Reaches : Context P → Prop

/-- **Your record**: contrary grounds you showed before the person's resolutions — evidence that
    a mismatch does not fit beside a resolution that left it as it is, a doubt about a grant's
    reach, among them — attached to the closure; empty when there were none. -/
axiom dissent : Context P → List String

/-- `ContextualizedExecution`: the context at closure, what the person is left with (`none` when a
    removal left nothing), the reach, and the dissent attached to the closure. -/
structure ApplicabilityVerdict (P : Type) where
  context : Context P
  target  : Option Result
  reach   : String
  dissent : List String

inductive Outcome (P : Type)
  /-- a pass left nothing open -/
  | completed (v : ApplicabilityVerdict P)
  /-- the gate stands over the open mismatches -/
  | holding (c : Context P)

def Outcome.context : Outcome P → Context P
  | .completed v => v.context
  | .holding c   => c

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

abbrev Mode (P : Type) := Context P

/-! ── PHASE TRANSITIONS ──
A pass is the relay, silent and orthogonal to the person's coordinate: observe the reach, carry
out every settled resolution inside what this run may write, and observe again — in turn, each
return entering the context, until nothing newly settled is left; `pass` writes one round of it,
and every further round extends the context the same way. What was found, how each mismatch
stands, what fits, and what was not reached are then read from the context. `respond` presents
the sheet — the closing sheet on completion —, and `session` answers an utterance that does not
bear on this run.
-/

/-- **Your action** for a pass: the writes carrying out every adaptation or discard a resolution
    settles — the person's, one under their grant, one evidence relays — that the context does
    not yet show carried out, the person's whole answer read and its combined consequence weighed
    first; returning what the writes returned. What this run may write is X and the places it
    lands that the work in front of the person covers; anything else needs a permission or its
    owner. A write outside that, or one whose effect cannot be undone — a removal or overwrite
    with no way back, a deploy, a send outside — is not carried out, even where evidence fixes
    its direction: it goes into `reach` with what it needs, and its mismatch waits on the person.
    A discard with nothing in its place removes X; a replacement this run wrote is X from then
    on. -/
axiom perform : Context P → List (Evidence P)

def pass (c : Context P) : Context P :=
  let c₁ := c ++ (observe c).map (·.val)
  let c₂ := c₁ ++ (perform c₁).map (·.val)
  c₂ ++ (observe c₂).map (·.val)

/-- A standing that closes its mismatch: kept or another's, by the person or by evidence, or a
    flag evidence withdrew. A resolution that asks for a write closes nothing; its write, once it
    repairs the mismatch, takes the mismatch out of what is found. -/
def Closes : Standing → Prop
  | .resolved (.keep _) _      => True
  | .resolved (.elsewhere _) _ => True
  | .relayed (.keep _)         => True
  | .relayed (.elsewhere _)    => True
  | .withdrawn                 => True
  | _                          => False

def NothingOpen (c : Context P) : Prop := ∀ m ∈ mismatches c, Closes (standing c m)

def verdict (c : Context P) (t : Context P) : ApplicabilityVerdict P :=
  ⟨t, target c, reach c, dissent c⟩

open Classical in
/-- `respond` presents the round, read on the context the pass left. Overview first. Then every
    mismatch found, the ones that matter most first: what does not fit, where, the part of the
    context it does not fit (quoted with where it came from), how much it matters — significant
    only with a demonstrable behavioral consequence, structural extent alone minor — and how it
    stands: waiting on the person; the person's resolution with their turn quoted, the intent
    taken from it, and whether they said it, took a proposed action, or entrusted the choice; a
    relayed resolution with the evidence that fixed it; a withdrawn flag with that evidence; a
    resolution whose write was not carried out, with what it needs. For each open one, `actions`,
    each with its consequence and your contrary grounds where you have them — for one whose write
    was held back, what would unblock it: grant the permission, do it yourself, hand it to its
    owner, or leave it; mismatches that bear on each other grouped, with their combined
    consequence. Then `reach`: what fits and what was not reached. Then what changed since the last sheet: each line added, removed, or changed names
    what moved — a write, a new observation, a person's turn, or a reading of yours corrected on
    unchanged ground, said to be a correction; a line that left says why — repaired, gone with a
    removed result, withdrawn by evidence. Then the one question over every open mismatch, asked
    as a question. Re-present the whole sheet where it changed or the person asked for it; a
    question about the sheet is answered with the gate said to stand. On completion, the closing
    sheet CONVERGENCE names. Where the run may be cut off before it completes, keep the current
    sheet in a durable record the person can find. -/
def settle (respond : Context P → Response P) (c : Context P) : Outcome P :=
  let t := c ++ [(respond c).val]
  if NothingOpen c then .completed (verdict c t) else .holding t

open Classical in
def contextualize (respond session : Context P → Response P) :
    Context P → Outcome P → List (Utterance P) → Outcome P
  | _, o, []      => o
  | c, o, u :: us =>
    let c' := fuse c u
    if ¬ Reaches c' then contextualize respond session (c' ++ [(session c').val]) o us
    else
      let o' := settle respond (pass c')
      contextualize respond session o'.context o' us

def start (respond session : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : Outcome P :=
  let o := settle respond (pass c)
  contextualize respond session o.context o us

/-! ── LOOP ──
Transformative revalidation (NON-MONOTONE): a write produces a new X, and the next observation
reads it, so a write can breed mismatches that did not exist before, and can leave the one it
aimed at in place. Nothing counts down; every pass judges the whole X against the whole context,
and every change on the sheet names what moved. The relay runs inside a pass; each round that
leaves something open ends at one gate, and only the person's turn answers it. Completion needs no turn of theirs.
-/

/-! ── CONVERGENCE ──
Every closure is read where it fires and nowhere else. completed: a pass left nothing open — every
mismatch still found kept, another's, or withdrawn, a place resolved by a write gone once the
write repaired it — whether or not the person decided anything in this run; the closing sheet
carries the ground.
Fit is claimed only for the mismatches found within the reach, and fit is not correctness, which
was presupposed at entry and is not re-checked here; a replacement this run wrote is judged by
the next observation like the result it replaced, and a removal with nothing in its place leaves
no target. A mismatch left as it is carries the reason given and no claim that it does or does
not stand. Convergence evidence: one line per mismatch found — what did not fit, where, and how
it stood at the close: the person's resolution with the turn it came from, quoted, the intent
taken from it, and how it came to stand; a grant with what it covered; a relayed resolution or a
withdrawn flag with its evidence — beside the writes made with what each changed in X, any that
did not repair what they aimed at, the lines that left and why, what was checked and fits, what
was not reached with what it needs, the dissent attached to the closure, and what the verdict
does not claim. Demonstrated, not asserted.
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

inductive Op | observe | judge | evidenceWithdraw | evidenceRelay | gate | adapt | discard
             | readTurn | converge | seam

def grounding : Op → Annot × String
  | .observe          => (.observe, "artifact read, artifact search, record read, environment run: every place the result lands and every intent it answers to, read without changing existing state, what the context holds read again where something says it moved; what is made only to look is removed afterwards; each return enters the context as an evidence turn; a place that needs a change to existing state, a permission, or another's authority is named with what it needs and left unreached")
  | .judge            => (.sense, "Internal analysis: the whole result as it now stands against the whole context as it now stands, afresh every pass — never the assistant's own words as what the result must fit; how each mismatch stands; what fits and what was not reached")
  | .evidenceWithdraw => (.interaction .extension, "where evidence alone shows a flagged place fits, withdraw the flag and say so with that evidence; a person's turn that disputes it puts it back")
  | .evidenceRelay    => (.interaction .extension, "where evidence alone fixes a mismatch's whole resolution, say so with that evidence and record it as yours; the write it asks is an adapt or a discard; a person's turn that disputes it leaves it open")
  | .gate             => (.interaction .constitution, "the sheet: every mismatch found with how it stands, concrete actions for each open one with their consequences and your contrary grounds where you have them, never a category title, what fits, what was not reached, and what changed since the last sheet — then one question over every open mismatch")
  | .adapt            => (.transform, "artifact write: an adaptation a settled resolution asks, applied to the result inside what this run may write; what it returns enters the context and the next observation reads it")
  | .discard          => (.transform, "artifact write: withdraw the result and put the replacement in its place, or remove it when nothing takes its place")
  | .readTurn         => (.sense, "Internal analysis: the new turn, and every earlier turn of the person's it bears on, read whole against the fused context as it now stands — whether it bears on the run, and what it does there: resolves, corrects, disputes, grants, names something that does not fit, points at a place to look, asks about the sheet")
  | .converge         => (.interaction .extension, "the closing sheet: one line per mismatch with who settled it on what — the person's turn read, quoted, the intent taken from it and how it came to stand, a grant with what it covered, evidence with what it fixed — the writes made and what each changed, any that did not repair what it aimed at, the lines that left and why, what fits, what was not reached, the dissent attached to the closure, and what the verdict does not claim")
  | .seam             => (.interaction .extension, "after completion, proceed to the next move the person declared, citing that turn; every Constitution gate inside Epharmoge and the next protocol fires unchanged")

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

**Applicability over Correctness**: Follow a result to everywhere it lands and surface where it does not fit the situation it is applied in — an intent it was meant to carry and does not included; contextual fitness is the question this protocol settles.

## Mode Activation

### Activation

Layer 1 activates whenever the user invokes `/contextualize`, on any result they name — this session's output or an artifact from elsewhere — including when nothing may turn out not to fit; the invocation declares the deficit, and the AI does not judge it away. Layer 2, the AI-opened path, activates only when the AI has detected a mismatch between a result and the context it lands in, and the AI says that it opened the run. Prior-session recall indices may inform the judgment when available; they never settle the user's resolution.

## Protocol

The formal blocks define execution. This section fixes the user-facing rendering.

### The sheet

Open with an overview — how many places do not fit and how many wait on the user. Then every place the result does not fit, the ones that matter most first, each with what does not fit, where it is (in the result, or where the result lands), the part of the context it does not fit (quoted with where it came from), how much it matters, and how it stands — waiting on the user, what they decided and how (their words, an action they took, a choice they entrusted), settled by evidence with that evidence, or withdrawn because evidence showed it fits. For each open place, concrete actions, each with what then happens and your contrary grounds where you have them — never category titles; for a fix that was held back for a permission or its owner, say what it needs, and the actions are what would unblock it: grant the permission, do it yourself, hand it to its owner, or leave it. Group places that bear on each other and say what the group means together. Then say what was checked and fits, and each place that could not be reached with what reaching it needs. From the second sheet on, say what changed: each line added, removed, or changed names what moved — a write, something newly observed, the user's answer, or a correction of your own reading — and a line that left says why. Then ask once, over every open place, as a question. Where the run may be cut off before it completes, keep the current sheet in a durable record the user can find.

For a nightly report whose schedule was written this session:

```
Two places do not fit; both wait on you.

1. The report goes out at 18:00 Seoul time — after the team has left. Matters: nobody reads it the day it is sent.
   result   `0 9 * * *` (server in UTC)
   context  "the team works in Seoul" (your message)
   a. Send it at 09:00 Seoul time — `0 0 * * *`; this overlaps the 00:00–00:30 UTC backup window, so it is checked again
   b. Leave the 18:00 arrival — the report goes out unchanged

2. The report is mailed to ops@, but you asked for it in #daily-report. Matters: the forward from ops@ drops the attachment, so the team gets the report without its numbers.
   result   `MAILTO=ops@…`
   context  "put it in #daily-report" (your message)
   a. Post to #daily-report through the webhook the repo already uses
   b. Keep mail — say why, and it is recorded; against it: the team keeps getting it without the numbers

Fits: the script, its log path, the mail relay.
Not reached: whether the webhook token is valid in production — reaching it needs a live send.

Which way for each? Your own words are fine — for example "1a, 2a".
```

The user may answer in their own words, and one answer may settle several places or a class of them by a criterion; whatever else their message says, a resolution in it is carried out. Leaving a place as it is records the reason they gave and makes no claim that it does or does not stand. Where a place reads as another owner's, the options name the concrete split, for example "install mail in this image as part of this work" beside "leave it to whoever owns the image". Where the user entrusts a choice, make it inside what they entrusted and say it was yours. Where evidence alone fixes a resolution, carry it out and show it with that evidence; it takes no turn of theirs.

After the writes, say that the changed result was read again against everywhere it lands and that no correctness claim is made for it. A question about the sheet is answered, with the question said to stand; the whole sheet is shown again only where it changed or the user asked for it. Wherever you read one of the user's earlier turns as resolving a place, say which turn and what you took from it, quoting their words — for example: "Your 'leave the 18:00 arrival, the team reads it in the morning' — taken as: keep the schedule as it is." This disclosure stands in place of asking again.

When a pass leaves nothing open, the run completes without asking whether it is done: show the closing sheet — every place and how it was settled, what the writes changed, what fits, what was not reached, and what the verdict does not claim.

## Rules

- **Non-circularity**: What the result must fit is the context the person and the environment supplied — never the assistant's own words, which a mismatch cannot cite.
- **Round composition**: Compose each round so the reader can act on it without reassembling it — everyday language rather than this file's formal vocabulary, the judgment set beside the evidence it rests on together with the differential implication that matters for the next move, and analytical context laid out before a gate rather than inside it, so the gate carries the question and each option's differential implication. Read `references/round-composition.md` before composing when a term's rendering has to hold across the session or wording has to be carried through unchanged, when some of what is in view belongs to a later round or a trace rather than this one, or when this protocol's own moves bear on where a sentence sits relative to a gate.
- **One sheet**: Every place found goes on one sheet with one question over the open ones; a place is not held back for a later round. Where one answer changes what a later choice means, or the user asks for it, take them one at a time with the whole sheet still in view.
- **Recognition over categories**: Offer actions concrete to the place in front of the person, each with its consequence and your contrary grounds where you have them. The person's own words settle what a category would have asked them to choose.
- **Reach named**: Follow the result to every place it lands and every intent it was meant to carry, without changing existing state; read whole what you say you read; name each place not reached, and each fix not made, with what it needs.
- **Relay runs as Extension**: The pass relays every settled resolution — the person's, one under their grant, one evidence fixes alone — inside what this run may write: the result and the places it lands that the work in front of the person covers; only a place the person holds waits for their turn. A fix outside that, one that needs someone's permission or another's authority, or one whose effect cannot be undone is not made, even where evidence fixes its direction: it is named with what it needs, and the place waits on the person.
- **Verdict scope**: Present the per-mismatch trace before the verdict. Fit is claimed only for the mismatches found within the reach, and an adapted result claims fit, not correctness. A replacement the run wrote is judged on the next observation like the result it replaced; a removal with nothing in its place leaves no result.
- **The person resolves**: A resolution stands on the person's record only by their turn — their words, an action they took that was shown as yours with its consequence and your contrary grounds before they took it, or a choice they entrusted, recorded as yours. Evidence alone settles only what it fixes entirely and what nothing the person said contests: it withdraws your own flag or relays a resolution, shown with that evidence, and a person's turn that disputes it leaves it open. Which of the person's turns resolves a place is read from the context as it now stands and is not tied to their latest turn; wherever such a reading is made, say which turn was read and what intent was taken from it, quoting their words, in place of asking again.
- **Completion needs no closing turn**: A pass that leaves nothing open completes the run, whether or not the person decided anything in it; the closing sheet carries the ground. A place resolved by a write is not closed until that write repairs it. A later utterance that bears on the run opens it again; one asking for a step that rests on the result while something is open gets the open places first, and a step that cannot be undone waits on them.
- **How much it matters**: Say how much each place matters by its demonstrable behavioral consequence — a downstream decision, a runtime divergence, a changed gate trajectory. Structural extent (line count, file count, scope size) alone makes a place minor. This guards against presenting structural change as if it changed how the result applies.
- **Judge afresh after every write**: A write changes the result, so the next observation reads the whole result against everywhere it lands again; the run can have more open after a resolution than before it. A place a write aimed at and that is still found is unrepaired; a write that failed resolves nothing. Every change on the sheet names what moved.
- **After the close**: The AI never rewrites or vetoes a resolution the person settled. New evidence against it is shown, and is owed before any dependent step that cannot be undone. A next step the person declared runs only after completion.
- **Form feedback**: Silence about form is not evidence about form. Too dense fails quietly — the reader skims, answers past it, stops — while too plain fails out loud, so the complaints that arrive come from one side only. Density therefore does not carry over from the previous round: each round takes it from what this request asked for, while a statement about form does carry over until it is countermanded. Read an instruction about form for the parts of a round it reaches, not for what kind of reaction it is — a complaint, a request, a symptom report and a bare preference are one input here, and sorting them by kind yields nothing the reach reading does not already give while costing a clause per kind. Change the form rather than asking which form they want; naming one is the recall this discipline exists to remove. What such an instruction reaches is whatever the active protocol leaves open in how a round is composed — its density, its ordering, its length. What it does not reach is whatever is already fixed for this round elsewhere: content the protocol requires, wording carried verbatim, an order it presents in, a cadence it caps, a turn boundary it sets. Those stay in place, and the layer that fixed them is what states why. Say in one line what changed; where the instruction overlapped something that stays, say in one line that it stays and why — that second line is owed by the overlap, not by how the instruction was worded.
