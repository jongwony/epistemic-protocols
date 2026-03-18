---
name: contextualize
description: "Detect application-context mismatch after execution. Verifies applicability when correct output may not fit the actual context, producing contextualized execution. Type: (ApplicationDecontextualized, AI, CONTEXTUALIZE, ExecutionResult) → ContextualizedExecution. Alias: Epharmoge(ἐφαρμογή)."
---

# Epharmoge Protocol

Detect application-context mismatch after execution through AI-guided applicability verification, where correct results that may not fit the actual context are surfaced for user judgment. Type: `(ApplicationDecontextualized, AI, CONTEXTUALIZE, ExecutionResult) → ContextualizedExecution`.

## Definition

**Epharmoge** (ἐφαρμογή): A dialogical act of verifying that AI-produced results fit the actual application context — from Aristotle's notion of practical application — resolving the gap between technical correctness and contextual appropriateness through structured mismatch surfacing and user-directed adaptation.

```
── FLOW ──
Epharmoge(R, X) → Eval(R, X) → Mᵢ? → Register(Mᵢ) → Q(Mᵢ[0]) → A → R' → Eval(R', X) → Mₑ? → (loop until contextualized)

── MORPHISM ──
(R, X)
  → evaluate(result, context)          -- detect applicability mismatch
  → surface(mismatch, as_inquiry)      -- present mismatch with evidence
  → adapt(result, direction)           -- adapt result to context
  → ContextualizedExecution
requires: mismatch_detected(R, X)       -- runtime gate (Phase 0)
deficit:  ApplicationDecontextualized    -- activation precondition (Layer 1/2)
preserves: X                             -- application context is fixed reference; morphism transforms R only
invariant: Applicability over Correctness

── TYPES ──
R      = Execution result (AI's completed work output)
X      = Application context (environment, constraints, user situation)
Eval   = Applicability evaluation: (R, X) → Set(Mismatch)
Mismatch = { aspect: String, description: String, evidence: String, severity: Severity, origin: Origin }
Origin ∈ {Initial, Emerged(aspect)}                            -- mismatch provenance: initial scan or spawned by adapting parent aspect
Severity ∈ {Critical, Significant, Minor}
Mᵢ     = Identified mismatches from Eval(R, X)                 -- origin = Initial
Mₑ     = Newly emerged mismatches from Eval(R', X)             -- origin = Emerged(adapted_aspect)
Register = Mᵢ → Set(Task) [Tool: TaskCreate]                  -- mismatch registration as tracked tasks
Q      = Applicability inquiry (AskUserQuestion)
A      = User answer ∈ {Confirm(mismatch), Adapt(direction), Dismiss}
R'     = Adapted result (contextualized output)
ContextualizedExecution = R' where (∀ task ∈ registered: task.status = completed) ∨ user_esc

── PHASE TRANSITIONS ──
Phase 0: R → Eval(R, X) → Mᵢ?                                  -- applicability gate (silent)
Phase 1: Mᵢ → TaskCreate[all mismatches] → Q[AskUserQuestion](Mᵢ[0], evidence) → A  -- register all, surface first [Tool]
Phase 2: A → adapt(A, R) → R' → TaskUpdate → Eval(R', X) → Mₑ? -- adaptation + update + re-scan [Tool]

── LOOP ──
After Phase 2: re-scan R' against X for remaining AND newly emerged mismatches.
If new mismatches from adaptation (Mₑ): TaskCreate → add to queue.
If remaining non-empty: return to Phase 1 (next by severity).
If adjudicated(R', X): all tasks completed → convergence.
User can exit at Phase 1 (early_exit option or Esc).
Continue until: contextualized(R') OR user ESC.
Mode remains active until convergence.

── CONVERGENCE ──
applicable(R', X) = ∀ aspect(a, R', X) : warranted(a, R', X)
warranted(a, R, X) = correct(R) ∧ fits(R, X)                -- correctness AND contextual fit required (not material conditional)
adjudicated(R', X) = ∀ aspect(a, R', X) : warranted(a, R', X) ∨ dismissed(a)
contextualized(R') = adjudicated(R', X) ∨ user_esc
-- stratification: applicable(R', X) ⊆ adjudicated(R', X)
-- operational proxy: ∀ task completed ⟹ adjudicated(R', X) ⟹ contextualized(R')
progress(Λ) = |completed_tasks| / |total_tasks|              -- may regress when re-scan discovers new mismatches

── TOOL GROUNDING ──
Eval   (detect)  → Internal analysis (no external tool)
Q      (extern)  → AskUserQuestion (mandatory; Esc key → loop termination at LOOP level, not an Answer)
adapt  (modify)  → Edit, Write (result adaptation based on user direction)
                    -- (modify): tool call that changes existing artifacts (distinct from (extern) user-facing, (detect) read-only, (state) internal)
Mᵢ/Mₑ (state)   → TaskCreate/TaskUpdate (mismatch tracking with progress visibility)

── MODE STATE ──
Λ = { phase: Phase, R: Result, X: Context,
      state: Σ, active: Bool, cause_tag: String }
Σ = { history: List<(Mismatch, A)>, scan_count: Nat }
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
| **Horismos** | AI-guided | BoundaryUndefined → DefinedBoundary | Epistemic boundary definition |
| **Aitesis** | AI-guided | ContextInsufficient → InformedExecution | Context sufficiency sensing |
| **Analogia** | AI-guided | MappingUncertain → ValidatedMapping | Abstract-concrete mapping validation |
| **Prosoche** | User-initiated | ExecutionBlind → SituatedExecution | Execution-time risk evaluation |
| **Epharmoge** | AI-guided | ApplicationDecontextualized → ContextualizedExecution | Post-execution applicability |
| **Katalepsis** | User-initiated | ResultUngrasped → VerifiedUnderstanding | Comprehension verification |

**Key differences**:
- **Aitesis** infers context the AI lacks *before* execution (User→AI direction) — Epharmoge evaluates whether the completed result *fits* the context (AI→User direction). Same axis (context fitness), opposite timing and information flow.
- **Katalepsis** verifies the user's *comprehension* of correct results (`P'≅R`) — Epharmoge verifies the result's *applicability* to context (`R≅X`). Convergence conditions are structurally incompatible.
- **Syneidesis** surfaces gaps in the user's *decision quality* — Epharmoge surfaces gaps in the AI's *execution quality*. Different audit targets even when addressing the same domain.

**Context fitness axis**: Aitesis and Epharmoge form a pre/post pair on the context fitness axis. Aitesis asks "do I have enough context to execute well?" (factual uncertainties, User→AI). Epharmoge asks "does my execution actually fit the context?" (evaluative mismatches, AI→User). They are complementary, not redundant — Aitesis may gather sufficient context, yet the resulting execution may still not fit contextual constraints that only become visible post-execution.

**Independence from Aitesis**: Epharmoge's information source is the execution result itself (`R`) compared against observed context (`X`), not a re-scan of pre-execution context. This ensures non-circularity — even when Aitesis has fully resolved context uncertainties, Epharmoge can detect mismatches that emerge only from the actual output.

## Mode Activation

### Conditional Gate

> **This protocol is conditional.** AI-guided activation (Layer 2) requires operational experience with Aitesis (④) to validate the pre/post context fitness axis. Until this gate is satisfied, Epharmoge exists as a formal specification only and must not auto-activate via Layer 2.
>
> Activation criteria: Observed pattern of "context gathered but application mismatched" in Aitesis inference operational data.
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
- Loaded instructions resume after applicability is verified or dismissed

**Protocol precedence**: Activation order position 9/9 (graph.json is authoritative source for information flow). Concern cluster: Verification.

**Advisory relationships**: Receives from Prosoche (advisory: execution-time attention provides post-execution applicability context); Aitesis (suppression: pre+post stacking prevention). Katalepsis is structurally last.

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
| All mismatch tasks completed (adapted or dismissed) | Proceed with contextualized result |
| No mismatches detected (Phase 0 passes) | Execution stands as-is |
| User Esc key | Accept result without applicability review |

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
2. **Check applicability**: For each aspect, assess whether `correct(R) ∧ fits(R, X)` (i.e., `warranted(R, X)`)
3. If all aspects warranted: execution stands (Epharmoge not activated)
4. If mismatches identified: record `Mᵢ` with aspect, description, evidence, severity, `origin=Initial` — proceed to Phase 1

**Information source**: The execution result `R` itself compared against observable context `X`. NOT a re-scan of pre-execution context (non-circularity with Aitesis).

**Scan scope**: Completed execution output, project structure, observed conventions, session context. Does NOT re-execute or modify files.

### Phase 1: Mismatch Surfacing

**Register all identified mismatches as Tasks** (TaskCreate), then **call the AskUserQuestion tool** to present the highest-severity remaining mismatch.

**Task format**:
```
TaskCreate({
  subject: "[Mismatch:aspect] description",
  description: "Evidence and context for this mismatch (severity: X)",
  activeForm: "Surfacing [aspect] mismatch"
})
```

**Do NOT present mismatches as plain text.** The tool call is mandatory — text presentation without tool = protocol violation.

**Surfacing format** (natural integration with execution completion):

Present the mismatch findings as text output:
- Done. One thing to verify about applicability:
  - **Mismatch**: [Specific mismatch description]
  - **Evidence**: [what in the result and what in the context diverge]
  - **Progress**: [N completed / M total tasks] (M may increase on re-scan)

Then **call AskUserQuestion**:

```
How would you like to handle this applicability mismatch?

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

1. **Confirm(mismatch)**: Mark mismatch as confirmed, apply adaptation using Edit/Write tools → TaskUpdate (completed)
2. **Adapt(direction)**: Apply user-directed adaptation to result `R'` using Edit/Write tools → TaskUpdate (completed)
3. **Dismiss**: Mark mismatch as dismissed, note fitness assumption accepted → TaskUpdate (completed)

After adaptation — **re-scan**:
- Re-evaluate `R'` against `X` for remaining AND **newly emerged** mismatches
- If new mismatches (`Mₑ`) from adaptation: TaskCreate with `origin=Emerged(adapted_aspect)` → add to queue
- If remaining tasks non-empty: return to Phase 1 (surface next mismatch by severity)
- If all tasks completed: execution complete with contextualized result
- Log `(Mismatch, A)` to `Σ.history`, increment `Σ.scan_count`

**Re-scan trigger**: Adaptation changes `R`, and changed `R'` may exhibit new mismatches not present in the original result. Always re-scan after each adaptation. Example: adapting deployment target → discovers CI pipeline convention mismatch; adapting API version → reveals dependency compatibility issue.

**Chain discovery**: When `Mₑ` emerges from an adaptation, the `origin = Emerged(parent_aspect)` field records the causal chain. This enables:
- Progress visibility: user sees which adaptations spawned new mismatches
- Convergence monitoring: chains that grow beyond 3 levels suggest a structural issue worth surfacing explicitly

### Post-Convergence Suggestions

After convergence, scan session context for continuing epistemic needs and present suggestions as natural-language text (no AskUserQuestion). Display only when at least one suggestion is actionable.

**Transformation check**: Before suggesting next protocols, briefly assess whether the contextualized result changed the follow-up work. State in one sentence what shifted (e.g., "The adapted deployment target requires updating the CI pipeline configuration") or note that the original result was confirmed as contextually appropriate. This is informational text — not an AskUserQuestion call.

**Protocol suggestions**: Based on session context, suggest protocols whose deficit conditions are observable:

- Comprehension check needed on contextualized result → suggest `/grasp` (verified understanding)
- Decision gaps revealed by context mismatch resolution → suggest `/gap` (gap audit)
- Contextualized result requires boundary redefinition → suggest `/bound` (boundary definition)

**Next steps**: Based on the converged output, suggest concrete follow-up actions:

- Summarize contextualized result with applied adaptations
- Note any environment assumptions that remain unverified

**Display rule**: Omit this section entirely when (a) user explicitly moved to next task, (b) no observable deficit conditions exist in session context, or (c) the user has already invoked another protocol in the current or immediately preceding message. Suggestions are informational text, not AskUserQuestion calls.

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
| Progress visibility | Task list renders `[N addressed / M total]` in Phase 1 | User sees progress; total may grow on re-scan |
| Early exit | User can dismiss all at any Phase 1 | Full control over review depth |
| Cross-protocol cooldown | `suppress(Epharmoge) if Aitesis.resolved_in_same_scope ∧ overlap(Aitesis.domains, Epharmoge.aspects)` | Prevents same-scope pre+post stacking |
| Cooldown scope | Cooldown applies within recommendation chains only; direct `/contextualize` invocation is never suppressed | User authority preserved |
| Natural integration | "Done. One thing to verify:" pattern | Fits completion flow, not interrogation |

## Rules

1. **AI-guided, user-judged**: AI detects applicability mismatch; user judges whether adaptation is needed via AskUserQuestion (Phase 1)
2. **Recognition over Recall**: Always **call** AskUserQuestion tool to present mismatches with evidence — text presentation without tool = protocol violation
3. **Applicability over Correctness**: When result is correct but contextually mismatched, surface the mismatch — do not assume correctness implies fitness
4. **Evidence-grounded**: Every surfaced mismatch must cite specific observable evidence from both result `R` and context `X`, not speculation
5. **One at a time**: Surface one mismatch per Phase 1 cycle; do not bundle multiple mismatches
6. **Dismiss respected**: User dismissal is final for that mismatch aspect in the current session
7. **Convergence persistence**: Mode active until all mismatch tasks are completed (resolved or dismissed)
8. **Non-circularity**: Information source is the execution result itself compared against context, not pre-execution context scans (independence from Aitesis)
9. **Early exit honored**: When user accepts result as-is, accept immediately regardless of remaining mismatches
10. **Cross-protocol awareness**: Suppress when Aitesis resolved overlapping domains in the same execution scope (within recommendation chains only)
11. **Conditional gate**: AI-guided activation (Layer 2) requires Aitesis operational experience confirmation. User-invocable activation (Layer 1 / `/contextualize`) is always available
12. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before calling AskUserQuestion. The `question` field contains only the essential question; `option.description` contains only option-specific differential implications. Embedding context in question fields = protocol violation
