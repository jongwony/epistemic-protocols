---
name: mission
description: Multi-perspective investigation and execution. Assembles a team to analyze from selected viewpoints and act on findings when the right framework is absent, producing a framed inquiry. Alias: Prothesis(πρόθεσις).
user-invocable: true
---

# Prothesis Protocol

Resolve absent frameworks by placing available epistemic perspectives before the user, enabling lens selection prior to any perspective-requiring cognition. Type: `(FrameworkAbsent, AI, SELECT, Inquiry) → FramedInquiry`.

## Definition

**Prothesis** (πρόθεσις): A dialogical act of presenting available epistemic perspectives as options when the appropriate framework is absent, enabling selection before any perspective-requiring cognition.

```
── FLOW ──
Prothesis(U) → Q(MB(U)) → MBᵥ → G(MBᵥ) → C → {P₁...Pₙ}(C, MBᵥ) → S → Pₛ → T(Pₛ) → ∥I(T) → Ω(T) → R' → Syn(R') → L → K_i(L) → ∥F(T) → V(T) → L'

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
∥I     = Parallel inquiry: (∥ p∈T. Inquiry(p)) → D?(T) → R
D?     = Optional dialogue: selective cross-perspective challenge (coordinator-mediated)
Ω      = Collection: T → R, shutdown(T) ∨ retain(T)  -- conditional on loop
R      = Set(Result)                           -- inquiry outputs
Syn    = Synthesis: R → (∩, D, A)
L      = Lens { convergence: ∩, divergence: D, assessment: A }
FramedInquiry = L where (|Pₛ| ≥ 1 ∧ user_confirmed(sufficiency)) ∨ user_esc

── ACTION TYPES ──
K_i    = Interactive classify: L → AskUserQuestion → (Fₐ, Fᵤ, Fᵈ)  -- user-confirmed 3-tier classification
Fₐ     = { f | source_determined(f) ∧ perspective_confirmed(f) }          -- actionable
Fᵤ     = { f | ¬source_determined(f) ∧ adversarial_origin(f) }            -- surfaced unknown
Fᵈ     = { f | f ∉ Fₐ ∧ f ∉ Fᵤ }                                         -- design-level (catch-all)
∥F     = Parallel fix: (∥ f∈Fₐ. Fix(f, T))          -- praxis agent within team
V      = Verify: ∀ f∈Fₐ. peer_verify(f, origin(f))  -- originating perspective confirms
L'     = Lens post-action: L ∪ { fixes: Set(Fix), deferred: Fᵤ ∪ Fᵈ }

── CLASSIFICATION PREDICATES ──
source_determined(f)     ≡ fix direction deterministically derivable from existing source
perspective_confirmed(f) ≡ originating perspective validated the finding
adversarial_origin(f)    ≡ finding surfaced by adversarial perspective
conservative_default     ≡ Fᵈ is catch-all; ambiguous predicate evaluation → Fᵈ  (false_actionable cost > false_deferred cost)

── PHASE TRANSITIONS ──
Phase 0:  U → MB(U) → Q[AskUserQuestion](MB) → await → MBᵥ     -- Mission Brief confirmation [Tool]
Phase 1:  MBᵥ → G(MBᵥ) → C                                      -- targeted context acquisition
Phase 2:  (C, MBᵥ) → present[S]({P₁...Pₙ}(C, MBᵥ)) → await → Pₛ  -- S: AskUserQuestion [Tool]
Phase 3a: Pₛ → T[TeamCreate](Pₛ) → ∥Spawn[Task](T, Pₛ, MBᵥ)   -- team setup [Tool]
Phase 3b: T → ∥I[TaskCreate](T) → D[SendMessage](T) → R         -- inquiry + optional dialogue [Tool]
Phase 3c: R → Ω[SendMessage](T) → R'                            -- collection + deferred shutdown [Tool]
Phase 4:  R' → Syn(R') → L                                      -- internal synthesis
Phase 5a: L → K_i(L) → Q[AskUserQuestion](classification) → await → (Fₐ, Fᵤ, Fᵈ)  -- interactive classification [Tool]
Phase 5b: (Fₐ, Fᵤ, Fᵈ) → Q[AskUserQuestion](sufficiency) → await → J              -- sufficiency check [Tool]
Phase 6:  (Fₐ, Fᵤ, Fᵈ) → TaskCreate[all] → ∥Spawn[Task](T, praxis)                 -- register + spawn praxis [Tool]
Phase 7:  ∥F[TaskUpdate](T, Fₐ) → V[SendMessage](T) → L'       -- fix + peer verify [Tool]
Phase 5': L' → Q'[AskUserQuestion](action_sufficiency) → await → J'  -- action sufficiency [Tool]

── LOOP ──
After Phase 0 (Mission Brief):
  J_mb = confirm       → Phase 1
  J_mb = modify(field) → re-present Q(MB') → await → MBᵥ → Phase 1
  J_mb = ESC           → terminate (no team exists)

After Phase 5a (interactive classification):
  J_k = confirm          → Phase 5b
  J_k = modify(finding)  → re-classify → re-present K_i → await

After Phase 5b (analysis sufficiency):
  J = sufficient      → Ω(T, shutdown) → TeamDelete → terminate with L
  J = add_perspective  → Phase 2 (Λ.team retained; MB re-confirmation unnecessary)
  J = refine           → Phase 3b (re-inquiry within existing T)
  J = act              → Phase 6 (confirmed classification → spawn praxis into T)
  J = ESC              → Ω(T, shutdown) → TeamDelete → terminate with current L

After Phase 5' (action sufficiency):
  J' = sufficient     → Ω(T, shutdown) → TeamDelete → terminate with L'
                         → recommend_protocols(Fᵤ ∪ Fᵈ)
  J' = ESC            → Ω(T, shutdown) → TeamDelete → terminate with current L'
                         → recommend_protocols(Fᵤ ∪ Fᵈ)

After Phase 6 (classification guard):
  Fₐ = ∅ → Phase 5' (L' = L ∪ { fixes: ∅, deferred: Fᵤ ∪ Fᵈ })
  Fₐ ≠ ∅ → Phase 7 (spawn praxis, execute fixes)

recommend_protocols(deferred):
  Fᵤ ≠ ∅ → suggest Syneidesis (priority: surfaced unknowns)
  Fᵈ ≠ ∅ → suggest Syneidesis (gaps) or Telos (goals) by finding type

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
D (parallel)             → SendMessage tool (type: "message", coordinator-mediated cross-dialogue)
Ω (extern)               → SendMessage tool (type: "shutdown_request", graceful teammate termination)
Phase 5a Q               → AskUserQuestion (interactive classification; confirm or modify)
Phase 5b Q               → AskUserQuestion (sufficiency check; Escape → terminate)
Λ (state)                → TaskCreate/TaskUpdate (mandatory after Phase 3a spawn, per perspective; TaskUpdate for status tracking)
G (gather)               → Read, Glob, Grep (targeted context acquisition, guided by MBᵥ)
Syn (synthesis)          → Internal operation (no external tool)
K_i (interactive)        → AskUserQuestion + internal classification (coordinator proposes, user confirms)
TaskCreate (Phase 6)     → TaskCreate tool (register confirmed tiers with metadata)
∥Spawn praxis (parallel) → Task tool (team_name, name: spawn praxis into existing T)
G(praxis)                → TaskList/TaskGet tools (praxis context acquisition: discovery + full descriptions)
∥F (parallel)            → TaskUpdate/Edit/Write tools (praxis applies fixes to Fₐ items)
V (parallel)             → SendMessage tool (type: "message", peer-to-peer praxis ↔ originating perspective)
Phase 5' Q' (extern)    → AskUserQuestion (action sufficiency check; Escape → terminate)

── CATEGORICAL NOTE ──
∩ = meet (intersection) over comparison morphisms between perspective outputs
D = join (union of distinct findings) where perspectives diverge
A = synthesized assessment (additional computation)

── MODE STATE ──
Λ = { phase: Phase, mission_brief: Option(MBᵥ), lens: Option(L), active: Bool, team: Option(TeamState), action: Option(ActionState) }
TeamState = { name: String, members: Set(String), tasks: Set(TaskId) }
ActionState = { classified: (Fₐ, Fᵤ, Fᵈ), praxis: Option(String) }
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

**Protocol precedence**: Default ordering places Prothesis after Telos and before Syneidesis (established perspective contextualizes gap detection). The user can override this default by explicitly requesting a different protocol first. Katalepsis is structurally last — it requires completed result (`R`), so it is not subject to ordering choices.

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

<!-- See references/conceptual-foundations.md for: Plan Mode Integration, Distinction from Socratic Method -->

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

**Pre-fill from explicit text**: `/mission "text"` → pre-fill from provided text, still confirm.

**Distinction from other protocols**: Phase 0 operates at the operational layer (structuring context for agent-teams), not the epistemic layer. Hermeneia resolves user-initiated intent-expression gaps; Telos co-constructs goals from vague intent. Phase 0 packages confirmed intent into a structured vehicle for teammate consumption — a prerequisite for quality spawn prompts, not a substitute for intent clarification or goal construction.

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

#### Phase 3a: Team Setup

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

Cross-dialogue: If the coordinator sends you another perspective's finding
to challenge, respond with a focused rebuttal or concession (2-3 sentences).
Do not initiate cross-dialogue unprompted.
```

Multiple selections → parallel teammates (never sequential).

**TaskCreate per perspective** (mandatory): After spawning each perspective teammate, the coordinator MUST call TaskCreate for that perspective — one task per perspective. This enables progress tracking via TaskList/TaskUpdate during inquiry, and ensures team coordination is observable rather than implicit. The task subject should identify the perspective; the description should include the inquiry question and scope.

#### Phase 3b: Inquiry and Dialogue

Teammates analyze independently. After results arrive, the coordinator (main agent) MAY initiate cross-dialogue:

**Cross-dialogue triggers** (all coordinator-mediated):
- Contradictory conclusions between perspectives
- One perspective's horizon limit intersects another's core finding
- Coordinator judges a finding needs adversarial testing

**Cross-dialogue constraints**:
- 1 exchange per pair: challenge + response (no extended debate)
- Coordinator relays via SendMessage (type: "message") — no peer-to-peer
- Dialogue is selective, not mandatory — skip when perspectives cleanly complement

#### Phase 3c: Collection

Collect all results (initial analyses + any dialogue responses) into R'. Team remains active — shutdown/retain decisions are deferred to the LOOP section after Phase 5b, where the user's sufficiency judgment determines team lifecycle.

#### Isolated Context Requirement

Each perspective MUST be analyzed in **isolated teammate context** to prevent:
- Cross-perspective contamination from shared conversation history
- Confirmation bias from main agent's prior reasoning
- Anchoring on initial assumptions formed during context gathering

**Structural necessity**: Only teammates in an agent team provide fresh context—main agent retains full conversation history. Therefore, perspective analysis MUST be delegated to separate teammates. This is not a stylistic preference; it is architecturally required for epistemically valid multi-perspective analysis. **Phase-dependent isolation**: In Phase 3 (analysis), cross-dialogue is strictly coordinator-mediated to prevent confirmation bias. In Phase 7 (action), peer-to-peer is allowed between praxis and originating perspectives for verification and context restoration — analysis isolation has served its purpose, and direct channels reduce information loss through coordinator relay.

**Isolation trade-off on refine loops**: When `J=refine` reuses a retained teammate via SendMessage, the coordinator's refinement instruction inherently carries synthesis context (what to refine, why). This introduces controlled cross-pollination — the teammate gains partial awareness of other perspectives' findings. This is acceptable because: (1) the user explicitly requested refinement, sanctioning the trade-off; (2) the coordinator controls what information crosses the boundary; (3) fresh initial analysis was already completed in full isolation.

**Isolation trade-off on action phase**: When `J=act` proceeds to Phase 7, the praxis agent communicates directly with originating perspectives. This is acceptable because: (1) the user explicitly chose `act`, sanctioning the topology shift; (2) analysis-phase isolation already produced unbiased findings; (3) peer-to-peer verification is epistemically necessary — coordinator relay introduces State-Cognition Gap (information loss at each transfer layer).

**Scope extension note**: Phase 6-7 extends Prothesis from "perspective placement" (πρόθεσις = "setting before") to "perspective-informed action." This is an intentional design decision: when the team is already assembled and findings are actionable, dissolving the team and re-creating it for action would waste analytical context. The extension is bounded — only user-selected `act` triggers it, only Fₐ items are acted upon, and Fᵤ/Fᵈ are deferred to other protocols.

### Phase 4: Synthesis (Horizon Integration)

After all perspectives complete:

```markdown
## Mission Analysis

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

### Phase 5a: Interactive Classification

After synthesis, present a 3-tier classification of findings from L for user confirmation.

**Entry condition**: L contains findings with potential action implications (from divergence or assessment sections). Skip Phase 5a and proceed directly to Phase 5b when L is purely confirmatory.

The coordinator proposes initial classification using the standard predicates:

| Predicate | Tier | Meaning |
|-----------|------|---------|
| `source_determined(f) ∧ perspective_confirmed(f)` | Fₐ (actionable) | Fix direction deterministic |
| `¬source_determined(f) ∧ adversarial_origin(f)` | Fᵤ (surfaced unknown) | Adversarial-origin blind spot |
| `f ∉ Fₐ ∧ f ∉ Fᵤ` | Fᵈ (design-level) | Catch-all (conservative default) |

**Call the AskUserQuestion tool** with the proposed classification:

```
Please confirm the findings classification.

| Finding | Proposed Tier | Rationale |
|---------|--------------|-----------|
| [finding 1] | Fₐ / Fᵤ / Fᵈ | [classification basis] |
| ... | ... | ... |

Options:
1. **Confirm** — proceed with this classification
2. **Modify** — adjust specific finding tiers (e.g., Fᵈ→Fₐ)
```

**Classification loop**:
- **Confirm**: (Fₐ, Fᵤ, Fᵈ) confirmed → Phase 5b
- **Modify**: User specifies tier changes → coordinator updates classification → re-present → await confirmation

**Classification authority**:
- Coordinator proposes initial classification (conservative default: ambiguous → Fᵈ)
- **User confirms or modifies** — user has final authority over tier assignments
- Perspectives MAY include `suggested_class` metadata; coordinator considers these in initial proposal

### Phase 5b: Sufficiency Check

**Call the AskUserQuestion tool** to confirm analysis sufficiency.

```
Is this analysis sufficient for your inquiry?

Options:
1. **Sufficient** — conclude analysis and dissolve the team
2. **Add perspective** — explore additional viewpoints (team retained)
3. **Refine existing** — revisit an analyzed perspective (team retained)
4. **Act on findings** — execute confirmed Fₐ fixes within the team; Fᵤ/Fᵈ deferred with protocol recommendations
```

**"Act on findings" availability**: Only present when confirmed Fₐ ≠ ∅ from Phase 5a. When Fₐ = ∅ (all findings deferred), omit this option.

**Loop behavior** (team lifecycle aware):
- **Sufficient**: shutdown_request → TeamDelete → terminate with current Lens L
- **Add perspective**: Return to Phase 2; existing team T retained → spawn new teammate into T (no TeamCreate)
- **Refine existing**: Return to Phase 3b; call SendMessage to target teammate for re-analysis within existing T
- **Act on findings**: Proceed to Phase 6; uses confirmed classification from Phase 5a — no re-classification
- **ESC**: shutdown_request → TeamDelete → terminate with current Lens L

All terminal paths (sufficient and ESC, from both Phase 5b and Phase 5') read deferred findings from TaskList before TeamDelete to preserve L'.deferred for post-TeamDelete recommendations.

**Convergence**: Mode terminates when user confirms sufficiency (Phase 5b or Phase 5') or explicitly exits. Team is deleted only at terminal states.

<!-- See references/conceptual-foundations.md for: Theoria → Praxis conceptual distinction -->

### Phase 6: Action Planning

When the user selects `act` at Phase 5b, the coordinator uses the **confirmed classification from Phase 5a** — no re-classification occurs.

Call TaskCreate for **all** confirmed findings with tier metadata.

**Scope enforcement**: All classified findings are registered via TaskCreate with tier identification through two channels:
- **Subject prefix** (primary): `[Fₐ]`, `[Fᵤ]`, `[Fᵈ]` — always visible in TaskList summary
- **Metadata** (supplementary): `{ "tier": "actionable" | "surfaced_unknown" | "design_level" }` — structured data when accessible

The description SHOULD also state the tier in natural language. Subject prefix is the canonical filtering channel because TaskList reliably surfaces subject text, while metadata visibility through TaskList/TaskGet is platform-dependent.

This persists deferred findings on disk (team task list), making them resistant to coordinator context compaction. Praxis scope is enforced by prompt instruction ("Only fix tier=actionable"), not by structural omission — a deliberate trade-off favoring durability over structural isolation.

### Phase 7: Execution and Peer Verification

#### Phase 7a: Praxis Spawn

Call Task with `team_name` to spawn a praxis into existing team T.

The praxis reads TaskList for discovery, then TaskGet for each finding's full description — not relying on spawn prompt alone. TaskCreate descriptions written by originating perspectives preserve analytical nuance that coordinator summarization would lose.

The praxis receives the praxis prompt template:

```
You are a **Praxis** agent in team {team_name}.

Read TaskList to discover actionable findings (Fₐ), then TaskGet each
for full context. Apply fixes to the relevant artifacts.

For each fix:
1. Read the target artifact (code, document, configuration)
2. Apply the minimal change that addresses the finding
3. After fixing, call SendMessage to the originating perspective
   teammate for verification (include: what you changed and why)

Scope constraint: Only fix items with subject prefix `[Fₐ]` (actionable).
Skip items prefixed `[Fᵤ]` (surfaced unknown) or `[Fᵈ]` (design level).
When in doubt, check the task description for tier classification.
```

#### Phase 7b: Peer Verification

Praxis communicates directly with originating perspective teammates via SendMessage for:
- **Verification**: confirming fix addresses the finding (mandatory per fix)
- **Context restoration**: clarifying finding intent when ambiguous

This is a **phase-dependent topology shift**:

| Phase | Topology | Rationale |
|-------|----------|-----------|
| Phase 3 (Analysis) | Coordinator-mediated only | Prevents confirmation bias (Asch conformity) |
| Phase 7 (Action) | Peer-to-peer (praxis ↔ originating perspective) | Enables accurate verification; reduces information loss through coordinator relay |

One exchange per finding: fix proposal → confirmation or revision request.

#### Phase 7c: Collection

Collect fix results and verifications into L' (updated Lens). L'.deferred is populated from TaskList (tier ≠ actionable) as an **intermediate snapshot** — these tasks remain in the team task list for durability until TeamDelete. The pre-TeamDelete read (Phase 5' post-resolution) confirms the **final state** of deferred findings after any further changes. After collection, the praxis's task is complete. The praxis remains in team T but takes no further action — team-wide shutdown occurs at terminal states (Phase 5' sufficient/ESC).

### Phase 5': Action Sufficiency Check

After Phase 7, **call the AskUserQuestion tool** to confirm action sufficiency.

**Post-TeamDelete recommendations** (when Fᵤ ∪ Fᵈ ≠ ∅):

**Before** TeamDelete, read deferred findings (`tier ≠ actionable`) from TaskList into L'.deferred — this applies to both the Fₐ≠∅ path (after Phase 7) and the Fₐ=∅ path (skipping Phase 7). TaskList is the canonical source for L'.deferred in all paths. **After** TeamDelete, call TaskCreate for each item in L'.deferred to re-register them in the session task list (bridging team → session context), then present them with protocol suggestions:
- **Surfaced unknowns** (Fᵤ): Priority — adversarial perspectives identified blind spots. Suggest `/gap`.
- **Design-level** (Fᵈ): Suggest `/gap` (gap-shaped) or `/goal` (goal-shaped).

Recommendations are informational — user decides whether to call follow-up protocols.

**No re-entry to Phase 5a/5b**: Phase 5' offers only sufficient/ESC, not add_perspective or refine. This is intentional — action results constitute a different epistemic object than analysis results. Re-analysis after action requires fresh context (new perspectives evaluating the changed state), which is better served by a new Prothesis invocation than by recycling the current team's analytical frame.

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

<!-- See references/conceptual-foundations.md for: Parametric Nature, Specialization -->

## Rules

1. **Mission Brief confirmation**: Always call AskUserQuestion to confirm Mission Brief before context gathering (Phase 0 → Phase 1 gate). Pre-filled text (`/mission "text"`) still requires confirmation. Modify loops re-present until confirmed.
2. **Recognition over Recall**: Always **call** AskUserQuestion tool to present options (text presentation = protocol violation)
3. **Epistemic Integrity**: Each perspective analyzes in isolated teammate context within an agent team; main agent direct analysis = protocol violation (violates isolation requirement). Phase 3: cross-dialogue is coordinator-mediated only. Phase 7: peer-to-peer allowed between praxis and originating perspectives for verification
4. **Synthesis Constraint**: Integration only combines what perspectives provided; no new analysis
5. **Verbatim Transmission**: Pass original question unchanged to each perspective
6. **Convergence persistence**: Mode loops until user confirms sufficiency or ESC
7. **Sufficiency check**: Always call AskUserQuestion after synthesis to confirm or extend analysis
8. **Minimum perspectives**: Total perspectives (|Pᵦ| + n) must be ≥ 2; when Pᵦ ≠ ∅, present only novel perspectives (Pᵢ ∉ Pᵦ, n ≥ 1) — re-presenting user-supplied perspectives saturates option space and conceals unknown unknowns
9. **Team persistence**: Team persists across Phase 5a/5b loop iterations and through Phase 6-7 action chain; TeamDelete only at terminal states (sufficient/ESC from Phase 5b or Phase 5')
10. **Classification authority**: Coordinator proposes initial classification; user confirms or modifies (final authority). Conservative default applies to initial proposal: ambiguous → Fᵈ
11. **Phase-dependent topology**: Analysis (Phase 3) enforces strict isolation; action (Phase 7) allows peer-to-peer between praxis and originating perspectives only
12. **Praxis scope**: Limited to actionable findings (Fₐ); design-level (Fᵈ) and surfaced-unknown (Fᵤ) are deferred to post-TeamDelete recommendations

