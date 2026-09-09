# `.claude/principles/` — Demotion Zone

**Purpose**: Location for prescriptive content demoted from `.claude/rules/`. §Distinction from `.claude/rules/` below states when this content loads.

This directory realizes the root `AGENTS.md` `## Progressive Disclosure` policy in three stages: at session start, nothing in this directory loads; when work touches this directory, its entry document (`AGENTS.md`, aliased as `CLAUDE.md`) is picked up by directory convention, bringing this index and the placement policy below into context; a specific principle document is then fetched via Read/Grep only when the utterance or current context names it. Other AI clients can adopt the same content via their own load conventions; the content itself is substrate-agnostic.

## Distinction from `.claude/rules/`

- **`.claude/rules/`** — Auto-loaded by the harness at session start, so it is invoked per-turn.
- **`.claude/principles/`** — Two load paths. The entry document (`AGENTS.md`, aliased `CLAUDE.md`) loads by directory convention when work touches this directory, so it is invoked once per directory visit. Each principle document lazy-loads via Read/Grep only when named, so it is invoked per-session or per-authoring.

This section is the canonical statement of the load mechanism in this repository; other files point here rather than restating it. Naming this index `AGENTS.md` with the `CLAUDE.md` alias — the only file in this directory that carries that name — is what makes the directory-convention pickup happen, which is why it stays short and current.

## Index

- **`architectural-principles.md`** — Tier Factorization, Epistemic Cost Topology, Unix Philosophy Homomorphism, Session Text Composition, Cross-Session Knowledge Composition, Task Externalization Boundary, Reference over Copy, Inter-Protocol Guidance, Coexistence over Mirroring, Termination, Plugin Encapsulation, Utility Skills delegation.
- **`hermeneutic-cycle.md`** — Pattern over Vocabulary, reinterpretation across protocol/session/version/agent boundaries, and correction-channel evidence.
- **`safeguards.md`** — Actionable revision criterion, Literature Application Discipline, Rule Classification Framework, Adversarial Anticipation, White Bear Avoidance. All are authoring/audit/verify-time; the runtime-critical Gate Integrity guards are carried by `premise/gate-design.md` instead.
- **`project-profile-calibration.md`** — Profile Variables and Calibration Rule, Scope Boundary. Authoring/calibration-time reference, not per-turn.
- **`outcome-equivalence.md`** — Outcome Equivalence (whole section). Derived tier, runtime-inert argument chain.

## Philosophy

This directory is not an archive (content remains canonical and current) and not a docs/ replacement (docs/ holds contributor-facing specification and editing conventions, not prescriptive principles; investigation and research products go to the ledger).

The demotion zone reduces auto-load memory pressure (Epistemic Cost Topology applied to the loading dimension) while keeping the demoted content canonical and editable. The split is one-directional by default: there is no formal re-promotion pathway. A demoted section returning to `.claude/rules/` is a contributor-judgment decision per case, not an inscribed criterion.

Per-section demotion history — which section moved from where, when, and why — is not restated here; it is recorded in the git record (commit messages, PR bodies), per this project's Ledger binding (`AGENTS.md` §Settled Directions).
