---
type: code
target: files
kind: deterministic
window: turns 1-2
predicate: tree_digest(after turn 1) == tree_digest(scaffold) and tree_digest(after turn 2) != tree_digest(scaffold)
---
# The map stops, and the taking proceeds in the same turn

Contract obligation (source: `hyphegesis/skills/conduct/SKILL.md` — `start`, `conduct`, the
`.mapGate`, `.converge` and `.handoff` entries of TOOL GROUNDING, and the Rule "Taking brief").
Turn 1 presents the map and stops. The person's reply takes it, with one change; the turn that
reads that taking presents the taking brief and hands the method off in the same turn without
waiting, so the work starts there.

`Write`, `Edit` and `Bash` are granted on purpose, so an unchanged tree after turn 1 is evidence of
`Stop` rather than of a missing capability, and a changed tree after turn 2 is the witness that the
handoff occurred.

## Predicate

The working tree after turn 1 equals the scaffold, and the working tree after turn 2 differs from
it. Digest = the harness's tree digest: sha256 per file over sorted relative paths, dotfiles
(including `.git`) and `__pycache__` excluded.

## Not met

Turn 1 changed the tree — the harness then sends no reply, and the report's `turns` column falls
short of the script; or turn 2 left the tree as the scaffold had it, which is a taking realized as
another gate.

## Pairing

A changed tree after turn 2 says the work started; it does not say what was presented before it.
`brief-before-dispatch` reads the brief and its order relative to the first write, and
`no-redraw-no-wait` reads that nothing stood between the taking and the dispatch. The content of
the change is the substrate's work and is not read here.
