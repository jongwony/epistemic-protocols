---
name: goal-research
description: Delegate factual research to a background Claude or Codex run using Aitesis and Tavily; read its citations against its Tavily record, continuing it while gaps shrink. User-invoked via /goal-research.
---

# Goal Research

Invoke directly with `/goal-research [runner] <research question>` when the user wants to delegate fact-finding or external verification to a background research run that drives Aitesis with Tavily search and extract, and wants the run's citations read against what its own Tavily calls returned.

**Architecture**:
```
goal-research
├── Runner designation + research question (argument or one-time prompt)
├── Research run (background, its own context), in passes, toward one goal condition (`/goal` where the route takes it)
│   ├── claude (default): a Claude run (subagent, or `claude -p` on a Codex host) — `/inquire` drives Tavily search + extract
│   └── codex: Codex CLI — builtin `goal`, `$inquire` drives Tavily
├── After each pass
│   ├── mechanical: the whole run's tool record — successful Tavily calls, the URLs their JSON results list, the calls not mechanically readable
│   ├── reading: this session reads what the pass delivered, and its report against those lists and the raw record, each judgment marked as its reading
│   └── goal: met → present; gaps — research gaps and failures alike — fewer than before → continue the same run with them; otherwise → present
└── Presentation: source check, open items handed to the user as theirs to settle, verbatim trace
    (+ temp-directory cleanup)
```

**Why this composition**: `/inquire` carries the epistemic contract — its reading of each uncertainty, its record of what collection reached, and what stays open for the person to settle. goal-research refines that contract for the research domain and for a background run; it adds no second reading beside it. Running the research in its own context isolates it from the main conversation while still surfacing the full trace back. A research run can complete, answer fluently, and cite sources it never opened, and nothing in the narrative distinguishes that from a searched answer. Whether a URL in report prose names the same source as a URL in a tool result is not mechanically decidable, so the work splits: the machine reads only the run's tool record, and only what is unambiguous there; this session reads the report against it and judges, marking each judgment as its reading. The run's own account of what it opened is part of the report under that reading, never the record. Nothing about the run is checked before it starts beyond what launching it needs: what goes wrong inside it is named back to the same run, which can recover, and is reported where it does not.

## Caller Signature

```
/goal-research [runner?] <research question>

runner : claude | codex        (claude when none is designated)
```

Read the runner designation from the request's words as well as its arguments. A leading `claude` or `codex` designates the runner only when it stands as a separate leading argument and what follows reads as the whole question; wording outside the research question designates as well. Where the leading word could instead open the question — `Claude Shannon's 1948 paper…`, `codex CLI sandbox defaults` — ask once which it is. Nothing is removed from inside the question. With no designation, the runner is `claude`.

| Runner | Route | To launch |
|---|---|---|
| `claude` | A background Claude run with its own context, running `/inquire` with Tavily search and extract | The host can start such a run |
| `codex` | A background `codex exec` session running `$inquire` with Tavily | `codex` on PATH |

Record the runner actually used. A runner that cannot be launched is reported with what is missing, and the skill stops there.

## Phase 1: Argument Capture

1. If `/goal-research` is invoked with an argument, the research question is that argument after a leading runner designation, read as the Caller Signature says, carried verbatim — nothing is removed from inside it.
2. If invoked without a research question, ask the user once for it, then proceed.

The research question is passed unchanged into the research brief — paraphrasing is prohibited.

## Phase 2: Launch (Background)

Create this run's temp directory, exclusive to it and private, and take its suffix: `D=$(mktemp -d /tmp/goal_research_XXXXXXXX)`, `SUFFIX=${D#/tmp/goal_research_}`. Every file this skill writes lives there. The run proceeds in **passes**: the launch is pass `0`, and each later turn of the same run — a goal turn where the route sends one (codex, `claude -p`), then each continuation in Phase 3 — is the next pass. Shell state does not persist between separate command calls, so substitute `${SUFFIX}` and the current `${PASS}` literally into each later block.

Run each pass through the host's background facility with a 75-minute bound where the host offers one. Read the driving host's reference now, whichever runner is designated — [Claude Code](references/host-claude-code.md) or [Codex](references/host-codex.md); another host supplies the same bindings itself. It says how a pass is started on that host and, for the `claude` runner, the launch, where the run's record is, and how the same run is continued.

Both CLI routes — the `codex` runner, and `claude -p` on a Codex host — run every pass through one scaffold: it records pass `0`'s working directory and runs every later pass from it, routes the pass's input (the brief at pass `0`, the goal turn at pass `1`, the continuation message after), and keeps the CLI's exit code. The route supplies `run`, the command for the current pass, defined in the same command call just before the scaffold:

```bash
D=/tmp/goal_research_${SUFFIX}; P=$D/p${PASS}
[ "${PASS}" = 0 ] && pwd > "$D/cwd.txt"
cd "$(cat "$D/cwd.txt")" || { echo 1 > "$P.status"; exit 1; }
case "${PASS}" in
  0) IN=$D/brief.txt ;;
  1) IN=$D/goal.txt ;;
  *) IN=$D/continue.txt ;;
esac
run < "$IN" > "$P.events.jsonl" 2> "$P.warn.txt"
printf '%s\n' "$?" > "$P.status"
```

### Research brief

**Goal condition**, the same sentence on every route, and the one this session judges each pass against in Phase 3:

> Every uncertainty this session's research target turns on is either filled by a citation to a source this session's Tavily calls returned, or returned open with its reach — the person's marked as theirs.

Every runner receives this brief, written to `/tmp/goal_research_${SUFFIX}/brief.txt`, with `{inquire}` set to `/inquire` for `claude` and `$inquire` for `codex`, and `{goal condition}` set to the sentence above. The brief states the condition under a label no goal command reads as its own. The goal command, where a route uses it, is sent apart from the brief and after it — a CLI's goal command reads everything after `/goal` as its objective, within a length limit the whole brief can exceed — as the runner's section or the host's reference says. Its turn is written once, here, beside the brief:

```bash
printf '/goal %s\n' "{goal condition}" > /tmp/goal_research_${SUFFIX}/goal.txt
```

The brief:

```
Research goal condition: {goal condition}

This session is the research session the goal-research skill has already delegated to — goal-research is already running here, so do not invoke it again in this session.

Research target:
{research_question}

Workflow:
1. Run {inquire} (the Aitesis skill) on the research target, collecting external evidence through Tavily search and Tavily extract. Its reading of each uncertainty, its reach record, and what it leaves open are the report's substance; the lines below refine them for research and add no second reading.
2. Open the page of each primary source a filled claim rests on with Tavily extract; a search-result snippet alone fills a claim only as "mostly".
3. No person answers in this session. An uncertainty {inquire} reads as the person's to settle — a value, preference, or scope only they hold, or an unknown that is their own — is neither answered nor settled here: it returns open, with its reach and what would settle it. Fill no held value yourself; a candidate you see is shown as yours, beside what decides it.
4. Cite each external source by its URL.

Report {inquire}'s record as it stands at completion, refined as follows:
- An uncertainty filled by an external citation carries its source URL(s) and how far the citation reaches:
  - verified: the source's page was opened with Tavily extract in this session and states the claim
  - mostly: the source was seen only as a search-result snippet, or its page checked the core claim while surrounding detail is synthesized
- A detail from recall (a volume, issue, page range, date, or number that no source in this session gave) is not a citation. Mark it reconstructed, as your own inference, and leave its item open, needing a spot-check.
- The weakest link: the claim or detail the conclusions lean on that stands weakest, named explicitly.
- An absence or novelty claim ("no study has…", "untested", "novel", "first to…") reaches only as far as {inquire}'s reach record for it; carry that record beside the claim.
- For each empirical effect cited: its replication status and any retraction, where checkable in this session, otherwise "not checked". An effect that failed replication is reported as a design warning, not a quantitative law.
- Open: every item still open — the person's to settle, reconstructed, or short of ground — each with its reach, the person's marked as theirs.
```

### Runner: claude

The host is the environment driving this skill, not another user choice; `claude` stays the default on every host. The host's reference, read above, carries this runner's launch, where the run's record is, and how the same run is continued:

| Host | `claude` runner | Reference |
|---|---|---|
| Claude Code | A background subagent | [Claude Code](references/host-claude-code.md) |
| Codex | A background `claude -p` process | [Codex](references/host-codex.md) |

Other hosts may supply the same capability: a background Claude run with its own context, whose tool calls are recorded where this session can read them, and which this session can continue. The run receives the brief as its whole task, not this conversation's history.

### Runner: codex

Check `which codex 2>/dev/null`. If Codex CLI is not found, report the missing binary and stop.

Every pass runs the route's `run` with the scaffold above. Pass `0` launches the session with the brief; pass `1` is the goal turn — `/goal` followed by the goal condition, alone — sent as soon as pass `0` has ended, so the goal engages with the research target already in the session's context; each pass after it sends the continuation message from Phase 3. Every later pass resumes the same session by the thread id in pass `0`'s `thread.started` event, from the working directory pass `0` recorded. `--color never` + splitting the
streams (stdout to the pass's events file, `2>` to its warn file) keeps stderr
warnings out of the events file. Stdout is **not** guaranteed to be pure JSONL —
codex may still print a plain notice line there (e.g. `Codex autostart is
disabled.`), so every extraction below filters to lines starting with `{` before
parsing. That `grep '^{'` is load-bearing, not defensive tidiness: `jq` aborts on
the first plain line, and without the filter a successful pass reads as empty. Select `{effort}` per run by the research question's depth and breadth, floored at `high` (never below) — a narrow, single-fact question runs at `high`, a multi-branch or deep-synthesis question at `xhigh`, and the most demanding research may escalate to `max` (the top of this model's ladder — it consumes usage limits faster, so reserve it for genuinely heavy questions):

```bash
run() {
  if [ "${PASS}" = 0 ]; then
    codex exec --json --color never --skip-git-repo-check -m gpt-6-astra \
      --config model_reasoning_effort="{effort}"
  else
    codex exec resume "$(cat "$D/thread.txt")" - --json --skip-git-repo-check -m gpt-6-astra \
      --config model_reasoning_effort="{effort}"
  fi
}
```

Once pass `0` has ended, take its thread id by a command:

```bash
D=/tmp/goal_research_${SUFFIX}
grep '^{' "$D/p0.events.jsonl" | jq -r 'select(.type == "thread.started") | .thread_id // empty' | head -n 1 > "$D/thread.txt"
grep -q '[^[:space:]]' "$D/thread.txt" && echo "thread $(cat "$D/thread.txt")" || echo 'launch did not start a session'
```

Where the launch did not start a session, there is nothing to continue: report its exit code, events, and warn file raw, and stop.

`codex exec resume` takes no `--color` option; its stdout is filtered by `grep '^{'` like the launch's. Codex's JSON events carry no event saying whether the goal engaged, so Phase 4 shows the goal as not confirmed on this route.

The launch persists its session so later passes can continue the same one; `--ephemeral` would leave nothing to resume. The session therefore stays in Codex's own session store (under `~/.codex/sessions/`, named by its thread id) after this skill finishes; removing it is the user's call, not this skill's.

Sandbox flag is omitted intentionally — Tavily verification requires network access, so the read-only sandbox used by `review-loop`'s codex source does not apply here.

**Do NOT add a dotted `--config mcp_servers.<name>.<key>=<value>` override here.**
A dotted override under `mcp_servers` REPLACES that server's whole table instead
of merging into it, so the transport field (`url` or `command`) is dropped and
codex refuses to start: `Error loading config.toml: invalid transport in
mcp_servers.<name>`. This fails for every server and every key — including keys
the config file already sets — so the run dies at config load with exit 1 before
any research happens, and the events file comes back empty. Per-call MCP timeouts
belong in `~/.codex/config.toml` itself, not on this command line. An inline
whole-table `--config` form does load, but it would put the server URL — and any
credential embedded in it — into the process argument list, so it is not an
option either.

## Phase 3: Collection, Reading, and Continuation

Wait for each pass to end as the host's reference says; do not poll, or sleep in the foreground. Step 1 reads every pass, pass `0` included. On the routes that send a goal turn (codex, `claude -p`), pass `0` is the launch: once it has ended, send pass `1`. Steps 2–4 start at the route's **first evaluated pass** — pass `1` on codex and `claude -p`, pass `0` on Claude Code.

### 1. What the pass delivered

Read what the CLI or host delivered for the pass: its exit code (`p${PASS}.status` on the CLI routes) or the host's completion status, and its report — codex's last `agent_message` in its events file (high-reasoning codex streams progress messages first, so the last one), `claude -p`'s terminal `result` event, the Claude Code subagent's delivered result. This is this session's reading of what was delivered. The pass **failed** where its status is not a success, its terminal event is an error (codex `turn.failed`, a `result` with `is_error`), or its report is empty or aborted. A report is **whole** where it restates the research report as a whole; a goal turn's acknowledgement, or a report that only refers back to an earlier one, is not. Each pass's report is the research trace, **carried verbatim to the presentation step; do NOT regex-parse it** — nothing below rewrites it.

### 2. The tool record

The machine reads the run's own record of its tool calls, never the run's description of them, and only what is unambiguous there; where it cannot read something, it says so rather than guessing.

- **A successful Tavily call** completed without error — a call whose MCP result is flagged as an error is not one: codex reports it as `status: "failed"` even where a result is present, a Claude record as `is_error` — and is a Tavily server's search or extract tool: the server's name contains `tavily`, or is the Tavily server name the launch recorded in `tavily_server.txt`, and the tool is named exactly `tavily_search`, `tavily-search`, `tavily_extract`, or `tavily-extract`. A codex record names the server in `server`; a Claude record names it inside the tool name, `mcp__<server>__<tool>`, where the server segment may carry a plugin or connector prefix (`plugin_<plugin>_<server>`, `claude_ai_<Name>`). Other Tavily tools (research, crawl, map), a tool of that name on a server that is not Tavily's, and every other tool are not counted.
- **What it returned** is read only from a JSON response carrying a `results` array: each entry's `url`, listed verbatim. An extract call's listed URLs are what it extracted; its failed URLs are not in `results`. What a call asked for — its arguments, a URL inside a query — is never read.
- **Not mechanically readable**: a successful call whose response is not JSON with a `results` array — formatted text, an error body, a truncated or stubbed result. It lists nothing; it is counted and named by call id, and this session reads its raw record in step 3.

The whole run's record is written to `/tmp/goal_research_${SUFFIX}/record.jsonl`. A pass file or transcript that cannot be read whole adds nothing to it and is named in `unread.txt` instead; a record left empty is removed, and is then not readable. Where the passes were written to per-pass event files — the `codex` runner, and `claude -p` — the record is their JSON lines together, each tagged with its pass:

```bash
D=/tmp/goal_research_${SUFFIX}
: > "$D/record.jsonl"; : > "$D/unread.txt"
for f in "$D"/p*.events.jsonl; do
  k=${f##*/p}; k=${k%.events.jsonl}
  { grep '^{' "$f"; [ $? -le 1 ]; } > "$D/part.json" \
    && jq -c --arg pass "$k" '. + {pass: $pass}' "$D/part.json" > "$D/part.jsonl" \
    && cat "$D/part.jsonl" >> "$D/record.jsonl" || echo "pass $k" >> "$D/unread.txt"
done
[ -s "$D/record.jsonl" ] || rm -f "$D/record.jsonl"
```

Where the host keeps the record itself, its reference gives the block that writes it. The record reduces to one line per successful Tavily call, kept once by its call identity however often the record repeats it, `{"id", "tool", "readable", "urls"}`, in `calls.jsonl`, which is removed where the reduction fails; a record that is missing or holds a line that does not parse fails it. A codex item id restarts in every process, so a codex call is identified by its pass and its item id; a Claude tool-use id is unique across the run. Both reductions build each call's result with one definition, written once:

```bash
D=/tmp/goal_research_${SUFFIX}
cat > "$D/tavily.jq" <<'JQ'
def is_tavily($server; $tool; $named):
  ($server | test("tavily"; "i") or ($named != "" and . == $named))
  and ($tool | test("^tavily(_|-)(search|extract)$"));
def tavily_result:
  ([.structured, (.texts[]? | try fromjson catch empty)]
   | map(select(type == "object" and (.results | type) == "array"))) as $json
  | {id, tool, readable: ($json | length > 0), urls: ([$json[] | .results[] | .url? | strings] | unique)};
JQ
```

There are two record shapes, each with one reduction:

- **Codex events** (the `codex` runner): each Tavily call is an `mcp_tool_call` item with its `server`, `tool`, `status`, `error`, and `result`; the response is the result's `structured_content` or the JSON text inside its `content[].text`.

  ```bash
  D=/tmp/goal_research_${SUFFIX}
  [ -f "$D/record.jsonl" ] && jq -L "$D" --arg named "$(cat "$D/tavily_server.txt" 2>/dev/null)" -cs 'include "tavily";
    [ .[] | select(.type=="item.completed" and .item.type=="mcp_tool_call" and .item.status=="completed" and .item.error==null
             and is_tavily(.item.server // ""; .item.tool // ""; $named))
      | {id: "\(.pass):\(.item.id)", tool: .item.tool, structured: .item.result.structured_content?,
         texts: [.item.result.content[]? | select(.type=="text") | .text]}
      | tavily_result ]
    | unique_by(.id) | .[]' \
    "$D/record.jsonl" > "$D/calls.jsonl" || rm -f "$D/calls.jsonl"
  ```

- **Claude message record** (the `claude` runner, on any host): assistant entries carry `{type: "tool_use", id, name}` items and user entries carry `{type: "tool_result", tool_use_id, is_error, content}` items, with the tool's structured output beside them where the host keeps it (`tool_use_result.structuredContent` in `claude -p` output, `toolUseResult.structuredContent` in a Claude Code transcript), read before the text content only where the entry carries a single tool result, since it names no call; a call is the pair joined by id; a `tool_use` with no result did not complete, and a `tool_result` with no `tool_use` names no tool and is skipped.

  ```bash
  D=/tmp/goal_research_${SUFFIX}
  [ -f "$D/record.jsonl" ] && jq -L "$D" --arg named "$(cat "$D/tavily_server.txt" 2>/dev/null)" -cs 'include "tavily";
    ([.[] | select(.type=="assistant") | .message.content[]? | select(.type=="tool_use") | {key: .id, value: .name}] | from_entries) as $names
    | [ .[] | select(.type=="user") | . as $entry
        | (if ([.message.content[]? | select(.type=="tool_result")] | length) == 1
           then [$entry.tool_use_result, $entry.toolUseResult] | map(objects | .structuredContent) | map(select(. != null)) | first
           else null end) as $sc
        | .message.content[]? | select(.type=="tool_result" and .is_error != true)
        | (($names[.tool_use_id // ""] // "") | split("__")) as $parts
        | ($parts | last // "") as $tool
        | select(($parts | length) >= 3 and $parts[0] == "mcp" and is_tavily($parts[1:-1] | join("__"); $tool; $named))
        | {id: .tool_use_id, tool: $tool, structured: $sc,
           texts: [.content | if type=="string" then . else (.[]? | select(.type=="text") | .text) end]}
        | tavily_result ]
    | unique_by(.id) | .[]
  ' "$D/record.jsonl" > "$D/calls.jsonl" || rm -f "$D/calls.jsonl"
  ```

The record is the Tavily route the brief directs. A page the run fetched another way — a host's built-in web search, a shell `curl` — is outside it, so "not found in this run's Tavily record" never means that no tool touched the URL.

Then list what the record holds:

```bash
D=/tmp/goal_research_${SUFFIX}; C=$D/calls.jsonl
if [ ! -f "$D/record.jsonl" ]; then
  echo 'record not readable: the checks have not run'
elif [ ! -f "$C" ]; then
  echo 'reduction failed: the checks have not run'
else
  echo "successful Tavily calls: $(jq -s 'length' "$C")"
  echo "not mechanically readable: $(jq -s '[.[] | select(.readable | not)] | length' "$C")"
  jq -r 'select(.readable | not) | "  call " + .id + " (" + .tool + ")"' "$C"
  sed 's/^/  not read: /' "$D/unread.txt" 2>/dev/null
  echo '--- returned ---'
  jq -r '.urls[]' "$C" | LC_ALL=C sort -u
  echo '--- extracted ---'
  jq -r 'select(.tool | test("extract")) | .urls[]' "$C" | LC_ALL=C sort -u
fi
```

No successful Tavily call is a failure the run can repair (step 4): nothing in the report was retrieved through the designated route, and its claims stand as the runner's own, open, unchecked. A record not readable, or a failed reduction, is not the run's to repair: this session reports it, and the loop ends. A pass or transcript listed as not mechanically readable is read raw in step 3. For codex, read the warn files as well — an MCP that failed to start leaves its trace there, not in the narrative.

### 3. Reading the report

Each continuation asks the run to return its whole report, updated, so the **current report** is the latest whole report (step 1); a goal turn's acknowledgement never becomes it, and until a pass delivers a whole report there is none. Which pass it is, is this session's reading, said in the Source Check.

Read the current report against the `returned` and `extracted` lists — and, for each call not mechanically readable, against that call's raw record — and judge each citation: **returned by this run**, **extracted by this run**, or **not found in this run's Tavily record**. A citation whose claim is labelled `verified` and whose source this run did not extract is read the same way and said so. Whatever rests on a citation not found in the record is the runner's own inference and open, whatever label it carries.

Read it against the brief's form as well, and note what it is missing: a factual claim with no citation; an absence or novelty claim with no reach record behind it; an empirical effect with no replication or retraction status; a detail that reads as recalled — a volume, page, date, or number no returned source gave — not marked reconstructed. No line format is required of the runner.

Every judgment in this step is this session's reading, marked as such where it is shown, not a mechanical result.

### 4. The goal

Judge the run against the goal condition, using the lists and the reading. Its **gaps** are the research gaps in the current report — the citations not found in this run's Tavily record, the `verified` labels on sources not extracted, and the uncertainties neither filled by a citation nor returned open with their reach. An item that is the person's to settle is never a gap; it goes to the user. Its **failures** are what the run can repair: a failed pass (step 1, pass `0` included), no whole report (step 3), no successful Tavily call (step 2).

Count the gaps — the count is this session's reading — and decide, in this order:

- **stop** — a failure the last continuation named is still there: the loop ends, and Phase 4 reports it raw — its status, its terminal or error events, its warn file.
- **recover** — a failure of a kind not yet sent back in this run: continue the same run as below, naming it, whatever the gap count; this pass records no count.
- **met** — no gap: go to Phase 4.
- **continue** — the first count recorded, or fewer gaps than the last count recorded: continue the **same** run — not a new one — as the next pass, through the runner's continuation (codex in its runner section; claude in the host's reference), sending this message, written to `/tmp/goal_research_${SUFFIX}/continue.txt`:

  ```
  The goal condition is not met yet. Continue toward it in this same session, then return the whole report again, updated.
  What to address:
  - {each failure and gap, one line each}
  ```

  A failure is named plainly with what to do — "no Tavily call succeeded — use Tavily search and extract for the sources", "your last turn ended in an error — continue and return your whole report", "return your whole report, not only what changed".

- **stop: gaps did not shrink** — otherwise: the loop ends, and Phase 4 shows the gaps that remain.

Each kind of failure is sent back once, and otherwise a continuation is sent only while the gap count strictly falls, so the loop ends. The measure is the count, not which gaps: a pass that closes one gap and exposes another stops here, and whatever remains returns open to the user.

### 5. Codex warnings

Some codex warnings ride the **stderr banner**, not `agent_message` — each pass sent stderr to its own warn file. Grep those to catch what the narrative does not carry, and surface any hits alongside the trace:

```bash
cat /tmp/goal_research_${SUFFIX}/p*.warn.txt | grep -iE 'invalid_grant|deprecat|--full-auto|warn' || true
```

### 6. Cleanup

After the loop has ended and the result is presented, remove this skill's temp directory, and nothing else:

```bash
rm -rf /tmp/goal_research_${SUFFIX}
```

A session a CLI keeps in its own store is left there; the runner's section and the host's reference say where.

## Phase 4: Output

Present the source check first, then the items the run returned as the user's to settle, then the trace — every pass's delivered report verbatim, in pass order, each headed by its pass number — so a statement that the run had no successful Tavily call, that a pass failed, or that its record could not be read is the first thing the user reads. The items to settle are lifted from the trace into their own block, each with what it needs, and presented to the user as theirs to settle; neither the runner nor the main session answers or settles them, and work that rests on one waits for the user's words. Do not dump the raw event stream or tool record:

```
## Goal Research Result

Target: {research_question}
Runner: {claude | codex}
Goal: {engaged, only where the route's record shows it positively — `claude -p`; otherwise "not confirmed on this route", never "not engaged" from an absence}
Passes: {n}, gap counts from the first evaluated pass: {each} — stopped: {goal met | gaps did not shrink | a failure was not repaired | the record could not be read | the launch did not start}

--- Source Check ---
{"read on pass {k}'s report, the current one; earlier passes are history in the trace";
 then, where that pass ended on a failure: "no successful Tavily call — nothing in the report was retrieved through the designated route; its claims stand as the runner's own, open, unchecked";
 or "pass {k} failed" with its raw error; or "no whole report";
 or "the run's tool record could not be read, or its reduction failed, so the checks have not run — sources and strength labels are the runner's own, unchecked";
 otherwise the record: {n} successful Tavily calls, {m} not mechanically readable, and each pass or transcript not read;
 then, as this session's reading: each citation not found in this run's Tavily record, each `verified` label on a source this run did not extract, what the report form is missing, and, where the loop ended without meeting the goal, the gaps that remain — or "this session's reading found every citation in the record and nothing missing"}

--- Yours to Settle ---
{each item the run returned as the user's, with what it needs; or "none returned"}

--- Trace ---
{every pass's delivered report in pass order, each headed "Pass k", pass 0's full report first, a failed pass shown with its raw error; or "no pass delivered a report"}
```

Acceptance criterion: a real research run was launched on the designated runner; each pass was read as delivered; each evaluated pass was judged against the goal condition, its failures named back to the same run, and the run continued only while its gaps fell; the result was presented with the source check, the items the run returned as the user's presented as theirs to settle, and this skill's temp directory removed.

## Rules

- Research question is embedded verbatim — no paraphrasing before passing it to the runner.
- The runner is the designated one, `claude` when none is designated; the research runs in the background wherever the host offers it, so the main session is free until each pass ends.
- A run is not required to succeed in one pass. A failure the run can repair — an error or empty result, no whole report, no successful Tavily call — is named to the same run once and reported raw where that continuation does not repair it; one only this session's side can have — a record it cannot read — is reported, not sent to the run. The skill does not mask a failure, start a new run, or fall back to the other runner.
- The machine reads the run's tool record and only what is unambiguous there; citations are read against it by this session, each judgment marked as its reading; the report itself is forwarded unedited.
- Remove only this skill's temp directory; a session kept in a CLI's own store is the user's to remove.
- The skill is a delegation channel only — interpretation, follow-up questions, and downstream protocol routing belong to the main session after the trace returns. What the run returns as the user's to settle reaches the user as theirs, as Phase 4 presents it.
