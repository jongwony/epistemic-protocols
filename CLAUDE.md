# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Code plugin marketplace for epistemic dialogue — each protocol resolves a specific cognitive deficit: **FrameworkAbsent → FramedInquiry** (Prothesis), **GapUnnoticed → AuditedDecision** (Syneidesis), **IntentMisarticulated → ClarifiedIntent** (Hermeneia), **ResultUngrasped → VerifiedUnderstanding** (Katalepsis), **GoalIndeterminate → DefinedEndState** (Telos) during AI-human interaction.

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
Team-based multi-perspective investigation and execution. Injected into main agent context.
- **Flow**: `U → MB → MBᵥ → C → P → Pₛ → T(Pₛ) → ∥I(T) → R → L → (K_i → sufficiency check → ∥F → V → L' → loop)`
- **Key**: Phase 0 calls `AskUserQuestion` for Mission Brief confirmation; Phase 1 gathers context guided by MBᵥ; Phase 2 for perspective selection (multiSelect: individual options; user-supplied Pᵦ auto-included, novel perspectives only proposed); Phase 5a interactive classification (user-confirmed); Phase 5b sufficiency check with `act` option; Phase 6-7 classify findings and execute fixes with peer verification; loop until user satisfied or ESC
- **Phase 3**: Agent team via TeamCreate (mandatory); spawn prompt includes Mission Brief; teammate isolation prevents cross-perspective contamination and confirmation bias; coordinator-mediated cross-dialogue; team persists across Phase 5a/5b loop and through Phase 6-7
- **Phase 6-7**: 3-tier finding classification (actionable/surfaced-unknown/design-level) + praxis agent with peer verification; peer-to-peer in Phase 7 only; post-TeamDelete recommends follow-up protocols for deferred findings
- **Invocation**: `/mission` or use "mission" in conversation

### Gap (συνείδησις) — Syneidesis
Surface potential gaps at decision points as questions. Injected into main agent context.
- **Flow**: `D → G → TaskCreate[all] → Q → J → Σ' → (re-scan → loop)`
- **Key**: Phase 0 detects ALL gaps → TaskCreate batch registration; Phase 1 surfaces sequentially via `AskUserQuestion`; re-scan after each response; loop until all tasks completed or ESC
- **Gap types**: Procedural, Consideration, Assumption, Alternative
- **Conditions**: `committed(D)` (mutates state ∨ externally visible ∨ consumes resource) ∧ observable gap ∧ unaddressed
- **Invocation**: `/gap` or use "gap" in conversation

### Clarify (ἑρμηνεία) — Hermeneia
Clarify intent-expression gaps through user-initiated dialogue.
- **Flow**: `E → Eᵥ → Gₛ → Q → A → Î' → (loop)`
- **Key**: User-initiated only; Phase 1a confirms E, Phase 1b asks user to select gap type (no auto-diagnosis), Phase 2 calls `AskUserQuestion` for clarification; loop until convergence
- **Gap types**: Expression, Precision, Coherence, Context
- **Triggers**: "clarify", "what I mean", "did I express this right"
- **Invocation**: `/clarify` or use "clarify" in conversation

### Grasp (κατάληψις) — Katalepsis
Achieve certain comprehension of AI work through structured verification.
- **Flow**: `R → C → Sₑ → Tᵣ → P → Δ → Q → A → Tᵤ → P' → (loop until katalepsis)`
- **Key**: User-initiated; Phase 0 categorizes AI work; Phase 1 calls `AskUserQuestion` for entry point selection; Phase 2 calls `TaskCreate` for tracking; Phase 3 calls `AskUserQuestion` with Socratic probing questions (gap-type-specific comprehension tests); AI evaluates response and determines supporting reference via `Read` when needed; user proposals ejected via `TaskCreate` to maintain comprehension focus
- **Gap types**: Expectation, Causality, Scope, Sequence
- **Triggers**: "explain this", "what did you do?", "help me understand"
- **Invocation**: `/grasp` or use "grasp" in conversation

### Goal (τέλος) — Telos
Co-construct defined goals from vague intent through AI-proposed, user-shaped dialogue.
- **Flow**: `G → Gᵥ → Dₛ → P → A → C' → (loop until sufficient)`
- **Key**: AI-detected, user-confirmed (Phase 0); Phase 1 calls `AskUserQuestion` for dimension selection; Phase 2 proposes concrete candidates; Phase 4 calls `AskUserQuestion` for GoalContract approval; loop until user approves or ESC
- **Gap types**: Outcome, Metric, Boundary, Priority
- **Triggers**: "not sure what I want", "something like", "ideas for", exploratory framing
- **Invocation**: `/goal` or use "goal" in conversation

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
- **Selection over Detection**: User selects gap types, AI does not auto-diagnose. Applies within protocols (user expertise); protocol-to-protocol ordering uses logical defaults with user override
- **Surfacing over Deciding**: AI illuminates, user judges
- **Convergence Persistence**: Modes active until convergence (Hermeneia loops until |G| = 0)
- **Priority Override**: Active protocols supersede default behaviors

## Protocol Precedence

Multi-activation order: **Clarify → Goal → Mission → Gap → Grasp**

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
1. **json-schema**: plugin.json required fields (name, version, description, author), semver format, name format (`/^[a-z][a-z0-9-]*$/`)
2. **notation**: Unicode consistency (→, ∥, ∩, ∪, ⊆, ∈, ≠ over ASCII fallbacks)
3. **directive-verb**: `call` (not `invoke`/`use`) for tool instructions
4. **xref**: CLAUDE.md flow formulas sync with source files
5. **structure**: Required sections in protocol SKILL.md (Definition, Mode Activation, Protocol, Rules, PHASE TRANSITIONS, MODE STATE)
6. **tool-grounding**: TOOL GROUNDING section present, external operations have `[Tool]` notation in PHASE TRANSITIONS
7. **version-staleness**: plugin content changed without plugin.json version bump (git-aware, warn level; skips during merge/rebase conflicts; ignores README, LICENSE, .gitignore)

## Delegation Constraint

- **Prothesis Phase 0-1**: Main agent only (AskUserQuestion for Mission Brief confirmation + targeted context gathering)
- **Prothesis Phase 3**: MUST use agent team (TeamCreate + Task teammates)—isolated context required for unbiased perspective analysis; cross-dialogue is coordinator-mediated
- **Prothesis Phase 6-7**: Praxis agent spawned via Task into existing team T; Phase 7 allows peer-to-peer (praxis ↔ originating perspective) for verification
- **Syneidesis/Hermeneia/Katalepsis**: No Task delegation—must run in main agent to call AskUserQuestion
- **Telos**: No Task delegation—must run in main agent to call AskUserQuestion

## Editing Guidelines

- **Notation**: `→` (function), `∥` (parallel), `[Tool]` suffix for external operations in PHASE TRANSITIONS
- Keep README.md and README_ko.md in sync
- Bump version in `.claude-plugin/plugin.json` on changes
- `call` (not `invoke` or `use`) for tool-calling instructions—strongest binding with zero polysemy
- Skills frontmatter: `name` (required), `description` (required, quote if contains `:`), `user-invocable` (boolean), `allowed-tools` (optional)

**Co-change pattern** (protocol modifications require synchronized edits):

| Change | Files to update |
|--------|----------------|
| New/modified phase | SKILL.md (formal block + prose), CLAUDE.md (flow formula + key behaviors) |
| New tool usage | SKILL.md (PHASE TRANSITIONS `[Tool]` + TOOL GROUNDING entry) |
| New loop option | SKILL.md (LOOP + Phase 5 prose + Rules), CLAUDE.md (key behaviors) |
| Delegation change | SKILL.md (isolation section), CLAUDE.md (delegation constraint) |
| Any protocol change | `plugin.json` version bump, then `/verify` |
| New plugin added | `marketplace.json` (plugins array), plugin directory with `plugin.json` |
