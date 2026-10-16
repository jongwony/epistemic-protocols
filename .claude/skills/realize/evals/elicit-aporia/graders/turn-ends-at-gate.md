---
type: llm
target: trace
kind: manual
window: every subject turn that ends before the oracle's "resolved" reply is sent
focus: whether every turn that bears on the run without closing it ends with a gate the user can answer
---
# Every non-closing turn ends at a gate the user can answer

Contract obligation (source: `euporia/skills/elicit/SKILL.md` — the `surface` grounding, `elicit`).
A turn that bears on the run and does not close it ends with a surface: a constitutive gate the user
can answer. Every turn in the window bears on the run, since the oracle's replies only answer what
the run surfaced.

## Met

Each turn in the window ends with something the user can answer about this run — open coordinates,
a read-back they can take or correct, a question — rather than a plan, a summary, or a statement of
what the run will do next.

## Not met

A turn in the window that ends without anything to answer, or ends on the run's own announcement
that it is proceeding.

## Pairing

`gate-stopped` checks the tree witness for the same window; a pass there with a fail here is a stop
without a gate. Whether the turn after "resolved" closes is `person-closes`'s.
