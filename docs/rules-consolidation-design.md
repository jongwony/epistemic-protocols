# Rules Consolidation Design (Issue #434)

## Executive Summary

Issue #434 asks two things: re-baseline the `## Rules` classifications against current state (measurement — done by PR #580), and **decide which protocols still benefit from consolidation** (disposition — the open decision). PR #580 ranks the seven by payoff/risk but presupposes all seven eventually run. This doc resolves the prior question PR #580 leaves open: **how far should the batch go at all?**

**Key Decision**: **Targeted subset.** Run standalone consolidation PRs for only the top three — Epharmoge → Periagoge → Analogia (where a heavy Tier-3/Tier-4 body actually exists and risk is Low–Med) — and drop the bottom four (Elenchus, Katalepsis, Prothesis, Syneidesis) to **opportunistic ride-along**: consolidate only when the file is already being edited for other reasons. Two structural findings (below) cap the batch's upside and argue against running all seven as standing work.

**Tier-5 Action** (survives regardless of disposition): add the `(Safeguard tier)` annotation to the three protocols missing it (Analogia 13, Prothesis 12, Katalepsis 11) and inline the Actionable revision criterion on `Gate integrity`. Runnable as a single cross-protocol sweep PR even if every body-migration is declined.

> **Premise verification (live HEAD, this revision).** The doc's load-bearing facts were re-checked against the current SKILL.md files, not trusted from the tracker: top-level rule counts match live for all seven (16/18/17/15/13/15/18); the Tier-5 annotation drift is exactly current — `(Safeguard tier)` present in Periagoge/Epharmoge/Syneidesis/Elenchus, missing in Analogia (13)/Prothesis (12)/Katalepsis (11), rule numbers confirmed. One stale reference found: **issue #434 cites the framework at `.claude/rules/safeguards.md`; it actually lives at `.claude/principles/safeguards.md`** (PR #580 and this doc use the correct path).

---

## Framework

### Consolidation Scope

The six-tier classification framework (`safeguards.md` → `Rule Classification Framework`) separates consolidation candidates:

| Tier | Anchor | Action | Payoff |
|---|---|---|---|
| 1. Axiom | A1–A6 | KEEP 1–2-line restatement | Low (already minimal) |
| 2. Derived | Derived principles | KEEP anchor reference | Low (already minimal) |
| 3. Architectural | Core Principle / Phase prose / UX Safeguard | **MIGRATE paragraph body** | **High** |
| 4. Cross-protocol | Distinction from another protocol | **MOVE to Distinction section** | **High** |
| 5. Safeguard | `safeguards.md` / Trajectory-Candidate match | **ANNOTATE + inline criterion** | **Medium** |
| 6. Edge/Audit | Project UX, non-invariant | Move to UX Safeguards / Edge cluster | Low |

**Payoff concentration**: Tiers 3 and 4. Tiers 1/2/5 are already minimal; reduction is in collapsing Tier-3 bodies into Phase prose and Tier-4 cross-protocol rules into Distinction sections.

### Common Spine (Preserve Exactly)

These rules recur near-verbatim in every candidate protocol — they are **not** consolidation targets. They anchor to axioms/derived principles and carry no paragraph duplication:

- `AI-guided, user-{resolved/judged/validated}` (Rule 1, Tier 1 A2)
- `Recognition over Recall` (Tier 1 A1)
- `Convergence persistence` (Tier 1 A3)
- `Context-Question Separation` (Tier 1 A6)
- `Convergence evidence` (Tier 2, derived)
- `Option-set relay test` (Tier 2, A5 + Differential Future Requirement; *except Katalepsis by design*)
- `Zero-{gap/mismatch/result} surfacing` (Tier 2)
- `Gate integrity` (Tier 5, Safeguard)
- `Plain emit discipline`, `Round-local salience bundling`, `Formal blocks are runtime-normative` (all Tier 3, architectural spine)

Katalepsis **exception**: correctly carries **no** `Option-set relay test` rule — 1-correct option sets are excluded from A5 / Differential Future Requirement by design. Preserve this absence in any consolidation.

---

## Current State (Measured at HEAD)

| Protocol | SKILL.md | Current total | Top-level | Sub-letter |
|---|---|---:|---:|---|
| Periagoge | periagoge/skills/induce/SKILL.md | **18** | 16 | 6a, 10a |
| Epharmoge | epharmoge/skills/contextualize/SKILL.md | **18** | 18 | — |
| Analogia | analogia/skills/ground/SKILL.md | **18** | 17 | 16a |
| Prothesis | prothesis/skills/frame/SKILL.md | **15** | 15 | — |
| Syneidesis | syneidesis/skills/gap/SKILL.md | **13** | 13 | — |
| Katalepsis | katalepsis/skills/grasp/SKILL.md | **19** | 15 | 7a, 9a, 9b, 14a |
| Elenchus | elenchus/skills/sublate/SKILL.md | **18** | 18 | — |
| **Total** | | **119** | 112 | 7 sub-letters |

**Premise validation** (#434): counts diverge from both #372 targets and #434's creation-time snapshot — mechanical count targets mislead; current state is the source of truth.

---

## Two findings that bound the decision

### Finding 1 — the reduction ceiling is structural, and low

The **common spine** (above) recurs near-verbatim across all seven candidates *and* the four already-consolidated precedents (Aitesis / Prosoche / Anamnesis / Horismos) — duplicated ~11× across the suite. That looks like the largest consolidation target in the repo, but it is not addressable:

- The spine is **already minimal** per protocol (each entry is a 1–2 line axiom/derived/safeguard anchor — Tiers 1/2/5). There is no body to migrate.
- Extracting the spine into one shared doc is **forbidden by the runtime contract**: *"SKILL.md must be self-contained. Do not require runtime readers to chase contributor-only docs, axiom identifiers, rule paths …"* (CLAUDE.md → Runtime Contract). The 11× duplication is the **intended** cost of self-containment, not waste to collapse.

So the entire reduction surface is the Tier-3 paragraph bodies + Tier-4 cross-protocol rules — and that surface is thin: genuinely heavy only at Epharmoge (rule 17, the meta-backbone certificate), tapering to one or two bodies (Syneidesis, Elenchus) or colliding with load-bearing invariants (Katalepsis 9b, Prothesis 3–6) below the top three.

### Finding 2 — the batch fights the project's actual cadence

1. **Drift treadmill, empirically demonstrated.** Current counts diverge from **both** prior snapshots — #372 targets *and* #434's creation-time snapshot — for **every** protocol. This is the third re-baseline of the same tracker (#372 → #434 → PR #580), each invalidated by unrelated protocol work before it could be executed. A standing seven-PR batch is a moving target: any protocol edited for other reasons re-drifts its row before its consolidation PR lands.
2. **Opportunistic consolidation is the revealed practice.** The most recent candidate-touching commit on `main`, `ee08fe7` (white-bear audit: prohibition → positive grounding), restated a Periagoge body **as a ride-along** — outside any #434 batch, when that audit was already touching those files. The project already refines protocol bodies piecemeal at edit time; the batch tracker is not how the actual reduction has been happening.

Together: the batch's standing cost (re-drift maintenance, seven reviews) is paid against a ceiling Finding 1 caps low, while the project's own cadence already captures the same gains opportunistically at lower cost. This is what moves the disposition from "all seven" to "top three now, rest opportunistic."

---

## Track A — Per-Protocol Analysis & Consolidation Candidates

### Periagoge (`/induce`) — 18 rules

**Tier Tally**: Axiom 4 · Derived 3 · Architectural 8 · Cross-protocol 2 · Safeguard 1 · Edge 0

**Reduction Surface**:
- Rules 3, 4, 5, 10a (Tier 3 architectural bodies) → Phase prose
- Rules 8, 11 (Tier 4 cross-protocol) → Distinction from Other Protocols section
  - Rule 11 carries the heaviest cross-protocol body (Analogia misfit colimit-shaped routing)

**Implementation Plan** (Periagoge PR):
1. Collapse rules 3–5 (Calibration/Calibrative Induction/Socratic move preservation) into a unified Phase 1 & 2 narrative in `## Phases`; keep 1-liner invariants
2. Extract rule 10a (OpenTrace residual disposition) into Phase prose; retain rule-form as a Safeguard sub-rule
3. Create `## Distinction from Other Protocols` and move rules 8 & 11; rule 11 body explains the colimit-shaped routing to `/ground`
4. Preserve all endpoint + morphism semantics
5. Add Tier-5 annotation to rule 13 (already present); inline Actionable revision criterion

**Expected outcome**: ~8–12 fewer rules, ~400–600 words of Phase prose added, no semantic change.

### Epharmoge (`/contextualize`) — 18 rules

**Tier Tally**: Axiom 4 · Derived 4 · Architectural 8 · Cross-protocol 1 · Safeguard 1 · Edge 0

**Reduction Surface**:
- Rule 15 (Applicability fit map is support only) → Phase prose
- Rule 16 (Certificate-passing mismatches tracking) → Safeguard body
- **Rule 17** (Registration-time deficit-fit certificate, dual-axis revalidation) → Distinction section — **heaviest paragraph body in candidate set**; embeds multi-protocol routing to `/gap`, `/inquire`, `/bound`, `/distill`

**Implementation Plan** (Epharmoge PR — **Lead candidate**):
1. Migrate rule 17's certificate-spec and routing logic to `## Distinction from Other Protocols` (Epharmoge's largest consolidation payoff)
2. Move rule 15's fit-map commentary to Phase 2 prose; keep 1-liner invariant
3. Enhance rule 16 under `## Safeguards` with the mismatch-tracking details
4. Add Tier-5 annotation to rule 11 (already present); inline Actionable revision criterion
5. Preserve all endpoint + runtime contract

**Expected outcome**: ~10–13 fewer rules, ~800–1000 words of Phase prose + Distinction section, highest payoff of all seven protocols.

### Analogia (`/ground`) — 18 rules

**Tier Tally**: Axiom 4 · Derived 4 · Architectural 8 · Cross-protocol 1 · Safeguard 1 · Edge 0

**Reduction Surface**:
- Rule 16 (Protocol-native pressure map / CorrespondenceFitMap) → Phase prose
- **Rule 16a** (Self-grounding / split-vs-trim partition reading) → Distinction section — heavy body; routes to `/conduct`, `/induce`

**Implementation Plan** (Analogia PR):
1. Migrate rule 16a body to `## Distinction from Other Protocols`; document the split-vs-trim partition strategy and its relation to `/conduct` merge logic
2. Move rule 16's fit-map narrative to Phase 1 (Domain Decomposition) prose; retain invariant 1-liner
3. **Tier-5 action**: Add `(Safeguard tier)` annotation to rule 13 (currently missing)
4. Inline the Actionable revision criterion on rule 13
5. Preserve all endpoint + morphism semantics

**Expected outcome**: ~8–10 fewer rules, ~500–700 words of Phase + Distinction prose, Tier-5 annotation fixed.

### Prothesis (`/frame`) — 15 rules

**Tier Tally**: Axiom 2 · Derived 3 · Architectural 9 · Cross-protocol 0 · Safeguard 1 · Edge 0

**Reduction Surface**:
- Rules 3–6 (Tier 3: lens-formation tool invariant, substrate-invariance, no inline synthesis, independence-before-contamination) — **load-bearing core invariants**
- Prothesis already carries `## Adversarial Guards` and `## Known Limitations` sections (partial Tier-3 migration surface)

**Implementation Plan** (Prothesis PR — **High-risk, opportunistic**):
1. **Consolidate only within existing guard sections**: rules 3–6 bodies → `## Adversarial Guards` / `## Known Limitations`; preserve every invariant 1-liner in `## Rules`
2. Move rule 1 (Mission Brief confirmation TOOL GROUNDING) detail into Phase 0 narrative
3. Retain all core-invariant rule forms as-is (they exist to enforce false-convergence/arranger-creep/executor-creep guards)
4. **Tier-5 action**: Add `(Safeguard tier)` annotation to rule 12 (currently missing)
5. Inline the Actionable revision criterion on rule 12
6. Verify zero semantic drift in `/frame`'s activation + boundary enforcement

**Expected outcome**: ~4–6 fewer rules, ~200–300 words of guard section expansion, no behavior change.

**Caution**: Behavior-sensitive due to load-bearing invariants; migrate bodies only, keep rule forms.

### Syneidesis (`/gap`) — 13 rules

**Tier Tally**: Axiom 2 · Derived 5 · Architectural 5 · Cross-protocol 0 · Safeguard 1 · Edge 0

**Reduction Surface**:
- Rule 12 (Protocol-native pressure map / GapPressureMap) → Phase prose
- No cross-protocol rules; already lean

**Implementation Plan** (Syneidesis PR — **Opportunistic only; minimal payoff**):
1. Move rule 12's pressure-map detail into Phase 1 (Observable Regulation) prose
2. Preserve Tier-5 annotation (rule 9 already has `(Safeguard tier)`)
3. Inline Actionable revision criterion on rule 9 if not already present
4. Include in consolidation sequence only if resource permits

**Expected outcome**: ~1–2 fewer rules, ~100–150 words of Phase prose, minimal consolidation benefit.

### Katalepsis (`/grasp`) — 19 rules

**Tier Tally**: Axiom 3 · Derived 2 · Architectural 10 · Cross-protocol 1 · Safeguard 1 · Edge 2

**Reduction Surface**:
- Rules 7, 7a (Proposal ejection, continuation cursor) → Phase prose
- Rule 14 (ComprehensionRouteMap) → Phase prose
- **Rule 14a** (Horizon boundary / Katalepsis-Prothesis seam) → Distinction section — heavy body
- Rules 4, 5 (Task tracking, Code grounding — Tier 6 Edge/Audit) → UX Safeguards / Edge cluster

**Implementation Plan** (Katalepsis PR — **High-risk; verification-category**):
1. Migrate rule 14a (Horizon boundary) to `## Distinction from Other Protocols`; document Katalepsis/Prothesis boundary semantics
2. Move rules 7, 7a, 14 bodies to Phase 2 (Intent Scent & Comprehension Route) prose; retain invariant 1-liners
3. Relocate rules 4, 5 to `## UX Safeguards` or end-of-Rules edge cluster
4. **Tier-5 action**: Add `(Safeguard tier)` annotation to rule 11 (currently missing)
5. Inline the Actionable revision criterion on rule 11
6. **CRITICAL**: Preserve rule 9b (active-turn fail-closed, Tier 3 load-bearing) exactly — no alteration; this is recent behavior-critical code
7. **CRITICAL**: Preserve the absence of `Option-set relay test` (A5 exclusion by design for 1-correct option sets)

**Expected outcome**: ~7–10 fewer rules, ~600–800 words of Phase + Distinction prose, Tier-5 annotation fixed; **no behavior change**.

**Caution**: Highest current count (19); verification-category due to fail-closed semantics and A5 exclusion. Preserve 9b exactly.

### Elenchus (`/sublate`) — 18 rules

**Tier Tally**: Axiom 3 · Derived 4 · Architectural 10 · Cross-protocol 0 · Safeguard 1 · Edge 0

**Reduction Surface**:
- Rule 9 (Antithesis must be dialectical — Patterns A–D) → Phase prose (procedural routing to `/inquire`, `/attend`)
- Rule 15 (Claim-relative provenance / ProvenanceTag) → Phase prose
- Rule 17 (Inference-fallacy archetypes are principle, not closed catalog) → Phase prose
- Rule 16 (Currency is not support-integrity) — already restates named Derived principle; collapse to anchor reference

**Implementation Plan** (Elenchus PR):
1. Migrate rule 9's Patterns A–D procedural logic to Phase 2 (Antithesis Formation) prose; retain invariant 1-liner
2. Move rule 15's provenance-tracking detail into Phase 3 (Resolution) prose
3. Move rule 17's fallacy-archetype narrative into Phase 2 (Antithesis Formation) prose; document emergence principle
4. Replace rule 16 with a simple anchor reference to `Currency is not Support-Integrity` (Derived principle)
5. Preserve Tier-5 annotation (rule 11 already has `(Safeguard tier)`)
6. Inline Actionable revision criterion on rule 11
7. Preserve all `/sublate` antithesis Patterns A–D semantics exactly — migrate bodies only

**Expected outcome**: ~8–10 fewer rules (rule 16 collapses to reference), ~700–900 words of Phase prose, no semantic change.

**Caution**: Behavior-sensitive; patterns are foundational. Migrate bodies only; preserve invariant 1-liners.

---

## Track B — Consolidation Sequence

Rank protocols by **Tier-3 body weight + Tier-4 cross-protocol count**, discounted by behavior-preservation risk. This yields a prioritized PR sequence:

| Rank | Protocol | Reduction payoff | Risk | Notes |
|---|---|---|---|---|
| **1** | **Epharmoge** | Rule 17 = heaviest meta-backbone certificate body | Low | **Lead PR** — strongest standalone payoff |
| **2** | **Periagoge** | 4 architectural bodies + 2 cross-protocol rules (8, 11) | Low-Med | Clean Distinction extraction; follow Epharmoge |
| **3** | **Analogia** | Rule 16a cross-protocol body + fit-map (16) | Med | Fit-map work in flight per #434; medium payoff |
| **4** | **Elenchus** | Antithesis-pattern bodies (9, 15, 17); rule 16 → anchor | Med | Framework applies without changing `/sublate`; good payoff |
| **5** | **Katalepsis** | Highest count (19); bodies 7, 7a, 14 + 14a Distinction; 4, 5 → Edge | **High** | Verification-category; preserve 9b fail-closed + A5 exclusion |
| **6** | **Prothesis** | Heavy core-invariant bodies (3–6) | **High** | Opportunistic; migrate into existing guard sections only; no broad churn |
| **7** | **Syneidesis** | One body (12) only | Low | Opportunistic — minimal payoff; defer unless resource-rich |

**Sequencing rationale**:
- Epharmoge leads: standalone high payoff, lowest risk.
- Periagoge follows: clean extraction, low risk.
- Analogia/Elenchus mid-sequence: good payoff, manageable risk.
- Katalepsis/Prothesis tail: high-risk due to load-bearing invariants; verify behavior preservation rigorously.
- Syneidesis optional: minimal benefit; include only if consolidation momentum is strong.

---

## Tier-5 Annotation Drift — Uniform Action

**Current state**: The `Gate integrity` rule (Tier 5, Safeguard) carries the explicit `(Safeguard tier)` annotation in Periagoge, Epharmoge, Syneidesis, Elenchus (and consolidated Aitesis/Prosoche/Horismos precedents) — but the annotation is **missing** in Analogia (13), Prothesis (12), Katalepsis (11).

**None of the seven candidates** inline the Actionable revision criterion on `Gate integrity` in-rule; `safeguards.md` lists only Aitesis / Prosoche / Horismos full-form, Anamnesis abbreviated.

**Action** (per-protocol PR):

For each protocol:
1. Add `(Safeguard tier)` annotation to the `Gate integrity` rule where missing (Analogia, Prothesis, Katalepsis)
2. After the rule, add a one-sentence inline Actionable revision criterion, e.g.:

   > **Rule 13** — Gate integrity (Safeguard tier): [rule text]. *Actionable revision criterion: Does this rule block an actual gate-integrity failure (a scenario where the protocol's endpoint would be invalid despite the rule's absence), or does it enforce a decision that could transfer to Phase prose?*

3. For protocols that already have the annotation (Periagoge, Epharmoge, Syneidesis, Elenchus), verify the inline criterion is present; add if absent.

This normalizes the annotation pattern across all seven and grounds future Safeguard-tier decisions in the framework.

---

## Per-Protocol PR Template

One protocol per PR (unless mechanically identical; unlikely). Each PR includes:

**Header**:
- Issue reference: `Closes #434` or `Ref #434`
- Before/after rule count
- Example: `Epharmoge: 18 → 15 rules (certificate spec + fit-map bodies → Phase prose + Distinction)`

**Body sections**:
1. **Consolidation rationale** — which rules are Tier 3/4 and why they move
2. **Implementation details** — where bodies migrate (Phase prose section, Distinction section, Safeguards, Edge cluster)
3. **Verification claims**:
   - Endpoint semantics unchanged
   - Morphism unchanged
   - Runtime contract unchanged
   - Behavior-sensitive rules (e.g., Katalepsis 9b, Prothesis 3–6) preserved exactly
4. **Tier-5 action** — annotation + inline criterion (if applicable)
5. **Testing**:
   - `node .claude/skills/verify/scripts/static-checks.js .` (fail 0)
   - `node --test scripts/package.test.js` (if runtime-contract views shift)
6. **Plugin version bump** — patch only (SKILL.md edit only; this tracker doc does not warrant a bump)

**Example for Epharmoge**:

```markdown
## Consolidation Rationale

Epharmoge carries 18 rules, with Tier-3 and Tier-4 bodies concentrated in rules 15–17:
- Rule 15: Applicability fit-map detail (Tier 3) → Phase 2 prose
- Rule 16: Mismatch tracking (Tier 3) → Safeguard body
- Rule 17: Certificate spec + multi-protocol routing (Tier 4) → Distinction section (heaviest body)

Outcome: 18 → 15 rules; ~900 words of Phase + Distinction prose; no endpoint/morphism change.

## Tier-5 Action

Rule 11 (`Gate integrity`) already carries `(Safeguard tier)` annotation. Inline the Actionable revision criterion:

> Rule 11 — Gate integrity (Safeguard tier): ... *Actionable revision criterion: Does this rule block a gate-integrity failure (endpoint invalid without it) or enforce a transferable decision?*

## Verification

- Endpoint: Applicability-certificate production unchanged
- Morphism: Evidence-grounded registration → deficit-fit certificate (same)
- Runtime contract: Certificate structure and dual-axis revalidation preserved
- Behavior: Mismatch tracking remains in evidence layer

Testing:
- `npm test` passes
- `node .claude/skills/verify/scripts/static-checks.js .` → fail 0
```

---

## Acceptance Criteria (from #434)

1. **Current-state classification replaces stale #372 targets** — PR #580's re-baseline (premise-checked current above) supplies the measurement; this doc's disposition decision (targeted subset) sets which consolidation work actually proceeds.
2. **Each protocol preserves endpoint + runtime contract** — all proposed moves keep the protocol's essential behavior unchanged.
3. **No rule removed merely for duplicating contributor docs** — reduction is in moving bodies to prose sections, not deleting rule structure. Runtime self-containment wins.
4. **Safeguard-tier rules retain actionable revision criterion where still needed** — Tier-5 annotation drift is fixed uniformly; all seven protocols document the criterion.

---

## Disposition — the decision #434 leaves open

PR #580 ranks *order*; the open question is *how far the batch goes*. Three dispositions:

- **(A) Full batch** — run Track C for all seven, one PR per protocol, in ranked order. Uniform framework application across the suite.
- **(B) Decline the batch** — keep PR #580 as the reference tracker; consolidate only opportunistically (ride-along). No standalone consolidation PRs.
- **(C) Targeted subset** — run the high-payoff, low-risk PRs now; drop the rest to opportunistic. Converts PR #580's ranking into a cut line.

The two findings above settle this against (A): the reduction ceiling is structural and low (Finding 1), and a standing seven-PR batch fights the project's drift cadence (Finding 2). (B) under-captures the one genuinely heavy payoff (Epharmoge rule 17). **(C) is the fit** — capture the real reduction at the top, refuse the treadmill below it.

## Recommendation — (C) Targeted subset

Run **only the Track B top three** as standalone PRs now — **Epharmoge → Periagoge → Analogia** (all Low/Med risk, where a heavy Tier-3/Tier-4 body actually exists) — and **drop the bottom four to opportunistic ride-along**:

- **Epharmoge** (lead): rules 16/17 are the heaviest bodies in the set; the largest single reduction in the repo. Clear win.
- **Periagoge**: clean Distinction extraction (rules 8/11) + four architectural bodies. Low risk, no load-bearing collision.
- **Analogia**: rule 16a cross-protocol body + fit-map (16); #434 notes fit-map work already in flight, so this rides an existing edit surface.
- **Elenchus / Katalepsis / Prothesis / Syneidesis → opportunistic only.** Katalepsis and Prothesis carry High behavior-preservation risk (9b fail-closed; core-invariant guards) for modest payoff; Syneidesis is already lean (one body); Elenchus is behavior-sensitive (antithesis Patterns A–D). Consolidate each *only* when it is already being edited — the `ee08fe7` pattern.

This cut is not imposed on the sources — it is **latent in both**: #434's own per-protocol language ("Epharmoge and Periagoge: highest …"; "Analogia/Syneidesis: opportunistic only"; Katalepsis/Prothesis "handle carefully / avoid broad churn"; Elenchus "include only if …"), and PR #580's risk-discounted Track B order. This doc's contribution is to treat the rank-4 boundary as a **disposition cut** (do-now vs opportunistic), not merely a running order.

**Sub-decision (only if PRs run): packaging.** Use one PR per protocol, not a single mega-PR — each consolidation stays independently reviewable and behavior-verifiable, and a high-risk protocol (Katalepsis, Prothesis) cannot block the rest. The mega-PR's only draw (one merge point) is outweighed by lost per-protocol rollback.

**The Tier-5 sweep runs regardless of the cut** — see Tier-5 section. It is mechanical, near-zero-risk, and independent of body-migration; recommended as one cross-protocol PR even under (B).

## Open fork for the human

1. **Disposition**: (A) full seven-PR batch / **(C) targeted subset — Epharmoge, Periagoge, Analogia now; rest opportunistic (recommended)** / (B) decline the batch entirely (opportunistic-only).
2. **Tier-5 annotation sweep**: run the `(Safeguard tier)` + Actionable-criterion normalization as one cross-protocol PR regardless of (1)? (recommended yes — independent, mechanical.)
3. **PR #580 reconciliation**: PR #580 is an OPEN tracker PR. On adopting (C), either (i) merge PR #580 as the measurement record and let this doc sit beside it as the decision record, or (ii) fold PR #580's Track-A tables into this doc and close #580. Recommended **(i) merge as-is** — premise-checked accurate above; the two split cleanly into *measurement* (#580) and *decision* (this doc), and copying the tables here would duplicate and re-stale them.

## Spec-edit sketch

This is a **decision doc — no SKILL.md edits land from it directly.** It scopes the work the human authorizes:

1. **If (C)** — three standalone consolidation PRs, in order, each per the per-protocol PR template above (before/after count, the Track-A table, *"endpoint and morphism semantics unchanged,"* patch `plugin.json` bump, `static-checks.js` fail 0, plus `node --test scripts/package.test.js` since runtime-contract views shift):
   - PR-1 **Epharmoge**: rules 16/17 bodies → Phase prose; rule 6 (Non-circularity vs Aitesis) → Distinction section.
   - PR-2 **Periagoge**: rules 3/4/5/10a bodies → Phase prose; rules 8/11 → Distinction section.
   - PR-3 **Analogia**: rule 16 fit-map body → Phase prose; rule 16a → Distinction; coordinate with the in-flight fit-map work to avoid a re-drift collision.
2. **Tier-5 sweep PR** (independent): add `(Safeguard tier)` to `Gate integrity` in Analogia/Prothesis/Katalepsis; inline the Actionable revision criterion across all seven. One PR; patch bumps on each edited `plugin.json`.
3. **Per migration, run the semantic-closure sweep** — a body moved from `## Rules` to Phase prose must keep its invariant assertion reachable (the 1-liner stays in Rules, the elaboration moves); verify the runtime-contract view, not source prose alone, so no invariant silently drops.
4. **Declined four** (Elenchus/Katalepsis/Prothesis/Syneidesis): no PR; record in PR #580's Status table as `opportunistic — consolidate at next edit`, so the disposition is durable and the next editor of those files knows to ride along.

---

## References

- `docs/analysis/hermeneutic-inscribe-kind-classification.md` — Gadamer-kind classification (task #454)
- `.claude/principles/safeguards.md` — Rule Classification Framework (Tier 1–6 definitions)
- `.claude/rules/axioms.md` — A1–A6 axiom anchors
- `.claude/rules/derived-principles.md` — Derived principle anchors
- `.claude/principles/architectural-principles.md` — Per-protocol Core Principles
- PR #580 (rules-consolidation-rebaseline.md) — re-baseline tracker; the **measurement source** this doc consumes by reference (Track-A tables, counts, Tier-5 drift). Layer split: PR #580 = measurement, this doc = disposition decision.

---

**Document ID**: task #434 design doc  
**Branch**: `design/epr-backlog`  
**Status**: Design fork ready for human decision
