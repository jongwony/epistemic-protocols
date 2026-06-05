# Conduct-Grounding Portable Spec

Portable across any substrate that injects tool descriptions at session start.
Produced by `/conduct` (method design) then `/distill` (portable handoff).

## Portability invariant — reference the description, not the token

Every external capability below is named by its **functional description**, never by a
platform-specific tool token. A consuming agent re-binds each described capability to
whatever tool in **its own** injected tool-description set provides it. This is structural,
not authored: a tool token is the substrate binding (the realization), so excluding the
token leaves only the substrate-invariant capability requirement. Where a substrate has
**no** tool matching a required capability, surface a degradation — do not silently assume it.

## Two levels — epistemic temperament vs session chain

Read this spec on an **Extended Mind coordinate frame**: the agent's epistemic cognition is not
bounded by the model but coupled with the Harness session's extension surfaces. The five conduct
axes — **order · independence · reconciliation · termination · routing** — are that coordinate
frame. Two distinct levels live on it, and this document defines both:

- **Temperament (schema-resident, cross-session)** — the standing epistemic equipment carried
  between sessions **in this schema, not in agent memory**: the seven **Patterns**, the **Moves**,
  and the **Capabilities** below — external scaffolding, referenced and re-bound, not re-invented
  per session.
- **Session chain (one instantiation)** — a concrete trajectory through the frame for one task:
  the **Region A → B → C → D** topology below is one such chain (here, grounding the seven
  patterns). It is ephemeral.

How each capability and move is realized — through whatever extension interfaces the consuming
runtime exposes — is **matter**: the runtime's own pluggable concern, resolved per-runtime in the
preflight binding ledger (§Preflight binding ledger), not enumerated in this form. The form names
only required behavior; the temperament stays a portable **temperament schema** precisely because
the matter is left to the consumer.

## Handoff contract

- **Recipient**: zero-memory fresh agent on any substrate with tool-description injection.
- **Next task**: execute the conduct topology below to produce *source-grounded conduct-methodology
  elements* — each of the seven patterns mapped onto a conduct axis with a cited source.
- **Allowed sources**: the seven pattern definitions (inline below, §Patterns), the epistemic-move
  definitions (§Moves), capability C1–C3 (§Capabilities), and the open web via C1/C2.
- **Execution scope**: run the four-region pipeline; produce the grounded mapping. No file mutation
  required to produce the mapping itself. *(The pipeline is one instantiation of the temperament:
  this document provides both the temperament definition — frame · Patterns · Moves · Capabilities —
  and this canonical chain that uses it.)*
- **Verification**: every pattern resolves to a conduct axis with a cited, retrievable source.
- **Stop condition**: establishment (Region C) produced AND the mapping-base checkpoint passed.

## Capabilities (description-level; re-bound per substrate)

These wrap the consuming substrate's tool set as temperament scaffolding — at the preflight binding
ledger, map each substrate's tool descriptions onto the coordinate frame (5 axes + C1–C3 + Moves).
Bind by **required behavior only**; which extension interface realizes a behavior is matter, the
runtime's own concern.

- **C1 — autonomous multi-source research**: given a topic, autonomously gather from multiple
  sources (web pages, documents) and return a synthesized, source-attributed answer, with a
  breadth/depth control for narrow vs. many-subtopic tasks. *(Region A.)*
- **C2 — single-query fact lookup**: given a query, return current factual snippets with source
  URLs. *(Region B fact-grounding.)*
- **C3 — cross-reasoner verification**: delegate an independent re-check to a reasoner of a
  **different model family** than the executor. If the substrate exposes no distinct-family
  reasoner, this is a surfaced infeasibility (see §Degradations), not a silent skip. *(Region D.)*

## Moves (named by deficit→resolution; re-bound to a protocol where available)

- **M-frame** — FrameworkAbsent → FramedInquiry: simulate multiple **isolated** perspectives to
  constrain an inquiry without biasing it; each perspective searches independently.
- **M-inquire** — ContextInsufficient → InformedExecution: gather the facts a task needs before
  acting; fact-grounding.
- **M-sublate** — ContextSuspect → VettedContext: dialectically audit gathered context for
  provenance and support-integrity (does the evidence track what it asserts, not merely exist).
- **M-ground** — MappingUncertain → ValidatedMapping: validate a mapping between a source domain
  and a target domain.

## Patterns — the seven dynamic-workflow methodologies (inline; not re-derivable)

On the Extended Mind frame these are a standing **temperament layer** the agent carries across
sessions — not chains re-invented each time — read at temperament scale on the coordinate frame.

1. **Adversarial Verify** — per claim, run ≥3 independent verifiers each tasked to *refute* (not
   confirm); accept if a majority fail to refute, discard if a majority refute. Counters
   confirmation bias.
2. **Perspective-Diverse Verify** — check one result through genuinely *distinct* lenses
   (computational consistency, source credibility, unit/standard consistency, reproducibility);
   accept only if all lenses pass. Similar lenses collapse to redundant questioning.
3. **Judge Panel** — generate several independent drafts from different stances (e.g. MVP-first,
   risk-first, user-first), score each by criteria, then base on the top draft while grafting the
   strengths of the runners-up.
4. **Loop-until-dry** — keep spawning finders until K consecutive rounds surface nothing new.
   Dedup against *all seen* items, not just accepted ones, or the loop never converges.
5. **Multi-modal Sweep** — search the *same* target via different routes (by-document, by-keyword,
   by-entity, by-time, by-source) in parallel, then merge and dedup. Distinct from topic
   decomposition: one target, many paths.
6. **Completeness Critic** — before finalizing, a dedicated critic asks "what is missing?" —
   un-run modalities, unverified claims, unread sources, dropped branches/segments. Found gaps
   become the next round's work. Give it concrete checklist items, not a vague "anything missing?".
7. **No silent caps** — whenever coverage is reduced (top-N, sampling, budget/time limit, no-retry),
   explicitly disclose what was dropped (e.g. "108 of 128 candidates unprocessed") in logs and the
   report. Silence about the cut is the larger risk than the cut.

## Preflight binding ledger (before Region A)

Before running Region A, bind this temperament to the runtime: for each of **C1, C2, C3, M-frame,
M-inquire, M-sublate, M-ground**, produce one ledger row → its **local realization** (a concrete
tool or interface this runtime exposes) **or a surfaced degradation** (no matching realization).
Bind by **required behavior only**; how a runtime exposes that behavior — through whatever extension
interface it has — is matter, not prescribed here. The ledger is the temperament made executable on
this runtime; the session chain (Region A → D) then runs over it.

## Conduct topology (substrate-free)

Order: a dependency chain, Region A → B → C → D. *(One instance of a session chain defined over the
Extended Mind coordinate frame — the temperament above, instantiated for this task.)*

- **Region A — broad source exploration.** Several *isolated* perspectives (M-frame), each using
  **C1**, sweep the literature for how each pattern is named/grounded (academic + industry lineage).
  Reconciliation = **adversarial refutation, then synthesis** (refute weak sources first, synthesize
  the survivors). Termination = **loop-until-dry** with an explicit ceiling: stop on 2 consecutive
  empty rounds, hard cap 5 rounds. Routing → Region B.
- **Region B — verification.** Sequential: **fact-grounding** (M-inquire, using **C2**) first, then
  **provenance audit** (M-sublate) on top of it. Context is **shared** by design — the facts prime
  the provenance audit (intended framing; see §Degradations). Routing → Region C.
- **Region C — establishment.** Map the seven patterns onto conduct's five axes (M-ground), with the
  Region-B-vetted sources as citations. Routing → Region D.
- **Region D — final cross-check.** Independent re-verification by **C3** (a different-family
  reasoner). Routing → return to user.

Conduct's five axes (named inline so the mapping is executable):
**order · independence · reconciliation · termination · routing.**

## Precision classification (which re-entries need human judgment)

Only judgment-bearing re-entries surface; routine continuation is autonomous. This raises the
precision of the recognition surface (surfaced points / decision-relevant points → 1).

- **Always surface** (human judgment): **CP-mapping** — mapping-base adequacy, after Region B,
  before Region C. This is the last checkpoint; establishment and final-check are delegated past it.
- **Conditionally surface**: **CP-source** (source-base adequacy, after Region A) and the
  **hard-cap-hit** event — surface only when the cap is reached or yield falls below threshold.
- **Auto-continue** (no surface): every other loop iteration and routing step.

## Degradations (surfaced, never silent)

- **Region B shared context**: region isolation is relaxed (fact-grounding output is visible to the
  provenance audit). This is **intended** — the facts give the audit a grounded base — recorded as
  design, not accident.
- **Region D cross-reasoner**: requires a reasoner of a different model family. On a single-reasoner
  substrate this is a surfaced infeasibility; fall back to a same-reasoner adversarial self-check and
  note the reduced independence.

## Task-state block (restorable)

| id | subject | restore_status | source_ref |
|----|---------|----------------|------------|
| A  | broad source exploration | pending | §Conduct topology, Region A |
| B  | verification (fact → provenance) | pending | §Conduct topology, Region B |
| C  | establishment (pattern→axis mapping) | pending | §Conduct topology, Region C |
| D  | final cross-reasoner check | pending | §Conduct topology, Region D |
