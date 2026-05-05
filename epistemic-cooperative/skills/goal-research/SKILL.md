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

Write the research prompt to `/tmp/goal_research_${SUFFIX}.txt`:

```
Goal: Research and externally verify the target below.

Research target:
{research_question}

Workflow:
1. Use Codex's builtin `goal` command to scope this research endpoint.
2. Inside that scope, invoke `$inquire` (the Aitesis skill) to drive Tavily-based external verification searches.
3. Cite each external source used.

Report:
- Findings with cited sources
- Verification status for each factual claim
- Residual uncertainty when sources contradict or coverage is incomplete
```

Launch via `Bash(run_in_background: true, timeout: 600000)`:

```bash
codex exec --skip-git-repo-check -m gpt-5.5 --config model_reasoning_effort="high" < /tmp/goal_research_${SUFFIX}.txt
```

Sandbox flag is omitted intentionally — Tavily verification requires network access, so the read-only sandbox used by `review-ensemble` does not apply here.

## Phase 3: Collection

Wait for the background task completion notification — do not poll or sleep.

When the notification arrives:
1. Read the Codex output from the completed background task.
2. Clean up the temp prompt file:
   ```bash
   rm -f /tmp/goal_research_${SUFFIX}.txt
   ```

## Phase 4: Output

Present the full Codex output as the call trace, preceded by a one-line scope header:

```
## Goal Research Result

Target: {research_question}

--- Codex Trace ---
{codex_full_output}
```

Acceptance criterion: a real Codex session was launched, its trace was returned to the main session, and the temp file was cleaned up.

## Rules

- Research question is embedded verbatim — no paraphrasing before passing to Codex.
- Codex runs in background — main session is free until the completion notification arrives.
- Failure modes (Codex missing, network failure, Tavily unavailable, timeout) are exposed as raw errors. The skill does not mask, retry, or fall back.
- Always clean up the temp prompt file after reading the Codex output.
- The skill is a delegation channel only — interpretation, follow-up questions, and downstream protocol routing belong to the main session after the trace returns.
