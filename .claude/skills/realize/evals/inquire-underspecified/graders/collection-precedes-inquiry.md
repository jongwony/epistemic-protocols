---
type: llm
target: trace
focus: whether evidence collection occurred before the first user-facing inquiry
---
# Context collection must precede inquiry

Rule 5 declares the transition order: context collection, classification, then inquiry. Tool
existence alone cannot establish that ordering because the same run may ask first and read later.

## Met

The first user-facing request for missing context occurs only after the run has inspected the
available substrate and used that evidence to determine what deficit remains.

## Not met

The run asks the user for context before collection, or a later read is the only evidence offered
for a question that had already been surfaced.

## Scope

Judge only the transition order. The breadth or quality of the investigation is outside this
grader except where no evidence was collected before the inquiry at all.
