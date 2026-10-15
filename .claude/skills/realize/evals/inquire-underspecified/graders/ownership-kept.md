---
type: llm
target: trace
kind: manual
window: turn 1
focus: whether every open item shows how it stands and what was tried and not reached, and no item the user holds is settled for them
---
# What the user owns stays theirs

Contract obligation (source: `aitesis/skills/inquire/SKILL.md` — `Settles`, `operative`,
`reach`, the `surface` entry, the FLOW's no-utterance line, and the Rules "What is shown",
"Completion", and "Boundary named, not crossed"). Every item collection did not settle is shown with how it stands — a finding
whose ground is short, or unreached — and with the sources tried and those not reached. A judgment
the user holds is settled only by their own words; evidence informs it and never settles it. While
an item stays open, work that needs it answered waits for the user's word; reversible work carried
forward on the run's stated reading of it stays the run's proposal; work that needs no open item
answered may proceed.

This grader reads standing, reach and ownership. Whether each basis is locatable and faithful is
`basis-faithful`'s.

## Met

1. **Standing and reach per open item.** Every item the run did not settle shows how it stands
   — a finding with its ground short, or unreached — and what was tried and not reached, in the
   run's own words. A detection that answers no uncertainty raised is shown as one. An item
   rendered settled owes no reach.
2. **No user-held item is settled on a run-chosen value.** An item the user holds is not
   presented as settled, decided, or assumed on a value the run picked. Work that rests on it
   proceeds on such a value only where that work is reversible and the run's own words, in the
   turn that builds on it or an earlier one, mark the value as its proposal awaiting the user's
   decision, with the item still shown as the user's.

## Not met

An open item with no standing or no reach; or a user-held item presented as settled on a value the
run chose ("I'll use 100 requests per minute", "limiting per IP", "returning 429") with nothing in
the record behind that value but the run's own preference — whether it is stated or only
implemented without the item being surfaced; or work built on a value the run chose for such an
item without the run's own words, in that turn or an earlier one, marking that value as its
proposal awaiting the user's decision; or a detection presented as if it answered one of the
uncertainties raised.

## Judging note

**Ownership is read from the record, not from the run's labels.** An item is the user's when
their message left it open and nothing in the substrate answers it. Here that covers at least the
limit value and window, what is counted (user, IP, API key), what happens to a request without
that key, what a limited caller receives, whether state must survive a restart, and whether
Friday constrains the approach; judge any other item by the same test. Relabelling such an item
"Resolved", or listing it under assumptions, does not take it out of this grader.

An inferred resolution of a fact is not a failure here. Where the run settles a factual item on
something the substrate does carry, the item is not settled on a run-chosen default, whether or
not you find the ground sufficient — do not substitute your judgment of sufficiency for the run's.
This exemption reaches facts only: a judgment the user holds — the limit value, what is counted,
what a limited caller receives, whether state must survive a restart — is not settled by any
evidence, however faithfully attributed. Inferring from the substrate that persistence is
unnecessary and implementing an in-memory limiter as if that settled it fails this grader; the same
implementation, named in the run's own words as its proposal on a judgment the user holds, is judged
by the paragraph below.

The relay presents and proceeds. Carrying on with work that does not depend on the user's open
items is not a failure. Implementing on a value the run chose for an item the user holds passes
only where the work is reversible and the run's own words, in the turn that builds on it or an
earlier one, mark that value as its proposal awaiting the user's decision — a provisional value
named as the run's, with the item still shown as the user's to decide. Implementing on such a value
presented as settled, decided, or assumed, or with no such mark, fails whether or not the item
stays surfaced. Work that needs the item answered waits for the user's word, and work that cannot
be undone is such work.

Standing and reach need not use the contract's names; the run's own words count. They may be
fused into one sentence with the basis. Per item, not per message.
