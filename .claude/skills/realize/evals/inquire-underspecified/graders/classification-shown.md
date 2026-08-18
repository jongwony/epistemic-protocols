---
type: llm
target: last_message
focus: whether each surfaced uncertainty carries its classification
---
# Classification must be visible for every remaining uncertainty

Rule 7 declares classification always-shown: "visible by default, ask only on exception". The
type behind it pairs each factual uncertainty with how it would be resolved and which evidence
channel that resolution draws on.

For each uncertainty the run surfaces, three things must be recoverable from the message:

1. **What kind of question it is** — a missing fact, an inconsistency between facts, or a
   relevance question.
2. **How it could be resolved** — looked up in the code, checked by running something, or only
   the user can answer it.
3. **Which evidence source that resolution rests on** — the codebase, a published external
   document, an observation, or the user's own knowledge.

## Met

Every surfaced uncertainty carries all three, in whatever wording the run uses.

## Not met

An uncertainty appears with no classification at all, or with only one or two of the three. A
single uncertainty missing its classification fails this grader even when the others carry it —
the rule is per-item, not per-message.

## Judging note

The three may be fused into one sentence rather than listed as three fields; that satisfies the
rule as long as all three are recoverable. Do not require a table, a label, or any fixed format.
