# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Code plugin marketplace containing two epistemic dialogue protocols that transform "unknown unknowns" into "known unknowns" during AI-human interaction.

## Architecture

```
epistemic-protocols/
├── .claude-plugin/marketplace.json    # Marketplace manifest (registers sub-plugins)
├── prothesis/                         # v1.5.0
│   ├── .claude-plugin/plugin.json     # Plugin manifest
│   └── commands/prothesis.md          # Protocol implementation
└── syneidesis/                        # v1.3.0
    ├── .claude-plugin/plugin.json
    └── commands/syneidesis.md
```

**Pattern**: Each protocol is a self-contained plugin with `commands/*.md` defining behavior via formal notation + natural language rules.

## Protocols

### Prothesis (πρόθεσις)
Present epistemic perspective options before analysis begins.
- **Flow**: `U → G(U) → C → {P₁...Pₙ}(C) → S → Pₛ → ∥I(Pₛ) → R → Syn(R) → L`
- **Key**: Phase 0 gathers context, Phase 1 calls `AskUserQuestion` tool for perspective selection
- **Tools**: `AskUserQuestion` (blocking), `Task` subagents (parallel inquiry)

### Syneidesis (συνείδησις)
Surface potential gaps at decision points as questions.
- **Flow**: `D → Scan(D) → G → Sel(G, D) → Gₛ → Q(Gₛ) → J → A(J, D, Σ) → Σ'`
- **Key**: Phase 0 detects gaps, Phase 1 calls `AskUserQuestion` tool for surfacing
- **Gap types**: Procedural, Consideration, Assumption, Alternative
- **Stakes**: High-stakes + silence → blocks until explicit judgment

## Core Principles

- **Recognition over Recall**: Options to select, not blanks to fill
- **Surfacing over Deciding**: AI illuminates, user judges
- **Session Persistence**: Modes active until session end
- **Priority Override**: Active protocols supersede default behaviors

## Editing Guidelines

- Formal definitions use category theory notation (limit, colimit, ∥ for parallel)
- Keep README.md and README_ko.md in sync
- Bump version in `.claude-plugin/plugin.json` on changes
- `call` (not `invoke` or `use`) for tool-calling instructions—strongest binding with zero polysemy
