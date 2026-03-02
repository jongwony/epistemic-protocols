---
name: calibrate
description: "Context-adaptive delegation calibration through scenario-based interview. Detects execution context to select entry mode (Solo/TeamAugment/TeamRestructure) and produces a DelegationContract. Alias: Epitrope(ἐπιτροπή)."
---

# Epitrope Protocol

Context-adaptive delegation calibration through scenario-based interview, detecting execution context to select appropriate entry mode. Type: `(DelegationAmbiguous, AI, CALIBRATE, TaskScope) → CalibratedDelegation`.

## Definition

**Epitrope** (ἐπιτροπή): A dialogical act of calibrating delegation boundaries through concrete scenario-based questions, where AI detects ambiguous delegation scope, identifies execution context (active team, team requiring restructure, or solo), and produces a DelegationContract covering structure (WHO), scope (WHAT), and autonomy (HOW MUCH).

```
── FLOW ──
Epitrope(T) → Ctx(T) → Q(propose_mode) → EntryMode →
  Solo:            Decompose(T) → {Dᵢ} → Scenario(Dᵢ) → Q → R → integrate(R) → DC → Q(DC) → approve
  TeamAugment:     inherit(T) → WHO?(T) → {Dᵢ} → Scenario(Dᵢ, T) → Q → R → integrate(R) → DC → Q(DC) → approve
  TeamRestructure: restructure(T) → {Dᵢ} → Scenario(Dᵢ, T') → Q → R → integrate(R) → DC → Q(DC) → approve
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
T'   = TaskScope (post-restructure: T with updated team membership)

── ENTRY TYPES ──
Phase ∈ {0, 1, 2, 3, 4}
EntryMode ∈ {TeamAugment, TeamRestructure, Solo}
         -- TeamAugment/TeamRestructure require team(Ctx)
Ctx   = DetectedContext { team: Option(TeamRef), lens: Option(L), complexity: Complexity }
L      = Lens { convergence: Set, divergence: Set, assessment: Any }  -- from Prothesis; Option(L) = None when standalone
TeamRef = { name: String, members: Set(AgentRef), tasks: Set(TaskId) }
AgentRef = { name: String, type: String, perspective: Option(String) }
Complexity ∈ {Single, Multi}
         -- Single ≡ fully specified step-by-step instructions OR task spans ≤ 1 ActionDomain
         -- Multi  ≡ ¬Single

── DELEGATION TYPES ──
Condition = { trigger: String, action: halt ∨ escalate }
DC    = DelegationContract {
          who: TeamStructure,
          what: Set(ActionDomain),
          how_much: Map(ActionDomain, R),
          halt_conditions: Set(Condition),
          exploration: ExplorationScope
        }
         -- Subagent inheritance: spawned agents inherit parent DC unless explicitly overridden
         -- invariant: dom(how_much) ⊇ what (uncalibrated domains filled by defaults in Phase 4)
TeamStructure ∈ {Solo, Augmented(TeamRef, Set(AgentRole)), Restructured(TeamRef, Set(AgentRole), Set(AgentRef))}
         -- |roles| ≥ 1 for Augmented/Restructured; |roles| ≤ 6 (WHO cap); Restructured: |TeamRef.members \ removed| ≥ 1
         -- guard: Phase 1 restructure redirects |retain|=0 → terminate (full removal = no team to calibrate)
AgentRole = { name: String, type: String, focus: String }
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
  Single(Ctx) ∧ ¬team(Ctx) → skip (delegation unambiguous; no DC produced)
  propose_mode(Ctx):
    team_active(Ctx)            → present(TeamAugment, TeamRestructure, Solo)  -- situation-dependent; no fixed default
    ¬team(Ctx) ∧ Multi(Ctx)    → propose Solo

Phase 1:  (mode-dependent)                                         -- structure + decomposition
  Solo:         T → decompose[Tool](T) → {Dᵢ}                      -- decomposition via Read/Grep
  TeamAugment:  T → inherit(Ctx.team) → WHO[AskUserQuestion](adjust?) → TeamStructure
                  → decompose(T) → {Dᵢ}                            [Tool]
  TeamRestructure: restructure[AskUserQuestion](T, Ctx.team) → |retain|=0 → terminate (full removal = no team to calibrate)  [Tool]
  TeamRestructure: restructure[AskUserQuestion](T, Ctx.team) → |retain|=|team| ∧ |new|=0 → reset(mode=TeamAugment) → Phase 1 TeamAugment  [Tool]
  TeamRestructure: T → restructure[AskUserQuestion](Ctx.team, T) → T' → decompose(T') → {Dᵢ}  [Tool]

Phase 2:  Dᵢ → template(Dᵢ, mode) → Sₖ → Q[AskUserQuestion](Sₖ) → R  -- scenario interview [Tool]

Phase 3:  R → integrate(R, DC) → DC'                              -- contract update (internal)

Phase 4:  DC' → Q[AskUserQuestion](DC', progress) → approve        -- contract review [Tool]

── LOOP ──
After Phase 0 (mode selection):
  mode_selected → Phase 1
  skip (Single ∧ ¬team) → terminate (delegation unambiguous; no DC produced)

After Phase 3: check uncalibrated domains.
If domains remain: return to Phase 2 (next domain or refinement).
If all calibrated or user ESC: proceed to Phase 4.

After Phase 4 (contract review):
  approve        → terminate with active DC (approval = authority replacement: DC replaces prior operating contract)
  adjust(who)    → return to Phase 1 (TeamAugment/TeamRestructure only; unavailable in Solo)
  adjust(domain) → return to Phase 2
  ESC            → terminate; partial DC applies to calibrated domains

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
Phase 0 Q   (extern)    → AskUserQuestion (mode selection: TeamAugment/TeamRestructure/Solo)
Phase 1 WHO (extern)    → AskUserQuestion (team structure: adjust)  -- TeamAugment
Phase 1 restructure (extern) → AskUserQuestion (team restructure: retain/remove/add + WHO confirmation)  -- TeamRestructure only
Phase 1     (detect)    → Read, Grep (task analysis for decomposition)
Phase 2 Q   (extern)    → AskUserQuestion (scenario with autonomy options)
Phase 3     (state)     → Internal DelegationContract update
Phase 4 Q   (extern)    → AskUserQuestion (contract review + approval)
inherit     (state)     → Read (team config: ~/.claude/teams/{name}/config.json)  -- TeamAugment

── MODE STATE ──
Λ = { phase: Phase, T: TaskScope, mode: EntryMode,
      ctx: DetectedContext, domains: Set(ActionDomain),
      calibrated: Set(ActionDomain), skipped: Set(ActionDomain),
      contract: DelegationContract, who_confirmed: Bool,
      history: List<(Dᵢ, Sₖ, R)>, active: Bool,
      team: Option(TeamRef) }
         -- calibrated ∪ skipped ⊆ domains; calibrated ∩ skipped = ∅
         -- who_confirmed: Solo → true (implicit); TeamAugment/TeamRestructure → set at Phase 1
         -- team: ctx.team is Phase 0 snapshot; team is live reference (inherited for TeamAugment, restructured for TeamRestructure)
```

## Core Principle

**Calibration over Declaration**: When delegation scope is ambiguous, calibrate boundaries through concrete scenarios rather than abstract declarations. Scenario-based questions ("When X happens, what should I do?") surface implicit preferences that abstract rules miss.

## Distinction from Other Protocols

| Protocol | Initiator | Deficit → Resolution | Focus |
|----------|-----------|----------------------|-------|
| **Prothesis** | AI-guided | FrameworkAbsent → FramedInquiry | Perspective selection |
| **Syneidesis** | AI-guided | GapUnnoticed → AuditedDecision | Decision-point gaps |
| **Hermeneia** | Hybrid | IntentMisarticulated → ClarifiedIntent | Expression clarification |
| **Telos** | AI-guided | GoalIndeterminate → DefinedEndState | Goal co-construction |
| **Aitesis** | AI-guided | ContextInsufficient → InformedExecution | Pre-execution context inquiry |
| **Epitrope** | AI-guided | DelegationAmbiguous → CalibratedDelegation | Delegation calibration |
| **Prosoche** | User-initiated | ExecutionBlind → SituatedExecution | Execution-time risk evaluation |
| **Epharmoge** | AI-guided | ApplicationDecontextualized → ContextualizedExecution | Post-execution applicability |
| **Katalepsis** | User-initiated | ResultUngrasped → VerifiedUnderstanding | Comprehension verification |

**Key differences**:
- **Telos** co-constructs goals when intent is indeterminate — Epitrope calibrates how much autonomy the AI should have for an already-defined goal
- **Aitesis** detects insufficient context for execution — Epitrope addresses ambiguous delegation scope (not missing context, but undefined authority)
- **Syneidesis** surfaces gaps in the user's decision — Epitrope surfaces gaps in the AI's mandate

**Delegation distinction**: Epitrope operates on an independent axis from the 6-stage epistemic workflow. Context insufficiency (Aitesis) asks "do I know enough?"; delegation ambiguity (Epitrope) asks "am I allowed to?". A task can have sufficient context but ambiguous delegation, or clear delegation but insufficient context.

## Mode Activation

### Activation

AI detects ambiguous delegation scope OR user calls `/calibrate`. Context detection (Phase 0) proposes an entry mode; calibration always requires user interaction via AskUserQuestion (Phase 0+).

**Activation layers**:
- **Layer 1 (User-invocable)**: `/calibrate` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: Ambiguous delegation scope detected via in-protocol heuristics. Context detection (Phase 0) proposes entry mode.

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

**Protocol precedence**: Default ordering places Epitrope after Telos and before Aitesis (Hermeneia → Telos → Epitrope → Aitesis → Prothesis → Syneidesis → Prosoche → Epharmoge; defined goals before delegation calibration, calibrated delegation before context verification). The user can override this default by explicitly requesting a different protocol first. Katalepsis is structurally last — it requires completed AI work (`R`), so it is not subject to ordering choices.

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
   - **team_active**: Present three options equally — TeamAugment, TeamRestructure, Solo — with situation-based descriptions
   - **no team**: Propose Solo (single-agent execution)
3. If only one domain with clear scope and no team: skip Epitrope (delegation unambiguous)

```
Execution context detected:

[Context summary: active team / no team, lens presence, complexity]

Options:
1. **TeamAugment** — keep current team, calibrate delegation (extend discussion, long Phase 4)
2. **TeamRestructure** — adjust team membership, then calibrate (peer review, role change, additional perspectives)
3. **Solo** — single-agent execution (protocol composition, different approach)
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

**TeamRestructure**: Inherit existing team, then restructure. **Call AskUserQuestion** presenting current members alongside task scope — user selects retain/remove per member and optionally proposes new roles. Constraint: `|retain| ≥ 1` (full removal terminates — no team to calibrate). Produces TeamStructure (Restructured variant), then decompose T' into applicable ActionDomains. Post-restructure flow mirrors TeamAugment from Phase 2 onward.

**WHO cap**: `|roles| ≤ 6` for any team structure.

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
- [role assignments]

**Autonomous** (proceed without asking):
- [list of calibrated autonomous actions]

**Report then act** / **Ask before** / **Halt conditions**:
- [as in Solo format]

**Authority transition**:
Approval replaces the team's prior operating contract with this DelegationContract.

Options:
1. **Approve** — apply this contract (authority replacement)
2. **Adjust** — I'd like to change something
```

If user selects "Adjust": present sub-options — "Adjust team structure" (→ Phase 1, TeamAugment/TeamRestructure only) or "Adjust domain calibration" (→ Phase 2). Solo mode only offers "Adjust domain calibration".

**Authority replacement**: Approval is not advisory — it replaces the team's prior operating contract (e.g., MissionBrief from Prothesis) with the DelegationContract. Execution-layer distribution (SendMessage, Task spawning) is handled by built-in commands after protocol termination.

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
| Full restructure guard | `TeamRestructure + \|retain\| = 0` → terminate (no team to calibrate) | Confirmed |
| No-change guard | `TeamRestructure + \|retain\| = \|team\| ∧ \|new\| = 0` → redirect to TeamAugment | Confirmed |
| Blanket escape | "Just do it" → immediate ESC, default autonomy | Confirmed |

## Rules

1. **AI-guided, user-calibrated**: AI detects ambiguous delegation; calibration requires user choice via AskUserQuestion (Phase 0/2/4)
2. **Recognition over Recall**: Always **call** AskUserQuestion tool to present concrete scenarios (text presentation = protocol violation)
3. **Selection over Detection**: User selects autonomy level from presented options; AI does not auto-calibrate
4. **Calibration over Declaration**: Concrete scenarios over abstract policy statements — "When X happens, should I..." beats "What's your general preference for..."
5. **Session-scoped**: DelegationContract applies for current session only; does not persist across sessions
6. **Domain priority**: Calibrate External first (highest impact), then FileModification, Strategy, Exploration
7. **Minimal interruption**: Skip calibration for single-domain clear-scope tasks; use Light intensity when possible
8. **ESC respected**: User can exit at any point; partial contract applies to calibrated domains. Uncalibrated defaults: Exploration → autonomous (read-only, inherently safe), others → ask-before. Defaults explicitly shown in Phase 4 contract review
9. **Convergence persistence**: Mode active until DelegationContract approved or ESC
10. **Cross-protocol awareness**: Calibrated DC informs but does not replace Aitesis context verification or Syneidesis gap surfacing
11. **Authority replacement**: DC approval replaces the team's prior operating contract; execution-layer distribution is outside protocol scope
12. **Solo backward compatibility**: Solo mode preserves near-identical behavior to v1.1.1 — Phase 0 adds one new user-facing step (mode selection, proposing Solo when no team is active); subsequent phases proceed identically to v1.1.1

## Cross-Protocol Interface

### Prothesis → Epitrope Transition

When Prothesis Phase 5 routing selects `J=calibrate`:

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
