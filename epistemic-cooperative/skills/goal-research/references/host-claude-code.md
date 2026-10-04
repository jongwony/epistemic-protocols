# Claude Code Host

Load at Phase 2 whenever the host driving this skill is Claude Code, whichever runner is
designated: it carries the background binding for either runner, and, for the `claude` runner,
the launch, pass outcome, tool record, and continuation. `${SUFFIX}`,
`${PASS}`, and every other generated value are substituted literally into each block.

## Codex runner launch

Run each `codex exec` pass — the launch and every `codex exec resume` continuation — through the
Bash tool in the background, `Bash(run_in_background: true, timeout: 4500000)` — 4,500,000 ms is
the 75-minute envelope — and wait for its completion notification.

## Claude runner launch

Start a background subagent through the Agent tool, with the brief as its whole prompt and no
fork of this conversation, and keep the agent's name or id: the continuation addresses it. The host
sets no timeout on a background subagent, so the 75-minute envelope is kept here. With each pass,
start a timer whose completion notification marks the envelope — `sleep 4500` through
`Bash(run_in_background: true, timeout: 4500000)`. Where the timer's notification arrives first,
stop the subagent with the host's task-stop capability, write `1` as the pass's status, and read
the pass as failed; where the subagent's arrives first, stop the timer.

Before launch, confirm that the run can reach `/inquire`: `claude plugin list` must show the
`aitesis` plugin installed and enabled for this session; where it does not, surface the missing
capability and stop. Confirm too that Tavily's search and extract tools are among this session's
own tools. What a background subagent may call follows the host's subagent configuration, and a
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

The pass's success is the host's: when its completion notification arrives, write its status
alone — `0` where it reports the subagent completed, `1` otherwise — to
`/tmp/goal_research_${SUFFIX}/p${PASS}.status`. Its report is taken by a command, immediately,
from the terminal entry of the transcript that pass wrote — the path the Record section below
appended last to `transcripts.txt`, so append it first: the message the subagent handed back
through `SubagentHandback` where the run ended that way, otherwise the text of its final assistant
message. Nothing is retyped:

```bash
D=/tmp/goal_research_${SUFFIX}; P=$D/p${PASS}
jq -rs '[.[] | select(.type == "assistant")] as $a | ($a | last) as $l
  | (if $l.message.id? == null then [$l] else [$a[] | select(.message.id == $l.message.id)] end)
  | [.[].message.content[]?] as $c
  | ([$c[] | select(.type == "tool_use" and .name == "SubagentHandback") | .input.message | strings] | last)
    // ([$c[] | select(.type == "text") | .text] | join("\n"))' \
  "$(tail -n 1 "$D/transcripts.txt")" > "$P.report.txt"
if [ "$(cat "$P.status" 2>/dev/null)" = 0 ] && grep -q '[^[:space:]]' "$P.report.txt" 2>/dev/null
then echo "pass ${PASS}: returned"
else : > "$P.report.txt"; echo "pass ${PASS}: failed"
fi
```

Where the transcript is not readable, write the subagent's result as the host delivered it to
`p${PASS}.report.txt` instead, and read the pass with the same `if` block; the Source Check marks
the report as taken from the host's completion message, and the record's checks do not run.

## Continuation

Continue the same subagent — send the continuation message to it by the name or id kept at
launch — rather than spawning a new one, so its context carries on. Its tool record is rebuilt
from every transcript the run has written, as above, after each pass.
