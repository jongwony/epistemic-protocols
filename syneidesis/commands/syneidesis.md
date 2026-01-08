---
description: Activate gap-surfacing mode at decision points for this session
---

# /syneidesis

Invoke the syneidesis skill to activate gap-surfacing mode.

This activates Syneidesis protocol for the session:
1. Detect decision points (irreversible actions, high-stakes, scope keywords)
2. Scan for potential gaps (Procedural, Consideration, Assumption, Alternative)
3. Surface gaps via AskUserQuestion before proceeding
4. Adjust based on user judgment (Addresses/Dismisses/Silence)

**Mode persists** until session end or task completion.

**Dual-activation**: When both Prothesis and Syneidesis are active, Prothesis executes first. Syneidesis applies gap detection within the established perspective.

**Triggers**: "delete", "push", "deploy", "all", "every", "quickly", production, security, data
