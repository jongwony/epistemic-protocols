# Write — /write

Multi-perspective blog drafting from session insights

> [한국어](./README_ko.md)

## What is Write?

A skill that **transforms session insights into structured, publishable blog posts** through multi-perspective analysis. Integrates two epistemic protocols — Prothesis for perspective selection and Syneidesis for gap validation — into a systematic drafting pipeline.

### The Core Problem

Turning complex technical sessions into well-structured, multi-perspective blog posts requires systematic analysis that's hard to do manually. Key insights get lost, perspectives remain unexplored, and completeness is hard to verify.

### The Solution

**Structured drafting pipeline**: Session context flows through perspective analysis, formatting, drafting, refinement, and validation phases. Each phase has clear decision points and quality criteria.

### Protocol Integration

| Phase | Protocol | Purpose |
|-------|----------|---------|
| Frame | Prothesis (/frame) | Multi-perspective lens selection from context |
| Validate | Syneidesis (/gap) | Completeness and gap detection |

## Workflow

```
Frame → Format → Draft → Refine → Validate → Finalize
```

| Phase | Description |
|-------|-------------|
| Frame | Select analytical perspectives via Prothesis protocol |
| Format | Choose output type (blog post, essay, newsletter, thread) and language |
| Draft | Generate initial draft with Hook → Context → Framework → Application → Implications |
| Refine | Iterative refinement loop on user feedback |
| Validate | Gap detection via Syneidesis protocol |
| Finalize | Apply final edits, produce publication-ready output |

## Content Transformation

| Session Element | Blog Element |
|-----------------|--------------|
| Problem context | Opening hook |
| Multi-perspective analysis | Framework structure |
| Convergence points | Core thesis |
| Divergence points | Discussion sections |
| Resolution approach | Actionable methodology |

## When to Use

**Use**:
- After completing a significant feature or investigation
- When converting framework development or analytical sessions into blog posts
- When you want to analyze a topic from multiple perspectives in writing

**Skip**:
- Technical tutorials with code (standard writing)
- Documentation updates (direct editing)
- Single-pass content without review need

## Install

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install write@epistemic-protocols
```

## Usage

```
/write
```

## Author

Jongwon Choi (https://github.com/jongwony)
