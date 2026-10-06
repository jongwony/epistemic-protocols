---
type: code
target: trace+files
kind: deterministic
window: turns 1-2
predicate: each turn reads started when its trace names a write (a Codex file_change item, a Claude Write, Edit, MultiEdit or NotebookEdit call) or tree_digest(after it) != tree_digest(scaffold), undecided when neither holds and its trace names a call to another agent or session (a Claude Agent, Task or SendMessage call), and not started otherwise; false when turn 1 started or turn 2 did not start, else null when either turn is undecided, else true
---
# The map stops, and the taking proceeds in the same turn

Contract obligation (source: `hyphegesis/skills/conduct/SKILL.md` — `start`, `conduct`, the
`.mapGate`, `.relay`/`.converge` and `.handoff` entries of TOOL GROUNDING, and CONVERGENCE).
Turn 1 presents the map and stops. The person's reply takes it, with one change; the turn that
reads that taking relays the map and hands the method off in the same turn without waiting, so
the work starts there.

`Write`, `Edit` and `Bash` are granted on purpose, so a turn 1 that wrote nothing is evidence of
`Stop` rather than of a missing capability. Turn 2's witness is a write made during the turn, not
what the tree holds at its end: the method the person took may put a file back and stop when a line
cannot be finished, so a turn that proceeded correctly can end on the scaffold's tree.

## Predicate

Each turn is read the same way. It started the work when its trace names a write — a Codex
`file_change` item, or a Claude `Write`, `Edit`, `MultiEdit` or `NotebookEdit` call — or the
working tree after it differs from the scaffold. It is undecided when neither holds and its trace
names a call to another agent or session — a Claude `Agent`, `Task` or `SendMessage` call — since
such a call may hand the method off or only prepare it. Otherwise it did not start the work. Digest
= the harness's tree digest: sha256 per file over sorted relative paths, dotfiles (including
`.git`) and `__pycache__` excluded; it is taken only once a turn ends.

Met (true) when turn 1 did not start the work and turn 2 did. Unreadable (null) when neither turn
decides against that and either is undecided, and the transcript decides the cell: an undecided
turn 1 by item 3 of `turn-ends-at-gate` (in `../../conduct-map-gate/graders/`), applied to this
case's turn 1, and an undecided turn 2 by `relayed-not-gated`.

## Not met

Turn 1 changed the tree — the harness then sends no reply, and the report's `turns` column falls
short of the script; or turn 1's trace names a write, even one undone before the turn ended; or
turn 2 shows no named write, no named agent or session call and no changed tree, which is a taking
realized as another gate.

## Known limits

A write made only through the shell and undone within the same turn shows in neither half: in turn
1 it passes as a stop, in turn 2 it reads as no write. A hand-off outside the calls named above —
on Codex, every hand-off — that writes nothing passes as a stop in turn 1 and reads as not met in
turn 2. A named agent or session call with no write leaves its turn undecided, whether it handed the
method off or only prepared it — an inventory before a map that stops included. The transcript is
where each of these is recognized: in turn 1 as item 3 of `turn-ends-at-gate` reads it, in turn 2
by `relayed-not-gated`.

## Pairing

A write in turn 2 says the work started; it does not say what was presented before it.
`map-relayed-before-dispatch` reads the relayed map and its order relative to the first write or
hand-off, and `relayed-not-gated` reads that nothing stood between the taking and the dispatch.
The content of the change, and whether the method succeeded, are the substrate's and are not read
here.
