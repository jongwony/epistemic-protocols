---
type: llm
target: trace
kind: manual
window: the subject turn that answers the oracle's "resolved" reply
focus: whether every value on the closing record rests on a turn of the user's and says who proposed it and how it stood
---
# Every recorded value cites the user's turn, its proposer, and how it stood

Contract obligation (source: `euporia/skills/elicit/SKILL.md` — `standingCoord`,
`StandingSupported`, `operative`, `Recorded`, `record`, and the convergence evidence). A value
enters the record only on a turn of the user's that makes it stand, and the record carries, for
each value, who first put it forward (the user, or the run) and how it came to stand: the user's
own words set it, the user adopted a proposal the run had shown as its own, or a grant the user
gave reaches the run's choice.

The record is graded, not the screen: how coordinates were shown along the way, how many rounds
there were, and how the answer slots were laid out are not judged here.

## Met

In the turn after the oracle's "resolved" line, the run's closing record — the read-back and the
trace, in whatever form — lets a reader find, for every value it holds:

1. **the user's turn it stands on** — which reply gave or took it (a reply number, a quotation, or
   an unambiguous pointer to one reply);
2. **who first put it forward** — the user, or the run (a default, a value from the domain's
   practice, a reading of the notes), read from where the value first appears in the transcript;
3. **how it stood** — set by the user (a value nobody had put forward), adopted from the run's
   proposal, or chosen by the run under a grant.

Each of the three agrees with the transcript: the cited reply does give or take that value; a value
the run put forward first is recorded as the run's proposal even where the oracle's reply writes it
out in full; and a value first put forward by the oracle is not labelled as the run's.

## Not met

Any recorded value with no recoverable user turn; a value attributed to a reply that does not give
or take it; a value the run first put forward recorded as set by the user; a value the oracle first
put forward recorded as the run's proposal; a closing record that omits who proposed each value or
how it stood.

## Not applicable

The oracle never sent "resolved". Record N/A with the reason; `gate-stopped` carries whether the
run stopped at all.

## Judging note

The oracle's "No preference — keep whatever it does today" sets "unchanged from today" unless the
run had put that forward as a default, in which case it adopts it. A value from Table T that matches
a default the run had shown earlier is adopted, whether the reply points at it or writes it out.
Rendering is free — a table, a list, inline marks — as long as each value's three facts are
recoverable.
