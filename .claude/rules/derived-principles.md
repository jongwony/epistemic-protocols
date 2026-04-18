# Derived Principles

Logically derived from axiom combinations; derivation source annotated.

## Surfacing over Deciding

Derived from A2 (Detection with Authority).

AI makes visible; user judges. This is the behavioral instantiation of Detection with Authority — where A2 defines the structural separation of roles, Surfacing over Deciding captures the operational stance: when in doubt, surface the finding rather than making the decision silently. Silence is the primary failure mode this principle addresses.

## Priority Override

Derived from A3 (Convergence Persistence).

Active protocols supersede default behaviors. If a protocol mode is active and has not converged, its behavioral requirements take precedence over loaded instructions and default patterns. Without this override, protocols could be undermined by competing instruction sets during their active lifecycle.

## Full Taxonomy Confirmation

Derived from A1 (Recognition over Recall) + A5 (Interaction Kind Factorization).

When a Qc gate operates on a finite, protocol-owned taxonomy with always_gated annotation, present ALL types with detection status, evidence, and falsification conditions — not only the detected subset behind a generic action verb. The complete assessment enables Recognition (evaluate presented options) over Recall (generate missing options from memory). Design smell: "generic verb hiding finite taxonomy state" — when a gate option label (e.g., "Add type") conceals concrete candidates the AI has already analyzed, creating a relay/gated kind impurity (the gate appears relay-eligible but the sub-step requires gated user judgment). Fix: materialize the full taxonomy, converting mixed to pure relay. Applies to: finite type sets with always_gated Qc. Does not apply to: open-ended generation, per-item iteration, or runtime-variable sets. Same principle applies to protocol nudges: when deficit conditions are observed, surface them with explicit evidence rather than silently omitting.

**Scope boundary**: Full Taxonomy presentation (all types with detection status, evidence, falsification condition, Emergent probe) applies when the taxonomy supports Recognition for downstream user judgment — whether or not a taxonomy-confirmation gate exists. Two realization modes:
- **Relay presentation**: Hermeneia Phase 1b and Telos Phase 1 present full taxonomy as relay under user-invoked `/clarify` or `/goal`. The A5 option-set relay test applies: "Proceed with current taxonomy" dominates when the user has already invoked the protocol, so a separate proceed/revise gate would present false alternatives. Taxonomy revision is reachable via free response at downstream gates (Phase 2 clarification in Hermeneia, Phase 2 co-construction in Telos). The actual decision target is the downstream answer, not the taxonomy itself; relay presentation supports Recognition during downstream answer formulation.
- **Detection-tool taxonomies**: Syneidesis gap surfacing, Katalepsis probe construction, Prosoche risk classification. The AI uses the taxonomy internally for scanning; presenting only detected items is appropriate.

All taxonomies must include an Emergent dimension to ensure comprehensiveness; named types are working hypotheses, not exhaustive categories.

**Dead Signal Test**: When designing classification taxonomies for stigmergy artifacts, every value must carry a distinct downstream behavioral signal. If a proposed value's behavior is always resolvable to an existing value, it is a dead signal — handle via runtime interpretation (e.g., free input followed by routing) rather than taxonomy expansion. Derived from the same A1+A5 basis: a dead signal offers no Recognition value, as it presents a distinction without a differential future.

## Convergence Evidence

Derived from A3 (Convergence Persistence).

Protocol convergence must be demonstrated, not asserted. At convergence, the agent must present a transformation trace mapping each identified deficit instance to its resolution — the MORPHISM instantiated at the concrete level. "All gaps resolved" or "goal defined" as bare assertion without per-item evidence = protocol violation. Convergence evidence (the transformation trace) is a relay presentation (A5): it demonstrates the completed morphism without gating — the agent presents the trace and proceeds automatically. Distinction: convergence *evidence* is always relay; convergence *conditions* may involve gates when user commitment is constitutive (e.g., Telos GoalContract approval). In such cases, the relay trace provides context for the binding gate — they are separate operations, not conflated.

## Pattern over Tool

Derived from A1 (Recognition over Recall) + A4 (Semantic Autonomy).

The Recognition over Recall principle is a content invariant — the protocol function lies in the structured options pattern, not in the specific tool that renders them. Structured numbered text followed by turn yield satisfies the same epistemic function as an AskUserQuestion tool call. The invariant: user receives structured options with differential implications, and their response is parsed into a typed answer.

## Outcome Equivalence

Derived from A4 (Semantic Autonomy) + realization-completeness assumption.

**Layered argument structure**:

1. **A4 asserts functor existence (definitional)**: Semantic Autonomy establishes that a protocol definition's epistemic meaning exists independent of any specific platform. Abstract gate operations are defined over the epistemic category (phases, transitions, morphisms) without reference to target tools.

2. **Realization-completeness is an independent empirical assumption**: For a given platform P, realization-completeness holds when P's primitives preserve gate semantics (present structured content → yield turn → parse response). This is not entailed by A4 — it is a separate assumption about each target platform, empirically testable per realization.

3. **Outcome Equivalence is the conjunction**: Given the same protocol definition, the same user responses, and a platform satisfying realization-completeness, the epistemic outcome (convergence conditions, output structures) is equivalent across realizations.

The argument chain matters: A4 alone does not guarantee outcome preservation at the realization boundary; it guarantees the definition's autonomy from any specific realization. Outcome Equivalence bridges the definitional layer (A4) and the empirical layer (realization) via the completeness assumption.

**Falsifiability and counter-evidence**: Per Axiomatization Judgment Framework, Outcome Equivalence is falsifiable when a realization fails the completeness assumption. Known counter-example: Prothesis TOOL GROUNDING `Await` depends on SubagentStop (a Claude Code substrate guarantee). Platforms without equivalent teammate-termination semantics partially refute Outcome Equivalence at the realization boundary. When this happens, A4 survives intact (the definition remains autonomous); Outcome Equivalence fails locally (that specific realization does not preserve outcomes).

**Distinction from A4 — tier rationale**: A4 is non-derivable from any combination of other axioms. Outcome Equivalence is derivable from A4 *plus* the realization-completeness assumption. Because the latter is itself empirically testable (not axiomatic), the conjunction cannot be axiomatic — Outcome Equivalence lives in Derived tier rather than as a definitional corollary of A4.

## Zero-Shot Instruction Preference

Derived from A4 (Semantic Autonomy).

LLM-facing instructions (Output Style, SKILL.md prose, agent prompts) state principles, not examples. When a rendering rule, behavioral guideline, or structural constraint can be expressed as a principle, do not append few-shot examples or category-level mapping lists. Few-shot examples create a soft-table effect — anchoring the model to specific instances rather than letting it apply the principle to novel contexts. A principle that requires examples to be understood is underspecified; fix the principle, do not patch it with examples.

Scope boundary: this principle applies to instructions the LLM interprets and applies at runtime — not to contributor-facing documentation where examples serve comprehension. The boundary test: "would removing this example increase the LLM's latitude in applying the principle to novel contexts?" If yes, the example is anchoring and should be removed. If the example aids human understanding without constraining LLM application, it is outside scope. SKILL.md formal blocks (Definition code blocks) are LLM-facing by definition; prose outside formal blocks in SKILL.md is hybrid (read by both LLMs and contributors) — err toward principle-only in hybrid contexts.

**Safeguard-tier complement**: `safeguards.md §White Bear Avoidance` addresses the prohibition axis (prefer positive framing over negative prohibition). Zero-Shot (Derived, A4-grounded) operates on the example axis; White Bear (Safeguard) operates on the prohibition axis. The two were previously documented as orthogonal complements of a single Derived-tier pair; tier reclassification of White Bear (audit-2026-04-11 cascade from #241) reflects its empirical trajectory — becomes LESS important as models handle negative formulations more robustly.

## Loop Continuity under Bounded Regret

Derived from A2 (Detection with Authority) + A5 (Interaction Kind Factorization).

A2's relay/constitution boundary establishes that relay actions are legitimately auto-resolvable; A5's bounded/unbounded regret classifies individual gates by elision consequence. This principle derives a prescriptive obligation from both: within any execution loop, bounded-regret actions must not trigger Stop — the loop continues. The "must not" is this principle's own contribution, not a direct reading of A2 (which permits but does not require auto-resolution) or A5 (which classifies but does not prescribe loop behavior). Only unbounded-regret actions (genuinely viable alternative paths whose wrong choice creates irreversible divergence) warrant interruption.

**Plan-level aggregation**: Compound unbounded-regret is superadditive — multiple irreversible decisions in one plan interact, and their aggregate regret exceeds the sum of individual gate-level risks. When compound regret crosses the plan-direction threshold, the user should judge the plan shape, not just individual items. The specific threshold is protocol-level implementation.

**Dual failure mode**: False-positive gating — the dual of Surfacing over Deciding. Both corrupt the same detection boundary from opposite directions: Surfacing over Deciding addresses false negatives (silence where surfacing is needed), this principle addresses false positives (gates where continuation is needed).
