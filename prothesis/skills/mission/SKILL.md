---
name: mission
description: "Multi-perspective investigation and execution. Assembles a team to analyze from selected viewpoints and act on findings when the right framework is absent, producing a framed inquiry. Alias: Prothesis(πρόθεσις)."
user-invocable: true
---

# Prothesis Protocol

Resolve absent frameworks by placing available epistemic perspectives before the user, enabling lens selection prior to any perspective-requiring cognition. Type: `(FrameworkAbsent, AI, SELECT, Inquiry) → FramedInquiry`.

## Definition

**Prothesis** (πρόθεσις): A dialogical act of presenting available epistemic perspectives as options when the appropriate framework is absent, enabling selection before any perspective-requiring cognition.

```
── FLOW ──
Prothesis(U) → Q(MB(U)) → MBᵥ → G(MBᵥ) → C → {P₁...Pₙ}(C, MBᵥ) → S → Pₛ → T(Pₛ) → ∥I(T) → R → Ω(T) → R' → Δ(R') → D?(T) → R'' → Syn(R'') → L → K_i(L) → ∥F(T) → V(T) → L'

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
D?     = Conditional dialogue: Δ ≠ ∅ → coordinator-mediated challenge; Δ = ∅ → skip
Syn    = Synthesis: R'' → (∩, D, A)
L      = Lens { convergence: ∩, divergence: D, assessment: A }
FramedInquiry = L where (|Pₛ| ≥ 1 ∧ user_confirmed(sufficiency)) ∨ user_esc

── ACTION TYPES ──
K_i    = Interactive classify + route: L → AskUserQuestion → ((Fₐ, Fᵤ, Fᵈ), J)  -- user-confirmed classification with routing
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
Phase 3:  Pₛ → T[TeamCreate](Pₛ) → ∥Spawn[Task](T, Pₛ, MBᵥ) → ∥I[TaskCreate](T) → R → Ω[SendMessage](T) → R'  -- inquiry + collection [Tool]
Phase 4:  R' → Δ(R') → D?[SendMessage](T) → R'' → Syn(R'') → L  -- cross-dialogue & synthesis [Tool]
Phase 5:  L → K_i(L) → Q[AskUserQuestion](classification + routing) → await → ((Fₐ, Fᵤ, Fᵈ), J)  -- unified classification + routing [Tool]
Phase 6:  (Fₐ, Fᵤ, Fᵈ) → TaskCreate[all] → ∥Spawn[Task](T, praxis)                 -- register + spawn praxis [Tool]
Phase 7:  ∥F[TaskUpdate](T, Fₐ) → V[SendMessage](T) → L'       -- fix + peer verify [Tool]
Phase 5': L' → Q'[AskUserQuestion](action_sufficiency) → await → J'  -- action sufficiency [Tool]

── LOOP ──
After Phase 0 (Mission Brief):
  J_mb = confirm       → Phase 1
  J_mb = modify(field) → re-present Q(MB') → await → MBᵥ → Phase 1
  J_mb = ESC           → terminate (no team exists)

After Phase 5 (classification + routing):
  J = act              → Phase 6 (Fₐ confirmed → spawn praxis into T; team retained)
  J = modify(finding)  → re-classify → re-present K_i → await
  J = extend           → Q[AskUserQuestion](add new perspective | deepen existing) → Phase 2 or Phase 3 inquiry (team retained)
  J = wrap_up          → Ω(T, shutdown) → preserve_deferred(Fᵤ ∪ Fᵈ) → TeamDelete → terminate with L
  J = ESC              → Ω(T, shutdown) → preserve_deferred(Fᵤ ∪ Fᵈ) → TeamDelete → terminate with current L

After Phase 5' (action sufficiency):
  J' = sufficient     → Ω(T, shutdown) → preserve_deferred(Fᵤ ∪ Fᵈ) → TeamDelete → terminate with L'
                         → recommend_protocols(Fᵤ ∪ Fᵈ)
  J' = ESC            → Ω(T, shutdown) → preserve_deferred(Fᵤ ∪ Fᵈ) → TeamDelete → terminate with current L'
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
Phase 4 Δ (detect)       → Internal operation (trigger check: contradictions, horizon intersections, uncorroborated high-stakes)
Phase 4 D? (conditional) → SendMessage tool (type: "message", coordinator-mediated cross-dialogue; skip if Δ = ∅)
Ω (extern)               → SendMessage tool (type: "shutdown_request", graceful teammate termination)
Phase 5 K_i/Q            → AskUserQuestion (classification + routing: act/modify/extend/wrap_up; extend triggers follow-up AskUserQuestion; Escape → terminate)
Λ (state)                → TaskCreate/TaskUpdate (mandatory after Phase 3 spawn, per perspective; TaskUpdate for status tracking)
G (gather)               → Read, Glob, Grep (targeted context acquisition, guided by MBᵥ)
Phase 4 Syn (synthesis)  → Internal operation (no external tool)
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

Cross-dialogue: If the coordinator sends you another perspective's finding
to challenge, respond with a focused rebuttal or concession (2-3 sentences).
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

**Structural necessity**: Only teammates in an agent team provide fresh context—main agent retains full conversation history. Therefore, perspective analysis MUST be delegated to separate teammates. This is not a stylistic preference; it is architecturally required for epistemically valid multi-perspective analysis. **Phase-dependent isolation**: In Phase 3 (inquiry), perspectives operate in strict isolation — no cross-dialogue occurs. Cross-dialogue is deferred to Phase 4 where the coordinator mediates after full collection, with explicit trigger checking. In Phase 7 (action), peer-to-peer is allowed between praxis and originating perspectives for verification and context restoration — analysis isolation has served its purpose, and direct channels reduce information loss through coordinator relay.

**Isolation trade-off on extend loops**: When `J=extend` deepens an existing perspective via SendMessage, the coordinator's re-inquiry instruction inherently carries synthesis context (what to deepen, why). This introduces controlled cross-pollination — the teammate gains partial awareness of other perspectives' findings. This is acceptable because: (1) the user explicitly requested extension, sanctioning the trade-off; (2) the coordinator controls what information crosses the boundary; (3) fresh initial analysis was already completed in full isolation.

**Isolation trade-off on action phase**: When `J=act` proceeds to Phase 7, the praxis agent communicates directly with originating perspectives. This is acceptable because: (1) the user explicitly chose to act, sanctioning the topology shift; (2) analysis-phase isolation already produced unbiased findings; (3) peer-to-peer verification is epistemically necessary — coordinator relay introduces State-Cognition Gap (information loss at each transfer layer).

**Scope extension note**: Phase 6-7 extends Prothesis from "perspective placement" (πρόθεσις = "setting before") to "perspective-informed action." This is an intentional design decision: when the team is already assembled and findings are actionable, dissolving the team and re-creating it for action would waste analytical context. The extension is bounded — only user-selected `act` triggers it, only Fₐ items are acted upon, and Fᵤ/Fᵈ are deferred to other protocols.

### Phase 4: Cross-Dialogue & Synthesis

After collecting all perspective results (R'), the coordinator reviews for cross-dialogue triggers and synthesizes findings.

**Cross-Dialogue**

The coordinator explicitly checks R' for cross-dialogue triggers before proceeding to synthesis. Trigger conditions that warrant mediated exchange:
- Contradictory conclusions between perspectives
- One perspective's horizon limit intersects another's core finding
- A high-stakes finding supported by a single perspective with no corroboration

**If triggers detected**: Coordinator mediates via SendMessage:
- Relay the challenging finding to the target perspective
- 1 exchange per pair: challenge + response (no extended debate)
- Coordinator controls what information crosses perspective boundaries

**If no triggers**: Proceed to synthesis with brief justification (e.g., "No contradictions, horizon intersections, or uncorroborated high-stakes findings detected").

Cross-dialogue precedes synthesis so the coordinator evaluates all perspectives before integration. Trigger detection is an explicit checkpoint — not incidental discovery during synthesis.

**Synthesis (Horizon Integration)**

After cross-dialogue (R'' = R' + any dialogue responses), or directly from R' if no triggers:

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

### Phase 5: Classification and Routing

After synthesis, present a unified classification of findings from L with routing options for user decision.

**Entry condition**: L contains findings with potential action implications (from divergence or assessment sections). When L is purely confirmatory, skip the classification table and present only routing options (extend/wrap_up).

The coordinator proposes initial classification using the standard predicates:

| Predicate | Tier | Meaning |
|-----------|------|---------|
| `source_determined(f) ∧ perspective_confirmed(f)` | Fₐ (actionable) | Fix direction deterministic |
| `¬source_determined(f) ∧ adversarial_origin(f)` | Fᵤ (surfaced unknown) | Adversarial-origin blind spot |
| `f ∉ Fₐ ∧ f ∉ Fᵤ` | Fᵈ (design-level) | Catch-all (conservative default) |

**Call the AskUserQuestion tool** with classification and routing combined:

```
Findings classification:

| Finding | Proposed Tier | Rationale |
|---------|--------------|-----------|
| [finding 1] | Fₐ / Fᵤ / Fᵈ | [classification basis] |
| ... | ... | ... |

Options:
1. **Act on findings** — execute Fₐ fixes within the team
2. **Modify classification** — adjust specific finding tiers (e.g., Fᵈ→Fₐ)
3. **Extend analysis** — add new perspective or deepen existing (team retained)
4. **Wrap up** — preserve deferred findings (Fᵤ/Fᵈ) and dissolve team
```

**Option exhaustiveness**: Present exactly the options listed above. Do not generate, substitute, or reorder options beyond this template.

**"Act on findings" availability**: Only present when Fₐ ≠ ∅ in the proposed classification. When all findings are deferred (Fₐ = ∅), omit this option.

**Classification loop**: When the user selects "Modify classification", update the tiers per user specification → re-present the table with updated classification → await new decision. The modification loop stays within Phase 5.

**Classification authority**:
- Coordinator proposes initial classification (conservative default: ambiguous → Fᵈ)
- **User confirms or modifies** — user has final authority over tier assignments
- Perspectives MAY include `suggested_class` metadata; coordinator considers these in initial proposal

**Loop behavior** (team lifecycle aware):
- **Act on findings**: Proceed to Phase 6; uses confirmed classification — no re-classification (team retained)
- **Modify classification**: Update tiers per user specification → re-present K_i → await
- **Extend analysis**: Follow-up AskUserQuestion — "Add new perspective" → Phase 2 (spawn new teammate into T) or "Deepen existing" → Phase 3 (SendMessage re-inquiry to target teammate). Team retained in both cases
- **Wrap up**: Read deferred findings (Fᵤ/Fᵈ) from TaskList → shutdown_request → TeamDelete → re-register deferred in session task list → recommend follow-up protocols
- **ESC**: shutdown_request → TeamDelete → terminate with current Lens L

All terminal paths (wrap_up and ESC, from both Phase 5 and Phase 5') read deferred findings from TaskList before TeamDelete to preserve L'.deferred for post-TeamDelete recommendations.

**Convergence**: Mode terminates when user selects wrap_up (Phase 5 or Phase 5') or explicitly exits (ESC). Team is deleted only at terminal states.

Consult `references/conceptual-foundations.md` for Theoria → Praxis conceptual distinction.

### Phase 6: Action Planning

When the user selects `act` at Phase 5, the coordinator uses the **confirmed classification** — no re-classification occurs.

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

**Output grounding**: When reporting fixes, include concrete evidence — file paths
changed, specific lines modified, before/after snippets. Avoid abstract summaries.
If a fix description could apply to any codebase without modification, it lacks substance.
```

#### Phase 7b: Peer Verification

Praxis communicates directly with originating perspective teammates via SendMessage for:
- **Verification**: confirming fix addresses the finding (mandatory per fix)
- **Context restoration**: clarifying finding intent when ambiguous

This is a **phase-dependent topology shift**:

| Phase | Topology | Rationale |
|-------|----------|-----------|
| Phase 3 (Inquiry) | Strict isolation | Independent perspective analysis without cross-contamination |
| Phase 4 (Cross-dialogue & Synthesis) | Coordinator-mediated | Structured contradiction resolution; coordinator controls information crossing |
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

**No re-entry to Phase 5**: Phase 5' offers only sufficient/ESC, not extend. This is intentional — action results constitute a different epistemic object than analysis results. Re-analysis after action requires fresh context (new perspectives evaluating the changed state), which is better served by a new Prothesis invocation than by recycling the current team's analytical frame.

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

1. **Mission Brief confirmation**: Always call AskUserQuestion to confirm Mission Brief before context gathering (Phase 0 → Phase 1 gate). Pre-filled text (`/mission "text"`) still requires confirmation. Modify loops re-present until confirmed.
2. **Recognition over Recall**: Always **call** AskUserQuestion tool to present options (text presentation = protocol violation)
3. **Epistemic Integrity**: Each perspective analyzes in isolated teammate context within an agent team; main agent direct analysis = protocol violation (violates isolation requirement). Phase 3: strict isolation (no cross-dialogue). Phase 4: coordinator-mediated cross-dialogue. Phase 7: peer-to-peer allowed between praxis and originating perspectives for verification
4. **Synthesis Constraint**: Integration only combines what perspectives provided; no new analysis
5. **Verbatim Transmission**: Pass original question unchanged to each perspective
6. **Convergence persistence**: Mode loops until user confirms sufficiency or ESC
7. **Sufficiency check**: Always call AskUserQuestion after synthesis to confirm or extend analysis
8. **Minimum perspectives**: Total perspectives (|Pᵦ| + n) must be ≥ 2; when Pᵦ ≠ ∅, present only novel perspectives (Pᵢ ∉ Pᵦ, n ≥ 1) — re-presenting user-supplied perspectives saturates option space and conceals unknown unknowns
9. **Team persistence**: Team persists across Phase 5 loop iterations and through Phase 6-7 action chain; TeamDelete only at terminal states (sufficient/ESC from Phase 5 or Phase 5')
10. **Classification authority**: Coordinator proposes initial classification; user confirms or modifies (final authority). Conservative default applies to initial proposal: ambiguous → Fᵈ
11. **Phase-dependent topology**: Analysis (Phase 3) enforces strict isolation; cross-dialogue (Phase 4) is coordinator-mediated with explicit trigger check; action (Phase 7) allows peer-to-peer between praxis and originating perspectives only
12. **Praxis scope**: Limited to actionable findings (Fₐ); design-level (Fᵈ) and surfaced-unknown (Fᵤ) are deferred to post-TeamDelete recommendations

