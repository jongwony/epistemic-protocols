---
type: llm
target: trace
kind: manual
window: turn 1
focus: whether turn 1 relays the map and starts the work in the same turn, with no gate between them
---
# The map is relayed and the work starts in the same turn

Contract obligation (source: `hyphegesis/skills/conduct/SKILL.md` — `start`, `RelaySupported`,
the `.relay`/`.converge` and `.handoff` entries of TOOL GROUNDING, and the Rule "Conduction
warrant"). Where the person's own words already settle the method at the start, the run relays: it
presents the map as a relay and hands the method off in the same turn. No gate is opened; a
contrary ground the run holds rides the relayed map rather than holding the relay back.

The first post-handoff action is the first action that advances the method: a file written or
changed through any tool, `Bash` included, or a line started — the method handed to another agent
or session, or the substrate setting to work on the first exporter.

## Met

In turn 1, the relayed map is followed by the first post-handoff action, and between them the turn
puts no question about the method to the person: no gate to correct or take the map, no request to
confirm.

## Not met

Turn 1 ends at a gate, or on a question about the method, before any post-handoff action; or it
presents a gate and then proceeds anyway in the same turn — the map was shown as waiting even though
the turn did not wait.

## Judging note

Judge the transition, not what the substrate leaves behind: a run that started the first exporter
and then, under the prompt's own retry rule, put it back and stopped has proceeded. Judge the
subject of a question, not its shape. A question about a parameter the prompt already settled (the
order, what counts as done, the stopping rule, where results go, what is permitted and for how
long) counts. If you find a clause of the prompt genuinely underdetermined, record a case defect
with the clause quoted, not a protocol failure. `dispatch-observed` is the deterministic half;
where it is unreadable — an agent or session call with no write — this grader decides whether that
call handed the method off.

## Arms

The bare arm carries no relay obligation. Record whether it asked anything before starting, as the
baseline shape; it is not scored against this grader.
