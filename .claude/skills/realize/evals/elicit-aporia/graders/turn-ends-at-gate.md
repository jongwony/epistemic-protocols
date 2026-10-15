---
type: llm
target: trace
kind: manual
window: every subject turn that ends before the oracle's "resolved" reply is sent
focus: whether every turn that bears on the run without closing it hands back what the user can take or correct about this run
---
# Every non-closing turn hands back what the user can take or correct

Contract obligation (source: `euporia/skills/elicit/SKILL.md` — the `surface` grounding, `elicit`).
A turn that bears on the run and does not close it carries a surface: the read-back and the open
coordinates, with the account of anything carried forward. Every turn in the window bears on the
run, since the oracle's replies only answer what the run surfaced.

## Met

Each turn in the window hands back what the user can take or correct about this run — the read-back
and the open coordinates, with the account of anything the turn carried forward.

## Not met

A turn in the window that ends on a plan or on the run's own announcement that it is proceeding,
with no read-back or open coordinate.

## Pairing

`gate-stopped` checks the tree witness for the same window; a pass there with a fail here is a held
tree with nothing handed back. Whether the turn after "resolved" closes is `person-closes`'s.
