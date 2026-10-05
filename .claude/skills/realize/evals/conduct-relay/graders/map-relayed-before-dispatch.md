---
type: llm
target: trace
kind: manual
window: turn 1, up to its first write
focus: whether the map, showing every choice of the run's that execution will follow, is presented as a relay before the dispatch, with nothing the prompt settled re-opened
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
to decide. None of these has to be restated on the map. What the prompt leaves to the run — who
runs each line and where, what the method needs and whether it was observed, and any choice of
method the prompt does not fix — is the run's, and is what the map has to show.

## Met

1. **Before the dispatch.** The map is presented in turn 1 before its first write or hand-off.
2. **Every choice of the run's on it.** Every choice the run made that execution will follow is
   visible on the map, as `method-written-out` (in `../../conduct-map-gate/graders/`) defines it.
   What the person's words already settled is outside that criterion: the map may restate it,
   quote it, or point at the person's message for it. The run's own choices must be on the map —
   the placement, the lifetime past what the person fixed, what the method needs, and anything the
   prompt left open.
3. **Nothing re-opened.** No value the prompt settled appears on the map as open, as a question,
   or as something the person still has to decide.

## Not met

The first write comes before any map; or a choice the run made that execution follows, one the
person's words did not settle, is not visible on the map; or a settled value is shown as open or
put to the person.

## Not exercised

Turn 1 made no write and no hand-off, so there is no dispatch to precede. `proceed-observed` records
that failure; record this grader as not exercised.

## Judging note

Quoting the person's words is welcome and not required. Whether the map also marks placement and
lifetime as inference, and what contrary grounds it carries, are not graded here. Whether it ends at
a gate is `proceed-observed`'s. What the substrate writes or reports after the first write is not
graded in itself; read it only to see which choices execution followed, and a choice the person's
words settled is not missing from the map because it first shows up there.

## Arms

The bare arm has no map obligation. Record whether it restated the request, or its own plan, before
its first write, as the baseline shape; it is not scored against this grader.
