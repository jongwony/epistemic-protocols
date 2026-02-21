# Agent-Teams Best Practice Applicability by Phase

Not all agent-teams best practices apply uniformly across Prothesis phases. This reference table maps which BPs are active, intentionally restricted, or not yet applicable at each phase — preventing compliance frame mismatch when evaluating phase-specific sessions.

| Best Practice | Phase 0-2 (Setup) | Phase 3 (Theoria) | Phase 4-5 (Cross-Dialogue + Synthesis + Routing) |
|---------------|-------------------|-------------------|----------------------|
| BP1: Context in spawn prompts | — | **Active** (Mission Brief in prompt) | — |
| BP2: Distinct teammate roles | — | **Active** (perspective = role) | — |
| BP3: Wait for completion | — | **Active** (await all perspectives) | — |
| BP4: Research-oriented tasks | — | **Active** (perspectives analyze) | — |
| BP5: Scope-limited tasks | — | **Active** (1 perspective = 1 scope) | — |
| BP6: Mid-flight monitoring | — | Optional (coordinator may check) | — |
| BP7: Cross-dialogue | — | **Restricted** (strict isolation — no cross-dialogue) | **Active** (Phase 4 peer negotiation → structured report → conditional hub-spoke) |
| BP8: Graceful shutdown | — | — | **Active** at terminal (Ω shutdown) |
| BP9: Shared task list | — | **Active** (TaskCreate per perspective) | — |
| BP10: Cross-team communication | — | **Restricted** (isolation required) | — |
| BP11: Hook integration | Environment-dependent | Environment-dependent | — |
| BP12: Error handling | — | **Active** | — |
| BP13: Team lifecycle | — | Team created | Team retained until terminal or J=calibrate (Epitrope mode-switch) |

**Reading this table**: "Restricted" means the BP is intentionally suppressed for epistemic reasons (not a compliance gap). "—" means the BP does not apply at that phase. "Environment-dependent" means the BP is configurable outside the protocol. Praxis phases (formerly Phase 6-7) were extracted to Epitrope in v4.0.0.
