# Instruction Authoring

This document covers writing instructions and durable records that stay accurate as they age: stating principles instead of examples, not over-mentioning what an instruction wants avoided, gating new directives against actual evidence of need, keeping a written claim support-linked rather than merely current, making sure a principle structurally reaches the reader whose behavior it targets, and routing each sentence — at the moment it is written — to the surface it belongs on. The Currency section below uses the relay/authority distinction from `recognition-and-authority.md` in one place; nothing else here depends on it.

## Zero-Shot Instruction Preference (Derived)

LLM-facing instructions (Output Style, SKILL.md prose, agent prompts) state principles, not examples. When a rendering rule, behavioral guideline, or structural constraint can be expressed as a principle, do not append few-shot examples or category-level mapping lists. Few-shot examples create a soft-table effect — anchoring the model to specific instances rather than letting it apply the principle to novel contexts. A principle that requires examples to be understood is underspecified; fix the principle, do not patch it with examples.

Scope boundary: this principle applies to instructions the LLM interprets and applies at runtime — not to contributor-facing documentation where examples serve comprehension. The boundary test: "would removing this example increase the LLM's latitude in applying the principle to novel contexts, without losing the output-format or behavioral reliability that the containing instruction depends on?" If yes, the example is anchoring and should be removed. An example whose primary effect is stabilizing output format or anchoring a subtle, high-failure-rate behavior is exempt — removing it costs adherence, not latitude. If the example aids human understanding without constraining LLM application, it is outside scope. SKILL.md formal blocks (Definition code blocks) are LLM-facing by definition; prose outside formal blocks in SKILL.md is hybrid (read by both LLMs and contributors) — err toward principle-only in hybrid contexts.

Unnecessary-mention-axis complement: see Prohibition Base Rate and White Bear Avoidance below — that principle operates on the *unnecessary-mention* axis (a competing non-target named without load-bearing reason), where this one operates on the *example* axis (a specific instance offered in place of a stated principle). The prohibition form covered there is its strongest-evidenced case.

## Prohibition Base Rate and White Bear Avoidance (Safeguard)

Two independently-written statements of the same underlying concern converge here. Naming an unnecessary competing target in an instruction holds a language model's attention on it — the way "don't think of a white bear" produces the thought of a white bear. The effect is well-established for humans and does not transfer mechanistically to a language model, but empirical drift observed across LLM-facing instruction updates matches the pattern closely enough to treat as a standing authoring safeguard. A mention of a competing non-target earns its place only when it is load-bearing; each of the forms below carries its own operative ground.

**Base-rate condition**: state a prohibition ("never X", "do not X") only when X has an observed nonzero base rate — evidence that the behavior actually occurs unprompted. When the behavior would not occur unprompted, silence is the stronger default: a written prohibition injects X into every session's context and makes the unprompted action salient (the ironic-process effect the white-bear example names) — actively counterproductive, not merely redundant. When a prohibition does qualify under this condition, prefer an equivalent positive statement of the desired behavior wherever one exists.

Three forms carry the same underlying concern:

- **Prohibition framing** ("do not use W") — weak negation processing, not ironic amplification: negative injunctions are followed less reliably than positive directives. This is the strongest-evidenced form; rewriting a prohibition ("avoid X in the output") into a direct instruction for the intended behavior ("emit Y directly") measurably reduces prohibited-pattern drift in later use.
- **Superseded-path mention** (a positive mention of a path the same instruction retires in favor of a replacement) — governed by an *option-availability test*: naming the retired path can keep it available as a competing action candidate for the model to reach for. Treat this as a conservative authoring heuristic, not an established causal law — apply it as a default, not as a hard requirement.
- **Negated anchoring** ("X is not A but B", where the rejected alternative A carries no further load) — governed by a *negated-anchoring test*: the contrast anchors attention on the rejected alternative even though the instruction's actual content is B. Prefer stating the positive predicate directly instead of contrasting it against a named alternative; this is recorded from accumulated editing practice rather than from a single controlled finding.

**Placement distinction** (authoring-time, section-level): the concern's force varies with the role a section plays inside an LLM-facing document.

- **Runtime motivating prose** — sections that direct what the model does at execution time: behavioral rules, phase-by-phase instructions, system prompts. Here, a named non-target becomes the foreground attractor during application, so prefer stating only the intended path. Use a competing-target mention only when the boundary meaning would collapse without it — check with the rewrite test below.
- **Diagnostic substrate** — anti-pattern lists, tests, checklists framed as failure cases, audit findings, review vocabulary. The section's explicit role is naming failure modes or rejected alternatives for detection, regression coverage, or review; the negative form *is* the section's content, not a runtime instruction, and is compliant by purpose here — provided the section's diagnostic role is visible (a heading that frames it as such is enough).

**Rewrite test** (load-bearing, applies to all three forms and both placements): a rewrite that keeps only the intended path is valid when it preserves both **directive force** (the instruction still binds the same behavior) and **boundary meaning** (the discriminant or detection signal the mention carried still survives). If removing the mention would erase either — a decision-point calibration signal, a diagnostic detection cue, or a needed legacy/migration/fallback case — preserve the original phrasing, or relocate the failure case into a diagnostic section rather than rewriting it away in place.

## Override Gate

A behavioral directive enters an instruction surface only as a **substrate override** — a sharpening of, or a contradiction to, an existing default. An override requires usage evidence showing measurable friction from a failing default, plus specificity beyond the default's own wording (a concrete criterion, a verifiable test, or a procedural obligation). A non-override change — restating an existing default, or adding new behavior with no override reason — is rejected: it dilutes the directives that do change behavior. State the reason when rejecting a change. When it is unclear whether something is already default behavior, say so explicitly rather than deciding silently, and do not surface that classification question as a choice for the reader to resolve.

## Zero-Shot Portability

A rule must function without prior session context — no environment-specific values baked into its wording.

A claim of completeness, absence, or uniqueness names the domain its evidence actually ranged over, for the same reason: the sentence is true of the domain examined and false of the domain meant, and a reader without the originating context cannot tell which one was checked. The mismatch runs the other way when the structure under examination is later widened and re-checked: a finding the widening produces is a property of the widened form only, until it is re-derived under the original's own narrower definitions.

## No Duplication (MECE)

Each rule lives in exactly one place. Files meant to be read together as one context should not cross-reference each other for a rule already present in the set — the referent is already there; define it once and rely on co-presence rather than pointing back to it.

## Inscription Economics

An always-loaded, durable instruction layer is expensive: every entry in it must justify its presence against the cost it imposes on that layer. Known cost axes: update frequency (volatility — how often the entry needs revision), salience (its mere presence primes behavior, whether or not it is relevant this turn), and portability (an environment-pinned value that doesn't travel with the instructions). This set of axes stays open — an entry that feels wrong on none of the known axes signals an axis not yet named.

**Pace layering** (the volatility axis): layer durable artifacts by their own rate of change — the slower content changes, the more rigid a medium it deserves (code outlasts procedure, procedure outlasts data; a stated principle outlasts an environment-specific value). Compose a fast-changing layer from a slow one at the point of need; never the reverse. Corollary — codify only deterministic logic into the rigid layer: steps with a stable, unchanging contract belong in code; fragile or heuristic steps belong in the instruction layer instead, where they can be revised without a structural change.

## Ledger/State Separation

Route every sentence to its proper surface at the moment it is written. A **then-record** — rationale, provenance, a trade-off considered, an alternative rejected — goes to the project's ledger: one canonical, append-only instrument per project, bound once according to the project's own character (absent any other declared binding, the default is the project's own commit-message history). A **now-assertion** belongs on a state surface (the codebase, or its always-loaded instructions) only under a contract qualification: either it prescribes behavior directly, or some enforcement channel actually tracks whether it holds; otherwise, attach an enforcement channel, move the sentence to the ledger instead, or tag it explicitly as advisory. Strictness scales with how often a surface is read — the most frequently loaded instruction surfaces should carry operative rules only, with no narrative content at all.

**New-project setup**: when a project's top-level, always-loaded instruction file is first authored, surface the ledger-binding decision once, explicitly, rather than leaving it implicit. Inscribe only a deviation from the default — an undeclared project's ledger is its commit-message history.

## Currency is not Support-Integrity (Derived)

Temporal currency — an artifact exists and is fresh in the current environment — does not by itself establish **support-integrity**: that the artifact actually tracks the behavior or the current reality it asserts. A current-but-unenforced artifact (a comment, a doc, or a note that claims a behavior with no enforcement channel coupling it to that behavior) is inference dressed up as evidence — reading it is not simple relay (see `recognition-and-authority.md` for the relay/authority distinction this draws on), because its basis is not authoritatively citable: the artifact could silently disagree with the very behavior it describes. The direct-resolve (relay) path must therefore verify support-integrity — the evidence-to-behavior coupling — and not currency alone; evidence that is present and fresh but not support-linked routes to verification (go observe the actual behavior) rather than being auto-resolved.

Operationally this distinguishes two separate defeater axes on the admissibility boundary (rebutting and undercutting, after Pollock — two kinds of defeater, not a claim that these exhaust the ways evidence can fail): **coverage** (does the evidence span the whole claim being made?) and **support-integrity** (does the evidence actually track what it asserts?). Currency is a temporal sub-case of support-integrity, not a peer axis alongside it.

## Audience Reach (Architectural)

Content aimed at a contributor's own decisions does not automatically reach the reader whose behavior it is meant to change. A principle has behavioral effect only when it is structurally embedded in the output that target reader actually receives — documenting it upstream, in material that reader never sees, is not enough.

**Bidirectional Reach**: this partitioning is symmetric. Contributor-facing documentation must not assume runtime state that only a live session has; runtime-facing text must not assume the reader has contributor-onboarding context that only a contributor has read. Each direction of leakage is a distinct failure mode, and both are worth checking for independently.

## Direction over Accumulated Workload (Architectural)

A contributor is not bound by accumulated workload — prior effort already spent, the existing volume of material, or the ripple of dependent content — when judging whether a direction is correct. When a direction is theoretically justified (the existing structure's own internal consistency, the soundness of a classification scheme already in use, the internal consistency of a formal specification), a full rewrite, a large refactor, or invalidating prior contributions are all legitimate choices. Authoring labor trends toward zero under AI-assisted editing; verification labor stays bounded but non-zero and must be budgeted for explicitly. This principle governs the authoring decision itself — it does not make verification overhead vanish, and that overhead still constrains refactor scope through ordinary bounded-investment reasoning. Left unaddressed, a structural misalignment accumulates and pollutes all downstream contributions regardless of whether anyone acts on it now.

Operational test: is resistance to a given refactor grounded in the accumulated work already invested, or in an observed structural deficit (an unsound classification, a broken cross-reference, an internal inconsistency, or convergent evidence of misalignment from actual use)? The former means this principle applies — proceed with the refactor. The latter means halt and investigate the deficit before proceeding with anything. When both grounds are present at once, the structural-deficit reading dominates: halt regardless of how much work has already gone in.

## Actionable Revision Criterion (Safeguard)

Safeguard-tier status is not a passive label — it is an operational commitment to revisit the corresponding guard as evidence accumulates. Revision triggers: (1) a model-version upgrade with demonstrated instruction-following improvement, (2) an observed violation rate sustained below the prior baseline across sessions run on current models, or (3) a successful compression that demonstrates the guard is reducible without losing the outcome it was protecting. When any trigger fires, reduce or remove the guard, and document the reduction together with its empirical basis. This is what keeps a project from carrying obsolete safeguards forward as the underlying models improve.
