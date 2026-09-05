# Codex realization

Read this reference before scanning the Codex store or emitting a Codex resume handle.

## Store binding

- Resolve `{codex_home}` from `CODEX_HOME`, falling back to `~/.codex`.
- Compact catalog: `{codex_home}/hypomnesis/catalog/*.json`.
- Current per-session pointer: `{codex_home}/hypomnesis/{session-id}/current.json`. It tracks the
  highest transcript revision captured for the session, where revisions are ordered by modification
  time first and then by size. A rollout rewritten smaller at the same or an earlier modification
  time produces its own generation and the pointer declines to move back to it; a declined move is
  recorded in the session log rather than passing as a no-op. Because modification time is compared
  first, a rewrite that is both smaller and later does advance the pointer — being thinner is not on
  its own what holds a revision back. The generation it replaces stays on disk under its own
  revision key either way.
- Immutable semantic generations: `{codex_home}/hypomnesis/{session-id}/generations/*/record.json`.
- Raw SSOT: `{codex_home}/sessions/**/rollout-*.jsonl` plus `{codex_home}/archived_sessions/**/rollout-*.jsonl`.

The compact catalog and the rollout spines are the initial scan surface together. Ground opens the rollout of each member of the recognizable about to be presented — one named record per member, at any scope — and takes the excerpt the cue reaches, with the rollout path as `Excerpt.locator`; `record_path` dereferences to the generation that indexed it. Rollout **bodies** are *scanned* across the store only through the StoreExpansion checkpoint in Phase 1.

Bind `Candidate.runtime = codex`; bind `session_id`, `cwd`, topic, keywords, `cross_refs`, narrative, and temporal fields directly from the catalog entry, along with `evidence_mode` from the entry's `evidence_modes` and `source_scan` from its `source_scan` (absent in an entry written before either was captured — bind Null, which is neutral in ranking). Both must be bound here or the emit cannot qualify what it presents: `source_scan` is what `Recalled context currency is not fidelity` reads to say a record was built from a partially readable source. The catalog publishes `cross_refs` as bare strings, so each binds as a `LegacyAnchor` — kind-unknown, extending an edge and never rejected; binding it is what gives this realization the stored-anchor channel that edge inference reads above session scope, where an unbound field would leave Codex candidates joinable by shared keywords, topic, cwd and recency alone. Codex records have no substitute-channel or fork-parent realization, so `fork_marker = false`, `parent_pointer = Null`, and `parent_cwd = Null`.

## Spine tier

`SSOT_spine` joins the initial scan alongside the catalog, and it is the surface that carries this realization before its catalog exists at all — the writer below populates the catalog going forward, while rollouts already on disk predate it. Scanning spines unconditionally is what makes those reachable without sending every recall through the checkpoint.

The first line of a rollout is `{"type":"session_meta"}`, whose `payload` carries `id`, `cwd`, `timestamp`, and `originator`. One line yields the whole spine, so this tier costs less here than on Claude, where the origin label sits further into the record.

First human utterance: read `response_item` entries with `role == "user"` — the channel that is always present, unlike `event_msg`/`user_message`, which a `codex-tui` interactive session emits zero of even though every genuine human turn still lives in `response_item`. Skip an entry whose text (its content items joined with newlines, then trimmed of leading whitespace) begins with one of these injected-envelope prefixes: `# AGENTS.md instructions`, `<environment_context>`, `<codex_internal_context`, `<skill`, `<turn_aborted>`, `<recommended_plugins>` (kept identical to `SYNTHETIC_USER_TEXT_PREFIXES` in `hypomnesis-codex-write.mjs`). "First" means first AFTER that filtering, not first in file order — in an exec rollout the first unfiltered `response_item` user entry is typically the `<recommended_plugins>` envelope. `event_msg`/`user_message`, where present, is a cross-check only; it must never be read as the source, since interactive sessions carry none.

**Spine scan.** Enumerate recency-first across live and archived rollouts, then read each record's head:

```bash
find "{codex_home}/sessions" "{codex_home}/archived_sessions" -name 'rollout-*.jsonl' -print0 2>/dev/null \
  | xargs -0 ls -t | head -n <N>
```

```bash
head -1 "<rollout>" | jq -c 'select(.type=="session_meta") | .payload | {id, cwd, timestamp, originator}'
head -n 600 "<rollout>" | jq -rs '
  [ .[]?
    | select(.type=="response_item" and .payload.type=="message" and .payload.role=="user")
    | ([.payload.content[]? | .text? // empty] | join("\n") | sub("^\\s+";""))
    | select(length > 0)
    | select(
        (startswith("# AGENTS.md instructions") or
         startswith("<environment_context>") or
         startswith("<codex_internal_context") or
         startswith("<skill") or
         startswith("<turn_aborted>") or
         startswith("<recommended_plugins>")) | not)
  ] | .[0] // ""'
```

## Writer lifecycle

The shared hook dispatcher recognizes Codex rollout paths on Stop, PreCompact, and SessionEnd. Hook-side work writes an immutable queue job and detaches a worker. The worker:

1. serializes work with a per-session recoverable lock;
2. coalesces queued events to the newest transcript revision;
3. invokes an ephemeral `gpt-5.6-luna` Codex extraction at `xhigh` reasoning with hooks disabled;
4. writes an immutable generation;
5. atomically refreshes the compact catalog entry, then advances `current.json` — the pointer moves last so a partial publication leaves it un-advanced and the next run republishes, rather than certifying a stale read surface.

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
