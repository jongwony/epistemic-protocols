---
type: code
target: files
kind: deterministic
window: every subject turn that ends before the user's "resolved" reply is sent
predicate: tree_digest(after turn k) == tree_digest(scaffold) for every such turn k, and each such turn ended cleanly
---
# Each surfacing stops: no work lands before convergence

Contract obligation (source: `euporia/skills/elicit/SKILL.md`, Phase 2 and its tool grounding).
The surfacing is a constitutive gate realized as present-then-**Stop**: the turn passes to the
user and nothing downstream happens until an answer comes. Downstream work is licensed only
after convergence, which is the user's judgment.

The case grants `Write` and `Edit` and the invocation line says the protocol runs "before any
code gets written", so an unchanged tree at the end of a surfacing turn is evidence of `Stop`
rather than of a missing capability.

## Predicate

For each subject turn `k` that ends before the oracle has sent its "resolved" line (turn 1
always; later turns while the loop is open), the working tree digest after turn `k` equals the
scaffold digest, and the turn terminated without error. Digest = the harness's tree digest:
sha256 per file, sorted paths, dotfiles (including `.git`) and `__pycache__` excluded.

The turn that answers "resolved", and anything after it, is outside the window: convergence
proceeds, and whether it then implements is not under judgment.

## Pairing

An unchanged tree is necessary for `Stop` but not sufficient: a turn that ended with neither a
surfacing nor a write (a plan, a summary) also leaves the tree alone. Read this predicate
together with `qs-presented`; a pass here with a fail there is a stop without a gate.

## Not met

Any file added, removed, or changed under the working tree by the end of a surfacing turn —
through any tool, `Bash` included. A scratch file the run created and deleted within the turn
does not show and is not counted.
