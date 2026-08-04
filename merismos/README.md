# Merismos (μερισμός) — /apportion

> [한국어](./README_ko.md)

Apportion an autonomous goal into coarse execution units and derive each unit's completion conditions before the run begins.

## Type Signature

```
(GoalPlanUncompiled, User, APPORTION, AutonomousGoal × ExecutionHorizon) → ConditionBearingUnitPlan
```

## What It Does

Merismos is a stateless plan compiler with two halves. It reads the goal's obligations and cuts them into coarse units at seams it can cite — a dependency edge, a deliverable boundary, a verification point, an ownership change — judging each unit against one execution horizon. Then it derives each unit's conditions: a completion predicate (the unit achieved its result) plus any invariant predicates (the run preserved a boundary while achieving it), keeping the conditions whose subject is the whole goal at plan level rather than distributing them across units. It emits one goal entry per unit carrying that unit's resolution certificate — the conditions conjoined into a single leaf predicate where a completion condition was derivable, an accepted-completion witness plus any invariant conjuncts where none was — for a downstream completion-predicate enforcer (on Claude Code: `/goal`). Obligations that can only be guarded by pre-action interception are declared out of scope and delegated to the harness substrate.

The emitted plan is deliberately **pre-conduct**: it carries unit boundaries and conditions only. Order, independence, reconciliation, termination topology and routing remain `/conduct`'s.

**Core principles**: Apportion over Order · Coverage over Convenience · Fit over Ambition · Declared Seam over Asserted Joint. Nothing of Merismos survives into the execution interval.

## When It Activates

- User calls `/apportion` (user-initiated only) for a goal an autonomous run is intended for, when that goal is not yet carried by units each bearing its own settled completion condition

## The Two Hard Invariants

| Invariant | What it prevents |
|-----------|------------------|
| **Coverage** — every goal obligation belongs to some unit, is visibly delegated out of scope, or is accepted as uncovered on record | Every emitted leaf passing while an original obligation belongs to no unit — the plan converging locally and lying globally |
| **Fit** — every unit fits one execution horizon, or carries an override the user recorded | A unit overflowing the very interval that is supposed to enforce it, recreating the false-completion and context-compaction failures the unit boundary exists to prevent |

Seam quality is **not** an invariant. A cut cites the seam it sits on, or declares itself heuristic — an abstract goal may carry no evidenced joint, and asserting one anyway would be false precision. The declaration makes the judgment visible instead of certifying a joint that isn't there.

## The Join Rule

One unit is one execution interval is one entry, with that unit's conditions conjoined into a single leaf predicate. Per-condition entries would duplicate the unit's execution identity; a cartesian product does the same more explicitly. Predicate kind (`completion` / `invariant`) is retained on each conjunct so provenance stays readable even though enforcement conjoins them. Conditions whose subject is the whole goal — final integration, global non-regression, whole-goal acceptance — stay plan-level and carry a plan-state requirement stating when it becomes safe to discharge them: a property of plan state alone, never a named unit or order-position, since naming an order fact is `/conduct`'s axis, not this protocol's.

## Composition

`/bound` upstream narrows both halves: which seams are candidate cuts, and which conditions the units are subject to. The `/conduct` relationship is two-way and guarded — a multi-unit plan flows into `/conduct` when the units' arrangement is non-trivial, and a `/conduct` activation that reaches an unresolved autonomous region hands that region back for apportionment. Both edges are advisory and carry a no-reentry guard, so the pair is non-recursive: a conducted plan's unit predicates become conduct's stated termination grounds for its goal-met regions — a region stopping on rounds or a dry ceiling carries a coverage limit instead — and do not route back, and an already-conducted region's topology is fixed input this protocol does not re-conduct. A single unit bypasses `/conduct` entirely, as does a unit set whose conduct is trivial across all five of its axes — order, independence, reconciliation, termination and routing — not ordering alone.

`/apportion` does not invoke `/goal` — emission is its epistemic endpoint, and starting the autonomous interval is the user's separate act. Concrete executor selection stays outside: units carry capability requirements, never a binding. `/contextualize` and `/grasp` verify after the interval.

## Known Limitations

- **Bounded platform claim**: the `/goal` leaf-executor characterization is verified against Claude Code v2.1.140 only; re-verify on harness version change.
- **Obligation reading is heuristic**: an obligation never uttered and never captured upstream will not be read, so coverage is hard only over what *was* read; the confirmation gate is the correction point.
- **Seam evidence is often absent**: abstract goals frequently supply no evidenced joint, and heuristic cuts can leave duplicated setup or cross-unit state leakage.
- **Horizon fit is an estimate**: judged before the run from the goal's description; the override path exists because the user often knows better.
- **Predicate coverage**: subjective quality bars do not derive; they surface as residuals, not prose conditions.
- **No execution-time protection**: compile-time only — pre-action risks belong entirely to the harness substrate.

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install merismos@epistemic-protocols
```

## Usage

```
/apportion [your goal]    # Cut the goal into units and derive each unit's completion conditions
```

## License

MIT
