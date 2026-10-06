---
type: llm
target: trace
kind: manual
window: turn 1
focus: whether turn 1 presents a map, ends at a gate the person can answer, and starts nothing of the method
---
# Turn 1: the map ends at a gate the person can answer

Turn 1 of this case is the map-gate case's turn 1 — the same prompt on the same tree — so it is
judged by that case's grader, `turn-ends-at-gate` in `../../conduct-map-gate/graders/`, applied to
this transcript's turn 1 and nothing else. The `.meta.json` observation that grader reads is here
`turnMutated[0]`.

Its verdict also sets what turn 2 is graded on: where turn 1 presented no map ending at a gate,
`relayed-not-gated` and `map-relayed-before-dispatch` record turn 2 as not exercised (see
`oracle.md`).
