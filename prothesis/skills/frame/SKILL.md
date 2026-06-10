---
name: frame
description: "Multi-perspective framing. When the right framework is absent, recommends analytical lenses (Mode 1) or compiles a full multi-perspective inquiry spec (Mode 2), then hands off to the substrate and stops without executing. frame supplies the analysis objects (lenses); arranging multiple perspectives is /conduct's, executing the inquiry is the substrate's. Factual lookup or verification routes to fact-finding delegation; contested design, value, interpretation, or scope judgment routes to lens-conditioned inquiry. Type: (FrameworkAbsent, AI, DESIGN, Inquiry) → FramedInquiry. Alias: Prothesis(πρόθεσις)."
---

# Prothesis Protocol

Resolve absent frameworks by placing available epistemic perspectives before the user, enabling lens selection prior to any perspective-requiring cognition, then compiling the selection into a framed object and handing it off — the substrate executes. The morphism is **select THEN compile THEN hand off**: Mode 1 (Recommend) compiles the lens alone into a recommendation; Mode 2 (Inquire) compiles a full inquiry spec — the lens, a reference to `/conduct` for non-trivial arrangement, and a default isolation/dialogue/synthesis directive. Neither mode arranges the perspectives (that is `/conduct`'s arrangement functor) nor executes the inquiry (that is the substrate, of which the main session is one realization). frame is the object supplier: it yields the analysis object and stops at handoff. Type: `(FrameworkAbsent, AI, DESIGN, Inquiry) → FramedInquiry`.

## Definition

**Prothesis** (πρόθεσις): A dialogical act of presenting available epistemic perspectives as options when the appropriate framework is absent, enabling selection before any perspective-requiring cognition, then compiling the selected lens into a framed object — a lens recommendation (Mode 1) or an inquiry spec `lens ⊕ a /conduct arrangement reference ⊕ a default isolation/dialogue/synthesis directive` (Mode 2) — and handing it off to the substrate. frame is the **object supplier**: it yields the analysis object (the lens), retains only the trivial-default arrangement as a zero-gate fast-path, and stops at handoff. Arranging the objects — the order, independence, reconciliation, termination, and routing of multiple perspectives when non-trivial — is `/conduct`'s arrangement functor; executing the inquiry — spawn, isolated analysis, reconcile, synthesize — is the substrate's.

```
── FLOW ──
Prothesis(U) → Q(MB(U), M) → (MBᵥ, m) → G(MBᵥ) → C → {P₁...Pₙ}(C, MBᵥ) → S → Pₛ → LensEstablished →
  [m=recommend: characterize(Pₛ) → Lᵣ] | [m=inquire: compile(Pₛ ⊕ ConductRef ⊕ DefaultDirective) → IS] →
  converge(trace) → handoff(FramedInquiry) → STOP

── MORPHISM ──
Inquiry
  → confirm(mission_brief)              -- validate inquiry framing with user
  → gather(context)                     -- targeted context acquisition guided by MBᵥ
  → propose(perspectives)               -- generate distinct analytical lenses from context
  → select(perspectives)                -- user chooses lenses via Cognitive Partnership Move (Constitution)
  → LensEstablished                     -- the analysis object (lens); Mode 1 packages it directly, Mode 2 compiles it into a full spec
  → compile(inquiry_spec)               -- (m=inquire) lens ⊕ /conduct arrangement reference ⊕ default isolation/dialogue/synthesis directive; no topology elicited here (arrangement is /conduct's functor)
  → handoff(framed_inquiry)             -- emit the compiled output (lens recommendation or inquiry spec), then STOP — the substrate executes; non-trivial arrangement routes to /conduct
  → FramedInquiry
requires: framework_absent(U)             -- runtime checkpoint (Phase 0)
deficit:  FrameworkAbsent                  -- activation precondition (Layer 1/2)
preserves: U                               -- original request read-only
invariant: Placement over Prescription

── TYPES ──
U      = Underspecified request (purpose clear, approach unclear)
MB     = MissionBrief(U): { inquiry_intent, expected_deliverable, scope_constraint }  -- AI-inferred from U
Q(MB, M) = ConfirmAndSelect: (MB, ModeOptions) → (MBᵥ, m)  -- extern (combined Constitution interaction)
Q1(MB)   = Confirm: MB → MBᵥ                                -- Mission Brief confirmation component of Q
Q2(M)    = Select: ModeOptions → m                           -- Mode selection component of Q
           Q = Q1 × Q2 (composed in single Constitution interaction; Modify loop re-presents Q1 only)
MBᵥ    = Verified MissionBrief (user-confirmed)
m      = Mode ∈ {recommend, inquire}              -- lens recommendation vs. full inquiry spec
G      = Gather: MBᵥ → C                       -- targeted context acquisition (guided by MBᵥ)
C      = Context (information for perspective formulation)
Pᵦ     = Pre-confirmed base perspectives (user-supplied in U; auto-included in Pₛ)
{P₁...Pₙ}(C, MBᵥ) = AI-proposed novel perspectives (Pᵢ ∉ Pᵦ; |Pᵦ| + n ≥ 2 when m=inquire)
S      = Selection: {P₁...Pₙ} → Pₛ             -- extern (user choice; Pᵦ auto-included)
Pₛ     = Selected perspectives (Pₛ = Pᵦ ∪ sel({P₁...Pₙ}), |Pₛ| ≥ 2 when m=inquire; |Pₛ| ≥ 1 when m=recommend)
Z      = ZeroCandidate: {P₁...Pₙ} = ∅ ∧ Pᵦ = ∅   -- Phase 2 guard: no candidate frameworks to place; surfaced as a finding (Constitution); responses route to existing constructors (J_mb = modify(field) | Pᵦ' supply | Esc) — no FramedInquiry is emitted from this branch
LensEstablished = Pₛ where lens selection complete  -- the analysis object; Mode 1 packages it into Lᵣ, Mode 2 compiles it into IS
-- framed object: the lens (Mode 1) or the inquiry spec (Mode 2). frame supplies the OBJECT and hands it off; the ARRANGEMENT over multiple objects is NOT produced here — it is /conduct's arrangement functor, and only the trivial default rides in DefaultDirective --
ConductRef = an advisory reference to /conduct for non-trivial arrangement (the prothesis→hyphegesis advisory edge): when the order, independence, reconciliation, termination, or routing of the perspectives is non-trivial, /conduct arranges them — frame names the reference, does not arrange
DefaultDirective = the trivial-default arrangement the spec carries when /conduct is not engaged: ⟨independence: isolated, reconciliation: independent-then-conditional-dialogue, synthesis: horizon-fusion⟩  -- a relay-compiled directive (NOT an elicited topology); names what the substrate executes by default, with the dialogue criteria (Trigger Detection Criteria) and the synthesis contract (Synthesis template) as its content
PerspectiveDirective = the per-lens output contract the substrate briefs each perspective with: { epistemic_contribution, framework_analysis, horizon_limits, assessment } over MBᵥ + the verbatim question; carries no spawn/peer mechanics (substrate-owned)
ChannelNeed = per-perspective evidence-channel need (code/workspace | canonical external source | instrumentation | user-tacit)  -- a channel-level signal for substrate tool authorization, no concrete provider named (utility-agnostic)
IS     = InquirySpec { lens: Pₛ, per_perspective_directive: PerspectiveDirective, arrangement: ConductRef, directive: DefaultDirective, channel_need: ChannelNeed }  -- the compiled Mode 2 output; handed off, the substrate executes (frame does not)
CountTier ∈ {single_modifier, domain_narrowing, escalation_candidate}  -- advisory metadata (Mode 1); recorded in Lᵣ.tier for downstream reading
DownstreamUse ∈ {protocol_route, scope_directive, context_binding}  -- protocol_route: lens names a downstream protocol invocation; scope_directive: lens narrows downstream resolution domain; context_binding: lens enriches downstream protocol's pre-execution context
Lᵣ     = RecommendedLens { handoff: LensEstablished, tier: CountTier, downstream_use: DownstreamUse }  -- the compiled Mode 1 output
FramedInquiry = inj₁(Lᵣ where m = recommend ∧ LensEstablished) ⊕
                inj₂(IS where m = inquire ∧ LensEstablished)
        -- coproduct discriminated by m: inj₁ Mode 1 → Lᵣ (lens recommendation handoff); inj₂ Mode 2 → IS (full inquiry-spec handoff). BOTH are COMPILED outputs handed off to the substrate; NEITHER is executed by frame. Advisory-edge consumers (Syneidesis, Aitesis, Analogia) branch on the inj₁/inj₂ tag — inj₁(Lᵣ) is a context-binding lens handoff, inj₂(IS) is a full inquiry spec the substrate executes.
J_mb   = MissionBriefRouting ∈ {confirm, modify(field)}  -- Phase 0 routing decision

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
Phase 2:  (C, MBᵥ) → Sc({P₁...Pₙ}(C, MBᵥ)) → Stop → Pₛ → LensEstablished  -- perspective selection [Tool]; on Z (zero candidates) surface the finding → Stop → route per LOOP (modify | Pᵦ' supply | Esc)
Phase 3:  LensEstablished → [m=recommend: characterize(Pₛ) → Lᵣ | m=inquire: compile(Pₛ ⊕ ConductRef ⊕ DefaultDirective) → IS] → converge(transformation trace) → handoff(FramedInquiry) → STOP  -- compile the framed object + emit it as the terminal relay, then halt (no gate, no dispatch; substrate executes downstream)

── LOOP ──
After Phase 0 (Mission Brief + Mode Selection):
  (MBᵥ, m) = Q result:
    m = recommend → Phase 1 → Phase 2 → LensEstablished → Phase 3 (characterize → Lᵣ → handoff) → terminate
    m = inquire   → Phase 1 → Phase 2 → LensEstablished → Phase 3 (compile → IS → handoff) → terminate
  J_mb = confirm       → proceed to Phase 1 with (MBᵥ, m)
  J_mb = modify(field) → re-present Q1(MB') → Stop → MBᵥ (m retained from initial selection)
  -- Esc key → terminate (nothing compiled yet)

During Phase 2 (Perspective Placement):
  Z ({P₁...Pₙ} = ∅ ∧ Pᵦ = ∅) → present the zero-result finding with reasoning → Stop:
    modify(field) → re-present Q1(MB') → Stop → MBᵥ → re-enter Phase 1 (re-gather) → Phase 2
    Pᵦ' supplied  → Pᵦ := Pᵦ' (auto-included) → re-present Sc with ≥ 1 novel proposal
    Esc           → terminate (nothing compiled)
  -- no FramedInquiry is emitted from Z; the result equation is unchanged (FramedInquiry requires LensEstablished)

During Phase 3 (Compile & Handoff):
  m = recommend → characterize(Pₛ) = classify Pₛ by count tier (advisory metadata; all tiers terminate Mode 1, no branching):
      Pₛ.count = 1                                   → tier = single_modifier        (downstream_use = context_binding)
      Pₛ.count ≥ 2 with cohesive subdomain           → tier = domain_narrowing       (downstream_use = scope_directive)
      Pₛ.count ≥ 2 with heterogeneous tension        → tier = escalation_candidate   (downstream_use = scope_directive; user may re-invoke /frame with m=inquire for a full inquiry spec)
    Record tier in Lᵣ.tier; emit FramedInquiry = inj₁(Lᵣ), hand off, terminate. (DefaultDirective and ConductRef are absent — Mode 1 ships the lens alone.)
  m = inquire → compile(Pₛ ⊕ ConductRef ⊕ DefaultDirective) = assemble the InquirySpec: the lens, the per-perspective output directive, the channel-need annotation, the /conduct arrangement reference (for non-trivial arrangement), and the default isolation/dialogue/synthesis directive (trivial-default arrangement). No topology is elicited — arrangement is /conduct's functor. Emit FramedInquiry = inj₂(IS), hand off to the substrate, terminate.
  -- handoff is the completeness boundary: frame records the handoff and halts. The substrate — an agent team, a dynamic-workflow, isolated subagents, plan-mode, or the main session — executes the spec. Esc key → tool-level termination (nothing compiled yet).

Continue until convergence: FramedInquiry handed off (Mode 1 lens recommendation or Mode 2 inquiry spec), or user Esc key.

Convergence evidence: At handoff, present the transformation trace — for each p ∈ Pₛ, show (FrameworkAbsent → p's contribution as a lens of the framed object). Mode 2 additionally surfaces the inquiry spec's directive (the default arrangement it carries) and the /conduct arrangement reference (for anything non-trivial) as relay text. Convergence is demonstrated, not asserted.

── BOUNDARY ──
Q(MB, M) (confirm+select) = extern: Mission Brief confirmation + mode selection boundary
G (observe)  = purpose: targeted context acquisition (guided by MBᵥ)
S (select)  = extern: user choice boundary
characterize = purpose: count-tier classification of Pₛ (relay; Mode 1)
compile      = purpose: inquiry-spec compilation (relay; no user judgment beyond lens selection — entropy→0 once Pₛ is fixed)

── TOOL GROUNDING ──
-- Realization: Constitution → TextPresent+Stop; Extension → TextPresent+Proceed
Phase 0 MB_from_arg (extension)  → TextPresent+Proceed (when user_invoked ∧ explicit_arg(U); Q1=confirm + m=ai_recommended_mode defaults; Phase 2 Sc remains constitution as downstream correction opportunity)
Phase 0 Qc (constitution)        → present (combined: Q1=Mission Brief confirmation, Q2=mode selection; when no explicit_arg; Esc key → loop termination at LOOP level)
G (observe)                      → Read, Glob, Grep (meta-scope context acquisition guided by MBᵥ to identify relevant perspectives; not passed to the substrate — each perspective independently collects object-scope evidence through its own lens at execution time)
Sc (constitution)                → present (mandatory; multiSelect: true; lens selection is epistemic choice; Esc key → loop termination at LOOP level)
Phase 2 Z zero_result (constitution) → present (zero-candidate finding + reasoning; responses route to existing constructors — modify(field) | Pᵦ' supply | Esc; no new answer type)
Phase 3 characterize (sense)     → Internal operation (perspective count-tier classification → Lᵣ { handoff, tier, downstream_use } packaging emitted as inj₁ FramedInquiry; Mode 1)
Phase 3 compile (sense)          → Internal operation (assemble the InquirySpec: lens ⊕ per-perspective directive ⊕ channel-need ⊕ /conduct arrangement reference ⊕ default isolation/dialogue/synthesis directive; relay — no external tool, no user judgment beyond Pₛ; Mode 2)
Phase 3 converge (extension)     → TextPresent+Proceed (convergence evidence trace: per-perspective contribution; Mode 2 additionally surfaces the spec directive + /conduct arrangement reference)
Phase 3 handoff (extension)      → TextPresent+STOP (emit the compiled FramedInquiry — lens recommendation or inquiry spec — as the terminal relay, then halt; the substrate executes downstream. frame itself does NOT spawn or call Agent — when the substrate is the main session (the default), the post-frame session consumes the spec; when a delegated executor is elected, that dispatch is the substrate's action, not frame's morphism)
Λ (track)                        → TaskCreate/TaskUpdate (problem-to-solve + framing shifts durable; per-phase bookkeeping stays in session)
-- Substrate realization: the inquiry spec is substrate-invariant; an agent-team, a dynamic-workflow, isolated subagents, plan-mode, and the main session are PEER substrates that may execute it — the substrate (or /conduct at arrangement time) owns the concrete execution tools, not frame. frame neither names nor binds a substrate — it surfaces the per-perspective channel-need and the /conduct arrangement reference as handoff annotations. Topology→substrate feasibility (e.g. a dialectical arrangement requires persistent addressable peers; an independent-aggregate ⨾ adversarial pass over a static aggregate is realizable by a stateless pipeline) is the substrate's to enforce — surfaced by /conduct at arrangement time and by the substrate at execution time, never bound by frame. The (constitution)/(extension) markers above are the authoritative axis.

── CATEGORICAL NOTE ──
frame supplies analysis OBJECTS (lenses); /conduct is the ARRANGEMENT FUNCTOR over objects, generic in object type (objects = perspectives → multi-lens inquiry arrangement; objects = protocols → protocol-chain arrangement — the same functor, the same topology algebra). frame's framed object is an object (Mode 1 lens) or an object-plus-default-directive (Mode 2 spec), never an arrangement: the arrangement is the functor's action, attributed to /conduct. The trivial-default arrangement frame retains (DefaultDirective) is the degenerate case the functor need not be invoked for.

── MODE STATE ──
Λ = { phase: Phase, mode: Mode, mission_brief: Option(MBᵥ), perspectives: Option(Pₛ), inquiry_spec: Option(IS), recommended_lens: Option(Lᵣ), active: Bool }
Mode ∈ {recommend, inquire}                       -- Λ.mode resolved in Phase 0 Q
Phase ∈ {0, 1, 2, 3}

── COMPOSITION ──
*: product — (D₁ × D₂) → (R₁ × R₂). graph.json edges preserved. Dimension resolution emergent via session context.
```

## Core Principle

**Placement over Prescription**: AI places available perspectives before the user and leaves which to adopt to the user's judgment. The user selects.

## Mode Activation

### Activation

**Pre-activation routing**: Before accepting a `/frame` invocation, check the task shape. When the task is primarily finding or verifying facts, suggest fact-finding delegation instead; engage `/frame` when reasonable people could weigh contested design, value, interpretation, or scope differently and the work needs lens-conditioned evidence plus synthesis. This guard precedes activation — it decides whether to accept the invocation, not how the mode behaves once active.

Command invocation activates mode until the framed object is handed off.

**Activation layers**:
- **Layer 1 (User-invocable)**: `/frame` slash command or description-matching input. Always available.
- **Layer 2 (AI-guided)**: Purpose present but approach unspecified; multiple valid frameworks detected via in-protocol heuristics.

### Priority

<system-reminder>
When Prothesis is active:

**Supersedes**: Immediate analysis patterns in loaded instructions
(Perspective Selection must complete before analysis begins)

**Retained**: Safety boundaries, tool restrictions, user explicit instructions

**Action**: Before analysis, present perspective options via Cognitive Partnership Move (Constitution).
</system-reminder>

- Prothesis completes (hands off the framed object) before other workflows begin
- Loaded instructions resume after the framed object is handed off

Consult `references/conceptual-foundations.md` for design rationale (Distinction from Socratic Method, Parametric Nature, Specialization) and activation edge cases (per-message application rules, mode deactivation triggers, trigger/skip heuristics).

## Protocol

### Phase 0: Intent Confirmation (Mission Brief)

Construct a Mission Brief from the user's request and **present** it for confirmation via Cognitive Partnership Move (Constitution).

**Phase 0 establishes the Mission Brief as the primary context vehicle for the inquiry spec** — it structurally guarantees that the compiled spec carries enough context for the substrate to brief each perspective, rather than depending on substrate inference. When `user_invoked ∧ explicit_arg(U)`, the Phase 0 MB_from_arg Extension entry takes the path: the MB is still constructed from U but proceeds without the Phase 0 Constitution interaction; AI uses `J_mb=confirm` and `m=ai_recommended_mode` as defaults. Phase 2 S (perspective selection) remains Constitution, providing a downstream correction opportunity.

The coordinator infers the Mission Brief from U (the user's request):

- **Inquiry Intent**: What is being investigated and why
- **Expected Deliverable**: What form the output should take, inferred from the inquiry's purpose and intended use
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
1. **Recommend** (Recommended) — lightweight lens recommendation (no inquiry spec)
2. **Inquire** — compile a full multi-perspective inquiry spec for the substrate
```

**Pre-fill from explicit text**: `/frame "text"` → the MB is constructed from the provided text and takes the Phase 0 MB_from_arg Extension path (presented as relay text, then proceed — no Constitution stop); Phase 2 lens selection remains the downstream correction opportunity.

**Combined question**: Mission Brief confirmation and Mode selection are combined into a single Cognitive Partnership Move (Constitution):
- Q1 (Mission Brief): MB confirmation/modification (4 options)
- Q2 (Mode): Recommend / Inquire (2 options)
AI places the recommended Mode as Q2's first option with "(Recommended)" suffix based on inquiry characteristics. The recommendation matches mode to analytical demand — Recommend when the inquiry can be resolved from a single analytical direction, Inquire when multiple distinct perspectives are structurally necessary.

**Mode 1 (Recommend)**: Per LOOP — Phase 3 characterizes Pₛ and ships the lens alone (`inj₁(Lᵣ)`). No inquiry spec, no arrangement directive. Mode 1 produces a partial resolution: the lens is established (`FrameworkAbsent` is structurally addressed at the framing layer) but downstream protocols apply the lens to complete domain-specific resolution.

**Mode 2 (Inquire)**: Per LOOP — Phase 0 through Phase 3, where Phase 3 compiles the full inquiry spec (`inj₂(IS)`) and hands it off. frame does not execute the inquiry.

**Distinction from other protocols**: Phase 0 operates at the operational layer (structuring context the spec carries), not the epistemic layer. Phase 0 packages confirmed intent into a structured vehicle for substrate consumption — a prerequisite for a quality spec, not a substitute for upstream intent resolution.

### Phase 1: Context Gathering

Gather context sufficient to formulate distinct perspectives, **guided by MBᵥ**.

MBᵥ.inquiry_intent and MBᵥ.scope_constraint direct which files, systems, and domains to investigate. Gathering intensity scales with MBᵥ complexity: narrow-scope inquiries with clear domain boundaries warrant targeted collection; broad or cross-domain inquiries warrant deeper investigation. This context guides perspective identification (meta-scope) — it is not the object-scope evidence each perspective will collect at execution time. Proceed to Phase 2 only after context is established.

### Phase 2: Prothesis (Perspective Placement)

After context gathering (Phase 1), **present** perspectives via Cognitive Partnership Move (Constitution) with `multiSelect: true`.

**Cross-session enrichment**: Prior framing experiences accumulated in Anamnesis's hypomnesis store (session recall indices written by the SessionEnd/PreCompact hook) guide Phase 2 perspective formulation bidirectionally — previously effective analytical lenses for similar domains provide starting hypotheses (exploitation), while prior coverage gaps (unaddressed horizon limits) signal domains where novel perspectives should be prioritized (exploration). In parallel, when **`/recollect`** has been invoked this session, the recalled context surfaces prior framework or perspective preferences, biasing the Phase 2 framework candidate set toward lenses the user has already found productive in this line of work. This is a heuristic input that may bias detection toward previously observed patterns; constitutive judgment remains with the user.

Constitution presentation yields turn for user response.

Each perspective is an **individual option**. Keep each option a single perspective so the user composes any combination directly. The user selects one or more perspectives directly.

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
- **Commensurability minimum**: At least one shared referent, standard, or vocabulary must exist between perspectives to enable downstream synthesis
- **Deliverable-aligned**: Perspectives should produce assessments relevant to MBᵥ.expected_deliverable
- **Critical viewpoint** (when applicable): Include when genuine alternatives exist; omit when perspectives legitimately converge
- Specific enough to guide analysis (not "general expert")
- Named by **discipline or framework**, not persona

Optional dimension naming (apply when initial generation seems redundant):
- Identify epistemic axes relevant to this inquiry
- Dimensions remain revisable during perspective generation

During perspective formulation, note whether each candidate lens depends on evidence from code/workspace, canonical external sources, instrumentation, or user-tacit context. This is recorded as the spec's `channel_need` — a channel-level signal for later substrate tool authorization; it does not select or name a concrete provider.

**Pre-suggested perspective handling**: When the user supplies perspectives in U (e.g., naming specific frameworks or roles), treat these as **pre-confirmed base perspectives** (Pᵦ):

- Pᵦ are **auto-included** in Pₛ; present only the AI-proposed novel perspectives as selectable options
- Constitution interaction presents only AI-proposed novel perspectives ({P₁...Pₙ} where Pᵢ ∉ Pᵦ)
- State Pᵦ in the question text as context (e.g., "Base: [Pᵦ names]. Which additional lens(es)?")
- AI must propose at least 1 novel perspective when Pᵦ ≠ ∅ — re-presenting known perspectives as options saturates the finite option space and structurally conceals unknown unknowns

**Mode 1 handling**: When Recommend was selected in Phase 0, Phase 2 selects the lens and Phase 3 characterizes it. After Pₛ selection, Phase 3 outputs the lens with brief characterization (per LOOP `characterize`) and notes the escalation path: "For a full multi-perspective inquiry spec, re-invoke `/frame` with Inquire — Pₛ will transfer as Pᵦ."

### Phase 3: Compile & Handoff

Lens selection (Phase 2) established *which* perspectives. Phase 3 compiles the framed object and hands it off — frame does not execute.

**Mode 1 (Recommend)** — characterize and ship the lens. Classify Pₛ by count tier (per LOOP), record it in `Lᵣ.tier`, present the transformation trace, and hand off `inj₁(Lᵣ)`. No arrangement directive, no inquiry spec.

**Mode 2 (Inquire)** — compile the inquiry spec `IS` and hand it off. The spec is the lens plus a default arrangement directive plus a reference to `/conduct` for anything non-trivial. No topology is elicited here: arranging multiple perspectives — their order, independence, reconciliation, termination, and routing — is `/conduct`'s arrangement functor (the `prothesis→hyphegesis` advisory edge). frame retains only the trivial default below as a zero-gate fast-path.

The compiled `IS` carries:

1. **Lens** (`Pₛ`): the selected perspectives.
2. **Per-perspective directive** — the output contract the substrate briefs each perspective with (over MBᵥ + the verbatim question):

   ```
   You are a **[Perspective] Expert**. Analyze from this epistemic standpoint.

   **Mission Brief**: Intent / Deliverable / Scope (constrain analysis to this boundary) / Tool authorizations (channel_need; "None supplied" default)
   **Orientation** (from Mission Brief): MBᵥ-derived key terms, relevant directories, or domain anchors — minimal orientation
   **Question**: {original question verbatim}

   Provide:
   1. **Epistemic Contribution**: What this lens uniquely reveals (2-3 sentences)
   2. **Framework Analysis**: Domain-specific concepts, terminology, reasoning
   3. **Horizon Limits**: What this perspective cannot see or undervalues
   4. **Assessment**: Direct answer from this viewpoint, aligned with the expected deliverable

   Output grounding: every table cell, list item, and comparison point must contain
   substantive content — real data, file paths, specific scenarios, or quantified evidence.
   ```

3. **`/conduct` arrangement reference** (`ConductRef`): when the perspectives' arrangement is non-trivial, the substrate routes to `/conduct` to design the topology. This is an advisory handoff, not a hard dependency.
4. **Default arrangement directive** (`DefaultDirective`) — the trivial default the substrate executes when `/conduct` is not engaged:
   - **independence: isolated** — each perspective is analyzed in an isolated context, forming its assessment without seeing the others until reconciliation (independence-before-contamination; see `references/isolation-rationale.md`). `shared` independence is a non-trivial arrangement — route to `/conduct`, which records the relaxed-isolation degradation.
   - **reconciliation: independent-then-conditional-dialogue** — perspectives analyze independently; the substrate then checks results for the dialogue triggers below and reconciles only the triggered tensions. Unconditional debate, adversarial refutation, or any composite is a non-trivial arrangement — route to `/conduct`.
   - **synthesis: horizon-fusion** — the substrate integrates the perspective results (and any dialogue outcomes) into a single situated assessment per the synthesis contract below: integration of what the perspectives provided, not new analysis.
5. **`channel_need`** — the per-perspective evidence-channel signal for substrate tool authorization (utility-agnostic; no provider named).

**Dialogue triggers** (the directive's reconciliation criteria — the substrate detects these in the perspective results and reconciles only the triggered tensions, citing evidence per trigger):

| Trigger | Heuristic | Evidence Required |
|---------|-----------|-------------------|
| **Contradiction** | perspective_i.assessment ≠ perspective_j.assessment on a shared referent | Which perspectives, which claims, on what topic |
| **Horizon Intersection** | perspective_i.horizon_limits ∩ perspective_j.epistemic_contribution ≠ ∅ | Which horizon limit overlaps which contribution |
| **Uncorroborated High-Stakes** | ∃ claim : stakes(claim) = high ∧ no other perspective confirms it | The claim, the perspective, why high-stakes |
| **Emergent** | Coherence tension outside the named types (e.g., non-overlapping coverage masking disagreement) | The tension, involved perspectives, why named triggers do not capture it |

**Synthesis contract** (the directive's synthesis shape — what the substrate produces, not what frame executes):

```markdown
## Framed Analysis
### Bottom-line
[The single decision-relevant takeaway in 1-2 sentences, surfaced first]
### Integrated Assessment
[The full synthesized answer with attribution to contributing perspectives; distinguish isolated-inquiry findings from dialogue refinement]
### Convergence (Shared Horizon)
[Where perspectives agree — robust finding; note agreement strength where dialogue occurred, else "independent convergence"]
### Divergence (Horizon Conflicts)
[Where they disagree — different values, evidence standards, or scope; dialogue resolution status per tension]
### Synthesis Basis
[Per claim: source perspective(s), evidence type, and whether the claim combines multiple sources; claims from synthesis (horizon fusion beyond direct perspective output) marked as such]
```

**Handoff**: present the convergence-evidence trace as relay text, then hand off `FramedInquiry` and **stop**. This is the completeness boundary — frame records the handoff and halts; the substrate (an agent team, a dynamic-workflow, isolated subagents, plan-mode, or the main session) executes the spec. Substrate feasibility for the spec's arrangement is the substrate's to enforce, surfaced as a handoff annotation, never bound by frame.

**Revision threshold** (directive maintenance): When accumulated Emergent trigger detections across 3+ sessions cluster around a recognizable pattern outside the named types {Contradiction, Horizon Intersection, Uncorroborated High-Stakes}, the dialogue-trigger criteria warrant promotion to a new named trigger type. When accumulated false-positive triggers across 3+ sessions cluster around a specific named type, that type's heuristic warrants revision or demotion to Emergent.

## Rules

1. **Mission Brief confirmation**: Present the Mission Brief for confirmation via Cognitive Partnership Move (Constitution) before context gathering (Phase 0 → Phase 1). When `user_invoked ∧ explicit_arg(U)` (e.g. `/frame "text"`), the Phase 0 MB_from_arg Extension entry applies per TOOL GROUNDING (the authoritative axis): the MB constructed from the provided text is presented as relay text and proceeds with `J_mb=confirm` + `m=ai_recommended_mode` defaults — Phase 2 lens selection remains the downstream Constitution correction opportunity.
2. **Recognition over Recall**: Present structured options via Cognitive Partnership Move (Constitution) — structured content reaches the user with a response opportunity; Constitution interaction requires turn yield before proceeding.
3. **Object supplier, not arranger or executor (core invariant)**: frame yields the analysis object (the lens) and — in Mode 2 — a default arrangement directive, references `/conduct` for non-trivial arrangement, hands the framed object off to the substrate, and stops. frame does NOT elicit a topology (arrangement is `/conduct`'s functor) and does NOT execute the inquiry (spawn, isolated analysis, reconcile, synthesize belong to the substrate, of which the main session is one realization). The trivial-default arrangement (`DefaultDirective`: isolated, independent-then-conditional-dialogue, horizon-fusion) is the only arrangement frame compiles directly; any departure from it routes to `/conduct`. This is the Epistemic Completeness Boundary: frame's epistemic contribution is supplying and compiling the object; execution and non-trivial arrangement are delegated.
4. **Independence-before-contamination (compiled directive)**: The `DefaultDirective` specifies `independence: isolated` — each perspective forms its assessment without seeing the others until reconciliation. frame compiles this requirement into the spec; the substrate enforces it. `shared` independence is a non-trivial arrangement that routes to `/conduct` (which records the relaxed-isolation degradation). Mode 1 is exempt — it ships a lens, no execution directive.
5. **Synthesis directive (integration, not new analysis)**: The `DefaultDirective`'s synthesis contract instructs the substrate that integration derives only from what perspectives provided — horizon fusion, not new analysis — and that synthesis claims are marked as such in the Synthesis Basis. frame compiles the contract; the substrate executes it.
6. **Verbatim transmission**: The per-perspective directive carries the original question unchanged; the substrate passes it to each perspective verbatim.
7. **Context-Question Separation**: Output all analysis, evidence, and rationale as text before presenting via Cognitive Partnership Move (Constitution). The question contains only the essential question; options contain only option-specific differential implications. All analytical context belongs in the pre-gate text.
8. **Convergence evidence**: Present the transformation trace before handoff (Mode 1 lens recommendation or Mode 2 inquiry spec); per-perspective contribution is the required evidence. The trace is relay (presented, then proceed) — there is no post-handoff sufficiency gate, because frame does not execute and has nothing to iterate.
9. **Zero-result surfacing**: If Phase 2 generation yields no candidate frameworks (Z: {P₁...Pₙ} = ∅ ∧ Pᵦ = ∅), present the finding with reasoning. Responses route to existing paths — modify the Mission Brief (re-present Q1, re-gather), supply perspectives directly (enter as Pᵦ), or exit (terminate, nothing compiled); no FramedInquiry is emitted from this branch.
10. **Option-set relay test (Extension classification)**: If AI analysis converges to a single dominant option (option-level entropy→0 — Extension mode of the Cognitive Partnership Move), present the finding directly. Each Constitution option (the Phase 2 lens options) must be genuinely viable under different user value weightings. Options sharing a downstream trajectory collapse to one; options lacking an on-axis trajectory surface as free-response pathways rather than peer options.
11. **Gate integrity**: The defined option set is presented intact — injection, deletion, and substitution each violate this invariant. Type-preserving materialization (specializing a generic option while preserving the TYPES coproduct) is distinct from mutation.
12. **Plain emit discipline**: User-facing emit (Phase 2 surfacing prose, convergence traces, gate options, and any text shown to the user) uses everyday language to reduce the user's cognitive load — every emit token should carry decision-relevant meaning, not project-internal overhead. SKILL.md formal-block vocabulary — variable names with subscripts, Greek-rooted terms in narrative, formal type labels inline, and code-style backtick tokens — stays in the formal block. What the user reads is the action, observation, or question in their idiom.
13. **Round-local salience bundling**: Each user-facing round bundles the current judgment, its nearest evidence, and the differential implication that matters for the next move. Keep adjacent material together so the user can recognize the decision without context-switching; defer background, distant context, and unrelated findings to pre-gate text or convergence traces.

## Adversarial Guards

- **arranger-creep**: frame slides back into eliciting a deliberation topology (an axis-by-axis arrangement of the perspectives) instead of routing non-trivial arrangement to `/conduct`. Guard: frame compiles only the trivial-default directive as a zero-gate fast-path; any non-trivial arrangement (shared independence, unconditional debate, adversarial refutation, composites, dependency ordering) routes to `/conduct`. Eliciting a topology inside frame is the failure.
- **executor-creep**: frame begins executing the inquiry — creating a team, spawning perspectives, awaiting completion, synthesizing — instead of handing the spec off. Guard: frame stops at handoff; execution belongs to the substrate (Epistemic Completeness Boundary). The deliverable is the compiled spec, not a synthesis.
- **lens-redundancy**: proposed perspectives collapse to variations of one framing, so the option set offers no productive tension. Guard: each lens must offer a distinct epistemic framework; surface the redundancy as an epistemic signal and re-propose with genuine tension rather than padding the option space.

## Known Limitations

**Substrate execution out of scope**: The inquiry spec's realization — isolation fidelity, dialogue mechanics, synthesis quality — depends on the executing substrate's capabilities. frame surfaces the per-perspective channel-need and the `/conduct` arrangement reference as handoff annotations, but does not enforce realizability; when a substrate cannot realize the spec's arrangement (e.g. plan-mode cannot host a dialectical arrangement with no persistent addressable peers), the substrate — or `/conduct` at arrangement time — declares the degradation. This is a non-epistemic substrate boundary: frame's contract ends at the handoff.

**Mode 1 partial resolution**: Mode 1 ships a lens, not a resolved inquiry. `FrameworkAbsent` is addressed at the framing layer, but domain-specific resolution requires a downstream protocol or the user applying the lens. The escalation path to Mode 2 (a full inquiry spec) is the user's re-invocation.
