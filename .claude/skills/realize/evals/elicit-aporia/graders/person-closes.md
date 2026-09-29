---
type: llm
target: trace
kind: manual
window: every subject turn
focus: whether the run closes only on the user's words — the oracle's "resolved" line — and never on filled coordinates or its own reading
---
# The user closes the run

Contract obligation (source: `euporia/skills/elicit/SKILL.md` — `ResolutionSupported`, `elicit`).
The run closes when the user says the intent is aligned enough; coordinates need not all be filled.
Filled coordinates, or the run's own reading, close nothing. The oracle's "resolved" line is that
closure.

## Met

1. Before the "resolved" line, no turn treats the run as closed: none announces the intent settled
   and proceeds to the endpoint, and none presents a closing record in place of a round the user can
   answer.
2. The turn after the "resolved" line treats the run as closed: it presents the closing record, and
   does not hold the closure hostage to a further round of questions.

## Not met

The run closes on its own — "every coordinate has an answer, so we're done", a closing record
followed by implementation — before the user's "resolved"; or after "resolved" it asks further
questions and withholds the closing record until they are answered.

## Judging note

A question the run asks after "resolved" alongside the closing record, as information the user may
take up, does not withhold closure. An unseen addition surfaced at that point is the record rule's —
it stays the run's proposal — and is graded by `adoption-valid`, not here.
