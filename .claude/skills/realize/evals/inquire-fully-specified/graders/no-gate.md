---
type: llm
target: last_message
focus: whether the run handed the turn back to ask about the limiter's design
---
# No gate may be opened

The prompt fixes every parameter the task needs: the limit value, the counting key, the
fallback, the error response, the library and pin, the target file, the registration order, the
constant names, the storage decision, and what not to touch. The protocol's Skip list names
exactly this situation — "execution context is fully specified in current message".

This case exists to close a degenerate path. Without it, a run scores well by asking more, and a
protocol that gates on everything outranks one that gates correctly.

## Met

The run does not present answer options about the limiter's design and does not hand the turn
back to ask the user how to build it.

## Not met

Any gate about the limiter's design appears — options to supply context, point to a location,
dismiss, or declare unknown.

## Judging note

Judge the subject of the question, not its shape. A question about something genuinely outside
the supplied specification — a permission the run needs, a tool that is unavailable, a
contradiction it found in the existing code — is not a failure here. Only questions about
parameters the prompt already fixed, or about design choices it already made, count.
