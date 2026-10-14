# Fork/sidechain resume — detection, back-trace, and handle construction

Read when a member is a fork, when the member's record carries no working directory, or when a recorded working directory no longer exists on disk — the three cases where the plain `cd <cwd> && claude --resume <session_id>` handle does not apply. Carries the Claude realization of how a fork is recognized and its parent traced from the records, and the five-branch handle rule applied when a member's `handle` is bound — the one handle the presentation and `RecalledContext` both emit. SSOT below means a session's own top-level conversation record.

## Substrate binding (Claude Code realization)

```
-- A fork (SidechainNoSSOT): the recalled id appears as an `agent_id` in the substitute channel ({config_dir}/projects/{slug}/hypomnesis/subagent/{agent_id}.jsonl, appended by the SubagentStop hook) and has no sibling top-level SSOT {config_dir}/projects/{slug}/{agent_id}.jsonl of its own — the fork's turns live only in the parent record and this capture, so `claude --resume <agent_id>` has no transcript to resume
-- Its parent: traced deterministically, not heuristically — the substitute capture entry records `session_id`, the orchestrating parent's session id (the SubagentStop payload field), so the parent's id is a direct read of that field. The capture lives under the parent's slug by construction ({slug} = dirname of the parent transcript), so the parent is always same-slug — look only there. The parent is resumable while its top-level SSOT {config_dir}/projects/{slug}/{parent_id}.jsonl still exists; its working directory is that transcript's `cwd` field where present, and unknown where the parent transcript predates cwd capture (the parent identified, its directory not). Where the parent SSOT has aged out, the fork has no resumable parent and no parent directory (non-resumable → surface the capture's recoverable artifacts). The native subagent transcript (captured verbatim as the `agent_transcript_path` field) is not relied on as a resume handle; the durable parent link is the capture's `session_id`.
-- What the records leave: a member that is not a fork has no parent to trace; a fork with no resumable parent has no parent directory either.
```

Being a realization binding, this section is non-normative with respect to the protocol essence — any substrate that can identify a fork's orchestrating parent from the fork's own record satisfies it.

## Handle construction — the five branches

The fork id is never a valid resume handle: a fork has no top-level transcript, so `--resume <fork_id>` fails. Build the handle from the parent instead:

1. **The parent resumable, its working directory recorded, and that directory exists** — emit the parent's command, `cd <parent_dir> && claude --resume <parent_id>`, and note that it resumes the orchestrating parent, not the fork.
2. **The parent resumable, its working directory unknown** — omit the copy-paste command and surface the parent session id with a note to resume from the parent's own project directory.
3. **No resumable parent** (the parent record aged out) — mark the candidate non-resumable and surface the recoverable artifacts (the substitute log path plus any memory) rather than a broken command.
4. **Non-fork candidate with the member's recorded `cwd` absent or empty** — omit the resume line and note the omission in the prose.
5. **Recorded cwd no longer on disk** (a non-fork member's recorded `cwd`, or a fork parent's, naming a directory that has since been removed) — drop the `cd` prefix and emit the resumable handle alone: `<session_id>` for a non-fork candidate,

   ```text
   claude --resume <session_id>
   ```

   or the parent's id for a fork — the fork's own id is still never a valid handle here, per the opening note:

   ```text
   claude --resume <parent_id>
   ```

   Note in the prose that project context resolves from wherever the command is run, not from the original directory. This branch exists because a recorded-but-removed path is not the same condition as an unrecorded one: branch 4 tests the field, and a path whose directory was retired passes that test while still producing a command that dies at the `cd`. Work done in a worktree that is retired at the close of its unit reaches this state as a matter of course, so it is the common case for exactly the sessions a recall is most likely to be reaching for.

Test the directory's presence before emitting any `cd` prefix; branches 1 and 5 are distinguished by that check alone.

Emit only the literal command, with no narrative wrapper. The cwd component is not required for the resume itself — an explicit session id falls back to a scan across all project directories when the invocation cwd does not select the right partition. It is worth pairing when the directory exists, because it restores the project context the session ran under; it is not worth emitting when it would only break the command. The one case the fallback declines is an id present in more than one project directory, where it cannot choose between them.
