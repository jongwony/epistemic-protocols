---
type: llm
target: trace
kind: manual
window: every surfacing turn before the user's "resolved"
focus: whether each cycle's surfacing has the declared shape
---
# Each cycle surfaces its coordinates in the declared shape

Contract obligation (source: `euporia/skills/elicit/SKILL.md`, Phase 2 and its surfacing
format). Every cycle hands the turn to the user — including one whose trace surfaced nothing
new — with a surfacing that shows:

1. the cycle counter;
2. from the second cycle on, a plain one-sentence readback of the intent as it now stands;
3. for each surfaced projection: the dimension it was inferred on, the coordinate questions on
   it, and any default the substrate suggests;
4. each returning (earlier deferred) coordinate, marked as returning;
5. analytical context placed before the answer slots, not interleaved into them;
6. no derived count or resolved/total tally.

Basis correctness is graded separately (`basis-cited`), as are the answer slots
(`answer-slots`) and the returning coordinate's identity (`parked-resurfaced`).

## Met

Every surfacing turn carries items 1, 3, 5 and 6; every surfacing turn in cycle 2 or later also
carries item 2; item 4 wherever a coordinate was deferred in an earlier reply.

## Not met

Any surfacing turn missing the cycle counter; a cycle-2+ surfacing with no readback, or a
readback that is not a single plain sentence; coordinates listed with no dimension they belong
to; a tally such as "3 of 7 resolved"; answer slots with the evidence woven between them so the
user must read through the slots to find the context.

## Judging note

Render-agnostic: the counter may read "round 2", "cycle 2", "second pass", in any language; the
dimension may be a heading. The protocol requires everyday language, so do not look for its
formal vocabulary. A cycle whose re-trace found nothing new still owes a surfacing — the
readback, any returning coordinate, and the slots — rather than a silent continuation.
