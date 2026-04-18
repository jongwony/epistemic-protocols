# Safeguards

Principles that become LESS important as models improve; temporary guards against current model limitations.

Per Axiomatization Judgment Framework (see `meta-principle.md`), Safeguard-tier principles are revisitable as model capability evolves — their operational force diminishes with empirical evidence of reduced need. Demotion from higher tiers is a legitimate Rückkehr outcome when empirical trajectory diverges from the tier's definitional criterion.

## Adversarial Anticipation

Each protocol must anticipate how an AI agent might shortcut or rationalize away from faithful execution, and include structural guards in Rules and Phase prose. Formal specification guarantees definitional consistency; adversarial design guarantees execution fidelity. Common rationalization paths: premature convergence assertion, silent detection dismissal, skipping gate interaction entirely (presenting content without yielding turn for response), collapsing Qs gates to plain acknowledgment, gate mutation (option injection — adding options not in definition, option deletion — removing defined options, option substitution — replacing defined options with different ones). Distinct from gate mutation: **type-preserving materialization** — specializing a generic option into a concrete term while preserving the answer type constructor. The boundary: if the TYPES coproduct classifies the user's response identically before and after specialization, the transformation is materialization; if it requires a new constructor or alters the coproduct structure, it is mutation. These are orthogonal concerns — a protocol can be formally correct yet routinely circumvented.

**Guard consistency**: Adversarial guards (prescriptive Rules + adversarial Rules) must be internally consistent. Contradictory guards lower AI confidence, causing the agent to skip the entire signal rather than navigate the contradiction. A single clear guard is stronger than two contradictory guards. When fixing contradictions, removing the conflict strengthens the remaining guard rather than weakening adversarial coverage.

**Tier note**: Classified as Safeguard per audit-2026-04-11 #241 resolution. The original Axiom-tier classification rested on the claim that Adversarial Anticipation becomes MORE important as models improve. PR #270 (2026-04-18) compressed adversarial scaffolding across 11 protocol Rules sections under the Opus 4.7 instruction-following premise — empirical evidence supporting the inverse trajectory (becomes LESS important with improved instruction-following). The Popperian self-referential conventionalist twist (audit Rank 5) is resolved by honest tier reclassification rather than guard-list inflation.

## White Bear Avoidance

LLM-facing instructions prefer **positive rationale** ("X IS Y because Z") over **negative prohibition** ("do not use W"). Negative injunctions evoke the forbidden target (White Bear problem: "don't think of a white bear" → thought of white bear), a recognized LLM rationalization path.

**Scope**: LLM-facing instructions only; contributor-facing documentation exempt.

**Relation to Zero-Shot Instruction Preference**: Safeguard-tier complement to `derived-principles.md §Zero-Shot Instruction Preference`. Zero-Shot (Derived from A4) works on the *example* axis (prefer no-example over ambiguous example); White Bear works on the *prohibition* axis (prefer positive framing over prohibition).

**Evidence**: observed pattern across multiple LLM-facing instruction updates — converting phrasings like "avoid markdown code blocks in Ink output" to "emit element patterns directly" reduces prohibited-pattern drift in subsequent runs.

**Empirical scope**: grounded in output-format instructions (markdown emission, structural rendering, list formatting). Generalization to other instruction types — notably turn-yield behavior at gate interactions — is a theoretical extension not yet empirically tested. Apply with awareness of this scope boundary; when removing a negative formulation of turn-yield obligation, preserve co-located positive reminder at the decision point to retain calibration signal.

**Tier note**: Originally documented as Derived from A7 (Adversarial Anticipation). With A7 reclassified to Safeguard per audit-2026-04-11 #241, White Bear cascades to the same tier — its scope (LLM-facing instruction framing) and empirical trajectory (becomes LESS important as models handle negative formulations more robustly) match Safeguard tier criteria. The principle remains operative; the tier reflects honest empirical classification.

## Gate Type Soundness

TYPES coproduct must match Phase prose options; becomes less critical as models improve. Enforced as warning-level static check (see `.claude/skills/verify/scripts/static-checks.js` → `gate-type-soundness`).
