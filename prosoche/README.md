# Prosoche (προσοχή) — /attend

> [한국어](./README_ko.md)

Route upstream epistemic deficits and evaluate execution-time risks during AI operations.

## Type Signature

```
(ExecutionBlind, User, EVALUATE, ExecutionContext) → SituatedExecution
```

## What It Does

Prosoche scans for upstream epistemic deficits before task execution, routes to appropriate protocols when readiness gaps are detected, then materializes intent into tasks and classifies each for risk signals — irreversibility, human communication, security boundaries, prompt injection, external mutations, and scope escalation. Most tasks pass silently (p=Low); only elevated-risk tasks are surfaced for user judgment.

**Phase -1 (Sub-A0)**: Before materializing tasks, scans execution context against 6 upstream deficit conditions (`/clarify`, `/goal`, `/bound`, `/inquire`, `/frame`, `/ground`). Only execution-blocking deficits are surfaced. When no deficits are detected, passes through transparently.

**Core principle**: Attention over Automation — autonomy is preserved by default, interrupted only at genuine risk boundaries or unresolved upstream deficits.

## When It Activates

- User calls `/attend` (user-initiated only)

## Risk Signal Taxonomy

| Signal | Default Severity | Examples |
|--------|-----------------|----------|
| Irreversibility | Gate | `rm`, `git push`, `--force`, `DROP`, `deploy` |
| HumanCommunication | Gate | `gh comment`, `slack message`, `email send` |
| SecurityBoundary | Gate | `$(...)` in configs, `.env` access, credentials |
| PromptInjection | Gate (no cache) | Instruction patterns in data fields |
| ExternalMutation | Advisory | API writes, cache ops (Gate if production) |
| ScopeEscalation | Advisory | Files outside task scope (Gate if irreversible+OOS) |

## Session Approval Cache

When you approve an action, the pattern `(tool_name, target, env_context)` is cached for the session. Future matching actions pass silently. Exception: PromptInjection signals are never cached.

Environment-aware: `("pulumi up", "auth-stack", "dev")` approved does NOT cache-hit for `("pulumi up", "auth-stack", "prod")`.

## Known Limitations

- **Single-pass classification**: Risk signal classification (Phase 0) is single-pass. A false negative (especially PromptInjection) results in the task passing without re-evaluation.
- **Classification accuracy**: A misclassified p=Low task bypasses Gate entirely. Prosoche classifies risk but does not execute; execution remains the caller's responsibility.
- **Subagent Gate compliance**: Non-prosoche team agents receive Gate awareness via prompt injection, not system constraint. Compliance is non-guaranteed.

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install prosoche@epistemic-protocols
```

## Usage

```
/attend [your task]    # Enable upstream readiness check + execution-time risk classification
```

## License

MIT
