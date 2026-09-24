---
type: llm
target: trace
kind: manual
window: turn 1
focus: whether the negative detection exit was stated as a relay rather than skipped or gated
---
# The detection finding is stated, then the run proceeds

Contract obligation (source: `euporia/skills/elicit/SKILL.md`, the detection step's negative
exit and its tool grounding). With no aporia — the intent's axes already determined — the
protocol does not activate. It surfaces its scan result as a relay (present, then proceed):
when the intent is axis-determined it gives a routing recommendation toward whatever handles
that axis; it opens no gate.

## Met

Before implementation starts, turn 1 states that the request already fixes what it is about
(and, here, its values too), with at least a brief reason grounded in the request — and then
carries on. Either of these is an acceptable routing outcome:

- a recommendation naming where the remaining work belongs, stated without waiting for assent;
- a statement that nothing remains to route, since the request also supplies its values.

## Not met

- The run goes straight to implementation with no statement that the check was made: a silent
  skip reads exactly like a protocol that never ran.
- The finding is stated as a question that holds the turn ("this looks determined — shall I
  proceed?", "want me to hand this to X?").

## Judging note

The finding may be one or two sentences in everyday language; it need not name the protocol,
the detection step, or any other protocol by its command. A mention of something the substrate
shows (for example that `NOTES.md` also complains about length) is allowed *as information in
the relay* — whether it was turned into an open question is `no-qs-gate`'s and
`no-fabricated-aporia`'s to judge.
