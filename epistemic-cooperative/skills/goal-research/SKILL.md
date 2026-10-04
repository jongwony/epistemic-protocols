---
name: goal-research
description: Delegate factual research to a background /goal-scoped Claude or Codex run using Aitesis and Tavily; read its citations against its Tavily record, continuing till met. User-invoked via /goal-research.
---

# Goal Research

Invoke directly with `/goal-research [runner] <research question>` when the user wants to delegate fact-finding or external verification to a background research run that drives Aitesis with Tavily search and extract, and wants the run's citations read against what its own Tavily calls returned.

**Architecture**:
```
goal-research
├── Runner designation + research question (argument or one-time prompt)
├── Research run (background, its own context), brief opening with `/goal <condition>`
│   ├── claude (default): a Claude run (subagent, or `claude -p` on a Codex host) — `/inquire` drives Tavily search + extract
│   └── codex: Codex CLI — builtin `goal`, `$inquire` drives Tavily
├── Each time the run returns
│   ├── mechanical: reduce its tool record — successful Tavily calls, the URLs their JSON results list, the calls not mechanically readable
│   ├── reading: this session reads the report against those lists and the raw record, each judgment marked as its reading
│   └── goal: met → present; unmet → continue the same run with the gaps; no progress → present
└── Presentation: source check, open items handed to the user as theirs to settle, verbatim trace
    (+ temp-file cleanup)
```

**Why this composition**: `/inquire` carries the epistemic contract — its reading of each uncertainty, its record of what collection reached, and what stays open for the person to settle. goal-research refines that contract for the research domain and for a background run; it adds no second reading beside it. Running the research in its own context isolates it from the main conversation while still surfacing the full trace back. A research run can complete, answer fluently, and cite sources it never opened, and nothing in the narrative distinguishes that from a searched answer. Whether a URL in report prose names the same source as a URL in a tool result is not mechanically decidable, so the work splits: the machine reads only the run's tool record, and only what is unambiguous there; this session reads the report against it and judges, marking each judgment as its reading. The run's own account of what it opened is part of the report under that reading, never the record.

## Caller Signature

```
/goal-research [runner?] <research question>

runner : claude | codex        (claude when none is designated)
```

Read the runner designation from the request's words as well as its arguments. A leading `claude` or `codex` designates the runner only when it stands as a separate leading argument and what follows reads as the whole question; wording outside the research question designates as well. Where the leading word could instead open the question — `Claude Shannon's 1948 paper…`, `codex CLI sandbox defaults` — ask once which it is. Nothing is removed from inside the question. With no designation, the runner is `claude`.

| Runner | Route | Precondition |
|---|---|---|
| `claude` | A background Claude run with its own context, running `/inquire` with Tavily search and extract | The host can start such a run whose tools include Tavily search and Tavily extract, and the `/inquire` skill |
| `codex` | A background `codex exec` session running `$inquire` with Tavily | `codex` on PATH; Tavily is reached through Codex's own MCP configuration, and its absence surfaces at the zero-call outcome |

Record the runner actually used. A precondition found missing before launch is surfaced with the missing capability, and the skill stops there.

## Phase 1: Argument Capture

1. If `/goal-research` is invoked with an argument, the research question is that argument after a leading runner designation, read as the Caller Signature says, carried verbatim — nothing is removed from inside it.
2. If invoked without a research question, ask the user once for it, then proceed.

The research question is passed unchanged into the research brief — paraphrasing is prohibited.

## Phase 2: Launch (Background)

Generate a unique suffix for this run's temp files: `SUFFIX=$(openssl rand -hex 4)`. Shell state does not persist between separate command calls, so substitute the generated value literally for `${SUFFIX}` in every later block, and do the same for any other value generated here.

### Research brief

Every runner receives this brief, with `{inquire}` set to `/inquire` for `claude` and `$inquire` for `codex`. Its first line is the **goal condition**, the one this session judges the run against in Phase 3:

```
/goal Every uncertainty the research target below turns on is either filled by a citation to a source this session's Tavily calls returned, or returned open with its reach — the person's marked as theirs.

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

The host is the environment driving this skill, not another user choice; `claude` stays the default on every host. Read only that host's reference, here, before determining availability; it carries the launch, where the run's record is, how its final message is read, and how the same run is continued:

| Host | `claude` runner | Reference |
|---|---|---|
| Claude Code | A background subagent | [Claude Code](references/host-claude-code.md) |
| Codex | A background `claude -p` process | [Codex](references/host-codex.md) |

Other hosts may supply the same capability: a background Claude run with its own context, whose tool calls are recorded where this session can read them, and which this session can continue. Before launch, confirm that Tavily search and Tavily extract are available to that run; where either is missing, surface the missing capability and stop. The run receives the brief as its whole task, not this conversation's history. Wait for the host's completion notification — do not poll.

### Runner: codex

Check `which codex 2>/dev/null`. If Codex CLI is not found, expose the missing-binary error and stop. Failure modes are surfaced as raw errors, not handled internally.

Write the brief, with `{inquire}` = `$inquire`, to `/tmp/goal_research_${SUFFIX}.txt`. Its `/goal` first line engages Codex's builtin goal command explicitly (the `Goal:` label form also works, but the slash form makes the convention unambiguous and aligns with how `$inquire` is invoked).

Launch through the host's background execution facility, with a 75-minute envelope (on Claude Code, the binding is in [Claude Code](references/host-claude-code.md)). `--color never` + splitting the
streams (stdout to the events file, `2>` to a separate warn file) keeps stderr
warnings out of the events file. Stdout is **not** guaranteed to be pure JSONL —
codex may still print a plain notice line there (e.g. `Codex autostart is
disabled.`), so every extraction below filters to lines starting with `{` before
parsing. Select `{effort}` per run by the research question's depth and breadth, floored at `high` (never below) — a narrow, single-fact question runs at `high`, a multi-branch or deep-synthesis question at `xhigh`, and the most demanding research may escalate to `max` (the top of this model's ladder — it consumes usage limits faster, so reserve it for genuinely heavy questions):

```bash
codex exec --json --color never --skip-git-repo-check -m gpt-6-astra \
  --config model_reasoning_effort="{effort}" \
  < /tmp/goal_research_${SUFFIX}.txt > /tmp/goal_research_events_${SUFFIX}.jsonl 2>/tmp/goal_research_warn_${SUFFIX}.txt
```

The launch persists its session so Phase 3 can continue the same one: `--ephemeral` would leave nothing to resume. The cost is that the session's files stay in Codex's own session store after the run.

Sandbox flag is omitted intentionally — Tavily verification requires network access, so the read-only sandbox used by `review-loop`'s codex source does not apply here.

That 75-minute background timeout is the delegated Codex session envelope, for the launch and for each continuation.

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

Wait for the background task completion notification — do not poll or sleep. Steps 1–4 run each time the run returns, over the whole run so far.

### 1. The narrative

The runner's final report **is** the research trace/answer — **forward it verbatim to the presentation step; do NOT regex-parse it**. It is extracted mechanically and written to `/tmp/goal_research_report_${SUFFIX}.txt`; nothing below rewrites it.

- **claude**: extracted from the run's record as the host's reference says. If it comes back empty or the run failed, surface what returned instead of proceeding blank.
- **codex**: filter the events file once to its JSON lines, then extract the **final** codex `agent_message` from that — high-reasoning codex streams progress messages first, so the extraction takes the last `agent_message`. **If the extraction comes back empty, codex failed before answering** (auth / timeout / crash) — read the raw events file `/tmp/goal_research_events_${SUFFIX}.jsonl` for the `turn.failed` / `error` events and surface that instead of proceeding blank.

  ```bash
  grep '^{' /tmp/goal_research_events_${SUFFIX}.jsonl > /tmp/goal_research_json_${SUFFIX}.jsonl
  jq -rs '[.[] | select(.type=="item.completed" and .item.type=="agent_message") | .item.text] | last // empty' \
    /tmp/goal_research_json_${SUFFIX}.jsonl > /tmp/goal_research_report_${SUFFIX}.txt
  ```

  The `grep '^{'` is load-bearing, not defensive tidiness: codex prints plain
  notice lines to stdout alongside the JSONL, and `jq -rs` aborts on the first
  one and returns nothing. Without the filter a **successful** run reads as the
  empty extraction the previous sentence tells you to treat as a crash.

  Reasoning items appear only if codex emits them (config-gated) — do not force them on.

### 2. The tool record

The machine reads the run's own record of its tool calls, never the run's description of them, and only what is unambiguous there; where it cannot read something, it says so rather than guessing.

- **A successful Tavily call** completed without error and is named exactly as Tavily's search or extract tool — `tavily_search`, `tavily-search`, `tavily_extract`, or `tavily-extract`, after any server prefix the host adds. Other Tavily tools (research, crawl, map) and every other tool are not counted.
- **What it returned** is read only from a JSON response carrying a `results` array: each entry's `url`, listed verbatim. An extract call's listed URLs are what it extracted; its failed URLs are not in `results`. What a call asked for — its arguments, a URL inside a query — is never read.
- **Not mechanically readable**: a successful call whose response is not JSON with a `results` array — formatted text, an error body, a truncated or stubbed result. It lists nothing; it is counted and named by call id, and this session reads its raw record in step 3.

The record reduces to one line per successful Tavily call, `{"id", "tool", "readable", "urls"}`, in `/tmp/goal_research_calls_${SUFFIX}.jsonl`. There are two record shapes, each with one reduction:

- **Codex events** (the `codex` runner): each Tavily call is an `mcp_tool_call` item with its `tool`, `status`, `error`, and `result`; the response is the result's `structured_content` or the JSON text inside its `content[].text`.

  ```bash
  jq -c 'select(.type=="item.completed" and .item.type=="mcp_tool_call" and .item.status=="completed" and .item.error==null
           and (.item.tool // "" | test("^tavily(_|-)(search|extract)$")))
         | (.item.result // {}) as $r
         | ([$r.structured_content?, ($r.content[]? | select(.type=="text") | .text | try fromjson catch empty)]
            | map(select(type == "object" and (.results | type) == "array"))) as $json
         | {id: .item.id, tool: .item.tool, readable: ($json | length > 0),
            urls: ([$json[] | .results[] | .url? | strings] | unique)}' \
    /tmp/goal_research_json_${SUFFIX}.jsonl > /tmp/goal_research_calls_${SUFFIX}.jsonl
  ```

- **Claude message record** (the `claude` runner, on any host whose reference binds `REC` to the run's record): assistant entries carry `{type: "tool_use", id, name}` items and user entries carry `{type: "tool_result", tool_use_id, is_error, content}` items; a call is the pair joined by id, and a `tool_use` with no result did not complete.

  ```bash
  jq -cs '
    ([.[] | select(.type=="assistant") | .message.content[]? | select(.type=="tool_use") | {key: .id, value: .name}] | from_entries) as $names
    | .[] | select(.type=="user") | .message.content[]? | select(.type=="tool_result" and .is_error != true)
    | ($names[.tool_use_id] // "" | split("__") | last) as $tool
    | select($tool | test("^tavily(_|-)(search|extract)$"))
    | ([.content | if type=="string" then . else (.[]? | select(.type=="text") | .text) end | try fromjson catch empty]
       | map(select(type == "object" and (.results | type) == "array"))) as $json
    | {id: .tool_use_id, tool: $tool, readable: ($json | length > 0),
       urls: ([$json[] | .results[] | .url? | strings] | unique)}
  ' "$REC" > /tmp/goal_research_calls_${SUFFIX}.jsonl
  ```

Where the host offers no readable record of a `claude` run, nothing below is mechanical: the Source Check says the record was not readable, and every source and strength label stands as the runner reported it, unchecked.

The record is the Tavily route the brief directs. A page the run fetched another way — a host's built-in web search, a shell `curl` — is outside it, so "not found in this run's Tavily record" never means that no tool touched the URL.

Then list what the record holds:

```bash
C=/tmp/goal_research_calls_${SUFFIX}.jsonl
echo "successful Tavily calls: $(jq -s 'length' "$C")"
echo "not mechanically readable: $(jq -s '[.[] | select(.readable | not)] | length' "$C")"
jq -r 'select(.readable | not) | "  call " + .id + " (" + .tool + ")"' "$C"
echo '--- returned ---'
jq -r '.urls[]' "$C" | LC_ALL=C sort -u
echo '--- extracted ---'
jq -r 'select(.tool | test("extract")) | .urls[]' "$C" | LC_ALL=C sort -u
```

**Zero-call.** If the successful Tavily call count is `0`, the run has **no successful Tavily call**: nothing in the trace was retrieved through the designated route, and its claims stand as the runner's own, open, unchecked. The Source Check says so first, as a statement covering the whole trace below it, and the trace itself stays unedited. For codex, surface the warn file as well — an MCP that failed to start leaves its trace there, not in the narrative.

### 3. Reading the report

Read the report against the `returned` and `extracted` lists — and, for each call not mechanically readable, against that call's raw record — and judge each citation: **returned by this run**, **extracted by this run**, or **not found in this run's Tavily record**. A citation whose claim is labelled `verified` and whose source this run did not extract is read the same way and said so. Whatever rests on a citation not found in the record is the runner's own inference and open, whatever label it carries.

Read the report against the brief's form as well, and note what it is missing: a factual claim with no citation; an absence or novelty claim with no reach record behind it; an empirical effect with no replication or retraction status; a detail that reads as recalled — a volume, page, date, or number no returned source gave — not marked reconstructed. No line format is required of the runner.

Every judgment in this step is this session's reading, marked as such where it is shown, not a mechanical result.

### 4. The goal

Judge the run against the goal condition, using the lists and the reading. Its gaps are the citations not found in this run's Tavily record, the `verified` labels on sources not extracted, and the uncertainties neither filled by a citation nor returned open with their reach. An item that is the person's to settle is never a gap; it goes to the user.

- **No gap**: the condition is met; go to Phase 4.
- **Gaps**: continue the **same** run — not a new one — through the runner's continuation (codex below; claude in the host's reference), sending this message, written to `/tmp/goal_research_continue_${SUFFIX}.txt`:

  ```
  The /goal condition is not met yet. Continue toward it in this same session, then return the whole report again, updated.
  Gaps found in your report and this session's Tavily record:
  - {each gap}
  ```

  Then run steps 1–4 again over the whole run so far.
- **No progress**: a continuation that closed no gap stops the loop; go to Phase 4 with the gaps that remain.

A run that failed, rather than returning short of the condition, is surfaced as a raw error and not continued.

**Codex continuation.** The thread id is in the events file's `thread.started` event. Continue it through the host's background execution facility, appending to the same events and warn files so the record stays whole:

```bash
codex exec resume "{thread_id}" - --json --skip-git-repo-check -m gpt-6-astra \
  --config model_reasoning_effort="{effort}" \
  < /tmp/goal_research_continue_${SUFFIX}.txt >> /tmp/goal_research_events_${SUFFIX}.jsonl 2>>/tmp/goal_research_warn_${SUFFIX}.txt
```

### 5. Codex warnings

Some codex warnings ride the **stderr banner**, not `agent_message` — the launch sent stderr to its own warn file. Grep that to catch what the narrative does not carry, and surface any hits alongside the trace:

```bash
grep -iE 'invalid_grant|deprecat|--full-auto|warn' /tmp/goal_research_warn_${SUFFIX}.txt || true
```

### 6. Cleanup

After the loop has stopped and the result is presented, remove this run's temp files (each route creates only some of them):

```bash
rm -f /tmp/goal_research_${SUFFIX}.txt /tmp/goal_research_events_${SUFFIX}.jsonl /tmp/goal_research_warn_${SUFFIX}.txt \
  /tmp/goal_research_json_${SUFFIX}.jsonl /tmp/goal_research_report_${SUFFIX}.txt /tmp/goal_research_calls_${SUFFIX}.jsonl \
  /tmp/goal_research_status_${SUFFIX}.txt /tmp/goal_research_continue_${SUFFIX}.txt
```

## Phase 4: Output

Present the source check first, then the items the run returned as the user's to settle, then the runner's last narrative verbatim as the trace — so a statement that the run had no successful Tavily call, or that its record could not be read, is the first thing the user reads. The items to settle are lifted from the narrative into their own block, each with what it needs, and presented to the user as theirs to settle; neither the runner nor the main session answers or settles them, and work that rests on one waits for the user's words. Use the Phase 3 narrative as the trace body — do not dump the raw event stream or tool record:

```
## Goal Research Result

Target: {research_question}
Runner: {claude | codex}
Continuations: {n} — stopped: {goal met | no progress | a continuation failed, surfaced below}

--- Source Check ---
{"no successful Tavily call — nothing in the trace below was retrieved through the designated route; its claims stand as the runner's own, open, unchecked";
 or "the run's tool record is not readable from this session — sources and strength labels are the runner's own, unchecked";
 or the record: {n} successful Tavily calls, {m} not mechanically readable;
 then, as this session's reading: each citation not found in this run's Tavily record, each `verified` label on a source this run did not extract, what the report form is missing, and, where the loop stopped without progress, the gaps that remain — or "this session's reading found every citation in the record and nothing missing"}

--- Yours to Settle ---
{each item the run returned as the user's, with what it needs; or "none returned"}

--- Trace ---
{runner_narrative}
```

Acceptance criterion: a real research run was launched on the designated runner and judged against the goal condition each time it returned, continued while gaps closed, and its last trace was returned to the main session with the source check, the items it returned as the user's presented as theirs to settle, and the temp files cleaned up.

## Rules

- Research question is embedded verbatim — no paraphrasing before passing it to the runner.
- The runner is the designated one, `claude` when none is designated; the research runs in the background, so the main session is free until the completion notification arrives.
- Failure modes (Codex or the `claude` CLI missing, a missing Claude run or Tavily capability, network failure, Tavily unavailable, delegated-session timeout, or Tavily MCP per-call timeout) are exposed as raw errors. The skill does not mask, retry, or fall back to the other runner; continuation answers only a run that returned short of the goal.
- The machine reads the run's tool record and only what is unambiguous there; citations are read against it by this session, each judgment marked as its reading; the narrative itself is forwarded unedited.
- Always clean up this run's temp files after the result is presented.
- The skill is a delegation channel only — interpretation, follow-up questions, and downstream protocol routing belong to the main session after the trace returns. What the run returns as the user's to settle reaches the user as theirs, as Phase 4 presents it.
