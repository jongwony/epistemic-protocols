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

**Scope boundary**: Full Taxonomy applies when the taxonomy is the *user's decision target* — the user confirms, revises, or selects from the taxonomy (e.g., Hermeneia Phase 1b gap type assessment, Telos Phase 1 dimension assessment). When the taxonomy is an *AI detection tool* — the AI uses it internally for scanning and presents only results (e.g., Syneidesis gap surfacing, Katalepsis probe construction, Prosoche risk classification) — presenting only detected items is appropriate. Detection-tool taxonomies must include an Emergent dimension to ensure comprehensiveness; the named types are working hypotheses, not exhaustive categories.

**Dead Signal Test**: When designing classification taxonomies for stigmergy artifacts, every value must carry a distinct downstream behavioral signal. If a proposed value's behavior is always resolvable to an existing value, it is a dead signal — handle via runtime interpretation (e.g., free input followed by routing) rather than taxonomy expansion. Derived from the same A1+A5 basis: a dead signal offers no Recognition value, as it presents a distinction without a differential future.

## Convergence Evidence

Derived from A3 (Convergence Persistence).

Protocol convergence must be demonstrated, not asserted. At convergence, the agent must present a transformation trace mapping each identified deficit instance to its resolution — the MORPHISM instantiated at the concrete level. "All gaps resolved" or "goal defined" as bare assertion without per-item evidence = protocol violation. Convergence evidence (the transformation trace) is a relay presentation (A5): it demonstrates the completed morphism without gating — the agent presents the trace and proceeds automatically. Distinction: convergence *evidence* is always relay; convergence *conditions* may involve gates when user commitment is constitutive (e.g., Telos GoalContract approval). In such cases, the relay trace provides context for the binding gate — they are separate operations, not conflated.

## Pattern over Tool

Derived from A1 (Recognition over Recall) + A4 (Semantic Autonomy).

The Recognition over Recall principle is a content invariant — the protocol function lies in the structured options pattern, not in the specific tool that renders them. Structured numbered text followed by turn yield satisfies the same epistemic function as an AskUserQuestion tool call. The invariant: user receives structured options with differential implications, and their response is parsed into a typed answer.

## Zero-Shot Instruction Preference

Derived from A4 (Semantic Autonomy).

LLM-facing instructions (Output Style, SKILL.md prose, agent prompts) state principles, not examples. When a rendering rule, behavioral guideline, or structural constraint can be expressed as a principle, do not append few-shot examples or category-level mapping lists. Few-shot examples create a soft-table effect — anchoring the model to specific instances rather than letting it apply the principle to novel contexts. A principle that requires examples to be understood is underspecified; fix the principle, do not patch it with examples.

Scope boundary: this principle applies to instructions the LLM interprets and applies at runtime — not to contributor-facing documentation where examples serve comprehension. The boundary test: "would removing this example increase the LLM's latitude in applying the principle to novel contexts?" If yes, the example is anchoring and should be removed. If the example aids human understanding without constraining LLM application, it is outside scope. SKILL.md formal blocks (Definition code blocks) are LLM-facing by definition; prose outside formal blocks in SKILL.md is hybrid (read by both LLMs and contributors) — err toward principle-only in hybrid contexts.

## Loop Continuity under Bounded Regret

Derived from A2 (Detection with Authority) + A5 (Interaction Kind Factorization).

A2's relay/constitution boundary defines both directions: detect what requires judgment (constitution), and do not gate what does not (relay). A5's bounded/unbounded regret classifies individual gates; this principle extends that classification to execution-level continuity. Within any execution loop, bounded-regret actions must not trigger Stop — the loop continues. Only unbounded-regret actions (genuinely viable alternative paths whose wrong choice creates irreversible divergence) warrant interruption.

**Plan-level aggregation**: Compound unbounded-regret is superadditive — multiple irreversible decisions in one plan interact, and their aggregate regret exceeds the sum of individual gate-level risks. When compound regret crosses the plan-direction threshold, the user should judge the plan shape, not just individual items. The specific threshold is protocol-level implementation.

**Dual failure mode**: False-positive gating — the dual of Surfacing over Deciding. Both corrupt the same detection boundary from opposite directions: Surfacing over Deciding addresses false negatives (silence where surfacing is needed), this principle addresses false positives (gates where continuation is needed).
