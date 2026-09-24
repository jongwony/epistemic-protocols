---
type: llm
target: trace
kind: manual
window: the subject turns after the oracle's first reply
applies_when: the oracle deferred a coordinate in reply 1 (its policy always defers exactly one when any coordinate is surfaced)
focus: whether the deferred coordinate returns as itself
---
# A deferred coordinate comes back as itself

Contract obligation (source: `euporia/skills/elicit/SKILL.md` — the resurface step, the
parked-coordinate identity rule, the mode-state entry for parked coordinates, and the
termination fold):

- a coordinate the user deferred is brought back at **every** later surfacing as the same
  question with the same basis, marked as returning — not re-derived, reworded into a different
  question, or merged into a new one;
- it leaves the waiting set only when the user gives it a value, or at termination, where it is
  folded into the residual as itself;
- it is kept apart from projections the run itself held back for thin basis: those are
  re-derived on a later cycle; a deferred coordinate is not.

## Met

In the next surfacing after reply 1 (and each one after it until a value is given), the deferred
coordinate appears:

1. marked as returning (any wording: "back from last round", "you parked this");
2. asking the same thing as when it was deferred — same subject, same choice offered, wording
   recognizably the same;
3. with the same basis it was first shown with;
4. not presented as newly discovered and not silently answered with a default.

If the run converges before any later surfacing occurs, the deferred coordinate instead appears
in the convergence residual, as itself.

## Not met

The deferred coordinate is missing from a later surfacing while still unanswered; returns as a
different question (a different subject, a changed option set, or split/merged with another
coordinate); returns with a different or missing basis; returns unmarked as if new; or is
treated as answered with a value the user never gave.

## Not applicable

The run never reached a second surfacing and never converged (for example, it implemented after
turn 1). Record N/A; the failure is already visible in `gate-stopped` or `convergence-presented`.

## Judging note

Minor rewording that keeps the subject and options is identity; changing what is being asked is
not. The oracle's deferral line is fixed ("Not sure yet — ask me again later."), so locate the
deferred coordinate from reply 1 and compare its first and returning renderings side by side.
