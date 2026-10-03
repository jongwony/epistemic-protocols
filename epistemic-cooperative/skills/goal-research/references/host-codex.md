# Codex Host

Load at Phase 2 when the host driving this skill is Codex and the runner is `claude`, and again at
Phase 3 steps 1 and 2. The `claude` runner here is a fresh `claude -p` process: its own context,
started in the background with the brief on stdin. It is not a resume or fork of the driving
conversation.

## Precondition

Resolve `claude` on PATH and its version, and check the installed flags with `claude --help`.
The run reaches Tavily through the CLI's own MCP configuration: `claude mcp list` must show a
Tavily server as connected, and its name is what the launch allows below. Where `claude` or a
connected Tavily server is missing, surface the missing capability and stop. Keep `/inquire`
discoverable: `--bare` skips automatic skill discovery and `--disable-slash-commands` removes
skills, so neither is passed.

## Launch

Write the brief (with `{inquire}` = `/inquire`) to `/tmp/goal_research_${SUFFIX}.txt`, then
start the run through the host's background execution facility and wait for its completion
signal. `<tavily>` stands for the server name `claude mcp list` showed:

```bash
claude -p --output-format stream-json --verbose --allowedTools 'mcp__<tavily>' Skill \
  < /tmp/goal_research_${SUFFIX}.txt \
  > /tmp/goal_research_events_${SUFFIX}.jsonl 2> /tmp/goal_research_warn_${SUFFIX}.txt
printf '%s\n' "$?" > /tmp/goal_research_status_${SUFFIX}.txt
```

`--output-format stream-json --verbose` is what makes the run's tool calls readable: each event
is one JSON line, assistant events carry `message.content[]` items
`{type: "tool_use", id, name, input}`, user events carry
`{type: "tool_result", tool_use_id, is_error, content}`, and the run ends with a
`{type: "result", subtype, is_error, result}` event. `--allowedTools` admits the Tavily server's
tools and the Skill tool that loads `/inquire` without a permission prompt the background run
cannot answer; everything else follows the CLI's normal permission settings, and a call it
denies appears in the record as an error, which the checks do not count. The status file keeps
the exit code after the launching shell ends.

## Narrative

```bash
grep '^{' /tmp/goal_research_events_${SUFFIX}.jsonl > /tmp/goal_research_json_${SUFFIX}.jsonl
jq -rs '[.[] | select(.type=="result" and .subtype=="success" and .is_error==false) | .result] | last // empty' \
  /tmp/goal_research_json_${SUFFIX}.jsonl > /tmp/goal_research_report_${SUFFIX}.txt
```

An empty report, a nonzero status, or a terminal `result` event that is not a success means the
run did not answer: surface the status, that event, and the warn file instead of proceeding blank.
An authentication failure can arrive on stdout as well, so read the events, not only stderr.

## Reduction

Pair each `tool_result` with its `tool_use` by id. A successful Tavily call is a pair whose tool
name names Tavily and search or extract, and whose result has `is_error` other than `true`; a
`tool_use` with no result did not complete. Source records are read as Phase 3 step 2 says —
JSON `results[].url` where a JSON response is present, otherwise `URL: ` result lines, with the
same limit for a page-body line that begins `URL: `:

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
' /tmp/goal_research_json_${SUFFIX}.jsonl > /tmp/goal_research_calls_${SUFFIX}.jsonl
```

Then run Phase 3 step 3's checks unchanged.

The run's first `{type: "system", subtype: "init"}` event lists its `tools`. Where the Tavily
search or extract tool is absent from it, or every Tavily call in the record came back denied,
the `--allowedTools` entry or the CLI's MCP configuration did not reach the Tavily server: surface
that beside the zero-call result rather than reading it as a run that chose not to search.
