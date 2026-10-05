---
type: llm
target: trace
kind: manual
window: turn 1, up to its first write
focus: whether the map, written out as decided, is presented as a relay before the dispatch, with nothing the prompt settled re-opened
---
# The map is relayed before the dispatch

Contract obligation (source: `hyphegesis/skills/conduct/SKILL.md` — CONVERGENCE, the
`.relay`/`.converge` and `.handoff` entries of TOOL GROUNDING, `RelaySupported`, and the Rule
"Conduction warrant"). Where the person's own words already settle the method at the start, the map
is presented as a relay — the method as it will be handed off — and the handoff follows in the same
turn; the handoff carries what that map showed. Placement, the lifetime past what the person fixed,
and what the method needs are the run's inference and are shown on that map too.

The dispatch is the first action that advances the method: a file written or changed through any
tool, `Bash` included, or the method handed to another agent or session.

## In this case

The prompt sets, in the person's words: the lines and their order, that each starts only once the
one before is done and may look at earlier ones, when a line is done and what happens when it
cannot be, that nothing is merged and one report comes back at the end, that changes stay
uncommitted and `report/legacy.py` stays, the stdlib-only and files-touched constraints, what the
run may do and for how long, that the person will not check in, and that nothing is left for them
to decide.

## Met

1. **Before the dispatch.** The map is presented in turn 1 before its first write or hand-off.
2. **The whole method, as decided.** It writes the method out as `method-written-out` (in
   `../../conduct-map-gate/graders/`) defines it: the lines, their order, whether they see each
   other, how results combine, when each stops, and where results go — here, as the prompt set them.
3. **Nothing re-opened.** No value the prompt settled appears on the map as open, as a question,
   or as something the person still has to decide.

## Not met

The first write comes before any map; or the map leaves out a part of the method, or only points at
the person's message in place of writing the method out; or a settled value is shown as open or put
to the person.

## Not exercised

Turn 1 made no write and no hand-off, so there is no dispatch to precede. `proceed-observed` records
that failure; record this grader as not exercised.

## Judging note

Quoting the person's words is welcome and not required. Whether the map also marks placement and
lifetime as inference, and what contrary grounds it carries, are not graded here. Whether it ends at
a gate is `proceed-observed`'s. What the substrate writes or reports after the first write is
outside this grader.

## Arms

The bare arm has no map obligation. Record whether it restated the request, or its own plan, before
its first write, as the baseline shape; it is not scored against this grader.
