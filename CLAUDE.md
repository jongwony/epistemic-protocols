# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Code plugin marketplace for epistemic dialogue — each protocol resolves a specific cognitive deficit: **FrameworkAbsent → FramedInquiry** (Prothesis), **GapUnnoticed → AuditedDecision** (Syneidesis), **IntentMisarticulated → ClarifiedIntent** (Hermeneia), **ResultUngrasped → VerifiedUnderstanding** (Katalepsis), **GoalIndeterminate → DefinedEndState** (Telos), **ContextInsufficient → InformedExecution** (Aitesis), **DelegationAmbiguous → CalibratedDelegation** (Epitrope), **ExecutionBlind → SituatedExecution** (Prosoche), **ApplicationDecontextualized → ContextualizedExecution** (Epharmoge) during AI-human interaction.

## Architecture

```
epistemic-protocols/
├── .claude-plugin/marketplace.json    # Marketplace manifest
├── .claude/skills/verify/             # Project-level verification skill
├── prothesis/                         # Protocol: multi-perspective investigation
│   ├── .claude-plugin/plugin.json
│   └── skills/frame/SKILL.md       # Full protocol definition (user-invocable)
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
│   └── skills/inquire/SKILL.md       # Full protocol definition (user-invocable)
├── epitrope/                          # Protocol: context-adaptive delegation calibration
│   ├── .claude-plugin/plugin.json
│   └── skills/calibrate/SKILL.md     # Full protocol definition (user-invocable)
├── prosoche/                          # Protocol: execution-time risk evaluation
│   ├── .claude-plugin/plugin.json
│   └── skills/attend/SKILL.md        # Full protocol definition (user-invocable)
├── epharmoge/                         # Protocol: application-context mismatch detection (conditional)
│   ├── .claude-plugin/plugin.json
│   └── skills/contextualize/SKILL.md # Full protocol definition (user-invocable)
├── reflexion/                         # Skill: cross-session learning
│   ├── .claude-plugin/plugin.json
│   ├── agents/                        # Parallel extraction agents
│   ├── commands/                      # /reflect, /quick-reflect
│   └── skills/reflexion/SKILL.md
├── onboard/                            # Skill: epistemic protocol onboarding
│   ├── .claude-plugin/plugin.json
│   ├── agents/                        # project-scanner, session-analyzer
│   └── skills/onboard/SKILL.md
└── write/                             # Skill: multi-perspective blog drafting
    ├── .claude-plugin/plugin.json
    └── skills/write/SKILL.md
```

**Component Types**:
- **Skills** (`skills/*/SKILL.md`): Full protocol/workflow definitions with YAML frontmatter; user-invocable by default (v2.1.0+)
- **Commands** (`commands/*.md`): Lightweight invokers (reflexion only—prothesis/syneidesis use skills directly)
- **Agents** (`agents/*.md`): Subagents for parallel task execution (reflexion)

**Conventions**:
- Subagent naming: `plugin-name:agent-name` (e.g., `reflexion:session-summarizer`)
- References directory: `skills/*/references/` for detailed documentation (optional per plugin)
- No external dependencies; Node.js standard library only

**SKILL.md Formal Block Anatomy** (all protocols share this structure within `Definition` code block):
```
── FLOW ──              Protocol path formula (multi-line for multi-mode protocols)
── TYPES ──             Symbol definitions with type signatures and comments
── ENTRY TYPES ──       (if applicable) Extended types for entry modes (e.g., Epitrope)
── DELEGATION TYPES ──  (if applicable) Extended types for delegation structure (e.g., Epitrope)
── *-BINDING ──         (if applicable) Input binding resolution rules (U-BINDING, E-BINDING, G-BINDING)
── PHASE TRANSITIONS ── Phase-by-phase state transitions; [Tool] suffix marks external operations
── LOOP ──              Post-phase control flow (J values → next phase or terminal)
── BOUNDARY ──          (if applicable) Purpose annotations for key operations
── TOOL GROUNDING ──    Symbol → concrete Claude Code tool mapping
── CATEGORICAL NOTE ──  (if applicable) Mathematical notation definitions
── MODE STATE ──        Runtime state type (Λ) with nested state types
```
Static checks (`structure`, `tool-grounding`) validate this anatomy. New phases must appear in PHASE TRANSITIONS with `[Tool]` suffix AND in TOOL GROUNDING with concrete tool mapping.

## Plugins

### Frame (πρόθεσις) — Prothesis
Resolve absent frameworks by recommending analytical lenses (Mode 1) or assembling a team for multi-perspective inquiry (Mode 2).
- **Deficit**: FrameworkAbsent → FramedInquiry
- **Triggers**: Purpose present but approach unspecified; multiple valid frameworks exist
- **Invocation**: `/frame` or use "frame" in conversation

### Gap (συνείδησις) — Syneidesis
Surface unnoticed gaps at decision points as questions.
- **Deficit**: GapUnnoticed → AuditedDecision
- **Triggers**: Committed action detected with observable, unaddressed gaps
- **Invocation**: `/gap` or use "gap" in conversation

### Clarify (ἑρμηνεία) — Hermeneia
Clarify intent-expression gaps through hybrid-initiated dialogue.
- **Deficit**: IntentMisarticulated → ClarifiedIntent
- **Triggers**: "clarify", "what I mean", "did I express this right"; also AI-detected trigger for expression ambiguity (requires user confirmation)
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

### Inquire (αἴτησις) — Aitesis
Detect context insufficiency before execution through AI-guided inquiry.
- **Deficit**: ContextInsufficient → InformedExecution
- **Triggers**: Context insufficiency heuristics (ambiguous execution scope, external dependency, implicit requirements)
- **Invocation**: `/inquire` or use "inquire" in conversation

### Calibrate (ἐπιτροπή) — Epitrope
Context-adaptive delegation calibration through scenario-based interview.
- **Deficit**: DelegationAmbiguous → CalibratedDelegation
- **Triggers**: Multi-domain task, ambiguous scope keywords, prior autonomy friction, active team without DC
- **Invocation**: `/calibrate` or use "calibrate" in conversation

### Attend (προσοχή) — Prosoche
Evaluate execution-time risks by classifying existing tasks for risk signals and surfacing elevated-risk findings.
- **Deficit**: ExecutionBlind → SituatedExecution
- **Triggers**: User declares execution intent via `/attend`
- **Invocation**: `/attend` or use "attend" in conversation

### Contextualize (ἐφαρμογή) — Epharmoge
Detect application-context mismatch after execution when correct output may not fit context.
- **Deficit**: ApplicationDecontextualized → ContextualizedExecution
- **Triggers**: Post-execution applicability heuristics (environment assumption, convention mismatch, scope overflow)
- **Invocation**: `/contextualize` or use "contextualize" in conversation
- **Status**: Conditional — requires Aitesis operational experience

### Onboard
Analyze Claude Code usage patterns and recommend epistemic protocols for onboarding.
- **Flow**: Scan → Extract → Map → Present → Guide
- **Key**: Phase 1 uses `project-scanner` subagent, Phase 2 uses parallel `session-analyzer` subagents
- **Invocation**: `/onboard`

### Reflexion
Extract insights from Claude Code sessions into persistent memory.
- **Flow**: Session → Context → ∥Extract → Select → Integrate → Verify
- **Key**: Phase 2 uses parallel agents (`session-summarizer`, `insight-extractor`, `knowledge-finder`)
- **References**: `skills/reflexion/references/` for detailed workflows

### Write
Transform session insights into blog posts through multi-perspective analysis.
- **Flow**: `Frame → Format → Write → Refine → Gap → Finalize`
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

## Design Philosophy

**Unix Philosophy Homomorphism**: Each protocol is a single-purpose epistemic tool. Composition is bottom-up — users invoke protocols for recognized deficits, not follow a prescribed pipeline. The precedence order below is a logical default for multi-activation, not a mandatory sequence.

**Coexistence over Mirroring**: Protocols coexist with Claude Code built-in commands (`/simplify`, `/batch`) as orthogonal tools occupying different layers:

| Layer | Concern | Tools |
|-------|---------|-------|
| Epistemic | "Are we doing the right thing?" | Protocols (`/clarify`, `/goal`, `/inquire`, `/gap`, ...) |
| Execution | "Are we doing it correctly?" | Built-ins (`/batch`, `/simplify`) |
| Verification | "Did we understand?" | Protocol (`/grasp`) |

Do not mirror built-in execution capabilities (e.g., worktree isolation, PR creation) into protocol definitions. Do not absorb protocol epistemic concerns into built-in command wrappers. Each system maintains its own responsibility boundary, exchanging results at handoff points only.

## Protocol Precedence

Multi-activation order: **Clarify → Goal → Calibrate → Inquire → Frame → Gap → Attend → Contextualize → Grasp**

This is a logical default, not a strict constraint. When multiple protocols activate simultaneously, AI follows this order — each protocol's output feeds into subsequent ones (clarified intent → goal construction → delegation calibration → context verification → perspective → gap audit → execution-time attention → applicability check). Users can override by explicitly requesting a different protocol first.

**Katalepsis**: Structural constraint — always executes last. Requires completed AI work (`R`); without a result, there is nothing to verify. This is not overridable.

### Epistemic Workflow

```
[Request] → [Intent] → [Goal] → [Delegation] → [Context] → [Perspective] → [Decision] → [Execution] → [Application] → [Comprehension]
               ↑          ↑          ↑              ↑             ↑              ↑              ↑              ↑               ↑
           Hermeneia    Telos    Epitrope        Aitesis      Prothesis      Syneidesis      Prosoche      Epharmoge       Katalepsis
```

This diagram shows logical progression, not strict execution order.

**Initiator taxonomy** (2-layer model):
- **Layer 1**: All protocols are user-invocable (slash command or description match). No AI detection at this layer.
- **Layer 2** (in-protocol heuristics): Behavior varies by initiator type:
  - **AI-guided**: AI evaluates condition and guides the process (Prothesis, Syneidesis, Telos, Aitesis, Epitrope, Epharmoge)
  - **Hybrid**: Both user signal and AI detection can initiate; AI-detected trigger path requires user confirmation (Hermeneia)
  - **User-initiated**: User signals awareness of a deficit; no AI-guided activation (Katalepsis, Prosoche)
  - **User-invoked**: Deliberate practice; no deficit awareness required (Reflexion, Write)

## Development

- **Node.js 22+** required (`zlib.crc32` used in packaging; CI pins Node 22)
- Static checks: `node .claude/skills/verify/scripts/static-checks.js .`
- Packaging: `node scripts/package.js [--dry-run]` — produces `dist/*.zip` + `dist/release-notes.md`

### Packaging Transformations

`scripts/package.js` applies non-trivial transforms when building release ZIPs:
- Renames `SKILL.md` → `Skill.md` (marketplace case convention)
- Strips frontmatter fields: `allowed-tools`, `license`, `compatibility`, `metadata`
- Overrides descriptions exceeding 200 chars (`frame`, `calibrate`, `reflexion`)
- Excludes `agents/`, `commands/`, README files from ZIPs
- 500-line guideline per SKILL.md (warns if exceeded)

### graph.json

Protocol dependency graph at `.claude/skills/verify/graph.json`. Validated by static check `graph-integrity`.

```
Edge types (allowlist):
  precondition  — must complete before target (DAG-checked for cycles)
  advisory      — provides useful context but not required
  transition    — mode switch between protocols
  suppression   — prevents stacking of similar protocols

Wildcard: "source": "*" = all nodes except target
Descriptions: "satisfies" field in Korean
```

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
8. **graph-integrity**: graph.json node/edge validation — edge-type allowlist, edge-reference check, node-directory existence, orphaned node detection (SKILL.md presence), isolated node detection (no edges), precondition DAG acyclicity (Kahn's algorithm)
9. **spec-vs-impl**: TYPES definitions cross-referenced against PHASE TRANSITIONS and prose — detects rename drift, dead types, and resolution type mismatches
10. **cross-ref-scan**: Protocol name and deficit → resolution pair consistency across CLAUDE.md and all SKILL.md files, distinction table completeness, graph.json edge type allowlist verification

## Delegation Constraint

- **Prothesis**: See SKILL.md for phase-specific delegation rules (Phase 0-2 main agent, Phase 3-4 agent team, Phase 5 main agent)
- **Syneidesis/Hermeneia/Katalepsis**: No Task delegation—must run in main agent to call AskUserQuestion
- **Telos**: No Task delegation—must run in main agent to call AskUserQuestion
- **Aitesis**: No Task delegation—must run in main agent to call AskUserQuestion
- **Epitrope**: Solo mode: no Task delegation—must run in main agent to call AskUserQuestion. Team modes: Phase 4 produces DC; authority transitions at approval. Team application is execution-layer concern.
- **Epharmoge**: No Task delegation—must run in main agent to call AskUserQuestion
- **Prosoche**: Produces risk classification (p=Low pass-through, p=Elevated surface to user). No delegation—pure classification runs in main agent.

## Git Conventions

- **Commit message**: `type(scope): Korean description` — type ∈ {feat, fix, refactor, style}, scope = plugin name
- **Branch naming**: `feat/name-protocol`, `refactor/description`, `fix/description`
- **PR body language**: Korean (hook-enforced)
- **Release tag**: CalVer `v{YYYY}.{MM}.{DD}[.{N}]` — tag push triggers CI release (`gh release create --draft`)

## Editing Guidelines

- **Notation**: `→` (function), `∥` (parallel), `[Tool]` suffix for external operations in PHASE TRANSITIONS
- Keep README.md and README_ko.md in sync
- Update `assets/epistemic-matrix*.svg` when the protocol table changes (referenced by both READMEs)
- Bump version in `.claude-plugin/plugin.json` on changes
- `call` (not `invoke` or `use`) for tool-calling instructions—strongest binding with zero polysemy
- Skills frontmatter: `name` (required), `description` (required, quote if contains `:`), `allowed-tools` (optional), `license`, `compatibility`, `metadata`

**Co-change pattern** (protocol modifications require synchronized edits):

| Change | Files to update |
|--------|----------------|
| New/modified phase | SKILL.md (formal block + prose) |
| New tool usage | SKILL.md (PHASE TRANSITIONS `[Tool]` + TOOL GROUNDING entry) |
| New loop option | SKILL.md (LOOP + terminal phase prose + Rules) |
| Delegation change | SKILL.md (isolation section), CLAUDE.md (delegation constraint) |
| Any protocol change | `plugin.json` version bump, then `/verify` |
| New plugin added | `marketplace.json` (plugins array), plugin directory with `plugin.json` |
| New protocol added | All of the above, plus: CLAUDE.md (overview, architecture, plugins, precedence, workflow, delegation), `static-checks.js` (3 arrays: `aliasToSkill`, `checkRequiredSections`, `checkToolGrounding`), ALL existing SKILL.md (precedence descriptions + distinction tables), README.md + README_ko.md |
| Precedence change | CLAUDE.md (precedence section + workflow diagram), ALL SKILL.md precedence descriptions |
| Initiator taxonomy change | CLAUDE.md (initiator taxonomy), ALL SKILL.md (distinction tables + Rule #1), READMEs, `review-checklists.md` |
