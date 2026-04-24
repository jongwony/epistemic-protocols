# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Epistemic Protocols is a layered system for human-AI collaboration: it inserts structured checkpoints at decision points so misalignment is surfaced early, judged explicitly, and adapted before it compounds into expensive downstream work.

In this repository, that machinery is realized as a Claude Code plugin marketplace for epistemic dialogue — each protocol structures a specific decision point: **FrameworkAbsent → FramedInquiry** (Prothesis), **GapUnnoticed → AuditedDecision** (Syneidesis), **IntentMisarticulated → ClarifiedIntent** (Hermeneia), **ResultUngrasped → VerifiedUnderstanding** (Katalepsis), **GoalIndeterminate → DefinedEndState** (Telos), **BoundaryUndefined → DefinedBoundary** (Horismos), **ContextInsufficient → InformedExecution** (Aitesis), **MappingUncertain → ValidatedMapping** (Analogia), **AbstractionInProcess → CrystallizedAbstraction** (Periagoge), **ExecutionBlind → SituatedExecution** (Prosoche), **ApplicationDecontextualized → ContextualizedExecution** (Epharmoge), **RecallAmbiguous → RecalledContext** (Anamnesis) during human-AI interaction.

## Architecture

```
epistemic-protocols/
├── .claude-plugin/marketplace.json    # Marketplace manifest
├── .claude/skills/verify/             # Project-level verification skill
│
│   # Each protocol plugin: .claude-plugin/plugin.json + skills/<verb>/SKILL.md
├── prothesis/       (/frame)          # multi-perspective investigation
├── syneidesis/      (/gap)            # gap surfacing
├── hermeneia/       (/clarify)        # intent clarification
├── katalepsis/      (/grasp)          # comprehension verification
├── telos/           (/goal)           # goal co-construction
├── horismos/        (/bound)          # epistemic boundary definition
├── aitesis/         (/inquire)        # context insufficiency inference
├── analogia/        (/ground)         # structural mapping validation
├── periagoge/       (/induce)         # in-process abstraction crystallization
├── prosoche/        (/attend)         # execution-time risk evaluation
├── epharmoge/       (/contextualize)  # application-context mismatch (conditional)
├── anamnesis/       (/recollect)      # vague recall → recognized context
│   ├── hooks/hooks.json               # SessionEnd hook: hypomnesis store writer
│   └── scripts/hypomnesis-write.mjs   # mjs harness + claude -p haiku extraction
├── epistemic-cooperative/             # Utility skills + agents
│   ├── agents/                        # project-scanner, session-analyzer, coverage-scanner, dimension-profiler
│   └── skills/                        # report, onboard, dashboard, introspect, catalog, compose, sophia, curses, write, artifact-review, review-ensemble
└── src/                               # Landing page (independent sub-project; React + Vite + Tailwind; EN/KO SPA)
```

**Component Types**:
- **Skills** (`skills/*/SKILL.md`): Full protocol/workflow definitions with YAML frontmatter; user-invocable by default (v2.1.0+)
- **Agents** (`agents/*.md`): Subagents for parallel task execution (epistemic-cooperative)

**Conventions**:
- Subagent naming: `plugin-name:agent-name` (e.g., `epistemic-cooperative:session-analyzer`)
- References directory: `skills/*/references/` for detailed documentation (optional per plugin)
- No external dependencies; Node.js standard library only (plugin code). `src/` landing page is an independent sub-project with its own `package.json`

**Plugin Encapsulation**: Runtime users interact with the packaged runtime contract: `Skill.md` (normative user contract) plus plugin description metadata (discovery/routing only, not full semantics). `.claude/rules/` prescriptive changes affecting protocol behavior must be compiled into `Skill.md` Rules sections. `Skill.md` must be self-contained — no external references (axiom identifiers, rule file paths, design-philosophy concepts, mission/vision docs) that require reading contributor documentation. Claim-strength boundaries for each runtime surface are tracked in [docs/runtime-dependency-ledger.md](docs/runtime-dependency-ledger.md).

**SKILL.md Formal Block Anatomy**: FLOW, MORPHISM, TYPES, PHASE TRANSITIONS, LOOP, TOOL GROUNDING, ELIDABLE CHECKPOINTS, MODE STATE, COMPOSITION (and optional blocks). Details: [docs/structural-specs.md](docs/structural-specs.md#skillmd-formal-block-anatomy)

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
| Periagoge | `/induce` | AbstractionInProcess → CrystallizedAbstraction |
| Prosoche | `/attend` | ExecutionBlind → SituatedExecution |
| Epharmoge | `/contextualize` | ApplicationDecontextualized → ContextualizedExecution |
| Anamnesis | `/recollect` | RecallAmbiguous → RecalledContext |

**Utility skills**: Epistemic Cooperative (`/catalog`, `/report`, `/onboard`, `/probe`, `/dashboard`, `/compose`, `/introspect`, `/sophia`, `/curses`, `/write`, `/artifact-review`, `/review-ensemble`), Verify (`/verify`). Triggers, flows, and detailed descriptions in each plugin's SKILL.md.

**Probe utility (deficit recognition fit review)**: `/probe` (epistemic-cooperative) surfaces multiple candidate deficit hypotheses with reverse-evidence conditions when the user is uncertain which protocol fits the present situation. Probe is a utility skill, not a 13th core protocol — it is intentionally absent from `graph.json`. Coexistence over Mirroring applies: `/probe` reads Anamnesis hypomnesis recall indices when available and routes the user's recognized choice to the selected core protocol; the relationship is prose-level, not a graph.json edge. Probe stands in structural homology with Anamnesis (RECOGNIZE operation family — past context recognition vs present-situation deficit recognition) but the homology is descriptive, not enforced as advisory edges. Stage 2 evidence-collection modality: probe is released as a usage-evidence instrument; architectural inscription is deferred until Stage 3 thresholds are met.

## Axioms

A1-A6 operational summaries auto-loaded via `.claude/rules/axioms.md`. Full definitions with rationale in the same file. Adversarial Anticipation (formerly A7) reclassified to Safeguard tier per audit-2026-04-11 #241 — see `.claude/rules/safeguards.md`.

## Design Philosophy

Prescriptive principles are modularized into `.claude/rules/` by Axiom Hierarchy tier and auto-loaded per-session:
- `.claude/rules/axioms.md` — A1-A6 foundational principles (MORE important as models improve)
- `.claude/rules/derived-principles.md` — principles derived from axiom combinations
- `.claude/rules/architectural-principles.md` — project structure decisions (axiom-independent)
- `.claude/rules/meta-principle.md` — Deficit Empiricism + Axiomatization Judgment Framework
- `.claude/rules/safeguards.md` — Safeguard-tier principles (LESS important as models improve)

## Protocol Precedence

### Epistemic Concern Clusters

Protocols grouped by primary concern, ordered by activation sequence within each cluster. Simultaneous activation follows cluster order; users can override. Information flow: `graph.json` (authoritative source).

| Concern | Protocols |
|---------|-----------|
| Planning | `/clarify` (Hermeneia), `/goal` (Telos), `/inquire` (Aitesis) |
| Analysis | `/frame` (Prothesis), `/ground` (Analogia), `/induce` (Periagoge) |
| Decision | `/gap` (Syneidesis) |
| Execution | `/attend` (Prosoche) |
| Verification | `/contextualize` (Epharmoge) |
| Cross-cutting | `/bound` (Horismos), `/recollect` (Anamnesis), `/grasp` (Katalepsis) |

**Cross-cutting**: `/bound` (Horismos) — BoundaryMap narrows scope for 5 downstream protocols via DAG-downstream advisory. `/recollect` (Anamnesis) — recalled context enriches 10 downstream protocols via advisory-only edges (no precondition weight). **Structural asymmetry**: Horismos sits downstream of the Hermeneia→Telos→Horismos DAG chain, so its 5 edges propagate through committed activation. Anamnesis has 10 advisory-only edges with no precondition enforcement — cardinality is larger but operational weight differs. `/grasp` (Katalepsis) — requires all to complete.

**Key graph relationships**:
- Preconditions (DAG-enforced): Hermeneia → Telos → Horismos; * → Katalepsis (includes Anamnesis and Periagoge via wildcard)
- Advisory hubs: Anamnesis → {Aitesis, Prothesis, Syneidesis, Hermeneia, Telos, Horismos, Prosoche, Analogia, Periagoge, Epharmoge}, Horismos → {Aitesis, Prothesis, Prosoche, Analogia, Syneidesis}, Prothesis → {Syneidesis, Telos, Aitesis, Analogia}, Telos → {Prothesis}, Hermeneia → {Aitesis, Periagoge}
- Suppression: Syneidesis ⊣ Aitesis (same scope), Aitesis ⊣ Epharmoge (pre+post stacking)

**Initiator taxonomy** (2-layer model):
- **Layer 1**: All protocols are user-invocable (slash command or description match). No AI detection at this layer.
- **Layer 2** (in-protocol heuristics): Behavior varies by initiator type:
  - **AI-guided**: AI evaluates condition and guides the process (Prothesis, Syneidesis, Telos, Horismos, Aitesis, Analogia, Periagoge, Epharmoge, Anamnesis)
  - **Hybrid**: Both user signal and AI detection can initiate; AI-detected trigger path requires user confirmation (Hermeneia)
  - **User-initiated**: User signals awareness of a deficit; no AI-guided activation (Katalepsis, Prosoche)
  - **User-invoked**: Deliberate practice; no deficit awareness required (Write)

## Development

- **Node.js 22+** required (`zlib.crc32` used in packaging; CI pins Node 22)
- **No package.json** — Node.js standard library only (exception: `src/package.json` for landing page)
- Static checks: `node .claude/skills/verify/scripts/static-checks.js .`
- Tests: `node --test scripts/package.test.js`
- Packaging: `node scripts/package.js [--dry-run]` — produces `dist/*.zip` + `dist/release-notes.md`
- Changelog: `node scripts/generate-changelog.js` — git conventional commit parser between tags
- Installer: `scripts/install.sh` — curl-based marketplace installer (README.md is source of truth for install set)

## CI/CD

Four GitHub Actions workflows (`.github/workflows/`):

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `release.yml` | Tag push (`v*`) | Package → ZIP integrity → `gh release create --draft` |
| `claude-code-review.yml` | PR opened/ready | 3-stage pipeline: Sonnet review → jq extraction → Haiku comment |
| `claude-epistemic-review.yml` | PR with protocol changes | Multi-perspective analysis (Category Theory, Type Theory, Operational Semantics) + gap scan |
| `verify-runtime-contract.yml` | PR with runtime-contract changes, manual dispatch | Tests + static checks + packaging dry-run for packaged `Skill.md` / metadata boundary |

Details: [docs/ci-review-pipeline.md](docs/ci-review-pipeline.md)

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

16 static checks: json-schema, notation, directive-verb, xref, structure, tool-grounding, version-staleness, graph-integrity, spec-vs-impl, cross-ref-scan, onboard-sync, precedence-linear-extension, partition-invariant, catalog-sync, gate-type-soundness, artifact-self-containment. `artifact-self-containment` validates the packaged runtime contract view (`Skill.md` + plugin description metadata + packaged support entries) rather than source prose alone. Details: [docs/verification.md](docs/verification.md)

## Delegation Constraint

- **Prothesis**: See SKILL.md for phase-specific delegation rules (Phase 0-2 main agent, Phase 3-4 agent team incl. routing)
- **Syneidesis/Hermeneia/Katalepsis**: No Task delegation—must run in main agent (user-facing gates require main agent context)
- **Telos**: No Task delegation—must run in main agent (user-facing gates require main agent context)
- **Horismos**: No Task delegation—must run in main agent (user-facing gates require main agent context)
- **Aitesis**: No Task delegation—must run in main agent (user-facing gates require main agent context)
- **Epharmoge**: No Task delegation—must run in main agent (user-facing gates require main agent context)
- **Analogia**: No Task delegation—must run in main agent (user-facing gates require main agent context)
- **Periagoge**: No Task delegation—must run in main agent (user-facing gates require main agent context)
- **Prosoche**: Phase -1 (Sub-A0 upstream routing, Sub-A materialization, Sub-B team coordination) and Phases 1-3 (Gate path) run in main agent (gate interaction, Skill). Phase 0 delegates p=Low tasks to prosoche-executor subagent or team agents via Agent tool.
- **Anamnesis**: No Task delegation—must run in main agent (user-facing gates require main agent context). SessionEnd + PreCompact hooks (`anamnesis/scripts/hypomnesis-write.mjs`) operate outside protocol flow, extracting session recall index via `claude -p haiku` harness.
- **Report**: Phase 1 delegates to project-scanner subagent (single). Phase 2: Path A delegates session-analyzer in targeted mode, Path B in full mode. Main agent handles Phases 3-5.
- **Onboard**: All paths use inline Quick Scan (no subagents) for Phase 1. Deep pattern extraction belongs in Report. Main agent handles all phases. Quick path: Phases 0-1, 2a-2b, 4 (Trial triggers actual protocol execution in-session). Targeted path: Phases 0-6 (full learning experience).
- **Dashboard**: Phase 2 delegates to coverage-scanner subagent (single) for batch aggregation. Main agent handles Phases 1, 3, 4.
- **Introspect**: Phase 1 launches 3 ad-hoc inline Task(general-purpose) invocations in parallel (rules/config collection, usage stats collection, session behavior collection). Main agent handles Phase 2 (5-dimension analysis, Strength-Shadow, normative-descriptive conflict surface + user dialogue gate). Phase 3 main agent optionally composes `/analogia:ground`. Phase 4 main agent generates HTML output; `references/report-guide.md` used for CSS/component templates.
- **Catalog**: No delegation—text-only output, main agent handles all. Read tool for scenarios.md detail mode only.
- **Compose**: No delegation—main agent handles all phases. Read/Grep for graph.json and ELIDABLE CHECKPOINTS extraction, Write for template generation.
- **Sophia**: Phase 1 delegates to coverage-scanner then dimension-profiler subagents (serial chain). Main agent handles Phases 2-4 (matching, presentation, report).
- **Curses**: Phase 1 delegates to coverage-scanner then dimension-profiler subagents (serial chain). Main agent handles Phases 2-4 (analysis, recommendations, report).
- **Write**: No delegation—main agent handles all phases. Composes /frame (Prothesis) for perspective analysis; the composed protocol's delegation rules apply when invoked.
- **Artifact Review**: No delegation—main agent handles all pipeline phases. Composes /inquire × /gap × /contextualize; sub-protocol delegation rules apply when invoked. Channel-loop runs as a background Bun process (not Task delegation).
- **Review Ensemble**: Main agent handles all phases. Phase 2 launches Codex CLI in background (Bash run_in_background) and invokes `prothesis:frame` foreground via Skill(); composed protocol's delegation rules apply when invoked. Fallback mode spawns two inline Agent subagents in parallel when `prothesis:frame` is unavailable.

## Conventions

Git and editing rules auto-loaded via `.claude/rules/editing-conventions.md`.

Co-change patterns tracked in [docs/co-change.md](docs/co-change.md). Key: any protocol change requires plugin.json version bump + `/verify`.
