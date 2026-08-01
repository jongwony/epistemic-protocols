# Fork/sidechain resume — detection, back-trace, and handle construction

Read when a candidate carries `fork_marker = true`, or when `Candidate.cwd` is absent — the two cases where the plain `cd <cwd> && claude --resume <session_id>` handle does not apply. Carries the `── TOOL GROUNDING ──` substrate binding that sets `fork_marker` / `parent_pointer` / `parent_cwd`, and the four-branch handle rule both emission sites (Phase 2 `Resume`, Phase 3 `Recognize`) reach.

## Substrate binding (Claude Code realization)

```
-- Fork/sidechain binding (SidechainNoSSOT): `Candidate.fork_marker = true` ⇐ the recalled id appears as an `agent_id` in INDEX_substitute ({config_dir}/projects/{slug}/hypomnesis/subagent/{agent_id}.jsonl, appended by the SubagentStop hook) AND has no sibling top-level SSOT {config_dir}/projects/{slug}/{agent_id}.jsonl of its own — the fork's turns live only in the parent record + this capture, so `claude --resume <agent_id>` has no transcript to resume
-- Parent back-trace (`backtrace_parent` ↦ `Candidate.parent_pointer`, `Candidate.parent_cwd`): deterministic, not heuristic — the substitute capture entry records `session_id` = the orchestrating parent's session id (the SubagentStop payload field), so `parent_pointer ← capture.session_id` is a direct read. The capture lives under the parent's slug by construction ({slug} = dirname of the parent transcript), so the parent is always same-slug — look only there. Resumability: if the parent's top-level SSOT {config_dir}/projects/{slug}/{parent_pointer}.jsonl still exists, `parent_pointer` is set and `parent_cwd ← that transcript's `cwd` field` when present (`parent_cwd = Null` if the parent transcript predates cwd capture — parent identified but cwd unknown); the full handle `cd <parent_cwd> && claude --resume <parent_pointer>` requires both components. If the parent SSOT has aged out, `parent_pointer = parent_cwd = Null` (non-resumable → surface the capture's recoverable artifacts). The native subagent transcript (captured verbatim as the `agent_transcript_path` field) is not relied on as a resume handle; the durable parent link is the capture's `session_id`.
```

Being a realization binding, this section is non-normative with respect to the protocol essence — any substrate that can identify a fork's orchestrating parent from the fork's own record satisfies it.

## Handle construction — the four branches

The fork id is never a valid resume handle: a fork has no top-level transcript, so `--resume <fork_id>` fails. Build the handle from `parent_pointer` and `parent_cwd` instead:

1. **`parent_pointer` and `parent_cwd` both present** — emit the parent's command, `cd <parent_cwd> && claude --resume <parent_pointer>`, and note that it resumes the orchestrating parent, not the fork.
2. **`parent_pointer` present, `parent_cwd` absent** (parent identified, its cwd unknown) — omit the copy-paste command and surface the parent session id with a note to resume from the parent's own project directory.
3. **`parent_pointer = Null`** (parent record aged out) — mark the candidate non-resumable and surface the recoverable artifacts (the substitute log path plus any memory) rather than a broken command.
4. **Non-fork candidate with `Candidate.cwd` absent or empty** — omit the resume line and note the omission in the prose. This branch is reached from the same emission sites and is recorded here so the four cases read as one rule.

Emit only the literal command, with no narrative wrapper; Claude Code resolves the project slug from the invocation cwd, so both components are required whenever a command is emitted at all.
