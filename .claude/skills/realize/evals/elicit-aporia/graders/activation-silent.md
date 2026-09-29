---
type: llm
target: trace
kind: manual
window: turn 1
focus: whether the detection step let the run open rather than closing it with a nothing-to-elicit report
---
# Aporia detected: the run opens, silently

Contract obligation (source: `euporia/skills/elicit/SKILL.md` — `aporia`, `start`, and the
`nothingRelay` grounding). Detection is the sole activation precondition. When the user holds a
direction but has not fixed which decisions it turns on, the run opens and surfaces coordinates;
only where every coordinate is already settled by the user's words or by reachable evidence does it
report what settles each and end without surfacing.

The prompt names a dissatisfaction ("isn't right") and says outright that the user has not worked
out which parts matter. Nothing is settled.

## Met

Turn 1 goes from the request into the run and hands the user coordinates to answer.

## Not met

Any of:

- the run reports that nothing is left to elicit ("this is already clear") and stops or goes on to
  implement;
- the run asks the user to articulate the request further before raising any coordinate;
- the run asks permission to run the protocol at all. It was invoked by the user; the
  confirm-or-decline reading of a first surface applies only where the run activated on its own.

## Judging note

A short statement of intent ("let me look through the repo and your notes first") is narration and
passes. Judge what the turn hands back, not whether the run named its detection step.
