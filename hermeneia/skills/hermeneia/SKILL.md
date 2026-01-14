---
name: hermeneia
description: >-
  Use when user recognizes their expression may not match their intent,
  asks to "clarify what I mean", "help me articulate", "did I express this right",
  or feels their prompt is ambiguous. Transforms known unknowns into known knowns
  through structured clarification dialogue.
user-invocable: true
---

# Hermeneia Protocol

Transform known unknowns into known knowns by clarifying intent-expression gaps through user-initiated dialogue, enabling precise articulation before action proceeds.

## Definition

**Hermeneia** (ἑρμηνεία): A dialogical act of clarifying the gap between what the user intends and what they expressed, transforming recognized ambiguity into precise articulation through structured questioning.

```
── FLOW ──
(E, T) → D(E, Î₀) → Gset → Sel(Gset) → g? → Q(g?) → A → Integrate(A, E, Î) → Î'
-- T = TriggerSignal (user-initiated clarification request)

── TYPES ──
E      = Expression (user's written prompt)
T      = TriggerSignal (meta-signal about E; user acknowledges potential ambiguity)
I      = Intent: User → Goal (opaque; epistemically inaccessible to AI)
Î      = InferredIntent: E × Ctx → Goal (observable approximation of I; Î₀ = initial)
Gap    = {Expression, Precision, Coherence, Context}  -- gap type enumeration
GapInst = Gap × Subject × Ctx                 -- gap instance (type, subject, context)
D      = Diagnose: E × Î → Set(GapInst)       -- gap identification (compares E against Î)
Gset   = Set(GapInst)                         -- diagnosed gap instances
Sel    = Select: Set(GapInst) → Option(GapInst)  -- priority-based extraction; returns None if empty
Q      = Question: GapInst → IO(Question)     -- forms question (effect: presents via AskUserQuestion)
A      = Answer (user-provided clarification)
Integrate = (A × E × Î) → Î'                  -- merge clarification to update inferred intent
Î'     = Updated inferred intent (Î approaching I through clarification)

── PHASE TRANSITIONS ──
Phase 0: T → recognize user-initiated clarification request
Phase 1: (E, Î) → D(E, Î) → Gset → Sel(Gset) → g?  -- diagnosis (silent); g? : Option(GapInst)
Phase 2: match g? { Some(g) → Q(g) → await → A; None → proceed }  -- call AskUserQuestion if gap exists
Phase 3: A → Integrate(A, E, Î) → Î'           -- integration (updates inferred intent)

── BOUNDARY ──
D (diagnose) = purpose: identify intent-expression gaps
Q (question) = extern: user clarification boundary; extracts Gap type from GapInst for question form
Î' (inferred)= purpose: refined model of intent, approaching user's actual goal

── EPISTEMIC TRANSITION ──
Known unknown (user knows they're unclear) → Known known (user has articulated clearly)

── DYNAMIC DISCOVERY ──
After A (Answer):
  Î' = Integrate(A, E, Î)                -- partial clarification (updates Î toward I)
  G' = D(E, Î')                          -- re-diagnose: expression against updated inferred intent
  G  = G' \ clarified                    -- exclude resolved gaps
  if |G| > 0 ∧ progress(G, Î, Î'):
    Î := Î'                              -- update inferred intent for next iteration
    → Phase 2 (Q → await → A)            -- continue loop

── TERMINATION (Hybrid) ──
progress(G, Î, Î') = ¬cycle(G) ∧ Δ(Î, Î') > 0

cycle(G) = sig(G) ∈ History
sig(G) = hash(type(G), subject(G), context(G))
History = { sig(g) | g ∈ resolved_gaps }

Δ(Î, Î') = |clarified_elements(Î')| - |clarified_elements(Î)|

Terminate when:
  cycle(G)           → "This ambiguity was already clarified"
  Δ = 0 for 2 rounds → "We seem stuck; would you like to rephrase?"

── MODE STATE ──
Λ = { phase: Phase, gaps: Set(GapInst), iterations: ℕ, clarified: Bool, active: Bool }
```

## Core Principle

**Articulation over Assumption**: AI helps user express what they already know but struggle to articulate.

## Distinction from Other Protocols

| Protocol | Initiator | Transition | Focus |
|----------|-----------|------------|-------|
| **Prothesis** | AI | Unknown unknowns → Known unknowns | Perspective options |
| **Syneidesis** | AI | Unknown unknowns → Known unknowns | Decision-point gaps |
| **Hermeneia** | User | Known unknowns → Known knowns | Intent-expression gaps |

**Key difference**: User already recognizes ambiguity exists (known unknown). Hermeneia helps articulate what user already partially knows.

## Mode Activation

### Activation

Command invocation or trigger phrase activates mode until clarification completes.

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

**Protocol precedence** (triple-activation order): Hermeneia → Prothesis → Syneidesis

| Active Protocols | Execution Order | Rationale |
|------------------|-----------------|-----------|
| Hermeneia + Prothesis | Hermeneia → Prothesis | Clarify intent before perspective selection |
| Hermeneia + Syneidesis | Hermeneia → Syneidesis | Clarify intent before gap surfacing |
| All three active | Hermeneia → Prothesis → Syneidesis | Intent → Perspective → Decision gaps |

Clarified expression becomes input to subsequent protocols.

### Triggers

| Signal | Examples |
|--------|----------|
| Direct request | "clarify what I mean", "help me articulate" |
| Self-doubt | "did I express this right?", "is this clear?" |
| Ambiguity acknowledgment | "I'm not sure how to phrase this", "this might be confusing" |
| Meta-communication | "what I'm trying to say is...", "let me rephrase" |

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

### Phase 1: Diagnosis (Silent)

Analyze user's expression for intent-expression gaps:

1. **Parse expression**: Identify stated elements and structure
2. **Detect gaps**: Check taxonomy against expression
3. **Prioritize**: Order gaps by priority (Coherence > Context > Expression > Precision)
4. **Select**: Choose highest-priority gap for clarification

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

Hermeneia transforms **known unknowns → known knowns**. The user already possesses the knowledge; they struggle to articulate it. Apply **maieutic questioning** (Socratic midwifery) to help users "give birth" to their own intent.

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
3. **Maieutic over Informational**: Frame questions to guide discovery, not merely gather data
4. **Articulation support**: Help user express what they know, don't guess what they mean
5. **Minimal questioning**: Surface only gaps that affect execution
6. **Consequential options**: Each option shows interpretation with downstream implications
7. **User authority**: User's choice is final; no second-guessing selected interpretation
8. **Session Persistence**: Mode remains active until clarification completes
9. **Reflective pause**: Include "reconsider" option for complex intent clarification
10. **Escape hatch**: Always allow user to provide their own phrasing
