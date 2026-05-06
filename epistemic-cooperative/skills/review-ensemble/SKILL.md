---
name: review-ensemble
description: Cross-model code review composition — orchestrates /frame (Claude multi-perspective) + Codex (independent model) in parallel, then aggregates into a unified verdict. User-invoked via /review-ensemble.
skills:
  - prothesis:frame
---

# Review Ensemble

Invoke directly with `/review-ensemble` when the user wants cross-model code review by composing /frame (Claude multi-perspective) with Codex (independent model), then aggregating findings at the cross-model boundary.

**Architecture**:
```
review-ensemble
├── /frame Mode 2 (Claude: perspective selection + AgentMap? + investigation + Lens L)
├── Codex CLI (cross-model: independent review, parallel)
└── Cross-model aggregation (Lens L + Codex findings → unified verdict)
```

**Why this composition**: /frame owns Claude-side orchestration — it selects perspectives, maps them to specialized agents, and synthesizes findings into a Lens. Adding Codex provides an independent model family's view. When two independent model families converge on the same issue, that signal is stronger than any single model's confidence score.

## Phase 1: Scope Detection

1. If PR number provided as argument: `gh pr view {NUMBER} --json number,title,headRefName,changedFiles`
2. If no argument: `gh pr view --json number,title,headRefName,changedFiles 2>/dev/null`
3. PR exists: scope = PR diff (`gh pr diff {NUMBER}`)
4. No PR: scope = working tree (`git diff HEAD`)
5. No changes: ask the user what to review

Record scope type, PR number, changed files list, and the **full diff content** (needed for Codex prompt in Phase 2).

Also capture diff statistics for context:
```bash
gh pr diff {NUMBER} --stat   # or: git diff HEAD --stat
```

## Phase 2: Parallel Launch

Launch Codex in background FIRST, then invoke /frame (interactive). This maximizes parallelism — Codex runs independently while /frame engages the user for perspective selection.

### Step 1: Launch Codex Reviewers (background)

Check `which codex 2>/dev/null`. If Codex CLI is not found, skip to Step 2 and note in Phase 5 output that this was a single-model review.

Generate a unique suffix for temp files: `SUFFIX=$(openssl rand -hex 4)`

Write review prompt to `/tmp/ensemble_codex_review_${SUFFIX}.txt`, embedding the actual diff so Codex knows exactly what changed:

```
Review the following code changes for correctness, security, and edge cases.

Scope: {PR #{number} — {title} on branch {branch} | working tree changes}
Diff statistics: {diff_stat_output}

--- Begin Diff ---
{full_diff_content}
--- End Diff ---

Focus: logic errors, security vulnerabilities, missing error handling, edge cases, API contract violations.

Report each finding as:
- [{severity}] {file}:{line_range} — {description}

Severity: critical | high | medium | low | suggestion
Report only high-confidence findings. Ground all claims in the actual diff — do not speculate about code you have not seen.
End with: VERDICT: approve | needs-attention
```

Run via `Bash(run_in_background: true, timeout: 300000)`:
```bash
codex exec --skip-git-repo-check -m gpt-5.5 --config model_reasoning_effort="high" --sandbox read-only < /tmp/ensemble_codex_review_${SUFFIX}.txt
```

**Optional: codex-adversarial** — If the user requests adversarial review or the change is large/architectural, also launch an adversarial prompt in background using a distinct temp file `/tmp/ensemble_codex_adversarial_${SUFFIX}.txt` (same `SUFFIX`, different filename) so the adversarial runner does not overwrite or re-read the standard review prompt:

```
You are a skeptical reviewer. Challenge the implementation approach and design choices in the following diff.

Scope: {PR #{number} — {title} | working tree changes}

--- Begin Diff ---
{full_diff_content}
--- End Diff ---

Question: Is this the right approach? What assumptions does it depend on? Where could this fail under real-world conditions? What second-order effects might occur?

Focus: design flaws, assumption failures, approach alternatives, second-order effects on downstream consumers and deployment.

Severity: critical | high | medium | low | suggestion
Report only high-confidence findings. Ground all claims in the actual diff — do not speculate about code you have not seen.

Report each finding as:
- [{severity}] {file}:{line_range} — {description}

End with: VERDICT: approve | needs-attention
```

Execute with `Bash(run_in_background: true, timeout: 300000)`:
```bash
codex exec --skip-git-repo-check -m gpt-5.5 --config model_reasoning_effort="high" --sandbox read-only < /tmp/ensemble_codex_adversarial_${SUFFIX}.txt
```

### Step 2: Invoke /frame Mode 2 (foreground, interactive)

Check if the `prothesis:frame` skill is available. If not available (epistemic-protocols plugin not installed), fall back to the **manual review mode** described in the Fallback section below.

If available:
```
Skill("prothesis:frame", args: "Assemble a code review team for these changes. Scope: {scope_description}. Changed files: {file_list}. [select_all_perspectives]")
```

/frame will:
1. **Phase 0**: Mission Brief (Extension — explicit argument provided)
2. **Phase 1**: Context gathering (codebase exploration)
3. **Phase 2**: Perspective selection (Extension — select_all_perspectives: auto-select all proposed lenses)
4. **Phase 3**: AgentMap? → map perspectives to available agents → team investigation
5. **Phase 4**: Cross-dialogue + synthesis → **Lens L** (convergence, divergence, assessment)

The Lens L output contains:
- **Convergence**: Where Claude perspectives agree — robust findings
- **Divergence**: Where perspectives disagree — different values or evidence
- **Assessment**: Integrated analysis with attribution to contributing perspectives

## Phase 3: Collection

After /frame completes (Lens L in context), the background Codex task will send a completion notification automatically. When the notification arrives:

1. Read the Codex output from the completed background task
2. Parse Codex findings: `[severity] file:line — description` format + VERDICT
3. Record both Lens L and Codex findings for aggregation
4. Clean up the temp prompt files after reading (prevents `/tmp` accumulation across invocations):
   ```bash
   rm -f /tmp/ensemble_codex_review_${SUFFIX}.txt /tmp/ensemble_codex_adversarial_${SUFFIX}.txt
   ```

If the Codex background task has not completed yet when /frame finishes, wait for the notification — do not poll or sleep.

## Phase 4: Cross-Model Aggregation

Combine /frame's Lens L (Claude multi-perspective synthesis) with Codex findings (independent model review).

### Cross-Model Agreements

Identify findings that appear in BOTH /frame's Lens L AND Codex output:
- Same file + overlapping concern = cross-model agreement
- Different wording about the same logical concern counts — match by semantic overlap, not exact text
- Cross-model agreements have the **highest confidence** — two independent model families converged on the same issue

### Unified Verdict

- ANY `critical` finding from either source → `needs-attention`
- Cross-model agreement on `high` severity → `needs-attention`
- Both /frame assessment AND Codex verdict say `needs-attention` → `needs-attention`
- Otherwise → `approve`

**Single-source mode**: When only one source produced output (Codex unavailable or /frame failed), any `high` or `critical` finding from the available source → `needs-attention`. Cross-model agreement rules apply only when both sources are present.

## Phase 5: Output

```markdown
## Review Ensemble Results

### Verdict: {approve | needs-attention}
Scope: {PR #N | working tree} | Changed files: {N}

### Cross-Model Agreements ({N})
{Issues found by BOTH /frame (Claude) and Codex — highest confidence}

### /frame Lens (Claude Multi-Perspective)
**Convergence**: {robust findings across Claude perspectives}
**Divergence**: {where perspectives disagree}
**Assessment**: {integrated analysis}
Perspectives: {list of perspectives used}

### Codex Review
{Codex findings list}
Verdict: {codex verdict}

### Summary
- /frame: {N} perspectives, Lens with {convergence/divergence summary}
- Codex: {N} findings ({severity breakdown})
- Cross-model agreements: {N}
```

## Fallback: Manual Review Mode

When /frame (prothesis:frame skill) is not available, fall back to direct agent spawning for Claude-side review:

1. Spawn two Agent subagents with inline review prompts (no external plugin dependency):
   - **Code Review Agent**: `Agent(prompt: "Review the following code changes for bugs, logic errors, security vulnerabilities, and code quality. Scope: {scope}. Changed files: {file_list}. Diff: {diff}. Report each finding as: - [{severity}] {file}:{line_range} — {description}. End with: VERDICT: approve | needs-attention", run_in_background: true)`
   - **Simplification Agent**: `Agent(prompt: "Review the following code changes for clarity, consistency, and maintainability. Scope: {scope}. Changed files: {file_list}. Diff: {diff}. Report each finding as: - [{severity}] {file}:{line_range} — {description}. End with: VERDICT: approve | needs-attention", run_in_background: true)`
2. Launch both in parallel with Codex (all run_in_background: true)
3. Collect results and aggregate as in Phase 4, treating each agent's findings as a separate reviewer instead of Lens L sections

This mode loses /frame's perspective selection and Lens synthesis but preserves the cross-model value of Codex + Claude comparison.

## Error Handling

| Condition | Action |
|-----------|--------|
| /frame skill not available | Fall back to manual review mode (see Fallback section) |
| /frame timeout or failure | Present partial results from Codex only |
| Codex CLI not found | Run /frame only, note single-model limitation in output |
| Codex timeout (>300s) | Present /frame Lens only, note Codex timeout |
| No changes found | Report and stop at Phase 1 |
| Both sources approve, no findings | "All reviewers approve — no issues found" |

## Rules

- /frame owns Claude-side review — do not duplicate with separate Claude Agent spawns (unless in fallback mode)
- Codex runs independently — it does not see /frame's output and vice versa
- Cross-model agreement is the primary confidence signal
- Launch Codex BEFORE /frame to maximize parallelism
- Always embed the actual diff in the Codex prompt — file names alone are insufficient for meaningful review
- If Codex is unavailable, /frame alone still provides multi-perspective value via Lens L
