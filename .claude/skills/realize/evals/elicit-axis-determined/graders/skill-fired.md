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

It matters more here than in the trigger-positive case. Without it, a run that never loaded the
protocol and simply implemented the change passes every other grader in this case: the correct
behaviour and the protocol's absence are outwardly identical when the correct behaviour is "open
no gate". This line is what separates them. Match the invoked skill's identity, not the tool.
