# `.claude/principles/` — Demotion Zone

**Purpose**: Location for prescriptive content demoted from `.claude/rules/`. Per Tier Factorization, this directory realizes the **o-tier** axis (operational/runtime invocation frequency) at T2-T3; §Distinction from `.claude/rules/` below states the load behavior that realizes it.

This directory realizes the root `AGENTS.md` `## Progressive Disclosure` policy in three stages: at session start, nothing in this directory loads; when work touches this directory, its entry document (`AGENTS.md`, aliased as `CLAUDE.md`) is picked up by directory convention, bringing this index and the placement policy below into context; a specific principle document is then fetched via Read/Grep only when the utterance or current context names it. Other AI clients can adopt the same content via their own load conventions; the content itself is substrate-agnostic.

## Distinction from `.claude/rules/`

- **`.claude/rules/`** — o-tier T1. Auto-loaded by the harness at session start, so it is invoked per-turn.
- **`.claude/principles/`** — o-tier T2-T3, with two load paths. The entry document (`AGENTS.md`, aliased `CLAUDE.md`) loads by directory convention when work touches this directory, so it is invoked once per directory visit. Each principle document lazy-loads via Read/Grep only when named, so it is invoked per-session or per-authoring.

This section is the canonical statement of the load mechanism in this repository; other files point here rather than restating it. Naming this index `AGENTS.md` with the `CLAUDE.md` alias — the only file in this directory that carries that name — is what makes the directory-convention pickup happen, which is why it stays short and current.

The split realizes the orthogonal e-tier × o-tier mapping established in this project (`.claude/principles/architectural-principles.md` §Authority Mode's A5 coordination note). e-tier (epistemological status: Axiom/Derived/Architectural/Safeguard) is realized by file content; o-tier (operational frequency) is realized by directory location.

## Index

- **`architectural-principles.md`** — Tier Factorization, Epistemic Cost Topology, Unix Philosophy Homomorphism, Session Text Composition, Cross-Session Knowledge Composition, Task Externalization Boundary, Reference over Copy, Dual Advisory Layer, Coexistence over Mirroring, Three-Tier Termination, Plugin Encapsulation, Utility Skills delegation.
- **`hermeneutic-cycle.md`** — Pattern over Vocabulary (Gadamerian formal-block mapping), plus the six-surface catalog: Primary, Secondary, Tertiary, Inter-version, Inter-agent, Operational axis.
- **`safeguards.md`** — Actionable revision criterion, Literature Application Discipline, Rule Classification Framework, Adversarial Anticipation, White Bear Avoidance, Gate Type Soundness. All are authoring/audit/verify-time; the runtime-critical Gate Integrity guards are carried by `premise/gate-design.md` instead.
- **`project-profile-calibration.md`** — Profile Variables (six) and Calibration Rule, Scope Boundary. Authoring/calibration-time reference, not per-turn.
- **`outcome-equivalence.md`** — Outcome Equivalence (whole section). Derived tier, runtime-inert argument chain.

## Philosophy

This directory is not an archive (content remains canonical and current) and not a docs/ replacement (docs/ holds investigation/research products, not prescriptive principles). It is a **Tier Factorization o-tier zone** — same content, different invocation frequency, different load mechanism.

The demotion zone reduces auto-load memory pressure (Epistemic Cost Topology applied to the loading dimension) while keeping the demoted content canonical and editable. The split is one-directional by default: there is no formal re-promotion pathway. A demoted section returning to `.claude/rules/` is a contributor-judgment decision per case, not an inscribed criterion.

Per-section demotion history — which section moved from where, when, and why — is not restated here; it is recorded in the git record (commit messages, PR bodies), per this project's Ledger binding (`AGENTS.md` §Settled Directions).
