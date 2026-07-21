---
name: lens-review
description: "One-pass multi-perspective PR review that posts findings as a single consolidated PR comment. /frame derives the review lenses that fit the diff, plus a gap scan, over only the files changed in a PR; each lens analyzes in isolation, then the findings are adversarially cross-verified before the survivors are posted. Composes prothesis:frame and syneidesis:gap. User-invoked via /lens-review."
skills:
  - prothesis:frame
  - syneidesis:gap
---

# Lens Review

A one-pass, frame-driven multi-perspective review of a PR diff: `/frame` derives the perspectives that fit the changed files, plus a gap scan, then posts the findings back to the PR as a single consolidated comment for human reviewers. The lens panel is **not** fixed at definition time — `/frame` selects the lenses per diff. A project that wants a fixed panel every run (for example a formal category-theory ∥ type-theory ∥ operational-semantics triple for protocol review) specializes this skill in its own project skill that pins those lenses; this plugin skill stays general.

## Caller Signature

```
/lens-review [scope?]

scope : PR number | (implicit)                       -- optional; PR number, or implicit current-branch PR / working-tree detection
                                                     --   absent → Phase 0 detects it
```

When `scope` is omitted, Phase 0 detects it (current-branch PR, else working tree). The review lenses are not a fixed definition-time panel — `/frame` derives them from the diff; the scope is the only argument.

## Pipeline Overview

```
/lens-review [scope?]
  Phase 0  : scope detect (PR number | current-branch PR | working tree) + free-exit — no SHA pinning, tools fetch live
  Phase 1  : diff prep   — fetch diff live (gh pr diff {N} | git diff HEAD); read file fate (A/M/D/R) from diff headers; state diff-reading conventions
  Phase 2  : framed-lens review (isolated → adversarial) — /frame derives the lenses fitting the diff + /gap; substrate described in-skill (not /conduct)
              2a isolated per-lens analysis (independence) — each finding: file:line + lens tag + severity + evidence-grounded rationale, confidence ≥ 80%
              2b adversarial cross-verification — refute each finding; survive → Phase 3, defeated → recorded in the Phase 4 comment as refuted (relay drop w/ basis)
  Phase 3  : direction-error guard (verify) — cross-check review text vs diff-header fate; Added-but-described-as-deleted → warning augment (relay)
  Phase 4  : post comment  — one consolidated PR comment carrying every finding (path:line in text); substrate write → harness permission
  free-exit : user may end the review at any time (declared once in Phase 0)
```

The skill's identity is a frame-derived lens panel applied once over a PR diff and posted back as a single PR comment — a one-pass review for human reviewers, not a convergence loop.

## When to Use

- One-pass multi-perspective review of a PR from the epistemic lenses `/frame` derives for the diff, plus a gap audit
- You want the findings posted back to the PR as a single consolidated comment for human reviewers to consume
- The change benefits from several structural perspectives held in isolation and then adversarially cross-checked
- Need the *same* fixed lens panel every run (e.g. a formal triple)? A project pins those lenses in its own project skill and reuses this isolated→adversarial→consolidated-comment pipeline; the fixed panel lives in the project layer while this plugin skill stays general

## Phase 0: Scope Detection + Free-Exit

**Scope detection** — the skill runs interactively on the branch, so resolve the scope to a target the tools can fetch live; no base/head SHA pinning is needed (that was a CI-era requirement for headless reproducibility):

1. PR number given as `scope`: scope = PR `{N}`
2. No PR argument: `gh pr view --json number 2>/dev/null` to detect a current-branch PR; if found, scope = that PR
3. No PR: scope = working tree
4. No changes anywhere — check with `git status --porcelain` (empty output), not `git diff HEAD`, so an untracked-only working tree is not mistaken for "no changes": report and stop (nothing to review)

**Free-exit affordance (declared once).** Announce here, before the review begins: *"You can end this review at any time by saying so; I will stop and report what has been gathered."* This is a free-response pathway, not a gate option — it does not reappear as a peer option at later phases.

## Phase 1: Diff Preparation

Fetch the diff for the resolved scope with your tools — `gh pr diff {N}` (PR scope) or `git diff HEAD` (working tree). The tool resolves the current PR/tree directly, so the diff is the single live source for both file fate and line-level evidence. For a working-tree scope, `git diff HEAD` omits untracked (new, never-added) files; detect them with `git status --porcelain` and read each untracked file's content as added (`new file`) lines so an untracked-only change set is reviewed rather than silently skipped.

Read **file fate** directly from the diff headers — this is authoritative:
- `new file mode` → **Added**: created by this change; the body begins `--- /dev/null` / `+++ b/<path>` and the `+` lines are the file's initial content.
- `deleted file mode` → **Deleted**: removed by this change; the body begins `--- a/<path>` / `+++ /dev/null` and the `-` lines are the prior content removed.
- `rename from <old>` / `rename to <new>` → **Renamed**.
- otherwise → **Modified**.

**Diff-reading conventions**: lines starting with `+` are added; lines starting with `-` are removed; a leading space is unchanged context.

The diff headers are the authoritative source for file fate and the hunks carry the line-level evidence; both feed Phase 2, and the fate read here is re-used by the Phase 3 direction-error guard.

## Phase 2: Framed-Lens Review (isolated analysis → adversarial cross-verification)

`/frame` forms the parallel perspectives; this skill then describes the substrate that analyzes and adversarially verifies them **directly** — the isolated-then-adversarial arrangement is recorded here, in the skill, not routed to `/conduct`. Review **only the changed files**.

**Lens framing.** Call `/frame` (prothesis) to derive the review perspectives that fit the changed files, and `/gap` (syneidesis) for the gap audit. `/frame` selects the lenses appropriate to the diff — for a formally-structured change these are often morphism-coherence, type-soundness, and evaluation-order lenses, but the panel is `/frame`'s to determine, not a fixed list baked into this skill. Each derived lens is one isolated perspective; the gap dimensions audited by `/gap` are:

- **Procedural** — missing steps or incomplete workflows
- **Consideration** — unaddressed trade-offs
- **Assumption** — implicit assumptions needing explicit statement
- **Alternative** — unexplored approaches

**2a — Isolated per-lens analysis (independence-before-contamination).** Analyze the changed files through each derived lens in **isolation**: every lens forms its findings without seeing the other lenses' findings, so a blind spot or bias in one lens cannot contaminate the others. Substrate realization (recorded here, executed by the substrate): run each lens as an isolated analysis — e.g. an isolated subagent per lens, briefed only with its single lens plus the diff — and collect the per-lens findings independently. Each finding carries:

- **File path + line number** drawn from the diff (the line must appear in the diff)
- **Tag** — the lens name `/frame` assigned (e.g. `[Category Theory]`, `[Type Theory]`, `[OpSem]`), or `[Gap: <type>]`
- **Severity** — Critical / Important / Suggestion
- **Evidence-grounded rationale** — reference the actual changed code; confidence ≥ 80% (drop lower-confidence findings)

**2b — Adversarial cross-verification.** Once the isolated findings are collected, run a single adversarial pass over the aggregate: each finding is challenged against the other lenses and against the diff evidence — does it survive a refutation attempt, or is it defeated (hallucinated, stale against the actual diff, context-inappropriate, or subsumed by another finding)? Substrate realization: a refutation pass — the main session, a dedicated adversarial subagent, or an independent model — that tries to refute each finding and records survival or defeat with cited basis. **Surviving** findings proceed to Phase 3; **defeated** findings do not proceed as surviving findings — they are recorded in the Phase 4 consolidated comment as refuted, with their refutation basis (a relay drop with cited basis, never a silent discard). This is a single verification pass, not a convergence loop — lens-review stays one-pass.

If the changes are trivial (e.g. version bumps only), state that briefly and skip the full lens sweep and its adversarial pass.

## Phase 3: Direction-Error Guard (Verify)

Before posting, cross-check the review text against the file fate read from the diff headers in Phase 1. For each **Added** file, if the review describes it as deleted, that is a likely diff-direction inversion — the reviewer read the diff backwards. Surface a warning that augments the review (it does not replace the findings): a direction-misread notice listing each Added-but-described-as-deleted file, advising verification against the diff headers before treating those findings as legitimate.

This is a relay verify step — a deterministic cross-check of the review text against the authoritative diff-header fate, presented and proceeded through; it does not gate.

## Phase 4: Post the Consolidated Comment

Post the findings back to the PR as a **single consolidated comment** — one comment carrying every finding, not one inline comment per diff line. This is a **substrate write** — an external, human-visible GitHub mutation — so it routes to the **harness permission layer**: surface what will be posted (the consolidated comment body) and let the harness gate the execution. The skill does not absorb that decision.

`call` one comment via `gh api repos/{owner}/{repo}/issues/{N}/comments` with `body` (`{owner}` and `{repo}` are gh's repo placeholders, auto-filled from the current repo; the bare `repos/{repo}/...` form drops the owner segment and resolves wrong). The body lists every finding as text, each referencing its `path:line` so a reviewer can navigate to it — no inline line-targeting API is used, so no `commit_id` / `path` / `line` / `side` machinery is needed.

Posting discipline:

- Consolidate all surviving findings into the one comment body; defeated findings (Phase 2b) go in a clearly-labelled **refuted** section of the same comment, each with its refutation basis — recorded as already-refuted, not presented as actionable, so a human reviewer cannot mistake them for live findings.
- Each finding line carries its `path:line`, the lens tag (the `/frame`-assigned lens name, or `[Gap: <type>]`), and the severity (Critical / Important / Suggestion).
- Skip duplicate or near-duplicate findings.
- Write the Markdown comment body through a file (e.g. a heredoc to a temp file), then build the JSON request body from that file with `jq --rawfile` (so the body becomes `{"body": "<markdown>"}`) and feed that JSON to `gh api` via `--input -`; do not pass the Markdown body inside a double-quoted shell argument, because backticks in Markdown trigger shell command substitution, and do not `--input` the raw Markdown file directly because the endpoint requires a JSON object. (`--input` makes `gh api` default to POST, so the comment is created, not listed.)

If the scope is a working tree (no PR), there is no PR to post to — present the findings in session text instead and note that posting requires a PR.

## Rules

1. **Changed files only** — review the files in the Phase 1 diff and nothing else; the diff headers are authoritative for file fate, the hunks for line-level evidence.
2. **Frame-derived lenses** — the review panel is not fixed at definition time; `/frame` selects the lenses fitting the diff. A project needing a fixed panel pins it in a project-skill specialization, not by hard-coding lenses here.
3. **Isolated lenses, then adversarial cross-verification** — each lens forms its findings in isolation (independence-before-contamination); the aggregated findings then pass a single adversarial refutation pass before posting. Surviving findings proceed; defeated findings are recorded in the consolidated comment as refuted with cited basis. The isolated-then-adversarial substrate is described in this skill directly, not routed to `/conduct`.
4. **Confidence ≥ 80%** — only report findings at or above the confidence threshold; trivial changes (e.g. version bumps) are stated briefly and skipped rather than padded with low-value findings.
5. **Verify before post** — run the Phase 3 direction-error guard against the diff-header fate before any comment is posted; an Added-but-described-as-deleted file augments the review with a direction-misread warning.
6. **Substrate writes route to harness permission** — posting the consolidated PR comment is an external, human-visible GitHub mutation; surface what will be posted and let the harness gate the execution. The skill does not absorb that substrate decision.
7. **Context-question separation at gates** — present all analysis and evidence as text before any gate; a gate carries only the question and the options with their differential implications.
8. **Plain everyday language** in all user-facing emit — no internal protocol jargon at the user-facing surface.
9. **One consolidated comment** — all surviving findings go in a single PR comment, each referencing its `path:line` in text; preserve lens tags and severity on every finding; skip duplicates.
