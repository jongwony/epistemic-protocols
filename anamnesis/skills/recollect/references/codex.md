# Codex realization

Read this reference before searching Codex conversation records or emitting a Codex resume handle. It binds where the records live, how a record identifies its session and its speakers, and how to reopen one; where to look and how far is the protocol's judgment.

## Where the records live

- Resolve `{codex_home}` from `CODEX_HOME`, falling back to `~/.codex`. This is the first root searched; another Codex home is a further root when the recall points at it, and every candidate is labeled with the root it was found under.
- Conversation records: `{codex_home}/sessions/**/rollout-*.jsonl` plus `{codex_home}/archived_sessions/**/rollout-*.jsonl`.
- Compact catalog: `{codex_home}/hypomnesis/catalog/*.json` — a gist per session, a cue and never evidence.
- Current per-session pointer: `{codex_home}/hypomnesis/{session-id}/current.json`, naming the generation built from the highest transcript revision captured, where revisions are ordered by modification time first and then by size. The generation it replaces stays on disk under its own revision key.
- Immutable semantic generations: `{codex_home}/hypomnesis/{session-id}/generations/*/record.json`.
- Capture outcomes: before reading them for the records a search examined, read `capture-outcome.md`; bind `{store-root}` to `{codex_home}/hypomnesis` and the session ID to the rollout's `session_meta.payload.id` or the catalog's `session_id`.

## What a record says of itself

The first line of a rollout is `{"type":"session_meta"}`, whose `payload` carries `id`, `cwd`, `timestamp`, and `originator`. For a record found, bind `Member.locator` to the rollout path under its root — the catalog's `record_path` dereferences to the generation that indexed it, not to the record Ground opens — the session id and working directory from `session_meta`, and recency from its `timestamp`, or from the catalog entry's `last_turn_at` where the entry outlives its rollout. A catalog entry's `source_scan`, where present, records how completely the source reached its capture: `skipped_lines`, `unverified_user_turns`, and `omitted_chars` bind `SourceScan.skippedLines`, `SourceScan.unverifiedPersonTurns`, and `SourceScan.omittedChars`, each unknown where the entry does not carry it. Codex records have no substitute channel and no fork parent.

**Speakers.** The person's turns are `response_item` entries with `role == "user"` — the channel that is always present; `event_msg`/`user_message`, which an interactive session may not emit at all, is a cross-check only. Skip an entry whose text (its content items joined with newlines, then trimmed of leading whitespace) begins with one of these injected-envelope prefixes: `# AGENTS.md instructions`, `<environment_context>`, `<codex_internal_context`, `<skill`, `<turn_aborted>`, `<recommended_plugins>` (kept identical to `SYNTHETIC_USER_TEXT_PREFIXES` in `hypomnesis-codex-write.mjs`). Assistant entries are the assistant's; a claim resting on one is what the assistant said, not what the person decided.

**Cost.** Reading `session_meta` is one line. A search for a field across many rollouts reads each to wherever the field sits, or to the end where it is absent; bound such reads explicitly.

## Writer lifecycle

The shared hook dispatcher recognizes Codex rollout paths on Stop, PreCompact, and SessionEnd. A worker serializes work per session, coalesces queued events to the newest transcript revision, extracts, writes an immutable generation, refreshes the catalog entry, and advances `current.json` last — so a partial publication leaves the pointer where it was. `agents/openai.yaml` supplies Codex skill discovery metadata only.

## Opening and resuming

Ground opens the member's rollout at its locator and takes the span the cue reaches, each turn with its speaker under the rule above, with that path as the excerpt's locator.

For a candidate whose working directory is recorded **and still present on disk**, emit the literal handle:

```text
cd <cwd> && codex resume <session_id>
```

Check the directory before emitting the `cd`. When the recorded path is gone — the ordinary end state for work done in a worktree retired at the close of its unit — drop the prefix and emit the session handle alone, noting that project context resolves from wherever it is run rather than from the original directory:

```text
codex resume <session_id>
```

When the working directory was never recorded, report the candidate as identified and omit the resume command. A record found under another root resumes only with that root as `CODEX_HOME`; say so beside the handle.
