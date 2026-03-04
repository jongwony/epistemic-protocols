# Cross-Protocol Interface

### Prothesis → Epitrope Transition

When Prothesis Phase 4 routing selects `J=calibrate`:

1. Coordinator calls `Skill("calibrate")` — Epitrope SKILL.md loads into conversation context
2. Epitrope Phase 0 detects `team_active` → presents TeamAugment, TeamRestructure, Solo options
3. Handoff via session context: `T = TaskScope` derived from conversation (original request U, verified MissionBrief MBᵥ, and Lens L are all available in session context; no explicit transfer type needed)

**Context availability** (present in session without explicit transfer):
- **Team**: `~/.claude/teams/{name}/config.json` (Read) — {name} from conversation context (mode-switch: coordinator retains team name) or Glob discovery (standalone: `~/.claude/teams/*/config.json`)
- **Lens L**: Conversation context (presented to user in Prothesis Phase 4)
- **Findings**: Team task list (TaskList/TaskGet access)
- **Mission brief**: Conversation context (confirmed in Prothesis Phase 0)

**DC authority transition**: At approval, the team's operating contract transitions from MissionBrief to DelegationContract. This is an epistemic handoff — the protocol produces the DC artifact; execution-layer application (SendMessage, Task spawning) is handled by built-in commands after protocol termination.

**Findings management**:

| Layer | Artifact | Created | Persistence |
|-------|----------|---------|-------------|
| Individual findings | Task items | Prothesis Phase 3 TaskCreate | Team task list (until TeamDelete) |
| Per-perspective results | R (raw results) | Phase 3 SendMessage collection | Conversation context |
| Convergence/divergence | L (Lens) | Phase 4 Syn | Conversation context |

When `J=calibrate`, TeamDelete is NOT called — task list persists for Epitrope reuse.

### Downstream Protocols

Approved DelegationContract becomes input to subsequent protocols:

- **Syneidesis**: Epitrope (planning layer: "am I allowed to?") and Syneidesis (execution layer: "is this decision sound?") operate on different temporal layers — they complement rather than suppress each other. `DC.how_much[d] = AskBefore` domains surface delegation-scope changes as gaps; autonomous domains do not suppress Syneidesis (execution gaps remain independent of delegation calibration)
- **Aitesis**: Delegation coverage (Epitrope) and context sufficiency (Aitesis) remain orthogonal axes. Interface deferred to Issue #57 (proactive Aitesis redesign)
