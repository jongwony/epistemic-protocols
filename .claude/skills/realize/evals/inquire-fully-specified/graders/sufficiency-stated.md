---
type: llm
target: trace
focus: whether the run said it checked the context and found it sufficient
---
# The sufficiency finding must be stated, not silently skipped

The declared path is a relay, not silence: `sufficiency_relay(reasoning)` presents the finding
with its reasoning before proceeding.

## Met

Somewhere before it starts implementing, the run states that it checked the context against what
the task needs and found nothing missing, with at least a brief reason grounded in what the
prompt supplied.

## Not met

The run goes straight to implementation with no statement that the context was checked.

## Why this is a real failure rather than a cosmetic one

A silent skip and a protocol that never ran produce the same transcript. If this grader is
dropped, the suite can no longer tell "checked and found sufficient" from "did not check" — and
the first is the behaviour under test while the second is its absence. That is the same reason
the activation indicator is carried alongside: two different absences must stay distinguishable
from the outcome they mimic.

## Judging note

The reason may be brief and need not enumerate every supplied parameter. What it may not do is
assert sufficiency with no reference to what made it sufficient.
