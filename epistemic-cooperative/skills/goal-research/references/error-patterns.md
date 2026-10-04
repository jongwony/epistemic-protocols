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
- **Fix:** no dotted override. Per-call MCP settings belong in `~/.codex/config.toml`. An inline
  whole-table `--config` form loads, but puts the server URL — and any credential in it — into
  the process arguments, so it is not a fix either.

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
  start. A continuation cannot repair this: the run has no Tavily tool to call.
- **Symptom:** no Tavily call in the record. A `claude -p` run's first
  `{type: "system", subtype: "init"}` event lists no tool ending in `tavily_search` or
  `tavily_extract`; the run looks for one, may try a built-in web search or fetch that is denied
  without a prompt in the background, and reports from recall. On codex, the pass's stderr shows
  the MCP server failing to start, its transport, or its auth.
- **Fix:** treat it as a harness failure — report it, with the evidence above, and send no
  continuation.

## `claude -p`: an empty session id

- **Failure:** generating the session id through a pipeline whose last stage succeeds when the
  generator is missing — `uuidgen | tr … > file` without `uuidgen` installed.
- **Symptom:** the id file is empty, so `--session-id` and `--resume` get no id.
- **Fix:** read `/proc/sys/kernel/random/uuid` where it exists, lowercase it, and write the file
  only when the id is non-empty.

## `claude -p`: a goal turn that ends empty

- **Failure:** a `/goal` condition the session cannot meet as its evaluator reads it — a condition
  readable as requiring more than the brief asks, or one the run has no tool to meet.
- **Symptom:** the goal turn runs many turns, its `{type: "active_goal"}` events carry rising
  `iterations` and a `last_reason`, and the turn's final `result` is empty.
- **Fix:** the pass failed (empty report), and the current report stays the last whole one. Read
  `last_reason` for what the evaluator held unmet; where Tavily is missing, the pattern above
  applies.
