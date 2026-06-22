# Periagoge Decompose Recovery Move (C3b)

Design note for the Decompose move added to `/induce`. Resolves the central
design decision: how a multi-way partition of the instance set coexists with
Periagoge's `preserves: instance_set(A)` invariant.

## The gap

Periagoge can FORM one abstraction from an instance set and shape it through
Confirm / Widen / Narrow / Fuse / Reorient / Dismiss. None of these splits the
set into multiple abstractions:

- **Narrow** trims one abstraction along a dimension and *drops* the instances
  that fall outside (one shape survives, the excluded instances are unaccounted).
- **Dismiss** drops the candidate and re-proposes ONE fresh candidate over the
  *same* set.
- **Reorient** changes the axis but still yields ONE candidate.

So when the real problem is *"this set is actually two or more distinct essences
forced under one form"* — the wrong-abstraction failure mode (Acton's
over-generalized `Node`, Cantrill's leaky abstraction, Metz's "wrong
abstraction") — there is no move. The recovery Metz prescribes is exactly
re-introducing duplication: inline the abstracted form back into every instance,
then let the *right (possibly multiple)* abstractions emerge. Periagoge had no
operator for that. **Decompose is that operator.**

Detection of a wrong abstraction is already covered: grounding it against its
instances via `/ground` (Analogia) surfaces the misfit as a
CorrespondenceFitMap with `overextended` / `missing` cells (C3a). Flagging is not
fixing — splitting the set and forming multiple new abstractions is a *formation*
operation, so it belongs in `/induce`, not `/ground` (C3b).

## Central design decision: partition vs. the read-only invariant

`MORPHISM` line: `preserves: instance_set(A)  -- Iᵢ read-only`. Decompose
partitions `Iᵢ`, which naively breaks read-only. Two approaches:

1. **Mutate `Iᵢ` in place** — partition the parent's set directly.
2. **Derive child seeds** — Decompose spawns `k` child `AbstractionSeed`s, each
   carrying a *read-only* instance subset (a partition cell of `Iᵢ`); the parent
   `Iᵢ` is never mutated, preserved as provenance.

**Decision: approach 2 (child seeds).** Rationale:

- It *preserves* the invariant rather than breaking it. Read-only is a per-seed
  property; Decompose instantiates it `k` times over disjoint subsets instead of
  mutating the existing set. `preserves: instance_set(A)` holds unchanged — the
  parent set stays intact; partition derives *new* read-only seeds.
- It matches Periagoge's own structure: every `AbstractionSeed` already has a
  read-only `Iᵢ`. A child is just a new seed over a subset — no new mechanism.
- It mirrors Metz exactly. The instances (the "callers") are the source of
  truth, preserved; the *abstraction over them* is what gets released and
  re-formed. The parent abstraction is marked `decomposed`; each cell re-forms.
- Category-theoretic reading: Periagoge forms a colimit over an instance cocone.
  Decompose recognizes the cocone was actually a coproduct of `k` sub-cocones and
  forms the colimit of each. The diagram (instances) does not change; the
  grouping into one-vs-many colimits does.

## Reconciled ripples

- **`crystallized(A)` / convergence (now possibly `k` crystallizations).** A
  decomposed parent does not crystallize; it resolves into `k` children. New
  predicate `decompose_resolved(A) = status(A)=decomposed ∧ ∀ child :
  terminalized(child)`. Terminal type generalizes to `CrystallizedAbstraction |
  DecomposedResolution`. Children are processed *sequentially* (one Phase-2 gate
  at a time, like Analogia's one-correspondence-per-cycle): pop a child, rebind
  `Λ.A` to it (resetting candidate/calibration/history/attempts), run Phase 1–3
  to its own crystallization or dismissal, pop the next.

- **Session immunity (was counterproductive).** A crystallized `(Iᵢ, E)` pair is
  skipped for the session — which would *block* re-examination after `/ground`
  reveals it was wrong. Reconciled: a new fit-misfit signal **lifts** immunity on
  that pair (new evidence unsettles a settled form). Immunity still holds for
  re-entry without new misfit evidence. The parent pair gains a third terminal
  status, `decomposed`, so the wrongly-fused single form is not re-proposed as
  one; the child pairs are new `(Iᵢ⁽ʲ⁾, Eⱼ)` pairs by construction and are not
  blocked.

- **Attempt cap.** Per-seed (max 5). Children are new seeds → each gets its own
  budget. Decompose counts as one move on the parent. Recursion (a child itself
  decomposing) is **structurally bounded**: every cell satisfies `|Iᵢ⁽ʲ⁾| < |Iᵢ|`
  (k ≥ 2, cells nonempty), so a singleton cannot decompose; depth ≤ `|Iᵢ| − 1`.
  No artificial recursion cap needed.

- **Interaction with existing moves.** Narrow keeps one shape and *drops* outside
  instances; Decompose keeps *every* instance and re-homes each into a sibling.
  Dismiss re-proposes one over the same set; Decompose says the *set itself* was
  heterogeneous. Decompose is a genuine peer option on the decision axis (its
  fork-into-k-children trajectory is structurally distinct), so it satisfies the
  Differential Future Requirement.

- **Conditional presentation (dead-signal suppression).** Like Fuse, Decompose is
  presented only when Phase 1 surfaces a misfit boundary partitioning `Iᵢ` into
  ≥2 coherent cells. A misfit that only trims scope is Narrow, not Decompose.

## Trigger coupling to Analogia

The misfit input is Analogia's `CorrespondenceFitMap`
(`analogia/skills/ground/SKILL.md`): grounding an abstraction (`Sₐ`) against its
own instances (`Sₜ`) and finding `overextended` / `missing` correspondences. The
partition boundary is `preserved`-cell instances vs. `overextended`/`missing`-cell
instances, generalized to `k` cells. The boundary is AI-detected with cited basis
(Detection with Authority); the decision to split and the cell assignment are
user-constituted (Constitution).

This closes the **detect (`/ground`) ⇄ recover (`/induce`)** loop. The trigger is
absorbed on the Periagoge side (Phase 0 + Trigger Signals + Skip reconciliation);
Analogia is *cited* as the input source, not modified, keeping the change within
the "extend `/induce`" mandate. Standing orchestration of the loop is `/conduct`
(Hyphegesis) territory — named as the composition vehicle, not built here.

## Naming within the dialectical scheme

User-facing: **Decompose** ("Split it"). Formal family: the collection-preserving
form of **Diairesis** — cutting at the natural joints (κατ' ἄρθρα, *Phaedrus*
265e) into multiple kinds — distinct from Narrow's single-branch
specialization-Diairesis. Periagoge is fundamentally a Synagoge (collection)
protocol; Decompose is its Diairesis recovery: un-collecting an over-collected one
back into its natural many.

## Companion-surface scope

The runtime-normative move set lives in `periagoge/skills/induce/SKILL.md` alone.
Surfaces examined and deliberately left unchanged:

- `docs/analysis/periagoge-calibrative-induction-morphism.md` — a dated writeup of
  a *different* change whose thesis ("keep `CrystallizedAbstraction` as the only
  convergence object") is specific to that change; injecting Decompose would
  distort it.
- `epistemic-cooperative/skills/onboard/references/scenarios.md` — beginner-facing
  tutorial covering the core forward moves; a recovery move would not aid intro.
- `epistemic-cooperative/skills/{realign,steer}/SKILL.md` — Periagoge-family
  specializations on *constitutively-fixed* instance axes (three named horizons;
  one session's calibration moves) where Decompose is structurally inapplicable;
  their explicit closed six-move enumerations stay true.
- `epistemic-cooperative/skills/catalog/SKILL.md` — one-line description, no move
  enumeration.
- No per-protocol `graph.json` exists under `periagoge/` — the COMPOSITION block's
  `graph.json` reference self-voids.
