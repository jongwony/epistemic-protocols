---
type: code
target: trace+files
kind: deterministic
window: turn 1
predicate: turn 1's trace holds a write it names as one (a Codex file_change item, a Claude Write, Edit, MultiEdit or NotebookEdit call), or tree_digest(after turn 1) != tree_digest(scaffold)
---
# The work started in the relay's turn

Contract obligation (source: `hyphegesis/skills/conduct/SKILL.md` — `start`, CONVERGENCE, and the
`.relay`/`.converge` and `.handoff` entries of TOOL GROUNDING). On a relay the map is presented and
the method handed off in the same turn, so the substrate's first action falls inside that turn.

The witness is a write made during the turn, not what the tree holds at its end. The prompt's own
method puts an exporter back and stops when its retry allowance runs out, so a run that relayed and
proceeded correctly can end on the scaffold's tree.

## Predicate

At least one of: turn 1's trace holds a write the runner names as one — a Codex `file_change`
item, or a Claude `Write`, `Edit`, `MultiEdit` or `NotebookEdit` call; or the working tree after
turn 1 differs from the scaffold (the harness's tree digest: sha256 per file over sorted relative
paths, dotfiles and `__pycache__` excluded).

## Known limits

The tree is digested only once the turn ends, so a write made through the shell and undone within
the same turn shows as neither half and reads as not met. A hand-off to another agent or session
that writes nothing in the turn reads as not met too; `proceed-observed` reads the transition from
the transcript and is where either is recognized.

## Pairing

A write says the work started; it does not say what was presented before it or whether a gate
stood in the way. `map-relayed-before-dispatch` and `proceed-observed` read those. What the write
contains, and whether the method succeeded, is not read.
