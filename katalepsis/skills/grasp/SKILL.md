---
name: grasp
description: "Achieve certain comprehension after AI work. Verifies understanding when results remain ungrasped, producing verified understanding. Alias: Katalepsis(κατάληψις)."
user-invocable: true
---

# Katalepsis Protocol

Achieve certain comprehension of AI work through structured verification, enabling the user to grasp ungrasped results. Type: `(ResultUngrasped, User, VERIFY, Result) → VerifiedUnderstanding`.

## Definition

**Katalepsis** (κατάληψις): A dialogical act of achieving firm comprehension—from Stoic philosophy meaning "a grasping firmly"—resolving ungrasped AI-generated results into verified user understanding through categorized entry points and progressive verification.

```
── FLOW ──
R → C → Sₑ → Tᵣ → P → Δ → Q → A → Tᵤ → P' → (loop until katalepsis)

── TYPES ──
R  = AI's result (the work output)
C  = Categories extracted from R
Sₑ = User-selected entry points
Tᵣ = Task registration for tracking
P  = User's phantasia (current representation/understanding)
Δ  = Detected comprehension gap
Q  = Verification question (via AskUserQuestion)
A  = User's answer
Tᵤ = Task update (progress tracking)
P' = Updated phantasia (refined understanding)

── PHASE TRANSITIONS ──
Phase 0: R → Categorize(R) → C                         -- analysis (silent)
Phase 1: C → Q[AskUserQuestion](entry points) → Sₑ     -- entry point selection [Tool]
Phase 2: Sₑ → TaskCreate[selected] → Tᵣ                -- task registration [Tool]
Phase 3: Tᵣ → TaskUpdate(current) → P → Δ              -- comprehension check [Tool]
       → Q[AskUserQuestion](Δ) → A → P' → Tᵤ           -- verification loop [Tool]
       → Read(source) if eval(A) requires               -- AI-determined reference [Tool]

── LOOP ──
After Phase 3: Check if current category fully understood.
If understood: TaskUpdate → completed, move to next pending task.
If new gaps: Continue questioning within current category.
Continue until: all selected tasks completed OR user ESC.

── CONVERGENCE ──
Katalepsis = ∀t ∈ Tasks: t.status = completed
           ∧ P' ≅ R (user understanding matches AI result)
VerifiedUnderstanding = P' where (∀t ∈ Tasks: t.status = completed ∧ P' ≅ R) ∨ user_esc

── TOOL GROUNDING ──
Phase 1 Q   → AskUserQuestion (entry point selection)
Phase 2 Tᵣ  → TaskCreate (category tracking)
Phase 3 Q   → AskUserQuestion (comprehension verification)
Phase 3 Ref → Read (source artifact, AI-determined)
Phase 3 Tᵤ  → TaskUpdate (progress tracking)
Categorize  → Internal analysis (Read for context if needed)

── MODE STATE ──
Λ = {
  phase: Phase,
  R: Result,
  categories: List<Category>,
  selected: List<Category>,
  tasks: Map<TaskId, Task>,
  current: TaskId,
  phantasia: Understanding,
  active: Bool
}
```

## Core Principle

**Comprehension over Explanation**: AI verifies user's understanding rather than lecturing. The goal is confirmed comprehension, not information transfer.

## Distinction from Other Protocols

| Protocol | Initiator | Deficit → Resolution | Focus |
|----------|-----------|----------------------|-------|
| **Prothesis** | AI-detected | FrameworkAbsent → FramedInquiry | Perspective selection |
| **Syneidesis** | AI-detected | GapUnnoticed → AuditedDecision | Decision-point gaps |
| **Hermeneia** | User-initiated | IntentMisarticulated → ClarifiedIntent | Expression clarification |
| **Telos** | AI-detected | GoalIndeterminate → DefinedEndState | Goal co-construction |
| **Katalepsis** | User-initiated | ResultUngrasped → VerifiedUnderstanding | Comprehension verification |

**Key difference**: AI work exists but the result remains ungrasped by the user. Katalepsis guides user to firm understanding through structured verification.

## Mode Activation

### Activation

Command invocation or trigger phrase activates mode until comprehension is verified for all selected categories.

**Comprehension verified** = all selected tasks marked `completed` via TaskUpdate.

### Priority

<system-reminder>
When Katalepsis is active:

**Supersedes**: Default explanation patterns in AI responses
(Verification questions replace unsolicited explanations)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 1, call AskUserQuestion for entry point selection.
At Phase 3, call AskUserQuestion for comprehension verification.
</system-reminder>

- Katalepsis provides structured comprehension path
- User Memory rules resume after mode deactivation

**Protocol precedence**: Non-Katalepsis protocols follow a default ordering (Hermeneia → Telos → Prothesis → Syneidesis) which the user can override. Katalepsis is a structural constraint — it requires completed AI work (`R`), so it always executes last. Do not include Katalepsis as an option in any multi-activation ordering choice.

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
| All selected tasks completed | Katalepsis achieved; proceed |
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

## Gap Taxonomy

Comprehension gaps within each category:

| Type | Detection | Question Form |
|------|-----------|---------------|
| **Expectation** | User's assumed behavior differs from actual | "Did you expect this to return X?" |
| **Causality** | User doesn't understand why something happens | "Do you understand why this value comes from here?" |
| **Scope** | User doesn't see full impact | "Did you notice this also affects Y?" |
| **Sequence** | User doesn't understand execution order | "Do you see that A happens before B?" |

## Protocol

### Phase 0: Categorization (Silent)

Analyze AI work result and extract categories:

1. **Identify changes**: Parse diff, new files, modifications
2. **Categorize**: Group by taxonomy above
3. **Prioritize**: Order by importance (architecture > new code > modification > ...)
4. **Summarize**: Prepare concise category descriptions

### Phase 1: Entry Point Selection

**Call the AskUserQuestion tool** to let user select where to start.

**Do NOT present entry points as plain text.** The tool call is mandatory—text-only presentation is a protocol violation.

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

2. **Present overview**: Brief summary of the category

3. **Verify comprehension** by **calling the AskUserQuestion tool** with a Socratic probe:

   **Do NOT present verification questions as plain text.** The tool call is mandatory—text-only presentation is a protocol violation.

   Construct a probe based on the detected gap type. Examples (not exhaustive — adapt freely to context):

   | Gap Type | Probe Form (illustrative) | Tests |
   |----------|---------------------------|-------|
   | Expectation | "If [specific input], what result would you expect?" | Predicted vs actual behavior |
   | Causality | "Why does [this component] behave this way?" | Causal chain understanding |
   | Scope | "What other parts are affected by this change?" | Impact awareness |
   | Sequence | "Which happens first — [A] or [B]?" | Execution order |

   Options represent understanding levels (not action choices):
   ```
   1. [Correct understanding] — confirms katalepsis for this aspect
   2. [Partial/uncertain response] — reveals specific gap area
   3. [Misconception] — indicates correction needed
   Other: (implicit) user explains freely — AI evaluates comprehension level
   ```

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
   | Partial gap | Targeted followup probe on the gap area | AskUserQuestion |
   | Misconception | Correction + supporting reference if needed | Read (AI-determined) |

   Resume comprehension verification by calling AskUserQuestion again for the same aspect.

4. **On confirmed comprehension**:
   - TaskUpdate to `completed`
   - Move to next pending task

5. **On gap detected**: Handle per step 3c evaluation table. Do not mark complete until user confirms.

## Codex Mapping

For Codex runtime, convert `AskUserQuestion` stages into `request_user_input` through canonical step routing:

- Source profile: `codex/examples/katalepsis.json`
- Mapping contract: `codex/compat/request-user-input-mapping.md`
- Schema: `codex/schemas/canonical-prompt.schema.json`

### Step Mapping (Pilot)

| AskUserQuestion Stage | Codex Canonical Steps | Rule |
|-----------------------|-----------------------|------|
| Phase 1 entry point selection (`multiSelect`, max 4 categories) | `phase1_category_router` → `phase1_category_detail` → `phase1_category_continue` | required `two_stage_routing` + iterative selection |
| Phase 3 comprehension verification | `phase3_probe` | direct |
| Phase 3 next-action gate | `phase3_next_action` | explicit continue/advance/stop |

### Task Mapping (Codex)

| Source Task Event | Codex Tool | Rule |
|-------------------|------------|------|
| Register selected categories (`TaskCreate`) | `update_plan` step create | mandatory; default status `pending` |
| Category starts (`TaskUpdate`: `pending → in_progress`) | `update_plan` status sync | emitted |
| Category mastered (`TaskUpdate`: `in_progress → completed`) | `update_plan` status sync | emitted |
| Non-critical TaskUpdate transitions | internal runtime state | no `update_plan` call |

### Codex Constraints

- Every step must declare `intent`.
- Every step must declare `on_escape` (`terminate` default).
- Source options > 3 require `two_stage_routing` decomposition.
- Effective multi-select uses repeated single-choice turns with explicit continuation.
- `TaskCreate` must map to `update_plan` step creation.
- `TaskUpdate` maps only for `pending → in_progress` and `in_progress → completed`.
- Keep at most one `in_progress` item in `update_plan`.
- If `update_plan` is unavailable, keep Task state internally (`internal_state_only`).

### Verification Style

**Socratic verification**: Ask rather than tell.

Instead of:
```
"This function does X because of Y."
```

Use:
```
"What do you think this function does?"
→ If correct: "That's right. Ready for the next part?"
→ If incorrect: "Actually, it does X. Does that make sense now?"
```

**Chunking**: Break complex changes into digestible pieces. Verify each chunk before proceeding.

**Code reference**: When explaining, always reference specific line numbers or file paths.

### Progress Tracking

| Phase | Task Operation |
|-------|----------------|
| Phase 2 | TaskCreate for ALL selected categories |
| Phase 3 start | TaskUpdate current category to `in_progress` |
| Comprehension verified | TaskUpdate to `completed` |
| Move to next | TaskUpdate next to `in_progress` |

**Convergence**: Mode terminates when all tasks show `completed` or user explicitly exits.

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Simple change, user seems familiar | "What does this new function do?" |
| Medium | Moderate complexity | "If [input], what would you expect this to return?" |
| Heavy | Complex architecture or unfamiliar pattern | "Let's take this step by step. Why does [A] call [B] here?" |

## Rules

1. **User-initiated only**: Activate only when user signals desire to understand
2. **Recognition over Recall**: Always **call** AskUserQuestion with Socratic probing questions — comprehension-testing options, not meta-selection (text presentation = protocol violation)
3. **Verify, don't lecture**: Confirm understanding through questions, not explanations
4. **Chunk complexity**: Break large changes into digestible categories
5. **Task tracking**: Call TaskCreate/TaskUpdate for progress visibility
6. **Code grounding**: Reference specific code locations
7. **User authority**: User's "I understand" is final
8. **Convergence persistence**: Mode remains active until all selected tasks completed
9. **Escape hatch**: User can exit at any time
10. **Phantasia update**: Each verification updates internal model of user's understanding
11. **Proposal ejection**: When user answer `A` drifts from comprehension toward knowledge capture (suggesting changes/improvements to the system), acknowledge briefly, call TaskCreate to externalize the proposal, and return to verification. This preserves user-generated insights without disrupting the comprehension loop. The protocol does not track ejected proposals in its own state.
12. **Codex task sync**: In Codex runtime, mirror TaskCreate always and mirror TaskUpdate only on high-signal transitions
