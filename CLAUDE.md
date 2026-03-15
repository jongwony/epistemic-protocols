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
│       └── preferences/SKILL.md       # Interactive protocol preference configuration
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

**SKILL.md Formal Block Anatomy** (all protocols share this structure within `Definition` code block):
```
── FLOW ──              Protocol path formula (multi-line for multi-mode protocols)
── MORPHISM ──          (if applicable) Essential type transition skeleton: requires/deficit/preserves/invariant
── TYPES ──             Symbol definitions with type signatures and comments
── ENTRY TYPES ──       (if applicable) Extended types for entry modes
── DELEGATION TYPES ──  (if applicable) Extended types for delegation structure
── *-BINDING ──         (if applicable) Input binding resolution rules (U-BINDING, E-BINDING, G-BINDING)
── PHASE TRANSITIONS ── Phase-by-phase state transitions; [Tool] suffix marks external operations
── LOOP ──              Post-phase control flow (J values → next phase or terminal)
── BOUNDARY ──          (if applicable) Purpose annotations for key operations
── TOOL GROUNDING ──    Symbol → concrete Claude Code tool mapping
── CATEGORICAL NOTE ──  (if applicable) Mathematical notation definitions
── MODE STATE ──        Runtime state type (Λ) with nested state types
```
Static checks (`structure`, `tool-grounding`) validate this anatomy. New phases must appear in PHASE TRANSITIONS with `[Tool]` suffix AND in TOOL GROUNDING with concrete tool mapping.

**FLOW-MORPHISM relationship**: MORPHISM is the image of FLOW under a forgetful functor that discards computational detail and tool annotations, retaining only the essential type transition skeleton (source object → transformation steps → target object) with structural annotations (requires/deficit/preserves/invariant).

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

### Bound (ὁρισμός) — Horismos
Define epistemic boundaries per decision through AI-guided detection.
- **Deficit**: BoundaryUndefined → DefinedBoundary
- **Triggers**: Task scope with undefined ownership, "should I decide this or you?", boundary-undefined domains detected
- **Invocation**: `/bound` or use "bound" in conversation

### Inquire (αἴτησις) — Aitesis
Context sufficiency sensor + factual resolver + epistemic router. Senses multi-dimensional context insufficiency (factual, coherence, relevance), self-resolves factual dimensions via read-only verification and empirical probes, and routes non-factual dimensions to downstream protocols.
- **Deficit**: ContextInsufficient → InformedExecution
- **Triggers**: Context insufficiency heuristics (ambiguous execution scope, external dependency, implicit requirements)
- **Invocation**: `/inquire` or use "inquire" in conversation

### Ground (ἀναλογία) — Analogia
Validate structural mapping between abstract and concrete domains through AI-guided detection.
- **Deficit**: MappingUncertain → ValidatedMapping
- **Triggers**: Abstract framework applied without domain-specific validation; cross-domain analogy; grounding probe ("concrete example", "how does this apply", "show me in my context")
- **Invocation**: `/ground` or use "ground" in conversation

### Attend (προσοχή) — Prosoche
Route upstream epistemic deficits, materialize execution intent, classify risk signals, coordinate team delegation, and gate elevated-risk findings for user review.
- **Deficit**: ExecutionBlind → SituatedExecution
- **Triggers**: User declares execution intent via `/attend`
- **Invocation**: `/attend` or use "attend" in conversation

### Contextualize (ἐφαρμογή) — Epharmoge
Detect application-context mismatch after execution when correct output may not fit context.
- **Deficit**: ApplicationDecontextualized → ContextualizedExecution
- **Triggers**: Post-execution applicability heuristics (environment assumption, convention mismatch, scope overflow)
- **Invocation**: `/contextualize` or use "contextualize" in conversation
- **Status**: Conditional — requires Aitesis operational experience

### Epistemic Cooperative (Report + Onboard + Dashboard + Preferences)
Utility skill group for session analytics and configuration.
- **Report** `/report`: Generate epistemic usage analysis report with evidence-backed protocol recommendations and HTML artifact. Analytical output — pattern evidence, anti-pattern diagnostics, session snippets.
- **Onboard** `/onboard`: Quick recommendation from recent sessions, or quest-based learning through scenario, trial, and quiz. Flow: Quick Proof (Entry → QuickScan → Pick-1 → Evidence → Trial → Insight → Next), Targeted (Entry → QuickScan → Map → Scenario → Trial → Quiz → Guide), Targeted + std (Entry → Scenario → Trial → Quiz → Guide). Phase 0 selects path (quick default); Onboarding Pool (`/goal`, `/gap`, `/frame`) serves both Quick auto-recommend and Targeted fallback; pool exhaustion in Quick path transitions to Targeted.
- **Dashboard** `/dashboard`: Full-session coverage dashboard with friction mapping, growth timeline, achievements, and quality score. Flow: Collect → Aggregate → Analyze → Present. Phase 2 uses `coverage-scanner` subagent for batch aggregation.
- **Preferences** `/preferences`: Interactive protocol preference configuration for `~/.claude/CLAUDE.local.md`. Flow: Detect → Select → Configure → Generate → Verify. Quick path (6 global params) or Full path (global + ~32 per-protocol params).

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
- **Detection with user authority**: AI detects and presents with evidence; user retains decision authority (confirm/add/remove)
- **Surfacing over Deciding**: AI illuminates, user judges
- **Convergence Persistence**: Modes active until convergence
- **Priority Override**: Active protocols supersede default behaviors

## Design Philosophy

**Unix Philosophy Homomorphism**: Each protocol is a single-purpose epistemic tool. Composition is bottom-up — users invoke protocols for recognized cost situations, not follow a prescribed pipeline. The precedence order below is a logical default for multi-activation, not a mandatory sequence.

**Session Text Composition**: Inter-protocol data flows as natural language in the session context — no structured data channels between protocols. Each protocol's output becomes part of the conversation that subsequent protocols naturally read. Cell-based structured transport was considered and rejected: structuring context loses information. If structured transport becomes necessary, functor composition is the escalation path.

**Dual Advisory Layer**: Inter-protocol guidance operates through two distinct mechanisms at different abstraction levels: graph.json `advisory` edges (structural, validated by static checks, topology-aware) and Post-Convergence Suggestions (heuristic, session-context-dependent, deficit-condition-driven). These are complementary, not redundant — graph.json edges encode stable architectural relationships, while Post-Convergence suggestions respond to runtime session state. Suggestion targets may overlap with or diverge from graph.json edges; neither system constrains the other.

**Coexistence over Mirroring**: Protocols coexist with Claude Code built-in commands (`/simplify`, `/batch`) as orthogonal tools occupying different layers:

| Layer | Concern | Tools |
|-------|---------|-------|
| Epistemic | "Are we doing the right thing?" | Protocols (`/clarify`, `/goal`, `/inquire`, `/gap`, ...) |
| Execution | "Are we doing it correctly?" | Built-ins (`/batch`, `/simplify`) |
| Verification | "Did we understand?" | Protocol (`/grasp`) |

Do not mirror built-in execution capabilities (e.g., worktree isolation, PR creation) into protocol definitions. Do not absorb protocol epistemic concerns into built-in command wrappers. Each system maintains its own responsibility boundary, exchanging results at handoff points only.

**Three-Tier Termination**: Protocol exit follows a graduated taxonomy based on side-effect presence:

| Tier | Mechanism | Cleanup | Scope |
|------|-----------|---------|-------|
| `user_esc` | Esc key at AskUserQuestion | None (ungraceful) | All protocols — universal |
| `user_withdraw` | Explicit AskUserQuestion option | Yes (team shutdown, partial state) | Protocols with side-effect state only |
| Normal convergence | Completion predicate | Full | Per-protocol |

Principle: side effects require explicit answer types, not tool-level escape. When termination has consequences (team cleanup, partial contract), the exit path must be a selectable option the agent can act on. Protocols without termination side effects need only `user_esc`. Circular protocol interactions (e.g., boundary redefinition loops) are healthy dialogue — `user_esc` guarantees termination at every moment.

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

### Packaging Transformations

`scripts/package.js` applies non-trivial transforms when building release ZIPs:
- Renames `SKILL.md` → `Skill.md` (marketplace case convention)
- Strips frontmatter fields: `allowed-tools`, `license`, `compatibility`, `metadata`
- Overrides descriptions exceeding 200 chars (`frame`, `reflexion`)
- Excludes `agents/`, `commands/`, README files from ZIPs
- 500-line guideline per SKILL.md (warns if exceeded)

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
11. **onboard-sync**: Onboard SKILL.md Data Sources table, protocol count, Phase 0 category groupings, `references/scenarios.md` scenario blocks, `references/workflow.md` slash commands — all cross-checked against `PROTOCOL_FILES`
12. **precedence-linear-extension**: Verifies CANONICAL_PRECEDENCE total order is a valid linear extension of graph.json precondition partial order
13. **partition-invariant**: Verifies MODE STATE pairwise disjoint partition invariants — universe set and partition members exist as MODE STATE fields

## Delegation Constraint

- **Prothesis**: See SKILL.md for phase-specific delegation rules (Phase 0-2 main agent, Phase 3-4 agent team incl. routing)
- **Syneidesis/Hermeneia/Katalepsis**: No Task delegation—must run in main agent to call AskUserQuestion
- **Telos**: No Task delegation—must run in main agent to call AskUserQuestion
- **Horismos**: No Task delegation—must run in main agent to call AskUserQuestion
- **Aitesis**: No Task delegation—must run in main agent to call AskUserQuestion
- **Epharmoge**: No Task delegation—must run in main agent to call AskUserQuestion
- **Analogia**: No Task delegation—must run in main agent to call AskUserQuestion
- **Prosoche**: Phase -1 (Sub-A0 upstream routing, Sub-A materialization, Sub-B team coordination) and Phases 1-3 (Gate path) run in main agent (AskUserQuestion, Skill). Phase 0 delegates p=Low tasks to prosoche-executor subagent or team agents via Agent tool.
- **Report**: Phase 1 delegates to project-scanner subagent (single). Phase 2: Path A delegates session-analyzer in targeted mode, Path B in full mode. Main agent handles Phases 3-5.
- **Onboard**: All paths use inline Quick Scan (no subagents) for Phase 1. Deep pattern extraction belongs in Report. Main agent handles all phases. Quick path: Phases 0-1, 2a-2b, 4 (Trial triggers actual protocol execution in-session). Targeted path: Phases 0-6 (full learning experience).
- **Dashboard**: Phase 2 delegates to coverage-scanner subagent (single) for batch aggregation. Main agent handles Phases 1, 3, 4.
- **Preferences**: No Task delegation—must run in main agent to call AskUserQuestion. Main agent handles all phases (0-4).

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
| New protocol added | All of the above, plus: CLAUDE.md (overview, architecture, plugins, precedence, workflow, delegation), `static-checks.js` (`PROTOCOL_FILES`, `PRECEDENCE_FILES`, `CANONICAL_PRECEDENCE`, `CANONICAL_CLUSTERS`, `CANONICAL_PROTOCOLS` in `checkCrossRefScan`), ALL existing SKILL.md (precedence descriptions + distinction tables), onboard (`SKILL.md` Data Sources + `references/scenarios.md` + `references/workflow.md`), README.md + README_ko.md |
| Precedence change | CLAUDE.md (precedence section + concern cluster table), ALL SKILL.md precedence descriptions |
| Initiator taxonomy change | CLAUDE.md (initiator taxonomy), ALL SKILL.md (distinction tables + Rule #1), READMEs, `review-checklists.md` |
| Post-convergence suggestion pattern change | ALL 10 SKILL.md Post-Convergence sections, plugin.json version bumps |
