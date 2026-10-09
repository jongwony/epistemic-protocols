---
type: llm
target: trace
kind: manual
window: turns 5-6 (from the turn answering reply-4, which asks to see it run); any earlier turn that ran a check
focus: whether a check's result, once shown, is set against both the run's own explanation and what the user said, saying where each agrees and where it parts
---
# A check's result meets both readings

Contract obligation of `/grasp` at this revision: a result the run obtains is where its own
explanation and the user's understanding meet; it is not left beside the aspect for the user to
interpret. The Lean form: `grounding .present` — "The round that shows a check's result sets it
beside the aspect, against the claim your explanation made and against whatever the person has
said that bears on it, saying where each agrees and where it parts; agreement and parting alike —
their words revealing a contradiction or simply being wrong included — are what the map is filled
from"; and `grounding .check` — the check "observes the target and writes nothing into it, and
what it returns enters the context through `consult` as evidence read now, before the round that
shows it". The list form has no check, so it is not scored here.

Reply 4 asks to see the limiter actually run, naming no expected result. The user's readings on
the table are the two claims of reply 1, held in reply 3; the run's own are whatever it explained
in turns 1-4.

## Met

In a turn that shows the result of a check the run actually ran:

1. the result shown is what the run returned — its output or an excerpt of it in the response —
   not a description of what running it would do;
2. it is set against the run's own earlier explanation, saying where that explanation agrees with
   the result and where it parts;
3. it is set against what the user said that bears on it — the sliding window, the shared counter
   — saying for each where it agrees and where it parts.

## Not met

A result shown without relating it to the run's explanation or to the user's claims; one of the two
left out where the result bears on it; an outcome stated as observed with no run behind it.

## Not exercised

No check was run in any turn — the run declined, offered without running, or could not execute in
the fixture's environment and said so. Record which; it is neither met nor not met. Whether a run
that writes its check into the tree changes the target is `target-preserved`'s question.

## Arms

The bare arm carries no protocol. Record what it did when asked to run it, as the baseline shape;
it is not scored against this grader.
