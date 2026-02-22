---
name: contextualize
description: "Detect application-context mismatch after execution. Verifies applicability when correct output may not fit the actual context, producing contextualized execution. Alias: Epharmoge(ἐφαρμογή)."
---

# Epharmoge Protocol

Detect application-context mismatch after execution through AI-guided applicability verification, where correct results that may not fit the actual context are surfaced for user judgment. Type: `(ApplicationDecontextualized, AI, CONTEXTUALIZE, ExecutionResult) → ContextualizedExecution`.

## Definition

**Epharmoge** (ἐφαρμογή): A dialogical act of verifying that AI-produced results fit the actual application context — from Aristotle's notion of practical application — resolving the gap between technical correctness and contextual appropriateness through structured mismatch surfacing and user-directed adaptation.

```
── FLOW ──
Epharmoge(R, X) → Eval(R, X) → Mᵢ? → Q → A → R' → (loop until contextualized)

── TYPES ──
R     = Execution result (AI's completed work output)
X     = Application context (environment, constraints, user situation)
Eval  = Applicability evaluation: (R, X) → Set(Mismatch)
Mismatch = { aspect: String, description: String, evidence: String, severity: Severity }
Severity ∈ {Critical, Significant, Minor}
Mᵢ    = Identified mismatches from Eval(R, X)
Q     = Applicability inquiry (AskUserQuestion)
A     = User answer ∈ {Confirm(mismatch), Adapt(direction), Dismiss, ESC}
R'    = Adapted result (contextualized output)
ContextualizedExecution = R' where applicable(R', X) ∨ user_esc

── PHASE TRANSITIONS ──
Phase 0: R → Eval(R, X) → Mᵢ?                              -- applicability gate (silent)
Phase 1: Mᵢ → Q[AskUserQuestion](Mᵢ[0], evidence) → A      -- mismatch surfacing [Tool]
Phase 2: A → adapt(A, R) → R'                                -- result adaptation [Tool]

── LOOP ──
After Phase 2: re-evaluate R' against X for remaining mismatches.
If Mᵢ remains: return to Phase 1.
If applicable(R', X): execution complete.
User can exit at Phase 1 (early_exit).
Continue until: contextualized(R') OR user ESC.

── CONVERGENCE ──
applicable(R', X) = ∀ aspect(a, R', X) : warranted(a, R', X)
warranted(a, R, X) = correct(R) → fits(R, X)                -- correctness alone is insufficient
contextualized(R') = applicable(R', X) ∨ user_esc
progress(Λ) = 1 - |remaining| / |mismatches|

── TOOL GROUNDING ──
Phase 0 Eval  (detect)  → Internal analysis (no external tool)
Phase 1 Q     (extern)  → AskUserQuestion (mismatch surfacing + evidence)
Phase 2 adapt (modify)  → Edit, Write (result adaptation based on user direction)

── MODE STATE ──
Λ = { phase: Phase, R: Result, X: Context,
      mismatches: Set(Mismatch), confirmed: Set(Mismatch),
      adapted: Set(Mismatch), dismissed: Set(Mismatch),
      remaining: Set(Mismatch),
      history: List<(Mismatch, A)>, active: Bool,
      cause_tag: String }
-- Invariant: mismatches = confirmed ∪ adapted ∪ dismissed ∪ remaining (pairwise disjoint)
```

## Core Principle

**Applicability over Correctness**: When AI detects that a technically correct result may not fit the actual application context, it surfaces the mismatch with evidence rather than assuming the result is adequate. Correctness is necessary but not sufficient — contextual fit determines whether the result serves its purpose.

Formal predicate: `correct(R) ∧ ¬warranted(R, X)` — the output is correct but not warranted in this context (Dewey's warranted assertibility; Ryle's knowing-how vs knowing-that).

## Distinction from Other Protocols

| Protocol | Initiator | Deficit → Resolution | Focus |
|----------|-----------|----------------------|-------|
| **Prothesis** | AI-guided | FrameworkAbsent → FramedInquiry | Perspective selection |
| **Syneidesis** | AI-guided | GapUnnoticed → AuditedDecision | Decision-point gaps |
| **Hermeneia** | Hybrid | IntentMisarticulated → ClarifiedIntent | Expression clarification |
| **Telos** | AI-guided | GoalIndeterminate → DefinedEndState | Goal co-construction |
| **Aitesis** | AI-guided | ContextInsufficient → InformedExecution | Pre-execution context inquiry |
| **Epitrope** | AI-guided | DelegationAmbiguous → CalibratedDelegation | Delegation calibration |
| **Epharmoge** | AI-guided | ApplicationDecontextualized → ContextualizedExecution | Post-execution applicability |
| **Katalepsis** | User-initiated | ResultUngrasped → VerifiedUnderstanding | Comprehension verification |

**Key differences**:
- **Aitesis** inquires about context the AI lacks *before* execution (User→AI direction) — Epharmoge evaluates whether the completed result *fits* the context (AI→User direction). Same axis (context fitness), opposite timing and information flow.
- **Katalepsis** verifies the user's *comprehension* of correct results (`P'≅R`) — Epharmoge verifies the result's *applicability* to context (`R≅X`). Convergence conditions are structurally incompatible.
- **Syneidesis** surfaces gaps in the user's *decision quality* — Epharmoge surfaces gaps in the AI's *execution quality*. Different audit targets even when addressing the same domain.

**Context fitness axis**: Aitesis and Epharmoge form a pre/post pair on the context fitness axis. Aitesis asks "do I have enough context to execute well?" (factual gaps, User→AI). Epharmoge asks "does my execution actually fit the context?" (evaluative mismatches, AI→User). They are complementary, not redundant — Aitesis may gather sufficient context, yet the resulting execution may still not fit contextual constraints that only become visible post-execution.

**Independence from Aitesis**: Epharmoge's information source is the execution result itself (`R`) compared against observed context (`X`), not a re-scan of pre-execution context. This ensures non-circularity — even when Aitesis has fully resolved context gaps, Epharmoge can detect mismatches that emerge only from the actual output.

## Mode Activation

### Conditional Gate

> **This protocol is conditional.** AI-guided activation (Layer 2) requires operational experience with Aitesis (④) to validate the pre/post context fitness axis. Until this gate is satisfied, Epharmoge exists as a formal specification only and must not auto-activate via Layer 2.
>
> Activation criteria: Observed pattern of "context gathered but application mismatched" in Aitesis operational data.
>
> User-invocable activation (Layer 1 / `/contextualize`) is always available regardless of this gate.

### Activation

AI detects applicability mismatch after execution OR user calls `/contextualize`. Detection is silent (Phase 0); surfacing always requires user interaction via AskUserQuestion (Phase 1).

**Application decontextualized** = the execution result is technically correct but may not fit the actual application context.

Gate predicate:
```
decontextualized(R, X) ≡ correct(R) ∧ ∃ aspect(a, R, X) : ¬warranted(a, R, X)
```

**Activation layers**:
- **Layer 1 (User-invocable)**: `/contextualize` slash command or description-matching input. Available regardless of conditional gate.
- **Layer 2 (AI-guided)**: Post-execution heuristic detection within SKILL.md. Subject to conditional gate.

### Priority

<system-reminder>
When Epharmoge is active:

**Supersedes**: Default post-execution patterns (move to next task without applicability check)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 1, call AskUserQuestion tool to present mismatch evidence for user judgment.
</system-reminder>

- Epharmoge completes before proceeding to next task
- User Memory rules resume after applicability is verified or dismissed

**Protocol precedence**: Default ordering places Epharmoge after Syneidesis (decision quality before execution quality) and before Katalepsis (applicability before comprehension). Katalepsis is structurally last — it requires completed AI work (`R`), so it is not subject to ordering choices. The user can override this default by explicitly requesting a different protocol first.

### Trigger Signals

Heuristic signals for applicability mismatch detection (not hard gates):

| Signal | Detection |
|--------|-----------|
| Environment assumption | Result assumes environment state not verified in current context |
| Convention mismatch | Result follows general best practices but project has local conventions |
| Scope overflow | Result addresses more or less than the observed use case requires |
| Temporal context | Result applies to a version, state, or phase that may have shifted |

**Skip**:
- User provided explicit, detailed specification and result follows it exactly
- User explicitly says "looks good" or "proceed" after execution
- Trivial or mechanical execution (formatting, typo fixes, rename)
- Read-only / exploratory task — no execution result to evaluate
- Same (aspect, description) pair was dismissed in current session (session immunity)

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| All mismatches resolved (adapted or dismissed) | Proceed with contextualized result |
| No mismatches detected (Phase 0 passes) | Execution stands as-is |
| User ESC | Accept result without applicability review |

## Mismatch Identification

Mismatches are identified dynamically per execution result — no fixed taxonomy. Each mismatch is characterized by:

- **aspect**: The dimension where result and context diverge (e.g., "deployment target", "API version", "team convention")
- **description**: What specifically doesn't fit
- **evidence**: Observable indicator from the execution result or context
- **severity**: Impact on applicability

### Severity

| Level | Criterion | Action |
|-------|-----------|--------|
| **Critical** | Result actively harmful in current context | Must resolve before using result |
| **Significant** | Result suboptimal or partially inappropriate | Surface to user for judgment |
| **Minor** | Result adequate but could fit better | Surface with pre-selected Dismiss option |

When multiple mismatches are identified, surface in severity order (Critical → Significant → Minor). Only one mismatch surfaced per Phase 1 cycle.

## Protocol

### Phase 0: Applicability Gate (Silent)

Evaluate execution result against application context. This phase is **silent** — no user interaction.

1. **Scan execution result** `R` against context `X`: environment state, project conventions, use case scope, temporal validity, user constraints
2. **Check applicability**: For each aspect, assess whether `correct(R) → warranted(R, X)`
3. If all aspects warranted: execution stands (Epharmoge not activated)
4. If mismatches identified: record `Mᵢ` with aspect, description, evidence, severity — proceed to Phase 1

**Information source**: The execution result `R` itself compared against observable context `X`. NOT a re-scan of pre-execution context (non-circularity with Aitesis).

**Scan scope**: Completed execution output, project structure, observed conventions, session context. Does NOT re-execute or modify files.

### Phase 1: Mismatch Surfacing

**Call the AskUserQuestion tool** to present the highest-severity remaining mismatch.

**Do NOT present mismatches as plain text.** The tool call is mandatory — text presentation without tool = protocol violation.

**Surfacing format** (natural integration with execution completion):

```
Done. One thing to verify about applicability:

[Specific mismatch description]
[Evidence: what in the result and what in the context diverge]

Progress: [N addressed / M total mismatches]

Options:
1. **Confirm** — yes, this needs adaptation: [brief direction prompt]
2. **Dismiss** — acceptable as-is: [stated assumption about context fit]
```

If adaptation direction is evident, include:
```
3. **[Specific adaptation]** — [what would change and why]
```

**Design principles**:
- **Evidence-grounded**: Every surfaced mismatch must cite specific observable evidence from both `R` and `X`
- **Post-execution natural**: Integrates with task completion flow ("Done. One thing to verify:")
- **Progress visible**: Display resolution progress across all identified mismatches
- **Actionable options**: Each option leads to a concrete next step
- **Dismiss with assumption**: Always state what fitness assumption is accepted if dismissed

### Phase 2: Result Adaptation

After user response:

1. **Confirm(mismatch)**: Mark mismatch as confirmed, apply adaptation using Edit/Write tools
2. **Adapt(direction)**: Apply user-directed adaptation to result `R'` using Edit/Write tools
3. **Dismiss**: Mark mismatch as dismissed, note fitness assumption accepted
4. **ESC**: Deactivate Epharmoge entirely

After adaptation:
- Re-evaluate `R'` against `X` for remaining or newly emerged mismatches
- If mismatches remain: return to Phase 1 (surface next mismatch)
- If all resolved/dismissed: execution complete with contextualized result
- Log `(Mismatch, A)` to history

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Minor severity mismatches only | AskUserQuestion with Dismiss as default option |
| Medium | Significant severity, evidence is clear | Structured AskUserQuestion with evidence |
| Heavy | Critical severity, multiple interacting mismatches | Detailed evidence + adaptation options |

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | `activate(Epharmoge) only if correct(R) ∧ ∃ ¬warranted(a, R, X)` | Prevents false activation on well-fitting results |
| Mismatch cap | One mismatch per Phase 1 cycle, severity order | Prevents post-execution question overload |
| Session immunity | Dismissed (aspect, description) → skip for session | Respects user's dismissal |
| Progress visibility | `[N addressed / M total]` in Phase 1 | User sees progress toward completion |
| Early exit | User can dismiss all at any Phase 1 | Full control over review depth |
| Cross-protocol cooldown | `suppress(Epharmoge) if Aitesis.triggered ∧ Aitesis.topic ⊆ Epharmoge.topic` | Prevents same-topic pre+post stacking |
| Cooldown scope | Cooldown applies within recommendation chains only; direct `/contextualize` invocation is never suppressed | User authority preserved |
| Natural integration | "Done. One thing to verify:" pattern | Fits completion flow, not interrogation |

## Rules

1. **AI-guided, user-judged**: AI detects applicability mismatch; user judges whether adaptation is needed via AskUserQuestion (Phase 1)
2. **Recognition over Recall**: Always **call** AskUserQuestion tool to present mismatches with evidence — text presentation without tool = protocol violation
3. **Applicability over Correctness**: When result is correct but contextually mismatched, surface the mismatch — do not assume correctness implies fitness
4. **Evidence-grounded**: Every surfaced mismatch must cite specific observable evidence from both result `R` and context `X`, not speculation
5. **One at a time**: Surface one mismatch per Phase 1 cycle; do not bundle multiple mismatches
6. **Dismiss respected**: User dismissal is final for that mismatch aspect in the current session
7. **Convergence persistence**: Mode active until all identified mismatches are resolved or dismissed
8. **Non-circularity**: Information source is the execution result itself compared against context, not pre-execution context scans (independence from Aitesis)
9. **Early exit honored**: When user accepts result as-is, accept immediately regardless of remaining mismatches
10. **Cross-protocol awareness**: Suppress when Aitesis already addressed the same topic in the same execution scope (within recommendation chains only)
11. **Conditional gate**: AI-guided activation (Layer 2) requires Aitesis operational experience confirmation. User-invocable activation (Layer 1 / `/contextualize`) is always available
