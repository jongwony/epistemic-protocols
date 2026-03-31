---
name: grasp
description: "Achieve certain comprehension after AI work. Verifies understanding when results remain ungrasped, producing verified understanding. Type: (ResultUngrasped, User, VERIFY, Result) → VerifiedUnderstanding. Alias: Katalepsis(κατάληψις)."
---

# Katalepsis Protocol

Achieve certain comprehension of AI work through structured verification, enabling the user to grasp ungrasped results. Type: `(ResultUngrasped, User, VERIFY, Result) → VerifiedUnderstanding`.

## Definition

**Katalepsis** (κατάληψις): A dialogical act of achieving firm comprehension—from Stoic philosophy meaning "a grasping firmly"—resolving ungrasped AI-generated results into verified user understanding through categorized entry points and progressive verification.

```
── FLOW ──
R → C → Sₑ → Tᵣ → detect(C) → GT → P → Δ → Q → A → Q(coverage) → Tᵤ → P' → (loop until katalepsis)

── MORPHISM ──
Result
  → categorize(result)                 -- extract comprehension categories from AI work
  → select(entry_points)              -- user chooses categories to verify
  → register(tasks)                   -- track selected categories as tasks
  → verify(comprehension)             -- Socratic probing per gap type
  → confirm(coverage)                 -- aspect coverage check per category
  → VerifiedUnderstanding
requires: result_exists(R)              -- AI work output must exist in context
deficit:  ResultUngrasped               -- activation precondition (Layer 1)
preserves: R                            -- read-only throughout; morphism acts on user understanding only
invariant: Comprehension over Explanation

── TYPES ──
R  = AI's result (the work output)
C  = Categories extracted from R
Sₑ = User-selected entry points
Tᵣ = Task registration for tracking
P  = User's phantasia (current representation/understanding)
Δ  = Detected comprehension gap
Q  = Verification question (via gate interaction)
A  = User's answer
Aᵣ = User's reasoning behind misconception (via gate interaction)
Tᵤ = Task update (progress tracking)
P' = Updated phantasia (refined understanding)
J_cov = CoverageRouting ∈ {sufficient, aspect(GapType), proposal}
GT = Relevant gap types per category ⊆ {Expectation, Causality, Scope, Sequence} ∪ Emergent(C)

── PHASE TRANSITIONS ──
Phase 0: R → Categorize(R) → C                         -- analysis (silent)
Phase 1: C → Qc(entry points) → Stop → Sₑ              -- entry point selection [Tool]
Phase 2: Sₑ → TaskCreate[selected] → Tᵣ                -- task registration [Tool]
Phase 3: Tᵣ → TaskUpdate(current) → detect(C) → GT → P → Δ  -- comprehension check [Tool]
       → Qs(Δ) → Stop → A → P' → Tᵤ                     -- verification loop; Qc for Expectation/Sequence gaps, Qs for Causality/Scope/Emergent [Tool]
       → TaskCreate[Proposal] if proposal(A)             -- proposal ejection (detected from Other) [Tool]
       → Qᵣs(Aᵣ) → Stop if misconception(A)             -- reasoning inquiry [Tool]
       → Read(source) if eval(A, Aᵣ) requires           -- AI-determined reference [Tool]
       → Qc(coverage) → Stop if correct(A)               -- aspect summary [Tool]

── LOOP ──
After Phase 3 verification: Evaluate comprehension per gap type.
If |GT| = 0 for current category: present self-evident finding with reasoning per Rule 10, mark task completed upon confirmation, proceed to next task.
If gap detected: Continue questioning within current category.
If correct: Aspect summary — show probed vs unprobed gap types.
  User selects "sufficient" → TaskUpdate completed, next pending task.
  User selects additional aspect → Resume with selected gap type.
  User provides proposal via Other → detected by Step 3b, ejected via TaskCreate, resume current loop position.
Continue until: all selected tasks completed OR user ESC.
Convergence evidence: At all-tasks-completed, present transformation trace — for each t ∈ Λ.tasks, show (ResultUngrasped(t) → verified(t) with comprehension evidence). Convergence is demonstrated, not asserted.

── CONVERGENCE ──
Katalepsis = ∀t ∈ Λ.tasks: t.status = completed
           ∧ P' ≅ R (user understanding matches AI result)
VerifiedUnderstanding = P' where (∀t ∈ Λ.tasks: t.status = completed ∧ P' ≅ R) ∨ user_esc

── TOOL GROUNDING ──
-- Realization: gate → TextPresent+Stop; relay → TextPresent+Proceed
Phase 1 Qc  (gate)   → present (entry point selection)
Phase 2 Tᵣ  → TaskCreate (category tracking)
Phase 3 detect (detect) → Internal analysis (gap type relevance detection per category)
Phase 3 Qs  (gate)   → present (mandatory; Esc key → loop termination at LOOP level, not an Answer)
Phase 3 Qᵣs (gate)  → present (misconception reasoning inquiry)
Phase 3 Qc  (gate)   → present (aspect coverage: sufficient/aspect)
Phase 3 Ref → Read (source artifact, AI-determined)
Phase 3 Tᵤ  → TaskUpdate (progress tracking)
Phase 3 Prop → TaskCreate (proposal ejection)
Categorize  → Internal analysis (Read for context if needed)
converge    (relay)  → TextPresent+Proceed (convergence evidence trace; proceed with verified understanding)

── ELIDABLE CHECKPOINTS ──
-- Axis: relay/gated = interaction kind; always_gated/elidable = regret profile
Phase 1 Qc (entry points)  → always_gated (gated: verification scope selection)
Phase 3 Qs (verify)        → always_gated (gated: Socratic probe — user comprehension is the measurement)
Phase 3 Qᵣs (reasoning)   → always_gated (gated: misconception reasoning hypothesis)
Phase 3 Qc (coverage)      → always_gated (gated: aspect coverage — sufficient vs explore more)

── MODE STATE ──
Λ = {
  phase: Phase,
  R: Result,
  categories: List<Category>,
  selected: List<Category>,
  tasks: Map<TaskId, Task>,
  current: TaskId,
  phantasia: Understanding,
  detected: Map<TaskId, Set<GapType>>,
  probed: Map<TaskId, Set<GapType>>,
  active: Bool
}
```

## Core Principle

**Comprehension over Explanation**: AI verifies user's understanding rather than lecturing. The goal is confirmed comprehension, not information transfer.

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
| **Prosoche** | User-initiated | ExecutionBlind → SituatedExecution | Risk-assessed execution |
| **Epharmoge** | AI-guided | ApplicationDecontextualized → ContextualizedExecution | Post-execution applicability |
| **Katalepsis** | User-initiated | ResultUngrasped → VerifiedUnderstanding | Comprehension verification |

**Key difference**: AI work exists but the result remains ungrasped by the user. Katalepsis guides user to firm understanding through structured verification.

## Mode Activation

### Activation

Command invocation or trigger phrase activates mode until comprehension is verified for all selected categories.

**Activation layers**:
- **Layer 1 (User-invocable)**: `/grasp` slash command or description-matching input. Always available.
- **Layer 2**: No AI-guided activation. User signals awareness of comprehension deficit.

### Priority

<system-reminder>
When Katalepsis is active:

**Supersedes**: Default explanation patterns in AI responses
(Verification questions replace unsolicited explanations)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 1, present entry point selection via gate interaction and yield turn.
At Phase 3, present comprehension verification via gate interaction and yield turn.
</system-reminder>

- Katalepsis provides structured comprehension path
- Loaded instructions resume after mode deactivation

**Protocol precedence**: Structural constraint — always executes last (graph.json is authoritative source for information flow). Cross-cutting: requires all protocols to complete before verification.

**Advisory relationships**: Receives from * (precondition: all protocol output required for comprehension verification). Katalepsis is structurally last.

### Triggers

| Signal | Examples |
|--------|----------|
| Direct request | "explain this", "help me understand", "walk me through" |
| Comprehension signal | "I don't get it", "what did you change?", "why?" |
| Following along | "let me catch up", "what's happening here?" |
| Review request | "show me what you did", "summarize the changes" |

**Qualifying condition**: Activate only when trigger signal co-occurs with recent AI-generated work output (`R` exists in conversation context). Do not activate on general questions unrelated to prior AI work.

**Skip**:
- User demonstrates understanding through accurate statements
- User explicitly declines explanation
- Changes are trivial (typo fixes, formatting)

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| User explicitly cancels | Accept current understanding |
| User demonstrates full comprehension | Early termination |

## Category Taxonomy

Categories are extracted from AI work results. Common categories:

| Category | Description | Example |
|----------|-------------|---------|
| **New Code** | Newly created functions, classes, files | "Added `validateInput()` function" |
| **Modification** | Changes to existing code | "Modified error handling in `parse()`" |
| **Refactoring** | Structural changes without behavior change | "Extracted helper method" |
| **Dependency** | Changes to imports, packages, configs | "Added new npm package" |
| **Architecture** | Structural or design pattern changes | "Introduced factory pattern" |
| **Bug Fix** | Corrections to existing behavior | "Fixed null pointer in edge case" |
| **Deletion** | Removed code, features, or dependencies | "Removed deprecated `legacyAuth()` function" |

## Gap Taxonomy

Comprehension gaps within each category:

| Type | Detection | Question Form | Relevance |
|------|-----------|---------------|-----------|
| **Expectation** | User's assumed behavior differs from actual | "Did you expect this to return X?" | Behavior changes (new code, bug fix, modification) |
| **Causality** | User doesn't understand why something happens | "Do you understand why this value comes from here?" | Non-obvious causal chains (architecture, dependency) |
| **Scope** | User doesn't see full impact | "Did you notice this also affects Y?" | Cross-cutting impact (architecture, refactoring) |
| **Sequence** | User doesn't understand execution order | "Do you see that A happens before B?" | Order-sensitive changes (initialization, dependency) |
| **Emergent** | Gap outside canonical types | Adapted to specific comprehension deficit | Must satisfy morphism `ResultUngrasped → VerifiedUnderstanding`; boundary: comprehension verification (in-scope) vs. intent expression (→ `/clarify`) or decision gaps (→ `/gap`) |

**Emergent gap detection**: Named types are working hypotheses, not exhaustive categories. Detect Emergent gaps when:
- User's comprehension difficulty spans multiple named types (e.g., understanding both causality and scope simultaneously in a cross-cutting change)
- User selects "Other" or pushes back on all presented gap types in the coverage check
- The AI work involves domain-specific patterns where canonical comprehension dimensions are insufficient (e.g., concurrency reasoning, security implications)

## Protocol

### Phase 0: Categorization (Silent)

Analyze AI work result and extract categories:

1. **Identify changes**: Parse diff, new files, modifications
2. **Categorize**: Group by taxonomy above
3. **Prioritize**: Order by importance (architecture > new code > modification > ...)
4. **Summarize**: Prepare concise category descriptions

**Cross-session enrichment**: Verified understanding domains accumulated in MEMORY.md or .insights/ through prior Reflexion cycles may adjust Phase 0 category prioritization — areas with established comprehension receive lower priority while novel or previously-failed comprehension areas are flagged. This is a heuristic input; gate judgment remains with the user.

### Phase 1: Entry Point Selection

**Present** entry points via gate interaction to let user select where to start.

**Do NOT bypass the gate.** Structured presentation with turn yield is mandatory — presenting content without yielding for response = protocol violation.

```
question: "What would you like to understand first?"
multiSelect: true
options:
  - label: "[Category A]"
    description: "[brief description]"
  - label: "[Category B]"
    description: "[brief description]"
  - label: "[Category C]"
    description: "[brief description]"
```

**Design principles**:
- Show max 4 categories per question
- Each category is an individual option (do not pre-combine into composite options)
- Allow multi-select for related categories

### Phase 2: Task Registration

**Call TaskCreate** for each selected category:

```
TaskCreate({
  subject: "[Grasp] Category name",
  description: "Brief description of what to understand",
  activeForm: "Understanding [category]"
})
```

Set task dependencies if categories have logical order (e.g., understand architecture before specific implementation).

### Phase 3: Comprehension Loop

For each task (category):

1. **TaskUpdate** to `in_progress`

2. **Present overview**: Brief summary of the category, then show detected gap types (GT) and let user select starting aspect:

   Present the detected aspects as text output:
   - Detected relevant aspects for [Category]: [GT list]

   Then **present**:

   ```
   Which aspect to start with?
   options:
     - label: "[Gap type A]"
       description: "[Why relevant to this category]"
     - label: "[Gap type B]"
       description: "[Why relevant to this category]"
   ```

   This lightweight `select_start` prevents AI-imposed framing on the first probe without requiring full pre-authorization of the detection set. User picks starting direction; remaining aspects surface in step 3d.

3. **Verify comprehension** by **presenting** a Socratic probe via gate interaction:

   **Do NOT bypass the gate.** Structured presentation with turn yield is mandatory — presenting content without yielding for response = protocol violation.

   Present the relevant context as text output:
   - What the AI work did for this aspect (the component, behavior, or mechanism being tested)
   - The specific scenario or input being used for the probe

   Construct a probe based on the detected gap type — the probe should test whether the user can demonstrate the specific knowledge that gap type targets (prediction for Expectation, explanation for Causality, impact awareness for Scope, ordering for Sequence).

   **Gap type → probe kind mapping**: The probe’s gate kind (Qc vs Qs) varies by gap type to match the answer space structure:

   | Gap Type | Probe Kind | Rationale |
   |----------|------------|-----------|
   | **Expectation** | Qc (classificatory) | Answer space is enumerable — user selects from finite correct/partial/misconception options representing predicted behaviors |
   | **Sequence** | Qc (classificatory) | Answer space is enumerable — user selects from finite ordering options |
   | **Causality** | Qs (constitutive) | Causal reasoning requires model-discriminating options where the user’s own reasoning is diagnostic |
   | **Scope** | Qs (constitutive) | Impact enumeration requires user-generated content — scope awareness cannot be tested by selection alone |
   | **Emergent** | Qs (constitutive) | Unknown structure favors open response — no pre-enumerable answer space |

   Estimated split: ~40–50% Type F (Expectation, Sequence → Qc probes), ~50–60% Type M (Causality, Scope, Emergent → Qs probes). The split reflects that comprehension verification often involves causal and scope understanding, which resist reduction to finite option sets.

   Then **present** the probe question with understanding-level options:
   ```
   question: "[Essential verification question]"
   options:
     - label: "[Correct understanding]"
       description: "[domain-specific rationale: what this understanding enables or predicts]"
     - label: "[Partial/uncertain response]"
       description: "[domain-specific rationale: what aspect remains unclear and why it matters]"
     - label: "[Misconception]"
       description: "[domain-specific rationale: what this misunderstanding would cause in practice]"
   Other: user explains freely — AI evaluates comprehension level
   ```

   Option descriptions must be domain-specific rationale grounded in the current probe context, not meta-labels about what the selection signals. Each description answers "why does this understanding matter?" rather than "what does this selection indicate?"

3b. **On proposal detected** (user answer suggests changes or improvements to the discussed system, AND meets at least one auxiliary signal):
   - Acknowledge briefly: "Noted — recorded as a task. Continuing verification."
   - Call TaskCreate to eject the proposal:
     ```
     TaskCreate({
       subject: "[Grasp:Proposal] Brief description",
       description: "User proposal during [category]: [verbatim user text]",
       activeForm: "Archiving user proposal"
     })
     ```
   - Return to comprehension loop immediately

   **Detection criteria**:
   - **Required**: Suggests changes or improvements to the discussed system (direction toward knowledge capture, not comprehension)
   - **Auxiliary** (at least one): introduces concepts not in original AI work output `R`; contains action-oriented language directed at the system (should change, could add, how about replacing)
   - **Exclude**: Requests for further explanation, code navigation, or clarification — even if phrased with action-oriented language (e.g., "could you show me that part?")

3c. **AI-determined response** (after evaluating user answer A):

   AI evaluates A against expected understanding and determines response:

   | Evaluation | Action | Tool |
   |------------|--------|------|
   | Correct (P' ≅ R) | Confirm, proceed to next aspect or category | TaskUpdate |
   | Partial gap | Targeted followup probe on the gap area | Gate interaction |
   | Misconception | Reasoning inquiry → targeted correction | Gate interaction, Read (AI-determined) |

   **Misconception handling** (three-step):

   1. **Reasoning inquiry**: Present the detected misconception context as text output (what the user answered vs. what was expected, without revealing the correct answer). Then **present** AI-generated reasoning hypotheses via gate interaction. Infer 2-3 likely reasoning paths from the specific misconception and present as options. Each option is a context-specific hypothesis derived from the user's actual wrong answer (not a generic template). Do not reveal the correct answer yet. "Other" is always available for unlisted reasoning.

   2. **Targeted correction**: Using both A and Aᵣ, address the root cause of the misconception. If Aᵣ reveals a specific mental model error, correct that model directly. Call Read for supporting reference if eval(A, Aᵣ) requires.

   3. **Resume**: Output a brief text nudge before presenting via gate interaction — remind the user they can share improvement ideas or unlisted comprehension gaps via the "Other" option. Adapt wording to fit the current context (no fixed template). This surfaces the Proposal path at the cognitive transition point between correction and re-verification, when users may have formed improvement ideas but are focused on "getting the right answer." User input via Other triggers Step 3b Proposal ejection workflow, then resumes the verification loop. Present via gate interaction again for the same aspect.

3d. **Aspect coverage check** (before marking category complete):

   When step 3c evaluates as Correct for the current gap type:

   1. Compare probed vs. unprobed detected relevant gap types (canonical + Emergent) for this category
   2. If unprobed aspects exist, output a brief text nudge reminding the user they can share improvement ideas or unlisted comprehension gaps via the "Other" option (adapt wording to context, no fixed template).

   Present progress as text output:
   - Verified [probed aspects] in [Category]

   Then **present**:

   ```
   question: "Any other aspects to explore?"
   options:
     - label: "Sufficient"
       description: "Proceed to next category with current understanding"
     - label: "[Unprobed gap type]"
       description: "[Why this gap type is relevant to this category]"
   ```

   **Option budget**: 4 slots max (Sufficient + up to 3 unprobed gap types). If >3 unprobed gap types remain, prioritize by detected relevance (see Gap Taxonomy Relevance column).

   Per LOOP — "Sufficient" → step 4, gap type → step 3.

   Skip if all detected relevant gap types already probed during the verification loop.

3e. **Emergent aspect handling**: When user selects "Other" and describes a comprehension gap
   not covered by detected canonical gap types:
   1. Register user's response as Emergent gap type in `Λ.detected[current]`
   2. Resume step 3 verification with the Emergent gap type as current aspect
   3. On subsequent coverage check (3d), the Emergent type appears in probed set

4. **On confirmed comprehension**: Per LOOP — TaskUpdate to `completed`, advance to next pending task.

5. **On gap detected**: Handle per step 3c evaluation table. Do not mark complete until user confirms.

### Verification Style

**Socratic verification**: Ask rather than tell.

**Chunking**: Break complex changes into digestible pieces. Verify each chunk before proceeding.

**Code reference**: When explaining, always reference specific line numbers or file paths.

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Simple change, user seems familiar | Single-probe gate interaction targeting core understanding |
| Medium | Moderate complexity | Scenario-based gate interaction targeting prediction |
| Heavy | Complex architecture or unfamiliar pattern | Multi-step decomposed gate interaction targeting causal reasoning |

## Rules

1. **User-initiated only**: Activate only when user signals desire to understand
2. **Recognition over Recall**: Present structured options via gate interaction and yield turn — structured content must reach the user with response opportunity. Bypassing the gate (presenting content without yielding turn) = protocol violation
3. **Chunk complexity**: Break large changes into digestible categories
4. **Task tracking**: Call TaskCreate/TaskUpdate for progress visibility
5. **Code grounding**: Reference specific code locations
6. **User authority**: User's "I understand" is final
7. **Proposal ejection**: When user answer `A` drifts from comprehension toward knowledge capture (suggesting changes/improvements to the system), acknowledge briefly, call TaskCreate to externalize the proposal, and return to verification. This preserves user-generated insights without disrupting the comprehension loop. The protocol does not track ejected proposals in its own state.
8. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via gate interaction. The question contains only the essential question; options contain only option-specific differential implications. Embedding context in question fields = protocol violation
9. **No premature comprehension**: Do not declare all tasks completed without presenting convergence evidence trace. "Understanding verified" as assertion without per-task evidence = protocol violation
10. **No silent gap elision**: If Phase 3 analysis finds no comprehension gaps for a category, present this finding with reasoning to user for confirmation before marking as self-evident — do not silently skip
11. **Gate integrity**: Do not inject options not in the definition, delete defined options, or substitute defined options with different ones (gate mutation). Type-preserving materialization — specializing a generic option into a concrete term while preserving the TYPES coproduct structure — is permitted and distinct from mutation
