# Operational Guide

## Domain Taxonomy

| Domain | Scope | Example Actions |
|--------|-------|-----------------|
| **FileModification** | Creating, editing, deleting files | Write new modules, refactor existing code, delete unused files |
| ↳ *ephemeral* | Temp files, build artifacts, generated code | — (follows FileModification autonomy level) |
| ↳ *durable* | Source code, config, memory, CLAUDE.md, rules | May require different autonomy than ephemeral |
| **Exploration** | Reading files, searching codebase, web research | Grep for patterns, read adjacent files, fetch documentation |
| **Strategy** | Choosing implementation approach | Select architecture pattern, decide refactoring scope, pick library |
| **External** | Actions visible outside local environment | git push, PR creation, Slack messages, issue comments |

### Domain Priority

When calibrating, interview in this order (highest impact first):
1. **External** (highest): Hardest to reverse, visible to others
2. **FileModification**: Changes to codebase, tracked by git
3. **Strategy**: Approach decisions, affect scope of work
4. **Exploration** (lowest): Read-only, inherently safe

Only domains applicable to the current task are calibrated. Skip irrelevant domains.
