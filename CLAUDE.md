# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Code plugin marketplace for epistemic dialogue — each protocol resolves a specific cognitive deficit: **FrameworkAbsent → FramedInquiry** (Prothesis), **GapUnnoticed → AuditedDecision** (Syneidesis), **IntentMisarticulated → ClarifiedIntent** (Hermeneia), **ResultUngrasped → VerifiedUnderstanding** (Katalepsis), **GoalIndeterminate → DefinedEndState** (Telos) during AI-human interaction.

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
├── telos/                             # Protocol: goal co-construction
│   ├── .claude-plugin/plugin.json
│   └── skills/telos/SKILL.md          # Full protocol definition (user-invocable)
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
- **Flow**: `U → C → P → Pₛ → T(Pₛ) → ∥I(T) → R → L → (sufficiency check → act? → K → ∥F → V → L' → loop)`
- **Key**: Phase 1 calls `AskUserQuestion` for perspective selection; Phase 4 calls `AskUserQuestion` for sufficiency check with `act` option; Phase 5-6 classify findings and execute fixes with peer verification; loop until user satisfied or ESC
- **Phase 2**: Agent team via TeamCreate (mandatory); teammate isolation prevents cross-perspective contamination and confirmation bias; coordinator-mediated cross-dialogue; team persists across Phase 4 loop and through Phase 5-6
- **Phase 5-6**: 3-tier finding classification (actionable/surfaced-unknown/design-level) + fixer with peer verification; peer-to-peer in Phase 6 only; post-TeamDelete recommends follow-up protocols for deferred findings
- **Invocation**: `/prothesis` or use "lens" in conversation

### Syneidesis (συνείδησις) — alias: `gap`
Surface potential gaps at decision points as questions. Injected into main agent context.
- **Flow**: `D → G → TaskCreate[all] → Q → J → Σ' → (re-scan → loop)`
- **Key**: Phase 0 detects ALL gaps → TaskCreate batch registration; Phase 1 surfaces sequentially via `AskUserQuestion`; re-scan after each response; loop until all tasks completed or ESC
- **Gap types**: Procedural, Consideration, Assumption, Alternative
- **Conditions**: `committed(D)` (mutates state ∨ externally visible ∨ consumes resource) ∧ observable gap ∧ unaddressed
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
- **Key**: User-initiated; Phase 0 categorizes AI work; Phase 1 calls `AskUserQuestion` for entry point selection; Phase 2 uses `TaskCreate` for tracking; Phase 3 calls `AskUserQuestion` for comprehension verification with `TaskUpdate`; user proposals ejected via `TaskCreate` to maintain comprehension focus
- **Gap types**: Expectation, Causality, Scope, Sequence
- **Triggers**: "explain this", "what did you do?", "help me understand"
- **Invocation**: `/katalepsis` or use "grasp" in conversation

### Telos (τέλος) — alias: `goal`
Co-construct defined goals from vague intent through AI-proposed, user-shaped dialogue.
- **Flow**: `G → Gᵥ → Dₛ → P → A → C' → (loop until sufficient)`
- **Key**: AI-detected, user-confirmed (Phase 0); Phase 1 calls `AskUserQuestion` for dimension selection; Phase 2 proposes concrete candidates; Phase 4 calls `AskUserQuestion` for GoalContract approval; loop until user approves or ESC
- **Gap types**: Outcome, Metric, Boundary, Priority
- **Triggers**: "not sure what I want", "something like", "ideas for", exploratory framing
- **Invocation**: `/telos` or use "goal" in conversation

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
- **Selection over Detection**: User selects gap types, AI does not auto-diagnose. Applies within protocols (user expertise); protocol-to-protocol ordering uses logical defaults with user override
- **Surfacing over Deciding**: AI illuminates, user judges
- **Convergence Persistence**: Modes active until convergence (Hermeneia loops until |G| = 0)
- **Priority Override**: Active protocols supersede default behaviors

## Protocol Precedence

Multi-activation order: **Hermeneia → Telos → Prothesis → Syneidesis → Katalepsis**

This is a logical default, not a strict constraint. When multiple protocols activate simultaneously, AI follows this order — each protocol's output feeds into subsequent ones (clarified intent → goal construction → perspective → gap audit). Users can override by explicitly requesting a different protocol first.

**Katalepsis**: Structural constraint — always executes last. Requires completed AI work (`R`); without a result, there is nothing to verify. This is not overridable.

### Epistemic Workflow

```
[Request] → [Intent] → [Goal] → [Perspective] → [Decision] → [Execution] → [Comprehension]
               ↑          ↑          ↑              ↑                            ↑
           Hermeneia    Telos    Prothesis      Syneidesis                   Katalepsis
```

This diagram shows logical progression, not strict execution order.

**Initiator taxonomy**:
- **AI-detected**: AI determines the condition is present (Prothesis, Syneidesis, Telos)
- **User-initiated**: User signals awareness of a deficit (Hermeneia, Katalepsis)
- **User-invoked**: User runs as deliberate practice; no deficit awareness required (Reflexion, Write)

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

## Delegation Constraint

- **Prothesis Phase 2**: MUST use agent team (TeamCreate + Task teammates)—isolated context required for unbiased perspective analysis; cross-dialogue is coordinator-mediated
- **Prothesis Phase 5-6**: Fixer spawned via Task into existing team T; Phase 6 allows peer-to-peer (fixer ↔ originating perspective) for verification
- **Syneidesis/Hermeneia/Katalepsis**: No Task delegation—must run in main agent to call AskUserQuestion
- **Telos**: No Task delegation—must run in main agent to call AskUserQuestion

## Editing Guidelines

- **Notation**: `→` (function), `∥` (parallel), `[Tool]` suffix for external operations in PHASE TRANSITIONS
- Keep README.md and README_ko.md in sync
- Bump version in `.claude-plugin/plugin.json` on changes
- `call` (not `invoke` or `use`) for tool-calling instructions—strongest binding with zero polysemy
- Skills frontmatter: `name` (required), `description` (required), `user-invocable` (boolean), `allowed-tools` (optional)
