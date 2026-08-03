# Derived Principles

Logically derived from axiom combinations; derivation source annotated.

Full text of the sections below now lives in `premise/` (a portable, self-contained reference surface). This file keeps the operative headings other files cite by name.

## Surfacing over Deciding

AI makes visible; user judges. This is the behavioral instantiation of Detection with Authority (A2). Full text: `premise/recognition-and-authority.md`.

## Full Taxonomy Confirmation

When a Qc gate operates on a finite, protocol-owned taxonomy with Constitution annotation, present ALL types with detection status, evidence, and falsification conditions — not only the detected subset behind a generic action verb, including the Dead Signal Test for taxonomy design. Full text: `premise/gate-design.md`.

## Differential Future Requirement

Each presented option in a decision gate must occupy a decision-relevant differential-future position. Verification gates are excluded: Katalepsis comprehension probes (1-correct option design by purpose) and Anamnesis Phase 2 recognition gates (past-identity synthesis, not future-trajectory selection) have option structures determined by verification task requirements, not by decision-axis position. Full text, including the cost-symmetric-baggage and meta-action-as-peer failure modes: `premise/gate-design.md`.

## Convergence Evidence

Protocol convergence must be demonstrated, not asserted — a per-item transformation trace, not a bare assertion. Full text: `premise/gate-design.md`.

## Pattern over Tool

The Recognition over Recall principle is a content invariant — the protocol function lies in the structured options pattern, not in the specific tool that renders them. Full text: `premise/gate-design.md`.

## Zero-Shot Instruction Preference

LLM-facing instructions (Output Style, SKILL.md prose, agent prompts) state principles, not examples. When a rendering rule, behavioral guideline, or structural constraint can be expressed as a principle, do not append few-shot examples or category-level mapping lists. Few-shot examples create a soft-table effect — anchoring the model to specific instances rather than letting it apply the principle to novel contexts. A principle that requires examples to be understood is underspecified; fix the principle, do not patch it with examples.

Scope boundary: this principle applies to instructions the LLM interprets and applies at runtime — not to contributor-facing documentation where examples serve comprehension. The boundary test: "would removing this example increase the LLM's latitude in applying the principle to novel contexts, without losing the output-format or behavioral reliability that the containing instruction depends on?" If yes, the example is anchoring and should be removed. An example whose primary effect is stabilizing output format or anchoring a subtle, high-failure-rate behavior is exempt — removing it costs adherence, not latitude. If the example aids human understanding without constraining LLM application, it is outside scope. SKILL.md formal blocks (Definition code blocks) are LLM-facing by definition; prose outside formal blocks in SKILL.md is hybrid (read by both LLMs and contributors) — err toward principle-only in hybrid contexts.

Unnecessary-mention-axis complement: `.claude/principles/safeguards.md §White Bear Avoidance` (Safeguard tier; prohibition framing is its strongest-evidenced form).

## Loop Continuity under Bounded Regret

Within any execution loop, Extension actions must not trigger Stop — the loop continues. Only Constitution actions (genuinely viable alternative paths whose wrong choice creates irreversible divergence) warrant interruption. Full text, including the plan-level aggregation and dual-failure-mode notes: `premise/gate-design.md`.

## Currency is not Support-Integrity

Temporal currency (an artifact exists and is fresh in the current environment) does not establish support_integrity — that the artifact actually tracks the behavior or current reality it asserts. A current-but-unenforced artifact (a comment, doc, or note that claims a behavior with no enforcement channel coupling it to that behavior) is inference dressed as evidence: reading it is not relay (A2), because its basis is not authoritatively citable — the artifact could silently disagree with the behavior it describes. The direct-resolve (relay) path must therefore verify support_integrity (evidence→behavior coupling), not currency alone; evidence that is present and fresh but support-unlinked is routed to verification (observe the behavior) rather than auto-resolved.

Operationally this distinguishes two defeater axes on the admissibility boundary (rebutting/undercutting, per Pollock — two kinds of defeater, not an exhaustive taxonomy of evidence defects): **coverage** (does the evidence span the whole claim?) and **support_integrity** (does the evidence track what it asserts?). Currency is a temporal sub-case of support_integrity, not a peer of it.

Commit-form runtime enforcement is materialized per-protocol in each SKILL.md; Aitesis (`/inquire`) is the first such materialization.

## Task Externalization Boundary

Relocated to `.claude/principles/architectural-principles.md §Task Externalization Boundary` (2026-07-28) — fetch via Read/Grep for the durable-record externalization criteria.

## Reference over Copy

Relocated to `.claude/principles/architectural-principles.md §Reference over Copy` (2026-07-28) — fetch via Read/Grep for the handoff-boundary reference/copy criteria.
