# `.claude/principles/` — Demotion Zone

**Purpose**: Lazy-load location for prescriptive content demoted from `.claude/rules/`. Per Tier Factorization, this directory realizes the **o-tier** axis (operational/runtime invocation frequency) at T2-T3 — sections invoked at authoring/verify/axiom-evolution time, not per-turn.

The Claude Code harness does not auto-load files in this directory. Files here are fetched via Read/Grep when relevant. Other AI clients can adopt the same content via their own load conventions; the content itself is substrate-agnostic.

## Distinction from `.claude/rules/`

| Location | o-tier | Mechanism | Invocation frequency |
|----------|--------|-----------|----------------------|
| `.claude/rules/` | T1 | Auto-loaded by harness at session start | Per-turn |
| `.claude/principles/` | T2-T3 | Lazy-load via Read/Grep | Per-session / per-authoring |

The split realizes the orthogonal e-tier × o-tier mapping established in this project (axioms.md A2 §A5 coordination + PR #270/#273 reclassification ⊥ compression + PR introducing this directory). e-tier (epistemological status: Axiom/Derived/Architectural/Safeguard/Meta) is realized by file content; o-tier (operational frequency) is realized by directory location.

## Index

| File | Source | Demoted sections |
|------|--------|------------------|
| `architectural-principles.md` | `.claude/rules/architectural-principles.md` | Unix Philosophy Homomorphism, Session Text Composition, Cross-Session Knowledge Composition, Dual Advisory Layer, Coexistence over Mirroring, Three-Tier Termination, Audience Reach, Utility Skills delegation, Direction over Accumulated Workload |
| `meta-principle.md` | `.claude/rules/meta-principle.md` | Stage 1 / Stage 2 detail, Anti-inflation Clause, Operational Tests, Axiomatization Judgment Framework (Core Principle, Promotion Criteria, Demotion Criteria, Principle Evolution Process, Tension-Accumulation Threshold) |

## Demotion Ledger

| Section | Source file | Demotion date | Reason |
|---------|-------------|---------------|--------|
| Unix Philosophy Homomorphism | `architectural-principles.md` | 2026-04-27 | T2 — invoked at protocol design time, not per-turn |
| Session Text Composition (incl. Stigmergy signal constraint) | `architectural-principles.md` | 2026-04-27 | T2 — inter-protocol architecture decision, infrequent invocation |
| Cross-Session Knowledge Composition (incl. Formal layer boundary, Pollution caveat) | `architectural-principles.md` | 2026-04-27 | T2-T3 — Anamnesis hypomnesis design context, narrow scope |
| Dual Advisory Layer (incl. Advisory cycle convergence, Emergent boundary annotations, Definitional-Observational convergence, Authoring checkpoint) | `architectural-principles.md` | 2026-04-27 | T2-T3 — graph.json + nudge architecture, authoring guidance |
| Coexistence over Mirroring | `architectural-principles.md` | 2026-04-27 | T2 — plugin design boundary, infrequent invocation |
| Three-Tier Termination | `architectural-principles.md` | 2026-04-27 | T2 — protocol exit design, per-protocol authoring |
| Audience Reach (incl. Session-level observer exception, Bidirectional Reach) | `architectural-principles.md` | 2026-04-27 | T2-T3 — plugin encapsulation context, infrequent |
| Utility Skills — Adversarial Anticipation Delegation | `architectural-principles.md` | 2026-04-27 | T3 — utility skill authoring guidance only |
| Direction over Accumulated Workload (incl. Bounded by Deficit Empiricism) | `architectural-principles.md` | 2026-04-27 | T2 — contributor authoring decision principle |
| Stage 1 — Compile (Pre-submit Structural Fit) | `meta-principle.md` | 2026-04-27 | T2 — invoked when proposing new protocols/features |
| Stage 2 — Runtime (Post-deploy Use-corroboration) | `meta-principle.md` | 2026-04-27 | T2 — sessions evaluating Stage 2 retention |
| Relation to Axiomatization Judgment Framework | `meta-principle.md` | 2026-04-27 | T3 — tier-evolution time only |
| Anti-inflation Clause | `meta-principle.md` | 2026-04-27 | T2 — guard against frustration-driven creation |
| Operational Tests | `meta-principle.md` | 2026-04-27 | T3 — authoring guidance detail |
| Axiomatization Judgment Framework (Core Principle, Promotion / Demotion Criteria, Principle Evolution Process) | `meta-principle.md` | 2026-04-27 | T2-T3 — axiom-evolution time, very rare |
| Tension-Accumulation Threshold | `meta-principle.md` | 2026-04-27 | T2 — Circular Return trigger criterion |

## Promotion Watch List

Sections accumulating use evidence that warrants reconsideration for promotion back to `.claude/rules/`. Initially empty — populated as Stage 2 corroboration accumulates.

Scope: this list tracks **demoted content** (sections originally in `.claude/rules/` that moved here per the Demotion Ledger above) accumulating use evidence sufficient for re-promotion. Stage 1 conjectures newly inscribed in SKILL.md awaiting first-time Stage 2 corroboration are tracked separately in the Stage 2 Corroboration Watch below.

| Section | Source | Use evidence | Proposed promotion date |
|---------|--------|--------------|-------------------------|
| _(none yet)_ | — | — | — |

## Stage 2 Corroboration Watch

Stage 1 conjectures inscribed in SKILL.md or Skill descriptions awaiting first-time Stage 2 use-corroboration. Distinct from the Promotion Watch List — entries here have not previously occupied `.claude/rules/`; they are first-time conjectures whose viability depends on accumulated use evidence per Deficit Empiricism.

| Conjecture | Source | Stage 2 mechanism | Inscribed date |
|------------|--------|-------------------|----------------|
| Hypothesis-Surface as Constitutive Output | `epistemic-cooperative/skills/probe/SKILL.md` (Phase 2 morphism simplification: typed Qc → free-response Constitution) | TBD (separate design round; candidates: /probe free-response disposition extraction post-hoc audit hook, hypomnesis misfit.md writer + misfit accumulation) | 2026-04-27 |
| Tertiary pattern operational fidelity | `docs/structural-specs.md` Tertiary pattern (consumption-half operative across 11 consuming protocols; Aitesis carries empirical-evidence sophistication per `axioms.md` A2 Citable axis, others use heuristic-input pattern per Pollution caveat — intentional asymmetry, no uniform extension) | Stage 2 monitoring: (1) per-protocol gate-judgment override frequency as pollution-resistance signal across the 10 heuristic-input protocols; (2) Aitesis-specific staleness-guard activation frequency and false-positive rate; (3) cross-protocol enrichment correlation with convergence quality; (4) any pressure to extend Aitesis-style evidence-source machinery to other protocols treated as a misclassification signal (Constitution-as-Extension), surface for review rather than silent extension. | 2026-04-30 |
| Rule 20 compression operational fidelity | `aitesis/skills/inquire/SKILL.md` Rule 20 (3-mode rationalization-path taxonomy compressed to "Cite-or-observe" general principle per PR #270 XC3 precedent) | Stage 2 monitoring: observe whether the compressed form preserves cite-or-observe guard fidelity in the absence of explicit (A) Verifiability / (B) EmpiricallyObservable / (C) ReadOnlyVerifiable shortcut labels. Surface re-expansion if violation pattern emerges. | 2026-04-30 |
| `/steer` utility skill (Periagoge family specialization) | `epistemic-cooperative/skills/steer/SKILL.md` Stage 2 evidence-collection modality (CLAUDE.md §Steer utility) — released as usage-evidence instrument; architectural inscription (graph.json placement, advisory edges, formal lineage to `/induce`) deferred | Stage 2 monitoring: variation-stable retention evidence accumulation across UpdatedProjectProfile / NoUpdateNote / DiffArtifact emissions; calibration-drift correction effectiveness across multiple project profiles; meta-circle stability (1st-order recalibration vs. 2nd-order Steer evolution). N=1 dogfooding caveat per emitted artifact. | 2026-04-26 |
| `/misuse` utility skill (retrospective contract violation detector) | `epistemic-cooperative/skills/misuse/SKILL.md` Stage 2 evidence-collection modality (CLAUDE.md §Misuse utility) — observation-only artifact; architectural inscription deferred; target protocols fixed at `/ground` and `/induce` for v1.0 | Stage 2 monitoring: violation-recognition verdict distribution (was-violation / was-legitimate); cross-protocol violation classes appearance frequency (currently deferred until evidence accumulates); `misfit.md` substrate retention pattern; live-nudge design pressure as expansion signal. | 2026-04-27 |
| `/crystallize` + `/rehydrate` HFT continuity pair | `epistemic-cooperative/skills/{crystallize,rehydrate}/SKILL.md` Stage 2 evidence-collection modality (CLAUDE.md §Crystallize / Rehydrate utility) — auto-hooks (SessionEnd / PreCompact / SessionStart) deferred; HFT promotion to normative substrate format deferred | Stage 2 monitoring: cross-session inscription accumulation across user-context variation; first-utterance Vorverständnis fidelity (does fresh session prime equivalently to originating session?); auxiliary substrate boundary integrity (no embedding of `MEMORY.md` body or hypomnesis sub-index body); user-invoked invocation frequency as auto-hook readiness signal. N=1 dogfooding caveat per emitted HFT and convergence trace. | 2026-04-27 |
| HFT four-layer format spec | `epistemic-cooperative/skills/{crystallize,rehydrate}/references/hft-format.md` Stage 1 conjecture (single dogfooding session crystallizing four-layer abstraction) — promotion as normative substrate format for other utilities deferred | Stage 2 monitoring: layer-boundary stability across inscriptions (Surface Text replace / Wirkungsgeschichte append / Reference Shells in-place / Excluded topology-only); 1-page Surface Text length constraint adherence; structural fit when applied to non-Crystallize/Rehydrate domains as promotion-readiness signal. | 2026-04-27 |
| Project-profile bounded zone `(extension)` specialization | `.claude/rules/project-profile.md` + `.claude/rules/project-profile-calibration.md` Stage 1 conjecture — "in-principle delegatable" capability for Telos GoalContract / Horismos BoundaryMap / Syneidesis decision pattern / Hermeneia Phase 2 articulation; operational realization (split `(extension)` TOOL GROUNDING entries) deferred per-protocol | Stage 2 monitoring: per-protocol Standing-authority pre-commitment pattern emergence; retry-semantics evidence (Hermeneia Phase 2 bounded regret confirmation across multiple invocations); profile-layer enumeration vs. protocol-internal Constitution checkpoint redundancy as migration-readiness signal. | 2026-04-25 |

## Promotion Criteria

A demoted section is a candidate for promotion back to `.claude/rules/` when:

1. **Per-turn invocation evidence accumulates** — sessions repeatedly fetch the same section via Read/Grep across multiple variation contexts (instance, user profile, platform, session type)
2. **Cross-reference density increases** — newer SKILL.md or rules files cite the section frequently, suggesting load-bearing role at per-turn level
3. **Verify-time invocation becomes per-session** — what was authoring-time-only now fires in routine `/verify` runs

The demotion is a **conjecture**; promotion via use is the Stage 2 corroboration path. Promotion is not automatic — it requires manual review of the use signals, an entry in this README's Promotion Watch List, and a follow-up PR moving content back to rules/.

## Philosophy

This directory is not an archive (content remains canonical and current) and not a docs/ replacement (docs/ holds investigation/research products, not prescriptive principles). It is a **Tier Factorization o-tier zone** — same content, different invocation frequency, different load mechanism.

The demotion zone reduces auto-load memory pressure (Epistemic Cost Topology applied to the loading dimension) while preserving content reversibility — promotion back to `.claude/rules/` is a single PR away.
