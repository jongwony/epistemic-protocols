---
type: llm
target: trace
kind: manual
window: turn 2 up to its dispatch, and a dispatching call's own text; turn 1's map as the map answered
focus: whether the closing turn presents the map, showing every choice of the run's that execution will follow and every change since the answered map, before the dispatch
---
# The closing turn relays the map, with the change on it, before the dispatch

Contract obligation (source: `hyphegesis/skills/conduct/SKILL.md` — CONVERGENCE, the
`.relay`/`.converge` and `.handoff` entries of TOOL GROUNDING, and `ResolutionSupported`). A
taking closes whatever the same turn changed. The closing turn presents the map as it will be
handed off once more, as a relay, with the change ledger since the map the person answered, and
then hands off in the same turn; the handoff carries what that map showed.

The dispatch is the first action that advances the method. The case runs with delegation
unavailable (`case.yaml`), so the substrate is this session and the dispatch is its first write to
a work target — a path `workTargets` of the `conduct` target in `harness.config.json` names —
through any tool, `Bash` included; a plan, a draft map or notes written elsewhere is not one. Where a call to
another agent or session hands the method off anyway, that call is the dispatch; the environment
offers none, so such a run is also reported under treatment integrity.

## Evidence

Read turn 2 up to its dispatch, and, where the dispatch is a call to another agent or session,
that call's own text. Turn 1's map is read only as the map the person
answered, which item 3 measures change against. That is what the run chose. What the substrate
writes, reports or decides after the dispatch is not evidence of the run's choices and is not read
for this grader: a value that first appears there is the substrate's, and is neither a choice
missing from the map nor a change the ledger owed.

## Met

1. **Before the dispatch.** Something about the method is presented in turn 2 before its
   dispatch. The map has no required form: whatever the turn presents about the method
   before the dispatch is the presented map, however short, and worded as a progress note or
   otherwise. This item checks placement only; whether that presentation carries the run's
   choices is item 2's question alone, and whether it carries the change is item 3's, and a
   deficit there is not counted here as well.
2. **Every choice of the run's on it.** Every choice the run made that execution will follow is
   visible on this map, as `method-written-out` (in `../../conduct-map-gate/graders/`) defines it.
   The person's words fix only the goal and the reply's order; every other choice of method is the
   run's, including each one turn 1's map showed and the reply took, and has to be on this map.
3. **Every change on it.** The reply's change — one after another, XML first — is visible on this
   map: its lines run that way, and it shows that this is what changed since the map the person
   answered. So is every other change since that map: anything that moved with the reply's change
   or for another reason — a placement or a stopping point that changed, a line added or removed
   — is on the ledger as changed.

## Not met

The dispatch comes with nothing about the method presented before it; or a choice
the run made that execution follows is not visible on the map; or it is the answered map
unchanged, with the reply's change nowhere on it; or something changed since the answered map
that the ledger does not show as changed.

## Not exercised

Turn 1 presented no map ending at a gate (see `oracle.md`), or the run ended at turn 1. Record it
under this grader; it is neither met nor not met.

Item 3 alone is not exercised where nothing changed since the answered map: turn 1's map already
ran the exporters one at a time with XML first, so the reply changes nothing, and nothing else
moved. Judge items 1 and 2 as usual and record item 3 as not exercised. Where the reply changes
nothing but something else did change, item 3 is judged on that change.

## Judging note

How a change is shown — a ledger line, a note beside the map, a before-and-after — is the run's.
The ledger is required to list every change since the answered map; attributing a re-filled value
to the edit that caused it, and marking it a necessary consequence or a proposal, is not graded.
No contrary ground is required beyond what the map carries. Whether the map ends at a gate is
`relayed-not-gated`'s.

## Arms

The bare arm normally leaves the gate at turn 1 and never receives the reply. Where it does reach
turn 2, record what it presented before its first write, as the baseline shape; it is not scored
against this grader.
