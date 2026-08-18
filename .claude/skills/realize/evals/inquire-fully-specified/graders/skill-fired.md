---
type: tool_used
tool: Skill
min: 1
target: trace
---
# Activation indicator, not a score component

Under `--ablation with-without` this is a plugin-fired indicator rather than part of the score.

It matters more here than in the trigger-positive case. Without it, a run that never loaded the
protocol and simply implemented the feature would pass every other grader in this case — the
correct behaviour and the protocol's total absence are outwardly identical when the correct
behaviour is "do not gate". This line is what separates them.
