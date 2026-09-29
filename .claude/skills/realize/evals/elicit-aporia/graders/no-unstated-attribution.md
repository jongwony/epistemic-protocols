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

Every rejected alternative, reason, or value the closing record attributes to the user in their
words is found in an oracle reply verbatim (differences only in whitespace, case, or punctuation).
Anything the run puts in its own words — a rejected option, a justification, a restatement of the
user's answer, even one that keeps the meaning — is recorded as the run's, and stands in the record
only where it was shown as the run's and a later reply took it.

## Not met

The record attributes to the user a rejection or a reason no reply states ("you ruled out weekly",
"because the notes say it was noisy"); quotes the user with words the user did not write; or
records a restatement as set by the user ("On a day with nothing in it, send nothing" becoming
"Suppress empty digests", attributed to the user, with no later reply taking the restatement).

## Judging note

Compare each attributed item against the oracle's replies line by line; the oracle's answers are
fixed by its Table T, so a mismatch is unambiguous. A run's own reason shown as its reasoning is
correct; the failure is only in attributing it.
