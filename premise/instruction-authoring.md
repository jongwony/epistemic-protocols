# Instruction Authoring

Use this document when authoring or revising instructions and durable records. `recognition-and-authority.md` governs live judgment and provenance; `specification-and-judgment.md` governs what a specification can settle.

## Zero-Shot Instruction Preference (Safeguard)

For instructions a model applies at runtime, state the principle before adding examples or category mappings. Remove an example when the principle preserves the required behavior or format without it. Retain an example whose removal demonstrably loses an independent obligation; fix an underspecified principle rather than relying on examples to supply its missing scope.

Human-facing explanatory examples are outside this preference when they do not constrain runtime application. On a mixed surface, evaluate their effect on the model's application as well. The competing-target test below concerns a different question: whether a named alternative carries a necessary distinction.

## Prohibition Base Rate and White Bear Avoidance (Safeguard)

Prefer a positive statement of the required behavior. A prohibition earns its place through evidence that the unwanted behavior occurs unprompted and a boundary or diagnostic distinction the positive form would lose. Treat this as an authoring safeguard; the heading supplies no claim that a human thought-suppression mechanism transfers to language models.

Apply the same load-bearing test to a retired path named beside its replacement and to a rejected alternative named only to contrast with the intended one. Keep each only where it preserves directive force or boundary meaning, including a decision calibration cue, diagnostic signal, or legacy, migration, or fallback behavior.

Distinguish runtime guidance from diagnostic material. Runtime guidance directs the intended action; a visibly diagnostic section may need to name the failure it enables a reader to detect. Relocating a failure case is valid only when the reader still reaches it at that detection moment.

## Override Gate

Before adding a directive, name the independently grounded obligation it serves. Establish either observed friction under the current default or a gap between the declared contract and the behavior its existing carriers represent. The proposed clause must supply a criterion, test, or procedure that the surviving surface does not already supply.

Reject restatement and new behavior without that ground, and record the reason. If the current default is uncertain, inspect it or state the evidentiary limit; do not turn the author's uncertainty about default behavior into a choice for the runtime reader.

## Zero-Shot Portability

An instruction must resolve without its author's session context. Put environment-specific bindings on the adopting surface.

Bound completeness, absence, and uniqueness claims to the domain actually examined. A finding obtained only after widening a structure applies to that widened structure until re-derived under the original definitions.

## No Duplication (MECE)

Give each rule one authoritative home. Rely on co-presence only where the intended reader actually receives the whole set; otherwise provide a precise point-of-need reference. Where a self-contained delivery surface requires a compiled copy, preserve its source relation and check propagation when either end changes.

## Inscription Economics

Account for the cost of loading, revising, and applying an entry. Consider volatility, relevance at the loading moment, and portability; these are prompts for judgment, not an exhaustive cost taxonomy.

Compose context-specific values from durable principles at the point of need. Place mechanically specified logic in the rigid layer and context-dependent judgment in instructions with runtime ground. Stability of a carrier does not establish stability of the judgment it carries.

## Subtraction at Revision Time

Opening an always-loaded instruction surface for revision puts its existing entries in scope. Establish subtraction candidates before settling additions, and let the obligations the audit exposes shape the change. Audit the surface as opened; a candidate produced by that audit does not recursively trigger another audit.

For each candidate, account for directive force, boundary meaning, decision calibration, diagnostic detection, and legacy, migration, or fallback behavior. Name what survives and where, and what is intentionally retired.

A named record containing no exercise of an entry justifies investigating its role. It establishes neither redundancy nor behavioral preservation; a missing execution record is missing evidence.

### Deletion by Default, Retention on Evidence

The burden sits with retention. An entry not examined remains unexamined, and continued presence is not evidence of necessity. Evidence supporting retention must still cover the intended readers and conditions and preserve support-integrity.

Remove the candidate wholly or to a reduced form, and deliberately exercise its obligations in a bounded comparison. Hold the task and conditions fixed between the baseline and ablated arms. Restore the obligation that failed, using the carrier that serves it; do not automatically restore the surrounding prose.

Report only the readers and conditions actually exercised. Aim at readers on whom the obligation can surface: both readers prone to the guarded error and readers capable of prematurely closing a question that should remain open. Unexercised readers block a universal-removability claim, but do not establish a reason for retention.

Outside the exercised scope, a deletion remains a probe. Leaving it in place requires a route for observed failure to reach someone able to restore it; that route is monitoring, not a successful result. Keep the removed wording and derivation in the ledger so a failed probe is recoverable.

Run an ablation only where failure can be observed without committing an unrecoverable consequence, or where the consequence is recoverable. If that bound or the removal's recoverability is absent, inspect by other means or retain the entry pending an individually justified removal.

### Actionable Revision Criterion (Safeguard)

Revisit a safeguard when changed model behavior, an ablation, or successful compression supplies evidence relevant to its protected obligation. Record the trigger and its scope. Apply the bounded comparison above; an unchanged successful baseline can support preservation within the exercised conditions without demonstrating a lower failure rate.

## Where a Repair Lands

Derive a repair from the problem the artifact resolves, then locate the obligation in its existing structure. The site where a defect was noticed may differ from the site that must change.

- When an addition repeats a structural distinction, use the existing carrier.
- When an addition contradicts an existing clause, determine whether the subject or scope of that clause has moved before adding another.
- When a rule comes from an observed case, limit it to the evidence's reach. A rule derived from a general contract must identify the independent obligation that supports its wider scope.

Remove carriers recoverable from the repaired structure. An addition may still be necessary; neither a smaller diff nor fewer words proves that the repair reached the cause. A directly incorrect value can be corrected where it stands.

## Conflicting Instructions

Two instructions conflict when both are live, bind at the same situation, and cannot both be followed. State any scope distinction used to dismiss an apparent conflict. Distinguish a stale, unadapted copy from a deliberately adapted local rule: the former calls for propagation, the latter for an authority-grounded choice between live instructions.

Do not infer from a run under conflicting instructions that either instruction independently governed it. Re-derive the obligation and remove the conflicting prescription rather than preserving two apparent authorities through cosmetic reconciliation. A more specific repair rule governs its own domain; `gate-design.md` governs adversarial guard consistency.

When an instruction conflicts with live context, derive who may settle the conflict from `recognition-and-authority.md`. Relay a response already fixed by citable ground, exercise an applicable grant within its limits, and leave an unentrusted judgment with its holder. `approach-verification.md` applies this to contradicted task premises.

## Ledger/State Separation

At write time, route rationale, provenance, trade-offs, and rejected alternatives to the project's canonical ledger, whose binding the adopting project declares once. Keep state surfaces for operative contracts and claims coupled to a channel that checks them. An uncoupled assertion must gain that channel, move to the ledger, or be explicitly advisory. The most frequently loaded surfaces carry operative instructions only.

## Currency is not Support-Integrity (Derived)

Before treating evidence as sufficient for relay, check both its coverage of the claim and its support-integrity: whether it actually tracks what it asserts. Freshness alone supplies neither. An artifact asserting behavior without a coupling to that behavior calls for observation of the behavior before relying on the assertion. A normative instruction is evidence of its stated contract, not proof of execution.

## Audience Reach (Architectural)

Deliver a principle through a surface the intended reader reaches before it binds. An upstream explanation alone establishes no runtime delivery. Contributor-facing material must not assume unavailable live-session state, and runtime material must not assume unavailable contributor context.

## Navigation and Integration Cost for the Reader (Architectural)

Place mutually dependent information where the intended reader can find and combine it at the point of need. Account for both retrieval and integration effort; a shorter document can still require more navigation. Neither a reference nor inlining is free by definition. Choose from the actual access path and preserve the source relation.

## Direction over Accumulated Workload (Architectural)

Judge a revision by the problem it resolves and the obligations it preserves, not by sunk authoring effort or the volume it would replace. A full rewrite or broad refactor is legitimate within the authorized direction. Budget validation and propagation explicitly; low authoring effort does not eliminate either.

Distinguish resistance grounded in sunk work from an observed structural deficit. The former supplies no reason to preserve the structure. The latter requires investigation before proceeding, even when abandoning prior work is otherwise justified.
