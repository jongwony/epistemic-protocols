---
type: llm
target: trace
kind: manual
window: turn 1, up to its first write
focus: whether the taking brief is presented before the dispatch and cites the person's words for what they settled
---
# The relay's brief comes before the dispatch and cites the person's words

Contract obligation (source: `hyphegesis/skills/conduct/SKILL.md` — CONVERGENCE, the `.relay`,
`.converge` and `.handoff` entries of TOOL GROUNDING, `RelaySupported`, `StandingSupported`, and the
Rule "Conduction warrant"). On a relay the closing turn presents the taking brief before the
dispatch: the person's words that settle the method, cited, and the method itself on the brief; each
coordinate the person holds with what stands on it in the words of the turn that set it. The
substrate placement and the lifetime past what the person fixed are the run's inference and are
marked so.

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

1. **Before the dispatch.** The brief is presented in turn 1 before its first write or hand-off.
2. **The method shown.** The brief writes the method out as it will be handed off — the lines and
   their order, when each stops and what happens when one cannot, what comes back at the end, and
   where changes go — rather than only pointing at the person's message.
3. **The person's words, cited.** For what the person settled, the brief stands on their words —
   quoted, or plainly attributed to them — rather than presenting those values as its own choices.
4. **Nothing re-opened.** No value the prompt settled appears as the draft's proposal, as open, or
   as something the person still has to decide.

## Not met

The first write comes before any brief; or the brief does not show the method; or it presents
settled values as the run's own decisions ("I'll do CSV first") with nothing tying them to the
person's words; or a settled value is shown as open or as the draft's.

## Judging note

Citing need not quote every clause; a brief that attributes the method to the person's message as a
whole and then lists it faithfully counts. Whether the brief also marks placement and lifetime as
inference, and what contrary grounds it carries, are not graded here. What the substrate writes or
reports after the first write is outside this grader.

## Not exercised

Turn 1 made no write and no hand-off, so there is no dispatch to precede. `proceed-observed` records
that failure; record this grader as not exercised.

## Arms

The bare arm has no brief obligation. Record whether it restated the request, or its own plan,
before its first write, as the baseline shape; it is not scored against this grader.
