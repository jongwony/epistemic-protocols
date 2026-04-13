---
name: clarify
description: "Clarify intent-expression gaps. Extracts clarified intent when what you mean differs from what you said. Type: (IntentMisarticulated, Hybrid, EXTRACT, Expression) → ClarifiedIntent. Alias: Hermeneia(ἑρμηνεία)."
---

# Hermeneia Protocol

Resolve intent-expression misalignment through hybrid-initiated dialogue, enabling precise articulation before action proceeds. Type: `(IntentMisarticulated, Hybrid, EXTRACT, Expression) → ClarifiedIntent`.

## Definition

**Hermeneia** (ἑρμηνεία): A dialogical act of clarifying the gap between what the user intends and what they expressed, resolving misaligned intent into precise articulation through structured questioning.

```
── FLOW ──
E → recognize(E) → Eᵥ → detect(Eᵥ) → Gd → confirm(Gd) → Gₛ → Q → A → Î' → (loop until converge)

── MORPHISM ──
Expression
  → recognize(expression, trigger)     -- determine activation path from signal
  → confirm(expression)                -- verify which expression to clarify
  → detect(gaps_in_expression)         -- surface gap types with evidence
  → clarify(gap, as_options)           -- present structured clarification choices
  → integrate(answer, intent)          -- update intent model from response
  → ClarifiedIntent
requires: trigger(E) ∈ {user_signal, ai_strong ∧ confirmed}  -- Phase 0 gate
deficit:  IntentMisarticulated                                -- activation precondition (Layer 1/2)
preserves: E                                                  -- read-only throughout; morphism acts on Î only
invariant: Articulation over Assumption

── TYPES ──
E  = User's expression (the prompt to clarify)
Eᵥ = Verified expression (user-confirmed binding)
Gd = AI-detected gap types ⊆ {Expression, Precision, Coherence, Background} ∪ Emergent(Eᵥ)
Gₛ = User-confirmed gap types (from full taxonomy assessment after proceed/revise)
Q  = Clarification question (via gate interaction)
A  = User's answer
Î  = Inferred intent (AI's model of user's goal)
Î' = Updated intent after clarification
ClarifiedIntent = Î' where |remaining| = 0 ∨ cycle(G) ∨ stall(Δ, 2) ∨ user_esc
T  = Trigger source ∈ {user_signal, ai_strong, ai_soft}
suggest_only = ai_soft terminal: passive suggestion without activation (no gate interaction; Λ.active = false)

── E-BINDING ──
bind(E) = explicit_arg ∪ colocated_expr ∪ prev_user_turn ∪ ai_identified_expr
Priority: explicit_arg > colocated_expr > prev_user_turn > ai_identified_expr

/clarify "text"                → E = "text"
"request... clarify"           → E = text before trigger
/clarify (alone)               → E = previous user message
AI-detected trigger             → E = expression AI identified as ambiguous

Edge cases:
- Interrupt: E = original request of interrupted task
- Queued:    E = previous message at queue time (fixed)
- Re-invoke: Show prior clarification, confirm or restart

── PHASE TRANSITIONS ──
Phase 0:  E → recognize(E) → T                           -- trigger recognition
          T = user_signal → Phase 1a                      -- user-initiated path
          T = ai_strong   → Qc(confirm) → Stop → {yes: Phase 1a | no: immune(E)}  -- AI-detected confirm [Tool]
          T = ai_soft     → suggest_only                  -- suggest, do not activate
Phase 1a: E → Qc(E) → Stop → Eᵥ                          -- E confirmation [Tool]
Phase 1b: Eᵥ → detect(Eᵥ) → Gd → Qc(Gd, evidence) → Stop → Gₛ  -- gap detection + confirm [Tool]
Phase 2:  Gₛ → Qs(Gₛ) → Stop → A                         -- clarification [Tool]
Phase 3:  A → integrate(A, Î) → Î'                       -- intent update (sense)

── LOOP ──
After Phase 3: return to Phase 1b for newly surfaced gaps.
On re-entry, detect(Eᵥ) re-analyzes the expression in the context of prior clarifications; gaps in Λ.clarified are filtered from Gd by type before confirmation (type-level filtering ensures convergence; new instances of a clarified type are excluded).
If |Gₛ| = 0 after confirmation (all gaps removed): skip Phase 2, evaluate convergence (|remaining| = 0).
Continue until converge: |remaining| = 0, cycle detected, or user exits.
Mode remains active until convergence.
Convergence evidence: At |remaining| = 0, present transformation trace — for each g ∈ Λ.clarified, show (IntentMisarticulated(g) → resolution(g)) from Λ.history. Convergence is demonstrated, not asserted.

── TOOL GROUNDING ──
-- Realization: gate → TextPresent+Stop; relay → TextPresent+Proceed
Phase 0 Qc   (gate)   → present (AI-detected activation confirmation; ai_strong only)
Phase 1a Qc  (gate)   → present (E confirmation)
Phase 1b detect (sense)  → Internal analysis (gap detection from Eᵥ)
Phase 1b Qc  (gate)   → present (full taxonomy assessment: proceed/revise)
Phase 2 Qs   (gate)   → present (clarification options; Esc key → loop termination at LOOP level, not an Answer)
suggest_only (sense)   → no tool call (passive suggestion; Λ.active = false)
integrate    (track)   → Internal state update (no external tool)
converge     (relay)   → TextPresent+Proceed (convergence evidence trace; proceed with clarified expression)

── ELIDABLE CHECKPOINTS ──
-- Axis: relay/gated = interaction kind; always_gated/elidable = regret profile
Phase 0 Qc (confirm)       → conditional: ai_strong only (user_signal path skips Phase 0)
                              regret: bounded (Phase 1a Qc always gated; immune(E) on decline)
Phase 1a Qc (E confirm)    → elidable when: explicit_arg(E) via /clarify "text"
                              default: proceed with bound E
                              regret: bounded (Phase 1b Qc provides correction opportunity)
Phase 1b Qc (gap confirm)  → always_gated (gated: gap set shapes clarification path)
Phase 2 Qs (clarify)       → always_gated (gated: user incorporates intent into clarification)

── MODE STATE ──
Λ = { phase: Phase, trigger: T, E: Expression, Eᵥ: Expression, detected: Set(Gap), gaps: Set(Gap),
      clarified: Set(Gap), remaining: Set(Gap),
      immune: Set(Expression), history: List<(E, Gₛ, A)>, active: Bool }
-- Invariant: gaps = clarified ∪ remaining (pairwise disjoint)

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Dimension resolution emergent via session context.
```

## Core Principle

**Articulation over Assumption**: AI helps user express what they already know but struggle to articulate.

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
| **Anamnesis** | AI-guided | RecallAmbiguous → RecalledContext | Vague recall recognition |
| **Katalepsis** | User-initiated | ResultUngrasped → VerifiedUnderstanding | Comprehension verification |

**Key differences**: User recognizes intent-expression misalignment (user signal), or AI detects ambiguous expression (AI-detected trigger, requires user confirmation). Both paths help articulate what the user partially knows. Boundary with Aitesis: if the ambiguity is in the user's *expression* of intent (how it was said), use Hermeneia; if the AI lacks *factual execution context* (what information the system needs), use Aitesis.

## Mode Activation

### Activation

Command invocation, trigger phrase, or AI-detected expression ambiguity activates mode until clarification completes. AI-detected activation requires user confirmation before proceeding to Phase 1a.

**Activation layers**:
- **Layer 1 (User-invocable)**: `/clarify` slash command or description-matching input. Always available.
- **Layer 2 (Hybrid)**: User trigger signals proceed directly; AI-detected expression ambiguity (`ai_strong`) requires user confirmation; minor ambiguity (`ai_soft`) suggests only.

**Clarification complete** = one of: `|remaining| = 0` (no gaps remain), `cycle(G)` (already clarified), or `Δ = 0` for 2 rounds (progress stall with user consent to proceed).

### Priority

<system-reminder>
When Hermeneia is active:

**Supersedes**: Direct action patterns in loaded instructions
(Clarification must complete before any tool execution or code changes)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 2, present clarification options via gate interaction and yield turn.
</system-reminder>

- Hermeneia completes before other workflows begin
- Loaded instructions resume after intent is clarified

**Protocol precedence**: Activation order position 1/9 (graph.json is authoritative source for information flow). Concern cluster: Planning.

**Advisory relationships**: Provides to Telos (precondition: clarified intent enables goal construction), Aitesis (advisory: background gaps suggest context insufficiency). Katalepsis is structurally last.

Clarified expression becomes input to subsequent protocols.

### Triggers

**User-Initiated Signals** (`T = user_signal`):

| Signal | Examples |
|--------|----------|
| Direct request | "clarify what I mean", "help me articulate" |
| Self-doubt | "did I express this right?", "is this clear?" |
| Ambiguity acknowledgment | "I'm not sure how to phrase this", "this might be confusing" |
| Meta-communication | "what I'm trying to say is...", "let me rephrase" |

**Qualifying condition**: Activate only when user's entire message is a clarification request, or when 2+ trigger signals co-occur in the same message. Do not activate on casual meta-communication embedded in a larger request.

**AI-Detected Signals**:

| Strength | Trigger | Action |
|----------|---------|--------|
| Strong (`ai_strong`) | Standalone ambiguous expression with multiple valid interpretations | Confirm via gate interaction, then activate |
| Strong (`ai_strong`) | Request referencing undefined scope or entity | Confirm via gate interaction, then activate |
| Strong (`ai_strong`) | Scope-reference mismatch (expression scope ≠ referenced context) | Confirm via gate interaction, then activate |
| Soft (`ai_soft`) | Minor lexical ambiguity resolvable from context | Suggest only; do not activate |

**Skip** (user-initiated):
- User's expression is unambiguous
- User explicitly declines clarification
- Expression already clarified in current session

**Cross-session enrichment**: Accumulated clarification patterns from prior Reflexion cycles may improve ai_strong trigger precision — known intent-expression gaps in similar contexts reduce false positive detection. In parallel, anamnesis-recalled context from the current session surfaces the user's prior terminology and phrasing patterns, improving intent extraction by grounding Iᵥ construction in recognized expression habits. This is a heuristic input that may bias detection toward previously observed patterns; gate judgment remains with the user.

**Revision threshold**: When accumulated Emergent gap detections across 3+ sessions cluster around a recognizable pattern outside the named types {Expression, Precision, Coherence, Background}, the Gap Taxonomy warrants promotion to a new named type. When accumulated classification false positives across 3+ sessions cluster around a specific named type, that type's detection boundary warrants revision or demotion to Emergent.

**Skip** (AI-detected):
- User says "just do it", "proceed as-is", or equivalent
- Session immunity: user declined AI-detected clarification for this expression already
- Soft trigger resolved by context

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Clarification complete | Intent established; proceed with clarified expression |
| User accepts current expression | Original expression deemed sufficient |
| User explicitly cancels | Return to normal operation |

## Gap Taxonomy

| Type | Detection | Question Form |
|------|-----------|---------------|
| **Expression** | Incomplete articulation; missing key elements | "Did you mean X or Y?" |
| **Precision** | Ambiguous scope, quantity, or degree | "How specifically: [options]?" |
| **Coherence** | Internal contradiction or tension | "You mentioned X but also Y. Which takes priority?" |
| **Background** | Missing interpretive background needed to determine expression meaning | "What background should I know to interpret this correctly? [options]" |

**Emergent gap detection**: Named types are working hypotheses, not exhaustive categories. Detect Emergent gaps when:
- User's difficulty spans multiple named types (e.g., expression is both imprecise and internally coherent but misaligned with unstated context)
- User pushes back on all presented gap types ("none of these capture what's wrong")
- The expression's ambiguity resists decomposition into the four named dimensions

Emergent gaps must satisfy morphism `IntentMisarticulated → ClarifiedIntent` and use adapted question forms.

### Gap Priority

When multiple gaps detected:
1. **Coherence** (highest): Contradictions block all interpretation
2. **Background**: Missing interpretive background affects all other gaps
3. **Expression**: Core articulation gaps
4. **Precision** (lowest): Refinement after core is clear

### Background Gap Boundary

When the Background gap type is selected, verify the gap is about *interpreting the expression*, not about *executing the task*:

- **Hermeneia Background**: Missing background changes what E means (user's intent) → proceed with clarification
- **Aitesis territory**: Missing background changes how to perform X (prospect) → suggest `/inquire` and offer to transition

Operational test: "Would knowing this change what the user means, or only how I execute it?"

## Protocol

### Phase 0: Trigger Recognition

Recognize trigger source and determine activation path:

**User-Initiated Path** (`T = user_signal`):

1. **Explicit request**: User directly asks for clarification help
2. **Implicit signal**: User expresses doubt about their own expression
3. **Meta-communication**: User attempts to rephrase or explain their intent

→ Proceed directly to Phase 1a.

**AI-Detected Path** (`T = ai_strong`):

When AI detects a strong ambiguity trigger (see Triggers: AI-Detected Signals), present the detected ambiguity as text output (e.g., "I notice this expression may be ambiguous: [specific ambiguity evidence]"), then **present** to confirm activation:

```
Would you like to clarify this expression?

Options:
1. Yes, help me clarify — start Hermeneia
2. No, proceed as-is — continue without clarification
```

User confirmation required before proceeding to Phase 1a. If user selects option 2, mark session immunity and do not re-trigger for this expression.

`T = ai_soft` → suggest only; do not present via gate interaction, do not activate.

### Phase 1a: Expression Confirmation

**Present** to confirm which expression to clarify.

Present the bound expression E and ask user to confirm or specify:

```
Which expression would you like to clarify?

Options:
1. "[bound E]" — the expression I identified
2. "Specify different" — let me describe what I want to clarify
```

**Skip condition**: If E was explicitly provided via argument (`/clarify "text"`), proceed directly to Phase 1b.

**Note (AI-detected path)**: If triggered via `T = ai_strong`, E is already identified by AI — Phase 1a confirmation verifies the AI's identification; user may still select Option 2 to redirect to a different expression.

### Phase 1b: Gap Detection and Confirmation

Analyze Eᵥ to detect applicable gap types, then **present** full taxonomy assessment for user confirmation.

Per Gap Taxonomy above. Apply priority order: Coherence → Background → Expression → Precision. Emergent gaps must satisfy morphism `IntentMisarticulated → ClarifiedIntent`; boundary: intent-expression gap (in-scope) vs. goal definition (→ `/goal`) or execution context (→ `/inquire`).

Present the full taxonomy assessment as text output — every named type shown with detection status, evidence, and falsification condition for undetected types:

- **Coherence** ✓ detected: [specific evidence from Eᵥ]
- **Background** — not currently detected: [evidence considered]. Would apply if [falsification condition].
- **Expression** ✓ detected: [specific evidence from Eᵥ]
- **Precision** — not currently detected: [evidence considered]. Would apply if [falsification condition].
- **Emergent**: [If AI detects a potential emergent type: present as named hypothesis with evidence and boundary annotation. Otherwise: "Is there an aspect of your expression that doesn't fit the above categories?"]

Emergent gaps include boundary annotation: "This is an intent-expression gap (Hermeneia scope). Not: goal definition (→ `/goal`) or execution context (→ `/inquire`)"

Then **present**:

```
How would you like to proceed?

Options:
1. **Proceed with current assessment** — start clarification with detected gaps
2. **Revise assessment** — toggle any items or describe an emergent gap
```

- Detected types: evidence for why the gap was identified
- Not-currently-detected types: evidence considered + falsification condition ("would apply if [specific condition]")
- Evidence parity: each type (detected or not) receives comparable analytical depth

**Revise sub-step**: On "Revise assessment" selection, user specifies which types to toggle (include previously unselected, exclude previously detected) or describes an emergent gap. Multiple revisions in a single response are supported. After modification, re-present the updated assessment for final confirmation. Phase 1b completes when user selects "Proceed with current assessment."

**Emergent response parsing**: If user provides emergent type content alongside "Proceed with current assessment," treat the emergent content as implicit "Revise assessment" — incorporate the emergent type and re-present the updated assessment. If the content is ambiguous (could be a comment on an existing type rather than a new emergent), ask the user to clarify before proceeding.

**Soft guard**: If user excludes all types from assessment, confirm: "Excluding all gaps terminates clarification. Continue?" If confirmed, `|Gₛ| = 0` → skip Phase 2, evaluate convergence (`|remaining| = 0` in LOOP).

User confirmation determines Gₛ and the clarification strategy in Phase 2. If multiple confirmed, address in priority order (Coherence → Background → Expression → Precision).

### Phase 2: Clarification

**Present** clarification options via gate interaction.

**Do NOT bypass the gate.** Structured presentation with turn yield is mandatory — presenting content without yielding for response = protocol violation.

Present the detected ambiguity as text output:
- The potential ambiguity: [gap description]

Then **present**:

```
Which best captures your intent?

Options:
1. **[Option A]**: [interpretation with implications]
2. **[Option B]**: [interpretation with implications]
3. **[Option C]**: [interpretation with implications]
```

Other is always available — user can provide their own phrasing or a different interpretation not listed.

**Question design principles**:
- **Recognition over Recall**: Present options, don't ask open questions
- **Concrete implications**: Show what each choice means for execution
- **Free response preserved**: Other/free phrasing is structurally available, not conditionally included
- **Minimal options**: 2-4 choices maximum per gap

Consult `references/socratic-style.md` for maieutic framing examples, Socratic elements, and example transformation.

### Phase 3: Integration

After user response:

1. **Incorporate**: Update understanding with user's clarification
2. **Re-diagnose + Filter + Converge**: Per LOOP — re-scan Eᵥ, filter clarified gaps, check convergence
3. **Confirm**: When no gaps remain, present clarified intent for verification
4. **Proceed**: Continue with clarified expression

**Discovery triggers**:
- Clarification reveals new ambiguity ("I mean the API" → "which endpoint?")
- Answer creates new tension ("fast" + "thorough" → coherence gap)
- Context shift ("for production" → new precision requirements)

```markdown
## Clarified Intent — Convergence Evidence

Transformation trace (each clarified gap → resolution):
- **[Gap type]**: [Eᵥ evidence] → [Clarified meaning from A]
- **[Gap type]**: [Eᵥ evidence] → [Clarified meaning from A]

Proceeding with this understanding.
```

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Minor ambiguity, low stakes | Gate interaction with binary disambiguation |
| Medium | Significant ambiguity, moderate stakes | Gap statement + structured gate interaction with multiple options |
| Heavy | Core intent unclear, high stakes | Detailed options with implications + structured gate interaction |

## Multi-Gap Handling

When multiple gaps detected:

1. **Sequential**: Address one gap at a time, highest priority first
2. **Bundled**: If gaps are interdependent, present as combined question
3. **Dynamic Discovery**: After each clarification, re-diagnose for newly surfaced gaps
4. **Merge**: Combine existing queue with newly discovered gaps, re-prioritize

**Termination conditions**: Per LOOP — cycle detection, progress stall (Δ = 0 for 2 rounds), user exit.

**Gap queue limit**: Max 4 gaps queued at any time (drop lowest priority if exceeded)

**On termination**:
- Summarize current understanding
- Ask user to rephrase if stuck
- Proceed with best interpretation if user approves

## Rules

1. **Hybrid-initiated, user-confirmed**: Activate on user signal, or with user confirmation when AI detects ambiguous expression
2. **Recognition over Recall**: Present structured options via gate interaction and yield turn — structured content must reach the user with response opportunity. Bypassing the gate (presenting content without yielding turn) = protocol violation
3. **Detection with user authority**: AI presents full taxonomy assessment — every named type with detection status, evidence, and falsification condition; user confirms or revises (no selective presentation, no auto-proceed)
4. **Maieutic over Informational**: Frame questions to guide discovery, not merely gather data
5. **Articulation support**: Help user express what they know, don't guess what they mean
6. **Minimal questioning**: Surface only gaps that affect execution
7. **Consequential options**: Each option shows interpretation with downstream implications
8. **User authority**: User's choice is final; no second-guessing selected interpretation
9. **Convergence persistence**: Mode remains active until convergence (|remaining| = 0, cycle, or user exit)
10. **Reflective pause**: Include "reconsider" option for complex intent clarification
11. **Escape hatch**: Always allow user to provide their own phrasing
12. **Small phases**: Prefer granular phases with user checkpoints over large autonomous phases
13. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via gate interaction. The question contains only the essential question; options contain only option-specific differential implications. Embedding context in question fields = protocol violation
14. **No premature convergence**: Do not declare |remaining| = 0 without presenting convergence evidence trace. "All gaps resolved" as assertion without per-gap evidence = protocol violation
15. **No silent gap dismissal**: If detect(Eᵥ) finds no gaps (Gd = ∅), present this finding with reasoning to the user for confirmation before concluding — do not silently proceed
16. **Full taxonomy assessment**: Phase 1b must present ALL named gap types with detection status and evidence. Presenting only detected types with a generic "Add" option = protocol violation (Recognition over Recall applied to gate content)
17. **Falsification condition**: Each not-currently-detected type must include "would apply if [specific condition]" — exclusion rationale without falsification condition = protocol violation
18. **Emergent probe**: Emergent slot must include an active probe question or AI-detected hypothesis with evidence. "No emergent gaps detected" as bare statement without probe = protocol violation
19. **Option-set relay test**: Before presenting gate options, apply the relay test to the option set: if AI analysis converges to a single dominant option (option-level entropy→0), the interaction is relay — present the finding directly instead of wrapping it in false options. Each gate option must be genuinely viable under different user value weightings
20. **Gate integrity**: Do not inject options not in the definition, delete defined options, or substitute defined options with different ones (gate mutation). Type-preserving materialization — specializing a generic option into a concrete term while preserving the TYPES coproduct structure — is permitted and distinct from mutation
