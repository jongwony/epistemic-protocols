# Safeguards

- When revisiting a guard, read `premise/instruction-authoring.md` §Actionable Revision Criterion and §Deletion by Default, Retention on Evidence. Apply the trial's evidence only within the readers and conditions exercised.
- When a model changes, treat the change as a reason to re-evaluate relevant guards rather than as evidence of a predetermined trajectory.
- When this criterion changes, search protocol `SKILL.md` Rules with `rg 'revisitable as|revision triggers' */skills/*/SKILL.md` and align any compiled restatements. A search with no matches establishes no current compiled consumer.

## Literature Application Discipline

External literature serves as **reference for Safeguard-tier candidate identification**, not as authority over project framing. When applying the Actionable revision criterion above with literature evidence:

- **Eligible**: literature evidence in domains where literature explicitly speaks. Examples: position bias (Liu TACL 2024 "Lost in the Middle"), redundancy dilution (Shi ICML 2023, LongLLMLingua ACL 2024), instruction-tuning trajectories (FLAN ICLR 2022, T0, FLAN scaling JMLR 2024), alignment-guard internalization (InstructGPT NeurIPS 2022, Constitutional AI 2022).
- **Ineligible**: converting literature *silence* (null findings) into *negative* claims about project framing. The project's category/type-theoretic experimental territory (TYPES coproduct, MORPHISM chain, PHASE TRANSITIONS — see `docs/structural-specs.md` for the formal block anatomy) is project-internal evidence-generation; literature null in this domain produces no warrant for refutation.

**Empirical grounding**: this discipline emerged from a 3-cycle `/elicit` dogfood session (issue #354 follow-up). Cycle 1 over-extrapolated codex null findings on TYPES/MORPHISM-vs-prose comparison into a "scaffolding, not amplifier" negative claim, requiring user frame-correction. Cycle 3 with corrected scope produced literature-aligned Safeguard-tier candidate list (five trajectory patterns) without violating project framing — same tool, different framing, different result.

**Trajectory candidates (literature-supported obsolescence patterns)** — reference metadata for empirical grounding (citations as evidence of trajectory existence, not behavioral exemplars constraining LLM behavior; the discipline applies regardless of which specific publications appear here, and entries below are the citations consulted at the time of inscription):

| Pattern | Replacement capability | Verification |
|---|---|---|
| Few-shot exemplar redundancy | Learned instruction following / task generalization | Strong (task-induction scaffolds); FLAN ICLR 2022, T0, FLAN scaling JMLR 2024 |
| Manual chain-of-thought wrapping | Trained reasoning policy / decoding-time path discovery | Moderate-Strong (reasoning-model context); Wang & Zhou NeurIPS 2024, DeepSeek-R1 (DeepSeek-AI 2025, arXiv:2501.12948) |
| Repeated alignment guard text | Post-training alignment / internalized preference | Strong (training improves alignment); InstructGPT NeurIPS 2022, Constitutional AI 2022 |
| Ignore-distractor reminders | Learned retrieval / distractor robustness | Strong (RAG/QA settings); Shi ICML 2023, RAFT 2024 |
| Position-bias placement | Position-robust long-context utilization | Strong on weakness; partial that model upgrade alone removes; Liu TACL 2024, Found-in-the-Middle / Ms-PoE NeurIPS 2024 |

**Last verified**: 2026-05-09 (cycle 3 of `/elicit` dogfood session, issue #354). When subsequent literature reviews update or supersede entries above, refresh the table and update this date — stale advisory entries could mislead future cycles re-running the same review and trusting existing rows.

Each pattern is a literature-supported candidate for Safeguard-tier compression. Project-side triggers (per Actionable revision criterion) remain required for actual reduction — literature alone does not warrant rule removal.

## Rule Classification Framework

Methodology for SKILL.md `## Rules` consolidation. Each rule is classified by source and processed per tier-specific action. The framework was applied across PRs #368, #369, #370, #371 with variation-stable outcomes (88 rules across 4 protocols fit the 6 categories without framework modification).

### Six tiers

| Tier | Source | Action |
|---|---|---|
| 1. Axiom anchor | A1-A6 (in `premise/`) | KEEP. 1-2 line restatement with axiom name inline; do NOT use the `(Aₙ)` label form per Plugin Encapsulation source-leak prohibition |
| 2. Derived anchor | Derived principles (Convergence Evidence, Outcome Equivalence, Differential Future Requirement, Loop Continuity, Full Taxonomy Confirmation) | KEEP. Anchor reference using principle name |
| 3. Architectural project-specific | Architectural principles or protocol Core Principle | KEEP. Paragraph-length rules migrate body to Phase prose or UX Safeguards table; invariant 1-line stays in Rules |
| 4. Cross-protocol | Rule about distinction with another protocol | Move to "Distinction from Other Protocols" section |
| 5. Safeguard tier | This file's principles or Trajectory Candidates table match | Mark Safeguard tier explicitly + inline the Actionable revision criterion (Compiled-copy consumers pattern) |
| 6. Edge/Audit | Project UX, non-invariant rule | Move to UX Safeguards table or end-of-Rules cluster |

### Plugin Encapsulation alignment

Two layers governed by different rules:

- **Source layer** (`.claude/rules/*`): tiered files cross-reference each other freely (cross-document inscription is normal for the rule layer)
- **Consumer layer** (SKILL.md): T1 inline restatement only — axiom/derived/safeguard reference uses inline naming, not file path; Tier 5 Safeguard items inline the Actionable revision criterion (Compiled-copy consumers pattern with drift-tracking comment)

### Application procedure

1. **Read** `## Rules` section of target SKILL.md
2. **Classify** each rule by tier (1-6) using the Source column
3. **Apply** the tier-specific Action
4. **Verify** via `node .claude/skills/verify/scripts/static-checks.js .` (compression preserves semantics — fail 0 expected)
5. **PR** with classification table + before/after rule count

### Empirical grounding

Framework applied across 4 protocols in parallel fork worktrees with framework variation-stable (no instance required modification of the framework — all 88 rules fit the 6 categories):

| Protocol | PR | Rule count change |
|---|---|---|
| Aitesis | #371 | 22 → 14 (-36%) |
| Prosoche | #368 | 23 → 16 (-30%) |
| Anamnesis | #369 | 22 → 14 (-36%) |
| Horismos | #370 | 21 → 16 (-24%) |

Aggregate: 88 → 60 rules (-32%) with zero framework variation across instances.

**Last applied**: 2026-05-09. When subsequent consolidation cycles add new protocols to the empirical grounding table, refresh this date so future cycles can verify the framework's variation-stability with current evidence.

### Distinction from Safeguard-tier revision

This framework is the *classification methodology* for `## Rules` consolidation (architectural-completeness axis — making rule structure tier-explicit). The Actionable revision criterion (above) addresses the *trajectory* of individual Safeguard-tier rules (model-trajectory axis — when to revisit guards). The two axes are orthogonal: the framework determines which rules carry Safeguard-tier annotation; the criterion determines when those annotated rules are revised.

## Adversarial Anticipation

- When reviewing a contract for shortcuts or guard contradictions, apply `premise/gate-design.md` §Adversarial Anticipation and §Gate Integrity. A clean static check alone does not demonstrate an execution safeguard's dispensability.

## White Bear Avoidance

- When rewriting a prohibition or competing-target mention, apply `premise/instruction-authoring.md` §Prohibition Base Rate and White Bear Avoidance. Preserve the diagnostic cue or decision boundary the mention independently carries.
- For Output Style wording, inspect the applicable emission or omission failure under the actual rendering contract. A result about output formatting does not by itself establish turn-yield behavior, and a human mechanism does not establish an LLM mechanism.
