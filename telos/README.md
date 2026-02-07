# Telos

Co-construct defined end-states from vague goals (τέλος: end, purpose)

> [한국어](./README_ko.md)

## What is Telos?

A modern reinterpretation of Greek τέλος (end, purpose) — a protocol that **helps users build goal definitions that don't yet exist, rather than extracting ones that do**.

### The Core Problem

Users often arrive with vague aspirations (`GoalIndeterminate`) — they know they want *something* but cannot articulate what success looks like, what boundaries apply, or which outcomes matter most. Traditional requirements gathering assumes intent already exists and merely needs extraction. When intent is absent, extraction fails silently.

### The Solution

**Construction over Extraction**: AI proposes falsifiable goal dimensions; user selects, rejects, or reshapes them. Transforms indeterminate aspiration into a concrete, actionable end-state through iterative co-construction.

### Difference from Other Protocols

| Protocol | Mode | Type Signature |
|----------|------|---------------|
| Hermeneia | EXTRACT | `IntentMisarticulated → ClarifiedIntent` |
| **Telos** | **CO-CONSTRUCT** | **`GoalIndeterminate → DefinedEndState`** |

**Key distinction**: Hermeneia assumes the user *has* an intent but struggles to express it — Telos operates when no well-formed intent exists yet. Hermeneia extracts; Telos constructs.

### Difference from Requirements Engineering

| Aspect | Requirements Engineering | Telos |
|--------|--------------------------|-------|
| Assumption | Stakeholder knows what they want | User may not know yet |
| Method | Elicitation (detect needs) | Selection (propose dimensions) |
| Output | Requirements document | GoalContract (falsifiable) |
| Interaction | Interview-driven | Morphism-driven (dimension proposals fire on selection) |

## Protocol Flow

```
Phase 0: Trigger        → Detect goal indeterminacy + confirm co-construction mode
Phase 1: Dimension      → Present gap dimensions (call AskUserQuestion)
Phase 2: Co-construction → Build GoalContract through iterative proposals
Phase 3: Integration    → Synthesize selections into DefinedEndState
Phase 4: Sufficiency    → Verify completeness (call AskUserQuestion)
```

## Gap Types

| Type | Example |
|------|---------|
| Outcome | "What does success look like: [options]?" |
| Metric | "How would you measure progress: [options]?" |
| Boundary | "What's explicitly out of scope: [options]?" |
| Priority | "Which matters more, X or Y?" |

## Protocol Precedence

```
Hermeneia → Telos → Prothesis → Syneidesis → Katalepsis
```

Telos follows Hermeneia: if intent exists but is misarticulated, clarify first. If no intent exists, co-construct. Once a goal is defined, perspective framing (Prothesis) and gap auditing (Syneidesis) can proceed.

## When to Use

**Use**:
- When you have a vague aspiration but no concrete goal
- When you cannot define what success looks like
- When you need help deciding what matters and what doesn't
- When starting a project with undefined scope

**Skip**:
- When your goal is clear but poorly expressed (use Hermeneia)
- When you have a defined goal and need perspective analysis (use Prothesis)

## Usage

```
/telos [your vague goal or aspiration]
/goal [aspiration]
```

## Author

Jongwon Choi (https://github.com/jongwony)
