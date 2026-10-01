# Analogia — /ground (ἀναλογία)

Audit what an analogical mapping licenses (ἀναλογία: a proportion)

> [한국어](./README_ko.md)

## What is Analogia?

A modern reinterpretation of Greek ἀναλογία (proportion, analogy) — a protocol that **audits what an abstract framework licenses you to conclude about the case in front of you**, and how far.

### The Core Problem

AI applies patterns, models, and analogies from one domain to another without checking whether the structural correspondence holds. The Strangler Fig migration pattern might sound right — but does it map to your monolith where services share a single database? Abstract advice that doesn't structurally fit your context leads to wasted implementation effort.

### The Solution

**Warrant tracks cited evidence, never assent**: Analogia takes the question from your own words — what the comparison is for, the conclusions at stake, and which source and which target where that is still open — collects to the limit of its reach over what the mapping rests on, constructs the correspondences, and then asks of each one what actually supports it. For every claim a conclusion rides on, it states what target-side fact would require that claim to change and who can go and get it, carries out the checks it can reach itself, names the places it reached and those it could not, names what conflicts with what where the collected material disagrees, and reports each conclusion as licensed with its limits, blocked, or undetermined with what is missing and who can reach it. What remains open is shown as your own unknown.

It does not ask you to certify the mapping. Your agreement is not evidence about your codebase, and a protocol that converged on it would be recording your confidence rather than the structure. What moves the assessment is a fact, a source, a counterexample, or the result of running something.

### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Aitesis | AI-guided | `ContextInsufficient → SufficientContext` |
| **Analogia** | **AI-guided** | **`MappingUncertain → MappingAssessment`** |
| Proplasma | Hybrid | `DirectionUnrecognizable → DirectionalContrast` |
| Merismos | User-initiated | `GoalPlanUncompiled → ConditionBearingUnitPlan` |
| Epharmoge | AI-guided | `ApplicationDecontextualized → ContextualizedExecution` |
| Katalepsis | User-initiated | `TargetUngrasped → VerifiedUnderstanding` |

**Key differences**:
- **vs. Aitesis**: Aitesis collects the facts the AI can reach and names what only the user holds (factual). Analogia audits what a mapping licenses from the evidence for its structural claims (relational).
- **vs. Epharmoge**: Epharmoge checks post-execution applicability. Analogia audits the conclusions licensed by a mapping between abstraction levels.
- **vs. Proplasma**: Proplasma contrasts discard-committed placeholder probes when direction futures remain unrecognizable from descriptions after its routing checks. Analogia audits a mapping that is being relied on — a direction that survives the contrast flows to Analogia when its intended conclusions need that audit.

**Litmus test**: If the uncertainty is about *what a mapping from structure A licenses about B*, it's Analogia. If it's about *which facts the AI can still reach and which only the user holds*, it's Aitesis.

## Protocol Flow

```
Question  → Read from your words: the purpose, the conclusions at stake, and the source and
            target where that is still open. If your words leave it open, it is asked, and
            nothing is collected while it waits.
Collect   → To the limit of reach over what the mapping rests on; every place looked is named,
            reached or not
Assess    → Construct the correspondences, state what would defeat each bearing claim, run the
            checks reachable here, read warrant off the grounds, judge each conclusion
Surface   → Present the whole assessment and proceed (relay — no verdict is requested)
Later     → A turn that bears on the audit is read whole and the audit runs again on it;
            anything else is simply answered
```

The question is the only decision gate. It is never filled in for you: where your own words leave the purpose, the conclusions, or a materially different choice of source or target open, the gate asks. Where the purpose is to carry a structure over — a port, a migration, a sibling job's shape — the audit checks whether the whole structure is preserved, with its relations found by collection. Every pass ends in an assessment; a conclusion that stays undetermined is part of it, not a failure to finish. While the question waits, you can end the audit, and it closes saying nothing was assessed.

## What a later turn does

| Turn | Effect |
|------|--------|
| **Cite a ground** | Its relevance and scope are checked, and the audit runs again with it before conclusions are judged |
| **Adopt / withdraw a conclusion** | Recorded as yours, reported apart from the evidence, moves no warrant; asking for the next task adopts nothing |
| **Revise the purpose, conclusions, source or target** | Reads back the revised question and audits again; evidence already gathered carries over, verdicts are judged again |
| **Ask a question** | Answered from current grounds, or the audit runs again on what it opens |
| **Something unrelated** | Answered; the last assessment stands |

## When to Use

**Use**:
- You are carrying a pattern, an earlier design, or a sibling's shape over to your codebase and want to audit what the transfer supports
- A familiar framework suggests a conclusion whose structural evidence or limits are uncertain
- A cross-domain analogy is being used to justify a conclusion beyond its checked scope
- You want to know which conclusions the analogy supports, blocks, or leaves unresolved

**Skip**:
- AI output is already domain-specific with concrete examples
- What the mapping licenses is already settled in context
- No abstract framework is being applied (output is purely concrete)
- You only want an account of one of the two domains, with no mapping being relied on. That is explanation, not audit. Where an account is needed *for* an audit, Analogia reads it itself as evidence rather than asking you to bring it.

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install analogia@epistemic-protocols
```

## Usage

```
/ground [mapping and intended conclusions to audit]
```

## Author

Jongwon Choi (https://github.com/jongwony)
