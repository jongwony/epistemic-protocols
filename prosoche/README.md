# Prosoche (προσοχή) — /attend

> [한국어](./README_ko.md)

Evaluate execution-time risks during AI operations through continuous risk assessment.

## Type Signature

```
(ExecutionBlind, AI-guided, EVALUATE, ExecutionAction) → SituatedExecution
```

## What It Does

Prosoche continuously monitors pending AI actions for risk signals — irreversibility, human communication, security boundaries, prompt injection, external mutations, and scope escalation. Most actions pass silently (p=Low); only elevated-risk actions are surfaced for user judgment.

**Core principle**: Attention over Automation — autonomy is preserved by default, interrupted only at genuine risk boundaries.

## When It Activates

- User calls `/attend`
- AI detects high-autonomy execution context (e.g., bypass permissions, multi-step chains)

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

## Installation

```bash
/plugin install prosoche
```

## Usage

```
/attend [your task]    # Enable execution-time risk monitoring
```

## License

MIT
