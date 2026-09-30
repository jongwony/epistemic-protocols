# Aitesis — /inquire (αἴτησις)

Collect what the AI can reach on its own, hand back the rest as the user's unknown (αἴτησις: a requesting)

> [한국어](./README_ko.md)

## What is Aitesis?

A modern reinterpretation of Greek αἴτησις (a requesting) — a protocol that **collects context to the limit of what the AI can reach on its own, writes down for each uncertainty what that reached and why it reached no further, and hands what only the user can settle — or what no source it reached settles — back to the user as their own unknown**.

### The Core Problem

AI systems often proceed despite insufficient context (`ContextInsufficient`) — required domain knowledge is missing, implicit requirements go unverified, environmental dependencies are assumed, or scope remains ambiguous. Silent assumptions lead to wasted effort and compounding errors. And people are poor at seeing their own unknowns: once a plausible account forms, the search stops.

### The Solution

**Evidence over Inference over Detection**: AI infers what the prospect leaves uncertain rather than detecting via a fixed taxonomy (Inference > Detection), then pushes each uncertainty through every source it can read or run on its own without changing existing state — what it creates only to look, such as a scratch copy or a temp file, it removes afterwards — and gathers evidence rather than substituting inference (Evidence > Inference). An observation that would need to change existing state, someone's permission, or another's authority is named with what it needs and handed off rather than run. Where to look is the AI's judgment, and collection goes to the limit of its reach. Each uncertainty then stands one of three ways: **settled** — a cited source or the user's own words fix it; **ground short** — a finding whose shortfall the AI declares; **unreached** — nothing it could reach settles it. For each open one the AI names the sources it tried and those it could not reach, with what they need, so the user can point at one it missed; a finding that answers no uncertainty raised is shown on its own line. Once everything reachable is reached, what is the user's is handed back as their own unknown in one of two forms: a conflict or contradiction among what was collected, naming what conflicts with what, or a decision without which further collection cannot reach, naming which collection waits on it. The AI never makes that decision for the user. The run completes when collection ends and proceeds without holding the turn: what is open does not block completion and is not settled by it, and work that rests on an open item waits for the user's words. The run keeps reading later messages — an answer, a correction, a new source, a dismissal, or a withdrawal reopens collection and a new completion — and silence leaves the last completion standing. Only the user's own words settle a value that is theirs to hold; a decision of theirs that another record relays is cited as the fact that it was made. The beneficiary is the user's epistemic state; the AI's collection is the instrument.

### Difference from Other Protocols

| Protocol | Mode | Type Signature |
|----------|------|---------------|
| **Aitesis** | **INQUIRE** | **`ContextInsufficient → SufficientContext`** |
| Proplasma | PREVIEW | `DirectionUnrecognizable → DirectionalContrast` |

**Key distinction**: Aitesis collects what the AI lacks and names what only the user holds — the AI reaches for context on its own and hands back what it cannot reach (heterocognitive: "what can I reach, and what is yours?").

Proplasma (`/preview`) is the Planning-cluster sibling on the direction axis: Aitesis supplies missing facts and names the user's unknowns; Proplasma materializes direction futures as discard-committed placeholder contrast when the candidates are already known but unrecognizable from descriptions.

## Protocol Flow

```
Collection   → Push each uncertainty through every source the AI can reach on its own; name what it tried and what it could not reach
Completion   → Collection has reached everything it can; what is open stays open and is not settled
Relay        → Hand back what is the user's — a conflict among what was collected, or a decision further collection waits on — beside findings with their shortfalls, show detections, and proceed
Answer       → Read whole: settle, correct, point to a source, "I don't know either", dismiss, or withdraw; one that bears on the run reopens collection and a new completion
```

## Uncertainty Identification

Uncertainties are identified dynamically per task — no fixed taxonomy. What an answer would change most is shown first. For example:

| What the work rests on | Example |
|------------------------|---------|
| A fact the AI can look up | "Which database schema version does this service run against?" — read from the migrations |
| A fact only the user holds | "Is the staging cluster still shared with the other team?" |
| A decision further collection waits on | "Both REST and GraphQL endpoints exist — which should this service consume? The client code to read next depends on it." |

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
- When the context is fully specified (AI-guided activation only; invoking `/inquire` always collects)
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
