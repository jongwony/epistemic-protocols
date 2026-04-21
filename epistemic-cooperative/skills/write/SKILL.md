---
name: write
description: Write blog posts from session insights with material recall and multi-perspective analysis.
skills:
  - anamnesis:recollect
  - prothesis:frame
  - syneidesis:gap
---

# Write Skill

Transform session insights and conceptual explorations into structured, publishable content through multi-perspective analysis and iterative refinement.

Invoke directly with `/write` when the user wants blog drafting from session insights.

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
RECOLLECT → PROTHESIS(Context→Perspective→Inquiry→Synthesis) → FORMAT → DRAFT → REFINE → VALIDATE → FINALIZE
```

| Phase | Tool | Decision Point |
|-------|------|----------------|
| Recollect | /recollect protocol | Prior session material recognition |
| Prothesis | /frame protocol | Context-derived perspectives, parallel inquiry |
| Format | AskUserQuestion | Output type, language |
| Draft | Write | — |
| Refine | Edit (loop) | User feedback |
| Validate | /gap | Gap detection |
| Finalize | Edit | — |

## Phase Execution

### 0. Material Recall (/recollect)

Invoke `/recollect` to surface prior session material relevant to the drafting topic — terminology coined in earlier sessions, prior decisions referenced, framings already established. The recalled context enriches the Phase 1-3 context acquisition (`G(U) → C`), improving perspective selection in the multi-perspective analysis.

This phase is conditional: skip silently when the drafting topic has no prior session footprint (e.g., entirely new domain). Anamnesis's internal Phase 0 scan determines applicability.

### 1-3. Prothesis Protocol (Multi-Perspective Analysis)

Apply the Prothesis protocol (/frame) for epistemic analysis:

```
Phase 0: G(U) → C              -- Context acquisition from session/topic
Phase 1: C → {P₁...Pₙ}(C) → Pₛ -- Perspectives derived FROM context (not predefined)
Phase 2: Pₛ → ∥I(Pₛ) → R       -- Parallel inquiry with Horizon Limits
Phase 3: R → Syn(R) → L        -- Synthesis: convergence, divergence, assessment
```

**Key differences from standalone /frame**:
- Continues automatically to Format phase after Synthesis
- Lens L becomes input for content generation

Reference: `prothesis/skills/frame/SKILL.md`

### 4. Format Decision

Present output options:
- Blog Post (Korean/English)
- Essay
- Newsletter
- Thread

### 5. Draft Generation

Write initial draft to `~/.claude/.write/` directory:
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

Invoke /gap for final validation:
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
- **/recollect** — Material recall (Phase 0)
- **/frame** — Multi-perspective analysis (Phases 1-3)
- **/gap** — Gap detection (Phase 7)

## Additional Resources

For detailed workflow steps and content transformation rules:
- **`references/workflow.md`** — Complete phase descriptions
