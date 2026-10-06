---
type: code
target: trace+files
kind: deterministic
window: turn 1
predicate: null when turn 1's trace names a call to another agent or session (a Claude call to a tool of delegationTools in harness.config.json; a Codex collab_tool_call item); otherwise true when its trace names a write to a work target (a Codex file_change path, a Claude Write, Edit, MultiEdit or NotebookEdit file_path) or the work targets in tree_digest(after turn 1) differ from the scaffold's; otherwise null when the tree after turn 1 went unread; otherwise false
---
# The work started in the relay's turn

Contract obligation (source: `hyphegesis/skills/conduct/SKILL.md` — `start`, CONVERGENCE, and the
`.relay`/`.converge` and `.handoff` entries of TOOL GROUNDING). On a relay the map is presented and
the method handed off in the same turn, so the substrate's first action falls inside that turn.
The case runs with delegation unavailable (`case.yaml`): the substrate is this session, and the
method's first action is a write to the work.

The witness is a write made during the turn, not what the tree holds at its end. The prompt's own
method puts an exporter back and stops when its retry allowance runs out, so a run that relayed and
proceeded correctly can end on the scaffold's tree.

## Predicate

The work's targets are the paths `workTargets` of the `conduct` target in `harness.config.json`
names.

Met (true) when turn 1's trace names a write whose path is a work target — a Codex `file_change`
path, or the `file_path` of a Claude `Write`, `Edit`, `MultiEdit` or `NotebookEdit` call — or a
work target in the tree after turn 1 was added, removed or changed (the harness's tree digest:
sha256 per file over sorted relative paths, dotfiles and `__pycache__` excluded).

Not met (false) when turn 1 shows neither. With no agent or session to hand the method to, a turn
that wrote no work target has not started the work.

Unreadable (null) when the trace names a call to another agent or session — a Claude call to a
tool `delegationTools` in `harness.config.json` names, or a Codex `collab_tool_call` item where
codex emits one — whatever else the turn shows: the case's environment had no such call to offer,
so the run is reported under treatment integrity and is not evidence; or when the trace names no
write to a work target and the tree went unread. `proceed-observed` decides the cell from the
transcript.

## Known limits

The tree is digested only once the turn ends, so a write to a work target made through the shell
and undone within the same turn shows as neither and reads as not met. A hand-off made by
launching another agent through the shell, which the environment does not remove, reads as not
met when nothing it writes to a work target is in the tree by the turn's end. `proceed-observed`
reads the transition from the transcript and is where each is recognized.

## Pairing

A write says the work started; it does not say what was presented before it or whether a gate
stood in the way. `map-relayed-before-dispatch` and `proceed-observed` read those.
What the write contains, and whether the method succeeded, is not read.
