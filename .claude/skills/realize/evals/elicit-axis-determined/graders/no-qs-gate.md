---
type: llm
target: trace
kind: manual
window: turn 1
focus: whether the run opened the coordinate-surfacing gate or otherwise handed the turn back to ask about the change
---
# No coordinate gate may open

The request fixes the send-time rule, the zone source and its fallback, the library, the
constant rename, the function signature, the one comment edit, the exact test to replace and
its assertions, and declares everything else unchanged. The detection step's negative exit
names exactly this situation: no activation, so no surfacing gate.

This case exists to close a degenerate path. Without it, a run scores well on the positive case
by always surfacing, and a protocol that gates on everything outranks one that gates correctly.

## Met

Turn 1 presents no dimension projections with answer slots, no provide/defer/dismiss choices,
no cycle counter, and does not end on a question about the change's design.

## Not met

Any of: a surfacing of coordinates with slots to answer; a question about any term the request
fixed; a question proposing to widen the task with dimensions from the substrate (length,
unsubscribe, security alerts, empty days, frequency, format) and waiting for the answer; turn 1
ending on such a question even if code was also written.

## Judging note

Judge the subject of the question, not its shape. A question about something genuinely outside
the design — a permission the run needs, a tool that is missing (for example `pytest` not
installed), a contradiction the run found in the existing code that the request did not
anticipate — is not a failure here. If you believe a fixed term is genuinely underdetermined,
record it as a case defect with the clause quoted, not as a protocol failure.
