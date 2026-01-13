# Hermeneia

Clarify intent-expression gaps through dialogue (ἑρμηνεία: interpretation)

> [한국어](./README_ko.md)

## What is Hermeneia?

A modern reinterpretation of Greek ἑρμηνεία (interpretation) — a protocol that **helps users articulate what they already know but struggle to express**.

### The Core Problem

Users often recognize their expression is ambiguous (known unknowns) but lack the vocabulary or structure to clarify. Open questions like "What do you mean?" don't help when the user already knows they're unclear.

### The Solution

**Articulation over Assumption**: AI presents interpretation options; user recognizes their actual intent among choices. Transforms self-aware ambiguity into precise expression.

### Difference from Other Protocols

| Protocol | Initiator | What it transforms |
|----------|-----------|-------------------|
| Prothesis | AI | Unknown unknowns → Known unknowns |
| Syneidesis | AI | Unknown unknowns → Known unknowns |
| **Hermeneia** | **User** | **Known unknowns → Known knowns** |

## Protocol Flow

```
Phase 0: Trigger       → Recognize user-initiated clarification request
Phase 1: Diagnosis     → Identify intent-expression gaps (silent)
Phase 2: Clarification → Present options (call AskUserQuestion)
Phase 3: Integration   → Proceed with clarified expression
```

## Gap Types

| Type | Example |
|------|---------|
| Expression | "Did you mean X or Y?" |
| Precision | "How specifically: [options]?" |
| Coherence | "You mentioned X but also Y..." |
| Context | "What's the context for this?" |

## When to Use

**Use**:
- When you recognize your expression might be ambiguous
- When you're unsure how to phrase your request
- When you want help articulating your intent

**Skip**:
- When your expression is clear
- When AI should infer from context

## Usage

```
/hermeneia [your potentially ambiguous request]
/clarify [request]
/hmn [request]
```

## Author

Jongwon Choi (https://github.com/jongwony)
