---
name: lens-review
description: "A fixed-lens multi-perspective PR review that posts findings as inline PR comments. Applies a fixed perspective panel — Category Theory (morphism coherence, composition, functor consistency), Type Theory (signature soundness, variance, type safety), Operational Semantics (evaluation order, phase transitions, state consistency) — plus a gap scan, over only the files changed in a PR, then posts inline + summary comments. Composes prothesis:frame for lens framing and syneidesis:gap for the gap audit. User-invoked via /lens-review. Sibling of /review-loop (which applies fixes to convergence) and /comment-review (markdown artifacts)."
skills:
  - prothesis:frame
  - syneidesis:gap
---

# Lens Review

A one-pass, fixed-lens multi-perspective review of a PR diff: it frames three fixed perspectives (Category Theory ∥ Type Theory ∥ Operational Semantics) plus a gap scan over only the changed files, then posts the findings back to the PR as inline + summary comments for human reviewers.

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
  Phase 0  : scope detect (PR number → gh pr diff | current-branch PR | working tree) + capture base SHA + changed files + free-exit
  Phase 1  : diff prep   — name-status map (A/M/D/R, authoritative file fate) ∥ unified diff; state diff-reading conventions
  Phase 2  : fixed-lens review — changed files only, through /frame (Category Theory ∥ Type Theory ∥ OpSem) + /gap (Procedural/Consideration/Assumption/Alternative)
                            each finding: file:line + lens tag + severity + evidence-grounded rationale, confidence ≥ 80%
  Phase 3  : direction-error guard (verify) — cross-check review text vs name-status map; Added-but-described-as-deleted → warning augment (relay)
  Phase 4  : post comments — inline PR review comments (file:line in diff) + summary comment; substrate write → harness permission
  free-exit : user may end the review at any time (declared once in Phase 0)
```

The skill's identity is the fixed lens panel applied once over a PR diff and posted back as PR comments — a one-pass review for human reviewers, not a convergence loop.

## When to Use

- One-pass multi-perspective review of a PR from fixed epistemic lenses (category theory, type theory, operational semantics) plus a gap audit
- You want the findings posted back to the PR as inline + summary comments for human reviewers to consume
- The change is protocol-level or formally structured, where morphism/type/evaluation-order coherence is the load-bearing review axis

## When NOT to Use

- Driving review findings all the way to fixed (apply-and-converge) — that is `/review-loop` (this skill posts comments, it does not apply fixes)
- Reviewing a markdown artifact before fixation — that is `/comment-review` (this skill targets a PR code diff and posts GitHub comments)
- A general correctness-bug review with no fixed-lens framing — call `/review-loop` with the built-in `code-review` source directly

## Phase 0: Scope Detection + Free-Exit

**Scope detection**:

1. PR number given as `scope`: scope = `gh pr diff {N}`; resolve `{N}` and the head SHA via `gh pr view {N} --json number,headRefOid,baseRefOid`
2. No PR argument: `gh pr view --json number,headRefOid,baseRefOid,changedFiles 2>/dev/null` to detect a current-branch PR; if found, scope = its diff
3. No PR: scope = working tree (`git diff HEAD`)
4. No changes anywhere: report and stop (nothing to review)

Capture the **resolved base SHA** (the PR base commit the diff is taken against) and the **changed-files list** — these anchor Phase 1's name-status map and the inline-comment commit_id in Phase 4.

**Free-exit affordance (declared once).** Announce here, before the review begins: *"You can end this review at any time by saying so; I will stop and report what has been gathered."* This is a free-response pathway, not a gate option — it does not reappear as a peer option at later phases.

## Phase 1: Diff Preparation

Produce two artifacts over the resolved scope:

1. **Name-status map** — `git diff --name-status {base}...HEAD` (PR scope; working tree → `git diff --name-status HEAD`). This map is **authoritative for file fate**:
   - `A <path>` — Added: created by this PR; does NOT exist on the base branch
   - `M <path>` — Modified: exists on both base and head; the diff shows the line-level changes
   - `D <path>` — Deleted: exists on the base branch, removed by this PR
   - `R<score> <old> <new>` — Renamed (old path replaced by new path)

2. **Unified diff** — `gh pr diff {N}` (PR scope) or `git diff HEAD` (working tree). State the **diff-reading conventions** explicitly before reviewing:
   - Lines starting with `+` are added by this PR; lines starting with `-` are removed; a leading space is unchanged context.
   - For files marked `A` in the status map, the diff begins with `--- /dev/null` and `+++ b/<path>`; the `+` lines are the file's initial content.
   - For files marked `D` in the status map, the diff begins with `--- a/<path>` and `+++ /dev/null`; the `-` lines are the file's prior content removed by this PR.

The name-status map is the authoritative source for file fate; the unified diff carries the line-level evidence. Both feed Phase 2, and the map is re-used by the Phase 3 direction-error guard.

## Phase 2: Fixed-Lens Review

Review **only the changed files** from the fixed perspective panel. Call `/frame` (prothesis) to frame the three lenses, and `/gap` (syneidesis) for the gap audit; the lenses and gap dimensions are fixed at definition time:

- **Category Theory** — morphism coherence, composition laws, functor consistency
- **Type Theory** — type-signature soundness, variance, type safety
- **Operational Semantics** — evaluation order, phase transitions, state consistency
- **Gap Scanning** (via `/gap`) — scan decision points in the diff for unnoticed gaps:
  - **Procedural** — missing steps or incomplete workflows
  - **Consideration** — unaddressed trade-offs
  - **Assumption** — implicit assumptions needing explicit statement
  - **Alternative** — unexplored approaches

Each finding carries:

- **File path + line number** drawn from the diff (the line must appear in the diff)
- **Tag** — `[Category Theory]`, `[Type Theory]`, `[OpSem]`, or `[Gap: <type>]`
- **Severity** — Critical / Important / Suggestion
- **Evidence-grounded rationale** — reference the actual changed code; confidence ≥ 80% (drop lower-confidence findings)

If the changes are trivial (e.g. version bumps only), state that briefly and skip the full lens sweep.

## Phase 3: Direction-Error Guard (Verify)

Before posting, cross-check the review text against the Phase 1 name-status map. For each file marked **Added** (`A`) in the map, if the review describes that file as deleted, that is a likely diff-direction inversion — the reviewer read the diff backwards. Surface a warning that augments the review (it does not replace the findings): a direction-misread notice listing each Added-but-described-as-deleted file, advising verification against the name-status map before treating those findings as legitimate.

This is a relay verify step — a deterministic cross-check of the review text against the authoritative fate map, presented and proceeded through; it does not gate.

## Phase 4: Post Comments

Post the findings back to the PR. This is a **substrate write** — an external, human-visible GitHub mutation — so it routes to the **harness permission layer**: surface what will be posted (the inline comments and the summary) and let the harness gate the execution. The skill does not absorb that decision.

For each finding that references a file:line **present in the diff**, `call` an inline PR review comment:

- `gh api repos/{repo}/pulls/{N}/comments` with `body`, `path`, `commit_id` (the resolved head SHA), and `line`.

Then `call` a final summary comment via `gh api repos/{repo}/issues/{N}/comments` with `body`.

Posting discipline:

- Only post findings whose line numbers appear in the diff; a finding referencing a line outside the diff goes into the summary comment instead.
- Preserve the lens tags (`[Category Theory]` / `[Type Theory]` / `[OpSem]` / `[Gap: <type>]`) and the severity (Critical / Important / Suggestion) on each posted comment.
- Skip duplicate or near-duplicate findings.
- Always post the summary comment, even when inline comments were posted, so the PR carries an overview.
- Write Markdown comment bodies through a file (e.g. a heredoc to a temp file) and load them with `gh api --input` / `jq --rawfile`; do not pass Markdown bodies inside a double-quoted shell argument, because backticks in Markdown trigger shell command substitution.

If the scope is a working tree (no PR), there is no PR to post to — present the findings in session text instead and note that posting requires a PR.

## Rules

1. **Changed files only** — review the files in the Phase 1 name-status map and nothing else; the name-status map is authoritative for file fate, the unified diff for line-level evidence.
2. **Confidence ≥ 80%** — only report findings at or above the confidence threshold; trivial changes (e.g. version bumps) are stated briefly and skipped rather than padded with low-value findings.
3. **Verify before post** — run the Phase 3 direction-error guard against the name-status map before any comment is posted; an Added-but-described-as-deleted file augments the review with a direction-misread warning.
4. **Substrate writes route to harness permission** — posting PR comments is an external, human-visible GitHub mutation; surface what will be posted and let the harness gate the execution. The skill does not absorb that substrate decision.
5. **Context-question separation at gates** — present all analysis and evidence as text before any gate; a gate carries only the question and the options with their differential implications.
6. **Plain everyday language** in all user-facing emit — no internal protocol jargon at the user-facing surface.
7. **Only post findings whose lines appear in the diff** — out-of-diff findings go in the summary comment; preserve lens tags and severity on every posted finding; skip duplicates.

## Composition Lineage

Sibling of `review-loop` and `comment-review`. All three surface review findings, but they differ in what they target and what they do with the findings:

- `/lens-review` is a **one-pass fixed-lens review that POSTS PR comments** for human reviewers — it frames a fixed panel (category theory ∥ type theory ∥ operational semantics) plus a gap scan over a PR diff and writes the findings back as inline + summary GitHub comments. It does not apply fixes and does not loop.
- `/review-loop` is **convergence-paced** — it drives a pluggable review source (`codex` | `code-review`) and applies fixes to verdict-convergence (ends when the source verdict reaches approve), gating the judgment calls.
- `/comment-review` targets **markdown artifacts before fixation** and surfaces findings through a browser sidepanel, user-paced.

`/lens-review` composes `/frame` (prothesis) to frame the three fixed lenses and `/gap` (syneidesis) for the gap audit. The posting step is a substrate write routed to the harness permission layer, not an in-skill gate.
