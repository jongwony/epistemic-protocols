# Gate Design

This document covers the operational discipline for designing gates — the concrete checkpoints where a decision-making system asks its user something — once `premise/recognition-and-authority.md` and `premise/interaction-factorization.md` have established which interactions need a gate at all. It ranges over what a gate presents once one is warranted, and over the conditions under which the process surrounding it converges or terminates.

## Convergence Persistence (Axiom)

An active mode of interaction remains active until its convergence conditions are met or the user explicitly exits.

Corollary (Priority Override): while a mode is active, its behavioral requirements take precedence over competing loaded instructions and default execution patterns.

## Adversarial Anticipation (Safeguard)

Any AI-executed process must anticipate how an AI agent might shortcut or rationalize away from faithful execution, and include structural guards in its rule statements and its narrative execution guidance. A formal specification guarantees definitional consistency; adversarial design guarantees execution fidelity — these are orthogonal concerns, and a process can be formally correct yet routinely circumvented. Common rationalization paths: premature convergence assertion, silent detection dismissal, skipping a gate interaction entirely (presenting content without yielding the turn for a response), collapsing a constitutive gate to plain acknowledgment, and the gate mutation taxonomy below (option injection, option deletion, option substitution) — including the type-preserving materialization boundary distinguishing mutation from legitimate option specialization.

**Guard consistency**: see the Gate Integrity section below for the canonical statement. When fixing a contradiction between guards, remove the conflict in a way that strengthens the remaining guard rather than weakening adversarial coverage overall.

## Gate Integrity (Safeguard)

**Gate mutation taxonomy** — rationalization paths a process must anticipate:
- **Option injection** — adding options not defined for that gate
- **Option deletion** — removing options that were defined
- **Option substitution** — replacing defined options with different ones

Distinct from mutation: **type-preserving materialization** — specializing a generic option into a concrete instance while preserving the same answer classification. Boundary: if the user's response would be classified identically before and after specialization, the transformation is materialization; if it requires a new classification or alters the option structure, it is mutation.

**Guard consistency**: guards against these rationalization paths — both the guiding rules and the adversarial checks — must be internally consistent. Contradictory guards lower the AI's confidence, causing it to skip the entire signal rather than navigate the contradiction.

## Full Taxonomy Confirmation (Derived)

When a finite-choice gate operates on a finite, system-owned taxonomy under Constitution (the user's judgment constitutes the answer), present ALL types with detection status, evidence, and falsification conditions — not only the detected subset behind a generic action verb. Design smell: "generic verb hiding finite taxonomy state" — a gate option label that conceals concrete candidates the AI has already analyzed creates an Extension/Constitution mismatch: the gate looks relay-eligible, but the sub-step actually requires the user's judgment. Fix: materialize the full taxonomy so the presentation is a pure relay of the AI's analysis and the remaining judgment is a clean Constitution choice. Applies to: finite type sets under Constitution. Does not apply to: open-ended generation, per-item iteration, or runtime-variable sets. The same principle applies to any status nudge: when a deficit condition is observed, surface it with explicit evidence rather than silently omitting it.

**Scope boundary**: full-taxonomy presentation (all types with detection status, evidence, falsification condition, and an emergent-category probe) applies whenever the taxonomy supports recognition for downstream user judgment — whether or not a formal taxonomy-confirmation gate exists. When a taxonomy is used purely as internal scanning machinery — the AI classifying gaps or risks in order to decide what to surface, prior to any user-facing judgment moment — presenting only the detected subset is appropriate; the full-taxonomy requirement binds the user-facing judgment step, not the internal scan.

Every taxonomy should include an Emergent dimension to preserve comprehensiveness; named types are working hypotheses, not exhaustive categories.

**Dead Signal Test**: when designing a classification taxonomy for signals that flow between components, every value must carry a distinct downstream behavioral effect. If a proposed value's behavior is always resolvable to an existing value, it is a dead signal — handle it via runtime interpretation (free-form input followed by routing) rather than by expanding the taxonomy.

## Differential Future Requirement (Derived)

Each option presented in a decision gate must occupy a decision-relevant, differential-future position — a position whose downstream trajectory materially differs from the trajectories of the other presented options. Options that lack a differential future are not genuine alternatives but incidental packaging variants, and they resolve as relay.

Two concrete failure modes characterize the operational scope:
- **Cost-symmetric baggage**: options differ only on items whose inclusion leaves the downstream trajectories equivalent across options. Such options share a trajectory and should collapse to one.
- **Meta-actions as peer options**: options whose selection produces no trajectory on the decision axis at all — pure exits, deferrals, or off-axis context-gathering that commit to no downstream action. An option whose selection triggers a structurally distinct downstream trajectory — including a cleanup trajectory triggered by an explicit withdraw option (see `premise/session-and-handoff.md`) — remains an on-axis peer option, not a meta-action. Meta-actions surface as free-response pathways, not as peer options.

Operational test: "Do the presented options produce materially different downstream trajectories, or do some share the same trajectory while differing on incidental packaging?" Shared-trajectory options collapse to one; options producing no on-axis trajectory surface as free-response pathways instead of peer options.

**False-positive collapse guard**: trajectory equivalence is itself an epistemic claim. When the equivalence assessment requires user-private knowledge, or is plausibly contested, preserve the options as distinct — collapsing under contested equivalence would exercise constitutive authority while appearing to relay.

**Off-axis prompt handling**: an urgent off-axis prompt — one that presses for attention while occupying no position on the decision axis — must surface through an alternative affordance — pre-gate text, a progress indicator, or a separate checkpoint gate — not by re-introducing it as a peer option.

Scope: decision gates — gates whose options are positions on a decision axis. **Structural test**: "Does accepting this option commit the agent to any downstream action beyond record-keeping?" If yes → decision-axis gate → the requirement applies. If no → pure verification → excluded. Verification-purpose gates are excluded: gates whose option structure is determined by a verification task's own requirements (e.g., a comprehension check, or a step confirming recognition of a past state) rather than by decision-axis position. The requirement applies to gates where the user's response constitutes a forward-looking choice among alternatives.

## Content Placement Boundary (Axiom)

A gate's own text carries the question and each option's differential implication; the analytical content — analysis, evidence, rationale — belongs in the text presented before it. Operational test: if removing a sentence from the gate would cause the loss of an option's differential implication, it belongs in the gate; if removing it would cause the loss of analytical context, it belongs in the pre-gate text output.

This binds every gate, not only the decision gates the Differential Future Requirement above ranges over: a verification-purpose gate is excluded from the differential-future test because its option structure answers to a verification task rather than a decision axis, but its question still arrives after its context or the reader is left assembling both at once.

## Convergence Evidence (Derived)

Convergence must be demonstrated, not asserted. At convergence, the system must present a transformation trace mapping each identified deficit instance to its resolution — the transformation instantiated at the concrete level. "All gaps resolved" or "boundary defined" as a bare assertion, without per-item evidence, is a process violation. Convergence evidence (the transformation trace) is itself a relay presentation: it demonstrates the completed transformation without gating — the system presents the trace and proceeds automatically. Distinction: convergence *evidence* is always relay; convergence *conditions* may involve a gate when user commitment is constitutive. In that case, the relay trace provides context for the binding gate — the two are separate operations, not conflated.

## Loop Continuity under Bounded Regret (Derived)

Within any execution loop, Extension actions must not trigger a stop — the loop continues. Only Constitution actions — genuinely viable alternative paths whose wrong choice creates irreversible divergence — warrant interruption.

**Plan-level aggregation**: compound unbounded regret is superadditive — multiple irreversible decisions within one plan interact, and their aggregate regret exceeds the sum of the individual gate-level risks. When compound regret crosses a plan-direction threshold, the user should judge the plan's shape, not just its individual items. The specific threshold is an implementation-level detail.

**Dual failure mode**: false-positive gating is the dual of Surfacing over Deciding (see `premise/recognition-and-authority.md`). Both corrupt the same detection boundary from opposite directions: Surfacing over Deciding addresses false negatives (silence where surfacing is needed); this principle addresses false positives (a gate where continuation is needed instead).

## Utility Delegation of Adversarial Guards (Architectural)

**Pure relay utilities** — components that do NOT present gates and do NOT synthesize outputs of their own — delegate the Adversarial Anticipation guards (above) to the processes they compose. A pure-relay utility is not obligated to implement gate-integrity guards when it has no gates of its own.

**Principle**: Adversarial Anticipation guards attach to the gate boundary, not to every wrapper layer. Wrapping a process in a pure-relay utility does NOT require re-implementing adversarial guards in the utility.

**Scope boundary**: this delegation applies only to utilities that behave as relay pipes (forward outputs unchanged). A utility that performs **output synthesis or post-processing** — selecting among, merging, or narratively recomposing outputs — exercises constitutive authority and must inherit adversarial guards against the same rationalization paths its synthesis step introduces. Operational test: "Does the utility's output layer add selection, interpretation, or composition beyond forwarding?" If yes, Adversarial Anticipation applies at the synthesis step even when no formal gate is presented.

**Implication**: pure-relay utility documentation may omit adversarial-guard sections and document only the composed process's guard inheritance. Synthesis utilities must document their own adversarial-guard obligations at the synthesis boundary.
