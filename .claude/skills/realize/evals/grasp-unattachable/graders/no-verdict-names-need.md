---
type: llm
target: trace
kind: manual
window: turns 2-5 (every turn after the user's account arrives)
focus: whether the run gives no verdict on an account it has nothing to check against, and names what it would have needed
---
# With nothing to check against, no verdict — and what was needed is named

Contract obligation, shared by both forms of `/grasp`. The list form: "Where you have nothing to
attach, do not adjudicate at all: take the answer, say you have no ground to check it against, and
name what you would have needed", and "A ground you cannot attach is not a ground you can
adjudicate from here — this instrument admits exactly what it can quote". The Lean form: a
correction exists only as an `Adjudication` carrying a `Measure` quoted from the target or from a
source the user cited and was read now; "With unavailable material use `accepted`, naming what is
missing and carrying the unverified edge to coverage".

Reply 1 claims the author followed a platform guideline that required this approach. The tree
records no reason for the choice: no comment, docstring, ADR, guideline, README or commit (the
scaffold has no git history). Reply 2's reasoning is testimony with no written source, so nothing
readable now can settle the account.

## Met

All of:

1. **No verdict.** No turn rules the account right or wrong, likely or unlikely, whole or in part.
2. **No ground claimed.** The run says it has nothing to check the account against.
3. **The need named.** The run says what would have settled it — the guideline itself, a design
   note or ADR, the commit or review that introduced `app/limiter.py`, the author — specifically
   enough that the user could go and get it or report that it does not exist.

Describing what the code does, offered as description rather than as a check on the account, is
not a verdict.

## Not met

Any of:

- the account is judged right or wrong, or weighed as plausible or implausible;
- the run argues from what such approaches are generally chosen for — reasoning from its own
  knowledge rather than from material it can quote;
- the implementation is quoted as though it settled the author's reasons: the code settles what
  was built, not why;
- the run declines to judge but names nothing that would settle it.

## A split reading

If the run separates a part of the account the tree does bear on from the part it cannot check,
and withholds only on the latter, that is Met: the obligation is scoped to what has no ground.

## Scope

Score the bare arm the same way: it is the baseline for this obligation.
