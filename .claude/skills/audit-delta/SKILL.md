---
name: audit-delta
description: "Periodic progress-tracking re-run of the c059212d epistemic-protocols audit. Surveys state of audit-derived GitHub issues (#237-#241) and Deterministic Queue items (DQ1-DQ8) via gh CLI, traces commit activity in audit scope files (Track Alpha + Track Beta), scans for emergent audit targets in newly opened issues, and produces a progress report at docs/audit-delta-YYYY-MM-DD.md. Invoke this skill whenever you want to check 'how much of the previous epistemic audit is resolved', 'track audit issue status', 'see what changed in the audit scope since the last run', 'find new audit items', or run /audit-delta. Invoke on demand for weekly-to-monthly audit progress checks. This is a lightweight delta tracker, not a fresh ensemble re-audit."
allowed-tools: Read, Grep, Glob, Bash(gh *), Bash(git *), Bash(date *), Write
---

# Audit Delta

Periodic progress check for the `c059212d` epistemic-protocols audit. Reads the most recent baseline `docs/audit-*.md`, polls GitHub issues and commit activity within the frozen audit scope, and produces a delta report.

## Origin & Scope

This skill captures a frozen pattern from session `c059212d-aba4-4665-9b16-616e0420d60e` (Hermeneia then Prosoche chain) which produced `docs/audit-2026-04-11.md` (the first baseline) along with GitHub issues #237 through #241 and the Deterministic Fix Queue (DQ1 through DQ8).

The original session deliberately chose a "heavy-parallel single-shot plus event-trigger" philosophy. This skill does not repeat the heavy ensemble (subagent fan-out plus Codex dual-stream); instead it reuses the original session's epistemic decisions as **frozen configuration** and tracks state changes over time via the lightweight execution layer described below.

Frozen configuration — scope file lists, anchor issue identifiers, DQ definitions, audit issue title prefix, and Minimal Viable Core regression watch list — lives in `references/frozen-config.md`. Read it before executing the procedure; the procedure references entries by name.

## Procedure

Execute the five phases in order. Each phase consumes the prior phase's output. Cite all gh and git output verbatim in the report — do not paraphrase tool output.

**Command template substitution**: Several phases use shell command templates containing `{name}` placeholders (for example `{baseline-date}` in Phase 3 and Phase 4, `{target-file}` in Phase 3, `{mvc-file}` in Phase 5). When executing these commands, replace the placeholder with the literal value before invoking the tool — do not pass brace syntax to the shell. The `{baseline-date}` value comes from Phase 1 (extracted from the baseline filename and used verbatim as a `YYYY-MM-DD` string). The `{TODAY}` placeholder is set by Phase 5's `date +%Y-%m-%d` step. Per-iteration placeholders like `{target-file}` and `{mvc-file}` are bound from the surrounding loop context.

### Phase 1: Locate Baseline

Identify the most recent prior heavy audit report.

1. Glob `docs/audit-*.md` (this pattern matches both `audit-YYYY-MM-DD.md` and `audit-delta-YYYY-MM-DD.md`).
2. **Filter out** `audit-delta-*.md` entries — those are previous skill outputs, not heavy audit baselines. The valid baseline is the most recent `docs/audit-YYYY-MM-DD.md` whose stem does not start with `audit-delta-`. **If after this filter no non-delta baseline file remains** (the directory contains only previous delta reports, or the directory is empty), treat this as the no-baseline case and follow step 4 below — do not select a delta report as a fallback baseline.
3. Extract the baseline date from the filename (`YYYY-MM-DD`).
4. Record the baseline path and date — Phases 2 through 5 reference both.

If no baseline file exists, halt and report: "No baseline audit file found in `docs/`. The first heavy audit must run before delta tracking is meaningful." Suggest the user run a fresh heavy audit following the c059212d pattern (see "Re-running the Heavy Audit" below).

### Phase 2: Anchor Issue Status Pull

Poll the five anchor issues' current state.

1. Read `references/frozen-config.md` section "Anchor Issues" to get the issue numbers and baseline-time states.
2. For each issue number, run:

   ```
   gh issue view <N> --json number,title,state,updatedAt,closedAt,labels,comments
   ```

   `gh issue view` does not accept multiple IDs in one call, so issue this command once per anchor.
3. For each issue, compute the delta against the frozen-config baseline:
   - State change (OPEN to CLOSED, or vice versa)
   - New comments since baseline (count, author, first-line summary of each new comment)
   - Label changes
4. Record one row per issue for the report's Anchor Issue Status table.
5. **Root pattern propagation**: If any sub-instantiation issue (#239, #240, or #241) changed state since baseline, surface issue #237 with status `needs re-evaluation` regardless of #237's own state change. The frozen-config.md Anchor Issues section establishes #237 as the root pattern and #239/#240/#241 as its sub-instantiations — resolving a sub-instantiation may either narrow or expand the root pattern's surface, and only the user can judge which. The propagation step exists to surface the question, not to answer it.

If `gh` is not authenticated or the network fails, halt and report the error verbatim — do not fabricate issue state.

### Phase 3: DQ Commit Trace

For each DQ item (DQ1 through DQ8 from `references/frozen-config.md` section "Deterministic Queue"), trace commit activity in the target file(s) since the baseline date.

1. For each DQ entry, get the target file path(s) from the frozen config.
2. Run:

   ```
   git log --since={baseline-date} --pretty=format:'%h %ad %s' --date=short -- {target-file}
   ```

3. Collect every commit hash plus subject line. Do **not** infer DQ resolution status from the commit messages — only the user can judge whether a commit truly addressed the DQ. Report all commits found, and let the user decide. (This follows the project's "Surfacing over Deciding" derived principle.)
4. If a target file has zero commits since baseline, mark the DQ as `untouched`. If commits exist, mark it as `commits-present` (not `resolved` — that judgment is the user's).

### Phase 4: Emergent Scan

Find new audit-relevant issues opened since baseline.

1. Run:

   ```
   gh issue list --state all --search "created:>={baseline-date}" --json number,title,state,createdAt,labels --limit 100
   ```

   The `>=` operator is intentional: it includes issues created exactly on the baseline date, matching the inclusive `git log --since={baseline-date}` semantics used in Phase 3 and Phase 5. Using `>` would create an off-by-one gap on the baseline day.

2. Read `references/frozen-config.md` section "Phase 4 Filter Set". That section is the authoritative list of signals used to decide whether an issue is audit-relevant — title prefix (loaded from `audit-issue-prefix.txt`, with trailing whitespace stripped), Track Alpha file paths, Track Beta file paths, **Deterministic Queue target file paths**, and the keyword list. The DQ-target union is critical: some DQ targets (notably DQ2's `epistemic-cooperative/.claude-plugin/plugin.json`) sit slightly outside the strict Track Alpha 10-protocol scope, and without unioning DQ paths into the filter set, commits to such files would silently miss the emergent filter.
3. For each issue returned by gh, include it in the result set if **any** signal from the Phase 4 Filter Set matches the issue title or body.
4. Exclude the five anchor issues — they are already covered by Phase 2.
5. Record the surviving issues for the report's Emergent Findings section.

If gh returns no new issues or none match the filter, the section is empty — record "No emergent audit-relevant issues since baseline" and continue.

### Phase 5: Regression Watch and Report Generation

Check whether any Minimal Viable Core file has been touched since baseline, then assemble the final report.

1. Read `references/frozen-config.md` section "Minimal Viable Core". For each MVC entry's target file, run:

   ```
   git log --since={baseline-date} --pretty=format:'%h %s' -- {mvc-file}
   ```

   Any commits found go to the report's Regression Watch section as candidates — the user judges whether they degraded the MVC.

2. **Obtain today's date** for the report filename and the `{YYYY-MM-DD}` placeholder. Run:

   ```
   date +%Y-%m-%d
   ```

   Bind the output as `{TODAY}`. Use this exact value for both the filename and the in-document `{YYYY-MM-DD}` placeholder so they match. Running `date` is the single authoritative substitution source for `{TODAY}` — do not derive it from any other context.

3. Read `references/report-template.md`.

4. Substitute placeholders. The authoritative substitution rules — placeholder names, conditional blocks (`{#if ...}`), iteration blocks (`{#each ...}`), truncation conventions, and empty-collection handling — are defined in `references/report-template.md` section "Substitution Rules". Read that section before substituting; use the placeholder names exactly as defined there. Do not invent placeholders that the template does not list, and do not paraphrase the existing names — drift between SKILL.md and the template would silently break the substitution.

5. Write the result to `docs/audit-delta-{TODAY}.md`. If a file with that name already exists (same-day re-run), use the next available numeric suffix: `docs/audit-delta-{TODAY}-2.md`, then `-3.md`, and so on. Increment until a non-existent path is found. This preserves prior same-day reports — same-day re-runs are legitimate when new commits land between runs, and silently overwriting the earlier report would lose work.

6. After writing, present a one-paragraph summary to the user with:
   - The report file path
   - Counts: anchor closed/open, DQ touched/untouched, emergent count, regression candidate count
   - One sentence on the most notable change (if any)

## Output

`docs/audit-delta-YYYY-MM-DD.md` — same directory as the original heavy audit. The naming convention is chosen so `ls docs/` shows the audit history sorted chronologically. Both `audit-YYYY-MM-DD.md` (heavy) and `audit-delta-YYYY-MM-DD.md` (light) coexist without collision.

## Caveats

This skill is **issue-centric** by design. Three limitations follow directly from that choice:

1. **Unrecorded findings are invisible.** If the user fixes a DQ item without referencing it in any commit message or issue, this skill cannot detect the fix. The DQ will remain in `commits-present` or `untouched` status indefinitely. The user must close resolved DQs explicitly via the report's Recommended Actions section.
2. **Commit message inference is shallow.** Phase 3 reports all commits touching DQ target files but does not judge intent. A commit unrelated to the DQ but touching the same file will appear in the trace. The user must read each commit to confirm relevance.
3. **Root pattern resolution is undecidable here.** Issue #237 (the root pre-formal vocabulary pattern) cannot be resolved by issue closure alone — it requires re-evaluation of the underlying epistemic claim. This skill reports state changes but does not validate that the root pattern is truly resolved. For that, re-run the heavy audit (see below).

## Re-running the Heavy Audit

If the delta tracker keeps surfacing the same untouched DQs across multiple runs, or if the user suspects the audit scope itself has drifted (new files added to the project that should have been in scope), the appropriate response is not to extend this skill — it is to re-run the original c059212d pattern. That session used Hermeneia for 5-gap clarification then Prosoche-led dual-stream ensemble (4 Claude general-purpose subagents plus Codex CLI dual stream). The artifacts of that session are preserved in `~/.claude/projects/-Users-choi-Downloads-github-private-epistemic-protocols/c059212d-aba4-4665-9b16-616e0420d60e.jsonl`.

Re-running the heavy audit is out of scope for this skill. This skill is intentionally lightweight.
