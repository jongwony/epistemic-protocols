# Derived Principles

Logically derived from axiom combinations; derivation source annotated.

## Surfacing over Deciding

AI makes visible; user judges. This is the behavioral instantiation of Detection with Authority — where A2 defines the structural separation of roles, Surfacing over Deciding captures the operational stance: when in doubt, surface the finding rather than making the decision silently. Silence is the primary failure mode this principle addresses.

## Full Taxonomy Confirmation

When a Qc gate operates on a finite, protocol-owned taxonomy with Constitution annotation, present ALL types with detection status, evidence, and falsification conditions — not only the detected subset behind a generic action verb. Design smell: "generic verb hiding finite taxonomy state" — when a gate option label (e.g., "Add type") conceals concrete candidates the AI has already analyzed, creating an Extension/Constitution kind impurity (the gate appears Extension-eligible but the sub-step requires Constitution user judgment). Fix: materialize the full taxonomy so the presentation is a pure relay of AI analysis and the remaining judgment is a clean Constitution gate. Applies to: finite type sets with Constitution Qc. Does not apply to: open-ended generation, per-item iteration, or runtime-variable sets. Same principle applies to protocol nudges: when deficit conditions are observed, surface them with explicit evidence rather than silently omitting.

**Scope boundary**: Full Taxonomy presentation (all types with detection status, evidence, falsification condition, Emergent probe) applies when the taxonomy supports Recognition for downstream user judgment — whether or not a taxonomy-confirmation gate exists. Realization mode for detection-tool taxonomies (Syneidesis gap surfacing, Katalepsis probe construction, Prosoche risk classification): the AI uses the taxonomy internally for scanning; presenting only detected items is appropriate.

All taxonomies must include an Emergent dimension to ensure comprehensiveness; named types are working hypotheses, not exhaustive categories.

**Dead Signal Test**: When designing classification taxonomies for stigmergy artifacts, every value must carry a distinct downstream behavioral signal. If a proposed value's behavior is always resolvable to an existing value, it is a dead signal — handle via runtime interpretation (e.g., free input followed by routing) rather than taxonomy expansion.

## Differential Future Requirement

Each presented option in a decision gate must occupy a decision-relevant differential-future position — a position whose downstream trajectory materially differs from the trajectories of the other presented options. When options lack differential future, they are not genuine alternatives but incidental packaging variants, which resolve as relay.

Two concrete failure modes characterize the operational scope:
- **Cost-symmetric baggage**: options differ only on items whose inclusion leaves downstream trajectories equivalent across options. Such options share a trajectory and should collapse to one.
- **Meta-actions as peer options**: options whose selection produces no trajectory on the decision axis — pure exits, deferrals, or off-axis context-gathering that do not commit to any downstream action. Options whose selection triggers a structurally distinct downstream trajectory (including cleanup trajectories via `user_withdraw` in `.claude/principles/architectural-principles.md §Three-Tier Termination`) remain on-axis peer options, not meta-actions. Meta-actions surface as free-response pathways, not peer options.

Operational test: "Do the presented options produce materially different downstream trajectories, or do some share the same trajectory while differing on incidental packaging?" Shared-trajectory options collapse to one; options producing no on-axis trajectory surface as free-response pathways.

**False-positive collapse guard**: Trajectory equivalence is an epistemic claim. When equivalence assessment requires user-private knowledge or is plausibly contested, preserve the options as distinct — collapsing under contested equivalence would exercise constitutive authority under relay appearance (dual to the false-positive gating failure mode named in `§Loop Continuity under Bounded Regret`).

**Off-axis prompt handling**: Protocols with urgent off-axis prompts (e.g., "gather more context" before a time-bounded routing decision) must surface the prompt through alternative affordances (pre-gate text, progress indicators, or separate checkpoint gates), not by re-introducing them as peer options.

Scope: decision gates — gates whose options are positions on a decision axis. **Structural test**: "Does accepting this option commit the agent to any downstream action beyond record-keeping?" If yes → decision-axis gate → requirement applies. If no → pure verification → excluded. Verification gates are excluded: Katalepsis comprehension probes (1-correct option design by purpose) and Anamnesis Phase 2 recognition gates (past-identity synthesis, not future-trajectory selection) have option structures determined by verification task requirements, not by decision-axis position. The requirement applies to gates where the user's response constitutes a forward-looking choice among alternatives.

## Convergence Evidence

Protocol convergence must be demonstrated, not asserted. At convergence, the agent must present a transformation trace mapping each identified deficit instance to its resolution — the MORPHISM instantiated at the concrete level. "All gaps resolved" or "boundary defined" as bare assertion without per-item evidence = protocol violation. Convergence evidence (the transformation trace) is a relay presentation (A5): it demonstrates the completed morphism without gating — the agent presents the trace and proceeds automatically. Distinction: convergence *evidence* is always relay; convergence *conditions* may involve gates when user commitment is constitutive (e.g., Horismos Phase 4 final-gate approval). In such cases, the relay trace provides context for the binding gate — they are separate operations, not conflated.

## Pattern over Tool

The Recognition over Recall principle is a content invariant — the protocol function lies in the structured options pattern, not in the specific tool that renders them. Structured numbered text followed by turn yield satisfies the same epistemic function as an AskUserQuestion tool call. The invariant: user receives structured options with differential implications, and their response is parsed into a typed answer.

## Zero-Shot Instruction Preference

LLM-facing instructions (Output Style, SKILL.md prose, agent prompts) state principles, not examples. When a rendering rule, behavioral guideline, or structural constraint can be expressed as a principle, do not append few-shot examples or category-level mapping lists. Few-shot examples create a soft-table effect — anchoring the model to specific instances rather than letting it apply the principle to novel contexts. A principle that requires examples to be understood is underspecified; fix the principle, do not patch it with examples.

Scope boundary: this principle applies to instructions the LLM interprets and applies at runtime — not to contributor-facing documentation where examples serve comprehension. The boundary test: "would removing this example increase the LLM's latitude in applying the principle to novel contexts, without losing the output-format or behavioral reliability that the containing instruction depends on?" If yes, the example is anchoring and should be removed. An example whose primary effect is stabilizing output format or anchoring a subtle, high-failure-rate behavior is exempt — removing it costs adherence, not latitude. If the example aids human understanding without constraining LLM application, it is outside scope. SKILL.md formal blocks (Definition code blocks) are LLM-facing by definition; prose outside formal blocks in SKILL.md is hybrid (read by both LLMs and contributors) — err toward principle-only in hybrid contexts.

Unnecessary-mention-axis complement: `.claude/principles/safeguards.md §White Bear Avoidance` (Safeguard tier; prohibition framing is its strongest-evidenced form).

## Loop Continuity under Bounded Regret

Within any execution loop, Extension actions must not trigger Stop — the loop continues. Only Constitution actions (genuinely viable alternative paths whose wrong choice creates irreversible divergence) warrant interruption.

**Plan-level aggregation**: Compound unbounded-regret is superadditive — multiple irreversible decisions in one plan interact, and their aggregate regret exceeds the sum of individual gate-level risks. When compound regret crosses the plan-direction threshold, the user should judge the plan shape, not just individual items. The specific threshold is protocol-level implementation.

**Dual failure mode**: False-positive gating — the dual of Surfacing over Deciding. Both corrupt the same detection boundary from opposite directions: Surfacing over Deciding addresses false negatives (silence where surfacing is needed), this principle addresses false positives (gates where continuation is needed).

## Currency is not Support-Integrity

Temporal currency (an artifact exists and is fresh in the current environment) does not establish support_integrity — that the artifact actually tracks the behavior or current reality it asserts. A current-but-unenforced artifact (a comment, doc, or note that claims a behavior with no enforcement channel coupling it to that behavior) is inference dressed as evidence: reading it is not relay (A2), because its basis is not authoritatively citable — the artifact could silently disagree with the behavior it describes. The direct-resolve (relay) path must therefore verify support_integrity (evidence→behavior coupling), not currency alone; evidence that is present and fresh but support-unlinked is routed to verification (observe the behavior) rather than auto-resolved.

Operationally this distinguishes two defeater axes on the admissibility boundary (rebutting/undercutting, per Pollock — two kinds of defeater, not an exhaustive taxonomy of evidence defects): **coverage** (does the evidence span the whole claim?) and **support_integrity** (does the evidence track what it asserts?). Currency is a temporal sub-case of support_integrity, not a peer of it.

Commit-form runtime enforcement is materialized per-protocol in each SKILL.md; Aitesis (`/inquire`) is the first such materialization.

## Task Externalization Boundary

Relocated to `.claude/principles/architectural-principles.md §Task Externalization Boundary` (2026-07-28) — fetch via Read/Grep for the durable-record externalization criteria.

## Reference over Copy

Relocated to `.claude/principles/architectural-principles.md §Reference over Copy` (2026-07-28) — fetch via Read/Grep for the handoff-boundary reference/copy criteria.
