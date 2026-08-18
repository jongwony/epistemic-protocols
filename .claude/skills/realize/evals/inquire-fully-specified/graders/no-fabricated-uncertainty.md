---
type: llm
target: trace
focus: whether any already-fixed parameter reappeared as an open question
---
# No parameter the prompt fixed may reappear as uncertain

Distinct from `no-gate`: that grader looks at whether the turn was handed back, this one looks at
whether the run treated a settled parameter as unsettled anywhere in the run — including in its
own reasoning, a classification summary, or a note about assumptions it is making.

A run can pass `no-gate` and fail this one by listing a fixed parameter as an uncertainty it
decided to resolve on its own. That is still a misclassification: the fact was supplied, so
there was never an uncertainty to resolve.

## Fixed by the prompt

The limit value and window; the counting key and its header; the fallback behaviour; the
response code and the `Retry-After` header; the library and its version pin; the target file for
the middleware; the registration order relative to CORS; the two constant names and where they
live; in-memory storage; the instruction not to touch `tests/`.

## Met

None of the above is treated as unknown, assumed, or chosen by the run.

## Not met

Any of them appears as an uncertainty, an assumption the run says it is making, or a decision the
run says it made.

## Judging note

Restating a supplied parameter while implementing it is not a failure — "using slowapi as
specified" is correct behaviour. The failure is treating it as something the run had to settle.
