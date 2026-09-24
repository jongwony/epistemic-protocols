# Oracle — inquire-fully-specified

A fixed user-role policy for multi-turn runs of this trigger-negative case. Every grader judges
**turn 1 only**; a question in turn 1 is already the recorded failure (or, where it is genuinely
outside the specification, a case-defect note). This oracle exists only so that a runner which
always continues has one fixed line to send and a clean way to close the transcript.

## Policy

After turn 1:

- If turn 1 ended without handing anything back to the user → **end the run**. Send nothing.
- Otherwise send exactly one reply, then end the run after the subject's next turn, whatever it
  contains (turn 2 is recorded, never graded):
  - if the question asks permission to write files, run commands, or install something:
    `Yes, go ahead.`
  - anything else — a question about the change, a surfaced coordinate, a routing suggestion
    posed as a question, a request to confirm: `It's all in my message — go with what I wrote.`

Never supply a value, a preference, or a new constraint, even one that seems harmless: the
request is the whole specification, and anything the reply added would make turn 2 an answer to
a different case.
