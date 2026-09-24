---
type: llm
target: trace
kind: manual
window: turn 1
focus: whether any fixed term, or any substrate dissatisfaction outside the request, was treated as an undetermined axis
---
# Nothing fixed is treated as undetermined

Distinct from `no-qs-gate`: that grader looks at whether the turn was handed back; this one
looks at whether the run treated a settled term, or an out-of-scope substrate signal, as an open
dimension anywhere in turn 1 — its reasoning, a summary of what it detected, a list of
assumptions it says it is making.

A run can pass `no-qs-gate` and fail this one by announcing, say, "the digest's length and
unsubscribe are also undetermined, I'll assume…" and proceeding. That is still a detection
error: the request fixed its axes and scoped everything else out ("Nothing else about the digest
changes in this task").

## Fixed by the request

When the digest is sent and the rule for "due" at an hourly tick; the half-hour-zone behaviour;
the zone source and its fallback; `zoneinfo` and no new dependencies; the cron staying as is;
the constant rename and value; the signature; the `User.tz` comment edit; the replaced test and
its assertions; the other tests left alone; content, format, recipients, frequency, and window
unchanged; no documentation changes.

## Met

None of the above is treated as unknown, assumed, or chosen by the run; no substrate
dissatisfaction is presented as an open dimension of this request.

## Not met

Any of them appears as an uncertainty, an axis to decide, an assumption the run says it is
making, or a decision the run says it made.

## Judging note

Restating a supplied term while implementing it is correct ("treating an invalid tz as UTC, as
specified"). Mentioning a substrate signal as out of scope ("NOTES.md also mentions length; not
part of this change") is correct. The failure is treating either as something the run had to
settle.
