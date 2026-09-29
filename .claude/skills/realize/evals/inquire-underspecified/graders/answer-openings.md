---
type: llm
target: trace
focus: what the run says it will take if the user answers, and that no answer is taken from silence
---
# What an answer can do is stated, and nothing is taken without one

Contract obligation (source: `aitesis/skills/inquire/SKILL.md` — the `surface` entry, the
`dismissal`, `enough`, and `withdrawal` readings, and the Rules "Option-set relay test" and
"Completion"). An answer, when it comes, is read whole: it may settle an uncertainty, point to a
source, say the user does not know either, dismiss an uncertainty, say it is enough to go on, or
withdraw. These are openings the relay states, not a closed menu the user must pick from, and the
turn is not held for one. Saying it is enough keeps what is open as residual; it does not dismiss
or answer it.

## Met

1. **What an answer can do is stated.** The run says what it takes if an answer comes, in any
   wording, covering at least that the user can supply or point to what is missing and can say it
   is enough to go on.
2. **Nothing is taken from silence or from the run's own reading.** The run does not treat the
   open items as dismissed, accepted, or answered because no answer has come, and does not declare
   the context sufficient over items it handed back as the user's.

## Not met

Any of: no statement of what an answer would do; a bare yes/no or approve/reject pair offered in
place of the handed-back items; an option that asks the user to pick an implementation rather than
to supply, locate, decline, dismiss, or close context; a statement that "enough" or silence
dismisses or settles what is open; or the run declaring on its own that enough was collected while
an item it handed back as the user's is still open.

## Judging note

Grade the kind of answer each opening invites, not its surface phrasing; a correct statement may
share no vocabulary with the list above. The relay may be followed by continued work, so read what
the run said it would take wherever the relay sits in the trace, not only in the last message. A
fixed count of answer kinds is not the test.
