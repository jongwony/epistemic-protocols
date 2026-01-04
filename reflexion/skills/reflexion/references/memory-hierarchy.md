# Memory Hierarchy Reference

## Load Order
```
Enterprise → User → Project → Local
(earlier)                    (later)
```

## Override Rule
Later-loaded overrides earlier when conflicts occur.

```
Priority: Local > Project > User > Enterprise
```

## Implication

| Layer | Role | Example |
|-------|------|---------|
| User Memory | Foundation (all projects) | ~/.claude/CLAUDE.md |
| Project Memory | Override (project-specific) | /project/.claude/CLAUDE.md |

## Storage Strategy

| Insight Type | Store In | Reason |
|--------------|----------|--------|
| Universal (applies everywhere) | User Memory | Foundation layer |
| Project-specific | Project Memory | Override layer |
| Domain/tech-stack | .insights/domain/ | Reference only |

## Detection

```
Session path contains project root?
├── Yes → Project Memory mode (can store to Project or User)
└── No (~/.claude session) → User Memory mode (User only)
```
