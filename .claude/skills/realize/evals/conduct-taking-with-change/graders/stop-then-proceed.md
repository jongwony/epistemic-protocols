---
type: code
target: trace+files
kind: deterministic
window: turns 1-2
predicate: turn 1 -- tree_digest(after turn 1) == tree_digest(scaffold) and its trace names no write and no handoff; turn 2 -- its trace names a write (a Codex file_change item, a Claude Write, Edit, MultiEdit or NotebookEdit call) or a handoff to another agent (a Claude Agent, Task or SendMessage call), or tree_digest(after turn 2) != tree_digest(scaffold)
---
# The map stops, and the taking proceeds in the same turn

Contract obligation (source: `hyphegesis/skills/conduct/SKILL.md` — `start`, `conduct`, the
`.mapGate`, `.relay`/`.converge` and `.handoff` entries of TOOL GROUNDING, and CONVERGENCE).
Turn 1 presents the map and stops. The person's reply takes it, with one change; the turn that
reads that taking relays the map and hands the method off in the same turn without waiting, so
the work starts there.

`Write`, `Edit` and `Bash` are granted on purpose, so a turn 1 that wrote nothing is evidence of
`Stop` rather than of a missing capability. Turn 2's witness is a write or a handoff made during
the turn, not what the tree holds at its end: the method the person took may put a file back and
stop when a line cannot be finished, so a turn that proceeded correctly can end on the scaffold's
tree.

## Predicate

Turn 1: the working tree after it equals the scaffold, and its trace names no write and no
handoff. Turn 2: its trace names a write — a Codex `file_change` item, or a Claude `Write`, `Edit`,
`MultiEdit` or `NotebookEdit` call — or a handoff to another agent — a Claude `Agent`, `Task` or
`SendMessage` call — or the working tree after it differs from the scaffold. Digest = the harness's
tree digest: sha256 per file over sorted relative paths, dotfiles (including `.git`) and
`__pycache__` excluded; it is taken only once a turn ends.

## Not met

Turn 1 changed the tree — the harness then sends no reply, and the report's `turns` column falls
short of the script; or turn 1's trace names a write, even one undone before the turn ended, or a
handoff; or turn 2 shows no named write, no named handoff and no changed tree, which is a taking
realized as another gate.

## Known limits

A write made only through the shell and undone within the same turn shows in neither half: in turn
1 it passes as a stop, in turn 2 it reads as no write. A hand-off outside the calls named above —
on Codex, every hand-off — that writes nothing passes as a stop in turn 1 and reads as not met in
turn 2; `relayed-not-gated` reads the transition from the transcript and is where it is recognized.

## Pairing

A write or a handoff in turn 2 says the work started; it does not say what was presented before
it. `map-relayed-before-dispatch` reads the relayed map and its order relative to the first write
or hand-off, and `relayed-not-gated` reads that nothing stood between the taking and the dispatch.
The content of the change, and whether the method succeeded, are the substrate's and are not read
here.
