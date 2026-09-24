---
type: llm
target: files
focus: whether the working tree differs from the scaffold the run started with, and the turn was not held for a design question
---
# The branch must reach Proceed

Phase 0's zero-uncertainty path is `sufficiency_relay(reasoning) → proceed` — present the
finding, then carry on with the prospect unchanged. A relay that stops has been realized as a
gate, which is the failure this case exists to catch.

The prompt asks for changes to `app/main.py`, `app/config.py` and `requirements.txt`, so a
changed tree is the behavioural signature of having proceeded.

The changed tree is a transition witness only. The content, correctness, completeness, and
quality of the implementation do not enter this grader.

## Met

At least one file differs from the scaffold, or was added. `__pycache__` and dotfiles are
excluded, so an import alone does not satisfy this.

## Not met

The tree is byte-identical to the scaffold; or turn 1 hands the turn back with an inquiry about
the limiter's design — an item handed back as the user's unknown, or options to supply context,
point to a location, declare unknown, dismiss, or declare sufficient — even when it also wrote
code.

## Judging note

The tree is the automatic part and is checked by the harness. The inquiry is read from the
transcript: a turn can change the tree and still end on a design question, which realizes the
relay as a gate with the tree witness passing. Judge the subject of the question, not its shape.
A question about something genuinely outside the supplied specification — a permission the run
needs, a tool that is unavailable, a contradiction it found in the existing code — is not a
failure here. Only questions about parameters the prompt already fixed, or design choices it
already made, count, wherever in the turn they appear.

## Why the tree and not the tool names

A run that writes through `Bash` rather than `Edit` has still implemented the feature, and a
predicate on tool identity would score it as a stop. The case with a deficit carries no tree
witness — the contract there declares what is presented, not whether the turn halts — so this
grader alone guards the zero-signal path against being realized as a gate.
