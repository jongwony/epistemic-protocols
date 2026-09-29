# Oracle — elicit-axis-determined

A fixed user-role policy for this fully-specified case. The invoked run opens on a first surface
(turn 1); the one reply below is the user saying at once that the intent, as that surface shows it,
is aligned — a resolution — and turn 2 is what follows from it. Graders judge turns 1 and 2.

## Policy

After turn 1:

- If turn 1 ended without handing anything back to the user → **end the run**. Send nothing.
- Otherwise send exactly one reply, then end the run after the subject's next turn, whatever it
  contains (turn 2 is graded for what follows the closure):
  - if the question asks permission to write files, run commands, or install something:
    `Yes, go ahead.`
  - anything else — a first surface, a question about the change, a request to confirm:
    `It's all in my message — go with what I wrote.` This resolves the run and declares the
    request itself as the next move.

Never supply a value, a preference, or a new constraint, even one that seems harmless: the
request is the whole specification, and anything the reply added would make turn 2 an answer to
a different case. A permission reply does not resolve the run: if turn 1 asked only for permission,
the run is recorded as not applicable for every grader except `skill-fired`.
