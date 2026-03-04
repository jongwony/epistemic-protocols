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

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | 1-2 domains, familiar task type | Single question covering key domain |
| Medium | 3+ domains, moderate ambiguity | Sequential domain interviews (1 question each) |
| Heavy | New project, history of friction, 4 domains | Full interview with refinement questions |

## UX Safeguards

| Rule | Structure | Threshold |
|------|-----------|-----------|
| Session immunity | Approved DC → skip recalibration for session | `¬recalibrate(DC, T')`: recalibrate only on `new_domain_activated ∨ stakes_escalated(→High)` |
| Domain cap | `\|domains\| ≤ 4` | Confirmed (taxonomy is exhaustive) |
| Question cap | `\|questions\| ≤ 12` (Solo: 9, Team: 12) | Wildcard triggers on response variance within same domain |
| Cross-protocol fatigue | `prior_protocol_count(session) ≥ 2` → reduce intensity one level | Confirmed |
| Prothesis mode-switch | `ctx.team ≠ ∅ ∧ ctx.lens ≠ ∅` → skip domains with unanimous Lens convergence | Confirmed |
| WHO cap | `\|roles\| ≤ 6` for any team structure | Confirmed |
| Full restructure guard | `TeamRestructure + \|retain\| = 0` → terminate (no team to calibrate) | Confirmed |
| No-change guard | `TeamRestructure + \|retain\| = \|team\| ∧ \|new\| = 0` → redirect to TeamAugment | Confirmed |
| Blanket escape | "Just do it" → immediate ESC, default autonomy | Confirmed |
