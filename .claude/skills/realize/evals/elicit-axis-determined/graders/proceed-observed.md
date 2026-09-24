---
type: code
target: files
kind: deterministic
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

The tree after turn 1 is byte-identical to the scaffold. Read with `no-qs-gate`: an unchanged
tree after a gate-free turn is a stop without a question, still a failed Proceed.
