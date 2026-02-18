# Aitesis — /inquire (αἴτησις)

Detect context insufficiency before execution (αἴτησις: a requesting)

> [한국어](./README_ko.md)

## What is Aitesis?

A modern reinterpretation of Greek αἴτησις (a requesting) — a protocol that **proactively scans for context sufficiency before execution, self-investigates gaps via codebase exploration, and inquires about what remains missing rather than assuming defaults silently**.

### The Core Problem

AI systems often proceed with execution despite insufficient context (`ContextInsufficient`) — required domain knowledge is missing, implicit requirements go unverified, environmental dependencies are assumed, or scope remains ambiguous. Silent assumptions lead to wasted effort and compounding errors.

### The Solution

**Inquiry over Assumption**: Before execution, AI scans for context gaps, attempts self-resolution through codebase exploration, and surfaces remaining gaps as structured mini-choices for the user. Transforms insufficient context into informed execution through targeted inquiry.

### Difference from Other Protocols

| Protocol | Mode | Type Signature |
|----------|------|---------------|
| Syneidesis | SURFACE | `GapUnnoticed → AuditedDecision` |
| **Aitesis** | **INQUIRE** | **`ContextInsufficient → InformedExecution`** |

**Key distinction**: Syneidesis surfaces gaps at decision points for the user to judge — information flows AI→user (metacognitive). Aitesis inquires about context the AI lacks before execution — information flows user→AI (heterocognitive: "do I have enough context?").

## Protocol Flow

```
Phase 0: Gate              → Scan context sufficiency (silent)
Phase 1: Self-Investigation → Resolve gaps via Read/Grep codebase exploration
Phase 2: Surfacing          → Present remaining gaps (call AskUserQuestion)
Phase 3: Integration        → Update execution plan with user's resolution
```

## Gap Identification

Gaps are identified dynamically per task — no fixed taxonomy:

| Severity | Criterion | Example |
|----------|-----------|---------|
| **Blocking** | Execution cannot proceed | "Which database schema version should I target?" |
| **Important** | Suboptimal outcome likely | "Should error messages be user-facing or developer-facing?" |
| **Minor** | Reasonable default exists | "Prefer tabs or spaces for this file?" |

## Protocol Precedence

```
Hermeneia → Telos → Epitrope → Aitesis → Prothesis → Syneidesis → Katalepsis
```

Aitesis follows Epitrope: once delegation is calibrated, verify execution context is sufficient. Before perspective framing (Prothesis) and gap auditing (Syneidesis), ensure the AI has the context it needs.

## When to Use

**Use**:
- Before complex tasks where AI may lack domain context
- When task has implicit requirements or environmental dependencies
- When scope is ambiguous with multiple valid interpretations
- When entering a novel domain not previously discussed in session

**Skip**:
- When execution context is fully specified (use Prothesis — /mission for perspective)
- When gaps are at decision points, not execution context (use Syneidesis — /gap)
- When delegation scope is unclear (use Epitrope — /calibrate first)

## Usage

```
/inquire [your current task or context]
```

## Author

Jongwon Choi (https://github.com/jongwony)
