# Claude Code Host

Load at Phase 2 whenever the host driving this skill is Claude Code, whichever runner is
designated: it says how a pass is started here and, for the `claude` runner, the launch, the
tool record, and continuation. `${SUFFIX}`, `${PASS}`, and every other generated value are
substituted literally into each block.

## Codex runner

Run each `codex exec` pass — the launch and every `codex exec resume` continuation — through the
Bash tool in the background, `Bash(run_in_background: true, timeout: 4500000)` — 4,500,000 ms is
the 75-minute bound — and wait for its completion notification.

## Claude runner launch

Start a background subagent through the Agent tool, with the brief as its whole prompt and no
fork of this conversation, and keep the agent's name or id: the continuation addresses it. Wait
for its completion notification; the result it delivers is the pass's report, and the
notification's status is the pass's status, read as Phase 3 step 1 says. The host enforces no
bound on a background subagent; one that hangs is stopped by the user or the host's own
task-stop.

What a background subagent may call follows the host's subagent configuration, and a background
subagent cannot answer a permission prompt. A Tavily call that was denied or unavailable appears
in the record as an errored result or not at all; step 4 names it to the run in the next
continuation.

Whether a `/goal` line engages Claude Code's own goal command inside a background subagent is not
confirmed, so none is sent: the brief states the goal condition as text, and the Phase 3 loop
judges it in this session. Phase 4 shows the goal as not confirmed on this route.

## Record

A background subagent's output file, as the host reports it on launch or completion, resolves to
the subagent's transcript: a JSONL file under `~/.claude/projects/<project>/`, in a
`subagents/agent-<id>.jsonl` path, which may be nested under the parent session's directory.
Resolve each reported path, following a symlink, rather than constructing it, and append it to
`/tmp/goal_research_${SUFFIX}/transcripts.txt`, one path per line — the launch's first, then each
continuation's — as each pass ends. Where the host reported no path and none resolves, the record
is not readable, which this session reports (step 2); the report the host delivered is still the
pass's report.

The run's record is every transcript listed there, each once, in order — one file in the common
case, several where a continuation wrote a different one. Each is read whole as JSON lines, so
transcripts never run together; one that cannot be read is named in `unread.txt` and adds
nothing:

```bash
D=/tmp/goal_research_${SUFFIX}
: > "$D/record.jsonl"; : > "$D/unread.txt"
grep -v '^[[:space:]]*$' "$D/transcripts.txt" | awk '!seen[$0]++' > "$D/transcripts.once.txt"
while IFS= read -r t; do
  jq -c . "$t" > "$D/part.jsonl" && cat "$D/part.jsonl" >> "$D/record.jsonl" || echo "transcript $t" >> "$D/unread.txt"
done < "$D/transcripts.once.txt"
[ -s "$D/record.jsonl" ] || rm -f "$D/record.jsonl"
```

Then run Phase 3 step 2's Claude message record reduction unchanged. A tool result the transcript
stored truncated, or replaced with a pointer to a file, fails to parse as JSON and is counted as
not mechanically readable; read it in step 3.

## Continuation

Continue the same subagent — send the continuation message to it by the name or id kept at
launch — rather than spawning a new one, so its context carries on. Its tool record is rebuilt
from every transcript the run has written, as above, after each pass.
