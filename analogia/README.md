# Analogia — /ground (ἀναλογία)

Audit what an analogical mapping licenses (ἀναλογία: a proportion)

> [한국어](./README_ko.md)

## What is Analogia?

A modern reinterpretation of Greek ἀναλογία (proportion, analogy) — a protocol that **audits what an abstract framework licenses you to conclude about the case in front of you**, and how far.

### The Core Problem

AI applies patterns, models, and analogies from one domain to another without checking whether the structural correspondence holds. The Strangler Fig migration pattern might sound right — but does it map to your monolith where services share a single database? Abstract advice that doesn't structurally fit your context leads to wasted implementation effort.

### The Solution

**Warrant tracks cited evidence, never assent**: Analogia settles what the mapping is being asked to license, decomposes both domains, constructs the correspondences, and then asks of each one what actually supports it. For every claim an intended conclusion rides on, it states what evidence would require that claim to change and who can go and get it, carries out the checks it can reach itself, and reports each conclusion as licensed with its limits, blocked, or undetermined with what is missing.

It does not ask you to certify the mapping. Your agreement is not evidence about your codebase, and a protocol that converged on it would be recording your confidence rather than the structure. What moves the assessment is a fact, a source, a counterexample, or the result of running something.

### Difference from Other Protocols

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Prothesis | AI-guided | `FrameworkAbsent → FramedInquiry` |
| Aitesis | AI-guided | `ContextInsufficient → SufficientContext` |
| **Analogia** | **AI-guided** | **`MappingUncertain → MappingAssessment`** |
| Proplasma | Hybrid | `DirectionUnrecognizable → DirectionalContrast` |
| Merismos | User-initiated | `GoalPlanUncompiled → ConditionBearingUnitPlan` |
| Epharmoge | AI-guided | `ApplicationDecontextualized → ContextualizedExecution` |
| Katalepsis | User-initiated | `TargetUngrasped → VerifiedUnderstanding` |

**Key differences**:
- **vs. Prothesis**: Prothesis selects which framework to apply when none exists. Analogia audits which conclusions a selected framework supports about an account already in play.
- **vs. Aitesis**: Aitesis collects the facts the AI can reach and names what only the user holds (factual). Analogia audits what a mapping licenses from the evidence for its structural claims (relational).
- **vs. Epharmoge**: Epharmoge checks post-execution applicability. Analogia audits the conclusions licensed by a mapping between abstraction levels.
- **vs. Proplasma**: Proplasma contrasts discard-committed placeholder probes when direction futures remain unrecognizable from descriptions after its routing checks. Analogia audits a mapping against an account already in play — a direction that survives the contrast flows to Analogia when its intended inferences need that audit.

**Litmus test**: If the uncertainty is about *what a mapping from structure A licenses about an account of B already in play*, it's Analogia. If it's about *which facts the AI can still reach and which only the user holds*, it's Aitesis. If it's about *which framework to apply*, it's Prothesis.

## Protocol Flow

```
Phase 0: Detect       → Is what this mapping licenses open, with a target account in play? (silent)
Phase 1: Assess       → Settle the comparison focus and the conclusions at stake, construct the
                        correspondences, state what would defeat each bearing claim, run the
                        checks reachable here, read warrant off the grounds, judge each conclusion
Phase 2: Surface      → Present the whole assessment and proceed (relay — no verdict is requested)
Phase 3: Integrate    → A later turn re-opens the earliest assessment step affected by its evidence or revised question
```

The comparison focus is the only decision gate, and it opens when the request and existing context leave a genuine choice about which comparison to construct.

## What a later turn does

| Turn | Effect |
|------|--------|
| **Cite a ground** | Its relevance and scope are checked; affected mapping or evidence steps rerun before conclusions are judged |
| **Adopt / withdraw** | Recorded as yours, reported apart from the evidence, moves no warrant |
| **Revise the focus or intended conclusions** | Reads back the revised question; an unchanged comparison is reassessed without reconstruction |
| **Ask a question** | Answered from current grounds, or reopens the affected evidence or mapping step |

## When to Use

**Use**:
- You already have an account of a pattern and your codebase, and want to audit what transferring the pattern supports
- A familiar framework suggests a conclusion whose structural evidence or limits are uncertain
- A cross-domain analogy is being used to justify a conclusion beyond its checked scope
- You want to know which conclusions the analogy supports, blocks, or leaves unresolved

**Skip**:
- AI output is already domain-specific with concrete examples
- What the mapping licenses is already settled in context
- No abstract framework is being applied (output is purely concrete)
- **You are meeting one of the two domains for the first time.** That is explanation, not audit: this protocol takes an account you already hold and asks what it supports. Reach for an explanation protocol instead, and come back with the account in hand.

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
