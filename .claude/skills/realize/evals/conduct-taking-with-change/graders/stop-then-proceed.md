---
type: code
target: trace+files
kind: deterministic
window: turns 1-2
predicate: null when either turn's trace names a call to another agent or session (a Claude call to a tool of delegationTools in harness.config.json; a Codex collab_tool_call item) or either turn's tree went unread; otherwise each turn reads started when its trace names a write to a work target (a Codex file_change path, a Claude Write, Edit, MultiEdit or NotebookEdit file_path) or the work targets in tree_digest(after it) differ from the scaffold's, and not started otherwise; true when turn 1 did not start and turn 2 did, else false
---
# The map stops, and the taking proceeds in the same turn

Contract obligation (source: `hyphegesis/skills/conduct/SKILL.md` — `start`, `conduct`, the
`.mapGate`, `.relay`/`.converge` and `.handoff` entries of TOOL GROUNDING, and CONVERGENCE).
Turn 1 presents the map and stops. The person's reply takes it, with one change; the turn that
reads that taking relays the map and hands the method off in the same turn without waiting, so
the work starts there.

`Write`, `Edit` and `Bash` are granted on purpose, so a turn 1 that wrote none of the work is
evidence of `Stop` rather than of a missing capability. The case runs with delegation unavailable
(`case.yaml`): the substrate is this session, and the method's work starts by a write to the work.
Turn 2's witness is a write made during the turn, not what the tree holds at its end: the method
the person took may put a file back and stop when a line cannot be finished, so a turn that
proceeded correctly can end on the scaffold's tree.

## Predicate

The work's targets are the paths `workTargets` of the `conduct` target in `harness.config.json`
names.

Each turn is read the same way. It started the work when its trace names a write whose path is a
work target — a Codex `file_change` path, or the `file_path` of a Claude `Write`, `Edit`,
`MultiEdit` or `NotebookEdit` call — or a work target in the tree after it was added, removed or
changed. Otherwise it did not start the work: a plan, a draft map or notes written outside the
work's targets is not a witness. Digest = the harness's tree digest: sha256 per file over sorted
relative paths, dotfiles (including `.git`) and `__pycache__` excluded; it is taken only once a
turn ends.

Met (true) when turn 1 did not start the work and turn 2 did. Not met (false) otherwise, and when
the script ended at turn 1.

Unreadable (null) when either turn's trace names a call to another agent or session — a Claude
call to a tool `delegationTools` in `harness.config.json` names, or a Codex `collab_tool_call` item
where codex emits one — whatever else the turns show: the case's environment had no such call to
offer, so the run is reported under treatment integrity and is not evidence; or when a turn's tree
went unread. The transcript decides the cell, turn by turn: turn 1 by item 3 of
`turn-ends-at-gate` (in `../../conduct-map-gate/graders/`), applied to this case's turn 1, and
turn 2 by `relayed-not-gated`.

## Not met

Turn 1 changed a work target — the harness then sends no reply, and the report's `turns` column
falls short of the script; or turn 1's trace names a write to a work target, even one undone
before the turn ended; or turn 2 shows no write to a work target, named or in the tree, which is a
taking realized as another gate.

## Known limits

A write to a work target made only through the shell and undone within the same turn shows in
neither half: in turn 1 it passes as a stop, in turn 2 it reads as no write. A hand-off made by
launching another agent through the shell, which the environment does not remove, passes as a
stop in turn 1 and reads as not met in turn 2 when nothing it writes to a work target is in the
tree by the turn's end. The transcript is where each is recognized: in turn 1 as item 3 of
`turn-ends-at-gate` reads it, in turn 2 by `relayed-not-gated`.

## Pairing

A write in turn 2 says the work started; it does not say what was presented before it.
`map-relayed-before-dispatch` reads the relayed map and its order relative to the first write,
and `relayed-not-gated` reads that nothing stood between the taking and the dispatch. The content
of the change, and whether the method succeeded, are the substrate's and are not read here.
