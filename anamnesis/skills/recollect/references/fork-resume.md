# Fork/sidechain resume — detection, back-trace, and handle construction

Read when a candidate carries `fork_marker = true`, when `Candidate.cwd` is absent, or when a recorded `cwd` no longer exists on disk — the three cases where the plain `cd <cwd> && claude --resume <session_id>` handle does not apply. Carries the `── TOOL GROUNDING ──` substrate binding that sets `fork_marker` / `parent_pointer` / `parent_cwd`, and the five-branch handle rule both emission sites (Phase 2 `Resume`, Phase 3 `Recognize`) reach.

## Substrate binding (Claude Code realization)

```
-- Fork/sidechain binding (SidechainNoSSOT): `Candidate.fork_marker = true` ⇐ the recalled id appears as an `agent_id` in INDEX_substitute ({config_dir}/projects/{slug}/hypomnesis/subagent/{agent_id}.jsonl, appended by the SubagentStop hook) AND has no sibling top-level SSOT {config_dir}/projects/{slug}/{agent_id}.jsonl of its own — the fork's turns live only in the parent record + this capture, so `claude --resume <agent_id>` has no transcript to resume
-- Parent back-trace (`backtrace_parent` ↦ `Candidate.parent_pointer`, `Candidate.parent_cwd`): deterministic, not heuristic — the substitute capture entry records `session_id` = the orchestrating parent's session id (the SubagentStop payload field), so `parent_pointer ← capture.session_id` is a direct read. The capture lives under the parent's slug by construction ({slug} = dirname of the parent transcript), so the parent is always same-slug — look only there. Resumability: if the parent's top-level SSOT {config_dir}/projects/{slug}/{parent_pointer}.jsonl still exists, `parent_pointer` is set and `parent_cwd ← that transcript's `cwd` field` when present (`parent_cwd = Null` if the parent transcript predates cwd capture — parent identified but cwd unknown); the full handle `cd <parent_cwd> && claude --resume <parent_pointer>` requires both components. If the parent SSOT has aged out, `parent_pointer = parent_cwd = Null` (non-resumable → surface the capture's recoverable artifacts). The native subagent transcript (captured verbatim as the `agent_transcript_path` field) is not relied on as a resume handle; the durable parent link is the capture's `session_id`.
```

Being a realization binding, this section is non-normative with respect to the protocol essence — any substrate that can identify a fork's orchestrating parent from the fork's own record satisfies it.

## Handle construction — the five branches

The fork id is never a valid resume handle: a fork has no top-level transcript, so `--resume <fork_id>` fails. Build the handle from `parent_pointer` and `parent_cwd` instead:

1. **`parent_pointer` and `parent_cwd` both present, and that directory exists** — emit the parent's command, `cd <parent_cwd> && claude --resume <parent_pointer>`, and note that it resumes the orchestrating parent, not the fork.
2. **`parent_pointer` present, `parent_cwd` absent** (parent identified, its cwd unknown) — omit the copy-paste command and surface the parent session id with a note to resume from the parent's own project directory.
3. **`parent_pointer = Null`** (parent record aged out) — mark the candidate non-resumable and surface the recoverable artifacts (the substitute log path plus any memory) rather than a broken command.
4. **Non-fork candidate with `Candidate.cwd` absent or empty** — omit the resume line and note the omission in the prose.
5. **Recorded cwd no longer on disk** (non-fork `Candidate.cwd`, or a fork's `parent_cwd`, naming a directory that has since been removed) — drop the `cd` prefix and emit the session handle alone:

   ```text
   claude --resume <session_id>
   ```

   Note in the prose that project context resolves from wherever the command is run, not from the original directory. This branch exists because a recorded-but-removed path is not the same condition as an unrecorded one: branch 4 tests the field, and a path whose directory was retired passes that test while still producing a command that dies at the `cd`. Work done in a worktree that is retired at the close of its unit reaches this state as a matter of course, so it is the common case for exactly the sessions a recall is most likely to be reaching for.

Test the directory's presence before emitting any `cd` prefix; branches 1 and 5 are distinguished by that check alone.

Emit only the literal command, with no narrative wrapper. The cwd component is not required for the resume itself — an explicit session id falls back to a scan across all project directories when the invocation cwd does not select the right partition. It is worth pairing when the directory exists, because it restores the project context the session ran under; it is not worth emitting when it would only break the command. The one case the fallback declines is an id present in more than one project directory, where it cannot choose between them.
