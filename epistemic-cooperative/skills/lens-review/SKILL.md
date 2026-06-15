---
name: lens-review
description: "A fixed-lens multi-perspective PR review that posts findings as a single consolidated PR comment. Applies a fixed perspective panel — Category Theory (morphism coherence, composition, functor consistency), Type Theory (signature soundness, variance, type safety), Operational Semantics (evaluation order, phase transitions, state consistency) — plus a gap scan, over only the files changed in a PR. Each lens analyzes in isolation (independence-before-contamination), then the findings are adversarially cross-verified before surviving ones are posted as a single consolidated comment. Composes prothesis:frame for lens framing and syneidesis:gap for the gap audit; the isolated-then-adversarial substrate is described in the skill, not routed to /conduct. User-invoked via /lens-review. Sibling of /review-loop (which applies fixes to convergence) and /comment-review (markdown artifacts)."
skills:
  - prothesis:frame
  - syneidesis:gap
---

# Lens Review

A one-pass, fixed-lens multi-perspective review of a PR diff: it frames three fixed perspectives (Category Theory ∥ Type Theory ∥ Operational Semantics) plus a gap scan over only the changed files, then posts the findings back to the PR as a single consolidated comment for human reviewers.

## Caller Signature

```
/lens-review [scope?]

scope : PR number | (implicit)                       -- optional; PR number, or implicit current-branch PR / working-tree detection
                                                     --   absent → Phase 0 detects it
```

When `scope` is omitted, Phase 0 detects it (current-branch PR, else working tree). The lens panel is fixed at definition time — Category Theory, Type Theory, Operational Semantics, plus gap scanning — and is not a runtime parameter; the scope is the only argument.

## Pipeline Overview

```
/lens-review [scope?]
  Phase 0  : scope detect (PR number | current-branch PR | working tree) + free-exit — no SHA pinning, tools fetch live
  Phase 1  : diff prep   — fetch diff live (gh pr diff {N} | git diff HEAD); read file fate (A/M/D/R) from diff headers; state diff-reading conventions
  Phase 2  : fixed-lens review (isolated → adversarial) — /frame forms lenses (Category Theory ∥ Type Theory ∥ OpSem) + /gap; substrate described in-skill (not /conduct)
              2a isolated per-lens analysis (independence) — each finding: file:line + lens tag + severity + evidence-grounded rationale, confidence ≥ 80%
              2b adversarial cross-verification — refute each finding; survive → Phase 3, defeated → listed in the Phase 4 comment (relay drop w/ basis)
  Phase 3  : direction-error guard (verify) — cross-check review text vs diff-header fate; Added-but-described-as-deleted → warning augment (relay)
  Phase 4  : post comment  — one consolidated PR comment carrying every finding (path:line in text); substrate write → harness permission
  free-exit : user may end the review at any time (declared once in Phase 0)
```

The skill's identity is the fixed lens panel applied once over a PR diff and posted back as a single PR comment — a one-pass review for human reviewers, not a convergence loop.

## When to Use

- One-pass multi-perspective review of a PR from fixed epistemic lenses (category theory, type theory, operational semantics) plus a gap audit
- You want the findings posted back to the PR as a single consolidated comment for human reviewers to consume
- The change is protocol-level or formally structured, where morphism/type/evaluation-order coherence is the load-bearing review axis

## When NOT to Use

- Driving review findings all the way to fixed (apply-and-converge) — that is `/review-loop` (this skill posts comments, it does not apply fixes)
- Reviewing a markdown artifact before fixation — that is `/comment-review` (this skill targets a PR code diff and posts GitHub comments)
- A general correctness-bug review with no fixed-lens framing — call `/review-loop` with the built-in `code-review` source directly

## Phase 0: Scope Detection + Free-Exit

**Scope detection** — the skill runs interactively on the branch, so resolve the scope to a target the tools can fetch live; no base/head SHA pinning is needed (that was a CI-era requirement for headless reproducibility):

1. PR number given as `scope`: scope = PR `{N}`
2. No PR argument: `gh pr view --json number 2>/dev/null` to detect a current-branch PR; if found, scope = that PR
3. No PR: scope = working tree
4. No changes anywhere: report and stop (nothing to review)

**Free-exit affordance (declared once).** Announce here, before the review begins: *"You can end this review at any time by saying so; I will stop and report what has been gathered."* This is a free-response pathway, not a gate option — it does not reappear as a peer option at later phases.

## Phase 1: Diff Preparation

Fetch the diff for the resolved scope with your tools — `gh pr diff {N}` (PR scope) or `git diff HEAD` (working tree). The tool resolves the current PR/tree directly, so the diff is the single live source for both file fate and line-level evidence.

Read **file fate** directly from the diff headers — this is authoritative:
- `new file mode` → **Added**: created by this change; the body begins `--- /dev/null` / `+++ b/<path>` and the `+` lines are the file's initial content.
- `deleted file mode` → **Deleted**: removed by this change; the body begins `--- a/<path>` / `+++ /dev/null` and the `-` lines are the prior content removed.
- `rename from <old>` / `rename to <new>` → **Renamed**.
- otherwise → **Modified**.

**Diff-reading conventions**: lines starting with `+` are added; lines starting with `-` are removed; a leading space is unchanged context.

The diff headers are the authoritative source for file fate and the hunks carry the line-level evidence; both feed Phase 2, and the fate read here is re-used by the Phase 3 direction-error guard.

## Phase 2: Fixed-Lens Review (isolated analysis → adversarial cross-verification)

`/frame` forms the parallel perspectives; this skill then describes the substrate that analyzes and adversarially verifies them **directly** — the isolated-then-adversarial arrangement is recorded here, in the skill, not routed to `/conduct`. Review **only the changed files**.

**Lens framing.** Call `/frame` (prothesis) to frame the three fixed lenses, and `/gap` (syneidesis) for the gap audit; the lenses and gap dimensions are fixed at definition time:

- **Category Theory** — morphism coherence, composition laws, functor consistency
- **Type Theory** — type-signature soundness, variance, type safety
- **Operational Semantics** — evaluation order, phase transitions, state consistency
- **Gap Scanning** (via `/gap`) — scan decision points in the diff for unnoticed gaps:
  - **Procedural** — missing steps or incomplete workflows
  - **Consideration** — unaddressed trade-offs
  - **Assumption** — implicit assumptions needing explicit statement
  - **Alternative** — unexplored approaches

**2a — Isolated per-lens analysis (independence-before-contamination).** Analyze the changed files through each lens in **isolation**: every lens forms its findings without seeing the other lenses' findings, so a blind spot or bias in one lens cannot contaminate the others. Substrate realization (recorded here, executed by the substrate): run each lens as an isolated analysis — e.g. an isolated subagent per lens, briefed only with its single lens plus the diff — and collect the per-lens findings independently. Each finding carries:

- **File path + line number** drawn from the diff (the line must appear in the diff)
- **Tag** — `[Category Theory]`, `[Type Theory]`, `[OpSem]`, or `[Gap: <type>]`
- **Severity** — Critical / Important / Suggestion
- **Evidence-grounded rationale** — reference the actual changed code; confidence ≥ 80% (drop lower-confidence findings)

**2b — Adversarial cross-verification.** Once the isolated findings are collected, run a single adversarial pass over the aggregate: each finding is challenged against the other lenses and against the diff evidence — does it survive a refutation attempt, or is it defeated (hallucinated, stale against the actual diff, context-inappropriate, or subsumed by another finding)? Substrate realization: a refutation pass — the main session, a dedicated adversarial subagent, or an independent model — that tries to refute each finding and records survival or defeat with cited basis. **Surviving** findings proceed to Phase 3; **defeated** findings are dropped from posting and listed in the Phase 4 summary with their refutation basis (a relay drop with cited basis, never a silent discard). This is a single verification pass, not a convergence loop — lens-review stays one-pass.

If the changes are trivial (e.g. version bumps only), state that briefly and skip the full lens sweep and its adversarial pass.

## Phase 3: Direction-Error Guard (Verify)

Before posting, cross-check the review text against the file fate read from the diff headers in Phase 1. For each **Added** file, if the review describes it as deleted, that is a likely diff-direction inversion — the reviewer read the diff backwards. Surface a warning that augments the review (it does not replace the findings): a direction-misread notice listing each Added-but-described-as-deleted file, advising verification against the diff headers before treating those findings as legitimate.

This is a relay verify step — a deterministic cross-check of the review text against the authoritative diff-header fate, presented and proceeded through; it does not gate.

## Phase 4: Post the Consolidated Comment

Post the findings back to the PR as a **single consolidated comment** — one comment carrying every finding, not one inline comment per diff line. This is a **substrate write** — an external, human-visible GitHub mutation — so it routes to the **harness permission layer**: surface what will be posted (the consolidated comment body) and let the harness gate the execution. The skill does not absorb that decision.

`call` one comment via `gh api repos/{repo}/issues/{N}/comments` with `body`. The body lists every finding as text, each referencing its `path:line` so a reviewer can navigate to it — no inline line-targeting API is used, so no `commit_id` / `path` / `line` / `side` machinery is needed.

Posting discipline:

- Consolidate all surviving findings into the one comment body; defeated findings (Phase 2b) are listed there too with their refutation basis.
- Each finding line carries its `path:line`, the lens tag (`[Category Theory]` / `[Type Theory]` / `[OpSem]` / `[Gap: <type>]`), and the severity (Critical / Important / Suggestion).
- Skip duplicate or near-duplicate findings.
- Write the Markdown comment body through a file (e.g. a heredoc to a temp file) and load it with `gh api --input` / `jq --rawfile`; do not pass the Markdown body inside a double-quoted shell argument, because backticks in Markdown trigger shell command substitution.

If the scope is a working tree (no PR), there is no PR to post to — present the findings in session text instead and note that posting requires a PR.

## Rules

1. **Changed files only** — review the files in the Phase 1 diff and nothing else; the diff headers are authoritative for file fate, the hunks for line-level evidence.
2. **Isolated lenses, then adversarial cross-verification** — each lens forms its findings in isolation (independence-before-contamination); the aggregated findings then pass a single adversarial refutation pass before posting. Surviving findings proceed; defeated findings are listed in the consolidated comment with cited basis. The isolated-then-adversarial substrate is described in this skill directly, not routed to `/conduct`.
3. **Confidence ≥ 80%** — only report findings at or above the confidence threshold; trivial changes (e.g. version bumps) are stated briefly and skipped rather than padded with low-value findings.
4. **Verify before post** — run the Phase 3 direction-error guard against the diff-header fate before any comment is posted; an Added-but-described-as-deleted file augments the review with a direction-misread warning.
5. **Substrate writes route to harness permission** — posting the consolidated PR comment is an external, human-visible GitHub mutation; surface what will be posted and let the harness gate the execution. The skill does not absorb that substrate decision.
6. **Context-question separation at gates** — present all analysis and evidence as text before any gate; a gate carries only the question and the options with their differential implications.
7. **Plain everyday language** in all user-facing emit — no internal protocol jargon at the user-facing surface.
8. **One consolidated comment** — all surviving findings go in a single PR comment, each referencing its `path:line` in text; preserve lens tags and severity on every finding; skip duplicates.

## Composition Lineage

Sibling of `review-loop` and `comment-review`. All three surface review findings, but they differ in what they target and what they do with the findings:

- `/lens-review` is a **one-pass fixed-lens review that POSTS a single PR comment** for human reviewers — it frames a fixed panel (category theory ∥ type theory ∥ operational semantics) plus a gap scan over a PR diff and writes the findings back as a single consolidated GitHub comment. It does not apply fixes and does not loop.
- `/review-loop` is **convergence-paced** — it drives a pluggable review source (`codex` | `code-review`) and applies fixes to verdict-convergence (ends when the source verdict reaches approve), gating the judgment calls.
- `/comment-review` targets **markdown artifacts before fixation** and surfaces findings through a browser sidepanel, user-paced.

`/lens-review` composes `/frame` (prothesis) to frame the three fixed lenses and `/gap` (syneidesis) for the gap audit. The posting step is a substrate write routed to the harness permission layer, not an in-skill gate.
