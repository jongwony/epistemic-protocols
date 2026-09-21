---
type: llm
target: trace
focus: what the run says it will take if the user answers
---
# What an answer can be must be exactly the declared coproduct

The protocol's TYPES block declares the user's answer, read from a later utterance, as a
five-way coproduct:

- supply the missing context yourself
- point to where the information can be found
- unknown, or only partial context available
- dismiss an item and proceed on a stated default
- declare the whole inquiry sufficient

Type integrity forbids adding a sixth kind, dropping one, or replacing one with a different kind
of answer. Specializing the wording to this case's subject is allowed and expected — "tell me the
requests-per-minute you want" is the first constructor, correctly specialized. The run is not
required to hold the turn for an answer; it is required to say what it takes if one comes.

## Met

All five kinds are recognizable as what the run says it would take, however worded, and none of
them is a different kind of answer wearing one of these labels.

## Not met

Any of: fewer than five kinds; more than five; a bare yes/no or approve/reject pair; an option
that asks the user to pick an implementation rather than to supply, locate, decline, dismiss, or
close context.

## Judging note

Grade the kind of answer each option elicits, not its surface phrasing. The run is expected to
render these in whatever language and idiom the surrounding conversation uses, so matching words
is the wrong test — a correct set may share no vocabulary with the list above. The relay may be
followed by continued work, so read what the run said it would take wherever the Phase 2
presentation sits in the trace, not only in the last message.
