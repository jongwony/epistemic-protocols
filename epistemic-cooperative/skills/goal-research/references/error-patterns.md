# Error Patterns

Failures seen when driving a research run, each with its symptom and fix. Read before launching
a run or reading its output.

## Codex: a dotted `mcp_servers` override

- **Failure:** passing `--config mcp_servers.<name>.<key>=<value>` on the `codex exec` command
  line. A dotted override replaces that server's whole table instead of merging into it, so its
  transport field (`url` or `command`) is dropped — for every server and every key, including
  keys the config file already sets.
- **Symptom:** codex exits 1 at config load with `Error loading config.toml: invalid transport in
  mcp_servers.<name>`, before any research; the events come back empty.
- **Fix:** no dotted override. Per-call MCP settings belong in `~/.codex/config.toml`. Do not pass
  the server table inline either: it puts the server URL and its credentials in the process
  arguments.

## Codex: stdout is not pure JSONL

- **Failure:** reading `codex exec --json` stdout with `jq -s` directly. Codex can print a plain
  notice line there (e.g. `Codex autostart is disabled.`) beside the JSON events, even with
  `--color never` and stderr sent elsewhere.
- **Symptom:** `jq -s` aborts on the first plain line and prints nothing, so a successful pass
  reads as an empty report or an empty tool record.
- **Fix:** filter to JSON lines first — `grep '^{' events | jq -s …`. The filter is load-bearing,
  not tidiness.

## Tavily not available to the run

- **Failure:** the runner's CLI has no Tavily server configured, or its Tavily server failed to
  start or lost its connection.
- **Symptom:** positive evidence only — the runner's stderr or warn output shows the MCP server
  failing to start, its transport, or its auth; or the run itself reports, after trying, that it
  has no Tavily tool. A tool missing from a `claude -p` run's first `{type: "system", subtype:
  "init"}` event does not establish it: a server can still be connecting, and a tool's name can
  use `tavily-search` as well as `tavily_search`. Without such evidence, no successful Tavily call
  in the run is a failure the run can repair.
- **Fix:** a failure of the run: send it back once, naming that evidence — resuming the session
  can restart its MCP connection; where it recurs, report it with that evidence.

## `claude -p`: an empty session id

- **Failure:** generating the session id through a pipeline whose last stage succeeds when the
  generator is missing — `uuidgen | tr … > file` without `uuidgen` installed.
- **Symptom:** the id file is empty, so `--session-id` and `--resume` get no id.
- **Fix:** read `/proc/sys/kernel/random/uuid` where it exists, else run `uuidgen`; lowercase the
  id, and write the file only when it is non-empty.

## `claude -p`: a goal turn that ends empty

- **Failure:** a `/goal` condition the session cannot meet as its evaluator reads it — a condition
  readable as requiring more than the brief asks, or one the run has no tool to meet.
- **Symptom:** the goal turn runs many turns, its `{type: "active_goal"}` events carry rising
  `iterations` and a `last_reason`, and the turn's final `result` is empty.
- **Fix:** the current report stays the last whole one, and the next continuation names the current
  gaps and asks for the whole report. Read `last_reason` for what the evaluator held unmet; where Tavily is
  shown unavailable, the pattern above applies.

## A background command stopped at the host's default time limit

- **Failure:** running a pass as a background command without a time bound of its own, so the
  host's default limit (e.g. 30 minutes) stops it before the research finishes.
- **Symptom:** the pass ends early, with a truncated event stream or transcript and a missing or
  partial report.
- **Fix:** launch each pass with a time bound sized to the research — 75 minutes for a deep question.

## Codex: `--ephemeral` leaves nothing to resume

- **Failure:** launching with `codex exec --ephemeral`, which persists no session.
- **Symptom:** the `/goal` turn and every continuation fail to resume the run.
- **Fix:** launch without `--ephemeral`, take the thread id from the launch's `thread.started`
  event, and resume with `codex exec resume <id>` from the same working directory.
