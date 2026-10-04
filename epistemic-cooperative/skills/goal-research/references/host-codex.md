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

Generate a session id once — `cat /proc/sys/kernel/random/uuid`, or `uuidgen` — and set it on
pass `0`; every later pass resumes it. The id is set rather than read back: a `claude -p`
started from inside another Claude session was observed reporting the parent's id, which a resume
must never reach. The CLI stores sessions per working directory (under
`~/.claude/projects/<working-directory>/`, named by the session id), so a resume run from another
directory does not find the session: pass `0` records its working directory, and every later pass
runs from it. The session stays in that store after this skill finishes; removing it is the
user's call, not this skill's.

## Passes

Pass `0` sends the brief and starts the session with `--session-id`. Pass `1` is the goal turn:
`/goal` followed by the goal condition, alone, resumed into the same session as soon as pass `0`
has returned, so the goal engages with the research target already in the session's context.
Each later pass sends the continuation message. Every pass goes through the host's background
execution facility. `<tavily>` stands for the server name `claude mcp list` showed:

```bash
D=/tmp/goal_research_${SUFFIX}; P=$D/p${PASS}
[ "${PASS}" = 0 ] && pwd > "$D/cwd.txt"
cd "$(cat "$D/cwd.txt")" || exit 1
[ -f "$D/goal.txt" ] || printf '/goal %s\n' "{goal condition}" > "$D/goal.txt"
case "${PASS}" in
  0) IN=$D/brief.txt;    SESSION=--session-id ;;
  1) IN=$D/goal.txt;     SESSION=--resume ;;
  *) IN=$D/continue.txt; SESSION=--resume ;;
esac
claude -p "$SESSION" "{session_id}" --output-format stream-json --verbose \
  --allowedTools 'mcp__<tavily>' Skill \
  < "$IN" > "$P.events.jsonl" 2> "$P.warn.txt"
printf '%s\n' "$?" > "$P.status"
```

The goal turn is sent alone because the CLI's goal command reads everything after `/goal` as the
condition, within a limit the whole brief can exceed. It engages only where the CLI allows it —
among its conditions, a trusted workspace and hooks allowed — so its own record is read for
whether it did:

```bash
grep '^{' "/tmp/goal_research_${SUFFIX}/p1.events.jsonl" \
  | jq -se 'any(.[]; .type == "active_goal" and .value != null)' > /dev/null \
  && echo 'goal engaged' || echo 'goal not engaged'
```

"goal not engaged" — a refusal, or no goal event — goes to Phase 4 as such; the goal turn is
still a pass, read like any other below, and the Phase 3 loop judges the goal condition in this
session either way. Phase 3 steps 2–4 run from pass `1` on, so pass `1` is this route's first
evaluated pass: pass `0` is read for its outcome only, and a failed pass `0` ends the loop before
the goal turn is sent.

`--output-format stream-json --verbose` is what makes the run's tool calls readable: each event is
one JSON line in the Claude message record shape Phase 3 step 2 reduces, and each turn ends with a
`{type: "result", subtype, is_error, result}` event. `--allowedTools` admits the Tavily server's
tools and the Skill tool that loads `/inquire` without a permission prompt the background run
cannot answer; everything else follows the CLI's normal permission settings, and a call it denies
appears in the record as an errored result, which the reduction does not count. The status file
keeps the pass's exit code after the launching shell ends.

## Pass outcome

The pass returned when its own exit status is zero and its own terminal `result` event is a
success that is not an error, with a non-empty `result`; that `result` is the report. Anything else — a nonzero
status, an error result such as a turn limit, no terminal event — is a failed pass: surface its
status, that event, and its warn file. An authentication failure can arrive on stdout as well, so
read the events, not only stderr.

```bash
D=/tmp/goal_research_${SUFFIX}; P=$D/p${PASS}
grep '^{' "$P.events.jsonl" > "$P.json.jsonl"
if [ "$(cat "$P.status" 2>/dev/null)" = 0 ] \
  && jq -rse '[.[] | select(.type == "result")] | last | select(.subtype == "success" and .is_error == false) | .result' \
       "$P.json.jsonl" > "$P.report.txt" \
  && grep -q '[^[:space:]]' "$P.report.txt"
then echo "pass ${PASS}: returned"
else : > "$P.report.txt"; echo "pass ${PASS}: failed"
fi
```

The record is the passes' filtered events together, written by Phase 3 step 2's per-pass block;
then run its Claude message record reduction unchanged.

The first pass's `{type: "system", subtype: "init"}` event lists its `tools`. Where the Tavily
search or extract tool is absent from it, or every Tavily call in the record came back denied,
the `--allowedTools` entry or the CLI's MCP configuration did not reach the Tavily server: surface
that beside the zero-call outcome rather than reading it as a run that chose not to search.
