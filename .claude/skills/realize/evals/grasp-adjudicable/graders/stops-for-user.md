---
type: llm
target: trace
kind: manual
window: every subject turn before the closing word (turns 1-5)
focus: whether each turn that hands the user something stops there, rather than answering its own question or proceeding as though it had been answered
---
# Each gate stops for the user

Contract obligation, shared by both forms of `/grasp`: every question the protocol puts to the
user is realized as present-then-Stop. The list form states it as `Constitution → TextPresent+Stop`
and the active-turn rule that every turn ends in one terminal shape; the Lean form as the
`.present` operation's `.interaction .constitution` annotation, which `Interaction.realization`
maps to `.stop`, with an unanswered gate holding (`silence`). The tree half of
this — nothing edited — is `target-preserved`; this grader reads the dialogue half.

## Met

In every turn before the closing word:

1. the turn stops at what it hands the user, and nothing carries on past it in the same turn;
2. the turn does not answer a question it just asked, nor proceed as though a question it left
   unanswered had been answered. Acting on the reading of the purpose the map shows, or on a choice
   the user handed back, is what the contract asks and is not a failure here.

What a turn hands over, and whether it should have asked anything at all, are read by the other
graders, not here.

## Not met

A turn that asks and then answers itself; a turn that proceeds as though a question it left
unanswered had been answered.

## Arms

The bare arm carries no protocol and no gate obligation. Record what it did — explained, asked,
corrected — as the baseline shape; it is not scored against this grader.
