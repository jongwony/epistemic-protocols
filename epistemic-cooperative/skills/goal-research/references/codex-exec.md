# Codex Invocation

One realization of the Phase 2 handoff on codex. It is platform realization, not contract: the
contract stays in `SKILL.md`, and the flags below follow the installed CLI — check them against
`codex exec --help` and `codex exec resume --help`.

## Launch

Pick the model and `model_reasoning_effort` for the question's depth, write the brief to a file in
a run directory of this session's own, and launch from the working directory every later pass will
use. Each pass writes its own events file; keep every one, so the record spans all passes:

```bash
codex exec --json --color never --skip-git-repo-check \
  -m "$model" -c "model_reasoning_effort=\"$effort\"" - \
  < "$run_dir/brief.txt" > "$run_dir/p0.events.jsonl" 2> "$run_dir/p0.stderr.txt"
```

The session persists by default, which is what lets the goal turn and every continuation resume
it. Take its id from the launch's `thread.started` event:

```bash
grep '^{' "$run_dir/p0.events.jsonl" | jq -r 'select(.type == "thread.started") | .thread_id // empty' | head -n 1
```

## Continue

The goal turn and every continuation resume that session, from the same working directory — the
session is found there — each into its own events file:

```bash
codex exec resume "$thread_id" - --json --skip-git-repo-check \
  -m "$model" -c "model_reasoning_effort=\"$effort\"" \
  < "$run_dir/message.txt" > "$run_dir/p$pass.events.jsonl" 2> "$run_dir/p$pass.stderr.txt"
```

Run each pass through the host's background facility with a time bound sized to the research —
75 minutes for a deep question. A host's default limit (30 minutes, for one) can stop a pass
mid-run, leaving a truncated events file and no final report.

## Read

Stdout carries JSON events, but codex can print a plain notice line there as well (`Codex
autostart is disabled.`), and `jq` stops at the first line it cannot parse — a successful pass then
reads as empty. Filter to JSON lines before `jq`. A pass's report is its last agent message; the
run's Tavily calls come from every pass's file:

```bash
grep '^{' "$run_dir/p$pass.events.jsonl" \
  | jq -rs '[.[] | select(.type == "item.completed" and .item.type == "agent_message") | .item.text] | last // empty'
grep -h '^{' "$run_dir"/p*.events.jsonl \
  | jq -c 'select(.type == "item.completed" and .item.type == "mcp_tool_call")'
```

## Tavily

The run reaches Tavily through the server configured in `~/.codex/config.toml`; per-call settings
belong there too. A dotted override of one key under `mcp_servers` on the command line replaces
that server's whole table and drops its transport, and codex then stops at config load with
`invalid transport in mcp_servers.<name>`. The whole table cannot go on the command line either: it
would put the server URL and its credentials in the process arguments.
