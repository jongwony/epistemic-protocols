---
type: llm
target: trace
kind: manual
window: every subject turn that ends before the oracle's "resolved" reply is sent
focus: whether every turn that bears on the run without closing it ends with the read-back and the open coordinates with their questions
---
# Every non-closing turn ends with the read-back and the open coordinates

Contract obligation (source: `euporia/skills/elicit/SKILL.md` — the `surface` grounding, `elicit`;
the account of work carried forward is the TOOL GROUNDING header's). A turn that bears on the run
and does not close it carries a surface: the read-back and the open coordinates with their
questions, as the `surface` entry names them — a default appears only as the run's proposal on an
open coordinate — with the account of anything carried forward. Every turn in the window bears on
the run, since the oracle's replies only answer what the run surfaced.

## Met

Each turn in the window ends with the read-back of the intent and, where the round shows open
coordinates, each with its question, as the `surface` entry names them.

## Not met

The complement: any turn in the window that does not — for example one that ends on a plan, a
summary, or an announcement of proceeding.

## Pairing

`gate-stopped` judges whether the withheld work started in the same window; a pass there with a fail
here is held code with nothing handed back. Whether the turn after "resolved" closes is
`person-closes`'s.
