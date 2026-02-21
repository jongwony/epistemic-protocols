---
name: calibrate
description: "Context-adaptive delegation calibration through scenario-based interview. Detects execution context to select entry mode (Solo/TeamAugment/TeamCreate) and produces a DelegationContract. Alias: Epitrope(ἐπιτροπή)."
---

# Epitrope Protocol

Context-adaptive delegation calibration through scenario-based interview, detecting execution context to select appropriate entry mode. Type: `(DelegationAmbiguous, AI, CALIBRATE, TaskScope) → CalibratedDelegation`.

## Definition

**Epitrope** (ἐπιτροπή): A dialogical act of calibrating delegation boundaries through concrete scenario-based questions, where AI detects ambiguous delegation scope, identifies execution context (active team, solo, or new team needed), and produces a DelegationContract covering structure (WHO), scope (WHAT), and autonomy (HOW MUCH).

```
── FLOW ──
Epitrope(T) → Ctx(T) → Q(propose_mode) → EntryMode →
  Solo:         Decompose(T) → {Dᵢ} → Scenario(Dᵢ) → Q → R → integrate(R) → DC → Q(DC) → approve
  TeamAugment:  inherit(T) → WHO?(T) → {Dᵢ} → Scenario(Dᵢ, T) → Q → R → integrate(R) → DC → Q(DC) → apply(DC, T)
  TeamCreate:   Decompose(T) → WHO(T) → {Dᵢ} → Scenario(Dᵢ) → Q → R → integrate(R) → DC → Q(DC) → create(DC) → apply(DC, T)
  → (loop until calibrated)

── TYPES ──
T    = TaskScope (task/project to calibrate delegation for)
Dᵢ   = ActionDomain ∈ {FileModification, Exploration, Strategy, External}
         -- FileModification.persistence ∈ {ephemeral, durable}
         --   ephemeral: temp files, build artifacts, generated code
         --   durable: source code, config, memory writes, CLAUDE.md, rules
Sₖ   = Scenario (concrete situation-based question)
R    = Response ∈ {Autonomous, ReportThenAct, AskBefore, Halt}
         -- Domain-specific refinements (⊆ base R):
         --   Minimal ⊆ Autonomous, ProposeThenChoose ⊆ ReportThenAct,
         --   SwitchAutonomously ⊆ Autonomous, AlwaysAsk ⊆ AskBefore

── ENTRY TYPES ──
EntryMode ∈ {TeamAugment, TeamCreate, Solo}
Ctx   = DetectedContext { team: Option(TeamRef), lens: Option(L), complexity: Complexity }
TeamRef = { name: String, members: Set(AgentRef), tasks: Set(TaskId) }
AgentRef = { name: String, type: String, perspective: Option(String) }
Complexity ∈ {Single, Multi}

── DELEGATION TYPES ──
DC    = DelegationContract {
          who: TeamStructure,
          what: Set(ActionDomain),
          how_much: Map(ActionDomain, R),
          halt_conditions: Set(Condition),
          exploration: ExplorationScope
        }
         -- Subagent inheritance: spawned agents inherit parent DC unless explicitly overridden
TeamStructure ∈ {Solo, Augmented(TeamRef, Set(AgentRole)), Created(Set(AgentRole), Topology)}
AgentRole = { name: String, type: String, focus: String }
Topology ∈ {HubSpoke, PeerReview, Pipeline}
ExplorationScope = { depth: N, breadth: N, drift_action: report | halt }
CalibratedDelegation = DC where (∀ d ∈ applicable: calibrated(d)) ∨ user_esc

── SCENARIO TEMPLATES ──
FileModification:  "When files need to be modified for this task?" → {Autonomous, ReportThenAct, AskBefore}
  └─ persistence: "When persistent files (config, memory, rules) need changes?" → {same R, may differ from ephemeral}
Exploration:       "When related information is found during investigation?" → {Autonomous, ReportThenAct, Minimal(⊆Autonomous)}
Strategy:          "When a different approach looks better than the original plan?" → {ProposeThenChoose(⊆ReportThenAct), SwitchAutonomously(⊆Autonomous)}
External:          "When git push or PR creation is needed?" → {Autonomous, AlwaysAsk(⊆AskBefore)}
(Each domain has refinement questions — hybrid question tree)

── SCENARIO TEMPLATES (team extension) ──
TeamCoordination:  "When agents' findings contradict?" → {Autonomous(resolve), ReportThenAct, AskBefore}
ScopeCreep:        "When agent discovers work outside its focus?" → {Autonomous(extend), ReportThenAct, Halt}

── PHASE TRANSITIONS ──
Phase 0:  T → detect(T) → Ctx → Q[AskUserQuestion](propose_mode(Ctx)) → EntryMode  -- mode selection [Tool]
  propose_mode(Ctx):
    team_active(Ctx)  → propose TeamAugment (Solo alternative)     -- independent of Lens presence
    ¬team(Ctx)        → propose Solo (TeamCreate alternative)      -- user may opt for team operation

Phase 1:  (mode-dependent)                                         -- structure + decomposition
  Solo:         T → decompose[Tool](T) → {Dᵢ}                      -- decomposition via Read/Grep
  TeamAugment:  T → inherit(Ctx.team) → WHO[AskUserQuestion](adjust?) → TeamStructure
                  → decompose(T) → {Dᵢ}                            [Tool]
  TeamCreate:   T → decompose(T) → {Dᵢ}
                  → WHO[AskUserQuestion](design, Dᵢ) → TeamStructure  [Tool]

Phase 2:  Dᵢ → template(Dᵢ, mode) → Sₖ → Q[AskUserQuestion](Sₖ) → R  -- scenario interview [Tool]

Phase 3:  R → integrate(R, DC) → DC'                              -- contract update (internal)

Phase 4:  DC' → Q[AskUserQuestion](DC', progress) → approve        -- contract review [Tool]

Phase 5:  (team modes only)                                        -- team application [Tool]
  TeamAugment: DC[SendMessage](team, DC) → apply_authority(DC, Ctx.team)             [Tool]  -- SendMessage=extern; apply_authority=state
  TeamCreate:  T[TeamCreate](DC.who) → ∥S[Task](DC.who.roles) → DC[SendMessage](team, DC)  [Tool]

── LOOP ──
After Phase 3: check uncalibrated domains.
If domains remain: return to Phase 2 (next domain or refinement).
If all calibrated or user ESC: proceed to Phase 4.

After Phase 4 (contract review):
  approve → Phase 5 (team modes) or terminate (Solo)
  adjust  → return to Phase 1 (WHO) or Phase 2 (domain)
  ESC     → terminate; partial DC applies to calibrated domains

After Phase 5 (team application):
  TeamAugment: authority applied → terminate with active DC
  TeamCreate:  team created + authority applied → terminate with active DC

── RECALIBRATION ──
recalibrate(DC, T') = new_domain_activated(T') ∨ stakes_escalated(T') ∨ team_topology_changed(T')
stakes_escalated(T') ≡ stakes(T') = High ∧ stakes(T) ∈ {Low, Med}
  -- Low→Med: no recalibration (interruption minimization)
  -- Low/Med→High: recalibration triggered

── WILDCARD ──
wildcard(history) = variance_detected(history) → +1 refinement question
variance_detected(h) ≡ ∃(Dᵢ, Sₖ, R₁), (Dᵢ, Sₖ', R₂) ∈ h : R₁ ≠ R₂ within same domain
|questions| ≤ 12 (Solo: 9, Team: 12)

── TOOL GROUNDING ──
Phase 0 Q   (extern)    → AskUserQuestion (mode selection: TeamAugment/TeamCreate/Solo)
Phase 1 WHO (extern)    → AskUserQuestion (team structure: adjust or design)  -- TeamAugment/TeamCreate
Phase 1     (detect)    → Read, Grep (task analysis for decomposition)
Phase 2 Q   (extern)    → AskUserQuestion (scenario with autonomy options)
Phase 3     (state)     → Internal DelegationContract update
Phase 4 Q   (extern)    → AskUserQuestion (contract review + approval)
Phase 5 T   (parallel)  → TeamCreate tool (create team from DC.who)           -- TeamCreate only
Phase 5 ∥S  (parallel)  → Task tool (spawn team members)                      -- TeamCreate only
Phase 5 DC  (extern)    → SendMessage tool (distribute DC to team)            -- team modes
apply_authority (state) → Internal state transition (MissionBrief authority → DelegationContract authority; no external tool)  -- TeamAugment
inherit     (state)     → Read (team config: ~/.claude/teams/{name}/config.json)  -- TeamAugment

── MODE STATE ──
Λ = { phase: Phase, T: TaskScope, mode: EntryMode,
      ctx: DetectedContext, domains: Set(ActionDomain),
      calibrated: Set(ActionDomain), skipped: Set(ActionDomain),
      contract: DelegationContract, who_confirmed: Bool,
      history: List<(Dᵢ, Sₖ, R)>, active: Bool,
      team: Option(TeamRef) }
```

## Core Principle

**Calibration over Declaration**: When delegation scope is ambiguous, calibrate boundaries through concrete scenarios rather than abstract declarations. Scenario-based questions ("When X happens, what should I do?") surface implicit preferences that abstract rules miss.

## Distinction from Other Protocols

| Protocol | Initiator | Deficit → Resolution | Focus |
|----------|-----------|----------------------|-------|
| **Prothesis** | AI-detected | FrameworkAbsent → FramedInquiry | Perspective options |
| **Syneidesis** | AI-detected | GapUnnoticed → AuditedDecision | Decision-point gaps |
| **Hermeneia** | User-initiated | IntentMisarticulated → ClarifiedIntent | Intent-expression gaps |
| **Telos** | AI-detected | GoalIndeterminate → DefinedEndState | Goal co-construction |
| **Aitesis** | AI-detected | ContextInsufficient → InformedExecution | Pre-execution context inquiry |
| **Epitrope** | AI-detected | DelegationAmbiguous → CalibratedDelegation | Context-adaptive delegation calibration |
| **Katalepsis** | User-initiated | ResultUngrasped → VerifiedUnderstanding | Comprehension verification |

**Key differences**:
- **Telos** co-constructs goals when intent is indeterminate — Epitrope calibrates how much autonomy the AI should have for an already-defined goal
- **Aitesis** detects insufficient context for execution — Epitrope addresses ambiguous delegation scope (not missing context, but undefined authority)
- **Syneidesis** surfaces gaps in the user's decision — Epitrope surfaces gaps in the AI's mandate

**Delegation distinction**: Epitrope operates on an independent axis from the 6-stage epistemic workflow. Context insufficiency (Aitesis) asks "do I know enough?"; delegation ambiguity (Epitrope) asks "am I allowed to?". A task can have sufficient context but ambiguous delegation, or clear delegation but insufficient context.

## Mode Activation

### Activation

AI detects ambiguous delegation scope OR user calls `/calibrate`. Context detection (Phase 0) proposes an entry mode; calibration always requires user interaction via AskUserQuestion (Phase 0+).

**Delegation ambiguous** = task involves multiple action domains where autonomy level is not explicitly specified or inferable from existing instructions, OR an active team exists without an explicit DelegationContract.

### Priority

<system-reminder>
When Epitrope is active:

**Supersedes**: Default autonomy assumptions in User Memory
(Delegation must be calibrated before multi-domain execution begins)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 0, call AskUserQuestion tool to present entry mode; at Phase 2, present scenario-based delegation questions.
</system-reminder>

- Epitrope completes before multi-domain execution proceeds
- User Memory rules resume after DelegationContract is approved or ESC

**Protocol precedence**: Default ordering places Epitrope after Telos (defined goals before context-adaptive delegation calibration) and before Aitesis (calibrated delegation before context verification). The user can override this default by explicitly requesting a different protocol first. Katalepsis is structurally last — it requires completed AI work (`R`), so it is not subject to ordering choices.

### Triggers

| Signal | Detection |
|--------|-----------|
| Multi-domain task with no explicit delegation cues | Task spans File + External + Strategy without prior calibration |
| Ambiguous scope keywords | "handle this", "take care of", "do what you think is best" |
| Prior wrong_approach or excessive_changes friction | History of autonomy misalignment in similar tasks |
| New project or unfamiliar codebase | No established delegation patterns |
| Active team without delegation contract | Team exists (e.g., from Prothesis) but DC not yet established |
| Prothesis J=calibrate transition | Coordinator calls Skill("calibrate") with active team |

**Skip**:
- Single-domain task with clear scope (e.g., "fix the typo on line 42")
- User explicitly says "just do it" or "proceed" (blanket autonomy)
- DelegationContract already exists for this session and covers the task domains
- Task is fully specified with explicit step-by-step instructions

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| DelegationContract approved | Apply contract to subsequent execution |
| User ESC | Return to default autonomy assumptions |
| User cancels | Discard partial contract, return to normal |

## Domain Taxonomy

| Domain | Scope | Example Actions |
|--------|-------|-----------------|
| **FileModification** | Creating, editing, deleting files | Write new modules, refactor existing code, delete unused files |
| ↳ *ephemeral* | Temp files, build artifacts, generated code | — (follows FileModification autonomy level) |
| ↳ *durable* | Source code, config, memory, CLAUDE.md, rules | May require different autonomy than ephemeral |
| **Exploration** | Reading files, searching codebase, web research | Grep for patterns, read adjacent files, fetch documentation |
| **Strategy** | Choosing implementation approach | Select architecture pattern, decide refactoring scope, pick library |
| **External** | Actions visible outside local environment | git push, PR creation, Slack messages, issue comments |

### Domain Priority

When calibrating, interview in this order (highest impact first):
1. **External** (highest): Hardest to reverse, visible to others
2. **FileModification**: Changes to codebase, tracked by git
3. **Strategy**: Approach decisions, affect scope of work
4. **Exploration** (lowest): Read-only, inherently safe

Only domains applicable to the current task are calibrated. Skip irrelevant domains.

## Protocol

### Phase 0: Context Detection and Mode Selection

Detect execution context and propose an entry mode. **Call the AskUserQuestion tool** to present the proposed mode.

1. **Detect context**: Check for active team (`~/.claude/teams/{name}/config.json`), existing Lens (from Prothesis), and task complexity
2. **Propose mode** based on detected context:
   - **team_active**: Propose TeamAugment (existing team can be reused with new authority); Solo as alternative
   - **no team**: Propose Solo (single-agent execution); TeamCreate as alternative if complexity warrants it
3. If only one domain with clear scope and no team: skip Epitrope (delegation unambiguous)

```
Execution context detected:

[Context summary: active team / no team, lens presence, complexity]

Options:
1. **[Proposed mode]** — [what this means]
2. **[Alternative mode]** — [what this means]
```

**TeamAugment independence from Lens**: TeamAugment is proposed whenever a team is active, regardless of whether a Lens exists. The Lens enriches context (available findings inform scenarios) but is not a gating condition — a team created for any purpose can benefit from delegation calibration.

### Phase 1: Structure and Decomposition

Mode-dependent phase:

**Solo**: Decompose task into applicable ActionDomains (silent — no user interaction). Proceed to Phase 2.

**TeamAugment**: Inherit existing team structure. **Call AskUserQuestion** to confirm or adjust WHO:
```
Current team: {team members and their perspectives}

Options:
1. **Keep team as-is** — retain current structure for execution
2. **Adjust roles** — modify member focus areas for the new task
```
Then decompose task into applicable ActionDomains.

**TeamCreate**: Decompose task into applicable ActionDomains first. Then **call AskUserQuestion** to design WHO:
```
Task domains identified: {list of ActionDomains}

Team structure proposal:
- [Role 1]: [focus] — [type]
- [Role 2]: [focus] — [type]

Options:
1. **Approve structure** — proceed with this team design
2. **Modify** — adjust roles, add, or remove members
```

**WHO cap**: `|roles| ≤ 6` for any team structure.
**Team mode fallback**: When TeamCreate is selected but `|Dᵢ| ≤ 2`, suggest Solo instead (team overhead exceeds benefit).

### Phase 2: Scenario Interview

**Call the AskUserQuestion tool** to present the next uncalibrated domain as a concrete scenario. Team modes include team-specific scenarios (TeamCoordination, ScopeCreep) alongside standard domain scenarios.

**Scenario format** (Akinator-style binary/ternary choice):

```
For this task, I'd like to calibrate how I should handle [domain]:

[Concrete scenario description relevant to the actual task]

Options:
1. **[Autonomy level A]** — [what this means in practice]
2. **[Autonomy level B]** — [what this means in practice]
3. **[Autonomy level C]** — [if applicable]
```

**Design principles**:
- **Concrete scenarios**: Use task-specific situations, not abstract policy questions
- **Binary/ternary**: Maximum 3 options per question (excluding "Other")
- **Refinement available**: After initial answer, may ask one follow-up for precision
- **Domain cap**: Maximum 4 domains per calibration session

**Refinement questions** (optional, one per domain):
- FileModification: "What about persistent files (config, memory, rules) vs. regular code changes?"
- Exploration: "How far should I look beyond the immediate task scope?"
- Strategy: "If I find a better approach mid-execution, should I...?"
- External: "Should I draft PR descriptions for your review or create directly?"

### Phase 3: Contract Integration

After user response, update the DelegationContract:

1. Map response to contract field (e.g., FileModification + Autonomous → `DC.how_much[FileModification] = Autonomous`)
2. Record `(Dᵢ, Sₖ, R)` in history
3. Check remaining uncalibrated domains
4. If domains remain: return to Phase 2 (next domain by priority)
5. If all calibrated or user ESC: proceed to Phase 4

### Phase 4: Contract Review

**Call the AskUserQuestion tool** to present the assembled DelegationContract for approval.

**Contract format** (Solo mode — WHAT + HOW MUCH):

```
Here's the delegation contract for this task:

**Autonomous** (I'll proceed without asking):
- [list of calibrated autonomous actions]

**Report then act** (I'll tell you what I'm doing, then proceed):
- [list of report-then-act actions]

**Ask before** (I'll ask for permission first):
- [list of ask-before actions]

**Halt conditions** (I'll stop and escalate):
- [list of halt conditions]

**Skipped** (not applicable to this task):
- [list of domains from Λ.skipped, if any]

**Defaults** (uncalibrated domains default):
- Exploration: autonomous (read-only, inherently safe)
- Others: ask-before

Options:
1. **Approve** — apply this contract
2. **Adjust** — I'd like to change something
```

**Contract format** (Team modes — WHO + WHAT + HOW MUCH):

```
Here's the delegation contract for this task:

**Team Structure** (WHO):
- [role assignments and topology]

**Autonomous** (proceed without asking):
- [list of calibrated autonomous actions]

**Report then act** / **Ask before** / **Halt conditions**:
- [as in Solo format]

**Authority confirmation**:
This contract will be distributed to the team via SendMessage.

Options:
1. **Approve** — apply this contract [and distribute to team]
2. **Adjust** — I'd like to change something
```

If user selects "Adjust": return to Phase 1 (WHO) or Phase 2 (domain). If approved: Solo terminates; team modes proceed to Phase 5.

**Authority confirmation**: TeamAugment requires explicit approval before DC distribution — the user must confirm before the team's operating contract changes.

### Phase 5: Team Application

Team modes only. After contract approval:

**TeamAugment**: Apply authority layer replacement to existing team. The team's operating contract transitions from its previous context (e.g., MissionBrief from Prothesis) to the DelegationContract. Call SendMessage to distribute DC to team members. Agents themselves are retained; the coordinator relationship shifts from "perspective collection" to "delegated execution within DC scope."

**TeamCreate**: Create team from DC.who specification. Call TeamCreate tool, then spawn team members via Task tool with appropriate roles and focus areas. Call SendMessage to distribute DC to all members.

Both modes terminate with active DC after distribution.

## Intensity

| Level | When | Format |
|-------|------|--------|
| Light | 1-2 domains, familiar task type | Single question covering key domain |
| Medium | 3+ domains, moderate ambiguity | Sequential domain interviews (1 question each) |
| Heavy | New project, history of friction, 4 domains | Full interview with refinement questions |

## UX Safeguards

| Rule | Structure | Threshold |
|------|-----------|-----------|
| Session immunity | Approved DC → skip recalibration for session | `¬recalibrate(DC, T')`: recalibrate only on `new_domain_activated ∨ stakes_escalated(→High)` |
| Domain cap | `\|domains\| ≤ 4` | Confirmed (taxonomy is exhaustive) |
| Question cap | `\|questions\| ≤ 12` (Solo: 9, Team: 12) | Wildcard triggers on response variance within same domain |
| Cross-protocol fatigue | `prior_protocol_count(session) ≥ 2` → reduce intensity one level | Confirmed |
| Prothesis mode-switch | `ctx.team ≠ ∅ ∧ ctx.lens ≠ ∅` → skip domains with unanimous Lens convergence | Confirmed |
| WHO cap | `\|roles\| ≤ 6` for any team structure | Confirmed |
| Team mode fallback | `TeamCreate + \|Dᵢ\| ≤ 2` → suggest Solo | Confirmed |
| Blanket escape | "Just do it" → immediate ESC, default autonomy | Confirmed |

## Rules

1. **AI-detected, user-calibrated**: AI detects ambiguous delegation; calibration requires user choice via AskUserQuestion (Phase 1/3)
2. **Recognition over Recall**: Always **call** AskUserQuestion tool to present concrete scenarios (text presentation = protocol violation)
3. **Selection over Detection**: User selects autonomy level from presented options; AI does not auto-calibrate
4. **Calibration over Declaration**: Concrete scenarios over abstract policy statements — "When X happens, should I..." beats "What's your general preference for..."
5. **Session-scoped**: DelegationContract applies for current session only; does not persist across sessions
6. **Domain priority**: Calibrate External first (highest impact), then FileModification, Strategy, Exploration
7. **Minimal interruption**: Skip calibration for single-domain clear-scope tasks; use Light intensity when possible
8. **ESC respected**: User can exit at any point; partial contract applies to calibrated domains. Uncalibrated defaults: Exploration → autonomous (read-only, inherently safe), others → ask-before. Defaults explicitly shown in Phase 3 contract review
9. **Convergence persistence**: Mode active until DelegationContract approved or ESC
10. **Cross-protocol awareness**: Calibrated DC informs but does not replace Aitesis context verification or Syneidesis gap surfacing
11. **Authority distribution**: DC must not be distributed to team members (SendMessage) before user approval in Phase 4
12. **Solo backward compatibility**: Solo mode preserves identical behavior to v1.1.1 — Phase 0 mode selection is the only new user-facing step, and it defaults to Solo when no team is active

## Cross-Protocol Interface

### Prothesis → Epitrope Transition

When Prothesis Phase 5 routing selects `J=calibrate`:

1. Coordinator calls `Skill("calibrate")` — Epitrope SKILL.md loads into conversation context
2. Epitrope Phase 0 detects `team_active` → proposes TeamAugment mode
3. No formal handoff type needed — session context provides implicit handoff

**Context availability** (present in session without explicit transfer):
- **Team**: `~/.claude/teams/{name}/config.json` (Read)
- **Lens L**: Conversation context (presented to user in Prothesis Phase 4)
- **Findings**: Team task list (TaskList/TaskGet access)
- **Mission brief**: Conversation context (confirmed in Prothesis Phase 0)

**Authority layer replacement**: The team's operating contract transitions from MissionBrief to DelegationContract. Agents remain; the coordinator relationship shifts from "perspective collection" to "delegated execution within DC scope."

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
