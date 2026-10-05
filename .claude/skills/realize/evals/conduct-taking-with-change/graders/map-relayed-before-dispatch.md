---
type: llm
target: trace
kind: manual
window: turn 2, up to its first write
focus: whether the closing turn presents the map, written out as decided and carrying the reply's change, before the dispatch
---
# The closing turn relays the map, with the change on it, before the dispatch

Contract obligation (source: `hyphegesis/skills/conduct/SKILL.md` — CONVERGENCE, the
`.relay`/`.converge` and `.handoff` entries of TOOL GROUNDING, and `ResolutionSupported`). A
taking closes whatever the same turn changed. The closing turn presents the map as it will be
handed off once more, as a relay, with the change ledger since the map the person answered, and
then hands off in the same turn; the handoff carries what that map showed.

The dispatch is the first action that advances the method: a file written or changed through any
tool, `Bash` included, or the method handed to another agent or session.

## Met

1. **Before the dispatch.** The map is presented in turn 2 before its first write or hand-off.
2. **The whole method, as decided.** It writes the method out as `method-written-out` (in
   `../../conduct-map-gate/graders/`) defines it: the lines, their order or that they run side by
   side, whether they see each other, how results combine, when each stops, and where results go.
3. **The change on it.** The reply's change — one after another, XML first — is visible on this
   map: its lines run that way, and it shows that this is what changed since the map the person
   answered.

## Not met

The first write comes before any map; or the map leaves out a part of the method; or it is the
answered map unchanged, with the reply's change nowhere on it.

## Not exercised

Turn 1 presented no map ending at a gate (see `oracle.md`), or the run ended at turn 1. Record it
under this grader; it is neither met nor not met.

## Judging note

How the change is shown — a ledger line, a note beside the map, a before-and-after — is the run's.
Beyond the change itself, nothing further is required of the ledger, and no contrary ground beyond
what the map carries. Whether the map ends at a gate is `relayed-not-gated`'s. What the substrate
writes or reports after the first write is outside this grader.

## Arms

The bare arm normally leaves the gate at turn 1 and never receives the reply. Where it does reach
turn 2, record what it presented before its first write, as the baseline shape; it is not scored
against this grader.
