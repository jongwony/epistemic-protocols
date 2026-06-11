# Prosoche (προσοχή) — /attend

> [한국어](./README_ko.md)

Compile slow/threshold execution risks into verifiable goal conditions before autonomous execution.

## Type Signature

```
(ExecutionBlind, User, EVALUATE, ExecutionContext) → SituatedExecution
```

## What It Does

Prosoche is a stateless guardrail compiler. Before an autonomous execution interval begins, it infers a boundary map from context (an upstream `/bound` output enriches the inference but is never required), partitions the risks by velocity, compiles the slow/threshold portion into verifiable predicates, and emits the confirmed set as coarse goal entries for a downstream completion-predicate enforcer (on Claude Code: `/goal`). Fast risks — anything requiring pre-action interception — are declared out of scope and delegated to the harness substrate.

**Core principle**: Attention over Automation — execution risk gets attention before autonomy begins, not interruptions while it runs. The attention is inscribed into the conditions; nothing of Prosoche survives into the execution interval.

## When It Activates

- User calls `/attend` (user-initiated only)

## Boundary Signal Taxonomy

| Kind | Context cues | Velocity |
|------|--------------|----------|
| ScopeConfinement | Permission grants, declared file/repo scope, sandbox limits | Slow |
| Budget | Token/cost/iteration/time budgets | Slow |
| CompletionThreshold | Stated done-criteria: tests pass, CI green, artifact exists | Slow |
| Irreversibility | Reversibility constraints, production targets, deploy/push/delete intent | Split: end-state-checkable part Slow; pre-action part Fast → out of scope |
| Emergent | Boundary pattern outside named kinds | Assessed per instance |

**Slow/threshold** risks are evaluable when the loop stops — they compile into executable predicates (exit status, test result, countable threshold, file-state assertion). **Fast** risks need interception before an action runs — a stop-time predicate structurally cannot catch them, so they are delegated, never simulated.

## Composition

Within a conducted workflow (`/conduct`), the execution-preparation chain is `/bound` → `/attend` → `/goal`: `/bound` defines the boundary map, `/attend` compiles its slow/threshold portion into verifiable conditions, `/goal` enforces them inside one bounded interval. `/attend` does not invoke `/goal` — emission is its epistemic endpoint, and starting the autonomous interval is the user's separate act. `/contextualize` and `/grasp` verify after the interval.

## Known Limitations

- **Bounded platform claim**: the `/goal` leaf-executor characterization is verified against Claude Code v2.1.140 only; re-verify on harness version change.
- **Inference is heuristic**: a boundary never uttered and never captured upstream will not be inferred; the confirmation gate is the correction point.
- **Predicate coverage**: subjective quality bars do not compile; they surface as residuals, not prose conditions.
- **No execution-time protection**: compile-time only — fast risks belong entirely to the pre-action substrate.

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install prosoche@epistemic-protocols
```

## Usage

```
/attend [your task]    # Compile execution guardrails into verifiable goal conditions
```

## License

MIT
