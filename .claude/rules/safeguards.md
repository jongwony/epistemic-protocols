# Safeguards

Principles that become LESS important as models improve; temporary guards against current model limitations.

Safeguard-tier principles are revisitable as model capability evolves — their operational force diminishes with empirical evidence of reduced need. Demotion from higher tiers is a legitimate outcome when empirical trajectory diverges from the tier's definitional criterion.

**Actionable revision criterion**: Safeguard-tier status is not a passive label but an operational commitment to revisit guards as evidence accumulates. Triggers for revising corresponding SKILL.md Rules sections: (1) model version upgrade with demonstrated instruction-following improvement, (2) observed violation rate sustained below prior baseline across sessions with current models, or (3) a successful compression PR (e.g., the PR #270 XC1-XC4 precedent) demonstrating guard reducibility without outcome loss. When any trigger fires, reduce or remove guards; document the reduction with empirical basis citation. This prevents carrying obsolete safeguards into future protocol releases as models improve.

## Literature Application Discipline

External literature serves as **reference for Safeguard-tier candidate identification**, not as authority over project framing. When applying the Actionable revision criterion above with literature evidence:

- **Eligible**: literature evidence in domains where literature explicitly speaks. Examples: position bias (Liu TACL 2024 "Lost in the Middle"), redundancy dilution (Shi ICML 2023, LongLLMLingua ACL 2024), instruction-tuning trajectories (FLAN ICLR 2022, T0, FLAN scaling JMLR 2024), alignment-guard internalization (InstructGPT NeurIPS 2022, Constitutional AI 2022).
- **Ineligible**: converting literature *silence* (null findings) into *negative* claims about project framing. The project's category/type-theoretic experimental territory (TYPES coproduct, MORPHISM chain, PHASE TRANSITIONS — see `docs/structural-specs.md` for the formal block anatomy) is project-internal evidence-generation; literature null in this domain produces no warrant for refutation.

**Empirical grounding**: this discipline emerged from a 3-cycle `/elicit` dogfood session (issue #354 follow-up). Cycle 1 over-extrapolated codex null findings on TYPES/MORPHISM-vs-prose comparison into a "scaffolding, not amplifier" negative claim, requiring user frame-correction. Cycle 3 with corrected scope produced literature-aligned Safeguard-tier candidate list (five trajectory patterns) without violating project framing — same tool, different framing, different result.

**Trajectory candidates (literature-supported obsolescence patterns)**:

| Pattern | Replacement capability | Verification |
|---|---|---|
| Few-shot exemplar redundancy | Learned instruction following / task generalization | Strong (task-induction scaffolds); FLAN ICLR 2022, T0, FLAN scaling JMLR 2024 |
| Manual chain-of-thought wrapping | Trained reasoning policy / decoding-time path discovery | Moderate-Strong (reasoning-model context); Wang & Zhou NeurIPS 2024, DeepSeek-R1 |
| Repeated alignment guard text | Post-training alignment / internalized preference | Strong (training improves alignment); InstructGPT NeurIPS 2022, Constitutional AI |
| Ignore-distractor reminders | Learned retrieval / distractor robustness | Strong (RAG/QA settings); Shi ICML 2023, RAFT |
| Position-bias placement | Position-robust long-context utilization | Strong on weakness; partial that model upgrade alone removes; Liu TACL 2024, Found-in-the-Middle / Ms-PoE NeurIPS 2024 |

Each pattern is a literature-supported candidate for Safeguard-tier compression. Project-side triggers (per Actionable revision criterion) remain required for actual reduction — literature alone does not warrant rule removal.

## Adversarial Anticipation

Each protocol must anticipate how an AI agent might shortcut or rationalize away from faithful execution, and include structural guards in Rules and Phase prose. Formal specification guarantees definitional consistency; adversarial design guarantees execution fidelity. Common rationalization paths: premature convergence assertion, silent detection dismissal, skipping gate interaction entirely (presenting content without yielding turn for response), collapsing Qs gates to plain acknowledgment, gate mutation (option injection — adding options not in definition, option deletion — removing defined options, option substitution — replacing defined options with different ones). Distinct from gate mutation: **type-preserving materialization** — specializing a generic option into a concrete term while preserving the answer type constructor. The boundary: if the TYPES coproduct classifies the user's response identically before and after specialization, the transformation is materialization; if it requires a new constructor or alters the coproduct structure, it is mutation. These are orthogonal concerns — a protocol can be formally correct yet routinely circumvented.

**Guard consistency**: Adversarial guards (prescriptive Rules + adversarial Rules) must be internally consistent. Contradictory guards lower AI confidence, causing the agent to skip the entire signal rather than navigate the contradiction. A single clear guard is stronger than two contradictory guards. When fixing contradictions, removing the conflict strengthens the remaining guard rather than weakening adversarial coverage.

**Tier note**: Classified as Safeguard per audit-2026-04-11 #241 resolution. The original Axiom-tier classification rested on the claim that Adversarial Anticipation becomes MORE important as models improve. Empirical counter-evidence: PR #270 (merged 2026-04-18, commit `26da87e` on `main`) compressed adversarial scaffolding across all 11 protocol SKILL.md Rules sections under the Opus 4.7 instruction-following premise, net −14 content lines with zero new verify warnings. The aggregate compression demonstrates the inverse trajectory (becomes LESS important with improved instruction-following). The self-referential falsifiability concern (audit Rank 5: guard-list inflation as pseudo-refutation) is resolved by honest tier reclassification rather than by adding more guards. This PR (#273) performs only the tier reclassification — the 11-protocol compression was completed in PR #270 independently.

## White Bear Avoidance

LLM-facing instructions prefer **positive rationale** ("X IS Y because Z") over **negative prohibition** ("do not use W"). Negative injunctions evoke the forbidden target (White Bear problem: "don't think of a white bear" → thought of white bear), a recognized LLM rationalization path. Pattern observed across multiple LLM-facing updates — converting phrasings like "avoid markdown code blocks in Ink output" to "emit element patterns directly" reduces prohibited-pattern drift in subsequent runs.

**Empirical scope**: applies to LLM-facing instructions only (contributor-facing documentation exempt); grounded in output-format instructions (markdown emission, structural rendering, list formatting), with generalization to other instruction types — notably turn-yield behavior at gate interactions — remaining a theoretical extension. The application axis is *attractor vs discriminant boundary* (derived from A1 differential future + A5 entropy axis): commission-detectable in produced output → apply avoidance; omission-detectable at a decision-point cue only → preserve the prohibition (removing it erases the calibration signal that distinguishes a gated path from an auto-resolved one).

**Tier note**: cascaded from A7 (Adversarial Anticipation) reclassification per audit-2026-04-11 #241 — sibling complement to Zero-Shot Instruction Preference on the *prohibition* axis (Zero-Shot operates on the *example* axis). The principle statement's empirical grounding confirms operational force at the Safeguard tier; trajectory matches the criterion (becomes LESS important as models handle negative formulations more robustly).

## Gate Type Soundness

TYPES coproduct must match Phase prose options; becomes less critical as models improve. Enforced as warning-level static check (see `.claude/skills/verify/scripts/static-checks.js` → `gate-type-soundness`).
