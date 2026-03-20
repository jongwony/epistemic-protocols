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
Gₛ = User-confirmed gap types (Gd after confirm/add/remove)
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
Phase 3:  A → integrate(A, Î) → Î'                       -- intent update (internal)

── LOOP ──
After Phase 3: return to Phase 1b for newly surfaced gaps.
On re-entry, detect(Eᵥ) re-analyzes the expression in the context of prior clarifications; gaps in Λ.clarified are filtered from Gd by type before confirmation (type-level filtering ensures convergence; new instances of a clarified type are excluded).
If |Gₛ| = 0 after confirmation (all gaps removed): skip Phase 2, evaluate convergence (|remaining| = 0).
Continue until converge: |remaining| = 0, cycle detected, or user exits.
Mode remains active until convergence.
Convergence evidence: At |remaining| = 0, present transformation trace — for each g ∈ Λ.clarified, show (IntentMisarticulated(g) → resolution(g)) from Λ.history. Convergence is demonstrated, not asserted.

── TOOL GROUNDING ──
-- Realization: present → TextPresent+Stop | AskUserQuestion (preferences)
Phase 0 Qc   (extern) → present (AI-detected activation confirmation; ai_strong only)
Phase 1a Qc  (extern) → present (E confirmation)
Phase 1b detect (detect) → Internal analysis (gap detection from Eᵥ)
Phase 1b Qc  (extern) → present (detection confirmation: confirm/add/remove)
Phase 2 Qs   (extern) → present (clarification options; Esc key → loop termination at LOOP level, not an Answer)
suggest_only → no tool call (passive suggestion; Λ.active = false)
integrate    → Internal state update (no external tool)

── ELIDABLE CHECKPOINTS ──
-- Axis: Qc/Qs = answer space; always_gated/elidable = regret profile
Phase 0 Qc (confirm)       → conditional: ai_strong only (user_signal path skips Phase 0)
                              regret: bounded (Phase 1a Qc always gated; immune(E) on decline)
Phase 1a Qc (E confirm)    → elidable when: explicit_arg(E) via /clarify "text"
                              default: proceed with bound E
                              regret: bounded (Phase 1b Qc provides correction opportunity)
Phase 1b Qc (gap confirm)  → always_gated (Qc: gap set shapes clarification path)
Phase 2 Qs (clarify)       → always_gated (Qs: user incorporates intent into clarification)

── MODE STATE ──
Λ = { phase: Phase, trigger: T, E: Expression, Eᵥ: Expression, detected: Set(Gap), gaps: Set(Gap),
      clarified: Set(Gap), remaining: Set(Gap),
      immune: Set(Expression), history: List<(E, Gₛ, A)>, active: Bool }
-- Invariant: gaps = clarified ∪ remaining (pairwise disjoint)
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
| **Prosoche** | User-initiated | ExecutionBlind → SituatedExecution | Execution-time risk evaluation |
| **Epharmoge** | AI-guided | ApplicationDecontextualized → ContextualizedExecution | Post-execution applicability |
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

**Action**: At Phase 2, present clarification options via gate interaction (Qc/Qs) and yield turn.
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
- **Aitesis territory**: Missing background changes how to execute X (execution plan) → suggest `/inquire` and offer to transition

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

Analyze Eᵥ to detect applicable gap types, then **present** for user confirmation.

Per Gap Taxonomy above. Apply priority order: Coherence → Background → Expression → Precision. Emergent gaps must satisfy morphism `IntentMisarticulated → ClarifiedIntent`; boundary: intent-expression gap (in-scope) vs. goal definition (→ `/goal`) or execution context (→ `/inquire`).

Present detection results with evidence as text output:
- Detected gap types in your expression:
  - **[Type]**: [specific evidence from Eᵥ]
  - **[Type]**: [specific evidence from Eᵥ]

Then **present** to confirm:

```
How would you like to proceed with these detected gaps?

Options:
1. **Proceed with these** — start clarification with detected gaps
2. **Add gap type** — I also notice [type] issues
3. **Remove gap type** — [type] doesn't apply here
```

- "Add" and "Remove" options include brief rationale showing why the type was/wasn't detected
- Emergent gaps include boundary annotation: "This is an intent-expression gap (Hermeneia scope). Not: goal definition (→ `/goal`) or execution context (→ `/inquire`)"

**Add/Remove sub-steps**: On "Add" or "Remove" selection, present via gate interaction to specify which type to add/remove with rationale. After modification, re-present the updated detection result for final confirmation. Phase 1b completes when user selects "Proceed with these."

**Soft guard**: If user removes all detected gaps, confirm: "Removing all gaps terminates clarification. Continue?" If confirmed, `|Gₛ| = 0` → skip Phase 2, evaluate convergence (`|remaining| = 0` in LOOP).

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

**Question design principles**:
- **Recognition over Recall**: Present options, don't ask open questions
- **Concrete implications**: Show what each choice means for execution
- **Escape hatch**: Include "something else" option when appropriate
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

### Post-Convergence Suggestions

After convergence, scan session context for continuing epistemic needs and present suggestions as natural-language text (no gate interaction). Display only when at least one suggestion is actionable.

**Transformation check**: Before suggesting next protocols, briefly assess whether the clarification changed the downstream action. State in one sentence what shifted (e.g., "The clarified scope narrows implementation to the auth module only") or note that the original expression was confirmed as adequate. This is informational text — not a gate interaction.

**Protocol suggestions**: Based on session context, suggest protocols whose deficit conditions are observable:

- Clarified intent reveals indeterminate goals → suggest `/goal` (goal co-construction)
- Boundary undefined for clarified decisions → suggest `/bound` (epistemic boundary definition)
- Clarified scope requires context verification → suggest `/inquire` (context insufficiency check)

**Next steps**: Based on the converged output, suggest concrete follow-up actions:

- Restate clarified intent as a reference for downstream work
- Note any residual ambiguity that was accepted rather than resolved

**Display rule**: Omit this section entirely when (a) user explicitly moved to next task, (b) no observable deficit conditions exist in session context, or (c) the user has already invoked another protocol in the current or immediately preceding message. Suggestions are informational text, not gate interactions.

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | Minor ambiguity, low stakes | "Quick check: [A] or [B]?" |
| Medium | Significant ambiguity, moderate stakes | "[Gap]. Options: [A], [B], [C]?" |
| Heavy | Core intent unclear, high stakes | "Before proceeding: [detailed options with implications]" |

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
2. **Recognition over Recall**: Present structured options via gate interaction (Qc/Qs) and yield turn — structured content must reach the user with response opportunity. Bypassing the gate (presenting content without yielding turn) = protocol violation
3. **Detection with user authority**: AI detects gap types with evidence; user confirms, adds, or removes (no blind multiSelect, no auto-proceed)
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
