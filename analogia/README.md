# /ground — Analogia (ἀναλογία)

<a name="analogia--ground-ἀναλογία"></a>

> [한국어](./README_ko.md)

## What is /ground?

<a name="what-is-analogia"></a>
### Definition

Analogia comes from the Greek word for proportion or analogy. It checks what a pattern, framework, analogy, or earlier design actually supports when you apply it to the case in front of you, and how far that comparison holds.

<a name="the-core-problem"></a>
<a name="when-to-use"></a>
### The problem

You are carrying a pattern, an earlier design, or a sibling job's shape over to your codebase, or checking a general claim against its examples. The comparison sounds right — like applying the Strangler Fig migration pattern to a monolith — but you do not yet know if it holds where services share a single database. Reach for `/ground` when you want to see which conclusions the comparison actually supports, which ones break, and which ones still need evidence before you build on them.

### The result

You get an audit of each conclusion at stake, unless checking the material leaves no conclusion to assess (in which case you receive no verdict, only the drafted question). For every conclusion assessed, you can see what relation carries it, what the AI checked and found, where it could not reach, what conflicts in the gathered material, and what difference in your target would break the claim. Each conclusion comes back marked as holding (with its limits), blocked, or still undetermined (with what is missing and who can check it).

<a name="install"></a>
## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install analogia@epistemic-protocols
```

<a name="usage"></a>
<a name="the-solution"></a>
## Usage

```
/ground [mapping and intended conclusions to audit]
```

After you type `/ground`, the AI reads your question: what the comparison is for, the conclusions at stake, and the source and target being compared. If your words leave part of that question open, it drafts the question from context — when several questions fit, it shows what prompted each and what each would test — so you can take, correct, or replace it, and notes if it checked a draft first. It then checks the files and sources it can reach, maps how the two sides line up — checking whole chains of relations, not just isolated parts — and tests what evidence supports each link without asking you to rubber-stamp the match.

<details>
<summary>How the protocol runs and handles follow-up turns</summary>

**Warrant tracks cited evidence, never assent**: Your agreement is not evidence about your codebase. What moves the assessment is a fact, a source, a counterexample, or the result of running something.

<a name="protocol-flow"></a>
### Protocol Flow

```
Question  → Read from your words: the purpose, the conclusions at stake, and the source and
            target where that is still open. If your words leave it open, a question drafted
            from the context is shown for you to take, correct, or replace; the audit may go
            on over that draft, and says so.
Collect   → To the limit of reach over what the mapping rests on; every place looked is named,
            reached or not
Assess    → Construct the correspondences, state what would defeat each bearing claim, run the
            checks reachable here, read warrant off the grounds, judge each conclusion
Surface   → Present the whole assessment and proceed (relay — no verdict is requested);
            what you ask for next follows the contract's `seam`
Later     → A turn that bears on the audit is read whole and the audit runs again on it;
            anything else — adopting or setting aside a conclusion, a question the current
            grounds answer entirely — is simply answered
```

Where the purpose is to carry a structure over — a port, a migration, a sibling job's shape — the audit checks whether the whole structure is preserved unless your turn asks something narrower. A pass with conclusions to audit ends in an assessment unless collection leaves none to audit. Where a conclusion's verdict turns on which reading of the source holds and the evidence does not settle it, the conclusion stays undetermined with each reading's verdict shown side by side; naming the reading you mean runs the audit again. Turning to other work closes nothing: an open question stays open. What you ask for next follows the contract's [`seam`](./skills/ground/SKILL.md).

<a name="what-a-later-turn-does"></a>
### What a later turn does

| Turn | Effect |
|------|--------|
| **Cite a ground** | Its relevance and scope are checked, and the audit runs again with it before conclusions are judged |
| **Adopt / set aside a conclusion** | Recorded as yours, reported apart from the evidence, moves no warrant and opens no new pass; asking for the next task adopts nothing |
| **Take, correct, or replace the drafted question** | Where your turn settles the question, it stands on that turn; it is read back and audited, evidence already gathered carries over |
| **Revise the purpose, conclusions, source or target** | Reads back the revised question and audits again; evidence already gathered carries over, verdicts are judged again |
| **Name the reading you mean** | Fixes the sense of your question's conclusions; verdicts are judged again under it |
| **Question about this audit** | Answered from current grounds when they answer it entirely; any other question — one they do not settle, or one that brings a fact, a source, a counterexample, or a result — opens a new pass |
| **Something unrelated** | Answered; the last outcome stands |

### When to skip

- What the mapping licenses is already settled in context
- No mapping is being relied on
- You only want an account of one of the two domains, with no mapping being relied on (where an account is needed *for* an audit, Analogia reads it itself as evidence)

</details>

<details>
<summary>How it compares to other protocols</summary>

<a name="difference-from-other-protocols"></a>
| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Aitesis | AI-guided | `ContextInsufficient → SufficientContext` |
| **Analogia** | **AI-guided** | **`MappingUncertain → MappingAssessment`** |
| Proplasma | Hybrid | `DirectionUnrecognizable → DirectionalContrast` |
| Merismos | User-initiated | `GoalPlanUncompiled → ConditionBearingUnitPlan` |
| Epharmoge | AI-guided | `ApplicationDecontextualized → ContextualizedExecution` |
| Katalepsis | User-initiated | `TargetUngrasped → VerifiedUnderstanding` |

- **vs. Aitesis**: Aitesis collects the facts the AI can reach and names what only the user holds (factual). Analogia audits what a mapping licenses from the evidence for its structural claims (relational).
- **vs. Epharmoge**: Epharmoge checks post-execution applicability. Analogia audits the conclusions licensed by a mapping between abstraction levels.
- **vs. Proplasma**: Proplasma contrasts discard-committed placeholder probes when direction futures remain unrecognizable from descriptions. Analogia audits a mapping that is being relied on. A direction settled in Proplasma can be audited separately when its conclusions rest on a mapping.

**Litmus test**: If the uncertainty is about *what a mapping from structure A licenses about B*, it's Analogia. If it's about *which facts the AI can still reach and which only the user holds*, it's Aitesis.

</details>

<a name="author"></a>
## Author

Jongwon Choi (https://github.com/jongwony)
