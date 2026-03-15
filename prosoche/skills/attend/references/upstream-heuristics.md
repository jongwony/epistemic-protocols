# Upstream Routing Heuristics

Deficit-to-execution-blocking-pattern mapping for Sub-A0 UpstreamScan.

Only deficits whose unresolved state would directly affect execution results are surfaced (execution-blocking filter).

| DeficitCondition | ProtocolId | Execution-Blocking Pattern | Not Execution-Blocking |
|---|---|---|---|
| IntentMisarticulated | /clarify | Task description ambiguous to the point of producing wrong deliverable | Stylistic preference unclear |
| GoalIndeterminate | /goal | No verifiable end-state — materialized tasks would be ambiguous | Under-specified but actionable goals |
| BoundaryUndefined | /bound | AI vs user responsibility undetermined for critical execution params | Boundary exists but sub-optimal |
| ContextInsufficient | /inquire | Missing facts that would change task decomposition or tool selection | Nice-to-know context |
| FrameworkAbsent | /frame | Multiple valid approaches exist and choice affects deliverable structure | Aesthetic framework preference |
| MappingUncertain | /ground | Abstract instruction applied to concrete domain without validation | Analogy is illustrative, not load-bearing |

## Scan Order

Follows CANONICAL_PRECEDENCE order: clarify → goal → bound → {inquire, frame, ground}. Higher-precedence deficits are surfaced first — resolving them may eliminate downstream deficits.

## Execution-Blocking Filter

Conservative: when ambiguous whether a deficit is execution-blocking, err toward surfacing. The user can always select Proceed. The filter prevents noise from clearly non-blocking deficits (e.g., aesthetic framework preference when the task is well-defined).

Filter predicate: `blocking(d) ≡ ¬resolved(d) ∧ (∃ t ∈ T_potential: fails(t) ∨ harms(t))`
