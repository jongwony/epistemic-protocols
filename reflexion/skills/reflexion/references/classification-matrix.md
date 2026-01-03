# Insight Ontology: Scope × Type

Classification matrix for insight placement decisions.

## Matrix

```
              │ Principle    │ Pattern       │ Decision      │ Style
──────────────┼──────────────┼───────────────┼───────────────┼──────────────
Universal     │ ~/.claude/   │ ~/.claude/    │ .insights/    │ preferences.md
(cross-proj)  │ rules/       │ rules/        │ universal/    │
──────────────┼──────────────┼───────────────┼───────────────┼──────────────
Domain        │ .insights/   │ .insights/    │ .insights/    │ .insights/
(tech stack)  │ domain/      │ domain/       │ domain/       │ domain/
──────────────┼──────────────┼───────────────┼───────────────┼──────────────
Project       │ .claude/     │ .claude/      │ .claude/adr/  │ .claude/
(this repo)   │ CLAUDE.md    │ rules/        │               │ rules/
```

## Type Definitions

| Type | Definition | Example |
|------|------------|---------|
| Principle | Context-free, if-less statement | "Absence over Deprecation" |
| Pattern | Reusable solution template | "OOM → check backpressure" |
| Decision | Choice with rationale | "Chose Temporal over Airflow" |
| Style | Formatting/communication preference | "Korean for PR" |

## Orthogonality Test

| Question | Yes → | No → |
|----------|-------|------|
| Applies to 2+ unrelated projects? | Universal | Domain/Project |
| Requires specific tech stack? | Domain | Universal/Project |
| Only this codebase? | Project | Universal/Domain |

## Placement by Frequency

| Scope | Frequency | Recommendation |
|-------|-----------|----------------|
| Universal | High (>20%) | `~/.claude/rules/` or `CLAUDE.md` |
| Universal | Low (<20%) | `.insights/universal/{type}/` |
| Domain | Any | `.insights/domain/{stack}/` |
| Project | Any | Project's `.claude/insights/` |
