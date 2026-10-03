# Claude Code Record

Load at Phase 3 step 2 when the runner is `claude` and the host is Claude Code. It names where
the subagent's own tool-call record is and reduces it to the calls file the checks read.

## Where the record is

A background subagent's output file, as the host reports it on launch or completion, resolves to
the subagent's transcript: a JSONL file under `~/.claude/projects/<project>/`, in a
`subagents/agent-<id>.jsonl` path (one observed form nests it under the parent session's
directory). Resolve the reported path, following a symlink, rather than constructing it. Where the
host reported no path and none resolves, the record is not readable and Phase 3's not-run branch
applies.

In that transcript, assistant entries carry `message.content[]` items
`{type: "tool_use", id, name, input}`, and user entries carry `message.content[]` items
`{type: "tool_result", tool_use_id, is_error, content}`. A Tavily MCP result's `content` is a
list of `{type: "text", text}` items whose text is the Tavily response as JSON, or a string.

## Reduction

Pair each `tool_result` with its `tool_use` by id. A successful Tavily call is a pair whose tool
name names Tavily and search or extract, and whose result has `is_error` other than `true`; a
`tool_use` with no result did not complete. Set `T` to the resolved transcript path:

```bash
jq -cs '
  ([.[] | select(.type=="assistant") | .message.content[]? | select(.type=="tool_use") | {key: .id, value: .name}] | from_entries) as $names
  | .[] | select(.type=="user") | .message.content[]? | select(.type=="tool_result")
  | ($names[.tool_use_id] // "") as $tool
  | select(($tool | test("tavily"; "i")) and ($tool | test("search|extract"; "i")) and .is_error != true)
  | {tool: $tool,
     records: [.content | if type=="string" then . else (.[]? | select(.type=="text") | .text) end | try fromjson catch empty | objects]}
' "$T" > /tmp/goal_research_calls_${SUFFIX}.jsonl
```

Write the subagent's final message to `/tmp/goal_research_report_${SUFFIX}.txt`, then run
Phase 3 step 3's checks unchanged.
