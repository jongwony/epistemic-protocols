# `.claude/principles/` — Demotion Zone

**Purpose**: Lazy-load location for prescriptive content demoted from `.claude/rules/`. Per Tier Factorization, this directory realizes the **o-tier** axis (operational/runtime invocation frequency) at T2-T3 — sections invoked at authoring/verify/axiom-evolution time, not per-turn.

The Claude Code harness does not auto-load files in this directory. Files here are fetched via Read/Grep when relevant. Other AI clients can adopt the same content via their own load conventions; the content itself is substrate-agnostic.

## Distinction from `.claude/rules/`

| Location | o-tier | Mechanism | Invocation frequency |
|----------|--------|-----------|----------------------|
| `.claude/rules/` | T1 | Auto-loaded by harness at session start | Per-turn |
| `.claude/principles/` | T2-T3 | Lazy-load via Read/Grep | Per-session / per-authoring |

This table is the canonical statement of the load mechanism in this repository; other files point here rather than restating it.

The split realizes the orthogonal e-tier × o-tier mapping established in this project (`.claude/principles/architectural-principles.md` §Authority Mode's A5 coordination note). e-tier (epistemological status: Axiom/Derived/Architectural/Safeguard) is realized by file content; o-tier (operational frequency) is realized by directory location.

## Index

| File | Current contents |
|------|------------------|
| `architectural-principles.md` | Tier Factorization, Epistemic Cost Topology, Unix Philosophy Homomorphism, Session Text Composition, Cross-Session Knowledge Composition, Task Externalization Boundary, Reference over Copy, Dual Advisory Layer, Coexistence over Mirroring, Three-Tier Termination, Plugin Encapsulation, Utility Skills delegation |
| `hermeneutic-cycle.md` | Pattern over Vocabulary (Gadamerian formal-block mapping) + 6 surface catalog (Primary / Secondary / Tertiary / Inter-version / Inter-agent / Operational axis) |
| `safeguards.md` | Actionable revision criterion, Literature Application Discipline, Rule Classification Framework, Adversarial Anticipation, White Bear Avoidance, Gate Type Soundness — all authoring/audit/verify-time; the runtime-critical Gate Integrity guards are carried by `premise/gate-design.md` |
| `project-profile-calibration.md` | Profile Variables (six) and Calibration Rule, Scope Boundary — authoring/calibration-time reference, not per-turn |
| `outcome-equivalence.md` | Outcome Equivalence (whole section) — Derived tier, runtime-inert argument chain |

## Philosophy

This directory is not an archive (content remains canonical and current) and not a docs/ replacement (docs/ holds investigation/research products, not prescriptive principles). It is a **Tier Factorization o-tier zone** — same content, different invocation frequency, different load mechanism.

The demotion zone reduces auto-load memory pressure (Epistemic Cost Topology applied to the loading dimension) while keeping the demoted content canonical and editable. The split is one-directional by default: there is no formal re-promotion pathway. A demoted section returning to `.claude/rules/` is a contributor-judgment decision per case, not an inscribed criterion.

Per-section demotion history — which section moved from where, when, and why — is not restated here; it is recorded in the git record (commit messages, PR bodies), per this project's Ledger binding (`AGENTS.md` §Settled Directions).
