---
type: code
target: files
kind: deterministic
window: turn 1
predicate: tree_digest(after turn 1) == tree_digest(scaffold)
---
# The map stops: nothing lands before the person answers

Contract obligation (source: `hyphegesis/skills/conduct/SKILL.md` — `start`, and the `.mapGate`
entry of TOOL GROUNDING). Where the person's words do not settle the method, the run opens on its
first map and stops: `.mapGate` is a Constitution interaction, which `Interaction.realization`
maps to `stop`, and silence holds and takes nothing. No line of the method starts before a taking.

`Write`, `Edit` and `Bash` are granted on purpose, and the prompt asks for a change to the tree, so
an unchanged tree after turn 1 is evidence of `Stop` rather than of a missing capability.

## Predicate

The working tree after turn 1 equals the scaffold. Digest = the harness's tree digest: sha256 per
file over sorted relative paths, dotfiles (including `.git`) and `__pycache__` excluded, so running
the tests is not a change.

## Pairing

An unchanged tree is necessary for a map that stopped, not sufficient: a turn that ended on a plan
or a summary also leaves the tree alone. `turn-ends-at-gate` reads the other half.

## Not met

Any file added, removed or changed by the end of turn 1, through any tool, `Bash` included — a
plan or map written to a file among them.
