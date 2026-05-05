# /steer Stage 2 Trial Index (epistemic-protocols)

Project-local inventory of trials inscribed by `/steer` in this project. Lazy-loaded — read on demand. Each entry corresponds to one Approve or RouteToOperationalLayer disposition emitted by `/steer`.

## Format

Each entry records:
- **Date** — ISO 8601 date of disposition
- **Disposition** — `Approve` (rule-file write) or `RouteToOperationalLayer` (operational-layer realization)
- **Mismatch signal** (RouteToOperationalLayer only) — `ProgrammaticTrigger` / `LayerMixing` / `BehavioralEnforcement`
- **Recommended layer** (RouteToOperationalLayer only) — `Hook(event)` / `SystemPrompt` / `CI_CD` / `Settings` / `Other`
- **Realization** — concrete file paths or rule-layer locations affected
- **Origin context** — brief one-line summary of the originating audit (cluster type, evidence count, motivating session)
- **Falsification** — condition(s) that trigger re-evaluation
- **Re-evaluation** — schedule or trigger for next `/steer` re-run
- **Status** — `active` / `completed` / `retracted`

## Active Trials

### 2026-05-05 — gh-comments-convergence hook

- **Disposition**: RouteToOperationalLayer
- **Mismatch signal**: ProgrammaticTrigger + BehavioralEnforcement (per-turn rule prose was inadequate; deterministic detection of `fetch_comments.py` invocation needed)
- **Recommended layer**: `Hook(PostToolUse)` — Bash matcher, fetch_comments.py command detection
- **Realization**:
  - Script: `.claude/hooks/gh-comments-convergence.mjs` (cross-CLI mjs; Node stdlib only)
  - Wiring: `.claude/settings.json` (Claude Code PostToolUse Bash matcher)
  - Cross-CLI: install instructions in script header comment (Codex CLI v0.124.0+, Gemini CLI, etc.)
- **Origin context**: 2026-05-04~05 audit session; cross-session evidence: 22 decided `/gh-address-comments` invocations across past sessions, 59% "all" selection rate, 3 invocations with explicit "no-conflict → all" phrasing. Cluster: Emergent / non-EP skill Standing-authority pattern.
- **Falsification** (any one triggers re-evaluation):
  - post-relay user correction rate > 20% (AI's convergence assessment unreliable)
  - relay-applied finding revert within same PR cycle > 0 (AI applied what shouldn't have been applied)
  - continued Constitution gate surfacing > 50% of invocations post-installation (rule not being applied — drift)
- **Re-evaluation**: `/steer` re-run at the earlier of {1-2 months post-installation, first falsification trigger}
- **Status**: active

## Completed / Retracted Trials

(empty)
