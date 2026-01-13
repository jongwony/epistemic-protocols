# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Code plugin marketplace for epistemic dialogue — transforms **unknown unknowns** into **known unknowns** during AI-human interaction.

## Architecture

```
epistemic-protocols/
├── .claude-plugin/marketplace.json    # Marketplace manifest
├── .claude/skills/verify/             # Project-level verification skill
├── prothesis/                         # Protocol: perspective placement
│   ├── .claude-plugin/plugin.json
│   └── skills/prothesis/SKILL.md      # Full protocol definition (user-invocable)
├── syneidesis/                        # Protocol: gap surfacing
│   ├── .claude-plugin/plugin.json
│   └── skills/syneidesis/SKILL.md     # Full protocol definition (user-invocable)
├── reflexion/                         # Skill: cross-session learning
│   ├── .claude-plugin/plugin.json
│   ├── agents/                        # Parallel extraction agents
│   ├── commands/                      # /reflect, /quick-reflect
│   └── skills/reflexion/SKILL.md
└── write/                             # Skill: multi-perspective blog drafting
    └── skills/write/SKILL.md
```

**Component Types**:
- **Skills** (`skills/*/SKILL.md`): Full protocol/workflow definitions with YAML frontmatter; user-invocable by default (v2.1.0+)
- **Commands** (`commands/*.md`): Lightweight invokers (reflexion only—prothesis/syneidesis use skills directly)
- **Agents** (`agents/*.md`): Subagents for parallel task execution (reflexion only)

## Plugins

### Prothesis (πρόθεσις)
Present perspective options before analysis begins. Injected into main agent context.
- **Flow**: `U → G(U) → C → {P₁...Pₙ}(C) → S → Pₛ → I(Pₛ) → R → Syn(R) → L`
- **Key**: Phase 1 calls `AskUserQuestion` for perspective selection (mandatory—text-only = violation)
- **Constraint**: No Task subagents—must run in main agent to call AskUserQuestion

### Syneidesis (συνείδησις)
Surface potential gaps at decision points as questions. Injected into main agent context.
- **Flow**: `D → Scan(D) → G → Sel(G, D) → Gₛ → Q(Gₛ) → J → A(J, D, Σ) → Σ'`
- **Key**: Phase 1 calls `AskUserQuestion` for gap surfacing (mandatory—text-only = violation)
- **Gap types**: Procedural, Consideration, Assumption, Alternative
- **Triggers**: "delete", "push", "deploy", "all", "every", "quickly", production, security

### Reflexion
Extract insights from Claude Code sessions into persistent memory.
- **Flow**: Session → Context → ∥Extract → Select → Integrate → Verify
- **Key**: Phase 2 uses parallel agents (`session-summarizer`, `insight-extractor`, `knowledge-finder`)
- **References**: `skills/reflexion/references/` for detailed workflows

### Write
Transform session insights into blog posts through multi-perspective analysis.
- **Flow**: `Prothesis → Format → Write → Refine → Syneidesis → Finalize`
- **Key**: Integrates both protocols—Prothesis for perspective selection, Syneidesis for gap validation

### Verify (Project-level)
Pre-commit protocol verification via static checks and expert review.
- **Location**: `.claude/skills/verify/`
- **Invocation**: `/verify` before commits

## Core Principles

- **Recognition over Recall**: Options to select, not blanks to fill
- **Surfacing over Deciding**: AI illuminates, user judges
- **Session Persistence**: Modes active until session end
- **Priority Override**: Active protocols supersede default behaviors

## Editing Guidelines

- Formal notation: category theory (limit, colimit, ∥ for parallel)
- Keep README.md and README_ko.md in sync
- Bump version in `.claude-plugin/plugin.json` on changes
- `call` (not `invoke` or `use`) for tool-calling instructions—strongest binding with zero polysemy
- Skills require YAML frontmatter with `name`, `description`
- Prothesis/Syneidesis: No `agent` field or Task delegation—main agent injection required
