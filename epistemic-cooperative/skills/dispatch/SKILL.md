---
name: dispatch
description: "Delegated parallel issue resolution via /dispatch. User sets a minimal delegation contract (or accepts profile-derived defaults); AI categorizes open issues by project mission/direction (read from the project guide) and evidence-accumulation status (whether substrate-cited locks are satisfied), fans out per-category sub-branches with per-category PRs, then loads review feedback and inscribes rejection traces to the linked issues so a fresh-context next session can re-enter without re-deriving the rejection. Reads the project's profile rule and editing conventions for personalization. Use when the user asks to 'resolve as many open issues as possible', 'process the open backlog', 'work through pending issues', or invokes /dispatch."
---

# Dispatch: Delegated Parallel Issue Resolution

Crystallizes a delegated multi-issue workflow into a categorical-decomposition + per-category-PR pipeline with rejection-feedback inscription. Reads the project's personalization rules at activation; the workflow itself is universal.

**This is an orchestration skill, not a single-issue executor.** It composes `/bound` for delegation contract setup, classifies issues by **project mission/direction** (the project's stated direction read from its guide — `northstar` for short) and **evidence-accumulation status** (whether substrate-cited locks like "depends on #X" or "pilot data accumulating" are satisfied), fans out work into per-category sub-branches, then loads PR review feedback and inscribes rejection traces to the linked issues so the next fresh-context session can re-enter without re-deriving the rejection.

## Pipeline Overview

```
                                                     ┌→ INSCRIBE  (Phase 6 — rejected branch)
DETECT → BOUND → SCAN → CATEGORIZE → FANOUT → FEEDBACK
 (silent) (gated)              (per-cat loop)  (per-PR fork)
                                                     └→ COMPLY    (Phase 7 — compliant branch)
```

Phase 1 (BOUND) composes `/bound`. Phase 2-3 (SCAN, CATEGORIZE) run autonomously with northstar + evidence-accumulation axes. Phase 4 (FANOUT) executes per-category sub-branches sequentially, with each category gated on Step 0 premise verification before branch creation. Phase 5 routes per PR; Phase 6 (rejected branch) and Phase 7 (compliant branch) are independent siblings dispatched from Phase 5, not sequential phases.

## Personalization sources

Read at activation (semantic, not hardcoded paths):

| Source | Purpose |
|---|---|
| Project profile rule | Extension-default vs Constitution-default; closure clauses for delegation contract |
| Project guide (CLAUDE.md or equivalent) | Project northstar (mission/direction statement); used as a categorization axis |
| Project editing conventions | Branch naming pattern, commit message language, PR body language |
| Harness rules (system prompt) | Branch restrictions, designated working branch, push policy |

Project-specific values are **read** from the above; the skill itself does not hardcode them. This separation is the personalization boundary — the workflow generalizes; the values do not.

## Phase 0: Detect (silent)

Activation cues:

- `/dispatch <scope>` slash command (Layer 1)
- Multi-issue delegation utterance with open-set referent (Layer 2): "resolve as many open issues as possible", "process the backlog", "work through everything in milestone X"

Pre-activation check:

- Open issues exist (Phase 2 will surface count)
- User intent is not single-issue (single-issue routes to direct execution)
- No in-flight blocking work (uncommitted changes on base branch would conflict with sub-branch fanout)

If pre-activation fails: surface the scan result and invite the user to articulate scope or commit pending work before re-entry.

## Phase 1: Bound (compose /bound)

Compose `/bound` for the delegation contract. Domains to bound (minimum set):

- **Issue selection**: User-supplies / AI-proposes / AI-autonomous
- **PR strategy**: per-category bundle / single PR / per-issue PR
- **Branch strategy**: single base / per-category sub-branch
- **Effort cap**: max issues / max time / dynamic-stop
- **Conflict handling**: skip-with-surface / attempt-with-care
- **Stage gating compliance**: substrate-cited locks (Out-of-scope clauses, "depends on #X" close-conditions, evidence-accumulation gates)

If the project's profile declares an Extension-default with a closure clause covering ambiguity (e.g., "AI-autonomous bounded by [northstar + hermeneutic circle]"), Phase 1 may relay-resolve via cited profile. Otherwise, run Horismos cycles for explicit contract.

**Output**: BoundaryMap with at least the six domains above resolved.

## Phase 2: Scan

Enumerate open issues via the available GitHub interface (gh CLI, MCP `list_issues`, or equivalent). For each issue, capture:

- `number`, `title`
- `body` (full — needed for substrate-cited lock detection)
- `labels`
- Linked PRs (from cross-references in body or via search)

Check each issue body for substrate-cited locks:

- Explicit "Out of scope" sections
- "depends on #N" (close-condition references)
- Evidence-accumulation gates ("pilot data accumulating", "evidence-collection modality" awaiting corroboration)
- Condition-fired clauses (e.g., "Instance N awaiting", "trigger condition not yet observed")

These are not skipped silently — they are **classified** in Phase 3.

## Phase 3: Categorize

Partition the IssueSet by project-northstar + evidence-accumulation alignment:

| Class | Disposition |
|---|---|
| **Aligned + actionable** | Substrate-cited locks not active, work scope clear → include |
| **Substrate-locked** | Explicit "Out of scope" / "depends on #X" / evidence-gate not satisfied → skip with hermeneutic respect (premature attempt would violate the trigger condition the issue itself cited) |
| **Stale or superseded** | Body assumptions no longer hold (referenced files moved, prerequisite already shipped) → skip with note |
| **Pilot-data dependent** | Requires accumulated empirical observation → skip (the evidence-accumulation gate hasn't satisfied) |

For aligned+actionable issues, group into 3-6 categories by **character**. Category names must derive from project-northstar + evidence-accumulation axes — not arbitrary labels.

If the categorization is dominant (single clear partition), present it as **relay** with cited basis.

If contested (2-3 plausible partitions emerge), surface a **Constitution Qc gate**:

- **Pre-gate text** (Context-Question Separation): list each candidate partition with cited rationale (which northstar axis prioritization → which categorization frame), the issue counts each partition produces, and the per-category-PR fanout pattern that follows.
- **Gate options**: 2-3 options, one per candidate partition. Each option's label names the partition's organizing principle (the northstar axis emphasized).
- **Differential future per option**: enumerate what categories + per-category-PR shape result from each option — different category frames produce different review-surface granularity.
- **Free-response pathway**: user may articulate a partition not enumerated; this routes to re-classification under the user-supplied frame.

The gate body contains only the option labels with their differential implications; analytical context lives in the pre-gate text.

**Output**: CategoryMap with per-category issue list + work-scope summary.

## Phase 4: Fanout (per-category execution loop)

For each category, sequentially:

0. **Premise verification**: For each issue in the category, run substrate trace before any branch / Edit / Write commences:
   - **Existence check**: Read/Grep the cited code locations to confirm the surfaced symptom still reproduces in current state. If the symptom is no longer present, the issue's premise has drifted — reclassify it as Stale/Superseded (per Phase 3 taxonomy) with surfacing; the category proceeds with the failing issue removed.
   - **Approach axis check**: when the issue body enumerates 2+ approach options (a/b/c style), evaluate each option's substrate basis (feasibility, codebase precedent, cost) and select via:
     - **Relay** if a single option dominates by substrate evidence — present the selection with cited basis (file:line, codebase precedent, rule reference)
     - **Constitution Qc gate** if 2+ options remain plausible under different value weightings — surface the alternatives with differential implications before commit
   - **Output**: PremiseTrace per issue (existence_status, axis_selection, substrate_citations) — recorded in the PR body's verify summary so reviewer sees the substrate basis, not just the result.

   Premise verification is a Phase 4 entry-gate, not a downstream check. Issues that fail Step 0 do not progress to Step 1; substrate-cited reclassification preserves the issue's visibility while preventing wasted Phase 4 work. If all issues in a category fail Step 0, the category produces no branch — surface a one-line skip record (not silent abandonment) alongside the SkippedSet.

1. **Branch**: create sub-branch from base — `<base>-<category-slug>` or `<base>/<category-slug>` per the project editing-convention pattern
2. **Execute**: inline work for all issues in the category (Edit, Write, Bash for verify-supporting commands)
3. **Verify**: run the project's static check (typically a `node` invocation against `static-checks.js`) — ensure fail count is not increased, no new warns
4. **Commit**: conventional message per the project editing convention (type + scope + description in the project's commit language); cite issue numbers for `closes` / `fixes`. **Framing assertions in the commit message must cite the substrate basis recorded in PremiseTrace** — phrases asserting necessity, intentionality, or constraint without cited evidence reflect a Step 0 substrate-trace gap.
5. **Push**: `git push -u origin <sub-branch>`
6. **PR**: create with title + body per project conventions; reference linked issues; include category rationale, verify summary, and **PremiseTrace per actionable issue**.

After each PR submission, return to base branch for the next category. Effort cap enforcement: if cap reached mid-fanout, defer remaining categories with explicit dynamic-stop record (not silent abandonment).

**Substrate-cited skip surfacing**: For each Phase 3 skip class (substrate-locked / stale / pilot-data), include in the **first PR's body** (or a tracking issue) a brief table of skipped issues + cited reason — preserves the visibility that the dispatch did NOT silently drop them.

## Phase 5: Feedback (post-PR loading)

After all PRs are submitted, load review state per PR:

- General PR comments
- Inline review comments
- Reviews

Phase 6 (rejection-trace inscription) and Phase 7 (compliance loop minor-fix) are independent per-PR branches dispatched from Phase 5 — not sequential. Each PR routes to exactly one of the two branches based on its classification below.

Classify each PR into one of three states:

| State | Criterion | Next phase |
|---|---|---|
| **Compliant** | Review approves; minor fixes (single-axis improvements, no premise challenge) | Phase 7 — minor-fix follow-up |
| **Compliant + boundary improvable** | Review approves; out-of-scope suggestions surfaced | Phase 7 — minor-fix scope only; out-of-scope tracked separately |
| **Rejected** | Review challenges architectural premise (axiom violation, northstar misalignment, frame inversion) | Phase 6 — rejection-trace inscription |

Use review feedback verbatim — paraphrasing loses rejection-trace fidelity.

## Phase 6: Inscribe (Rejection traces for cross-session continuity)

For each rejected PR:

1. **Identify linked issues** from PR body cite tags (`closes #N`, `fixes #N`) and from any explicit references in the rejection feedback
2. **Compose inscription comment** containing:
   - **Verbatim rejection feedback** (the user's review comment quoted in full, not summarized)
   - **Rejection classification** (axiom violation / northstar misalignment / frame inversion / scope inversion / other)
   - **Substrate-grounded redirection axes** — concrete next-investigation entry points the next session should consider
   - **Reframe note** — what the issue's original frame was, what it becomes post-rejection
   - **Out-of-scope (post-rejection)** — explicit deprecation of the rejected approach
3. **Post comment** to each linked issue
4. **Close PR**; if a sub-decision was partially valid, note that in the PR-close comment

The inscription preserves the rejection as a traceable rejection record — the next fresh-context session sees the issue body + redirection inscription and engages the hermeneutic cycle without re-deriving the rejection.

## Phase 7: Compliance Loop (Compliant PRs)

For each compliant PR with minor fixes:

1. Checkout the PR's branch
2. Apply minor fixes per review (Edit / Write)
3. Re-run verify
4. Commit + push (append to existing PR — do **not** open a new PR for minor fixes)
5. Surface "ready to merge" status; the actual merge action is reserved for the user (or for an automation rule the user has set)

Out-of-scope review suggestions are NOT applied here — they are tracked separately as new issues or comments, never silently expanded into the current PR.

## Termination

| Trigger | Effect |
|---|---|
| All categories executed + feedback inscribed | Return (PRBatch, InscriptionTrace, SkippedSet) — surface summary with merge-ready and rejected-and-inscribed counts |
| Effort cap reached | Defer remaining categories with explicit dynamic-stop record; surface what remains and why |
| User Esc | Return to normal operation; partial state surfaced |
| Phase 1 BoundaryMap incomplete (user declines / withdraws contract) | Return (∅, ∅, ∅) with the in-progress contract state surfaced; no scan / fanout commenced |
| Phase 2 scan returns empty IssueSet | Return (∅, ∅, ∅) with explicit "no open issues in scope" surfacing; not a failure state |
| All categories rejected post-feedback (merged = 0, rejected > 0) | Return (PRBatch, InscriptionTrace, SkippedSet) with merged = 0 surfaced explicitly; per-PR rejection inscriptions are the substantive output, not failure |

Final summary always includes:

- Merged + auto-closed issues count
- Compliant-with-fixes PR count + merge-ready status
- Rejected PR count + linked-issue inscription count
- Skipped issue count by class (substrate-locked / stale / pilot-data)
- Deferred categories (effort cap)

## Rules

1. **Boundary contract first** (Detection with Authority anchor): Phase 1 must complete before Phase 2. Categorizing without a delegation contract exercises silent constitutive authority — the categorization axes the AI chooses become unnegotiated authority.
2. **Substrate-cited skip surfacing** (Derived — Surfacing over Deciding): Skip decisions on substrate-locked issues quote the lock condition verbatim from the issue body (the "Out of scope" sentence, "depends on #X" reference, or evidence-gate clause). Silent skip drops Recognition.
3. **One PR per category** (Architectural — categorical-decomposition visibility): Each category produces exactly one PR. Bundling categories collapses the categorical-decomposition rationale and obscures per-category review surface.
4. **Northstar-grounded categorization** (Architectural — alignment-basis visibility): Category names derive from project-northstar + evidence-accumulation axes. Numeric or arbitrary labels obscure the alignment basis and prevent the user from recognizing the partition rationale.
5. **Inscription verbatim** (Derived — Convergence Evidence): Rejection feedback inscription quotes the review comment in full, not summarized. Paraphrase strips the rejection's specific axiom-violation nuance; without the verbatim trace, a fresh-context next session lacks the background to align on the issue's post-rejection direction and risks re-adopting the same flawed premise — a re-derivation loop. The verbatim quote terminates the loop by preserving the original rejection signal exactly.
6. **Linked-issue identification** (Cross-protocol — continuity invariant): Phase 6 identifies all linked issues from PR body cite tags and inscribes to each. A single linked issue receiving inscription while a co-linked issue is silently dropped breaks continuity.
7. **No silent rejection close** (Derived — Loop Continuity under Bounded Regret): Closing a rejected PR without inscription violates cross-session continuity. Inscribe first; close second.
8. **Effort cap dynamic-stop record** (Derived — Loop Continuity under Bounded Regret): When effort cap forces deferral, record cause + remaining categories explicitly so the next session can resume without re-deriving the queue.
9. **Out-of-scope feedback non-expansion** (Cross-protocol — scope discipline): Phase 7 applies only minor-fix scope. Out-of-scope review suggestions become new issues or trailing comments — never silent scope expansion.
10. **Personalization read, not write** (Architectural — personalization boundary): This skill reads the project's profile and editing-convention rules. It does not write to those files. Profile changes belong to `/steer`.

## Distinction from Other Protocols

| Protocol / Skill | Distinction |
|---|---|
| Horismos `/bound` | Composed by Dispatch Phase 1 (delegation contract). Bound handles a single boundary decision. Dispatch composes Bound at the head of a multi-step parallel workflow then drives execution + feedback inscription. |
| Periagoge `/induce` | Implicitly used in Phase 3 (instance partition into named categories). Dispatch's categorization is bounded by northstar + hermeneutic-cycle axes; the full Periagoge crystallization with widen / narrow / fuse / reorient moves is not invoked. |
| Anamnesis `/recollect` | Optional Phase 0 enrichment: prior cycle's rejected feedback context can prime current Dispatch. Recall is utterance-bound; Dispatch is delegation-bound. |
| Crystallize `/crystallize` | Crystallize freezes the current session into a Horizon-Fusion Text for full cross-session continuity (whole session state). Dispatch inscribes per-rejection feedback to issues (per-rejection scope). Both serve cross-session continuity at different granularities. |
| Compose `/compose` | Compose authors composition SKILL.md files (build-time). Dispatch executes a delegation pipeline (run-time). |
| Steer `/steer` | Steer rewrites the project's profile rule after detecting calibration drift. Dispatch reads that profile as a personalization source and does not modify it. |
| Realign `/realign` | Realign rewrites the project guide's northstar declaration after detecting direction drift in the open issue landscape. Dispatch reads that northstar as a personalization source and does not modify it. Functional dual with Steer on the dispatch read territory: Steer writes the calibration profile, Realign writes the mission-direction northstar. |

## Composition

Dispatch composes the following protocols at runtime:

- **Phase 1**: `/bound` (Horismos) — delegation contract
- **Phase 3**: `/induce` (Periagoge) — implicit, bounded categorization (no separate gate)
- **Phase 0 enrichment (optional)**: `/recollect` (Anamnesis) — prior rejected feedback context
- **Phase 0 enrichment (optional)**: `/realign` (Realign) — northstar recalibration from current issue landscape before categorization; user-invoked, never auto-triggered

Composition is sequential — each phase consumes the previous phase's output. Per-category execution within Phase 4 may itself invoke any protocol the per-issue work requires; those compositions are nested under the category's branch context.

## Anti-patterns

- **Skipping Phase 1**: jumping to issue scan without delegation contract. The categorization axes the AI chooses become silent constitutive authority.
- **Categorical labels without northstar grounding**: "Group 1 / Group 2" obscures the alignment basis and prevents the user from recognizing the partition rationale.
- **Bundling rejected feedback into one summary inscription**: each linked issue receives its own inscription with its own redirection axes. A pooled summary loses per-issue specificity.
- **Silent rejection close**: closing a rejected PR with only a one-line "frame rejected" comment without redirection inscription. The next session has nothing to enter from.
- **Out-of-scope expansion in Phase 7**: applying a "while you're here" review suggestion in the compliance loop. The suggestion belongs in a new issue.
- **Effort cap omission**: deferring categories silently when cap is hit, leaving the queue state implicit. The next session has to re-derive the unattempted set.
- **Skipping Phase 4 Step 0 (premise verification)**: jumping from Phase 3 categorization to Phase 4 branch creation without verifying that each Aligned+actionable issue's premise still holds in current code. This produces stale-issue Phase 4 work (the symptom is gone but the AI applies a fix anyway) or silent axis selection on multi-approach issues.
- **Substrate-uncited framing in commit/PR body**: assertions of necessity, intentionality, or constraint inserted into commit messages or PR descriptions without cited substrate evidence (file:line, rule reference, codebase precedent). Framing decisions must derive from cited substrate recorded in Phase 4 Step 0's PremiseTrace; assertion-only framing is a Step 0 substrate-trace gap symptom that surfaces in Phase 5 review or as user challenge requiring axis pivot. Operational test: for every assertion of necessity, intentionality, or constraint in the commit/PR text, the writer can point to a specific substrate citation that renders the assertion self-evident — if no such citation exists, the assertion is unfounded framing.

## Operational checklist (per cycle)

- [ ] Phase 1 BoundaryMap complete (six domains minimum)
- [ ] Phase 3 CategoryMap surfaces northstar-grounded category names
- [ ] Phase 3 SkippedSet surfaces substrate-cited reasons
- [ ] Phase 4 Step 0 PremiseTrace recorded per actionable issue (existence check + approach axis selection)
- [ ] Phase 4 each PR cites the issue + verify result + category rationale + PremiseTrace summary
- [ ] Phase 5 each PR's review state classified before Phase 6/7 dispatch
- [ ] Phase 6 each rejected PR's linked issues received verbatim-quoted inscription
- [ ] Phase 7 each compliant PR with minor fixes has the fix appended (no new PR)
- [ ] Final summary surfaces merged / compliant-fix / rejected-inscribed / skipped / deferred counts
