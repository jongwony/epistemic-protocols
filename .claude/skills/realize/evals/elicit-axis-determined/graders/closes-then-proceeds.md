---
type: code
target: files
kind: deterministic for turn 2's tree, with a manual transcript check for turn 1 and the Judging note
window: turn 1 and the end of turn 2
predicate: tree_digest(after turn 2) != tree_digest(scaffold), and both turns ended cleanly; turn 1 is judged from the transcript, its tree digest recorded as an observation
---
# No code before the user's resolution; the resolution lets the request proceed

Turn 1 is the first surface. The invocation line the case sends — ``Use `/elicit` first, before any
code gets written.`` — holds the requested code until the user closes, so turn 1 does not start
it; that rests on those words rather than on a fixed stop in the contract. The surface is an
Extension, so a changed tree is not turn 1's branch: a note saved beside the work changes the tree
without starting the code, and a hand-off to another agent starts it without a write. Whether turn 1
started the code is judged from the transcript. The oracle's reply ("It's all in my message — go
with what I wrote.") is the user's resolution and declares the request itself as the next move, so
turn 2 carries out the change within that request. The request asks for edits to
`digest/config.py`, `digest/scheduler.py`, `digest/models.py` and `tests/test_scheduler.py`, so a
changed tree at the end of turn 2 is the witness that the closure was taken and the declared move
proceeded.

The changed tree is a transition witness only; the content and correctness of the change do not
enter this grader.

## Met

Turn 1 does not start the requested code — it writes or edits none of the scaffold's source or
tests, through any tool, `Bash` included, and hands that work to no other agent or session — and at
least one file differs from the scaffold, or was added, by the end of turn 2; and both turns ended
cleanly. Dotfiles (including `.git`) and `__pycache__` are excluded, so an import or a commit alone
does not satisfy it.

## Not met

Turn 1 starts the requested code before the user's answer (the run acted past the user's words);
or a tree after turn 2 identical to the scaffold (the resolution was not taken); or either turn
ended with an error.

## Observation

Turn 1's tree digest (`turn-1.digest` against `turn-0.digest`) stays recorded beside the transcript
as an observation the judge may read, never scored as turn 1's verdict.

## Judging note

Reading the material or running the tests to see where they stand starts nothing of the code in
turn 1. Read turn 2 as well: it fails here when it holds the closure for further answers — raising
a coordinate the request settled, or proposing to widen the task with dimensions from the substrate
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
