# Audit Delta Report Template

This file is the markdown skeleton consumed by `SKILL.md` Phase 5. The skill reads it, substitutes placeholders, and writes the result to `docs/audit-delta-{TODAY}.md`.

Placeholders use brace syntax: `{name}`. Repeating sections use `{#each <name>}` then `{/each}`. The skill substitutes them inline — no template engine is required.

---

## Template Begin

```markdown
# Audit Delta Report — {YYYY-MM-DD}

**Baseline**: docs/audit-{baseline-date}.md
**Skill**: .claude/skills/audit-delta (frozen pattern from session c059212d)
**Scope**: Track Alpha (Mission/Vision) plus Track Beta (Soundness)
**Method**: Issue-centric delta tracking via gh CLI plus git log

## Executive Summary

- Anchor issues: **{anchor-closed-count}** closed / **{anchor-open-count}** still open (out of 5)
- DQ items: **{dq-commits-present-count}** with commits since baseline / **{dq-untouched-count}** untouched (out of 8)
- Emergent findings: **{emergent-count}** new audit-relevant issues opened since baseline
- Regression watch: **{mvc-touched-count}** Minimal Viable Core file(s) touched

{notable-change-sentence}

## Anchor Issue Status

| # | Title | Baseline | Current | New Comments | Δ |
|---|-------|----------|---------|--------------|---|
{#each anchor-issue}
| {number} | {title-truncated-60} | {baseline-state} | {current-state} | {new-comment-count} | {delta-summary} |
{/each}

### Per-Issue Notes

{#each anchor-issue-with-changes}
**#{number} — {title}**

- State: {baseline-state} → {current-state}
- Updated: {updatedAt}
- New comments since baseline:
  {#each new-comment}
  - **{author}** ({createdAt}): {first-line}
  {/each}
- Label changes: {label-delta}
- URL: {url}

{/each}

## Deterministic Queue Progress

{#each dq-entry}
### {dq-id} — {dq-title} (Severity: {severity})

- **Target**: {target-file-paths}
- **Status**: {status}  *(commits-present | untouched)*
- **Commits since baseline ({baseline-date})**:
  {#each commit}
  - `{hash}` {date} — {subject}
  {/each}
- **Completion criterion** (from frozen-config): {criterion}
- **User judgment required**: Read each commit above and decide whether DQ{dq-id-number} is now resolved. The skill does not infer resolution from commit messages.

{/each}

## Emergent Findings

{#if emergent-count == 0}
No new audit-relevant issues opened since baseline ({baseline-date}). Search criteria: title prefix from `references/audit-issue-prefix.txt`, file paths from Track Alpha and Track Beta scope, and keywords (axiom, MORPHISM, TYPES, formal block, falsifiability, Deficit Empiricism, vocabulary, soundness).
{/if}

{#each emergent-issue}
### #{number} — {title}

- Created: {createdAt}
- State: {state}
- Matched by: {match-reason}  *(prefix | path:{file} | keyword:{kw})*
- URL: {url}

{/each}

## Minimal Viable Core — Regression Watch

{#if mvc-touched-count == 0}
No Minimal Viable Core watch target was touched since baseline. The structural commitments inscribed in c059212d remain bit-identical at the file level. Note: file-level untouched does not guarantee semantic preservation — semantic regression requires re-reading the protocols themselves.
{/if}

{#each mvc-touched}
**{mvc-id} — {mvc-element}**

Touched files (subset of MVC watch targets):

{#each touched-file}
- `{path}`
  {#each commit}
  - `{hash}` — {subject}
  {/each}
{/each}

User judgment required: Read the changes and confirm they preserve or strengthen the {mvc-element} property.

{/each}

## Recommended Actions

This section is the user's worklist. The skill generates initial entries below; the user is expected to add, edit, or close them after review.

{#each anchor-issue-needs-attention}
- [ ] Review #{number}: {action-hint}
{/each}

{#each dq-with-commits}
- [ ] Confirm DQ{dq-id-number} resolution by reading the commits listed in the DQ progress section. If resolved, close the corresponding tracking item or comment on the relevant anchor issue.
{/each}

{#each emergent-issue}
- [ ] Triage emergent issue #{number}: decide whether it belongs in the next heavy audit cycle or can be resolved standalone.
{/each}

{#each mvc-touched}
- [ ] Verify {mvc-id} ({mvc-element}) was not weakened by the recent commits.
{/each}

## Caveats

This report was produced by the **lightweight** delta-tracking skill, not by re-running the heavy ensemble audit. Four reminders:

1. Issues fixed without commit-message or issue-tracker breadcrumbs are invisible to this report. The DQ progress section reflects file-level commit activity only.
2. Commit-message inference is not performed. Each commit listed under a DQ may or may not be related to that DQ — the user must read them.
3. Issue #237 (root pre-formal vocabulary pattern) cannot be resolved by issue closure alone. Validating its resolution requires re-running the heavy audit pattern from session c059212d.
4. The audit scope (Track Alpha and Track Beta file lists in `references/frozen-config.md`) was inferred from the baseline report's "Epistemic Core" scope language; the baseline cites "28 source entries" but unambiguously enumerates only 14. If a Track Alpha or Track Beta file appears mis-scoped, the appropriate fix is to run a fresh heavy audit and update frozen-config.md — do not patch the scope from inside a delta run.

For a full re-audit, see `.claude/skills/audit-delta/SKILL.md` section "Re-running the Heavy Audit".

---

*Generated by `.claude/skills/audit-delta` on {YYYY-MM-DD}.*
```

## Template End

---

## Substitution Rules

When SKILL.md Phase 5 substitutes this template:

1. **Single-value placeholders** (e.g., `{YYYY-MM-DD}`, `{baseline-date}`, `{anchor-closed-count}`): replace with the literal string. If the value is not yet known at substitution time, halt — do not write a partial report.
2. **Conditional blocks** (`{#if condition}` ... `{/if}`): include the block only if the condition holds. The conditions used in this template are:
   - `emergent-count == 0`
   - `mvc-touched-count == 0`

   The `{#if count == 0}` block and the corresponding `{#each name}` iteration are **independently evaluated but exhaustive in practice**: derive both `count` and the iteration source from the same collection so they remain consistent. When the collection is empty, the `{#each}` loop emits zero copies and the `{#if count == 0}` block emits its inline content; when the collection is non-empty, the loop emits one copy per item and the `{#if}` block is suppressed. The two forms are not structurally mutually exclusive at the template level — a substitution that triggers both (or triggers neither) indicates a count-versus-iteration-source mismatch and is a substitution bug, not valid output.
3. **Iteration blocks** (`{#each name}` ... `{/each}`): emit the inner block once per item in the named collection. The collections used in this template are:
   - `anchor-issue` — all 5 anchors, ordered by number
   - `anchor-issue-with-changes` — subset that had state, comment, or label deltas
   - `anchor-issue-needs-attention` — subset where the user is asked to review (newly closed, newly commented, newly labeled, or unchanged but stale beyond 14 days)
   - `dq-entry` — all 8 DQ entries, ordered DQ1 through DQ8
   - `commit` — commits found by git log for a specific scope
   - `dq-with-commits` — subset of dq-entry with non-empty commit list
   - `emergent-issue` — issues found by Phase 4 emergent scan
   - `mvc-touched` — subset of MVC entries with at least one touched file
   - `touched-file` — files within an MVC entry that had commits
4. **Truncation**: `{title-truncated-60}` means truncate the title to 60 characters with ellipsis. Other truncations use the same `-truncated-N` suffix.
5. **Empty collections**: when an iteration block has zero items, emit the surrounding `{#if count == 0}` text if defined, otherwise emit nothing.

## Notes for SKILL.md Implementers

- The `notable-change-sentence` placeholder is the user-facing one-line summary of the most significant delta. Heuristic: if any anchor closed, highlight that. Else, if any emergent issue is high-severity, highlight that. Else, if MVC was touched, highlight that. Else, "No significant changes since {baseline-date}."
- The "User judgment required" prose under each DQ section is intentional reinforcement of the Surfacing over Deciding principle. Do not remove it during substitution; the user re-reading the report later benefits from the reminder.
- Do not invent commit subjects. If `git log` returns truncated subjects, write them truncated. The skill must not paraphrase tool output.
- Same-day collision handling: SKILL.md Phase 5 step 5 implements an auto-increment policy — if `docs/audit-delta-{TODAY}.md` already exists, the skill writes to `docs/audit-delta-{TODAY}-2.md`, then `-3.md`, and so on. Substitution and assembly proceed normally; the collision is resolved at write time, not pre-checked. Do not halt before assembling — that would lose work when new commits land between same-day runs.
