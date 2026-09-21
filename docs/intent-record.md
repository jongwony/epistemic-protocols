# Intent record — what a change in flight is for

A change in flight carries its direction in one record: what is wanted, why, under which constraints, and what is still open. The record is the unit's chart. A session that picks the work up reads it there instead of being told, and a follow-up born when the unit closes reaches it without anyone's recall. `AGENTS.md` §Settled Directions, **Intent binding** names where this repository keeps the record; an adopting project binds its own home and keeps this shape.

The record lives outside the tree. A file committed on the branch would sit in every diff, die at an unsettled moment, and reach no sibling branch working the same unit.

## Sections

Write these in order. Omit a section only when it would be empty, and say nothing in a section that another one already carries.

- **Problem** — the situation that made this change worth doing, in terms a reader outside the work can check. Cite the evidence: an issue, a pull request, a session id, an observed failure.
- **Proposed outcome** — what is true when the change has landed. Not the steps; the state.
- **Affected** — the surfaces, plugins, and pull requests this reaches, and the ones it deliberately does not.
- **Constraints** — what bounds the work: a value the author fixed, a cost being answered, a boundary the change must not cross. Each constraint says what it answers to, so a later reader can tell a decision from a habit.
- **Open questions** — what is not settled, and who settles it. An open question left here is visible to the next session; one left in a session is not.

## Lifecycle

- **Created** before a session other than the author's picks the work up, and normally when the direction is first settled enough to write down.
- **Revised** by a decision line on the record at the moment the direction changes — one line saying what was chosen, the reason in a clause, and what was set aside by name. A decision does not rewrite the sections above; the line is what a later reader dates the change by, and it is the current direction, not its history: the derivation behind it goes to the commit that lands the change.
- **Regrouped** when Open questions has accumulated more lines than it holds questions — items written at different moments, from different sources, each standing on its own. The section is rewritten as the independent axes the unit must decide, each naming the items it absorbed, and every item that is not an axis is classified by why it is not: a projection stays as a value of the axis that determines it, and one belonging to a different object leaves with its destination stated. This is the one revision that rewrites a section, and it changes no direction — a direction changed while regrouping is its own decision line, written first.
- **Closed** by an explicit act, never by the last merge on its own. The close leaves a closing note on the record: what landed, the commits that carry its then-record, and what is still open. A follow-up unit born at the close carries a relation to this record and a pointer to the closing note, so its first session starts from the direction rather than from a person's memory.
- **Kept.** The record is not deleted when the change lands. After the close it indexes the then-record; it no longer states a direction, and a session reads it as history.

## What does not go here

- **A then-record.** The derivation of a decision — the evidence weighed, the alternatives worked through, the provenance of a value — routes to the commit message (`AGENTS.md` §Settled Directions, Ledger binding). The decision line above keeps the choice and its one-clause reason because a reader needs those to act; it does not carry the derivation, and the record points at the commits that do.
- **A standing convention.** Anything that keeps binding after the close belongs on a surface that survives it: `AGENTS.md`, a file under `.claude/rules/`, or a packaged `SKILL.md`.
- **A transcript or a session dump.** The record carries the direction, not the deliberation that produced it. Point at the session and let the reader open it.
- **State.** Progress, status, and whether a check is green are read from their source at need, never copied here.

## Basis

The record earns its place under four conditions, and the lifecycle above is shaped to meet each: it is consulted whenever it would be relevant, so a session reads it before changing anything (constancy); it is reachable from where the session already stands, so the branch or pull request names it (accessibility); what it says is acted on without being re-derived, which is why it carries no state that could be stale (endorsement); and what it says was put there on purpose, which is why a decision line is written by the person who decided (past endorsement). The derivation and the sources are in the commit that landed this file.
