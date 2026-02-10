# Prothesis Decision Record

Summary template generated at protocol convergence (Phase 4: sufficient/ESC).

## Template

```markdown
## Lens Analysis: [inquiry topic]

**Protocol**: Prothesis (perspective placement)
**Perspectives analyzed**: [n]

| Perspective | Epistemic Contribution | Assessment |
|-------------|----------------------|------------|
| [name] | [1-line unique insight] | [stance] |
| [name] | [1-line unique insight] | [stance] |

### Convergence
[Where perspectives agreed — robust finding]

### Divergence
[Where perspectives disagreed — values, evidence standards, or scope]

### Decision
[Synthesized assessment with attribution]
```

## Field Rules

| Field | Source | Required |
|-------|--------|----------|
| Perspectives analyzed | `\|Pₛ\|` | Yes |
| Perspective table | Phase 2 teammate outputs | Yes |
| Convergence | Syn(R).∩ | Yes |
| Divergence | Syn(R).D | Only if divergence exists |
| Decision | Syn(R).A | Yes |

## Generation Trigger

Generate at terminal states only:
- `J = sufficient` → generate before TeamDelete
- `J = ESC` → generate with current L before TeamDelete
- Loop iterations (add_perspective, refine) → do not generate
