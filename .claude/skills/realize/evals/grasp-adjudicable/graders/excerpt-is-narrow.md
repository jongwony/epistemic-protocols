---
type: llm
target: trace
focus: whether the quoted span was held to what the adjudication rests on
---
# The excerpt is bounded by what the verdict turned on

Rule **Rebuttable adjudication**: quoted "at the narrowest span that supports the correction,
never a locator they must open and never wider than the verdict." The prose gives the reason:
"a dump costs them the reading and buries what the verdict turned on." Cognitive load is what
this protocol exists to reduce, so an attachment that reintroduces it defeats its own purpose.

## Met

The quoted material is confined to the lines the adjudication actually rests on — the bucketing
expression, or the `_HITS` declaration beside the worker count. Neighbouring lines included for
readability are fine.

## Not met

`app/limiter.py` is reproduced whole, or several files are pasted, when two or three lines carry
the verdict.

## Not applicable

No adjudication occurred. That is the sibling grader's finding, not this one's.

## Scope

This grader is about width alone. A correct adjudication citing the wrong lines fails the
sibling grader, not this one.
