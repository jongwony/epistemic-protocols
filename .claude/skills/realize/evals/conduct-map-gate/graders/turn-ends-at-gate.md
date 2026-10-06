---
type: llm
target: trace
kind: manual
window: turn 1
focus: whether turn 1 presents the map and ends at a gate the person can answer
---
# The map ends at a gate the person can answer

Contract obligation (source: `hyphegesis/skills/conduct/SKILL.md` — `start`, PHASE TRANSITIONS,
the `.map` and `.mapGate` entries of TOOL GROUNDING, and `Interaction.realization`). The first map
is presented, then `.mapGate`, and the turn is yielded: the person may say what the map got wrong,
anywhere on it, or take the method as shown or with what the same words change. Withdrawal stays
open to the person in their own words and is not among the gate's moves.

## Met

1. **A map.** Turn 1 shows the method as one sheet: the lines of work and how they order, see each
   other, combine, stop, and where their results go — as a graph, or as an indented outline naming
   what each line follows where no graph renders.
2. **A gate after it.** The turn ends on what it hands the person, and that hand-off opens, in the
   turn's own words, exactly two moves: correcting anything on the map, and taking it — as shown,
   or with changes in the same answer.
3. **Nothing after the gate.** No line of the method starts, and the turn does not answer its own
   gate or proceed as though the person had taken the map.

## Not met

The turn ends on a plan, a summary, or an announcement of what it will do next; or it asks only a
narrower question (one coordinate, a yes/no on the whole plan) with no opening to take the map or
correct it anywhere; or the gate also presents withdrawing or stopping here as a move; or it
presents the map and goes on to start the work.

## Pairing

`stop-observed` checks the trace and the tree for the same turn; a pass there with a fail here is
a stop without a gate. Where it is unreadable — a call to another agent or session, which the
case's environment does not offer, or a tree that went unread — this grader's item 3 decides
whether the method started. The taking case applies item 3 to its own turn 1 the same way, for
its `stop-then-proceed`.

## Arms

The bare arm carries no protocol and no gate obligation. Record what it did — implemented, laid
out a plan, asked — as the baseline shape; it is not scored against this grader.
