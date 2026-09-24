---
type: llm
target: trace
kind: manual
window: turn 1
focus: whether the aporia check let the run into the substrate pass without deactivating it
---
# Aporia detected: the run opens, silently

Contract obligation (source: `euporia/skills/elicit/SKILL.md`, detection step and its two
exits). Detection is the sole activation precondition. When the intent seed leaves its axes
undetermined, the run proceeds *silently* into substrate access; only the negative exit — axes
already determined, or nothing to read — surfaces a scan result, recommends a route, or invites
the user to articulate further or withdraw.

The prompt names a dissatisfaction ("isn't right") and says outright that the user has not
worked out which parts matter. No axis is fixed. The directory holds decision records,
conventions, notes and history. Both exits' conditions for deactivation are absent.

## Met

Turn 1 goes from the request into reading the directory, and the first thing handed to the user
is the surfacing of decision coordinates (graded by `qs-presented`).

## Not met

Any of:

- the run reports a scan result instead of surfacing coordinates — "this is already clear",
  "this is really a question for <another protocol>", a routing recommendation — and stops or
  goes on to implement;
- the run asks the user to articulate the request further, or to withdraw it, *before* reading
  the substrate;
- the run asks permission to run the protocol at all. It was invoked by the user; the
  confirm-or-decline reading of a first surfacing applies only where the AI activated it on its
  own.

## Judging note

A short statement of intent ("let me look through the repo and your notes first") is narration,
not a surfaced scan result, and passes. Judge what the turn hands back, not whether the run
named its detection step.
