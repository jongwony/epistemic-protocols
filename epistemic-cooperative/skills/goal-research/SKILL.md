---
name: goal-research
description: Delegate factual research to a background Claude or Codex run that verifies via Aitesis and Tavily, then check its citations against the run's own tool results. User-invoked via /goal-research.
---

# Goal Research

Invoke directly with `/goal-research [runner] <research question>` when the user wants to delegate fact-finding or external verification to a background research run that drives Aitesis with Tavily search and extract, and wants the run's citations checked against what it actually retrieved.

**Architecture**:
```
goal-research
├── Runner designation + research question (argument or one-time prompt)
├── Research run (background, its own context)
│   ├── claude (default): subagent — `/inquire` drives Tavily search + extract
│   └── codex: Codex CLI — builtin `goal` scopes the endpoint, `$inquire` drives Tavily
├── Checks against the run's own tool record
│   ├── zero-call: did any external search happen
│   ├── cited ⊆ retrieved: every cited URL appears in the run's tool results
│   └── verified ⊆ extracted: each `verified` claim has a source the run opened
└── Presentation (check results beside the verbatim trace) + Codex temp-file cleanup
```

**Why this composition**: running the research in its own context isolates it from the main conversation while still surfacing the full trace back. A research run can complete, answer fluently, and cite sources it never opened — the model falls back to recalled knowledge, and nothing in the narrative distinguishes that from a searched answer. So the run's report is checked against the run's own tool record, and the run's own account of what it searched or opened is treated as part of the report under check, never as the check.

## Caller Signature

```
/goal-research [runner?] <research question>

runner : claude | codex        (claude when none is designated)
```

Read the runner designation from the request's words as well as its arguments — a leading `claude` or `codex` argument, or wording such as "with Codex". With no designation, the runner is `claude`.

| Runner | Route | Precondition |
|---|---|---|
| `claude` | A background subagent with its own context, running `/inquire` with Tavily search and extract | The host can start a background subagent whose tools include Tavily search and Tavily extract, and the `/inquire` skill |
| `codex` | A background `codex exec` session, `/goal`-scoped, running `$inquire` with Tavily | `codex` on PATH; Tavily is reached through Codex's own MCP configuration, and its absence surfaces at the zero-call check |

Record the runner actually used. A precondition found missing before launch is surfaced with the missing capability, and the skill stops there.

## Phase 1: Argument Capture

1. If `/goal-research` is invoked with an argument, the research question is that argument with any runner designation removed, carried verbatim. Where a leading word could equally designate the runner or open the question, ask once which it is.
2. If invoked without a research question, ask the user once for it, then proceed.

The research question is passed unchanged into the research brief — paraphrasing is prohibited.

## Phase 2: Launch (Background)

### Research brief

Both runners receive this brief, with `{inquire}` set to `/inquire` for `claude` and `$inquire` for `codex`:

```
This session is the research session the goal-research skill has already delegated to — goal-research is already running here, so do not invoke it again in this session.

Research target:
{research_question}

Workflow:
1. Invoke {inquire} (the Aitesis skill) to drive external verification through Tavily search and Tavily extract.
2. Open the page of each primary source a claim rests on with Tavily extract. A search-result snippet alone supports a claim at most as "mostly".
3. Cite each external source by its URL.

Report:
- Each factual claim with its source URL(s) and a verification strength:
  - verified: its primary source's page was opened in this session and states the claim
  - mostly: the core claim was checked in this session; surrounding detail is synthesized, or the source was seen only as a search-result snippet
  - reconstructed: a detail such as a volume, issue, page range, date, or number comes from recall and needs a spot-check
- The weakest link: the claim or detail the conclusions lean on that has the weakest strength, named explicitly.
- Every absence or novelty claim ("no study has…", "untested", "novel", "first to…") with the search scope that grounds it: the queries run, the sources reached, and the sources not reached. The claim reaches only as far as that scope.
- For each empirical effect cited: its replication status and any retraction, where checkable in this session, otherwise "not checked". An effect that failed replication is reported as a design warning, not a quantitative law.
- Residual uncertainty where sources contradict or coverage is incomplete.
```

### Runner: claude

Start a background subagent with its own context and the brief as its whole task. It receives the brief, not this conversation's history. Wait for the host's completion notification — do not poll.

### Runner: codex

Check `which codex 2>/dev/null`. If Codex CLI is not found, expose the missing-binary error and stop. Failure modes are surfaced as raw errors, not handled internally.

Generate a unique suffix: `SUFFIX=$(openssl rand -hex 4)`

Write the research prompt to `/tmp/goal_research_${SUFFIX}.txt`. The prompt **must begin with `/goal`** so Codex's builtin goal-scoping engages explicitly (the `Goal:` label form also works, but the slash form makes the convention unambiguous and aligns with how `$inquire` is invoked). The research brief follows the first line:

```
/goal Research and externally verify the target below.

The `/goal` prefix above scopes this Codex session as a research endpoint.

{research brief, with {inquire} = $inquire}
```

Launch via `Bash(run_in_background: true, timeout: 4500000)`. `--color never` + splitting the
streams (stdout to the events file, `2>` to a separate warn file) keeps stderr
warnings out of the events file. Stdout is **not** guaranteed to be pure JSONL —
codex may still print a plain notice line there (e.g. `Codex autostart is
disabled.`), so every extraction below filters to lines starting with `{` before
parsing. Select `{effort}` per run by the research question's depth and breadth, floored at `high` (never below) — a narrow, single-fact question runs at `high`, a multi-branch or deep-synthesis question at `xhigh`, and the most demanding research may escalate to `max` (the top of this model's ladder — it consumes usage limits faster, so reserve it for genuinely heavy questions):

```bash
codex exec --ephemeral --json --color never --skip-git-repo-check -m gpt-6-astra \
  --config model_reasoning_effort="{effort}" \
  < /tmp/goal_research_${SUFFIX}.txt > /tmp/goal_research_events_${SUFFIX}.jsonl 2>/tmp/goal_research_warn_${SUFFIX}.txt
```

Sandbox flag is omitted intentionally — Tavily verification requires network access, so the read-only sandbox used by `review-loop`'s codex source does not apply here.

The background Bash timeout (4,500,000 ms / 75 min) is the delegated Codex
session envelope.

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

## Phase 3: Collection and Checks

Wait for the background task completion notification — do not poll or sleep.

### 1. The narrative

The runner's final report **is** the research trace/answer — **forward it verbatim to the presentation step; do NOT regex-parse it**. The checks below sit beside it and never rewrite it.

- **claude**: the subagent's final message. If it is empty or the subagent failed, surface what returned instead of proceeding blank.
- **codex**: extract the **final** codex `agent_message` with the line below — high-reasoning codex streams progress messages first, so the line takes the last `agent_message`. **If the extraction comes back empty, codex failed before answering** (auth / timeout / crash) — read the raw events file `/tmp/goal_research_events_${SUFFIX}.jsonl` for the `turn.failed` / `error` events and surface that instead of proceeding blank.

  ```bash
  grep '^{' /tmp/goal_research_events_${SUFFIX}.jsonl \
    | jq -rs '[.[] | select(.type=="item.completed" and .item.type=="agent_message") | .item.text] | last // empty'
  ```

  The `grep '^{'` is load-bearing, not defensive tidiness: codex prints plain
  notice lines to stdout alongside the JSONL, and `jq -rs` aborts on the first
  one and returns nothing. Without the filter a **successful** run reads as the
  empty extraction the previous sentence tells you to treat as a crash.

  Reasoning items appear only if codex emits them (config-gated) — do not force them on.

### 2. The tool record

The checks read the run's own record of its tool calls, never the run's description of them.

- **codex**: the events file. Each Tavily call is an `mcp_tool_call` item carrying its `tool`, `arguments`, and `result`.
- **claude**: the subagent's own tool-call record, where the host makes it readable from this session (for example, a transcript of the subagent's tool calls and their results). Where it is not readable, checks 3 and 4 have not run: the report's first line says so, and every source and strength label stands as the runner reported it, unchecked. A subagent's statement of what it searched or opened does not substitute for the record.

### 3. Zero-call check

A run that made no external calls answered from recall. For codex, count the tool calls:

```bash
grep '^{' /tmp/goal_research_events_${SUFFIX}.jsonl \
  | jq -rs '[.[] | select(.item.type // "" | test("tool_call|mcp")) ] | length'
```

For claude, count the Tavily search and extract calls in the record.

If that count is `0`, the run performed **no external searches**. Do not
present its output as verified research. Say so in the first line of the
report, mark every claim in it as recalled-from-training, and, for codex, surface the
warn file — an MCP that failed to start leaves its trace there, not in the
narrative.

### 4. Cited-source check

Three URL sets, each under the same pattern and normalization (fragment and trailing punctuation or slash dropped):

- **cited**: the URLs in the final report
- **retrieved**: the URLs anywhere in the run's completed tool calls — arguments and results, including JSON text nested inside a result
- **extracted**: the URLs passed to completed, error-free extract calls

Each cited URL outside **retrieved** is flagged, per URL, as `not opened in this run` — the run cited it without any of its own tool calls returning it. Then read the report's `verified` claims: one whose sources all lie outside **extracted** is flagged `verified, but not extracted` — at most a snippet supported it.

For codex:

```bash
EV=/tmp/goal_research_events_${SUFFIX}.jsonl
urls() { grep -oE 'https?://[^]["(){}<>`[:space:]\\]+' | sed -E 's/#.*$//; s/[.,;:!?*]+$//; s#/$##' | sort -u; }
echo '--- cited, not opened in this run ---'
comm -23 \
  <(grep '^{' "$EV" | jq -rs '[.[] | select(.type=="item.completed" and .item.type=="agent_message") | .item.text] | last // empty' | urls) \
  <(grep '^{' "$EV" | jq -r 'select(.type=="item.completed" and (.item.type // "" | test("tool_call|mcp"))) | .item | .. | strings | . as $s | try (fromjson | .. | strings) catch $s' | urls)
echo '--- extracted ---'
grep '^{' "$EV" | jq -r 'select(.type=="item.completed" and (.item.tool // "" | test("extract")) and .item.error == null) | .item.arguments | .. | strings' | urls
```

For claude, build the same three sets from the subagent's final message and its tool-call record with the same `urls` normalization.

An exact-match miss can come from a URL variant (a redirect, a tracking parameter) rather than a citation from memory; the flag names the URL so the user can tell which.

### 5. Codex warnings

Some codex warnings ride the **stderr banner**, not `agent_message` — the launch sent stderr to its own warn file. Grep that to catch what the narrative does not carry, and surface any hits alongside the trace:

```bash
grep -iE 'invalid_grant|deprecat|--full-auto|warn' /tmp/goal_research_warn_${SUFFIX}.txt || true
```

### 6. Codex cleanup

Clean up the temp prompt file, the event stream, and the warn file (after the narrative is forwarded / any failure surfaced and the checks have run):

```bash
rm -f /tmp/goal_research_${SUFFIX}.txt /tmp/goal_research_events_${SUFFIX}.jsonl /tmp/goal_research_warn_${SUFFIX}.txt
```

## Phase 4: Output

Present the check results, then the runner's narrative verbatim as the trace. Use the Phase 3 narrative as the trace body — do not dump the raw event stream or tool record:

```
## Goal Research Result

Target: {research_question}
Runner: {claude | codex}

--- Source Check ---
{zero-call result; cited URLs not opened in this run, each listed; verified claims not extracted, each listed;
 or "all cited sources appear in this run's tool results";
 or "not run: the runner's tool record is not readable from this session — sources and strength labels are the runner's own, unchecked"}

--- Trace ---
{runner_narrative}
```

Acceptance criterion: a real research run was launched on the designated runner, its trace was returned to the main session with the source-check result or the statement that the check could not run, and, for codex, the temp files were cleaned up.

## Rules

- Research question is embedded verbatim — no paraphrasing before passing it to the runner.
- The runner is the designated one, `claude` when none is designated; the research runs in the background, so the main session is free until the completion notification arrives.
- Failure modes (Codex missing, a missing subagent or Tavily capability, network failure, Tavily unavailable, delegated-session timeout, or Tavily MCP per-call timeout) are exposed as raw errors. The skill does not mask, retry, or fall back to the other runner.
- Check results are read from the run's own tool record and presented beside the narrative; the narrative itself is forwarded unedited.
- For codex, always clean up the temp files after reading the output.
- The skill is a delegation channel only — interpretation, follow-up questions, and downstream protocol routing belong to the main session after the trace returns.
