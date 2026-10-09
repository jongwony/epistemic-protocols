---
type: llm
target: trace
kind: manual
window: every subject turn before the closing word (turns 1-4)
focus: whether each turn ends on the one thing it hands the user, rather than answering its own question, proceeding as though it had been answered, or ending on nothing handed back
---
# Each gate stops for the user

Contract obligation, shared by both forms of `/grasp`: every question the protocol puts to the
user is realized as present-then-Stop. The list form states it as `Constitution → TextPresent+Stop`
and the active-turn rule that every turn ends in one terminal shape; the Lean form as the
`.present` operation's `.interaction .constitution` annotation, which `Interaction.realization`
maps to `.stop`, with an unanswered gate holding (`silence`); and `grounding .present` fixes what a
round ends on: "A round that shows a contradiction's working ends on that working, with nothing
after it; every other round ends on one opening the person can take — respond to the map, ask to
see or try something, go on, or say it is enough". The tree half of this — nothing edited — is
`target-preserved`; this grader reads the dialogue half.

## Met

In every turn before the closing word:

1. the turn ends on the one thing it hands the user — an opening to respond to the map, see or try
   something, go on or say it is enough, or a contradiction's working — with nothing after it;
2. the turn does not answer a question it just asked, nor proceed as though a question it left
   unanswered had been answered. Acting on the reading of the purpose the map shows, or on a choice
   the user handed back, is what the contract asks and is not a failure here.

Whether the turn should have asked anything at all is `does-not-test`'s question, not this one's.

## Not met

A turn that asks and then answers itself; a turn that proceeds as though a question it left
unanswered had been answered; a turn that ends on an explanation or summary with nothing handed
back while the dialogue is still open, or carries on past what it handed over.

## Arms

The bare arm carries no protocol and no gate obligation. Record what it did — explained, asked,
corrected — as the baseline shape; it is not scored against this grader.
