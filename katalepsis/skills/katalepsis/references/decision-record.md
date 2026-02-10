# Katalepsis Decision Record

Summary template generated at protocol convergence (all tasks completed/ESC).

## Template

```markdown
## Comprehension Record: [AI work summary]

**Protocol**: Katalepsis (comprehension verification)
**Categories verified**: [completed]/[total selected]

| Category | Status | Gaps Found | Resolution |
|----------|--------|------------|------------|
| [name] | Verified / Partial | [Expectation/Causality/Scope/Sequence or none] | [confirmed / explained further] |
| [name] | ... | ... | ... |

### Verified Understanding
[Summary of what user confirmed understanding of]

### Proposals Captured
[Ejected proposals via TaskCreate, if any — with task references]
```

## Field Rules

| Field | Source | Required |
|-------|--------|----------|
| Categories verified | completed / total from TaskUpdate | Yes |
| Category table | Λ.tasks map | Yes |
| Gaps found | Δ per category | Only if gaps detected |
| Verified understanding | P' at convergence | Yes |
| Proposals captured | `[Katalepsis:Proposal]` tasks | Only if ejected |

## Generation Trigger

Generate at terminal states only:
- All selected tasks `completed` → generate with final P'
- User demonstrates full comprehension (early termination) → generate
- User ESC → generate with current state (note incomplete categories)
- Mid-loop (categories remaining) → do not generate
