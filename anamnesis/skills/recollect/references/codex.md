# Codex realization

Read this reference before scanning the Codex store or emitting a Codex resume handle.

## Store binding

- Resolve `{codex_home}` from `CODEX_HOME`, falling back to `~/.codex`.
- Compact catalog: `{codex_home}/hypomnesis/catalog/*.json`.
- Current per-session pointer: `{codex_home}/hypomnesis/{session-id}/current.json`.
- Immutable semantic generations: `{codex_home}/hypomnesis/{session-id}/generations/*/record.json`.
- Raw SSOT: `{codex_home}/sessions/**/rollout-*.jsonl` plus `{codex_home}/archived_sessions/**/rollout-*.jsonl`.

The compact catalog and the rollout spines are the initial scan surface together. Dereference `record_path` only for candidates that need richer recognition evidence. Rollout **bodies** enter scope only through the StoreExpansion checkpoint in Phase 1.

Bind `Candidate.runtime = codex`; bind `session_id`, `cwd`, topic, keywords, narrative, and temporal fields directly from the catalog entry. Codex records have no substitute-channel or fork-parent realization, so `fork_marker = false`, `parent_pointer = Null`, and `parent_cwd = Null`.

## Spine tier

`SSOT_spine` joins the initial scan alongside the catalog, and it is the surface that carries this realization before its catalog exists at all — the writer below populates the catalog going forward, while rollouts already on disk predate it. Scanning spines unconditionally is what makes those reachable without sending every recall through the checkpoint.

The first line of a rollout is `{"type":"session_meta"}`, whose `payload` carries `id`, `cwd`, `timestamp`, and `originator`. One line yields the whole spine, so this tier costs less here than on Claude, where the origin label sits further into the record.

First human utterance: the first `{"type":"event_msg"}` whose `payload.type` is `user_message`. Do **not** read `response_item` entries with `role == "user"` — that channel carries `AGENTS.md` injection rather than the person's turn, so it would present instruction text as something the user said.

**Spine scan.** Enumerate recency-first across live and archived rollouts, then read each record's head:

```bash
find "{codex_home}/sessions" "{codex_home}/archived_sessions" -name 'rollout-*.jsonl' -print0 2>/dev/null \
  | xargs -0 ls -t | head -n <N>
```

```bash
head -1 "<rollout>" | jq -c 'select(.type=="session_meta") | .payload | {id, cwd, timestamp, originator}'
head -n 600 "<rollout>" | jq -rs '
  [ .[]? | select(.type=="event_msg" and .payload.type=="user_message") | .payload.message ] | .[0] // ""'
```

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

For a candidate whose `cwd` is recorded **and still present on disk**, emit the literal handle:

```text
cd <cwd> && codex resume <session_id>
```

Check the directory before emitting the `cd`. When the recorded path is gone — the ordinary end state for work done in a worktree retired at the close of its unit — drop the prefix and emit the session handle alone, noting that project context resolves from wherever it is run rather than from the original directory:

```text
codex resume <session_id>
```

When `cwd` was never recorded, report the candidate as identified and omit the resume command.
