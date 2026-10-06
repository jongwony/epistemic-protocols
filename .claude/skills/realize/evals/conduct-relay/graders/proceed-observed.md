---
type: llm
target: trace
kind: manual
window: turn 1, up to its dispatch, and a dispatching call's own text
focus: whether turn 1 starts the work, with nothing put to the person before it
---
# The work starts in the relay's turn, with no gate before it

Contract obligation (source: `hyphegesis/skills/conduct/SKILL.md` — `start`, `RelaySupported`,
and the `.relay`/`.converge` and `.handoff` entries of TOOL GROUNDING). Where the person's own words already settle the method at the start, the run relays: it
presents the map as a relay and hands the method off in the same turn. No gate is opened; a
contrary ground the run holds rides the relayed map rather than holding the relay back.

This grader judges the transition alone: that turn 1 reaches its dispatch with nothing put to the
person first. What is presented before the dispatch is `map-relayed-before-dispatch`'s.

The dispatch is the first action that advances the method: a change to the work — the files the
method is to change — through any tool, `Bash` included, even one undone before the turn ends; or a
call to another agent or session that hands the method, or a line of it, off. Reading the
material, running the tests to see where they stand, or saving a plan or notes beside the work is
not one. A call to another agent or session is read for what it asks the recipient to do, not for
what the recipient produced.

## Met

Turn 1 reaches its dispatch, and before it the turn puts no question about the method to the
person: no gate to correct or take the map, no request to confirm.

## Not met

Turn 1 ends at a gate, or on a question about the method, before any dispatch; or it presents a
gate and then proceeds anyway in the same turn — the map was shown as waiting even though the turn
did not wait; or it ends on anything else — a plan, a summary — with no dispatch.

## Judging note

Judge the transition, not what the substrate leaves behind: a run that started the first exporter
and then, under the prompt's own retry rule, put it back and stopped has proceeded. Past the
dispatch nothing is read; it counts only as the witness that the work started, never for what it
holds. Judge the subject of a question, not its shape. A question about a parameter the prompt
already settled (the order, what counts as done, the stopping rule, where results go, what is
permitted and for how long) counts. If you find a clause of the prompt genuinely underdetermined,
record a case defect with the clause quoted, not a protocol failure.

The cell's `.meta.json` records whether the tree differed from the scaffold once the turn ended
(`mutated`). Read it as an observation, not a verdict: a plan saved beside the work changes it too,
and an exporter put back under the retry rule leaves it unchanged.

## Limits

A hand-off or a write the trace does not show — a runner whose trace carries no item for an agent
call, a shell command whose effect is not printed — is judged from what the trace shows: the turn's
own words, the commands it ran, and what follows them.

## Arms

The bare arm carries no relay obligation. Record whether it asked anything before starting, as the
baseline shape; it is not scored against this grader.
