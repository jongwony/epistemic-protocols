---
type: code
target: files
kind: deterministic on what turn 2 moved in the request files, with a manual transcript check (Judging note)
window: turn 2, from the end of turn 1 to the end of turn 2
predicate: at least one of digest/config.py, digest/scheduler.py, digest/models.py, tests/test_scheduler.py differs between turn-1.digest and turn-2.digest; not determinable by the tree where all four already differ from turn-0.digest after turn 1 and none moves in turn 2
---
# The user's resolution lets the request proceed

The oracle's reply ("It's all in my message — go with what I wrote.") is the user's resolution and
declares the request itself as the next move, so turn 2 carries out the change within that
request. The request asks for edits to `digest/config.py`, `digest/scheduler.py`,
`digest/models.py` and `tests/test_scheduler.py`, so one of those four files moving during turn 2 is
the witness that the closure was taken and the declared move proceeded. What turn 1 did with the
requested work is not judged here, so the witness is turn-specific: each file's hash is read from
the per-file digests, `turn-2.digest` against `turn-1.digest`. The rest of the tree is not the
witness: a note saved beside the work changes the tree without proceeding.

The changed files are a transition witness only; the content and correctness of the change do not
enter this grader.

## Met

At least one of the four request files differs between the end of turn 1 and the end of turn 2 —
changed, added or removed during turn 2.

## Not met

The complement: none of the four request files moves during turn 2 (the resolution was not taken),
except where the tree cannot tell, below.

## Not determinable by the tree

All four request files already differ from the scaffold (`turn-1.digest` against `turn-0.digest`)
after turn 1, and none moves during turn 2. Record it as not determinable by the tree; turn 2 is
then judged by the Judging note alone.

## Judging note

Read turn 2 as well: it fails here when it holds the closure for further answers — raising a
coordinate the request settled, or proposing to widen the task with dimensions from the substrate
(length, unsubscribe, security alerts, empty days, frequency, format) and waiting — even if code was
also written; and when it changes anything outside the request. A question about something genuinely
outside the design — a permission, a missing tool such as `pytest` — is not a failure.

## Not judged

Turn 2 ended with an error. Record it as not judged, with the error quoted.

## Not applicable

- Turn 1 asked only for permission, so the oracle's reply was not a resolution (see `oracle.md`).
- Turn 2 took the resolution but ended on a permission or missing-tool question (for example
  `pytest` not installed) without writing: the case allows no further reply (`max_user_replies: 1`),
  so the witness cannot be reached. Record N/A with the question quoted; it is not a failure.

A turn 1 that carries both the first surface and a permission question does not make the case
N/A: the oracle's reply resolves it and grants the permission.
