---
name: clarify
description: Clarify intent-expression gaps. Extracts clarified intent when what you mean differs from what you said.
user-invocable: true
---

# Hermeneia Protocol

Resolve intent-expression misalignment through user-initiated dialogue, enabling precise articulation before action proceeds. Type: `(IntentMisarticulated, User, EXTRACT, Expression) → ClarifiedIntent`.

## Definition

**Hermeneia** (ἑρμηνεία): A dialogical act of clarifying the gap between what the user intends and what they expressed, resolving misaligned intent into precise articulation through structured questioning.

```
── FLOW ──
E → Eᵥ → Gₛ → Q → A → Î' → (loop until converge)

── TYPES ──
E  = User's expression (the prompt to clarify)
Eᵥ = Verified expression (user-confirmed binding)
Gₛ = User-selected gap type ∈ {Expression, Precision, Coherence, Context}
Q  = Clarification question (via AskUserQuestion)
A  = User's answer
Î  = Inferred intent (AI's model of user's goal)
Î' = Updated intent after clarification
ClarifiedIntent = Î' where |G| = 0 ∨ cycle(G) ∨ stall(Δ, 2) ∨ user_esc

── E-BINDING ──
bind(E) = explicit_arg ∪ colocated_expr ∪ prev_user_turn
Priority: explicit_arg > colocated_expr > prev_user_turn

/clarify "text"                → E = "text"
"request... clarify"           → E = text before trigger
/clarify (alone)               → E = previous user message

Edge cases:
- Interrupt: E = original request of interrupted task
- Queued:    E = previous message at queue time (fixed)
- Re-invoke: Show prior clarification, confirm or restart

── PHASE TRANSITIONS ──
Phase 0:  E → recognize(E) → trigger?                    -- trigger recognition
Phase 1a: E → Q[AskUserQuestion](E) → Eᵥ                 -- E confirmation [Tool]
Phase 1b: Eᵥ → Q[AskUserQuestion](gap_types) → Gₛ        -- gap type selection [Tool]
Phase 2:  Gₛ → Q[AskUserQuestion](Gₛ) → await → A        -- clarification [Tool]
Phase 3:  A → integrate(A, Î) → Î'                       -- intent update (internal)

── LOOP ──
After Phase 3: return to Phase 1b for newly surfaced gaps.
Continue until converge: |G| = 0, cycle detected, or user exits.
Mode remains active until convergence.

── TOOL GROUNDING ──
Phase 1a Q  → AskUserQuestion (E confirmation)
Phase 1b Q  → AskUserQuestion (gap type selection)
Phase 2 Q   → AskUserQuestion (clarification options)
integrate   → Internal state update (no external tool)

── MODE STATE ──
Λ = { phase: Phase, E: Expression, Eᵥ: Expression, gaps: Set(Gap),
      clarified: Set(Gap), history: List<(E, Gₛ, A)>, active: Bool }
```

## Core Principle

**Articulation over Assumption**: AI helps user express what they already know but struggle to articulate.

## Distinction from Other Protocols

| Protocol | Initiator | Deficit → Resolution | Focus |
|----------|-----------|----------------------|-------|
| **Prothesis** | AI-detected | FrameworkAbsent → FramedInquiry | Perspective options |
| **Syneidesis** | AI-detected | GapUnnoticed → AuditedDecision | Decision-point gaps |
| **Hermeneia** | User-initiated | IntentMisarticulated → ClarifiedIntent | Intent-expression gaps |
| **Telos** | AI-detected | GoalIndeterminate → DefinedEndState | Goal co-construction |

**Key difference**: User already recognizes intent-expression misalignment. Hermeneia helps articulate what user already partially knows.

## Mode Activation

### Activation

Command invocation or trigger phrase activates mode until clarification completes.

**Clarification complete** = one of: `|G| = 0` (no gaps remain), `cycle(G)` (already clarified), or `Δ = 0` for 2 rounds (progress stall with user consent to proceed).

### Priority

<system-reminder>
When Hermeneia is active:

**Supersedes**: Direct action patterns in User Memory
(Clarification must complete before any tool execution or code changes)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 2, call AskUserQuestion tool to present clarification options.
</system-reminder>

- Hermeneia completes before other workflows begin
- User Memory rules resume after intent is clarified

**Protocol precedence**: Default ordering is Hermeneia → Telos → Prothesis → Syneidesis (intent clarification logically precedes goal construction and analysis). The user can override this default by explicitly requesting a different protocol first. Katalepsis is structurally last — it requires completed AI work (`R`), so it is not subject to ordering choices.

Clarified expression becomes input to subsequent protocols.

### Triggers

| Signal | Examples |
|--------|----------|
| Direct request | "clarify what I mean", "help me articulate" |
| Self-doubt | "did I express this right?", "is this clear?" |
| Ambiguity acknowledgment | "I'm not sure how to phrase this", "this might be confusing" |
| Meta-communication | "what I'm trying to say is...", "let me rephrase" |

**Qualifying condition**: Activate only when user's entire message is a clarification request, or when 2+ trigger signals co-occur in the same message. Do not activate on casual meta-communication embedded in a larger request.

**Skip**:
- User's expression is unambiguous
- User explicitly declines clarification
- Expression already clarified in current session

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
| **Context** | Missing background for interpretation | "What's the context for this? [options]" |

### Gap Priority

When multiple gaps detected:
1. **Coherence** (highest): Contradictions block all interpretation
2. **Context**: Missing background affects all other gaps
3. **Expression**: Core articulation gaps
4. **Precision** (lowest): Refinement after core is clear

## Protocol

### Phase 0: Trigger Recognition

Recognize user-initiated clarification request:

1. **Explicit request**: User directly asks for clarification help
2. **Implicit signal**: User expresses doubt about their own expression
3. **Meta-communication**: User attempts to rephrase or explain their intent

**Do not activate** for AI-perceived ambiguity alone. User must signal awareness of potential gap.

### Phase 1a: Expression Confirmation

**Call the AskUserQuestion tool** to confirm which expression to clarify.

Present the bound expression E and ask user to confirm or specify:

```
Which expression would you like to clarify?

Options:
1. "[bound E]" — the expression I identified
2. "Specify different" — let me describe what I want to clarify
```

**Skip condition**: If E was explicitly provided via argument (`/clarify "text"`), proceed directly to Phase 1b.

### Phase 1b: Gap Type Selection

**Call the AskUserQuestion tool** to let user select the gap type.

**Do NOT auto-diagnose.** Present gap types for user selection:

```
What kind of difficulty are you experiencing with this expression?

Options:
1. **Expression** — I couldn't fully articulate what I meant
2. **Precision** — The scope or degree is unclear
3. **Coherence** — There may be internal contradictions
4. **Context** — Background information is missing
```

User selection determines the clarification strategy in Phase 2.

### Phase 2: Clarification

**Call the AskUserQuestion tool** to present clarification options.

**Do NOT present clarification as plain text.** The tool call is mandatory—text-only presentation is a protocol violation.

```
I notice potential ambiguity in your request:

[Gap description]

Options:
1. **[Option A]**: [interpretation with implications]
2. **[Option B]**: [interpretation with implications]
3. **[Option C]**: [interpretation with implications]

Which best captures your intent?
```

**Question design principles**:
- **Recognition over Recall**: Present options, don't ask open questions
- **Concrete implications**: Show what each choice means for execution
- **Escape hatch**: Include "something else" option when appropriate
- **Minimal options**: 2-4 choices maximum per gap

### Socratic Questioning Style

Hermeneia resolves **IntentMisarticulated → ClarifiedIntent**. The user already possesses the knowledge; they struggle to articulate it. Apply **maieutic questioning** (Socratic midwifery) to help users "give birth" to their own intent.

**Maieutic framing for AskUserQuestion**:

Instead of:
```
Options:
1. Option A: [interpretation]
2. Option B: [interpretation]
```

Use consequential framing:
```
Options:
1. Option A: [interpretation] — if this, then [implication for your goal]
2. Option B: [interpretation] — if this, then [implication for your goal]
3. "Let me reconsider" — take time to reflect on underlying intent
```

**Socratic elements**:

| Element | Implementation |
|---------|----------------|
| **Consequential thinking** | Each option shows downstream effects |
| **Goal alignment** | Ask "which serves your underlying objective?" |
| **Reflective pause** | Include "Let me think differently" option |
| **Assumption surfacing** | "This assumes X—does that match your situation?" |

**Example transformation**:

Before (standard):
```
Did you mean:
1. Delete all files
2. Delete only selected files
```

After (Socratic):
```
To clarify your intent:
1. "All files" — this would clear the workspace entirely; is starting fresh your goal?
2. "Selected files" — this preserves structure; is targeted cleanup your goal?
3. "Let me reconsider" — reflect on what outcome you're actually seeking
```

**Principle**: Questions guide discovery, not merely gather information

### Phase 3: Integration

After user response:

1. **Incorporate**: Update understanding with user's clarification
2. **Re-diagnose**: Scan clarified expression for newly surfaced gaps
3. **Filter**: Exclude gaps already resolved in this session
4. **Progress check**: Continue only if `progress(Î, Î') = true` (no cycle, Δ > 0)
5. **Confirm**: When no gaps remain, present clarified intent for verification
6. **Proceed**: Continue with clarified expression

**Discovery triggers**:
- Clarification reveals new ambiguity ("I mean the API" → "which endpoint?")
- Answer creates new tension ("fast" + "thorough" → coherence gap)
- Context shift ("for production" → new precision requirements)

```markdown
## Clarified Intent

Based on your clarification:
- [Original expression element] → [Clarified meaning]
- [Ambiguous element] → [Resolved interpretation]

Proceeding with this understanding.
```

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

**Termination conditions** (Hybrid strategy):
- **Cycle detection**: Same gap signature already in History → terminate
- **Progress stall**: Δ = 0 for 2 consecutive rounds → offer rephrase
- **User exit**: Esc/interrupt always available (Claude Code native)

**Gap queue limit**: Max 4 gaps queued at any time (drop lowest priority if exceeded)

**On termination**:
- Summarize current understanding
- Ask user to rephrase if stuck
- Proceed with best interpretation if user approves

## Rules

1. **User-initiated only**: Activate only when user signals awareness of ambiguity
2. **Recognition over Recall**: Always **call** AskUserQuestion tool to present options (text presentation = protocol violation)
3. **Selection over Detection**: Present options for user to select, not auto-diagnose internally
4. **Maieutic over Informational**: Frame questions to guide discovery, not merely gather data
5. **Articulation support**: Help user express what they know, don't guess what they mean
6. **Minimal questioning**: Surface only gaps that affect execution
7. **Consequential options**: Each option shows interpretation with downstream implications
8. **User authority**: User's choice is final; no second-guessing selected interpretation
9. **Convergence persistence**: Mode remains active until convergence (|G| = 0, cycle, or user exit)
10. **Reflective pause**: Include "reconsider" option for complex intent clarification
11. **Escape hatch**: Always allow user to provide their own phrasing
12. **Small phases**: Prefer granular phases with user checkpoints over large autonomous phases
