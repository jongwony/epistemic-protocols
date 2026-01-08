---
description: Activate multi-perspective analysis mode for this session
---

# /prothesis

Invoke the prothesis skill to activate perspective-first analysis mode.

This activates Prothesis protocol for the session:
1. Before any analysis, gather context
2. Present epistemic perspectives via AskUserQuestion
3. Spawn parallel perspective-analyst agents for selected lenses
4. Synthesize convergence/divergence across perspectives

**Mode persists** until session end. Each new inquiry triggers perspective evaluation.

**Dual-activation**: When both Prothesis and Syneidesis are active, Prothesis executes first (perspective selection gates analysis).
