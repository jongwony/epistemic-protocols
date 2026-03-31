# Aitesis — /inquire (αἴτησις)

Infer context insufficiency before execution (αἴτησις: a requesting)

> [한국어](./README_ko.md)

## What is Aitesis?

A modern reinterpretation of Greek αἴτησις (a requesting) — a protocol that **infers context insufficiency before execution, collects contextual signals via codebase exploration to sharpen question quality, and inquires about what remains uncertain rather than assuming defaults silently**.

### The Core Problem

AI systems often proceed with execution despite insufficient context (`ContextInsufficient`) — required domain knowledge is missing, implicit requirements go unverified, environmental dependencies are assumed, or scope remains ambiguous. Silent assumptions lead to wasted effort and compounding errors.

### The Solution

**Inference over Detection**: Before execution, AI infers areas of context insufficiency, collects contextual signals through codebase exploration to improve question quality, and surfaces remaining uncertainties as structured mini-choices for the user. Transforms insufficient context into informed execution through targeted inquiry.

### Difference from Other Protocols

| Protocol | Mode | Type Signature |
|----------|------|---------------|
| Syneidesis | SURFACE | `GapUnnoticed → AuditedDecision` |
| **Aitesis** | **INQUIRE** | **`ContextInsufficient → InformedExecution`** |

**Key distinction**: Syneidesis surfaces gaps at decision points for the user to judge — information flows AI→user (metacognitive). Aitesis infers what context the AI lacks before execution — information flows user→AI (heterocognitive: "do I have enough context?").

## Protocol Flow

```
Phase 0: Gate               → Scan context sufficiency (silent)
Phase 1: Context Collection  → Collect contextual signals via Read/Grep to improve question quality
Phase 2: Surfacing           → Present remaining uncertainties (gate interaction)
Phase 3: Integration         → Update prospect with user's resolution
```

## Uncertainty Identification

Uncertainties are identified dynamically per task — no fixed taxonomy:

| Priority | Criterion | Example |
|----------|-----------|---------|
| **Critical** | Execution cannot proceed | "Which database schema version should I target?" |
| **Significant** | Suboptimal outcome likely | "Both REST and GraphQL endpoints exist — which API layer does this service consume?" |
| **Marginal** | Reasonable default exists | "Prefer tabs or spaces for this file?" |

## Protocol Precedence

```
Hermeneia → Telos → Aitesis → Prothesis → Analogia → Syneidesis → Katalepsis
```

Aitesis follows Telos: once goals are defined, verify execution context is sufficient. Before perspective framing (Prothesis), mapping validation (Analogia), and gap auditing (Syneidesis), ensure the AI has the context it needs.

## When to Use

**Use**:
- Before complex tasks where AI may lack domain context
- When task has implicit requirements or environmental dependencies
- When scope is ambiguous and AI cannot determine intended approach from available context
- When entering a novel domain not previously discussed in session

**Skip**:
- When execution context is fully specified (use Prothesis — /frame for perspective)
- When gaps are at decision points, not execution context (use Syneidesis — /gap)
- When delegation scope is unclear

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install aitesis@epistemic-protocols
```

## Usage

```
/inquire [your current task or context]
```

## Author

Jongwon Choi (https://github.com/jongwony)
