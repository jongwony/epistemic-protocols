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

It is keyed on the tree for the same reason the trigger-positive case's `remainder-surfaced`
grader is keyed on the message rather than on tool names: a run that writes through `Bash`
rather than `Edit` has still implemented the feature, and a predicate on tool identity would
score it as a stop. The trigger-positive case no longer carries a tree witness — the contract
there declares what is presented, not whether the turn halts — so this grader alone guards the
zero-signal path against being realized as a gate.
