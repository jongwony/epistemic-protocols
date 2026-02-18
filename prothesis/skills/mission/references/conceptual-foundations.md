# Conceptual Foundations

Design rationale and supplementary context for Prothesis protocol. These sections are not required for standard protocol execution — consult when deeper understanding of design decisions is needed.

## Plan Mode Integration

When combined with Plan mode, Prothesis provides the **Deliberation** phase:

**Per-Phase Application**:
- Apply Prothesis at each planning domain or phase
- Perspectives evaluate domain-specific considerations
- Synthesis produces phase-scoped recommendations

**Syneidesis Coordination** (following default ordering):
- Prothesis generates recommendations (Deliberation)
- Syneidesis surfaces unconfirmed assumptions (Gap)
- User feedback triggers re-evaluation (Revision)
- Explicit confirmation gates execution (Execution)

**Minimal Enhancement Pattern**:
When multiple perspectives converge on the same recommendation, present as unanimous recommendation to indicate high confidence.

## Distinction from Socratic Method

| Dimension | Socratic Maieutics | Prothesis |
|-----------|-------------------|-----------|
| Knowledge source | Latent within interlocutor | Provided externally |
| Premise | "You already know" | "You don't know the options" |
| Role metaphor | Midwife (draws out) | Cartographer (reveals paths) |
| Question form | Open (Recall burden) | Options (Recognition only) |

## Theoria → Praxis

Phases 0–5 constitute **theoria** (θεωρία) — contemplative inquiry that produces the Lens L as a theoretical artifact: what different frameworks reveal, without changing anything. Phase 6–7 extend into **praxis** (πρᾶξις) — perspective-informed action on deterministically fixable findings, reusing the team's analytical context.

This transition requires the user's explicit `plan_act` selection at Phase 5 — a deliberate shift from understanding to changing, which warrants different epistemic commitments (see Phase-dependent topology in Phase 7b).

### Planning as Theoria-Praxis Bridge (Phase 6a)

Phase 6a introduces a Plan subagent between classification (theoria) and execution (praxis).
The planner operates in read-only mode (`subagent_type=Plan`), designing how to implement
without implementing — a structured transition from "what to fix" to "how to fix" that preserves
the explicit `plan_act` gate while adding user-approved execution strategy.

This differs from the external Plan Mode Integration above: there, plan mode is the outer frame
with Prothesis providing perspectives per planning phase. Here, Prothesis is the outer frame,
and the planner structures the theoria → praxis transition.

## Parametric Nature

The formula is **domain-agnostic**: instantiate C differently, derive different P-space. The structure `U → MB → G → C → P → S → I → Syn` applies wherever the open-world condition holds.

## Specialization

When guaranteed coverage is required, Prothesis can be constrained:

```
Prothesis(mandatory_baseline, optional_extension):
  baseline ∪ AskUserQuestion(extension) → selected
  T(selected) → ∥I(T) → Syn → L
```

**Principle**: Mandatory baseline cannot be reduced by user selection; only extended.
