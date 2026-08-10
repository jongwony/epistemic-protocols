# Codex realization

Read this reference before scanning the Codex store or emitting a Codex resume handle.

## Store binding

- Resolve `{codex_home}` from `CODEX_HOME`, falling back to `~/.codex`.
- Compact catalog: `{codex_home}/hypomnesis/catalog/*.json`.
- Current per-session pointer: `{codex_home}/hypomnesis/{session-id}/current.json`.
- Immutable semantic generations: `{codex_home}/hypomnesis/{session-id}/generations/*/record.json`.
- Raw SSOT: `{codex_home}/sessions/**/rollout-*.jsonl` plus `{codex_home}/archived_sessions/**/rollout-*.jsonl`.

The compact catalog is the initial scan surface. Dereference `record_path` only for candidates that need richer recognition evidence. Raw rollout JSONL enters scope only through the StoreExpansion checkpoint in Phase 1.

Bind `Candidate.runtime = codex`; bind `session_id`, `cwd`, topic, keywords, narrative, and temporal fields directly from the catalog entry. Codex records have no substitute-channel or fork-parent realization, so `fork_marker = false`, `parent_pointer = Null`, and `parent_cwd = Null`.

## Writer lifecycle

The shared hook dispatcher recognizes Codex rollout paths on Stop, PreCompact, and SessionEnd. Hook-side work writes an immutable queue job and detaches a worker. The worker:

1. serializes work with a per-session recoverable lock;
2. coalesces queued events to the newest transcript revision;
3. invokes an ephemeral `gpt-5.6-luna` Codex extraction at `xhigh` reasoning with hooks disabled;
4. writes an immutable generation;
5. atomically advances `current.json`, then refreshes the compact catalog entry.

A generation never changes after publication. A later lifecycle event at the same transcript revision reuses that generation. Nested extraction runs disable hooks, preventing recursive capture.

`agents/openai.yaml` supplies Codex skill discovery metadata only. Hook registration remains in the plugin's default `hooks/hooks.json` surface.

## Resume

For a candidate with both `cwd` and `session_id`, emit the literal handle:

```text
cd <cwd> && codex resume <session_id>
```

When cwd is absent, report the candidate as identified but omit the resume command.
