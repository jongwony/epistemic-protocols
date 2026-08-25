---
name: goal-research
description: Delegate factual research to a Codex CLI session that uses Codex's builtin `goal` command and invokes Aitesis (`$inquire`) for Tavily-based external verification. User-invoked via /goal-research.
---

# Goal Research

Invoke directly with `/goal-research <research question>` when the user wants to delegate fact-finding or external verification to a Codex CLI session that pairs Codex's builtin `goal` scoping with Aitesis-driven Tavily search.

**Architecture**:
```
goal-research
├── Research question (argument or one-time prompt)
├── Codex CLI (background)
│   ├── builtin `goal` — scope the research endpoint
│   └── `$inquire` — Aitesis skill drives Tavily-based external verification
└── Trace presentation (codex output + temp-file cleanup)
```

**Why this composition**: Codex's builtin `goal` command provides a clean scoping primitive for endpoint-defined research; invoking Aitesis (`$inquire`) inside that scope routes verification through Tavily for grounded external sourcing. Running it in Codex isolates the research session from the main Claude Code conversation while still surfacing the full trace back.

## Phase 1: Argument Capture

1. If `/goal-research` is invoked with an argument, treat it as the research question verbatim.
2. If invoked without an argument, ask the user once for the research question, then proceed.

The research question is passed unchanged into the Codex prompt — paraphrasing is prohibited.

## Phase 2: Codex Launch (Background)

Check `which codex 2>/dev/null`. If Codex CLI is not found, expose the missing-binary error and stop. Failure modes are surfaced as raw errors, not handled internally.

Generate a unique suffix: `SUFFIX=$(openssl rand -hex 4)`

Write the research prompt to `/tmp/goal_research_${SUFFIX}.txt`. The prompt **must begin with `/goal`** so Codex's builtin goal-scoping engages explicitly (the `Goal:` label form also works, but the slash form makes the convention unambiguous and aligns with how `$inquire` is invoked):

```
/goal Research and externally verify the target below.

Research target:
{research_question}

Workflow:
1. The `/goal` prefix above scopes this Codex session as a research endpoint.
2. Inside that scope, invoke `$inquire` (the Aitesis skill) to drive Tavily-based external verification searches.
3. Cite each external source used.

Report:
- Findings with cited sources
- Verification status for each factual claim
- Residual uncertainty when sources contradict or coverage is incomplete
```

Launch via `Bash(run_in_background: true, timeout: 4500000)`. `--color never` + splitting the
streams (stdout to the events file, `2>` to a separate warn file) keeps stderr
warnings out of the events file. Stdout is **not** guaranteed to be pure JSONL —
codex may still print a plain notice line there (e.g. `Codex autostart is
disabled.`), so every extraction below filters to lines starting with `{` before
parsing. Select `{effort}` per run by the research question's depth and breadth, floored at `high` (never below) — a narrow, single-fact question runs at `high`, a multi-branch or deep-synthesis question at `xhigh`, and the most demanding research may escalate to `max` (the top of this model's ladder — it consumes usage limits faster, so reserve it for genuinely heavy questions):

```bash
codex exec --ephemeral --json --color never --skip-git-repo-check -m gpt-5.6-sol \
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

## Phase 3: Collection

Wait for the background task completion notification — do not poll or sleep.

When the notification arrives:
1. Extract the **final** codex `agent_message` narrative verbatim with the line below — high-reasoning codex streams progress messages first, so the line takes the last `agent_message` — and since that narrative **is** the research trace/answer (findings with cited sources, verification status, residual uncertainty), **forward it verbatim to the presentation step; do NOT regex-parse it**. **If the extraction comes back empty, codex failed before answering** (auth / timeout / crash) — read the raw events file `/tmp/goal_research_events_${SUFFIX}.jsonl` for the `turn.failed` / `error` events and surface that instead of proceeding blank.

   ```bash
   grep '^{' /tmp/goal_research_events_${SUFFIX}.jsonl \
     | jq -rs '[.[] | select(.type=="item.completed" and .item.type=="agent_message") | .item.text] | last // empty'
   ```

   The `grep '^{'` is load-bearing, not defensive tidiness: codex prints plain
   notice lines to stdout alongside the JSONL, and `jq -rs` aborts on the first
   one and returns nothing. Without the filter a **successful** run reads as the
   empty extraction the next sentence tells you to treat as a crash.

   Reasoning items appear only if codex emits them (config-gated) — do not force them on.

2. **Check that external verification actually happened before presenting anything.**
   A codex run can complete, answer fluently, and cite sources it never opened —
   the model falls back to recalled knowledge when the Tavily MCP is unavailable,
   and nothing in the narrative distinguishes that from a searched answer. Count
   the tool calls:

   ```bash
   grep '^{' /tmp/goal_research_events_${SUFFIX}.jsonl \
     | jq -rs '[.[] | select(.item.type // "" | test("tool_call|mcp")) ] | length'
   ```

   If that count is `0`, the run performed **no external searches**. Do not
   present its output as verified research. Say so in the first line of the
   report, mark every claim in it as recalled-from-training, and surface the
   warn file — an MCP that failed to start leaves its trace there, not in the
   narrative.

   Some codex warnings ride the **stderr banner**, not `agent_message` — the launch sent stderr to its own warn file. Grep that to catch what the narrative does not carry, and surface any hits alongside the trace:
   ```bash
   grep -iE 'invalid_grant|deprecat|--full-auto|warn' /tmp/goal_research_warn_${SUFFIX}.txt || true
   ```
3. Clean up the temp prompt file, the event stream, and the warn file (after the narrative is forwarded / any failure surfaced):
   ```bash
   rm -f /tmp/goal_research_${SUFFIX}.txt /tmp/goal_research_events_${SUFFIX}.jsonl /tmp/goal_research_warn_${SUFFIX}.txt
   ```

## Phase 4: Output

Present the extracted Codex `agent_message` narrative as the call trace, preceded by a one-line scope header. Use the Phase 3 jq extraction (the `agent_message` narrative) as the trace body — do not dump the raw JSONL event stream:

```
## Goal Research Result

Target: {research_question}

--- Codex Trace ---
{codex_process_narrative}
```

Acceptance criterion: a real Codex session was launched, its trace was returned to the main session, and the temp file was cleaned up.

## Rules

- Research question is embedded verbatim — no paraphrasing before passing to Codex.
- Codex runs in background — main session is free until the completion notification arrives.
- Failure modes (Codex missing, network failure, Tavily unavailable, delegated-session timeout, or Tavily MCP per-call timeout) are exposed as raw errors. The skill does not mask, retry, or fall back.
- Always clean up the temp prompt file after reading the Codex output.
- The skill is a delegation channel only — interpretation, follow-up questions, and downstream protocol routing belong to the main session after the trace returns.
