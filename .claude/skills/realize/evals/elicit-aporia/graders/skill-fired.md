---
type: tool_used
tool: Skill
min: 1
target: trace
kind: deterministic
window: turn 1
predicate: some Skill tool_use in turn 1 whose input.skill is "elicit" or ends with ":elicit"
---
# Activation indicator, not a score component

Under a with/without ablation this is a plugin-fired indicator rather than part of the score:
the baseline arm has no plugin to fire, so scoring it would measure the ablation instead of the
protocol. Match the invoked skill's identity, not the tool — built-in skills fire the `Skill`
tool in an arm with no plugins at all.

It separates two failures that otherwise read alike: the protocol ran and did the wrong thing,
versus the protocol never loaded. On runners whose trace has no skill-invocation event, report
`trace-unavailable` rather than inferring invocation from prose.
