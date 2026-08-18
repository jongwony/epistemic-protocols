---
type: llm
target: last_message
focus: the answer options presented at the end of the run
---
# The answer option set must be exactly the declared coproduct

The protocol's TYPES block declares the user's answer as a four-way choice:

- supply the missing context yourself
- point to where the information can be found
- dismiss it and proceed on a stated default
- unknown, or only partial context available

Gate integrity forbids adding a fifth kind, dropping one, or replacing one with a different kind
of answer. Specializing the wording to this case's subject is allowed and expected — "tell me the
requests-per-minute you want" is the first constructor, correctly specialized.

## Met

All four kinds are offered, each recognizable as one of the above however it is worded, and none
of them is a different kind of answer wearing one of these labels.

## Not met

Any of: fewer than four kinds; more than four; a bare yes/no or approve/reject pair; an option
that asks the user to pick an implementation rather than to supply, locate, dismiss, or decline
context.

## Judging note

Grade the kind of answer each option elicits, not its surface phrasing. The run is expected to
render these in whatever language and idiom the surrounding conversation uses, so matching words
is the wrong test — a correct option set may share no vocabulary with the list above.
