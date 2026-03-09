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

## Design Rationale

Origin: [Don't Ask AI "How Do You Think?"](https://medium.com/delightroom/ai%EC%97%90%EA%B2%8C-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%83%9D%EA%B0%81%ED%95%B4-%EB%9D%BC%EA%B3%A0-%EB%AC%BB%EC%A7%80-%EB%A7%88%EC%84%B8%EC%9A%94-e33c09646469) (DelightRoom Engineering Blog, 2026-03). The blog describes the motivational narrative; this section documents the design decisions and their epistemological basis.

### Single-Framework Fixation: Chain Failure Blocking

AI conversations suffer from **single-framework fixation** — when AI selects one analytical framework early and anchors all subsequent analysis to it. This is the default behavior: asked "how do you think about X?", AI picks one lens and commits. The user receives a coherent but potentially incomplete analysis without knowing what perspectives were excluded.

Three design choices in Prothesis break this failure chain at different stages:

| Failure stage | Design choice | Blocking mechanism |
|---|---|---|
| Framework absence → premature closure | Open-world trigger (`framework_absent(U)` gate) | Detects when problem space is not fully enumerated; activates before AI commits to a single framework |
| Self-diagnosis impossible → meta-ignorance persists | AI-guided initiator | External detection bypasses the user's inability to recognize their own framework blindness |
| Sequential analysis → anchoring cascade | Isolated teammate context | Physical context separation prevents earlier perspectives from contaminating later ones |

Each stage depends on the previous: without the open-world trigger, premature closure occurs silently; without AI-guided detection, the user cannot self-diagnose; without isolation, even correctly identified perspectives contaminate each other through shared context. The three choices form a defense-in-depth against single-framework fixation.

### AI-Guided Initiator: Epistemological Basis

Framework absence is **meta-ignorance** — the state of not knowing that you don't know. This is distinct from ordinary ignorance (knowing you don't know something). A user experiencing meta-ignorance cannot recognize that multiple valid frameworks exist for their problem because recognizing this requires the very frameworks they lack.

If Prothesis were **user-initiated only**, it would require users to self-diagnose a deficit defined by its invisibility to the sufferer — a structural contradiction. The Dunning-Kruger effect formalizes this: competence in a domain is prerequisite to recognizing incompetence in that domain. Framework selection is precisely such a domain.

**AI-guided** is therefore not a convenience choice but an epistemological necessity. The AI can detect `framework_absent(U)` because it has access to the space of possible frameworks — the user cannot perform this detection because access to that space is exactly what they lack.

This does not make Prothesis fully AI-autonomous. Layer 2 (AI-guided) detects the *condition*; the user retains *selection authority* via AskUserQuestion (Recognition over Recall). The AI says "here are the lenses"; the user says "I'll look through these ones." Detection is AI-guided; selection is user-authorized.

### Theoria-Praxis Boundary

Prothesis Phases 0–4 constitute pure **theoria** (θεωρία) — contemplative inquiry that produces the Lens `L` as a theoretical artifact. The Lens reveals what different frameworks show; it changes nothing.

The transition from theoria to praxis occurs at the LOOP's routing step, when `J=wrap_up` completes with the Lens `L`. Post-convergence suggestions (per `### Post-Convergence Suggestions`) may indicate downstream protocols based on what the Lens revealed. This is an **explicit boundary**: the user must choose to act on the Lens by following a suggestion or proceeding with their own plan.

**Design principle** (Placement over Prescription): Prothesis places perspectives before the user; it does not prescribe action. Automatic transition from analysis to execution would violate this principle — the user might want to contemplate the Lens without acting, request additional perspectives, or reject the analysis entirely. Each of these is a valid outcome of theoria.

**Structural enforcement**: The `J` routing enum (`extend`, `add_input`, `wrap_up`, `withdraw`) contains no direct execution option. There is no `J=execute` or `J=implement`. The only path to praxis is through post-convergence suggestions, which themselves require user consent at the downstream protocol's own activation gate.

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

## Per-Message Application

Every user message triggers perspective evaluation:

| Message Type | Action |
|--------------|--------|
| New inquiry | Prothesis |
| Follow-up within established lens | Continue with selected perspective |
| Uncertain | Default to Prothesis |

**Decision rule**: When uncertain whether perspective is established, default to Prothesis.

```
False positive (unnecessary question) < False negative (missed perspective)
```

## Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Synthesis complete | Lens established; follow-ups continue within lens |
| User starts unrelated topic | Re-evaluate for new Prothesis |

## Conditions

### Trigger Prothesis

Prothesis applies to **open-world** cognition where the problem space is not fully enumerated:

- Purpose present, approach unspecified
- Multiple valid epistemic frameworks exist
- User's domain awareness likely incomplete
- **Structure test**: "What might I be missing?" is a meaningful question

### Skip Prothesis

Prothesis does **not** apply to **closed-world** cognition:

- Single deterministic execution path exists
- Perspective already specified
- Known target with binary outcome

**Heuristic**: If a deterministic procedure can answer the inquiry, skip Prothesis.
