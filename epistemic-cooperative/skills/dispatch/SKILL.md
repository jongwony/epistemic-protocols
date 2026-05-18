---
name: dispatch
description: "Execute focused work units via /dispatch. Consumes /triage initial prompts, sets topology, verifies premises, fans out branches/PRs, inscribes rejection traces, and captures post-cycle improvement follow-ups."
---

# Dispatch: Focused Work-Unit Execution

Execute work units that have already been focused by `/triage` or supplied as explicit initial prompts. Dispatch is an orchestration skill for execution topology, branch/PR fanout, verification, review loading, rejection-trace inscription, and terminal improvement-capture follow-up. It is not the owner of open-issue discovery or similarity grouping.

**This is an execution skill, not an intake skill.** `/triage` forms `FocusedWorkUnit`s from `RawIssueSet`s by grouping related issues, fusing them with the `AGENTS.md` northstar in the current Codex session, and emitting dispatchable initial prompts. `/dispatch` consumes those prompts or work units and executes the selected route: independent handoff is outside dispatch, while linear and parallel dispatch are inside dispatch.

## Pipeline Overview

```
                                                      ┌→ INSCRIBE  (Phase 6 — rejected branch) ┐
DETECT → BOUND → LOAD WORK UNITS → PREMISE → FANOUT → FEEDBACK                                  → CAPTURE → SUMMARY
 (silent) (gated)     (no intake)     (per-unit) (route topology)                              (Phase 8)  (return)
                                                      └→ COMPLY    (Phase 7 — compliant branch) ┘
```

Phase 1 (BOUND) composes `/bound` for execution topology. Phase 2 loads the focused work units already present in session text. Phase 3 verifies each unit's premise before branch creation. Phase 4 executes the selected topology: linear sequence or parallel fanout. Phase 5 routes per PR; rejected and compliant branches are independent siblings dispatched from feedback classification. Phase 8 runs only after active fanout, rejection inscription, compliance fixes, and dynamic-stop handling have been surfaced.

## Personalization sources

Read at activation (semantic, not hardcoded paths):

| Source | Purpose |
|---|---|
| Project profile rule | Extension-default vs Constitution-default; closure clauses for delegation contract |
| Project guide (AGENTS.md, CLAUDE.md, or equivalent) | Project northstar (mission/direction statement); used to verify the work unit's fusion trace |
| Project editing conventions | Branch naming pattern, commit message language, PR body language |
| Harness rules (system prompt) | Branch restrictions, designated working branch, push policy |

Project-specific values are **read** from the above; the skill itself does not hardcode them. This separation is the personalization boundary — the workflow generalizes; the values do not.

## Phase 0: Detect (silent)

Activation cues:

- `/dispatch <initial prompt>` slash command (Layer 1)
- `/dispatch` after `/triage` has emitted one or more `FocusedWorkUnit`s or `InitialPrompt`s in the current session
- User route choice from `/triage`: "run these linearly", "dispatch these in parallel", "execute work unit A"

Pre-activation check:

- At least one focused work unit or initial prompt is present
- Route topology is explicit or can be resolved by Phase 1
- No in-flight blocking work on the base branch would conflict with branch fanout

If the user asks to process open issues or a backlog without a focused work unit, route to `/triage` first. If the worktree is blocked, surface the conflict and invite the user to commit, stash, or narrow the dispatch scope before re-entry.

## Phase 1: Bound (compose /bound)

Compose `/bound` for the delegation contract. Domains to bound (minimum set):

- **Work-unit selection**: User-supplies / AI-proposes from current-session triage output / AI-autonomous within a user-confirmed work-unit set
- **Execution topology**: single unit / linear sequence / parallel fanout
- **PR strategy**: per-work-unit PR / grouped PR / single PR
- **Branch strategy**: single base / per-work-unit sub-branch
- **Effort cap**: max issues / max time / dynamic-stop
- **Conflict handling**: skip-with-surface / attempt-with-care
- **Stage gating compliance**: substrate-cited locks (Out-of-scope clauses, "depends on #X" close-conditions, evidence-accumulation gates)
- **Post-cycle improvement filing**: create GitHub follow-up issues / draft-only summary / skip unless user confirms

If the project's profile declares an Extension-default with a closure clause covering ambiguity (e.g., "AI-autonomous bounded by [northstar + hermeneutic circle]"), Phase 1 may relay-resolve via cited profile. Otherwise, run Horismos cycles for explicit contract.

**Output**: BoundaryMap with at least the domains above resolved.

## Phase 2: Load Focused Work Units

Read the selected `InitialPrompt`s or `FocusedWorkUnit`s from current session context. For each unit, capture:

- work-unit name
- included issue numbers
- normalized problem frame
- northstar fusion trace
- explicit out-of-scope claims
- verification expectations
- suggested route and rationale

Do not enumerate open issues here. If the selected input only names a GitHub scope without a work-unit frame, stop and route to `/triage`.

Check each work unit for substrate-cited locks inherited from triage:

- explicit "Out of scope" sections
- "depends on #N" close-condition references
- evidence-accumulation gates
- stale/superseded notes
- needs-info or blocked readiness

These are not skipped silently. They are surfaced in Phase 3 before execution.

## Phase 3: Premise Verification

For each selected work unit, run a substrate trace before any branch / Edit / Write commences:

- **Existence check**: Read/Grep the cited code locations or runtime surfaces to confirm the surfaced symptom or target still exists in current state.
- **Fusion check**: Confirm the work unit still fits the `AGENTS.md` northstar trace supplied by `/triage`; if the northstar has changed, stop and request re-triage.
- **Approach axis check**: when the initial prompt enumerates 2+ approach options, evaluate each option's substrate basis and select via:
  - **Relay** if a single option dominates by substrate evidence — present the selection with cited basis.
  - **Constitution gate** if 2+ options remain plausible under different value weightings.

**Output**: `PremiseTrace` per work unit: existence status, fusion status, axis selection, substrate citations.

Work units that fail premise verification do not progress to fanout. Reclassify them as stale, blocked, needs-info, or re-triage-needed with cited reason.

## Phase 4: Fanout

Execute according to the bounded topology:

- **Single unit**: create one branch and one PR unless the boundary contract says otherwise.
- **Linear sequence**: execute work units one at a time, returning to base after each PR.
- **Parallel fanout**: create independent per-work-unit branches only when write scopes are disjoint and the active runtime/tool policy authorizes parallel agent work.

Carry the work-unit rationale trace forward through the cycle. Dispatch preserves the InitialPrompt's problem frame, northstar fusion summary, and selected route rationale, then adds the premise/fusion verification result from Phase 3 and any continuation links from Phase 6 or Phase 8.

For each executable work unit:

1. **Branch**: create sub-branch from base — `<base>-<work-unit-slug>` or `<base>/<work-unit-slug>` per the project editing-convention pattern
2. **Execute**: inline work for the work unit (Edit, Write, Bash for verify-supporting commands)
3. **Verify**: run the project's static check (typically a `node` invocation against `static-checks.js`) — ensure fail count is not increased, no new warns
4. **Commit**: conventional message per the project editing convention; cite linked issue numbers when the work unit fully resolves them. **Framing assertions in the commit message must cite the substrate basis recorded in PremiseTrace**.
5. **Push**: `git push -u origin <sub-branch>`
6. **PR**: create with title + body per project conventions; include work-unit name, included issues, northstar fusion summary, verify summary, and `PremiseTrace`.

After each PR submission in a linear route, return to base branch for the next work unit. Effort cap enforcement: if cap reached mid-fanout, defer remaining work units with explicit dynamic-stop record.

**Substrate-cited skip surfacing**: For each skipped work unit, include a brief table of skipped unit + cited reason in the first PR body or a tracking comment. Dispatch must not silently drop a selected work unit.

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

## Phase 8: Post-cycle Improvement Capture

Run this phase after active PR/review/dynamic-stop handling is complete, so the active fanout contract reaches closure before follow-up improvement work begins.

Scan cycle artifacts for substrate-cited workflow or protocol defects:

- `PremiseTrace`
- `SkippedSet`
- dynamic-stop records
- verification warnings or failures
- PR review comments
- user corrections made during the cycle

Filter candidates before filing anything:

- Keep only durable improvement candidates with cited evidence from the cycle substrate.
- Keep Dispatch workflow defects, protocol contract gaps, recurring verification/package warnings that materially affect dispatch work, or issue-body/branch-state drift patterns that should guide a future session.
- Keep speculative chat impressions, one-off preferences without substrate evidence, and review rejections already handled by Phase 6 linked-issue inscription outside the filed follow-up set.
- Preserve the personalization boundary: profile changes route to `/steer`; northstar re-inscription routes to `/realign`.

For each remaining candidate:

1. De-duplicate against open issues using the issue tracker search surface; this search is a narrow duplicate check, not backlog intake.
2. If an open issue already covers the candidate, record the existing issue link and skip creation.
3. If issue creation is allowed by the Phase 1 boundary, create one GitHub issue per durable candidate with observed evidence, affected surface, proposed direction, out-of-scope boundaries, and acceptance criteria.
4. If issue creation is outside the Phase 1 boundary, surface a draft issue body or concise candidate record in the final summary instead of filing.

**Output**: `ImprovementIssueTrace` containing created issue links, duplicate-skipped issue links, intentionally skipped candidates with reasons, and any draft-only candidates.

## Termination

| Trigger | Effect |
|---|---|
| All work units executed + feedback inscribed + improvement capture complete | Return (PRBatch, InscriptionTrace, SkippedSet, ImprovementIssueTrace) — surface summary with merge-ready, rejected-and-inscribed, and follow-up improvement counts |
| Effort cap reached | Defer remaining work units with explicit dynamic-stop record; surface what remains and why |
| User Esc | Return to normal operation; partial state surfaced |
| Phase 1 BoundaryMap incomplete (user declines / withdraws contract) | Return (∅, ∅, ∅, ∅) with the in-progress contract state surfaced; no fanout commenced |
| Phase 2 finds no focused work unit | Return (∅, ∅, ∅, ∅) with explicit route-to-`/triage` surfacing; not a failure state |
| All PRs rejected post-feedback (merged = 0, rejected > 0) | Return (PRBatch, InscriptionTrace, SkippedSet, ImprovementIssueTrace) with merged = 0 surfaced explicitly; per-PR rejection inscriptions are the substantive output, not failure |

Final summary always includes:

- Merged + auto-closed issues count
- Compliant-with-fixes PR count + merge-ready status
- Rejected PR count + linked-issue inscription count
- Skipped work-unit count by class (blocked / stale / needs-info / re-triage-needed)
- Deferred work units (effort cap)
- Follow-up improvement issue count with created links, duplicate-skipped links, and draft-only or intentionally skipped candidate reasons
- Cycle rationale trace: InitialPrompt source, northstar fusion summary, selected route rationale, premise/fusion verification result, and continuation links from rejection inscription or improvement capture

## Rules

1. **Boundary contract first** (Detection with Authority anchor): Phase 1 must complete before Phase 2. Executing without topology and work-unit selection boundaries exercises silent constitutive authority.
2. **No intake inside dispatch**: Dispatch consumes `FocusedWorkUnit`s or `InitialPrompt`s. Open issue discovery, similarity grouping, and northstar fusion belong to `/triage`.
3. **Substrate-cited skip surfacing** (Derived — Surfacing over Deciding): Skip decisions quote the lock condition or premise failure from the work unit or linked issue substrate. Silent skip drops Recognition.
4. **One PR per work unit by default** (Architectural — review-surface visibility): Each work unit produces exactly one PR unless the boundary contract explicitly chooses a grouped PR. Bundling unrelated work units obscures the review basis.
5. **Northstar-fusion carry-through** (Architectural — alignment-basis visibility): PR bodies preserve the work unit's northstar fusion summary. Dispatch does not re-fuse the direction; it verifies that the supplied fusion still fits.
6. **Inscription verbatim** (Derived — Convergence Evidence): Rejection feedback inscription quotes the review comment in full, not summarized. Paraphrase strips the rejection's specific axiom-violation nuance; without the verbatim trace, a fresh-context next session lacks the background to align on the issue's post-rejection direction and risks re-adopting the same flawed premise — a re-derivation loop. The verbatim quote terminates the loop by preserving the original rejection signal exactly.
7. **Linked-issue identification** (Cross-protocol — continuity invariant): Phase 6 identifies all linked issues from PR body cite tags and inscribes to each. A single linked issue receiving inscription while a co-linked issue is silently dropped breaks continuity.
8. **No silent rejection close** (Derived — Loop Continuity under Bounded Regret): Closing a rejected PR without inscription violates cross-session continuity. Inscribe first; close second.
9. **Effort cap dynamic-stop record** (Derived — Loop Continuity under Bounded Regret): When effort cap forces deferral, record cause + remaining work units explicitly so the next session can resume without re-deriving the queue.
10. **Out-of-scope feedback non-expansion** (Cross-protocol — scope discipline): Phase 7 applies only minor-fix scope. Out-of-scope review suggestions become new issues or trailing comments — never silent scope expansion.
11. **Post-cycle improvement capture only** (Derived — Loop Continuity under Bounded Regret): Improvement issues are created or drafted only after active fanout, Phase 6 inscription, Phase 7 compliance fixes, and dynamic-stop surfacing finish. Filing improvement work mid-cycle derails the bounded work-unit contract.
12. **Improvement issues carry distinct substrate** (Cross-protocol — continuity invariant): Phase 6 preserves rejected current-work reasoning on linked issues with verbatim review evidence. Phase 8 records only durable workflow or protocol defects with separate substrate citation; a rejected PR qualifies for an additional improvement issue only when a distinct Dispatch or protocol defect is evidenced beyond the inscription.
13. **Improvement issue de-duplication** (Derived — Surfacing over Deciding): Before creating a follow-up issue, search open issues for a covering candidate and record the created-or-skipped result in `ImprovementIssueTrace`. This duplicate check is scoped to verifying whether the candidate already has a covering open issue; backlog intake and similarity grouping belong to `/triage`.
14. **Cycle rationale preservation** (Architectural — handoff specificity): Dispatch final summaries preserve the triage-supplied work rationale and the execution-time verification result. The summary records why this cycle ran, how the route was selected, and how execution verified the supplied northstar fusion.
15. **Personalization read, not write** (Architectural — personalization boundary): This skill reads the project's profile and editing-convention rules. It does not write to those files. Profile changes belong to `/steer`; northstar re-inscription belongs to `/realign`.

## Distinction from Other Protocols

| Protocol / Skill | Distinction |
|---|---|
| Horismos `/bound` | Composed by Dispatch Phase 1 (delegation contract). Bound handles a single boundary decision. Dispatch composes Bound at the head of a multi-step parallel workflow then drives execution + feedback inscription. |
| Triage `/triage` | Forms focused work units from raw GitHub issues through grouping, northstar fusion, and initial-prompt emission. Dispatch consumes those units and does not redo intake. |
| Periagoge `/induce` | Used upstream to crystallize abstractions such as Work-Unit Triage. Dispatch does not perform abstraction formation; it executes already-focused units. |
| Anamnesis `/recollect` | Optional Phase 0 enrichment: prior cycle's rejected feedback context can prime current Dispatch. Recall is utterance-bound; Dispatch is delegation-bound. |
| Compose `/compose` | Compose authors composition SKILL.md files (build-time). Dispatch executes a delegation pipeline (run-time). |
| Steer `/steer` | Steer rewrites the project's profile rule after detecting calibration drift. Dispatch reads that profile as a personalization source and does not modify it. |
| Realign `/realign` | Realign rewrites the project guide's direction line via three-horizon fusion. Dispatch reads that direction line as the project northstar, verifies supplied work-unit fusion against it, and does not modify it. |

## Composition

Dispatch composes the following protocols at runtime:

- **Phase 1**: `/bound` (Horismos) — delegation contract
- **Phase 0 enrichment (optional)**: `/recollect` (Anamnesis) — prior rejected feedback context

Composition is sequential — each phase consumes the previous phase's output. Per-work-unit execution within Phase 4 may itself invoke any protocol the work requires; those compositions are nested under the work-unit branch context.

## Anti-patterns

- **Skipping Phase 1**: jumping to branch creation without delegation contract. The execution topology becomes silent constitutive authority.
- **Open backlog intake inside dispatch**: asking dispatch to discover and group open issues. Route to `/triage` first so the user can recognize the work-unit boundary.
- **Bundling rejected feedback into one summary inscription**: each linked issue receives its own inscription with its own redirection axes. A pooled summary loses per-issue specificity.
- **Silent rejection close**: closing a rejected PR with only a one-line "frame rejected" comment without redirection inscription. The next session has nothing to enter from.
- **Out-of-scope expansion in Phase 7**: applying a "while you're here" review suggestion in the compliance loop. The suggestion belongs in a new issue.
- **Effort cap omission**: deferring work units silently when cap is hit, leaving the queue state implicit. The next session has to re-derive the unattempted set.
- **Mid-fanout improvement filing**: turning a discovered workflow defect into a new issue before active work, rejection inscription, compliance fixes, or dynamic-stop surfacing finishes. Improvement capture is terminal, not an interruption.
- **Duplicate improvement issue**: filing a follow-up without checking open issues for an existing candidate. The issue tracker becomes noisy and future sessions lose the intended continuation signal.
- **Rejection-as-improvement duplication**: creating an improvement issue for rejected work that Phase 6 already inscribed into linked issues. Only separately evidenced workflow or protocol defects belong in Phase 8.
- **Skipping premise verification**: jumping from work-unit loading to branch creation without verifying that each unit's premise still holds in current code. This produces stale work or silent axis selection on multi-approach units.
- **Substrate-uncited framing in commit/PR body**: assertions of necessity, intentionality, or constraint inserted into commit messages or PR descriptions without cited substrate evidence (file:line, rule reference, codebase precedent). Framing decisions must derive from cited substrate recorded in Phase 3's PremiseTrace; assertion-only framing is a substrate-trace gap symptom that surfaces in Phase 5 review or as user challenge requiring axis pivot. Operational test: for every assertion of necessity, intentionality, or constraint in the commit/PR text, the writer can point to a specific substrate citation that renders the assertion self-evident — if no such citation exists, the assertion is unfounded framing.

## Operational checklist (per cycle)

- [ ] Phase 1 BoundaryMap covers every domain listed in Phase 1
- [ ] Phase 2 FocusedWorkUnit set loaded from session triage output or explicit initial prompts
- [ ] Phase 3 SkippedSet surfaces substrate-cited reasons
- [ ] Phase 3 PremiseTrace recorded per executable work unit (existence check + fusion check + approach axis selection)
- [ ] Phase 4 each PR cites linked issues + verify result + northstar fusion summary + PremiseTrace summary
- [ ] Phase 5 each PR's review state classified before Phase 6/7 dispatch
- [ ] Phase 6 each rejected PR's linked issues received verbatim-quoted inscription
- [ ] Phase 7 each compliant PR with minor fixes has the fix appended (no new PR)
- [ ] Phase 8 scans PremiseTrace / SkippedSet / dynamic-stop / verification / review / user-correction artifacts for substrate-cited improvement candidates
- [ ] Phase 8 de-duplicates candidates against open issues before creation
- [ ] Phase 8 records created, duplicate-skipped, draft-only, or intentionally skipped improvement candidates with reasons
- [ ] Final summary surfaces merged / compliant-fix / rejected-inscribed / skipped / deferred / follow-up-improvement counts and links
- [ ] Final summary preserves the InitialPrompt source, northstar fusion summary, selected route rationale, premise/fusion verification result, and continuation links
