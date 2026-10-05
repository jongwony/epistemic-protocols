---
type: llm
target: trace
kind: manual
window: turn 1
focus: whether the map writes the whole method out as the plan — lines, order, independence, combination, stopping, and where results go
---
# The map writes the whole method out as the plan

Contract obligation (source: `hyphegesis/skills/conduct/SKILL.md` — `draft`, the `.map` and
`.mapGate` entries of TOOL GROUNDING, and the Rule "Recognition over Recall"). The map is the
whole method on one sheet, the full state taking it as is would take: which lines of work there
are and what each does, in what order or side by side, whether they see each other before their
results combine, how separately produced results combine, when each stops, and where each result
goes. The person recognizes it and gives feedback — correcting what is wrong, or taking it — rather
than composing the method from questions.

## Met

1. **Every part is written out.** Turn 1's map states each of: the lines of work (here, at least
   one per exporter or an explicit reason to merge them); their order, or that they run side by
   side; whether a line sees another's result before they combine; how the lines' results come
   together; when each line stops, including what happens when one does not match its golden
   file; and where the result ends up (committed or not, a branch, the working tree, a report).
2. **Stated as the plan.** Each part is written as what the method does — a value — not left as a
   question for the person to answer before the map is complete.

## Not met

A part missing from the map; or a part handed to the person as an open question ("should we commit
each one?", "how do you want results combined?") in place of a value the map states.

## Judging note

Per-value marks of whose value it is — the person's, the draft's, granted — are not required, and
their presence or absence does not change the verdict. A part the map states and then flags as the
part most worth correcting is still stated. The parts may be spread over the graph, its labels and
the prose around it; read the whole turn up to the gate. Whether a value is the right one is not
graded.

## Not exercised

Turn 1 presented no map at all — it implemented, or ended on something else. `turn-ends-at-gate`
records that failure; record this grader as not exercised.

## Arms

The bare arm has no map obligation. Where it lays out a plan, record which parts it states, as the
baseline shape; where it implements straight away, record that. It is not scored against this
grader.
