# Claude Code Host

Load when the host driving this skill is Claude Code: at Phase 2 for either runner's launch, and
at Phase 3 for the `claude` runner's record, narrative, and continuation.

## Codex runner launch

Run the `codex exec` command — and each `codex exec resume` continuation — through the Bash tool
in the background, `Bash(run_in_background: true, timeout: 4500000)` — 4,500,000 ms is the
75-minute envelope — and wait for its completion notification.

## Claude runner launch

Start a background subagent through the Agent tool, with the brief as its whole prompt and no
fork of this conversation, and keep the agent's name or id: the continuation addresses it.

Before launch, confirm that Tavily's search and extract tools are among this session's own
tools. What a background subagent may call follows the host's subagent configuration, and a
background subagent cannot answer a permission prompt; neither was verified for Tavily here, so
availability is settled by the record rather than assumed: a Tavily call that was denied or
unavailable appears in the record as an errored result or not at all, and the run then reads as
failed calls or as the zero-call outcome. Nothing fails open.

Whether the brief's `/goal` line engages Claude Code's own goal command inside a background
subagent has not been confirmed. The Phase 3 loop judges the goal condition in this session
either way.

## Where the record is

A background subagent's output file, as the host reports it on launch or completion, resolves to
the subagent's transcript: a JSONL file under `~/.claude/projects/<project>/`, in a
`subagents/agent-<id>.jsonl` path (one observed form nests it under the parent session's
directory). Resolve the reported path, following a symlink, rather than constructing it. Where the
host reported no path and none resolves, the record is not readable and Phase 3's not-readable
outcome applies.

Bind `REC` to the resolved transcript path and run Phase 3 step 2's Claude message record
reduction unchanged. A tool result the transcript stored truncated, or replaced with a pointer to
a file, fails to parse as JSON and is counted as not mechanically readable; read it in step 3.

## Narrative

The subagent's final message is its last assistant message with text, joined across the entries
the transcript splits it into:

```bash
jq -rs '[.[] | select(.type=="assistant")] as $a
  | ([$a[] | select([.message.content[]? | select(.type=="text")] | length > 0)] | last | .message.id) as $id
  | [$a[] | select(.message.id == $id) | .message.content[]? | select(.type=="text") | .text] | join("\n")' \
  "$REC" > /tmp/goal_research_report_${SUFFIX}.txt
```

## Continuation

Continue the same subagent — send the continuation message to it by the name or id kept at
launch — rather than spawning a new one, so its context and its transcript carry on. Before
reducing again, confirm which transcript the continuation wrote to; where it is a different file
from the launch's, reduce both together.
