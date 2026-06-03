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

Launch via `Bash(run_in_background: true, timeout: 1000000)`:

```bash
codex exec --ephemeral --json --skip-git-repo-check -m gpt-5.5 \
  --config model_reasoning_effort="high" \
  --config mcp_servers.tavily.tool_timeout_sec=900 \
  < /tmp/goal_research_${SUFFIX}.txt
```

Sandbox flag is omitted intentionally — Tavily verification requires network access, so the read-only sandbox used by `review-ensemble` does not apply here.

The background Bash timeout controls the delegated Codex session envelope and
must exceed the Tavily MCP per-call budget. The
`mcp_servers.tavily.tool_timeout_sec=900` override controls the per-call MCP
timeout for Tavily tools inside that delegated session, allowing long-form
`tavily_research` calls to run for up to 15 minutes while still surfacing the
raw timeout error if the call exceeds that limit.

## Phase 3: Collection

Wait for the background task completion notification — do not poll or sleep.

When the notification arrives:
1. Read the Codex output from the completed background task. With `--json` the captured output is a **JSONL event stream possibly interleaved with a non-JSON stderr banner**, not free text — save it to a file (referenced as `$EVENTS_JSONL`) and extract the codex `agent_message` narrative verbatim with the line below. That narrative **is** the research trace/answer (findings with cited sources, verification status, residual uncertainty) — **forward it verbatim to the presentation step; do NOT regex-parse it**.

   ```bash
   # Codex --json → agent_message narrative, verbatim (codex-cli 0.136.0 pinned).
   # -R fromjson? skips non-JSON lines (the stderr banner interleaved into the captured stdout+stderr).
   # All agent_message items in stream order; no tail. This narrative IS the research trace/answer.
   jq -rR 'fromjson? | select(.type=="item.completed" and .item.type=="agent_message") | .item.text' "$EVENTS_JSONL"
   ```

   Reasoning items appear only if codex emits them (config-gated) — do not force them on. Failure modes still surface as raw errors: a `turn.failed` / `error` event line, or a raw stderr banner line, is preserved in `$EVENTS_JSONL` for the user to read.
2. Clean up the temp prompt file:
   ```bash
   rm -f /tmp/goal_research_${SUFFIX}.txt
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
