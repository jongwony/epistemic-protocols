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

It matters more here than in the open-intent case. A run that never loaded the protocol and asked
one clarifying question before implementing can look much like a first surface followed by the
user's resolution; this line is what separates them. Match the invoked skill's identity, not the
tool.
