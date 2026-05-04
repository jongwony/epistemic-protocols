# Safeguards (T2-T3 demoted detail)

Detail-level prose for `.claude/rules/safeguards.md` sections. Contains cross-reference, empirical, and tier-history content invoked at authoring/verify/axiom-evolution time, not per-turn.

## White Bear Avoidance — demoted detail

### Relation to Zero-Shot Instruction Preference

Safeguard-tier complement to `derived-principles.md §Zero-Shot Instruction Preference`. Zero-Shot (Derived from A4) works on the *example* axis (prefer no-example over ambiguous example); White Bear works on the *prohibition* axis (prefer positive framing over prohibition). Mirror partner: `.claude/principles/derived-principles.md §Zero-Shot Instruction Preference — demoted detail` records the same pairing from the Derived-tier side.

### Evidence

Observed pattern across multiple LLM-facing instruction updates — converting phrasings like "avoid markdown code blocks in Ink output" to "emit element patterns directly" reduces prohibited-pattern drift in subsequent runs.

### Tier history

Originally documented as Derived from A7 (Adversarial Anticipation). With A7 reclassified to Safeguard per audit-2026-04-11 #241, White Bear cascades to the same tier. The cascade is reinforced by independent empirical grounding: the Evidence section above documents reduction in prohibited-pattern drift observed directly in White Bear's own output-format instruction domain, separate from the A7 trajectory. The cascade establishes tier eligibility; the independent evidence confirms the principle retains operational force at the Safeguard tier. Scope (LLM-facing instruction framing) and empirical trajectory (becomes LESS important as models handle negative formulations more robustly) match Safeguard tier criteria on both axes.
