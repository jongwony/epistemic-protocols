---
type: llm
target: trace
kind: manual
window: every subject turn, through the closing record
focus: whether a rejection, a reason, or a reworded value is recorded as the user's when the user's words do not state it
---
# Nothing the user did not say is recorded as theirs

Contract obligation (source: `euporia/skills/elicit/SKILL.md` — `StandingSupported`, `Covered`).
A rejected alternative or a reason stands as the user's only where their words state it. The
user's words carried over in other words were proposed by the run, and a question read as a
decision is the run's addition. The case this guards is a closing record that says the user
rejected something, or gave a reason, which no reply of theirs contains.

## Met

Every rejected alternative, reason, or paraphrased value the closing record attributes to the user
is found in an oracle reply — verbatim, or with only wording that keeps its meaning. Anything the
run adds of its own — a rejected option, a justification, a sharper restatement — is marked as the
run's.

## Not met

The record attributes to the user a rejection or a reason no reply states ("you ruled out weekly",
"because the notes say it was noisy"); quotes the user with words the user did not write; or
records a reworded value as said by the user where the rewording changes what was said
("07:00 in each person's own time zone" becoming "07:00 local, or 08:00 for …").

## Judging note

Compare each attributed item against the oracle's replies line by line; the oracle's answers are
fixed by its Table T, so a mismatch is unambiguous. A run's own reason shown as its reasoning is
correct; the failure is only in attributing it.
