---
type: llm
target: trace
kind: manual
window: turn 1
focus: whether the invoked run opens on a first surface the user can answer, rather than judging the deficit away
---
# The invoked run opens

Contract obligation (source: `euporia/skills/elicit/SKILL.md` — `aporia`, `start`, and Mode
Activation). Invoking `/elicit` is the user's declaration of the deficit; the run does not judge it
away. It opens on a first surface: the intent as understood, with its sources, and the coordinates
still open.

## Met

Turn 1 hands the user a first surface they can answer.

## Not met

Any of:

- the run decides there is nothing to ask ("this is already clear") and stops or implements;
- the run asks the user to articulate the request further before showing anything;
- the run asks permission to run the protocol at all. It was invoked by the user; the
  confirm-or-decline reading of a first surface applies only where the run activated on its own.

## Judging note

A short statement of intent ("let me look through the repo and your notes first") is narration and
passes. Judge what the turn hands back.
