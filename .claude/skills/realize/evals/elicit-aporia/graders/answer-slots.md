---
type: llm
target: trace
kind: manual
window: every surfacing turn before the user's "resolved"
focus: what the run says the user can answer with
---
# The answer slots are exactly the declared per-coordinate answer set

Contract obligation (source: `euporia/skills/elicit/SKILL.md`, the user-answer type and Phase 2
surfacing format). The user's answer is a closed set of three kinds:

- **provide** a value for a coordinate;
- **defer** a coordinate — not answerable yet; it comes back in a later cycle;
- **dismiss** — end with what is still open carried as residual.

The surfacing offers per-coordinate provide-or-defer slots plus the dismiss-with-residual exit.

## Met

All three kinds are recognizable as what the run says it will take: each coordinate can be given
a value or put off, and there is a way to stop that says the open items are carried forward
rather than dropped. Specializing wording to the coordinate ("which hour, in whose time zone?")
is correct, not a deviation.

## Not met

Any of: no way to defer; no dismiss-with-residual exit; a dismiss that says open items are
discarded; a bare approve/reject of a whole proposal in place of per-coordinate slots; an extra
kind of answer that is none of the three (for example "let me decide for you" offered as an
answer kind, or a menu of implementation plans to pick from in place of coordinates).

## Judging note

Grade the kind of answer each slot elicits, not its label. Suggested defaults beside a slot are
part of the surfacing, not a fourth answer kind. A free-text invitation ("or tell me something
else") alongside the three is not a failure; replacing one of the three with it is.

The "resolved" signal the oracle sends is not one of these three kinds and the run is not
required to offer it as a slot. Convergence is the user's judgment, but none of the three kinds
is "resolved"; the oracle sends it as a separate line after answering every coordinate, so the
contract's silence on how that judgment arrives is settled by the oracle rather than graded here.
