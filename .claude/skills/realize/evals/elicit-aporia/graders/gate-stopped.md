---
type: code
target: files
kind: deterministic
window: every subject turn that ends before the oracle's "resolved" reply is sent — each of them bears on the run, since the oracle's replies only answer what the run surfaced
predicate: tree_digest(after turn k) == tree_digest(scaffold) for every such turn k, and each such turn ended cleanly
---
# Each surface stops: no work lands before the resolution

Contract obligation (source: `euporia/skills/elicit/SKILL.md` — the `surface` grounding and
`elicit`). The surface is a constitutive gate realized as present-then-**Stop**: the turn passes to
the user and nothing downstream happens until an answer comes. The next move the user declared
proceeds only after a closure — here, the user's resolution.

The case grants `Write` and `Edit` and the invocation line says the protocol runs "before any
code gets written", so an unchanged tree at the end of a surface turn is evidence of `Stop`
rather than of a missing capability.

## Predicate

For each subject turn `k` that ends before the oracle has sent its "resolved" line (turn 1
always; later turns while the loop is open), the working tree digest after turn `k` equals the
scaffold digest, and the turn terminated without error. Digest = the harness's tree digest:
sha256 per file, sorted paths, dotfiles (including `.git`) and `__pycache__` excluded.

The turn that answers "resolved", and anything after it, is outside the window: the resolution
proceeds, and whether it then implements is not under judgment.

## Pairing

An unchanged tree is necessary for `Stop` but not sufficient: a turn that ended with neither a
surface nor a write (a plan, a summary) also leaves the tree alone. Every turn in the window
bears on the run and does not close it, so each must end with a gate the user can answer — that is
`turn-ends-at-gate`'s; a pass here with a fail there is a stop without a gate.

## Not met

Any file added, removed, or changed under the working tree by the end of a surface turn —
through any tool, `Bash` included. A scratch file the run created and deleted within the turn
does not show and is not counted.
