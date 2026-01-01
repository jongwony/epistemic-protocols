---
name: draft
description: Draft blog posts from session insights with multi-perspective analysis.
---

# Draft Skill

Transform session insights and conceptual explorations into structured, publishable content through multi-perspective analysis and iterative refinement.

## When to Use

Invoke this skill when:
- Converting framework development or analytical sessions into blog posts
- Writing about conceptual topics requiring multi-perspective review
- Structured iterative refinement anticipated

Skip when:
- Technical tutorials with code (standard writing)
- Documentation updates (direct Edit)
- Single-pass content without review need

## Workflow Overview

```
PROTHESIS(Context→Perspective→Inquiry→Synthesis) → FORMAT → DRAFT → REFINE → VALIDATE → FINALIZE
```

| Phase | Tool | Decision Point |
|-------|------|----------------|
| Prothesis | /prothesis protocol | Context-derived perspectives, parallel inquiry |
| Format | AskUserQuestion | Output type, language |
| Draft | Write | — |
| Refine | Edit (loop) | User feedback |
| Validate | /syneidesis | Gap detection |
| Finalize | Edit | — |

## Phase Execution

### 1-3. Prothesis Protocol (Multi-Perspective Analysis)

Apply the prothesis protocol for epistemic analysis:

```
Phase 0: G(U) → C              -- Context acquisition from session/topic
Phase 1: C → {P₁...Pₙ}(C) → Pₛ -- Perspectives derived FROM context (not predefined)
Phase 2: Pₛ → ∥I(Pₛ) → R       -- Parallel inquiry with Horizon Limits
Phase 3: R → Syn(R) → L        -- Synthesis: convergence, divergence, assessment
```

**Key differences from standalone /prothesis**:
- Continues automatically to Format phase after Synthesis
- Lens L becomes input for content generation

Reference: `~/.claude/plugins/.../prothesis/commands/prothesis.md`

### 4. Format Decision

Present output options:
- Blog Post (Korean/English)
- Essay
- Newsletter
- Thread

### 5. Draft Generation

Write initial draft to `drafts/` directory:
- Filename: `YYYY-MM-DD-{topic-slug}.md`
- Structure: Hook → Context → Framework → Application → Implications

### 6. Iterative Refinement

Loop on user feedback:
- Incremental changes → Edit directly
- Structural changes → Generate option versions (A, B, C)

Exit conditions:
- User approval
- Explicit "finalize" command

### 7. Gap Detection

Invoke /syneidesis for final validation:
- Procedural gaps
- Consideration gaps
- Duplicate content

### 8. Finalization

Apply final edits. Optionally clean intermediate versions.

## Quality Criteria

| Metric | Limit |
|--------|-------|
| Concepts per section | ≤3 |
| Framework components | ≤5 |
| Abstraction layers | ≤2 |

## Content Transformation

### What Becomes Content

| Session Element | Blog Element |
|-----------------|--------------|
| Problem context | Opening hook |
| Multi-perspective analysis | Framework structure |
| Convergence points | Core thesis |
| Divergence points | Discussion sections |
| Resolution approach | Actionable methodology |

### What Gets Filtered

- Tool invocations, command outputs
- Trial-and-error debugging steps
- Redundant restatements
- Context-specific details (paths, configs)

## Integration

This skill integrates with:
- **/prothesis** — Multi-perspective analysis (Phases 1-3)
- **/syneidesis** — Gap detection (Phase 7)

## Additional Resources

For detailed workflow steps and content transformation rules:
- **`references/workflow.md`** — Complete phase descriptions
