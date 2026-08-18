---
type: tool_used
tool: Edit
max: 0
target: trace
---
# The run must not edit existing files either

Companion to `no-write`. Wiring a limiter into `app/main.py` would arrive as an edit rather than
a write, so both channels are closed off before the gate. Same reasoning: `Edit` is granted in
`allowed_tools` so that its non-use is evidence rather than an artefact of the sandbox.
