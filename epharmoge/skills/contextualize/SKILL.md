---
name: contextualize
description: "Detect application-context mismatch after execution. Verifies applicability when correct output may not fit the actual context, producing contextualized execution. Type: (ApplicationDecontextualized, AI, CONTEXTUALIZE, Result) → ContextualizedExecution. Alias: Epharmoge(ἐφαρμογή)."
---

# Epharmoge Protocol

Detect application-context mismatch after execution through AI-guided applicability verification, where correct results that may not fit the actual context are surfaced for user judgment. Type: `(ApplicationDecontextualized, AI, CONTEXTUALIZE, Result) → ContextualizedExecution`.

## Definition

**Epharmoge** (ἐφαρμογή): A dialogical act of verifying that results fit the actual application context — from Aristotle's notion of practical application — resolving the gap between technical correctness and contextual appropriateness through structured mismatch surfacing and user-directed adaptation.

```
── FLOW ──
Epharmoge(R, X) → Eval(R, X) → Mᵢ? → AssessFit(R, X, Mᵢ) → F → Register(Mᵢ) → SelectNext(pending, F, Σ) → Mₛ → Q(F-scoped Mₛ) → A → R' → Eval(R', X) → Mₑ? → Register(Mₑ) → AssessFit(R', X, pending) → F' → (loop: SelectNext → Q → A → adapt → re-scan until contextualized)

── MORPHISM ──
(R, X)
  → evaluate(result, context)          -- detect applicability mismatch
  → assess_fit(result, context, mismatches) -- sort applicability fit before user judgment
  → surface(fit_scoped_mismatch, as_inquiry) -- present mismatch with fit basis and evidence
  → adapt(result, direction)           -- adapt result to context
  → ContextualizedExecution
requires: mismatch_detected(R, X)       -- runtime checkpoint (Phase 0)
deficit:  ApplicationDecontextualized    -- activation precondition (Layer 1/2)
preserves: X                             -- application context is fixed reference; morphism transforms R only
invariant: Applicability over Correctness

── TYPES ──
R      = Result to be evaluated (source-agnostic: AI output, analysis conclusion, decision outcome, or any completed work product)
           -- Input type: morphism processes R uniformly; enumeration scopes the definition, not behavioral dispatch
X      = Application context (environment, constraints, user situation)
Eval   = Applicability evaluation: (R, X) → Set(Mismatch)
Mismatch = { aspect: String, dimension: Dimension, description: String, evidence: String, severity: Severity, origin: Origin }
Dimension ∈ {Convention, Environment, Audience, Dependency} ∪ Emergent(Dimension)
Origin ∈ {Initial, Emerged(aspect)}                            -- mismatch provenance: initial scan or spawned by adapting parent aspect
Severity ∈ {Critical, Significant, Minor}                      -- Significant requires demonstrable behavioral impact (current-session task graph / downstream protocol activations); see Rule 12
AssessFit = Applicability fit assessment: R × X × Set(Mismatch) → F
           -- classifier over input_mismatches; does not generate new Mismatch objects
F      = ApplicabilityFitMap { fit_justifications, conflicts, depends, adaptation_options, open }
fit_justifications = Set(AspectFit) where aspect(R) is warranted in X
AspectFit = { aspect: String, evidence: String }
conflicts = Set(Mismatch) where evidence shows result behavior or meaning conflicts with X
           -- invariant: conflicts ⊆ input_mismatches
depends = Set(ContextCondition) where fitness hinges on an observable but unverified condition that could change adaptation or dismissal
ContextCondition = { target: Mismatch, condition: String, evidence: String, consequence: String }
                 -- invariant: target ∈ input_mismatches
adaptation_options = Set(AdaptationOption) where each option is tied to a conflict or dependency
AdaptationOption = { target: Mismatch ∪ ContextCondition, direction: String, effect: String }
open   = Set(ApplicabilityQuestion) where the answer could materially change the next adaptation judgment
ApplicabilityQuestion = { target: Mismatch, condition: String, reason: String, evidence_needed: String }
                       -- invariant: target ∈ input_mismatches
fit_category(m, F) =
  Conflict if m ∈ F.conflicts
  Dependent if ∃d ∈ F.depends : d.target = m
  Open if ∃q ∈ F.open : q.target = m
  Supported otherwise
FitRank = Conflict > Dependent > Open > Supported
SelectNext = Set(Mismatch) × F × Σ → Mₛ
           -- priority: severity(Critical > Significant > Minor), then FitRank, then oldest registered task
Mₛ     = Selected mismatch
Mᵢ     = Identified mismatches from Eval(R, X)                 -- origin = Initial
Mₑ     = Newly emerged mismatches from Eval(R', X)             -- origin = Emerged(adapted_aspect)
Register = Set(Mismatch) → Set(Task) [Tool: TaskCreate]       -- mismatch registration as tracked tasks
pending(Σ) = Set(Mismatch) where registered task status ∉ {completed, dismissed}
Q      = Applicability inquiry over F-scoped mismatch (gate interaction)
A      = User answer ∈ {Confirm(mismatch), Adapt(direction), Dismiss}
R'     = Adapted result (contextualized output)
ContextualizedExecution = R' where (∀ task ∈ registered: task.status = completed) ∨ user_esc

── PHASE TRANSITIONS ──
Phase 0: R → Eval(R, X) → Mᵢ? → AssessFit(R, X, Mᵢ) → F → Λ.fit_map := F  -- applicability checkpoint + fit map (silent)
Phase 1: Mᵢ → TaskCreate[all initial mismatches] → pending(Σ) → SelectNext(pending, F, Σ) → Mₛ → Qc(F-scoped Mₛ, evidence) → Stop → A  -- register all initial mismatches, surface selected mismatch with fit basis [Tool]
Phase 2: A → adapt(A, R) → R' → TaskUpdate → Eval(R', X) → Mₑ? → TaskCreate[all Mₑ] → pending(Σ) → AssessFit(R', X, pending) → F' → Λ.fit_map := F' -- adaptation + update + re-scan + recompute fit map [Tool]

── LOOP ──
After Phase 2: re-scan R' against X for remaining AND newly emerged mismatches.
Register all newly emerged mismatches from adaptation (Mₑ); AssessFit classifies tracked mismatches but never suppresses them.
Recompute F over pending(Σ) before selecting the next surfaced mismatch, even when Mₑ = ∅.
If pending(Σ) non-empty: return to Phase 1 (SelectNext by severity, then FitRank, then oldest registered task).
If adjudicated(R', X): all tasks completed → convergence.
User can exit at Phase 1 (early_exit option or Esc).
Continue until: contextualized(R') OR user ESC.
Mode remains active until convergence.
Convergence evidence: At adjudicated(R', X), present transformation trace — for each (m, _) ∈ Λ.state.history, show (ApplicationDecontextualized(m) → adaptation_result(m)). Convergence is demonstrated, not asserted.

── CONVERGENCE ──
applicable(R', X) = ∀ aspect(a, R', X) : warranted(a, R', X)
warranted(a, R, X) = correct(R) ∧ fits(R, X)                -- correctness AND contextual fit required (not material conditional)
adjudicated(R', X) = ∀ aspect(a, R', X) : warranted(a, R', X) ∨ dismissed(a)
contextualized(R') = adjudicated(R', X) ∨ user_esc
-- stratification: applicable(R', X) ⊆ adjudicated(R', X)
-- operational proxy: ∀ task completed ⟹ adjudicated(R', X) ⟹ contextualized(R')
progress(Λ) = |completed_tasks| / |total_tasks|              -- may regress when re-scan discovers new mismatches

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Eval   (sense)   → Internal analysis (no external tool)
AssessFit (sense) → Internal analysis (no external tool)
Qc     (constitution)    → present (mandatory; Esc key → loop termination at LOOP level, not an Answer)
adapt  (transform) → Edit, Write (result adaptation based on user direction)
                    -- (transform): tool call that changes existing artifacts; medium-agnostic (files, analysis text, generated content)
Mᵢ/Mₑ (track)   → TaskCreate/TaskUpdate (mismatch tracking with progress visibility)
converge (extension)  → TextPresent+Proceed (convergence evidence trace; proceed with contextualized execution)

── MODE STATE ──
Λ = { phase: Phase, R: Result, X: Context,
      fit_map: F, state: Σ, active: Bool, cause_tag: String }
Σ = { history: List<(Mismatch, A)>, scan_count: Nat }

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Dimension resolution emergent via session context.
```

## Core Principle

**Applicability over Correctness**: When AI detects that a technically correct result may not fit the actual application context, it surfaces the mismatch with evidence rather than assuming the result is adequate. Correctness is necessary but not sufficient — contextual fit determines whether the result serves its purpose.

Formal predicate: `correct(R) ∧ ¬warranted(R, X)` — the output is correct but not warranted in this context (Dewey's warranted assertibility; Ryle's knowing-how vs knowing-that).

## Mode Activation

### Conditional Activation Prerequisite

> **This protocol is conditional.** AI-guided activation (Layer 2) requires operational experience with Aitesis (④) to validate the pre/post context fitness axis. Until this prerequisite is satisfied, Epharmoge exists as a formal specification only and must not auto-activate via Layer 2.
>
> Activation criteria: Observed pattern of "context gathered but application mismatched" in Aitesis inference operational data.
>
> User-invocable activation (Layer 1 / `/contextualize`) is always available regardless of this prerequisite.

### Activation

AI detects applicability mismatch after execution OR user calls `/contextualize`. Detection is silent (Phase 0); surfacing always requires user interaction via Cognitive Partnership Move (Constitution) (Phase 1).

**Application decontextualized** = the result is technically correct but may not fit the actual application context.

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

**Action**: At Phase 1, present mismatch evidence via Cognitive Partnership Move (Constitution).
</system-reminder>

- Epharmoge completes before proceeding to next task
- Loaded instructions resume after applicability is verified or dismissed

### Trigger Signals

Heuristic signals for applicability mismatch detection (not hard gates):

| Signal | Detection |
|--------|-----------|
| Environment assumption | Result assumes environment state not verified in current context |
| Convention mismatch | Result follows general best practices but project has local conventions |
| Scope overflow | Result addresses more or less than the observed use case requires |
| Temporal context | Result applies to a version, state, or phase that may have shifted |

**Cross-session enrichment**: Repeated mismatch patterns accumulated in Anamnesis's hypomnesis store (session recall indices written by the SessionEnd/PreCompact hook) may adjust Phase 0 scan priority — known mismatch types are checked first. In parallel, when **`/recollect`** has been invoked this session, the recalled context surfaces prior application-context mismatch patterns observed in comparable deliverables, strengthening current mismatch detection by situating Phase 0 scans against the user's recurring convention and environment drifts. This is a heuristic input that may bias detection toward previously observed patterns; constitutive judgment remains with the user.

**Revision threshold**: When accumulated Emergent dimension detections across 3+ sessions cluster around a recognizable pattern outside the named dimensions {Convention, Environment, Audience, Dependency}, the Mismatch Dimension Taxonomy warrants promotion to a new named dimension. When accumulated classification false negatives across 3+ sessions cluster around a specific dimension, that dimension's detection boundary warrants revision or demotion to Emergent.

**Skip**:
- User provided explicit, detailed specification and result follows it exactly
- User explicitly says "looks good" or "proceed" after execution
- Trivial or mechanical execution (formatting, typo fixes, rename)
- Read-only / exploratory task — no result to evaluate
- Same (aspect, description) pair was dismissed in current session (session immunity)

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| All mismatch tasks completed (adapted or dismissed) | Proceed with contextualized result |
| No mismatches detected (Phase 0 passes) | Execution stands as-is |
| User Esc key | Accept result without applicability review |

## Mismatch Identification

Mismatches are identified across named dimensions — working hypotheses for systematic detection, not exhaustive categories.

### Mismatch Dimension Taxonomy

| Dimension | Detection | Question Form |
|-----------|-----------|---------------|
| **Convention** | Result follows general patterns but project has local conventions | "This follows best practices, but your project uses [local pattern]" |
| **Environment** | Result assumes environment state that differs from actual operating context | "This assumes [env state], but your context has [actual state]" |
| **Audience** | Result targets a different audience than the actual consumers | "This is written for [assumed audience], but [actual audience] will use it" |
| **Dependency** | Result interacts with components whose constraints weren't considered | "This depends on [component] which has [constraint not considered]" |

**Emergent mismatch detection**: Named dimensions are working hypotheses, not exhaustive categories. Detect Emergent mismatches when:
- The applicability gap spans multiple named dimensions
- User dismisses all named-dimension mismatches but the result still exhibits contextual misfit
- The execution context involves domain-specific fitness criteria that resist classification into the four named dimensions

Emergent mismatches must satisfy morphism `ApplicationDecontextualized → ContextualizedExecution`; boundary: contextual fit (in-scope) vs. decision gaps (→ `/gap`).

Each mismatch is characterized by:

- **aspect**: The dimension where result and context diverge
- **description**: What specifically doesn't fit
- **evidence**: Observable indicator from the result or context
- **severity**: Impact on applicability

### Severity

| Level | Criterion | Action |
|-------|-----------|--------|
| **Critical** | Result actively harmful in current context | Must resolve before using result |
| **Significant** | Result suboptimal or partially inappropriate AND mismatch carries demonstrable behavioral impact (downstream-decision impact, runtime divergence, gate-trajectory change) | Surface to user for judgment |
| **Minor** | Result adequate but could fit better, OR mismatch lacks demonstrable behavioral impact (covers both structural-only and suboptimal-without-impact cases) | Surface with pre-selected Dismiss option |

Behavioral-impact qualifier (Significant criterion): structural-change extent alone — line count, file count, scope size — is insufficient grounds for Significant; the mismatch must produce a demonstrable downstream behavioral consequence. **Assessment scope**: demonstrability is evaluated against the visible task graph and downstream protocol activations within the current session — not speculative future sessions, hypothetical user trajectories, or out-of-session consequences. When the visible session offers no anchor for the predicted consequence, the mismatch defaults to Minor (¬behavioral_impact disjunct). See Rule 12.

When multiple mismatches are identified, surface in severity order (Critical → Significant → Minor). Only one mismatch surfaced per Phase 1 cycle.

## Protocol

### Phase 0: Applicability Checkpoint (Silent)

Evaluate result against application context. This phase is **silent** — no user interaction.

1. **Scan result** `R` against context `X`: environment state, conventions, use case scope, temporal validity, user constraints
2. **Check applicability**: For each aspect, assess whether `correct(R) ∧ fits(R, X)` (i.e., `warranted(R, X)`)
3. **Assess fit**: Build `ApplicabilityFitMap` from warranted aspect evidence, conflicts, dependencies, adaptation options, and bounded open questions
4. If all aspects warranted: present finding per Rule 9 before concluding (Epharmoge not activated)
5. If mismatches identified: record `Mᵢ` with aspect, description, evidence, severity (per Rule 12 — behavioral-impact qualifier assessed against current-session task graph), `origin=Initial`, and fit-map placement — proceed to Phase 1

**Information source**: The result `R` itself compared against observable context `X`. NOT a re-scan of pre-execution context (non-circularity with Aitesis).

**Scan scope**: Completed result, observable context (structure, conventions, constraints), session context. Does NOT re-execute or modify files.

**Fit-map scope**: The map is pre-gate support for mismatch selection and adaptation direction. It classifies already detected mismatches; it does not create or suppress mismatch tasks. It may surface bounded open conditions only when the answer could change whether the result should be adapted or accepted as-is.

### Phase 1: Mismatch Surfacing

**Register all identified mismatches as Tasks** (TaskCreate), then **present** the next pending mismatch selected by `SelectNext` via Cognitive Partnership Move (Constitution).

**Task format**:
```
TaskCreate({
  subject: "[Mismatch:aspect] description",
  description: "Evidence and context for this mismatch (severity: X)",
  activeForm: "Surfacing [aspect] mismatch"
})
```

Constitution presentation yields turn for user response.

**Surfacing format** (natural integration with execution completion):

Present the mismatch findings as text output:
- Done. One thing to verify about applicability:
  - **Mismatch**: [Specific mismatch description]
  - **Evidence**: [what in the result and what in the context diverge]
  - **Fit basis**: [what already fits, what conflicts or depends, and any open condition tied to this mismatch that could change this adaptation decision]
  - **Progress**: [N completed / M total tasks] (M may increase on re-scan)

Then **present**:

```
How would you like to handle this applicability mismatch?

Options:
1. **Confirm** — yes, this needs adaptation: [brief direction prompt]
2. **Dismiss** — acceptable as-is: [stated assumption about context fit]
```

If adaptation direction is evident, materialize Adapt(direction) as a concrete option:
```
3. **[Specific adaptation]** — [what would change and why]
```
This is a contextual materialization of `Adapt(direction)` — the formal answer type remains `Adapt`, with the direction pre-populated from AI analysis.

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
- Register all new mismatches (`Mₑ`) from adaptation with `origin=Emerged(adapted_aspect)`; do not filter them by fit-map category
- Recompute `ApplicabilityFitMap` over all pending mismatches before selecting the next mismatch, even when `Mₑ = ∅`
- If remaining tasks non-empty: return to Phase 1 (surface next mismatch via `SelectNext`: severity, then FitRank, then oldest registered task)
- If all tasks completed: execution complete with contextualized result
- Log `(Mismatch, A)` to `Σ.history`, increment `Σ.scan_count`

**Re-scan trigger**: Adaptation changes `R`, and changed `R'` may exhibit new mismatches not present in the original result. Always re-scan after each adaptation — any adaptation may introduce mismatches in dimensions unrelated to the original aspect.

**Chain discovery**: When `Mₑ` emerges from an adaptation, the `origin = Emerged(parent_aspect)` field records the causal chain. This enables:
- Progress visibility: user sees which adaptations spawned new mismatches
- Convergence monitoring: chains that grow beyond 3 levels suggest a structural issue worth surfacing explicitly

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Minor severity mismatches only | Constitution interaction with Dismiss as default option |
| Medium | Significant severity, evidence is clear | Structured Constitution interaction with evidence |
| Heavy | Critical severity, multiple interacting mismatches | Detailed evidence + adaptation options |

## UX Safeguards

| Rule | Structure | Effect |
|------|-----------|--------|
| Gate specificity | `activate(Epharmoge) only if correct(R) ∧ ∃ ¬warranted(a, R, X)` | Prevents false activation on well-fitting results |
| Mismatch cap | One mismatch per Phase 1 cycle, severity order | Prevents post-execution question overload |
| Session immunity | Dismissed (aspect, description) → skip for session | Respects user's dismissal |
| Progress visibility | Task list renders `[N addressed / M total]` in Phase 1 | User sees progress; total may grow on re-scan |
| Deterministic selection | `SelectNext` orders pending mismatches by severity, FitRank, then oldest registered task | Removes unordered Set indexing from user-facing surfacing |
| Fit-map cap | `depends`/`open` only when observable evidence could change adaptation or dismissal | Prevents broad contextual caveat lists |
| Early exit | User can dismiss all at any Phase 1 | Full control over review depth |
| Cross-protocol cooldown | `suppress(Epharmoge) if Aitesis.resolved_in_same_scope ∧ overlap(Aitesis.domains, Epharmoge.aspects)` | Prevents same-scope pre+post stacking |
| Cooldown scope | Cooldown applies within recommendation chains only; direct `/contextualize` invocation is never suppressed | User authority preserved |
| Natural integration | "Done. One thing to verify:" pattern | Fits completion flow, not interrogation |

## Rules

1. **AI-guided, user-judged**: AI detects applicability mismatch; user judges whether adaptation is needed via Cognitive Partnership Move (Constitution) (Phase 1)
2. **Recognition over Recall**: Present structured options via Cognitive Partnership Move (Constitution) — structured content reaches the user with response opportunity — Constitution interaction requires turn yield before proceeding
3. **Applicability over Correctness**: When result is correct but contextually mismatched, surface the mismatch — do not assume correctness implies fitness
4. **Evidence-grounded**: Every surfaced mismatch must cite specific observable evidence from both result `R` and context `X`, not speculation
5. **Convergence persistence**: Mode active until all mismatch tasks are completed (resolved or dismissed)
6. **Non-circularity**: Information source is the result itself compared against context, not pre-execution context scans (independence from Aitesis)
7. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via Cognitive Partnership Move (Constitution). The question contains only the essential question; options contain only option-specific differential implications. Embedding context in question fields = protocol violation
8. **Convergence evidence**: Present transformation trace before declaring adjudicated(R', X); per-mismatch evidence is required
9. **Zero-mismatch surfacing**: If Phase 0 scan detects no context mismatches, present this finding with reasoning for user confirmation
10. **Option-set relay test (Extension classification)**: If AI analysis converges to a single dominant option (option-level entropy→0 — Extension mode of the Cognitive Partnership Move), present the finding directly. Each Constitution option must be genuinely viable under different user value weightings. Options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options
11. **Gate integrity** (Safeguard tier): The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation.
12. **Significant requires demonstrable behavioral impact**: Severity = Significant requires that the mismatch produces a demonstrable behavioral consequence — downstream-decision impact, runtime divergence, gate-trajectory change. Structural-change extent (line count, file count, scope size) alone is insufficient grounds — categorize as Minor when behavioral impact is undemonstrated. This guards against false-positive gating arising from conflation of structural-change extent with applicability impact, where the Option-set relay test (Rule 10) would otherwise apply only ex post via user challenge
13. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
14. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
15. **Applicability fit map is support only**: Use `ApplicabilityFitMap` to scope which mismatch is surfaced and which adaptation direction is practical. It classifies already detected mismatches and must not create, suppress, or terminalize mismatch tasks.
16. **All detected mismatches remain tracked**: Initial and emerged mismatches are registered before fit-map prioritization. Fit categories affect selection order and fit-basis wording only; they never remove a detected mismatch from convergence accounting.
