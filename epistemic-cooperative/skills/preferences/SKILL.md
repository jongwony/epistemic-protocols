---
name: preferences
description: "Initialize epistemic protocol preferences with defaults. Modify via /memory."
---

# Preferences Skill

Initialize epistemic protocol preferences with defaults. Supports user scope (all projects) and project scope (current project only). Individual parameter modifications via `/memory` built-in command or natural language requests.

## When to Use

Invoke when:
- Setting up initial preferences for a new project
- Resetting all preferences to defaults

Skip when:
- Want to modify individual preferences (use `/memory` or natural language)
- Want to learn about protocols first (use `/onboard`)

## Workflow Overview

```
DETECT → INITIALIZE → WRITE
```

| Phase | Owner | Tool | Purpose |
|-------|-------|------|---------|
| 0. Detect | Main | Read | Check existing preferences rules file |
| 1. Initialize | Main | Gate | Scope selection + present defaults + confirm |
| 2. Write | Main | Write | Create/reset rules file |

## Parameter Catalog

### Global Parameters

Parameters applied across protocols. Ordered by impact.

| # | Parameter | Default | Options | Scope |
|---|-----------|---------|---------|-------|
| 1 | Interaction Modality | TextPresent+Stop | TextPresent+Stop / AskUserQuestion | 10/10 |
| 2 | Intensity | auto | light / medium / heavy / auto | 9/10 (Prothesis excluded) |
| 3 | Post-Convergence Suggestions | on | on / off | 10/10 |

**Parameter descriptions**:

1. **Interaction Modality**: Controls how gate interactions (Qc/Qs) are realized. `TextPresent+Stop` = structured numbered text output + Stop (turn yield), user responds freely. `AskUserQuestion` = AskUserQuestion tool call with structured options.
2. **Intensity**: Controls protocol thoroughness. `light` = fewer questions, faster convergence. `heavy` = deeper analysis, more questions. `auto` = protocol decides per context.
3. **Post-Convergence Suggestions**: Whether protocols suggest related protocols after completing. `off` suppresses the suggestion section.

## Phase Execution

### Phase 0: Detect

1. Check for existing preferences rules file in both scopes:
   - User scope: `~/.claude/rules/preferences-epistemic.md`
   - Project scope: `{project}/.claude/rules/preferences-epistemic.md`
2. If found in either scope: read current values → Phase 1 (reset flow)
3. If absent from both: Phase 1 (init flow)

### Phase 1: Initialize

Present the Global Parameters default catalog as text output.

**Scope selection** (first-time init only):
- "User scope — applies to all projects" (`~/.claude/rules/preferences-epistemic.md`)
- "Project scope — this project only" (`{project}/.claude/rules/preferences-epistemic.md`)

**If absent**: Ask scope + whether to initialize with defaults.
**If exists**: Show current values alongside defaults + ask whether to reset to defaults (scope inherited from existing file).

Present via gate interaction:
- "Yes — initialize with defaults"
- "No — cancel"

If "No" → terminate.

### Phase 2: Write

Write preferences file to the selected `.claude/rules/` location.

**Rules file format**:

```markdown
# Epistemic Protocol Preferences

## Global
- Interaction Modality: TextPresent+Stop
- Intensity: auto
- Post-Convergence Suggestions: on
```

Present completion message with file path and `/memory` for individual parameter modifications.

**Per-Protocol section**: Only added when user modifies individual parameters via `/memory`. Not included in default initialization.

## Rules

1. **One-shot initialization**: `/preferences` presents defaults and asks for confirmation. No multi-turn parameter traversal.
2. **Modification via /memory**: Individual parameter changes are done through `/memory` built-in command or natural language requests to Claude.
3. **Scope selection**: User chooses between user scope (`~/.claude/rules/`) and project scope (`{project}/.claude/rules/`). User scope applies across all projects; project scope is git-tracked and project-specific.
4. **Recognition over Recall**: Global parameter catalog with all options is presented for reference during initialization.
5. **No protocol execution**: This skill configures preferences only. It does not call or simulate any protocol.
6. **Reversibility**: Delete the rules file to restore defaults. File path shown after write.
7. **Parameter order**: Interaction Modality is #1 — it determines how all subsequent gate interactions are realized.
8. **Auto-loading guarantee**: `.claude/rules/` files are automatically loaded into conversation context, ensuring all protocols can access preferences without explicit file reads.
9. **Grounded parameters only**: Only parameters with corresponding SKILL.md sections/annotations are included. New parameters require SKILL.md grounding before addition.
