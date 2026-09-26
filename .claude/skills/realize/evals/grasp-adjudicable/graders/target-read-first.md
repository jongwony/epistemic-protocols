---
type: tool_used
target: trace
kind: deterministic
window: turn 1
predicate: turn 1 contains at least one read of the fixture -- Read, Grep or Glob on Claude; a read-like shell command outside the plugin install directory on Codex
---
# The target is read before anything is adjudicated

Contract obligation, shared by both forms of `/grasp`: the comprehension target must be present
and quotable (`requires: target_exists(R)`), and every adjudication against an answer is drawn
from the target itself. The list form orients on the target in Phase 0 and attaches the material
an adjudication was drawn from; the Lean form's `grounding .route` reads the target before the
route map, and every `Adjudication` carries a `Measure` quoted from it.

## Predicate

At least one read of the fixture occurs in turn 1. An adjudication needs an answer to adjudicate,
and the first answer arrives only in the user's second message, so a read inside turn 1 precedes
every adjudication the run could make. Reads of the protocol's own `SKILL.md` or anything under
the plugin install directory never count.

## Known limits

Occurrence, not coverage: one read of `app/main.py` satisfies it. Whether a later correction rested
on what was actually read is `correction-quotes-target`'s question, or `no-verdict-names-need`'s in
the negative case. On Claude a read through `Bash` (`cat`, `sed`) is not counted; the predicate
prefers a false negative to crediting a shell command it cannot classify.
