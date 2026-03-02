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
| User-level | Foundation (all projects) | ~/.claude/CLAUDE.md |
| Project-level | Override (project-specific) | /project/.claude/CLAUDE.md |

## Storage Strategy

| Insight Type | Store In | Reason |
|--------------|----------|--------|
| Universal (applies everywhere) | User-level | Foundation layer |
| Project-specific | Project-level | Override layer |
| Domain/tech-stack | .insights/domain/ | Reference only |

## Detection

```
Session path contains project root?
├── Yes → Project-level mode (can store to project or user)
└── No (~/.claude session) → User-level mode (user only)
```

## Two-Tier Storage

Within the project-level layer, insights are stored in one of two tiers based on access frequency. In user-level mode, only Tier B (.insights/) is available.

| Tier | File | Load Behavior | Content |
|------|------|--------------|---------|
| A | `memory/MEMORY.md` | Auto-loaded every session | Recurring patterns, conventions, architecture decisions |
| B | `.insights/*.md` | On-demand (3-stage progressive loading) | Archival, domain knowledge, reference-on-demand |

**Tier A path derivation** (from session path):
```
~/.claude/projects/{encoded}/sessions/{id}.jsonl
→ ~/.claude/projects/{encoded}/memory/MEMORY.md   (project-level mode only)

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
