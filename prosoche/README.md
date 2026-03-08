# Prosoche (προσοχή) — /attend

> [한국어](./README_ko.md)

Evaluate execution-time risks by classifying existing tasks for risk signals and surfacing elevated-risk findings.

## Type Signature

```
(ExecutionBlind, User, EVALUATE, ExecutionAction) → SituatedExecution
```

## What It Does

Prosoche reads existing tasks and classifies each for risk signals — irreversibility, human communication, security boundaries, prompt injection, external mutations, and scope escalation. Most tasks pass silently (p=Low); only elevated-risk tasks are surfaced for user judgment.

**Core principle**: Attention over Automation — autonomy is preserved by default, interrupted only at genuine risk boundaries.

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
- **TaskList dependency**: Prosoche reads existing tasks at invocation time. If no tasks exist, there is nothing to classify.

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install prosoche@epistemic-protocols
```

## Usage

```
/attend [your task]    # Enable execution-time risk classification
```

## License

MIT
