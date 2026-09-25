# Claude Code realization

Read this reference before searching Claude Code conversation records or emitting a Claude resume handle. It binds where the records live, how a record identifies its session and its speakers, and how to reopen one; where to look and how far is the protocol's judgment.

## Where the records live

- Resolve `{config_dir}` from `CLAUDE_CONFIG_DIR`, falling back to `~/.claude`. This is the first root searched. Another configuration directory — an older copy moved aside, for example — is a further root when the recall points at it; search it the same way and label every candidate with the root it was found under.
- Conversation records: `{config_dir}/projects/{slug}/*.jsonl`, one partition per project slug. A session record sits directly inside a partition; anything nested deeper is a subordinate capture, not a session, and is excluded by depth rather than by name.
- Semantic index: `{config_dir}/projects/{slug}/hypomnesis/{session-id}/` — a gist per session, a cue and never evidence.
- Substitute channel: `{config_dir}/projects/{slug}/hypomnesis/subagent/{agent_id}.jsonl`, the capture of forked work.
- Capture outcomes: `{config_dir}/projects/{slug}/hypomnesis/.outcomes/`. Before qualifying a member, read `capture-outcome.md`; bind `{store-root}` to `{config_dir}/projects/{record-slug}/hypomnesis`, using the partition the record or index entry was found in.
- `memory/` holds user-curated notes. It is not enumerated as conversation records; a cue that points at a decision recorded there reaches it like any other record the past work left.

A session whose working directory has since been removed keeps its record under a partition no current directory selects, so a search that is to reach it cannot be limited to the active partition.

## What a record says of itself

For a record found, bind:

- `Member.locator` to the record's own path under its root — the path the record was found at, never one re-resolved later, since the active partition does not locate a record found in another;
- the session id from the filename, the working directory from the record's `cwd`, and its recency from the file's modification time; where an index entry survives a record already deleted, keep the path the entry names and take recency from the entry, so the member is still found and is the one Ground cannot open;
- the origin label from the **first** `entrypoint` value in the record — first match wins, as the runtime classifies it;
- `bridgeSessionId` when a `{"type":"bridge-session"}` line is present.

**Speakers.** A turn is the person's when `type` is `user`, `isMeta` and `isCompactSummary` are both absent, and the text neither opens with `<` nor is a bare control marker such as `[Request interrupted by user]`. Hook injections and cross-session envelopes arrive in the same `user` stream while written by something else; read as the person's, they put words in the person's mouth. One turn is the person's despite failing that test: a **relayed turn**, where `origin.kind` is `channel`. A transport carrying the person's words wraps them and marks the record `isMeta`; admit it on `origin.kind`, and take as the utterance what remains once the envelope and the machine-written blocks nested inside it are set aside. `type: assistant` turns are the assistant's; a claim resting on one is what the assistant said, not what the person decided.

**Cost.** A read of a record's head is bounded only where it is bounded by bytes or lines; a search for a field that a record does not carry reads to the end of the file. Bound head reads explicitly when reading across many records.

**Bridge handle.** `cse_…` and `session_…` are one identifier in two spellings. A recorded `bridgeSessionId` yields the session's web address by prefix substitution:

```text
https://claude.ai/code/session_<suffix>
```

## Fork candidates

Substitute-channel records can identify forked work whose own ID is not resumable. For any such hit, read `fork-resume.md` before presenting it. It defines the parent back-trace and the five resume branches.

## Opening and resuming

Ground opens the member's record at its locator (a fork member: its substitute capture, per `fork-resume.md`) and takes the span the cue reaches — the turns there, each with its speaker under the rule above — with the record path as the excerpt's locator.

For a non-fork candidate whose working directory is recorded **and still present on disk**, emit the literal handle:

```text
cd <cwd> && claude --resume <session_id>
```

Check the directory before emitting the `cd`. A recorded path that no longer exists is the ordinary end state for work done in a worktree retired at the close of its unit, and the handle dies at the `cd` rather than at the resume. A record found under another root resumes only with that root as `CLAUDE_CONFIG_DIR`; say so beside the handle.

Apply `fork-resume.md` whenever the candidate is a fork, its working directory is absent from the record, or its recorded directory is gone from disk.
