# Epitrope — /calibrate (ἐπιτροπή)

Calibrate delegation autonomy through scenario-based interview (ἐπιτροπή: a turning over to)

> [한국어](./README_ko.md)

## What is Epitrope?

A modern reinterpretation of Greek ἐπιτροπή (a turning over to) — a protocol that **calibrates how much autonomy the AI should have by asking concrete scenario-based questions, rather than relying on implicit assumptions about delegation scope**.

### The Core Problem

AI systems operate with implicit delegation boundaries (`DelegationAmbiguous`) — sometimes acting too autonomously (wrong approach, excessive changes) and sometimes being overly cautious (unnecessary permission requests). Without explicit calibration, the AI guesses at delegation scope, leading to friction.

### The Solution

**Calibration over Declaration**: Through Akinator-style scenario questions ("When you encounter X, should I...?"), the protocol surfaces implicit delegation preferences and produces a DelegationContract that governs autonomy for the session.

### Difference from Other Protocols

| Protocol | Mode | Type Signature |
|----------|------|---------------|
| Aitesis | INQUIRE | `ContextInsufficient → InformedExecution` |
| **Epitrope** | **CALIBRATE** | **`DelegationAmbiguous → CalibratedAutonomy`** |

**Key distinction**: Aitesis asks "do I know enough?" (context gap). Epitrope asks "am I allowed to?" (delegation gap). A task can have sufficient context but ambiguous delegation.

## Protocol Flow

```
Phase 0: Decomposition  → Identify applicable action domains (silent)
Phase 1: Interview       → Scenario-based delegation questions (call AskUserQuestion)
Phase 2: Integration     → Update DelegationContract with responses
Phase 3: Review          → Present contract for approval (call AskUserQuestion)
```

## Action Domains

| Domain | Example |
|--------|---------|
| FileModification | "When I need to modify files, should I proceed or ask first?" |
| ↳ *ephemeral/durable* | "Persistent files (config, rules) may need different autonomy than regular code" |
| Exploration | "If I find related information while investigating, should I..." |
| Strategy | "If I find a better approach mid-task, should I..." |
| External | "For git push, PR creation — should I always ask?" |

## Protocol Precedence

```
Hermeneia → Telos → Epitrope → Aitesis → Prothesis → Syneidesis → Katalepsis
```

Epitrope follows Telos: once goals are defined, calibrate delegation autonomy. Before context verification (Aitesis), perspective framing (Prothesis), and gap auditing (Syneidesis).

## When to Use

**Use**:
- When starting a multi-domain task with unclear autonomy expectations
- When past interactions had wrong_approach or excessive_changes friction
- When working in a new project or unfamiliar codebase
- When you want explicit control over AI autonomy levels

**Skip**:
- When task scope is fully specified with step-by-step instructions
- When delegation is clear from context (single file edit, explicit request)

## Usage

```
/calibrate [your task description]
```

## Author

Jongwon Choi (https://github.com/jongwony)
