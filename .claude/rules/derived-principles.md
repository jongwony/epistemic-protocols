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

When a Qc gate operates on a finite, protocol-owned taxonomy with Constitution annotation, present ALL types with detection status, evidence, and falsification conditions — not only the detected subset behind a generic action verb. The complete assessment enables Recognition (evaluate presented options) over Recall (generate missing options from memory). Design smell: "generic verb hiding finite taxonomy state" — when a gate option label (e.g., "Add type") conceals concrete candidates the AI has already analyzed, creating an Extension/Constitution kind impurity (the gate appears Extension-eligible but the sub-step requires Constitution user judgment). Fix: materialize the full taxonomy so the presentation is a pure relay of AI analysis and the remaining judgment is a clean Constitution gate. Applies to: finite type sets with Constitution Qc. Does not apply to: open-ended generation, per-item iteration, or runtime-variable sets. Same principle applies to protocol nudges: when deficit conditions are observed, surface them with explicit evidence rather than silently omitting.

**Scope boundary**: Full Taxonomy presentation (all types with detection status, evidence, falsification condition, Emergent probe) applies when the taxonomy supports Recognition for downstream user judgment — whether or not a taxonomy-confirmation gate exists. Realization mode for detection-tool taxonomies (Syneidesis gap surfacing, Katalepsis probe construction, Prosoche risk classification): the AI uses the taxonomy internally for scanning; presenting only detected items is appropriate.

All taxonomies must include an Emergent dimension to ensure comprehensiveness; named types are working hypotheses, not exhaustive categories.

**Dead Signal Test**: When designing classification taxonomies for stigmergy artifacts, every value must carry a distinct downstream behavioral signal. If a proposed value's behavior is always resolvable to an existing value, it is a dead signal — handle via runtime interpretation (e.g., free input followed by routing) rather than taxonomy expansion. Derived from the same A1+A5 basis: a dead signal offers no Recognition value, as it presents a distinction without a differential future.

## Differential Future Requirement

Derived from A1 (Recognition over Recall) + A5 (Interaction Kind Factorization).

Each presented option in a decision gate must occupy a decision-relevant differential-future position — a position whose downstream trajectory materially differs from the trajectories of the other presented options. A1 requires options with differential futures; A5 distinguishes Extension from Constitution by entropy at the option-set level (operational synonyms: relay/gated). This principle operationalizes their composition: when options lack differential future, they are not genuine alternatives but incidental packaging variants, which A5 resolves as relay.

Two concrete failure modes characterize the operational scope:
- **Cost-symmetric baggage**: options differ only on items whose inclusion leaves downstream trajectories equivalent across options. Such options share a trajectory and should collapse to one.
- **Meta-actions as peer options**: options whose selection produces no trajectory on the decision axis — pure exits, deferrals, or off-axis context-gathering that do not commit to any downstream action. Options whose selection triggers a structurally distinct downstream trajectory (including cleanup trajectories via `user_withdraw` in `.claude/principles/architectural-principles.md §Three-Tier Termination`) remain on-axis peer options, not meta-actions. Meta-actions surface as free-response pathways, not peer options.

Operational test: "Do the presented options produce materially different downstream trajectories, or do some share the same trajectory while differing on incidental packaging?" Shared-trajectory options collapse to one; options producing no on-axis trajectory surface as free-response pathways.

**False-positive collapse guard**: Trajectory equivalence is an epistemic claim. When equivalence assessment requires user-private knowledge or is plausibly contested, preserve the options as distinct — collapsing under contested equivalence would exercise constitutive authority under relay appearance (dual to the false-positive gating failure mode named in `§Loop Continuity under Bounded Regret`).

**Trade-off**: The principle prioritizes option-set purity (only decision-axis positions as peer options) over Recognition of structurally urgent meta-action prompts in time-bounded gates. Protocols with urgent off-axis prompts (e.g., "gather more context" before a time-bounded routing decision) must surface the prompt through alternative affordances (pre-gate text, progress indicators, or separate checkpoint gates), not by re-introducing them as peer options.

Scope: decision gates — gates whose options are positions on a decision axis. **Structural test**: "Does accepting this option commit the agent to any downstream action beyond record-keeping?" If yes → decision-axis gate → requirement applies. If no → pure verification → excluded. Verification gates are excluded: Katalepsis comprehension probes (1-correct option design by purpose) and Anamnesis Phase 2 recognition gates (past-identity synthesis, not future-trajectory selection) have option structures determined by verification task requirements, not by decision-axis position. The requirement applies to gates where the user's response constitutes a forward-looking choice among alternatives.

## Convergence Evidence

Derived from A3 (Convergence Persistence).

Protocol convergence must be demonstrated, not asserted. At convergence, the agent must present a transformation trace mapping each identified deficit instance to its resolution — the MORPHISM instantiated at the concrete level. "All gaps resolved" or "boundary defined" as bare assertion without per-item evidence = protocol violation. Convergence evidence (the transformation trace) is a relay presentation (A5): it demonstrates the completed morphism without gating — the agent presents the trace and proceeds automatically. Distinction: convergence *evidence* is always relay; convergence *conditions* may involve gates when user commitment is constitutive (e.g., Horismos Phase 4 final-gate approval). In such cases, the relay trace provides context for the binding gate — they are separate operations, not conflated.

## Pattern over Tool

Derived from A1 (Recognition over Recall) + A4 (Semantic Autonomy).

The Recognition over Recall principle is a content invariant — the protocol function lies in the structured options pattern, not in the specific tool that renders them. Structured numbered text followed by turn yield satisfies the same epistemic function as an AskUserQuestion tool call. The invariant: user receives structured options with differential implications, and their response is parsed into a typed answer.

## Outcome Equivalence

Demoted to `.claude/principles/outcome-equivalence.md` (Derived tier; runtime-inert).

## Zero-Shot Instruction Preference

Derived from A4 (Semantic Autonomy).

LLM-facing instructions (Output Style, SKILL.md prose, agent prompts) state principles, not examples. When a rendering rule, behavioral guideline, or structural constraint can be expressed as a principle, do not append few-shot examples or category-level mapping lists. Few-shot examples create a soft-table effect — anchoring the model to specific instances rather than letting it apply the principle to novel contexts. A principle that requires examples to be understood is underspecified; fix the principle, do not patch it with examples.

Scope boundary: this principle applies to instructions the LLM interprets and applies at runtime — not to contributor-facing documentation where examples serve comprehension. The boundary test: "would removing this example increase the LLM's latitude in applying the principle to novel contexts, without losing the output-format or behavioral reliability that the containing instruction depends on?" If yes, the example is anchoring and should be removed. An example whose primary effect is stabilizing output format or anchoring a subtle, high-failure-rate behavior is exempt — removing it costs adherence, not latitude. If the example aids human understanding without constraining LLM application, it is outside scope. SKILL.md formal blocks (Definition code blocks) are LLM-facing by definition; prose outside formal blocks in SKILL.md is hybrid (read by both LLMs and contributors) — err toward principle-only in hybrid contexts.

Unnecessary-mention-axis complement: `.claude/principles/safeguards.md §White Bear Avoidance` (Safeguard tier; prohibition framing is its strongest-evidenced form).

## Loop Continuity under Bounded Regret

Derived from A2 (Detection with Authority) + A5 (Interaction Kind Factorization).

A2's relay/constitution boundary establishes that Extension actions are legitimately auto-resolvable; A5 specifies the axis coextension — Extension implies bounded regret; Constitution typically carries unbounded regret, with A5's structural exceptions. This principle derives a prescriptive obligation from both: within any execution loop, Extension actions must not trigger Stop — the loop continues. The "must not" is this principle's own contribution, not a direct reading of A2 (which permits but does not require auto-resolution) or A5 (which classifies but does not prescribe loop behavior). Only Constitution actions (genuinely viable alternative paths whose wrong choice creates irreversible divergence) warrant interruption.

**Plan-level aggregation**: Compound unbounded-regret is superadditive — multiple irreversible decisions in one plan interact, and their aggregate regret exceeds the sum of individual gate-level risks. When compound regret crosses the plan-direction threshold, the user should judge the plan shape, not just individual items. The specific threshold is protocol-level implementation.

**Dual failure mode**: False-positive gating — the dual of Surfacing over Deciding. Both corrupt the same detection boundary from opposite directions: Surfacing over Deciding addresses false negatives (silence where surfacing is needed), this principle addresses false positives (gates where continuation is needed).

## Currency is not Support-Integrity

Derived from A2 (Detection with Authority).

Temporal currency (an artifact exists and is fresh in the current environment) does not establish support_integrity — that the artifact actually tracks the behavior or current reality it asserts. A current-but-unenforced artifact (a comment, doc, or note that claims a behavior with no enforcement channel coupling it to that behavior) is inference dressed as evidence: reading it is not relay (A2), because its basis is not authoritatively citable — the artifact could silently disagree with the behavior it describes. The direct-resolve (relay) path must therefore verify support_integrity (evidence→behavior coupling), not currency alone; evidence that is present and fresh but support-unlinked is routed to verification (observe the behavior) rather than auto-resolved.

Operationally this distinguishes two defeater axes on the admissibility boundary (rebutting/undercutting, per Pollock — two kinds of defeater, not an exhaustive taxonomy of evidence defects): **coverage** (does the evidence span the whole claim?) and **support_integrity** (does the evidence track what it asserts?). Currency is a temporal sub-case of support_integrity, not a peer of it.

Commit-form runtime enforcement is materialized per-protocol in each SKILL.md; Aitesis (`/inquire`) is the first such materialization. Provenance narrative (#464 stratified-complementation conclusion): `docs/analysis/derived-principles-provenance.md`.

## Task Externalization Boundary

Derived from A1 (Recognition over Recall) + the Epistemic Completeness Boundary (substrate delegation; see `architectural-principles.md`) + cognitive-offloading evidence. A1 enters through one channel only — the framing the user reasons with must be recognizable rather than recalled — and not through the re-derivation argument below, which rests on offloading cost-sensitivity, not on Recognition.

Externalize to the durable record only two things: (1) the problem — or commitment — the session must solve, and (2) framing shifts, recorded on each framing or work-unit change so they survive interruption and context compaction. Everything else — dependencies, sub-steps, granular progress — stays in session. As models improve, in-session retention with cheap re-derivation dominates bookkeeping: a model can re-derive its own sub-steps and dependency order on demand, so capturing them externally pays the capture, review, and reacquisition cost while the offloading benefit it would otherwise buy (below) does not accrue to a record the substrate can already regenerate. The durable record is reserved for what the session genuinely cannot reconstruct from the substrate: the committed problem and the framing under which it is being solved.

The two externalized items connect to the axiom basis directly. The problem-to-solve is the commitment the substrate cannot re-derive — losing it loses the session's purpose, the one thing delegation (the Epistemic Completeness Boundary) cannot recover. Framing shifts are the constitutive frame under which work proceeds; a frame change silently dropped corrupts every downstream judgment, and the user must be able to recognize (A1) the frame in force rather than recall a frame that has since moved.

**Trigger discipline is EVENT-based, not phase-boundary.** The record is updated on a framing or work-unit change — the event that alters what the session is solving or how it is framed — not on phase entry/exit. Blind phase logging (a durable write at every phase boundary regardless of whether the framing moved) adds extraneous capture, review, and reacquisition load: it externalizes bookkeeping the model can re-derive, taxing the very working memory offloading is meant to relieve. Phase boundaries that carry no framing change produce no durable write.

**The boundary owns what crosses, not how it renders.** This principle governs what reaches the durable record. How the durable surface is then rendered to the user — a framing readout of the kind of work in play, not a progress bar, percentage, or completion tally — is realized one layer down at the Output Style, per the Epistemic Completeness Boundary's principle/realization split. The only constraint the principle itself contributes is that progress bookkeeping does not cross into the durable record; fixing the rendering vocabulary belongs to the realization layer, not here.

**Convergence evidence is a terminal relay, not the in-flight surface.** The per-item transformation trace required at convergence (§Convergence Evidence) is a one-time end-of-protocol relay in session text, enumerating each resolved deficit to demonstrate the morphism completed. It is distinct from the durable status surface this boundary governs: the no-completion-tally reading applies to the in-flight surface, not to this terminal trace, so the two principles govern different moments and do not conflict.

**Safety valve**: a blocker discovered mid-session that the model cannot re-derive from the substrate — a non-reconstructable external constraint, a credential gap, an irreversible state it has already entered — is included in the framing record. The boundary test is re-derivability from the substrate (codebase, branch, runtime state, and the model's own reconstruction), not the item's grain: it excludes re-derivable bookkeeping, not genuinely lost-on-interruption facts, so when a sub-step graduates into a non-re-derivable commitment it crosses into the externalized set.

Evidence review externalized to `docs/analysis/task-externalization-evidence.md`.

## Reference over Copy

Derived from A2 (Detection with Authority) + the Task Externalization Boundary + A4 (Semantic Autonomy).

When context crosses a handoff boundary — a tool boundary (a CLI subprocess), an agent boundary (a subagent or teammate), a durable-record boundary (session text surviving compaction), or a turn boundary — pass a **reference** that lets the consumer re-access the live authoritative source wherever the consumer can re-derive it, and **copy** only what the consumer cannot. The partition is **re-derivability by the consumer**: context reconstructable from shared substrate (codebase, git, runtime state, the consumer's own tools) is passed by reference (a pointer the consumer dereferences); context the consumer cannot reconstruct — the constitutive WHY and framing, an output contract, a generated artifact, user-specific intent, or a snapshot whose determinism is itself the requirement — is copied so it survives the handoff intact. Both faces are first-class; which dominates is set by how much of the handoff the consumer can re-derive.

The unifying figure is the **consumer that cannot re-derive**: an isolated subagent that cannot see the parent's context, a CLI process across a tool boundary, the post-compaction future-self. Each receives exactly what it cannot reconstruct (copy) plus pointers to everything it can (reference).

The reference face is favored by three forces — transcription cost (a copy spends tokens), staleness (a copy diverges from the source it duplicated), and fidelity (re-encoding an authoritative form is lossy). The copy face is governed by loss-avoidance alone.

This is the shared root of several existing positions rather than a new mechanism: A2 relay forwards environmental facts with cited basis (a citation, not a re-constitution); the Task Externalization Boundary externalizes only the problem-to-solve and framing shifts (what the substrate cannot re-derive); Subagent Context Isolation has the coordinator point while the executor fetches its own context. On the receive side the move appears as forwarding a tool's native output unit verbatim instead of re-bucketing it into an imposed schema; on the send side as passing a pointer instead of inlining content. Both are the same move across the same boundary.

**Operational test**: "Can the consumer re-derive this from shared substrate with its own tools?" Yes → reference; no → copy. A copy where reference would serve pays tokens, risks staleness, and may lose fidelity; a reference where copy is required loses the non-re-derivable content outright.

Falsifiability and tier analysis externalized to `docs/analysis/task-externalization-evidence.md`.
