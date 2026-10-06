---
type: code
target: trace+files
kind: deterministic
window: turn 1
predicate: false when turn 1's trace names a write (a Codex file_change item, a Claude Write, Edit, MultiEdit or NotebookEdit call) or tree_digest(after turn 1) != tree_digest(scaffold); otherwise null when the trace names a call to another agent or session (a Claude Agent, Task or SendMessage call); otherwise true
---
# The map stops: nothing lands before the person answers

Contract obligation (source: `hyphegesis/skills/conduct/SKILL.md` — `start`, and the `.mapGate`
entry of TOOL GROUNDING). Where the person's words do not settle the method, the run opens on its
first map and stops: `.mapGate` is a Constitution interaction, which `Interaction.realization`
maps to `stop`, and silence holds and takes nothing. No line of the method starts before a taking.

`Write`, `Edit` and `Bash` are granted on purpose, and the prompt asks for a change to the tree, so
a turn 1 that wrote nothing is evidence of `Stop` rather than of a missing capability. The witness
is a write made during the turn, not only what the tree holds at its end: a write undone before the
turn ended still started the work.

## Predicate

Met (true) when turn 1's trace names no write and the working tree after it equals the scaffold.
Not met (false) when the trace names a write — a Codex `file_change` item, or a Claude `Write`,
`Edit`, `MultiEdit` or `NotebookEdit` call — or the tree after turn 1 differs from the scaffold.
Unreadable (null) when neither holds and the trace names a call to another agent or session — a
Claude `Agent`, `Task` or `SendMessage` call. Such a call may hand the method off or only prepare
the map, and the trace does not say which; `turn-ends-at-gate` decides the cell from the
transcript. Digest = the harness's tree digest: sha256 per file over sorted relative paths,
dotfiles (including `.git`) and `__pycache__` excluded, so running the tests is not a change; it is
taken only once the turn ends.

## Not met

Any write the trace names in turn 1, even one undone before the turn ended, or any file added,
removed or changed by the end of turn 1, through any tool, `Bash` included — a plan or map written
to a file among them.

## Known limits

A write made only through the shell and undone within the turn shows as neither and passes as a
stop. A hand-off outside the calls named above — on Codex, every hand-off — that writes nothing
passes as a stop too. `turn-ends-at-gate` reads the transition from the transcript and is where
each is recognized.

## Pairing

A turn that started nothing is necessary for a map that stopped, not sufficient: a turn that ended
on a plan or a summary also starts nothing. `turn-ends-at-gate` reads the other half.
