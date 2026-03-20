---
name: frame
description: "Multi-perspective investigation. Recommends analytical lenses or assembles a team to analyze from selected viewpoints when the right framework is absent, producing a framed inquiry. Type: (FrameworkAbsent, AI, SELECT, Inquiry) → FramedInquiry. Alias: Prothesis(πρόθεσις)."
---

# Prothesis Protocol

Resolve absent frameworks by placing available epistemic perspectives before the user, enabling lens selection prior to any perspective-requiring cognition. Type: `(FrameworkAbsent, AI, SELECT, Inquiry) → FramedInquiry`.

## Definition

**Prothesis** (πρόθεσις): A dialogical act of presenting available epistemic perspectives as options when the appropriate framework is absent, enabling selection before any perspective-requiring cognition.

```
── FLOW ──
Prothesis(U) → Q(MB(U), M) → (MBᵥ, m) → G(MBᵥ) → C → {P₁...Pₙ}(C, MBᵥ) → S → Pₛ → LensEstablished →
  T(Pₛ) → ∥I(T) → R → Ω(T) → R' → P(R') → Δ(R') → Δₛ → D?(Δₛ, T) → Dᵣ → Syn(R', Dᵣ) → L → O(L) → Q(routing) → J → FramedInquiry

── MORPHISM ──
Inquiry
  → confirm(mission_brief)              -- validate inquiry framing with user
  → gather(context)                     -- targeted context acquisition guided by MBᵥ
  → propose(perspectives)               -- generate distinct analytical lenses from context
  → select(perspectives)                -- user chooses lenses via gate interaction
  → LensEstablished                     -- Mode 1 terminus; composable with downstream protocols
  → spawn(team)                         -- assemble perspective team via TeamCreate
  → inquire(parallel)                   -- isolated perspective analysis per teammate
  → collect(results)                    -- finalize inquiry outputs, retain team
  → preview(results)                    -- surface collected findings before synthesis
  → dialogue(triggers) → reports        -- peer negotiation → structured dialogue reports
  → synthesize(results)                 -- horizon integration into Lens L
  → present(lens)                       -- full synthesis output to user
  → route(selection)                    -- user routing decision
  → FramedInquiry
requires: framework_absent(U)             -- runtime gate (Phase 0)
deficit:  FrameworkAbsent                  -- activation precondition (Layer 1/2)
preserves: U                               -- original request read-only
invariant: Placement over Prescription

── TYPES ──
U      = Underspecified request (purpose clear, approach unclear)
MB     = MissionBrief(U): { inquiry_intent, expected_deliverable, scope_constraint }  -- AI-inferred from U
Q(MB, M) = ConfirmAndSelect: (MB, ModeOptions) → (MBᵥ, m)  -- extern (combined gate interaction)
Q1(MB)   = Confirm: MB → MBᵥ                                -- Mission Brief confirmation component of Q
Q2(M)    = Select: ModeOptions → m                           -- Mode selection component of Q
           Q = Q1 × Q2 (composed in single gate interaction; Modify loop re-presents Q1 only)
MBᵥ    = Verified MissionBrief (user-confirmed)
m      = Mode ∈ {recommend, inquire}              -- lens recommendation vs. framed inquiry
G      = Gather: MBᵥ → C                       -- targeted context acquisition (guided by MBᵥ)
C      = Context (information for perspective formulation)
Pᵦ     = Pre-confirmed base perspectives (user-supplied in U; auto-included in Pₛ)
{P₁...Pₙ}(C, MBᵥ) = AI-proposed novel perspectives (Pᵢ ∉ Pᵦ; |Pᵦ| + n ≥ 2)
S      = Selection: {P₁...Pₙ} → Pₛ             -- extern (user choice; Pᵦ auto-included)
Pₛ     = Selected perspectives (Pₛ = Pᵦ ∪ sel({P₁...Pₙ}), |Pₛ| ≥ 2 when m=inquire; |Pₛ| ≥ 1 when m=recommend)
LensEstablished = Pₛ where lens selection complete  -- intermediate checkpoint; Mode 1 terminus (J=recommend), Mode 2 continues
T      = Team(Pₛ): TeamCreate → (∥ p∈Pₛ. Spawn(p)) -- agent team with shared task list
∥I     = Parallel inquiry: (∥ p∈T. Inquiry(p)) → R
Ω      = Collection: R → R', retain(T)               -- finalize results; team lifecycle deferred to loop
R      = Set(Result)                                  -- raw inquiry outputs
R'     = Set(Result) post-collection                  -- after Phase 3 collection
P      = Preview: R' → UserVisible(R')               -- per-perspective summary output before synthesis (text, not gate interaction)
Δ      = Trigger detection: R' → Δₛ                  -- produces named trigger set
Δₛ     = Set(Trigger)                                 -- detected triggers: contradictions, horizon intersections, uncorroborated high-stakes
D?     = Conditional dialogue: Δₛ ≠ ∅ → peer negotiation → structured report → conditional hub-spoke → Dᵣ; Δₛ = ∅ → skip dialogue (Dᵣ = ∅)
Dᵣ     = Set(DialogueReport)                          -- peer negotiation outputs
DialogueReport = { perspective, final_position, agreement, divergence, rationale }  -- divergence gates hub-spoke conditional
Syn    = Synthesis: (R', Dᵣ) → (∩, D, A)             -- dual-input: provenance-preserving (Dᵣ = ∅ when Δₛ = ∅)
L      = Lens { convergence: ∩, divergence: D, assessment: A }
O      = Output: L → UserVisible(L)                   -- full synthesis presentation as text output before routing question
FramedInquiry = L where (|Pₛ| ≥ 1 ∧ user_wrap_up) ∨ user_withdraw ∨ user_esc  -- Mode 2 terminal; Mode 1 terminates at LensEstablished (deficit remains open)
user_wrap_up  = (J = wrap_up) at Phase 4   -- user selects wrap_up routing option
user_withdraw = J = withdraw at Phase 4    -- user selects graceful exit (team cleanup)
user_esc      = Esc key at any phase       -- tool-level termination (no cleanup)
J      = Routing ∈ {extend, add_input, wrap_up, withdraw}  -- Phase 4 routing decision (post-merge)
J_mb   = MissionBriefRouting ∈ {confirm, modify(field)}  -- Phase 0 routing decision
PF     = preserve_findings: (T, L) → PF Qc(select categories)                       -- returns selected; TaskCreate is post-TeamDelete step

── U-BINDING ──
bind(U) = explicit_arg ∪ colocated_expr ∪ prev_user_turn ∪ ai_identified_request
Priority: explicit_arg > colocated_expr > prev_user_turn > ai_identified_request

/frame "text"                → U = "text"
/frame (alone)               → U = previous user message
"investigate... frame"       → U = text before trigger
AI-detected trigger           → U = request AI identified

Edge cases:
- Re-invoke: If Pₛ exists in context, offer as Pᵦ for new invocation

── PHASE TRANSITIONS ──
Phase 0:  U → MB(U) → Qc(MB, M) → Stop → (MBᵥ, m)              -- combined MB confirmation + mode selection [Tool]
Phase 1:  MBᵥ → G(MBᵥ) → C                                      -- targeted context acquisition
Phase 2:  (C, MBᵥ) → Sc({P₁...Pₙ}(C, MBᵥ)) → Stop → Pₛ → LensEstablished  -- perspective selection [Tool]
Phase 3:  LensEstablished → T[TeamCreate](Pₛ) → ∥Spawn[Task](T, Pₛ, MBᵥ) → ∥I[TaskCreate](T) → R → Ω[SendMessage](T) → R' → P(R')  -- inquiry + collection + preview [Tool]
Phase 4:  R' → Δ(R') → Δₛ → D?(Δₛ)[SendMessage](T) → Dᵣ → Syn(R', Dᵣ) → L → O(L) → Qc(routing) → Stop → J  -- triggers, cross-dialogue, synthesis, presentation & routing [Tool]
          J=wrap_up → PF Qc(select) → Stop → Ω → TeamDelete → TaskCreate(selected)  [Tool]

── LOOP ──
After Phase 0 (Mission Brief + Mode Selection):
  (MBᵥ, m) = Q result:
    m = recommend → Phase 1 → Phase 2 → LensEstablished → terminate
    m = inquire   → Phase 1 → Phase 2 → LensEstablished → Phase 3 → Phase 4
  J_mb = confirm       → proceed to Phase 1 with (MBᵥ, m)
  J_mb = modify(field) → re-present Q1(MB') → Stop → MBᵥ (m retained from initial selection)
  -- Esc key → terminate (no team exists)

After LensEstablished (mode branching):
  J = recommend → Mode 1 terminus. characterize(Pₛ) and terminate:
    characterize(Pₛ) = classify Pₛ by count tier:
      Pₛ.count = 1 → lightweight context modifier for downstream protocol
      Pₛ.count ≥ 2 → domain-narrowing (Tier 1) or escalate to Mode 2 (Tier 2)
  J = inquire → Continue to Phase 3 (team spawn → parallel inquiry → synthesis → FramedInquiry)

After Phase 4 (routing):
  J = extend     → Qc(add perspective | deepen existing | review execution results) → Stop
                   → Phase 2 (new perspective) or Phase 3 (SendMessage to existing team)
  J = add_input  → user context → revise Syn(R' + input, Dᵣ) → L' → O(L') → Qc(routing) → Stop
  J = wrap_up    → PF Qc(select) → Stop → Ω(T, shutdown) → TeamDelete → TaskCreate(selected) → terminate with L
  J = withdraw   → Ω(T, shutdown) → TeamDelete → terminate with current L
                   (withdraw = graceful exit, preserve_findings skipped)

Continue until convergence: user satisfied OR user withdraw OR user Esc key.
Convergence evidence: At wrap_up (Mode 2), present transformation trace — for each p ∈ Pₛ, show (FrameworkAbsent → p.contribution to L). At recommend terminus (Mode 1), present transformation trace — for each p ∈ Pₛ, show (FrameworkAbsent → p.selected as lens). Convergence is demonstrated, not asserted.

── BOUNDARY ──
Q(MB, M) (confirm+select) = extern: Mission Brief confirmation + mode selection boundary
G (gather)  = purpose: targeted context acquisition (guided by MBᵥ)
S (select)  = extern: user choice boundary
I (inquiry) = purpose: perspective-informed interpretation

── TOOL GROUNDING ──
-- Realization: present → TextPresent+Stop | AskUserQuestion (preferences)
Phase 0 Qc (extern)      → present (combined: Q1=Mission Brief confirmation, Q2=mode selection; Esc key → loop termination at LOOP level)
Sc (extern)              → present (mandatory; multiSelect: true; Esc key → loop termination at LOOP level)
T (parallel)             → TeamCreate tool (creates team with shared task list)
∥Spawn (parallel)        → Task tool (team_name, name: spawn perspective teammates)
∥I (parallel)            → TaskCreate/TaskUpdate (shared task list for inquiry coordination)
Phase 3 P (preview)      → Internal operation (text output: per-perspective epistemic contribution + key finding summaries; no gate interaction)
Phase 4 Δ (detect)       → Internal operation (trigger check: contradictions, horizon intersections, uncorroborated high-stakes)
Phase 4 D? (conditional) → SendMessage tool (type: "message", coordinator signals tension topic to peer pair → peer exchange → structured report → conditional hub-spoke; skip if Δₛ = ∅)
Phase 4 O (output)       → Internal operation (text output: full synthesis — convergence, divergence, integrated assessment)
Phase 4 Qc (extern)      → present (routing only: extend/add_input/wrap_up/withdraw options; Esc key → loop termination at LOOP level)
PF Qc (extern)           → present (multiSelect: preservation scope; in LOOP wrap_up path only)
wrap_up TaskCreate (state) → TaskCreate (session-scoped: PF-selected findings, created after TeamDelete clears team context)
Ω (extern)               → SendMessage tool (type: "shutdown_request", graceful teammate termination)
Λ (state)                → TaskCreate/TaskUpdate (mandatory after Phase 3 spawn, per perspective; TaskUpdate for status tracking)
G (gather)               → Read, Glob, Grep (targeted context acquisition, guided by MBᵥ)
Phase 4 Syn (synthesis)  → Internal operation (no external tool)
characterize (internal)  → Internal operation (perspective count tier classification)

── ELIDABLE CHECKPOINTS ──
-- Axis: Qc/Qs = answer space; always_gated/elidable = regret profile
Phase 0 Qc (MB+mode)    → elidable when: user_invoked ∧ explicit_arg(U)
                           default: (Q1=confirm, Q2=ai_recommended_mode)
                           regret: bounded (Phase 2 Sc always gated; J_mb=modify on re-invoke)
Phase 2 Sc (perspective) → always_gated (Qc: lens selection is epistemic choice)
Phase 4 Qc (routing)     → always_gated (Qc, unbounded-regret: loop path + team lifecycle)
PF Qc (preserve)         → always_gated (Qc, unbounded-regret: knowledge preservation scope)

── CATEGORICAL NOTE ──
∩ = meet (intersection) over comparison morphisms between perspective outputs
D = join (union of distinct findings) where perspectives diverge
A = synthesized assessment (additional computation)

── MODE STATE ──
Λ = { phase: Phase, mode: Mode, mission_brief: Option(MBᵥ), perspectives: Option(Pₛ), triggers: Option(Δₛ), dialogue_reports: Option(Dᵣ), lens: Option(L), active: Bool, team: Option(TeamState) }
Mode ∈ {recommend, inquire}                       -- Λ.mode resolved in Phase 0 Q
TeamState = { name: String, members: Set(AgentRef), tasks: Set(TaskId) }
AgentRef  = { name: String, type: String, perspective: Option(String) }
```

## Core Principle

**Placement over Prescription**: AI places available perspectives before the user without prescribing which to adopt. User selects.

## Distinction from Other Protocols

| Protocol | Initiator | Deficit → Resolution | Focus |
|----------|-----------|----------------------|-------|
| **Prothesis** | AI-guided | FrameworkAbsent → FramedInquiry | Perspective selection |
| **Syneidesis** | AI-guided | GapUnnoticed → AuditedDecision | Decision-point gaps |
| **Hermeneia** | Hybrid | IntentMisarticulated → ClarifiedIntent | Expression clarification |
| **Telos** | AI-guided | GoalIndeterminate → DefinedEndState | Goal co-construction |
| **Horismos** | AI-guided | BoundaryUndefined → DefinedBoundary | Epistemic boundary definition |
| **Aitesis** | AI-guided | ContextInsufficient → InformedExecution | Context sufficiency sensing |
| **Analogia** | AI-guided | MappingUncertain → ValidatedMapping | Abstract-concrete mapping validation |
| **Prosoche** | User-initiated | ExecutionBlind → SituatedExecution | Execution-time risk evaluation |
| **Epharmoge** | AI-guided | ApplicationDecontextualized → ContextualizedExecution | Post-execution applicability |
| **Katalepsis** | User-initiated | ResultUngrasped → VerifiedUnderstanding | Comprehension verification |

**Key difference**: Prothesis operates at the framework-selection level — choosing which analytical lenses to apply — while all other protocols operate within an already-established framework. It is also the only protocol that can assemble a multi-agent team for parallel perspective analysis (Mode 2) or provide lightweight lens recommendations (Mode 1). Syneidesis surfaces gaps in a decision, Aitesis verifies execution context, but both assume the analytical lens is already chosen. Prothesis is the protocol that chooses the lens.

## Mode Activation

### Activation

Command invocation activates mode until session end.

**Activation layers**:
- **Layer 1 (User-invocable)**: `/frame` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: Purpose present but approach unspecified; multiple valid frameworks detected via in-protocol heuristics.

### Priority

<system-reminder>
When Prothesis is active:

**Supersedes**: Immediate analysis patterns in loaded instructions
(Perspective Selection must complete before analysis begins)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: Before analysis, present perspective options via gate interaction (Qc/Qs) and yield turn.
</system-reminder>

- Prothesis completes before other workflows begin
- Loaded instructions resume after perspective is established

**Protocol precedence**: Activation order position 5/9 (graph.json is authoritative source for information flow). Concern cluster: Analysis.

**Advisory relationships**: Receives from Horismos (advisory: BoundaryMap narrows framework selection scope). Provides to Syneidesis (advisory: perspective simulation provides gap detection context), Telos (advisory: perspective simulation improves goal definition), Aitesis (advisory: perspective simulation provides context inference recommendations), Analogia (advisory: perspective simulation provides mapping construction context). Katalepsis is structurally last.

Consult `references/conceptual-foundations.md` for design rationale (Plan Mode Integration, Distinction from Socratic Method, Parametric Nature, Specialization) and activation edge cases (per-message application rules, mode deactivation triggers, trigger/skip heuristics).

## Protocol

### Phase 0: Intent Confirmation (Mission Brief)

Construct a Mission Brief from the user's request and **present** it for confirmation via gate interaction.

**Do NOT skip this phase.** The Mission Brief is the primary context vehicle for teammate spawn prompts — it ensures agent-teams best practice ("give teammates enough context") is structurally guaranteed rather than depending on coordinator inference.

**Elidable confirmation**: When the user explicitly invoked `/frame "text"`, the Phase 0 gate interaction (Q) may be elided — the MB is still constructed from U, but proceeds without user confirmation. AI uses `J_mb=confirm` and `m=ai_recommended_mode` as defaults. Phase 2 S (perspective selection) remains always gated, providing a downstream correction opportunity. Elision does not apply to J=extend re-invocations within an active loop.

The coordinator infers the Mission Brief from U (the user's request):

- **Inquiry Intent**: What is being investigated and why
- **Expected Deliverable**: What form the output should take (e.g., code review, risk analysis, decision recommendation)
- **Scope Constraint**: What is included and excluded from analysis

Present the inferred Mission Brief as text output:
- **Intent**: [inferred inquiry intent]
- **Deliverable**: [inferred expected deliverable]
- **Scope**: [inferred scope constraint]

Then **present** the combined Q1+Q2:

```
Q1. Mission Brief:
1. **Confirm** — proceed with this Mission Brief
2. **Modify intent** — adjust what is being investigated
3. **Modify deliverable** — adjust the expected output form
4. **Modify scope** — adjust inclusions/exclusions

Q2. Mode:
1. **Recommend** (Recommended) — lightweight lens recommendation (no team assembly)
2. **Inquire** — full multi-perspective investigation with agent team
```

**Pre-fill from explicit text**: `/frame "text"` → pre-fill from provided text, still confirm.

**Combined question**: Mission Brief confirmation and Mode selection are combined into a single gate interaction:
- Q1 (Mission Brief): MB confirmation/modification (4 options)
- Q2 (Mode): Recommend / Inquire (2 options)
AI places the recommended Mode as Q2's first option with "(Recommended)" suffix based on inquiry characteristics:
- Simple / binary comparison / debugging → Recommend recommended
- Complex / multi-perspective / deep analysis → Inquire recommended

**Mode 1 (Recommend)**: Per LOOP — terminates at Phase 2. No team. Pₛ is an intermediate output (not a resolution) — the deficit `FrameworkAbsent` remains open until a downstream protocol completes its own resolution using Pₛ as context.

**Mode 2 (Inquire)**: Per LOOP — full Phase 0 through Phase 4 cycle.

**Distinction from other protocols**: Phase 0 operates at the operational layer (structuring context for agent-teams), not the epistemic layer. Hermeneia resolves intent-expression gaps (user-initiated or AI-detected trigger); Telos co-constructs goals from vague intent. Phase 0 packages confirmed intent into a structured vehicle for teammate consumption — a prerequisite for quality spawn prompts, not a substitute for intent clarification or goal construction.

### Phase 1: Context Gathering

Gather context sufficient to formulate distinct perspectives, **guided by MBᵥ**.

MBᵥ.inquiry_intent and MBᵥ.scope_constraint direct which files, systems, and domains to investigate. Do not proceed to Phase 2 until context is established.

### Phase 2: Prothesis (Perspective Placement)

After context gathering (Phase 1), **present** perspectives via gate interaction with `multiSelect: true`.

**Do NOT bypass the gate.** Structured presentation with turn yield is mandatory — presenting content without yielding for response = protocol violation.

Each perspective is an **individual option**. Do not pre-combine perspectives into composite options (e.g., "All three", "1+2 only"). The user selects one or more perspectives directly.

```
question: "Which lens(es) for this inquiry?"
multiSelect: true
options:
  - label: "[Perspective A]"
    description: "[distinctive analytical contribution - 1 line]"
  - label: "[Perspective B]"
    description: "[distinctive analytical contribution - 1 line]"
  - label: "[Perspective C]"
    description: "[distinctive analytical contribution - 1 line]"
```

**Perspective selection criteria**:
- Each offers a **distinct epistemic framework** (not variations of same view)
- **Productive tension**: Perspectives should enable meaningful disagreement—differing in interpretation, weighing, or application, even if sharing some evidence
- **Commensurability minimum**: At least one shared referent, standard, or vocabulary must exist between perspectives to enable Phase 4 synthesis
- **Deliverable-aligned**: Perspectives should produce assessments relevant to MBᵥ.expected_deliverable
- **Critical viewpoint** (when applicable): Include when genuine alternatives exist; omit when perspectives legitimately converge
- Specific enough to guide analysis (not "general expert")
- Named by **discipline or framework**, not persona

Optional dimension naming (apply when initial generation seems redundant):
- Identify epistemic axes relevant to this inquiry
- Dimensions remain revisable during perspective generation

**Pre-suggested perspective handling**: When the user supplies perspectives in U (e.g., naming specific agents, frameworks, or roles), treat these as **pre-confirmed base perspectives** (Pᵦ):

- Pᵦ are **auto-included** in Pₛ — do not re-present them as selectable options
- Gate interaction presents only AI-proposed novel perspectives ({P₁...Pₙ} where Pᵢ ∉ Pᵦ)
- State Pᵦ in the question text as context (e.g., "Base: [Pᵦ names]. Which additional lens(es)?")
- AI must propose at least 1 novel perspective when Pᵦ ≠ ∅ — re-presenting known perspectives as options saturates the finite option space and structurally conceals unknown unknowns

**Mode 1 termination**: When Recommend was selected in Phase 0, Phase 2 is the terminal phase. After Pₛ selection:

1. Output selected perspectives with brief characterization per LOOP `characterize`
2. Note escalation path: "For deeper isolated analysis, re-invoke `/frame` — Pₛ will transfer as Pᵦ"

Per LOOP Pₛ count tiers for escalation recommendation. Post-convergence suggestions per `### Post-Convergence Suggestions`.

### Phase 3: Inquiry (Through Selected Lens)

**Plan mode**: When active, `TeamCreate` is unavailable — `Plan` subagents (per perspective) and `Explore` subagent (context) remain available. See `references/conceptual-foundations.md` for Phase 3 degradation behavior (`ExitPlanMode` presents Plan subagent analyses as plan output; actual Lens L requires a fresh `/frame` session from Phase 0 in normal mode).

**Team Setup**

Create an agent team and spawn perspective teammates:

1. Call TeamCreate to create a team (e.g., `prothesis-inquiry`)
2. For each selected perspective, call Task with `team_name` and `name` to spawn a teammate

Teammates do not inherit the lead's conversation history. Each spawn prompt MUST include the Mission Brief and Phase 1 context (gathered information, key constraints, domain specifics) alongside the question — without this, teammates lack the context needed for informed analysis.

Each teammate receives the perspective prompt template:

```
You are a **[Perspective] Expert**.

**Mission Brief**:
- Intent: {MBᵥ.inquiry_intent}
- Deliverable: {MBᵥ.expected_deliverable}
- Scope: {MBᵥ.scope_constraint} — constrain your analysis to this boundary

Analyze from this epistemic standpoint:

**Context**: {Phase 1 gathered context — key constraints, domain, relevant facts}
**Question**: {original question verbatim}

Provide:
1. **Epistemic Contribution**: What this lens uniquely reveals (2-3 sentences)
2. **Framework Analysis**: Domain-specific concepts, terminology, reasoning
3. **Horizon Limits**: What this perspective cannot see or undervalues
4. **Assessment**: Direct answer from this viewpoint, aligned with the expected deliverable

**Output grounding**: Every table cell, list item, and comparison point must contain
substantive content — real data, file paths, specific scenarios, or quantified evidence.
Self-check: if a cell could be replaced by "TBD" without changing meaning, it lacks substance.
Exception: when the inquiry explicitly requires abstract/general patterns, prioritize breadth
over specificity.

Cross-dialogue: The coordinator may signal a tension topic and connect you
with another perspective for direct exchange (≤3 messages per pair).
Exchange directly — present your position, engage with the other's reasoning.
After exchange, submit a structured report to the coordinator:
- Final position: your concluded stance
- Agreement points: what you agreed on
- Remaining divergence: unresolved disagreements (empty if fully agreed)
- Rationale: why you hold this position
If divergence remains, the coordinator may ask one follow-up question —
respond with specific evidence or impact analysis.
Do not initiate cross-dialogue unprompted.
```

Multiple selections → parallel teammates (never sequential).

**TaskCreate per perspective** (mandatory): After spawning each perspective teammate, the coordinator MUST call TaskCreate for that perspective — one task per perspective. This enables progress tracking via TaskList/TaskUpdate during inquiry, and ensures team coordination is observable rather than implicit. The task subject should identify the perspective; the description should include the inquiry question and scope.

**Inquiry**

Teammates analyze independently. Results arrive via idle notifications.

**Collection and Preview**

Collect inquiry results into R'. Team remains active — shutdown/retain decisions are deferred to the LOOP section after Phase 4 routing, where the user's sufficiency judgment determines team lifecycle.

**Preview P(R')**: After collecting R', output a per-perspective summary as text before proceeding to Phase 4. This is the user's first visibility into isolated inquiry results — enabling evaluation of subsequent synthesis fidelity.

```
## Perspective Reports

### [Perspective A]: [Epistemic Contribution title]
[2-3 sentence summary of key findings + assessment]
**Horizon Limits**: [What this lens missed]

### [Perspective B]: [Epistemic Contribution title]
[2-3 sentence summary of key findings + assessment]
**Horizon Limits**: [What this lens missed]
```

This is informational text output — not a gate interaction. The coordinator summarizes each perspective's output (not verbatim teammate content) to control rendering length while preserving epistemic contribution visibility.

#### Isolated Context Requirement

Each perspective MUST be analyzed in isolated teammate context. See `references/isolation-rationale.md` for the full rationale (cross-perspective contamination prevention, structural necessity, and isolation trade-offs).

### Phase 4: Cross-Dialogue & Synthesis

After collecting all perspective results (R'), the coordinator reviews for cross-dialogue triggers and synthesizes findings.

**Cross-Dialogue (Peer Negotiation)**

The coordinator explicitly checks R' for cross-dialogue triggers (per TYPES `Δ`) before proceeding to synthesis.

**If triggers detected**: Coordinator initiates peer negotiation with structured reporting:

1. **Topic signal**: Coordinator identifies the tension topic and sends it to the involved peer pair via SendMessage, including the structured report format (e.g., "Tension detected on [topic Z] between your perspectives. Exchange directly (≤3 messages), then each submit a structured report: final position / agreement points / remaining divergence / rationale.")
2. **Peer exchange**: Peers communicate directly (≤3 exchanges per pair; e.g., A→B, B→A, A→B). Each peer presents their position, responds to the other's reasoning, and works toward common ground. Peers may stop early if agreement is reached. The coordinator does not relay or frame — peers engage with each other's actual arguments.
3. **Structured report**: Each peer submits a 4-field report to the coordinator:
   - **Final position**: Peer's concluded stance after exchange
   - **Agreement points**: What the peers agreed on
   - **Remaining divergence**: Specific unresolved disagreements (empty if fully agreed)
   - **Rationale**: Why this position is held
4. **Conditional hub-spoke**: If any peer's `remaining_divergence` is non-empty, coordinator initiates hub-spoke reconciliation — one targeted question per divergent peer (e.g., "Peer B argues [X]. Explain the concrete impact of your position on [specific aspect]."). Each peer responds once. Coordinator does not re-engage after receiving responses — synthesis is independent. If `remaining_divergence` is empty for all peers, skip to step 5.
5. **Cross-dialogue outcomes** (text output, Dᵣ surfacing): After receiving all structured reports (and hub-spoke responses if applicable), output a summary of dialogue outcomes as text:

   ```
   ## Cross-Dialogue Outcomes

   ### Tension: [Topic Z]
   **Peers**: [Perspective A] vs [Perspective B]
   **Resolution**: [Agreed / Partial agreement / Persistent divergence]
   - Agreement: [key agreement points]
   - Divergence: [remaining unresolved points, if any]
   ```

   This is informational text — not a gate interaction. Skip this step if Δₛ = ∅ (no triggers detected).
6. **Synthesis**: Coordinator independently integrates all results — peer exchange outcomes, structured reports, and hub-spoke responses (if any) — into a unified assessment. The coordinator exercises independent judgment as Synthesizer: information collection from peers, but the integration decision is the coordinator's own.
7. **User review**: Output the full synthesis as text (O(L)), then **present** routing options via gate interaction. The user reads the complete synthesis with scrollback, then selects next action.

   **Step 1** — Text output O(L) (full synthesis, per Synthesis template below):
   Output the Framed Analysis as markdown text. No truncation risk — text output supports full rendering with scrollback.

   **Step 2** — Gate interaction (routing only):

   ```
   question: "How would you like to proceed?"
   options:
     - label: "Extend"
       description: "Add new perspective, deepen existing analysis, or review execution results"
     - label: "Add input"
       description: "Provide additional context for synthesis revision"
     - label: "Wrap up"
       description: "Finalize with current Lens"
     - label: "Withdraw"
       description: "Exit with current Lens (team cleanup, no findings preservation)"
   ```

**If no triggers**: Proceed to synthesis (step 6) with brief justification (e.g., "No contradictions, horizon intersections, or uncorroborated high-stakes findings detected"), then user review (step 7).

Cross-dialogue precedes synthesis so the coordinator evaluates all perspectives before integration. Trigger detection is an explicit checkpoint — not incidental discovery during synthesis.

**Synthesis (Horizon Integration)**

After cross-dialogue (R', Dᵣ), or directly from R' if no triggers (Dᵣ = ∅):

```markdown
## Framed Analysis

### Convergence (Shared Horizon)
[Where perspectives agree—indicates robust finding]

### Divergence (Horizon Conflicts)
[Where they disagree—different values, evidence standards, or scope]
[Cross-dialogue resolution status per tension topic, if applicable]
[If perspectives unexpectedly converged, note why distinct framing was nonetheless valuable]

### Integrated Assessment
[Synthesized answer with attribution to contributing perspectives]
[Distinguish findings from isolated inquiry (R') vs. cross-dialogue refinement (Dᵣ)]
```

Note: Perspective Summaries are surfaced earlier via P(R') preview (Phase 3 Collection). The synthesis template focuses on integration — convergence, divergence resolution, and assessment — rather than repeating individual perspective findings.

**Loop behavior**: Per LOOP. Key operational details:
- **Wrap up**: PF presents L categories (convergence, divergence, assessment highlights) via multiSelect gate interaction; selected items migrate to session TaskCreate after TeamDelete.

All other routing options (Extend, Add input, withdraw) and convergence behavior Per LOOP.

Consult `references/conceptual-foundations.md` for trigger/skip heuristics, Parametric Nature, and Specialization.

### Post-Convergence Suggestions

After convergence, scan session context for continuing epistemic needs and present suggestions as natural-language text (no gate interaction). Display only when at least one suggestion is actionable.

**Transformation check**: Before suggesting next protocols, briefly assess whether the selected perspectives changed the analytical approach. State in one sentence what shifted (e.g., "The security perspective revealed attack surface concerns that narrow the implementation options") or note that the original approach was confirmed from all selected viewpoints. This is informational text — not a gate interaction.

**Protocol suggestions**: Based on session context, suggest protocols whose deficit conditions are observable:

- Mode 2: L.divergence reveals unaddressed tensions → suggest `/gap` (gap audit on divergent findings)
- Mode 2: L.assessment reveals indeterminate goals → suggest `/goal` (goal co-construction from Lens insights)
- Mode 2: L.assessment contains abstract framework without domain-specific validation → suggest `/ground` (structural mapping validation)
- Mode 2: L.assessment contains actionable execution items with risk dimensions → suggest `/attend` (execution-time risk evaluation before acting on Lens findings)
- Mode 2: L.divergence reveals undefined epistemic boundaries → suggest `/bound` (epistemic boundary definition before proceeding)
- Mode 1: selected perspectives reveal unexplored domain tensions → suggest `/gap` (gap audit on perspective coverage)
- Mode 1: inquiry intent suggests indeterminate goals → suggest `/goal` (goal co-construction before deeper analysis)
- Mode 1: selected perspectives use abstract frameworks in user's specific domain → suggest `/ground` (structural mapping validation)
- Context insufficiency surfaced during session → suggest `/inquire` (pre-execution context verification)

**Next steps**: Based on the converged output, suggest concrete follow-up actions:

- Mode 1: note escalation path to Mode 2 for deeper isolated analysis
- Mode 2: summarize key findings from L (convergence, divergence, assessment highlights)
- Mode 2: if findings are execution-ready, note that `/attend` can orchestrate implementation with risk classification

**Display rule**: Omit this section entirely when (a) user explicitly moved to next task, (b) no observable deficit conditions exist in session context, or (c) the user has already invoked another protocol in the current or immediately preceding message. Suggestions are informational text, not gate interactions.

## Rules

1. **Mission Brief confirmation**: Always present Mission Brief for confirmation via gate interaction before context gathering (Phase 0 → Phase 1 gate). Pre-filled text (`/frame "text"`) still requires confirmation.
2. **Recognition over Recall**: Present structured options via gate interaction (Qc/Qs) and yield turn — structured content must reach the user with response opportunity. Bypassing the gate (presenting content without yielding turn) = protocol violation
3. **Epistemic Integrity**: Each perspective analyzes in isolated teammate context within an agent team; main agent direct analysis = protocol violation (violates isolation requirement). Mode 1 (recommend) is exempt — no team or isolation (Pₛ selection only). Phase topology per Rule 7
4. **Synthesis Constraint**: Integration only combines what perspectives provided; no new analysis
5. **Verbatim Transmission**: Pass original question unchanged to each perspective
6. **Sufficiency check**: After synthesis, output full Lens L as text O(L), then present routing options via gate interaction to confirm or extend analysis
7. **Phase-dependent topology**: Analysis (Phase 3) enforces strict isolation; cross-dialogue (Phase 4) uses peer-to-peer negotiation (≤3 exchanges/pair) → structured report → conditional hub-spoke (Synthesizer) → user review via gate interaction
8. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via gate interaction. The question contains only the essential question; options contain only option-specific differential implications. Embedding context in question fields = protocol violation
9. **No premature convergence**: Do not declare wrap_up (Mode 2) or recommend terminus (Mode 1) without presenting convergence evidence trace. "User satisfied" as assertion without per-perspective contribution evidence = protocol violation
10. **No silent framework dismissal**: If Phase 2 generation yields no candidate frameworks, present this finding with reasoning to user for confirmation before concluding — do not silently terminate
