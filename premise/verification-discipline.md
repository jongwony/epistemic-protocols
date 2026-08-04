# Verification Discipline

This document covers what makes a check's verdict actually trustworthy, and how that same discipline specializes to verifying a delegated agent's reported side effects rather than trusting its account of having checked them.

## Verify Before Done

Confirm that a change preserves the contracts already in place before declaring the work done. Trust a check's verdict only when it is forced by the actual target — all of the following must hold:

- the check reached the target at all — an errored run is inconclusive, not a verdict
- it read the target's state at that state's own authoritative location
- the thing it observed has no producer other than the target's own behavior — narration and printed text are neither execution nor state, and cannot stand in for either
- the expectation being checked against tracks the current specification, not a stale one

When the claim genuinely matters, demonstrate the check itself with one known-pass run and one known-fail run before trusting what it reports.

A guard must additionally branch on its own verdict and fail closed — a check that nothing downstream branches on is decoration, regardless of how correct its verdict is.

The dual obligation binds in the other direction: when adding a clause to a result equation, an acceptance criterion, a convergence condition, or an invariant set, name the step that actually produces that clause before declaring the work done. A clause with no producing step is decoration too, and an ordinary static check passes on both failure modes equally, so it will not catch this for you. This recurs from authoring order rather than from carelessness: the clause itself is a single line to write, while its production path is a real decision about which stage computes what — so the clause lands on the page, and the decision about who actually produces it gets deferred past the point of calling the work done.

Before starting a change, check whether a plausible fault introduced by that same change could disable both the target and every path relied on to monitor, abort, recover, roll back, or confirm it. If so, do not start until at least one end-to-end assurance path would survive that fault. Being approved to proceed grants the authority to act — it does not, by itself, grant either observability into what happened or the ability to recover if it goes wrong.

## Verifying a Delegated Agent's Reported Side Effect

This is a named specialization of Verify Before Done, for the case where the work being checked was done by another, delegated agent rather than by the reader directly.

A completion notification from a delegated agent is the only interface back to it — before that notification arrives, its progress is genuinely unknown, and that should be said plainly rather than guessed at when asked. On notification, confirm the work actually happened at its authoritative location (a commit that actually moved, a target file that actually changed, an artifact that now actually exists) before trusting the report — a report can read as successful while nothing in fact changed. Existence is the floor, not the bar: where the original brief carried explicit acceptance criteria, re-run those criteria directly, because an agent's account of having already checked them is narration, and narration is not the check, however confident it reads. Weight how deep to look by what the criterion actually guards — a rendered or user-facing result earns a real look, not just a green exit code from an automated run. If the side effect is missing, or a criterion fails on re-check, re-issue the work with a corrected brief and re-verify, rather than accepting the report as it stands. Once verified, re-arrange whatever work remains: continue it directly, or hand the remainder to a further delegated pass.
