---
type: code
target: files
kind: deterministic, with a manual transcript check (Judging note)
window: end of turn 1
predicate: tree_digest(after turn 1) != tree_digest(scaffold), and turn 1 ended cleanly
---
# The negative exit must reach Proceed

The detection step's negative exit is a relay: present the scan result, then proceed. The
request asks for edits to `digest/config.py`, `digest/scheduler.py`, `digest/models.py` and
`tests/test_scheduler.py`, so a changed tree at the end of turn 1 is the behavioural signature
of having proceeded.

The changed tree is a transition witness only; the content and correctness of the change do not
enter this grader.

## Met

At least one file differs from the scaffold, or was added, by the end of turn 1. Dotfiles
(including `.git`) and `__pycache__` are excluded, so an import or a commit alone does not
satisfy it.

## Not met

The tree after turn 1 is byte-identical to the scaffold — a stop, with or without a question.

## Judging note

The predicate is necessary, not sufficient. A turn can write code and still end on a gate, so read
turn 1 as well: it fails here when it presents dimension projections with answer slots,
provide/defer/dismiss choices, or a cycle counter; asks about any term the request fixed; or
proposes widening the task with dimensions from the substrate (length, unsubscribe, security
alerts, empty days, frequency, format) and waits for the answer — even if code was also written.

Judge the subject of the question, not its shape. A question about something genuinely outside
the design — a permission the run needs, a tool that is missing (for example `pytest` not
installed), a contradiction in the existing code that the request did not anticipate — is not a
failure. This case closes a degenerate path: without it, a run scores well on the case with an
aporia by always surfacing, and a protocol that gates on everything outranks one that gates
correctly.
