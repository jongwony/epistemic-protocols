---
name: grasp
description: "Verify understanding after AI work through intent-scented entry points. Type: (ResultUngrasped, User, VERIFY, Result) → VerifiedUnderstanding. Alias: Katalepsis(κατάληψις)."
---

# Katalepsis Protocol

Achieve certain comprehension of AI work through structured verification, enabling the user to grasp ungrasped results. Type: `(ResultUngrasped, User, VERIFY, Result) → VerifiedUnderstanding`.

## Definition

**Katalepsis** (κατάληψις): A dialogical act of achieving firm comprehension—from Stoic philosophy meaning "a grasping firmly"—resolving ungrasped AI-generated results into verified user understanding through intent-scented entry points and progressive verification.

```
── FLOW ──
R → U → I → E → Sₑ → B → Tᵣ → detect(E, B) → GT → P → Δ → Q → A → Q(coverage) → Tᵤ → P' → (loop until katalepsis)

── MORPHISM ──
Result
  → orient(result, user_signal)        -- infer likely comprehension intents from AI work and user's wording
  → select(intent_entry_point)         -- user chooses the closest intent-scented entry point
  → materialize(artifact_basis)        -- derive concrete artifact anchors for the chosen intent
  → register(tasks)                   -- track selected entry points as tasks
  → verify(comprehension)             -- Socratic probing per gap type
  → confirm(coverage)                 -- aspect coverage check per entry point
  → VerifiedUnderstanding
requires: result_exists(R)              -- AI work output must exist in context
deficit:  ResultUngrasped               -- activation precondition (Layer 1)
preserves: R                            -- read-only throughout; morphism acts on user understanding only
invariant: Comprehension over Explanation

── TYPES ──
R  = AI's result (the work output)
U  = User signal about what feels ungrasped
I  = ComprehensionIntent inferred from R and U
E  = Intent-scented entry points for I
Sₑ = User-selected entry point(s)
B  = ArtifactBasis materialized from selected entry point(s)
Tᵣ = Task registration for tracking
P  = User's phantasia (current representation/understanding)
Δ  = Detected comprehension gap
Q  = Verification question (via Cognitive Partnership Move (Constitution))
A  = User's answer
Aᵣ = User's reasoning behind misconception (via Cognitive Partnership Move (Constitution))
Tᵤ = Task update (progress tracking)
P' = Updated phantasia (refined understanding)
J_cov = CoverageRouting ∈ {sufficient, aspect(GapType), proposal}
GT = Relevant gap types per entry point ⊆ {Expectation, Causality, Scope, Sequence} ∪ Emergent(E, B)

── PHASE TRANSITIONS ──
Phase 0: (R, U) → Orient(R, U) → I → E                 -- intent orientation (silent)
Phase 1: E → Qc(intent entry points) → Stop → Sₑ       -- entry point selection [Tool]
Phase 2: Sₑ → Materialize(Sₑ, R) → B → TaskCreate[selected] → Tᵣ  -- task registration [Tool]
Phase 3: Tᵣ → TaskUpdate(current) → detect(E, B) → GT → P → Δ  -- comprehension check [Tool]
       → Qs(Δ) → Stop → A → P' → Tᵤ                     -- verification loop; Qc for Expectation/Sequence gaps, Qs for Causality/Scope/Emergent [Tool]
       → TaskCreate[Proposal] if proposal(A)             -- proposal ejection (detected from Other) [Tool]
       → Qᵣs(Aᵣ) → Stop if misconception(A)             -- reasoning inquiry [Tool]
       → Read(source) if eval(A, Aᵣ) requires           -- AI-determined reference [Tool]
       → Qc(coverage) → Stop if correct(A)               -- aspect summary [Tool]

── LOOP ──
After Phase 3 verification: Evaluate comprehension per gap type.
If |GT| = 0 for current entry point: present self-evident finding with reasoning per Rule 10, mark task completed upon confirmation, proceed to next task.
If gap detected: Continue questioning within current entry point.
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
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 Orient (observe) → Internal analysis (Read for context if needed)
Phase 1 Qc  (constitution)   → present (entry point selection)
Phase 2 B   (observe) → Internal analysis (artifact basis materialization)
Phase 2 Tᵣ  (track)   → TaskCreate (entry point tracking)
Phase 3 detect (sense) → Internal analysis (gap type relevance detection per entry point)
Phase 3 Qs  (constitution)   → present (mandatory; Esc key → loop termination at LOOP level, not an Answer)
Phase 3 Qᵣs (constitution)  → present (misconception reasoning inquiry)
Phase 3 Qc  (constitution)   → present (aspect coverage: sufficient/aspect)
Phase 3 Ref (observe) → Read (source artifact, AI-determined)
Phase 3 Tᵤ  (track)  → TaskUpdate (progress tracking)
Phase 3 Prop (track)  → TaskCreate (proposal ejection)
converge    (extension)  → TextPresent+Proceed (convergence evidence trace; proceed with verified understanding)
-- Interpretive transparency (Basis:) intentionally absent: Socratic verification requires AI judgment opacity — surfacing reasoning would compromise probe authenticity

── MODE STATE ──
Λ = {
  phase: Phase,
  R: Result,
  userSignal: UserSignal,
  intents: List<ComprehensionIntent>,
  entryPoints: List<EntryPoint>,
  selected: List<EntryPoint>,
  artifactBasis: Map<EntryPoint, ArtifactBasis>,
  tasks: Map<TaskId, Task>,
  current: TaskId,
  phantasia: Understanding,
  detected: Map<TaskId, Set<GapType>>,
  probed: Map<TaskId, Set<GapType>>,
  active: Bool
}

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Dimension resolution emergent via session context.
```

## Core Principle

**Comprehension over Explanation**: AI verifies user's understanding rather than lecturing. The goal is confirmed comprehension, not information transfer.

## Mode Activation

### Activation

Command invocation or trigger phrase activates mode until comprehension is verified for all selected entry points.

**Activation layers**:
- **Layer 1 (User-invocable)**: `/grasp` slash command or description-matching input. Always available.
- **Layer 2**: No AI-guided activation. User signals awareness of comprehension deficit.

### Priority

<system-reminder>
When Katalepsis is active:

**Supersedes**: Default explanation patterns in AI responses
(Verification questions replace unsolicited explanations)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 1, present entry point selection via Cognitive Partnership Move (Constitution).
At Phase 3, present comprehension verification via Cognitive Partnership Move (Constitution).
</system-reminder>

- Katalepsis provides structured comprehension path
- Loaded instructions resume after mode deactivation

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

## Entry Point Taxonomy

Entry points name what the user will be able to understand or do after verification. They are derived from the user's signal and the result, not from artifact categories alone.

| Intent | Use When | Example Label |
|--------|----------|---------------|
| **Orientation** | User needs the shape of the result before details | "what changed and why it matters" |
| **Rationale** | User asks why the AI chose this path | "why this approach was taken" |
| **Impact** | User needs downstream effects or risk surface | "what could break or change later" |
| **Approval** | User must decide whether the result is acceptable | "what I need to approve before using this" |
| **Transfer** | User needs to explain, maintain, or modify the result | "how I would explain or change this next time" |

## Artifact Basis Taxonomy

Artifact basis is materialized after entry point selection. It grounds probes without becoming the first user-facing choice.

| Basis | Description | Example |
|-------|-------------|---------|
| **Code Change** | New code, modification, refactoring, dependency, bug fix, deletion | "Changed parser error handling" |
| **Plan Artifact** | Goal, scope, sequence, assumption, owner, risk, acceptance criterion | "Added rollout plan and decision gates" |
| **Document Artifact** | Claim, section, commitment, unresolved question, audience implication | "Updated Notion decision record" |
| **Analysis Artifact** | Method, evidence, inference, conclusion, limitation | "Synthesized research findings" |
| **Model Artifact** | Input, calculation, assumption, sensitivity, output | "Produced valuation range" |

## Gap Taxonomy

Comprehension gaps within each entry point:

| Type | Detection | Question Form | Relevance |
|------|-----------|---------------|-----------|
| **Expectation** | User's assumed behavior differs from actual | "Did you expect this to return X?" | Behavior changes (new code, bug fix, modification) |
| **Causality** | User doesn't understand why something happens | "Do you understand why this value comes from here?" | Non-obvious causal chains (architecture, dependency) |
| **Scope** | User doesn't see full impact | "Did you notice this also affects Y?" | Cross-cutting impact (architecture, refactoring) |
| **Sequence** | User doesn't understand execution order | "Do you see that A happens before B?" | Order-sensitive changes (initialization, dependency) |
| **Emergent** | Gap outside canonical types | Adapted to specific comprehension deficit | Must satisfy morphism `ResultUngrasped → VerifiedUnderstanding`; boundary: comprehension verification (in-scope) vs. decision gaps (→ `/gap`) |

**Emergent gap detection**: Named types are working hypotheses, not exhaustive categories. Detect Emergent gaps when:
- User's comprehension difficulty spans multiple named types (e.g., understanding both causality and scope simultaneously in a cross-cutting change)
- User selects "Other" or pushes back on all presented gap types in the coverage check
- The AI work involves domain-specific patterns where canonical comprehension dimensions are insufficient (e.g., concurrency reasoning, security implications)

## Protocol

### Phase 0: Orientation (Silent)

Analyze the AI work result and the user's signal to infer likely comprehension intents:

1. **Identify result shape**: Detect whether `R` is code, plan, document, analysis, model, or mixed artifact
2. **Read user signal**: Extract the user's named concern, uncertainty, or desired use of the result
3. **Infer intents**: Generate 2-3 high-scent entry points using Entry Point Taxonomy
4. **Prepare basis hints**: Keep artifact categories as hidden grounding for each entry point

**Cross-session enrichment**: Verified understanding domains surfaced via Anamnesis's hypomnesis store may adjust Phase 0 entry point prioritization — areas with established comprehension receive lower priority while novel or previously-failed comprehension areas are flagged. This is a heuristic input that may bias detection toward previously observed patterns; constitutive judgment remains with the user.

**Revision threshold**: When accumulated Emergent gap detections across 3+ sessions cluster around a recognizable pattern outside the named types {Expectation, Causality, Scope, Sequence}, the Gap Taxonomy warrants promotion to a new named type. When accumulated probe misclassifications across 3+ sessions cluster around a specific gap type's probe kind boundary (Qc vs Qs), that type's probe kind assignment warrants revision.

### Phase 1: Intent-Scented Entry Point Selection

**Present** entry points via Cognitive Partnership Move (Constitution) to let user select where to start. Constitution presentation yields turn for user response.

```
question: "What would help you get oriented fastest?"
multiSelect: false
options:
  - label: "[intent entry point A]"
    description: "[what the user will be able to understand or decide after choosing it]"
  - label: "[intent entry point B]"
    description: "[what the user will be able to understand or decide after choosing it]"
  - label: "[intent entry point C]"
    description: "[what the user will be able to understand or decide after choosing it]"
Other: user states the entry point in their own words
```

**Design principles**:
- Show max 3 entry points in the first question
- Labels name user intent or outcome, not artifact taxonomy
- Descriptions carry information scent: what this path will make clear and why it matters
- Artifact basis may appear in surrounding context, not as the primary option label
- If the user explicitly asks for multiple focus areas, accept multi-select and register ordered tasks

### Phase 2: Task Registration

Materialize artifact basis for each selected entry point, then **call TaskCreate**:

```
TaskCreate({
  subject: "[Grasp] Entry point label",
  description: "Intent to verify + artifact basis used for grounding",
  activeForm: "Verifying [entry point]"
})
```

Set task dependencies only when entry points have a necessary order (e.g., understand the intended outcome before validating the risk surface).

### Phase 3: Comprehension Loop

For each task (entry point):

1. **TaskUpdate** to `in_progress`

2. **Present overview**: Brief summary of the selected intent and its artifact basis, then show everyday aspect labels derived from detected gap types (GT) and let user select starting aspect:

   Present the detected aspects as text output:
   - What this path covers: [plain-language aspect list]

   Then **present**:

   ```
   Which aspect to start with?
   options:
     - label: "[Aspect A]"
       description: "[Why relevant to this entry point]"
     - label: "[Aspect B]"
       description: "[Why relevant to this entry point]"
   ```

   This lightweight `select_start` prevents AI-imposed framing on the first probe without requiring full pre-authorization of the detection set. User picks starting direction; remaining aspects surface in step 3d. Use everyday labels like "what changed", "why this path", "what it affects", or "what happens first"; keep raw gap-type names internal unless the user already uses that vocabulary.

3. **Verify comprehension** by **presenting** a Socratic probe via Cognitive Partnership Move (Constitution):

   Constitution presentation yields turn for user response.

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
       description: "User proposal during [entry point]: [verbatim user text]",
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
   | Correct (P' ≅ R) | Confirm, proceed to next aspect or entry point | TaskUpdate |
   | Partial gap | Targeted followup probe on the gap area | Gate interaction |
   | Misconception | Reasoning inquiry → targeted correction | Gate interaction, Read (AI-determined) |

   **Misconception handling** (three-step):

   1. **Reasoning inquiry**: Present the detected misconception context as text output (what the user answered vs. what was expected, without revealing the correct answer). Then **present** AI-generated reasoning hypotheses via Cognitive Partnership Move (Constitution). Infer 2-3 likely reasoning paths from the specific misconception and present as options. Each option is a context-specific hypothesis derived from the user's actual wrong answer (not a generic template). Do not reveal the correct answer yet. "Other" is always available for unlisted reasoning.

   2. **Targeted correction**: Using both A and Aᵣ, address the root cause of the misconception. If Aᵣ reveals a specific mental model error, correct that model directly. Call Read for supporting reference if eval(A, Aᵣ) requires.

   3. **Resume**: Output a brief text nudge before presenting via Cognitive Partnership Move (Constitution) — remind the user they can share improvement ideas or unlisted comprehension gaps via the "Other" option. Adapt wording to fit the current context (no fixed template). This surfaces the Proposal path at the cognitive transition point between correction and re-verification, when users may have formed improvement ideas but are focused on "getting the right answer." User input via Other triggers Step 3b Proposal ejection workflow, then resumes the verification loop. Present a fresh Constitution interaction for the same aspect.

3d. **Aspect coverage check** (before marking entry point complete):

   When step 3c evaluates as Correct for the current gap type:

   1. Compare probed vs. unprobed detected relevant gap types (canonical + Emergent) for this entry point
   2. If unprobed aspects exist, output a brief text nudge reminding the user they can share improvement ideas or unlisted comprehension gaps via the "Other" option (adapt wording to context, no fixed template).

   Present progress as text output:
   - Verified [probed aspects] in [entry point]

   Then **present**:

   ```
   question: "Any other aspects to explore?"
   options:
     - label: "Sufficient"
       description: "Proceed to next entry point with current understanding"
     - label: "[Unprobed gap type]"
       description: "[Why this aspect is relevant to this entry point]"
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

**Chunking**: Break complex results into digestible intent paths. Verify each path before proceeding.

**Code reference**: When explaining, always reference specific line numbers or file paths.

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Simple change, user seems familiar | Single-probe Constitution interaction targeting core understanding |
| Medium | Moderate complexity | Scenario-based Constitution interaction targeting prediction |
| Heavy | Complex architecture or unfamiliar pattern | Multi-step decomposed Constitution interaction targeting causal reasoning |

## Rules

1. **User-initiated only**: Activate only when user signals desire to understand
2. **Recognition over Recall**: Present structured options via Cognitive Partnership Move (Constitution) — structured content reaches the user with response opportunity — Constitution interaction requires turn yield before proceeding
3. **Intent scent before artifact taxonomy**: First user-facing options name the user's likely comprehension intent; artifact categories remain grounding material until after the user chooses a path
4. **Task tracking**: Call TaskCreate/TaskUpdate for progress visibility
5. **Code grounding**: Reference specific code locations
6. **User authority**: User's "I understand" is final
7. **Proposal ejection**: When user answer `A` drifts from comprehension toward knowledge capture (suggesting changes/improvements to the system), acknowledge briefly, call TaskCreate to externalize the proposal, and return to verification. This preserves user-generated insights without disrupting the comprehension loop. The protocol does not track ejected proposals in its own state.
8. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via Cognitive Partnership Move (Constitution). The question contains only the essential question; options contain only option-specific differential implications. Embedding context in question fields = protocol violation
9. **Convergence evidence**: Present transformation trace before declaring all tasks completed; per-task evidence is required
10. **Zero-gap surfacing**: If Phase 3 analysis finds no comprehension gaps for an entry point, present this finding with reasoning for user confirmation before marking as self-evident
11. **Gate integrity**: The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation
12. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
13. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text, convergence traces, or later cycles.
