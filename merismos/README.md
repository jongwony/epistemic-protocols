# /apportion — Merismos (μερισμός)
<a name="merismos-μερισμός--apportion"></a>

> [한국어](./README_ko.md)

## What is /apportion?

### Definition

Merismos comes from the Greek μερισμός, meaning apportionment or dividing into parts. Before an autonomous run begins, it splits your goal into units on a single plan sheet — each with its completion checks, accepted gaps, and items held for your judgment — and shows the permissions the unattended run will reach.

<a name="when-it-activates"></a>
### The problem

When you hand a goal straight to an autonomous run without breaking it down first, a stretch of work can overflow a single run, a passing check can hide a judgment that still needed you, or an original requirement can fall through the cracks. Reach for `/apportion` when you are about to hand a goal to an autonomous run, or want it planned for one, and no plan yet says which units the work runs in or when each unit is done.

### The result

Once you take the plan, it is saved to a durable location with a pointer block and handed to the autonomous run (such as `/goal` in Claude Code, or via the pointer block if you start the run yourself or arrange the units first with `/conduct`). Accepting the plan authorizes the permissions shown. You leave with a plan you can call yours: what needed your decision before the run is settled, and the plan tells the runner to run work that does not depend on you without waiting and return all unit results together at the end alongside anything held back for your judgment.

<a name="install"></a>
## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install merismos@epistemic-protocols
```

<a name="usage"></a>
## Usage

Type:

```
/apportion [your goal]    # Cut the goal into units and derive each unit's completion conditions
```

The AI reads what your goal requires, splits it into units estimated to fit one stretch of an autonomous run (which you can override in your own words), and shows the whole plan on a single sheet. For each unit, the sheet lists the checks that show it is done or kept its boundaries, any vague requirement sharpened into a check for you to accept, any gap you accept as uncovered, and any item held open for your judgment. Whole-goal checks stay at the plan level, and because the run happens without you, the sheet also lists the permissions the run will reach — by kind, target, and limit — alongside any AI doubts.

You adjust the sheet in your own words on any turn and take it when it fits.

<a name="type-signature"></a>
<a name="what-it-does"></a>
<a name="the-two-hard-invariants"></a>
<a name="the-join-rule"></a>
<a name="the-handoff"></a>
<a name="composition"></a>
<a name="known-limitations"></a>
<a name="license"></a>
<details>
<summary>How the plan is compiled, its invariants, and known limitations</summary>

### Name and Type Signature

**Merismos** (μερισμός: apportionment):

```
(GoalPlanUncompiled, User, APPORTION, AutonomousGoal × ExecutionHorizon) → ConditionBearingUnitPlan
```

### What It Does

Merismos is a stateless plan compiler with two halves:
1. It reads the goal's obligations and cuts them into coarse units at seams it can cite — a dependency edge, a deliverable boundary, a verification point, an ownership change — judging each unit against one execution horizon.
2. It derives each unit's conditions: a completion predicate (the unit achieved its result) plus any invariant predicates (the run preserved a boundary while achieving it), keeping whole-goal conditions at plan level.

Each unit carries one certificate holding every compiled check, every gap accepted as uncovered, and every item reserved for a later judgment together, so a passing check never stands for a done that a reserved judgment still awaits. Obligations that can only be guarded by pre-action interception are declared out of scope and delegated to the harness substrate. The emitted plan settles units, conditions, authority, doubts, and handoff obligations; order, independence, reconciliation, and termination topology are not settled here.

**Core principles**: Apportion over Order · Coverage over Convenience · Fit over Ambition · Declared Seam over Asserted Joint · Handoff carries its obligations. Nothing of Merismos survives into the execution interval.

### The Two Hard Invariants

| Invariant | What it prevents |
|-----------|------------------|
| **Coverage** — every goal obligation belongs to some unit (compiled, accepted as uncovered, or reserved there) or is visibly delegated out of scope | Every emitted check passing while an original obligation belongs to no unit — the plan converging locally and lying globally |
| **Fit** — every unit fits one execution horizon, or you took it over its fit verdict in your own words | A unit overflowing the interval meant to enforce it, recreating false-completion and context-compaction failures |

Seam quality is **not** an invariant. A cut cites the seam it sits on, or declares itself heuristic so judgment stays visible instead of asserting a joint that isn't there.

### The Join Rule, Handoff, and Composition

- **Join Rule**: One unit is one execution interval and one entry carrying that unit's whole certificate, retaining predicate kind (`completion` / `invariant`) on each condition. Whole-goal conditions (final integration, global non-regression, whole-goal acceptance) stay plan-level with a plan-state requirement stating when they are safe to discharge — a property of plan state alone, never a named unit or order position.
- **Handoff (`handoffObligations`)**: Every taken plan carries obligations for every run of it: work that does not rest on you runs without waiting; the run returns once with every unit's result; irreversible steps touched by a carried doubt or new evidence wait and return with what did not proceed because of them.
- **Composition**: The taken plan leaves as session text and a navigation block over its carrier so later work (`/conduct`, issue trackers, another session) reads it by pointer. Units carry capability requirements, never an executor binding.

### Known Limitations

- **Unverified platform claim**: Starting `/goal` automatically on the taking turn is not verified on any Claude Code version; where it cannot, the navigation block is the handoff and you start the run.
- **Obligation reading is heuristic**: Unuttered obligations not captured upstream will not be read. Obligations are re-read on every turn that bears on the run, so stating a missing one on the sheet adds it.
- **Seam evidence is often absent**: Abstract goals often lack evidenced joints; heuristic cuts can leave duplicated setup or cross-unit state leakage.
- **Horizon fit is an estimate**: Judged before the run from the goal's description; you can override it in your own words.
- **Predicate coverage**: Subjective quality bars do not compile into checks. Where sharpening could still produce a check, the draft proposes it and the gap stands only if you decline it; where a judgment rather than a check settles the item, it is reserved instead. Checks the run could alter to pass are flagged on the sheet.
- **Keeping the handoff is the run's**: Once handed off, Merismos has ended; honoring handoff obligations belongs to the run, and pre-action interception belongs to the harness substrate.

License: MIT

</details>
