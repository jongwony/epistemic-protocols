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
│   └── skills/                        # report, onboard, dashboard, introspect, catalog, compose, sophia, curses, write, artifact-review, review-ensemble, steer, misuse
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

**SKILL.md Formal Block Anatomy**: FLOW, MORPHISM, TYPES, PHASE TRANSITIONS, LOOP, TOOL GROUNDING, MODE STATE, COMPOSITION (and optional blocks). Details: [docs/structural-specs.md](docs/structural-specs.md#skillmd-formal-block-anatomy)

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

**Utility skills**: Epistemic Cooperative (`/catalog`, `/report`, `/onboard`, `/probe`, `/dashboard`, `/compose`, `/introspect`, `/sophia`, `/curses`, `/write`, `/artifact-review`, `/review-ensemble`, `/steer`, `/misuse`, `/crystallize`, `/rehydrate`), Verify (`/verify`). Triggers, flows, and detailed descriptions in each plugin's SKILL.md.

**Probe utility (deficit recognition fit review)**: `/probe` (epistemic-cooperative) surfaces multiple candidate deficit hypotheses with reverse-evidence conditions when the user is uncertain which protocol fits the present situation. Probe is a utility skill, not a 13th core protocol — it is intentionally absent from `graph.json`. Coexistence over Mirroring applies: `/probe` may enrich scans with prior `misfit.md` records via opt-in cross-session read (default scope is current session; cross-session recall requires explicit user confirmation) and routes the user's recognized choice to the selected core protocol; the relationship is prose-level, not a graph.json edge. Probe stands in structural homology with Anamnesis (RECOGNIZE operation family — past context recognition vs present-situation deficit recognition) but the homology is descriptive, not enforced as advisory edges. Stage 2 evidence-collection modality: probe is released as a usage-evidence instrument; architectural inscription is deferred until Stage 2 variation-stable retention evidence accumulates. Verification framework limitations (drop-in feasibility vs endpoint well-defined-ness — two-axis distinction) tracked in [docs/probe-verification-framework.md](docs/probe-verification-framework.md) — N=1 instance L4a (PR #288), Stage 2 corroboration pending.

**Steer utility (project profile recalibration via calibration drift audit)**: `/steer` (epistemic-cooperative) is a Periagoge family specialization — it audits a target session for Cognitive Partnership Move calibration drift (Constitution overapplication, Extension misapplication, existing-profile drift), surfaces per-cluster evidence for user-constituted verdict, then writes an updated user-global (`~/.claude/rules/project-profile.md`) or project-local (`.claude/rules/project-profile.md`) project-profile rule file via hermeneutic Circular Return. Steer is a utility skill, not a 13th core protocol — intentionally absent from `graph.json`. Specializes `/induce` along two axes (instances constrained to session calibration moves; output constrained to writable rule inscription) without modifying base `/induce` semantics. The triple structure with `/probe` (prospective fit) and retrospective contract-integrity utilities — prose-level, not a graph.json edge — is described in the skill's Distinction section. Stage 2 evidence-collection modality: released as a usage-evidence instrument; architectural inscription (advisory edges, formal lineage to `/induce`) is deferred until Stage 2 variation-stable retention evidence accumulates. N=1 dogfooding caveat applies to all emitted artifacts (UpdatedProjectProfile, NoUpdateNote, DiffArtifact). Self-referential meta-circle: Steer recalibrates the project profile (1st-order Circular Return) and is itself subject to Stage 2 evolution (2nd-order Circular Return). Pre-write timestamped backup is mandatory — rollback is a single `mv` command.

**Misuse utility (retrospective contract violation detector)**: `/misuse` (epistemic-cooperative) scans past sessions for retrospective protocol contract violations across `/ground` (Sₐ confabulation) and `/induce` (stereotype misconflation) invocations, surfaces structured violation records, and routes the user's constituted verdict via per-invocation recognition. Misuse is a utility skill, not a 14th core protocol — intentionally absent from `graph.json`. Default scope is current session; cross-session and cross-project scans require explicit user confirmation in Phase 0. Phase 4 recognition is verification-category (Anamnesis Phase 2 homologous, past-identity synthesis) — excluded from Differential Future Requirement; the option set encodes a 1-correct verdict structure (was-violation / was-legitimate) by purpose. Observation-only artifact: no auto-rewrite, no auto-reroute (Rule 7); calibration metadata in the emitted ViolationReview is for future live-nudge design only. Pairs with `/probe` as time-axis dual (probe = prospective fit recognition; misuse = retrospective contract audit) and shares the opt-in `misfit.md` substrate as auxiliary evidence. Stage 2 evidence-collection modality with N=1 dogfooding caveat surfaced in every artifact; architectural inscription deferred until Stage 2 variation-stable retention evidence accumulates.

**Crystallize / Rehydrate utility (HFT cross-session continuity pair)**: `/crystallize` (writer) and `/rehydrate` (reader) (epistemic-cooperative) form a cross-session continuity pair operating on the **Horizon-Fusion Text (HFT)** format — a four-layer Markdown file (Surface Text · Wirkungsgeschichte · Reference Shells · Excluded) specified at `epistemic-cooperative/skills/crystallize/references/hft-format.md`. The pair reframes session handoff from operational data preservation to interpretive continuity inscription: a fresh session reads the inscribed HFT once and is primed to first-utter from the same Vorverständnis (pre-understanding) as the originating session. The format collapses prior multi-substrate handoff patterns (plan + memory addendum + index + tasks) into a single Markdown file; auxiliary substrates (auto-memory `MEMORY.md`, hypomnesis sub-index) remain operationally distinct and reachable only via Reference Shell anchors that the user explicitly invokes through `/inquire` or `/recollect`. Asymmetric refresh policy: Surface Text replaces per stage (Sache must remain live); Wirkungsgeschichte appends per stage (effective-historical consciousness accumulates); Reference Shells update in place; Excluded changes only when topology changes. Both skills are user-invoked only — no auto-hooks (SessionEnd, PreCompact, SessionStart) in the present GoalContract; hook integration is deferred to a future stage. Both skills are utility skills, not 13th/14th core protocols — intentionally absent from `graph.json`. Stage 2 evidence-collection modality with N=1 dogfooding caveat surfaced in every emitted HFT and convergence trace; architectural inscription (auto-hooks, normative substrate format promotion for other utilities) is deferred until Stage 2 variation-stable retention evidence accumulates. Drawn from Pocock's Design Concept and Ubiquitous Language framing combined with Gadamer's Horizontverschmelzung and Wirkungsgeschichte — the latter is hermeneutic kinship rather than external borrowing, given the project's Hermeneia (ἑρμηνεία) lineage.

## Axioms

A1-A6 operational summaries auto-loaded via `.claude/rules/axioms.md`. Full definitions with rationale in the same file. Adversarial Anticipation (formerly A7) reclassified to Safeguard tier per audit-2026-04-11 #241 — see `.claude/rules/safeguards.md`.

## Design Philosophy

Prescriptive principles partition along Tier Factorization's o-tier (operational invocation frequency) into `.claude/rules/` (T1, auto-loaded per-session) and `.claude/principles/` (T2-T3, lazy-loaded via Read/Grep at authoring/verify time):
- `.claude/rules/axioms.md` — A1-A6 foundational principles (MORE important as models improve)
- `.claude/rules/derived-principles.md` — principles derived from axiom combinations
- `.claude/rules/architectural-principles.md` — Epistemic Cost Topology + Epistemic Completeness Boundary + Tier Factorization (T1, per-turn); other architectural principles live in `.claude/principles/architectural-principles.md` (T2-T3)
- `.claude/rules/meta-principle.md` — Deficit Empiricism intro + Philosophical grounding (T1, per-turn); Stage 1/2 detail + Axiomatization Judgment Framework live in `.claude/principles/meta-principle.md` (T2-T3, axiom-evolution time)
- `.claude/rules/safeguards.md` — Safeguard-tier principles (LESS important as models improve)
- `.claude/rules/project-profile-calibration.md` — Cognitive Partnership Move calibration mechanism (six profile variables → Extension/Constitution default)
- `.claude/rules/project-profile.md` — this project's profile declaration
- `.claude/principles/` — demotion zone for T2-T3 prose; see `.claude/principles/README.md` for index, demotion ledger, and promotion-via-use criteria. Demotion is a Stage 1 conjecture; Stage 2 use corroboration governs promotion back to `.claude/rules/`.

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
- **Plugin code: Node.js standard library only** — no runtime dependencies. Root `package.json` carries husky as the only devDependency (pre-commit activation); `src/package.json` for landing page.
- Static checks: `node .claude/skills/verify/scripts/static-checks.js .`
- Tests: `node --test scripts/package.test.js`
- Packaging: `node scripts/package.js [--dry-run]` — produces `dist/*.zip` + `dist/release-notes.md`
- Changelog: `node scripts/generate-changelog.js` — git conventional commit parser between tags
- Installer: `scripts/install.sh` — curl-based marketplace installer (README.md is source of truth for install set)
- Pre-commit hook: `.husky/pre-commit` runs tests + static checks + packaging dry-run when staged paths touch the runtime contract (per-protocol `SKILL.md`, `plugin.json`, `references/`, verify scripts, package scripts). Activated automatically by `npm install` via husky's prepare script.

## CI/CD

Three GitHub Actions workflows (`.github/workflows/`):

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `release.yml` | Tag push (`v*`) | Package → ZIP integrity → `gh release create --draft` |
| `claude-code-review.yml` | PR opened/ready | 3-stage pipeline: Sonnet review → jq extraction → Haiku comment |
| `claude-epistemic-review.yml` | PR with protocol changes | Multi-perspective analysis (Category Theory, Type Theory, Operational Semantics) + gap scan |

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

17 static checks: json-schema, notation, directive-verb, xref, structure, tool-grounding, version-staleness, graph-integrity, spec-vs-impl, cross-ref-scan, onboard-sync, precedence-linear-extension, partition-invariant, catalog-sync, gate-type-soundness, artifact-self-containment, single-axis-soundness. `artifact-self-containment` validates the packaged runtime contract view (`Skill.md` + plugin description metadata + packaged support entries) rather than source prose alone. `single-axis-soundness` enforces `TOOL GROUNDING`'s `(constitution)`/`(extension)` markers as the sole runtime annotation axis across live `*.md` files. Details: [docs/verification.md](docs/verification.md)

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
- **Introspect**: Phase 1 launches 3 ad-hoc inline Task(general-purpose) invocations in parallel (rules/config collection, usage stats collection, session behavior collection). Main agent handles Phase 2 (5-dimension analysis, Strength-Shadow, normative-descriptive conflict surface) — emits analysis as text output with a visible red-line discovery line; corrections via free response at subsequent turns regenerate affected downstream sections. Phase 3 main agent optionally composes `/analogia:ground`. Phase 4 main agent generates HTML output; `references/report-guide.md` used for CSS/component templates.
- **Catalog**: No delegation—text-only output, main agent handles all. Read tool for scenarios.md detail mode only.
- **Compose**: No delegation—main agent handles all phases. Read/Grep for graph.json and TOOL GROUNDING extraction, Write for template generation.
- **Sophia**: Phase 1 delegates to coverage-scanner then dimension-profiler subagents (serial chain). Main agent handles Phases 2-4 (matching, presentation, report).
- **Curses**: Phase 1 delegates to coverage-scanner then dimension-profiler subagents (serial chain). Main agent handles Phases 2-4 (analysis, recommendations, report).
- **Write**: No delegation—main agent handles all phases. Composes /frame (Prothesis) for perspective analysis; the composed protocol's delegation rules apply when invoked.
- **Artifact Review**: No delegation—main agent handles all pipeline phases. Composes /inquire × /gap × /contextualize; sub-protocol delegation rules apply when invoked. Channel-loop runs as a background Bun process (not Task delegation).
- **Review Ensemble**: Main agent handles all phases. Phase 2 launches Codex CLI in background (Bash run_in_background) and invokes `prothesis:frame` foreground via Skill(); composed protocol's delegation rules apply when invoked. Fallback mode spawns two inline Agent subagents in parallel when `prothesis:frame` is unavailable.
- **Crystallize**: No delegation—main agent handles all phases (Phase 0-6). User-facing Constitution interactions at Phase 2-5 (Surface Text, Wirkungsgeschichte, Reference Shells, final approval) require main agent context. Phase 4 reference-shell enumeration uses Bash for `git diff --name-only` and `gh pr view`; Phase 6 inscription uses Write + TaskCreate. No auto-hooks in present GoalContract.
- **Rehydrate**: No delegation—main agent handles all phases (Phase 0-7). User-facing Constitution interactions at Phase 0 (multi-candidate HFT selection), Phase 5 (resumption path), and Phase 6 (readiness approval) require main agent context. Phase 0-4 use Read/Glob/Bash/TaskList for HFT discovery, frontmatter verification, and anchor task filtering. Phase 5 may optionally hand off anchor tasks to `/attend` via Skill() invocation when the user selects HandOffToAttend; that composition's delegation rules apply when invoked. No auto-fetch of Reference Shell targets — auxiliary substrate access is gated on explicit user `/inquire` or `/recollect` invocation.

## Conventions

Git and editing rules auto-loaded via `.claude/rules/editing-conventions.md`.

Co-change patterns tracked in [docs/co-change.md](docs/co-change.md). Key: any protocol change requires plugin.json version bump + `/verify`.
