# Report format

What `report` prints, how each number is defined, the order the falsifier clauses are read in,
and what a result can and cannot be used to claim. Read this before quoting any number from a
run.

## Where results go

A result is an observation of one run: a model version, a CLI version, a day. It goes into the
pull request body that the run informs, and into the commit message of the change it justifies,
where it stays attached to the moment it was true. It never goes onto a state surface — a README,
an `AGENTS.md`, a `SKILL.md`, this file — as a standing claim, because nothing re-runs it there
and it would keep asserting an old reading after the models and the protocol have moved. A
surface may say that this eval exists and what it measures; it does not say what it found.

The run's records (`results/<run>/`) are gitignored for the same reason: they belong to whoever
ran them, not to the checkout.

## Per-cell table

One row per cell, grouped by model, then variant, then arm:

| column | definition |
|---|---|
| cell | `<variant>-r<rep>-<arm>` |
| integrity | `ok` when every turn passed the treatment check (`references/runbook.md` §Integrity and isolation); `FAILED` otherwise |
| stopped at turn 1 | whether the first turn left the tree as scaffolded — the protocol arm handing back before any code |
| Qs explicit/items | `q_explicit` / `q_items_total` from the cell's notes |
| A turns | subject turns in phase A, up to and including the first implementation |
| first | checklist passes at snapshot A: automatic verdicts plus the manual items |
| B turns | subject turns from the phase-B message on |
| B files/lines | files changed between snapshot A and the final snapshot, and lines added plus removed |
| rework files/lines | the same, outside the case's test prefix (`tests/`); the rework measure |
| final | checklist passes at the final snapshot |
| cost | Claude: session cost in USD (the last result event's running total); Codex: input/cached/output/reasoning tokens, the last turn's running total |
| wall s | subject wall-clock seconds summed over turns |
| path flags | commands that named another cell, the records, the repository, or a parent directory (`path-audit.json`) |

Lines are counted by a minimal line diff, so the count is the same on every platform. GNU
`diff`'s default heuristic can report more lines for the same pair of trees; a number from
another tool is not comparable with one from this runner.

## Per-arm means

After each group's rows comes one mean row per (variant, arm), over the cells whose integrity
held — a failed cell is never averaged. It carries n, how many cells stopped at turn 1, and the
means of Qs, A turns, first, B turns, B lines, rework, final, total cost (USD, or total input
tokens) and wall seconds.

Costs are compared within a runner only. Dollars and tokens do not convert into one another, and
a Codex run under login authentication reports no dollars at all.

## Falsifier clauses

The claim under test is that the protocol reduces rework on the underspecified variant. For each
model, the protocol arm's means are compared with the bare arm's, and the clauses are read in
this order; the first that holds is the verdict:

1. **`no-reduction`** — mean rework on the protocol arm is not lower than on the bare arm.
2. **`unfinished-work`** — rework is lower, but the protocol arm ended less finished: its mean
   final score is below the bare arm's, or one of its cells reached snapshot A without an
   implementation. Less rework on less work is not a reduction.
3. **`greater-total-cost`** — rework is lower and the work finished, but the protocol arm's mean
   total cost is higher. The reduction was bought, not saved.
4. **`not-falsified`** — none of the above: rework fell, the work finished, and the session cost
   no more.

`incomplete` is reported instead when an arm has no cell whose integrity held.

The verdict carries only what its clause states. `greater-total-cost` is a finding in its own
right — rework fell at a higher session cost — and is reported with both numbers, not rounded up
to a reduction or down to no effect. `not-falsified` means these cells did not refute the claim;
it is not a confirmation.

## Guardrail

The fully specified variant has nothing for the protocol to find. Its table reports, per model,
the protocol arm's questions, first and final scores and total cost beside the bare arm's. A
question on this variant is a question the specification already answered; any count above zero
is over-asking, and a write-up quotes those questions from the cells' notes.

## What may and may not be claimed

May be claimed, with the scope stated each time:

- what happened in these cells: the verdict per model, with n per arm, the case, the model and
  effort, the runner and its CLI version, and the date;
- the mechanism a transcript shows — for example that protocol cells stopped before code and
  took their first implementation from the user's answers — quoted from the cells' notes.

May not be claimed:

- **significance or effect size.** With a handful of cells per arm there is no test behind a
  difference; report means and the per-cell rows, and say that no test was run.
- **generality across tasks.** One case pair is one task. A verdict holds for that task.
- **what real users would do.** The user side is a scripted oracle holding a fixed
  specification; a person would answer differently and sometimes change their mind.
- **a model ranking.** Runners differ in how the protocol can be realized
  (`references/runbook.md` §Host realization); a difference between runners can be the host,
  not the model.
- **anything from a cell whose integrity failed**, and nothing from a flagged cell before its
  `path-audit.json` has been read.

## Integrity failures

A failed cell is listed under Integrity with its reasons and left out of every mean and verdict.
It is not re-scored, patched, or replaced silently: `reset` the cell and walk it again, and say
in the report's text that the cell was re-run and why. An arm left with no passing cell makes its
model's verdict `incomplete`. Path-audit flags do not fail a cell; read the flagged commands, and
where one reached another cell's work or records, the cell is contaminated: `reset` it, walk it
again, and say so.
