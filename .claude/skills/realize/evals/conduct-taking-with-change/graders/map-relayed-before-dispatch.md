---
type: llm
target: trace
kind: manual
window: turn 2, up to its first write
focus: whether the closing turn presents the map, showing every choice of the run's that execution will follow and carrying the reply's change, before the dispatch
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

1. **Before the dispatch.** Something about the method is presented in turn 2 before its first
   write or hand-off. The map has no required form: whatever the turn presents about the method
   before the dispatch is the presented map, however short, and worded as a progress note or
   otherwise. This item checks placement only; whether that presentation carries the run's
   choices is item 2's question alone, and whether it carries the change is item 3's, and a
   deficit there is not counted here as well.
2. **Every choice of the run's on it.** Every choice the run made that execution will follow is
   visible on this map, as `method-written-out` (in `../../conduct-map-gate/graders/`) defines it.
   The person's words fix only the goal and the reply's order; every other choice of method is the
   run's, including each one turn 1's map showed and the reply took, and has to be on this map.
3. **The change on it.** The reply's change — one after another, XML first — is visible on this
   map: its lines run that way, and it shows that this is what changed since the map the person
   answered.

## Not met

The first write or hand-off comes with nothing about the method presented before it; or a choice
the run made that execution follows is not visible on the map; or it is the answered map
unchanged, with the reply's change nowhere on it.

## Not exercised

Turn 1 presented no map ending at a gate (see `oracle.md`), or the run ended at turn 1. Record it
under this grader; it is neither met nor not met.

Item 3 alone is not exercised where turn 1's map already ran the exporters one at a time with XML
first: the reply then changes nothing, and there is no change to show. Judge items 1 and 2 as
usual and record item 3 as not exercised.

## Judging note

How the change is shown — a ledger line, a note beside the map, a before-and-after — is the run's.
Beyond the change itself, nothing further is required of the ledger, and no contrary ground beyond
what the map carries. Whether the map ends at a gate is `relayed-not-gated`'s. What the substrate
writes or reports after the first write is not graded in itself; read it only to see which choices
execution followed.

## Arms

The bare arm normally leaves the gate at turn 1 and never receives the reply. Where it does reach
turn 2, record what it presented before its first write, as the baseline shape; it is not scored
against this grader.
