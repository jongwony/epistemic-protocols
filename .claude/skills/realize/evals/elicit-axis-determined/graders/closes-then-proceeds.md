---
type: code
target: files
kind: deterministic, with a manual transcript check (Judging note)
window: end of turn 1 and end of turn 2
predicate: tree_digest(after turn 1) == tree_digest(scaffold) and tree_digest(after turn 2) != tree_digest(scaffold), and both turns ended cleanly
---
# The first surface stops; the user's resolution lets the request proceed

Turn 1 is the first surface, a gate: nothing is written before the user answers. The oracle's reply
("It's all in my message — go with what I wrote.") is the user's resolution and declares the request
itself as the next move, so turn 2 carries out the change within that request. The request asks for
edits to `digest/config.py`, `digest/scheduler.py`, `digest/models.py` and `tests/test_scheduler.py`,
so a changed tree at the end of turn 2 is the witness that the closure was taken and the declared
move proceeded.

The changed tree is a transition witness only; the content and correctness of the change do not
enter this grader.

## Met

The tree after turn 1 equals the scaffold, and at least one file differs from the scaffold, or was
added, by the end of turn 2. Dotfiles (including `.git`) and `__pycache__` are excluded, so an
import or a commit alone does not satisfy it.

## Not met

A write in turn 1 (the run proceeded without the user's answer); or a tree after turn 2 identical to
the scaffold (the resolution was not taken).

## Judging note

Read turn 2 as well: it fails here when it holds the closure for further answers — raising a
coordinate the request settled, or proposing to widen the task with dimensions from the substrate
(length, unsubscribe, security alerts, empty days, frequency, format) and waiting — even if code was
also written; and when it changes anything outside the request. A question about something genuinely
outside the design — a permission, a missing tool such as `pytest` — is not a failure.

## Not applicable

- Turn 1 asked only for permission, so the oracle's reply was not a resolution (see `oracle.md`).
- Turn 2 took the resolution but ended on a permission or missing-tool question (for example
  `pytest` not installed) without writing: the case allows no further reply (`max_user_replies: 1`),
  so the tree witness cannot be reached. Record N/A with the question quoted; it is not a failure.

A turn 1 that carries both the first surface and a permission question is graded: the oracle's reply
resolves it and grants the permission.
