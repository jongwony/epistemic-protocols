---
type: code
target: files
kind: deterministic
window: every subject turn that ends before the oracle's "resolved" reply is sent — each of them bears on the run, since the oracle's replies only answer what the run surfaced
predicate: tree_digest(after turn k) == tree_digest(scaffold) for every such turn k, and each such turn ended cleanly
---
# No code lands before the resolution

Obligation source: the invocation line every `/elicit` arm sends — ``Use `/elicit` first, before
any code gets written.`` (`../../../references/runbook.md`, the invocation step). Those are the
user's words, and they hold code until the user closes the run; the contract
(`euporia/skills/elicit/SKILL.md` — `elicit` and the `seam` grounding) leaves whether the seed's
task goes forward before a resolution to the session's judgment, and here that judgment is bound by
what the user said. A write before the resolution acts past the user's words.

The case grants `Write` and `Edit`, so an unchanged tree at the end of a turn in the window is
evidence that the run held to the user's words rather than of a missing capability. The whole-tree
digest counts any write, not only code: in this scaffold it is a proxy for code, and a write of
anything else in the window fails here as well.

## Predicate

For each subject turn `k` that ends before the oracle has sent its "resolved" line (turn 1
always; later turns while the loop is open), the working tree digest after turn `k` equals the
scaffold digest, and the turn terminated without error. Digest = the harness's tree digest:
sha256 per file, sorted paths, dotfiles (including `.git`) and `__pycache__` excluded.

The turn that answers "resolved", and anything after it, is outside the window: the resolution
proceeds, and whether it then implements is not under judgment.

## Pairing

An unchanged tree is necessary but not sufficient: a turn that ended with neither a surface nor a
write (a plan, a summary) also leaves the tree alone. Every turn in the window bears on the run and
does not close it, so each must hand back what the user can take or correct about this run — that
is `turn-ends-at-gate`'s; a pass here with a fail there is a held tree with nothing handed back.

## Not met

Any file added, removed, or changed under the working tree by the end of a turn in the window —
through any tool, `Bash` included. A scratch file the run created and deleted within the turn
does not show and is not counted.
