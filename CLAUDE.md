# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Code plugin marketplace for epistemic dialogue — each protocol resolves a specific cognitive deficit: **FrameworkAbsent → FramedInquiry** (Prothesis), **GapUnnoticed → AuditedDecision** (Syneidesis), **IntentMisarticulated → ClarifiedIntent** (Hermeneia), **ResultUngrasped → VerifiedUnderstanding** (Katalepsis), **GoalIndeterminate → DefinedEndState** (Telos), **ContextInsufficient → InformedExecution** (Aitesis) during AI-human interaction.

## Architecture

```
epistemic-protocols/
├── .claude-plugin/marketplace.json    # Marketplace manifest
├── .claude/skills/verify/             # Project-level verification skill
├── prothesis/                         # Protocol: multi-perspective investigation
│   ├── .claude-plugin/plugin.json
│   └── skills/mission/SKILL.md      # Full protocol definition (user-invocable)
├── syneidesis/                        # Protocol: gap surfacing
│   ├── .claude-plugin/plugin.json
│   └── skills/gap/SKILL.md     # Full protocol definition (user-invocable)
├── hermeneia/                         # Protocol: intent clarification
│   ├── .claude-plugin/plugin.json
│   └── skills/clarify/SKILL.md      # Full protocol definition (user-invocable)
├── katalepsis/                        # Protocol: comprehension verification
│   ├── .claude-plugin/plugin.json
│   └── skills/grasp/SKILL.md     # Full protocol definition (user-invocable)
├── telos/                             # Protocol: goal co-construction
│   ├── .claude-plugin/plugin.json
│   └── skills/goal/SKILL.md          # Full protocol definition (user-invocable)
├── aitesis/                           # Protocol: context insufficiency detection
│   ├── .claude-plugin/plugin.json
│   └── skills/solicit/SKILL.md       # Full protocol definition (user-invocable)
├── reflexion/                         # Skill: cross-session learning
│   ├── .claude-plugin/plugin.json
│   ├── agents/                        # Parallel extraction agents
│   ├── commands/                      # /reflect, /quick-reflect
│   └── skills/reflexion/SKILL.md
└── write/                             # Skill: multi-perspective blog drafting
    ├── .claude-plugin/plugin.json
    └── skills/write/SKILL.md
```

**Component Types**:
- **Skills** (`skills/*/SKILL.md`): Full protocol/workflow definitions with YAML frontmatter; user-invocable by default (v2.1.0+)
- **Commands** (`commands/*.md`): Lightweight invokers (reflexion only—prothesis/syneidesis use skills directly)
- **Agents** (`agents/*.md`): Subagents for parallel task execution (reflexion only)

**Conventions**:
- Subagent naming: `plugin-name:agent-name` (e.g., `reflexion:session-summarizer`)
- References directory: `skills/*/references/` for detailed documentation (optional per plugin)
- No external dependencies; Node.js standard library only

**SKILL.md Formal Block Anatomy** (all protocols share this structure within `Definition` code block):
```
── FLOW ──              One-line formula: full protocol path with symbols
── TYPES ──             Symbol definitions with type signatures and comments
── ACTION TYPES ──      (if applicable) Extended types for action phases
── PHASE TRANSITIONS ── Phase-by-phase state transitions; [Tool] suffix marks external operations
── LOOP ──              Post-phase control flow (J values → next phase or terminal)
── BOUNDARY ──          (if applicable) Purpose annotations for key operations
── TOOL GROUNDING ──    Symbol → concrete Claude Code tool mapping
── MODE STATE ──        Runtime state type (Λ) with nested state types
```
Static checks (`structure`, `tool-grounding`) validate this anatomy. New phases must appear in PHASE TRANSITIONS with `[Tool]` suffix AND in TOOL GROUNDING with concrete tool mapping.

## Plugins

### Mission (πρόθεσις) — Prothesis
Resolve absent frameworks by assembling a team to analyze from selected viewpoints.
- **Deficit**: FrameworkAbsent → FramedInquiry
- **Triggers**: Purpose present but approach unspecified; multiple valid frameworks exist
- **Invocation**: `/mission` or use "mission" in conversation

### Gap (συνείδησις) — Syneidesis
Surface unnoticed gaps at decision points as questions.
- **Deficit**: GapUnnoticed → AuditedDecision
- **Triggers**: Committed action detected with observable, unaddressed gaps
- **Invocation**: `/gap` or use "gap" in conversation

### Clarify (ἑρμηνεία) — Hermeneia
Clarify intent-expression gaps through user-initiated dialogue.
- **Deficit**: IntentMisarticulated → ClarifiedIntent
- **Triggers**: "clarify", "what I mean", "did I express this right"
- **Invocation**: `/clarify` or use "clarify" in conversation

### Grasp (κατάληψις) — Katalepsis
Achieve certain comprehension of AI work through structured verification.
- **Deficit**: ResultUngrasped → VerifiedUnderstanding
- **Triggers**: "explain this", "what did you do?", "help me understand"
- **Invocation**: `/grasp` or use "grasp" in conversation

### Goal (τέλος) — Telos
Co-construct defined goals from vague intent through AI-proposed, user-shaped dialogue.
- **Deficit**: GoalIndeterminate → DefinedEndState
- **Triggers**: "not sure what I want", "something like", "ideas for", exploratory framing
- **Invocation**: `/goal` or use "goal" in conversation

### Solicit (αἴτησις) — Aitesis
Detect context insufficiency before execution through AI-detected solicitation.
- **Deficit**: ContextInsufficient → InformedExecution
- **Triggers**: Environment changed, user dissatisfaction patterns, repeated failures, stale assumptions
- **Invocation**: `/solicit` or use "solicit" in conversation

### Reflexion
Extract insights from Claude Code sessions into persistent memory.
- **Flow**: Session → Context → ∥Extract → Select → Integrate → Verify
- **Key**: Phase 2 uses parallel agents (`session-summarizer`, `insight-extractor`, `knowledge-finder`)
- **References**: `skills/reflexion/references/` for detailed workflows

### Write
Transform session insights into blog posts through multi-perspective analysis.
- **Flow**: `Mission → Format → Write → Refine → Gap → Finalize`
- **Key**: Integrates both protocols—Prothesis for perspective selection, Syneidesis for gap validation

### Verify (Project-level)
Pre-commit protocol verification via static checks and expert review.
- **Location**: `.claude/skills/verify/`
- **Invocation**: `/verify` before commits

## Core Principles

- **Recognition over Recall**: Options to select, not blanks to fill
- **Selection over Detection**: User selects gap types; AI does not auto-diagnose
- **Surfacing over Deciding**: AI illuminates, user judges
- **Convergence Persistence**: Modes active until convergence
- **Priority Override**: Active protocols supersede default behaviors

## Protocol Precedence

Multi-activation order: **Clarify → Goal → Solicit → Mission → Gap → Grasp**

This is a logical default, not a strict constraint. When multiple protocols activate simultaneously, AI follows this order — each protocol's output feeds into subsequent ones (clarified intent → goal construction → context verification → perspective → gap audit). Users can override by explicitly requesting a different protocol first.

**Katalepsis**: Structural constraint — always executes last. Requires completed AI work (`R`); without a result, there is nothing to verify. This is not overridable.

### Epistemic Workflow

```
[Request] → [Intent] → [Goal] → [Context] → [Perspective] → [Decision] → [Execution] → [Comprehension]
               ↑          ↑         ↑             ↑              ↑                            ↑
           Hermeneia    Telos    Aitesis      Prothesis      Syneidesis                   Katalepsis
```

This diagram shows logical progression, not strict execution order.

**Initiator taxonomy**:
- **AI-detected**: AI determines the condition is present (Prothesis, Syneidesis, Telos, Aitesis)
- **User-initiated**: User signals awareness of a deficit (Hermeneia, Katalepsis)
- **User-invoked**: User runs as deliberate practice; no deficit awareness required (Reflexion, Write)

## Verification

Run `/verify` before commits. Static checks via:
```bash
node .claude/skills/verify/scripts/static-checks.js .
```

**Static checks performed**:
1. **json-schema**: plugin.json required fields (name, version, description, author), semver format, name format (`/^[a-z][a-z0-9-]*$/`)
2. **notation**: Unicode consistency (→, ∥, ∩, ∪, ⊆, ∈, ≠ over ASCII fallbacks)
3. **directive-verb**: `call` (not `invoke`/`use`) for tool instructions
4. **xref**: Referenced file paths exist in expected locations
5. **structure**: Required sections in protocol SKILL.md (Definition, Mode Activation, Protocol, Rules, PHASE TRANSITIONS, MODE STATE)
6. **tool-grounding**: TOOL GROUNDING section present, external operations have `[Tool]` notation in PHASE TRANSITIONS
7. **version-staleness**: plugin content changed without plugin.json version bump (git-aware, warn level; skips during merge/rebase conflicts; ignores README, LICENSE, .gitignore)

## Delegation Constraint

- **Prothesis**: See SKILL.md for phase-specific delegation rules (Phase 0-1 main agent, Phase 3+ agent team)
- **Syneidesis/Hermeneia/Katalepsis**: No Task delegation—must run in main agent to call AskUserQuestion
- **Telos**: No Task delegation—must run in main agent to call AskUserQuestion
- **Aitesis**: No Task delegation—must run in main agent to call AskUserQuestion

## Editing Guidelines

- **Notation**: `→` (function), `∥` (parallel), `[Tool]` suffix for external operations in PHASE TRANSITIONS
- Keep README.md and README_ko.md in sync
- Bump version in `.claude-plugin/plugin.json` on changes
- `call` (not `invoke` or `use`) for tool-calling instructions—strongest binding with zero polysemy
- Skills frontmatter: `name` (required), `description` (required, quote if contains `:`), `user-invocable` (boolean), `allowed-tools` (optional)

**Co-change pattern** (protocol modifications require synchronized edits):

| Change | Files to update |
|--------|----------------|
| New/modified phase | SKILL.md (formal block + prose) |
| New tool usage | SKILL.md (PHASE TRANSITIONS `[Tool]` + TOOL GROUNDING entry) |
| New loop option | SKILL.md (LOOP + Phase 5 prose + Rules) |
| Delegation change | SKILL.md (isolation section), CLAUDE.md (delegation constraint) |
| Any protocol change | `plugin.json` version bump, then `/verify` |
| New plugin added | `marketplace.json` (plugins array), plugin directory with `plugin.json` |
