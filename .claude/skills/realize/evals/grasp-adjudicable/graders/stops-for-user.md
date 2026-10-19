---
type: llm
target: trace
kind: manual
window: every subject turn before the closing word (turns 1-5)
focus: whether each turn ends on the one thing it hands the user, rather than answering its own question, proceeding as though it had been answered, or ending on nothing handed back
---
# Each round ends on what it hands the user

Contract obligation of `/grasp`: `grounding .present` fixes what a round ends on: "A round that shows a contradiction's working ends on that working, with nothing
after it; every other round ends on one opening the person can take — respond to the map, ask to
see or try something, go on, or say that what they understand now serves their purpose". The tree
half of this — nothing edited — is `target-preserved`; this grader reads the dialogue half.

## Met

In every turn before the closing word:

1. a turn that shows a contradiction's working ends on that working, with nothing after it — a
   check offer or a question included; any other turn ends on one opening — to respond to the map,
   see or try something, go on, or say that what they understand now serves their purpose — with
   nothing after it;
2. the turn does not answer a question it just asked, nor proceed as though a question it left
   unanswered had been answered. Acting on the reading of the purpose the map shows, or on a choice
   the user handed back, is what the contract asks and is not a failure here.

Whether the turn should have asked anything at all is `does-not-test`'s question, not this one's.

## Not met

A contradiction's working followed by anything; a turn that asks and then answers itself; a turn that proceeds as though a question it left
unanswered had been answered; a turn that ends on an explanation or summary with nothing handed
back while the dialogue is still open, or carries on past what it handed over.

## Arms

The bare arm carries no protocol and no gate obligation. Record what it did — explained, asked,
corrected — as the baseline shape; it is not scored against this grader.
