---
name: goal-research
description: Delegate factual research to a background Claude or Codex run that verifies via Aitesis and Tavily, then check its citations against what its Tavily calls returned. User-invoked via /goal-research.
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
│   ├── zero-call: did any Tavily call succeed
│   ├── cited ⊆ returned: every cited URL is a source a successful Tavily result returned
│   └── verified ⊆ extracted: each `verified` claim has a source an extract returned
└── Presentation: open items handed to the user as theirs to settle, check results, verbatim trace
    (+ temp-file cleanup)
```

**Why this composition**: `/inquire` carries the epistemic contract — its reading of each uncertainty, its record of what collection reached, and what stays open for the person to settle. goal-research refines that contract for the research domain and for a background run; it adds no second reading beside it. Running the research in its own context isolates it from the main conversation while still surfacing the full trace back. A research run can complete, answer fluently, and cite sources it never opened — the model falls back to recalled knowledge, and nothing in the narrative distinguishes that from a searched answer. So the run's report is checked against the run's own tool record, and the run's own account of what it searched or opened is treated as part of the report under check, never as the check.

## Caller Signature

```
/goal-research [runner?] <research question>

runner : claude | codex        (claude when none is designated)
```

Read the runner designation from the request's words as well as its arguments: a leading `claude` or `codex` argument, or the request's wording outside the research question. Nothing inside the research question is removed or read as a designation. Where wording could be either — a runner named in what may be part of the question — ask once which it is. With no designation, the runner is `claude`.

| Runner | Route | Precondition |
|---|---|---|
| `claude` | A background subagent with its own context, running `/inquire` with Tavily search and extract | The host can start a background subagent whose tools include Tavily search and Tavily extract, and the `/inquire` skill |
| `codex` | A background `codex exec` session, `/goal`-scoped, running `$inquire` with Tavily | `codex` on PATH; Tavily is reached through Codex's own MCP configuration, and its absence surfaces at the zero-call check |

Record the runner actually used. A precondition found missing before launch is surfaced with the missing capability, and the skill stops there.

## Phase 1: Argument Capture

1. If `/goal-research` is invoked with an argument, the research question is that argument after any leading runner argument, carried verbatim — nothing is removed from inside it.
2. If invoked without a research question, ask the user once for it, then proceed.

The research question is passed unchanged into the research brief — paraphrasing is prohibited.

## Phase 2: Launch (Background)

Generate a unique suffix for this run's temp files: `SUFFIX=$(openssl rand -hex 4)`

### Research brief

Both runners receive this brief, with `{inquire}` set to `/inquire` for `claude` and `$inquire` for `codex`:

```
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

Start a background subagent with its own context and the brief as its whole task. It receives the brief, not this conversation's history. Wait for the host's completion notification — do not poll.

### Runner: codex

Check `which codex 2>/dev/null`. If Codex CLI is not found, expose the missing-binary error and stop. Failure modes are surfaced as raw errors, not handled internally.

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

The runner's final report **is** the research trace/answer — **forward it verbatim to the presentation step; do NOT regex-parse it**. The checks below sit beside it and never rewrite it. Write it to `/tmp/goal_research_report_${SUFFIX}.txt`, which the checks read.

- **claude**: the subagent's final message. If it is empty or the subagent failed, surface what returned instead of proceeding blank.
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

The checks read the run's own record of its tool calls, never the run's description of them. From that record they keep only the **successful Tavily calls**: a Tavily search or extract call that completed without error — a call that only started, failed, or carries an error does not count. From each one they read its **source records**: the `results[]` entries of the Tavily response, each naming its `url`. What a call asked for (its arguments, a URL inside a query) is never evidence, and neither is a link inside a returned page or an extract's `failed_results`.

The record is reduced to one line per successful Tavily call, `{"tool": <tool name>, "records": [<parsed Tavily response>, …]}`, in `/tmp/goal_research_calls_${SUFFIX}.jsonl`:

- **codex**: the filtered events. Each Tavily call is an `mcp_tool_call` item with its `server`, `tool`, `status`, `error`, and `result`; the Tavily response is the result's `structured_content`, or the JSON text inside its `content[].text`.

  ```bash
  jq -c 'select(.type=="item.completed" and .item.type=="mcp_tool_call" and .item.status=="completed" and .item.error==null
           and ((.item.server // "") + " " + (.item.tool // "") | test("tavily"; "i"))
           and (.item.tool // "" | test("search|extract"; "i")))
         | {tool: .item.tool,
            records: [.item.result | (.structured_content?, (.content[]? | select(.type=="text") | .text | try fromjson catch empty)) | objects]}' \
    /tmp/goal_research_json_${SUFFIX}.jsonl > /tmp/goal_research_calls_${SUFFIX}.jsonl
  ```

- **claude**: the subagent's own tool-call record, where the host makes it readable from this session. On Claude Code it is; read [Claude Code record](references/host-claude-code.md) here for where it is and the reduction that writes the same calls file. Where no readable record exists, the checks in step 3 have not run: the Source Check says so, and every source and strength label stands as the runner reported it, unchecked. A subagent's statement of what it searched or opened does not substitute for the record.

The record these checks read is the Tavily route the brief directs. A page the run fetched another way — a host's built-in web search, a shell `curl` — is outside it, so a flag below means "no successful Tavily result of this run returned it", not that no tool ever touched the URL.

### 3. Checks

One script reads the calls file and the report, and prints the successful Tavily call count, the cited URLs no successful Tavily result returned, and the extracted URLs. Cited, returned, and extracted URLs pass through the same normalization: fragment, trailing punctuation, and trailing slash dropped; scheme and host lowercased.

```bash
C=/tmp/goal_research_calls_${SUFFIX}.jsonl
R=/tmp/goal_research_report_${SUFFIX}.txt
urls() {
  grep -oE 'https?://[^]["(){}<>`[:space:]\\]+' | awk '{
    sub(/#.*/, ""); sub(/[.,;:!?*_'\'']+$/, ""); sub(/\/$/, "")
    i = index($0, "://"); rest = substr($0, i + 3); j = index(rest, "/"); if (j == 0) j = length(rest) + 1
    print tolower(substr($0, 1, i + 2 + j - 1)) substr(rest, j)
  }' | sort -u
}
echo "successful Tavily calls: $(jq -s 'length' "$C")"
echo '--- cited, not opened in this run ---'
comm -23 <(urls < "$R") <(jq -r '.records[].results[]?.url? | strings' "$C" | urls)
echo '--- extracted ---'
jq -r 'select(.tool | test("extract"; "i")) | .records[].results[]?.url? | strings' "$C" | urls
```

**Zero-call.** If the successful Tavily call count is `0`, the run has **no successful Tavily call**: nothing it says was retrieved through the designated route. Do not present its output as verified research. The Source Check says so first, as a statement covering the whole trace below it — every claim there is recalled-from-training, the runner's own inference, open, none of it filled by a citation — and the trace itself stays unedited. For codex, surface the warn file as well — an MCP that failed to start leaves its trace there, not in the narrative.

**Cited-source check.** Each URL under `cited, not opened in this run` is flagged, per URL, as `not opened in this run`: no successful Tavily result of this run returned it, so what rests on it is the runner's own inference and open, whatever label it carries. Then read the report's `verified` claims: one whose sources all lie outside `extracted` is flagged `verified, but not extracted` — at most a snippet supported it.

An exact-match miss can come from a URL variant (a redirect, a tracking parameter) rather than a citation from memory; the flag names the URL so the user can tell which.

### 4. Codex warnings

Some codex warnings ride the **stderr banner**, not `agent_message` — the launch sent stderr to its own warn file. Grep that to catch what the narrative does not carry, and surface any hits alongside the trace:

```bash
grep -iE 'invalid_grant|deprecat|--full-auto|warn' /tmp/goal_research_warn_${SUFFIX}.txt || true
```

### 5. Cleanup

After the narrative is forwarded, any failure surfaced, and the checks have run, remove this run's temp files (for claude, only the report and calls files exist):

```bash
rm -f /tmp/goal_research_${SUFFIX}.txt /tmp/goal_research_events_${SUFFIX}.jsonl /tmp/goal_research_warn_${SUFFIX}.txt \
  /tmp/goal_research_json_${SUFFIX}.jsonl /tmp/goal_research_report_${SUFFIX}.txt /tmp/goal_research_calls_${SUFFIX}.jsonl
```

## Phase 4: Output

Present the items the run returned as the user's to settle, then the check results, then the runner's narrative verbatim as the trace. Those items are lifted from the narrative into their own block, each with what it needs, and presented to the user as theirs to settle; neither the runner nor the main session answers or settles them, and work that rests on one waits for the user's words. Use the Phase 3 narrative as the trace body — do not dump the raw event stream or tool record:

```
## Goal Research Result

Target: {research_question}
Runner: {claude | codex}

--- Yours to Settle ---
{each item the run returned as the user's, with what it needs; or "none returned"}

--- Source Check ---
{"no successful Tavily call — every claim in the trace below is recalled-from-training, the runner's own inference, open";
 or cited URLs no successful Tavily result of this run returned, each listed as `not opened in this run`, and verified claims none of whose sources an extract returned, each listed as `verified, but not extracted`;
 or "every cited URL was returned by a successful Tavily result of this run";
 or "not run: the runner's tool record is not readable from this session — sources and strength labels are the runner's own, unchecked"}

--- Trace ---
{runner_narrative}
```

Acceptance criterion: a real research run was launched on the designated runner, its trace was returned to the main session with the source-check result or the statement that the check could not run, the items it returned as the user's were presented as theirs to settle, and the temp files were cleaned up.

## Rules

- Research question is embedded verbatim — no paraphrasing before passing it to the runner.
- The runner is the designated one, `claude` when none is designated; the research runs in the background, so the main session is free until the completion notification arrives.
- Failure modes (Codex missing, a missing subagent or Tavily capability, network failure, Tavily unavailable, delegated-session timeout, or Tavily MCP per-call timeout) are exposed as raw errors. The skill does not mask, retry, or fall back to the other runner.
- Check results are read from the run's own tool record and presented beside the narrative; the narrative itself is forwarded unedited.
- Always clean up this run's temp files after the checks have run.
- The skill is a delegation channel only — interpretation, follow-up questions, and downstream protocol routing belong to the main session after the trace returns. What the run returns as the user's to settle reaches the user as theirs, as Phase 4 presents it.
