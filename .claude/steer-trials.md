# /steer Stage 2 Trial Index (epistemic-protocols)

Project-local inventory of trials inscribed by `/steer` in this project. Lazy-loaded — read on demand. Each entry corresponds to one Approve or RouteToOperationalLayer disposition emitted by `/steer`.

## Format

Each entry records:
- **Date** — ISO 8601 date of disposition
- **Disposition** — `Approve` (rule-file write) or `RouteToOperationalLayer` (operational-layer realization)
- **Mismatch signals** (RouteToOperationalLayer only) — set of `ProgrammaticTrigger` / `LayerMixing` / `BehavioralEnforcement` (compound mismatches are common)
- **Recommended layer** (RouteToOperationalLayer only) — `Hook(event)` / `SystemPrompt` / `CI_CD` / `Settings` / `Other`
- **Realization** — concrete file paths or rule-layer locations affected
- **Origin context** — brief one-line summary of the originating audit (cluster type, evidence count, motivating session)
- **Falsification** — condition(s) that trigger re-evaluation
- **Re-evaluation** — schedule or trigger for next `/steer` re-run
- **Status** — `active` / `completed` / `retracted`

## Active Trials

### 2026-05-05 — gh-comments-convergence hook

- **Disposition**: RouteToOperationalLayer
- **Mismatch signals**: {ProgrammaticTrigger, BehavioralEnforcement} (per-turn rule prose was inadequate; deterministic detection of `fetch_comments.py` invocation needed)
- **Recommended layer**: `Hook(PostToolUse)` — Bash matcher, skill-keyed guidance with command-pattern detection
- **Realization** (layered dispatcher):
  - Guidance: `.claude/hooks/_guidances/gh-address-comments.mjs#option-set-entropy` (skill-keyed, platform-agnostic)
  - Dispatchers: `.claude/hooks/claude_dispatcher.mjs` (Claude payload), `.claude/hooks/codex_dispatcher.mjs` (Codex payload — v0.124.0+ verified)
  - Wiring: `.claude/settings.json` → `claude_dispatcher.mjs`; Codex via `~/.codex/hooks.json` or `[hooks]` in `config.toml` → `codex_dispatcher.mjs`
  - Cross-CLI scope: Claude + Codex (Tavily-verified payload divergences handled at dispatcher layer); Gemini deferred (event/matcher/response-shape divergence too large for thin dispatcher)
  - Folder overview: `.claude/hooks/README.md`
- **Origin context**: 2026-05-04~05 audit session; cross-session evidence: 22 decided `/gh-address-comments` invocations across past sessions, 59% "all" selection rate, 3 invocations with explicit "no-conflict → all" phrasing. Cluster: Emergent / non-EP skill Standing-authority pattern.
- **Falsification** (any one triggers re-evaluation):
  - post-relay user correction rate > 20% (AI's convergence assessment unreliable)
  - relay-applied finding revert within same PR cycle > 0 (AI applied what shouldn't have been applied)
  - continued Constitution gate surfacing > 50% of invocations post-installation (rule not being applied — drift)
- **Re-evaluation**: `/steer` re-run at the earlier of {1-2 months post-installation, first falsification trigger}
- **Status**: active

## Completed / Retracted Trials

(empty)
