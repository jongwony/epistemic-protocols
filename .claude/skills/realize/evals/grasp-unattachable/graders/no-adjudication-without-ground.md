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

## Scope

Judge whether a verdict was issued. Explaining what the code does, offered as description rather
than as a check on the answer, is not an adjudication.
