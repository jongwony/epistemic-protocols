---
scope: platform-specific (Claude Code terminal)
---

# Ink Rendering Reference

> **Platform-bound to Claude Code terminal rendering. Not portable to other LLM platforms.**

Claude Code terminal rendering pipeline has 2-stage unknown HTML handling for `<Ink element="...">` style tags. Verified empirically on 2026-04-10 via PR #232 investigation chain: binary analysis → marked upstream Track A → live session Track B observation, all cross-validated.

**Stage 1 — marked library categorization**:
- Single-line `<Ink element="...">content</Ink>` → wrapped in `<p>` as inline HTML (marked case 1, 8)
- Multi-line `<Ink element="...">\ncontent\n</Ink>` → raw HTML block, NO `<p>` wrapping (marked case 5, 7)

**Stage 2 — Claude Code terminal renderer (likely `Renderer XaH` per binary symbols)**:
- `<p>`-wrapped inline HTML → tags stripped, text nodes preserved (user sees content only)
- Raw HTML blocks → **entire block silently dropped** (user sees nothing, no indicator, no warning)

**Why**: Standard terminal HTML-to-text conversion pattern. Not Ink-specific — applies to any unknown HTML block tag. `Renderer XaH` treats block HTML as "container to drop" and inline HTML as "text extractor".

**How to apply**:
- Never emit literal `<Ink element="...">` wrappers in protocol gate output. Block drop equals silent data loss, the worst failure mode.
- Emit structural content directly (dividers, headers, numbered options) without XML wrappers.
- When designing Output Styles or protocol templates with XML-like schema markers, add explicit "never emit literally" instruction to prevent interpretation ambiguity.
- Multi-line `<Ink>` blocks are especially dangerous — inline is at least recoverable through content visibility, but block drops leave zero trace.

**Symptom root cause attribution (2026-04-10 session)**:
- User reported "options did not appear": /ground Phase 2 M3 gate emitted as multiline `<Ink element="gate">` block → silently dropped → user saw zero options.
- User reported "I thought /ground had finished": same mechanism. Phase 2 gate invisible, so the Phase 1 plain-text table appeared as final output, creating the illusion of convergence.
- /clarify Phase 1b gate: identical failure mode.

**Related**:
- PR #232 (jongwony/epistemic-protocols): minimal hotfix via epistemic-ink.md line 27 prose clarification. Commit 011171e. Branch `hotfix/ink-rendering-ambiguity`.
- Option S (follow-up): schema marker complete removal from epistemic-ink.md for structural prevention of recurrence.
- Binary evidence: `<Ink element` string absent in Claude Code 2.1.94 through 2.1.100 (5 versions), strings extraction confirmed.
- Cross-verified chain: binary (95%) → marked upstream 18.0.0 Track A (~98%) → live Track B (~99.9%) — all converging on the schema-marker hypothesis.

**Confidence**: ~99.9%. Residual uncertainty is only edge cases (alternative Renderer XaH monkey-patch, bundled marked version divergence), neither of which changes the structural conclusion.
