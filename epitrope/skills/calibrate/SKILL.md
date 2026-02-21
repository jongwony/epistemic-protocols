---
name: calibrate
description: "Calibrate delegation autonomy through scenario-based interview. Produces a DelegationContract when delegation scope is ambiguous. Alias: Epitrope(ἐπιτροπή)."
---

# Epitrope Protocol

Calibrate delegation autonomy through scenario-based interview. Type: `(DelegationAmbiguous, AI, CALIBRATE, TaskScope) → CalibratedAutonomy`.

## Definition

**Epitrope** (ἐπιτροπή): A dialogical act of calibrating delegation boundaries through concrete scenario-based questions, where AI detects ambiguous delegation scope and produces a DelegationContract through structured binary interview.

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
  Solo:         T → decompose(T) → {Dᵢ}                            -- decomposition (silent)
  TeamAugment:  T → inherit(Ctx.team) → Q[AskUserQuestion](WHO_adjust?) → TeamStructure
                  → decompose(T) → {Dᵢ}                            [Tool]
  TeamCreate:   T → decompose(T) → {Dᵢ}
                  → Q[AskUserQuestion](WHO_design, Dᵢ) → TeamStructure  [Tool]

Phase 2:  Dᵢ → template(Dᵢ, mode) → Sₖ → Q[AskUserQuestion](Sₖ) → R  -- scenario interview [Tool]

Phase 3:  R → integrate(R, DC) → DC'                              -- contract update (internal)

Phase 4:  DC' → Q[AskUserQuestion](DC', progress) → approve        -- contract review [Tool]

Phase 5:  (team modes only)                                        -- team application [Tool]
  TeamAugment: DC → apply_authority(DC, Ctx.team) → SendMessage[team](DC)
  TeamCreate:  DC → TeamCreate[tool](DC.who) → ∥Spawn[Task](DC.who.roles) → SendMessage[team](DC)

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
| **Epitrope** | AI-detected | DelegationAmbiguous → CalibratedAutonomy | Delegation boundary calibration |
| **Katalepsis** | User-initiated | ResultUngrasped → VerifiedUnderstanding | Comprehension verification |

**Key differences**:
- **Telos** co-constructs goals when intent is indeterminate — Epitrope calibrates how much autonomy the AI should have for an already-defined goal
- **Aitesis** detects insufficient context for execution — Epitrope addresses ambiguous delegation scope (not missing context, but undefined authority)
- **Syneidesis** surfaces gaps in the user's decision — Epitrope surfaces gaps in the AI's mandate

**Delegation distinction**: Epitrope operates on an independent axis from the 6-stage epistemic workflow. Context insufficiency (Aitesis) asks "do I know enough?"; delegation ambiguity (Epitrope) asks "am I allowed to?". A task can have sufficient context but ambiguous delegation, or clear delegation but insufficient context.

## Mode Activation

### Activation

AI detects ambiguous delegation scope OR user calls `/calibrate`. Detection is silent (Phase 0); calibration always requires user interaction via AskUserQuestion (Phase 1+).

**Delegation ambiguous** = task involves multiple action domains where autonomy level is not explicitly specified or inferable from existing instructions.

### Priority

<system-reminder>
When Epitrope is active:

**Supersedes**: Default autonomy assumptions in User Memory
(Delegation must be calibrated before multi-domain execution begins)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: At Phase 1, call AskUserQuestion tool to present scenario-based delegation questions.
</system-reminder>

- Epitrope completes before multi-domain execution proceeds
- User Memory rules resume after DelegationContract is approved or ESC

**Protocol precedence**: Default ordering places Epitrope after Telos (defined goals before delegation calibration) and before Aitesis (calibrated delegation before context verification). The user can override this default by explicitly requesting a different protocol first. Katalepsis is structurally last — it requires completed AI work (`R`), so it is not subject to ordering choices.

### Triggers

| Signal | Detection |
|--------|-----------|
| Multi-domain task with no explicit delegation cues | Task spans File + External + Strategy without prior calibration |
| Ambiguous scope keywords | "handle this", "take care of", "do what you think is best" |
| Prior wrong_approach or excessive_changes friction | History of autonomy misalignment in similar tasks |
| New project or unfamiliar codebase | No established delegation patterns |

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

### Phase 0: Task Decomposition (Silent)

Analyze the task to identify applicable action domains. This phase is **silent** — no user interaction.

1. **Read task description** and identify which ActionDomains are involved
2. If only one domain with clear scope: skip Epitrope (delegation unambiguous)
3. If multiple domains or unclear scope: identify applicable domains, proceed to Phase 1

**Decomposition scope**: Current task description, user instructions, and observable project context. Does NOT require proactive investigation.

### Phase 1: Scenario Interview

**Call the AskUserQuestion tool** to present the next uncalibrated domain as a concrete scenario.

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

### Phase 2: Contract Integration

After user response, update the DelegationContract:

1. Map response to contract field (e.g., FileModification + Autonomous → `DC.autonomous ∪ {FileModification}`)
2. Record `(Dᵢ, Sₖ, R)` in history
3. Check remaining uncalibrated domains
4. If domains remain: return to Phase 1 (next domain by priority)
5. If all calibrated or user ESC: proceed to Phase 3

### Phase 3: Contract Review

**Call the AskUserQuestion tool** to present the assembled DelegationContract for approval.

**Contract format**:

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

If user selects "Adjust": return to Phase 1 for the specified domain. If approved: apply contract to session.

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
| Question cap | `\|questions\| ≤ 9` (4 domains × 2 + wildcard 1) | Wildcard triggers on response variance within same domain |
| Cross-protocol fatigue | Telos triggered → reduce Epitrope to Light intensity | TBD |
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

## Cross-Protocol Interface

Approved DelegationContract becomes input to subsequent protocols:

- **Prothesis**: `DC.exploration` constrains agent team investigation scope; `DC.autonomous` domains allow agents to proceed without main-agent confirmation
- **Syneidesis**: Epitrope(planning layer: "am I allowed to?") and Syneidesis(execution layer: "is this decision sound?") operate on different temporal layers — they complement rather than suppress each other. `DC.ask_before` domains surface delegation-scope changes as gaps; `DC.autonomous` domains do not suppress Syneidesis (execution gaps remain independent of delegation calibration)
- **Aitesis**: Interface deferred to Issue #57 (proactive Aitesis redesign). Current reactive triggers are being redesigned; Epitrope should target the new Aitesis architecture. Delegation coverage (Epitrope) and context sufficiency (Aitesis) remain orthogonal axes

**Note**: Prothesis interface is design-ready. Syneidesis interface reflects planning/execution layer model (Gap audit, session c20ed886). Aitesis interface pending Issue #57. Actual enforcement is out of scope for v1.1.0.
