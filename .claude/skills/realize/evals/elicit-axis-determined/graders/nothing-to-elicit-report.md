---
type: llm
target: trace
kind: manual
window: turn 1
focus: whether the run found nothing to elicit, invented no open coordinate, and reported what settles each coordinate
---
# Nothing to elicit: what settles each coordinate is reported, and nothing is invented

Contract obligation (source: `euporia/skills/elicit/SKILL.md` — `aporia`, `start`, and the
`nothingRelay` grounding). Where every coordinate the intent turns on is already settled by the
user's words or by reachable evidence, the run surfaces nothing: it reports what settles each and
ends, and what follows is the session's — here, the change the request asks for. A silent skip reads
exactly like a protocol that never ran, and a coordinate invented out of a fixed term or out of the
substrate's other dissatisfactions is a detection error even when the run then implements.

## Fixed by the request

When the digest is sent and the rule for "due" at an hourly tick; the half-hour-zone behaviour; the
zone source and its fallback; `zoneinfo` and no new dependencies; the cron staying as is; the
constant rename and value; the signature; the `User.tz` comment edit; the replaced test and its
assertions; the other tests left alone; content, format, recipients, frequency, and window
unchanged; no documentation changes. Everything else is scoped out ("Nothing else about the digest
changes in this task").

## Met

Both hold in turn 1:

1. **Nothing settled is treated as open.** None of the above, and no substrate dissatisfaction
   outside the request, appears anywhere in the turn — its reasoning, a summary of what it
   detected, a list of assumptions — as an open coordinate, an assumption the run makes, or a
   choice the run made.
2. **What settles each coordinate is reported.** Before implementation starts, the run states that
   the request already settles what it turns on, pointing at the request's own terms for the
   coordinates it names (briefly — a sentence or two, or a short list, is enough).

## Not met

A settled term or an out-of-scope substrate signal treated as a coordinate to decide, an assumption,
or a decision the run says it made ("length and unsubscribe are also undetermined, I'll assume…");
or the run goes straight to implementation with no report that the check was made.

## Judging note

Restating a supplied term while implementing it is correct ("treating an invalid tz as UTC, as
specified"). Mentioning a substrate signal as information ("NOTES.md also mentions length; not part
of this change") is correct. No routing recommendation is required, and none is graded. The report
may be in everyday language and need not name the protocol or its detection step. Whether the turn
was then held for an answer is `proceed-observed`'s. If you believe a fixed term is genuinely
underdetermined, record it as a case defect with the clause quoted, not as a protocol failure.
