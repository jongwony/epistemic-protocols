# Merismos (μερισμός) — /apportion

> [한국어](./README_ko.md)

Apportion an autonomous goal into coarse execution units and derive each unit's completion conditions before the run begins.

## Type Signature

```
(GoalPlanUncompiled, User, APPORTION, AutonomousGoal × ExecutionHorizon) → ConditionBearingUnitPlan
```

## What It Does

Merismos is a stateless plan compiler with two halves. It reads the goal's obligations and cuts them into coarse units at seams it can cite — a dependency edge, a deliverable boundary, a verification point, an ownership change — judging each unit against one execution horizon. Then it derives each unit's conditions: a completion predicate (the unit achieved its result) plus any invariant predicates (the run preserved a boundary while achieving it), keeping the conditions whose subject is the whole goal at plan level rather than distributing them across units. Each unit carries one certificate holding every compiled check, every gap accepted as uncovered, and every item reserved for a later judgment together, so a passing check never stands for a done that a reserved judgment still awaits. Where a vague obligation could become a check once sharpened, the draft proposes the sharper check for the user to take. Obligations that can only be guarded by pre-action interception are declared out of scope and delegated to the harness substrate.

Because the run will proceed without the user, the sheet also shows the authority the run will reach — each by kind, target, and limit — so the user settles it before leaving; the taking adopts it as shown, like every line of the sheet. The whole plan is shown on one sheet on every turn that bears on the run; the user corrects it in their own words and takes it. On the taking, the plan is parked in a durable carrier, a navigation block points to it, and the plan is handed to the autonomous run — on Claude Code, a completion-predicate executor such as `/goal`; where the session cannot start one, the block is the handoff and the user starts the run.

The emitted plan carries the units with their conditions, the authority, the doubts, and the run's obligations: order, independence, reconciliation and termination topology are not settled here.

**Core principles**: Apportion over Order · Coverage over Convenience · Fit over Ambition · Declared Seam over Asserted Joint · Handoff carries its obligations. Nothing of Merismos survives into the execution interval.

## When It Activates

- User calls `/apportion` (user-initiated only) for a goal an autonomous run is intended for, when that goal is not yet carried by units each bearing its own settled completion condition

## The Two Hard Invariants

| Invariant | What it prevents |
|-----------|------------------|
| **Coverage** — every goal obligation belongs to some unit — compiled, accepted as uncovered, or reserved there — or is visibly delegated out of scope | Every emitted check passing while an original obligation belongs to no unit — the plan converging locally and lying globally |
| **Fit** — every unit fits one execution horizon, or the user took it over its fit verdict in their own words | A unit overflowing the very interval that is supposed to enforce it, recreating the false-completion and context-compaction failures the unit boundary exists to prevent |

Seam quality is **not** an invariant. A cut cites the seam it sits on, or declares itself heuristic — an abstract goal may carry no evidenced joint, and asserting one anyway would be false precision. The declaration makes the judgment visible instead of certifying a joint that isn't there.

## The Join Rule

One unit is one execution interval is one entry, carrying that unit's whole certificate. Per-condition entries would duplicate the unit's execution identity; a cartesian product does the same more explicitly. Predicate kind (`completion` / `invariant`) is retained on each condition so provenance stays readable. Conditions whose subject is the whole goal — final integration, global non-regression, whole-goal acceptance — stay plan-level and carry a plan-state requirement stating when it becomes safe to discharge them: a property of plan state alone, never a named unit or order position.

## The Handoff

Every taken plan carries the obligations its run follows, wherever and whenever it is started — the contract's `handoffObligations`, the same handoff obligation `/conduct` carries for its substrate: what does not rest on the user runs without waiting for them; when the plan has run, the run returns once with every unit's result, and what rests on the user — an irreversible unit a carried doubt bears on among them — comes back in that return with what did not proceed because of it; nothing is decided for the user. A user who wants to arrange the units first — say, with `/conduct` — says so when taking the plan, and the navigation block becomes the handoff they start later.

## Composition

The taken plan leaves as session text and a navigation block over its carrier, so any later line of work — a method designed with `/conduct`, issues in a tracker, another session — reads it by pointer. Reading the block grounds the plan and starts nothing. Concrete executor selection stays outside: units carry capability requirements, never a binding. `/contextualize` and `/grasp` verify after the interval.

## Known Limitations

- **Unverified platform claim**: that a session can start `/goal` on the taking is not verified on any Claude Code version; where it cannot, the navigation block is the handoff and the user starts the run.
- **Obligation reading is heuristic**: an obligation never uttered and never captured upstream will not be read, so coverage is hard only over what *was* read. The sheet is where the omission becomes visible: obligations are re-read on every turn that bears on the run, so stating the missing one adds it to the plan.
- **Seam evidence is often absent**: abstract goals frequently supply no evidenced joint, and heuristic cuts can leave duplicated setup or cross-unit state leakage.
- **Horizon fit is an estimate**: judged before the run from the goal's description; the override path exists because the user often knows better.
- **Predicate coverage**: subjective quality bars do not derive. Where sharpening could still produce a predicate, the draft proposes it and the gap stands until the user takes it; where a judgment and not a check settles the item, it is reserved instead. A check the run could itself change so that it passes is flagged on the sheet.
- **The handoff is honored by the run**: once the plan is handed off, this protocol has ended; whether the run keeps the handoff obligations is the run's, and pre-action interception belongs to the harness substrate.

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
