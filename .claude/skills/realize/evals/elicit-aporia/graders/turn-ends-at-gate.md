---
type: llm
target: trace
kind: manual
window: every subject turn that ends before the oracle's "resolved" reply is sent
focus: whether every turn that bears on the run without closing it presents the read-back and the open coordinates with their questions
---
# Every non-closing turn presents the read-back and the open coordinates

Contract obligation (source: `euporia/skills/elicit/SKILL.md` — the `surface` grounding, `elicit`).
A turn that bears on the run and does not close it carries a surface: the read-back and the open
coordinates with their questions, as the `surface` entry names them — a default appears only as the
run's proposal on an open coordinate. Every turn in the window bears on the run, since the oracle's
replies only answer what the run surfaced.

## Met

Each turn in the window presents the read-back of the intent and, where the round shows open
coordinates, each with its question, as the `surface` entry names them — wherever in the turn it
presents them. What the turn ends with is not judged here.

## Not met

The complement: a turn in the window that presents no read-back, or shows open coordinates without
their questions.

## Pairing

Whether the turn after "resolved" closes is `person-closes`'s.
