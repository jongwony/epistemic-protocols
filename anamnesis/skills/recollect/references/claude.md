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

## Fork candidates

Claude substitute-channel records can identify a sidechain whose own ID is not resumable. For any such hit, read `fork-resume.md` before candidate presentation. It defines the deterministic parent back-trace and the four resume branches.

## Resume

For a non-fork candidate with both `cwd` and `session_id`, emit the literal handle:

```text
cd <cwd> && claude --resume <session_id>
```

Apply `fork-resume.md` whenever the candidate is a fork or its cwd is absent.
