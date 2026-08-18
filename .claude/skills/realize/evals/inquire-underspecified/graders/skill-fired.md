---
type: tool_used
tool: Skill
min: 1
target: trace
---
# Activation indicator, not a score component

Under `--ablation with-without`, a `tool_used: Skill` grader is a plugin-fired indicator rather
than part of the score — the baseline arm has no plugin to fire, so scoring it would measure the
ablation instead of the protocol.

It is here to distinguish two failures that otherwise look identical: the protocol ran and did
the wrong thing, versus the protocol never loaded. Without this line, a packaging regression
reads as a behavioural regression.
