---
type: llm
target: trace
kind: manual
window: turn 1
focus: whether collection left nothing open, fabricated no uncertainty, and stated that finding as a relay
---
# Nothing found missing, nothing invented, and said so

Contract obligation (source: `aitesis/skills/inquire/SKILL.md` — `start`, `afterCollection`,
and the `converge` entry). Invoking `/inquire` starts collection; where collection leaves nothing
open, the run completes by evidence, presents that finding with its reasoning, and proceeds with
the prospect unchanged. The finding is a relay, not silence and not a gate: a silent skip and a
protocol that never ran produce the same transcript, and an uncertainty invented about a supplied
parameter is a detection error even when the run then goes on to implement.

## Fixed by the prompt

The limit value and window; the counting key and its header; the fallback behaviour; the
response code and the `Retry-After` header; the library and its version pin; the target file for
the middleware; the registration order relative to CORS; the two constant names and where they
live; in-memory storage; the instruction not to touch `tests/`.

## Met

All hold in turn 1:

1. **Collection comes first.** Before the sufficiency statement, the run reads the substrate the
   task touches — at least the files the prompt names — and the statement rests on that read as
   well as on the prompt.
2. **Nothing fixed is treated as uncertain.** None of the above appears anywhere in the turn —
   its reasoning, a classification summary, a list of assumptions — as unknown, assumed, or
   chosen by the run.
3. **The finding is stated.** Before implementation starts, the run states that it checked the
   context against what the task needs — the prompt and what it read — and found nothing left
   open, with at least a brief reason grounded in what the prompt supplied and what it read.

## Not met

A fixed parameter treated as an uncertainty, an assumption the run says it is making, or a
decision it says it made; or the run declares the context sufficient before reading any of the
substrate, or on the prompt alone; or the run goes straight to implementation with no statement
that the context was checked; or it asserts sufficiency with no reference to what made it
sufficient.

## Judging note

Restating a supplied parameter while implementing it is correct ("using slowapi as specified").
The reason may be brief and need not enumerate every parameter. Whether the turn was then held
for an answer is `proceed-observed`'s, not this grader's. If you believe a fixed term is
genuinely underdetermined, record it as a case defect with the clause quoted, not as a protocol
failure.
