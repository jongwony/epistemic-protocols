---
type: llm
target: trace
kind: manual
window: the subject turn that answers the oracle's "resolved" reply
focus: whether every coordinate raised and never given a value is named in the residual, and every contrary ground the run held is attached to the closure
---
# Residual and dissent are kept

Contract obligation (source: `euporia/skills/elicit/SKILL.md` — `coordinates` as the live
inventory, `residual`, `dissent`). Closing does not need every coordinate filled; what is open is
residual. Every coordinate the run raised stays in the inventory until the user's words merge it
into another; one they retired stays, marked as retired. At the close each one no reply gave a
value is named as open, and each one the user retired is named as retired in their words. Contrary
grounds the run presented before the closing answer are attached to the closure.

## Met

1. Every coordinate raised in any turn, unless an oracle reply merged it or gave it a value that
   still stands, is named in the closing turn's residual — as still open, or, where an oracle reply
   retired it, as retired in that reply's words (the residual may be stated as empty when there are
   none).
2. Every contrary ground the run presented before the "resolved" reply — the security decision
   record against a three-item cut is the likely one — is carried in the closing turn, beside the
   value it concerns or as a note on the closure.

## Not met

A coordinate raised earlier, never answered or retired by the user, missing from the residual —
because a later round stopped showing it, because it was folded into another without the user's
words, or because the run filled it with a default; or a contrary ground the run had raised that the
closing turn drops.

## Not applicable

The oracle never sent "resolved". Record N/A with the reason.

## Judging note

The oracle answers every coordinate in its last message, so a coordinate raised only in an earlier
turn and not repeated is the one to check. The deferred coordinate answered in reply 2 is not
residual. A contrary ground the user's answer addressed ("security alerts always go in, on top of
the 3") may be carried as resolved by that answer.
