# Codex Host

Load at Phase 2 when the host driving this skill is Codex and the runner is `claude`, and again at
Phase 3 for that run's pass outcome, record, and continuation. The `claude` runner here is a fresh
`claude -p` process: its own context, started in the background with input on stdin. It is not a
resume or fork of the driving conversation. `${SUFFIX}`, `${PASS}`, `{session_id}`, and every
other generated value are substituted literally into each block.

## Precondition

Resolve `claude` on PATH and its version, and check the installed flags with `claude --help`.
The run reaches Tavily through the CLI's own MCP configuration: `claude mcp list` must show a
Tavily server as connected, and its name is what the launch allows below. Where `claude` or a
connected Tavily server is missing, surface the missing capability and stop. Keep `/inquire`
discoverable: `--bare` skips automatic skill discovery and `--disable-slash-commands` removes
skills, so neither is passed.

## Session

Generate a session id once — `cat /proc/sys/kernel/random/uuid`, or `uuidgen` — and set it on the
first turn; every later turn resumes it. The id is set rather than read back: a `claude -p`
started from inside another Claude session was observed reporting the parent's id, which a resume
must never reach. The session stays in the CLI's own session store (under
`~/.claude/projects/<working-directory>/`, named by the session id) after this skill finishes;
removing it is the user's call, not this skill's.

## Goal turn

The goal is set in a turn of its own, before the brief, because the CLI's goal command reads
everything after `/goal` as the condition, within a limit the whole brief can exceed. The command
engages only where the CLI allows it — among its conditions, a trusted workspace and hooks
allowed — so the turn's own record is read for whether it did:

```bash
D=/tmp/goal_research_${SUFFIX}
printf '/goal %s\n' "{goal condition}" \
  | claude -p --session-id "{session_id}" --output-format stream-json --verbose \
      > "$D/goal.events.jsonl" 2> "$D/goal.warn.txt"
printf '%s\n' "$?" > "$D/goal.status"
grep '^{' "$D/goal.events.jsonl" | jq -se 'any(.[]; .type == "active_goal" and .value != null)' > /dev/null \
  && echo 'goal engaged' || echo 'goal not engaged'
```

"goal not engaged" — a refusal, an error, or no goal event — goes to Phase 4 as such, and the run
proceeds to the brief; the Phase 3 loop judges the goal condition in this session either way.

## Passes

Pass `0` sends the brief, and each continuation sends the continuation message, as a turn of the
same session, through the host's background execution facility. `<tavily>` stands for the server
name `claude mcp list` showed:

```bash
D=/tmp/goal_research_${SUFFIX}; P=$D/p${PASS}
IN=$D/brief.txt; [ "${PASS}" = 0 ] || IN=$D/continue.txt
claude -p --resume "{session_id}" --output-format stream-json --verbose \
  --allowedTools 'mcp__<tavily>' Skill \
  < "$IN" > "$P.events.jsonl" 2> "$P.warn.txt"
printf '%s\n' "$?" > "$P.status"
```

`--output-format stream-json --verbose` is what makes the run's tool calls readable: each event is
one JSON line in the Claude message record shape Phase 3 step 2 reduces, and each turn ends with a
`{type: "result", subtype, is_error, result}` event. `--allowedTools` admits the Tavily server's
tools and the Skill tool that loads `/inquire` without a permission prompt the background run
cannot answer; everything else follows the CLI's normal permission settings, and a call it denies
appears in the record as an errored result, which the reduction does not count. The status file
keeps the pass's exit code after the launching shell ends.

## Pass outcome

The pass returned when its own exit status is zero and its own terminal `result` event is a
success that is not an error; that event's `result` is the report. Anything else — a nonzero
status, an error result such as a turn limit, no terminal event — is a failed pass: surface its
status, that event, and its warn file. An authentication failure can arrive on stdout as well, so
read the events, not only stderr.

```bash
D=/tmp/goal_research_${SUFFIX}; P=$D/p${PASS}
grep '^{' "$P.events.jsonl" > "$P.json.jsonl"
if [ "$(cat "$P.status" 2>/dev/null)" = 0 ] \
  && jq -rse '[.[] | select(.type == "result")] | last | select(.subtype == "success" and .is_error == false) | .result' \
       "$P.json.jsonl" > "$D/report.txt" \
  && [ -s "$D/report.txt" ]
then echo "pass ${PASS}: returned"
else : > "$D/report.txt"; echo "pass ${PASS}: failed"
fi
```

The record is the passes' filtered events together, written by Phase 3 step 2's per-pass block;
then run its Claude message record reduction unchanged.

The first pass's `{type: "system", subtype: "init"}` event lists its `tools`. Where the Tavily
search or extract tool is absent from it, or every Tavily call in the record came back denied,
the `--allowedTools` entry or the CLI's MCP configuration did not reach the Tavily server: surface
that beside the zero-call outcome rather than reading it as a run that chose not to search.
