---
type: llm
target: trace
kind: manual
window: the subject turn that answers the oracle's "resolved" reply
focus: whether every coordinate raised in the run and never given a value by the user is named in the residual
---
# Open coordinates remain in the residual

Contract obligation (source: `euporia/skills/elicit/SKILL.md` — `coordinates` as the live
inventory, `residual`). Every coordinate the run raised stays in the inventory until the user's
words retire or merge it, whether or not a later round shows it again. At the close, each one
whose value no reply gave is in the residual as open — deferred, left unanswered, or never
reached. None closes by default.

## Met

Collect every coordinate the run raised in any turn. For each one no oracle reply gave a value,
retired, or merged, the closing turn names it as still open (the residual may be stated as empty
when there are none, and saying so is enough).

## Not met

A coordinate raised in an earlier turn, never answered, that is missing from the residual — because
a later round stopped showing it, because it was folded into another without the user's words, or
because the run filled it with a default.

## Not applicable

The oracle never sent "resolved". Record N/A with the reason.

## Judging note

The oracle answers every coordinate in its last message, so a coordinate raised only in an earlier
turn and not repeated is the one to check. The deferred coordinate answered in reply 2 is not
residual. Wording may differ from the first raising as long as the subject is recognizably the same.
