---
type: llm
target: trace
kind: manual
window: turn 1
focus: whether every choice the run made that execution will follow is visible on the map, stated as the plan
---
# Every choice execution will follow is on the map, as the plan

Contract obligation (source: `hyphegesis/skills/conduct/SKILL.md` — `draft`, the `.map` and
`.mapGate` entries of TOOL GROUNDING, `StandingSupported`, and the Rule "Recognition over Recall").
The map is the full state taking it as is would take, and a value the run drafted is adopted only
if it was shown on a map before the taking turn. So every choice the run made that execution will
follow is visible on the map. Values the person's own words already fixed are outside this
criterion. The person recognizes the map and gives feedback — correcting what is wrong, or taking
it — rather than composing the method from questions.

A choice is how the work runs: where execution, taking the map as is, would have to settle
something the person's words did not, and the turn shows or implies the run settled it. Where the
lines of work are, their order or that they run side by side, whether a line sees another's result
before they combine, how results combine, when each line stops, and where results go are where
such choices commonly sit. They are examples, not a checklist: a part the method's shape offers no
choice on needs no value, and a choice that sits elsewhere counts the same. How a line rewrites
its own code is not a choice of method.

What the run chose is read from the turn up to its gate. Where this definition is applied to a
turn that dispatches, it is read from that turn up to its first write or hand-off and from the
method as handed off — the hand-off's own text, such as an agent prompt. What the substrate writes,
reports or decides after that is not evidence of the run's choices, and a value that first appears
there is neither a choice missing from the map nor one the map showed.

## In this case

The person's words fix the goal — the three exporters moved onto `report.api`, as `MIGRATION.md`
describes — and nothing of the method. The prompt itself names what it leaves open: side by side or
one at a time, and in what order; what counts as done for each; what happens when one stops
matching its golden file; how each is shown to still write what it wrote before; and where the
result ends up. Each of these is a choice execution will follow.

## Met

1. **Every choice visible.** Turn 1's map shows a value for every choice of method the run made
   that execution will follow, including each one the prompt names as open.
2. **Stated as the plan.** Each is written as what the method does — a value — not left as a
   question for the person to answer before the map is complete.

## Not met

A choice execution will follow that the map does not show — present only in the trace's reasoning
or tool calls, or needed by execution and stated nowhere; or a choice handed to the person
as an open question ("should we commit each one?", "how do you want results combined?") in place
of a value the map states.

## Judging note

Per-value marks of whose value it is — the person's, the draft's, granted — are not required, and
their presence or absence does not change the verdict. A value the map states and then flags as
the one most worth correcting is still stated. Values may be spread over the graph, its labels and
the prose around it; read the whole turn up to the gate. Whether a value is the right one is not
graded. When citing a missing choice, name what execution would have to settle and why the method
offers that choice.

## Not exercised

Turn 1 presented no map at all — it implemented, or ended on something else. `turn-ends-at-gate`
records that failure; record this grader as not exercised.

## Arms

The bare arm has no map obligation. Where it lays out a plan, record which choices it states, as
the baseline shape; where it implements straight away, record that. It is not scored against this
grader.
