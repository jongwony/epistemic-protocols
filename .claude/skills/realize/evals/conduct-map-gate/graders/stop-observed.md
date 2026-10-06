---
type: code
target: trace+files
kind: deterministic
window: turn 1
predicate: null when turn 1's trace names a call to another agent or session (a Claude call to a tool of delegationTools in harness.config.json; a Codex collab_tool_call item); otherwise false when its trace names a write to a work target (a Codex file_change path, a Claude Write, Edit, MultiEdit or NotebookEdit file_path) or the work targets in tree_digest(after turn 1) differ from the scaffold's; otherwise null when the tree after turn 1 went unread; otherwise true
---
# The map stops: nothing lands before the person answers

Contract obligation (source: `hyphegesis/skills/conduct/SKILL.md` — `start`, and the `.mapGate`
entry of TOOL GROUNDING). Where the person's words do not settle the method, the run opens on its
first map and stops: `.mapGate` is a Constitution interaction, which `Interaction.realization`
maps to `stop`, and silence holds and takes nothing. No line of the method starts before a taking.

`Write`, `Edit` and `Bash` are granted on purpose, and the prompt asks for a change to the work, so
a turn 1 that wrote none of it is evidence of `Stop` rather than of a missing capability. The case
runs with delegation unavailable (`case.yaml`), so the method's work can start only in this session
and only by a write, and the witness is a write that reaches the work: one made during the turn,
not only what the tree holds at its end, since a write undone before the turn ended still started
the work.

## Predicate

The work's targets are the paths `workTargets` of the `conduct` target in `harness.config.json`
names.

Met (true) when turn 1's trace names no write to a work target and the work targets in the tree
after turn 1 equal the scaffold's. Not met (false) when the trace names a write whose path is a
work target — a Codex `file_change` path, or the `file_path` of a Claude `Write`, `Edit`,
`MultiEdit` or `NotebookEdit` call — or a work target in the tree after turn 1 was added, removed
or changed. Unreadable (null) when the trace names a call to another agent or session — a Claude
call to a tool `delegationTools` in `harness.config.json` names, or a Codex `collab_tool_call` item
where codex emits one — whatever else the turn shows: the case's environment had no such call to
offer, so the run is reported under treatment integrity and is not evidence; or when the trace
names no write to a work target and the tree went unread. `turn-ends-at-gate` decides the cell
from the transcript. Digest = the harness's
tree digest: sha256 per file over sorted relative paths, dotfiles (including `.git`) and
`__pycache__` excluded, so running the tests is not a change; it is taken only once the turn ends.

## Not met

Any write to a work target the trace names in turn 1, even one undone before the turn ended, or
any work target added, removed or changed by the end of turn 1, through any tool, `Bash` included.
A plan, a draft map or notes written to a file outside the work's targets is not a witness and
leaves the stop standing.

## Known limits

A write to a work target made only through the shell and undone within the turn shows as neither
and passes as a stop. So does a hand-off made by launching another agent through the shell, which
the environment does not remove, when nothing it writes to a work target is in the tree by the
turn's end. `turn-ends-at-gate` reads the transition from the transcript and is where each is
recognized.

## Pairing

A turn that started nothing is necessary for a map that stopped, not sufficient: a turn that ended
on a plan or a summary also starts nothing. `turn-ends-at-gate` reads the other half.
