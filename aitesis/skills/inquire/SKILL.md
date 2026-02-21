---
name: inquire
description: "Detect context insufficiency before execution. Inquires about missing context when AI detects indicators of context gaps, producing informed execution. Alias: Aitesis(αἴτησις)."
---

# Aitesis Protocol

Detect context insufficiency before execution through AI-detected inquiry. Type: `(ContextInsufficient, AI, INQUIRE, ExecutionPlan) → InformedExecution`.

## Definition

**Aitesis** (αἴτησις): A dialogical act of proactively scanning context sufficiency before execution, where AI identifies information gaps, self-investigates via codebase exploration when possible, and inquires about remaining gaps through structured mini-choices for user resolution.

```
── FLOW ──
Aitesis(X) → Scan(X) → Gᵢ → Inv(Gᵢ) → Gᵣ → Q → A → X' → (loop until informed)

── TYPES ──
X     = Execution plan (current task/action about to execute)
Scan  = Context sufficiency scan: X → Set(Gap)
Gap   = { domain: String, description: String, severity: Severity }
Severity ∈ {Blocking, Important, Minor}
Gᵢ    = Identified gaps from Scan(X)
Inv   = Self-investigation: Gᵢ → (Gᵣ, Sᵣ)
Sᵣ    = Set(Gap)                                    -- self-resolved during investigation
Gᵣ    = Remaining gaps (¬self_resolved)
Q     = Inquiry (AskUserQuestion)
A     = User answer ∈ {Provide(context), Point(location), Dismiss, ESC}
X'    = Updated execution plan
InformedExecution = X' where remaining = ∅ ∨ user_esc

── PHASE TRANSITIONS ──
Phase 0: X → Scan(X) → Gᵢ?                               -- context sufficiency gate (silent)
Phase 1: Gᵢ → Inv(Gᵢ) → Gᵣ                               -- self-investigation [Tool]
Phase 2: Gᵣ → Q[AskUserQuestion](Gᵣ[0], progress) → A    -- gap surfacing [Tool]
Phase 3: A → integrate(A, X) → X'                         -- plan update (internal)

── LOOP ──
After Phase 3: re-scan X' for remaining or newly emerged gaps.
New gaps accumulate into gaps (cumulative, never replace).
If Gᵣ remains: return to Phase 1 (self-investigate new gaps).
If remaining = ∅: proceed with execution.
User can exit at Phase 2 (early_exit).
Continue until: informed(X') OR user ESC.

── CONVERGENCE ──
informed(X') = remaining = ∅
progress(Λ) = 1 - |remaining| / |gaps|
diminishing(Gᵣ) = max(severity(Gᵣ)) < max(severity(Gᵢ))
early_exit = user_declares_sufficient

── TOOL GROUNDING ──
Phase 1 Inv  (detect)  → Read, Grep (self-investigation)
Phase 2 Q    (extern)  → AskUserQuestion (gap surfacing + progress)
Phase 3      (state)   → Internal state update
Phase 0 Scan (detect)  → Internal analysis (no external tool)

── MODE STATE ──
Λ = { phase: Phase, X: ExecutionPlan, gaps: Set(Gap),
      self_resolved: Set(Gap), user_resolved: Set(Gap),
      remaining: Set(Gap), dismissed: Set(Gap),
      history: List<(Gap, A)>, active: Bool }
-- Invariant: gaps = self_resolved ∪ user_resolved ∪ remaining ∪ dismissed (pairwise disjoint)
```

## Core Principle

**Inquiry over Assumption**: When AI detects context insufficiency before execution, it first self-investigates via codebase exploration, then inquires about remaining gaps through structured mini-choices rather than assuming defaults or proceeding silently. The user decides whether the gap matters.

## Distinction from Other Protocols

| Protocol | Initiator | Deficit → Resolution | Focus |
|----------|-----------|----------------------|-------|
| **Prothesis** | AI-detected | FrameworkAbsent → FramedInquiry | Perspective options |
| **Syneidesis** | AI-detected | GapUnnoticed → AuditedDecision | Decision-point gaps |
| **Hermeneia** | Hybrid | IntentMisarticulated → ClarifiedIntent | Intent-expression gaps |
| **Telos** | AI-detected | GoalIndeterminate → DefinedEndState | Goal co-construction |
| **Aitesis** | AI-detected | ContextInsufficient → InformedExecution | Pre-execution context inquiry |
| **Epitrope** | AI-detected | DelegationAmbiguous → CalibratedDelegation | Context-adaptive delegation calibration (WHO/WHAT/HOW MUCH) |
| **Katalepsis** | User-initiated | ResultUngrasped → VerifiedUnderstanding | Comprehension verification |

**Key differences**:
- **Syneidesis** surfaces gaps at decision points for the user to judge (information flows AI→user) — Aitesis inquires about context the AI lacks before execution (information flows user→AI)
- **Telos** co-constructs goals when intent is indeterminate — Aitesis operates when goals exist but execution context is insufficient
- **Hermeneia** extracts intent the user already has (user signal) or detects expression ambiguity (AI-detected, requires confirmation) — Aitesis inquires about context the system lacks
- **Epitrope** calibrates delegation (structure, scope, autonomy) before work begins — Aitesis verifies execution context after delegation is established

**Heterocognitive distinction**: Aitesis monitors the AI's own context sufficiency (heterocognitive — "do I have enough context to execute?"), while Syneidesis monitors the user's decision quality (metacognitive — "has the user considered all angles?"). The operational test: if the information gap would be filled by the user providing context, it's Aitesis; if it would be filled by the user reconsidering their decision, it's Syneidesis.

**Factual vs evaluative**: Aitesis gaps are factual — they have objectively correct answers discoverable from the environment (configs, versions, schemas). Syneidesis gaps are evaluative — they require judgment about trade-offs and consequences. This is why Phase 1 self-investigation exists: factual gaps may be resolvable from the codebase. Evaluative gaps cannot be self-resolved.

**Litmus-test examples** (same scenario, different classification):
- Aitesis: "The codebase has both v1 and v2 API schemas — which version is the current production target?" (AI lacks a fact)
- Syneidesis: "Have you considered that migrating from v1 to v2 will require a data backfill?" (user has not considered a consequence)

## Mode Activation

### Activation

AI detects context insufficiency before execution OR user calls `/inquire`. Detection is silent (Phase 0); surfacing always requires user interaction via AskUserQuestion (Phase 2).

**Context insufficient** = the execution plan contains requirements not available in the current context and not trivially inferrable.

Gate predicate:
```
uncertain(sufficiency(X)) ≡ ∃ requirement(r, X) : ¬available(r, context) ∧ ¬trivially_inferrable(r)
```

### Priority

<system-reminder>
When Aitesis is active:

**Supersedes**: Direct execution patterns in User Memory
(Context must be verified before any execution begins)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 2, call AskUserQuestion tool to present remaining gap candidates for user resolution.
</system-reminder>

- Aitesis completes before execution proceeds
- User Memory rules resume after context is resolved or dismissed

**Protocol precedence**: Default ordering places Aitesis after Epitrope (calibrated delegation before context verification) and before Prothesis (verified context before perspective selection). The user can override this default by explicitly requesting a different protocol first. Katalepsis is structurally last — it requires completed AI work (`R`), so it is not subject to ordering choices.

### Trigger Signals

Heuristic signals for context insufficiency detection (not hard gates):

| Signal | Detection |
|--------|-----------|
| Novel domain | Knowledge area not previously addressed in session |
| Implicit requirements | Task carries unstated assumptions |
| Ambiguous scope | Multiple valid interpretations exist and AI cannot determine intended approach from available context |
| Environmental dependency | Relies on external state (configs, APIs, versions) |

**Skip**:
- Execution context is fully specified in current message
- User explicitly says "just do it" or "proceed"
- Same (domain, description) pair was dismissed in current session (session immunity)
- Phase 1 self-investigation resolves all identified gaps
- Read-only / exploratory task — no execution plan to verify

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| All gaps resolved (self or user) | Proceed with updated execution plan |
| All remaining gaps dismissed | Proceed with original execution plan + defaults |
| User ESC | Return to normal operation |

## Gap Identification

Gaps are identified dynamically per task — no fixed taxonomy. Each gap is characterized by:

- **domain**: The knowledge area where context is missing (e.g., "deployment config", "API versioning", "user auth model")
- **description**: What specifically is missing or uncertain
- **severity**: Impact on execution quality

### Severity

| Level | Criterion | Action |
|-------|-----------|--------|
| **Blocking** | Execution cannot proceed without resolution | Must resolve before execution |
| **Important** | Suboptimal outcome likely without resolution | Surface to user for context |
| **Minor** | Reasonable default exists | Surface with pre-selected Dismiss option |

When multiple gaps are identified, surface in severity order (Blocking → Important → Minor). Only one gap surfaced per Phase 2 cycle.

## Protocol

### Phase 0: Context Sufficiency Gate (Silent)

Analyze execution plan requirements against available context. This phase is **silent** — no user interaction.

1. **Scan execution plan** `X` for required context: domain knowledge, environmental state, configuration details, user preferences, constraints
2. **Check availability**: For each requirement, assess whether it is available in conversation, files, or environment
3. If all requirements satisfied: proceed with execution (Aitesis not activated)
4. If gaps identified: record `Gᵢ` with domain, description, severity — proceed to Phase 1

**Scan scope**: Current execution plan, conversation history, observable environment. Does NOT modify files or call external services.

### Phase 1: Self-Investigation

Attempt to resolve identified gaps through codebase exploration before asking the user.

1. For each gap in `Gᵢ` (severity order):
   - **Call Read/Grep** to search for relevant information in codebase, configs, documentation
   - If found: mark as self-resolved, integrate into execution context
   - If not found: retain in `Gᵣ`
   - If ambiguous (conflicting evidence): retain in `Gᵣ`, include findings in Phase 2 surfacing context
2. If `Gᵣ = ∅`: proceed with execution (all gaps self-resolved, no user interruption)
3. If `Gᵣ ≠ ∅`: proceed to Phase 2

**Scope restriction**: Read-only investigation only. No API calls, test execution, or file modifications.

### Phase 2: Gap Surfacing

**Call the AskUserQuestion tool** to present the highest-severity remaining gap.

**Surfacing format**:

```
Before proceeding, I need to verify some context:

[Specific gap description with evidence of why it's needed]
[What I found during self-investigation, if relevant]

Progress: [N resolved / M total gaps]

Options:
1. **[Provide X]** — [what this context enables]
2. **[Point me to...]** — tell me where to find this information
3. **Dismiss** — proceed with [stated default/assumption]
```

**Design principles**:
- **Self-investigation transparent**: Show what was already checked and found
- **Progress visible**: Display resolution progress across all identified gaps
- **Actionable options**: Each option leads to a concrete next step
- **Dismiss with default**: Always state what assumption will be used if dismissed

### Phase 3: Plan Update

After user response:

1. **Provide(context)**: Integrate user-provided context into execution plan `X'`
2. **Point(location)**: Record location, resolve via next Phase 1 iteration
3. **Dismiss**: Mark gap as dismissed, note default assumption used
4. **ESC**: Deactivate Aitesis entirely

After integration:
- Re-scan `X'` for remaining or newly emerged gaps
- If gaps remain: return to Phase 1 (self-investigate new gaps first)
- If all resolved/dismissed: proceed with execution
- Log `(Gap, A)` to history

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Minor severity gaps only | AskUserQuestion with Dismiss as default option |
| Medium | Important severity gaps, self-investigation partially resolved | Structured AskUserQuestion with progress |
| Heavy | Blocking severity, multiple unresolved gaps | Detailed evidence + investigation results + resolution paths |

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | `activate(Aitesis) only if ∃ requirement(r) : ¬available(r) ∧ ¬trivially_inferrable(r)` | Prevents false activation on clear tasks |
| Self-resolution first | Phase 1 before Phase 2 | Minimizes user interruption |
| Gap cap | One gap per Phase 2 cycle, severity order | Prevents question overload |
| Session immunity | Dismissed (domain, description) → skip for session | Respects user's dismissal |
| Progress visibility | `[N resolved / M total]` in Phase 2 | User sees progress toward completion |
| Diminishing returns | Signal when `max(severity(Gᵣ)) < max(severity(Gᵢ))` | User can exit when remaining gaps are minor |
| Early exit | User can declare sufficient at any Phase 2 | Full control over inquiry depth |
| Cross-protocol fatigue | Syneidesis triggered → suppress Aitesis for same task scope | Prevents protocol stacking (asymmetric: Aitesis context gaps ≠ Syneidesis decision gaps, so reverse suppression not needed) |

## Rules

1. **AI-detected, user-resolved**: AI detects context insufficiency; resolution requires user choice via AskUserQuestion (Phase 2)
2. **Recognition over Recall**: Always **call** AskUserQuestion tool to present structured options (text presentation = protocol violation)
3. **Self-investigation first**: Before asking the user, attempt to resolve gaps through Read/Grep codebase exploration (Phase 1)
4. **Inquiry over Assumption**: When context is insufficient and self-investigation fails, inquire rather than assume — silence is worse than a dismissed question
5. **Open scan**: No fixed gap taxonomy — identify gaps dynamically based on execution plan requirements
6. **Evidence-grounded**: Every surfaced gap must cite specific observable evidence or investigation results, not speculation
7. **One at a time**: Surface one gap per Phase 2 cycle; do not bundle multiple gaps
8. **Dismiss respected**: User dismissal is final for that gap domain in the current session
9. **Convergence persistence**: Mode active until all identified gaps are resolved or dismissed
10. **Progress visibility**: Every Phase 2 surfacing includes progress indicator `[N resolved / M total]`
11. **Early exit honored**: When user declares context sufficient, accept immediately regardless of remaining gaps
12. **Cross-protocol awareness**: Defer to Syneidesis when gap surfacing is already active for the same task scope
