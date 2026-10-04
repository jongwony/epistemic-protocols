# Claude Code Host

Load when the host driving this skill is Claude Code: at Phase 2 for either runner's launch, and
at Phase 3 for the `claude` runner's pass outcome, record, and continuation. `${SUFFIX}`,
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
directory). Resolve each reported path, following a symlink, rather than constructing it. Where
the host reported no path and none resolves, the record is not readable and Phase 3's
not-readable outcome applies.

The run's record is every transcript this run wrote — the launch's, then each continuation's
where it wrote a different one — each listed once, in order:

```bash
D=/tmp/goal_research_${SUFFIX}
cat "{launch transcript}" {"each further transcript", in order} > "$D/record.jsonl"
printf '%s\n' "$?" > "$D/record.status"
```

Then run Phase 3 step 2's Claude message record reduction unchanged. A tool result the transcript
stored truncated, or replaced with a pointer to a file, fails to parse as JSON and is counted as
not mechanically readable; read it in step 3.

## Pass outcome

Write the record (above) first; the pass is read from it, together with the host's own signal.
When the host's completion notification for the pass arrives, write its status alone — `0` where
it reports the subagent finished successfully, `1` otherwise — to
`/tmp/goal_research_${SUFFIX}/p${PASS}.status`; the notification's text is not the report.

A pass starts at the last user entry that is a real prompt — the brief, or the continuation
message — and not tool results or an entry the host injected (`isMeta`: a skill body, a reminder,
a notification). The pass returned only when its status is `0` and its last assistant message
carries non-empty text, no tool call, and no mark of an API error or an aborted stream
(`isApiErrorMessage`, `isAbortedMidStream`); that text, joined across the entries the transcript
splits the message into, is the report. Anything else failed:

```bash
D=/tmp/goal_research_${SUFFIX}
if [ "$(cat "$D/p${PASS}.status" 2>/dev/null)" = 0 ] && [ "$(cat "$D/record.status" 2>/dev/null)" = 0 ] && jq -rs '
    . as $all
    | ([range(0; length) | select($all[.].type == "user" and ($all[.].isMeta | not)
        and ([$all[.].message.content | if type == "array" then .[] else {type: "text"} end | select(.type == "tool_result")] | length == 0))]
       | last // -1) as $start
    | [$all[($start + 1):][] | select(.type == "assistant")] as $a
    | ($a | last) as $l
    | if $l == null then empty
      else (if $l.message.id == null then [$l] else [$a[] | select(.message.id == $l.message.id)] end) as $entries
        | [$entries[].message.content[]?] as $blocks
        | if ($entries | any(.isApiErrorMessage == true or .isAbortedMidStream == true))
             or ($blocks | any(.type == "tool_use")) then empty
          else [$blocks[] | select(.type == "text") | .text] | join("\n") end
      end' "$D/record.jsonl" > "$D/p${PASS}.report.txt" && grep -q '[^[:space:]]' "$D/p${PASS}.report.txt"
then echo "pass ${PASS}: returned"
else : > "$D/p${PASS}.report.txt"; echo "pass ${PASS}: failed"
fi
```

## Continuation

Continue the same subagent — send the continuation message to it by the name or id kept at
launch — rather than spawning a new one, so its context carries on. Its record is rebuilt from
every transcript the run has written, as above, before the next pass is read.
