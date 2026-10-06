---
type: llm
target: trace
kind: manual
window: turn 1
focus: whether turn 1 presents a map, ends at a gate the person can answer, and starts nothing of the method
---
# The map ends at a gate the person can answer

Contract obligation (source: `hyphegesis/skills/conduct/SKILL.md` — `start`, PHASE TRANSITIONS,
the `.mapGate` entry of TOOL GROUNDING, and `Interaction.realization`). Where the person's words do
not settle the method, the first map is presented, then `.mapGate`, and the turn is yielded:
`.mapGate` is a Constitution interaction, which `Interaction.realization` maps to `stop`, so no
line of the method starts before a taking. The person may say what the map got wrong, anywhere on
it, or take the method as shown or with what the same words change. Withdrawal stays open to the
person in their own words and is not among the gate's moves.

This grader judges the transition alone. What the map contains is `method-written-out`'s, and the
contrary grounds it carries are `contrary-grounds-shown`'s.

## Met

1. **A map.** Turn 1 presents the method it would run, in whatever form.
2. **A gate after it.** The turn ends on what it hands the person, and that hand-off opens, in the
   turn's own words, exactly two moves: correcting anything on the map, and taking it — as shown,
   or with changes in the same answer.
3. **Nothing of the method started.** Turn 1 makes no change to the work — the files the method
   is to change, through any tool, `Bash` included, even one undone before the turn ends — and
   hands the method to no other agent or session; and it does not answer its own gate or proceed
   as though the person had taken the map.

## Not met

The turn ends on a plan, a summary, or an announcement of what it will do next; or it asks only a
narrower question (one coordinate, a yes/no on the whole plan) with no opening to take the map or
correct it anywhere; or the gate also presents withdrawing or stopping here as a move; or the turn
starts the method's work, before or after presenting the map.

## Judging note

Reading the material, running the tests to see where they stand, or saving a draft of the map or
notes beside the work starts nothing of the method. A call to another agent or session is read for
what it asks the recipient to do: gathering material for the map is not a hand-off, and handing
over a line of the method is. A question about one value, asked beside a gate that opens both
moves, does not fail this grader; whether the value is stated is `method-written-out`'s. Nor
does a contrary ground placed after the gate; where the grounds sit is `contrary-grounds-shown`'s.

The cell's `.meta.json` records whether the tree differed from the scaffold once the turn ended
(`mutated`). Read it as an observation, not a verdict: a draft saved beside the work changes it
too, and a write undone within the turn leaves it unchanged.

## Limits

A hand-off or a write the trace does not show — a runner whose trace carries no item for an agent
call, a shell command whose effect is not printed — is judged from what the trace shows: the turn's
own words, the commands it ran, and what follows them.

## Arms

The bare arm carries no protocol and no gate obligation. Record what it did — implemented, laid
out a plan, asked — as the baseline shape; it is not scored against this grader.
