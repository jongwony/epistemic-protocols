---
name: solicit
description: "Detect context insufficiency before execution. Solicits missing context when AI detects indicators of context gaps, producing informed execution. Alias: Aitesis(αἴτησις)."
user-invocable: true
---

# Aitesis Protocol

Detect context insufficiency before execution through AI-detected solicitation. Type: `(ContextInsufficient, AI, SOLICIT, ExecutionPlan) → InformedExecution`.

## Definition

**Aitesis** (αἴτησις): A dialogical act of soliciting missing context before execution, where AI detects indicators of context insufficiency and presents candidates for user resolution through structured mini-choices.

```
── FLOW ──
Aitesis(X) → Δₘ(X) → Cₛ → Q → A → X' → (loop until informed)

── TYPES ──
X   = Execution plan (current task/action about to execute)
Δₘ  = Context insufficiency monitor: X → Set(ContextGap)
ContextGap ∈ {ConstraintDrift, DissatisfactionSignal, FailurePattern, AssumptionStale}
Cₛ  = Candidate set: Set(ContextGap) → List<Candidate>
Q   = Solicitation question (via AskUserQuestion)
A   = User's answer ∈ {Select(option), Provide(context), Dismiss, ESC}
X'  = Updated execution plan incorporating user-provided context
InformedExecution = X' where (∀g ∈ detected: resolved(g) ∨ dismissed(g)) ∨ user_esc

── Δₘ TRIGGER CONDITIONS ──
ConstraintDrift:       env_changed(X) ∧ ¬user_notified(change)
DissatisfactionSignal: dissatisfaction_pattern(history, threshold)
FailurePattern:        repeated_failure(action, threshold) ∧ ¬strategy_changed
AssumptionStale:       assumption_age(X) > threshold ∧ context_shifted

── PHASE TRANSITIONS ──
Phase 0:  X → Δₘ(X) → trigger?                           -- context insufficiency gate (silent)
Phase 1:  Δₘ → Cₛ(Δₘ) → Q[AskUserQuestion](Cₛ[0]) → A  -- candidate surfacing [Tool]
Phase 2:  A → integrate(A, X) → X'                        -- plan update (internal)

── LOOP ──
After Phase 2: re-evaluate Δₘ(X') for remaining gaps.
Continue until: all detected gaps resolved/dismissed OR user ESC.

── TOOL GROUNDING ──
Phase 1 Q  (extern)  → AskUserQuestion (candidate surfacing with mini-choice options)
Δₘ         (detect)  → Read, Grep (context verification if needed)
integrate  (state)   → Internal state update (no external tool)

── MODE STATE ──
Λ = { phase: Phase, X: ExecutionPlan, gaps: Set(ContextGap),
      resolved: Set(ContextGap), history: List<(Cₛ, A)>,
      cause_tag: CauseTag, active: Bool }
CauseTag ∈ {constraint_drift, dissatisfaction, failure_pattern, assumption_stale}
```

## Core Principle

**Solicitation over Assumption**: When AI detects indicators of context insufficiency, it solicits missing context through structured mini-choices rather than assuming defaults or proceeding silently. The user decides whether the gap matters.

## Distinction from Other Protocols

| Protocol | Initiator | Deficit → Resolution | Focus |
|----------|-----------|----------------------|-------|
| **Prothesis** | AI-detected | FrameworkAbsent → FramedInquiry | Perspective options |
| **Syneidesis** | AI-detected | GapUnnoticed → AuditedDecision | Decision-point gaps |
| **Hermeneia** | User-initiated | IntentMisarticulated → ClarifiedIntent | Intent-expression gaps |
| **Telos** | AI-detected | GoalIndeterminate → DefinedEndState | Goal co-construction |
| **Aitesis** | AI-detected | ContextInsufficient → InformedExecution | Pre-execution context gaps |
| **Katalepsis** | User-initiated | ResultUngrasped → VerifiedUnderstanding | Comprehension verification |

**Key differences**:
- **Syneidesis** surfaces gaps at decision points for the user to judge — Aitesis detects context insufficiency before execution and solicits resolution
- **Telos** co-constructs goals when intent is indeterminate — Aitesis operates when goals exist but execution context is insufficient
- **Hermeneia** extracts intent the user already has — Aitesis addresses context the system lacks

**Heterocognitive distinction**: Aitesis monitors the AI's own context sufficiency (heterocognitive — "do I have enough context?"), while Syneidesis monitors the user's decision quality (metacognitive — "has the user considered all angles?"). This ontological difference justifies separate protocols despite surface similarity.

## Mode Activation

### Activation

AI detects context insufficiency indicators OR user calls `/solicit`. Detection is silent (Phase 0); surfacing always requires user interaction via AskUserQuestion (Phase 1).

**Context insufficient** = at least one ContextGap type's trigger condition is met for the current execution plan.

### Priority

<system-reminder>
When Aitesis is active:

**Supersedes**: Direct execution patterns in User Memory
(Context must be verified before any execution begins)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 1, call AskUserQuestion tool to present context gap candidates for user resolution.
</system-reminder>

- Aitesis completes before execution proceeds
- User Memory rules resume after context is resolved or dismissed

**Protocol precedence**: Default ordering places Aitesis after Telos (defined goals before context verification) and before Prothesis (verified context before perspective selection). The user can override this default by explicitly requesting a different protocol first. Katalepsis is structurally last — it requires completed AI work (`R`), so it is not subject to ordering choices.

### Triggers

| Signal | ContextGap Type | Detection |
|--------|----------------|-----------|
| Environment changed since last interaction | ConstraintDrift | System state differs from assumptions |
| User dissatisfaction patterns | DissatisfactionSignal | Repeated corrections, "no, I meant..." |
| Repeated failure on same action | FailurePattern | Same error after multiple attempts |
| Stale assumptions in execution plan | AssumptionStale | Context shift since assumption was formed |

**Skip**:
- Execution context is fully specified in current message
- User explicitly says "just do it" or "proceed"
- Same ContextGap type was dismissed in current session (session immunity)
- Stakes are low AND only one valid interpretation exists (false positive suppression)

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| All detected gaps resolved | Proceed with updated execution plan |
| All detected gaps dismissed | Proceed with original execution plan |
| User ESC | Return to normal operation |

## Gap Taxonomy

| Type | Condition | Candidate Form | Example |
|------|-----------|----------------|---------|
| **ConstraintDrift** | Environment changed without user notification | "The [X] has changed since we last discussed this. Should we..." | New dependency version, config change |
| **DissatisfactionSignal** | Pattern of user corrections detected | "I notice you've corrected [X] several times. Would you like to..." | Repeated "no, I meant..." responses |
| **FailurePattern** | Same action fails repeatedly without strategy change | "This approach has failed [N] times. The issue might be..." | API call errors, test failures |
| **AssumptionStale** | Assumption formed earlier may no longer hold | "Earlier we assumed [X]. Given [Y], should we reconsider?" | Scope change, new information |

### Gap Priority

When multiple gaps are detected simultaneously:
1. **FailurePattern** (highest): Blocking execution — immediate resolution needed
2. **ConstraintDrift**: Environmental mismatch may cascade
3. **DissatisfactionSignal**: User experience degradation
4. **AssumptionStale** (lowest): May resolve itself with fresh context

Only the highest-priority gap is surfaced first (one at a time). After resolution, re-evaluate remaining gaps.

## Protocol

### Phase 0: Context Insufficiency Gate (Silent)

Monitor execution plan for context insufficiency indicators. This phase is **silent** — no user interaction.

1. **Evaluate trigger conditions** against current execution plan `X`
2. If no conditions met: proceed with execution (Aitesis not activated)
3. If conditions met: record detected `ContextGap` types, proceed to Phase 1

**Detection scope**: Current execution plan, recent conversation history, observable environment state. Does NOT require proactive investigation — uses information already available.

### Phase 1: Candidate Surfacing

**Call the AskUserQuestion tool** to present the highest-priority context gap as a mini-choice.

**Candidate format** (structured options, not open-ended questions):

```
I detected a potential context gap before proceeding:

[Description of detected gap with specific evidence]

Options:
1. **[Resolution A]** — [concrete action]
2. **[Resolution B]** — [alternative action]
3. **Dismiss** — proceed without addressing this
```

**Design principles**:
- **Evidence-grounded**: Every candidate cites specific observable evidence (not speculation)
- **Actionable options**: Each option leads to a concrete next step
- **Dismiss always available**: User can always choose to proceed without resolution
- **Maximum 3 candidates** per surfacing (excluding Dismiss)

### Phase 2: Plan Update

After user response:

1. **Select(option)**: Integrate selected resolution into execution plan `X'`
2. **Provide(context)**: User supplies additional context directly — incorporate into `X'`
3. **Dismiss**: Mark gap as dismissed, retain original plan
4. **ESC**: Deactivate Aitesis entirely

After integration:
- Re-evaluate `Δₘ(X')` for remaining unresolved gaps
- If gaps remain: return to Phase 1 (next highest priority)
- If all resolved/dismissed: proceed with execution
- Log `(Cₛ, A)` to history

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Single low-stakes gap, clear resolution | Inline mini-choice (2 options + dismiss) |
| Medium | Multiple gaps or moderate stakes | Structured AskUserQuestion with evidence |
| Heavy | Blocking failure or cascading drift | Detailed evidence + multiple resolution paths |

## UX Safeguards

| Rule | Structure | Threshold |
|------|-----------|-----------|
| False positive suppression | `suppress(Aitesis) if stakes=Low ∧ interpretations=1` | TBD |
| Candidate cap | `|Candidates| ≤ 3` | Confirmed |
| Session immunity | Dismissed ContextGap type → skip for session | TBD |
| Cooldown | Suppress re-trigger on same ContextGap type within action | TBD |
| Cross-protocol fatigue | Syneidesis triggered → suppress Aitesis for same decision point | TBD |

**TBD thresholds** will be calibrated during pilot usage. Until then, conservative defaults apply: when in doubt, suppress rather than surface.

## Rules

1. **AI-detected, user-resolved**: AI detects context insufficiency; resolution requires user choice via AskUserQuestion (Phase 1)
2. **Recognition over Recall**: Always **call** AskUserQuestion tool to present structured options (text presentation = protocol violation)
3. **Selection over Detection**: User selects resolution from presented candidates; AI does not auto-resolve
4. **Solicitation over Assumption**: When context is insufficient, solicit rather than assume — silence is worse than a dismissed question
5. **Evidence-grounded**: Every surfaced gap must cite specific observable evidence, not speculation
6. **One at a time**: Surface one gap per Phase 1 cycle; do not bundle multiple gaps
7. **Dismiss respected**: User dismissal is final for that ContextGap type in the current session
8. **Convergence persistence**: Mode active until all detected gaps are resolved or dismissed
9. **Minimal interruption**: Suppress when stakes are low and interpretation is unambiguous (UX Safeguards)
10. **Cross-protocol awareness**: Defer to Syneidesis when gap surfacing is already active for the same decision point
