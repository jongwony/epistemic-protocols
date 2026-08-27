---
type: llm
target: files
focus: whether the working tree differs from the scaffold the run started with
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

The tree is byte-identical to the scaffold.

## Why the tree and not the tool names

This is the mirror of the trigger-positive case's Stop witness, and it is keyed the same way for
the same reason: a run that writes through `Bash` rather than `Edit` has still implemented the
feature, and a predicate on tool identity would score it as a stop. Together the two witnesses
distinguish a protocol that gates correctly from one that gates always or never.
