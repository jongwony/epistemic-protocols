# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Code plugin marketplace for epistemic dialogue — transforms **unknown unknowns** into **known unknowns** during AI-human interaction.

## Architecture

```
epistemic-protocols/
├── .claude-plugin/marketplace.json    # Marketplace manifest
├── prothesis/                         # Protocol: perspective placement
│   ├── .claude-plugin/plugin.json
│   └── commands/prothesis.md
├── syneidesis/                        # Protocol: gap surfacing
│   ├── .claude-plugin/plugin.json
│   └── commands/syneidesis.md
├── reflexion/                         # Skill: cross-session learning
│   ├── .claude-plugin/plugin.json
│   └── skills/reflexion/SKILL.md
└── draft/                             # Skill: multi-perspective blog drafting
    ├── .claude-plugin/plugin.json
    └── skills/draft/SKILL.md
```

**Plugin Types**:
- **Protocols** (`commands/*.md`): Dialogue patterns invoked via `/command`
- **Skills** (`skills/*/SKILL.md`): Task workflows invoked via `/skill`

## Plugins

### Prothesis (πρόθεσις)
Present perspective options before analysis begins.
- **Flow**: `U → G(U) → C → {P₁...Pₙ}(C) → S → Pₛ → ∥I(Pₛ) → R → Syn(R) → L`
- **Key**: Phase 0 gathers context, Phase 1 calls `AskUserQuestion` for perspective selection
- **Tools**: `AskUserQuestion` (blocking), `Task` subagents (parallel inquiry)

### Syneidesis (συνείδησις)
Surface potential gaps at decision points as questions.
- **Flow**: `D → Scan(D) → G → Sel(G, D) → Gₛ → Q(Gₛ) → J → A(J, D, Σ) → Σ'`
- **Key**: Phase 0 detects gaps, Phase 1 calls `AskUserQuestion` for surfacing
- **Gap types**: Procedural, Consideration, Assumption, Alternative

### Reflexion
Extract insights from Claude Code sessions into persistent memory.
- **Flow**: Session → Extract → Review → Select → Integrate → Verify → Document
- **Key**: Phase 3.5 checks redundancy against tool descriptions (main agent only)
- **References**: `skills/reflexion/references/` for detailed workflows

### Draft
Transform session insights into structured blog content.
- **Flow**: Prothesis → Format → Draft → Refine → Validate → Finalize
- **Key**: Integrates `/prothesis` for analysis and `/syneidesis` for validation

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
