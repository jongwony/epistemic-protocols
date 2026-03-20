# Epistemic Protocols

## Highlights

### 10 Epistemic Protocols

Structure human-AI interaction quality at every decision point. Each protocol resolves a typed deficit:

- **Planning**: `/clarify` (intent gaps), `/goal` (vague goals), `/inquire` (context insufficiency)
- **Analysis**: `/frame` (absent frameworks), `/ground` (unmapped abstractions)
- **Decision**: `/gap` (unnoticed gaps before action)
- **Execution**: `/attend` (execution-time risk evaluation)
- **Verification**: `/contextualize` (post-execution context mismatch)
- **Cross-cutting**: `/bound` (epistemic boundaries), `/grasp` (comprehension verification)

### Typed Deficit-Resolution System

Every protocol carries a type signature `(Deficit, Initiator, Action, Target) → Resolution` that makes the epistemic transition explicit. Protocols compose through session text — each protocol's output becomes natural-language context for subsequent protocols.

### Formal Verification

13 static checks validate protocol integrity before every commit:
json-schema, notation, directive-verb, xref, structure, tool-grounding, version-staleness, graph-integrity, spec-vs-impl, cross-ref-scan, onboard-sync, precedence-linear-extension, partition-invariant.

Protocol dependency graph (`graph.json`) enforces precondition DAG, advisory edges, and suppression rules with cycle detection.

### Utility Skills

- `/catalog` — instant protocol handbook and reference
- `/onboard` — quest-based protocol learning (quick recommendation + targeted scenarios)
- `/report` — Growth Map with epistemic analysis from session patterns
- `/dashboard` — full-session coverage analytics
- `/preferences` — interactive protocol configuration
- `/reflect` — cross-session insight extraction into persistent memory
- `/write` — multi-perspective blog drafting from session insights

## Protocols

| Protocol | Command | Deficit → Resolution | Version |
|----------|---------|---------------------|---------|
| Hermeneia | `/clarify` | IntentMisarticulated → ClarifiedIntent | 1.19.0 |
| Telos | `/goal` | GoalIndeterminate → DefinedEndState | 1.10.0 |
| Horismos | `/bound` | BoundaryUndefined → DefinedBoundary | 1.4.0 |
| Aitesis | `/inquire` | ContextInsufficient → InformedExecution | 3.8.0 |
| Prothesis | `/frame` | FrameworkAbsent → FramedInquiry | 5.11.0 |
| Analogia | `/ground` | MappingUncertain → ValidatedMapping | 1.4.0 |
| Syneidesis | `/gap` | GapUnnoticed → AuditedDecision | 2.20.0 |
| Prosoche | `/attend` | ExecutionBlind → SituatedExecution | 1.5.0 |
| Epharmoge | `/contextualize` | ApplicationDecontextualized → ContextualizedExecution | 0.6.0 |
| Katalepsis | `/grasp` | ResultUngrasped → VerifiedUnderstanding | 1.22.0 |

## Assets

| Plugin | Version | Asset |
|--------|---------|-------|
| prothesis | 5.11.0 | frame.zip |
| syneidesis | 2.20.0 | gap.zip |
| hermeneia | 1.19.0 | clarify.zip |
| katalepsis | 1.22.0 | grasp.zip |
| telos | 1.10.0 | goal.zip |
| aitesis | 3.8.0 | inquire.zip |
| horismos | 1.4.0 | bound.zip |
| analogia | 1.4.0 | ground.zip |
| prosoche | 1.5.0 | attend.zip |
| epharmoge | 0.6.0 | contextualize.zip |
| epistemic-cooperative | 1.14.0 | onboard.zip |
| epistemic-cooperative | 1.14.0 | catalog.zip |

Bundle: `epistemic-protocols-bundle.zip`
