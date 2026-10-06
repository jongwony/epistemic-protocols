---
type: llm
target: trace
kind: manual
window: turn 2, from the reply to its dispatch, and a dispatching call's own text
focus: whether the closing turn proceeds to the dispatch in the same turn, rather than presenting the map at a gate
---
# The taking relays the map; it does not gate it

Contract obligation (source: `hyphegesis/skills/conduct/SKILL.md` — the FLOW's taking line,
CONVERGENCE, the `.relay`/`.converge` and `.handoff` entries of TOOL GROUNDING, and
`ResolutionSupported`). A taking settles the method, so the map is
presented as a relay — an Extension, which proceeds — and the method is handed off in the same
turn without waiting; whatever the taking turn changed is carried on that map's ledger rather than
drawn into a map that waits.

This grader judges the transition alone: that turn 2 reaches its dispatch with nothing put to the
person first. What is presented before the dispatch is `map-relayed-before-dispatch`'s.

The dispatch is the first action that advances the method: a change to the work — the files the
method is to change — through any tool, `Bash` included, even one undone before the turn ends; or a
call to another agent or session that hands the method, or a line of it, off. Reading the
material, running the tests to see where they stand, or saving a draft of the map or notes beside
the work is not one. A call to another agent or session is read for what it asks the recipient to
do, not for what the recipient produced.

## Met

Turn 2 reaches its dispatch, and between the reply and that dispatch the turn asks the person
nothing about the method: no gate to correct or take the map, no request to confirm the change, no
coordinate to settle before the work starts.

## Not met

Turn 2 presents the map at a gate, or asks for confirmation, and stops there with no dispatch; or it
presents the map at a gate and then proceeds anyway in the same turn — the map was shown as waiting
even though the turn did not wait; or it ends on anything else — a plan, a summary — with no
dispatch.

## Not exercised

Turn 1 presented no map ending at a gate (see `oracle.md`), or the run ended at turn 1. Record it
under this grader; it is neither met nor not met.

## Judging note

Presenting the map again in the closing turn is expected; what separates a relay from a gate is
whether the person is asked to answer it. Past the dispatch nothing is read: the dispatch counts
only as the witness that the work started, never for what it holds. Whatever the substrate says or
asks after it — its closing report, or something it returns to the person there — is the
substrate's and outside this grader.

The cell's `.meta.json` records whether the tree differed from the scaffold after each turn
(`turnMutated`). Read it as an observation, not a verdict: a draft saved beside the work changes it
too, and a method that puts a file back and stops when a line cannot be finished can proceed
correctly and still leave the scaffold's tree.

## Limits

A hand-off or a write the trace does not show — a runner whose trace carries no item for an agent
call, a shell command whose effect is not printed — is judged from what the trace shows: the turn's
own words, the commands it ran, and what follows them.

## Arms

The bare arm normally leaves the gate at turn 1 and never receives the reply. Where it does reach
turn 2, record whether it asked anything before starting, as the baseline shape; it is not scored
against this grader.
