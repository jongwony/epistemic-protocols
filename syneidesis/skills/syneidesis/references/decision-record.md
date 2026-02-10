# Syneidesis Decision Record

Summary template generated at protocol convergence (all tasks completed/ESC).

## Template

```markdown
## Gap Audit: [decision context]

**Protocol**: Syneidesis (gap surfacing)
**Stakes**: [Low/Med/High]
**Gaps surfaced**: [total] ([addressed] addressed, [dismissed] dismissed, [deferred] deferred)

| Gap | Type | Question | Resolution |
|-----|------|----------|------------|
| 1 | [Procedural/Consideration/Assumption/Alternative] | [question asked] | [Addressed: response / Dismissed / Deferred] |
| 2 | ... | ... | ... |

### Decision
[Action taken after gap audit]

### Deferred
[Gaps deferred for later review, if any]
```

## Field Rules

| Field | Source | Required |
|-------|--------|----------|
| Stakes | stakes(D) from detection phase | Yes |
| Gap table | TaskCreate/TaskUpdate records | Yes |
| Resolution | J (Addresses/Dismisses/Silence) per gap | Yes |
| Decision | Post-audit action | Yes |
| Deferred | Σ'.deferred | Only if non-empty |

## Generation Trigger

Generate at terminal states only:
- All tasks `completed` → generate after final TaskUpdate
- User ESC → generate with current Σ' (include pending gaps as "unresolved")
- Mid-loop (gaps remaining) → do not generate
