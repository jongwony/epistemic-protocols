# /steer Stage 2 Trial Index (epistemic-protocols)

Project-local inventory of trials inscribed by `/steer` in this project. Lazy-loaded — read on demand. Each entry corresponds to one Approve or RouteToOperationalLayer disposition emitted by `/steer`.

## Format

Each entry records:
- **Date** — ISO 8601 date of disposition
- **Disposition** — `Approve` (rule-file write) or `RouteToOperationalLayer` (operational-layer realization)
- **Mismatch signals** — set of `ProgrammaticTrigger` / `LayerMixing` / `BehavioralEnforcement` (compound mismatches are common). Empty set for Approve; non-empty for RouteToOperationalLayer.
- **Recommended layer** (RouteToOperationalLayer only) — `Hook(event)` / `SystemPrompt` / `CI_CD` / `Settings` / `Other`
- **Realization** — concrete file paths or rule-layer locations affected
- **Origin context** — brief one-line summary of the originating audit (cluster type, evidence count, motivating session)
- **Falsification** — condition(s) that trigger re-evaluation
- **Reevaluation** — schedule or trigger for next `/steer` re-run
- **Status** — `active` / `completed` / `retracted`

## Active Trials

### 2026-05-07 — Inscription-decision posture (Hermeneutic Circle)

- **Disposition**: Approve
- **Mismatch signals**: {} (Phase 4 fit-shape clean — narrative addition to Calibration Result section; no ProgrammaticTrigger / LayerMixing / BehavioralEnforcement)
- **Recommended layer**: null
- **Realization**:
  - `.claude/rules/project-profile.md` — Inscription-decision posture clause added to Calibration Result section (between Bounded zone and Stage 1 conjecture); narrative extension, no new variable.
  - `epistemic-cooperative/skills/steer/SKILL.md` — Phase 3 + Phase 5 prose augmentation (AI verdict-proposal mandate before each Constitution gate) + Rule 8 refinement.
  - `epistemic-cooperative/.claude-plugin/plugin.json` — 2.12.0 → 2.13.0 minor bump.
- **Origin context**: Session 8f568beb — Aitesis convergence over session 4d76d47b rule-citation analysis (Synthesis = coproduct mutation correction) + Euporia cycle 1 axis dismiss/defer-open + user articulation of "preserve correct rules + correct via appropriate abstraction axis + leave rule-overlap open". Cluster: Emergent (inscription-decision meta-default; not directly located in any of the six profile variables).
- **Falsification** (any one triggers re-evaluation):
  - Drift recurs across N≥3 sessions with same posture pattern → axis promotion candidate (Stage 2 variation-stable retention threshold; narrative extension → seventh variable promotion review).
  - Inscription-avoidance leads to derivation failure rate > 20% (posture is over-restrictive).
  - An inscription violating the posture demonstrably yields better outcome (empirical refutation, not principle-internal rebuttal).
- **Reevaluation**: next `/steer` invocation against fresh session, or upon falsification trigger.
- **N=1 scope caveat**: AI verdict-proposal mandate (Phase 3/5) inscribed in Steer SKILL.md only; structurally homologous Misuse Phase 4 gate left untouched pending paired-evidence accumulation per Steer Rule 15. Propagation to Misuse deferred until Stage 2 retention evidence corroborates the proposal-mandate pattern.
- **Status**: active

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
- **Reevaluation**: `/steer` re-run at the earlier of {1-2 months post-installation, first falsification trigger}
- **Status**: active

## Completed / Retracted Trials

(empty)
