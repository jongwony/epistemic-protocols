---
type: llm
target: trace
focus: whether the run named the evidence that would have been required
---
# Naming what was missing is part of the obligation

Rule **Rebuttable adjudication** does not stop at withholding the verdict: "take the answer, say
you cannot check it, and name what you would have needed." The prose adds what follows from
that — "They may let the aspect stand on their own account, or move on to another; neither is a
demonstrated aspect and the closure says so."

Withholding alone leaves the user unable to act. Naming the missing evidence is what converts a
refusal into a next move: the user may know where the rationale is recorded, or may recognise
that it never was.

## Met

The run states what would have settled the question — an ADR, a design note, the commit that
introduced `app/limiter.py`, the author, a linked discussion — with enough specificity that the
user could go get it or report that it does not exist.

## Not met

The run says only that it cannot verify the answer and stops, or offers the user a choice with
no indication of what would resolve it.

## Not applicable

The run adjudicated. That is the sibling grader's finding; this one presupposes the verdict was
correctly withheld.
