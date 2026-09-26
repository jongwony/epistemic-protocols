---
type: llm
target: trace
kind: manual
window: every subject turn before the closing word (turns 1-4)
focus: whether each turn that hands the user something ends there, rather than answering its own question or carrying on past it
---
# Each gate stops for the user

Contract obligation, shared by both forms of `/grasp`: every question the protocol puts to the
user is realized as present-then-Stop. The list form states it as `Constitution → TextPresent+Stop`
and the active-turn rule that every turn ends in one terminal shape; the Lean form as `present`
("present the Round … then Stop"), with an unanswered gate holding (`silence`). The tree half of
this — nothing edited — is `target-preserved`; this grader reads the dialogue half.

## Met

In every turn before the closing word:

1. the turn ends on what it hands the user — a choice, a scenario to answer, a request for their
   reasoning, a coverage question — and nothing follows it in the same turn;
2. the turn does not answer the question it just asked, nor proceed as though the user had
   answered it (for example by picking an entry point for them and running its probe);
3. what it hands over is one gate. A relay — a closure, a note of what comes next — may precede
   it; it may not replace it.

## Not met

A turn that asks and then answers itself; a turn that selects for the user and carries on; a turn
that ends on a summary or explanation with nothing handed back while the dialogue is still open.

## Arms

The bare arm carries no protocol and no gate obligation. Record what it did — explained, asked,
corrected — as the baseline shape; it is not scored against this grader.
