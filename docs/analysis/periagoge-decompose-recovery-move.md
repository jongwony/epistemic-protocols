# Decompose Recovery — a composition, not a Periagoge move

Design note for the wrong-fusion recovery problem (C3b) and its **corrected**
resolution. An earlier draft of this note proposed Decompose as a new `/induce`
(Periagoge) move; that was wrong. This note records why, and the corrected shape:
**decompose is an object-level `/ground ; /induce` composition, not a move.**

## The gap (C3b) — still real

Periagoge forms ONE abstraction from an instance set and shapes it through
Confirm / Widen / Narrow / Fuse / Reorient / Dismiss. None of these splits the
set into multiple abstractions. So when an abstraction turns out to be a *wrong
fusion of dissimilar instances forced under one form* — the failure mode Acton
(over-generalized `Node`), Cantrill (leaky abstraction), and Metz ("the wrong
abstraction") converge on — recovery requires going *backward* to the concrete
instances and re-forming, often into *multiple* abstractions. Metz's prescription
is exactly: re-introduce duplication, inline the form back into every instance,
and let the *right (possibly multiple)* abstractions emerge.

Detection of the wrong abstraction is already covered: grounding it against its
instances via `/ground` (Analogia) surfaces the misfit as a `CorrespondenceFitMap`
with `overextended` / `missing` cells (C3a). The genuine gap was the *recovery*
(split + re-form). The question this note answers is **where that recovery lives**.

## The correction: decompose is a composition, not a move

The first draft made Decompose a 7th `UserMove` inside `/induce` and then gave
that move child state, sequencing, recursion, terminalization, and a generalized
terminal type (`DecomposedResolution`). That was a category error. Decompose
factors cleanly into operations that **already exist**, with no residual
primitive that belongs inside `/induce`:

- **Detect the misfit / evidence the split boundary** → `/ground`. Its
  `CorrespondenceFitMap` (`preserved` vs `overextended`/`missing`) supplies the
  evidence for the partition. (`/ground` evidences the boundary; it does not, by
  itself, constitute the cell assignment — see next.)
- **Constitute the cell assignment** → a Constitution **boundary-checkpoint**.
  The coherent child-cell boundary is a *user judgment* (which instances form
  which rival essence), so it is a gate. This checkpoint lives in a `/conduct`
  (Hyphegesis) recipe, not inside `/induce`.
- **Re-form each cell** → a normal `/induce` activation per cell. Periagoge's
  `A-BINDING` already accepts an explicit instance cluster/subset of any
  cardinality as its seed, so a cell is just a smaller seed. No new machinery.

So the recovery is the composition **`/ground` (detect) → `/conduct` (host the
constitutive split checkpoint) → `/induce` per cell (re-form)**, sequenced through
session text (A5 composition scope). `/induce` itself needs **no change** and
reverts to its six-move, single-terminal shape.

## Why the move-form was wrong (and what it cost)

Making Decompose a move, then giving it `child_queue` / sequential child
processing / recursion / `decompose_resolved`, turned an *object-level split* into
a *mini-orchestrator* inside `/induce`. Once orchestration lives in the move, the
"obvious next questions" become queue order, focus, branching, child state, and
span — and those are **control-level** questions. The fused move structurally
*generated* a drift from the object level (transforming abstractions) up to the
control level (governing what the session attends to). The reflexive irony: the
Decompose *implementation* was itself a wrong fusion — dissimilar concerns
(detect / orchestrate / form) forced under one move — and its own cure is its own
prescription: cut it back into `/ground` / `/conduct` / `/induce`.

This also restores the constraint stated in
`periagoge-calibrative-induction-morphism.md`: **keep `CrystallizedAbstraction` as
the only convergence object.** Per-cell recovery yields several
`CrystallizedAbstraction`s (multiplicity), not a new terminal type.

## The object / control stratum boundary

- **Decompose is object-level**: it transforms *abstractions* (instances,
  essences, candidates).
- **Span / focus / navigation governance is control-level**: it transforms *what
  the session attends to* across a growing graph of abstraction work.

These are different strata and must not be conflated. The need to govern attention
across many nodes arises from multi-node work in general (fuse, ascend, parallel
threads) — not from decompose specifically — so it is a **separate inquiry**, not
a tail of decompose. A candidate control-level protocol (`SpanOverloaded →
FocusedSpan`, a salience/span governor that constitutes attention and hands a work
prospect to `/conduct`, never storing graph state or running moves) is deferred to
its own design pass. The decisive test for whether it is a legitimate EP protocol
vs. substrate: can its deficit→resolution be written as constituting *salience*
(epistemic), or only as *managing graph state* (substrate, per the Epistemic
Completeness Boundary)? That test is out of scope here.

## Map nodes ≈ distill, conditionally

If the recovery composition is later driven over many nodes, a node is **backed
by** a `/distill` PortableHandoff *only when it must cross a boundary* (compaction,
session branch, delegation) — not identical to a distill output. A live in-session
node is a lightweight reference; forcing every node through `/distill` would
over-externalize (Task Externalization Boundary). Edges (parent/child from a split,
sibling from a fuse) are framing-shift records, not contained in any single node.

## Scope of the corresponding PR

- `/induce` (`periagoge/skills/induce/SKILL.md`) reverts to its six-move,
  single-terminal shape — **no net change**. No `plugin.json` bump.
- This note is the durable record of the corrected concept.
- The `/conduct` recovery recipe (ground → boundary-checkpoint → induce-per-cell)
  and the control-level span/focus governor are **separate follow-ups**, each on
  its own footing.

## Provenance

Reached through this session's design dialogue plus three independent Codex
(gpt-5.5, xhigh) consults that converged on: decompose = `/ground;/induce`
composition; the fused move as the structural source of the control-level drift;
and the governor as legitimate only as a narrow salience/span protocol.
