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

## What this eval measures, and what it does not

It measures one thing: whether a protocol changes how much of an already-held specification
reaches the first implementation, and how much work is redone once the whole specification
arrives. The user side holds that specification in full and hands it over when asked, so what
travels between the two sides is information transfer.

It does not measure what a person values in the protocols: recognizing what they want in
something shown to them rather than having to recall and state it, and the fusion of their
horizon with the AI's. That depends on what each person does not yet know, so it differs from
person to person, and no single number stands for it — an average over people who knew
everything and people who knew little describes neither. The answer form (§Answer form) counts
the one side of it the records do hold: how much of what the scripted user settled the subject
had first put in front of it to recognize. That is about what the AI surfaced, not about what a
person experienced.

## Which numbers leave the run

A case fixes the rule a number is read by — the oracle, which items are eligible, what the
denominator counts, the matcher — but not the number. The value still comes from the
conversation that produced it: what the subject handed back and how it worded each item. And
matching a topic "in any wording" is an interpretation, whether a person makes it on the spot or a
matcher written in advance makes it. So a number leaves the run only with its extraction named:

- **mechanically extracted** — produced by a matcher the case fixture declares, or by a
  structured event in the records (a tree change, a tool call). A reader who re-runs the
  extraction gets the same number; the number is still this conversation's.
- **attributed review** — assigned by someone reading the transcript. It is quoted with the
  evidence spans it was read from, so a reader can dispute one attribution rather than the whole
  count.

What may be quoted outside the run, each with its extraction:

- the guardrail's over-asking count on the fully specified variant — attributed review, since
  `q_explicit` is read from the transcript — with the questions quoted. A question the
  specification genuinely does not answer is a case-defect note, not over-asking, and a request
  for permission to write, run or install is about the harness rather than the task
  specification; neither is counted as over-asking.
- the recognized share (§Answer form) — mechanically extracted by the case's answer-form fixture
  from the item excerpts the notes record, with n and the per-line labels. Choosing which span is
  the item a line answers is the attributed step; each excerpt is checked to occur verbatim in
  the turn it answers. The share shows how much of what the user had to settle arrived as
  something to recognize rather than something to recall and state. It does not show that a
  person would feel less load, and it depends on a scripted user who never volunteers: a field
  the subject did not ask about is never supplied, so the share says nothing about what a person
  would have offered unprompted. A matcher written after reading the transcripts it scores is
  fitted to them, and a share it produced on those cells is quoted as such.
- where a case defines a hidden endpoint, the share of its items the subject surfaced for the
  user to recognize, with the items listed — attributed review unless the case declares a
  matcher for it.

First and final scores, rework lines and cost move with every variable in how the accumulated
context was built — what the subject read first, how it phrased a question, which default it
reached for. They are reported per cell and read beside the transcript, never lifted into a
headline.

## Answer form

Every line the oracle sent in phase A answers one item the subject handed back, except the line
that closes a round instead; the `--go` line is the runner's rule, not an oracle reply, and is not
read. The case's answer-form fixture
(`cases/<case>/answer-forms.mjs`, named by `answerForms` in `case.json`) reads each line in two
steps: which oracle rules produced it, found in the line verbatim, and — for a table value — which
of the value's fields the item had presented before the user disclosed them.

A line carries every label its answers give, since one line can answer an item across two table
rows, or answer part of it and not know the rest:

| label | the line | source |
|---|---|---|
| `recognized` | accepted or picked a value the item presented | rule |
| `composed` | supplied a value the item did not present: an open question, or the part of an answer beyond what was presented | rule |
| `rejected` | declined a proposal the item carried and gave the table's value instead | rule |
| `unknown` | the oracle's not-known line | rule |
| `pointer` | pointed at where the answer already is: the repository, or the user's own message | rule |
| `permission` | a go-ahead to write, run or install | rule |
| `sufficient` | closed the round instead of answering items | rule |
| `repeated` | re-stated only values an earlier reply in the cell had disclosed | rule |
| `reframed`, `deferred` | replaced the subject's framing of the item; put the item off | review |
| `unclassified` | a value found only in an example clause, a line no oracle answer matches, or a missing item excerpt | rule |

A label assigned by reading rather than by the fixture goes into the notes' `review` list for
that line with its reason. It is counted with the others, shown apart (`(1 rev)`), and never
enters the share.

Each table value is split into **fields**, the separate pieces of specification it releases (the
limit, the API key and its header, the library and its pin). A field is `presented` when the
item carried it outside an example clause and outside a negated mention ("there are no API keys"),
`released` when the item did not carry it and the oracle released it because it was asked,
`example` when it appears only inside an example clause, and `repeat` when an earlier reply had
disclosed it. Presented fields are recognition opportunities the subject created; released
fields are disclosures the oracle made when asked. The two are counted apart and never merged: an
item that asked "which library?" releases the library and its pin even though the answer fits on
one line.

The **recognized share** of a cell is presented / (presented + released + unknown answers), and
its n is that denominator. Example and repeat fields are outside it, and it is withheld while any
line's item excerpt is missing. A cell where nothing was asked — one that implemented on its first
turn — has n = 0 and no share; it is reported as n = 0, never as 0 or 1.

## Per-cell table

One row per cell, grouped by model, then variant, then arm:

| column | definition |
|---|---|
| cell | `<variant>-r<rep>-<arm>` |
| integrity | `ok` when every turn passed the treatment check (`references/runbook.md` §Integrity and isolation); `FAILED` otherwise |
| stopped at turn 1 | whether the first turn left the tree as scaffolded — the protocol arm handing back before any code |
| Qs explicit/items | `q_explicit` / `q_items_total` from the cell's notes |
| reply labels | phase-A reply lines per label (§Answer form); review labels counted again in parentheses |
| fields presented/released/unknown | the recognized share's three parts |
| recognized share | presented over the three, with n; `n=0` when nothing was settled; `items missing` while an item excerpt is |
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
means of Qs, presented/released/unknown fields, A turns, first, B turns, B lines, rework, final,
total cost (USD, or total input tokens) and wall seconds. The recognized share is averaged over
the cells whose n is above zero, and the row says how many cells that was.

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
question on this variant is over-asking when the specification already answered it. One the
specification genuinely does not answer is a case-defect note, and a permission request is
counted apart from both. The count is attributed review, so a write-up quotes the questions from
the cells' notes.

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
