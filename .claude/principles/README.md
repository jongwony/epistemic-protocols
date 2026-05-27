# `.claude/principles/` — Demotion Zone

**Purpose**: Lazy-load location for prescriptive content demoted from `.claude/rules/`. Per Tier Factorization, this directory realizes the **o-tier** axis (operational/runtime invocation frequency) at T2-T3 — sections invoked at authoring/verify/axiom-evolution time, not per-turn.

The Claude Code harness does not auto-load files in this directory. Files here are fetched via Read/Grep when relevant. Other AI clients can adopt the same content via their own load conventions; the content itself is substrate-agnostic.

## Distinction from `.claude/rules/`

| Location | o-tier | Mechanism | Invocation frequency |
|----------|--------|-----------|----------------------|
| `.claude/rules/` | T1 | Auto-loaded by harness at session start | Per-turn |
| `.claude/principles/` | T2-T3 | Lazy-load via Read/Grep | Per-session / per-authoring |

The split realizes the orthogonal e-tier × o-tier mapping established in this project (axioms.md A2 §A5 coordination + PR #270/#273 reclassification ⊥ compression + PR introducing this directory). e-tier (epistemological status: Axiom/Derived/Architectural/Safeguard) is realized by file content; o-tier (operational frequency) is realized by directory location.

## Index

| File | Source | Demoted sections |
|------|--------|------------------|
| `architectural-principles.md` | `.claude/rules/architectural-principles.md` | Epistemic Cost Topology, Unix Philosophy Homomorphism, Session Text Composition, Cross-Session Knowledge Composition, Dual Advisory Layer, Coexistence over Mirroring, Three-Tier Termination, Audience Reach, Utility Skills delegation, Direction over Accumulated Workload |
| `hermeneutic-cycle.md` | `docs/structural-specs.md` | Pattern over Vocabulary (Gadamerian formal-block mapping) + 6 surface catalog (Primary / Secondary / Tertiary / Inter-version / Inter-agent / Operational axis) |
| `safeguards.md` | `.claude/rules/safeguards.md` (whole file relocated) | Actionable revision criterion, Literature Application Discipline, Rule Classification Framework, Adversarial Anticipation, White Bear Avoidance, Gate Type Soundness — all authoring/audit/verify-time; runtime-critical Gate Integrity guards were previously inlined into `axioms.md` |

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
| Direction over Accumulated Workload | `architectural-principles.md` | 2026-04-27 | T2 — contributor authoring decision principle |
| Pattern over Vocabulary (Gadamerian formal-block mapping + Primary/Secondary surfaces) | `structural-specs.md` | 2026-05-14 | T2-T3 — extracted to dedicated `hermeneutic-cycle.md` as canonical home; structural-specs slimmed to gate runtime semantics only |
| Safeguards (whole file) | `safeguards.md` | 2026-05-27 | T2-T3 — every section is authoring/audit/verify-time (Rule Classification Framework methodology, Literature Application Discipline, Adversarial Anticipation authoring guards, Gate Type Soundness verify check); no per-turn runtime dependency after `axioms.md` inlined the Gate Integrity guards. White Bear's prior auto-load dependency converted to on-demand Read in `white-bear` SKILL.md |
| Epistemic Cost Topology | `architectural-principles.md` | 2026-05-27 | Recurring framing-contamination: T1 auto-load made it top-of-mind, entering analyses as a one-sided cost-only prior (observed: surface-invariance pre-loaded into delegation prompts, biasing toward minimality before independent root-need assessment). Reverses prior deliberate T1 retention; non-reducible content (project-profile-calibration depends on the meta/execution asymmetry) → demoted, not deleted. |

## Philosophy

This directory is not an archive (content remains canonical and current) and not a docs/ replacement (docs/ holds investigation/research products, not prescriptive principles). It is a **Tier Factorization o-tier zone** — same content, different invocation frequency, different load mechanism.

The demotion zone reduces auto-load memory pressure (Epistemic Cost Topology applied to the loading dimension) while keeping the demoted content canonical and editable. The split is one-directional by default: there is no formal re-promotion pathway. A demoted section returning to `.claude/rules/` is a contributor-judgment decision per case, not an inscribed criterion.
