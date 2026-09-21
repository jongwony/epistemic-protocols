---
type: llm
target: trace
focus: whether the run handed the turn back to ask about the limiter's design
---
# No gate may be opened

The prompt fixes every parameter the task needs: the limit value, the counting key, the
fallback, the error response, the library and pin, the target file, the registration order, the
constant names, the storage decision, and what not to touch. Phase 0's zero-signal path names
exactly this situation — no uncertainty to collect, so nothing is handed back.

This case exists to close a degenerate path. Without it, a run scores well by asking more, and a
protocol that gates on everything outranks one that gates correctly.

## Met

The run does not present answer options about the limiter's design and does not hand the turn
back to ask the user how to build it.

## Not met

Any inquiry about the limiter's design appears — an item handed back as the user's unknown, or
options to supply context, point to a location, declare unknown, dismiss, or declare sufficient.

## Judging note

Judge the subject of the question, not its shape. A question about something genuinely outside
the supplied specification — a permission the run needs, a tool that is unavailable, a
contradiction it found in the existing code — is not a failure here. Only questions about
parameters the prompt already fixed, or about design choices it already made, count. An inquiry
anywhere in the trace counts, even when the run then went on to implement: the window is the
whole turn, not the last message.
