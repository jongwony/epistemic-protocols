# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Code plugin marketplace for epistemic dialogue — each protocol structures a specific decision point: **FrameworkAbsent → FramedInquiry** (Prothesis), **GapUnnoticed → AuditedDecision** (Syneidesis), **IntentMisarticulated → ClarifiedIntent** (Hermeneia), **ResultUngrasped → VerifiedUnderstanding** (Katalepsis), **GoalIndeterminate → DefinedEndState** (Telos), **BoundaryUndefined → DefinedBoundary** (Horismos), **ContextInsufficient → InformedExecution** (Aitesis), **MappingUncertain → ValidatedMapping** (Analogia), **ExecutionBlind → SituatedExecution** (Prosoche), **ApplicationDecontextualized → ContextualizedExecution** (Epharmoge) during human-AI interaction.

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
├── horismos/                          # Protocol: epistemic boundary definition
│   ├── .claude-plugin/plugin.json
│   └── skills/bound/SKILL.md         # Full protocol definition (user-invocable)
├── aitesis/                           # Protocol: context insufficiency inference
│   ├── .claude-plugin/plugin.json
│   └── skills/inquire/SKILL.md       # Full protocol definition (user-invocable)
├── analogia/                          # Protocol: structural mapping validation
│   ├── .claude-plugin/plugin.json
│   └── skills/ground/SKILL.md       # Full protocol definition (user-invocable)
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
├── epistemic-cooperative/               # Utility skills: report + onboarding + analytics + configuration
│   ├── .claude-plugin/plugin.json
│   ├── agents/                        # project-scanner, session-analyzer, coverage-scanner
│   └── skills/
│       ├── report/SKILL.md            # Usage analysis report from session patterns
│       ├── onboard/SKILL.md           # Quick recommendation + protocol learning (quick proof + targeted learning)
│       ├── dashboard/SKILL.md          # Full-session coverage dashboard
│       └── catalog/SKILL.md           # Protocol handbook — instant reference
└── write/                             # Skill: multi-perspective blog drafting
    ├── .claude-plugin/plugin.json
    └── skills/write/SKILL.md
```

**Component Types**:
- **Skills** (`skills/*/SKILL.md`): Full protocol/workflow definitions with YAML frontmatter; user-invocable by default (v2.1.0+)
- **Commands** (`commands/*.md`): Lightweight invokers (reflexion only—prothesis/syneidesis use skills directly)
- **Agents** (`agents/*.md`): Subagents for parallel task execution (reflexion, epistemic-cooperative)

**Conventions**:
- Subagent naming: `plugin-name:agent-name` (e.g., `reflexion:session-summarizer`)
- References directory: `skills/*/references/` for detailed documentation (optional per plugin)
- No external dependencies; Node.js standard library only

**SKILL.md Formal Block Anatomy**: FLOW, MORPHISM, TYPES, PHASE TRANSITIONS, LOOP, TOOL GROUNDING, ELIDABLE CHECKPOINTS, MODE STATE (and optional blocks). Details: [docs/design-philosophy.md](docs/design-philosophy.md#skillmd-formal-block-anatomy)

## Plugins

| Protocol | Slash | Deficit → Resolution |
|----------|-------|----------------------|
| Prothesis | `/frame` | FrameworkAbsent → FramedInquiry |
| Syneidesis | `/gap` | GapUnnoticed → AuditedDecision |
| Hermeneia | `/clarify` | IntentMisarticulated → ClarifiedIntent |
| Katalepsis | `/grasp` | ResultUngrasped → VerifiedUnderstanding |
| Telos | `/goal` | GoalIndeterminate → DefinedEndState |
| Horismos | `/bound` | BoundaryUndefined → DefinedBoundary |
| Aitesis | `/inquire` | ContextInsufficient → InformedExecution |
| Analogia | `/ground` | MappingUncertain → ValidatedMapping |
| Prosoche | `/attend` | ExecutionBlind → SituatedExecution |
| Epharmoge | `/contextualize` | ApplicationDecontextualized → ContextualizedExecution |

**Utility skills**: Epistemic Cooperative (`/catalog`, `/report`, `/onboard`, `/dashboard`), Reflexion (`/reflect`), Write (`/write`), Verify (`/verify`). Triggers, flows, and detailed descriptions in each plugin's SKILL.md.

## Core Principles

- **Recognition over Recall**: Options to select, not blanks to fill
- **Detection with user authority**: AI detects and presents with evidence; user retains decision authority (proceed/revise)
- **Surfacing over Deciding**: AI illuminates, user judges
- **Convergence Persistence**: Modes active until convergence
- **Priority Override**: Active protocols supersede default behaviors

## Design Philosophy

Detailed rationale: [docs/design-philosophy.md](docs/design-philosophy.md)

- **Unix Philosophy Homomorphism**: Single-purpose epistemic tools; bottom-up composition
- **Session Text Composition**: Inter-protocol data flows as natural language in session context
- **Dual Advisory Layer**: graph.json (structural) + Post-Convergence Suggestions (heuristic)
- **Coexistence over Mirroring**: Protocols occupy epistemic layer; built-ins occupy execution layer
- **Three-Tier Termination**: user_esc (ungraceful) / user_withdraw (graceful) / normal convergence
- **Audience Reach**: CLAUDE.md guides contributors; SKILL.md guides runtime
- **Adversarial Protocol Design**: Anticipate AI shortcut paths; structural guards in Rules
- **Deficit Empiricism**: Protocol creation requires N≥3 observed deficit instances
- **Convergence Evidence**: Demonstrated transformation trace, not bare assertion
- **Structural Idempotency**: Same definition → same outcome regardless of realization
- **Pattern over Tool**: Recognition over Recall is content invariant, not tool-dependent
- **Interaction Kind Factorization**: G = R(p) ∘ A; Qc (classificatory, bounded regret) / Qs (constitutive, unbounded regret)
- **Full Taxonomy Confirmation**: Finite taxonomy Qc gates present ALL types with status + evidence; Post-Convergence traverses ALL conditions

## Protocol Precedence

### Epistemic Concern Clusters

Protocols grouped by primary concern, ordered by activation sequence within each cluster. Simultaneous activation follows cluster order; users can override. Information flow: `graph.json` (authoritative source).

| Concern | Protocols |
|---------|-----------|
| Planning | `/clarify` (Hermeneia), `/goal` (Telos), `/inquire` (Aitesis) |
| Analysis | `/frame` (Prothesis), `/ground` (Analogia) |
| Decision | `/gap` (Syneidesis) |
| Execution | `/attend` (Prosoche) |
| Verification | `/contextualize` (Epharmoge) |

**Cross-cutting**: `/bound` (Horismos) — BoundaryMap narrows scope for 5 downstream protocols. `/grasp` (Katalepsis) — requires all to complete.

**Key graph relationships**:
- Preconditions (DAG-enforced): Hermeneia → Telos → Horismos; * → Katalepsis
- Advisory hubs: Horismos → {Aitesis, Prothesis, Prosoche, Analogia, Syneidesis}, Prothesis → {Syneidesis, Telos, Aitesis, Analogia}
- Suppression: Syneidesis ⊣ Aitesis (same scope), Aitesis ⊣ Epharmoge (pre+post stacking)

**Initiator taxonomy** (2-layer model):
- **Layer 1**: All protocols are user-invocable (slash command or description match). No AI detection at this layer.
- **Layer 2** (in-protocol heuristics): Behavior varies by initiator type:
  - **AI-guided**: AI evaluates condition and guides the process (Prothesis, Syneidesis, Telos, Horismos, Aitesis, Analogia, Epharmoge)
  - **Hybrid**: Both user signal and AI detection can initiate; AI-detected trigger path requires user confirmation (Hermeneia)
  - **User-initiated**: User signals awareness of a deficit; no AI-guided activation (Katalepsis, Prosoche)
  - **User-invoked**: Deliberate practice; no deficit awareness required (Reflexion, Write)

## Development

- **Node.js 22+** required (`zlib.crc32` used in packaging; CI pins Node 22)
- Static checks: `node .claude/skills/verify/scripts/static-checks.js .`
- Packaging: `node scripts/package.js [--dry-run]` — produces `dist/*.zip` + `dist/release-notes.md`

### graph.json

Protocol dependency graph at `.claude/skills/verify/graph.json`. Validated by static check `graph-integrity`.

```
Edge types (allowlist):
  precondition  — must complete before target (DAG-checked for cycles)
  advisory      — provides useful context but not required
  suppression   — prevents stacking of similar protocols

Wildcard: "source": "*" = all nodes except target
Descriptions: "satisfies" field in Korean
```

## Verification

Run `/verify` before commits. Static checks via:
```bash
node .claude/skills/verify/scripts/static-checks.js .
```

14 static checks: json-schema, notation, directive-verb, xref, structure, tool-grounding, version-staleness, graph-integrity, spec-vs-impl, cross-ref-scan, onboard-sync, precedence-linear-extension, partition-invariant, catalog-sync. Details: [docs/verification.md](docs/verification.md)

## Delegation Constraint

- **Prothesis**: See SKILL.md for phase-specific delegation rules (Phase 0-2 main agent, Phase 3-4 agent team incl. routing)
- **Syneidesis/Hermeneia/Katalepsis**: No Task delegation—must run in main agent (user-facing gates require main agent context)
- **Telos**: No Task delegation—must run in main agent (user-facing gates require main agent context)
- **Horismos**: No Task delegation—must run in main agent (user-facing gates require main agent context)
- **Aitesis**: No Task delegation—must run in main agent (user-facing gates require main agent context)
- **Epharmoge**: No Task delegation—must run in main agent (user-facing gates require main agent context)
- **Analogia**: No Task delegation—must run in main agent (user-facing gates require main agent context)
- **Prosoche**: Phase -1 (Sub-A0 upstream routing, Sub-A materialization, Sub-B team coordination) and Phases 1-3 (Gate path) run in main agent (gate interaction, Skill). Phase 0 delegates p=Low tasks to prosoche-executor subagent or team agents via Agent tool.
- **Report**: Phase 1 delegates to project-scanner subagent (single). Phase 2: Path A delegates session-analyzer in targeted mode, Path B in full mode. Main agent handles Phases 3-5.
- **Onboard**: All paths use inline Quick Scan (no subagents) for Phase 1. Deep pattern extraction belongs in Report. Main agent handles all phases. Quick path: Phases 0-1, 2a-2b, 4 (Trial triggers actual protocol execution in-session). Targeted path: Phases 0-6 (full learning experience).
- **Dashboard**: Phase 2 delegates to coverage-scanner subagent (single) for batch aggregation. Main agent handles Phases 1, 3, 4.
- **Preferences**: No Task delegation—must run in main agent. Main agent handles all phases (0-2).
- **Catalog**: No delegation—text-only output, main agent handles all. Read tool for scenarios.md detail mode only.

## Git Conventions

- **Commit message**: `type(scope): Korean description` — type ∈ {feat, fix, refactor, style}, scope = plugin name
- **Branch naming**: `feat/name-protocol`, `refactor/description`, `fix/description`
- **PR body language**: Korean (hook-enforced)
- **Release tag**: CalVer `v{YYYY}.{MM}.{DD}[.{N}]` — tag push triggers CI release (`gh release create --draft`)

## Editing Guidelines

- **Notation**: `→` (function), `∥` (parallel), `[Tool]` suffix for external operations in PHASE TRANSITIONS
- Keep README.md and README_ko.md in sync
- Protocol table maintained in README.md (navigation hub format)
- Bump version in `.claude-plugin/plugin.json` on changes
- `call` for tool references, `present` for gate operations (tool-agnostic verb)
- Skills frontmatter: `name` (required), `description` (required, quote if contains `:`), `allowed-tools` (optional), `license`, `compatibility`, `metadata`

Co-change patterns tracked in [docs/co-change.md](docs/co-change.md). Key: any protocol change requires plugin.json version bump + `/verify`.
