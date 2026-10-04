# Codex Host

Load at Phase 2 whenever the host driving this skill is Codex, whichever runner is designated: it
says how a pass runs here and, for the `claude` runner, its launch, record, and continuation. The
`claude` runner here is a fresh `claude -p` process: its own context, started in the background
with input on stdin. It is not a resume or fork of the driving conversation. `${SUFFIX}`,
`${PASS}`, and every other generated value are substituted literally into each block.

## Running a pass

Run each pass of either runner — a `codex exec` pass, or a `claude -p` pass — as one command call
through the host's background execution facility where it has one, and wait for it to end.

## `claude` runner

Resolve `claude` on PATH; where it is not found, report it and stop. Keep `/inquire`
discoverable: `--bare` skips automatic skill discovery and `--disable-slash-commands` removes
skills, so neither is passed.

### Session

Generate a session id once, before pass `0`:

```bash
cat /proc/sys/kernel/random/uuid > "/tmp/goal_research_${SUFFIX}/session.txt"
```

(`uuidgen` where `/proc` has no such file.) Pass `0` sets it and every later pass resumes it. The
id is set rather than read back: a `claude -p` started from inside another Claude session can
report the parent's id, which a resume must never reach. The CLI stores sessions per working
directory (under `~/.claude/projects/<working-directory>/`, named by the session id), so a resume
run from another directory does not find the session; the scaffold runs every pass from pass
`0`'s directory. The session stays in that store after this skill finishes; removing it is the
user's call, not this skill's.

### Passes

Pass `0` sends the brief and starts the session with `--session-id`. Pass `1` is the goal turn:
`/goal` followed by the goal condition, alone, resumed into the same session as soon as pass `0`
has ended, so the goal engages with the research target already in the session's context. Each
later pass sends the continuation message. Each pass runs this route's `run` with Phase 2's
scaffold:

```bash
run() {
  if [ "${PASS}" = 0 ]; then S=--session-id; else S=--resume; fi
  claude -p "$S" "$(cat "$D/session.txt")" --output-format stream-json --verbose \
    --allowedTools 'mcp__tavily' Skill
}
```

`mcp__tavily` admits every tool of the MCP server named `tavily`; where the Tavily server is
configured under another name, put that name in its place. `Skill` admits the tool that loads
`/inquire`. A background run cannot answer a permission prompt, so a Tavily call it is still
denied comes back as an errored result: it is not counted, and step 4 names it to the run in the
next continuation. Where pass `0` exits with no events at all, it started no session to resume:
report its exit code and warn file raw, and stop.

`--output-format stream-json --verbose` is what makes the run's tool calls readable: each event is
one JSON line in the Claude message record shape Phase 3 step 2 reduces, and each turn ends with a
`{type: "result", subtype, is_error, result}` event — its `result` is the pass's report, and an
`is_error` or a `subtype` other than `success` is a failed pass. The record is the passes' events
together, written by Phase 3 step 2's per-pass block; then run its Claude message record
reduction unchanged.

The goal turn is sent alone because the CLI's goal command reads everything after `/goal` as the
condition, within a limit the whole brief can exceed. It engages only where the CLI allows it —
among its conditions, a trusted workspace and hooks allowed. Only an `{type: "active_goal"}` event
with a non-null `value` in the goal turn's events shows it engaged; its absence shows nothing,
since print mode may consume the goal change without emitting it. So Phase 4 says "engaged" on
that event and "not confirmed on this route" otherwise, never "not engaged". The goal turn is
still a pass, and this route's first evaluated pass.
