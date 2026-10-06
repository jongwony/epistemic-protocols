---
type: llm
target: trace
kind: manual
window: turn 2, from the reply to its first write or hand-off
focus: whether the closing turn relays the map and proceeds, rather than presenting it at a gate
---
# The taking relays the map; it does not gate it

Contract obligation (source: `hyphegesis/skills/conduct/SKILL.md` — the FLOW's taking line,
CONVERGENCE, the `.relay`/`.converge` and `.handoff` entries of TOOL GROUNDING, and
`ResolutionSupported`). A taking settles the method, so the map is
presented as a relay — an Extension, which proceeds — and the method is handed off in the same
turn without waiting; whatever the taking turn changed is carried on that map's ledger rather than
drawn into a map that waits.

## Met

Between the reply and the first write or hand-off of turn 2, the turn asks the person nothing
about the method: no gate to correct or take the map, no request to confirm the change, no
coordinate to settle before the work starts. Turn 2 reaches its dispatch.

## Not met

Turn 2 presents the map at a gate, or asks for confirmation, and stops there with no write; or it
presents the map at a gate and then proceeds anyway in the same turn — the map was shown as waiting
even though the turn did not wait.

## Not exercised

Turn 1 presented no map ending at a gate (see `oracle.md`), or the run ended at turn 1. Record it
under this grader; it is neither met nor not met.

## Judging note

Presenting the map again in the closing turn is expected; what separates a relay from a gate is
whether the person is asked to answer it. Whatever the substrate says or asks after the work starts
— its closing report, or something it returns to the person there — is the substrate's and outside
this grader. `stop-then-proceed` reads the trace and tree half; where turn 2 leaves it unreadable
— an agent or session call with no write — this grader decides whether that call handed the method
off.

## Arms

As for `map-relayed-before-dispatch`: the bare arm is recorded where it reaches turn 2, not scored.
