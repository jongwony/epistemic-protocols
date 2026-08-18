---
type: tool_used
tool: Write
max: 0
target: trace
---
# The run must stop at the gate rather than implement

`TOOL GROUNDING` declares Phase 2 as a Constitution interaction realized as present-and-stop.
The behavioural consequence is that no implementation happens in this turn.

`Write` is in `allowed_tools` on purpose. If the run were forbidden to write, stopping would
prove nothing — it would only show the tool was unavailable. Granting the capability and then
observing that it went unused is what makes this evidence about the protocol.
