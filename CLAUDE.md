# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Code plugin marketplace for epistemic dialogue — transforms **unknown unknowns** into **known unknowns** (Prothesis, Syneidesis), **known unknowns** into **known knowns** (Hermeneia), and **unknown knowns** into **known knowns** (Katalepsis) during AI-human interaction.

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
├── hermeneia/                         # Protocol: intent clarification
│   ├── .claude-plugin/plugin.json
│   └── skills/hermeneia/SKILL.md      # Full protocol definition (user-invocable)
├── katalepsis/                        # Protocol: comprehension verification
│   ├── .claude-plugin/plugin.json
│   └── skills/katalepsis/SKILL.md     # Full protocol definition (user-invocable)
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

**Conventions**:
- Subagent naming: `plugin-name:agent-name` (e.g., `reflexion:session-summarizer`)
- References directory: `skills/*/references/` for detailed documentation
- No external dependencies; Node.js standard library only

## Plugins

### Prothesis (πρόθεσις) — alias: `lens`
Present perspective options before analysis begins. Injected into main agent context.
- **Flow**: `U → C → P → Pₛ → ∥I(Pₛ) → R → L → (sufficiency check → loop)`
- **Key**: Phase 1 calls `AskUserQuestion` for perspective selection; Phase 4 calls `AskUserQuestion` for sufficiency check; loop until user satisfied or ESC
- **Phase 2**: Parallel inquiry via Task subagents (mandatory—main agent direct analysis = violation); subagent isolation prevents cross-perspective contamination and confirmation bias
- **Invocation**: `/prothesis` or use "lens" in conversation

### Syneidesis (συνείδησις) — alias: `gap`
Surface potential gaps at decision points as questions. Injected into main agent context.
- **Flow**: `D → G → TaskCreate[all] → Q → J → Σ' → (re-scan → loop)`
- **Key**: Phase 0 detects ALL gaps → TaskCreate batch registration; Phase 1 surfaces sequentially via `AskUserQuestion`; re-scan after each response; loop until all tasks completed or ESC
- **Gap types**: Procedural, Consideration, Assumption, Alternative
- **Triggers**: "delete", "push", "deploy", "all", "every", "quickly", production, security
- **Invocation**: `/syneidesis` or use "gap" in conversation

### Hermeneia (ἑρμηνεία) — alias: `clarify`
Clarify intent-expression gaps through user-initiated dialogue.
- **Flow**: `E → Eᵥ → Gₛ → Q → A → Î' → (loop)`
- **Key**: User-initiated only; Phase 1a confirms E, Phase 1b asks user to select gap type (no auto-diagnosis), Phase 2 calls `AskUserQuestion` for clarification; loop until convergence
- **Gap types**: Expression, Precision, Coherence, Context
- **Triggers**: "clarify", "what I mean", "did I express this right"
- **Invocation**: `/hermeneia` or use "clarify" in conversation

### Katalepsis (κατάληψις) — alias: `grasp`
Achieve certain comprehension of AI work through structured verification.
- **Flow**: `R → C → Sₑ → Tᵣ → P → Δ → Q → A → Tᵤ → P' → (loop until katalepsis)`
- **Key**: User-initiated; Phase 0 categorizes AI work; Phase 1 calls `AskUserQuestion` for entry point selection; Phase 2 uses `TaskCreate` for tracking; Phase 3 calls `AskUserQuestion` for comprehension verification with `TaskUpdate`
- **Gap types**: Expectation, Causality, Scope, Sequence
- **Triggers**: "explain this", "what did you do?", "help me understand"
- **Invocation**: `/katalepsis` or use "grasp" in conversation

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
- **Selection over Detection**: User selects gap types, AI does not auto-diagnose
- **Surfacing over Deciding**: AI illuminates, user judges
- **Convergence Persistence**: Modes active until convergence (Hermeneia loops until |G| = 0)
- **Priority Override**: Active protocols supersede default behaviors

## Protocol Precedence

Multi-activation order: **Hermeneia → Prothesis → Syneidesis → Katalepsis**

### Epistemic Workflow Timeline

```
[Request] → [Intent] → [Perspective] → [Decision] → [Execution] → [Comprehension]
               ↑            ↑              ↑                            ↑
           Hermeneia    Prothesis      Syneidesis                   Katalepsis
```

| Protocol | Timing | Epistemic Transition |
|----------|--------|---------------------|
| **Hermeneia** | Pre-action | Known unknowns → Known knowns |
| **Prothesis** | Pre-action | Unknown unknowns → Known unknowns |
| **Syneidesis** | Mid-action (decision points) | Unknown unknowns → Known unknowns |
| **Katalepsis** | Post-action | Unknown knowns → Known knowns |

**Rationale**: Katalepsis operates on completed AI work (`R = AI's result`). Without a result, there is nothing to comprehend. Syneidesis surfaces gaps at decision points *before* execution, so it precedes Katalepsis in the workflow

## Verification

Run `/verify` before commits. Static checks via:
```bash
node .claude/skills/verify/scripts/static-checks.js .
```

**Static checks performed**:
1. **json-schema**: plugin.json required fields (name, version, description, author), semver format
2. **notation**: Unicode consistency (→, ∥, ∩, ∪, ⊆, ∈, ≠ over ASCII fallbacks)
3. **directive-verb**: `call` (not `invoke`/`use`) for tool instructions
4. **xref**: CLAUDE.md flow formulas sync with source files
5. **structure**: Required sections in protocol SKILL.md (Definition, Mode Activation, Protocol, Rules, PHASE TRANSITIONS, MODE STATE)
6. **tool-grounding**: TOOL GROUNDING section present, external operations have `[Tool]` notation in PHASE TRANSITIONS

## Editing Guidelines

- **Notation**: `→` (function), `∥` (parallel), `[Tool]` suffix for external operations in PHASE TRANSITIONS
- Keep README.md and README_ko.md in sync
- Bump version in `.claude-plugin/plugin.json` on changes
- `call` (not `invoke` or `use`) for tool-calling instructions—strongest binding with zero polysemy
- Skills frontmatter: `name` (required), `description` (required), `user-invocable` (boolean), `allowed-tools` (optional)
- **Delegation rules**:
  - Prothesis Phase 2: MUST use Task subagents—isolated context required for unbiased perspective analysis
  - Syneidesis/Hermeneia/Katalepsis: No Task delegation—must run in main agent to call AskUserQuestion
