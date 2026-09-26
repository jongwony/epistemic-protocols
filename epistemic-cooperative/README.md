# Epistemic Cooperative (epistemic-cooperative)

Protocol learning, work orchestration, and decision-point utilities for Claude Code and Codex.

> [한국어](./README_ko.md)

## What is Epistemic Cooperative?

A utility plugin spanning epistemic protocol onboarding, work orchestration, and decision-point utilities. It is where you start — hands-on protocol learning — and also where several skills act at specific decision points of their own, checking a drafted gate's option set and driving a review to convergence.

### Skills

| Skill | Purpose | Output |
|-------|---------|--------|
| `/onboard` | Quick recommendation + protocol learning | Terminal-based guided experience |
| `/probe` | Deficit recognition fit review — multiple deficit hypotheses with reverse-evidence conditions, routed by user recognition | Protocol route |
| `/forge` | Reference-grounded prompt-artifact formation | Prompt artifact (initial prompt for a follow-up session/tool, or a standing custom-skill recipe) |
| `/reduced-space-test` | Scoped empirical validation in a bounded stand-in space | Scoped resolution + carried residual |
| `/review-loop` | Source-agnostic code/PR review-resolve loop — converges the artifact on the project's stated goal | Applied fixes + handovers + convergence trace |
| `/gate-check` | Advisor-checked decision gates — an independent adjudicator judges the drafted option set itself, and its cited grounds are verified before either reaches you | The gate as drafted, a settled option presented as relay, a rebuilt option set, or — where the check could not close — the repair space, the contested reading, or both sets with neither presented as the answer |
| `/white-bear` | Prose audit — unnecessary competing-target mentions (prohibition framing, superseded-path mention, negated anchoring) | JSON findings (read-only) |
| `/zero-shot` | Prose audit — principle statement over anchoring examples | JSON findings (read-only) |
| `/realign` | Project guide direction line via three-horizon fusion | Fused direction line written to the project guide |
| `/goal-research` | Research delegated to a background Codex CLI session (`goal` scoping + Aitesis verification) | Research trace surfaced back |

## Skills

### /onboard — Quick Recommendation + Protocol Learning

Start with a quick recommendation based on your recent sessions, then optionally continue to guided learning.

```
Quick Proof:    ENTRY → QUICKSCAN → PICK-1 → EVIDENCE → TRIAL → INSIGHT → NEXT
Targeted:       ENTRY → QUICKSCAN → MAP → SCENARIO → TRIAL → QUIZ → GUIDE
Targeted + std: ENTRY → SCENARIO → TRIAL → QUIZ → GUIDE
```

| Phase | Description |
|-------|-------------|
| 0. Entry | Choose path: quick recommendation / targeted learning / browse all |
| 1. Quick Scan | Collect recent session metadata inline (Glob + Read) |
| 2a. Pick-1 | Quick path: select 1 recommendation from `/elicit`, `/inquire` |
| 2b. Evidence | Quick path: show 1 evidence card (max 2 lines) |
| 2. Map | Targeted path: match patterns to protocols via compact mapping |
| 3. Scenario | Targeted path: present intervention point with preset scenarios |
| 4. Trial | Execute actual protocol with mini practice prompt |
| 5. Quiz | Targeted path: Socratic protocol recognition questions |
| 6. Guide | Targeted path: learning summary + next protocol suggestion |

Key features:
- **Value before learning**: quick path proves value in under 3 minutes
- **One at a time**: 1 recommendation, 1 evidence card, 1 trial — no catalog required
- **Onboarding Pool**: `/elicit`, `/inquire` — unified for Quick and Targeted fallback
- Real protocol trial execution (2-3 exchanges per protocol)
- Targeted path preserves full learning experience (scenarios, quizzes, guide)

### /forge — Reference-Grounded Prompt-Artifact Formation

Reads a target reference document (a vendor model prompt guide, the Codex Goals spec), reverse-induces the user's under-determined intent into a modality-aware IR, grounds it against the reference via canonical-external dynamic fetch with a staleness guard, and projects a ready-to-use prompt artifact — an initial prompt for a follow-up session or tool, or a standing custom-skill recipe.

```
ReferenceIntake → ResolvedIntentIR → GroundedReference → VendorPromptDraft → PromptArtifact
```

Key features:
- vendor-agnostic core (intent IR + staleness policy) + parameterized adapter seam; ships Higgsfield, gpt-image, codex-goals, and claude-session adapters
- core stops at IR; artifact form is adapter-determined (no core promotion)
- filled draft with relay slots cited and constitution slots flagged — not a blank question list, not a blind full draft
- cross-adapter abstraction is a deliberately deferred colimit (sibling of triage-gated-vendor-harness), not extracted ahead of accumulated use

### /reduced-space-test — Scoped Empirical Validation

Validates an inference-uncertain proposition (does it behave / perform / transfer / hold value) inside a constraint-bounded stand-in space synchronized with the user, then carries the uncovered complement forward. The core act is decomposing the target↔surrogate equivalence claim into verifiable facets — not building the stand-in space.

```
ClaimIntake → ScopedClaimFrame → BoundedTestSpace → EmpiricalEvidence → ScopedResolution → CarriedResidual
```

Key features:
- orchestration utility (composes `/bound` + `/inquire`, with a conditional `/elicit` or `/induce` front); no new protocol, no graph node
- constraint sync is a Constitution interaction — the user's boundary constitutes the verifiable claim
- scoped claim only — reduced failure probability within the tested conditions, never absolute equivalence
- residual complement is a first-class output routed to a follow-up protocol

## Review loop hosts

`codex` and `code-review` select the reviewer in either Claude Code or Codex.
The [runtime contract](skills/review-loop/SKILL.md) routes to the active host
reference, then loads only the selected source adapter. Claude reviews require a
skill that can review the captured local scope; Codex reviews require its CLI.

## Architecture

```
epistemic-cooperative/
├── .claude-plugin/plugin.json
└── skills/
    ├── onboard/SKILL.md          # /onboard quest-based protocol learning
    ├── probe/SKILL.md            # /probe deficit recognition fit review
    ├── forge/SKILL.md            # /forge reference-grounded prompt-artifact formation
    ├── reduced-space-test/SKILL.md  # /reduced-space-test scoped empirical validation
    ├── review-loop/SKILL.md      # /review-loop convergence-paced review-resolve loop
    ├── gate-check/SKILL.md       # /gate-check advisor-checked decision gates
    ├── white-bear/SKILL.md       # /white-bear competing-target prose audit
    ├── zero-shot/SKILL.md        # /zero-shot anchoring-example prose audit
    ├── realign/SKILL.md          # /realign project guide direction-line fusion
    └── goal-research/SKILL.md    # /goal-research Codex-delegated research
```

## When to Use

| Situation | Skill |
|-----------|-------|
| New to epistemic protocols | `/onboard` |
| Want hands-on protocol learning | `/onboard` |
| Re-evaluating protocol fit after workflow changes | `/onboard` |
| Validating an uncertain proposition in a bounded stand-in space | `/reduced-space-test` |
| Something feels off but the deficit is not yet named | `/probe` |
| Driving a change through review until every finding is disposed of | `/review-loop` |
| Checking a drafted option set before it reaches the user | `/gate-check` |
| Auditing prose for prohibition framing or anchoring examples | `/white-bear`, `/zero-shot` |
| Re-deriving the project guide's direction line | `/realign` |
| Delegating a research question to Codex | `/goal-research` |

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install epistemic-cooperative@epistemic-protocols
```

## Usage

```
/onboard
/probe
/review-loop codex 123
/goal-research <question>
```

`/review-loop` reuses matching reviewer capability evidence and confirms the command
and scope during the first read-only review. For PRs, an omitted `head`/`stacked`
repair destination is settled before the first edit; it does not delay the review.

## Author

Jongwon Choi (https://github.com/jongwony)
