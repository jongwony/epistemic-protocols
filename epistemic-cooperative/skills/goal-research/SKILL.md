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
│   ├── mechanical: that pass's own outcome; then the whole run's tool record — successful Tavily calls, the URLs their JSON results list, the calls not mechanically readable
│   ├── reading: this session reads the report against those lists and the raw record, each judgment marked as its reading
│   └── goal: met → present; gaps fewer than before → continue the same run with them; otherwise, or on any failure → present
└── Presentation: source check, open items handed to the user as theirs to settle, verbatim trace
    (+ temp-directory cleanup)
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

Generate a unique suffix for this run, `SUFFIX=$(openssl rand -hex 4)`, and create its temp directory, `mkdir -p /tmp/goal_research_${SUFFIX}`. Every file this skill writes lives there. The run proceeds in **passes**: the launch is pass `0`, and each later turn of the same run — a goal turn where the host's reference sends one, then each continuation in Phase 3 — is the next pass. Shell state does not persist between separate command calls, so substitute `${SUFFIX}`, the current `${PASS}`, and every other value generated here literally into each later block.

### Research brief

**Goal condition**, the same sentence on every route, and the one this session judges each pass against in Phase 3:

> Every uncertainty this session's research target turns on is either filled by a citation to a source this session's Tavily calls returned, or returned open with its reach — the person's marked as theirs.

Every runner receives this brief, written to `/tmp/goal_research_${SUFFIX}/brief.txt`, with `{inquire}` set to `/inquire` for `claude` and `$inquire` for `codex`, and `{goal}` set to `/goal ` followed by the goal condition for `codex` and to `Goal: ` followed by it for `claude` — on a Claude route the goal command, where it is used at all, is sent apart from the brief and after it, as the host's reference says:

```
{goal}

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

The host is the environment driving this skill, not another user choice; `claude` stays the default on every host. Read only that host's reference, here, before determining availability; it carries the launch, each pass's outcome, where the run's record is, and how the same run is continued:

| Host | `claude` runner | Reference |
|---|---|---|
| Claude Code | A background subagent | [Claude Code](references/host-claude-code.md) |
| Codex | A background `claude -p` process | [Codex](references/host-codex.md) |

Other hosts may supply the same capability: a background Claude run with its own context, whose tool calls are recorded where this session can read them, and which this session can continue. Before launch, confirm that Tavily search and Tavily extract are available to that run; where either is missing, surface the missing capability and stop. The run receives the brief as its whole task, not this conversation's history. Wait for the host's completion notification — do not poll.

### Runner: codex

Check `which codex 2>/dev/null`. If Codex CLI is not found, expose the missing-binary error and stop. Failure modes are surfaced as raw errors, not handled internally.

The brief's `/goal` first line engages Codex's builtin goal command explicitly (the `Goal:` label form also works, but the slash form makes the convention unambiguous and aligns with how `$inquire` is invoked).

Launch pass `0` through the host's background execution facility, with a 75-minute envelope (on Claude Code, the binding is in [Claude Code](references/host-claude-code.md)). `--color never` + splitting the
streams (stdout to the pass's events file, `2>` to its warn file) keeps stderr
warnings out of the events file. Stdout is **not** guaranteed to be pure JSONL —
codex may still print a plain notice line there (e.g. `Codex autostart is
disabled.`), so every extraction below filters to lines starting with `{` before
parsing. The status file keeps the pass's exit code after the launching shell ends. Select `{effort}` per run by the research question's depth and breadth, floored at `high` (never below) — a narrow, single-fact question runs at `high`, a multi-branch or deep-synthesis question at `xhigh`, and the most demanding research may escalate to `max` (the top of this model's ladder — it consumes usage limits faster, so reserve it for genuinely heavy questions):

```bash
codex exec --json --color never --skip-git-repo-check -m gpt-6-astra \
  --config model_reasoning_effort="{effort}" \
  < /tmp/goal_research_${SUFFIX}/brief.txt \
  > /tmp/goal_research_${SUFFIX}/p${PASS}.events.jsonl 2> /tmp/goal_research_${SUFFIX}/p${PASS}.warn.txt
printf '%s\n' "$?" > /tmp/goal_research_${SUFFIX}/p${PASS}.status
```

The launch persists its session so Phase 3 can continue the same one; `--ephemeral` would leave nothing to resume. The session therefore stays in Codex's own session store (under `~/.codex/sessions/`, named by its thread id) after this skill finishes; removing it is the user's call, not this skill's.

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

Wait for the background task completion notification — do not poll or sleep. Steps 1–4 run after every pass, from the pass the host's reference names where it sends a goal turn after the launch. Each pass's outcome is read from that pass alone first; only a pass that returned is read further, over the whole run so far.

### 1. The pass outcome

A pass **returned** only on positive evidence of success: its own exit status or host completion signal reports success, its own terminal event is a success, and its own final message carries a non-empty report that is not an error or aborted message; otherwise it **failed**. A failed pass is surfaced as a raw error — its status, its terminal or error events, its warn file — and ends the loop; an earlier pass's report is never taken in its place. A returned pass's report is written to its own `/tmp/goal_research_${SUFFIX}/p${PASS}.report.txt`; the reports together **are** the research trace/answer, **forwarded verbatim to the presentation step; do NOT regex-parse them** — nothing below rewrites them.

- **claude**: as the host's reference says.
- **codex**: the pass's `turn.completed` with no `turn.failed`, and its last `agent_message` — high-reasoning codex streams progress messages first, so the extraction takes the last one.

  ```bash
  D=/tmp/goal_research_${SUFFIX}; P=$D/p${PASS}
  grep '^{' "$P.events.jsonl" > "$P.json.jsonl"
  if [ "$(cat "$P.status" 2>/dev/null)" = 0 ] \
    && jq -se 'any(.[]; .type == "turn.completed") and all(.[]; .type != "turn.failed")' "$P.json.jsonl" > /dev/null \
    && jq -rs '[.[] | select(.type=="item.completed" and .item.type=="agent_message") | .item.text] | last // empty' \
         "$P.json.jsonl" > "$P.report.txt" \
    && grep -q '[^[:space:]]' "$P.report.txt"
  then echo "pass ${PASS}: returned"
  else : > "$P.report.txt"; echo "pass ${PASS}: failed"
  fi
  ```

  The `grep '^{'` is load-bearing, not defensive tidiness: codex prints plain
  notice lines to stdout alongside the JSONL, and `jq -rs` aborts on the first
  one and returns nothing. Without the filter a **successful** pass reads as
  failed.

  Reasoning items appear only if codex emits them (config-gated) — do not force them on.

Once a pass's outcome is read, assemble the trace from every returned pass's report, in pass order, each headed by its pass number — pass `0`'s full report first. A later pass's report — a goal turn's restatement, or a continuation that answers only the gaps — is added after the earlier ones, never in their place:

```bash
D=/tmp/goal_research_${SUFFIX}
: > "$D/trace.txt"
for k in $(ls "$D" | sed -n 's/^p\([0-9][0-9]*\)\.report\.txt$/\1/p' | sort -n); do
  if grep -q '[^[:space:]]' "$D/p$k.report.txt"; then
    printf '## Pass %s\n\n%s\n\n' "$k" "$(cat "$D/p$k.report.txt")" >> "$D/trace.txt"
  fi
done
```

### 2. The tool record

The machine reads the run's own record of its tool calls, never the run's description of them, and only what is unambiguous there; where it cannot read something, it says so rather than guessing.

- **A successful Tavily call** completed without error and is named exactly as Tavily's search or extract tool — `tavily_search`, `tavily-search`, `tavily_extract`, or `tavily-extract`, after any server prefix the host adds. Other Tavily tools (research, crawl, map) and every other tool are not counted.
- **What it returned** is read only from a JSON response carrying a `results` array: each entry's `url`, listed verbatim. An extract call's listed URLs are what it extracted; its failed URLs are not in `results`. What a call asked for — its arguments, a URL inside a query — is never read.
- **Not mechanically readable**: a successful call whose response is not JSON with a `results` array — formatted text, an error body, a truncated or stubbed result. It lists nothing; it is counted and named by call id, and this session reads its raw record in step 3.

The whole run's record is written to `/tmp/goal_research_${SUFFIX}/record.jsonl`, with the exit status of writing it in `record.status` beside it. Where the passes were written to per-pass event files — the `codex` runner, and `claude -p` — the record is their filtered events together:

```bash
D=/tmp/goal_research_${SUFFIX}
cat "$D"/p*.json.jsonl > "$D/record.jsonl"
printf '%s\n' "$?" > "$D/record.status"
```

Where the host keeps the record itself, its reference gives the block that writes these two files. The record reduces to one line per successful Tavily call, kept once by its call id however often the record repeats it, `{"id", "tool", "readable", "urls"}`, in `calls.jsonl`, with the reduction's exit status in `reduce.status`; a record that is missing, failed to write, or holds a line that does not parse fails the reduction. There are two record shapes, each with one reduction:

- **Codex events** (the `codex` runner): each Tavily call is an `mcp_tool_call` item with its `tool`, `status`, `error`, and `result`; the response is the result's `structured_content` or the JSON text inside its `content[].text`.

  ```bash
  D=/tmp/goal_research_${SUFFIX}
  [ "$(cat "$D/record.status" 2>/dev/null)" = 0 ] && jq -cs '
    [ .[] | select(.type=="item.completed" and .item.type=="mcp_tool_call" and .item.status=="completed" and .item.error==null
             and (.item.tool // "" | test("^tavily(_|-)(search|extract)$")))
      | (.item.result // {}) as $r
      | ([$r.structured_content?, ($r.content[]? | select(.type=="text") | .text | try fromjson catch empty)]
         | map(select(type == "object" and (.results | type) == "array"))) as $json
      | {id: .item.id, tool: .item.tool, readable: ($json | length > 0),
         urls: ([$json[] | .results[] | .url? | strings] | unique)} ]
    | unique_by(.id) | .[]' \
    "$D/record.jsonl" > "$D/calls.jsonl"
  printf '%s\n' "$?" > "$D/reduce.status"
  ```

- **Claude message record** (the `claude` runner, on any host): assistant entries carry `{type: "tool_use", id, name}` items and user entries carry `{type: "tool_result", tool_use_id, is_error, content}` items; a call is the pair joined by id, and a `tool_use` with no result did not complete.

  ```bash
  D=/tmp/goal_research_${SUFFIX}
  [ "$(cat "$D/record.status" 2>/dev/null)" = 0 ] && jq -cs '
    ([.[] | select(.type=="assistant") | .message.content[]? | select(.type=="tool_use") | {key: .id, value: .name}] | from_entries) as $names
    | [ .[] | select(.type=="user") | .message.content[]? | select(.type=="tool_result" and .is_error != true)
        | ($names[.tool_use_id] // "" | split("__") | last) as $tool
        | select($tool | test("^tavily(_|-)(search|extract)$"))
        | ([.content | if type=="string" then . else (.[]? | select(.type=="text") | .text) end | try fromjson catch empty]
           | map(select(type == "object" and (.results | type) == "array"))) as $json
        | {id: .tool_use_id, tool: $tool, readable: ($json | length > 0),
           urls: ([$json[] | .results[] | .url? | strings] | unique)} ]
    | unique_by(.id) | .[]
  ' "$D/record.jsonl" > "$D/calls.jsonl"
  printf '%s\n' "$?" > "$D/reduce.status"
  ```

Where the host offers no readable record of a `claude` run, nothing below is mechanical: the Source Check says the record was not readable, and every source and strength label stands as the runner reported it, unchecked.

The record is the Tavily route the brief directs. A page the run fetched another way — a host's built-in web search, a shell `curl` — is outside it, so "not found in this run's Tavily record" never means that no tool touched the URL.

Then list what the record holds — only once the reduction has succeeded:

```bash
D=/tmp/goal_research_${SUFFIX}; C=$D/calls.jsonl
if [ "$(cat "$D/reduce.status" 2>/dev/null)" != 0 ]; then
  echo 'reduction failed: the checks have not run'
else
  echo "successful Tavily calls: $(jq -s 'length' "$C")"
  echo "not mechanically readable: $(jq -s '[.[] | select(.readable | not)] | length' "$C")"
  jq -r 'select(.readable | not) | "  call " + .id + " (" + .tool + ")"' "$C"
  echo '--- returned ---'
  jq -r '.urls[]' "$C" | LC_ALL=C sort -u
  echo '--- extracted ---'
  jq -r 'select(.tool | test("extract")) | .urls[]' "$C" | LC_ALL=C sort -u
fi
```

**Reduction failed.** No count is reported; the Source Check says the reduction failed and the checks have not run, and the loop ends.

**Zero-call.** If the successful Tavily call count is `0`, the run has **no successful Tavily call**: nothing in the trace was retrieved through the designated route, and its claims stand as the runner's own, open, unchecked. The Source Check says so first, as a statement covering the whole trace below it, and the trace itself stays unedited; the loop ends. For codex, surface the warn files as well — an MCP that failed to start leaves its trace there, not in the narrative.

### 3. Reading the report

Read the trace, every returned pass's report, against the `returned` and `extracted` lists — and, for each call not mechanically readable, against that call's raw record — and judge each citation: **returned by this run**, **extracted by this run**, or **not found in this run's Tavily record**. A citation whose claim is labelled `verified` and whose source this run did not extract is read the same way and said so. Whatever rests on a citation not found in the record is the runner's own inference and open, whatever label it carries.

Read it against the brief's form as well, and note what it is missing: a factual claim with no citation; an absence or novelty claim with no reach record behind it; an empirical effect with no replication or retraction status; a detail that reads as recalled — a volume, page, date, or number no returned source gave — not marked reconstructed. No line format is required of the runner.

Every judgment in this step is this session's reading, marked as such where it is shown, not a mechanical result.

### 4. The goal

Judge the pass against the goal condition, using the lists and the reading. Its **gaps** are the citations not found in this run's Tavily record, the `verified` labels on sources not extracted, and the uncertainties neither filled by a citation nor returned open with their reach. An item that is the person's to settle is never a gap; it goes to the user.

Only research gaps drive a continuation. A failed pass, a reduction failure, or a run with no successful Tavily call has already ended the loop in steps 1–2, and is surfaced rather than continued.

Record the pass's gap count — the number is this session's reading; the decision on it is mechanical. The first count recorded is the first evaluated pass, whichever pass number the route starts evaluating at: it continues on any gap, and every later pass continues only on fewer gaps than the pass before it:

```bash
D=/tmp/goal_research_${SUFFIX}
printf '%s %s\n' "${PASS}" "{gap count}" >> "$D/gaps.txt"
awk 'NR > 1 { prev = n } { n = $2 }
     END { if (n == 0) print "stop: goal met"
           else if (NR == 1 || n < prev) print "continue"
           else print "stop: no progress" }' "$D/gaps.txt"
```

- **stop: goal met**: the condition is met; go to Phase 4.
- **continue**: continue the **same** run — not a new one — as the next pass, through the runner's continuation (codex below; claude in the host's reference), sending this message, written to `/tmp/goal_research_${SUFFIX}/continue.txt`:

  ```
  The goal condition is not met yet. Continue toward it in this same session, then return the whole report again, updated.
  Gaps found in your report and this session's Tavily record:
  - {each gap}
  ```

- **stop: no progress**: the loop ends, and Phase 4 shows the gaps that remain.

Because a continuation is sent only while the gap count strictly falls, the loop ends.

**Codex continuation.** The thread id is in the launch's `thread.started` event. Continue it as pass `${PASS}` through the host's background execution facility, with the same envelope. `codex exec resume` takes no `--color` option; its stdout is filtered by `grep '^{'` like the launch's:

```bash
codex exec resume "{thread_id}" - --json --skip-git-repo-check -m gpt-6-astra \
  --config model_reasoning_effort="{effort}" \
  < /tmp/goal_research_${SUFFIX}/continue.txt \
  > /tmp/goal_research_${SUFFIX}/p${PASS}.events.jsonl 2> /tmp/goal_research_${SUFFIX}/p${PASS}.warn.txt
printf '%s\n' "$?" > /tmp/goal_research_${SUFFIX}/p${PASS}.status
```

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

Present the source check first, then the items the run returned as the user's to settle, then the trace — every returned pass's report verbatim, in pass order, each headed by its pass number — so a statement that the run had no successful Tavily call, that a pass or the reduction failed, or that its record could not be read, is the first thing the user reads. The items to settle are lifted from the trace into their own block, each with what it needs, and presented to the user as theirs to settle; neither the runner nor the main session answers or settles them, and work that rests on one waits for the user's words. Use the assembled trace as the trace body — do not dump the raw event stream or tool record:

```
## Goal Research Result

Target: {research_question}
Runner: {claude | codex}
Goal: {engaged | not engaged, where the route's record shows it — `claude -p`; otherwise "not confirmed on this route" — codex, Claude Code}
Passes: {n}, gaps from the first evaluated pass: {as recorded in gaps.txt} — stopped: {goal met | no progress | a pass failed | reduction failed | no successful Tavily call}

--- Source Check ---
{"no successful Tavily call — nothing in the trace below was retrieved through the designated route; its claims stand as the runner's own, open, unchecked";
 or "pass {k} failed" with its raw error;
 or "the reduction of the run's record failed; the checks have not run";
 or "the run's tool record is not readable from this session — sources and strength labels are the runner's own, unchecked";
 or the record: {n} successful Tavily calls, {m} not mechanically readable;
 then, as this session's reading: each citation not found in this run's Tavily record, each `verified` label on a source this run did not extract, what the report form is missing, and, where the loop ended without meeting the goal, the gaps that remain — or "this session's reading found every citation in the record and nothing missing"}

--- Yours to Settle ---
{each item the run returned as the user's, with what it needs; or "none returned"}

--- Trace ---
{every returned pass's report in pass order, each headed "Pass k", pass 0's full report first; or "no pass returned a report"}
```

Acceptance criterion: a real research run was launched on the designated runner; each pass's outcome was read from that pass; each returned pass was judged against the goal condition and continued only while its gaps fell; the result was presented with the source check, the items the run returned as the user's presented as theirs to settle, and this skill's temp directory removed.

## Rules

- Research question is embedded verbatim — no paraphrasing before passing it to the runner.
- The runner is the designated one, `claude` when none is designated; the research runs in the background, so the main session is free until the completion notification arrives.
- Failure modes (Codex or the `claude` CLI missing, a missing Claude run or Tavily capability, network failure, Tavily unavailable, delegated-session timeout, or Tavily MCP per-call timeout) are exposed as raw errors. The skill does not mask, retry, or fall back to the other runner; continuation answers only research gaps in a pass that returned.
- The machine reads the run's tool record and only what is unambiguous there; citations are read against it by this session, each judgment marked as its reading; the report itself is forwarded unedited.
- Remove only this skill's temp directory; a session kept in a CLI's own store is the user's to remove.
- The skill is a delegation channel only — interpretation, follow-up questions, and downstream protocol routing belong to the main session after the trace returns. What the run returns as the user's to settle reaches the user as theirs, as Phase 4 presents it.
