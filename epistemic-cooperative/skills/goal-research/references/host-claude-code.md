# Claude Code Record

Load when the host driving this skill is Claude Code: at Phase 2 for the `codex` runner's launch,
and at Phase 3 step 2 for the `claude` runner's record — where the subagent's own tool-call record
is, and its reduction to the calls file the checks read.

## Codex runner launch

Run the `codex exec` command through the Bash tool in the background,
`Bash(run_in_background: true, timeout: 4500000)` — 4,500,000 ms is the 75-minute envelope — and
wait for its completion notification.

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
string or a list of `{type: "text", text}` items. The text is the Tavily response either as JSON
or in the formatted text the Tavily MCP server prints; Phase 3 step 2 says how source records are
read from each, and the reduction below applies it unchanged. Its limit applies here too: a line
inside a returned page's text that begins `URL: ` is read as a result line.

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
  | [.content | if type=="string" then . else (.[]? | select(.type=="text") | .text) end] as $texts
  | ([$texts[] | try fromjson catch empty] | map(objects)) as $json
  | {tool: $tool,
     records: (if ($json | length) > 0 then $json
               else [$texts[] | split("\n")[]] as $lines
                    | if ($lines | any(. == "Detailed Results:" or startswith("URL: ")))
                      then [{results: [$lines[] | select(startswith("URL: ")) | {url: (.[5:] | sub("\\s+$"; ""))}]}]
                      else [] end end)}
' "$T" > /tmp/goal_research_calls_${SUFFIX}.jsonl
```

Write the subagent's final message to `/tmp/goal_research_report_${SUFFIX}.txt`, then run
Phase 3 step 3's checks unchanged.
