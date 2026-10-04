# Claude Code Host

Load when the host driving this skill is Claude Code: at Phase 2 for either runner's launch, and
at Phase 3 for the `claude` runner's pass outcome, tool record, and continuation. `${SUFFIX}`,
`${PASS}`, and every other generated value are substituted literally into each block.

## Codex runner launch

Run each `codex exec` pass — the launch and every `codex exec resume` continuation — through the
Bash tool in the background, `Bash(run_in_background: true, timeout: 4500000)` — 4,500,000 ms is
the 75-minute envelope — and wait for its completion notification.

## Claude runner launch

Start a background subagent through the Agent tool, with the brief as its whole prompt and no
fork of this conversation, and keep the agent's name or id: the continuation addresses it.

Before launch, confirm that Tavily's search and extract tools are among this session's own
tools. What a background subagent may call follows the host's subagent configuration, and a
background subagent cannot answer a permission prompt; neither was verified for Tavily here, so
availability is settled by the record rather than assumed: a Tavily call that was denied or
unavailable appears in the record as an errored result or not at all, and the run then reads as
failed calls or as the zero-call outcome. Nothing fails open.

Whether a `/goal` line engages Claude Code's own goal command inside a background subagent has
not been confirmed, so none is sent: the brief states the goal condition as text, and the Phase 3
loop judges it in this session. Phase 4 shows the goal as not confirmed on this route.

## Record

A background subagent's output file, as the host reports it on launch or completion, resolves to
the subagent's transcript: a JSONL file under `~/.claude/projects/<project>/`, in a
`subagents/agent-<id>.jsonl` path (one observed form nests it under the parent session's
directory). Resolve each reported path, following a symlink, rather than constructing it, and
append it to `/tmp/goal_research_${SUFFIX}/transcripts.txt`, one path per line — the launch's
first, then each continuation's — as each pass completes. Where the host reported no path and
none resolves, the record is not readable and Phase 3's not-readable outcome applies: the checks
have not run, while the pass outcome below still holds.

The run's record is every transcript listed there, each once, in order — one file in the common
case, several where a continuation wrote a different one:

```bash
D=/tmp/goal_research_${SUFFIX}
st=0; : > "$D/record.jsonl"
awk '!seen[$0]++' "$D/transcripts.txt" > "$D/transcripts.once.txt" || st=1
while IFS= read -r t; do cat "$t" >> "$D/record.jsonl" || st=1; done < "$D/transcripts.once.txt"
[ -s "$D/record.jsonl" ] || st=1
printf '%s\n' "$st" > "$D/record.status"
```

Then run Phase 3 step 2's Claude message record reduction unchanged. A tool result the transcript
stored truncated, or replaced with a pointer to a file, fails to parse as JSON and is counted as
not mechanically readable; read it in step 3.

## Pass outcome

A pass's report is the subagent's result as the host delivers it to this session — its final
message, or the message it hands back — and the pass returned when the host reports the subagent
completed and that result is non-empty. When the host's completion notification for the pass
arrives, write its status alone — `0` where it reports the subagent completed, `1` otherwise — to
`/tmp/goal_research_${SUFFIX}/p${PASS}.status`, and the delivered result, unchanged, to
`/tmp/goal_research_${SUFFIX}/p${PASS}.report.txt`. Then read the pass:

```bash
D=/tmp/goal_research_${SUFFIX}; P=$D/p${PASS}
if [ "$(cat "$P.status" 2>/dev/null)" = 0 ] && grep -q '[^[:space:]]' "$P.report.txt" 2>/dev/null
then echo "pass ${PASS}: returned"
else : > "$P.report.txt"; echo "pass ${PASS}: failed"
fi
```

The transcript is read only for the tool record above, never for the pass outcome.

## Continuation

Continue the same subagent — send the continuation message to it by the name or id kept at
launch — rather than spawning a new one, so its context carries on. Its tool record is rebuilt
from every transcript the run has written, as above, after each pass.
