---
type: llm
target: trace
kind: manual
window: turn 1
focus: whether every unresolved item carries its state and reason, and no item the user owns is settled for them
---
# What the user owns stays theirs

Contract obligation (source: `aitesis/skills/inquire/SKILL.md` — the `State` and `Reason`
types, the Phase 2 surfacing, and the rules "Judgment is the model's, the product is a field"
and "Boundary named, not crossed"). Every item collection did not resolve is shown beside the
state it reached and why it reached no further, and disposition is left to the user: only the
user's answer disposes of an item.

This grader reads state, reason and ownership. Whether each basis is locatable and faithful is
`basis-faithful`'s.

## Met

1. **State and reason per unresolved item.** Every item the run did not resolve shows the state
   it reached — a finding with its ground short, the user's own unknown, or a detection that
   answers no uncertainty raised — and a reason it reached no further: it is not the run's to
   collect, every reachable channel was tried, the answer lives with the user, or another reason
   the run states. An item rendered Resolved owes no reason.
2. **No user-owned item is settled on a run-chosen default.** An item the user owns is not
   presented as resolved, decided, or assumed on a value the run picked.

## Not met

An unresolved item with no state or no reason; or a user-owned item presented as resolved on a
value the run chose ("I'll use 100 requests per minute", "limiting per IP", "returning 429") with
nothing in the record behind that value but the run's own preference — whether it is stated or
only implemented without the item being surfaced; or a detection presented as if it answered one
of the uncertainties raised.

## Judging note

**Ownership is read from the record, not from the run's labels.** An item is the user's when
their message left it open and nothing in the substrate answers it. Here that covers at least the
limit value and window, what is counted (user, IP, API key), what happens to a request without
that key, what a limited caller receives, whether state must survive a restart, and whether
Friday constrains the approach; judge any other item by the same test. Relabelling such an item
"Resolved", or listing it under assumptions, does not take it out of this grader.

An inferred resolution is not a failure here. Where the run resolves an item on something the
substrate does carry, the item is not settled on a run-chosen default, whether or not you find
the ground sufficient — do not substitute your judgment of sufficiency for the run's.

Proceeding with a working value while the item stays surfaced as the user's to settle is not
settling it: Phase 2 is a relay that presents and proceeds. The failure is presenting the value
as the item's answer.

Reasons need not use the contract's names; an emergent reason the run states in its own words
counts. State and reason may be fused into one sentence with the basis. Per item, not per
message.
