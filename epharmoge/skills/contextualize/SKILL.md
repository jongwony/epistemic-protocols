---
name: contextualize
description: "Use when a result, this session's or one brought in, may have lost what was said or settled — focus moved, the context grew long, work changed hands — or may not fit where it lands, or when the user asks to check that; opened without the user's call only where such a loss or misfit has actually been detected, saying so. The user sees again what fell away and what it means now; what was settled and wrongly applied is fixed and reread; what is theirs to judge comes back with a proposal."
---

# Epharmoge Protocol

Recover what was said and settled along the way that did not reach a result, correct what the context had already settled and the result applied wrongly, and hand back what is the person's to judge. Type: `(ApplicationDecontextualized, AI, CONTEXTUALIZE, Result) → ContextualizedExecution`.

## Definition

**Epharmoge** (ἐφαρμογή): A dialogical act of fitting a result back to the context that was meant to reach it. Context never reaches its target whole: while the person's focus moves between things, the context grows long, or work changes hands, part of what was said and settled falls away from the result. The result is any work product: this session's output, an analysis, a decision, a document, or an artifact another session or person produced. The AI recovers what was meant to reach the result, follows the result to where it lands, and tells two things apart. Where the context already settles what is right and the result departs from it, the AI corrects the result within what this run may write and reads it again, without asking. Where something fell out of view and what it means for the result now is the person's to judge, the AI lays it out again — where it was said, and what its absence means in the person's own situation — beside the handling it would take, and hands it back. The beneficiary is the person: they see again what they could not have recalled. Each pass returns one sheet and the run's share ends there, with no answer owed and no closing turn asked; a later turn of theirs that bears on it opens another pass. What ends is this run's share, not the question of fit: a return establishes what was recovered, corrected and read again within what was reached — not that the result is correct, and not that it fits while something is still theirs to judge.

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
  pass(c): observe; perform — the relay; observe again
  return: the sheet — what was corrected, what is handed back as the person's, what was not
          reached; the run's share ends here, with no answer owed
  next utterance u: c' := fuse(c, u), read whole →
    [u does not bear on this run]   the session answers it; the last return stands
    [otherwise]                     pass(c') → the sheet again
  no utterance: the last return stands; a later utterance that bears on the run opens it again
-/

/-! ── MORPHISM ──
(X, context)
  → observe(reach)             -- what was meant to reach X and every place X lands, without changing existing state; what could not be reached, named
  → judge(result, context)     -- where what the context holds for X did not reach it, or reached it wrongly, as both now stand; afresh on every pass
  → perform(settled)           -- the relay: every settled handling within what this run may write, and what its own writes newly settle
  → surface(sheet)             -- what was corrected and what settled it, what is handed back as the person's with the handling the AI would take, what fits, what was not reached; the run's share ends here
  → fuse(person's turn)        -- where one comes: their words, a proposal they took, a grant of theirs — carried out on the next pass
  → ContextualizedExecution
requires: mismatch_detected(X)   -- the AI-opened path only (Layer 2); an invocation declares the deficit and enters without it
deficit:  ApplicationDecontextualized
preserves: every turn of the context -- the context only grows (pass_extends); a write changes only what this run may write (perform)
invariant: Fit, not correctness -- a return says what was recovered, corrected and read again; it gives no verdict on X's correctness
invariant: the person holds what the context does not settle; a handling goes ahead unasked only where what settles it chooses nothing that is the person's (SettledSupported)
invariant: transformative revalidation (NON-MONOTONE) -- a write changes what the next observation reads, so a pass can find more than the one before it; every pass judges the whole X against the whole context
invariant: Focus never records -- the sheet, its order, and whether an utterance bears on the run are re-read every turn; only the person's turn, a grant of theirs, or evidence that fixes it moves a handling onto the record
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

/-- **Your reading**: X as the person is now left with it, every write that has landed applied —
    each write returns its result into the context; after a discard, the replacement or `none`,
    whether or not the discarded artifact still exists elsewhere. -/
axiom target : Context P → Option Result

/-- **Your observation** of the reach, to the limit of what you can read or run without changing
    existing state. First what was meant to reach X: the person's words, decisions and purposes
    across the context — an earlier part of the session and a record the context points to
    included — and the rules, conventions and decisions X answers to. Then every place X lands —
    what reads or consumes it, its copies and neighbours, the people who will read it, the
    environment it runs in. Where to look is yours to judge, and no list of places bounds it. What
    you say you read, you read whole; what the context already holds is read again where a write,
    an utterance, or evidence says it moved; what you create only to look — a scratch copy, a temp
    file — you remove afterwards. A place that needs a change to existing state, someone's
    permission, or another's authority is not reached on your own: it goes into `reach` with what
    it needs. Each return is an evidence turn. -/
axiom observe : Context P → List (Evidence P)

/-- One place where the context did not reach X, or reached it wrongly: what fell away or does
    not fit; where in X it bears, or where X lands — or that its place in X is still open; the
    turn of the context that carries it, which is never the assistant's own (`Cite`), so X is
    never held against your own words. -/
structure Mismatch (c : Context P) where
  what     : String
  inResult : String
  against  : Cite c

/-- **Your judgment**, made afresh on every pass: where what the context holds for X did not reach
    X, or reached it wrongly, as both now stand. The context is everything meant to bear on X —
    the person's account of their situation and the intents and decisions they stated along the
    way, every earlier answer, the rules, conventions and environment X meets, and what
    observation returned from every place X lands. Something said or settled that X was meant to
    carry and does not is a mismatch, an omission. A recovered statement is read against the
    present: where a later turn changed it, X is held to what it now says. One mismatch per claim
    is the direction; a claim standing on evidence in several places is one mismatch, since how
    far a repair reaches is the resolution's question. Something the person names as not fitting
    is judged here like anything else. A place of an X that nothing relies on any more — the
    person discarded it — is not a mismatch. -/
axiom mismatches : (c : Context P) → List (Mismatch c)

/-- The handling of one mismatch, read the same way wherever it stands — by the person's turn or
    by evidence. There is no verdict beside it: whether the mismatch "really" stands is not asked,
    and nothing here asserts it either way. `adapt` and `discard` ask for a write; whether that
    write was carried out, and whether it repaired the mismatch, is read from what `perform`
    returned and what the next observation found, and the sheet says which. A write that repairs
    it takes it out of what is found. Premise: a turn of the person's gives a mismatch one of
    these handlings or none. A turn that changes what X is for gives none — it joins the context,
    and `mismatches` is judged afresh on it. -/
inductive Resolution
  /-- change X this way -/
  | adapt (direction : String)
  /-- leave X as it is here, with the reason given where one was given -/
  | keep (reason : Option String)
  /-- stop relying on X; the replacement, or `none`, is what the person is now left with. Within
      what this run may write, the write removes X or puts the replacement in its place; outside
      it, the write is your turn recording that X is no longer relied on, and it counts as carried
      out -/
  | discard (replacement : Option Result)
  /-- not this result's to fix: whose it is — a system, a team, a scope — as named; nothing is
      dispatched -/
  | elsewhere (owner : String)

/-- How a resolution the person's turn carries came to stand: in their own words; by taking an
    action you put on the sheet; or by your choice inside a grant of theirs. -/
inductive How | set | adopted | granted

/-- **Your judgment**: the cited turn of the person resolves `m`, as it now stands, this way — read
    against the context that now stands, the order of its turns included, and not tied to their
    latest turn; the `Resolution` reads as its constructor says. `set`: their own words. A turn
    of theirs from before `m` was shown — an instruction X did not follow, a decision X does not
    carry — resolves it only by the test `SettledSupported` states. `adopted`: they took an action
    you put on the sheet, and only where that action was visible as yours, with its consequence
    and your contrary grounds where there were any, before that turn; "as proposed" takes the
    handling you marked as the one you would take, never an option's position. `granted`: the
    cited turn entrusts the choice to you, and only inside what it covers; the resolution is then
    your choice under it, recorded as yours. A question, a request to look, a deferral, or a bare
    mention settles nothing. Their answer is read whole: one turn may resolve several mismatches,
    or settle a class of them by a criterion; where it asks for dispositions of one result that
    conflict — a discard beside an adaptation of the same result — it resolves neither: only a
    turn of theirs after the combined consequence has been shown resolves them, and the earlier
    conflicting turn never takes effect on its own. -/
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
  /-- the evidence settles the resolution: relayed, recorded as yours with that ground -/
  | resolves (r : Resolution)

/-- **Your judgment**: the cited evidence, read against X and the whole context as they now
    stand, admits this reading of `m` alone and fixes all of it; the `Resolution` reads as its
    constructor says. This is the one test for handling `m` without asking, wherever its ground
    comes from: what settles it still binds as the context now stands — a later turn may have
    changed it — and fixes the direction of the change, where in X it goes, and how far it
    reaches, with one reading, selecting no judgment that is the person's. What the context had
    already settled and X applied wrongly passes it; so does an omission, where an instruction, a
    decision or a rule that still binds was not followed. Where it is open whether a recovered
    thing still applies, or where in X it belongs, nothing is settled and it is handed back.
    Whether to leave a mismatch as it is, to stop using X, or whose it is, is the person's:
    evidence settles those only where something the person already constituted — a decision they
    recorded — settles it, and evidence of yours never settles a handling against a decision they
    recorded. Which grounds do this is your reading each time. Where the evidence admits more
    than one reading, it settles nothing; where several sources fix it together, the sheet shows
    them together. A person's turn that disputes it leaves it unsettled. -/
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

/-- How the handling of a mismatch stands. Whether a settled change was carried out is not read
    here: `perform` returns it, the next observation reads it, and `reach` names what was not
    carried out. -/
inductive Standing
  /-- nothing settled its handling: it is handed back as the person's -/
  | open_
  /-- the person's turn settled it, and how that came to stand -/
  | resolved (r : Resolution) (how : How)
  /-- evidence alone fixed its handling: yours, with that evidence -/
  | relayed (r : Resolution)
  /-- evidence showed it fits; you withdrew your own flag -/
  | withdrawn

/-- The person's resolution first, whatever evidence read; otherwise what evidence alone settled;
    otherwise it is handed back. -/
def standing (c : Context P) (m : Mismatch c) : Standing :=
  match filledValue (resolution c m) with
  | some (r, h) => .resolved r h
  | none =>
    match filledValue (byEvidence c m) with
    | some .withdraw     => .withdrawn
    | some (.resolves r) => .relayed r
    | none               => .open_

/-- **Your record** of the reach, read from the context as it now stands: where the judgment looked
    and what it found fits; each place it could not reach, each condition at a reached place it
    could not verify, and each write it did not carry out or that did not repair what it aimed
    at, with what each needs — a change outside what this run may write, a permission, another's
    authority — named so the person can point at one you missed. -/
axiom reach : Context P → String

/-- **Your judgment**: the latest utterance, read whole against the context as it now stands,
    bears on this run — it resolves, takes a proposal, corrects, disputes, grants, changes what X
    is for, names something that does not fit, points at a place to look, asks about the sheet,
    or changes X or the evidence — even where it looks like other work. An utterance that bears
    on none of it leaves the run as it stands: the session answers it, that answer stays in the
    context, no pass runs, and the last return stands. -/
axiom Reaches : Context P → Prop

/-- **Your record**: contrary grounds you showed beside your proposals and before the person's
    resolutions — evidence that a mismatch does not fit beside a resolution that left it as it
    is, a doubt about a grant's reach, among them — attached to the return; empty when there were
    none. -/
axiom dissent : Context P → List String

/-- Once it has run, the person can say: what I said and settled along the way that did not reach
    this result was laid out again for me — where I said it and what it means for the result now;
    where the result applied wrongly something the context had already settled, it was fixed
    without my being asked and read again, and I saw what settled it; what is mine to judge came
    back with the handling the AI would take; and I saw what was looked at and what could not be
    reached.
    `ContextualizedExecution`: the context at the return, the sheet included; what the person is
    left with (`none` when a removal left nothing); the reach; and the dissent attached to the
    return. -/
structure ContextualizedExecution (P : Type) where
  context : Context P
  target  : Option Result
  reach   : String
  dissent : List String

/-! ── MODE STATE ──
Λ is the fused context and nothing else; every reading above is taken from it.
-/

/-! ── PHASE TRANSITIONS ──
A pass is silent and orthogonal to the person's coordinate: observe the reach, `perform` the
relay, observe again; every return enters the context, and how each mismatch stands is then read
from it. `respond` presents the sheet, and the run's share ends with it. `session` answers an
utterance that does not bear on this run.
-/

/-- A turn a write returns: your own, stating a revised result or recording a discard, or what an
    artifact write returned. Never the person's, never a peer's. -/
def Write (P : Type) := {e : Turn P // e.origin = .assistant ∨ e.origin = .external}

/-- **Your action**, the relay: carry out every adaptation and every discard a settled handling
    asks — the person's, one under their grant, one evidence relays — that the context does not
    yet show carried out, the person's whole answer read and its combined consequence weighed
    first, and what your own writes newly settle, until nothing newly settled is left. Only a
    settled handling is carried out: a handling you marked as the one you would take is not
    written into X before the person takes it. A write follows where X lives: an artifact is
    written where it lies; a result that lives in the conversation — an answer, an analysis — is
    adapted by your stating the revised result in your own turn. What this run may write is what
    the work in front of the person covers and they hold authority over, where the effect can be
    undone: their own resolution turn authorizes a write to anything they hold, an artifact
    another session of theirs produced included; another person's artifact, or a scope they do
    not hold, needs that person or a permission; an effect that cannot be undone — a removal or
    overwrite with no way back, a deploy, a send outside — needs their authorization for that
    effect. A write outside that is not carried out, even where evidence fixes its direction: it
    goes into `reach` with what it needs and is handed back as the person's; once their turn
    authorizes it, it is carried out. A discard there is the exception: its write is your turn
    recording that X is no longer relied on. Returns what the writes returned. -/
axiom perform : Context P → List (Write P)

def pass (c : Context P) : Context P :=
  let c₁ := c ++ (observe c).map (·.val)
  let c₂ := c₁ ++ (perform c₁).map (·.val)
  c₂ ++ (observe c₂).map (·.val)

/-- `respond` presents the sheet, read on the context the pass left, in this order. What you
    corrected without asking, what matters most first: what the context had settled, quoted with
    where it came from; what X did instead; the change made and what the reading after it showed.
    Then what is handed back as the person's: what fell away or does not fit, where it bears, the
    part of the context that carries it (quoted with where it came from), how much it matters —
    significant only with a demonstrable behavioral consequence (a downstream decision, a runtime
    divergence, a changed trajectory for the person), structural extent alone minor — and
    concrete actions, each with its consequence and your contrary grounds where you have them,
    never a category title; where you would take one of them, say which and why. Mismatches that
    bear on each other are grouped, with their combined consequence and actions over the group.
    Every other mismatch found is shown as it stands: the person's resolution with their turn
    quoted, the intent taken from it, and whether they said it, took a proposed action, or
    entrusted the choice; a relayed handling or a withdrawn flag with its evidence; a change
    whose write landed without repairing it, said to be unrepaired; a change whose write was
    held, with its settled direction and what it needs shown apart, and what the person can do
    about it — authorize it, make the change themselves, hand it to its owner (nothing is sent),
    or leave it. Then `reach`: what fits and what was not reached. A reading of yours corrected
    on unchanged ground is said to be a correction. The sheet asks nothing: it says how an answer
    would be taken — their own words read whole, "as proposed" taking each handling you marked —
    and that none is owed; what is handed back comes together, or one at a time where the person
    asks for it. What the utterance asked outside this run is answered here; a step that rests on
    X and cannot be undone waits while the latest sheet leaves something handed back, unrepaired
    or held, and those places are shown before it. Each sheet is CONVERGENCE's convergence
    evidence. -/
def settle (respond : Context P → Response P) (c : Context P) : ContextualizedExecution P :=
  ⟨c ++ [(respond c).val], target c, reach c, dissent c⟩

open Classical in
def contextualize (respond session : Context P → Response P) :
    Context P → ContextualizedExecution P → List (Utterance P) → ContextualizedExecution P
  | _, r, []      => r
  | c, r, u :: us =>
    let c' := fuse c u
    if ¬ Reaches c' then contextualize respond session (c' ++ [(session c').val]) r us
    else
      let r' := settle respond (pass c')
      contextualize respond session r'.context r' us

def start (respond session : Context P → Response P) (c : Context P)
    (us : List (Utterance P)) : ContextualizedExecution P :=
  let r := settle respond (pass c)
  contextualize respond session r.context r us

/-! ── CONVERGENCE ──
Every return is read where it fires and nowhere else. returned: a pass has run and its sheet is
shown, whether or not the person decided anything and whether or not something is handed back.
A return claims what was recovered, corrected and read again, for the mismatches found within
the reach. It makes no claim that X is correct, and it does not say X fits while something is
handed back, unrepaired or held. A replacement this run wrote is judged by the next observation
like the result it replaced. A mismatch left as it is carries the reason given and no claim that
it does or does not stand. What is handed back stays the person's: no answer is owed, and a
later turn of theirs that bears on it is carried out on the next pass. Convergence evidence: one
line per mismatch found — what fell away or did not fit, where, and how it stands at the return:
handed back, with the handling you would take where you marked one; the person's resolution
with the turn it came from, quoted, the intent taken from it, and how it came to stand; a grant
with what it covered; a relayed handling or a withdrawn flag with its evidence — beside the
writes made with what each changed in X and what settled it, any that did not repair what they
aimed at, the lines that left and why, what was checked and fits, what was not reached with what
it needs, the dissent attached to the return, and what the return does not claim. Demonstrated,
not asserted.
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

inductive Op | observe | judge | evidence | surface | adapt | discard | readTurn | converge | seam

def grounding : Op → Annot × String
  | .observe   => (.observe, "artifact read, artifact search, record read, and a run that changes no existing state — no send, nothing left behind: what was meant to reach the result and every place the result lands; each return enters the context as an evidence turn; a place that needs a change to existing state, a permission, or another's authority is named with what it needs and left unreached")
  | .judge     => (.sense, "Internal analysis: the whole result as it now stands against the whole context as it now stands, afresh every pass — never the assistant's own words as what the result is held against; how the handling of each mismatch stands; what fits and what was not reached")
  | .evidence  => (.interaction .extension, "where evidence alone settles a mismatch as SettledSupported says, withdraw your own flag or record the relayed resolution as yours, with that evidence; a person's turn that disputes it leaves it unsettled")
  | .surface   => (.interaction .extension, "the sheet, as `respond` composes it")
  | .adapt     => (.transform, "artifact write, or the revised result stated in your own turn where the result lives in the conversation: an adaptation a settled handling asks, within what this run may write; what it returns enters the context and the next observation reads it")
  | .discard   => (.transform, "within what this run may write, an artifact write that withdraws the result and puts the replacement in its place, or removes it when nothing takes its place; outside it, your turn recording that the result is no longer relied on")
  | .readTurn  => (.sense, "Internal analysis: the new turn, and every earlier turn of the person's it bears on, read whole against the fused context as it now stands — whether it bears on the run, and what it does there: resolves, takes a proposal, corrects, disputes, grants, changes what the result is for, names something that does not fit, points at a place to look, asks about the sheet")
  | .converge  => (.interaction .extension, "the convergence evidence CONVERGENCE names, which each sheet carries")
  | .seam      => (.interaction .extension, "after a return, proceed to the next move the person declared, citing that turn")

/-! ── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). Mismatch-domain resolution emergent via session context.
contextualize ∘ caller-loop: this protocol is built to run inside another loop. It keeps
collating the result against the accumulated context as the result changes.
Past the hand-off, named here and supplied elsewhere: producing the result and establishing that
it is correct; drawing out an intent nobody stated; what the owner of a mismatch that is not
this result's does with it; keeping what was handed back findable after the session, which
needs a record the person can find; the next move after a return; how a caller that ran this
protocol folds the sheet into its own report.
-/

end

end Epharmoge
```

## Mode Activation

### Activation

Layer 1 activates whenever the user invokes `/contextualize`, on any result they name — this session's output or an artifact from elsewhere — including when nothing may turn out to have fallen away, and whether or not the result is correct; the invocation declares the deficit, and the AI does not judge it away. Layer 2, the AI-opened path, activates only when the AI has detected that something meant to reach a result did not, or that the result does not fit where it lands, and the AI says that it opened the run. Prior-session recall indices may inform the judgment when available; they never settle the user's resolution.

## Protocol

The formal blocks define execution. This section fixes the user-facing rendering: the sheet `respond` names. For a nightly report whose schedule was written this session:

```
One place is corrected. One is yours to look at again.

Corrected — you had already said where it goes.
1. The report was mailed to ops@. It now posts to #daily-report through the webhook the repo already uses.
   you said    "put it in #daily-report" (your message)
   it had      `MAILTO=ops@…`
   read again  the job posts to the channel, and the mail line is gone

Yours.
2. The report goes out at 18:00 Seoul time — after the team has left. Matters: nobody reads it the day it is sent.
   you said    "the team works in Seoul" (your message)
   it has      `0 9 * * *` (server in UTC)
   a. Send it at 09:00 Seoul time — `0 0 * * *`; this overlaps the 00:00–00:30 UTC backup window, so it is checked again
   b. Leave the 18:00 arrival — the report goes out unchanged
   I would take a: a report that arrives after the team leaves is read a day late. Against it: the backup window.

Fits: the script, its log path.
Not reached: whether the webhook token is valid in production — reaching it needs a live send.

No answer is owed. "As proposed" takes 2a; your own words are fine too.
```

Where a place reads as another owner's, the options name the concrete split, for example "install mail in this image as part of this work" beside "leave it to whoever owns the image". Wherever you read one of the user's earlier turns as settling a place, say which turn and what you took from it, quoting their words — for example: "Your 'put it in #daily-report' — taken as: post it there." This disclosure stands in place of asking.

## Rules

- **Non-circularity**: As `Mismatch.against` states — what the result is held against is never the assistant's own words.
- **Round composition**: Compose each round so the reader can act on it without reassembling it — sentences that state who does what, in words the reader already uses or meets often rather than this file's formal vocabulary, composed from the meaning in the language they are using; the judgment set beside the evidence it rests on together with the differential implication that matters for the next move; and analytical context laid out before what is handed back rather than inside it, so each handed-back item carries its actions and each action's differential implication. Read `references/round-composition.md` before composing when a term's rendering has to hold across the session or wording has to be carried through unchanged, when some of what is in view belongs to a later round or a trace rather than this one, or when this protocol's own moves bear on where a sentence sits relative to what is handed back.
- **One sheet**: As `respond` states — everything found on one sheet, and nothing asked.
- **Recognition over categories**: As `respond` states — concrete actions with their consequences and contrary grounds, the one you would take marked, never category titles.
- **Reach named**: As `observe` and `reach` state.
- **Relay runs as Extension**: As `perform` and `SettledSupported` state — what is settled is carried out within what this run may write; what the person holds is handed back.
- **The person resolves**: As `ResolutionSupported`, `SettledSupported`, and `respond` state — including the quoted disclosure of a turn read as a resolution.
- **A return ends the run's share**: As `settle` and CONVERGENCE state — no answer owed, no closing turn.
- **How much it matters**: As `respond` states — by demonstrable behavioral consequence, never structural extent alone.
- **After the return**: The AI never rewrites or vetoes a resolution the person settled.
- **Form feedback**: Derive each round's density from the current request and carry an explicit form instruction until countermanded. Change the form directly. Elements fixed elsewhere remain fixed; state what changed and, where the instruction overlaps a fixed element, what stays and why.
