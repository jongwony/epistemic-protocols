---
type: llm
target: trace
kind: manual
window: turn 2, from the reply to its first write
focus: whether the taking turn proceeds to the dispatch without redrawing the map or handing the turn back
---
# The taking neither redraws the map nor waits

Contract obligation (source: `hyphegesis/skills/conduct/SKILL.md` — the FLOW's taking line, the
`.converge` and `.handoff` entries of TOOL GROUNDING, `ResolutionSupported`, and the Rule "Taking
brief"). On a taking, the brief is presented and the method is handed off in the same turn without
waiting; a change the taking turn makes rides the brief, never a redrawn map.

## Met

Between the reply and the first write or hand-off of turn 2, the turn presents no new map for the
person to answer and opens no gate: it does not ask the person to confirm the change, to take the
method again, or to settle a coordinate before the work starts. Turn 2 reaches its dispatch.

## Not met

Turn 2 presents a redrawn map ending at a gate, or asks for confirmation, and stops there with no
write; or it presents a redrawn map with a gate and then proceeds anyway in the same turn — the
map was shown as waiting even though the turn did not wait.

## Not exercised

Turn 1 presented no map ending at a gate (see `oracle.md`), or the run ended at turn 1. Record it
under this grader; it is neither met nor not met.

## Judging note

Restating the method on the brief, as it will be handed off, is the brief rather than a redrawn
map; what separates them is whether the person is asked to answer it. Whatever the substrate says
or asks after the work starts — its closing report, or something it returns to the person there —
is the substrate's and outside this grader. `stop-then-proceed` reads the tree half.
