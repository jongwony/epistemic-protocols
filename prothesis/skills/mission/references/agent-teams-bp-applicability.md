# Agent-Teams Best Practice Applicability by Phase

Not all agent-teams best practices apply uniformly across Prothesis phases. This reference table maps which BPs are active, intentionally restricted, or not yet applicable at each phase — preventing compliance frame mismatch when evaluating phase-specific sessions.

| Best Practice | Phase 0-2 (Setup) | Phase 3 (Theoria) | Phase 4-5 (Cross-Dialogue + Synthesis + Routing) | Phase 6-7 (Praxis) |
|---------------|-------------------|-------------------|----------------------|---------------------|
| BP1: Context in spawn prompts | — | **Active** (Mission Brief in prompt) | — | **Active** (finding context in praxis prompt) |
| BP2: Distinct teammate roles | — | **Active** (perspective = role) | — | **Active** (praxis = role) |
| BP3: Wait for completion | — | **Active** (await all perspectives) | — | **Active** (await fix + verification) |
| BP4: Research-oriented tasks | — | **Active** (perspectives analyze) | — | Partial (praxis reads then acts) |
| BP5: Scope-limited tasks | — | **Active** (1 perspective = 1 scope) | — | **Active** (1 finding = 1 fix) |
| BP6: Mid-flight monitoring | — | Optional (coordinator may check) | — | Optional |
| BP7: Cross-dialogue | — | **Restricted** (strict isolation — no cross-dialogue) | **Active** (Phase 4 peer negotiation → structured report → conditional hub-spoke) | Phase-shifted (peer-to-peer for verification) |
| BP8: Graceful shutdown | — | — | Deferred to terminal | **Active** at terminal |
| BP9: Shared task list | — | **Active** (TaskCreate per perspective) | — | **Active** (TaskCreate per finding) |
| BP10: Cross-team communication | — | **Restricted** (isolation required) | — | **Active** (praxis ↔ perspectives) |
| BP11: Hook integration | Environment-dependent | Environment-dependent | — | Environment-dependent |
| BP12: Error handling | — | **Active** | — | **Active** |
| BP13: Team lifecycle | — | Team created | Team retained | Team retained until terminal |

**Reading this table**: "Restricted" means the BP is intentionally suppressed for epistemic reasons (not a compliance gap). "—" means the BP does not apply at that phase. "Environment-dependent" means the BP is configurable outside the protocol.
