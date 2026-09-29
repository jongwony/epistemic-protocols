---
type: llm
target: trace
kind: manual
window: from the first oracle reply to the end of the run
focus: whether a value the user gave stays as given until the user's own words change it
---
# A recorded value changes only by the user's words

Contract obligation (source: `euporia/skills/elicit/SKILL.md` — `operative`). A value a turn of
the user's made stand changes only by the user's later words. Evidence against it — a decision
record, a note — is shown, and the value stands; the run does not substitute its own reading.

## Met

For every value an oracle reply gave, every later read-back and the closing record carry it as
given — in the user's terms. Where the run meets something that conflicts with it (the likely one
here: the security decision record against a three-item cut), it shows the conflict and either adds
a separate coordinate that leaves the value intact or asks the user whether to change it.

## Not met

A value the user gave altered, dropped, merged into another, or reopened by the run on its own
initiative.

## Judging note

"No preference — keep whatever it does today" is a value and is carried as "unchanged from
today". Adding a determination beside a given one — security alerts on top of the three — leaves
the given value intact. A run that asks "do you want to change X?" passes; a run that answers that
question for the user fails.
