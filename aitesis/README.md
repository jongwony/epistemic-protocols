# Aitesis — /inquire (αἴτησις)

Collect what the AI can reach on its own, hand back the rest as the user's unknown (αἴτησις: a requesting)

> [한국어](./README_ko.md)

## What is Aitesis?

A modern reinterpretation of Greek αἴτησις (a requesting) — a protocol that **collects context to the limit of what the AI can reach on its own, writes down for each uncertainty what that reached and why it reached no further, and hands what only the user can settle — or nobody yet knows — back to the user as their own unknown**.

### The Core Problem

AI systems often proceed despite insufficient context (`ContextInsufficient`) — required domain knowledge is missing, implicit requirements go unverified, environmental dependencies are assumed, or scope remains ambiguous. Silent assumptions lead to wasted effort and compounding errors. And people are poor at seeing their own unknowns: once a plausible account forms, the search stops.

### The Solution

**Evidence over Inference over Detection**: AI infers what the prospect leaves uncertain rather than detecting via a fixed taxonomy (Inference > Detection), then pushes each uncertainty through every channel it can read or run on its own — the codebase, records, external sources, history, an observation run — and gathers evidence rather than substituting inference (Evidence > Inference). Collection stops for an item only when no channel the AI can reach is left. Each item then lands in one of four states, with the reason and the basis written on it: **resolved** by evidence; **provisional** — a finding whose ground the AI declares short; the **user's unknown** — only the user can settle it, or nobody yet knows; **detect-only** — a finding that answers no uncertainty raised. What remains is handed back as the user's own unknown and the protocol proceeds; an answer, when it comes, is one more channel and reopens collection. The beneficiary is the user's epistemic state; the AI's collection is the instrument.

### Difference from Other Protocols

| Protocol | Mode | Type Signature |
|----------|------|---------------|
| **Aitesis** | **INQUIRE** | **`ContextInsufficient → SufficientContext`** |
| Proplasma | PREVIEW | `DirectionUnrecognizable → DirectionalContrast` |

**Key distinction**: Aitesis collects what the AI lacks and names what only the user holds — the AI reaches for context on its own and hands back what it cannot reach (heterocognitive: "what can I reach, and what is yours?").

Proplasma (`/preview`) is the Planning-cluster sibling on the direction axis: Aitesis supplies missing facts and names the user's unknowns; Proplasma materializes direction futures as discard-committed placeholder contrast when the candidates are already known but unrecognizable from descriptions.

## Protocol Flow

```
Phase 0: Checkpoint         → Scan context sufficiency (silent)
Phase 1: Collection          → Push each uncertainty through every channel the AI can reach; write its state, reason, basis
Phase 2: Surfacing           → Hand back what remains — findings with their shortfalls, the user's unknowns, detections — and proceed
Phase 3: Integration         → An answer, when it comes, reopens collection as one more channel
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
Aitesis → Analogia → Katalepsis
```

Aitesis runs early: exhaust what the AI can collect before analogical-inference auditing (Analogia).

## When to Use

**Use**:
- Before complex tasks where AI may lack domain context
- When task has implicit requirements or environmental dependencies
- When scope is ambiguous and AI cannot determine intended approach from available context
- When entering a novel domain not previously discussed in session

**Skip**:
- When the context is fully specified
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
