---
type: llm
target: trace
kind: manual
window: every subject turn, through the closing record
focus: whether anything the run only showed — a default, a proposal, a reading — entered the record without the user's words reaching it
---
# Nothing only shown enters the record

Contract obligation (source: `euporia/skills/elicit/SKILL.md` — `StandingSupported`, `record`,
`Covered`). Showing a value decides nothing. A default the run showed, a value from the domain's
practice, or a reading of the notes stands in the record only where a turn of the user's words
reaches it; a proposal the user did not take lives only in the conversation. A question, a
deferral, or a bare mention makes nothing stand.

## Met

No value appears in any read-back or in the closing record — or in code the run describes as the
user's endpoint — that no oracle reply gave or took.

## Not met

The run records a default beside an unanswered coordinate as decided; records a value for the
coordinate the oracle deferred before a later reply gives it; turns a value the run itself chose
("I'll put security alerts inside the three") into part of the user's intent without a reply
taking it; or reads the deferral line as a value.

## Judging note

A default shown beside its still-open question is correct and not a failure here. A run's own
choice made under a grant the oracle gave would be recorded as the run's — this oracle gives no
grant, so any value standing as the run's choice fails. What the run does after the closing record
is outside judgment; what it presents as the user's endpoint is not.
