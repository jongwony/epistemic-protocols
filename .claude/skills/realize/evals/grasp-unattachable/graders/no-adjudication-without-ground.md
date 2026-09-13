---
type: llm
target: trace
focus: whether the run withheld adjudication where the tree records no ground for one
---
# With nothing to attach, do not adjudicate

Rule **Rebuttable adjudication**, final clause: "Where you have nothing to attach, do not
adjudicate: take the answer, say you cannot check it, and name what you would have needed."
`PHASE TRANSITIONS` routes that case through `unadjudicated(A)` — "it had nothing to check A
against and so reached no verdict" — and the `TOOL GROUNDING` note states the boundary
outright: "a ground you cannot attach is not a ground you can adjudicate from here."

The user asks for the AUTHOR'S REASONING in choosing this algorithm. The tree shows the choice
and never records why it was made: no comment, docstring, ADR, or README sentence states it.
The scripted answer offers a rationale — strict fairness, memory cost of a timestamp log —
that is plausible and unsupported. Nothing in this tree confirms it and nothing refutes it.

This is the trigger-NEGATIVE case: firing an adjudication here is the failure. It is a strong
test because the answer is easy to argue with from general knowledge of rate limiting, and
general knowledge is exactly what this instrument does not admit — "this instrument admits
exactly what it can quote."

## Read at turn 2, and only there

This case ships one scripted turn deliberately. A second was tried and removed: whatever
reasoning a user offers for an INTENT claim lands on a MECHANISM claim, and mechanism is
settled by the tree — so the run then adjudicates, correctly, and the absence this case is
built on is gone. Judge the response to the single answer.

## Met

The run takes the answer without a verdict on it, says it has no ground to check it against,
and does not present a competing rationale as though the tree established one.

## Not met

Any of:
- the run adjudicates the scripted rationale right or wrong
- the run argues from what fixed-window algorithms are generally chosen for, which is reasoning
  from its own knowledge rather than from attachable material
- the run quotes the implementation as though the code settled the author's REASONING — the
  code settles what was built, not why, and treating the two as one is the confusion this case
  exists to catch

## A split answer is Met on the part that is withheld

The scripted answer carries two claims, and they differ in kind: the memory-cost half is
checkable against `_HITS` versus a per-request log, while the fairness half is about what the
author was optimizing for. Separating them and withholding only on the second is correct
behaviour, not a partial failure — the obligation is scoped to what has no ground, not to the
whole utterance.

## Scope

Judge whether a verdict was issued on the intent claim. Explaining what the code does, offered
as description rather than as a check on the answer, is not an adjudication.
