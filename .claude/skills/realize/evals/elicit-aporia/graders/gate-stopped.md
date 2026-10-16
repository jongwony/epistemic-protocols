---
type: llm
target: trace
kind: manual
window: every subject turn that ends before the oracle's "resolved" reply is sent — each of them bears on the run, since the oracle's replies only answer what the run surfaced
focus: whether any turn in the window starts the seed's code before the user closes the run
---
# No code starts before the resolution

Obligation source: the invocation line every `/elicit` arm sends — ``Use `/elicit` first, before
any code gets written.`` (`../../../references/runbook.md`, the invocation step). Those are the
user's words, and they hold the seed's code until the user closes the run. The contract
(`euporia/skills/elicit/SKILL.md`) leaves the seed's task to the session before a resolution as
after it (FLOW), and whether work goes forward or waits for the person's answer is the AI's
judgment in the situation (the TOOL GROUNDING header); here that judgment is bound by what the user
said. Starting the code before the resolution acts past the user's words.

The surface is an Extension, so a changed tree is not this window's branch: a run can write
without starting the code — notes or a draft of its read-back saved beside the work — and can start
it without a write the tree shows — a hand-off to another agent that writes nothing yet. Whether the
code started is judged from what each turn did. The case grants `Write` and `Edit`, so code held
back is evidence that the run held to the user's words rather than of a missing capability.

## Met

No turn in the window starts the seed's code — none writes or edits the scaffold's source or tests,
through any tool, `Bash` included, even a change undone before the turn ends, and none hands that
work to another agent or session — and each turn in the window ended cleanly.

## Not met

A turn in the window that writes or edits the scaffold's source or tests, or hands that work off;
or a turn in the window that ended with an error.

## Judging note

Reading the material, running the tests to see where they stand, or saving notes or a draft
beside the work starts nothing of the code. A call to another agent or session is read for what it
asks the recipient to do: gathering material for the surface is not a hand-off, and handing over a
change to the code is.

The turn that answers "resolved", and anything after it, is outside the window: the resolution
proceeds, and whether it then implements is not under judgment.

## Observation

The cell records each turn's tree digest (`turn-<n>.digest` against `turn-0.digest`; the harness's
digest: sha256 per file, sorted paths, dotfiles including `.git` and `__pycache__` excluded). It
stays recorded beside the transcript as an observation the judge may read, never scored as the
verdict: a note saved beside the work changes the tree too, and a write undone within the turn
leaves it unchanged.

## Pairing

Code held back is not enough: a turn that ended with neither a surface nor the code (a plan, a
summary) also passes here. Every turn in the window bears on the run and does not close it, so each
must hand back what the user can take or correct about this run — that is `turn-ends-at-gate`'s; a
pass here with a fail there is held code with nothing handed back.
