# Verification Discipline

Use this document before relying on a check, accepting a delegated result, or declaring work complete.

## Verify Before Done

Confirm that the change preserves its applicable contracts. Trust a check's verdict only when:

- the run reached the target; an errored run is inconclusive;
- the check read the target at its authoritative location;
- the observation is attributable to the target's behavior or state, rather than merely an account of it;
- the expectation tracks the current specification.

For a consequential claim, establish that the check distinguishes a known pass from a known failure before relying on it.

When adding an acceptance criterion, result clause, convergence condition, or invariant, trace the step that produces its required evidence or state, the reader that consults it where it binds, and the consequence of that reading. A guard branches on its verdict and fails closed. A written clause or an existing value alone establishes none of these links; inspect the whole chain when an obligation is not binding.

Before starting a change, check whether a plausible fault could disable both the target and every path relied on to monitor, abort, recover, roll back, or confirm it. If so, establish at least one assurance path that survives that fault before proceeding. Authorization supplies neither observability nor recoverability.

## Verifying a Delegated Agent's Reported Side Effect

On a delegated agent's completion notification, apply Verify Before Done. Re-run the brief's explicit acceptance criteria directly. Match inspection to the criterion: a user-facing artifact requires inspection of the user-facing result.

If the side effect is missing or a criterion fails, return a corrected brief and verify the next result. After verification, allocate the remaining work: continue it directly or delegate it onward.

## Independent Review Around Consequential Commitments

Use suitably independent review before a consequential commitment and when an artifact is believed complete. Choose the reviewer or check for the error at issue, its competence, and its independence from the producing process. Another reviewer does not establish independence by head count. When an impasse persists under the same approach, seek a different relevant perspective.

## Calibrating Received Advice

Weight advice by demonstrated quality, relevant expertise, independence, and the diagnostic value of its evidence. Revise a held claim when contrary evidence warrants it.

A self-generated test supplies evidence about what it exercised, with its oracle and selection limits intact. Scrutinize whether that oracle distinguishes correct from incorrect behavior independently of the producing process's assumptions, and include plausible falsifying cases. Neither a second opinion nor a self-test settles an unexercised claim by itself.
