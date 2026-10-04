# Codex Host

Load at Phase 2 whenever the host driving this skill is Codex, whichever runner is designated: it
carries the background binding for either runner, and, for the `claude` runner, its launch, pass
outcome, record, and continuation. The `claude` runner here is a fresh
`claude -p` process: its own context, started in the background with input on stdin. It is not a
resume or fork of the driving conversation. `${SUFFIX}`, `${PASS}`, `{session_id}`, and every
other generated value are substituted literally into each block.

## Running a pass

Each pass of either runner — a `codex exec` pass, or a `claude -p` pass — has the 75-minute
envelope. Run it through the host's background execution facility where the host has one, and
wait for its completion; otherwise run it as a foreground call bounded by the host's own command
timeout set to 75 minutes (the Codex shell tool's `timeout_ms`, 4500000). The Rules'
delegated-session timeout then applies on this host.

## Precondition (`claude` runner)

Resolve `claude` on PATH and its version, and check the installed flags with `claude --help`.
The run reaches Tavily through the CLI's own MCP configuration: `claude mcp list` must show a
Tavily server as connected, and its name is what the launch allows below. Where `claude` or a
connected Tavily server is missing, surface the missing capability and stop. The run also needs
the `/inquire` skill: `claude plugin list` must show the `aitesis` plugin installed and enabled
for this CLI; where it does not, surface the missing capability and stop. Keep `/inquire`
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
Each later pass sends the continuation message. Each pass runs this route's `run` with Phase 2's
scaffold, in one command call, as "Running a pass" says:

```bash
run() {
  if [ "${PASS}" = 0 ]; then S=--session-id; else S=--resume; fi
  claude -p "$S" "{session_id}" --output-format stream-json --verbose \
    --allowedTools 'mcp__<tavily>' Skill
}
```

`mcp__<tavily>` allows every tool of the server named as `claude mcp list` shows it. A server that
a plugin or a claude.ai connector provides carries another prefix in its tool names
(`mcp__plugin_<plugin>_<server>__…`, `mcp__claude_ai_<Name>__…`) that this listing does not show,
and that form was not observed on this CLI here, so the rule cannot be derived reliably before the
run starts. Pass `0`'s record settles it instead: its first `{type: "system", subtype: "init"}`
event lists the tools the run can call, and the check below runs after pass `0`'s Phase 3 step 2,
which writes the `tavily.jq` it includes; where it stops, its reason stands in place of the step 2
gate's, the more specific of the two. Where no Tavily
search or extract tool is listed, or the pass called Tavily and every call came back denied, the
run stops there as an infrastructure stop — "Tavily not reachable from the run" — never as a
silent zero:

```bash
D=/tmp/goal_research_${SUFFIX}
jq -L "$D" -rs 'include "tavily";
  def tavily_name: split("__") as $p | ($p | length) >= 3 and $p[0] == "mcp" and is_tavily($p[1:-1] | join("__"); $p | last);
  ([.[] | select(.type == "system" and .subtype == "init") | .tools[]? | select(tavily_name)] | length) as $listed
  | ([.[] | select(.type == "assistant") | .message.content[]? | select(.type == "tool_use" and (.name | tavily_name)) | .id]) as $calls
  | ([.[] | select(.type == "user") | .message.content[]? | select(.type == "tool_result" and .is_error != true and (.tool_use_id | IN($calls[])))] | length) as $ok
  | if $listed == 0 then "stop: Tavily not reachable from the run"
    elif ($calls | length) > 0 and $ok == 0 then "stop: Tavily not reachable from the run"
    else "proceed" end' "$D/p0.json.jsonl"
```

The goal turn is sent alone because the CLI's goal command reads everything after `/goal` as the
condition, within a limit the whole brief can exceed. It engages only where the CLI allows it —
among its conditions, a trusted workspace and hooks allowed — so its own record is read for
whether it did:

```bash
grep '^{' "/tmp/goal_research_${SUFFIX}/p1.events.jsonl" \
  | jq -se 'any(.[]; .type == "active_goal" and .value != null)' > /dev/null \
  && echo 'goal engaged' || echo 'goal not confirmed on this route'
```

Only that positive event shows the goal engaged. Its absence shows nothing: print mode may consume
the goal change without emitting it. So Phase 4 says "not confirmed on this route", never "not
engaged"; the goal turn is still a pass, read like any other below, and the Phase 3 loop judges the goal condition in this
session either way. Phase 3 steps 3–4 run from pass `1` on, so pass `1` is this route's first
evaluated pass; pass `0` is read through steps 1–2 and the check above, so a failed pass `0` or an
infrastructure stop ends the loop before the goal turn is sent.

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


