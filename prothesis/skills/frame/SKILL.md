---
name: frame
description: "Multi-perspective investigation. Assembles a team to analyze from selected viewpoints when the right framework is absent, producing a framed inquiry. Alias: Prothesis(πρόθεσις)."
---

# Prothesis Protocol

Resolve absent frameworks by placing available epistemic perspectives before the user, enabling lens selection prior to any perspective-requiring cognition. Type: `(FrameworkAbsent, AI, SELECT, Inquiry) → FramedInquiry`.

## Definition

**Prothesis** (πρόθεσις): A dialogical act of presenting available epistemic perspectives as options when the appropriate framework is absent, enabling selection before any perspective-requiring cognition.

```
── FLOW ──
Prothesis(U) → Q(MB(U)) → MBᵥ → G(MBᵥ) → C → {P₁...Pₙ}(C, MBᵥ) → S → Pₛ → T(Pₛ) → ∥I(T) → R → Ω(T) → R' → Δ(R') → D?(T) → R'' → Syn(R'') → Q(Syn) → L

── TYPES ──
U      = Underspecified request (purpose clear, approach unclear)
MB     = MissionBrief(U): { inquiry_intent, expected_deliverable, scope_constraint }  -- AI-inferred from U
Q(MB)  = Confirm: MB → MBᵥ                     -- extern (user confirmation/modification)
MBᵥ    = Verified MissionBrief (user-confirmed)
G      = Gather: MBᵥ → C                       -- targeted context acquisition (guided by MBᵥ)
C      = Context (information for perspective formulation)
Pᵦ     = Pre-confirmed base perspectives (user-supplied in U; auto-included in Pₛ)
{P₁...Pₙ}(C, MBᵥ) = AI-proposed novel perspectives (Pᵢ ∉ Pᵦ; |Pᵦ| + n ≥ 2)
S      = Selection: {P₁...Pₙ} → Pₛ             -- extern (user choice; Pᵦ auto-included)
Pₛ     = Selected perspectives (Pₛ = Pᵦ ∪ sel({P₁...Pₙ}), |Pₛ| ≥ 2)
T      = Team(Pₛ): TeamCreate → (∥ p∈Pₛ. Spawn(p)) -- agent team with shared task list
∥I     = Parallel inquiry: (∥ p∈T. Inquiry(p)) → R
Ω      = Collection: R → R', retain(T)               -- finalize results; team lifecycle deferred to loop
R      = Set(Result)                                  -- raw inquiry outputs
R'     = Set(Result) post-collection                  -- after Phase 3 collection
R''    = Set(Result) post-cross-dialogue              -- R' ∪ dialogue responses (R'' = R' when Δ = ∅)
Δ      = Trigger detection: R' → Set(Trigger)         -- contradictions, horizon intersections, uncorroborated high-stakes
D?     = Conditional dialogue: Δ ≠ ∅ → peer negotiation → structured report → conditional hub-spoke → user review; Δ = ∅ → skip dialogue (synthesis + user review still proceed)
Syn    = Synthesis: R'' → (∩, D, A)
L      = Lens { convergence: ∩, divergence: D, assessment: A }
FramedInquiry = L where (|Pₛ| ≥ 1 ∧ user_wrap_up) ∨ user_esc
user_wrap_up  = (J = wrap_up) at Phase 5   -- user selects wrap_up routing option
user_esc      = J = ESC at any phase        -- user selects ESC (Escape)

── PHASE TRANSITIONS ──
Phase 0:  U → MB(U) → Q[AskUserQuestion](MB) → await → MBᵥ     -- Mission Brief confirmation [Tool]
Phase 1:  MBᵥ → G(MBᵥ) → C                                      -- targeted context acquisition
Phase 2:  (C, MBᵥ) → present[S]({P₁...Pₙ}(C, MBᵥ)) → await → Pₛ  -- S: AskUserQuestion [Tool]
Phase 3:  Pₛ → T[TeamCreate](Pₛ) → ∥Spawn[Task](T, Pₛ, MBᵥ) → ∥I[TaskCreate](T) → R → Ω[SendMessage](T) → R'  -- inquiry + collection [Tool]
Phase 4:  R' → Δ(R') → D?[SendMessage](T) → R'' → Syn(R'') → Q[AskUserQuestion](Syn) → L  -- cross-dialogue, synthesis & review [Tool]
Phase 5:  L → Q[AskUserQuestion](routing) → await → J                          -- routing decision [Tool]

── LOOP ──
After Phase 0 (Mission Brief):
  J_mb = confirm       → Phase 1
  J_mb = modify(field) → re-present Q(MB') → await → MBᵥ → Phase 1
  J_mb = ESC           → terminate (no team exists)

After Phase 5 (routing):
  J = calibrate  → Activate[Skill]("calibrate") | fail → inform user; team retained; offer {extend, wrap_up}  -- fail ≡ Skill load error (plugin absent or malformed)
  J = extend     → Q[AskUserQuestion](add perspective | deepen existing) → Phase 2 or Phase 3 (team retained)
  J = wrap_up    → Ω(T, shutdown) → TeamDelete → terminate with L
                   → recommend_protocols(L)
  J = ESC        → Ω(T, shutdown) → TeamDelete → terminate with current L

recommend_protocols(L):
  L.divergence ≠ ∅ → suggest Syneidesis (gap audit) or Epitrope (calibrate delegation — provide task scope T when calling /calibrate)
  L.assessment reveals indeterminate goals → suggest Telos

Continue until convergence: user satisfied OR user ESC.

── BOUNDARY ──
Q(MB) (confirm) = extern: Mission Brief confirmation boundary
G (gather)  = purpose: targeted context acquisition (guided by MBᵥ)
S (select)  = extern: user choice boundary
I (inquiry) = purpose: perspective-informed interpretation

── TOOL GROUNDING ──
Phase 0 Q (extern)       → AskUserQuestion (Mission Brief confirmation; Esc → terminate)
S (extern)               → AskUserQuestion tool (mandatory; multiSelect: true; Esc → terminate with current L or no lens)
T (parallel)             → TeamCreate tool (creates team with shared task list)
∥Spawn (parallel)        → Task tool (team_name, name: spawn perspective teammates)
∥I (parallel)            → TaskCreate/TaskUpdate (shared task list for inquiry coordination)
Phase 4 Δ (detect)       → Internal operation (trigger check: contradictions, horizon intersections, uncorroborated high-stakes)
Phase 4 D? (conditional) → SendMessage tool (type: "message", coordinator signals tension topic to peer pair → peer exchange → structured report → conditional hub-spoke → independent synthesis; skip if Δ = ∅)
Phase 4 Q (extern)       → AskUserQuestion (synthesis result review + user additional input; proceeds to Phase 5 on confirm)
Ω (extern)               → SendMessage tool (type: "shutdown_request", graceful teammate termination)
Phase 5 Q (extern)       → AskUserQuestion (routing: calibrate/extend/wrap_up; Escape → terminate)
J=calibrate (extern)     → Skill tool (protocol transition: Activate[Skill]("calibrate") → activate Epitrope; in LOOP after Phase 5)
Λ (state)                → TaskCreate/TaskUpdate (mandatory after Phase 3 spawn, per perspective; TaskUpdate for status tracking)
G (gather)               → Read, Glob, Grep (targeted context acquisition, guided by MBᵥ)
Phase 4 Syn (synthesis)  → Internal operation (no external tool)

── CATEGORICAL NOTE ──
∩ = meet (intersection) over comparison morphisms between perspective outputs
D = join (union of distinct findings) where perspectives diverge
A = synthesized assessment (additional computation)

── MODE STATE ──
Λ = { phase: Phase, mission_brief: Option(MBᵥ), lens: Option(L), active: Bool, team: Option(TeamState) }
TeamState = { name: String, members: Set(AgentRef), tasks: Set(TaskId) }
AgentRef  = { name: String, type: String, perspective: Option(String) }
```

## Mode Activation

### Activation

Command invocation activates mode until session end.

### Priority

<system-reminder>
When Prothesis is active:

**Supersedes**: Immediate analysis patterns in User Memory
(Perspective Selection must complete before analysis begins)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: Before analysis, call AskUserQuestion tool to present perspective options.
</system-reminder>

- Prothesis completes before other workflows begin
- User Memory rules resume after perspective is established

**Protocol precedence**: Default ordering places Prothesis after Aitesis (Hermeneia → Telos → Epitrope → Aitesis → Prothesis → Syneidesis; established perspective contextualizes gap detection). The user can override this default by explicitly requesting a different protocol first. Katalepsis is structurally last — it requires completed result (`R`), so it is not subject to ordering choices.

### Per-Message Application

Every user message triggers perspective evaluation:

| Message Type | Action |
|--------------|--------|
| New inquiry | Prothesis |
| Follow-up within established lens | Continue with selected perspective |
| Uncertain | Default to Prothesis |

**Decision rule**: When uncertain whether perspective is established, default to Prothesis.

```
False positive (unnecessary question) < False negative (missed perspective)
```

### Mode Deactivation

| Trigger | Effect |
|---------|--------|
| Synthesis complete | Lens established; follow-ups continue within lens |
| User starts unrelated topic | Re-evaluate for new Prothesis |

Consult `references/conceptual-foundations.md` for Plan Mode Integration and Distinction from Socratic Method.

## Protocol

### Phase 0: Intent Confirmation (Mission Brief)

Construct a Mission Brief from the user's request and **call the AskUserQuestion tool** to confirm it.

**Do NOT skip this phase.** The Mission Brief is the primary context vehicle for teammate spawn prompts — it ensures agent-teams best practice ("give teammates enough context") is structurally guaranteed rather than depending on coordinator inference.

The coordinator infers the Mission Brief from U (the user's request):

- **Inquiry Intent**: What is being investigated and why
- **Expected Deliverable**: What form the output should take (e.g., code review, risk analysis, decision recommendation)
- **Scope Constraint**: What is included and excluded from analysis

**Call AskUserQuestion** with the inferred Mission Brief:

```
Mission Brief for this inquiry:

- **Intent**: [inferred inquiry intent]
- **Deliverable**: [inferred expected deliverable]
- **Scope**: [inferred scope constraint]

Options:
1. **Confirm** — proceed with this Mission Brief
2. **Modify intent** — adjust what is being investigated
3. **Modify deliverable** — adjust the expected output form
4. **Modify scope** — adjust inclusions/exclusions
```

**Pre-fill from explicit text**: `/frame "text"` → pre-fill from provided text, still confirm.

**Distinction from other protocols**: Phase 0 operates at the operational layer (structuring context for agent-teams), not the epistemic layer. Hermeneia resolves intent-expression gaps (user-initiated or AI-detected); Telos co-constructs goals from vague intent. Phase 0 packages confirmed intent into a structured vehicle for teammate consumption — a prerequisite for quality spawn prompts, not a substitute for intent clarification or goal construction.

### Phase 1: Context Gathering

Gather context sufficient to formulate distinct perspectives, **guided by MBᵥ**.

MBᵥ.inquiry_intent and MBᵥ.scope_constraint direct which files, systems, and domains to investigate. Do not proceed to Phase 2 until context is established.

### Phase 2: Prothesis (Perspective Placement)

After context gathering (Phase 1), **call the AskUserQuestion tool** with `multiSelect: true` to present perspectives.

**Do NOT present perspectives as plain text.** The tool call is mandatory—text-only presentation is a protocol violation.

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
- AskUserQuestion presents only AI-proposed novel perspectives ({P₁...Pₙ} where Pᵢ ∉ Pᵦ)
- State Pᵦ in the question text as context (e.g., "Base: [Pᵦ names]. Which additional lens(es)?")
- AI must propose at least 1 novel perspective when Pᵦ ≠ ∅ — re-presenting known perspectives as options saturates the finite option space and structurally conceals unknown unknowns

### Phase 3: Inquiry (Through Selected Lens)

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

**Collection**

Collect inquiry results into R'. Team remains active — shutdown/retain decisions are deferred to the LOOP section after Phase 5, where the user's sufficiency judgment determines team lifecycle.

#### Isolated Context Requirement

Each perspective MUST be analyzed in **isolated teammate context** to prevent:
- Cross-perspective contamination from shared conversation history
- Confirmation bias from main agent's prior reasoning
- Anchoring on initial assumptions formed during context gathering

**Structural necessity**: Only teammates in an agent team provide fresh context—main agent retains full conversation history. Therefore, perspective analysis MUST be delegated to separate teammates. This is not a stylistic preference; it is architecturally required for epistemically valid multi-perspective analysis. **Phase-dependent isolation**: In Phase 3 (inquiry), perspectives operate in strict isolation — no cross-dialogue occurs. In Phase 4 (cross-dialogue), peers negotiate directly on coordinator-identified tension topics (≤3 exchanges per pair), then submit structured reports. If divergence remains, the coordinator queries each divergent peer once (hub-spoke) before synthesizing independently (see Phase 4 for coordinator role details).

**Isolation trade-off on extend loops**: When `J=extend` deepens an existing perspective via SendMessage, the coordinator's re-inquiry instruction inherently carries synthesis context (what to deepen, why). This introduces controlled cross-pollination — the teammate gains partial awareness of other perspectives' findings. This is acceptable because: (1) the user explicitly requested extension, sanctioning the trade-off; (2) the coordinator controls what information crosses the boundary; (3) fresh initial analysis was already completed in full isolation.

**Isolation trade-off on cross-dialogue phase**: Phase 4 allows peer-to-peer communication. This is acceptable because: (1) Phase 3 already secured independent analysis — isolation has served its epistemic purpose; (2) direct peer exchange produces richer negotiation than coordinator relay, which introduces State-Cognition Gap (information loss at each transfer layer); (3) the coordinator retains structural control — topic signaling, structured report collection, conditional hub-spoke — without acting as message intermediary during peer exchange. Hub-spoke is a controlled reversion to coordinator-mediated interaction, justified by the need for independent synthesis when peers cannot resolve divergence themselves.

### Phase 4: Cross-Dialogue & Synthesis

After collecting all perspective results (R'), the coordinator reviews for cross-dialogue triggers and synthesizes findings.

**Cross-Dialogue (Peer Negotiation)**

The coordinator explicitly checks R' for cross-dialogue triggers before proceeding to synthesis. Trigger conditions that warrant peer exchange:
- Contradictory conclusions between perspectives
- One perspective's horizon limit intersects another's core finding
- A high-stakes finding supported by a single perspective with no corroboration

**If triggers detected**: Coordinator initiates peer negotiation with structured reporting:

1. **Topic signal**: Coordinator identifies the tension topic and sends it to the involved peer pair via SendMessage, including the structured report format (e.g., "Tension detected on [topic Z] between your perspectives. Exchange directly (≤3 messages), then each submit a structured report: final position / agreement points / remaining divergence / rationale.")
2. **Peer exchange**: Peers communicate directly (≤3 exchanges per pair; e.g., A→B, B→A, A→B). Each peer presents their position, responds to the other's reasoning, and works toward common ground. Peers may stop early if agreement is reached. The coordinator does not relay or frame — peers engage with each other's actual arguments.
3. **Structured report**: Each peer submits a 4-field report to the coordinator:
   - **Final position**: Peer's concluded stance after exchange
   - **Agreement points**: What the peers agreed on
   - **Remaining divergence**: Specific unresolved disagreements (empty if fully agreed)
   - **Rationale**: Why this position is held
4. **Conditional hub-spoke**: If any peer's `remaining_divergence` is non-empty, coordinator initiates hub-spoke reconciliation — one targeted question per divergent peer (e.g., "Peer B argues [X]. Explain the concrete impact of your position on [specific aspect]."). Each peer responds once. Coordinator does not re-engage after receiving responses — synthesis is independent. If `remaining_divergence` is empty for all peers, skip to step 5.
5. **Synthesis**: Coordinator independently integrates all results — peer exchange outcomes, structured reports, and hub-spoke responses (if any) — into a unified assessment. The coordinator exercises independent judgment as Synthesizer: information collection from peers, but the integration decision is the coordinator's own.
6. **User review**: **Call the AskUserQuestion tool** to present the synthesis result and solicit additional input before proceeding to Phase 5. The user sees the full cross-dialogue outcome for the first time here.

   ```
   Cross-dialogue synthesis:

   [Synthesis content — convergence, divergence resolution, integrated assessment]

   Options:
   1. **Confirm** — proceed to routing (Phase 5)
   2. **Add input** — provide additional context or opinions for synthesis revision
   ```

**If no triggers**: Proceed to synthesis (step 5) with brief justification (e.g., "No contradictions, horizon intersections, or uncorroborated high-stakes findings detected"), then user review (step 6).

Cross-dialogue precedes synthesis so the coordinator evaluates all perspectives before integration. Trigger detection is an explicit checkpoint — not incidental discovery during synthesis.

**Synthesis (Horizon Integration)**

After cross-dialogue (R'' = R' + any dialogue responses), or directly from R' if no triggers:

```markdown
## Framed Analysis

### Perspective Summaries
[Each perspective's epistemic contribution + assessment, 2-3 sentences]

### Convergence (Shared Horizon)
[Where perspectives agree—indicates robust finding]

### Divergence (Horizon Conflicts)
[Where they disagree—different values, evidence standards, or scope]
[If perspectives unexpectedly converged, note why distinct framing was nonetheless valuable]

### Integrated Assessment
[Synthesized answer with attribution to contributing perspectives]
```

### Phase 5: Routing

After synthesis, present routing options for user decision. **Call the AskUserQuestion tool**:

```
Analysis complete. Lens L established.

Options:
1. **Calibrate** — proceed to delegation calibration (activates Epitrope)
2. **Extend** — add new perspective or deepen existing analysis (team retained)
3. **Wrap up** — finalize with current Lens
```

**"Calibrate" availability**: Present when L contains actionable findings (divergence with clear fix directions, or assessment with implementation implications). When L is purely confirmatory or exploratory, omit this option.

**v4.0.0 scope note**: Prothesis is pure theoria (analysis only). Prior to v4.0.0, Phase 5 included classification (Fₐ/Fᵤ/Fᵈ) and execution (plan → praxis → verify). These phases have been extracted to Epitrope. Users seeking end-to-end execution should select "Calibrate" to transition to Epitrope, which establishes a DelegationContract covering WHO/WHAT/HOW MUCH for the implementation team. The Lens L persists in conversation context for Epitrope to reference.

**Loop behavior** (team lifecycle aware):
- **Calibrate**: Call Skill("calibrate") to activate Epitrope. Team retained — Epitrope detects the active team and proposes TeamAugment mode. Coordinator transitions from perspective analysis to delegation calibration
- **Extend**: Follow-up AskUserQuestion — "Add new perspective" → Phase 2 (spawn new teammate into T) or "Deepen existing" → Phase 3 (SendMessage re-inquiry to target teammate). Team retained in both cases
- **Wrap up**: shutdown_request → TeamDelete → terminate with L → recommend_protocols(L). Findings persist in L (conversation context); individual finding granularity (previously TaskCreate-persisted per finding) is intentionally consolidated into L.convergence / L.divergence / L.assessment. For multi-session durable retention, manually TaskCreate from L.divergence entries before wrapping up.
- **ESC**: shutdown_request → TeamDelete → terminate with current Lens L

**Convergence**: Mode terminates when user selects wrap_up or explicitly exits (ESC). Team is deleted only at terminal states.

**Post-wrap_up recommendations**: After TeamDelete, suggest follow-up protocols based on L:
- L.divergence ≠ ∅ → suggest Epitrope (`/calibrate`: act on findings) or Syneidesis (`/gap`: audit gaps)
- L.assessment reveals indeterminate goals → suggest Telos (`/goal`)

Recommendations are informational — user decides whether to call follow-up protocols.

## Conditions

### Trigger Prothesis

Prothesis applies to **open-world** cognition where the problem space is not fully enumerated:

- Purpose present, approach unspecified
- Multiple valid epistemic frameworks exist
- User's domain awareness likely incomplete
- **Structure test**: "What might I be missing?" is a meaningful question

### Skip Prothesis

Prothesis does **not** apply to **closed-world** cognition:

- Single deterministic execution path exists
- Perspective already specified
- Known target with binary outcome

**Heuristic**: If a deterministic procedure can answer the inquiry, skip Prothesis.

Consult `references/conceptual-foundations.md` for Parametric Nature and Specialization.

## Rules

1. **Mission Brief confirmation**: Always call AskUserQuestion to confirm Mission Brief before context gathering (Phase 0 → Phase 1 gate). Pre-filled text (`/frame "text"`) still requires confirmation. Modify loops re-present until confirmed.
2. **Recognition over Recall**: Always **call** AskUserQuestion tool to present options (text presentation = protocol violation)
3. **Epistemic Integrity**: Each perspective analyzes in isolated teammate context within an agent team; main agent direct analysis = protocol violation (violates isolation requirement). Phase topology per Rule 11
4. **Synthesis Constraint**: Integration only combines what perspectives provided; no new analysis
5. **Verbatim Transmission**: Pass original question unchanged to each perspective
6. **Convergence persistence**: Mode loops until user confirms sufficiency or ESC
7. **Sufficiency check**: Always call AskUserQuestion after synthesis to confirm or extend analysis
8. **Minimum perspectives**: Total perspectives (|Pᵦ| + n) must be ≥ 2; when Pᵦ ≠ ∅, present only novel perspectives (Pᵢ ∉ Pᵦ, n ≥ 1) — re-presenting user-supplied perspectives saturates option space and conceals unknown unknowns
9. **Team persistence**: Team persists across Phase 5 loop iterations; TeamDelete only at terminal states (wrap_up/ESC from Phase 5). J=calibrate retains team for Epitrope reuse
10. **Phase-dependent topology**: Analysis (Phase 3) enforces strict isolation; cross-dialogue (Phase 4) uses peer-to-peer negotiation (≤3 exchanges/pair) → structured report → conditional hub-spoke (Synthesizer) → user review via AskUserQuestion

