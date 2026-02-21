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

## Two-Tier Storage

Within the Project memory layer, insights are stored in one of two tiers based on access frequency. In User Memory mode, only Tier B (.insights/) is available.

| Tier | File | Load Behavior | Content |
|------|------|--------------|---------|
| A | `memory/MEMORY.md` | Auto-loaded every session | Recurring patterns, conventions, architecture decisions |
| B | `.insights/*.md` | On-demand (3-stage progressive loading) | Archival, domain knowledge, reference-on-demand |

**Tier A path derivation** (from session path):
```
~/.claude/projects/{encoded}/sessions/{id}.jsonl
→ ~/.claude/projects/{encoded}/memory/MEMORY.md   (Project mode only)

~/.claude/sessions/{id}.jsonl
→ Tier A unavailable — ~/.claude/memory/ does not exist
```

**Tier A write constraints**:
- English (Korean blocked by hook)
- No YAML frontmatter
- Keep total MEMORY.md ≤200 lines (only first 200 lines are loaded into context)
- If near limit: consolidate entries or downgrade to Tier B

**Selection heuristic**:
```
Read every session? → Tier A
Referenced occasionally? → Tier B
```
