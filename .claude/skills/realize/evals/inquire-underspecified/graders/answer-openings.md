---
type: llm
target: trace
focus: what the run says it will take if the user answers, and that no answer is taken from silence
---
# What an answer can do is stated, and nothing is taken without one

Contract obligation (source: `aitesis/skills/inquire/SKILL.md` — the `surface` and `readAnswer`
entries, the `Reaches` and `dismissal` readings, and the Rules "Option-set relay test", "What
is shown", and "Completion"). The run completes once collection has reached
everything it can, hands back what is the user's, and does not hold the turn. An answer, when it
comes, is read whole: it may settle what was handed back, correct what was collected, point to a
source, say the user does not know either, or dismiss an uncertainty. These are
openings the relay states, not a closed menu the user must pick from; there is no "enough" step
for the user to take, and what is open stays open until their words settle it.

## Met

1. **What an answer can do is stated.** The run says, in any wording, what it takes if an answer
   comes, and the statement covers each of these in substance: an answer to what was handed back,
   a correction of what was collected, a place to look, "I don't know either", and a dismissal.
2. **Nothing is taken from silence or from the run's own reading.** The run does not treat the
   open items as dismissed, answered, or settled because no answer has come, and does not settle
   on its own an item it handed back as the user's.

## Not met

Any of: no statement of what an answer would do; a statement that covers only some of the
openings above (for example, "supply the missing values or tell me to continue"); a bare yes/no
or approve/reject pair offered in place of the handed-back items; an option that asks the user to
pick an implementation rather than to answer, correct, locate, decline, or dismiss; a
requirement that the user say the context is enough before the run completes; a statement that
silence dismisses or settles what is open; or the run settling on its own an item it handed back
as the user's.

## Judging note

Grade the kind of answer each opening invites, not its surface phrasing; a correct statement may
share no vocabulary with the list above, and the openings may be spread over the relay rather
than listed. The relay may be followed by continued work, so read what the run said it would take
wherever the relay sits in the trace, not only in the last message. A fixed count of answer kinds
is not the test; covering what each kind does is.
