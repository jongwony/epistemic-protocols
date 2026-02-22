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

**Phase 3 Degradation**:
When Prothesis activates within an active plan mode session, `TeamCreate` is unavailable (no persistent team state). The protocol adapts with available tools:

- Phases 0–2: Execute normally (`AskUserQuestion` available in plan mode)
- Phase 1: `Explore` subagent available for context collection (`Task(subagent_type="Explore")`)
- Phase 3: `Plan` subagent available per perspective (`Task(subagent_type="Plan")`); analysis isolation preserved — each perspective analyzed in a separate subagent context (no persistent identity or cross-dialogue capability; coordinator collects results and incorporates into plan output)
- `ExitPlanMode` presents the coordinator's plan output (incorporating Plan subagent analyses) as inquiry blueprint — not L; actual Lens requires `TeamCreate` + normal-mode execution
- Phases 4–5 (cross-dialogue, synthesis, routing) are not accessible in plan mode; to obtain actual Lens L, start a fresh `/frame` session from Phase 0 in normal mode — the inquiry blueprint serves as reference context when re-specifying the Mission Brief and selecting perspectives

This degradation preserves Phase 0–2 epistemic value and Phase 3 analysis isolation (per-perspective context separation; cross-dialogue and persistent agent identity require normal mode): Mission Brief confirmation, perspective selection, and per-perspective subagent isolation all complete before ExitPlanMode fires. The plan output serves as a blueprint for a subsequent active session.

## Distinction from Socratic Method

| Dimension | Socratic Maieutics | Prothesis |
|-----------|-------------------|-----------|
| Knowledge source | Latent within interlocutor | Provided externally |
| Premise | "You already know" | "You don't know the options" |
| Role metaphor | Midwife (draws out) | Cartographer (reveals paths) |
| Question form | Open (Recall burden) | Options (Recognition only) |

## Theoria → Praxis

Prothesis (Phases 0–5) constitutes pure **theoria** (θεωρία) — contemplative inquiry that produces the Lens L as a theoretical artifact: what different frameworks reveal, without changing anything.

The transition to **praxis** (πρᾶξις) — perspective-informed action — is delegated to Epitrope. When the user selects `J=calibrate` at Phase 5, the coordinator calls `Skill("calibrate")` to activate Epitrope, which detects the active team and proposes TeamAugment mode. This is a mode switch, not a composition: the same coordinator transitions from perspective analysis to delegation calibration, with the team's analytical context preserved.

This separation reflects a clean epistemic boundary: Prothesis answers "what do different frameworks reveal?" while Epitrope answers "how should we act on these findings?" The `calibrate` option at Phase 5 is the deliberate shift from understanding to changing.

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
