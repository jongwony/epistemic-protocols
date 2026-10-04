# Codex Host

Load at Phase 2 when the host driving this skill is Codex and the runner is `claude`, and again at
Phase 3 for that run's record, narrative, and continuation. The `claude` runner here is a fresh
`claude -p` process: its own context, started in the background with the brief on stdin. It is
not a resume or fork of the driving conversation.

## Precondition

Resolve `claude` on PATH and its version, and check the installed flags with `claude --help`.
The run reaches Tavily through the CLI's own MCP configuration: `claude mcp list` must show a
Tavily server as connected, and its name is what the launch allows below. Where `claude` or a
connected Tavily server is missing, surface the missing capability and stop. Keep `/inquire`
discoverable: `--bare` skips automatic skill discovery and `--disable-slash-commands` removes
skills, so neither is passed.

## Launch

Write the brief (with `{inquire}` = `/inquire`) to `/tmp/goal_research_${SUFFIX}.txt`, generate a
session id once — `cat /proc/sys/kernel/random/uuid`, or `uuidgen` — and substitute it literally
for `{session_id}` here and in every continuation. Start the run through the host's background
execution facility and wait for its completion signal. `<tavily>` stands for the server name
`claude mcp list` showed:

```bash
claude -p --session-id "{session_id}" --output-format stream-json --verbose \
  --allowedTools 'mcp__<tavily>' Skill \
  < /tmp/goal_research_${SUFFIX}.txt \
  > /tmp/goal_research_events_${SUFFIX}.jsonl 2> /tmp/goal_research_warn_${SUFFIX}.txt
printf '%s\n' "$?" > /tmp/goal_research_status_${SUFFIX}.txt
```

The session id is set rather than read back: a `claude -p` started from inside another Claude
session was observed reporting the parent's id, which a resume must never reach.

`--output-format stream-json --verbose` is what makes the run's tool calls readable: each event is
one JSON line in the Claude message record shape Phase 3 step 2 reduces, and the run ends with a
`{type: "result", subtype, is_error, result}` event. `--allowedTools` admits the Tavily server's
tools and the Skill tool that loads `/inquire` without a permission prompt the background run
cannot answer; everything else follows the CLI's normal permission settings, and a call it denies
appears in the record as an errored result, which the reduction does not count. The status file
keeps the exit code after the launching shell ends. The brief's `/goal` line engages the CLI's own
goal command in print mode.

## Record and narrative

```bash
grep '^{' /tmp/goal_research_events_${SUFFIX}.jsonl > /tmp/goal_research_json_${SUFFIX}.jsonl
jq -rs '[.[] | select(.type=="result" and .subtype=="success" and .is_error==false) | .result] | last // empty' \
  /tmp/goal_research_json_${SUFFIX}.jsonl > /tmp/goal_research_report_${SUFFIX}.txt
```

Bind `REC=/tmp/goal_research_json_${SUFFIX}.jsonl` and run Phase 3 step 2's Claude message record
reduction unchanged.

An empty report, a nonzero status, or a terminal `result` event that is not a success means the
run did not answer: surface the status, that event, and the warn file instead of proceeding blank.
An authentication failure can arrive on stdout as well, so read the events, not only stderr.

The run's first `{type: "system", subtype: "init"}` event lists its `tools`. Where the Tavily
search or extract tool is absent from it, or every Tavily call in the record came back denied,
the `--allowedTools` entry or the CLI's MCP configuration did not reach the Tavily server: surface
that beside the zero-call outcome rather than reading it as a run that chose not to search.

## Continuation

Resume the same session, appending to the same events and warn files so the record stays whole,
and record the new exit code:

```bash
claude -p --resume "{session_id}" --output-format stream-json --verbose \
  --allowedTools 'mcp__<tavily>' Skill \
  < /tmp/goal_research_continue_${SUFFIX}.txt \
  >> /tmp/goal_research_events_${SUFFIX}.jsonl 2>> /tmp/goal_research_warn_${SUFFIX}.txt
printf '%s\n' "$?" > /tmp/goal_research_status_${SUFFIX}.txt
```
