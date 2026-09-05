# Claude Code realization

Read this reference before scanning the Claude Code store or emitting a Claude resume handle.

## Store binding

- Resolve `{config_dir}` from `CLAUDE_CONFIG_DIR`, falling back to `~/.claude`.
- Resolve `{slug}` from the project partition containing the active transcript.
- Semantic INDEX: `{config_dir}/projects/{slug}/hypomnesis/{session-id}/`.
- Substitute INDEX: `{config_dir}/projects/{slug}/hypomnesis/subagent/{agent_id}.jsonl`.
- Raw SSOT: `{config_dir}/projects/{slug}/*.jsonl`.
- `memory/` is a user-curated adjunct and is outside the scan store.

Bind `Candidate.runtime = claude`. Bind the remaining candidate fields from INDEX frontmatter: `session_id`, optional `cwd`, `cross_refs`, and the highest evidence tier over matched artifacts. Legacy entries without evidence metadata remain neutral in ranking.

Claude partitions INDEX by project slug. A cross-cwd scan reaches the canonical partition selected by the session transcript rather than searching cwd-scattered copies.

## Spine tier

`SSOT_spine` joins the initial scan alongside the INDEX. Unlike the INDEX lookup, the spine scan is **not** slug-partitioned — it reaches every project directory under `{config_dir}/projects/`. A session whose working directory has since been removed keeps its record under a partition that no current cwd selects, so a partitioned spine scan would make exactly the sessions hardest to recall the ones it cannot see.

A session record sits directly inside a project directory. Anything nested deeper is a subordinate capture, not a session, and is excluded by depth rather than by name — the naming of those subdirectories is not stable enough to filter on.

Per record, bind:

- recency from the file's modification time;
- `session_id` from the filename, `cwd` from the record;
- the origin label from the **first** `entrypoint` value within the record's leading window — first match wins, which is how the runtime itself classifies the record, so a later value in the same file does not reclassify it;
- `bridgeSessionId` when a `{"type":"bridge-session"}` line is present;
- the topic from the first human turn, under the filter below.

**Human-turn filter.** A turn is the session's own human when `type` is `user`, `isMeta` and `isCompactSummary` are both absent, and the text neither opens with `<` nor is a bare control marker such as `[Request interrupted by user]`. Hook injections and cross-session envelopes arrive in that same `user` stream while being written by something other than the person; without the filter the spine attributes machine text to them, and the candidate presented for recognition is one the user never said.

**Bridge handle.** `cse_…` and `session_…` are one identifier in two spellings. A recorded `bridgeSessionId` therefore yields the session's web address by prefix substitution:

```text
https://claude.ai/code/session_<suffix>
```

**Spine scan.** Enumerate recency-first across all partitions, then read each record's head:

```bash
find "{config_dir}/projects" -mindepth 2 -maxdepth 2 -name '*.jsonl' -print0 \
  | xargs -0 ls -t | head -n <N>
```

```bash
head -c 65536 "<record>" | grep -om1 '"entrypoint":"[^"]*"'
grep -m1 '"type":"bridge-session"' "<record>"
head -n 400 "<record>" | jq -rs '
  [ .[]?
    | select(.type=="user")
    | select((.isMeta // false) | not)
    | select((.isCompactSummary // false) | not)
    | ( .message.content
        | if type=="string" then . else ([ .[]? | select(.type=="text") | .text ] | join(" ")) end )
    | select(type=="string" and (startswith("<") | not))
  ] | .[0] // ""'
```

Both reads are bounded per record. Neither opens a transcript body: a body is opened by Ground, one named record per member of the recognizable about to be presented, and scanned across the store only after ExpandFullText.

## Fork candidates

Claude substitute-channel records can identify a sidechain whose own ID is not resumable. For any such hit, read `fork-resume.md` before candidate presentation. It defines the deterministic parent back-trace and the five resume branches.

## Ground and resume

Ground opens the member's record at `{config_dir}/projects/{slug}/{session_id}.jsonl` (a fork member: its substitute capture, per `fork-resume.md`) and takes the excerpt the cue reaches — the human and assistant turns at that span, under the human-turn filter above — with the record path as `Excerpt.locator`.

For a non-fork candidate whose `cwd` is recorded **and still present on disk**, emit the literal handle:

```text
cd <cwd> && claude --resume <session_id>
```

Check the directory before emitting the `cd`. A recorded path that no longer exists is the ordinary end state for work done in a worktree retired at the close of its unit, and the handle dies at the `cd` rather than at the resume.

Apply `fork-resume.md` whenever the candidate is a fork, its cwd is absent from the record, or its recorded cwd is gone from disk.
