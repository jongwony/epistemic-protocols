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

The same obligation binds in the other direction: when adding a clause to a result equation, an acceptance criterion, a convergence condition, or an invariant set, name the step that actually produces that clause before declaring the work done. A clause with no producing step is decoration too, and an ordinary static check passes on both failure modes equally, so it will not catch this for you. This recurs from authoring order rather than from carelessness: the clause itself is a single line to write, while its production path is a real decision about which stage computes what — so the clause lands on the page, and the decision about who actually produces it gets deferred past the point of calling the work done.

A third break sits between those two, and it leaves the fewest marks: the value is produced, and something downstream would act on it, but nothing reads it at the moment it would bind. A record written and never consulted where it applies is decoration in the same way — the log accumulates, the rule sits loaded in context, the decision is on the page, and no step reaches for any of them at the point where they would change what happens next. This is the hardest of the three to see from outside, because the value is right there and the surface reads as complete; what is missing is a reader at the binding moment, and a check that looks for the value finds it and passes.

Read as one chain, the obligation names all three links: the step that produces the value, the step that reads it where it binds, and what turns on what was read. Broken at any one link a norm still exists, and still reads from outside as though it were binding — so a norm that is not in fact binding warrants checking every link rather than the one that failed last time.

Before starting a change, check whether a plausible fault introduced by that same change could disable both the target and every path relied on to monitor, abort, recover, roll back, or confirm it. If so, do not start until at least one end-to-end assurance path would survive that fault. Being approved to proceed grants the authority to act — it does not, by itself, grant either observability into what happened or the ability to recover if it goes wrong.

## Verifying a Delegated Agent's Reported Side Effect

This is a named specialization of Verify Before Done, for the case where the work being checked was done by another, delegated agent rather than by the reader directly.

A completion notification from a delegated agent is the only interface back to it — before that notification arrives, its progress is genuinely unknown, and that should be said plainly rather than guessed at when asked. On notification, confirm the work actually happened at its authoritative location (a commit that actually moved, a target file that actually changed, an artifact that now actually exists) before trusting the report — a report can read as successful while nothing in fact changed. Existence is the floor, not the bar: where the original brief carried explicit acceptance criteria, re-run those criteria directly, because an agent's account of having already checked them is narration, and narration is not the check, however confident it reads. Weight how deep to look by what the criterion actually guards — a rendered or user-facing result earns a real look, not just a green exit code from an automated run. If the side effect is missing, or a criterion fails on re-check, re-issue the work with a corrected brief and re-verify, rather than accepting the report as it stands. Once verified, re-arrange whatever work remains: continue it directly, or hand the remainder to a further delegated pass.

## Independent Review Around Consequential Commitments

Use review that is suitably independent of the work itself around two moments: a consequential commitment being made, and an artifact believed to be finished. Independence matters because self-review and the process that produced the artifact tend to share the same blind spots the review is meant to catch; a second, differently-situated check does not share them by default, though its value depends on how genuinely independent it actually is. When ongoing monitoring surfaces an impasse that does not resolve with further work from the same vantage point, seek additional expertise rather than continuing to iterate from that same position.

This draws on advice-aggregation research into when and how much a second opinion improves a decision, and on software-engineering guidance that self-review complements review by others or by tooling rather than replacing it — guidance that frames self-review this way for secure software development specifically (NIST SP 800-218). Hold the limit the second-opinion literature itself reports: the benefit of an additional review is not constant — it varies with the domain, the reviewer's independence and competence, and the kind of error being screened for — and the literature does not support treating consultation as universally warranted regardless of context.

## Calibrating Received Advice

Weight advice received from any source — a person, a tool, another agent — by the source's demonstrated quality, its relevant expertise, its independence from the work under review, and the diagnostic value of whatever evidence it actually offers, rather than granting all incoming advice the same fixed presumption of correctness merely because it arrived. Both directions of the error are real: systematically discounting good advice loses information that was actually reliable, and systematically over-weighting poor advice imports error under the guise of caution. Update a held claim when reliable evidence to the contrary appears, rather than defending the claim against it.

Treat a test generated by the same process being tested as limited evidence that needs independent scrutiny or independent validation — and state the limit carefully rather than overclaiming it: a well-designed self-generated test does provide some genuine evidence about the behavior it exercises. The correct claim is that this evidence is weaker than an independently constructed, diagnostically valid test would provide, not that a self-test provides nothing at all. This is the oracle problem from software testing: a test's verdict is only as good as the mechanism it uses to distinguish correct behavior from incorrect behavior, and that oracle can itself be incomplete or systematically biased in the same direction as the thing it tests. A related hazard is confirmation bias, operationalized as the positive-test strategy (after Klayman and Ha): a tendency to seek out and construct tests that confirm an existing belief rather than tests genuinely capable of falsifying it — exactly the failure mode an independently constructed oracle is meant to guard against.
