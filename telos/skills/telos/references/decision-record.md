# Telos Decision Record

Summary template generated at protocol convergence (GoalContract approved/ESC).

## Template

```markdown
## GoalContract: [goal summary]

**Protocol**: Telos (goal co-construction)
**Dimensions defined**: [completed]/[selected]

| Dimension | Status | Definition |
|-----------|--------|------------|
| Outcome | [Defined/Undefined/N/A] | [value] |
| Metric | [Defined/Undefined/N/A] | [value] |
| Boundary | [Defined/Undefined/N/A] | [value] |
| Priority | [Defined/Undefined/N/A] | [value] |

### Construction History
| Round | Dimension | Proposal | Response |
|-------|-----------|----------|----------|
| 1 | [dim] | [proposal] | [Accept/Modify/Reject] |
| ... | ... | ... | ... |

### Approved Goal
[Final GoalContract C' as approved by user]
```

## Field Rules

| Field | Source | Required |
|-------|--------|----------|
| Dimensions defined | progress(C', Dₐ) | Yes |
| Dimension table | GoalContract C' fields | Yes |
| Construction history | Λ.history: List<(Dₛ, P, A)> | Only if rounds > 1 |
| Approved goal | C' at approval | Yes |

## Generation Trigger

Generate at terminal states only:
- User approves GoalContract (Phase 4) → generate with final C'
- User declares sufficient (early exit) → generate, note early exit
- User ESC → generate with current C' (note unapproved)
- Mid-loop (dimensions remaining) → do not generate
