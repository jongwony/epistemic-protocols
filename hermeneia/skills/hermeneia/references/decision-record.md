# Hermeneia Decision Record

Summary template generated at protocol convergence (|G| = 0, cycle, stall, or ESC).

## Template

```markdown
## Intent Clarification: [original expression summary]

**Protocol**: Hermeneia (intent clarification)
**Rounds**: [n]

| Element | Original | Clarified |
|---------|----------|-----------|
| [aspect] | [original expression] | [resolved interpretation] |
| [aspect] | [ambiguous element] | [resolved interpretation] |

### Gap Types Addressed
[Expression / Precision / Coherence / Context — which were selected and resolved]

### Clarified Intent
[Final Î' — the expression to proceed with]
```

## Field Rules

| Field | Source | Required |
|-------|--------|----------|
| Rounds | `\|history\|` | Yes |
| Clarification table | history: List<(E, Gₛ, A)> | Yes |
| Gap types addressed | Λ.clarified | Yes |
| Clarified intent | Î' at convergence | Yes |

## Generation Trigger

Generate at terminal states only:
- `\|G\| = 0` → generate with final Î'
- `cycle(G)` → generate, note cycle detection
- `stall(Δ, 2)` → generate, note stall with user consent
- User ESC → generate with current Î'
- Mid-loop (gaps remaining) → do not generate
