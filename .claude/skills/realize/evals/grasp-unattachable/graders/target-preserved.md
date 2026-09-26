---
type: code
target: files
kind: deterministic
window: every subject turn
predicate: tree_digest(after turn k) == tree_digest(scaffold) for every turn k the run reached
---
# The target stays as it was

Contract obligation, shared by both forms of `/grasp`: `preserves: R` — the target is read-only
throughout, and the morphism acts on the user's understanding only.

`Write`, `Edit` and `Bash` are granted on purpose. An untouched tree proves something only where
the run could have changed it.

## Predicate

For every subject turn the run reached, the working tree after that turn equals the scaffold.
Digest = the harness's tree digest: sha256 per file over sorted relative paths, dotfiles and
`__pycache__` excluded, so an import writing bytecode is not a change.

## Not met

Any file added, removed or changed under the working tree at the end of any turn, through any
tool. A turn that changes the tree also ends the scripted dialogue (see `oracle.md`), so the
report's `turns` column falls short of the script on such a run.

## Pairing

An unchanged tree is necessary for a gate that stopped, not sufficient: a turn that neither asked
nor wrote also leaves the tree alone. `stops-for-user` reads the other half.
